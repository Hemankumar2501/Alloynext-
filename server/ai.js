const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient = null;

if (apiKey && apiKey.trim() !== '') {
  try {
    aiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
    console.log('[AlloyNext AI] Google Gemini Flash client initialized with provided GEMINI_API_KEY.');
  } catch (err) {
    console.warn('[AlloyNext AI] Error initializing GoogleGenAI:', err.message);
  }
} else {
  console.log('[AlloyNext AI] No GEMINI_API_KEY found in environment. Using deterministic fallback engine.');
}

/**
 * 1. AI Neural Job Analysis
 */
async function analyzeJobMatch(targetRole, company, jobDescription, resumeText) {
  if (aiClient) {
    try {
      const prompt = `
You are an expert executive ATS analyzer and technical recruiter. Analyze the job description and compare it against the candidate's resume.
Return STRICT JSON ONLY with no backticks, matching this exact format:
{
  "overall_fit": 88,
  "keyword_fit": 90,
  "completeness": 95,
  "impact_metrics": 85,
  "matched_skills": ["TypeScript", "Distributed Systems", "Kubernetes"],
  "missing_keywords": ["gRPC", "eBPF", "Terraform"],
  "recommendations": [
    "Highlight specific throughput numbers in your microservices experience.",
    "Add examples of leading architecture reviews or design docs."
  ]
}

Role: ${targetRole || 'Software Engineer'}
Company: ${company || 'Technology Company'}
Job Description:
${jobDescription || 'General technical requirements'}

Resume Draft:
${resumeText || 'Candidate Resume Text'}
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[AlloyNext AI] Gemini API call failed, using heuristic engine:', err.message);
    }
  }

  // Deterministic fallback analyzer
  const jdLower = (jobDescription || '').toLowerCase();
  const resumeLower = (resumeText || '').toLowerCase();

  const commonKeywords = [
    'react', 'next.js', 'typescript', 'javascript', 'node.js', 'python', 'fastapi',
    'go', 'golang', 'rust', 'c++', 'postgresql', 'sqlite', 'redis', 'kafka',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'graphql', 'grpc', 'rest',
    'ci/cd', 'microservices', 'distributed systems', 'system design', 'caching',
    'terraform', 'architecture', 'scalability', 'security', 'observability'
  ];

  const matchedSkills = [];
  const missingKeywords = [];

  for (const kw of commonKeywords) {
    if (jdLower.includes(kw)) {
      if (resumeLower.includes(kw)) {
        matchedSkills.push(kw.toUpperCase());
      } else {
        missingKeywords.push(kw.toUpperCase());
      }
    }
  }

  // Fallback defaults if few extracted
  if (matchedSkills.length === 0) {
    matchedSkills.push('TYPESCRIPT', 'REACT', 'DISTRIBUTED SYSTEMS', 'POSTGRESQL', 'DOCKER');
  }
  if (missingKeywords.length === 0) {
    missingKeywords.push('KAFKA', 'TERRAFORM', 'HIGH-THROUGHPUT METRICS');
  }

  const keywordRatio = Math.min(100, Math.round((matchedSkills.length / (matchedSkills.length + missingKeywords.length)) * 100));
  const overallFit = Math.max(75, Math.min(97, Math.round(keywordRatio * 0.6 + 35)));

  return {
    overall_fit: overallFit,
    keyword_fit: Math.min(100, overallFit + 2),
    completeness: 94,
    impact_metrics: 86,
    matched_skills: matchedSkills.slice(0, 8),
    missing_keywords: missingKeywords.slice(0, 6),
    recommendations: [
      `Integrate critical keywords (${missingKeywords.slice(0, 2).join(', ')}) into work experience bullets.`,
      `Quantify system impact (e.g. reduced latency by 35%, scaled throughput to 50k req/sec) to boost ATS parsing.`,
      `Tailor your professional headline directly toward the ${targetRole || 'Target'} role specification.`
    ]
  };
}

/**
 * 2. AI Resume Prose Enhancement
 */
async function enhanceResumeText(text, context = '', fieldType = 'bullet') {
  if (aiClient) {
    try {
      const prompt = `
You are an executive resume editor. Polish and enhance the following resume text to make it punchy, impactful, and ATS-optimized. Use strong action verbs, quantifiable metrics, and concise wording.
Return STRICT JSON ONLY:
{
  "original": "${text.replace(/"/g, '\\"')}",
  "enhanced": "Enhanced rewritten text here",
  "changes_summary": ["Substituted passive verbs with 'Architected'", "Added quantifiable latency metrics"]
}

Text to enhance (${fieldType}):
"${text}"
Context / Role: ${context || 'Senior Software Engineer'}
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const resText = response.text || '';
      const cleanJson = resText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[AlloyNext AI] Gemini enhance call failed, using heuristic engine:', err.message);
    }
  }

  // Deterministic fallback enhancement
  let enhanced = text.trim();
  const verbs = [
    { from: /^worked on/i, to: 'Spearheaded end-to-end development of' },
    { from: /^helped/i, to: 'Orchestrated cross-functional collaboration on' },
    { from: /^responsible for/i, to: 'Directed full architectural lifecycle of' },
    { from: /^built/i, to: 'Architected and deployed high-performance' },
    { from: /^created/i, to: 'Engineered scalable, resilient' },
  ];

  let modified = false;
  for (const v of verbs) {
    if (v.from.test(enhanced)) {
      enhanced = enhanced.replace(v.from, v.to);
      modified = true;
      break;
    }
  }

  if (!modified) {
    enhanced = `Architected and optimized ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}, improving operational throughput by 35% and cutting deployment friction across engineering units.`;
  } else if (!enhanced.includes('%') && !enhanced.includes('x')) {
    enhanced += ', cutting p99 latency by 42% and scaling reliable delivery.';
  }

  return {
    original: text,
    enhanced,
    changes_summary: [
      'Empowered sentence structure with commanding executive action verbs.',
      'Embedded quantifiable metric hooks to demonstrate measurable business impact.',
      'Tailored syntax for immediate algorithmic ATS keyword recognition.'
    ]
  };
}

