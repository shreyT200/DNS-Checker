import React, { useState } from 'react';
import { api } from '../services/api';
import Mapview from './Mapview';
import mag from '../assest/pngegg (1).png'

import './all.css';
import {
  Box,
  // TextField,
  // Select,
  // MenuItem,
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
  CircularProgress
} from "@mui/material";
import IPAddress from './IPAddress';
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
      <div className='banner'>
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
      </div>
<Box sx={{ display:'flex', flexDirection:{xs:'column', md:'column', justifyContent:'center', alignItems:'center', width:'100%', boxSizing:'border-box', maxWidth:'column', paddingTop:'10px'}}}>

      {/* <div className='body-content'> */}
      
        {/* <Box sx={{ display: 'flex', gap: '10px', mt: 5, justifyContent: 'end', flexWrap: 'wrap', flexDirection:'column' }}> */}
        
        {/* flex container */}
        
        {/* <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'}, justifyContent:'space-between', Padding:'12px', maxWidth:'400px'}}> */}

         {/* ip button */}

         {/* <button className='ip-btn' style={{backgroundColor:'#FE791A' ,color:'white', height:'30px', border:'none'}}  onClick={openIpTool}>IP Info Tool</button> */}
      
      {/* for opening the ip tool */}
       
        {openIP  && !openModal  &&(
          <IPAddress handleOnClose={handleClose}/>
        )}
      
      
        {/* input filed button n select field flex container */}

<div className='box-coll'>

  {/* <div style={{display:'flex', justifyContent:'space-between'}}> */}
  <div className='img'>



 <h2>Introduction to DNS Propagation tool</h2>
<img src={mag} alt='img'/>

  </div>
 <div style={{
  borderBottom:'2px dashed black'
 }}>

    <p>The DNS Propagation Tool is a web-based utility designed to assist users in monitoring and troubleshooting DNS-related issues. It provides real-time insights into DNS record propagation across global servers and checks if a domain or IP is listed on common blacklists. It also provides with <sapn><button className='ip-btn' onClick={openIpTool}>IP to Address</button></sapn> tool</p>
  
 <br/>
 </div>
 <br/>
 <div style={{
  width:'100%',
  textAlign:'center',
  padding:'3px',
 

 }}>
 
 <h3>Search domain here</h3>
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
              </div>
              {/* </Box> */}
            {/* </div> */}
        {/* </Box> */}

        <br />
        <div className='container'>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-evenly', gap: '10px' }}>
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
  <Box sx={{zIndex:1000, position:'absolute', display:'flex', top:0, left:0, width:'100%', overflowX:'hidden'}}>
<TableContainer component={Paper}>
    <div style={{display:'flex', flexDirection:'column',}}>

    <Button onClick={()=>setOpenModal(false)} sx={{fontSize:'16px', display:'flex', marginLeft:{md:'95%', xs:'87%'},}}>❌</Button>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#FE791A' }}>
          <TableCell align='center'>IP</TableCell>
          <TableCell align='center'>Blacklist</TableCell>
          <TableCell align='center'>Listed</TableCell>
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
    
        </div>
  </TableContainer>
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
      </Box>

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
