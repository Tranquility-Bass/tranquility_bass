const topReviewedRoutes = require("./topReviewed");
const addTopic = require("./addTopic");

const constructorMethod = (app) => {
  app.use('/topReviewed', topReviewedRoutes);
  app.use('/private/addTopic', addTopic);

  app.use('*', (req, res) => {
    res.status(404).render('pages/error', {title: "Error", error:"Page Not Found"} );
  });
};
module.exports = constructorMethod;