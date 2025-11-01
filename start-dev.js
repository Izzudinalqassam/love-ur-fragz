#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查端口是否被占用
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();

    server.listen(port, () => {
      server.once('close', () => {
        resolve(true); // 端口可用
      });
      server.close();
    });

    server.on('error', () => {
      resolve(false); // 端口被占用
    });
  });
}

async function startDev() {
  log('cyan', '🚀 Starting LuxScents Development Environment...\n');

  // 检查端口
  const frontendPort = await checkPort(5173);
  const backendPort = await checkPort(8080);

  if (!frontendPort) {
    log('red', '❌ Frontend port 5173 is already in use');
    log('yellow', 'Please stop the process using that port or change the port');
    process.exit(1);
  }

  if (!backendPort) {
    log('red', '❌ Backend port 8080 is already in use');
    log('yellow', 'Please stop the process using that port or change the port');
    process.exit(1);
  }

  // 检查必要文件
  if (!fs.existsSync('frontend/package.json')) {
    log('red', '❌ Frontend package.json not found');
    process.exit(1);
  }

  if (!fs.existsSync('backend/go.mod')) {
    log('red', '❌ Backend go.mod not found');
    process.exit(1);
  }

  log('green', '✅ Ports are available');
  log('green', '✅ Project structure is valid\n');

  // 启动frontend
  log('blue', '📦 Starting Frontend (Vite)...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: 'frontend',
    stdio: 'pipe'
  });

  // 启动backend
  log('blue', '🔧 Starting Backend (Go)...');
  const backend = spawn('go', ['run', 'cmd/server/main.go', 'cmd/server/seed.go'], {
    cwd: 'backend',
    stdio: 'pipe'
  });

  let frontendReady = false;
  let backendReady = false;

  // 处理frontend输出
  frontend.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`${colors.cyan}[FRONTEND] ${colors.reset}${output}`);

    if (output.includes('Local:') && !frontendReady) {
      frontendReady = true;
      log('green', '✅ Frontend is ready at http://localhost:5173');
      checkBothReady();
    }
  });

  frontend.stderr.on('data', (data) => {
    process.stderr.write(`${colors.red}[FRONTEND ERROR] ${colors.reset}${data.toString()}`);
  });

  // 处理backend输出
  backend.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`${colors.magenta}[BACKEND] ${colors.reset}${output}`);

    if (output.includes('Server starting on port 8080') && !backendReady) {
      backendReady = true;
      log('green', '✅ Backend is ready at http://localhost:8080');
      checkBothReady();
    }
  });

  backend.stderr.on('data', (data) => {
    process.stderr.write(`${colors.red}[BACKEND ERROR] ${colors.reset}${data.toString()}`);
  });

  function checkBothReady() {
    if (frontendReady && backendReady) {
      console.log('\n' + '='.repeat(60));
      log('green', '🎉 Both services are ready!');
      log('cyan', '📱 Frontend: http://localhost:5173');
      log('cyan', '🔧 Backend API: http://localhost:8080');
      log('cyan', '📊 Health Check: http://localhost:8080/health');
      console.log('='.repeat(60));
      console.log('Press Ctrl+C to stop both services\n');
    }
  }

  // 处理进程退出
  process.on('SIGINT', () => {
    log('yellow', '\n🛑 Stopping development servers...');
    frontend.kill('SIGINT');
    backend.kill('SIGINT');
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  });

  // 处理进程错误
  frontend.on('error', (err) => {
    log('red', `❌ Frontend error: ${err.message}`);
    process.exit(1);
  });

  backend.on('error', (err) => {
    log('red', `❌ Backend error: ${err.message}`);
    process.exit(1);
  });

  // 处理进程退出
  frontend.on('close', (code) => {
    if (code !== 0) {
      log('red', `❌ Frontend exited with code ${code}`);
      process.exit(code);
    }
  });

  backend.on('close', (code) => {
    if (code !== 0) {
      log('red', `❌ Backend exited with code ${code}`);
      process.exit(code);
    }
  });
}

// 运行启动函数
startDev().catch(err => {
  log('red', `❌ Startup error: ${err.message}`);
  process.exit(1);
});