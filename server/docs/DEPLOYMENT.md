# Backend Deployment Guide

## Vercel Serverless Deployment

### Prerequisites
- Vercel account
- Vercel CLI installed (optional)
- MongoDB Atlas database
- Environment variables configured

### Deployment Methods

#### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Server Directory**
   ```bash
   cd server
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy: `Yes`
   - Scope: Select your account/team
   - Link to existing project: `No` (first time)
   - Project name: `buddy-script-server` (or your choice)
   - Directory: `./` (current directory)
   - Override settings: `No`

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `server` directory as root
   - Click "Deploy"

### Environment Variables

Set environment variables in Vercel Dashboard:

1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
```

**Important**: Use different credentials for production!

### Vercel Configuration

The `vercel.json` file configures serverless deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### Post-Deployment Tasks

1. **Run Database Migrations**
   
   If needed, run the index fix script:
   ```bash
   # Connect to your production database
   MONGODB_URI=your_production_uri node fixFirebaseUidIndex.js
   ```

2. **Test API Endpoints**
   ```bash
   curl https://your-app.vercel.app/
   curl https://your-app.vercel.app/api/posts
   ```

3. **Update Client Environment**
   
   Update client `.env` with production API URL:
   ```env
   VITE_API_URL=https://your-app.vercel.app/api
   ```

### Monitoring and Logs

1. **View Logs**
   - Vercel Dashboard > Your Project > Deployments
   - Click on a deployment > View Function Logs

2. **Real-time Logs (CLI)**
   ```bash
   vercel logs
   ```

### Domain Configuration

1. **Add Custom Domain**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Renews automatically

### Performance Optimization

- **Cold Starts**: Vercel serverless functions may have cold starts
- **Database Connections**: Use connection pooling
- **Caching**: Implement Redis or similar for frequently accessed data
- **CDN**: Static assets served via Vercel's global CDN

### Troubleshooting

**Deployment Fails:**
```bash
# Check build logs in Vercel Dashboard
# Ensure all dependencies are in package.json
# Verify vercel.json configuration
```

**Database Connection Issues:**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has proper permissions

**CORS Errors:**
- Verify CORS configuration in `index.js`
- Check `vercel.json` headers configuration
- Ensure client origin is in allowed origins list

**Environment Variables Not Working:**
- Redeploy after adding environment variables
- Check variable names match exactly
- Verify no typos in variable values

### Rollback

To rollback to a previous deployment:

1. Go to Vercel Dashboard > Deployments
2. Find the working deployment
3. Click "..." menu > "Promote to Production"

### CI/CD Pipeline

For automated deployments:

1. **GitHub Actions** (example workflow)
   ```yaml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.ORG_ID }}
             vercel-project-id: ${{ secrets.PROJECT_ID }}
   ```

### Cost Optimization

- **Hobby Plan**: Free tier available
- **Pro Plan**: For production apps with higher limits
- **Monitor Usage**: Check Vercel Dashboard for usage metrics

### Security Checklist

- [ ] Environment variables set in Vercel Dashboard
- [ ] MongoDB IP whitelist configured
- [ ] JWT secret is strong and unique
- [ ] CORS origins restricted to your domains
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Sensitive data not in code repository
