# Client Project Structure

## Directory Overview

```
client/
├── public/                 # Static assets
│   └── assets/
│       └── images/        # Image assets
├── src/
│   ├── components/        # Reusable React components
│   │   ├── feed/         # Feed-specific components
│   │   └── Navbar.jsx    # Navigation bar
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.js    # Authentication hook
│   ├── layouts/          # Layout components
│   │   └── MainLayout.jsx
│   ├── pages/            # Page components (routes)
│   │   ├── FeedPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── RegistrationPage.jsx
│   ├── providers/        # Context providers
│   │   └── AuthProvider.jsx
│   ├── routes/           # Routing configuration
│   │   ├── PrivateRoute.jsx
│   │   └── Router.jsx
│   ├── services/         # API and external services
│   │   ├── api.js       # API service layer
│   │   ├── cloudinary.js # Image upload service
│   │   └── firebase.js  # Firebase configuration
│   ├── App.jsx          # Root component
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── docs/                 # Documentation
├── .env                  # Environment variables (not in git)
├── .env.example         # Environment template
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## Key Directories

### `/src/components`
Reusable UI components organized by feature:
- **feed/**: Feed-related components (PostCard, CreatePost, StoryReel, etc.)
- **Navbar.jsx**: Main navigation with profile dropdown

### `/src/pages`
Top-level route components:
- **FeedPage**: Main feed with posts, stories, and sidebars
- **LoginPage**: User authentication
- **RegistrationPage**: New user signup
- **ProfilePage**: User profile with posts

### `/src/services`
External service integrations:
- **api.js**: Centralized API calls to backend
- **cloudinary.js**: Image upload to Cloudinary
- **firebase.js**: Firebase Auth configuration

### `/src/providers`
React Context providers:
- **AuthProvider**: Global authentication state

### `/src/hooks`
Custom React hooks:
- **useAuth**: Access authentication context

## Component Architecture

### Layout Hierarchy
```
App
└── RouterProvider
    └── Routes
        ├── LoginPage
        ├── RegistrationPage
        └── PrivateRoute
            └── MainLayout
                ├── Navbar
                └── Page Content
                    ├── FeedPage
                    └── ProfilePage
```

### State Management
- **Global State**: React Context (AuthProvider)
- **Local State**: useState hooks in components
- **Server State**: API calls with useEffect

## Styling Approach

- **Framework**: Tailwind CSS
- **Component Library**: DaisyUI
- **Custom Styles**: Utility-first with Tailwind classes
- **Responsive**: Mobile-first design

## Build Configuration

- **Bundler**: Vite
- **Dev Server**: Vite dev server (port 5173)
- **Build Output**: `dist/` directory
- **Environment**: Vite environment variables (VITE_ prefix)
