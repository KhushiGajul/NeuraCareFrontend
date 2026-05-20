import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Share2, 
  Bot, 
  User, 
  Loader2, 
  ChevronLeft,
  Search,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const ChatAI = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I'm your HealthAI assistant. How can I help you today? You can ask me about symptoms, nutrition, exercise routines, or general wellness advice.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUserData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Prepare message history for the AI
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: input });

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a professional Health AI assistant for NeuraCare. You provide accurate medical information, symptom analysis, nutrition advice, and wellness tips. Always remain polite, empathetic, and professional. Always include a disclaimer that you are an AI and not a substitute for professional medical advice."
            },
            ...history
          ],
          temperature: 0.7,
          max_tokens: 1024,
          stream: true
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from Groq');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';

      // Add placeholder for AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') break;

          try {
            const parsed = JSON.parse(message);
            const content = parsed.choices[0]?.delta?.content || '';
            aiResponseText += content;

            // Update the last message (the AI's response)
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].content = aiResponseText;
              return newMessages;
            });
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-6 md:py-10 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[500px]">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-full transition-colors md:hidden">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Health Assistant</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Online & Active</span>
            </div>
          </div>
        </div>
        
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 overflow-hidden ${msg.role === 'user' ? 'bg-white' : 'bg-blue-600 text-white'}`}>
              {msg.role === 'user' ? (
                <img 
                  src={userData?.profile_img || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80"} 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Bot className="w-6 h-6" />
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.content || (loading && index === messages.length - 1 ? <Loader2 className="w-5 h-5 animate-spin" /> : '')}
                
                {/* Markdown-like parsing for bold text */}
                {/* Note: In a real app we'd use react-markdown, but for now we'll keep it simple */}
              </div>
              <p className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-tighter">
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center gap-3">
            
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your health question here..."
                className="w-full bg-slate-50 border-none rounded-[2rem] px-6 py-4 text-slate-800 text-[15px] focus:ring-2 focus:ring-blue-100 outline-none transition-all pr-14"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`absolute right-2 top-2 bottom-2 aspect-square rounded-2xl flex items-center justify-center transition-all ${
                  loading || !input.trim() 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95'
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] font-medium text-slate-400 mt-4 tracking-tight uppercase">
            AI can make mistakes. Consider checking important info.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default ChatAI;