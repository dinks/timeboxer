(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/index.coffee":[function(require,module,exports){
var todo_routes;

todo_routes = require('./routers/todo_routes.coffee');

todo_routes.start();



},{"./routers/todo_routes.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/routers/todo_routes.coffee"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/flux-riot.js":[function(require,module,exports){
;(function() {

var riot = require('riot/riot')
var flux_riot = { version: '0.2.0' }

'use strict'

flux_riot.BaseStore = (function() {

  var CHANGE_EVENT = 'STORE_CHANGE_EVENT'

  function BaseStore() {
    riot.observable(this)
  }

  BaseStore.prototype = {
    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback)
    },

    removeChangeListener: function(callback) {
      this.off(CHANGE_EVENT, callback)
    },

    emitChange: function() {
      this.trigger(CHANGE_EVENT)
    }
  }

  return BaseStore

})()

flux_riot.storeMixin = function(tag, store, callback) {

  tag.store = store

  tag.on('mount', function() {
    return store.addChangeListener(callback)
  })

  tag.on('unmount', function() {
    return store.removeChangeListener(callback)
  })

}

flux_riot.BaseRouter = (function() {

  var regexFuncs = []

  function regexTransfer(path) {
    var parts = path.split('/')
    var regexParts = []
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i]
      if (!(part && part.length > 0)) continue

      if (part[0] === ':') {
        regexParts.push('((?:(?!\\/).)+?)')
      } else {
        regexParts.push(part)
      }
    }
    return RegExp("^" + (regexParts.join('\\/')) + "\\/?$", "i")
  }

  function route(path) {
    if (regexFuncs.length === 0) return

    if (path === '') return regexFuncs[0][1].apply(null, [])

    for (var i = 1; i < regexFuncs.length; i++) {
      var regexFunc = regexFuncs[i]
      var m = path.match(regexFunc[0])
      if (m != null) return regexFunc[1].apply(null, m.slice(1))
    }
  }

  function routes() {
    if (!(arguments.length > 0)) return

    regexFuncs.push([ '', arguments[0] ])
    for (var i = 1; i < arguments.length; i += 2) {
      regex = regexTransfer(arguments[i])
      regexFuncs.push([ regex, arguments[i + 1] ])
    }
  }

  function start(r) {
    return riot.route.exec(r || route)
  }

  riot.route.parser(function(path) { return [path] })
  riot.route(route)

  return {
    routes: routes,
    start: start
  }

})()

flux_riot.Constants = {
  ActionSources: {
    SERVER_ACTION: 'SERVER_ACTION',
    VIEW_ACTION: 'VIEW_ACTION'
  }
}

var Dispatcher = require('flux').Dispatcher
var assign = require('object-assign')

flux_riot.Dispatcher = assign(new Dispatcher(), {
  handleServerAction: function(action) {
    return this.handleAction(action, flux_riot.Constants.ActionSources.SERVER_ACTION)
  },

  handleViewAction: function(action) {
    return this.handleAction(action, flux_riot.Constants.ActionSources.VIEW_ACTION)
  },

  handleAction: function(action, source) {
    return this.dispatch({
      source: source,
      action: action
    })
  }
})


module.exports = flux_riot

})();

},{"flux":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/node_modules/flux/index.js","object-assign":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/object-assign/index.js","riot/riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/node_modules/flux/index.js":[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/node_modules/flux/lib/Dispatcher.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/node_modules/flux/lib/Dispatcher.js":[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/node_modules/flux/lib/invariant.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/node_modules/flux/lib/invariant.js":[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/keymirror/index.js":[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/object-assign/index.js":[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js":[function(require,module,exports){
/* Riot v2.0.15, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function(window) {
  // 'use strict' does not allow us to override the events properties https://github.com/muut/riotjs/blob/dev/lib/tag/update.js#L7-L10
  // it leads to the following error on firefox "setting a property that has only a getter"
  //'use strict'

  var riot = { version: 'v2.0.15', settings: {} },
      ieVersion = checkIE()

riot.observable = function(el) {

  el = el || {}

  var callbacks = {},
      _id = 0

  el.on = function(events, fn) {
    if (typeof fn == 'function') {
      fn._id = typeof fn._id == 'undefined' ? _id++ : fn._id

      events.replace(/\S+/g, function(name, pos) {
        (callbacks[name] = callbacks[name] || []).push(fn)
        fn.typed = pos > 0
      })
    }
    return el
  }

  el.off = function(events, fn) {
    if (events == '*') callbacks = {}
    else {
      events.replace(/\S+/g, function(name) {
        if (fn) {
          var arr = callbacks[name]
          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
            if (cb._id == fn._id) { arr.splice(i, 1); i-- }
          }
        } else {
          callbacks[name] = []
        }
      })
    }
    return el
  }

  // only single event supported
  el.one = function(name, fn) {
    function on() {
      el.off(name, on)
      fn.apply(el, arguments)
    }
    return el.on(name, on)
  }

  el.trigger = function(name) {
    var args = [].slice.call(arguments, 1),
        fns = callbacks[name] || []

    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = 1
        fn.apply(el, fn.typed ? [name].concat(args) : args)
        if (fns[i] !== fn) { i-- }
        fn.busy = 0
      }
    }

    if (callbacks.all && name != 'all') {
      el.trigger.apply(el, ['all', name].concat(args))
    }

    return el
  }

  return el

}
;(function(riot, evt, window) {

  // browsers only
  if (!window) return

  var loc = window.location,
      fns = riot.observable(),
      win = window,
      started = false,
      current

  function hash() {
    return loc.href.split('#')[1] || ''
  }

  function parser(path) {
    return path.split('/')
  }

  function emit(path) {
    if (path.type) path = hash()

    if (path != current) {
      fns.trigger.apply(null, ['H'].concat(parser(path)))
      current = path
    }
  }

  var r = riot.route = function(arg) {
    // string
    if (arg[0]) {
      loc.hash = arg
      emit(arg)

    // function
    } else {
      fns.on('H', arg)
    }
  }

  r.exec = function(fn) {
    fn.apply(null, parser(hash()))
  }

  r.parser = function(fn) {
    parser = fn
  }

  r.stop = function () {
    if (!started) return
    win.removeEventListener ? win.removeEventListener(evt, emit, false) : win.detachEvent('on' + evt, emit)
    fns.off('*')
    started = false
  }

  r.start = function () {
    if (started) return
    win.addEventListener ? win.addEventListener(evt, emit, false) : win.attachEvent('on' + evt, emit)
    started = true
  }

  // autostart the router
  r.start()

})(riot, 'hashchange', window)
/*

//// How it works?


Three ways:

1. Expressions: tmpl('{ value }', data).
   Returns the result of evaluated expression as a raw object.

2. Templates: tmpl('Hi { name } { surname }', data).
   Returns a string with evaluated expressions.

3. Filters: tmpl('{ show: !done, highlight: active }', data).
   Returns a space separated list of trueish keys (mainly
   used for setting html classes), e.g. "show highlight".


// Template examples

tmpl('{ title || "Untitled" }', data)
tmpl('Results are { results ? "ready" : "loading" }', data)
tmpl('Today is { new Date() }', data)
tmpl('{ message.length > 140 && "Message is too long" }', data)
tmpl('This item got { Math.round(rating) } stars', data)
tmpl('<h1>{ title }</h1>{ body }', data)


// Falsy expressions in templates

In templates (as opposed to single expressions) all falsy values
except zero (undefined/null/false) will default to empty string:

tmpl('{ undefined } - { false } - { null } - { 0 }', {})
// will return: " - - - 0"

*/


var brackets = (function(orig, s, b) {
  return function(x) {

    // make sure we use the current setting
    s = riot.settings.brackets || orig
    if (b != s) b = s.split(' ')

    // if regexp given, rewrite it with current brackets (only if differ from default)
    return x && x.test
      ? s == orig
        ? x : RegExp(x.source
                      .replace(/\{/g, b[0].replace(/(?=.)/g, '\\'))
                      .replace(/\}/g, b[1].replace(/(?=.)/g, '\\')),
                    x.global ? 'g' : '')

      // else, get specific bracket
      : b[x]

  }
})('{ }')


var tmpl = (function() {

  var cache = {},
      reVars = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi
              // [ 1               ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
              // find variable names:
              // 1. skip quoted strings and regexps: "a b", 'a b', 'a \'b\'', /a b/
              // 2. skip object properties: .name
              // 3. skip object literals: name:
              // 4. skip javascript keywords
              // 5. match var name

  // build a template (or get it from cache), render with data
  return function(str, data) {
    return str && (cache[str] = cache[str] || tmpl(str))(data)
  }


  // create a template instance

  function tmpl(s, p) {

    // default template string to {}
    s = (s || (brackets(0) + brackets(1)))

      // temporarily convert \{ and \} to a non-character
      .replace(brackets(/\\{/g), '\uFFF0')
      .replace(brackets(/\\}/g), '\uFFF1')

    // split string to expression and non-expresion parts
    p = split(s, extract(s, brackets(/{/), brackets(/}/)))

    return new Function('d', 'return ' + (

      // is it a single expression or a template? i.e. {x} or <b>{x}</b>
      !p[0] && !p[2] && !p[3]

        // if expression, evaluate it
        ? expr(p[1])

        // if template, evaluate all expressions in it
        : '[' + p.map(function(s, i) {

            // is it an expression or a string (every second part is an expression)
          return i % 2

              // evaluate the expressions
              ? expr(s, true)

              // process string parts of the template:
              : '"' + s

                  // preserve new lines
                  .replace(/\n/g, '\\n')

                  // escape quotes
                  .replace(/"/g, '\\"')

                + '"'

        }).join(',') + '].join("")'
      )

      // bring escaped { and } back
      .replace(/\uFFF0/g, brackets(0))
      .replace(/\uFFF1/g, brackets(1))

    + ';')

  }


  // parse { ... } expression

  function expr(s, n) {
    s = s

      // convert new lines to spaces
      .replace(/\n/g, ' ')

      // trim whitespace, brackets, strip comments
      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

    // is it an object literal? i.e. { key : value }
    return /^\s*[\w- "']+ *:/.test(s)

      // if object literal, return trueish keys
      // e.g.: { show: isOpen(), done: item.done } -> "show done"
      ? '[' +

          // extract key:val pairs, ignoring any nested objects
          extract(s,

              // name part: name:, "name":, 'name':, name :
              /["' ]*[\w- ]+["' ]*:/,

              // expression part: everything upto a comma followed by a name (see above) or end of line
              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
              ).map(function(pair) {

                // get key, val parts
                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

                  // wrap all conditional parts to ignore errors
                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

                })

              }).join('')

        + '].join(" ").trim()'

      // if js expression, evaluate as javascript
      : wrap(s, n)

  }


  // execute js w/o breaking on errors or undefined vars

  function wrap(s, nonull) {
    s = s.trim()
    return !s ? '' : '(function(v){try{v='

        // prefix vars (name => data.name)
        + (s.replace(reVars, function(s, _, v) { return v ? '(d.'+v+'===undefined?'+(typeof window == 'undefined' ? 'global.' : 'window.')+v+':d.'+v+')' : s })

          // break the expression if its empty (resulting in undefined value)
          || 'x')

      + '}finally{return '

        // default to empty string for falsy values except zero
        + (nonull === true ? '!v&&v!==0?"":v' : 'v')

      + '}}).call(d)'
  }


  // split string by an array of substrings

  function split(str, substrings) {
    var parts = []
    substrings.map(function(sub, i) {

      // push matched expression and part before it
      i = str.indexOf(sub)
      parts.push(str.slice(0, i), sub)
      str = str.slice(i + sub.length)
    })

    // push the remaining part
    return parts.concat(str)
  }


  // match strings between opening and closing regexp, skipping any inner/nested matches

  function extract(str, open, close) {

    var start,
        level = 0,
        matches = [],
        re = new RegExp('('+open.source+')|('+close.source+')', 'g')

    str.replace(re, function(_, open, close, pos) {

      // if outer inner bracket, mark position
      if(!level && open) start = pos

      // in(de)crease bracket level
      level += open ? 1 : -1

      // if outer closing bracket, grab the match
      if(!level && close != null) matches.push(str.slice(start, pos+close.length))

    })

    return matches
  }

})()

// { key, i in items} -> { key, i, items }
function loopKeys(expr) {
  var ret = { val: expr },
      els = expr.split(/\s+in\s+/)

  if (els[1]) {
    ret.val = brackets(0) + els[1]
    els = els[0].slice(brackets(0).length).trim().split(/,\s*/)
    ret.key = els[0]
    ret.pos = els[1]
  }

  return ret
}

function mkitem(expr, key, val) {
  var item = {}
  item[expr.key] = key
  if (expr.pos) item[expr.pos] = val
  return item
}


/* Beware: heavy stuff */
function _each(dom, parent, expr) {

  remAttr(dom, 'each')

  var template = dom.outerHTML,
      prev = dom.previousSibling,
      root = dom.parentNode,
      rendered = [],
      tags = [],
      checksum

  expr = loopKeys(expr)

  function add(pos, item, tag) {
    rendered.splice(pos, 0, item)
    tags.splice(pos, 0, tag)
  }

  // clean template code
  parent.one('update', function() {
    root.removeChild(dom)

  }).one('premount', function() {
    if (root.stub) root = parent.root

  }).on('update', function() {

    var items = tmpl(expr.val, parent)
    if (!items) return

    // object loop. any changes cause full redraw
    if (!Array.isArray(items)) {
      var testsum = JSON.stringify(items)
      if (testsum == checksum) return
      checksum = testsum

      // clear old items
      each(tags, function(tag) { tag.unmount() })
      rendered = []
      tags = []

      items = Object.keys(items).map(function(key) {
        return mkitem(expr, key, items[key])
      })

    }

    // unmount redundant
    each(rendered, function(item) {
      if (item instanceof Object) {
        // skip existing items
        if (items.indexOf(item) > -1) {
          return
        }
      } else {
        // find all non-objects
        var newItems = arrFindEquals(items, item),
            oldItems = arrFindEquals(rendered, item)

        // if more or equal amount, no need to remove
        if (newItems.length >= oldItems.length) {
          return
        }
      }
      var pos = rendered.indexOf(item),
          tag = tags[pos]

      if (tag) {
        tag.unmount()
        rendered.splice(pos, 1)
        tags.splice(pos, 1)
        // to let "each" know that this item is removed
        return false
      }

    })

    // mount new / reorder
    var prevBase = [].indexOf.call(root.childNodes, prev) + 1
    each(items, function(item, i) {

      // start index search from position based on the current i
      var pos = items.indexOf(item, i),
          oldPos = rendered.indexOf(item, i)

      // if not found, search backwards from current i position
      pos < 0 && (pos = items.lastIndexOf(item, i))
      oldPos < 0 && (oldPos = rendered.lastIndexOf(item, i))

      if (!(item instanceof Object)) {
        // find all non-objects
        var newItems = arrFindEquals(items, item),
            oldItems = arrFindEquals(rendered, item)

        // if more, should mount one new
        if (newItems.length > oldItems.length) {
          oldPos = -1
        }
      }

      // mount new
      var nodes = root.childNodes
      if (oldPos < 0) {
        if (!checksum && expr.key) var _item = mkitem(expr, item, pos)

        var tag = new Tag({ tmpl: template }, {
          before: nodes[prevBase + pos],
          parent: parent,
          root: root,
          item: _item || item
        })

        tag.mount()

        add(pos, item, tag)
        return true
      }

      // change pos value
      if (expr.pos && tags[oldPos][expr.pos] != pos) {
        tags[oldPos].one('update', function(item) {
          item[expr.pos] = pos
        })
        tags[oldPos].update()
      }

      // reorder
      if (pos != oldPos) {
        root.insertBefore(nodes[prevBase + oldPos], nodes[prevBase + (pos > oldPos ? pos + 1 : pos)])
        return add(pos, rendered.splice(oldPos, 1)[0], tags.splice(oldPos, 1)[0])
      }

    })

    rendered = items.slice()

  })

}


function parseNamedElements(root, parent, childTags) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      if(dom.parentNode && dom.parentNode.isLoop) dom.isLoop = 1
      if(dom.getAttribute('each')) dom.isLoop = 1
      // custom child tag
      var child = getTag(dom)

      if (child && !dom.isLoop) {
        var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
          tagName = child.name,
          ptag = parent,
          cachedTag

        while(!getTag(ptag.root)) {
          if(!ptag.parent) break
          ptag = ptag.parent
        }
        // fix for the parent attribute in the looped elements
        tag.parent = ptag

        cachedTag = ptag.tags[tagName]

        // if there are multiple children tags having the same name
        if (cachedTag) {
          // if the parent tags property is not yet an array
          // create it adding the first cached tag
          if (!Array.isArray(cachedTag))
            ptag.tags[tagName] = [cachedTag]
          // add the new nested tag to the array
          ptag.tags[tagName].push(tag)
        } else {
          ptag.tags[tagName] = tag
        }

        // empty the child node once we got its template
        // to avoid that its children get compiled multiple times
        dom.innerHTML = ''
        childTags.push(tag)
      }

      each(dom.attributes, function(attr) {
        if (/^(name|id)$/.test(attr.name)) parent[attr.value] = dom
      })
    }

  })

}

function parseExpressions(root, tag, expressions) {

  function addExpr(dom, val, extra) {
    if (val.indexOf(brackets(0)) >= 0) {
      var expr = { dom: dom, expr: val }
      expressions.push(extend(expr, extra))
    }
  }

  walk(root, function(dom) {
    var type = dom.nodeType

    // text node
    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
    if (type != 1) return

    /* element */

    // loop
    var attr = dom.getAttribute('each')
    if (attr) { _each(dom, tag, attr); return false }

    // attribute expressions
    each(dom.attributes, function(attr) {
      var name = attr.name,
        bool = name.split('__')[1]

      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
      if (bool) { remAttr(dom, name); return false }

    })

    // skip custom tags
    if (getTag(dom)) return false

  })

}
function Tag(impl, conf, innerHTML) {

  var self = riot.observable(this),
      opts = inherit(conf.opts) || {},
      dom = mkdom(impl.tmpl),
      parent = conf.parent,
      expressions = [],
      childTags = [],
      root = conf.root,
      item = conf.item,
      fn = impl.fn,
      tagName = root.tagName.toLowerCase(),
      attr = {},
      loopDom

  if (fn && root._tag) {
    root._tag.unmount(true)
  }
  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  this._id = ~~(new Date().getTime() * Math.random())

  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

  // grab attributes
  each(root.attributes, function(el) {
    attr[el.name] = el.value
  })


  if (dom.innerHTML && !/select/.test(tagName))
    // replace all the yield tags with the tag inner html
    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)


  // options
  function updateOpts() {
    each(Object.keys(attr), function(name) {
      opts[name] = tmpl(attr[name], parent || self)
    })
  }

  this.update = function(data, init) {
    extend(self, data, item)
    updateOpts()
    self.trigger('update', item)
    update(expressions, self, item)
    self.trigger('updated')
  }

  this.mount = function() {

    updateOpts()

    // initialiation
    fn && fn.call(self, opts)

    toggle(true)

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions)

    if (!self.parent) self.update()

    // internal use only, fixes #403
    self.trigger('premount')

    if (fn) {
      while (dom.firstChild) root.appendChild(dom.firstChild)

    } else {
      loopDom = dom.firstChild
      root.insertBefore(loopDom, conf.before || null) // null needed for IE8
    }

    if (root.stub) self.root = root = parent.root
    self.trigger('mount')

  }


  this.unmount = function(keepRootTag) {
    var el = fn ? root : loopDom,
        p = el.parentNode

    if (p) {

      if (parent) {
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (Array.isArray(parent.tags[tagName])) {
          each(parent.tags[tagName], function(tag, i) {
            if (tag._id == self._id)
              parent.tags[tagName].splice(i, 1)
          })
        } else
          // otherwise just delete the tag instance
          delete parent.tags[tagName]
      } else {
        while (el.firstChild) el.removeChild(el.firstChild)
      }

      if (!keepRootTag)
        p.removeChild(el)

    }


    self.trigger('unmount')
    toggle()
    self.off('*')
    // somehow ie8 does not like `delete root._tag`
    root._tag = null

  }

  function toggle(isMount) {

    // mount/unmount children
    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

    // listen/unlisten parent (events flow one way from parent to children)
    if (parent) {
      var evt = isMount ? 'on' : 'off'
      parent[evt]('update', self.update)[evt]('unmount', self.unmount)
    }
  }

  // named elements available for fn
  parseNamedElements(dom, this, childTags)


}

