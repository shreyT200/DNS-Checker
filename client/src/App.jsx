import React, { useState } from 'react'
import Porpagation from './components/Propagation'
import './App.css'
import IPAddress from './components/IPAddress'
export default function App() {
  const [openModal, setOpenModal] = useState(false);
const handleOnClose =()=>{
  setOpenModal(false)
}
  return (
    <>
      <Porpagation/>
  <button onClick={()=> setOpenModal(true)} >Ip Info tool</button>
    {openModal&&(
      
      <IPAddress handleOnClose={handleOnClose}/>
    )}
    </>
  )
}
