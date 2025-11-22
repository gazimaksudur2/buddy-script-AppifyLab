# Buddy Script - Frontend

This is the React frontend for the Buddy Script social media application.

## Tech Stack

- React 18
- React Router v6
- Firebase Authentication (client SDK)
- Axios
- React Toastify
- Bootstrap 5

## Available Scripts

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Comments.js   # Comment system with replies
│   ├── CreatePost.js # Post creation form
│   ├── Header.js     # Navigation header
│   ├── LikesList.js  # Modal for showing likes
│   ├── Post.js       # Individual post display
│   └── PrivateRoute.js # Route protection
├── pages/            # Page components
│   ├── Login.js      # Login page
│   ├── Register.js   # Registration page
│   └── Feed.js       # Main feed page
├── context/          # React Context
│   └── AuthContext.js # Auth state management
├── services/         # API layer
│   └── api.js        # Axios instance & API calls
├── config/           # Configuration
│   └── firebase.js   # Firebase config
├── styles/           # CSS files
│   ├── auth.css
│   └── custom.css
├── App.js            # Root component
└── index.js          # Entry point
```

## Environment Variables

Create a `.env` file in this directory with:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_URL=http://localhost:5000/api
```

## Key Features

- User authentication with Firebase
- Protected routes
- Post creation with image upload
- Like/unlike system
- Comment and reply system
- Real-time UI updates
- Responsive design
- Toast notifications

## Development

1. Install dependencies: `npm install`
2. Configure environment variables
3. Start development server: `npm start`

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Learn More

- [React Documentation](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Firebase Docs](https://firebase.google.com/docs)

