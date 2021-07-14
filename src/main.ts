import { scrapeUku } from "./scrape";
import mongoose, { Schema, model } from "mongoose";

export async function init() {
  mongoose.connect("mongodb://localhost:27017/uku", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async function () {
    console.log("cat made");

    interface Cat {
      name: string;
    }
    // 2. Create a Schema corresponding to the document interface.
    const catSchema = new Schema<{ name: string }>({
      name: { type: String, required: true },
    });

    const CatModel = model<Cat>("Cat", catSchema);

    await CatModel.create({ name: "Niaomi" });

    // pussy.save();

    db.close();
  });
  // scrapeUku();
}

init();
