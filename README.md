# BuddyScript - Social Media Platform

<div align="center">

![BuddyScript Logo](client/public/assets/images/logo.svg)

A modern, full-stack social media platform built with React, Node.js, Express, and MongoDB.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://buddy-script-23e18.web.app/)
[![Server](https://img.shields.io/badge/server-vercel-black)](https://buddy-script-five.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Documentation](#documentation) • [Deployment](#deployment)

</div>

---

## 📋 Overview

BuddyScript is a feature-rich social media platform that enables users to connect, share posts, create stories, and interact with content through likes, comments, and replies. The platform supports both traditional email/password authentication and Google Sign-In, with real-time updates and a modern, responsive UI.

### ✨ Key Features

- **User Authentication**
  - Traditional email/password registration and login
  - Google OAuth integration
  - JWT-based secure authentication
  - Protected routes and API endpoints

- **Content Creation & Sharing**
  - Create text and image posts with privacy controls (Public/Private)
  - Upload and share stories with 24-hour expiration
  - Cloudinary integration for image hosting
  - Rich text content support

- **Social Interactions**
  - Like/unlike posts, comments, and replies
  - Comment on posts with nested reply support
  - View who liked specific content
  - Real-time interaction updates

- **User Experience**
  - Responsive design for all devices
  - Profile pages with user posts
  - Story reels with visual storytelling
  - Friend suggestions and events feed
  - Modern dropdown navigation menu

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Axios
- **Authentication**: Firebase Auth (Google Sign-In)
- **Image Upload**: Cloudinary SDK
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer (legacy) + Cloudinary
- **CORS**: Configured for production deployment
- **Environment**: dotenv

### DevOps & Deployment
- **Frontend Hosting**: Firebase Hosting
- **Backend Hosting**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Firebase project (for Google Auth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd New_Appify
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Configuration**
   
   See detailed setup instructions:
   - [Client Environment Setup](client/docs/ENVIRONMENT.md)
   - [Server Environment Setup](server/docs/ENVIRONMENT.md)

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev

   # Terminal 2 - Start frontend dev server
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 Documentation

Comprehensive documentation is organized by module:

### Client Documentation
- [Environment Setup](client/docs/ENVIRONMENT.md) - Configuration and environment variables
- [Project Structure](client/docs/STRUCTURE.md) - Frontend architecture and folder organization
- [Components Guide](client/docs/COMPONENTS.md) - Reusable components documentation
- [API Integration](client/docs/API.md) - Frontend API service layer

### Server Documentation
- [Environment Setup](server/docs/ENVIRONMENT.md) - Server configuration
- [API Reference](server/docs/API.md) - Complete API endpoints documentation
- [Database Schema](server/docs/DATABASE.md) - MongoDB models and relationships
- [Authentication](server/docs/AUTHENTICATION.md) - Auth flow and JWT implementation

## 🌐 Deployment

### Production URLs
- **Client**: https://buddy-script-23e18.web.app/
- **Server**: https://buddy-script-five.vercel.app/

### Deployment Guides
- [Frontend Deployment](client/docs/DEPLOYMENT.md) - Firebase Hosting setup
- [Backend Deployment](server/docs/DEPLOYMENT.md) - Vercel deployment guide

## 🔐 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration for production
- Input validation and sanitization
- Secure environment variable management
- Sparse unique indexes for optional fields

## 🎨 UI/UX Features

- Modern, clean interface design
- Responsive layout (mobile, tablet, desktop)
- Smooth transitions and animations
- Toast notifications for user feedback
- Loading states and error handling
- Profile dropdown with settings menu
- Modal dialogs for enhanced interactions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - Initial work and ongoing maintenance

## 🙏 Acknowledgments

- Design inspiration from modern social media platforms
- Firebase for authentication services
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- Vercel and Firebase for deployment platforms

## 📞 Support

For support, email support@buddyscript.com or open an issue in the repository.

---

<div align="center">
Made with ❤️ by the BuddyScript Team
</div>
