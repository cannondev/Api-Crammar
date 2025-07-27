import mongoose, { Schema } from 'mongoose';

// create a docSchema with a title field
export const docSchema = new Schema({
  title: { type: String },
  content: { type: String },
  // preview may need to be some kind of file
  preview: { type: String },
  description: { type: String },
  wordArray: [{ type: String }],
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create a DocModel class from schema
const DocModel = mongoose.model('Doc', docSchema);

export default DocModel;
