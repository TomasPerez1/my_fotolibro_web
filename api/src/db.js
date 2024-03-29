require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  native: false,
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Client, Photo, Session, Album } = sequelize.models;

Client.hasMany(Photo, { onDelete: "CASCADE" });
Photo.belongsTo(Client);

Client.hasMany(Session, { onDelete: "CASCADE" });
Session.belongsTo(Client);

Client.hasMany(Album, { onDelete: "CASCADE" });
Album.belongsTo(Client);

Album.hasMany(Photo, { onDelete: "CASCADE" });
Photo.belongsTo(Album);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
