const path = require('path')

const buildDir = path.join(__dirname, 'build')

module.exports = {
  apps: [
    {
      name: 'deipna-backend',
      script: path.join(buildDir, 'bin/server.js'),
      cwd: buildDir,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
}
