import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { Artisan, LocationPin } from '../types';
import { Star, Hammer } from 'lucide-react';


// Custom Leaflet Pin Icon generator
const createCustomIcon = (isVerified: boolean) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div class="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#1F1510] border-2 ${
        isVerified ? 'border-[#EA580C]' : 'border-[#3E2E24]'
      } shadow-xl transform hover:scale-110 transition-transform cursor-pointer">
        <div class="w-6 h-6 rounded-full bg-[#EA580C] flex items-center justify-center text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 12-8.373 8.373a1 1 0 1 1-1.414-1.414L13.586 10.586a1 1 0 0 0 0-1.414l-2.172-2.172a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 0 1 1.414 0l4.243 4.243a1 1 0 0 1 0 1.414L17 11"/>
          </svg>
        </div>
        ${isVerified ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#120B08]"></span>' : ''}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

interface LeafletMapProps {
  artisans: Artisan[];
  selectedLocation: LocationPin;
  onSelectArtisan: (artisan: Artisan) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ artisans, selectedLocation, onSelectArtisan }) => {
  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-[#2A1E17] shadow-2xl">
      
      {/* Map Container */}
      <MapContainer
        center={[selectedLocation.lat, selectedLocation.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* 5km Radius Circle */}
        <Circle
          center={[selectedLocation.lat, selectedLocation.lng]}
          radius={5000}
          pathOptions={{
            color: '#EA580C',
            fillColor: '#EA580C',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '4, 8'
          }}
        />

        {/* Artisan Pins */}
        {artisans.map((artisan) => (
          <Marker
            key={artisan.id}
            position={[artisan.lat, artisan.lng]}
            icon={createCustomIcon(artisan.isVerified)}
          >
            <Popup className="dark-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={artisan.avatarUrl}
                    alt={artisan.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#EA580C]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{artisan.shopName}</h4>
                    <p className="text-[10px] text-slate-400">{artisan.name}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] mb-2 text-slate-300">
                  <span className="flex items-center text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" />
                    {artisan.rating} ({artisan.reviewsCount})
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                    {artisan.distanceKm} km away
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {artisan.specialties.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#2A1E17] text-slate-300">
                      #{s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectArtisan(artisan)}
                  className="w-full py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#F97316] text-white text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <Hammer className="w-3 h-3" />
                  <span>View Store & Quote</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay Radius Badge (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-[#1F1510]/95 backdrop-blur-md border border-[#3E2E24] px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-xl">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse glow-green"></div>
        <div>
          <p className="text-xs font-bold text-white">
            {artisans.length} Verified Karagirs Active
          </p>
          <p className="text-[10px] text-slate-400">
            Within 5km radius of {selectedLocation.locality}
          </p>
        </div>
      </div>

    </div>
  );
};
