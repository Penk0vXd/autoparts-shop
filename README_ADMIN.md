# Auto Parts Store - Admin System

A comprehensive, secure admin panel for managing your auto parts store with enterprise-level security features and beautiful UI/UX.

## 🔐 Security Features

### Authentication & Authorization
- **Multi-layered authentication** with Supabase Auth + custom admin verification
- **Role-based access control** (Admin & Super Admin)
- **Granular permissions** system for fine-grained access control
- **Session management** with automatic timeout and cleanup
- **Password policy enforcement** (12+ chars, complexity requirements)

### Security Measures
- **Rate limiting** on login attempts (5 attempts per 15 minutes)
- **Account lockout** after failed login attempts
- **IP-based tracking** and monitoring
- **Comprehensive audit logging** for all admin actions
- **Input validation & sanitization** (XSS protection)
- **SQL injection prevention** through parameterized queries
- **CSRF protection** with secure headers
- **Content Security Policy** implementation

### Monitoring & Compliance
- **Real-time activity tracking** with detailed audit logs
- **Login/logout tracking** with IP and user agent logging
- **Resource modification tracking** (products, orders, etc.)
- **Automated session cleanup** for expired sessions
- **Security headers** (HSTS, X-Frame-Options, etc.)

## 🎨 UI/UX Features

### Modern Design
- **Beautiful gradients** and modern color schemes
- **Responsive design** that works on all devices
- **Smooth animations** and transitions
- **Intuitive navigation** with collapsible sidebar
- **Dark mode support** ready (easily configurable)

### User Experience
- **Smart search functionality** across all admin sections
- **Quick actions** for common tasks
- **Real-time dashboard** with live statistics
- **Interactive charts** and analytics
- **Contextual help** and tooltips
- **Keyboard shortcuts** support

### Dashboard Features
- **Live statistics** with growth indicators
- **Visual analytics** with multiple chart types
- **Recent activity feed** showing admin actions
- **Quick action buttons** for common tasks
- **Low stock alerts** and notifications
- **Performance metrics** and KPIs

## 📁 File Structure

```
src/
├── app/admin/
│   ├── layout.tsx              # Admin layout with sidebar & header
│   ├── login/page.tsx          # Secure login page
│   ├── page.tsx                # Main dashboard
│   └── api/admin/
│       ├── auth/
│       │   ├── login/route.ts  # Login endpoint
│       │   ├── logout/route.ts # Logout endpoint
│       │   └── me/route.ts     # Get current user
│       └── dashboard/
│           └── stats/route.ts  # Dashboard statistics
├── components/admin/
│   ├── AdminProvider.tsx       # Admin context & auth
│   ├── AdminSidebar.tsx        # Navigation sidebar
│   ├── AdminHeader.tsx         # Top header with search
│   ├── DashboardStats.tsx      # Statistics cards
│   ├── DashboardCharts.tsx     # Analytics charts
│   ├── QuickActions.tsx        # Quick action buttons
│   └── RecentActivity.tsx      # Activity feed
├── lib/
│   ├── auth.ts                 # Admin authentication logic
│   ├── rate-limit.ts           # Rate limiting system
│   └── validation.ts           # Input validation schemas
└── middleware.ts               # Route protection & security
```

## 🚀 Getting Started

### 1. Database Setup

Run the admin system migration in your Supabase dashboard:

```sql
-- Copy and execute the content of migrations/002_admin_system.sql
```

### 2. Environment Variables

Ensure these are set in your environment:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Default Admin Account

A default super admin account is created:
- **Email:** `admin@autoparts.bg`
- **Password:** `SuperAdmin123!@#`

⚠️ **IMPORTANT:** Change this password immediately after first login!

### 4. Access the Admin Panel

Visit: `http://localhost:3000/admin/login`

## 🛡️ Permission System

### Roles
- **Super Admin:** Full access to all features
- **Admin:** Limited access based on assigned permissions

### Available Permissions
- `products:view` - View products
- `products:create` - Create products
- `products:update` - Update products
- `products:delete` - Delete products
- `brands:view` - View brands
- `brands:create` - Create brands
- `brands:update` - Update brands
- `brands:delete` - Delete brands
- `categories:view` - View categories
- `categories:create` - Create categories
- `categories:update` - Update categories
- `categories:delete` - Delete categories
- `orders:view` - View orders
- `orders:update` - Update orders
- `orders:delete` - Delete orders
- `users:view` - View users
- `users:create` - Create users
- `users:update` - Update users
- `users:delete` - Delete users
- `analytics:view` - View analytics
- `settings:view` - View settings
- `settings:update` - Update settings

## 📊 Analytics & Monitoring

### Dashboard Metrics
- **Total Products** with growth indicators
- **Total Orders** with monthly comparisons
- **Total Users** and registration trends
- **Revenue Analytics** with detailed breakdowns
- **Low Stock Alerts** for inventory management

### Audit Logging
- All admin actions are logged with:
  - User identification
  - Action performed
  - Resource affected
  - Timestamp
  - IP address
  - User agent

### Chart Types
- **Sales Over Time** - Area chart showing revenue trends
- **Category Distribution** - Pie chart of product categories
- **Top Products** - Bar chart of best sellers

## 🔧 Customization

### Adding New Permissions

1. Add to `ADMIN_PERMISSIONS` in `src/lib/auth.ts`
2. Update permission checks in components
3. Add to database seed data if needed

### Styling Customization

The admin panel uses Tailwind CSS with a custom design system:
- Primary colors: Blue gradient
- Accent colors: Green, Purple, Amber
- Typography: Inter font family
- Spacing: Consistent 8px grid system

### Adding New Dashboard Widgets

1. Create component in `src/components/admin/`
2. Add to dashboard in `src/app/admin/page.tsx`
3. Create API endpoint if data is needed

## 🔄 API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current admin user

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/charts` - Get chart data

### Audit
- `GET /api/admin/audit-log` - Get audit log entries

## 🚨 Security Best Practices

### For Administrators
1. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
2. **Enable two-factor authentication** when available
3. **Log out when finished** - don't leave sessions open
4. **Report suspicious activity** immediately
5. **Keep software updated** regularly

### For Developers
1. **Validate all inputs** on both client and server
2. **Use prepared statements** for database queries
3. **Implement proper error handling** without exposing internals
4. **Regular security audits** and dependency updates
5. **Monitor audit logs** for suspicious patterns

## 📈 Performance Optimization

### Frontend
- **Code splitting** for admin routes
- **Lazy loading** of dashboard components
- **Memoization** of expensive calculations
- **Optimized images** and assets

### Backend
- **Database indexing** on frequently queried fields
- **Connection pooling** for database efficiency
- **Caching** of frequently accessed data
- **Rate limiting** to prevent abuse

## 🐛 Troubleshooting

### Common Issues

**Login Issues:**
- Check database connection
- Verify admin user exists and is active
- Check rate limiting status

**Permission Errors:**
- Verify user has required permissions
- Check role assignments
- Review audit logs

**Performance Issues:**
- Check database query performance
- Monitor network requests
- Review console for errors

### Debug Mode

Set `NODE_ENV=development` for additional logging and error details.

## 📝 Changelog

### Version 1.0.0
- Initial admin system implementation
- Complete authentication & authorization
- Dashboard with analytics
- Audit logging system
- Security hardening
- Beautiful responsive UI

## 🤝 Contributing

When adding new features:
1. Follow existing code patterns
2. Add proper TypeScript types
3. Include security considerations
4. Update documentation
5. Test all permission levels

## 📜 License

This admin system is part of the Auto Parts Store project. All rights reserved. 