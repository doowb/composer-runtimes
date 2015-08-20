'use strict';

var assert = require('assert');
var Composer = require('composer').Composer;
var runtimes = require('./');

var composer;

describe('composer-runtimes', function () {
  beforeEach(function () {
    composer = new Composer();
  });

  it('should add listeners to composer', function (done) {
    var restore = captureOutput(process.stderr);
    runtimes(composer);
    var count = 0;
    composer.task('test', function (cb) {
      count++;
      cb();
    });
    composer.run('test', function (err) {
      var output = restore();
      if (err) return done(err);
      assert.equal(count, 1);
      assert.equal(output.length, 2);
      assert.notEqual(output[0][0].indexOf('starting'), -1);
      assert.notEqual(output[1][0].indexOf('finished'), -1);
      done();
    });
  });

  it('should output messages without colors', function (done) {
    var restore = captureOutput(process.stderr);
    runtimes(composer, {colors: false});
    var count = 0;
    composer.task('test', function (cb) {
      count++;
      cb();
    });
    composer.run('test', function (err) {
      var output = restore();
      if (err) return done(err);
      assert.equal(count, 1);
      assert.equal(output.length, 2);
      assert.notEqual(output[0][0].indexOf('starting'), -1);
      assert.notEqual(output[1][0].indexOf('finished'), -1);
      assert.equal(output[0][0].indexOf('\u001b'), -1);
      assert.equal(output[1][0].indexOf('\u001b'), -1);
      done();
    });
  });

  it('should output messages to another stream', function (done) {
    var restore = captureOutput(process.stdout);
    runtimes(composer, {stream: process.stdout});
    var count = 0;
    composer.task('test', function (cb) {
      count++;
      cb();
    });
    composer.run('test', function (err) {
      var output = restore();
      if (err) return done(err);
      assert.equal(count, 1);
      assert.equal(output.length, 2);
      assert.notEqual(output[0][0].indexOf('starting'), -1);
      assert.notEqual(output[1][0].indexOf('finished'), -1);
      done();
    });
  });

  it('should listen for errors on tasks', function (done) {
    var restore = captureOutput(process.stderr);
    runtimes(composer, {colors: false});
    var count = 0;
    composer.task('test', function (cb) {
      cb(new Error('this is an error'));
    });
    composer.run('test', function (err) {
      var output = restore();
      assert.equal(output.length, 2);
      assert.notEqual(output[0][0].indexOf('starting'), -1);
      assert.equal(output[1][0].indexOf('finished'), -1);
      assert.notEqual(output[1][0].indexOf('ERROR'), -1);
      if (err) return done();
      done(new Error('Expected an error'));
    });
  });
});

function captureOutput (stream) {
  var output = [];
  var write = stream.write;
  stream.write = function () {
    output.push([].slice.call(arguments));
  };
  return function restore () {
    stream.write = write;
    return output;
  };
}
