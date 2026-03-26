# 🚀 Quick Start Guide

## Setup Option 1: Automatic (Recommended)

### Windows Users
```powershell
# Open PowerShell in the project root

# Backend setup
cd backend
npm install
Start-Process PowerShell -ArgumentList "-Command `"cd `'$PWD`'; npm start`""

# In another terminal -> Frontend setup
cd frontend
npm install
npm start
```

### macOS/Linux Users
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

## Setup Option 2: Manual

### Terminal 1 - Backend Server

```bash
cd backend
npm install
npm start
```

Expected output:
```
╔════════════════════════════════════════════════╗
║  🚀 Internship Ranking API Server Started      ║
╚════════════════════════════════════════════════╝
📡 Server running on: http://localhost:5000
🔌 API Documentation: http://localhost:5000/
```

### Terminal 2 - Frontend Application

```bash
cd frontend
npm install
npm start
```

The React app opens automatically at `http://localhost:3000`

## Testing the API

After both servers are running, test the API:

### Test 1: Get Ranking
```bash
curl http://localhost:5000/api/ranking
```

### Test 2: Get Specific Intern
```bash
curl http://localhost:5000/api/ranking/1
```

### Test 3: Add Evaluation
```bash
curl -X POST http://localhost:5000/api/avaliacoes \
  -H "Content-Type: application/json" \
  -d '{
    "internId": 1,
    "mentorId": 104,
    "hardSkills": {
      "logic": 9,
      "javascript": 9,
      "sql": 8
    },
    "softSkills": {
      "communication": 9,
      "proactivity": 9,
      "teamwork": 9
    }
  }'
```

## Troubleshooting

### "Port 5000 already in use"
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### "Cannot find module"
```bash
npm install
npm install --save framer-motion recharts axios
```

### Frontend shows blank page
1. Check if backend is running: `http://localhost:5000/api/health`
2. Check browser console (F12) for errors
3. Clear cache: `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
4. Try: `npm start` again

### CORS Errors
Ensure backend server is running on `http://localhost:5000`

## Project Structure Check

```
Ranking/
├── backend/
│   ├── utils/
│   │   └── rankingCalculator.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── RankingTable.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
├── database/
│   ├── interns.json
│   └── postgresSchema.sql
├── README.md
├── .gitignore
└── QUICK_START.md (this file)
```

## Key Features at a Glance

✅ **Cyberpunk Design** - Neon cyan and purple theme
✅ **Real-time Ranking** - Instant score calculations
✅ **Animated UI** - Smooth framer-motion animations
✅ **REST API** - Full CRUD operations
✅ **PostgreSQL Ready** - Production schema included
✅ **5 Sample Interns** - Pre-loaded test data

## Sample Data

The system comes with 5 interns:
- Alice Silva (🥇 Top Performer)
- Bruno Costa
- Carlos Mendes
- Diana Ferreira
- Eduardo Souza

## Performance Tips

1. **Backend**: Uses JSON file for quick iteration. Migrate to PostgreSQL for production.
2. **Frontend**: Tailwind CSS optimizes bundle size. Build: `npm run build`
3. **API**: All responses are cached with timestamps for performance

## Next Steps

1. ✅ Review the CYBER RANKING dashboard
2. 📊 Add more evaluations via API
3. 🎨 Customize colors in `tailwind.config.js`
4. 🗄️ Migrate to PostgreSQL when ready
5. 📱 Deploy to Vercel (frontend) + Heroku (backend)

## Environment Variables

Create `.env` files in both directories (copy from `.env.example`):

**backend/.env**
```
PORT=5000
NODE_ENV=development
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Support Commands

```bash
# View backend logs
npm start

# View frontend logs
npm start

# Kill processes
# Windows: Ctrl+C
# macOS/Linux: Ctrl+C or killall node

# Install specific packages
npm install package-name

# Update all packages
npm update
```

---

**You're all set! 🎉 Start using the CYBER RANKING system.**
