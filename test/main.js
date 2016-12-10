var RestfulClient = require('../lib/json-rest-c');
var config = require('./config/configurator');
var assert = require('assert');
var client = new RestfulClient(config);

describe('Test https requests', () => {
	describe('Normal get requests', () => {
		it('HTTPS CODE 200 Test 1', () => {
			client.get('/user/init', (resp) => {
				assert.equal(0, resp.err.code);
			});
		});

		it('HTTPS CODE 200 Test 2', () => {
			client.get('/pass/init', (resp) => {
				assert.equal("Alreay init!", resp.err.desc);
			});
		});
	});
});