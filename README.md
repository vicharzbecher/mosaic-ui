
To make your localhost accessible anywhere install Localtunnel globally (requires NodeJS) 

npm install -g localtunnel

Start a webserver on some local port (eg http://localhost:8080) and use the command line interface to request a tunnel to your local server:

lt --port 8080 --subdomain mosaic

You will receive a url, for example https://mosaic.localtunnel.me, that you can share with anyone for as long as your local instance of lt remains active. Any requests will be routed to your local service at the specified port.

API ENDPOINT

https://mosaic.localtunnel.me/users