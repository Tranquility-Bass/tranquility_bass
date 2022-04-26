const topReviewedRoutes = require("./topReviewed");
const addTopic = require("./addTopic");

const constructorMethod = (app) => {
  app.use('/topReviewed', topReviewRoutes);
  app.use('/private/addTopic', addTopic);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};
module.exports = constructorMethod;