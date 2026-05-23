import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { scholarships } from './src/scholarshipsData.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Lazy-loaded GenAI helper
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// 1. Core Metadata & List API
// ----------------------------------------------------
app.get('/api/scholarships', (req, res) => {
  res.json({ scholarships });
});

// ----------------------------------------------------
// 1.5. Local Manual bKash Transaction Submissions Database Setup
// ----------------------------------------------------
const SUBMISSIONS_FILE = path.join(process.cwd(), 'manual_submissions.json');

interface ManualSubmission {
  trxId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userIp: string; // Dynamic IP Capture for unauthenticated / authenticated visitors
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt: number | null;
}

// Helper: Securely retrieve remote client IP Address
function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    } else if (Array.isArray(forwarded)) {
      return forwarded[0].trim();
    }
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

// Ensure the local storage file exists
function readSubmissions(): ManualSubmission[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[Manual Submissions DB] Error reading file:', err);
  }
  return [];
}

function writeSubmissions(subs: ManualSubmission[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(subs, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Manual Submissions DB] Error writing file:', err);
  }
}

// ----------------------------------------------------
// 1.6. Manual bKash Payment API Endpoints
// ----------------------------------------------------

// Get Admin and Payment info
app.get('/api/payment/config', (req, res) => {
  const adminPhone = process.env.BKASH_PERSONAL_NUMBER || '+8801922378319';
  const entryFee = Number(process.env.BKASH_ENTRY_FEE || '100');
  res.json({
    adminPhone,
    entryFee,
    currency: 'BDT',
    instructions: `Send exactly ${entryFee} BDT Send Money (MFS) to ${adminPhone} and enter your 10-character Transaction ID (TrxID) below. The admin will verify your payment and grant access manually.`
  });
});

// Submit a Transaction ID for manual verification
app.post('/api/payment/submit-manual', (req, res) => {
  const { trxId, userId, userEmail, userName } = req.body;
  const userIp = getClientIp(req);

  if (!trxId) {
    return res.status(400).json({ success: false, error: 'Transaction ID is required.' });
  }

  const normalizedTrx = String(trxId).trim().toUpperCase();

  // Basic validation: 10 alphanumeric chars
  if (normalizedTrx.length !== 10) {
    return res.status(400).json({
      success: false,
      error: 'Invalid format! bKash Transaction ID must be exactly 10 alphanumeric characters.'
    });
  }

  const subs = readSubmissions();
  const existingSub = subs.find(s => s.trxId === normalizedTrx);

  if (existingSub) {
    if (existingSub.status === 'approved') {
      return res.json({
        success: true,
        alreadyApproved: true,
        message: 'This Transaction ID has already been manually verified and approved! Access is unlocked.'
      });
    } else {
      return res.json({
        success: true,
        alreadyPending: true,
        message: 'This Transaction ID is already submitted and is currently pending manual verification by our admin.'
      });
    }
  }

  // Create new submission with IP tracking
  const newSub: ManualSubmission = {
    trxId: normalizedTrx,
    userId: userId || 'anonymous_guest',
    userEmail: userEmail || 'guest@scholarbd.com',
    userName: userName || 'Anonymous Candidate',
    userIp,
    createdAt: Date.now(),
    status: 'pending',
    approvedAt: null
  };

  subs.push(newSub);
  writeSubmissions(subs);

  console.log(`[Manual Submit] New bKash TrxID submitted: ${normalizedTrx} from IP: ${userIp} by ${userEmail || 'guest'}`);

  return res.json({
    success: true,
    message: 'bKash Transaction ID submitted successfully! The admin will verify your payment and grant access shortly.'
  });
});

// Fetch all submissions (Secure check: Admin only via email validation check)
app.get('/api/payment/submissions', (req, res) => {
  const adminEmail = req.headers['x-admin-email'];
  if (adminEmail !== 'arafibntoihid@gmail.com') {
    return res.status(403).json({ success: false, error: 'Unauthorized. Admin credentials required.' });
  }

  res.json({
    success: true,
    submissions: readSubmissions()
  });
});

