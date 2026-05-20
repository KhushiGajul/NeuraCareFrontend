import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope, Send, CheckCircle, Clock, Inbox, User, Sparkles } from 'lucide-react';

const Query = () => {
  const navigate = useNavigate();
  const [inbox, setInbox] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const chatEndRef = useRef(null);

  const doctorId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  // Verify role is doctor or admin
  useEffect(() => {
    if (!doctorId || (userRole !== 'doctor' && userRole !== 'admin')) {
      navigate('/doctor-login');
      return;
    }
  }, [doctorId, userRole, navigate]);

  // Dynamic profile images for users
  const getUserImg = (profileImg) => {
    if (profileImg?.startsWith('http')) return profileImg;
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"; // Premium fallback placeholder
  };

  // Fetch doctor queries inbox list
  const fetchInbox = async () => {
    if (!doctorId) return;
    try {
      const res = await axios.get(`https://neuracarebackend.onrender.com/api/contacts/doctor/${doctorId}`);
      
      // Group raw messages by user_id to form distinct conversations
      const conversationsMap = {};
      res.data.forEach(q => {
        if (!conversationsMap[q.user_id]) {
          conversationsMap[q.user_id] = {
            userId: q.user_id,
            userName: q.user_name,
            userProfileImg: q.user_profile_img,
            latestMessage: q.query,
            latestTime: q.created_at,
            status: q.status,
            messages: []
          };
        }
        conversationsMap[q.user_id].messages.push(q);
      });

      const conversationList = Object.values(conversationsMap);
      setInbox(conversationList);
      
      // Auto select the first conversation if none selected yet
      if (conversationList.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationList[0]);
      }
    } catch (err) {
      console.error('Error fetching inbox queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    // Poll for new user queries every 6 seconds
    const interval = setInterval(fetchInbox, 6000);
    return () => clearInterval(interval);
  }, [doctorId]);

  // Fetch dialogue thread for the selected patient
  useEffect(() => {
    if (!selectedConversation || !doctorId) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`https://neuracarebackend.onrender.com/api/contacts/history?user_id=${selectedConversation.userId}&doctor_id=${doctorId}`);
        setChatHistory(res.data);
      } catch (err) {
        console.error('Error fetching conversation history:', err);
      }
    };

    fetchHistory();
    // Poll chat history every 4 seconds to maintain active socket feel
    const interval = setInterval(fetchHistory, 4000);
    return () => clearInterval(interval);
  }, [selectedConversation, doctorId]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedConversation || !doctorId) return;

    const payload = {
      user_id: selectedConversation.userId,
      doctor_id: parseInt(doctorId),
      sender_role: 'doctor',
      query: replyMessage.trim()
    };

    try {
      await axios.post('https://neuracarebackend.onrender.com/api/contacts', payload);
      setReplyMessage('');
      
      // Instantly refresh thread and conversation status indicators
      const [histRes] = await Promise.all([
        axios.get(`https://neuracarebackend.onrender.com/api/contacts/history?user_id=${selectedConversation.userId}&doctor_id=${doctorId}`),
        fetchInbox()
      ]);
      setChatHistory(histRes.data);
    } catch (err) {
      console.error('Error sending clinical reply:', err);
      alert('Failed to send clinical reply.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-3">
          <Stethoscope className="w-10 h-10 text-blue-500 animate-spin" />
          <p>Opening medical inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-10 space-y-8">
        
        {/* Header Block */}
        <div className="text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Query Management System
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Queries Inbox</h1>
          <p className="text-slate-500 mt-1 text-sm">Review, prioritize, and reply securely to incoming health questions from your patients.</p>
        </div>

        {/* Workspace Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Patient Inquiries (4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-left mb-1">Inquiries</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {inbox.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-sm space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-slate-200" />
                  <p className="font-semibold">Your inbox is clean</p>
                  <p className="text-xs text-slate-400">No active patient inquiries found.</p>
                </div>
              ) : (
                inbox.map(convo => {
                  const isSelected = selectedConversation?.userId === convo.userId;
                  // If there is any message in conversation with status 'pending' and sender 'user', then it needs a response!
                  const needsReply = convo.messages.some(m => m.sender_role === 'user' && m.status === 'pending');
                  
                  return (
                    <button
                      key={convo.userId}
                      onClick={() => setSelectedConversation(convo)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex gap-4 items-center relative ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100 text-white' 
                          : 'bg-white border-slate-100 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {/* Unanswered badge */}
                      {needsReply && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping border-2 border-white" />
                      )}

                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white bg-slate-100">
                        <img 
                          src={getUserImg(convo.userProfileImg)} 
                          alt={convo.userName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center pr-2">
                          <p className={`font-bold truncate text-sm ${isSelected ? 'text-white' : 'text-slate-800'}`}>{convo.userName}</p>
                        </div>
                        <p className={`text-xs truncate font-medium mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {convo.latestMessage}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat Dialogue Thread & Reply area (8 columns) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
              
              {selectedConversation ? (
                <>
                  {/* Selected Patient Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                        <img 
                          src={getUserImg(selectedConversation.userProfileImg)} 
                          alt={selectedConversation.userName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{selectedConversation.userName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patient Case Thread</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">HIPAA Compliant</span>
                  </div>

                  {/* Message Thread Area */}
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
                    {chatHistory.map(msg => {
                      const isDoctor = msg.sender_role === 'doctor';
                      return (
                        <div 
                          key={msg.id}
                          className={`flex gap-3 max-w-[75%] ${isDoctor ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
                        >
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border overflow-hidden ${
                            isDoctor ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}>
                            {isDoctor ? (
                              <Stethoscope className="w-4 h-4" />
                            ) : (
                              <img 
                                src={getUserImg(selectedConversation.userProfileImg)} 
                                alt="patient avatar" 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Bubble Card */}
                          <div className="space-y-1">
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                              isDoctor 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                            }`}>
                              {msg.query}
                            </div>
                            
                            {/* Time / Status Indicator */}
                            <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                              <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {!isDoctor && (
                                msg.status === 'replied' ? (
                                  <span className="flex items-center gap-0.5 text-green-500 font-bold ml-1">
                                    <CheckCircle className="w-3 h-3" /> Replied
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-0.5 text-amber-500 font-bold ml-1">
                                    <Clock className="w-3 h-3 animate-pulse" /> Awaiting Response
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Doctor Reply Submission Form */}
                  <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder={`Formulate clinical response for ${selectedConversation.userName}...`}
                      rows="1"
                      className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition-colors bg-slate-50 placeholder:text-gray-400 max-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!replyMessage.trim()}
                      className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors shadow-md shadow-blue-50"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Inbox className="w-12 h-12 text-slate-200" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">No Patient Selected</p>
                    <p className="text-xs text-slate-400 mt-0.5">Choose an incoming case query to review and send a clinical reply.</p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Query;