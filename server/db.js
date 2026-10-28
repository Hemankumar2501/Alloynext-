const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'alloynext.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    location TEXT DEFAULT 'Remote',
    salary_range TEXT DEFAULT '$150k - $200k',
    current_stage TEXT DEFAULT 'applied',
    applied_at TEXT NOT NULL,
    match_score INTEGER DEFAULT 85,
    job_description TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    location TEXT DEFAULT '',
    linkedin TEXT DEFAULT '',
    github TEXT DEFAULT '',
    portfolio TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    skills_json TEXT DEFAULT '[]',
    experience_json TEXT DEFAULT '[]',
    education_json TEXT DEFAULT '[]',
    projects_json TEXT DEFAULT '[]',
    ats_score INTEGER DEFAULT 88,
    is_primary INTEGER DEFAULT 1,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analysis_reports (
    id TEXT PRIMARY KEY,
    target_role TEXT NOT NULL,
    company TEXT NOT NULL,
    job_description TEXT NOT NULL,
    overall_fit INTEGER NOT NULL,
    keyword_fit INTEGER NOT NULL,
    completeness INTEGER NOT NULL,
    impact_metrics INTEGER NOT NULL,
    matched_skills_json TEXT DEFAULT '[]',
    missing_keywords_json TEXT DEFAULT '[]',
    recommendations_json TEXT DEFAULT '[]',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS interview_drills (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role_title TEXT NOT NULL,
    topic TEXT NOT NULL,
    questions_json TEXT NOT NULL,
    session_answers_json TEXT DEFAULT '[]',
    overall_score INTEGER DEFAULT 85,
    feedback TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    hashed_password TEXT,
    full_name TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    is_verified INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );
`);

// Safe migrations to guarantee both password_hash and hashed_password exist
try { db.prepare('ALTER TABLE users ADD COLUMN password_hash TEXT').run(); } catch (e) {}
try { db.prepare('ALTER TABLE users ADD COLUMN hashed_password TEXT').run(); } catch (e) {}
try { db.prepare('ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1').run(); } catch (e) {}
try { db.prepare('ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 1').run(); } catch (e) {}
try { db.prepare('ALTER TABLE users ADD COLUMN updated_at TEXT').run(); } catch (e) {}

// Check if applications table has seed data; if empty, seed rich production records
const countApps = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;

if (countApps === 0) {
  console.log('[AlloyNext DB] Seeding initial high-quality applications...');
  const now = new Date();
  
  const seedApps = [
    {
      id: 'app_stripe_01',
      company_name: 'Stripe',
      role_title: 'Staff Backend Architect',
      location: 'San Francisco, CA (Hybrid)',
      salary_range: '$220k - $270k',
      current_stage: 'offer',
      applied_at: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      match_score: 96,
      job_description: 'Architecting high-throughput global ledger rails, idempotent payments infrastructure, and resilient multi-region database replication.',
      notes: 'Final partner offer meeting completed. Awaiting signed executive package.'
    },
    {
      id: 'app_vercel_02',
      company_name: 'Vercel',
      role_title: 'Senior Full-Stack Engineer',
      location: 'Remote',
      salary_range: '$180k - $220k',
      current_stage: 'interview',
      applied_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      match_score: 93,
      job_description: 'Leading Next.js server runtime components, edge rendering optimization, and developer experience tooling.',
      notes: 'System architecture round scheduled for Tuesday 2:00 PM EST.'
    },
    {
      id: 'app_linear_03',
      company_name: 'Linear',
      role_title: 'Systems & Product Engineer',
      location: 'Remote',
      salary_range: '$175k - $215k',
      current_stage: 'assessment',
      applied_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      match_score: 90,
      job_description: 'Building ultra-responsive client-side synchronization protocols, local SQLite state machines, and real-time collaboration engines.',
      notes: 'Submitted offline sync take-home project with 100% test coverage.'
    },
    {
      id: 'app_figma_04',
      company_name: 'Figma',
      role_title: 'Infrastructure & WebAssembly Engineer',
      location: 'San Francisco, CA',
      salary_range: '$190k - $240k',
      current_stage: 'applied',
      applied_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      match_score: 87,
      job_description: 'Optimizing collaborative canvas rendering engines using C++, WebAssembly, WebGL, and high-performance browser memory managers.',
      notes: 'Referred by Staff Engineer on the Graphics Platform team.'
    },
    {
      id: 'app_datadog_05',
      company_name: 'Datadog',
      role_title: 'Senior Distributed Systems Engineer',
      location: 'New York, NY (Hybrid)',
      salary_range: '$175k - $225k',
      current_stage: 'wishlist',
      applied_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      match_score: 85,
      job_description: 'Ingesting petabyte-scale telemetry pipelines, time-series aggregation algorithms, and low-latency metrics storage.',
      notes: 'Recruiter reach-out received on LinkedIn; preparing customized resume.'
    },
    {
      id: 'app_airbnb_06',
      company_name: 'Airbnb',
      role_title: 'Senior Frontend Platform Engineer',
      location: 'San Francisco, CA',
      salary_range: '$195k - $235k',
      current_stage: 'interview',
      applied_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      match_score: 91,
      job_description: 'Core web vitals optimization, design system accessibility, and cross-platform component framework modernization.',
      notes: 'Hiring manager screen passed with high commendation. Next: Technical Deep Dive.'
    }
  ];

  const insertApp = db.prepare(`
    INSERT INTO applications (id, company_name, role_title, location, salary_range, current_stage, applied_at, match_score, job_description, notes, created_at, updated_at)
    VALUES (@id, @company_name, @role_title, @location, @salary_range, @current_stage, @applied_at, @match_score, @job_description, @notes, @applied_at, @applied_at)
  `);

  for (const app of seedApps) {
    insertApp.run(app);
  }
}

// Check if primary resume exists; if not, seed comprehensive resume
const countResumes = db.prepare('SELECT COUNT(*) as count FROM resumes').get().count;

if (countResumes === 0) {
  console.log('[AlloyNext DB] Seeding executive resume draft...');
  const resume = {
    id: 'res_primary_01',
    title: 'Data analyst',
    full_name: 'HEMANKUMAR C',
    role_title: 'Data analyst',
    email: 'hemankumar.chandrasekar@gmail.com',
    phone: '+919444969550',
    location: 'Chennai, India',
    linkedin: 'HemankumarC|LINKEDIN',
    github: 'github.com/hemankumar',
    portfolio: '',
    summary: 'I am an aspiring Data Analyst with a strong foundation in SQL, Python, Excel, Power BI, and data visualization. Through academic projects and internships, I have developed skills in data cleaning, analysis, dashboard creation, and reporting. I am passionate about using data to solve business problems and continuously improving my analytical abilities. I am seeking an opportunity to apply my skills, learn from industry professionals, and contribute to organizational growth through data-driven insights',
    skills_json: JSON.stringify([
      'Matplotlib', 'Excel', 'Data cleaning', 'Power BI', 'Seaborn', 'Python', 'MySQL', 'SQL', 'NumPy'
    ]),
    experience_json: JSON.stringify([
      {
        company: 'Arjun Vision Tech Solutions, Chennai',
        role: 'Data Science Intern',
        period: '2024',
        location: 'Chennai',
        bullets: [
          'Applied Data Science methodologies to analyze and interpret datasets.',
          'Worked on data collection, cleaning, and analysis to extract meaningful insights.',
          'Utilized Python and analytical tools for data preprocessing and visualization.'
        ]
      },
      {
        company: 'NSIC - Technical Services Centre, Chennai',
        role: 'AI & ML Intern',
        period: '2024',
        location: 'Chennai',
        bullets: [
          'Acquired practical knowledge of Artificial Intelligence and Machine Learning concepts.',
          'Gained hands-on experience in Artificial Intelligence and Machine Learning techniques.',
          'Applied AI and Machine Learning concepts through practical exercises and projects.'
        ]
      }
    ]),
    education_json: JSON.stringify([
      {
        institution: 'TAGORE ENGINEERING COLLEGE, CHENNAI',
        degree: 'BTECH AI&DS STUDENT CGPA | 7.9',
        period: '2022-2026',
        honors: 'Passionate about AI and Data Science, eager to innovate and solve real-world challenges.'
      },
      {
        institution: 'SRI. S. BADALCHAND SUGANKAVUR CHORDIA VIVEKANANDA VIDYALAYA SCHOOL',
        degree: '10 | 61% - 12 | 64%',
        period: '2020-2022',
        honors: 'Completed higher secondary education with excellence, cultivating a strong aptitude for logical reasoning.'
      }
    ]),
    projects_json: JSON.stringify([
      {
        name: 'Career Guidance Analytics Platform',
        description: 'Collected, cleaned, and analyzed user data including skills, interests, and career preferences using Python and SQL. Performed exploratory data analysis (EDA) to match users with suitable career paths.'
      },
      {
        name: 'AI-Driven Smart Tourism Analytics System',
        description: 'Analyzed tourism datasets to uncover travel trends, user preferences, and destination popularity patterns using Python, Pandas, and interactive dashboards.'
      }
    ]),
    ats_score: 96,
    is_primary: 1,
    updated_at: new Date().toISOString()
  };

  let user = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (!user) {
    const userId = 'bdfa4ce3-c70f-456b-a781-4b4132f1d789';
    db.prepare('INSERT INTO users (id, email, password_hash, full_name, created_at) VALUES (?, ?, ?, ?, ?)').run(
      userId, 'candidate@alloynext.com', 'SecurePassword123!', 'Jordan Lee', new Date().toISOString()
    );
    user = { id: userId };
  }

  db.prepare(`
    INSERT INTO resumes (id, user_id, title, full_name, role_title, email, phone, location, linkedin, github, portfolio, summary, skills, experience, education, projects, ats_score, raw_text, version_number, is_primary, created_at, updated_at)
    VALUES (@id, @user_id, @title, @full_name, @role_title, @email, @phone, @location, @linkedin, @github, @portfolio, @summary, @skills, @experience, @education, @projects, @ats_score, @raw_text, @version_number, @is_primary, @created_at, @updated_at)
  `).run({
    ...resume,
    user_id: user.id,
    skills: resume.skills_json,
    experience: resume.experience_json,
    education: resume.education_json,
    projects: resume.projects_json,
    raw_text: resume.summary,
    version_number: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

module.exports = db;
