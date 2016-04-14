/**
 * Module dependencies.
 */


module.exports = function(app) {
	app.get('/all', function(req, res, next) {
		res.send("all");
		next();
	});
};