import { Schema, model } from "mongoose";

export interface ChordI {
  name: string;
  shape?: string;
}

const ChordSchema = new Schema<{ name: string }>({
  name: { type: String, required: true },
  shape: { type: String }
});

const Chord = model<ChordI>("Chord", ChordSchema);

export default Chord;
