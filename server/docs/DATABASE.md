# Database Schema Documentation

## Overview

BuddyScript uses MongoDB as its database with Mongoose ODM for schema definition and data modeling. The database consists of four main collections: Users, Posts, Comments, and Likes.

## Collections

### Users Collection

Stores user account information and authentication data.

```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  password: String (hashed with bcrypt),
  profilePicture: String (URL, default provided),
  firebaseUid: String (unique, sparse - for Google Auth),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email`: Unique index
- `firebaseUid`: Sparse unique index (allows multiple null values)

**Virtuals:**
- `fullName`: Computed from `firstName` + `lastName`

**Methods:**
- `comparePassword(candidatePassword)`: Verify password
- `toJSON()`: Remove password from JSON output

**Middleware:**
- Pre-save hook: Hash password if modified

### Posts Collection

Stores user posts with content, images, and metadata.

```javascript
{
  _id: ObjectId,
  content: String (required),
  imageUrl: String (Cloudinary URL),
  author: ObjectId (ref: 'User', required),
  visibility: String (enum: ['public', 'private'], default: 'public'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `author`: Index for querying user posts
- `createdAt`: Index for sorting by date

**Virtuals:**
- `likesCount`: Count of likes (from Likes collection)
- `commentsCount`: Count of comments (from Comments collection)
- `isLiked`: Boolean (computed per user request)

**Visibility Rules:**
- `public`: Visible to all users
- `private`: Visible only to the author

### Comments Collection

Stores comments and replies on posts with nested structure support.

```javascript
{
  _id: ObjectId,
  content: String (required),
  author: ObjectId (ref: 'User', required),
  post: ObjectId (ref: 'Post', required),
  parentComment: ObjectId (ref: 'Comment', nullable),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `post`: Index for querying post comments
- `parentComment`: Index for querying replies

**Virtuals:**
- `likesCount`: Count of likes on comment
- `repliesCount`: Count of replies to comment
- `isLiked`: Boolean (computed per user request)

**Comment Hierarchy:**
- Top-level comments: `parentComment` is `null`
- Replies: `parentComment` references parent comment

### Likes Collection

Stores like relationships for posts and comments.

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  targetType: String (enum: ['Post', 'Comment'], required),
  targetId: ObjectId (required),
  createdAt: Date (auto)
}
```

**Indexes:**
- Compound unique index: `{user, targetType, targetId}` (prevents duplicate likes)
- `targetId`: Index for querying likes on content

**Constraints:**
- One like per user per target (enforced by unique index)

### Stories Collection

Stores temporary stories with 24-hour expiration.

```javascript
{
  _id: ObjectId,
  imageUrl: String (Cloudinary URL, required),
  author: ObjectId (ref: 'User', required),
  expiresAt: Date (24 hours from creation),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `author`: Index for querying user stories
- `expiresAt`: TTL index for automatic deletion

**Auto-deletion:**
- MongoDB TTL index automatically removes expired stories

## Relationships

### One-to-Many
- User → Posts (one user has many posts)
- User → Comments (one user has many comments)
- User → Likes (one user has many likes)
- Post → Comments (one post has many comments)
- Comment → Replies (one comment has many replies)

### Many-to-Many
- Users ↔ Posts (through Likes)
- Users ↔ Comments (through Likes)

## Data Flow Examples

### Creating a Post
1. User creates post with content and optional image
2. Image uploaded to Cloudinary (client-side)
3. Post document created with imageUrl
4. Post returned with virtual fields populated

### Liking a Post
1. Check if like already exists (user + targetType + targetId)
2. If exists: Delete like (unlike)
3. If not exists: Create like
4. Return liked status

### Commenting on a Post
1. Create comment document
2. Link to post and author
3. If reply: Set parentComment
4. Return populated comment with author details

## Cascade Deletion

### Deleting a Post
- All comments on the post are deleted
- All likes on the post are deleted
- All likes on comments are deleted

### Deleting a Comment
- All replies to the comment are deleted
- All likes on the comment and its replies are deleted

## Performance Considerations

- Indexes on frequently queried fields
- Virtual fields for counts (avoid N+1 queries)
- Sparse indexes for optional unique fields
- TTL indexes for automatic cleanup
- Pagination for large result sets
