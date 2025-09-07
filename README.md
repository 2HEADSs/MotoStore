# 🏍️ MotoStore

**MotoStore** is a web platform for posting and browsing motorcycle listings. This is a learning project built with **NestJS**, **PostgreSQL**, and **React** (using Vite + TypeScript). The repository is organized as a **monorepo** with two main parts:

- **motostore-api** – NestJS backend (REST API)
- **motostore-client** – React frontend (in development)

---

## 📁 Project Structure

```bash
MotoStore/
│
├── motostore-api/
│   ├── src/
│   │   ├── modules/
│   │   ├── common/
│   │   └── prisma/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── motostore-client/
│   └── work in progres...
│
└── README.md
```

---

## 🚀 Project Setup (using npm)

> Make sure you have installed: **Node.js**, **PostgreSQL**, **npm**.

### 1. Backend Setup (NestJS API)

```bash
cd motostore-api
npm install
```

#### Create a .env file:

Create `.env` file with variable:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/motostore"
```

#### Generate and migrate the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### Run the development server:

```bash
npm run start:dev
```

### 2. Frontend Setup (React)

```bash
cd motostore-client
npm install
npm run dev
```

---

## 🧩 Technologies Used

- **Backend**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (чрез `@nestjs/jwt`)
- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Other**: Swagger, bcrypt, class-validator

---

## 📚 Documentation

- Swagger (auto-generated API docs): once the server is running, available at:

  ```
  http://localhost:3000/api
  ```

- User roles:

  - `USER`
  - `ADMIN`

- Main entities:
  - `User`
  - `Bike`
  - `Prices`

---

## 🌐 API Overview

The MotoStore API provides REST endpoints for authentication, managing motorcycle listings, and tracking price history.  
Full API documentation is available via Swagger:

## 🗄️ Database & Prisma Overview

MotoStore uses **PostgreSQL** as the primary database, managed with **Prisma ORM**.

### Main Models

#### User

- **Fields**:
  - `id` – Unique identifier (UUID)
  - `email` – Unique email address
  - `username` – Username (max 20 chars)
  - `phone` – Unique phone number
  - `hashedPassword` – Encrypted password
  - `role` – User role (`USER` | `ADMIN`)
  - `isBlocked` – Boolean flag to disable account
  - `createdAt`, `updatedAt` – Timestamps
- **Relationships**:
  - `ownedBikes` (1:N) – Bikes created/owned by the user
  - `likedBikes` (M:N) – Bikes liked by the user

---

#### Bike

- **Fields**:
  - `id` – Unique identifier (UUID)
  - `model` – Bike model name (max 20 chars)
  - `manufacturer` – Manufacturer (enum `Manufacturer`)
  - `color` – Bike color (enum `BikeColor`)
  - `engineCapacity` – Engine size (cc)
  - `horsePower` – Engine horsepower
  - `year` – Production year
  - `used` – Boolean, marks if bike is used
  - `isForParts` – Boolean, marks if sold for parts
  - `images` – Array of image URLs
  - `description` – Text description
  - `location` – Location of the listing (max 100 chars)
  - `listingStatus` – Listing state (`PENDING_APPROVAL`, `ACTIVE`, `SOLD`, `DRAFT`, `UNACTIVE`)
  - `createdAt`, `updatedAt` – Timestamps
- **Relationships**:
  - `owner` – User who created the listing
  - `likedByUsers` (M:N) – Users who liked the bike
  - `price` (1:N) – Price history entries

---

#### Prices

- **Fields**:
  - `id` – Unique identifier (UUID)
  - `price` – Price (Decimal, precision 10,2)
  - `createdAt`, `updatedAt` – Timestamps
- **Relationships**:
  - Linked to a `Bike` (1:N, cascade delete when a bike is removed)

---

### Enums

- **ListingStatus**:
  - `PENDING_APPROVAL`, `ACTIVE`, `SOLD`, `DRAFT`, `UNACTIVE`
- **BikeColor**:
  - `BLACK`, `WHITE`, `RED`, `BLUE`, `GREEN`, `YELLOW`, `ORANGE`, `SILVER`, `GRAY`, `BROWN`, `BEIGE`, `GOLD`, `PURPLE`, `PINK`, `BRONZE`, `CHROME`, `MATTE_BLACK`, `MATTE_GRAY`, `TWO_TONE`, `CUSTOM`
- **Role**:
  - `USER`, `ADMIN`
- **Manufacturer**: A comprehensive list of supported motorcycle manufacturers, e.g.:
- `BMW`, `Honda`, `Kawasaki`, `Suzuki`, `Yamaha`, `Ducati`, `Harley_Davidson`, `Aprilia`, `CFMOTO`, `Vespa`, `Zero`, `Zündapp`, `Other`
- (Full list available in [`schema.prisma`](motostore-api/prisma/schema.prisma))

### Notes

- Prisma migrations are used to version and update the database schema.
- The `Prices` table uses `createdAt` timestamps to record historical price entries.
- Deleting a bike cascades to its related prices (configured with `onDelete: Cascade`).

You can view the schema in [`motostore-api/prisma/schema.prisma`](motostore-api/prisma/schema.prisma).

## 🛠 Planned Improvements

- [ ] Complete CRUD for users and bikes
- [ ] Filtering, searching, and sorting listings
- [ ] Admin dashboard implementation
- [ ] Full documentation and test coverage
- [ ] Image upload handling
- [ ] Deploying

---

## 🧾 Author

This project is developed for learning purposes.

---
