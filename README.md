# Make It Happen

"Make It Happen" - is an online app, which helps you to plan your days and achieve more. When signing up to "Make It Happen", online organizer will get a schedule that is powerful & flexible enough to help you get much more done. This is an online calendar based solution for your total time management. Handy for tracking your progress and maintain life balance between family, health, friends and career.

## Before You Begin
Before you begin we recommend you read about the basic building blocks that assemble a MEAN.JS application:
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```
## Running Your Application using Vagrant
1. Download and install Virtual Box  https://www.virtualbox.org/wiki/Downloads
2. Download and install Extensions for Virtual box  https://www.virtualbox.org/wiki/Downloads
3. Download and install Vagrant  https://www.vagrantup.com/downloads.html
4. Download the archive MIH.7z (Please find below)
5. Open the archive and Locate MIH/VM
6. Run command "vagrant up"


> If you have the error 'Vagrant could not detect VirtualBox' try changing environment variable "VBOX_MSI_INSTALL_PATH" to "VBOX_INSTALL_PATH."
> Run command “vagrant ssh”. You will see Welcome to your Vagrant-built virtual machine.


> If you have the error 'ssh executable not found in any directories in the %PATH%' make sure you have path to Git bin, which contains ssh.exe in the PATH environment variable. (C:\Users\User_Name\AppData\Local\Programs\Git\usr\bin)
> Locate cd ../../app


7. Run "grunt

```bash
$ grunt
```


## Running Your Application
After the install process is over, you'll be able to run your application using Grunt. Just run grunt default task:

```bash
$ grunt
```

Your application should run on port 3000, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

## Testing Your Application
You can run the full test suite included with MEAN.JS with the test task:

```
$ grunt test
```

This will run both the server-side tests (located in the app/tests/ directory) and the client-side tests (located in the public/modules/*/tests/).

To execute only the server tests, run the test:server task:

```
$ grunt test:server
```

And to run only the client tests, run the test:client task:

```
$ grunt test:client
```

## Development and deployment With Docker

* Install [Docker](http://www.docker.com/)
* Install [Fig](https://github.com/orchardup/fig)

* Local development and testing with fig:
```bash
$ fig up
```

* Local development and testing with just Docker:
```bash
$ docker build -t mean .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
$
```

* To enable live reload, forward port 35729 and mount /app and /public as volumes:
```bash
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/mean-stack/mean/public:/home/mean/public -v /Users/mdl/workspace/mean-stack/mean/app:/home/mean/app --link db:db_1 mean
```
