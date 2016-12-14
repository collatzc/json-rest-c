# `json-rest-c` Restful Client for JSON

## Quick start

```javascript
var config = ('../config/config_'+process.env.NODE_ENV+'.conf.js');
/*
config = {
	restfulAPI: {
		protocol: 'http:'
		hostname: 'api.domain.com',
		port: 4000
	}
}
 */
var jRestClient = require('json-rest-c');
var client = jRestClient(config.restfulAPI);
client.get('url/to/get', (resp, respStatusCode, respHeaders) => {
	...
}).on('error', (err) => {
	...
});
```
## Installation

```
$ npm install json-rest-c --save
```

## Features

* Support all Restful methods or custom method;
* Allows https connection;
* Allows simple HTTP basic authentication;
* Errors easily handling.

## Usages

### Load pre-defined configurations for default use

`constructor(options)` with `options` of:

* resJSON <Boolean\>
* protocol <String\>
* hostname <String\>
* port <Number\>
* headers <Object\>
* auth <String\>
* agent <Object\>
* timeout <Number\>