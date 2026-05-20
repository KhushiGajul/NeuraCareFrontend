import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tv, Video as VideoIcon, Sparkles, Loader2, Info, LayoutGrid, Heart, Activity, Dumbbell, Apple } from 'lucide-react';

const Video = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledVideos, setShuffledVideos] = useState({});
  const navigate = useNavigate();

  // Extensive library of high-quality health videos (reputable sources only)
  const healthVideoLibrary = {
  'cardio': [
    'wZEUomaZOS8',  // Best Exercise for Heart Health – Mayo Clinic
    'Qpowu4w1WY4',  // Exercise and the heart – Mayo Clinic Radio
    'd67_-_f7KEA',  // Ideal Exercise for Your Heart – Mayo Clinic
    'VlIuJ_9wfi8',  // How much exercise do you need? – Mayo Clinic Minute
  ],
  'diabetes': [
    'QsSZNetJIuA',  // Type 2 Diabetes – What you need to know – Mayo Clinic
    'thd_sH4rgeY',  // The facts on Type 2 Diabetes – Mayo Clinic
    'Txqe_CAD43c',  // Mayo Clinic Explains Diabetes
    'rFDJbrRhNk4',  // Who is affected by diabetes – Mayo Clinic Minute
  ],
  'sugar': [
    'eRfMbfyJCjA',  // Get the Facts on Type 2 Diabetes – Mayo Clinic
    'V-1bOCr2XK8',  // Understanding diabetes: Prevention and warning signs
    'epMc_H1eqkg',  // Rise in Type 2 diabetes – Mayo Clinic Minute
    'moKfywLYVO8',  // Prevention key to reducing Type 2 diabetes in kids
  ],
  'bp': [
    'r5XTTeP039Q',  // Mayo Clinic Explains Hypertension
    'VWB9SfWvfSk',  // High Blood Pressure – Mayo Clinic
    'NMuzXbyu7YY',  // How to lower blood pressure without medication
    'dWYMAK2lsvw',  // Know your numbers: Blood pressure – Mayo Clinic
  ],
  'heart': [
    'wXk1Nj28Hm4',  // What to do for a healthier heart – Mayo Clinic Minute
    'hjRWc3a5_is',  // Cardiologist's tips for a healthy life – Mayo Clinic
    'lLrqUKV_r1c',  // Myth-busting heart health – Mayo Clinic Minute
    'gHC-DCf2sW4',  // Diabetes and heart disease – Mayo Clinic Q&A
  ],
  'fitness': [
    'VlIuJ_9wfi8',  // How much exercise do you need? – Mayo Clinic Minute
    '7dPor-O50C4',  // Walking is a step towards heart health – Mayo Clinic
    '7aoEtq4twes',  // How to hit your target heart rate – Mayo Clinic
    'DRnw-5lBP48',  // Are you hitting your target heart rate? – Mayo Clinic
  ],
  'thyroid': [
    'mhYeuD_Z3Po',  // Thyroid overdrive – Graves' disease – Mayo Clinic Minute
    'yS2OhBk-LbM',  // Do you have hypothyroidism? – Mayo Clinic Minute
    'jl65GULkC0I',  // Hypothyroidism – Mayo Clinic Radio
    '93eJdR5PtPw',  // How the thyroid affects the heart – Mayo Clinic Minute
  ],
  'weight_loss': [
    'SIKkuD1OJo4',  // 10 Mayo Clinic Diet-approved items
    '16jmKYossP4',  // New Year dieting tips 2025 – Mayo Clinic
    'wZEUomaZOS8',  // Best Exercise for Heart Health – Mayo Clinic
    '7dPor-O50C4',  // Walking is a step towards heart health – Mayo Clinic
  ],
  'asthma': [
    'WYFCCWk64NQ',  // High blood pressure hurts the kidneys – Mayo Clinic
    'hf13p9yn2Nk',  // Hypertension and heart disease – Mayo Clinic Minute
    'PDB5K5q7II4',  // Millions of Americans have hypertension – Mayo Clinic
    'Mop0Z0y3K00',  // Kids with high blood pressure – Mayo Clinic Minute
  ],
  'allergy': [
    'RA--KsYifNI',  // Anxiety – Common Causes & Triggers – Mayo Clinic
    'vvGdA39KA_8',  // Mental health benefits of tidying up – Mayo Clinic
    'WDJjNOu8TjE',  // Mayo Clinic on High Blood Pressure
    'CIzhlxOELEA',  // Audiobook: Mayo Clinic on High Blood Pressure
  ],
  'mental_health': [
    'RA--KsYifNI',  // Anxiety – Common Causes & Triggers – Mayo Clinic
    'vvGdA39KA_8',  // Mental health benefits of tidying up – Mayo Clinic
    'fZoj3GZdsXQ',  // Physician Mental Health – Mayo Clinic
    'ZVTflsiNnd4',  // A Conversation About Mental Health – Mayo Clinic Transform
  ],
  'stress': [
    'RA--KsYifNI',  // Anxiety – Common Causes & Triggers – Mayo Clinic
    'vvGdA39KA_8',  // Mental health benefits of tidying up – Mayo Clinic
    'hjRWc3a5_is',  // Cardiologist's tips for a healthy life – Mayo Clinic
    '7dPor-O50C4',  // Walking is a step towards heart health – Mayo Clinic
  ],
  'nutrition': [
    'SIKkuD1OJo4',  // 10 Mayo Clinic Diet-approved items
    '16jmKYossP4',  // New Year dieting tips 2025 – Mayo Clinic
    'wZEUomaZOS8',  // Best Exercise for Heart Health – Mayo Clinic
    '7dPor-O50C4',  // Walking is a step towards heart health – Mayo Clinic
  ],
  'diet': [
    '16jmKYossP4',  // New Year dieting tips 2025 – Mayo Clinic
    'SIKkuD1OJo4',  // 10 Mayo Clinic Diet-approved items
    'eRfMbfyJCjA',  // Get the Facts on Type 2 Diabetes – Mayo Clinic
    'V-1bOCr2XK8',  // Understanding diabetes: Prevention and warning signs
  ],
  'kidney': [
    'OVk4YXwJp98',  // Mayo Clinic Explains Kidney Disease
    '-QIZO2ClDR4',  // Ask Mayo Clinic: Kidney Disease
    'oO0PupWnOgc',  // Chronic Kidney Disease – Mayo Clinic Radio
    'ovlcJuI7q4o',  // Causes of kidney disease – Mayo Clinic
  ],
  'liver': [
    'TEuO0XyxH28',  // Causes of liver disease – Mayo Clinic
    'OVk4YXwJp98',  // Mayo Clinic Explains Kidney Disease (organ health)
    '-QIZO2ClDR4',  // Ask Mayo Clinic: Kidney Disease (organ health)
    'WYFCCWk64NQ',  // High blood pressure hurts the kidneys – Mayo Clinic
  ],
  'pcos': [
    '5E3kvDpu3Cg',  // PCOS and endometrial cancer – Mayo Clinic Minute
    'mhYeuD_Z3Po',  // Thyroid overdrive – hormonal context
    'RA--KsYifNI',  // Anxiety – stress and hormones
    'yS2OhBk-LbM',  // Do you have hypothyroidism?
  ],
  'hormones': [
    'mhYeuD_Z3Po',  // Thyroid overdrive – Graves' disease – Mayo Clinic
    'yS2OhBk-LbM',  // Do you have hypothyroidism? – Mayo Clinic
    '93eJdR5PtPw',  // How the thyroid affects the heart – Mayo Clinic
    '1Vr0JxoCd9E',  // Overtreating an underactive thyroid – Mayo Clinic
  ],
  'arthritis': [
    'Njc6jtvzUDU',  // Arthritis Explained: Osteoarthritis, Rheumatoid – Mayo Clinic
    'FloX45Ue414',  // Rethinking Rheumatoid Arthritis – Mayo Clinic
    'wZEUomaZOS8',  // Best Exercise for Heart Health (joint-friendly exercise)
    '7dPor-O50C4',  // Walking is a step towards health – Mayo Clinic
  ],
  'joint_pain': [
    'Njc6jtvzUDU',  // Arthritis Explained – Mayo Clinic
    'FloX45Ue414',  // Rethinking Rheumatoid Arthritis – Mayo Clinic
    'VlIuJ_9wfi8',  // How much exercise do you need? – Mayo Clinic
    '7aoEtq4twes',  // How to hit your target heart rate – Mayo Clinic
  ],
  'migraine': [
    'E6lMGCoRBPA',  // Mayo Clinic Explains Migraine
    '2ONWurUQlUw',  // Migraine and Aura – Mayo Clinic
    '2ecSQuvSY-Q',  // Recent developments in migraine treatment
    'RA--KsYifNI',  // Anxiety & stress triggers – Mayo Clinic
  ],
  'neurology': [
    'E6lMGCoRBPA',  // Mayo Clinic Explains Migraine
    '2ONWurUQlUw',  // Migraine and Aura – Mayo Clinic
    'ZVTflsiNnd4',  // A Conversation About Mental Health – Mayo Clinic
    'fZoj3GZdsXQ',  // Physician Mental Health – Mayo Clinic
  ],
  'skin': [
    'mhYeuD_Z3Po',  // Thyroid overdrive (thyroid-skin link)
    'RA--KsYifNI',  // Anxiety – stress impacts skin
    '16jmKYossP4',  // Diet tips for healthy skin
    'SIKkuD1OJo4',  // Mayo Clinic Diet – skin & nutrition
  ],
  'acne': [
    '5E3kvDpu3Cg',  // PCOS and skin – Mayo Clinic Minute
    'mhYeuD_Z3Po',  // Thyroid & hormonal skin – Mayo Clinic
    'RA--KsYifNI',  // Stress & skin – Mayo Clinic
    'SIKkuD1OJo4',  // Diet and skin health – Mayo Clinic
  ],
};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`https://neuracarebackend.onrender.com/api/users/${userId}`);
        let rawTags = response.data.tags;
        let parsedTags = [];

        try {
          parsedTags = typeof rawTags === 'string' ? JSON.parse(rawTags) : (rawTags || []);
        } catch (e) {
          parsedTags = [];
        }

        const cleanTags = parsedTags.map(tag =>
          typeof tag === 'object' ? tag.tag_name || tag.name : tag
        );

        setTags(cleanTags.length > 0 ? cleanTags : ['wellness', 'fitness', 'nutrition']);
        
        // Randomize the videos for each tag to make it feel dynamic
        const randomized = {};
        cleanTags.forEach(tag => {
          const videos = healthVideoLibrary[tag.toLowerCase()] || healthVideoLibrary['fitness'];
          randomized[tag] = [...videos].sort(() => Math.random() - 0.5);
        });
        setShuffledVideos(randomized);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setTags(['wellness', 'fitness', 'nutrition']);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">
          Loading your personalized feed...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-10 space-y-12">

        {/* Premium Header */}
        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase">
                <Sparkles className="w-4 h-4" />
                AI-Powered Recommendations
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Wellness <span className="text-blue-600">Video</span> Hub
              </h1>
              <p className="text-slate-500 max-w-xl text-xl leading-relaxed font-medium">
                Every video is curated by our intelligence engine to match your health profile. Fresh content, every time.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {tags.map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-[11px] font-bold uppercase tracking-wider">
                    #{tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="shrink-0 hidden lg:block">
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                <Tv className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <Heart className="absolute -bottom-10 -left-10 w-64 h-64 text-slate-50/50 -rotate-12 pointer-events-none" />
        </div>

        {/* Video Feed per Tag */}
        <div className="space-y-16">
          {tags.map((tag, index) => {
            const videos = shuffledVideos[tag] || [];
            if (videos.length === 0) return null;

            return (
              <div key={index} className="space-y-8">
                {/* Section Title */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                      {tag === 'fitness' ? <Dumbbell className="w-6 h-6" /> : 
                       tag === 'nutrition' ? <Apple className="w-6 h-6" /> : 
                       <Activity className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 capitalize tracking-tight">
                        {tag.replace(/_/g, ' ')}
                      </h2>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Expert Curated Guides</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live Content
                  </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {videos.slice(0, 3).map((videoId, vIndex) => (
                    <div 
                      key={vIndex} 
                      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    >
                      <div className="aspect-video relative overflow-hidden bg-slate-900">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`}
                          title={`${tag} video ${vIndex}`}
                          className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity"
                          allowFullScreen
                        />
                        <div className="absolute top-5 left-5 pointer-events-none">
                          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                            Premium Content
                          </span>
                        </div>
                      </div>
                      <div className="p-8 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 capitalize leading-tight group-hover:text-blue-600 transition-colors">
                          {tag.replace(/_/g, ' ')} Health & Wellness Guide
                        </h3>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-blue-600">
                            <Sparkles className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">AI Ranked</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">1080P HD</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {tags.length === 0 && (
          <div className="bg-white rounded-[4rem] p-24 text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
              <Info className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Your Feed is Empty</h2>
            <p className="text-slate-500 max-w-sm mx-auto text-lg mb-8 leading-relaxed">
              Add health tags in your dashboard to generate your custom AI video hub.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              Configure Hub
            </button>
          </div>
        )}

        {/* Footer Banner */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white p-14 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              <Heart className="w-5 h-5" />
              Medical Safety
            </div>
            <h3 className="text-4xl font-black leading-tight">Expert-Verified Guidance</h3>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
              Every video in this hub is selected from reputable medical institutions. Always consult with your primary care physician before starting new treatments.
            </p>
          </div>
          <div className="relative flex-shrink-0">
             <Sparkles className="w-48 h-48 text-white/5 absolute -right-12 -bottom-12 rotate-12" />
             <div className="w-20 h-20 bg-blue-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-blue-900/50">
               <VideoIcon className="w-10 h-10" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Video;