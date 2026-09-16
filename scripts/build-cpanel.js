const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const STANDALONE_DIR = path.join(ROOT_DIR, '.next', 'standalone');
const STATIC_DIR = path.join(ROOT_DIR, '.next', 'static');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const ROOT_NODE_MODULES = path.join(ROOT_DIR, 'node_modules');
const STAGING_DIR = path.join(ROOT_DIR, 'dist_cpanel');
const ZIP_OUTPUT = path.join(ROOT_DIR, 'tikovia-cpanel-deploy.zip');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

async function buildDeployPackage() {
  console.log('🚀 Đang chuẩn bị gói triển khai cPanel hoàn chỉnh (Full Production Modules + LiteSpeed Fallback)...');

  // 1. Clear previous staging
  if (fs.existsSync(STAGING_DIR)) {
    console.log('🧹 Xóa thư mục tạm dist_cpanel cũ...');
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  }
  if (fs.existsSync(ZIP_OUTPUT)) {
    console.log('🧹 Xóa file zip cũ...');
    fs.rmSync(ZIP_OUTPUT, { force: true });
  }

  fs.mkdirSync(STAGING_DIR, { recursive: true });

  // 2. Copy standalone base directory
  console.log('📦 Sao chép cấu trúc standalone...');
  copyRecursiveSync(STANDALONE_DIR, STAGING_DIR);

  // 3. Ensure COMPLETE next module from root node_modules is copied
  console.log('📦 Sao chép đầy đủ thư mục next từ root node_modules...');
  const targetNextModule = path.join(STAGING_DIR, 'node_modules', 'next');
  copyRecursiveSync(path.join(ROOT_NODE_MODULES, 'next'), targetNextModule);

  // 4. Ensure other essential dependencies are complete
  const extraModules = ['react', 'react-dom', 'styled-jsx', 'caniuse-lite', 'nanoid', 'picocolors', 'source-map-js', '@next', '@swc'];
  for (const mod of extraModules) {
    const srcMod = path.join(ROOT_NODE_MODULES, mod);
    if (fs.existsSync(srcMod)) {
      copyRecursiveSync(srcMod, path.join(STAGING_DIR, 'node_modules', mod));
    }
  }

  // 5. Copy .next/static into dist_cpanel/.next/static
  console.log('🎨 Sao chép .next/static...');
  const targetStaticDir = path.join(STAGING_DIR, '.next', 'static');
  copyRecursiveSync(STATIC_DIR, targetStaticDir);

  // 6. Copy full public directory (including uploads and assets)
  console.log('🖼️ Sao chép thư mục public (assets, uploads, icons)...');
  const targetPublicDir = path.join(STAGING_DIR, 'public');
  copyRecursiveSync(PUBLIC_DIR, targetPublicDir);

  // 7. Ensure src/data/site-content.json is in place
  console.log('📄 Kiểm tra dữ liệu JSON src/data/site-content.json...');
  const targetDataDir = path.join(STAGING_DIR, 'src', 'data');
  if (!fs.existsSync(targetDataDir)) {
    fs.mkdirSync(targetDataDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(ROOT_DIR, 'src', 'data', 'site-content.json'),
    path.join(targetDataDir, 'site-content.json')
  );

  // 8. Write universal server.js & app.js with Bulletproof Fallback Resolver
  console.log('⚡ Tạo server.js & app.js với Bulletproof Fallback Resolver...');
  const serverJsContent = `const http = require('http');
const path = require('path');
const fs = require('fs');
const Module = require('module');

process.env.NODE_ENV = 'production';
const appDir = path.resolve(__dirname);
process.chdir(appDir);

const localNodeModules = path.join(appDir, 'node_modules');

// Hook Module._resolveFilename để LiteSpeed lsnode.js luôn tìm thấy 100% module cục bộ
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('.') || request.startsWith('/') || request.startsWith('\\\\')) {
    return originalResolveFilename.call(this, request, parent, isMain, options);
  }
  try {
    const parentPaths = (parent && parent.paths) ? [...parent.paths] : [];
    if (!parentPaths.includes(localNodeModules)) {
      parentPaths.unshift(localNodeModules);
    }
    return originalResolveFilename.call(this, request, { ...(parent || {}), paths: parentPaths }, isMain, options);
  } catch (err) {
    try {
      const directPath = path.join(localNodeModules, request);
      if (fs.existsSync(directPath)) {
        if (fs.statSync(directPath).isDirectory()) {
          const pkgJson = path.join(directPath, 'package.json');
          if (fs.existsSync(pkgJson)) {
            const main = JSON.parse(fs.readFileSync(pkgJson, 'utf8')).main || 'index.js';
            return path.join(directPath, main);
          }
          const indexJs = path.join(directPath, 'index.js');
          if (fs.existsSync(indexJs)) return indexJs;
        } else {
          return directPath;
        }
      }
      if (fs.existsSync(directPath + '.js')) {
        return directPath + '.js';
      }
    } catch (e) {}
    return originalResolveFilename.call(this, request, parent, isMain, options);
  }
};

// Nạp cấu hình Next.js
let nextConfig = {};
try {
  const reqFiles = JSON.parse(
    fs.readFileSync(path.join(appDir, '.next', 'required-server-files.json'), 'utf8')
  );
  nextConfig = reqFiles.config || {};
} catch (e) {
  console.error('Warning: could not read required-server-files.json', e);
}

process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig);

// Khởi tạo NextServer
const NextServer = require('next/dist/server/next-server').default;

const nextServer = new NextServer({
  hostname: 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  dir: appDir,
  dev: false,
  customServer: false,
  conf: nextConfig,
});

const handler = nextServer.getRequestHandler();

const server = http.createServer((req, res) => {
  handler(req, res).catch((err) => {
    console.error('Request error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(\`Tikovia Theme Showcase running on port/socket: \${port} (PID: \${process.pid})\`);
});
`;
  fs.writeFileSync(path.join(STAGING_DIR, 'server.js'), serverJsContent, 'utf-8');
  fs.writeFileSync(path.join(STAGING_DIR, 'app.js'), serverJsContent, 'utf-8');

  // 9. Write minimal package.json
  const cpanelPackageJson = {
    name: 'themeshowcase',
    version: '0.1.0',
    private: true,
    scripts: {
      start: 'node server.js',
    },
  };
  fs.writeFileSync(
    path.join(STAGING_DIR, 'package.json'),
    JSON.stringify(cpanelPackageJson, null, 2),
    'utf-8'
  );

  // 10. Write exact .htaccess for cPanel Node.js App
  console.log('⚡ Tạo file .htaccess chuẩn cPanel Passenger...');
  const htaccessContent = `# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/kacxrgcz/themes.tikovia.vn"
PassengerBaseURI "/"
PassengerNodejs "/home/kacxrgcz/nodevenv/themes.tikovia.vn/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END

# TỐI ƯU PROCESS CHO PHUSION PASSENGER
<IfModule mod_passenger.c>
    PassengerMinInstances 1
    PassengerMaxInstances 1
    PassengerPoolIdleTime 300
    PassengerMaxRequestQueueSize 100
</IfModule>
`;
  fs.writeFileSync(path.join(STAGING_DIR, '.htaccess'), htaccessContent, 'utf-8');

  // 11. Create ZIP archive
  console.log('🗜️ Đang nén thành file tikovia-cpanel-deploy.zip qua PowerShell...');
  const psCommand = `powershell -Command "Compress-Archive -Path '${STAGING_DIR}\\*', '${STAGING_DIR}\\.htaccess' -DestinationPath '${ZIP_OUTPUT}' -CompressionLevel Optimal -Force"`;
  execSync(psCommand, { stdio: 'inherit' });

  const stats = fs.statSync(ZIP_OUTPUT);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Nén thành công! Kích thước file zip: ${sizeMB} MB`);
  console.log(`📁 Đường dẫn file zip: ${ZIP_OUTPUT}`);

  console.log('🎉 Hoàn tất đóng gói!');
}

buildDeployPackage().catch((err) => {
  console.error('❌ Lỗi đóng gói:', err);
  process.exit(1);
});
