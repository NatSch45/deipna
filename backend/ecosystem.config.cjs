const path = require('path')
const fs = require('fs')

const buildDir = path.join(__dirname, 'build')
const envFile = path.join(buildDir, '.env')

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const vars = {}
  for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim()
    }
  }
  return vars
}

module.exports = {
  apps: [
    {
      name: 'deipna-backend',
      script: path.join(buildDir, 'bin/server.js'),
      cwd: buildDir,
      env: parseEnvFile(envFile),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
}