function setEventHandler(name, handler, dom, tag, item) {

  dom[name] = function(e) {

    // cross browser event fix
    e = e || window.event
    e.which = e.which || e.charCode || e.keyCode
    e.target = e.target || e.srcElement
    e.currentTarget = dom
    e.item = item

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      e.preventDefault && e.preventDefault()
      e.returnValue = false
    }

    var el = item ? tag.parent : tag
    el.update()

  }

}

// used by if- attribute
function insertTo(root, node, before) {
  if (root) {
    root.insertBefore(before, node)
    root.removeChild(node)
  }
}

// item = currently looped item
function update(expressions, tag, item) {

  each(expressions, function(expr, i) {

    var dom = expr.dom,
        attrName = expr.attr,
        value = tmpl(expr.expr, tag),
        parent = expr.dom.parentNode

    if (value == null) value = ''

    // leave out riot- prefixes from strings inside textarea
    if (parent && parent.tagName == 'TEXTAREA') value = value.replace(/riot-/g, '')

    // no change
    if (expr.value === value) return
    expr.value = value

    // text node
    if (!attrName) return dom.nodeValue = value

    // remove original attribute
    remAttr(dom, attrName)

    // event handler
    if (typeof value == 'function') {
      setEventHandler(attrName, value, dom, tag, item)

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub

      // add to DOM
      if (value) {
        stub && insertTo(stub.parentNode, stub, dom)

      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('')
        insertTo(dom.parentNode, dom, stub)
      }

    // show / hide
    } else if (/^(show|hide)$/.test(attrName)) {
      if (attrName == 'hide') value = !value
      dom.style.display = value ? '' : 'none'

    // field value
    } else if (attrName == 'value') {
      dom.value = value

    // <img src="{ expr }">
    } else if (attrName.slice(0, 5) == 'riot-') {
      attrName = attrName.slice(5)
      value ? dom.setAttribute(attrName, value) : remAttr(dom, attrName)

    } else {
      if (expr.bool) {
        dom[attrName] = value
        if (!value) return
        value = attrName
      }

      if (typeof value != 'object') dom.setAttribute(attrName, value)

    }

  })

}
function each(els, fn) {
  for (var i = 0, len = (els || []).length, el; i < len; i++) {
    el = els[i]
    // return false -> remove current item during loop
    if (el != null && fn(el, i) === false) i--
  }
  return els
}

function remAttr(dom, name) {
  dom.removeAttribute(name)
}

// max 2 from objects allowed
function extend(obj, from, from2) {
  from && each(Object.keys(from), function(key) {
    obj[key] = from[key]
  })
  return from2 ? extend(obj, from2) : obj
}

function checkIE() {
  if (window) {
    var ua = navigator.userAgent
    var msie = ua.indexOf('MSIE ')
    if (msie > 0) {
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
    }
    else {
      return 0
    }
  }
}

function optionInnerHTML(el, html) {
  var opt = document.createElement('option'),
      valRegx = /value=[\"'](.+?)[\"']/,
      selRegx = /selected=[\"'](.+?)[\"']/,
      valuesMatch = html.match(valRegx),
      selectedMatch = html.match(selRegx)

  opt.innerHTML = html

  if (valuesMatch) {
    opt.value = valuesMatch[1]
  }

  if (selectedMatch) {
    opt.setAttribute('riot-selected', selectedMatch[1])
  }

  el.appendChild(opt)
}

function mkdom(template) {
  var tagName = template.trim().slice(1, 3).toLowerCase(),
      rootTag = /td|th/.test(tagName) ? 'tr' : tagName == 'tr' ? 'tbody' : 'div',
      el = document.createElement(rootTag)

  el.stub = true

  if (tagName === 'op' && ieVersion && ieVersion < 10) {
    optionInnerHTML(el, template)
  } else {
    el.innerHTML = template
  }
  return el
}

function walk(dom, fn) {
  if (dom) {
    if (fn(dom) === false) walk(dom.nextSibling, fn)
    else {
      dom = dom.firstChild

      while (dom) {
        walk(dom, fn)
        dom = dom.nextSibling
      }
    }
  }
}

function replaceYield (tmpl, innerHTML) {
  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gim, innerHTML || '')
}

function $$(selector, ctx) {
  ctx = ctx || document
  return ctx.querySelectorAll(selector)
}

function arrDiff(arr1, arr2) {
  return arr1.filter(function(el) {
    return arr2.indexOf(el) < 0
  })
}

function arrFindEquals(arr, el) {
  return arr.filter(function (_el) {
    return _el === el
  })
}

function inherit(parent) {
  function Child() {}
  Child.prototype = parent
  return new Child()
}

/*
 Virtual dom is an array of custom tags on the document.
 Updates and unmounts propagate downwards from parent to children.
*/

var virtualDom = [],
    tagImpl = {}


function getTag(dom) {
  return tagImpl[dom.getAttribute('riot-tag') || dom.tagName.toLowerCase()]
}

function injectStyle(css) {
  var node = document.createElement('style')
  node.innerHTML = css
  document.head.appendChild(node)
}

function mountTo(root, tagName, opts) {
  var tag = tagImpl[tagName],
      innerHTML = root.innerHTML

  // clear the inner html
  root.innerHTML = ''

  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

  if (tag && tag.mount) {
    tag.mount()
    virtualDom.push(tag)
    return tag.on('unmount', function() {
      virtualDom.splice(virtualDom.indexOf(tag), 1)
    })
  }

}

riot.tag = function(name, html, css, fn) {
  if (typeof css == 'function') fn = css
  else if (css) injectStyle(css)
  tagImpl[name] = { name: name, tmpl: html, fn: fn }
  return name
}

riot.mount = function(selector, tagName, opts) {

  var el,
      selctAllTags = function(sel) {
        sel = Object.keys(tagImpl).join(', ')
        sel.split(',').map(function(t) {
          sel += ', *[riot-tag="'+ t.trim() + '"]'
        })
        return sel
      },
      tags = []

  if (typeof tagName == 'object') { opts = tagName; tagName = 0 }

  // crawl the DOM to find the tag
  if(typeof selector == 'string') {
    if (selector == '*') {
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = selctAllTags(selector)
    }
    // or just the ones named like the selector
    el = $$(selector)
  }
  // probably you have passed already a tag or a NodeList
  else
    el = selector

  // select all the registered and mount them inside their root elements
  if (tagName == '*') {
    // get all custom tags
    tagName = selctAllTags(selector)
    // if the root el it's just a single tag
    if (el.tagName) {
      el = $$(tagName, el)
    } else {
      var nodeList = []
      // select all the children for all the different root elements
      each(el, function(tag) {
        nodeList = $$(tagName, tag)
      })
      el = nodeList
    }
    // get rid of the tagName
    tagName = 0
  }

  function push(root) {
    var name = tagName || root.getAttribute('riot-tag') || root.tagName.toLowerCase(),
        tag = mountTo(root, name, opts)

    if (tag) tags.push(tag)
  }

  // DOM node
  if (el.tagName)
    push(selector)
  // selector or NodeList
  else
    each(el, push)

  return tags

}

// update everything
riot.update = function() {
  return each(virtualDom, function(tag) {
    tag.update()
  })
}

// @deprecated
riot.mountTo = riot.mount



  // share methods for other riot parts, e.g. compiler
  riot.util = { brackets: brackets, tmpl: tmpl }

  // support CommonJS, AMD & browser
  if (typeof exports === 'object')
    module.exports = riot
  else if (typeof define === 'function' && define.amd)
    define(function() { return riot })
  else
    window.riot = riot

})(typeof window != 'undefined' ? window : undefined);

},{}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/actions/todos.coffee":[function(require,module,exports){
var ActionTypes, Dispatcher, dispatch;

Dispatcher = require('flux-riot').Dispatcher;

ActionTypes = require('../constants/app_constants.coffee').ActionTypes;

dispatch = function(type, data) {
  return Dispatcher.handleViewAction({
    type: type,
    data: data
  });
};

