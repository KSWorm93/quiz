'use strict';

const dirs = require('../utilities/directories');
const db = require('../utilities/database');

module.exports = function (app, configObjects) {
    //Guide page
	app.get('/guide', function (request, response) {
		response.render(dirs.layouts + '/guide.html', configObjects.guide);
	});

	//Question page
	app.get('/quiz/', async function (request, response) {
		const metadata = await db.readMetadata();
		const parsedObj = Object.assign({}, configObjects.quiz);
		parsedObj.showMetadata = true;
		parsedObj.metadata = JSON.parse(metadata);
		
		response.render(dirs.layouts + '/question.html', parsedObj);
	});
	app.get('/quiz/:id', async function (request, response) {
		const quizId = request.params.id;
		const metadata = await db.readMetadata();
		const quizData = await db.getQuiz(quizId);
		const parsedObj = Object.assign({}, configObjects.quiz);
		parsedObj.showQuiz = true;
		parsedObj.metadata = JSON.parse(metadata);
		parsedObj.data = quizData;
		parsedObj.quizId = quizId;
		
		response.render(dirs.layouts + '/question.html', parsedObj);
	});
	app.get('/quiz/:id/:question', async function (request, response) {
		const quizId = request.params.id;
		const question = request.params.question;
		const quizData = await db.getQuiz(quizId);
		const parsedObj = Object.assign({}, configObjects.quiz);
		parsedObj.showQuestion = true;
		const selectedQuestion = quizData.questions[question]
		parsedObj.data = selectedQuestion;
		parsedObj.quizId = quizId;
		parsedObj.question = question;

		response.render(dirs.layouts + '/question.html', parsedObj);
	});

	//Hint page
	app.get('/hint/', function (request, response) {
		response.render(dirs.layouts + '/hint.html', configObjects.hint);
	});
	app.get('/hint/:id', function (request, response) {
		response.render(dirs.layouts + '/hint.html', configObjects.hint);
	});

	//Reset page
	app.get('/reset', function (request, response) {
		response.render(dirs.layouts + '/reset.html', configObjects.reset);
	});

	//Load page
	app.get('/load', function (request, response) {
		response.render(dirs.layouts + '/load.html', configObjects.load);
	});

	//Reward page
	app.get('/reward', function (request, response) {
		response.render(dirs.layouts + '/reward.html', configObjects.reward);
	});

	//Score page
	app.get('/score', function (request, response) {
		response.render(dirs.layouts + '/score.html', configObjects.score);
	});
};