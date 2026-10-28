import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from './api';

// 30 Days (1 Month) Session Inactivity Window
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

// Local persistent database helper for registered users
const getLocalUsersDB = () => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem('alloynext_users_db');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalUsersDB = (users) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('alloynext_users_db', JSON.stringify(users));
    } catch (e) {
      console.warn('Could not save to local users db:', e);
    }
  }
};

const initialApplications = [
  {
    id: 'app_1',
    company: 'Stripe',
    role: 'Senior Staff Distributed Systems Engineer',
    location: 'Remote • Global',
    locType: 'remote',
    type: 'Full-time',
    status: 'interview',
    appliedDate: 'Oct 24, 2026',
    stage: 'INTERVIEW',
    matchScore: 96,
    salary: '$220k - $275k',
    initial: 'S',
    color: '#4141c8',
  },
  {
    id: 'app_2',
    company: 'Datadog',
    role: 'Principal Platform Engineer',
    location: 'New York, NY',
    locType: 'sf',
    type: 'Full-time',
    status: 'assessment',
    appliedDate: 'Oct 22, 2026',
    stage: 'ASSESSMENT',
    matchScore: 93,
    salary: '$210k - $250k',
    initial: 'D',
    color: '#5c4bc3',
  },
  {
    id: 'app_3',
    company: 'OpenAI',
    role: 'Applied AI Systems Lead',
    location: 'San Francisco, CA',
    locType: 'sf',
    type: 'Full-time',
    status: 'applied',
    appliedDate: 'Oct 26, 2026',
    stage: 'APPLIED',
    matchScore: 95,
    salary: '$240k - $300k',
    initial: 'O',
    color: '#0f766e',
  },
  {
    id: 'app_4',
    company: 'Figma',
    role: 'Staff Web Performance Architect',
    location: 'San Francisco, CA',
    locType: 'sf',
    type: 'Full-time',
    status: 'offer',
    appliedDate: 'Oct 14, 2026',
    stage: 'OFFER',
    matchScore: 98,
    salary: '$230k - $270k',
    initial: 'F',
    color: '#e11d48',
  },
  {
    id: 'app_5',
    company: 'Linear',
    role: 'Senior Product Infrastructure Engineer',
    location: 'Remote • US/EU',
    locType: 'remote',
    type: 'Full-time',
    status: 'wishlist',
    appliedDate: 'Oct 27, 2026',
    stage: 'WISHLIST',
    matchScore: 91,
    salary: '$190k - $230k',
    initial: 'L',
    color: '#5b5ce2',
  },
];

