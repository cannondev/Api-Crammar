import mongoose, { Schema } from 'mongoose';

export const docSchema = new Schema({
  title: { type: String },
  fileName: { type: String },
  content: { type: String },
  pdfUrl: { type: String },
  summary: { type: String },
  wordArray: [{ type: String }],
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

const DocModel = mongoose.model('Doc', docSchema);

export default DocModel;
