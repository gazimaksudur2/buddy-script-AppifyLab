# Buddy Script - Social Media Application

A full-stack social media application built with React.js, Node.js, Express, MongoDB, and Firebase Authentication. This monorepo contains both frontend and backend code in a single repository.

## 🚀 Features

### Authentication & Authorization
- **Firebase Authentication** for secure user management
- Email/Password registration and login
- Google Sign-In integration
- Protected routes for authenticated users only
- JWT-based API authentication

### Feed System
- Create posts with text and images (up to 5MB)
- **Public/Private post visibility**
  - Public posts: Visible to all users
  - Private posts: Visible only to the author
- Posts displayed in reverse chronological order (newest first)
- Image upload support with preview

### Social Interactions
- **Like/Unlike System**
  - Like posts, comments, and replies
  - View list of users who liked
  - Real-time like count updates
  
- **Comments & Replies**
  - Multi-level commenting system
  - Reply to comments (nested replies)
  - Like/unlike comments and replies
  - View who liked each comment/reply
  - Delete own comments and replies

### User Experience
- Responsive design (mobile, tablet, desktop)
- Real-time notifications with toast messages
- Loading states and error handling
- Clean and modern UI following the original design

## 🏗️ Architecture & Design Decisions

### Database Design

#### User Model
```javascript
{
  firebaseUid: String (indexed, unique),
  email: String (indexed, unique),
  firstName: String,
  lastName: String,
  profilePicture: String,
  bio: String,
  isActive: Boolean,
  timestamps: true
}
```

#### Post Model
```javascript
{
  author: ObjectId (ref: User, indexed),
  content: String (max 5000 chars),
  imageUrl: String,
  visibility: Enum ['public', 'private'] (indexed),
  likesCount: Number (denormalized for performance),
  commentsCount: Number (denormalized for performance),
  isDeleted: Boolean (soft delete, indexed),
  timestamps: true
}
```

#### Comment Model
```javascript
{
  post: ObjectId (ref: Post, indexed),
  author: ObjectId (ref: User, indexed),
  content: String (max 2000 chars),
  parentComment: ObjectId (ref: Comment, indexed) // null for top-level comments,
  likesCount: Number (denormalized),
  repliesCount: Number (denormalized),
  isDeleted: Boolean (soft delete, indexed),
  timestamps: true
}
```

#### Like Model
```javascript
{
  user: ObjectId (ref: User, indexed),
  targetType: Enum ['Post', 'Comment'] (indexed),
  targetId: ObjectId (refPath: targetType, indexed),
  isDeleted: Boolean (soft delete for toggle functionality),
  timestamps: true
}
// Unique compound index: (user, targetType, targetId, isDeleted)
```

### Scalability Considerations

#### Database Indexing
- **Compound indexes** on frequently queried fields
  - `(author, createdAt)` for user's posts
  - `(visibility, createdAt, isDeleted)` for feed queries
  - `(post, parentComment, createdAt)` for comment hierarchies
- **Single field indexes** on foreign keys and filter fields
- Indexes designed to support millions of posts and reads

#### Performance Optimizations
1. **Denormalized Counters**: `likesCount`, `commentsCount`, `repliesCount`
   - Avoids expensive aggregation queries
   - Updated atomically with `$inc` operations
   - Trade-off: Slight data redundancy for massive read performance gains

2. **Soft Deletes**: Using `isDeleted` flag
   - Allows data recovery
   - Maintains referential integrity
   - Indexed for efficient filtering

3. **Pagination**: All list endpoints support pagination
   - Default: 10 posts, 20 comments per page
   - Prevents memory overload on client/server
   - Uses `skip` and `limit` with indexed fields

4. **Lazy Loading**: 
   - Replies loaded on-demand
   - Images loaded progressively
   - Infinite scroll support for feed

5. **Query Optimization**:
   - Selective field population (only necessary user fields)
   - Lean queries for better performance
   - Aggregation pipelines for complex queries

#### Security Measures

1. **Firebase Authentication**:
   - Industry-standard auth system
   - Token verification on every request
   - Automatic token refresh

2. **API Security**:
   - Rate limiting (100 requests per 15 minutes per IP)
   - Helmet.js for HTTP headers security
   - CORS configuration
   - Input validation with express-validator
   - File upload restrictions (size, type)

3. **Data Security**:
   - Authorization checks on all mutations
   - Users can only modify their own content
   - Private posts filtered at query level
   - NoSQL injection prevention via Mongoose

4. **Best Practices**:
   - Environment variables for secrets
   - Compression middleware
   - Error handling middleware
   - Structured logging

### Technology Stack Justification

#### Frontend
- **React.js**: Component-based, efficient rendering, large ecosystem
- **React Router**: Client-side routing for SPA
- **Axios**: HTTP client with interceptors for auth
- **React Toastify**: User-friendly notifications
- **Bootstrap 5**: Responsive grid system (using existing design)

#### Backend
- **Node.js + Express**: Non-blocking I/O, perfect for real-time features
- **MongoDB + Mongoose**: 
  - Flexible schema for social media data
  - Horizontal scalability
  - Rich query capabilities
  - Document-based storage for nested data (comments/replies)
- **Firebase Admin SDK**: Backend token verification

#### Storage
- **Local filesystem** for images (uploads/ directory)
- Production recommendation: AWS S3, Cloudinary, or similar CDN

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- Firebase project with Authentication enabled
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd AppifyLabTest
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# For macOS:
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# MongoDB will run on mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Whitelist your IP address

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In (optional)
4. Get Web App Credentials:
   - Project Settings → General → Your apps
   - Create a Web app
   - Copy the config object
5. Generate Service Account Key:
   - Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `server/firebase-service-account.json`

