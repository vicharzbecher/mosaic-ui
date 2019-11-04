const localtunnel = require('localtunnel');

const port = process.env.PORT || '3000';

const subdomain = process.env.REACT_APP_DEV_URL || 'mosaic-ui';

localtunnel(port, { subdomain }, (err, tunnel) => {
  if (err) throw err;

  if (!tunnel.url.includes(subdomain)) console.log('Required Public URL unavailable.');
  console.log(`Public URL: ${tunnel.url}`);
});
