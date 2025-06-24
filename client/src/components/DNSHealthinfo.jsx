import React from 'react'

export default function DNSHealthinfo() {
  return (
    <div
    style={{
         backgroundColor:'#007BFF',
        color:'white',
        fontSize:'18px',
        borderRadius:'9px',
        padding:'10px',
        display:'flex',
        gap:'10px'
    }}
    >
        <div 
        style={{
        textWrap:'pretty', width:'100%'
    }}
        >

        <div className='dnsinfo-head'>
            <div>
                <h1>What is a DNS Health Checker?</h1>

            </div>
            <p>
                A DNS health checker is a tool that evaluates the status, performance, and configuration of Domain Name System (DNS) servers and records for a given domain. DNS is critical for translating domain names (like example.com) into IP addresses, ensuring websites load, emails deliver, and network services function properly. A health checker helps identify issues that could disrupt these processes.
            </p>
        </div>
        <div className='body-dns'>
            <div>
                <h3>Key Features of a DNS Health Checker</h3>
            </div>
            <p>
                <b>
                   DNS Record Queries:-
                </b>
            </p>
            <p>
                Verifies the correctness of records like A (address), MX (mail exchange), NS (name server), and TXT (e.g., SPF or DKIM).
            </p>
            <p>
                <b>
                    Response Time Measurement:-
                </b>
            </p>
            <p>
                Measures how fast DNS servers respond, since slow responses can degrade website performance.
            </p>
            <p>
                <b>
                    Propagation Checks:-
                </b>
            </p>
            <p>
                Confirms whether DNS changes have fully updated across the internet, which is vital after modifications.
            </p>

        </div>
      
        </div>
    </div>
  )
}
