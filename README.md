## Make It Happen

"Make It Happen" - is an online app, which helps you to plan your days and achieve more. When signing up to "Make It Happen", online organizer will get a schedule that is powerful & flexible enough to help you get much more done. This is an online calendar based solution for your total time management. Handy for tracking your progress and maintain life balance between family, health, friends and career.

## Before You Begin
We use MEANJS stack that includes:
* MongoDB
* Express
* AngularJS
* Node.js

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
  * Node v5 IS NOT SUPPORTED AT THIS TIME! 
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

## Getting Started
Just clone the repo and install the necessary node modules:
```bash
$ git clone https://git.epam.com/anna_pavlova/epmkhrdmh
$ npm install              # Install Node modules listed in ./package.json and Bower modules (may take a while the first time)
$ gulp                     # Run server
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

## Running your application with Gulp

After the install process, you can easily run your project with:

```bash
$ gulp
```
or

```bash
$ gulp default
```

The server is now running on http://localhost:3000 if you are using the default settings. 

### Running Gulp Development Environment

Start the development environment with:

```bash
$ gulp dev
```

### Running in Production mode
To run your application with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

### Testing Your Application with Gulp
Using the full test suite included with MEAN.JS with the test task:

### Run all tests
```bash
$ gulp test
```

### Run server tests
```bash
gulp test:server
```

### Run client tests
```bash
gulp test:client
```

### Run e2e tests
```bash
gulp test:e2e
```

## Development and deployment With Docker

* Install [Docker](https://docs.docker.com/installation/#installation)
* Install [Compose](https://docs.docker.com/compose/install/)

* Local development and testing with compose:
```bash
$ docker-compose up
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
