import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Propagation from './components/Propagation';
import DomainScan from './components/DomainScan';
import { Box, Button, AppBar, Toolbar } from '@mui/material';
import IPAddress from './components/IPAddress';
import './App.css';
export default function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <AppBar sx={{ position:"fixed",  flexDirection:"row", gap: 2,  background: 'blue' }}>
    

        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button sx={{fontSize:{xs:'8px', md:'15px'}, width:{xs:'50px', md:'200px'}, color:"white"}} variant="text">DNS Propagation</Button>
        </Link>
        <Link to="/domain-scan" style={{ textDecoration: 'none' }}>
          <Button sx={{fontSize:{xs:'8px', md:'15px', color:"white"}, width:{xs:'50px', md:'200px'}}} variant="text">Domain Scanner</Button>
        </Link>
        <Link to='/ip-info' style={{textDecoration:'none'}}>
        <Button variant="text"  sx={{fontSize:{xs:'8px', md:'15px', color:"white"}, width:{xs:'100px', md:'210px'}}}  > IP to Address Finder</Button>
        </Link>
      </AppBar>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Propagation />} />
        <Route path="/domain-scan" element={<DomainScan />} />
        <Route path="/ip-info" element={<IPAddress />} />
      </Routes>

    </BrowserRouter>
  );
}
