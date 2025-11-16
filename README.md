# 🏛️ Land Administration System

A comprehensive web-based system for managing state land leases and applications in Papua New Guinea. Built with modern web technologies for efficient land administration and management.

[![Built with Same](https://img.shields.io/badge/Built%20with-Same-00D9FF?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiAxMkwxMiAyMkwyMiAxMkwxMiAyWiIgZmlsbD0iIzAwRDlGRiIvPgo8L3N2Zz4K)](https://same.new)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)](https://supabase.com/)

## 🌟 Features

### Core Functionality
- **📊 Dashboard** - Real-time statistics and analytics with interactive charts
- **📝 Application Management** - Submit, track, and manage land lease applications
- **🗺️ GIS Mapping** - Interactive map system with PostGIS integration
- **📅 Event Calendar** - Land Board meeting schedules and events
- **👥 Multi-Role Support** - Admin, Land Officer, Applicant, and Board Member roles
- **🔒 Authentication** - Mock authentication for development (Supabase Auth ready)

### Technical Features
- **Real-time Data** - Live connection to Supabase database
- **Type Safety** - Full TypeScript implementation
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Green Theme** - Custom emerald gradient design
- **Search & Filter** - Advanced filtering across all data
- **Database Views** - Optimized queries for performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/emabi2002/alienatedlandsystem.git
cd alienatedlandsystem
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Set up environment variables**
```bash
# Copy .env.local and add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Run database migrations**

See [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md) for detailed instructions.

Quick version:
- Go to your Supabase SQL Editor
- Run migrations in order from `supabase/migrations/`:
  - `000_enable_extensions.sql`
  - `001_initial_schema_with_namespace.sql`
  - `002_seed_data_with_namespace.sql`
  - `003_create_public_views.sql`

5. **Start development server**
```bash
bun run dev
# or
npm run dev
```

Visit `http://localhost:3000`

## 📋 Important Setup Steps

### Enable GIS Mapping

After running the initial migrations, run this SQL in Supabase to enable GIS mapping:

```sql
CREATE OR REPLACE VIEW public.land_parcels_view AS
SELECT lp.*, p.name AS province_name
FROM land_admin.land_parcels lp
LEFT JOIN land_admin.provinces p ON lp.province_id = p.id;

GRANT SELECT ON public.land_parcels_view TO authenticated, anon;
```

See [.same/QUICK_START.md](.same/QUICK_START.md) for detailed instructions.

## 🗂️ Project Structure

```
land-administration-system/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── applications/      # Applications management
│   │   ├── submit-request/    # Submit new application
│   │   ├── gis/              # GIS mapping system
│   │   ├── calendar/         # Events calendar
│   │   └── land-board/       # Land Board management
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Header.tsx        # App header
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   └── MapComponent.tsx  # Leaflet map
│   └── lib/
│       ├── supabase.ts       # Supabase client
│       ├── auth-context.tsx  # Mock authentication
│       └── database.types.ts # TypeScript types
├── supabase/
│   └── migrations/            # Database migrations
├── .same/                     # Documentation & guides
└── public/                    # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL + PostGIS)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Maps**: Leaflet.js
- **Charts**: Recharts
- **Package Manager**: Bun
- **Deployment**: Netlify-ready

## 📊 Database Schema

The system uses a dedicated `land_admin` schema with the following main tables:

- `provinces` - PNG provinces reference
- `land_parcels` - Land parcels with GIS data
- `applications` - Lease applications
- `leases` - Active and historical leases
- `land_board_meetings` - Meeting schedules
- `land_board_decisions` - Board decisions
- `events` - Calendar events
- `profiles` - User profiles

See [SCHEMA_SETUP_GUIDE.md](SCHEMA_SETUP_GUIDE.md) for detailed schema documentation.

## 👥 User Roles

The system supports four user roles (currently in dev mode):

1. **Admin** - Full system access
2. **Land Officer** - Manage applications and leases
3. **Applicant** - Submit and view own applications
4. **Land Board Member** - Review applications and make decisions

Switch between users in dev mode via the profile dropdown.

## 📚 Documentation

- [QUICK_START.md](.same/QUICK_START.md) - Quick setup guide
- [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md) - Database setup
- [SCHEMA_SETUP_GUIDE.md](SCHEMA_SETUP_GUIDE.md) - Schema details
- [AUTH_SETUP.md](.same/AUTH_SETUP.md) - Authentication guide
- [GIS_FIX_INSTRUCTIONS.md](.same/GIS_FIX_INSTRUCTIONS.md) - GIS troubleshooting
- [STATUS.md](.same/STATUS.md) - Current project status

## 🚀 Deployment

### Netlify

The project is configured for Netlify deployment:

```bash
bun run build
```

Deploy via Netlify CLI or connect your GitHub repository to Netlify.

See [netlify.toml](netlify.toml) for configuration.

## 🔐 Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [documentation](.same/)
- Review [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] File upload functionality (Supabase Storage)
- [ ] Application detail/edit pages
- [ ] Land Board meeting management
- [ ] Email notifications
- [ ] PDF/Excel report generation
- [ ] Real Supabase authentication
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

## 👨‍💻 Development

Built with [Same](https://same.new) - AI-powered full-stack development platform.

---

**Note**: This system is currently in development mode with mock authentication. Before deploying to production, implement real authentication using Supabase Auth.

Made with ❤️ for Papua New Guinea Land Administration
