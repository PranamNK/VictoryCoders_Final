# Quick Start Guide - Full Stack TempleVerse

## 🚀 Get Running in 5 Minutes

### Prerequisites
- ✅ Node.js v18+ installed
- ✅ MongoDB installed and running

---

## Step 1: Start MongoDB

**Windows:**
MongoDB should auto-start as a service. Verify:
```powershell
# Check if running
Get-Service -Name MongoDB
```

**Mac/Linux:**
```bash
brew services start mongodb-community  # Mac
sudo systemctl start mongodb           # Linux
```

---

## Step 2: Install Dependencies

### Frontend
```bash
# In project root
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## Step 3: Configure Environment

### Backend Environment
```bash
cd backend
# Copy example env file
copy .env.example .env   # Windows
# cp .env.example .env    # Mac/Linux
```

Your `backend/.env` should look like:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/templeverse
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:8080
```

### Frontend Environment (Already created)
`.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Step 4: Seed Database

```bash
cd backend
npm run seed
```

You should see:
```
✅ MongoDB Connected: localhost
🗑️  Data Destroyed...
✅ Data Imported...
✨ Sample admin user created
```

---

## Step 5: Run Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

### Terminal 2 - Frontend
```bash
# In project root
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:8080/
```

---

## Step 6: Test the Application

### Open Browser
Navigate to: **http://localhost:8080**

### Test Authentication Flow

1. **Register a New User**
   - Click "Sign Up" in header
   - Fill: Name, Email, Password
   - Click "Create Account"
   - You're now logged in!

2. **Explore Temples**
   - Browse temple map/list
   - Click any temple to view details

3. **Add to Favorites**
   - On temple detail page
   - Click the heart icon
   - View favorites in Profile

4. **Write a Review**
   - On temple detail page
   - Scroll to "Write a Review"
   - Rate with stars (1-5)
   - Write comment
   - Submit

5. **Check Profile**
   - Click your name in header
   - Select "Profile"
   - See favorites and activity

---

## 🎯 Test Endpoints (Optional)

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Temples
```bash
curl http://localhost:5000/api/temples
```

### Register User (via API)
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

---

## 🛑 Troubleshooting

### Port Already in Use
**Frontend (8080):**
```bash
# Change in vite.config.ts
server: {
  port: 3000  // or any other port
}
```

**Backend (5000):**
```bash
# Change in backend/.env
PORT=5001
```

### MongoDB Connection Failed
```bash
# Verify MongoDB is running
mongosh

# If not running, start it
# Windows: Start "MongoDB Server" service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors in Browser
Check `backend/.env`:
```env
CLIENT_URL=http://localhost:8080
```

Must match your frontend URL exactly.

---

## 📝 Default Test Account

After seeding, you can use this admin account:
```
Email: admin@templeverse.com
Password: admin123
```

**⚠️ Change this in production!**

---

## 🎉 You're All Set!

Your full-stack application is now running with:
- ✅ User authentication
- ✅ Protected routes
- ✅ Review system
- ✅ Favorites functionality
- ✅ User profiles
- ✅ 25+ temples with data
- ✅ Bilingual support

---

## 📚 Next Steps

1. **Customize**: Edit temple data in `backend/src/utils/seedDatabase.ts`
2. **Learn More**: Read `FRONTEND_AUTH_GUIDE.md` for detailed documentation
3. **Deploy**: See deployment guides in `README.md`

---

## 💡 Quick Reference

| What | URL |
|------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:5000/api |
| API Health | http://localhost:5000/api/health |
| Login Page | http://localhost:8080/login |
| Profile Page | http://localhost:8080/profile |

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start frontend dev server |
| `cd backend && npm run dev` | Start backend dev server |
| `cd backend && npm run seed` | Seed database with data |
| `cd backend && npm run build` | Build backend for production |
| `npm run build` | Build frontend for production |

---

## 🆘 Need Help?

1. Check browser console for frontend errors
2. Check terminal output for backend errors
3. Verify MongoDB is running
4. Ensure both servers are running
5. Check `.env` files are configured correctly

Happy coding! 🚀
