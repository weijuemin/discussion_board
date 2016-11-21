var mongoose = require('mongoose'),
    dbURI = "mongodb://localhost/discussion_board",
    fs = require('fs'),
    path = require('path'),
    models_path = path.join(__dirname, '../models');

mongoose.connect( dbURI );
mongoose.connection.on( 'connected', function () {
  console.log( `Mongoose default connection open to ${ dbURI }` );
});
mongoose.connection.on( 'error', function ( err ) {
  console.error( `Mongoose default connection error: ${ err }` );
});
mongoose.connection.on( 'disconnected', function () {
  console.log( 'Mongoose default connection disconnected' );
});

fs.readdirSync(models_path).forEach(function(file){
  if(file.indexOf('.js') > -1){
    require(models_path + '/' + file);
  }
})