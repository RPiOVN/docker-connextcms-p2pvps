# docker-connextcms-p2pvps

This repository is a collection of Docker files, orchestrated to work together using Docker Compose,
in order to support and run the [P2P VPS Server](https://github.com/RPiOVN/p2pvps-server). The software
stack can be illustrated as below, and you can read all the details in [the specifications](specifications).

![Software Stack](https://github.com/RPiOVN/p2pvps-server/blob/b1fd8e709f264db4a1d869e8939033ca39a895da/specifications/images/software-stack.jpg?raw=true "Software Stack")

Note: This repository was originally forked from the [docker-connextcms](https://github.com/christroutner/docker-connextcms) parent repository.
It upgrades the ConnextCMS docker container to use v8 of node.js.


## Installation
It's assumed that you are starting with a fresh installation of Ubuntu 16.04 LTS on a 64-bit machine. 
It's also assumed that you are installing as a [non-root user with sudo privileges](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04). 

1. Install Docker on the host system. [This tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
shows how to install Docker on a Ubuntu 16.04 system. It's specifically targeted to Digital Ocean's cloud servers, but
should work for any Ubuntnu system.
Use [this link](https://m.do.co/c/8f47a23b91ce) to sign up for a Digital Ocean account and get a $10 credit, capable of
running a $5 server for two months.

2. Install Docker Compose too. [This tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)
shows how to do so on a Ubuntu system.

3. Clone this repository in your home directory with the following command:
`git clone https://github.com/RPiOVN/docker-connextcms-p2pvps`

* Enter the new `docker-connextcms-p2pvps` directory, then initialize the repository by running `./init`.

4.  Enter the `openBazaar` subdirectory.
Build the OpenBazaar Docker images by running `./buildImage`.

5. Enter the `docker-connextcms-p2pvps/sshd-container` directory and build that image with
`./buildImage`.

6. Enter the `docker-connextcms-p2pvps` directory and build the ConnextCMS docker container. 
The `--no-cache` option should be used to prevent issues with symbolic links:
`docker-compose build --no-cache`

7. Bring all the containers online by running the following command:
`docker-compose up`. It will take a couple minutes. Wait until you see the following notice from KeystoneJS:
```
 ------------------------------------------------
| KeystoneJS Started:
| keystone4 is ready on http://0.0.0.0:3000
| ------------------------------------------------  
```

8. The previous step will also initialize OpenBazaar. Bring the containers down by hitting `Ctrl-C`.
Once back to a command line, run `docker-compose down` to clean up. Then navigate to the the `openBazaar` directory.

9. Customize the config file and then copy it into the data directory with `sudo cp config data/`.
The current config file has username/password set as `yourUsername/yourPassword`, and no SSL encryption
on connection. Both of these should be updated.

* Go back to the `docker-connextcms-p2pvps` directory and run the containers again with 
`docker-compose up`. Verify that everything runs correctly. Then you can bring them back down
 again with `docker-compose up -d`.
 
* Go back to your home directory and clone the `p2pvps-server` repo. Compile the marketplace code
with `npm install`. Then generate the site template with `./generateSiteTemplate`. Finally, copy the
site template with `./uploadToConnextCMS`.

* You can now bring the server online with one final `docker-compose up -d` in the `docker-connextcms-p2pvps`
directory.

Docker will then launch the ConnextCMS Docker image. At the end, KeystoneJS will be running on port 3000, 
with ConnextCMS running with it. For additional information on how to setup a production server with this container,
[see the three-part video series on ConnextCMS.com](http://connextcms.com/page/videos).

You can also follow [these nginx instructions](nginx/README.md) to setup nginx in front of your Docker container
in order to forward traffic from port 80 (the normal web browser port) to port 3000, and also how to install
an SSL certificate from Let's Encrypt for implementing HTTPS.

## Docker Debugging
The following commands are useful for debugging applications like this one inside a Docker container. The commands
below help you to enter a shell inside the container.

* `docker build -t test-container .`
  * This command will build a Docker image from the Dockerfile in the current directory.

* `docker ps -a`
  * Show all docker processes, including ones that are stopped.

* `docker container run --name test-container --rm -it <Image ID> bash`
  * This command will run a docker container and drop you into a bash shell. All you need is the image ID.

* `docker exec -it <container ID> bash`
  * This command will let you enter a bash shell inside a running Docker container.


# License
MIT License

Copyright (c) 2017 Skagit Publishing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
