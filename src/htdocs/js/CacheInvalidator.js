'use strict';

var Util = require('util/Util'),
    Xhr = require('util/Xhr');


var DEFAULTS = {
  url: 'invalidate_url.php'
};


/**
 * Cache invalidator utility.
 *
 * @param options {Object}
 * @param options.url {String}
 *        url for cache invalidation requests.
 *        should accept 'path' parameter via POST.
 */
var CacheInvalidator = function (options) {
  var _this,
      _initialize,
      // variables
      _url;

  _this = Object.create({});

  _initialize = function () {
    options = Util.extend({}, DEFAULTS, options);
    _url = options.url;
    options = null;
  };

  /**
   * Invalidate a path.
   *
   * @param path {String}
   *        site-relative path.
   * @param callback {Function(status, xhr, data)}
   *        called after invalidation request is complete.
   *        status {Number} http response status
   *        xhr {XMLHttpRequest} request object.
   *        data {Object} status codes for different servers.
   */
  _this.invalidate = function (path, callback) {
    Xhr.ajax({
      url: _url,
      method: 'POST',
      data: {
        path: path
      },
      success: function (response, xhr) {
        callback(xhr.status, xhr, response);
      },
      error: function (status, xhr) {
        callback(xhr.status, xhr, null);
      }
    });
  };


  _initialize();
  return _this;
};


module.exports = CacheInvalidator;
