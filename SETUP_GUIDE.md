# Faculty Billing & Salary Automation System - Setup Guide

## Quick Start Guide

This guide will help you set up and deploy the Faculty Billing & Salary Automation System.

## Prerequisites

- **Node.js**: Version 18 or higher
- **Supabase Account**: Create at https://supabase.com
- **Git**: For version control
- **npm or yarn**: Package manager

## Step 1: Supabase Project Setup

### 1.1 Create a New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Enter your project details:
   - Project name: faculty-billing-system
   - Database password: (generate a strong password)
   - Region: Choose closest to your location
4. Wait for project to be created (2-3 minutes)

### 1.2 Get Your Project Credentials

1. Navigate to **Settings** → **API**
2. Copy the following:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI...`

### 1.3 Database is Already Configured

The database schema has been applied through Supabase migrations. You should see 16 tables in your database:

- departments
- academic_years
- users
- subjects
- salary_rate_configurations
- faculty_subject_assignments
- workload_entries
- workload_approvals
- leave_records
- salary_calculations
- salary_adjustments
- salary_slips
- messages
- notifications
- monthly_reports
- audit_logs

## Step 2: Local Development Setup

### 2.1 Clone the Repository

```bash
git clone <your-repository-url>
cd smart-faculty-billing-system
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# JWT Secret (generate a random string)
JWT_SECRET=your-random-secret-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Seed the Database (Optional)

Run the seed script to populate sample data:

```bash
npm run seed
```

This will create:
- 5 departments
- 1 current academic year
- 5 sample subjects
- 1 default salary rate configuration

### 2.5 Build and Test

```bash
npm run build
npm run dev
```

Visit http://localhost:3000 to see your application.

## Step 3: Create Your First Admin User

### Option A: Using Supabase Dashboard

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click "Add user"
3. Enter:
   - Email: admin@university.edu
   - Password: (create a strong password)
   - Confirm email: ✓ (check this)
4. Click "Create user"
5. Copy the User ID (UUID)

6. Go to **Table Editor** → **users**
7. Click "Insert" → "Insert row"
8. Fill in:
   - id: (paste the User ID from step 5)
   - email: admin@university.edu
   - name: System Administrator
   - role: admin
   - is_active: true
9. Click "Save"

### Option B: Using SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query (replace placeholders):

```sql
-- First, create the auth user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@university.edu',
  crypt('your-password-here', gen_salt('bf')),
  now(),
  now(),
  now()
) RETURNING id;

-- Then, create the profile (use the returned ID from above)
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  employee_id,
  designation,
  is_active
) VALUES (
  'paste-user-id-from-above',
  'admin@university.edu',
  'System Administrator',
  'admin',
  'ADMIN001',
  'System Administrator',
  true
);
```

## Step 4: Login and Verify

1. Navigate to http://localhost:3000/login
2. Enter your admin credentials
3. You should be redirected to the dashboard

## Step 5: Configure Authentication (Optional)

### Email Configuration

To enable password reset emails:

1. Go to **Authentication** → **Email Templates**
2. Customize the "Reset Password" template
3. Configure SMTP in **Settings** → **Auth**

### Rate Limiting

Enable rate limiting in **Settings** → **Auth**:
- Enable rate limiting
- Set max requests per hour

## Step 6: Deploy to Production

### Option A: Vercel Deployment

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Add all variables from `.env.local`
6. Click "Deploy"

### Option B: Other Platforms

The application can be deployed to:
- **Netlify**: Similar to Vercel
- **Railway**: Docker-based deployment
- **Digital Ocean App Platform**: Container deployment
- **AWS Amplify**: AWS infrastructure

## Step 7: Post-Deployment Configuration

### 7.1 Update Environment Variables

Update your `.env.local` or production environment:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 7.2 Configure Auth Redirect URLs

In Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add your production URL to:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/**`

### 7.3 Enable Row Level Security Policies

All RLS policies are already enabled. Verify in:
- **Database** → **Tables** → Click any table → **Policies**

## Step 8: Create Additional Users

### Faculty Users

1. Use the signup API or create through admin interface (when built)
2. Assign department and subjects
3. Set salary rates

### HOD Users

1. Create user with role: 'hod'
2. Assign to department
3. Update department.hod_user_id

### Accountant Users

1. Create user with role: 'accountant'
2. Grant access to financial modules

## Troubleshooting

### Common Issues

**Issue**: "Invalid Supabase URL or key"
- **Solution**: Verify your environment variables are correct
- Check `.env.local` file exists
- Restart development server

**Issue**: "Authentication error"
- **Solution**: Check Supabase Auth settings
- Verify email confirmation settings
- Check RLS policies

**Issue**: "Database connection failed"
- **Solution**: Check Supabase project status
- Verify network connection
- Check database credentials

**Issue**: "Build errors"
- **Solution**: Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Check TypeScript errors

### Debug Mode

Enable detailed logging:

```env
DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### Database Issues

Reset database (CAUTION: This deletes all data):

1. Go to **Database** → **Replication**
2. Pause replication
3. Go to **SQL Editor**
4. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
5. Re-run migrations

## Security Checklist

- [ ] Change default admin password
- [ ] Enable 2FA for Supabase account
- [ ] Configure SMTP for emails
- [ ] Set up rate limiting
- [ ] Review RLS policies
- [ ] Enable audit logging
- [ ] Configure CORS properly
- [ ] Use HTTPS in production
- [ ] Rotate JWT secrets regularly
- [ ] Monitor authentication attempts

## Performance Optimization

### Database Optimization

1. Create indexes on frequently queried columns
2. Enable connection pooling
3. Use database caching
4. Monitor query performance

### Application Optimization

1. Enable Next.js ISR (Incremental Static Regeneration)
2. Configure caching headers
3. Optimize images
4. Use lazy loading

## Monitoring & Maintenance

### Supabase Dashboard

Monitor:
- **Database** → **Monitoring**: Query performance
- **Authentication** → **Users**: User activity
- **Storage**: File storage usage
- **Logs**: API logs and errors

### Application Monitoring

Recommended tools:
- **Vercel Analytics**: Page views and performance
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **PostHog**: Product analytics

## Backup & Recovery

### Database Backups

1. Go to **Database** → **Backups**
2. Enable daily backups
3. Configure backup retention
4. Test backup restoration

### Code Backups

1. Use Git for version control
2. Push to remote repository regularly
3. Tag releases
4. Document changes

## Support & Resources

### Documentation
- Implementation Status: See `IMPLEMENTATION_STATUS.md`
- Feature Specifications: See main requirements document

### Community
- Create issues on GitHub
- Join community forums
- Contact support

### Updates

Check for updates regularly:
```bash
git pull origin main
npm install
npm run build
```

---

**Setup Complete!** You're now ready to start building the core modules.

Next steps:
1. Create faculty users
2. Set up departments and subjects
3. Start logging workload entries
4. Configure salary rates
5. Test approval workflows

For detailed implementation status, see `IMPLEMENTATION_STATUS.md`.
