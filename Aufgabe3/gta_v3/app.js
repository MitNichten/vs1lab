// File origin: VS1LAB A3

/**
 * This script configures the main express app of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */
//TODO: -------------------------------------------------------------
const InMemoryGeoTagStore = require('./models/geotag-store');
const GeoTag = require('./models/geotag');
const GeoTagExamples = require('./models/geotag-examples');


/**
 * Define module dependencies.
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');

/**
 * Set up Express app.
 */

const app = express();

// Set ejs as the view engine.
app.set('views', path.join(__dirname, 'views'));

// Set ejs template folder.
app.set('view engine', 'ejs');

// Set logger
app.use(logger('dev'));

// Set content processing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * VS1LAB:
 * Configure path for static content.
 * Test the result in a browser here: 'http://localhost:3000/'.
 */
//TODO--------------------------------------------------------------------------------------------------------

// GeoTagStore initialisieren
const geoTagStore = new InMemoryGeoTagStore();

// Beispieldaten laden
GeoTagExamples.tagList.forEach(([name, lat, lon, hashtag]) => {
  geoTagStore.addGeoTag(new GeoTag(name, lat, lon, hashtag));
});

// Store für alle Routen verfügbar machen
app.locals.geoTagStore = geoTagStore;

//TODO:------------------------------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// Set dedicated script for routing
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

 module.exports = app;
