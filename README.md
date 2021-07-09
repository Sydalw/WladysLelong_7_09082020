# WladysLelong_7_09082020
# Groupomania #

This is the back end server for Project 7 of the Junior Web Developer path.

### Prerequisites ###

You will need to have Node and `npm` installed locally on your machine.

### Installation ###

Clone this repo. From within the project folder, run `npm install`. You 
can then run the server with `node server`. 
The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.


### .env setup ###

a file named `.env example` is included in this repo. Three variables are included in this file, you will need to set them up and rename your file in `.env` on your local project folder. 
The `key_value_token` is necessary to build the json web token used to authentificate the user session. 
The `MySQLdb_USER` variable is used to access your local MySQL database with the login of your choice. 
The `MySQLdb_PASSWORD` variable is the password to your local MySQL database linked to the login of your choice. 
