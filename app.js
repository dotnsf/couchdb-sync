//. app.js
var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    ejs = require( 'ejs' ),
    jwt = require( 'jsonwebtoken' ),
    app = express();

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

require( 'dotenv' ).config();
var database_url = 'DATABASE_URL' in process.env ? process.env.DATABASE_URL : '';
var decode_key = 'DECODE_KEY' in process.env ? process.env.DECODE_KEY : 'decodekey'

//. Encode
app.encode = async function( text ){
  return new Promise( async ( resolve, reject ) => {
    var ts = ( new Date() ).getTime();
    var encoded = jwt.sign( { text: text, timestamp: ts }, decode_key );

    resolve( encoded );
  });
};

//. Decode
app.decode = async function( text ){
  return new Promise( async ( resolve, reject ) => {
    var obj = jwt.verify( text, decode_key );
    if( obj && obj.timestamp ){
      var ts = ( new Date() ).getTime();
      //. ５秒以内なら認める
      if( obj.timestamp < ts && ts < obj.timestamp + 5 * 1000 ){
        resolve( obj.text );
      }else{
        resolve( null );
      }
    }else{
      resolve( null );
    }
  });
};

app.post( '/decode', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var code = req.body.code;
  if( code ){
    var decoded = await app.decode( code );
    if( decoded ){
      res.write( JSON.stringify( { status: true, code: decoded }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'decode error' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no code specified.' }, null, 2 ) );
    res.end();
  }
});

app.get( '/', async function( req, res ){
  var encoded = await app.encode( database_url );
  res.render( 'index', { database_url: encoded } );
});

var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
