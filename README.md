# 🚗 Auto Parts Store

A modern e-commerce platform for automotive parts built with Next.js 14, TypeScript, and Supabase.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 15 (Supabase)
- **Authentication**: Makerkit Auth
- **Payments**: Stripe
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + Testing Library
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## ✨ Features

### Color System & Theme

The application uses a **refined color system** with professional contrast ratios and accessibility-first design.

#### Color Palette
- **Primary**: `#b00020` - Deep red for buttons and key actions (WCAG AA compliant)
- **Accent**: `#e53935` - Bright red for badges and highlights (used sparingly)
- **Surface**: `#f7f7f7` - Light grey for cards and sections
- **Foreground**: `#1a1a1a` - Near-black text for optimal readability
- **Background**: `#ffffff` - Clean white background
- **Footer**: `#0d0d0d` - Almost-black footer for dramatic contrast
- **Border**: `#e0e0e0` - Subtle grey borders
- **Muted**: `#f5f5f5` - Neutral grey for muted elements

#### Design Philosophy
- **Red as accent only**: Never used for large backgrounds to prevent visual fatigue
- **High contrast**: All text meets WCAG AA standards for accessibility
- **Dark footer**: Creates sophisticated contrast while making red elements pop
- **Professional hierarchy**: Near-black text (#1a1a1a) instead of pure black for better reading experience

#### Animated Hero Blobs
The hero section features subtle animated elements with reduced visual impact:
- **Low opacity**: Primary blob at 20%, accent at 25%, muted at 30%
- **40-second cycles**: Slow, gentle movement to avoid distraction
- **Neutral tones**: Uses muted grey alongside minimal red tones
- **Performance optimizations**: `pointer-events-none` and proper z-indexing

#### Button System
All buttons follow consistent interaction patterns:
- **Primary buttons**: Deep red (#b00020) with darker active state (/80)
- **Outline buttons**: Red border with subtle background hover (/10)  
- **Disabled state**: Border color with muted text
- **Micro-interactions**: Scale effects and shadow transitions

#### Customizing Colors
To adjust the color palette, modify `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#b00020', // Deep red - main actions
    foreground: '#ffffff',
  },
  accent: {
    DEFAULT: '#e53935', // Bright red - sparingly used
    foreground: '#ffffff',
  },
  surface: '#f7f7f7',    // Card backgrounds
  footer: '#0d0d0d',     // Dark footer
  foreground: '#1a1a1a', // Near-black text
}
```

#### Performance Tips
- If experiencing FPS drops, reduce `blur-3xl` to `blur-2xl` in BlurredBlobs component
- Consider reducing blob count on mobile devices
- Motion duration can be adjusted in the Framer Motion `transition.duration` property

### Brand Categories
Brands are organized into three categories:
- **Марки на коли** (`car`) - Car brands
- **Марки на аксесоари** (`accessory`) - Accessory brands  
- **Марки на части** (`parts`) - Parts brands

The brands page includes filter buttons showing real-time counts for each category. Clicking a filter updates the URL and displays only brands from that category.

#### Database Migration Philosophy
This project uses a **single comprehensive migration** approach:
- All schema, functions, indexes, and seed data in one file: `migrations/001_init_full.sql`
- No incremental migrations - the file contains the complete database state
- Guarantees consistent schema across environments

#### Adding New Categories
1. Update the database constraint in `migrations/001_init_full.sql`
2. Add the new category to `BrandCategory` type in `src/services/brandService.ts`
3. Update the filters array in `src/components/BrandFilterBar/BrandFilterBar.tsx`
4. Add translation keys to `messages/bg.json`

#### Database Reset
To reset your database to the latest schema:
```bash
# For local PostgreSQL
dropdb autoparts && createdb autoparts
psql -d autoparts -f migrations/001_init_full.sql

# For Supabase
# Drop all tables in Supabase dashboard, then run migrations/001_init_full.sql
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auto-parts-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Supabase configuration
   ```

4. **Database Setup**
   
   **Option A: Using Supabase (Recommended)**
   - Create a new Supabase project at https://supabase.com
   - Copy your project URL and anon key to `.env.local`
   - Run the complete migration: Copy `migrations/001_init_full.sql` to Supabase SQL Editor and execute
   
   **Option B: Using Docker PostgreSQL**
   ```bash
   docker compose up db -d
   # Database will be automatically initialized with complete schema
   psql -h localhost -U postgres -d autoparts -f migrations/001_init_full.sql
   ```

   **Note:** The application will fail to start without a valid database connection.

5. **Start development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

### Docker Development

1. **Start with Docker Compose**
   ```bash
   docker compose up --build
   ```

   This starts:
   - App server on port 3000
   - PostgreSQL database on port 5432
   - MailHog on port 8025

2. **Seed the database**
   ```bash
   npm run docker:seed
   ```

3. **View logs**
   ```bash
   docker compose logs -f app
   ```

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Configuration & utilities
│   ├── services/            # API services & data fetching
│   ├── types/               # TypeScript type definitions
│   └── i18n.ts             # Internationalization config
├── messages/                # Translation files
├── docker-compose.yml       # Local development orchestration
├── Dockerfile              # Production container image
├── init.sql                # Database schema & seed data
└── .github/workflows/      # CI/CD pipelines
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🐳 Docker Commands

```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:run

# Development with hot reload
docker compose up

# View database
docker compose exec db psql -U postgres -d autoparts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm test` - Run Jest tests
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (migrate + seed)
- `npm run docker:seed` - Seed database in Docker environment

## 🌍 Environment Variables

### Required Variables

```bash
# Supabase Database (Primary)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Local PostgreSQL (Alternative)
DATABASE_URL="postgresql://postgres:password@localhost:5432/autoparts"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Payment Processing
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Additional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BRAND_PAGE_LIMIT` | Number of brands to load per page | `24` |

## 🚢 Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Docker Production

```bash
# Build production image
docker build -t auto-parts-store .

# Run production container
docker run -p 3000:3000 --env-file .env.docker auto-parts-store
```

### CI/CD

The project includes GitHub Actions workflows for:
- ✅ Automated testing (lint, type-check, unit tests)
- 🐳 Docker image building and publishing to GHCR
- 🚀 Deployment pipeline (configurable)

## 📊 Database Schema

The application uses **Supabase PostgreSQL 15+** with the following main tables:

### Core Tables
- `brands` - Automotive brands (Bosch, Febi, Sachs, Brembo)
- `categories` - Product categories with hierarchical support
- `products` - Auto parts catalog with full specifications
- `orders` - Customer orders with payment tracking
- `order_items` - Order line items with product snapshots

### Key Features
- **Row Level Security (RLS)** - Automatic data access control
- **Real-time subscriptions** - Live data updates
- **Full-text search** - Advanced product search capabilities
- **JSONB fields** - Flexible product specifications and compatibility
- **Automatic timestamps** - Created/updated tracking
- **Soft deletes** - Data preservation with logical deletion

### Sample Data
The seed script creates:
- 4 automotive brands
- 4 product categories  
- 48 sample products (12 product types × 4 brands)
- Realistic pricing, stock levels, and specifications

## 🌐 Internationalization

- Primary language: **Bulgarian** (bg)
- All UI text is externalized in `messages/bg.json`
- Uses `next-intl` for translation management

## 🔒 Security

- TypeScript strict mode enabled
- Input validation with Zod schemas
- SQL injection protection via parameterized queries
- HTTPS enforced in production
- Environment variables for sensitive data

## 📝 Contributing

1. Follow the commit format: `[scope] description`
   ```bash
   git commit -m "[ui] add product search functionality"
   ```

2. Run quality checks before committing:
   ```bash
   npm run lint && npm run type-check && npm test
   ```

3. Create feature branches from `develop`
4. Submit PR with clear description

## 📄 License

This project is proprietary software. All rights reserved.

## Related Products Logic

The system uses a hierarchical approach to recommend related products, following these rules in order:

1. **Same Category & Brand**
   - Products from the same category and brand
   - Excludes the current product
   - Only in-stock items (`stock > 0`)
   - Sorted by `sales_count` descending
   - Maximum 4 items

2. **Same Category, Different Brand**
   - If no results from rule #1
   - Products from the same category but different brands
   - Sorted by `sales_count` descending
   - Maximum 4 items

3. **Same Brand, Different Category**
   - If no results from rules #1 and #2
   - Products from the same brand but different categories
   - Sorted by `sales_count` descending
   - Maximum 4 items

4. **Top Selling Products**
   - Fallback if no other matches
   - Site-wide top sellers by `sales_count`
   - Maximum 4 items

### Customization

To adjust the recommendation logic:

1. Modify the priority order in `getRelatedProducts()` in `src/services/productService.ts`
2. Adjust the `limit` parameter (default: 4) when calling the function
3. Add additional filtering criteria to the base query

The `sales_count` is automatically incremented when orders are completed, providing a reliable metric for product popularity.

## API Routes

### GET /api/brands

Returns paginated list of brands.

Query parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 24, max: 48)

Response shape:
```typescript
{
  data: Brand[]
  total: number
  page: number
  totalPages: number
}
```

## Brand Pages

### Brand Listing (`/brands`)
- Displays a grid of all active brands
- Supports infinite loading with configurable page size
- Each brand shows logo (if available) and name

### Brand Detail (`/brands/[slug]`)
- Shows all products from a specific brand
- Hero section with brand logo and description
- Paginated product grid with "Load More" functionality
- Products filtered to show only in-stock items
- SEO optimized with brand-specific metadata

### Brand Products API
- Endpoint: `/api/brands/[slug]/products`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 24, max: 48)
- Response Format:
  ```typescript
  {
    success: boolean
    data: Product[]
    brand: Brand
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  ```
- Cache Control: `s-maxage=120, stale-while-revalidate`

### Environment Variables
- `NEXT_PUBLIC_BRAND_PRODUCTS_PAGE_LIMIT`: Default number of products per page (default: 24)

---

**Sample commit message**: `[feat] implement product catalog with filtering`  See exit bump (x) and I don't get the one product we have when I search for it