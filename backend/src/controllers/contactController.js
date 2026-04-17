import Contact from '../models/contactModel.js';
import path from 'path';
import fs from 'fs';

/**
 * @desc    Submit a contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactData = { name, email, subject, message };

    // Handle document upload
    if (req.files && req.files.document && req.files.document[0]) {
      const doc = req.files.document[0];
      contactData.document = {
        filename: doc.filename,
        originalName: doc.originalname,
        mimetype: doc.mimetype,
        size: doc.size,
        path: `/uploads/documents/${doc.filename}`,
      };
    }

    // Handle audio note upload
    if (req.files && req.files.audioNote && req.files.audioNote[0]) {
      const audio = req.files.audioNote[0];
      contactData.audioNote = {
        filename: audio.filename,
        originalName: audio.originalname,
        mimetype: audio.mimetype,
        size: audio.size,
        path: `/uploads/audio/${audio.filename}`,
      };
    }

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: { id: contact._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact submissions (admin)
 * @route   GET /api/contact
 * @access  Private/Admin
 */
export const getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single contact submission (admin)
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found',
      });
    }

    // Mark as read if currently unread
    if (contact.status === 'unread') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update contact status (admin)
 * @route   PATCH /api/contact/:id/status
 * @access  Private/Admin
 */
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['unread', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a contact submission (admin)
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact submission deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download a file from contact submission (admin)
 * @route   GET /api/contact/:id/download/:fileType
 * @access  Private/Admin
 */
export const downloadContactFile = async (req, res, next) => {
  try {
    const { id, fileType } = req.params;

    if (!['document', 'audioNote'].includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type',
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found',
      });
    }

    const fileData = contact[fileType];

    if (!fileData || !fileData.path) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    const filePath = path.join(process.cwd(), fileData.path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server',
      });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
    res.setHeader('Content-Type', fileData.mimetype || 'application/octet-stream');

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('File streaming error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Error streaming file',
        });
      }
    });

  } catch (error) {
    next(error);
  }
};
