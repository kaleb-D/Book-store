import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      readers: {
        type:Number,
      },
      label: {
        type: String
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
         "Bible", "Theology", "Devotionals", "christian living", "Youth","children","Leadership","Apologetics", "History"
      ],
    },
    coverImage: {
      type: String,
      default: '',
    },
    liveURL : {
        type: String,
        trim: true,
        default: '',
    },
    downloadURL : {
        type: String,
        trim: true,
        default: '',
    },
    publisher: {
      type: String,
      trim: true,
    },
    publishedYear: {
      type: Number,
    },
    pages: {
      type: Number,
      min: [1, 'Pages must be at least 1'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;
