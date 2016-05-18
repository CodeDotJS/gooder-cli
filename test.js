import childProcess from 'child_process';

import test from 'ava';

test.cb(t => {
	childProcess.execFile('./cli.js', ['-u https://drive.google.com/file/d/0B9PN3IJWm3bOSUhCaFJyTzZ4eTg/view'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.true(stdout.trim().length > 0);
		t.end();
	});
});
