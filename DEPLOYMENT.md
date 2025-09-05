# Deployment Guide

## Production Deployment Checklist

### 1. Environment Setup
- [ ] Supabase project configured
- [ ] Environment variables set
- [ ] Database tables created with RLS policies
- [ ] GitHub repository connected

### 2. Static Build Preparation
```bash
# Install dependencies
npm install

# Build static site
npm run build
node scripts/build-static.js
```

### 3. Hosting Options

#### Option A: Netlify (Easiest)
1. Drag and drop the `web/` folder to Netlify
2. Configure environment variables in Netlify dashboard
3. Enable automatic deploys from GitHub

#### Option B: Vercel
1. Connect GitHub repository
2. Set build command: `npm run build && node scripts/build-static.js`
3. Set output directory: `web`
4. Configure environment variables

#### Option C: GitHub Pages
1. Enable GitHub Pages in repository settings
2. GitHub Actions will automatically deploy on push to main
3. Access at `https://username.github.io/repository-name`

#### Option D: AWS S3 + CloudFront
1. Create S3 bucket with static website hosting
2. Upload `web/` contents to bucket
3. Create CloudFront distribution
4. Configure custom domain (optional)

### 4. GitHub Actions Setup

#### Required Secrets
Go to Repository Settings → Secrets and Variables → Actions

Add these secrets:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Service role key (not anon key)

#### Workflows Included
- **Update Leaderboard**: Runs hourly, updates leaderboard data
- **Build and Deploy**: Builds on every push, deploys to GitHub Pages

### 5. Custom Domain Setup

#### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS with your domain provider

#### Vercel  
1. Go to Project Settings → Domains
2. Add custom domain
3. Configure DNS records

#### GitHub Pages
1. Add `CNAME` file to `web/` directory with your domain
2. Configure DNS with your domain provider
3. Enable HTTPS in repository settings

### 6. Monitoring & Analytics

#### Supabase Analytics
- Monitor API usage in Supabase dashboard
- Check database performance
- Review authentication logs

#### Hosting Analytics
- Enable analytics in your hosting provider
- Monitor site performance and uptime
- Track user engagement

### 7. Security Considerations

#### HTTPS
- Ensure HTTPS is enabled (required for API keys)
- Most hosting providers enable this automatically

#### CORS
- Supabase CORS is configured for your domain
- Update if using custom domain

#### Rate Limiting
- Consider implementing rate limiting for API calls
- Monitor for abuse in Supabase logs

### 8. Performance Optimization

#### CDN
- Use CDN for static assets (most hosts include this)
- Consider image optimization

#### Caching
- Configure appropriate cache headers
- Leverage browser caching for static assets

#### Bundle Size
- Monitor bundle size in build output
- Consider code splitting if needed

### 9. Backup & Recovery

#### Database
- Supabase handles automated backups
- Consider exporting critical data regularly

#### Code
- GitHub repository serves as backup
- Tag releases for easy rollback

### 10. Launch Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Static build working locally
- [ ] Deployment successful
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] GitHub Actions working
- [ ] Leaderboard data updating
- [ ] All links working
- [ ] Mobile responsive
- [ ] Cross-browser tested

## Troubleshooting

### Build Issues
- Check Node.js version (requires 18+)
- Verify all dependencies installed
- Check environment variables

### Deployment Issues
- Verify output directory settings
- Check build logs for errors
- Ensure static files are correctly generated

### API Issues
- Verify Supabase configuration
- Check API key formats
- Monitor network requests in browser dev tools

### GitHub Actions Issues
- Check workflow permissions
- Verify secrets are configured
- Review action logs for errors

## Support

For deployment issues:
1. Check the troubleshooting section above
2. Review hosting provider documentation
3. Create an issue in the GitHub repository
4. Check Supabase documentation for backend issues