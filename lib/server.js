/*
 * This file is part of quickbooks-js
 * https://github.com/RappidDevelopment/quickbooks-js
 *
 * Based on qbws: https://github.com/johnballantyne/qbws
 *
 * (c) 2015 johnballantyne
 * (c) 2016 Rappid Development LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
 * Server.js
 *
 * This class will star the SOAP service
 * and start listening for requests from
 * a Quickbooks Web Connector
 */

//////////////////
//
// Private
//
//////////////////

/**
 * Node.js' HTTP Library
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/http.html
 */
var http = require('http');

/**
 * Node.js' File System API
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/fs.html
 */
var fs = require('fs');

/**
 * A SOAP client and server
 * for Node.js
 *
 * https://github.com/vpulim/node-soap
 */
var soap = require('soap');

/**
 * An HTTP server that will be used
 * to listen for SOAP requests.
 */
// var server = http.createServer(function(req, res) {
//     res.end('404: Not Found: ' + req.url);
// });

// var port = process.env.QB_SOAP_PORT || 8000;

/**
 * A constant for the WSDL filename.
 * @type {string}
 */
var WSDL_FILENAME = '/qbws.wsdl';

/**
 * Fetches the WSDL file for the
 * SOAP service.
 *
 * @returns {string} contents of WSDL file
 */
function buildWsdl() {
    var wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');

    return wsdl;
}

//////////////////
//
// Public
//
//////////////////

module.exports = Server;

function Server(config) {
    // this.wsdl = buildWsdl();
    // this.webService = require('./web-service');
    
      this.config;
      if(!config) {
        this.config = {
          username: process.env.QB_USERNAME || '',
          password: process.env.QB_PASSWORD || '',
          company_file: process.env.QB_COMPANY_FILE || '',
          soap_port: process.env.QB_SOAP_PORT || 8000,
        }
      } else {
        this.config = config;
      }
    
      this.wsdl = buildWsdl();
      this.webService = null;
      this.soapServer = null;
}

Server.prototype.run = function(server,webService) {
    // var soapServer;
    // server.listen(port);
    // soapServer = soap.listen(server, '/wsdl', this.webService.service, this.wsdl);
    // console.log('Quickbooks SOAP Server listening on port ' + port);
    // this.server.listen(this.config.soap_port);
    this.webService=webService;
    this.soapServer = soap.listen(server, `/${this.config.userId}/wsdl`, this.webService.service, this.wsdl);
};

// Server.prototype.setQBXMLHandler = function(qbXMLHandler) {
//     this.webService.setQBXMLHandler(qbXMLHandler);
// };
Server.prototype.restart = function() {
    	  let _this = this;
	  _this.server.close(() => {
    console.log('Quickbooks SOAP Server closed');
    _this.run();
  });
}

// Server.prototype.setQBXMLHandler = function(qbXMLHandler, config,webService) {
//   this.webService=webService
//   // this.webService = require('./web-service');
//   // this.webService.setQBXMLHandler(qbXMLHandler, config);
// };