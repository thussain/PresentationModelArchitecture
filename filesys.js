
var fs = require('fs');

var templateFiles = fs.readdirSync('public/templates');
var fileContents;
var generatedName;
var fileToWrite;
var yuiModuleTemplate =  "YUI.add('{module_name}', function(Y) { ";
	yuiModuleTemplate += "Y.one('head').append(unescape('{template}')); ";
	yuiModuleTemplate += "}, '0.0.1', {requires: ['node']}); ";


function htmlEscape(text) {
	return text.replace(/&/g,'&amp;').
		replace(/</g,'&lt;').
		replace(/"/g,'&quot;').
		replace(/'/g,'&#039;');
}

templateFiles.forEach(function(file) {
	fileContents = fs.readFileSync('public/templates/'+file, 'utf-8');

	fileToWrite = yuiModuleTemplate;
	fileToWrite = fileToWrite.replace('{module_name}', file.replace('.html', ''));
	fileToWrite = fileToWrite.replace('{template}', escape(fileContents));
	generatedName = file.replace('.html', '.js');
	fs.writeFileSync('public/js/generated/'+generatedName, fileToWrite);
	console.log('file: "'+file);
});

