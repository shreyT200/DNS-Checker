import React, { useState, useRef, useLayoutEffect } from 'react';
import { api } from '../services/api';
import { RadarChart } from '@mui/x-charts/RadarChart';
import dom from '../assest/453357-PF8X5S-149 (1).png';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Button,
  TableHead,
} from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Fab, Tooltip } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DNSHealthinfo from './DNSHealthinfo';
import CircularProgress from '@mui/material/CircularProgress';

export default function DomainScan() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [loading, setLoading] = useState(false);


const handleCheck = async () => {
    if (!domain.trim()) {
      setSnackbarOpen(true);
      setSnackbarMessage('Enter valid domain');
      setSnackbarSeverity('warning');
      return; // Exit early if domain is empty
    }
    setLoading(true);
    setResult(null);

    
    try {
      const { data } = await api.get(`/scan?domain=${domain}`);
      setResult(data);
    } catch (err) {
      console.error('Error fetching the data', err);
      setSnackbarOpen(true);
      setSnackbarMessage('Failed fetching the data');
      setSnackbarSeverity('error');
    } finally {
   
        setLoading(false);
    }
  };

  const chartData = result
    ? [
        { metric: 'SPF', value: result.spf ? 2 : 0 },
        { metric: 'DKIM', value: result.dkim ? 2 : 0 },
        { metric: 'DMARC', value: result.dmarc ? 2 : 0 },
        { metric: 'MTA-STS', value: result.mtaSts ? 2 : 0 },
      ]
    : [];

  gsap.registerPlugin(ScrollTrigger);
  const bannerRef = useRef();
  const searchRef = useRef();
  const fabRef = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (bannerRef.current) {
        tl.from(bannerRef.current, { y: -100, opacity: 0, duration: 0.9 });
      }
      if (searchRef.current) {
        tl.from(
          searchRef.current,
          { opacity: 0, scale: 1.2, duration: 0.8 },
          '>-0.2'
        );
      }
      if (fabRef.current) {
        tl.from(fabRef.current, { opacity: 0, y: 20, duration: 0.4 }, '>-0.2');
      }

      gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const check = result
    ? [
        { name: 'A Lookup', ok: !result.records.A.error },
        { name: 'MX Lookup', ok: !result.records.MX.error },
        { name: 'NS Lookup', ok: !result.records.NS.error },
        { name: 'TXT Lookup', ok: !result.records.TXT.error },
        {
          name: 'Propagation',
          ok: result.propagation && Array.isArray(result.propagation)
            ? result.propagation.every((p) => p.ok)
            : false,
        },
        { name: 'DNSSEC', ok: result.dnssec || false },
      ]
    : [];

  const passed = check.filter((c) => c.ok).length;
  const scorePct = Math.round((passed / check.length) * 100);
  const score10 = Math.round((passed / check.length) * 10);

  return (
    <>
      <Tooltip title="Go to Domain Search" arrow>
        <Fab
          ref={fabRef}
          color="error"
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}
          onClick={() =>
            document.getElementById('res')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <ArrowDownwardIcon />
        </Fab>
      </Tooltip>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>



        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
          <div data-animate="fade-up" className="box-coll">
            <div className="img">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  marginLeft: { xs: '', md: '9%' },
                }}
              >
                
                
                <img
                  id="image-domain"
                  src={dom}
                  alt="img"
                  onClick={() =>
                    document.getElementById('res')?.scrollIntoView({ behavior: 'smooth' })
                  }
                />
                <h2 style={{ color: 'white' }}>Introduction to DNS Health Checker</h2>
              </Box>
            
            
            
              <Box
                data-animate="fade-up"
                sx={{
                  width: '70%',
                  display: 'flex',
                  textAlign: 'start',
                  marginLeft: { xs: '30%', md: '17%' },
                  padding: '3px',
                  borderLeft: '3px solid white',
                  color: 'white',
                }}
              >
                <p>
                  A DNS health checker is a diagnostic tool that evaluates a Domain Name
                  System (DNS) setup’s performance, configuration, and security...
                </p>
              </Box>
            </div>
          </div>
        </Box>

        {/* DNS Health Info Section */}
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Box data-animate="fade-up" sx={{ width: '100%', maxWidth: '1300px' }}>
            <DNSHealthinfo />
          </Box>
        </Box>

       
       
       
        {/* Search and Results Section */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '1370px' }}>
            <Box sx={{ padding: 4 }}>
              <div id="dns-search" ref={searchRef}>
                <Paper
                  sx={{
                    padding: 3,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    marginBottom: 4,
                    boxShadow:
                      'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                  }}
                >
                  <TextField
                    label="Enter Domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    fullWidth
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCheck();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCheck}
                    disabled={loading}
                    sx={{ backgroundColor: '#FE791A', minWidth: '100px' }}
                  >
                    {loading ? 'Checking...' : 'Check'}
                  </Button>
                </Paper>
              </div>

              {/* Results and Loading Indicator Container */}
              <Box sx={{ position: 'relative', minHeight: '40vh' }}>
                
                {loading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress size={60} />
                  </Box>
                ) : result ? (
                  <>
                    <Paper sx={{ p: 2, mb: 4 }} data-animate="fade-up">
                     <Box sx={{backgroundColor:'#007BFF', width:'100%', color:'white'}}>

                      <Typography variant="h3" align="center" >
                        DNS Security Score: {scorePct}%
                      </Typography>
                      <Typography variant="h5" align="center">
                        ({score10}/10)
                      </Typography>
                     </Box>
                      <Box sx={{ display: 'flex', width:'100%',
                       flexDirection:{xs:'column', md:'row'} ,justifyContent: 'center', gap: 2, mt: 1 }}>
                        {check.map((c) => (
                          <Box key={c.name} sx={{ textAlign: 'center' }}>
                            <Typography variant="h7">{c.name}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>

                    <Paper sx={{ p: 2, mb: 4 }}>
                      <Typography sx={{backgroundColor:'#007BFF', color:'white'}}variant="h3" gutterBottom>
                        DNS Health details for {result.domain}
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align='center'>Features</TableCell>
                              <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align='center'>Info/Time (ms)</TableCell>
                              <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align='center'>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {['A', 'MX', 'NS'].map((type) => (
                              <TableRow key={type}>
                                <TableCell align='center'>{type} Lookup</TableCell>
                                <TableCell align='center'>{result.records[type].duration} ms</TableCell>
                                <TableCell align='center'>✅</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell align='center'>TXT Lookup</TableCell>
                              <TableCell align='center'>{result.records.TXT.duration} ms</TableCell>
                              <TableCell align='center'>✅</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align='center'>Propagation (A)</TableCell>
                              <TableCell align='center'>
                                {result.propagation.every((p) => p.ok) ? '✅' : '⚠️'}
                              </TableCell>
                              <TableCell align='center'>
                                {result.propagation
                                  .map((p) => `${p.name}:${p.ok ? 'OK' : 'NG'}`)
                                  .join(', ')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align='center'>DNSSEC</TableCell>
                              <TableCell align='center'>{result.dnssec ? '✅' : '❌'}</TableCell>
                              <TableCell align='center'>—</TableCell>
                            </TableRow>
                          </TableBody>
                    
                    
                        </Table>
                      </TableContainer>
                    </Paper>

                    <div id="res">
                      <Paper sx={{ padding: 3, marginBottom: 4 }}>
                        <Typography sx={{backgroundColor:"#007BFF", color:'white'}} variant="h3">
                          Scan Result for {result.domain}
                        </Typography>
                      
                      
                        <Box sx={{ overflowY: 'auto', width: '100%', mt:2 }}>
                         
                         
                         
                          <Table>
                            <TableContainer sx={{ width: '100%' }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align="center">MX Record</TableCell>
                                  <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align="center">SPF</TableCell>
                                  <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align="center">DMARC</TableCell>
                                  <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align="center">DKIM</TableCell>
                                  <TableCell sx={{backgroundColor:'#FE791A', color:'white'}} align="center">MTA-STS</TableCell>
                                </TableRow>
                              </TableHead>
                            
                            
                            
                              <TableBody>
                                <TableRow>
                                  <TableCell align="center">
                                    {result.mx?.join(',') || 'None'}
                                  </TableCell>
                                  <TableCell align="center">
                                    {result.spf || 'Not Found'}
                                  </TableCell>
                                  <TableCell align="center">
                                    {result.dmarc || 'Not found'}
                                  </TableCell>
                                  <TableCell align="center">
                                    {result.dkim || 'Not found'}
                                  </TableCell>
                                  <TableCell align="center">
                                    {result.mtaSts ? 'Available' : 'Not found'}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </TableContainer>
                          </Table>
                        </Box>
                      </Paper>
                    </div>



                    <Paper
                      sx={{
                        padding: 2,
                        marginTop: 4,
                        boxShadow:
                          'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                      }}
                    >
                      <Typography variant="h4" gutterBottom align="center" sx={{backgroundColor:'#007BFF', color:'white'}}>
                        Email Security Report
                      </Typography>
                      <RadarChart
                        height={300}
                        series={[{ label: 'Implemented', data: chartData.map((d) => d.value) }]}
                        radar={{
                          metrics: chartData.map((d) => ({ name: d.metric, max: 3 })),
                        }}
                      />
                    </Paper>
                  </>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}