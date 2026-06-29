# Christian Book Store

A full-stack web application for managing and distributing Christian books. Features an admin dashboard for book management, user administration, and contact request tracking.

## 🌟 Features

- **Book Management**: Create, edit, and delete Christian books with cover images
- **Category Organization**: Organize books into categories (Bible, Theology, Devotionals, Youth, Children, Leadership, Apologetics, History, etc.)
- **Admin Dashboard**:
  - Protected by password-gated access
  - View dashboard statistics (total users, books, contacts)
  - Manage users and their roles
  - Track contact submissions
  - Download contact files
- **User Management**: Manage user roles and permissions
- **Contact Form**: Public form for visitors to submit inquiries
- **Dark/Light Theme**: Theme toggle for comfortable reading
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## 🔐 Admin Access

Admin dashboard is hidden by default:

1. Click the **"christian Book Store"** logo in the top-left corner **3 times**
2. Enter the admin password
3. Access granted!

**Default Admin Password**: `ChristianBookStore2026!`  
To change the password, set the `ADMIN_PASSWORD` environment variable in the backend.

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Accessible component library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend

- **Node.js** with Express.js
- **MongoDB** - NoSQL database
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage and management
- **Bcrypt** - Password hashing
- **Helmet** - HTTP security middleware

## 📦 Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB instance
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/christian-bookstore
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ADMIN_PASSWORD=ChristianBookStore2026!
ADMIN_EMAIL=admin@christianbookstore.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
christian-book-store/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Passport, etc.)
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware (auth, validation, error handling)
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── uploads/         # Temporary file storage
│   │   ├── index.js         # Entry point
│   │   └── server.js        # Express server setup
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable React components
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Utilities and helpers
    │   ├── assets/          # Static assets
    │   ├── App.tsx          # Main app component
    │   └── main.tsx         # React entry point
    ├── public/              # Public static files
    ├── vite.config.ts       # Vite configuration
    └── package.json
```

## 🚀 Available Scripts

### Backend

```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Frontend

```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 📚 API Endpoints

### Auth Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /admin-login` - Admin access with password
- `GET /me` - Get current user profile (protected)
- `PUT /me` - Update user profile (protected)

### Book Routes (`/api/books`)

- `GET /` - Get all books
- `GET /:id` - Get book by ID
- `POST /` - Create book (admin only)
- `PUT /:id` - Update book (admin only)
- `DELETE /:id` - Delete book (admin only)

### Admin Routes (`/api/admin`)

- `GET /stats` - Dashboard statistics (admin only)
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID (admin only)
- `PATCH /users/:id/role` - Update user role (admin only)

### Contact Routes (`/api/contact`)

- `POST /` - Submit contact form
- `GET /` - Get all contact submissions (admin only)
- `GET /:id` - Get contact by ID (admin only)
- `PATCH /:id/status` - Update contact status (admin only)
- `DELETE /:id` - Delete contact (admin only)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- CORS protection
- Helmet security headers
- Rate limiting on sensitive endpoints
- Secure file upload handling
- Input validation and sanitization

## 📝 Environment Variables

### Backend

| Variable                | Description                       |
| ----------------------- | --------------------------------- |
| `PORT`                  | Server port (default: 5000)       |
| `MONGO_URI`             | MongoDB connection string         |
| `JWT_SECRET`            | Secret key for JWT signing        |
| `JWT_EXPIRES_IN`        | JWT expiration time (default: 7d) |
| `ADMIN_PASSWORD`        | Admin panel password              |
| `ADMIN_EMAIL`           | Admin user email                  |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name             |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret             |
| `CLIENT_URL`            | Frontend URL for redirects        |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Christian Book Store Development Team

## 🙏 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Happy reading and sharing God's Word! 📖✨**
