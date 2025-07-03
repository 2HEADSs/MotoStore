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
│   └── (work in progress)
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

## 🛠 Planned Improvements

- [ ] Complete CRUD for users and bikes
- [ ] Filtering, searching, and sorting listings
- [ ] Admin dashboard implementation
- [ ] Full documentation and test coverage
- [ ] Image upload handling
- [ ] Преминаване към production build

---

## 🧾 Author

This project is developed for learning purposes.

---