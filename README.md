# Feedback Tracker with AI Assistant

A modern feedback management system with an integrated AI assistant to help analyze and respond to user feedback.

## Features

### Core Feedback Management
- ✅ Submit feedback with title, description, and category
- ✅ View all feedback in a clean, organized interface
- ✅ Filter feedback by status (Open, In Progress, Resolved)
- ✅ Update feedback status
- ✅ Delete feedback items
- ✅ Responsive design for mobile and desktop

### AI Assistant Integration
- 🤖 Ask questions about your feedback data
- 📊 Get insights and analysis of feedback trends
- 💡 Receive suggestions for handling specific feedback
- 🔍 Query feedback using natural language

## Tech Stack

**Frontend:**
- React 18 with functional components and hooks
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

**Backend:**
- Node.js with Express.js
- In-memory data storage (easily extensible to database)
- CORS enabled for cross-origin requests
- OpenAI API integration

**AI Integration:**
- OpenAI GPT-3.5-turbo for natural language processing
- Context-aware responses about feedback data

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup Instructions

### 1. Clone or Download the Project

Create a new directory and save all the provided files:
```
feedback-tracker/
├── README.md
├── package.json
├── server.js
├── client/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── index.css
```

### 2. Backend Setup

Navigate to the root directory:
```bash
cd feedback-tracker
npm install
```

Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

**Get your OpenAI API key:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd client
npm install
```

### 4. Running the Application

**Start the backend server** (from root directory):
```bash
npm start
```
The server will run on http://localhost:5000

**Start the frontend** (from client directory, in a new terminal):
```bash
cd client
npm start
```
The React app will run on http://localhost:3000

## Usage Guide

### Managing Feedback
1. **Add Feedback**: Use the form at the top to submit new feedback
2. **Filter Feedback**: Use the status filter buttons to view specific feedback types
3. **Update Status**: Click the status dropdown on any feedback item to change its status
4. **Delete Feedback**: Click the trash icon to remove feedback

### AI Assistant
1. **Ask Questions**: Use the AI Assistant section to ask questions about your feedback
2. **Example Queries**:
   - "What are the main issues users are reporting?"
   - "How many bug reports do we have?"
   - "Suggest solutions for the login problems"
   - "What feedback should we prioritize?"

## API Endpoints

### Feedback Management
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback status
- `DELETE /api/feedback/:id` - Delete feedback

### AI Assistant
- `POST /api/ai/ask` - Send question to AI assistant

## Configuration

### Environment Variables
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 5000)

### Customization
- **Categories**: Edit the categories array in `client/src/App.js`
- **Status Options**: Modify the status options in the same file
- **Styling**: Customize Tailwind classes throughout the components

## Project Structure

```
feedback-tracker/
├── server.js              # Express.js backend server
├── package.json           # Backend dependencies
├── .env                   # Environment variables (create this)
└── client/
    ├── public/
    │   └── index.html     # HTML template
    ├── src/
    │   ├── index.js       # React entry point
    │   ├── index.css      # Global styles and Tailwind
    │   └── App.js         # Main React component
    └── package.json       # Frontend dependencies
```

## Deployment

### Development
- Backend runs on port 5000
- Frontend runs on port 3000
- CORS is configured for local development

### Production
1. Build the React app: `cd client && npm run build`
2. Serve static files from Express
3. Set production environment variables
4. Deploy to your preferred hosting service

## Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure the backend is running on port 5000
- Check that CORS is properly configured in server.js

**AI Assistant Not Working:**
- Verify your OpenAI API key is correct
- Check that you have sufficient API credits
- Ensure the `.env` file is in the root directory

**Dependencies Issues:**
- Delete `node_modules` and run `npm install` again
- Ensure you're using compatible Node.js version

**Port Conflicts:**
- Change the PORT in `.env` if 5000 is in use
- Update the API base URL in the frontend if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Ensure all environment variables are set correctly

---

**Happy feedback tracking! 🚀**