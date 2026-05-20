import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShieldCheck, FileText, Lock, Network, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="w-full">

        <div id="page1" className="w-full bg-white">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-16 lg:pt-10 lg:pb-24 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12">
            
            {/* Left Content */}
            <motion.div 
              className="w-full lg:w-1/2 flex flex-col items-start"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="bg-blue-100 text-blue-800 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                Partner with the Future of Healthcare
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Scale Clinical Precision with AI-Powered Intelligence
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium">
                Empowering B2B healthcare providers with secure, clinically-validated AI tools that enhance patient outcomes and streamline operational efficiency.
              </motion.p>
              
            </motion.div>

            {/* Right Image */}
            <motion.div 
              className="w-full lg:w-1/2 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-gray-900 p-2">
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000" 
                  alt="AI Clinical Dashboard" 
                  className="w-full h-auto object-cover rounded-xl opacity-90"
                />
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay pointer-events-none rounded-2xl"></div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="w-full bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-20">
              <motion.div 
                className="flex flex-wrap justify-between items-center gap-8 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="flex-1 min-w-[150px]">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#0057b7] mb-3">500k+</h2>
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Active Users</p>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex-1 min-w-[150px]">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#0057b7] mb-3">99.8%</h2>
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Clinical Accuracy</p>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex-1 min-w-[150px]">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#0057b7] mb-3">250+</h2>
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Partner Clinics</p>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex-1 min-w-[150px]">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#0057b7] mb-3">SOC2</h2>
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Type II Certified</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div id="page2" className="w-full bg-[#f8f9fa] py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <motion.div 
                className="max-w-2xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Driving Real-World Impact
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-gray-600 text-lg">
                  Explore how leading health systems are integrating HealthAI to revolutionize their diagnostic workflows and patient engagement strategies.
                </motion.p>
              </motion.div>
              
              <motion.a 
                href="#" 
                className="flex items-center gap-2 text-[#0057b7] font-semibold hover:text-blue-800 transition-colors whitespace-nowrap"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Explore all cases <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Cards Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Column (2/3 width) */}
              <div className="flex flex-col gap-6 lg:w-2/3">
                
                {/* Top Left Card (Large) */}
                <motion.div 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer group relative"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <div className="h-64 w-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                      alt="Global Health Systems Dashboard" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 pb-10">
                    <div className="flex flex-wrap gap-3 mb-5">
                      <span className="bg-gray-100 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500">Hospitals</span>
                      <span className="bg-gray-100 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500">30% Efficiency Gain</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0057b7] transition-colors">Global Health Systems Diagnostic Overhaul</h3>
                    <p className="text-gray-600 max-w-2xl leading-relaxed text-sm">
                      Implementing HealthAI's predictive modeling reduced emergency room wait times by 40% across 12 metropolitan hospitals.
                    </p>
                    <div className="absolute bottom-8 right-8 text-[#0057b7]">
                      <ArrowUpRight className="w-6 h-6 transform translate-x-0 translate-y-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </div>
                </motion.div>
                
                {/* Bottom Left Area */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Bottom Left Card (Narrow) */}
                  <motion.div 
                    className="bg-[#e5e7eb] rounded-2xl overflow-hidden flex flex-col w-full sm:w-1/2 cursor-pointer group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="p-8 pb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0057b7] transition-colors">Telehealth 2.0</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Providing real-time clinical analysis during remote consultations.
                      </p>
                    </div>
                    <div className="h-32 mt-auto overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800" 
                        alt="Telehealth Dashboard" 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 mix-blend-multiply"
                      />
                    </div>
                  </motion.div>
                  {/* Empty space matching the mockup */}
                  <div className="hidden sm:block sm:w-1/2"></div>
                </div>

              </div>

              {/* Right Column (1/3 width) */}
              <motion.div 
                className="lg:w-1/3 flex"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-[#0057b7] rounded-2xl p-8 flex flex-col text-white w-full shadow-lg cursor-pointer group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="mb-8 relative z-10">
                    <span className="bg-white/20 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                      Insurance Providers
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 relative z-10 leading-tight">MetLife Wellness Integration</h3>
                  
                  <p className="text-blue-100 mb-12 text-sm leading-relaxed relative z-10">
                    Seamlessly integrated AI wellness tracking for 2M+ policyholders, promoting preventative care and reducing claims by 15% annually.
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between relative z-10">
                    <ShieldCheck className="w-8 h-8 text-white/90" />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
        
        <div id="page3" className="w-full bg-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Left Column (Cards) */}
              <motion.div 
                className="w-full lg:w-1/2 flex flex-col gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {/* Top Row Cards */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Card 1 */}
                  <motion.div variants={fadeInUp} className="flex-1 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <ShieldCheck className="w-8 h-8 text-[#0057b7] mb-6" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold text-gray-900 mb-3">HIPAA & GDPR</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Full compliance with global data protection standards for healthcare information.
                    </p>
                  </motion.div>
                  
                  {/* Card 2 */}
                  <motion.div variants={fadeInUp} className="flex-1 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <FileText className="w-8 h-8 text-[#0057b7] mb-6" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Evidence-Based</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Algorithms trained on peer-reviewed clinical datasets and validated by MDs.
                    </p>
                  </motion.div>
                </div>
                
                {/* Bottom Row Cards */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Card 3 */}
                  <motion.div variants={fadeInUp} className="flex-1 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <Lock className="w-8 h-8 text-[#0057b7] mb-6" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Zero-Trust Security</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Advanced encryption and identity management at every layer of the platform.
                    </p>
                  </motion.div>
                  
                  {/* Card 4 */}
                  <motion.div variants={fadeInUp} className="flex-1 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <Network className="w-8 h-8 text-[#0057b7] mb-6" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Seamless Interop</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      FHIR and HL7 compatible APIs for easy integration into existing EHR systems.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column (Text Content) */}
              <motion.div 
                className="w-full lg:w-1/2 flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Uncompromising Trust, Security,<br className="hidden lg:block" /> and Accuracy
                </motion.h2>
                
                <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed mb-10">
                  In the healthcare sector, technology is only as good as the trust it commands. HealthAI is built on a foundation of clinical excellence and rigorous security protocols.
                </motion.p>
                
                <motion.ul variants={fadeInUp} className="space-y-5">
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#0057b7] flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-800 font-medium">ISO 27001 Certified Infrastructure</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#0057b7] flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-800 font-medium">Real-time Clinical Bias Monitoring</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#0057b7] flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-800 font-medium">Multi-region Data Residency Options</span>
                  </li>
                </motion.ul>
              </motion.div>
              
            </div>
          </div>
        </div>
        <div id="page4" className="w-full bg-[#f8f9fa] py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div 
              className="bg-[#0070f3] rounded-[2.5rem] p-10 md:p-16 lg:p-24 text-center shadow-xl flex flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeInUp} 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              >
                Ready to Transform Your Health Services?
              </motion.h2>
              
              <motion.p 
                variants={fadeInUp} 
                className="text-blue-100 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed font-medium"
              >
                Join the next generation of healthcare leaders. Let's discuss how HealthAI can scale with your organization's specific needs.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp} 
                className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
              >
                <button className="bg-white text-[#0057b7] font-semibold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
                  Schedule a Consultation
                </button>
                <button className="bg-transparent border border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap">
                  Download Platform Overview
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
    </div>
  )
}

export default LandingPage