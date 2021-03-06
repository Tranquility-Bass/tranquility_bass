const topReviewedRoutes = require("./topReviewed");
const addTopic = require("./addTopic");
const search = require("./search");
const account = require("./account");
const home = require("./home");
const review = require("./review");
const createReviewDis = require("./createFeedback");
const xss = require('xss');

const constructorMethod = (app) => {
  app.use('/topReviewed', topReviewedRoutes);
  app.use('/private/addTopic', addTopic);
  app.use('/search', search);
  app.use('/account', account);
  app.use('/private/review', review);
  app.use('/private/create', createReviewDis);
  app.use('/', home);

  app.use('*', (req, res) => {
    res.status(404).render('pages/error', {title: "Error", error:"Page Not Found"} );
  });
};
module.exports = constructorMethod;