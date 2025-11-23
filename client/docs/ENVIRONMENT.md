# Client Environment Setup

## Required Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
# Firebase Configuration (for Google Authentication)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=http://localhost:5000/api  # For development
# VITE_API_URL=https://your-production-api.vercel.app/api  # For production

# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication > Sign-in method > Google
4. Go to Project Settings > General
5. Copy the configuration values to your `.env` file

### 2. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name
4. Go to Settings > Upload > Upload presets
5. Create a new unsigned upload preset
6. Copy the preset name to your `.env` file

### 3. API URL Configuration

- **Development**: Use `http://localhost:5000/api`
- **Production**: Use your deployed backend URL (e.g., Vercel URL)

## Environment File Template

A `.env.example` file is provided in the client directory. Copy it to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Security Notes

- Never commit `.env` files to version control
- The `.env` file is already in `.gitignore`
- Keep your Firebase and Cloudinary credentials secure
- Rotate credentials if they are exposed
