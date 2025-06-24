import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Propagation from './components/Propagation';
import DomainScan from './components/DomainScan';
import { Box, Button } from '@mui/material';
import IPAddress from './components/IPAddress';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <Box sx={{ display: 'flex', gap: 2, p: 2, background: 'blue' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button sx={{fontSize:{xs:'8px', md:'15px'}, width:{xs:'50px', md:'200px'}}} variant="contained">DNS Propagation</Button>
        </Link>
        <Link to="/domain-scan" style={{ textDecoration: 'none' }}>
          <Button sx={{fontSize:{xs:'8px', md:'15px'}, width:{xs:'50px', md:'200px'}}} variant="contained">Domain Scanner</Button>
        </Link>
        <Link to='/ip-info' style={{textDecoration:'none'}}>
        <Button  sx={{fontSize:{xs:'8px', md:'15px'}, width:{xs:'100px', md:'210px'}}}  variant='contained'> IP to Address Finder</Button>
        </Link>
      </Box>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Propagation />} />
        <Route path="/domain-scan" element={<DomainScan />} />
        <Route path="/ip-info" element={<IPAddress />} />
      </Routes>

    </BrowserRouter>
  );
}
