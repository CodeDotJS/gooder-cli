#!/usr/bin/env node

'use strict';

const fs = require('fs');

const https = require('follow-redirects').https;

const mkdirp = require('mkdirp');

const colors = require('colors/safe');

const request = require('request');

const cheerio = require('cheerio');

const gooder = require('gooder');

const argv = require('yargs')

	.usage(colors.cyan.bold('\nUsage: $0 <command/option> [target]'))

	.command(' u', ' ❱ required before URL')

	.demand(['u'])

	.describe('u', ' ❱ Google Drive URL')

	.example('$0 -u https://drive.google.com...xyz')

	.argv;

const updateNotifier = require('update-notifier');

const pkg = require('./package.json');

updateNotifier({pkg}).notify();

// this directory will be used to save the drive content
const downloadDirectory = './GoDrive/';

// importing messages
const goodVerf = gooder(argv.u);

// quick function to check internet connection
function checkInternet(cb) {
	require('dns').lookup('google.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			cb(false);
		} else {
			cb(true);
		}
	});
}

checkInternet(isConnected => {
	if (isConnected) {
		console.log(colors.cyan.bold('\n ❱ Internet Connection   :   ✔      '));
	} else {
		console.log(colors.red.bold('\n ❱ Internet Connection   :   ✖\n'));
		// stop the whole process if there is not internet connection
		process.exit(1);
	}
});

// gooder don't provide much information about URL
// So, just dirty way to check if the argument provided by user is a url
if (goodVerf.indexOf('http') === -1) {
	console.log(colors.bold.red('\n', goodVerf.replace('.', ''), 'media.', '\n'));
	// if not 'http' - stop everything and show default error.
	process.exit(1);
}

// making sure that the argument is URL and proceeding further
if (goodVerf.indexOf('http') === 0) {
	// directory will be created only if the provided argument is a 'valid url'
	// must be public drive
	mkdirp(downloadDirectory, err => {
		if (err) {
			console.log(colors.red.bold('\n ❱ Directory Created    :    ✖\n'));
			// exiting before showing error message
			process.exit(1);

			console.log(err);
		} else {
			// finding title of the content
			request(argv.u, (error, response, html) => {
				if (!error && response.statusCode === 200) {
					const $ = cheerio.load(html, {
						normalizeWhitespace: true,

						decodeEntities: true
					});
					// fetching title of the URL
					const title = $('title').text().replace(' - Google Drive', '').replace(/ /g, '-');

					console.log(colors.cyan.bold('\n ❱ Downloading ...'), colors.green.bold(title), '\n');

					// importing
					const getFileIn = fs.createWriteStream(downloadDirectory + title);

					// downloading and saving process
					https.get(goodVerf, (res, cb) => {
						// piping
						res.pipe(getFileIn);
						getFileIn.on('finish', () => {
							console.log(colors.cyan.bold(' ❱ File saved in'), colors.green.bold('GoDrive\n'));
							getFileIn.close(cb);
						});
					}).on('error', err => { // chances are negligible
						process.exit(1);
						// better to exit before showing user some random error messages
						console.log(err);
					});
				} else {
					// same
					process.exit(1);
				}
			});
		}
	});
}
