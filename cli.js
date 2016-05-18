#!/usr/bin/env node

'use strict';

const gooder = require('gooder');
const https = require('follow-redirects').https;
const mkdirp = require('mkdirp');
const colors = require('colors/safe');
const fs = require('fs');
const http = require('follow-redirects').http;
const argv = require('yargs')
	.usage(colors.cyan.bold('\nUsage: $0 <command/option> [target]'))
	.command(' u', ' ❱ required before URL')
	.demand(['u',])
	.describe('u', ' ❱ Google Drive URL')
	.example('$0 -u https://drive.google.com...xyz')
	.argv;

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
updateNotifier({pkg}).notify();

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
		console.log(colors.cyan.bold('\n ❱ Internet Connection   :    ✔\n'));
	} else {
		console.log(colors.red.bold('\n ❱ Internet Connection   :    ✖\n'));
		process.exit(1);
	}
});
