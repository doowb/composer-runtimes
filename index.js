/*!
 * composer-runtimes <https://github.com/doowb/composer-runtimes>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var util = require('util');
var utils = require('./utils');

/**
 * Listen to composer events and output runtime information.
 *
 * ```js
 * var app = new Composer();
 * runtimes({colors: false})(app);
 * ```
 *
 * @param  {Object} `options` Options to specify color output and stream to write to.
 * @api public
 */

function runtimes (options) {
  options = options || {};

  return function plugin (app) {
    if (app.runtimes) {
      return;
    }
    app.runtimes = true;
    var opts = utils.extend({}, options, app.options && app.options.runtimes);

    if (typeof opts.colors === 'undefined') {
      opts.colors = true;
    }

    // use the stderr stream by default so other output
    // can be piped into a file with `> file.txt`
    var stream = opts.stream || process.stderr;
    var log = write(stream);
    var time = utils.time.bind(utils.time, 'HH:mm:ss:ms');

    // setup some listeners
    app.on('starting', function (task, run) {
      if (opts.colors) {
        log('', '  ', utils.grey(time(run.start)), 'starting', utils.cyan('[' + task.name + ']'), '\n');
      } else {
        log('', ' ', time(run.start), 'starting', '[' + task.name + ']', '\n');
      }
    });

    app.on('finished', function (task, run) {
      if (opts.colors) {
        log('', utils.green(utils.success), '', utils.grey(time(run.end)), 'finished', utils.cyan('[' + task.name + ']'), '\n');
      } else {
        log('', utils.success, '', time(run.end), 'finished', '[' + task.name + ']', '\n');
      }
    });
  };
};

function write(stream) {
  return function () {
    var len = arguments.length, i = 0;
    var args = new Array(len);
    while (len--) {
      args[i] = arguments[i++];
    }
    stream.write(args.join(' '));
  };
}

/**
 * Exposes `runtimes`
 */

module.exports = runtimes;
