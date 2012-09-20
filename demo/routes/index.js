
/*
 * GET home page.
 */

exports.index = function(req, res){
	var template_engine = req.app.settings.template_engine;
  res.render('index', { title: 'Express with '+template_engine });
};
