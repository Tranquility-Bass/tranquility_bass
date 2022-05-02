const topReviewedRoutes = require("./topReviewed");
const addTopic = require("./addTopic");
const login = require("./login");
const signup = require("./signup");

const constructorMethod = (app) => {
  app.use('/topReviewed', topReviewedRoutes);
  app.use('/private/addTopic', addTopic);
  app.use('/login', login);
  app.use('/signup', signup);

  app.use('*', (req, res) => {
    res.status(404).render('pages/error', {title: "Error", error:"Page Not Found"} );
  });
};
module.exports = constructorMethod;