// Approve a transaction manually
app.post('/api/payment/approve', (req, res) => {
  const adminEmail = req.headers['x-admin-email'];
  if (adminEmail !== 'arafibntoihid@gmail.com') {
    return res.status(403).json({ success: false, error: 'Unauthorized. Admin credentials required.' });
  }

  const { trxId } = req.body;
  if (!trxId) {
    return res.status(400).json({ success: false, error: 'Transaction ID is required.' });
  }

  const normalizedTrx = String(trxId).trim().toUpperCase();
  const subs = readSubmissions();
  const match = subs.find(s => s.trxId === normalizedTrx);

  if (!match) {
    return res.status(404).json({ success: false, error: 'Transaction ID not found.' });
  }

  match.status = 'approved';
  match.approvedAt = Date.now();
  writeSubmissions(subs);

  console.log(`[Manual Approve] Admin approved bKash TrxID: ${normalizedTrx} for IP: ${match.userIp}, Email: ${match.userEmail}`);

  res.json({
    success: true,
    message: `bKash TrxID ${normalizedTrx} approved successfully! User is now unlocked.`
  });
});

// Reject a transaction manually
app.post('/api/payment/reject', (req, res) => {
  const adminEmail = req.headers['x-admin-email'];
  if (adminEmail !== 'arafibntoihid@gmail.com') {
    return res.status(403).json({ success: false, error: 'Unauthorized. Admin credentials required.' });
  }

  const { trxId } = req.body;
  if (!trxId) {
    return res.status(400).json({ success: false, error: 'Transaction ID is required.' });
  }

  const normalizedTrx = String(trxId).trim().toUpperCase();
  const subs = readSubmissions();
  const match = subs.find(s => s.trxId === normalizedTrx);

  if (!match) {
    return res.status(404).json({ success: false, error: 'Transaction ID not found.' });
  }

  match.status = 'rejected';
  match.approvedAt = null;
  writeSubmissions(subs);

  console.log(`[Manual Reject] Admin rejected bKash TrxID: ${normalizedTrx}`);

  res.json({
    success: true,
    message: `bKash TrxID ${normalizedTrx} rejected.`
  });
});

// Get user's active manual approval status (handles IP-based lifetime access validation)
app.get('/api/payment/status', (req, res) => {
  const { userId, trxId } = req.query;
  const clientIp = getClientIp(req);
  const subs = readSubmissions();

  // 1. If check by specific TrxID
  if (trxId) {
    const match = subs.find(s => s.trxId === String(trxId).trim().toUpperCase());
    if (match) {
      return res.json({
        success: true,
        status: match.status,
        hasApprovedAccess: match.status === 'approved',
        clientIp
      });
    }
  }

  // 2. Check if current client IP address has ANY approved subscription records (IP Lock Bypass)
  const isIpApproved = subs.some(s => s.userIp === clientIp && s.status === 'approved');
  if (isIpApproved) {
    return res.json({
      success: true,
      status: 'approved',
      hasApprovedAccess: true,
      clientIp,
      origin: 'IP Address'
    });
  }

  // 3. Otherwise, check if user has ANY approved transaction under authenticated profile
  if (userId) {
    const hasApproved = subs.some(s => s.userId === userId && s.status === 'approved');
    return res.json({
      success: true,
      hasApprovedAccess: hasApproved,
      clientIp,
      origin: 'User Account'
    });
  }

  // Fallback default
  return res.json({
    success: true,
    hasApprovedAccess: false,
    clientIp
  });
});

