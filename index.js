import express from "express";
import AWS from "aws-sdk";
import cors from "cors";

const app = express();
app.use(cors());

// 🔐 IDrive e2 (S3 compatible)
const s3 = new AWS.S3({
  endpoint: "https://s3.us-east-1.idrivee2.com",
  accessKeyId: process.env.IDRIVE_KEY,
  secretAccessKey: process.env.IDRIVE_SECRET,
  signatureVersion: "v4",
  region: "us-east-1",
});

// 🎬 Lista de videos (ordenados)
const videos = [
  "deca-dence/01.mp4",
  "deca-dence/02.mp4",
  "deca-dence/03.mp4",
  "deca-dence/04.mp4",
  "deca-dence/05.mp4",
  "deca-dence/06.mp4",
  "deca-dence/07.mp4",
  "deca-dence/08.mp4",
  "deca-dence/09.mp4",
  "deca-dence/10.mp4",
  "deca-dence/11.mp4",
  "deca-dence/12.mp4"
];

// ⏰ VIDEO SEGÚN LA HORA (30 min)
function videoPorHora() {
  const ahora = new Date();
  const minutosTotales = ahora.getUTCHours() * 60 + ahora.getUTCMinutes();
  const bloque = Math.floor(minutosTotales / 30);
  return videos[bloque % videos.length];
}

// 🔗 Generar link firmado
function generarLink(key) {
  return s3.getSignedUrl("getObject", {
    Bucket: "videos",
    Key: key,

    Expires: 3600, // 1 hora (IMPORTANTE)

    ResponseContentType: "video/mp4",
    ResponseContentDisposition: "inline",

  });
}


// 📺 Endpoint principal (canal 24/7)
app.get("/tv", (req, res) => {
  const video = videoPorHora();
  const url = generarLink(video);

  res.json({
    video,
    url,
    serverTime: new Date().toISOString()
  });
});

// 🧪 Prueba simple
app.get("/", (req, res) => {
  res.send("API de videos funcionando 🎬");
});

// 🚀 Arranque
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API corriendo en puerto", PORT);
});
