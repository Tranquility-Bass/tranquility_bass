const bandsRoutes = require('./bands');
const albumsRoutes = require('./albums');
const topReviewedRoutes = require("./topReviewed")

const constructorMethod = (app) => {
  app.use('/login', bandsRoutes);
  app.use('/signup', bandsRoutes);
  app.use('/albums', albumsRoutes);
  app.use('/topReviewed', topReviewRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};
module.exports = constructorMethod;