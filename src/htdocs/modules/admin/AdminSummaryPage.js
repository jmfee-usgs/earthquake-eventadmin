'use strict';

var CacheInvalidator = require('CacheInvalidator'),
    EventsAssociatedView = require('admin/EventsAssociatedView'),
    EventsNearbyView = require('admin/EventsNearbyView'),
    EventModulePage = require('base/EventModulePage'),
    ModalView = require('mvc/ModalView'),
    Util = require('util/Util');


var AdminSummaryPage = function (options) {
  options = Util.extend({}, options);

  this._cacheInvalidator = options.cacheInvalidator || CacheInvalidator();
  this._searchUrl = 'http://' + options.eventConfig.OFFSITE_HOST +
      options.eventConfig.SEARCH_STUB;

  EventModulePage.call(this, options);
};

AdminSummaryPage.prototype = Object.create(EventModulePage.prototype);


/**
 * Render AdminSummaryPage.
 */
AdminSummaryPage.prototype._setContentMarkup = function () {
  var el = this._content;

  el.innerHTML =
      '<div class="event-toolbar">' +
        '<button class="viewEvent">View Event Page</button>' +
        '<button class="clearCache">Clear Cache</button>' +
      '</div>' +
      '<div class="events-associated"></div>' +
      '<div class="events-nearby"></div>';

  this._onClearCacheClick = this._onClearCacheClick.bind(this);
  this._onViewEventClick = this._onViewEventClick.bind(this);

  this._clearCache = el.querySelector('.clearCache');
  this._clearCache.addEventListener('click', this._onClearCacheClick);

  this._viewEvent = el.querySelector('.viewEvent');
  this._viewEvent.addEventListener('click', this._onViewEventClick);

  this._eventsAssociatedView = EventsAssociatedView({
    el: el.querySelector('.events-associated'),
    eventDetails: this._event
  });

  this._eventsNearbyView = EventsNearbyView({
    el: el.querySelector('.events-nearby'),
    eventDetails: this._event,
    searchUrl: this._searchUrl
  });

};


/**
 * Destroy this page.
 *
 * - Unbinds event listeners;
 * - calls nested view destroy methods;
 * - clears references;
 * - calls parent destroy method.
 */
AdminSummaryPage.prototype.destroy = function () {
  // remove events
  this._clearCache.removeEventListener('click', this._onClearCacheClick);
  this._viewEvent.removeEventListener('click', this._onViewEventClick);

  // destroy views
  this._eventsAssociatedView.destroy();
  this._eventsNearbyView.destroy();

  // free referenes
  this._clearCache = null;
  this._eventsAssociatedView = null;
  this._eventsNearbyView = null;
  this._onClearCacheClick = null;
  this._onViewEventClick = null;
  this._viewEvent = null;

  // call parent destroy
  EventModulePage.prototype.destroy.call(this);
};

/**
 * Click handler for clear cache button.
 *
 * @param e {DOMEvent}
 *        click event on button.
 */
AdminSummaryPage.prototype._onClearCacheClick = function (e) {
  var el,
      okButton;

  if (e) {
    e.preventDefault();
  }

  el = document.createElement('div');
  el.innerHTML = 'Clearing cache';

  ModalView(el, {
    title: 'Clearing Caches',
    closable: false,
    buttons: [
      {
        callback: function (e, dialog) {
          el = null;
          dialog.hide();
          dialog.destroy();
        },
        classes: ['clear-cache-okay', 'green'],
        text: 'Done'
      }
    ]
  }).show();

  okButton = document.querySelector('.clear-cache-okay');
  // disable until done
  okButton.disabled = true;

  this._cacheInvalidator.invalidate(
    this._event.properties.url.replace(/.*\/\/[^\/]+/, ''),
    function (xhrStatus, xhr, data) {
      var host,
          hosts,
          html,
          server,
          status;
      // display result
      if (xhrStatus === 200) {
        html = '<dl>';
        for (server in data) {
          hosts = data[server];
          html += '<dt>' + server + '</dt>';
          for (host in hosts) {
            status = hosts[host];
            if (status === 200) {
              html += '<dd class="alert success">' + host + ' - cleared</dd>';
            } else {
              html += '<dd class="alert">' + host + ' - not cached</dd>';
            }
          }
        }
        html += '</dl>';
      } else {
        html += '<div class="alert error">' +
            '<h2>Error Clearing Caches' +
              ' <small>(' + xhrStatus + ' ' + xhr.statusText + ')</small>' +
            '</h2>' +
            '<pre>' + xhr.responseText + '</pre>' +
            '</div>';
      }
      el.innerHTML = html;
      // allow modal close
      okButton.disabled = false;
    }
  );
};


/**
 * View event click handler.
 *
 * @param e {DOMEvent}
 *        click event on button.
 */
AdminSummaryPage.prototype._onViewEventClick = function (e) {
  if (e) {
    e.preventDefault();
  }

  window.open(this._event.properties.url);
};


module.exports = AdminSummaryPage;
