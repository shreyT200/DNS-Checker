
const axios = require('axios');

const resolvers = [
  { 
    name: 'Google (US-East)',
    url: 'https://dns.google/resolve',
    coords: [37.751, -97.822],
    flag: 'us',
    loc: 'United States'
  },
  {
    name: 'Cloudflare (EU-Frankfurt)',
    url: 'https://cloudflare-dns.com/dns-query',
    coords: [50.1109, 8.6821],
    flag: 'de',
    loc: 'Germany'
  },
  {
    name: 'NextDNS (Paris, FR)',
    url: 'https://dns.nextdns.io/dns-query',
    coords: [48.856, 2.352],
    flag: 'fr',
    loc: 'France'
  },
  {
    name: 'DNS0.EU (Zurich, CH)',
    url: 'https://zero.dns0.eu/dns-query',
    coords: [47.368, 8.539],
    flag: 'ch',
    loc: 'Switzerland'
  },
  {
    name: 'AliDNS (Hangzhou, CN)',
    url: 'https://dns.alidns.com/resolve',
    coords: [30.274, 120.155],
    flag: 'cn',
    loc: 'China'
  },
  {
    name: 'Cloudflare (Sydney, AU)',
    url: 'https://cloudflare-dns.com/dns-query',
    coords: [-33.868, 151.209],
    flag: 'au',
    loc: 'Australia'
  },
  {
    name: 'AdGuard (Russia, Moscow)',
    url: 'https://dns.adguard.com/resolve',
    coords: [55.7569, 37.6151],
    flag: 'ru',
    loc: 'Russia'
  },
  {
    name: 'AliDNS (China HZ)',
    url: 'https://dns.alidns.com/resolve',
    coords: [30.2741, 120.1552],
    flag: 'cn',
    loc: 'China'
  },

];
const DNSBL_ZONES = [
  'b.barracudacentral.org',
  'zen.spamhaus.org',
  'bl.spamcop.net',
  'dnsbl.sorbs.net',
  'cbl.abuseat.org',
  'psbl.surriel.com',
  'bl.spameatingmonkey.net',
  'bl.ipv6.spameatingmonkey.net',
  'dnsbl.dronebl.org',
  'db.wpbl.info',
  'bl.blocklist.de',
  'rbl.efnetrbl.org',
  'torexit.dan.me.uk',
  'dnsrbl.org',
  'rbl.interserver.net',
  'babl.rbl.webiron.net',
  'noptr.spamrats.com',
  'dyna.spamrats.com',
  'spamrbl.imp.ch',
  'rbl.schulte.org',
  'rbl.realtimeblacklist.com',
  'access.redhawk.org',
  'rbl.ibl.org',
  'dnsbl.inps.de',
  'ix.dnsbl.manitu.net'
];


function reverseIPV4(ip){
return ip.split('.').reverse().join('.');

}


async function checkOneDNSBL(ip, zone) {
  const name = `${reverseIPV4(ip)}.${zone}`;
  try {
    const resp = await axios.get('https://dns.google/resolve', {
      params: { name, type: 'A' },
      headers: { Accept: 'application/dns-json' },
      timeout: 3000
    });

    if (resp.data.Status === 0 && resp.data.Answer?.length) {
      return {
        ip,
        zone,
        listed: true,
        response: resp.data.Answer.map(a => a.data).join(', ')
      };
    } else {
      return {
        ip,
        zone,
        listed: false,
        response: '-'
      };
    }

  } catch (err) {
    return {
      ip,
      zone,
      listed: false,
      response: 'Timeout or error'
    };
  }
}



async function checkResolver(domain, type, resolver) {
  const { name, url, coords, timeout = 3000 } = resolver;
  
  try {
    const params = { name: domain, type };
    const headers = { Accept: 'application/dns-json' };

    const axiosConfig = {
      params,
      headers,
      timeout,
      timeoutErrorMessage: `Timeout after ${timeout}ms`
    };

    // const start = Date.now();
    const resp = await axios.get(url, axiosConfig);
    // const duration =Date.now()- start;
    const answers = resp.data.Answer?.map((a) => a.data) || [];

    return { resolver: name, coords, answers,  loc:resolver.loc, flag:resolver.flag };
  } catch (err) {
    const errorMsg = err.code === 'ECONNABORTED' 
      ? 'Request timed out' 
      : err.response?.statusText || err.message;
    
    return { resolver: name, coords, error: errorMsg, loc:resolver.loc, flag:resolver.flag   };
  }
}

async function propagate(req, res) {
  const domain = req.query.domain;
  const recordType = req.query.type || 'A'; 

  if (!domain) {
    return res.status(400).json({ error: 'domain query parameter is required' });
  }

  try {
    const dig = await axios.get('https://dns.google/resolve',{
      params:{name: domain, type:'A'},
      headers:{Accept:'application/dns-json'}
    })
    const ips = dig.data.Answer?.map(a=> a.data) || []
    const blacklistChecks = await Promise.all(
      ips.flatMap(ip =>
        DNSBL_ZONES.map(zone=>checkOneDNSBL(ip, zone))
      )
    )
    const propagation = await Promise.all(
      resolvers.map(r=> checkResolver(domain, recordType, r))
    )
  

    return res.json({ 
      domain,
      recordType,
      timestamp: new Date().toISOString(),
   ips,
   Propagation:propagation,
   blacklist:blacklistChecks
    });
  } catch (err) {
    console.error('Propagation check failed', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { propagate };