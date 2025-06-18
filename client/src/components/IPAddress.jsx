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
import loc from '../assest/marker.png'
import region from '../assest/land-location.png'
import timezone from '../assest/icons8-timezone-100.png'
import post from '../assest/icons8-postal-100.png'
import org from '../assest/icons8-organization-96.png'
import map from '../assest/land-location.png';

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
const [openIpMap, setOpenIpMap]= useState(false);

const handleMapClick = ()=>{
  setOpenIpMap(true)
  if(openIpMap === true){
    setOpenIpMap(false)
  }

}


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
const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/ipinfo/${ip}`);
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
        postal: data.postal,
        timezone:data.timezone,
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
    <Box  sx={{
      display:'flex',
      flexDirection:'column',
      gap:'15px',
      position:'absolute',
      top:0,
      left:0,
      width:'100%',
      zIndex:1000,
      backgroundColor:'white'
      
   
      

    }}>
      <Box  sx={{
    height:{xs:'100vh', md:'100vh'},
    display:'flex',
    flexDirection:'column',
    gap:'20px'
  }}>
<div >
<div className='a'>
  
    <div style={{alignContent:'center', justifyContent:'end', display:'flex', width:'100%'}}>
      
      <Button sx={{alignItems: 'flex-start'}} onClick={handleOnClose} >❌</Button>
    </div>
<div className='g'>
  <div className='b' style={{ gap:'5px', flexDirection:'column', alignItems:'center', justifyContent:'center',  backgroundColor:'white',  
   justifySelf:'center', borderRadius:'15px',marginTop:'10px'
  }}>
  <h2 style={{textAlign:'center'}}>Enter IP Address</h2>
     <br/>
   
      <input
      // variant='filled'
      // label='Enter Ip Address'
      type="text"
      placeholder='IP'
      className='input-ip'
      style={{
        width:'100%'
      }}
      value={inputIp}
      onChange={e => setInputIp(e.target.value)}
      />
      <br/>
      <Button onClick={()=>fetchInfo(inputIp)} sx={{
        backgroundColor:'#007BFF',
        color:'white',
        height:'30px',
        width:'100%',
        fontSize:{xs:'10px', md:'medium'}
      }}>Get IP Info</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </div> 
        </div>
        </div>
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
        <div className='f'>
         <div className='e'style={{height:'50px', alignContent:"center"}}>

          <h1 style={{textAlign:'center', color:'	#FE791A'}}>Current User Ip: {clientIp}</h1>
         </div>

        <Box sx={{display:'flex', flexDirection:{xs:'row', md:'row'}, gap:'10px', padding:'5px', justifyContent:'center'}}>
<Box sx={{
  padding:'10px',
  width:'100%',
  maxWidth:{xs:'300px', md:'800px'},
 
  boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  
}}>
  
          <p className='c'><span><img src={loc} alt='loc'/> </span><b style={{color:'#FE791A'}}>IP:</b> {info.ip}</p>
          <br/>
          <p className='c'><span><img src={loc} alt='loc'/> </span><b style={{color:'#FE791A'}}>City:</b> {info.city}</p>
          <br/>
          <p className='c'><span><img src={region} alt='img'/> </span><b style={{color:'#FE791A'}}>Region:</b> {info.region}</p>
          <br/>
<p className='c'> <b style={{color:'#FE791A'}}>Country:</b> {info.country}<span><img src={`https://flagcdn.com/24x18/${info.country.toLowerCase()}.png`} alt={info.country}/></span> </p>         
 <br/>
 <p className='c'><span><img src={org} alt='img' /> </span><b style={{color:'#FE791A'}}>Org:</b> {info.org}</p>
 <br/>

 <p className='c'><span><img src ={post} alt='img'/></span> <b style={{color:'#FE791A'}}>Postal-Code:</b> {info.postal}</p>
 <br/>
 <p className='c'><span><img src={timezone} alt ='img'/> </span><b style={{color:'#FE791A'}}>Time-Zone:</b> {info.timezone}</p>
<br/>
<span><img style={{width:20}} src={map} alt='map'/> </span><button className='map-btn'onClick={ handleMapClick}>Map</button>
          
        

{openIpMap && (
  <Box sx={{
    flex:1,
    height:'400px',
    position:'relative'
  }}>
    <br/>     
   <MapContainer
      center={info.coords}
      zoom={15}
      
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }} // Fixed height for reliability
      >
      <FixMapSize />
      <TileLayer
        attribution='© OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={info.coords}>
        <Popup>
          {info.city}, {info.region}<br />
          {info.coords.join(', ')}<br />
          <img
            src={`https://flagcdn.com/24x18/${info.country.toLowerCase()}.png`}
            alt={info.country}
            style={{ marginTop: 4 }}
            />
        </Popup>
      </Marker>
    </MapContainer>
  
    </Box>
)}
        </Box>
</Box>

                    </div>
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
