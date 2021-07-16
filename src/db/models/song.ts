import { Schema, model } from "mongoose";
import { ChordI } from "./chords";

export interface SongI {
  name: string;
  link: string;
  tabs?: string;
  chords?: ChordI[];
}

const SongSchema = new Schema<{ name: string }>({
  name: { type: String, required: true },
  link: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: "Artist" },
  tabs: { type: String },
  chords: [{ type: Schema.Types.ObjectId, ref: "Chord" }]
});

const Song = model<SongI>("Song", SongSchema);

export default Song;
