/*!
 * composer-runtimes <https://github.com/doowb/composer-runtimes>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');
utils.clear = function(str) {
  return str;
};

/**
 * Listen to composer events and output runtime information.
 *
 * ```js
 * runtimes({colors: false})(composer);
 * ```
 *
 * @param  {Object} `options` Options to specify color output and stream to write to.
 * @param  {Boolean} `options.colors` Show ansi colors or not. `true` by default
 * @param  {Stream} `options.stream` Output stream to write to. `process.stderr` by default.
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

    // setup some listeners
    app.on('starting', function (task, run) {
      log('', defaultTime(run, 'start', opts), 'starting', defaultName(task, opts), '\n');
    });

    app.on('finished', function (task, run) {
      log('', defaultTime(run, 'end', opts), 'finished', defaultName(task, opts), defaultDuration(run, opts), '\n');
    });
  };
};

function defaultName(task, options) {
  options = options || {};
  if (typeof options.defaultName === 'function') {
    return options.defaultName.call(task, task.name, options);
  }
  var color = options.colors ? 'cyan' : 'clear';
  return utils[color](task.name);
}

function defaultTime(run, type, options) {
  options = options || {};
  if (typeof options.defaultTime === 'function') {
    return options.defaultTime.call(run, run.date[type], options);
  }
  var color = options.colors ? 'grey' : 'clear';
  return utils[color](utils.time('HH:mm:ss.ms', run.date[type]));
}

function defaultDuration(run, options) {
  options = options || {};
  if (typeof options.defaultDuration === 'function') {
    return options.defaultDuration.call(run, run.hr.duration, options);
  }
  var color = options.colors ? 'magenta' : 'clear';
  return utils[color](utils.pretty(run.hr.duration, 2, 'μs'));
}



/**
 * Write out strings to a stream.
 * @param  {Stream} `stream` Stream to write to (e.g. process.stdout)
 * @return {Function} Function to do the writing.
 */

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
