# Components Guide

## Overview

This guide documents the reusable React components in the BuddyScript application.

## Feed Components

### PostCard

Displays a single post with all interactions (like, comment, share).

**Location**: `src/components/feed/PostCard.jsx`

**Props**:
```javascript
{
  post: {
    _id: string,
    content: string,
    imageUrl: string,
    author: {
      _id: string,
      firstName: string,
      lastName: string,
      profilePicture: string
    },
    visibility: 'public' | 'private',
    likesCount: number,
    commentsCount: number,
    isLiked: boolean,
    recentLikes: Array<User>,
    createdAt: string,
    updatedAt: string
  }
}
```

**Features**:
- Like/unlike functionality
- Comment creation and display
- Nested replies support
- Show who liked the post
- Dynamic like images (top 3 likers)
- Privacy indicator

**Usage**:
```jsx
import PostCard from './components/feed/PostCard';

<PostCard post={postData} />
```

---

### CreatePost

Form component for creating new posts.

**Location**: `src/components/feed/CreatePost.jsx`

**Props**:
```javascript
{
  onPostCreated: () => void  // Callback after post creation
}
```

**Features**:
- Text content input
- Image upload via Cloudinary
- Privacy selection (Public/Private)
- User profile picture display

**Usage**:
```jsx
import CreatePost from './components/feed/CreatePost';

<CreatePost onPostCreated={fetchPosts} />
```

---

### StoryReel

Horizontal scrollable list of stories.

**Location**: `src/components/feed/StoryReel.jsx`

**Props**:
```javascript
{
  stories: Array<Story>,
  onStoryCreated: () => void  // Callback after story creation
}
```

**Features**:
- Create new story with image upload
- Display user stories
- Horizontal scroll
- Story expiration handling

**Usage**:
```jsx
import StoryReel from './components/feed/StoryReel';

<StoryReel stories={storiesData} onStoryCreated={fetchStories} />
```

---

### LeftSidebar

Left sidebar with user suggestions and events.

**Location**: `src/components/feed/LeftSidebar.jsx`

**Props**:
```javascript
{
  suggestions: Array<User>,
  events: Array<Event>
}
```

**Features**:
- Friend suggestions list
- Upcoming events
- Responsive (hidden on mobile)

---

### RightSidebar

Right sidebar with friend suggestions.

**Location**: `src/components/feed/RightSidebar.jsx`

**Props**:
```javascript
{
  suggestions: Array<User>
}
```

**Features**:
- Friend suggestions with avatars
- Add friend buttons
- Responsive (hidden on mobile)

---

### LikesModal

Modal dialog showing users who liked content.

**Location**: `src/components/feed/LikesModal.jsx`

**Props**:
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  likes: Array<Like>,
  loading: boolean
}
```

**Features**:
- User list with avatars
- Loading state
- Close button
- Backdrop click to close

**Usage**:
```jsx
import LikesModal from './components/feed/LikesModal';

<LikesModal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)}
  likes={likesData}
  loading={isLoading}
/>
```

---

## Navigation Components

### Navbar

Main navigation bar with user menu.

**Location**: `src/components/Navbar.jsx`

**Features**:
- Logo and branding
- Search bar
- Navigation icons (Home, Friends, Notifications, Messages)
- Profile dropdown menu
- Settings, Help, Logout options
- Responsive design

**Usage**:
```jsx
import Navbar from './components/Navbar';

<Navbar />
```

---

## Layout Components

### MainLayout

Wrapper layout with navbar and content area.

**Location**: `src/layouts/MainLayout.jsx`

**Props**:
```javascript
{
  children: ReactNode
}
```

**Features**:
- Fixed navbar at top
- Content area with padding
- Background color
- Responsive spacing

**Usage**:
```jsx
import MainLayout from './layouts/MainLayout';

<MainLayout>
  <YourPageContent />
</MainLayout>
```

---

## Routing Components

### PrivateRoute

Protected route wrapper requiring authentication.

**Location**: `src/routes/PrivateRoute.jsx`

**Props**:
```javascript
{
  children: ReactNode
}
```

**Features**:
- Check authentication status
- Redirect to login if not authenticated
- Loading state during auth check

**Usage**:
```jsx
import PrivateRoute from './routes/PrivateRoute';

<Route path="/feed" element={
  <PrivateRoute>
    <FeedPage />
  </PrivateRoute>
} />
```

---

## Custom Hooks

### useAuth

Access authentication context.

**Location**: `src/hooks/useAuth.js`

**Returns**:
```javascript
{
  user: User | null,
  loading: boolean,
  login: (email, password) => Promise<void>,
  loginWithGoogle: () => Promise<void>,
  register: (userData) => Promise<void>,
  logOut: () => void
}
```

**Usage**:
```jsx
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user, loading, logOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={logOut}>Logout</button>
    </div>
  );
}
```

---

## Styling Guidelines

### Tailwind CSS Classes

Common patterns used throughout components:

**Containers**:
```jsx
<div className="container mx-auto px-4">
```

**Cards**:
```jsx
<div className="bg-white rounded-lg shadow-sm p-6">
```

**Buttons**:
```jsx
<button className="bg-[#1890FF] text-white px-4 py-2 rounded-md hover:bg-[#1570CD]">
```

**Input Fields**:
```jsx
<input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1890FF]" />
```

### Color Palette

- Primary Blue: `#1890FF`
- Background: `#F0F2F5`
- Text Primary: `#212121`
- Text Secondary: `#666666`
- Border: `#E8E8E8`

---

## Best Practices

1. **Props Validation**: Use PropTypes or TypeScript for type checking
2. **Error Handling**: Always wrap API calls in try-catch
3. **Loading States**: Show loading indicators during async operations
4. **Responsive Design**: Use Tailwind responsive prefixes (sm:, md:, lg:)
5. **Accessibility**: Include proper ARIA labels and keyboard navigation
6. **Code Splitting**: Use React.lazy() for large components
7. **Memoization**: Use useMemo/useCallback for expensive operations
