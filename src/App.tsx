import { useState, useEffect } from 'react';
import type { AppMode, LocationPin, Artisan, Product, ProductItem } from './types';
import { NASHIK_LOCALITIES, MOCK_ARTISANS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BuyerDiscovery } from './components/BuyerDiscovery';
import { FindLocalArtisansPage } from './components/FindLocalArtisansPage';
import { CustomRequestBuilder } from './components/CustomRequestBuilder';
import { ArtisanStorefront } from './components/ArtisanStorefront';
import { MilestoneTracker } from './components/MilestoneTracker';

import { ArtisanPortal } from './components/ArtisanPortal';
import { WorkshopReelModal } from './components/WorkshopReelModal';
import { ArtisanProduct3DEditor } from './components/ArtisanProduct3DEditor';
import { MaterialProvider } from './context/MaterialContext';
import { KaragirStoreProvider } from './context/KaragirStoreContext';
import { KaragirAuthModal } from './components/KaragirAuthModal';
import { CreateStoreWizard } from './components/CreateStoreWizard';
import { EscrowProvider } from './context/EscrowContext';
import { MaterialPassportProvider } from './context/MaterialPassportContext';
import { PublicPassportVerification } from './components/PublicPassportVerification';
import { Hammer, ShieldCheck, Heart, MapPin } from 'lucide-react';

