import React from 'react'
import Porpagation from './components/Propagation'
import './App.css'
import { Button, Box } from '@mui/material'
// import IPAddress from './components/IPAddress'
export default function App() {

  return (
    <>
<Box sx={{display:'flex', flexDirection:'column', gap:'40px'}}>

<Porpagation/>
  {/* <Button sx={{
    backgroundColor:'#007BFF',
    color:'white',
    width:'200px'
  }} onClick={()=> setOpenModal(true)} >Ip Info tool</Button>
    {openModal&&(
      
      <IPAddress handleOnClose={handleOnClose}/>
    )} */}
    </Box>
    </>
  )
}
