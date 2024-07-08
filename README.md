# Remote

A smart remote control with button, gesture, text and voice input modes.

### Install Node.js

Install the [Node.js](https://nodejs.org/download) runtime environment. Node.js is a tool that is used to run the Remote server, which is implemented as a JavaScript script. 

### Change to Remote directory

```all
cd ~/Downloads/remote
```
Open a terminal and change to the Remote API directory, wherever you have downloaded it.

### Install node modules

```all
npm install
```
Then use the node package manager to install the required packages and their dependencies. The npm tool will look in the package.json file to find out which packages need to be installed.

### Start the server

```all
node remote.js
```
In a separate terminal window or tab, start the Remote server. This will tell Node.js to run the remote.js script and wait for incoming HTTP requests and Socket.IO messages.

### Start page

You can open the start page by going to [http://localhost:8080/](http://localhost:8080/) in your browser. Substitute the name of your computer to connect from other devices, or use ngrok to connect from the internet.

