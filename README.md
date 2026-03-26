# High-Tech Internship Ranking System 🚀

A futuristic cyberpunk-styled Full-Stack application for ranking and evaluating high-tech interns. Built with Node.js + Express, React, Tailwind CSS, and PostgreSQL (prepared).

## 🎨 Features

- **Cyber Dashboard Design**: Dark mode with neon cyan and electric purple accents
- **Glassmorphism Effects**: Modern backdrop-blur styling on cards
- **Animated Ranking Table**: Rows slide up on page load with framer-motion
- **REST API**: Express backend with `/avaliacoes` (POST) and `/ranking` (GET) endpoints
- **Evaluation System**: Assess interns on Hard Skills (Logic, JS, SQL) and Soft Skills (Communication, Proactivity, Teamwork)
- **Smart Ranking**: Automatic calculation of averages with sorting from highest to lowest
- **PostgreSQL Ready**: Full schema prepared for production migration
- **Real-time Scoring**: Progress bars showing internship performance

## 📋 Project Structure

```
Ranking/
├── backend/
│   ├── utils/
│   │   └── rankingCalculator.js    # Ranking logic & calculations
│   ├── server.js                   # Express server & API routes
│   └── package.json                # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html              # React HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── RankingTable.jsx    # Main ranking display component
│   │   ├── App.jsx                 # Main React app
│   │   ├── App.css                 # Tailwind & custom styles
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── postcss.config.js           # PostCSS config
│   └── package.json                # Frontend dependencies
└── database/
    ├── interns.json                # Initial data (JSON format)
    └── postgresSchema.sql          # PostgreSQL schema (production ready)
```

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin requests
- **Body-Parser** - JSON parsing

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Recharts** - (Prepared for radar charts)
- **Axios** - HTTP client

### Database
- **JSON Array** - Initial data storage
- **PostgreSQL** - Production-ready schema (prepared)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git (optional)

### Installation

1. **Clone the repository** (or extract the project folder)
   ```bash
   cd Ranking
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Start Backend Server

```bash
cd backend
npm start
```

The API will be available at `http://localhost:5000`

#### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
```

The React app will open at `http://localhost:3000`

## 📡 API Endpoints

### GET /api/ranking
Returns the complete ranked list of all interns sorted by overall score.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alice Silva",
      "email": "alice@example.com",
      "ranking": 1,
      "score": 8.33,
      "breakdown": {
        "hardSkillsAverage": 8.33,
        "softSkillsAverage": 8.33,
        "overallAverage": 8.33
      }
    }
  ],
  "timestamp": "2026-03-25T10:30:00.000Z"
}
```

### GET /api/ranking/:internId
Returns detailed breakdown for a specific intern.

**Parameters:**
- `internId` (path parameter): The ID of the intern

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice Silva",
    "email": "alice@example.com",
    "breakdown": {
      "hardSkills": {
        "logic": 8.5,
        "javascript": 8.5,
        "sql": 7.5
      },
      "softSkills": {
        "communication": 8.5,
        "proactivity": 8.5,
        "teamwork": 8.5
      },
      "hardSkillsAverage": 8.17,
      "softSkillsAverage": 8.5,
      "overallAverage": 8.33
    },
    "totalEvaluations": 2
  }
}
```

### POST /api/avaliacoes
Add a new evaluation for an intern.

**Request Body:**
```json
{
  "internId": 1,
  "mentorId": 101,
  "hardSkills": {
    "logic": 9,
    "javascript": 9,
    "sql": 8
  },
  "softSkills": {
    "communication": 9,
    "proactivity": 9,
    "teamwork": 8
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Evaluation added successfully",
  "data": {
    "internId": 1,
    "evaluation": { /* evaluation details */ },
    "newBreakdown": { /* updated breakdown */ }
  },
  "timestamp": "2026-03-25T10:30:00.000Z"
}
```

### GET /api/interns
Returns all interns without ranking calculation.

### GET /api/health
Health check endpoint.

## 🎯 Ranking Calculation Logic

The system uses **simple arithmetic mean** of all evaluations:

```
Overall Score = (Sum of all Hard Skills + Sum of all Soft Skills) / Total Scores

Hard Skills Average = (Logic + JavaScript + SQL) / 3
Soft Skills Average = (Communication + Proactivity + Teamwork) / 3
```

### Example:
For an intern with 2 evaluations:
- **Evaluation 1**: All scores = 8 → Average = 8.0
- **Evaluation 2**: All scores = 9 → Average = 9.0
- **Final Score**: (8.0 + 9.0) / 2 = **8.5**

## 🎨 Design System

### Colors
- **Background**: #0f172a (Deep Dark Blue)
- **Primary Accent**: #00FFFF (Neon Cyan)
- **Secondary Accent**: #EE82FF (Electric Purple)
- **Card Background**: rgba(15, 23, 42, 0.4) with backdrop-blur

### Components
- **Glassmorphism Cards**: Backdrop blur + semi-transparent backgrounds
- **Gradient Borders**: Animated neon gradients on hover
- **Progress Bars**: Gradient fills showing performance
- **Medal Badges**: 🥇 🥈 🥉 ⭐ based on ranking position

### Animations
- Rows slide up on page load (staggered)
- Cards glow on hover with purple shadow
- Progress bars animate on render
- Pulse effect on title text

## 📊 Skills Breakdown

### Hard Skills
1. **Logic** - Problem-solving and algorithmic thinking
2. **JavaScript** - JavaScript programming proficiency
3. **SQL** - Database query and management skills

### Soft Skills
1. **Communication** - Clear expression and listening
2. **Proactivity** - Initiative and self-motivation
3. **Teamwork** - Collaboration and teamwork ability

## 🗄 Database Migration (PostgreSQL)

When ready to migrate to PostgreSQL:

1. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE internship_ranking;
   ```

2. **Run the schema**:
   ```bash
   psql -U postgres -d internship_ranking -f database/postgresSchema.sql
   ```

3. **Update backend connection** in `backend/server.js`:
   ```javascript
   const sequelize = new Sequelize('internship_ranking', 'username', 'password', {
     host: 'localhost',
     dialect: 'postgres'
   });
   ```

## 📝 Sample Data

The system comes with 5 sample interns with multiple evaluations. See `database/interns.json` for the data structure.

## 🔧 Configuration

### Frontend
Create a `.env` file in the `frontend/` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend
Create a `.env` file in the `backend/` directory:
```
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to Vercel
```

### Backend (Heroku)
```bash
cd backend
git init
echo "node_modules" >> .gitignore
git add .
git commit -m "Initial commit"
git push heroku main
```

## 📚 Next Steps

1. **Add Radar Chart**: Use recharts to visualize Hard vs Soft skills comparison
2. **Mentor Dashboard**: Add mentor evaluation interface
3. **Authentication**: Implement JWT authentication
4. **Export Reports**: Generate PDF ranking reports
5. **Real-time Updates**: Integrate WebSockets for live ranking updates
6. **Responsive Design**: Optimize for mobile and tablet

## 🐛 Troubleshooting

### CORS Error
Ensure backend is running on `http://localhost:5000` and frontend on `http://localhost:3000`.

### API Not Found (404)
- Check if backend server is running
- Verify API routes in `backend/server.js`
- Check `REACT_APP_API_URL` in `.env`

### Styling Issues
Ensure Tailwind CSS is properly configured:
```bash
cd frontend
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📧 Contact & Support

For questions or issues, please open an issue on GitHub or contact the development team.

## 📄 License

MIT License - Feel free to use this project for educational and commercial purposes.

---

**Built with ❤️ by Senior Fullstack Developers**
