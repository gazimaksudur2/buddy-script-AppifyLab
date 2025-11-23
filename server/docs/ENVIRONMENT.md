# Server Environment Setup

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user:
   - Database Access > Add New Database User
   - Choose password authentication
   - Save username and password
4. Whitelist your IP address:
   - Network Access > Add IP Address
   - For development: Add `0.0.0.0/0` (allow from anywhere)
   - For production: Add specific IP addresses
5. Get connection string:
   - Clusters > Connect > Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database_name>` with your database name

### 2. JWT Secret Generation

Generate a secure random string for JWT_SECRET:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use any secure random string generator
```

### 3. Environment-Specific Configuration

#### Development
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
```

#### Production (Vercel)
Set environment variables in Vercel dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable with production values

## Database Indexes

After first deployment, run the index fix script to ensure proper database indexes:

```bash
node fixFirebaseUidIndex.js
```

This creates a sparse unique index for the `firebaseUid` field, allowing multiple users with null values (email/password auth) while maintaining uniqueness for Google auth users.

## Security Best Practices

- Use strong, unique JWT secrets (minimum 32 characters)
- Never commit `.env` files to version control
- Rotate JWT secrets periodically
- Use different credentials for development and production
- Enable MongoDB Atlas IP whitelisting in production
- Keep MongoDB connection strings secure
