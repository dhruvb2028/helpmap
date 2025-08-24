# HelpMap - Community Aid Locator

HelpMap is a community-driven web application that connects vulnerable populations with essential resources including food banks, shelters, healthcare services, and blood donation centers.

## 🌟 Features

- **Interactive Map**: Browse resources on an interactive map with color-coded pins
- **Search & Filter**: Find resources by location, type, or keyword
- **Add Resources**: Community members can add new resources without registration
- **Mobile-Friendly**: Responsive design optimized for all devices
- **Real-time Updates**: Resources appear on the map immediately after submission
- **Directions Integration**: Get directions to any resource location

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Optional: Supabase account (app works with sample data without it)
- Optional: LocationIQ account for enhanced geocoding (has fallback)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd helpmap
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)**

The app includes comprehensive sample data and works immediately without any setup!

## 🌐 Deployment to Netlify

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose your GitHub repository
   - Netlify automatically detects settings from `netlify.toml`
   - Click "Deploy site"

### Option 2: Manual Deploy

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify's deploy interface

### Environment Variables (Optional)

The app works perfectly with sample data. To connect to Supabase:

1. In Netlify dashboard: Site settings → Environment variables
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

## 📁 Deployment Configuration

- `netlify.toml`: Netlify deployment settings with Next.js plugin
- `next.config.js`: Optimized for static deployment
- `.env.example`: Environment variables template

2. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Settings > API to find your project URL and anon key
   - The database migration will be applied automatically when you first run the app

3. **Set up LocationIQ**
   - Create a free LocationIQ account at [locationiq.com](https://locationiq.com)
   - Get your access token from the Dashboard > Access Tokens page
   - Free tier includes 5,000 requests per day

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual credentials
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

The app will automatically populate with sample data on first load, including food banks, shelters, health centers, and blood donation centers in New York City.

## 🗺️ Usage

### For Resource Seekers
1. Visit the map page
2. Use search and filters to find specific types of resources
3. Click on map pins to view resource details
4. Click "Directions" to navigate to the resource

### For Resource Providers
1. Click "Add Resource" on the map page
2. Fill out the form with resource details
3. Submit to add the resource to the map immediately

## 🛠️ Technical Stack

- **Frontend**: Next.js 13+, React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet with LocationIQ tiles
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
helpmap/
├── app/
│   ├── api/                 # API routes
│   │   ├── resources/       # Resource CRUD operations
│   │   └── geocode/         # Address geocoding
│   ├── map/                 # Map page
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Map.tsx             # Interactive map component
│   ├── AddResourceForm.tsx # Resource submission form
│   ├── SearchFilters.tsx   # Search and filter controls
│   └── ResourcePopup.tsx   # Resource detail popup
├── lib/
│   └── supabase.ts         # Supabase client configuration
└── supabase/
    └── migrations/         # Database schema
```

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure environment variables**
   - Add the same variables from `.env.local` to your Vercel project settings

3. **Deploy**
   - Vercel will automatically deploy your app

### Alternative Deployment Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables are correctly set
3. Ensure your Supabase database schema matches the migration
4. Check that your LocationIQ token has the necessary permissions

## 🎯 Roadmap

- [ ] Resource verification system
- [ ] User ratings and reviews
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Resource availability status
- [ ] Email notifications for new resources

---

**Built with ❤️ for communities in need**