import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope, Send, CheckCircle, Clock, MessageSquare, ArrowRight, User } from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const chatEndRef = useRef(null);

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  // Helper to load beautiful medical headshots instead of broken seed filenames
  const getDoctorImg = (profileImg) => {
    if (profileImg?.startsWith('http')) return profileImg;
    if (profileImg?.includes('doctor1')) return "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80";
    if (profileImg?.includes('doctor2')) return "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=256&q=80";
    if (profileImg?.includes('admin')) return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80";
    return "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80";
  };

  // Fetch doctor list
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await axios.get('https://neuracarebackend.onrender.com/api/doctors');
        // Filter out admins from the doctor list
        const filteredDoctors = res.data.filter(doc => doc.role === 'doctor');
        setDoctors(filteredDoctors);
        if (filteredDoctors.length > 0) {
          setSelectedDoctor(filteredDoctors[0]);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [userId, navigate]);

  // Fetch conversation history whenever a doctor is selected
  useEffect(() => {
    if (!selectedDoctor || !userId) return;

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await axios.get(`https://neuracarebackend.onrender.com/api/contacts/history?user_id=${userId}&doctor_id=${selectedDoctor.id}`);
        setChatHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
    // Poll for updates every 5 seconds to keep chat fresh
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [selectedDoctor, userId]);

  // Auto scroll chat log to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedDoctor || !userId) return;

    const payload = {
      user_id: parseInt(userId),
      doctor_id: selectedDoctor.id,
      sender_role: 'user',
      query: message.trim()
    };

    try {
      await axios.post('https://neuracarebackend.onrender.com/api/contacts', payload);
      setMessage('');
      // Optimistically fetch chat log immediately
      const res = await axios.get(`https://neuracarebackend.onrender.com/api/contacts/history?user_id=${userId}&doctor_id=${selectedDoctor.id}`);
      setChatHistory(res.data);
    } catch (err) {
      console.error('Error sending query:', err);
      alert('Failed to send clinical query. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-3">
          <Stethoscope className="w-10 h-10 text-blue-500 animate-spin" />
          <p>Connecting with clinical staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-10 space-y-8">
        
        {/* Header Block */}
        <div className="text-left">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Clinical Consultation
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Specialist</h1>
          <p className="text-slate-500 mt-1 text-sm">Direct, secure communication with NeuraCare's certified professional doctors.</p>
        </div>

        {/* Workspace Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Doctor Directory Card List (4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-left mb-1">Available Staff</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {doctors.map(doc => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex gap-4 items-center ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100 text-white' 
                        : 'bg-white border-slate-100 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white bg-slate-100">
                      <img 
                        src={getDoctorImg(doc.profile_img)} 
                        alt={doc.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate text-sm ${isSelected ? 'text-white' : 'text-slate-800'}`}>{doc.name}</p>
                      <p className={`text-xs truncate font-medium mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{doc.degree}</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Dialogue & Input form (8 columns) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
              
              {/* Doctor Chat Header */}
              {selectedDoctor && (
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                      <img 
                        src={getDoctorImg(selectedDoctor.profile_img)} 
                        alt={selectedDoctor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 text-sm">{selectedDoctor.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedDoctor.degree}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Secure SSL Encrypted</span>
                </div>
              )}

              {/* Chat Body Logs */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
                {historyLoading && chatHistory.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Loading queries...
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                    <MessageSquare className="w-12 h-12 text-slate-200" />
                    <div className="text-center">
                      <p className="font-semibold text-sm">Start a conversation</p>
                      <p className="text-xs text-slate-400 mt-0.5">Send a message to receive clinical recommendations.</p>
                    </div>
                  </div>
                ) : (
                  chatHistory.map(msg => {
                    const isUser = msg.sender_role === 'user';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 max-w-[75%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border overflow-hidden ${
                          isUser ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {isUser ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <img 
                              src={getDoctorImg(selectedDoctor?.profile_img)} 
                              alt="doctor avatar" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Content Card Bubble */}
                        <div className="space-y-1">
                          <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                            isUser 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                          }`}>
                            {msg.query}
                          </div>
                          
                          {/* Status and Timestamp */}
                          <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {isUser && (
                              msg.status === 'replied' ? (
                                <span className="flex items-center gap-0.5 text-green-500 font-bold">
                                  <CheckCircle className="w-3 h-3" /> Replied
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                  <Clock className="w-3 h-3 animate-pulse" /> Pending
                                </span>
                              )
                            )}
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Write your medical question to ${selectedDoctor?.name || 'the specialist'}...`}
                  rows="1"
                  className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition-colors bg-slate-50 placeholder:text-gray-400 max-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors shadow-md shadow-blue-50"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;