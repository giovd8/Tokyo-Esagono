const isDev = process.env.NODE_ENV !== 'production';

const HOST = {
  development: 'http://localhost:8080',
  production: 'https://tokyoesagono.herokuapp.com',
};

export const SITE_URL = isDev ? HOST.development : HOST.production;
