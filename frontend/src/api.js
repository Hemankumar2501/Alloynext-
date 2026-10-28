// AlloyNext Production API Client
const API_BASE_URL = typeof window !== 'undefined' && window.__API_URL__
  ? window.__API_URL__
  : 'http://127.0.0.1:5000/api';

let authToken = typeof window !== 'undefined' && window.localStorage
  ? window.localStorage.getItem('alloynext_token')
  : null;

export const setAuthToken = (token) => {
  authToken = token;
  if (typeof window !== 'undefined' && window.localStorage) {
    if (token) {
      window.localStorage.setItem('alloynext_token', token);
    } else {
      window.localStorage.removeItem('alloynext_token');
    }
  }
};

export const getAuthToken = () => authToken;

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.detail || `API request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    // If backend isn't reachable (e.g. offline dev server), throw clear informative error
    console.warn(`[AlloyNext API] ${options.method || 'GET'} ${endpoint} error:`, err.message);
    throw err;
  }
};

export const api = {
  // Auth
  register: (email, password, fullName) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email, code, newPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, new_password: newPassword }),
    }),

  getMe: () => request('/auth/me'),

  // Applications
  getApplications: (stage, search) => {
    const params = new URLSearchParams();
    if (stage && stage !== 'all') params.append('stage', stage);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/applications${qs}`);
  },

  createApplication: (appData) =>
    request('/applications', {
      method: 'POST',
      body: JSON.stringify(appData),
    }),

  updateApplication: (appId, appData) =>
    request(`/applications/${appId}`, {
      method: 'PUT',
      body: JSON.stringify(appData),
    }),

  deleteApplication: (appId) =>
    request(`/applications/${appId}`, {
      method: 'DELETE',
    }),

  getMetricsSummary: () => request('/applications/metrics/summary'),

  // Resumes
  getResumes: () => request('/resumes'),

  createResume: (resumeData) =>
    request('/resumes', {
      method: 'POST',
      body: JSON.stringify(resumeData),
    }),

  updateResume: (resumeId, resumeData) =>
    request(`/resumes/${resumeId}`, {
      method: 'PUT',
      body: JSON.stringify(resumeData),
    }),

  setPrimaryResume: (resumeId) =>
    request(`/resumes/${resumeId}/primary`, {
      method: 'POST',
    }),

  // ATS Analysis
  analyzeJobFit: (targetRole, company, jobDescription, resumeId, resumeText) =>
    request('/analysis', {
      method: 'POST',
      body: JSON.stringify({
        target_role: targetRole,
        company,
        job_description: jobDescription,
        resume_id: resumeId,
        resume_text: resumeText,
      }),
    }),

  // Interview Prep
  generateInterviewQuestions: (company, role, jobDescription) =>
    request('/interview/generate', {
      method: 'POST',
      body: JSON.stringify({
        target_company: company,
        role_title: role,
        job_description: jobDescription,
      }),
    }),

  saveInterviewSession: (company, role, questions, starNotes) =>
    request('/interview/sessions', {
      method: 'POST',
      body: JSON.stringify({
        target_company: company,
        role_title: role,
        questions,
        star_notes: starNotes,
      }),
    }),
};
