const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { generateRanking, getInternBreakdown } = require('./utils/rankingCalculator');

const app = express();
const PORT = process.env.PORT || 5000;

// Database file path
const dbPath = path.join(__dirname, '../database/interns.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to read database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
};

// Helper function to write database
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// ============ Routes ============

/**
 * GET /api/ranking
 * Returns the ranked list of all interns sorted by overall score
 */
app.get('/api/ranking', (req, res) => {
  try {
    const interns = readDatabase();
    const rankedList = generateRanking(interns);

    res.json({
      success: true,
      data: rankedList,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ranking',
    });
  }
});

/**
 * GET /api/ranking/:internId
 * Returns detailed breakdown for a specific intern
 */
app.get('/api/ranking/:internId', (req, res) => {
  try {
    const interns = readDatabase();
    const intern = interns.find((i) => i.id === parseInt(req.params.internId));

    if (!intern) {
      return res.status(404).json({
        success: false,
        error: 'Intern not found',
      });
    }

    const breakdown = getInternBreakdown(intern);

    res.json({
      success: true,
      data: {
        id: intern.id,
        name: intern.name,
        email: intern.email,
        breakdown,
        totalEvaluations: intern.evaluations.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching intern details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch intern details',
    });
  }
});

/**
 * POST /api/avaliacoes
 * Add a new evaluation for an intern
 * Body: {
 *   internId: number,
 *   mentorId: number,
 *   softSkills: { communication: number, proactivity: number, teamwork: number }
 * }
 */
app.post('/api/avaliacoes', (req, res) => {
  try {
    const { internId, mentorId, softSkills } = req.body;

    // Validation
    if (!internId || !mentorId || !softSkills) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate soft score ranges (1-10)
    const allScores = Object.values(softSkills);
    if (allScores.some((score) => score < 1 || score > 10 || !Number.isInteger(score))) {
      return res.status(400).json({
        success: false,
        error: 'All soft-skill scores must be integers between 1 and 10',
      });
    }

    const interns = readDatabase();
    const internIndex = interns.findIndex((i) => i.id === parseInt(internId));

    if (internIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Intern not found',
      });
    }

    // Add new evaluation
    const newEvaluation = {
      mentorId,
      date: new Date().toISOString().split('T')[0],
      softSkills: {
        communication: softSkills.communication,
        proactivity: softSkills.proactivity,
        teamwork: softSkills.teamwork,
      },
    };

    interns[internIndex].evaluations.push(newEvaluation);

    if (!writeDatabase(interns)) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save evaluation',
      });
    }

    const breakdown = getInternBreakdown(interns[internIndex]);

    res.status(201).json({
      success: true,
      message: 'Evaluation added successfully',
      data: {
        internId,
        evaluation: newEvaluation,
        newBreakdown: breakdown,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding evaluation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add evaluation',
    });
  }
});

/**
 * POST /api/avaliacoes/:internId
 * Alternative endpoint to add evaluation for specific intern
 */
app.post('/api/avaliacoes/:internId', (req, res) => {
  try {
    const { mentorId, softSkills } = req.body;
    const internId = parseInt(req.params.internId);

    // Reuse POST /api/avaliacoes logic
    req.body.internId = internId;
    return app._router.stack
      .find((layer) => layer.route?.path === '/api/avaliacoes' && layer.route?.methods?.post)
      ?.handle(req, res);
  } catch (error) {
    console.error('Error adding evaluation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add evaluation',
    });
  }
});

/**
 * GET /api/interns
 * Returns all interns (without ranking calculation for performance)
 */
app.get('/api/interns', (req, res) => {
  try {
    const interns = readDatabase();

    res.json({
      success: true,
      data: interns,
      total: interns.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching interns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interns',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'High-Tech Internship Ranking API',
    version: '1.0.0',
    endpoints: {
      'GET /api/ranking': 'Get ranked list of all interns',
      'GET /api/ranking/:internId': 'Get detailed breakdown for specific intern',
      'GET /api/interns': 'Get all interns',
      'POST /api/avaliacoes': 'Add new evaluation',
      'GET /api/health': 'Health check',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🚀 Internship Ranking API Server Started      ║
╚════════════════════════════════════════════════╝
📡 Server running on: http://localhost:${PORT}
🔌 API Documentation: http://localhost:${PORT}/
  `);
});

module.exports = app;
