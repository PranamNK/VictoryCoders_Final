# TempleVerse - Complete Setup Guide

This guide will help you set up the full-stack TempleVerse application with backend integration.

## Prerequisites Installation

### 1. Install Node.js
Download and install Node.js v18+ from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB service will start automatically

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Option B: MongoDB Atlas (Cloud - Free Tier)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step-by-Step Setup

### Step 1: Clone and Setup Frontend

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd coastal-divine-verse

# Install frontend dependencies
npm install
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 3: Configure Environment Variables

Edit `backend/.env`:

**For Local MongoDB:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/templeverse
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:8080
```

**For MongoDB Atlas:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/templeverse?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:8080
```

⚠️ **Important:** Change `JWT_SECRET` to a strong random string in production!

### Step 4: Seed the Database

```bash
# Make sure you're in the backend folder
npm run seed
```

You should see:
```
✅ MongoDB Connected: localhost
🗑️  Data Destroyed...
✅ Data Imported...
```

### Step 5: Start the Application

Open **TWO** terminal windows:

**Terminal 1 - Start Backend:**
```bash
cd coastal-divine-verse/backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd coastal-divine-verse
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:8080
```

### Step 6: Access the Application

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api/health

## Testing the Backend

### Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

### Test Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Get Temples

```bash
curl http://localhost:5000/api/temples
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**

**Solution:**
- Make sure MongoDB is running:
  - **Windows:** Check Services for "MongoDB Server"
  - **Mac/Linux:** `sudo systemctl status mongodb`
- Check your `MONGODB_URI` in `.env`
- For Atlas, ensure IP is whitelisted (use 0.0.0.0/0 for development)

### Port Already in Use

**Error: "Port 5000 is already in use"**

**Solution:**
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Or kill the process using the port:
  - **Windows:** `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - **Mac/Linux:** `lsof -ti:5000 | xargs kill -9`

### Dependencies Installation Failed

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### TypeScript Errors in Backend

**Solution:**
The lint errors about missing modules are expected before installing dependencies. Run:
```bash
cd backend
npm install
```

## Next Steps

### 1. Create Admin User

Connect to MongoDB and manually set a user's role to 'admin':

```bash
# Connect to MongoDB shell
mongosh templeverse

# Update user role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 2. Add More Temple Data

Edit `backend/src/utils/seedDatabase.ts` to add more temples, then run:
```bash
npm run seed
```

### 3. Connect Frontend to Backend

The frontend can now make API calls to:
- Register/Login users
- Fetch temples with filters
- Add temples to favorites
- Write and read reviews

### 4. Deploy (Production)

See deployment guides:
- **Backend:** Heroku, Railway, Render, or DigitalOcean
- **Frontend:** Vercel, Netlify, or Cloudflare Pages
- **Database:** MongoDB Atlas (recommended)

## API Endpoints Reference

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login user | No |
| `/api/auth/me` | GET | Get current user | Yes |
| `/api/temples` | GET | Get all temples | No |
| `/api/temples/:id` | GET | Get single temple | No |
| `/api/temples` | POST | Create temple | Admin |
| `/api/temples/:id` | PUT | Update temple | Admin |
| `/api/temples/:id` | DELETE | Delete temple | Admin |
| `/api/temples/:id/favorite` | POST | Add to favorites | Yes |
| `/api/temples/:id/favorite` | DELETE | Remove favorite | Yes |
| `/api/temples/:id/reviews` | GET | Get reviews | No |
| `/api/temples/:id/reviews` | POST | Create review | Yes |
| `/api/reviews/:id` | PUT | Update review | Yes (Owner) |
| `/api/reviews/:id` | DELETE | Delete review | Yes (Owner/Admin) |

## Support

For issues or questions:
1. Check this setup guide
2. Review backend/README.md for API details
3. Check console logs for error messages
4. Ensure MongoDB is running
5. Verify environment variables are set correctly

Happy coding! 🚀
