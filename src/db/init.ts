import mongoose from "mongoose";
import { printAsciiArt } from "../helpers/asciiArt";

export const startMongo = () => {
  mongoose.connect("mongodb://localhost:27017/uku", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async function () {
    printAsciiArt("Mongo DB Init");

    db.close();
  });
};

export const runInMongo = (cb: Function) => {
  mongoose.connect("mongodb://localhost:27017/uku", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async function () {
    try {
      await cb();
      db.close();
    } catch (e) {
      console.error(e);
    }
  });
};

export const closeMongo = () => {
  const db = mongoose.connection;

  db.close();
  printAsciiArt("Mongo closed", true);
};
