## Description

Generic TS based deck-service to deal and manage french playing cards

## Installation

```bash
$ git clone <this-repo>
$ npm install
```

## Running the app

```bash
$ docker build -t deck-service .
$ docker-compose up
```

Then proceed to usage section

Alternatively, if you would like to run the app locally, and node_modules fail to install, it might be a node version issue (I used node 16)
In this case, install nvm with:

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Then follow the instructions provided to make 'nvm' command available within your terminal
Then,

```bash
$ nvm install 16.15.0
$ nvm use 16.15.0
$ npm i
$ npm run dev
```

and run a generic mongo container on port 27017 within docker

## Usage

Simply visit the [swagger documentation](http://localhost:3000/documentation) to see all available endpoints and their required parameters

You can connect to the mongodb instance within a GUI for mongo with connection string 'mongodb://localhost:27017'

Main DB => db
Test DB => test-db

## Standard User Story:

I've added comments within the code base for any other shortcomings in the system design that would be detrimental in a production grade repo.
