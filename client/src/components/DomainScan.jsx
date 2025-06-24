import React, { useState, useRef, useLayoutEffect } from 'react';
import { api } from '../services/api';
import {RadarChart} from '@mui/x-charts/RadarChart'
 import dom from '../assest/453357-PF8X5S-149 (1).png'
import {Box, Typography, Paper, TextField, Table, TableBody, TableContainer, TableCell, TableRow, Button, TableHead} from '@mui/material';
import {Snackbar, Alert} from '@mui/material'
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import {Fab, Tooltip} from '@mui/material'

import {gsap} from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DNSHealthinfo from './DNSHealthinfo';




export default function DomainScan(){
   const [domain, setDomain] = useState('');
   const [result, setResult] = useState(null)
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [SnackbarOpen, setSnackbarOpen] = useState(false);
    const[snackbarSeverity, setSnackbarSeverity] = useState('info');
    



    const handleCheck = async()=>{
        if(!domain.trim()){
            setSnackbarOpen(true);
            setSnackbarMessage("Enter valid domain")
            setSnackbarSeverity('warning')
        
        }
        try{
            const {data} = await api.get(`/scan?domain=${domain}` );
            setResult(data);

        }catch(err){
            console.error('Error fetching the data', err);
            setSnackbarOpen(true);
            setSnackbarMessage("Failed fetching the data")
            setSnackbarSeverity('error');
        }
    }
    const chartData = result ? [
        {metric: 'SPF', value:result.spf ? 2:0},
        {metric: 'DKIM', value:result.dkim ?2:0},
        {metric:'DMARC', value:result.dmarc ? 2:0},
        {metric:'MTA-STS', value: result.mtaSts ?2:0},
    ] :[];

gsap.registerPlugin(ScrollTrigger)
const bannerRef = useRef();
const searchRef = useRef();
const fabRef = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(()=>{
      const tl = gsap.timeline({defaults:{ease:'power3.out'}})
      if(bannerRef.current){
        tl.from(bannerRef.current,{ y:-100, opacity:0, duration:0.9})

      }
      if(searchRef.current){
        tl.from(searchRef.current,{
          opacity:0,
          scale:1.2,
          duration:0.8
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


    return(

<>
<Tooltip title="Go to Domain Search" arrow>
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
      document.getElementById('res')?.scrollIntoView({ behavior: 'smooth' });
      
    }}
  >
    <ArrowDownwardIcon />
  </Fab>
</Tooltip>
<Box sx={{display:'flex', flexDirection:'column', gap:'30px'}}>

<Box sx={{display:'flex', justifyContent:'center', paddingTop:'20px'}}>
    <div data-animate='fade-up' className='box-coll'>
        <div className='img'>
            <Box sx={{display:'flex', flexDirection:'row', width:'100%', alignItems:'center', marginLeft:{xs:'', md:'9%'}
            }}>
            <img id='image-domain' src={dom} alt='img'
            onClick={()=>document.getElementById('res')?.scrollIntoView({behavior:'smooth'})}
            />
            <h2 style={{color:'white'}}>Introduction to DNS Health Checker</h2>
            </Box>
<Box data-animate='fade-up' sx={{width:'70%', display:'flex', textAlign:'start',marginLeft:{xs:'30%', md:'17%'}, padding:'3px', borderLeft:'3px solid white', color:'white'}}>
            <p>A DNS health checker is a diagnostic tool that evaluates a Domain Name System (DNS) setup’s performance, configuration, and security by analyzing DNS records (e.g., A, MX, TXT), checking resolution accuracy, monitoring propagation across global nameservers, measuring response times, and identifying vulnerabilities like missing SPF, DKIM, or DMARC records or potential DNS hijacking risks; used by webmasters, IT admins, and businesses, tools like MXToolbox, DNSstuff, or Pingdom DNS Check provide detailed reports to troubleshoot issues, ensure reliable website and email functionality, optimize performance, and enhance security, helping prevent downtime or cyberattacks.</p>
            </Box>
        </div>
    </div>
</Box>
<Box sx={{
    display:'flex',
    width:'100%',
    justifyContent:'center'
}}>
    <Box data-animate='fade-up' sx={{width:'100%', maxWidth:'1300px'}}>
        <DNSHealthinfo/>
    </Box>
</Box>


<Box sx={{width:'100%', display:'flex', justifyContent:'center'}}>

<Box  sx={{width:'100%', maxWidth:'1370px', }}>
        <Box sx={{padding:4}}>
           <div id= 'dns-search' ref={searchRef}>

            <Paper  sx={{padding:3, display:'flex', gap:2, alignItems:'center', marginBottom:4, boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px', backgroundColor:''}}>
                <TextField d label ='Enter Domain' value={domain} onChange={(e)=> setDomain(e.target.value)} fullWidth/>
                    <Button variant='container' onClick={handleCheck}>Check</Button>

            </Paper>
           
            </div>
           {result && (
               <div id='res'>

 <Paper sx={{ padding: 3, marginBottom: 4 }}>
    <Typography variant="h3">Scan Result for {result.domain}</Typography>
   <Box  sx={{
       overflowY:'auto',
       width:'100%',
       
    }}>

    <Table>
     <TableContainer sx={{width:'100%'}}>
        <TableHead>
            <TableRow >
                <TableCell align='center'>MX Record </TableCell>
                <TableCell align='center'>SPF</TableCell>
                <TableCell align='center'>DMARC</TableCell>
                <TableCell align='center'>DKIM</TableCell>
                <TableCell align='center' rowSpan={4}>MTA-STS</TableCell>
            </TableRow>

        </TableHead>
        <TableBody>
            <TableCell align='center'>{result.mx?.join(',')|| 'None'}</TableCell>
            <TableCell align='center'>{result.spf || 'Not Found'}</TableCell>
            <TableCell align='center'>{result.dmarc || 'Not found'}</TableCell>
            <TableCell align='center'>{result.dkim || 'Not found'}</TableCell>
            <TableCell align='center' rowSpan={4}>{result.mtaSts ? 'Available' : 'Not found'}</TableCell>
        </TableBody>
     </TableContainer>
    </Table>
   </Box>
  </Paper>
</div>
)}
 {result && (
     
     <Paper  sx={{padding:2, marginTop:4, boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'}}>
    <Typography variant='h4' gutterBottom align='center'>
    Email security Report
    </Typography>
    <RadarChart height={300}
    series={[{label:'Implemented', data:chartData.map(d=> d.value) }]}
    radar={{
        metrics: chartData.map(d =>({name: d.metric, max:3})),
        
    }}
    />
    </Paper>
)}
    </Box>

    </Box>
</Box>
</Box>
<Snackbar open={SnackbarOpen} autoHideDuration={4000} anchorOrigin={{vertical:'top', horizontal:'center'}}>
    <Alert severity={snackbarSeverity} onClose={()=> setSnackbarOpen(false)}>
        {snackbarMessage}
    </Alert>
</Snackbar>
</>
    )
}