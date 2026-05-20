import React, { useState, useEffect } from 'react';
import { Edit2, BarChart2, Target, TrendingDown, Footprints, Heart, Wind, File, Info } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

const AVAILABLE_TAGS = [
  'cardio', 'diabetes', 'sugar', 'bp', 'heart', 'fitness', 'thyroid', 
  'weight_loss', 'asthma', 'allergy', 'mental_health', 'stress', 
  'nutrition', 'diet', 'kidney', 'liver', 'pcos', 'hormones', 
  'arthritis', 'joint_pain', 'migraine', 'neurology', 'skin', 'acne'
];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({ age: '', weight: '', height: '', profile_img: '', tags: [] });
  
  // BMI Calculator State
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  
  // Target Weight State
  const [goalWeight, setGoalWeight] = useState('');
  const [timelineWeeks, setTimelineWeeks] = useState(8);
  
  // AI Report State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Configure PDF.js worker using Vite's native asset import
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
    
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get(`https://neuracarebackend.onrender.com/api/users/${userId}`);
        setUserData(res.data);
        
        // Initialize functional states
        const h = res.data.height || 73;
        const w = res.data.weight || 185;
        setBmiHeight(h);
        setBmiWeight(w);
        setGoalWeight(w > 10 ? w - 10 : w);
        
        let userTags = [];
        try {
          userTags = typeof res.data.tags === 'string' ? JSON.parse(res.data.tags) : (res.data.tags || []);
        } catch(e) { userTags = []; }

        setUpdateForm({ 
          age: 32, 
          weight: w, 
          height: h, 
          profile_img: res.data.profile_img || '',
          tags: userTags
        }); // Default age if not in DB
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const userId = localStorage.getItem('userId');
      // The backend updateProfile expects { name, weight, height, profile_img, tags }
      const payload = {
        name: userData.name, 
        weight: parseFloat(updateForm.weight) || userData.weight,
        height: parseFloat(updateForm.height) || userData.height,
        profile_img: updateForm.profile_img,
        tags: updateForm.tags
      };
      
      await axios.put('https://neuracarebackend.onrender.com/api/users/profile', payload, {
        headers: { 'user-id': userId }
      });
      
      // Update local state and close modal
      setUserData({ ...userData, ...payload });
      setBmiHeight(payload.height);
      setBmiWeight(payload.weight);
      setIsModalOpen(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const extractPDFText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ");
    }
    return text;
  };

  const analyzeReport = async (pdfText) => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: `Analyze this medical report. Provide:\n- Summary\n- Health risks\n- Diet suggestions\n- Workout suggestions\n\nReport:\n${pdfText}`
        }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsAnalyzing(true);
    setAiReport(null);
    try {
      const pdfText = await extractPDFText(file);
      const report = await analyzeReport(pdfText);
      setAiReport(report);
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      alert("Failed to analyze PDF. See console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // BMI Calculation
  const parsedBmiHeight = parseFloat(bmiHeight) || 73;
  const parsedBmiWeight = parseFloat(bmiWeight) || 185;
  const bmiValue = ((parsedBmiWeight / (parsedBmiHeight * parsedBmiHeight)) * 703).toFixed(1);
  let bmiCategory = 'Normal';
  let bmiColor = 'text-blue-600';
  let bmiBgColor = 'bg-blue-600';
  let bmiLeftPos = '50%';
  if (bmiValue < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-blue-400'; bmiBgColor = 'bg-blue-400'; bmiLeftPos = '15%'; }
  else if (bmiValue >= 25 && bmiValue < 30) { bmiCategory = 'Overweight'; bmiColor = 'text-orange-500'; bmiBgColor = 'bg-orange-500'; bmiLeftPos = '75%'; }
  else if (bmiValue >= 30) { bmiCategory = 'Obese'; bmiColor = 'text-red-600'; bmiBgColor = 'bg-red-600'; bmiLeftPos = '90%'; }

  // Target Weight Calculation
  const parsedGoalWeight = parseFloat(goalWeight) || 175;
  const weightDiff = parsedBmiWeight - parsedGoalWeight;
  const days = timelineWeeks * 7;
  const calorieDeficit = Math.round((weightDiff * 3500) / days);

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-10 space-y-6">
        
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Update
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.1)] shrink-0 border-4 border-white">
              <img 
                src={userData.profile_img || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"} 
                alt={userData.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{userData.name}</h1>
                <p className="text-slate-500 text-sm mt-1">Wellness Member since {new Date(userData.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
              </div>

              {/* Stats Grid */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 min-w-[100px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</p>
                  <p className="text-xl font-bold text-blue-600">32</p>
                </div>
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 min-w-[140px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weight</p>
                  <p className="text-xl font-bold text-blue-600">{userData.weight || 185} <span className="text-sm font-medium text-slate-500">lbs</span></p>
                </div>
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 min-w-[120px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Height</p>
                  <p className="text-xl font-bold text-blue-600">{userData.height || "6'1\""}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(() => {
                  let tagsToRender = [];
                  try { tagsToRender = typeof userData.tags === 'string' ? JSON.parse(userData.tags) : (userData.tags || []); } 
                  catch(e) { tagsToRender = []; }
                  
                  if (tagsToRender.length === 0) {
                    return <span className="text-xs text-slate-400 italic">No health tags selected</span>;
                  }
                  
                  return tagsToRender.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600/80 rounded-full text-xs font-medium capitalize">
                      {tag.replace('_', ' ')}
                    </span>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: BMI and Target Weight */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* BMI Calculator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">BMI Calculator</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Height (in)</label>
                  <input 
                    type="number" 
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Weight (lbs)</label>
                  <input 
                    type="number" 
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <div className="w-3/5 relative pb-6">
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden flex relative">
                    <div className={`h-full ${bmiBgColor} absolute left-0`} style={{ width: bmiLeftPos, transition: 'width 0.3s ease-in-out' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 px-1 absolute w-full bottom-0">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">BMI Result</p>
                  <p className={`text-[26px] font-bold ${bmiColor} leading-none mt-1`}>{bmiValue}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{bmiCategory}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Target Weight */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Target Weight</h2>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">Goal Weight (lbs)</label>
                <input 
                  type="number" 
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-medium text-slate-600">Timeline</span>
                <div className="flex gap-2">
                  <button onClick={() => setTimelineWeeks(4)} className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-colors ${timelineWeeks === 4 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>4 Weeks</button>
                  <button onClick={() => setTimelineWeeks(8)} className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-colors ${timelineWeeks === 8 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>8 Weeks</button>
                  <button onClick={() => setTimelineWeeks(12)} className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-colors ${timelineWeeks === 12 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>12 Weeks</button>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-4 flex items-center justify-between ${calorieDeficit > 0 ? 'bg-[#eff4fb]' : calorieDeficit < 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
              <div>
                <p className="text-[10px] font-bold text-slate-500 mb-1">{calorieDeficit > 0 ? 'Calorie Deficit Required' : calorieDeficit < 0 ? 'Calorie Surplus Required' : 'Maintenance Calories'}</p>
                <p className={`text-xl font-bold flex items-baseline gap-1.5 ${calorieDeficit > 0 ? 'text-blue-600' : calorieDeficit < 0 ? 'text-orange-500' : 'text-green-600'}`}>
                  {calorieDeficit > 0 ? `-${calorieDeficit}` : calorieDeficit < 0 ? `+${Math.abs(calorieDeficit)}` : '0'} <span className={`text-[10px] font-medium ${calorieDeficit > 0 ? 'text-blue-500' : calorieDeficit < 0 ? 'text-orange-400' : 'text-green-500'}`}>kcal / day</span>
                </p>
              </div>
              <TrendingDown className={`w-5 h-5 ${calorieDeficit > 0 ? 'text-blue-600' : calorieDeficit < 0 ? 'text-orange-500 transform rotate-180' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        {/* Scan Report Section */}
        <div className="pt-2 pb-8">
          <h2 className="text-[22px] font-bold text-slate-800 mb-4 px-1">Scan Report</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Upload PDF Box */}
            <div className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between min-h-[150px] relative overflow-hidden group transition-colors ${isAnalyzing ? 'border-blue-300 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200'}`}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isAnalyzing ? 'bg-blue-600 text-white animate-pulse' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                  <File className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{isAnalyzing ? 'Analyzing AI...' : 'Ready'}</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-500 mb-1">Upload File</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[20px] font-bold text-slate-800 leading-tight">
                    {isAnalyzing ? 'Processing Report...' : 'Upload PDF Report'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">AI will analyze summary, risks, diet & workouts.</p>
              </div>
            </div>

            {/* AI Response Box */}
            <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm min-h-[150px] max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col relative">
              <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white pb-2 border-b border-slate-50 z-10">
                <Heart className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-slate-800">AI Health Insights</h3>
              </div>
              
              {!aiReport && !isAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 mt-4">
                  <Info className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Upload a medical report to see insights</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-blue-500 mt-4">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-bold animate-pulse">Reading and analyzing document...</p>
                </div>
              )}

              {aiReport && !isAnalyzing && (
                <div className="prose prose-sm max-w-none text-slate-600 mt-2">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-[#f8fafc] p-4 rounded-xl border border-slate-100 shadow-inner">
                    {aiReport}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Update Metrics Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
            
            {/* Modal Left Side - Profile Summary */}
            <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center text-center bg-slate-50/50">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img src={userData.profile_img || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"} alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer shadow-sm hover:bg-blue-700 transition-colors">
                  <Wind className="w-4 h-4" /> {/* Camera icon placeholder */}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800">{userData.name}</h3>
              <p className="text-slate-500 text-sm mt-1">Patient ID: #HA-{userData.id.toString().padStart(5, '0')}</p>
              
              <div className="w-full mt-8 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500">Profile Status</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">Active</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-bold text-slate-500">Last Sync</span>
                  <span className="text-xs font-medium text-slate-800">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Modal Right Side - Form */}
            <div className="w-full md:w-2/3 p-8 flex flex-col">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Update Health Metrics</h2>
                <p className="text-sm text-slate-500">Keep your physical metrics accurate to ensure the best health insights from AI analysis.</p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Age</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={updateForm.age}
                        onChange={(e) => setUpdateForm({...updateForm, age: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">years</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Weight</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={updateForm.weight}
                        onChange={(e) => setUpdateForm({...updateForm, weight: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">lbs</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Height</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={updateForm.height}
                        onChange={(e) => setUpdateForm({...updateForm, height: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">inches</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Profile Photo URL</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        placeholder="https://..."
                        value={updateForm.profile_img}
                        onChange={(e) => setUpdateForm({...updateForm, profile_img: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* Health Tags Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Health Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map(tag => {
                      const isSelected = updateForm.tags.includes(tag);
                      return (
                        <button 
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setUpdateForm({...updateForm, tags: updateForm.tags.filter(t => t !== tag)});
                            } else {
                              setUpdateForm({...updateForm, tags: [...updateForm.tags, tag]});
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold capitalize transition-colors ${isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {tag.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#eff4fb] rounded-xl p-4 flex gap-3 items-start border border-blue-100">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900/80 leading-relaxed">
                    Updating these metrics will recalibrate your Wellness Score and activity goals for the current week.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  className="px-6 py-2.5 bg-[#0057b7] text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;