// ----------------------------------------------------
// 2. Profile Analyser Endpoints (Uses Gemini)
// ----------------------------------------------------
app.post('/api/gemini/profile-analyze', async (req, res) => {
  const { profile, scholarship } = req.body;

  if (!profile || !scholarship) {
    return res.status(400).json({ error: 'Missing profile or scholarship data' });
  }

  const ai = getGenAI();
  if (!ai) {
    // Return structured offline fallback if GEMINI_API_KEY is not defined yet
    return res.json({
      isDemoMode: true,
      analysis: `### ℹ️ Demonstration Mode Active
We calculated your eligibility mathematically using local criteria. 

**Academic Eligibility:**
- Your CGPA is **${profile.currentCGPA}/4.0** (Required: **${scholarship.cgpaRequirement || 'None'}**).
- Your IELTS score is **${profile.ieltsScore}** (Required: **${scholarship.ieltsRequirement || 'None'}**).
- Your work experience is **${profile.workExperienceYears} years** (Required for ${scholarship.title}: **${scholarship.id === 'chevening' || scholarship.id === 'daad-epos' ? '2 years' : 'None'}**).

**Verdict:** 
${profile.currentCGPA >= (scholarship.cgpaRequirement || 0) && profile.ieltsScore >= (scholarship.ieltsRequirement || 0) 
  ? '✅ You meet the primary criteria! We recommend finalizing your SOP.' 
  : '⚠️ You have minor gaps below. Please check the requirements.'}

*To unlock fully customized, AI-driven strategic guidance, statement of purpose outlines, and personalized visa route tips, please attach your **GEMINI_API_KEY** via the **Secrets** panel in the AI Studio Settings menu.*`
    });
  }

  const prompt = `
You are an expert international scholarship strategy consultant specializing in Bangladeshi student placements.
Evaluate the following student's profile against the criteria of the "${scholarship.title}" (${scholarship.country}).

STUDENT PROFILE:
- Degree Level Targeted: ${profile.degreeLevel}
- Current CGPA: ${profile.currentCGPA} (out of 4.0)
- IELTS / Language Score: ${profile.ieltsScore} ${profile.hasMoi ? '(Has Medium of Instruction Certificate)' : ''}
- Professional Work Experience: ${profile.workExperienceYears} Years
- Field of Interest / Academic Major: ${profile.fieldOfStudy}

SCHOLARSHIP CRITERIA SUMMARY:
- Title: ${scholarship.title}
- Host Country: ${scholarship.country}
- Base CGPA Requirement: ${scholarship.cgpaRequirement}
- Base IELTS Requirement: ${scholarship.ieltsRequirement}
- Official Eligibility Details: ${JSON.stringify(scholarship.eligibilityDetails)}
- Actionable tips for Bangladeshi citizens: ${JSON.stringify(scholarship.tipsForBangladeshis)}

YOUR TASK:
Provide a comprehensive, encouraging, and highly technical analysis of their fit. Format the response as rich Markdown.
Include the following exact headings:
1. ### match-verdict (Brief percentage score and overall high-level evaluation)
2. ### academic-and-ielts-fit (Evaluation of CGPA, IELTS, and how they stack up. Mention if MOI is accepted)
3. ### strength-analysis (Key areas where this student shines)
4. ### gap-analysis (Gaps to address or items they must prepare like passport, translations)
5. ### action-plan-checklist (An actionable 5-step numbered plan specific to Bangladesh context, e.g., sitting for GRE, asking professors, translating Board certificates).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are "ScholarsBot Bangladesh", a professional academic consultant helping students win overseas fully-funded scholars. Be precise, highly structured, and encouraging.',
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Error calling Gemini Profile Analyzer:', error);
    res.status(500).json({ error: error.message || 'Error occurred during AI analysis' });
  }
});

// ----------------------------------------------------
// 3. Advisor Chat Endpoint (With context)
// ----------------------------------------------------
app.post('/api/gemini/advisor', async (req, res) => {
  const { messages, selectedScholarship, userProfile } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required and must be an array' });
  }

  const ai = getGenAI();
  if (!ai) {
    // Return friendly local answer explaining how to configure Gemini API Key
    const lastMsg = messages[messages.length - 1];
    return res.json({
      isDemoMode: true,
      sender: 'assistant',
      text: `Hello! I am **ScholarsBot Bangladesh**, your AI advisor. 

It looks like the **GEMINI_API_KEY** is not configured yet. No worries! I can help you with static information, but the full AI features (such as SOP draft reviews, personalized motivation letters, and advanced university course mapping) are currently in preview.

**To unlock full conversational AI capabilities:**
1. Open the **Settings > Secrets** panel in the bottom-left/top-right of your AI Studio workspace.
2. Add a new secret called \`GEMINI_API_KEY\` with your Gemini API key.
3. The application will immediately utilize the key server-side.

**In the meantime, here's some quick info about Bangladeshi scholarships:**
- **Chevening & DAAD** absolutely require **2 years of work experience** after graduation.
- **Erasmus Mundus** is the most popular, requiring no work experience and letting you study in 3 countries.
- **Stipendium Hungaricum** requires physical paper/portal nomination by the Ministry of Education in Bangladesh (usually via sub-portals on shed.gov.bd).

What particular scholarship country or program interests you? Ask me and I'll do my best to guide you!`
    });
  }

  // Build the message history for Gemini API
  // Translate the history to a friendly system-prompt text or multi-turn request
  const systemInstruction = `
You are "ScholarsBot BD", a comprehensive scholarly consultant for Bangladeshi students looking to study abroad under fully funded schemes (Chevening, Commonwealth, DAAD, MEXT, Erasmus, Stipendium Hungaricum, Fulbright, Turkiye Burslari).
You write in a supportive, deeply strategic, professional tone. 

CONTEXT INFO:
- Current date/year: 2026.
- All listed scholarships (Commonwealth, Chevening, MEXT, DAAD) have specific annual cycles which normally open between May and October for the following academic year.
- Keep in mind Bangladeshi academic realities:
  * GPA conversions (HSC/SSC out of 5.0 vs Bachelors out of 4.0).
  * Educational boards (Dhaka, Comilla, Chittagong, etc.) require English translation and attestation from the Ministry of Foreign Affairs, Dhaka (Segunbagicha).
  * Medium of Instruction (MOI) is sometimes accepted by German or Hungarian universities but IELTS 6.5 is the safest target.
  * Work experience can often include TA-ships, part-time lecturing, or social/NGO volunteer projects, which is huge for Chevening.

Current User Profile details: ${userProfile ? JSON.stringify(userProfile) : 'None provided yet'}.
Specifically Selected Scholarship in view: ${selectedScholarship ? JSON.stringify(selectedScholarship) : 'None selected yet'}.

Your purpose is to give stellar guidance, outline Statement of Purposes (SOP), answer eligibility queries, explain documents needed (e.g., Police Clearance Certificate, MOFA attestation, Recommendation letter templates), and design winning structures.
Keep answers formatted in beautiful, spacing-friendly Markdown.
`;

  // Create formatted conversation
  // The list of messages should convert to a sequential chat prompt or we can pass them in contents
  // Let's combine them into a clean chat structure
  const chatHistory = messages.map((m: any) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatHistory,
      config: {
        systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error inside Gemini chat advisor:', error);
    res.status(500).json({ error: error.message || 'Error occurred during AI chat' });
  }
});

// ----------------------------------------------------
// 4. Vite Dev Middleware & SPA Static Hosting
// ----------------------------------------------------
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only bind port listener if not running in a Serverless environment (like Vercel)
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Live and running on http://0.0.0.0:${PORT}`);
    });
  } else {
    console.log('[Server] Vercel Serverless Function context detected. Skipping manual app.listen port binding.');
  }
}

// Boot the server locally or in container mode
startServer();

// Export express app handler for Vercel Serverless routing compatibility
export default app;
