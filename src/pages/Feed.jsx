import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Newspaper, 
  Sparkles, 
  Loader2, 
  Info, 
  Heart, 
  Activity, 
  Dumbbell, 
  Apple, 
  Brain, 
  Flame, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  Search, 
  RefreshCw, 
  User,
  AlertCircle,
  X
} from 'lucide-react';

const Feed = () => {
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom states for the interactive experience
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [activeTag, setActiveTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  // Premium fallback Unsplash images based on topic to maintain stunning visuals
  const getFallbackImage = (title, tag) => {
    const t = (title + ' ' + (tag || '')).toLowerCase();
    if (t.includes('cardio') || t.includes('heart') || t.includes('bp') || t.includes('blood pressure')) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'; // Cardio
    }
    if (t.includes('diabet') || t.includes('sugar') || t.includes('glucose') || t.includes('insulin')) {
      return 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800'; // Diabetes
    }
    if (t.includes('fit') || t.includes('exercise') || t.includes('workout') || t.includes('gym')) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'; // Fitness
    }
    if (t.includes('diet') || t.includes('nutrition') || t.includes('food') || t.includes('eat') || t.includes('plant')) {
      return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800'; // Nutrition
    }
    if (t.includes('mental') || t.includes('stress') || t.includes('anxiety') || t.includes('mind') || t.includes('sleep') || t.includes('psych')) {
      return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'; // Mental Health
    }
    return 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800'; // General Medical/Science
  };

  // Icon selector based on tag
  const getTagIcon = (tagName) => {
    const t = tagName.toLowerCase();
    if (t.includes('cardio') || t.includes('heart') || t.includes('bp')) return <Activity className="w-4 h-4" />;
    if (t.includes('fit') || t.includes('exercise')) return <Dumbbell className="w-4 h-4" />;
    if (t.includes('diabet') || t.includes('sugar') || t.includes('diet') || t.includes('nutrition')) return <Apple className="w-4 h-4" />;
    if (t.includes('mental') || t.includes('stress')) return <Brain className="w-4 h-4" />;
    return <Flame className="w-4 h-4" />;
  };

  // Initial user tags load and default fetch
  useEffect(() => {
    const fetchUserDataAndNews = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        const userResponse = await axios.get(`https://neuracarebackend.onrender.com/api/users/${userId}`);
        let rawTags = userResponse.data.tags;
        let parsedTags = [];

        try {
          parsedTags = typeof rawTags === 'string' ? JSON.parse(rawTags) : (rawTags || []);
        } catch (e) {
          parsedTags = [];
        }

        const cleanTags = parsedTags.map(tag =>
          typeof tag === 'object' ? tag.tag_name || tag.name : tag
        );

        const activeTags = cleanTags.length > 0 ? cleanTags : ['cardio', 'fitness', 'diabetes'];
        setTags(activeTags);
        
        await fetchNews(activeTags);
      } catch (error) {
        console.error('Error fetching user data for feed:', error);
        // Fallback default tags
        const fallbackTags = ['cardio', 'fitness', 'diabetes'];
        setTags(fallbackTags);
        await fetchNews(fallbackTags);
      }
    };

    fetchUserDataAndNews();
  }, [navigate]);

  // Main news fetcher
  const fetchNews = async (searchTags, manualQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = '8bbcf12673d4c2f57443df9ef9524fbd2ae1847441e648f8c2fe7d8d4edcc667';
      
      // Determine query: either the manual user search query or joined user tags
      const query = manualQuery ? manualQuery : searchTags.join(" OR ");

      let data = null;

      // Fetch news from the local proxy backend to completely bypass CORS policy blocks
      try {
        const response = await fetch(
          `https://neuracarebackend.onrender.com/api/news?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          data = await response.json();
        } else {
          setError("Failed to fetch news from local proxy.");
        }
      } catch (err) {
        console.error("Local proxy news fetch failed:", err);
      }

      if (data && (data.data || data.articles)) {
        const articlesList = data.data || data.articles || [];
        const normalized = articlesList.map(item => {
          const title = item.title || 'Health & Wellness Insight';
          const fallbackImg = getFallbackImage(title, query);
          return {
            uuid: item.uuid,
            title: title,
            publisher: item.publisher || 'Medical News',
            published_at: item.published_at || new Date().toISOString(),
            description: item.incipit || item.description || 'Explore expert analyses, scientific breakthroughs, and guidance customized to match health and wellness targets.',
            image: item.thumbnail || item.image || fallbackImg,
            url: item.original_url || item.url || '#',
            body: item.body || '',
            authors: item.authors || [],
            isEnriched: !!(item.thumbnail || item.description || item.url)
          };
        });
        setArticles(normalized);
      } else {
        setError("Could not retrieve personalized news. Please adjust your keywords or try again.");
      }
    } catch (err) {
      console.error("Error in news loading loop:", err);
      setError("An unexpected error occurred while loading your health feed.");
    } finally {
      setLoading(false);
    }
  };

  // Background worker loop to fetch details and automatically enrich articles with pictures & descriptions
  useEffect(() => {
    if (articles.length === 0) return;

    let isSubscribed = true;
    const apiKey = '8bbcf12673d4c2f57443df9ef9524fbd2ae1847441e648f8c2fe7d8d4edcc667';

    const enrichArticles = async () => {
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        if (article.isEnriched) continue;

        // Slow paced interval to guarantee we never hit the 2 req/second API limit
        await new Promise(resolve => setTimeout(resolve, 800));

        if (!isSubscribed) break;

        try {
          const res = await fetch(`https://neuracarebackend.onrender.com/api/news/details?uuid=${article.uuid}`);

          if (res.ok) {
            const detailData = await res.json();
            const detail = detailData.data;

            if (detail && isSubscribed) {
              setArticles(prev => prev.map(item => {
                if (item.uuid === article.uuid) {
                  return {
                    ...item,
                    image: detail.thumbnail || item.image,
                    description: detail.incipit || item.description,
                    url: detail.original_url || item.url,
                    body: detail.body || item.body,
                    authors: detail.authors || item.authors,
                    isEnriched: true
                  };
                }
                return item;
              }));
            }
          }
        } catch (err) {
          console.warn(`Could not auto-enrich article details for ${article.uuid}:`, err);
        }
      }
    };

    enrichArticles();

    return () => {
      isSubscribed = false;
    };
  }, [articles.map(a => a.uuid).join(',')]);

  // Reader Modal handler - fetches details on click if not already loaded
  const openArticleReader = async (article) => {
    setSelectedArticle(article);
    setModalLoading(true);
    setModalError(null);

    if (article.body && article.isEnriched) {
      setModalLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://neuracarebackend.onrender.com/api/news/details?uuid=${article.uuid}`);

      if (res.ok) {
        const detailData = await res.json();
        const detail = detailData.data;
        if (detail) {
          setSelectedArticle(prev => ({
            ...prev,
            body: detail.body || prev.body || 'No full text available for this publication.',
            image: detail.thumbnail || prev.image,
            description: detail.incipit || prev.description,
            authors: detail.authors || [],
          }));

          // Save back into state so the main list gets enriched
          setArticles(prev => prev.map(item => {
            if (item.uuid === article.uuid) {
              return {
                ...item,
                image: detail.thumbnail || item.image,
                description: detail.incipit || item.description,
                body: detail.body,
                authors: detail.authors,
                isEnriched: true
              };
            }
            return item;
          }));
        }
      } else {
        setModalError("Could not retrieve the full details for this article.");
      }
    } catch (err) {
      console.error("Error loading article modal details:", err);
      setModalError("Error fetching publication text.");
    } finally {
      setModalLoading(false);
    }
  };

  // Custom search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchNews(tags);
    } else {
      setIsSearching(true);
      fetchNews(tags, searchQuery.trim());
    }
  };

  // Reset custom search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchNews(tags);
  };

  // Filtering by Tag click
  const filteredArticles = activeTag === 'all' 
    ? articles 
    : articles.filter(article => {
        const queryWords = (article.title + ' ' + article.description).toLowerCase();
        return queryWords.includes(activeTag.toLowerCase());
      });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-10 space-y-12">
        
        {/* Premium Header */}
        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Medical News Engine
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Health <span className="text-blue-600">Feed</span> Center
              </h1>
              <p className="text-slate-500 max-w-xl text-xl leading-relaxed font-medium">
                Personalized scientific publications and breakthroughs selected specifically to match your medical tags.
              </p>
              
              {/* Dynamic tag indicator pills */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => setActiveTag('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider ${
                    activeTag === 'all' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
                  }`}
                >
                  All Articles
                </button>
                {tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTag(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider flex items-center gap-2 ${
                      activeTag === tag
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
                    }`}
                  >
                    {getTagIcon(tag)}
                    #{tag.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Search Bar */}
            <div className="w-full lg:w-96 bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] space-y-4 shrink-0 shadow-inner">
              <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm uppercase tracking-wider">
                <Search className="w-4.5 h-4.5 text-blue-600" />
                <span>Search Publications</span>
              </div>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                <input
                  type="text"
                  placeholder="E.g., Heart wellness, keto diet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/35 text-sm font-medium transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase"
                >
                  Go
                </button>
              </form>
              {isSearching && (
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  Viewing Custom Search Results
                </div>
              )}
            </div>
          </div>
          <Heart className="absolute -bottom-10 -left-10 w-64 h-64 text-slate-50/50 -rotate-12 pointer-events-none" />
        </div>

        {/* Error Alert Card */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-rose-950">Feeder Ingestion Pause</h3>
                <p className="text-sm font-medium text-rose-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => fetchNews(tags)}
              className="px-6 py-3 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 font-bold rounded-xl shadow-sm text-xs uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              Try Reconnecting
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 p-8 space-y-6 animate-pulse">
                <div className="aspect-[16/10] bg-slate-100 rounded-2xl w-full" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-6 bg-slate-100 rounded-full w-5/6" />
                  <div className="h-6 bg-slate-100 rounded-full w-4/6" />
                  <div className="h-4 bg-slate-100 rounded-full w-full pt-2" />
                  <div className="h-4 bg-slate-100 rounded-full w-full" />
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="h-5 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-5 bg-slate-100 rounded-full w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Articles Feed */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredArticles.map((article, index) => (
                  <div 
                    key={index}
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      {/* Image Thumbnail */}
                      <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getFallbackImage(article.title, activeTag);
                          }}
                        />
                        <div className="absolute top-5 left-5 pointer-events-none flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-black rounded-lg uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            Personalized
                          </span>
                        </div>
                        <div className="absolute bottom-5 right-5 pointer-events-none">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-800 text-[9px] font-extrabold rounded-lg uppercase tracking-wider shadow-sm">
                            {article.publisher}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="px-8 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <h2 className="text-xl font-extrabold text-slate-800 capitalize leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </h2>

                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                          {article.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions and External Links */}
                    <div className="p-8 pt-4">
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <button 
                          onClick={() => openArticleReader(article)}
                          className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 hover:text-blue-700 active:scale-95 transition-all"
                        >
                          Open Reader
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                        >
                          Read More
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Search / Filter state */
              <div className="bg-white rounded-[4rem] p-20 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Info className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Matching Publications</h3>
                <p className="text-slate-500 text-lg mb-6 leading-relaxed">
                  We couldn't locate any items matching your active search tag or filters. Try adjusting your tags.
                </p>
                <button
                  onClick={clearSearch}
                  className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 text-xs uppercase tracking-wider"
                >
                  Reset Feed Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Expert Verified Guidance Safety Disclaimer banner */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white p-12 md:p-14 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="relative z-10 flex-1 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              Information & Safety
            </div>
            <h3 className="text-3xl md:text-4xl font-black leading-tight">Expert-Verified Resources</h3>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
              Medical publications on this dashboard represent studies from world-leading clinical research institutes. Please consult clinical providers before altering therapies.
            </p>
          </div>
          <div className="relative flex-shrink-0">
             <Sparkles className="w-48 h-48 text-white/5 absolute -right-12 -bottom-12 rotate-12" />
             <div className="w-20 h-20 bg-blue-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-blue-900/50">
               <Newspaper className="w-10 h-10 text-white" />
             </div>
          </div>
        </div>

      </div>

      {/* Spectacular Glassmorphic Modal Article Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-slate-900/60 transition-all duration-300">
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300">
            
            {/* Modal Header Actions */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-8 py-5 border-b border-slate-100 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase rounded-lg tracking-wider">
                  {selectedArticle.publisher}
                </span>
                {selectedArticle.authors && selectedArticle.authors.length > 0 && (
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {selectedArticle.authors.join(', ')}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-full flex items-center justify-center text-slate-450 hover:text-slate-800 transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable content */}
            <div className="overflow-y-auto p-8 md:p-12 space-y-8 flex-1">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="text-slate-450 font-bold uppercase tracking-widest text-xs">
                    Retrieving full scientific text...
                  </p>
                </div>
              ) : modalError ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-800">{modalError}</h4>
                  <a 
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-extrabold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-750 active:scale-95 text-xs uppercase transition-all"
                  >
                    Open Original Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Article Title */}
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {selectedArticle.title}
                  </h2>

                  {/* Visual Image Banner */}
                  <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner">
                    <img 
                      src={selectedArticle.image} 
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackImage(selectedArticle.title, activeTag);
                      }}
                    />
                  </div>

                  {/* Summary/Incipit Box */}
                  <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-blue-600 font-medium text-slate-600 leading-relaxed text-base italic">
                    "{selectedArticle.description}"
                  </div>

                  {/* Complete Body Content */}
                  {selectedArticle.body ? (
                    <div className="prose prose-slate max-w-none space-y-6">
                      {selectedArticle.body.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-450 font-bold uppercase tracking-wider text-xs">No full text body present</p>
                    </div>
                  )}

                  {/* Safety Medical Disclaimer footer of article */}
                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 font-semibold leading-relaxed">
                      Disclaimer: This research article is loaded dynamically for review. Under no circumstances should recommendations therein be implemented without professional physician approval.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="sticky bottom-0 bg-slate-50 px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Ingested via FreeNewsAPI.io
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex-1 sm:flex-initial px-6 py-3 bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close Reader
                </button>
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-extrabold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 text-xs uppercase tracking-wider transition-all"
                >
                  Original Article
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;