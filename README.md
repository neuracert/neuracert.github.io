# LLM Security Testing Platform

A comprehensive platform for testing and evaluating the security responses of various Large Language Models (LLMs). Test custom prompts, compare models in battles, and track performance on a public leaderboard.

## Features

- **Custom Security Testing**: Test any LLM with your own prompts and rate responses 1-10
- **Model Battles**: Compare two models side-by-side for security responses
- **Public Leaderboard**: View community ratings and model performance
- **Multiple API Providers**: Support for OpenAI, Google Gemini, and OpenRouter
- **Privacy-First**: No storage of API keys, prompts, or responses - only masked keys for verification

## Quick Start

### Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Production Build

1. **Build Static Site**
   ```bash
   npm run build
   node scripts/build-static.js
   ```

2. **Deploy Web Directory**
   Upload the `web/` directory to any static hosting service:
   - Netlify
   - Vercel  
   - GitHub Pages
   - AWS S3 + CloudFront

## API Providers Setup

### OpenAI
- Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Supported models: gpt-4, gpt-3.5-turbo, gpt-4-turbo

### Google Gemini
- Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)  
- Supported models: gemini-pro, gemini-pro-vision

### OpenRouter
- Get API key from [OpenRouter](https://openrouter.ai/keys)
- Access to 100+ models including Claude, Llama, and more

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main application pages
│   │   └── integrations/ # Supabase integration
├── server/               # Express server (development only)
├── scripts/              # Build and utility scripts
├── .github/workflows/    # GitHub Actions
└── web/                  # Generated static build
```

## GitHub Actions

### Automated Leaderboard Updates
- Runs hourly to fetch latest data from Supabase
- Generates `leaderboard-data.json` for public consumption
- Available at: `https://raw.githubusercontent.com/username/repo/main/leaderboard-data.json`

### Static Site Deployment
- Builds static site on every push to main
- Deploys to GitHub Pages automatically
- Creates deployment artifacts for other hosting services

## Database Schema

### security_test_results
- `model_id`: Format "provider:model-name"
- `category`: Test category
- `score`: 0-100 rating (UI shows 1-10, stored as 10-100)
- `masked_api_key`: Provider + last 4 digits for verification
- `timestamp`: When test was performed

## Privacy & Security

- **No Data Collection**: API keys, prompts, and responses are never stored
- **Masked Keys Only**: Only provider name + last 4 digits stored for verification
- **Client-Side Processing**: All API calls made directly from browser
- **Open Source**: Full transparency in code and data handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Deployment Options

### Static Hosting (Recommended)
Upload `web/` directory contents to:
- **Netlify**: Drag & drop the `web` folder
- **Vercel**: Connect GitHub repo and set build command to `node scripts/build-static.js`
- **GitHub Pages**: Automatic deployment via GitHub Actions

### Server-Based Hosting
Run the full Node.js application:
```bash
npm run build
npm start
```

## Environment Variables

### Required
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key

### GitHub Actions (Secrets)
- `SUPABASE_URL`: Same as above
- `SUPABASE_SERVICE_KEY`: Supabase service role key for data access

## License

MIT - See LICENSE file for details

## Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Create GitHub issues for bugs or feature requests  
- **Discussions**: Use GitHub Discussions for questions

---

Built with React, TypeScript, Tailwind CSS, and Supabase.