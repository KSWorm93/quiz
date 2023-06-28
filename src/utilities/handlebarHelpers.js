'use strict';

module.exports = function (hbs) {
	ifEquals(hbs);
    ifEqualsEither(hbs);
};

function ifEquals(hbs) {
    hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });
}

function ifEqualsEither(hbs) {
    hbs.registerHelper('ifEqualsEither', function(arg1, arg2, options) {
        const args = arg2.split(',');
        return (args.includes(arg1)) ? options.fn(this) : options.inverse(this);
    });
}