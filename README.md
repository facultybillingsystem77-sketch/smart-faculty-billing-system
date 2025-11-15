# Faculty Billing & Salary Automation System

A modern, full-stack web application for automating faculty workload management, salary calculations, and billing processes with multi-role support, approval workflows, and comprehensive reporting.

## Project Status

**Phase 1 Complete**: Foundation with database schema, authentication, and infrastructure
**Phase 2 Ready**: Core UI modules ready for development

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for detailed status.

## Features

### Implemented Features

- **Complete Database Schema**: 16 tables with Row Level Security
- **Multi-Role Authentication**: Admin, Faculty, HOD, Super Admin, Accountant
- **Secure API**: RESTful endpoints with Supabase integration
- **Modern UI Framework**: Next.js 14 with TypeScript and Tailwind CSS
- **Production-Ready Build**: Optimized and deployable

### Features to be Built

- Faculty & Department Management
- Workload Entry & Tracking
- Approval Workflow System
- Automated Salary Calculations
- Salary Slip Generation (PDF)
- Leave Management
- Messaging System
- Notification Center
- Reports & Analytics
- Excel Export

See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for complete feature list.

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)
- **File Storage**: Supabase Storage

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-faculty-billing-system
   npm install
   ```

2. **Configure Supabase**

   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=your-random-secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Database is already configured**

   The database schema has been applied via Supabase migrations. See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for details.

4. **Build and run**
   ```bash
   npm run build
   npm run dev
   ```

Visit http://localhost:3000

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Database Schema

The system includes 16 tables organized into:

### Core Tables
- departments, academic_years, users, subjects

### Workload Management
- workload_entries, workload_approvals, faculty_subject_assignments

### Salary System
- salary_calculations, salary_adjustments, salary_slips, salary_rate_configurations

### Support Tables
- leave_records, messages, notifications, monthly_reports, audit_logs

All tables have Row Level Security (RLS) enabled with role-based access policies.

## Creating Your First Admin User

Use Supabase Dashboard to create an admin user:

1. Go to Authentication → Users
2. Add a new user with email verification
3. Insert a row in the `users` table with role='admin'

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## Key Features to be Built

### Approval Workflow
- Faculty submits workload entries
- Admin/HOD reviews and approves
- Lock approved entries
- Email notifications

### Salary Calculation
- Automated calculation based on rates
- Custom rates per faculty
- Leave deductions
- Manual adjustments
- PDF salary slips

### Reports & Analytics
- Department-wise reports
- Monthly summaries
- Faculty performance metrics
- Excel export
- Visual dashboards

## Deployment

### Recommended: Vercel + Supabase

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository
   - Configure environment variables
   - Deploy

3. **Configure Supabase**
   - Set redirect URLs
   - Configure email templates
   - Enable rate limiting

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## Security Features

- **Row Level Security**: Every table protected with RLS policies
- **Supabase Auth**: Secure authentication and session management
- **Role-Based Access**: 5 distinct roles with granular permissions
- **Audit Logging**: Complete activity tracking
- **Data Encryption**: At rest and in transit
- **Input Validation**: Zod schema validation

## Architecture

### Frontend
- Next.js 14 App Router
- TypeScript for type safety
- Tailwind CSS + Radix UI
- React Hook Form + Zod

### Backend
- Next.js API Routes
- Supabase PostgreSQL
- Row Level Security
- RESTful API design

### Database
- 16 production-ready tables
- Comprehensive RLS policies
- Indexed for performance
- Automatic backups

## Documentation

- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Detailed status and roadmap
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Executive summary
- [.env.example](./.env.example) - Environment variable template

## Development Workflow

### Testing Protocol

After every feature:
1. Unit tests
2. Integration tests
3. Build verification: `npm run build`
4. Manual UI testing
5. Security review

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Git pre-commit hooks

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API endpoints
│   │   ├── dashboard/         # Dashboard pages
│   │   └── login/             # Auth pages
│   ├── components/            # React components
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   │   ├── supabase/         # Supabase client
│   │   └── auth.ts           # Auth helpers
│   └── styles/               # Global styles
├── IMPLEMENTATION_STATUS.md   # Detailed status
├── SETUP_GUIDE.md            # Setup instructions
└── PROJECT_SUMMARY.md        # Executive summary
```

## Next Steps

1. **Review Documentation**
   - Read IMPLEMENTATION_STATUS.md
   - Follow SETUP_GUIDE.md

2. **Set Up Supabase**
   - Create project
   - Configure environment variables
   - Create admin user

3. **Start Development**
   - Begin with Department Management UI
   - Then Subject Management
   - Follow with Faculty Management

## Timeline

- **Phase 1** (COMPLETE): Foundation
- **Phase 2** (8-12 weeks): Core UI modules
- **Phase 3** (2-3 weeks): Advanced features
- **Phase 4** (1-2 weeks): Testing & launch

## Support

For questions and issues:
- Review documentation files
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Create GitHub issues

## License

MIT License

---

**Version**: 1.0.0-alpha
**Status**: Phase 1 Complete - Ready for Phase 2
**Last Updated**: 2025-11-15

Built with Next.js, TypeScript, Supabase, and Tailwind CSS.
