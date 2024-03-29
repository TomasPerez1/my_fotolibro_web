const { env } = require("./env");
const { Client, Photo, Album } = require("../db");
const cloudinary = require("./cloudinary");

async function loadAllJsonClients(clients) {
  if (!clients?.length) return;
  console.log('# Clientes: ' + clients.length);
  const client = clients.shift();
  await loadJsonClients(client);

  return await loadAllJsonClients(clients);
}

async function loadJsonClients(_client) {
  try {
    const { name, email, photos } = _client;
    const [client, created] = await Client.findOrCreate({
      where: {
        name,
      },
      defaults: {
        name,
        email,
        created_at: new Date(),
      },
    });

    if (!created) return console.log("Creado previamente");
    console.log("Cliente:", client.name);
    const upload_preset = await cloudinary.createUpload_preset({
      folder: client.id,
      name: `${client.name.split(" ").join("-")}-${client.id}`,
    });

    client.upload_preset = upload_preset.name;
    await client.save();

    if (!photos?.length) return console.log("Sin photos");
    console.log("Photos: " + photos.length);
    const rawPhotos = photos.map(({ URL, publicId, ...p }) => {
      const spl = URL.split("/");
      URL = URL.replace(
        spl[spl.length - 1].split(".")[0],
        publicId.split("/")[1]
      );
      return {
        clientId: client.id,
        size: parseInt(p.size),
        URL,
        publicId,
        ...p,
      };
    });

    const photosWhit = await getPromisesUpload({
      clientId: client.id,
      images: rawPhotos,
    });

    //console.log(photosWhit)

    await Photo.bulkCreate(photosWhit);
  } catch (err) {
    console.log(err);
  }
}

const AVAILABLE_SIZE = 5000000; //5MB
async function getPromisesUpload({ clientId, albums, images, promises = [] }) {
  if (!images.length) return promises;
  if (!albums?.id) {
    albums = [await Album.create({ clientId })];
  }

  let { size, available, id } = albums[0];
  console.log("album creado:" + id);
  while (available > AVAILABLE_SIZE && images.length) {
    const img = images.shift();
    size += parseInt(img.size);
    available -= parseInt(img.size);

    

    const newPublicId = `${clientId}/albm-${id}/${getStringWithZeros(
      img.index,
      4
    )}_${img.originalName}`;
    
    const data = await cloudinary.renameFile({public_id: img.publicId, to: newPublicId})
    img.publicId = data.public_id
    img.URL = data.secure_url
    
    console.log("public id" + data.public_id, "index:" + img.index);

    promises.push({ ...img, albumId: id });
  }
  console.log("size: ", size, "available: ", available);
  console.log("faltan: ", images.length);
  albums[0].size = size;
  albums[0].available = available;
  await albums[0].save();

  return await getPromisesUpload({
    clientId,
    albums: albums.slice(1),
    images,
    promises,
  });
}

function getStringWithZeros(num, size) {
  let numString = num.toString();
  const zeros = size - numString.length;
  return "0".repeat(zeros) + numString;
}
