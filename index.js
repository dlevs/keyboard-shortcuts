const {exec, spawn} = require('child_process');
const applescript = require('applescript');
const HID = require('node-hid');
const devices = HID.devices();
const keyboardMeta = devices.find(({productId}) => productId === 219);
const keyboard = new HID.HID(keyboardMeta.path);

const swapKeysWithValues = (source) => Object
	.entries(source)
	.reduce((target, [key, value]) => {
		target[value] = key;
		return target;
	}, {});

const keyCodes = {
	off: '0100000000010000',
	home: '0123020000010000',
	search: '0121020000010000',
	mail: '018a010000010000',
	one: '0100000000050000',
	two: '0100000000090000',
	three: '0100000000110000',
	four: '0100000000210000',
	five: '0100000000410000',
	star: '0182010000010000',
	mute: '01e2000000010000',
	volumeDown: '01ea000000010000',
	volumeUp: '01e9000000010000',
	playPause: '01cd000000010000',
	calculator: '0192010000010000',
	leftBracket: '010000b600010000',
	rightBracket: '010000b700010000',
	left: '0124020000010000',
	right: '0125020000010000',
	up: '012d020000010000',
	down: '012e020000010000'
};
const keyNames = swapKeysWithValues(keyCodes);


let appBuild;

const runBuild = () => {
	// applescript.execString('tell application "System Events" to tell process "Terminal" to keystroke "k" using command down');

	if (appBuild) {
		appBuild.kill();
	}

	appBuild = spawn('/usr/local/bin/node', [
		'/Users/dlevett/.appcelerator/install/6.2.0/package/node_modules/titanium/lib/titanium.js',
		'build',
		'run',
		'--platform',
		'ios',
		'--log-level',
		'trace',
		'--sdk',
		'6.0.3.GA',
		'--project-dir',
		'/Users/dlevett/dev/git/ecom-iso-app',
		'--target',
		'simulator',
		'--ios-version',
		'10.3.1',
		'--device-family',
		'ipad',
		'--deploy-type',
		'development',
		'--sim-type',
		'ipad',
		'--sim-version',
		'10.3',
		'--device-id',
		'44353AF7-9A09-4042-A0DD-2455EC495AB5',
		'--skip-js-minify',
		'--no-prompt',
		'--prompt-type',
		'socket-bundle',
		'--prompt-port',
		'49743',
		'--no-banner',
		'--project-dir',
		'/Users/dlevett/dev/git/ecom-iso-app'
	], {
		stdio: ['pipe', process.stdout, process.stderr]
	});

	// appBuild.stdout.on('data', (data) => {
	// 	console.log(data.toString());
	// });
	//
	// appBuild.stderr.on('data', (data) => {
	// 	console.log(data.toString());
	// });

	appBuild.on('exit', (code) => {
		console.log(`Child exited with code ${code}`);
	});
};

keyboard.on('data', function (data) {
	const keyCode = data.toString('hex');
	const keyName = keyNames[keyCode];

	if (!keyName) {
		console.log(`Unknown key pressed with code ${keyCode}`);
		return;
	}

	switch (keyName) {
		case 'mail':
			exec('open -a "Microsoft Outlook"');
			break;
		case 'search':
			exec('open "https://www.google.co.uk/"');
			break;
		case 'one':
			exec('open "https://llxgbs.atlassian.net/secure/Dashboard.jspa?selectPageId=16300"');
			break;
		case 'two':
			exec('open "https://dev04-eu-llxgbs.demandware.net/on/demandware.store/Sites-Site"');
			break;
		case 'three':
			exec('open "https://development-eu-llxgbs.demandware.net/on/demandware.store/Sites-Site"');
			break;
		case 'four':
			exec('open "https://staging-eu-llxgbs.demandware.net/on/demandware.store/Sites-Site"');
			break;
		case 'calculator':
			exec('open -a "SourceTree"');
			break;
		case 'star':
			runBuild();
			break;
		case 'up':
			applescript.execString(`
tell application "System Events"

    key code 126

end tell
`.trim());
			break;
		case 'down':
			applescript.execString(`
tell application "System Events"

    key code 125

end tell
`.trim());
			break;

	}


	console.log(`Key pressed: ${keyName}`);
});

