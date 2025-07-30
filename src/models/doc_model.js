import mongoose, { Schema } from 'mongoose';

export const docSchema = new Schema({
  title: { type: String }, // user provided nickname for the file
  fileName: { type: String }, // not pdfUrl! filename is just used for aesthetic purposes in the library display
  content: { type: String }, // unbroken text content
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
