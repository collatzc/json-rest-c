const http = require('http'), https = require('https'), url_parse = require('url'),
		debug = require('debug')('rest_client');

module.exports = function(options) {
	
	this.resJSON	= options.resJSON || true; // by default response body convert to json
	this.protocol = options.protocol || 'http:';
	this.hostname = options.hostname || '';
	this.port			= options.port || 80;
	this.headers	= options.headers || {};
	this.agent		= options.agent ? options.agent : { keepAlive: true };
	let self = this;
	this.get = (url, cb) => {
		util.connect('get', url, cb);
	};

	this.post = (url, args, cb) => {
		util.connect('post', url, args, cb);
	};

	this.put = (url, args, cb) => {
		util.connect('put', url, args, cb);
	};

	let util = {
		handleEnd: (res, _buffer, cb) => {
			let data = self.resJSON ? JSON.parse(_buffer) : _buffer;
			
			// cb(objectData, statusCode, headers)
			cb(data, res.statusCode, res.headers);
		},
		connect: (method, url, args, cb) => {
			url = url_parse.parse(url);
			method = method.toLowerCase();
			let options = {
				method:		method,
				protocol: url.protocol	|| self.protocol,
				hostname: url.hostname	|| self.hostname,
				port:			url.port			|| self.port,
				path:			url.path,
				headers:	JSON.parse(JSON.stringify(self.headers)),
			};
			// no args passed
			if (typeof args === 'function') {
				cb = args;
				if (method === 'post' || method === 'put' || method === 'delete' || method === 'patch') {
					options.headers['content-length'] = 0;
				}
			} else if (typeof args === 'object') {
				if (args.headers) {
					options.headers = Object.assign(options.headers, args.headers);
				}
				if (args.data !== undefined) {
					args.data = typeof args.data === 'string' ? args.data:JSON.stringify(args.data);
					options.headers['content-type'] = 'application/json;charset=utf-8';
					options.headers['content-length'] = Buffer.byteLength(args.data, 'utf8');
				} else {
					options.headers['content-length'] = 0;
				}
			}
			debug("http(s).options = ", options);
			if (options.protocol == 'https:') {
				options.agent = new https.Agent(self.agent);
				var request = https.request(options, (res) => {
					let _buffer;
					res.setEncoding('utf8');
					res.on('data', (chunk) => {
						_buffer = chunk;
						debug('https.response.data = ', _buffer);
					});
					res.on('end', () => {
						util.handleEnd(res, _buffer, cb);
					});
				});
			} else {
				options.agent = new http.Agent(self.agent);
				var request = http.request(options, (res) => {
					let _buffer;
					res.setEncoding('utf8');
					res.on('data', (chunk) => {
						_buffer = chunk;
						debug('http.response.data = ', _buffer);
					});
					res.on('end', () => {
						util.handleEnd(res, _buffer, cb);
					});
				});
			}

			if (args.data) {
				debug("http(s).request with data: ", args.data);
				request.write(args.data);
			}
			request.on('error', (err) => {
				console.log('Error by http(s).request: ', err);
			});
			request.end();
		}
	};
}