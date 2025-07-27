import mongoose, { Schema } from 'mongoose';

// create a docSchema with a title field
export const docSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  // preview may need to be some kind of file
  preview: { type: String },
  description: { type: Srtring },
  wordArray: [{ type: String }],
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create a PostModel class from schema
const DocModel = mongoose.model('Doc', DocSchema);

export default DocModel;
