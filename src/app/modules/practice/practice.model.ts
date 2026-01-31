import mongoose, { Schema, Model } from 'mongoose';
import slugify from 'slugify';
import { IPractice, IPracticeItem } from './practice.interface';


const PracticeItemSchema = new Schema<IPracticeItem>({
  content: { type: String, required: true, trim: true },
  pronunciation: { type: String, trim: true },
  audioUrl: { type: String, required: true },
  imageUrl: { type: String },
  order: { type: Number, default: 0 }
}, { _id: true }); 


const PracticeSchema = new Schema<IPractice>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: { type: String, trim: true, maxlength: 2000 },
    course: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: [true, 'Practice task must belong to a course'],
      index: true 
    },
    items: [PracticeItemSchema],
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    usageCount: { type: Number, default: 0 }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

PracticeSchema.virtual('totalItems').get(function () {
  return this.items ? this.items.length : 0;
});


PracticeSchema.pre('validate', async function (next) {
  if (this.isModified('title')) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (await mongoose.models.Practice.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
  }
  next();
});

PracticeSchema.statics.findByCourse = function(courseId: string) {
  return this.find({ course: courseId, isActive: true }).sort('createdAt');
};

const Practice = mongoose.model<IPractice>('Practice', PracticeSchema);
export default Practice;