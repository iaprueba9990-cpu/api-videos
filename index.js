import express from "express";
import AWS from "aws-sdk";
import cors from "cors";

const app = express();
app.use(cors());

AWS.config.update({ correctClockSkew: true });

const s3 = new AWS.S3({
  endpoint: "https://s3.us-east-1.idrivee2.com",
  accessKeyId: process.env.IDRIVE_KEY,
  secretAccessKey: process.env.IDRIVE_SECRET,
  region: "us-east-1",
  signatureVersion: "v4",
});

/* ===============================
   🎬 Videos
   =============================== */
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
  "deca-dence/12.mp4",
];

function videoPorHora() {
  const ahora = new Date();
  const minutos = ahora.getUTCHours() * 60 + ahora.getUTCMinutes();
  return videos[Math.floor(minutos / 30) % videos.length];
}

function generarLink(key) {
  return s3.getSignedUrl("getObject", {
    Bucket: "videos",
    Key: key,
    Expires: 3600,
  });
}

app.get("/tv", (req, res) => {
  const video = videoPorHora();
  const url = generarLink(video);

  res.json({
    video,
    url,
    serverTime: new Date().toISOString(),
  });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("API lista 📺")
);
