# Frontend Deployment Guide

## Firebase Hosting Deployment

### Prerequisites
- Firebase CLI installed globally
- Firebase project created
- Build artifacts ready

### Initial Setup

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   cd client
   firebase init
   ```
   
   Select:
   - Hosting: Configure files for Firebase Hosting
   - Use existing project: Select your project
   - Public directory: `dist`
   - Single-page app: `Yes`
   - GitHub deploys: `No` (or `Yes` if you want CI/CD)

### Build and Deploy

1. **Update Environment Variables**
   
   Ensure `.env` has production API URL:
   ```env
   VITE_API_URL=https://your-production-api.vercel.app/api
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```
   
   This creates optimized production files in the `dist/` directory.

3. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```
   
   Or deploy only hosting:
   ```bash
   firebase deploy --only hosting
   ```

### Deployment Output

After successful deployment, you'll receive:
- **Hosting URL**: `https://your-project-id.web.app`
- **Console URL**: Link to Firebase Console

### Continuous Deployment

For automatic deployments on git push:

1. **Connect GitHub Repository**
   ```bash
   firebase init hosting:github
   ```

2. **Configure GitHub Actions**
   - Firebase will create `.github/workflows/` files
   - Commits to main branch will trigger deployments

### Environment-Specific Builds

For multiple environments:

```bash
# Development
VITE_API_URL=http://localhost:5000/api npm run build

# Staging
VITE_API_URL=https://staging-api.vercel.app/api npm run build

# Production
VITE_API_URL=https://production-api.vercel.app/api npm run build
```

### Rollback

To rollback to a previous version:

1. Go to Firebase Console
2. Navigate to Hosting
3. Select "Release history"
4. Click "Rollback" on desired version

### Custom Domain

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

### Performance Optimization

- **Code Splitting**: Vite automatically splits code
- **Asset Optimization**: Images optimized during build
- **Caching**: Firebase Hosting provides automatic caching
- **CDN**: Global CDN distribution included

### Troubleshooting

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Deployment Fails:**
```bash
# Check Firebase CLI version
firebase --version

# Update if needed
npm install -g firebase-tools@latest
```

**404 Errors:**
- Ensure `firebase.json` has proper rewrites for SPA
- Check that `dist/index.html` exists

### Firebase Configuration

`firebase.json` example:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```
