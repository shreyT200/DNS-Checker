import React, { useState, useRef, useLayoutEffect } from 'react';
import { api } from '../services/api';
import Mapview from './Mapview';
import mag from '../assest/Screenshot 2025-06-19 160526.png'
import InfoPage from './InfoPage';
import './all.css';
import {
  Box,
  // TextField,
  // Select,
  // MenuItem,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Paper,
  TableContainer,
  Button,
  Slide,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import IPAddress from './IPAddress';
import IPInfo from './IPInfo';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import {Fab, Tooltip} from '@mui/material'

import {gsap} from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default function Propagation() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordType, setRecordType] = useState('A');
  const [SnackbarOpen, setSnackbarOpen] = useState(false);
  const [SnackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
const [openModal, setOpenModal] = useState(false)
const [openIP, setOpenIP] = useState(false);
 
gsap.registerPlugin(ScrollTrigger)
const bannerRef = useRef();
const searchRef = useRef();
const fabRef = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(()=>{
      const tl = gsap.timeline({defaults:{ease:'power3.out'}})
      if(bannerRef.current){
        tl.from(bannerRef.current,{ y:-100, opacity:0, duration:0.6})

      }
      if(searchRef.current){
        tl.from(searchRef.current,{
          opacity:0,
          scale:0.9,
          duration:0.5
        }, '>-0.2')

      }
      if(fabRef.current){
        tl.from(fabRef.current,{opacity:0, y:20, duration:0.4}, '>-0.2')
      }

      gsap.utils.toArray('[data-animate="fade-up"]').forEach((el)=>{
        gsap.from(el, {
          scrollTrigger:{
            trigger:el,
            start:'top 80%',
            toggleActions:'play none none none'
          },
          y:50,
          opacity:0,
          duration:0.8,
          ease:'power3.out',
          overwrite:true,

        })
      })
    })
    return () => ctx.revert();
  }, []);


const openIpTool=()=>{
  setDomain('');
  setResult(null);
  setRecordType('A');
  setSnackbarOpen(false);
  setOpenIP(true)
}
const check = async () => {
    if (!domain.trim()) {
      setSnackbarOpen(true);
      setSnackbarMessage('Input field empty, please fill it');
      setSnackbarSeverity('error');
      return;
    }

    setLoading(true);
    setResult(null);
    setOpenModal(false)

    try {
      const { data } = await api.get('/propagate', {
        params: { domain, type: recordType }
      });
      setResult(data); // whole object includes Propagation and blacklist
    } catch (e) {
      console.error('Propagation check failed:', e);
      setResult({ Propagation: [{ resolver: 'API', error: 'Request failed' }], blacklist: [] });
    } finally {
      setLoading(false);
    }
  };
const handleClose=()=>
{
  setOpenIP(false)
}
  return (
    <>
      {/* <div className='banner'>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignSelf: 'center',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1>DNS Propagation Checker</h1>
        </Box>
      </div> */}
    <Box ref={bannerRef} backgroundColor= '#007BFF' color='white' sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%', }}>


     <Typography  sx={{fontSize:{xs:'16px', md:'30px'}}}>DNS Propagation Checker</Typography>
 
   <button className='ip-btn' onClick={openIpTool}>IP to Address</button>
     
    </Box>
<Tooltip title="Go to DNS Search" arrow>
  <Fab
  ref={fabRef}
    color="error"
    sx={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 2000,
    }}
    onClick={() => {
    document.getElementById('dns-search')?.scrollIntoView({ behavior: 'smooth' });

    }}
  >
    <ArrowDownwardIcon />
  </Fab>
</Tooltip>

    


<Box sx={{ display:'flex', flexDirection:{xs:'column', md:'column'},width:'100%', alignItems:'center',justifyContent:'center', paddingTop:'10px',}}>

    
      {/* <div className='body-content'> */}
      
        {/* <Box sx={{ display: 'flex', gap: '10px', mt: 5, justifyContent: 'end', flexWrap: 'wrap', flexDirection:'column' }}> */}
        
        {/* flex container */}
        
        {/* <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'}, justifyContent:'space-between', Padding:'12px', maxWidth:'400px'}}> */}

         {/* ip button */}

         {/* <button className='ip-btn' style={{backgroundColor:'#FE791A' ,color:'white', height:'30px', border:'none'}}  onClick={openIpTool}>IP Info Tool</button> */}
      
      {/* for opening the ip tool */}
       
        {openIP  && !openModal  &&(
          <Box sx={{
            display:'flex',
            justifyContent:'center',
            width:'100%',
            
          }}>

          <IPAddress handleOnClose={handleClose}/>
        </Box>
        )}
      
      
        {/* input filed button n select field flex container */}

<div data-animate='fade-up' className='box-coll' style={{flex:'0 0 50%'}}>

  {/* <div style={{display:'flex', justifyContent:'space-between'}}> */}
  <div className='img'>

  
<div style={{display:'flex', flexDirection:'row', alignItems:'center', width:"100%"}}>


<img src={mag} alt='img'/>
 <h2 style={{color:'white'}}>Introduction to DNS Propagation tool</h2>
</div>


<div style={{width:'70%', display:'flex', textAlign:'start',marginLeft:'22%', padding:'3px', borderLeft:'3px solid white', color:'white'}}>

    <p>The DNS Propagation Tool is a web-based utility designed to assist users in monitoring and troubleshooting DNS-related issues. It provides real-time insights into DNS record propagation across global servers and checks if a domain or IP is listed on common blacklists. </p>
