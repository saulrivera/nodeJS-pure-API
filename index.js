/*
 * Primary file for the API
 */

 // Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should reespond to all requests with a string
const server = http.createServer((req, res) => {

  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to.
    // If ne is not found, use default handler
    const chosenHanler = router[trimmedPath] ? router[trimmedPath] : handlers.default;

    // Construct the data object send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chosenHanler(data, (statusCode, payload) => {
      // Use the status code called back by the handler,
      // or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, 
      // or default to an empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the status
      console.log('Returning the response: ', statusCode, payloadString);
    });
  });
});

// Start the server, and have it listen on port 3000
server.listen(config.port, () => {
  console.log(`Environment: ${config.envName}.`);
  console.log(`The server is listening on port ${config.port} now.`);
});

// Define the handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
  // Callback a http status code, and a payload object
  callback(406, {'name': 'sample handler'});
};

// Not found hanlder
handlers.default = (data, callback) => {
  callback(404);
};

// Define a request router
const router = {
  'sample': handlers.sample
};
