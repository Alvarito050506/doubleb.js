#!/usr/bin/env node

/*
 * index.js
 * 
 * Copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

/**
 * @file Does all the things.
 * @author Álvaro Torralba <donfrutosgomez@gmail.com> 
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @version 0.1.0
 * 
 **/

const fs = require("fs-extra");
const path = require("path");
var custom_handlers = new Object();
var files = new Array();

/**
 * From Stack Overflow:
 * <a href="https://stackoverflow.com/a/50121975/9201087">https://stackoverflow.com/a/50121975/9201087</a>
 * @function
 * @name traverse_dir
 * @author Jonas Wilms
 * @copyright 2019 Jonas Wilms
 * @license CC BY-SA 4.0
 * @param {string} dir - Directory to traverse
 * @since 0.1.0
 * @returns {string[]} files
 * 
 **/
function traverse_dir(dir)
{
	fs.readdirSync(dir).forEach(function (file) {
		var filepath = path.join(dir, file);
		var stat = fs.statSync(filepath);
		if (stat.isDirectory())
		{           
			traverse_dir(filepath);
		} else
		{
			files.push(filepath);
		}
	});
}

/**
 * Reads the configuration file in the [specified path]{@link read_config#config_path}.
 * @function
 * @name read_config
 * @author Álvaro Torralba <donfrutosgomez@gmail.com>
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @param {string} [config_path="./_config.json"] - Configuration file path.
 * @since 0.1.0
 * @returns {Object}
 * 
 **/
function read_config(config_path="./_config.json")
{
	var tmp = new Object();
	process.stdout.write("Reading configuration file...");
	if (!fs.existsSync(config_path))
	{
		process.stderr.write(" ERR.\nError: The " + config_path + "  file does not exists.\n");
		return -1;
	}

	if (!(tmp = JSON.parse(fs.readFileSync(config_path, "utf8"))))
	{
		process.stderr.write(" ERR.\nError: Configuration must be valid JSON.\n");
		return -2;
	}
	process.stdout.write(" OK.\n");
	return tmp;
}


/**
 * @module
 * @name doubleb
 * @author Álvaro Torralba <donfrutosgomez@gmail.com>
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @version 0.1.0
 * 
 **/

/**
 * Renders config.data.
 * @function
 * @name render
 * @author Álvaro Torralba <donfrutosgomez@gmail.com>
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @param {Object} config - Configuration object.
 * @since 0.1.0
 * @returns {string}
 * 
 **/
function render(config)
{
	var match;
	var regex;
	var result;

	if (!config.hasOwnProperty("data"))
	{
		process.stderr.write("Error: No data provided.\n");
		return -1;
	}
	
	if (config.hasOwnProperty("template"))
	{
		match = "{{\\s*content\\s*}}";
		regex = new RegExp(match, "g");
		result = fs.readFileSync(config.template, "utf8").replace(regex, config.data);
	}


	Object.keys(config).forEach(function (key) {
		if (typeof(config[key]) == "string")
		{
			match = "{{\\s*" + key + "\\s*}}";
			regex = new RegExp(match, "g");
			result = (result || config.data).replace(regex, config[key]);
		}
	});

	Object.keys(custom_handlers).forEach(function (handler) {
		regex = custom_handlers[handler].regex;
		module.exports.config = config;
		result = (result || config.data).replace(regex, custom_handlers[handler].callback(match));
	});

	return result;
}

/**
 * Middleware wrapper for render.
 * @function
 * @name middleware
 * @author Álvaro Torralba <donfrutosgomez@gmail.com>
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @since 0.1.0
 * @returns {function}
 * 
 **/
function middleware(config)
{
	return function (req, res, next)
	{
		res.send(render(config));
		next();
	};
}

/**
 * Regex handler.
 *
 * @callback regex_handler
 * @name regex_handler
 * @author Álvaro Torralba <donfrutosgomez@gmail.com>
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @param {string} match - The matched string.
 * @since 0.1.0
 * @returns {string} result - The replacement string.
 * 
 **/

/**
 * Adds a regular expression handler.
 * @function
 * @name add_handler
 * @author Álvaro Torralba <donfrutosgomez@gmail.com>
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @param {string} name - Name of the handler.
 * @param {RegExp} regex - Regular expression to handle.
 * @param {regex_handler} callback - Handler function.
 * @since 0.1.0
 * @returns {boolean} true - Always true
 * 
 **/
function add_handler(name, regex, callback) {
	if (typeof(callback) != "function")
	{
		process.stderr.write("Error: Callback must be a function.\n");
	}
	custom_handlers[name] = new Object();
	custom_handlers[name].regex = regex;
	custom_handlers[name].callback = callback;
	return true;
}

/**
 * Reads the configuration file, renders the input files and saves them in the output directory.
 * @function
 * @name main
 * @author Álvaro Torralba <donfrutosgomez@gmail.com>
 * @copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>
 * @license Apache-2.0
 * @param {string} [config_path="./_config.json"] - The configuration file path.
 * @since 0.1.0
 * @returns {(boolean|number)} - True if all is ok, negative number if anything fails.
 * 
 **/
function main(config_path = "./_config.json")
{
	var config = new Object();
	var exclude_regex;
	config = read_config(config_path);
	if (config == -1 || config == -2)
	{
		return config;
	}

	process.stdout.write("Checking config, direcories and files...");
	if (!config.hasOwnProperty("$output_dir"))
	{
		config["$output_dir"] = "./_output";
	}
	if (!config.hasOwnProperty("$input_dir"))
	{
		config["$input_dir"] = "./_src";
	}
	if (config.hasOwnProperty("$exclude"))
	{
		exclude_regex = new RegExp(config["$exclude"]);
	}
	if (!fs.existsSync(config["$input_dir"]))
	{
		process.stderr.write(" ERR\nError: The " + config["$input_dir"] + " directory does not exists.\n");
		return -1;
	}
	if (!fs.existsSync(config["$output_dir"]))
	{
		fs.mkdirSync(config["$output_dir"], {recursive: true});
	}
	process.stdout.write(" OK.\n");

	process.stdout.write("Generating output...");

	fs.copySync(config["$input_dir"], config["$output_dir"]);

	traverse_dir(config["$output_dir"]);

	files.forEach(function (file) {
		if (!exclude_regex.test(file))
		{
			file_data = fs.readFileSync(file, "utf8");
			config.data = file_data;
			result = render(config);
			fs.writeFileSync(file, result, "utf8");
		}
	});

	process.stdout.write(" OK.\n");
	return true;
}

module.exports = main;
module.exports.read_config = read_config;
module.exports.add_handler = add_handler;
module.exports.render = render;
module.exports.middleware = middleware;
