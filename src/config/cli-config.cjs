const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

function loadEnv() {
  const paths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(process.cwd(), 'src/.env'),
    path.resolve(process.cwd(), '.env')
  ];

  for (const envPath of paths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      return;
    }
  }
}

loadEnv();

const DB_USERNAME = process.env.DB_USERNAME || process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.DB_PASS;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql'
  },
  production: {
    username: process.env.PROD_DB_USERNAME || process.env.PROD_DB_USER || DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD || process.env.PROD_DB_PASS || DB_PASSWORD,
    database: process.env.PROD_DB_NAME || process.env.DB_NAME,
    host: process.env.PROD_DB_HOST || process.env.DB_HOST,
    dialect: process.env.PROD_DB_DIALECT || process.env.DB_DIALECT || 'mysql'
  }
};