</div>
<br/>
 <br/>
 </div>
 <br/>
 
              </div>
              {/* </Box> */}
            {/* </div> */}
        {/* </Box> */}

          </Box>
       
        <Box data-animate='fade-up' sx={{width:'100%', display:'flex', justifyContent:'center', gap:'10px', flexDirection:{xs:'column', md:'row'} }}>
<Box sx={{width:'100%'}}>
  <IPInfo/>
</Box>

        <Box sx={{width:'100%', maxWidth:'1300px', alignItems:'center', }} > 

        <InfoPage />
        </Box>
        </Box>
{/* search field */}
        <div id='dns-search' ref={searchRef} style={{alignTtems: 'center'
}}>
        <Box
component={Paper}
sx={{
  width:{xs:'90%', md:'100%'},
  maxWidth:'1300px',
  padding:'10px',
  minHeight:'150px',
  display:'flex',
  flex:'0 0 50%',
  backgroundColor:'#007BFF',
  flexDirection:'column',
  margin:"0 auto",
  justifyContent:'center',
  alignItems: 'center',
  borderRadius:'5px',
  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
}}>

<div style={{
  width:'100%',
  textAlign:'center',
  padding:'3px',
  
  
}}>
 
 <h2 style={{color:'white'}}>Search domain here</h2>
 </div>

         <div className='field-dns' style={{display:'flex', gap:'10px' }}>


          <input
         placeholder='Enter domain e.g. example.com'
         type="text"
         id='domain'
         className='domain-input'
         value={domain}
         onChange={(e) => setDomain(e.target.value)}
         sx={{ maxWidth: '400px', width: '100%' }}
         onKeyDown={(e)=>{
           if(e.key === 'Enter' && !loading){
             e.preventDefault()
             check();
            }
          }}
          />
      
        
        {/* select container */}
          <select
className='select-domain'
value={recordType}
onChange={(e) => setRecordType(e.target.value)}

>
            <option value='A'>A</option>
            <option value='AAAA'>AAAA</option>
            <option value='CNAME'>CNAME</option>
            <option value='MX'>MX</option>
            <option value='NS'>NS</option>
            <option value='TXT'>TXT</option>
          </select>
        
      {/* searc button */}
        <button className='search-btn'
            onClick={check} 
            onKeyDown={(e)=>{
              if(e.key === 'Enter' || e.key === ''){
                e.  preventDefault(); 
                check();
              }
            }}
            style={{
              backgroundColor:'#FE791A',
              width:'100%',
              border:'1px solid black',
              borderRadius:'4px',
              fontSize:'larger',
              textAlign:'center'
            }}           
            >

            {loading ? 'Checking...' : 'Check'}
          </button>
            </div>
              </Box>
              </div>
       
        <div className='container'>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', gap: '10px' }}>
            {loading ? (
              <Box sx={{
                textAlign: 'center',
                position: 'absolute',
                top: '60%',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '40vh',
                width: '100%'
              }}>
                <CircularProgress size={60} />
              </Box>
            ) : result ? (
              <>
            
            
               {/* table part */}


                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                  <TableContainer component={Paper} sx={{
                    fontSize:'16px'
                  }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#FE791A' }}>
                          <TableCell align='center'><strong>Resolver</strong></TableCell>
                          <TableCell align='center'><strong>Country</strong></TableCell>
                          <TableCell align='center'><strong>IP</strong></TableCell>
                          <TableCell align='center'><strong>Status</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.Propagation?.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell align='center'>{r.resolver}</TableCell>
                            <TableCell align='center'>{r.loc}</TableCell>
                            <TableCell align='center'>{r.answers?.length ? r.answers.join(', ') : '-'}</TableCell>
                            <TableCell align='center'>{r.answers?.length ? '✅ Success' : r.error || 'No record found'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <br />
<Button onClick={() => setOpenModal(true)} sx={{ mt: 2, backgroundColor:'#FE791A' , color:'white' }}>See Blacklist</Button>



 {/* blacklist part */}


{openModal && result.blacklist?.length > 0 && (
  <Box 
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      backgroundColor: 'rgba(0,0,0,0.51)',
      zIndex: 1300,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Paper
      sx={{
        width: '100%',
        maxWidth: '900px',
        padding: '20px',
        borderRadius: '12px',
        position: 'relative',
        backgroundColor: '#fff',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Close Button */}
      <Button
        onClick={() => setOpenModal(false)}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '18px',
          color: '#000',
        }}
      >
        ❌
      </Button>

      {/* Title */}
      <Box sx={{ padding: '20px 16px 8px 16px', textAlign: 'center' }}>
        <Typography variant='h6' fontWeight='bold'>
          Blacklist Results
        </Typography>
      </Box>

      {/* Scrollable Table */}
      <Box sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
        <Table stickyHeader>
          <TableHead 
            
          >
            <TableRow >
              <TableCell sx={{backgroundColor:'#FE791A'}} align='center'>IP</TableCell>
              <TableCell sx={{backgroundColor:'#FE791A'}} align='center'>Blacklist</TableCell>
              <TableCell sx={{backgroundColor:'#FE791A'}} align='center'>Listed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.blacklist.map((b, i) => (
              <TableRow key={i}>
                <TableCell align='center'>{b.ip || '-'}</TableCell>
                <TableCell align='center'>{b.zone}</TableCell>
                <TableCell align='center'>
                  {b.listed ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>❌</span>
                  ) : (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>✅</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  </Box>
)}


                    
                </Box>
                
                {/* map part */}
          
{!openModal && !openIP &&(
  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
    {result && <Mapview data={result.Propagation} />}
  </Box>
)}


              </>
            ) : null}
          </Box>
        </div>
      {/* </div> */}
           

      <Snackbar
        open={SnackbarOpen}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'down' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {SnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
