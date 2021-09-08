// import config from './svgicon.json';
import SVGSpriter from 'svg-sprite';
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import rimraf from 'rimraf';
import File from 'vinyl';
// Create spriter instance (see below for `config` examples)

const dest = './static/icon-sprite/';
var spriter = new SVGSpriter({
	dest,
	log: 'info',
	mode: {
		css: {
			example: true,
			render: {
				css: true
			},
			bust: false
		},
		view: {
			example: true,
			render: {
				css: true
			},
			bust: false
		},
		stack: {
			example: true,
			render: {
				css: true
			},
			bust: false
		}
		// defs: true,
		// symbol: true,
		// stack: true
	},
	shape: {
		spacing: {
			padding: 0,
			box: 'icon'
		}
	}
});

const cwd = path.resolve('static/icons');

// Add SVG source files — the manual way ...
const icons = glob.sync('./**/*.svg', { cwd });
icons.forEach((icon) => {
	const file = new File({
		path: path.join(cwd, icon), // Absolute path to the SVG file
		base: cwd, // Base path (see `name` argument)
		contents: fs.readFileSync(path.join(cwd, icon)) // SVG file contents
	});
	// const parts = relative
	// 	.replace('.svg', '')
	// 	.replace(/[\s_\-\.]/gi, '-')
	// 	.split(path.sep);
	// const id = parts.join('--');
	// console.log(slash(relative));
	spriter.add(file);
});

// Make directory for icons if it doesn't exist
if (!fs.existsSync(dest)) {
	fs.mkdirSync(dest);
}

// Clear Directory
rimraf.sync(`${dest}*`);
console.log('Directory cleared! Ready to compile');

// Compile the sprite
spriter.compile(function (error, result) {
	/* Write `result` files to disk (or do whatever with them ...) */
	for (var mode in result) {
		for (var resource in result[mode]) {
			fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
			fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
		}
	}
});
