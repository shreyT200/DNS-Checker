import React from 'react'

export default function InfoPage() {
  return (
    <div style={{
        backgroundColor:'#007BFF',
        color:'white',
        fontSize:'18px',
        padding:'10px',
        borderRadius:'9px',
        paddingBottom:'25px',
     
    }}>

    <div style={{textWrap:'pretty', width:'100%',    }}>
<div className='z'>

    <div className='title'>
      <h1>What is a DNS Checker and How It Is Useful</h1>
    </div>
    <br/>
  <div className='q1-block'>

    <div className='title-2'>
        <h3>
            What is a DNS Checker?
        </h3>

        <p>A DNS checker is a tool that verifies the status and accuracy of Domain Name System (DNS) records for a given domain. It queries multiple DNS servers worldwide to check how a domain's DNS information (e.g., A, MX, CNAME records) is propagated and resolved into IP addresses. This helps users confirm that DNS changes, such as updates to hosting or email settings, are correctly applied across the internet.</p>
  </div>
  <br/>
    </div>
   <div className='q2-block'>
    <div className='title-3'>
        <h3>How It Is Useful</h3>
    </div>
    <p>
  <br/>
       <p>
        <b>Troubleshooting: </b>
        </p> 
        <p>

        Identifies delays or errors in DNS propagation, helping resolve issues like website downtime or email delivery problems.</p>
        </p>
        <br/>
    <p>
       <b>Verification: </b>
    </p>
<p>

       Ensures DNS records are correctly configured and accessible globally after updates. 
</p>
        <br/>
    <p>
        <b>Performance Monitoring: </b>
    </p>
     <p>

        Detects inconsistencies across servers, improving website reliability and user experience.
     </p>
     
   </div>
</div>
   
    </div>
    </div>

  
  )
}