### 5. Environment Configuration

**Server Configuration** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buddy-script
NODE_ENV=development

# Firebase Admin SDK - Option 1: Use service account file
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Firebase Admin SDK - Option 2: Use individual credentials
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY=your-private-key
# FIREBASE_CLIENT_EMAIL=your-client-email
```

**Client Configuration** (`client/.env`):
```env
# Firebase Web Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Running the Application

**Development Mode (Recommended):**
```bash
# Run both frontend and backend concurrently
npm run dev
```

**Separate Terminals:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
AppifyLabTest/
├── assets/                 # Original HTML/CSS assets
│   ├── css/
│   ├── fonts/
│   ├── images/
│   └── js/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Comments.js
│   │   │   ├── CreatePost.js
│   │   │   ├── Header.js
│   │   │   ├── LikesList.js
│   │   │   ├── Post.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.js
│   │   ├── pages/          # Page components
│   │   │   ├── Feed.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── styles/         # CSS files
│   │   │   ├── auth.css
│   │   │   └── custom.css
│   │   ├── config/         # Configuration
│   │   │   └── firebase.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── server/                 # Node.js Backend
│   ├── config/            # Server configuration
│   │   └── firebase.js
│   ├── middleware/        # Express middleware
│   │   └── auth.middleware.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Like.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   └── user.routes.js
│   ├── uploads/           # File uploads directory
│   ├── index.js           # Server entry point
│   ├── package.json
│   └── .env
├── package.json           # Root package.json
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/sync` - Sync Firebase user with database
- `GET /api/auth/me` - Get current user

### Posts
- `POST /api/posts` - Create post (multipart/form-data)
- `GET /api/posts` - Get all posts (paginated, filtered by visibility)
- `GET /api/posts/:postId` - Get single post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post (soft delete)

### Comments
- `POST /api/comments` - Create comment or reply
- `GET /api/comments/post/:postId` - Get comments for post
- `GET /api/comments/:commentId/replies` - Get replies for comment
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment (soft delete)

### Likes
- `POST /api/likes/toggle` - Toggle like on post or comment
- `GET /api/likes/:targetType/:targetId` - Get likes for target

### Users
- `GET /api/users/:userId` - Get user by ID

All endpoints (except public assets) require Firebase authentication token in header:
```
Authorization: Bearer <firebase-id-token>
```

## 🧪 Testing the Application

### Manual Testing Steps

1. **Registration Flow**:
   - Go to http://localhost:3000/register
   - Register with email and password
   - Or use Google Sign-In
   - Should redirect to feed

2. **Login Flow**:
   - Go to http://localhost:3000/login
   - Login with credentials
   - Should redirect to feed

3. **Create Post**:
   - In feed, write text content
   - Optionally upload an image
   - Select visibility (Public/Private)
   - Click "Post"

4. **View Posts**:
   - See all public posts
   - See your private posts
   - Posts sorted by newest first

5. **Like Post**:
   - Click "Like" button
   - Count should update
   - Click "Likes" to see who liked

6. **Comment**:
   - Click "Comment" button
   - Write comment and submit
   - See comment appear

7. **Reply to Comment**:
   - Click "Reply" on a comment
   - Write reply and submit
   - Click "View replies" to see

8. **Like Comment/Reply**:
   - Click "Like" on comment or reply
   - See count update

## 🚀 Production Deployment

### Backend Deployment (Example: Heroku)

```bash
cd server
heroku create your-app-name
heroku config:set MONGODB_URI=your-production-mongodb-uri
heroku config:set FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
# Upload firebase-service-account.json securely
git push heroku main
```

### Frontend Deployment (Example: Vercel/Netlify)

```bash
cd client
npm run build
# Deploy build/ folder to Vercel or Netlify
# Update REACT_APP_API_URL to production backend URL
```

### Production Checklist
- [ ] Use production MongoDB (MongoDB Atlas)
- [ ] Set up CDN for images (AWS S3, Cloudinary)
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure environment variables
- [ ] Enable MongoDB indexes
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Optimize bundle size
- [ ] Enable compression

## 🔒 Security Best Practices Implemented

1. **Authentication**: Firebase Auth with token verification
2. **Authorization**: Resource ownership checks
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Input Validation**: Express-validator on all inputs
5. **File Upload Security**: Type and size restrictions
6. **CORS**: Configured for specific origins
7. **Helmet.js**: Security headers
8. **Soft Deletes**: Data recovery capability
9. **Error Handling**: Structured error responses
10. **Environment Variables**: No secrets in code

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Firebase Auth Error
```
Error: Firebase Admin SDK not configured
```
**Solution**: 
1. Check `server/.env` has correct Firebase credentials
2. Ensure `firebase-service-account.json` exists in server directory
3. Verify Firebase project has Authentication enabled

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
1. Check `server/index.js` CORS configuration
2. Ensure `CLIENT_URL` in server `.env` matches frontend URL
3. Restart backend server

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**:
```bash
# Find and kill process using port
# macOS/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📝 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] User profiles and profile editing
- [ ] Friend/Follow system
- [ ] Direct messaging
- [ ] Notifications system
- [ ] Post editing
- [ ] Image optimization and compression
- [ ] Video upload support
- [ ] Search functionality
- [ ] Hashtags and mentions
- [ ] Post sharing
- [ ] Advanced privacy settings
- [ ] Content moderation
- [ ] Analytics dashboard

## 👥 Contributing

This is a test project for AppifyLab. For any issues or improvements, please contact the development team.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Original HTML/CSS design provided by AppifyLab
- Firebase for authentication services
- MongoDB for database solution
- React and Node.js communities

---

**Built with ❤️ for AppifyLab Technical Assessment**

