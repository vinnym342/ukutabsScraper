import { Schema, model } from "mongoose";
import Song, { SongI } from "./song";

export interface ArtistI {
  name: string;
  link: string;
  songs: SongI[];
}

const artistSchema = new Schema<{ name: string }>({
  name: { type: String, required: true },
  link: { type: String, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }]
});

const Artist = model<ArtistI>("Artist", artistSchema);

export default Artist;
