const path = require('path')

const buildDir = path.join(__dirname, 'build')
const envFile = path.join(buildDir, '.env')

module.exports = {
  apps: [
    {
      name: 'deipna-backend',
      script: path.join(buildDir, 'bin/server.js'),
      cwd: buildDir,
      node_args: `--env-file=${envFile}`,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
}
