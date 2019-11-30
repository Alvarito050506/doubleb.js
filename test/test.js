#!/usr/bin/env node

/*
 * test.js
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

const doubleb = require("../src/index.js");
const fs = require("fs-extra");
const path = require("path");

doubleb.add_handler("players", "{{players}}", function (match) {
	var result;
	doubleb.config["players"].forEach(function (player) {
		result = result ? result + " - " + player + "\n" : " - " + player + "\n";
	});
	return result;
});

doubleb("./_config.json");
