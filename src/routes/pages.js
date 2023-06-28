'use strict';

const dirs = require('../utilities/directories');

module.exports = function (app, configObjects) {
    //Page1 page
	app.get('/page1', function (request, response) {
		response.render(dirs.layouts + '/page1.html', configObjects.page1);
	});

	//Page2 page
	app.get('/page2', function (request, response) {
		response.render(dirs.layouts + '/page2.html', configObjects.page2);
	});

	//Page3 page
	app.get('/page3', function (request, response) {
		response.render(dirs.layouts + '/page3.html', configObjects.page3);
	});
};