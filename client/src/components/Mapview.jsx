import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css'
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    },0);
  }, [map]);
  return null;
}

export default function MapView({ data }) {
  const center = Array.isArray(data?.[0]?.coords)&& typeof data[0].coords[0] === 'number' && typeof data[0].coords[1] === 'number' ? data[0].coords : [20, 0]
 

  return (
    <div className='map-con'>
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' ,}}
        
      >
        <FixMapSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data?.map((r, i) => (
          <Marker key={i} position={r.coords}>
            <Popup>
              <strong>{r.resolver}</strong><br />
              {r.loc}
              <img src={`https://flagcdn.com/24x18/${r.flag}.png`} alt={r.loc} style={{marginLeft:'5px', verticalAlign:'middle'}}/><br/>
              {r.answers?.length ? r.answers.join(', ') : r.error || 'No record'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


