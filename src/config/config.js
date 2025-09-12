export default {
  development: {
    username: process.env.DB_USER || "guilherme",
    password: process.env.DB_PASS || "Loveforever@2003",
    database: process.env.DB_NAME || "prontuario_development",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql"
  }
}
