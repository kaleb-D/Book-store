import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    document: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
    },
    audioNote: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'responded'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