module.exports = {
  saveTask: function(task) {
    return dispatch(ActionTypes.TASK_SAVE, task);
  },
  removeTask: function(task) {
    return dispatch(ActionTypes.TASK_REMOVE, task);
  },
  toggleTask: function(task) {
    return dispatch(ActionTypes.TASK_TOGGLE, task);
  },
  clearTasks: function() {
    return dispatch(ActionTypes.TASK_CLEAR);
  }
};



},{"../constants/app_constants.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/constants/app_constants.coffee","flux-riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/flux-riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_app.tag":[function(require,module,exports){
var riot = require('riot');
require('./todo_list.tag')
var todos = require('../actions/todos.coffee')
var flux_riot = require('flux-riot')

riot.tag('todo-app', '<h3>{ opts.title }</h3> <todo-list items="{ items }"></todo-list> <div class="actions"> <button onclick="{ add }">Add #{ items.length + 1 }</button> </div>', function(opts) {

  this.add = function() {
    riot.route('todos/add')
  }.bind(this);

  this.getDataFromStore = function() {
    this.items = this.store.getAll()
  }.bind(this);

  this.updateFromStore = function() {
    this.getDataFromStore()
    this.update()
  }.bind(this);

  flux_riot.storeMixin(this, opts.store, this.updateFromStore)

  this.getDataFromStore()


});

},{"../actions/todos.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/actions/todos.coffee","./todo_list.tag":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_list.tag","flux-riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_edit.tag":[function(require,module,exports){
var riot = require('riot');
var todos = require('../actions/todos.coffee')

riot.tag('todo-edit', '<h1>{ title }</h1> <div> <div class=\'form-row\'> <div> <label for=\'txtTitle\'>Task</label> <input placeholder=\'your new task\' type=\'text\' size="60" onkeyup="{ keyup }" name=\'txtTitle\' value="{ item.title }"> </div> </div> <div class="actions"> <button onclick="{ save }">Create</button> <button onclick="{ cancel }">Cancel</button> </div> </div>', function(opts) {

  if (opts.taskId) {
    this.title = 'Edit Taks ' + opts.taskId
    var task = opts.store.getTask(opts.taskId)
    this.item = { id: task.id, title: task.title }
  } else {
    this.title = 'Create new Task'
    this.item = {}
  }

  this.keyup = function(event) {
    if (event.keyCode == 13) {
      this.save()
    }
  }.bind(this);

  this.save = function() {
    this.item.title = this.txtTitle.value
    todos.saveTask(this.item)
    riot.route('#')
  }.bind(this);

  this.cancel = function() {
    riot.route('#')
  }.bind(this);

  this.on('mount', function() { this.txtTitle.focus() })


});

},{"../actions/todos.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/actions/todos.coffee","riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_item.tag":[function(require,module,exports){
var riot = require('riot');
var todos = require('../actions/todos.coffee')

riot.tag('todo-item', '<li class="{ todo-item: true, completed: item.done }"> <label> <input type="checkbox" __checked="{ item.done }" onclick="{ toggle }"> { item.title } </label> <a href="javascript:void(0)" onclick="{ remove }">Remove</a> <a href="javascript:void(0)" onclick="{ edit }">Edit</a> </li>', function(opts) {

  this.item = opts.item

  this.toggle = function() {
    todos.toggleTask(this.item)

    return true
  }.bind(this);

  this.remove = function() {
    if (confirm("Remove this task?")) todos.removeTask(this.item)
  }.bind(this);

  this.edit = function() {
    riot.route('todos/edit/' + this.item.id)
  }.bind(this);


});

},{"../actions/todos.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/actions/todos.coffee","riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_list.tag":[function(require,module,exports){
var riot = require('riot');
require('./todo_item.tag')

riot.tag('todo-list', '<ul> <todo-item each="{ item in opts.items }" item="{ item }"></todo-item> </ul>', function(opts) {

});

},{"./todo_item.tag":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_item.tag","riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/constants/app_constants.coffee":[function(require,module,exports){
var keymirror;

keymirror = require('keymirror');

module.exports = {
  ActionTypes: keymirror({
    TASK_SAVE: null,
    TASK_REMOVE: null,
    TASK_TOGGLE: null,
    TASK_CLEAR: null
  })
};



},{"keymirror":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/keymirror/index.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/presenters/todo_presenter.coffee":[function(require,module,exports){
var app_tag, mount, riot, todo_store, unmount;

riot = require('riot/riot');

todo_store = require('../stores/todo_store.coffee');

require('../components/todo_app.tag');

require('../components/todo_edit.tag');

app_tag = null;

unmount = function() {
  if (app_tag) {
    return app_tag.unmount();
  }
};

mount = function(tag, opts) {
  var app_container;
  app_container = document.createElement("div");
  app_container.id = 'app-container';
  document.getElementById('container').appendChild(app_container);
  return riot.mount('#app-container', tag, opts)[0];
};

module.exports = {
  list: function() {
    unmount();
    return app_tag = mount('todo-app', {
      title: "Todo App",
      store: todo_store
    });
  },
  edit: function(id) {
    unmount();
    return app_tag = mount('todo-edit', {
      taskId: id,
      store: todo_store
    });
  }
};



},{"../components/todo_app.tag":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_app.tag","../components/todo_edit.tag":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/components/todo_edit.tag","../stores/todo_store.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/stores/todo_store.coffee","riot/riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/routers/todo_routes.coffee":[function(require,module,exports){
var BaseRouter, riot, todo_presenter;

riot = require('riot/riot');

BaseRouter = require('flux-riot').BaseRouter;

todo_presenter = require('../presenters/todo_presenter.coffee');

BaseRouter.routes(todo_presenter.list, 'todos/add', todo_presenter.edit, 'todos/edit/:id', todo_presenter.edit);

module.exports = {
  start: BaseRouter.start
};



},{"../presenters/todo_presenter.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/presenters/todo_presenter.coffee","flux-riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/flux-riot.js","riot/riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/riot/riot.js"}],"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/stores/todo_store.coffee":[function(require,module,exports){
var ActionTypes, Dispatcher, TodoStore, addTask, assign, flux_riot, getTasks, gid, _tasks;

assign = require('object-assign');

Dispatcher = require('flux-riot').Dispatcher;

ActionTypes = require('../constants/app_constants.coffee').ActionTypes;

flux_riot = require('flux-riot');

gid = 1;

_tasks = [
  {
    id: gid++,
    title: 'Custom tags',
    done: true
  }, {
    id: gid++,
    title: 'Minimal syntax',
    done: true
  }, {
    id: gid++,
    title: 'Virtual DOM',
    done: true
  }, {
    id: gid++,
    title: 'Full stack'
  }, {
    id: gid++,
    title: 'IE8'
  }
];

addTask = function(title, done) {
  if (done == null) {
    done = false;
  }
  return _tasks.push({
    id: gid++,
    title: title,
    done: done
  });
};

getTasks = function() {
  return _tasks;
};

TodoStore = assign(new flux_riot.BaseStore(), {
  getAll: function() {
    return getTasks();
  },
  getTask: function(id) {
    var task, _i, _len, _ref;
    _ref = TodoStore.getAll();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      task = _ref[_i];
      if (task.id === parseInt(id)) {
        return task;
      }
    }
  },
  dispatchToken: Dispatcher.register(function(payload) {
    var action, data, index, task;
    action = payload.action;
    switch (action.type) {
      case ActionTypes.TASK_SAVE:
        data = action.data;
        if (data.id) {
          task = TodoStore.getTask(data.id);
          task.title = data.title;
          return TodoStore.emitChange();
        } else if (data.title) {
          addTask(data.title);
          return TodoStore.emitChange();
        }
        break;
      case ActionTypes.TASK_TOGGLE:
        task = action.data;
        return task.done = !task.done;
      case ActionTypes.TASK_REMOVE:
        task = action.data;
        index = TodoStore.getAll().indexOf(task);
        TodoStore.getAll().splice(index, 1);
        return TodoStore.emitChange();
    }
  })
});

module.exports = TodoStore;



},{"../constants/app_constants.coffee":"/Users/dvasudevan/Downloads/Hack/timeboxer/src/js/constants/app_constants.coffee","flux-riot":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/flux-riot/flux-riot.js","object-assign":"/Users/dvasudevan/Downloads/Hack/timeboxer/node_modules/object-assign/index.js"}]},{},["./src/js/index.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZHZhc3VkZXZhbi9Eb3dubG9hZHMvSGFjay90aW1lYm94ZXIvc3JjL2pzL2luZGV4LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9mbHV4LXJpb3QvZmx1eC1yaW90LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgtcmlvdC9ub2RlX21vZHVsZXMvZmx1eC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4LXJpb3Qvbm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC1yaW90L25vZGVfbW9kdWxlcy9mbHV4L2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMva2V5bWlycm9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmlvdC9yaW90LmpzIiwiL1VzZXJzL2R2YXN1ZGV2YW4vRG93bmxvYWRzL0hhY2svdGltZWJveGVyL3NyYy9qcy9hY3Rpb25zL3RvZG9zLmNvZmZlZSIsInNyYy9qcy9jb21wb25lbnRzL3RvZG9fYXBwLnRhZyIsInNyYy9qcy9jb21wb25lbnRzL3RvZG9fZWRpdC50YWciLCJzcmMvanMvY29tcG9uZW50cy90b2RvX2l0ZW0udGFnIiwic3JjL2pzL2NvbXBvbmVudHMvdG9kb19saXN0LnRhZyIsIi9Vc2Vycy9kdmFzdWRldmFuL0Rvd25sb2Fkcy9IYWNrL3RpbWVib3hlci9zcmMvanMvY29uc3RhbnRzL2FwcF9jb25zdGFudHMuY29mZmVlIiwiL1VzZXJzL2R2YXN1ZGV2YW4vRG93bmxvYWRzL0hhY2svdGltZWJveGVyL3NyYy9qcy9wcmVzZW50ZXJzL3RvZG9fcHJlc2VudGVyLmNvZmZlZSIsIi9Vc2Vycy9kdmFzdWRldmFuL0Rvd25sb2Fkcy9IYWNrL3RpbWVib3hlci9zcmMvanMvcm91dGVycy90b2RvX3JvdXRlcy5jb2ZmZWUiLCIvVXNlcnMvZHZhc3VkZXZhbi9Eb3dubG9hZHMvSGFjay90aW1lYm94ZXIvc3JjL2pzL3N0b3Jlcy90b2RvX3N0b3JlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsV0FBQTs7QUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFTLDhCQUFULENBQWQsQ0FBQTs7QUFBQSxXQUNXLENBQUMsS0FBWixDQUFBLENBREEsQ0FBQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QVcsQ0FBQyxTQURuQjtBQUVJLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxJQUFkLENBQUE7QUFHQSxRQUFBLElBQUcsSUFBSSxDQUFDLEVBQVI7QUFDRSxVQUFBLElBQUEsR0FBTyxTQUFTLENBQUMsT0FBVixDQUFrQixJQUFJLENBQUMsRUFBdkIsQ0FBUCxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQyxLQURsQixDQUFBO2lCQUVBLFNBQVMsQ0FBQyxVQUFWLENBQUEsRUFIRjtTQUFBLE1BSUssSUFBRyxJQUFJLENBQUMsS0FBUjtBQUNILFVBQUEsT0FBQSxDQUFRLElBQUksQ0FBQyxLQUFiLENBQUEsQ0FBQTtpQkFDQSxTQUFTLENBQUMsVUFBVixDQUFBLEVBRkc7U0FUVDtBQUNPO0FBRFAsV0FZTyxXQUFXLENBQUMsV0FabkI7QUFhSSxRQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsSUFBZCxDQUFBO2VBQ0EsSUFBSSxDQUFDLElBQUwsR0FBWSxDQUFBLElBQUssQ0FBQyxLQWR0QjtBQUFBLFdBZU8sV0FBVyxDQUFDLFdBZm5CO0FBZ0JJLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxJQUFkLENBQUE7QUFBQSxRQUNBLEtBQUEsR0FBUSxTQUFTLENBQUMsTUFBVixDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsSUFBM0IsQ0FEUixDQUFBO0FBQUEsUUFFQSxTQUFTLENBQUMsTUFBVixDQUFBLENBQWtCLENBQUMsTUFBbkIsQ0FBMEIsS0FBMUIsRUFBaUMsQ0FBakMsQ0FGQSxDQUFBO2VBR0EsU0FBUyxDQUFDLFVBQVYsQ0FBQSxFQW5CSjtBQUFBLEtBRmlDO0VBQUEsQ0FBcEIsQ0FOZjtDQURVLENBdkJaLENBQUE7O0FBQUEsTUFzRE0sQ0FBQyxPQUFQLEdBQWlCLFNBdERqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInRvZG9fcm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXJzL3RvZG9fcm91dGVzLmNvZmZlZSdcbnRvZG9fcm91dGVzLnN0YXJ0KClcbiIsIjsoZnVuY3Rpb24oKSB7XG5cbnZhciByaW90ID0gcmVxdWlyZSgncmlvdC9yaW90JylcbnZhciBmbHV4X3Jpb3QgPSB7IHZlcnNpb246ICcwLjIuMCcgfVxuXG4ndXNlIHN0cmljdCdcblxuZmx1eF9yaW90LkJhc2VTdG9yZSA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgQ0hBTkdFX0VWRU5UID0gJ1NUT1JFX0NIQU5HRV9FVkVOVCdcblxuICBmdW5jdGlvbiBCYXNlU3RvcmUoKSB7XG4gICAgcmlvdC5vYnNlcnZhYmxlKHRoaXMpXG4gIH1cblxuICBCYXNlU3RvcmUucHJvdG90eXBlID0ge1xuICAgIGFkZENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKVxuICAgIH0sXG5cbiAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub2ZmKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spXG4gICAgfSxcblxuICAgIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cmlnZ2VyKENIQU5HRV9FVkVOVClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQmFzZVN0b3JlXG5cbn0pKClcblxuZmx1eF9yaW90LnN0b3JlTWl4aW4gPSBmdW5jdGlvbih0YWcsIHN0b3JlLCBjYWxsYmFjaykge1xuXG4gIHRhZy5zdG9yZSA9IHN0b3JlXG5cbiAgdGFnLm9uKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaylcbiAgfSlcblxuICB0YWcub24oJ3VubW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spXG4gIH0pXG5cbn1cblxuZmx1eF9yaW90LkJhc2VSb3V0ZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIHJlZ2V4RnVuY3MgPSBbXVxuXG4gIGZ1bmN0aW9uIHJlZ2V4VHJhbnNmZXIocGF0aCkge1xuICAgIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoJy8nKVxuICAgIHZhciByZWdleFBhcnRzID0gW11cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGFydCA9IHBhcnRzW2ldXG4gICAgICBpZiAoIShwYXJ0ICYmIHBhcnQubGVuZ3RoID4gMCkpIGNvbnRpbnVlXG5cbiAgICAgIGlmIChwYXJ0WzBdID09PSAnOicpIHtcbiAgICAgICAgcmVnZXhQYXJ0cy5wdXNoKCcoKD86KD8hXFxcXC8pLikrPyknKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnZXhQYXJ0cy5wdXNoKHBhcnQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBSZWdFeHAoXCJeXCIgKyAocmVnZXhQYXJ0cy5qb2luKCdcXFxcLycpKSArIFwiXFxcXC8/JFwiLCBcImlcIilcbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdXRlKHBhdGgpIHtcbiAgICBpZiAocmVnZXhGdW5jcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgaWYgKHBhdGggPT09ICcnKSByZXR1cm4gcmVnZXhGdW5jc1swXVsxXS5hcHBseShudWxsLCBbXSlcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcmVnZXhGdW5jcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlZ2V4RnVuYyA9IHJlZ2V4RnVuY3NbaV1cbiAgICAgIHZhciBtID0gcGF0aC5tYXRjaChyZWdleEZ1bmNbMF0pXG4gICAgICBpZiAobSAhPSBudWxsKSByZXR1cm4gcmVnZXhGdW5jWzFdLmFwcGx5KG51bGwsIG0uc2xpY2UoMSkpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcm91dGVzKCkge1xuICAgIGlmICghKGFyZ3VtZW50cy5sZW5ndGggPiAwKSkgcmV0dXJuXG5cbiAgICByZWdleEZ1bmNzLnB1c2goWyAnJywgYXJndW1lbnRzWzBdIF0pXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHJlZ2V4ID0gcmVnZXhUcmFuc2Zlcihhcmd1bWVudHNbaV0pXG4gICAgICByZWdleEZ1bmNzLnB1c2goWyByZWdleCwgYXJndW1lbnRzW2kgKyAxXSBdKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0KHIpIHtcbiAgICByZXR1cm4gcmlvdC5yb3V0ZS5leGVjKHIgfHwgcm91dGUpXG4gIH1cblxuICByaW90LnJvdXRlLnBhcnNlcihmdW5jdGlvbihwYXRoKSB7IHJldHVybiBbcGF0aF0gfSlcbiAgcmlvdC5yb3V0ZShyb3V0ZSlcblxuICByZXR1cm4ge1xuICAgIHJvdXRlczogcm91dGVzLFxuICAgIHN0YXJ0OiBzdGFydFxuICB9XG5cbn0pKClcblxuZmx1eF9yaW90LkNvbnN0YW50cyA9IHtcbiAgQWN0aW9uU291cmNlczoge1xuICAgIFNFUlZFUl9BQ1RJT046ICdTRVJWRVJfQUNUSU9OJyxcbiAgICBWSUVXX0FDVElPTjogJ1ZJRVdfQUNUSU9OJ1xuICB9XG59XG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxuZmx1eF9yaW90LkRpc3BhdGNoZXIgPSBhc3NpZ24obmV3IERpc3BhdGNoZXIoKSwge1xuICBoYW5kbGVTZXJ2ZXJBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZUFjdGlvbihhY3Rpb24sIGZsdXhfcmlvdC5Db25zdGFudHMuQWN0aW9uU291cmNlcy5TRVJWRVJfQUNUSU9OKVxuICB9LFxuXG4gIGhhbmRsZVZpZXdBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZUFjdGlvbihhY3Rpb24sIGZsdXhfcmlvdC5Db25zdGFudHMuQWN0aW9uU291cmNlcy5WSUVXX0FDVElPTilcbiAgfSxcblxuICBoYW5kbGVBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbiwgc291cmNlKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goe1xuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBhY3Rpb246IGFjdGlvblxuICAgIH0pXG4gIH1cbn0pXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmbHV4X3Jpb3RcblxufSkoKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMuRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vbGliL0Rpc3BhdGNoZXInKVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBEaXNwYXRjaGVyXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NpdHktdXBkYXRlJykge1xuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBwYXlsb2FkLnNlbGVjdGVkQ2l0eTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGNvdW50cnksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NvdW50cnktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENvdW50cnk6ICdhdXN0cmFsaWEnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBib3RoIHN0b3JlczpcbiAqXG4gKiAgICBDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIENvdW50cnlTdG9yZS5jb3VudHJ5ID0gcGF5bG9hZC5zZWxlY3RlZENvdW50cnk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSBjYWxsYmFjayB0byB1cGRhdGUgYENvdW50cnlTdG9yZWAgaXMgcmVnaXN0ZXJlZCwgd2Ugc2F2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhlIHJldHVybmVkIHRva2VuLiBVc2luZyB0aGlzIHRva2VuIHdpdGggYHdhaXRGb3IoKWAsIHdlIGNhbiBndWFyYW50ZWVcbiAqIHRoYXQgYENvdW50cnlTdG9yZWAgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrIHRoYXQgdXBkYXRlcyBgQ2l0eVN0b3JlYFxuICogbmVlZHMgdG8gcXVlcnkgaXRzIGRhdGEuXG4gKlxuICogICBDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgbWF5IG5vdCBiZSB1cGRhdGVkLlxuICogICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBpcyBub3cgZ3VhcmFudGVlZCB0byBiZSB1cGRhdGVkLlxuICpcbiAqICAgICAgIC8vIFNlbGVjdCB0aGUgZGVmYXVsdCBjaXR5IGZvciB0aGUgbmV3IGNvdW50cnlcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gZ2V0RGVmYXVsdENpdHlGb3JDb3VudHJ5KENvdW50cnlTdG9yZS5jb3VudHJ5KTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSB1c2FnZSBvZiBgd2FpdEZvcigpYCBjYW4gYmUgY2hhaW5lZCwgZm9yIGV4YW1wbGU6XG4gKlxuICogICBGbGlnaHRQcmljZVN0b3JlLmRpc3BhdGNoVG9rZW4gPVxuICogICAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAqICAgICAgICAgY2FzZSAnY291bnRyeS11cGRhdGUnOlxuICogICAgICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIGdldEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqXG4gKiAgICAgICAgIGNhc2UgJ2NpdHktdXBkYXRlJzpcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBgY291bnRyeS11cGRhdGVgIHBheWxvYWQgd2lsbCBiZSBndWFyYW50ZWVkIHRvIGludm9rZSB0aGUgc3RvcmVzJ1xuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MgaW4gb3JkZXI6IGBDb3VudHJ5U3RvcmVgLCBgQ2l0eVN0b3JlYCwgdGhlblxuICogYEZsaWdodFByaWNlU3RvcmVgLlxuICovXG5cbiAgZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWQgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdpdGggZXZlcnkgZGlzcGF0Y2hlZCBwYXlsb2FkLiBSZXR1cm5zXG4gICAqIGEgdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGB3YWl0Rm9yKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3Rlcj1mdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IF9wcmVmaXggKyBfbGFzdElEKys7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgYmFzZWQgb24gaXRzIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnVucmVnaXN0ZXI9ZnVuY3Rpb24oaWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAnRGlzcGF0Y2hlci51bnJlZ2lzdGVyKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgaWRcbiAgICApO1xuICAgIGRlbGV0ZSB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgY2FsbGJhY2tzIHNwZWNpZmllZCB0byBiZSBpbnZva2VkIGJlZm9yZSBjb250aW51aW5nIGV4ZWN1dGlvblxuICAgKiBvZiB0aGUgY3VycmVudCBjYWxsYmFjay4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSBhIGNhbGxiYWNrIGluXG4gICAqIHJlc3BvbnNlIHRvIGEgZGlzcGF0Y2hlZCBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5PHN0cmluZz59IGlkc1xuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUud2FpdEZvcj1mdW5jdGlvbihpZHMpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nXG4gICAgKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIGlkID0gaWRzW2lpXTtcbiAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSxcbiAgICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgJyArXG4gICAgICAgICAgJ3dhaXRpbmcgZm9yIGAlc2AuJyxcbiAgICAgICAgICBpZFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChcbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgICBpZFxuICAgICAgKTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBheWxvYWQgdG8gYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2g9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGludmFyaWFudChcbiAgICAgICF0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2guZGlzcGF0Y2goLi4uKTogQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nXG4gICAgKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZCk7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmcoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoaXMgRGlzcGF0Y2hlciBjdXJyZW50bHkgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5pc0Rpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhlIGNhbGxiYWNrIHN0b3JlZCB3aXRoIHRoZSBnaXZlbiBpZC4gQWxzbyBkbyBzb21lIGludGVybmFsXG4gICAqIGJvb2trZWVwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjaz1mdW5jdGlvbihpZCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IHRydWU7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdKHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQpO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB1cCBib29ra2VlcGluZyBuZWVkZWQgd2hlbiBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gZmFsc2U7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgYm9va2tlZXBpbmcgdXNlZCBmb3IgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKGZhbHNlKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0IEZhY2Vib29rLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigna2V5TWlycm9yKC4uLik6IEFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICB9XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIga2V5cztcblx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBhcmd1bWVudHNbc107XG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyogUmlvdCB2Mi4wLjE1LCBAbGljZW5zZSBNSVQsIChjKSAyMDE1IE11dXQgSW5jLiArIGNvbnRyaWJ1dG9ycyAqL1xuXG47KGZ1bmN0aW9uKHdpbmRvdykge1xuICAvLyAndXNlIHN0cmljdCcgZG9lcyBub3QgYWxsb3cgdXMgdG8gb3ZlcnJpZGUgdGhlIGV2ZW50cyBwcm9wZXJ0aWVzIGh0dHBzOi8vZ2l0aHViLmNvbS9tdXV0L3Jpb3Rqcy9ibG9iL2Rldi9saWIvdGFnL3VwZGF0ZS5qcyNMNy1MMTBcbiAgLy8gaXQgbGVhZHMgdG8gdGhlIGZvbGxvd2luZyBlcnJvciBvbiBmaXJlZm94IFwic2V0dGluZyBhIHByb3BlcnR5IHRoYXQgaGFzIG9ubHkgYSBnZXR0ZXJcIlxuICAvLyd1c2Ugc3RyaWN0J1xuXG4gIHZhciByaW90ID0geyB2ZXJzaW9uOiAndjIuMC4xNScsIHNldHRpbmdzOiB7fSB9LFxuICAgICAgaWVWZXJzaW9uID0gY2hlY2tJRSgpXG5cbnJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICAgIF9pZCA9IDBcblxuICBlbC5vbiA9IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZuLl9pZCA9IHR5cGVvZiBmbi5faWQgPT0gJ3VuZGVmaW5lZCcgPyBfaWQrKyA6IGZuLl9pZFxuXG4gICAgICBldmVudHMucmVwbGFjZSgvXFxTKy9nLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcbiAgICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIGVsLm9mZiA9IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAoZXZlbnRzID09ICcqJykgY2FsbGJhY2tzID0ge31cbiAgICBlbHNlIHtcbiAgICAgIGV2ZW50cy5yZXBsYWNlKC9cXFMrL2csIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgKGNiID0gYXJyICYmIGFycltpXSk7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNiLl9pZCA9PSBmbi5faWQpIHsgYXJyLnNwbGljZShpLCAxKTsgaS0tIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2tzW25hbWVdID0gW11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvLyBvbmx5IHNpbmdsZSBldmVudCBzdXBwb3J0ZWRcbiAgZWwub25lID0gZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgIGVsLm9mZihuYW1lLCBvbilcbiAgICAgIGZuLmFwcGx5KGVsLCBhcmd1bWVudHMpXG4gICAgfVxuICAgIHJldHVybiBlbC5vbihuYW1lLCBvbilcbiAgfVxuXG4gIGVsLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgIGZucyA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGZuOyAoZm4gPSBmbnNbaV0pOyArK2kpIHtcbiAgICAgIGlmICghZm4uYnVzeSkge1xuICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2tzLmFsbCAmJiBuYW1lICE9ICdhbGwnKSB7XG4gICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJ2FsbCcsIG5hbWVdLmNvbmNhdChhcmdzKSlcbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIHJldHVybiBlbFxuXG59XG47KGZ1bmN0aW9uKHJpb3QsIGV2dCwgd2luZG93KSB7XG5cbiAgLy8gYnJvd3NlcnMgb25seVxuICBpZiAoIXdpbmRvdykgcmV0dXJuXG5cbiAgdmFyIGxvYyA9IHdpbmRvdy5sb2NhdGlvbixcbiAgICAgIGZucyA9IHJpb3Qub2JzZXJ2YWJsZSgpLFxuICAgICAgd2luID0gd2luZG93LFxuICAgICAgc3RhcnRlZCA9IGZhbHNlLFxuICAgICAgY3VycmVudFxuXG4gIGZ1bmN0aW9uIGhhc2goKSB7XG4gICAgcmV0dXJuIGxvYy5ocmVmLnNwbGl0KCcjJylbMV0gfHwgJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlcihwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChwYXRoKSB7XG4gICAgaWYgKHBhdGgudHlwZSkgcGF0aCA9IGhhc2goKVxuXG4gICAgaWYgKHBhdGggIT0gY3VycmVudCkge1xuICAgICAgZm5zLnRyaWdnZXIuYXBwbHkobnVsbCwgWydIJ10uY29uY2F0KHBhcnNlcihwYXRoKSkpXG4gICAgICBjdXJyZW50ID0gcGF0aFxuICAgIH1cbiAgfVxuXG4gIHZhciByID0gcmlvdC5yb3V0ZSA9IGZ1bmN0aW9uKGFyZykge1xuICAgIC8vIHN0cmluZ1xuICAgIGlmIChhcmdbMF0pIHtcbiAgICAgIGxvYy5oYXNoID0gYXJnXG4gICAgICBlbWl0KGFyZylcblxuICAgIC8vIGZ1bmN0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIGZucy5vbignSCcsIGFyZylcbiAgICB9XG4gIH1cblxuICByLmV4ZWMgPSBmdW5jdGlvbihmbikge1xuICAgIGZuLmFwcGx5KG51bGwsIHBhcnNlcihoYXNoKCkpKVxuICB9XG5cbiAgci5wYXJzZXIgPSBmdW5jdGlvbihmbikge1xuICAgIHBhcnNlciA9IGZuXG4gIH1cblxuICByLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzdGFydGVkKSByZXR1cm5cbiAgICB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lciA/IHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZW1pdCwgZmFsc2UpIDogd2luLmRldGFjaEV2ZW50KCdvbicgKyBldnQsIGVtaXQpXG4gICAgZm5zLm9mZignKicpXG4gICAgc3RhcnRlZCA9IGZhbHNlXG4gIH1cblxuICByLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzdGFydGVkKSByZXR1cm5cbiAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lciA/IHdpbi5hZGRFdmVudExpc3RlbmVyKGV2dCwgZW1pdCwgZmFsc2UpIDogd2luLmF0dGFjaEV2ZW50KCdvbicgKyBldnQsIGVtaXQpXG4gICAgc3RhcnRlZCA9IHRydWVcbiAgfVxuXG4gIC8vIGF1dG9zdGFydCB0aGUgcm91dGVyXG4gIHIuc3RhcnQoKVxuXG59KShyaW90LCAnaGFzaGNoYW5nZScsIHdpbmRvdylcbi8qXG5cbi8vLy8gSG93IGl0IHdvcmtzP1xuXG5cblRocmVlIHdheXM6XG5cbjEuIEV4cHJlc3Npb25zOiB0bXBsKCd7IHZhbHVlIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgdGhlIHJlc3VsdCBvZiBldmFsdWF0ZWQgZXhwcmVzc2lvbiBhcyBhIHJhdyBvYmplY3QuXG5cbjIuIFRlbXBsYXRlczogdG1wbCgnSGkgeyBuYW1lIH0geyBzdXJuYW1lIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgYSBzdHJpbmcgd2l0aCBldmFsdWF0ZWQgZXhwcmVzc2lvbnMuXG5cbjMuIEZpbHRlcnM6IHRtcGwoJ3sgc2hvdzogIWRvbmUsIGhpZ2hsaWdodDogYWN0aXZlIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgYSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiB0cnVlaXNoIGtleXMgKG1haW5seVxuICAgdXNlZCBmb3Igc2V0dGluZyBodG1sIGNsYXNzZXMpLCBlLmcuIFwic2hvdyBoaWdobGlnaHRcIi5cblxuXG4vLyBUZW1wbGF0ZSBleGFtcGxlc1xuXG50bXBsKCd7IHRpdGxlIHx8IFwiVW50aXRsZWRcIiB9JywgZGF0YSlcbnRtcGwoJ1Jlc3VsdHMgYXJlIHsgcmVzdWx0cyA/IFwicmVhZHlcIiA6IFwibG9hZGluZ1wiIH0nLCBkYXRhKVxudG1wbCgnVG9kYXkgaXMgeyBuZXcgRGF0ZSgpIH0nLCBkYXRhKVxudG1wbCgneyBtZXNzYWdlLmxlbmd0aCA+IDE0MCAmJiBcIk1lc3NhZ2UgaXMgdG9vIGxvbmdcIiB9JywgZGF0YSlcbnRtcGwoJ1RoaXMgaXRlbSBnb3QgeyBNYXRoLnJvdW5kKHJhdGluZykgfSBzdGFycycsIGRhdGEpXG50bXBsKCc8aDE+eyB0aXRsZSB9PC9oMT57IGJvZHkgfScsIGRhdGEpXG5cblxuLy8gRmFsc3kgZXhwcmVzc2lvbnMgaW4gdGVtcGxhdGVzXG5cbkluIHRlbXBsYXRlcyAoYXMgb3Bwb3NlZCB0byBzaW5nbGUgZXhwcmVzc2lvbnMpIGFsbCBmYWxzeSB2YWx1ZXNcbmV4Y2VwdCB6ZXJvICh1bmRlZmluZWQvbnVsbC9mYWxzZSkgd2lsbCBkZWZhdWx0IHRvIGVtcHR5IHN0cmluZzpcblxudG1wbCgneyB1bmRlZmluZWQgfSAtIHsgZmFsc2UgfSAtIHsgbnVsbCB9IC0geyAwIH0nLCB7fSlcbi8vIHdpbGwgcmV0dXJuOiBcIiAtIC0gLSAwXCJcblxuKi9cblxuXG52YXIgYnJhY2tldHMgPSAoZnVuY3Rpb24ob3JpZywgcywgYikge1xuICByZXR1cm4gZnVuY3Rpb24oeCkge1xuXG4gICAgLy8gbWFrZSBzdXJlIHdlIHVzZSB0aGUgY3VycmVudCBzZXR0aW5nXG4gICAgcyA9IHJpb3Quc2V0dGluZ3MuYnJhY2tldHMgfHwgb3JpZ1xuICAgIGlmIChiICE9IHMpIGIgPSBzLnNwbGl0KCcgJylcblxuICAgIC8vIGlmIHJlZ2V4cCBnaXZlbiwgcmV3cml0ZSBpdCB3aXRoIGN1cnJlbnQgYnJhY2tldHMgKG9ubHkgaWYgZGlmZmVyIGZyb20gZGVmYXVsdClcbiAgICByZXR1cm4geCAmJiB4LnRlc3RcbiAgICAgID8gcyA9PSBvcmlnXG4gICAgICAgID8geCA6IFJlZ0V4cCh4LnNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHsvZywgYlswXS5yZXBsYWNlKC8oPz0uKS9nLCAnXFxcXCcpKVxuICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXH0vZywgYlsxXS5yZXBsYWNlKC8oPz0uKS9nLCAnXFxcXCcpKSxcbiAgICAgICAgICAgICAgICAgICAgeC5nbG9iYWwgPyAnZycgOiAnJylcblxuICAgICAgLy8gZWxzZSwgZ2V0IHNwZWNpZmljIGJyYWNrZXRcbiAgICAgIDogYlt4XVxuXG4gIH1cbn0pKCd7IH0nKVxuXG5cbnZhciB0bXBsID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBjYWNoZSA9IHt9LFxuICAgICAgcmVWYXJzID0gLyhbJ1wiXFwvXSkuKj9bXlxcXFxdXFwxfFxcLlxcdyp8XFx3Kjp8XFxiKD86KD86bmV3fHR5cGVvZnxpbnxpbnN0YW5jZW9mKSB8KD86dGhpc3x0cnVlfGZhbHNlfG51bGx8dW5kZWZpbmVkKVxcYnxmdW5jdGlvbiAqXFwoKXwoW2Etel8kXVxcdyopL2dpXG4gICAgICAgICAgICAgIC8vIFsgMSAgICAgICAgICAgICAgIF1bIDIgIF1bIDMgXVsgNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdWyA1ICAgICAgIF1cbiAgICAgICAgICAgICAgLy8gZmluZCB2YXJpYWJsZSBuYW1lczpcbiAgICAgICAgICAgICAgLy8gMS4gc2tpcCBxdW90ZWQgc3RyaW5ncyBhbmQgcmVnZXhwczogXCJhIGJcIiwgJ2EgYicsICdhIFxcJ2JcXCcnLCAvYSBiL1xuICAgICAgICAgICAgICAvLyAyLiBza2lwIG9iamVjdCBwcm9wZXJ0aWVzOiAubmFtZVxuICAgICAgICAgICAgICAvLyAzLiBza2lwIG9iamVjdCBsaXRlcmFsczogbmFtZTpcbiAgICAgICAgICAgICAgLy8gNC4gc2tpcCBqYXZhc2NyaXB0IGtleXdvcmRzXG4gICAgICAgICAgICAgIC8vIDUuIG1hdGNoIHZhciBuYW1lXG5cbiAgLy8gYnVpbGQgYSB0ZW1wbGF0ZSAob3IgZ2V0IGl0IGZyb20gY2FjaGUpLCByZW5kZXIgd2l0aCBkYXRhXG4gIHJldHVybiBmdW5jdGlvbihzdHIsIGRhdGEpIHtcbiAgICByZXR1cm4gc3RyICYmIChjYWNoZVtzdHJdID0gY2FjaGVbc3RyXSB8fCB0bXBsKHN0cikpKGRhdGEpXG4gIH1cblxuXG4gIC8vIGNyZWF0ZSBhIHRlbXBsYXRlIGluc3RhbmNlXG5cbiAgZnVuY3Rpb24gdG1wbChzLCBwKSB7XG5cbiAgICAvLyBkZWZhdWx0IHRlbXBsYXRlIHN0cmluZyB0byB7fVxuICAgIHMgPSAocyB8fCAoYnJhY2tldHMoMCkgKyBicmFja2V0cygxKSkpXG5cbiAgICAgIC8vIHRlbXBvcmFyaWx5IGNvbnZlcnQgXFx7IGFuZCBcXH0gdG8gYSBub24tY2hhcmFjdGVyXG4gICAgICAucmVwbGFjZShicmFja2V0cygvXFxcXHsvZyksICdcXHVGRkYwJylcbiAgICAgIC5yZXBsYWNlKGJyYWNrZXRzKC9cXFxcfS9nKSwgJ1xcdUZGRjEnKVxuXG4gICAgLy8gc3BsaXQgc3RyaW5nIHRvIGV4cHJlc3Npb24gYW5kIG5vbi1leHByZXNpb24gcGFydHNcbiAgICBwID0gc3BsaXQocywgZXh0cmFjdChzLCBicmFja2V0cygvey8pLCBicmFja2V0cygvfS8pKSlcblxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ2QnLCAncmV0dXJuICcgKyAoXG5cbiAgICAgIC8vIGlzIGl0IGEgc2luZ2xlIGV4cHJlc3Npb24gb3IgYSB0ZW1wbGF0ZT8gaS5lLiB7eH0gb3IgPGI+e3h9PC9iPlxuICAgICAgIXBbMF0gJiYgIXBbMl0gJiYgIXBbM11cblxuICAgICAgICAvLyBpZiBleHByZXNzaW9uLCBldmFsdWF0ZSBpdFxuICAgICAgICA/IGV4cHIocFsxXSlcblxuICAgICAgICAvLyBpZiB0ZW1wbGF0ZSwgZXZhbHVhdGUgYWxsIGV4cHJlc3Npb25zIGluIGl0XG4gICAgICAgIDogJ1snICsgcC5tYXAoZnVuY3Rpb24ocywgaSkge1xuXG4gICAgICAgICAgICAvLyBpcyBpdCBhbiBleHByZXNzaW9uIG9yIGEgc3RyaW5nIChldmVyeSBzZWNvbmQgcGFydCBpcyBhbiBleHByZXNzaW9uKVxuICAgICAgICAgIHJldHVybiBpICUgMlxuXG4gICAgICAgICAgICAgIC8vIGV2YWx1YXRlIHRoZSBleHByZXNzaW9uc1xuICAgICAgICAgICAgICA/IGV4cHIocywgdHJ1ZSlcblxuICAgICAgICAgICAgICAvLyBwcm9jZXNzIHN0cmluZyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGU6XG4gICAgICAgICAgICAgIDogJ1wiJyArIHNcblxuICAgICAgICAgICAgICAgICAgLy8gcHJlc2VydmUgbmV3IGxpbmVzXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG5cbiAgICAgICAgICAgICAgICAgIC8vIGVzY2FwZSBxdW90ZXNcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJylcblxuICAgICAgICAgICAgICAgICsgJ1wiJ1xuXG4gICAgICAgIH0pLmpvaW4oJywnKSArICddLmpvaW4oXCJcIiknXG4gICAgICApXG5cbiAgICAgIC8vIGJyaW5nIGVzY2FwZWQgeyBhbmQgfSBiYWNrXG4gICAgICAucmVwbGFjZSgvXFx1RkZGMC9nLCBicmFja2V0cygwKSlcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYxL2csIGJyYWNrZXRzKDEpKVxuXG4gICAgKyAnOycpXG5cbiAgfVxuXG5cbiAgLy8gcGFyc2UgeyAuLi4gfSBleHByZXNzaW9uXG5cbiAgZnVuY3Rpb24gZXhwcihzLCBuKSB7XG4gICAgcyA9IHNcblxuICAgICAgLy8gY29udmVydCBuZXcgbGluZXMgdG8gc3BhY2VzXG4gICAgICAucmVwbGFjZSgvXFxuL2csICcgJylcblxuICAgICAgLy8gdHJpbSB3aGl0ZXNwYWNlLCBicmFja2V0cywgc3RyaXAgY29tbWVudHNcbiAgICAgIC5yZXBsYWNlKGJyYWNrZXRzKC9eW3sgXSt8WyB9XSskfFxcL1xcKi4rP1xcKlxcLy9nKSwgJycpXG5cbiAgICAvLyBpcyBpdCBhbiBvYmplY3QgbGl0ZXJhbD8gaS5lLiB7IGtleSA6IHZhbHVlIH1cbiAgICByZXR1cm4gL15cXHMqW1xcdy0gXCInXSsgKjovLnRlc3QocylcblxuICAgICAgLy8gaWYgb2JqZWN0IGxpdGVyYWwsIHJldHVybiB0cnVlaXNoIGtleXNcbiAgICAgIC8vIGUuZy46IHsgc2hvdzogaXNPcGVuKCksIGRvbmU6IGl0ZW0uZG9uZSB9IC0+IFwic2hvdyBkb25lXCJcbiAgICAgID8gJ1snICtcblxuICAgICAgICAgIC8vIGV4dHJhY3Qga2V5OnZhbCBwYWlycywgaWdub3JpbmcgYW55IG5lc3RlZCBvYmplY3RzXG4gICAgICAgICAgZXh0cmFjdChzLFxuXG4gICAgICAgICAgICAgIC8vIG5hbWUgcGFydDogbmFtZTosIFwibmFtZVwiOiwgJ25hbWUnOiwgbmFtZSA6XG4gICAgICAgICAgICAgIC9bXCInIF0qW1xcdy0gXStbXCInIF0qOi8sXG5cbiAgICAgICAgICAgICAgLy8gZXhwcmVzc2lvbiBwYXJ0OiBldmVyeXRoaW5nIHVwdG8gYSBjb21tYSBmb2xsb3dlZCBieSBhIG5hbWUgKHNlZSBhYm92ZSkgb3IgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgLywoPz1bXCInIF0qW1xcdy0gXStbXCInIF0qOil8fXwkL1xuICAgICAgICAgICAgICApLm1hcChmdW5jdGlvbihwYWlyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQga2V5LCB2YWwgcGFydHNcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFpci5yZXBsYWNlKC9eWyBcIiddKiguKz8pWyBcIiddKjogKiguKz8pLD8gKiQvLCBmdW5jdGlvbihfLCBrLCB2KSB7XG5cbiAgICAgICAgICAgICAgICAgIC8vIHdyYXAgYWxsIGNvbmRpdGlvbmFsIHBhcnRzIHRvIGlnbm9yZSBlcnJvcnNcbiAgICAgICAgICAgICAgICAgIHJldHVybiB2LnJlcGxhY2UoL1teJnw9IT48XSsvZywgd3JhcCkgKyAnP1wiJyArIGsgKyAnXCI6XCJcIiwnXG5cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIH0pLmpvaW4oJycpXG5cbiAgICAgICAgKyAnXS5qb2luKFwiIFwiKS50cmltKCknXG5cbiAgICAgIC8vIGlmIGpzIGV4cHJlc3Npb24sIGV2YWx1YXRlIGFzIGphdmFzY3JpcHRcbiAgICAgIDogd3JhcChzLCBuKVxuXG4gIH1cblxuXG4gIC8vIGV4ZWN1dGUganMgdy9vIGJyZWFraW5nIG9uIGVycm9ycyBvciB1bmRlZmluZWQgdmFyc1xuXG4gIGZ1bmN0aW9uIHdyYXAocywgbm9udWxsKSB7XG4gICAgcyA9IHMudHJpbSgpXG4gICAgcmV0dXJuICFzID8gJycgOiAnKGZ1bmN0aW9uKHYpe3RyeXt2PSdcblxuICAgICAgICAvLyBwcmVmaXggdmFycyAobmFtZSA9PiBkYXRhLm5hbWUpXG4gICAgICAgICsgKHMucmVwbGFjZShyZVZhcnMsIGZ1bmN0aW9uKHMsIF8sIHYpIHsgcmV0dXJuIHYgPyAnKGQuJyt2Kyc9PT11bmRlZmluZWQ/JysodHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyA/ICdnbG9iYWwuJyA6ICd3aW5kb3cuJykrdisnOmQuJyt2KycpJyA6IHMgfSlcblxuICAgICAgICAgIC8vIGJyZWFrIHRoZSBleHByZXNzaW9uIGlmIGl0cyBlbXB0eSAocmVzdWx0aW5nIGluIHVuZGVmaW5lZCB2YWx1ZSlcbiAgICAgICAgICB8fCAneCcpXG5cbiAgICAgICsgJ31maW5hbGx5e3JldHVybiAnXG5cbiAgICAgICAgLy8gZGVmYXVsdCB0byBlbXB0eSBzdHJpbmcgZm9yIGZhbHN5IHZhbHVlcyBleGNlcHQgemVyb1xuICAgICAgICArIChub251bGwgPT09IHRydWUgPyAnIXYmJnYhPT0wP1wiXCI6dicgOiAndicpXG5cbiAgICAgICsgJ319KS5jYWxsKGQpJ1xuICB9XG5cblxuICAvLyBzcGxpdCBzdHJpbmcgYnkgYW4gYXJyYXkgb2Ygc3Vic3RyaW5nc1xuXG4gIGZ1bmN0aW9uIHNwbGl0KHN0ciwgc3Vic3RyaW5ncykge1xuICAgIHZhciBwYXJ0cyA9IFtdXG4gICAgc3Vic3RyaW5ncy5tYXAoZnVuY3Rpb24oc3ViLCBpKSB7XG5cbiAgICAgIC8vIHB1c2ggbWF0Y2hlZCBleHByZXNzaW9uIGFuZCBwYXJ0IGJlZm9yZSBpdFxuICAgICAgaSA9IHN0ci5pbmRleE9mKHN1YilcbiAgICAgIHBhcnRzLnB1c2goc3RyLnNsaWNlKDAsIGkpLCBzdWIpXG4gICAgICBzdHIgPSBzdHIuc2xpY2UoaSArIHN1Yi5sZW5ndGgpXG4gICAgfSlcblxuICAgIC8vIHB1c2ggdGhlIHJlbWFpbmluZyBwYXJ0XG4gICAgcmV0dXJuIHBhcnRzLmNvbmNhdChzdHIpXG4gIH1cblxuXG4gIC8vIG1hdGNoIHN0cmluZ3MgYmV0d2VlbiBvcGVuaW5nIGFuZCBjbG9zaW5nIHJlZ2V4cCwgc2tpcHBpbmcgYW55IGlubmVyL25lc3RlZCBtYXRjaGVzXG5cbiAgZnVuY3Rpb24gZXh0cmFjdChzdHIsIG9wZW4sIGNsb3NlKSB7XG5cbiAgICB2YXIgc3RhcnQsXG4gICAgICAgIGxldmVsID0gMCxcbiAgICAgICAgbWF0Y2hlcyA9IFtdLFxuICAgICAgICByZSA9IG5ldyBSZWdFeHAoJygnK29wZW4uc291cmNlKycpfCgnK2Nsb3NlLnNvdXJjZSsnKScsICdnJylcblxuICAgIHN0ci5yZXBsYWNlKHJlLCBmdW5jdGlvbihfLCBvcGVuLCBjbG9zZSwgcG9zKSB7XG5cbiAgICAgIC8vIGlmIG91dGVyIGlubmVyIGJyYWNrZXQsIG1hcmsgcG9zaXRpb25cbiAgICAgIGlmKCFsZXZlbCAmJiBvcGVuKSBzdGFydCA9IHBvc1xuXG4gICAgICAvLyBpbihkZSljcmVhc2UgYnJhY2tldCBsZXZlbFxuICAgICAgbGV2ZWwgKz0gb3BlbiA/IDEgOiAtMVxuXG4gICAgICAvLyBpZiBvdXRlciBjbG9zaW5nIGJyYWNrZXQsIGdyYWIgdGhlIG1hdGNoXG4gICAgICBpZighbGV2ZWwgJiYgY2xvc2UgIT0gbnVsbCkgbWF0Y2hlcy5wdXNoKHN0ci5zbGljZShzdGFydCwgcG9zK2Nsb3NlLmxlbmd0aCkpXG5cbiAgICB9KVxuXG4gICAgcmV0dXJuIG1hdGNoZXNcbiAgfVxuXG59KSgpXG5cbi8vIHsga2V5LCBpIGluIGl0ZW1zfSAtPiB7IGtleSwgaSwgaXRlbXMgfVxuZnVuY3Rpb24gbG9vcEtleXMoZXhwcikge1xuICB2YXIgcmV0ID0geyB2YWw6IGV4cHIgfSxcbiAgICAgIGVscyA9IGV4cHIuc3BsaXQoL1xccytpblxccysvKVxuXG4gIGlmIChlbHNbMV0pIHtcbiAgICByZXQudmFsID0gYnJhY2tldHMoMCkgKyBlbHNbMV1cbiAgICBlbHMgPSBlbHNbMF0uc2xpY2UoYnJhY2tldHMoMCkubGVuZ3RoKS50cmltKCkuc3BsaXQoLyxcXHMqLylcbiAgICByZXQua2V5ID0gZWxzWzBdXG4gICAgcmV0LnBvcyA9IGVsc1sxXVxuICB9XG5cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBta2l0ZW0oZXhwciwga2V5LCB2YWwpIHtcbiAgdmFyIGl0ZW0gPSB7fVxuICBpdGVtW2V4cHIua2V5XSA9IGtleVxuICBpZiAoZXhwci5wb3MpIGl0ZW1bZXhwci5wb3NdID0gdmFsXG4gIHJldHVybiBpdGVtXG59XG5cblxuLyogQmV3YXJlOiBoZWF2eSBzdHVmZiAqL1xuZnVuY3Rpb24gX2VhY2goZG9tLCBwYXJlbnQsIGV4cHIpIHtcblxuICByZW1BdHRyKGRvbSwgJ2VhY2gnKVxuXG4gIHZhciB0ZW1wbGF0ZSA9IGRvbS5vdXRlckhUTUwsXG4gICAgICBwcmV2ID0gZG9tLnByZXZpb3VzU2libGluZyxcbiAgICAgIHJvb3QgPSBkb20ucGFyZW50Tm9kZSxcbiAgICAgIHJlbmRlcmVkID0gW10sXG4gICAgICB0YWdzID0gW10sXG4gICAgICBjaGVja3N1bVxuXG4gIGV4cHIgPSBsb29wS2V5cyhleHByKVxuXG4gIGZ1bmN0aW9uIGFkZChwb3MsIGl0ZW0sIHRhZykge1xuICAgIHJlbmRlcmVkLnNwbGljZShwb3MsIDAsIGl0ZW0pXG4gICAgdGFncy5zcGxpY2UocG9zLCAwLCB0YWcpXG4gIH1cblxuICAvLyBjbGVhbiB0ZW1wbGF0ZSBjb2RlXG4gIHBhcmVudC5vbmUoJ3VwZGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgIHJvb3QucmVtb3ZlQ2hpbGQoZG9tKVxuXG4gIH0pLm9uZSgncHJlbW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAocm9vdC5zdHViKSByb290ID0gcGFyZW50LnJvb3RcblxuICB9KS5vbigndXBkYXRlJywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgaXRlbXMgPSB0bXBsKGV4cHIudmFsLCBwYXJlbnQpXG4gICAgaWYgKCFpdGVtcykgcmV0dXJuXG5cbiAgICAvLyBvYmplY3QgbG9vcC4gYW55IGNoYW5nZXMgY2F1c2UgZnVsbCByZWRyYXdcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICB2YXIgdGVzdHN1bSA9IEpTT04uc3RyaW5naWZ5KGl0ZW1zKVxuICAgICAgaWYgKHRlc3RzdW0gPT0gY2hlY2tzdW0pIHJldHVyblxuICAgICAgY2hlY2tzdW0gPSB0ZXN0c3VtXG5cbiAgICAgIC8vIGNsZWFyIG9sZCBpdGVtc1xuICAgICAgZWFjaCh0YWdzLCBmdW5jdGlvbih0YWcpIHsgdGFnLnVubW91bnQoKSB9KVxuICAgICAgcmVuZGVyZWQgPSBbXVxuICAgICAgdGFncyA9IFtdXG5cbiAgICAgIGl0ZW1zID0gT2JqZWN0LmtleXMoaXRlbXMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIG1raXRlbShleHByLCBrZXksIGl0ZW1zW2tleV0pXG4gICAgICB9KVxuXG4gICAgfVxuXG4gICAgLy8gdW5tb3VudCByZWR1bmRhbnRcbiAgICBlYWNoKHJlbmRlcmVkLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAvLyBza2lwIGV4aXN0aW5nIGl0ZW1zXG4gICAgICAgIGlmIChpdGVtcy5pbmRleE9mKGl0ZW0pID4gLTEpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZmluZCBhbGwgbm9uLW9iamVjdHNcbiAgICAgICAgdmFyIG5ld0l0ZW1zID0gYXJyRmluZEVxdWFscyhpdGVtcywgaXRlbSksXG4gICAgICAgICAgICBvbGRJdGVtcyA9IGFyckZpbmRFcXVhbHMocmVuZGVyZWQsIGl0ZW0pXG5cbiAgICAgICAgLy8gaWYgbW9yZSBvciBlcXVhbCBhbW91bnQsIG5vIG5lZWQgdG8gcmVtb3ZlXG4gICAgICAgIGlmIChuZXdJdGVtcy5sZW5ndGggPj0gb2xkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBwb3MgPSByZW5kZXJlZC5pbmRleE9mKGl0ZW0pLFxuICAgICAgICAgIHRhZyA9IHRhZ3NbcG9zXVxuXG4gICAgICBpZiAodGFnKSB7XG4gICAgICAgIHRhZy51bm1vdW50KClcbiAgICAgICAgcmVuZGVyZWQuc3BsaWNlKHBvcywgMSlcbiAgICAgICAgdGFncy5zcGxpY2UocG9zLCAxKVxuICAgICAgICAvLyB0byBsZXQgXCJlYWNoXCIga25vdyB0aGF0IHRoaXMgaXRlbSBpcyByZW1vdmVkXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIC8vIG1vdW50IG5ldyAvIHJlb3JkZXJcbiAgICB2YXIgcHJldkJhc2UgPSBbXS5pbmRleE9mLmNhbGwocm9vdC5jaGlsZE5vZGVzLCBwcmV2KSArIDFcbiAgICBlYWNoKGl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG5cbiAgICAgIC8vIHN0YXJ0IGluZGV4IHNlYXJjaCBmcm9tIHBvc2l0aW9uIGJhc2VkIG9uIHRoZSBjdXJyZW50IGlcbiAgICAgIHZhciBwb3MgPSBpdGVtcy5pbmRleE9mKGl0ZW0sIGkpLFxuICAgICAgICAgIG9sZFBvcyA9IHJlbmRlcmVkLmluZGV4T2YoaXRlbSwgaSlcblxuICAgICAgLy8gaWYgbm90IGZvdW5kLCBzZWFyY2ggYmFja3dhcmRzIGZyb20gY3VycmVudCBpIHBvc2l0aW9uXG4gICAgICBwb3MgPCAwICYmIChwb3MgPSBpdGVtcy5sYXN0SW5kZXhPZihpdGVtLCBpKSlcbiAgICAgIG9sZFBvcyA8IDAgJiYgKG9sZFBvcyA9IHJlbmRlcmVkLmxhc3RJbmRleE9mKGl0ZW0sIGkpKVxuXG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICAvLyBmaW5kIGFsbCBub24tb2JqZWN0c1xuICAgICAgICB2YXIgbmV3SXRlbXMgPSBhcnJGaW5kRXF1YWxzKGl0ZW1zLCBpdGVtKSxcbiAgICAgICAgICAgIG9sZEl0ZW1zID0gYXJyRmluZEVxdWFscyhyZW5kZXJlZCwgaXRlbSlcblxuICAgICAgICAvLyBpZiBtb3JlLCBzaG91bGQgbW91bnQgb25lIG5ld1xuICAgICAgICBpZiAobmV3SXRlbXMubGVuZ3RoID4gb2xkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgb2xkUG9zID0gLTFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBtb3VudCBuZXdcbiAgICAgIHZhciBub2RlcyA9IHJvb3QuY2hpbGROb2Rlc1xuICAgICAgaWYgKG9sZFBvcyA8IDApIHtcbiAgICAgICAgaWYgKCFjaGVja3N1bSAmJiBleHByLmtleSkgdmFyIF9pdGVtID0gbWtpdGVtKGV4cHIsIGl0ZW0sIHBvcylcblxuICAgICAgICB2YXIgdGFnID0gbmV3IFRhZyh7IHRtcGw6IHRlbXBsYXRlIH0sIHtcbiAgICAgICAgICBiZWZvcmU6IG5vZGVzW3ByZXZCYXNlICsgcG9zXSxcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICByb290OiByb290LFxuICAgICAgICAgIGl0ZW06IF9pdGVtIHx8IGl0ZW1cbiAgICAgICAgfSlcblxuICAgICAgICB0YWcubW91bnQoKVxuXG4gICAgICAgIGFkZChwb3MsIGl0ZW0sIHRhZylcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gY2hhbmdlIHBvcyB2YWx1ZVxuICAgICAgaWYgKGV4cHIucG9zICYmIHRhZ3Nbb2xkUG9zXVtleHByLnBvc10gIT0gcG9zKSB7XG4gICAgICAgIHRhZ3Nbb2xkUG9zXS5vbmUoJ3VwZGF0ZScsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtW2V4cHIucG9zXSA9IHBvc1xuICAgICAgICB9KVxuICAgICAgICB0YWdzW29sZFBvc10udXBkYXRlKClcbiAgICAgIH1cblxuICAgICAgLy8gcmVvcmRlclxuICAgICAgaWYgKHBvcyAhPSBvbGRQb3MpIHtcbiAgICAgICAgcm9vdC5pbnNlcnRCZWZvcmUobm9kZXNbcHJldkJhc2UgKyBvbGRQb3NdLCBub2Rlc1twcmV2QmFzZSArIChwb3MgPiBvbGRQb3MgPyBwb3MgKyAxIDogcG9zKV0pXG4gICAgICAgIHJldHVybiBhZGQocG9zLCByZW5kZXJlZC5zcGxpY2Uob2xkUG9zLCAxKVswXSwgdGFncy5zcGxpY2Uob2xkUG9zLCAxKVswXSlcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICByZW5kZXJlZCA9IGl0ZW1zLnNsaWNlKClcblxuICB9KVxuXG59XG5cblxuZnVuY3Rpb24gcGFyc2VOYW1lZEVsZW1lbnRzKHJvb3QsIHBhcmVudCwgY2hpbGRUYWdzKSB7XG5cbiAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcbiAgICBpZiAoZG9tLm5vZGVUeXBlID09IDEpIHtcbiAgICAgIGlmKGRvbS5wYXJlbnROb2RlICYmIGRvbS5wYXJlbnROb2RlLmlzTG9vcCkgZG9tLmlzTG9vcCA9IDFcbiAgICAgIGlmKGRvbS5nZXRBdHRyaWJ1dGUoJ2VhY2gnKSkgZG9tLmlzTG9vcCA9IDFcbiAgICAgIC8vIGN1c3RvbSBjaGlsZCB0YWdcbiAgICAgIHZhciBjaGlsZCA9IGdldFRhZyhkb20pXG5cbiAgICAgIGlmIChjaGlsZCAmJiAhZG9tLmlzTG9vcCkge1xuICAgICAgICB2YXIgdGFnID0gbmV3IFRhZyhjaGlsZCwgeyByb290OiBkb20sIHBhcmVudDogcGFyZW50IH0sIGRvbS5pbm5lckhUTUwpLFxuICAgICAgICAgIHRhZ05hbWUgPSBjaGlsZC5uYW1lLFxuICAgICAgICAgIHB0YWcgPSBwYXJlbnQsXG4gICAgICAgICAgY2FjaGVkVGFnXG5cbiAgICAgICAgd2hpbGUoIWdldFRhZyhwdGFnLnJvb3QpKSB7XG4gICAgICAgICAgaWYoIXB0YWcucGFyZW50KSBicmVha1xuICAgICAgICAgIHB0YWcgPSBwdGFnLnBhcmVudFxuICAgICAgICB9XG4gICAgICAgIC8vIGZpeCBmb3IgdGhlIHBhcmVudCBhdHRyaWJ1dGUgaW4gdGhlIGxvb3BlZCBlbGVtZW50c1xuICAgICAgICB0YWcucGFyZW50ID0gcHRhZ1xuXG4gICAgICAgIGNhY2hlZFRhZyA9IHB0YWcudGFnc1t0YWdOYW1lXVxuXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjaGlsZHJlbiB0YWdzIGhhdmluZyB0aGUgc2FtZSBuYW1lXG4gICAgICAgIGlmIChjYWNoZWRUYWcpIHtcbiAgICAgICAgICAvLyBpZiB0aGUgcGFyZW50IHRhZ3MgcHJvcGVydHkgaXMgbm90IHlldCBhbiBhcnJheVxuICAgICAgICAgIC8vIGNyZWF0ZSBpdCBhZGRpbmcgdGhlIGZpcnN0IGNhY2hlZCB0YWdcbiAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2FjaGVkVGFnKSlcbiAgICAgICAgICAgIHB0YWcudGFnc1t0YWdOYW1lXSA9IFtjYWNoZWRUYWddXG4gICAgICAgICAgLy8gYWRkIHRoZSBuZXcgbmVzdGVkIHRhZyB0byB0aGUgYXJyYXlcbiAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0ucHVzaCh0YWcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHRhZy50YWdzW3RhZ05hbWVdID0gdGFnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbXB0eSB0aGUgY2hpbGQgbm9kZSBvbmNlIHdlIGdvdCBpdHMgdGVtcGxhdGVcbiAgICAgICAgLy8gdG8gYXZvaWQgdGhhdCBpdHMgY2hpbGRyZW4gZ2V0IGNvbXBpbGVkIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIGRvbS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBjaGlsZFRhZ3MucHVzaCh0YWcpXG4gICAgICB9XG5cbiAgICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgaWYgKC9eKG5hbWV8aWQpJC8udGVzdChhdHRyLm5hbWUpKSBwYXJlbnRbYXR0ci52YWx1ZV0gPSBkb21cbiAgICAgIH0pXG4gICAgfVxuXG4gIH0pXG5cbn1cblxuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9ucyhyb290LCB0YWcsIGV4cHJlc3Npb25zKSB7XG5cbiAgZnVuY3Rpb24gYWRkRXhwcihkb20sIHZhbCwgZXh0cmEpIHtcbiAgICBpZiAodmFsLmluZGV4T2YoYnJhY2tldHMoMCkpID49IDApIHtcbiAgICAgIHZhciBleHByID0geyBkb206IGRvbSwgZXhwcjogdmFsIH1cbiAgICAgIGV4cHJlc3Npb25zLnB1c2goZXh0ZW5kKGV4cHIsIGV4dHJhKSlcbiAgICB9XG4gIH1cblxuICB3YWxrKHJvb3QsIGZ1bmN0aW9uKGRvbSkge1xuICAgIHZhciB0eXBlID0gZG9tLm5vZGVUeXBlXG5cbiAgICAvLyB0ZXh0IG5vZGVcbiAgICBpZiAodHlwZSA9PSAzICYmIGRvbS5wYXJlbnROb2RlLnRhZ05hbWUgIT0gJ1NUWUxFJykgYWRkRXhwcihkb20sIGRvbS5ub2RlVmFsdWUpXG4gICAgaWYgKHR5cGUgIT0gMSkgcmV0dXJuXG5cbiAgICAvKiBlbGVtZW50ICovXG5cbiAgICAvLyBsb29wXG4gICAgdmFyIGF0dHIgPSBkb20uZ2V0QXR0cmlidXRlKCdlYWNoJylcbiAgICBpZiAoYXR0cikgeyBfZWFjaChkb20sIHRhZywgYXR0cik7IHJldHVybiBmYWxzZSB9XG5cbiAgICAvLyBhdHRyaWJ1dGUgZXhwcmVzc2lvbnNcbiAgICBlYWNoKGRvbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB2YXIgbmFtZSA9IGF0dHIubmFtZSxcbiAgICAgICAgYm9vbCA9IG5hbWUuc3BsaXQoJ19fJylbMV1cblxuICAgICAgYWRkRXhwcihkb20sIGF0dHIudmFsdWUsIHsgYXR0cjogYm9vbCB8fCBuYW1lLCBib29sOiBib29sIH0pXG4gICAgICBpZiAoYm9vbCkgeyByZW1BdHRyKGRvbSwgbmFtZSk7IHJldHVybiBmYWxzZSB9XG5cbiAgICB9KVxuXG4gICAgLy8gc2tpcCBjdXN0b20gdGFnc1xuICAgIGlmIChnZXRUYWcoZG9tKSkgcmV0dXJuIGZhbHNlXG5cbiAgfSlcblxufVxuZnVuY3Rpb24gVGFnKGltcGwsIGNvbmYsIGlubmVySFRNTCkge1xuXG4gIHZhciBzZWxmID0gcmlvdC5vYnNlcnZhYmxlKHRoaXMpLFxuICAgICAgb3B0cyA9IGluaGVyaXQoY29uZi5vcHRzKSB8fCB7fSxcbiAgICAgIGRvbSA9IG1rZG9tKGltcGwudG1wbCksXG4gICAgICBwYXJlbnQgPSBjb25mLnBhcmVudCxcbiAgICAgIGV4cHJlc3Npb25zID0gW10sXG4gICAgICBjaGlsZFRhZ3MgPSBbXSxcbiAgICAgIHJvb3QgPSBjb25mLnJvb3QsXG4gICAgICBpdGVtID0gY29uZi5pdGVtLFxuICAgICAgZm4gPSBpbXBsLmZuLFxuICAgICAgdGFnTmFtZSA9IHJvb3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgYXR0ciA9IHt9LFxuICAgICAgbG9vcERvbVxuXG4gIGlmIChmbiAmJiByb290Ll90YWcpIHtcbiAgICByb290Ll90YWcudW5tb3VudCh0cnVlKVxuICB9XG4gIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHRhZyBqdXN0IGNyZWF0ZWRcbiAgLy8gc28gd2Ugd2lsbCBiZSBhYmxlIHRvIG1vdW50IHRoaXMgdGFnIG11bHRpcGxlIHRpbWVzXG4gIHJvb3QuX3RhZyA9IHRoaXNcblxuICAvLyBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gdGhpcyB0YWdcbiAgLy8gaXQgY291bGQgYmUgaGFuZHkgdG8gdXNlIGl0IGFsc28gdG8gaW1wcm92ZSB0aGUgdmlydHVhbCBkb20gcmVuZGVyaW5nIHNwZWVkXG4gIHRoaXMuX2lkID0gfn4obmV3IERhdGUoKS5nZXRUaW1lKCkgKiBNYXRoLnJhbmRvbSgpKVxuXG4gIGV4dGVuZCh0aGlzLCB7IHBhcmVudDogcGFyZW50LCByb290OiByb290LCBvcHRzOiBvcHRzLCB0YWdzOiB7fSB9LCBpdGVtKVxuXG4gIC8vIGdyYWIgYXR0cmlidXRlc1xuICBlYWNoKHJvb3QuYXR0cmlidXRlcywgZnVuY3Rpb24oZWwpIHtcbiAgICBhdHRyW2VsLm5hbWVdID0gZWwudmFsdWVcbiAgfSlcblxuXG4gIGlmIChkb20uaW5uZXJIVE1MICYmICEvc2VsZWN0Ly50ZXN0KHRhZ05hbWUpKVxuICAgIC8vIHJlcGxhY2UgYWxsIHRoZSB5aWVsZCB0YWdzIHdpdGggdGhlIHRhZyBpbm5lciBodG1sXG4gICAgZG9tLmlubmVySFRNTCA9IHJlcGxhY2VZaWVsZChkb20uaW5uZXJIVE1MLCBpbm5lckhUTUwpXG5cblxuICAvLyBvcHRpb25zXG4gIGZ1bmN0aW9uIHVwZGF0ZU9wdHMoKSB7XG4gICAgZWFjaChPYmplY3Qua2V5cyhhdHRyKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgb3B0c1tuYW1lXSA9IHRtcGwoYXR0cltuYW1lXSwgcGFyZW50IHx8IHNlbGYpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZGF0YSwgaW5pdCkge1xuICAgIGV4dGVuZChzZWxmLCBkYXRhLCBpdGVtKVxuICAgIHVwZGF0ZU9wdHMoKVxuICAgIHNlbGYudHJpZ2dlcigndXBkYXRlJywgaXRlbSlcbiAgICB1cGRhdGUoZXhwcmVzc2lvbnMsIHNlbGYsIGl0ZW0pXG4gICAgc2VsZi50cmlnZ2VyKCd1cGRhdGVkJylcbiAgfVxuXG4gIHRoaXMubW91bnQgPSBmdW5jdGlvbigpIHtcblxuICAgIHVwZGF0ZU9wdHMoKVxuXG4gICAgLy8gaW5pdGlhbGlhdGlvblxuICAgIGZuICYmIGZuLmNhbGwoc2VsZiwgb3B0cylcblxuICAgIHRvZ2dsZSh0cnVlKVxuXG4gICAgLy8gcGFyc2UgbGF5b3V0IGFmdGVyIGluaXQuIGZuIG1heSBjYWxjdWxhdGUgYXJncyBmb3IgbmVzdGVkIGN1c3RvbSB0YWdzXG4gICAgcGFyc2VFeHByZXNzaW9ucyhkb20sIHNlbGYsIGV4cHJlc3Npb25zKVxuXG4gICAgaWYgKCFzZWxmLnBhcmVudCkgc2VsZi51cGRhdGUoKVxuXG4gICAgLy8gaW50ZXJuYWwgdXNlIG9ubHksIGZpeGVzICM0MDNcbiAgICBzZWxmLnRyaWdnZXIoJ3ByZW1vdW50JylcblxuICAgIGlmIChmbikge1xuICAgICAgd2hpbGUgKGRvbS5maXJzdENoaWxkKSByb290LmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvb3BEb20gPSBkb20uZmlyc3RDaGlsZFxuICAgICAgcm9vdC5pbnNlcnRCZWZvcmUobG9vcERvbSwgY29uZi5iZWZvcmUgfHwgbnVsbCkgLy8gbnVsbCBuZWVkZWQgZm9yIElFOFxuICAgIH1cblxuICAgIGlmIChyb290LnN0dWIpIHNlbGYucm9vdCA9IHJvb3QgPSBwYXJlbnQucm9vdFxuICAgIHNlbGYudHJpZ2dlcignbW91bnQnKVxuXG4gIH1cblxuXG4gIHRoaXMudW5tb3VudCA9IGZ1bmN0aW9uKGtlZXBSb290VGFnKSB7XG4gICAgdmFyIGVsID0gZm4gPyByb290IDogbG9vcERvbSxcbiAgICAgICAgcCA9IGVsLnBhcmVudE5vZGVcblxuICAgIGlmIChwKSB7XG5cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgdGFnIGZyb20gdGhlIHBhcmVudCB0YWdzIG9iamVjdFxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgbmVzdGVkIHRhZ3Mgd2l0aCBzYW1lIG5hbWUuLlxuICAgICAgICAvLyByZW1vdmUgdGhpcyBlbGVtZW50IGZvcm0gdGhlIGFycmF5XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudC50YWdzW3RhZ05hbWVdKSkge1xuICAgICAgICAgIGVhY2gocGFyZW50LnRhZ3NbdGFnTmFtZV0sIGZ1bmN0aW9uKHRhZywgaSkge1xuICAgICAgICAgICAgaWYgKHRhZy5faWQgPT0gc2VsZi5faWQpXG4gICAgICAgICAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdLnNwbGljZShpLCAxKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IGRlbGV0ZSB0aGUgdGFnIGluc3RhbmNlXG4gICAgICAgICAgZGVsZXRlIHBhcmVudC50YWdzW3RhZ05hbWVdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZClcbiAgICAgIH1cblxuICAgICAgaWYgKCFrZWVwUm9vdFRhZylcbiAgICAgICAgcC5yZW1vdmVDaGlsZChlbClcblxuICAgIH1cblxuXG4gICAgc2VsZi50cmlnZ2VyKCd1bm1vdW50JylcbiAgICB0b2dnbGUoKVxuICAgIHNlbGYub2ZmKCcqJylcbiAgICAvLyBzb21laG93IGllOCBkb2VzIG5vdCBsaWtlIGBkZWxldGUgcm9vdC5fdGFnYFxuICAgIHJvb3QuX3RhZyA9IG51bGxcblxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlKGlzTW91bnQpIHtcblxuICAgIC8vIG1vdW50L3VubW91bnQgY2hpbGRyZW5cbiAgICBlYWNoKGNoaWxkVGFncywgZnVuY3Rpb24oY2hpbGQpIHsgY2hpbGRbaXNNb3VudCA/ICdtb3VudCcgOiAndW5tb3VudCddKCkgfSlcblxuICAgIC8vIGxpc3Rlbi91bmxpc3RlbiBwYXJlbnQgKGV2ZW50cyBmbG93IG9uZSB3YXkgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4pXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdmFyIGV2dCA9IGlzTW91bnQgPyAnb24nIDogJ29mZidcbiAgICAgIHBhcmVudFtldnRdKCd1cGRhdGUnLCBzZWxmLnVwZGF0ZSlbZXZ0XSgndW5tb3VudCcsIHNlbGYudW5tb3VudClcbiAgICB9XG4gIH1cblxuICAvLyBuYW1lZCBlbGVtZW50cyBhdmFpbGFibGUgZm9yIGZuXG4gIHBhcnNlTmFtZWRFbGVtZW50cyhkb20sIHRoaXMsIGNoaWxkVGFncylcblxuXG59XG5cbmZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcihuYW1lLCBoYW5kbGVyLCBkb20sIHRhZywgaXRlbSkge1xuXG4gIGRvbVtuYW1lXSA9IGZ1bmN0aW9uKGUpIHtcblxuICAgIC8vIGNyb3NzIGJyb3dzZXIgZXZlbnQgZml4XG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XG4gICAgZS53aGljaCA9IGUud2hpY2ggfHwgZS5jaGFyQ29kZSB8fCBlLmtleUNvZGVcbiAgICBlLnRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudFxuICAgIGUuY3VycmVudFRhcmdldCA9IGRvbVxuICAgIGUuaXRlbSA9IGl0ZW1cblxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvdXIgKGJ5IGRlZmF1bHQpXG4gICAgaWYgKGhhbmRsZXIuY2FsbCh0YWcsIGUpICE9PSB0cnVlICYmICEvcmFkaW98Y2hlY2svLnRlc3QoZG9tLnR5cGUpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0ICYmIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgdmFyIGVsID0gaXRlbSA/IHRhZy5wYXJlbnQgOiB0YWdcbiAgICBlbC51cGRhdGUoKVxuXG4gIH1cblxufVxuXG4vLyB1c2VkIGJ5IGlmLSBhdHRyaWJ1dGVcbmZ1bmN0aW9uIGluc2VydFRvKHJvb3QsIG5vZGUsIGJlZm9yZSkge1xuICBpZiAocm9vdCkge1xuICAgIHJvb3QuaW5zZXJ0QmVmb3JlKGJlZm9yZSwgbm9kZSlcbiAgICByb290LnJlbW92ZUNoaWxkKG5vZGUpXG4gIH1cbn1cblxuLy8gaXRlbSA9IGN1cnJlbnRseSBsb29wZWQgaXRlbVxuZnVuY3Rpb24gdXBkYXRlKGV4cHJlc3Npb25zLCB0YWcsIGl0ZW0pIHtcblxuICBlYWNoKGV4cHJlc3Npb25zLCBmdW5jdGlvbihleHByLCBpKSB7XG5cbiAgICB2YXIgZG9tID0gZXhwci5kb20sXG4gICAgICAgIGF0dHJOYW1lID0gZXhwci5hdHRyLFxuICAgICAgICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCB0YWcpLFxuICAgICAgICBwYXJlbnQgPSBleHByLmRvbS5wYXJlbnROb2RlXG5cbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSAnJ1xuXG4gICAgLy8gbGVhdmUgb3V0IHJpb3QtIHByZWZpeGVzIGZyb20gc3RyaW5ncyBpbnNpZGUgdGV4dGFyZWFcbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC50YWdOYW1lID09ICdURVhUQVJFQScpIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvcmlvdC0vZywgJycpXG5cbiAgICAvLyBubyBjaGFuZ2VcbiAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHJldHVyblxuICAgIGV4cHIudmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gdGV4dCBub2RlXG4gICAgaWYgKCFhdHRyTmFtZSkgcmV0dXJuIGRvbS5ub2RlVmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gcmVtb3ZlIG9yaWdpbmFsIGF0dHJpYnV0ZVxuICAgIHJlbUF0dHIoZG9tLCBhdHRyTmFtZSlcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNldEV2ZW50SGFuZGxlcihhdHRyTmFtZSwgdmFsdWUsIGRvbSwgdGFnLCBpdGVtKVxuXG4gICAgLy8gaWYtIGNvbmRpdGlvbmFsXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PSAnaWYnKSB7XG4gICAgICB2YXIgc3R1YiA9IGV4cHIuc3R1YlxuXG4gICAgICAvLyBhZGQgdG8gRE9NXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgc3R1YiAmJiBpbnNlcnRUbyhzdHViLnBhcmVudE5vZGUsIHN0dWIsIGRvbSlcblxuICAgICAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHViID0gZXhwci5zdHViID0gc3R1YiB8fCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJylcbiAgICAgICAgaW5zZXJ0VG8oZG9tLnBhcmVudE5vZGUsIGRvbSwgc3R1YilcbiAgICAgIH1cblxuICAgIC8vIHNob3cgLyBoaWRlXG4gICAgfSBlbHNlIGlmICgvXihzaG93fGhpZGUpJC8udGVzdChhdHRyTmFtZSkpIHtcbiAgICAgIGlmIChhdHRyTmFtZSA9PSAnaGlkZScpIHZhbHVlID0gIXZhbHVlXG4gICAgICBkb20uc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSdcblxuICAgIC8vIGZpZWxkIHZhbHVlXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PSAndmFsdWUnKSB7XG4gICAgICBkb20udmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gPGltZyBzcmM9XCJ7IGV4cHIgfVwiPlxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUuc2xpY2UoMCwgNSkgPT0gJ3Jpb3QtJykge1xuICAgICAgYXR0ck5hbWUgPSBhdHRyTmFtZS5zbGljZSg1KVxuICAgICAgdmFsdWUgPyBkb20uc2V0QXR0cmlidXRlKGF0dHJOYW1lLCB2YWx1ZSkgOiByZW1BdHRyKGRvbSwgYXR0ck5hbWUpXG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGV4cHIuYm9vbCkge1xuICAgICAgICBkb21bYXR0ck5hbWVdID0gdmFsdWVcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuXG4gICAgICAgIHZhbHVlID0gYXR0ck5hbWVcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnb2JqZWN0JykgZG9tLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgdmFsdWUpXG5cbiAgICB9XG5cbiAgfSlcblxufVxuZnVuY3Rpb24gZWFjaChlbHMsIGZuKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSAoZWxzIHx8IFtdKS5sZW5ndGgsIGVsOyBpIDwgbGVuOyBpKyspIHtcbiAgICBlbCA9IGVsc1tpXVxuICAgIC8vIHJldHVybiBmYWxzZSAtPiByZW1vdmUgY3VycmVudCBpdGVtIGR1cmluZyBsb29wXG4gICAgaWYgKGVsICE9IG51bGwgJiYgZm4oZWwsIGkpID09PSBmYWxzZSkgaS0tXG4gIH1cbiAgcmV0dXJuIGVsc1xufVxuXG5mdW5jdGlvbiByZW1BdHRyKGRvbSwgbmFtZSkge1xuICBkb20ucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG59XG5cbi8vIG1heCAyIGZyb20gb2JqZWN0cyBhbGxvd2VkXG5mdW5jdGlvbiBleHRlbmQob2JqLCBmcm9tLCBmcm9tMikge1xuICBmcm9tICYmIGVhY2goT2JqZWN0LmtleXMoZnJvbSksIGZ1bmN0aW9uKGtleSkge1xuICAgIG9ialtrZXldID0gZnJvbVtrZXldXG4gIH0pXG4gIHJldHVybiBmcm9tMiA/IGV4dGVuZChvYmosIGZyb20yKSA6IG9ialxufVxuXG5mdW5jdGlvbiBjaGVja0lFKCkge1xuICBpZiAod2luZG93KSB7XG4gICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIHZhciBtc2llID0gdWEuaW5kZXhPZignTVNJRSAnKVxuICAgIGlmIChtc2llID4gMCkge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb3B0aW9uSW5uZXJIVE1MKGVsLCBodG1sKSB7XG4gIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKSxcbiAgICAgIHZhbFJlZ3ggPSAvdmFsdWU9W1xcXCInXSguKz8pW1xcXCInXS8sXG4gICAgICBzZWxSZWd4ID0gL3NlbGVjdGVkPVtcXFwiJ10oLis/KVtcXFwiJ10vLFxuICAgICAgdmFsdWVzTWF0Y2ggPSBodG1sLm1hdGNoKHZhbFJlZ3gpLFxuICAgICAgc2VsZWN0ZWRNYXRjaCA9IGh0bWwubWF0Y2goc2VsUmVneClcblxuICBvcHQuaW5uZXJIVE1MID0gaHRtbFxuXG4gIGlmICh2YWx1ZXNNYXRjaCkge1xuICAgIG9wdC52YWx1ZSA9IHZhbHVlc01hdGNoWzFdXG4gIH1cblxuICBpZiAoc2VsZWN0ZWRNYXRjaCkge1xuICAgIG9wdC5zZXRBdHRyaWJ1dGUoJ3Jpb3Qtc2VsZWN0ZWQnLCBzZWxlY3RlZE1hdGNoWzFdKVxuICB9XG5cbiAgZWwuYXBwZW5kQ2hpbGQob3B0KVxufVxuXG5mdW5jdGlvbiBta2RvbSh0ZW1wbGF0ZSkge1xuICB2YXIgdGFnTmFtZSA9IHRlbXBsYXRlLnRyaW0oKS5zbGljZSgxLCAzKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgcm9vdFRhZyA9IC90ZHx0aC8udGVzdCh0YWdOYW1lKSA/ICd0cicgOiB0YWdOYW1lID09ICd0cicgPyAndGJvZHknIDogJ2RpdicsXG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocm9vdFRhZylcblxuICBlbC5zdHViID0gdHJ1ZVxuXG4gIGlmICh0YWdOYW1lID09PSAnb3AnICYmIGllVmVyc2lvbiAmJiBpZVZlcnNpb24gPCAxMCkge1xuICAgIG9wdGlvbklubmVySFRNTChlbCwgdGVtcGxhdGUpXG4gIH0gZWxzZSB7XG4gICAgZWwuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuZnVuY3Rpb24gd2Fsayhkb20sIGZuKSB7XG4gIGlmIChkb20pIHtcbiAgICBpZiAoZm4oZG9tKSA9PT0gZmFsc2UpIHdhbGsoZG9tLm5leHRTaWJsaW5nLCBmbilcbiAgICBlbHNlIHtcbiAgICAgIGRvbSA9IGRvbS5maXJzdENoaWxkXG5cbiAgICAgIHdoaWxlIChkb20pIHtcbiAgICAgICAgd2Fsayhkb20sIGZuKVxuICAgICAgICBkb20gPSBkb20ubmV4dFNpYmxpbmdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVwbGFjZVlpZWxkICh0bXBsLCBpbm5lckhUTUwpIHtcbiAgcmV0dXJuIHRtcGwucmVwbGFjZSgvPCh5aWVsZClcXC8/Pig8XFwvXFwxPik/L2dpbSwgaW5uZXJIVE1MIHx8ICcnKVxufVxuXG5mdW5jdGlvbiAkJChzZWxlY3RvciwgY3R4KSB7XG4gIGN0eCA9IGN0eCB8fCBkb2N1bWVudFxuICByZXR1cm4gY3R4LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG59XG5cbmZ1bmN0aW9uIGFyckRpZmYoYXJyMSwgYXJyMikge1xuICByZXR1cm4gYXJyMS5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gYXJyMi5pbmRleE9mKGVsKSA8IDBcbiAgfSlcbn1cblxuZnVuY3Rpb24gYXJyRmluZEVxdWFscyhhcnIsIGVsKSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChfZWwpIHtcbiAgICByZXR1cm4gX2VsID09PSBlbFxuICB9KVxufVxuXG5mdW5jdGlvbiBpbmhlcml0KHBhcmVudCkge1xuICBmdW5jdGlvbiBDaGlsZCgpIHt9XG4gIENoaWxkLnByb3RvdHlwZSA9IHBhcmVudFxuICByZXR1cm4gbmV3IENoaWxkKClcbn1cblxuLypcbiBWaXJ0dWFsIGRvbSBpcyBhbiBhcnJheSBvZiBjdXN0b20gdGFncyBvbiB0aGUgZG9jdW1lbnQuXG4gVXBkYXRlcyBhbmQgdW5tb3VudHMgcHJvcGFnYXRlIGRvd253YXJkcyBmcm9tIHBhcmVudCB0byBjaGlsZHJlbi5cbiovXG5cbnZhciB2aXJ0dWFsRG9tID0gW10sXG4gICAgdGFnSW1wbCA9IHt9XG5cblxuZnVuY3Rpb24gZ2V0VGFnKGRvbSkge1xuICByZXR1cm4gdGFnSW1wbFtkb20uZ2V0QXR0cmlidXRlKCdyaW90LXRhZycpIHx8IGRvbS50YWdOYW1lLnRvTG93ZXJDYXNlKCldXG59XG5cbmZ1bmN0aW9uIGluamVjdFN0eWxlKGNzcykge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgbm9kZS5pbm5lckhUTUwgPSBjc3NcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChub2RlKVxufVxuXG5mdW5jdGlvbiBtb3VudFRvKHJvb3QsIHRhZ05hbWUsIG9wdHMpIHtcbiAgdmFyIHRhZyA9IHRhZ0ltcGxbdGFnTmFtZV0sXG4gICAgICBpbm5lckhUTUwgPSByb290LmlubmVySFRNTFxuXG4gIC8vIGNsZWFyIHRoZSBpbm5lciBodG1sXG4gIHJvb3QuaW5uZXJIVE1MID0gJydcblxuICBpZiAodGFnICYmIHJvb3QpIHRhZyA9IG5ldyBUYWcodGFnLCB7IHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMgfSwgaW5uZXJIVE1MKVxuXG4gIGlmICh0YWcgJiYgdGFnLm1vdW50KSB7XG4gICAgdGFnLm1vdW50KClcbiAgICB2aXJ0dWFsRG9tLnB1c2godGFnKVxuICAgIHJldHVybiB0YWcub24oJ3VubW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpcnR1YWxEb20uc3BsaWNlKHZpcnR1YWxEb20uaW5kZXhPZih0YWcpLCAxKVxuICAgIH0pXG4gIH1cblxufVxuXG5yaW90LnRhZyA9IGZ1bmN0aW9uKG5hbWUsIGh0bWwsIGNzcywgZm4pIHtcbiAgaWYgKHR5cGVvZiBjc3MgPT0gJ2Z1bmN0aW9uJykgZm4gPSBjc3NcbiAgZWxzZSBpZiAoY3NzKSBpbmplY3RTdHlsZShjc3MpXG4gIHRhZ0ltcGxbbmFtZV0gPSB7IG5hbWU6IG5hbWUsIHRtcGw6IGh0bWwsIGZuOiBmbiB9XG4gIHJldHVybiBuYW1lXG59XG5cbnJpb3QubW91bnQgPSBmdW5jdGlvbihzZWxlY3RvciwgdGFnTmFtZSwgb3B0cykge1xuXG4gIHZhciBlbCxcbiAgICAgIHNlbGN0QWxsVGFncyA9IGZ1bmN0aW9uKHNlbCkge1xuICAgICAgICBzZWwgPSBPYmplY3Qua2V5cyh0YWdJbXBsKS5qb2luKCcsICcpXG4gICAgICAgIHNlbC5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih0KSB7XG4gICAgICAgICAgc2VsICs9ICcsICpbcmlvdC10YWc9XCInKyB0LnRyaW0oKSArICdcIl0nXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzZWxcbiAgICAgIH0sXG4gICAgICB0YWdzID0gW11cblxuICBpZiAodHlwZW9mIHRhZ05hbWUgPT0gJ29iamVjdCcpIHsgb3B0cyA9IHRhZ05hbWU7IHRhZ05hbWUgPSAwIH1cblxuICAvLyBjcmF3bCB0aGUgRE9NIHRvIGZpbmQgdGhlIHRhZ1xuICBpZih0eXBlb2Ygc2VsZWN0b3IgPT0gJ3N0cmluZycpIHtcbiAgICBpZiAoc2VsZWN0b3IgPT0gJyonKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSB0YWdzIHJlZ2lzdGVyZWRcbiAgICAgIC8vIGFuZCBhbHNvIHRoZSB0YWdzIGZvdW5kIHdpdGggdGhlIHJpb3QtdGFnIGF0dHJpYnV0ZSBzZXRcbiAgICAgIHNlbGVjdG9yID0gc2VsY3RBbGxUYWdzKHNlbGVjdG9yKVxuICAgIH1cbiAgICAvLyBvciBqdXN0IHRoZSBvbmVzIG5hbWVkIGxpa2UgdGhlIHNlbGVjdG9yXG4gICAgZWwgPSAkJChzZWxlY3RvcilcbiAgfVxuICAvLyBwcm9iYWJseSB5b3UgaGF2ZSBwYXNzZWQgYWxyZWFkeSBhIHRhZyBvciBhIE5vZGVMaXN0XG4gIGVsc2VcbiAgICBlbCA9IHNlbGVjdG9yXG5cbiAgLy8gc2VsZWN0IGFsbCB0aGUgcmVnaXN0ZXJlZCBhbmQgbW91bnQgdGhlbSBpbnNpZGUgdGhlaXIgcm9vdCBlbGVtZW50c1xuICBpZiAodGFnTmFtZSA9PSAnKicpIHtcbiAgICAvLyBnZXQgYWxsIGN1c3RvbSB0YWdzXG4gICAgdGFnTmFtZSA9IHNlbGN0QWxsVGFncyhzZWxlY3RvcilcbiAgICAvLyBpZiB0aGUgcm9vdCBlbCBpdCdzIGp1c3QgYSBzaW5nbGUgdGFnXG4gICAgaWYgKGVsLnRhZ05hbWUpIHtcbiAgICAgIGVsID0gJCQodGFnTmFtZSwgZWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBub2RlTGlzdCA9IFtdXG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSBjaGlsZHJlbiBmb3IgYWxsIHRoZSBkaWZmZXJlbnQgcm9vdCBlbGVtZW50c1xuICAgICAgZWFjaChlbCwgZnVuY3Rpb24odGFnKSB7XG4gICAgICAgIG5vZGVMaXN0ID0gJCQodGFnTmFtZSwgdGFnKVxuICAgICAgfSlcbiAgICAgIGVsID0gbm9kZUxpc3RcbiAgICB9XG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgdGFnTmFtZVxuICAgIHRhZ05hbWUgPSAwXG4gIH1cblxuICBmdW5jdGlvbiBwdXNoKHJvb3QpIHtcbiAgICB2YXIgbmFtZSA9IHRhZ05hbWUgfHwgcm9vdC5nZXRBdHRyaWJ1dGUoJ3Jpb3QtdGFnJykgfHwgcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHRhZyA9IG1vdW50VG8ocm9vdCwgbmFtZSwgb3B0cylcblxuICAgIGlmICh0YWcpIHRhZ3MucHVzaCh0YWcpXG4gIH1cblxuICAvLyBET00gbm9kZVxuICBpZiAoZWwudGFnTmFtZSlcbiAgICBwdXNoKHNlbGVjdG9yKVxuICAvLyBzZWxlY3RvciBvciBOb2RlTGlzdFxuICBlbHNlXG4gICAgZWFjaChlbCwgcHVzaClcblxuICByZXR1cm4gdGFnc1xuXG59XG5cbi8vIHVwZGF0ZSBldmVyeXRoaW5nXG5yaW90LnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZWFjaCh2aXJ0dWFsRG9tLCBmdW5jdGlvbih0YWcpIHtcbiAgICB0YWcudXBkYXRlKClcbiAgfSlcbn1cblxuLy8gQGRlcHJlY2F0ZWRcbnJpb3QubW91bnRUbyA9IHJpb3QubW91bnRcblxuXG5cbiAgLy8gc2hhcmUgbWV0aG9kcyBmb3Igb3RoZXIgcmlvdCBwYXJ0cywgZS5nLiBjb21waWxlclxuICByaW90LnV0aWwgPSB7IGJyYWNrZXRzOiBicmFja2V0cywgdG1wbDogdG1wbCB9XG5cbiAgLy8gc3VwcG9ydCBDb21tb25KUywgQU1EICYgYnJvd3NlclxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgIG1vZHVsZS5leHBvcnRzID0gcmlvdFxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gcmlvdCB9KVxuICBlbHNlXG4gICAgd2luZG93LnJpb3QgPSByaW90XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQpO1xuIiwiRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpLkRpc3BhdGNoZXJcbkFjdGlvblR5cGVzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2FwcF9jb25zdGFudHMuY29mZmVlJykuQWN0aW9uVHlwZXNcblxuZGlzcGF0Y2ggPSAodHlwZSwgZGF0YSktPlxuICBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb25cbiAgICB0eXBlOiB0eXBlXG4gICAgZGF0YTogZGF0YVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNhdmVUYXNrOiAodGFzaykgLT5cbiAgICBkaXNwYXRjaCBBY3Rpb25UeXBlcy5UQVNLX1NBVkUsIHRhc2tcblxuICByZW1vdmVUYXNrOiAodGFzaykgLT5cbiAgICBkaXNwYXRjaCBBY3Rpb25UeXBlcy5UQVNLX1JFTU9WRSwgdGFza1xuXG4gIHRvZ2dsZVRhc2s6ICh0YXNrKSAtPlxuICAgIGRpc3BhdGNoIEFjdGlvblR5cGVzLlRBU0tfVE9HR0xFLCB0YXNrXG5cbiAgY2xlYXJUYXNrczogLT5cbiAgICBkaXNwYXRjaCBBY3Rpb25UeXBlcy5UQVNLX0NMRUFSXG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJlcXVpcmUoJy4vdG9kb19saXN0LnRhZycpXG52YXIgdG9kb3MgPSByZXF1aXJlKCcuLi9hY3Rpb25zL3RvZG9zLmNvZmZlZScpXG52YXIgZmx1eF9yaW90ID0gcmVxdWlyZSgnZmx1eC1yaW90JylcblxucmlvdC50YWcoJ3RvZG8tYXBwJywgJzxoMz57IG9wdHMudGl0bGUgfTwvaDM+IDx0b2RvLWxpc3QgaXRlbXM9XCJ7IGl0ZW1zIH1cIj48L3RvZG8tbGlzdD4gPGRpdiBjbGFzcz1cImFjdGlvbnNcIj4gPGJ1dHRvbiBvbmNsaWNrPVwieyBhZGQgfVwiPkFkZCAjeyBpdGVtcy5sZW5ndGggKyAxIH08L2J1dHRvbj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xuXG4gIHRoaXMuYWRkID0gZnVuY3Rpb24oKSB7XG4gICAgcmlvdC5yb3V0ZSgndG9kb3MvYWRkJylcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuZ2V0RGF0YUZyb21TdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLnN0b3JlLmdldEFsbCgpXG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnVwZGF0ZUZyb21TdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2V0RGF0YUZyb21TdG9yZSgpXG4gICAgdGhpcy51cGRhdGUoKVxuICB9LmJpbmQodGhpcyk7XG5cbiAgZmx1eF9yaW90LnN0b3JlTWl4aW4odGhpcywgb3B0cy5zdG9yZSwgdGhpcy51cGRhdGVGcm9tU3RvcmUpXG5cbiAgdGhpcy5nZXREYXRhRnJvbVN0b3JlKClcblxuXG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xudmFyIHRvZG9zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy90b2Rvcy5jb2ZmZWUnKVxuXG5yaW90LnRhZygndG9kby1lZGl0JywgJzxoMT57IHRpdGxlIH08L2gxPiA8ZGl2PiA8ZGl2IGNsYXNzPVxcJ2Zvcm0tcm93XFwnPiA8ZGl2PiA8bGFiZWwgZm9yPVxcJ3R4dFRpdGxlXFwnPlRhc2s8L2xhYmVsPiA8aW5wdXQgcGxhY2Vob2xkZXI9XFwneW91ciBuZXcgdGFza1xcJyB0eXBlPVxcJ3RleHRcXCcgc2l6ZT1cIjYwXCIgb25rZXl1cD1cInsga2V5dXAgfVwiIG5hbWU9XFwndHh0VGl0bGVcXCcgdmFsdWU9XCJ7IGl0ZW0udGl0bGUgfVwiPiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJhY3Rpb25zXCI+IDxidXR0b24gb25jbGljaz1cInsgc2F2ZSB9XCI+Q3JlYXRlPC9idXR0b24+IDxidXR0b24gb25jbGljaz1cInsgY2FuY2VsIH1cIj5DYW5jZWw8L2J1dHRvbj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICBpZiAob3B0cy50YXNrSWQpIHtcbiAgICB0aGlzLnRpdGxlID0gJ0VkaXQgVGFrcyAnICsgb3B0cy50YXNrSWRcbiAgICB2YXIgdGFzayA9IG9wdHMuc3RvcmUuZ2V0VGFzayhvcHRzLnRhc2tJZClcbiAgICB0aGlzLml0ZW0gPSB7IGlkOiB0YXNrLmlkLCB0aXRsZTogdGFzay50aXRsZSB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50aXRsZSA9ICdDcmVhdGUgbmV3IFRhc2snXG4gICAgdGhpcy5pdGVtID0ge31cbiAgfVxuXG4gIHRoaXMua2V5dXAgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICB0aGlzLnNhdmUoKVxuICAgIH1cbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXRlbS50aXRsZSA9IHRoaXMudHh0VGl0bGUudmFsdWVcbiAgICB0b2Rvcy5zYXZlVGFzayh0aGlzLml0ZW0pXG4gICAgcmlvdC5yb3V0ZSgnIycpXG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJpb3Qucm91dGUoJyMnKVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5vbignbW91bnQnLCBmdW5jdGlvbigpIHsgdGhpcy50eHRUaXRsZS5mb2N1cygpIH0pXG5cblxufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnZhciB0b2RvcyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvdG9kb3MuY29mZmVlJylcblxucmlvdC50YWcoJ3RvZG8taXRlbScsICc8bGkgY2xhc3M9XCJ7IHRvZG8taXRlbTogdHJ1ZSwgY29tcGxldGVkOiBpdGVtLmRvbmUgfVwiPiA8bGFiZWw+IDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBfX2NoZWNrZWQ9XCJ7IGl0ZW0uZG9uZSB9XCIgb25jbGljaz1cInsgdG9nZ2xlIH1cIj4geyBpdGVtLnRpdGxlIH0gPC9sYWJlbD4gPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIG9uY2xpY2s9XCJ7IHJlbW92ZSB9XCI+UmVtb3ZlPC9hPiA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgb25jbGljaz1cInsgZWRpdCB9XCI+RWRpdDwvYT4gPC9saT4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgdGhpcy5pdGVtID0gb3B0cy5pdGVtXG5cbiAgdGhpcy50b2dnbGUgPSBmdW5jdGlvbigpIHtcbiAgICB0b2Rvcy50b2dnbGVUYXNrKHRoaXMuaXRlbSlcblxuICAgIHJldHVybiB0cnVlXG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChjb25maXJtKFwiUmVtb3ZlIHRoaXMgdGFzaz9cIikpIHRvZG9zLnJlbW92ZVRhc2sodGhpcy5pdGVtKVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5lZGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmlvdC5yb3V0ZSgndG9kb3MvZWRpdC8nICsgdGhpcy5pdGVtLmlkKVxuICB9LmJpbmQodGhpcyk7XG5cblxufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJlcXVpcmUoJy4vdG9kb19pdGVtLnRhZycpXG5cbnJpb3QudGFnKCd0b2RvLWxpc3QnLCAnPHVsPiA8dG9kby1pdGVtIGVhY2g9XCJ7IGl0ZW0gaW4gb3B0cy5pdGVtcyB9XCIgaXRlbT1cInsgaXRlbSB9XCI+PC90b2RvLWl0ZW0+IDwvdWw+JywgZnVuY3Rpb24ob3B0cykge1xuXG59KTtcbiIsImtleW1pcnJvciA9IHJlcXVpcmUgJ2tleW1pcnJvcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBBY3Rpb25UeXBlczoga2V5bWlycm9yXG4gICAgVEFTS19TQVZFOiAgICAgbnVsbFxuICAgIFRBU0tfUkVNT1ZFOiAgbnVsbFxuICAgIFRBU0tfVE9HR0xFOiAgbnVsbFxuICAgIFRBU0tfQ0xFQVI6ICAgbnVsbFxuIiwicmlvdCA9IHJlcXVpcmUgJ3Jpb3QvcmlvdCdcbnRvZG9fc3RvcmUgPSByZXF1aXJlICcuLi9zdG9yZXMvdG9kb19zdG9yZS5jb2ZmZWUnXG5yZXF1aXJlICcuLi9jb21wb25lbnRzL3RvZG9fYXBwLnRhZydcbnJlcXVpcmUgJy4uL2NvbXBvbmVudHMvdG9kb19lZGl0LnRhZydcblxuYXBwX3RhZyA9IG51bGxcblxudW5tb3VudCA9IC0+IGFwcF90YWcudW5tb3VudCgpIGlmIGFwcF90YWdcbm1vdW50ID0gKHRhZywgb3B0cyktPlxuICBhcHBfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICBhcHBfY29udGFpbmVyLmlkID0gJ2FwcC1jb250YWluZXInXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKS5hcHBlbmRDaGlsZChhcHBfY29udGFpbmVyKVxuICByaW90Lm1vdW50KCcjYXBwLWNvbnRhaW5lcicsIHRhZywgb3B0cylbMF1cblxubW9kdWxlLmV4cG9ydHMgPVxuICBsaXN0OiAtPlxuICAgIHVubW91bnQoKVxuICAgIGFwcF90YWcgPSBtb3VudCAndG9kby1hcHAnLFxuICAgICAgdGl0bGU6IFwiVG9kbyBBcHBcIlxuICAgICAgc3RvcmU6IHRvZG9fc3RvcmVcblxuICBlZGl0OiAoaWQpLT5cbiAgICB1bm1vdW50KClcbiAgICBhcHBfdGFnID0gbW91bnQgJ3RvZG8tZWRpdCcsXG4gICAgICB0YXNrSWQ6IGlkLFxuICAgICAgc3RvcmU6IHRvZG9fc3RvcmVcbiIsInJpb3QgPSByZXF1aXJlICdyaW90L3Jpb3QnXG5CYXNlUm91dGVyID0gcmVxdWlyZSgnZmx1eC1yaW90JykuQmFzZVJvdXRlclxudG9kb19wcmVzZW50ZXIgPSByZXF1aXJlICcuLi9wcmVzZW50ZXJzL3RvZG9fcHJlc2VudGVyLmNvZmZlZSdcblxuQmFzZVJvdXRlci5yb3V0ZXMgdG9kb19wcmVzZW50ZXIubGlzdCxcbiAgJ3RvZG9zL2FkZCcsIHRvZG9fcHJlc2VudGVyLmVkaXQsXG4gICd0b2Rvcy9lZGl0LzppZCcsIHRvZG9fcHJlc2VudGVyLmVkaXRcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzdGFydDogQmFzZVJvdXRlci5zdGFydFxuIiwiYXNzaWduID0gcmVxdWlyZSAnb2JqZWN0LWFzc2lnbidcbkRpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4LXJpb3QnKS5EaXNwYXRjaGVyXG5BY3Rpb25UeXBlcyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9hcHBfY29uc3RhbnRzLmNvZmZlZScpLkFjdGlvblR5cGVzXG5mbHV4X3Jpb3QgPSByZXF1aXJlICdmbHV4LXJpb3QnXG5cbiMgZGF0YSBzdG9yYWdlXG5naWQgPSAxXG5fdGFza3MgPSBbXG4gIHsgaWQ6IGdpZCsrLCB0aXRsZTogJ0N1c3RvbSB0YWdzJywgZG9uZTogdHJ1ZSB9LFxuICB7IGlkOiBnaWQrKywgdGl0bGU6ICdNaW5pbWFsIHN5bnRheCcsIGRvbmU6IHRydWUgfSxcbiAgeyBpZDogZ2lkKyssIHRpdGxlOiAnVmlydHVhbCBET00nLCBkb25lOiB0cnVlIH0sXG4gIHsgaWQ6IGdpZCsrLCB0aXRsZTogJ0Z1bGwgc3RhY2snIH0sXG4gIHsgaWQ6IGdpZCsrLCB0aXRsZTogJ0lFOCd9XG5dXG5cbmFkZFRhc2sgPSAodGl0bGUsIGRvbmUgPSBmYWxzZSkgLT5cbiAgX3Rhc2tzLnB1c2hcbiAgICBpZDogZ2lkKytcbiAgICB0aXRsZTogdGl0bGVcbiAgICBkb25lOiBkb25lXG5nZXRUYXNrcyA9IC0+IF90YXNrc1xuXG4jIFRvZG9TdG9yZVxuVG9kb1N0b3JlID0gYXNzaWduIG5ldyBmbHV4X3Jpb3QuQmFzZVN0b3JlKCksXG4gIGdldEFsbDogLT4gZ2V0VGFza3MoKVxuXG4gIGdldFRhc2s6IChpZCktPlxuICAgIGZvciB0YXNrIGluIFRvZG9TdG9yZS5nZXRBbGwoKVxuICAgICAgcmV0dXJuIHRhc2sgaWYgdGFzay5pZCA9PSBwYXJzZUludChpZClcblxuICBkaXNwYXRjaFRva2VuOiBEaXNwYXRjaGVyLnJlZ2lzdGVyIChwYXlsb2FkKS0+XG4gICAgYWN0aW9uID0gcGF5bG9hZC5hY3Rpb25cbiAgICBzd2l0Y2ggYWN0aW9uLnR5cGVcbiAgICAgIHdoZW4gQWN0aW9uVHlwZXMuVEFTS19TQVZFXG4gICAgICAgIGRhdGEgPSBhY3Rpb24uZGF0YVxuICAgICAgICAjIE5PVEU6IGlmIHRoaXMgYWN0aW9uIG5lZWRzIHRvIHdhaXQgb24gYW5vdGhlciBzdG9yZVxuICAgICAgICAjIERpc3BhdGNoZXIud2FpdEZvciBbIE90aGVyU3RvcmUuZGlzcGF0Y2hUb2tlbiBdXG4gICAgICAgIGlmIGRhdGEuaWRcbiAgICAgICAgICB0YXNrID0gVG9kb1N0b3JlLmdldFRhc2soZGF0YS5pZClcbiAgICAgICAgICB0YXNrLnRpdGxlID0gZGF0YS50aXRsZVxuICAgICAgICAgIFRvZG9TdG9yZS5lbWl0Q2hhbmdlKClcbiAgICAgICAgZWxzZSBpZiBkYXRhLnRpdGxlXG4gICAgICAgICAgYWRkVGFzayBkYXRhLnRpdGxlXG4gICAgICAgICAgVG9kb1N0b3JlLmVtaXRDaGFuZ2UoKVxuICAgICAgd2hlbiBBY3Rpb25UeXBlcy5UQVNLX1RPR0dMRVxuICAgICAgICB0YXNrID0gYWN0aW9uLmRhdGFcbiAgICAgICAgdGFzay5kb25lID0gIXRhc2suZG9uZVxuICAgICAgd2hlbiBBY3Rpb25UeXBlcy5UQVNLX1JFTU9WRVxuICAgICAgICB0YXNrID0gYWN0aW9uLmRhdGFcbiAgICAgICAgaW5kZXggPSBUb2RvU3RvcmUuZ2V0QWxsKCkuaW5kZXhPZih0YXNrKVxuICAgICAgICBUb2RvU3RvcmUuZ2V0QWxsKCkuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICBUb2RvU3RvcmUuZW1pdENoYW5nZSgpXG4gICAgICAjIGFkZCBtb3JlIGNhc2VzIGZvciBvdGhlciBhY3Rpb25UeXBlcy4uLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZG9TdG9yZVxuIl19
