# HelpMap - Community Resource Locator

HelpMap is a comprehensive web application that connects vulnerable populations with essential community resources including food banks, shelters, healthcare services, and blood donation centers.

## 🌟 Features

- **Interactive Map**: View all resources on an interactive map with custom markers for different resource types
- **Smart Filtering**: Filter resources by type (Food, Shelter, Health, Blood) 
- **Search Functionality**: Search for resources by name, address, or description
- **Resource Details**: View detailed information including contact details, descriptions, and locations
- **Add Resources**: Community members can add new resources to help others
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates**: Resources are updated in real-time across all users

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Supabase account (optional - app works with sample data if database is not connected)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd helpmap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   The app comes pre-configured with sample Supabase credentials for demo purposes. For production, update the values in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN=your_locationiq_token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Sample Data

The application comes with comprehensive sample data including:

- **16 Sample Resources** across 4 categories:
  - 🍽️ **Food Resources** (4 locations): Food banks, community kitchens, food pantries
  - 🏠 **Shelter Resources** (4 locations): Emergency shelters, crisis centers, transitional housing
  - 🏥 **Health Resources** (4 locations): Community health centers, mobile clinics, mental health services
  - 🩸 **Blood Resources** (4 locations): Blood donation centers, blood banks, mobile blood drives

- All sample resources are located in New York City with realistic:
  - Names and descriptions
  - Contact information
  - Operating hours and services
  - Geographic coordinates for accurate map display

## 🎯 Usage

### For Resource Seekers

1. **Explore the Map**: Visit `/map` to see all available resources
2. **Filter by Type**: Use the filter buttons to show only specific types of resources
3. **Search**: Use the search bar to find resources by name, location, or services
4. **Get Details**: Click on any map marker to see detailed information
5. **Get Directions**: Use the address information to navigate to resources

### For Community Organizations

1. **Add Resources**: Click "Add Resource" to contribute new community resources
2. **Provide Details**: Fill out comprehensive information including:
   - Resource name and type
   - Complete address
   - Contact information
   - Service description
   - Operating hours

### For Developers

1. **API Endpoints**:
   - `GET /api/resources` - Fetch all resources with optional filtering
   - `POST /api/resources` - Add new resources
   - `POST /api/geocode` - Convert addresses to coordinates

2. **Database Schema**: See `supabase/migrations/` for the complete database structure

## 🛠️ Technology Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Maps**: Leaflet, React-Leaflet
- **Database**: Supabase (PostgreSQL)
- **Geocoding**: LocationIQ API
- **Deployment**: Vercel-ready

## 🔧 Configuration

### Database Setup (Optional)

If you want to connect to your own Supabase database:

1. Create a new Supabase project
2. Run the migration in `supabase/migrations/20250821083921_amber_spring.sql`
3. Update your `.env.local` with your Supabase credentials
4. Run the database initialization:
   ```bash
   npm run init-db
   ```

### Geocoding Setup (Optional)

For address-to-coordinates conversion when adding new resources:

1. Sign up for a free LocationIQ account
2. Get your API access token
3. Add it to your `.env.local`:
   ```
   NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN=your_token_here
   ```

## 🌍 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN`

## 📈 Features in Detail

### Resource Categories

- **Food 🍽️**: Food banks, soup kitchens, pantries, meal programs
- **Shelter 🏠**: Emergency shelters, transitional housing, crisis centers
- **Health 🏥**: Community health centers, clinics, mental health services
- **Blood 🩸**: Blood donation centers, blood drives, plasma centers

### Search & Filter

- **Type Filter**: Show only specific resource types
- **Text Search**: Search across names, addresses, and descriptions
- **Real-time Results**: Instant filtering and search results
- **Map Integration**: Filtered results update the map view automatically

### Accessibility

- **Mobile Responsive**: Optimized for all screen sizes
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **High Contrast**: Readable color schemes and typography

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:

- Code style and standards
- How to submit issues and feature requests
- Pull request process
- Community guidelines

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our discussions for questions and collaboration

## 🔮 Roadmap

- [ ] User authentication and profiles
- [ ] Resource reviews and ratings
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] SMS/text notifications
- [ ] Integration with more mapping services
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and caching

---

**HelpMap** - Connecting communities, one resource at a time. 💙
