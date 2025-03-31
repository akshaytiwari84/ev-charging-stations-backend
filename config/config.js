// {
//   "development": {
//     "username": "postgres",
//     "password": "postgres",
//     "database": "demo_boilerplate",
//     "host": "localhost",
//     "dialect": "postgres"
//   },
//   "test": {
//     "username": "postgres",
//     "password": "postgres",
//     "database": "demo_boilerplate",
//     "host": "localhost",
//     "dialect": "postgres"
//   },
//   "production": {
//     "username": "postgres",
//     "password": "postgres",
//     "database": "demo_boilerplate",
//     "host": "localhost",
//     "dialect": "postgres"
//   }
// }




require("dotenv").config({ path: `.env` });
module.exports = {
  development: {
    dialect: "postgres",
    host: process.env.HOST,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
  },
  dev: {
    dialect: "postgres",
    host: process.env.HOST,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
  },
  local: {
    dialect: "postgres",
    host: process.env.HOST,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
  },
};


