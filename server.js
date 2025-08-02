
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.FRONTEND_URL 
//     : 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

// // In-memory storage for feedback (replace with database in production)
// let feedback = [
//   {
//     id: 1,
//     title: "Login Issue",
//     description: "Having trouble logging into the application. The password reset doesn't work.",
//     category: "Bug Report",
//     status: "Open",
//     createdAt: new Date().toISOString()
//   },
//   {
//     id: 2,
//     title: "Add Dark Mode",
//     description: "Would love to see a dark mode option for better usability during night hours.",
//     category: "Feature Request",
//     status: "In Progress",
//     createdAt: new Date().toISOString()
//   },
//   {
//     id: 3,
//     title: "Great User Experience",
//     description: "The new interface is intuitive and easy to navigate. Keep up the good work!",
//     category: "General",
//     status: "Resolved",
//     createdAt: new Date().toISOString()
//   }
// ];

// let feedbackIdCounter = 4;

// // Routes

// // Get all feedback
// app.get('/api/feedback', (req, res) => {
//   res.json(feedback);
// });

// // Create new feedback
// app.post('/api/feedback', (req, res) => {
//   const { title, description, category } = req.body;
  
//   if (!title || !description) {
//     return res.status(400).json({ error: 'Title and description are required' });
//   }

//   const newFeedback = {
//     id: feedbackIdCounter++,
//     title,
//     description,
//     category: category || 'General',
//     status: 'Open',
//     createdAt: new Date().toISOString()
//   };

//   feedback.push(newFeedback);
//   res.status(201).json(newFeedback);
// });

// // Update feedback status
// app.put('/api/feedback/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { status } = req.body;
  
//   const feedbackItem = feedback.find(f => f.id === id);
  
//   if (!feedbackItem) {
//     return res.status(404).json({ error: 'Feedback not found' });
//   }
  
//   feedbackItem.status = status;
//   res.json(feedbackItem);
// });

// // Delete feedback
// app.delete('/api/feedback/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = feedback.findIndex(f => f.id === id);
  
//   if (index === -1) {
//     return res.status(404).json({ error: 'Feedback not found' });
//   }
  
//   feedback.splice(index, 1);
//   res.json({ message: 'Feedback deleted successfully' });
// });

// // AI Assistant endpoint
// app.post('/api/ai/ask', async (req, res) => {
//   const { question } = req.body;
  
//   if (!question || typeof question !== 'string' || question.trim().length === 0) {
//     return res.status(400).json({ error: 'Question is required and must be a non-empty string' });
//   }

//   if (!process.env.GEMINI_API_KEY) {
//     return res.status(500).json({ error: 'Gemini API key not configured.' });
//   }

//   try {
//   // Prepare context about current feedback
//   const feedbackContext = feedback.map(f => 
//     `ID: ${f.id}, Title: "${f.title}", Description: "${f.description}", Category: ${f.category}, Status: ${f.status}`
//   ).join('\n');

//   const systemPrompt = `You are an AI assistant helping analyze user feedback for a software application.

// Current feedback data:
// ${feedbackContext}

// Please answer questions about this feedback data, provide insights, suggest solutions, or help prioritize issues. Be helpful, concise, and actionable in your responses.`;

//   const requestConfig = {
//     method: 'POST',
//     url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     params: {
//       key: process.env.GEMINI_API_KEY // Your Gemini key from Google AI Studio
//     },
//     data: {
//       contents: [
//         {
//           parts: [
//             { text: systemPrompt + '\n\nUser question: ' + question.trim() }
//           ]
//         }
//       ]
//     },
//     timeout: 30000
//   };

//     const response = await axios(requestConfig);
//     const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
//     res.json({ answer: aiResponse });

//   } catch (error) {
//     console.error('GEMINI API Error:', {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data
//     });
    
//     if (error.response?.status === 401) {
//       res.status(401).json({ error: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.' });
//     } else if (error.response?.status === 429) {
//       res.status(429).json({ error: 'OpenAI API rate limit exceeded. Please try again later.' });
//     } else if (error.response?.status === 400) {
//       res.status(400).json({ error: 'Invalid request to OpenAI API. Please try rephrasing your question.' });
//     } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
//       res.status(408).json({ error: 'Request timeout. Please try again.' });
//     } else {
//       res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
//     }
//   }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'healthy', 
//     timestamp: new Date().toISOString(),
//     feedbackCount: feedback.length 
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📝 Feedback API available at http://localhost:${PORT}/api/feedback`);
//   console.log(`🤖 AI Assistant available at http://localhost:${PORT}/api/ai/ask`);
  
