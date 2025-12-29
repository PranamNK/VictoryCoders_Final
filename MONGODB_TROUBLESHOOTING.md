# MongoDB Connection Troubleshooting Guide

## Why Login Wasn't Working - Root Cause

The main issue was in `backend/src/server.ts`:

```typescript
// ❌ BEFORE (Wrong - doesn't wait for DB connection)
dotenv.config();
connectDatabase();  // This is async but not awaited!
const app = express();
const server = app.listen(PORT, ...);
```

The server was starting **before** MongoDB connected, causing all database queries to fail.

```typescript
// ✅ AFTER (Correct - waits for DB before starting)
dotenv.config();
connectDatabase().then(() => {
  const server = app.listen(PORT, ...);
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
```

---

## How to Test MongoDB Connection

### 1. **Check Backend Startup**
```bash
cd backend
npm run dev
```

**Look for this message:**
```
Connecting to MongoDB: mongodb+srv://***:***@cluster0.uqy1qhc.mongodb.net/templeverse?appName=Cluster0
✓ MongoDB Connected: cluster0.uqy1qhc.mongodb.net
Server running in development mode on port 5000
```

**Or this error if connection fails:**
```
✗ MongoDB connection error: [actual error details here]
```

### 2. **Test Health Check Endpoint**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "TempleVerse API is running",
  "timestamp": "2025-12-27T..."
}
```

### 3. **Test Registration**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**If Error Response:**
```json
{
  "success": false,
  "message": "MongoDB connection error: connect ECONNREFUSED"
}
```

---

## MongoDB Connection Issues & Solutions

### Issue 1: "connect ECONNREFUSED"
**Cause:** MongoDB is not running or listening on the expected port

**Solutions:**
- **Local MongoDB**: Start MongoDB service
  - Windows: `net start MongoDB`
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

- **MongoDB Atlas**: Check connection string
  - Go to https://cloud.mongodb.com
  - Verify cluster is active (not paused)
  - Check IP whitelist includes your machine
  - Verify username/password are correct

### Issue 2: "authentication failed"
**Cause:** Wrong MongoDB credentials in .env

**Solutions:**
- Verify `MONGODB_URI` in `.env` file:
  ```env
  MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/templeverse?appName=Cluster0
  ```
- Check username and password are URL-encoded (@ becomes %40)
- Verify user has access to the database

### Issue 3: "server selection timed out"
**Cause:** Network/connectivity issue with MongoDB Atlas

**Solutions:**
- Check internet connection
- Verify IP whitelist in MongoDB Atlas settings
  - Go to Security > Network Access
  - Add your IP address (or 0.0.0.0/0 for development only)
- Check if MongoDB cluster is in sleep mode
  - Free tier clusters auto-pause after 60 days of inactivity
  - Click "Resume" to reactivate

### Issue 4: Database operations still fail after connection
**Cause:** Mongoose models not loaded or database queries have errors

**Solutions:**
- Check backend console for detailed error messages (they're now shown!)
- Example error message will now show:
  ```
  Cast Error: Cast to ObjectId failed for value "invalid" (type string) at path "_id"
  ```
- Check that required fields are provided in POST/PUT requests

---

## MongoDB Atlas Setup (Cloud)

If you don't have MongoDB Atlas set up yet:

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create an organization and project

### Step 2: Create a Cluster
1. Click "Create a Deployment"
2. Select "Free" tier
3. Choose a region closest to you
4. Click "Create Deployment"

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Create username and strong password
4. Give it "Read and write to any database" permission
5. Click "Add User"

### Step 4: Allow Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP address
5. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Databases"
2. Click "Connect" on your cluster
3. Select "Drivers" option
4. Copy the connection string
5. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/templeverse?appName=Cluster0
   ```

---

## Local MongoDB Setup

If you prefer local development:

### Windows
```bash
# Install MongoDB Community Edition
# Download from https://www.mongodb.com/try/download/community

# Start MongoDB service
net start MongoDB

# Or use mongosh CLI
mongosh
```

### Mac
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connect via CLI
mongosh
```

### Linux (Ubuntu)
```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongod

# Connect via CLI
mongosh
```

### Use Local Connection String
```env
MONGODB_URI=mongodb://localhost:27017/templeverse
```

---

## Verify Database Operations

### Check if User Was Created
```bash
# Connect to MongoDB
mongosh

# Switch to database
use templeverse

# Find users
db.users.find().pretty()

# Find a specific user
db.users.findOne({ email: "test@example.com" })

# Check password is hashed (should NOT be plain text)
```

### Clear Database (for testing)
```bash
# Connect to MongoDB
mongosh

# Switch to database
use templeverse

# Clear all users
db.users.deleteMany({})

# Clear all reviews
db.reviews.deleteMany({})

# Clear all temples
db.temples.deleteMany({})
```

---

## Debug Checklist

Before reaching out for help, verify:

- [ ] Backend is running: `npm run dev` in backend folder
- [ ] Backend console shows: "✓ MongoDB Connected"
- [ ] MongoDB service is running
- [ ] `.env` file exists with correct MONGODB_URI
- [ ] .env MONGODB_URI is not wrapped in quotes
- [ ] MongoDB credentials are correct (username/password)
- [ ] MongoDB IP whitelist includes your machine (for Atlas)
- [ ] Port 5000 is available (not blocked by firewall)
- [ ] Frontend is using correct API URL: `http://localhost:5000/api`
- [ ] All dependencies installed: `npm install` in both folders

---

## Success Indicators

✅ **You're good to go when you see:**

1. Backend console:
   ```
   ✓ MongoDB Connected: cluster0.uqy1qhc.mongodb.net
   Server running in development mode on port 5000
   ```

2. Health check endpoint works:
   ```
   curl http://localhost:5000/api/health
   ```

3. Registration endpoint works:
   ```
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"pass123"}'
   ```
   Returns token and user data

4. Frontend can log in and authenticate
5. Temples load from database
6. Reviews can be created

---

## Still Having Issues?

Check the console output for detailed error messages. All error handlers now return:
- Actual error details (not generic "Server error")
- Proper HTTP status codes
- Clear messages describing what went wrong

This will help identify the exact problem quickly!

For example, if you see:
```
Cast Error: Cast to ObjectId failed for value "invalid"
```

It means the MongoDB ID format is wrong - not a connection issue.

Good luck! 🚀
