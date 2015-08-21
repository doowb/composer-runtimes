/*!
 * composer-runtimes <https://github.com/doowb/composer-runtimes>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var lazy = require('lazy-cache')(require);
lazy('util');
lazy('ansi-red', 'red');
lazy('ansi-cyan', 'cyan');
lazy('ansi-green', 'green');
lazy('ansi-yellow', 'yellow');

/**
 * Listen to composer events and output runtime information.
 *
 * ```js
 * require('composer-runtimes')(composer);
 * ```
 *
 * @param  {Object} `composer` An instance of a Composer object.
 * @param  {Object} `options` Options to specify color output and stream to write to.
 * @api public
 */

function runtimes (composer, options) {
  options = options || {};

  if (typeof options.colors === 'undefined') {
    options.colors = true;
  }

  // use the stderr stream by default so other output
  // can be piped into a file with `> file.txt`
  var stream = options.stream || process.stderr;

  function write() {
    stream.write(lazy.util.format.apply(null, arguments));
  }

  function writeln() {
    write.apply(null, [].slice.call(arguments).concat(['\n']));
  }

  // setup some listeners
  composer.on('starting', function (task, run) {
    if (options.colors) {
      writeln(lazy.green('starting'), lazy.cyan('[' + task.name + ']'), run.start.toTimeString());
    } else {
      writeln('starting', '[' + task.name + ']', run.start.toTimeString());
    }
  });

  composer.on('finished', function (task, run) {
    if (options.colors) {
      writeln(lazy.yellow('finished'), lazy.cyan('[' + task.name + ']'), run.end.toTimeString());
    } else {
      writeln('finished', '[' + task.name + ']', run.end.toTimeString());
    }
  });

  composer.on('error', function (err, task, run) {
    if (options.colors) {
      writeln(lazy.red('ERROR'), (task && task.name ? lazy.cyan('[' + task.name + ']') : ''), err);
    } else {
      writeln('ERROR', (task && task.name ? '[' + task.name + ']' : ''), err);
    }
  });
};

/**
 * Exposes `runtimes`
 */

module.exports = runtimes;
