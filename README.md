# json-rest-c Restful Client for JSON

## Quick start

```javascript
var config = ('../config/config_'+process.env.NODE_ENV+'.js');
/*
config = {
	restfulAPI: {
		protocol: 'http:'
		hostname: 'api.domain.com',
		port: '3000',
		headers: {
			'x-auth-method': 'secret'
		},
		agent: {
			keepAlive: true
		}
	}
}
 */
var jRestClient = require('json-rest-c');
var client = jRestClient(config.restfulAPI);
client.get('url/to/get', (resp, respStatusCode, respHeaders) => {
	...
});
```
## Installation

```
$ npm install json-rest-c --save
```