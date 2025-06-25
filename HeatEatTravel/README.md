# Heat&Eat - Sri Lankan Train Food Delivery

A full-stack web application for ordering authentic Sri Lankan food for delivery to train passengers on the Colombo Fort - Badulla route.

---

## Features

- **User Authentication**: Secure login and registration
- **Menu Browsing**: Browse authentic Sri Lankan dishes by category
- **Train & Station Selection**: Choose from 5 trains and 86 stations
- **Order Management**: Complete ordering system with cart functionality
- **Payment Processing**: Support for both Stripe card payments and cash on delivery
- **Admin Dashboard**: Order and shop management for shop owners via a **PHP-based Admin System**
- **Real-time Updates**: Order status tracking and management

---

## Tech Stack

### Admin System (Backend)
- PHP
- Bootstrap
- jQuery
- CSS
- Runs on XAMPP with Apache & PostgreSQL

### Client & API Backend
- React (with TypeScript)
- Node.js & Express (TypeScript)
- Tailwind CSS & shadcn/ui
- PostgreSQL database
- Passport.js (session-based authentication)
- Stripe for payment processing
- Drizzle ORM for database access

---

## Database

Both admin and client systems share the same **PostgreSQL** database for seamless data integration.

---

## Getting Started

### Admin System

- Requires XAMPP (Apache + PHP + PostgreSQL)
- Place the `admin/` folder inside XAMPP’s `htdocs` directory
- Configure database credentials in the PHP config files
- Access admin dashboard via `http://localhost/admin/`

### Client System

- Requires Node.js (v18+)
- Navigate to the `client/` folder
- Run:
  ```bash
  npm install
  npm run dev


### Option 1: MySQL/XAMPP Setup

1. **Start XAMPP and create database**
   ```sql
   CREATE DATABASE heat_eat_db;
   ```

2. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd heat-eat-app
   npm install
   ```

3. **Configure for MySQL**
   
   Install MySQL adapter:
   ```bash
   npm install mysql2 drizzle-orm
   ```

   Update `server/db.ts`:
   ```typescript
   import { drizzle } from 'drizzle-orm/mysql2';
   import mysql from 'mysql2/promise';
   import * as schema from "@shared/schema";

   if (!process.env.DATABASE_URL) {
     throw new Error("DATABASE_URL must be set");
   }

   const connection = await mysql.createConnection(process.env.DATABASE_URL);
   export const db = drizzle(connection, { schema });
   ```

   Update `shared/schema.ts` - replace `pgTable` with `mysqlTable`:
   ```typescript
   import { mysqlTable, serial, varchar, decimal, boolean, text, timestamp, int, json } from 'drizzle-orm/mysql-core';
   ```

4. **Environment Variables**
   
   Create `.env` file:
   ```env
   DATABASE_URL=mysql://root:@localhost:3306/heat_eat_db
   SESSION_SECRET=your-secret-key-here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

5. **Import database structure**
   ```bash
   # Import the provided database-setup.sql file (modified for MySQL)
   mysql -u root -p heat_eat_db < database-setup-mysql.sql
   ```

### Option 2: PostgreSQL Setup (Recommended)

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Create database**
   ```bash
   createdb heat_eat_db
   ```

3. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd heat-eat-app
   npm install
   ```

4. **Environment Variables**
   
   Create `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/heat_eat_db
   SESSION_SECRET=your-secret-key-here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

5. **Setup database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Import sample data
   psql -d heat_eat_db -f database-setup.sql
   ```

### Getting Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your "Publishable key" (starts with `pk_`) → `VITE_STRIPE_PUBLIC_KEY`
3. Copy your "Secret key" (starts with `sk_`) → `STRIPE_SECRET_KEY`

### Running the Application

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Main app: http://localhost:5000
   - Admin dashboard: http://localhost:5000/admin

### Default Data

The database comes pre-loaded with:
- 5 authentic Sri Lankan trains (Ella Odyssey, Podi Menike, etc.)
- 86 train stations from Colombo Fort to Badulla
- 20 authentic Sri Lankan menu items with LKR pricing

### Admin Access

Any registered user can access the admin dashboard at `/admin` to:
- View all incoming orders
- Update order status (placed → preparing → ready → delivered)
- Manage payment status for cash orders
- Filter and search orders

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
└── database-setup.sql    # Database initialization
```

### API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/menu` - Get menu items
- `GET /api/trains` - Get train schedules
- `GET /api/stations` - Get station list
- `POST /api/orders` - Create order
- `GET /api/admin/orders` - Get all orders (admin)
- `PATCH /api/admin/orders/:id/status` - Update order status

### Troubleshooting

1. **Database connection issues**: Check your DATABASE_URL and ensure the database server is running
2. **Port conflicts**: The app runs on port 5000 by default
3. **Stripe errors**: Ensure your Stripe keys are correctly set in the environment variables
4. **Build errors**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.
