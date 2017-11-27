# Specifications
The docker-connextcms-p2pvps repository is a collection of Docker containers, all orchestarted using
Docker Compose. The collection of Docker containers is illustrated as follows:

![Software Stack](https://github.com/RPiOVN/p2pvps-server/blob/b1fd8e709f264db4a1d869e8939033ca39a895da/specifications/images/software-stack.jpg?raw=true "Software Stack")

Here is a brief description of each Docker container:
* ConnextCMS is an installation of [ConnextCMS](http://connextcms.com) that has been customized with the
[P2P VPS Server software](https://github.com/RPiOVN/p2pvps-server).
* MongoDB is a vanilla MongoDB Docker image. It's used by ConnextCMS.
* OpenBazaar is an [OpenBazaar 2.0 server](https://github.com/OpenBazaar/openbazaar-go) for listing
device rentals on the OpenBazaar marketplace.
* SSH Server handles reverse-ssh tunnel requests, which allows Renters to connect to an SSH shell on the Client device.
* LocalTunnel is a local installation of [Local Tunnel Server](https://github.com/localtunnel/server) allowing
Client devices to server webpages of HTTP and HTTPS over a subdomain of the server.
* Listing Manager is a node.js application that manages P2P VPS listings on the Open Bazaar network.


