module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'road condition',
      script    : 'bin/www.ts',
      env: {
        PORT: 8300
      },
      env_production : {
        NODE_ENV: 'production',
      }
    }
  ],
};
