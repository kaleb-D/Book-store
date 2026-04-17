import Book from '../models/bookModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

/**
 * @desc    Get all books with pagination & filtering
 * @route   GET /api/books
 * @access  Public
 */
export const getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 8;
    const skip = (page - 1) * limit;
    // Build filter object
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + books.length < total,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single book by ID
 * @route   GET /api/books/:id
 * @access  Public
 */
export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new book
 * @route   POST /api/books
 * @access  Private/Admin
 */


export const createBook = async (req, res, next) => {
  try {
    let imageUrl = '';

    if (req.file && req.file.buffer) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    } else {
      imageUrl = req.body.coverImage || req.body.image || '';
    }

    const book = await Book.create({
      ...req.body,
      coverImage: imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a book
 * @route   PUT /api/books/:id
 * @access  Private/Admin
 */
export const updateBook = async (req, res, next) => {
  try {
    if (req.file && req.file.buffer) {
      req.body.coverImage = await uploadToCloudinary(req.file.buffer);
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a book
 * @route   DELETE /api/books/:id
 * @access  Private/Admin
 */
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
