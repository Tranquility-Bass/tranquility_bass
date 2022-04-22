const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  }
});

app.use;
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));

app.use('/private', (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).render('pages/login', {
		title: "Login",
		name: "Login",
		error: "You are not logged in"
	});
  } else {
    next();
  }
});

app.use(async (req, res, next) => {
	let date = new Date().toUTCString();
	let method = req.method;
	let url = req.originalUrl;
	if (req.session.user) console.log("[" + date + "]: " + method + " " + url + " (Authenticated User)");
	else console.log("[" + date +  "]: " +method + " "+ url + " (Non-Authenticated User)");
	next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});