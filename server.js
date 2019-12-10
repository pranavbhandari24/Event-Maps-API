const http = require( 'http' );
const app = require( './app' );
const port = process.env.PORT || 3000;
// const $ = require( 'jQuery' );

// $.get( "/localhost:3000/events/", ( data ) => {
//     console.log( data );
//   });
const server = http.createServer( app );


server.listen( port );