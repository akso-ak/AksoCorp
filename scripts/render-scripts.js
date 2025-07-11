'use strict';
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const sh = require('shelljs');
const UglifyJS = require('uglify-js');

module.exports = function renderScripts() {

    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/js');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');

    sh.cp('-R', sourcePath, destPath)

    const sourcePathScriptsJS = upath.resolve(upath.dirname(__filename), '../src/js/scripts.js');
    const destPathScriptsJS = upath.resolve(upath.dirname(__filename), '../dist/js/scripts.js');
    
    const copyright = `/*!
* Start Bootstrap - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/StartBootstrap/${packageJSON.name}/blob/master/LICENSE)
*/
`
    const scriptsJS = fs.readFileSync(sourcePathScriptsJS, 'utf8');
    const minified = UglifyJS.minify(scriptsJS, { output: { comments: /^!/ } });

    if (minified.error) {
        console.error('UglifyJS error: ', minified.error);
        return;
    }
    
    fs.writeFileSync(destPathScriptsJS, copyright + minified.code);
};