const express = require("express");
const env =  require('./config/environment');
const logger = require('morgan');
const path = require("path");
const PORT = process.env.PORT || 8000;
const app = express();
require('./config/view-helpers')(app);
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const sassMiddleware = require("node-sass-middleware");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');
const MongoStore = require('connect-mongo');

// Setting up sass middleware
if(env.name == 'development'){

  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, 'scss'),
      dest: path.join(__dirname, env.asset_path, 'css'),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );

}

// use express middleware
app.use(express.json());


//to parse data
app.use(express.urlencoded({ extended: true }));

// Setting up Cookie Parser
app.use(cookieParser());

//setting the statics
app.use(express.static(env.asset_path));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);


// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Setting up express session
app.use(session({
  name: 'csv',
  secret : env.session_cookie_key,
  resave: true,
  saveUninitialized: true,
  coookie: {
    maxAge: (1000 * 60 * 100)
  },
  store: MongoStore.create({
    mongoUrl: env.MongoDB_URL,
    autoRemove: 'disabled'
  },
  function(err){
    console.log(err || 'connect-mongodb setup ok');
  })
}));

// Setting up flash
app.use(flash());

//Middleware - Creates Uploads Folder & Sub Folders, if not exists
app.use(customMiddleware.createUploads);

// Setting up custom Middleware
app.use(customMiddleware.setFlash);



// use express router
app.use("/", require("./routes"));


//server listens on port (8000 by default)
app.listen(PORT, function (err) {
  if (err) {
    console.log(`Error while running the server: ${err}`);
  }

  console.log(`Server is up and running on port: ${PORT}`);
  
});
