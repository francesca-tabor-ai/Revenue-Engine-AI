# Revenue Engine AI - Backend

Express + Prisma + PostgreSQL API for Revenue Engine AI.

## Setup

1. **Install dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Environment**
   - Copy `.env.local` from project root or create `backend/.env` with:
   - `DATABASE_URL` – PostgreSQL connection string
   - `JWT_SECRET` – Secret for JWT (use a long random string in production)
   - For **local development**, use the **public** Railway PostgreSQL URL (from Railway dashboard → Postgres → Connect → Public URL). The `postgres.railway.internal` URL only works when deployed on Railway.

3. **Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:3001`

## Railway Deployment

1. Create a new project on Railway
2. Add a PostgreSQL service
3. Add an empty service for the backend
4. Link the backend to PostgreSQL (Railway injects `DATABASE_URL`)
5. Set `JWT_SECRET` in Variables
6. Set root directory to `backend` or configure build to use `backend/`
7. Build command: `npm install && npx prisma generate`
8. Start command: `npx prisma migrate deploy && npm start`

## API Endpoints

- `POST /api/auth/signup` – Create account
- `POST /api/auth/login` – Log in
- `GET /api/auth/me` – Current user (Bearer token)

Admin (requires `Authorization: Bearer <token>` and `role: ADMIN`):
- `GET/POST /api/admin/:entity` – List, Create
- `GET/PUT/DELETE /api/admin/:entity/:id` – Get, Update, Delete

Entities: `user`, `organization`, `account`, `contact`, `lead`, `deal`, `pipelineStage`, `crmConnection`, `integration`, `playbook`, `forecast`, `activity`, `auditLog`, `setting`
