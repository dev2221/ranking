-- PostgreSQL Schema for Internship Ranking System
-- This schema is prepared for future migration from JSON array

-- ============ TABLES ============

-- Interns Table
CREATE TABLE interns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentors Table
CREATE TABLE mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evaluations Table
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    intern_id INTEGER NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
    mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE SET NULL,
    evaluation_date DATE DEFAULT CURRENT_DATE,
    
    -- Soft Skills (1-10)
    communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 10),
    proactivity_score INTEGER CHECK (proactivity_score BETWEEN 1 AND 10),
    teamwork_score INTEGER CHECK (teamwork_score BETWEEN 1 AND 10),
    
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (intern_id) REFERENCES interns(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL
);

-- Ranking View (for quick ranking queries)
CREATE VIEW intern_rankings AS
SELECT
    i.id,
    i.name,
    i.email,
    COUNT(e.id) as total_evaluations,
    ROUND(
        AVG(
            (e.communication_score + e.proactivity_score + e.teamwork_score) / 3.0
        )::numeric,
        2
    ) as overall_score,
    NULL::numeric as hard_skills_average,
    ROUND(
        AVG(
            (e.communication_score + e.proactivity_score + e.teamwork_score) / 3.0
        )::numeric,
        2
    ) as soft_skills_average,
    ROW_NUMBER() OVER (ORDER BY AVG((e.communication_score + e.proactivity_score + e.teamwork_score) / 3.0) DESC) as ranking
    overall_score DESC;

-- ============ INDEXES ============

-- Performance Indexes
CREATE INDEX idx_evaluations_intern_id ON evaluations(intern_id);
CREATE INDEX idx_evaluations_mentor_id ON evaluations(mentor_id);
CREATE INDEX idx_evaluations_date ON evaluations(evaluation_date);
CREATE INDEX idx_interns_email ON interns(email);
CREATE INDEX idx_mentors_email ON mentors(email);

-- ============ CONSTRAINTS ============

-- Check constraints for score ranges are already defined in table creation

-- ============ SAMPLE DATA INSERTION ============

INSERT INTO mentors (name, email, department) VALUES
    ('João Silva', 'joao.silva@company.com', 'Senior Development'),
    ('Maria Santos', 'maria.santos@company.com', 'Tech Lead'),
    ('Carlos Oliveira', 'carlos.oliveira@company.com', 'Backend Lead');

INSERT INTO interns (name, email) VALUES
    ('Lunara', 'lunara@example.com'),
    ('Hemerson', 'hemerson@example.com'),
    ('Mariana', 'mariana@example.com'),
    ('Nathalia', 'nathalia@example.com'),
    ('Gusthavo', 'gusthavo@example.com'),
    ('Mateus', 'mateus@example.com');

-- Sample evaluations
INSERT INTO evaluations (intern_id, mentor_id, logic_score, javascript_score, sql_score, 
                        communication_score, proactivity_score, teamwork_score) VALUES
    (1, 1, 8, 9, 7, 8, 9, 8),
    (1, 2, 9, 8, 8, 9, 8, 9),
    (2, 1, 7, 7, 6, 7, 6, 7),
    (2, 3, 8, 8, 7, 8, 7, 8),
    (3, 2, 9, 9, 9, 9, 9, 9),
    (4, 3, 6, 7, 5, 6, 7, 6),
    (5, 1, 8, 8, 8, 9, 9, 8),
    (5, 2, 9, 9, 9, 10, 10, 9);

-- ============ FUNCTIONS ============

-- Function to calculate intern ranking
CREATE OR REPLACE FUNCTION get_intern_score(p_intern_id INTEGER)
RETURNS NUMERIC AS $$
    SELECT ROUND(
        AVG(
            (communication_score + proactivity_score + teamwork_score) / 3.0
$$ LANGUAGE SQL;

-- Function to get top N interns
CREATE OR REPLACE FUNCTION get_top_interns(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    intern_id INTEGER,
    intern_name VARCHAR(255),
    overall_score NUMERIC,
    ranking INTEGER
) AS $$
    SELECT
        i.id,
        i.name,
        ROUND(
            AVG(
                (e.logic_score + e.javascript_score + e.sql_score + 
                 e.communication_score + e.proactivity_score + e.teamwork_score) / 6.0
            )::numeric,
            2
        ),
        ROW_NUMBER() OVER (ORDER BY AVG((e.logic_score + e.javascript_score + e.sql_score + 
                                          e.communication_score + e.proactivity_score + e.teamwork_score) / 6.0) DESC)
    FROM
        interns i
    LEFT JOIN
        evaluations e ON i.id = e.intern_id
    GROUP BY
        i.id,
        i.name
    ORDER BY
        overall_score DESC
    LIMIT p_limit;
$$ LANGUAGE SQL;

-- ============ GRANTS (for user permissions) ============

-- Uncomment and modify these based on your deployment needs
-- GRANT SELECT ON interns TO app_user;
-- GRANT SELECT ON evaluations TO app_user;
-- GRANT INSERT, UPDATE ON evaluations TO app_user;
-- GRANT SELECT ON intern_rankings TO app_user;
