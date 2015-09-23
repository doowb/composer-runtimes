/*!
 * composer-runtimes <https://github.com/doowb/composer-runtimes>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var lazy = require('lazy-cache')(require);
lazy('ansi-grey', 'grey');
lazy('ansi-cyan', 'cyan');
lazy('time-stamp', 'time');
lazy('ansi-green', 'green');
lazy('extend-shallow', 'extend');
lazy('success-symbol', 'success');
module.exports = lazy;