function AppContent() {
  const [mode, setMode] = useState<AppMode>('buyer');
  const [activeTab, setActiveTab] = useState<string>('find-artisans');
  const [selectedLocation, setSelectedLocation] = useState<LocationPin>(NASHIK_LOCALITIES[0]);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan>(MOCK_ARTISANS[0]);
  const [activeReelArtisan, setActiveReelArtisan] = useState<Artisan | null>(null);
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState<Product | ProductItem | null>(null);
  const [publicPassportId, setPublicPassportId] = useState<string | null>(null);

  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith('/verify/material/')) {
        const passportId = path.substring('/verify/material/'.length);
        setPublicPassportId(passportId);
        setActiveTab('public-passport');
      } else if (hash.startsWith('#/verify/material/')) {
        const passportId = hash.substring('#/verify/material/'.length);
        setPublicPassportId(passportId);
        setActiveTab('public-passport');
      }
    };
    parseUrl();
    window.addEventListener('hashchange', parseUrl);
    return () => window.removeEventListener('hashchange', parseUrl);
  }, []);



  const handleSelectArtisan = (artisan: Artisan) => {
    setSelectedArtisan(artisan);
    setActiveTab('artisan-storefront');
  };

  return (
    <MaterialProvider>
      <div className="min-h-screen bg-[#120B08] text-white flex flex-col justify-between selection:bg-[#EA580C] selection:text-white">
        
        {/* Navigation Header */}
        <div>
          <Navbar
            mode={mode}
            onModeChange={(newMode) => {
              setMode(newMode);
              if (newMode === 'artisan') {
                setActiveTab('artisan-portal');
              } else {
                setActiveTab('find-artisans');
              }
            }}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* View Routing Body */}
          <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 pt-8">
            
            {mode === 'buyer' && (
              <>
                {activeTab === 'find-artisans' && (
                  <BuyerDiscovery
                    selectedLocation={selectedLocation}
                    onSelectArtisan={handleSelectArtisan}
                    onOpenCustomBuilder={() => setActiveTab('custom-request')}
                    onOpenReel={(artisan) => setActiveReelArtisan(artisan)}
                    onOpenFindLocalArtisans={() => setActiveTab('find-local-artisans')}
                  />
                )}

                {activeTab === 'find-local-artisans' && (
                  <FindLocalArtisansPage
                    onBackToHome={() => setActiveTab('find-artisans')}
                    onSelectArtisanStorefront={(regionalArtisan) => {
                      const convertedArtisan: Artisan = {
                        id: regionalArtisan.id,
                        name: regionalArtisan.name,
                        shopName: regionalArtisan.shopName,
                        experienceYears: regionalArtisan.experienceYears,
                        rating: regionalArtisan.rating,
                        reviewsCount: 150,
                        isVerified: regionalArtisan.isVerified,
                        avatarUrl: regionalArtisan.image,
                        coverUrl: regionalArtisan.image,
                        locality: regionalArtisan.area,
                        pincode: regionalArtisan.pincode,
                        distanceKm: 2.5,
                        lat: regionalArtisan.lat,
                        lng: regionalArtisan.lng,
                        crafts: ['Woodwork'], // Default fallback
                        specialties: [regionalArtisan.craftCategory],
                        responseTime: '~2 hours',
                        completedOrdersCount: 100,
                        bio: regionalArtisan.bio
                      };
                      setSelectedArtisan(convertedArtisan);
                      setActiveTab('artisan-storefront');
                    }}
                  />
                )}

                {activeTab === 'custom-request' && (
                  <CustomRequestBuilder
                    selectedLocation={selectedLocation}
                    onSubmitSuccess={() => setActiveTab('milestone-tracker')}
                    onBack={() => setActiveTab('find-artisans')}
                  />
                )}

                {activeTab === 'artisan-storefront' && (
                  <ArtisanStorefront
                    artisan={selectedArtisan}
                    onOpenReel={(artisan) => setActiveReelArtisan(artisan)}
                    onCustomizeProduct={(product) => {
                      setSelectedProductForCustomization(product);
                      setActiveTab('customize-artisan-item');
                    }}
                    onBack={() => setActiveTab('find-artisans')}
                  />
                )}

                {activeTab === 'customize-artisan-item' && (
                  <div className="pt-4">
                    <button
                      onClick={() => setActiveTab('artisan-storefront')}
                      className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-200 hover:text-white border border-[#3E2E24] text-xs font-extrabold transition-all shadow-md group"
                    >
                      <span>← Back to Workshop</span>
                    </button>
                    <ArtisanProduct3DEditor 
                      artisan={selectedArtisan} 
                      product={selectedProductForCustomization}
                    />
                  </div>
                )}

                {activeTab === 'milestone-tracker' && (
                  <MilestoneTracker
                    onBack={() => setActiveTab('find-artisans')}
                    onNavigateToVerify={(passportId) => {
                      setPublicPassportId(passportId);
                      setActiveTab('public-passport');
                    }}
                  />
                )}

                {activeTab === 'public-passport' && (
                  <PublicPassportVerification
                    passportId={publicPassportId}
                    onBack={() => {
                      window.history.pushState({}, '', '/');
                      setPublicPassportId(null);
                      setActiveTab('milestone-tracker');
                    }}
                  />
                )}
              </>
            )}

            {mode === 'artisan' && (
              <>
                {activeTab === 'artisan-portal' && (
                  <ArtisanPortal
                    onBackToBuyer={() => {
                      setMode('buyer');
                      setActiveTab('find-artisans');
                    }}
                  />
                )}
              </>
            )}

            {/* Global Modals (Auth & Setup Wizards) */}
            <KaragirAuthModal />
            <CreateStoreWizard />

          </main>
        </div>

        {/* Workshop Reel Video Overlay Modal */}
        {activeReelArtisan && (
          <WorkshopReelModal
            artisan={activeReelArtisan}
            onClose={() => setActiveReelArtisan(null)}
          />
        )}

        {/* Global Footer */}
        <footer className="bg-[#1F1510] border-t border-[#2A1E17] mt-16 py-12">

          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              
              {/* Col 1: Brand Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#120B08] border border-[#EA580C] flex items-center justify-center text-[#EA580C]">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold tracking-tight text-white">karagir</span>
                    <span className="w-2 h-2 rounded-full bg-[#EA580C] glow-dot ml-0.5 inline-block"></span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hyper-local marketplace connecting skilled Indian craftsmen with buyers seeking bespoke physical creations.
                </p>
                <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Escrow Protected</span>
                </div>
              </div>

              {/* Col 2: Material-First Categories */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Raw Material Hubs</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li><a href="#woodwork" className="hover:text-[#EA580C] transition-colors">Sagwan Teak Woodwork</a></li>
                  <li><a href="#brass" className="hover:text-[#EA580C] transition-colors">Moradabad Bell Brassware</a></li>
                  <li><a href="#pottery" className="hover:text-[#EA580C] transition-colors">Khurja Studio Pottery Clay</a></li>
                  <li><a href="#cane" className="hover:text-[#EA580C] transition-colors">Assam Rattan & Cane Weaving</a></li>
                  <li><a href="#marble" className="hover:text-[#EA580C] transition-colors">Makrana White Marble Stone</a></li>
                </ul>
              </div>

              {/* Col 3: Nashik Localities */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Active Nashik Hubs</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  {NASHIK_LOCALITIES.map((loc) => (
                    <li key={loc.pincode} className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#EA580C]" />
                      <span>{loc.locality} ({loc.pincode})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: Material Guarantee */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Material Gate Guarantee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct workshop pricing with zero intermediary markups. Live raw material plank & brass verification before escrow release.
                </p>
                <div className="p-3 rounded-xl bg-[#120B08] border border-[#2A1E17]">
                  <span className="text-[10px] font-mono text-[#EAB308]">Need Custom Support?</span>
                  <p className="text-xs font-bold text-white mt-0.5">support@karagir.in</p>
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-[#2A1E17] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <p>© 2026 karagir. platform. All rights reserved.</p>
              <p className="flex items-center">
                <span>Handcrafted with</span>
                <Heart className="w-3.5 h-3.5 text-[#EA580C] fill-current mx-1" />
                <span>for Nashik's Master Crafters</span>
              </p>
            </div>

          </div>
        </footer>

      </div>
    </MaterialProvider>
  );
}

export function App() {
  return (
    <EscrowProvider>
      <KaragirStoreProvider>
        <MaterialPassportProvider>
          <AppContent />
        </MaterialPassportProvider>
      </KaragirStoreProvider>
    </EscrowProvider>
  );
}

export default App;
