# 📊 Ranking Algorithm Documentation

## Overview

The Internship Ranking System uses a **simple arithmetic mean** algorithm to calculate overall performance scores. This ensures fairness and transparency in the evaluation process.

## Formula

```
Overall Score = (Sum of All Scores) / (Total Number of Scores)

Where:
- Each evaluation contains 6 scores (3 Hard Skills + 3 Soft Skills)
- Scale: 1-10 (where 10 = excellent, 1 = needs improvement)
- All scores weighted equally
```

## Scoring Components

### Hard Skills (Technical Competencies)
1. **Logic** - Problem-solving, algorithmic thinking, debugging
2. **JavaScript** - JS language proficiency, ES6+, frameworks
3. **SQL** - Database queries, joins, optimization

### Soft Skills (Behavioral Competencies)
1. **Communication** - Clarity, listening, presentation skills
2. **Proactivity** - Initiative, self-motivation, going beyond requirements
3. **Teamwork** - Collaboration, peer support, group dynamics

## Calculation Example

### Scenario: Single Intern with 2 Evaluations

**Evaluation 1 (Mentor João):**
- Hard Skills: Logic=8, JavaScript=9, SQL=7
- Soft Skills: Communication=8, Proactivity=9, Teamwork=8
- All 6 scores: [8, 9, 7, 8, 9, 8]

**Evaluation 2 (Mentor Maria):**
- Hard Skills: Logic=9, JavaScript=8, SQL=8
- Soft Skills: Communication=9, Proactivity=8, Teamwork=9
- All 6 scores: [9, 8, 8, 9, 8, 9]

### Calculation Steps

**Step 1: Pool all scores**
```
All Scores = [8, 9, 7, 8, 9, 8] + [9, 8, 8, 9, 8, 9]
All Scores = [8, 9, 7, 8, 9, 8, 9, 8, 8, 9, 8, 9]
```

**Step 2: Sum all scores**
```
Sum = 8+9+7+8+9+8+9+8+8+9+8+9 = 101
```

**Step 3: Count total scores**
```
Total = 12 scores (2 evaluations × 6 scores each)
```

**Step 4: Calculate average**
```
Overall Score = 101 / 12 = 8.417 ≈ 8.42
```

**Result:** Intern's ranking score is **8.42/10**

## Breakdown Averages

The system also calculates sub-averages for insight:

### Hard Skills Average
```
Hard Skills Avg = (Logic + JavaScript + SQL) / 3
                = (8.5 + 8.5 + 7.5) / 3
                = 8.17/10
```

### Soft Skills Average
```
Soft Skills Avg = (Communication + Proactivity + Teamwork) / 3
                = (8.5 + 8.5 + 8.5) / 3
                = 8.5/10
```

## Ranking Generation

The system ranks interns by sorting overall scores in descending order:

| Rank | Intern Name | Overall Score | Hard Skills | Soft Skills |
|------|------------|---------------|------------|------------|
| 🥇 1 | Carlos Mendes | 9.00 | 9.00 | 9.00 |
| 🥈 2 | Alice Silva | 8.42 | 8.17 | 8.50 |
| 🥉 3 | Eduardo Souza | 8.33 | 8.33 | 8.33 |
| 4 | Bruno Costa | 7.42 | 7.33 | 7.50 |
| 5 | Diana Ferreira | 6.33 | 6.00 | 6.67 |

## Why This Algorithm?

1. **Simplicity** - Easy to understand and verify
2. **Fairness** - All scores weighted equally
3. **Transparency** - No hidden formulas or weightings
4. **Consistency** - Same methodology across all interns
5. **Scalability** - Works with any number of evaluations

## Edge Cases

### Case 1: No Evaluations
```
Score = 0 (displays as 0.00)
Result: Intern not ranked yet
```

### Case 2: Single Evaluation
```
All 6 scores are averaged directly
Example: [8,9,7,8,9,8] → 8.17
```

### Case 3: Multiple Mentors
```
All evaluations merged into single pool
Multiple perspectives considered equally
Example: 5 evaluations × 6 scores = 30 scores averaged
```

## Implementation in Code

### JavaScript (Backend)

```javascript
const calculateInternScore = (intern) => {
  if (!intern.evaluations || intern.evaluations.length === 0) {
    return 0;
  }

  const allScores = [];

  intern.evaluations.forEach((evaluation) => {
    // Pool all scores from this evaluation
    const hardSkillsScores = [
      evaluation.hardSkills.logic,
      evaluation.hardSkills.javascript,
      evaluation.hardSkills.sql,
    ];
    const softSkillsScores = [
      evaluation.softSkills.communication,
      evaluation.softSkills.proactivity,
      evaluation.softSkills.teamwork,
    ];

    allScores.push(...hardSkillsScores, ...softSkillsScores);
  });

  // Simple arithmetic mean
  return calculateAverage(allScores);
};

const calculateAverage = (values) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};
```

## PostgreSQL Implementation

```sql
-- Calculate intern score in PostgreSQL
CREATE OR REPLACE FUNCTION get_intern_score(p_intern_id INTEGER)
RETURNS NUMERIC AS $$
    SELECT ROUND(
        AVG(
            (logic_score + javascript_score + sql_score + 
             communication_score + proactivity_score + teamwork_score) / 6.0
        )::numeric,
        2
    )
    FROM evaluations
    WHERE intern_id = p_intern_id;
$$ LANGUAGE SQL;
```

## Performance Considerations

- **Current**: JSON file - O(n) calculation per request
- **Optimized**: PostgreSQL view with materialized caching - O(1) lookup
- **Scale**: System handles thousands of evaluations efficiently

## Future Enhancements

1. **Weighted Scores**: Different weights for Hard vs Soft Skills
2. **Time-based Decay**: Older evaluations count less
3. **Mentor Weighting**: Different mentor levels affect scores differently
4. **Skill Trending**: Track improvement over time
5. **Percentile Ranking**: Show position relative to cohort

## Validation Rules

- Scores must be **integers** between **1-10**
- All scores are **required** (no nulls)
- Missing evaluations result in **0 score**
- Each evaluation must have exactly **6 scores**

## Testing the Algorithm

### Unit Tests

```javascript
// Test 1: Basic average
const intern1 = {
  evaluations: [{
    hardSkills: { logic: 10, javascript: 10, sql: 10 },
    softSkills: { communication: 10, proactivity: 10, teamwork: 10 }
  }]
};
assert.equal(calculateInternScore(intern1), 10.0);

// Test 2: Mixed scores
const intern2 = {
  evaluations: [{
    hardSkills: { logic: 8, javascript: 7, sql: 6 },
    softSkills: { communication: 9, proactivity: 8, teamwork: 7 }
  }]
};
assert.equal(calculateInternScore(intern2), 7.5);
```

## API Response Format

```json
{
  "ranking": 1,
  "score": 8.42,
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
    "overallAverage": 8.42
  }
}
```

---

**Algorithm Version**: 1.0
**Last Updated**: March 2026
**Maintainer**: Fullstack Team
