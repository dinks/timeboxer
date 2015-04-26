(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/index.coffee":[function(require,module,exports){
var timeboxer_routes;

timeboxer_routes = require('./routers/timeboxer_routes.js');

timeboxer_routes.start();



},{"./routers/timeboxer_routes.js":"/Users/surian/Sites/Private/timeboxer/src/js/routers/timeboxer_routes.js"}],"/Users/surian/Sites/Private/timeboxer/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js":[function(require,module,exports){
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

},{"flux":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/node_modules/flux/index.js","object-assign":"/Users/surian/Sites/Private/timeboxer/node_modules/object-assign/index.js","riot/riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/node_modules/flux/index.js":[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/node_modules/flux/lib/Dispatcher.js"}],"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/node_modules/flux/lib/Dispatcher.js":[function(require,module,exports){
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

},{"./invariant":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/node_modules/flux/lib/invariant.js"}],"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/node_modules/flux/lib/invariant.js":[function(require,module,exports){
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

},{}],"/Users/surian/Sites/Private/timeboxer/node_modules/keymirror/index.js":[function(require,module,exports){
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

},{}],"/Users/surian/Sites/Private/timeboxer/node_modules/object-assign/index.js":[function(require,module,exports){
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

},{}],"/Users/surian/Sites/Private/timeboxer/node_modules/parse/build/parse-latest.js":[function(require,module,exports){
(function (process){
/*!
 * Parse JavaScript SDK
 * Version: 1.4.2
 * Built: Thu Apr 09 2015 17:20:31
 * http://parse.com
 *
 * Copyright 2015 Parse, Inc.
 * The Parse JavaScript SDK is freely distributable under the MIT license.
 *
 * Includes: Underscore.js
 * Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * Released under the MIT license.
 */
(function(root) {
  root.Parse = root.Parse || {};
  root.Parse.VERSION = "js1.4.2";
}(this));
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

/*global _: false, $: false, localStorage: false, process: true,
  XMLHttpRequest: false, XDomainRequest: false, exports: false,
  require: false, setTimeout: true */
(function(root) {
  root.Parse = root.Parse || {};
  /**
   * Contains all Parse API classes and functions.
   * @name Parse
   * @namespace
   *
   * Contains all Parse API classes and functions.
   */
  var Parse = root.Parse;

  var req = typeof(require) === 'function' ? require : null;
  // Load references to other dependencies
  if (typeof(XMLHttpRequest) !== 'undefined') {
    Parse.XMLHttpRequest = XMLHttpRequest;
  } else if (typeof(require) === 'function' &&
      typeof(require.ensure) === 'undefined') {
    Parse.XMLHttpRequest = req('xmlhttprequest').XMLHttpRequest;
  }
  // Import Parse's local copy of underscore.
  if (typeof(exports) !== 'undefined' && exports._) {
    // We're running in a CommonJS environment
    Parse._ = exports._.noConflict();
    exports.Parse = Parse;
  } else {
    Parse._ = _.noConflict();
  }

  // If jQuery or Zepto has been included, grab a reference to it.
  if (typeof($) !== "undefined") {
    Parse.$ = $;
  }

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var EmptyConstructor = function() {};

  // TODO: fix this so that ParseObjects aren't all called "child" in debugger.
  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      /** @ignore */
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    Parse._.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) {
      Parse._.extend(child.prototype, protoProps);
    }

    // Add static properties to the constructor function, if supplied.
    if (staticProps) {
      Parse._.extend(child, staticProps);
    }

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is
    // needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set the server for Parse to talk to.
  Parse.serverURL = "https://api.parse.com";

  // Check whether we are running in Node.js.
  if (typeof(process) !== "undefined" &&
      process.versions &&
      process.versions.node) {
    Parse._isNode = true;
  }

  /**
   * Call this method first to set up your authentication tokens for Parse.
   * You can get your keys from the Data Browser on parse.com.
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey Your Parse JavaScript Key.
   * @param {String} masterKey (optional) Your Parse Master Key. (Node.js only!)
   */
  Parse.initialize = function(applicationId, javaScriptKey, masterKey) {
    if (masterKey) {
      throw "Parse.initialize() was passed a Master Key, which is only " +
        "allowed from within Node.js.";
    }
    Parse._initialize(applicationId, javaScriptKey);
  };

  /**
   * Call this method first to set up master authentication tokens for Parse.
   * This method is for Parse's own private use.
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey Your Parse JavaScript Key.
   * @param {String} masterKey Your Parse Master Key.
   */
  Parse._initialize = function(applicationId, javaScriptKey, masterKey) {
    Parse.applicationId = applicationId;
    Parse.javaScriptKey = javaScriptKey;
    Parse.masterKey = masterKey;
    Parse._useMasterKey = false;
  };

  // If we're running in node.js, allow using the master key.
  if (Parse._isNode) {
    Parse.initialize = Parse._initialize;

    Parse.Cloud = Parse.Cloud || {};
    /**
     * Switches the Parse SDK to using the Master key.  The Master key grants
     * priveleged access to the data in Parse and can be used to bypass ACLs and
     * other restrictions that are applied to the client SDKs.
     * <p><strong><em>Available in Cloud Code and Node.js only.</em></strong>
     * </p>
     */
    Parse.Cloud.useMasterKey = function() {
      Parse._useMasterKey = true;
    };
  }

  /**
   * Returns prefix for Storage keys used by this instance of Parse.
   * @param {String} path The relative suffix to append to it.
   *     null or undefined is treated as the empty string.
   * @return {String} The full key name.
   */
  Parse._getParsePath = function(path) {
    if (!Parse.applicationId) {
      throw "You need to call Parse.initialize before using Parse.";
    }
    if (!path) {
      path = "";
    }
    if (!Parse._.isString(path)) {
      throw "Tried to get a Storage path that wasn't a String.";
    }
    if (path[0] === "/") {
      path = path.substring(1);
    }
    return "Parse/" + Parse.applicationId + "/" + path;
  };

  /**
   * Returns a Promise that is resolved with the unique string for this app on
   * this machine.
   * Gets reset when Storage is cleared.
   */
  Parse._installationId = null;
  Parse._getInstallationId = function() {
    // See if it's cached in RAM.
    if (Parse._installationId) {
      return Parse.Promise.as(Parse._installationId);
    }

    // Try to get it from Storage.
    var path = Parse._getParsePath("installationId");
    return (Parse.Storage.getItemAsync(path)
      .then(function(value) {
        Parse._installationId = value;

        if (!Parse._installationId || Parse._installationId === "") {
          // It wasn't in Storage, so create a new one.
          var hexOctet = function() {
            return (
              Math.floor((1+Math.random())*0x10000).toString(16).substring(1)
            );
          };
          Parse._installationId = (
            hexOctet() + hexOctet() + "-" +
            hexOctet() + "-" +
            hexOctet() + "-" +
            hexOctet() + "-" +
            hexOctet() + hexOctet() + hexOctet());
          return Parse.Storage.setItemAsync(path, Parse._installationId);
        }

        return Parse.Promise.as(Parse._installationId);
      })
    );
  };

  Parse._parseDate = function(iso8601) {
    var regexp = new RegExp(
      "^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})" + "T" +
      "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" +
      "(.([0-9]+))?" + "Z$");
    var match = regexp.exec(iso8601);
    if (!match) {
      return null;
    }

    var year = match[1] || 0;
    var month = (match[2] || 1) - 1;
    var day = match[3] || 0;
    var hour = match[4] || 0;
    var minute = match[5] || 0;
    var second = match[6] || 0;
    var milli = match[8] || 0;

    return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
  };

  Parse._ajaxIE8 = function(method, url, data) {
    var promise = new Parse.Promise();
    var xdr = new XDomainRequest();
    xdr.onload = function() {
      var response;
      try {
        response = JSON.parse(xdr.responseText);
      } catch (e) {
        promise.reject(e);
      }
      if (response) {
        promise.resolve(response);
      }
    };
    xdr.onerror = xdr.ontimeout = function() {
      // Let's fake a real error message.
      var fakeResponse = {
        responseText: JSON.stringify({
          code: Parse.Error.X_DOMAIN_REQUEST,
          error: "IE's XDomainRequest does not supply error info."
        })
      };
      promise.reject(fakeResponse);
    };
    xdr.onprogress = function() {};
    xdr.open(method, url);
    xdr.send(data);
    return promise;
  };

  Parse._useXDomainRequest = function() {
    if (typeof(XDomainRequest) !== "undefined") {
      // We're in IE 8+.
      if ('withCredentials' in new XMLHttpRequest()) {
        // We're in IE 10+.
        return false;
      }
      return true;
    }
    return false;
  };

  // TODO(klimt): Get rid of success/error usage in website.
  Parse._ajax = function(method, url, data, success, error) {
    var options = {
      success: success,
      error: error
    };

    if (Parse._useXDomainRequest()) {
      return Parse._ajaxIE8(method, url, data)._thenRunCallbacks(options);
    }

    var promise = new Parse.Promise();
    var attempts = 0;

    var dispatch = function() {
      var handled = false;
      var xhr = new Parse.XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (handled) {
            return;
          }
          handled = true;

          if (xhr.status >= 200 && xhr.status < 300) {
            var response;
            try {
              response = JSON.parse(xhr.responseText);
            } catch (e) {
              promise.reject(e);
            }
            if (response) {
              promise.resolve(response, xhr.status, xhr);
            }
          } else if (xhr.status >= 500) { // Retry on 5XX
            if (++attempts < 5) {
              // Exponentially-growing delay
              var delay = Math.round(
                Math.random() * 125 * Math.pow(2, attempts)
              );
              setTimeout(dispatch, delay);
            } else {
              // After 5 retries, fail
              promise.reject(xhr);
            }
          } else {
            promise.reject(xhr);
          }
        }
      };

      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'text/plain');  // avoid pre-flight.
      if (Parse._isNode) {
        // Add a special user agent just for request from node.js.
        xhr.setRequestHeader("User-Agent",
                             "Parse/" + Parse.VERSION +
                             " (NodeJS " + process.versions.node + ")");
      }
      xhr.send(data);
    };

    dispatch();
    return promise._thenRunCallbacks(options); 
  };

  // A self-propagating extend function.
  Parse._extend = function(protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  /**
   * Options:
   *   route: is classes, users, login, etc.
   *   objectId: null if there is no associated objectId.
   *   method: the http method for the REST API.
   *   dataObject: the payload as an object, or null if there is none.
   *   useMasterKey: overrides whether to use the master key if set.
   * @ignore
   */
  Parse._request = function(options) {
    var route = options.route;
    var className = options.className;
    var objectId = options.objectId;
    var method = options.method;
    var useMasterKey = options.useMasterKey;
    var sessionToken = options.sessionToken;
    var dataObject = options.data;

    if (!Parse.applicationId) {
      throw "You must specify your applicationId using Parse.initialize.";
    }

    if (!Parse.javaScriptKey && !Parse.masterKey) {
      throw "You must specify a key using Parse.initialize.";
    }

    // TODO: We can remove this check later, but it's useful for development.
    if (route !== "batch" &&
        route !== "classes" &&
        route !== "events" &&
        route !== "files" &&
        route !== "functions" &&
        route !== "login" &&
        route !== "logout" &&
        route !== "push" &&
        route !== "requestPasswordReset" &&
        route !== "rest_verify_analytics" &&
        route !== "users" &&
        route !== "jobs" &&
        route !== "config" &&
        route !== "sessions" &&
        route !== "upgradeToRevocableSession") {
      throw "Bad route: '" + route + "'.";
    }

    var url = Parse.serverURL;
    if (url.charAt(url.length - 1) !== "/") {
      url += "/";
    }
    url += "1/" + route;
    if (className) {
      url += "/" + className;
    }
    if (objectId) {
      url += "/" + objectId;
    }

    dataObject = Parse._.clone(dataObject || {});
    if (method !== "POST") {
      dataObject._method = method;
      method = "POST";
    }

    if (Parse._.isUndefined(useMasterKey)) {
      useMasterKey = Parse._useMasterKey;
    }

    dataObject._ApplicationId = Parse.applicationId;
    if (!useMasterKey) {
      dataObject._JavaScriptKey = Parse.javaScriptKey;
    } else {
      dataObject._MasterKey = Parse.masterKey;
    }

    dataObject._ClientVersion = Parse.VERSION;

    return Parse._getInstallationId().then(function(iid) {
      dataObject._InstallationId = iid;

      if (sessionToken) {
        return Parse.Promise.as({ _sessionToken: sessionToken });
      }

      return Parse.User._currentAsync();
    }).then(function(currentUser) {
      if (currentUser && currentUser._sessionToken) {
        dataObject._SessionToken = currentUser._sessionToken;
      }

      if (Parse.User._isRevocableSessionEnabled) {
        dataObject._RevocableSession = '1';
      }

      var data = JSON.stringify(dataObject);

      return Parse._ajax(method, url, data);
    }).then(null, function(response) {
      // Transform the error into an instance of Parse.Error by trying to parse
      // the error string as JSON.
      var error;
      if (response && response.responseText) {
        try {
          var errorJSON = JSON.parse(response.responseText);
          error = new Parse.Error(errorJSON.code, errorJSON.error);
        } catch (e) {
          // If we fail to parse the error text, that's okay.
          error = new Parse.Error(
              Parse.Error.INVALID_JSON,
              "Received an error with invalid JSON from Parse: " +
                  response.responseText);
        }
      } else {
        error = new Parse.Error(
            Parse.Error.CONNECTION_FAILED,
            "XMLHttpRequest failed: " + JSON.stringify(response));
      }
      // By explicitly returning a rejected Promise, this will work with
      // either jQuery or Promises/A semantics.
      return Parse.Promise.error(error);
    });
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  Parse._getValue = function(object, prop) {
    if (!(object && object[prop])) {
      return null;
    }
    return Parse._.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  /**
   * Converts a value in a Parse Object into the appropriate representation.
   * This is the JS equivalent of Java's Parse.maybeReferenceAndEncode(Object)
   * if seenObjects is falsey. Otherwise any Parse.Objects not in
   * seenObjects will be fully embedded rather than encoded
   * as a pointer.  This array will be used to prevent going into an infinite
   * loop because we have circular references.  If seenObjects
   * is set, then none of the Parse Objects that are serialized can be dirty.
   */
  Parse._encode = function(value, seenObjects, disallowObjects) {
    var _ = Parse._;
    if (value instanceof Parse.Object) {
      if (disallowObjects) {
        throw "Parse.Objects not allowed here";
      }
      if (!seenObjects || _.include(seenObjects, value) || !value._hasData) {
        return value._toPointer();
      }
      if (!value.dirty()) {
        seenObjects = seenObjects.concat(value);
        return Parse._encode(value._toFullJSON(seenObjects),
                             seenObjects,
                             disallowObjects);
      }
      throw "Tried to save an object with a pointer to a new, unsaved object.";
    }
    if (value instanceof Parse.ACL) {
      return value.toJSON();
    }
    if (_.isDate(value)) {
      return { "__type": "Date", "iso": value.toJSON() };
    }
    if (value instanceof Parse.GeoPoint) {
      return value.toJSON();
    }
    if (_.isArray(value)) {
      return _.map(value, function(x) {
        return Parse._encode(x, seenObjects, disallowObjects);
      });
    }
    if (_.isRegExp(value)) {
      return value.source;
    }
    if (value instanceof Parse.Relation) {
      return value.toJSON();
    }
    if (value instanceof Parse.Op) {
      return value.toJSON();
    }
    if (value instanceof Parse.File) {
      if (!value.url()) {
        throw "Tried to save an object containing an unsaved file.";
      }
      return {
        __type: "File",
        name: value.name(),
        url: value.url()
      };
    }
    if (_.isObject(value)) {
      var output = {};
      Parse._objectEach(value, function(v, k) {
        output[k] = Parse._encode(v, seenObjects, disallowObjects);
      });
      return output;
    }
    return value;
  };

  /**
   * The inverse function of Parse._encode.
   * TODO: make decode not mutate value.
   */
  Parse._decode = function(key, value) {
    var _ = Parse._;
    if (!_.isObject(value)) {
      return value;
    }
    if (_.isArray(value)) {
      Parse._arrayEach(value, function(v, k) {
        value[k] = Parse._decode(k, v);
      });
      return value;
    }
    if (value instanceof Parse.Object) {
      return value;
    }
    if (value instanceof Parse.File) {
      return value;
    }
    if (value instanceof Parse.Op) {
      return value;
    }
    if (value.__op) {
      return Parse.Op._decode(value);
    }
    if (value.__type === "Pointer" && value.className) {
      var pointer = Parse.Object._create(value.className);
      pointer._finishFetch({ objectId: value.objectId }, false);
      return pointer;
    }
    if (value.__type === "Object" && value.className) {
      // It's an Object included in a query result.
      var className = value.className;
      delete value.__type;
      delete value.className;
      var object = Parse.Object._create(className);
      object._finishFetch(value, true);
      return object;
    }
    if (value.__type === "Date") {
      return Parse._parseDate(value.iso);
    }
    if (value.__type === "GeoPoint") {
      return new Parse.GeoPoint({
        latitude: value.latitude,
        longitude: value.longitude
      });
    }
    if (key === "ACL") {
      if (value instanceof Parse.ACL) {
        return value;
      }
      return new Parse.ACL(value);
    }
    if (value.__type === "Relation") {
      var relation = new Parse.Relation(null, key);
      relation.targetClassName = value.className;
      return relation;
    }
    if (value.__type === "File") {
      var file = new Parse.File(value.name);
      file._url = value.url;
      return file;
    }
    Parse._objectEach(value, function(v, k) {
      value[k] = Parse._decode(k, v);
    });
    return value;
  };

  Parse._arrayEach = Parse._.each;

  /**
   * Does a deep traversal of every item in object, calling func on every one.
   * @param {Object} object The object or array to traverse deeply.
   * @param {Function} func The function to call for every item. It will
   *     be passed the item as an argument. If it returns a truthy value, that
   *     value will replace the item in its parent container.
   * @returns {} the result of calling func on the top-level object itself.
   */
  Parse._traverse = function(object, func, seen) {
    if (object instanceof Parse.Object) {
      seen = seen || [];
      if (Parse._.indexOf(seen, object) >= 0) {
        // We've already visited this object in this call.
        return;
      }
      seen.push(object);
      Parse._traverse(object.attributes, func, seen);
      return func(object);
    }
    if (object instanceof Parse.Relation || object instanceof Parse.File) {
      // Nothing needs to be done, but we don't want to recurse into the
      // object's parent infinitely, so we catch this case.
      return func(object);
    }
    if (Parse._.isArray(object)) {
      Parse._.each(object, function(child, index) {
        var newChild = Parse._traverse(child, func, seen);
        if (newChild) {
          object[index] = newChild;
        }
      });
      return func(object);
    }
    if (Parse._.isObject(object)) {
      Parse._each(object, function(child, key) {
        var newChild = Parse._traverse(child, func, seen);
        if (newChild) {
          object[key] = newChild;
        }
      });
      return func(object);
    }
    return func(object);
  };

  /**
   * This is like _.each, except:
   * * it doesn't work for so-called array-like objects,
   * * it does work for dictionaries with a "length" attribute.
   */
  Parse._objectEach = Parse._each = function(obj, callback) {
    var _ = Parse._;
    if (_.isObject(obj)) {
      _.each(_.keys(obj), function(key) {
        callback(obj[key], key);
      });
    } else {
      _.each(obj, callback);
    }
  };

  // Helper function to check null or undefined.
  Parse._isNullOrUndefined = function(x) {
    return Parse._.isNull(x) || Parse._.isUndefined(x);
  };
}(this));

/* global require: false, localStorage: false */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  
  var Storage = {
    async: false,
  };

  var hasLocalStorage = (typeof localStorage !== 'undefined');
  if (hasLocalStorage) {
    try {
      localStorage.setItem('supported', true);
      localStorage.removeItem('supported');
    } catch(e) {
      hasLocalStorage = false;
    }
  }
  if (hasLocalStorage) {
    Storage.getItem = function(path) {
      return localStorage.getItem(path);
    };

    Storage.setItem = function(path, value) {
      return localStorage.setItem(path, value);
    };

    Storage.removeItem = function(path) {
      return localStorage.removeItem(path);
    };

    Storage.clear = function() {
      return localStorage.clear();
    };
  } else if (typeof require === 'function') {
    var AsyncStorage;
    try {
      AsyncStorage = eval("require('AsyncStorage')"); // jshint ignore:line

      Storage.async = true;

      Storage.getItemAsync = function(path) {
        var p = new Parse.Promise();
        AsyncStorage.getItem(path, function(err, value) {
          if (err) {
            p.reject(err);
          } else {
            p.resolve(value);
          }
        });
        return p;
      };

      Storage.setItemAsync = function(path, value) {
        var p = new Parse.Promise();
        AsyncStorage.setItem(path, value, function(err) {
          if (err) {
            p.reject(err);
          } else {
            p.resolve(value);
          }
        });
        return p;
      };

      Storage.removeItemAsync = function(path) {
        var p = new Parse.Promise();
        AsyncStorage.removeItem(path, function(err) {
          if (err) {
            p.reject(err);
          } else {
            p.resolve();
          }
        });
        return p;
      };

      Storage.clear = function() {
        AsyncStorage.clear();
      };
    } catch (e) { }
  }
  if (!Storage.async && !Storage.getItem) {
    var memMap = Storage.inMemoryMap = {};
    Storage.getItem = function(path) {
      if (memMap.hasOwnProperty(path)) {
        return memMap[path];
      }
      return null;
    };

    Storage.setItem = function(path, value) {
      memMap[path] = String(value);
    };

    Storage.removeItem = function(path) {
      delete memMap[path];
    };

    Storage.clear = function() {
      for (var key in memMap) {
        if (memMap.hasOwnProperty(key)) {
          delete memMap[key];
        }
      }
    };
  }

  // We can use synchronous methods from async scenarios, but not vice-versa
  if (!Storage.async) {
    Storage.getItemAsync = function(path) {
      return Parse.Promise.as(
        Storage.getItem(path)
      );
    };

    Storage.setItemAsync = function(path, value) {
      Storage.setItem(path, value);
      return Parse.Promise.as(value);
    };

    Storage.removeItemAsync = function(path) {
      return Parse.Promise.as(
        Storage.removeItem(path)
      );
    };
  }

  Parse.Storage = Storage;

})(this);

(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * @namespace Provides an interface to Parse's logging and analytics backend.
   */
  Parse.Analytics = Parse.Analytics || {};

  _.extend(Parse.Analytics, /** @lends Parse.Analytics */ {
    /**
     * Tracks the occurrence of a custom event with additional dimensions.
     * Parse will store a data point at the time of invocation with the given
     * event name.
     *
     * Dimensions will allow segmentation of the occurrences of this custom
     * event. Keys and values should be {@code String}s, and will throw
     * otherwise.
     *
     * To track a user signup along with additional metadata, consider the
     * following:
     * <pre>
     * var dimensions = {
     *  gender: 'm',
     *  source: 'web',
     *  dayType: 'weekend'
     * };
     * Parse.Analytics.track('signup', dimensions);
     * </pre>
     *
     * There is a default limit of 8 dimensions per event tracked.
     *
     * @param {String} name The name of the custom event to report to Parse as
     * having happened.
     * @param {Object} dimensions The dictionary of information by which to
     * segment this event.
     * @param {Object} options A Backbone-style callback object.
     * @return {Parse.Promise} A promise that is resolved when the round-trip
     * to the server completes.
     */
    track: function(name, dimensions, options) {
      name = name || '';
      name = name.replace(/^\s*/, '');
      name = name.replace(/\s*$/, '');
      if (name.length === 0) {
        throw 'A name for the custom event must be provided';
      }

      _.each(dimensions, function(val, key) {
        if (!_.isString(key) || !_.isString(val)) {
          throw 'track() dimensions expects keys and values of type "string".';
        }
      });

      options = options || {};
      return Parse._request({
        route: 'events',
        className: name,
        method: 'POST',
        data: { dimensions: dimensions }
      })._thenRunCallbacks(options);
    }
  });
}(this));

(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * @class Parse.Config is a local representation of configuration data that
   * can be set from the Parse dashboard.
   */
  Parse.Config = function() {
    this.attributes = {};
    this._escapedAttributes = {};
  };

  /**
   * Retrieves the most recently-fetched configuration object, either from
   * memory or from local storage if necessary.
   *
   * @return {Parse.Config} The most recently-fetched Parse.Config if it
   *     exists, else an empty Parse.Config.
   */
  Parse.Config.current = function() {
    if (Parse.Config._currentConfig) {
      return Parse.Config._currentConfig;
    }

    var config = new Parse.Config();

    if (Parse.Storage.async) {
      return config;
    }

    var configData = Parse.Storage.getItem(Parse._getParsePath(
          Parse.Config._CURRENT_CONFIG_KEY));

    if (configData) {  
      config._finishFetch(JSON.parse(configData));
      Parse.Config._currentConfig = config;
    }
    return config;
  };

  /**
   * Gets a new configuration object from the server.
   * @param {Object} options A Backbone-style options object.
   * Valid options are:<ul>
   *   <li>success: Function to call when the get completes successfully.
   *   <li>error: Function to call when the get fails.
   * </ul>
   * @return {Parse.Promise} A promise that is resolved with a newly-created
   *     configuration object when the get completes.
   */
  Parse.Config.get = function(options) {
    options = options || {};

    var request = Parse._request({
      route: "config",
      method: "GET",
    });

    return request.then(function(response) {
      if (!response || !response.params) {
        var errorObject = new Parse.Error(
          Parse.Error.INVALID_JSON,
          "Config JSON response invalid.");
        return Parse.Promise.error(errorObject);
      }

      var config = new Parse.Config();
      config._finishFetch(response);
      Parse.Config._currentConfig = config;
      return config;
    })._thenRunCallbacks(options);
  };

  Parse.Config.prototype = {

    /**
     * Gets the HTML-escaped value of an attribute.
     */
    escape: function(attr) {
      var html = this._escapedAttributes[attr];
      if (html) {
        return html;
      }
      var val = this.attributes[attr];
      var escaped;
      if (Parse._isNullOrUndefined(val)) {
        escaped = '';
      } else {
        escaped = _.escape(val.toString());
      }
      this._escapedAttributes[attr] = escaped;
      return escaped;
    },

    /**
     * Gets the value of an attribute.
     * @param {String} attr The name of an attribute.
     */
    get: function(attr) {
      return this.attributes[attr];
    },

    _finishFetch: function(serverData) {
      this.attributes = Parse._decode(null, _.clone(serverData.params));
      if (!Parse.Storage.async) {
        // We only provide local caching of config with synchronous Storage
        Parse.Storage.setItem(
            Parse._getParsePath(Parse.Config._CURRENT_CONFIG_KEY),
            JSON.stringify(serverData));
      }
    }
  };

  Parse.Config._currentConfig = null;

  Parse.Config._CURRENT_CONFIG_KEY = "currentConfig";

}(this));


(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Constructs a new Parse.Error object with the given code and message.
   * @param {Number} code An error code constant from <code>Parse.Error</code>.
   * @param {String} message A detailed description of the error.
   * @class
   *
   * <p>Class used for all objects passed to error callbacks.</p>
   */
  Parse.Error = function(code, message) {
    this.code = code;
    this.message = message;
  };

  _.extend(Parse.Error, /** @lends Parse.Error */ {
    /**
     * Error code indicating some error other than those enumerated here.
     * @constant
     */
    OTHER_CAUSE: -1,

    /**
     * Error code indicating that something has gone wrong with the server.
     * If you get this error code, it is Parse's fault. Contact us at 
     * https://parse.com/help
     * @constant
     */
    INTERNAL_SERVER_ERROR: 1,

    /**
     * Error code indicating the connection to the Parse servers failed.
     * @constant
     */
    CONNECTION_FAILED: 100,

    /**
     * Error code indicating the specified object doesn't exist.
     * @constant
     */
    OBJECT_NOT_FOUND: 101,

    /**
     * Error code indicating you tried to query with a datatype that doesn't
     * support it, like exact matching an array or object.
     * @constant
     */
    INVALID_QUERY: 102,

    /**
     * Error code indicating a missing or invalid classname. Classnames are
     * case-sensitive. They must start with a letter, and a-zA-Z0-9_ are the
     * only valid characters.
     * @constant
     */
    INVALID_CLASS_NAME: 103,

    /**
     * Error code indicating an unspecified object id.
     * @constant
     */
    MISSING_OBJECT_ID: 104,

    /**
     * Error code indicating an invalid key name. Keys are case-sensitive. They
     * must start with a letter, and a-zA-Z0-9_ are the only valid characters.
     * @constant
     */
    INVALID_KEY_NAME: 105,

    /**
     * Error code indicating a malformed pointer. You should not see this unless
     * you have been mucking about changing internal Parse code.
     * @constant
     */
    INVALID_POINTER: 106,

    /**
     * Error code indicating that badly formed JSON was received upstream. This
     * either indicates you have done something unusual with modifying how
     * things encode to JSON, or the network is failing badly.
     * @constant
     */
    INVALID_JSON: 107,

    /**
     * Error code indicating that the feature you tried to access is only
     * available internally for testing purposes.
     * @constant
     */
    COMMAND_UNAVAILABLE: 108,

    /**
     * You must call Parse.initialize before using the Parse library.
     * @constant
     */
    NOT_INITIALIZED: 109,

    /**
     * Error code indicating that a field was set to an inconsistent type.
     * @constant
     */
    INCORRECT_TYPE: 111,

    /**
     * Error code indicating an invalid channel name. A channel name is either
     * an empty string (the broadcast channel) or contains only a-zA-Z0-9_
     * characters and starts with a letter.
     * @constant
     */
    INVALID_CHANNEL_NAME: 112,

    /**
     * Error code indicating that push is misconfigured.
     * @constant
     */
    PUSH_MISCONFIGURED: 115,

    /**
     * Error code indicating that the object is too large.
     * @constant
     */
    OBJECT_TOO_LARGE: 116,

    /**
     * Error code indicating that the operation isn't allowed for clients.
     * @constant
     */
    OPERATION_FORBIDDEN: 119,

    /**
     * Error code indicating the result was not found in the cache.
     * @constant
     */
    CACHE_MISS: 120,

    /**
     * Error code indicating that an invalid key was used in a nested
     * JSONObject.
     * @constant
     */
    INVALID_NESTED_KEY: 121,

    /**
     * Error code indicating that an invalid filename was used for ParseFile.
     * A valid file name contains only a-zA-Z0-9_. characters and is between 1
     * and 128 characters.
     * @constant
     */
    INVALID_FILE_NAME: 122,

    /**
     * Error code indicating an invalid ACL was provided.
     * @constant
     */
    INVALID_ACL: 123,

    /**
     * Error code indicating that the request timed out on the server. Typically
     * this indicates that the request is too expensive to run.
     * @constant
     */
    TIMEOUT: 124,

    /**
     * Error code indicating that the email address was invalid.
     * @constant
     */
    INVALID_EMAIL_ADDRESS: 125,

    /**
     * Error code indicating a missing content type.
     * @constant
     */
    MISSING_CONTENT_TYPE: 126,

    /**
     * Error code indicating a missing content length.
     * @constant
     */
    MISSING_CONTENT_LENGTH: 127,

    /**
     * Error code indicating an invalid content length.
     * @constant
     */
    INVALID_CONTENT_LENGTH: 128,

    /**
     * Error code indicating a file that was too large.
     * @constant
     */
    FILE_TOO_LARGE: 129,

    /**
     * Error code indicating an error saving a file.
     * @constant
     */
    FILE_SAVE_ERROR: 130,

    /**
     * Error code indicating that a unique field was given a value that is
     * already taken.
     * @constant
     */
    DUPLICATE_VALUE: 137,

    /**
     * Error code indicating that a role's name is invalid.
     * @constant
     */
    INVALID_ROLE_NAME: 139,

    /**
     * Error code indicating that an application quota was exceeded.  Upgrade to
     * resolve.
     * @constant
     */
    EXCEEDED_QUOTA: 140,

    /**
     * Error code indicating that a Cloud Code script failed.
     * @constant
     */
    SCRIPT_FAILED: 141,

    /**
     * Error code indicating that a Cloud Code validation failed.
     * @constant
     */
    VALIDATION_ERROR: 142,

    /**
     * Error code indicating that invalid image data was provided.
     * @constant
     */
    INVALID_IMAGE_DATA: 150,

    /**
     * Error code indicating an unsaved file.
     * @constant
     */
    UNSAVED_FILE_ERROR: 151,

    /**
     * Error code indicating an invalid push time.
     */
    INVALID_PUSH_TIME_ERROR: 152,

    /**
     * Error code indicating an error deleting a file.
     * @constant
     */
    FILE_DELETE_ERROR: 153,

    /**
     * Error code indicating that the application has exceeded its request
     * limit.
     * @constant
     */
    REQUEST_LIMIT_EXCEEDED: 155,

    /**
     * Error code indicating an invalid event name.
     */
    INVALID_EVENT_NAME: 160,

    /**
     * Error code indicating that the username is missing or empty.
     * @constant
     */
    USERNAME_MISSING: 200,

    /**
     * Error code indicating that the password is missing or empty.
     * @constant
     */
    PASSWORD_MISSING: 201,

    /**
     * Error code indicating that the username has already been taken.
     * @constant
     */
    USERNAME_TAKEN: 202,

    /**
     * Error code indicating that the email has already been taken.
     * @constant
     */
    EMAIL_TAKEN: 203,

    /**
     * Error code indicating that the email is missing, but must be specified.
     * @constant
     */
    EMAIL_MISSING: 204,

    /**
     * Error code indicating that a user with the specified email was not found.
     * @constant
     */
    EMAIL_NOT_FOUND: 205,

    /**
     * Error code indicating that a user object without a valid session could
     * not be altered.
     * @constant
     */
    SESSION_MISSING: 206,

    /**
     * Error code indicating that a user can only be created through signup.
     * @constant
     */
    MUST_CREATE_USER_THROUGH_SIGNUP: 207,

    /**
     * Error code indicating that an an account being linked is already linked
     * to another user.
     * @constant
     */
    ACCOUNT_ALREADY_LINKED: 208,

    /**
     * Error code indicating that the current session token is invalid.
     * @constant
     */
    INVALID_SESSION_TOKEN: 209,

    /**
     * Error code indicating that a user cannot be linked to an account because
     * that account's id could not be found.
     * @constant
     */
    LINKED_ID_MISSING: 250,

    /**
     * Error code indicating that a user with a linked (e.g. Facebook) account
     * has an invalid session.
     * @constant
     */
    INVALID_LINKED_SESSION: 251,

    /**
     * Error code indicating that a service being linked (e.g. Facebook or
     * Twitter) is unsupported.
     * @constant
     */
    UNSUPPORTED_SERVICE: 252,

    /**
     * Error code indicating that there were multiple errors. Aggregate errors
     * have an "errors" property, which is an array of error objects with more
     * detail about each error that occurred.
     * @constant
     */
    AGGREGATE_ERROR: 600,

    /**
     * Error code indicating the client was unable to read an input file.
     * @constant
     */
    FILE_READ_ERROR: 601,

    /**
     * Error code indicating a real error code is unavailable because
     * we had to use an XDomainRequest object to allow CORS requests in
     * Internet Explorer, which strips the body from HTTP responses that have
     * a non-2XX status code.
     * @constant
     */
    X_DOMAIN_REQUEST: 602
  });

}(this));

/*global _: false */
(function() {
  var root = this;
  var Parse = (root.Parse || (root.Parse = {}));
  var eventSplitter = /\s+/;
  var slice = Array.prototype.slice;

  /**
   * @class
   *
   * <p>Parse.Events is a fork of Backbone's Events module, provided for your
   * convenience.</p>
   *
   * <p>A module that can be mixed in to any object in order to provide
   * it with custom events. You may bind callback functions to an event
   * with `on`, or remove these functions with `off`.
   * Triggering an event fires all callbacks in the order that `on` was
   * called.
   *
   * <pre>
   *     var object = {};
   *     _.extend(object, Parse.Events);
   *     object.on('expand', function(){ alert('expanded'); });
   *     object.trigger('expand');</pre></p>
   *
   * <p>For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#Events">Backbone
   * documentation</a>.</p>
   */
  Parse.Events = {
    /**
     * Bind one or more space separated events, `events`, to a `callback`
     * function. Passing `"all"` will bind the callback to all events fired.
     */
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) {
        return this;
      }
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      event = events.shift();
      while (event) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
        event = events.shift();
      }

      return this;
    },

    /**
     * Remove one or many callbacks. If `context` is null, removes all callbacks
     * with that function. If `callback` is null, removes all callbacks for the
     * event. If `events` is null, removes all bound callbacks for all events.
     */
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) {
        return;
      }
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : Object.keys(calls);
      event = events.shift();
      while (event) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) {
          event = events.shift();
          continue;
        }
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        node = node.next;
        while (node !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
          node = node.next;
        }
        event = events.shift();
      }

      return this;
    },

    /**
     * Trigger one or many events, firing all bound callbacks. Callbacks are
     * passed the same arguments as `trigger` is, apart from the event name
     * (unless you're listening on `"all"`, which will cause your callback to
     * receive the true name of the event as the first argument).
     */
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) {
        return this;
      }
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      event = events.shift();
      while (event) {
        node = calls[event];
        if (node) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        node = all;
        if (node) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
        event = events.shift();
      }

      return this;
    }
  };  

  /**
   * @function
   */
  Parse.Events.bind = Parse.Events.on;

  /**
   * @function
   */
  Parse.Events.unbind = Parse.Events.off;
}.call(this));


/*global navigator: false */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new GeoPoint with any of the following forms:<br>
   *   <pre>
   *   new GeoPoint(otherGeoPoint)
   *   new GeoPoint(30, 30)
   *   new GeoPoint([30, 30])
   *   new GeoPoint({latitude: 30, longitude: 30})
   *   new GeoPoint()  // defaults to (0, 0)
   *   </pre>
   * @class
   *
   * <p>Represents a latitude / longitude point that may be associated
   * with a key in a ParseObject or used as a reference point for geo queries.
   * This allows proximity-based queries on the key.</p>
   *
   * <p>Only one key in a class may contain a GeoPoint.</p>
   *
   * <p>Example:<pre>
   *   var point = new Parse.GeoPoint(30.0, -20.0);
   *   var object = new Parse.Object("PlaceObject");
   *   object.set("location", point);
   *   object.save();</pre></p>
   */
  Parse.GeoPoint = function(arg1, arg2) {
    if (_.isArray(arg1)) {
      Parse.GeoPoint._validate(arg1[0], arg1[1]);
      this.latitude = arg1[0];
      this.longitude = arg1[1];
    } else if (_.isObject(arg1)) {
      Parse.GeoPoint._validate(arg1.latitude, arg1.longitude);
      this.latitude = arg1.latitude;
      this.longitude = arg1.longitude;
    } else if (_.isNumber(arg1) && _.isNumber(arg2)) {
      Parse.GeoPoint._validate(arg1, arg2);
      this.latitude = arg1;
      this.longitude = arg2;
    } else {
      this.latitude = 0;
      this.longitude = 0;
    }

    // Add properties so that anyone using Webkit or Mozilla will get an error
    // if they try to set values that are out of bounds.
    var self = this;
    if (this.__defineGetter__ && this.__defineSetter__) {
      // Use _latitude and _longitude to actually store the values, and add
      // getters and setters for latitude and longitude.
      this._latitude = this.latitude;
      this._longitude = this.longitude;
      this.__defineGetter__("latitude", function() {
        return self._latitude;
      });
      this.__defineGetter__("longitude", function() {
        return self._longitude;
      });
      this.__defineSetter__("latitude", function(val) {
        Parse.GeoPoint._validate(val, self.longitude);
        self._latitude = val;
      });
      this.__defineSetter__("longitude", function(val) {
        Parse.GeoPoint._validate(self.latitude, val);
        self._longitude = val;
      });
    }
  };

  /**
   * @lends Parse.GeoPoint.prototype
   * @property {float} latitude North-south portion of the coordinate, in range
   *   [-90, 90].  Throws an exception if set out of range in a modern browser.
   * @property {float} longitude East-west portion of the coordinate, in range
   *   [-180, 180].  Throws if set out of range in a modern browser.
   */

  /**
   * Throws an exception if the given lat-long is out of bounds.
   */
  Parse.GeoPoint._validate = function(latitude, longitude) {
    if (latitude < -90.0) {
      throw "Parse.GeoPoint latitude " + latitude + " < -90.0.";
    }
    if (latitude > 90.0) {
      throw "Parse.GeoPoint latitude " + latitude + " > 90.0.";
    }
    if (longitude < -180.0) {
      throw "Parse.GeoPoint longitude " + longitude + " < -180.0.";
    }
    if (longitude > 180.0) {
      throw "Parse.GeoPoint longitude " + longitude + " > 180.0.";
    }
  };

  /**
   * Creates a GeoPoint with the user's current location, if available.
   * Calls options.success with a new GeoPoint instance or calls options.error.
   * @param {Object} options An object with success and error callbacks.
   */
  Parse.GeoPoint.current = function(options) {
    var promise = new Parse.Promise();
    navigator.geolocation.getCurrentPosition(function(location) {
      promise.resolve(new Parse.GeoPoint({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));

    }, function(error) {
      promise.reject(error);
    });

    return promise._thenRunCallbacks(options);
  };

  Parse.GeoPoint.prototype = {
    /**
     * Returns a JSON representation of the GeoPoint, suitable for Parse.
     * @return {Object}
     */
    toJSON: function() {
      Parse.GeoPoint._validate(this.latitude, this.longitude);
      return {
        "__type": "GeoPoint",
        latitude: this.latitude,
        longitude: this.longitude
      };
    },

    /**
     * Returns the distance from this GeoPoint to another in radians.
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
    radiansTo: function(point) {
      var d2r = Math.PI / 180.0;
      var lat1rad = this.latitude * d2r;
      var long1rad = this.longitude * d2r;
      var lat2rad = point.latitude * d2r;
      var long2rad = point.longitude * d2r;
      var deltaLat = lat1rad - lat2rad;
      var deltaLong = long1rad - long2rad;
      var sinDeltaLatDiv2 = Math.sin(deltaLat / 2);
      var sinDeltaLongDiv2 = Math.sin(deltaLong / 2);
      // Square of half the straight line chord distance between both points.
      var a = ((sinDeltaLatDiv2 * sinDeltaLatDiv2) +
               (Math.cos(lat1rad) * Math.cos(lat2rad) *
                sinDeltaLongDiv2 * sinDeltaLongDiv2));
      a = Math.min(1.0, a);
      return 2 * Math.asin(Math.sqrt(a));
    },

    /**
     * Returns the distance from this GeoPoint to another in kilometers.
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
    kilometersTo: function(point) {
      return this.radiansTo(point) * 6371.0;
    },

    /**
     * Returns the distance from this GeoPoint to another in miles.
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
    milesTo: function(point) {
      return this.radiansTo(point) * 3958.8;
    }
  };
}(this));

/*global navigator: false */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  var PUBLIC_KEY = "*";

  /**
   * Creates a new ACL.
   * If no argument is given, the ACL has no permissions for anyone.
   * If the argument is a Parse.User, the ACL will have read and write
   *   permission for only that user.
   * If the argument is any other JSON object, that object will be interpretted
   *   as a serialized ACL created with toJSON().
   * @see Parse.Object#setACL
   * @class
   *
   * <p>An ACL, or Access Control List can be added to any
   * <code>Parse.Object</code> to restrict access to only a subset of users
   * of your application.</p>
   */
  Parse.ACL = function(arg1) {
    var self = this;
    self.permissionsById = {};
    if (_.isObject(arg1)) {
      if (arg1 instanceof Parse.User) {
        self.setReadAccess(arg1, true);
        self.setWriteAccess(arg1, true);
      } else {
        if (_.isFunction(arg1)) {
          throw "Parse.ACL() called with a function.  Did you forget ()?";
        }
        Parse._objectEach(arg1, function(accessList, userId) {
          if (!_.isString(userId)) {
            throw "Tried to create an ACL with an invalid userId.";
          }
          self.permissionsById[userId] = {};
          Parse._objectEach(accessList, function(allowed, permission) {
            if (permission !== "read" && permission !== "write") {
              throw "Tried to create an ACL with an invalid permission type.";
            }
            if (!_.isBoolean(allowed)) {
              throw "Tried to create an ACL with an invalid permission value.";
            }
            self.permissionsById[userId][permission] = allowed;
          });
        });
      }
    }
  };

  /**
   * Returns a JSON-encoded version of the ACL.
   * @return {Object}
   */
  Parse.ACL.prototype.toJSON = function() {
    return _.clone(this.permissionsById);
  };

  Parse.ACL.prototype._setAccess = function(accessType, userId, allowed) {
    if (userId instanceof Parse.User) {
      userId = userId.id;
    } else if (userId instanceof Parse.Role) {
      userId = "role:" + userId.getName();
    }
    if (!_.isString(userId)) {
      throw "userId must be a string.";
    }
    if (!_.isBoolean(allowed)) {
      throw "allowed must be either true or false.";
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      if (!allowed) {
        // The user already doesn't have this permission, so no action needed.
        return;
      } else {
        permissions = {};
        this.permissionsById[userId] = permissions;
      }
    }

    if (allowed) {
      this.permissionsById[userId][accessType] = true;
    } else {
      delete permissions[accessType];
      if (_.isEmpty(permissions)) {
        delete permissions[userId];
      }
    }
  };

  Parse.ACL.prototype._getAccess = function(accessType, userId) {
    if (userId instanceof Parse.User) {
      userId = userId.id;
    } else if (userId instanceof Parse.Role) {
      userId = "role:" + userId.getName();
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      return false;
    }
    return permissions[accessType] ? true : false;
  };

  /**
   * Set whether the given user is allowed to read this object.
   * @param userId An instance of Parse.User or its objectId.
   * @param {Boolean} allowed Whether that user should have read access.
   */
  Parse.ACL.prototype.setReadAccess = function(userId, allowed) {
    this._setAccess("read", userId, allowed);
  };

  /**
   * Get whether the given user id is *explicitly* allowed to read this object.
   * Even if this returns false, the user may still be able to access it if
   * getPublicReadAccess returns true or a role that the user belongs to has
   * write access.
   * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getReadAccess = function(userId) {
    return this._getAccess("read", userId);
  };

  /**
   * Set whether the given user id is allowed to write this object.
   * @param userId An instance of Parse.User or its objectId, or a Parse.Role..
   * @param {Boolean} allowed Whether that user should have write access.
   */
  Parse.ACL.prototype.setWriteAccess = function(userId, allowed) {
    this._setAccess("write", userId, allowed);
  };

  /**
   * Get whether the given user id is *explicitly* allowed to write this object.
   * Even if this returns false, the user may still be able to write it if
   * getPublicWriteAccess returns true or a role that the user belongs to has
   * write access.
   * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getWriteAccess = function(userId) {
    return this._getAccess("write", userId);
  };

  /**
   * Set whether the public is allowed to read this object.
   * @param {Boolean} allowed
   */
  Parse.ACL.prototype.setPublicReadAccess = function(allowed) {
    this.setReadAccess(PUBLIC_KEY, allowed);
  };

  /**
   * Get whether the public is allowed to read this object.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getPublicReadAccess = function() {
    return this.getReadAccess(PUBLIC_KEY);
  };

  /**
   * Set whether the public is allowed to write this object.
   * @param {Boolean} allowed
   */
  Parse.ACL.prototype.setPublicWriteAccess = function(allowed) {
    this.setWriteAccess(PUBLIC_KEY, allowed);
  };

  /**
   * Get whether the public is allowed to write this object.
   * @return {Boolean}
   */
  Parse.ACL.prototype.getPublicWriteAccess = function() {
    return this.getWriteAccess(PUBLIC_KEY);
  };
  
  /**
   * Get whether users belonging to the given role are allowed
   * to read this object. Even if this returns false, the role may
   * still be able to write it if a parent role has read access.
   * 
   * @param role The name of the role, or a Parse.Role object.
   * @return {Boolean} true if the role has read access. false otherwise.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.getRoleReadAccess = function(role) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getReadAccess("role:" + role);
    }
    throw "role must be a Parse.Role or a String";
  };
  
  /**
   * Get whether users belonging to the given role are allowed
   * to write this object. Even if this returns false, the role may
   * still be able to write it if a parent role has write access.
   * 
   * @param role The name of the role, or a Parse.Role object.
   * @return {Boolean} true if the role has write access. false otherwise.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.getRoleWriteAccess = function(role) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getWriteAccess("role:" + role);
    }
    throw "role must be a Parse.Role or a String";
  };
  
  /**
   * Set whether users belonging to the given role are allowed
   * to read this object.
   * 
   * @param role The name of the role, or a Parse.Role object.
   * @param {Boolean} allowed Whether the given role can read this object.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.setRoleReadAccess = function(role, allowed) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setReadAccess("role:" + role, allowed);
      return;
    }
    throw "role must be a Parse.Role or a String";
  };
  
  /**
   * Set whether users belonging to the given role are allowed
   * to write this object.
   * 
   * @param role The name of the role, or a Parse.Role object.
   * @param {Boolean} allowed Whether the given role can write this object.
   * @throws {String} If role is neither a Parse.Role nor a String.
   */
  Parse.ACL.prototype.setRoleWriteAccess = function(role, allowed) {
    if (role instanceof Parse.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setWriteAccess("role:" + role, allowed);
      return;
    }
    throw "role must be a Parse.Role or a String";
  };

}(this));

(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * @class
   * A Parse.Op is an atomic operation that can be applied to a field in a
   * Parse.Object. For example, calling <code>object.set("foo", "bar")</code>
   * is an example of a Parse.Op.Set. Calling <code>object.unset("foo")</code>
   * is a Parse.Op.Unset. These operations are stored in a Parse.Object and
   * sent to the server as part of <code>object.save()</code> operations.
   * Instances of Parse.Op should be immutable.
   *
   * You should not create subclasses of Parse.Op or instantiate Parse.Op
   * directly.
   */
  Parse.Op = function() {
    this._initialize.apply(this, arguments);
  };

  Parse.Op.prototype = {
    _initialize: function() {}
  };

  _.extend(Parse.Op, {
    /**
     * To create a new Op, call Parse.Op._extend();
     */
    _extend: Parse._extend,

    // A map of __op string to decoder function.
    _opDecoderMap: {},

    /**
     * Registers a function to convert a json object with an __op field into an
     * instance of a subclass of Parse.Op.
     */
    _registerDecoder: function(opName, decoder) {
      Parse.Op._opDecoderMap[opName] = decoder;
    },

    /**
     * Converts a json object into an instance of a subclass of Parse.Op.
     */
    _decode: function(json) {
      var decoder = Parse.Op._opDecoderMap[json.__op];
      if (decoder) {
        return decoder(json);
      } else {
        return undefined;
      }
    }
  });

  /*
   * Add a handler for Batch ops.
   */
  Parse.Op._registerDecoder("Batch", function(json) {
    var op = null;
    Parse._arrayEach(json.ops, function(nextOp) {
      nextOp = Parse.Op._decode(nextOp);
      op = nextOp._mergeWithPrevious(op);
    });
    return op;
  });

  /**
   * @class
   * A Set operation indicates that either the field was changed using
   * Parse.Object.set, or it is a mutable container that was detected as being
   * changed.
   */
  Parse.Op.Set = Parse.Op._extend(/** @lends Parse.Op.Set.prototype */ {
    _initialize: function(value) {
      this._value = value;
    },

    /**
     * Returns the new value of this field after the set.
     */
    value: function() {
      return this._value;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to Parse.
     * @return {Object}
     */
    toJSON: function() {
      return Parse._encode(this.value());
    },

    _mergeWithPrevious: function(previous) {
      return this;
    },

    _estimate: function(oldValue) {
      return this.value();
    }
  });

  /**
   * A sentinel value that is returned by Parse.Op.Unset._estimate to
   * indicate the field should be deleted. Basically, if you find _UNSET as a
   * value in your object, you should remove that key.
   */
  Parse.Op._UNSET = {};

  /**
   * @class
   * An Unset operation indicates that this field has been deleted from the
   * object.
   */
  Parse.Op.Unset = Parse.Op._extend(/** @lends Parse.Op.Unset.prototype */ {
    /**
     * Returns a JSON version of the operation suitable for sending to Parse.
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Delete" };
    },

    _mergeWithPrevious: function(previous) {
      return this;
    },

    _estimate: function(oldValue) {
      return Parse.Op._UNSET;
    }
  });

  Parse.Op._registerDecoder("Delete", function(json) {
    return new Parse.Op.Unset();
  });

  /**
   * @class
   * An Increment is an atomic operation where the numeric value for the field
   * will be increased by a given amount.
   */
  Parse.Op.Increment = Parse.Op._extend(
      /** @lends Parse.Op.Increment.prototype */ {

    _initialize: function(amount) {
      this._amount = amount;
    },

    /**
     * Returns the amount to increment by.
     * @return {Number} the amount to increment by.
     */
    amount: function() {
      return this._amount;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to Parse.
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Increment", amount: this._amount };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof Parse.Op.Unset) {
        return new Parse.Op.Set(this.amount());
      } else if (previous instanceof Parse.Op.Set) {
        return new Parse.Op.Set(previous.value() + this.amount());
      } else if (previous instanceof Parse.Op.Increment) {
        return new Parse.Op.Increment(this.amount() + previous.amount());
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return this.amount();
      }
      return oldValue + this.amount();
    }
  });

  Parse.Op._registerDecoder("Increment", function(json) {
    return new Parse.Op.Increment(json.amount);
  });

  /**
   * @class
   * Add is an atomic operation where the given objects will be appended to the
   * array that is stored in this field.
   */
  Parse.Op.Add = Parse.Op._extend(/** @lends Parse.Op.Add.prototype */ {
    _initialize: function(objects) {
      this._objects = objects;
    },

    /**
     * Returns the objects to be added to the array.
     * @return {Array} The objects to be added to the array.
     */
    objects: function() {
      return this._objects;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to Parse.
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Add", objects: Parse._encode(this.objects()) };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof Parse.Op.Unset) {
        return new Parse.Op.Set(this.objects());
      } else if (previous instanceof Parse.Op.Set) {
        return new Parse.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof Parse.Op.Add) {
        return new Parse.Op.Add(previous.objects().concat(this.objects()));
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return _.clone(this.objects());
      } else {
        return oldValue.concat(this.objects());
      }
    }
  });

  Parse.Op._registerDecoder("Add", function(json) {
    return new Parse.Op.Add(Parse._decode(undefined, json.objects));
  });

  /**
   * @class
   * AddUnique is an atomic operation where the given items will be appended to
   * the array that is stored in this field only if they were not already
   * present in the array.
   */
  Parse.Op.AddUnique = Parse.Op._extend(
      /** @lends Parse.Op.AddUnique.prototype */ {

    _initialize: function(objects) {
      this._objects = _.uniq(objects);
    },

    /**
     * Returns the objects to be added to the array.
     * @return {Array} The objects to be added to the array.
     */
    objects: function() {
      return this._objects;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to Parse.
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "AddUnique", objects: Parse._encode(this.objects()) };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof Parse.Op.Unset) {
        return new Parse.Op.Set(this.objects());
      } else if (previous instanceof Parse.Op.Set) {
        return new Parse.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof Parse.Op.AddUnique) {
        return new Parse.Op.AddUnique(this._estimate(previous.objects()));
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return _.clone(this.objects());
      } else {
        // We can't just take the _.uniq(_.union(...)) of oldValue and
        // this.objects, because the uniqueness may not apply to oldValue
        // (especially if the oldValue was set via .set())
        var newValue = _.clone(oldValue);
        Parse._arrayEach(this.objects(), function(obj) {
          if (obj instanceof Parse.Object && obj.id) {
            var matchingObj = _.find(newValue, function(anObj) {
              return (anObj instanceof Parse.Object) && (anObj.id === obj.id);
            });
            if (!matchingObj) {
              newValue.push(obj);
            } else {
              var index = _.indexOf(newValue, matchingObj);
              newValue[index] = obj;
            }
          } else if (!_.contains(newValue, obj)) {
            newValue.push(obj);
          }
        });
        return newValue;
      }
    }
  });

  Parse.Op._registerDecoder("AddUnique", function(json) {
    return new Parse.Op.AddUnique(Parse._decode(undefined, json.objects));
  });

  /**
   * @class
   * Remove is an atomic operation where the given objects will be removed from
   * the array that is stored in this field.
   */
  Parse.Op.Remove = Parse.Op._extend(/** @lends Parse.Op.Remove.prototype */ {
    _initialize: function(objects) {
      this._objects = _.uniq(objects);
    },

    /**
     * Returns the objects to be removed from the array.
     * @return {Array} The objects to be removed from the array.
     */
    objects: function() {
      return this._objects;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to Parse.
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Remove", objects: Parse._encode(this.objects()) };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof Parse.Op.Unset) {
        return previous;
      } else if (previous instanceof Parse.Op.Set) {
        return new Parse.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof Parse.Op.Remove) {
        return new Parse.Op.Remove(_.union(previous.objects(), this.objects()));
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return [];
      } else {
        var newValue = _.difference(oldValue, this.objects());
        // If there are saved Parse Objects being removed, also remove them.
        Parse._arrayEach(this.objects(), function(obj) {
          if (obj instanceof Parse.Object && obj.id) {
            newValue = _.reject(newValue, function(other) {
              return (other instanceof Parse.Object) && (other.id === obj.id);
            });
          }
        });
        return newValue;
      }
    }
  });

  Parse.Op._registerDecoder("Remove", function(json) {
    return new Parse.Op.Remove(Parse._decode(undefined, json.objects));
  });

  /**
   * @class
   * A Relation operation indicates that the field is an instance of
   * Parse.Relation, and objects are being added to, or removed from, that
   * relation.
   */
  Parse.Op.Relation = Parse.Op._extend(
      /** @lends Parse.Op.Relation.prototype */ {

    _initialize: function(adds, removes) {
      this._targetClassName = null;

      var self = this;

      var pointerToId = function(object) {
        if (object instanceof Parse.Object) {
          if (!object.id) {
            throw "You can't add an unsaved Parse.Object to a relation.";
          }
          if (!self._targetClassName) {
            self._targetClassName = object.className;
          }
          if (self._targetClassName !== object.className) {
            throw "Tried to create a Parse.Relation with 2 different types: " +
                  self._targetClassName + " and " + object.className + ".";
          }
          return object.id;
        }
        return object;
      };

      this.relationsToAdd = _.uniq(_.map(adds, pointerToId));
      this.relationsToRemove = _.uniq(_.map(removes, pointerToId));
    },

    /**
     * Returns an array of unfetched Parse.Object that are being added to the
     * relation.
     * @return {Array}
     */
    added: function() {
      var self = this;
      return _.map(this.relationsToAdd, function(objectId) {
        var object = Parse.Object._create(self._targetClassName);
        object.id = objectId;
        return object;
      });
    },

    /**
     * Returns an array of unfetched Parse.Object that are being removed from
     * the relation.
     * @return {Array}
     */
    removed: function() {
      var self = this;
      return _.map(this.relationsToRemove, function(objectId) {
        var object = Parse.Object._create(self._targetClassName);
        object.id = objectId;
        return object;
      });
    },

    /**
     * Returns a JSON version of the operation suitable for sending to Parse.
     * @return {Object}
     */
    toJSON: function() {
      var adds = null;
      var removes = null;
      var self = this;
      var idToPointer = function(id) {
        return { __type: 'Pointer',
                 className: self._targetClassName,
                 objectId: id };
      };
      var pointers = null;
      if (this.relationsToAdd.length > 0) {
        pointers = _.map(this.relationsToAdd, idToPointer);
        adds = { "__op": "AddRelation", "objects": pointers };
      }

      if (this.relationsToRemove.length > 0) {
        pointers = _.map(this.relationsToRemove, idToPointer);
        removes = { "__op": "RemoveRelation", "objects": pointers };
      }

      if (adds && removes) {
        return { "__op": "Batch", "ops": [adds, removes]};
      }

      return adds || removes || {};
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof Parse.Op.Unset) {
        throw "You can't modify a relation after deleting it.";
      } else if (previous instanceof Parse.Op.Relation) {
        if (previous._targetClassName &&
            previous._targetClassName !== this._targetClassName) {
          throw "Related object must be of class " + previous._targetClassName +
              ", but " + this._targetClassName + " was passed in.";
        }
        var newAdd = _.union(_.difference(previous.relationsToAdd,
                                          this.relationsToRemove),
                             this.relationsToAdd);
        var newRemove = _.union(_.difference(previous.relationsToRemove,
                                             this.relationsToAdd),
                                this.relationsToRemove);

        var newRelation = new Parse.Op.Relation(newAdd, newRemove);
        newRelation._targetClassName = this._targetClassName;
        return newRelation;
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue, object, key) {
      if (!oldValue) {
        var relation = new Parse.Relation(object, key);
        relation.targetClassName = this._targetClassName;
      } else if (oldValue instanceof Parse.Relation) {
        if (this._targetClassName) {
          if (oldValue.targetClassName) {
            if (oldValue.targetClassName !== this._targetClassName) {
              throw "Related object must be a " + oldValue.targetClassName +
                  ", but a " + this._targetClassName + " was passed in.";
            }
          } else {
            oldValue.targetClassName = this._targetClassName;
          }
        }
        return oldValue;
      } else {
        throw "Op is invalid after previous op.";
      }
    }
  });

  Parse.Op._registerDecoder("AddRelation", function(json) {
    return new Parse.Op.Relation(Parse._decode(undefined, json.objects), []);
  });
  Parse.Op._registerDecoder("RemoveRelation", function(json) {
    return new Parse.Op.Relation([], Parse._decode(undefined, json.objects));
  });

}(this));

(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new Relation for the given parent object and key. This
   * constructor should rarely be used directly, but rather created by
   * Parse.Object.relation.
   * @param {Parse.Object} parent The parent of this relation.
   * @param {String} key The key for this relation on the parent.
   * @see Parse.Object#relation
   * @class
   *
   * <p>
   * A class that is used to access all of the children of a many-to-many
   * relationship.  Each instance of Parse.Relation is associated with a
   * particular parent object and key.
   * </p>
   */
  Parse.Relation = function(parent, key) {
    this.parent = parent;
    this.key = key;
    this.targetClassName = null;
  };

  Parse.Relation.prototype = {
    /**
     * Makes sure that this relation has the right parent and key.
     */
    _ensureParentAndKey: function(parent, key) {
      this.parent = this.parent || parent;
      this.key = this.key || key;
      if (this.parent !== parent) {
        throw "Internal Error. Relation retrieved from two different Objects.";
      }
      if (this.key !== key) {
        throw "Internal Error. Relation retrieved from two different keys.";
      }
    },

    /**
     * Adds a Parse.Object or an array of Parse.Objects to the relation.
     * @param {} objects The item or items to add.
     */
    add: function(objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new Parse.Op.Relation(objects, []);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * Removes a Parse.Object or an array of Parse.Objects from this relation.
     * @param {} objects The item or items to remove.
     */
    remove: function(objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new Parse.Op.Relation([], objects);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * Returns a JSON version of the object suitable for saving to disk.
     * @return {Object}
     */
    toJSON: function() {
      return { "__type": "Relation", "className": this.targetClassName };
    },

    /**
     * Returns a Parse.Query that is limited to objects in this
     * relation.
     * @return {Parse.Query}
     */
    query: function() {
      var targetClass;
      var query;
      if (!this.targetClassName) {
        targetClass = Parse.Object._getSubclass(this.parent.className);
        query = new Parse.Query(targetClass);
        query._extraOptions.redirectClassNameForKey = this.key;
      } else {
        targetClass = Parse.Object._getSubclass(this.targetClassName);
        query = new Parse.Query(targetClass);
      }
      query._addCondition("$relatedTo", "object", this.parent._toPointer());
      query._addCondition("$relatedTo", "key", this.key);

      return query;
    }
  };
}(this));

/*global window: false, process: false */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * A Promise is returned by async methods as a hook to provide callbacks to be
   * called when the async task is fulfilled.
   *
   * <p>Typical usage would be like:<pre>
   *    query.find().then(function(results) {
   *      results[0].set("foo", "bar");
   *      return results[0].saveAsync();
   *    }).then(function(result) {
   *      console.log("Updated " + result.id);
   *    });
   * </pre></p>
   *
   * @see Parse.Promise.prototype.then
   * @class
   */
  Parse.Promise = function() {
    this._resolved = false;
    this._rejected = false;
    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];
  };

  _.extend(Parse.Promise, /** @lends Parse.Promise */ {

    _isPromisesAPlusCompliant: false,

    /**
     * Returns true iff the given object fulfils the Promise interface.
     * @return {Boolean}
     */
    is: function(promise) {
      return promise && promise.then && _.isFunction(promise.then);
    },

    /**
     * Returns a new promise that is resolved with a given value.
     * @return {Parse.Promise} the new promise.
     */
    as: function() {
      var promise = new Parse.Promise();
      promise.resolve.apply(promise, arguments);
      return promise;
    },

    /**
     * Returns a new promise that is rejected with a given error.
     * @return {Parse.Promise} the new promise.
     */
    error: function() {
      var promise = new Parse.Promise();
      promise.reject.apply(promise, arguments);
      return promise;
    },

    /**
     * Returns a new promise that is fulfilled when all of the input promises
     * are resolved. If any promise in the list fails, then the returned promise
     * will fail with the last error. If they all succeed, then the returned
     * promise will succeed, with the results being the results of all the input
     * promises. For example: <pre>
     *   var p1 = Parse.Promise.as(1);
     *   var p2 = Parse.Promise.as(2);
     *   var p3 = Parse.Promise.as(3);
     *
     *   Parse.Promise.when(p1, p2, p3).then(function(r1, r2, r3) {
     *     console.log(r1);  // prints 1
     *     console.log(r2);  // prints 2
     *     console.log(r3);  // prints 3
     *   });</pre>
     *
     * The input promises can also be specified as an array: <pre>
     *   var promises = [p1, p2, p3];
     *   Parse.Promise.when(promises).then(function(r1, r2, r3) {
     *     console.log(r1);  // prints 1
     *     console.log(r2);  // prints 2
     *     console.log(r3);  // prints 3
     *   });
     * </pre>
     * @param {Array} promises a list of promises to wait for.
     * @return {Parse.Promise} the new promise.
     */
    when: function(promises) {
      // Allow passing in Promises as separate arguments instead of an Array.
      var objects;
      if (promises && Parse._isNullOrUndefined(promises.length)) {
        objects = arguments;
      } else {
        objects = promises;
      }

      var total = objects.length;
      var hadError = false;
      var results = [];
      var errors = [];
      results.length = objects.length;
      errors.length = objects.length;

      if (total === 0) {
        return Parse.Promise.as.apply(this, results);
      }

      var promise = new Parse.Promise();

      var resolveOne = function() {
        total = total - 1;
        if (total === 0) {
          if (hadError) {
            promise.reject(errors);
          } else {
            promise.resolve.apply(promise, results);
          }
        }
      };

      Parse._arrayEach(objects, function(object, i) {
        if (Parse.Promise.is(object)) {
          object.then(function(result) {
            results[i] = result;
            resolveOne();
          }, function(error) {
            errors[i] = error;
            hadError = true;
            resolveOne();
          });
        } else {
          results[i] = object;
          resolveOne();
        }
      });

      return promise;
    },

    /**
     * Runs the given asyncFunction repeatedly, as long as the predicate
     * function returns a truthy value. Stops repeating if asyncFunction returns
     * a rejected promise.
     * @param {Function} predicate should return false when ready to stop.
     * @param {Function} asyncFunction should return a Promise.
     */
    _continueWhile: function(predicate, asyncFunction) {
      if (predicate()) {
        return asyncFunction().then(function() {
          return Parse.Promise._continueWhile(predicate, asyncFunction);
        });
      }
      return Parse.Promise.as();
    }
  });

  _.extend(Parse.Promise.prototype, /** @lends Parse.Promise.prototype */ {

    /**
     * Marks this promise as fulfilled, firing any callbacks waiting on it.
     * @param {Object} result the result to pass to the callbacks.
     */
    resolve: function(result) {
      if (this._resolved || this._rejected) {
        throw "A promise was resolved even though it had already been " +
          (this._resolved ? "resolved" : "rejected") + ".";
      }
      this._resolved = true;
      this._result = arguments;
      var results = arguments;
      Parse._arrayEach(this._resolvedCallbacks, function(resolvedCallback) {
        resolvedCallback.apply(this, results);
      });
      this._resolvedCallbacks = [];
      this._rejectedCallbacks = [];
    },

    /**
     * Marks this promise as fulfilled, firing any callbacks waiting on it.
     * @param {Object} error the error to pass to the callbacks.
     */
    reject: function(error) {
      if (this._resolved || this._rejected) {
        throw "A promise was rejected even though it had already been " +
          (this._resolved ? "resolved" : "rejected") + ".";
      }
      this._rejected = true;
      this._error = error;
      Parse._arrayEach(this._rejectedCallbacks, function(rejectedCallback) {
        rejectedCallback(error);
      });
      this._resolvedCallbacks = [];
      this._rejectedCallbacks = [];
    },

    /**
     * Adds callbacks to be called when this promise is fulfilled. Returns a new
     * Promise that will be fulfilled when the callback is complete. It allows
     * chaining. If the callback itself returns a Promise, then the one returned
     * by "then" will not be fulfilled until that one returned by the callback
     * is fulfilled.
     * @param {Function} resolvedCallback Function that is called when this
     * Promise is resolved. Once the callback is complete, then the Promise
     * returned by "then" will also be fulfilled.
     * @param {Function} rejectedCallback Function that is called when this
     * Promise is rejected with an error. Once the callback is complete, then
     * the promise returned by "then" with be resolved successfully. If
     * rejectedCallback is null, or it returns a rejected Promise, then the
     * Promise returned by "then" will be rejected with that error.
     * @return {Parse.Promise} A new Promise that will be fulfilled after this
     * Promise is fulfilled and either callback has completed. If the callback
     * returned a Promise, then this Promise will not be fulfilled until that
     * one is.
     */
    then: function(resolvedCallback, rejectedCallback) {
      var promise = new Parse.Promise();

      var wrappedResolvedCallback = function() {
        var result = arguments;
        if (resolvedCallback) {
          if (Parse.Promise._isPromisesAPlusCompliant) {
            try {
              result = [resolvedCallback.apply(this, result)];
            } catch (e) {
              result = [Parse.Promise.error(e)];
            }
          } else {
            result = [resolvedCallback.apply(this, result)];
          }
        }
        if (result.length === 1 && Parse.Promise.is(result[0])) {
          result[0].then(function() {
            promise.resolve.apply(promise, arguments);
          }, function(error) {
            promise.reject(error);
          });
        } else {
          promise.resolve.apply(promise, result);
        }
      };

      var wrappedRejectedCallback = function(error) {
        var result = [];
        if (rejectedCallback) {
          if (Parse.Promise._isPromisesAPlusCompliant) {
            try {
              result = [rejectedCallback(error)];
            } catch (e) {
              result = [Parse.Promise.error(e)];
            }
          } else {
            result = [rejectedCallback(error)];
          }
          if (result.length === 1 && Parse.Promise.is(result[0])) {
            result[0].then(function() {
              promise.resolve.apply(promise, arguments);
            }, function(error) {
              promise.reject(error);
            });
          } else {
            if (Parse.Promise._isPromisesAPlusCompliant) {
              promise.resolve.apply(promise, result);
            } else {
              promise.reject(result[0]);
            }
          }
        } else {
          promise.reject(error);
        }
      };

      var runLater = function(func) {
        func.call();
      };
      if (Parse.Promise._isPromisesAPlusCompliant) {
        if (typeof(window) !== 'undefined' && window.setTimeout) {
          runLater = function(func) {
            window.setTimeout(func, 0);
          };
        } else if (typeof(process) !== 'undefined' && process.nextTick) {
          runLater = function(func) {
            process.nextTick(func);
          };
        }
      }

      var self = this;
      if (this._resolved) {
        runLater(function() {
          wrappedResolvedCallback.apply(self, self._result);
        });
      } else if (this._rejected) {
        runLater(function() {
          wrappedRejectedCallback(self._error);
        });
      } else {
        this._resolvedCallbacks.push(wrappedResolvedCallback);
        this._rejectedCallbacks.push(wrappedRejectedCallback);
      }

      return promise;
    },

    /**
     * Add handlers to be called when the promise 
     * is either resolved or rejected
     */
    always: function(callback) {
      return this.then(callback, callback);
    },

    /**
     * Add handlers to be called when the Promise object is resolved
     */
    done: function(callback) {
      return this.then(callback);
    },

    /**
     * Add handlers to be called when the Promise object is rejected
     */
    fail: function(callback) {
      return this.then(null, callback);
    },

    /**
     * Run the given callbacks after this promise is fulfilled.
     * @param optionsOrCallback {} A Backbone-style options callback, or a
     * callback function. If this is an options object and contains a "model"
     * attributes, that will be passed to error callbacks as the first argument.
     * @param model {} If truthy, this will be passed as the first result of
     * error callbacks. This is for Backbone-compatability.
     * @return {Parse.Promise} A promise that will be resolved after the
     * callbacks are run, with the same result as this.
     */
    _thenRunCallbacks: function(optionsOrCallback, model) {
      var options;
      if (_.isFunction(optionsOrCallback)) {
        var callback = optionsOrCallback;
        options = {
          success: function(result) {
            callback(result, null);
          },
          error: function(error) {
            callback(null, error);
          }
        };
      } else {
        options = _.clone(optionsOrCallback);
      }
      options = options || {};

      return this.then(function(result) {
        if (options.success) {
          options.success.apply(this, arguments);
        } else if (model) {
          // When there's no callback, a sync event should be triggered.
          model.trigger('sync', model, result, options);
        }
        return Parse.Promise.as.apply(Parse.Promise, arguments);
      }, function(error) {
        if (options.error) {
          if (!_.isUndefined(model)) {
            options.error(model, error);
          } else {
            options.error(error);
          }
        } else if (model) {
          // When there's no error callback, an error event should be triggered.
          model.trigger('error', model, error, options);
        }
        // By explicitly returning a rejected Promise, this will work with
        // either jQuery or Promises/A semantics.
        return Parse.Promise.error(error);
      });
    },

    /**
     * Adds a callback function that should be called regardless of whether
     * this promise failed or succeeded. The callback will be given either the
     * array of results for its first argument, or the error as its second,
     * depending on whether this Promise was rejected or resolved. Returns a
     * new Promise, like "then" would.
     * @param {Function} continuation the callback.
     */
    _continueWith: function(continuation) {
      return this.then(function() {
        return continuation(arguments, null);
      }, function(error) {
        return continuation(null, error);
      });
    }

  });

}(this));

/*jshint bitwise:false *//*global FileReader: true, File: true */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  var b64Digit = function(number) {
    if (number < 26) {
      return String.fromCharCode(65 + number);
    }
    if (number < 52) {
      return String.fromCharCode(97 + (number - 26));
    }
    if (number < 62) {
      return String.fromCharCode(48 + (number - 52));
    }
    if (number === 62) {
      return "+";
    }
    if (number === 63) {
      return "/";
    }
    throw "Tried to encode large digit " + number + " in base64.";
  };

  var encodeBase64 = function(array) {
    var chunks = [];
    chunks.length = Math.ceil(array.length / 3);
    _.times(chunks.length, function(i) {
      var b1 = array[i * 3];
      var b2 = array[i * 3 + 1] || 0;
      var b3 = array[i * 3 + 2] || 0;

      var has2 = (i * 3 + 1) < array.length;
      var has3 = (i * 3 + 2) < array.length;

      chunks[i] = [
        b64Digit((b1 >> 2) & 0x3F),
        b64Digit(((b1 << 4) & 0x30) | ((b2 >> 4) & 0x0F)),
        has2 ? b64Digit(((b2 << 2) & 0x3C) | ((b3 >> 6) & 0x03)) : "=",
        has3 ? b64Digit(b3 & 0x3F) : "="
      ].join("");
    });
    return chunks.join("");
  };

  // TODO(klimt): Move this list to the server.
  // A list of file extensions to mime types as found here:
  // http://stackoverflow.com/questions/58510/using-net-how-can-you-find-the-
  //     mime-type-of-a-file-based-on-the-file-signature
  var mimeTypes = {
    ai: "application/postscript",
    aif: "audio/x-aiff",
    aifc: "audio/x-aiff",
    aiff: "audio/x-aiff",
    asc: "text/plain",
    atom: "application/atom+xml",
    au: "audio/basic",
    avi: "video/x-msvideo",
    bcpio: "application/x-bcpio",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    cdf: "application/x-netcdf",
    cgm: "image/cgm",
    "class": "application/octet-stream",
    cpio: "application/x-cpio",
    cpt: "application/mac-compactpro",
    csh: "application/x-csh",
    css: "text/css",
    dcr: "application/x-director",
    dif: "video/x-dv",
    dir: "application/x-director",
    djv: "image/vnd.djvu",
    djvu: "image/vnd.djvu",
    dll: "application/octet-stream",
    dmg: "application/octet-stream",
    dms: "application/octet-stream",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
          "document",
    dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
          "template",
    docm: "application/vnd.ms-word.document.macroEnabled.12",
    dotm: "application/vnd.ms-word.template.macroEnabled.12",
    dtd: "application/xml-dtd",
    dv: "video/x-dv",
    dvi: "application/x-dvi",
    dxr: "application/x-director",
    eps: "application/postscript",
    etx: "text/x-setext",
    exe: "application/octet-stream",
    ez: "application/andrew-inset",
    gif: "image/gif",
    gram: "application/srgs",
    grxml: "application/srgs+xml",
    gtar: "application/x-gtar",
    hdf: "application/x-hdf",
    hqx: "application/mac-binhex40",
    htm: "text/html",
    html: "text/html",
    ice: "x-conference/x-cooltalk",
    ico: "image/x-icon",
    ics: "text/calendar",
    ief: "image/ief",
    ifb: "text/calendar",
    iges: "model/iges",
    igs: "model/iges",
    jnlp: "application/x-java-jnlp-file",
    jp2: "image/jp2",
    jpe: "image/jpeg",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/x-javascript",
    kar: "audio/midi",
    latex: "application/x-latex",
    lha: "application/octet-stream",
    lzh: "application/octet-stream",
    m3u: "audio/x-mpegurl",
    m4a: "audio/mp4a-latm",
    m4b: "audio/mp4a-latm",
    m4p: "audio/mp4a-latm",
    m4u: "video/vnd.mpegurl",
    m4v: "video/x-m4v",
    mac: "image/x-macpaint",
    man: "application/x-troff-man",
    mathml: "application/mathml+xml",
    me: "application/x-troff-me",
    mesh: "model/mesh",
    mid: "audio/midi",
    midi: "audio/midi",
    mif: "application/vnd.mif",
    mov: "video/quicktime",
    movie: "video/x-sgi-movie",
    mp2: "audio/mpeg",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mpe: "video/mpeg",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    mpga: "audio/mpeg",
    ms: "application/x-troff-ms",
    msh: "model/mesh",
    mxu: "video/vnd.mpegurl",
    nc: "application/x-netcdf",
    oda: "application/oda",
    ogg: "application/ogg",
    pbm: "image/x-portable-bitmap",
    pct: "image/pict",
    pdb: "chemical/x-pdb",
    pdf: "application/pdf",
    pgm: "image/x-portable-graymap",
    pgn: "application/x-chess-pgn",
    pic: "image/pict",
    pict: "image/pict",
    png: "image/png", 
    pnm: "image/x-portable-anymap",
    pnt: "image/x-macpaint",
    pntg: "image/x-macpaint",
    ppm: "image/x-portable-pixmap",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml." +
          "presentation",
    potx: "application/vnd.openxmlformats-officedocument.presentationml." +
          "template",
    ppsx: "application/vnd.openxmlformats-officedocument.presentationml." +
          "slideshow",
    ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
    pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
    ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
    ps: "application/postscript",
    qt: "video/quicktime",
    qti: "image/x-quicktime",
    qtif: "image/x-quicktime",
    ra: "audio/x-pn-realaudio",
    ram: "audio/x-pn-realaudio",
    ras: "image/x-cmu-raster",
    rdf: "application/rdf+xml",
    rgb: "image/x-rgb",
    rm: "application/vnd.rn-realmedia",
    roff: "application/x-troff",
    rtf: "text/rtf",
    rtx: "text/richtext",
    sgm: "text/sgml",
    sgml: "text/sgml",
    sh: "application/x-sh",
    shar: "application/x-shar",
    silo: "model/mesh",
    sit: "application/x-stuffit",
    skd: "application/x-koan",
    skm: "application/x-koan",
    skp: "application/x-koan",
    skt: "application/x-koan",
    smi: "application/smil",
    smil: "application/smil",
    snd: "audio/basic",
    so: "application/octet-stream",
    spl: "application/x-futuresplash",
    src: "application/x-wais-source",
    sv4cpio: "application/x-sv4cpio",
    sv4crc: "application/x-sv4crc",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    t: "application/x-troff",
    tar: "application/x-tar",
    tcl: "application/x-tcl",
    tex: "application/x-tex",
    texi: "application/x-texinfo",
    texinfo: "application/x-texinfo",
    tif: "image/tiff",
    tiff: "image/tiff",
    tr: "application/x-troff",
    tsv: "text/tab-separated-values",
    txt: "text/plain",
    ustar: "application/x-ustar",
    vcd: "application/x-cdlink",
    vrml: "model/vrml",
    vxml: "application/voicexml+xml",
    wav: "audio/x-wav",
    wbmp: "image/vnd.wap.wbmp",
    wbmxl: "application/vnd.wap.wbxml",
    wml: "text/vnd.wap.wml",
    wmlc: "application/vnd.wap.wmlc",
    wmls: "text/vnd.wap.wmlscript",
    wmlsc: "application/vnd.wap.wmlscriptc",
    wrl: "model/vrml",
    xbm: "image/x-xbitmap",
    xht: "application/xhtml+xml",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xml: "application/xml",
    xpm: "image/x-xpixmap",
    xsl: "application/xml",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml." +
          "template",
    xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
    xltm: "application/vnd.ms-excel.template.macroEnabled.12",
    xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
    xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    xslt: "application/xslt+xml",
    xul: "application/vnd.mozilla.xul+xml",
    xwd: "image/x-xwindowdump",
    xyz: "chemical/x-xyz",
    zip: "application/zip"
  };

  /**
   * Reads a File using a FileReader.
   * @param file {File} the File to read.
   * @param type {String} (optional) the mimetype to override with.
   * @return {Parse.Promise} A Promise that will be fulfilled with a
   *     base64-encoded string of the data and its mime type.
   */
  var readAsync = function(file, type) {
    var promise = new Parse.Promise();

    if (typeof(FileReader) === "undefined") {
      return Parse.Promise.error(new Parse.Error(
          Parse.Error.FILE_READ_ERROR,
          "Attempted to use a FileReader on an unsupported browser."));
    }

    var reader = new FileReader();
    reader.onloadend = function() {
      if (reader.readyState !== 2) {
        promise.reject(new Parse.Error(
            Parse.Error.FILE_READ_ERROR,
            "Error reading file."));
        return;
      }

      var dataURL = reader.result;
      var matches = /^data:([^;]*);base64,(.*)$/.exec(dataURL);
      if (!matches) {
        promise.reject(new Parse.Error(
            Parse.Error.FILE_READ_ERROR,
            "Unable to interpret data URL: " + dataURL));
        return;
      }

      promise.resolve(matches[2], type || matches[1]);
    };
    reader.readAsDataURL(file);
    return promise;
  };

  /**
   * A Parse.File is a local representation of a file that is saved to the Parse
   * cloud.
   * @class
   * @param name {String} The file's name. This will be prefixed by a unique
   *     value once the file has finished saving. The file name must begin with
   *     an alphanumeric character, and consist of alphanumeric characters,
   *     periods, spaces, underscores, or dashes.
   * @param data {Array} The data for the file, as either:
   *     1. an Array of byte value Numbers, or
   *     2. an Object like { base64: "..." } with a base64-encoded String.
   *     3. a File object selected with a file upload control. (3) only works
   *        in Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
   *        For example:<pre>
   * var fileUploadControl = $("#profilePhotoFileUpload")[0];
   * if (fileUploadControl.files.length > 0) {
   *   var file = fileUploadControl.files[0];
   *   var name = "photo.jpg";
   *   var parseFile = new Parse.File(name, file);
   *   parseFile.save().then(function() {
   *     // The file has been saved to Parse.
   *   }, function(error) {
   *     // The file either could not be read, or could not be saved to Parse.
   *   });
   * }</pre>
   * @param type {String} Optional Content-Type header to use for the file. If
   *     this is omitted, the content type will be inferred from the name's
   *     extension.
   */
  Parse.File = function(name, data, type) {
    this._name = name;

    // Guess the content type from the extension if we need to.
    var extension = /\.([^.]*)$/.exec(name);
    if (extension) {
      extension = extension[1].toLowerCase();
    }
    var guessedType = type || mimeTypes[extension] || "text/plain";

    if (_.isArray(data)) {
      this._source = Parse.Promise.as(encodeBase64(data), guessedType);
    } else if (data && data.base64) {
      // if it contains data uri, extract based64 and the type out of it.
      /*jslint maxlen: 1000*/
      var dataUriRegexp = /^data:([a-zA-Z]*\/[a-zA-Z+.-]*);(charset=[a-zA-Z0-9\-\/\s]*,)?base64,(\S+)/;
      /*jslint maxlen: 80*/

      var matches = dataUriRegexp.exec(data.base64);
      if (matches && matches.length > 0) {
        // if data URI with charset, there will have 4 matches.
        this._source = Parse.Promise.as(
          (matches.length === 4 ? matches[3] : matches[2]), matches[1]
        );
      } else {
        this._source = Parse.Promise.as(data.base64, guessedType);
      }
    } else if (typeof(File) !== "undefined" && data instanceof File) {
      this._source = readAsync(data, type);
    } else if (_.isString(data)) {
      throw "Creating a Parse.File from a String is not yet supported.";
    }
  };

  Parse.File.prototype = {

    /**
     * Gets the name of the file. Before save is called, this is the filename
     * given by the user. After save is called, that name gets prefixed with a
     * unique identifier.
     */
    name: function() {
      return this._name;
    },

    /**
     * Gets the url of the file. It is only available after you save the file or
     * after you get the file from a Parse.Object.
     * @return {String}
     */
    url: function() {
      return this._url;
    },

    /**
     * Saves the file to the Parse cloud.
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} Promise that is resolved when the save finishes.
     */
    save: function(options) {
      options= options || {};

      var self = this;
      if (!self._previousSave) {
        self._previousSave = self._source.then(function(base64, type) {
          var data = {
            base64: base64,
            _ContentType: type
          };
          return Parse._request({
            route: "files",
            className: self._name,
            method: 'POST',
            data: data,
            useMasterKey: options.useMasterKey
          });

        }).then(function(response) {
          self._name = response.name;
          self._url = response.url;
          return self;
        });
      }
      return self._previousSave._thenRunCallbacks(options);
    }
  };

}(this));

// Parse.Object is analogous to the Java ParseObject.
// It also implements the same interface as a Backbone model.
// TODO: multiple dispatch for callbacks
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new model with defined attributes. A client id (cid) is
   * automatically generated and assigned for you.
   *
   * <p>You won't normally call this method directly.  It is recommended that
   * you use a subclass of <code>Parse.Object</code> instead, created by calling
   * <code>extend</code>.</p>
   *
   * <p>However, if you don't want to use a subclass, or aren't sure which
   * subclass is appropriate, you can use this form:<pre>
   *     var object = new Parse.Object("ClassName");
   * </pre>
   * That is basically equivalent to:<pre>
   *     var MyClass = Parse.Object.extend("ClassName");
   *     var object = new MyClass();
   * </pre></p>
   *
   * @param {Object} attributes The initial set of data to store in the object.
   * @param {Object} options A set of Backbone-like options for creating the
   *     object.  The only option currently supported is "collection".
   * @see Parse.Object.extend
   *
   * @class
   *
   * <p>The fundamental unit of Parse data, which implements the Backbone Model
   * interface.</p>
   */
  Parse.Object = function(attributes, options) {
    // Allow new Parse.Object("ClassName") as a shortcut to _create.
    if (_.isString(attributes)) {
      return Parse.Object._create.apply(this, arguments);
    }

    attributes = attributes || {};
    if (options && options.parse) {
      attributes = this.parse(attributes);
    }
    var defaults = Parse._getValue(this, 'defaults');
    if (defaults) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) {
      this.collection = options.collection;
    }

    this._serverData = {};  // The last known data for this object from cloud.
    this._opSetQueue = [{}];  // List of sets of changes to the data.
    this.attributes = {};  // The best estimate of this's current data.

    this._hashedJSON = {};  // Hash of values of containers at last save.
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    if (!this.set(attributes, {silent: true})) {
      throw new Error("Can't create an invalid Parse.Object");
    }
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._hasData = true;
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  /**
   * The ID of this object, unique within its class.
   * @name id
   * @type String
   * @field
   * @memberOf Parse.Object.prototype
   */

  /**
   * The first time this object was saved on the server.
   * @name createdAt
   * @type Date
   * @field
   * @memberOf Parse.Object.prototype
   */

  /**
   * The last time this object was updated on the server.
   * @name updatedAt
   * @type Date
   * @field
   * @memberOf Parse.Object.prototype
   */

  /**
   * Saves the given list of Parse.Object.
   * If any error is encountered, stops and calls the error handler.
   *
   * <pre>
   *   Parse.Object.saveAll([object1, object2, ...], {
   *     success: function(list) {
   *       // All the objects were saved.
   *     },
   *     error: function(error) {
   *       // An error occurred while saving one of the objects.
   *     },
   *   });
   * </pre>
   *
   * @param {Array} list A list of <code>Parse.Object</code>.
   * @param {Object} options A Backbone-style callback object.
   * Valid options are:<ul>
   *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
   *     be used for this request.
   * </ul>
   */
  Parse.Object.saveAll = function(list, options) {
    options = options || {};
    return Parse.Object._deepSaveAsync(list, {
      useMasterKey: options.useMasterKey
    })._thenRunCallbacks(options);
  };

  /**
   * Destroy the given list of models on the server if it was already persisted.
   * Optimistically removes each model from its collection, if it has one.
   * If `wait: true` is passed, waits for the server to respond before removal.
   *
   * <p>Unlike saveAll, if an error occurs while deleting an individual model,
   * this method will continue trying to delete the rest of the models if
   * possible, except in the case of a fatal error like a connection error.
   *
   * <p>In particular, the Parse.Error object returned in the case of error may
   * be one of two types:
   *
   * <ul>
   *   <li>A Parse.Error.AGGREGATE_ERROR. This object's "errors" property is an
   *       array of other Parse.Error objects. Each error object in this array
   *       has an "object" property that references the object that could not be
   *       deleted (for instance, because that object could not be found).</li>
   *   <li>A non-aggregate Parse.Error. This indicates a serious error that
   *       caused the delete operation to be aborted partway through (for
   *       instance, a connection failure in the middle of the delete).</li>
   * </ul>
   *
   * <pre>
   *   Parse.Object.destroyAll([object1, object2, ...], {
   *     success: function() {
   *       // All the objects were deleted.
   *     },
   *     error: function(error) {
   *       // An error occurred while deleting one or more of the objects.
   *       // If this is an aggregate error, then we can inspect each error
   *       // object individually to determine the reason why a particular
   *       // object was not deleted.
   *       if (error.code == Parse.Error.AGGREGATE_ERROR) {
   *         for (var i = 0; i < error.errors.length; i++) {
   *           console.log("Couldn't delete " + error.errors[i].object.id +
   *             "due to " + error.errors[i].message);
   *         }
   *       } else {
   *         console.log("Delete aborted because of " + error.message);
   *       }
   *     },
   *   });
   * </pre>
   *
   * @param {Array} list A list of <code>Parse.Object</code>.
   * @param {Object} options A Backbone-style callback object.
   * Valid options are:<ul>
   *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
   *     be used for this request.
   * </ul>
   * @return {Parse.Promise} A promise that is fulfilled when the destroyAll
   *     completes.
   */
  Parse.Object.destroyAll = function(list, options) {
    options = options || {};

    var triggerDestroy = function(object) {
      object.trigger('destroy', object, object.collection, options);
    };

    var errors = [];
    var destroyBatch = function(batch) {
      var promise = Parse.Promise.as();

      if (batch.length > 0) {
        promise = promise.then(function() {
          return Parse._request({
            route: "batch",
            method: "POST",
            useMasterKey: options.useMasterKey,
            data: {
              requests: _.map(batch, function(object) {
                return {
                  method: "DELETE",
                  path: "/1/classes/" + object.className + "/" + object.id
                };
              })
            }
          });
        }).then(function(responses, status, xhr) {
          Parse._arrayEach(batch, function(object, i) {
            if (responses[i].success && options.wait) {
              triggerDestroy(object);
            } else if (responses[i].error) {
              var error = new Parse.Error(responses[i].error.code,
                                          responses[i].error.error);
              error.object = object;

              errors.push(error);
            }
          });
        });
      }

      return promise;
    };

    var promise = Parse.Promise.as();
    var batch = [];
    Parse._arrayEach(list, function(object, i) {
      if (!object.id || !options.wait) {
        triggerDestroy(object);
      }

      if (object.id) {
        batch.push(object);
      }

      if (batch.length === 20 || i+1 === list.length) {
        var thisBatch = batch;
        batch = [];

        promise = promise.then(function() {
          return destroyBatch(thisBatch);
        });
      }
    });

    return promise.then(function() {
      if (errors.length === 0) {
        return true;
      } else {
        var error = new Parse.Error(Parse.Error.AGGREGATE_ERROR,
                                    "Error deleting an object in destroyAll");
        error.errors = errors;

        return Parse.Promise.error(error);
      }
    })._thenRunCallbacks(options);
  };

  /**
   * Fetches the given list of Parse.Object.
   * If any error is encountered, stops and calls the error handler.
   *
   * <pre>
   *   Parse.Object.fetchAll([object1, object2, ...], {
   *     success: function(list) {
   *       // All the objects were fetched.
   *     },
   *     error: function(error) {
   *       // An error occurred while fetching one of the objects.
   *     },
   *   });
   * </pre>
   *
   * @param {Array} list A list of <code>Parse.Object</code>.
   * @param {Object} options A Backbone-style callback object.
   * Valid options are:<ul>
   *   <li>success: A Backbone-style success callback.
   *   <li>error: An Backbone-style error callback.
   * </ul>
   */
  Parse.Object.fetchAll = function(list, options) {
    return Parse.Object._fetchAll(
      list,
      true
    )._thenRunCallbacks(options);
  };

  /**
   * Fetches the given list of Parse.Object if needed.
   * If any error is encountered, stops and calls the error handler.
   *
   * <pre>
   *   Parse.Object.fetchAllIfNeeded([object1, ...], {
   *     success: function(list) {
   *       // Objects were fetched and updated.
   *     },
   *     error: function(error) {
   *       // An error occurred while fetching one of the objects.
   *     },
   *   });
   * </pre>
   *
   * @param {Array} list A list of <code>Parse.Object</code>.
   * @param {Object} options A Backbone-style callback object.
   * Valid options are:<ul>
   *   <li>success: A Backbone-style success callback.
   *   <li>error: An Backbone-style error callback.
   * </ul>
   */
  Parse.Object.fetchAllIfNeeded = function(list, options) {
    return Parse.Object._fetchAll(
      list,
      false
    )._thenRunCallbacks(options);
  };

  // Attach all inheritable methods to the Parse.Object prototype.
  _.extend(Parse.Object.prototype, Parse.Events,
           /** @lends Parse.Object.prototype */ {
    _existed: false,

    /**
     * Initialize is an empty function by default. Override it with your own
     * initialization logic.
     */
    initialize: function(){},

    /**
     * Returns a JSON version of the object suitable for saving to Parse.
     * @return {Object}
     */
    toJSON: function() {
      var json = this._toFullJSON();
      Parse._arrayEach(["__type", "className"],
                       function(key) { delete json[key]; });
      return json;
    },

    _toFullJSON: function(seenObjects) {
      var json = _.clone(this.attributes);
      Parse._objectEach(json, function(val, key) {
        json[key] = Parse._encode(val, seenObjects);
      });
      Parse._objectEach(this._operations, function(val, key) {
        json[key] = val;
      });

      if (_.has(this, "id")) {
        json.objectId = this.id;
      }
      if (_.has(this, "createdAt")) {
        if (_.isDate(this.createdAt)) {
          json.createdAt = this.createdAt.toJSON();
        } else {
          json.createdAt = this.createdAt;
        }
      }

      if (_.has(this, "updatedAt")) {
        if (_.isDate(this.updatedAt)) {
          json.updatedAt = this.updatedAt.toJSON();
        } else {
          json.updatedAt = this.updatedAt;
        }
      }
      json.__type = "Object";
      json.className = this.className;
      return json;
    },

    /**
     * Updates _hashedJSON to reflect the current state of this object.
     * Adds any changed hash values to the set of pending changes.
     */
    _refreshCache: function() {
      var self = this;
      if (self._refreshingCache) {
        return;
      }
      self._refreshingCache = true;
      Parse._objectEach(this.attributes, function(value, key) {
        if (value instanceof Parse.Object) {
          value._refreshCache();
        } else if (_.isObject(value)) {
          var objectArray = false;
          if (_.isArray(value)) {
            // We don't cache arrays of Parse.Objects
            _.each(value, function(arrVal) {
              if (arrVal instanceof Parse.Object) {
                objectArray = true;
                arrVal._refreshCache();
              }
            });
          }
          if (!objectArray && self._resetCacheForKey(key)) {
            self.set(key, new Parse.Op.Set(value), { silent: true });
          }
        }
      });
      delete self._refreshingCache;
    },

    /**
     * Returns true if this object has been modified since its last
     * save/refresh.  If an attribute is specified, it returns true only if that
     * particular attribute has been modified since the last save/refresh.
     * @param {String} attr An attribute name (optional).
     * @return {Boolean}
     */
    dirty: function(attr) {
      this._refreshCache();

      var currentChanges = _.last(this._opSetQueue);

      if (attr) {
        return (currentChanges[attr] ? true : false);
      }
      if (!this.id) {
        return true;
      }
      if (_.keys(currentChanges).length > 0) {
        return true;
      }
      return false;
    },

    /**
     * Returns an array of keys that have been modified since last save/refresh
     * @return {Array of string}
     */
    dirtyKeys: function() {
      return _.keys(_.last(this._opSetQueue));
    },

    /**
     * Gets a Pointer referencing this Object.
     */
    _toPointer: function() {
      if (!this.id) {
        throw new Error("Can't serialize an unsaved Parse.Object");
      }
      return { __type: "Pointer",
               className: this.className,
               objectId: this.id };
    },

    /**
     * Gets the value of an attribute.
     * @param {String} attr The string name of an attribute.
     */
    get: function(attr) {
      return this.attributes[attr];
    },

    /**
     * Gets a relation on the given class for the attribute.
     * @param String attr The attribute to get the relation for.
     */
    relation: function(attr) {
      var value = this.get(attr);
      if (value) {
        if (!(value instanceof Parse.Relation)) {
          throw "Called relation() on non-relation field " + attr;
        }
        value._ensureParentAndKey(this, attr);
        return value;
      } else {
        return new Parse.Relation(this, attr);
      }
    },

    /**
     * Gets the HTML-escaped value of an attribute.
     */
    escape: function(attr) {
      var html = this._escapedAttributes[attr];
      if (html) {
        return html;
      }
      var val = this.attributes[attr];
      var escaped;
      if (Parse._isNullOrUndefined(val)) {
        escaped = '';
      } else {
        escaped = _.escape(val.toString());
      }
      this._escapedAttributes[attr] = escaped;
      return escaped;
    },

    /**
     * Returns <code>true</code> if the attribute contains a value that is not
     * null or undefined.
     * @param {String} attr The string name of the attribute.
     * @return {Boolean}
     */
    has: function(attr) {
      return !Parse._isNullOrUndefined(this.attributes[attr]);
    },

    /**
     * Pulls "special" fields like objectId, createdAt, etc. out of attrs
     * and puts them on "this" directly.  Removes them from attrs.
     * @param attrs - A dictionary with the data for this Parse.Object.
     */
    _mergeMagicFields: function(attrs) {
      // Check for changes of magic fields.
      var model = this;
      var specialFields = ["id", "objectId", "createdAt", "updatedAt"];
      Parse._arrayEach(specialFields, function(attr) {
        if (attrs[attr]) {
          if (attr === "objectId") {
            model.id = attrs[attr];
          } else if ((attr === "createdAt" || attr === "updatedAt") &&
                     !_.isDate(attrs[attr])) {
            model[attr] = Parse._parseDate(attrs[attr]);
          } else {
            model[attr] = attrs[attr];
          }
          delete attrs[attr];
        }
      });
    },

    /**
     * Copies the given serverData to "this", refreshes attributes, and
     * clears pending changes;
     */
    _copyServerData: function(serverData) {
      // Copy server data
      var tempServerData = {};
      Parse._objectEach(serverData, function(value, key) {
        tempServerData[key] = Parse._decode(key, value);
      });
      this._serverData = tempServerData;

      // Refresh the attributes.
      this._rebuildAllEstimatedData();

      // TODO (bklimt): Revisit clearing operations, perhaps move to revert.
      // Clear out any changes the user might have made previously.
      this._refreshCache();
      this._opSetQueue = [{}];

      // Refresh the attributes again.
      this._rebuildAllEstimatedData();
    },

    /**
     * Merges another object's attributes into this object.
     */
    _mergeFromObject: function(other) {
      if (!other) {
        return;
      }

      // This does the inverse of _mergeMagicFields.
      this.id = other.id;
      this.createdAt = other.createdAt;
      this.updatedAt = other.updatedAt;

      this._copyServerData(other._serverData);

      this._hasData = true;
    },

    /**
     * Returns the json to be sent to the server.
     */
    _startSave: function() {
      this._opSetQueue.push({});
    },

    /**
     * Called when a save fails because of an error. Any changes that were part
     * of the save need to be merged with changes made after the save. This
     * might throw an exception is you do conflicting operations. For example,
     * if you do:
     *   object.set("foo", "bar");
     *   object.set("invalid field name", "baz");
     *   object.save();
     *   object.increment("foo");
     * then this will throw when the save fails and the client tries to merge
     * "bar" with the +1.
     */
    _cancelSave: function() {
      var self = this;
      var failedChanges = _.first(this._opSetQueue);
      this._opSetQueue = _.rest(this._opSetQueue);
      var nextChanges = _.first(this._opSetQueue);
      Parse._objectEach(failedChanges, function(op, key) {
        var op1 = failedChanges[key];
        var op2 = nextChanges[key];
        if (op1 && op2) {
          nextChanges[key] = op2._mergeWithPrevious(op1);
        } else if (op1) {
          nextChanges[key] = op1;
        }
      });
      this._saving = this._saving - 1;
    },

    /**
     * Called when a save completes successfully. This merges the changes that
     * were saved into the known server data, and overrides it with any data
     * sent directly from the server.
     */
    _finishSave: function(serverData) {
      // Grab a copy of any object referenced by this object. These instances
      // may have already been fetched, and we don't want to lose their data.
      // Note that doing it like this means we will unify separate copies of the
      // same object, but that's a risk we have to take.
      var fetchedObjects = {};
      Parse._traverse(this.attributes, function(object) {
        if (object instanceof Parse.Object && object.id && object._hasData) {
          fetchedObjects[object.id] = object;
        }
      });

      var savedChanges = _.first(this._opSetQueue);
      this._opSetQueue = _.rest(this._opSetQueue);
      this._applyOpSet(savedChanges, this._serverData);
      this._mergeMagicFields(serverData);
      var self = this;
      Parse._objectEach(serverData, function(value, key) {
        self._serverData[key] = Parse._decode(key, value);

        // Look for any objects that might have become unfetched and fix them
        // by replacing their values with the previously observed values.
        var fetched = Parse._traverse(self._serverData[key], function(object) {
          if (object instanceof Parse.Object && fetchedObjects[object.id]) {
            return fetchedObjects[object.id];
          }
        });
        if (fetched) {
          self._serverData[key] = fetched;
        }
      });
      this._rebuildAllEstimatedData();
      this._saving = this._saving - 1;
    },

    /**
     * Called when a fetch or login is complete to set the known server data to
     * the given object.
     */
    _finishFetch: function(serverData, hasData) {
      // TODO (bklimt): Revisit clearing operations, perhaps move to revert.
      this._opSetQueue = [{}];

      // Bring in all the new server data.
      this._mergeMagicFields(serverData);
      this._copyServerData(serverData);

      this._hasData = hasData;
    },

    /**
     * Applies the set of Parse.Op in opSet to the object target.
     */
    _applyOpSet: function(opSet, target) {
      var self = this;
      Parse._objectEach(opSet, function(change, key) {
        target[key] = change._estimate(target[key], self, key);
        if (target[key] === Parse.Op._UNSET) {
          delete target[key];
        }
      });
    },

    /**
     * Replaces the cached value for key with the current value.
     * Returns true if the new value is different than the old value.
     */
    _resetCacheForKey: function(key) {
      var value = this.attributes[key];
      if (_.isObject(value) &&
          !(value instanceof Parse.Object) &&
          !(value instanceof Parse.File)) {
        value = value.toJSON ? value.toJSON() : value;
        var json = JSON.stringify(value);
        if (this._hashedJSON[key] !== json) {
          var wasSet = !!this._hashedJSON[key];
          this._hashedJSON[key] = json;
          return wasSet;
        }
      }
      return false;
    },

    /**
     * Populates attributes[key] by starting with the last known data from the
     * server, and applying all of the local changes that have been made to that
     * key since then.
     */
    _rebuildEstimatedDataForKey: function(key) {
      var self = this;
      delete this.attributes[key];
      if (this._serverData[key]) {
        this.attributes[key] = this._serverData[key];
      }
      Parse._arrayEach(this._opSetQueue, function(opSet) {
        var op = opSet[key];
        if (op) {
          self.attributes[key] = op._estimate(self.attributes[key], self, key);
          if (self.attributes[key] === Parse.Op._UNSET) {
            delete self.attributes[key];
          } else {
            self._resetCacheForKey(key);
          }
        }
      });
    },

    /**
     * Populates attributes by starting with the last known data from the
     * server, and applying all of the local changes that have been made since
     * then.
     */
    _rebuildAllEstimatedData: function() {
      var self = this;

      var previousAttributes = _.clone(this.attributes);

      this.attributes = _.clone(this._serverData);
      Parse._arrayEach(this._opSetQueue, function(opSet) {
        self._applyOpSet(opSet, self.attributes);
        Parse._objectEach(opSet, function(op, key) {
          self._resetCacheForKey(key);
        });
      });

      // Trigger change events for anything that changed because of the fetch.
      Parse._objectEach(previousAttributes, function(oldValue, key) {
        if (self.attributes[key] !== oldValue) {
          self.trigger('change:' + key, self, self.attributes[key], {});
        }
      });
      Parse._objectEach(this.attributes, function(newValue, key) {
        if (!_.has(previousAttributes, key)) {
          self.trigger('change:' + key, self, newValue, {});
        }
      });
    },

    /**
     * Sets a hash of model attributes on the object, firing
     * <code>"change"</code> unless you choose to silence it.
     *
     * <p>You can call it with an object containing keys and values, or with one
     * key and value.  For example:<pre>
     *   gameTurn.set({
     *     player: player1,
     *     diceRoll: 2
     *   }, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("currentPlayer", player2, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("finished", true);</pre></p>
     *
     * @param {String} key The key to set.
     * @param {} value The value to give it.
     * @param {Object} options A set of Backbone-like options for the set.
     *     The only supported options are <code>silent</code>,
     *     <code>error</code>, and <code>promise</code>.
     * @return {Boolean} true if the set succeeded.
     * @see Parse.Object#validate
     * @see Parse.Error
     */
    set: function(key, value, options) {
      var attrs, attr;
      if (_.isObject(key) || Parse._isNullOrUndefined(key)) {
        attrs = key;
        Parse._objectEach(attrs, function(v, k) {
          attrs[k] = Parse._decode(k, v);
        });
        options = value;
      } else {
        attrs = {};
        attrs[key] = Parse._decode(key, value);
      }

      // Extract attributes and options.
      options = options || {};
      if (!attrs) {
        return this;
      }
      if (attrs instanceof Parse.Object) {
        attrs = attrs.attributes;
      }

      var self = this;
      Parse._objectEach(attrs, function(unused_value, key) {
        if (self.constructor.readOnlyAttributes &&
          self.constructor.readOnlyAttributes[key]) {
          throw new Error('Cannot modify readonly key: ' + key);
        }
      });

      // If the unset option is used, every attribute should be a Unset.
      if (options.unset) {
        Parse._objectEach(attrs, function(unused_value, key) {
          attrs[key] = new Parse.Op.Unset();
        });
      }

      // Apply all the attributes to get the estimated values.
      var dataToValidate = _.clone(attrs);
      Parse._objectEach(dataToValidate, function(value, key) {
        if (value instanceof Parse.Op) {
          dataToValidate[key] = value._estimate(self.attributes[key],
                                                self, key);
          if (dataToValidate[key] === Parse.Op._UNSET) {
            delete dataToValidate[key];
          }
        }
      });

      // Run validation.
      if (!this._validate(attrs, options)) {
        return false;
      }

      this._mergeMagicFields(attrs);

      options.changes = {};
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // Update attributes.
      Parse._arrayEach(_.keys(attrs), function(attr) {
        var val = attrs[attr];

        // If this is a relation object we need to set the parent correctly,
        // since the location where it was parsed does not have access to
        // this object.
        if (val instanceof Parse.Relation) {
          val.parent = self;
        }

        if (!(val instanceof Parse.Op)) {
          val = new Parse.Op.Set(val);
        }

        // See if this change will actually have any effect.
        var isRealChange = true;
        if (val instanceof Parse.Op.Set &&
            _.isEqual(self.attributes[attr], val.value)) {
          isRealChange = false;
        }

        if (isRealChange) {
          delete escaped[attr];
          if (options.silent) {
            self._silent[attr] = true;
          } else {
            options.changes[attr] = true;
          }
        }

        var currentChanges = _.last(self._opSetQueue);
        currentChanges[attr] = val._mergeWithPrevious(currentChanges[attr]);
        self._rebuildEstimatedDataForKey(attr);

        if (isRealChange) {
          self.changed[attr] = self.attributes[attr];
          if (!options.silent) {
            self._pending[attr] = true;
          }
        } else {
          delete self.changed[attr];
          delete self._pending[attr];
        }
      });

      if (!options.silent) {
        this.change(options);
      }
      return this;
    },

    /**
     * Remove an attribute from the model, firing <code>"change"</code> unless
     * you choose to silence it. This is a noop if the attribute doesn't
     * exist.
     */
    unset: function(attr, options) {
      options = options || {};
      options.unset = true;
      return this.set(attr, null, options);
    },

    /**
     * Atomically increments the value of the given attribute the next time the
     * object is saved. If no amount is specified, 1 is used by default.
     *
     * @param attr {String} The key.
     * @param amount {Number} The amount to increment by.
     */
    increment: function(attr, amount) {
      if (_.isUndefined(amount) || _.isNull(amount)) {
        amount = 1;
      }
      return this.set(attr, new Parse.Op.Increment(amount));
    },

    /**
     * Atomically add an object to the end of the array associated with a given
     * key.
     * @param attr {String} The key.
     * @param item {} The item to add.
     */
    add: function(attr, item) {
      return this.set(attr, new Parse.Op.Add([item]));
    },

    /**
     * Atomically add an object to the array associated with a given key, only
     * if it is not already present in the array. The position of the insert is
     * not guaranteed.
     *
     * @param attr {String} The key.
     * @param item {} The object to add.
     */
    addUnique: function(attr, item) {
      return this.set(attr, new Parse.Op.AddUnique([item]));
    },

    /**
     * Atomically remove all instances of an object from the array associated
     * with a given key.
     *
     * @param attr {String} The key.
     * @param item {} The object to remove.
     */
    remove: function(attr, item) {
      return this.set(attr, new Parse.Op.Remove([item]));
    },

    /**
     * Returns an instance of a subclass of Parse.Op describing what kind of
     * modification has been performed on this field since the last time it was
     * saved. For example, after calling object.increment("x"), calling
     * object.op("x") would return an instance of Parse.Op.Increment.
     *
     * @param attr {String} The key.
     * @returns {Parse.Op} The operation, or undefined if none.
     */
    op: function(attr) {
      return _.last(this._opSetQueue)[attr];
    },

    /**
     * Clear all attributes on the model, firing <code>"change"</code> unless
     * you choose to silence it.
     */
    clear: function(options) {
      options = options || {};
      options.unset = true;
      var keysToClear = _.extend(this.attributes, this._operations);
      return this.set(keysToClear, options);
    },

    /**
     * Returns a JSON-encoded set of operations to be sent with the next save
     * request.
     */
    _getSaveJSON: function() {
      var json = _.clone(_.first(this._opSetQueue));
      Parse._objectEach(json, function(op, key) {
        json[key] = op.toJSON();
      });
      return json;
    },

    /**
     * Returns true if this object can be serialized for saving.
     */
    _canBeSerialized: function() {
      return Parse.Object._canBeSerializedAsValue(this.attributes);
    },

    /**
     * Fetch the model from the server. If the server's representation of the
     * model differs from its current attributes, they will be overriden,
     * triggering a <code>"change"</code> event.
     *
     * @param {Object} options A Backbone-style callback object.
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     * </ul>
     * @return {Parse.Promise} A promise that is fulfilled when the fetch
     *     completes.
     */
    fetch: function(options) {
      var self = this;
      options = options || {};
      var request = Parse._request({
        method: 'GET',
        route: "classes",
        className: this.className,
        objectId: this.id,
        useMasterKey: options.useMasterKey
      });
      return request.then(function(response, status, xhr) {
        self._finishFetch(self.parse(response, status, xhr), true);
        return self;
      })._thenRunCallbacks(options, this);
    },

    /**
     * Set a hash of model attributes, and save the model to the server.
     * updatedAt will be updated when the request returns.
     * You can either call it as:<pre>
     *   object.save();</pre>
     * or<pre>
     *   object.save(null, options);</pre>
     * or<pre>
     *   object.save(attrs, options);</pre>
     * or<pre>
     *   object.save(key, value, options);</pre>
     *
     * For example, <pre>
     *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }, {
     *     success: function(gameTurnAgain) {
     *       // The save was successful.
     *     },
     *     error: function(gameTurnAgain, error) {
     *       // The save failed.  Error is an instance of Parse.Error.
     *     }
     *   });</pre>
     * or with promises:<pre>
     *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }).then(function(gameTurnAgain) {
     *     // The save was successful.
     *   }, function(error) {
     *     // The save failed.  Error is an instance of Parse.Error.
     *   });</pre>
     *
     * @param {Object} options A Backbone-style callback object.
     * Valid options are:<ul>
     *   <li>wait: Set to true to wait for the server to confirm a successful
     *   save before modifying the attributes on the object.
     *   <li>silent: Set to true to avoid firing the `set` event.
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     * </ul>
     * @return {Parse.Promise} A promise that is fulfilled when the save
     *     completes.
     * @see Parse.Error
     */
    save: function(arg1, arg2, arg3) {
      var i, attrs, current, options, saved;
      if (_.isObject(arg1) || Parse._isNullOrUndefined(arg1)) {
        attrs = arg1;
        options = arg2;
      } else {
        attrs = {};
        attrs[arg1] = arg2;
        options = arg3;
      }

      // Make save({ success: function() {} }) work.
      if (!options && attrs) {
        var extra_keys = _.reject(attrs, function(value, key) {
          return _.include(["success", "error", "wait"], key);
        });
        if (extra_keys.length === 0) {
          var all_functions = true;
          if (_.has(attrs, "success") && !_.isFunction(attrs.success)) {
            all_functions = false;
          }
          if (_.has(attrs, "error") && !_.isFunction(attrs.error)) {
            all_functions = false;
          }
          if (all_functions) {
            // This attrs object looks like it's really an options object,
            // and there's no other options object, so let's just use it.
            return this.save(null, attrs);
          }
        }
      }

      options = _.clone(options) || {};
      if (options.wait) {
        current = _.clone(this.attributes);
      }

      var setOptions = _.clone(options) || {};
      if (setOptions.wait) {
        setOptions.silent = true;
      }
      var setError;
      setOptions.error = function(model, error) {
        setError = error;
      };
      if (attrs && !this.set(attrs, setOptions)) {
        return Parse.Promise.error(setError)._thenRunCallbacks(options, this);
      }

      var model = this;

      // If there is any unsaved child, save it first.
      model._refreshCache();

      // TODO(klimt): Refactor this so that the save starts now, not later.

      var unsavedChildren = [];
      var unsavedFiles = [];
      Parse.Object._findUnsavedChildren(model.attributes,
                                        unsavedChildren,
                                        unsavedFiles);
      if (unsavedChildren.length + unsavedFiles.length > 0) {
        return Parse.Object._deepSaveAsync(this.attributes, {
          useMasterKey: options.useMasterKey
        }).then(function() {
          return model.save(null, options);
        }, function(error) {
          return Parse.Promise.error(error)._thenRunCallbacks(options, model);
        });
      }

      this._startSave();
      this._saving = (this._saving || 0) + 1;

      this._allPreviousSaves = this._allPreviousSaves || Parse.Promise.as();
      this._allPreviousSaves = this._allPreviousSaves._continueWith(function() {
        var method = model.id ? 'PUT' : 'POST';

        var json = model._getSaveJSON();

        var route = "classes";
        var className = model.className;
        if (model.className === "_User" && !model.id) {
          // Special-case user sign-up.
          route = "users";
          className = null;
        }
        var request = Parse._request({
          route: route,
          className: className,
          objectId: model.id,
          method: method,
          useMasterKey: options.useMasterKey,
          data: json
        });

        request = request.then(function(resp, status, xhr) {
          var serverAttrs = model.parse(resp, status, xhr);
          if (options.wait) {
            serverAttrs = _.extend(attrs || {}, serverAttrs);
          }
          model._finishSave(serverAttrs);
          if (options.wait) {
            model.set(current, setOptions);
          }
          return model;

        }, function(error) {
          model._cancelSave();
          return Parse.Promise.error(error);

        })._thenRunCallbacks(options, model);

        return request;
      });
      return this._allPreviousSaves;
    },

    /**
     * Destroy this model on the server if it was already persisted.
     * Optimistically removes the model from its collection, if it has one.
     * If `wait: true` is passed, waits for the server to respond
     * before removal.
     *
     * @param {Object} options A Backbone-style callback object.
     * Valid options are:<ul>
     *   <li>wait: Set to true to wait for the server to confirm successful
     *   deletion of the object before triggering the `destroy` event.
     *   <li>success: A Backbone-style success callback
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     * </ul>
     * @return {Parse.Promise} A promise that is fulfilled when the destroy
     *     completes.
     */
    destroy: function(options) {
      options = options || {};
      var model = this;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (!this.id) {
        return triggerDestroy();
      }

      if (!options.wait) {
        triggerDestroy();
      }

      var request = Parse._request({
        route: "classes",
        className: this.className,
        objectId: this.id,
        method: 'DELETE',
        useMasterKey: options.useMasterKey
      });
      return request.then(function() {
        if (options.wait) {
          triggerDestroy();
        }
        return model;
      })._thenRunCallbacks(options, this);
    },

    /**
     * Converts a response into the hash of attributes to be set on the model.
     * @ignore
     */
    parse: function(resp, status, xhr) {
      var output = _.clone(resp);
      _(["createdAt", "updatedAt"]).each(function(key) {
        if (output[key]) {
          output[key] = Parse._parseDate(output[key]);
        }
      });
      if (!output.updatedAt) {
        output.updatedAt = output.createdAt;
      }
      if (status) {
        this._existed = (status !== 201);
      }
      return output;
    },

    /**
     * Creates a new model with identical attributes to this one.
     * @return {Parse.Object}
     */
    clone: function() {
      return new this.constructor(this.attributes);
    },

    /**
     * Returns true if this object has never been saved to Parse.
     * @return {Boolean}
     */
    isNew: function() {
      return !this.id;
    },

    /**
     * Call this method to manually fire a `"change"` event for this model and
     * a `"change:attribute"` event for each changed attribute.
     * Calling this will cause all objects observing the model to update.
     */
    change: function(options) {
      options = options || {};
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      var self = this;
      Parse._objectEach(this._silent, function(attr) {
        self._pending[attr] = true;
      });

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      Parse._objectEach(changes, function(unused_value, attr) {
        self.trigger('change:' + attr, self, self.get(attr), options);
      });
      if (changing) {
        return this;
      }

      // This is to get around lint not letting us make a function in a loop.
      var deleteChanged = function(value, attr) {
        if (!self._pending[attr] && !self._silent[attr]) {
          delete self.changed[attr];
        }
      };

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        Parse._objectEach(this.changed, deleteChanged);
        self._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    /**
     * Returns true if this object was created by the Parse server when the
     * object might have already been there (e.g. in the case of a Facebook
     * login)
     */
    existed: function() {
      return this._existed;
    },

    /**
     * Determine if the model has changed since the last <code>"change"</code>
     * event.  If you specify an attribute name, determine if that attribute
     * has changed.
     * @param {String} attr Optional attribute name
     * @return {Boolean}
     */
    hasChanged: function(attr) {
      if (!arguments.length) {
        return !_.isEmpty(this.changed);
      }
      return this.changed && _.has(this.changed, attr);
    },

    /**
     * Returns an object containing all the attributes that have changed, or
     * false if there are no changed attributes. Useful for determining what
     * parts of a view need to be updated and/or what attributes need to be
     * persisted to the server. Unset attributes will be set to undefined.
     * You can also pass an attributes object to diff against the model,
     * determining if there *would be* a change.
     */
    changedAttributes: function(diff) {
      if (!diff) {
        return this.hasChanged() ? _.clone(this.changed) : false;
      }
      var changed = {};
      var old = this._previousAttributes;
      Parse._objectEach(diff, function(diffVal, attr) {
        if (!_.isEqual(old[attr], diffVal)) {
          changed[attr] = diffVal;
        }
      });
      return changed;
    },

    /**
     * Gets the previous value of an attribute, recorded at the time the last
     * <code>"change"</code> event was fired.
     * @param {String} attr Name of the attribute to get.
     */
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) {
        return null;
      }
      return this._previousAttributes[attr];
    },

    /**
     * Gets all of the attributes of the model at the time of the previous
     * <code>"change"</code> event.
     * @return {Object}
     */
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    /**
     * Checks if the model is currently in a valid state. It's only possible to
     * get into an *invalid* state if you're using silent changes.
     * @return {Boolean}
     */
    isValid: function() {
      return !this.validate(this.attributes);
    },

    /**
     * You should not call this function directly unless you subclass
     * <code>Parse.Object</code>, in which case you can override this method
     * to provide additional validation on <code>set</code> and
     * <code>save</code>.  Your implementation should return
     *
     * @param {Object} attrs The current data to validate.
     * @param {Object} options A Backbone-like options object.
     * @return {} False if the data is valid.  An error object otherwise.
     * @see Parse.Object#set
     */
    validate: function(attrs, options) {
      if (_.has(attrs, "ACL") && !(attrs.ACL instanceof Parse.ACL)) {
        return new Parse.Error(Parse.Error.OTHER_CAUSE,
                               "ACL must be a Parse.ACL.");
      }
      var correct = true;
      Parse._objectEach(attrs, function(unused_value, key) {
        if (!(/^[A-Za-z][0-9A-Za-z_]*$/).test(key)) {
          correct = false;
        }
      });
      if (!correct) {
        return new Parse.Error(Parse.Error.INVALID_KEY_NAME);
      }
      return false;
    },

    /**
     * Run validation against a set of incoming attributes, returning `true`
     * if all is well. If a specific `error` callback has been passed,
     * call that instead of firing the general `"error"` event.
     */
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) {
        return true;
      }
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) {
        return true;
      }
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    },

    /**
     * Returns the ACL for this object.
     * @returns {Parse.ACL} An instance of Parse.ACL.
     * @see Parse.Object#get
     */
    getACL: function() {
      return this.get("ACL");
    },

    /**
     * Sets the ACL to be used for this object.
     * @param {Parse.ACL} acl An instance of Parse.ACL.
     * @param {Object} options Optional Backbone-like options object to be
     *     passed in to set.
     * @return {Boolean} Whether the set passed validation.
     * @see Parse.Object#set
     */
    setACL: function(acl, options) {
      return this.set("ACL", acl, options);
    }

  });

  /**
   * Returns the appropriate subclass for making new instances of the given
   * className string.
   */
  Parse.Object._getSubclass = function(className) {
    if (!_.isString(className)) {
      throw "Parse.Object._getSubclass requires a string argument.";
    }
    var ObjectClass = Parse.Object._classMap[className];
    if (!ObjectClass) {
      ObjectClass = Parse.Object.extend(className);
      Parse.Object._classMap[className] = ObjectClass;
    }
    return ObjectClass;
  };

  /**
   * Creates an instance of a subclass of Parse.Object for the given classname.
   */
  Parse.Object._create = function(className, attributes, options) {
    var ObjectClass = Parse.Object._getSubclass(className);
    return new ObjectClass(attributes, options);
  };

  /**
   * Returns a list of object ids given a list of objects.
   */
  Parse.Object._toObjectIdArray = function(list, omitObjectsWithData) {
    if (list.length === 0) {
      return Parse.Promise.as(list);
    }

    var error;
    var className = list[0].className;
    var objectIds = [];
    for (var i = 0; i < list.length; i++) {
      var object = list[i];
      if (className !== object.className) {
        error = new Parse.Error(Parse.Error.INVALID_CLASS_NAME,
                                "All objects should be of the same class");
        return Parse.Promise.error(error);
      } else if (!object.id) {
        error = new Parse.Error(Parse.Error.MISSING_OBJECT_ID,
                                "All objects must have an ID");
        return Parse.Promise.error(error);
      } else if (omitObjectsWithData && object._hasData) {
        continue;
      }
      objectIds.push(object.id);
    }

    return Parse.Promise.as(objectIds);
  };

  /**
   * Updates a list of objects with fetched results.
   */
  Parse.Object._updateWithFetchedResults = function(list, fetched, forceFetch) {
    var fetchedObjectsById = {};
    Parse._arrayEach(fetched, function(object, i) {
      fetchedObjectsById[object.id] = object;
    });

    for (var i = 0; i < list.length; i++) {
      var object = list[i];
      var fetchedObject = fetchedObjectsById[object.id];
      if (!fetchedObject && forceFetch) {
        var error = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND,
                                "All objects must exist on the server");
        return Parse.Promise.error(error);
      }

      object._mergeFromObject(fetchedObject);
    }

    return Parse.Promise.as(list);
  };

  /**
   * Fetches the objects given in list.  The forceFetch option will fetch all
   * objects if true and ignore objects with data if false.
   */
  Parse.Object._fetchAll = function(list, forceFetch) {
    if (list.length === 0) {
      return Parse.Promise.as(list);
    }

    var omitObjectsWithData = !forceFetch;
    return Parse.Object._toObjectIdArray(
      list,
      omitObjectsWithData
    ).then(function(objectIds) {
      var className = list[0].className;
      var query = new Parse.Query(className);
      query.containedIn("objectId", objectIds);
      query.limit = objectIds.length;
      return query.find();
    }).then(function(results) {
      return Parse.Object._updateWithFetchedResults(
        list,
        results,
        forceFetch
      );
    });
  };

  // Set up a map of className to class so that we can create new instances of
  // Parse Objects from JSON automatically.
  Parse.Object._classMap = {};

  Parse.Object._extend = Parse._extend;

  /**
   * Creates a new subclass of Parse.Object for the given Parse class name.
   *
   * <p>Every extension of a Parse class will inherit from the most recent
   * previous extension of that class. When a Parse.Object is automatically
   * created by parsing JSON, it will use the most recent extension of that
   * class.</p>
   *
   * <p>You should call either:<pre>
   *     var MyClass = Parse.Object.extend("MyClass", {
   *         <i>Instance methods</i>,
   *         initialize: function(attrs, options) {
   *             this.someInstanceProperty = [],
   *             <i>Other instance properties</i>
   *         }
   *     }, {
   *         <i>Class properties</i>
   *     });</pre>
   * or, for Backbone compatibility:<pre>
   *     var MyClass = Parse.Object.extend({
   *         className: "MyClass",
   *         <i>Instance methods</i>,
   *         initialize: function(attrs, options) {
   *             this.someInstanceProperty = [],
   *             <i>Other instance properties</i>
   *         }
   *     }, {
   *         <i>Class properties</i>
   *     });</pre></p>
   *
   * @param {String} className The name of the Parse class backing this model.
   * @param {Object} protoProps Instance properties to add to instances of the
   *     class returned from this method.
   * @param {Object} classProps Class properties to add the class returned from
   *     this method.
   * @return {Class} A new subclass of Parse.Object.
   */
  Parse.Object.extend = function(className, protoProps, classProps) {
    // Handle the case with only two args.
    if (!_.isString(className)) {
      if (className && _.has(className, "className")) {
        return Parse.Object.extend(className.className, className, protoProps);
      } else {
        throw new Error(
            "Parse.Object.extend's first argument should be the className.");
      }
    }

    // If someone tries to subclass "User", coerce it to the right type.
    if (className === "User" && Parse.User._performUserRewrite) {
      className = "_User";
    }
    protoProps = protoProps || {};
    protoProps.className = className;

    var NewClassObject = null;
    if (_.has(Parse.Object._classMap, className)) {
      var OldClassObject = Parse.Object._classMap[className];
      // This new subclass has been told to extend both from "this" and from
      // OldClassObject. This is multiple inheritance, which isn't supported.
      // For now, let's just pick one.
      NewClassObject = OldClassObject._extend(protoProps, classProps);
    } else {
      NewClassObject = this._extend(protoProps, classProps);
    }
    // Extending a subclass should reuse the classname automatically.
    NewClassObject.extend = function(arg0) {
      if (_.isString(arg0) || (arg0 && _.has(arg0, "className"))) {
        return Parse.Object.extend.apply(NewClassObject, arguments);
      }
      var newArguments = [className].concat(Parse._.toArray(arguments));
      return Parse.Object.extend.apply(NewClassObject, newArguments);
    };

    /**
     * Creates a reference to a subclass of Parse.Object with the given id. This
     * does not exist on Parse.Object, only on subclasses.
     *
     * <p>A shortcut for: <pre>
     *  var Foo = Parse.Object.extend("Foo");
     *  var pointerToFoo = new Foo();
     *  pointerToFoo.id = "myObjectId";
     * </pre>
     *
     * @name createWithoutData
     * @param {String} id The ID of the object to create a reference to.
     * @return {Parse.Object} A Parse.Object reference.
     * @function
     * @memberOf Parse.Object
     */
    NewClassObject.createWithoutData = function(id) {
      var obj = new NewClassObject();
      obj.id = id;
      return obj;
    };

    Parse.Object._classMap[className] = NewClassObject;
    return NewClassObject;
  };

  Parse.Object._findUnsavedChildren = function(object, children, files) {
    Parse._traverse(object, function(object) {
      if (object instanceof Parse.Object) {
        object._refreshCache();
        if (object.dirty()) {
          children.push(object);
        }
        return;
      }

      if (object instanceof Parse.File) {
        if (!object.url()) {
          files.push(object);
        }
        return;
      }
    });
  };

  Parse.Object._canBeSerializedAsValue = function(object) {
    // TODO(klimt): We should rewrite _traverse so that it can be used here.
    if (object instanceof Parse.Object) {
      return !!object.id;
    }
    if (object instanceof Parse.File) {
      // Don't recurse indefinitely into files.
      return true;
    }

    var canBeSerializedAsValue = true;

    if (_.isArray(object)) {
      Parse._arrayEach(object, function(child) {
        if (!Parse.Object._canBeSerializedAsValue(child)) {
          canBeSerializedAsValue = false;
        }
      });
    } else if (_.isObject(object)) {
      Parse._objectEach(object, function(child) {
        if (!Parse.Object._canBeSerializedAsValue(child)) {
          canBeSerializedAsValue = false;
        }
      });
    }
    return canBeSerializedAsValue;
  };

  /**
   * @param {Object} object The root object.
   * @param {Object} options: The only valid option is useMasterKey.
   */
  Parse.Object._deepSaveAsync = function(object, options) {
    var unsavedChildren = [];
    var unsavedFiles = [];
    Parse.Object._findUnsavedChildren(object, unsavedChildren, unsavedFiles);

    var promise = Parse.Promise.as();
    _.each(unsavedFiles, function(file) {
      promise = promise.then(function() {
        return file.save(options);
      });
    });

    var objects = _.uniq(unsavedChildren);
    var remaining = _.uniq(objects);

    return promise.then(function() {
      return Parse.Promise._continueWhile(function() {
        return remaining.length > 0;
      }, function() {

        // Gather up all the objects that can be saved in this batch.
        var batch = [];
        var newRemaining = [];
        Parse._arrayEach(remaining, function(object) {
          // Limit batches to 20 objects.
          if (batch.length > 20) {
            newRemaining.push(object);
            return;
          }

          if (object._canBeSerialized()) {
            batch.push(object);
          } else {
            newRemaining.push(object);
          }
        });
        remaining = newRemaining;

        // If we can't save any objects, there must be a circular reference.
        if (batch.length === 0) {
          return Parse.Promise.error(
            new Parse.Error(Parse.Error.OTHER_CAUSE,
                            "Tried to save a batch with a cycle."));
        }

        // Reserve a spot in every object's save queue.
        var readyToStart = Parse.Promise.when(_.map(batch, function(object) {
          return object._allPreviousSaves || Parse.Promise.as();
        }));
        var batchFinished = new Parse.Promise();
        Parse._arrayEach(batch, function(object) {
          object._allPreviousSaves = batchFinished;
        });

        // Save a single batch, whether previous saves succeeded or failed.
        return readyToStart._continueWith(function() {
          return Parse._request({
            route: "batch",
            method: "POST",
            useMasterKey: options.useMasterKey,
            data: {
              requests: _.map(batch, function(object) {
                var json = object._getSaveJSON();
                var method = "POST";

                var path = "/1/classes/" + object.className;
                if (object.id) {
                  path = path + "/" + object.id;
                  method = "PUT";
                }

                object._startSave();

                return {
                  method: method,
                  path: path,
                  body: json
                };
              })
            }
          }).then(function(response, status, xhr) {
            var error;
            Parse._arrayEach(batch, function(object, i) {
              if (response[i].success) {
                object._finishSave(
                  object.parse(response[i].success, status, xhr));
              } else {
                error = error || response[i].error;
                object._cancelSave();
              }
            });
            if (error) {
              return Parse.Promise.error(
                new Parse.Error(error.code, error.error));
            }

          }).then(function(results) {
            batchFinished.resolve(results);
            return results;
          }, function(error) {
            batchFinished.reject(error);
            return Parse.Promise.error(error);
          });
        });
      });
    }).then(function() {
      return object;
    });
  };

}(this));

(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Represents a Role on the Parse server. Roles represent groupings of
   * Users for the purposes of granting permissions (e.g. specifying an ACL
   * for an Object). Roles are specified by their sets of child users and
   * child roles, all of which are granted any permissions that the parent
   * role has.
   *
   * <p>Roles must have a name (which cannot be changed after creation of the
   * role), and must specify an ACL.</p>
   * @class
   * A Parse.Role is a local representation of a role persisted to the Parse
   * cloud.
   */
  Parse.Role = Parse.Object.extend("_Role", /** @lends Parse.Role.prototype */ {
    // Instance Methods
    
    /**
     * Constructs a new ParseRole with the given name and ACL.
     * 
     * @param {String} name The name of the Role to create.
     * @param {Parse.ACL} acl The ACL for this role. Roles must have an ACL.
     */
    constructor: function(name, acl) {
      if (_.isString(name) && (acl instanceof Parse.ACL)) {
        Parse.Object.prototype.constructor.call(this, null, null);
        this.setName(name);
        this.setACL(acl);
      } else {
        Parse.Object.prototype.constructor.call(this, name, acl);
      }
    },
    
    /**
     * Gets the name of the role.  You can alternatively call role.get("name")
     * 
     * @return {String} the name of the role.
     */
    getName: function() {
      return this.get("name");
    },
    
    /**
     * Sets the name for a role. This value must be set before the role has
     * been saved to the server, and cannot be set once the role has been
     * saved.
     * 
     * <p>
     *   A role's name can only contain alphanumeric characters, _, -, and
     *   spaces.
     * </p>
     *
     * <p>This is equivalent to calling role.set("name", name)</p>
     * 
     * @param {String} name The name of the role.
     * @param {Object} options Standard options object with success and error
     *     callbacks.
     */
    setName: function(name, options) {
      return this.set("name", name, options);
    },
    
    /**
     * Gets the Parse.Relation for the Parse.Users that are direct
     * children of this role. These users are granted any privileges that this
     * role has been granted (e.g. read or write access through ACLs). You can
     * add or remove users from the role through this relation.
     * 
     * <p>This is equivalent to calling role.relation("users")</p>
     * 
     * @return {Parse.Relation} the relation for the users belonging to this
     *     role.
     */
    getUsers: function() {
      return this.relation("users");
    },
    
    /**
     * Gets the Parse.Relation for the Parse.Roles that are direct
     * children of this role. These roles' users are granted any privileges that
     * this role has been granted (e.g. read or write access through ACLs). You
     * can add or remove child roles from this role through this relation.
     * 
     * <p>This is equivalent to calling role.relation("roles")</p>
     * 
     * @return {Parse.Relation} the relation for the roles belonging to this
     *     role.
     */
    getRoles: function() {
      return this.relation("roles");
    },
    
    /**
     * @ignore
     */
    validate: function(attrs, options) {
      if ("name" in attrs && attrs.name !== this.getName()) {
        var newName = attrs.name;
        if (this.id && this.id !== attrs.objectId) {
          // Check to see if the objectId being set matches this.id.
          // This happens during a fetch -- the id is set before calling fetch.
          // Let the name be set in this case.
          return new Parse.Error(Parse.Error.OTHER_CAUSE,
              "A role's name can only be set before it has been saved.");
        }
        if (!_.isString(newName)) {
          return new Parse.Error(Parse.Error.OTHER_CAUSE,
              "A role's name must be a String.");
        }
        if (!(/^[0-9a-zA-Z\-_ ]+$/).test(newName)) {
          return new Parse.Error(Parse.Error.OTHER_CAUSE,
              "A role's name can only contain alphanumeric characters, _," +
              " -, and spaces.");
        }
      }
      if (Parse.Object.prototype.validate) {
        return Parse.Object.prototype.validate.call(this, attrs, options);
      }
      return false;
    }
  });
}(this));


/*global _: false */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new instance with the given models and options.  Typically, you
   * will not call this method directly, but will instead make a subclass using
   * <code>Parse.Collection.extend</code>.
   *
   * @param {Array} models An array of instances of <code>Parse.Object</code>.
   *
   * @param {Object} options An optional object with Backbone-style options.
   * Valid options are:<ul>
   *   <li>model: The Parse.Object subclass that this collection contains.
   *   <li>query: An instance of Parse.Query to use when fetching items.
   *   <li>comparator: A string property name or function to sort by.
   * </ul>
   *
   * @see Parse.Collection.extend
   *
   * @class
   *
   * <p>Provides a standard collection class for our sets of models, ordered
   * or unordered.  For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#Collection">Backbone
   * documentation</a>.</p>
   */
  Parse.Collection = function(models, options) {
    options = options || {};
    if (options.comparator) {
      this.comparator = options.comparator;
    }
    if (options.model) {
      this.model = options.model;
    }
    if (options.query) {
      this.query = options.query;
    }
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) {
      this.reset(models, {silent: true, parse: options.parse});
    }
  };

  // Define the Collection's inheritable methods.
  _.extend(Parse.Collection.prototype, Parse.Events,
      /** @lends Parse.Collection.prototype */ {

    // The default model for a collection is just a Parse.Object.
    // This should be overridden in most cases.
    // TODO: think harder. this is likely to be weird.
    model: Parse.Object,

    /**
     * Initialize is an empty function by default. Override it with your own
     * initialization logic.
     */
    initialize: function(){},

    /**
     * The JSON representation of a Collection is an array of the
     * models' attributes.
     */
    toJSON: function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    /**
     * Add a model, or list of models to the set. Pass **silent** to avoid
     * firing the `add` event for every new model.
     *
     * @param {Array} models An array of instances of <code>Parse.Object</code>.
     *
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are:<ul>
     *   <li>at: The index at which to add the models.
     *   <li>silent: Set to true to avoid firing the `add` event for every new
     *   model.
     * </ul>
     */
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {};
      options = options || {};
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        models[i] = this._prepareModel(models[i], options);
        model = models[i];
        if (!model) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        if (cids[cid] || this._byCid[cid]) {
          throw new Error("Duplicate cid: can't add the same model " +
                          "to a collection twice");
        }
        id = model.id;
        if (!Parse._isNullOrUndefined(id) && (ids[id] || this._byId[id])) {
          throw new Error("Duplicate id: can't add the same model " +
                          "to a collection twice");
        }
        ids[id] = model;
        cids[cid] = model;
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id) {
          this._byId[model.id] = model;
        }
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = Parse._isNullOrUndefined(options.at) ? 
          this.models.length : options.at;
      this.models.splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) {
        this.sort({silent: true});
      }
      if (options.silent) {
        return this;
      }
      for (i = 0, length = this.models.length; i < length; i++) {
        model = this.models[i];
        if (cids[model.cid]) {
          options.index = i;
          model.trigger('add', model, this, options);
        }
      }
      return this;
    },

    /**
     * Remove a model, or a list of models from the set. Pass silent to avoid
     * firing the <code>remove</code> event for every model removed.
     *
     * @param {Array} models The model or list of models to remove from the
     *   collection.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are: <ul>
     *   <li>silent: Set to true to avoid firing the `remove` event.
     * </ul>
     */
    remove: function(models, options) {
      var i, l, index, model;
      options = options || {};
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) {
          continue;
        }
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    /**
     * Gets a model from the set by id.
     * @param {String} id The Parse objectId identifying the Parse.Object to
     * fetch from this collection.
     */
    get: function(id) {
      return id && this._byId[id.id || id];
    },

    /**
     * Gets a model from the set by client id.
     * @param {} cid The Backbone collection id identifying the Parse.Object to
     * fetch from this collection.
     */
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    /**
     * Gets the model at the given index.
     *
     * @param {Number} index The index of the model to return.
     */
    at: function(index) {
      return this.models[index];
    },

    /**
     * Forces the collection to re-sort itself. You don't need to call this
     * under normal circumstances, as the set will maintain sort order as each
     * item is added.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are: <ul>
     *   <li>silent: Set to true to avoid firing the `reset` event.
     * </ul>
     */
    sort: function(options) {
      options = options || {};
      if (!this.comparator) {
        throw new Error('Cannot sort a set without a comparator');
      }
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length === 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) {
        this.trigger('reset', this, options);
      }
      return this;
    },

    /**
     * Plucks an attribute from each model in the collection.
     * @param {String} attr The attribute to return from each model in the
     * collection.
     */
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    /**
     * When you have more items than you want to add or remove individually,
     * you can reset the entire set with a new list of models, without firing
     * any `add` or `remove` events. Fires `reset` when finished.
     *
     * @param {Array} models The model or list of models to remove from the
     *   collection.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are: <ul>
     *   <li>silent: Set to true to avoid firing the `reset` event.
     * </ul>
     */
    reset: function(models, options) {
      var self = this;
      models = models || [];
      options = options || {};
      Parse._arrayEach(this.models, function(model) {
        self._removeReference(model);
      });
      this._reset();
      this.add(models, {silent: true, parse: options.parse});
      if (!options.silent) {
        this.trigger('reset', this, options);
      }
      return this;
    },

    /**
     * Fetches the default set of models for this collection, resetting the
     * collection when they arrive. If `add: true` is passed, appends the
     * models to the collection instead of resetting.
     *
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are:<ul>
     *   <li>silent: Set to true to avoid firing `add` or `reset` events for
     *   models fetched by this fetch.
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, uses the Master Key for
     *       this request.
     * </ul>
     */
    fetch: function(options) {
      options = _.clone(options) || {};
      if (options.parse === undefined) {
        options.parse = true;
      }
      var collection = this;
      var query = this.query || new Parse.Query(this.model);
      return query.find({
        useMasterKey: options.useMasterKey
      }).then(function(results) {
        if (options.add) {
          collection.add(results, options);
        } else {
          collection.reset(results, options);
        }
        return collection;
      })._thenRunCallbacks(options, this);
    },

    /**
     * Creates a new instance of a model in this collection. Add the model to
     * the collection immediately, unless `wait: true` is passed, in which case
     * we wait for the server to agree.
     *
     * @param {Parse.Object} model The new model to create and add to the
     *   collection.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are:<ul>
     *   <li>wait: Set to true to wait for the server to confirm creation of the
     *       model before adding it to the collection.
     *   <li>silent: Set to true to avoid firing an `add` event.
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, uses the Master Key for
     *       this request.
     * </ul>
     */
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) {
        return false;
      }
      if (!options.wait) {
        coll.add(model, options);
      }
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) {
          coll.add(nextModel, options);
        }
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    /**
     * Converts a response into a list of models to be added to the collection.
     * The default implementation is just to pass it through.
     * @ignore
     */
    parse: function(resp, xhr) {
      return resp;
    },

    /**
     * Proxy to _'s chain. Can't be proxied the same way the rest of the
     * underscore methods are proxied because it relies on the underscore
     * constructor.
     */
    chain: function() {
      return _(this.models).chain();
    },

    /**
     * Reset all internal state. Called when the collection is reset.
     */
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    /**
     * Prepare a model or hash of attributes to be added to this collection.
     */
    _prepareModel: function(model, options) {
      if (!(model instanceof Parse.Object)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) {
          model = false;
        }
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    /**
     * Internal method to remove a model's ties to a collection.
     */
    _removeReference: function(model) {
      if (this === model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    /**
     * Internal method called every time a model in the set fires an event.
     * Sets need to update their indexes when models change ids. All other
     * events simply proxy through. "add" and "remove" events that originate
     * in other collections are ignored.
     */
    _onModelEvent: function(ev, model, collection, options) {
      if ((ev === 'add' || ev === 'remove') && collection !== this) {
        return;
      }
      if (ev === 'destroy') {
        this.remove(model, options);
      }
      if (model && ev === 'change:objectId') {
        delete this._byId[model.previous("objectId")];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  Parse._arrayEach(methods, function(method) {
    Parse.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  /**
   * Creates a new subclass of <code>Parse.Collection</code>.  For example,<pre>
   *   var MyCollection = Parse.Collection.extend({
   *     // Instance properties
   *
   *     model: MyClass,
   *     query: MyQuery,
   *
   *     getFirst: function() {
   *       return this.at(0);
   *     }
   *   }, {
   *     // Class properties
   *
   *     makeOne: function() {
   *       return new MyCollection();
   *     }
   *   });
   *
   *   var collection = new MyCollection();
   * </pre>
   *
   * @function
   * @param {Object} instanceProps Instance properties for the collection.
   * @param {Object} classProps Class properies for the collection.
   * @return {Class} A new subclass of <code>Parse.Collection</code>.
   */
  Parse.Collection.extend = Parse._extend;

}(this));

/*global _: false, document: false */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creating a Parse.View creates its initial element outside of the DOM,
   * if an existing element is not provided...
   * @class
   *
   * <p>A fork of Backbone.View, provided for your convenience.  If you use this
   * class, you must also include jQuery, or another library that provides a
   * jQuery-compatible $ function.  For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#View">Backbone
   * documentation</a>.</p>
   * <p><strong><em>Available in the client SDK only.</em></strong></p>
   */
  Parse.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  // TODO: include objectId, createdAt, updatedAt?
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes',
                     'className', 'tagName'];

  // Set up all inheritable **Parse.View** properties and methods.
  _.extend(Parse.View.prototype, Parse.Events,
           /** @lends Parse.View.prototype */ {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    /**
     * jQuery delegate for element lookup, scoped to DOM elements within the
     * current view. This should be prefered to global lookups where possible.
     */
    $: function(selector) {
      return this.$el.find(selector);
    },

    /**
     * Initialize is an empty function by default. Override it with your own
     * initialization logic.
     */
    initialize: function(){},

    /**
     * The core function that your view should override, in order
     * to populate its element (`this.el`), with the appropriate HTML. The
     * convention is for **render** to always return `this`.
     */
    render: function() {
      return this;
    },

    /**
     * Remove this view from the DOM. Note that the view isn't present in the
     * DOM by default, so calling this method may be a no-op.
     */
    remove: function() {
      this.$el.remove();
      return this;
    },

    /**
     * For small amounts of DOM Elements, where a full-blown template isn't
     * needed, use **make** to manufacture elements, one at a time.
     * <pre>
     *     var el = this.make('li', {'class': 'row'},
     *                        this.model.escape('title'));</pre>
     */
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) {
        Parse.$(el).attr(attributes);
      }
      if (content) {
        Parse.$(el).html(content);
      }
      return el;
    },

    /**
     * Changes the view's element (`this.el` property), including event
     * re-delegation.
     */
    setElement: function(element, delegate) {
      this.$el = Parse.$(element);
      this.el = this.$el[0];
      if (delegate !== false) {
        this.delegateEvents();
      }
      return this;
    },

    /**
     * Set callbacks.  <code>this.events</code> is a hash of
     * <pre>
     * *{"event selector": "callback"}*
     *
     *     {
     *       'mousedown .title':  'edit',
     *       'click .button':     'save'
     *       'click .open':       function(e) { ... }
     *     }
     * </pre>
     * pairs. Callbacks will be bound to the view, with `this` set properly.
     * Uses event delegation for efficiency.
     * Omitting the selector binds the event to `this.el`.
     * This only works for delegate-able events: not `focus`, `blur`, and
     * not `change`, `submit`, and `reset` in Internet Explorer.
     */
    delegateEvents: function(events) {
      events = events || Parse._getValue(this, 'events');
      if (!events) {
        return;
      }
      this.undelegateEvents();
      var self = this;
      Parse._objectEach(events, function(method, key) {
        if (!_.isFunction(method)) {
          method = self[events[key]];
        }
        if (!method) {
          throw new Error('Event "' + events[key] + '" does not exist');
        }
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, self);
        eventName += '.delegateEvents' + self.cid;
        if (selector === '') {
          self.$el.bind(eventName, method);
        } else {
          self.$el.delegate(selector, eventName, method);
        }
      });
    },

    /**
     * Clears all callbacks previously bound to the view with `delegateEvents`.
     * You usually don't need to use this, but may wish to if you have multiple
     * Backbone views attached to the same DOM element.
     */
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    /**
     * Performs the initial configuration of a View with a set of options.
     * Keys with special meaning *(model, collection, id, className)*, are
     * attached directly to the view.
     */
    _configure: function(options) {
      if (this.options) {
        options = _.extend({}, this.options, options);
      }
      var self = this;
      _.each(viewOptions, function(attr) {
        if (options[attr]) {
          self[attr] = options[attr];
        }
      });
      this.options = options;
    },

    /**
     * Ensure that the View has a DOM element to render into.
     * If `this.el` is a string, pass it through `$()`, take the first
     * matching element, and re-assign it to `el`. Otherwise, create
     * an element from the `id`, `className` and `tagName` properties.
     */
    _ensureElement: function() {
      if (!this.el) {
        var attrs = Parse._getValue(this, 'attributes') || {};
        if (this.id) {
          attrs.id = this.id;
        }
        if (this.className) {
          attrs['class'] = this.className;
        }
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  /**
   * @function
   * @param {Object} instanceProps Instance properties for the view.
   * @param {Object} classProps Class properies for the view.
   * @return {Class} A new subclass of <code>Parse.View</code>.
   */
  Parse.View.extend = Parse._extend;

}(this));

(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * @class
   *
   * <p>A Parse.User object is a local representation of a user persisted to the
   * Parse cloud. This class is a subclass of a Parse.Object, and retains the
   * same functionality of a Parse.Object, but also extends it with various
   * user specific methods, like authentication, signing up, and validation of
   * uniqueness.</p>
   */
  Parse.User = Parse.Object.extend("_User", /** @lends Parse.User.prototype */ {
    // Instance Variables
    _isCurrentUser: false,


    // Instance Methods
    
    /**
     * Merges another object's attributes into this object.
     */
    _mergeFromObject: function(other) {
      if (other.getSessionToken()) {
        this._sessionToken = other.getSessionToken();      
      }    
      Parse.User.__super__._mergeFromObject.call(this, other);
    },    

    /**
     * Internal method to handle special fields in a _User response.
     */
    _mergeMagicFields: function(attrs) {
      if (attrs.sessionToken) {
        this._sessionToken = attrs.sessionToken;
        delete attrs.sessionToken;
      }
      Parse.User.__super__._mergeMagicFields.call(this, attrs);
    },

    /**
     * Removes null values from authData (which exist temporarily for
     * unlinking)
     */
    _cleanupAuthData: function() {
      if (!this.isCurrent()) {
        return;
      }
      var authData = this.get('authData');
      if (!authData) {
        return;
      }
      Parse._objectEach(this.get('authData'), function(value, key) {
        if (!authData[key]) {
          delete authData[key];
        }
      });
    },

    /**
     * Synchronizes authData for all providers.
     */
    _synchronizeAllAuthData: function() {
      var authData = this.get('authData');
      if (!authData) {
        return;
      }

      var self = this;
      Parse._objectEach(this.get('authData'), function(value, key) {
        self._synchronizeAuthData(key);
      });
    },

    /**
     * Synchronizes auth data for a provider (e.g. puts the access token in the
     * right place to be used by the Facebook SDK).
     */
    _synchronizeAuthData: function(provider) {
      if (!this.isCurrent()) {
        return;
      }
      var authType;
      if (_.isString(provider)) {
        authType = provider;
        provider = Parse.User._authProviders[authType];
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData');
      if (!authData || !provider) {
        return;
      }
      var success = provider.restoreAuthentication(authData[authType]);
      if (!success) {
        this._unlinkFrom(provider);
      }
    },

    _handleSaveResult: function(makeCurrent) {
      // Clean up and synchronize the authData object, removing any unset values
      if (makeCurrent) {
        this._isCurrentUser = true;
      }
      this._cleanupAuthData();
      this._synchronizeAllAuthData();
      // Don't keep the password around.
      delete this._serverData.password;
      this._rebuildEstimatedDataForKey("password");
      this._refreshCache();
      if (makeCurrent || this.isCurrent()) {
        Parse.User._saveCurrentUser(this);
      }
    },

    /**
     * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
     * call linkWith on the user (even if it doesn't exist yet on the server).
     */
    _linkWith: function(provider, options) {
      var authType;
      if (_.isString(provider)) {
        authType = provider;
        provider = Parse.User._authProviders[provider];
      } else {
        authType = provider.getAuthType();
      }
      if (_.has(options, 'authData')) {
        var authData = this.get('authData') || {};
        authData[authType] = options.authData;
        this.set('authData', authData);

        // Overridden so that the user can be made the current user.
        var newOptions = _.clone(options) || {};
        newOptions.success = function(model) {
          model._handleSaveResult(true);
          if (options.success) {
            options.success.apply(this, arguments);
          }
        };
        return this.save({'authData': authData}, newOptions);
      } else {
        var self = this;
        var promise = new Parse.Promise();
        provider.authenticate({
          success: function(provider, result) {
            self._linkWith(provider, {
              authData: result,
              success: options.success,
              error: options.error
            }).then(function() {
              promise.resolve(self);
            });
          },
          error: function(provider, error) {
            if (options.error) {
              options.error(self, error);
            }
            promise.reject(error);
          }
        });
        return promise;
      }
    },

    /**
     * Unlinks a user from a service.
     */
    _unlinkFrom: function(provider, options) {
      var authType;
      if (_.isString(provider)) {
        authType = provider;
        provider = Parse.User._authProviders[provider];
      } else {
        authType = provider.getAuthType();
      }
      var newOptions = _.clone(options);
      var self = this;
      newOptions.authData = null;
      newOptions.success = function(model) {
        self._synchronizeAuthData(provider);
        if (options.success) {
          options.success.apply(this, arguments);
        }
      };
      return this._linkWith(provider, newOptions);
    },

    /**
     * Checks whether a user is linked to a service.
     */
    _isLinked: function(provider) {
      var authType;
      if (_.isString(provider)) {
        authType = provider;
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData') || {};
      return !!authData[authType];
    },

    /**
     * Deauthenticates all providers.
     */
    _logOutWithAll: function() {
      var authData = this.get('authData');
      if (!authData) {
        return;
      }
      var self = this;
      Parse._objectEach(this.get('authData'), function(value, key) {
        self._logOutWith(key);
      });
    },

    /**
     * Deauthenticates a single provider (e.g. removing access tokens from the
     * Facebook SDK).
     */
    _logOutWith: function(provider) {
      if (!this.isCurrent()) {
        return;
      }
      if (_.isString(provider)) {
        provider = Parse.User._authProviders[provider];
      }
      if (provider && provider.deauthenticate) {
        provider.deauthenticate();
      }
    },

    /**
     * Signs up a new user. You should call this instead of save for
     * new Parse.Users. This will create a new Parse.User on the server, and
     * also persist the session on disk so that you can access the user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling signUp.</p>
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @param {Object} attrs Extra fields to set on the new user, or null.
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is fulfilled when the signup
     *     finishes.
     * @see Parse.User.signUp
     */
    signUp: function(attrs, options) {
      var error;
      options = options || {};

      var username = (attrs && attrs.username) || this.get("username");
      if (!username || (username === "")) {
        error = new Parse.Error(
            Parse.Error.OTHER_CAUSE,
            "Cannot sign up user with an empty name.");
        if (options && options.error) {
          options.error(this, error);
        }
        return Parse.Promise.error(error);
      }

      var password = (attrs && attrs.password) || this.get("password");
      if (!password || (password === "")) {
        error = new Parse.Error(
            Parse.Error.OTHER_CAUSE,
            "Cannot sign up user with an empty password.");
        if (options && options.error) {
          options.error(this, error);
        }
        return Parse.Promise.error(error);
      }

      // Overridden so that the user can be made the current user.
      var newOptions = _.clone(options);
      newOptions.success = function(model) {
        model._handleSaveResult(true);
        if (options.success) {
          options.success.apply(this, arguments);
        }
      };
      return this.save(attrs, newOptions);
    },

    /**
     * Logs in a Parse.User. On success, this saves the session to localStorage,
     * so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling logIn.</p>
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @param {Object} options A Backbone-style options object.
     * @see Parse.User.logIn
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the login is complete.
     */
    logIn: function(options) {
      var model = this;
      options = options || {};
      var request = Parse._request({
        route: "login",
        method: "GET",
        useMasterKey: options.useMasterKey,
        data: this.toJSON()
      });
      return request.then(function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, status, xhr);
        model._finishFetch(serverAttrs);
        model._handleSaveResult(true);
        return model;
      })._thenRunCallbacks(options, this);
    },

    /**
     * @see Parse.Object#save
     */
    save: function(arg1, arg2, arg3) {
      var i, attrs, current, options, saved;
      if (_.isObject(arg1) || _.isNull(arg1) || _.isUndefined(arg1)) {
        attrs = arg1;
        options = arg2;
      } else {
        attrs = {};
        attrs[arg1] = arg2;
        options = arg3;
      }
      options = options || {};

      var newOptions = _.clone(options);
      newOptions.success = function(model) {
        model._handleSaveResult(false);
        if (options.success) {
          options.success.apply(this, arguments);
        }
      };
      return Parse.Object.prototype.save.call(this, attrs, newOptions);
    },

    /**
     * @see Parse.Object#fetch
     */
    fetch: function(options) {
      var newOptions = options ? _.clone(options) : {};
      newOptions.success = function(model) {
        model._handleSaveResult(false);
        if (options && options.success) {
          options.success.apply(this, arguments);
        }
      };
      return Parse.Object.prototype.fetch.call(this, newOptions);
    },

    /**
     * Returns true if <code>current</code> would return this user.
     * @see Parse.User#current
     */
    isCurrent: function() {
      return this._isCurrentUser;
    },

    /**
     * Returns get("username").
     * @return {String}
     * @see Parse.Object#get
     */
    getUsername: function() {
      return this.get("username");
    },

    /**
     * Calls set("username", username, options) and returns the result.
     * @param {String} username
     * @param {Object} options A Backbone-style options object.
     * @return {Boolean}
     * @see Parse.Object.set
     */
    setUsername: function(username, options) {
      return this.set("username", username, options);
    },

    /**
     * Calls set("password", password, options) and returns the result.
     * @param {String} password
     * @param {Object} options A Backbone-style options object.
     * @return {Boolean}
     * @see Parse.Object.set
     */
    setPassword: function(password, options) {
      return this.set("password", password, options);
    },

    /**
     * Returns get("email").
     * @return {String}
     * @see Parse.Object#get
     */
    getEmail: function() {
      return this.get("email");
    },

    /**
     * Calls set("email", email, options) and returns the result.
     * @param {String} email
     * @param {Object} options A Backbone-style options object.
     * @return {Boolean}
     * @see Parse.Object.set
     */
    setEmail: function(email, options) {
      return this.set("email", email, options);
    },

    /**
     * Checks whether this user is the current user and has been authenticated.
     * @return (Boolean) whether this user is the current user and is logged in.
     */
    authenticated: function() {
      return !!this._sessionToken &&
          (Parse.User.current() && Parse.User.current().id === this.id);
    },

    /**
     * Returns the session token for this user, if the user has been logged in,
     * or if it is the result of a query with the master key. Otherwise, returns
     * undefined.
     * @return {String} the session token, or undefined
     */
    getSessionToken: function() {
      return this._sessionToken;
    },

    /**
     * Request a revocable session token to replace the older style of token.
     * @param {Object} options A Backbone-style options object.
     *
     * @return {Parse.Promise} A promise that is resolved when the replacement
     *   token has been fetched.
     */
    _upgradeToRevocableSession: function(options) {
      options = options || {};
      if (!Parse.User.current()) {
        return Parse.Promise.as()._thenRunCallbacks(options);
      }
      var currentSession = Parse.User.current().getSessionToken();
      if (Parse.Session._isRevocable(currentSession)) {
        return Parse.Promise.as()._thenRunCallbacks(options);
      }
      return Parse._request({
        route: 'upgradeToRevocableSession',
        method: 'POST',
        useMasterKey: options.useMasterKey,
        sessionToken: currentSession
      }).then(function(result) {
        var session = new Parse.Session();
        session._finishFetch(result);
        var currentUser = Parse.User.current();
        currentUser._sessionToken = session.getSessionToken();
        Parse.User._saveCurrentUser(currentUser);
      })._thenRunCallbacks(options);
    },

  }, /** @lends Parse.User */ {
    // Class Variables

    // The currently logged-in user.
    _currentUser: null,

    // Whether currentUser is known to match the serialized version on disk.
    // This is useful for saving a localstorage check if you try to load
    // _currentUser frequently while there is none stored.
    _currentUserMatchesDisk: false,

    // The localStorage key suffix that the current user is stored under.
    _CURRENT_USER_KEY: "currentUser",

    // The mapping of auth provider names to actual providers
    _authProviders: {},

    // Whether to rewrite className User to _User
    _performUserRewrite: true,

    // Whether to send a Revocable Session header
    _isRevocableSessionEnabled: false,


    // Class Methods

    /**
     * Signs up a new user with a username (or email) and password.
     * This will create a new Parse.User on the server, and also persist the
     * session in localStorage so that you can access the user using
     * {@link #current}.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @param {String} username The username (or email) to sign up with.
     * @param {String} password The password to sign up with.
     * @param {Object} attrs Extra fields to set on the new user.
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the signup completes.
     * @see Parse.User#signUp
     */
    signUp: function(username, password, attrs, options) {
      attrs = attrs || {};
      attrs.username = username;
      attrs.password = password;
      var user = Parse.Object._create("_User");
      return user.signUp(attrs, options);
    },

    /**
     * Logs in a user with a username (or email) and password. On success, this
     * saves the session to disk, so you can retrieve the currently logged in
     * user using <code>current</code>.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @param {String} username The username (or email) to log in with.
     * @param {String} password The password to log in with.
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the login completes.
     * @see Parse.User#logIn
     */
    logIn: function(username, password, options) {
      var user = Parse.Object._create("_User");
      user._finishFetch({ username: username, password: password });
      return user.logIn(options);
    },

    /**
     * Logs in a user with a session token. On success, this saves the session
     * to disk, so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @param {String} sessionToken The sessionToken to log in with.
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */
    become: function(sessionToken, options) {
      options = options || {};

      var user = Parse.Object._create("_User");
      return Parse._request({
        route: "users",
        className: "me",
        method: "GET",
        useMasterKey: options.useMasterKey,
        sessionToken: sessionToken
      }).then(function(resp, status, xhr) {
        var serverAttrs = user.parse(resp, status, xhr);
        user._finishFetch(serverAttrs);
        user._handleSaveResult(true);
        return user;

      })._thenRunCallbacks(options, user);
    },

    /**
     * Logs out the currently logged in user session. This will remove the
     * session from disk, log out of linked services, and future calls to
     * <code>current</code> will return <code>null</code>.
     * @return {Parse.Promise} A promise that is resolved when the session is
     *   destroyed on the server.
     */
    logOut: function() {
      return Parse.User._currentAsync().then(function(currentUser) {
        var promise = Parse.Storage.removeItemAsync(
          Parse._getParsePath(Parse.User._CURRENT_USER_KEY));

        if (currentUser !== null) {
          var currentSession = currentUser.getSessionToken();
          if (Parse.Session._isRevocable(currentSession)) {
            promise.then(function() {
              return Parse._request({
                route: 'logout',
                method: 'POST',
                sessionToken: currentSession
              });
            });
          }
          currentUser._logOutWithAll();
          currentUser._isCurrentUser = false;
        }
        Parse.User._currentUserMatchesDisk = true;
        Parse.User._currentUser = null;

        return promise;
      });
    },

    /**
     * Requests a password reset email to be sent to the specified email address
     * associated with the user account. This email allows the user to securely
     * reset their password on the Parse site.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @param {String} email The email address associated with the user that
     *     forgot their password.
     * @param {Object} options A Backbone-style options object.
     */
    requestPasswordReset: function(email, options) {
      options = options || {};
      var request = Parse._request({
        route: "requestPasswordReset",
        method: "POST",
        useMasterKey: options.useMasterKey,
        data: { email: email }
      });
      return request._thenRunCallbacks(options);
    },

    /**
     * Retrieves the currently logged in ParseUser with a valid session,
     * either from memory or localStorage, if necessary.
     * @return {Parse.Object} The currently logged in Parse.User.
     */
    current: function() {
      if (Parse.Storage.async) {
        // We can't return the current user synchronously
        Parse.User._currentAsync();
        return Parse.User._currentUser;
      }
      
      if (Parse.User._currentUser) {
        return Parse.User._currentUser;
      }

      if (Parse.User._currentUserMatchesDisk) {
        // TODO: Lazily log in anonymous user.
        return Parse.User._currentUser;
      }

      // Load the user from local storage.
      Parse.User._currentUserMatchesDisk = true;

      var userData = Parse.Storage.getItem(Parse._getParsePath(
          Parse.User._CURRENT_USER_KEY));
      if (!userData) {
        // TODO: Lazily log in anonymous user.
        return null;
      }
      Parse.User._currentUser = Parse.Object._create("_User");
      Parse.User._currentUser._isCurrentUser = true;

      var json = JSON.parse(userData);
      Parse.User._currentUser.id = json._id;
      delete json._id;
      Parse.User._currentUser._sessionToken = json._sessionToken;
      delete json._sessionToken;
      Parse.User._currentUser._finishFetch(json);

      Parse.User._currentUser._synchronizeAllAuthData();
      Parse.User._currentUser._refreshCache();
      Parse.User._currentUser._opSetQueue = [{}];
      return Parse.User._currentUser;
    },

    /**
     * Retrieves the currently logged in ParseUser from asynchronous Storage.
     * @return {Parse.Promise} A Promise that is resolved with the currently
     *   logged in Parse User
     */
    _currentAsync: function() {
      if (Parse.User._currentUser) {
        return Parse.Promise.as(Parse.User._currentUser);
      }

      if (Parse.User._currentUserMatchesDisk) {
        return Parse.Promise.as(Parse.User._currentUser);
      }

      // Load the user from Storage
      return Parse.Storage.getItemAsync(Parse._getParsePath(
        Parse.User._CURRENT_USER_KEY)).then(function(userData) {
        if (!userData) {
          return null;
        }
        Parse.User._currentUser = Parse.Object._create("_User");
        Parse.User._currentUser._isCurrentUser = true;

        var json = JSON.parse(userData);
        Parse.User._currentUser.id = json._id;
        delete json._id;
        Parse.User._currentUser._sessionToken = json._sessionToken;
        delete json._sessionToken;
        Parse.User._currentUser._finishFetch(json);

        Parse.User._currentUser._synchronizeAllAuthData();
        Parse.User._currentUser._refreshCache();
        Parse.User._currentUser._opSetQueue = [{}];
        return Parse.User._currentUser;
      });
    },

    /**
     * Allow someone to define a custom User class without className
     * being rewritten to _User. The default behavior is to rewrite
     * User to _User for legacy reasons. This allows developers to
     * override that behavior.
     *
     * @param {Boolean} isAllowed Whether or not to allow custom User class
     */
    allowCustomUserClass: function(isAllowed) {
      this._performUserRewrite = !isAllowed;
    },

    /**
     * Allow a legacy application to start using revocable sessions. If the
     * current session token is not revocable, a request will be made for a new,
     * revocable session.
     * It is not necessary to call this method from cloud code unless you are
     * handling user signup or login from the server side. In a cloud code call,
     * this function will not attempt to upgrade the current token.
     * @param {Object} options A Backbone-style options object.
     *
     * @return {Parse.Promise} A promise that is resolved when the process has
     *   completed. If a replacement session token is requested, the promise
     *   will be resolved after a new token has been fetched.
     */
    enableRevocableSession: function(options) {
      options = options || {};
      Parse.User._isRevocableSessionEnabled = true;
      if (!Parse._isNode && Parse.User.current()) {
        return Parse.User.current()._upgradeToRevocableSession(options);
      }
      return Parse.Promise.as()._thenRunCallbacks(options);
    },

    /**
     * Persists a user as currentUser to localStorage, and into the singleton.
     */
    _saveCurrentUser: function(user) {
      if (Parse.User._currentUser !== null &&
          Parse.User._currentUser !== user) {
        Parse.User.logOut();
      }
      user._isCurrentUser = true;
      Parse.User._currentUser = user;
      Parse.User._currentUserMatchesDisk = true;

      var json = user.toJSON();
      json._id = user.id;
      json._sessionToken = user._sessionToken;
      if (Parse.Storage.async) {
        Parse.Storage.setItemAsync(
          Parse._getParsePath(Parse.User._CURRENT_USER_KEY),
          JSON.stringify(json));
      } else {
        Parse.Storage.setItem(
          Parse._getParsePath(Parse.User._CURRENT_USER_KEY),
          JSON.stringify(json));
      }
    },

    _registerAuthenticationProvider: function(provider) {
      Parse.User._authProviders[provider.getAuthType()] = provider;
      // Synchronize the current user with the auth provider.
      if (Parse.User.current()) {
        Parse.User.current()._synchronizeAuthData(provider.getAuthType());
      }
    },

    _logInWith: function(provider, options) {
      var user = Parse.Object._create("_User");
      return user._linkWith(provider, options);
    }

  });
}(this));


(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;

  /**
   * @class
   *
   * <p>A Parse.Session object is a local representation of a revocable session.
   * This class is a subclass of a Parse.Object, and retains the same
   * functionality of a Parse.Object.</p>
   */
  Parse.Session = Parse.Object.extend('_Session',
  /** @lends Parse.Session.prototype */
  {
    /**
     * Returns the session token string.
     * @return {String}
     */
    getSessionToken: function() {
      return this._sessionToken;
    },

    /**
     * Internal method to handle special fields in a _Session response.
     */
    _mergeMagicFields: function(attrs) {
      if (attrs.sessionToken) {
        this._sessionToken = attrs.sessionToken;
        delete attrs.sessionToken;
      }
      Parse.Session.__super__._mergeMagicFields.call(this, attrs);
    },
  }, /** @lends Parse.Session */ {

    // Throw an error when modifying these read-only fields
    readOnlyAttributes: {
      createdWith: true,
      expiresAt: true,
      installationId: true,
      restricted: true,
      sessionToken: true,
      user: true
    },

    /**
     * Retrieves the Session object for the currently logged in session.
     * @return {Parse.Promise} A promise that is resolved with the Parse.Session
     *   object after it has been fetched.
     */
    current: function(options) {
      options = options || {};

      var session = Parse.Object._create('_Session');
      var currentToken = Parse.User.current().getSessionToken();
      return Parse._request({
        route: 'sessions',
        className: 'me',
        method: 'GET',
        useMasterKey: options.useMasterKey,
        sessionToken: currentToken
      }).then(function(resp, status, xhr) {
        var serverAttrs = session.parse(resp, status, xhr);
        session._finishFetch(serverAttrs);
        return session;
      })._thenRunCallbacks(options, session);
    },

    /**
     * Determines whether a session token is revocable.
     * @return {Boolean}
     */
    _isRevocable: function(token) {
      return token.indexOf('r:') > -1;
    },

    /**
     * Determines whether the current session token is revocable.
     * This method is useful for migrating Express.js or Node.js web apps to
     * use revocable sessions. If you are migrating an app that uses the Parse
     * SDK in the browser only, please use Parse.User.enableRevocableSession()
     * instead, so that sessions can be automatically upgraded.
     * @return {Boolean}
     */
    isCurrentSessionRevocable: function() {
      if (Parse.User.current() !== null) {
        return Parse.Session._isRevocable(
          Parse.User.current().getSessionToken()
        );
      }
    }
  });
})(this);

// Parse.Query is a way to create a list of Parse.Objects.
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Creates a new parse Parse.Query for the given Parse.Object subclass.
   * @param objectClass -
   *   An instance of a subclass of Parse.Object, or a Parse className string.
   * @class
   *
   * <p>Parse.Query defines a query that is used to fetch Parse.Objects. The
   * most common use case is finding all objects that match a query through the
   * <code>find</code> method. For example, this sample code fetches all objects
   * of class <code>MyClass</code>. It calls a different function depending on
   * whether the fetch succeeded or not.
   * 
   * <pre>
   * var query = new Parse.Query(MyClass);
   * query.find({
   *   success: function(results) {
   *     // results is an array of Parse.Object.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of Parse.Error.
   *   }
   * });</pre></p>
   * 
   * <p>A Parse.Query can also be used to retrieve a single object whose id is
   * known, through the get method. For example, this sample code fetches an
   * object of class <code>MyClass</code> and id <code>myId</code>. It calls a
   * different function depending on whether the fetch succeeded or not.
   * 
   * <pre>
   * var query = new Parse.Query(MyClass);
   * query.get(myId, {
   *   success: function(object) {
   *     // object is an instance of Parse.Object.
   *   },
   *
   *   error: function(object, error) {
   *     // error is an instance of Parse.Error.
   *   }
   * });</pre></p>
   * 
   * <p>A Parse.Query can also be used to count the number of objects that match
   * the query without retrieving all of those objects. For example, this
   * sample code counts the number of objects of the class <code>MyClass</code>
   * <pre>
   * var query = new Parse.Query(MyClass);
   * query.count({
   *   success: function(number) {
   *     // There are number instances of MyClass.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of Parse.Error.
   *   }
   * });</pre></p>
   */
  Parse.Query = function(objectClass) {
    if (_.isString(objectClass)) {
      objectClass = Parse.Object._getSubclass(objectClass);
    }

    this.objectClass = objectClass;

    this.className = objectClass.prototype.className;

    this._where = {};
    this._include = [];
    this._limit = -1; // negative limit means, do not send a limit
    this._skip = 0;
    this._extraOptions = {};
  };

  /**
   * Constructs a Parse.Query that is the OR of the passed in queries.  For
   * example:
   * <pre>var compoundQuery = Parse.Query.or(query1, query2, query3);</pre>
   *
   * will create a compoundQuery that is an or of the query1, query2, and
   * query3.
   * @param {...Parse.Query} var_args The list of queries to OR.
   * @return {Parse.Query} The query that is the OR of the passed in queries.
   */
  Parse.Query.or = function() {
    var queries = _.toArray(arguments);
    var className = null;
    Parse._arrayEach(queries, function(q) {
      if (_.isNull(className)) {
        className = q.className;
      }

      if (className !== q.className) {
        throw "All queries must be for the same class";
      }
    });
    var query = new Parse.Query(className);
    query._orQuery(queries);
    return query;
  };

  Parse.Query.prototype = {
    /**
     * Constructs a Parse.Object whose id is already known by fetching data from
     * the server.  Either options.success or options.error is called when the
     * find completes.
     *
     * @param {String} objectId The id of the object to be fetched.
     * @param {Object} options A Backbone-style options object.
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     * </ul>
     */
    get: function(objectId, options) {
      var self = this;
      self.equalTo('objectId', objectId);

      var firstOptions = {};
      if (options && _.has(options, 'useMasterKey')) {
        firstOptions = { useMasterKey: options.useMasterKey };
      }

      return self.first(firstOptions).then(function(response) {
        if (response) {
          return response;
        }

        var errorObject = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND,
                                          "Object not found.");
        return Parse.Promise.error(errorObject);

      })._thenRunCallbacks(options, null);
    },

    /**
     * Returns a JSON representation of this query.
     * @return {Object} The JSON representation of the query.
     */
    toJSON: function() {
      var params = {
        where: this._where
      };

      if (this._include.length > 0) {
        params.include = this._include.join(",");
      }
      if (this._select) {
        params.keys = this._select.join(",");
      }
      if (this._limit >= 0) {
        params.limit = this._limit;
      }
      if (this._skip > 0) {
        params.skip = this._skip;
      }
      if (this._order !== undefined) {
        params.order = this._order.join(",");
      }

      Parse._objectEach(this._extraOptions, function(v, k) {
        params[k] = v;
      });

      return params;
    },

    /**
     * Retrieves a list of ParseObjects that satisfy this query.
     * Either options.success or options.error is called when the find
     * completes.
     *
     * @param {Object} options A Backbone-style options object. Valid options
     * are:<ul>
     *   <li>success: Function to call when the find completes successfully.
     *   <li>error: Function to call when the find fails.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     * </ul>
     *
     * @return {Parse.Promise} A promise that is resolved with the results when
     * the query completes.
     */
    find: function(options) {
      var self = this;
      options = options || {};

      var request = Parse._request({
        route: "classes",
        className: this.className,
        method: "GET",
        useMasterKey: options.useMasterKey,
        data: this.toJSON()
      });

      return request.then(function(response) {
        return _.map(response.results, function(json) {
          var obj;
          if (response.className) {
            obj = new Parse.Object(response.className);
          } else {
            obj = new self.objectClass();
          }
          obj._finishFetch(json, true);
          return obj;
        });
      })._thenRunCallbacks(options);
    },

    /**
     * Counts the number of objects that match this query.
     * Either options.success or options.error is called when the count
     * completes.
     *
     * @param {Object} options A Backbone-style options object. Valid options
     * are:<ul>
     *   <li>success: Function to call when the count completes successfully.
     *   <li>error: Function to call when the find fails.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     * </ul>
     *
     * @return {Parse.Promise} A promise that is resolved with the count when
     * the query completes.
     */
    count: function(options) {
      var self = this;
      options = options || {};

      var params = this.toJSON();
      params.limit = 0;
      params.count = 1;
      var request = Parse._request({
        route: "classes",
        className: self.className, 
        method: "GET",
        useMasterKey: options.useMasterKey,
        data: params
      });

      return request.then(function(response) {
        return response.count;
      })._thenRunCallbacks(options);
    },

    /**
     * Retrieves at most one Parse.Object that satisfies this query.
     *
     * Either options.success or options.error is called when it completes.
     * success is passed the object if there is one. otherwise, undefined.
     *
     * @param {Object} options A Backbone-style options object. Valid options
     * are:<ul>
     *   <li>success: Function to call when the find completes successfully.
     *   <li>error: Function to call when the find fails.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     * </ul>
     *
     * @return {Parse.Promise} A promise that is resolved with the object when
     * the query completes.
     */
    first: function(options) {
      var self = this;
      options = options || {};

      var params = this.toJSON();
      params.limit = 1;
      var request = Parse._request({
        route: "classes",
        className: this.className, 
        method: "GET",
        useMasterKey: options.useMasterKey,
        data: params
      });

      return request.then(function(response) {
        return _.map(response.results, function(json) {
          var obj;
          if (response.className) {
            obj = new Parse.Object(response.className);
          } else {
            obj = new self.objectClass();
          }
          obj._finishFetch(json, true);
          return obj;
        })[0];
      })._thenRunCallbacks(options);
    },

    /**
     * Returns a new instance of Parse.Collection backed by this query.
     * @param {Array} items An array of instances of <code>Parse.Object</code>
     *     with which to start this Collection.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are:<ul>
     *   <li>model: The Parse.Object subclass that this collection contains.
     *   <li>query: An instance of Parse.Query to use when fetching items.
     *   <li>comparator: A string property name or function to sort by.
     * </ul>
     * @return {Parse.Collection}
     */
    collection: function(items, options) {
      options = options || {};
      return new Parse.Collection(items, _.extend(options, {
        model: this.objectClass,
        query: this
      }));
    },

    /**
     * Sets the number of results to skip before returning any results.
     * This is useful for pagination.
     * Default is to skip zero results.
     * @param {Number} n the number of results to skip.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    skip: function(n) {
      this._skip = n;
      return this;
    },

    /**
     * Sets the limit of the number of results to return. The default limit is
     * 100, with a maximum of 1000 results being returned at a time.
     * @param {Number} n the number of results to limit to.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    limit: function(n) {
      this._limit = n;
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that the Parse.Object must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    equalTo: function(key, value) {
      if (_.isUndefined(value)) {
        return this.doesNotExist(key);
      } 

      this._where[key] = Parse._encode(value);
      return this;
    },

    /**
     * Helper for condition queries
     */
    _addCondition: function(key, condition, value) {
      // Check if we already have a condition
      if (!this._where[key]) {
        this._where[key] = {};
      }
      this._where[key][condition] = Parse._encode(value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be not equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that must not be equalled.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    notEqualTo: function(key, value) {
      this._addCondition(key, "$ne", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be less than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    lessThan: function(key, value) {
      this._addCondition(key, "$lt", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be greater than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    greaterThan: function(key, value) {
      this._addCondition(key, "$gt", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be less than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    lessThanOrEqualTo: function(key, value) {
      this._addCondition(key, "$lte", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be greater than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    greaterThanOrEqualTo: function(key, value) {
      this._addCondition(key, "$gte", value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    containedIn: function(key, values) {
      this._addCondition(key, "$in", values);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * not be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    notContainedIn: function(key, values) {
      this._addCondition(key, "$nin", values);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * contain each one of the provided list of values.
     * @param {String} key The key to check.  This key's value must be an array.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    containsAll: function(key, values) {
      this._addCondition(key, "$all", values);
      return this;
    },


    /**
     * Add a constraint for finding objects that contain the given key.
     * @param {String} key The key that should exist.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    exists: function(key) {
      this._addCondition(key, "$exists", true);
      return this;
    },

    /**
     * Add a constraint for finding objects that do not contain a given key.
     * @param {String} key The key that should not exist
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    doesNotExist: function(key) {
      this._addCondition(key, "$exists", false);
      return this;
    },

    /**
     * Add a regular expression constraint for finding string values that match
     * the provided regular expression.
     * This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {RegExp} regex The regular expression pattern to match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    matches: function(key, regex, modifiers) {
      this._addCondition(key, "$regex", regex);
      if (!modifiers) { modifiers = ""; }
      // Javascript regex options support mig as inline options but store them 
      // as properties of the object. We support mi & should migrate them to
      // modifiers
      if (regex.ignoreCase) { modifiers += 'i'; }
      if (regex.multiline) { modifiers += 'm'; }

      if (modifiers && modifiers.length) {
        this._addCondition(key, "$options", modifiers);
      }
      return this;
    },

    /**
     * Add a constraint that requires that a key's value matches a Parse.Query
     * constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    matchesQuery: function(key, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$inQuery", queryJSON);
      return this;
    },

   /**
     * Add a constraint that requires that a key's value not matches a
     * Parse.Query constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    doesNotMatchQuery: function(key, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$notInQuery", queryJSON);
      return this;
    },


    /**
     * Add a constraint that requires that a key's value matches a value in
     * an object returned by a different Parse.Query.
     * @param {String} key The key that contains the value that is being
     *                     matched.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    matchesKeyInQuery: function(key, queryKey, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$select",
                         { key: queryKey, query: queryJSON });
      return this;
    },

    /**
     * Add a constraint that requires that a key's value not match a value in
     * an object returned by a different Parse.Query.
     * @param {String} key The key that contains the value that is being
     *                     excluded.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    doesNotMatchKeyInQuery: function(key, queryKey, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$dontSelect",
                         { key: queryKey, query: queryJSON });
      return this;
    },

    /**
     * Add constraint that at least one of the passed in queries matches.
     * @param {Array} queries
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    _orQuery: function(queries) {
      var queryJSON = _.map(queries, function(q) {
        return q.toJSON().where;
      });

      this._where.$or = queryJSON;
      return this;
    },

    /**
     * Converts a string into a regex that matches it.
     * Surrounding with \Q .. \E does this, we just need to escape \E's in
     * the text separately.
     */
    _quote: function(s) {
      return "\\Q" + s.replace("\\E", "\\E\\\\E\\Q") + "\\E";
    },

    /**
     * Add a constraint for finding string values that contain a provided
     * string.  This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} substring The substring that the value must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    contains: function(key, value) {
      this._addCondition(key, "$regex", this._quote(value));
      return this;
    },

    /**
     * Add a constraint for finding string values that start with a provided
     * string.  This query will use the backend index, so it will be fast even
     * for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} prefix The substring that the value must start with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    startsWith: function(key, value) {
      this._addCondition(key, "$regex", "^" + this._quote(value));
      return this;
    },

    /**
     * Add a constraint for finding string values that end with a provided
     * string.  This will be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} suffix The substring that the value must end with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    endsWith: function(key, value) {
      this._addCondition(key, "$regex", this._quote(value) + "$");
      return this;
    },

    /**
     * Sorts the results in ascending order by the given key.
     * 
     * @param {(String|String[]|...String} key The key to order by, which is a 
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    ascending: function() {
      this._order = [];
      return this.addAscending.apply(this, arguments);
    },

    /**
     * Sorts the results in ascending order by the given key, 
     * but can also add secondary sort descriptors without overwriting _order.
     * 
     * @param {(String|String[]|...String} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    addAscending: function(key) {
      var self = this; 
      if (!this._order) {
        this._order = [];
      }
      Parse._arrayEach(arguments, function(key) {
        if (Array.isArray(key)) {
          key = key.join();
        }
        self._order = self._order.concat(key.replace(/\s/g, "").split(","));
      });
      return this;
    },

    /**
     * Sorts the results in descending order by the given key.
     * 
     * @param {(String|String[]|...String} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    descending: function(key) {
      this._order = [];
      return this.addDescending.apply(this, arguments);
    },

    /**
     * Sorts the results in descending order by the given key,
     * but can also add secondary sort descriptors without overwriting _order.
     * 
     * @param {(String|String[]|...String} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    addDescending: function(key) {
      var self = this; 
      if (!this._order) {
        this._order = [];
      }
      Parse._arrayEach(arguments, function(key) {
        if (Array.isArray(key)) {
          key = key.join();
        }
        self._order = self._order.concat(
          _.map(key.replace(/\s/g, "").split(","), 
            function(k) { return "-" + k; }));
      });
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    near: function(key, point) {
      if (!(point instanceof Parse.GeoPoint)) {
        // Try to cast it to a GeoPoint, so that near("loc", [20,30]) works.
        point = new Parse.GeoPoint(point);
      }
      this._addCondition(key, "$nearSphere", point);
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in radians) of results to
     *   return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinRadians: function(key, point, distance) {
      this.near(key, point);
      this._addCondition(key, "$maxDistance", distance);
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 3958.8 miles.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in miles) of results to
     *     return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinMiles: function(key, point, distance) {
      return this.withinRadians(key, point, distance / 3958.8);
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 6371.0 kilometers.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in kilometers) of results
     *     to return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinKilometers: function(key, point, distance) {
      return this.withinRadians(key, point, distance / 6371.0);
    },

    /**
     * Add a constraint to the query that requires a particular key's
     * coordinates be contained within a given rectangular geographic bounding
     * box.
     * @param {String} key The key to be constrained.
     * @param {Parse.GeoPoint} southwest
     *     The lower-left inclusive corner of the box.
     * @param {Parse.GeoPoint} northeast
     *     The upper-right inclusive corner of the box.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    withinGeoBox: function(key, southwest, northeast) {
      if (!(southwest instanceof Parse.GeoPoint)) {
        southwest = new Parse.GeoPoint(southwest);
      }
      if (!(northeast instanceof Parse.GeoPoint)) {
        northeast = new Parse.GeoPoint(northeast);
      }
      this._addCondition(key, '$within', { '$box': [southwest, northeast] });
      return this;
    },

    /**
     * Include nested Parse.Objects for the provided key.  You can use dot
     * notation to specify which fields in the included object are also fetched.
     * @param {String} key The name of the key to include.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    include: function() {
      var self = this;
      Parse._arrayEach(arguments, function(key) {
        if (_.isArray(key)) {
          self._include = self._include.concat(key);
        } else {
          self._include.push(key);
        }
      });
      return this;
    },

    /**
     * Restrict the fields of the returned Parse.Objects to include only the
     * provided keys.  If this is called multiple times, then all of the keys
     * specified in each of the calls will be included.
     * @param {Array} keys The names of the keys to include.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    select: function() {
      var self = this;
      this._select = this._select || [];
      Parse._arrayEach(arguments, function(key) {
        if (_.isArray(key)) {
          self._select = self._select.concat(key);
        } else {
          self._select.push(key);
        }
      });
      return this;
    },

    /**
     * Iterates over each result of a query, calling a callback for each one. If
     * the callback returns a promise, the iteration will not continue until
     * that promise has been fulfilled. If the callback returns a rejected
     * promise, then iteration will stop with that error. The items are
     * processed in an unspecified order. The query may not have any sort order,
     * and may not use limit or skip.
     * @param {Function} callback Callback that will be called with each result
     *     of the query.
     * @param {Object} options An optional Backbone-like options object with
     *     success and error callbacks that will be invoked once the iteration
     *     has finished.
     * @return {Parse.Promise} A promise that will be fulfilled once the
     *     iteration has completed.
     */
    each: function(callback, options) {
      options = options || {};

      if (this._order || this._skip || (this._limit >= 0)) {
        var error =
          "Cannot iterate on a query with sort, skip, or limit.";
        return Parse.Promise.error(error)._thenRunCallbacks(options);
      }

      var promise = new Parse.Promise();

      var query = new Parse.Query(this.objectClass);
      // We can override the batch size from the options.
      // This is undocumented, but useful for testing.
      query._limit = options.batchSize || 100;
      query._where = _.clone(this._where);
      query._include = _.clone(this._include);
      if (this._select) {
        query._select = _.clone(this._select);
      }

      query.ascending('objectId');

      var findOptions = {};
      if (_.has(options, "useMasterKey")) {
        findOptions.useMasterKey = options.useMasterKey;
      }

      var finished = false;
      return Parse.Promise._continueWhile(function() {
        return !finished;

      }, function() {
        return query.find(findOptions).then(function(results) {
          var callbacksDone = Parse.Promise.as();
          Parse._.each(results, function(result) {
            callbacksDone = callbacksDone.then(function() {
              return callback(result);
            });
          });

          return callbacksDone.then(function() {
            if (results.length >= query._limit) {
              query.greaterThan("objectId", results[results.length - 1].id);
            } else {
              finished = true;
            }
          });
        });
      })._thenRunCallbacks(options);
    }
  };

}(this));

/*global FB: false , console: false*/
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  var PUBLIC_KEY = "*";

  var initialized = false;
  var requestedPermissions;
  var initOptions;
  var provider = {
    authenticate: function(options) {
      var self = this;
      FB.login(function(response) {
        if (response.authResponse) {
          if (options.success) {
            options.success(self, {
              id: response.authResponse.userID,
              access_token: response.authResponse.accessToken,
              expiration_date: new Date(response.authResponse.expiresIn * 1000 +
                  (new Date()).getTime()).toJSON()
            });
          }
        } else {
          if (options.error) {
            options.error(self, response);
          }
        }
      }, {
        scope: requestedPermissions
      });
    },
    restoreAuthentication: function(authData) {
      if (authData) {
        var authResponse = {
          userID: authData.id,
          accessToken: authData.access_token,
          expiresIn: (Parse._parseDate(authData.expiration_date).getTime() -
              (new Date()).getTime()) / 1000
        };
        var newOptions = _.clone(initOptions);
        newOptions.authResponse = authResponse;

        // Suppress checks for login status from the browser.
        newOptions.status = false;

        // If the user doesn't match the one known by the FB SDK, log out.
        // Most of the time, the users will match -- it's only in cases where
        // the FB SDK knows of a different user than the one being restored
        // from a Parse User that logged in with username/password.
        var existingResponse = FB.getAuthResponse();
        if (existingResponse &&
            existingResponse.userID !== authResponse.userID) {
          FB.logout();
        }

        FB.init(newOptions);
      }
      return true;
    },
    getAuthType: function() {
      return "facebook";
    },
    deauthenticate: function() {
      this.restoreAuthentication(null);
    }
  };

  /**
   * Provides a set of utilities for using Parse with Facebook.
   * @namespace
   * Provides a set of utilities for using Parse with Facebook.
   */
  Parse.FacebookUtils = {
    /**
     * Initializes Parse Facebook integration.  Call this function after you
     * have loaded the Facebook Javascript SDK with the same parameters
     * as you would pass to<code>
     * <a href=
     * "https://developers.facebook.com/docs/reference/javascript/FB.init/">
     * FB.init()</a></code>.  Parse.FacebookUtils will invoke FB.init() for you
     * with these arguments.
     *
     * @param {Object} options Facebook options argument as described here:
     *   <a href=
     *   "https://developers.facebook.com/docs/reference/javascript/FB.init/">
     *   FB.init()</a>. The status flag will be coerced to 'false' because it
     *   interferes with Parse Facebook integration. Call FB.getLoginStatus()
     *   explicitly if this behavior is required by your application.
     */
    init: function(options) {
      if (typeof(FB) === 'undefined') {
        throw "The Facebook JavaScript SDK must be loaded before calling init.";
      } 
      initOptions = _.clone(options) || {};
      if (initOptions.status && typeof(console) !== "undefined") {
        var warn = console.warn || console.log || function() {};
        warn.call(console, "The 'status' flag passed into" +
          " FB.init, when set to true, can interfere with Parse Facebook" +
          " integration, so it has been suppressed. Please call" +
          " FB.getLoginStatus() explicitly if you require this behavior.");
      }
      initOptions.status = false;
      FB.init(initOptions);
      Parse.User._registerAuthenticationProvider(provider);
      initialized = true;
    },

    /**
     * Gets whether the user has their account linked to Facebook.
     * 
     * @param {Parse.User} user User to check for a facebook link.
     *     The user must be logged in on this device.
     * @return {Boolean} <code>true</code> if the user has their account
     *     linked to Facebook.
     */
    isLinked: function(user) {
      return user._isLinked("facebook");
    },

    /**
     * Logs in a user using Facebook. This method delegates to the Facebook
     * SDK to authenticate the user, and then automatically logs in (or
     * creates, in the case where it is a new user) a Parse.User.
     * 
     * @param {String, Object} permissions The permissions required for Facebook
     *    log in.  This is a comma-separated string of permissions.
     *    Alternatively, supply a Facebook authData object as described in our
     *    REST API docs if you want to handle getting facebook auth tokens
     *    yourself.
     * @param {Object} options Standard options object with success and error
     *    callbacks.
     */
    logIn: function(permissions, options) {
      if (!permissions || _.isString(permissions)) {
        if (!initialized) {
          throw "You must initialize FacebookUtils before calling logIn.";
        }
        requestedPermissions = permissions;
        return Parse.User._logInWith("facebook", options);
      } else {
        var newOptions = _.clone(options) || {};
        newOptions.authData = permissions;
        return Parse.User._logInWith("facebook", newOptions);
      }
    },

    /**
     * Links Facebook to an existing PFUser. This method delegates to the
     * Facebook SDK to authenticate the user, and then automatically links
     * the account to the Parse.User.
     *
     * @param {Parse.User} user User to link to Facebook. This must be the
     *     current user.
     * @param {String, Object} permissions The permissions required for Facebook
     *    log in.  This is a comma-separated string of permissions. 
     *    Alternatively, supply a Facebook authData object as described in our
     *    REST API docs if you want to handle getting facebook auth tokens
     *    yourself.
     * @param {Object} options Standard options object with success and error
     *    callbacks.
     */
    link: function(user, permissions, options) {
      if (!permissions || _.isString(permissions)) {
        if (!initialized) {
          throw "You must initialize FacebookUtils before calling link.";
        }
        requestedPermissions = permissions;
        return user._linkWith("facebook", options);
      } else {
        var newOptions = _.clone(options) || {};
        newOptions.authData = permissions;
        return user._linkWith("facebook", newOptions);
      }
    },

    /**
     * Unlinks the Parse.User from a Facebook account. 
     * 
     * @param {Parse.User} user User to unlink from Facebook. This must be the
     *     current user.
     * @param {Object} options Standard options object with success and error
     *    callbacks.
     */
    unlink: function(user, options) {
      if (!initialized) {
        throw "You must initialize FacebookUtils before calling unlink.";
      }
      return user._unlinkFrom("facebook", options);
    }
  };
  
}(this));

/*global _: false, document: false, window: false, navigator: false */
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * History serves as a global router (per frame) to handle hashchange
   * events or pushState, match the appropriate route, and trigger
   * callbacks. You shouldn't ever have to create one of these yourself
   * — you should use the reference to <code>Parse.history</code>
   * that will be created for you automatically if you make use of 
   * Routers with routes.
   * @class
   *   
   * <p>A fork of Backbone.History, provided for your convenience.  If you 
   * use this class, you must also include jQuery, or another library 
   * that provides a jQuery-compatible $ function.  For more information,
   * see the <a href="http://documentcloud.github.com/backbone/#History">
   * Backbone documentation</a>.</p>
   * <p><strong><em>Available in the client SDK only.</em></strong></p>
   */
  Parse.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  Parse.History.started = false;

  // Set up all inheritable **Parse.History** properties and methods.
  _.extend(Parse.History.prototype, Parse.Events,
           /** @lends Parse.History.prototype */ {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (Parse._isNullOrUndefined(fragment)) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) {
            fragment += search;
          }
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) {
        fragment = fragment.substr(this.options.root.length);
      }
      return fragment.replace(routeStripper, '');
    },

    /**
     * Start the hash change handling, returning `true` if the current
     * URL matches an existing route, and `false` otherwise.
     */
    start: function(options) {
      if (Parse.History.started) {
        throw new Error("Parse.history has already been started");
      }
      Parse.History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState = !!this.options.pushState;
      this._hasPushState = !!(this.options.pushState && 
                              window.history &&
                              window.history.pushState);
      var fragment = this.getFragment();
      var docMode = document.documentMode;
      var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) &&
                   (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = Parse.$('<iframe src="javascript:0" tabindex="-1" />')
                      .hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Parse.$(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange &&
                 ('onhashchange' in window) &&
                 !oldIE) {
        Parse.$(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = window.setInterval(this.checkUrl,
                                                    this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname === this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && 
          this._wantsPushState && 
          !this._hasPushState &&
          !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState &&
                 this._hasPushState && 
                 atRoot &&
                 loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title,
            loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Parse.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Parse.$(window).unbind('popstate', this.checkUrl)
                     .unbind('hashchange', this.checkUrl);
      window.clearInterval(this._checkUrlInterval);
      Parse.History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) {
        return false;
      }
      if (this.iframe) {
        this.navigate(current);
      }
      if (!this.loadUrl()) {
        this.loadUrl(this.getHash());
      }
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the
    // history.
    navigate: function(fragment, options) {
      if (!Parse.History.started) {
        return false;
      }
      if (!options || options === true) {
        options = {trigger: options};
      }
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment === frag) {
        return;
      }

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) !== 0) {
          frag = this.options.root + frag;
        }
        this.fragment = frag;
        var replaceOrPush = options.replace ? 'replaceState' : 'pushState';
        window.history[replaceOrPush]({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe &&
            (frag !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier
          // to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if (!options.replace) {
            this.iframe.document.open().close();
          }
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) {
        this.loadUrl(fragment);
      }
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var s = location.toString().replace(/(javascript:|#).*$/, '');
        location.replace(s + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });
}(this));

/*global _: false*/
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * Routers map faux-URLs to actions, and fire events when routes are
   * matched. Creating a new one sets its `routes` hash, if not set statically.
   * @class
   *
   * <p>A fork of Backbone.Router, provided for your convenience.
   * For more information, see the
   * <a href="http://documentcloud.github.com/backbone/#Router">Backbone
   * documentation</a>.</p>
   * <p><strong><em>Available in the client SDK only.</em></strong></p>
   */
  Parse.Router = function(options) {
    options = options || {};
    if (options.routes) {
      this.routes = options.routes;
    }
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-\[\]{}()+?.,\\\^\$\|#\s]/g;

  // Set up all inheritable **Parse.Router** properties and methods.
  _.extend(Parse.Router.prototype, Parse.Events,
           /** @lends Parse.Router.prototype */ {

    /**
     * Initialize is an empty function by default. Override it with your own
     * initialization logic.
     */
    initialize: function(){},

    /**
     * Manually bind a single named route to a callback. For example:
     *
     * <pre>this.route('search/:query/p:num', 'search', function(query, num) {
     *       ...
     *     });</pre>
     */
    route: function(route, name, callback) {
      Parse.history = Parse.history || new Parse.History();
      if (!_.isRegExp(route)) {
        route = this._routeToRegExp(route);
      } 
      if (!callback) {
        callback = this[name];
      }
      Parse.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        if (callback) {
          callback.apply(this, args);
        }
        this.trigger.apply(this, ['route:' + name].concat(args));
        Parse.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    /**
     * Whenever you reach a point in your application that you'd
     * like to save as a URL, call navigate in order to update the
     * URL. If you wish to also call the route function, set the 
     * trigger option to true. To update the URL without creating
     * an entry in the browser's history, set the replace option
     * to true.
     */
    navigate: function(fragment, options) {
      Parse.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Parse.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) { 
        return;
      }
      var routes = [];
      for (var route in this.routes) {
        if (this.routes.hasOwnProperty(route)) {
          routes.unshift([route, this.routes[route]]);
        }
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }
  });

  /**
   * @function
   * @param {Object} instanceProps Instance properties for the router.
   * @param {Object} classProps Class properies for the router.
   * @return {Class} A new subclass of <code>Parse.Router</code>.
   */
  Parse.Router.extend = Parse._extend;
}(this));
(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;
  var _ = Parse._;

  /**
   * @namespace Contains functions for calling and declaring
   * <a href="/docs/cloud_code_guide#functions">cloud functions</a>.
   * <p><strong><em>
   *   Some functions are only available from Cloud Code.
   * </em></strong></p>
   */
  Parse.Cloud = Parse.Cloud || {};

  _.extend(Parse.Cloud, /** @lends Parse.Cloud */ {
    /**
     * Makes a call to a cloud function.
     * @param {String} name The function name.
     * @param {Object} data The parameters to send to the cloud function.
     * @param {Object} options A Backbone-style options object
     * options.success, if set, should be a function to handle a successful
     * call to a cloud function.  options.error should be a function that
     * handles an error running the cloud function.  Both functions are
     * optional.  Both functions take a single argument.
     * @return {Parse.Promise} A promise that will be resolved with the result
     * of the function.
     */
    run: function(name, data, options) {
      options = options || {};

      var request = Parse._request({
        route: "functions",
        className: name,
        method: 'POST',
        useMasterKey: options.useMasterKey,
        data: Parse._encode(data, null, true)
      });

      return request.then(function(resp) {
        return Parse._decode(null, resp).result;
      })._thenRunCallbacks(options);
    }
  });
}(this));

(function(root) {
  root.Parse = root.Parse || {};
  var Parse = root.Parse;

  Parse.Installation = Parse.Object.extend("_Installation");

  /**
   * Contains functions to deal with Push in Parse
   * @name Parse.Push
   * @namespace
   */
  Parse.Push = Parse.Push || {};

  /**
   * Sends a push notification.
   * @param {Object} data -  The data of the push notification.  Valid fields
   * are:
   *   <ol>
   *     <li>channels - An Array of channels to push to.</li>
   *     <li>push_time - A Date object for when to send the push.</li>
   *     <li>expiration_time -  A Date object for when to expire
   *         the push.</li>
   *     <li>expiration_interval - The seconds from now to expire the push.</li>
   *     <li>where - A Parse.Query over Parse.Installation that is used to match
   *         a set of installations to push to.</li>
   *     <li>data - The data to send as part of the push</li>
   *   <ol>
   * @param {Object} options An object that has an optional success function,
   * that takes no arguments and will be called on a successful push, and
   * an error function that takes a Parse.Error and will be called if the push
   * failed.
   * @return {Parse.Promise} A promise that is fulfilled when the push request
   *     completes.
   */
  Parse.Push.send = function(data, options) {
    options = options || {};

    if (data.where) {
      data.where = data.where.toJSON().where;
    }

    if (data.push_time) {
      data.push_time = data.push_time.toJSON();
    }

    if (data.expiration_time) {
      data.expiration_time = data.expiration_time.toJSON();
    }

    if (data.expiration_time && data.expiration_interval) {
      throw "Both expiration_time and expiration_interval can't be set";
    }

    var request = Parse._request({
      route: 'push',
      method: 'POST',
      data: data,
      useMasterKey: options.useMasterKey
    });
    return request._thenRunCallbacks(options);
  };
}(this));

}).call(this,require('_process'))

},{"_process":"/Users/surian/Sites/Private/timeboxer/node_modules/browserify/node_modules/process/browser.js"}],"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js":[function(require,module,exports){
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

},{}],"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js":[function(require,module,exports){
var Dispatcher = require('flux-riot').Dispatcher;

var ActionTypes = require('../constants/timeboxer_constants.js').ActionTypes;

var dispatch = function(type, data) {
  return Dispatcher.handleViewAction({
    type: type,
    data: data
  });
};

module.exports = {
  saveTemplate: function(task) {
    console.log(task);
    return dispatch(ActionTypes.TEMPLATE_SAVE, task);
  },
  removeTemplate: function(index) {
    return dispatch(ActionTypes.TEMPLATE_REMOVE, index);
  },
  serverDataReceived: function (data) {
    console.log('serverDataReceived', data);
    return dispatch(ActionTypes.SERVER_FETCH_COMPLETE, data);
  }
};

},{"../constants/timeboxer_constants.js":"/Users/surian/Sites/Private/timeboxer/src/js/constants/timeboxer_constants.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/about.tag":[function(require,module,exports){
var riot = require('riot');
var flux_riot = require('flux-riot')

riot.tag('timeboxer-about', '<h3>{ opts.title }</h3> <div class="row"> <div class="col-md-4"> <img src="http://www.pixentral.com/pics/1DvZ0bKKRrbGgepFMejkpUP1Kcwsz.gif" /> </div> <div class="col-md-8"> <ul> <li>Ray Hausmann</li> <li>Jay</li> <li>Dinks</li> </ul> </div> </div>', function(opts) {


});

},{"flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/contact.tag":[function(require,module,exports){
var riot = require('riot');
var flux_riot = require('flux-riot')

riot.tag('timeboxer-contact', '<h3>{ opts.title }</h3> <a href="http://www.babbel.com/">babbel.com</a>', function(opts) {


});

},{"flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/index.tag":[function(require,module,exports){
var riot = require('riot');
require('./timeboxer_template/index.tag')

var flux_riot = require('flux-riot')

riot.tag('timeboxer-index', '<h3>{ opts.title }</h3> <timeboxer-template-index store="{ opts.store }"></timeboxer-template-index>', function(opts) {


});

},{"./timeboxer_template/index.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/index.tag","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_meeting/start.tag":[function(require,module,exports){
var riot = require('riot');
var timeboxer = require('../../actions/timeboxer.js')
var flux_riot = require('flux-riot')

riot.tag('timeboxer-meeting-start', '<h3>{ this.template.name }</h3> <hr> <div class="row"> <div class="col-md-8"> <h3 class="agenda-name">{ this.currentAgenda.name }</h3> <div id="timingClock"></div> <div class="progress" id="progressbar"> <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"> </div> </div> <div class="row"> <div class="col-md-6"> <a href="#" onclick="{ startOrPause }" class="btn btn-block btn-success"> <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> <span id="agendaContinue">Start</span> </a> </div> <div class="col-md-6"> <a href="#" onclick="{ nextAgenda }" class="btn btn-block btn-info" id="nextAgendaBtn"> <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span> Next </a> </div> </div> </div> <div class="col-md-4"> <ul class="list-group"> <li class="list-group-item" each="{ item, index in this.template.agenda }"> <input type="checkbox" id="{ \'agendaItem\'+ index }" disabled> <b>{ item.name }</b> <span class="badge">{ item.time } minutes</span> </li> </ul> </div> </div> <div class="modal fade" id="allDone"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Notice</h4> </div> <div class="modal-body"> <p>Great Job finishing the meeting!!</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div> </div> </div> </div>', function(opts) {

  this.currentAgendaIndex = 0;
  this.currentAgendaTime = 1;

  this.setCurrentAgenda = function() {
    if(this.template) {
      this.currentAgenda = this.template.agenda[this.currentAgendaIndex];
      if (this.currentAgenda) {
        this.currentAgendaTime = parseFloat(this.currentAgenda.time) * 60;
        this.timerClock.setTime(this.currentAgendaTime);
      } else {
        $(this.allDone).modal();
      }
    }
  }.bind(this);

  this.getTemplateFromStore = function() {
    this.template = opts.template_store.getAll()[opts.templateId];
  }.bind(this);

  this.nextAgenda = function() {
    this.resetStatus();
    $('#agendaItem'+this.currentAgendaIndex).prop('checked', true);
    this.currentAgendaIndex++;
    this.setCurrentAgenda();
  }.bind(this);

  this.initClock = function() {
    this.timerClock = $(this.timingClock).FlipClock({
      autoStart: false,
      countdown: true,
      clockFace: 'MinuteCounter',
      callbacks: {
        interval: function() {
          var t = this.timerClock.getTime();
          var percent = (t*100)/this.currentAgendaTime;
          var extraClass = '';

          if (percent <= 20) {
            extraClass = 'progress-bar-warning';
          }

          if (percent <= 10) {
            extraClass = 'progress-bar-danger';
          }

          $(this.progressbar).find('.progress-bar').css({
            width: percent + '%'
          }).addClass(extraClass);

          if(t <= 0) {
            $(this.nextAgendaBtn).click();
          }
        }.bind(this)
      }
    });
  }.bind(this);

  this.updateFromStore = function() {
    this.getTemplateFromStore()
    this.setCurrentAgenda()
    this.update()
  }.bind(this);

  this.startOrPause = function() {
    switch(this.currentAgendaStatus) {
      case 'paused':
        this.timerClock.start();
        this.currentAgendaStatus = 'started';
        $(this.agendaContinue).html('Pause');
        break;
      case 'started':
        this.timerClock.stop();
        this.currentAgendaStatus = 'paused';
        $(this.agendaContinue).html('Start');
        break;
    }
  }.bind(this);

  this.resetStatus = function() {
    this.timerClock.stop();
    this.currentAgendaStatus = 'paused';
    $(this.agendaContinue).html('Start');

    $(this.progressbar).find('.progress-bar').
    css({
      width: '100%'
    }).
    removeClass('progress-bar-warning').
    removeClass('progress-bar-danger');
  }.bind(this);

  flux_riot.storeMixin(this, opts.template_store, this.updateFromStore);

  this.getTemplateFromStore();
  this.initClock();
  this.resetStatus();
  this.setCurrentAgenda();


});

},{"../../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/add.tag":[function(require,module,exports){
var riot = require('riot');
var timeboxer = require('../../actions/timeboxer.js');
var flux_riot = require('flux-riot');
var TimeBoxer = require('../../actions/timeboxer.js');

riot.tag('timeboxer-template-add', '<h3>{ opts.title }</h3> <hr> <form> <div class="form-group"> <label for="templateName">Event Template Name</label> <input type="text" class="form-control" id="templateName" placeholder="Enter Template Name" onkeyup="{ editTitle }"> </div> <div class="form-group"> <label>Agenda</label> <ul class="list-group"> <li class="list-group-item" each="{ item in agendaItems }"> <b>{ item.name }</b> for <b>{ item.time }</b> minutes </li> </ul> </div> </form> <form class="form-inline" onsubmit="{ addAgenda }"> <div class="form-group"> <label class="sr-only" for="agendaTitle">Item Title</label> <input type="text" class="form-control" id="agendaTitle" placeholder="Enter Agenda Item Title" onkeyup="{ editAgendaTitle }"> </div> <div class="form-group"> <label class="sr-only" for="agendaTime">Item Time</label> <input type="text" class="form-control" id="agendaTime" placeholder="Enter Agenda Item Time" onkeyup="{ editAgendaTime }"> </div> <button type="submit" __disabled="{ !(agendaTitleValue && agendaTimeValue) }" class="btn btn-default">Add Agenda Item</button> </form> <hr> <a href="#" onclick="{ saveTemplate }" class="btn btn-success"> <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Create </a> <a href="#" onclick="{ cancel }" class="btn btn-info"> <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span> Cancel </a>', function(opts) {

  this.title = '';

  this.agendaItems = [];

  this.addAgenda = function() {
    if (this.agendaTitleValue && this.agendaTimeValue) {
      this.agendaItems.push({
        name: this.agendaTitleValue,
        time: this.agendaTimeValue
      });
      this.agendaTitleValue = this.agendaTimeValue = this.agendaTime.value = this.agendaTitle.value = '';
    }
  }.bind(this);

  this.editTitle = function(e) {
    this.title = e.target.value;
  }.bind(this);

  this.editAgendaTitle = function(e) {
    this.agendaTitleValue = e.target.value;
  }.bind(this);

  this.editAgendaTime = function(e) {
    this.agendaTimeValue = e.target.value;
  }.bind(this);

  this.saveTemplate = function() {
    TimeBoxer.saveTemplate({
      name: this.title,
      agenda: this.agendaItems
    });
  }.bind(this);

  this.updateFromStore = function() {
    riot.route('#');
  }.bind(this);
  this.cancel = function() {
    riot.route('#');
  }.bind(this);

  flux_riot.storeMixin(this, opts.store, this.updateFromStore)


});

},{"../../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/edit.tag":[function(require,module,exports){
var riot = require('riot');

},{"riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/index.tag":[function(require,module,exports){
var riot = require('riot');
var timeboxer = require('../../actions/timeboxer.js')
var flux_riot = require('flux-riot')

var ServerApiUtils = require('../../utils/ServerApiUtils.js');
ServerApiUtils.getAll();

riot.tag('timeboxer-template-index', '<h3>{ opts.title }</h3> <table class="table table-hover"> <tr> <th>Template</th> <th>Actions</th> </tr> <tr each="{ item in this.items }"> <td><h4>{ item.name }</h4></td> <td> <a href="#" onclick="{ parent.startMeeting }" class="btn btn-primary"> <span class="glyphicon glyphicon-time" aria-hidden="true"></span> Start a Meeting </a> <a href="#" class="btn btn-primary"> <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit </a> <a href="#" onclick="{ parent.removeMeeting }" class="btn btn-primary"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Remove </a> </td> </tr> </table> <a href="#" onclick="{ add }" class="btn btn-primary"> <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add New Template </a>', function(opts) {

  this.add = function() {
    riot.route('templates/add')
  }.bind(this);

  this.getDataFromStore = function() {
    this.items = this.store.getAll()
  }.bind(this);

  this.updateFromStore = function() {
    this.getDataFromStore()
    this.update()
  }.bind(this);

  this.startMeeting = function(event) {
    var index = this.items.indexOf(event.item.item);
    riot.route('meeting/start/' + index);
  }.bind(this);

  this.removeMeeting = function(event) {
    var index = this.items.indexOf(event.item.item);
    timeboxer.removeTemplate(index);
  }.bind(this);

  flux_riot.storeMixin(this, opts.store, this.updateFromStore)

  this.getDataFromStore()


});

},{"../../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","../../utils/ServerApiUtils.js":"/Users/surian/Sites/Private/timeboxer/src/js/utils/ServerApiUtils.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/constants/timeboxer_constants.js":[function(require,module,exports){
var keymirror = require('keymirror');

module.exports = {
  ActionTypes: keymirror({
    TEMPLATE_SAVE: null,
    TEMPLATE_REMOVE: null,

    SERVER_FETCH_COMPLETE: null
  })
};

},{"keymirror":"/Users/surian/Sites/Private/timeboxer/node_modules/keymirror/index.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/presenters/timeboxer_presenter.js":[function(require,module,exports){
var riot = require('riot/riot');
var timeboxer_template_store = require('../stores/timeboxer_template_store.js');

require('../components/index.tag');
require('../components/timeboxer_template/add.tag');
require('../components/timeboxer_template/edit.tag');
require('../components/timeboxer_meeting/start.tag');

require('../components/contact.tag');
require('../components/about.tag');

var app_tag = null;

var unmount = function() {
  if (app_tag) {
    return app_tag.unmount();
  }
};

var mount = function(tag, opts) {
  var app_container;
  app_container = document.createElement("div");
  app_container.id = 'app-container';
  document.getElementById('container').appendChild(app_container);
  return riot.mount('#app-container', tag, opts)[0];
};

module.exports = {
  index: function() {
    unmount();
    return app_tag = mount('timeboxer-index', {
      title: "Templates",
      store: timeboxer_template_store
    });
  },

  template_add: function() {
    unmount();

    return app_tag = mount('timeboxer-template-add', {
      title: "Add Timeboxer Event Template",
      store: timeboxer_template_store
    });
  },

  template_edit: function(id) {
    unmount();
    return app_tag = mount('timeboxer-template-edit', {
      title: "Edit Timeboxer Event Template",
      templateId: id,
      store: timeboxer_template_store
    });
  },

  meeting_start: function(id) {
    unmount();
    return app_tag = mount('timeboxer-meeting-start', {
      title: "Start a Meeting",
      templateId: id,
      template_store: timeboxer_template_store
    });
  },

  about: function() {
    unmount();
    return app_tag = mount('timeboxer-about', {
      title: "About Us"
    });
  },

  contact: function() {
    unmount();
    return app_tag = mount('timeboxer-contact', {
      title: "Contact Us"
    });
  }
};

},{"../components/about.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/about.tag","../components/contact.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/contact.tag","../components/index.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/index.tag","../components/timeboxer_meeting/start.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_meeting/start.tag","../components/timeboxer_template/add.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/add.tag","../components/timeboxer_template/edit.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/edit.tag","../stores/timeboxer_template_store.js":"/Users/surian/Sites/Private/timeboxer/src/js/stores/timeboxer_template_store.js","riot/riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/routers/timeboxer_routes.js":[function(require,module,exports){
var riot = require('riot/riot');
var BaseRouter = require('flux-riot').BaseRouter;
var timeboxer_presenter = require('../presenters/timeboxer_presenter.js');

BaseRouter.routes(timeboxer_presenter.index,
  'templates/add', timeboxer_presenter.template_add,
  'templates/edit/:id', timeboxer_presenter.template_edit,
  'meeting/start/:id', timeboxer_presenter.meeting_start,
  'about', timeboxer_presenter.about,
  'contact', timeboxer_presenter.contact
);

module.exports = {
  start: BaseRouter.start
};

},{"../presenters/timeboxer_presenter.js":"/Users/surian/Sites/Private/timeboxer/src/js/presenters/timeboxer_presenter.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot/riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/stores/timeboxer_template_store.js":[function(require,module,exports){
var assign = require('object-assign');
var Dispatcher = require('flux-riot').Dispatcher;
var ActionTypes = require('../constants/timeboxer_constants.js').ActionTypes;
var flux_riot = require('flux-riot');
var serverUtil = require('../utils/serverApiUtils.js');

var _templates = [];

var getTemplates = function () {
  return _templates;
};
var addTemplates = function (data) {
  _templates.push(data);
};
var saveTemplates = function (obj) {
  _templates = obj;
};
var removeTemplate = function (index) {
  _templates.splice(index, 1);
};

TimeboxerTemplateStore = assign(new flux_riot.BaseStore(), {
  getAll: function () {
    return getTemplates();
  },
  saveAll: function () {

  },
  getByIndex: function (index) {
    return _templates[index];
  },
  dispatchToken: Dispatcher.register(function(payload) {
    var action, data, index, task;
    action = payload.action;
    switch (action.type) {
      case ActionTypes.SERVER_FETCH_COMPLETE:
        saveTemplates(action.data);
        TimeboxerTemplateStore.emitChange();
      break;
      case ActionTypes.TEMPLATE_SAVE:
        addTemplates(action.data);
        serverUtil.saveTemplate(action.data);
        TimeboxerTemplateStore.emitChange();
      break;
      case ActionTypes.TEMPLATE_REMOVE:
        serverUtil.destroyTemplate(_templates[action.data]);
        removeTemplate(action.data);
        TimeboxerTemplateStore.emitChange();
      break;
    }
  })
});

module.exports = TimeboxerTemplateStore;

},{"../constants/timeboxer_constants.js":"/Users/surian/Sites/Private/timeboxer/src/js/constants/timeboxer_constants.js","../utils/serverApiUtils.js":"/Users/surian/Sites/Private/timeboxer/src/js/utils/serverApiUtils.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","object-assign":"/Users/surian/Sites/Private/timeboxer/node_modules/object-assign/index.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/utils/ServerApiUtils.js":[function(require,module,exports){
var Parse = require('parse').Parse;
var TimeBoxer = require('../actions/timeboxer.js');
var storage = require('./localStorage.js');

function ServerApiUtils() {
  this.init = function() {
    Parse.initialize("PEdVTpEnHxhjwXHMjkStSlAMU75xq7TKxMut60BD",
      "vhbx9wTQMwM0821NgzMs0xq2SxHMzBbYdZMZWg1x");
    this.boxerClass = Parse.Object.extend("Hackday2");
    this.query = new Parse.Query(this.boxerClass);
    this.boxerObj = new this.boxerClass();
  };
  this.getAll = function () {
    this.boxerObj.fetch({
      success: function(results) {
        console.log(results);
        TimeBoxer.serverDataReceived(results.toJSON().results);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
  this.saveTemplate = function (data) {
    this.boxerObj.save(data);
  };
  this.destroyTemplate = function (data) {
    this.query.get(data.objectId, {
      success: function (result) {
        result.destroy({
          success: function () {
            console.log('destroyed');
          }
        });
      }
    })
  };
  this.init();
};

module.exports = new ServerApiUtils();

},{"../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","./localStorage.js":"/Users/surian/Sites/Private/timeboxer/src/js/utils/localStorage.js","parse":"/Users/surian/Sites/Private/timeboxer/node_modules/parse/build/parse-latest.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/utils/localStorage.js":[function(require,module,exports){
function Storage () {

  this.dataStore = null;

  function init () {
    if (!localStorage.sprintTask) {
      localStorage.sprintTask = '[]';
    }
    this.dataStore = getFromLocalStorage();
  }

  function retrieve () {
    return getFromLocalStorage();
  }

  function save (data) {
    saveToLocalStorage(data);
  }

  function remove (index) {
    this.dataStore[index] = {};
    saveToLocalStorage(this.dataStore);
  }

  function saveToLocalStorage (data) {
    localStorage.sprintTask = JSON.stringify(data);
  }

  function getFromLocalStorage () {
    var data = JSON.parse(localStorage.sprintTask);
    return data;
  }

  function reset () {
    delete localStorage.sprintTask;
    this.init();
  }

  this.init = init;
  this.retrieve = retrieve;
  this.save = save;
  this.remove = remove;
  this.reset = reset;

  this.getFromLocalStorage = getFromLocalStorage;
  this.saveToLocalStorage = saveToLocalStorage;
}
var storage = new Storage();
storage.init();
module.exports = storage;

},{}],"/Users/surian/Sites/Private/timeboxer/src/js/utils/serverApiUtils.js":[function(require,module,exports){
arguments[4]["/Users/surian/Sites/Private/timeboxer/src/js/utils/ServerApiUtils.js"][0].apply(exports,arguments)
},{"../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","./localStorage.js":"/Users/surian/Sites/Private/timeboxer/src/js/utils/localStorage.js","parse":"/Users/surian/Sites/Private/timeboxer/node_modules/parse/build/parse-latest.js"}]},{},["./src/js/index.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3VyaWFuL1NpdGVzL1ByaXZhdGUvdGltZWJveGVyL3NyYy9qcy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgtcmlvdC9mbHV4LXJpb3QuanMiLCJub2RlX21vZHVsZXMvZmx1eC1yaW90L25vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgtcmlvdC9ub2RlX21vZHVsZXMvZmx1eC9saWIvRGlzcGF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4LXJpb3Qvbm9kZV9tb2R1bGVzL2ZsdXgvbGliL2ludmFyaWFudC5qcyIsIm5vZGVfbW9kdWxlcy9rZXltaXJyb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS9idWlsZC9wYXJzZS1sYXRlc3QuanMiLCJub2RlX21vZHVsZXMvcmlvdC9yaW90LmpzIiwic3JjL2pzL2FjdGlvbnMvdGltZWJveGVyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWJvdXQudGFnIiwic3JjL2pzL2NvbXBvbmVudHMvY29udGFjdC50YWciLCJzcmMvanMvY29tcG9uZW50cy9pbmRleC50YWciLCJzcmMvanMvY29tcG9uZW50cy90aW1lYm94ZXJfbWVldGluZy9zdGFydC50YWciLCJzcmMvanMvY29tcG9uZW50cy90aW1lYm94ZXJfdGVtcGxhdGUvYWRkLnRhZyIsInNyYy9qcy9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9lZGl0LnRhZyIsInNyYy9qcy9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9pbmRleC50YWciLCJzcmMvanMvY29uc3RhbnRzL3RpbWVib3hlcl9jb25zdGFudHMuanMiLCJzcmMvanMvcHJlc2VudGVycy90aW1lYm94ZXJfcHJlc2VudGVyLmpzIiwic3JjL2pzL3JvdXRlcnMvdGltZWJveGVyX3JvdXRlcy5qcyIsInNyYy9qcy9zdG9yZXMvdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlLmpzIiwic3JjL2pzL3V0aWxzL1NlcnZlckFwaVV0aWxzLmpzIiwic3JjL2pzL3V0aWxzL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsZ0JBQUE7O0FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFTLCtCQUFULENBQW5CLENBQUE7O0FBQUEsZ0JBQ2dCLENBQUMsS0FBakIsQ0FBQSxDQURBLENBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInRpbWVib3hlcl9yb3V0ZXMgPSByZXF1aXJlICcuL3JvdXRlcnMvdGltZWJveGVyX3JvdXRlcy5qcydcbnRpbWVib3hlcl9yb3V0ZXMuc3RhcnQoKVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIjsoZnVuY3Rpb24oKSB7XG5cbnZhciByaW90ID0gcmVxdWlyZSgncmlvdC9yaW90JylcbnZhciBmbHV4X3Jpb3QgPSB7IHZlcnNpb246ICcwLjIuMCcgfVxuXG4ndXNlIHN0cmljdCdcblxuZmx1eF9yaW90LkJhc2VTdG9yZSA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgQ0hBTkdFX0VWRU5UID0gJ1NUT1JFX0NIQU5HRV9FVkVOVCdcblxuICBmdW5jdGlvbiBCYXNlU3RvcmUoKSB7XG4gICAgcmlvdC5vYnNlcnZhYmxlKHRoaXMpXG4gIH1cblxuICBCYXNlU3RvcmUucHJvdG90eXBlID0ge1xuICAgIGFkZENoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKVxuICAgIH0sXG5cbiAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub2ZmKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spXG4gICAgfSxcblxuICAgIGVtaXRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cmlnZ2VyKENIQU5HRV9FVkVOVClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQmFzZVN0b3JlXG5cbn0pKClcblxuZmx1eF9yaW90LnN0b3JlTWl4aW4gPSBmdW5jdGlvbih0YWcsIHN0b3JlLCBjYWxsYmFjaykge1xuXG4gIHRhZy5zdG9yZSA9IHN0b3JlXG5cbiAgdGFnLm9uKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaylcbiAgfSlcblxuICB0YWcub24oJ3VubW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spXG4gIH0pXG5cbn1cblxuZmx1eF9yaW90LkJhc2VSb3V0ZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIHJlZ2V4RnVuY3MgPSBbXVxuXG4gIGZ1bmN0aW9uIHJlZ2V4VHJhbnNmZXIocGF0aCkge1xuICAgIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoJy8nKVxuICAgIHZhciByZWdleFBhcnRzID0gW11cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGFydCA9IHBhcnRzW2ldXG4gICAgICBpZiAoIShwYXJ0ICYmIHBhcnQubGVuZ3RoID4gMCkpIGNvbnRpbnVlXG5cbiAgICAgIGlmIChwYXJ0WzBdID09PSAnOicpIHtcbiAgICAgICAgcmVnZXhQYXJ0cy5wdXNoKCcoKD86KD8hXFxcXC8pLikrPyknKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnZXhQYXJ0cy5wdXNoKHBhcnQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBSZWdFeHAoXCJeXCIgKyAocmVnZXhQYXJ0cy5qb2luKCdcXFxcLycpKSArIFwiXFxcXC8/JFwiLCBcImlcIilcbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdXRlKHBhdGgpIHtcbiAgICBpZiAocmVnZXhGdW5jcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgaWYgKHBhdGggPT09ICcnKSByZXR1cm4gcmVnZXhGdW5jc1swXVsxXS5hcHBseShudWxsLCBbXSlcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcmVnZXhGdW5jcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlZ2V4RnVuYyA9IHJlZ2V4RnVuY3NbaV1cbiAgICAgIHZhciBtID0gcGF0aC5tYXRjaChyZWdleEZ1bmNbMF0pXG4gICAgICBpZiAobSAhPSBudWxsKSByZXR1cm4gcmVnZXhGdW5jWzFdLmFwcGx5KG51bGwsIG0uc2xpY2UoMSkpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcm91dGVzKCkge1xuICAgIGlmICghKGFyZ3VtZW50cy5sZW5ndGggPiAwKSkgcmV0dXJuXG5cbiAgICByZWdleEZ1bmNzLnB1c2goWyAnJywgYXJndW1lbnRzWzBdIF0pXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHJlZ2V4ID0gcmVnZXhUcmFuc2Zlcihhcmd1bWVudHNbaV0pXG4gICAgICByZWdleEZ1bmNzLnB1c2goWyByZWdleCwgYXJndW1lbnRzW2kgKyAxXSBdKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0KHIpIHtcbiAgICByZXR1cm4gcmlvdC5yb3V0ZS5leGVjKHIgfHwgcm91dGUpXG4gIH1cblxuICByaW90LnJvdXRlLnBhcnNlcihmdW5jdGlvbihwYXRoKSB7IHJldHVybiBbcGF0aF0gfSlcbiAgcmlvdC5yb3V0ZShyb3V0ZSlcblxuICByZXR1cm4ge1xuICAgIHJvdXRlczogcm91dGVzLFxuICAgIHN0YXJ0OiBzdGFydFxuICB9XG5cbn0pKClcblxuZmx1eF9yaW90LkNvbnN0YW50cyA9IHtcbiAgQWN0aW9uU291cmNlczoge1xuICAgIFNFUlZFUl9BQ1RJT046ICdTRVJWRVJfQUNUSU9OJyxcbiAgICBWSUVXX0FDVElPTjogJ1ZJRVdfQUNUSU9OJ1xuICB9XG59XG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXJcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxuZmx1eF9yaW90LkRpc3BhdGNoZXIgPSBhc3NpZ24obmV3IERpc3BhdGNoZXIoKSwge1xuICBoYW5kbGVTZXJ2ZXJBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZUFjdGlvbihhY3Rpb24sIGZsdXhfcmlvdC5Db25zdGFudHMuQWN0aW9uU291cmNlcy5TRVJWRVJfQUNUSU9OKVxuICB9LFxuXG4gIGhhbmRsZVZpZXdBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZUFjdGlvbihhY3Rpb24sIGZsdXhfcmlvdC5Db25zdGFudHMuQWN0aW9uU291cmNlcy5WSUVXX0FDVElPTilcbiAgfSxcblxuICBoYW5kbGVBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbiwgc291cmNlKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goe1xuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBhY3Rpb246IGFjdGlvblxuICAgIH0pXG4gIH1cbn0pXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmbHV4X3Jpb3RcblxufSkoKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMuRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vbGliL0Rpc3BhdGNoZXInKVxuIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBEaXNwYXRjaGVyXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NpdHktdXBkYXRlJykge1xuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBwYXlsb2FkLnNlbGVjdGVkQ2l0eTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGNvdW50cnksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NvdW50cnktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENvdW50cnk6ICdhdXN0cmFsaWEnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBib3RoIHN0b3JlczpcbiAqXG4gKiAgICBDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIENvdW50cnlTdG9yZS5jb3VudHJ5ID0gcGF5bG9hZC5zZWxlY3RlZENvdW50cnk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSBjYWxsYmFjayB0byB1cGRhdGUgYENvdW50cnlTdG9yZWAgaXMgcmVnaXN0ZXJlZCwgd2Ugc2F2ZSBhIHJlZmVyZW5jZVxuICogdG8gdGhlIHJldHVybmVkIHRva2VuLiBVc2luZyB0aGlzIHRva2VuIHdpdGggYHdhaXRGb3IoKWAsIHdlIGNhbiBndWFyYW50ZWVcbiAqIHRoYXQgYENvdW50cnlTdG9yZWAgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrIHRoYXQgdXBkYXRlcyBgQ2l0eVN0b3JlYFxuICogbmVlZHMgdG8gcXVlcnkgaXRzIGRhdGEuXG4gKlxuICogICBDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjb3VudHJ5LXVwZGF0ZScpIHtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgbWF5IG5vdCBiZSB1cGRhdGVkLlxuICogICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDb3VudHJ5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBpcyBub3cgZ3VhcmFudGVlZCB0byBiZSB1cGRhdGVkLlxuICpcbiAqICAgICAgIC8vIFNlbGVjdCB0aGUgZGVmYXVsdCBjaXR5IGZvciB0aGUgbmV3IGNvdW50cnlcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gZ2V0RGVmYXVsdENpdHlGb3JDb3VudHJ5KENvdW50cnlTdG9yZS5jb3VudHJ5KTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSB1c2FnZSBvZiBgd2FpdEZvcigpYCBjYW4gYmUgY2hhaW5lZCwgZm9yIGV4YW1wbGU6XG4gKlxuICogICBGbGlnaHRQcmljZVN0b3JlLmRpc3BhdGNoVG9rZW4gPVxuICogICAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAqICAgICAgICAgY2FzZSAnY291bnRyeS11cGRhdGUnOlxuICogICAgICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIGdldEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqXG4gKiAgICAgICAgIGNhc2UgJ2NpdHktdXBkYXRlJzpcbiAqICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlLnByaWNlID1cbiAqICAgICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUoQ291bnRyeVN0b3JlLmNvdW50cnksIENpdHlTdG9yZS5jaXR5KTtcbiAqICAgICAgICAgICBicmVhaztcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBgY291bnRyeS11cGRhdGVgIHBheWxvYWQgd2lsbCBiZSBndWFyYW50ZWVkIHRvIGludm9rZSB0aGUgc3RvcmVzJ1xuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MgaW4gb3JkZXI6IGBDb3VudHJ5U3RvcmVgLCBgQ2l0eVN0b3JlYCwgdGhlblxuICogYEZsaWdodFByaWNlU3RvcmVgLlxuICovXG5cbiAgZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWQgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdpdGggZXZlcnkgZGlzcGF0Y2hlZCBwYXlsb2FkLiBSZXR1cm5zXG4gICAqIGEgdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB3aXRoIGB3YWl0Rm9yKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3Rlcj1mdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IF9wcmVmaXggKyBfbGFzdElEKys7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgYmFzZWQgb24gaXRzIHRva2VuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnVucmVnaXN0ZXI9ZnVuY3Rpb24oaWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAnRGlzcGF0Y2hlci51bnJlZ2lzdGVyKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgaWRcbiAgICApO1xuICAgIGRlbGV0ZSB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF07XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgY2FsbGJhY2tzIHNwZWNpZmllZCB0byBiZSBpbnZva2VkIGJlZm9yZSBjb250aW51aW5nIGV4ZWN1dGlvblxuICAgKiBvZiB0aGUgY3VycmVudCBjYWxsYmFjay4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSBhIGNhbGxiYWNrIGluXG4gICAqIHJlc3BvbnNlIHRvIGEgZGlzcGF0Y2hlZCBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5PHN0cmluZz59IGlkc1xuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUud2FpdEZvcj1mdW5jdGlvbihpZHMpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nXG4gICAgKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIGlkID0gaWRzW2lpXTtcbiAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSxcbiAgICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgJyArXG4gICAgICAgICAgJ3dhaXRpbmcgZm9yIGAlc2AuJyxcbiAgICAgICAgICBpZFxuICAgICAgICApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChcbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgICAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLFxuICAgICAgICBpZFxuICAgICAgKTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBheWxvYWQgdG8gYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2g9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGludmFyaWFudChcbiAgICAgICF0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcsXG4gICAgICAnRGlzcGF0Y2guZGlzcGF0Y2goLi4uKTogQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nXG4gICAgKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZCk7XG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICh0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmcoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoaXMgRGlzcGF0Y2hlciBjdXJyZW50bHkgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5pc0Rpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhlIGNhbGxiYWNrIHN0b3JlZCB3aXRoIHRoZSBnaXZlbiBpZC4gQWxzbyBkbyBzb21lIGludGVybmFsXG4gICAqIGJvb2trZWVwaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjaz1mdW5jdGlvbihpZCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IHRydWU7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdKHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQpO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB1cCBib29ra2VlcGluZyBuZWVkZWQgd2hlbiBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gZmFsc2U7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgYm9va2tlZXBpbmcgdXNlZCBmb3IgZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nPWZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKGZhbHNlKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0IEZhY2Vib29rLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigna2V5TWlycm9yKC4uLik6IEFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICB9XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIga2V5cztcblx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBhcmd1bWVudHNbc107XG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyohXG4gKiBQYXJzZSBKYXZhU2NyaXB0IFNES1xuICogVmVyc2lvbjogMS40LjJcbiAqIEJ1aWx0OiBUaHUgQXByIDA5IDIwMTUgMTc6MjA6MzFcbiAqIGh0dHA6Ly9wYXJzZS5jb21cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNSBQYXJzZSwgSW5jLlxuICogVGhlIFBhcnNlIEphdmFTY3JpcHQgU0RLIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqXG4gKiBJbmNsdWRlczogVW5kZXJzY29yZS5qc1xuICogQ29weXJpZ2h0IDIwMDktMjAxMiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgSW5jLlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgcm9vdC5QYXJzZS5WRVJTSU9OID0gXCJqczEuNC4yXCI7XG59KHRoaXMpKTtcbi8vICAgICBVbmRlcnNjb3JlLmpzIDEuNC40XG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBJbmMuXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgb2JqZWN0IHRoYXQgZ2V0cyByZXR1cm5lZCB0byBicmVhayBvdXQgb2YgYSBsb29wIGl0ZXJhdGlvbi5cbiAgdmFyIGJyZWFrZXIgPSB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhciBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgICBjb25jYXQgICAgICAgICAgID0gQXJyYXlQcm90by5jb25jYXQsXG4gICAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgbmF0aXZlTWFwICAgICAgICAgID0gQXJyYXlQcm90by5tYXAsXG4gICAgbmF0aXZlUmVkdWNlICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2UsXG4gICAgbmF0aXZlUmVkdWNlUmlnaHQgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodCxcbiAgICBuYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbiAgICBuYXRpdmVFdmVyeSAgICAgICAgPSBBcnJheVByb3RvLmV2ZXJ5LFxuICAgIG5hdGl2ZVNvbWUgICAgICAgICA9IEFycmF5UHJvdG8uc29tZSxcbiAgICBuYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG4gICAgbmF0aXZlTGFzdEluZGV4T2YgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZixcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kO1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgXCJhZHZhbmNlZFwiIG1vZGUuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuNC40JztcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIG9iamVjdHMgd2l0aCB0aGUgYnVpbHQtaW4gYGZvckVhY2hgLCBhcnJheXMsIGFuZCByYXcgb2JqZWN0cy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZvckVhY2hgIGlmIGF2YWlsYWJsZS5cbiAgdmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm47XG4gICAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKF8uaGFzKG9iaiwga2V5KSkge1xuICAgICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdG9yIHRvIGVhY2ggZWxlbWVudC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYG1hcGAgaWYgYXZhaWxhYmxlLlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICB2YXIgcmVkdWNlRXJyb3IgPSAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZSc7XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlYCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlICYmIG9iai5yZWR1Y2UgPT09IG5hdGl2ZVJlZHVjZSkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZShpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlKGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSB2YWx1ZTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VSaWdodGAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZVJpZ2h0ICYmIG9iai5yZWR1Y2VSaWdodCA9PT0gbmF0aXZlUmVkdWNlUmlnaHQpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoICE9PSArbGVuZ3RoKSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGluZGV4ID0ga2V5cyA/IGtleXNbLS1sZW5ndGhdIDogLS1sZW5ndGg7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IG9ialtpbmRleF07XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgb2JqW2luZGV4XSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZmlsdGVyYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVGaWx0ZXIgJiYgb2JqLmZpbHRlciA9PT0gbmF0aXZlRmlsdGVyKSByZXR1cm4gb2JqLmZpbHRlcihpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiAhaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0sIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZXZlcnlgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yIHx8IChpdGVyYXRvciA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlRXZlcnkgJiYgb2JqLmV2ZXJ5ID09PSBuYXRpdmVFdmVyeSkgcmV0dXJuIG9iai5ldmVyeShpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCEocmVzdWx0ID0gcmVzdWx0ICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHNvbWVgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgdmFyIGFueSA9IF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yIHx8IChpdGVyYXRvciA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZVNvbWUgJiYgb2JqLnNvbWUgPT09IG5hdGl2ZVNvbWUpIHJldHVybiBvYmouc29tZShpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHJlc3VsdCB8fCAocmVzdWx0ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gdmFsdWUgKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIHRhcmdldCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIG9iai5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gb2JqLmluZGV4T2YodGFyZ2V0KSAhPSAtMTtcbiAgICByZXR1cm4gYW55KG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdGFyZ2V0O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF0pLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiB2YWx1ZVtrZXldOyB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzLCBmaXJzdCkge1xuICAgIGlmIChfLmlzRW1wdHkoYXR0cnMpKSByZXR1cm4gZmlyc3QgPyBudWxsIDogW107XG4gICAgcmV0dXJuIF9bZmlyc3QgPyAnZmluZCcgOiAnZmlsdGVyJ10ob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICAgIGlmIChhdHRyc1trZXldICE9PSB2YWx1ZVtrZXldKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLndoZXJlKG9iaiwgYXR0cnMsIHRydWUpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IG9yIChlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgLy8gQ2FuJ3Qgb3B0aW1pemUgYXJyYXlzIG9mIGludGVnZXJzIGxvbmdlciB0aGFuIDY1LDUzNSBlbGVtZW50cy5cbiAgLy8gU2VlOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODA3OTdcbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzRW1wdHkob2JqKSkgcmV0dXJuIC1JbmZpbml0eTtcbiAgICB2YXIgcmVzdWx0ID0ge2NvbXB1dGVkIDogLUluZmluaXR5LCB2YWx1ZTogLUluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPj0gcmVzdWx0LmNvbXB1dGVkICYmIChyZXN1bHQgPSB7dmFsdWUgOiB2YWx1ZSwgY29tcHV0ZWQgOiBjb21wdXRlZH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNFbXB0eShvYmopKSByZXR1cm4gSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IEluZmluaXR5LCB2YWx1ZTogSW5maW5pdHl9O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBjb21wdXRlZCA8IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYW4gYXJyYXkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByYW5kO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNodWZmbGVkID0gW107XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oaW5kZXgrKyk7XG4gICAgICBzaHVmZmxlZFtpbmRleCAtIDFdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBsb29rdXAgaXRlcmF0b3JzLlxuICB2YXIgbG9va3VwSXRlcmF0b3IgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUgOiBmdW5jdGlvbihvYmopeyByZXR1cm4gb2JqW3ZhbHVlXTsgfTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0b3IuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHZhciBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWUgOiB2YWx1ZSxcbiAgICAgICAgaW5kZXggOiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWEgOiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCA8IHJpZ2h0LmluZGV4ID8gLTEgOiAxO1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQsIGJlaGF2aW9yKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKHZhbHVlIHx8IF8uaWRlbnRpdHkpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIHZhciBrZXkgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgIGJlaGF2aW9yKHJlc3VsdCwga2V5LCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGdyb3VwKG9iaiwgdmFsdWUsIGNvbnRleHQsIGZ1bmN0aW9uKHJlc3VsdCwga2V5LCB2YWx1ZSkge1xuICAgICAgKF8uaGFzKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldIDogKHJlc3VsdFtrZXldID0gW10pKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBncm91cChvYmosIHZhbHVlLCBjb250ZXh0LCBmdW5jdGlvbihyZXN1bHQsIGtleSkge1xuICAgICAgaWYgKCFfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldID0gMDtcbiAgICAgIHJlc3VsdFtrZXldKys7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yID0gaXRlcmF0b3IgPT0gbnVsbCA/IF8uaWRlbnRpdHkgOiBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVttaWRdKSA8IHZhbHVlID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gU2FmZWx5IGNvbnZlcnQgYW55dGhpbmcgaXRlcmFibGUgaW50byBhIHJlYWwsIGxpdmUgYXJyYXkuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgcmV0dXJuIChuICE9IG51bGwpICYmICFndWFyZCA/IHNsaWNlLmNhbGwoYXJyYXksIDAsIG4pIDogYXJyYXlbMF07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aFxuICAvLyBgXy5tYXBgLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgYXJyYXkubGVuZ3RoIC0gKChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gIT0gbnVsbCkgJiYgIWd1YXJkKSB7XG4gICAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgTWF0aC5tYXgoYXJyYXkubGVuZ3RoIC0gbiwgMCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqXG4gIC8vIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgb3V0cHV0KSB7XG4gICAgZWFjaChpbnB1dCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHNoYWxsb3cgPyBwdXNoLmFwcGx5KG91dHB1dCwgdmFsdWUpIDogZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgb3V0cHV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvbXBsZXRlbHkgZmxhdHRlbmVkIHZlcnNpb24gb2YgYW4gYXJyYXkuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIFtdKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRvcjtcbiAgICAgIGl0ZXJhdG9yID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW5pdGlhbCA9IGl0ZXJhdG9yID8gXy5tYXAoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSA6IGFycmF5O1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBlYWNoKGluaXRpYWwsIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgaWYgKGlzU29ydGVkID8gKCFpbmRleCB8fCBzZWVuW3NlZW4ubGVuZ3RoIC0gMV0gIT09IHZhbHVlKSA6ICFfLmNvbnRhaW5zKHNlZW4sIHZhbHVlKSkge1xuICAgICAgICBzZWVuLnB1c2godmFsdWUpO1xuICAgICAgICByZXN1bHRzLnB1c2goYXJyYXlbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBhcmd1bWVudHMpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoXy51bmlxKGFycmF5KSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZXZlcnkocmVzdCwgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIF8uaW5kZXhPZihvdGhlciwgaXRlbSkgPj0gMDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpOyB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBsZW5ndGggPSBfLm1heChfLnBsdWNrKGFyZ3MsICdsZW5ndGgnKSk7XG4gICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRzW2ldID0gXy5wbHVjayhhcmdzLCBcIlwiICsgaSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICBpZiAobGlzdCA9PSBudWxsKSByZXR1cm4ge307XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBseSB1cyB3aXRoIGluZGV4T2YgKEknbSBsb29raW5nIGF0IHlvdSwgKipNU0lFKiopLFxuICAvLyB3ZSBuZWVkIHRoaXMgZnVuY3Rpb24uIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW5cbiAgLy8gaXRlbSBpbiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGkgPSAwLCBsID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpID0gKGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGwgKyBpc1NvcnRlZCkgOiBpc1NvcnRlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpXSA9PT0gaXRlbSA/IGkgOiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSwgaXNTb3J0ZWQpO1xuICAgIGZvciAoOyBpIDwgbDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbGFzdEluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaGFzSW5kZXggPSBmcm9tICE9IG51bGw7XG4gICAgaWYgKG5hdGl2ZUxhc3RJbmRleE9mICYmIGFycmF5Lmxhc3RJbmRleE9mID09PSBuYXRpdmVMYXN0SW5kZXhPZikge1xuICAgICAgcmV0dXJuIGhhc0luZGV4ID8gYXJyYXkubGFzdEluZGV4T2YoaXRlbSwgZnJvbSkgOiBhcnJheS5sYXN0SW5kZXhPZihpdGVtKTtcbiAgICB9XG4gICAgdmFyIGkgPSAoaGFzSW5kZXggPyBmcm9tIDogYXJyYXkubGVuZ3RoKTtcbiAgICB3aGlsZSAoaS0tKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gYXJndW1lbnRzWzJdIHx8IDE7XG5cbiAgICB2YXIgbGVuID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5nZSA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgd2hpbGUoaWR4IDwgbGVuKSB7XG4gICAgICByYW5nZVtpZHgrK10gPSBzdGFydDtcbiAgICAgIHN0YXJ0ICs9IHN0ZXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgaWYgKGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCAmJiBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQmluZCBhbGwgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0XG4gIC8vIGFsbCBjYWxsYmFja3MgZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgZnVuY3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMCkgZnVuY3MgPSBfLmZ1bmN0aW9ucyhvYmopO1xuICAgIGVhY2goZnVuY3MsIGZ1bmN0aW9uKGYpIHsgb2JqW2ZdID0gXy5iaW5kKG9ialtmXSwgb2JqKTsgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtbyA9IHt9O1xuICAgIGhhc2hlciB8fCAoaGFzaGVyID0gXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSA9IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIF8uaGFzKG1lbW8sIGtleSkgPyBtZW1vW2tleV0gOiAobWVtb1trZXldID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpOyB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gXy5kZWxheS5hcHBseShfLCBbZnVuYywgMV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgdGltZW91dCwgcmVzdWx0O1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG5ldyBEYXRlO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgcmVzdWx0O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9O1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciByYW4gPSBmYWxzZSwgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmFuKSByZXR1cm4gbWVtbztcbiAgICAgIHJhbiA9IHRydWU7XG4gICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IFtmdW5jXTtcbiAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB3cmFwcGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZ1bmNzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgZm9yICh2YXIgaSA9IGZ1bmNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFyZ3MgPSBbZnVuY3NbaV0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYWZ0ZXIgYmVpbmcgY2FsbGVkIE4gdGltZXMuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIGlmICh0aW1lcyA8PSAwKSByZXR1cm4gZnVuYygpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gbmF0aXZlS2V5cyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqICE9PSBPYmplY3Qob2JqKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvYmplY3QnKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXNba2V5cy5sZW5ndGhdID0ga2V5O1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgdmFsdWVzLnB1c2gob2JqW2tleV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcGFpcnMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBwYWlycy5wdXNoKFtrZXksIG9ialtrZXldXSk7XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmVzdWx0W29ialtrZXldXSA9IGtleTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBlYWNoKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGtleSBpbiBvYmopIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghXy5jb250YWlucyhrZXlzLCBrZXkpKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAob2JqW3Byb3BdID09IG51bGwpIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgSGFybW9ueSBgZWdhbGAgcHJvcG9zYWw6IGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbC5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3JcbiAgICAgICAgLy8gb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiBhICE9ICthID8gYiAhPSArYiA6IChhID09IDAgPyAxIC8gYSA9PSAxIC8gYiA6IGEgPT0gK2IpO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09ICtiO1xuICAgICAgLy8gUmVnRXhwcyBhcmUgY29tcGFyZWQgYnkgdGhlaXIgc291cmNlIHBhdHRlcm5zIGFuZCBmbGFncy5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAgIHJldHVybiBhLnNvdXJjZSA9PSBiLnNvdXJjZSAmJlxuICAgICAgICAgICAgICAgYS5nbG9iYWwgPT0gYi5nbG9iYWwgJiZcbiAgICAgICAgICAgICAgIGEubXVsdGlsaW5lID09IGIubXVsdGlsaW5lICYmXG4gICAgICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT0gYi5pZ25vcmVDYXNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT0gYjtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuICAgIHZhciBzaXplID0gMCwgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoY2xhc3NOYW1lID09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgc2l6ZSA9IGEubGVuZ3RoO1xuICAgICAgcmVzdWx0ID0gc2l6ZSA9PSBiLmxlbmd0aDtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgICAgd2hpbGUgKHNpemUtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGVxKGFbc2l6ZV0sIGJbc2l6ZV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3Rgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIChhQ3RvciBpbnN0YW5jZW9mIGFDdG9yKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgKGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhKSB7XG4gICAgICAgIGlmIChfLmhhcyhhLCBrZXkpKSB7XG4gICAgICAgICAgLy8gQ291bnQgdGhlIGV4cGVjdGVkIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgICAgIHNpemUrKztcbiAgICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXIuXG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBmb3IgKGtleSBpbiBiKSB7XG4gICAgICAgICAgaWYgKF8uaGFzKGIsIGtleSkgJiYgIShzaXplLS0pKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSAhc2l6ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIsIFtdLCBbXSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cC5cbiAgZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFKSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gISEob2JqICYmIF8uaGFzKG9iaiwgJ2NhbGxlZScpKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLlxuICBpZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRvcnMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkobik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICBlc2NhcGU6IHtcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAgICcvJzogJyYjeDJGOydcbiAgICB9XG4gIH07XG4gIGVudGl0eU1hcC51bmVzY2FwZSA9IF8uaW52ZXJ0KGVudGl0eU1hcC5lc2NhcGUpO1xuXG4gIC8vIFJlZ2V4ZXMgY29udGFpbmluZyB0aGUga2V5cyBhbmQgdmFsdWVzIGxpc3RlZCBpbW1lZGlhdGVseSBhYm92ZS5cbiAgdmFyIGVudGl0eVJlZ2V4ZXMgPSB7XG4gICAgZXNjYXBlOiAgIG5ldyBSZWdFeHAoJ1snICsgXy5rZXlzKGVudGl0eU1hcC5lc2NhcGUpLmpvaW4oJycpICsgJ10nLCAnZycpLFxuICAgIHVuZXNjYXBlOiBuZXcgUmVnRXhwKCcoJyArIF8ua2V5cyhlbnRpdHlNYXAudW5lc2NhcGUpLmpvaW4oJ3wnKSArICcpJywgJ2cnKVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgXy5lYWNoKFsnZXNjYXBlJywgJ3VuZXNjYXBlJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIF9bbWV0aG9kXSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgaWYgKHN0cmluZyA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gKCcnICsgc3RyaW5nKS5yZXBsYWNlKGVudGl0eVJlZ2V4ZXNbbWV0aG9kXSwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eU1hcFttZXRob2RdW21hdGNoXTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgcHJvcGVydHkgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdDtcbiAgLy8gb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSl7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx0JzogICAgICd0JyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx0fFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBkYXRhLCBzZXR0aW5ncykge1xuICAgIHZhciByZW5kZXI7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldClcbiAgICAgICAgLnJlcGxhY2UoZXNjYXBlciwgZnVuY3Rpb24obWF0Y2gpIHsgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdOyB9KTtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArIFwicmV0dXJuIF9fcDtcXG5cIjtcblxuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHJldHVybiByZW5kZXIoZGF0YSwgXyk7XG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbiBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyAoc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicpICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24sIHdoaWNoIHdpbGwgZGVsZWdhdGUgdG8gdGhlIHdyYXBwZXIuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXyhvYmopLmNoYWluKCk7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09ICdzaGlmdCcgfHwgbmFtZSA9PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIF8uZXh0ZW5kKF8ucHJvdG90eXBlLCB7XG5cbiAgICAvLyBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gICAgY2hhaW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2hhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICAgIH1cblxuICB9KTtcblxufSkuY2FsbCh0aGlzKTtcblxuLypnbG9iYWwgXzogZmFsc2UsICQ6IGZhbHNlLCBsb2NhbFN0b3JhZ2U6IGZhbHNlLCBwcm9jZXNzOiB0cnVlLFxuICBYTUxIdHRwUmVxdWVzdDogZmFsc2UsIFhEb21haW5SZXF1ZXN0OiBmYWxzZSwgZXhwb3J0czogZmFsc2UsXG4gIHJlcXVpcmU6IGZhbHNlLCBzZXRUaW1lb3V0OiB0cnVlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgLyoqXG4gICAqIENvbnRhaW5zIGFsbCBQYXJzZSBBUEkgY2xhc3NlcyBhbmQgZnVuY3Rpb25zLlxuICAgKiBAbmFtZSBQYXJzZVxuICAgKiBAbmFtZXNwYWNlXG4gICAqXG4gICAqIENvbnRhaW5zIGFsbCBQYXJzZSBBUEkgY2xhc3NlcyBhbmQgZnVuY3Rpb25zLlxuICAgKi9cbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcblxuICB2YXIgcmVxID0gdHlwZW9mKHJlcXVpcmUpID09PSAnZnVuY3Rpb24nID8gcmVxdWlyZSA6IG51bGw7XG4gIC8vIExvYWQgcmVmZXJlbmNlcyB0byBvdGhlciBkZXBlbmRlbmNpZXNcbiAgaWYgKHR5cGVvZihYTUxIdHRwUmVxdWVzdCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgUGFyc2UuWE1MSHR0cFJlcXVlc3QgPSBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIGlmICh0eXBlb2YocmVxdWlyZSkgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIHR5cGVvZihyZXF1aXJlLmVuc3VyZSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgUGFyc2UuWE1MSHR0cFJlcXVlc3QgPSByZXEoJ3htbGh0dHByZXF1ZXN0JykuWE1MSHR0cFJlcXVlc3Q7XG4gIH1cbiAgLy8gSW1wb3J0IFBhcnNlJ3MgbG9jYWwgY29weSBvZiB1bmRlcnNjb3JlLlxuICBpZiAodHlwZW9mKGV4cG9ydHMpICE9PSAndW5kZWZpbmVkJyAmJiBleHBvcnRzLl8pIHtcbiAgICAvLyBXZSdyZSBydW5uaW5nIGluIGEgQ29tbW9uSlMgZW52aXJvbm1lbnRcbiAgICBQYXJzZS5fID0gZXhwb3J0cy5fLm5vQ29uZmxpY3QoKTtcbiAgICBleHBvcnRzLlBhcnNlID0gUGFyc2U7XG4gIH0gZWxzZSB7XG4gICAgUGFyc2UuXyA9IF8ubm9Db25mbGljdCgpO1xuICB9XG5cbiAgLy8gSWYgalF1ZXJ5IG9yIFplcHRvIGhhcyBiZWVuIGluY2x1ZGVkLCBncmFiIGEgcmVmZXJlbmNlIHRvIGl0LlxuICBpZiAodHlwZW9mKCQpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgUGFyc2UuJCA9ICQ7XG4gIH1cblxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS1cblxuICAvLyBTaGFyZWQgZW1wdHkgY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gYWlkIGluIHByb3RvdHlwZS1jaGFpbiBjcmVhdGlvbi5cbiAgdmFyIEVtcHR5Q29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHt9O1xuXG4gIC8vIFRPRE86IGZpeCB0aGlzIHNvIHRoYXQgUGFyc2VPYmplY3RzIGFyZW4ndCBhbGwgY2FsbGVkIFwiY2hpbGRcIiBpbiBkZWJ1Z2dlci5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXG4gIC8vIFNpbWlsYXIgdG8gYGdvb2cuaW5oZXJpdHNgLCBidXQgdXNlcyBhIGhhc2ggb2YgcHJvdG90eXBlIHByb3BlcnRpZXMgYW5kXG4gIC8vIGNsYXNzIHByb3BlcnRpZXMgdG8gYmUgZXh0ZW5kZWQuXG4gIHZhciBpbmhlcml0cyA9IGZ1bmN0aW9uKHBhcmVudCwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICB2YXIgY2hpbGQ7XG5cbiAgICAvLyBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHRoZSBuZXcgc3ViY2xhc3MgaXMgZWl0aGVyIGRlZmluZWQgYnkgeW91XG4gICAgLy8gKHRoZSBcImNvbnN0cnVjdG9yXCIgcHJvcGVydHkgaW4geW91ciBgZXh0ZW5kYCBkZWZpbml0aW9uKSwgb3IgZGVmYXVsdGVkXG4gICAgLy8gYnkgdXMgdG8gc2ltcGx5IGNhbGwgdGhlIHBhcmVudCdzIGNvbnN0cnVjdG9yLlxuICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoJ2NvbnN0cnVjdG9yJykpIHtcbiAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLyoqIEBpZ25vcmUgKi9cbiAgICAgIGNoaWxkID0gZnVuY3Rpb24oKXsgcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgfVxuXG4gICAgLy8gSW5oZXJpdCBjbGFzcyAoc3RhdGljKSBwcm9wZXJ0aWVzIGZyb20gcGFyZW50LlxuICAgIFBhcnNlLl8uZXh0ZW5kKGNoaWxkLCBwYXJlbnQpO1xuXG4gICAgLy8gU2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gaW5oZXJpdCBmcm9tIGBwYXJlbnRgLCB3aXRob3V0IGNhbGxpbmdcbiAgICAvLyBgcGFyZW50YCdzIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgIEVtcHR5Q29uc3RydWN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgRW1wdHlDb25zdHJ1Y3RvcigpO1xuXG4gICAgLy8gQWRkIHByb3RvdHlwZSBwcm9wZXJ0aWVzIChpbnN0YW5jZSBwcm9wZXJ0aWVzKSB0byB0aGUgc3ViY2xhc3MsXG4gICAgLy8gaWYgc3VwcGxpZWQuXG4gICAgaWYgKHByb3RvUHJvcHMpIHtcbiAgICAgIFBhcnNlLl8uZXh0ZW5kKGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgaWYgc3VwcGxpZWQuXG4gICAgaWYgKHN0YXRpY1Byb3BzKSB7XG4gICAgICBQYXJzZS5fLmV4dGVuZChjaGlsZCwgc3RhdGljUHJvcHMpO1xuICAgIH1cblxuICAgIC8vIENvcnJlY3RseSBzZXQgY2hpbGQncyBgcHJvdG90eXBlLmNvbnN0cnVjdG9yYC5cbiAgICBjaGlsZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjaGlsZDtcblxuICAgIC8vIFNldCBhIGNvbnZlbmllbmNlIHByb3BlcnR5IGluIGNhc2UgdGhlIHBhcmVudCdzIHByb3RvdHlwZSBpc1xuICAgIC8vIG5lZWRlZCBsYXRlci5cbiAgICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9O1xuXG4gIC8vIFNldCB0aGUgc2VydmVyIGZvciBQYXJzZSB0byB0YWxrIHRvLlxuICBQYXJzZS5zZXJ2ZXJVUkwgPSBcImh0dHBzOi8vYXBpLnBhcnNlLmNvbVwiO1xuXG4gIC8vIENoZWNrIHdoZXRoZXIgd2UgYXJlIHJ1bm5pbmcgaW4gTm9kZS5qcy5cbiAgaWYgKHR5cGVvZihwcm9jZXNzKSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgcHJvY2Vzcy52ZXJzaW9ucyAmJlxuICAgICAgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlKSB7XG4gICAgUGFyc2UuX2lzTm9kZSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCB0aGlzIG1ldGhvZCBmaXJzdCB0byBzZXQgdXAgeW91ciBhdXRoZW50aWNhdGlvbiB0b2tlbnMgZm9yIFBhcnNlLlxuICAgKiBZb3UgY2FuIGdldCB5b3VyIGtleXMgZnJvbSB0aGUgRGF0YSBCcm93c2VyIG9uIHBhcnNlLmNvbS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGFwcGxpY2F0aW9uSWQgWW91ciBQYXJzZSBBcHBsaWNhdGlvbiBJRC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGphdmFTY3JpcHRLZXkgWW91ciBQYXJzZSBKYXZhU2NyaXB0IEtleS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1hc3RlcktleSAob3B0aW9uYWwpIFlvdXIgUGFyc2UgTWFzdGVyIEtleS4gKE5vZGUuanMgb25seSEpXG4gICAqL1xuICBQYXJzZS5pbml0aWFsaXplID0gZnVuY3Rpb24oYXBwbGljYXRpb25JZCwgamF2YVNjcmlwdEtleSwgbWFzdGVyS2V5KSB7XG4gICAgaWYgKG1hc3RlcktleSkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5pbml0aWFsaXplKCkgd2FzIHBhc3NlZCBhIE1hc3RlciBLZXksIHdoaWNoIGlzIG9ubHkgXCIgK1xuICAgICAgICBcImFsbG93ZWQgZnJvbSB3aXRoaW4gTm9kZS5qcy5cIjtcbiAgICB9XG4gICAgUGFyc2UuX2luaXRpYWxpemUoYXBwbGljYXRpb25JZCwgamF2YVNjcmlwdEtleSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGwgdGhpcyBtZXRob2QgZmlyc3QgdG8gc2V0IHVwIG1hc3RlciBhdXRoZW50aWNhdGlvbiB0b2tlbnMgZm9yIFBhcnNlLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBmb3IgUGFyc2UncyBvd24gcHJpdmF0ZSB1c2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcHBsaWNhdGlvbklkIFlvdXIgUGFyc2UgQXBwbGljYXRpb24gSUQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBqYXZhU2NyaXB0S2V5IFlvdXIgUGFyc2UgSmF2YVNjcmlwdCBLZXkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtYXN0ZXJLZXkgWW91ciBQYXJzZSBNYXN0ZXIgS2V5LlxuICAgKi9cbiAgUGFyc2UuX2luaXRpYWxpemUgPSBmdW5jdGlvbihhcHBsaWNhdGlvbklkLCBqYXZhU2NyaXB0S2V5LCBtYXN0ZXJLZXkpIHtcbiAgICBQYXJzZS5hcHBsaWNhdGlvbklkID0gYXBwbGljYXRpb25JZDtcbiAgICBQYXJzZS5qYXZhU2NyaXB0S2V5ID0gamF2YVNjcmlwdEtleTtcbiAgICBQYXJzZS5tYXN0ZXJLZXkgPSBtYXN0ZXJLZXk7XG4gICAgUGFyc2UuX3VzZU1hc3RlcktleSA9IGZhbHNlO1xuICB9O1xuXG4gIC8vIElmIHdlJ3JlIHJ1bm5pbmcgaW4gbm9kZS5qcywgYWxsb3cgdXNpbmcgdGhlIG1hc3RlciBrZXkuXG4gIGlmIChQYXJzZS5faXNOb2RlKSB7XG4gICAgUGFyc2UuaW5pdGlhbGl6ZSA9IFBhcnNlLl9pbml0aWFsaXplO1xuXG4gICAgUGFyc2UuQ2xvdWQgPSBQYXJzZS5DbG91ZCB8fCB7fTtcbiAgICAvKipcbiAgICAgKiBTd2l0Y2hlcyB0aGUgUGFyc2UgU0RLIHRvIHVzaW5nIHRoZSBNYXN0ZXIga2V5LiAgVGhlIE1hc3RlciBrZXkgZ3JhbnRzXG4gICAgICogcHJpdmVsZWdlZCBhY2Nlc3MgdG8gdGhlIGRhdGEgaW4gUGFyc2UgYW5kIGNhbiBiZSB1c2VkIHRvIGJ5cGFzcyBBQ0xzIGFuZFxuICAgICAqIG90aGVyIHJlc3RyaWN0aW9ucyB0aGF0IGFyZSBhcHBsaWVkIHRvIHRoZSBjbGllbnQgU0RLcy5cbiAgICAgKiA8cD48c3Ryb25nPjxlbT5BdmFpbGFibGUgaW4gQ2xvdWQgQ29kZSBhbmQgTm9kZS5qcyBvbmx5LjwvZW0+PC9zdHJvbmc+XG4gICAgICogPC9wPlxuICAgICAqL1xuICAgIFBhcnNlLkNsb3VkLnVzZU1hc3RlcktleSA9IGZ1bmN0aW9uKCkge1xuICAgICAgUGFyc2UuX3VzZU1hc3RlcktleSA9IHRydWU7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHByZWZpeCBmb3IgU3RvcmFnZSBrZXlzIHVzZWQgYnkgdGhpcyBpbnN0YW5jZSBvZiBQYXJzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVGhlIHJlbGF0aXZlIHN1ZmZpeCB0byBhcHBlbmQgdG8gaXQuXG4gICAqICAgICBudWxsIG9yIHVuZGVmaW5lZCBpcyB0cmVhdGVkIGFzIHRoZSBlbXB0eSBzdHJpbmcuXG4gICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGZ1bGwga2V5IG5hbWUuXG4gICAqL1xuICBQYXJzZS5fZ2V0UGFyc2VQYXRoID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIGlmICghUGFyc2UuYXBwbGljYXRpb25JZCkge1xuICAgICAgdGhyb3cgXCJZb3UgbmVlZCB0byBjYWxsIFBhcnNlLmluaXRpYWxpemUgYmVmb3JlIHVzaW5nIFBhcnNlLlwiO1xuICAgIH1cbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBcIlwiO1xuICAgIH1cbiAgICBpZiAoIVBhcnNlLl8uaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgIHRocm93IFwiVHJpZWQgdG8gZ2V0IGEgU3RvcmFnZSBwYXRoIHRoYXQgd2Fzbid0IGEgU3RyaW5nLlwiO1xuICAgIH1cbiAgICBpZiAocGF0aFswXSA9PT0gXCIvXCIpIHtcbiAgICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZygxKTtcbiAgICB9XG4gICAgcmV0dXJuIFwiUGFyc2UvXCIgKyBQYXJzZS5hcHBsaWNhdGlvbklkICsgXCIvXCIgKyBwYXRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIHVuaXF1ZSBzdHJpbmcgZm9yIHRoaXMgYXBwIG9uXG4gICAqIHRoaXMgbWFjaGluZS5cbiAgICogR2V0cyByZXNldCB3aGVuIFN0b3JhZ2UgaXMgY2xlYXJlZC5cbiAgICovXG4gIFBhcnNlLl9pbnN0YWxsYXRpb25JZCA9IG51bGw7XG4gIFBhcnNlLl9nZXRJbnN0YWxsYXRpb25JZCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFNlZSBpZiBpdCdzIGNhY2hlZCBpbiBSQU0uXG4gICAgaWYgKFBhcnNlLl9pbnN0YWxsYXRpb25JZCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoUGFyc2UuX2luc3RhbGxhdGlvbklkKTtcbiAgICB9XG5cbiAgICAvLyBUcnkgdG8gZ2V0IGl0IGZyb20gU3RvcmFnZS5cbiAgICB2YXIgcGF0aCA9IFBhcnNlLl9nZXRQYXJzZVBhdGgoXCJpbnN0YWxsYXRpb25JZFwiKTtcbiAgICByZXR1cm4gKFBhcnNlLlN0b3JhZ2UuZ2V0SXRlbUFzeW5jKHBhdGgpXG4gICAgICAudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBQYXJzZS5faW5zdGFsbGF0aW9uSWQgPSB2YWx1ZTtcblxuICAgICAgICBpZiAoIVBhcnNlLl9pbnN0YWxsYXRpb25JZCB8fCBQYXJzZS5faW5zdGFsbGF0aW9uSWQgPT09IFwiXCIpIHtcbiAgICAgICAgICAvLyBJdCB3YXNuJ3QgaW4gU3RvcmFnZSwgc28gY3JlYXRlIGEgbmV3IG9uZS5cbiAgICAgICAgICB2YXIgaGV4T2N0ZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIE1hdGguZmxvb3IoKDErTWF0aC5yYW5kb20oKSkqMHgxMDAwMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIFBhcnNlLl9pbnN0YWxsYXRpb25JZCA9IChcbiAgICAgICAgICAgIGhleE9jdGV0KCkgKyBoZXhPY3RldCgpICsgXCItXCIgK1xuICAgICAgICAgICAgaGV4T2N0ZXQoKSArIFwiLVwiICtcbiAgICAgICAgICAgIGhleE9jdGV0KCkgKyBcIi1cIiArXG4gICAgICAgICAgICBoZXhPY3RldCgpICsgXCItXCIgK1xuICAgICAgICAgICAgaGV4T2N0ZXQoKSArIGhleE9jdGV0KCkgKyBoZXhPY3RldCgpKTtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuU3RvcmFnZS5zZXRJdGVtQXN5bmMocGF0aCwgUGFyc2UuX2luc3RhbGxhdGlvbklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFBhcnNlLl9pbnN0YWxsYXRpb25JZCk7XG4gICAgICB9KVxuICAgICk7XG4gIH07XG5cbiAgUGFyc2UuX3BhcnNlRGF0ZSA9IGZ1bmN0aW9uKGlzbzg2MDEpIHtcbiAgICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cChcbiAgICAgIFwiXihbMC05XXsxLDR9KS0oWzAtOV17MSwyfSktKFswLTldezEsMn0pXCIgKyBcIlRcIiArXG4gICAgICBcIihbMC05XXsxLDJ9KTooWzAtOV17MSwyfSk6KFswLTldezEsMn0pXCIgK1xuICAgICAgXCIoLihbMC05XSspKT9cIiArIFwiWiRcIik7XG4gICAgdmFyIG1hdGNoID0gcmVnZXhwLmV4ZWMoaXNvODYwMSk7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHllYXIgPSBtYXRjaFsxXSB8fCAwO1xuICAgIHZhciBtb250aCA9IChtYXRjaFsyXSB8fCAxKSAtIDE7XG4gICAgdmFyIGRheSA9IG1hdGNoWzNdIHx8IDA7XG4gICAgdmFyIGhvdXIgPSBtYXRjaFs0XSB8fCAwO1xuICAgIHZhciBtaW51dGUgPSBtYXRjaFs1XSB8fCAwO1xuICAgIHZhciBzZWNvbmQgPSBtYXRjaFs2XSB8fCAwO1xuICAgIHZhciBtaWxsaSA9IG1hdGNoWzhdIHx8IDA7XG5cbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpKSk7XG4gIH07XG5cbiAgUGFyc2UuX2FqYXhJRTggPSBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSkge1xuICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICB2YXIgeGRyID0gbmV3IFhEb21haW5SZXF1ZXN0KCk7XG4gICAgeGRyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhkci5yZXNwb25zZVRleHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBwcm9taXNlLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgeGRyLm9uZXJyb3IgPSB4ZHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBMZXQncyBmYWtlIGEgcmVhbCBlcnJvciBtZXNzYWdlLlxuICAgICAgdmFyIGZha2VSZXNwb25zZSA9IHtcbiAgICAgICAgcmVzcG9uc2VUZXh0OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY29kZTogUGFyc2UuRXJyb3IuWF9ET01BSU5fUkVRVUVTVCxcbiAgICAgICAgICBlcnJvcjogXCJJRSdzIFhEb21haW5SZXF1ZXN0IGRvZXMgbm90IHN1cHBseSBlcnJvciBpbmZvLlwiXG4gICAgICAgIH0pXG4gICAgICB9O1xuICAgICAgcHJvbWlzZS5yZWplY3QoZmFrZVJlc3BvbnNlKTtcbiAgICB9O1xuICAgIHhkci5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fTtcbiAgICB4ZHIub3BlbihtZXRob2QsIHVybCk7XG4gICAgeGRyLnNlbmQoZGF0YSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH07XG5cbiAgUGFyc2UuX3VzZVhEb21haW5SZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZihYRG9tYWluUmVxdWVzdCkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIC8vIFdlJ3JlIGluIElFIDgrLlxuICAgICAgaWYgKCd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBYTUxIdHRwUmVxdWVzdCgpKSB7XG4gICAgICAgIC8vIFdlJ3JlIGluIElFIDEwKy5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBUT0RPKGtsaW10KTogR2V0IHJpZCBvZiBzdWNjZXNzL2Vycm9yIHVzYWdlIGluIHdlYnNpdGUuXG4gIFBhcnNlLl9hamF4ID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgICAgZXJyb3I6IGVycm9yXG4gICAgfTtcblxuICAgIGlmIChQYXJzZS5fdXNlWERvbWFpblJlcXVlc3QoKSkge1xuICAgICAgcmV0dXJuIFBhcnNlLl9hamF4SUU4KG1ldGhvZCwgdXJsLCBkYXRhKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgdmFyIGF0dGVtcHRzID0gMDtcblxuICAgIHZhciBkaXNwYXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhhbmRsZWQgPSBmYWxzZTtcbiAgICAgIHZhciB4aHIgPSBuZXcgUGFyc2UuWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVqZWN0KGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZShyZXNwb25zZSwgeGhyLnN0YXR1cywgeGhyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHhoci5zdGF0dXMgPj0gNTAwKSB7IC8vIFJldHJ5IG9uIDVYWFxuICAgICAgICAgICAgaWYgKCsrYXR0ZW1wdHMgPCA1KSB7XG4gICAgICAgICAgICAgIC8vIEV4cG9uZW50aWFsbHktZ3Jvd2luZyBkZWxheVxuICAgICAgICAgICAgICB2YXIgZGVsYXkgPSBNYXRoLnJvdW5kKFxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAxMjUgKiBNYXRoLnBvdygyLCBhdHRlbXB0cylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChkaXNwYXRjaCwgZGVsYXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gQWZ0ZXIgNSByZXRyaWVzLCBmYWlsXG4gICAgICAgICAgICAgIHByb21pc2UucmVqZWN0KHhocik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb21pc2UucmVqZWN0KHhocik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW4nKTsgIC8vIGF2b2lkIHByZS1mbGlnaHQuXG4gICAgICBpZiAoUGFyc2UuX2lzTm9kZSkge1xuICAgICAgICAvLyBBZGQgYSBzcGVjaWFsIHVzZXIgYWdlbnQganVzdCBmb3IgcmVxdWVzdCBmcm9tIG5vZGUuanMuXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiVXNlci1BZ2VudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlBhcnNlL1wiICsgUGFyc2UuVkVSU0lPTiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIChOb2RlSlMgXCIgKyBwcm9jZXNzLnZlcnNpb25zLm5vZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICB9O1xuXG4gICAgZGlzcGF0Y2goKTtcbiAgICByZXR1cm4gcHJvbWlzZS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTsgXG4gIH07XG5cbiAgLy8gQSBzZWxmLXByb3BhZ2F0aW5nIGV4dGVuZCBmdW5jdGlvbi5cbiAgUGFyc2UuX2V4dGVuZCA9IGZ1bmN0aW9uKHByb3RvUHJvcHMsIGNsYXNzUHJvcHMpIHtcbiAgICB2YXIgY2hpbGQgPSBpbmhlcml0cyh0aGlzLCBwcm90b1Byb3BzLCBjbGFzc1Byb3BzKTtcbiAgICBjaGlsZC5leHRlbmQgPSB0aGlzLmV4dGVuZDtcbiAgICByZXR1cm4gY2hpbGQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIE9wdGlvbnM6XG4gICAqICAgcm91dGU6IGlzIGNsYXNzZXMsIHVzZXJzLCBsb2dpbiwgZXRjLlxuICAgKiAgIG9iamVjdElkOiBudWxsIGlmIHRoZXJlIGlzIG5vIGFzc29jaWF0ZWQgb2JqZWN0SWQuXG4gICAqICAgbWV0aG9kOiB0aGUgaHR0cCBtZXRob2QgZm9yIHRoZSBSRVNUIEFQSS5cbiAgICogICBkYXRhT2JqZWN0OiB0aGUgcGF5bG9hZCBhcyBhbiBvYmplY3QsIG9yIG51bGwgaWYgdGhlcmUgaXMgbm9uZS5cbiAgICogICB1c2VNYXN0ZXJLZXk6IG92ZXJyaWRlcyB3aGV0aGVyIHRvIHVzZSB0aGUgbWFzdGVyIGtleSBpZiBzZXQuXG4gICAqIEBpZ25vcmVcbiAgICovXG4gIFBhcnNlLl9yZXF1ZXN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciByb3V0ZSA9IG9wdGlvbnMucm91dGU7XG4gICAgdmFyIGNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lO1xuICAgIHZhciBvYmplY3RJZCA9IG9wdGlvbnMub2JqZWN0SWQ7XG4gICAgdmFyIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kO1xuICAgIHZhciB1c2VNYXN0ZXJLZXkgPSBvcHRpb25zLnVzZU1hc3RlcktleTtcbiAgICB2YXIgc2Vzc2lvblRva2VuID0gb3B0aW9ucy5zZXNzaW9uVG9rZW47XG4gICAgdmFyIGRhdGFPYmplY3QgPSBvcHRpb25zLmRhdGE7XG5cbiAgICBpZiAoIVBhcnNlLmFwcGxpY2F0aW9uSWQpIHtcbiAgICAgIHRocm93IFwiWW91IG11c3Qgc3BlY2lmeSB5b3VyIGFwcGxpY2F0aW9uSWQgdXNpbmcgUGFyc2UuaW5pdGlhbGl6ZS5cIjtcbiAgICB9XG5cbiAgICBpZiAoIVBhcnNlLmphdmFTY3JpcHRLZXkgJiYgIVBhcnNlLm1hc3RlcktleSkge1xuICAgICAgdGhyb3cgXCJZb3UgbXVzdCBzcGVjaWZ5IGEga2V5IHVzaW5nIFBhcnNlLmluaXRpYWxpemUuXCI7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogV2UgY2FuIHJlbW92ZSB0aGlzIGNoZWNrIGxhdGVyLCBidXQgaXQncyB1c2VmdWwgZm9yIGRldmVsb3BtZW50LlxuICAgIGlmIChyb3V0ZSAhPT0gXCJiYXRjaFwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImNsYXNzZXNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJldmVudHNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJmaWxlc1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImZ1bmN0aW9uc1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImxvZ2luXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwibG9nb3V0XCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwicHVzaFwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInJlcXVlc3RQYXNzd29yZFJlc2V0XCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwicmVzdF92ZXJpZnlfYW5hbHl0aWNzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwidXNlcnNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJqb2JzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiY29uZmlnXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwic2Vzc2lvbnNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJ1cGdyYWRlVG9SZXZvY2FibGVTZXNzaW9uXCIpIHtcbiAgICAgIHRocm93IFwiQmFkIHJvdXRlOiAnXCIgKyByb3V0ZSArIFwiJy5cIjtcbiAgICB9XG5cbiAgICB2YXIgdXJsID0gUGFyc2Uuc2VydmVyVVJMO1xuICAgIGlmICh1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gXCIvXCIpIHtcbiAgICAgIHVybCArPSBcIi9cIjtcbiAgICB9XG4gICAgdXJsICs9IFwiMS9cIiArIHJvdXRlO1xuICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgIHVybCArPSBcIi9cIiArIGNsYXNzTmFtZTtcbiAgICB9XG4gICAgaWYgKG9iamVjdElkKSB7XG4gICAgICB1cmwgKz0gXCIvXCIgKyBvYmplY3RJZDtcbiAgICB9XG5cbiAgICBkYXRhT2JqZWN0ID0gUGFyc2UuXy5jbG9uZShkYXRhT2JqZWN0IHx8IHt9KTtcbiAgICBpZiAobWV0aG9kICE9PSBcIlBPU1RcIikge1xuICAgICAgZGF0YU9iamVjdC5fbWV0aG9kID0gbWV0aG9kO1xuICAgICAgbWV0aG9kID0gXCJQT1NUXCI7XG4gICAgfVxuXG4gICAgaWYgKFBhcnNlLl8uaXNVbmRlZmluZWQodXNlTWFzdGVyS2V5KSkge1xuICAgICAgdXNlTWFzdGVyS2V5ID0gUGFyc2UuX3VzZU1hc3RlcktleTtcbiAgICB9XG5cbiAgICBkYXRhT2JqZWN0Ll9BcHBsaWNhdGlvbklkID0gUGFyc2UuYXBwbGljYXRpb25JZDtcbiAgICBpZiAoIXVzZU1hc3RlcktleSkge1xuICAgICAgZGF0YU9iamVjdC5fSmF2YVNjcmlwdEtleSA9IFBhcnNlLmphdmFTY3JpcHRLZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFPYmplY3QuX01hc3RlcktleSA9IFBhcnNlLm1hc3RlcktleTtcbiAgICB9XG5cbiAgICBkYXRhT2JqZWN0Ll9DbGllbnRWZXJzaW9uID0gUGFyc2UuVkVSU0lPTjtcblxuICAgIHJldHVybiBQYXJzZS5fZ2V0SW5zdGFsbGF0aW9uSWQoKS50aGVuKGZ1bmN0aW9uKGlpZCkge1xuICAgICAgZGF0YU9iamVjdC5fSW5zdGFsbGF0aW9uSWQgPSBpaWQ7XG5cbiAgICAgIGlmIChzZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoeyBfc2Vzc2lvblRva2VuOiBzZXNzaW9uVG9rZW4gfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50QXN5bmMoKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGN1cnJlbnRVc2VyKSB7XG4gICAgICBpZiAoY3VycmVudFVzZXIgJiYgY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbikge1xuICAgICAgICBkYXRhT2JqZWN0Ll9TZXNzaW9uVG9rZW4gPSBjdXJyZW50VXNlci5fc2Vzc2lvblRva2VuO1xuICAgICAgfVxuXG4gICAgICBpZiAoUGFyc2UuVXNlci5faXNSZXZvY2FibGVTZXNzaW9uRW5hYmxlZCkge1xuICAgICAgICBkYXRhT2JqZWN0Ll9SZXZvY2FibGVTZXNzaW9uID0gJzEnO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGFPYmplY3QpO1xuXG4gICAgICByZXR1cm4gUGFyc2UuX2FqYXgobWV0aG9kLCB1cmwsIGRhdGEpO1xuICAgIH0pLnRoZW4obnVsbCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIC8vIFRyYW5zZm9ybSB0aGUgZXJyb3IgaW50byBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvciBieSB0cnlpbmcgdG8gcGFyc2VcbiAgICAgIC8vIHRoZSBlcnJvciBzdHJpbmcgYXMgSlNPTi5cbiAgICAgIHZhciBlcnJvcjtcbiAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZXJyb3JKU09OID0gSlNPTi5wYXJzZShyZXNwb25zZS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKGVycm9ySlNPTi5jb2RlLCBlcnJvckpTT04uZXJyb3IpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gSWYgd2UgZmFpbCB0byBwYXJzZSB0aGUgZXJyb3IgdGV4dCwgdGhhdCdzIG9rYXkuXG4gICAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICAgICAgXCJSZWNlaXZlZCBhbiBlcnJvciB3aXRoIGludmFsaWQgSlNPTiBmcm9tIFBhcnNlOiBcIiArXG4gICAgICAgICAgICAgICAgICByZXNwb25zZS5yZXNwb25zZVRleHQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLkNPTk5FQ1RJT05fRkFJTEVELFxuICAgICAgICAgICAgXCJYTUxIdHRwUmVxdWVzdCBmYWlsZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcbiAgICAgIH1cbiAgICAgIC8vIEJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGEgcmVqZWN0ZWQgUHJvbWlzZSwgdGhpcyB3aWxsIHdvcmsgd2l0aFxuICAgICAgLy8gZWl0aGVyIGpRdWVyeSBvciBQcm9taXNlcy9BIHNlbWFudGljcy5cbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGEgdmFsdWUgZnJvbSBhIEJhY2tib25lIG9iamVjdCBhcyBhIHByb3BlcnR5XG4gIC8vIG9yIGFzIGEgZnVuY3Rpb24uXG4gIFBhcnNlLl9nZXRWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcCkge1xuICAgIGlmICghKG9iamVjdCAmJiBvYmplY3RbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIFBhcnNlLl8uaXNGdW5jdGlvbihvYmplY3RbcHJvcF0pID8gb2JqZWN0W3Byb3BdKCkgOiBvYmplY3RbcHJvcF07XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgdmFsdWUgaW4gYSBQYXJzZSBPYmplY3QgaW50byB0aGUgYXBwcm9wcmlhdGUgcmVwcmVzZW50YXRpb24uXG4gICAqIFRoaXMgaXMgdGhlIEpTIGVxdWl2YWxlbnQgb2YgSmF2YSdzIFBhcnNlLm1heWJlUmVmZXJlbmNlQW5kRW5jb2RlKE9iamVjdClcbiAgICogaWYgc2Vlbk9iamVjdHMgaXMgZmFsc2V5LiBPdGhlcndpc2UgYW55IFBhcnNlLk9iamVjdHMgbm90IGluXG4gICAqIHNlZW5PYmplY3RzIHdpbGwgYmUgZnVsbHkgZW1iZWRkZWQgcmF0aGVyIHRoYW4gZW5jb2RlZFxuICAgKiBhcyBhIHBvaW50ZXIuICBUaGlzIGFycmF5IHdpbGwgYmUgdXNlZCB0byBwcmV2ZW50IGdvaW5nIGludG8gYW4gaW5maW5pdGVcbiAgICogbG9vcCBiZWNhdXNlIHdlIGhhdmUgY2lyY3VsYXIgcmVmZXJlbmNlcy4gIElmIHNlZW5PYmplY3RzXG4gICAqIGlzIHNldCwgdGhlbiBub25lIG9mIHRoZSBQYXJzZSBPYmplY3RzIHRoYXQgYXJlIHNlcmlhbGl6ZWQgY2FuIGJlIGRpcnR5LlxuICAgKi9cbiAgUGFyc2UuX2VuY29kZSA9IGZ1bmN0aW9uKHZhbHVlLCBzZWVuT2JqZWN0cywgZGlzYWxsb3dPYmplY3RzKSB7XG4gICAgdmFyIF8gPSBQYXJzZS5fO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgaWYgKGRpc2FsbG93T2JqZWN0cykge1xuICAgICAgICB0aHJvdyBcIlBhcnNlLk9iamVjdHMgbm90IGFsbG93ZWQgaGVyZVwiO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWVuT2JqZWN0cyB8fCBfLmluY2x1ZGUoc2Vlbk9iamVjdHMsIHZhbHVlKSB8fCAhdmFsdWUuX2hhc0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLl90b1BvaW50ZXIoKTtcbiAgICAgIH1cbiAgICAgIGlmICghdmFsdWUuZGlydHkoKSkge1xuICAgICAgICBzZWVuT2JqZWN0cyA9IHNlZW5PYmplY3RzLmNvbmNhdCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiBQYXJzZS5fZW5jb2RlKHZhbHVlLl90b0Z1bGxKU09OKHNlZW5PYmplY3RzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vlbk9iamVjdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FsbG93T2JqZWN0cyk7XG4gICAgICB9XG4gICAgICB0aHJvdyBcIlRyaWVkIHRvIHNhdmUgYW4gb2JqZWN0IHdpdGggYSBwb2ludGVyIHRvIGEgbmV3LCB1bnNhdmVkIG9iamVjdC5cIjtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuQUNMKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9KU09OKCk7XG4gICAgfVxuICAgIGlmIChfLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB7IFwiX190eXBlXCI6IFwiRGF0ZVwiLCBcImlzb1wiOiB2YWx1ZS50b0pTT04oKSB9O1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5HZW9Qb2ludCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSlNPTigpO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHZhbHVlLCBmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5fZW5jb2RlKHgsIHNlZW5PYmplY3RzLCBkaXNhbGxvd09iamVjdHMpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnNvdXJjZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuUmVsYXRpb24pIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b0pTT04oKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT3ApIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b0pTT04oKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgaWYgKCF2YWx1ZS51cmwoKSkge1xuICAgICAgICB0aHJvdyBcIlRyaWVkIHRvIHNhdmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYW4gdW5zYXZlZCBmaWxlLlwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX190eXBlOiBcIkZpbGVcIixcbiAgICAgICAgbmFtZTogdmFsdWUubmFtZSgpLFxuICAgICAgICB1cmw6IHZhbHVlLnVybCgpXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHZhbHVlLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIG91dHB1dFtrXSA9IFBhcnNlLl9lbmNvZGUodiwgc2Vlbk9iamVjdHMsIGRpc2FsbG93T2JqZWN0cyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogVGhlIGludmVyc2UgZnVuY3Rpb24gb2YgUGFyc2UuX2VuY29kZS5cbiAgICogVE9ETzogbWFrZSBkZWNvZGUgbm90IG11dGF0ZSB2YWx1ZS5cbiAgICovXG4gIFBhcnNlLl9kZWNvZGUgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdmFyIF8gPSBQYXJzZS5fO1xuICAgIGlmICghXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2godmFsdWUsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgdmFsdWVba10gPSBQYXJzZS5fZGVjb2RlKGssIHYpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5GaWxlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9wKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX29wKSB7XG4gICAgICByZXR1cm4gUGFyc2UuT3AuX2RlY29kZSh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09IFwiUG9pbnRlclwiICYmIHZhbHVlLmNsYXNzTmFtZSkge1xuICAgICAgdmFyIHBvaW50ZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZSh2YWx1ZS5jbGFzc05hbWUpO1xuICAgICAgcG9pbnRlci5fZmluaXNoRmV0Y2goeyBvYmplY3RJZDogdmFsdWUub2JqZWN0SWQgfSwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHBvaW50ZXI7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09IFwiT2JqZWN0XCIgJiYgdmFsdWUuY2xhc3NOYW1lKSB7XG4gICAgICAvLyBJdCdzIGFuIE9iamVjdCBpbmNsdWRlZCBpbiBhIHF1ZXJ5IHJlc3VsdC5cbiAgICAgIHZhciBjbGFzc05hbWUgPSB2YWx1ZS5jbGFzc05hbWU7XG4gICAgICBkZWxldGUgdmFsdWUuX190eXBlO1xuICAgICAgZGVsZXRlIHZhbHVlLmNsYXNzTmFtZTtcbiAgICAgIHZhciBvYmplY3QgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShjbGFzc05hbWUpO1xuICAgICAgb2JqZWN0Ll9maW5pc2hGZXRjaCh2YWx1ZSwgdHJ1ZSk7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBpZiAodmFsdWUuX190eXBlID09PSBcIkRhdGVcIikge1xuICAgICAgcmV0dXJuIFBhcnNlLl9wYXJzZURhdGUodmFsdWUuaXNvKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJHZW9Qb2ludFwiKSB7XG4gICAgICByZXR1cm4gbmV3IFBhcnNlLkdlb1BvaW50KHtcbiAgICAgICAgbGF0aXR1ZGU6IHZhbHVlLmxhdGl0dWRlLFxuICAgICAgICBsb25naXR1ZGU6IHZhbHVlLmxvbmdpdHVkZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChrZXkgPT09IFwiQUNMXCIpIHtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkFDTCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFBhcnNlLkFDTCh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09IFwiUmVsYXRpb25cIikge1xuICAgICAgdmFyIHJlbGF0aW9uID0gbmV3IFBhcnNlLlJlbGF0aW9uKG51bGwsIGtleSk7XG4gICAgICByZWxhdGlvbi50YXJnZXRDbGFzc05hbWUgPSB2YWx1ZS5jbGFzc05hbWU7XG4gICAgICByZXR1cm4gcmVsYXRpb247XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09IFwiRmlsZVwiKSB7XG4gICAgICB2YXIgZmlsZSA9IG5ldyBQYXJzZS5GaWxlKHZhbHVlLm5hbWUpO1xuICAgICAgZmlsZS5fdXJsID0gdmFsdWUudXJsO1xuICAgICAgcmV0dXJuIGZpbGU7XG4gICAgfVxuICAgIFBhcnNlLl9vYmplY3RFYWNoKHZhbHVlLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICB2YWx1ZVtrXSA9IFBhcnNlLl9kZWNvZGUoaywgdik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIFBhcnNlLl9hcnJheUVhY2ggPSBQYXJzZS5fLmVhY2g7XG5cbiAgLyoqXG4gICAqIERvZXMgYSBkZWVwIHRyYXZlcnNhbCBvZiBldmVyeSBpdGVtIGluIG9iamVjdCwgY2FsbGluZyBmdW5jIG9uIGV2ZXJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIHRyYXZlcnNlIGRlZXBseS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZXZlcnkgaXRlbS4gSXQgd2lsbFxuICAgKiAgICAgYmUgcGFzc2VkIHRoZSBpdGVtIGFzIGFuIGFyZ3VtZW50LiBJZiBpdCByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLCB0aGF0XG4gICAqICAgICB2YWx1ZSB3aWxsIHJlcGxhY2UgdGhlIGl0ZW0gaW4gaXRzIHBhcmVudCBjb250YWluZXIuXG4gICAqIEByZXR1cm5zIHt9IHRoZSByZXN1bHQgb2YgY2FsbGluZyBmdW5jIG9uIHRoZSB0b3AtbGV2ZWwgb2JqZWN0IGl0c2VsZi5cbiAgICovXG4gIFBhcnNlLl90cmF2ZXJzZSA9IGZ1bmN0aW9uKG9iamVjdCwgZnVuYywgc2Vlbikge1xuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgIHNlZW4gPSBzZWVuIHx8IFtdO1xuICAgICAgaWYgKFBhcnNlLl8uaW5kZXhPZihzZWVuLCBvYmplY3QpID49IDApIHtcbiAgICAgICAgLy8gV2UndmUgYWxyZWFkeSB2aXNpdGVkIHRoaXMgb2JqZWN0IGluIHRoaXMgY2FsbC5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2Vlbi5wdXNoKG9iamVjdCk7XG4gICAgICBQYXJzZS5fdHJhdmVyc2Uob2JqZWN0LmF0dHJpYnV0ZXMsIGZ1bmMsIHNlZW4pO1xuICAgICAgcmV0dXJuIGZ1bmMob2JqZWN0KTtcbiAgICB9XG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLlJlbGF0aW9uIHx8IG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLkZpbGUpIHtcbiAgICAgIC8vIE5vdGhpbmcgbmVlZHMgdG8gYmUgZG9uZSwgYnV0IHdlIGRvbid0IHdhbnQgdG8gcmVjdXJzZSBpbnRvIHRoZVxuICAgICAgLy8gb2JqZWN0J3MgcGFyZW50IGluZmluaXRlbHksIHNvIHdlIGNhdGNoIHRoaXMgY2FzZS5cbiAgICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gICAgfVxuICAgIGlmIChQYXJzZS5fLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgUGFyc2UuXy5lYWNoKG9iamVjdCwgZnVuY3Rpb24oY2hpbGQsIGluZGV4KSB7XG4gICAgICAgIHZhciBuZXdDaGlsZCA9IFBhcnNlLl90cmF2ZXJzZShjaGlsZCwgZnVuYywgc2Vlbik7XG4gICAgICAgIGlmIChuZXdDaGlsZCkge1xuICAgICAgICAgIG9iamVjdFtpbmRleF0gPSBuZXdDaGlsZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZnVuYyhvYmplY3QpO1xuICAgIH1cbiAgICBpZiAoUGFyc2UuXy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICBQYXJzZS5fZWFjaChvYmplY3QsIGZ1bmN0aW9uKGNoaWxkLCBrZXkpIHtcbiAgICAgICAgdmFyIG5ld0NoaWxkID0gUGFyc2UuX3RyYXZlcnNlKGNoaWxkLCBmdW5jLCBzZWVuKTtcbiAgICAgICAgaWYgKG5ld0NoaWxkKSB7XG4gICAgICAgICAgb2JqZWN0W2tleV0gPSBuZXdDaGlsZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZnVuYyhvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYyhvYmplY3QpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGxpa2UgXy5lYWNoLCBleGNlcHQ6XG4gICAqICogaXQgZG9lc24ndCB3b3JrIGZvciBzby1jYWxsZWQgYXJyYXktbGlrZSBvYmplY3RzLFxuICAgKiAqIGl0IGRvZXMgd29yayBmb3IgZGljdGlvbmFyaWVzIHdpdGggYSBcImxlbmd0aFwiIGF0dHJpYnV0ZS5cbiAgICovXG4gIFBhcnNlLl9vYmplY3RFYWNoID0gUGFyc2UuX2VhY2ggPSBmdW5jdGlvbihvYmosIGNhbGxiYWNrKSB7XG4gICAgdmFyIF8gPSBQYXJzZS5fO1xuICAgIGlmIChfLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgIF8uZWFjaChfLmtleXMob2JqKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGNhbGxiYWNrKG9ialtrZXldLCBrZXkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChvYmosIGNhbGxiYWNrKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNoZWNrIG51bGwgb3IgdW5kZWZpbmVkLlxuICBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIFBhcnNlLl8uaXNOdWxsKHgpIHx8IFBhcnNlLl8uaXNVbmRlZmluZWQoeCk7XG4gIH07XG59KHRoaXMpKTtcblxuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBsb2NhbFN0b3JhZ2U6IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgXG4gIHZhciBTdG9yYWdlID0ge1xuICAgIGFzeW5jOiBmYWxzZSxcbiAgfTtcblxuICB2YXIgaGFzTG9jYWxTdG9yYWdlID0gKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnKTtcbiAgaWYgKGhhc0xvY2FsU3RvcmFnZSkge1xuICAgIHRyeSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc3VwcG9ydGVkJywgdHJ1ZSk7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnc3VwcG9ydGVkJyk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBoYXNMb2NhbFN0b3JhZ2UgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKGhhc0xvY2FsU3RvcmFnZSkge1xuICAgIFN0b3JhZ2UuZ2V0SXRlbSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShwYXRoKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5zZXRJdGVtID0gZnVuY3Rpb24ocGF0aCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShwYXRoLCB2YWx1ZSk7XG4gICAgfTtcblxuICAgIFN0b3JhZ2UucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShwYXRoKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgQXN5bmNTdG9yYWdlO1xuICAgIHRyeSB7XG4gICAgICBBc3luY1N0b3JhZ2UgPSBldmFsKFwicmVxdWlyZSgnQXN5bmNTdG9yYWdlJylcIik7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgICBTdG9yYWdlLmFzeW5jID0gdHJ1ZTtcblxuICAgICAgU3RvcmFnZS5nZXRJdGVtQXN5bmMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgIHZhciBwID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgICAgQXN5bmNTdG9yYWdlLmdldEl0ZW0ocGF0aCwgZnVuY3Rpb24oZXJyLCB2YWx1ZSkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHAucmVqZWN0KGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9O1xuXG4gICAgICBTdG9yYWdlLnNldEl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgsIHZhbHVlKSB7XG4gICAgICAgIHZhciBwID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgICAgQXN5bmNTdG9yYWdlLnNldEl0ZW0ocGF0aCwgdmFsdWUsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHAucmVqZWN0KGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9O1xuXG4gICAgICBTdG9yYWdlLnJlbW92ZUl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdmFyIHAgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgICBBc3luY1N0b3JhZ2UucmVtb3ZlSXRlbShwYXRoLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBwLnJlamVjdChlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH07XG5cbiAgICAgIFN0b3JhZ2UuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgQXN5bmNTdG9yYWdlLmNsZWFyKCk7XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGUpIHsgfVxuICB9XG4gIGlmICghU3RvcmFnZS5hc3luYyAmJiAhU3RvcmFnZS5nZXRJdGVtKSB7XG4gICAgdmFyIG1lbU1hcCA9IFN0b3JhZ2UuaW5NZW1vcnlNYXAgPSB7fTtcbiAgICBTdG9yYWdlLmdldEl0ZW0gPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBpZiAobWVtTWFwLmhhc093blByb3BlcnR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBtZW1NYXBbcGF0aF07XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5zZXRJdGVtID0gZnVuY3Rpb24ocGF0aCwgdmFsdWUpIHtcbiAgICAgIG1lbU1hcFtwYXRoXSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfTtcblxuICAgIFN0b3JhZ2UucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIGRlbGV0ZSBtZW1NYXBbcGF0aF07XG4gICAgfTtcblxuICAgIFN0b3JhZ2UuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBtZW1NYXApIHtcbiAgICAgICAgaWYgKG1lbU1hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgZGVsZXRlIG1lbU1hcFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIFdlIGNhbiB1c2Ugc3luY2hyb25vdXMgbWV0aG9kcyBmcm9tIGFzeW5jIHNjZW5hcmlvcywgYnV0IG5vdCB2aWNlLXZlcnNhXG4gIGlmICghU3RvcmFnZS5hc3luYykge1xuICAgIFN0b3JhZ2UuZ2V0SXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoXG4gICAgICAgIFN0b3JhZ2UuZ2V0SXRlbShwYXRoKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5zZXRJdGVtQXN5bmMgPSBmdW5jdGlvbihwYXRoLCB2YWx1ZSkge1xuICAgICAgU3RvcmFnZS5zZXRJdGVtKHBhdGgsIHZhbHVlKTtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKHZhbHVlKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5yZW1vdmVJdGVtQXN5bmMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhcbiAgICAgICAgU3RvcmFnZS5yZW1vdmVJdGVtKHBhdGgpXG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICBQYXJzZS5TdG9yYWdlID0gU3RvcmFnZTtcblxufSkodGhpcyk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2UgUHJvdmlkZXMgYW4gaW50ZXJmYWNlIHRvIFBhcnNlJ3MgbG9nZ2luZyBhbmQgYW5hbHl0aWNzIGJhY2tlbmQuXG4gICAqL1xuICBQYXJzZS5BbmFseXRpY3MgPSBQYXJzZS5BbmFseXRpY3MgfHwge307XG5cbiAgXy5leHRlbmQoUGFyc2UuQW5hbHl0aWNzLCAvKiogQGxlbmRzIFBhcnNlLkFuYWx5dGljcyAqLyB7XG4gICAgLyoqXG4gICAgICogVHJhY2tzIHRoZSBvY2N1cnJlbmNlIG9mIGEgY3VzdG9tIGV2ZW50IHdpdGggYWRkaXRpb25hbCBkaW1lbnNpb25zLlxuICAgICAqIFBhcnNlIHdpbGwgc3RvcmUgYSBkYXRhIHBvaW50IGF0IHRoZSB0aW1lIG9mIGludm9jYXRpb24gd2l0aCB0aGUgZ2l2ZW5cbiAgICAgKiBldmVudCBuYW1lLlxuICAgICAqXG4gICAgICogRGltZW5zaW9ucyB3aWxsIGFsbG93IHNlZ21lbnRhdGlvbiBvZiB0aGUgb2NjdXJyZW5jZXMgb2YgdGhpcyBjdXN0b21cbiAgICAgKiBldmVudC4gS2V5cyBhbmQgdmFsdWVzIHNob3VsZCBiZSB7QGNvZGUgU3RyaW5nfXMsIGFuZCB3aWxsIHRocm93XG4gICAgICogb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogVG8gdHJhY2sgYSB1c2VyIHNpZ251cCBhbG9uZyB3aXRoIGFkZGl0aW9uYWwgbWV0YWRhdGEsIGNvbnNpZGVyIHRoZVxuICAgICAqIGZvbGxvd2luZzpcbiAgICAgKiA8cHJlPlxuICAgICAqIHZhciBkaW1lbnNpb25zID0ge1xuICAgICAqICBnZW5kZXI6ICdtJyxcbiAgICAgKiAgc291cmNlOiAnd2ViJyxcbiAgICAgKiAgZGF5VHlwZTogJ3dlZWtlbmQnXG4gICAgICogfTtcbiAgICAgKiBQYXJzZS5BbmFseXRpY3MudHJhY2soJ3NpZ251cCcsIGRpbWVuc2lvbnMpO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogVGhlcmUgaXMgYSBkZWZhdWx0IGxpbWl0IG9mIDggZGltZW5zaW9ucyBwZXIgZXZlbnQgdHJhY2tlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBjdXN0b20gZXZlbnQgdG8gcmVwb3J0IHRvIFBhcnNlIGFzXG4gICAgICogaGF2aW5nIGhhcHBlbmVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkaW1lbnNpb25zIFRoZSBkaWN0aW9uYXJ5IG9mIGluZm9ybWF0aW9uIGJ5IHdoaWNoIHRvXG4gICAgICogc2VnbWVudCB0aGlzIGV2ZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIHJvdW5kLXRyaXBcbiAgICAgKiB0byB0aGUgc2VydmVyIGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICB0cmFjazogZnVuY3Rpb24obmFtZSwgZGltZW5zaW9ucywgb3B0aW9ucykge1xuICAgICAgbmFtZSA9IG5hbWUgfHwgJyc7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9eXFxzKi8sICcnKTtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1xccyokLywgJycpO1xuICAgICAgaWYgKG5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93ICdBIG5hbWUgZm9yIHRoZSBjdXN0b20gZXZlbnQgbXVzdCBiZSBwcm92aWRlZCc7XG4gICAgICB9XG5cbiAgICAgIF8uZWFjaChkaW1lbnNpb25zLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBpZiAoIV8uaXNTdHJpbmcoa2V5KSB8fCAhXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgdGhyb3cgJ3RyYWNrKCkgZGltZW5zaW9ucyBleHBlY3RzIGtleXMgYW5kIHZhbHVlcyBvZiB0eXBlIFwic3RyaW5nXCIuJztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6ICdldmVudHMnLFxuICAgICAgICBjbGFzc05hbWU6IG5hbWUsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7IGRpbWVuc2lvbnM6IGRpbWVuc2lvbnMgfVxuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuICB9KTtcbn0odGhpcykpO1xuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgUGFyc2UuQ29uZmlnIGlzIGEgbG9jYWwgcmVwcmVzZW50YXRpb24gb2YgY29uZmlndXJhdGlvbiBkYXRhIHRoYXRcbiAgICogY2FuIGJlIHNldCBmcm9tIHRoZSBQYXJzZSBkYXNoYm9hcmQuXG4gICAqL1xuICBQYXJzZS5Db25maWcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLl9lc2NhcGVkQXR0cmlidXRlcyA9IHt9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIG1vc3QgcmVjZW50bHktZmV0Y2hlZCBjb25maWd1cmF0aW9uIG9iamVjdCwgZWl0aGVyIGZyb21cbiAgICogbWVtb3J5IG9yIGZyb20gbG9jYWwgc3RvcmFnZSBpZiBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEByZXR1cm4ge1BhcnNlLkNvbmZpZ30gVGhlIG1vc3QgcmVjZW50bHktZmV0Y2hlZCBQYXJzZS5Db25maWcgaWYgaXRcbiAgICogICAgIGV4aXN0cywgZWxzZSBhbiBlbXB0eSBQYXJzZS5Db25maWcuXG4gICAqL1xuICBQYXJzZS5Db25maWcuY3VycmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChQYXJzZS5Db25maWcuX2N1cnJlbnRDb25maWcpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Db25maWcuX2N1cnJlbnRDb25maWc7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZyA9IG5ldyBQYXJzZS5Db25maWcoKTtcblxuICAgIGlmIChQYXJzZS5TdG9yYWdlLmFzeW5jKSB7XG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIHZhciBjb25maWdEYXRhID0gUGFyc2UuU3RvcmFnZS5nZXRJdGVtKFBhcnNlLl9nZXRQYXJzZVBhdGgoXG4gICAgICAgICAgUGFyc2UuQ29uZmlnLl9DVVJSRU5UX0NPTkZJR19LRVkpKTtcblxuICAgIGlmIChjb25maWdEYXRhKSB7ICBcbiAgICAgIGNvbmZpZy5fZmluaXNoRmV0Y2goSlNPTi5wYXJzZShjb25maWdEYXRhKSk7XG4gICAgICBQYXJzZS5Db25maWcuX2N1cnJlbnRDb25maWcgPSBjb25maWc7XG4gICAgfVxuICAgIHJldHVybiBjb25maWc7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgYSBuZXcgY29uZmlndXJhdGlvbiBvYmplY3QgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPnN1Y2Nlc3M6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZ2V0IGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAqICAgPGxpPmVycm9yOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGdldCBmYWlscy5cbiAgICogPC91bD5cbiAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCBhIG5ld2x5LWNyZWF0ZWRcbiAgICogICAgIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdoZW4gdGhlIGdldCBjb21wbGV0ZXMuXG4gICAqL1xuICBQYXJzZS5Db25maWcuZ2V0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICByb3V0ZTogXCJjb25maWdcIixcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB9KTtcblxuICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmICghcmVzcG9uc2UgfHwgIXJlc3BvbnNlLnBhcmFtcykge1xuICAgICAgICB2YXIgZXJyb3JPYmplY3QgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgIFwiQ29uZmlnIEpTT04gcmVzcG9uc2UgaW52YWxpZC5cIik7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yT2JqZWN0KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbmZpZyA9IG5ldyBQYXJzZS5Db25maWcoKTtcbiAgICAgIGNvbmZpZy5fZmluaXNoRmV0Y2gocmVzcG9uc2UpO1xuICAgICAgUGFyc2UuQ29uZmlnLl9jdXJyZW50Q29uZmlnID0gY29uZmlnO1xuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICBQYXJzZS5Db25maWcucHJvdG90eXBlID0ge1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgSFRNTC1lc2NhcGVkIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBlc2NhcGU6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHZhciBodG1sID0gdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICBpZiAoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICAgIH1cbiAgICAgIHZhciB2YWwgPSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICB2YXIgZXNjYXBlZDtcbiAgICAgIGlmIChQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQodmFsKSkge1xuICAgICAgICBlc2NhcGVkID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlc2NhcGVkID0gXy5lc2NhcGUodmFsLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl0gPSBlc2NhcGVkO1xuICAgICAgcmV0dXJuIGVzY2FwZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBUaGUgbmFtZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH0sXG5cbiAgICBfZmluaXNoRmV0Y2g6IGZ1bmN0aW9uKHNlcnZlckRhdGEpIHtcbiAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFBhcnNlLl9kZWNvZGUobnVsbCwgXy5jbG9uZShzZXJ2ZXJEYXRhLnBhcmFtcykpO1xuICAgICAgaWYgKCFQYXJzZS5TdG9yYWdlLmFzeW5jKSB7XG4gICAgICAgIC8vIFdlIG9ubHkgcHJvdmlkZSBsb2NhbCBjYWNoaW5nIG9mIGNvbmZpZyB3aXRoIHN5bmNocm9ub3VzIFN0b3JhZ2VcbiAgICAgICAgUGFyc2UuU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgUGFyc2UuX2dldFBhcnNlUGF0aChQYXJzZS5Db25maWcuX0NVUlJFTlRfQ09ORklHX0tFWSksXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzZXJ2ZXJEYXRhKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZyA9IG51bGw7XG5cbiAgUGFyc2UuQ29uZmlnLl9DVVJSRU5UX0NPTkZJR19LRVkgPSBcImN1cnJlbnRDb25maWdcIjtcblxufSh0aGlzKSk7XG5cblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBQYXJzZS5FcnJvciBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gY29kZSBhbmQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvZGUgQW4gZXJyb3IgY29kZSBjb25zdGFudCBmcm9tIDxjb2RlPlBhcnNlLkVycm9yPC9jb2RlPi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgQSBkZXRhaWxlZCBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IuXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5DbGFzcyB1c2VkIGZvciBhbGwgb2JqZWN0cyBwYXNzZWQgdG8gZXJyb3IgY2FsbGJhY2tzLjwvcD5cbiAgICovXG4gIFBhcnNlLkVycm9yID0gZnVuY3Rpb24oY29kZSwgbWVzc2FnZSkge1xuICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfTtcblxuICBfLmV4dGVuZChQYXJzZS5FcnJvciwgLyoqIEBsZW5kcyBQYXJzZS5FcnJvciAqLyB7XG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHNvbWUgZXJyb3Igb3RoZXIgdGhhbiB0aG9zZSBlbnVtZXJhdGVkIGhlcmUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgT1RIRVJfQ0FVU0U6IC0xLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgc29tZXRoaW5nIGhhcyBnb25lIHdyb25nIHdpdGggdGhlIHNlcnZlci5cbiAgICAgKiBJZiB5b3UgZ2V0IHRoaXMgZXJyb3IgY29kZSwgaXQgaXMgUGFyc2UncyBmYXVsdC4gQ29udGFjdCB1cyBhdCBcbiAgICAgKiBodHRwczovL3BhcnNlLmNvbS9oZWxwXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5URVJOQUxfU0VSVkVSX0VSUk9SOiAxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBQYXJzZSBzZXJ2ZXJzIGZhaWxlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBDT05ORUNUSU9OX0ZBSUxFRDogMTAwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgT0JKRUNUX05PVF9GT1VORDogMTAxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHlvdSB0cmllZCB0byBxdWVyeSB3aXRoIGEgZGF0YXR5cGUgdGhhdCBkb2Vzbid0XG4gICAgICogc3VwcG9ydCBpdCwgbGlrZSBleGFjdCBtYXRjaGluZyBhbiBhcnJheSBvciBvYmplY3QuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9RVUVSWTogMTAyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgbWlzc2luZyBvciBpbnZhbGlkIGNsYXNzbmFtZS4gQ2xhc3NuYW1lcyBhcmVcbiAgICAgKiBjYXNlLXNlbnNpdGl2ZS4gVGhleSBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIsIGFuZCBhLXpBLVowLTlfIGFyZSB0aGVcbiAgICAgKiBvbmx5IHZhbGlkIGNoYXJhY3RlcnMuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9DTEFTU19OQU1FOiAxMDMsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gdW5zcGVjaWZpZWQgb2JqZWN0IGlkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE1JU1NJTkdfT0JKRUNUX0lEOiAxMDQsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gaW52YWxpZCBrZXkgbmFtZS4gS2V5cyBhcmUgY2FzZS1zZW5zaXRpdmUuIFRoZXlcbiAgICAgKiBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIsIGFuZCBhLXpBLVowLTlfIGFyZSB0aGUgb25seSB2YWxpZCBjaGFyYWN0ZXJzLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfS0VZX05BTUU6IDEwNSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIG1hbGZvcm1lZCBwb2ludGVyLiBZb3Ugc2hvdWxkIG5vdCBzZWUgdGhpcyB1bmxlc3NcbiAgICAgKiB5b3UgaGF2ZSBiZWVuIG11Y2tpbmcgYWJvdXQgY2hhbmdpbmcgaW50ZXJuYWwgUGFyc2UgY29kZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX1BPSU5URVI6IDEwNixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGJhZGx5IGZvcm1lZCBKU09OIHdhcyByZWNlaXZlZCB1cHN0cmVhbS4gVGhpc1xuICAgICAqIGVpdGhlciBpbmRpY2F0ZXMgeW91IGhhdmUgZG9uZSBzb21ldGhpbmcgdW51c3VhbCB3aXRoIG1vZGlmeWluZyBob3dcbiAgICAgKiB0aGluZ3MgZW5jb2RlIHRvIEpTT04sIG9yIHRoZSBuZXR3b3JrIGlzIGZhaWxpbmcgYmFkbHkuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9KU09OOiAxMDcsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgZmVhdHVyZSB5b3UgdHJpZWQgdG8gYWNjZXNzIGlzIG9ubHlcbiAgICAgKiBhdmFpbGFibGUgaW50ZXJuYWxseSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBDT01NQU5EX1VOQVZBSUxBQkxFOiAxMDgsXG5cbiAgICAvKipcbiAgICAgKiBZb3UgbXVzdCBjYWxsIFBhcnNlLmluaXRpYWxpemUgYmVmb3JlIHVzaW5nIHRoZSBQYXJzZSBsaWJyYXJ5LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE5PVF9JTklUSUFMSVpFRDogMTA5LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSBmaWVsZCB3YXMgc2V0IHRvIGFuIGluY29uc2lzdGVudCB0eXBlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOQ09SUkVDVF9UWVBFOiAxMTEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gaW52YWxpZCBjaGFubmVsIG5hbWUuIEEgY2hhbm5lbCBuYW1lIGlzIGVpdGhlclxuICAgICAqIGFuIGVtcHR5IHN0cmluZyAodGhlIGJyb2FkY2FzdCBjaGFubmVsKSBvciBjb250YWlucyBvbmx5IGEtekEtWjAtOV9cbiAgICAgKiBjaGFyYWN0ZXJzIGFuZCBzdGFydHMgd2l0aCBhIGxldHRlci5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0NIQU5ORUxfTkFNRTogMTEyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgcHVzaCBpcyBtaXNjb25maWd1cmVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFBVU0hfTUlTQ09ORklHVVJFRDogMTE1LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIG9iamVjdCBpcyB0b28gbGFyZ2UuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgT0JKRUNUX1RPT19MQVJHRTogMTE2LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIG9wZXJhdGlvbiBpc24ndCBhbGxvd2VkIGZvciBjbGllbnRzLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE9QRVJBVElPTl9GT1JCSURERU46IDExOSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGUgcmVzdWx0IHdhcyBub3QgZm91bmQgaW4gdGhlIGNhY2hlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIENBQ0hFX01JU1M6IDEyMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGFuIGludmFsaWQga2V5IHdhcyB1c2VkIGluIGEgbmVzdGVkXG4gICAgICogSlNPTk9iamVjdC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX05FU1RFRF9LRVk6IDEyMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGFuIGludmFsaWQgZmlsZW5hbWUgd2FzIHVzZWQgZm9yIFBhcnNlRmlsZS5cbiAgICAgKiBBIHZhbGlkIGZpbGUgbmFtZSBjb250YWlucyBvbmx5IGEtekEtWjAtOV8uIGNoYXJhY3RlcnMgYW5kIGlzIGJldHdlZW4gMVxuICAgICAqIGFuZCAxMjggY2hhcmFjdGVycy5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0ZJTEVfTkFNRTogMTIyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQgQUNMIHdhcyBwcm92aWRlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0FDTDogMTIzLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIHJlcXVlc3QgdGltZWQgb3V0IG9uIHRoZSBzZXJ2ZXIuIFR5cGljYWxseVxuICAgICAqIHRoaXMgaW5kaWNhdGVzIHRoYXQgdGhlIHJlcXVlc3QgaXMgdG9vIGV4cGVuc2l2ZSB0byBydW4uXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgVElNRU9VVDogMTI0LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGVtYWlsIGFkZHJlc3Mgd2FzIGludmFsaWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9FTUFJTF9BRERSRVNTOiAxMjUsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSBtaXNzaW5nIGNvbnRlbnQgdHlwZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBNSVNTSU5HX0NPTlRFTlRfVFlQRTogMTI2LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgbWlzc2luZyBjb250ZW50IGxlbmd0aC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBNSVNTSU5HX0NPTlRFTlRfTEVOR1RIOiAxMjcsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gaW52YWxpZCBjb250ZW50IGxlbmd0aC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0NPTlRFTlRfTEVOR1RIOiAxMjgsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSBmaWxlIHRoYXQgd2FzIHRvbyBsYXJnZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBGSUxFX1RPT19MQVJHRTogMTI5LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGVycm9yIHNhdmluZyBhIGZpbGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRklMRV9TQVZFX0VSUk9SOiAxMzAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVuaXF1ZSBmaWVsZCB3YXMgZ2l2ZW4gYSB2YWx1ZSB0aGF0IGlzXG4gICAgICogYWxyZWFkeSB0YWtlbi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBEVVBMSUNBVEVfVkFMVUU6IDEzNyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgcm9sZSdzIG5hbWUgaXMgaW52YWxpZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX1JPTEVfTkFNRTogMTM5LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYW4gYXBwbGljYXRpb24gcXVvdGEgd2FzIGV4Y2VlZGVkLiAgVXBncmFkZSB0b1xuICAgICAqIHJlc29sdmUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRVhDRUVERURfUVVPVEE6IDE0MCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgQ2xvdWQgQ29kZSBzY3JpcHQgZmFpbGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFNDUklQVF9GQUlMRUQ6IDE0MSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgQ2xvdWQgQ29kZSB2YWxpZGF0aW9uIGZhaWxlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBWQUxJREFUSU9OX0VSUk9SOiAxNDIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBpbnZhbGlkIGltYWdlIGRhdGEgd2FzIHByb3ZpZGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfSU1BR0VfREFUQTogMTUwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIHVuc2F2ZWQgZmlsZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBVTlNBVkVEX0ZJTEVfRVJST1I6IDE1MSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIHB1c2ggdGltZS5cbiAgICAgKi9cbiAgICBJTlZBTElEX1BVU0hfVElNRV9FUlJPUjogMTUyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGVycm9yIGRlbGV0aW5nIGEgZmlsZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBGSUxFX0RFTEVURV9FUlJPUjogMTUzLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGFwcGxpY2F0aW9uIGhhcyBleGNlZWRlZCBpdHMgcmVxdWVzdFxuICAgICAqIGxpbWl0LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFJFUVVFU1RfTElNSVRfRVhDRUVERUQ6IDE1NSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIGV2ZW50IG5hbWUuXG4gICAgICovXG4gICAgSU5WQUxJRF9FVkVOVF9OQU1FOiAxNjAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgdXNlcm5hbWUgaXMgbWlzc2luZyBvciBlbXB0eS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBVU0VSTkFNRV9NSVNTSU5HOiAyMDAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgcGFzc3dvcmQgaXMgbWlzc2luZyBvciBlbXB0eS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBQQVNTV09SRF9NSVNTSU5HOiAyMDEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgdXNlcm5hbWUgaGFzIGFscmVhZHkgYmVlbiB0YWtlbi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBVU0VSTkFNRV9UQUtFTjogMjAyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGVtYWlsIGhhcyBhbHJlYWR5IGJlZW4gdGFrZW4uXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRU1BSUxfVEFLRU46IDIwMyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBlbWFpbCBpcyBtaXNzaW5nLCBidXQgbXVzdCBiZSBzcGVjaWZpZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRU1BSUxfTUlTU0lORzogMjA0LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSB1c2VyIHdpdGggdGhlIHNwZWNpZmllZCBlbWFpbCB3YXMgbm90IGZvdW5kLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEVNQUlMX05PVF9GT1VORDogMjA1LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSB1c2VyIG9iamVjdCB3aXRob3V0IGEgdmFsaWQgc2Vzc2lvbiBjb3VsZFxuICAgICAqIG5vdCBiZSBhbHRlcmVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFNFU1NJT05fTUlTU0lORzogMjA2LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSB1c2VyIGNhbiBvbmx5IGJlIGNyZWF0ZWQgdGhyb3VnaCBzaWdudXAuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTVVTVF9DUkVBVEVfVVNFUl9USFJPVUdIX1NJR05VUDogMjA3LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYW4gYW4gYWNjb3VudCBiZWluZyBsaW5rZWQgaXMgYWxyZWFkeSBsaW5rZWRcbiAgICAgKiB0byBhbm90aGVyIHVzZXIuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgQUNDT1VOVF9BTFJFQURZX0xJTktFRDogMjA4LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0b2tlbiBpcyBpbnZhbGlkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfU0VTU0lPTl9UT0tFTjogMjA5LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSB1c2VyIGNhbm5vdCBiZSBsaW5rZWQgdG8gYW4gYWNjb3VudCBiZWNhdXNlXG4gICAgICogdGhhdCBhY2NvdW50J3MgaWQgY291bGQgbm90IGJlIGZvdW5kLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIExJTktFRF9JRF9NSVNTSU5HOiAyNTAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgd2l0aCBhIGxpbmtlZCAoZS5nLiBGYWNlYm9vaykgYWNjb3VudFxuICAgICAqIGhhcyBhbiBpbnZhbGlkIHNlc3Npb24uXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9MSU5LRURfU0VTU0lPTjogMjUxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSBzZXJ2aWNlIGJlaW5nIGxpbmtlZCAoZS5nLiBGYWNlYm9vayBvclxuICAgICAqIFR3aXR0ZXIpIGlzIHVuc3VwcG9ydGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFVOU1VQUE9SVEVEX1NFUlZJQ0U6IDI1MixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZXJlIHdlcmUgbXVsdGlwbGUgZXJyb3JzLiBBZ2dyZWdhdGUgZXJyb3JzXG4gICAgICogaGF2ZSBhbiBcImVycm9yc1wiIHByb3BlcnR5LCB3aGljaCBpcyBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzIHdpdGggbW9yZVxuICAgICAqIGRldGFpbCBhYm91dCBlYWNoIGVycm9yIHRoYXQgb2NjdXJyZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgQUdHUkVHQVRFX0VSUk9SOiA2MDAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhlIGNsaWVudCB3YXMgdW5hYmxlIHRvIHJlYWQgYW4gaW5wdXQgZmlsZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBGSUxFX1JFQURfRVJST1I6IDYwMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIHJlYWwgZXJyb3IgY29kZSBpcyB1bmF2YWlsYWJsZSBiZWNhdXNlXG4gICAgICogd2UgaGFkIHRvIHVzZSBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3QgdG8gYWxsb3cgQ09SUyByZXF1ZXN0cyBpblxuICAgICAqIEludGVybmV0IEV4cGxvcmVyLCB3aGljaCBzdHJpcHMgdGhlIGJvZHkgZnJvbSBIVFRQIHJlc3BvbnNlcyB0aGF0IGhhdmVcbiAgICAgKiBhIG5vbi0yWFggc3RhdHVzIGNvZGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgWF9ET01BSU5fUkVRVUVTVDogNjAyXG4gIH0pO1xuXG59KHRoaXMpKTtcblxuLypnbG9iYWwgXzogZmFsc2UgKi9cbihmdW5jdGlvbigpIHtcbiAgdmFyIHJvb3QgPSB0aGlzO1xuICB2YXIgUGFyc2UgPSAocm9vdC5QYXJzZSB8fCAocm9vdC5QYXJzZSA9IHt9KSk7XG4gIHZhciBldmVudFNwbGl0dGVyID0gL1xccysvO1xuICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5QYXJzZS5FdmVudHMgaXMgYSBmb3JrIG9mIEJhY2tib25lJ3MgRXZlbnRzIG1vZHVsZSwgcHJvdmlkZWQgZm9yIHlvdXJcbiAgICogY29udmVuaWVuY2UuPC9wPlxuICAgKlxuICAgKiA8cD5BIG1vZHVsZSB0aGF0IGNhbiBiZSBtaXhlZCBpbiB0byBhbnkgb2JqZWN0IGluIG9yZGVyIHRvIHByb3ZpZGVcbiAgICogaXQgd2l0aCBjdXN0b20gZXZlbnRzLiBZb3UgbWF5IGJpbmQgY2FsbGJhY2sgZnVuY3Rpb25zIHRvIGFuIGV2ZW50XG4gICAqIHdpdGggYG9uYCwgb3IgcmVtb3ZlIHRoZXNlIGZ1bmN0aW9ucyB3aXRoIGBvZmZgLlxuICAgKiBUcmlnZ2VyaW5nIGFuIGV2ZW50IGZpcmVzIGFsbCBjYWxsYmFja3MgaW4gdGhlIG9yZGVyIHRoYXQgYG9uYCB3YXNcbiAgICogY2FsbGVkLlxuICAgKlxuICAgKiA8cHJlPlxuICAgKiAgICAgdmFyIG9iamVjdCA9IHt9O1xuICAgKiAgICAgXy5leHRlbmQob2JqZWN0LCBQYXJzZS5FdmVudHMpO1xuICAgKiAgICAgb2JqZWN0Lm9uKCdleHBhbmQnLCBmdW5jdGlvbigpeyBhbGVydCgnZXhwYW5kZWQnKTsgfSk7XG4gICAqICAgICBvYmplY3QudHJpZ2dlcignZXhwYW5kJyk7PC9wcmU+PC9wPlxuICAgKlxuICAgKiA8cD5Gb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZVxuICAgKiA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jRXZlbnRzXCI+QmFja2JvbmVcbiAgICogZG9jdW1lbnRhdGlvbjwvYT4uPC9wPlxuICAgKi9cbiAgUGFyc2UuRXZlbnRzID0ge1xuICAgIC8qKlxuICAgICAqIEJpbmQgb25lIG9yIG1vcmUgc3BhY2Ugc2VwYXJhdGVkIGV2ZW50cywgYGV2ZW50c2AsIHRvIGEgYGNhbGxiYWNrYFxuICAgICAqIGZ1bmN0aW9uLiBQYXNzaW5nIGBcImFsbFwiYCB3aWxsIGJpbmQgdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcblxuICAgICAgdmFyIGNhbGxzLCBldmVudCwgbm9kZSwgdGFpbCwgbGlzdDtcbiAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBldmVudHMgPSBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcik7XG4gICAgICBjYWxscyA9IHRoaXMuX2NhbGxiYWNrcyB8fCAodGhpcy5fY2FsbGJhY2tzID0ge30pO1xuXG4gICAgICAvLyBDcmVhdGUgYW4gaW1tdXRhYmxlIGNhbGxiYWNrIGxpc3QsIGFsbG93aW5nIHRyYXZlcnNhbCBkdXJpbmdcbiAgICAgIC8vIG1vZGlmaWNhdGlvbi4gIFRoZSB0YWlsIGlzIGFuIGVtcHR5IG9iamVjdCB0aGF0IHdpbGwgYWx3YXlzIGJlIHVzZWRcbiAgICAgIC8vIGFzIHRoZSBuZXh0IG5vZGUuXG4gICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgd2hpbGUgKGV2ZW50KSB7XG4gICAgICAgIGxpc3QgPSBjYWxsc1tldmVudF07XG4gICAgICAgIG5vZGUgPSBsaXN0ID8gbGlzdC50YWlsIDoge307XG4gICAgICAgIG5vZGUubmV4dCA9IHRhaWwgPSB7fTtcbiAgICAgICAgbm9kZS5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgbm9kZS5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsc1tldmVudF0gPSB7dGFpbDogdGFpbCwgbmV4dDogbGlzdCA/IGxpc3QubmV4dCA6IG5vZGV9O1xuICAgICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIG9uZSBvciBtYW55IGNhbGxiYWNrcy4gSWYgYGNvbnRleHRgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrc1xuICAgICAqIHdpdGggdGhhdCBmdW5jdGlvbi4gSWYgYGNhbGxiYWNrYCBpcyBudWxsLCByZW1vdmVzIGFsbCBjYWxsYmFja3MgZm9yIHRoZVxuICAgICAqIGV2ZW50LiBJZiBgZXZlbnRzYCBpcyBudWxsLCByZW1vdmVzIGFsbCBib3VuZCBjYWxsYmFja3MgZm9yIGFsbCBldmVudHMuXG4gICAgICovXG4gICAgb2ZmOiBmdW5jdGlvbihldmVudHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICB2YXIgZXZlbnQsIGNhbGxzLCBub2RlLCB0YWlsLCBjYiwgY3R4O1xuXG4gICAgICAvLyBObyBldmVudHMsIG9yIHJlbW92aW5nICphbGwqIGV2ZW50cy5cbiAgICAgIGlmICghKGNhbGxzID0gdGhpcy5fY2FsbGJhY2tzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIShldmVudHMgfHwgY2FsbGJhY2sgfHwgY29udGV4dCkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgbGlzdGVkIGV2ZW50cyBhbmQgY29udGV4dHMsIHNwbGljaW5nIHRoZW0gb3V0IG9mIHRoZVxuICAgICAgLy8gbGlua2VkIGxpc3Qgb2YgY2FsbGJhY2tzIGlmIGFwcHJvcHJpYXRlLlxuICAgICAgZXZlbnRzID0gZXZlbnRzID8gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpIDogT2JqZWN0LmtleXMoY2FsbHMpO1xuICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgIHdoaWxlIChldmVudCkge1xuICAgICAgICBub2RlID0gY2FsbHNbZXZlbnRdO1xuICAgICAgICBkZWxldGUgY2FsbHNbZXZlbnRdO1xuICAgICAgICBpZiAoIW5vZGUgfHwgIShjYWxsYmFjayB8fCBjb250ZXh0KSkge1xuICAgICAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGxpc3QsIG9taXR0aW5nIHRoZSBpbmRpY2F0ZWQgY2FsbGJhY2tzLlxuICAgICAgICB0YWlsID0gbm9kZS50YWlsO1xuICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICB3aGlsZSAobm9kZSAhPT0gdGFpbCkge1xuICAgICAgICAgIGNiID0gbm9kZS5jYWxsYmFjaztcbiAgICAgICAgICBjdHggPSBub2RlLmNvbnRleHQ7XG4gICAgICAgICAgaWYgKChjYWxsYmFjayAmJiBjYiAhPT0gY2FsbGJhY2spIHx8IChjb250ZXh0ICYmIGN0eCAhPT0gY29udGV4dCkpIHtcbiAgICAgICAgICAgIHRoaXMub24oZXZlbnQsIGNiLCBjdHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIG9uZSBvciBtYW55IGV2ZW50cywgZmlyaW5nIGFsbCBib3VuZCBjYWxsYmFja3MuIENhbGxiYWNrcyBhcmVcbiAgICAgKiBwYXNzZWQgdGhlIHNhbWUgYXJndW1lbnRzIGFzIGB0cmlnZ2VyYCBpcywgYXBhcnQgZnJvbSB0aGUgZXZlbnQgbmFtZVxuICAgICAqICh1bmxlc3MgeW91J3JlIGxpc3RlbmluZyBvbiBgXCJhbGxcImAsIHdoaWNoIHdpbGwgY2F1c2UgeW91ciBjYWxsYmFjayB0b1xuICAgICAqIHJlY2VpdmUgdGhlIHRydWUgbmFtZSBvZiB0aGUgZXZlbnQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50KS5cbiAgICAgKi9cbiAgICB0cmlnZ2VyOiBmdW5jdGlvbihldmVudHMpIHtcbiAgICAgIHZhciBldmVudCwgbm9kZSwgY2FsbHMsIHRhaWwsIGFyZ3MsIGFsbCwgcmVzdDtcbiAgICAgIGlmICghKGNhbGxzID0gdGhpcy5fY2FsbGJhY2tzKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGFsbCA9IGNhbGxzLmFsbDtcbiAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcbiAgICAgIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgIC8vIEZvciBlYWNoIGV2ZW50LCB3YWxrIHRocm91Z2ggdGhlIGxpbmtlZCBsaXN0IG9mIGNhbGxiYWNrcyB0d2ljZSxcbiAgICAgIC8vIGZpcnN0IHRvIHRyaWdnZXIgdGhlIGV2ZW50LCB0aGVuIHRvIHRyaWdnZXIgYW55IGBcImFsbFwiYCBjYWxsYmFja3MuXG4gICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgd2hpbGUgKGV2ZW50KSB7XG4gICAgICAgIG5vZGUgPSBjYWxsc1tldmVudF07XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgdGFpbCA9IG5vZGUudGFpbDtcbiAgICAgICAgICB3aGlsZSAoKG5vZGUgPSBub2RlLm5leHQpICE9PSB0YWlsKSB7XG4gICAgICAgICAgICBub2RlLmNhbGxiYWNrLmFwcGx5KG5vZGUuY29udGV4dCB8fCB0aGlzLCByZXN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IGFsbDtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0YWlsID0gbm9kZS50YWlsO1xuICAgICAgICAgIGFyZ3MgPSBbZXZlbnRdLmNvbmNhdChyZXN0KTtcbiAgICAgICAgICB3aGlsZSAoKG5vZGUgPSBub2RlLm5leHQpICE9PSB0YWlsKSB7XG4gICAgICAgICAgICBub2RlLmNhbGxiYWNrLmFwcGx5KG5vZGUuY29udGV4dCB8fCB0aGlzLCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9OyAgXG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgUGFyc2UuRXZlbnRzLmJpbmQgPSBQYXJzZS5FdmVudHMub247XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgUGFyc2UuRXZlbnRzLnVuYmluZCA9IFBhcnNlLkV2ZW50cy5vZmY7XG59LmNhbGwodGhpcykpO1xuXG5cbi8qZ2xvYmFsIG5hdmlnYXRvcjogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgR2VvUG9pbnQgd2l0aCBhbnkgb2YgdGhlIGZvbGxvd2luZyBmb3Jtczo8YnI+XG4gICAqICAgPHByZT5cbiAgICogICBuZXcgR2VvUG9pbnQob3RoZXJHZW9Qb2ludClcbiAgICogICBuZXcgR2VvUG9pbnQoMzAsIDMwKVxuICAgKiAgIG5ldyBHZW9Qb2ludChbMzAsIDMwXSlcbiAgICogICBuZXcgR2VvUG9pbnQoe2xhdGl0dWRlOiAzMCwgbG9uZ2l0dWRlOiAzMH0pXG4gICAqICAgbmV3IEdlb1BvaW50KCkgIC8vIGRlZmF1bHRzIHRvICgwLCAwKVxuICAgKiAgIDwvcHJlPlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+UmVwcmVzZW50cyBhIGxhdGl0dWRlIC8gbG9uZ2l0dWRlIHBvaW50IHRoYXQgbWF5IGJlIGFzc29jaWF0ZWRcbiAgICogd2l0aCBhIGtleSBpbiBhIFBhcnNlT2JqZWN0IG9yIHVzZWQgYXMgYSByZWZlcmVuY2UgcG9pbnQgZm9yIGdlbyBxdWVyaWVzLlxuICAgKiBUaGlzIGFsbG93cyBwcm94aW1pdHktYmFzZWQgcXVlcmllcyBvbiB0aGUga2V5LjwvcD5cbiAgICpcbiAgICogPHA+T25seSBvbmUga2V5IGluIGEgY2xhc3MgbWF5IGNvbnRhaW4gYSBHZW9Qb2ludC48L3A+XG4gICAqXG4gICAqIDxwPkV4YW1wbGU6PHByZT5cbiAgICogICB2YXIgcG9pbnQgPSBuZXcgUGFyc2UuR2VvUG9pbnQoMzAuMCwgLTIwLjApO1xuICAgKiAgIHZhciBvYmplY3QgPSBuZXcgUGFyc2UuT2JqZWN0KFwiUGxhY2VPYmplY3RcIik7XG4gICAqICAgb2JqZWN0LnNldChcImxvY2F0aW9uXCIsIHBvaW50KTtcbiAgICogICBvYmplY3Quc2F2ZSgpOzwvcHJlPjwvcD5cbiAgICovXG4gIFBhcnNlLkdlb1BvaW50ID0gZnVuY3Rpb24oYXJnMSwgYXJnMikge1xuICAgIGlmIChfLmlzQXJyYXkoYXJnMSkpIHtcbiAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZShhcmcxWzBdLCBhcmcxWzFdKTtcbiAgICAgIHRoaXMubGF0aXR1ZGUgPSBhcmcxWzBdO1xuICAgICAgdGhpcy5sb25naXR1ZGUgPSBhcmcxWzFdO1xuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChhcmcxKSkge1xuICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKGFyZzEubGF0aXR1ZGUsIGFyZzEubG9uZ2l0dWRlKTtcbiAgICAgIHRoaXMubGF0aXR1ZGUgPSBhcmcxLmxhdGl0dWRlO1xuICAgICAgdGhpcy5sb25naXR1ZGUgPSBhcmcxLmxvbmdpdHVkZTtcbiAgICB9IGVsc2UgaWYgKF8uaXNOdW1iZXIoYXJnMSkgJiYgXy5pc051bWJlcihhcmcyKSkge1xuICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKGFyZzEsIGFyZzIpO1xuICAgICAgdGhpcy5sYXRpdHVkZSA9IGFyZzE7XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF0aXR1ZGUgPSAwO1xuICAgICAgdGhpcy5sb25naXR1ZGUgPSAwO1xuICAgIH1cblxuICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHNvIHRoYXQgYW55b25lIHVzaW5nIFdlYmtpdCBvciBNb3ppbGxhIHdpbGwgZ2V0IGFuIGVycm9yXG4gICAgLy8gaWYgdGhleSB0cnkgdG8gc2V0IHZhbHVlcyB0aGF0IGFyZSBvdXQgb2YgYm91bmRzLlxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAodGhpcy5fX2RlZmluZUdldHRlcl9fICYmIHRoaXMuX19kZWZpbmVTZXR0ZXJfXykge1xuICAgICAgLy8gVXNlIF9sYXRpdHVkZSBhbmQgX2xvbmdpdHVkZSB0byBhY3R1YWxseSBzdG9yZSB0aGUgdmFsdWVzLCBhbmQgYWRkXG4gICAgICAvLyBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGZvciBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlLlxuICAgICAgdGhpcy5fbGF0aXR1ZGUgPSB0aGlzLmxhdGl0dWRlO1xuICAgICAgdGhpcy5fbG9uZ2l0dWRlID0gdGhpcy5sb25naXR1ZGU7XG4gICAgICB0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJsYXRpdHVkZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2xhdGl0dWRlO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJsb25naXR1ZGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9sb25naXR1ZGU7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX19kZWZpbmVTZXR0ZXJfXyhcImxhdGl0dWRlXCIsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUodmFsLCBzZWxmLmxvbmdpdHVkZSk7XG4gICAgICAgIHNlbGYuX2xhdGl0dWRlID0gdmFsO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9fZGVmaW5lU2V0dGVyX18oXCJsb25naXR1ZGVcIiwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZShzZWxmLmxhdGl0dWRlLCB2YWwpO1xuICAgICAgICBzZWxmLl9sb25naXR1ZGUgPSB2YWw7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBsZW5kcyBQYXJzZS5HZW9Qb2ludC5wcm90b3R5cGVcbiAgICogQHByb3BlcnR5IHtmbG9hdH0gbGF0aXR1ZGUgTm9ydGgtc291dGggcG9ydGlvbiBvZiB0aGUgY29vcmRpbmF0ZSwgaW4gcmFuZ2VcbiAgICogICBbLTkwLCA5MF0uICBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHNldCBvdXQgb2YgcmFuZ2UgaW4gYSBtb2Rlcm4gYnJvd3Nlci5cbiAgICogQHByb3BlcnR5IHtmbG9hdH0gbG9uZ2l0dWRlIEVhc3Qtd2VzdCBwb3J0aW9uIG9mIHRoZSBjb29yZGluYXRlLCBpbiByYW5nZVxuICAgKiAgIFstMTgwLCAxODBdLiAgVGhyb3dzIGlmIHNldCBvdXQgb2YgcmFuZ2UgaW4gYSBtb2Rlcm4gYnJvd3Nlci5cbiAgICovXG5cbiAgLyoqXG4gICAqIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlIGdpdmVuIGxhdC1sb25nIGlzIG91dCBvZiBib3VuZHMuXG4gICAqL1xuICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUgPSBmdW5jdGlvbihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gICAgaWYgKGxhdGl0dWRlIDwgLTkwLjApIHtcbiAgICAgIHRocm93IFwiUGFyc2UuR2VvUG9pbnQgbGF0aXR1ZGUgXCIgKyBsYXRpdHVkZSArIFwiIDwgLTkwLjAuXCI7XG4gICAgfVxuICAgIGlmIChsYXRpdHVkZSA+IDkwLjApIHtcbiAgICAgIHRocm93IFwiUGFyc2UuR2VvUG9pbnQgbGF0aXR1ZGUgXCIgKyBsYXRpdHVkZSArIFwiID4gOTAuMC5cIjtcbiAgICB9XG4gICAgaWYgKGxvbmdpdHVkZSA8IC0xODAuMCkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5HZW9Qb2ludCBsb25naXR1ZGUgXCIgKyBsb25naXR1ZGUgKyBcIiA8IC0xODAuMC5cIjtcbiAgICB9XG4gICAgaWYgKGxvbmdpdHVkZSA+IDE4MC4wKSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLkdlb1BvaW50IGxvbmdpdHVkZSBcIiArIGxvbmdpdHVkZSArIFwiID4gMTgwLjAuXCI7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgR2VvUG9pbnQgd2l0aCB0aGUgdXNlcidzIGN1cnJlbnQgbG9jYXRpb24sIGlmIGF2YWlsYWJsZS5cbiAgICogQ2FsbHMgb3B0aW9ucy5zdWNjZXNzIHdpdGggYSBuZXcgR2VvUG9pbnQgaW5zdGFuY2Ugb3IgY2FsbHMgb3B0aW9ucy5lcnJvci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggc3VjY2VzcyBhbmQgZXJyb3IgY2FsbGJhY2tzLlxuICAgKi9cbiAgUGFyc2UuR2VvUG9pbnQuY3VycmVudCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgcHJvbWlzZS5yZXNvbHZlKG5ldyBQYXJzZS5HZW9Qb2ludCh7XG4gICAgICAgIGxhdGl0dWRlOiBsb2NhdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgIGxvbmdpdHVkZTogbG9jYXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgICAgfSkpO1xuXG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIFBhcnNlLkdlb1BvaW50LnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgR2VvUG9pbnQsIHN1aXRhYmxlIGZvciBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZSh0aGlzLmxhdGl0dWRlLCB0aGlzLmxvbmdpdHVkZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcIl9fdHlwZVwiOiBcIkdlb1BvaW50XCIsXG4gICAgICAgIGxhdGl0dWRlOiB0aGlzLmxhdGl0dWRlLFxuICAgICAgICBsb25naXR1ZGU6IHRoaXMubG9uZ2l0dWRlXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoaXMgR2VvUG9pbnQgdG8gYW5vdGhlciBpbiByYWRpYW5zLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IHRoZSBvdGhlciBQYXJzZS5HZW9Qb2ludC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgcmFkaWFuc1RvOiBmdW5jdGlvbihwb2ludCkge1xuICAgICAgdmFyIGQyciA9IE1hdGguUEkgLyAxODAuMDtcbiAgICAgIHZhciBsYXQxcmFkID0gdGhpcy5sYXRpdHVkZSAqIGQycjtcbiAgICAgIHZhciBsb25nMXJhZCA9IHRoaXMubG9uZ2l0dWRlICogZDJyO1xuICAgICAgdmFyIGxhdDJyYWQgPSBwb2ludC5sYXRpdHVkZSAqIGQycjtcbiAgICAgIHZhciBsb25nMnJhZCA9IHBvaW50LmxvbmdpdHVkZSAqIGQycjtcbiAgICAgIHZhciBkZWx0YUxhdCA9IGxhdDFyYWQgLSBsYXQycmFkO1xuICAgICAgdmFyIGRlbHRhTG9uZyA9IGxvbmcxcmFkIC0gbG9uZzJyYWQ7XG4gICAgICB2YXIgc2luRGVsdGFMYXREaXYyID0gTWF0aC5zaW4oZGVsdGFMYXQgLyAyKTtcbiAgICAgIHZhciBzaW5EZWx0YUxvbmdEaXYyID0gTWF0aC5zaW4oZGVsdGFMb25nIC8gMik7XG4gICAgICAvLyBTcXVhcmUgb2YgaGFsZiB0aGUgc3RyYWlnaHQgbGluZSBjaG9yZCBkaXN0YW5jZSBiZXR3ZWVuIGJvdGggcG9pbnRzLlxuICAgICAgdmFyIGEgPSAoKHNpbkRlbHRhTGF0RGl2MiAqIHNpbkRlbHRhTGF0RGl2MikgK1xuICAgICAgICAgICAgICAgKE1hdGguY29zKGxhdDFyYWQpICogTWF0aC5jb3MobGF0MnJhZCkgKlxuICAgICAgICAgICAgICAgIHNpbkRlbHRhTG9uZ0RpdjIgKiBzaW5EZWx0YUxvbmdEaXYyKSk7XG4gICAgICBhID0gTWF0aC5taW4oMS4wLCBhKTtcbiAgICAgIHJldHVybiAyICogTWF0aC5hc2luKE1hdGguc3FydChhKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhpcyBHZW9Qb2ludCB0byBhbm90aGVyIGluIGtpbG9tZXRlcnMuXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgdGhlIG90aGVyIFBhcnNlLkdlb1BvaW50LlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBraWxvbWV0ZXJzVG86IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yYWRpYW5zVG8ocG9pbnQpICogNjM3MS4wO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoaXMgR2VvUG9pbnQgdG8gYW5vdGhlciBpbiBtaWxlcy5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCB0aGUgb3RoZXIgUGFyc2UuR2VvUG9pbnQuXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIG1pbGVzVG86IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yYWRpYW5zVG8ocG9pbnQpICogMzk1OC44O1xuICAgIH1cbiAgfTtcbn0odGhpcykpO1xuXG4vKmdsb2JhbCBuYXZpZ2F0b3I6IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIHZhciBQVUJMSUNfS0VZID0gXCIqXCI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQUNMLlxuICAgKiBJZiBubyBhcmd1bWVudCBpcyBnaXZlbiwgdGhlIEFDTCBoYXMgbm8gcGVybWlzc2lvbnMgZm9yIGFueW9uZS5cbiAgICogSWYgdGhlIGFyZ3VtZW50IGlzIGEgUGFyc2UuVXNlciwgdGhlIEFDTCB3aWxsIGhhdmUgcmVhZCBhbmQgd3JpdGVcbiAgICogICBwZXJtaXNzaW9uIGZvciBvbmx5IHRoYXQgdXNlci5cbiAgICogSWYgdGhlIGFyZ3VtZW50IGlzIGFueSBvdGhlciBKU09OIG9iamVjdCwgdGhhdCBvYmplY3Qgd2lsbCBiZSBpbnRlcnByZXR0ZWRcbiAgICogICBhcyBhIHNlcmlhbGl6ZWQgQUNMIGNyZWF0ZWQgd2l0aCB0b0pTT04oKS5cbiAgICogQHNlZSBQYXJzZS5PYmplY3Qjc2V0QUNMXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5BbiBBQ0wsIG9yIEFjY2VzcyBDb250cm9sIExpc3QgY2FuIGJlIGFkZGVkIHRvIGFueVxuICAgKiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+IHRvIHJlc3RyaWN0IGFjY2VzcyB0byBvbmx5IGEgc3Vic2V0IG9mIHVzZXJzXG4gICAqIG9mIHlvdXIgYXBwbGljYXRpb24uPC9wPlxuICAgKi9cbiAgUGFyc2UuQUNMID0gZnVuY3Rpb24oYXJnMSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnBlcm1pc3Npb25zQnlJZCA9IHt9O1xuICAgIGlmIChfLmlzT2JqZWN0KGFyZzEpKSB7XG4gICAgICBpZiAoYXJnMSBpbnN0YW5jZW9mIFBhcnNlLlVzZXIpIHtcbiAgICAgICAgc2VsZi5zZXRSZWFkQWNjZXNzKGFyZzEsIHRydWUpO1xuICAgICAgICBzZWxmLnNldFdyaXRlQWNjZXNzKGFyZzEsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihhcmcxKSkge1xuICAgICAgICAgIHRocm93IFwiUGFyc2UuQUNMKCkgY2FsbGVkIHdpdGggYSBmdW5jdGlvbi4gIERpZCB5b3UgZm9yZ2V0ICgpP1wiO1xuICAgICAgICB9XG4gICAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGFyZzEsIGZ1bmN0aW9uKGFjY2Vzc0xpc3QsIHVzZXJJZCkge1xuICAgICAgICAgIGlmICghXy5pc1N0cmluZyh1c2VySWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlRyaWVkIHRvIGNyZWF0ZSBhbiBBQ0wgd2l0aCBhbiBpbnZhbGlkIHVzZXJJZC5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXSA9IHt9O1xuICAgICAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGFjY2Vzc0xpc3QsIGZ1bmN0aW9uKGFsbG93ZWQsIHBlcm1pc3Npb24pIHtcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9uICE9PSBcInJlYWRcIiAmJiBwZXJtaXNzaW9uICE9PSBcIndyaXRlXCIpIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJUcmllZCB0byBjcmVhdGUgYW4gQUNMIHdpdGggYW4gaW52YWxpZCBwZXJtaXNzaW9uIHR5cGUuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIV8uaXNCb29sZWFuKGFsbG93ZWQpKSB7XG4gICAgICAgICAgICAgIHRocm93IFwiVHJpZWQgdG8gY3JlYXRlIGFuIEFDTCB3aXRoIGFuIGludmFsaWQgcGVybWlzc2lvbiB2YWx1ZS5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYucGVybWlzc2lvbnNCeUlkW3VzZXJJZF1bcGVybWlzc2lvbl0gPSBhbGxvd2VkO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBKU09OLWVuY29kZWQgdmVyc2lvbiBvZiB0aGUgQUNMLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLmNsb25lKHRoaXMucGVybWlzc2lvbnNCeUlkKTtcbiAgfTtcblxuICBQYXJzZS5BQ0wucHJvdG90eXBlLl9zZXRBY2Nlc3MgPSBmdW5jdGlvbihhY2Nlc3NUeXBlLCB1c2VySWQsIGFsbG93ZWQpIHtcbiAgICBpZiAodXNlcklkIGluc3RhbmNlb2YgUGFyc2UuVXNlcikge1xuICAgICAgdXNlcklkID0gdXNlcklkLmlkO1xuICAgIH0gZWxzZSBpZiAodXNlcklkIGluc3RhbmNlb2YgUGFyc2UuUm9sZSkge1xuICAgICAgdXNlcklkID0gXCJyb2xlOlwiICsgdXNlcklkLmdldE5hbWUoKTtcbiAgICB9XG4gICAgaWYgKCFfLmlzU3RyaW5nKHVzZXJJZCkpIHtcbiAgICAgIHRocm93IFwidXNlcklkIG11c3QgYmUgYSBzdHJpbmcuXCI7XG4gICAgfVxuICAgIGlmICghXy5pc0Jvb2xlYW4oYWxsb3dlZCkpIHtcbiAgICAgIHRocm93IFwiYWxsb3dlZCBtdXN0IGJlIGVpdGhlciB0cnVlIG9yIGZhbHNlLlwiO1xuICAgIH1cbiAgICB2YXIgcGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdO1xuICAgIGlmICghcGVybWlzc2lvbnMpIHtcbiAgICAgIGlmICghYWxsb3dlZCkge1xuICAgICAgICAvLyBUaGUgdXNlciBhbHJlYWR5IGRvZXNuJ3QgaGF2ZSB0aGlzIHBlcm1pc3Npb24sIHNvIG5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0ge307XG4gICAgICAgIHRoaXMucGVybWlzc2lvbnNCeUlkW3VzZXJJZF0gPSBwZXJtaXNzaW9ucztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWxsb3dlZCkge1xuICAgICAgdGhpcy5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXVthY2Nlc3NUeXBlXSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBwZXJtaXNzaW9uc1thY2Nlc3NUeXBlXTtcbiAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgIGRlbGV0ZSBwZXJtaXNzaW9uc1t1c2VySWRdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBQYXJzZS5BQ0wucHJvdG90eXBlLl9nZXRBY2Nlc3MgPSBmdW5jdGlvbihhY2Nlc3NUeXBlLCB1c2VySWQpIHtcbiAgICBpZiAodXNlcklkIGluc3RhbmNlb2YgUGFyc2UuVXNlcikge1xuICAgICAgdXNlcklkID0gdXNlcklkLmlkO1xuICAgIH0gZWxzZSBpZiAodXNlcklkIGluc3RhbmNlb2YgUGFyc2UuUm9sZSkge1xuICAgICAgdXNlcklkID0gXCJyb2xlOlwiICsgdXNlcklkLmdldE5hbWUoKTtcbiAgICB9XG4gICAgdmFyIHBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXTtcbiAgICBpZiAoIXBlcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9uc1thY2Nlc3NUeXBlXSA/IHRydWUgOiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHdoZXRoZXIgdGhlIGdpdmVuIHVzZXIgaXMgYWxsb3dlZCB0byByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBAcGFyYW0gdXNlcklkIEFuIGluc3RhbmNlIG9mIFBhcnNlLlVzZXIgb3IgaXRzIG9iamVjdElkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWQgV2hldGhlciB0aGF0IHVzZXIgc2hvdWxkIGhhdmUgcmVhZCBhY2Nlc3MuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFJlYWRBY2Nlc3MgPSBmdW5jdGlvbih1c2VySWQsIGFsbG93ZWQpIHtcbiAgICB0aGlzLl9zZXRBY2Nlc3MoXCJyZWFkXCIsIHVzZXJJZCwgYWxsb3dlZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHRoZSBnaXZlbiB1c2VyIGlkIGlzICpleHBsaWNpdGx5KiBhbGxvd2VkIHRvIHJlYWQgdGhpcyBvYmplY3QuXG4gICAqIEV2ZW4gaWYgdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgdXNlciBtYXkgc3RpbGwgYmUgYWJsZSB0byBhY2Nlc3MgaXQgaWZcbiAgICogZ2V0UHVibGljUmVhZEFjY2VzcyByZXR1cm5zIHRydWUgb3IgYSByb2xlIHRoYXQgdGhlIHVzZXIgYmVsb25ncyB0byBoYXNcbiAgICogd3JpdGUgYWNjZXNzLlxuICAgKiBAcGFyYW0gdXNlcklkIEFuIGluc3RhbmNlIG9mIFBhcnNlLlVzZXIgb3IgaXRzIG9iamVjdElkLCBvciBhIFBhcnNlLlJvbGUuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFJlYWRBY2Nlc3MgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0QWNjZXNzKFwicmVhZFwiLCB1c2VySWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB0aGUgZ2l2ZW4gdXNlciBpZCBpcyBhbGxvd2VkIHRvIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBAcGFyYW0gdXNlcklkIEFuIGluc3RhbmNlIG9mIFBhcnNlLlVzZXIgb3IgaXRzIG9iamVjdElkLCBvciBhIFBhcnNlLlJvbGUuLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWQgV2hldGhlciB0aGF0IHVzZXIgc2hvdWxkIGhhdmUgd3JpdGUgYWNjZXNzLlxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5zZXRXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKHVzZXJJZCwgYWxsb3dlZCkge1xuICAgIHRoaXMuX3NldEFjY2VzcyhcIndyaXRlXCIsIHVzZXJJZCwgYWxsb3dlZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHRoZSBnaXZlbiB1c2VyIGlkIGlzICpleHBsaWNpdGx5KiBhbGxvd2VkIHRvIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBFdmVuIGlmIHRoaXMgcmV0dXJucyBmYWxzZSwgdGhlIHVzZXIgbWF5IHN0aWxsIGJlIGFibGUgdG8gd3JpdGUgaXQgaWZcbiAgICogZ2V0UHVibGljV3JpdGVBY2Nlc3MgcmV0dXJucyB0cnVlIG9yIGEgcm9sZSB0aGF0IHRoZSB1c2VyIGJlbG9uZ3MgdG8gaGFzXG4gICAqIHdyaXRlIGFjY2Vzcy5cbiAgICogQHBhcmFtIHVzZXJJZCBBbiBpbnN0YW5jZSBvZiBQYXJzZS5Vc2VyIG9yIGl0cyBvYmplY3RJZCwgb3IgYSBQYXJzZS5Sb2xlLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRBY2Nlc3MoXCJ3cml0ZVwiLCB1c2VySWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB0aGUgcHVibGljIGlzIGFsbG93ZWQgdG8gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxvd2VkXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFB1YmxpY1JlYWRBY2Nlc3MgPSBmdW5jdGlvbihhbGxvd2VkKSB7XG4gICAgdGhpcy5zZXRSZWFkQWNjZXNzKFBVQkxJQ19LRVksIGFsbG93ZWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgd2hldGhlciB0aGUgcHVibGljIGlzIGFsbG93ZWQgdG8gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0UHVibGljUmVhZEFjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlYWRBY2Nlc3MoUFVCTElDX0tFWSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHRoZSBwdWJsaWMgaXMgYWxsb3dlZCB0byB3cml0ZSB0aGlzIG9iamVjdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxvd2VkXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFB1YmxpY1dyaXRlQWNjZXNzID0gZnVuY3Rpb24oYWxsb3dlZCkge1xuICAgIHRoaXMuc2V0V3JpdGVBY2Nlc3MoUFVCTElDX0tFWSwgYWxsb3dlZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHRoZSBwdWJsaWMgaXMgYWxsb3dlZCB0byB3cml0ZSB0aGlzIG9iamVjdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0UHVibGljV3JpdGVBY2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRXcml0ZUFjY2VzcyhQVUJMSUNfS0VZKTtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBHZXQgd2hldGhlciB1c2VycyBiZWxvbmdpbmcgdG8gdGhlIGdpdmVuIHJvbGUgYXJlIGFsbG93ZWRcbiAgICogdG8gcmVhZCB0aGlzIG9iamVjdC4gRXZlbiBpZiB0aGlzIHJldHVybnMgZmFsc2UsIHRoZSByb2xlIG1heVxuICAgKiBzdGlsbCBiZSBhYmxlIHRvIHdyaXRlIGl0IGlmIGEgcGFyZW50IHJvbGUgaGFzIHJlYWQgYWNjZXNzLlxuICAgKiBcbiAgICogQHBhcmFtIHJvbGUgVGhlIG5hbWUgb2YgdGhlIHJvbGUsIG9yIGEgUGFyc2UuUm9sZSBvYmplY3QuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHJvbGUgaGFzIHJlYWQgYWNjZXNzLiBmYWxzZSBvdGhlcndpc2UuXG4gICAqIEB0aHJvd3Mge1N0cmluZ30gSWYgcm9sZSBpcyBuZWl0aGVyIGEgUGFyc2UuUm9sZSBub3IgYSBTdHJpbmcuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFJvbGVSZWFkQWNjZXNzID0gZnVuY3Rpb24ocm9sZSkge1xuICAgIGlmIChyb2xlIGluc3RhbmNlb2YgUGFyc2UuUm9sZSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHRoZSBTdHJpbmcgbmFtZVxuICAgICAgcm9sZSA9IHJvbGUuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICBpZiAoXy5pc1N0cmluZyhyb2xlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVhZEFjY2VzcyhcInJvbGU6XCIgKyByb2xlKTtcbiAgICB9XG4gICAgdGhyb3cgXCJyb2xlIG11c3QgYmUgYSBQYXJzZS5Sb2xlIG9yIGEgU3RyaW5nXCI7XG4gIH07XG4gIFxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdXNlcnMgYmVsb25naW5nIHRvIHRoZSBnaXZlbiByb2xlIGFyZSBhbGxvd2VkXG4gICAqIHRvIHdyaXRlIHRoaXMgb2JqZWN0LiBFdmVuIGlmIHRoaXMgcmV0dXJucyBmYWxzZSwgdGhlIHJvbGUgbWF5XG4gICAqIHN0aWxsIGJlIGFibGUgdG8gd3JpdGUgaXQgaWYgYSBwYXJlbnQgcm9sZSBoYXMgd3JpdGUgYWNjZXNzLlxuICAgKiBcbiAgICogQHBhcmFtIHJvbGUgVGhlIG5hbWUgb2YgdGhlIHJvbGUsIG9yIGEgUGFyc2UuUm9sZSBvYmplY3QuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHJvbGUgaGFzIHdyaXRlIGFjY2Vzcy4gZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAdGhyb3dzIHtTdHJpbmd9IElmIHJvbGUgaXMgbmVpdGhlciBhIFBhcnNlLlJvbGUgbm9yIGEgU3RyaW5nLlxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRSb2xlV3JpdGVBY2Nlc3MgPSBmdW5jdGlvbihyb2xlKSB7XG4gICAgaWYgKHJvbGUgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gdGhlIFN0cmluZyBuYW1lXG4gICAgICByb2xlID0gcm9sZS5nZXROYW1lKCk7XG4gICAgfVxuICAgIGlmIChfLmlzU3RyaW5nKHJvbGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRXcml0ZUFjY2VzcyhcInJvbGU6XCIgKyByb2xlKTtcbiAgICB9XG4gICAgdGhyb3cgXCJyb2xlIG11c3QgYmUgYSBQYXJzZS5Sb2xlIG9yIGEgU3RyaW5nXCI7XG4gIH07XG4gIFxuICAvKipcbiAgICogU2V0IHdoZXRoZXIgdXNlcnMgYmVsb25naW5nIHRvIHRoZSBnaXZlbiByb2xlIGFyZSBhbGxvd2VkXG4gICAqIHRvIHJlYWQgdGhpcyBvYmplY3QuXG4gICAqIFxuICAgKiBAcGFyYW0gcm9sZSBUaGUgbmFtZSBvZiB0aGUgcm9sZSwgb3IgYSBQYXJzZS5Sb2xlIG9iamVjdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxvd2VkIFdoZXRoZXIgdGhlIGdpdmVuIHJvbGUgY2FuIHJlYWQgdGhpcyBvYmplY3QuXG4gICAqIEB0aHJvd3Mge1N0cmluZ30gSWYgcm9sZSBpcyBuZWl0aGVyIGEgUGFyc2UuUm9sZSBub3IgYSBTdHJpbmcuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFJvbGVSZWFkQWNjZXNzID0gZnVuY3Rpb24ocm9sZSwgYWxsb3dlZCkge1xuICAgIGlmIChyb2xlIGluc3RhbmNlb2YgUGFyc2UuUm9sZSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHRoZSBTdHJpbmcgbmFtZVxuICAgICAgcm9sZSA9IHJvbGUuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICBpZiAoXy5pc1N0cmluZyhyb2xlKSkge1xuICAgICAgdGhpcy5zZXRSZWFkQWNjZXNzKFwicm9sZTpcIiArIHJvbGUsIGFsbG93ZWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aHJvdyBcInJvbGUgbXVzdCBiZSBhIFBhcnNlLlJvbGUgb3IgYSBTdHJpbmdcIjtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB1c2VycyBiZWxvbmdpbmcgdG8gdGhlIGdpdmVuIHJvbGUgYXJlIGFsbG93ZWRcbiAgICogdG8gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIFxuICAgKiBAcGFyYW0gcm9sZSBUaGUgbmFtZSBvZiB0aGUgcm9sZSwgb3IgYSBQYXJzZS5Sb2xlIG9iamVjdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxvd2VkIFdoZXRoZXIgdGhlIGdpdmVuIHJvbGUgY2FuIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBAdGhyb3dzIHtTdHJpbmd9IElmIHJvbGUgaXMgbmVpdGhlciBhIFBhcnNlLlJvbGUgbm9yIGEgU3RyaW5nLlxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5zZXRSb2xlV3JpdGVBY2Nlc3MgPSBmdW5jdGlvbihyb2xlLCBhbGxvd2VkKSB7XG4gICAgaWYgKHJvbGUgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gdGhlIFN0cmluZyBuYW1lXG4gICAgICByb2xlID0gcm9sZS5nZXROYW1lKCk7XG4gICAgfVxuICAgIGlmIChfLmlzU3RyaW5nKHJvbGUpKSB7XG4gICAgICB0aGlzLnNldFdyaXRlQWNjZXNzKFwicm9sZTpcIiArIHJvbGUsIGFsbG93ZWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aHJvdyBcInJvbGUgbXVzdCBiZSBhIFBhcnNlLlJvbGUgb3IgYSBTdHJpbmdcIjtcbiAgfTtcblxufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBIFBhcnNlLk9wIGlzIGFuIGF0b21pYyBvcGVyYXRpb24gdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIGZpZWxkIGluIGFcbiAgICogUGFyc2UuT2JqZWN0LiBGb3IgZXhhbXBsZSwgY2FsbGluZyA8Y29kZT5vYmplY3Quc2V0KFwiZm9vXCIsIFwiYmFyXCIpPC9jb2RlPlxuICAgKiBpcyBhbiBleGFtcGxlIG9mIGEgUGFyc2UuT3AuU2V0LiBDYWxsaW5nIDxjb2RlPm9iamVjdC51bnNldChcImZvb1wiKTwvY29kZT5cbiAgICogaXMgYSBQYXJzZS5PcC5VbnNldC4gVGhlc2Ugb3BlcmF0aW9ucyBhcmUgc3RvcmVkIGluIGEgUGFyc2UuT2JqZWN0IGFuZFxuICAgKiBzZW50IHRvIHRoZSBzZXJ2ZXIgYXMgcGFydCBvZiA8Y29kZT5vYmplY3Quc2F2ZSgpPC9jb2RlPiBvcGVyYXRpb25zLlxuICAgKiBJbnN0YW5jZXMgb2YgUGFyc2UuT3Agc2hvdWxkIGJlIGltbXV0YWJsZS5cbiAgICpcbiAgICogWW91IHNob3VsZCBub3QgY3JlYXRlIHN1YmNsYXNzZXMgb2YgUGFyc2UuT3Agb3IgaW5zdGFudGlhdGUgUGFyc2UuT3BcbiAgICogZGlyZWN0bHkuXG4gICAqL1xuICBQYXJzZS5PcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2luaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcblxuICBQYXJzZS5PcC5wcm90b3R5cGUgPSB7XG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKCkge31cbiAgfTtcblxuICBfLmV4dGVuZChQYXJzZS5PcCwge1xuICAgIC8qKlxuICAgICAqIFRvIGNyZWF0ZSBhIG5ldyBPcCwgY2FsbCBQYXJzZS5PcC5fZXh0ZW5kKCk7XG4gICAgICovXG4gICAgX2V4dGVuZDogUGFyc2UuX2V4dGVuZCxcblxuICAgIC8vIEEgbWFwIG9mIF9fb3Agc3RyaW5nIHRvIGRlY29kZXIgZnVuY3Rpb24uXG4gICAgX29wRGVjb2Rlck1hcDoge30sXG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiB0byBjb252ZXJ0IGEganNvbiBvYmplY3Qgd2l0aCBhbiBfX29wIGZpZWxkIGludG8gYW5cbiAgICAgKiBpbnN0YW5jZSBvZiBhIHN1YmNsYXNzIG9mIFBhcnNlLk9wLlxuICAgICAqL1xuICAgIF9yZWdpc3RlckRlY29kZXI6IGZ1bmN0aW9uKG9wTmFtZSwgZGVjb2Rlcikge1xuICAgICAgUGFyc2UuT3AuX29wRGVjb2Rlck1hcFtvcE5hbWVdID0gZGVjb2RlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSBqc29uIG9iamVjdCBpbnRvIGFuIGluc3RhbmNlIG9mIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT3AuXG4gICAgICovXG4gICAgX2RlY29kZTogZnVuY3Rpb24oanNvbikge1xuICAgICAgdmFyIGRlY29kZXIgPSBQYXJzZS5PcC5fb3BEZWNvZGVyTWFwW2pzb24uX19vcF07XG4gICAgICBpZiAoZGVjb2Rlcikge1xuICAgICAgICByZXR1cm4gZGVjb2Rlcihqc29uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvKlxuICAgKiBBZGQgYSBoYW5kbGVyIGZvciBCYXRjaCBvcHMuXG4gICAqL1xuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiQmF0Y2hcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHZhciBvcCA9IG51bGw7XG4gICAgUGFyc2UuX2FycmF5RWFjaChqc29uLm9wcywgZnVuY3Rpb24obmV4dE9wKSB7XG4gICAgICBuZXh0T3AgPSBQYXJzZS5PcC5fZGVjb2RlKG5leHRPcCk7XG4gICAgICBvcCA9IG5leHRPcC5fbWVyZ2VXaXRoUHJldmlvdXMob3ApO1xuICAgIH0pO1xuICAgIHJldHVybiBvcDtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBIFNldCBvcGVyYXRpb24gaW5kaWNhdGVzIHRoYXQgZWl0aGVyIHRoZSBmaWVsZCB3YXMgY2hhbmdlZCB1c2luZ1xuICAgKiBQYXJzZS5PYmplY3Quc2V0LCBvciBpdCBpcyBhIG11dGFibGUgY29udGFpbmVyIHRoYXQgd2FzIGRldGVjdGVkIGFzIGJlaW5nXG4gICAqIGNoYW5nZWQuXG4gICAqL1xuICBQYXJzZS5PcC5TZXQgPSBQYXJzZS5PcC5fZXh0ZW5kKC8qKiBAbGVuZHMgUGFyc2UuT3AuU2V0LnByb3RvdHlwZSAqLyB7XG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBuZXcgdmFsdWUgb2YgdGhpcyBmaWVsZCBhZnRlciB0aGUgc2V0LlxuICAgICAqL1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhcnNlLl9lbmNvZGUodGhpcy52YWx1ZSgpKTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlKCk7XG4gICAgfVxuICB9KTtcblxuICAvKipcbiAgICogQSBzZW50aW5lbCB2YWx1ZSB0aGF0IGlzIHJldHVybmVkIGJ5IFBhcnNlLk9wLlVuc2V0Ll9lc3RpbWF0ZSB0b1xuICAgKiBpbmRpY2F0ZSB0aGUgZmllbGQgc2hvdWxkIGJlIGRlbGV0ZWQuIEJhc2ljYWxseSwgaWYgeW91IGZpbmQgX1VOU0VUIGFzIGFcbiAgICogdmFsdWUgaW4geW91ciBvYmplY3QsIHlvdSBzaG91bGQgcmVtb3ZlIHRoYXQga2V5LlxuICAgKi9cbiAgUGFyc2UuT3AuX1VOU0VUID0ge307XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBbiBVbnNldCBvcGVyYXRpb24gaW5kaWNhdGVzIHRoYXQgdGhpcyBmaWVsZCBoYXMgYmVlbiBkZWxldGVkIGZyb20gdGhlXG4gICAqIG9iamVjdC5cbiAgICovXG4gIFBhcnNlLk9wLlVuc2V0ID0gUGFyc2UuT3AuX2V4dGVuZCgvKiogQGxlbmRzIFBhcnNlLk9wLlVuc2V0LnByb3RvdHlwZSAqLyB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgX19vcDogXCJEZWxldGVcIiB9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgcmV0dXJuIFBhcnNlLk9wLl9VTlNFVDtcbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJEZWxldGVcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuVW5zZXQoKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBbiBJbmNyZW1lbnQgaXMgYW4gYXRvbWljIG9wZXJhdGlvbiB3aGVyZSB0aGUgbnVtZXJpYyB2YWx1ZSBmb3IgdGhlIGZpZWxkXG4gICAqIHdpbGwgYmUgaW5jcmVhc2VkIGJ5IGEgZ2l2ZW4gYW1vdW50LlxuICAgKi9cbiAgUGFyc2UuT3AuSW5jcmVtZW50ID0gUGFyc2UuT3AuX2V4dGVuZChcbiAgICAgIC8qKiBAbGVuZHMgUGFyc2UuT3AuSW5jcmVtZW50LnByb3RvdHlwZSAqLyB7XG5cbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgICB0aGlzLl9hbW91bnQgPSBhbW91bnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGFtb3VudCB0byBpbmNyZW1lbnQgYnkuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB0aGUgYW1vdW50IHRvIGluY3JlbWVudCBieS5cbiAgICAgKi9cbiAgICBhbW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Ftb3VudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgX19vcDogXCJJbmNyZW1lbnRcIiwgYW1vdW50OiB0aGlzLl9hbW91bnQgfTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5VbnNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLmFtb3VudCgpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5TZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQocHJldmlvdXMudmFsdWUoKSArIHRoaXMuYW1vdW50KCkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLkluY3JlbWVudCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLkluY3JlbWVudCh0aGlzLmFtb3VudCgpICsgcHJldmlvdXMuYW1vdW50KCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJPcCBpcyBpbnZhbGlkIGFmdGVyIHByZXZpb3VzIG9wLlwiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlKSB7XG4gICAgICBpZiAoIW9sZFZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFtb3VudCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9sZFZhbHVlICsgdGhpcy5hbW91bnQoKTtcbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJJbmNyZW1lbnRcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuSW5jcmVtZW50KGpzb24uYW1vdW50KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBZGQgaXMgYW4gYXRvbWljIG9wZXJhdGlvbiB3aGVyZSB0aGUgZ2l2ZW4gb2JqZWN0cyB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZVxuICAgKiBhcnJheSB0aGF0IGlzIHN0b3JlZCBpbiB0aGlzIGZpZWxkLlxuICAgKi9cbiAgUGFyc2UuT3AuQWRkID0gUGFyc2UuT3AuX2V4dGVuZCgvKiogQGxlbmRzIFBhcnNlLk9wLkFkZC5wcm90b3R5cGUgKi8ge1xuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbihvYmplY3RzKSB7XG4gICAgICB0aGlzLl9vYmplY3RzID0gb2JqZWN0cztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgb2JqZWN0cyB0byBiZSBhZGRlZCB0byB0aGUgYXJyYXkuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBvYmplY3RzIHRvIGJlIGFkZGVkIHRvIHRoZSBhcnJheS5cbiAgICAgKi9cbiAgICBvYmplY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYmplY3RzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIkFkZFwiLCBvYmplY3RzOiBQYXJzZS5fZW5jb2RlKHRoaXMub2JqZWN0cygpKSB9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlVuc2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMub2JqZWN0cygpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5TZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5fZXN0aW1hdGUocHJldmlvdXMudmFsdWUoKSkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLkFkZCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLkFkZChwcmV2aW91cy5vYmplY3RzKCkuY29uY2F0KHRoaXMub2JqZWN0cygpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIF8uY2xvbmUodGhpcy5vYmplY3RzKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmNvbmNhdCh0aGlzLm9iamVjdHMoKSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiQWRkXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLkFkZChQYXJzZS5fZGVjb2RlKHVuZGVmaW5lZCwganNvbi5vYmplY3RzKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogQWRkVW5pcXVlIGlzIGFuIGF0b21pYyBvcGVyYXRpb24gd2hlcmUgdGhlIGdpdmVuIGl0ZW1zIHdpbGwgYmUgYXBwZW5kZWQgdG9cbiAgICogdGhlIGFycmF5IHRoYXQgaXMgc3RvcmVkIGluIHRoaXMgZmllbGQgb25seSBpZiB0aGV5IHdlcmUgbm90IGFscmVhZHlcbiAgICogcHJlc2VudCBpbiB0aGUgYXJyYXkuXG4gICAqL1xuICBQYXJzZS5PcC5BZGRVbmlxdWUgPSBQYXJzZS5PcC5fZXh0ZW5kKFxuICAgICAgLyoqIEBsZW5kcyBQYXJzZS5PcC5BZGRVbmlxdWUucHJvdG90eXBlICovIHtcblxuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbihvYmplY3RzKSB7XG4gICAgICB0aGlzLl9vYmplY3RzID0gXy51bmlxKG9iamVjdHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBvYmplY3RzIHRvIGJlIGFkZGVkIHRvIHRoZSBhcnJheS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9iamVjdHMgdG8gYmUgYWRkZWQgdG8gdGhlIGFycmF5LlxuICAgICAqL1xuICAgIG9iamVjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IF9fb3A6IFwiQWRkVW5pcXVlXCIsIG9iamVjdHM6IFBhcnNlLl9lbmNvZGUodGhpcy5vYmplY3RzKCkpIH07XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuVW5zZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5vYmplY3RzKCkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLl9lc3RpbWF0ZShwcmV2aW91cy52YWx1ZSgpKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuQWRkVW5pcXVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuQWRkVW5pcXVlKHRoaXMuX2VzdGltYXRlKHByZXZpb3VzLm9iamVjdHMoKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJPcCBpcyBpbnZhbGlkIGFmdGVyIHByZXZpb3VzIG9wLlwiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlKSB7XG4gICAgICBpZiAoIW9sZFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBfLmNsb25lKHRoaXMub2JqZWN0cygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGNhbid0IGp1c3QgdGFrZSB0aGUgXy51bmlxKF8udW5pb24oLi4uKSkgb2Ygb2xkVmFsdWUgYW5kXG4gICAgICAgIC8vIHRoaXMub2JqZWN0cywgYmVjYXVzZSB0aGUgdW5pcXVlbmVzcyBtYXkgbm90IGFwcGx5IHRvIG9sZFZhbHVlXG4gICAgICAgIC8vIChlc3BlY2lhbGx5IGlmIHRoZSBvbGRWYWx1ZSB3YXMgc2V0IHZpYSAuc2V0KCkpXG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IF8uY2xvbmUob2xkVmFsdWUpO1xuICAgICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMub2JqZWN0cygpLCBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0ICYmIG9iai5pZCkge1xuICAgICAgICAgICAgdmFyIG1hdGNoaW5nT2JqID0gXy5maW5kKG5ld1ZhbHVlLCBmdW5jdGlvbihhbk9iaikge1xuICAgICAgICAgICAgICByZXR1cm4gKGFuT2JqIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSAmJiAoYW5PYmouaWQgPT09IG9iai5pZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghbWF0Y2hpbmdPYmopIHtcbiAgICAgICAgICAgICAgbmV3VmFsdWUucHVzaChvYmopO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKG5ld1ZhbHVlLCBtYXRjaGluZ09iaik7XG4gICAgICAgICAgICAgIG5ld1ZhbHVlW2luZGV4XSA9IG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCFfLmNvbnRhaW5zKG5ld1ZhbHVlLCBvYmopKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZS5wdXNoKG9iaik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkFkZFVuaXF1ZVwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5BZGRVbmlxdWUoUGFyc2UuX2RlY29kZSh1bmRlZmluZWQsIGpzb24ub2JqZWN0cykpO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIFJlbW92ZSBpcyBhbiBhdG9taWMgb3BlcmF0aW9uIHdoZXJlIHRoZSBnaXZlbiBvYmplY3RzIHdpbGwgYmUgcmVtb3ZlZCBmcm9tXG4gICAqIHRoZSBhcnJheSB0aGF0IGlzIHN0b3JlZCBpbiB0aGlzIGZpZWxkLlxuICAgKi9cbiAgUGFyc2UuT3AuUmVtb3ZlID0gUGFyc2UuT3AuX2V4dGVuZCgvKiogQGxlbmRzIFBhcnNlLk9wLlJlbW92ZS5wcm90b3R5cGUgKi8ge1xuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbihvYmplY3RzKSB7XG4gICAgICB0aGlzLl9vYmplY3RzID0gXy51bmlxKG9iamVjdHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBvYmplY3RzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgYXJyYXkuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBvYmplY3RzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgYXJyYXkuXG4gICAgICovXG4gICAgb2JqZWN0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0cztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgX19vcDogXCJSZW1vdmVcIiwgb2JqZWN0czogUGFyc2UuX2VuY29kZSh0aGlzLm9iamVjdHMoKSkgfTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5VbnNldCkge1xuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuU2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMuX2VzdGltYXRlKHByZXZpb3VzLnZhbHVlKCkpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5SZW1vdmUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5SZW1vdmUoXy51bmlvbihwcmV2aW91cy5vYmplY3RzKCksIHRoaXMub2JqZWN0cygpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gXy5kaWZmZXJlbmNlKG9sZFZhbHVlLCB0aGlzLm9iamVjdHMoKSk7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBzYXZlZCBQYXJzZSBPYmplY3RzIGJlaW5nIHJlbW92ZWQsIGFsc28gcmVtb3ZlIHRoZW0uXG4gICAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5vYmplY3RzKCksIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QgJiYgb2JqLmlkKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IF8ucmVqZWN0KG5ld1ZhbHVlLCBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICAgICAgICByZXR1cm4gKG90aGVyIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSAmJiAob3RoZXIuaWQgPT09IG9iai5pZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiUmVtb3ZlXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlJlbW92ZShQYXJzZS5fZGVjb2RlKHVuZGVmaW5lZCwganNvbi5vYmplY3RzKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogQSBSZWxhdGlvbiBvcGVyYXRpb24gaW5kaWNhdGVzIHRoYXQgdGhlIGZpZWxkIGlzIGFuIGluc3RhbmNlIG9mXG4gICAqIFBhcnNlLlJlbGF0aW9uLCBhbmQgb2JqZWN0cyBhcmUgYmVpbmcgYWRkZWQgdG8sIG9yIHJlbW92ZWQgZnJvbSwgdGhhdFxuICAgKiByZWxhdGlvbi5cbiAgICovXG4gIFBhcnNlLk9wLlJlbGF0aW9uID0gUGFyc2UuT3AuX2V4dGVuZChcbiAgICAgIC8qKiBAbGVuZHMgUGFyc2UuT3AuUmVsYXRpb24ucHJvdG90eXBlICovIHtcblxuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbihhZGRzLCByZW1vdmVzKSB7XG4gICAgICB0aGlzLl90YXJnZXRDbGFzc05hbWUgPSBudWxsO1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHZhciBwb2ludGVyVG9JZCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgICAgaWYgKCFvYmplY3QuaWQpIHtcbiAgICAgICAgICAgIHRocm93IFwiWW91IGNhbid0IGFkZCBhbiB1bnNhdmVkIFBhcnNlLk9iamVjdCB0byBhIHJlbGF0aW9uLlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXNlbGYuX3RhcmdldENsYXNzTmFtZSkge1xuICAgICAgICAgICAgc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lID0gb2JqZWN0LmNsYXNzTmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNlbGYuX3RhcmdldENsYXNzTmFtZSAhPT0gb2JqZWN0LmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgXCJUcmllZCB0byBjcmVhdGUgYSBQYXJzZS5SZWxhdGlvbiB3aXRoIDIgZGlmZmVyZW50IHR5cGVzOiBcIiArXG4gICAgICAgICAgICAgICAgICBzZWxmLl90YXJnZXRDbGFzc05hbWUgKyBcIiBhbmQgXCIgKyBvYmplY3QuY2xhc3NOYW1lICsgXCIuXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBvYmplY3QuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMucmVsYXRpb25zVG9BZGQgPSBfLnVuaXEoXy5tYXAoYWRkcywgcG9pbnRlclRvSWQpKTtcbiAgICAgIHRoaXMucmVsYXRpb25zVG9SZW1vdmUgPSBfLnVuaXEoXy5tYXAocmVtb3ZlcywgcG9pbnRlclRvSWQpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiB1bmZldGNoZWQgUGFyc2UuT2JqZWN0IHRoYXQgYXJlIGJlaW5nIGFkZGVkIHRvIHRoZVxuICAgICAqIHJlbGF0aW9uLlxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBfLm1hcCh0aGlzLnJlbGF0aW9uc1RvQWRkLCBmdW5jdGlvbihvYmplY3RJZCkge1xuICAgICAgICB2YXIgb2JqZWN0ID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lKTtcbiAgICAgICAgb2JqZWN0LmlkID0gb2JqZWN0SWQ7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiB1bmZldGNoZWQgUGFyc2UuT2JqZWN0IHRoYXQgYXJlIGJlaW5nIHJlbW92ZWQgZnJvbVxuICAgICAqIHRoZSByZWxhdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICByZW1vdmVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBfLm1hcCh0aGlzLnJlbGF0aW9uc1RvUmVtb3ZlLCBmdW5jdGlvbihvYmplY3RJZCkge1xuICAgICAgICB2YXIgb2JqZWN0ID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lKTtcbiAgICAgICAgb2JqZWN0LmlkID0gb2JqZWN0SWQ7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFkZHMgPSBudWxsO1xuICAgICAgdmFyIHJlbW92ZXMgPSBudWxsO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGlkVG9Qb2ludGVyID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIHsgX190eXBlOiAnUG9pbnRlcicsXG4gICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICBvYmplY3RJZDogaWQgfTtcbiAgICAgIH07XG4gICAgICB2YXIgcG9pbnRlcnMgPSBudWxsO1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25zVG9BZGQubGVuZ3RoID4gMCkge1xuICAgICAgICBwb2ludGVycyA9IF8ubWFwKHRoaXMucmVsYXRpb25zVG9BZGQsIGlkVG9Qb2ludGVyKTtcbiAgICAgICAgYWRkcyA9IHsgXCJfX29wXCI6IFwiQWRkUmVsYXRpb25cIiwgXCJvYmplY3RzXCI6IHBvaW50ZXJzIH07XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlbGF0aW9uc1RvUmVtb3ZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcG9pbnRlcnMgPSBfLm1hcCh0aGlzLnJlbGF0aW9uc1RvUmVtb3ZlLCBpZFRvUG9pbnRlcik7XG4gICAgICAgIHJlbW92ZXMgPSB7IFwiX19vcFwiOiBcIlJlbW92ZVJlbGF0aW9uXCIsIFwib2JqZWN0c1wiOiBwb2ludGVycyB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoYWRkcyAmJiByZW1vdmVzKSB7XG4gICAgICAgIHJldHVybiB7IFwiX19vcFwiOiBcIkJhdGNoXCIsIFwib3BzXCI6IFthZGRzLCByZW1vdmVzXX07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhZGRzIHx8IHJlbW92ZXMgfHwge307XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuVW5zZXQpIHtcbiAgICAgICAgdGhyb3cgXCJZb3UgY2FuJ3QgbW9kaWZ5IGEgcmVsYXRpb24gYWZ0ZXIgZGVsZXRpbmcgaXQuXCI7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuUmVsYXRpb24pIHtcbiAgICAgICAgaWYgKHByZXZpb3VzLl90YXJnZXRDbGFzc05hbWUgJiZcbiAgICAgICAgICAgIHByZXZpb3VzLl90YXJnZXRDbGFzc05hbWUgIT09IHRoaXMuX3RhcmdldENsYXNzTmFtZSkge1xuICAgICAgICAgIHRocm93IFwiUmVsYXRlZCBvYmplY3QgbXVzdCBiZSBvZiBjbGFzcyBcIiArIHByZXZpb3VzLl90YXJnZXRDbGFzc05hbWUgK1xuICAgICAgICAgICAgICBcIiwgYnV0IFwiICsgdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lICsgXCIgd2FzIHBhc3NlZCBpbi5cIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV3QWRkID0gXy51bmlvbihfLmRpZmZlcmVuY2UocHJldmlvdXMucmVsYXRpb25zVG9BZGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aW9uc1RvUmVtb3ZlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbnNUb0FkZCk7XG4gICAgICAgIHZhciBuZXdSZW1vdmUgPSBfLnVuaW9uKF8uZGlmZmVyZW5jZShwcmV2aW91cy5yZWxhdGlvbnNUb1JlbW92ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb25zVG9BZGQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aW9uc1RvUmVtb3ZlKTtcblxuICAgICAgICB2YXIgbmV3UmVsYXRpb24gPSBuZXcgUGFyc2UuT3AuUmVsYXRpb24obmV3QWRkLCBuZXdSZW1vdmUpO1xuICAgICAgICBuZXdSZWxhdGlvbi5fdGFyZ2V0Q2xhc3NOYW1lID0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgICByZXR1cm4gbmV3UmVsYXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUsIG9iamVjdCwga2V5KSB7XG4gICAgICBpZiAoIW9sZFZhbHVlKSB7XG4gICAgICAgIHZhciByZWxhdGlvbiA9IG5ldyBQYXJzZS5SZWxhdGlvbihvYmplY3QsIGtleSk7XG4gICAgICAgIHJlbGF0aW9uLnRhcmdldENsYXNzTmFtZSA9IHRoaXMuX3RhcmdldENsYXNzTmFtZTtcbiAgICAgIH0gZWxzZSBpZiAob2xkVmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbikge1xuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgaWYgKG9sZFZhbHVlLnRhcmdldENsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZFZhbHVlLnRhcmdldENsYXNzTmFtZSAhPT0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgIHRocm93IFwiUmVsYXRlZCBvYmplY3QgbXVzdCBiZSBhIFwiICsgb2xkVmFsdWUudGFyZ2V0Q2xhc3NOYW1lICtcbiAgICAgICAgICAgICAgICAgIFwiLCBidXQgYSBcIiArIHRoaXMuX3RhcmdldENsYXNzTmFtZSArIFwiIHdhcyBwYXNzZWQgaW4uXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9sZFZhbHVlLnRhcmdldENsYXNzTmFtZSA9IHRoaXMuX3RhcmdldENsYXNzTmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9sZFZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJPcCBpcyBpbnZhbGlkIGFmdGVyIHByZXZpb3VzIG9wLlwiO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkFkZFJlbGF0aW9uXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlJlbGF0aW9uKFBhcnNlLl9kZWNvZGUodW5kZWZpbmVkLCBqc29uLm9iamVjdHMpLCBbXSk7XG4gIH0pO1xuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiUmVtb3ZlUmVsYXRpb25cIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuUmVsYXRpb24oW10sIFBhcnNlLl9kZWNvZGUodW5kZWZpbmVkLCBqc29uLm9iamVjdHMpKTtcbiAgfSk7XG5cbn0odGhpcykpO1xuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFJlbGF0aW9uIGZvciB0aGUgZ2l2ZW4gcGFyZW50IG9iamVjdCBhbmQga2V5LiBUaGlzXG4gICAqIGNvbnN0cnVjdG9yIHNob3VsZCByYXJlbHkgYmUgdXNlZCBkaXJlY3RseSwgYnV0IHJhdGhlciBjcmVhdGVkIGJ5XG4gICAqIFBhcnNlLk9iamVjdC5yZWxhdGlvbi5cbiAgICogQHBhcmFtIHtQYXJzZS5PYmplY3R9IHBhcmVudCBUaGUgcGFyZW50IG9mIHRoaXMgcmVsYXRpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSBmb3IgdGhpcyByZWxhdGlvbiBvbiB0aGUgcGFyZW50LlxuICAgKiBAc2VlIFBhcnNlLk9iamVjdCNyZWxhdGlvblxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+XG4gICAqIEEgY2xhc3MgdGhhdCBpcyB1c2VkIHRvIGFjY2VzcyBhbGwgb2YgdGhlIGNoaWxkcmVuIG9mIGEgbWFueS10by1tYW55XG4gICAqIHJlbGF0aW9uc2hpcC4gIEVhY2ggaW5zdGFuY2Ugb2YgUGFyc2UuUmVsYXRpb24gaXMgYXNzb2NpYXRlZCB3aXRoIGFcbiAgICogcGFydGljdWxhciBwYXJlbnQgb2JqZWN0IGFuZCBrZXkuXG4gICAqIDwvcD5cbiAgICovXG4gIFBhcnNlLlJlbGF0aW9uID0gZnVuY3Rpb24ocGFyZW50LCBrZXkpIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLnRhcmdldENsYXNzTmFtZSA9IG51bGw7XG4gIH07XG5cbiAgUGFyc2UuUmVsYXRpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIE1ha2VzIHN1cmUgdGhhdCB0aGlzIHJlbGF0aW9uIGhhcyB0aGUgcmlnaHQgcGFyZW50IGFuZCBrZXkuXG4gICAgICovXG4gICAgX2Vuc3VyZVBhcmVudEFuZEtleTogZnVuY3Rpb24ocGFyZW50LCBrZXkpIHtcbiAgICAgIHRoaXMucGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgcGFyZW50O1xuICAgICAgdGhpcy5rZXkgPSB0aGlzLmtleSB8fCBrZXk7XG4gICAgICBpZiAodGhpcy5wYXJlbnQgIT09IHBhcmVudCkge1xuICAgICAgICB0aHJvdyBcIkludGVybmFsIEVycm9yLiBSZWxhdGlvbiByZXRyaWV2ZWQgZnJvbSB0d28gZGlmZmVyZW50IE9iamVjdHMuXCI7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5rZXkgIT09IGtleSkge1xuICAgICAgICB0aHJvdyBcIkludGVybmFsIEVycm9yLiBSZWxhdGlvbiByZXRyaWV2ZWQgZnJvbSB0d28gZGlmZmVyZW50IGtleXMuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBQYXJzZS5PYmplY3Qgb3IgYW4gYXJyYXkgb2YgUGFyc2UuT2JqZWN0cyB0byB0aGUgcmVsYXRpb24uXG4gICAgICogQHBhcmFtIHt9IG9iamVjdHMgVGhlIGl0ZW0gb3IgaXRlbXMgdG8gYWRkLlxuICAgICAqL1xuICAgIGFkZDogZnVuY3Rpb24ob2JqZWN0cykge1xuICAgICAgaWYgKCFfLmlzQXJyYXkob2JqZWN0cykpIHtcbiAgICAgICAgb2JqZWN0cyA9IFtvYmplY3RzXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYW5nZSA9IG5ldyBQYXJzZS5PcC5SZWxhdGlvbihvYmplY3RzLCBbXSk7XG4gICAgICB0aGlzLnBhcmVudC5zZXQodGhpcy5rZXksIGNoYW5nZSk7XG4gICAgICB0aGlzLnRhcmdldENsYXNzTmFtZSA9IGNoYW5nZS5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgUGFyc2UuT2JqZWN0IG9yIGFuIGFycmF5IG9mIFBhcnNlLk9iamVjdHMgZnJvbSB0aGlzIHJlbGF0aW9uLlxuICAgICAqIEBwYXJhbSB7fSBvYmplY3RzIFRoZSBpdGVtIG9yIGl0ZW1zIHRvIHJlbW92ZS5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIGlmICghXy5pc0FycmF5KG9iamVjdHMpKSB7XG4gICAgICAgIG9iamVjdHMgPSBbb2JqZWN0c107XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGFuZ2UgPSBuZXcgUGFyc2UuT3AuUmVsYXRpb24oW10sIG9iamVjdHMpO1xuICAgICAgdGhpcy5wYXJlbnQuc2V0KHRoaXMua2V5LCBjaGFuZ2UpO1xuICAgICAgdGhpcy50YXJnZXRDbGFzc05hbWUgPSBjaGFuZ2UuX3RhcmdldENsYXNzTmFtZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb2JqZWN0IHN1aXRhYmxlIGZvciBzYXZpbmcgdG8gZGlzay5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IFwiX190eXBlXCI6IFwiUmVsYXRpb25cIiwgXCJjbGFzc05hbWVcIjogdGhpcy50YXJnZXRDbGFzc05hbWUgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIFBhcnNlLlF1ZXJ5IHRoYXQgaXMgbGltaXRlZCB0byBvYmplY3RzIGluIHRoaXNcbiAgICAgKiByZWxhdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX1cbiAgICAgKi9cbiAgICBxdWVyeTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdGFyZ2V0Q2xhc3M7XG4gICAgICB2YXIgcXVlcnk7XG4gICAgICBpZiAoIXRoaXMudGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgIHRhcmdldENsYXNzID0gUGFyc2UuT2JqZWN0Ll9nZXRTdWJjbGFzcyh0aGlzLnBhcmVudC5jbGFzc05hbWUpO1xuICAgICAgICBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeSh0YXJnZXRDbGFzcyk7XG4gICAgICAgIHF1ZXJ5Ll9leHRyYU9wdGlvbnMucmVkaXJlY3RDbGFzc05hbWVGb3JLZXkgPSB0aGlzLmtleTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldENsYXNzID0gUGFyc2UuT2JqZWN0Ll9nZXRTdWJjbGFzcyh0aGlzLnRhcmdldENsYXNzTmFtZSk7XG4gICAgICAgIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KHRhcmdldENsYXNzKTtcbiAgICAgIH1cbiAgICAgIHF1ZXJ5Ll9hZGRDb25kaXRpb24oXCIkcmVsYXRlZFRvXCIsIFwib2JqZWN0XCIsIHRoaXMucGFyZW50Ll90b1BvaW50ZXIoKSk7XG4gICAgICBxdWVyeS5fYWRkQ29uZGl0aW9uKFwiJHJlbGF0ZWRUb1wiLCBcImtleVwiLCB0aGlzLmtleSk7XG5cbiAgICAgIHJldHVybiBxdWVyeTtcbiAgICB9XG4gIH07XG59KHRoaXMpKTtcblxuLypnbG9iYWwgd2luZG93OiBmYWxzZSwgcHJvY2VzczogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEEgUHJvbWlzZSBpcyByZXR1cm5lZCBieSBhc3luYyBtZXRob2RzIGFzIGEgaG9vayB0byBwcm92aWRlIGNhbGxiYWNrcyB0byBiZVxuICAgKiBjYWxsZWQgd2hlbiB0aGUgYXN5bmMgdGFzayBpcyBmdWxmaWxsZWQuXG4gICAqXG4gICAqIDxwPlR5cGljYWwgdXNhZ2Ugd291bGQgYmUgbGlrZTo8cHJlPlxuICAgKiAgICBxdWVyeS5maW5kKCkudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAqICAgICAgcmVzdWx0c1swXS5zZXQoXCJmb29cIiwgXCJiYXJcIik7XG4gICAqICAgICAgcmV0dXJuIHJlc3VsdHNbMF0uc2F2ZUFzeW5jKCk7XG4gICAqICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAqICAgICAgY29uc29sZS5sb2coXCJVcGRhdGVkIFwiICsgcmVzdWx0LmlkKTtcbiAgICogICAgfSk7XG4gICAqIDwvcHJlPjwvcD5cbiAgICpcbiAgICogQHNlZSBQYXJzZS5Qcm9taXNlLnByb3RvdHlwZS50aGVuXG4gICAqIEBjbGFzc1xuICAgKi9cbiAgUGFyc2UuUHJvbWlzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Jlc29sdmVkID0gZmFsc2U7XG4gICAgdGhpcy5fcmVqZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9yZXNvbHZlZENhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX3JlamVjdGVkQ2FsbGJhY2tzID0gW107XG4gIH07XG5cbiAgXy5leHRlbmQoUGFyc2UuUHJvbWlzZSwgLyoqIEBsZW5kcyBQYXJzZS5Qcm9taXNlICovIHtcblxuICAgIF9pc1Byb21pc2VzQVBsdXNDb21wbGlhbnQ6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmZiB0aGUgZ2l2ZW4gb2JqZWN0IGZ1bGZpbHMgdGhlIFByb21pc2UgaW50ZXJmYWNlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXM6IGZ1bmN0aW9uKHByb21pc2UpIHtcbiAgICAgIHJldHVybiBwcm9taXNlICYmIHByb21pc2UudGhlbiAmJiBfLmlzRnVuY3Rpb24ocHJvbWlzZS50aGVuKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCBhIGdpdmVuIHZhbHVlLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IHRoZSBuZXcgcHJvbWlzZS5cbiAgICAgKi9cbiAgICBhczogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICBwcm9taXNlLnJlc29sdmUuYXBwbHkocHJvbWlzZSwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IHByb21pc2UgdGhhdCBpcyByZWplY3RlZCB3aXRoIGEgZ2l2ZW4gZXJyb3IuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gdGhlIG5ldyBwcm9taXNlLlxuICAgICAqL1xuICAgIGVycm9yOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgIHByb21pc2UucmVqZWN0LmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIG9mIHRoZSBpbnB1dCBwcm9taXNlc1xuICAgICAqIGFyZSByZXNvbHZlZC4gSWYgYW55IHByb21pc2UgaW4gdGhlIGxpc3QgZmFpbHMsIHRoZW4gdGhlIHJldHVybmVkIHByb21pc2VcbiAgICAgKiB3aWxsIGZhaWwgd2l0aCB0aGUgbGFzdCBlcnJvci4gSWYgdGhleSBhbGwgc3VjY2VlZCwgdGhlbiB0aGUgcmV0dXJuZWRcbiAgICAgKiBwcm9taXNlIHdpbGwgc3VjY2VlZCwgd2l0aCB0aGUgcmVzdWx0cyBiZWluZyB0aGUgcmVzdWx0cyBvZiBhbGwgdGhlIGlucHV0XG4gICAgICogcHJvbWlzZXMuIEZvciBleGFtcGxlOiA8cHJlPlxuICAgICAqICAgdmFyIHAxID0gUGFyc2UuUHJvbWlzZS5hcygxKTtcbiAgICAgKiAgIHZhciBwMiA9IFBhcnNlLlByb21pc2UuYXMoMik7XG4gICAgICogICB2YXIgcDMgPSBQYXJzZS5Qcm9taXNlLmFzKDMpO1xuICAgICAqXG4gICAgICogICBQYXJzZS5Qcm9taXNlLndoZW4ocDEsIHAyLCBwMykudGhlbihmdW5jdGlvbihyMSwgcjIsIHIzKSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKHIxKTsgIC8vIHByaW50cyAxXG4gICAgICogICAgIGNvbnNvbGUubG9nKHIyKTsgIC8vIHByaW50cyAyXG4gICAgICogICAgIGNvbnNvbGUubG9nKHIzKTsgIC8vIHByaW50cyAzXG4gICAgICogICB9KTs8L3ByZT5cbiAgICAgKlxuICAgICAqIFRoZSBpbnB1dCBwcm9taXNlcyBjYW4gYWxzbyBiZSBzcGVjaWZpZWQgYXMgYW4gYXJyYXk6IDxwcmU+XG4gICAgICogICB2YXIgcHJvbWlzZXMgPSBbcDEsIHAyLCBwM107XG4gICAgICogICBQYXJzZS5Qcm9taXNlLndoZW4ocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24ocjEsIHIyLCByMykge1xuICAgICAqICAgICBjb25zb2xlLmxvZyhyMSk7ICAvLyBwcmludHMgMVxuICAgICAqICAgICBjb25zb2xlLmxvZyhyMik7ICAvLyBwcmludHMgMlxuICAgICAqICAgICBjb25zb2xlLmxvZyhyMyk7ICAvLyBwcmludHMgM1xuICAgICAqICAgfSk7XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYSBsaXN0IG9mIHByb21pc2VzIHRvIHdhaXQgZm9yLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IHRoZSBuZXcgcHJvbWlzZS5cbiAgICAgKi9cbiAgICB3aGVuOiBmdW5jdGlvbihwcm9taXNlcykge1xuICAgICAgLy8gQWxsb3cgcGFzc2luZyBpbiBQcm9taXNlcyBhcyBzZXBhcmF0ZSBhcmd1bWVudHMgaW5zdGVhZCBvZiBhbiBBcnJheS5cbiAgICAgIHZhciBvYmplY3RzO1xuICAgICAgaWYgKHByb21pc2VzICYmIFBhcnNlLl9pc051bGxPclVuZGVmaW5lZChwcm9taXNlcy5sZW5ndGgpKSB7XG4gICAgICAgIG9iamVjdHMgPSBhcmd1bWVudHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3RzID0gcHJvbWlzZXM7XG4gICAgICB9XG5cbiAgICAgIHZhciB0b3RhbCA9IG9iamVjdHMubGVuZ3RoO1xuICAgICAgdmFyIGhhZEVycm9yID0gZmFsc2U7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgdmFyIGVycm9ycyA9IFtdO1xuICAgICAgcmVzdWx0cy5sZW5ndGggPSBvYmplY3RzLmxlbmd0aDtcbiAgICAgIGVycm9ycy5sZW5ndGggPSBvYmplY3RzLmxlbmd0aDtcblxuICAgICAgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzLmFwcGx5KHRoaXMsIHJlc3VsdHMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG5cbiAgICAgIHZhciByZXNvbHZlT25lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRvdGFsID0gdG90YWwgLSAxO1xuICAgICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgICBpZiAoaGFkRXJyb3IpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVqZWN0KGVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCByZXN1bHRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIFBhcnNlLl9hcnJheUVhY2gob2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICAgIGlmIChQYXJzZS5Qcm9taXNlLmlzKG9iamVjdCkpIHtcbiAgICAgICAgICBvYmplY3QudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSByZXN1bHQ7XG4gICAgICAgICAgICByZXNvbHZlT25lKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9yc1tpXSA9IGVycm9yO1xuICAgICAgICAgICAgaGFkRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgcmVzb2x2ZU9uZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHNbaV0gPSBvYmplY3Q7XG4gICAgICAgICAgcmVzb2x2ZU9uZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1bnMgdGhlIGdpdmVuIGFzeW5jRnVuY3Rpb24gcmVwZWF0ZWRseSwgYXMgbG9uZyBhcyB0aGUgcHJlZGljYXRlXG4gICAgICogZnVuY3Rpb24gcmV0dXJucyBhIHRydXRoeSB2YWx1ZS4gU3RvcHMgcmVwZWF0aW5nIGlmIGFzeW5jRnVuY3Rpb24gcmV0dXJuc1xuICAgICAqIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIHJlYWR5IHRvIHN0b3AuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gYXN5bmNGdW5jdGlvbiBzaG91bGQgcmV0dXJuIGEgUHJvbWlzZS5cbiAgICAgKi9cbiAgICBfY29udGludWVXaGlsZTogZnVuY3Rpb24ocHJlZGljYXRlLCBhc3luY0Z1bmN0aW9uKSB7XG4gICAgICBpZiAocHJlZGljYXRlKCkpIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jRnVuY3Rpb24oKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLl9jb250aW51ZVdoaWxlKHByZWRpY2F0ZSwgYXN5bmNGdW5jdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIF8uZXh0ZW5kKFBhcnNlLlByb21pc2UucHJvdG90eXBlLCAvKiogQGxlbmRzIFBhcnNlLlByb21pc2UucHJvdG90eXBlICovIHtcblxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoaXMgcHJvbWlzZSBhcyBmdWxmaWxsZWQsIGZpcmluZyBhbnkgY2FsbGJhY2tzIHdhaXRpbmcgb24gaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3VsdCB0aGUgcmVzdWx0IHRvIHBhc3MgdG8gdGhlIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICByZXNvbHZlOiBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIGlmICh0aGlzLl9yZXNvbHZlZCB8fCB0aGlzLl9yZWplY3RlZCkge1xuICAgICAgICB0aHJvdyBcIkEgcHJvbWlzZSB3YXMgcmVzb2x2ZWQgZXZlbiB0aG91Z2ggaXQgaGFkIGFscmVhZHkgYmVlbiBcIiArXG4gICAgICAgICAgKHRoaXMuX3Jlc29sdmVkID8gXCJyZXNvbHZlZFwiIDogXCJyZWplY3RlZFwiKSArIFwiLlwiO1xuICAgICAgfVxuICAgICAgdGhpcy5fcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fcmVzdWx0ID0gYXJndW1lbnRzO1xuICAgICAgdmFyIHJlc3VsdHMgPSBhcmd1bWVudHM7XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMuX3Jlc29sdmVkQ2FsbGJhY2tzLCBmdW5jdGlvbihyZXNvbHZlZENhbGxiYWNrKSB7XG4gICAgICAgIHJlc29sdmVkQ2FsbGJhY2suYXBwbHkodGhpcywgcmVzdWx0cyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3Jlc29sdmVkQ2FsbGJhY2tzID0gW107XG4gICAgICB0aGlzLl9yZWplY3RlZENhbGxiYWNrcyA9IFtdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGlzIHByb21pc2UgYXMgZnVsZmlsbGVkLCBmaXJpbmcgYW55IGNhbGxiYWNrcyB3YWl0aW5nIG9uIGl0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvciB0aGUgZXJyb3IgdG8gcGFzcyB0byB0aGUgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHJlamVjdDogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmICh0aGlzLl9yZXNvbHZlZCB8fCB0aGlzLl9yZWplY3RlZCkge1xuICAgICAgICB0aHJvdyBcIkEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQgZXZlbiB0aG91Z2ggaXQgaGFkIGFscmVhZHkgYmVlbiBcIiArXG4gICAgICAgICAgKHRoaXMuX3Jlc29sdmVkID8gXCJyZXNvbHZlZFwiIDogXCJyZWplY3RlZFwiKSArIFwiLlwiO1xuICAgICAgfVxuICAgICAgdGhpcy5fcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5fcmVqZWN0ZWRDYWxsYmFja3MsIGZ1bmN0aW9uKHJlamVjdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgcmVqZWN0ZWRDYWxsYmFjayhlcnJvcik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3Jlc29sdmVkQ2FsbGJhY2tzID0gW107XG4gICAgICB0aGlzLl9yZWplY3RlZENhbGxiYWNrcyA9IFtdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGNhbGxiYWNrcyB0byBiZSBjYWxsZWQgd2hlbiB0aGlzIHByb21pc2UgaXMgZnVsZmlsbGVkLiBSZXR1cm5zIGEgbmV3XG4gICAgICogUHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdoZW4gdGhlIGNhbGxiYWNrIGlzIGNvbXBsZXRlLiBJdCBhbGxvd3NcbiAgICAgKiBjaGFpbmluZy4gSWYgdGhlIGNhbGxiYWNrIGl0c2VsZiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlbiB0aGUgb25lIHJldHVybmVkXG4gICAgICogYnkgXCJ0aGVuXCIgd2lsbCBub3QgYmUgZnVsZmlsbGVkIHVudGlsIHRoYXQgb25lIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFja1xuICAgICAqIGlzIGZ1bGZpbGxlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlZENhbGxiYWNrIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhpc1xuICAgICAqIFByb21pc2UgaXMgcmVzb2x2ZWQuIE9uY2UgdGhlIGNhbGxiYWNrIGlzIGNvbXBsZXRlLCB0aGVuIHRoZSBQcm9taXNlXG4gICAgICogcmV0dXJuZWQgYnkgXCJ0aGVuXCIgd2lsbCBhbHNvIGJlIGZ1bGZpbGxlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZENhbGxiYWNrIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhpc1xuICAgICAqIFByb21pc2UgaXMgcmVqZWN0ZWQgd2l0aCBhbiBlcnJvci4gT25jZSB0aGUgY2FsbGJhY2sgaXMgY29tcGxldGUsIHRoZW5cbiAgICAgKiB0aGUgcHJvbWlzZSByZXR1cm5lZCBieSBcInRoZW5cIiB3aXRoIGJlIHJlc29sdmVkIHN1Y2Nlc3NmdWxseS4gSWZcbiAgICAgKiByZWplY3RlZENhbGxiYWNrIGlzIG51bGwsIG9yIGl0IHJldHVybnMgYSByZWplY3RlZCBQcm9taXNlLCB0aGVuIHRoZVxuICAgICAqIFByb21pc2UgcmV0dXJuZWQgYnkgXCJ0aGVuXCIgd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoYXQgZXJyb3IuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBuZXcgUHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIGFmdGVyIHRoaXNcbiAgICAgKiBQcm9taXNlIGlzIGZ1bGZpbGxlZCBhbmQgZWl0aGVyIGNhbGxiYWNrIGhhcyBjb21wbGV0ZWQuIElmIHRoZSBjYWxsYmFja1xuICAgICAqIHJldHVybmVkIGEgUHJvbWlzZSwgdGhlbiB0aGlzIFByb21pc2Ugd2lsbCBub3QgYmUgZnVsZmlsbGVkIHVudGlsIHRoYXRcbiAgICAgKiBvbmUgaXMuXG4gICAgICovXG4gICAgdGhlbjogZnVuY3Rpb24ocmVzb2x2ZWRDYWxsYmFjaywgcmVqZWN0ZWRDYWxsYmFjaykge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuXG4gICAgICB2YXIgd3JhcHBlZFJlc29sdmVkQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGFyZ3VtZW50cztcbiAgICAgICAgaWYgKHJlc29sdmVkQ2FsbGJhY2spIHtcbiAgICAgICAgICBpZiAoUGFyc2UuUHJvbWlzZS5faXNQcm9taXNlc0FQbHVzQ29tcGxpYW50KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBbcmVzb2x2ZWRDYWxsYmFjay5hcHBseSh0aGlzLCByZXN1bHQpXTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gW1BhcnNlLlByb21pc2UuZXJyb3IoZSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBbcmVzb2x2ZWRDYWxsYmFjay5hcHBseSh0aGlzLCByZXN1bHQpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEgJiYgUGFyc2UuUHJvbWlzZS5pcyhyZXN1bHRbMF0pKSB7XG4gICAgICAgICAgcmVzdWx0WzBdLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUuYXBwbHkocHJvbWlzZSwgYXJndW1lbnRzKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCByZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgd3JhcHBlZFJlamVjdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGlmIChyZWplY3RlZENhbGxiYWNrKSB7XG4gICAgICAgICAgaWYgKFBhcnNlLlByb21pc2UuX2lzUHJvbWlzZXNBUGx1c0NvbXBsaWFudCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gW3JlamVjdGVkQ2FsbGJhY2soZXJyb3IpXTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gW1BhcnNlLlByb21pc2UuZXJyb3IoZSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBbcmVqZWN0ZWRDYWxsYmFjayhlcnJvcildO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSAmJiBQYXJzZS5Qcm9taXNlLmlzKHJlc3VsdFswXSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFswXS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlc29sdmUuYXBwbHkocHJvbWlzZSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoUGFyc2UuUHJvbWlzZS5faXNQcm9taXNlc0FQbHVzQ29tcGxpYW50KSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCByZXN1bHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QocmVzdWx0WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgcnVuTGF0ZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgIGZ1bmMuY2FsbCgpO1xuICAgICAgfTtcbiAgICAgIGlmIChQYXJzZS5Qcm9taXNlLl9pc1Byb21pc2VzQVBsdXNDb21wbGlhbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZih3aW5kb3cpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuc2V0VGltZW91dCkge1xuICAgICAgICAgIHJ1bkxhdGVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuYywgMCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YocHJvY2VzcykgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MubmV4dFRpY2spIHtcbiAgICAgICAgICBydW5MYXRlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuYyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAodGhpcy5fcmVzb2x2ZWQpIHtcbiAgICAgICAgcnVuTGF0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd3JhcHBlZFJlc29sdmVkQ2FsbGJhY2suYXBwbHkoc2VsZiwgc2VsZi5fcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3JlamVjdGVkKSB7XG4gICAgICAgIHJ1bkxhdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdyYXBwZWRSZWplY3RlZENhbGxiYWNrKHNlbGYuX2Vycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXNvbHZlZENhbGxiYWNrcy5wdXNoKHdyYXBwZWRSZXNvbHZlZENhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5fcmVqZWN0ZWRDYWxsYmFja3MucHVzaCh3cmFwcGVkUmVqZWN0ZWRDYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgaGFuZGxlcnMgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHByb21pc2UgXG4gICAgICogaXMgZWl0aGVyIHJlc29sdmVkIG9yIHJlamVjdGVkXG4gICAgICovXG4gICAgYWx3YXlzOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbihjYWxsYmFjaywgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgaGFuZGxlcnMgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIFByb21pc2Ugb2JqZWN0IGlzIHJlc29sdmVkXG4gICAgICovXG4gICAgZG9uZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4oY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgaGFuZGxlcnMgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIFByb21pc2Ugb2JqZWN0IGlzIHJlamVjdGVkXG4gICAgICovXG4gICAgZmFpbDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGhlIGdpdmVuIGNhbGxiYWNrcyBhZnRlciB0aGlzIHByb21pc2UgaXMgZnVsZmlsbGVkLlxuICAgICAqIEBwYXJhbSBvcHRpb25zT3JDYWxsYmFjayB7fSBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgY2FsbGJhY2ssIG9yIGFcbiAgICAgKiBjYWxsYmFjayBmdW5jdGlvbi4gSWYgdGhpcyBpcyBhbiBvcHRpb25zIG9iamVjdCBhbmQgY29udGFpbnMgYSBcIm1vZGVsXCJcbiAgICAgKiBhdHRyaWJ1dGVzLCB0aGF0IHdpbGwgYmUgcGFzc2VkIHRvIGVycm9yIGNhbGxiYWNrcyBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAgICogQHBhcmFtIG1vZGVsIHt9IElmIHRydXRoeSwgdGhpcyB3aWxsIGJlIHBhc3NlZCBhcyB0aGUgZmlyc3QgcmVzdWx0IG9mXG4gICAgICogZXJyb3IgY2FsbGJhY2tzLiBUaGlzIGlzIGZvciBCYWNrYm9uZS1jb21wYXRhYmlsaXR5LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgYWZ0ZXIgdGhlXG4gICAgICogY2FsbGJhY2tzIGFyZSBydW4sIHdpdGggdGhlIHNhbWUgcmVzdWx0IGFzIHRoaXMuXG4gICAgICovXG4gICAgX3RoZW5SdW5DYWxsYmFja3M6IGZ1bmN0aW9uKG9wdGlvbnNPckNhbGxiYWNrLCBtb2RlbCkge1xuICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9wdGlvbnNPckNhbGxiYWNrKSkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBvcHRpb25zT3JDYWxsYmFjaztcbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCwgbnVsbCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zID0gXy5jbG9uZShvcHRpb25zT3JDYWxsYmFjayk7XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGVsKSB7XG4gICAgICAgICAgLy8gV2hlbiB0aGVyZSdzIG5vIGNhbGxiYWNrLCBhIHN5bmMgZXZlbnQgc2hvdWxkIGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdzeW5jJywgbW9kZWwsIHJlc3VsdCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMuYXBwbHkoUGFyc2UuUHJvbWlzZSwgYXJndW1lbnRzKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgaWYgKCFfLmlzVW5kZWZpbmVkKG1vZGVsKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5lcnJvcihtb2RlbCwgZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHRpb25zLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZWwpIHtcbiAgICAgICAgICAvLyBXaGVuIHRoZXJlJ3Mgbm8gZXJyb3IgY2FsbGJhY2ssIGFuIGVycm9yIGV2ZW50IHNob3VsZCBiZSB0cmlnZ2VyZWQuXG4gICAgICAgICAgbW9kZWwudHJpZ2dlcignZXJyb3InLCBtb2RlbCwgZXJyb3IsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGEgcmVqZWN0ZWQgUHJvbWlzZSwgdGhpcyB3aWxsIHdvcmsgd2l0aFxuICAgICAgICAvLyBlaXRoZXIgalF1ZXJ5IG9yIFByb21pc2VzL0Egc2VtYW50aWNzLlxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCByZWdhcmRsZXNzIG9mIHdoZXRoZXJcbiAgICAgKiB0aGlzIHByb21pc2UgZmFpbGVkIG9yIHN1Y2NlZWRlZC4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgZ2l2ZW4gZWl0aGVyIHRoZVxuICAgICAqIGFycmF5IG9mIHJlc3VsdHMgZm9yIGl0cyBmaXJzdCBhcmd1bWVudCwgb3IgdGhlIGVycm9yIGFzIGl0cyBzZWNvbmQsXG4gICAgICogZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhpcyBQcm9taXNlIHdhcyByZWplY3RlZCBvciByZXNvbHZlZC4gUmV0dXJucyBhXG4gICAgICogbmV3IFByb21pc2UsIGxpa2UgXCJ0aGVuXCIgd291bGQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29udGludWF0aW9uIHRoZSBjYWxsYmFjay5cbiAgICAgKi9cbiAgICBfY29udGludWVXaXRoOiBmdW5jdGlvbihjb250aW51YXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb250aW51YXRpb24oYXJndW1lbnRzLCBudWxsKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBjb250aW51YXRpb24obnVsbCwgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gIH0pO1xuXG59KHRoaXMpKTtcblxuLypqc2hpbnQgYml0d2lzZTpmYWxzZSAqLy8qZ2xvYmFsIEZpbGVSZWFkZXI6IHRydWUsIEZpbGU6IHRydWUgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgdmFyIGI2NERpZ2l0ID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgaWYgKG51bWJlciA8IDI2KSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIG51bWJlcik7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPCA1Mikge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyAobnVtYmVyIC0gMjYpKTtcbiAgICB9XG4gICAgaWYgKG51bWJlciA8IDYyKSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg0OCArIChudW1iZXIgLSA1MikpO1xuICAgIH1cbiAgICBpZiAobnVtYmVyID09PSA2Mikge1xuICAgICAgcmV0dXJuIFwiK1wiO1xuICAgIH1cbiAgICBpZiAobnVtYmVyID09PSA2Mykge1xuICAgICAgcmV0dXJuIFwiL1wiO1xuICAgIH1cbiAgICB0aHJvdyBcIlRyaWVkIHRvIGVuY29kZSBsYXJnZSBkaWdpdCBcIiArIG51bWJlciArIFwiIGluIGJhc2U2NC5cIjtcbiAgfTtcblxuICB2YXIgZW5jb2RlQmFzZTY0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgY2h1bmtzID0gW107XG4gICAgY2h1bmtzLmxlbmd0aCA9IE1hdGguY2VpbChhcnJheS5sZW5ndGggLyAzKTtcbiAgICBfLnRpbWVzKGNodW5rcy5sZW5ndGgsIGZ1bmN0aW9uKGkpIHtcbiAgICAgIHZhciBiMSA9IGFycmF5W2kgKiAzXTtcbiAgICAgIHZhciBiMiA9IGFycmF5W2kgKiAzICsgMV0gfHwgMDtcbiAgICAgIHZhciBiMyA9IGFycmF5W2kgKiAzICsgMl0gfHwgMDtcblxuICAgICAgdmFyIGhhczIgPSAoaSAqIDMgKyAxKSA8IGFycmF5Lmxlbmd0aDtcbiAgICAgIHZhciBoYXMzID0gKGkgKiAzICsgMikgPCBhcnJheS5sZW5ndGg7XG5cbiAgICAgIGNodW5rc1tpXSA9IFtcbiAgICAgICAgYjY0RGlnaXQoKGIxID4+IDIpICYgMHgzRiksXG4gICAgICAgIGI2NERpZ2l0KCgoYjEgPDwgNCkgJiAweDMwKSB8ICgoYjIgPj4gNCkgJiAweDBGKSksXG4gICAgICAgIGhhczIgPyBiNjREaWdpdCgoKGIyIDw8IDIpICYgMHgzQykgfCAoKGIzID4+IDYpICYgMHgwMykpIDogXCI9XCIsXG4gICAgICAgIGhhczMgPyBiNjREaWdpdChiMyAmIDB4M0YpIDogXCI9XCJcbiAgICAgIF0uam9pbihcIlwiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY2h1bmtzLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gVE9ETyhrbGltdCk6IE1vdmUgdGhpcyBsaXN0IHRvIHRoZSBzZXJ2ZXIuXG4gIC8vIEEgbGlzdCBvZiBmaWxlIGV4dGVuc2lvbnMgdG8gbWltZSB0eXBlcyBhcyBmb3VuZCBoZXJlOlxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU4NTEwL3VzaW5nLW5ldC1ob3ctY2FuLXlvdS1maW5kLXRoZS1cbiAgLy8gICAgIG1pbWUtdHlwZS1vZi1hLWZpbGUtYmFzZWQtb24tdGhlLWZpbGUtc2lnbmF0dXJlXG4gIHZhciBtaW1lVHlwZXMgPSB7XG4gICAgYWk6IFwiYXBwbGljYXRpb24vcG9zdHNjcmlwdFwiLFxuICAgIGFpZjogXCJhdWRpby94LWFpZmZcIixcbiAgICBhaWZjOiBcImF1ZGlvL3gtYWlmZlwiLFxuICAgIGFpZmY6IFwiYXVkaW8veC1haWZmXCIsXG4gICAgYXNjOiBcInRleHQvcGxhaW5cIixcbiAgICBhdG9tOiBcImFwcGxpY2F0aW9uL2F0b20reG1sXCIsXG4gICAgYXU6IFwiYXVkaW8vYmFzaWNcIixcbiAgICBhdmk6IFwidmlkZW8veC1tc3ZpZGVvXCIsXG4gICAgYmNwaW86IFwiYXBwbGljYXRpb24veC1iY3Bpb1wiLFxuICAgIGJpbjogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBibXA6IFwiaW1hZ2UvYm1wXCIsXG4gICAgY2RmOiBcImFwcGxpY2F0aW9uL3gtbmV0Y2RmXCIsXG4gICAgY2dtOiBcImltYWdlL2NnbVwiLFxuICAgIFwiY2xhc3NcIjogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBjcGlvOiBcImFwcGxpY2F0aW9uL3gtY3Bpb1wiLFxuICAgIGNwdDogXCJhcHBsaWNhdGlvbi9tYWMtY29tcGFjdHByb1wiLFxuICAgIGNzaDogXCJhcHBsaWNhdGlvbi94LWNzaFwiLFxuICAgIGNzczogXCJ0ZXh0L2Nzc1wiLFxuICAgIGRjcjogXCJhcHBsaWNhdGlvbi94LWRpcmVjdG9yXCIsXG4gICAgZGlmOiBcInZpZGVvL3gtZHZcIixcbiAgICBkaXI6IFwiYXBwbGljYXRpb24veC1kaXJlY3RvclwiLFxuICAgIGRqdjogXCJpbWFnZS92bmQuZGp2dVwiLFxuICAgIGRqdnU6IFwiaW1hZ2Uvdm5kLmRqdnVcIixcbiAgICBkbGw6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgZG1nOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIGRtczogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBkb2M6IFwiYXBwbGljYXRpb24vbXN3b3JkXCIsXG4gICAgZG9jeDogXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5cIiArXG4gICAgICAgICAgXCJkb2N1bWVudFwiLFxuICAgIGRvdHg6IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuXCIgK1xuICAgICAgICAgIFwidGVtcGxhdGVcIixcbiAgICBkb2NtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLmRvY3VtZW50Lm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIGRvdG06IFwiYXBwbGljYXRpb24vdm5kLm1zLXdvcmQudGVtcGxhdGUubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgZHRkOiBcImFwcGxpY2F0aW9uL3htbC1kdGRcIixcbiAgICBkdjogXCJ2aWRlby94LWR2XCIsXG4gICAgZHZpOiBcImFwcGxpY2F0aW9uL3gtZHZpXCIsXG4gICAgZHhyOiBcImFwcGxpY2F0aW9uL3gtZGlyZWN0b3JcIixcbiAgICBlcHM6IFwiYXBwbGljYXRpb24vcG9zdHNjcmlwdFwiLFxuICAgIGV0eDogXCJ0ZXh0L3gtc2V0ZXh0XCIsXG4gICAgZXhlOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIGV6OiBcImFwcGxpY2F0aW9uL2FuZHJldy1pbnNldFwiLFxuICAgIGdpZjogXCJpbWFnZS9naWZcIixcbiAgICBncmFtOiBcImFwcGxpY2F0aW9uL3NyZ3NcIixcbiAgICBncnhtbDogXCJhcHBsaWNhdGlvbi9zcmdzK3htbFwiLFxuICAgIGd0YXI6IFwiYXBwbGljYXRpb24veC1ndGFyXCIsXG4gICAgaGRmOiBcImFwcGxpY2F0aW9uL3gtaGRmXCIsXG4gICAgaHF4OiBcImFwcGxpY2F0aW9uL21hYy1iaW5oZXg0MFwiLFxuICAgIGh0bTogXCJ0ZXh0L2h0bWxcIixcbiAgICBodG1sOiBcInRleHQvaHRtbFwiLFxuICAgIGljZTogXCJ4LWNvbmZlcmVuY2UveC1jb29sdGFsa1wiLFxuICAgIGljbzogXCJpbWFnZS94LWljb25cIixcbiAgICBpY3M6IFwidGV4dC9jYWxlbmRhclwiLFxuICAgIGllZjogXCJpbWFnZS9pZWZcIixcbiAgICBpZmI6IFwidGV4dC9jYWxlbmRhclwiLFxuICAgIGlnZXM6IFwibW9kZWwvaWdlc1wiLFxuICAgIGlnczogXCJtb2RlbC9pZ2VzXCIsXG4gICAgam5scDogXCJhcHBsaWNhdGlvbi94LWphdmEtam5scC1maWxlXCIsXG4gICAganAyOiBcImltYWdlL2pwMlwiLFxuICAgIGpwZTogXCJpbWFnZS9qcGVnXCIsXG4gICAganBlZzogXCJpbWFnZS9qcGVnXCIsXG4gICAganBnOiBcImltYWdlL2pwZWdcIixcbiAgICBqczogXCJhcHBsaWNhdGlvbi94LWphdmFzY3JpcHRcIixcbiAgICBrYXI6IFwiYXVkaW8vbWlkaVwiLFxuICAgIGxhdGV4OiBcImFwcGxpY2F0aW9uL3gtbGF0ZXhcIixcbiAgICBsaGE6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgbHpoOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIG0zdTogXCJhdWRpby94LW1wZWd1cmxcIixcbiAgICBtNGE6IFwiYXVkaW8vbXA0YS1sYXRtXCIsXG4gICAgbTRiOiBcImF1ZGlvL21wNGEtbGF0bVwiLFxuICAgIG00cDogXCJhdWRpby9tcDRhLWxhdG1cIixcbiAgICBtNHU6IFwidmlkZW8vdm5kLm1wZWd1cmxcIixcbiAgICBtNHY6IFwidmlkZW8veC1tNHZcIixcbiAgICBtYWM6IFwiaW1hZ2UveC1tYWNwYWludFwiLFxuICAgIG1hbjogXCJhcHBsaWNhdGlvbi94LXRyb2ZmLW1hblwiLFxuICAgIG1hdGhtbDogXCJhcHBsaWNhdGlvbi9tYXRobWwreG1sXCIsXG4gICAgbWU6IFwiYXBwbGljYXRpb24veC10cm9mZi1tZVwiLFxuICAgIG1lc2g6IFwibW9kZWwvbWVzaFwiLFxuICAgIG1pZDogXCJhdWRpby9taWRpXCIsXG4gICAgbWlkaTogXCJhdWRpby9taWRpXCIsXG4gICAgbWlmOiBcImFwcGxpY2F0aW9uL3ZuZC5taWZcIixcbiAgICBtb3Y6IFwidmlkZW8vcXVpY2t0aW1lXCIsXG4gICAgbW92aWU6IFwidmlkZW8veC1zZ2ktbW92aWVcIixcbiAgICBtcDI6IFwiYXVkaW8vbXBlZ1wiLFxuICAgIG1wMzogXCJhdWRpby9tcGVnXCIsXG4gICAgbXA0OiBcInZpZGVvL21wNFwiLFxuICAgIG1wZTogXCJ2aWRlby9tcGVnXCIsXG4gICAgbXBlZzogXCJ2aWRlby9tcGVnXCIsXG4gICAgbXBnOiBcInZpZGVvL21wZWdcIixcbiAgICBtcGdhOiBcImF1ZGlvL21wZWdcIixcbiAgICBtczogXCJhcHBsaWNhdGlvbi94LXRyb2ZmLW1zXCIsXG4gICAgbXNoOiBcIm1vZGVsL21lc2hcIixcbiAgICBteHU6IFwidmlkZW8vdm5kLm1wZWd1cmxcIixcbiAgICBuYzogXCJhcHBsaWNhdGlvbi94LW5ldGNkZlwiLFxuICAgIG9kYTogXCJhcHBsaWNhdGlvbi9vZGFcIixcbiAgICBvZ2c6IFwiYXBwbGljYXRpb24vb2dnXCIsXG4gICAgcGJtOiBcImltYWdlL3gtcG9ydGFibGUtYml0bWFwXCIsXG4gICAgcGN0OiBcImltYWdlL3BpY3RcIixcbiAgICBwZGI6IFwiY2hlbWljYWwveC1wZGJcIixcbiAgICBwZGY6IFwiYXBwbGljYXRpb24vcGRmXCIsXG4gICAgcGdtOiBcImltYWdlL3gtcG9ydGFibGUtZ3JheW1hcFwiLFxuICAgIHBnbjogXCJhcHBsaWNhdGlvbi94LWNoZXNzLXBnblwiLFxuICAgIHBpYzogXCJpbWFnZS9waWN0XCIsXG4gICAgcGljdDogXCJpbWFnZS9waWN0XCIsXG4gICAgcG5nOiBcImltYWdlL3BuZ1wiLCBcbiAgICBwbm06IFwiaW1hZ2UveC1wb3J0YWJsZS1hbnltYXBcIixcbiAgICBwbnQ6IFwiaW1hZ2UveC1tYWNwYWludFwiLFxuICAgIHBudGc6IFwiaW1hZ2UveC1tYWNwYWludFwiLFxuICAgIHBwbTogXCJpbWFnZS94LXBvcnRhYmxlLXBpeG1hcFwiLFxuICAgIHBwdDogXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludFwiLFxuICAgIHBwdHg6IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLlwiICtcbiAgICAgICAgICBcInByZXNlbnRhdGlvblwiLFxuICAgIHBvdHg6IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLlwiICtcbiAgICAgICAgICBcInRlbXBsYXRlXCIsXG4gICAgcHBzeDogXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuXCIgK1xuICAgICAgICAgIFwic2xpZGVzaG93XCIsXG4gICAgcHBhbTogXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5hZGRpbi5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICBwcHRtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnByZXNlbnRhdGlvbi5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICBwb3RtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnRlbXBsYXRlLm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHBwc206IFwiYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuc2xpZGVzaG93Lm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHBzOiBcImFwcGxpY2F0aW9uL3Bvc3RzY3JpcHRcIixcbiAgICBxdDogXCJ2aWRlby9xdWlja3RpbWVcIixcbiAgICBxdGk6IFwiaW1hZ2UveC1xdWlja3RpbWVcIixcbiAgICBxdGlmOiBcImltYWdlL3gtcXVpY2t0aW1lXCIsXG4gICAgcmE6IFwiYXVkaW8veC1wbi1yZWFsYXVkaW9cIixcbiAgICByYW06IFwiYXVkaW8veC1wbi1yZWFsYXVkaW9cIixcbiAgICByYXM6IFwiaW1hZ2UveC1jbXUtcmFzdGVyXCIsXG4gICAgcmRmOiBcImFwcGxpY2F0aW9uL3JkZit4bWxcIixcbiAgICByZ2I6IFwiaW1hZ2UveC1yZ2JcIixcbiAgICBybTogXCJhcHBsaWNhdGlvbi92bmQucm4tcmVhbG1lZGlhXCIsXG4gICAgcm9mZjogXCJhcHBsaWNhdGlvbi94LXRyb2ZmXCIsXG4gICAgcnRmOiBcInRleHQvcnRmXCIsXG4gICAgcnR4OiBcInRleHQvcmljaHRleHRcIixcbiAgICBzZ206IFwidGV4dC9zZ21sXCIsXG4gICAgc2dtbDogXCJ0ZXh0L3NnbWxcIixcbiAgICBzaDogXCJhcHBsaWNhdGlvbi94LXNoXCIsXG4gICAgc2hhcjogXCJhcHBsaWNhdGlvbi94LXNoYXJcIixcbiAgICBzaWxvOiBcIm1vZGVsL21lc2hcIixcbiAgICBzaXQ6IFwiYXBwbGljYXRpb24veC1zdHVmZml0XCIsXG4gICAgc2tkOiBcImFwcGxpY2F0aW9uL3gta29hblwiLFxuICAgIHNrbTogXCJhcHBsaWNhdGlvbi94LWtvYW5cIixcbiAgICBza3A6IFwiYXBwbGljYXRpb24veC1rb2FuXCIsXG4gICAgc2t0OiBcImFwcGxpY2F0aW9uL3gta29hblwiLFxuICAgIHNtaTogXCJhcHBsaWNhdGlvbi9zbWlsXCIsXG4gICAgc21pbDogXCJhcHBsaWNhdGlvbi9zbWlsXCIsXG4gICAgc25kOiBcImF1ZGlvL2Jhc2ljXCIsXG4gICAgc286IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgc3BsOiBcImFwcGxpY2F0aW9uL3gtZnV0dXJlc3BsYXNoXCIsXG4gICAgc3JjOiBcImFwcGxpY2F0aW9uL3gtd2Fpcy1zb3VyY2VcIixcbiAgICBzdjRjcGlvOiBcImFwcGxpY2F0aW9uL3gtc3Y0Y3Bpb1wiLFxuICAgIHN2NGNyYzogXCJhcHBsaWNhdGlvbi94LXN2NGNyY1wiLFxuICAgIHN2ZzogXCJpbWFnZS9zdmcreG1sXCIsXG4gICAgc3dmOiBcImFwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoXCIsXG4gICAgdDogXCJhcHBsaWNhdGlvbi94LXRyb2ZmXCIsXG4gICAgdGFyOiBcImFwcGxpY2F0aW9uL3gtdGFyXCIsXG4gICAgdGNsOiBcImFwcGxpY2F0aW9uL3gtdGNsXCIsXG4gICAgdGV4OiBcImFwcGxpY2F0aW9uL3gtdGV4XCIsXG4gICAgdGV4aTogXCJhcHBsaWNhdGlvbi94LXRleGluZm9cIixcbiAgICB0ZXhpbmZvOiBcImFwcGxpY2F0aW9uL3gtdGV4aW5mb1wiLFxuICAgIHRpZjogXCJpbWFnZS90aWZmXCIsXG4gICAgdGlmZjogXCJpbWFnZS90aWZmXCIsXG4gICAgdHI6IFwiYXBwbGljYXRpb24veC10cm9mZlwiLFxuICAgIHRzdjogXCJ0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzXCIsXG4gICAgdHh0OiBcInRleHQvcGxhaW5cIixcbiAgICB1c3RhcjogXCJhcHBsaWNhdGlvbi94LXVzdGFyXCIsXG4gICAgdmNkOiBcImFwcGxpY2F0aW9uL3gtY2RsaW5rXCIsXG4gICAgdnJtbDogXCJtb2RlbC92cm1sXCIsXG4gICAgdnhtbDogXCJhcHBsaWNhdGlvbi92b2ljZXhtbCt4bWxcIixcbiAgICB3YXY6IFwiYXVkaW8veC13YXZcIixcbiAgICB3Ym1wOiBcImltYWdlL3ZuZC53YXAud2JtcFwiLFxuICAgIHdibXhsOiBcImFwcGxpY2F0aW9uL3ZuZC53YXAud2J4bWxcIixcbiAgICB3bWw6IFwidGV4dC92bmQud2FwLndtbFwiLFxuICAgIHdtbGM6IFwiYXBwbGljYXRpb24vdm5kLndhcC53bWxjXCIsXG4gICAgd21sczogXCJ0ZXh0L3ZuZC53YXAud21sc2NyaXB0XCIsXG4gICAgd21sc2M6IFwiYXBwbGljYXRpb24vdm5kLndhcC53bWxzY3JpcHRjXCIsXG4gICAgd3JsOiBcIm1vZGVsL3ZybWxcIixcbiAgICB4Ym06IFwiaW1hZ2UveC14Yml0bWFwXCIsXG4gICAgeGh0OiBcImFwcGxpY2F0aW9uL3hodG1sK3htbFwiLFxuICAgIHhodG1sOiBcImFwcGxpY2F0aW9uL3hodG1sK3htbFwiLFxuICAgIHhsczogXCJhcHBsaWNhdGlvbi92bmQubXMtZXhjZWxcIixcbiAgICB4bWw6IFwiYXBwbGljYXRpb24veG1sXCIsXG4gICAgeHBtOiBcImltYWdlL3gteHBpeG1hcFwiLFxuICAgIHhzbDogXCJhcHBsaWNhdGlvbi94bWxcIixcbiAgICB4bHN4OiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0XCIsXG4gICAgeGx0eDogXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5cIiArXG4gICAgICAgICAgXCJ0ZW1wbGF0ZVwiLFxuICAgIHhsc206IFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0Lm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHhsdG06IFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnRlbXBsYXRlLm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHhsYW06IFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLmFkZGluLm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHhsc2I6IFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0LmJpbmFyeS5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICB4c2x0OiBcImFwcGxpY2F0aW9uL3hzbHQreG1sXCIsXG4gICAgeHVsOiBcImFwcGxpY2F0aW9uL3ZuZC5tb3ppbGxhLnh1bCt4bWxcIixcbiAgICB4d2Q6IFwiaW1hZ2UveC14d2luZG93ZHVtcFwiLFxuICAgIHh5ejogXCJjaGVtaWNhbC94LXh5elwiLFxuICAgIHppcDogXCJhcHBsaWNhdGlvbi96aXBcIlxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWFkcyBhIEZpbGUgdXNpbmcgYSBGaWxlUmVhZGVyLlxuICAgKiBAcGFyYW0gZmlsZSB7RmlsZX0gdGhlIEZpbGUgdG8gcmVhZC5cbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gKG9wdGlvbmFsKSB0aGUgbWltZXR5cGUgdG8gb3ZlcnJpZGUgd2l0aC5cbiAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2l0aCBhXG4gICAqICAgICBiYXNlNjQtZW5jb2RlZCBzdHJpbmcgb2YgdGhlIGRhdGEgYW5kIGl0cyBtaW1lIHR5cGUuXG4gICAqL1xuICB2YXIgcmVhZEFzeW5jID0gZnVuY3Rpb24oZmlsZSwgdHlwZSkge1xuICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcblxuICAgIGlmICh0eXBlb2YoRmlsZVJlYWRlcikgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5GSUxFX1JFQURfRVJST1IsXG4gICAgICAgICAgXCJBdHRlbXB0ZWQgdG8gdXNlIGEgRmlsZVJlYWRlciBvbiBhbiB1bnN1cHBvcnRlZCBicm93c2VyLlwiKSk7XG4gICAgfVxuXG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJlYWRlci5yZWFkeVN0YXRlICE9PSAyKSB7XG4gICAgICAgIHByb21pc2UucmVqZWN0KG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLkZJTEVfUkVBRF9FUlJPUixcbiAgICAgICAgICAgIFwiRXJyb3IgcmVhZGluZyBmaWxlLlwiKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGFVUkwgPSByZWFkZXIucmVzdWx0O1xuICAgICAgdmFyIG1hdGNoZXMgPSAvXmRhdGE6KFteO10qKTtiYXNlNjQsKC4qKSQvLmV4ZWMoZGF0YVVSTCk7XG4gICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QobmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuRklMRV9SRUFEX0VSUk9SLFxuICAgICAgICAgICAgXCJVbmFibGUgdG8gaW50ZXJwcmV0IGRhdGEgVVJMOiBcIiArIGRhdGFVUkwpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBwcm9taXNlLnJlc29sdmUobWF0Y2hlc1syXSwgdHlwZSB8fCBtYXRjaGVzWzFdKTtcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIFBhcnNlLkZpbGUgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBhIGZpbGUgdGhhdCBpcyBzYXZlZCB0byB0aGUgUGFyc2VcbiAgICogY2xvdWQuXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0gbmFtZSB7U3RyaW5nfSBUaGUgZmlsZSdzIG5hbWUuIFRoaXMgd2lsbCBiZSBwcmVmaXhlZCBieSBhIHVuaXF1ZVxuICAgKiAgICAgdmFsdWUgb25jZSB0aGUgZmlsZSBoYXMgZmluaXNoZWQgc2F2aW5nLiBUaGUgZmlsZSBuYW1lIG11c3QgYmVnaW4gd2l0aFxuICAgKiAgICAgYW4gYWxwaGFudW1lcmljIGNoYXJhY3RlciwgYW5kIGNvbnNpc3Qgb2YgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMsXG4gICAqICAgICBwZXJpb2RzLCBzcGFjZXMsIHVuZGVyc2NvcmVzLCBvciBkYXNoZXMuXG4gICAqIEBwYXJhbSBkYXRhIHtBcnJheX0gVGhlIGRhdGEgZm9yIHRoZSBmaWxlLCBhcyBlaXRoZXI6XG4gICAqICAgICAxLiBhbiBBcnJheSBvZiBieXRlIHZhbHVlIE51bWJlcnMsIG9yXG4gICAqICAgICAyLiBhbiBPYmplY3QgbGlrZSB7IGJhc2U2NDogXCIuLi5cIiB9IHdpdGggYSBiYXNlNjQtZW5jb2RlZCBTdHJpbmcuXG4gICAqICAgICAzLiBhIEZpbGUgb2JqZWN0IHNlbGVjdGVkIHdpdGggYSBmaWxlIHVwbG9hZCBjb250cm9sLiAoMykgb25seSB3b3Jrc1xuICAgKiAgICAgICAgaW4gRmlyZWZveCAzLjYrLCBTYWZhcmkgNi4wLjIrLCBDaHJvbWUgNyssIGFuZCBJRSAxMCsuXG4gICAqICAgICAgICBGb3IgZXhhbXBsZTo8cHJlPlxuICAgKiB2YXIgZmlsZVVwbG9hZENvbnRyb2wgPSAkKFwiI3Byb2ZpbGVQaG90b0ZpbGVVcGxvYWRcIilbMF07XG4gICAqIGlmIChmaWxlVXBsb2FkQ29udHJvbC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAqICAgdmFyIGZpbGUgPSBmaWxlVXBsb2FkQ29udHJvbC5maWxlc1swXTtcbiAgICogICB2YXIgbmFtZSA9IFwicGhvdG8uanBnXCI7XG4gICAqICAgdmFyIHBhcnNlRmlsZSA9IG5ldyBQYXJzZS5GaWxlKG5hbWUsIGZpbGUpO1xuICAgKiAgIHBhcnNlRmlsZS5zYXZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICogICAgIC8vIFRoZSBmaWxlIGhhcyBiZWVuIHNhdmVkIHRvIFBhcnNlLlxuICAgKiAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAvLyBUaGUgZmlsZSBlaXRoZXIgY291bGQgbm90IGJlIHJlYWQsIG9yIGNvdWxkIG5vdCBiZSBzYXZlZCB0byBQYXJzZS5cbiAgICogICB9KTtcbiAgICogfTwvcHJlPlxuICAgKiBAcGFyYW0gdHlwZSB7U3RyaW5nfSBPcHRpb25hbCBDb250ZW50LVR5cGUgaGVhZGVyIHRvIHVzZSBmb3IgdGhlIGZpbGUuIElmXG4gICAqICAgICB0aGlzIGlzIG9taXR0ZWQsIHRoZSBjb250ZW50IHR5cGUgd2lsbCBiZSBpbmZlcnJlZCBmcm9tIHRoZSBuYW1lJ3NcbiAgICogICAgIGV4dGVuc2lvbi5cbiAgICovXG4gIFBhcnNlLkZpbGUgPSBmdW5jdGlvbihuYW1lLCBkYXRhLCB0eXBlKSB7XG4gICAgdGhpcy5fbmFtZSA9IG5hbWU7XG5cbiAgICAvLyBHdWVzcyB0aGUgY29udGVudCB0eXBlIGZyb20gdGhlIGV4dGVuc2lvbiBpZiB3ZSBuZWVkIHRvLlxuICAgIHZhciBleHRlbnNpb24gPSAvXFwuKFteLl0qKSQvLmV4ZWMobmFtZSk7XG4gICAgaWYgKGV4dGVuc2lvbikge1xuICAgICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uWzFdLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIHZhciBndWVzc2VkVHlwZSA9IHR5cGUgfHwgbWltZVR5cGVzW2V4dGVuc2lvbl0gfHwgXCJ0ZXh0L3BsYWluXCI7XG5cbiAgICBpZiAoXy5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB0aGlzLl9zb3VyY2UgPSBQYXJzZS5Qcm9taXNlLmFzKGVuY29kZUJhc2U2NChkYXRhKSwgZ3Vlc3NlZFR5cGUpO1xuICAgIH0gZWxzZSBpZiAoZGF0YSAmJiBkYXRhLmJhc2U2NCkge1xuICAgICAgLy8gaWYgaXQgY29udGFpbnMgZGF0YSB1cmksIGV4dHJhY3QgYmFzZWQ2NCBhbmQgdGhlIHR5cGUgb3V0IG9mIGl0LlxuICAgICAgLypqc2xpbnQgbWF4bGVuOiAxMDAwKi9cbiAgICAgIHZhciBkYXRhVXJpUmVnZXhwID0gL15kYXRhOihbYS16QS1aXSpcXC9bYS16QS1aKy4tXSopOyhjaGFyc2V0PVthLXpBLVowLTlcXC1cXC9cXHNdKiwpP2Jhc2U2NCwoXFxTKykvO1xuICAgICAgLypqc2xpbnQgbWF4bGVuOiA4MCovXG5cbiAgICAgIHZhciBtYXRjaGVzID0gZGF0YVVyaVJlZ2V4cC5leGVjKGRhdGEuYmFzZTY0KTtcbiAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBpZiBkYXRhIFVSSSB3aXRoIGNoYXJzZXQsIHRoZXJlIHdpbGwgaGF2ZSA0IG1hdGNoZXMuXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IFBhcnNlLlByb21pc2UuYXMoXG4gICAgICAgICAgKG1hdGNoZXMubGVuZ3RoID09PSA0ID8gbWF0Y2hlc1szXSA6IG1hdGNoZXNbMl0pLCBtYXRjaGVzWzFdXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zb3VyY2UgPSBQYXJzZS5Qcm9taXNlLmFzKGRhdGEuYmFzZTY0LCBndWVzc2VkVHlwZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YoRmlsZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgZGF0YSBpbnN0YW5jZW9mIEZpbGUpIHtcbiAgICAgIHRoaXMuX3NvdXJjZSA9IHJlYWRBc3luYyhkYXRhLCB0eXBlKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcoZGF0YSkpIHtcbiAgICAgIHRocm93IFwiQ3JlYXRpbmcgYSBQYXJzZS5GaWxlIGZyb20gYSBTdHJpbmcgaXMgbm90IHlldCBzdXBwb3J0ZWQuXCI7XG4gICAgfVxuICB9O1xuXG4gIFBhcnNlLkZpbGUucHJvdG90eXBlID0ge1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbmFtZSBvZiB0aGUgZmlsZS4gQmVmb3JlIHNhdmUgaXMgY2FsbGVkLCB0aGlzIGlzIHRoZSBmaWxlbmFtZVxuICAgICAqIGdpdmVuIGJ5IHRoZSB1c2VyLiBBZnRlciBzYXZlIGlzIGNhbGxlZCwgdGhhdCBuYW1lIGdldHMgcHJlZml4ZWQgd2l0aCBhXG4gICAgICogdW5pcXVlIGlkZW50aWZpZXIuXG4gICAgICovXG4gICAgbmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdXJsIG9mIHRoZSBmaWxlLiBJdCBpcyBvbmx5IGF2YWlsYWJsZSBhZnRlciB5b3Ugc2F2ZSB0aGUgZmlsZSBvclxuICAgICAqIGFmdGVyIHlvdSBnZXQgdGhlIGZpbGUgZnJvbSBhIFBhcnNlLk9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgdXJsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl91cmw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNhdmVzIHRoZSBmaWxlIHRvIHRoZSBQYXJzZSBjbG91ZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IFByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBzYXZlIGZpbmlzaGVzLlxuICAgICAqL1xuICAgIHNhdmU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnM9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmICghc2VsZi5fcHJldmlvdXNTYXZlKSB7XG4gICAgICAgIHNlbGYuX3ByZXZpb3VzU2F2ZSA9IHNlbGYuX3NvdXJjZS50aGVuKGZ1bmN0aW9uKGJhc2U2NCwgdHlwZSkge1xuICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYmFzZTY0OiBiYXNlNjQsXG4gICAgICAgICAgICBfQ29udGVudFR5cGU6IHR5cGVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgICAgICByb3V0ZTogXCJmaWxlc1wiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBzZWxmLl9uYW1lLFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBzZWxmLl9uYW1lID0gcmVzcG9uc2UubmFtZTtcbiAgICAgICAgICBzZWxmLl91cmwgPSByZXNwb25zZS51cmw7XG4gICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuX3ByZXZpb3VzU2F2ZS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbn0odGhpcykpO1xuXG4vLyBQYXJzZS5PYmplY3QgaXMgYW5hbG9nb3VzIHRvIHRoZSBKYXZhIFBhcnNlT2JqZWN0LlxuLy8gSXQgYWxzbyBpbXBsZW1lbnRzIHRoZSBzYW1lIGludGVyZmFjZSBhcyBhIEJhY2tib25lIG1vZGVsLlxuLy8gVE9ETzogbXVsdGlwbGUgZGlzcGF0Y2ggZm9yIGNhbGxiYWNrc1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBtb2RlbCB3aXRoIGRlZmluZWQgYXR0cmlidXRlcy4gQSBjbGllbnQgaWQgKGNpZCkgaXNcbiAgICogYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYW5kIGFzc2lnbmVkIGZvciB5b3UuXG4gICAqXG4gICAqIDxwPllvdSB3b24ndCBub3JtYWxseSBjYWxsIHRoaXMgbWV0aG9kIGRpcmVjdGx5LiAgSXQgaXMgcmVjb21tZW5kZWQgdGhhdFxuICAgKiB5b3UgdXNlIGEgc3ViY2xhc3Mgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPiBpbnN0ZWFkLCBjcmVhdGVkIGJ5IGNhbGxpbmdcbiAgICogPGNvZGU+ZXh0ZW5kPC9jb2RlPi48L3A+XG4gICAqXG4gICAqIDxwPkhvd2V2ZXIsIGlmIHlvdSBkb24ndCB3YW50IHRvIHVzZSBhIHN1YmNsYXNzLCBvciBhcmVuJ3Qgc3VyZSB3aGljaFxuICAgKiBzdWJjbGFzcyBpcyBhcHByb3ByaWF0ZSwgeW91IGNhbiB1c2UgdGhpcyBmb3JtOjxwcmU+XG4gICAqICAgICB2YXIgb2JqZWN0ID0gbmV3IFBhcnNlLk9iamVjdChcIkNsYXNzTmFtZVwiKTtcbiAgICogPC9wcmU+XG4gICAqIFRoYXQgaXMgYmFzaWNhbGx5IGVxdWl2YWxlbnQgdG86PHByZT5cbiAgICogICAgIHZhciBNeUNsYXNzID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkNsYXNzTmFtZVwiKTtcbiAgICogICAgIHZhciBvYmplY3QgPSBuZXcgTXlDbGFzcygpO1xuICAgKiA8L3ByZT48L3A+XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIFRoZSBpbml0aWFsIHNldCBvZiBkYXRhIHRvIHN0b3JlIGluIHRoZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgc2V0IG9mIEJhY2tib25lLWxpa2Ugb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGhlXG4gICAqICAgICBvYmplY3QuICBUaGUgb25seSBvcHRpb24gY3VycmVudGx5IHN1cHBvcnRlZCBpcyBcImNvbGxlY3Rpb25cIi5cbiAgICogQHNlZSBQYXJzZS5PYmplY3QuZXh0ZW5kXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5UaGUgZnVuZGFtZW50YWwgdW5pdCBvZiBQYXJzZSBkYXRhLCB3aGljaCBpbXBsZW1lbnRzIHRoZSBCYWNrYm9uZSBNb2RlbFxuICAgKiBpbnRlcmZhY2UuPC9wPlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0ID0gZnVuY3Rpb24oYXR0cmlidXRlcywgb3B0aW9ucykge1xuICAgIC8vIEFsbG93IG5ldyBQYXJzZS5PYmplY3QoXCJDbGFzc05hbWVcIikgYXMgYSBzaG9ydGN1dCB0byBfY3JlYXRlLlxuICAgIGlmIChfLmlzU3RyaW5nKGF0dHJpYnV0ZXMpKSB7XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll9jcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCB7fTtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnBhcnNlKSB7XG4gICAgICBhdHRyaWJ1dGVzID0gdGhpcy5wYXJzZShhdHRyaWJ1dGVzKTtcbiAgICB9XG4gICAgdmFyIGRlZmF1bHRzID0gUGFyc2UuX2dldFZhbHVlKHRoaXMsICdkZWZhdWx0cycpO1xuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgYXR0cmlidXRlcyA9IF8uZXh0ZW5kKHt9LCBkZWZhdWx0cywgYXR0cmlidXRlcyk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuY29sbGVjdGlvbikge1xuICAgICAgdGhpcy5jb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uO1xuICAgIH1cblxuICAgIHRoaXMuX3NlcnZlckRhdGEgPSB7fTsgIC8vIFRoZSBsYXN0IGtub3duIGRhdGEgZm9yIHRoaXMgb2JqZWN0IGZyb20gY2xvdWQuXG4gICAgdGhpcy5fb3BTZXRRdWV1ZSA9IFt7fV07ICAvLyBMaXN0IG9mIHNldHMgb2YgY2hhbmdlcyB0byB0aGUgZGF0YS5cbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTsgIC8vIFRoZSBiZXN0IGVzdGltYXRlIG9mIHRoaXMncyBjdXJyZW50IGRhdGEuXG5cbiAgICB0aGlzLl9oYXNoZWRKU09OID0ge307ICAvLyBIYXNoIG9mIHZhbHVlcyBvZiBjb250YWluZXJzIGF0IGxhc3Qgc2F2ZS5cbiAgICB0aGlzLl9lc2NhcGVkQXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMuY2lkID0gXy51bmlxdWVJZCgnYycpO1xuICAgIHRoaXMuY2hhbmdlZCA9IHt9O1xuICAgIHRoaXMuX3NpbGVudCA9IHt9O1xuICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcbiAgICBpZiAoIXRoaXMuc2V0KGF0dHJpYnV0ZXMsIHtzaWxlbnQ6IHRydWV9KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGFuIGludmFsaWQgUGFyc2UuT2JqZWN0XCIpO1xuICAgIH1cbiAgICB0aGlzLmNoYW5nZWQgPSB7fTtcbiAgICB0aGlzLl9zaWxlbnQgPSB7fTtcbiAgICB0aGlzLl9wZW5kaW5nID0ge307XG4gICAgdGhpcy5faGFzRGF0YSA9IHRydWU7XG4gICAgdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhpcyBvYmplY3QsIHVuaXF1ZSB3aXRoaW4gaXRzIGNsYXNzLlxuICAgKiBAbmFtZSBpZFxuICAgKiBAdHlwZSBTdHJpbmdcbiAgICogQGZpZWxkXG4gICAqIEBtZW1iZXJPZiBQYXJzZS5PYmplY3QucHJvdG90eXBlXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGUgZmlyc3QgdGltZSB0aGlzIG9iamVjdCB3YXMgc2F2ZWQgb24gdGhlIHNlcnZlci5cbiAgICogQG5hbWUgY3JlYXRlZEF0XG4gICAqIEB0eXBlIERhdGVcbiAgICogQGZpZWxkXG4gICAqIEBtZW1iZXJPZiBQYXJzZS5PYmplY3QucHJvdG90eXBlXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGUgbGFzdCB0aW1lIHRoaXMgb2JqZWN0IHdhcyB1cGRhdGVkIG9uIHRoZSBzZXJ2ZXIuXG4gICAqIEBuYW1lIHVwZGF0ZWRBdFxuICAgKiBAdHlwZSBEYXRlXG4gICAqIEBmaWVsZFxuICAgKiBAbWVtYmVyT2YgUGFyc2UuT2JqZWN0LnByb3RvdHlwZVxuICAgKi9cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGdpdmVuIGxpc3Qgb2YgUGFyc2UuT2JqZWN0LlxuICAgKiBJZiBhbnkgZXJyb3IgaXMgZW5jb3VudGVyZWQsIHN0b3BzIGFuZCBjYWxscyB0aGUgZXJyb3IgaGFuZGxlci5cbiAgICpcbiAgICogPHByZT5cbiAgICogICBQYXJzZS5PYmplY3Quc2F2ZUFsbChbb2JqZWN0MSwgb2JqZWN0MiwgLi4uXSwge1xuICAgKiAgICAgc3VjY2VzczogZnVuY3Rpb24obGlzdCkge1xuICAgKiAgICAgICAvLyBBbGwgdGhlIG9iamVjdHMgd2VyZSBzYXZlZC5cbiAgICogICAgIH0sXG4gICAqICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgICAgLy8gQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgc2F2aW5nIG9uZSBvZiB0aGUgb2JqZWN0cy5cbiAgICogICAgIH0sXG4gICAqICAgfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEEgbGlzdCBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAqIDwvdWw+XG4gICAqL1xuICBQYXJzZS5PYmplY3Quc2F2ZUFsbCA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll9kZWVwU2F2ZUFzeW5jKGxpc3QsIHtcbiAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgZ2l2ZW4gbGlzdCBvZiBtb2RlbHMgb24gdGhlIHNlcnZlciBpZiBpdCB3YXMgYWxyZWFkeSBwZXJzaXN0ZWQuXG4gICAqIE9wdGltaXN0aWNhbGx5IHJlbW92ZXMgZWFjaCBtb2RlbCBmcm9tIGl0cyBjb2xsZWN0aW9uLCBpZiBpdCBoYXMgb25lLlxuICAgKiBJZiBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCB3YWl0cyBmb3IgdGhlIHNlcnZlciB0byByZXNwb25kIGJlZm9yZSByZW1vdmFsLlxuICAgKlxuICAgKiA8cD5Vbmxpa2Ugc2F2ZUFsbCwgaWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIGRlbGV0aW5nIGFuIGluZGl2aWR1YWwgbW9kZWwsXG4gICAqIHRoaXMgbWV0aG9kIHdpbGwgY29udGludWUgdHJ5aW5nIHRvIGRlbGV0ZSB0aGUgcmVzdCBvZiB0aGUgbW9kZWxzIGlmXG4gICAqIHBvc3NpYmxlLCBleGNlcHQgaW4gdGhlIGNhc2Ugb2YgYSBmYXRhbCBlcnJvciBsaWtlIGEgY29ubmVjdGlvbiBlcnJvci5cbiAgICpcbiAgICogPHA+SW4gcGFydGljdWxhciwgdGhlIFBhcnNlLkVycm9yIG9iamVjdCByZXR1cm5lZCBpbiB0aGUgY2FzZSBvZiBlcnJvciBtYXlcbiAgICogYmUgb25lIG9mIHR3byB0eXBlczpcbiAgICpcbiAgICogPHVsPlxuICAgKiAgIDxsaT5BIFBhcnNlLkVycm9yLkFHR1JFR0FURV9FUlJPUi4gVGhpcyBvYmplY3QncyBcImVycm9yc1wiIHByb3BlcnR5IGlzIGFuXG4gICAqICAgICAgIGFycmF5IG9mIG90aGVyIFBhcnNlLkVycm9yIG9iamVjdHMuIEVhY2ggZXJyb3Igb2JqZWN0IGluIHRoaXMgYXJyYXlcbiAgICogICAgICAgaGFzIGFuIFwib2JqZWN0XCIgcHJvcGVydHkgdGhhdCByZWZlcmVuY2VzIHRoZSBvYmplY3QgdGhhdCBjb3VsZCBub3QgYmVcbiAgICogICAgICAgZGVsZXRlZCAoZm9yIGluc3RhbmNlLCBiZWNhdXNlIHRoYXQgb2JqZWN0IGNvdWxkIG5vdCBiZSBmb3VuZCkuPC9saT5cbiAgICogICA8bGk+QSBub24tYWdncmVnYXRlIFBhcnNlLkVycm9yLiBUaGlzIGluZGljYXRlcyBhIHNlcmlvdXMgZXJyb3IgdGhhdFxuICAgKiAgICAgICBjYXVzZWQgdGhlIGRlbGV0ZSBvcGVyYXRpb24gdG8gYmUgYWJvcnRlZCBwYXJ0d2F5IHRocm91Z2ggKGZvclxuICAgKiAgICAgICBpbnN0YW5jZSwgYSBjb25uZWN0aW9uIGZhaWx1cmUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgZGVsZXRlKS48L2xpPlxuICAgKiA8L3VsPlxuICAgKlxuICAgKiA8cHJlPlxuICAgKiAgIFBhcnNlLk9iamVjdC5kZXN0cm95QWxsKFtvYmplY3QxLCBvYmplY3QyLCAuLi5dLCB7XG4gICAqICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICogICAgICAgLy8gQWxsIHRoZSBvYmplY3RzIHdlcmUgZGVsZXRlZC5cbiAgICogICAgIH0sXG4gICAqICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgICAgLy8gQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgZGVsZXRpbmcgb25lIG9yIG1vcmUgb2YgdGhlIG9iamVjdHMuXG4gICAqICAgICAgIC8vIElmIHRoaXMgaXMgYW4gYWdncmVnYXRlIGVycm9yLCB0aGVuIHdlIGNhbiBpbnNwZWN0IGVhY2ggZXJyb3JcbiAgICogICAgICAgLy8gb2JqZWN0IGluZGl2aWR1YWxseSB0byBkZXRlcm1pbmUgdGhlIHJlYXNvbiB3aHkgYSBwYXJ0aWN1bGFyXG4gICAqICAgICAgIC8vIG9iamVjdCB3YXMgbm90IGRlbGV0ZWQuXG4gICAqICAgICAgIGlmIChlcnJvci5jb2RlID09IFBhcnNlLkVycm9yLkFHR1JFR0FURV9FUlJPUikge1xuICAgKiAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3IuZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAqICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbid0IGRlbGV0ZSBcIiArIGVycm9yLmVycm9yc1tpXS5vYmplY3QuaWQgK1xuICAgKiAgICAgICAgICAgICBcImR1ZSB0byBcIiArIGVycm9yLmVycm9yc1tpXS5tZXNzYWdlKTtcbiAgICogICAgICAgICB9XG4gICAqICAgICAgIH0gZWxzZSB7XG4gICAqICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgYWJvcnRlZCBiZWNhdXNlIG9mIFwiICsgZXJyb3IubWVzc2FnZSk7XG4gICAqICAgICAgIH1cbiAgICogICAgIH0sXG4gICAqICAgfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEEgbGlzdCBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAqIDwvdWw+XG4gICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBkZXN0cm95QWxsXG4gICAqICAgICBjb21wbGV0ZXMuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuZGVzdHJveUFsbCA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciB0cmlnZ2VyRGVzdHJveSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgb2JqZWN0LnRyaWdnZXIoJ2Rlc3Ryb3knLCBvYmplY3QsIG9iamVjdC5jb2xsZWN0aW9uLCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgdmFyIGVycm9ycyA9IFtdO1xuICAgIHZhciBkZXN0cm95QmF0Y2ggPSBmdW5jdGlvbihiYXRjaCkge1xuICAgICAgdmFyIHByb21pc2UgPSBQYXJzZS5Qcm9taXNlLmFzKCk7XG5cbiAgICAgIGlmIChiYXRjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgICAgIHJvdXRlOiBcImJhdGNoXCIsXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgcmVxdWVzdHM6IF8ubWFwKGJhdGNoLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgICAgICAgICAgICAgcGF0aDogXCIvMS9jbGFzc2VzL1wiICsgb2JqZWN0LmNsYXNzTmFtZSArIFwiL1wiICsgb2JqZWN0LmlkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZXMsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgICAgUGFyc2UuX2FycmF5RWFjaChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VzW2ldLnN1Y2Nlc3MgJiYgb3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJEZXN0cm95KG9iamVjdCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlc1tpXS5lcnJvcikge1xuICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IocmVzcG9uc2VzW2ldLmVycm9yLmNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZXNbaV0uZXJyb3IuZXJyb3IpO1xuICAgICAgICAgICAgICBlcnJvci5vYmplY3QgPSBvYmplY3Q7XG5cbiAgICAgICAgICAgICAgZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHZhciBwcm9taXNlID0gUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgIHZhciBiYXRjaCA9IFtdO1xuICAgIFBhcnNlLl9hcnJheUVhY2gobGlzdCwgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICBpZiAoIW9iamVjdC5pZCB8fCAhb3B0aW9ucy53YWl0KSB7XG4gICAgICAgIHRyaWdnZXJEZXN0cm95KG9iamVjdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmplY3QuaWQpIHtcbiAgICAgICAgYmF0Y2gucHVzaChvYmplY3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYmF0Y2gubGVuZ3RoID09PSAyMCB8fCBpKzEgPT09IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgIHZhciB0aGlzQmF0Y2ggPSBiYXRjaDtcbiAgICAgICAgYmF0Y2ggPSBbXTtcblxuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBkZXN0cm95QmF0Y2godGhpc0JhdGNoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuQUdHUkVHQVRFX0VSUk9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJFcnJvciBkZWxldGluZyBhbiBvYmplY3QgaW4gZGVzdHJveUFsbFwiKTtcbiAgICAgICAgZXJyb3IuZXJyb3JzID0gZXJyb3JzO1xuXG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgZ2l2ZW4gbGlzdCBvZiBQYXJzZS5PYmplY3QuXG4gICAqIElmIGFueSBlcnJvciBpcyBlbmNvdW50ZXJlZCwgc3RvcHMgYW5kIGNhbGxzIHRoZSBlcnJvciBoYW5kbGVyLlxuICAgKlxuICAgKiA8cHJlPlxuICAgKiAgIFBhcnNlLk9iamVjdC5mZXRjaEFsbChbb2JqZWN0MSwgb2JqZWN0MiwgLi4uXSwge1xuICAgKiAgICAgc3VjY2VzczogZnVuY3Rpb24obGlzdCkge1xuICAgKiAgICAgICAvLyBBbGwgdGhlIG9iamVjdHMgd2VyZSBmZXRjaGVkLlxuICAgKiAgICAgfSxcbiAgICogICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICAvLyBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBmZXRjaGluZyBvbmUgb2YgdGhlIG9iamVjdHMuXG4gICAqICAgICB9LFxuICAgKiAgIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBIGxpc3Qgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAqIDwvdWw+XG4gICAqL1xuICBQYXJzZS5PYmplY3QuZmV0Y2hBbGwgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fZmV0Y2hBbGwoXG4gICAgICBsaXN0LFxuICAgICAgdHJ1ZVxuICAgICkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgdGhlIGdpdmVuIGxpc3Qgb2YgUGFyc2UuT2JqZWN0IGlmIG5lZWRlZC5cbiAgICogSWYgYW55IGVycm9yIGlzIGVuY291bnRlcmVkLCBzdG9wcyBhbmQgY2FsbHMgdGhlIGVycm9yIGhhbmRsZXIuXG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgUGFyc2UuT2JqZWN0LmZldGNoQWxsSWZOZWVkZWQoW29iamVjdDEsIC4uLl0sIHtcbiAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICogICAgICAgLy8gT2JqZWN0cyB3ZXJlIGZldGNoZWQgYW5kIHVwZGF0ZWQuXG4gICAqICAgICB9LFxuICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIC8vIEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGZldGNoaW5nIG9uZSBvZiB0aGUgb2JqZWN0cy5cbiAgICogICAgIH0sXG4gICAqICAgfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEEgbGlzdCBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICogPC91bD5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5mZXRjaEFsbElmTmVlZGVkID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2ZldGNoQWxsKFxuICAgICAgbGlzdCxcbiAgICAgIGZhbHNlXG4gICAgKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICAvLyBBdHRhY2ggYWxsIGluaGVyaXRhYmxlIG1ldGhvZHMgdG8gdGhlIFBhcnNlLk9iamVjdCBwcm90b3R5cGUuXG4gIF8uZXh0ZW5kKFBhcnNlLk9iamVjdC5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgICAgICAgLyoqIEBsZW5kcyBQYXJzZS5PYmplY3QucHJvdG90eXBlICovIHtcbiAgICBfZXhpc3RlZDogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAgKiBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvYmplY3Qgc3VpdGFibGUgZm9yIHNhdmluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0gdGhpcy5fdG9GdWxsSlNPTigpO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChbXCJfX3R5cGVcIiwgXCJjbGFzc05hbWVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGtleSkgeyBkZWxldGUganNvbltrZXldOyB9KTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG5cbiAgICBfdG9GdWxsSlNPTjogZnVuY3Rpb24oc2Vlbk9iamVjdHMpIHtcbiAgICAgIHZhciBqc29uID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goanNvbiwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAganNvbltrZXldID0gUGFyc2UuX2VuY29kZSh2YWwsIHNlZW5PYmplY3RzKTtcbiAgICAgIH0pO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5fb3BlcmF0aW9ucywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAganNvbltrZXldID0gdmFsO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChfLmhhcyh0aGlzLCBcImlkXCIpKSB7XG4gICAgICAgIGpzb24ub2JqZWN0SWQgPSB0aGlzLmlkO1xuICAgICAgfVxuICAgICAgaWYgKF8uaGFzKHRoaXMsIFwiY3JlYXRlZEF0XCIpKSB7XG4gICAgICAgIGlmIChfLmlzRGF0ZSh0aGlzLmNyZWF0ZWRBdCkpIHtcbiAgICAgICAgICBqc29uLmNyZWF0ZWRBdCA9IHRoaXMuY3JlYXRlZEF0LnRvSlNPTigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGpzb24uY3JlYXRlZEF0ID0gdGhpcy5jcmVhdGVkQXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKF8uaGFzKHRoaXMsIFwidXBkYXRlZEF0XCIpKSB7XG4gICAgICAgIGlmIChfLmlzRGF0ZSh0aGlzLnVwZGF0ZWRBdCkpIHtcbiAgICAgICAgICBqc29uLnVwZGF0ZWRBdCA9IHRoaXMudXBkYXRlZEF0LnRvSlNPTigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGpzb24udXBkYXRlZEF0ID0gdGhpcy51cGRhdGVkQXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGpzb24uX190eXBlID0gXCJPYmplY3RcIjtcbiAgICAgIGpzb24uY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWU7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBfaGFzaGVkSlNPTiB0byByZWZsZWN0IHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgb2JqZWN0LlxuICAgICAqIEFkZHMgYW55IGNoYW5nZWQgaGFzaCB2YWx1ZXMgdG8gdGhlIHNldCBvZiBwZW5kaW5nIGNoYW5nZXMuXG4gICAgICovXG4gICAgX3JlZnJlc2hDYWNoZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoc2VsZi5fcmVmcmVzaGluZ0NhY2hlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3JlZnJlc2hpbmdDYWNoZSA9IHRydWU7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgICAgdmFsdWUuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgdmFyIG9iamVjdEFycmF5ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIFdlIGRvbid0IGNhY2hlIGFycmF5cyBvZiBQYXJzZS5PYmplY3RzXG4gICAgICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKGFyclZhbCkge1xuICAgICAgICAgICAgICBpZiAoYXJyVmFsIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFyclZhbC5fcmVmcmVzaENhY2hlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW9iamVjdEFycmF5ICYmIHNlbGYuX3Jlc2V0Q2FjaGVGb3JLZXkoa2V5KSkge1xuICAgICAgICAgICAgc2VsZi5zZXQoa2V5LCBuZXcgUGFyc2UuT3AuU2V0KHZhbHVlKSwgeyBzaWxlbnQ6IHRydWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSBzZWxmLl9yZWZyZXNoaW5nQ2FjaGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG9iamVjdCBoYXMgYmVlbiBtb2RpZmllZCBzaW5jZSBpdHMgbGFzdFxuICAgICAqIHNhdmUvcmVmcmVzaC4gIElmIGFuIGF0dHJpYnV0ZSBpcyBzcGVjaWZpZWQsIGl0IHJldHVybnMgdHJ1ZSBvbmx5IGlmIHRoYXRcbiAgICAgKiBwYXJ0aWN1bGFyIGF0dHJpYnV0ZSBoYXMgYmVlbiBtb2RpZmllZCBzaW5jZSB0aGUgbGFzdCBzYXZlL3JlZnJlc2guXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQW4gYXR0cmlidXRlIG5hbWUgKG9wdGlvbmFsKS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGRpcnR5OiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB0aGlzLl9yZWZyZXNoQ2FjaGUoKTtcblxuICAgICAgdmFyIGN1cnJlbnRDaGFuZ2VzID0gXy5sYXN0KHRoaXMuX29wU2V0UXVldWUpO1xuXG4gICAgICBpZiAoYXR0cikge1xuICAgICAgICByZXR1cm4gKGN1cnJlbnRDaGFuZ2VzW2F0dHJdID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChfLmtleXMoY3VycmVudENoYW5nZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2Yga2V5cyB0aGF0IGhhdmUgYmVlbiBtb2RpZmllZCBzaW5jZSBsYXN0IHNhdmUvcmVmcmVzaFxuICAgICAqIEByZXR1cm4ge0FycmF5IG9mIHN0cmluZ31cbiAgICAgKi9cbiAgICBkaXJ0eUtleXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8ua2V5cyhfLmxhc3QodGhpcy5fb3BTZXRRdWV1ZSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgUG9pbnRlciByZWZlcmVuY2luZyB0aGlzIE9iamVjdC5cbiAgICAgKi9cbiAgICBfdG9Qb2ludGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBzZXJpYWxpemUgYW4gdW5zYXZlZCBQYXJzZS5PYmplY3RcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBfX3R5cGU6IFwiUG9pbnRlclwiLFxuICAgICAgICAgICAgICAgY2xhc3NOYW1lOiB0aGlzLmNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgIG9iamVjdElkOiB0aGlzLmlkIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBUaGUgc3RyaW5nIG5hbWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHJlbGF0aW9uIG9uIHRoZSBnaXZlbiBjbGFzcyBmb3IgdGhlIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0gU3RyaW5nIGF0dHIgVGhlIGF0dHJpYnV0ZSB0byBnZXQgdGhlIHJlbGF0aW9uIGZvci5cbiAgICAgKi9cbiAgICByZWxhdGlvbjogZnVuY3Rpb24oYXR0cikge1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoYXR0cik7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbikpIHtcbiAgICAgICAgICB0aHJvdyBcIkNhbGxlZCByZWxhdGlvbigpIG9uIG5vbi1yZWxhdGlvbiBmaWVsZCBcIiArIGF0dHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUuX2Vuc3VyZVBhcmVudEFuZEtleSh0aGlzLCBhdHRyKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5SZWxhdGlvbih0aGlzLCBhdHRyKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgSFRNTC1lc2NhcGVkIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBlc2NhcGU6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHZhciBodG1sID0gdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICBpZiAoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICAgIH1cbiAgICAgIHZhciB2YWwgPSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICB2YXIgZXNjYXBlZDtcbiAgICAgIGlmIChQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQodmFsKSkge1xuICAgICAgICBlc2NhcGVkID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlc2NhcGVkID0gXy5lc2NhcGUodmFsLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl0gPSBlc2NhcGVkO1xuICAgICAgcmV0dXJuIGVzY2FwZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIGF0dHJpYnV0ZSBjb250YWlucyBhIHZhbHVlIHRoYXQgaXMgbm90XG4gICAgICogbnVsbCBvciB1bmRlZmluZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgVGhlIHN0cmluZyBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXM6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiAhUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKHRoaXMuYXR0cmlidXRlc1thdHRyXSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFB1bGxzIFwic3BlY2lhbFwiIGZpZWxkcyBsaWtlIG9iamVjdElkLCBjcmVhdGVkQXQsIGV0Yy4gb3V0IG9mIGF0dHJzXG4gICAgICogYW5kIHB1dHMgdGhlbSBvbiBcInRoaXNcIiBkaXJlY3RseS4gIFJlbW92ZXMgdGhlbSBmcm9tIGF0dHJzLlxuICAgICAqIEBwYXJhbSBhdHRycyAtIEEgZGljdGlvbmFyeSB3aXRoIHRoZSBkYXRhIGZvciB0aGlzIFBhcnNlLk9iamVjdC5cbiAgICAgKi9cbiAgICBfbWVyZ2VNYWdpY0ZpZWxkczogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgIC8vIENoZWNrIGZvciBjaGFuZ2VzIG9mIG1hZ2ljIGZpZWxkcy5cbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgICB2YXIgc3BlY2lhbEZpZWxkcyA9IFtcImlkXCIsIFwib2JqZWN0SWRcIiwgXCJjcmVhdGVkQXRcIiwgXCJ1cGRhdGVkQXRcIl07XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHNwZWNpYWxGaWVsZHMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgaWYgKGF0dHJzW2F0dHJdKSB7XG4gICAgICAgICAgaWYgKGF0dHIgPT09IFwib2JqZWN0SWRcIikge1xuICAgICAgICAgICAgbW9kZWwuaWQgPSBhdHRyc1thdHRyXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKChhdHRyID09PSBcImNyZWF0ZWRBdFwiIHx8IGF0dHIgPT09IFwidXBkYXRlZEF0XCIpICYmXG4gICAgICAgICAgICAgICAgICAgICAhXy5pc0RhdGUoYXR0cnNbYXR0cl0pKSB7XG4gICAgICAgICAgICBtb2RlbFthdHRyXSA9IFBhcnNlLl9wYXJzZURhdGUoYXR0cnNbYXR0cl0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb2RlbFthdHRyXSA9IGF0dHJzW2F0dHJdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgYXR0cnNbYXR0cl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgdGhlIGdpdmVuIHNlcnZlckRhdGEgdG8gXCJ0aGlzXCIsIHJlZnJlc2hlcyBhdHRyaWJ1dGVzLCBhbmRcbiAgICAgKiBjbGVhcnMgcGVuZGluZyBjaGFuZ2VzO1xuICAgICAqL1xuICAgIF9jb3B5U2VydmVyRGF0YTogZnVuY3Rpb24oc2VydmVyRGF0YSkge1xuICAgICAgLy8gQ29weSBzZXJ2ZXIgZGF0YVxuICAgICAgdmFyIHRlbXBTZXJ2ZXJEYXRhID0ge307XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChzZXJ2ZXJEYXRhLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHRlbXBTZXJ2ZXJEYXRhW2tleV0gPSBQYXJzZS5fZGVjb2RlKGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zZXJ2ZXJEYXRhID0gdGVtcFNlcnZlckRhdGE7XG5cbiAgICAgIC8vIFJlZnJlc2ggdGhlIGF0dHJpYnV0ZXMuXG4gICAgICB0aGlzLl9yZWJ1aWxkQWxsRXN0aW1hdGVkRGF0YSgpO1xuXG4gICAgICAvLyBUT0RPIChia2xpbXQpOiBSZXZpc2l0IGNsZWFyaW5nIG9wZXJhdGlvbnMsIHBlcmhhcHMgbW92ZSB0byByZXZlcnQuXG4gICAgICAvLyBDbGVhciBvdXQgYW55IGNoYW5nZXMgdGhlIHVzZXIgbWlnaHQgaGF2ZSBtYWRlIHByZXZpb3VzbHkuXG4gICAgICB0aGlzLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgIHRoaXMuX29wU2V0UXVldWUgPSBbe31dO1xuXG4gICAgICAvLyBSZWZyZXNoIHRoZSBhdHRyaWJ1dGVzIGFnYWluLlxuICAgICAgdGhpcy5fcmVidWlsZEFsbEVzdGltYXRlZERhdGEoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWVyZ2VzIGFub3RoZXIgb2JqZWN0J3MgYXR0cmlidXRlcyBpbnRvIHRoaXMgb2JqZWN0LlxuICAgICAqL1xuICAgIF9tZXJnZUZyb21PYmplY3Q6IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICBpZiAoIW90aGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBkb2VzIHRoZSBpbnZlcnNlIG9mIF9tZXJnZU1hZ2ljRmllbGRzLlxuICAgICAgdGhpcy5pZCA9IG90aGVyLmlkO1xuICAgICAgdGhpcy5jcmVhdGVkQXQgPSBvdGhlci5jcmVhdGVkQXQ7XG4gICAgICB0aGlzLnVwZGF0ZWRBdCA9IG90aGVyLnVwZGF0ZWRBdDtcblxuICAgICAgdGhpcy5fY29weVNlcnZlckRhdGEob3RoZXIuX3NlcnZlckRhdGEpO1xuXG4gICAgICB0aGlzLl9oYXNEYXRhID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUganNvbiB0byBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgX3N0YXJ0U2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9vcFNldFF1ZXVlLnB1c2goe30pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIHNhdmUgZmFpbHMgYmVjYXVzZSBvZiBhbiBlcnJvci4gQW55IGNoYW5nZXMgdGhhdCB3ZXJlIHBhcnRcbiAgICAgKiBvZiB0aGUgc2F2ZSBuZWVkIHRvIGJlIG1lcmdlZCB3aXRoIGNoYW5nZXMgbWFkZSBhZnRlciB0aGUgc2F2ZS4gVGhpc1xuICAgICAqIG1pZ2h0IHRocm93IGFuIGV4Y2VwdGlvbiBpcyB5b3UgZG8gY29uZmxpY3Rpbmcgb3BlcmF0aW9ucy4gRm9yIGV4YW1wbGUsXG4gICAgICogaWYgeW91IGRvOlxuICAgICAqICAgb2JqZWN0LnNldChcImZvb1wiLCBcImJhclwiKTtcbiAgICAgKiAgIG9iamVjdC5zZXQoXCJpbnZhbGlkIGZpZWxkIG5hbWVcIiwgXCJiYXpcIik7XG4gICAgICogICBvYmplY3Quc2F2ZSgpO1xuICAgICAqICAgb2JqZWN0LmluY3JlbWVudChcImZvb1wiKTtcbiAgICAgKiB0aGVuIHRoaXMgd2lsbCB0aHJvdyB3aGVuIHRoZSBzYXZlIGZhaWxzIGFuZCB0aGUgY2xpZW50IHRyaWVzIHRvIG1lcmdlXG4gICAgICogXCJiYXJcIiB3aXRoIHRoZSArMS5cbiAgICAgKi9cbiAgICBfY2FuY2VsU2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgZmFpbGVkQ2hhbmdlcyA9IF8uZmlyc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG4gICAgICB0aGlzLl9vcFNldFF1ZXVlID0gXy5yZXN0KHRoaXMuX29wU2V0UXVldWUpO1xuICAgICAgdmFyIG5leHRDaGFuZ2VzID0gXy5maXJzdCh0aGlzLl9vcFNldFF1ZXVlKTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGZhaWxlZENoYW5nZXMsIGZ1bmN0aW9uKG9wLCBrZXkpIHtcbiAgICAgICAgdmFyIG9wMSA9IGZhaWxlZENoYW5nZXNba2V5XTtcbiAgICAgICAgdmFyIG9wMiA9IG5leHRDaGFuZ2VzW2tleV07XG4gICAgICAgIGlmIChvcDEgJiYgb3AyKSB7XG4gICAgICAgICAgbmV4dENoYW5nZXNba2V5XSA9IG9wMi5fbWVyZ2VXaXRoUHJldmlvdXMob3AxKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcDEpIHtcbiAgICAgICAgICBuZXh0Q2hhbmdlc1trZXldID0gb3AxO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NhdmluZyA9IHRoaXMuX3NhdmluZyAtIDE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgc2F2ZSBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LiBUaGlzIG1lcmdlcyB0aGUgY2hhbmdlcyB0aGF0XG4gICAgICogd2VyZSBzYXZlZCBpbnRvIHRoZSBrbm93biBzZXJ2ZXIgZGF0YSwgYW5kIG92ZXJyaWRlcyBpdCB3aXRoIGFueSBkYXRhXG4gICAgICogc2VudCBkaXJlY3RseSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgX2ZpbmlzaFNhdmU6IGZ1bmN0aW9uKHNlcnZlckRhdGEpIHtcbiAgICAgIC8vIEdyYWIgYSBjb3B5IG9mIGFueSBvYmplY3QgcmVmZXJlbmNlZCBieSB0aGlzIG9iamVjdC4gVGhlc2UgaW5zdGFuY2VzXG4gICAgICAvLyBtYXkgaGF2ZSBhbHJlYWR5IGJlZW4gZmV0Y2hlZCwgYW5kIHdlIGRvbid0IHdhbnQgdG8gbG9zZSB0aGVpciBkYXRhLlxuICAgICAgLy8gTm90ZSB0aGF0IGRvaW5nIGl0IGxpa2UgdGhpcyBtZWFucyB3ZSB3aWxsIHVuaWZ5IHNlcGFyYXRlIGNvcGllcyBvZiB0aGVcbiAgICAgIC8vIHNhbWUgb2JqZWN0LCBidXQgdGhhdCdzIGEgcmlzayB3ZSBoYXZlIHRvIHRha2UuXG4gICAgICB2YXIgZmV0Y2hlZE9iamVjdHMgPSB7fTtcbiAgICAgIFBhcnNlLl90cmF2ZXJzZSh0aGlzLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0ICYmIG9iamVjdC5pZCAmJiBvYmplY3QuX2hhc0RhdGEpIHtcbiAgICAgICAgICBmZXRjaGVkT2JqZWN0c1tvYmplY3QuaWRdID0gb2JqZWN0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIHNhdmVkQ2hhbmdlcyA9IF8uZmlyc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG4gICAgICB0aGlzLl9vcFNldFF1ZXVlID0gXy5yZXN0KHRoaXMuX29wU2V0UXVldWUpO1xuICAgICAgdGhpcy5fYXBwbHlPcFNldChzYXZlZENoYW5nZXMsIHRoaXMuX3NlcnZlckRhdGEpO1xuICAgICAgdGhpcy5fbWVyZ2VNYWdpY0ZpZWxkcyhzZXJ2ZXJEYXRhKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHNlcnZlckRhdGEsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc2VsZi5fc2VydmVyRGF0YVtrZXldID0gUGFyc2UuX2RlY29kZShrZXksIHZhbHVlKTtcblxuICAgICAgICAvLyBMb29rIGZvciBhbnkgb2JqZWN0cyB0aGF0IG1pZ2h0IGhhdmUgYmVjb21lIHVuZmV0Y2hlZCBhbmQgZml4IHRoZW1cbiAgICAgICAgLy8gYnkgcmVwbGFjaW5nIHRoZWlyIHZhbHVlcyB3aXRoIHRoZSBwcmV2aW91c2x5IG9ic2VydmVkIHZhbHVlcy5cbiAgICAgICAgdmFyIGZldGNoZWQgPSBQYXJzZS5fdHJhdmVyc2Uoc2VsZi5fc2VydmVyRGF0YVtrZXldLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0ICYmIGZldGNoZWRPYmplY3RzW29iamVjdC5pZF0pIHtcbiAgICAgICAgICAgIHJldHVybiBmZXRjaGVkT2JqZWN0c1tvYmplY3QuaWRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChmZXRjaGVkKSB7XG4gICAgICAgICAgc2VsZi5fc2VydmVyRGF0YVtrZXldID0gZmV0Y2hlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZWJ1aWxkQWxsRXN0aW1hdGVkRGF0YSgpO1xuICAgICAgdGhpcy5fc2F2aW5nID0gdGhpcy5fc2F2aW5nIC0gMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBmZXRjaCBvciBsb2dpbiBpcyBjb21wbGV0ZSB0byBzZXQgdGhlIGtub3duIHNlcnZlciBkYXRhIHRvXG4gICAgICogdGhlIGdpdmVuIG9iamVjdC5cbiAgICAgKi9cbiAgICBfZmluaXNoRmV0Y2g6IGZ1bmN0aW9uKHNlcnZlckRhdGEsIGhhc0RhdGEpIHtcbiAgICAgIC8vIFRPRE8gKGJrbGltdCk6IFJldmlzaXQgY2xlYXJpbmcgb3BlcmF0aW9ucywgcGVyaGFwcyBtb3ZlIHRvIHJldmVydC5cbiAgICAgIHRoaXMuX29wU2V0UXVldWUgPSBbe31dO1xuXG4gICAgICAvLyBCcmluZyBpbiBhbGwgdGhlIG5ldyBzZXJ2ZXIgZGF0YS5cbiAgICAgIHRoaXMuX21lcmdlTWFnaWNGaWVsZHMoc2VydmVyRGF0YSk7XG4gICAgICB0aGlzLl9jb3B5U2VydmVyRGF0YShzZXJ2ZXJEYXRhKTtcblxuICAgICAgdGhpcy5faGFzRGF0YSA9IGhhc0RhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgdGhlIHNldCBvZiBQYXJzZS5PcCBpbiBvcFNldCB0byB0aGUgb2JqZWN0IHRhcmdldC5cbiAgICAgKi9cbiAgICBfYXBwbHlPcFNldDogZnVuY3Rpb24ob3BTZXQsIHRhcmdldCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2gob3BTZXQsIGZ1bmN0aW9uKGNoYW5nZSwga2V5KSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gY2hhbmdlLl9lc3RpbWF0ZSh0YXJnZXRba2V5XSwgc2VsZiwga2V5KTtcbiAgICAgICAgaWYgKHRhcmdldFtrZXldID09PSBQYXJzZS5PcC5fVU5TRVQpIHtcbiAgICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlcyB0aGUgY2FjaGVkIHZhbHVlIGZvciBrZXkgd2l0aCB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG5ldyB2YWx1ZSBpcyBkaWZmZXJlbnQgdGhhbiB0aGUgb2xkIHZhbHVlLlxuICAgICAqL1xuICAgIF9yZXNldENhY2hlRm9yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuYXR0cmlidXRlc1trZXldO1xuICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpICYmXG4gICAgICAgICAgISh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkgJiZcbiAgICAgICAgICAhKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuRmlsZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04gPyB2YWx1ZS50b0pTT04oKSA6IHZhbHVlO1xuICAgICAgICB2YXIganNvbiA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuX2hhc2hlZEpTT05ba2V5XSAhPT0ganNvbikge1xuICAgICAgICAgIHZhciB3YXNTZXQgPSAhIXRoaXMuX2hhc2hlZEpTT05ba2V5XTtcbiAgICAgICAgICB0aGlzLl9oYXNoZWRKU09OW2tleV0gPSBqc29uO1xuICAgICAgICAgIHJldHVybiB3YXNTZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUG9wdWxhdGVzIGF0dHJpYnV0ZXNba2V5XSBieSBzdGFydGluZyB3aXRoIHRoZSBsYXN0IGtub3duIGRhdGEgZnJvbSB0aGVcbiAgICAgKiBzZXJ2ZXIsIGFuZCBhcHBseWluZyBhbGwgb2YgdGhlIGxvY2FsIGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gbWFkZSB0byB0aGF0XG4gICAgICoga2V5IHNpbmNlIHRoZW4uXG4gICAgICovXG4gICAgX3JlYnVpbGRFc3RpbWF0ZWREYXRhRm9yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcbiAgICAgIGlmICh0aGlzLl9zZXJ2ZXJEYXRhW2tleV0pIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW2tleV0gPSB0aGlzLl9zZXJ2ZXJEYXRhW2tleV07XG4gICAgICB9XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMuX29wU2V0UXVldWUsIGZ1bmN0aW9uKG9wU2V0KSB7XG4gICAgICAgIHZhciBvcCA9IG9wU2V0W2tleV07XG4gICAgICAgIGlmIChvcCkge1xuICAgICAgICAgIHNlbGYuYXR0cmlidXRlc1trZXldID0gb3AuX2VzdGltYXRlKHNlbGYuYXR0cmlidXRlc1trZXldLCBzZWxmLCBrZXkpO1xuICAgICAgICAgIGlmIChzZWxmLmF0dHJpYnV0ZXNba2V5XSA9PT0gUGFyc2UuT3AuX1VOU0VUKSB7XG4gICAgICAgICAgICBkZWxldGUgc2VsZi5hdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX3Jlc2V0Q2FjaGVGb3JLZXkoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQb3B1bGF0ZXMgYXR0cmlidXRlcyBieSBzdGFydGluZyB3aXRoIHRoZSBsYXN0IGtub3duIGRhdGEgZnJvbSB0aGVcbiAgICAgKiBzZXJ2ZXIsIGFuZCBhcHBseWluZyBhbGwgb2YgdGhlIGxvY2FsIGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gbWFkZSBzaW5jZVxuICAgICAqIHRoZW4uXG4gICAgICovXG4gICAgX3JlYnVpbGRBbGxFc3RpbWF0ZWREYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdmFyIHByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gXy5jbG9uZSh0aGlzLl9zZXJ2ZXJEYXRhKTtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5fb3BTZXRRdWV1ZSwgZnVuY3Rpb24ob3BTZXQpIHtcbiAgICAgICAgc2VsZi5fYXBwbHlPcFNldChvcFNldCwgc2VsZi5hdHRyaWJ1dGVzKTtcbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2gob3BTZXQsIGZ1bmN0aW9uKG9wLCBrZXkpIHtcbiAgICAgICAgICBzZWxmLl9yZXNldENhY2hlRm9yS2V5KGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRyaWdnZXIgY2hhbmdlIGV2ZW50cyBmb3IgYW55dGhpbmcgdGhhdCBjaGFuZ2VkIGJlY2F1c2Ugb2YgdGhlIGZldGNoLlxuICAgICAgUGFyc2UuX29iamVjdEVhY2gocHJldmlvdXNBdHRyaWJ1dGVzLCBmdW5jdGlvbihvbGRWYWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChzZWxmLmF0dHJpYnV0ZXNba2V5XSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTonICsga2V5LCBzZWxmLCBzZWxmLmF0dHJpYnV0ZXNba2V5XSwge30pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24obmV3VmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIV8uaGFzKHByZXZpb3VzQXR0cmlidXRlcywga2V5KSkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOicgKyBrZXksIHNlbGYsIG5ld1ZhbHVlLCB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgaGFzaCBvZiBtb2RlbCBhdHRyaWJ1dGVzIG9uIHRoZSBvYmplY3QsIGZpcmluZ1xuICAgICAqIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IHVubGVzcyB5b3UgY2hvb3NlIHRvIHNpbGVuY2UgaXQuXG4gICAgICpcbiAgICAgKiA8cD5Zb3UgY2FuIGNhbGwgaXQgd2l0aCBhbiBvYmplY3QgY29udGFpbmluZyBrZXlzIGFuZCB2YWx1ZXMsIG9yIHdpdGggb25lXG4gICAgICoga2V5IGFuZCB2YWx1ZS4gIEZvciBleGFtcGxlOjxwcmU+XG4gICAgICogICBnYW1lVHVybi5zZXQoe1xuICAgICAqICAgICBwbGF5ZXI6IHBsYXllcjEsXG4gICAgICogICAgIGRpY2VSb2xsOiAyXG4gICAgICogICB9LCB7XG4gICAgICogICAgIGVycm9yOiBmdW5jdGlvbihnYW1lVHVybkFnYWluLCBlcnJvcikge1xuICAgICAqICAgICAgIC8vIFRoZSBzZXQgZmFpbGVkIHZhbGlkYXRpb24uXG4gICAgICogICAgIH1cbiAgICAgKiAgIH0pO1xuICAgICAqXG4gICAgICogICBnYW1lLnNldChcImN1cnJlbnRQbGF5ZXJcIiwgcGxheWVyMiwge1xuICAgICAqICAgICBlcnJvcjogZnVuY3Rpb24oZ2FtZVR1cm5BZ2FpbiwgZXJyb3IpIHtcbiAgICAgKiAgICAgICAvLyBUaGUgc2V0IGZhaWxlZCB2YWxpZGF0aW9uLlxuICAgICAqICAgICB9XG4gICAgICogICB9KTtcbiAgICAgKlxuICAgICAqICAgZ2FtZS5zZXQoXCJmaW5pc2hlZFwiLCB0cnVlKTs8L3ByZT48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB7fSB2YWx1ZSBUaGUgdmFsdWUgdG8gZ2l2ZSBpdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIHNldCBvZiBCYWNrYm9uZS1saWtlIG9wdGlvbnMgZm9yIHRoZSBzZXQuXG4gICAgICogICAgIFRoZSBvbmx5IHN1cHBvcnRlZCBvcHRpb25zIGFyZSA8Y29kZT5zaWxlbnQ8L2NvZGU+LFxuICAgICAqICAgICA8Y29kZT5lcnJvcjwvY29kZT4sIGFuZCA8Y29kZT5wcm9taXNlPC9jb2RlPi5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBzZXQgc3VjY2VlZGVkLlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I3ZhbGlkYXRlXG4gICAgICogQHNlZSBQYXJzZS5FcnJvclxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHJzLCBhdHRyO1xuICAgICAgaWYgKF8uaXNPYmplY3Qoa2V5KSB8fCBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQoa2V5KSkge1xuICAgICAgICBhdHRycyA9IGtleTtcbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYXR0cnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICBhdHRyc1trXSA9IFBhcnNlLl9kZWNvZGUoaywgdik7XG4gICAgICAgIH0pO1xuICAgICAgICBvcHRpb25zID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRycyA9IHt9O1xuICAgICAgICBhdHRyc1trZXldID0gUGFyc2UuX2RlY29kZShrZXksIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gRXh0cmFjdCBhdHRyaWJ1dGVzIGFuZCBvcHRpb25zLlxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAoIWF0dHJzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKGF0dHJzIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgIGF0dHJzID0gYXR0cnMuYXR0cmlidXRlcztcbiAgICAgIH1cblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goYXR0cnMsIGZ1bmN0aW9uKHVudXNlZF92YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChzZWxmLmNvbnN0cnVjdG9yLnJlYWRPbmx5QXR0cmlidXRlcyAmJlxuICAgICAgICAgIHNlbGYuY29uc3RydWN0b3IucmVhZE9ubHlBdHRyaWJ1dGVzW2tleV0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBtb2RpZnkgcmVhZG9ubHkga2V5OiAnICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIElmIHRoZSB1bnNldCBvcHRpb24gaXMgdXNlZCwgZXZlcnkgYXR0cmlidXRlIHNob3VsZCBiZSBhIFVuc2V0LlxuICAgICAgaWYgKG9wdGlvbnMudW5zZXQpIHtcbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYXR0cnMsIGZ1bmN0aW9uKHVudXNlZF92YWx1ZSwga2V5KSB7XG4gICAgICAgICAgYXR0cnNba2V5XSA9IG5ldyBQYXJzZS5PcC5VbnNldCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgYWxsIHRoZSBhdHRyaWJ1dGVzIHRvIGdldCB0aGUgZXN0aW1hdGVkIHZhbHVlcy5cbiAgICAgIHZhciBkYXRhVG9WYWxpZGF0ZSA9IF8uY2xvbmUoYXR0cnMpO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goZGF0YVRvVmFsaWRhdGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT3ApIHtcbiAgICAgICAgICBkYXRhVG9WYWxpZGF0ZVtrZXldID0gdmFsdWUuX2VzdGltYXRlKHNlbGYuYXR0cmlidXRlc1trZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZiwga2V5KTtcbiAgICAgICAgICBpZiAoZGF0YVRvVmFsaWRhdGVba2V5XSA9PT0gUGFyc2UuT3AuX1VOU0VUKSB7XG4gICAgICAgICAgICBkZWxldGUgZGF0YVRvVmFsaWRhdGVba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBSdW4gdmFsaWRhdGlvbi5cbiAgICAgIGlmICghdGhpcy5fdmFsaWRhdGUoYXR0cnMsIG9wdGlvbnMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbWVyZ2VNYWdpY0ZpZWxkcyhhdHRycyk7XG5cbiAgICAgIG9wdGlvbnMuY2hhbmdlcyA9IHt9O1xuICAgICAgdmFyIGVzY2FwZWQgPSB0aGlzLl9lc2NhcGVkQXR0cmlidXRlcztcbiAgICAgIHZhciBwcmV2ID0gdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzIHx8IHt9O1xuXG4gICAgICAvLyBVcGRhdGUgYXR0cmlidXRlcy5cbiAgICAgIFBhcnNlLl9hcnJheUVhY2goXy5rZXlzKGF0dHJzKSwgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICB2YXIgdmFsID0gYXR0cnNbYXR0cl07XG5cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlbGF0aW9uIG9iamVjdCB3ZSBuZWVkIHRvIHNldCB0aGUgcGFyZW50IGNvcnJlY3RseSxcbiAgICAgICAgLy8gc2luY2UgdGhlIGxvY2F0aW9uIHdoZXJlIGl0IHdhcyBwYXJzZWQgZG9lcyBub3QgaGF2ZSBhY2Nlc3MgdG9cbiAgICAgICAgLy8gdGhpcyBvYmplY3QuXG4gICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbikge1xuICAgICAgICAgIHZhbC5wYXJlbnQgPSBzZWxmO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodmFsIGluc3RhbmNlb2YgUGFyc2UuT3ApKSB7XG4gICAgICAgICAgdmFsID0gbmV3IFBhcnNlLk9wLlNldCh2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VlIGlmIHRoaXMgY2hhbmdlIHdpbGwgYWN0dWFsbHkgaGF2ZSBhbnkgZWZmZWN0LlxuICAgICAgICB2YXIgaXNSZWFsQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCAmJlxuICAgICAgICAgICAgXy5pc0VxdWFsKHNlbGYuYXR0cmlidXRlc1thdHRyXSwgdmFsLnZhbHVlKSkge1xuICAgICAgICAgIGlzUmVhbENoYW5nZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUmVhbENoYW5nZSkge1xuICAgICAgICAgIGRlbGV0ZSBlc2NhcGVkW2F0dHJdO1xuICAgICAgICAgIGlmIChvcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgc2VsZi5fc2lsZW50W2F0dHJdID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0aW9ucy5jaGFuZ2VzW2F0dHJdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3VycmVudENoYW5nZXMgPSBfLmxhc3Qoc2VsZi5fb3BTZXRRdWV1ZSk7XG4gICAgICAgIGN1cnJlbnRDaGFuZ2VzW2F0dHJdID0gdmFsLl9tZXJnZVdpdGhQcmV2aW91cyhjdXJyZW50Q2hhbmdlc1thdHRyXSk7XG4gICAgICAgIHNlbGYuX3JlYnVpbGRFc3RpbWF0ZWREYXRhRm9yS2V5KGF0dHIpO1xuXG4gICAgICAgIGlmIChpc1JlYWxDaGFuZ2UpIHtcbiAgICAgICAgICBzZWxmLmNoYW5nZWRbYXR0cl0gPSBzZWxmLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgc2VsZi5fcGVuZGluZ1thdHRyXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLmNoYW5nZWRbYXR0cl07XG4gICAgICAgICAgZGVsZXRlIHNlbGYuX3BlbmRpbmdbYXR0cl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBhdHRyaWJ1dGUgZnJvbSB0aGUgbW9kZWwsIGZpcmluZyA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiB1bmxlc3NcbiAgICAgKiB5b3UgY2hvb3NlIHRvIHNpbGVuY2UgaXQuIFRoaXMgaXMgYSBub29wIGlmIHRoZSBhdHRyaWJ1dGUgZG9lc24ndFxuICAgICAqIGV4aXN0LlxuICAgICAqL1xuICAgIHVuc2V0OiBmdW5jdGlvbihhdHRyLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIG9wdGlvbnMudW5zZXQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHIsIG51bGwsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdG9taWNhbGx5IGluY3JlbWVudHMgdGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBhdHRyaWJ1dGUgdGhlIG5leHQgdGltZSB0aGVcbiAgICAgKiBvYmplY3QgaXMgc2F2ZWQuIElmIG5vIGFtb3VudCBpcyBzcGVjaWZpZWQsIDEgaXMgdXNlZCBieSBkZWZhdWx0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGF0dHIge1N0cmluZ30gVGhlIGtleS5cbiAgICAgKiBAcGFyYW0gYW1vdW50IHtOdW1iZXJ9IFRoZSBhbW91bnQgdG8gaW5jcmVtZW50IGJ5LlxuICAgICAqL1xuICAgIGluY3JlbWVudDogZnVuY3Rpb24oYXR0ciwgYW1vdW50KSB7XG4gICAgICBpZiAoXy5pc1VuZGVmaW5lZChhbW91bnQpIHx8IF8uaXNOdWxsKGFtb3VudCkpIHtcbiAgICAgICAgYW1vdW50ID0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNldChhdHRyLCBuZXcgUGFyc2UuT3AuSW5jcmVtZW50KGFtb3VudCkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdG9taWNhbGx5IGFkZCBhbiBvYmplY3QgdG8gdGhlIGVuZCBvZiB0aGUgYXJyYXkgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW5cbiAgICAgKiBrZXkuXG4gICAgICogQHBhcmFtIGF0dHIge1N0cmluZ30gVGhlIGtleS5cbiAgICAgKiBAcGFyYW0gaXRlbSB7fSBUaGUgaXRlbSB0byBhZGQuXG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihhdHRyLCBpdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXR0ciwgbmV3IFBhcnNlLk9wLkFkZChbaXRlbV0pKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXRvbWljYWxseSBhZGQgYW4gb2JqZWN0IHRvIHRoZSBhcnJheSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBrZXksIG9ubHlcbiAgICAgKiBpZiBpdCBpcyBub3QgYWxyZWFkeSBwcmVzZW50IGluIHRoZSBhcnJheS4gVGhlIHBvc2l0aW9uIG9mIHRoZSBpbnNlcnQgaXNcbiAgICAgKiBub3QgZ3VhcmFudGVlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhdHRyIHtTdHJpbmd9IFRoZSBrZXkuXG4gICAgICogQHBhcmFtIGl0ZW0ge30gVGhlIG9iamVjdCB0byBhZGQuXG4gICAgICovXG4gICAgYWRkVW5pcXVlOiBmdW5jdGlvbihhdHRyLCBpdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXR0ciwgbmV3IFBhcnNlLk9wLkFkZFVuaXF1ZShbaXRlbV0pKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXRvbWljYWxseSByZW1vdmUgYWxsIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgZnJvbSB0aGUgYXJyYXkgYXNzb2NpYXRlZFxuICAgICAqIHdpdGggYSBnaXZlbiBrZXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXR0ciB7U3RyaW5nfSBUaGUga2V5LlxuICAgICAqIEBwYXJhbSBpdGVtIHt9IFRoZSBvYmplY3QgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oYXR0ciwgaXRlbSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHIsIG5ldyBQYXJzZS5PcC5SZW1vdmUoW2l0ZW1dKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PcCBkZXNjcmliaW5nIHdoYXQga2luZCBvZlxuICAgICAqIG1vZGlmaWNhdGlvbiBoYXMgYmVlbiBwZXJmb3JtZWQgb24gdGhpcyBmaWVsZCBzaW5jZSB0aGUgbGFzdCB0aW1lIGl0IHdhc1xuICAgICAqIHNhdmVkLiBGb3IgZXhhbXBsZSwgYWZ0ZXIgY2FsbGluZyBvYmplY3QuaW5jcmVtZW50KFwieFwiKSwgY2FsbGluZ1xuICAgICAqIG9iamVjdC5vcChcInhcIikgd291bGQgcmV0dXJuIGFuIGluc3RhbmNlIG9mIFBhcnNlLk9wLkluY3JlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhdHRyIHtTdHJpbmd9IFRoZSBrZXkuXG4gICAgICogQHJldHVybnMge1BhcnNlLk9wfSBUaGUgb3BlcmF0aW9uLCBvciB1bmRlZmluZWQgaWYgbm9uZS5cbiAgICAgKi9cbiAgICBvcDogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIF8ubGFzdCh0aGlzLl9vcFNldFF1ZXVlKVthdHRyXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgYWxsIGF0dHJpYnV0ZXMgb24gdGhlIG1vZGVsLCBmaXJpbmcgPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gdW5sZXNzXG4gICAgICogeW91IGNob29zZSB0byBzaWxlbmNlIGl0LlxuICAgICAqL1xuICAgIGNsZWFyOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIG9wdGlvbnMudW5zZXQgPSB0cnVlO1xuICAgICAgdmFyIGtleXNUb0NsZWFyID0gXy5leHRlbmQodGhpcy5hdHRyaWJ1dGVzLCB0aGlzLl9vcGVyYXRpb25zKTtcbiAgICAgIHJldHVybiB0aGlzLnNldChrZXlzVG9DbGVhciwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OLWVuY29kZWQgc2V0IG9mIG9wZXJhdGlvbnMgdG8gYmUgc2VudCB3aXRoIHRoZSBuZXh0IHNhdmVcbiAgICAgKiByZXF1ZXN0LlxuICAgICAqL1xuICAgIF9nZXRTYXZlSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IF8uY2xvbmUoXy5maXJzdCh0aGlzLl9vcFNldFF1ZXVlKSk7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChqc29uLCBmdW5jdGlvbihvcCwga2V5KSB7XG4gICAgICAgIGpzb25ba2V5XSA9IG9wLnRvSlNPTigpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb2JqZWN0IGNhbiBiZSBzZXJpYWxpemVkIGZvciBzYXZpbmcuXG4gICAgICovXG4gICAgX2NhbkJlU2VyaWFsaXplZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZldGNoIHRoZSBtb2RlbCBmcm9tIHRoZSBzZXJ2ZXIuIElmIHRoZSBzZXJ2ZXIncyByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgICAgKiBtb2RlbCBkaWZmZXJzIGZyb20gaXRzIGN1cnJlbnQgYXR0cmlidXRlcywgdGhleSB3aWxsIGJlIG92ZXJyaWRlbixcbiAgICAgKiB0cmlnZ2VyaW5nIGEgPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBmZXRjaFxuICAgICAqICAgICBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHJvdXRlOiBcImNsYXNzZXNcIixcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLmNsYXNzTmFtZSxcbiAgICAgICAgb2JqZWN0SWQ6IHRoaXMuaWQsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgc2VsZi5fZmluaXNoRmV0Y2goc2VsZi5wYXJzZShyZXNwb25zZSwgc3RhdHVzLCB4aHIpLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGEgaGFzaCBvZiBtb2RlbCBhdHRyaWJ1dGVzLCBhbmQgc2F2ZSB0aGUgbW9kZWwgdG8gdGhlIHNlcnZlci5cbiAgICAgKiB1cGRhdGVkQXQgd2lsbCBiZSB1cGRhdGVkIHdoZW4gdGhlIHJlcXVlc3QgcmV0dXJucy5cbiAgICAgKiBZb3UgY2FuIGVpdGhlciBjYWxsIGl0IGFzOjxwcmU+XG4gICAgICogICBvYmplY3Quc2F2ZSgpOzwvcHJlPlxuICAgICAqIG9yPHByZT5cbiAgICAgKiAgIG9iamVjdC5zYXZlKG51bGwsIG9wdGlvbnMpOzwvcHJlPlxuICAgICAqIG9yPHByZT5cbiAgICAgKiAgIG9iamVjdC5zYXZlKGF0dHJzLCBvcHRpb25zKTs8L3ByZT5cbiAgICAgKiBvcjxwcmU+XG4gICAgICogICBvYmplY3Quc2F2ZShrZXksIHZhbHVlLCBvcHRpb25zKTs8L3ByZT5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlLCA8cHJlPlxuICAgICAqICAgZ2FtZVR1cm4uc2F2ZSh7XG4gICAgICogICAgIHBsYXllcjogXCJKYWtlIEN1dHRlclwiLFxuICAgICAqICAgICBkaWNlUm9sbDogMlxuICAgICAqICAgfSwge1xuICAgICAqICAgICBzdWNjZXNzOiBmdW5jdGlvbihnYW1lVHVybkFnYWluKSB7XG4gICAgICogICAgICAgLy8gVGhlIHNhdmUgd2FzIHN1Y2Nlc3NmdWwuXG4gICAgICogICAgIH0sXG4gICAgICogICAgIGVycm9yOiBmdW5jdGlvbihnYW1lVHVybkFnYWluLCBlcnJvcikge1xuICAgICAqICAgICAgIC8vIFRoZSBzYXZlIGZhaWxlZC4gIEVycm9yIGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLkVycm9yLlxuICAgICAqICAgICB9XG4gICAgICogICB9KTs8L3ByZT5cbiAgICAgKiBvciB3aXRoIHByb21pc2VzOjxwcmU+XG4gICAgICogICBnYW1lVHVybi5zYXZlKHtcbiAgICAgKiAgICAgcGxheWVyOiBcIkpha2UgQ3V0dGVyXCIsXG4gICAgICogICAgIGRpY2VSb2xsOiAyXG4gICAgICogICB9KS50aGVuKGZ1bmN0aW9uKGdhbWVUdXJuQWdhaW4pIHtcbiAgICAgKiAgICAgLy8gVGhlIHNhdmUgd2FzIHN1Y2Nlc3NmdWwuXG4gICAgICogICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAqICAgICAvLyBUaGUgc2F2ZSBmYWlsZWQuICBFcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvci5cbiAgICAgKiAgIH0pOzwvcHJlPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPndhaXQ6IFNldCB0byB0cnVlIHRvIHdhaXQgZm9yIHRoZSBzZXJ2ZXIgdG8gY29uZmlybSBhIHN1Y2Nlc3NmdWxcbiAgICAgKiAgIHNhdmUgYmVmb3JlIG1vZGlmeWluZyB0aGUgYXR0cmlidXRlcyBvbiB0aGUgb2JqZWN0LlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgc2V0YCBldmVudC5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHNhdmVcbiAgICAgKiAgICAgY29tcGxldGVzLlxuICAgICAqIEBzZWUgUGFyc2UuRXJyb3JcbiAgICAgKi9cbiAgICBzYXZlOiBmdW5jdGlvbihhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICB2YXIgaSwgYXR0cnMsIGN1cnJlbnQsIG9wdGlvbnMsIHNhdmVkO1xuICAgICAgaWYgKF8uaXNPYmplY3QoYXJnMSkgfHwgUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKGFyZzEpKSB7XG4gICAgICAgIGF0dHJzID0gYXJnMTtcbiAgICAgICAgb3B0aW9ucyA9IGFyZzI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRycyA9IHt9O1xuICAgICAgICBhdHRyc1thcmcxXSA9IGFyZzI7XG4gICAgICAgIG9wdGlvbnMgPSBhcmczO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIHNhdmUoeyBzdWNjZXNzOiBmdW5jdGlvbigpIHt9IH0pIHdvcmsuXG4gICAgICBpZiAoIW9wdGlvbnMgJiYgYXR0cnMpIHtcbiAgICAgICAgdmFyIGV4dHJhX2tleXMgPSBfLnJlamVjdChhdHRycywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgIHJldHVybiBfLmluY2x1ZGUoW1wic3VjY2Vzc1wiLCBcImVycm9yXCIsIFwid2FpdFwiXSwga2V5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChleHRyYV9rZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHZhciBhbGxfZnVuY3Rpb25zID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoXy5oYXMoYXR0cnMsIFwic3VjY2Vzc1wiKSAmJiAhXy5pc0Z1bmN0aW9uKGF0dHJzLnN1Y2Nlc3MpKSB7XG4gICAgICAgICAgICBhbGxfZnVuY3Rpb25zID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmhhcyhhdHRycywgXCJlcnJvclwiKSAmJiAhXy5pc0Z1bmN0aW9uKGF0dHJzLmVycm9yKSkge1xuICAgICAgICAgICAgYWxsX2Z1bmN0aW9ucyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYWxsX2Z1bmN0aW9ucykge1xuICAgICAgICAgICAgLy8gVGhpcyBhdHRycyBvYmplY3QgbG9va3MgbGlrZSBpdCdzIHJlYWxseSBhbiBvcHRpb25zIG9iamVjdCxcbiAgICAgICAgICAgIC8vIGFuZCB0aGVyZSdzIG5vIG90aGVyIG9wdGlvbnMgb2JqZWN0LCBzbyBsZXQncyBqdXN0IHVzZSBpdC5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmUobnVsbCwgYXR0cnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICAgICAgY3VycmVudCA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNldE9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgaWYgKHNldE9wdGlvbnMud2FpdCkge1xuICAgICAgICBzZXRPcHRpb25zLnNpbGVudCA9IHRydWU7XG4gICAgICB9XG4gICAgICB2YXIgc2V0RXJyb3I7XG4gICAgICBzZXRPcHRpb25zLmVycm9yID0gZnVuY3Rpb24obW9kZWwsIGVycm9yKSB7XG4gICAgICAgIHNldEVycm9yID0gZXJyb3I7XG4gICAgICB9O1xuICAgICAgaWYgKGF0dHJzICYmICF0aGlzLnNldChhdHRycywgc2V0T3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3Ioc2V0RXJyb3IpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbW9kZWwgPSB0aGlzO1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbnkgdW5zYXZlZCBjaGlsZCwgc2F2ZSBpdCBmaXJzdC5cbiAgICAgIG1vZGVsLl9yZWZyZXNoQ2FjaGUoKTtcblxuICAgICAgLy8gVE9ETyhrbGltdCk6IFJlZmFjdG9yIHRoaXMgc28gdGhhdCB0aGUgc2F2ZSBzdGFydHMgbm93LCBub3QgbGF0ZXIuXG5cbiAgICAgIHZhciB1bnNhdmVkQ2hpbGRyZW4gPSBbXTtcbiAgICAgIHZhciB1bnNhdmVkRmlsZXMgPSBbXTtcbiAgICAgIFBhcnNlLk9iamVjdC5fZmluZFVuc2F2ZWRDaGlsZHJlbihtb2RlbC5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuc2F2ZWRDaGlsZHJlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnNhdmVkRmlsZXMpO1xuICAgICAgaWYgKHVuc2F2ZWRDaGlsZHJlbi5sZW5ndGggKyB1bnNhdmVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll9kZWVwU2F2ZUFzeW5jKHRoaXMuYXR0cmlidXRlcywge1xuICAgICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gbW9kZWwuc2F2ZShudWxsLCBvcHRpb25zKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcikuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgbW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3RhcnRTYXZlKCk7XG4gICAgICB0aGlzLl9zYXZpbmcgPSAodGhpcy5fc2F2aW5nIHx8IDApICsgMTtcblxuICAgICAgdGhpcy5fYWxsUHJldmlvdXNTYXZlcyA9IHRoaXMuX2FsbFByZXZpb3VzU2F2ZXMgfHwgUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgICAgdGhpcy5fYWxsUHJldmlvdXNTYXZlcyA9IHRoaXMuX2FsbFByZXZpb3VzU2F2ZXMuX2NvbnRpbnVlV2l0aChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG1vZGVsLmlkID8gJ1BVVCcgOiAnUE9TVCc7XG5cbiAgICAgICAgdmFyIGpzb24gPSBtb2RlbC5fZ2V0U2F2ZUpTT04oKTtcblxuICAgICAgICB2YXIgcm91dGUgPSBcImNsYXNzZXNcIjtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IG1vZGVsLmNsYXNzTmFtZTtcbiAgICAgICAgaWYgKG1vZGVsLmNsYXNzTmFtZSA9PT0gXCJfVXNlclwiICYmICFtb2RlbC5pZCkge1xuICAgICAgICAgIC8vIFNwZWNpYWwtY2FzZSB1c2VyIHNpZ24tdXAuXG4gICAgICAgICAgcm91dGUgPSBcInVzZXJzXCI7XG4gICAgICAgICAgY2xhc3NOYW1lID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgICByb3V0ZTogcm91dGUsXG4gICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc05hbWUsXG4gICAgICAgICAgb2JqZWN0SWQ6IG1vZGVsLmlkLFxuICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgICAgZGF0YToganNvblxuICAgICAgICB9KTtcblxuICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgICAgdmFyIHNlcnZlckF0dHJzID0gbW9kZWwucGFyc2UocmVzcCwgc3RhdHVzLCB4aHIpO1xuICAgICAgICAgIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICAgICAgICAgIHNlcnZlckF0dHJzID0gXy5leHRlbmQoYXR0cnMgfHwge30sIHNlcnZlckF0dHJzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW9kZWwuX2ZpbmlzaFNhdmUoc2VydmVyQXR0cnMpO1xuICAgICAgICAgIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICAgICAgICAgIG1vZGVsLnNldChjdXJyZW50LCBzZXRPcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1vZGVsO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgbW9kZWwuX2NhbmNlbFNhdmUoKTtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG5cbiAgICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgbW9kZWwpO1xuXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5fYWxsUHJldmlvdXNTYXZlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGlzIG1vZGVsIG9uIHRoZSBzZXJ2ZXIgaWYgaXQgd2FzIGFscmVhZHkgcGVyc2lzdGVkLlxuICAgICAqIE9wdGltaXN0aWNhbGx5IHJlbW92ZXMgdGhlIG1vZGVsIGZyb20gaXRzIGNvbGxlY3Rpb24sIGlmIGl0IGhhcyBvbmUuXG4gICAgICogSWYgYHdhaXQ6IHRydWVgIGlzIHBhc3NlZCwgd2FpdHMgZm9yIHRoZSBzZXJ2ZXIgdG8gcmVzcG9uZFxuICAgICAqIGJlZm9yZSByZW1vdmFsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPndhaXQ6IFNldCB0byB0cnVlIHRvIHdhaXQgZm9yIHRoZSBzZXJ2ZXIgdG8gY29uZmlybSBzdWNjZXNzZnVsXG4gICAgICogICBkZWxldGlvbiBvZiB0aGUgb2JqZWN0IGJlZm9yZSB0cmlnZ2VyaW5nIHRoZSBgZGVzdHJveWAgZXZlbnQuXG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIGRlc3Ryb3lcbiAgICAgKiAgICAgY29tcGxldGVzLlxuICAgICAqL1xuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdmFyIG1vZGVsID0gdGhpcztcblxuICAgICAgdmFyIHRyaWdnZXJEZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG1vZGVsLnRyaWdnZXIoJ2Rlc3Ryb3knLCBtb2RlbCwgbW9kZWwuY29sbGVjdGlvbiwgb3B0aW9ucyk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXJEZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghb3B0aW9ucy53YWl0KSB7XG4gICAgICAgIHRyaWdnZXJEZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc05hbWUsXG4gICAgICAgIG9iamVjdElkOiB0aGlzLmlkLFxuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICAgICAgICB0cmlnZ2VyRGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhIHJlc3BvbnNlIGludG8gdGhlIGhhc2ggb2YgYXR0cmlidXRlcyB0byBiZSBzZXQgb24gdGhlIG1vZGVsLlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBfLmNsb25lKHJlc3ApO1xuICAgICAgXyhbXCJjcmVhdGVkQXRcIiwgXCJ1cGRhdGVkQXRcIl0pLmVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChvdXRwdXRba2V5XSkge1xuICAgICAgICAgIG91dHB1dFtrZXldID0gUGFyc2UuX3BhcnNlRGF0ZShvdXRwdXRba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKCFvdXRwdXQudXBkYXRlZEF0KSB7XG4gICAgICAgIG91dHB1dC51cGRhdGVkQXQgPSBvdXRwdXQuY3JlYXRlZEF0O1xuICAgICAgfVxuICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICB0aGlzLl9leGlzdGVkID0gKHN0YXR1cyAhPT0gMjAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbW9kZWwgd2l0aCBpZGVudGljYWwgYXR0cmlidXRlcyB0byB0aGlzIG9uZS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5PYmplY3R9XG4gICAgICovXG4gICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG9iamVjdCBoYXMgbmV2ZXIgYmVlbiBzYXZlZCB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzTmV3OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhdGhpcy5pZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbCB0aGlzIG1ldGhvZCB0byBtYW51YWxseSBmaXJlIGEgYFwiY2hhbmdlXCJgIGV2ZW50IGZvciB0aGlzIG1vZGVsIGFuZFxuICAgICAqIGEgYFwiY2hhbmdlOmF0dHJpYnV0ZVwiYCBldmVudCBmb3IgZWFjaCBjaGFuZ2VkIGF0dHJpYnV0ZS5cbiAgICAgKiBDYWxsaW5nIHRoaXMgd2lsbCBjYXVzZSBhbGwgb2JqZWN0cyBvYnNlcnZpbmcgdGhlIG1vZGVsIHRvIHVwZGF0ZS5cbiAgICAgKi9cbiAgICBjaGFuZ2U6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdmFyIGNoYW5naW5nID0gdGhpcy5fY2hhbmdpbmc7XG4gICAgICB0aGlzLl9jaGFuZ2luZyA9IHRydWU7XG5cbiAgICAgIC8vIFNpbGVudCBjaGFuZ2VzIGJlY29tZSBwZW5kaW5nIGNoYW5nZXMuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLl9zaWxlbnQsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgc2VsZi5fcGVuZGluZ1thdHRyXSA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2lsZW50IGNoYW5nZXMgYXJlIHRyaWdnZXJlZC5cbiAgICAgIHZhciBjaGFuZ2VzID0gXy5leHRlbmQoe30sIG9wdGlvbnMuY2hhbmdlcywgdGhpcy5fc2lsZW50KTtcbiAgICAgIHRoaXMuX3NpbGVudCA9IHt9O1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goY2hhbmdlcywgZnVuY3Rpb24odW51c2VkX3ZhbHVlLCBhdHRyKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOicgKyBhdHRyLCBzZWxmLCBzZWxmLmdldChhdHRyKSwgb3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICAgIGlmIChjaGFuZ2luZykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBpcyB0byBnZXQgYXJvdW5kIGxpbnQgbm90IGxldHRpbmcgdXMgbWFrZSBhIGZ1bmN0aW9uIGluIGEgbG9vcC5cbiAgICAgIHZhciBkZWxldGVDaGFuZ2VkID0gZnVuY3Rpb24odmFsdWUsIGF0dHIpIHtcbiAgICAgICAgaWYgKCFzZWxmLl9wZW5kaW5nW2F0dHJdICYmICFzZWxmLl9zaWxlbnRbYXR0cl0pIHtcbiAgICAgICAgICBkZWxldGUgc2VsZi5jaGFuZ2VkW2F0dHJdO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBDb250aW51ZSBmaXJpbmcgYFwiY2hhbmdlXCJgIGV2ZW50cyB3aGlsZSB0aGVyZSBhcmUgcGVuZGluZyBjaGFuZ2VzLlxuICAgICAgd2hpbGUgKCFfLmlzRW1wdHkodGhpcy5fcGVuZGluZykpIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZyA9IHt9O1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAvLyBQZW5kaW5nIGFuZCBzaWxlbnQgY2hhbmdlcyBzdGlsbCByZW1haW4uXG4gICAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuY2hhbmdlZCwgZGVsZXRlQ2hhbmdlZCk7XG4gICAgICAgIHNlbGYuX3ByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBvYmplY3Qgd2FzIGNyZWF0ZWQgYnkgdGhlIFBhcnNlIHNlcnZlciB3aGVuIHRoZVxuICAgICAqIG9iamVjdCBtaWdodCBoYXZlIGFscmVhZHkgYmVlbiB0aGVyZSAoZS5nLiBpbiB0aGUgY2FzZSBvZiBhIEZhY2Vib29rXG4gICAgICogbG9naW4pXG4gICAgICovXG4gICAgZXhpc3RlZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZXhpc3RlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lIGlmIHRoZSBtb2RlbCBoYXMgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPlxuICAgICAqIGV2ZW50LiAgSWYgeW91IHNwZWNpZnkgYW4gYXR0cmlidXRlIG5hbWUsIGRldGVybWluZSBpZiB0aGF0IGF0dHJpYnV0ZVxuICAgICAqIGhhcyBjaGFuZ2VkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE9wdGlvbmFsIGF0dHJpYnV0ZSBuYW1lXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNDaGFuZ2VkOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICFfLmlzRW1wdHkodGhpcy5jaGFuZ2VkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZWQgJiYgXy5oYXModGhpcy5jaGFuZ2VkLCBhdHRyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGF0dHJpYnV0ZXMgdGhhdCBoYXZlIGNoYW5nZWQsIG9yXG4gICAgICogZmFsc2UgaWYgdGhlcmUgYXJlIG5vIGNoYW5nZWQgYXR0cmlidXRlcy4gVXNlZnVsIGZvciBkZXRlcm1pbmluZyB3aGF0XG4gICAgICogcGFydHMgb2YgYSB2aWV3IG5lZWQgdG8gYmUgdXBkYXRlZCBhbmQvb3Igd2hhdCBhdHRyaWJ1dGVzIG5lZWQgdG8gYmVcbiAgICAgKiBwZXJzaXN0ZWQgdG8gdGhlIHNlcnZlci4gVW5zZXQgYXR0cmlidXRlcyB3aWxsIGJlIHNldCB0byB1bmRlZmluZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYW4gYXR0cmlidXRlcyBvYmplY3QgdG8gZGlmZiBhZ2FpbnN0IHRoZSBtb2RlbCxcbiAgICAgKiBkZXRlcm1pbmluZyBpZiB0aGVyZSAqd291bGQgYmUqIGEgY2hhbmdlLlxuICAgICAqL1xuICAgIGNoYW5nZWRBdHRyaWJ1dGVzOiBmdW5jdGlvbihkaWZmKSB7XG4gICAgICBpZiAoIWRpZmYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzQ2hhbmdlZCgpID8gXy5jbG9uZSh0aGlzLmNoYW5nZWQpIDogZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgY2hhbmdlZCA9IHt9O1xuICAgICAgdmFyIG9sZCA9IHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGRpZmYsIGZ1bmN0aW9uKGRpZmZWYWwsIGF0dHIpIHtcbiAgICAgICAgaWYgKCFfLmlzRXF1YWwob2xkW2F0dHJdLCBkaWZmVmFsKSkge1xuICAgICAgICAgIGNoYW5nZWRbYXR0cl0gPSBkaWZmVmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjaGFuZ2VkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUsIHJlY29yZGVkIGF0IHRoZSB0aW1lIHRoZSBsYXN0XG4gICAgICogPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gZXZlbnQgd2FzIGZpcmVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB0byBnZXQuXG4gICAgICovXG4gICAgcHJldmlvdXM6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCB8fCAhdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlc1thdHRyXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbGwgb2YgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIG1vZGVsIGF0IHRoZSB0aW1lIG9mIHRoZSBwcmV2aW91c1xuICAgICAqIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IGV2ZW50LlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBwcmV2aW91c0F0dHJpYnV0ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8uY2xvbmUodGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBtb2RlbCBpcyBjdXJyZW50bHkgaW4gYSB2YWxpZCBzdGF0ZS4gSXQncyBvbmx5IHBvc3NpYmxlIHRvXG4gICAgICogZ2V0IGludG8gYW4gKmludmFsaWQqIHN0YXRlIGlmIHlvdSdyZSB1c2luZyBzaWxlbnQgY2hhbmdlcy5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzVmFsaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICF0aGlzLnZhbGlkYXRlKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFlvdSBzaG91bGQgbm90IGNhbGwgdGhpcyBmdW5jdGlvbiBkaXJlY3RseSB1bmxlc3MgeW91IHN1YmNsYXNzXG4gICAgICogPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPiwgaW4gd2hpY2ggY2FzZSB5b3UgY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kXG4gICAgICogdG8gcHJvdmlkZSBhZGRpdGlvbmFsIHZhbGlkYXRpb24gb24gPGNvZGU+c2V0PC9jb2RlPiBhbmRcbiAgICAgKiA8Y29kZT5zYXZlPC9jb2RlPi4gIFlvdXIgaW1wbGVtZW50YXRpb24gc2hvdWxkIHJldHVyblxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzIFRoZSBjdXJyZW50IGRhdGEgdG8gdmFsaWRhdGUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1saWtlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge30gRmFsc2UgaWYgdGhlIGRhdGEgaXMgdmFsaWQuICBBbiBlcnJvciBvYmplY3Qgb3RoZXJ3aXNlLlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I3NldFxuICAgICAqL1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgICAgaWYgKF8uaGFzKGF0dHJzLCBcIkFDTFwiKSAmJiAhKGF0dHJzLkFDTCBpbnN0YW5jZW9mIFBhcnNlLkFDTCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFDTCBtdXN0IGJlIGEgUGFyc2UuQUNMLlwiKTtcbiAgICAgIH1cbiAgICAgIHZhciBjb3JyZWN0ID0gdHJ1ZTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGF0dHJzLCBmdW5jdGlvbih1bnVzZWRfdmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoISgvXltBLVphLXpdWzAtOUEtWmEtel9dKiQvKS50ZXN0KGtleSkpIHtcbiAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKCFjb3JyZWN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuSU5WQUxJRF9LRVlfTkFNRSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biB2YWxpZGF0aW9uIGFnYWluc3QgYSBzZXQgb2YgaW5jb21pbmcgYXR0cmlidXRlcywgcmV0dXJuaW5nIGB0cnVlYFxuICAgICAqIGlmIGFsbCBpcyB3ZWxsLiBJZiBhIHNwZWNpZmljIGBlcnJvcmAgY2FsbGJhY2sgaGFzIGJlZW4gcGFzc2VkLFxuICAgICAqIGNhbGwgdGhhdCBpbnN0ZWFkIG9mIGZpcmluZyB0aGUgZ2VuZXJhbCBgXCJlcnJvclwiYCBldmVudC5cbiAgICAgKi9cbiAgICBfdmFsaWRhdGU6IGZ1bmN0aW9uKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy5zaWxlbnQgfHwgIXRoaXMudmFsaWRhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBhdHRycyA9IF8uZXh0ZW5kKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJzKTtcbiAgICAgIHZhciBlcnJvciA9IHRoaXMudmFsaWRhdGUoYXR0cnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgb3B0aW9ucy5lcnJvcih0aGlzLCBlcnJvciwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ2Vycm9yJywgdGhpcywgZXJyb3IsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBBQ0wgZm9yIHRoaXMgb2JqZWN0LlxuICAgICAqIEByZXR1cm5zIHtQYXJzZS5BQ0x9IEFuIGluc3RhbmNlIG9mIFBhcnNlLkFDTC5cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNnZXRcbiAgICAgKi9cbiAgICBnZXRBQ0w6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwiQUNMXCIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBBQ0wgdG8gYmUgdXNlZCBmb3IgdGhpcyBvYmplY3QuXG4gICAgICogQHBhcmFtIHtQYXJzZS5BQ0x9IGFjbCBBbiBpbnN0YW5jZSBvZiBQYXJzZS5BQ0wuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9uYWwgQmFja2JvbmUtbGlrZSBvcHRpb25zIG9iamVjdCB0byBiZVxuICAgICAqICAgICBwYXNzZWQgaW4gdG8gc2V0LlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIHNldCBwYXNzZWQgdmFsaWRhdGlvbi5cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNzZXRcbiAgICAgKi9cbiAgICBzZXRBQ0w6IGZ1bmN0aW9uKGFjbCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KFwiQUNMXCIsIGFjbCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBzdWJjbGFzcyBmb3IgbWFraW5nIG5ldyBpbnN0YW5jZXMgb2YgdGhlIGdpdmVuXG4gICAqIGNsYXNzTmFtZSBzdHJpbmcuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgaWYgKCFfLmlzU3RyaW5nKGNsYXNzTmFtZSkpIHtcbiAgICAgIHRocm93IFwiUGFyc2UuT2JqZWN0Ll9nZXRTdWJjbGFzcyByZXF1aXJlcyBhIHN0cmluZyBhcmd1bWVudC5cIjtcbiAgICB9XG4gICAgdmFyIE9iamVjdENsYXNzID0gUGFyc2UuT2JqZWN0Ll9jbGFzc01hcFtjbGFzc05hbWVdO1xuICAgIGlmICghT2JqZWN0Q2xhc3MpIHtcbiAgICAgIE9iamVjdENsYXNzID0gUGFyc2UuT2JqZWN0LmV4dGVuZChjbGFzc05hbWUpO1xuICAgICAgUGFyc2UuT2JqZWN0Ll9jbGFzc01hcFtjbGFzc05hbWVdID0gT2JqZWN0Q2xhc3M7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3RDbGFzcztcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhIHN1YmNsYXNzIG9mIFBhcnNlLk9iamVjdCBmb3IgdGhlIGdpdmVuIGNsYXNzbmFtZS5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5fY3JlYXRlID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG4gICAgdmFyIE9iamVjdENsYXNzID0gUGFyc2UuT2JqZWN0Ll9nZXRTdWJjbGFzcyhjbGFzc05hbWUpO1xuICAgIHJldHVybiBuZXcgT2JqZWN0Q2xhc3MoYXR0cmlidXRlcywgb3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaXN0IG9mIG9iamVjdCBpZHMgZ2l2ZW4gYSBsaXN0IG9mIG9iamVjdHMuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX3RvT2JqZWN0SWRBcnJheSA9IGZ1bmN0aW9uKGxpc3QsIG9taXRPYmplY3RzV2l0aERhdGEpIHtcbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKGxpc3QpO1xuICAgIH1cblxuICAgIHZhciBlcnJvcjtcbiAgICB2YXIgY2xhc3NOYW1lID0gbGlzdFswXS5jbGFzc05hbWU7XG4gICAgdmFyIG9iamVjdElkcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iamVjdCA9IGxpc3RbaV07XG4gICAgICBpZiAoY2xhc3NOYW1lICE9PSBvYmplY3QuY2xhc3NOYW1lKSB7XG4gICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLklOVkFMSURfQ0xBU1NfTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBbGwgb2JqZWN0cyBzaG91bGQgYmUgb2YgdGhlIHNhbWUgY2xhc3NcIik7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9iamVjdC5pZCkge1xuICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5NSVNTSU5HX09CSkVDVF9JRCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBbGwgb2JqZWN0cyBtdXN0IGhhdmUgYW4gSURcIik7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAob21pdE9iamVjdHNXaXRoRGF0YSAmJiBvYmplY3QuX2hhc0RhdGEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBvYmplY3RJZHMucHVzaChvYmplY3QuaWQpO1xuICAgIH1cblxuICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKG9iamVjdElkcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYSBsaXN0IG9mIG9iamVjdHMgd2l0aCBmZXRjaGVkIHJlc3VsdHMuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX3VwZGF0ZVdpdGhGZXRjaGVkUmVzdWx0cyA9IGZ1bmN0aW9uKGxpc3QsIGZldGNoZWQsIGZvcmNlRmV0Y2gpIHtcbiAgICB2YXIgZmV0Y2hlZE9iamVjdHNCeUlkID0ge307XG4gICAgUGFyc2UuX2FycmF5RWFjaChmZXRjaGVkLCBmdW5jdGlvbihvYmplY3QsIGkpIHtcbiAgICAgIGZldGNoZWRPYmplY3RzQnlJZFtvYmplY3QuaWRdID0gb2JqZWN0O1xuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gbGlzdFtpXTtcbiAgICAgIHZhciBmZXRjaGVkT2JqZWN0ID0gZmV0Y2hlZE9iamVjdHNCeUlkW29iamVjdC5pZF07XG4gICAgICBpZiAoIWZldGNoZWRPYmplY3QgJiYgZm9yY2VGZXRjaCkge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT0JKRUNUX05PVF9GT1VORCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBbGwgb2JqZWN0cyBtdXN0IGV4aXN0IG9uIHRoZSBzZXJ2ZXJcIik7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgb2JqZWN0Ll9tZXJnZUZyb21PYmplY3QoZmV0Y2hlZE9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMobGlzdCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgdGhlIG9iamVjdHMgZ2l2ZW4gaW4gbGlzdC4gIFRoZSBmb3JjZUZldGNoIG9wdGlvbiB3aWxsIGZldGNoIGFsbFxuICAgKiBvYmplY3RzIGlmIHRydWUgYW5kIGlnbm9yZSBvYmplY3RzIHdpdGggZGF0YSBpZiBmYWxzZS5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5fZmV0Y2hBbGwgPSBmdW5jdGlvbihsaXN0LCBmb3JjZUZldGNoKSB7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhsaXN0KTtcbiAgICB9XG5cbiAgICB2YXIgb21pdE9iamVjdHNXaXRoRGF0YSA9ICFmb3JjZUZldGNoO1xuICAgIHJldHVybiBQYXJzZS5PYmplY3QuX3RvT2JqZWN0SWRBcnJheShcbiAgICAgIGxpc3QsXG4gICAgICBvbWl0T2JqZWN0c1dpdGhEYXRhXG4gICAgKS50aGVuKGZ1bmN0aW9uKG9iamVjdElkcykge1xuICAgICAgdmFyIGNsYXNzTmFtZSA9IGxpc3RbMF0uY2xhc3NOYW1lO1xuICAgICAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KGNsYXNzTmFtZSk7XG4gICAgICBxdWVyeS5jb250YWluZWRJbihcIm9iamVjdElkXCIsIG9iamVjdElkcyk7XG4gICAgICBxdWVyeS5saW1pdCA9IG9iamVjdElkcy5sZW5ndGg7XG4gICAgICByZXR1cm4gcXVlcnkuZmluZCgpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fdXBkYXRlV2l0aEZldGNoZWRSZXN1bHRzKFxuICAgICAgICBsaXN0LFxuICAgICAgICByZXN1bHRzLFxuICAgICAgICBmb3JjZUZldGNoXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFNldCB1cCBhIG1hcCBvZiBjbGFzc05hbWUgdG8gY2xhc3Mgc28gdGhhdCB3ZSBjYW4gY3JlYXRlIG5ldyBpbnN0YW5jZXMgb2ZcbiAgLy8gUGFyc2UgT2JqZWN0cyBmcm9tIEpTT04gYXV0b21hdGljYWxseS5cbiAgUGFyc2UuT2JqZWN0Ll9jbGFzc01hcCA9IHt9O1xuXG4gIFBhcnNlLk9iamVjdC5fZXh0ZW5kID0gUGFyc2UuX2V4dGVuZDtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBzdWJjbGFzcyBvZiBQYXJzZS5PYmplY3QgZm9yIHRoZSBnaXZlbiBQYXJzZSBjbGFzcyBuYW1lLlxuICAgKlxuICAgKiA8cD5FdmVyeSBleHRlbnNpb24gb2YgYSBQYXJzZSBjbGFzcyB3aWxsIGluaGVyaXQgZnJvbSB0aGUgbW9zdCByZWNlbnRcbiAgICogcHJldmlvdXMgZXh0ZW5zaW9uIG9mIHRoYXQgY2xhc3MuIFdoZW4gYSBQYXJzZS5PYmplY3QgaXMgYXV0b21hdGljYWxseVxuICAgKiBjcmVhdGVkIGJ5IHBhcnNpbmcgSlNPTiwgaXQgd2lsbCB1c2UgdGhlIG1vc3QgcmVjZW50IGV4dGVuc2lvbiBvZiB0aGF0XG4gICAqIGNsYXNzLjwvcD5cbiAgICpcbiAgICogPHA+WW91IHNob3VsZCBjYWxsIGVpdGhlcjo8cHJlPlxuICAgKiAgICAgdmFyIE15Q2xhc3MgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiTXlDbGFzc1wiLCB7XG4gICAqICAgICAgICAgPGk+SW5zdGFuY2UgbWV0aG9kczwvaT4sXG4gICAqICAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICogICAgICAgICAgICAgdGhpcy5zb21lSW5zdGFuY2VQcm9wZXJ0eSA9IFtdLFxuICAgKiAgICAgICAgICAgICA8aT5PdGhlciBpbnN0YW5jZSBwcm9wZXJ0aWVzPC9pPlxuICAgKiAgICAgICAgIH1cbiAgICogICAgIH0sIHtcbiAgICogICAgICAgICA8aT5DbGFzcyBwcm9wZXJ0aWVzPC9pPlxuICAgKiAgICAgfSk7PC9wcmU+XG4gICAqIG9yLCBmb3IgQmFja2JvbmUgY29tcGF0aWJpbGl0eTo8cHJlPlxuICAgKiAgICAgdmFyIE15Q2xhc3MgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKHtcbiAgICogICAgICAgICBjbGFzc05hbWU6IFwiTXlDbGFzc1wiLFxuICAgKiAgICAgICAgIDxpPkluc3RhbmNlIG1ldGhvZHM8L2k+LFxuICAgKiAgICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGF0dHJzLCBvcHRpb25zKSB7XG4gICAqICAgICAgICAgICAgIHRoaXMuc29tZUluc3RhbmNlUHJvcGVydHkgPSBbXSxcbiAgICogICAgICAgICAgICAgPGk+T3RoZXIgaW5zdGFuY2UgcHJvcGVydGllczwvaT5cbiAgICogICAgICAgICB9XG4gICAqICAgICB9LCB7XG4gICAqICAgICAgICAgPGk+Q2xhc3MgcHJvcGVydGllczwvaT5cbiAgICogICAgIH0pOzwvcHJlPjwvcD5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBUaGUgbmFtZSBvZiB0aGUgUGFyc2UgY2xhc3MgYmFja2luZyB0aGlzIG1vZGVsLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvdG9Qcm9wcyBJbnN0YW5jZSBwcm9wZXJ0aWVzIHRvIGFkZCB0byBpbnN0YW5jZXMgb2YgdGhlXG4gICAqICAgICBjbGFzcyByZXR1cm5lZCBmcm9tIHRoaXMgbWV0aG9kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2xhc3NQcm9wcyBDbGFzcyBwcm9wZXJ0aWVzIHRvIGFkZCB0aGUgY2xhc3MgcmV0dXJuZWQgZnJvbVxuICAgKiAgICAgdGhpcyBtZXRob2QuXG4gICAqIEByZXR1cm4ge0NsYXNzfSBBIG5ldyBzdWJjbGFzcyBvZiBQYXJzZS5PYmplY3QuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuZXh0ZW5kID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBwcm90b1Byb3BzLCBjbGFzc1Byb3BzKSB7XG4gICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdpdGggb25seSB0d28gYXJncy5cbiAgICBpZiAoIV8uaXNTdHJpbmcoY2xhc3NOYW1lKSkge1xuICAgICAgaWYgKGNsYXNzTmFtZSAmJiBfLmhhcyhjbGFzc05hbWUsIFwiY2xhc3NOYW1lXCIpKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuZXh0ZW5kKGNsYXNzTmFtZS5jbGFzc05hbWUsIGNsYXNzTmFtZSwgcHJvdG9Qcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBcIlBhcnNlLk9iamVjdC5leHRlbmQncyBmaXJzdCBhcmd1bWVudCBzaG91bGQgYmUgdGhlIGNsYXNzTmFtZS5cIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgc29tZW9uZSB0cmllcyB0byBzdWJjbGFzcyBcIlVzZXJcIiwgY29lcmNlIGl0IHRvIHRoZSByaWdodCB0eXBlLlxuICAgIGlmIChjbGFzc05hbWUgPT09IFwiVXNlclwiICYmIFBhcnNlLlVzZXIuX3BlcmZvcm1Vc2VyUmV3cml0ZSkge1xuICAgICAgY2xhc3NOYW1lID0gXCJfVXNlclwiO1xuICAgIH1cbiAgICBwcm90b1Byb3BzID0gcHJvdG9Qcm9wcyB8fCB7fTtcbiAgICBwcm90b1Byb3BzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblxuICAgIHZhciBOZXdDbGFzc09iamVjdCA9IG51bGw7XG4gICAgaWYgKF8uaGFzKFBhcnNlLk9iamVjdC5fY2xhc3NNYXAsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHZhciBPbGRDbGFzc09iamVjdCA9IFBhcnNlLk9iamVjdC5fY2xhc3NNYXBbY2xhc3NOYW1lXTtcbiAgICAgIC8vIFRoaXMgbmV3IHN1YmNsYXNzIGhhcyBiZWVuIHRvbGQgdG8gZXh0ZW5kIGJvdGggZnJvbSBcInRoaXNcIiBhbmQgZnJvbVxuICAgICAgLy8gT2xkQ2xhc3NPYmplY3QuIFRoaXMgaXMgbXVsdGlwbGUgaW5oZXJpdGFuY2UsIHdoaWNoIGlzbid0IHN1cHBvcnRlZC5cbiAgICAgIC8vIEZvciBub3csIGxldCdzIGp1c3QgcGljayBvbmUuXG4gICAgICBOZXdDbGFzc09iamVjdCA9IE9sZENsYXNzT2JqZWN0Ll9leHRlbmQocHJvdG9Qcm9wcywgY2xhc3NQcm9wcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE5ld0NsYXNzT2JqZWN0ID0gdGhpcy5fZXh0ZW5kKHByb3RvUHJvcHMsIGNsYXNzUHJvcHMpO1xuICAgIH1cbiAgICAvLyBFeHRlbmRpbmcgYSBzdWJjbGFzcyBzaG91bGQgcmV1c2UgdGhlIGNsYXNzbmFtZSBhdXRvbWF0aWNhbGx5LlxuICAgIE5ld0NsYXNzT2JqZWN0LmV4dGVuZCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKGFyZzApIHx8IChhcmcwICYmIF8uaGFzKGFyZzAsIFwiY2xhc3NOYW1lXCIpKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LmV4dGVuZC5hcHBseShOZXdDbGFzc09iamVjdCwgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXdBcmd1bWVudHMgPSBbY2xhc3NOYW1lXS5jb25jYXQoUGFyc2UuXy50b0FycmF5KGFyZ3VtZW50cykpO1xuICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5leHRlbmQuYXBwbHkoTmV3Q2xhc3NPYmplY3QsIG5ld0FyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSByZWZlcmVuY2UgdG8gYSBzdWJjbGFzcyBvZiBQYXJzZS5PYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gaWQuIFRoaXNcbiAgICAgKiBkb2VzIG5vdCBleGlzdCBvbiBQYXJzZS5PYmplY3QsIG9ubHkgb24gc3ViY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIDxwPkEgc2hvcnRjdXQgZm9yOiA8cHJlPlxuICAgICAqICB2YXIgRm9vID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkZvb1wiKTtcbiAgICAgKiAgdmFyIHBvaW50ZXJUb0ZvbyA9IG5ldyBGb28oKTtcbiAgICAgKiAgcG9pbnRlclRvRm9vLmlkID0gXCJteU9iamVjdElkXCI7XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAbmFtZSBjcmVhdGVXaXRob3V0RGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIG9iamVjdCB0byBjcmVhdGUgYSByZWZlcmVuY2UgdG8uXG4gICAgICogQHJldHVybiB7UGFyc2UuT2JqZWN0fSBBIFBhcnNlLk9iamVjdCByZWZlcmVuY2UuXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIFBhcnNlLk9iamVjdFxuICAgICAqL1xuICAgIE5ld0NsYXNzT2JqZWN0LmNyZWF0ZVdpdGhvdXREYXRhID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBvYmogPSBuZXcgTmV3Q2xhc3NPYmplY3QoKTtcbiAgICAgIG9iai5pZCA9IGlkO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgUGFyc2UuT2JqZWN0Ll9jbGFzc01hcFtjbGFzc05hbWVdID0gTmV3Q2xhc3NPYmplY3Q7XG4gICAgcmV0dXJuIE5ld0NsYXNzT2JqZWN0O1xuICB9O1xuXG4gIFBhcnNlLk9iamVjdC5fZmluZFVuc2F2ZWRDaGlsZHJlbiA9IGZ1bmN0aW9uKG9iamVjdCwgY2hpbGRyZW4sIGZpbGVzKSB7XG4gICAgUGFyc2UuX3RyYXZlcnNlKG9iamVjdCwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgIG9iamVjdC5fcmVmcmVzaENhY2hlKCk7XG4gICAgICAgIGlmIChvYmplY3QuZGlydHkoKSkge1xuICAgICAgICAgIGNoaWxkcmVuLnB1c2gob2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5GaWxlKSB7XG4gICAgICAgIGlmICghb2JqZWN0LnVybCgpKSB7XG4gICAgICAgICAgZmlsZXMucHVzaChvYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBQYXJzZS5PYmplY3QuX2NhbkJlU2VyaWFsaXplZEFzVmFsdWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAvLyBUT0RPKGtsaW10KTogV2Ugc2hvdWxkIHJld3JpdGUgX3RyYXZlcnNlIHNvIHRoYXQgaXQgY2FuIGJlIHVzZWQgaGVyZS5cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICByZXR1cm4gISFvYmplY3QuaWQ7XG4gICAgfVxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5GaWxlKSB7XG4gICAgICAvLyBEb24ndCByZWN1cnNlIGluZGVmaW5pdGVseSBpbnRvIGZpbGVzLlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGNhbkJlU2VyaWFsaXplZEFzVmFsdWUgPSB0cnVlO1xuXG4gICAgaWYgKF8uaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKG9iamVjdCwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgaWYgKCFQYXJzZS5PYmplY3QuX2NhbkJlU2VyaWFsaXplZEFzVmFsdWUoY2hpbGQpKSB7XG4gICAgICAgICAgY2FuQmVTZXJpYWxpemVkQXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgUGFyc2UuX29iamVjdEVhY2gob2JqZWN0LCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBpZiAoIVBhcnNlLk9iamVjdC5fY2FuQmVTZXJpYWxpemVkQXNWYWx1ZShjaGlsZCkpIHtcbiAgICAgICAgICBjYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY2FuQmVTZXJpYWxpemVkQXNWYWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgcm9vdCBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zOiBUaGUgb25seSB2YWxpZCBvcHRpb24gaXMgdXNlTWFzdGVyS2V5LlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll9kZWVwU2F2ZUFzeW5jID0gZnVuY3Rpb24ob2JqZWN0LCBvcHRpb25zKSB7XG4gICAgdmFyIHVuc2F2ZWRDaGlsZHJlbiA9IFtdO1xuICAgIHZhciB1bnNhdmVkRmlsZXMgPSBbXTtcbiAgICBQYXJzZS5PYmplY3QuX2ZpbmRVbnNhdmVkQ2hpbGRyZW4ob2JqZWN0LCB1bnNhdmVkQ2hpbGRyZW4sIHVuc2F2ZWRGaWxlcyk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IFBhcnNlLlByb21pc2UuYXMoKTtcbiAgICBfLmVhY2godW5zYXZlZEZpbGVzLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZmlsZS5zYXZlKG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgb2JqZWN0cyA9IF8udW5pcSh1bnNhdmVkQ2hpbGRyZW4pO1xuICAgIHZhciByZW1haW5pbmcgPSBfLnVuaXEob2JqZWN0cyk7XG5cbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuX2NvbnRpbnVlV2hpbGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiByZW1haW5pbmcubGVuZ3RoID4gMDtcbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIEdhdGhlciB1cCBhbGwgdGhlIG9iamVjdHMgdGhhdCBjYW4gYmUgc2F2ZWQgaW4gdGhpcyBiYXRjaC5cbiAgICAgICAgdmFyIGJhdGNoID0gW107XG4gICAgICAgIHZhciBuZXdSZW1haW5pbmcgPSBbXTtcbiAgICAgICAgUGFyc2UuX2FycmF5RWFjaChyZW1haW5pbmcsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIC8vIExpbWl0IGJhdGNoZXMgdG8gMjAgb2JqZWN0cy5cbiAgICAgICAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIG5ld1JlbWFpbmluZy5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG9iamVjdC5fY2FuQmVTZXJpYWxpemVkKCkpIHtcbiAgICAgICAgICAgIGJhdGNoLnB1c2gob2JqZWN0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3UmVtYWluaW5nLnB1c2gob2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZW1haW5pbmcgPSBuZXdSZW1haW5pbmc7XG5cbiAgICAgICAgLy8gSWYgd2UgY2FuJ3Qgc2F2ZSBhbnkgb2JqZWN0cywgdGhlcmUgbXVzdCBiZSBhIGNpcmN1bGFyIHJlZmVyZW5jZS5cbiAgICAgICAgaWYgKGJhdGNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKFxuICAgICAgICAgICAgbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVHJpZWQgdG8gc2F2ZSBhIGJhdGNoIHdpdGggYSBjeWNsZS5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXJ2ZSBhIHNwb3QgaW4gZXZlcnkgb2JqZWN0J3Mgc2F2ZSBxdWV1ZS5cbiAgICAgICAgdmFyIHJlYWR5VG9TdGFydCA9IFBhcnNlLlByb21pc2Uud2hlbihfLm1hcChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIG9iamVjdC5fYWxsUHJldmlvdXNTYXZlcyB8fCBQYXJzZS5Qcm9taXNlLmFzKCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgdmFyIGJhdGNoRmluaXNoZWQgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgICBQYXJzZS5fYXJyYXlFYWNoKGJhdGNoLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICBvYmplY3QuX2FsbFByZXZpb3VzU2F2ZXMgPSBiYXRjaEZpbmlzaGVkO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTYXZlIGEgc2luZ2xlIGJhdGNoLCB3aGV0aGVyIHByZXZpb3VzIHNhdmVzIHN1Y2NlZWRlZCBvciBmYWlsZWQuXG4gICAgICAgIHJldHVybiByZWFkeVRvU3RhcnQuX2NvbnRpbnVlV2l0aChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICAgICAgcm91dGU6IFwiYmF0Y2hcIixcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICByZXF1ZXN0czogXy5tYXAoYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHZhciBqc29uID0gb2JqZWN0Ll9nZXRTYXZlSlNPTigpO1xuICAgICAgICAgICAgICAgIHZhciBtZXRob2QgPSBcIlBPU1RcIjtcblxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gXCIvMS9jbGFzc2VzL1wiICsgb2JqZWN0LmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LmlkKSB7XG4gICAgICAgICAgICAgICAgICBwYXRoID0gcGF0aCArIFwiL1wiICsgb2JqZWN0LmlkO1xuICAgICAgICAgICAgICAgICAgbWV0aG9kID0gXCJQVVRcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvYmplY3QuX3N0YXJ0U2F2ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAgIGJvZHk6IGpzb25cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgICBQYXJzZS5fYXJyYXlFYWNoKGJhdGNoLCBmdW5jdGlvbihvYmplY3QsIGkpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QuX2ZpbmlzaFNhdmUoXG4gICAgICAgICAgICAgICAgICBvYmplY3QucGFyc2UocmVzcG9uc2VbaV0uc3VjY2Vzcywgc3RhdHVzLCB4aHIpKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGVycm9yIHx8IHJlc3BvbnNlW2ldLmVycm9yO1xuICAgICAgICAgICAgICAgIG9iamVjdC5fY2FuY2VsU2F2ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihcbiAgICAgICAgICAgICAgICBuZXcgUGFyc2UuRXJyb3IoZXJyb3IuY29kZSwgZXJyb3IuZXJyb3IpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgICAgYmF0Y2hGaW5pc2hlZC5yZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGJhdGNoRmluaXNoZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9KTtcbiAgfTtcblxufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSBSb2xlIG9uIHRoZSBQYXJzZSBzZXJ2ZXIuIFJvbGVzIHJlcHJlc2VudCBncm91cGluZ3Mgb2ZcbiAgICogVXNlcnMgZm9yIHRoZSBwdXJwb3NlcyBvZiBncmFudGluZyBwZXJtaXNzaW9ucyAoZS5nLiBzcGVjaWZ5aW5nIGFuIEFDTFxuICAgKiBmb3IgYW4gT2JqZWN0KS4gUm9sZXMgYXJlIHNwZWNpZmllZCBieSB0aGVpciBzZXRzIG9mIGNoaWxkIHVzZXJzIGFuZFxuICAgKiBjaGlsZCByb2xlcywgYWxsIG9mIHdoaWNoIGFyZSBncmFudGVkIGFueSBwZXJtaXNzaW9ucyB0aGF0IHRoZSBwYXJlbnRcbiAgICogcm9sZSBoYXMuXG4gICAqXG4gICAqIDxwPlJvbGVzIG11c3QgaGF2ZSBhIG5hbWUgKHdoaWNoIGNhbm5vdCBiZSBjaGFuZ2VkIGFmdGVyIGNyZWF0aW9uIG9mIHRoZVxuICAgKiByb2xlKSwgYW5kIG11c3Qgc3BlY2lmeSBhbiBBQ0wuPC9wPlxuICAgKiBAY2xhc3NcbiAgICogQSBQYXJzZS5Sb2xlIGlzIGEgbG9jYWwgcmVwcmVzZW50YXRpb24gb2YgYSByb2xlIHBlcnNpc3RlZCB0byB0aGUgUGFyc2VcbiAgICogY2xvdWQuXG4gICAqL1xuICBQYXJzZS5Sb2xlID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIl9Sb2xlXCIsIC8qKiBAbGVuZHMgUGFyc2UuUm9sZS5wcm90b3R5cGUgKi8ge1xuICAgIC8vIEluc3RhbmNlIE1ldGhvZHNcbiAgICBcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IFBhcnNlUm9sZSB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBBQ0wuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIFJvbGUgdG8gY3JlYXRlLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuQUNMfSBhY2wgVGhlIEFDTCBmb3IgdGhpcyByb2xlLiBSb2xlcyBtdXN0IGhhdmUgYW4gQUNMLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbihuYW1lLCBhY2wpIHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG5hbWUpICYmIChhY2wgaW5zdGFuY2VvZiBQYXJzZS5BQ0wpKSB7XG4gICAgICAgIFBhcnNlLk9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBudWxsLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXROYW1lKG5hbWUpO1xuICAgICAgICB0aGlzLnNldEFDTChhY2wpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUGFyc2UuT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG5hbWUsIGFjbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSByb2xlLiAgWW91IGNhbiBhbHRlcm5hdGl2ZWx5IGNhbGwgcm9sZS5nZXQoXCJuYW1lXCIpXG4gICAgICogXG4gICAgICogQHJldHVybiB7U3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgcm9sZS5cbiAgICAgKi9cbiAgICBnZXROYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChcIm5hbWVcIik7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBuYW1lIGZvciBhIHJvbGUuIFRoaXMgdmFsdWUgbXVzdCBiZSBzZXQgYmVmb3JlIHRoZSByb2xlIGhhc1xuICAgICAqIGJlZW4gc2F2ZWQgdG8gdGhlIHNlcnZlciwgYW5kIGNhbm5vdCBiZSBzZXQgb25jZSB0aGUgcm9sZSBoYXMgYmVlblxuICAgICAqIHNhdmVkLlxuICAgICAqIFxuICAgICAqIDxwPlxuICAgICAqICAgQSByb2xlJ3MgbmFtZSBjYW4gb25seSBjb250YWluIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLCBfLCAtLCBhbmRcbiAgICAgKiAgIHNwYWNlcy5cbiAgICAgKiA8L3A+XG4gICAgICpcbiAgICAgKiA8cD5UaGlzIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyByb2xlLnNldChcIm5hbWVcIiwgbmFtZSk8L3A+XG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHJvbGUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU3RhbmRhcmQgb3B0aW9ucyBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvclxuICAgICAqICAgICBjYWxsYmFja3MuXG4gICAgICovXG4gICAgc2V0TmFtZTogZnVuY3Rpb24obmFtZSwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KFwibmFtZVwiLCBuYW1lLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIFBhcnNlLlJlbGF0aW9uIGZvciB0aGUgUGFyc2UuVXNlcnMgdGhhdCBhcmUgZGlyZWN0XG4gICAgICogY2hpbGRyZW4gb2YgdGhpcyByb2xlLiBUaGVzZSB1c2VycyBhcmUgZ3JhbnRlZCBhbnkgcHJpdmlsZWdlcyB0aGF0IHRoaXNcbiAgICAgKiByb2xlIGhhcyBiZWVuIGdyYW50ZWQgKGUuZy4gcmVhZCBvciB3cml0ZSBhY2Nlc3MgdGhyb3VnaCBBQ0xzKS4gWW91IGNhblxuICAgICAqIGFkZCBvciByZW1vdmUgdXNlcnMgZnJvbSB0aGUgcm9sZSB0aHJvdWdoIHRoaXMgcmVsYXRpb24uXG4gICAgICogXG4gICAgICogPHA+VGhpcyBpcyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgcm9sZS5yZWxhdGlvbihcInVzZXJzXCIpPC9wPlxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge1BhcnNlLlJlbGF0aW9ufSB0aGUgcmVsYXRpb24gZm9yIHRoZSB1c2VycyBiZWxvbmdpbmcgdG8gdGhpc1xuICAgICAqICAgICByb2xlLlxuICAgICAqL1xuICAgIGdldFVzZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbGF0aW9uKFwidXNlcnNcIik7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBQYXJzZS5SZWxhdGlvbiBmb3IgdGhlIFBhcnNlLlJvbGVzIHRoYXQgYXJlIGRpcmVjdFxuICAgICAqIGNoaWxkcmVuIG9mIHRoaXMgcm9sZS4gVGhlc2Ugcm9sZXMnIHVzZXJzIGFyZSBncmFudGVkIGFueSBwcml2aWxlZ2VzIHRoYXRcbiAgICAgKiB0aGlzIHJvbGUgaGFzIGJlZW4gZ3JhbnRlZCAoZS5nLiByZWFkIG9yIHdyaXRlIGFjY2VzcyB0aHJvdWdoIEFDTHMpLiBZb3VcbiAgICAgKiBjYW4gYWRkIG9yIHJlbW92ZSBjaGlsZCByb2xlcyBmcm9tIHRoaXMgcm9sZSB0aHJvdWdoIHRoaXMgcmVsYXRpb24uXG4gICAgICogXG4gICAgICogPHA+VGhpcyBpcyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgcm9sZS5yZWxhdGlvbihcInJvbGVzXCIpPC9wPlxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge1BhcnNlLlJlbGF0aW9ufSB0aGUgcmVsYXRpb24gZm9yIHRoZSByb2xlcyBiZWxvbmdpbmcgdG8gdGhpc1xuICAgICAqICAgICByb2xlLlxuICAgICAqL1xuICAgIGdldFJvbGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbGF0aW9uKFwicm9sZXNcIik7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgICBpZiAoXCJuYW1lXCIgaW4gYXR0cnMgJiYgYXR0cnMubmFtZSAhPT0gdGhpcy5nZXROYW1lKCkpIHtcbiAgICAgICAgdmFyIG5ld05hbWUgPSBhdHRycy5uYW1lO1xuICAgICAgICBpZiAodGhpcy5pZCAmJiB0aGlzLmlkICE9PSBhdHRycy5vYmplY3RJZCkge1xuICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgb2JqZWN0SWQgYmVpbmcgc2V0IG1hdGNoZXMgdGhpcy5pZC5cbiAgICAgICAgICAvLyBUaGlzIGhhcHBlbnMgZHVyaW5nIGEgZmV0Y2ggLS0gdGhlIGlkIGlzIHNldCBiZWZvcmUgY2FsbGluZyBmZXRjaC5cbiAgICAgICAgICAvLyBMZXQgdGhlIG5hbWUgYmUgc2V0IGluIHRoaXMgY2FzZS5cbiAgICAgICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgICBcIkEgcm9sZSdzIG5hbWUgY2FuIG9ubHkgYmUgc2V0IGJlZm9yZSBpdCBoYXMgYmVlbiBzYXZlZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmlzU3RyaW5nKG5ld05hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgICAgXCJBIHJvbGUncyBuYW1lIG11c3QgYmUgYSBTdHJpbmcuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKC9eWzAtOWEtekEtWlxcLV8gXSskLykudGVzdChuZXdOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICAgIFwiQSByb2xlJ3MgbmFtZSBjYW4gb25seSBjb250YWluIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLCBfLFwiICtcbiAgICAgICAgICAgICAgXCIgLSwgYW5kIHNwYWNlcy5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChQYXJzZS5PYmplY3QucHJvdG90eXBlLnZhbGlkYXRlKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5PYmplY3QucHJvdG90eXBlLnZhbGlkYXRlLmNhbGwodGhpcywgYXR0cnMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG59KHRoaXMpKTtcblxuXG4vKmdsb2JhbCBfOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBtb2RlbHMgYW5kIG9wdGlvbnMuICBUeXBpY2FsbHksIHlvdVxuICAgKiB3aWxsIG5vdCBjYWxsIHRoaXMgbWV0aG9kIGRpcmVjdGx5LCBidXQgd2lsbCBpbnN0ZWFkIG1ha2UgYSBzdWJjbGFzcyB1c2luZ1xuICAgKiA8Y29kZT5QYXJzZS5Db2xsZWN0aW9uLmV4dGVuZDwvY29kZT4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IG1vZGVscyBBbiBhcnJheSBvZiBpbnN0YW5jZXMgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgKiAgIDxsaT5tb2RlbDogVGhlIFBhcnNlLk9iamVjdCBzdWJjbGFzcyB0aGF0IHRoaXMgY29sbGVjdGlvbiBjb250YWlucy5cbiAgICogICA8bGk+cXVlcnk6IEFuIGluc3RhbmNlIG9mIFBhcnNlLlF1ZXJ5IHRvIHVzZSB3aGVuIGZldGNoaW5nIGl0ZW1zLlxuICAgKiAgIDxsaT5jb21wYXJhdG9yOiBBIHN0cmluZyBwcm9wZXJ0eSBuYW1lIG9yIGZ1bmN0aW9uIHRvIHNvcnQgYnkuXG4gICAqIDwvdWw+XG4gICAqXG4gICAqIEBzZWUgUGFyc2UuQ29sbGVjdGlvbi5leHRlbmRcbiAgICpcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPlByb3ZpZGVzIGEgc3RhbmRhcmQgY29sbGVjdGlvbiBjbGFzcyBmb3Igb3VyIHNldHMgb2YgbW9kZWxzLCBvcmRlcmVkXG4gICAqIG9yIHVub3JkZXJlZC4gIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlXG4gICAqIDxhIGhyZWY9XCJodHRwOi8vZG9jdW1lbnRjbG91ZC5naXRodWIuY29tL2JhY2tib25lLyNDb2xsZWN0aW9uXCI+QmFja2JvbmVcbiAgICogZG9jdW1lbnRhdGlvbjwvYT4uPC9wPlxuICAgKi9cbiAgUGFyc2UuQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChvcHRpb25zLmNvbXBhcmF0b3IpIHtcbiAgICAgIHRoaXMuY29tcGFyYXRvciA9IG9wdGlvbnMuY29tcGFyYXRvcjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubW9kZWwpIHtcbiAgICAgIHRoaXMubW9kZWwgPSBvcHRpb25zLm1vZGVsO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5xdWVyeSkge1xuICAgICAgdGhpcy5xdWVyeSA9IG9wdGlvbnMucXVlcnk7XG4gICAgfVxuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKG1vZGVscykge1xuICAgICAgdGhpcy5yZXNldChtb2RlbHMsIHtzaWxlbnQ6IHRydWUsIHBhcnNlOiBvcHRpb25zLnBhcnNlfSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIERlZmluZSB0aGUgQ29sbGVjdGlvbidzIGluaGVyaXRhYmxlIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKFBhcnNlLkNvbGxlY3Rpb24ucHJvdG90eXBlLCBQYXJzZS5FdmVudHMsXG4gICAgICAvKiogQGxlbmRzIFBhcnNlLkNvbGxlY3Rpb24ucHJvdG90eXBlICovIHtcblxuICAgIC8vIFRoZSBkZWZhdWx0IG1vZGVsIGZvciBhIGNvbGxlY3Rpb24gaXMganVzdCBhIFBhcnNlLk9iamVjdC5cbiAgICAvLyBUaGlzIHNob3VsZCBiZSBvdmVycmlkZGVuIGluIG1vc3QgY2FzZXMuXG4gICAgLy8gVE9ETzogdGhpbmsgaGFyZGVyLiB0aGlzIGlzIGxpa2VseSB0byBiZSB3ZWlyZC5cbiAgICBtb2RlbDogUGFyc2UuT2JqZWN0LFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBpcyBhbiBlbXB0eSBmdW5jdGlvbiBieSBkZWZhdWx0LiBPdmVycmlkZSBpdCB3aXRoIHlvdXIgb3duXG4gICAgICogaW5pdGlhbGl6YXRpb24gbG9naWMuXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXt9LFxuXG4gICAgLyoqXG4gICAgICogVGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYSBDb2xsZWN0aW9uIGlzIGFuIGFycmF5IG9mIHRoZVxuICAgICAqIG1vZGVscycgYXR0cmlidXRlcy5cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKG1vZGVsKXsgcmV0dXJuIG1vZGVsLnRvSlNPTigpOyB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgbW9kZWwsIG9yIGxpc3Qgb2YgbW9kZWxzIHRvIHRoZSBzZXQuIFBhc3MgKipzaWxlbnQqKiB0byBhdm9pZFxuICAgICAqIGZpcmluZyB0aGUgYGFkZGAgZXZlbnQgZm9yIGV2ZXJ5IG5ldyBtb2RlbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZGVscyBBbiBhcnJheSBvZiBpbnN0YW5jZXMgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPmF0OiBUaGUgaW5kZXggYXQgd2hpY2ggdG8gYWRkIHRoZSBtb2RlbHMuXG4gICAgICogICA8bGk+c2lsZW50OiBTZXQgdG8gdHJ1ZSB0byBhdm9pZCBmaXJpbmcgdGhlIGBhZGRgIGV2ZW50IGZvciBldmVyeSBuZXdcbiAgICAgKiAgIG1vZGVsLlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBpLCBpbmRleCwgbGVuZ3RoLCBtb2RlbCwgY2lkLCBpZCwgY2lkcyA9IHt9LCBpZHMgPSB7fTtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgbW9kZWxzID0gXy5pc0FycmF5KG1vZGVscykgPyBtb2RlbHMuc2xpY2UoKSA6IFttb2RlbHNdO1xuXG4gICAgICAvLyBCZWdpbiBieSB0dXJuaW5nIGJhcmUgb2JqZWN0cyBpbnRvIG1vZGVsIHJlZmVyZW5jZXMsIGFuZCBwcmV2ZW50aW5nXG4gICAgICAvLyBpbnZhbGlkIG1vZGVscyBvciBkdXBsaWNhdGUgbW9kZWxzIGZyb20gYmVpbmcgYWRkZWQuXG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBtb2RlbHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbW9kZWxzW2ldID0gdGhpcy5fcHJlcGFyZU1vZGVsKG1vZGVsc1tpXSwgb3B0aW9ucyk7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2ldO1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgYWRkIGFuIGludmFsaWQgbW9kZWwgdG8gYSBjb2xsZWN0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNpZCA9IG1vZGVsLmNpZDtcbiAgICAgICAgaWYgKGNpZHNbY2lkXSB8fCB0aGlzLl9ieUNpZFtjaWRdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGNpZDogY2FuJ3QgYWRkIHRoZSBzYW1lIG1vZGVsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0byBhIGNvbGxlY3Rpb24gdHdpY2VcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWQgPSBtb2RlbC5pZDtcbiAgICAgICAgaWYgKCFQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQoaWQpICYmIChpZHNbaWRdIHx8IHRoaXMuX2J5SWRbaWRdKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBpZDogY2FuJ3QgYWRkIHRoZSBzYW1lIG1vZGVsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0byBhIGNvbGxlY3Rpb24gdHdpY2VcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWRzW2lkXSA9IG1vZGVsO1xuICAgICAgICBjaWRzW2NpZF0gPSBtb2RlbDtcbiAgICAgIH1cblxuICAgICAgLy8gTGlzdGVuIHRvIGFkZGVkIG1vZGVscycgZXZlbnRzLCBhbmQgaW5kZXggbW9kZWxzIGZvciBsb29rdXAgYnlcbiAgICAgIC8vIGBpZGAgYW5kIGJ5IGBjaWRgLlxuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIChtb2RlbCA9IG1vZGVsc1tpXSkub24oJ2FsbCcsIHRoaXMuX29uTW9kZWxFdmVudCwgdGhpcyk7XG4gICAgICAgIHRoaXMuX2J5Q2lkW21vZGVsLmNpZF0gPSBtb2RlbDtcbiAgICAgICAgaWYgKG1vZGVsLmlkKSB7XG4gICAgICAgICAgdGhpcy5fYnlJZFttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJbnNlcnQgbW9kZWxzIGludG8gdGhlIGNvbGxlY3Rpb24sIHJlLXNvcnRpbmcgaWYgbmVlZGVkLCBhbmQgdHJpZ2dlcmluZ1xuICAgICAgLy8gYGFkZGAgZXZlbnRzIHVubGVzcyBzaWxlbmNlZC5cbiAgICAgIHRoaXMubGVuZ3RoICs9IGxlbmd0aDtcbiAgICAgIGluZGV4ID0gUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuYXQpID8gXG4gICAgICAgICAgdGhpcy5tb2RlbHMubGVuZ3RoIDogb3B0aW9ucy5hdDtcbiAgICAgIHRoaXMubW9kZWxzLnNwbGljZS5hcHBseSh0aGlzLm1vZGVscywgW2luZGV4LCAwXS5jb25jYXQobW9kZWxzKSk7XG4gICAgICBpZiAodGhpcy5jb21wYXJhdG9yKSB7XG4gICAgICAgIHRoaXMuc29ydCh7c2lsZW50OiB0cnVlfSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB0aGlzLm1vZGVscy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBtb2RlbCA9IHRoaXMubW9kZWxzW2ldO1xuICAgICAgICBpZiAoY2lkc1ttb2RlbC5jaWRdKSB7XG4gICAgICAgICAgb3B0aW9ucy5pbmRleCA9IGk7XG4gICAgICAgICAgbW9kZWwudHJpZ2dlcignYWRkJywgbW9kZWwsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgbW9kZWwsIG9yIGEgbGlzdCBvZiBtb2RlbHMgZnJvbSB0aGUgc2V0LiBQYXNzIHNpbGVudCB0byBhdm9pZFxuICAgICAqIGZpcmluZyB0aGUgPGNvZGU+cmVtb3ZlPC9jb2RlPiBldmVudCBmb3IgZXZlcnkgbW9kZWwgcmVtb3ZlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZGVscyBUaGUgbW9kZWwgb3IgbGlzdCBvZiBtb2RlbHMgdG8gcmVtb3ZlIGZyb20gdGhlXG4gICAgICogICBjb2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6IDx1bD5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyB0aGUgYHJlbW92ZWAgZXZlbnQuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIGksIGwsIGluZGV4LCBtb2RlbDtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgbW9kZWxzID0gXy5pc0FycmF5KG1vZGVscykgPyBtb2RlbHMuc2xpY2UoKSA6IFttb2RlbHNdO1xuICAgICAgZm9yIChpID0gMCwgbCA9IG1vZGVscy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgbW9kZWwgPSB0aGlzLmdldEJ5Q2lkKG1vZGVsc1tpXSkgfHwgdGhpcy5nZXQobW9kZWxzW2ldKTtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ieUlkW21vZGVsLmlkXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2J5Q2lkW21vZGVsLmNpZF07XG4gICAgICAgIGluZGV4ID0gdGhpcy5pbmRleE9mKG1vZGVsKTtcbiAgICAgICAgdGhpcy5tb2RlbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgIG9wdGlvbnMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdyZW1vdmUnLCBtb2RlbCwgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVtb3ZlUmVmZXJlbmNlKG1vZGVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbW9kZWwgZnJvbSB0aGUgc2V0IGJ5IGlkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBUaGUgUGFyc2Ugb2JqZWN0SWQgaWRlbnRpZnlpbmcgdGhlIFBhcnNlLk9iamVjdCB0b1xuICAgICAqIGZldGNoIGZyb20gdGhpcyBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHJldHVybiBpZCAmJiB0aGlzLl9ieUlkW2lkLmlkIHx8IGlkXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIG1vZGVsIGZyb20gdGhlIHNldCBieSBjbGllbnQgaWQuXG4gICAgICogQHBhcmFtIHt9IGNpZCBUaGUgQmFja2JvbmUgY29sbGVjdGlvbiBpZCBpZGVudGlmeWluZyB0aGUgUGFyc2UuT2JqZWN0IHRvXG4gICAgICogZmV0Y2ggZnJvbSB0aGlzIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgZ2V0QnlDaWQ6IGZ1bmN0aW9uKGNpZCkge1xuICAgICAgcmV0dXJuIGNpZCAmJiB0aGlzLl9ieUNpZFtjaWQuY2lkIHx8IGNpZF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG1vZGVsIGF0IHRoZSBnaXZlbiBpbmRleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG1vZGVsIHRvIHJldHVybi5cbiAgICAgKi9cbiAgICBhdDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZGVsc1tpbmRleF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZvcmNlcyB0aGUgY29sbGVjdGlvbiB0byByZS1zb3J0IGl0c2VsZi4gWW91IGRvbid0IG5lZWQgdG8gY2FsbCB0aGlzXG4gICAgICogdW5kZXIgbm9ybWFsIGNpcmN1bXN0YW5jZXMsIGFzIHRoZSBzZXQgd2lsbCBtYWludGFpbiBzb3J0IG9yZGVyIGFzIGVhY2hcbiAgICAgKiBpdGVtIGlzIGFkZGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6IDx1bD5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyB0aGUgYHJlc2V0YCBldmVudC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIHNvcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgaWYgKCF0aGlzLmNvbXBhcmF0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc29ydCBhIHNldCB3aXRob3V0IGEgY29tcGFyYXRvcicpO1xuICAgICAgfVxuICAgICAgdmFyIGJvdW5kQ29tcGFyYXRvciA9IF8uYmluZCh0aGlzLmNvbXBhcmF0b3IsIHRoaXMpO1xuICAgICAgaWYgKHRoaXMuY29tcGFyYXRvci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5tb2RlbHMgPSB0aGlzLnNvcnRCeShib3VuZENvbXBhcmF0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb2RlbHMuc29ydChib3VuZENvbXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3Jlc2V0JywgdGhpcywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUGx1Y2tzIGFuIGF0dHJpYnV0ZSBmcm9tIGVhY2ggbW9kZWwgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgVGhlIGF0dHJpYnV0ZSB0byByZXR1cm4gZnJvbSBlYWNoIG1vZGVsIGluIHRoZVxuICAgICAqIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgcGx1Y2s6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBfLm1hcCh0aGlzLm1vZGVscywgZnVuY3Rpb24obW9kZWwpeyByZXR1cm4gbW9kZWwuZ2V0KGF0dHIpOyB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogV2hlbiB5b3UgaGF2ZSBtb3JlIGl0ZW1zIHRoYW4geW91IHdhbnQgdG8gYWRkIG9yIHJlbW92ZSBpbmRpdmlkdWFsbHksXG4gICAgICogeW91IGNhbiByZXNldCB0aGUgZW50aXJlIHNldCB3aXRoIGEgbmV3IGxpc3Qgb2YgbW9kZWxzLCB3aXRob3V0IGZpcmluZ1xuICAgICAqIGFueSBgYWRkYCBvciBgcmVtb3ZlYCBldmVudHMuIEZpcmVzIGByZXNldGAgd2hlbiBmaW5pc2hlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZGVscyBUaGUgbW9kZWwgb3IgbGlzdCBvZiBtb2RlbHMgdG8gcmVtb3ZlIGZyb20gdGhlXG4gICAgICogICBjb2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6IDx1bD5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyB0aGUgYHJlc2V0YCBldmVudC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIG1vZGVscyA9IG1vZGVscyB8fCBbXTtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLm1vZGVscywgZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgc2VsZi5fcmVtb3ZlUmVmZXJlbmNlKG1vZGVsKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgIHRoaXMuYWRkKG1vZGVscywge3NpbGVudDogdHJ1ZSwgcGFyc2U6IG9wdGlvbnMucGFyc2V9KTtcbiAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdyZXNldCcsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGRlZmF1bHQgc2V0IG9mIG1vZGVscyBmb3IgdGhpcyBjb2xsZWN0aW9uLCByZXNldHRpbmcgdGhlXG4gICAgICogY29sbGVjdGlvbiB3aGVuIHRoZXkgYXJyaXZlLiBJZiBgYWRkOiB0cnVlYCBpcyBwYXNzZWQsIGFwcGVuZHMgdGhlXG4gICAgICogbW9kZWxzIHRvIHRoZSBjb2xsZWN0aW9uIGluc3RlYWQgb2YgcmVzZXR0aW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+c2lsZW50OiBTZXQgdG8gdHJ1ZSB0byBhdm9pZCBmaXJpbmcgYGFkZGAgb3IgYHJlc2V0YCBldmVudHMgZm9yXG4gICAgICogICBtb2RlbHMgZmV0Y2hlZCBieSB0aGlzIGZldGNoLlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIHVzZXMgdGhlIE1hc3RlciBLZXkgZm9yXG4gICAgICogICAgICAgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyc2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRpb25zLnBhcnNlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcztcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnkgfHwgbmV3IFBhcnNlLlF1ZXJ5KHRoaXMubW9kZWwpO1xuICAgICAgcmV0dXJuIHF1ZXJ5LmZpbmQoe1xuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYWRkKSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5hZGQocmVzdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5yZXNldChyZXN1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGEgbW9kZWwgaW4gdGhpcyBjb2xsZWN0aW9uLiBBZGQgdGhlIG1vZGVsIHRvXG4gICAgICogdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHksIHVubGVzcyBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCBpbiB3aGljaCBjYXNlXG4gICAgICogd2Ugd2FpdCBmb3IgdGhlIHNlcnZlciB0byBhZ3JlZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGFyc2UuT2JqZWN0fSBtb2RlbCBUaGUgbmV3IG1vZGVsIHRvIGNyZWF0ZSBhbmQgYWRkIHRvIHRoZVxuICAgICAqICAgY29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT53YWl0OiBTZXQgdG8gdHJ1ZSB0byB3YWl0IGZvciB0aGUgc2VydmVyIHRvIGNvbmZpcm0gY3JlYXRpb24gb2YgdGhlXG4gICAgICogICAgICAgbW9kZWwgYmVmb3JlIGFkZGluZyBpdCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyBhbiBgYWRkYCBldmVudC5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCB1c2VzIHRoZSBNYXN0ZXIgS2V5IGZvclxuICAgICAqICAgICAgIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIGNyZWF0ZTogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBjb2xsID0gdGhpcztcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zID8gXy5jbG9uZShvcHRpb25zKSA6IHt9O1xuICAgICAgbW9kZWwgPSB0aGlzLl9wcmVwYXJlTW9kZWwobW9kZWwsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIW9wdGlvbnMud2FpdCkge1xuICAgICAgICBjb2xsLmFkZChtb2RlbCwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICB2YXIgc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2VzcztcbiAgICAgIG9wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG5leHRNb2RlbCwgcmVzcCwgeGhyKSB7XG4gICAgICAgIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICAgICAgICBjb2xsLmFkZChuZXh0TW9kZWwsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgICAgc3VjY2VzcyhuZXh0TW9kZWwsIHJlc3ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHRNb2RlbC50cmlnZ2VyKCdzeW5jJywgbW9kZWwsIHJlc3AsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgbW9kZWwuc2F2ZShudWxsLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSByZXNwb25zZSBpbnRvIGEgbGlzdCBvZiBtb2RlbHMgdG8gYmUgYWRkZWQgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gaXMganVzdCB0byBwYXNzIGl0IHRocm91Z2guXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbihyZXNwLCB4aHIpIHtcbiAgICAgIHJldHVybiByZXNwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcm94eSB0byBfJ3MgY2hhaW4uIENhbid0IGJlIHByb3hpZWQgdGhlIHNhbWUgd2F5IHRoZSByZXN0IG9mIHRoZVxuICAgICAqIHVuZGVyc2NvcmUgbWV0aG9kcyBhcmUgcHJveGllZCBiZWNhdXNlIGl0IHJlbGllcyBvbiB0aGUgdW5kZXJzY29yZVxuICAgICAqIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfKHRoaXMubW9kZWxzKS5jaGFpbigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXNldCBhbGwgaW50ZXJuYWwgc3RhdGUuIENhbGxlZCB3aGVuIHRoZSBjb2xsZWN0aW9uIGlzIHJlc2V0LlxuICAgICAqL1xuICAgIF9yZXNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgdGhpcy5tb2RlbHMgPSBbXTtcbiAgICAgIHRoaXMuX2J5SWQgID0ge307XG4gICAgICB0aGlzLl9ieUNpZCA9IHt9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcmVwYXJlIGEgbW9kZWwgb3IgaGFzaCBvZiBhdHRyaWJ1dGVzIHRvIGJlIGFkZGVkIHRvIHRoaXMgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBfcHJlcGFyZU1vZGVsOiBmdW5jdGlvbihtb2RlbCwgb3B0aW9ucykge1xuICAgICAgaWYgKCEobW9kZWwgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpKSB7XG4gICAgICAgIHZhciBhdHRycyA9IG1vZGVsO1xuICAgICAgICBvcHRpb25zLmNvbGxlY3Rpb24gPSB0aGlzO1xuICAgICAgICBtb2RlbCA9IG5ldyB0aGlzLm1vZGVsKGF0dHJzLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKCFtb2RlbC5fdmFsaWRhdGUobW9kZWwuYXR0cmlidXRlcywgb3B0aW9ucykpIHtcbiAgICAgICAgICBtb2RlbCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFtb2RlbC5jb2xsZWN0aW9uKSB7XG4gICAgICAgIG1vZGVsLmNvbGxlY3Rpb24gPSB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gcmVtb3ZlIGEgbW9kZWwncyB0aWVzIHRvIGEgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBfcmVtb3ZlUmVmZXJlbmNlOiBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgaWYgKHRoaXMgPT09IG1vZGVsLmNvbGxlY3Rpb24pIHtcbiAgICAgICAgZGVsZXRlIG1vZGVsLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICBtb2RlbC5vZmYoJ2FsbCcsIHRoaXMuX29uTW9kZWxFdmVudCwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCBjYWxsZWQgZXZlcnkgdGltZSBhIG1vZGVsIGluIHRoZSBzZXQgZmlyZXMgYW4gZXZlbnQuXG4gICAgICogU2V0cyBuZWVkIHRvIHVwZGF0ZSB0aGVpciBpbmRleGVzIHdoZW4gbW9kZWxzIGNoYW5nZSBpZHMuIEFsbCBvdGhlclxuICAgICAqIGV2ZW50cyBzaW1wbHkgcHJveHkgdGhyb3VnaC4gXCJhZGRcIiBhbmQgXCJyZW1vdmVcIiBldmVudHMgdGhhdCBvcmlnaW5hdGVcbiAgICAgKiBpbiBvdGhlciBjb2xsZWN0aW9ucyBhcmUgaWdub3JlZC5cbiAgICAgKi9cbiAgICBfb25Nb2RlbEV2ZW50OiBmdW5jdGlvbihldiwgbW9kZWwsIGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICAgIGlmICgoZXYgPT09ICdhZGQnIHx8IGV2ID09PSAncmVtb3ZlJykgJiYgY29sbGVjdGlvbiAhPT0gdGhpcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZXYgPT09ICdkZXN0cm95Jykge1xuICAgICAgICB0aGlzLnJlbW92ZShtb2RlbCwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwgJiYgZXYgPT09ICdjaGFuZ2U6b2JqZWN0SWQnKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ieUlkW21vZGVsLnByZXZpb3VzKFwib2JqZWN0SWRcIildO1xuICAgICAgICB0aGlzLl9ieUlkW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgICAgfVxuICAgICAgdGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8vIFVuZGVyc2NvcmUgbWV0aG9kcyB0aGF0IHdlIHdhbnQgdG8gaW1wbGVtZW50IG9uIHRoZSBDb2xsZWN0aW9uLlxuICB2YXIgbWV0aG9kcyA9IFsnZm9yRWFjaCcsICdlYWNoJywgJ21hcCcsICdyZWR1Y2UnLCAncmVkdWNlUmlnaHQnLCAnZmluZCcsXG4gICAgJ2RldGVjdCcsICdmaWx0ZXInLCAnc2VsZWN0JywgJ3JlamVjdCcsICdldmVyeScsICdhbGwnLCAnc29tZScsICdhbnknLFxuICAgICdpbmNsdWRlJywgJ2NvbnRhaW5zJywgJ2ludm9rZScsICdtYXgnLCAnbWluJywgJ3NvcnRCeScsICdzb3J0ZWRJbmRleCcsXG4gICAgJ3RvQXJyYXknLCAnc2l6ZScsICdmaXJzdCcsICdpbml0aWFsJywgJ3Jlc3QnLCAnbGFzdCcsICd3aXRob3V0JywgJ2luZGV4T2YnLFxuICAgICdzaHVmZmxlJywgJ2xhc3RJbmRleE9mJywgJ2lzRW1wdHknLCAnZ3JvdXBCeSddO1xuXG4gIC8vIE1peCBpbiBlYWNoIFVuZGVyc2NvcmUgbWV0aG9kIGFzIGEgcHJveHkgdG8gYENvbGxlY3Rpb24jbW9kZWxzYC5cbiAgUGFyc2UuX2FycmF5RWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBQYXJzZS5Db2xsZWN0aW9uLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX1ttZXRob2RdLmFwcGx5KF8sIFt0aGlzLm1vZGVsc10uY29uY2F0KF8udG9BcnJheShhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgc3ViY2xhc3Mgb2YgPGNvZGU+UGFyc2UuQ29sbGVjdGlvbjwvY29kZT4uICBGb3IgZXhhbXBsZSw8cHJlPlxuICAgKiAgIHZhciBNeUNvbGxlY3Rpb24gPSBQYXJzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAqICAgICAvLyBJbnN0YW5jZSBwcm9wZXJ0aWVzXG4gICAqXG4gICAqICAgICBtb2RlbDogTXlDbGFzcyxcbiAgICogICAgIHF1ZXJ5OiBNeVF1ZXJ5LFxuICAgKlxuICAgKiAgICAgZ2V0Rmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICByZXR1cm4gdGhpcy5hdCgwKTtcbiAgICogICAgIH1cbiAgICogICB9LCB7XG4gICAqICAgICAvLyBDbGFzcyBwcm9wZXJ0aWVzXG4gICAqXG4gICAqICAgICBtYWtlT25lOiBmdW5jdGlvbigpIHtcbiAgICogICAgICAgcmV0dXJuIG5ldyBNeUNvbGxlY3Rpb24oKTtcbiAgICogICAgIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogICB2YXIgY29sbGVjdGlvbiA9IG5ldyBNeUNvbGxlY3Rpb24oKTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VQcm9wcyBJbnN0YW5jZSBwcm9wZXJ0aWVzIGZvciB0aGUgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsYXNzUHJvcHMgQ2xhc3MgcHJvcGVyaWVzIGZvciB0aGUgY29sbGVjdGlvbi5cbiAgICogQHJldHVybiB7Q2xhc3N9IEEgbmV3IHN1YmNsYXNzIG9mIDxjb2RlPlBhcnNlLkNvbGxlY3Rpb248L2NvZGU+LlxuICAgKi9cbiAgUGFyc2UuQ29sbGVjdGlvbi5leHRlbmQgPSBQYXJzZS5fZXh0ZW5kO1xuXG59KHRoaXMpKTtcblxuLypnbG9iYWwgXzogZmFsc2UsIGRvY3VtZW50OiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ3JlYXRpbmcgYSBQYXJzZS5WaWV3IGNyZWF0ZXMgaXRzIGluaXRpYWwgZWxlbWVudCBvdXRzaWRlIG9mIHRoZSBET00sXG4gICAqIGlmIGFuIGV4aXN0aW5nIGVsZW1lbnQgaXMgbm90IHByb3ZpZGVkLi4uXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5BIGZvcmsgb2YgQmFja2JvbmUuVmlldywgcHJvdmlkZWQgZm9yIHlvdXIgY29udmVuaWVuY2UuICBJZiB5b3UgdXNlIHRoaXNcbiAgICogY2xhc3MsIHlvdSBtdXN0IGFsc28gaW5jbHVkZSBqUXVlcnksIG9yIGFub3RoZXIgbGlicmFyeSB0aGF0IHByb3ZpZGVzIGFcbiAgICogalF1ZXJ5LWNvbXBhdGlibGUgJCBmdW5jdGlvbi4gIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlXG4gICAqIDxhIGhyZWY9XCJodHRwOi8vZG9jdW1lbnRjbG91ZC5naXRodWIuY29tL2JhY2tib25lLyNWaWV3XCI+QmFja2JvbmVcbiAgICogZG9jdW1lbnRhdGlvbjwvYT4uPC9wPlxuICAgKiA8cD48c3Ryb25nPjxlbT5BdmFpbGFibGUgaW4gdGhlIGNsaWVudCBTREsgb25seS48L2VtPjwvc3Ryb25nPjwvcD5cbiAgICovXG4gIFBhcnNlLlZpZXcgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5jaWQgPSBfLnVuaXF1ZUlkKCd2aWV3Jyk7XG4gICAgdGhpcy5fY29uZmlndXJlKG9wdGlvbnMgfHwge30pO1xuICAgIHRoaXMuX2Vuc3VyZUVsZW1lbnQoKTtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG4gIH07XG5cbiAgLy8gQ2FjaGVkIHJlZ2V4IHRvIHNwbGl0IGtleXMgZm9yIGBkZWxlZ2F0ZWAuXG4gIHZhciBldmVudFNwbGl0dGVyID0gL14oXFxTKylcXHMqKC4qKSQvO1xuXG4gIC8vIExpc3Qgb2YgdmlldyBvcHRpb25zIHRvIGJlIG1lcmdlZCBhcyBwcm9wZXJ0aWVzLlxuICAvLyBUT0RPOiBpbmNsdWRlIG9iamVjdElkLCBjcmVhdGVkQXQsIHVwZGF0ZWRBdD9cbiAgdmFyIHZpZXdPcHRpb25zID0gWydtb2RlbCcsICdjb2xsZWN0aW9uJywgJ2VsJywgJ2lkJywgJ2F0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzTmFtZScsICd0YWdOYW1lJ107XG5cbiAgLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKlBhcnNlLlZpZXcqKiBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuICBfLmV4dGVuZChQYXJzZS5WaWV3LnByb3RvdHlwZSwgUGFyc2UuRXZlbnRzLFxuICAgICAgICAgICAvKiogQGxlbmRzIFBhcnNlLlZpZXcucHJvdG90eXBlICovIHtcblxuICAgIC8vIFRoZSBkZWZhdWx0IGB0YWdOYW1lYCBvZiBhIFZpZXcncyBlbGVtZW50IGlzIGBcImRpdlwiYC5cbiAgICB0YWdOYW1lOiAnZGl2JyxcblxuICAgIC8qKlxuICAgICAqIGpRdWVyeSBkZWxlZ2F0ZSBmb3IgZWxlbWVudCBsb29rdXAsIHNjb3BlZCB0byBET00gZWxlbWVudHMgd2l0aGluIHRoZVxuICAgICAqIGN1cnJlbnQgdmlldy4gVGhpcyBzaG91bGQgYmUgcHJlZmVyZWQgdG8gZ2xvYmFsIGxvb2t1cHMgd2hlcmUgcG9zc2libGUuXG4gICAgICovXG4gICAgJDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbC5maW5kKHNlbGVjdG9yKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBpcyBhbiBlbXB0eSBmdW5jdGlvbiBieSBkZWZhdWx0LiBPdmVycmlkZSBpdCB3aXRoIHlvdXIgb3duXG4gICAgICogaW5pdGlhbGl6YXRpb24gbG9naWMuXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXt9LFxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvcmUgZnVuY3Rpb24gdGhhdCB5b3VyIHZpZXcgc2hvdWxkIG92ZXJyaWRlLCBpbiBvcmRlclxuICAgICAqIHRvIHBvcHVsYXRlIGl0cyBlbGVtZW50IChgdGhpcy5lbGApLCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBIVE1MLiBUaGVcbiAgICAgKiBjb252ZW50aW9uIGlzIGZvciAqKnJlbmRlcioqIHRvIGFsd2F5cyByZXR1cm4gYHRoaXNgLlxuICAgICAqL1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoaXMgdmlldyBmcm9tIHRoZSBET00uIE5vdGUgdGhhdCB0aGUgdmlldyBpc24ndCBwcmVzZW50IGluIHRoZVxuICAgICAqIERPTSBieSBkZWZhdWx0LCBzbyBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSBiZSBhIG5vLW9wLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGb3Igc21hbGwgYW1vdW50cyBvZiBET00gRWxlbWVudHMsIHdoZXJlIGEgZnVsbC1ibG93biB0ZW1wbGF0ZSBpc24ndFxuICAgICAqIG5lZWRlZCwgdXNlICoqbWFrZSoqIHRvIG1hbnVmYWN0dXJlIGVsZW1lbnRzLCBvbmUgYXQgYSB0aW1lLlxuICAgICAqIDxwcmU+XG4gICAgICogICAgIHZhciBlbCA9IHRoaXMubWFrZSgnbGknLCB7J2NsYXNzJzogJ3Jvdyd9LFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5lc2NhcGUoJ3RpdGxlJykpOzwvcHJlPlxuICAgICAqL1xuICAgIG1ha2U6IGZ1bmN0aW9uKHRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNvbnRlbnQpIHtcbiAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICBQYXJzZS4kKGVsKS5hdHRyKGF0dHJpYnV0ZXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgUGFyc2UuJChlbCkuaHRtbChjb250ZW50KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlcyB0aGUgdmlldydzIGVsZW1lbnQgKGB0aGlzLmVsYCBwcm9wZXJ0eSksIGluY2x1ZGluZyBldmVudFxuICAgICAqIHJlLWRlbGVnYXRpb24uXG4gICAgICovXG4gICAgc2V0RWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCwgZGVsZWdhdGUpIHtcbiAgICAgIHRoaXMuJGVsID0gUGFyc2UuJChlbGVtZW50KTtcbiAgICAgIHRoaXMuZWwgPSB0aGlzLiRlbFswXTtcbiAgICAgIGlmIChkZWxlZ2F0ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBjYWxsYmFja3MuICA8Y29kZT50aGlzLmV2ZW50czwvY29kZT4gaXMgYSBoYXNoIG9mXG4gICAgICogPHByZT5cbiAgICAgKiAqe1wiZXZlbnQgc2VsZWN0b3JcIjogXCJjYWxsYmFja1wifSpcbiAgICAgKlxuICAgICAqICAgICB7XG4gICAgICogICAgICAgJ21vdXNlZG93biAudGl0bGUnOiAgJ2VkaXQnLFxuICAgICAqICAgICAgICdjbGljayAuYnV0dG9uJzogICAgICdzYXZlJ1xuICAgICAqICAgICAgICdjbGljayAub3Blbic6ICAgICAgIGZ1bmN0aW9uKGUpIHsgLi4uIH1cbiAgICAgKiAgICAgfVxuICAgICAqIDwvcHJlPlxuICAgICAqIHBhaXJzLiBDYWxsYmFja3Mgd2lsbCBiZSBib3VuZCB0byB0aGUgdmlldywgd2l0aCBgdGhpc2Agc2V0IHByb3Blcmx5LlxuICAgICAqIFVzZXMgZXZlbnQgZGVsZWdhdGlvbiBmb3IgZWZmaWNpZW5jeS5cbiAgICAgKiBPbWl0dGluZyB0aGUgc2VsZWN0b3IgYmluZHMgdGhlIGV2ZW50IHRvIGB0aGlzLmVsYC5cbiAgICAgKiBUaGlzIG9ubHkgd29ya3MgZm9yIGRlbGVnYXRlLWFibGUgZXZlbnRzOiBub3QgYGZvY3VzYCwgYGJsdXJgLCBhbmRcbiAgICAgKiBub3QgYGNoYW5nZWAsIGBzdWJtaXRgLCBhbmQgYHJlc2V0YCBpbiBJbnRlcm5ldCBFeHBsb3Jlci5cbiAgICAgKi9cbiAgICBkZWxlZ2F0ZUV2ZW50czogZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgICBldmVudHMgPSBldmVudHMgfHwgUGFyc2UuX2dldFZhbHVlKHRoaXMsICdldmVudHMnKTtcbiAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goZXZlbnRzLCBmdW5jdGlvbihtZXRob2QsIGtleSkge1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihtZXRob2QpKSB7XG4gICAgICAgICAgbWV0aG9kID0gc2VsZltldmVudHNba2V5XV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtZXRob2QpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IFwiJyArIGV2ZW50c1trZXldICsgJ1wiIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKGV2ZW50U3BsaXR0ZXIpO1xuICAgICAgICB2YXIgZXZlbnROYW1lID0gbWF0Y2hbMV0sIHNlbGVjdG9yID0gbWF0Y2hbMl07XG4gICAgICAgIG1ldGhvZCA9IF8uYmluZChtZXRob2QsIHNlbGYpO1xuICAgICAgICBldmVudE5hbWUgKz0gJy5kZWxlZ2F0ZUV2ZW50cycgKyBzZWxmLmNpZDtcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSAnJykge1xuICAgICAgICAgIHNlbGYuJGVsLmJpbmQoZXZlbnROYW1lLCBtZXRob2QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuJGVsLmRlbGVnYXRlKHNlbGVjdG9yLCBldmVudE5hbWUsIG1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgYWxsIGNhbGxiYWNrcyBwcmV2aW91c2x5IGJvdW5kIHRvIHRoZSB2aWV3IHdpdGggYGRlbGVnYXRlRXZlbnRzYC5cbiAgICAgKiBZb3UgdXN1YWxseSBkb24ndCBuZWVkIHRvIHVzZSB0aGlzLCBidXQgbWF5IHdpc2ggdG8gaWYgeW91IGhhdmUgbXVsdGlwbGVcbiAgICAgKiBCYWNrYm9uZSB2aWV3cyBhdHRhY2hlZCB0byB0aGUgc2FtZSBET00gZWxlbWVudC5cbiAgICAgKi9cbiAgICB1bmRlbGVnYXRlRXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLnVuYmluZCgnLmRlbGVnYXRlRXZlbnRzJyArIHRoaXMuY2lkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgdGhlIGluaXRpYWwgY29uZmlndXJhdGlvbiBvZiBhIFZpZXcgd2l0aCBhIHNldCBvZiBvcHRpb25zLlxuICAgICAqIEtleXMgd2l0aCBzcGVjaWFsIG1lYW5pbmcgKihtb2RlbCwgY29sbGVjdGlvbiwgaWQsIGNsYXNzTmFtZSkqLCBhcmVcbiAgICAgKiBhdHRhY2hlZCBkaXJlY3RseSB0byB0aGUgdmlldy5cbiAgICAgKi9cbiAgICBfY29uZmlndXJlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIF8uZWFjaCh2aWV3T3B0aW9ucywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICBpZiAob3B0aW9uc1thdHRyXSkge1xuICAgICAgICAgIHNlbGZbYXR0cl0gPSBvcHRpb25zW2F0dHJdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEVuc3VyZSB0aGF0IHRoZSBWaWV3IGhhcyBhIERPTSBlbGVtZW50IHRvIHJlbmRlciBpbnRvLlxuICAgICAqIElmIGB0aGlzLmVsYCBpcyBhIHN0cmluZywgcGFzcyBpdCB0aHJvdWdoIGAkKClgLCB0YWtlIHRoZSBmaXJzdFxuICAgICAqIG1hdGNoaW5nIGVsZW1lbnQsIGFuZCByZS1hc3NpZ24gaXQgdG8gYGVsYC4gT3RoZXJ3aXNlLCBjcmVhdGVcbiAgICAgKiBhbiBlbGVtZW50IGZyb20gdGhlIGBpZGAsIGBjbGFzc05hbWVgIGFuZCBgdGFnTmFtZWAgcHJvcGVydGllcy5cbiAgICAgKi9cbiAgICBfZW5zdXJlRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuZWwpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gUGFyc2UuX2dldFZhbHVlKHRoaXMsICdhdHRyaWJ1dGVzJykgfHwge307XG4gICAgICAgIGlmICh0aGlzLmlkKSB7XG4gICAgICAgICAgYXR0cnMuaWQgPSB0aGlzLmlkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNsYXNzTmFtZSkge1xuICAgICAgICAgIGF0dHJzWydjbGFzcyddID0gdGhpcy5jbGFzc05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMubWFrZSh0aGlzLnRhZ05hbWUsIGF0dHJzKSwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuZWwsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VQcm9wcyBJbnN0YW5jZSBwcm9wZXJ0aWVzIGZvciB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsYXNzUHJvcHMgQ2xhc3MgcHJvcGVyaWVzIGZvciB0aGUgdmlldy5cbiAgICogQHJldHVybiB7Q2xhc3N9IEEgbmV3IHN1YmNsYXNzIG9mIDxjb2RlPlBhcnNlLlZpZXc8L2NvZGU+LlxuICAgKi9cbiAgUGFyc2UuVmlldy5leHRlbmQgPSBQYXJzZS5fZXh0ZW5kO1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkEgUGFyc2UuVXNlciBvYmplY3QgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBhIHVzZXIgcGVyc2lzdGVkIHRvIHRoZVxuICAgKiBQYXJzZSBjbG91ZC4gVGhpcyBjbGFzcyBpcyBhIHN1YmNsYXNzIG9mIGEgUGFyc2UuT2JqZWN0LCBhbmQgcmV0YWlucyB0aGVcbiAgICogc2FtZSBmdW5jdGlvbmFsaXR5IG9mIGEgUGFyc2UuT2JqZWN0LCBidXQgYWxzbyBleHRlbmRzIGl0IHdpdGggdmFyaW91c1xuICAgKiB1c2VyIHNwZWNpZmljIG1ldGhvZHMsIGxpa2UgYXV0aGVudGljYXRpb24sIHNpZ25pbmcgdXAsIGFuZCB2YWxpZGF0aW9uIG9mXG4gICAqIHVuaXF1ZW5lc3MuPC9wPlxuICAgKi9cbiAgUGFyc2UuVXNlciA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJfVXNlclwiLCAvKiogQGxlbmRzIFBhcnNlLlVzZXIucHJvdG90eXBlICovIHtcbiAgICAvLyBJbnN0YW5jZSBWYXJpYWJsZXNcbiAgICBfaXNDdXJyZW50VXNlcjogZmFsc2UsXG5cblxuICAgIC8vIEluc3RhbmNlIE1ldGhvZHNcbiAgICBcbiAgICAvKipcbiAgICAgKiBNZXJnZXMgYW5vdGhlciBvYmplY3QncyBhdHRyaWJ1dGVzIGludG8gdGhpcyBvYmplY3QuXG4gICAgICovXG4gICAgX21lcmdlRnJvbU9iamVjdDogZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIGlmIChvdGhlci5nZXRTZXNzaW9uVG9rZW4oKSkge1xuICAgICAgICB0aGlzLl9zZXNzaW9uVG9rZW4gPSBvdGhlci5nZXRTZXNzaW9uVG9rZW4oKTsgICAgICBcbiAgICAgIH0gICAgXG4gICAgICBQYXJzZS5Vc2VyLl9fc3VwZXJfXy5fbWVyZ2VGcm9tT2JqZWN0LmNhbGwodGhpcywgb3RoZXIpO1xuICAgIH0sICAgIFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRvIGhhbmRsZSBzcGVjaWFsIGZpZWxkcyBpbiBhIF9Vc2VyIHJlc3BvbnNlLlxuICAgICAqL1xuICAgIF9tZXJnZU1hZ2ljRmllbGRzOiBmdW5jdGlvbihhdHRycykge1xuICAgICAgaWYgKGF0dHJzLnNlc3Npb25Ub2tlbikge1xuICAgICAgICB0aGlzLl9zZXNzaW9uVG9rZW4gPSBhdHRycy5zZXNzaW9uVG9rZW47XG4gICAgICAgIGRlbGV0ZSBhdHRycy5zZXNzaW9uVG9rZW47XG4gICAgICB9XG4gICAgICBQYXJzZS5Vc2VyLl9fc3VwZXJfXy5fbWVyZ2VNYWdpY0ZpZWxkcy5jYWxsKHRoaXMsIGF0dHJzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBudWxsIHZhbHVlcyBmcm9tIGF1dGhEYXRhICh3aGljaCBleGlzdCB0ZW1wb3JhcmlseSBmb3JcbiAgICAgKiB1bmxpbmtpbmcpXG4gICAgICovXG4gICAgX2NsZWFudXBBdXRoRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGF1dGhEYXRhID0gdGhpcy5nZXQoJ2F1dGhEYXRhJyk7XG4gICAgICBpZiAoIWF1dGhEYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuZ2V0KCdhdXRoRGF0YScpLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICghYXV0aERhdGFba2V5XSkge1xuICAgICAgICAgIGRlbGV0ZSBhdXRoRGF0YVtrZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemVzIGF1dGhEYXRhIGZvciBhbGwgcHJvdmlkZXJzLlxuICAgICAqL1xuICAgIF9zeW5jaHJvbml6ZUFsbEF1dGhEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpO1xuICAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuZ2V0KCdhdXRoRGF0YScpLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHNlbGYuX3N5bmNocm9uaXplQXV0aERhdGEoa2V5KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZXMgYXV0aCBkYXRhIGZvciBhIHByb3ZpZGVyIChlLmcuIHB1dHMgdGhlIGFjY2VzcyB0b2tlbiBpbiB0aGVcbiAgICAgKiByaWdodCBwbGFjZSB0byBiZSB1c2VkIGJ5IHRoZSBGYWNlYm9vayBTREspLlxuICAgICAqL1xuICAgIF9zeW5jaHJvbml6ZUF1dGhEYXRhOiBmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgaWYgKCF0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhdXRoVHlwZTtcbiAgICAgIGlmIChfLmlzU3RyaW5nKHByb3ZpZGVyKSkge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyO1xuICAgICAgICBwcm92aWRlciA9IFBhcnNlLlVzZXIuX2F1dGhQcm92aWRlcnNbYXV0aFR5cGVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlci5nZXRBdXRoVHlwZSgpO1xuICAgICAgfVxuICAgICAgdmFyIGF1dGhEYXRhID0gdGhpcy5nZXQoJ2F1dGhEYXRhJyk7XG4gICAgICBpZiAoIWF1dGhEYXRhIHx8ICFwcm92aWRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc3VjY2VzcyA9IHByb3ZpZGVyLnJlc3RvcmVBdXRoZW50aWNhdGlvbihhdXRoRGF0YVthdXRoVHlwZV0pO1xuICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgIHRoaXMuX3VubGlua0Zyb20ocHJvdmlkZXIpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlU2F2ZVJlc3VsdDogZnVuY3Rpb24obWFrZUN1cnJlbnQpIHtcbiAgICAgIC8vIENsZWFuIHVwIGFuZCBzeW5jaHJvbml6ZSB0aGUgYXV0aERhdGEgb2JqZWN0LCByZW1vdmluZyBhbnkgdW5zZXQgdmFsdWVzXG4gICAgICBpZiAobWFrZUN1cnJlbnQpIHtcbiAgICAgICAgdGhpcy5faXNDdXJyZW50VXNlciA9IHRydWU7XG4gICAgICB9XG4gICAgICB0aGlzLl9jbGVhbnVwQXV0aERhdGEoKTtcbiAgICAgIHRoaXMuX3N5bmNocm9uaXplQWxsQXV0aERhdGEoKTtcbiAgICAgIC8vIERvbid0IGtlZXAgdGhlIHBhc3N3b3JkIGFyb3VuZC5cbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2ZXJEYXRhLnBhc3N3b3JkO1xuICAgICAgdGhpcy5fcmVidWlsZEVzdGltYXRlZERhdGFGb3JLZXkoXCJwYXNzd29yZFwiKTtcbiAgICAgIHRoaXMuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgaWYgKG1ha2VDdXJyZW50IHx8IHRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgUGFyc2UuVXNlci5fc2F2ZUN1cnJlbnRVc2VyKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmxpa2UgaW4gdGhlIEFuZHJvaWQvaU9TIFNES3MsIGxvZ0luV2l0aCBpcyB1bm5lY2Vzc2FyeSwgc2luY2UgeW91IGNhblxuICAgICAqIGNhbGwgbGlua1dpdGggb24gdGhlIHVzZXIgKGV2ZW4gaWYgaXQgZG9lc24ndCBleGlzdCB5ZXQgb24gdGhlIHNlcnZlcikuXG4gICAgICovXG4gICAgX2xpbmtXaXRoOiBmdW5jdGlvbihwcm92aWRlciwgb3B0aW9ucykge1xuICAgICAgdmFyIGF1dGhUeXBlO1xuICAgICAgaWYgKF8uaXNTdHJpbmcocHJvdmlkZXIpKSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXI7XG4gICAgICAgIHByb3ZpZGVyID0gUGFyc2UuVXNlci5fYXV0aFByb3ZpZGVyc1twcm92aWRlcl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyLmdldEF1dGhUeXBlKCk7XG4gICAgICB9XG4gICAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2F1dGhEYXRhJykpIHtcbiAgICAgICAgdmFyIGF1dGhEYXRhID0gdGhpcy5nZXQoJ2F1dGhEYXRhJykgfHwge307XG4gICAgICAgIGF1dGhEYXRhW2F1dGhUeXBlXSA9IG9wdGlvbnMuYXV0aERhdGE7XG4gICAgICAgIHRoaXMuc2V0KCdhdXRoRGF0YScsIGF1dGhEYXRhKTtcblxuICAgICAgICAvLyBPdmVycmlkZGVuIHNvIHRoYXQgdGhlIHVzZXIgY2FuIGJlIG1hZGUgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICAgIG1vZGVsLl9oYW5kbGVTYXZlUmVzdWx0KHRydWUpO1xuICAgICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZSh7J2F1dGhEYXRhJzogYXV0aERhdGF9LCBuZXdPcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgICBwcm92aWRlci5hdXRoZW50aWNhdGUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHByb3ZpZGVyLCByZXN1bHQpIHtcbiAgICAgICAgICAgIHNlbGYuX2xpbmtXaXRoKHByb3ZpZGVyLCB7XG4gICAgICAgICAgICAgIGF1dGhEYXRhOiByZXN1bHQsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IG9wdGlvbnMuc3VjY2VzcyxcbiAgICAgICAgICAgICAgZXJyb3I6IG9wdGlvbnMuZXJyb3JcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZShzZWxmKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHByb3ZpZGVyLCBlcnJvcikge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvcihzZWxmLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVubGlua3MgYSB1c2VyIGZyb20gYSBzZXJ2aWNlLlxuICAgICAqL1xuICAgIF91bmxpbmtGcm9tOiBmdW5jdGlvbihwcm92aWRlciwgb3B0aW9ucykge1xuICAgICAgdmFyIGF1dGhUeXBlO1xuICAgICAgaWYgKF8uaXNTdHJpbmcocHJvdmlkZXIpKSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXI7XG4gICAgICAgIHByb3ZpZGVyID0gUGFyc2UuVXNlci5fYXV0aFByb3ZpZGVyc1twcm92aWRlcl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyLmdldEF1dGhUeXBlKCk7XG4gICAgICB9XG4gICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucyk7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBuZXdPcHRpb25zLmF1dGhEYXRhID0gbnVsbDtcbiAgICAgIG5ld09wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIHNlbGYuX3N5bmNocm9uaXplQXV0aERhdGEocHJvdmlkZXIpO1xuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5fbGlua1dpdGgocHJvdmlkZXIsIG5ld09wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBhIHVzZXIgaXMgbGlua2VkIHRvIGEgc2VydmljZS5cbiAgICAgKi9cbiAgICBfaXNMaW5rZWQ6IGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICB2YXIgYXV0aFR5cGU7XG4gICAgICBpZiAoXy5pc1N0cmluZyhwcm92aWRlcikpIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXIuZ2V0QXV0aFR5cGUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpIHx8IHt9O1xuICAgICAgcmV0dXJuICEhYXV0aERhdGFbYXV0aFR5cGVdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZWF1dGhlbnRpY2F0ZXMgYWxsIHByb3ZpZGVycy5cbiAgICAgKi9cbiAgICBfbG9nT3V0V2l0aEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKTtcbiAgICAgIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5nZXQoJ2F1dGhEYXRhJyksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc2VsZi5fbG9nT3V0V2l0aChrZXkpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERlYXV0aGVudGljYXRlcyBhIHNpbmdsZSBwcm92aWRlciAoZS5nLiByZW1vdmluZyBhY2Nlc3MgdG9rZW5zIGZyb20gdGhlXG4gICAgICogRmFjZWJvb2sgU0RLKS5cbiAgICAgKi9cbiAgICBfbG9nT3V0V2l0aDogZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIGlmICghdGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXy5pc1N0cmluZyhwcm92aWRlcikpIHtcbiAgICAgICAgcHJvdmlkZXIgPSBQYXJzZS5Vc2VyLl9hdXRoUHJvdmlkZXJzW3Byb3ZpZGVyXTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm92aWRlciAmJiBwcm92aWRlci5kZWF1dGhlbnRpY2F0ZSkge1xuICAgICAgICBwcm92aWRlci5kZWF1dGhlbnRpY2F0ZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTaWducyB1cCBhIG5ldyB1c2VyLiBZb3Ugc2hvdWxkIGNhbGwgdGhpcyBpbnN0ZWFkIG9mIHNhdmUgZm9yXG4gICAgICogbmV3IFBhcnNlLlVzZXJzLiBUaGlzIHdpbGwgY3JlYXRlIGEgbmV3IFBhcnNlLlVzZXIgb24gdGhlIHNlcnZlciwgYW5kXG4gICAgICogYWxzbyBwZXJzaXN0IHRoZSBzZXNzaW9uIG9uIGRpc2sgc28gdGhhdCB5b3UgY2FuIGFjY2VzcyB0aGUgdXNlciB1c2luZ1xuICAgICAqIDxjb2RlPmN1cnJlbnQ8L2NvZGU+LlxuICAgICAqXG4gICAgICogPHA+QSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgbXVzdCBiZSBzZXQgYmVmb3JlIGNhbGxpbmcgc2lnblVwLjwvcD5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzIEV4dHJhIGZpZWxkcyB0byBzZXQgb24gdGhlIG5ldyB1c2VyLCBvciBudWxsLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHNpZ251cFxuICAgICAqICAgICBmaW5pc2hlcy5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIuc2lnblVwXG4gICAgICovXG4gICAgc2lnblVwOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgICAgdmFyIGVycm9yO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciB1c2VybmFtZSA9IChhdHRycyAmJiBhdHRycy51c2VybmFtZSkgfHwgdGhpcy5nZXQoXCJ1c2VybmFtZVwiKTtcbiAgICAgIGlmICghdXNlcm5hbWUgfHwgKHVzZXJuYW1lID09PSBcIlwiKSkge1xuICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgXCJDYW5ub3Qgc2lnbiB1cCB1c2VyIHdpdGggYW4gZW1wdHkgbmFtZS5cIik7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICBvcHRpb25zLmVycm9yKHRoaXMsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXNzd29yZCA9IChhdHRycyAmJiBhdHRycy5wYXNzd29yZCkgfHwgdGhpcy5nZXQoXCJwYXNzd29yZFwiKTtcbiAgICAgIGlmICghcGFzc3dvcmQgfHwgKHBhc3N3b3JkID09PSBcIlwiKSkge1xuICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgXCJDYW5ub3Qgc2lnbiB1cCB1c2VyIHdpdGggYW4gZW1wdHkgcGFzc3dvcmQuXCIpO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgb3B0aW9ucy5lcnJvcih0aGlzLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICAvLyBPdmVycmlkZGVuIHNvIHRoYXQgdGhlIHVzZXIgY2FuIGJlIG1hZGUgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKTtcbiAgICAgIG5ld09wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLl9oYW5kbGVTYXZlUmVzdWx0KHRydWUpO1xuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5zYXZlKGF0dHJzLCBuZXdPcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTG9ncyBpbiBhIFBhcnNlLlVzZXIuIE9uIHN1Y2Nlc3MsIHRoaXMgc2F2ZXMgdGhlIHNlc3Npb24gdG8gbG9jYWxTdG9yYWdlLFxuICAgICAqIHNvIHlvdSBjYW4gcmV0cmlldmUgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciB1c2luZ1xuICAgICAqIDxjb2RlPmN1cnJlbnQ8L2NvZGU+LlxuICAgICAqXG4gICAgICogPHA+QSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgbXVzdCBiZSBzZXQgYmVmb3JlIGNhbGxpbmcgbG9nSW4uPC9wPlxuICAgICAqXG4gICAgICogPHA+Q2FsbHMgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3Igb24gY29tcGxldGlvbi48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBzZWUgUGFyc2UuVXNlci5sb2dJblxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aXRoIHRoZSB1c2VyIHdoZW5cbiAgICAgKiAgICAgdGhlIGxvZ2luIGlzIGNvbXBsZXRlLlxuICAgICAqL1xuICAgIGxvZ0luOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgbW9kZWwgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwibG9naW5cIixcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBkYXRhOiB0aGlzLnRvSlNPTigpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgdmFyIHNlcnZlckF0dHJzID0gbW9kZWwucGFyc2UocmVzcCwgc3RhdHVzLCB4aHIpO1xuICAgICAgICBtb2RlbC5fZmluaXNoRmV0Y2goc2VydmVyQXR0cnMpO1xuICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdCh0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I3NhdmVcbiAgICAgKi9cbiAgICBzYXZlOiBmdW5jdGlvbihhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICB2YXIgaSwgYXR0cnMsIGN1cnJlbnQsIG9wdGlvbnMsIHNhdmVkO1xuICAgICAgaWYgKF8uaXNPYmplY3QoYXJnMSkgfHwgXy5pc051bGwoYXJnMSkgfHwgXy5pc1VuZGVmaW5lZChhcmcxKSkge1xuICAgICAgICBhdHRycyA9IGFyZzE7XG4gICAgICAgIG9wdGlvbnMgPSBhcmcyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnMgPSB7fTtcbiAgICAgICAgYXR0cnNbYXJnMV0gPSBhcmcyO1xuICAgICAgICBvcHRpb25zID0gYXJnMztcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucyk7XG4gICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdChmYWxzZSk7XG4gICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QucHJvdG90eXBlLnNhdmUuY2FsbCh0aGlzLCBhdHRycywgbmV3T3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I2ZldGNoXG4gICAgICovXG4gICAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBuZXdPcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcbiAgICAgIG5ld09wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLl9oYW5kbGVTYXZlUmVzdWx0KGZhbHNlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LnByb3RvdHlwZS5mZXRjaC5jYWxsKHRoaXMsIG5ld09wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgPGNvZGU+Y3VycmVudDwvY29kZT4gd291bGQgcmV0dXJuIHRoaXMgdXNlci5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIjY3VycmVudFxuICAgICAqL1xuICAgIGlzQ3VycmVudDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNDdXJyZW50VXNlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBnZXQoXCJ1c2VybmFtZVwiKS5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQHNlZSBQYXJzZS5PYmplY3QjZ2V0XG4gICAgICovXG4gICAgZ2V0VXNlcm5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwidXNlcm5hbWVcIik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxzIHNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lLCBvcHRpb25zKSBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdC5zZXRcbiAgICAgKi9cbiAgICBzZXRVc2VybmFtZTogZnVuY3Rpb24odXNlcm5hbWUsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbHMgc2V0KFwicGFzc3dvcmRcIiwgcGFzc3dvcmQsIG9wdGlvbnMpIGFuZCByZXR1cm5zIHRoZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0LnNldFxuICAgICAqL1xuICAgIHNldFBhc3N3b3JkOiBmdW5jdGlvbihwYXNzd29yZCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KFwicGFzc3dvcmRcIiwgcGFzc3dvcmQsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGdldChcImVtYWlsXCIpLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNnZXRcbiAgICAgKi9cbiAgICBnZXRFbWFpbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoXCJlbWFpbFwiKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbHMgc2V0KFwiZW1haWxcIiwgZW1haWwsIG9wdGlvbnMpIGFuZCByZXR1cm5zIHRoZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0LnNldFxuICAgICAqL1xuICAgIHNldEVtYWlsOiBmdW5jdGlvbihlbWFpbCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KFwiZW1haWxcIiwgZW1haWwsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGlzIHVzZXIgaXMgdGhlIGN1cnJlbnQgdXNlciBhbmQgaGFzIGJlZW4gYXV0aGVudGljYXRlZC5cbiAgICAgKiBAcmV0dXJuIChCb29sZWFuKSB3aGV0aGVyIHRoaXMgdXNlciBpcyB0aGUgY3VycmVudCB1c2VyIGFuZCBpcyBsb2dnZWQgaW4uXG4gICAgICovXG4gICAgYXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gISF0aGlzLl9zZXNzaW9uVG9rZW4gJiZcbiAgICAgICAgICAoUGFyc2UuVXNlci5jdXJyZW50KCkgJiYgUGFyc2UuVXNlci5jdXJyZW50KCkuaWQgPT09IHRoaXMuaWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZXNzaW9uIHRva2VuIGZvciB0aGlzIHVzZXIsIGlmIHRoZSB1c2VyIGhhcyBiZWVuIGxvZ2dlZCBpbixcbiAgICAgKiBvciBpZiBpdCBpcyB0aGUgcmVzdWx0IG9mIGEgcXVlcnkgd2l0aCB0aGUgbWFzdGVyIGtleS4gT3RoZXJ3aXNlLCByZXR1cm5zXG4gICAgICogdW5kZWZpbmVkLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gdGhlIHNlc3Npb24gdG9rZW4sIG9yIHVuZGVmaW5lZFxuICAgICAqL1xuICAgIGdldFNlc3Npb25Ub2tlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2Vzc2lvblRva2VuO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IGEgcmV2b2NhYmxlIHNlc3Npb24gdG9rZW4gdG8gcmVwbGFjZSB0aGUgb2xkZXIgc3R5bGUgb2YgdG9rZW4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIHJlcGxhY2VtZW50XG4gICAgICogICB0b2tlbiBoYXMgYmVlbiBmZXRjaGVkLlxuICAgICAqL1xuICAgIF91cGdyYWRlVG9SZXZvY2FibGVTZXNzaW9uOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIGlmICghUGFyc2UuVXNlci5jdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHZhciBjdXJyZW50U2Vzc2lvbiA9IFBhcnNlLlVzZXIuY3VycmVudCgpLmdldFNlc3Npb25Ub2tlbigpO1xuICAgICAgaWYgKFBhcnNlLlNlc3Npb24uX2lzUmV2b2NhYmxlKGN1cnJlbnRTZXNzaW9uKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcygpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6ICd1cGdyYWRlVG9SZXZvY2FibGVTZXNzaW9uJyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogY3VycmVudFNlc3Npb25cbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHZhciBzZXNzaW9uID0gbmV3IFBhcnNlLlNlc3Npb24oKTtcbiAgICAgICAgc2Vzc2lvbi5fZmluaXNoRmV0Y2gocmVzdWx0KTtcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gUGFyc2UuVXNlci5jdXJyZW50KCk7XG4gICAgICAgIGN1cnJlbnRVc2VyLl9zZXNzaW9uVG9rZW4gPSBzZXNzaW9uLmdldFNlc3Npb25Ub2tlbigpO1xuICAgICAgICBQYXJzZS5Vc2VyLl9zYXZlQ3VycmVudFVzZXIoY3VycmVudFVzZXIpO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICB9LCAvKiogQGxlbmRzIFBhcnNlLlVzZXIgKi8ge1xuICAgIC8vIENsYXNzIFZhcmlhYmxlc1xuXG4gICAgLy8gVGhlIGN1cnJlbnRseSBsb2dnZWQtaW4gdXNlci5cbiAgICBfY3VycmVudFVzZXI6IG51bGwsXG5cbiAgICAvLyBXaGV0aGVyIGN1cnJlbnRVc2VyIGlzIGtub3duIHRvIG1hdGNoIHRoZSBzZXJpYWxpemVkIHZlcnNpb24gb24gZGlzay5cbiAgICAvLyBUaGlzIGlzIHVzZWZ1bCBmb3Igc2F2aW5nIGEgbG9jYWxzdG9yYWdlIGNoZWNrIGlmIHlvdSB0cnkgdG8gbG9hZFxuICAgIC8vIF9jdXJyZW50VXNlciBmcmVxdWVudGx5IHdoaWxlIHRoZXJlIGlzIG5vbmUgc3RvcmVkLlxuICAgIF9jdXJyZW50VXNlck1hdGNoZXNEaXNrOiBmYWxzZSxcblxuICAgIC8vIFRoZSBsb2NhbFN0b3JhZ2Uga2V5IHN1ZmZpeCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgaXMgc3RvcmVkIHVuZGVyLlxuICAgIF9DVVJSRU5UX1VTRVJfS0VZOiBcImN1cnJlbnRVc2VyXCIsXG5cbiAgICAvLyBUaGUgbWFwcGluZyBvZiBhdXRoIHByb3ZpZGVyIG5hbWVzIHRvIGFjdHVhbCBwcm92aWRlcnNcbiAgICBfYXV0aFByb3ZpZGVyczoge30sXG5cbiAgICAvLyBXaGV0aGVyIHRvIHJld3JpdGUgY2xhc3NOYW1lIFVzZXIgdG8gX1VzZXJcbiAgICBfcGVyZm9ybVVzZXJSZXdyaXRlOiB0cnVlLFxuXG4gICAgLy8gV2hldGhlciB0byBzZW5kIGEgUmV2b2NhYmxlIFNlc3Npb24gaGVhZGVyXG4gICAgX2lzUmV2b2NhYmxlU2Vzc2lvbkVuYWJsZWQ6IGZhbHNlLFxuXG5cbiAgICAvLyBDbGFzcyBNZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiBTaWducyB1cCBhIG5ldyB1c2VyIHdpdGggYSB1c2VybmFtZSAob3IgZW1haWwpIGFuZCBwYXNzd29yZC5cbiAgICAgKiBUaGlzIHdpbGwgY3JlYXRlIGEgbmV3IFBhcnNlLlVzZXIgb24gdGhlIHNlcnZlciwgYW5kIGFsc28gcGVyc2lzdCB0aGVcbiAgICAgKiBzZXNzaW9uIGluIGxvY2FsU3RvcmFnZSBzbyB0aGF0IHlvdSBjYW4gYWNjZXNzIHRoZSB1c2VyIHVzaW5nXG4gICAgICoge0BsaW5rICNjdXJyZW50fS5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZSAob3IgZW1haWwpIHRvIHNpZ24gdXAgd2l0aC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIHNpZ24gdXAgd2l0aC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cnMgRXh0cmEgZmllbGRzIHRvIHNldCBvbiB0aGUgbmV3IHVzZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCB0aGUgdXNlciB3aGVuXG4gICAgICogICAgIHRoZSBzaWdudXAgY29tcGxldGVzLlxuICAgICAqIEBzZWUgUGFyc2UuVXNlciNzaWduVXBcbiAgICAgKi9cbiAgICBzaWduVXA6IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGF0dHJzID0gYXR0cnMgfHwge307XG4gICAgICBhdHRycy51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgICAgYXR0cnMucGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgICAgIHZhciB1c2VyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoXCJfVXNlclwiKTtcbiAgICAgIHJldHVybiB1c2VyLnNpZ25VcChhdHRycywgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3MgaW4gYSB1c2VyIHdpdGggYSB1c2VybmFtZSAob3IgZW1haWwpIGFuZCBwYXNzd29yZC4gT24gc3VjY2VzcywgdGhpc1xuICAgICAqIHNhdmVzIHRoZSBzZXNzaW9uIHRvIGRpc2ssIHNvIHlvdSBjYW4gcmV0cmlldmUgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW5cbiAgICAgKiB1c2VyIHVzaW5nIDxjb2RlPmN1cnJlbnQ8L2NvZGU+LlxuICAgICAqXG4gICAgICogPHA+Q2FsbHMgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3Igb24gY29tcGxldGlvbi48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIChvciBlbWFpbCkgdG8gbG9nIGluIHdpdGguXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBsb2cgaW4gd2l0aC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aXRoIHRoZSB1c2VyIHdoZW5cbiAgICAgKiAgICAgdGhlIGxvZ2luIGNvbXBsZXRlcy5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIjbG9nSW5cbiAgICAgKi9cbiAgICBsb2dJbjogZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkLCBvcHRpb25zKSB7XG4gICAgICB2YXIgdXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICB1c2VyLl9maW5pc2hGZXRjaCh7IHVzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkIH0pO1xuICAgICAgcmV0dXJuIHVzZXIubG9nSW4ob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3MgaW4gYSB1c2VyIHdpdGggYSBzZXNzaW9uIHRva2VuLiBPbiBzdWNjZXNzLCB0aGlzIHNhdmVzIHRoZSBzZXNzaW9uXG4gICAgICogdG8gZGlzaywgc28geW91IGNhbiByZXRyaWV2ZSB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyIHVzaW5nXG4gICAgICogPGNvZGU+Y3VycmVudDwvY29kZT4uXG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZXNzaW9uVG9rZW4gVGhlIHNlc3Npb25Ub2tlbiB0byBsb2cgaW4gd2l0aC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aXRoIHRoZSB1c2VyIHdoZW5cbiAgICAgKiAgICAgdGhlIGxvZ2luIGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBiZWNvbWU6IGZ1bmN0aW9uKHNlc3Npb25Ub2tlbiwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciB1c2VyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoXCJfVXNlclwiKTtcbiAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcInVzZXJzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJtZVwiLFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogc2Vzc2lvblRva2VuXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgIHZhciBzZXJ2ZXJBdHRycyA9IHVzZXIucGFyc2UocmVzcCwgc3RhdHVzLCB4aHIpO1xuICAgICAgICB1c2VyLl9maW5pc2hGZXRjaChzZXJ2ZXJBdHRycyk7XG4gICAgICAgIHVzZXIuX2hhbmRsZVNhdmVSZXN1bHQodHJ1ZSk7XG4gICAgICAgIHJldHVybiB1c2VyO1xuXG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCB1c2VyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTG9ncyBvdXQgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciBzZXNzaW9uLiBUaGlzIHdpbGwgcmVtb3ZlIHRoZVxuICAgICAqIHNlc3Npb24gZnJvbSBkaXNrLCBsb2cgb3V0IG9mIGxpbmtlZCBzZXJ2aWNlcywgYW5kIGZ1dHVyZSBjYWxscyB0b1xuICAgICAqIDxjb2RlPmN1cnJlbnQ8L2NvZGU+IHdpbGwgcmV0dXJuIDxjb2RlPm51bGw8L2NvZGU+LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIHNlc3Npb24gaXNcbiAgICAgKiAgIGRlc3Ryb3llZCBvbiB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGxvZ091dDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudEFzeW5jKCkudGhlbihmdW5jdGlvbihjdXJyZW50VXNlcikge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IFBhcnNlLlN0b3JhZ2UucmVtb3ZlSXRlbUFzeW5jKFxuICAgICAgICAgIFBhcnNlLl9nZXRQYXJzZVBhdGgoUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSkpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VXNlciAhPT0gbnVsbCkge1xuICAgICAgICAgIHZhciBjdXJyZW50U2Vzc2lvbiA9IGN1cnJlbnRVc2VyLmdldFNlc3Npb25Ub2tlbigpO1xuICAgICAgICAgIGlmIChQYXJzZS5TZXNzaW9uLl9pc1Jldm9jYWJsZShjdXJyZW50U2Vzc2lvbikpIHtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgICAgICAgICByb3V0ZTogJ2xvZ291dCcsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgc2Vzc2lvblRva2VuOiBjdXJyZW50U2Vzc2lvblxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50VXNlci5fbG9nT3V0V2l0aEFsbCgpO1xuICAgICAgICAgIGN1cnJlbnRVc2VyLl9pc0N1cnJlbnRVc2VyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzayA9IHRydWU7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0cyBhIHBhc3N3b3JkIHJlc2V0IGVtYWlsIHRvIGJlIHNlbnQgdG8gdGhlIHNwZWNpZmllZCBlbWFpbCBhZGRyZXNzXG4gICAgICogYXNzb2NpYXRlZCB3aXRoIHRoZSB1c2VyIGFjY291bnQuIFRoaXMgZW1haWwgYWxsb3dzIHRoZSB1c2VyIHRvIHNlY3VyZWx5XG4gICAgICogcmVzZXQgdGhlaXIgcGFzc3dvcmQgb24gdGhlIFBhcnNlIHNpdGUuXG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCBUaGUgZW1haWwgYWRkcmVzcyBhc3NvY2lhdGVkIHdpdGggdGhlIHVzZXIgdGhhdFxuICAgICAqICAgICBmb3Jnb3QgdGhlaXIgcGFzc3dvcmQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKi9cbiAgICByZXF1ZXN0UGFzc3dvcmRSZXNldDogZnVuY3Rpb24oZW1haWwsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcInJlcXVlc3RQYXNzd29yZFJlc2V0XCIsXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIGRhdGE6IHsgZW1haWw6IGVtYWlsIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcXVlc3QuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiBQYXJzZVVzZXIgd2l0aCBhIHZhbGlkIHNlc3Npb24sXG4gICAgICogZWl0aGVyIGZyb20gbWVtb3J5IG9yIGxvY2FsU3RvcmFnZSwgaWYgbmVjZXNzYXJ5LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLk9iamVjdH0gVGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gUGFyc2UuVXNlci5cbiAgICAgKi9cbiAgICBjdXJyZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChQYXJzZS5TdG9yYWdlLmFzeW5jKSB7XG4gICAgICAgIC8vIFdlIGNhbid0IHJldHVybiB0aGUgY3VycmVudCB1c2VyIHN5bmNocm9ub3VzbHlcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudEFzeW5jKCk7XG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyTWF0Y2hlc0Rpc2spIHtcbiAgICAgICAgLy8gVE9ETzogTGF6aWx5IGxvZyBpbiBhbm9ueW1vdXMgdXNlci5cbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyO1xuICAgICAgfVxuXG4gICAgICAvLyBMb2FkIHRoZSB1c2VyIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyTWF0Y2hlc0Rpc2sgPSB0cnVlO1xuXG4gICAgICB2YXIgdXNlckRhdGEgPSBQYXJzZS5TdG9yYWdlLmdldEl0ZW0oUGFyc2UuX2dldFBhcnNlUGF0aChcbiAgICAgICAgICBQYXJzZS5Vc2VyLl9DVVJSRU5UX1VTRVJfS0VZKSk7XG4gICAgICBpZiAoIXVzZXJEYXRhKSB7XG4gICAgICAgIC8vIFRPRE86IExhemlseSBsb2cgaW4gYW5vbnltb3VzIHVzZXIuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX2lzQ3VycmVudFVzZXIgPSB0cnVlO1xuXG4gICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UodXNlckRhdGEpO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuaWQgPSBqc29uLl9pZDtcbiAgICAgIGRlbGV0ZSBqc29uLl9pZDtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9zZXNzaW9uVG9rZW4gPSBqc29uLl9zZXNzaW9uVG9rZW47XG4gICAgICBkZWxldGUganNvbi5fc2Vzc2lvblRva2VuO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX2ZpbmlzaEZldGNoKGpzb24pO1xuXG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fc3luY2hyb25pemVBbGxBdXRoRGF0YSgpO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX29wU2V0UXVldWUgPSBbe31dO1xuICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gUGFyc2VVc2VyIGZyb20gYXN5bmNocm9ub3VzIFN0b3JhZ2UuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgY3VycmVudGx5XG4gICAgICogICBsb2dnZWQgaW4gUGFyc2UgVXNlclxuICAgICAqL1xuICAgIF9jdXJyZW50QXN5bmM6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyTWF0Y2hlc0Rpc2spIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoUGFyc2UuVXNlci5fY3VycmVudFVzZXIpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb2FkIHRoZSB1c2VyIGZyb20gU3RvcmFnZVxuICAgICAgcmV0dXJuIFBhcnNlLlN0b3JhZ2UuZ2V0SXRlbUFzeW5jKFBhcnNlLl9nZXRQYXJzZVBhdGgoXG4gICAgICAgIFBhcnNlLlVzZXIuX0NVUlJFTlRfVVNFUl9LRVkpKS50aGVuKGZ1bmN0aW9uKHVzZXJEYXRhKSB7XG4gICAgICAgIGlmICghdXNlckRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9pc0N1cnJlbnRVc2VyID0gdHJ1ZTtcblxuICAgICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UodXNlckRhdGEpO1xuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5pZCA9IGpzb24uX2lkO1xuICAgICAgICBkZWxldGUganNvbi5faWQ7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9zZXNzaW9uVG9rZW4gPSBqc29uLl9zZXNzaW9uVG9rZW47XG4gICAgICAgIGRlbGV0ZSBqc29uLl9zZXNzaW9uVG9rZW47XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9maW5pc2hGZXRjaChqc29uKTtcblxuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fc3luY2hyb25pemVBbGxBdXRoRGF0YSgpO1xuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fcmVmcmVzaENhY2hlKCk7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9vcFNldFF1ZXVlID0gW3t9XTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFsbG93IHNvbWVvbmUgdG8gZGVmaW5lIGEgY3VzdG9tIFVzZXIgY2xhc3Mgd2l0aG91dCBjbGFzc05hbWVcbiAgICAgKiBiZWluZyByZXdyaXR0ZW4gdG8gX1VzZXIuIFRoZSBkZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJld3JpdGVcbiAgICAgKiBVc2VyIHRvIF9Vc2VyIGZvciBsZWdhY3kgcmVhc29ucy4gVGhpcyBhbGxvd3MgZGV2ZWxvcGVycyB0b1xuICAgICAqIG92ZXJyaWRlIHRoYXQgYmVoYXZpb3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQWxsb3dlZCBXaGV0aGVyIG9yIG5vdCB0byBhbGxvdyBjdXN0b20gVXNlciBjbGFzc1xuICAgICAqL1xuICAgIGFsbG93Q3VzdG9tVXNlckNsYXNzOiBmdW5jdGlvbihpc0FsbG93ZWQpIHtcbiAgICAgIHRoaXMuX3BlcmZvcm1Vc2VyUmV3cml0ZSA9ICFpc0FsbG93ZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFsbG93IGEgbGVnYWN5IGFwcGxpY2F0aW9uIHRvIHN0YXJ0IHVzaW5nIHJldm9jYWJsZSBzZXNzaW9ucy4gSWYgdGhlXG4gICAgICogY3VycmVudCBzZXNzaW9uIHRva2VuIGlzIG5vdCByZXZvY2FibGUsIGEgcmVxdWVzdCB3aWxsIGJlIG1hZGUgZm9yIGEgbmV3LFxuICAgICAqIHJldm9jYWJsZSBzZXNzaW9uLlxuICAgICAqIEl0IGlzIG5vdCBuZWNlc3NhcnkgdG8gY2FsbCB0aGlzIG1ldGhvZCBmcm9tIGNsb3VkIGNvZGUgdW5sZXNzIHlvdSBhcmVcbiAgICAgKiBoYW5kbGluZyB1c2VyIHNpZ251cCBvciBsb2dpbiBmcm9tIHRoZSBzZXJ2ZXIgc2lkZS4gSW4gYSBjbG91ZCBjb2RlIGNhbGwsXG4gICAgICogdGhpcyBmdW5jdGlvbiB3aWxsIG5vdCBhdHRlbXB0IHRvIHVwZ3JhZGUgdGhlIGN1cnJlbnQgdG9rZW4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIHByb2Nlc3MgaGFzXG4gICAgICogICBjb21wbGV0ZWQuIElmIGEgcmVwbGFjZW1lbnQgc2Vzc2lvbiB0b2tlbiBpcyByZXF1ZXN0ZWQsIHRoZSBwcm9taXNlXG4gICAgICogICB3aWxsIGJlIHJlc29sdmVkIGFmdGVyIGEgbmV3IHRva2VuIGhhcyBiZWVuIGZldGNoZWQuXG4gICAgICovXG4gICAgZW5hYmxlUmV2b2NhYmxlU2Vzc2lvbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBQYXJzZS5Vc2VyLl9pc1Jldm9jYWJsZVNlc3Npb25FbmFibGVkID0gdHJ1ZTtcbiAgICAgIGlmICghUGFyc2UuX2lzTm9kZSAmJiBQYXJzZS5Vc2VyLmN1cnJlbnQoKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5jdXJyZW50KCkuX3VwZ3JhZGVUb1Jldm9jYWJsZVNlc3Npb24ob3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcygpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQZXJzaXN0cyBhIHVzZXIgYXMgY3VycmVudFVzZXIgdG8gbG9jYWxTdG9yYWdlLCBhbmQgaW50byB0aGUgc2luZ2xldG9uLlxuICAgICAqL1xuICAgIF9zYXZlQ3VycmVudFVzZXI6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgIGlmIChQYXJzZS5Vc2VyLl9jdXJyZW50VXNlciAhPT0gbnVsbCAmJlxuICAgICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyICE9PSB1c2VyKSB7XG4gICAgICAgIFBhcnNlLlVzZXIubG9nT3V0KCk7XG4gICAgICB9XG4gICAgICB1c2VyLl9pc0N1cnJlbnRVc2VyID0gdHJ1ZTtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyTWF0Y2hlc0Rpc2sgPSB0cnVlO1xuXG4gICAgICB2YXIganNvbiA9IHVzZXIudG9KU09OKCk7XG4gICAgICBqc29uLl9pZCA9IHVzZXIuaWQ7XG4gICAgICBqc29uLl9zZXNzaW9uVG9rZW4gPSB1c2VyLl9zZXNzaW9uVG9rZW47XG4gICAgICBpZiAoUGFyc2UuU3RvcmFnZS5hc3luYykge1xuICAgICAgICBQYXJzZS5TdG9yYWdlLnNldEl0ZW1Bc3luYyhcbiAgICAgICAgICBQYXJzZS5fZ2V0UGFyc2VQYXRoKFBhcnNlLlVzZXIuX0NVUlJFTlRfVVNFUl9LRVkpLFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGpzb24pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFBhcnNlLlN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICBQYXJzZS5fZ2V0UGFyc2VQYXRoKFBhcnNlLlVzZXIuX0NVUlJFTlRfVVNFUl9LRVkpLFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGpzb24pKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JlZ2lzdGVyQXV0aGVudGljYXRpb25Qcm92aWRlcjogZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIFBhcnNlLlVzZXIuX2F1dGhQcm92aWRlcnNbcHJvdmlkZXIuZ2V0QXV0aFR5cGUoKV0gPSBwcm92aWRlcjtcbiAgICAgIC8vIFN5bmNocm9uaXplIHRoZSBjdXJyZW50IHVzZXIgd2l0aCB0aGUgYXV0aCBwcm92aWRlci5cbiAgICAgIGlmIChQYXJzZS5Vc2VyLmN1cnJlbnQoKSkge1xuICAgICAgICBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5fc3luY2hyb25pemVBdXRoRGF0YShwcm92aWRlci5nZXRBdXRoVHlwZSgpKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2xvZ0luV2l0aDogZnVuY3Rpb24ocHJvdmlkZXIsIG9wdGlvbnMpIHtcbiAgICAgIHZhciB1c2VyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoXCJfVXNlclwiKTtcbiAgICAgIHJldHVybiB1c2VyLl9saW5rV2l0aChwcm92aWRlciwgb3B0aW9ucyk7XG4gICAgfVxuXG4gIH0pO1xufSh0aGlzKSk7XG5cblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5BIFBhcnNlLlNlc3Npb24gb2JqZWN0IGlzIGEgbG9jYWwgcmVwcmVzZW50YXRpb24gb2YgYSByZXZvY2FibGUgc2Vzc2lvbi5cbiAgICogVGhpcyBjbGFzcyBpcyBhIHN1YmNsYXNzIG9mIGEgUGFyc2UuT2JqZWN0LCBhbmQgcmV0YWlucyB0aGUgc2FtZVxuICAgKiBmdW5jdGlvbmFsaXR5IG9mIGEgUGFyc2UuT2JqZWN0LjwvcD5cbiAgICovXG4gIFBhcnNlLlNlc3Npb24gPSBQYXJzZS5PYmplY3QuZXh0ZW5kKCdfU2Vzc2lvbicsXG4gIC8qKiBAbGVuZHMgUGFyc2UuU2Vzc2lvbi5wcm90b3R5cGUgKi9cbiAge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNlc3Npb24gdG9rZW4gc3RyaW5nLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRTZXNzaW9uVG9rZW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Nlc3Npb25Ub2tlbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRvIGhhbmRsZSBzcGVjaWFsIGZpZWxkcyBpbiBhIF9TZXNzaW9uIHJlc3BvbnNlLlxuICAgICAqL1xuICAgIF9tZXJnZU1hZ2ljRmllbGRzOiBmdW5jdGlvbihhdHRycykge1xuICAgICAgaWYgKGF0dHJzLnNlc3Npb25Ub2tlbikge1xuICAgICAgICB0aGlzLl9zZXNzaW9uVG9rZW4gPSBhdHRycy5zZXNzaW9uVG9rZW47XG4gICAgICAgIGRlbGV0ZSBhdHRycy5zZXNzaW9uVG9rZW47XG4gICAgICB9XG4gICAgICBQYXJzZS5TZXNzaW9uLl9fc3VwZXJfXy5fbWVyZ2VNYWdpY0ZpZWxkcy5jYWxsKHRoaXMsIGF0dHJzKTtcbiAgICB9LFxuICB9LCAvKiogQGxlbmRzIFBhcnNlLlNlc3Npb24gKi8ge1xuXG4gICAgLy8gVGhyb3cgYW4gZXJyb3Igd2hlbiBtb2RpZnlpbmcgdGhlc2UgcmVhZC1vbmx5IGZpZWxkc1xuICAgIHJlYWRPbmx5QXR0cmlidXRlczoge1xuICAgICAgY3JlYXRlZFdpdGg6IHRydWUsXG4gICAgICBleHBpcmVzQXQ6IHRydWUsXG4gICAgICBpbnN0YWxsYXRpb25JZDogdHJ1ZSxcbiAgICAgIHJlc3RyaWN0ZWQ6IHRydWUsXG4gICAgICBzZXNzaW9uVG9rZW46IHRydWUsXG4gICAgICB1c2VyOiB0cnVlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgU2Vzc2lvbiBvYmplY3QgZm9yIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHNlc3Npb24uXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgUGFyc2UuU2Vzc2lvblxuICAgICAqICAgb2JqZWN0IGFmdGVyIGl0IGhhcyBiZWVuIGZldGNoZWQuXG4gICAgICovXG4gICAgY3VycmVudDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciBzZXNzaW9uID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoJ19TZXNzaW9uJyk7XG4gICAgICB2YXIgY3VycmVudFRva2VuID0gUGFyc2UuVXNlci5jdXJyZW50KCkuZ2V0U2Vzc2lvblRva2VuKCk7XG4gICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogJ3Nlc3Npb25zJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnbWUnLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBzZXNzaW9uVG9rZW46IGN1cnJlbnRUb2tlblxuICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuICAgICAgICB2YXIgc2VydmVyQXR0cnMgPSBzZXNzaW9uLnBhcnNlKHJlc3AsIHN0YXR1cywgeGhyKTtcbiAgICAgICAgc2Vzc2lvbi5fZmluaXNoRmV0Y2goc2VydmVyQXR0cnMpO1xuICAgICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHNlc3Npb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBzZXNzaW9uIHRva2VuIGlzIHJldm9jYWJsZS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIF9pc1Jldm9jYWJsZTogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgIHJldHVybiB0b2tlbi5pbmRleE9mKCdyOicpID4gLTE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciB0aGUgY3VycmVudCBzZXNzaW9uIHRva2VuIGlzIHJldm9jYWJsZS5cbiAgICAgKiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgZm9yIG1pZ3JhdGluZyBFeHByZXNzLmpzIG9yIE5vZGUuanMgd2ViIGFwcHMgdG9cbiAgICAgKiB1c2UgcmV2b2NhYmxlIHNlc3Npb25zLiBJZiB5b3UgYXJlIG1pZ3JhdGluZyBhbiBhcHAgdGhhdCB1c2VzIHRoZSBQYXJzZVxuICAgICAqIFNESyBpbiB0aGUgYnJvd3NlciBvbmx5LCBwbGVhc2UgdXNlIFBhcnNlLlVzZXIuZW5hYmxlUmV2b2NhYmxlU2Vzc2lvbigpXG4gICAgICogaW5zdGVhZCwgc28gdGhhdCBzZXNzaW9ucyBjYW4gYmUgYXV0b21hdGljYWxseSB1cGdyYWRlZC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzQ3VycmVudFNlc3Npb25SZXZvY2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFBhcnNlLlVzZXIuY3VycmVudCgpICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5TZXNzaW9uLl9pc1Jldm9jYWJsZShcbiAgICAgICAgICBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5nZXRTZXNzaW9uVG9rZW4oKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59KSh0aGlzKTtcblxuLy8gUGFyc2UuUXVlcnkgaXMgYSB3YXkgdG8gY3JlYXRlIGEgbGlzdCBvZiBQYXJzZS5PYmplY3RzLlxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBwYXJzZSBQYXJzZS5RdWVyeSBmb3IgdGhlIGdpdmVuIFBhcnNlLk9iamVjdCBzdWJjbGFzcy5cbiAgICogQHBhcmFtIG9iamVjdENsYXNzIC1cbiAgICogICBBbiBpbnN0YW5jZSBvZiBhIHN1YmNsYXNzIG9mIFBhcnNlLk9iamVjdCwgb3IgYSBQYXJzZSBjbGFzc05hbWUgc3RyaW5nLlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+UGFyc2UuUXVlcnkgZGVmaW5lcyBhIHF1ZXJ5IHRoYXQgaXMgdXNlZCB0byBmZXRjaCBQYXJzZS5PYmplY3RzLiBUaGVcbiAgICogbW9zdCBjb21tb24gdXNlIGNhc2UgaXMgZmluZGluZyBhbGwgb2JqZWN0cyB0aGF0IG1hdGNoIGEgcXVlcnkgdGhyb3VnaCB0aGVcbiAgICogPGNvZGU+ZmluZDwvY29kZT4gbWV0aG9kLiBGb3IgZXhhbXBsZSwgdGhpcyBzYW1wbGUgY29kZSBmZXRjaGVzIGFsbCBvYmplY3RzXG4gICAqIG9mIGNsYXNzIDxjb2RlPk15Q2xhc3M8L2NvZGU+LiBJdCBjYWxscyBhIGRpZmZlcmVudCBmdW5jdGlvbiBkZXBlbmRpbmcgb25cbiAgICogd2hldGhlciB0aGUgZmV0Y2ggc3VjY2VlZGVkIG9yIG5vdC5cbiAgICogXG4gICAqIDxwcmU+XG4gICAqIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShNeUNsYXNzKTtcbiAgICogcXVlcnkuZmluZCh7XG4gICAqICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgKiAgICAgLy8gcmVzdWx0cyBpcyBhbiBhcnJheSBvZiBQYXJzZS5PYmplY3QuXG4gICAqICAgfSxcbiAgICpcbiAgICogICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgIC8vIGVycm9yIGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLkVycm9yLlxuICAgKiAgIH1cbiAgICogfSk7PC9wcmU+PC9wPlxuICAgKiBcbiAgICogPHA+QSBQYXJzZS5RdWVyeSBjYW4gYWxzbyBiZSB1c2VkIHRvIHJldHJpZXZlIGEgc2luZ2xlIG9iamVjdCB3aG9zZSBpZCBpc1xuICAgKiBrbm93biwgdGhyb3VnaCB0aGUgZ2V0IG1ldGhvZC4gRm9yIGV4YW1wbGUsIHRoaXMgc2FtcGxlIGNvZGUgZmV0Y2hlcyBhblxuICAgKiBvYmplY3Qgb2YgY2xhc3MgPGNvZGU+TXlDbGFzczwvY29kZT4gYW5kIGlkIDxjb2RlPm15SWQ8L2NvZGU+LiBJdCBjYWxscyBhXG4gICAqIGRpZmZlcmVudCBmdW5jdGlvbiBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgZmV0Y2ggc3VjY2VlZGVkIG9yIG5vdC5cbiAgICogXG4gICAqIDxwcmU+XG4gICAqIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShNeUNsYXNzKTtcbiAgICogcXVlcnkuZ2V0KG15SWQsIHtcbiAgICogICBzdWNjZXNzOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICogICAgIC8vIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5PYmplY3QuXG4gICAqICAgfSxcbiAgICpcbiAgICogICBlcnJvcjogZnVuY3Rpb24ob2JqZWN0LCBlcnJvcikge1xuICAgKiAgICAgLy8gZXJyb3IgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IuXG4gICAqICAgfVxuICAgKiB9KTs8L3ByZT48L3A+XG4gICAqIFxuICAgKiA8cD5BIFBhcnNlLlF1ZXJ5IGNhbiBhbHNvIGJlIHVzZWQgdG8gY291bnQgdGhlIG51bWJlciBvZiBvYmplY3RzIHRoYXQgbWF0Y2hcbiAgICogdGhlIHF1ZXJ5IHdpdGhvdXQgcmV0cmlldmluZyBhbGwgb2YgdGhvc2Ugb2JqZWN0cy4gRm9yIGV4YW1wbGUsIHRoaXNcbiAgICogc2FtcGxlIGNvZGUgY291bnRzIHRoZSBudW1iZXIgb2Ygb2JqZWN0cyBvZiB0aGUgY2xhc3MgPGNvZGU+TXlDbGFzczwvY29kZT5cbiAgICogPHByZT5cbiAgICogdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KE15Q2xhc3MpO1xuICAgKiBxdWVyeS5jb3VudCh7XG4gICAqICAgc3VjY2VzczogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAqICAgICAvLyBUaGVyZSBhcmUgbnVtYmVyIGluc3RhbmNlcyBvZiBNeUNsYXNzLlxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAvLyBlcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvci5cbiAgICogICB9XG4gICAqIH0pOzwvcHJlPjwvcD5cbiAgICovXG4gIFBhcnNlLlF1ZXJ5ID0gZnVuY3Rpb24ob2JqZWN0Q2xhc3MpIHtcbiAgICBpZiAoXy5pc1N0cmluZyhvYmplY3RDbGFzcykpIHtcbiAgICAgIG9iamVjdENsYXNzID0gUGFyc2UuT2JqZWN0Ll9nZXRTdWJjbGFzcyhvYmplY3RDbGFzcyk7XG4gICAgfVxuXG4gICAgdGhpcy5vYmplY3RDbGFzcyA9IG9iamVjdENsYXNzO1xuXG4gICAgdGhpcy5jbGFzc05hbWUgPSBvYmplY3RDbGFzcy5wcm90b3R5cGUuY2xhc3NOYW1lO1xuXG4gICAgdGhpcy5fd2hlcmUgPSB7fTtcbiAgICB0aGlzLl9pbmNsdWRlID0gW107XG4gICAgdGhpcy5fbGltaXQgPSAtMTsgLy8gbmVnYXRpdmUgbGltaXQgbWVhbnMsIGRvIG5vdCBzZW5kIGEgbGltaXRcbiAgICB0aGlzLl9za2lwID0gMDtcbiAgICB0aGlzLl9leHRyYU9wdGlvbnMgPSB7fTtcbiAgfTtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIFBhcnNlLlF1ZXJ5IHRoYXQgaXMgdGhlIE9SIG9mIHRoZSBwYXNzZWQgaW4gcXVlcmllcy4gIEZvclxuICAgKiBleGFtcGxlOlxuICAgKiA8cHJlPnZhciBjb21wb3VuZFF1ZXJ5ID0gUGFyc2UuUXVlcnkub3IocXVlcnkxLCBxdWVyeTIsIHF1ZXJ5Myk7PC9wcmU+XG4gICAqXG4gICAqIHdpbGwgY3JlYXRlIGEgY29tcG91bmRRdWVyeSB0aGF0IGlzIGFuIG9yIG9mIHRoZSBxdWVyeTEsIHF1ZXJ5MiwgYW5kXG4gICAqIHF1ZXJ5My5cbiAgICogQHBhcmFtIHsuLi5QYXJzZS5RdWVyeX0gdmFyX2FyZ3MgVGhlIGxpc3Qgb2YgcXVlcmllcyB0byBPUi5cbiAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFRoZSBxdWVyeSB0aGF0IGlzIHRoZSBPUiBvZiB0aGUgcGFzc2VkIGluIHF1ZXJpZXMuXG4gICAqL1xuICBQYXJzZS5RdWVyeS5vciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBxdWVyaWVzID0gXy50b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgdmFyIGNsYXNzTmFtZSA9IG51bGw7XG4gICAgUGFyc2UuX2FycmF5RWFjaChxdWVyaWVzLCBmdW5jdGlvbihxKSB7XG4gICAgICBpZiAoXy5pc051bGwoY2xhc3NOYW1lKSkge1xuICAgICAgICBjbGFzc05hbWUgPSBxLmNsYXNzTmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNsYXNzTmFtZSAhPT0gcS5jbGFzc05hbWUpIHtcbiAgICAgICAgdGhyb3cgXCJBbGwgcXVlcmllcyBtdXN0IGJlIGZvciB0aGUgc2FtZSBjbGFzc1wiO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShjbGFzc05hbWUpO1xuICAgIHF1ZXJ5Ll9vclF1ZXJ5KHF1ZXJpZXMpO1xuICAgIHJldHVybiBxdWVyeTtcbiAgfTtcblxuICBQYXJzZS5RdWVyeS5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIFBhcnNlLk9iamVjdCB3aG9zZSBpZCBpcyBhbHJlYWR5IGtub3duIGJ5IGZldGNoaW5nIGRhdGEgZnJvbVxuICAgICAqIHRoZSBzZXJ2ZXIuICBFaXRoZXIgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3IgaXMgY2FsbGVkIHdoZW4gdGhlXG4gICAgICogZmluZCBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb2JqZWN0SWQgVGhlIGlkIG9mIHRoZSBvYmplY3QgdG8gYmUgZmV0Y2hlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKG9iamVjdElkLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLmVxdWFsVG8oJ29iamVjdElkJywgb2JqZWN0SWQpO1xuXG4gICAgICB2YXIgZmlyc3RPcHRpb25zID0ge307XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmhhcyhvcHRpb25zLCAndXNlTWFzdGVyS2V5JykpIHtcbiAgICAgICAgZmlyc3RPcHRpb25zID0geyB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5IH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmLmZpcnN0KGZpcnN0T3B0aW9ucykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXJyb3JPYmplY3QgPSBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT0JKRUNUX05PVF9GT1VORCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiT2JqZWN0IG5vdCBmb3VuZC5cIik7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yT2JqZWN0KTtcblxuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgbnVsbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgcXVlcnkuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVlcnkuXG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgIHdoZXJlOiB0aGlzLl93aGVyZVxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuX2luY2x1ZGUubGVuZ3RoID4gMCkge1xuICAgICAgICBwYXJhbXMuaW5jbHVkZSA9IHRoaXMuX2luY2x1ZGUuam9pbihcIixcIik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICAgIHBhcmFtcy5rZXlzID0gdGhpcy5fc2VsZWN0LmpvaW4oXCIsXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2xpbWl0ID49IDApIHtcbiAgICAgICAgcGFyYW1zLmxpbWl0ID0gdGhpcy5fbGltaXQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fc2tpcCA+IDApIHtcbiAgICAgICAgcGFyYW1zLnNraXAgPSB0aGlzLl9za2lwO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX29yZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyYW1zLm9yZGVyID0gdGhpcy5fb3JkZXIuam9pbihcIixcIik7XG4gICAgICB9XG5cbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuX2V4dHJhT3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICBwYXJhbXNba10gPSB2O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhIGxpc3Qgb2YgUGFyc2VPYmplY3RzIHRoYXQgc2F0aXNmeSB0aGlzIHF1ZXJ5LlxuICAgICAqIEVpdGhlciBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBpcyBjYWxsZWQgd2hlbiB0aGUgZmluZFxuICAgICAqIGNvbXBsZXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuIFZhbGlkIG9wdGlvbnNcbiAgICAgKiBhcmU6PHVsPlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZmluZCBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICAgICAqICAgPGxpPmVycm9yOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGZpbmQgZmFpbHMuXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIHJlc3VsdHMgd2hlblxuICAgICAqIHRoZSBxdWVyeSBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgZmluZDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc05hbWUsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgZGF0YTogdGhpcy50b0pTT04oKVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3BvbnNlLnJlc3VsdHMsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgICB2YXIgb2JqO1xuICAgICAgICAgIGlmIChyZXNwb25zZS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIG9iaiA9IG5ldyBQYXJzZS5PYmplY3QocmVzcG9uc2UuY2xhc3NOYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqID0gbmV3IHNlbGYub2JqZWN0Q2xhc3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JqLl9maW5pc2hGZXRjaChqc29uLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9KTtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb3VudHMgdGhlIG51bWJlciBvZiBvYmplY3RzIHRoYXQgbWF0Y2ggdGhpcyBxdWVyeS5cbiAgICAgKiBFaXRoZXIgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3IgaXMgY2FsbGVkIHdoZW4gdGhlIGNvdW50XG4gICAgICogY29tcGxldGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC4gVmFsaWQgb3B0aW9uc1xuICAgICAqIGFyZTo8dWw+XG4gICAgICogICA8bGk+c3VjY2VzczogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBjb3VudCBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICAgICAqICAgPGxpPmVycm9yOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGZpbmQgZmFpbHMuXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIGNvdW50IHdoZW5cbiAgICAgKiB0aGUgcXVlcnkgY29tcGxldGVzLlxuICAgICAqL1xuICAgIGNvdW50OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHBhcmFtcyA9IHRoaXMudG9KU09OKCk7XG4gICAgICBwYXJhbXMubGltaXQgPSAwO1xuICAgICAgcGFyYW1zLmNvdW50ID0gMTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogc2VsZi5jbGFzc05hbWUsIFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIGRhdGE6IHBhcmFtc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNvdW50O1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhdCBtb3N0IG9uZSBQYXJzZS5PYmplY3QgdGhhdCBzYXRpc2ZpZXMgdGhpcyBxdWVyeS5cbiAgICAgKlxuICAgICAqIEVpdGhlciBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBpcyBjYWxsZWQgd2hlbiBpdCBjb21wbGV0ZXMuXG4gICAgICogc3VjY2VzcyBpcyBwYXNzZWQgdGhlIG9iamVjdCBpZiB0aGVyZSBpcyBvbmUuIG90aGVyd2lzZSwgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC4gVmFsaWQgb3B0aW9uc1xuICAgICAqIGFyZTo8dWw+XG4gICAgICogICA8bGk+c3VjY2VzczogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBmaW5kIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAgICogICA8bGk+ZXJyb3I6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZmluZCBmYWlscy5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgb2JqZWN0IHdoZW5cbiAgICAgKiB0aGUgcXVlcnkgY29tcGxldGVzLlxuICAgICAqL1xuICAgIGZpcnN0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHBhcmFtcyA9IHRoaXMudG9KU09OKCk7XG4gICAgICBwYXJhbXMubGltaXQgPSAxO1xuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcImNsYXNzZXNcIixcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLmNsYXNzTmFtZSwgXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgZGF0YTogcGFyYW1zXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gXy5tYXAocmVzcG9uc2UucmVzdWx0cywgZnVuY3Rpb24oanNvbikge1xuICAgICAgICAgIHZhciBvYmo7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgb2JqID0gbmV3IFBhcnNlLk9iamVjdChyZXNwb25zZS5jbGFzc05hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmogPSBuZXcgc2VsZi5vYmplY3RDbGFzcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYmouX2ZpbmlzaEZldGNoKGpzb24sIHRydWUpO1xuICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0pWzBdO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgaW5zdGFuY2Ugb2YgUGFyc2UuQ29sbGVjdGlvbiBiYWNrZWQgYnkgdGhpcyBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBpdGVtcyBBbiBhcnJheSBvZiBpbnN0YW5jZXMgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPlxuICAgICAqICAgICB3aXRoIHdoaWNoIHRvIHN0YXJ0IHRoaXMgQ29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5tb2RlbDogVGhlIFBhcnNlLk9iamVjdCBzdWJjbGFzcyB0aGF0IHRoaXMgY29sbGVjdGlvbiBjb250YWlucy5cbiAgICAgKiAgIDxsaT5xdWVyeTogQW4gaW5zdGFuY2Ugb2YgUGFyc2UuUXVlcnkgdG8gdXNlIHdoZW4gZmV0Y2hpbmcgaXRlbXMuXG4gICAgICogICA8bGk+Y29tcGFyYXRvcjogQSBzdHJpbmcgcHJvcGVydHkgbmFtZSBvciBmdW5jdGlvbiB0byBzb3J0IGJ5LlxuICAgICAqIDwvdWw+XG4gICAgICogQHJldHVybiB7UGFyc2UuQ29sbGVjdGlvbn1cbiAgICAgKi9cbiAgICBjb2xsZWN0aW9uOiBmdW5jdGlvbihpdGVtcywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICByZXR1cm4gbmV3IFBhcnNlLkNvbGxlY3Rpb24oaXRlbXMsIF8uZXh0ZW5kKG9wdGlvbnMsIHtcbiAgICAgICAgbW9kZWw6IHRoaXMub2JqZWN0Q2xhc3MsXG4gICAgICAgIHF1ZXJ5OiB0aGlzXG4gICAgICB9KSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG51bWJlciBvZiByZXN1bHRzIHRvIHNraXAgYmVmb3JlIHJldHVybmluZyBhbnkgcmVzdWx0cy5cbiAgICAgKiBUaGlzIGlzIHVzZWZ1bCBmb3IgcGFnaW5hdGlvbi5cbiAgICAgKiBEZWZhdWx0IGlzIHRvIHNraXAgemVybyByZXN1bHRzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIHRoZSBudW1iZXIgb2YgcmVzdWx0cyB0byBza2lwLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgc2tpcDogZnVuY3Rpb24obikge1xuICAgICAgdGhpcy5fc2tpcCA9IG47XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbGltaXQgb2YgdGhlIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi4gVGhlIGRlZmF1bHQgbGltaXQgaXNcbiAgICAgKiAxMDAsIHdpdGggYSBtYXhpbXVtIG9mIDEwMDAgcmVzdWx0cyBiZWluZyByZXR1cm5lZCBhdCBhIHRpbWUuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG4gdGhlIG51bWJlciBvZiByZXN1bHRzIHRvIGxpbWl0IHRvLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbGltaXQ6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIHRoaXMuX2xpbWl0ID0gbjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGVxdWFsIHRvIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0aGF0IHRoZSBQYXJzZS5PYmplY3QgbXVzdCBjb250YWluLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZXF1YWxUbzogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKF8uaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvZXNOb3RFeGlzdChrZXkpO1xuICAgICAgfSBcblxuICAgICAgdGhpcy5fd2hlcmVba2V5XSA9IFBhcnNlLl9lbmNvZGUodmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhlbHBlciBmb3IgY29uZGl0aW9uIHF1ZXJpZXNcbiAgICAgKi9cbiAgICBfYWRkQ29uZGl0aW9uOiBmdW5jdGlvbihrZXksIGNvbmRpdGlvbiwgdmFsdWUpIHtcbiAgICAgIC8vIENoZWNrIGlmIHdlIGFscmVhZHkgaGF2ZSBhIGNvbmRpdGlvblxuICAgICAgaWYgKCF0aGlzLl93aGVyZVtrZXldKSB7XG4gICAgICAgIHRoaXMuX3doZXJlW2tleV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3doZXJlW2tleV1bY29uZGl0aW9uXSA9IFBhcnNlLl9lbmNvZGUodmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgbm90IGVxdWFsIHRvIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0aGF0IG11c3Qgbm90IGJlIGVxdWFsbGVkLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbm90RXF1YWxUbzogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbmVcIiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgbGVzcyB0aGFuIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0aGF0IHByb3ZpZGVzIGFuIHVwcGVyIGJvdW5kLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbGVzc1RoYW46IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGx0XCIsIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGdyZWF0ZXIgdGhhbiB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCBwcm92aWRlcyBhbiBsb3dlciBib3VuZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGdyZWF0ZXJUaGFuOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRndFwiLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgcHJvdmlkZXMgYW4gdXBwZXIgYm91bmQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBsZXNzVGhhbk9yRXF1YWxUbzogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbHRlXCIsIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCBwcm92aWRlcyBhbiBsb3dlciBib3VuZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRndGVcIiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgY29udGFpbmVkIGluIHRoZSBwcm92aWRlZCBsaXN0IG9mIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdGhhdCB3aWxsIG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgY29udGFpbmVkSW46IGZ1bmN0aW9uKGtleSwgdmFsdWVzKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRpblwiLCB2YWx1ZXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogbm90IGJlIGNvbnRhaW5lZCBpbiB0aGUgcHJvdmlkZWQgbGlzdCBvZiB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRoYXQgd2lsbCBub3QgbWF0Y2guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBub3RDb250YWluZWRJbjogZnVuY3Rpb24oa2V5LCB2YWx1ZXMpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJG5pblwiLCB2YWx1ZXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogY29udGFpbiBlYWNoIG9uZSBvZiB0aGUgcHJvdmlkZWQgbGlzdCBvZiB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLiAgVGhpcyBrZXkncyB2YWx1ZSBtdXN0IGJlIGFuIGFycmF5LlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRoYXQgd2lsbCBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGNvbnRhaW5zQWxsOiBmdW5jdGlvbihrZXksIHZhbHVlcykge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkYWxsXCIsIHZhbHVlcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IGZvciBmaW5kaW5nIG9iamVjdHMgdGhhdCBjb250YWluIHRoZSBnaXZlbiBrZXkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgc2hvdWxkIGV4aXN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZXhpc3RzOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGV4aXN0c1wiLCB0cnVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IGZvciBmaW5kaW5nIG9iamVjdHMgdGhhdCBkbyBub3QgY29udGFpbiBhIGdpdmVuIGtleS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCBzaG91bGQgbm90IGV4aXN0XG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBkb2VzTm90RXhpc3Q6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkZXhpc3RzXCIsIGZhbHNlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSByZWd1bGFyIGV4cHJlc3Npb24gY29uc3RyYWludCBmb3IgZmluZGluZyBzdHJpbmcgdmFsdWVzIHRoYXQgbWF0Y2hcbiAgICAgKiB0aGUgcHJvdmlkZWQgcmVndWxhciBleHByZXNzaW9uLlxuICAgICAqIFRoaXMgbWF5IGJlIHNsb3cgZm9yIGxhcmdlIGRhdGFzZXRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBzdHJpbmcgdG8gbWF0Y2ggaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByZWdleCBUaGUgcmVndWxhciBleHByZXNzaW9uIHBhdHRlcm4gdG8gbWF0Y2guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBtYXRjaGVzOiBmdW5jdGlvbihrZXksIHJlZ2V4LCBtb2RpZmllcnMpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJHJlZ2V4XCIsIHJlZ2V4KTtcbiAgICAgIGlmICghbW9kaWZpZXJzKSB7IG1vZGlmaWVycyA9IFwiXCI7IH1cbiAgICAgIC8vIEphdmFzY3JpcHQgcmVnZXggb3B0aW9ucyBzdXBwb3J0IG1pZyBhcyBpbmxpbmUgb3B0aW9ucyBidXQgc3RvcmUgdGhlbSBcbiAgICAgIC8vIGFzIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdC4gV2Ugc3VwcG9ydCBtaSAmIHNob3VsZCBtaWdyYXRlIHRoZW0gdG9cbiAgICAgIC8vIG1vZGlmaWVyc1xuICAgICAgaWYgKHJlZ2V4Lmlnbm9yZUNhc2UpIHsgbW9kaWZpZXJzICs9ICdpJzsgfVxuICAgICAgaWYgKHJlZ2V4Lm11bHRpbGluZSkgeyBtb2RpZmllcnMgKz0gJ20nOyB9XG5cbiAgICAgIGlmIChtb2RpZmllcnMgJiYgbW9kaWZpZXJzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRvcHRpb25zXCIsIG1vZGlmaWVycyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0aGF0IHJlcXVpcmVzIHRoYXQgYSBrZXkncyB2YWx1ZSBtYXRjaGVzIGEgUGFyc2UuUXVlcnlcbiAgICAgKiBjb25zdHJhaW50LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBjb250YWlucyB0aGUgb2JqZWN0IHRvIG1hdGNoIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgcXVlcnkuXG4gICAgICogQHBhcmFtIHtQYXJzZS5RdWVyeX0gcXVlcnkgVGhlIHF1ZXJ5IHRoYXQgc2hvdWxkIG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbWF0Y2hlc1F1ZXJ5OiBmdW5jdGlvbihrZXksIHF1ZXJ5KSB7XG4gICAgICB2YXIgcXVlcnlKU09OID0gcXVlcnkudG9KU09OKCk7XG4gICAgICBxdWVyeUpTT04uY2xhc3NOYW1lID0gcXVlcnkuY2xhc3NOYW1lO1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkaW5RdWVyeVwiLCBxdWVyeUpTT04pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0aGF0IHJlcXVpcmVzIHRoYXQgYSBrZXkncyB2YWx1ZSBub3QgbWF0Y2hlcyBhXG4gICAgICogUGFyc2UuUXVlcnkgY29uc3RyYWludC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgY29udGFpbnMgdGhlIG9iamVjdCB0byBtYXRjaCB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuUXVlcnl9IHF1ZXJ5IFRoZSBxdWVyeSB0aGF0IHNob3VsZCBub3QgbWF0Y2guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBkb2VzTm90TWF0Y2hRdWVyeTogZnVuY3Rpb24oa2V5LCBxdWVyeSkge1xuICAgICAgdmFyIHF1ZXJ5SlNPTiA9IHF1ZXJ5LnRvSlNPTigpO1xuICAgICAgcXVlcnlKU09OLmNsYXNzTmFtZSA9IHF1ZXJ5LmNsYXNzTmFtZTtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJG5vdEluUXVlcnlcIiwgcXVlcnlKU09OKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdGhhdCByZXF1aXJlcyB0aGF0IGEga2V5J3MgdmFsdWUgbWF0Y2hlcyBhIHZhbHVlIGluXG4gICAgICogYW4gb2JqZWN0IHJldHVybmVkIGJ5IGEgZGlmZmVyZW50IFBhcnNlLlF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IGNvbnRhaW5zIHRoZSB2YWx1ZSB0aGF0IGlzIGJlaW5nXG4gICAgICogICAgICAgICAgICAgICAgICAgICBtYXRjaGVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeUtleSBUaGUga2V5IGluIHRoZSBvYmplY3RzIHJldHVybmVkIGJ5IHRoZSBxdWVyeSB0b1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCBhZ2FpbnN0LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuUXVlcnl9IHF1ZXJ5IFRoZSBxdWVyeSB0byBydW4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBtYXRjaGVzS2V5SW5RdWVyeTogZnVuY3Rpb24oa2V5LCBxdWVyeUtleSwgcXVlcnkpIHtcbiAgICAgIHZhciBxdWVyeUpTT04gPSBxdWVyeS50b0pTT04oKTtcbiAgICAgIHF1ZXJ5SlNPTi5jbGFzc05hbWUgPSBxdWVyeS5jbGFzc05hbWU7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRzZWxlY3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICB7IGtleTogcXVlcnlLZXksIHF1ZXJ5OiBxdWVyeUpTT04gfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0aGF0IHJlcXVpcmVzIHRoYXQgYSBrZXkncyB2YWx1ZSBub3QgbWF0Y2ggYSB2YWx1ZSBpblxuICAgICAqIGFuIG9iamVjdCByZXR1cm5lZCBieSBhIGRpZmZlcmVudCBQYXJzZS5RdWVyeS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgdGhhdCBpcyBiZWluZ1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5S2V5IFRoZSBrZXkgaW4gdGhlIG9iamVjdHMgcmV0dXJuZWQgYnkgdGhlIHF1ZXJ5IHRvXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoIGFnYWluc3QuXG4gICAgICogQHBhcmFtIHtQYXJzZS5RdWVyeX0gcXVlcnkgVGhlIHF1ZXJ5IHRvIHJ1bi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGRvZXNOb3RNYXRjaEtleUluUXVlcnk6IGZ1bmN0aW9uKGtleSwgcXVlcnlLZXksIHF1ZXJ5KSB7XG4gICAgICB2YXIgcXVlcnlKU09OID0gcXVlcnkudG9KU09OKCk7XG4gICAgICBxdWVyeUpTT04uY2xhc3NOYW1lID0gcXVlcnkuY2xhc3NOYW1lO1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkZG9udFNlbGVjdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHsga2V5OiBxdWVyeUtleSwgcXVlcnk6IHF1ZXJ5SlNPTiB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgY29uc3RyYWludCB0aGF0IGF0IGxlYXN0IG9uZSBvZiB0aGUgcGFzc2VkIGluIHF1ZXJpZXMgbWF0Y2hlcy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBxdWVyaWVzXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBfb3JRdWVyeTogZnVuY3Rpb24ocXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5SlNPTiA9IF8ubWFwKHF1ZXJpZXMsIGZ1bmN0aW9uKHEpIHtcbiAgICAgICAgcmV0dXJuIHEudG9KU09OKCkud2hlcmU7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fd2hlcmUuJG9yID0gcXVlcnlKU09OO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgc3RyaW5nIGludG8gYSByZWdleCB0aGF0IG1hdGNoZXMgaXQuXG4gICAgICogU3Vycm91bmRpbmcgd2l0aCBcXFEgLi4gXFxFIGRvZXMgdGhpcywgd2UganVzdCBuZWVkIHRvIGVzY2FwZSBcXEUncyBpblxuICAgICAqIHRoZSB0ZXh0IHNlcGFyYXRlbHkuXG4gICAgICovXG4gICAgX3F1b3RlOiBmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gXCJcXFxcUVwiICsgcy5yZXBsYWNlKFwiXFxcXEVcIiwgXCJcXFxcRVxcXFxcXFxcRVxcXFxRXCIpICsgXCJcXFxcRVwiO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IGZvciBmaW5kaW5nIHN0cmluZyB2YWx1ZXMgdGhhdCBjb250YWluIGEgcHJvdmlkZWRcbiAgICAgKiBzdHJpbmcuICBUaGlzIG1heSBiZSBzbG93IGZvciBsYXJnZSBkYXRhc2V0cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgc3RyaW5nIHRvIG1hdGNoIGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3Vic3RyaW5nIFRoZSBzdWJzdHJpbmcgdGhhdCB0aGUgdmFsdWUgbXVzdCBjb250YWluLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJHJlZ2V4XCIsIHRoaXMuX3F1b3RlKHZhbHVlKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBzdHJpbmcgdmFsdWVzIHRoYXQgc3RhcnQgd2l0aCBhIHByb3ZpZGVkXG4gICAgICogc3RyaW5nLiAgVGhpcyBxdWVyeSB3aWxsIHVzZSB0aGUgYmFja2VuZCBpbmRleCwgc28gaXQgd2lsbCBiZSBmYXN0IGV2ZW5cbiAgICAgKiBmb3IgbGFyZ2UgZGF0YXNldHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIHN0cmluZyB0byBtYXRjaCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeCBUaGUgc3Vic3RyaW5nIHRoYXQgdGhlIHZhbHVlIG11c3Qgc3RhcnQgd2l0aC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJHJlZ2V4XCIsIFwiXlwiICsgdGhpcy5fcXVvdGUodmFsdWUpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IGZvciBmaW5kaW5nIHN0cmluZyB2YWx1ZXMgdGhhdCBlbmQgd2l0aCBhIHByb3ZpZGVkXG4gICAgICogc3RyaW5nLiAgVGhpcyB3aWxsIGJlIHNsb3cgZm9yIGxhcmdlIGRhdGFzZXRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBzdHJpbmcgdG8gbWF0Y2ggaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXggVGhlIHN1YnN0cmluZyB0aGF0IHRoZSB2YWx1ZSBtdXN0IGVuZCB3aXRoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZW5kc1dpdGg6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJHJlZ2V4XCIsIHRoaXMuX3F1b3RlKHZhbHVlKSArIFwiJFwiKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgcmVzdWx0cyBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdGhlIGdpdmVuIGtleS5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyhTdHJpbmd8U3RyaW5nW118Li4uU3RyaW5nfSBrZXkgVGhlIGtleSB0byBvcmRlciBieSwgd2hpY2ggaXMgYSBcbiAgICAgKiBzdHJpbmcgb2YgY29tbWEgc2VwYXJhdGVkIHZhbHVlcywgb3IgYW4gQXJyYXkgb2Yga2V5cywgb3IgbXVsdGlwbGUga2V5cy5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGFzY2VuZGluZzogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgcmV0dXJuIHRoaXMuYWRkQXNjZW5kaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNvcnRzIHRoZSByZXN1bHRzIGluIGFzY2VuZGluZyBvcmRlciBieSB0aGUgZ2l2ZW4ga2V5LCBcbiAgICAgKiBidXQgY2FuIGFsc28gYWRkIHNlY29uZGFyeSBzb3J0IGRlc2NyaXB0b3JzIHdpdGhvdXQgb3ZlcndyaXRpbmcgX29yZGVyLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7KFN0cmluZ3xTdHJpbmdbXXwuLi5TdHJpbmd9IGtleSBUaGUga2V5IHRvIG9yZGVyIGJ5LCB3aGljaCBpcyBhXG4gICAgICogc3RyaW5nIG9mIGNvbW1hIHNlcGFyYXRlZCB2YWx1ZXMsIG9yIGFuIEFycmF5IG9mIGtleXMsIG9yIG11bHRpcGxlIGtleXMuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBhZGRBc2NlbmRpbmc6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzOyBcbiAgICAgIGlmICghdGhpcy5fb3JkZXIpIHtcbiAgICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgIH1cbiAgICAgIFBhcnNlLl9hcnJheUVhY2goYXJndW1lbnRzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleS5qb2luKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fb3JkZXIgPSBzZWxmLl9vcmRlci5jb25jYXQoa2V5LnJlcGxhY2UoL1xccy9nLCBcIlwiKS5zcGxpdChcIixcIikpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU29ydHMgdGhlIHJlc3VsdHMgaW4gZGVzY2VuZGluZyBvcmRlciBieSB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7KFN0cmluZ3xTdHJpbmdbXXwuLi5TdHJpbmd9IGtleSBUaGUga2V5IHRvIG9yZGVyIGJ5LCB3aGljaCBpcyBhXG4gICAgICogc3RyaW5nIG9mIGNvbW1hIHNlcGFyYXRlZCB2YWx1ZXMsIG9yIGFuIEFycmF5IG9mIGtleXMsIG9yIG11bHRpcGxlIGtleXMuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBkZXNjZW5kaW5nOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgICByZXR1cm4gdGhpcy5hZGREZXNjZW5kaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNvcnRzIHRoZSByZXN1bHRzIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdGhlIGdpdmVuIGtleSxcbiAgICAgKiBidXQgY2FuIGFsc28gYWRkIHNlY29uZGFyeSBzb3J0IGRlc2NyaXB0b3JzIHdpdGhvdXQgb3ZlcndyaXRpbmcgX29yZGVyLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7KFN0cmluZ3xTdHJpbmdbXXwuLi5TdHJpbmd9IGtleSBUaGUga2V5IHRvIG9yZGVyIGJ5LCB3aGljaCBpcyBhXG4gICAgICogc3RyaW5nIG9mIGNvbW1hIHNlcGFyYXRlZCB2YWx1ZXMsIG9yIGFuIEFycmF5IG9mIGtleXMsIG9yIG11bHRpcGxlIGtleXMuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBhZGREZXNjZW5kaW5nOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpczsgXG4gICAgICBpZiAoIXRoaXMuX29yZGVyKSB7XG4gICAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgICB9XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXkuam9pbigpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX29yZGVyID0gc2VsZi5fb3JkZXIuY29uY2F0KFxuICAgICAgICAgIF8ubWFwKGtleS5yZXBsYWNlKC9cXHMvZywgXCJcIikuc3BsaXQoXCIsXCIpLCBcbiAgICAgICAgICAgIGZ1bmN0aW9uKGspIHsgcmV0dXJuIFwiLVwiICsgazsgfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJveGltaXR5IGJhc2VkIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB3aXRoIGtleSBwb2ludFxuICAgICAqIHZhbHVlcyBuZWFyIHRoZSBwb2ludCBnaXZlbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgUGFyc2UuR2VvUG9pbnQgaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IFRoZSByZWZlcmVuY2UgUGFyc2UuR2VvUG9pbnQgdGhhdCBpcyB1c2VkLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbmVhcjogZnVuY3Rpb24oa2V5LCBwb2ludCkge1xuICAgICAgaWYgKCEocG9pbnQgaW5zdGFuY2VvZiBQYXJzZS5HZW9Qb2ludCkpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGNhc3QgaXQgdG8gYSBHZW9Qb2ludCwgc28gdGhhdCBuZWFyKFwibG9jXCIsIFsyMCwzMF0pIHdvcmtzLlxuICAgICAgICBwb2ludCA9IG5ldyBQYXJzZS5HZW9Qb2ludChwb2ludCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRuZWFyU3BoZXJlXCIsIHBvaW50KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm94aW1pdHkgYmFzZWQgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHdpdGgga2V5IHBvaW50XG4gICAgICogdmFsdWVzIG5lYXIgdGhlIHBvaW50IGdpdmVuIGFuZCB3aXRoaW4gdGhlIG1heGltdW0gZGlzdGFuY2UgZ2l2ZW4uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIFBhcnNlLkdlb1BvaW50IGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCBUaGUgcmVmZXJlbmNlIFBhcnNlLkdlb1BvaW50IHRoYXQgaXMgdXNlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbWF4RGlzdGFuY2UgTWF4aW11bSBkaXN0YW5jZSAoaW4gcmFkaWFucykgb2YgcmVzdWx0cyB0b1xuICAgICAqICAgcmV0dXJuLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgd2l0aGluUmFkaWFuczogZnVuY3Rpb24oa2V5LCBwb2ludCwgZGlzdGFuY2UpIHtcbiAgICAgIHRoaXMubmVhcihrZXksIHBvaW50KTtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJG1heERpc3RhbmNlXCIsIGRpc3RhbmNlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm94aW1pdHkgYmFzZWQgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHdpdGgga2V5IHBvaW50XG4gICAgICogdmFsdWVzIG5lYXIgdGhlIHBvaW50IGdpdmVuIGFuZCB3aXRoaW4gdGhlIG1heGltdW0gZGlzdGFuY2UgZ2l2ZW4uXG4gICAgICogUmFkaXVzIG9mIGVhcnRoIHVzZWQgaXMgMzk1OC44IG1pbGVzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBQYXJzZS5HZW9Qb2ludCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgVGhlIHJlZmVyZW5jZSBQYXJzZS5HZW9Qb2ludCB0aGF0IGlzIHVzZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG1heERpc3RhbmNlIE1heGltdW0gZGlzdGFuY2UgKGluIG1pbGVzKSBvZiByZXN1bHRzIHRvXG4gICAgICogICAgIHJldHVybi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHdpdGhpbk1pbGVzOiBmdW5jdGlvbihrZXksIHBvaW50LCBkaXN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMud2l0aGluUmFkaWFucyhrZXksIHBvaW50LCBkaXN0YW5jZSAvIDM5NTguOCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3hpbWl0eSBiYXNlZCBjb25zdHJhaW50IGZvciBmaW5kaW5nIG9iamVjdHMgd2l0aCBrZXkgcG9pbnRcbiAgICAgKiB2YWx1ZXMgbmVhciB0aGUgcG9pbnQgZ2l2ZW4gYW5kIHdpdGhpbiB0aGUgbWF4aW11bSBkaXN0YW5jZSBnaXZlbi5cbiAgICAgKiBSYWRpdXMgb2YgZWFydGggdXNlZCBpcyA2MzcxLjAga2lsb21ldGVycy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgUGFyc2UuR2VvUG9pbnQgaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IFRoZSByZWZlcmVuY2UgUGFyc2UuR2VvUG9pbnQgdGhhdCBpcyB1c2VkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhEaXN0YW5jZSBNYXhpbXVtIGRpc3RhbmNlIChpbiBraWxvbWV0ZXJzKSBvZiByZXN1bHRzXG4gICAgICogICAgIHRvIHJldHVybi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHdpdGhpbktpbG9tZXRlcnM6IGZ1bmN0aW9uKGtleSwgcG9pbnQsIGRpc3RhbmNlKSB7XG4gICAgICByZXR1cm4gdGhpcy53aXRoaW5SYWRpYW5zKGtleSwgcG9pbnQsIGRpc3RhbmNlIC8gNjM3MS4wKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3NcbiAgICAgKiBjb29yZGluYXRlcyBiZSBjb250YWluZWQgd2l0aGluIGEgZ2l2ZW4gcmVjdGFuZ3VsYXIgZ2VvZ3JhcGhpYyBib3VuZGluZ1xuICAgICAqIGJveC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYmUgY29uc3RyYWluZWQuXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gc291dGh3ZXN0XG4gICAgICogICAgIFRoZSBsb3dlci1sZWZ0IGluY2x1c2l2ZSBjb3JuZXIgb2YgdGhlIGJveC5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBub3J0aGVhc3RcbiAgICAgKiAgICAgVGhlIHVwcGVyLXJpZ2h0IGluY2x1c2l2ZSBjb3JuZXIgb2YgdGhlIGJveC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHdpdGhpbkdlb0JveDogZnVuY3Rpb24oa2V5LCBzb3V0aHdlc3QsIG5vcnRoZWFzdCkge1xuICAgICAgaWYgKCEoc291dGh3ZXN0IGluc3RhbmNlb2YgUGFyc2UuR2VvUG9pbnQpKSB7XG4gICAgICAgIHNvdXRod2VzdCA9IG5ldyBQYXJzZS5HZW9Qb2ludChzb3V0aHdlc3QpO1xuICAgICAgfVxuICAgICAgaWYgKCEobm9ydGhlYXN0IGluc3RhbmNlb2YgUGFyc2UuR2VvUG9pbnQpKSB7XG4gICAgICAgIG5vcnRoZWFzdCA9IG5ldyBQYXJzZS5HZW9Qb2ludChub3J0aGVhc3QpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgJyR3aXRoaW4nLCB7ICckYm94JzogW3NvdXRod2VzdCwgbm9ydGhlYXN0XSB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbmNsdWRlIG5lc3RlZCBQYXJzZS5PYmplY3RzIGZvciB0aGUgcHJvdmlkZWQga2V5LiAgWW91IGNhbiB1c2UgZG90XG4gICAgICogbm90YXRpb24gdG8gc3BlY2lmeSB3aGljaCBmaWVsZHMgaW4gdGhlIGluY2x1ZGVkIG9iamVjdCBhcmUgYWxzbyBmZXRjaGVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIG5hbWUgb2YgdGhlIGtleSB0byBpbmNsdWRlLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgaW5jbHVkZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIHNlbGYuX2luY2x1ZGUgPSBzZWxmLl9pbmNsdWRlLmNvbmNhdChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuX2luY2x1ZGUucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXN0cmljdCB0aGUgZmllbGRzIG9mIHRoZSByZXR1cm5lZCBQYXJzZS5PYmplY3RzIHRvIGluY2x1ZGUgb25seSB0aGVcbiAgICAgKiBwcm92aWRlZCBrZXlzLiAgSWYgdGhpcyBpcyBjYWxsZWQgbXVsdGlwbGUgdGltZXMsIHRoZW4gYWxsIG9mIHRoZSBrZXlzXG4gICAgICogc3BlY2lmaWVkIGluIGVhY2ggb2YgdGhlIGNhbGxzIHdpbGwgYmUgaW5jbHVkZWQuXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBUaGUgbmFtZXMgb2YgdGhlIGtleXMgdG8gaW5jbHVkZS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHNlbGVjdDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLl9zZWxlY3QgPSB0aGlzLl9zZWxlY3QgfHwgW107XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIHNlbGYuX3NlbGVjdCA9IHNlbGYuX3NlbGVjdC5jb25jYXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLl9zZWxlY3QucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGVhY2ggcmVzdWx0IG9mIGEgcXVlcnksIGNhbGxpbmcgYSBjYWxsYmFjayBmb3IgZWFjaCBvbmUuIElmXG4gICAgICogdGhlIGNhbGxiYWNrIHJldHVybnMgYSBwcm9taXNlLCB0aGUgaXRlcmF0aW9uIHdpbGwgbm90IGNvbnRpbnVlIHVudGlsXG4gICAgICogdGhhdCBwcm9taXNlIGhhcyBiZWVuIGZ1bGZpbGxlZC4gSWYgdGhlIGNhbGxiYWNrIHJldHVybnMgYSByZWplY3RlZFxuICAgICAqIHByb21pc2UsIHRoZW4gaXRlcmF0aW9uIHdpbGwgc3RvcCB3aXRoIHRoYXQgZXJyb3IuIFRoZSBpdGVtcyBhcmVcbiAgICAgKiBwcm9jZXNzZWQgaW4gYW4gdW5zcGVjaWZpZWQgb3JkZXIuIFRoZSBxdWVyeSBtYXkgbm90IGhhdmUgYW55IHNvcnQgb3JkZXIsXG4gICAgICogYW5kIG1heSBub3QgdXNlIGxpbWl0IG9yIHNraXAuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGVhY2ggcmVzdWx0XG4gICAgICogICAgIG9mIHRoZSBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBCYWNrYm9uZS1saWtlIG9wdGlvbnMgb2JqZWN0IHdpdGhcbiAgICAgKiAgICAgc3VjY2VzcyBhbmQgZXJyb3IgY2FsbGJhY2tzIHRoYXQgd2lsbCBiZSBpbnZva2VkIG9uY2UgdGhlIGl0ZXJhdGlvblxuICAgICAqICAgICBoYXMgZmluaXNoZWQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgb25jZSB0aGVcbiAgICAgKiAgICAgaXRlcmF0aW9uIGhhcyBjb21wbGV0ZWQuXG4gICAgICovXG4gICAgZWFjaDogZnVuY3Rpb24oY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAodGhpcy5fb3JkZXIgfHwgdGhpcy5fc2tpcCB8fCAodGhpcy5fbGltaXQgPj0gMCkpIHtcbiAgICAgICAgdmFyIGVycm9yID1cbiAgICAgICAgICBcIkNhbm5vdCBpdGVyYXRlIG9uIGEgcXVlcnkgd2l0aCBzb3J0LCBza2lwLCBvciBsaW1pdC5cIjtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG5cbiAgICAgIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeSh0aGlzLm9iamVjdENsYXNzKTtcbiAgICAgIC8vIFdlIGNhbiBvdmVycmlkZSB0aGUgYmF0Y2ggc2l6ZSBmcm9tIHRoZSBvcHRpb25zLlxuICAgICAgLy8gVGhpcyBpcyB1bmRvY3VtZW50ZWQsIGJ1dCB1c2VmdWwgZm9yIHRlc3RpbmcuXG4gICAgICBxdWVyeS5fbGltaXQgPSBvcHRpb25zLmJhdGNoU2l6ZSB8fCAxMDA7XG4gICAgICBxdWVyeS5fd2hlcmUgPSBfLmNsb25lKHRoaXMuX3doZXJlKTtcbiAgICAgIHF1ZXJ5Ll9pbmNsdWRlID0gXy5jbG9uZSh0aGlzLl9pbmNsdWRlKTtcbiAgICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgICAgcXVlcnkuX3NlbGVjdCA9IF8uY2xvbmUodGhpcy5fc2VsZWN0KTtcbiAgICAgIH1cblxuICAgICAgcXVlcnkuYXNjZW5kaW5nKCdvYmplY3RJZCcpO1xuXG4gICAgICB2YXIgZmluZE9wdGlvbnMgPSB7fTtcbiAgICAgIGlmIChfLmhhcyhvcHRpb25zLCBcInVzZU1hc3RlcktleVwiKSkge1xuICAgICAgICBmaW5kT3B0aW9ucy51c2VNYXN0ZXJLZXkgPSBvcHRpb25zLnVzZU1hc3RlcktleTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpbmlzaGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5fY29udGludWVXaGlsZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICFmaW5pc2hlZDtcblxuICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBxdWVyeS5maW5kKGZpbmRPcHRpb25zKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2tzRG9uZSA9IFBhcnNlLlByb21pc2UuYXMoKTtcbiAgICAgICAgICBQYXJzZS5fLmVhY2gocmVzdWx0cywgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBjYWxsYmFja3NEb25lID0gY2FsbGJhY2tzRG9uZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrc0RvbmUudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA+PSBxdWVyeS5fbGltaXQpIHtcbiAgICAgICAgICAgICAgcXVlcnkuZ3JlYXRlclRoYW4oXCJvYmplY3RJZFwiLCByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoIC0gMV0uaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcblxufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIEZCOiBmYWxzZSAsIGNvbnNvbGU6IGZhbHNlKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgdmFyIFBVQkxJQ19LRVkgPSBcIipcIjtcblxuICB2YXIgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgdmFyIHJlcXVlc3RlZFBlcm1pc3Npb25zO1xuICB2YXIgaW5pdE9wdGlvbnM7XG4gIHZhciBwcm92aWRlciA9IHtcbiAgICBhdXRoZW50aWNhdGU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3Moc2VsZiwge1xuICAgICAgICAgICAgICBpZDogcmVzcG9uc2UuYXV0aFJlc3BvbnNlLnVzZXJJRCxcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiByZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgIGV4cGlyYXRpb25fZGF0ZTogbmV3IERhdGUocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmV4cGlyZXNJbiAqIDEwMDAgK1xuICAgICAgICAgICAgICAgICAgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkudG9KU09OKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgb3B0aW9ucy5lcnJvcihzZWxmLCByZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHNjb3BlOiByZXF1ZXN0ZWRQZXJtaXNzaW9uc1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZXN0b3JlQXV0aGVudGljYXRpb246IGZ1bmN0aW9uKGF1dGhEYXRhKSB7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgdmFyIGF1dGhSZXNwb25zZSA9IHtcbiAgICAgICAgICB1c2VySUQ6IGF1dGhEYXRhLmlkLFxuICAgICAgICAgIGFjY2Vzc1Rva2VuOiBhdXRoRGF0YS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgZXhwaXJlc0luOiAoUGFyc2UuX3BhcnNlRGF0ZShhdXRoRGF0YS5leHBpcmF0aW9uX2RhdGUpLmdldFRpbWUoKSAtXG4gICAgICAgICAgICAgIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpIC8gMTAwMFxuICAgICAgICB9O1xuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUoaW5pdE9wdGlvbnMpO1xuICAgICAgICBuZXdPcHRpb25zLmF1dGhSZXNwb25zZSA9IGF1dGhSZXNwb25zZTtcblxuICAgICAgICAvLyBTdXBwcmVzcyBjaGVja3MgZm9yIGxvZ2luIHN0YXR1cyBmcm9tIHRoZSBicm93c2VyLlxuICAgICAgICBuZXdPcHRpb25zLnN0YXR1cyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIElmIHRoZSB1c2VyIGRvZXNuJ3QgbWF0Y2ggdGhlIG9uZSBrbm93biBieSB0aGUgRkIgU0RLLCBsb2cgb3V0LlxuICAgICAgICAvLyBNb3N0IG9mIHRoZSB0aW1lLCB0aGUgdXNlcnMgd2lsbCBtYXRjaCAtLSBpdCdzIG9ubHkgaW4gY2FzZXMgd2hlcmVcbiAgICAgICAgLy8gdGhlIEZCIFNESyBrbm93cyBvZiBhIGRpZmZlcmVudCB1c2VyIHRoYW4gdGhlIG9uZSBiZWluZyByZXN0b3JlZFxuICAgICAgICAvLyBmcm9tIGEgUGFyc2UgVXNlciB0aGF0IGxvZ2dlZCBpbiB3aXRoIHVzZXJuYW1lL3Bhc3N3b3JkLlxuICAgICAgICB2YXIgZXhpc3RpbmdSZXNwb25zZSA9IEZCLmdldEF1dGhSZXNwb25zZSgpO1xuICAgICAgICBpZiAoZXhpc3RpbmdSZXNwb25zZSAmJlxuICAgICAgICAgICAgZXhpc3RpbmdSZXNwb25zZS51c2VySUQgIT09IGF1dGhSZXNwb25zZS51c2VySUQpIHtcbiAgICAgICAgICBGQi5sb2dvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEZCLmluaXQobmV3T3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGdldEF1dGhUeXBlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBcImZhY2Vib29rXCI7XG4gICAgfSxcbiAgICBkZWF1dGhlbnRpY2F0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJlc3RvcmVBdXRoZW50aWNhdGlvbihudWxsKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgc2V0IG9mIHV0aWxpdGllcyBmb3IgdXNpbmcgUGFyc2Ugd2l0aCBGYWNlYm9vay5cbiAgICogQG5hbWVzcGFjZVxuICAgKiBQcm92aWRlcyBhIHNldCBvZiB1dGlsaXRpZXMgZm9yIHVzaW5nIFBhcnNlIHdpdGggRmFjZWJvb2suXG4gICAqL1xuICBQYXJzZS5GYWNlYm9va1V0aWxzID0ge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIFBhcnNlIEZhY2Vib29rIGludGVncmF0aW9uLiAgQ2FsbCB0aGlzIGZ1bmN0aW9uIGFmdGVyIHlvdVxuICAgICAqIGhhdmUgbG9hZGVkIHRoZSBGYWNlYm9vayBKYXZhc2NyaXB0IFNESyB3aXRoIHRoZSBzYW1lIHBhcmFtZXRlcnNcbiAgICAgKiBhcyB5b3Ugd291bGQgcGFzcyB0bzxjb2RlPlxuICAgICAqIDxhIGhyZWY9XG4gICAgICogXCJodHRwczovL2RldmVsb3BlcnMuZmFjZWJvb2suY29tL2RvY3MvcmVmZXJlbmNlL2phdmFzY3JpcHQvRkIuaW5pdC9cIj5cbiAgICAgKiBGQi5pbml0KCk8L2E+PC9jb2RlPi4gIFBhcnNlLkZhY2Vib29rVXRpbHMgd2lsbCBpbnZva2UgRkIuaW5pdCgpIGZvciB5b3VcbiAgICAgKiB3aXRoIHRoZXNlIGFyZ3VtZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEZhY2Vib29rIG9wdGlvbnMgYXJndW1lbnQgYXMgZGVzY3JpYmVkIGhlcmU6XG4gICAgICogICA8YSBocmVmPVxuICAgICAqICAgXCJodHRwczovL2RldmVsb3BlcnMuZmFjZWJvb2suY29tL2RvY3MvcmVmZXJlbmNlL2phdmFzY3JpcHQvRkIuaW5pdC9cIj5cbiAgICAgKiAgIEZCLmluaXQoKTwvYT4uIFRoZSBzdGF0dXMgZmxhZyB3aWxsIGJlIGNvZXJjZWQgdG8gJ2ZhbHNlJyBiZWNhdXNlIGl0XG4gICAgICogICBpbnRlcmZlcmVzIHdpdGggUGFyc2UgRmFjZWJvb2sgaW50ZWdyYXRpb24uIENhbGwgRkIuZ2V0TG9naW5TdGF0dXMoKVxuICAgICAqICAgZXhwbGljaXRseSBpZiB0aGlzIGJlaGF2aW9yIGlzIHJlcXVpcmVkIGJ5IHlvdXIgYXBwbGljYXRpb24uXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgaWYgKHR5cGVvZihGQikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IFwiVGhlIEZhY2Vib29rIEphdmFTY3JpcHQgU0RLIG11c3QgYmUgbG9hZGVkIGJlZm9yZSBjYWxsaW5nIGluaXQuXCI7XG4gICAgICB9IFxuICAgICAgaW5pdE9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgaWYgKGluaXRPcHRpb25zLnN0YXR1cyAmJiB0eXBlb2YoY29uc29sZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdmFyIHdhcm4gPSBjb25zb2xlLndhcm4gfHwgY29uc29sZS5sb2cgfHwgZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgd2Fybi5jYWxsKGNvbnNvbGUsIFwiVGhlICdzdGF0dXMnIGZsYWcgcGFzc2VkIGludG9cIiArXG4gICAgICAgICAgXCIgRkIuaW5pdCwgd2hlbiBzZXQgdG8gdHJ1ZSwgY2FuIGludGVyZmVyZSB3aXRoIFBhcnNlIEZhY2Vib29rXCIgK1xuICAgICAgICAgIFwiIGludGVncmF0aW9uLCBzbyBpdCBoYXMgYmVlbiBzdXBwcmVzc2VkLiBQbGVhc2UgY2FsbFwiICtcbiAgICAgICAgICBcIiBGQi5nZXRMb2dpblN0YXR1cygpIGV4cGxpY2l0bHkgaWYgeW91IHJlcXVpcmUgdGhpcyBiZWhhdmlvci5cIik7XG4gICAgICB9XG4gICAgICBpbml0T3B0aW9ucy5zdGF0dXMgPSBmYWxzZTtcbiAgICAgIEZCLmluaXQoaW5pdE9wdGlvbnMpO1xuICAgICAgUGFyc2UuVXNlci5fcmVnaXN0ZXJBdXRoZW50aWNhdGlvblByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB3aGV0aGVyIHRoZSB1c2VyIGhhcyB0aGVpciBhY2NvdW50IGxpbmtlZCB0byBGYWNlYm9vay5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1BhcnNlLlVzZXJ9IHVzZXIgVXNlciB0byBjaGVjayBmb3IgYSBmYWNlYm9vayBsaW5rLlxuICAgICAqICAgICBUaGUgdXNlciBtdXN0IGJlIGxvZ2dlZCBpbiBvbiB0aGlzIGRldmljZS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgdXNlciBoYXMgdGhlaXIgYWNjb3VudFxuICAgICAqICAgICBsaW5rZWQgdG8gRmFjZWJvb2suXG4gICAgICovXG4gICAgaXNMaW5rZWQ6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyLl9pc0xpbmtlZChcImZhY2Vib29rXCIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGluIGEgdXNlciB1c2luZyBGYWNlYm9vay4gVGhpcyBtZXRob2QgZGVsZWdhdGVzIHRvIHRoZSBGYWNlYm9va1xuICAgICAqIFNESyB0byBhdXRoZW50aWNhdGUgdGhlIHVzZXIsIGFuZCB0aGVuIGF1dG9tYXRpY2FsbHkgbG9ncyBpbiAob3JcbiAgICAgKiBjcmVhdGVzLCBpbiB0aGUgY2FzZSB3aGVyZSBpdCBpcyBhIG5ldyB1c2VyKSBhIFBhcnNlLlVzZXIuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmcsIE9iamVjdH0gcGVybWlzc2lvbnMgVGhlIHBlcm1pc3Npb25zIHJlcXVpcmVkIGZvciBGYWNlYm9va1xuICAgICAqICAgIGxvZyBpbi4gIFRoaXMgaXMgYSBjb21tYS1zZXBhcmF0ZWQgc3RyaW5nIG9mIHBlcm1pc3Npb25zLlxuICAgICAqICAgIEFsdGVybmF0aXZlbHksIHN1cHBseSBhIEZhY2Vib29rIGF1dGhEYXRhIG9iamVjdCBhcyBkZXNjcmliZWQgaW4gb3VyXG4gICAgICogICAgUkVTVCBBUEkgZG9jcyBpZiB5b3Ugd2FudCB0byBoYW5kbGUgZ2V0dGluZyBmYWNlYm9vayBhdXRoIHRva2Vuc1xuICAgICAqICAgIHlvdXJzZWxmLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFN0YW5kYXJkIG9wdGlvbnMgb2JqZWN0IHdpdGggc3VjY2VzcyBhbmQgZXJyb3JcbiAgICAgKiAgICBjYWxsYmFja3MuXG4gICAgICovXG4gICAgbG9nSW46IGZ1bmN0aW9uKHBlcm1pc3Npb25zLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIXBlcm1pc3Npb25zIHx8IF8uaXNTdHJpbmcocGVybWlzc2lvbnMpKSB7XG4gICAgICAgIGlmICghaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICB0aHJvdyBcIllvdSBtdXN0IGluaXRpYWxpemUgRmFjZWJvb2tVdGlscyBiZWZvcmUgY2FsbGluZyBsb2dJbi5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0ZWRQZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zO1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fbG9nSW5XaXRoKFwiZmFjZWJvb2tcIiwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICAgIG5ld09wdGlvbnMuYXV0aERhdGEgPSBwZXJtaXNzaW9ucztcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2xvZ0luV2l0aChcImZhY2Vib29rXCIsIG5ld09wdGlvbnMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMaW5rcyBGYWNlYm9vayB0byBhbiBleGlzdGluZyBQRlVzZXIuIFRoaXMgbWV0aG9kIGRlbGVnYXRlcyB0byB0aGVcbiAgICAgKiBGYWNlYm9vayBTREsgdG8gYXV0aGVudGljYXRlIHRoZSB1c2VyLCBhbmQgdGhlbiBhdXRvbWF0aWNhbGx5IGxpbmtzXG4gICAgICogdGhlIGFjY291bnQgdG8gdGhlIFBhcnNlLlVzZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BhcnNlLlVzZXJ9IHVzZXIgVXNlciB0byBsaW5rIHRvIEZhY2Vib29rLiBUaGlzIG11c3QgYmUgdGhlXG4gICAgICogICAgIGN1cnJlbnQgdXNlci5cbiAgICAgKiBAcGFyYW0ge1N0cmluZywgT2JqZWN0fSBwZXJtaXNzaW9ucyBUaGUgcGVybWlzc2lvbnMgcmVxdWlyZWQgZm9yIEZhY2Vib29rXG4gICAgICogICAgbG9nIGluLiAgVGhpcyBpcyBhIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgb2YgcGVybWlzc2lvbnMuIFxuICAgICAqICAgIEFsdGVybmF0aXZlbHksIHN1cHBseSBhIEZhY2Vib29rIGF1dGhEYXRhIG9iamVjdCBhcyBkZXNjcmliZWQgaW4gb3VyXG4gICAgICogICAgUkVTVCBBUEkgZG9jcyBpZiB5b3Ugd2FudCB0byBoYW5kbGUgZ2V0dGluZyBmYWNlYm9vayBhdXRoIHRva2Vuc1xuICAgICAqICAgIHlvdXJzZWxmLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFN0YW5kYXJkIG9wdGlvbnMgb2JqZWN0IHdpdGggc3VjY2VzcyBhbmQgZXJyb3JcbiAgICAgKiAgICBjYWxsYmFja3MuXG4gICAgICovXG4gICAgbGluazogZnVuY3Rpb24odXNlciwgcGVybWlzc2lvbnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghcGVybWlzc2lvbnMgfHwgXy5pc1N0cmluZyhwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgICAgICAgIHRocm93IFwiWW91IG11c3QgaW5pdGlhbGl6ZSBGYWNlYm9va1V0aWxzIGJlZm9yZSBjYWxsaW5nIGxpbmsuXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdGVkUGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucztcbiAgICAgICAgcmV0dXJuIHVzZXIuX2xpbmtXaXRoKFwiZmFjZWJvb2tcIiwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICAgIG5ld09wdGlvbnMuYXV0aERhdGEgPSBwZXJtaXNzaW9ucztcbiAgICAgICAgcmV0dXJuIHVzZXIuX2xpbmtXaXRoKFwiZmFjZWJvb2tcIiwgbmV3T3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVubGlua3MgdGhlIFBhcnNlLlVzZXIgZnJvbSBhIEZhY2Vib29rIGFjY291bnQuIFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7UGFyc2UuVXNlcn0gdXNlciBVc2VyIHRvIHVubGluayBmcm9tIEZhY2Vib29rLiBUaGlzIG11c3QgYmUgdGhlXG4gICAgICogICAgIGN1cnJlbnQgdXNlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBTdGFuZGFyZCBvcHRpb25zIG9iamVjdCB3aXRoIHN1Y2Nlc3MgYW5kIGVycm9yXG4gICAgICogICAgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHVubGluazogZnVuY3Rpb24odXNlciwgb3B0aW9ucykge1xuICAgICAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgICAgICB0aHJvdyBcIllvdSBtdXN0IGluaXRpYWxpemUgRmFjZWJvb2tVdGlscyBiZWZvcmUgY2FsbGluZyB1bmxpbmsuXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXNlci5fdW5saW5rRnJvbShcImZhY2Vib29rXCIsIG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcbiAgXG59KHRoaXMpKTtcblxuLypnbG9iYWwgXzogZmFsc2UsIGRvY3VtZW50OiBmYWxzZSwgd2luZG93OiBmYWxzZSwgbmF2aWdhdG9yOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogSGlzdG9yeSBzZXJ2ZXMgYXMgYSBnbG9iYWwgcm91dGVyIChwZXIgZnJhbWUpIHRvIGhhbmRsZSBoYXNoY2hhbmdlXG4gICAqIGV2ZW50cyBvciBwdXNoU3RhdGUsIG1hdGNoIHRoZSBhcHByb3ByaWF0ZSByb3V0ZSwgYW5kIHRyaWdnZXJcbiAgICogY2FsbGJhY2tzLiBZb3Ugc2hvdWxkbid0IGV2ZXIgaGF2ZSB0byBjcmVhdGUgb25lIG9mIHRoZXNlIHlvdXJzZWxmXG4gICAqIOKAlCB5b3Ugc2hvdWxkIHVzZSB0aGUgcmVmZXJlbmNlIHRvIDxjb2RlPlBhcnNlLmhpc3Rvcnk8L2NvZGU+XG4gICAqIHRoYXQgd2lsbCBiZSBjcmVhdGVkIGZvciB5b3UgYXV0b21hdGljYWxseSBpZiB5b3UgbWFrZSB1c2Ugb2YgXG4gICAqIFJvdXRlcnMgd2l0aCByb3V0ZXMuXG4gICAqIEBjbGFzc1xuICAgKiAgIFxuICAgKiA8cD5BIGZvcmsgb2YgQmFja2JvbmUuSGlzdG9yeSwgcHJvdmlkZWQgZm9yIHlvdXIgY29udmVuaWVuY2UuICBJZiB5b3UgXG4gICAqIHVzZSB0aGlzIGNsYXNzLCB5b3UgbXVzdCBhbHNvIGluY2x1ZGUgalF1ZXJ5LCBvciBhbm90aGVyIGxpYnJhcnkgXG4gICAqIHRoYXQgcHJvdmlkZXMgYSBqUXVlcnktY29tcGF0aWJsZSAkIGZ1bmN0aW9uLiAgRm9yIG1vcmUgaW5mb3JtYXRpb24sXG4gICAqIHNlZSB0aGUgPGEgaHJlZj1cImh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vYmFja2JvbmUvI0hpc3RvcnlcIj5cbiAgICogQmFja2JvbmUgZG9jdW1lbnRhdGlvbjwvYT4uPC9wPlxuICAgKiA8cD48c3Ryb25nPjxlbT5BdmFpbGFibGUgaW4gdGhlIGNsaWVudCBTREsgb25seS48L2VtPjwvc3Ryb25nPjwvcD5cbiAgICovXG4gIFBhcnNlLkhpc3RvcnkgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgXy5iaW5kQWxsKHRoaXMsICdjaGVja1VybCcpO1xuICB9O1xuXG4gIC8vIENhY2hlZCByZWdleCBmb3IgY2xlYW5pbmcgbGVhZGluZyBoYXNoZXMgYW5kIHNsYXNoZXMgLlxuICB2YXIgcm91dGVTdHJpcHBlciA9IC9eWyNcXC9dLztcblxuICAvLyBDYWNoZWQgcmVnZXggZm9yIGRldGVjdGluZyBNU0lFLlxuICB2YXIgaXNFeHBsb3JlciA9IC9tc2llIFtcXHcuXSsvO1xuXG4gIC8vIEhhcyB0aGUgaGlzdG9yeSBoYW5kbGluZyBhbHJlYWR5IGJlZW4gc3RhcnRlZD9cbiAgUGFyc2UuSGlzdG9yeS5zdGFydGVkID0gZmFsc2U7XG5cbiAgLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKlBhcnNlLkhpc3RvcnkqKiBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuICBfLmV4dGVuZChQYXJzZS5IaXN0b3J5LnByb3RvdHlwZSwgUGFyc2UuRXZlbnRzLFxuICAgICAgICAgICAvKiogQGxlbmRzIFBhcnNlLkhpc3RvcnkucHJvdG90eXBlICovIHtcblxuICAgIC8vIFRoZSBkZWZhdWx0IGludGVydmFsIHRvIHBvbGwgZm9yIGhhc2ggY2hhbmdlcywgaWYgbmVjZXNzYXJ5LCBpc1xuICAgIC8vIHR3ZW50eSB0aW1lcyBhIHNlY29uZC5cbiAgICBpbnRlcnZhbDogNTAsXG5cbiAgICAvLyBHZXRzIHRoZSB0cnVlIGhhc2ggdmFsdWUuIENhbm5vdCB1c2UgbG9jYXRpb24uaGFzaCBkaXJlY3RseSBkdWUgdG8gYnVnXG4gICAgLy8gaW4gRmlyZWZveCB3aGVyZSBsb2NhdGlvbi5oYXNoIHdpbGwgYWx3YXlzIGJlIGRlY29kZWQuXG4gICAgZ2V0SGFzaDogZnVuY3Rpb24od2luZG93T3ZlcnJpZGUpIHtcbiAgICAgIHZhciBsb2MgPSB3aW5kb3dPdmVycmlkZSA/IHdpbmRvd092ZXJyaWRlLmxvY2F0aW9uIDogd2luZG93LmxvY2F0aW9uO1xuICAgICAgdmFyIG1hdGNoID0gbG9jLmhyZWYubWF0Y2goLyMoLiopJC8pO1xuICAgICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcbiAgICB9LFxuXG4gICAgLy8gR2V0IHRoZSBjcm9zcy1icm93c2VyIG5vcm1hbGl6ZWQgVVJMIGZyYWdtZW50LCBlaXRoZXIgZnJvbSB0aGUgVVJMLFxuICAgIC8vIHRoZSBoYXNoLCBvciB0aGUgb3ZlcnJpZGUuXG4gICAgZ2V0RnJhZ21lbnQ6IGZ1bmN0aW9uKGZyYWdtZW50LCBmb3JjZVB1c2hTdGF0ZSkge1xuICAgICAgaWYgKFBhcnNlLl9pc051bGxPclVuZGVmaW5lZChmcmFnbWVudCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX2hhc1B1c2hTdGF0ZSB8fCBmb3JjZVB1c2hTdGF0ZSkge1xuICAgICAgICAgIGZyYWdtZW50ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICAgIHZhciBzZWFyY2ggPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICAgICAgICAgIGlmIChzZWFyY2gpIHtcbiAgICAgICAgICAgIGZyYWdtZW50ICs9IHNlYXJjaDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJhZ21lbnQgPSB0aGlzLmdldEhhc2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFmcmFnbWVudC5pbmRleE9mKHRoaXMub3B0aW9ucy5yb290KSkge1xuICAgICAgICBmcmFnbWVudCA9IGZyYWdtZW50LnN1YnN0cih0aGlzLm9wdGlvbnMucm9vdC5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZyYWdtZW50LnJlcGxhY2Uocm91dGVTdHJpcHBlciwgJycpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgaGFzaCBjaGFuZ2UgaGFuZGxpbmcsIHJldHVybmluZyBgdHJ1ZWAgaWYgdGhlIGN1cnJlbnRcbiAgICAgKiBVUkwgbWF0Y2hlcyBhbiBleGlzdGluZyByb3V0ZSwgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHN0YXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBpZiAoUGFyc2UuSGlzdG9yeS5zdGFydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlLmhpc3RvcnkgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkXCIpO1xuICAgICAgfVxuICAgICAgUGFyc2UuSGlzdG9yeS5zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgLy8gRmlndXJlIG91dCB0aGUgaW5pdGlhbCBjb25maWd1cmF0aW9uLiBEbyB3ZSBuZWVkIGFuIGlmcmFtZT9cbiAgICAgIC8vIElzIHB1c2hTdGF0ZSBkZXNpcmVkIC4uLiBpcyBpdCBhdmFpbGFibGU/XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCh7fSwge3Jvb3Q6ICcvJ30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB0aGlzLl93YW50c0hhc2hDaGFuZ2UgPSB0aGlzLm9wdGlvbnMuaGFzaENoYW5nZSAhPT0gZmFsc2U7XG4gICAgICB0aGlzLl93YW50c1B1c2hTdGF0ZSA9ICEhdGhpcy5vcHRpb25zLnB1c2hTdGF0ZTtcbiAgICAgIHRoaXMuX2hhc1B1c2hTdGF0ZSA9ICEhKHRoaXMub3B0aW9ucy5wdXNoU3RhdGUgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcbiAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuZ2V0RnJhZ21lbnQoKTtcbiAgICAgIHZhciBkb2NNb2RlID0gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICAgICAgdmFyIG9sZElFID0gKGlzRXhwbG9yZXIuZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmXG4gICAgICAgICAgICAgICAgICAgKCFkb2NNb2RlIHx8IGRvY01vZGUgPD0gNykpO1xuXG4gICAgICBpZiAob2xkSUUpIHtcbiAgICAgICAgdGhpcy5pZnJhbWUgPSBQYXJzZS4kKCc8aWZyYW1lIHNyYz1cImphdmFzY3JpcHQ6MFwiIHRhYmluZGV4PVwiLTFcIiAvPicpXG4gICAgICAgICAgICAgICAgICAgICAgLmhpZGUoKS5hcHBlbmRUbygnYm9keScpWzBdLmNvbnRlbnRXaW5kb3c7XG4gICAgICAgIHRoaXMubmF2aWdhdGUoZnJhZ21lbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBEZXBlbmRpbmcgb24gd2hldGhlciB3ZSdyZSB1c2luZyBwdXNoU3RhdGUgb3IgaGFzaGVzLCBhbmQgd2hldGhlclxuICAgICAgLy8gJ29uaGFzaGNoYW5nZScgaXMgc3VwcG9ydGVkLCBkZXRlcm1pbmUgaG93IHdlIGNoZWNrIHRoZSBVUkwgc3RhdGUuXG4gICAgICBpZiAodGhpcy5faGFzUHVzaFN0YXRlKSB7XG4gICAgICAgIFBhcnNlLiQod2luZG93KS5iaW5kKCdwb3BzdGF0ZScsIHRoaXMuY2hlY2tVcmwpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UgJiZcbiAgICAgICAgICAgICAgICAgKCdvbmhhc2hjaGFuZ2UnIGluIHdpbmRvdykgJiZcbiAgICAgICAgICAgICAgICAgIW9sZElFKSB7XG4gICAgICAgIFBhcnNlLiQod2luZG93KS5iaW5kKCdoYXNoY2hhbmdlJywgdGhpcy5jaGVja1VybCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSkge1xuICAgICAgICB0aGlzLl9jaGVja1VybEludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMuY2hlY2tVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnRlcnZhbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIERldGVybWluZSBpZiB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgYmFzZSB1cmwsIGZvciBhIHB1c2hTdGF0ZSBsaW5rXG4gICAgICAvLyBvcGVuZWQgYnkgYSBub24tcHVzaFN0YXRlIGJyb3dzZXIuXG4gICAgICB0aGlzLmZyYWdtZW50ID0gZnJhZ21lbnQ7XG4gICAgICB2YXIgbG9jID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgdmFyIGF0Um9vdCAgPSBsb2MucGF0aG5hbWUgPT09IHRoaXMub3B0aW9ucy5yb290O1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBzdGFydGVkIG9mZiB3aXRoIGEgcm91dGUgZnJvbSBhIGBwdXNoU3RhdGVgLWVuYWJsZWQgYnJvd3NlcixcbiAgICAgIC8vIGJ1dCB3ZSdyZSBjdXJyZW50bHkgaW4gYSBicm93c2VyIHRoYXQgZG9lc24ndCBzdXBwb3J0IGl0Li4uXG4gICAgICBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlICYmIFxuICAgICAgICAgIHRoaXMuX3dhbnRzUHVzaFN0YXRlICYmIFxuICAgICAgICAgICF0aGlzLl9oYXNQdXNoU3RhdGUgJiZcbiAgICAgICAgICAhYXRSb290KSB7XG4gICAgICAgIHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEZyYWdtZW50KG51bGwsIHRydWUpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh0aGlzLm9wdGlvbnMucm9vdCArICcjJyArIHRoaXMuZnJhZ21lbnQpO1xuICAgICAgICAvLyBSZXR1cm4gaW1tZWRpYXRlbHkgYXMgYnJvd3NlciB3aWxsIGRvIHJlZGlyZWN0IHRvIG5ldyB1cmxcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIC8vIE9yIGlmIHdlJ3ZlIHN0YXJ0ZWQgb3V0IHdpdGggYSBoYXNoLWJhc2VkIHJvdXRlLCBidXQgd2UncmUgY3VycmVudGx5XG4gICAgICAvLyBpbiBhIGJyb3dzZXIgd2hlcmUgaXQgY291bGQgYmUgYHB1c2hTdGF0ZWAtYmFzZWQgaW5zdGVhZC4uLlxuICAgICAgfSBlbHNlIGlmICh0aGlzLl93YW50c1B1c2hTdGF0ZSAmJlxuICAgICAgICAgICAgICAgICB0aGlzLl9oYXNQdXNoU3RhdGUgJiYgXG4gICAgICAgICAgICAgICAgIGF0Um9vdCAmJlxuICAgICAgICAgICAgICAgICBsb2MuaGFzaCkge1xuICAgICAgICB0aGlzLmZyYWdtZW50ID0gdGhpcy5nZXRIYXNoKCkucmVwbGFjZShyb3V0ZVN0cmlwcGVyLCAnJyk7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsXG4gICAgICAgICAgICBsb2MucHJvdG9jb2wgKyAnLy8nICsgbG9jLmhvc3QgKyB0aGlzLm9wdGlvbnMucm9vdCArIHRoaXMuZnJhZ21lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZFVybCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBEaXNhYmxlIFBhcnNlLmhpc3RvcnksIHBlcmhhcHMgdGVtcG9yYXJpbHkuIE5vdCB1c2VmdWwgaW4gYSByZWFsIGFwcCxcbiAgICAvLyBidXQgcG9zc2libHkgdXNlZnVsIGZvciB1bml0IHRlc3RpbmcgUm91dGVycy5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIFBhcnNlLiQod2luZG93KS51bmJpbmQoJ3BvcHN0YXRlJywgdGhpcy5jaGVja1VybClcbiAgICAgICAgICAgICAgICAgICAgIC51bmJpbmQoJ2hhc2hjaGFuZ2UnLCB0aGlzLmNoZWNrVXJsKTtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWwpO1xuICAgICAgUGFyc2UuSGlzdG9yeS5zdGFydGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEFkZCBhIHJvdXRlIHRvIGJlIHRlc3RlZCB3aGVuIHRoZSBmcmFnbWVudCBjaGFuZ2VzLiBSb3V0ZXMgYWRkZWQgbGF0ZXJcbiAgICAvLyBtYXkgb3ZlcnJpZGUgcHJldmlvdXMgcm91dGVzLlxuICAgIHJvdXRlOiBmdW5jdGlvbihyb3V0ZSwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMudW5zaGlmdCh7cm91dGU6IHJvdXRlLCBjYWxsYmFjazogY2FsbGJhY2t9KTtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IFVSTCB0byBzZWUgaWYgaXQgaGFzIGNoYW5nZWQsIGFuZCBpZiBpdCBoYXMsXG4gICAgLy8gY2FsbHMgYGxvYWRVcmxgLCBub3JtYWxpemluZyBhY3Jvc3MgdGhlIGhpZGRlbiBpZnJhbWUuXG4gICAgY2hlY2tVcmw6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5nZXRGcmFnbWVudCgpO1xuICAgICAgaWYgKGN1cnJlbnQgPT09IHRoaXMuZnJhZ21lbnQgJiYgdGhpcy5pZnJhbWUpIHtcbiAgICAgICAgY3VycmVudCA9IHRoaXMuZ2V0RnJhZ21lbnQodGhpcy5nZXRIYXNoKHRoaXMuaWZyYW1lKSk7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudCA9PT0gdGhpcy5mcmFnbWVudCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pZnJhbWUpIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZShjdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5sb2FkVXJsKCkpIHtcbiAgICAgICAgdGhpcy5sb2FkVXJsKHRoaXMuZ2V0SGFzaCgpKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQXR0ZW1wdCB0byBsb2FkIHRoZSBjdXJyZW50IFVSTCBmcmFnbWVudC4gSWYgYSByb3V0ZSBzdWNjZWVkcyB3aXRoIGFcbiAgICAvLyBtYXRjaCwgcmV0dXJucyBgdHJ1ZWAuIElmIG5vIGRlZmluZWQgcm91dGVzIG1hdGNoZXMgdGhlIGZyYWdtZW50LFxuICAgIC8vIHJldHVybnMgYGZhbHNlYC5cbiAgICBsb2FkVXJsOiBmdW5jdGlvbihmcmFnbWVudE92ZXJyaWRlKSB7XG4gICAgICB2YXIgZnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50ID0gdGhpcy5nZXRGcmFnbWVudChmcmFnbWVudE92ZXJyaWRlKTtcbiAgICAgIHZhciBtYXRjaGVkID0gXy5hbnkodGhpcy5oYW5kbGVycywgZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICBpZiAoaGFuZGxlci5yb3V0ZS50ZXN0KGZyYWdtZW50KSkge1xuICAgICAgICAgIGhhbmRsZXIuY2FsbGJhY2soZnJhZ21lbnQpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtYXRjaGVkO1xuICAgIH0sXG5cbiAgICAvLyBTYXZlIGEgZnJhZ21lbnQgaW50byB0aGUgaGFzaCBoaXN0b3J5LCBvciByZXBsYWNlIHRoZSBVUkwgc3RhdGUgaWYgdGhlXG4gICAgLy8gJ3JlcGxhY2UnIG9wdGlvbiBpcyBwYXNzZWQuIFlvdSBhcmUgcmVzcG9uc2libGUgZm9yIHByb3Blcmx5IFVSTC1lbmNvZGluZ1xuICAgIC8vIHRoZSBmcmFnbWVudCBpbiBhZHZhbmNlLlxuICAgIC8vXG4gICAgLy8gVGhlIG9wdGlvbnMgb2JqZWN0IGNhbiBjb250YWluIGB0cmlnZ2VyOiB0cnVlYCBpZiB5b3Ugd2lzaCB0byBoYXZlIHRoZVxuICAgIC8vIHJvdXRlIGNhbGxiYWNrIGJlIGZpcmVkIChub3QgdXN1YWxseSBkZXNpcmFibGUpLCBvciBgcmVwbGFjZTogdHJ1ZWAsIGlmXG4gICAgLy8geW91IHdpc2ggdG8gbW9kaWZ5IHRoZSBjdXJyZW50IFVSTCB3aXRob3V0IGFkZGluZyBhbiBlbnRyeSB0byB0aGVcbiAgICAvLyBoaXN0b3J5LlxuICAgIG5hdmlnYXRlOiBmdW5jdGlvbihmcmFnbWVudCwgb3B0aW9ucykge1xuICAgICAgaWYgKCFQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFvcHRpb25zIHx8IG9wdGlvbnMgPT09IHRydWUpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt0cmlnZ2VyOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIHZhciBmcmFnID0gKGZyYWdtZW50IHx8ICcnKS5yZXBsYWNlKHJvdXRlU3RyaXBwZXIsICcnKTtcbiAgICAgIGlmICh0aGlzLmZyYWdtZW50ID09PSBmcmFnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgcHVzaFN0YXRlIGlzIGF2YWlsYWJsZSwgd2UgdXNlIGl0IHRvIHNldCB0aGUgZnJhZ21lbnQgYXMgYSByZWFsIFVSTC5cbiAgICAgIGlmICh0aGlzLl9oYXNQdXNoU3RhdGUpIHtcbiAgICAgICAgaWYgKGZyYWcuaW5kZXhPZih0aGlzLm9wdGlvbnMucm9vdCkgIT09IDApIHtcbiAgICAgICAgICBmcmFnID0gdGhpcy5vcHRpb25zLnJvb3QgKyBmcmFnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZnJhZ21lbnQgPSBmcmFnO1xuICAgICAgICB2YXIgcmVwbGFjZU9yUHVzaCA9IG9wdGlvbnMucmVwbGFjZSA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSc7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5W3JlcGxhY2VPclB1c2hdKHt9LCBkb2N1bWVudC50aXRsZSwgZnJhZyk7XG5cbiAgICAgIC8vIElmIGhhc2ggY2hhbmdlcyBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBkaXNhYmxlZCwgdXBkYXRlIHRoZSBoYXNoXG4gICAgICAvLyBmcmFnbWVudCB0byBzdG9yZSBoaXN0b3J5LlxuICAgICAgfSBlbHNlIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5mcmFnbWVudCA9IGZyYWc7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUhhc2god2luZG93LmxvY2F0aW9uLCBmcmFnLCBvcHRpb25zLnJlcGxhY2UpO1xuICAgICAgICBpZiAodGhpcy5pZnJhbWUgJiZcbiAgICAgICAgICAgIChmcmFnICE9PSB0aGlzLmdldEZyYWdtZW50KHRoaXMuZ2V0SGFzaCh0aGlzLmlmcmFtZSkpKSkge1xuICAgICAgICAgIC8vIE9wZW5pbmcgYW5kIGNsb3NpbmcgdGhlIGlmcmFtZSB0cmlja3MgSUU3IGFuZCBlYXJsaWVyXG4gICAgICAgICAgLy8gdG8gcHVzaCBhIGhpc3RvcnkgZW50cnkgb24gaGFzaC10YWcgY2hhbmdlLlxuICAgICAgICAgIC8vIFdoZW4gcmVwbGFjZSBpcyB0cnVlLCB3ZSBkb24ndCB3YW50IHRoaXMuXG4gICAgICAgICAgaWYgKCFvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lLmRvY3VtZW50Lm9wZW4oKS5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl91cGRhdGVIYXNoKHRoaXMuaWZyYW1lLmxvY2F0aW9uLCBmcmFnLCBvcHRpb25zLnJlcGxhY2UpO1xuICAgICAgICB9XG5cbiAgICAgIC8vIElmIHlvdSd2ZSB0b2xkIHVzIHRoYXQgeW91IGV4cGxpY2l0bHkgZG9uJ3Qgd2FudCBmYWxsYmFjayBoYXNoY2hhbmdlLVxuICAgICAgLy8gYmFzZWQgaGlzdG9yeSwgdGhlbiBgbmF2aWdhdGVgIGJlY29tZXMgYSBwYWdlIHJlZnJlc2guXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHRoaXMub3B0aW9ucy5yb290ICsgZnJhZ21lbnQpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMudHJpZ2dlcikge1xuICAgICAgICB0aGlzLmxvYWRVcmwoZnJhZ21lbnQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBVcGRhdGUgdGhlIGhhc2ggbG9jYXRpb24sIGVpdGhlciByZXBsYWNpbmcgdGhlIGN1cnJlbnQgZW50cnksIG9yIGFkZGluZ1xuICAgIC8vIGEgbmV3IG9uZSB0byB0aGUgYnJvd3NlciBoaXN0b3J5LlxuICAgIF91cGRhdGVIYXNoOiBmdW5jdGlvbihsb2NhdGlvbiwgZnJhZ21lbnQsIHJlcGxhY2UpIHtcbiAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgIHZhciBzID0gbG9jYXRpb24udG9TdHJpbmcoKS5yZXBsYWNlKC8oamF2YXNjcmlwdDp8IykuKiQvLCAnJyk7XG4gICAgICAgIGxvY2F0aW9uLnJlcGxhY2UocyArICcjJyArIGZyYWdtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSBmcmFnbWVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIF86IGZhbHNlKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIFJvdXRlcnMgbWFwIGZhdXgtVVJMcyB0byBhY3Rpb25zLCBhbmQgZmlyZSBldmVudHMgd2hlbiByb3V0ZXMgYXJlXG4gICAqIG1hdGNoZWQuIENyZWF0aW5nIGEgbmV3IG9uZSBzZXRzIGl0cyBgcm91dGVzYCBoYXNoLCBpZiBub3Qgc2V0IHN0YXRpY2FsbHkuXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5BIGZvcmsgb2YgQmFja2JvbmUuUm91dGVyLCBwcm92aWRlZCBmb3IgeW91ciBjb252ZW5pZW5jZS5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGVcbiAgICogPGEgaHJlZj1cImh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vYmFja2JvbmUvI1JvdXRlclwiPkJhY2tib25lXG4gICAqIGRvY3VtZW50YXRpb248L2E+LjwvcD5cbiAgICogPHA+PHN0cm9uZz48ZW0+QXZhaWxhYmxlIGluIHRoZSBjbGllbnQgU0RLIG9ubHkuPC9lbT48L3N0cm9uZz48L3A+XG4gICAqL1xuICBQYXJzZS5Sb3V0ZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKG9wdGlvbnMucm91dGVzKSB7XG4gICAgICB0aGlzLnJvdXRlcyA9IG9wdGlvbnMucm91dGVzO1xuICAgIH1cbiAgICB0aGlzLl9iaW5kUm91dGVzKCk7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ2FjaGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIG1hdGNoaW5nIG5hbWVkIHBhcmFtIHBhcnRzIGFuZCBzcGxhdHRlZFxuICAvLyBwYXJ0cyBvZiByb3V0ZSBzdHJpbmdzLlxuICB2YXIgbmFtZWRQYXJhbSAgICA9IC86XFx3Ky9nO1xuICB2YXIgc3BsYXRQYXJhbSAgICA9IC9cXCpcXHcrL2c7XG4gIHZhciBlc2NhcGVSZWdFeHAgID0gL1tcXC1cXFtcXF17fSgpKz8uLFxcXFxcXF5cXCRcXHwjXFxzXS9nO1xuXG4gIC8vIFNldCB1cCBhbGwgaW5oZXJpdGFibGUgKipQYXJzZS5Sb3V0ZXIqKiBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzLlxuICBfLmV4dGVuZChQYXJzZS5Sb3V0ZXIucHJvdG90eXBlLCBQYXJzZS5FdmVudHMsXG4gICAgICAgICAgIC8qKiBAbGVuZHMgUGFyc2UuUm91dGVyLnByb3RvdHlwZSAqLyB7XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAgKiBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvKipcbiAgICAgKiBNYW51YWxseSBiaW5kIGEgc2luZ2xlIG5hbWVkIHJvdXRlIHRvIGEgY2FsbGJhY2suIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogPHByZT50aGlzLnJvdXRlKCdzZWFyY2gvOnF1ZXJ5L3A6bnVtJywgJ3NlYXJjaCcsIGZ1bmN0aW9uKHF1ZXJ5LCBudW0pIHtcbiAgICAgKiAgICAgICAuLi5cbiAgICAgKiAgICAgfSk7PC9wcmU+XG4gICAgICovXG4gICAgcm91dGU6IGZ1bmN0aW9uKHJvdXRlLCBuYW1lLCBjYWxsYmFjaykge1xuICAgICAgUGFyc2UuaGlzdG9yeSA9IFBhcnNlLmhpc3RvcnkgfHwgbmV3IFBhcnNlLkhpc3RvcnkoKTtcbiAgICAgIGlmICghXy5pc1JlZ0V4cChyb3V0ZSkpIHtcbiAgICAgICAgcm91dGUgPSB0aGlzLl9yb3V0ZVRvUmVnRXhwKHJvdXRlKTtcbiAgICAgIH0gXG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gdGhpc1tuYW1lXTtcbiAgICAgIH1cbiAgICAgIFBhcnNlLmhpc3Rvcnkucm91dGUocm91dGUsIF8uYmluZChmdW5jdGlvbihmcmFnbWVudCkge1xuICAgICAgICB2YXIgYXJncyA9IHRoaXMuX2V4dHJhY3RQYXJhbWV0ZXJzKHJvdXRlLCBmcmFnbWVudCk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJpZ2dlci5hcHBseSh0aGlzLCBbJ3JvdXRlOicgKyBuYW1lXS5jb25jYXQoYXJncykpO1xuICAgICAgICBQYXJzZS5oaXN0b3J5LnRyaWdnZXIoJ3JvdXRlJywgdGhpcywgbmFtZSwgYXJncyk7XG4gICAgICB9LCB0aGlzKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogV2hlbmV2ZXIgeW91IHJlYWNoIGEgcG9pbnQgaW4geW91ciBhcHBsaWNhdGlvbiB0aGF0IHlvdSdkXG4gICAgICogbGlrZSB0byBzYXZlIGFzIGEgVVJMLCBjYWxsIG5hdmlnYXRlIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGVcbiAgICAgKiBVUkwuIElmIHlvdSB3aXNoIHRvIGFsc28gY2FsbCB0aGUgcm91dGUgZnVuY3Rpb24sIHNldCB0aGUgXG4gICAgICogdHJpZ2dlciBvcHRpb24gdG8gdHJ1ZS4gVG8gdXBkYXRlIHRoZSBVUkwgd2l0aG91dCBjcmVhdGluZ1xuICAgICAqIGFuIGVudHJ5IGluIHRoZSBicm93c2VyJ3MgaGlzdG9yeSwgc2V0IHRoZSByZXBsYWNlIG9wdGlvblxuICAgICAqIHRvIHRydWUuXG4gICAgICovXG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBvcHRpb25zKSB7XG4gICAgICBQYXJzZS5oaXN0b3J5Lm5hdmlnYXRlKGZyYWdtZW50LCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gQmluZCBhbGwgZGVmaW5lZCByb3V0ZXMgdG8gYFBhcnNlLmhpc3RvcnlgLiBXZSBoYXZlIHRvIHJldmVyc2UgdGhlXG4gICAgLy8gb3JkZXIgb2YgdGhlIHJvdXRlcyBoZXJlIHRvIHN1cHBvcnQgYmVoYXZpb3Igd2hlcmUgdGhlIG1vc3QgZ2VuZXJhbFxuICAgIC8vIHJvdXRlcyBjYW4gYmUgZGVmaW5lZCBhdCB0aGUgYm90dG9tIG9mIHRoZSByb3V0ZSBtYXAuXG4gICAgX2JpbmRSb3V0ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLnJvdXRlcykgeyBcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHJvdXRlcyA9IFtdO1xuICAgICAgZm9yICh2YXIgcm91dGUgaW4gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgaWYgKHRoaXMucm91dGVzLmhhc093blByb3BlcnR5KHJvdXRlKSkge1xuICAgICAgICAgIHJvdXRlcy51bnNoaWZ0KFtyb3V0ZSwgdGhpcy5yb3V0ZXNbcm91dGVdXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcm91dGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLnJvdXRlKHJvdXRlc1tpXVswXSwgcm91dGVzW2ldWzFdLCB0aGlzW3JvdXRlc1tpXVsxXV0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgcm91dGUgc3RyaW5nIGludG8gYSByZWd1bGFyIGV4cHJlc3Npb24sIHN1aXRhYmxlIGZvciBtYXRjaGluZ1xuICAgIC8vIGFnYWluc3QgdGhlIGN1cnJlbnQgbG9jYXRpb24gaGFzaC5cbiAgICBfcm91dGVUb1JlZ0V4cDogZnVuY3Rpb24ocm91dGUpIHtcbiAgICAgIHJvdXRlID0gcm91dGUucmVwbGFjZShlc2NhcGVSZWdFeHAsICdcXFxcJCYnKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKG5hbWVkUGFyYW0sICcoW15cXC9dKyknKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKHNwbGF0UGFyYW0sICcoLio/KScpO1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcm91dGUgKyAnJCcpO1xuICAgIH0sXG5cbiAgICAvLyBHaXZlbiBhIHJvdXRlLCBhbmQgYSBVUkwgZnJhZ21lbnQgdGhhdCBpdCBtYXRjaGVzLCByZXR1cm4gdGhlIGFycmF5IG9mXG4gICAgLy8gZXh0cmFjdGVkIHBhcmFtZXRlcnMuXG4gICAgX2V4dHJhY3RQYXJhbWV0ZXJzOiBmdW5jdGlvbihyb3V0ZSwgZnJhZ21lbnQpIHtcbiAgICAgIHJldHVybiByb3V0ZS5leGVjKGZyYWdtZW50KS5zbGljZSgxKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlUHJvcHMgSW5zdGFuY2UgcHJvcGVydGllcyBmb3IgdGhlIHJvdXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsYXNzUHJvcHMgQ2xhc3MgcHJvcGVyaWVzIGZvciB0aGUgcm91dGVyLlxuICAgKiBAcmV0dXJuIHtDbGFzc30gQSBuZXcgc3ViY2xhc3Mgb2YgPGNvZGU+UGFyc2UuUm91dGVyPC9jb2RlPi5cbiAgICovXG4gIFBhcnNlLlJvdXRlci5leHRlbmQgPSBQYXJzZS5fZXh0ZW5kO1xufSh0aGlzKSk7XG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBAbmFtZXNwYWNlIENvbnRhaW5zIGZ1bmN0aW9ucyBmb3IgY2FsbGluZyBhbmQgZGVjbGFyaW5nXG4gICAqIDxhIGhyZWY9XCIvZG9jcy9jbG91ZF9jb2RlX2d1aWRlI2Z1bmN0aW9uc1wiPmNsb3VkIGZ1bmN0aW9uczwvYT4uXG4gICAqIDxwPjxzdHJvbmc+PGVtPlxuICAgKiAgIFNvbWUgZnVuY3Rpb25zIGFyZSBvbmx5IGF2YWlsYWJsZSBmcm9tIENsb3VkIENvZGUuXG4gICAqIDwvZW0+PC9zdHJvbmc+PC9wPlxuICAgKi9cbiAgUGFyc2UuQ2xvdWQgPSBQYXJzZS5DbG91ZCB8fCB7fTtcblxuICBfLmV4dGVuZChQYXJzZS5DbG91ZCwgLyoqIEBsZW5kcyBQYXJzZS5DbG91ZCAqLyB7XG4gICAgLyoqXG4gICAgICogTWFrZXMgYSBjYWxsIHRvIGEgY2xvdWQgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGZ1bmN0aW9uIG5hbWUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgVGhlIHBhcmFtZXRlcnMgdG8gc2VuZCB0byB0aGUgY2xvdWQgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdFxuICAgICAqIG9wdGlvbnMuc3VjY2VzcywgaWYgc2V0LCBzaG91bGQgYmUgYSBmdW5jdGlvbiB0byBoYW5kbGUgYSBzdWNjZXNzZnVsXG4gICAgICogY2FsbCB0byBhIGNsb3VkIGZ1bmN0aW9uLiAgb3B0aW9ucy5lcnJvciBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0XG4gICAgICogaGFuZGxlcyBhbiBlcnJvciBydW5uaW5nIHRoZSBjbG91ZCBmdW5jdGlvbi4gIEJvdGggZnVuY3Rpb25zIGFyZVxuICAgICAqIG9wdGlvbmFsLiAgQm90aCBmdW5jdGlvbnMgdGFrZSBhIHNpbmdsZSBhcmd1bWVudC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHdpdGggdGhlIHJlc3VsdFxuICAgICAqIG9mIHRoZSBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBydW46IGZ1bmN0aW9uKG5hbWUsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwiZnVuY3Rpb25zXCIsXG4gICAgICAgIGNsYXNzTmFtZTogbmFtZSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIGRhdGE6IFBhcnNlLl9lbmNvZGUoZGF0YSwgbnVsbCwgdHJ1ZSlcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLl9kZWNvZGUobnVsbCwgcmVzcCkucmVzdWx0O1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuICB9KTtcbn0odGhpcykpO1xuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcblxuICBQYXJzZS5JbnN0YWxsYXRpb24gPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiX0luc3RhbGxhdGlvblwiKTtcblxuICAvKipcbiAgICogQ29udGFpbnMgZnVuY3Rpb25zIHRvIGRlYWwgd2l0aCBQdXNoIGluIFBhcnNlXG4gICAqIEBuYW1lIFBhcnNlLlB1c2hcbiAgICogQG5hbWVzcGFjZVxuICAgKi9cbiAgUGFyc2UuUHVzaCA9IFBhcnNlLlB1c2ggfHwge307XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgcHVzaCBub3RpZmljYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gIFRoZSBkYXRhIG9mIHRoZSBwdXNoIG5vdGlmaWNhdGlvbi4gIFZhbGlkIGZpZWxkc1xuICAgKiBhcmU6XG4gICAqICAgPG9sPlxuICAgKiAgICAgPGxpPmNoYW5uZWxzIC0gQW4gQXJyYXkgb2YgY2hhbm5lbHMgdG8gcHVzaCB0by48L2xpPlxuICAgKiAgICAgPGxpPnB1c2hfdGltZSAtIEEgRGF0ZSBvYmplY3QgZm9yIHdoZW4gdG8gc2VuZCB0aGUgcHVzaC48L2xpPlxuICAgKiAgICAgPGxpPmV4cGlyYXRpb25fdGltZSAtICBBIERhdGUgb2JqZWN0IGZvciB3aGVuIHRvIGV4cGlyZVxuICAgKiAgICAgICAgIHRoZSBwdXNoLjwvbGk+XG4gICAqICAgICA8bGk+ZXhwaXJhdGlvbl9pbnRlcnZhbCAtIFRoZSBzZWNvbmRzIGZyb20gbm93IHRvIGV4cGlyZSB0aGUgcHVzaC48L2xpPlxuICAgKiAgICAgPGxpPndoZXJlIC0gQSBQYXJzZS5RdWVyeSBvdmVyIFBhcnNlLkluc3RhbGxhdGlvbiB0aGF0IGlzIHVzZWQgdG8gbWF0Y2hcbiAgICogICAgICAgICBhIHNldCBvZiBpbnN0YWxsYXRpb25zIHRvIHB1c2ggdG8uPC9saT5cbiAgICogICAgIDxsaT5kYXRhIC0gVGhlIGRhdGEgdG8gc2VuZCBhcyBwYXJ0IG9mIHRoZSBwdXNoPC9saT5cbiAgICogICA8b2w+XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB0aGF0IGhhcyBhbiBvcHRpb25hbCBzdWNjZXNzIGZ1bmN0aW9uLFxuICAgKiB0aGF0IHRha2VzIG5vIGFyZ3VtZW50cyBhbmQgd2lsbCBiZSBjYWxsZWQgb24gYSBzdWNjZXNzZnVsIHB1c2gsIGFuZFxuICAgKiBhbiBlcnJvciBmdW5jdGlvbiB0aGF0IHRha2VzIGEgUGFyc2UuRXJyb3IgYW5kIHdpbGwgYmUgY2FsbGVkIGlmIHRoZSBwdXNoXG4gICAqIGZhaWxlZC5cbiAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHB1c2ggcmVxdWVzdFxuICAgKiAgICAgY29tcGxldGVzLlxuICAgKi9cbiAgUGFyc2UuUHVzaC5zZW5kID0gZnVuY3Rpb24oZGF0YSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgaWYgKGRhdGEud2hlcmUpIHtcbiAgICAgIGRhdGEud2hlcmUgPSBkYXRhLndoZXJlLnRvSlNPTigpLndoZXJlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnB1c2hfdGltZSkge1xuICAgICAgZGF0YS5wdXNoX3RpbWUgPSBkYXRhLnB1c2hfdGltZS50b0pTT04oKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5leHBpcmF0aW9uX3RpbWUpIHtcbiAgICAgIGRhdGEuZXhwaXJhdGlvbl90aW1lID0gZGF0YS5leHBpcmF0aW9uX3RpbWUudG9KU09OKCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuZXhwaXJhdGlvbl90aW1lICYmIGRhdGEuZXhwaXJhdGlvbl9pbnRlcnZhbCkge1xuICAgICAgdGhyb3cgXCJCb3RoIGV4cGlyYXRpb25fdGltZSBhbmQgZXhwaXJhdGlvbl9pbnRlcnZhbCBjYW4ndCBiZSBzZXRcIjtcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgIHJvdXRlOiAncHVzaCcsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcXVlc3QuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG59KHRoaXMpKTtcbiIsIi8qIFJpb3QgdjIuMC4xNSwgQGxpY2Vuc2UgTUlULCAoYykgMjAxNSBNdXV0IEluYy4gKyBjb250cmlidXRvcnMgKi9cblxuOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgLy8gJ3VzZSBzdHJpY3QnIGRvZXMgbm90IGFsbG93IHVzIHRvIG92ZXJyaWRlIHRoZSBldmVudHMgcHJvcGVydGllcyBodHRwczovL2dpdGh1Yi5jb20vbXV1dC9yaW90anMvYmxvYi9kZXYvbGliL3RhZy91cGRhdGUuanMjTDctTDEwXG4gIC8vIGl0IGxlYWRzIHRvIHRoZSBmb2xsb3dpbmcgZXJyb3Igb24gZmlyZWZveCBcInNldHRpbmcgYSBwcm9wZXJ0eSB0aGF0IGhhcyBvbmx5IGEgZ2V0dGVyXCJcbiAgLy8ndXNlIHN0cmljdCdcblxuICB2YXIgcmlvdCA9IHsgdmVyc2lvbjogJ3YyLjAuMTUnLCBzZXR0aW5nczoge30gfSxcbiAgICAgIGllVmVyc2lvbiA9IGNoZWNrSUUoKVxuXG5yaW90Lm9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIGVsID0gZWwgfHwge31cblxuICB2YXIgY2FsbGJhY2tzID0ge30sXG4gICAgICBfaWQgPSAwXG5cbiAgZWwub24gPSBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbi5faWQgPSB0eXBlb2YgZm4uX2lkID09ICd1bmRlZmluZWQnID8gX2lkKysgOiBmbi5faWRcblxuICAgICAgZXZlbnRzLnJlcGxhY2UoL1xcUysvZywgZnVuY3Rpb24obmFtZSwgcG9zKSB7XG4gICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgIGZuLnR5cGVkID0gcG9zID4gMFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICBlbC5vZmYgPSBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgaWYgKGV2ZW50cyA9PSAnKicpIGNhbGxiYWNrcyA9IHt9XG4gICAgZWxzZSB7XG4gICAgICBldmVudHMucmVwbGFjZSgvXFxTKy9nLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGlmIChmbikge1xuICAgICAgICAgIHZhciBhcnIgPSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgY2I7IChjYiA9IGFyciAmJiBhcnJbaV0pOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjYi5faWQgPT0gZm4uX2lkKSB7IGFyci5zcGxpY2UoaSwgMSk7IGktLSB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrc1tuYW1lXSA9IFtdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLy8gb25seSBzaW5nbGUgZXZlbnQgc3VwcG9ydGVkXG4gIGVsLm9uZSA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgZnVuY3Rpb24gb24oKSB7XG4gICAgICBlbC5vZmYobmFtZSwgb24pXG4gICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgIH1cbiAgICByZXR1cm4gZWwub24obmFtZSwgb24pXG4gIH1cblxuICBlbC50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICBmbnMgPSBjYWxsYmFja3NbbmFtZV0gfHwgW11cblxuICAgIGZvciAodmFyIGkgPSAwLCBmbjsgKGZuID0gZm5zW2ldKTsgKytpKSB7XG4gICAgICBpZiAoIWZuLmJ1c3kpIHtcbiAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgZm4uYXBwbHkoZWwsIGZuLnR5cGVkID8gW25hbWVdLmNvbmNhdChhcmdzKSA6IGFyZ3MpXG4gICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7IGktLSB9XG4gICAgICAgIGZuLmJ1c3kgPSAwXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrcy5hbGwgJiYgbmFtZSAhPSAnYWxsJykge1xuICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWydhbGwnLCBuYW1lXS5jb25jYXQoYXJncykpXG4gICAgfVxuXG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICByZXR1cm4gZWxcblxufVxuOyhmdW5jdGlvbihyaW90LCBldnQsIHdpbmRvdykge1xuXG4gIC8vIGJyb3dzZXJzIG9ubHlcbiAgaWYgKCF3aW5kb3cpIHJldHVyblxuXG4gIHZhciBsb2MgPSB3aW5kb3cubG9jYXRpb24sXG4gICAgICBmbnMgPSByaW90Lm9ic2VydmFibGUoKSxcbiAgICAgIHdpbiA9IHdpbmRvdyxcbiAgICAgIHN0YXJ0ZWQgPSBmYWxzZSxcbiAgICAgIGN1cnJlbnRcblxuICBmdW5jdGlvbiBoYXNoKCkge1xuICAgIHJldHVybiBsb2MuaHJlZi5zcGxpdCgnIycpWzFdIHx8ICcnXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZXIocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXQocGF0aCkge1xuICAgIGlmIChwYXRoLnR5cGUpIHBhdGggPSBoYXNoKClcblxuICAgIGlmIChwYXRoICE9IGN1cnJlbnQpIHtcbiAgICAgIGZucy50cmlnZ2VyLmFwcGx5KG51bGwsIFsnSCddLmNvbmNhdChwYXJzZXIocGF0aCkpKVxuICAgICAgY3VycmVudCA9IHBhdGhcbiAgICB9XG4gIH1cblxuICB2YXIgciA9IHJpb3Qucm91dGUgPSBmdW5jdGlvbihhcmcpIHtcbiAgICAvLyBzdHJpbmdcbiAgICBpZiAoYXJnWzBdKSB7XG4gICAgICBsb2MuaGFzaCA9IGFyZ1xuICAgICAgZW1pdChhcmcpXG5cbiAgICAvLyBmdW5jdGlvblxuICAgIH0gZWxzZSB7XG4gICAgICBmbnMub24oJ0gnLCBhcmcpXG4gICAgfVxuICB9XG5cbiAgci5leGVjID0gZnVuY3Rpb24oZm4pIHtcbiAgICBmbi5hcHBseShudWxsLCBwYXJzZXIoaGFzaCgpKSlcbiAgfVxuXG4gIHIucGFyc2VyID0gZnVuY3Rpb24oZm4pIHtcbiAgICBwYXJzZXIgPSBmblxuICB9XG5cbiAgci5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghc3RhcnRlZCkgcmV0dXJuXG4gICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIgPyB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIGVtaXQsIGZhbHNlKSA6IHdpbi5kZXRhY2hFdmVudCgnb24nICsgZXZ0LCBlbWl0KVxuICAgIGZucy5vZmYoJyonKVxuICAgIHN0YXJ0ZWQgPSBmYWxzZVxuICB9XG5cbiAgci5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3RhcnRlZCkgcmV0dXJuXG4gICAgd2luLmFkZEV2ZW50TGlzdGVuZXIgPyB3aW4uYWRkRXZlbnRMaXN0ZW5lcihldnQsIGVtaXQsIGZhbHNlKSA6IHdpbi5hdHRhY2hFdmVudCgnb24nICsgZXZ0LCBlbWl0KVxuICAgIHN0YXJ0ZWQgPSB0cnVlXG4gIH1cblxuICAvLyBhdXRvc3RhcnQgdGhlIHJvdXRlclxuICByLnN0YXJ0KClcblxufSkocmlvdCwgJ2hhc2hjaGFuZ2UnLCB3aW5kb3cpXG4vKlxuXG4vLy8vIEhvdyBpdCB3b3Jrcz9cblxuXG5UaHJlZSB3YXlzOlxuXG4xLiBFeHByZXNzaW9uczogdG1wbCgneyB2YWx1ZSB9JywgZGF0YSkuXG4gICBSZXR1cm5zIHRoZSByZXN1bHQgb2YgZXZhbHVhdGVkIGV4cHJlc3Npb24gYXMgYSByYXcgb2JqZWN0LlxuXG4yLiBUZW1wbGF0ZXM6IHRtcGwoJ0hpIHsgbmFtZSB9IHsgc3VybmFtZSB9JywgZGF0YSkuXG4gICBSZXR1cm5zIGEgc3RyaW5nIHdpdGggZXZhbHVhdGVkIGV4cHJlc3Npb25zLlxuXG4zLiBGaWx0ZXJzOiB0bXBsKCd7IHNob3c6ICFkb25lLCBoaWdobGlnaHQ6IGFjdGl2ZSB9JywgZGF0YSkuXG4gICBSZXR1cm5zIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgdHJ1ZWlzaCBrZXlzIChtYWlubHlcbiAgIHVzZWQgZm9yIHNldHRpbmcgaHRtbCBjbGFzc2VzKSwgZS5nLiBcInNob3cgaGlnaGxpZ2h0XCIuXG5cblxuLy8gVGVtcGxhdGUgZXhhbXBsZXNcblxudG1wbCgneyB0aXRsZSB8fCBcIlVudGl0bGVkXCIgfScsIGRhdGEpXG50bXBsKCdSZXN1bHRzIGFyZSB7IHJlc3VsdHMgPyBcInJlYWR5XCIgOiBcImxvYWRpbmdcIiB9JywgZGF0YSlcbnRtcGwoJ1RvZGF5IGlzIHsgbmV3IERhdGUoKSB9JywgZGF0YSlcbnRtcGwoJ3sgbWVzc2FnZS5sZW5ndGggPiAxNDAgJiYgXCJNZXNzYWdlIGlzIHRvbyBsb25nXCIgfScsIGRhdGEpXG50bXBsKCdUaGlzIGl0ZW0gZ290IHsgTWF0aC5yb3VuZChyYXRpbmcpIH0gc3RhcnMnLCBkYXRhKVxudG1wbCgnPGgxPnsgdGl0bGUgfTwvaDE+eyBib2R5IH0nLCBkYXRhKVxuXG5cbi8vIEZhbHN5IGV4cHJlc3Npb25zIGluIHRlbXBsYXRlc1xuXG5JbiB0ZW1wbGF0ZXMgKGFzIG9wcG9zZWQgdG8gc2luZ2xlIGV4cHJlc3Npb25zKSBhbGwgZmFsc3kgdmFsdWVzXG5leGNlcHQgemVybyAodW5kZWZpbmVkL251bGwvZmFsc2UpIHdpbGwgZGVmYXVsdCB0byBlbXB0eSBzdHJpbmc6XG5cbnRtcGwoJ3sgdW5kZWZpbmVkIH0gLSB7IGZhbHNlIH0gLSB7IG51bGwgfSAtIHsgMCB9Jywge30pXG4vLyB3aWxsIHJldHVybjogXCIgLSAtIC0gMFwiXG5cbiovXG5cblxudmFyIGJyYWNrZXRzID0gKGZ1bmN0aW9uKG9yaWcsIHMsIGIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcblxuICAgIC8vIG1ha2Ugc3VyZSB3ZSB1c2UgdGhlIGN1cnJlbnQgc2V0dGluZ1xuICAgIHMgPSByaW90LnNldHRpbmdzLmJyYWNrZXRzIHx8IG9yaWdcbiAgICBpZiAoYiAhPSBzKSBiID0gcy5zcGxpdCgnICcpXG5cbiAgICAvLyBpZiByZWdleHAgZ2l2ZW4sIHJld3JpdGUgaXQgd2l0aCBjdXJyZW50IGJyYWNrZXRzIChvbmx5IGlmIGRpZmZlciBmcm9tIGRlZmF1bHQpXG4gICAgcmV0dXJuIHggJiYgeC50ZXN0XG4gICAgICA/IHMgPT0gb3JpZ1xuICAgICAgICA/IHggOiBSZWdFeHAoeC5zb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFx7L2csIGJbMF0ucmVwbGFjZSgvKD89LikvZywgJ1xcXFwnKSlcbiAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFx9L2csIGJbMV0ucmVwbGFjZSgvKD89LikvZywgJ1xcXFwnKSksXG4gICAgICAgICAgICAgICAgICAgIHguZ2xvYmFsID8gJ2cnIDogJycpXG5cbiAgICAgIC8vIGVsc2UsIGdldCBzcGVjaWZpYyBicmFja2V0XG4gICAgICA6IGJbeF1cblxuICB9XG59KSgneyB9JylcblxuXG52YXIgdG1wbCA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgY2FjaGUgPSB7fSxcbiAgICAgIHJlVmFycyA9IC8oWydcIlxcL10pLio/W15cXFxcXVxcMXxcXC5cXHcqfFxcdyo6fFxcYig/Oig/Om5ld3x0eXBlb2Z8aW58aW5zdGFuY2VvZikgfCg/OnRoaXN8dHJ1ZXxmYWxzZXxudWxsfHVuZGVmaW5lZClcXGJ8ZnVuY3Rpb24gKlxcKCl8KFthLXpfJF1cXHcqKS9naVxuICAgICAgICAgICAgICAvLyBbIDEgICAgICAgICAgICAgICBdWyAyICBdWyAzIF1bIDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVsgNSAgICAgICBdXG4gICAgICAgICAgICAgIC8vIGZpbmQgdmFyaWFibGUgbmFtZXM6XG4gICAgICAgICAgICAgIC8vIDEuIHNraXAgcXVvdGVkIHN0cmluZ3MgYW5kIHJlZ2V4cHM6IFwiYSBiXCIsICdhIGInLCAnYSBcXCdiXFwnJywgL2EgYi9cbiAgICAgICAgICAgICAgLy8gMi4gc2tpcCBvYmplY3QgcHJvcGVydGllczogLm5hbWVcbiAgICAgICAgICAgICAgLy8gMy4gc2tpcCBvYmplY3QgbGl0ZXJhbHM6IG5hbWU6XG4gICAgICAgICAgICAgIC8vIDQuIHNraXAgamF2YXNjcmlwdCBrZXl3b3Jkc1xuICAgICAgICAgICAgICAvLyA1LiBtYXRjaCB2YXIgbmFtZVxuXG4gIC8vIGJ1aWxkIGEgdGVtcGxhdGUgKG9yIGdldCBpdCBmcm9tIGNhY2hlKSwgcmVuZGVyIHdpdGggZGF0YVxuICByZXR1cm4gZnVuY3Rpb24oc3RyLCBkYXRhKSB7XG4gICAgcmV0dXJuIHN0ciAmJiAoY2FjaGVbc3RyXSA9IGNhY2hlW3N0cl0gfHwgdG1wbChzdHIpKShkYXRhKVxuICB9XG5cblxuICAvLyBjcmVhdGUgYSB0ZW1wbGF0ZSBpbnN0YW5jZVxuXG4gIGZ1bmN0aW9uIHRtcGwocywgcCkge1xuXG4gICAgLy8gZGVmYXVsdCB0ZW1wbGF0ZSBzdHJpbmcgdG8ge31cbiAgICBzID0gKHMgfHwgKGJyYWNrZXRzKDApICsgYnJhY2tldHMoMSkpKVxuXG4gICAgICAvLyB0ZW1wb3JhcmlseSBjb252ZXJ0IFxceyBhbmQgXFx9IHRvIGEgbm9uLWNoYXJhY3RlclxuICAgICAgLnJlcGxhY2UoYnJhY2tldHMoL1xcXFx7L2cpLCAnXFx1RkZGMCcpXG4gICAgICAucmVwbGFjZShicmFja2V0cygvXFxcXH0vZyksICdcXHVGRkYxJylcblxuICAgIC8vIHNwbGl0IHN0cmluZyB0byBleHByZXNzaW9uIGFuZCBub24tZXhwcmVzaW9uIHBhcnRzXG4gICAgcCA9IHNwbGl0KHMsIGV4dHJhY3QocywgYnJhY2tldHMoL3svKSwgYnJhY2tldHMoL30vKSkpXG5cbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdkJywgJ3JldHVybiAnICsgKFxuXG4gICAgICAvLyBpcyBpdCBhIHNpbmdsZSBleHByZXNzaW9uIG9yIGEgdGVtcGxhdGU/IGkuZS4ge3h9IG9yIDxiPnt4fTwvYj5cbiAgICAgICFwWzBdICYmICFwWzJdICYmICFwWzNdXG5cbiAgICAgICAgLy8gaWYgZXhwcmVzc2lvbiwgZXZhbHVhdGUgaXRcbiAgICAgICAgPyBleHByKHBbMV0pXG5cbiAgICAgICAgLy8gaWYgdGVtcGxhdGUsIGV2YWx1YXRlIGFsbCBleHByZXNzaW9ucyBpbiBpdFxuICAgICAgICA6ICdbJyArIHAubWFwKGZ1bmN0aW9uKHMsIGkpIHtcblxuICAgICAgICAgICAgLy8gaXMgaXQgYW4gZXhwcmVzc2lvbiBvciBhIHN0cmluZyAoZXZlcnkgc2Vjb25kIHBhcnQgaXMgYW4gZXhwcmVzc2lvbilcbiAgICAgICAgICByZXR1cm4gaSAlIDJcblxuICAgICAgICAgICAgICAvLyBldmFsdWF0ZSB0aGUgZXhwcmVzc2lvbnNcbiAgICAgICAgICAgICAgPyBleHByKHMsIHRydWUpXG5cbiAgICAgICAgICAgICAgLy8gcHJvY2VzcyBzdHJpbmcgcGFydHMgb2YgdGhlIHRlbXBsYXRlOlxuICAgICAgICAgICAgICA6ICdcIicgKyBzXG5cbiAgICAgICAgICAgICAgICAgIC8vIHByZXNlcnZlIG5ldyBsaW5lc1xuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKVxuXG4gICAgICAgICAgICAgICAgICAvLyBlc2NhcGUgcXVvdGVzXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpXG5cbiAgICAgICAgICAgICAgICArICdcIidcblxuICAgICAgICB9KS5qb2luKCcsJykgKyAnXS5qb2luKFwiXCIpJ1xuICAgICAgKVxuXG4gICAgICAvLyBicmluZyBlc2NhcGVkIHsgYW5kIH0gYmFja1xuICAgICAgLnJlcGxhY2UoL1xcdUZGRjAvZywgYnJhY2tldHMoMCkpXG4gICAgICAucmVwbGFjZSgvXFx1RkZGMS9nLCBicmFja2V0cygxKSlcblxuICAgICsgJzsnKVxuXG4gIH1cblxuXG4gIC8vIHBhcnNlIHsgLi4uIH0gZXhwcmVzc2lvblxuXG4gIGZ1bmN0aW9uIGV4cHIocywgbikge1xuICAgIHMgPSBzXG5cbiAgICAgIC8vIGNvbnZlcnQgbmV3IGxpbmVzIHRvIHNwYWNlc1xuICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnICcpXG5cbiAgICAgIC8vIHRyaW0gd2hpdGVzcGFjZSwgYnJhY2tldHMsIHN0cmlwIGNvbW1lbnRzXG4gICAgICAucmVwbGFjZShicmFja2V0cygvXlt7IF0rfFsgfV0rJHxcXC9cXCouKz9cXCpcXC8vZyksICcnKVxuXG4gICAgLy8gaXMgaXQgYW4gb2JqZWN0IGxpdGVyYWw/IGkuZS4geyBrZXkgOiB2YWx1ZSB9XG4gICAgcmV0dXJuIC9eXFxzKltcXHctIFwiJ10rICo6Ly50ZXN0KHMpXG5cbiAgICAgIC8vIGlmIG9iamVjdCBsaXRlcmFsLCByZXR1cm4gdHJ1ZWlzaCBrZXlzXG4gICAgICAvLyBlLmcuOiB7IHNob3c6IGlzT3BlbigpLCBkb25lOiBpdGVtLmRvbmUgfSAtPiBcInNob3cgZG9uZVwiXG4gICAgICA/ICdbJyArXG5cbiAgICAgICAgICAvLyBleHRyYWN0IGtleTp2YWwgcGFpcnMsIGlnbm9yaW5nIGFueSBuZXN0ZWQgb2JqZWN0c1xuICAgICAgICAgIGV4dHJhY3QocyxcblxuICAgICAgICAgICAgICAvLyBuYW1lIHBhcnQ6IG5hbWU6LCBcIm5hbWVcIjosICduYW1lJzosIG5hbWUgOlxuICAgICAgICAgICAgICAvW1wiJyBdKltcXHctIF0rW1wiJyBdKjovLFxuXG4gICAgICAgICAgICAgIC8vIGV4cHJlc3Npb24gcGFydDogZXZlcnl0aGluZyB1cHRvIGEgY29tbWEgZm9sbG93ZWQgYnkgYSBuYW1lIChzZWUgYWJvdmUpIG9yIGVuZCBvZiBsaW5lXG4gICAgICAgICAgICAgIC8sKD89W1wiJyBdKltcXHctIF0rW1wiJyBdKjopfH18JC9cbiAgICAgICAgICAgICAgKS5tYXAoZnVuY3Rpb24ocGFpcikge1xuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGtleSwgdmFsIHBhcnRzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhaXIucmVwbGFjZSgvXlsgXCInXSooLis/KVsgXCInXSo6ICooLis/KSw/ICokLywgZnVuY3Rpb24oXywgaywgdikge1xuXG4gICAgICAgICAgICAgICAgICAvLyB3cmFwIGFsbCBjb25kaXRpb25hbCBwYXJ0cyB0byBpZ25vcmUgZXJyb3JzXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdi5yZXBsYWNlKC9bXiZ8PSE+PF0rL2csIHdyYXApICsgJz9cIicgKyBrICsgJ1wiOlwiXCIsJ1xuXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICB9KS5qb2luKCcnKVxuXG4gICAgICAgICsgJ10uam9pbihcIiBcIikudHJpbSgpJ1xuXG4gICAgICAvLyBpZiBqcyBleHByZXNzaW9uLCBldmFsdWF0ZSBhcyBqYXZhc2NyaXB0XG4gICAgICA6IHdyYXAocywgbilcblxuICB9XG5cblxuICAvLyBleGVjdXRlIGpzIHcvbyBicmVha2luZyBvbiBlcnJvcnMgb3IgdW5kZWZpbmVkIHZhcnNcblxuICBmdW5jdGlvbiB3cmFwKHMsIG5vbnVsbCkge1xuICAgIHMgPSBzLnRyaW0oKVxuICAgIHJldHVybiAhcyA/ICcnIDogJyhmdW5jdGlvbih2KXt0cnl7dj0nXG5cbiAgICAgICAgLy8gcHJlZml4IHZhcnMgKG5hbWUgPT4gZGF0YS5uYW1lKVxuICAgICAgICArIChzLnJlcGxhY2UocmVWYXJzLCBmdW5jdGlvbihzLCBfLCB2KSB7IHJldHVybiB2ID8gJyhkLicrdisnPT09dW5kZWZpbmVkPycrKHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcgPyAnZ2xvYmFsLicgOiAnd2luZG93LicpK3YrJzpkLicrdisnKScgOiBzIH0pXG5cbiAgICAgICAgICAvLyBicmVhayB0aGUgZXhwcmVzc2lvbiBpZiBpdHMgZW1wdHkgKHJlc3VsdGluZyBpbiB1bmRlZmluZWQgdmFsdWUpXG4gICAgICAgICAgfHwgJ3gnKVxuXG4gICAgICArICd9ZmluYWxseXtyZXR1cm4gJ1xuXG4gICAgICAgIC8vIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nIGZvciBmYWxzeSB2YWx1ZXMgZXhjZXB0IHplcm9cbiAgICAgICAgKyAobm9udWxsID09PSB0cnVlID8gJyF2JiZ2IT09MD9cIlwiOnYnIDogJ3YnKVxuXG4gICAgICArICd9fSkuY2FsbChkKSdcbiAgfVxuXG5cbiAgLy8gc3BsaXQgc3RyaW5nIGJ5IGFuIGFycmF5IG9mIHN1YnN0cmluZ3NcblxuICBmdW5jdGlvbiBzcGxpdChzdHIsIHN1YnN0cmluZ3MpIHtcbiAgICB2YXIgcGFydHMgPSBbXVxuICAgIHN1YnN0cmluZ3MubWFwKGZ1bmN0aW9uKHN1YiwgaSkge1xuXG4gICAgICAvLyBwdXNoIG1hdGNoZWQgZXhwcmVzc2lvbiBhbmQgcGFydCBiZWZvcmUgaXRcbiAgICAgIGkgPSBzdHIuaW5kZXhPZihzdWIpXG4gICAgICBwYXJ0cy5wdXNoKHN0ci5zbGljZSgwLCBpKSwgc3ViKVxuICAgICAgc3RyID0gc3RyLnNsaWNlKGkgKyBzdWIubGVuZ3RoKVxuICAgIH0pXG5cbiAgICAvLyBwdXNoIHRoZSByZW1haW5pbmcgcGFydFxuICAgIHJldHVybiBwYXJ0cy5jb25jYXQoc3RyKVxuICB9XG5cblxuICAvLyBtYXRjaCBzdHJpbmdzIGJldHdlZW4gb3BlbmluZyBhbmQgY2xvc2luZyByZWdleHAsIHNraXBwaW5nIGFueSBpbm5lci9uZXN0ZWQgbWF0Y2hlc1xuXG4gIGZ1bmN0aW9uIGV4dHJhY3Qoc3RyLCBvcGVuLCBjbG9zZSkge1xuXG4gICAgdmFyIHN0YXJ0LFxuICAgICAgICBsZXZlbCA9IDAsXG4gICAgICAgIG1hdGNoZXMgPSBbXSxcbiAgICAgICAgcmUgPSBuZXcgUmVnRXhwKCcoJytvcGVuLnNvdXJjZSsnKXwoJytjbG9zZS5zb3VyY2UrJyknLCAnZycpXG5cbiAgICBzdHIucmVwbGFjZShyZSwgZnVuY3Rpb24oXywgb3BlbiwgY2xvc2UsIHBvcykge1xuXG4gICAgICAvLyBpZiBvdXRlciBpbm5lciBicmFja2V0LCBtYXJrIHBvc2l0aW9uXG4gICAgICBpZighbGV2ZWwgJiYgb3Blbikgc3RhcnQgPSBwb3NcblxuICAgICAgLy8gaW4oZGUpY3JlYXNlIGJyYWNrZXQgbGV2ZWxcbiAgICAgIGxldmVsICs9IG9wZW4gPyAxIDogLTFcblxuICAgICAgLy8gaWYgb3V0ZXIgY2xvc2luZyBicmFja2V0LCBncmFiIHRoZSBtYXRjaFxuICAgICAgaWYoIWxldmVsICYmIGNsb3NlICE9IG51bGwpIG1hdGNoZXMucHVzaChzdHIuc2xpY2Uoc3RhcnQsIHBvcytjbG9zZS5sZW5ndGgpKVxuXG4gICAgfSlcblxuICAgIHJldHVybiBtYXRjaGVzXG4gIH1cblxufSkoKVxuXG4vLyB7IGtleSwgaSBpbiBpdGVtc30gLT4geyBrZXksIGksIGl0ZW1zIH1cbmZ1bmN0aW9uIGxvb3BLZXlzKGV4cHIpIHtcbiAgdmFyIHJldCA9IHsgdmFsOiBleHByIH0sXG4gICAgICBlbHMgPSBleHByLnNwbGl0KC9cXHMraW5cXHMrLylcblxuICBpZiAoZWxzWzFdKSB7XG4gICAgcmV0LnZhbCA9IGJyYWNrZXRzKDApICsgZWxzWzFdXG4gICAgZWxzID0gZWxzWzBdLnNsaWNlKGJyYWNrZXRzKDApLmxlbmd0aCkudHJpbSgpLnNwbGl0KC8sXFxzKi8pXG4gICAgcmV0LmtleSA9IGVsc1swXVxuICAgIHJldC5wb3MgPSBlbHNbMV1cbiAgfVxuXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbWtpdGVtKGV4cHIsIGtleSwgdmFsKSB7XG4gIHZhciBpdGVtID0ge31cbiAgaXRlbVtleHByLmtleV0gPSBrZXlcbiAgaWYgKGV4cHIucG9zKSBpdGVtW2V4cHIucG9zXSA9IHZhbFxuICByZXR1cm4gaXRlbVxufVxuXG5cbi8qIEJld2FyZTogaGVhdnkgc3R1ZmYgKi9cbmZ1bmN0aW9uIF9lYWNoKGRvbSwgcGFyZW50LCBleHByKSB7XG5cbiAgcmVtQXR0cihkb20sICdlYWNoJylcblxuICB2YXIgdGVtcGxhdGUgPSBkb20ub3V0ZXJIVE1MLFxuICAgICAgcHJldiA9IGRvbS5wcmV2aW91c1NpYmxpbmcsXG4gICAgICByb290ID0gZG9tLnBhcmVudE5vZGUsXG4gICAgICByZW5kZXJlZCA9IFtdLFxuICAgICAgdGFncyA9IFtdLFxuICAgICAgY2hlY2tzdW1cblxuICBleHByID0gbG9vcEtleXMoZXhwcilcblxuICBmdW5jdGlvbiBhZGQocG9zLCBpdGVtLCB0YWcpIHtcbiAgICByZW5kZXJlZC5zcGxpY2UocG9zLCAwLCBpdGVtKVxuICAgIHRhZ3Muc3BsaWNlKHBvcywgMCwgdGFnKVxuICB9XG5cbiAgLy8gY2xlYW4gdGVtcGxhdGUgY29kZVxuICBwYXJlbnQub25lKCd1cGRhdGUnLCBmdW5jdGlvbigpIHtcbiAgICByb290LnJlbW92ZUNoaWxkKGRvbSlcblxuICB9KS5vbmUoJ3ByZW1vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJvb3Quc3R1Yikgcm9vdCA9IHBhcmVudC5yb290XG5cbiAgfSkub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGl0ZW1zID0gdG1wbChleHByLnZhbCwgcGFyZW50KVxuICAgIGlmICghaXRlbXMpIHJldHVyblxuXG4gICAgLy8gb2JqZWN0IGxvb3AuIGFueSBjaGFuZ2VzIGNhdXNlIGZ1bGwgcmVkcmF3XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xuICAgICAgdmFyIHRlc3RzdW0gPSBKU09OLnN0cmluZ2lmeShpdGVtcylcbiAgICAgIGlmICh0ZXN0c3VtID09IGNoZWNrc3VtKSByZXR1cm5cbiAgICAgIGNoZWNrc3VtID0gdGVzdHN1bVxuXG4gICAgICAvLyBjbGVhciBvbGQgaXRlbXNcbiAgICAgIGVhY2godGFncywgZnVuY3Rpb24odGFnKSB7IHRhZy51bm1vdW50KCkgfSlcbiAgICAgIHJlbmRlcmVkID0gW11cbiAgICAgIHRhZ3MgPSBbXVxuXG4gICAgICBpdGVtcyA9IE9iamVjdC5rZXlzKGl0ZW1zKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBta2l0ZW0oZXhwciwga2V5LCBpdGVtc1trZXldKVxuICAgICAgfSlcblxuICAgIH1cblxuICAgIC8vIHVubW91bnQgcmVkdW5kYW50XG4gICAgZWFjaChyZW5kZXJlZCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgLy8gc2tpcCBleGlzdGluZyBpdGVtc1xuICAgICAgICBpZiAoaXRlbXMuaW5kZXhPZihpdGVtKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZpbmQgYWxsIG5vbi1vYmplY3RzXG4gICAgICAgIHZhciBuZXdJdGVtcyA9IGFyckZpbmRFcXVhbHMoaXRlbXMsIGl0ZW0pLFxuICAgICAgICAgICAgb2xkSXRlbXMgPSBhcnJGaW5kRXF1YWxzKHJlbmRlcmVkLCBpdGVtKVxuXG4gICAgICAgIC8vIGlmIG1vcmUgb3IgZXF1YWwgYW1vdW50LCBubyBuZWVkIHRvIHJlbW92ZVxuICAgICAgICBpZiAobmV3SXRlbXMubGVuZ3RoID49IG9sZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgcG9zID0gcmVuZGVyZWQuaW5kZXhPZihpdGVtKSxcbiAgICAgICAgICB0YWcgPSB0YWdzW3Bvc11cblxuICAgICAgaWYgKHRhZykge1xuICAgICAgICB0YWcudW5tb3VudCgpXG4gICAgICAgIHJlbmRlcmVkLnNwbGljZShwb3MsIDEpXG4gICAgICAgIHRhZ3Muc3BsaWNlKHBvcywgMSlcbiAgICAgICAgLy8gdG8gbGV0IFwiZWFjaFwiIGtub3cgdGhhdCB0aGlzIGl0ZW0gaXMgcmVtb3ZlZFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICAvLyBtb3VudCBuZXcgLyByZW9yZGVyXG4gICAgdmFyIHByZXZCYXNlID0gW10uaW5kZXhPZi5jYWxsKHJvb3QuY2hpbGROb2RlcywgcHJldikgKyAxXG4gICAgZWFjaChpdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuXG4gICAgICAvLyBzdGFydCBpbmRleCBzZWFyY2ggZnJvbSBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgY3VycmVudCBpXG4gICAgICB2YXIgcG9zID0gaXRlbXMuaW5kZXhPZihpdGVtLCBpKSxcbiAgICAgICAgICBvbGRQb3MgPSByZW5kZXJlZC5pbmRleE9mKGl0ZW0sIGkpXG5cbiAgICAgIC8vIGlmIG5vdCBmb3VuZCwgc2VhcmNoIGJhY2t3YXJkcyBmcm9tIGN1cnJlbnQgaSBwb3NpdGlvblxuICAgICAgcG9zIDwgMCAmJiAocG9zID0gaXRlbXMubGFzdEluZGV4T2YoaXRlbSwgaSkpXG4gICAgICBvbGRQb3MgPCAwICYmIChvbGRQb3MgPSByZW5kZXJlZC5sYXN0SW5kZXhPZihpdGVtLCBpKSlcblxuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgLy8gZmluZCBhbGwgbm9uLW9iamVjdHNcbiAgICAgICAgdmFyIG5ld0l0ZW1zID0gYXJyRmluZEVxdWFscyhpdGVtcywgaXRlbSksXG4gICAgICAgICAgICBvbGRJdGVtcyA9IGFyckZpbmRFcXVhbHMocmVuZGVyZWQsIGl0ZW0pXG5cbiAgICAgICAgLy8gaWYgbW9yZSwgc2hvdWxkIG1vdW50IG9uZSBuZXdcbiAgICAgICAgaWYgKG5ld0l0ZW1zLmxlbmd0aCA+IG9sZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIG9sZFBvcyA9IC0xXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbW91bnQgbmV3XG4gICAgICB2YXIgbm9kZXMgPSByb290LmNoaWxkTm9kZXNcbiAgICAgIGlmIChvbGRQb3MgPCAwKSB7XG4gICAgICAgIGlmICghY2hlY2tzdW0gJiYgZXhwci5rZXkpIHZhciBfaXRlbSA9IG1raXRlbShleHByLCBpdGVtLCBwb3MpXG5cbiAgICAgICAgdmFyIHRhZyA9IG5ldyBUYWcoeyB0bXBsOiB0ZW1wbGF0ZSB9LCB7XG4gICAgICAgICAgYmVmb3JlOiBub2Rlc1twcmV2QmFzZSArIHBvc10sXG4gICAgICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICAgICAgcm9vdDogcm9vdCxcbiAgICAgICAgICBpdGVtOiBfaXRlbSB8fCBpdGVtXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGFnLm1vdW50KClcblxuICAgICAgICBhZGQocG9zLCBpdGVtLCB0YWcpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIC8vIGNoYW5nZSBwb3MgdmFsdWVcbiAgICAgIGlmIChleHByLnBvcyAmJiB0YWdzW29sZFBvc11bZXhwci5wb3NdICE9IHBvcykge1xuICAgICAgICB0YWdzW29sZFBvc10ub25lKCd1cGRhdGUnLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgaXRlbVtleHByLnBvc10gPSBwb3NcbiAgICAgICAgfSlcbiAgICAgICAgdGFnc1tvbGRQb3NdLnVwZGF0ZSgpXG4gICAgICB9XG5cbiAgICAgIC8vIHJlb3JkZXJcbiAgICAgIGlmIChwb3MgIT0gb2xkUG9zKSB7XG4gICAgICAgIHJvb3QuaW5zZXJ0QmVmb3JlKG5vZGVzW3ByZXZCYXNlICsgb2xkUG9zXSwgbm9kZXNbcHJldkJhc2UgKyAocG9zID4gb2xkUG9zID8gcG9zICsgMSA6IHBvcyldKVxuICAgICAgICByZXR1cm4gYWRkKHBvcywgcmVuZGVyZWQuc3BsaWNlKG9sZFBvcywgMSlbMF0sIHRhZ3Muc3BsaWNlKG9sZFBvcywgMSlbMF0pXG4gICAgICB9XG5cbiAgICB9KVxuXG4gICAgcmVuZGVyZWQgPSBpdGVtcy5zbGljZSgpXG5cbiAgfSlcblxufVxuXG5cbmZ1bmN0aW9uIHBhcnNlTmFtZWRFbGVtZW50cyhyb290LCBwYXJlbnQsIGNoaWxkVGFncykge1xuXG4gIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XG4gICAgaWYgKGRvbS5ub2RlVHlwZSA9PSAxKSB7XG4gICAgICBpZihkb20ucGFyZW50Tm9kZSAmJiBkb20ucGFyZW50Tm9kZS5pc0xvb3ApIGRvbS5pc0xvb3AgPSAxXG4gICAgICBpZihkb20uZ2V0QXR0cmlidXRlKCdlYWNoJykpIGRvbS5pc0xvb3AgPSAxXG4gICAgICAvLyBjdXN0b20gY2hpbGQgdGFnXG4gICAgICB2YXIgY2hpbGQgPSBnZXRUYWcoZG9tKVxuXG4gICAgICBpZiAoY2hpbGQgJiYgIWRvbS5pc0xvb3ApIHtcbiAgICAgICAgdmFyIHRhZyA9IG5ldyBUYWcoY2hpbGQsIHsgcm9vdDogZG9tLCBwYXJlbnQ6IHBhcmVudCB9LCBkb20uaW5uZXJIVE1MKSxcbiAgICAgICAgICB0YWdOYW1lID0gY2hpbGQubmFtZSxcbiAgICAgICAgICBwdGFnID0gcGFyZW50LFxuICAgICAgICAgIGNhY2hlZFRhZ1xuXG4gICAgICAgIHdoaWxlKCFnZXRUYWcocHRhZy5yb290KSkge1xuICAgICAgICAgIGlmKCFwdGFnLnBhcmVudCkgYnJlYWtcbiAgICAgICAgICBwdGFnID0gcHRhZy5wYXJlbnRcbiAgICAgICAgfVxuICAgICAgICAvLyBmaXggZm9yIHRoZSBwYXJlbnQgYXR0cmlidXRlIGluIHRoZSBsb29wZWQgZWxlbWVudHNcbiAgICAgICAgdGFnLnBhcmVudCA9IHB0YWdcblxuICAgICAgICBjYWNoZWRUYWcgPSBwdGFnLnRhZ3NbdGFnTmFtZV1cblxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgY2hpbGRyZW4gdGFncyBoYXZpbmcgdGhlIHNhbWUgbmFtZVxuICAgICAgICBpZiAoY2FjaGVkVGFnKSB7XG4gICAgICAgICAgLy8gaWYgdGhlIHBhcmVudCB0YWdzIHByb3BlcnR5IGlzIG5vdCB5ZXQgYW4gYXJyYXlcbiAgICAgICAgICAvLyBjcmVhdGUgaXQgYWRkaW5nIHRoZSBmaXJzdCBjYWNoZWQgdGFnXG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNhY2hlZFRhZykpXG4gICAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0gPSBbY2FjaGVkVGFnXVxuICAgICAgICAgIC8vIGFkZCB0aGUgbmV3IG5lc3RlZCB0YWcgdG8gdGhlIGFycmF5XG4gICAgICAgICAgcHRhZy50YWdzW3RhZ05hbWVdLnB1c2godGFnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHB0YWcudGFnc1t0YWdOYW1lXSA9IHRhZ1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW1wdHkgdGhlIGNoaWxkIG5vZGUgb25jZSB3ZSBnb3QgaXRzIHRlbXBsYXRlXG4gICAgICAgIC8vIHRvIGF2b2lkIHRoYXQgaXRzIGNoaWxkcmVuIGdldCBjb21waWxlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgICBkb20uaW5uZXJIVE1MID0gJydcbiAgICAgICAgY2hpbGRUYWdzLnB1c2godGFnKVxuICAgICAgfVxuXG4gICAgICBlYWNoKGRvbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgIGlmICgvXihuYW1lfGlkKSQvLnRlc3QoYXR0ci5uYW1lKSkgcGFyZW50W2F0dHIudmFsdWVdID0gZG9tXG4gICAgICB9KVxuICAgIH1cblxuICB9KVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbnMocm9vdCwgdGFnLCBleHByZXNzaW9ucykge1xuXG4gIGZ1bmN0aW9uIGFkZEV4cHIoZG9tLCB2YWwsIGV4dHJhKSB7XG4gICAgaWYgKHZhbC5pbmRleE9mKGJyYWNrZXRzKDApKSA+PSAwKSB7XG4gICAgICB2YXIgZXhwciA9IHsgZG9tOiBkb20sIGV4cHI6IHZhbCB9XG4gICAgICBleHByZXNzaW9ucy5wdXNoKGV4dGVuZChleHByLCBleHRyYSkpXG4gICAgfVxuICB9XG5cbiAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcbiAgICB2YXIgdHlwZSA9IGRvbS5ub2RlVHlwZVxuXG4gICAgLy8gdGV4dCBub2RlXG4gICAgaWYgKHR5cGUgPT0gMyAmJiBkb20ucGFyZW50Tm9kZS50YWdOYW1lICE9ICdTVFlMRScpIGFkZEV4cHIoZG9tLCBkb20ubm9kZVZhbHVlKVxuICAgIGlmICh0eXBlICE9IDEpIHJldHVyblxuXG4gICAgLyogZWxlbWVudCAqL1xuXG4gICAgLy8gbG9vcFxuICAgIHZhciBhdHRyID0gZG9tLmdldEF0dHJpYnV0ZSgnZWFjaCcpXG4gICAgaWYgKGF0dHIpIHsgX2VhY2goZG9tLCB0YWcsIGF0dHIpOyByZXR1cm4gZmFsc2UgfVxuXG4gICAgLy8gYXR0cmlidXRlIGV4cHJlc3Npb25zXG4gICAgZWFjaChkb20uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgdmFyIG5hbWUgPSBhdHRyLm5hbWUsXG4gICAgICAgIGJvb2wgPSBuYW1lLnNwbGl0KCdfXycpWzFdXG5cbiAgICAgIGFkZEV4cHIoZG9tLCBhdHRyLnZhbHVlLCB7IGF0dHI6IGJvb2wgfHwgbmFtZSwgYm9vbDogYm9vbCB9KVxuICAgICAgaWYgKGJvb2wpIHsgcmVtQXR0cihkb20sIG5hbWUpOyByZXR1cm4gZmFsc2UgfVxuXG4gICAgfSlcblxuICAgIC8vIHNraXAgY3VzdG9tIHRhZ3NcbiAgICBpZiAoZ2V0VGFnKGRvbSkpIHJldHVybiBmYWxzZVxuXG4gIH0pXG5cbn1cbmZ1bmN0aW9uIFRhZyhpbXBsLCBjb25mLCBpbm5lckhUTUwpIHtcblxuICB2YXIgc2VsZiA9IHJpb3Qub2JzZXJ2YWJsZSh0aGlzKSxcbiAgICAgIG9wdHMgPSBpbmhlcml0KGNvbmYub3B0cykgfHwge30sXG4gICAgICBkb20gPSBta2RvbShpbXBsLnRtcGwpLFxuICAgICAgcGFyZW50ID0gY29uZi5wYXJlbnQsXG4gICAgICBleHByZXNzaW9ucyA9IFtdLFxuICAgICAgY2hpbGRUYWdzID0gW10sXG4gICAgICByb290ID0gY29uZi5yb290LFxuICAgICAgaXRlbSA9IGNvbmYuaXRlbSxcbiAgICAgIGZuID0gaW1wbC5mbixcbiAgICAgIHRhZ05hbWUgPSByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIGF0dHIgPSB7fSxcbiAgICAgIGxvb3BEb21cblxuICBpZiAoZm4gJiYgcm9vdC5fdGFnKSB7XG4gICAgcm9vdC5fdGFnLnVubW91bnQodHJ1ZSlcbiAgfVxuICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSB0YWcganVzdCBjcmVhdGVkXG4gIC8vIHNvIHdlIHdpbGwgYmUgYWJsZSB0byBtb3VudCB0aGlzIHRhZyBtdWx0aXBsZSB0aW1lc1xuICByb290Ll90YWcgPSB0aGlzXG5cbiAgLy8gY3JlYXRlIGEgdW5pcXVlIGlkIHRvIHRoaXMgdGFnXG4gIC8vIGl0IGNvdWxkIGJlIGhhbmR5IHRvIHVzZSBpdCBhbHNvIHRvIGltcHJvdmUgdGhlIHZpcnR1YWwgZG9tIHJlbmRlcmluZyBzcGVlZFxuICB0aGlzLl9pZCA9IH5+KG5ldyBEYXRlKCkuZ2V0VGltZSgpICogTWF0aC5yYW5kb20oKSlcblxuICBleHRlbmQodGhpcywgeyBwYXJlbnQ6IHBhcmVudCwgcm9vdDogcm9vdCwgb3B0czogb3B0cywgdGFnczoge30gfSwgaXRlbSlcblxuICAvLyBncmFiIGF0dHJpYnV0ZXNcbiAgZWFjaChyb290LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgYXR0cltlbC5uYW1lXSA9IGVsLnZhbHVlXG4gIH0pXG5cblxuICBpZiAoZG9tLmlubmVySFRNTCAmJiAhL3NlbGVjdC8udGVzdCh0YWdOYW1lKSlcbiAgICAvLyByZXBsYWNlIGFsbCB0aGUgeWllbGQgdGFncyB3aXRoIHRoZSB0YWcgaW5uZXIgaHRtbFxuICAgIGRvbS5pbm5lckhUTUwgPSByZXBsYWNlWWllbGQoZG9tLmlubmVySFRNTCwgaW5uZXJIVE1MKVxuXG5cbiAgLy8gb3B0aW9uc1xuICBmdW5jdGlvbiB1cGRhdGVPcHRzKCkge1xuICAgIGVhY2goT2JqZWN0LmtleXMoYXR0ciksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIG9wdHNbbmFtZV0gPSB0bXBsKGF0dHJbbmFtZV0sIHBhcmVudCB8fCBzZWxmKVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEsIGluaXQpIHtcbiAgICBleHRlbmQoc2VsZiwgZGF0YSwgaXRlbSlcbiAgICB1cGRhdGVPcHRzKClcbiAgICBzZWxmLnRyaWdnZXIoJ3VwZGF0ZScsIGl0ZW0pXG4gICAgdXBkYXRlKGV4cHJlc3Npb25zLCBzZWxmLCBpdGVtKVxuICAgIHNlbGYudHJpZ2dlcigndXBkYXRlZCcpXG4gIH1cblxuICB0aGlzLm1vdW50ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB1cGRhdGVPcHRzKClcblxuICAgIC8vIGluaXRpYWxpYXRpb25cbiAgICBmbiAmJiBmbi5jYWxsKHNlbGYsIG9wdHMpXG5cbiAgICB0b2dnbGUodHJ1ZSlcblxuICAgIC8vIHBhcnNlIGxheW91dCBhZnRlciBpbml0LiBmbiBtYXkgY2FsY3VsYXRlIGFyZ3MgZm9yIG5lc3RlZCBjdXN0b20gdGFnc1xuICAgIHBhcnNlRXhwcmVzc2lvbnMoZG9tLCBzZWxmLCBleHByZXNzaW9ucylcblxuICAgIGlmICghc2VsZi5wYXJlbnQpIHNlbGYudXBkYXRlKClcblxuICAgIC8vIGludGVybmFsIHVzZSBvbmx5LCBmaXhlcyAjNDAzXG4gICAgc2VsZi50cmlnZ2VyKCdwcmVtb3VudCcpXG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgcm9vdC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZClcblxuICAgIH0gZWxzZSB7XG4gICAgICBsb29wRG9tID0gZG9tLmZpcnN0Q2hpbGRcbiAgICAgIHJvb3QuaW5zZXJ0QmVmb3JlKGxvb3BEb20sIGNvbmYuYmVmb3JlIHx8IG51bGwpIC8vIG51bGwgbmVlZGVkIGZvciBJRThcbiAgICB9XG5cbiAgICBpZiAocm9vdC5zdHViKSBzZWxmLnJvb3QgPSByb290ID0gcGFyZW50LnJvb3RcbiAgICBzZWxmLnRyaWdnZXIoJ21vdW50JylcblxuICB9XG5cblxuICB0aGlzLnVubW91bnQgPSBmdW5jdGlvbihrZWVwUm9vdFRhZykge1xuICAgIHZhciBlbCA9IGZuID8gcm9vdCA6IGxvb3BEb20sXG4gICAgICAgIHAgPSBlbC5wYXJlbnROb2RlXG5cbiAgICBpZiAocCkge1xuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIHRhZyBmcm9tIHRoZSBwYXJlbnQgdGFncyBvYmplY3RcbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG11bHRpcGxlIG5lc3RlZCB0YWdzIHdpdGggc2FtZSBuYW1lLi5cbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgZWxlbWVudCBmb3JtIHRoZSBhcnJheVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJlbnQudGFnc1t0YWdOYW1lXSkpIHtcbiAgICAgICAgICBlYWNoKHBhcmVudC50YWdzW3RhZ05hbWVdLCBmdW5jdGlvbih0YWcsIGkpIHtcbiAgICAgICAgICAgIGlmICh0YWcuX2lkID09IHNlbGYuX2lkKVxuICAgICAgICAgICAgICBwYXJlbnQudGFnc1t0YWdOYW1lXS5zcGxpY2UoaSwgMSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAvLyBvdGhlcndpc2UganVzdCBkZWxldGUgdGhlIHRhZyBpbnN0YW5jZVxuICAgICAgICAgIGRlbGV0ZSBwYXJlbnQudGFnc1t0YWdOYW1lXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpXG4gICAgICB9XG5cbiAgICAgIGlmICgha2VlcFJvb3RUYWcpXG4gICAgICAgIHAucmVtb3ZlQ2hpbGQoZWwpXG5cbiAgICB9XG5cblxuICAgIHNlbGYudHJpZ2dlcigndW5tb3VudCcpXG4gICAgdG9nZ2xlKClcbiAgICBzZWxmLm9mZignKicpXG4gICAgLy8gc29tZWhvdyBpZTggZG9lcyBub3QgbGlrZSBgZGVsZXRlIHJvb3QuX3RhZ2BcbiAgICByb290Ll90YWcgPSBudWxsXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZShpc01vdW50KSB7XG5cbiAgICAvLyBtb3VudC91bm1vdW50IGNoaWxkcmVuXG4gICAgZWFjaChjaGlsZFRhZ3MsIGZ1bmN0aW9uKGNoaWxkKSB7IGNoaWxkW2lzTW91bnQgPyAnbW91bnQnIDogJ3VubW91bnQnXSgpIH0pXG5cbiAgICAvLyBsaXN0ZW4vdW5saXN0ZW4gcGFyZW50IChldmVudHMgZmxvdyBvbmUgd2F5IGZyb20gcGFyZW50IHRvIGNoaWxkcmVuKVxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHZhciBldnQgPSBpc01vdW50ID8gJ29uJyA6ICdvZmYnXG4gICAgICBwYXJlbnRbZXZ0XSgndXBkYXRlJywgc2VsZi51cGRhdGUpW2V2dF0oJ3VubW91bnQnLCBzZWxmLnVubW91bnQpXG4gICAgfVxuICB9XG5cbiAgLy8gbmFtZWQgZWxlbWVudHMgYXZhaWxhYmxlIGZvciBmblxuICBwYXJzZU5hbWVkRWxlbWVudHMoZG9tLCB0aGlzLCBjaGlsZFRhZ3MpXG5cblxufVxuXG5mdW5jdGlvbiBzZXRFdmVudEhhbmRsZXIobmFtZSwgaGFuZGxlciwgZG9tLCB0YWcsIGl0ZW0pIHtcblxuICBkb21bbmFtZV0gPSBmdW5jdGlvbihlKSB7XG5cbiAgICAvLyBjcm9zcyBicm93c2VyIGV2ZW50IGZpeFxuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudFxuICAgIGUud2hpY2ggPSBlLndoaWNoIHx8IGUuY2hhckNvZGUgfHwgZS5rZXlDb2RlXG4gICAgZS50YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnRcbiAgICBlLmN1cnJlbnRUYXJnZXQgPSBkb21cbiAgICBlLml0ZW0gPSBpdGVtXG5cbiAgICAvLyBwcmV2ZW50IGRlZmF1bHQgYmVoYXZpb3VyIChieSBkZWZhdWx0KVxuICAgIGlmIChoYW5kbGVyLmNhbGwodGFnLCBlKSAhPT0gdHJ1ZSAmJiAhL3JhZGlvfGNoZWNrLy50ZXN0KGRvbS50eXBlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCAmJiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZVxuICAgIH1cblxuICAgIHZhciBlbCA9IGl0ZW0gPyB0YWcucGFyZW50IDogdGFnXG4gICAgZWwudXBkYXRlKClcblxuICB9XG5cbn1cblxuLy8gdXNlZCBieSBpZi0gYXR0cmlidXRlXG5mdW5jdGlvbiBpbnNlcnRUbyhyb290LCBub2RlLCBiZWZvcmUpIHtcbiAgaWYgKHJvb3QpIHtcbiAgICByb290Lmluc2VydEJlZm9yZShiZWZvcmUsIG5vZGUpXG4gICAgcm9vdC5yZW1vdmVDaGlsZChub2RlKVxuICB9XG59XG5cbi8vIGl0ZW0gPSBjdXJyZW50bHkgbG9vcGVkIGl0ZW1cbmZ1bmN0aW9uIHVwZGF0ZShleHByZXNzaW9ucywgdGFnLCBpdGVtKSB7XG5cbiAgZWFjaChleHByZXNzaW9ucywgZnVuY3Rpb24oZXhwciwgaSkge1xuXG4gICAgdmFyIGRvbSA9IGV4cHIuZG9tLFxuICAgICAgICBhdHRyTmFtZSA9IGV4cHIuYXR0cixcbiAgICAgICAgdmFsdWUgPSB0bXBsKGV4cHIuZXhwciwgdGFnKSxcbiAgICAgICAgcGFyZW50ID0gZXhwci5kb20ucGFyZW50Tm9kZVxuXG4gICAgaWYgKHZhbHVlID09IG51bGwpIHZhbHVlID0gJydcblxuICAgIC8vIGxlYXZlIG91dCByaW90LSBwcmVmaXhlcyBmcm9tIHN0cmluZ3MgaW5zaWRlIHRleHRhcmVhXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudGFnTmFtZSA9PSAnVEVYVEFSRUEnKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL3Jpb3QtL2csICcnKVxuXG4gICAgLy8gbm8gY2hhbmdlXG4gICAgaWYgKGV4cHIudmFsdWUgPT09IHZhbHVlKSByZXR1cm5cbiAgICBleHByLnZhbHVlID0gdmFsdWVcblxuICAgIC8vIHRleHQgbm9kZVxuICAgIGlmICghYXR0ck5hbWUpIHJldHVybiBkb20ubm9kZVZhbHVlID0gdmFsdWVcblxuICAgIC8vIHJlbW92ZSBvcmlnaW5hbCBhdHRyaWJ1dGVcbiAgICByZW1BdHRyKGRvbSwgYXR0ck5hbWUpXG5cbiAgICAvLyBldmVudCBoYW5kbGVyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZXRFdmVudEhhbmRsZXIoYXR0ck5hbWUsIHZhbHVlLCBkb20sIHRhZywgaXRlbSlcblxuICAgIC8vIGlmLSBjb25kaXRpb25hbFxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT0gJ2lmJykge1xuICAgICAgdmFyIHN0dWIgPSBleHByLnN0dWJcblxuICAgICAgLy8gYWRkIHRvIERPTVxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHN0dWIgJiYgaW5zZXJ0VG8oc3R1Yi5wYXJlbnROb2RlLCBzdHViLCBkb20pXG5cbiAgICAgIC8vIHJlbW92ZSBmcm9tIERPTVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R1YiA9IGV4cHIuc3R1YiA9IHN0dWIgfHwgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpXG4gICAgICAgIGluc2VydFRvKGRvbS5wYXJlbnROb2RlLCBkb20sIHN0dWIpXG4gICAgICB9XG5cbiAgICAvLyBzaG93IC8gaGlkZVxuICAgIH0gZWxzZSBpZiAoL14oc2hvd3xoaWRlKSQvLnRlc3QoYXR0ck5hbWUpKSB7XG4gICAgICBpZiAoYXR0ck5hbWUgPT0gJ2hpZGUnKSB2YWx1ZSA9ICF2YWx1ZVxuICAgICAgZG9tLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnXG5cbiAgICAvLyBmaWVsZCB2YWx1ZVxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT0gJ3ZhbHVlJykge1xuICAgICAgZG9tLnZhbHVlID0gdmFsdWVcblxuICAgIC8vIDxpbWcgc3JjPVwieyBleHByIH1cIj5cbiAgICB9IGVsc2UgaWYgKGF0dHJOYW1lLnNsaWNlKDAsIDUpID09ICdyaW90LScpIHtcbiAgICAgIGF0dHJOYW1lID0gYXR0ck5hbWUuc2xpY2UoNSlcbiAgICAgIHZhbHVlID8gZG9tLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgdmFsdWUpIDogcmVtQXR0cihkb20sIGF0dHJOYW1lKVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChleHByLmJvb2wpIHtcbiAgICAgICAgZG9tW2F0dHJOYW1lXSA9IHZhbHVlXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVyblxuICAgICAgICB2YWx1ZSA9IGF0dHJOYW1lXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT0gJ29iamVjdCcpIGRvbS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIHZhbHVlKVxuXG4gICAgfVxuXG4gIH0pXG5cbn1cbmZ1bmN0aW9uIGVhY2goZWxzLCBmbikge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gKGVscyB8fCBbXSkubGVuZ3RoLCBlbDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZWwgPSBlbHNbaV1cbiAgICAvLyByZXR1cm4gZmFsc2UgLT4gcmVtb3ZlIGN1cnJlbnQgaXRlbSBkdXJpbmcgbG9vcFxuICAgIGlmIChlbCAhPSBudWxsICYmIGZuKGVsLCBpKSA9PT0gZmFsc2UpIGktLVxuICB9XG4gIHJldHVybiBlbHNcbn1cblxuZnVuY3Rpb24gcmVtQXR0cihkb20sIG5hbWUpIHtcbiAgZG9tLnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxufVxuXG4vLyBtYXggMiBmcm9tIG9iamVjdHMgYWxsb3dlZFxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgZnJvbSwgZnJvbTIpIHtcbiAgZnJvbSAmJiBlYWNoKE9iamVjdC5rZXlzKGZyb20pLCBmdW5jdGlvbihrZXkpIHtcbiAgICBvYmpba2V5XSA9IGZyb21ba2V5XVxuICB9KVxuICByZXR1cm4gZnJvbTIgPyBleHRlbmQob2JqLCBmcm9tMikgOiBvYmpcbn1cblxuZnVuY3Rpb24gY2hlY2tJRSgpIHtcbiAgaWYgKHdpbmRvdykge1xuICAgIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnRcbiAgICB2YXIgbXNpZSA9IHVhLmluZGV4T2YoJ01TSUUgJylcbiAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoJy4nLCBtc2llKSksIDEwKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG9wdGlvbklubmVySFRNTChlbCwgaHRtbCkge1xuICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyksXG4gICAgICB2YWxSZWd4ID0gL3ZhbHVlPVtcXFwiJ10oLis/KVtcXFwiJ10vLFxuICAgICAgc2VsUmVneCA9IC9zZWxlY3RlZD1bXFxcIiddKC4rPylbXFxcIiddLyxcbiAgICAgIHZhbHVlc01hdGNoID0gaHRtbC5tYXRjaCh2YWxSZWd4KSxcbiAgICAgIHNlbGVjdGVkTWF0Y2ggPSBodG1sLm1hdGNoKHNlbFJlZ3gpXG5cbiAgb3B0LmlubmVySFRNTCA9IGh0bWxcblxuICBpZiAodmFsdWVzTWF0Y2gpIHtcbiAgICBvcHQudmFsdWUgPSB2YWx1ZXNNYXRjaFsxXVxuICB9XG5cbiAgaWYgKHNlbGVjdGVkTWF0Y2gpIHtcbiAgICBvcHQuc2V0QXR0cmlidXRlKCdyaW90LXNlbGVjdGVkJywgc2VsZWN0ZWRNYXRjaFsxXSlcbiAgfVxuXG4gIGVsLmFwcGVuZENoaWxkKG9wdClcbn1cblxuZnVuY3Rpb24gbWtkb20odGVtcGxhdGUpIHtcbiAgdmFyIHRhZ05hbWUgPSB0ZW1wbGF0ZS50cmltKCkuc2xpY2UoMSwgMykudG9Mb3dlckNhc2UoKSxcbiAgICAgIHJvb3RUYWcgPSAvdGR8dGgvLnRlc3QodGFnTmFtZSkgPyAndHInIDogdGFnTmFtZSA9PSAndHInID8gJ3Rib2R5JyA6ICdkaXYnLFxuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHJvb3RUYWcpXG5cbiAgZWwuc3R1YiA9IHRydWVcblxuICBpZiAodGFnTmFtZSA9PT0gJ29wJyAmJiBpZVZlcnNpb24gJiYgaWVWZXJzaW9uIDwgMTApIHtcbiAgICBvcHRpb25Jbm5lckhUTUwoZWwsIHRlbXBsYXRlKVxuICB9IGVsc2Uge1xuICAgIGVsLmlubmVySFRNTCA9IHRlbXBsYXRlXG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbmZ1bmN0aW9uIHdhbGsoZG9tLCBmbikge1xuICBpZiAoZG9tKSB7XG4gICAgaWYgKGZuKGRvbSkgPT09IGZhbHNlKSB3YWxrKGRvbS5uZXh0U2libGluZywgZm4pXG4gICAgZWxzZSB7XG4gICAgICBkb20gPSBkb20uZmlyc3RDaGlsZFxuXG4gICAgICB3aGlsZSAoZG9tKSB7XG4gICAgICAgIHdhbGsoZG9tLCBmbilcbiAgICAgICAgZG9tID0gZG9tLm5leHRTaWJsaW5nXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VZaWVsZCAodG1wbCwgaW5uZXJIVE1MKSB7XG4gIHJldHVybiB0bXBsLnJlcGxhY2UoLzwoeWllbGQpXFwvPz4oPFxcL1xcMT4pPy9naW0sIGlubmVySFRNTCB8fCAnJylcbn1cblxuZnVuY3Rpb24gJCQoc2VsZWN0b3IsIGN0eCkge1xuICBjdHggPSBjdHggfHwgZG9jdW1lbnRcbiAgcmV0dXJuIGN0eC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxufVxuXG5mdW5jdGlvbiBhcnJEaWZmKGFycjEsIGFycjIpIHtcbiAgcmV0dXJuIGFycjEuZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIGFycjIuaW5kZXhPZihlbCkgPCAwXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGFyckZpbmRFcXVhbHMoYXJyLCBlbCkge1xuICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbiAoX2VsKSB7XG4gICAgcmV0dXJuIF9lbCA9PT0gZWxcbiAgfSlcbn1cblxuZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQpIHtcbiAgZnVuY3Rpb24gQ2hpbGQoKSB7fVxuICBDaGlsZC5wcm90b3R5cGUgPSBwYXJlbnRcbiAgcmV0dXJuIG5ldyBDaGlsZCgpXG59XG5cbi8qXG4gVmlydHVhbCBkb20gaXMgYW4gYXJyYXkgb2YgY3VzdG9tIHRhZ3Mgb24gdGhlIGRvY3VtZW50LlxuIFVwZGF0ZXMgYW5kIHVubW91bnRzIHByb3BhZ2F0ZSBkb3dud2FyZHMgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4uXG4qL1xuXG52YXIgdmlydHVhbERvbSA9IFtdLFxuICAgIHRhZ0ltcGwgPSB7fVxuXG5cbmZ1bmN0aW9uIGdldFRhZyhkb20pIHtcbiAgcmV0dXJuIHRhZ0ltcGxbZG9tLmdldEF0dHJpYnV0ZSgncmlvdC10YWcnKSB8fCBkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpXVxufVxuXG5mdW5jdGlvbiBpbmplY3RTdHlsZShjc3MpIHtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gIG5vZGUuaW5uZXJIVE1MID0gY3NzXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobm9kZSlcbn1cblxuZnVuY3Rpb24gbW91bnRUbyhyb290LCB0YWdOYW1lLCBvcHRzKSB7XG4gIHZhciB0YWcgPSB0YWdJbXBsW3RhZ05hbWVdLFxuICAgICAgaW5uZXJIVE1MID0gcm9vdC5pbm5lckhUTUxcblxuICAvLyBjbGVhciB0aGUgaW5uZXIgaHRtbFxuICByb290LmlubmVySFRNTCA9ICcnXG5cbiAgaWYgKHRhZyAmJiByb290KSB0YWcgPSBuZXcgVGFnKHRhZywgeyByb290OiByb290LCBvcHRzOiBvcHRzIH0sIGlubmVySFRNTClcblxuICBpZiAodGFnICYmIHRhZy5tb3VudCkge1xuICAgIHRhZy5tb3VudCgpXG4gICAgdmlydHVhbERvbS5wdXNoKHRhZylcbiAgICByZXR1cm4gdGFnLm9uKCd1bm1vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgICB2aXJ0dWFsRG9tLnNwbGljZSh2aXJ0dWFsRG9tLmluZGV4T2YodGFnKSwgMSlcbiAgICB9KVxuICB9XG5cbn1cblxucmlvdC50YWcgPSBmdW5jdGlvbihuYW1lLCBodG1sLCBjc3MsIGZuKSB7XG4gIGlmICh0eXBlb2YgY3NzID09ICdmdW5jdGlvbicpIGZuID0gY3NzXG4gIGVsc2UgaWYgKGNzcykgaW5qZWN0U3R5bGUoY3NzKVxuICB0YWdJbXBsW25hbWVdID0geyBuYW1lOiBuYW1lLCB0bXBsOiBodG1sLCBmbjogZm4gfVxuICByZXR1cm4gbmFtZVxufVxuXG5yaW90Lm1vdW50ID0gZnVuY3Rpb24oc2VsZWN0b3IsIHRhZ05hbWUsIG9wdHMpIHtcblxuICB2YXIgZWwsXG4gICAgICBzZWxjdEFsbFRhZ3MgPSBmdW5jdGlvbihzZWwpIHtcbiAgICAgICAgc2VsID0gT2JqZWN0LmtleXModGFnSW1wbCkuam9pbignLCAnKVxuICAgICAgICBzZWwuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24odCkge1xuICAgICAgICAgIHNlbCArPSAnLCAqW3Jpb3QtdGFnPVwiJysgdC50cmltKCkgKyAnXCJdJ1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc2VsXG4gICAgICB9LFxuICAgICAgdGFncyA9IFtdXG5cbiAgaWYgKHR5cGVvZiB0YWdOYW1lID09ICdvYmplY3QnKSB7IG9wdHMgPSB0YWdOYW1lOyB0YWdOYW1lID0gMCB9XG5cbiAgLy8gY3Jhd2wgdGhlIERPTSB0byBmaW5kIHRoZSB0YWdcbiAgaWYodHlwZW9mIHNlbGVjdG9yID09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHNlbGVjdG9yID09ICcqJykge1xuICAgICAgLy8gc2VsZWN0IGFsbCB0aGUgdGFncyByZWdpc3RlcmVkXG4gICAgICAvLyBhbmQgYWxzbyB0aGUgdGFncyBmb3VuZCB3aXRoIHRoZSByaW90LXRhZyBhdHRyaWJ1dGUgc2V0XG4gICAgICBzZWxlY3RvciA9IHNlbGN0QWxsVGFncyhzZWxlY3RvcilcbiAgICB9XG4gICAgLy8gb3IganVzdCB0aGUgb25lcyBuYW1lZCBsaWtlIHRoZSBzZWxlY3RvclxuICAgIGVsID0gJCQoc2VsZWN0b3IpXG4gIH1cbiAgLy8gcHJvYmFibHkgeW91IGhhdmUgcGFzc2VkIGFscmVhZHkgYSB0YWcgb3IgYSBOb2RlTGlzdFxuICBlbHNlXG4gICAgZWwgPSBzZWxlY3RvclxuXG4gIC8vIHNlbGVjdCBhbGwgdGhlIHJlZ2lzdGVyZWQgYW5kIG1vdW50IHRoZW0gaW5zaWRlIHRoZWlyIHJvb3QgZWxlbWVudHNcbiAgaWYgKHRhZ05hbWUgPT0gJyonKSB7XG4gICAgLy8gZ2V0IGFsbCBjdXN0b20gdGFnc1xuICAgIHRhZ05hbWUgPSBzZWxjdEFsbFRhZ3Moc2VsZWN0b3IpXG4gICAgLy8gaWYgdGhlIHJvb3QgZWwgaXQncyBqdXN0IGEgc2luZ2xlIHRhZ1xuICAgIGlmIChlbC50YWdOYW1lKSB7XG4gICAgICBlbCA9ICQkKHRhZ05hbWUsIGVsKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbm9kZUxpc3QgPSBbXVxuICAgICAgLy8gc2VsZWN0IGFsbCB0aGUgY2hpbGRyZW4gZm9yIGFsbCB0aGUgZGlmZmVyZW50IHJvb3QgZWxlbWVudHNcbiAgICAgIGVhY2goZWwsIGZ1bmN0aW9uKHRhZykge1xuICAgICAgICBub2RlTGlzdCA9ICQkKHRhZ05hbWUsIHRhZylcbiAgICAgIH0pXG4gICAgICBlbCA9IG5vZGVMaXN0XG4gICAgfVxuICAgIC8vIGdldCByaWQgb2YgdGhlIHRhZ05hbWVcbiAgICB0YWdOYW1lID0gMFxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaChyb290KSB7XG4gICAgdmFyIG5hbWUgPSB0YWdOYW1lIHx8IHJvb3QuZ2V0QXR0cmlidXRlKCdyaW90LXRhZycpIHx8IHJvb3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICB0YWcgPSBtb3VudFRvKHJvb3QsIG5hbWUsIG9wdHMpXG5cbiAgICBpZiAodGFnKSB0YWdzLnB1c2godGFnKVxuICB9XG5cbiAgLy8gRE9NIG5vZGVcbiAgaWYgKGVsLnRhZ05hbWUpXG4gICAgcHVzaChzZWxlY3RvcilcbiAgLy8gc2VsZWN0b3Igb3IgTm9kZUxpc3RcbiAgZWxzZVxuICAgIGVhY2goZWwsIHB1c2gpXG5cbiAgcmV0dXJuIHRhZ3NcblxufVxuXG4vLyB1cGRhdGUgZXZlcnl0aGluZ1xucmlvdC51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGVhY2godmlydHVhbERvbSwgZnVuY3Rpb24odGFnKSB7XG4gICAgdGFnLnVwZGF0ZSgpXG4gIH0pXG59XG5cbi8vIEBkZXByZWNhdGVkXG5yaW90Lm1vdW50VG8gPSByaW90Lm1vdW50XG5cblxuXG4gIC8vIHNoYXJlIG1ldGhvZHMgZm9yIG90aGVyIHJpb3QgcGFydHMsIGUuZy4gY29tcGlsZXJcbiAgcmlvdC51dGlsID0geyBicmFja2V0czogYnJhY2tldHMsIHRtcGw6IHRtcGwgfVxuXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJpb3RcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIHJpb3QgfSlcbiAgZWxzZVxuICAgIHdpbmRvdy5yaW90ID0gcmlvdFxuXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkKTtcbiIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eC1yaW90JykuRGlzcGF0Y2hlcjtcblxudmFyIEFjdGlvblR5cGVzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL3RpbWVib3hlcl9jb25zdGFudHMuanMnKS5BY3Rpb25UeXBlcztcblxudmFyIGRpc3BhdGNoID0gZnVuY3Rpb24odHlwZSwgZGF0YSkge1xuICByZXR1cm4gRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2F2ZVRlbXBsYXRlOiBmdW5jdGlvbih0YXNrKSB7XG4gICAgY29uc29sZS5sb2codGFzayk7XG4gICAgcmV0dXJuIGRpc3BhdGNoKEFjdGlvblR5cGVzLlRFTVBMQVRFX1NBVkUsIHRhc2spO1xuICB9LFxuICByZW1vdmVUZW1wbGF0ZTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goQWN0aW9uVHlwZXMuVEVNUExBVEVfUkVNT1ZFLCBpbmRleCk7XG4gIH0sXG4gIHNlcnZlckRhdGFSZWNlaXZlZDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZygnc2VydmVyRGF0YVJlY2VpdmVkJywgZGF0YSk7XG4gICAgcmV0dXJuIGRpc3BhdGNoKEFjdGlvblR5cGVzLlNFUlZFUl9GRVRDSF9DT01QTEVURSwgZGF0YSk7XG4gIH1cbn07XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKVxuXG5yaW90LnRhZygndGltZWJveGVyLWFib3V0JywgJzxoMz57IG9wdHMudGl0bGUgfTwvaDM+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+IDxpbWcgc3JjPVwiaHR0cDovL3d3dy5waXhlbnRyYWwuY29tL3BpY3MvMUR2WjBiS0tScmJHZ2VwRk1lamtwVVAxS2N3c3ouZ2lmXCIgLz4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb2wtbWQtOFwiPiA8dWw+IDxsaT5SYXkgSGF1c21hbm48L2xpPiA8bGk+SmF5PC9saT4gPGxpPkRpbmtzPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcblxuXG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpXG5cbnJpb3QudGFnKCd0aW1lYm94ZXItY29udGFjdCcsICc8aDM+eyBvcHRzLnRpdGxlIH08L2gzPiA8YSBocmVmPVwiaHR0cDovL3d3dy5iYWJiZWwuY29tL1wiPmJhYmJlbC5jb208L2E+JywgZnVuY3Rpb24ob3B0cykge1xuXG5cbn0pO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yZXF1aXJlKCcuL3RpbWVib3hlcl90ZW1wbGF0ZS9pbmRleC50YWcnKVxuXG52YXIgZmx1eF9yaW90ID0gcmVxdWlyZSgnZmx1eC1yaW90JylcblxucmlvdC50YWcoJ3RpbWVib3hlci1pbmRleCcsICc8aDM+eyBvcHRzLnRpdGxlIH08L2gzPiA8dGltZWJveGVyLXRlbXBsYXRlLWluZGV4IHN0b3JlPVwieyBvcHRzLnN0b3JlIH1cIj48L3RpbWVib3hlci10ZW1wbGF0ZS1pbmRleD4nLCBmdW5jdGlvbihvcHRzKSB7XG5cblxufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnZhciB0aW1lYm94ZXIgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL3RpbWVib3hlci5qcycpXG52YXIgZmx1eF9yaW90ID0gcmVxdWlyZSgnZmx1eC1yaW90JylcblxucmlvdC50YWcoJ3RpbWVib3hlci1tZWV0aW5nLXN0YXJ0JywgJzxoMz57IHRoaXMudGVtcGxhdGUubmFtZSB9PC9oMz4gPGhyPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtOFwiPiA8aDMgY2xhc3M9XCJhZ2VuZGEtbmFtZVwiPnsgdGhpcy5jdXJyZW50QWdlbmRhLm5hbWUgfTwvaDM+IDxkaXYgaWQ9XCJ0aW1pbmdDbG9ja1wiPjwvZGl2PiA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIiBpZD1cInByb2dyZXNzYmFyXCI+IDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgYWN0aXZlXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjQ1XCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxhIGhyZWY9XCIjXCIgb25jbGljaz1cInsgc3RhcnRPclBhdXNlIH1cIiBjbGFzcz1cImJ0biBidG4tYmxvY2sgYnRuLXN1Y2Nlc3NcIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsYXktY2lyY2xlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiA8c3BhbiBpZD1cImFnZW5kYUNvbnRpbnVlXCI+U3RhcnQ8L3NwYW4+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IG5leHRBZ2VuZGEgfVwiIGNsYXNzPVwiYnRuIGJ0bi1ibG9jayBidG4taW5mb1wiIGlkPVwibmV4dEFnZW5kYUJ0blwiPiA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tb2stY2lyY2xlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBOZXh0IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+IDx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj4gPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCIgZWFjaD1cInsgaXRlbSwgaW5kZXggaW4gdGhpcy50ZW1wbGF0ZS5hZ2VuZGEgfVwiPiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJ7IFxcJ2FnZW5kYUl0ZW1cXCcrIGluZGV4IH1cIiBkaXNhYmxlZD4gPGI+eyBpdGVtLm5hbWUgfTwvYj4gPHNwYW4gY2xhc3M9XCJiYWRnZVwiPnsgaXRlbS50aW1lIH0gbWludXRlczwvc3Bhbj4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibW9kYWwgZmFkZVwiIGlkPVwiYWxsRG9uZVwiPiA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj4gPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5Ob3RpY2U8L2g0PiA8L2Rpdj4gPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gPHA+R3JlYXQgSm9iIGZpbmlzaGluZyB0aGUgbWVldGluZyEhPC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xuXG4gIHRoaXMuY3VycmVudEFnZW5kYUluZGV4ID0gMDtcbiAgdGhpcy5jdXJyZW50QWdlbmRhVGltZSA9IDE7XG5cbiAgdGhpcy5zZXRDdXJyZW50QWdlbmRhID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy50ZW1wbGF0ZSkge1xuICAgICAgdGhpcy5jdXJyZW50QWdlbmRhID0gdGhpcy50ZW1wbGF0ZS5hZ2VuZGFbdGhpcy5jdXJyZW50QWdlbmRhSW5kZXhdO1xuICAgICAgaWYgKHRoaXMuY3VycmVudEFnZW5kYSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRBZ2VuZGFUaW1lID0gcGFyc2VGbG9hdCh0aGlzLmN1cnJlbnRBZ2VuZGEudGltZSkgKiA2MDtcbiAgICAgICAgdGhpcy50aW1lckNsb2NrLnNldFRpbWUodGhpcy5jdXJyZW50QWdlbmRhVGltZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMuYWxsRG9uZSkubW9kYWwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmdldFRlbXBsYXRlRnJvbVN0b3JlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IG9wdHMudGVtcGxhdGVfc3RvcmUuZ2V0QWxsKClbb3B0cy50ZW1wbGF0ZUlkXTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMubmV4dEFnZW5kYSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVzZXRTdGF0dXMoKTtcbiAgICAkKCcjYWdlbmRhSXRlbScrdGhpcy5jdXJyZW50QWdlbmRhSW5kZXgpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICB0aGlzLmN1cnJlbnRBZ2VuZGFJbmRleCsrO1xuICAgIHRoaXMuc2V0Q3VycmVudEFnZW5kYSgpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5pbml0Q2xvY2sgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRpbWVyQ2xvY2sgPSAkKHRoaXMudGltaW5nQ2xvY2spLkZsaXBDbG9jayh7XG4gICAgICBhdXRvU3RhcnQ6IGZhbHNlLFxuICAgICAgY291bnRkb3duOiB0cnVlLFxuICAgICAgY2xvY2tGYWNlOiAnTWludXRlQ291bnRlcicsXG4gICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgaW50ZXJ2YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0ID0gdGhpcy50aW1lckNsb2NrLmdldFRpbWUoKTtcbiAgICAgICAgICB2YXIgcGVyY2VudCA9ICh0KjEwMCkvdGhpcy5jdXJyZW50QWdlbmRhVGltZTtcbiAgICAgICAgICB2YXIgZXh0cmFDbGFzcyA9ICcnO1xuXG4gICAgICAgICAgaWYgKHBlcmNlbnQgPD0gMjApIHtcbiAgICAgICAgICAgIGV4dHJhQ2xhc3MgPSAncHJvZ3Jlc3MtYmFyLXdhcm5pbmcnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwZXJjZW50IDw9IDEwKSB7XG4gICAgICAgICAgICBleHRyYUNsYXNzID0gJ3Byb2dyZXNzLWJhci1kYW5nZXInO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQodGhpcy5wcm9ncmVzc2JhcikuZmluZCgnLnByb2dyZXNzLWJhcicpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogcGVyY2VudCArICclJ1xuICAgICAgICAgIH0pLmFkZENsYXNzKGV4dHJhQ2xhc3MpO1xuXG4gICAgICAgICAgaWYodCA8PSAwKSB7XG4gICAgICAgICAgICAkKHRoaXMubmV4dEFnZW5kYUJ0bikuY2xpY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgfVxuICAgIH0pO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldFRlbXBsYXRlRnJvbVN0b3JlKClcbiAgICB0aGlzLnNldEN1cnJlbnRBZ2VuZGEoKVxuICAgIHRoaXMudXBkYXRlKClcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc3RhcnRPclBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoKHRoaXMuY3VycmVudEFnZW5kYVN0YXR1cykge1xuICAgICAgY2FzZSAncGF1c2VkJzpcbiAgICAgICAgdGhpcy50aW1lckNsb2NrLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuY3VycmVudEFnZW5kYVN0YXR1cyA9ICdzdGFydGVkJztcbiAgICAgICAgJCh0aGlzLmFnZW5kYUNvbnRpbnVlKS5odG1sKCdQYXVzZScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0YXJ0ZWQnOlxuICAgICAgICB0aGlzLnRpbWVyQ2xvY2suc3RvcCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRBZ2VuZGFTdGF0dXMgPSAncGF1c2VkJztcbiAgICAgICAgJCh0aGlzLmFnZW5kYUNvbnRpbnVlKS5odG1sKCdTdGFydCcpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnJlc2V0U3RhdHVzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50aW1lckNsb2NrLnN0b3AoKTtcbiAgICB0aGlzLmN1cnJlbnRBZ2VuZGFTdGF0dXMgPSAncGF1c2VkJztcbiAgICAkKHRoaXMuYWdlbmRhQ29udGludWUpLmh0bWwoJ1N0YXJ0Jyk7XG5cbiAgICAkKHRoaXMucHJvZ3Jlc3NiYXIpLmZpbmQoJy5wcm9ncmVzcy1iYXInKS5cbiAgICBjc3Moe1xuICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgIH0pLlxuICAgIHJlbW92ZUNsYXNzKCdwcm9ncmVzcy1iYXItd2FybmluZycpLlxuICAgIHJlbW92ZUNsYXNzKCdwcm9ncmVzcy1iYXItZGFuZ2VyJyk7XG4gIH0uYmluZCh0aGlzKTtcblxuICBmbHV4X3Jpb3Quc3RvcmVNaXhpbih0aGlzLCBvcHRzLnRlbXBsYXRlX3N0b3JlLCB0aGlzLnVwZGF0ZUZyb21TdG9yZSk7XG5cbiAgdGhpcy5nZXRUZW1wbGF0ZUZyb21TdG9yZSgpO1xuICB0aGlzLmluaXRDbG9jaygpO1xuICB0aGlzLnJlc2V0U3RhdHVzKCk7XG4gIHRoaXMuc2V0Q3VycmVudEFnZW5kYSgpO1xuXG5cbn0pO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG52YXIgdGltZWJveGVyID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy90aW1lYm94ZXIuanMnKTtcbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKTtcbnZhciBUaW1lQm94ZXIgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL3RpbWVib3hlci5qcycpO1xuXG5yaW90LnRhZygndGltZWJveGVyLXRlbXBsYXRlLWFkZCcsICc8aDM+eyBvcHRzLnRpdGxlIH08L2gzPiA8aHI+IDxmb3JtPiA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiA8bGFiZWwgZm9yPVwidGVtcGxhdGVOYW1lXCI+RXZlbnQgVGVtcGxhdGUgTmFtZTwvbGFiZWw+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJ0ZW1wbGF0ZU5hbWVcIiBwbGFjZWhvbGRlcj1cIkVudGVyIFRlbXBsYXRlIE5hbWVcIiBvbmtleXVwPVwieyBlZGl0VGl0bGUgfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGxhYmVsPkFnZW5kYTwvbGFiZWw+IDx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj4gPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCIgZWFjaD1cInsgaXRlbSBpbiBhZ2VuZGFJdGVtcyB9XCI+IDxiPnsgaXRlbS5uYW1lIH08L2I+IGZvciA8Yj57IGl0ZW0udGltZSB9PC9iPiBtaW51dGVzIDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Zvcm0+IDxmb3JtIGNsYXNzPVwiZm9ybS1pbmxpbmVcIiBvbnN1Ym1pdD1cInsgYWRkQWdlbmRhIH1cIj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGxhYmVsIGNsYXNzPVwic3Itb25seVwiIGZvcj1cImFnZW5kYVRpdGxlXCI+SXRlbSBUaXRsZTwvbGFiZWw+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhZ2VuZGFUaXRsZVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgQWdlbmRhIEl0ZW0gVGl0bGVcIiBvbmtleXVwPVwieyBlZGl0QWdlbmRhVGl0bGUgfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGxhYmVsIGNsYXNzPVwic3Itb25seVwiIGZvcj1cImFnZW5kYVRpbWVcIj5JdGVtIFRpbWU8L2xhYmVsPiA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwiYWdlbmRhVGltZVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgQWdlbmRhIEl0ZW0gVGltZVwiIG9ua2V5dXA9XCJ7IGVkaXRBZ2VuZGFUaW1lIH1cIj4gPC9kaXY+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIF9fZGlzYWJsZWQ9XCJ7ICEoYWdlbmRhVGl0bGVWYWx1ZSAmJiBhZ2VuZGFUaW1lVmFsdWUpIH1cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPkFkZCBBZ2VuZGEgSXRlbTwvYnV0dG9uPiA8L2Zvcm0+IDxocj4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBzYXZlVGVtcGxhdGUgfVwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzLXNpZ25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENyZWF0ZSA8L2E+IDxhIGhyZWY9XCIjXCIgb25jbGljaz1cInsgY2FuY2VsIH1cIiBjbGFzcz1cImJ0biBidG4taW5mb1wiPiA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tYmFuLWNpcmNsZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ2FuY2VsIDwvYT4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgdGhpcy50aXRsZSA9ICcnO1xuXG4gIHRoaXMuYWdlbmRhSXRlbXMgPSBbXTtcblxuICB0aGlzLmFkZEFnZW5kYSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmFnZW5kYVRpdGxlVmFsdWUgJiYgdGhpcy5hZ2VuZGFUaW1lVmFsdWUpIHtcbiAgICAgIHRoaXMuYWdlbmRhSXRlbXMucHVzaCh7XG4gICAgICAgIG5hbWU6IHRoaXMuYWdlbmRhVGl0bGVWYWx1ZSxcbiAgICAgICAgdGltZTogdGhpcy5hZ2VuZGFUaW1lVmFsdWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZ2VuZGFUaXRsZVZhbHVlID0gdGhpcy5hZ2VuZGFUaW1lVmFsdWUgPSB0aGlzLmFnZW5kYVRpbWUudmFsdWUgPSB0aGlzLmFnZW5kYVRpdGxlLnZhbHVlID0gJyc7XG4gICAgfVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5lZGl0VGl0bGUgPSBmdW5jdGlvbihlKSB7XG4gICAgdGhpcy50aXRsZSA9IGUudGFyZ2V0LnZhbHVlO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5lZGl0QWdlbmRhVGl0bGUgPSBmdW5jdGlvbihlKSB7XG4gICAgdGhpcy5hZ2VuZGFUaXRsZVZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmVkaXRBZ2VuZGFUaW1lID0gZnVuY3Rpb24oZSkge1xuICAgIHRoaXMuYWdlbmRhVGltZVZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnNhdmVUZW1wbGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIFRpbWVCb3hlci5zYXZlVGVtcGxhdGUoe1xuICAgICAgbmFtZTogdGhpcy50aXRsZSxcbiAgICAgIGFnZW5kYTogdGhpcy5hZ2VuZGFJdGVtc1xuICAgIH0pO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICByaW90LnJvdXRlKCcjJyk7XG4gIH0uYmluZCh0aGlzKTtcbiAgdGhpcy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICByaW90LnJvdXRlKCcjJyk7XG4gIH0uYmluZCh0aGlzKTtcblxuICBmbHV4X3Jpb3Quc3RvcmVNaXhpbih0aGlzLCBvcHRzLnN0b3JlLCB0aGlzLnVwZGF0ZUZyb21TdG9yZSlcblxuXG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG52YXIgdGltZWJveGVyID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy90aW1lYm94ZXIuanMnKVxudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpXG5cbnZhciBTZXJ2ZXJBcGlVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL1NlcnZlckFwaVV0aWxzLmpzJyk7XG5TZXJ2ZXJBcGlVdGlscy5nZXRBbGwoKTtcblxucmlvdC50YWcoJ3RpbWVib3hlci10ZW1wbGF0ZS1pbmRleCcsICc8aDM+eyBvcHRzLnRpdGxlIH08L2gzPiA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ob3ZlclwiPiA8dHI+IDx0aD5UZW1wbGF0ZTwvdGg+IDx0aD5BY3Rpb25zPC90aD4gPC90cj4gPHRyIGVhY2g9XCJ7IGl0ZW0gaW4gdGhpcy5pdGVtcyB9XCI+IDx0ZD48aDQ+eyBpdGVtLm5hbWUgfTwvaDQ+PC90ZD4gPHRkPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IHBhcmVudC5zdGFydE1lZXRpbmcgfVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi10aW1lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBTdGFydCBhIE1lZXRpbmcgPC9hPiA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBFZGl0IDwvYT4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBwYXJlbnQucmVtb3ZlTWVldGluZyB9XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBSZW1vdmUgPC9hPiA8L3RkPiA8L3RyPiA8L3RhYmxlPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IGFkZCB9XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXMtc2lnblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQWRkIE5ldyBUZW1wbGF0ZSA8L2E+JywgZnVuY3Rpb24ob3B0cykge1xuXG4gIHRoaXMuYWRkID0gZnVuY3Rpb24oKSB7XG4gICAgcmlvdC5yb3V0ZSgndGVtcGxhdGVzL2FkZCcpXG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmdldERhdGFGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLml0ZW1zID0gdGhpcy5zdG9yZS5nZXRBbGwoKVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldERhdGFGcm9tU3RvcmUoKVxuICAgIHRoaXMudXBkYXRlKClcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc3RhcnRNZWV0aW5nID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoZXZlbnQuaXRlbS5pdGVtKTtcbiAgICByaW90LnJvdXRlKCdtZWV0aW5nL3N0YXJ0LycgKyBpbmRleCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnJlbW92ZU1lZXRpbmcgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihldmVudC5pdGVtLml0ZW0pO1xuICAgIHRpbWVib3hlci5yZW1vdmVUZW1wbGF0ZShpbmRleCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICBmbHV4X3Jpb3Quc3RvcmVNaXhpbih0aGlzLCBvcHRzLnN0b3JlLCB0aGlzLnVwZGF0ZUZyb21TdG9yZSlcblxuICB0aGlzLmdldERhdGFGcm9tU3RvcmUoKVxuXG5cbn0pO1xuIiwidmFyIGtleW1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQWN0aW9uVHlwZXM6IGtleW1pcnJvcih7XG4gICAgVEVNUExBVEVfU0FWRTogbnVsbCxcbiAgICBURU1QTEFURV9SRU1PVkU6IG51bGwsXG5cbiAgICBTRVJWRVJfRkVUQ0hfQ09NUExFVEU6IG51bGxcbiAgfSlcbn07XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QvcmlvdCcpO1xudmFyIHRpbWVib3hlcl90ZW1wbGF0ZV9zdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy90aW1lYm94ZXJfdGVtcGxhdGVfc3RvcmUuanMnKTtcblxucmVxdWlyZSgnLi4vY29tcG9uZW50cy9pbmRleC50YWcnKTtcbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvdGltZWJveGVyX3RlbXBsYXRlL2FkZC50YWcnKTtcbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvdGltZWJveGVyX3RlbXBsYXRlL2VkaXQudGFnJyk7XG5yZXF1aXJlKCcuLi9jb21wb25lbnRzL3RpbWVib3hlcl9tZWV0aW5nL3N0YXJ0LnRhZycpO1xuXG5yZXF1aXJlKCcuLi9jb21wb25lbnRzL2NvbnRhY3QudGFnJyk7XG5yZXF1aXJlKCcuLi9jb21wb25lbnRzL2Fib3V0LnRhZycpO1xuXG52YXIgYXBwX3RhZyA9IG51bGw7XG5cbnZhciB1bm1vdW50ID0gZnVuY3Rpb24oKSB7XG4gIGlmIChhcHBfdGFnKSB7XG4gICAgcmV0dXJuIGFwcF90YWcudW5tb3VudCgpO1xuICB9XG59O1xuXG52YXIgbW91bnQgPSBmdW5jdGlvbih0YWcsIG9wdHMpIHtcbiAgdmFyIGFwcF9jb250YWluZXI7XG4gIGFwcF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBhcHBfY29udGFpbmVyLmlkID0gJ2FwcC1jb250YWluZXInO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJykuYXBwZW5kQ2hpbGQoYXBwX2NvbnRhaW5lcik7XG4gIHJldHVybiByaW90Lm1vdW50KCcjYXBwLWNvbnRhaW5lcicsIHRhZywgb3B0cylbMF07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5kZXg6IGZ1bmN0aW9uKCkge1xuICAgIHVubW91bnQoKTtcbiAgICByZXR1cm4gYXBwX3RhZyA9IG1vdW50KCd0aW1lYm94ZXItaW5kZXgnLCB7XG4gICAgICB0aXRsZTogXCJUZW1wbGF0ZXNcIixcbiAgICAgIHN0b3JlOiB0aW1lYm94ZXJfdGVtcGxhdGVfc3RvcmVcbiAgICB9KTtcbiAgfSxcblxuICB0ZW1wbGF0ZV9hZGQ6IGZ1bmN0aW9uKCkge1xuICAgIHVubW91bnQoKTtcblxuICAgIHJldHVybiBhcHBfdGFnID0gbW91bnQoJ3RpbWVib3hlci10ZW1wbGF0ZS1hZGQnLCB7XG4gICAgICB0aXRsZTogXCJBZGQgVGltZWJveGVyIEV2ZW50IFRlbXBsYXRlXCIsXG4gICAgICBzdG9yZTogdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlXG4gICAgfSk7XG4gIH0sXG5cbiAgdGVtcGxhdGVfZWRpdDogZnVuY3Rpb24oaWQpIHtcbiAgICB1bm1vdW50KCk7XG4gICAgcmV0dXJuIGFwcF90YWcgPSBtb3VudCgndGltZWJveGVyLXRlbXBsYXRlLWVkaXQnLCB7XG4gICAgICB0aXRsZTogXCJFZGl0IFRpbWVib3hlciBFdmVudCBUZW1wbGF0ZVwiLFxuICAgICAgdGVtcGxhdGVJZDogaWQsXG4gICAgICBzdG9yZTogdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlXG4gICAgfSk7XG4gIH0sXG5cbiAgbWVldGluZ19zdGFydDogZnVuY3Rpb24oaWQpIHtcbiAgICB1bm1vdW50KCk7XG4gICAgcmV0dXJuIGFwcF90YWcgPSBtb3VudCgndGltZWJveGVyLW1lZXRpbmctc3RhcnQnLCB7XG4gICAgICB0aXRsZTogXCJTdGFydCBhIE1lZXRpbmdcIixcbiAgICAgIHRlbXBsYXRlSWQ6IGlkLFxuICAgICAgdGVtcGxhdGVfc3RvcmU6IHRpbWVib3hlcl90ZW1wbGF0ZV9zdG9yZVxuICAgIH0pO1xuICB9LFxuXG4gIGFib3V0OiBmdW5jdGlvbigpIHtcbiAgICB1bm1vdW50KCk7XG4gICAgcmV0dXJuIGFwcF90YWcgPSBtb3VudCgndGltZWJveGVyLWFib3V0Jywge1xuICAgICAgdGl0bGU6IFwiQWJvdXQgVXNcIlxuICAgIH0pO1xuICB9LFxuXG4gIGNvbnRhY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHVubW91bnQoKTtcbiAgICByZXR1cm4gYXBwX3RhZyA9IG1vdW50KCd0aW1lYm94ZXItY29udGFjdCcsIHtcbiAgICAgIHRpdGxlOiBcIkNvbnRhY3QgVXNcIlxuICAgIH0pO1xuICB9XG59O1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90L3Jpb3QnKTtcbnZhciBCYXNlUm91dGVyID0gcmVxdWlyZSgnZmx1eC1yaW90JykuQmFzZVJvdXRlcjtcbnZhciB0aW1lYm94ZXJfcHJlc2VudGVyID0gcmVxdWlyZSgnLi4vcHJlc2VudGVycy90aW1lYm94ZXJfcHJlc2VudGVyLmpzJyk7XG5cbkJhc2VSb3V0ZXIucm91dGVzKHRpbWVib3hlcl9wcmVzZW50ZXIuaW5kZXgsXG4gICd0ZW1wbGF0ZXMvYWRkJywgdGltZWJveGVyX3ByZXNlbnRlci50ZW1wbGF0ZV9hZGQsXG4gICd0ZW1wbGF0ZXMvZWRpdC86aWQnLCB0aW1lYm94ZXJfcHJlc2VudGVyLnRlbXBsYXRlX2VkaXQsXG4gICdtZWV0aW5nL3N0YXJ0LzppZCcsIHRpbWVib3hlcl9wcmVzZW50ZXIubWVldGluZ19zdGFydCxcbiAgJ2Fib3V0JywgdGltZWJveGVyX3ByZXNlbnRlci5hYm91dCxcbiAgJ2NvbnRhY3QnLCB0aW1lYm94ZXJfcHJlc2VudGVyLmNvbnRhY3Rcbik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdGFydDogQmFzZVJvdXRlci5zdGFydFxufTtcbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpLkRpc3BhdGNoZXI7XG52YXIgQWN0aW9uVHlwZXMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvdGltZWJveGVyX2NvbnN0YW50cy5qcycpLkFjdGlvblR5cGVzO1xudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpO1xudmFyIHNlcnZlclV0aWwgPSByZXF1aXJlKCcuLi91dGlscy9zZXJ2ZXJBcGlVdGlscy5qcycpO1xuXG52YXIgX3RlbXBsYXRlcyA9IFtdO1xuXG52YXIgZ2V0VGVtcGxhdGVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gX3RlbXBsYXRlcztcbn07XG52YXIgYWRkVGVtcGxhdGVzID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgX3RlbXBsYXRlcy5wdXNoKGRhdGEpO1xufTtcbnZhciBzYXZlVGVtcGxhdGVzID0gZnVuY3Rpb24gKG9iaikge1xuICBfdGVtcGxhdGVzID0gb2JqO1xufTtcbnZhciByZW1vdmVUZW1wbGF0ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICBfdGVtcGxhdGVzLnNwbGljZShpbmRleCwgMSk7XG59O1xuXG5UaW1lYm94ZXJUZW1wbGF0ZVN0b3JlID0gYXNzaWduKG5ldyBmbHV4X3Jpb3QuQmFzZVN0b3JlKCksIHtcbiAgZ2V0QWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdldFRlbXBsYXRlcygpO1xuICB9LFxuICBzYXZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcbiAgZ2V0QnlJbmRleDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgcmV0dXJuIF90ZW1wbGF0ZXNbaW5kZXhdO1xuICB9LFxuICBkaXNwYXRjaFRva2VuOiBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICB2YXIgYWN0aW9uLCBkYXRhLCBpbmRleCwgdGFzaztcbiAgICBhY3Rpb24gPSBwYXlsb2FkLmFjdGlvbjtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICBjYXNlIEFjdGlvblR5cGVzLlNFUlZFUl9GRVRDSF9DT01QTEVURTpcbiAgICAgICAgc2F2ZVRlbXBsYXRlcyhhY3Rpb24uZGF0YSk7XG4gICAgICAgIFRpbWVib3hlclRlbXBsYXRlU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEFjdGlvblR5cGVzLlRFTVBMQVRFX1NBVkU6XG4gICAgICAgIGFkZFRlbXBsYXRlcyhhY3Rpb24uZGF0YSk7XG4gICAgICAgIHNlcnZlclV0aWwuc2F2ZVRlbXBsYXRlKGFjdGlvbi5kYXRhKTtcbiAgICAgICAgVGltZWJveGVyVGVtcGxhdGVTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgQWN0aW9uVHlwZXMuVEVNUExBVEVfUkVNT1ZFOlxuICAgICAgICBzZXJ2ZXJVdGlsLmRlc3Ryb3lUZW1wbGF0ZShfdGVtcGxhdGVzW2FjdGlvbi5kYXRhXSk7XG4gICAgICAgIHJlbW92ZVRlbXBsYXRlKGFjdGlvbi5kYXRhKTtcbiAgICAgICAgVGltZWJveGVyVGVtcGxhdGVTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH0pXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lYm94ZXJUZW1wbGF0ZVN0b3JlO1xuIiwidmFyIFBhcnNlID0gcmVxdWlyZSgncGFyc2UnKS5QYXJzZTtcbnZhciBUaW1lQm94ZXIgPSByZXF1aXJlKCcuLi9hY3Rpb25zL3RpbWVib3hlci5qcycpO1xudmFyIHN0b3JhZ2UgPSByZXF1aXJlKCcuL2xvY2FsU3RvcmFnZS5qcycpO1xuXG5mdW5jdGlvbiBTZXJ2ZXJBcGlVdGlscygpIHtcbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgUGFyc2UuaW5pdGlhbGl6ZShcIlBFZFZUcEVuSHhoandYSE1qa1N0U2xBTVU3NXhxN1RLeE11dDYwQkRcIixcbiAgICAgIFwidmhieDl3VFFNd00wODIxTmd6TXMweHEyU3hITXpCYllkWk1aV2cxeFwiKTtcbiAgICB0aGlzLmJveGVyQ2xhc3MgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFja2RheTJcIik7XG4gICAgdGhpcy5xdWVyeSA9IG5ldyBQYXJzZS5RdWVyeSh0aGlzLmJveGVyQ2xhc3MpO1xuICAgIHRoaXMuYm94ZXJPYmogPSBuZXcgdGhpcy5ib3hlckNsYXNzKCk7XG4gIH07XG4gIHRoaXMuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYm94ZXJPYmouZmV0Y2goe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRzKTtcbiAgICAgICAgVGltZUJveGVyLnNlcnZlckRhdGFSZWNlaXZlZChyZXN1bHRzLnRvSlNPTigpLnJlc3VsdHMpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBhbGVydChcIkVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICB0aGlzLnNhdmVUZW1wbGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5ib3hlck9iai5zYXZlKGRhdGEpO1xuICB9O1xuICB0aGlzLmRlc3Ryb3lUZW1wbGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5xdWVyeS5nZXQoZGF0YS5vYmplY3RJZCwge1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQuZGVzdHJveSh7XG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rlc3Ryb3llZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSlcbiAgfTtcbiAgdGhpcy5pbml0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTZXJ2ZXJBcGlVdGlscygpO1xuIiwiZnVuY3Rpb24gU3RvcmFnZSAoKSB7XG5cbiAgdGhpcy5kYXRhU3RvcmUgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIGlmICghbG9jYWxTdG9yYWdlLnNwcmludFRhc2spIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zcHJpbnRUYXNrID0gJ1tdJztcbiAgICB9XG4gICAgdGhpcy5kYXRhU3RvcmUgPSBnZXRGcm9tTG9jYWxTdG9yYWdlKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXRyaWV2ZSAoKSB7XG4gICAgcmV0dXJuIGdldEZyb21Mb2NhbFN0b3JhZ2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhdmUgKGRhdGEpIHtcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoZGF0YSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmUgKGluZGV4KSB7XG4gICAgdGhpcy5kYXRhU3RvcmVbaW5kZXhdID0ge307XG4gICAgc2F2ZVRvTG9jYWxTdG9yYWdlKHRoaXMuZGF0YVN0b3JlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhdmVUb0xvY2FsU3RvcmFnZSAoZGF0YSkge1xuICAgIGxvY2FsU3RvcmFnZS5zcHJpbnRUYXNrID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGcm9tTG9jYWxTdG9yYWdlICgpIHtcbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnNwcmludFRhc2spO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQgKCkge1xuICAgIGRlbGV0ZSBsb2NhbFN0b3JhZ2Uuc3ByaW50VGFzaztcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHRoaXMuaW5pdCA9IGluaXQ7XG4gIHRoaXMucmV0cmlldmUgPSByZXRyaWV2ZTtcbiAgdGhpcy5zYXZlID0gc2F2ZTtcbiAgdGhpcy5yZW1vdmUgPSByZW1vdmU7XG4gIHRoaXMucmVzZXQgPSByZXNldDtcblxuICB0aGlzLmdldEZyb21Mb2NhbFN0b3JhZ2UgPSBnZXRGcm9tTG9jYWxTdG9yYWdlO1xuICB0aGlzLnNhdmVUb0xvY2FsU3RvcmFnZSA9IHNhdmVUb0xvY2FsU3RvcmFnZTtcbn1cbnZhciBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKTtcbnN0b3JhZ2UuaW5pdCgpO1xubW9kdWxlLmV4cG9ydHMgPSBzdG9yYWdlO1xuIl19
