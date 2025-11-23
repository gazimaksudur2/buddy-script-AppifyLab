# Buddy Script - Backend

This is the Node.js/Express backend for the Buddy Script social media application.

## Tech Stack

- Node.js
- Express 4
- MongoDB with Mongoose
- Firebase Admin SDK
- Multer (file uploads)
- Express Validator

## Available Scripts

### `npm start`

Runs the server in production mode.

### `npm run dev`

Runs the server in development mode with nodemon (auto-restart on changes).

## Project Structure

```
server/
├── config/
│   └── firebase.js          # Firebase Admin initialization
├── middleware/
│   └── auth.middleware.js   # JWT verification
├── models/
│   ├── User.js             # User schema
│   ├── Post.js             # Post schema
│   ├── Comment.js          # Comment schema
│   └── Like.js             # Like schema
├── routes/
│   ├── auth.routes.js      # Auth endpoints
│   ├── post.routes.js      # Post CRUD
│   ├── comment.routes.js   # Comment endpoints
│   ├── like.routes.js      # Like toggle
│   └── user.routes.js      # User endpoints
├── uploads/                # File uploads directory
└── index.js                # Server entry point
```

## Environment Variables

Create a `.env` file in this directory with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buddy-script
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/sync` - Sync Firebase user with DB
- `GET /api/auth/me` - Get current user

### Posts
- `POST /api/posts` - Create post (multipart/form-data)
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:postId` - Get single post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post

### Comments
- `POST /api/comments` - Create comment/reply
- `GET /api/comments/post/:postId` - Get post comments
- `GET /api/comments/:commentId/replies` - Get replies
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

### Likes
- `POST /api/likes/toggle` - Toggle like
- `GET /api/likes/:targetType/:targetId` - Get likes

### Users
- `GET /api/users/:userId` - Get user by ID

## Authentication

All endpoints (except health check) require Firebase authentication token:

```
Authorization: Bearer <firebase-id-token>
```

## Database Models

### User
- firebaseUid (unique)
- email (unique)
- firstName, lastName
- profilePicture
- bio

### Post
- author (ref: User)
- content
- imageUrl
- visibility (public/private)
- likesCount, commentsCount
- isDeleted

### Comment
- post (ref: Post)
- author (ref: User)
- content
- parentComment (ref: Comment, nullable)
- likesCount, repliesCount
- isDeleted

### Like
- user (ref: User)
- targetType (Post/Comment)
- targetId (polymorphic)
- isDeleted

## Security

- Firebase token verification on every request
- Rate limiting: 100 requests per 15 minutes
- Helmet.js for security headers
- CORS configured
- Input validation with express-validator
- File upload restrictions (5MB, images only)

## Development

1. Install dependencies: `npm install`
2. Configure environment variables
3. Ensure MongoDB is running
4. Start development server: `npm run dev`

## Production

```bash
npm start
```

## Database Indexes

The following indexes are automatically created:

**User:**
- firebaseUid (unique)
- email (unique)
- createdAt

**Post:**
- author, createdAt
- visibility, createdAt, isDeleted
- createdAt, isDeleted

**Comment:**
- post, parentComment, createdAt
- post, createdAt, isDeleted

**Like:**
- user, targetType, targetId, isDeleted (unique compound)
- targetId, targetType, isDeleted

## Health Check

```
GET /api/health
```

Returns: `{ status: 'OK', message: 'Server is running' }`

## Error Handling

All errors are caught and returned in format:

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Stack trace (dev only)"
}
```

## Learn More

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

