import { Schema, model } from "mongoose";

export interface SongI {
  name: string;
  link: string;
}

const SongSchema = new Schema<{ name: string }>({
  name: { type: String, required: true },
  link: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: "Artist" }
});

const Song = model<SongI>("Song", SongSchema);

export default Song;