const initialResume = {
  fullName: 'Hemankumar C',
  roleTitle: 'Data Analyst & AI Engineer',
  email: 'hemankumar.chandrasekar@gmail.com',
  phone: '+91 94449 69550',
  location: 'Chennai, India (Remote Available)',
  linkedin: 'linkedin.com/in/HemankumarC',
  github: 'github.com/HemankumarC',
  portfolio: 'hemankumar.dev',
  summary: 'Aspiring Data Analyst and AI Engineer with a strong foundation in SQL, Python, Power BI, Excel, and automated data visualization. Experienced in building automated recommendation logic, exploratory data analysis (EDA), and scalable reporting pipelines.',
  skills: ['SQL', 'Python', 'Power BI', 'Excel', 'Pandas', 'NumPy', 'Data Cleaning', 'MySQL', 'Seaborn', 'Matplotlib'],
  experience: [
    {
      company: 'Arjun Vision Tech Solutions',
      role: 'Data Science Intern',
      period: '2024',
      bullets: [
        'Applied data science methodologies to analyze and interpret multi-dimensional datasets.',
        'Extracted actionable insights through automated data cleaning, transformation, and statistical modeling in Python.'
      ]
    },
    {
      company: 'NSIC - Technical Services Centre',
      role: 'AI & ML Intern',
      period: '2024',
      bullets: [
        'Acquired practical experience deploying machine learning classifiers and predictive pipelines.',
        'Built automated data preparation workflows reducing manual data cleaning time by 40%.'
      ]
    }
  ],
  education: [
    {
      school: 'Tagore Engineering College',
      degree: 'B.Tech in Artificial Intelligence & Data Science',
      period: '2022 - 2026',
      details: 'CGPA: 7.9 • Core focus on distributed systems, data structures, and machine learning.'
    }
  ],
  projects: [
    {
      name: 'Career Guidance Analytics Platform',
      bullets: [
        'Collected and cleaned user skill and interest datasets using Python and SQL queries.',
        'Engineered custom recommendation algorithms matching candidate profiles to high-probability career trajectories.'
      ]
    },
    {
      name: 'AI-Driven Smart Tourism Analytics System',
      bullets: [
        'Analyzed high-volume travel trend datasets to surface destination popularity patterns.',
        'Constructed interactive Power BI dashboards communicating key behavioral insights.'
      ]
    }
  ],
  template: 'tech',
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [applications, setApplications] = useState(initialApplications);
  const [resumeData, setResumeData] = useState(initialResume);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Check existing session and verify 30-day (1 month) activity limit
  useEffect(() => {
    const checkSession = async () => {
      if (typeof window === 'undefined' || !window.localStorage) {
        setIsLoadingAuth(false);
        return;
      }

      const lastLoginStr = window.localStorage.getItem('alloynext_last_active');
      const token = getAuthToken();
      const savedUserRaw = window.localStorage.getItem('alloynext_user');

      if (lastLoginStr && (token || savedUserRaw)) {
        const lastActiveTime = parseInt(lastLoginStr, 10);
        const now = Date.now();
        const diffMs = now - lastActiveTime;

        // Check if inactive for > 1 month (30 days)
        if (!isNaN(lastActiveTime) && diffMs > ONE_MONTH_MS) {
          // Inactive for more than 1 month: Require login with email & password
          setAuthToken(null);
          setCurrentUser(null);
          window.localStorage.removeItem('alloynext_user');
          window.localStorage.removeItem('alloynext_last_active');
          setSessionExpiredNotice(
            'Your session expired after 1 month of inactivity. Please sign in with your registered email and password.'
          );
          setIsLoadingAuth(false);
          return;
        }

        // Within 1 month: refresh last active timestamp
        window.localStorage.setItem('alloynext_last_active', Date.now().toString());

        // Try restoring user via API or saved local profile
        if (token) {
          try {
            const user = await api.getMe();
            setCurrentUser(user);
            window.localStorage.setItem('alloynext_user', JSON.stringify(user));
            await loadUserData();
          } catch {
            // API offline or token invalid - check saved user
            if (savedUserRaw) {
              try {
                const user = JSON.parse(savedUserRaw);
                setCurrentUser(user);
              } catch {
                setAuthToken(null);
                setCurrentUser(null);
              }
            } else {
              setAuthToken(null);
              setCurrentUser(null);
            }
          }
        } else if (savedUserRaw) {
          try {
            const user = JSON.parse(savedUserRaw);
            setCurrentUser(user);
          } catch {
            setCurrentUser(null);
          }
        }
      }

      setIsLoadingAuth(false);
    };

    checkSession();
  }, []);

  const loadUserData = async () => {
    try {
      const apps = await api.getApplications();
      if (Array.isArray(apps) && apps.length > 0) {
        setApplications(
          apps.map((a) => ({
            id: a.id,
            company: a.company_name,
            role: a.role_title,
            location: a.location,
            locType: (a.location || '').toLowerCase().includes('sf') ? 'sf' : 'remote',
            type: a.job_type,
            status: a.current_stage,
            appliedDate: new Date(a.applied_at || a.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            stage: a.current_stage.toUpperCase(),
            matchScore: a.match_score || 85,
            salary: a.salary_range || '$130k - $160k',
            initial: (a.company_name || 'A').charAt(0).toUpperCase(),
            color: '#4141c8',
          }))
        );
      }

      const resumes = await api.getResumes();
      if (Array.isArray(resumes) && resumes.length > 0) {
        const prim = resumes.find((r) => r.is_primary) || resumes[0];
        setResumeData({
          id: prim.id,
          fullName: prim.full_name || prim.title,
          roleTitle: prim.role_title || '',
          email: prim.email || '',
          phone: prim.phone || '',
          location: prim.location || '',
          linkedin: prim.linkedin || '',
          github: prim.github || '',
          portfolio: prim.portfolio || '',
          summary: prim.summary || '',
          skills: prim.skills || [],
          template: 'tech',
        });
      }
    } catch {
      // Local state preserved
    }
  };

  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    setSessionExpiredNotice(null);

    let loggedUser = null;

    // 1. Try real backend API
    try {
      const data = await api.login(cleanEmail, password);
      setAuthToken(data.access_token);
      loggedUser = await api.getMe();
    } catch (apiErr) {
      // 2. Fallback to local accounts database if backend is offline
      const localUsers = getLocalUsersDB();
      const match = localUsers.find((u) => u.email === cleanEmail);

      if (!match) {
        // If API returned a specific message, surface it
        if (apiErr.message && !apiErr.message.includes('fetch') && !apiErr.message.includes('Failed')) {
          throw new Error(apiErr.message);
        }
        throw new Error('No account found with this email. Please create a new account.');
      }

      if (match.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials or reset password.');
      }

      loggedUser = {
        id: match.id,
        email: match.email,
        full_name: match.full_name,
        created_at: match.created_at,
      };
      setAuthToken('local_jwt_' + match.id);
    }

    if (loggedUser) {
      setCurrentUser(loggedUser);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('alloynext_user', JSON.stringify(loggedUser));
        window.localStorage.setItem('alloynext_last_active', Date.now().toString());
      }
      await loadUserData();
      showToast(`Welcome back, ${loggedUser.full_name || 'Executive'}!`);
      setIsAuthModalOpen(false);
      return loggedUser;
    }
  };

  const register = async (email, password, fullName) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim();
    setSessionExpiredNotice(null);

    let newUser = null;

    // Check if account already exists in local DB
    const localUsers = getLocalUsersDB();
    const existing = localUsers.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    // 1. Try real backend API
    try {
      const data = await api.register(cleanEmail, password, cleanName);
      setAuthToken(data.access_token);
      newUser = await api.getMe();
    } catch (apiErr) {
      // If API rejected with duplicate error, throw it
      if (apiErr.message && apiErr.message.includes('already exists')) {
        throw apiErr;
      }
      // If server is offline, create registered user record locally
      newUser = {
        id: 'usr_' + Date.now().toString(36),
        email: cleanEmail,
        full_name: cleanName,
        created_at: new Date().toISOString(),
      };
      setAuthToken('local_jwt_' + newUser.id);
    }

    // Save account in local database
    const updatedUsers = [
      ...localUsers,
      {
        id: newUser.id,
        email: cleanEmail,
        password: password,
        full_name: cleanName,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      },
    ];
    saveLocalUsersDB(updatedUsers);

    // Save active session & 30-day timestamp
    setCurrentUser(newUser);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('alloynext_user', JSON.stringify(newUser));
      window.localStorage.setItem('alloynext_last_active', Date.now().toString());
    }

    showToast(`Account registered successfully. Welcome, ${cleanName}!`);
    setIsAuthModalOpen(false);
    return newUser;
  };

  const requestPasswordReset = async (email) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await api.forgotPassword(cleanEmail);
      return res;
    } catch {
      // Local fallback
      const localUsers = getLocalUsersDB();
      const match = localUsers.find((u) => u.email === cleanEmail);
      if (!match) {
        throw new Error('No registered account found with this email address.');
      }
      const demoCode = '849201';
      return {
        message: `Verification code sent to ${cleanEmail}. (Code: ${demoCode})`,
        code_preview: demoCode,
        email: cleanEmail,
      };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await api.resetPassword(cleanEmail, code, newPassword);
      // Also sync local users DB
      const localUsers = getLocalUsersDB();
      const updated = localUsers.map((u) => (u.email === cleanEmail ? { ...u, password: newPassword } : u));
      saveLocalUsersDB(updated);
      return res;
    } catch (apiErr) {
      // Local fallback
      const localUsers = getLocalUsersDB();
      const matchIndex = localUsers.findIndex((u) => u.email === cleanEmail);
      if (matchIndex === -1) {
        throw new Error('User account not found.');
      }
      if (code.trim() !== '849201' && code.trim().length < 4) {
        throw new Error('Invalid verification code.');
      }
      localUsers[matchIndex].password = newPassword;
      saveLocalUsersDB(localUsers);
      return {
        message: 'Password reset successfully. You can now log in with your new password.',
        status: 'success',
      };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('alloynext_token');
      window.localStorage.removeItem('alloynext_user');
      window.localStorage.removeItem('alloynext_last_active');
    }
    showToast('Signed out of executive session.');
  };

  const addApplication = async (newApp) => {
    const localApp = {
      id: Date.now().toString(),
      company: newApp.company,
      role: newApp.role,
      location: newApp.location || 'Remote',
      locType: (newApp.location || '').toLowerCase().includes('sf') ? 'sf' : 'remote',
      type: newApp.type || 'Full-time',
      status: newApp.status || 'applied',
      appliedDate: 'Just now',
      stage: 'Initial Review',
      matchScore: 90,
      salary: '$130k - $160k',
      initial: (newApp.company || 'A').charAt(0).toUpperCase(),
      color: '#4141c8',
    };

    setApplications([localApp, ...applications]);
    showToast(`Added application for ${newApp.company}!`);

    if (currentUser) {
      try {
        await api.createApplication({
          company_name: newApp.company,
          role_title: newApp.role,
          location: newApp.location,
          current_stage: newApp.status,
          notes: newApp.jobDescription,
        });
      } catch (err) {
        console.warn('Backend sync failed, saved locally:', err.message);
      }
    }
  };

  const updateResumeField = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        applications,
        searchQuery,
        setSearchQuery,
        addApplication,
        resumeData,
        setResumeData,
        updateResumeField,
        isAddModalOpen,
        setIsAddModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toastMessage,
        showToast,
        currentUser,
        login,
        register,
        logout,
        isLoadingAuth,
        sessionExpiredNotice,
        setSessionExpiredNotice,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
