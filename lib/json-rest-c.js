"use strict";

const http = require('http'), https = require('https'),
		url_parse = require('url'),
		EventEmitter = require('events'),
		debug = require('debug')('json-rest-c');

module.exports = class extends EventEmitter {

	constructor(options) {
		super();
		this.resJSON	= options.resJSON || true; // by default response body convert to json
		this.protocol = options.protocol || 'http:';
		this.hostname = options.hostname || '';
		this.port			= options.port || 80;
		this.headers	= options.headers || {};
		this.auth			= options.auth ? options.auth : null;
		this.agent		= options.agent ? options.agent : { keepAlive: true };
		this.timeout	= options.timeout ? options.timeout : 0;
	}

	get(url, args, cb) {
		this.connect('get', url, args, cb);
		return this;
	}

	post(url, args, cb) {
		this.connect('post', url, args, cb);
		return this;
	}

	put(url, args, cb) {
		this.connect('put', url, args, cb);
		return this;
	}

	patch(url, args, cb) {
		this.connect('patch', url, args, cb);
		return this;
	}

	delete(url, args, cb) {
		this.connect('delete', url, args, cb);
		return this;
	}

	propfind(url, args, cb) {
		this.connect('propfind', url, args, cb);
		return this;
	}

	request(method, url, args, cb) {
		this.connect(method, url, args, cb);
		return this;
	}

	handleEnd(res, _buffer, cb) {
		let data;
		try {
			data = this.resJSON ? JSON.parse(_buffer) : _buffer;
		} catch (e) {
			this.emit('error', e);
		}

		cb(data, res.statusCode, res.headers);
	}

	connect(method, url, args, cb) {
		url = url_parse.parse(url);
		method = method.toLowerCase();
		let options = {
			method:		method,
			protocol: url.protocol	|| this.protocol,
			hostname: url.hostname	|| this.hostname,
			port:			url.port			|| this.port,
			path:			url.path,
			headers:	JSON.parse(JSON.stringify(this.headers)),
		};
		if (this.auth) {
			options.auth = this.auth;
		}
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
			options.port = 443;
			options.agent = new https.Agent(this.agent);
			var request = https.request(options, (res) => {
				let _buffer;
				if (this.timeout != 0) {
					res.setTimeout(this.timeout, () => {
						this.emit('responseTimeout', res);
					});
				}
				res.setEncoding('utf8');
				res.on('data', (chunk) => {
					_buffer = chunk;
					debug('https.response.data = ', _buffer);
				});
				res.on('end', () => {
					this.handleEnd(res, _buffer, cb);
				});
			});
		} else {
			options.agent = new http.Agent(this.agent);
			var request = http.request(options, (res) => {
				let _buffer;
				if (this.timeout != 0) {
					res.setTimeout(this.timeout, () => {
						this.emit('responseTimeout', res);
					});
				}
				res.setEncoding('utf8');
				res.on('data', (chunk) => {
					_buffer = chunk;
					debug('http.response.data = ', _buffer);
				});
				res.on('end', () => {
					this.handleEnd(res, _buffer, cb);
				});
			});
		}

		if (this.timeout != 0) {
			request.setTimeout(this.timeout, () => {
				this.emit('requestTimeout', request);
			});
		}

		if (args.data) {
			debug("http(s).request with data: ", args.data);
			request.write(args.data, 'utf8');
		}
		request.on('error', (err) => {
			debug('Error by http(s).request: ', err);
			this.emit('error', err);
		});
		request.end();
	}
};