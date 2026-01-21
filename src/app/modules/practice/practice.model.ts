import mongoose, { Schema } from 'mongoose';
import { IPractice } from './practice.interface';
import slugify from 'slugify';

const PracticeItemSchema = new Schema({
  content: { type: String, required: true, trim: true },
  pronunciation: { type: String, trim: true },
  audioUrl: { type: String },
  imageUrl: { type: String },
  description: { type: String, maxlength: 500 },
  order: { type: Number, required: true, default: 0 }
}, { _id: false });

const PracticeSchema: Schema<IPractice> = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    items: [PracticeItemSchema],
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true },
    totalItems: { type: Number, default: 0 },
    usageCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Auto-generate slug from title
PracticeSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await mongoose.models.Practice.findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

// Auto-update totalItems count
PracticeSchema.pre('save', function (next) {
  this.totalItems = this.items.length;
  next();
});

// Indexes for performance
PracticeSchema.index({ slug: 1 });
PracticeSchema.index({ isActive: 1 });
PracticeSchema.index({ course: 1 });


const Practice = mongoose.model<IPractice>('Practice', PracticeSchema);
export default Practice;
