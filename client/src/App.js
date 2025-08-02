import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, MessageSquare, Trash2, Filter, Bot, Send, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    description: '',
    category: 'General'
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['General', 'Bug Report', 'Feature Request', 'UI/UX', 'Performance'];
  const statuses = ['Open', 'In Progress', 'Resolved'];
  const filterOptions = ['All', ...statuses];

  // Load feedback on component mount
  useEffect(() => {
    loadFeedback();
  }, []);

  // Filter feedback when status filter changes
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredFeedback(feedback);
    } else {
      setFilteredFeedback(feedback.filter(f => f.status === statusFilter));
    }
  }, [feedback, statusFilter]);

  const loadFeedback = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedback`);
      setFeedback(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading feedback:', error);
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.title.trim() || !newFeedback.description.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/feedback`, newFeedback);
      setFeedback([response.data, ...feedback]);
      setNewFeedback({ title: '', description: '', category: 'General' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/feedback/${id}`, { status: newStatus });
      setFeedback(feedback.map(f => 
        f.id === id ? { ...f, status: newStatus } : f
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/feedback/${id}`);
      setFeedback(feedback.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Error deleting feedback. Please try again.');
    }
  };

  const handleAiQuestion = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/ask`, { question: aiQuestion });
      setAiResponse(response.data.answer);
    } catch (error) {
      console.error('Error getting AI response:', error);
      if (error.response?.status === 401) {
        setAiResponse('AI Assistant is not properly configured. Please check the OpenAI API key in your backend environment variables.');
      } else {
        setAiResponse('Sorry, I encountered an error. Please try again later.');
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Bug Report': return 'bg-red-50 border-red-200';
      case 'Feature Request': return 'bg-blue-50 border-blue-200';
      case 'UI/UX': return 'bg-purple-50 border-purple-200';
      case 'Performance': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Feedback Tracker</h1>
          <p className="text-gray-600">Manage user feedback with AI-powered insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-blue-600" />
                Submit New Feedback
              </h2>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newFeedback.title}
                    onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your feedback"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newFeedback.category}
                    onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newFeedback.description}
                    onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description of your feedback"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Submit Feedback
                </button>
              </form>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                {filterOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                      statusFilter === status 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  ({filteredFeedback.length} items)
                </span>
              </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No feedback found for the selected filter.</p>
                </div>
              ) : (
                filteredFeedback.map(item => (
                  <div key={item.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getCategoryColor(item.category)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <button
                        onClick={() => handleDeleteFeedback(item.id)}
                        className="text-red-600 hover:text-red-800 transition duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-gray-700 mb-4">{item.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${getStatusColor(item.status)}`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Bot className="mr-2 h-5 w-5 text-purple-600" />
                AI Assistant
              </h2>
              <form onSubmit={handleAiQuestion} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Ask about your feedback..."
                    disabled={isAiLoading}
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiQuestion.trim()}
                    className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAiLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </form>
              
              {aiResponse && (
                <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                  <h4 className="font-medium text-purple-900 mb-2">AI Response:</h4>
                  <p className="text-sm text-purple-800 whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                <p className="mb-2">Try asking:</p>
                <ul className="space-y-1">
                  <li>• "What are the main issues?"</li>
                  <li>• "How many bug reports?"</li>
                  <li>• "Suggest solutions"</li>
                  <li>• "What should we prioritize?"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;