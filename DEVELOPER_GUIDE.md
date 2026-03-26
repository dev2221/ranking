# 💻 Developer Reference & Code Examples

## Table of Contents
1. [Backend API Usage](#backend-api-usage)
2. [Frontend Component Usage](#frontend-component-usage)
3. [Ranking Calculator Functions](#ranking-calculator-functions)
4. [Common Integration Patterns](#common-integration-patterns)
5. [Error Handling](#error-handling)

---

## Backend API Usage

### 1. Start Backend Server

```bash
cd backend
npm install
npm start
```

Server runs on: `http://localhost:5000`

### 2. API Endpoints

#### GET /api/ranking - Get Full Ranking List

```javascript
// Using Fetch API
fetch('http://localhost:5000/api/ranking')
  .then(res => res.json())
  .then(data => {
    console.log('Ranking:', data.data);
    // data.data contains array of ranked interns
  });
```

```javascript
// Using Axios
const axios = require('axios');

const getRanking = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/ranking');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ranking:', error);
  }
};
```

```bash
# Using cURL
curl http://localhost:5000/api/ranking | json_pp
```

#### GET /api/ranking/:internId - Get Intern Details

```javascript
// Fetch intern details
fetch('http://localhost:5000/api/ranking/1')
  .then(res => res.json())
  .then(data => {
    const {
      id,
      name,
      email,
      breakdown,
      totalEvaluations
    } = data.data;
    
    console.log(`${name}: Hard Skills ${breakdown.hardSkillsAverage}, Soft Skills ${breakdown.softSkillsAverage}`);
  });
```

#### POST /api/avaliacoes - Add New Evaluation

```javascript
// Add evaluation for intern
const addEvaluation = async (internId, evaluation) => {
  try {
    const response = await fetch('http://localhost:5000/api/avaliacoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        internId,
        mentorId: 101, // Mentor ID
        hardSkills: {
          logic: evaluation.logic,
          javascript: evaluation.js,
          sql: evaluation.sql,
        },
        softSkills: {
          communication: evaluation.communication,
          proactivity: evaluation.proactivity,
          teamwork: evaluation.teamwork,
        },
      }),
    });

    const result = await response.json();
    if (result.success) {
      console.log('Evaluation added!');
      console.log('New score:', result.data.newBreakdown.overallAverage);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
addEvaluation(1, {
  logic: 9,
  js: 9,
  sql: 8,
  communication: 9,
  proactivity: 8,
  teamwork: 9,
});
```

#### GET /api/interns - Get All Interns

```javascript
// Get all interns without ranking calculation
const getAllInterns = async () => {
  const response = await fetch('http://localhost:5000/api/interns');
  const data = await response.json();
  return data.data; // Array of all interns
};
```

```bash
curl http://localhost:5000/api/interns
```

---

## Frontend Component Usage

### 1. Using RankingTable Component

```jsx
import React, { useEffect, useState } from 'react';
import RankingTable from './components/RankingTable';
import axios from 'axios';

function Dashboard() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ranking');
      setInterns(response.data.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <RankingTable interns={interns} />
      )}
    </div>
  );
}

export default Dashboard;
```

### 2. Creating Custom Ranking Display

```jsx
import React from 'react';
import { motion } from 'framer-motion';

const CustomRankingView = ({ interns }) => {
  return (
    <div className="space-y-4">
      {interns.map((intern, idx) => (
        <motion.div
          key={intern.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="p-4 bg-slate-900 rounded-lg border border-cyan-400"
        >
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-cyan-400">
              #{intern.ranking}
            </span>
            <div>
              <h3 className="text-white font-bold">{intern.name}</h3>
              <p className="text-cyan-300">{intern.email}</p>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {intern.score.toFixed(2)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CustomRankingView;
```

---

## Ranking Calculator Functions

### Import and Use Directly

```javascript
const {
  calculateInternScore,
  getInternBreakdown,
  generateRanking,
  calculateAverage
} = require('./utils/rankingCalculator');

// Example 1: Calculate single intern score
const internData = {
  evaluations: [
    {
      hardSkills: { logic: 8, javascript: 9, sql: 7 },
      softSkills: { communication: 8, proactivity: 9, teamwork: 8 }
    }
  ]
};

const score = calculateInternScore(internData);
console.log(`Intern score: ${score}`); // 8.17

// Example 2: Get detailed breakdown
const breakdown = getInternBreakdown(internData);
console.log(breakdown);
// Output:
// {
//   hardSkills: { logic: 8, javascript: 9, sql: 7 },
//   softSkills: { communication: 8, proactivity: 9, teamwork: 8 },
//   hardSkillsAverage: 8.0,
//   softSkillsAverage: 8.33,
//   overallAverage: 8.17
// }

// Example 3: Generate complete ranking
const allInterns = [
  { id: 1, name: 'Alice', evaluations: [...] },
  { id: 2, name: 'Bruno', evaluations: [...] }
];

const ranking = generateRanking(allInterns);
ranking.forEach(intern => {
  console.log(`${intern.ranking}. ${intern.name} - ${intern.score}`);
});
```

---

## Common Integration Patterns

### Pattern 1: Auto-Update Ranking on New Evaluation

```jsx
const [ranking, setRanking] = useState([]);

const submitEvaluation = async (internId, scores) => {
  try {
    // Send evaluation
    await axios.post('http://localhost:5000/api/avaliacoes', {
      internId,
      mentorId: 101,
      hardSkills: { logic: scores.logic, javascript: scores.js, sql: scores.sql },
      softSkills: { communication: scores.communication, proactivity: scores.proactivity, teamwork: scores.teamwork }
    });

    // Refresh ranking
    const response = await axios.get('http://localhost:5000/api/ranking');
    setRanking(response.data.data);

    console.log('Evaluation submitted and ranking updated!');
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Pattern 2: Real-time Score Updates with WebSocket (Future)

```javascript
// Pseudo-code for WebSocket integration
const socket = io('http://localhost:5000');

socket.on('evaluation-added', (data) => {
  console.log('New evaluation received:', data);
  setRanking(data.updatedRanking);
});

const submitEvaluationViaSocket = (internId, scores) => {
  socket.emit('submit-evaluation', { internId, scores });
};
```

### Pattern 3: Filtering and Sorting

```javascript
const filterByScore = (interns, minScore, maxScore) => {
  return interns.filter(
    intern => intern.score >= minScore && intern.score <= maxScore
  );
};

const filterBySkill = (interns, skillType, minScore) => {
  return interns.filter(intern => {
    if (skillType === 'hard') {
      return intern.breakdown.hardSkillsAverage >= minScore;
    } else if (skillType === 'soft') {
      return intern.breakdown.softSkillsAverage >= minScore;
    }
    return true;
  });
};

// Usage
const topPerformers = filterByScore(ranking, 8, 10);
const strongCommunicators = filterBySkill(ranking, 'soft', 8.5);
```

### Pattern 4: Export Data to CSV

```javascript
const exportRankingToCSV = (ranking) => {
  const headers = ['Rank', 'Name', 'Email', 'Overall Score', 'Hard Skills', 'Soft Skills'];
  
  const rows = ranking.map(intern => [
    intern.ranking,
    intern.name,
    intern.email,
    intern.score,
    intern.breakdown.hardSkillsAverage,
    intern.breakdown.softSkillsAverage
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ranking.csv';
  a.click();
};
```

---

## Error Handling

### Backend Error Responses

#### 400 - Bad Request
```json
{
  "success": false,
  "error": "All scores must be integers between 1 and 10"
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "error": "Intern not found"
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "error": "Failed to fetch ranking"
}
```

### Frontend Error Handling

```javascript
const handleAPIError = async (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    if (status === 404) {
      console.error('Intern not found');
      setError('O estagiário não foi encontrado');
    } else if (status === 400) {
      console.error('Validation error:', data.error);
      setError(`Erro de validação: ${data.error}`);
    } else if (status === 500) {
      console.error('Server error');
      setError('Erro do servidor. Tente novamente mais tarde.');
    }
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
    setError('Servidor indisponível. Verifique sua conexão.');
  } else {
    // Error in request setup
    console.error('Error:', error.message);
    setError('Erro ao enviar requisição');
  }
};

// Usage
try {
  await submitEvaluation(internId, scores);
} catch (error) {
  handleAPIError(error);
}
```

### Validation Before Submit

```javascript
const validateEvaluation = (scores) => {
  const errors = [];

  // Check all scores exist
  if (!scores.logic) errors.push('Logic score required');
  if (!scores.javascript) errors.push('JavaScript score required');
  if (!scores.sql) errors.push('SQL score required');
  if (!scores.communication) errors.push('Communication score required');
  if (!scores.proactivity) errors.push('Proactivity score required');
  if (!scores.teamwork) errors.push('Teamwork score required');

  // Check score range
  Object.entries(scores).forEach(([key, value]) => {
    if (value < 1 || value > 10 || !Number.isInteger(value)) {
      errors.push(`${key} must be an integer between 1 and 10`);
    }
  });

  return errors;
};

// Usage
const errors = validateEvaluation(userScores);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
  setErrorMessages(errors);
  return;
}
```

---

## Testing Examples

### Jest Unit Test

```javascript
// rankingCalculator.test.js
const {
  calculateInternScore,
  generateRanking
} = require('./rankingCalculator');

describe('Ranking Calculator', () => {
  test('should calculate average of perfect scores', () => {
    const intern = {
      evaluations: [{
        hardSkills: { logic: 10, javascript: 10, sql: 10 },
        softSkills: { communication: 10, proactivity: 10, teamwork: 10 }
      }]
    };

    expect(calculateInternScore(intern)).toBe(10);
  });

  test('should handle multiple evaluations', () => {
    const intern = {
      evaluations: [
        {
          hardSkills: { logic: 8, javascript: 8, sql: 8 },
          softSkills: { communication: 8, proactivity: 8, teamwork: 8 }
        },
        {
          hardSkills: { logic: 10, javascript: 10, sql: 10 },
          softSkills: { communication: 10, proactivity: 10, teamwork: 10 }
        }
      ]
    };

    expect(calculateInternScore(intern)).toBe(9);
  });

  test('should rank interns correctly', () => {
    const interns = [
      { id: 1, evaluations: [{ hardSkills: { logic: 7, javascript: 7, sql: 7 }, softSkills: { communication: 7, proactivity: 7, teamwork: 7 } }] },
      { id: 2, evaluations: [{ hardSkills: { logic: 9, javascript: 9, sql: 9 }, softSkills: { communication: 9, proactivity: 9, teamwork: 9 } }] }
    ];

    const ranked = generateRanking(interns);
    expect(ranked[0].ranking).toBe(1);
    expect(ranked[0].id).toBe(2);
  });
});
```

---

**For more examples and detailed API documentation, check the [README.md](./README.md)**
