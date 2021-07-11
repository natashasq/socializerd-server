module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "gollywood30",
    DB: "social_media_clone",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
}