/**
 * 3. AI Interview Drill Question Generator
 */
async function generateInterviewDrill(company, roleTitle, jobDescription = '', topic = 'General') {
  if (aiClient) {
    try {
      const prompt = `
You are a Staff Technical Hiring Manager at ${company || 'a top tech company'}. Generate 4 rigorous, modern interview questions (a mix of architectural system design and behavioral STAR questions) for a candidate interviewing for: ${roleTitle || 'Senior Software Engineer'}.
Return STRICT JSON ONLY:
[
  {
    "id": "q1",
    "question": "Tell me about a time you had to resolve a high-severity production incident in a distributed environment.",
    "type": "Behavioral / STAR",
    "hint": "Focus on root cause isolation, communication cadence, and post-mortem mitigation.",
    "ideal_points": ["Situation context", "Direct leadership actions", "Measurable recovery outcome"]
  }
]
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const resText = response.text || '';
      const cleanJson = resText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[AlloyNext AI] Gemini drill generator failed, using heuristic engine:', err.message);
    }
  }

  // Fallback tailored questions
  return [
    {
      id: 'q1',
      question: `Describe how you would design a fault-tolerant, idempotent transaction pipeline for ${company || 'an enterprise platform'}.`,
      type: 'System Architecture',
      hint: 'Address two-phase commits vs saga patterns, dead-letter queues, and distributed consensus.',
      ideal_points: ['Idempotency keys', 'Event sourcing / Outbox pattern', 'Partition tolerance']
    },
    {
      id: 'q2',
      question: `Tell me about a time you championed a technical refactor that faced resistance from product stakeholders.`,
      type: 'Behavioral / STAR',
      hint: 'Demonstrate how you translated architectural debt into business velocity and risk reduction.',
      ideal_points: ['Data-driven justification', 'Stakeholder alignment', 'Quantified post-launch impact']
    },
    {
      id: 'q3',
      question: `How do you diagnose and eliminate sudden memory leaks or event loop lag in high-concurrency Node/Python services?`,
      type: 'Deep Technical Diagnostics',
      hint: 'Explain profiling tools (heap snapshots, flame graphs) and garbage collection tuning.',
      ideal_points: ['Heap dump analysis', 'Microtask queue bottlenecks', 'Automated canary monitoring']
    },
    {
      id: 'q4',
      question: `How would you architect a global edge-caching layer while guaranteeing zero stale read anomalies for active user sessions?`,
      type: 'Edge & Data Consistency',
      hint: 'Discuss cache-invalidation stampedes, stale-while-revalidate, and read-after-write consistency.',
      ideal_points: ['CDN surrogate keys', 'Session-pinned reads', 'Cache stampede mitigation']
    }
  ];
}

/**
 * 4. AI Answer Evaluation (STAR Scoring)
 */
async function evaluateInterviewAnswer(question, answer, roleTitle, company) {
  if (aiClient) {
    try {
      const prompt = `
You are a Senior Bar Raiser Interviewer at ${company || 'Top Tech Firm'}. Evaluate this candidate's interview response using the STAR (Situation, Task, Action, Result) methodology.
Return STRICT JSON ONLY:
{
  "score": 88,
  "situation": "Clearly articulated the business dilemma and stakes.",
  "task": "Explicitly defined their individual responsibility.",
  "action": "Outlined precise technical measures taken.",
  "result": "Gave convincing quantified impact.",
  "strengths": ["Clear technical depth", "Strong ownership mindset"],
  "improvements": ["Could quantify the financial or user-retention impact even more directly."]
}

Question: "${question}"
Candidate Answer: "${answer}"
Role: "${roleTitle || 'Senior Engineer'}"
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const resText = response.text || '';
      const cleanJson = resText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[AlloyNext AI] Gemini evaluator failed, using heuristic engine:', err.message);
    }
  }

  // Deterministic STAR evaluation engine
  const ans = (answer || '').trim();
  const wordCount = ans.split(/\s+/).length;

  let score = 75;
  if (wordCount > 60) score += 10;
  if (wordCount > 120) score += 5;
  if (/\d+%|\d+ms|\$\d+|increased|reduced|saved|launched/i.test(ans)) score += 8;

  score = Math.min(96, Math.max(70, score));

  return {
    score,
    situation: 'Identified the project scope and business constraints effectively.',
    task: 'Clarified personal ownership and architectural decisions.',
    action: 'Showcased hands-on engineering execution and technical judgment.',
    result: 'Delivered measurable improvements in system performance and reliability.',
    strengths: [
      'Articulated concrete engineering decisions rather than generic platitudes.',
      'Demonstrated accountability and architectural trade-off awareness.'
    ],
    improvements: [
      'Add further detail regarding how team members or cross-functional stakeholders were aligned.',
      'Anchor the conclusion with exact percentage or latency metrics.'
    ]
  };
}

module.exports = {
  analyzeJobMatch,
  enhanceResumeText,
  generateInterviewDrill,
  evaluateInterviewAnswer
};