//   if (!process.env.GEMINI_API_KEY) {
//     console.log('⚠️  Warning: GEMINI_API_KEY not found. AI features will not work.');
//     console.log('   Please add your GEMINI API key to the .env file');
//   }
// });

// module.exports = app;

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-memory storage for feedback (replace with database in production)
let feedback = [
  {
    id: 1,
    title: "Login Issue",
    description: "Having trouble logging into the application. The password reset doesn't work.",
    category: "Bug Report",
    status: "Open",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Add Dark Mode",
    description: "Would love to see a dark mode option for better usability during night hours.",
    category: "Feature Request",
    status: "In Progress",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Great User Experience",
    description: "The new interface is intuitive and easy to navigate. Keep up the good work!",
    category: "General",
    status: "Resolved",
    createdAt: new Date().toISOString()
  }
];

let feedbackIdCounter = 4;

// Routes

// Get all feedback
app.get('/api/feedback', (req, res) => {
  res.json(feedback);
});

// Create new feedback
app.post('/api/feedback', (req, res) => {
  const { title, description, category } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newFeedback = {
    id: feedbackIdCounter++,
    title,
    description,
    category: category || 'General',
    status: 'Open',
    createdAt: new Date().toISOString()
  };

  feedback.push(newFeedback);
  res.status(201).json(newFeedback);
});

// Update feedback status
app.put('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  const feedbackItem = feedback.find(f => f.id === id);
  
  if (!feedbackItem) {
    return res.status(404).json({ error: 'Feedback not found' });
  }
  
  feedbackItem.status = status;
  res.json(feedbackItem);
});

// Delete feedback
app.delete('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = feedback.findIndex(f => f.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Feedback not found' });
  }
  
  feedback.splice(index, 1);
  res.json({ message: 'Feedback deleted successfully' });
});

// AI Assistant endpoint (using Groq API)
app.post('/api/ai/ask', async (req, res) => {
  const { question } = req.body;
  
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'Question is required and must be a non-empty string' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured.' });
  }

  try {
    // Prepare context about current feedback
    const feedbackContext = feedback.map(f => 
      `ID: ${f.id}, Title: "${f.title}", Description: "${f.description}", Category: ${f.category}, Status: ${f.status}`
    ).join('\n');

    const systemPrompt = `You are an AI assistant helping analyze user feedback for a software application.

Current feedback data:
${feedbackContext}

Please answer questions about this feedback data, provide insights, suggest solutions, or help prioritize issues. Be helpful, concise, and actionable in your responses.`;

    const requestConfig = {
      method: 'POST',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      data: {
        model: 'llama3-70b-8192', // or 'llama2-70b-4096' depending on your preference
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question.trim()
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      timeout: 30000
    };

    const response = await axios(requestConfig);
    const aiResponse = response.data.choices?.[0]?.message?.content || 'No response from Groq API.';
    res.json({ answer: aiResponse });

  } catch (error) {
    console.error('GROQ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid Groq API key. Please check your GROQ_API_KEY environment variable.' });
    } else if (error.response?.status === 429) {
      res.status(429).json({ error: 'Groq API rate limit exceeded. Please try again later.' });
    } else if (error.response?.status === 400) {
      res.status(400).json({ error: 'Invalid request to Groq API. Please try rephrasing your question.' });
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      res.status(408).json({ error: 'Request timeout. Please try again.' });
    } else {
      res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    feedbackCount: feedback.length 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Feedback API available at http://localhost:${PORT}/api/feedback`);
  console.log(`🤖 AI Assistant available at http://localhost:${PORT}/api/ai/ask`);
  
  if (!process.env.GROQ_API_KEY) {
    console.log('⚠️  Warning: GROQ_API_KEY not found. AI features will not work.');
    console.log('   Please add your Groq API key to the .env file');
  }
});

module.exports = app;