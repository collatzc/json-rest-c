var RestfulClient = require('../lib/json-rest-c');
var config = require('./config/configurator');
var assert = require('assert')
var client = new RestfulClient(config);

describe('Test https requests', () => {
	describe('Normal get requests', () => {
		it('HTTPS CODE 200 Test 1', (done) => {
			client.get('/user/init', (resp) => {
				assert.equal(1, resp.err.code);
				done();
			});
		});

		it('HTTPS CODE 200 Test 2', (done) => {
			client.get('/pass/init', (resp) => {
				assert.equal(1, resp.err.code);
				done();
			});
		});
	});
});