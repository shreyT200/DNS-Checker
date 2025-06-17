import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MapContainer, TileLayer, Marker, Popup, useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {TextField, Button, Box, Paper, Table, TableBody, TableCell, TableHead, TableContainer, TableRow } from '@mui/material'
import {Snackbar, Alert} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import './all.css'
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
  }, [map]);
  return null;
}

export default function IPAddress({handleOnClose}) {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const [snackbarSeverity, setSnackbarSeverity] = useState('info');
const [snackbarMessage, setSnackbarMessage] = useState('');
const [SnackbarOpen, setSnackbarOpen] = useState(false);
const [clientIp, setClientIp] = useState('');
const [inputIp, setInputIp] = useState('');


useEffect(()=>{
  axios.get('https://api.ipify.org?format=json')
  .then(resp=>{
    setClientIp(resp.data.ip);
    fetchInfo(resp.data.ip);
  })
  .catch(()=>{
    setSnackbarOpen(true);
    setSnackbarMessage('Could not detect your ip')
    setSnackbarSeverity('error');
  })
},[]);


  const isValidIp = ip => /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/.test(ip);

  const fetchInfo = async(ip) => {
    
    if (!isValidIp(ip)) {
     setSnackbarOpen(true);
      setSnackbarMessage('Please enter a valid IPV4');
    setSnackbarSeverity('error')
      return;
    }
    setLoading(true);
    
    try {
      // const token = import.meta.env.VITE_IP_API_KEY;
      const { data } = await axios.get(`http://localhost:8000/api/ipinfo/${ip}`);
     if(!data.loc){
      throw new Error('Location not available in IP fopr info')
     } 
      const [lat, lng] = data.loc.split(',').map(Number);
      
      
      setInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        org: data.org,
        coords: [lat, lng],
      });
            
            setError(null);
        }
        
        catch (err) {
            setSnackbarOpen(true);
            setSnackbarMessage('Failed fetching IP info');
            setSnackbarSeverity('error')
            console.error(err);
        }finally{

            setLoading(false)
        }
  };

  return (
    <>
    <Box sx={{
      display:'flex',
      flexDirection:"column",
      gap:'15px',
      position:'absolute',
      top:0,
      left:0,
      width:'100%',
      zIndex:1000,
     
   
      

    }}>
      <Box component={Paper} sx={{padding:'10px',
    height:'100vh',
    display:'flex',
    flexDirection:'column',
    gap:'20px'
  }}>

<div style={{display:'flex' , justifyContent:'space-between'}}>

  <div style={{display:'flex', gap:'5px', alignItems:'center' }}>
      <input
      // variant='filled'
      // label='Enter Ip Address'
        type="text"
      placeholder='Enter Ip Address'
      className='input-ip'
        
        value={inputIp}
        onChange={e => setInputIp(e.target.value)}
        />
      <Button onClick={()=>fetchInfo(inputIp)} sx={{
        backgroundColor:'#007BFF',
        color:'white',
        height:'30px'
      }}>Get IP Info</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <Button onClick={handleOnClose} >❌</Button>
        </div>
{loading ? (
  <Box sx={{
    textAlign: 'center',
    position: 'absolute',
    top: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh',
    width: '100%',
   
  }}>
        <CircularProgress />
    </Box>
      ): info ? (
  <Box sx={{display:'flex', flexDirection:'column', gap:'10px'}}>
<TableContainer component={Paper}>
  <Table>
    <TableHead sx={{backgroundColor:'black'}}>
      <TableCell sx={{color:'white'}}>IP</TableCell>
      <TableCell sx={{color:'white'}}>City</TableCell>
      <TableCell sx={{color:'white'}}>Region</TableCell>
      <TableCell sx={{color:'white'}}>Country</TableCell>
      <TableCell sx={{color:'white'}}>Org</TableCell>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>{info.ip}</TableCell>
        <TableCell>{info.city}</TableCell>
        <TableCell>{info.region}</TableCell>
        <TableCell>{info.country}</TableCell>
        <TableCell>{info.org}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
          {/* <p><b>IP:</b> {info.ip}</p>
          <p><b>City:</b> {info.city}</p>
          <p><b>Region:</b> {info.region}</p>
          <p><b>Country:</b> {info.country}</p>
          <p><b>Org:</b> {info.org}</p> */}
          
          <div style={{ height: 600, width: '100%',  border:'2px solid black' }}>
        

            <MapContainer
              center={info.coords}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
              >
              <FixMapSize />
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              <Marker position={info.coords}>
                <Popup>
                  {info.city}, {info.region}<br/>
                  {info.coords.join(', ')}<br/>
                  <img
                    src={`https://flagcdn.com/24x18/${info.country.toLowerCase()}.png`}
                    alt={info.country}
                    style={{ marginTop: 4 }}
                    />
                </Popup>
              </Marker>
                 
            </MapContainer>
          </div>
        </Box>
                ): null}
   

   <Snackbar open={SnackbarOpen} autoHideDuration={3000} anchorOrigin={{vertical:'top', horizontal:'center'}} >
    <Alert onClose={()=>setSnackbarOpen(false)} severity={snackbarSeverity}>
        {snackbarMessage}

    </Alert>
   </Snackbar>
                </Box>
                </Box>
    </>
  );
}
