# Specifications
The docker-connextcms-p2pvps repository is a collection of Docker containers, all orchestarted using
Docker Compose. The collection of Docker containers is illustrated as follows:

![Software Stack](https://github.com/RPiOVN/p2pvps-server/blob/b1fd8e709f264db4a1d869e8939033ca39a895da/specifications/images/software-stack.jpg?raw=true "Software Stack")

Here is a brief description of each Docker container:
* ConnextCMS is an installation of [ConnextCMS](http://connextcms.com) that has been customized with the
[P2P VPS Server software](https://github.com/RPiOVN/p2pvps-server).
* MongoDB is the database used by ConnextCMS.
* OpenBazaar is an [OpenBazaar 2.0 server](https://github.com/OpenBazaar/openbazaar-go) for listing
device rentals on the OpenBazaar marketplace.
* SSH Server handles reverse-ssh tunnel requests, which allows Renters to connect to an SSH shell on the Client device.
* LocalTunnel is a local installation of [Local Tunnel Server](https://github.com/localtunnel/server) allowing
Client devices to server webpages of HTTP and HTTPS over a subdomain of the server.
* Listing Manager is a node.js application that manages P2P VPS listings on the Open Bazaar network.


## SSH Tunnel Server
The SSH tunnel server will run inside its own Docker container. It is necessary to give user-level shell access
in order to generate the reverse tunnel to the client devices. Keeping the SSH server isolated to it's own
Docker container reduces the threat of giving out shell access.

**It may be possible to allow reverse SSH connections without granding shell access to the server. Exploring this 
option needs to be a high priority.**

## LocalTunnel - HTTP/S Forwarding
The LocalTunnel server is also responsible for establishing a subdomain (like **abc**.p2pvps.com) and proxying connections
from port 80 (HTTP) or port 442 (HTTPS) to the rented device. The easiest way to do this is by leveraging
a [LocalTunnel Server](https://github.com/localtunnel/server). 

While the project is still in its infancy, we can use the [localtunnel.me](http://localtunnel.me) server, but
we'll eventually need to set up our own server. The LocalTunnel server software expects to have the server to
itself, without any competition for ports. Putting it inside a Docker container has proven problematic.

## Listing Manager
The listing manager automates the maintenance of OpenBazaar listings that would otherwise require a human to
do in order to maintain an OpenBazaar store. The role of the Listing Manager can be understood best by this
worflow illustration:

![Transaction Worflow](https://github.com/RPiOVN/p2pvps-server/blob/b1fd8e709f264db4a1d869e8939033ca39a895da/specifications/images/workflow.jpg?raw=true "Transaction Worflow")
