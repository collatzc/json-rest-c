var RestfulClient = require('../lib/json-rest-c');
var config = require('./config/configurator');
var assert = require('assert')
var client = new RestfulClient(config);

describe('Test https requests - ', () => {
	describe('Normal get requests - ', () => {
		it('HTTPS CODE 200 Test 1', (done) => {
			client.get('/user/init', (resp) => {
				done(assert.equal(1, resp.err.code));
			});
		});

		it('HTTPS CODE 200 Test 2', (done) => {
			client.get('/pass/init', (resp) => {
				assert.equal(1, resp.err.code);
				done();
			});
		});

		it('HTTPS CODE 200 Test 3 with JSON.parse error', (done) => {
			client.get('https://github.com', (resp, sc) => {
			}).on('error', (e) => {
				assert.equal('object', typeof e);
				done();
			});
		});

		it('HTTPS Test Event:requestTimeout with 1000ms m/l', (done) => {
			client.get('/user/init', (resp) => {
			}).on('requestTimeout', (req) => {
				req.abort();
				done();
			});
		});
	});
});