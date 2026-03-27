import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [center, map]);
  return null;
}

interface MapSectionProps {
  mapCenter: [number, number];
  markers: any[];
}

export default function MapSection({ mapCenter, markers }: MapSectionProps) {
  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={mapCenter} />
      {markers.map((marker) => {
        const isTier3 = marker.tier === 3;
        const icon = isTier3 ? new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }) : new L.Icon.Default();

        return (
          <Marker key={marker.id} position={marker.position} icon={icon}>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${marker.type === 'NGO' ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {marker.type} • {marker.category}
                </div>
                <h4 className="font-bold text-slate-800">{marker.title}</h4>
                {isTier3 && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[9px] text-amber-700 italic leading-tight">
                    <strong>Verification: Pending</strong><br />
                    Disclaimer: This is an unverified crowdsourced entry from the Citizen Gate.
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
