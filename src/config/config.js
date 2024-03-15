import { config } from 'dotenv';
config();

export const version = '1.0.0';
export const port = process.env.PORT;
export const apiUrl = process.env.API_URL;
export const api = {
  host: process.env.API_HOST,
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  timeout: 30,
};
export const mongoDb = {
  user: process.env.MONGO_DB_USER,
  uri: process.env.MONGO_DB_LINK,
  name: process.env.MONGO_DB_NAME,
  password: process.env.MONGO_DB_PASSWORD,
};
// export const mysqlDb = {
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_DB_USER,
//   password: process.env.MYSQL_DB_PASSWORD,
//   database: process.env.MYSQL_DB_NAME
// };
export const redisStore = {
  url: process.env.REDIS_URL,
  user: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // tls: true,
  // key: readFileSync('./redis_user_private.key'),
  // cert: readFileSync('./redis_user.crt'),
  // ca: [readFileSync('./redis_ca.pem')]
};

