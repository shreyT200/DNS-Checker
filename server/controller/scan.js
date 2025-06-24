const axios = require('axios');
const dns = require('dns').promises;


async function timeResolve(fn){
    const start =Date.now();
    try{
        const result = await fn();
        return{
            duration: Date.now()- start, result
        };
    }catch(e){
        // console.error("error in response time", e)
        return{
            duration: Date.now()- start, error:e.message
        }
    }
}

async function lookupTXT(name) {
  try {
    const records = await dns.resolveTxt(name);
    return records.map(r => r.join(''));
  } catch {
    return [];
  }
}

const RESOLVERS = [
    {name:'Google', url:'https://dns.google/resolve'},
    {name:'Cloudflare', url:'https://cloudflare-dns.com/dns-query'},
    {name:'Quad9', url:'https://dns.quad9.net/dns-query'},

];
async function scanDomain(req, res){
    const domain = req.query.domain;
    if(!domain) 
        {return res.status(400).json({error:"domain required"});}

const [aRec, mxRec, nsRec, txtRec] = await Promise.all([
    timeResolve(()=> dns.resolve4(domain)),
    timeResolve(()=> dns.resolve4(domain)),
    timeResolve(()=> dns.resolve4(domain)),
    timeResolve(()=> lookupTXT(domain)),

])


    let mx =[];
    try{
        mx = await dns.resolveMx(domain);
    } catch{

    }
    let spf = null;
    try{
    const txts = await lookupTXT(domain);          // should be an array or []
    if(Array.isArray(txts)){
        spf = txts.find(t=> typeof t === 'string' && t.toLowerCase().startsWith('v=spf1')) || null;

    }
}catch(e){
    console.error('error looking up', e)
}
    const dmarcTxts = await lookupTXT(`_dmarc.${domain}`)
    const dmarc = dmarcTxts[0] || null

    let dkim = null;
    try{
        const dkimTxts = await lookupTXT(`default._domainkey.${domain}`);
        dkim = dkimTxts[0] || null;

    } catch{

    }
   const propagation = await Promise.all(
    RESOLVERS.map(async ({name, url}) => {
        try {
            const resp = await axios.get(url, {
                params: { name: domain, type: 'A' },
                headers: { Accept: 'application/json' },
            });
            // Check if the DNS resolution was successful
            const isOk = resp.data.Status === 0 && Array.isArray(resp.data.Answer) && resp.data.Answer.length > 0;
            return { name, ok: isOk };
        } catch {
            return { name, ok: false };
        }
    })
);

    




    let mtaSts = null ;
    try{
        const stsTxt = await lookupTXT(`_mta-sts.${domain}`);
        if(stsTxt[0]?.startsWith('v=STSv1')){
            const policyUrl = `https://${domain}/.well-known/mta-sts.txt`;
            const pol = await axios.get(policyUrl,{timeout:4000});
            mtaSts = pol.data.substring(0, 500);

        }
    }
    catch{

    }




return res.json({
    domain,
    mx: Array.isArray(mx) ?  mx.map(m =>m.exchange) : [],
    spf,
    dmarc,
    dkim,
    mtaSts,
    records:{
        
        A: aRec,
        MX: mxRec,
        NS: nsRec,
        TXT: txtRec,
    },
    propagation,

});



}


module.exports = {scanDomain};


// const axios = require('axios');
// const { error } = require('console');
// const dns = require('dns').promises;

// async function lookupTXT(name) {
//     try{
//         const records = await dns.resolveTxt(name);
//         return records.map(r=> r.join(''));

//     } catch{
//         return[]

//     }
// }

// async function scanDomain(req, res){
//     const domain = req.params.domain;
//     if(!domain)
//         return res.status(400).json({
//             error:'domain is required'
//         })
    
//         let mx = [];
//         try{
//             mx = await dns.resolveMx(domain);
//         }catch{

//         }
//         let spf = null;
//         try{
//             const txts = await lookupTXT(domain);
//             spf = txts.find (t=> typeof t === 'string' && t.toLocaleLowerCase().startsWith('v=spf1')) || null;
// console.log('txts:', txts); // Add this
//         } catch{

//         }
//         let dmarc = null;
//         try{
//             const dmarcTxts = await lookupTXT(`_dmarc.${domain}`);
//             dmarc = dmarcTxts[0] || null ;

//         }catch{

//         }
//         let dkim = null;
//         try{
//             const dkimTxts = await lookupTXT(`default._domainkey.${domain}`)
//             dkim = dkimTxts[0] || null;

//         } catch{

//         }
//         let mtaSts = null;
//         try{
//             const stsTxt = await lookupTXT(`mta-sts.${domain}`);
//             if(stsTxt[0]?.startsWith('v=STS1')){
//                 const policyUrl = `https://${domain}/well-known/mts-sts.txt`;
//                 const pol = await axios.get(policyUrl,{timeout:2000});
//                 mtaSts = pol.data.substring(0,500)
//             }
//         } catch{

//         }
//         return res.json({
//             domain,
//             mx: mx.map(m=> m.exchange),
//             spf,
//             dmarc,
//             dkim,
//             mtaSts
//         })

//     }

//     module.exports = {scanDomain}

