#!/usr/bin/env node

'use strict';

const https = require('follow-redirects').https;
const mkdirp = require('mkdirp');
const colors = require('colors/safe');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const gooder = require('gooder');

const argv = require('yargs')
    .usage(colors.cyan.bold('\nUsage: $0 <command/option> [target]'))
    .command(' u', ' ❱ required before URL')
    .demand(['u', ])
    .describe('u', ' ❱ Google Drive URL')
    .example('$0 -u https://drive.google.com...xyz')
    .argv;

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
updateNotifier({
    pkg
}).notify();

const downloadDirectory = './GoDrive/';
const goodVerf = gooder(argv.u);

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
        console.log(colors.cyan('\n ❱ Internet Connection   :    ✔      '));
    } else {
        console.log(colors.red.bold('\n ❱ Internet Connection   :    ✖\n'));
        process.exit(1);
    }
});


if (goodVerf.indexOf('http') === -1) {
    console.log(colors.red('\n', goodVerf, '\n'));
    process.exit(1);
}

request(argv.u, function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html, {
            normalizeWhitespace: true,
            decodeEntities: true
        });
        var title = $('title').text();
        console.log(title.replace(' - Google Drive', ''));
    } else {
        process.exit(1);
    }
});

if (goodVerf.indexOf('http') === 0) {
    mkdirp(downloadDirectory, err => {
        if (err) {
            console.log(colors.red.bold('\n ❱ Directory Created    :    ✖\n'));
            process.exit(1);
            console.log(err);
        } else {
            console.log(colors.cyan('\n ❱ Directory Created     :    ✔     '));
        }
    });
}

