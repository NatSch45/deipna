module.exports = {
  apps: [
    {
      name: 'deipna-backend',
      script: './build/bin/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
