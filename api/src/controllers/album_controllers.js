const { Op } = require("sequelize");
const { Album, Photo } = require("../db");
const { consts } = require("../utils");

module.exports = {
  getAlbums: async function (req, res) {
    const { clientId } = req.params;
    try {
      const albums = await Album.findAll({
        where: {
          clientId,
          available: {
            [Op.gte]: consts.MIN_SIZE_AVAILABLE,
          },
        },
      });

      res.status(202).send(albums);
    } catch (error) {
      res.status(404).send({
        msg: error.message,
      });
    }
  },
  //
  createAlbum: async function (req, res) {
    const { clientId } = req.params;
    try {
      const [albums, created] = await Album.findOrCreate({
        where: {
          clientId,
          available: {
            [Op.gte]: consts.MIN_SIZE_AVAILABLE,
          },
        },
        defaults: {
          clientId,
          available: consts.MAX_SIZE_AVAILABLE,
        },
      });

      if (created) {
        albums.name = "albm-" + albums.id;
        await albums.save();
      }

      res.status(202).send([albums]);
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
  //
  updateAlbum: async function (req, res) {
    const { id } = req.params;
    const { size, available, photos_length } = req.body;
    try {
      const album = await Album.findByPk(id);

      album.size = size;
      album.available = available;
      album.photos_length = album.photos_length + photos_length;

      await album.save();

      res.send(album);
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
};
