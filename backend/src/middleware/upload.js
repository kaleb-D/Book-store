import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const documentsDir = path.join(uploadsDir, 'documents');
const audioDir = path.join(uploadsDir, 'audio');

[uploadsDir, imagesDir, documentsDir, audioDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// --------------- Storage Configurations ---------------

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, imagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, documentsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, audioDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// --------------- File Filters ---------------

const imageFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
};

const documentFilter = (_req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const allowedMimes =
    /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedMimes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only PDF and DOCX files are allowed'));
};

const audioFilter = (_req, file, cb) => {
  const allowedTypes = /mp3|wav|ogg|m4a|webm/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = file.mimetype.startsWith('audio/');

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only audio files (MP3, WAV, OGG, M4A, WebM) are allowed'));
};

// --------------- Upload Instances ---------------

export const uploadBookImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: documentFilter,
});

export const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: audioFilter,
});

// Combined upload for contact form (document + audio)
export const uploadContactFiles = multer({
  storage: multer.diskStorage({
    destination: (_req, file, cb) => {
      if (file.fieldname === 'document') {
        cb(null, documentsDir);
      } else if (file.fieldname === 'audioNote') {
        cb(null, audioDir);
      } else {
        cb(new Error('Unexpected field'), null);
      }
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'document') {
      return documentFilter(_req, file, cb);
    }
    if (file.fieldname === 'audioNote') {
      return audioFilter(_req, file, cb);
    }
    cb(new Error('Unexpected field'), false);
  },
});

// --------------- Multer Error Handler ---------------

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds the allowed limit',
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  next();
};
