import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hammer, MapPin, User, Phone, Lock, ChevronRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useKaragirStore } from '../context/KaragirStoreContext';

export const KaragirAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginArtisan, registerArtisan } = useKaragirStore();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    craftSpecialty: '',
    city: '',
    area: '',
    password: ''
  });

  const CITIES_AND_AREAS: Record<string, string[]> = {
    'Mumbai': ['Andheri', 'Bandra', 'Colaba', 'Borivali', 'Dadar'],
    'Pune': ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Shivajinagar', 'Baner'],
    'Delhi': ['Connaught Place', 'Karol Bagh', 'Dwarka', 'Hauz Khas'],
    'Bangalore': ['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar'],
    'Nashik': ['Panchavati', 'Indira Nagar', 'College Road', 'Satpur']
  };

  const [showPassword, setShowPassword] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorToast(null);

    if (tab === 'login') {
      const success = await loginArtisan(formData.mobile, formData.password);
      if (!success) {
        setErrorToast("Invalid credentials. Please try again.");
      }
    } else {
      await registerArtisan({
        name: formData.fullName,
        phone: formData.mobile,
        password: formData.password || '12345',
        craftSpecialty: formData.craftSpecialty,
        location: `${formData.area}, ${formData.city}`
      });
    }
  };

  const handleAutoFill = () => {
    setFormData({
      ...formData,
      mobile: '9000001401', // Changed to Bharat Thakur who is definitely in the DB
      password: '123456'
    });
    setErrorToast(null);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#1F1510] border border-[#3E2E24] rounded-3xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-[#120B08]/80 hover:bg-[#EA580C] text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#120B08] border border-[#EA580C] flex items-center justify-center text-[#EA580C] shadow-lg">
                <Hammer className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Karagir Portal</h2>
            <p className="text-sm text-slate-400">Join the premier network of master artisans.</p>
          </div>

          <div className="flex p-1 rounded-xl bg-[#120B08] border border-[#2A1E17]">
            <button
              type="button"
              onClick={() => { setTab('login'); setErrorToast(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'login' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorToast(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'register' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Toast */}
            <AnimatePresence>
              {errorToast && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200">{errorToast}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {tab === 'register' && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-[#EA580C]" />
                    <input type="text" required placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EAB308]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Hammer className="absolute left-4 top-3.5 w-4 h-4 text-[#EA580C]" />
                      <select required value={formData.craftSpecialty} onChange={(e) => setFormData({...formData, craftSpecialty: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EAB308] appearance-none">
                        <option value="" disabled>Select Craft</option>
                        <option value="Woodworking">Woodworking</option>
                        <option value="Hand Carving">Hand Carving</option>
                        <option value="Upholstery">Upholstery</option>
                        <option value="Mandir Specialist">Mandir Specialist</option>
                        <option value="Custom Joinery">Custom Joinery</option>
                      </select>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#EA580C]" />
                      <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value, area: ''})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EAB308] appearance-none">
                        <option value="" disabled>Select City</option>
                        {Object.keys(CITIES_AND_AREAS).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {formData.city && (
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#EA580C]/70" />
                      <select required value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EAB308] appearance-none">
                        <option value="" disabled>Select Area in {formData.city}</option>
                        {CITIES_AND_AREAS[formData.city].map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#EA580C]" />
              <input type="tel" required placeholder={tab === 'login' ? 'e.g. 9876543210' : 'Phone Number (Unique)'} value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EAB308]" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#EA580C]" />
              <input 
                type={showPassword ? "text" : "password"} 
                required={tab === 'login'}
                placeholder={tab === 'login' ? 'Default demo password is 12345' : 'Set your password (or default: 12345)'} 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-sm focus:outline-none focus:border-[#EAB308]" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-[#EA580C] focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {tab === 'login' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="w-full py-2.5 rounded-xl bg-[#120B08] border border-[#EA580C]/40 text-[#EA580C] hover:bg-[#EA580C]/10 text-xs font-bold transition-colors"
                >
                  Auto-fill Demo Artisan (Bharat - 123456)
                </button>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white font-bold text-sm shadow-lg glow-orange flex items-center justify-center space-x-2 transition-all group mt-2">
              <span>{tab === 'login' ? 'Access Portal' : 'Register & Create Shop'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
