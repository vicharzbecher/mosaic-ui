const localtunnel = require('localtunnel');
require('dotenv').config();


const port = process.env.PORT || '3000';

const subdomain = process.env.DEV_URL || 'mosaic-ui';

localtunnel(port, { subdomain }, (err, tunnel) => {
  if (err) throw err;

  if (!tunnel.url.includes(subdomain)) console.log('Required Public URL unavailable.');
  console.log(`Public URL: ${tunnel.url}`);
});
