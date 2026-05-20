import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, Activity, Edit2, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      
      if (!userId || (userRole !== 'doctor' && userRole !== 'admin')) {
        navigate('/login');
        return;
      }
      
      try {
        const res = await axios.get(`https://neuracarebackend.onrender.com/api/doctors/${userId}`);
        setDoctorData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctor();
  }, [navigate]);

  if (!doctorData) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Loading Doctor Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-10 space-y-6">
        
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative">
          <button className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Edit2 className="w-4 h-4" />
            Update Profile
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.1)] shrink-0 border-4 border-white bg-slate-100 flex items-center justify-center">
              <img 
                src={
                  doctorData.profile_img?.startsWith('http') 
                    ? doctorData.profile_img 
                    : doctorData.profile_img?.includes('doctor1') 
                      ? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80"
                      : doctorData.profile_img?.includes('doctor2')
                        ? "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=256&q=80"
                        : doctorData.profile_img?.includes('admin')
                          ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
                          : "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80"
                } 
                alt={doctorData.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{doctorData.name}</h1>
                <p className="text-slate-500 text-sm mt-1">{doctorData.email}</p>
              </div>

              {/* Stats Grid */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 min-w-[140px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Degree</p>
                  <p className="text-xl font-bold text-blue-600">{doctorData.degree || 'MD, General'}</p>
                </div>
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 min-w-[140px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Appointed Clients</p>
                  <p className="text-xl font-bold text-blue-600">{doctorData.appointed_clients || 0}</p>
                </div>
                <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 min-w-[100px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</p>
                  <p className="text-xl font-bold text-blue-600">{doctorData.age || 'N/A'}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1 bg-green-50 text-green-600/80 rounded-full text-xs font-medium capitalize">{doctorData.role}</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600/80 rounded-full text-xs font-medium">Verified Professional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Recent Appointments</h2>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 justify-center items-center text-center text-slate-500">
                <Calendar className="w-10 h-10 text-slate-200 mb-2" />
                <p className="text-sm font-medium">No appointments scheduled for today.</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
             <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Overview</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Total Consultations</span>
                    <span className="text-lg font-bold text-slate-800">124</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Patient Satisfaction</span>
                    <span className="text-lg font-bold text-slate-800">4.9/5</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;