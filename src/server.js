'use strict';

//Imports
const dirs = require('./utilities/directories');
const express = require('express');
const hbs = require('hbs');

//Constants
const server = express();
//Server
const PORT = 1415;
const HOSTNAME = 'http://localhost:';

//Register partials
hbs.registerPartials(dirs.partials);

//Register helpers
require(dirs.utilities + '/handlebarHelpers')(hbs);

//Set engine and views location
server.set('views', dirs.templates);
server.use(express.static(dirs.client))
server.set('view engine', 'html');
server.engine('html', hbs.__express);

//Add routes
require(dirs.routes + '/router.js')(server);

//start the server
server.listen(PORT);

console.log('Server running at: ' + HOSTNAME + PORT);