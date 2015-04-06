'use strict';

var Util = require('util/Util'),
    Xhr = require('util/Xhr');


var DEFAULTS = {
  url: 'invalidate_url.php'
};


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

  _this.invalidate = function (path, callback) {
    Xhr.ajax({
      method: 'POST',
      data: {
        path: path
      },
      success: function (response, xhr) {
        callback(xhr.status, xhr, JSON.parse(response));
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
