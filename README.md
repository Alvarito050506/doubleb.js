# doubleb.js
![npm](https://img.shields.io/npm/v/doubleb.js)  
doubleb.js is a simple and limited template system designed for projects that require more speed when generating simple static and dinamyc pages.

## Getting started
### Prerquisites
To use doubleb.js you only need to have Node.js `> = 10.16.3` preinstalled.

### Installation
There is a [npm package](https://www.npmjs.com/package/doubleb,js) that you can install running:
```bash
npm install doubleb.js
```
## Usage
The only way to use doubleb.js for now is  through the [API](#api).

## API
The npm module, loaded with `const doubleb = require("doubleb.js");` exposes the following functions and variables.

### `function doubleb([config_path="./_config.json"])`
Reads the configuration file, renders the input files and saves them in the output directory.

### `function doubleb.read_config([config_path="./_config.json"])`
Reads the configuration file in the specified path and returns the JSON Object of the configuration.

### `function doubleb.render(config)`
Renders `config.data`, with the template `config.template`, if present.

### `function doubleb.middleware(config)`
Middleware wrapper for `render(config)`.

### `function add_handler(name, regex, callback)`
 > _Only for custom regular expression handlers_

Adds a handler for the regular expression `regex` with name `name`.

### `var doubleb.config`
 > _Only for custom regular expression handlers_

Is the current configuration readed by `doubleb.read_config([config_path="./_config.json"])`.

## Configuration file
The configuration file looks like the this:
```json
{
  "$input_dir": "/some/path",
  "$ouput_dir": "/some/other/path",
  "$exclude": "(.*).png$",
  "variable_name": "value",
  "extension_variable": ["value", "value0", "abcdwxyz"]
}
```
Where `$input_dir` is the input directory with the files to be rendered and `$output_dir` is the output directory of the rendered files. `variable_name` and `extension_variable` are just examples. All the fields are optional.

## Examples
For examples, look at the [**test**](https://github.com/Alvarito050506/doubleb.js/tree/master/test) folder.

## Licensing
All the code of this project is licensed under the [Apache License version 2.0](https://github.com/Alvarito050506/doubleb.js/blob/master/LICENSE) (Apache-2.0).  

		Copyright 2019 Álvaro Torralba <donfrutosgomez@gmail.com>

		Licensed under the Apache License, Version 2.0 (the "License");
		you may not use this file except in compliance with the License.
		You may obtain a copy of the License at

			http://www.apache.org/licenses/LICENSE-2.0

		Unless required by applicable law or agreed to in writing, software
		distributed under the License is distributed on an "AS IS" BASIS,
		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		See the License for the specific language governing permissions and
		limitations under the License.
		
All the documentation of this project is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) (CC BY-SA 4.0) license.

![CC BY-SA](https://licensebuttons.net/l/by-sa/4.0/88x31.png)
