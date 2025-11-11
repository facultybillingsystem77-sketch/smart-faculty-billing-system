# Smart Faculty Billing & Analytics System

A comprehensive full-stack application for faculty workload management, billing calculations, and analytics with AI-powered features.

## 🚀 Features

### Core Functionality
- **Faculty Workload Logging**: Track hours, activities, classes, labs, exams, and project guidance
- **Department Management**: Support for multiple departments (AI & DS, Mechatronics, Food Tech, etc.)
- **Admin Dashboard**: Department-wise analytics, monthly summaries, downloadable reports
- **Faculty Dashboard**: Personal timesheets, visual charts, workload analytics
- **Billing System**: Automatic billing calculations based on hourly rates

### AI Features
- **AI Workload Auto-Classification**: Automatically categorizes activities using NLP
- **AI Timesheet Validation**: Detects overlapping hours, impossible entries, and suspicious patterns
- **Anomaly Detection**: Identifies unusual workload patterns using ML algorithms

### Technical Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: SQLite with full schema support
- **AI/ML**: Custom classification and validation algorithms
- **Authentication**: JWT-based authentication with role-based access

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-faculty-billing-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your configuration.

4. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Seed the database with sample data**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📋 Database Schema

### Tables
- **departments**: Department information
- **subjects**: Course subjects and details
- **users**: Faculty and admin users
- **workload_logs**: Faculty work activity logs
- **ai_validation_logs**: AI validation results
- **billing_cycles**: Billing period management
- **billing_reports**: Generated billing reports

### Running Migrations
```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

## 🔐 Test Accounts

### Admin Account
- **Email**: `admin@university.edu`
- **Password**: `admin123`

### Faculty Accounts
- **Email**: `john.smith@university.edu`
- **Password**: `faculty123`

Additional faculty accounts are created during seeding.

## 🎯 AI Features Usage

### Workload Auto-Classification
The system automatically classifies activities into categories:
- **Lecture**: Teaching activities
- **Lab**: Practical sessions
- **Evaluation**: Exam and assessment work
- **Admin Work**: Administrative tasks
- **Research Work**: Research activities

### Timesheet Validation
AI automatically validates entries for:
- Time overlaps
- Impossible hour entries
- Suspicious patterns
- Anomaly detection

## 📊 Analytics & Reports

### Dashboard Features
- **Monthly workload charts**
- **Category-based breakdowns**
- **Earnings tracking**
- **Validation status overview**
- **Recent activity feed**

### Report Generation
- PDF reports for individual faculty
- Department-wise summaries
- Billing calculations
- Export capabilities

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

### Database Setup
For production, consider using:
- **PostgreSQL** (recommended)
- **MySQL**
- **PlanetScale**

Update the Drizzle configuration accordingly.

## 🔧 Configuration

### Adding New Departments
Update the seed file or add through the admin interface:
```typescript
// In src/lib/seed.ts
const departmentData = [
  { name: 'New Department', code: 'NEWDEPT' },
  // ... existing departments
]
```

### Customizing AI Classification
Modify the classifier in `src/lib/ai/classifier.ts`:
```typescript
private keywords: Record<WorkloadCategory, string[]> = {
  lecture: ['your', 'custom', 'keywords'],
  // ... other categories
}
```

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-optimized navigation
- Touch-friendly interfaces
- Responsive charts and tables
- Adaptive layouts

## 🎨 Styling & Themes

### Design System
- **Tailwind CSS** for utility-first styling
- **ShadCN UI** for consistent components
- **Custom CSS variables** for theming
- **Dark mode support**

### Color Palette
- Primary: Blue tones
- Secondary: Gray tones
- Success: Green
- Warning: Orange
- Error: Red

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Session management
- CSRF protection
- Input validation

## 📈 Performance Optimizations

- Server-side rendering (SSR)
- Static site generation (SSG)
- Image optimization
- Code splitting
- Database indexing
- API caching

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure SQLite file path is correct
   - Check file permissions
   - Verify environment variables

2. **Authentication Issues**
   - Check JWT secret configuration
   - Verify session management
   - Clear browser cookies

3. **Build Errors**
   - Run `npm run build` to check
   - Verify TypeScript types
   - Check import paths

### Debug Mode
Enable detailed logging by setting:
```env
DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

## 🔄 Updates & Maintenance

Regular maintenance includes:
- Dependency updates
- Security patches
- Performance optimizations
- Feature enhancements
- Bug fixes

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.