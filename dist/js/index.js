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
  updateTemplate: function(task, index) {
    console.log(task);
    var data = {task: task, index: index};
    return dispatch(ActionTypes.TEMPLATE_UPDATE, data);
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

riot.tag('timeboxer-meeting-start', '<h3>{ this.template.name }</h3> <hr> <div class="row"> <div class="col-md-8"> <h3 class="agenda-name">{ this.currentAgenda.name }</h3> <div id="timingClock"></div> <div class="progress" id="progressbar"> <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"> </div> </div> <div class="row"> <div class="col-md-6"> <a href="#" onclick="{ startOrPause }" class="btn btn-block btn-success"> <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> <span id="agendaContinue">Start</span> </a> </div> <div class="col-md-6"> <a href="#" onclick="{ nextAgenda }" class="btn btn-block btn-info" id="nextAgendaBtn"> <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span> Next </a> </div> </div> <div class="row"> <div class="col-md-3"> <a href="#" onclick="{ previousAgenda }" class="btn btn-xs btn-default"> <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span> Previous </a> <a href="#" onclick="{ reduceTime }" class="btn btn-xs btn-default">-1</a> <a href="#" onclick="{ increaseTime }" class="btn btn-xs btn-default">+1</a> </div> </div> </div> <div class="col-md-4"> <ul class="list-group"> <li class="list-group-item" each="{ item, index in this.template.agenda }"> <input type="checkbox" id="{ \'agendaItem\'+ index }" disabled> <b>{ item.name }</b> <span class="badge">{ item.time } minutes</span> </li> </ul> </div> </div> <div class="modal fade" id="allDone"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Notice</h4> </div> <div class="modal-body"> <p>Great Job finishing the meeting!!</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div> </div> </div> </div>', function(opts) {

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

  this.previousAgenda = function() {
    this.resetStatus();
    this.currentAgendaIndex--;
    $('#agendaItem'+this.currentAgendaIndex).prop('checked', false);
    this.setCurrentAgenda();
  }.bind(this);

  this.reduceTime = function() {
    var remainingTime = this.timerClock.getTime().time;
    if (remainingTime - 60 > 0) {
      this.timerClock.setTime(remainingTime - 59);
    }
  }.bind(this);

  this.increaseTime = function() {
    var remainingTime = this.timerClock.getTime().time;
    this.timerClock.setTime(remainingTime + 61);
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
  this.on('mount', function() {
    this.getTemplateFromStore();
    this.initClock();
    this.resetStatus();
    this.setCurrentAgenda();
  });

  this.on('unmount', function() {
    this.timerClock.stop();
  });


});

},{"../../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/add.tag":[function(require,module,exports){
var riot = require('riot');
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
var flux_riot = require('flux-riot');
var TimeBoxer = require('../../actions/timeboxer.js');

riot.tag('timer-list', '<li class="list-group-item" > <input type="text" value="{agenda.name}" name="itemName"> <span> For </span> <input type="text" value="{agenda.time}" name="itemTime"> <span> Minutes </span> <span onclick="{moveUp}" data-index="{index}" class="btn btn-default glyphicon glyphicon-arrow-up"> </span> <span onclick="{moveDown}" data-index="{index}" class="btn btn-default glyphicon glyphicon-arrow-down"> </span> <span onclick="{deleteItem}" data-index="{index}" class="btn btn-default glyphicon glyphicon-remove"> </span> </li>', function(opts) {

  this.moveUp = function(event) {
    var index = parseInt(event.target.dataset.index);
    var tmp;
    var agendas = this.parent.agendaItems.agenda;
    if ( index > 0) {
      tmp = agendas[index - 1];
      agendas[index - 1] = agendas[index];
      agendas[index] = tmp;
      TimeBoxer.updateTemplate(this.parent.agendaItems, this.parent.opts.templateId);
    }
  }.bind(this);
  this.moveDown = function(event) {
    var index = parseInt(event.target.dataset.index, 10);
    var tmp;
    var agendas = this.parent.agendaItems.agenda;

    if ( index < agendas.length - 1) {
      tmp = agendas[index];
      agendas[index] = agendas[index + 1];
      agendas[index + 1] = tmp;
      TimeBoxer.updateTemplate(this.parent.agendaItems, this.parent.opts.templateId);
    }
  }.bind(this);
  this.deleteItem = function(event) {
    var index = parseInt(event.target.dataset.index, 10);
    var agendas = this.parent.agendaItems.agenda;
    agendas.splice(index, 1); // remove the array item
    TimeBoxer.updateTemplate(this.parent.agendaItems, this.parent.opts.templateId);
  }.bind(this);

});

riot.tag('timeboxer-template-edit', '<p if="{opts.is_error}"> Fill up all the values </p> <h4> {opts.title} </h4> <form onsubmit="{updateAgenda}"> <div class="form-group"> <input type="text" class="form-control" id="templateName" value="{agendaItems.name}"> </div> <div class="form-group"> <label>Agenda</label> <ul class="list-group"> <timer-list each="{agenda, index in agendaItems.agenda}" data="agenda"></ul> </li> </ul> </div> <button class="btn btn-default" onclick="{addNewRow}">New Item</button> <button type="submit" class="btn btn-default">Update</button> </form>', function(opts) {

  this.addNewRow = function() {
    var agenda = {
      name: '',
      time: ''
    };
    this.agendaItems.agenda.push(agenda);
    this.update();
  }.bind(this);

  this.updateAgenda = function() {

    var templateName = this.templateName.value;

    var itemNames = $(this.root).find('[name="itemName"]');
    var itemTimes = $(this.root).find('[name="itemTime"]');

    for (var index = 0 ; index < itemNames.length ; index++) {
      if (itemNames[index].value == '' || itemTimes[index].value === '') {
        opts.is_error = true;
        this.update();
        return false;
      }
      this.agendaItems.agenda[index] = { name : itemNames[index].value,
                                         time : itemTimes[index].value
                                       };
    }
    this.agendaItems.name = templateName;
    TimeBoxer.updateTemplate(this.agendaItems, opts.templateId);
    riot.route('#');
  }.bind(this);

  this.updateFromStore = function() {
    this.agendaItems = this.store.getByIndex(opts.templateId);
    this.update();
  }.bind(this);

  this.on('mount', function () {
    this.agendaItems = this.store.getByIndex(opts.templateId) || {};
    this.update();
  });

  flux_riot.storeMixin(this, opts.store, this.updateFromStore);


});
},{"../../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/index.tag":[function(require,module,exports){
var riot = require('riot');
var timeboxer = require('../../actions/timeboxer.js')
var flux_riot = require('flux-riot')

var ServerApiUtils = require('../../utils/ServerApiUtils.js');
ServerApiUtils.getAll();

riot.tag('timeboxer-template-index', '<h3>{ opts.title }</h3> <table class="table table-hover"> <tr> <th>Template</th> <th>Actions</th> </tr> <tr each="{ item in this.items }"> <td><h4>{ item.name }</h4></td> <td> <a href="#" onclick="{ parent.startMeeting }" class="btn btn-primary"> <span class="glyphicon glyphicon-time" aria-hidden="true"></span> Start a Meeting </a> <a href="#" onclick="{ parent.editMeeting }" class="btn btn-primary"> <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit </a> <a href="#" onclick="{ parent.removeMeeting }" class="btn btn-primary"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Remove </a> </td> </tr> </table> <a href="#" onclick="{ add }" class="btn btn-primary"> <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add New Template </a>', function(opts) {

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

  this.editMeeting = function(event) {
    var index = this.items.indexOf(event.item.item);
    riot.route('templates/edit/' + index);
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
    TEMPLATE_UPDATE: null,

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
var updateTemplate = function (obj) {
  _templates[obj.index] = obj.task;
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
      case ActionTypes.TEMPLATE_UPDATE:
        updateTemplate(action.data);
        serverUtil.updateTemplate(action.data.task);
        console.log(action.data);
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
  this.updateTemplate = function (data) {
    this.query.get(data.objectId, {
      success: function (result) {
        result.set('agenda', data.agenda);
        result.set('name', data.name);
        result.save();
      }
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3VyaWFuL1NpdGVzL1ByaXZhdGUvdGltZWJveGVyL3NyYy9qcy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgtcmlvdC9mbHV4LXJpb3QuanMiLCJub2RlX21vZHVsZXMvZmx1eC1yaW90L25vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgtcmlvdC9ub2RlX21vZHVsZXMvZmx1eC9saWIvRGlzcGF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4LXJpb3Qvbm9kZV9tb2R1bGVzL2ZsdXgvbGliL2ludmFyaWFudC5qcyIsIm5vZGVfbW9kdWxlcy9rZXltaXJyb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS9idWlsZC9wYXJzZS1sYXRlc3QuanMiLCJub2RlX21vZHVsZXMvcmlvdC9yaW90LmpzIiwic3JjL2pzL2FjdGlvbnMvdGltZWJveGVyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWJvdXQudGFnIiwic3JjL2pzL2NvbXBvbmVudHMvY29udGFjdC50YWciLCJzcmMvanMvY29tcG9uZW50cy9pbmRleC50YWciLCJzcmMvanMvY29tcG9uZW50cy90aW1lYm94ZXJfbWVldGluZy9zdGFydC50YWciLCJzcmMvanMvY29tcG9uZW50cy90aW1lYm94ZXJfdGVtcGxhdGUvYWRkLnRhZyIsInNyYy9qcy9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9lZGl0LnRhZyIsInNyYy9qcy9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9pbmRleC50YWciLCJzcmMvanMvY29uc3RhbnRzL3RpbWVib3hlcl9jb25zdGFudHMuanMiLCJzcmMvanMvcHJlc2VudGVycy90aW1lYm94ZXJfcHJlc2VudGVyLmpzIiwic3JjL2pzL3JvdXRlcnMvdGltZWJveGVyX3JvdXRlcy5qcyIsInNyYy9qcy9zdG9yZXMvdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlLmpzIiwic3JjL2pzL3V0aWxzL1NlcnZlckFwaVV0aWxzLmpzIiwic3JjL2pzL3V0aWxzL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsZ0JBQUE7O0FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFTLCtCQUFULENBQW5CLENBQUE7O0FBQUEsZ0JBQ2dCLENBQUMsS0FBakIsQ0FBQSxDQURBLENBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ0aW1lYm94ZXJfcm91dGVzID0gcmVxdWlyZSAnLi9yb3V0ZXJzL3RpbWVib3hlcl9yb3V0ZXMuanMnXG50aW1lYm94ZXJfcm91dGVzLnN0YXJ0KClcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCI7KGZ1bmN0aW9uKCkge1xuXG52YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QvcmlvdCcpXG52YXIgZmx1eF9yaW90ID0geyB2ZXJzaW9uOiAnMC4yLjAnIH1cblxuJ3VzZSBzdHJpY3QnXG5cbmZsdXhfcmlvdC5CYXNlU3RvcmUgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIENIQU5HRV9FVkVOVCA9ICdTVE9SRV9DSEFOR0VfRVZFTlQnXG5cbiAgZnVuY3Rpb24gQmFzZVN0b3JlKCkge1xuICAgIHJpb3Qub2JzZXJ2YWJsZSh0aGlzKVxuICB9XG5cbiAgQmFzZVN0b3JlLnByb3RvdHlwZSA9IHtcbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub24oQ0hBTkdFX0VWRU5ULCBjYWxsYmFjaylcbiAgICB9LFxuXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9mZihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKVxuICAgIH0sXG5cbiAgICBlbWl0Q2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudHJpZ2dlcihDSEFOR0VfRVZFTlQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEJhc2VTdG9yZVxuXG59KSgpXG5cbmZsdXhfcmlvdC5zdG9yZU1peGluID0gZnVuY3Rpb24odGFnLCBzdG9yZSwgY2FsbGJhY2spIHtcblxuICB0YWcuc3RvcmUgPSBzdG9yZVxuXG4gIHRhZy5vbignbW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spXG4gIH0pXG5cbiAgdGFnLm9uKCd1bm1vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKVxuICB9KVxuXG59XG5cbmZsdXhfcmlvdC5CYXNlUm91dGVyID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciByZWdleEZ1bmNzID0gW11cblxuICBmdW5jdGlvbiByZWdleFRyYW5zZmVyKHBhdGgpIHtcbiAgICB2YXIgcGFydHMgPSBwYXRoLnNwbGl0KCcvJylcbiAgICB2YXIgcmVnZXhQYXJ0cyA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXVxuICAgICAgaWYgKCEocGFydCAmJiBwYXJ0Lmxlbmd0aCA+IDApKSBjb250aW51ZVxuXG4gICAgICBpZiAocGFydFswXSA9PT0gJzonKSB7XG4gICAgICAgIHJlZ2V4UGFydHMucHVzaCgnKCg/Oig/IVxcXFwvKS4pKz8pJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2V4UGFydHMucHVzaChwYXJ0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUmVnRXhwKFwiXlwiICsgKHJlZ2V4UGFydHMuam9pbignXFxcXC8nKSkgKyBcIlxcXFwvPyRcIiwgXCJpXCIpXG4gIH1cblxuICBmdW5jdGlvbiByb3V0ZShwYXRoKSB7XG4gICAgaWYgKHJlZ2V4RnVuY3MubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgIGlmIChwYXRoID09PSAnJykgcmV0dXJuIHJlZ2V4RnVuY3NbMF1bMV0uYXBwbHkobnVsbCwgW10pXG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHJlZ2V4RnVuY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByZWdleEZ1bmMgPSByZWdleEZ1bmNzW2ldXG4gICAgICB2YXIgbSA9IHBhdGgubWF0Y2gocmVnZXhGdW5jWzBdKVxuICAgICAgaWYgKG0gIT0gbnVsbCkgcmV0dXJuIHJlZ2V4RnVuY1sxXS5hcHBseShudWxsLCBtLnNsaWNlKDEpKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdXRlcygpIHtcbiAgICBpZiAoIShhcmd1bWVudHMubGVuZ3RoID4gMCkpIHJldHVyblxuXG4gICAgcmVnZXhGdW5jcy5wdXNoKFsgJycsIGFyZ3VtZW50c1swXSBdKVxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICByZWdleCA9IHJlZ2V4VHJhbnNmZXIoYXJndW1lbnRzW2ldKVxuICAgICAgcmVnZXhGdW5jcy5wdXNoKFsgcmVnZXgsIGFyZ3VtZW50c1tpICsgMV0gXSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydChyKSB7XG4gICAgcmV0dXJuIHJpb3Qucm91dGUuZXhlYyhyIHx8IHJvdXRlKVxuICB9XG5cbiAgcmlvdC5yb3V0ZS5wYXJzZXIoZnVuY3Rpb24ocGF0aCkgeyByZXR1cm4gW3BhdGhdIH0pXG4gIHJpb3Qucm91dGUocm91dGUpXG5cbiAgcmV0dXJuIHtcbiAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICBzdGFydDogc3RhcnRcbiAgfVxuXG59KSgpXG5cbmZsdXhfcmlvdC5Db25zdGFudHMgPSB7XG4gIEFjdGlvblNvdXJjZXM6IHtcbiAgICBTRVJWRVJfQUNUSU9OOiAnU0VSVkVSX0FDVElPTicsXG4gICAgVklFV19BQ1RJT046ICdWSUVXX0FDVElPTidcbiAgfVxufVxuXG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbmZsdXhfcmlvdC5EaXNwYXRjaGVyID0gYXNzaWduKG5ldyBEaXNwYXRjaGVyKCksIHtcbiAgaGFuZGxlU2VydmVyQWN0aW9uOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVBY3Rpb24oYWN0aW9uLCBmbHV4X3Jpb3QuQ29uc3RhbnRzLkFjdGlvblNvdXJjZXMuU0VSVkVSX0FDVElPTilcbiAgfSxcblxuICBoYW5kbGVWaWV3QWN0aW9uOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVBY3Rpb24oYWN0aW9uLCBmbHV4X3Jpb3QuQ29uc3RhbnRzLkFjdGlvblNvdXJjZXMuVklFV19BQ1RJT04pXG4gIH0sXG5cbiAgaGFuZGxlQWN0aW9uOiBmdW5jdGlvbihhY3Rpb24sIHNvdXJjZSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKHtcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9KVxuICB9XG59KVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZmx1eF9yaW90XG5cbn0pKCk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbm1vZHVsZS5leHBvcnRzLkRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL2xpYi9EaXNwYXRjaGVyJylcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJy4vaW52YXJpYW50Jyk7XG5cbnZhciBfbGFzdElEID0gMTtcbnZhciBfcHJlZml4ID0gJ0lEXyc7XG5cbi8qKlxuICogRGlzcGF0Y2hlciBpcyB1c2VkIHRvIGJyb2FkY2FzdCBwYXlsb2FkcyB0byByZWdpc3RlcmVkIGNhbGxiYWNrcy4gVGhpcyBpc1xuICogZGlmZmVyZW50IGZyb20gZ2VuZXJpYyBwdWItc3ViIHN5c3RlbXMgaW4gdHdvIHdheXM6XG4gKlxuICogICAxKSBDYWxsYmFja3MgYXJlIG5vdCBzdWJzY3JpYmVkIHRvIHBhcnRpY3VsYXIgZXZlbnRzLiBFdmVyeSBwYXlsb2FkIGlzXG4gKiAgICAgIGRpc3BhdGNoZWQgdG8gZXZlcnkgcmVnaXN0ZXJlZCBjYWxsYmFjay5cbiAqICAgMikgQ2FsbGJhY2tzIGNhbiBiZSBkZWZlcnJlZCBpbiB3aG9sZSBvciBwYXJ0IHVudGlsIG90aGVyIGNhbGxiYWNrcyBoYXZlXG4gKiAgICAgIGJlZW4gZXhlY3V0ZWQuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoaXMgaHlwb3RoZXRpY2FsIGZsaWdodCBkZXN0aW5hdGlvbiBmb3JtLCB3aGljaFxuICogc2VsZWN0cyBhIGRlZmF1bHQgY2l0eSB3aGVuIGEgY291bnRyeSBpcyBzZWxlY3RlZDpcbiAqXG4gKiAgIHZhciBmbGlnaHREaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNvdW50cnkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENvdW50cnlTdG9yZSA9IHtjb3VudHJ5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNpdHkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENpdHlTdG9yZSA9IHtjaXR5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHRoZSBiYXNlIGZsaWdodCBwcmljZSBvZiB0aGUgc2VsZWN0ZWQgY2l0eVxuICogICB2YXIgRmxpZ2h0UHJpY2VTdG9yZSA9IHtwcmljZTogbnVsbH1cbiAqXG4gKiBXaGVuIGEgdXNlciBjaGFuZ2VzIHRoZSBzZWxlY3RlZCBjaXR5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjaXR5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDaXR5OiAncGFyaXMnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBgQ2l0eVN0b3JlYDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gKiAgICAgICAgIGNhc2UgJ2NvdW50cnktdXBkYXRlJzpcbiAqICAgICAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NpdHlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBnZXRGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKlxuICogICAgICAgICBjYXNlICdjaXR5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgYGNvdW50cnktdXBkYXRlYCBwYXlsb2FkIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBpbnZva2UgdGhlIHN0b3JlcydcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIGluIG9yZGVyOiBgQ291bnRyeVN0b3JlYCwgYENpdHlTdG9yZWAsIHRoZW5cbiAqIGBGbGlnaHRQcmljZVN0b3JlYC5cbiAqL1xuXG4gIGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aXRoIGV2ZXJ5IGRpc3BhdGNoZWQgcGF5bG9hZC4gUmV0dXJuc1xuICAgKiBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCBgd2FpdEZvcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSBfcHJlZml4ICsgX2xhc3RJRCsrO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNhbGxiYWNrIGJhc2VkIG9uIGl0cyB0b2tlbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyPWZ1bmN0aW9uKGlkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgJ0Rpc3BhdGNoZXIudW5yZWdpc3RlciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgIGlkXG4gICAgKTtcbiAgICBkZWxldGUgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIGNhbGxiYWNrcyBzcGVjaWZpZWQgdG8gYmUgaW52b2tlZCBiZWZvcmUgY29udGludWluZyBleGVjdXRpb25cbiAgICogb2YgdGhlIGN1cnJlbnQgY2FsbGJhY2suIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgYSBjYWxsYmFjayBpblxuICAgKiByZXNwb25zZSB0byBhIGRpc3BhdGNoZWQgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheTxzdHJpbmc+fSBpZHNcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLndhaXRGb3I9ZnVuY3Rpb24oaWRzKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJ1xuICAgICk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBpZCA9IGlkc1tpaV07XG4gICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0sXG4gICAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlICcgK1xuICAgICAgICAgICd3YWl0aW5nIGZvciBgJXNgLicsXG4gICAgICAgICAgaWRcbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpbnZhcmlhbnQoXG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgICAgaWRcbiAgICAgICk7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYSBwYXlsb2FkIHRvIGFsbCByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICAhdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoLmRpc3BhdGNoKC4uLik6IENhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJ1xuICAgICk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGlzIERpc3BhdGNoZXIgY3VycmVudGx5IGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuaXNEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBjYWxsYmFjayBzdG9yZWQgd2l0aCB0aGUgZ2l2ZW4gaWQuIEFsc28gZG8gc29tZSBpbnRlcm5hbFxuICAgKiBib29ra2VlcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2s9ZnVuY3Rpb24oaWQpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSB0cnVlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSh0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdXAgYm9va2tlZXBpbmcgbmVlZGVkIHdoZW4gZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZz1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIGJvb2trZWVwaW5nIHVzZWQgZm9yIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChmYWxzZSkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkob2JqKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIGtleXM7XG5cdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qIVxuICogUGFyc2UgSmF2YVNjcmlwdCBTREtcbiAqIFZlcnNpb246IDEuNC4yXG4gKiBCdWlsdDogVGh1IEFwciAwOSAyMDE1IDE3OjIwOjMxXG4gKiBodHRwOi8vcGFyc2UuY29tXG4gKlxuICogQ29weXJpZ2h0IDIwMTUgUGFyc2UsIEluYy5cbiAqIFRoZSBQYXJzZSBKYXZhU2NyaXB0IFNESyBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKlxuICogSW5jbHVkZXM6IFVuZGVyc2NvcmUuanNcbiAqIENvcHlyaWdodCAyMDA5LTIwMTIgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIEluYy5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHJvb3QuUGFyc2UuVkVSU0lPTiA9IFwianMxLjQuMlwiO1xufSh0aGlzKSk7XG4vLyAgICAgVW5kZXJzY29yZS5qcyAxLjQuNFxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgSW5jLlxuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjQuNCc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfLmhhcyhvYmosIGtleSkpIHtcbiAgICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIWl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycywgZmlyc3QpIHtcbiAgICBpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIGZpcnN0ID8gbnVsbCA6IFtdO1xuICAgIHJldHVybiBfW2ZpcnN0ID8gJ2ZpbmQnIDogJ2ZpbHRlciddKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gdmFsdWVba2V5XSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy53aGVyZShvYmosIGF0dHJzLCB0cnVlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCBvciAoZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIC8vIENhbid0IG9wdGltaXplIGFycmF5cyBvZiBpbnRlZ2VycyBsb25nZXIgdGhhbiA2NSw1MzUgZWxlbWVudHMuXG4gIC8vIFNlZTogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTgwNzk3XG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiAtSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IC1JbmZpbml0eSwgdmFsdWU6IC1JbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkID49IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzRW1wdHkob2JqKSkgcmV0dXJuIEluZmluaXR5O1xuICAgIHZhciByZXN1bHQgPSB7Y29tcHV0ZWQgOiBJbmZpbml0eSwgdmFsdWU6IEluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPCByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGFuIGFycmF5LlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmFuZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzaHVmZmxlZCA9IFtdO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKGluZGV4KyspO1xuICAgICAgc2h1ZmZsZWRbaW5kZXggLSAxXSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbG9va3VwIGl0ZXJhdG9ycy5cbiAgdmFyIGxvb2t1cEl0ZXJhdG9yID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlIDogZnVuY3Rpb24ob2JqKXsgcmV0dXJuIG9ialt2YWx1ZV07IH07XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdG9yLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlIDogdmFsdWUsXG4gICAgICAgIGluZGV4IDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhIDogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggPCByaWdodC5pbmRleCA/IC0xIDogMTtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0LCBiZWhhdmlvcikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSB8fCBfLmlkZW50aXR5KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICB2YXIga2V5ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBncm91cChvYmosIHZhbHVlLCBjb250ZXh0LCBmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICAgIChfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSA6IChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICAgIGlmICghXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSA9IDA7XG4gICAgICByZXN1bHRba2V5XSsrO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciA9IGl0ZXJhdG9yID09IG51bGwgPyBfLmlkZW50aXR5IDogbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbbWlkXSkgPCB2YWx1ZSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjb252ZXJ0IGFueXRoaW5nIGl0ZXJhYmxlIGludG8gYSByZWFsLCBsaXZlIGFycmF5LlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHJldHVybiAobiAhPSBudWxsKSAmJiAhZ3VhcmQgPyBzbGljZS5jYWxsKGFycmF5LCAwLCBuKSA6IGFycmF5WzBdO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuICE9IG51bGwpICYmICFndWFyZCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb21wbGV0ZWx5IGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIGFuIGFycmF5LlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yob3RoZXIsIGl0ZW0pID49IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmdzLCAnbGVuZ3RoJykpO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJncywgXCJcIiArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbiA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbikge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQgJiYgbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYWxsIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdFxuICAvLyBhbGwgY2FsbGJhY2tzIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIGZ1bmNzID0gXy5mdW5jdGlvbnMob2JqKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHRpbWVvdXQsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBuZXcgRGF0ZTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIHJlc3VsdDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgcmFuID0gZmFsc2UsIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhbikgcmV0dXJuIG1lbW87XG4gICAgICByYW4gPSB0cnVlO1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZnVuY107XG4gICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICBpZiAodGltZXMgPD0gMCkgcmV0dXJuIGZ1bmMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gT2JqZWN0KG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzW2tleXMubGVuZ3RoXSA9IGtleTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHZhbHVlcy5wdXNoKG9ialtrZXldKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHBhaXJzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcGFpcnMucHVzaChba2V5LCBvYmpba2V5XV0pO1xuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJlc3VsdFtvYmpba2V5XV0gPSBrZXk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBudWxsKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIEhhcm1vbnkgYGVnYWxgIHByb3Bvc2FsOiBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PSArYjtcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09IGI7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIChiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgICAgICBpZiAoXy5oYXMoYSwga2V5KSkge1xuICAgICAgICAgIC8vIENvdW50IHRoZSBleHBlY3RlZCBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyLlxuICAgICAgICAgIGlmICghKHJlc3VsdCA9IF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gYikge1xuICAgICAgICAgIGlmIChfLmhhcyhiLCBrZXkpICYmICEoc2l6ZS0tKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gIXNpemU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiLCBbXSwgW10pO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAuXG4gIGVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICEhKG9iaiAmJiBfLmhhcyhvYmosICdjYWxsZWUnKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS5cbiAgaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0b3JzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KG4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAnLyc6ICcmI3gyRjsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIHByb3BlcnR5IGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQ7XG4gIC8vIG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbn0pLmNhbGwodGhpcyk7XG5cbi8qZ2xvYmFsIF86IGZhbHNlLCAkOiBmYWxzZSwgbG9jYWxTdG9yYWdlOiBmYWxzZSwgcHJvY2VzczogdHJ1ZSxcbiAgWE1MSHR0cFJlcXVlc3Q6IGZhbHNlLCBYRG9tYWluUmVxdWVzdDogZmFsc2UsIGV4cG9ydHM6IGZhbHNlLFxuICByZXF1aXJlOiBmYWxzZSwgc2V0VGltZW91dDogdHJ1ZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIC8qKlxuICAgKiBDb250YWlucyBhbGwgUGFyc2UgQVBJIGNsYXNzZXMgYW5kIGZ1bmN0aW9ucy5cbiAgICogQG5hbWUgUGFyc2VcbiAgICogQG5hbWVzcGFjZVxuICAgKlxuICAgKiBDb250YWlucyBhbGwgUGFyc2UgQVBJIGNsYXNzZXMgYW5kIGZ1bmN0aW9ucy5cbiAgICovXG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG5cbiAgdmFyIHJlcSA9IHR5cGVvZihyZXF1aXJlKSA9PT0gJ2Z1bmN0aW9uJyA/IHJlcXVpcmUgOiBudWxsO1xuICAvLyBMb2FkIHJlZmVyZW5jZXMgdG8gb3RoZXIgZGVwZW5kZW5jaWVzXG4gIGlmICh0eXBlb2YoWE1MSHR0cFJlcXVlc3QpICE9PSAndW5kZWZpbmVkJykge1xuICAgIFBhcnNlLlhNTEh0dHBSZXF1ZXN0ID0gWE1MSHR0cFJlcXVlc3Q7XG4gIH0gZWxzZSBpZiAodHlwZW9mKHJlcXVpcmUpID09PSAnZnVuY3Rpb24nICYmXG4gICAgICB0eXBlb2YocmVxdWlyZS5lbnN1cmUpID09PSAndW5kZWZpbmVkJykge1xuICAgIFBhcnNlLlhNTEh0dHBSZXF1ZXN0ID0gcmVxKCd4bWxodHRwcmVxdWVzdCcpLlhNTEh0dHBSZXF1ZXN0O1xuICB9XG4gIC8vIEltcG9ydCBQYXJzZSdzIGxvY2FsIGNvcHkgb2YgdW5kZXJzY29yZS5cbiAgaWYgKHR5cGVvZihleHBvcnRzKSAhPT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0cy5fKSB7XG4gICAgLy8gV2UncmUgcnVubmluZyBpbiBhIENvbW1vbkpTIGVudmlyb25tZW50XG4gICAgUGFyc2UuXyA9IGV4cG9ydHMuXy5ub0NvbmZsaWN0KCk7XG4gICAgZXhwb3J0cy5QYXJzZSA9IFBhcnNlO1xuICB9IGVsc2Uge1xuICAgIFBhcnNlLl8gPSBfLm5vQ29uZmxpY3QoKTtcbiAgfVxuXG4gIC8vIElmIGpRdWVyeSBvciBaZXB0byBoYXMgYmVlbiBpbmNsdWRlZCwgZ3JhYiBhIHJlZmVyZW5jZSB0byBpdC5cbiAgaWYgKHR5cGVvZigkKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFBhcnNlLiQgPSAkO1xuICB9XG5cbiAgLy8gSGVscGVyc1xuICAvLyAtLS0tLS0tXG5cbiAgLy8gU2hhcmVkIGVtcHR5IGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGFpZCBpbiBwcm90b3R5cGUtY2hhaW4gY3JlYXRpb24uXG4gIHZhciBFbXB0eUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oKSB7fTtcblxuICAvLyBUT0RPOiBmaXggdGhpcyBzbyB0aGF0IFBhcnNlT2JqZWN0cyBhcmVuJ3QgYWxsIGNhbGxlZCBcImNoaWxkXCIgaW4gZGVidWdnZXIuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb3JyZWN0bHkgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sIGZvciBzdWJjbGFzc2VzLlxuICAvLyBTaW1pbGFyIHRvIGBnb29nLmluaGVyaXRzYCwgYnV0IHVzZXMgYSBoYXNoIG9mIHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFuZFxuICAvLyBjbGFzcyBwcm9wZXJ0aWVzIHRvIGJlIGV4dGVuZGVkLlxuICB2YXIgaW5oZXJpdHMgPSBmdW5jdGlvbihwYXJlbnQsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgdmFyIGNoaWxkO1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuICAgIC8vICh0aGUgXCJjb25zdHJ1Y3RvclwiIHByb3BlcnR5IGluIHlvdXIgYGV4dGVuZGAgZGVmaW5pdGlvbiksIG9yIGRlZmF1bHRlZFxuICAgIC8vIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQncyBjb25zdHJ1Y3Rvci5cbiAgICBpZiAocHJvdG9Qcm9wcyAmJiBwcm90b1Byb3BzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XG4gICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qKiBAaWdub3JlICovXG4gICAgICBjaGlsZCA9IGZ1bmN0aW9uKCl7IHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIH1cblxuICAgIC8vIEluaGVyaXQgY2xhc3MgKHN0YXRpYykgcHJvcGVydGllcyBmcm9tIHBhcmVudC5cbiAgICBQYXJzZS5fLmV4dGVuZChjaGlsZCwgcGFyZW50KTtcblxuICAgIC8vIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgLy8gYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICBFbXB0eUNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG4gICAgY2hpbGQucHJvdG90eXBlID0gbmV3IEVtcHR5Q29uc3RydWN0b3IoKTtcblxuICAgIC8vIEFkZCBwcm90b3R5cGUgcHJvcGVydGllcyAoaW5zdGFuY2UgcHJvcGVydGllcykgdG8gdGhlIHN1YmNsYXNzLFxuICAgIC8vIGlmIHN1cHBsaWVkLlxuICAgIGlmIChwcm90b1Byb3BzKSB7XG4gICAgICBQYXJzZS5fLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIH1cblxuICAgIC8vIEFkZCBzdGF0aWMgcHJvcGVydGllcyB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24sIGlmIHN1cHBsaWVkLlxuICAgIGlmIChzdGF0aWNQcm9wcykge1xuICAgICAgUGFyc2UuXy5leHRlbmQoY2hpbGQsIHN0YXRpY1Byb3BzKTtcbiAgICB9XG5cbiAgICAvLyBDb3JyZWN0bHkgc2V0IGNoaWxkJ3MgYHByb3RvdHlwZS5jb25zdHJ1Y3RvcmAuXG4gICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG5cbiAgICAvLyBTZXQgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSBpbiBjYXNlIHRoZSBwYXJlbnQncyBwcm90b3R5cGUgaXNcbiAgICAvLyBuZWVkZWQgbGF0ZXIuXG4gICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICAgIHJldHVybiBjaGlsZDtcbiAgfTtcblxuICAvLyBTZXQgdGhlIHNlcnZlciBmb3IgUGFyc2UgdG8gdGFsayB0by5cbiAgUGFyc2Uuc2VydmVyVVJMID0gXCJodHRwczovL2FwaS5wYXJzZS5jb21cIjtcblxuICAvLyBDaGVjayB3aGV0aGVyIHdlIGFyZSBydW5uaW5nIGluIE5vZGUuanMuXG4gIGlmICh0eXBlb2YocHJvY2VzcykgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgIHByb2Nlc3MudmVyc2lvbnMgJiZcbiAgICAgIHByb2Nlc3MudmVyc2lvbnMubm9kZSkge1xuICAgIFBhcnNlLl9pc05vZGUgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgdGhpcyBtZXRob2QgZmlyc3QgdG8gc2V0IHVwIHlvdXIgYXV0aGVudGljYXRpb24gdG9rZW5zIGZvciBQYXJzZS5cbiAgICogWW91IGNhbiBnZXQgeW91ciBrZXlzIGZyb20gdGhlIERhdGEgQnJvd3NlciBvbiBwYXJzZS5jb20uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcHBsaWNhdGlvbklkIFlvdXIgUGFyc2UgQXBwbGljYXRpb24gSUQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBqYXZhU2NyaXB0S2V5IFlvdXIgUGFyc2UgSmF2YVNjcmlwdCBLZXkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtYXN0ZXJLZXkgKG9wdGlvbmFsKSBZb3VyIFBhcnNlIE1hc3RlciBLZXkuIChOb2RlLmpzIG9ubHkhKVxuICAgKi9cbiAgUGFyc2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKGFwcGxpY2F0aW9uSWQsIGphdmFTY3JpcHRLZXksIG1hc3RlcktleSkge1xuICAgIGlmIChtYXN0ZXJLZXkpIHtcbiAgICAgIHRocm93IFwiUGFyc2UuaW5pdGlhbGl6ZSgpIHdhcyBwYXNzZWQgYSBNYXN0ZXIgS2V5LCB3aGljaCBpcyBvbmx5IFwiICtcbiAgICAgICAgXCJhbGxvd2VkIGZyb20gd2l0aGluIE5vZGUuanMuXCI7XG4gICAgfVxuICAgIFBhcnNlLl9pbml0aWFsaXplKGFwcGxpY2F0aW9uSWQsIGphdmFTY3JpcHRLZXkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoaXMgbWV0aG9kIGZpcnN0IHRvIHNldCB1cCBtYXN0ZXIgYXV0aGVudGljYXRpb24gdG9rZW5zIGZvciBQYXJzZS5cbiAgICogVGhpcyBtZXRob2QgaXMgZm9yIFBhcnNlJ3Mgb3duIHByaXZhdGUgdXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBwbGljYXRpb25JZCBZb3VyIFBhcnNlIEFwcGxpY2F0aW9uIElELlxuICAgKiBAcGFyYW0ge1N0cmluZ30gamF2YVNjcmlwdEtleSBZb3VyIFBhcnNlIEphdmFTY3JpcHQgS2V5LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWFzdGVyS2V5IFlvdXIgUGFyc2UgTWFzdGVyIEtleS5cbiAgICovXG4gIFBhcnNlLl9pbml0aWFsaXplID0gZnVuY3Rpb24oYXBwbGljYXRpb25JZCwgamF2YVNjcmlwdEtleSwgbWFzdGVyS2V5KSB7XG4gICAgUGFyc2UuYXBwbGljYXRpb25JZCA9IGFwcGxpY2F0aW9uSWQ7XG4gICAgUGFyc2UuamF2YVNjcmlwdEtleSA9IGphdmFTY3JpcHRLZXk7XG4gICAgUGFyc2UubWFzdGVyS2V5ID0gbWFzdGVyS2V5O1xuICAgIFBhcnNlLl91c2VNYXN0ZXJLZXkgPSBmYWxzZTtcbiAgfTtcblxuICAvLyBJZiB3ZSdyZSBydW5uaW5nIGluIG5vZGUuanMsIGFsbG93IHVzaW5nIHRoZSBtYXN0ZXIga2V5LlxuICBpZiAoUGFyc2UuX2lzTm9kZSkge1xuICAgIFBhcnNlLmluaXRpYWxpemUgPSBQYXJzZS5faW5pdGlhbGl6ZTtcblxuICAgIFBhcnNlLkNsb3VkID0gUGFyc2UuQ2xvdWQgfHwge307XG4gICAgLyoqXG4gICAgICogU3dpdGNoZXMgdGhlIFBhcnNlIFNESyB0byB1c2luZyB0aGUgTWFzdGVyIGtleS4gIFRoZSBNYXN0ZXIga2V5IGdyYW50c1xuICAgICAqIHByaXZlbGVnZWQgYWNjZXNzIHRvIHRoZSBkYXRhIGluIFBhcnNlIGFuZCBjYW4gYmUgdXNlZCB0byBieXBhc3MgQUNMcyBhbmRcbiAgICAgKiBvdGhlciByZXN0cmljdGlvbnMgdGhhdCBhcmUgYXBwbGllZCB0byB0aGUgY2xpZW50IFNES3MuXG4gICAgICogPHA+PHN0cm9uZz48ZW0+QXZhaWxhYmxlIGluIENsb3VkIENvZGUgYW5kIE5vZGUuanMgb25seS48L2VtPjwvc3Ryb25nPlxuICAgICAqIDwvcD5cbiAgICAgKi9cbiAgICBQYXJzZS5DbG91ZC51c2VNYXN0ZXJLZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIFBhcnNlLl91c2VNYXN0ZXJLZXkgPSB0cnVlO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBwcmVmaXggZm9yIFN0b3JhZ2Uga2V5cyB1c2VkIGJ5IHRoaXMgaW5zdGFuY2Ugb2YgUGFyc2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSByZWxhdGl2ZSBzdWZmaXggdG8gYXBwZW5kIHRvIGl0LlxuICAgKiAgICAgbnVsbCBvciB1bmRlZmluZWQgaXMgdHJlYXRlZCBhcyB0aGUgZW1wdHkgc3RyaW5nLlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBmdWxsIGtleSBuYW1lLlxuICAgKi9cbiAgUGFyc2UuX2dldFBhcnNlUGF0aCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBpZiAoIVBhcnNlLmFwcGxpY2F0aW9uSWQpIHtcbiAgICAgIHRocm93IFwiWW91IG5lZWQgdG8gY2FsbCBQYXJzZS5pbml0aWFsaXplIGJlZm9yZSB1c2luZyBQYXJzZS5cIjtcbiAgICB9XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gXCJcIjtcbiAgICB9XG4gICAgaWYgKCFQYXJzZS5fLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICB0aHJvdyBcIlRyaWVkIHRvIGdldCBhIFN0b3JhZ2UgcGF0aCB0aGF0IHdhc24ndCBhIFN0cmluZy5cIjtcbiAgICB9XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMSk7XG4gICAgfVxuICAgIHJldHVybiBcIlBhcnNlL1wiICsgUGFyc2UuYXBwbGljYXRpb25JZCArIFwiL1wiICsgcGF0aDtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIFByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSB1bmlxdWUgc3RyaW5nIGZvciB0aGlzIGFwcCBvblxuICAgKiB0aGlzIG1hY2hpbmUuXG4gICAqIEdldHMgcmVzZXQgd2hlbiBTdG9yYWdlIGlzIGNsZWFyZWQuXG4gICAqL1xuICBQYXJzZS5faW5zdGFsbGF0aW9uSWQgPSBudWxsO1xuICBQYXJzZS5fZ2V0SW5zdGFsbGF0aW9uSWQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBTZWUgaWYgaXQncyBjYWNoZWQgaW4gUkFNLlxuICAgIGlmIChQYXJzZS5faW5zdGFsbGF0aW9uSWQpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFBhcnNlLl9pbnN0YWxsYXRpb25JZCk7XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIGdldCBpdCBmcm9tIFN0b3JhZ2UuXG4gICAgdmFyIHBhdGggPSBQYXJzZS5fZ2V0UGFyc2VQYXRoKFwiaW5zdGFsbGF0aW9uSWRcIik7XG4gICAgcmV0dXJuIChQYXJzZS5TdG9yYWdlLmdldEl0ZW1Bc3luYyhwYXRoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgUGFyc2UuX2luc3RhbGxhdGlvbklkID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKCFQYXJzZS5faW5zdGFsbGF0aW9uSWQgfHwgUGFyc2UuX2luc3RhbGxhdGlvbklkID09PSBcIlwiKSB7XG4gICAgICAgICAgLy8gSXQgd2Fzbid0IGluIFN0b3JhZ2UsIHNvIGNyZWF0ZSBhIG5ldyBvbmUuXG4gICAgICAgICAgdmFyIGhleE9jdGV0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICBNYXRoLmZsb29yKCgxK01hdGgucmFuZG9tKCkpKjB4MTAwMDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBQYXJzZS5faW5zdGFsbGF0aW9uSWQgPSAoXG4gICAgICAgICAgICBoZXhPY3RldCgpICsgaGV4T2N0ZXQoKSArIFwiLVwiICtcbiAgICAgICAgICAgIGhleE9jdGV0KCkgKyBcIi1cIiArXG4gICAgICAgICAgICBoZXhPY3RldCgpICsgXCItXCIgK1xuICAgICAgICAgICAgaGV4T2N0ZXQoKSArIFwiLVwiICtcbiAgICAgICAgICAgIGhleE9jdGV0KCkgKyBoZXhPY3RldCgpICsgaGV4T2N0ZXQoKSk7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlN0b3JhZ2Uuc2V0SXRlbUFzeW5jKHBhdGgsIFBhcnNlLl9pbnN0YWxsYXRpb25JZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhQYXJzZS5faW5zdGFsbGF0aW9uSWQpO1xuICAgICAgfSlcbiAgICApO1xuICB9O1xuXG4gIFBhcnNlLl9wYXJzZURhdGUgPSBmdW5jdGlvbihpc284NjAxKSB7XG4gICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoXG4gICAgICBcIl4oWzAtOV17MSw0fSktKFswLTldezEsMn0pLShbMC05XXsxLDJ9KVwiICsgXCJUXCIgK1xuICAgICAgXCIoWzAtOV17MSwyfSk6KFswLTldezEsMn0pOihbMC05XXsxLDJ9KVwiICtcbiAgICAgIFwiKC4oWzAtOV0rKSk/XCIgKyBcIlokXCIpO1xuICAgIHZhciBtYXRjaCA9IHJlZ2V4cC5leGVjKGlzbzg2MDEpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciB5ZWFyID0gbWF0Y2hbMV0gfHwgMDtcbiAgICB2YXIgbW9udGggPSAobWF0Y2hbMl0gfHwgMSkgLSAxO1xuICAgIHZhciBkYXkgPSBtYXRjaFszXSB8fCAwO1xuICAgIHZhciBob3VyID0gbWF0Y2hbNF0gfHwgMDtcbiAgICB2YXIgbWludXRlID0gbWF0Y2hbNV0gfHwgMDtcbiAgICB2YXIgc2Vjb25kID0gbWF0Y2hbNl0gfHwgMDtcbiAgICB2YXIgbWlsbGkgPSBtYXRjaFs4XSB8fCAwO1xuXG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaSkpO1xuICB9O1xuXG4gIFBhcnNlLl9hamF4SUU4ID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgdmFyIHhkciA9IG5ldyBYRG9tYWluUmVxdWVzdCgpO1xuICAgIHhkci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXNwb25zZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4ZHIucmVzcG9uc2VUZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHhkci5vbmVycm9yID0geGRyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTGV0J3MgZmFrZSBhIHJlYWwgZXJyb3IgbWVzc2FnZS5cbiAgICAgIHZhciBmYWtlUmVzcG9uc2UgPSB7XG4gICAgICAgIHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNvZGU6IFBhcnNlLkVycm9yLlhfRE9NQUlOX1JFUVVFU1QsXG4gICAgICAgICAgZXJyb3I6IFwiSUUncyBYRG9tYWluUmVxdWVzdCBkb2VzIG5vdCBzdXBwbHkgZXJyb3IgaW5mby5cIlxuICAgICAgICB9KVxuICAgICAgfTtcbiAgICAgIHByb21pc2UucmVqZWN0KGZha2VSZXNwb25zZSk7XG4gICAgfTtcbiAgICB4ZHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge307XG4gICAgeGRyLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgIHhkci5zZW5kKGRhdGEpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIFBhcnNlLl91c2VYRG9tYWluUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YoWERvbWFpblJlcXVlc3QpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAvLyBXZSdyZSBpbiBJRSA4Ky5cbiAgICAgIGlmICgnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgWE1MSHR0cFJlcXVlc3QoKSkge1xuICAgICAgICAvLyBXZSdyZSBpbiBJRSAxMCsuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gVE9ETyhrbGltdCk6IEdldCByaWQgb2Ygc3VjY2Vzcy9lcnJvciB1c2FnZSBpbiB3ZWJzaXRlLlxuICBQYXJzZS5fYWpheCA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICAgIGVycm9yOiBlcnJvclxuICAgIH07XG5cbiAgICBpZiAoUGFyc2UuX3VzZVhEb21haW5SZXF1ZXN0KCkpIHtcbiAgICAgIHJldHVybiBQYXJzZS5fYWpheElFOChtZXRob2QsIHVybCwgZGF0YSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgIHZhciBhdHRlbXB0cyA9IDA7XG5cbiAgICB2YXIgZGlzcGF0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBoYW5kbGVkID0gZmFsc2U7XG4gICAgICB2YXIgeGhyID0gbmV3IFBhcnNlLlhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzcG9uc2UsIHhoci5zdGF0dXMsIHhocik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh4aHIuc3RhdHVzID49IDUwMCkgeyAvLyBSZXRyeSBvbiA1WFhcbiAgICAgICAgICAgIGlmICgrK2F0dGVtcHRzIDwgNSkge1xuICAgICAgICAgICAgICAvLyBFeHBvbmVudGlhbGx5LWdyb3dpbmcgZGVsYXlcbiAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gTWF0aC5yb3VuZChcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMTI1ICogTWF0aC5wb3coMiwgYXR0ZW1wdHMpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZGlzcGF0Y2gsIGRlbGF5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEFmdGVyIDUgcmV0cmllcywgZmFpbFxuICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdCh4aHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdCh4aHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluJyk7ICAvLyBhdm9pZCBwcmUtZmxpZ2h0LlxuICAgICAgaWYgKFBhcnNlLl9pc05vZGUpIHtcbiAgICAgICAgLy8gQWRkIGEgc3BlY2lhbCB1c2VyIGFnZW50IGp1c3QgZm9yIHJlcXVlc3QgZnJvbSBub2RlLmpzLlxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlVzZXItQWdlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJQYXJzZS9cIiArIFBhcnNlLlZFUlNJT04gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiAoTm9kZUpTIFwiICsgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgfTtcblxuICAgIGRpc3BhdGNoKCk7XG4gICAgcmV0dXJuIHByb21pc2UuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7IFxuICB9O1xuXG4gIC8vIEEgc2VsZi1wcm9wYWdhdGluZyBleHRlbmQgZnVuY3Rpb24uXG4gIFBhcnNlLl9leHRlbmQgPSBmdW5jdGlvbihwcm90b1Byb3BzLCBjbGFzc1Byb3BzKSB7XG4gICAgdmFyIGNoaWxkID0gaW5oZXJpdHModGhpcywgcHJvdG9Qcm9wcywgY2xhc3NQcm9wcyk7XG4gICAgY2hpbGQuZXh0ZW5kID0gdGhpcy5leHRlbmQ7XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBPcHRpb25zOlxuICAgKiAgIHJvdXRlOiBpcyBjbGFzc2VzLCB1c2VycywgbG9naW4sIGV0Yy5cbiAgICogICBvYmplY3RJZDogbnVsbCBpZiB0aGVyZSBpcyBubyBhc3NvY2lhdGVkIG9iamVjdElkLlxuICAgKiAgIG1ldGhvZDogdGhlIGh0dHAgbWV0aG9kIGZvciB0aGUgUkVTVCBBUEkuXG4gICAqICAgZGF0YU9iamVjdDogdGhlIHBheWxvYWQgYXMgYW4gb2JqZWN0LCBvciBudWxsIGlmIHRoZXJlIGlzIG5vbmUuXG4gICAqICAgdXNlTWFzdGVyS2V5OiBvdmVycmlkZXMgd2hldGhlciB0byB1c2UgdGhlIG1hc3RlciBrZXkgaWYgc2V0LlxuICAgKiBAaWdub3JlXG4gICAqL1xuICBQYXJzZS5fcmVxdWVzdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgcm91dGUgPSBvcHRpb25zLnJvdXRlO1xuICAgIHZhciBjbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcbiAgICB2YXIgb2JqZWN0SWQgPSBvcHRpb25zLm9iamVjdElkO1xuICAgIHZhciBtZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcbiAgICB2YXIgdXNlTWFzdGVyS2V5ID0gb3B0aW9ucy51c2VNYXN0ZXJLZXk7XG4gICAgdmFyIHNlc3Npb25Ub2tlbiA9IG9wdGlvbnMuc2Vzc2lvblRva2VuO1xuICAgIHZhciBkYXRhT2JqZWN0ID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgaWYgKCFQYXJzZS5hcHBsaWNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBcIllvdSBtdXN0IHNwZWNpZnkgeW91ciBhcHBsaWNhdGlvbklkIHVzaW5nIFBhcnNlLmluaXRpYWxpemUuXCI7XG4gICAgfVxuXG4gICAgaWYgKCFQYXJzZS5qYXZhU2NyaXB0S2V5ICYmICFQYXJzZS5tYXN0ZXJLZXkpIHtcbiAgICAgIHRocm93IFwiWW91IG11c3Qgc3BlY2lmeSBhIGtleSB1c2luZyBQYXJzZS5pbml0aWFsaXplLlwiO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFdlIGNhbiByZW1vdmUgdGhpcyBjaGVjayBsYXRlciwgYnV0IGl0J3MgdXNlZnVsIGZvciBkZXZlbG9wbWVudC5cbiAgICBpZiAocm91dGUgIT09IFwiYmF0Y2hcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJjbGFzc2VzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiZXZlbnRzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiZmlsZXNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJmdW5jdGlvbnNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJsb2dpblwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImxvZ291dFwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInB1c2hcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJyZXF1ZXN0UGFzc3dvcmRSZXNldFwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInJlc3RfdmVyaWZ5X2FuYWx5dGljc1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInVzZXJzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiam9ic1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImNvbmZpZ1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInNlc3Npb25zXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwidXBncmFkZVRvUmV2b2NhYmxlU2Vzc2lvblwiKSB7XG4gICAgICB0aHJvdyBcIkJhZCByb3V0ZTogJ1wiICsgcm91dGUgKyBcIicuXCI7XG4gICAgfVxuXG4gICAgdmFyIHVybCA9IFBhcnNlLnNlcnZlclVSTDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09IFwiL1wiKSB7XG4gICAgICB1cmwgKz0gXCIvXCI7XG4gICAgfVxuICAgIHVybCArPSBcIjEvXCIgKyByb3V0ZTtcbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICB1cmwgKz0gXCIvXCIgKyBjbGFzc05hbWU7XG4gICAgfVxuICAgIGlmIChvYmplY3RJZCkge1xuICAgICAgdXJsICs9IFwiL1wiICsgb2JqZWN0SWQ7XG4gICAgfVxuXG4gICAgZGF0YU9iamVjdCA9IFBhcnNlLl8uY2xvbmUoZGF0YU9iamVjdCB8fCB7fSk7XG4gICAgaWYgKG1ldGhvZCAhPT0gXCJQT1NUXCIpIHtcbiAgICAgIGRhdGFPYmplY3QuX21ldGhvZCA9IG1ldGhvZDtcbiAgICAgIG1ldGhvZCA9IFwiUE9TVFwiO1xuICAgIH1cblxuICAgIGlmIChQYXJzZS5fLmlzVW5kZWZpbmVkKHVzZU1hc3RlcktleSkpIHtcbiAgICAgIHVzZU1hc3RlcktleSA9IFBhcnNlLl91c2VNYXN0ZXJLZXk7XG4gICAgfVxuXG4gICAgZGF0YU9iamVjdC5fQXBwbGljYXRpb25JZCA9IFBhcnNlLmFwcGxpY2F0aW9uSWQ7XG4gICAgaWYgKCF1c2VNYXN0ZXJLZXkpIHtcbiAgICAgIGRhdGFPYmplY3QuX0phdmFTY3JpcHRLZXkgPSBQYXJzZS5qYXZhU2NyaXB0S2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhT2JqZWN0Ll9NYXN0ZXJLZXkgPSBQYXJzZS5tYXN0ZXJLZXk7XG4gICAgfVxuXG4gICAgZGF0YU9iamVjdC5fQ2xpZW50VmVyc2lvbiA9IFBhcnNlLlZFUlNJT047XG5cbiAgICByZXR1cm4gUGFyc2UuX2dldEluc3RhbGxhdGlvbklkKCkudGhlbihmdW5jdGlvbihpaWQpIHtcbiAgICAgIGRhdGFPYmplY3QuX0luc3RhbGxhdGlvbklkID0gaWlkO1xuXG4gICAgICBpZiAoc2Vzc2lvblRva2VuKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKHsgX3Nlc3Npb25Ub2tlbjogc2Vzc2lvblRva2VuIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudEFzeW5jKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbihjdXJyZW50VXNlcikge1xuICAgICAgaWYgKGN1cnJlbnRVc2VyICYmIGN1cnJlbnRVc2VyLl9zZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgZGF0YU9iamVjdC5fU2Vzc2lvblRva2VuID0gY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbjtcbiAgICAgIH1cblxuICAgICAgaWYgKFBhcnNlLlVzZXIuX2lzUmV2b2NhYmxlU2Vzc2lvbkVuYWJsZWQpIHtcbiAgICAgICAgZGF0YU9iamVjdC5fUmV2b2NhYmxlU2Vzc2lvbiA9ICcxJztcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhT2JqZWN0KTtcblxuICAgICAgcmV0dXJuIFBhcnNlLl9hamF4KG1ldGhvZCwgdXJsLCBkYXRhKTtcbiAgICB9KS50aGVuKG51bGwsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAvLyBUcmFuc2Zvcm0gdGhlIGVycm9yIGludG8gYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IgYnkgdHJ5aW5nIHRvIHBhcnNlXG4gICAgICAvLyB0aGUgZXJyb3Igc3RyaW5nIGFzIEpTT04uXG4gICAgICB2YXIgZXJyb3I7XG4gICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGVycm9ySlNPTiA9IEpTT04ucGFyc2UocmVzcG9uc2UucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihlcnJvckpTT04uY29kZSwgZXJyb3JKU09OLmVycm9yKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIElmIHdlIGZhaWwgdG8gcGFyc2UgdGhlIGVycm9yIHRleHQsIHRoYXQncyBva2F5LlxuICAgICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgICAgIFwiUmVjZWl2ZWQgYW4gZXJyb3Igd2l0aCBpbnZhbGlkIEpTT04gZnJvbSBQYXJzZTogXCIgK1xuICAgICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5DT05ORUNUSU9OX0ZBSUxFRCxcbiAgICAgICAgICAgIFwiWE1MSHR0cFJlcXVlc3QgZmFpbGVkOiBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XG4gICAgICB9XG4gICAgICAvLyBCeSBleHBsaWNpdGx5IHJldHVybmluZyBhIHJlamVjdGVkIFByb21pc2UsIHRoaXMgd2lsbCB3b3JrIHdpdGhcbiAgICAgIC8vIGVpdGhlciBqUXVlcnkgb3IgUHJvbWlzZXMvQSBzZW1hbnRpY3MuXG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhIHZhbHVlIGZyb20gYSBCYWNrYm9uZSBvYmplY3QgYXMgYSBwcm9wZXJ0eVxuICAvLyBvciBhcyBhIGZ1bmN0aW9uLlxuICBQYXJzZS5fZ2V0VmFsdWUgPSBmdW5jdGlvbihvYmplY3QsIHByb3ApIHtcbiAgICBpZiAoIShvYmplY3QgJiYgb2JqZWN0W3Byb3BdKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBQYXJzZS5fLmlzRnVuY3Rpb24ob2JqZWN0W3Byb3BdKSA/IG9iamVjdFtwcm9wXSgpIDogb2JqZWN0W3Byb3BdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIHZhbHVlIGluIGEgUGFyc2UgT2JqZWN0IGludG8gdGhlIGFwcHJvcHJpYXRlIHJlcHJlc2VudGF0aW9uLlxuICAgKiBUaGlzIGlzIHRoZSBKUyBlcXVpdmFsZW50IG9mIEphdmEncyBQYXJzZS5tYXliZVJlZmVyZW5jZUFuZEVuY29kZShPYmplY3QpXG4gICAqIGlmIHNlZW5PYmplY3RzIGlzIGZhbHNleS4gT3RoZXJ3aXNlIGFueSBQYXJzZS5PYmplY3RzIG5vdCBpblxuICAgKiBzZWVuT2JqZWN0cyB3aWxsIGJlIGZ1bGx5IGVtYmVkZGVkIHJhdGhlciB0aGFuIGVuY29kZWRcbiAgICogYXMgYSBwb2ludGVyLiAgVGhpcyBhcnJheSB3aWxsIGJlIHVzZWQgdG8gcHJldmVudCBnb2luZyBpbnRvIGFuIGluZmluaXRlXG4gICAqIGxvb3AgYmVjYXVzZSB3ZSBoYXZlIGNpcmN1bGFyIHJlZmVyZW5jZXMuICBJZiBzZWVuT2JqZWN0c1xuICAgKiBpcyBzZXQsIHRoZW4gbm9uZSBvZiB0aGUgUGFyc2UgT2JqZWN0cyB0aGF0IGFyZSBzZXJpYWxpemVkIGNhbiBiZSBkaXJ0eS5cbiAgICovXG4gIFBhcnNlLl9lbmNvZGUgPSBmdW5jdGlvbih2YWx1ZSwgc2Vlbk9iamVjdHMsIGRpc2FsbG93T2JqZWN0cykge1xuICAgIHZhciBfID0gUGFyc2UuXztcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgIGlmIChkaXNhbGxvd09iamVjdHMpIHtcbiAgICAgICAgdGhyb3cgXCJQYXJzZS5PYmplY3RzIG5vdCBhbGxvd2VkIGhlcmVcIjtcbiAgICAgIH1cbiAgICAgIGlmICghc2Vlbk9iamVjdHMgfHwgXy5pbmNsdWRlKHNlZW5PYmplY3RzLCB2YWx1ZSkgfHwgIXZhbHVlLl9oYXNEYXRhKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5fdG9Qb2ludGVyKCk7XG4gICAgICB9XG4gICAgICBpZiAoIXZhbHVlLmRpcnR5KCkpIHtcbiAgICAgICAgc2Vlbk9iamVjdHMgPSBzZWVuT2JqZWN0cy5jb25jYXQodmFsdWUpO1xuICAgICAgICByZXR1cm4gUGFyc2UuX2VuY29kZSh2YWx1ZS5fdG9GdWxsSlNPTihzZWVuT2JqZWN0cyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZW5PYmplY3RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhbGxvd09iamVjdHMpO1xuICAgICAgfVxuICAgICAgdGhyb3cgXCJUcmllZCB0byBzYXZlIGFuIG9iamVjdCB3aXRoIGEgcG9pbnRlciB0byBhIG5ldywgdW5zYXZlZCBvYmplY3QuXCI7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkFDTCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSlNPTigpO1xuICAgIH1cbiAgICBpZiAoXy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4geyBcIl9fdHlwZVwiOiBcIkRhdGVcIiwgXCJpc29cIjogdmFsdWUudG9KU09OKCkgfTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuR2VvUG9pbnQpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b0pTT04oKTtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcCh2YWx1ZSwgZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4gUGFyc2UuX2VuY29kZSh4LCBzZWVuT2JqZWN0cywgZGlzYWxsb3dPYmplY3RzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5pc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5zb3VyY2U7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLlJlbGF0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9KU09OKCk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9wKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9KU09OKCk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkZpbGUpIHtcbiAgICAgIGlmICghdmFsdWUudXJsKCkpIHtcbiAgICAgICAgdGhyb3cgXCJUcmllZCB0byBzYXZlIGFuIG9iamVjdCBjb250YWluaW5nIGFuIHVuc2F2ZWQgZmlsZS5cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9fdHlwZTogXCJGaWxlXCIsXG4gICAgICAgIG5hbWU6IHZhbHVlLm5hbWUoKSxcbiAgICAgICAgdXJsOiB2YWx1ZS51cmwoKVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICB2YXIgb3V0cHV0ID0ge307XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh2YWx1ZSwgZnVuY3Rpb24odiwgaykge1xuICAgICAgICBvdXRwdXRba10gPSBQYXJzZS5fZW5jb2RlKHYsIHNlZW5PYmplY3RzLCBkaXNhbGxvd09iamVjdHMpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoZSBpbnZlcnNlIGZ1bmN0aW9uIG9mIFBhcnNlLl9lbmNvZGUuXG4gICAqIFRPRE86IG1ha2UgZGVjb2RlIG5vdCBtdXRhdGUgdmFsdWUuXG4gICAqL1xuICBQYXJzZS5fZGVjb2RlID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHZhciBfID0gUGFyc2UuXztcbiAgICBpZiAoIV8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHZhbHVlLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHZhbHVlW2tdID0gUGFyc2UuX2RlY29kZShrLCB2KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PcCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAodmFsdWUuX19vcCkge1xuICAgICAgcmV0dXJuIFBhcnNlLk9wLl9kZWNvZGUodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodmFsdWUuX190eXBlID09PSBcIlBvaW50ZXJcIiAmJiB2YWx1ZS5jbGFzc05hbWUpIHtcbiAgICAgIHZhciBwb2ludGVyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUodmFsdWUuY2xhc3NOYW1lKTtcbiAgICAgIHBvaW50ZXIuX2ZpbmlzaEZldGNoKHsgb2JqZWN0SWQ6IHZhbHVlLm9iamVjdElkIH0sIGZhbHNlKTtcbiAgICAgIHJldHVybiBwb2ludGVyO1xuICAgIH1cbiAgICBpZiAodmFsdWUuX190eXBlID09PSBcIk9iamVjdFwiICYmIHZhbHVlLmNsYXNzTmFtZSkge1xuICAgICAgLy8gSXQncyBhbiBPYmplY3QgaW5jbHVkZWQgaW4gYSBxdWVyeSByZXN1bHQuXG4gICAgICB2YXIgY2xhc3NOYW1lID0gdmFsdWUuY2xhc3NOYW1lO1xuICAgICAgZGVsZXRlIHZhbHVlLl9fdHlwZTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS5jbGFzc05hbWU7XG4gICAgICB2YXIgb2JqZWN0ID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoY2xhc3NOYW1lKTtcbiAgICAgIG9iamVjdC5fZmluaXNoRmV0Y2godmFsdWUsIHRydWUpO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJEYXRlXCIpIHtcbiAgICAgIHJldHVybiBQYXJzZS5fcGFyc2VEYXRlKHZhbHVlLmlzbyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09IFwiR2VvUG9pbnRcIikge1xuICAgICAgcmV0dXJuIG5ldyBQYXJzZS5HZW9Qb2ludCh7XG4gICAgICAgIGxhdGl0dWRlOiB2YWx1ZS5sYXRpdHVkZSxcbiAgICAgICAgbG9uZ2l0dWRlOiB2YWx1ZS5sb25naXR1ZGVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoa2V5ID09PSBcIkFDTFwiKSB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5BQ0wpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQYXJzZS5BQ0wodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodmFsdWUuX190eXBlID09PSBcIlJlbGF0aW9uXCIpIHtcbiAgICAgIHZhciByZWxhdGlvbiA9IG5ldyBQYXJzZS5SZWxhdGlvbihudWxsLCBrZXkpO1xuICAgICAgcmVsYXRpb24udGFyZ2V0Q2xhc3NOYW1lID0gdmFsdWUuY2xhc3NOYW1lO1xuICAgICAgcmV0dXJuIHJlbGF0aW9uO1xuICAgIH1cbiAgICBpZiAodmFsdWUuX190eXBlID09PSBcIkZpbGVcIikge1xuICAgICAgdmFyIGZpbGUgPSBuZXcgUGFyc2UuRmlsZSh2YWx1ZS5uYW1lKTtcbiAgICAgIGZpbGUuX3VybCA9IHZhbHVlLnVybDtcbiAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cbiAgICBQYXJzZS5fb2JqZWN0RWFjaCh2YWx1ZSwgZnVuY3Rpb24odiwgaykge1xuICAgICAgdmFsdWVba10gPSBQYXJzZS5fZGVjb2RlKGssIHYpO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBQYXJzZS5fYXJyYXlFYWNoID0gUGFyc2UuXy5lYWNoO1xuXG4gIC8qKlxuICAgKiBEb2VzIGEgZGVlcCB0cmF2ZXJzYWwgb2YgZXZlcnkgaXRlbSBpbiBvYmplY3QsIGNhbGxpbmcgZnVuYyBvbiBldmVyeSBvbmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCBvciBhcnJheSB0byB0cmF2ZXJzZSBkZWVwbHkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGV2ZXJ5IGl0ZW0uIEl0IHdpbGxcbiAgICogICAgIGJlIHBhc3NlZCB0aGUgaXRlbSBhcyBhbiBhcmd1bWVudC4gSWYgaXQgcmV0dXJucyBhIHRydXRoeSB2YWx1ZSwgdGhhdFxuICAgKiAgICAgdmFsdWUgd2lsbCByZXBsYWNlIHRoZSBpdGVtIGluIGl0cyBwYXJlbnQgY29udGFpbmVyLlxuICAgKiBAcmV0dXJucyB7fSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgZnVuYyBvbiB0aGUgdG9wLWxldmVsIG9iamVjdCBpdHNlbGYuXG4gICAqL1xuICBQYXJzZS5fdHJhdmVyc2UgPSBmdW5jdGlvbihvYmplY3QsIGZ1bmMsIHNlZW4pIHtcbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICBzZWVuID0gc2VlbiB8fCBbXTtcbiAgICAgIGlmIChQYXJzZS5fLmluZGV4T2Yoc2Vlbiwgb2JqZWN0KSA+PSAwKSB7XG4gICAgICAgIC8vIFdlJ3ZlIGFscmVhZHkgdmlzaXRlZCB0aGlzIG9iamVjdCBpbiB0aGlzIGNhbGwuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlZW4ucHVzaChvYmplY3QpO1xuICAgICAgUGFyc2UuX3RyYXZlcnNlKG9iamVjdC5hdHRyaWJ1dGVzLCBmdW5jLCBzZWVuKTtcbiAgICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gICAgfVxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbiB8fCBvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5GaWxlKSB7XG4gICAgICAvLyBOb3RoaW5nIG5lZWRzIHRvIGJlIGRvbmUsIGJ1dCB3ZSBkb24ndCB3YW50IHRvIHJlY3Vyc2UgaW50byB0aGVcbiAgICAgIC8vIG9iamVjdCdzIHBhcmVudCBpbmZpbml0ZWx5LCBzbyB3ZSBjYXRjaCB0aGlzIGNhc2UuXG4gICAgICByZXR1cm4gZnVuYyhvYmplY3QpO1xuICAgIH1cbiAgICBpZiAoUGFyc2UuXy5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIFBhcnNlLl8uZWFjaChvYmplY3QsIGZ1bmN0aW9uKGNoaWxkLCBpbmRleCkge1xuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBQYXJzZS5fdHJhdmVyc2UoY2hpbGQsIGZ1bmMsIHNlZW4pO1xuICAgICAgICBpZiAobmV3Q2hpbGQpIHtcbiAgICAgICAgICBvYmplY3RbaW5kZXhdID0gbmV3Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZ1bmMob2JqZWN0KTtcbiAgICB9XG4gICAgaWYgKFBhcnNlLl8uaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgUGFyc2UuX2VhY2gob2JqZWN0LCBmdW5jdGlvbihjaGlsZCwga2V5KSB7XG4gICAgICAgIHZhciBuZXdDaGlsZCA9IFBhcnNlLl90cmF2ZXJzZShjaGlsZCwgZnVuYywgc2Vlbik7XG4gICAgICAgIGlmIChuZXdDaGlsZCkge1xuICAgICAgICAgIG9iamVjdFtrZXldID0gbmV3Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZ1bmMob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMob2JqZWN0KTtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBpcyBsaWtlIF8uZWFjaCwgZXhjZXB0OlxuICAgKiAqIGl0IGRvZXNuJ3Qgd29yayBmb3Igc28tY2FsbGVkIGFycmF5LWxpa2Ugb2JqZWN0cyxcbiAgICogKiBpdCBkb2VzIHdvcmsgZm9yIGRpY3Rpb25hcmllcyB3aXRoIGEgXCJsZW5ndGhcIiBhdHRyaWJ1dGUuXG4gICAqL1xuICBQYXJzZS5fb2JqZWN0RWFjaCA9IFBhcnNlLl9lYWNoID0gZnVuY3Rpb24ob2JqLCBjYWxsYmFjaykge1xuICAgIHZhciBfID0gUGFyc2UuXztcbiAgICBpZiAoXy5pc09iamVjdChvYmopKSB7XG4gICAgICBfLmVhY2goXy5rZXlzKG9iaiksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBjYWxsYmFjayhvYmpba2V5XSwga2V5KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gob2JqLCBjYWxsYmFjayk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjaGVjayBudWxsIG9yIHVuZGVmaW5lZC5cbiAgUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiBQYXJzZS5fLmlzTnVsbCh4KSB8fCBQYXJzZS5fLmlzVW5kZWZpbmVkKHgpO1xuICB9O1xufSh0aGlzKSk7XG5cbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbG9jYWxTdG9yYWdlOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIFxuICB2YXIgU3RvcmFnZSA9IHtcbiAgICBhc3luYzogZmFsc2UsXG4gIH07XG5cbiAgdmFyIGhhc0xvY2FsU3RvcmFnZSA9ICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyk7XG4gIGlmIChoYXNMb2NhbFN0b3JhZ2UpIHtcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3N1cHBvcnRlZCcsIHRydWUpO1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3N1cHBvcnRlZCcpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgaGFzTG9jYWxTdG9yYWdlID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChoYXNMb2NhbFN0b3JhZ2UpIHtcbiAgICBTdG9yYWdlLmdldEl0ZW0gPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0ocGF0aCk7XG4gICAgfTtcblxuICAgIFN0b3JhZ2Uuc2V0SXRlbSA9IGZ1bmN0aW9uKHBhdGgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0ocGF0aCwgdmFsdWUpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0ocGF0aCk7XG4gICAgfTtcblxuICAgIFN0b3JhZ2UuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIEFzeW5jU3RvcmFnZTtcbiAgICB0cnkge1xuICAgICAgQXN5bmNTdG9yYWdlID0gZXZhbChcInJlcXVpcmUoJ0FzeW5jU3RvcmFnZScpXCIpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAgICAgU3RvcmFnZS5hc3luYyA9IHRydWU7XG5cbiAgICAgIFN0b3JhZ2UuZ2V0SXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB2YXIgcCA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICAgIEFzeW5jU3RvcmFnZS5nZXRJdGVtKHBhdGgsIGZ1bmN0aW9uKGVyciwgdmFsdWUpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBwLnJlamVjdChlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwLnJlc29sdmUodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfTtcblxuICAgICAgU3RvcmFnZS5zZXRJdGVtQXN5bmMgPSBmdW5jdGlvbihwYXRoLCB2YWx1ZSkge1xuICAgICAgICB2YXIgcCA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICAgIEFzeW5jU3RvcmFnZS5zZXRJdGVtKHBhdGgsIHZhbHVlLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBwLnJlamVjdChlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwLnJlc29sdmUodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfTtcblxuICAgICAgU3RvcmFnZS5yZW1vdmVJdGVtQXN5bmMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgIHZhciBwID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgICAgQXN5bmNTdG9yYWdlLnJlbW92ZUl0ZW0ocGF0aCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9O1xuXG4gICAgICBTdG9yYWdlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIEFzeW5jU3RvcmFnZS5jbGVhcigpO1xuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7IH1cbiAgfVxuICBpZiAoIVN0b3JhZ2UuYXN5bmMgJiYgIVN0b3JhZ2UuZ2V0SXRlbSkge1xuICAgIHZhciBtZW1NYXAgPSBTdG9yYWdlLmluTWVtb3J5TWFwID0ge307XG4gICAgU3RvcmFnZS5nZXRJdGVtID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgaWYgKG1lbU1hcC5oYXNPd25Qcm9wZXJ0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gbWVtTWFwW3BhdGhdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIFN0b3JhZ2Uuc2V0SXRlbSA9IGZ1bmN0aW9uKHBhdGgsIHZhbHVlKSB7XG4gICAgICBtZW1NYXBbcGF0aF0gPSBTdHJpbmcodmFsdWUpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBkZWxldGUgbWVtTWFwW3BhdGhdO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbWVtTWFwKSB7XG4gICAgICAgIGlmIChtZW1NYXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGRlbGV0ZSBtZW1NYXBba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBXZSBjYW4gdXNlIHN5bmNocm9ub3VzIG1ldGhvZHMgZnJvbSBhc3luYyBzY2VuYXJpb3MsIGJ1dCBub3QgdmljZS12ZXJzYVxuICBpZiAoIVN0b3JhZ2UuYXN5bmMpIHtcbiAgICBTdG9yYWdlLmdldEl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFxuICAgICAgICBTdG9yYWdlLmdldEl0ZW0ocGF0aClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIFN0b3JhZ2Uuc2V0SXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCwgdmFsdWUpIHtcbiAgICAgIFN0b3JhZ2Uuc2V0SXRlbShwYXRoLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyh2YWx1ZSk7XG4gICAgfTtcblxuICAgIFN0b3JhZ2UucmVtb3ZlSXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoXG4gICAgICAgIFN0b3JhZ2UucmVtb3ZlSXRlbShwYXRoKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG5cbiAgUGFyc2UuU3RvcmFnZSA9IFN0b3JhZ2U7XG5cbn0pKHRoaXMpO1xuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBAbmFtZXNwYWNlIFByb3ZpZGVzIGFuIGludGVyZmFjZSB0byBQYXJzZSdzIGxvZ2dpbmcgYW5kIGFuYWx5dGljcyBiYWNrZW5kLlxuICAgKi9cbiAgUGFyc2UuQW5hbHl0aWNzID0gUGFyc2UuQW5hbHl0aWNzIHx8IHt9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLkFuYWx5dGljcywgLyoqIEBsZW5kcyBQYXJzZS5BbmFseXRpY3MgKi8ge1xuICAgIC8qKlxuICAgICAqIFRyYWNrcyB0aGUgb2NjdXJyZW5jZSBvZiBhIGN1c3RvbSBldmVudCB3aXRoIGFkZGl0aW9uYWwgZGltZW5zaW9ucy5cbiAgICAgKiBQYXJzZSB3aWxsIHN0b3JlIGEgZGF0YSBwb2ludCBhdCB0aGUgdGltZSBvZiBpbnZvY2F0aW9uIHdpdGggdGhlIGdpdmVuXG4gICAgICogZXZlbnQgbmFtZS5cbiAgICAgKlxuICAgICAqIERpbWVuc2lvbnMgd2lsbCBhbGxvdyBzZWdtZW50YXRpb24gb2YgdGhlIG9jY3VycmVuY2VzIG9mIHRoaXMgY3VzdG9tXG4gICAgICogZXZlbnQuIEtleXMgYW5kIHZhbHVlcyBzaG91bGQgYmUge0Bjb2RlIFN0cmluZ31zLCBhbmQgd2lsbCB0aHJvd1xuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqIFRvIHRyYWNrIGEgdXNlciBzaWdudXAgYWxvbmcgd2l0aCBhZGRpdGlvbmFsIG1ldGFkYXRhLCBjb25zaWRlciB0aGVcbiAgICAgKiBmb2xsb3dpbmc6XG4gICAgICogPHByZT5cbiAgICAgKiB2YXIgZGltZW5zaW9ucyA9IHtcbiAgICAgKiAgZ2VuZGVyOiAnbScsXG4gICAgICogIHNvdXJjZTogJ3dlYicsXG4gICAgICogIGRheVR5cGU6ICd3ZWVrZW5kJ1xuICAgICAqIH07XG4gICAgICogUGFyc2UuQW5hbHl0aWNzLnRyYWNrKCdzaWdudXAnLCBkaW1lbnNpb25zKTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIFRoZXJlIGlzIGEgZGVmYXVsdCBsaW1pdCBvZiA4IGRpbWVuc2lvbnMgcGVyIGV2ZW50IHRyYWNrZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgY3VzdG9tIGV2ZW50IHRvIHJlcG9ydCB0byBQYXJzZSBhc1xuICAgICAqIGhhdmluZyBoYXBwZW5lZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGltZW5zaW9ucyBUaGUgZGljdGlvbmFyeSBvZiBpbmZvcm1hdGlvbiBieSB3aGljaCB0b1xuICAgICAqIHNlZ21lbnQgdGhpcyBldmVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSByb3VuZC10cmlwXG4gICAgICogdG8gdGhlIHNlcnZlciBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgdHJhY2s6IGZ1bmN0aW9uKG5hbWUsIGRpbWVuc2lvbnMsIG9wdGlvbnMpIHtcbiAgICAgIG5hbWUgPSBuYW1lIHx8ICcnO1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXlxccyovLCAnJyk7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICAgIGlmIChuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyAnQSBuYW1lIGZvciB0aGUgY3VzdG9tIGV2ZW50IG11c3QgYmUgcHJvdmlkZWQnO1xuICAgICAgfVxuXG4gICAgICBfLmVhY2goZGltZW5zaW9ucywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmlzU3RyaW5nKGtleSkgfHwgIV8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgIHRocm93ICd0cmFjaygpIGRpbWVuc2lvbnMgZXhwZWN0cyBrZXlzIGFuZCB2YWx1ZXMgb2YgdHlwZSBcInN0cmluZ1wiLic7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiAnZXZlbnRzJyxcbiAgICAgICAgY2xhc3NOYW1lOiBuYW1lLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogeyBkaW1lbnNpb25zOiBkaW1lbnNpb25zIH1cbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQGNsYXNzIFBhcnNlLkNvbmZpZyBpcyBhIGxvY2FsIHJlcHJlc2VudGF0aW9uIG9mIGNvbmZpZ3VyYXRpb24gZGF0YSB0aGF0XG4gICAqIGNhbiBiZSBzZXQgZnJvbSB0aGUgUGFyc2UgZGFzaGJvYXJkLlxuICAgKi9cbiAgUGFyc2UuQ29uZmlnID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307XG4gICAgdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXMgPSB7fTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBtb3N0IHJlY2VudGx5LWZldGNoZWQgY29uZmlndXJhdGlvbiBvYmplY3QsIGVpdGhlciBmcm9tXG4gICAqIG1lbW9yeSBvciBmcm9tIGxvY2FsIHN0b3JhZ2UgaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtQYXJzZS5Db25maWd9IFRoZSBtb3N0IHJlY2VudGx5LWZldGNoZWQgUGFyc2UuQ29uZmlnIGlmIGl0XG4gICAqICAgICBleGlzdHMsIGVsc2UgYW4gZW1wdHkgUGFyc2UuQ29uZmlnLlxuICAgKi9cbiAgUGFyc2UuQ29uZmlnLmN1cnJlbnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoUGFyc2UuQ29uZmlnLl9jdXJyZW50Q29uZmlnKSB7XG4gICAgICByZXR1cm4gUGFyc2UuQ29uZmlnLl9jdXJyZW50Q29uZmlnO1xuICAgIH1cblxuICAgIHZhciBjb25maWcgPSBuZXcgUGFyc2UuQ29uZmlnKCk7XG5cbiAgICBpZiAoUGFyc2UuU3RvcmFnZS5hc3luYykge1xuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG5cbiAgICB2YXIgY29uZmlnRGF0YSA9IFBhcnNlLlN0b3JhZ2UuZ2V0SXRlbShQYXJzZS5fZ2V0UGFyc2VQYXRoKFxuICAgICAgICAgIFBhcnNlLkNvbmZpZy5fQ1VSUkVOVF9DT05GSUdfS0VZKSk7XG5cbiAgICBpZiAoY29uZmlnRGF0YSkgeyAgXG4gICAgICBjb25maWcuX2ZpbmlzaEZldGNoKEpTT04ucGFyc2UoY29uZmlnRGF0YSkpO1xuICAgICAgUGFyc2UuQ29uZmlnLl9jdXJyZW50Q29uZmlnID0gY29uZmlnO1xuICAgIH1cbiAgICByZXR1cm4gY29uZmlnO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgKiAgIDxsaT5zdWNjZXNzOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGdldCBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICAgKiAgIDxsaT5lcnJvcjogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBnZXQgZmFpbHMuXG4gICAqIDwvdWw+XG4gICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggYSBuZXdseS1jcmVhdGVkXG4gICAqICAgICBjb25maWd1cmF0aW9uIG9iamVjdCB3aGVuIHRoZSBnZXQgY29tcGxldGVzLlxuICAgKi9cbiAgUGFyc2UuQ29uZmlnLmdldCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgcm91dGU6IFwiY29uZmlnXCIsXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZiAoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5wYXJhbXMpIHtcbiAgICAgICAgdmFyIGVycm9yT2JqZWN0ID0gbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICBcIkNvbmZpZyBKU09OIHJlc3BvbnNlIGludmFsaWQuXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvck9iamVjdCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb25maWcgPSBuZXcgUGFyc2UuQ29uZmlnKCk7XG4gICAgICBjb25maWcuX2ZpbmlzaEZldGNoKHJlc3BvbnNlKTtcbiAgICAgIFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZyA9IGNvbmZpZztcbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgUGFyc2UuQ29uZmlnLnByb3RvdHlwZSA9IHtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIEhUTUwtZXNjYXBlZCB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgZXNjYXBlOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB2YXIgaHRtbCA9IHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzW2F0dHJdO1xuICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICB9XG4gICAgICB2YXIgdmFsID0gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgICAgdmFyIGVzY2FwZWQ7XG4gICAgICBpZiAoUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKHZhbCkpIHtcbiAgICAgICAgZXNjYXBlZCA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXNjYXBlZCA9IF8uZXNjYXBlKHZhbC50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzW2F0dHJdID0gZXNjYXBlZDtcbiAgICAgIHJldHVybiBlc2NhcGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgVGhlIG5hbWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgICB9LFxuXG4gICAgX2ZpbmlzaEZldGNoOiBmdW5jdGlvbihzZXJ2ZXJEYXRhKSB7XG4gICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBQYXJzZS5fZGVjb2RlKG51bGwsIF8uY2xvbmUoc2VydmVyRGF0YS5wYXJhbXMpKTtcbiAgICAgIGlmICghUGFyc2UuU3RvcmFnZS5hc3luYykge1xuICAgICAgICAvLyBXZSBvbmx5IHByb3ZpZGUgbG9jYWwgY2FjaGluZyBvZiBjb25maWcgd2l0aCBzeW5jaHJvbm91cyBTdG9yYWdlXG4gICAgICAgIFBhcnNlLlN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIFBhcnNlLl9nZXRQYXJzZVBhdGgoUGFyc2UuQ29uZmlnLl9DVVJSRU5UX0NPTkZJR19LRVkpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc2VydmVyRGF0YSkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBQYXJzZS5Db25maWcuX2N1cnJlbnRDb25maWcgPSBudWxsO1xuXG4gIFBhcnNlLkNvbmZpZy5fQ1VSUkVOVF9DT05GSUdfS0VZID0gXCJjdXJyZW50Q29uZmlnXCI7XG5cbn0odGhpcykpO1xuXG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgUGFyc2UuRXJyb3Igb2JqZWN0IHdpdGggdGhlIGdpdmVuIGNvZGUgYW5kIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlIEFuIGVycm9yIGNvZGUgY29uc3RhbnQgZnJvbSA8Y29kZT5QYXJzZS5FcnJvcjwvY29kZT4uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIEEgZGV0YWlsZWQgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yLlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+Q2xhc3MgdXNlZCBmb3IgYWxsIG9iamVjdHMgcGFzc2VkIHRvIGVycm9yIGNhbGxiYWNrcy48L3A+XG4gICAqL1xuICBQYXJzZS5FcnJvciA9IGZ1bmN0aW9uKGNvZGUsIG1lc3NhZ2UpIHtcbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH07XG5cbiAgXy5leHRlbmQoUGFyc2UuRXJyb3IsIC8qKiBAbGVuZHMgUGFyc2UuRXJyb3IgKi8ge1xuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBzb21lIGVycm9yIG90aGVyIHRoYW4gdGhvc2UgZW51bWVyYXRlZCBoZXJlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE9USEVSX0NBVVNFOiAtMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHNvbWV0aGluZyBoYXMgZ29uZSB3cm9uZyB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAgICogSWYgeW91IGdldCB0aGlzIGVycm9yIGNvZGUsIGl0IGlzIFBhcnNlJ3MgZmF1bHQuIENvbnRhY3QgdXMgYXQgXG4gICAgICogaHR0cHM6Ly9wYXJzZS5jb20vaGVscFxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVEVSTkFMX1NFUlZFUl9FUlJPUjogMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGUgY29ubmVjdGlvbiB0byB0aGUgUGFyc2Ugc2VydmVycyBmYWlsZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgQ09OTkVDVElPTl9GQUlMRUQ6IDEwMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGUgc3BlY2lmaWVkIG9iamVjdCBkb2Vzbid0IGV4aXN0LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE9CSkVDVF9OT1RfRk9VTkQ6IDEwMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB5b3UgdHJpZWQgdG8gcXVlcnkgd2l0aCBhIGRhdGF0eXBlIHRoYXQgZG9lc24ndFxuICAgICAqIHN1cHBvcnQgaXQsIGxpa2UgZXhhY3QgbWF0Y2hpbmcgYW4gYXJyYXkgb3Igb2JqZWN0LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfUVVFUlk6IDEwMixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIG1pc3Npbmcgb3IgaW52YWxpZCBjbGFzc25hbWUuIENsYXNzbmFtZXMgYXJlXG4gICAgICogY2FzZS1zZW5zaXRpdmUuIFRoZXkgbXVzdCBzdGFydCB3aXRoIGEgbGV0dGVyLCBhbmQgYS16QS1aMC05XyBhcmUgdGhlXG4gICAgICogb25seSB2YWxpZCBjaGFyYWN0ZXJzLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfQ0xBU1NfTkFNRTogMTAzLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIHVuc3BlY2lmaWVkIG9iamVjdCBpZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBNSVNTSU5HX09CSkVDVF9JRDogMTA0LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQga2V5IG5hbWUuIEtleXMgYXJlIGNhc2Utc2Vuc2l0aXZlLiBUaGV5XG4gICAgICogbXVzdCBzdGFydCB3aXRoIGEgbGV0dGVyLCBhbmQgYS16QS1aMC05XyBhcmUgdGhlIG9ubHkgdmFsaWQgY2hhcmFjdGVycy5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0tFWV9OQU1FOiAxMDUsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSBtYWxmb3JtZWQgcG9pbnRlci4gWW91IHNob3VsZCBub3Qgc2VlIHRoaXMgdW5sZXNzXG4gICAgICogeW91IGhhdmUgYmVlbiBtdWNraW5nIGFib3V0IGNoYW5naW5nIGludGVybmFsIFBhcnNlIGNvZGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9QT0lOVEVSOiAxMDYsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBiYWRseSBmb3JtZWQgSlNPTiB3YXMgcmVjZWl2ZWQgdXBzdHJlYW0uIFRoaXNcbiAgICAgKiBlaXRoZXIgaW5kaWNhdGVzIHlvdSBoYXZlIGRvbmUgc29tZXRoaW5nIHVudXN1YWwgd2l0aCBtb2RpZnlpbmcgaG93XG4gICAgICogdGhpbmdzIGVuY29kZSB0byBKU09OLCBvciB0aGUgbmV0d29yayBpcyBmYWlsaW5nIGJhZGx5LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfSlNPTjogMTA3LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGZlYXR1cmUgeW91IHRyaWVkIHRvIGFjY2VzcyBpcyBvbmx5XG4gICAgICogYXZhaWxhYmxlIGludGVybmFsbHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgQ09NTUFORF9VTkFWQUlMQUJMRTogMTA4LFxuXG4gICAgLyoqXG4gICAgICogWW91IG11c3QgY2FsbCBQYXJzZS5pbml0aWFsaXplIGJlZm9yZSB1c2luZyB0aGUgUGFyc2UgbGlicmFyeS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBOT1RfSU5JVElBTElaRUQ6IDEwOSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgZmllbGQgd2FzIHNldCB0byBhbiBpbmNvbnNpc3RlbnQgdHlwZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTkNPUlJFQ1RfVFlQRTogMTExLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQgY2hhbm5lbCBuYW1lLiBBIGNoYW5uZWwgbmFtZSBpcyBlaXRoZXJcbiAgICAgKiBhbiBlbXB0eSBzdHJpbmcgKHRoZSBicm9hZGNhc3QgY2hhbm5lbCkgb3IgY29udGFpbnMgb25seSBhLXpBLVowLTlfXG4gICAgICogY2hhcmFjdGVycyBhbmQgc3RhcnRzIHdpdGggYSBsZXR0ZXIuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9DSEFOTkVMX05BTUU6IDExMixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHB1c2ggaXMgbWlzY29uZmlndXJlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBQVVNIX01JU0NPTkZJR1VSRUQ6IDExNSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBvYmplY3QgaXMgdG9vIGxhcmdlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE9CSkVDVF9UT09fTEFSR0U6IDExNixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBvcGVyYXRpb24gaXNuJ3QgYWxsb3dlZCBmb3IgY2xpZW50cy5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBPUEVSQVRJT05fRk9SQklEREVOOiAxMTksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhlIHJlc3VsdCB3YXMgbm90IGZvdW5kIGluIHRoZSBjYWNoZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBDQUNIRV9NSVNTOiAxMjAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhbiBpbnZhbGlkIGtleSB3YXMgdXNlZCBpbiBhIG5lc3RlZFxuICAgICAqIEpTT05PYmplY3QuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9ORVNURURfS0VZOiAxMjEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhbiBpbnZhbGlkIGZpbGVuYW1lIHdhcyB1c2VkIGZvciBQYXJzZUZpbGUuXG4gICAgICogQSB2YWxpZCBmaWxlIG5hbWUgY29udGFpbnMgb25seSBhLXpBLVowLTlfLiBjaGFyYWN0ZXJzIGFuZCBpcyBiZXR3ZWVuIDFcbiAgICAgKiBhbmQgMTI4IGNoYXJhY3RlcnMuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9GSUxFX05BTUU6IDEyMixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIEFDTCB3YXMgcHJvdmlkZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9BQ0w6IDEyMyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSByZXF1ZXN0IHRpbWVkIG91dCBvbiB0aGUgc2VydmVyLiBUeXBpY2FsbHlcbiAgICAgKiB0aGlzIGluZGljYXRlcyB0aGF0IHRoZSByZXF1ZXN0IGlzIHRvbyBleHBlbnNpdmUgdG8gcnVuLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFRJTUVPVVQ6IDEyNCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBlbWFpbCBhZGRyZXNzIHdhcyBpbnZhbGlkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfRU1BSUxfQUREUkVTUzogMTI1LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgbWlzc2luZyBjb250ZW50IHR5cGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTUlTU0lOR19DT05URU5UX1RZUEU6IDEyNixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIG1pc3NpbmcgY29udGVudCBsZW5ndGguXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTUlTU0lOR19DT05URU5UX0xFTkdUSDogMTI3LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQgY29udGVudCBsZW5ndGguXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9DT05URU5UX0xFTkdUSDogMTI4LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgZmlsZSB0aGF0IHdhcyB0b28gbGFyZ2UuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRklMRV9UT09fTEFSR0U6IDEyOSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBlcnJvciBzYXZpbmcgYSBmaWxlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEZJTEVfU0FWRV9FUlJPUjogMTMwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSB1bmlxdWUgZmllbGQgd2FzIGdpdmVuIGEgdmFsdWUgdGhhdCBpc1xuICAgICAqIGFscmVhZHkgdGFrZW4uXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRFVQTElDQVRFX1ZBTFVFOiAxMzcsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHJvbGUncyBuYW1lIGlzIGludmFsaWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9ST0xFX05BTUU6IDEzOSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGFuIGFwcGxpY2F0aW9uIHF1b3RhIHdhcyBleGNlZWRlZC4gIFVwZ3JhZGUgdG9cbiAgICAgKiByZXNvbHZlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEVYQ0VFREVEX1FVT1RBOiAxNDAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIENsb3VkIENvZGUgc2NyaXB0IGZhaWxlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBTQ1JJUFRfRkFJTEVEOiAxNDEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIENsb3VkIENvZGUgdmFsaWRhdGlvbiBmYWlsZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgVkFMSURBVElPTl9FUlJPUjogMTQyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgaW52YWxpZCBpbWFnZSBkYXRhIHdhcyBwcm92aWRlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0lNQUdFX0RBVEE6IDE1MCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiB1bnNhdmVkIGZpbGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgVU5TQVZFRF9GSUxFX0VSUk9SOiAxNTEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gaW52YWxpZCBwdXNoIHRpbWUuXG4gICAgICovXG4gICAgSU5WQUxJRF9QVVNIX1RJTUVfRVJST1I6IDE1MixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBlcnJvciBkZWxldGluZyBhIGZpbGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRklMRV9ERUxFVEVfRVJST1I6IDE1MyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBhcHBsaWNhdGlvbiBoYXMgZXhjZWVkZWQgaXRzIHJlcXVlc3RcbiAgICAgKiBsaW1pdC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBSRVFVRVNUX0xJTUlUX0VYQ0VFREVEOiAxNTUsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gaW52YWxpZCBldmVudCBuYW1lLlxuICAgICAqL1xuICAgIElOVkFMSURfRVZFTlRfTkFNRTogMTYwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIHVzZXJuYW1lIGlzIG1pc3Npbmcgb3IgZW1wdHkuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgVVNFUk5BTUVfTUlTU0lORzogMjAwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIHBhc3N3b3JkIGlzIG1pc3Npbmcgb3IgZW1wdHkuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgUEFTU1dPUkRfTUlTU0lORzogMjAxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIHVzZXJuYW1lIGhhcyBhbHJlYWR5IGJlZW4gdGFrZW4uXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgVVNFUk5BTUVfVEFLRU46IDIwMixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBlbWFpbCBoYXMgYWxyZWFkeSBiZWVuIHRha2VuLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEVNQUlMX1RBS0VOOiAyMDMsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgZW1haWwgaXMgbWlzc2luZywgYnV0IG11c3QgYmUgc3BlY2lmaWVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEVNQUlMX01JU1NJTkc6IDIwNCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdXNlciB3aXRoIHRoZSBzcGVjaWZpZWQgZW1haWwgd2FzIG5vdCBmb3VuZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBFTUFJTF9OT1RfRk9VTkQ6IDIwNSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdXNlciBvYmplY3Qgd2l0aG91dCBhIHZhbGlkIHNlc3Npb24gY291bGRcbiAgICAgKiBub3QgYmUgYWx0ZXJlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBTRVNTSU9OX01JU1NJTkc6IDIwNixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdXNlciBjYW4gb25seSBiZSBjcmVhdGVkIHRocm91Z2ggc2lnbnVwLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE1VU1RfQ1JFQVRFX1VTRVJfVEhST1VHSF9TSUdOVVA6IDIwNyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGFuIGFuIGFjY291bnQgYmVpbmcgbGlua2VkIGlzIGFscmVhZHkgbGlua2VkXG4gICAgICogdG8gYW5vdGhlciB1c2VyLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEFDQ09VTlRfQUxSRUFEWV9MSU5LRUQ6IDIwOCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBjdXJyZW50IHNlc3Npb24gdG9rZW4gaXMgaW52YWxpZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX1NFU1NJT05fVE9LRU46IDIwOSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdXNlciBjYW5ub3QgYmUgbGlua2VkIHRvIGFuIGFjY291bnQgYmVjYXVzZVxuICAgICAqIHRoYXQgYWNjb3VudCdzIGlkIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBMSU5LRURfSURfTUlTU0lORzogMjUwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSB1c2VyIHdpdGggYSBsaW5rZWQgKGUuZy4gRmFjZWJvb2spIGFjY291bnRcbiAgICAgKiBoYXMgYW4gaW52YWxpZCBzZXNzaW9uLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfTElOS0VEX1NFU1NJT046IDI1MSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgc2VydmljZSBiZWluZyBsaW5rZWQgKGUuZy4gRmFjZWJvb2sgb3JcbiAgICAgKiBUd2l0dGVyKSBpcyB1bnN1cHBvcnRlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBVTlNVUFBPUlRFRF9TRVJWSUNFOiAyNTIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGVyZSB3ZXJlIG11bHRpcGxlIGVycm9ycy4gQWdncmVnYXRlIGVycm9yc1xuICAgICAqIGhhdmUgYW4gXCJlcnJvcnNcIiBwcm9wZXJ0eSwgd2hpY2ggaXMgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cyB3aXRoIG1vcmVcbiAgICAgKiBkZXRhaWwgYWJvdXQgZWFjaCBlcnJvciB0aGF0IG9jY3VycmVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEFHR1JFR0FURV9FUlJPUjogNjAwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoZSBjbGllbnQgd2FzIHVuYWJsZSB0byByZWFkIGFuIGlucHV0IGZpbGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRklMRV9SRUFEX0VSUk9SOiA2MDEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSByZWFsIGVycm9yIGNvZGUgaXMgdW5hdmFpbGFibGUgYmVjYXVzZVxuICAgICAqIHdlIGhhZCB0byB1c2UgYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0IHRvIGFsbG93IENPUlMgcmVxdWVzdHMgaW5cbiAgICAgKiBJbnRlcm5ldCBFeHBsb3Jlciwgd2hpY2ggc3RyaXBzIHRoZSBib2R5IGZyb20gSFRUUCByZXNwb25zZXMgdGhhdCBoYXZlXG4gICAgICogYSBub24tMlhYIHN0YXR1cyBjb2RlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFhfRE9NQUlOX1JFUVVFU1Q6IDYwMlxuICB9KTtcblxufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIF86IGZhbHNlICovXG4oZnVuY3Rpb24oKSB7XG4gIHZhciByb290ID0gdGhpcztcbiAgdmFyIFBhcnNlID0gKHJvb3QuUGFyc2UgfHwgKHJvb3QuUGFyc2UgPSB7fSkpO1xuICB2YXIgZXZlbnRTcGxpdHRlciA9IC9cXHMrLztcbiAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+UGFyc2UuRXZlbnRzIGlzIGEgZm9yayBvZiBCYWNrYm9uZSdzIEV2ZW50cyBtb2R1bGUsIHByb3ZpZGVkIGZvciB5b3VyXG4gICAqIGNvbnZlbmllbmNlLjwvcD5cbiAgICpcbiAgICogPHA+QSBtb2R1bGUgdGhhdCBjYW4gYmUgbWl4ZWQgaW4gdG8gYW55IG9iamVjdCBpbiBvcmRlciB0byBwcm92aWRlXG4gICAqIGl0IHdpdGggY3VzdG9tIGV2ZW50cy4gWW91IG1heSBiaW5kIGNhbGxiYWNrIGZ1bmN0aW9ucyB0byBhbiBldmVudFxuICAgKiB3aXRoIGBvbmAsIG9yIHJlbW92ZSB0aGVzZSBmdW5jdGlvbnMgd2l0aCBgb2ZmYC5cbiAgICogVHJpZ2dlcmluZyBhbiBldmVudCBmaXJlcyBhbGwgY2FsbGJhY2tzIGluIHRoZSBvcmRlciB0aGF0IGBvbmAgd2FzXG4gICAqIGNhbGxlZC5cbiAgICpcbiAgICogPHByZT5cbiAgICogICAgIHZhciBvYmplY3QgPSB7fTtcbiAgICogICAgIF8uZXh0ZW5kKG9iamVjdCwgUGFyc2UuRXZlbnRzKTtcbiAgICogICAgIG9iamVjdC5vbignZXhwYW5kJywgZnVuY3Rpb24oKXsgYWxlcnQoJ2V4cGFuZGVkJyk7IH0pO1xuICAgKiAgICAgb2JqZWN0LnRyaWdnZXIoJ2V4cGFuZCcpOzwvcHJlPjwvcD5cbiAgICpcbiAgICogPHA+Rm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGVcbiAgICogPGEgaHJlZj1cImh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vYmFja2JvbmUvI0V2ZW50c1wiPkJhY2tib25lXG4gICAqIGRvY3VtZW50YXRpb248L2E+LjwvcD5cbiAgICovXG4gIFBhcnNlLkV2ZW50cyA9IHtcbiAgICAvKipcbiAgICAgKiBCaW5kIG9uZSBvciBtb3JlIHNwYWNlIHNlcGFyYXRlZCBldmVudHMsIGBldmVudHNgLCB0byBhIGBjYWxsYmFja2BcbiAgICAgKiBmdW5jdGlvbi4gUGFzc2luZyBgXCJhbGxcImAgd2lsbCBiaW5kIHRoZSBjYWxsYmFjayB0byBhbGwgZXZlbnRzIGZpcmVkLlxuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihldmVudHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG5cbiAgICAgIHZhciBjYWxscywgZXZlbnQsIG5vZGUsIHRhaWwsIGxpc3Q7XG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuICAgICAgY2FsbHMgPSB0aGlzLl9jYWxsYmFja3MgfHwgKHRoaXMuX2NhbGxiYWNrcyA9IHt9KTtcblxuICAgICAgLy8gQ3JlYXRlIGFuIGltbXV0YWJsZSBjYWxsYmFjayBsaXN0LCBhbGxvd2luZyB0cmF2ZXJzYWwgZHVyaW5nXG4gICAgICAvLyBtb2RpZmljYXRpb24uICBUaGUgdGFpbCBpcyBhbiBlbXB0eSBvYmplY3QgdGhhdCB3aWxsIGFsd2F5cyBiZSB1c2VkXG4gICAgICAvLyBhcyB0aGUgbmV4dCBub2RlLlxuICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgIHdoaWxlIChldmVudCkge1xuICAgICAgICBsaXN0ID0gY2FsbHNbZXZlbnRdO1xuICAgICAgICBub2RlID0gbGlzdCA/IGxpc3QudGFpbCA6IHt9O1xuICAgICAgICBub2RlLm5leHQgPSB0YWlsID0ge307XG4gICAgICAgIG5vZGUuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIG5vZGUuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbHNbZXZlbnRdID0ge3RhaWw6IHRhaWwsIG5leHQ6IGxpc3QgPyBsaXN0Lm5leHQgOiBub2RlfTtcbiAgICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBvbmUgb3IgbWFueSBjYWxsYmFja3MuIElmIGBjb250ZXh0YCBpcyBudWxsLCByZW1vdmVzIGFsbCBjYWxsYmFja3NcbiAgICAgKiB3aXRoIHRoYXQgZnVuY3Rpb24uIElmIGBjYWxsYmFja2AgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgY2FsbGJhY2tzIGZvciB0aGVcbiAgICAgKiBldmVudC4gSWYgYGV2ZW50c2AgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgYm91bmQgY2FsbGJhY2tzIGZvciBhbGwgZXZlbnRzLlxuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24oZXZlbnRzLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgdmFyIGV2ZW50LCBjYWxscywgbm9kZSwgdGFpbCwgY2IsIGN0eDtcblxuICAgICAgLy8gTm8gZXZlbnRzLCBvciByZW1vdmluZyAqYWxsKiBldmVudHMuXG4gICAgICBpZiAoIShjYWxscyA9IHRoaXMuX2NhbGxiYWNrcykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCEoZXZlbnRzIHx8IGNhbGxiYWNrIHx8IGNvbnRleHQpKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3M7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29wIHRocm91Z2ggdGhlIGxpc3RlZCBldmVudHMgYW5kIGNvbnRleHRzLCBzcGxpY2luZyB0aGVtIG91dCBvZiB0aGVcbiAgICAgIC8vIGxpbmtlZCBsaXN0IG9mIGNhbGxiYWNrcyBpZiBhcHByb3ByaWF0ZS5cbiAgICAgIGV2ZW50cyA9IGV2ZW50cyA/IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKSA6IE9iamVjdC5rZXlzKGNhbGxzKTtcbiAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB3aGlsZSAoZXZlbnQpIHtcbiAgICAgICAgbm9kZSA9IGNhbGxzW2V2ZW50XTtcbiAgICAgICAgZGVsZXRlIGNhbGxzW2V2ZW50XTtcbiAgICAgICAgaWYgKCFub2RlIHx8ICEoY2FsbGJhY2sgfHwgY29udGV4dCkpIHtcbiAgICAgICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBsaXN0LCBvbWl0dGluZyB0aGUgaW5kaWNhdGVkIGNhbGxiYWNrcy5cbiAgICAgICAgdGFpbCA9IG5vZGUudGFpbDtcbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgd2hpbGUgKG5vZGUgIT09IHRhaWwpIHtcbiAgICAgICAgICBjYiA9IG5vZGUuY2FsbGJhY2s7XG4gICAgICAgICAgY3R4ID0gbm9kZS5jb250ZXh0O1xuICAgICAgICAgIGlmICgoY2FsbGJhY2sgJiYgY2IgIT09IGNhbGxiYWNrKSB8fCAoY29udGV4dCAmJiBjdHggIT09IGNvbnRleHQpKSB7XG4gICAgICAgICAgICB0aGlzLm9uKGV2ZW50LCBjYiwgY3R4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBvbmUgb3IgbWFueSBldmVudHMsIGZpcmluZyBhbGwgYm91bmQgY2FsbGJhY2tzLiBDYWxsYmFja3MgYXJlXG4gICAgICogcGFzc2VkIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyBgdHJpZ2dlcmAgaXMsIGFwYXJ0IGZyb20gdGhlIGV2ZW50IG5hbWVcbiAgICAgKiAodW5sZXNzIHlvdSdyZSBsaXN0ZW5pbmcgb24gYFwiYWxsXCJgLCB3aGljaCB3aWxsIGNhdXNlIHlvdXIgY2FsbGJhY2sgdG9cbiAgICAgKiByZWNlaXZlIHRoZSB0cnVlIG5hbWUgb2YgdGhlIGV2ZW50IGFzIHRoZSBmaXJzdCBhcmd1bWVudCkuXG4gICAgICovXG4gICAgdHJpZ2dlcjogZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgICB2YXIgZXZlbnQsIG5vZGUsIGNhbGxzLCB0YWlsLCBhcmdzLCBhbGwsIHJlc3Q7XG4gICAgICBpZiAoIShjYWxscyA9IHRoaXMuX2NhbGxiYWNrcykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBhbGwgPSBjYWxscy5hbGw7XG4gICAgICBldmVudHMgPSBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcik7XG4gICAgICByZXN0ID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICAvLyBGb3IgZWFjaCBldmVudCwgd2FsayB0aHJvdWdoIHRoZSBsaW5rZWQgbGlzdCBvZiBjYWxsYmFja3MgdHdpY2UsXG4gICAgICAvLyBmaXJzdCB0byB0cmlnZ2VyIHRoZSBldmVudCwgdGhlbiB0byB0cmlnZ2VyIGFueSBgXCJhbGxcImAgY2FsbGJhY2tzLlxuICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgIHdoaWxlIChldmVudCkge1xuICAgICAgICBub2RlID0gY2FsbHNbZXZlbnRdO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIHRhaWwgPSBub2RlLnRhaWw7XG4gICAgICAgICAgd2hpbGUgKChub2RlID0gbm9kZS5uZXh0KSAhPT0gdGFpbCkge1xuICAgICAgICAgICAgbm9kZS5jYWxsYmFjay5hcHBseShub2RlLmNvbnRleHQgfHwgdGhpcywgcmVzdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBhbGw7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgdGFpbCA9IG5vZGUudGFpbDtcbiAgICAgICAgICBhcmdzID0gW2V2ZW50XS5jb25jYXQocmVzdCk7XG4gICAgICAgICAgd2hpbGUgKChub2RlID0gbm9kZS5uZXh0KSAhPT0gdGFpbCkge1xuICAgICAgICAgICAgbm9kZS5jYWxsYmFjay5hcHBseShub2RlLmNvbnRleHQgfHwgdGhpcywgYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTsgIFxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIFBhcnNlLkV2ZW50cy5iaW5kID0gUGFyc2UuRXZlbnRzLm9uO1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIFBhcnNlLkV2ZW50cy51bmJpbmQgPSBQYXJzZS5FdmVudHMub2ZmO1xufS5jYWxsKHRoaXMpKTtcblxuXG4vKmdsb2JhbCBuYXZpZ2F0b3I6IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEdlb1BvaW50IHdpdGggYW55IG9mIHRoZSBmb2xsb3dpbmcgZm9ybXM6PGJyPlxuICAgKiAgIDxwcmU+XG4gICAqICAgbmV3IEdlb1BvaW50KG90aGVyR2VvUG9pbnQpXG4gICAqICAgbmV3IEdlb1BvaW50KDMwLCAzMClcbiAgICogICBuZXcgR2VvUG9pbnQoWzMwLCAzMF0pXG4gICAqICAgbmV3IEdlb1BvaW50KHtsYXRpdHVkZTogMzAsIGxvbmdpdHVkZTogMzB9KVxuICAgKiAgIG5ldyBHZW9Qb2ludCgpICAvLyBkZWZhdWx0cyB0byAoMCwgMClcbiAgICogICA8L3ByZT5cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPlJlcHJlc2VudHMgYSBsYXRpdHVkZSAvIGxvbmdpdHVkZSBwb2ludCB0aGF0IG1heSBiZSBhc3NvY2lhdGVkXG4gICAqIHdpdGggYSBrZXkgaW4gYSBQYXJzZU9iamVjdCBvciB1c2VkIGFzIGEgcmVmZXJlbmNlIHBvaW50IGZvciBnZW8gcXVlcmllcy5cbiAgICogVGhpcyBhbGxvd3MgcHJveGltaXR5LWJhc2VkIHF1ZXJpZXMgb24gdGhlIGtleS48L3A+XG4gICAqXG4gICAqIDxwPk9ubHkgb25lIGtleSBpbiBhIGNsYXNzIG1heSBjb250YWluIGEgR2VvUG9pbnQuPC9wPlxuICAgKlxuICAgKiA8cD5FeGFtcGxlOjxwcmU+XG4gICAqICAgdmFyIHBvaW50ID0gbmV3IFBhcnNlLkdlb1BvaW50KDMwLjAsIC0yMC4wKTtcbiAgICogICB2YXIgb2JqZWN0ID0gbmV3IFBhcnNlLk9iamVjdChcIlBsYWNlT2JqZWN0XCIpO1xuICAgKiAgIG9iamVjdC5zZXQoXCJsb2NhdGlvblwiLCBwb2ludCk7XG4gICAqICAgb2JqZWN0LnNhdmUoKTs8L3ByZT48L3A+XG4gICAqL1xuICBQYXJzZS5HZW9Qb2ludCA9IGZ1bmN0aW9uKGFyZzEsIGFyZzIpIHtcbiAgICBpZiAoXy5pc0FycmF5KGFyZzEpKSB7XG4gICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUoYXJnMVswXSwgYXJnMVsxXSk7XG4gICAgICB0aGlzLmxhdGl0dWRlID0gYXJnMVswXTtcbiAgICAgIHRoaXMubG9uZ2l0dWRlID0gYXJnMVsxXTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoYXJnMSkpIHtcbiAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZShhcmcxLmxhdGl0dWRlLCBhcmcxLmxvbmdpdHVkZSk7XG4gICAgICB0aGlzLmxhdGl0dWRlID0gYXJnMS5sYXRpdHVkZTtcbiAgICAgIHRoaXMubG9uZ2l0dWRlID0gYXJnMS5sb25naXR1ZGU7XG4gICAgfSBlbHNlIGlmIChfLmlzTnVtYmVyKGFyZzEpICYmIF8uaXNOdW1iZXIoYXJnMikpIHtcbiAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZShhcmcxLCBhcmcyKTtcbiAgICAgIHRoaXMubGF0aXR1ZGUgPSBhcmcxO1xuICAgICAgdGhpcy5sb25naXR1ZGUgPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxhdGl0dWRlID0gMDtcbiAgICAgIHRoaXMubG9uZ2l0dWRlID0gMDtcbiAgICB9XG5cbiAgICAvLyBBZGQgcHJvcGVydGllcyBzbyB0aGF0IGFueW9uZSB1c2luZyBXZWJraXQgb3IgTW96aWxsYSB3aWxsIGdldCBhbiBlcnJvclxuICAgIC8vIGlmIHRoZXkgdHJ5IHRvIHNldCB2YWx1ZXMgdGhhdCBhcmUgb3V0IG9mIGJvdW5kcy5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHRoaXMuX19kZWZpbmVHZXR0ZXJfXyAmJiB0aGlzLl9fZGVmaW5lU2V0dGVyX18pIHtcbiAgICAgIC8vIFVzZSBfbGF0aXR1ZGUgYW5kIF9sb25naXR1ZGUgdG8gYWN0dWFsbHkgc3RvcmUgdGhlIHZhbHVlcywgYW5kIGFkZFxuICAgICAgLy8gZ2V0dGVycyBhbmQgc2V0dGVycyBmb3IgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZS5cbiAgICAgIHRoaXMuX2xhdGl0dWRlID0gdGhpcy5sYXRpdHVkZTtcbiAgICAgIHRoaXMuX2xvbmdpdHVkZSA9IHRoaXMubG9uZ2l0dWRlO1xuICAgICAgdGhpcy5fX2RlZmluZUdldHRlcl9fKFwibGF0aXR1ZGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9sYXRpdHVkZTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fX2RlZmluZUdldHRlcl9fKFwibG9uZ2l0dWRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fbG9uZ2l0dWRlO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9fZGVmaW5lU2V0dGVyX18oXCJsYXRpdHVkZVwiLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKHZhbCwgc2VsZi5sb25naXR1ZGUpO1xuICAgICAgICBzZWxmLl9sYXRpdHVkZSA9IHZhbDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fX2RlZmluZVNldHRlcl9fKFwibG9uZ2l0dWRlXCIsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUoc2VsZi5sYXRpdHVkZSwgdmFsKTtcbiAgICAgICAgc2VsZi5fbG9uZ2l0dWRlID0gdmFsO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAbGVuZHMgUGFyc2UuR2VvUG9pbnQucHJvdG90eXBlXG4gICAqIEBwcm9wZXJ0eSB7ZmxvYXR9IGxhdGl0dWRlIE5vcnRoLXNvdXRoIHBvcnRpb24gb2YgdGhlIGNvb3JkaW5hdGUsIGluIHJhbmdlXG4gICAqICAgWy05MCwgOTBdLiAgVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBzZXQgb3V0IG9mIHJhbmdlIGluIGEgbW9kZXJuIGJyb3dzZXIuXG4gICAqIEBwcm9wZXJ0eSB7ZmxvYXR9IGxvbmdpdHVkZSBFYXN0LXdlc3QgcG9ydGlvbiBvZiB0aGUgY29vcmRpbmF0ZSwgaW4gcmFuZ2VcbiAgICogICBbLTE4MCwgMTgwXS4gIFRocm93cyBpZiBzZXQgb3V0IG9mIHJhbmdlIGluIGEgbW9kZXJuIGJyb3dzZXIuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSBnaXZlbiBsYXQtbG9uZyBpcyBvdXQgb2YgYm91bmRzLlxuICAgKi9cbiAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlID0gZnVuY3Rpb24obGF0aXR1ZGUsIGxvbmdpdHVkZSkge1xuICAgIGlmIChsYXRpdHVkZSA8IC05MC4wKSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLkdlb1BvaW50IGxhdGl0dWRlIFwiICsgbGF0aXR1ZGUgKyBcIiA8IC05MC4wLlwiO1xuICAgIH1cbiAgICBpZiAobGF0aXR1ZGUgPiA5MC4wKSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLkdlb1BvaW50IGxhdGl0dWRlIFwiICsgbGF0aXR1ZGUgKyBcIiA+IDkwLjAuXCI7XG4gICAgfVxuICAgIGlmIChsb25naXR1ZGUgPCAtMTgwLjApIHtcbiAgICAgIHRocm93IFwiUGFyc2UuR2VvUG9pbnQgbG9uZ2l0dWRlIFwiICsgbG9uZ2l0dWRlICsgXCIgPCAtMTgwLjAuXCI7XG4gICAgfVxuICAgIGlmIChsb25naXR1ZGUgPiAxODAuMCkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5HZW9Qb2ludCBsb25naXR1ZGUgXCIgKyBsb25naXR1ZGUgKyBcIiA+IDE4MC4wLlwiO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIEdlb1BvaW50IHdpdGggdGhlIHVzZXIncyBjdXJyZW50IGxvY2F0aW9uLCBpZiBhdmFpbGFibGUuXG4gICAqIENhbGxzIG9wdGlvbnMuc3VjY2VzcyB3aXRoIGEgbmV3IEdlb1BvaW50IGluc3RhbmNlIG9yIGNhbGxzIG9wdGlvbnMuZXJyb3IuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHN1Y2Nlc3MgYW5kIGVycm9yIGNhbGxiYWNrcy5cbiAgICovXG4gIFBhcnNlLkdlb1BvaW50LmN1cnJlbnQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgIHByb21pc2UucmVzb2x2ZShuZXcgUGFyc2UuR2VvUG9pbnQoe1xuICAgICAgICBsYXRpdHVkZTogbG9jYXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICBsb25naXR1ZGU6IGxvY2F0aW9uLmNvb3Jkcy5sb25naXR1ZGVcbiAgICAgIH0pKTtcblxuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICBQYXJzZS5HZW9Qb2ludC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIEdlb1BvaW50LCBzdWl0YWJsZSBmb3IgUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJfX3R5cGVcIjogXCJHZW9Qb2ludFwiLFxuICAgICAgICBsYXRpdHVkZTogdGhpcy5sYXRpdHVkZSxcbiAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmxvbmdpdHVkZVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSB0aGlzIEdlb1BvaW50IHRvIGFub3RoZXIgaW4gcmFkaWFucy5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCB0aGUgb3RoZXIgUGFyc2UuR2VvUG9pbnQuXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIHJhZGlhbnNUbzogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIHZhciBkMnIgPSBNYXRoLlBJIC8gMTgwLjA7XG4gICAgICB2YXIgbGF0MXJhZCA9IHRoaXMubGF0aXR1ZGUgKiBkMnI7XG4gICAgICB2YXIgbG9uZzFyYWQgPSB0aGlzLmxvbmdpdHVkZSAqIGQycjtcbiAgICAgIHZhciBsYXQycmFkID0gcG9pbnQubGF0aXR1ZGUgKiBkMnI7XG4gICAgICB2YXIgbG9uZzJyYWQgPSBwb2ludC5sb25naXR1ZGUgKiBkMnI7XG4gICAgICB2YXIgZGVsdGFMYXQgPSBsYXQxcmFkIC0gbGF0MnJhZDtcbiAgICAgIHZhciBkZWx0YUxvbmcgPSBsb25nMXJhZCAtIGxvbmcycmFkO1xuICAgICAgdmFyIHNpbkRlbHRhTGF0RGl2MiA9IE1hdGguc2luKGRlbHRhTGF0IC8gMik7XG4gICAgICB2YXIgc2luRGVsdGFMb25nRGl2MiA9IE1hdGguc2luKGRlbHRhTG9uZyAvIDIpO1xuICAgICAgLy8gU3F1YXJlIG9mIGhhbGYgdGhlIHN0cmFpZ2h0IGxpbmUgY2hvcmQgZGlzdGFuY2UgYmV0d2VlbiBib3RoIHBvaW50cy5cbiAgICAgIHZhciBhID0gKChzaW5EZWx0YUxhdERpdjIgKiBzaW5EZWx0YUxhdERpdjIpICtcbiAgICAgICAgICAgICAgIChNYXRoLmNvcyhsYXQxcmFkKSAqIE1hdGguY29zKGxhdDJyYWQpICpcbiAgICAgICAgICAgICAgICBzaW5EZWx0YUxvbmdEaXYyICogc2luRGVsdGFMb25nRGl2MikpO1xuICAgICAgYSA9IE1hdGgubWluKDEuMCwgYSk7XG4gICAgICByZXR1cm4gMiAqIE1hdGguYXNpbihNYXRoLnNxcnQoYSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIHRoaXMgR2VvUG9pbnQgdG8gYW5vdGhlciBpbiBraWxvbWV0ZXJzLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IHRoZSBvdGhlciBQYXJzZS5HZW9Qb2ludC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAga2lsb21ldGVyc1RvOiBmdW5jdGlvbihwb2ludCkge1xuICAgICAgcmV0dXJuIHRoaXMucmFkaWFuc1RvKHBvaW50KSAqIDYzNzEuMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSB0aGlzIEdlb1BvaW50IHRvIGFub3RoZXIgaW4gbWlsZXMuXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgdGhlIG90aGVyIFBhcnNlLkdlb1BvaW50LlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBtaWxlc1RvOiBmdW5jdGlvbihwb2ludCkge1xuICAgICAgcmV0dXJuIHRoaXMucmFkaWFuc1RvKHBvaW50KSAqIDM5NTguODtcbiAgICB9XG4gIH07XG59KHRoaXMpKTtcblxuLypnbG9iYWwgbmF2aWdhdG9yOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICB2YXIgUFVCTElDX0tFWSA9IFwiKlwiO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEFDTC5cbiAgICogSWYgbm8gYXJndW1lbnQgaXMgZ2l2ZW4sIHRoZSBBQ0wgaGFzIG5vIHBlcm1pc3Npb25zIGZvciBhbnlvbmUuXG4gICAqIElmIHRoZSBhcmd1bWVudCBpcyBhIFBhcnNlLlVzZXIsIHRoZSBBQ0wgd2lsbCBoYXZlIHJlYWQgYW5kIHdyaXRlXG4gICAqICAgcGVybWlzc2lvbiBmb3Igb25seSB0aGF0IHVzZXIuXG4gICAqIElmIHRoZSBhcmd1bWVudCBpcyBhbnkgb3RoZXIgSlNPTiBvYmplY3QsIHRoYXQgb2JqZWN0IHdpbGwgYmUgaW50ZXJwcmV0dGVkXG4gICAqICAgYXMgYSBzZXJpYWxpemVkIEFDTCBjcmVhdGVkIHdpdGggdG9KU09OKCkuXG4gICAqIEBzZWUgUGFyc2UuT2JqZWN0I3NldEFDTFxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+QW4gQUNMLCBvciBBY2Nlc3MgQ29udHJvbCBMaXN0IGNhbiBiZSBhZGRlZCB0byBhbnlcbiAgICogPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPiB0byByZXN0cmljdCBhY2Nlc3MgdG8gb25seSBhIHN1YnNldCBvZiB1c2Vyc1xuICAgKiBvZiB5b3VyIGFwcGxpY2F0aW9uLjwvcD5cbiAgICovXG4gIFBhcnNlLkFDTCA9IGZ1bmN0aW9uKGFyZzEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5wZXJtaXNzaW9uc0J5SWQgPSB7fTtcbiAgICBpZiAoXy5pc09iamVjdChhcmcxKSkge1xuICAgICAgaWYgKGFyZzEgaW5zdGFuY2VvZiBQYXJzZS5Vc2VyKSB7XG4gICAgICAgIHNlbGYuc2V0UmVhZEFjY2VzcyhhcmcxLCB0cnVlKTtcbiAgICAgICAgc2VsZi5zZXRXcml0ZUFjY2VzcyhhcmcxLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oYXJnMSkpIHtcbiAgICAgICAgICB0aHJvdyBcIlBhcnNlLkFDTCgpIGNhbGxlZCB3aXRoIGEgZnVuY3Rpb24uICBEaWQgeW91IGZvcmdldCAoKT9cIjtcbiAgICAgICAgfVxuICAgICAgICBQYXJzZS5fb2JqZWN0RWFjaChhcmcxLCBmdW5jdGlvbihhY2Nlc3NMaXN0LCB1c2VySWQpIHtcbiAgICAgICAgICBpZiAoIV8uaXNTdHJpbmcodXNlcklkKSkge1xuICAgICAgICAgICAgdGhyb3cgXCJUcmllZCB0byBjcmVhdGUgYW4gQUNMIHdpdGggYW4gaW52YWxpZCB1c2VySWQuXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYucGVybWlzc2lvbnNCeUlkW3VzZXJJZF0gPSB7fTtcbiAgICAgICAgICBQYXJzZS5fb2JqZWN0RWFjaChhY2Nlc3NMaXN0LCBmdW5jdGlvbihhbGxvd2VkLCBwZXJtaXNzaW9uKSB7XG4gICAgICAgICAgICBpZiAocGVybWlzc2lvbiAhPT0gXCJyZWFkXCIgJiYgcGVybWlzc2lvbiAhPT0gXCJ3cml0ZVwiKSB7XG4gICAgICAgICAgICAgIHRocm93IFwiVHJpZWQgdG8gY3JlYXRlIGFuIEFDTCB3aXRoIGFuIGludmFsaWQgcGVybWlzc2lvbiB0eXBlLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFfLmlzQm9vbGVhbihhbGxvd2VkKSkge1xuICAgICAgICAgICAgICB0aHJvdyBcIlRyaWVkIHRvIGNyZWF0ZSBhbiBBQ0wgd2l0aCBhbiBpbnZhbGlkIHBlcm1pc3Npb24gdmFsdWUuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdW3Blcm1pc3Npb25dID0gYWxsb3dlZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgSlNPTi1lbmNvZGVkIHZlcnNpb24gb2YgdGhlIEFDTC5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy5jbG9uZSh0aGlzLnBlcm1pc3Npb25zQnlJZCk7XG4gIH07XG5cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5fc2V0QWNjZXNzID0gZnVuY3Rpb24oYWNjZXNzVHlwZSwgdXNlcklkLCBhbGxvd2VkKSB7XG4gICAgaWYgKHVzZXJJZCBpbnN0YW5jZW9mIFBhcnNlLlVzZXIpIHtcbiAgICAgIHVzZXJJZCA9IHVzZXJJZC5pZDtcbiAgICB9IGVsc2UgaWYgKHVzZXJJZCBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIHVzZXJJZCA9IFwicm9sZTpcIiArIHVzZXJJZC5nZXROYW1lKCk7XG4gICAgfVxuICAgIGlmICghXy5pc1N0cmluZyh1c2VySWQpKSB7XG4gICAgICB0aHJvdyBcInVzZXJJZCBtdXN0IGJlIGEgc3RyaW5nLlwiO1xuICAgIH1cbiAgICBpZiAoIV8uaXNCb29sZWFuKGFsbG93ZWQpKSB7XG4gICAgICB0aHJvdyBcImFsbG93ZWQgbXVzdCBiZSBlaXRoZXIgdHJ1ZSBvciBmYWxzZS5cIjtcbiAgICB9XG4gICAgdmFyIHBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXTtcbiAgICBpZiAoIXBlcm1pc3Npb25zKSB7XG4gICAgICBpZiAoIWFsbG93ZWQpIHtcbiAgICAgICAgLy8gVGhlIHVzZXIgYWxyZWFkeSBkb2Vzbid0IGhhdmUgdGhpcyBwZXJtaXNzaW9uLCBzbyBubyBhY3Rpb24gbmVlZGVkLlxuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgICAgICB0aGlzLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdID0gcGVybWlzc2lvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93ZWQpIHtcbiAgICAgIHRoaXMucGVybWlzc2lvbnNCeUlkW3VzZXJJZF1bYWNjZXNzVHlwZV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgcGVybWlzc2lvbnNbYWNjZXNzVHlwZV07XG4gICAgICBpZiAoXy5pc0VtcHR5KHBlcm1pc3Npb25zKSkge1xuICAgICAgICBkZWxldGUgcGVybWlzc2lvbnNbdXNlcklkXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5fZ2V0QWNjZXNzID0gZnVuY3Rpb24oYWNjZXNzVHlwZSwgdXNlcklkKSB7XG4gICAgaWYgKHVzZXJJZCBpbnN0YW5jZW9mIFBhcnNlLlVzZXIpIHtcbiAgICAgIHVzZXJJZCA9IHVzZXJJZC5pZDtcbiAgICB9IGVsc2UgaWYgKHVzZXJJZCBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIHVzZXJJZCA9IFwicm9sZTpcIiArIHVzZXJJZC5nZXROYW1lKCk7XG4gICAgfVxuICAgIHZhciBwZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNCeUlkW3VzZXJJZF07XG4gICAgaWYgKCFwZXJtaXNzaW9ucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnNbYWNjZXNzVHlwZV0gPyB0cnVlIDogZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHRoZSBnaXZlbiB1c2VyIGlzIGFsbG93ZWQgdG8gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogQHBhcmFtIHVzZXJJZCBBbiBpbnN0YW5jZSBvZiBQYXJzZS5Vc2VyIG9yIGl0cyBvYmplY3RJZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxvd2VkIFdoZXRoZXIgdGhhdCB1c2VyIHNob3VsZCBoYXZlIHJlYWQgYWNjZXNzLlxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5zZXRSZWFkQWNjZXNzID0gZnVuY3Rpb24odXNlcklkLCBhbGxvd2VkKSB7XG4gICAgdGhpcy5fc2V0QWNjZXNzKFwicmVhZFwiLCB1c2VySWQsIGFsbG93ZWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgd2hldGhlciB0aGUgZ2l2ZW4gdXNlciBpZCBpcyAqZXhwbGljaXRseSogYWxsb3dlZCB0byByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBFdmVuIGlmIHRoaXMgcmV0dXJucyBmYWxzZSwgdGhlIHVzZXIgbWF5IHN0aWxsIGJlIGFibGUgdG8gYWNjZXNzIGl0IGlmXG4gICAqIGdldFB1YmxpY1JlYWRBY2Nlc3MgcmV0dXJucyB0cnVlIG9yIGEgcm9sZSB0aGF0IHRoZSB1c2VyIGJlbG9uZ3MgdG8gaGFzXG4gICAqIHdyaXRlIGFjY2Vzcy5cbiAgICogQHBhcmFtIHVzZXJJZCBBbiBpbnN0YW5jZSBvZiBQYXJzZS5Vc2VyIG9yIGl0cyBvYmplY3RJZCwgb3IgYSBQYXJzZS5Sb2xlLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRSZWFkQWNjZXNzID0gZnVuY3Rpb24odXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEFjY2VzcyhcInJlYWRcIiwgdXNlcklkKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHdoZXRoZXIgdGhlIGdpdmVuIHVzZXIgaWQgaXMgYWxsb3dlZCB0byB3cml0ZSB0aGlzIG9iamVjdC5cbiAgICogQHBhcmFtIHVzZXJJZCBBbiBpbnN0YW5jZSBvZiBQYXJzZS5Vc2VyIG9yIGl0cyBvYmplY3RJZCwgb3IgYSBQYXJzZS5Sb2xlLi5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxvd2VkIFdoZXRoZXIgdGhhdCB1c2VyIHNob3VsZCBoYXZlIHdyaXRlIGFjY2Vzcy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0V3JpdGVBY2Nlc3MgPSBmdW5jdGlvbih1c2VySWQsIGFsbG93ZWQpIHtcbiAgICB0aGlzLl9zZXRBY2Nlc3MoXCJ3cml0ZVwiLCB1c2VySWQsIGFsbG93ZWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgd2hldGhlciB0aGUgZ2l2ZW4gdXNlciBpZCBpcyAqZXhwbGljaXRseSogYWxsb3dlZCB0byB3cml0ZSB0aGlzIG9iamVjdC5cbiAgICogRXZlbiBpZiB0aGlzIHJldHVybnMgZmFsc2UsIHRoZSB1c2VyIG1heSBzdGlsbCBiZSBhYmxlIHRvIHdyaXRlIGl0IGlmXG4gICAqIGdldFB1YmxpY1dyaXRlQWNjZXNzIHJldHVybnMgdHJ1ZSBvciBhIHJvbGUgdGhhdCB0aGUgdXNlciBiZWxvbmdzIHRvIGhhc1xuICAgKiB3cml0ZSBhY2Nlc3MuXG4gICAqIEBwYXJhbSB1c2VySWQgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuVXNlciBvciBpdHMgb2JqZWN0SWQsIG9yIGEgUGFyc2UuUm9sZS5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0V3JpdGVBY2Nlc3MgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0QWNjZXNzKFwid3JpdGVcIiwgdXNlcklkKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHdoZXRoZXIgdGhlIHB1YmxpYyBpcyBhbGxvd2VkIHRvIHJlYWQgdGhpcyBvYmplY3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZFxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5zZXRQdWJsaWNSZWFkQWNjZXNzID0gZnVuY3Rpb24oYWxsb3dlZCkge1xuICAgIHRoaXMuc2V0UmVhZEFjY2VzcyhQVUJMSUNfS0VZLCBhbGxvd2VkKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdGhlIHB1YmxpYyBpcyBhbGxvd2VkIHRvIHJlYWQgdGhpcyBvYmplY3QuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFB1YmxpY1JlYWRBY2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFkQWNjZXNzKFBVQkxJQ19LRVkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB0aGUgcHVibGljIGlzIGFsbG93ZWQgdG8gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZFxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5zZXRQdWJsaWNXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKGFsbG93ZWQpIHtcbiAgICB0aGlzLnNldFdyaXRlQWNjZXNzKFBVQkxJQ19LRVksIGFsbG93ZWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgd2hldGhlciB0aGUgcHVibGljIGlzIGFsbG93ZWQgdG8gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFB1YmxpY1dyaXRlQWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V3JpdGVBY2Nlc3MoUFVCTElDX0tFWSk7XG4gIH07XG4gIFxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdXNlcnMgYmVsb25naW5nIHRvIHRoZSBnaXZlbiByb2xlIGFyZSBhbGxvd2VkXG4gICAqIHRvIHJlYWQgdGhpcyBvYmplY3QuIEV2ZW4gaWYgdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgcm9sZSBtYXlcbiAgICogc3RpbGwgYmUgYWJsZSB0byB3cml0ZSBpdCBpZiBhIHBhcmVudCByb2xlIGhhcyByZWFkIGFjY2Vzcy5cbiAgICogXG4gICAqIEBwYXJhbSByb2xlIFRoZSBuYW1lIG9mIHRoZSByb2xlLCBvciBhIFBhcnNlLlJvbGUgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSByb2xlIGhhcyByZWFkIGFjY2Vzcy4gZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAdGhyb3dzIHtTdHJpbmd9IElmIHJvbGUgaXMgbmVpdGhlciBhIFBhcnNlLlJvbGUgbm9yIGEgU3RyaW5nLlxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRSb2xlUmVhZEFjY2VzcyA9IGZ1bmN0aW9uKHJvbGUpIHtcbiAgICBpZiAocm9sZSBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIC8vIE5vcm1hbGl6ZSB0byB0aGUgU3RyaW5nIG5hbWVcbiAgICAgIHJvbGUgPSByb2xlLmdldE5hbWUoKTtcbiAgICB9XG4gICAgaWYgKF8uaXNTdHJpbmcocm9sZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFJlYWRBY2Nlc3MoXCJyb2xlOlwiICsgcm9sZSk7XG4gICAgfVxuICAgIHRocm93IFwicm9sZSBtdXN0IGJlIGEgUGFyc2UuUm9sZSBvciBhIFN0cmluZ1wiO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHVzZXJzIGJlbG9uZ2luZyB0byB0aGUgZ2l2ZW4gcm9sZSBhcmUgYWxsb3dlZFxuICAgKiB0byB3cml0ZSB0aGlzIG9iamVjdC4gRXZlbiBpZiB0aGlzIHJldHVybnMgZmFsc2UsIHRoZSByb2xlIG1heVxuICAgKiBzdGlsbCBiZSBhYmxlIHRvIHdyaXRlIGl0IGlmIGEgcGFyZW50IHJvbGUgaGFzIHdyaXRlIGFjY2Vzcy5cbiAgICogXG4gICAqIEBwYXJhbSByb2xlIFRoZSBuYW1lIG9mIHRoZSByb2xlLCBvciBhIFBhcnNlLlJvbGUgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSByb2xlIGhhcyB3cml0ZSBhY2Nlc3MuIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHRocm93cyB7U3RyaW5nfSBJZiByb2xlIGlzIG5laXRoZXIgYSBQYXJzZS5Sb2xlIG5vciBhIFN0cmluZy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0Um9sZVdyaXRlQWNjZXNzID0gZnVuY3Rpb24ocm9sZSkge1xuICAgIGlmIChyb2xlIGluc3RhbmNlb2YgUGFyc2UuUm9sZSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHRoZSBTdHJpbmcgbmFtZVxuICAgICAgcm9sZSA9IHJvbGUuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICBpZiAoXy5pc1N0cmluZyhyb2xlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0V3JpdGVBY2Nlc3MoXCJyb2xlOlwiICsgcm9sZSk7XG4gICAgfVxuICAgIHRocm93IFwicm9sZSBtdXN0IGJlIGEgUGFyc2UuUm9sZSBvciBhIFN0cmluZ1wiO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHVzZXJzIGJlbG9uZ2luZyB0byB0aGUgZ2l2ZW4gcm9sZSBhcmUgYWxsb3dlZFxuICAgKiB0byByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBcbiAgICogQHBhcmFtIHJvbGUgVGhlIG5hbWUgb2YgdGhlIHJvbGUsIG9yIGEgUGFyc2UuUm9sZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZCBXaGV0aGVyIHRoZSBnaXZlbiByb2xlIGNhbiByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBAdGhyb3dzIHtTdHJpbmd9IElmIHJvbGUgaXMgbmVpdGhlciBhIFBhcnNlLlJvbGUgbm9yIGEgU3RyaW5nLlxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5zZXRSb2xlUmVhZEFjY2VzcyA9IGZ1bmN0aW9uKHJvbGUsIGFsbG93ZWQpIHtcbiAgICBpZiAocm9sZSBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIC8vIE5vcm1hbGl6ZSB0byB0aGUgU3RyaW5nIG5hbWVcbiAgICAgIHJvbGUgPSByb2xlLmdldE5hbWUoKTtcbiAgICB9XG4gICAgaWYgKF8uaXNTdHJpbmcocm9sZSkpIHtcbiAgICAgIHRoaXMuc2V0UmVhZEFjY2VzcyhcInJvbGU6XCIgKyByb2xlLCBhbGxvd2VkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgXCJyb2xlIG11c3QgYmUgYSBQYXJzZS5Sb2xlIG9yIGEgU3RyaW5nXCI7XG4gIH07XG4gIFxuICAvKipcbiAgICogU2V0IHdoZXRoZXIgdXNlcnMgYmVsb25naW5nIHRvIHRoZSBnaXZlbiByb2xlIGFyZSBhbGxvd2VkXG4gICAqIHRvIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBcbiAgICogQHBhcmFtIHJvbGUgVGhlIG5hbWUgb2YgdGhlIHJvbGUsIG9yIGEgUGFyc2UuUm9sZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZCBXaGV0aGVyIHRoZSBnaXZlbiByb2xlIGNhbiB3cml0ZSB0aGlzIG9iamVjdC5cbiAgICogQHRocm93cyB7U3RyaW5nfSBJZiByb2xlIGlzIG5laXRoZXIgYSBQYXJzZS5Sb2xlIG5vciBhIFN0cmluZy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0Um9sZVdyaXRlQWNjZXNzID0gZnVuY3Rpb24ocm9sZSwgYWxsb3dlZCkge1xuICAgIGlmIChyb2xlIGluc3RhbmNlb2YgUGFyc2UuUm9sZSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHRoZSBTdHJpbmcgbmFtZVxuICAgICAgcm9sZSA9IHJvbGUuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICBpZiAoXy5pc1N0cmluZyhyb2xlKSkge1xuICAgICAgdGhpcy5zZXRXcml0ZUFjY2VzcyhcInJvbGU6XCIgKyByb2xlLCBhbGxvd2VkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgXCJyb2xlIG11c3QgYmUgYSBQYXJzZS5Sb2xlIG9yIGEgU3RyaW5nXCI7XG4gIH07XG5cbn0odGhpcykpO1xuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogQSBQYXJzZS5PcCBpcyBhbiBhdG9taWMgb3BlcmF0aW9uIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBmaWVsZCBpbiBhXG4gICAqIFBhcnNlLk9iamVjdC4gRm9yIGV4YW1wbGUsIGNhbGxpbmcgPGNvZGU+b2JqZWN0LnNldChcImZvb1wiLCBcImJhclwiKTwvY29kZT5cbiAgICogaXMgYW4gZXhhbXBsZSBvZiBhIFBhcnNlLk9wLlNldC4gQ2FsbGluZyA8Y29kZT5vYmplY3QudW5zZXQoXCJmb29cIik8L2NvZGU+XG4gICAqIGlzIGEgUGFyc2UuT3AuVW5zZXQuIFRoZXNlIG9wZXJhdGlvbnMgYXJlIHN0b3JlZCBpbiBhIFBhcnNlLk9iamVjdCBhbmRcbiAgICogc2VudCB0byB0aGUgc2VydmVyIGFzIHBhcnQgb2YgPGNvZGU+b2JqZWN0LnNhdmUoKTwvY29kZT4gb3BlcmF0aW9ucy5cbiAgICogSW5zdGFuY2VzIG9mIFBhcnNlLk9wIHNob3VsZCBiZSBpbW11dGFibGUuXG4gICAqXG4gICAqIFlvdSBzaG91bGQgbm90IGNyZWF0ZSBzdWJjbGFzc2VzIG9mIFBhcnNlLk9wIG9yIGluc3RhbnRpYXRlIFBhcnNlLk9wXG4gICAqIGRpcmVjdGx5LlxuICAgKi9cbiAgUGFyc2UuT3AgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgUGFyc2UuT3AucHJvdG90eXBlID0ge1xuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbigpIHt9XG4gIH07XG5cbiAgXy5leHRlbmQoUGFyc2UuT3AsIHtcbiAgICAvKipcbiAgICAgKiBUbyBjcmVhdGUgYSBuZXcgT3AsIGNhbGwgUGFyc2UuT3AuX2V4dGVuZCgpO1xuICAgICAqL1xuICAgIF9leHRlbmQ6IFBhcnNlLl9leHRlbmQsXG5cbiAgICAvLyBBIG1hcCBvZiBfX29wIHN0cmluZyB0byBkZWNvZGVyIGZ1bmN0aW9uLlxuICAgIF9vcERlY29kZXJNYXA6IHt9LFxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gdG8gY29udmVydCBhIGpzb24gb2JqZWN0IHdpdGggYW4gX19vcCBmaWVsZCBpbnRvIGFuXG4gICAgICogaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PcC5cbiAgICAgKi9cbiAgICBfcmVnaXN0ZXJEZWNvZGVyOiBmdW5jdGlvbihvcE5hbWUsIGRlY29kZXIpIHtcbiAgICAgIFBhcnNlLk9wLl9vcERlY29kZXJNYXBbb3BOYW1lXSA9IGRlY29kZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEganNvbiBvYmplY3QgaW50byBhbiBpbnN0YW5jZSBvZiBhIHN1YmNsYXNzIG9mIFBhcnNlLk9wLlxuICAgICAqL1xuICAgIF9kZWNvZGU6IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHZhciBkZWNvZGVyID0gUGFyc2UuT3AuX29wRGVjb2Rlck1hcFtqc29uLl9fb3BdO1xuICAgICAgaWYgKGRlY29kZXIpIHtcbiAgICAgICAgcmV0dXJuIGRlY29kZXIoanNvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLypcbiAgICogQWRkIGEgaGFuZGxlciBmb3IgQmF0Y2ggb3BzLlxuICAgKi9cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkJhdGNoXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICB2YXIgb3AgPSBudWxsO1xuICAgIFBhcnNlLl9hcnJheUVhY2goanNvbi5vcHMsIGZ1bmN0aW9uKG5leHRPcCkge1xuICAgICAgbmV4dE9wID0gUGFyc2UuT3AuX2RlY29kZShuZXh0T3ApO1xuICAgICAgb3AgPSBuZXh0T3AuX21lcmdlV2l0aFByZXZpb3VzKG9wKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3A7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogQSBTZXQgb3BlcmF0aW9uIGluZGljYXRlcyB0aGF0IGVpdGhlciB0aGUgZmllbGQgd2FzIGNoYW5nZWQgdXNpbmdcbiAgICogUGFyc2UuT2JqZWN0LnNldCwgb3IgaXQgaXMgYSBtdXRhYmxlIGNvbnRhaW5lciB0aGF0IHdhcyBkZXRlY3RlZCBhcyBiZWluZ1xuICAgKiBjaGFuZ2VkLlxuICAgKi9cbiAgUGFyc2UuT3AuU2V0ID0gUGFyc2UuT3AuX2V4dGVuZCgvKiogQGxlbmRzIFBhcnNlLk9wLlNldC5wcm90b3R5cGUgKi8ge1xuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbmV3IHZhbHVlIG9mIHRoaXMgZmllbGQgYWZ0ZXIgdGhlIHNldC5cbiAgICAgKi9cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQYXJzZS5fZW5jb2RlKHRoaXMudmFsdWUoKSk7XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEEgc2VudGluZWwgdmFsdWUgdGhhdCBpcyByZXR1cm5lZCBieSBQYXJzZS5PcC5VbnNldC5fZXN0aW1hdGUgdG9cbiAgICogaW5kaWNhdGUgdGhlIGZpZWxkIHNob3VsZCBiZSBkZWxldGVkLiBCYXNpY2FsbHksIGlmIHlvdSBmaW5kIF9VTlNFVCBhcyBhXG4gICAqIHZhbHVlIGluIHlvdXIgb2JqZWN0LCB5b3Ugc2hvdWxkIHJlbW92ZSB0aGF0IGtleS5cbiAgICovXG4gIFBhcnNlLk9wLl9VTlNFVCA9IHt9O1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogQW4gVW5zZXQgb3BlcmF0aW9uIGluZGljYXRlcyB0aGF0IHRoaXMgZmllbGQgaGFzIGJlZW4gZGVsZXRlZCBmcm9tIHRoZVxuICAgKiBvYmplY3QuXG4gICAqL1xuICBQYXJzZS5PcC5VbnNldCA9IFBhcnNlLk9wLl9leHRlbmQoLyoqIEBsZW5kcyBQYXJzZS5PcC5VbnNldC5wcm90b3R5cGUgKi8ge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IF9fb3A6IFwiRGVsZXRlXCIgfTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIHJldHVybiBQYXJzZS5PcC5fVU5TRVQ7XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiRGVsZXRlXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlVuc2V0KCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogQW4gSW5jcmVtZW50IGlzIGFuIGF0b21pYyBvcGVyYXRpb24gd2hlcmUgdGhlIG51bWVyaWMgdmFsdWUgZm9yIHRoZSBmaWVsZFxuICAgKiB3aWxsIGJlIGluY3JlYXNlZCBieSBhIGdpdmVuIGFtb3VudC5cbiAgICovXG4gIFBhcnNlLk9wLkluY3JlbWVudCA9IFBhcnNlLk9wLl9leHRlbmQoXG4gICAgICAvKiogQGxlbmRzIFBhcnNlLk9wLkluY3JlbWVudC5wcm90b3R5cGUgKi8ge1xuXG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgdGhpcy5fYW1vdW50ID0gYW1vdW50O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhbW91bnQgdG8gaW5jcmVtZW50IGJ5LlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gdGhlIGFtb3VudCB0byBpbmNyZW1lbnQgYnkuXG4gICAgICovXG4gICAgYW1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hbW91bnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IF9fb3A6IFwiSW5jcmVtZW50XCIsIGFtb3VudDogdGhpcy5fYW1vdW50IH07XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuVW5zZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5hbW91bnQoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuU2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHByZXZpb3VzLnZhbHVlKCkgKyB0aGlzLmFtb3VudCgpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5JbmNyZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5JbmNyZW1lbnQodGhpcy5hbW91bnQoKSArIHByZXZpb3VzLmFtb3VudCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbW91bnQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvbGRWYWx1ZSArIHRoaXMuYW1vdW50KCk7XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiSW5jcmVtZW50XCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLkluY3JlbWVudChqc29uLmFtb3VudCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogQWRkIGlzIGFuIGF0b21pYyBvcGVyYXRpb24gd2hlcmUgdGhlIGdpdmVuIG9iamVjdHMgd2lsbCBiZSBhcHBlbmRlZCB0byB0aGVcbiAgICogYXJyYXkgdGhhdCBpcyBzdG9yZWQgaW4gdGhpcyBmaWVsZC5cbiAgICovXG4gIFBhcnNlLk9wLkFkZCA9IFBhcnNlLk9wLl9leHRlbmQoLyoqIEBsZW5kcyBQYXJzZS5PcC5BZGQucHJvdG90eXBlICovIHtcbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24ob2JqZWN0cykge1xuICAgICAgdGhpcy5fb2JqZWN0cyA9IG9iamVjdHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG9iamVjdHMgdG8gYmUgYWRkZWQgdG8gdGhlIGFycmF5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgb2JqZWN0cyB0byBiZSBhZGRlZCB0byB0aGUgYXJyYXkuXG4gICAgICovXG4gICAgb2JqZWN0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0cztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgX19vcDogXCJBZGRcIiwgb2JqZWN0czogUGFyc2UuX2VuY29kZSh0aGlzLm9iamVjdHMoKSkgfTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5VbnNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLm9iamVjdHMoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuU2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMuX2VzdGltYXRlKHByZXZpb3VzLnZhbHVlKCkpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5BZGQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5BZGQocHJldmlvdXMub2JqZWN0cygpLmNvbmNhdCh0aGlzLm9iamVjdHMoKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJPcCBpcyBpbnZhbGlkIGFmdGVyIHByZXZpb3VzIG9wLlwiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlKSB7XG4gICAgICBpZiAoIW9sZFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBfLmNsb25lKHRoaXMub2JqZWN0cygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvbGRWYWx1ZS5jb25jYXQodGhpcy5vYmplY3RzKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkFkZFwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5BZGQoUGFyc2UuX2RlY29kZSh1bmRlZmluZWQsIGpzb24ub2JqZWN0cykpO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEFkZFVuaXF1ZSBpcyBhbiBhdG9taWMgb3BlcmF0aW9uIHdoZXJlIHRoZSBnaXZlbiBpdGVtcyB3aWxsIGJlIGFwcGVuZGVkIHRvXG4gICAqIHRoZSBhcnJheSB0aGF0IGlzIHN0b3JlZCBpbiB0aGlzIGZpZWxkIG9ubHkgaWYgdGhleSB3ZXJlIG5vdCBhbHJlYWR5XG4gICAqIHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICAgKi9cbiAgUGFyc2UuT3AuQWRkVW5pcXVlID0gUGFyc2UuT3AuX2V4dGVuZChcbiAgICAgIC8qKiBAbGVuZHMgUGFyc2UuT3AuQWRkVW5pcXVlLnByb3RvdHlwZSAqLyB7XG5cbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24ob2JqZWN0cykge1xuICAgICAgdGhpcy5fb2JqZWN0cyA9IF8udW5pcShvYmplY3RzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgb2JqZWN0cyB0byBiZSBhZGRlZCB0byB0aGUgYXJyYXkuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBvYmplY3RzIHRvIGJlIGFkZGVkIHRvIHRoZSBhcnJheS5cbiAgICAgKi9cbiAgICBvYmplY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYmplY3RzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIkFkZFVuaXF1ZVwiLCBvYmplY3RzOiBQYXJzZS5fZW5jb2RlKHRoaXMub2JqZWN0cygpKSB9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlVuc2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMub2JqZWN0cygpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5TZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5fZXN0aW1hdGUocHJldmlvdXMudmFsdWUoKSkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLkFkZFVuaXF1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLkFkZFVuaXF1ZSh0aGlzLl9lc3RpbWF0ZShwcmV2aW91cy5vYmplY3RzKCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gXy5jbG9uZSh0aGlzLm9iamVjdHMoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSBjYW4ndCBqdXN0IHRha2UgdGhlIF8udW5pcShfLnVuaW9uKC4uLikpIG9mIG9sZFZhbHVlIGFuZFxuICAgICAgICAvLyB0aGlzLm9iamVjdHMsIGJlY2F1c2UgdGhlIHVuaXF1ZW5lc3MgbWF5IG5vdCBhcHBseSB0byBvbGRWYWx1ZVxuICAgICAgICAvLyAoZXNwZWNpYWxseSBpZiB0aGUgb2xkVmFsdWUgd2FzIHNldCB2aWEgLnNldCgpKVxuICAgICAgICB2YXIgbmV3VmFsdWUgPSBfLmNsb25lKG9sZFZhbHVlKTtcbiAgICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLm9iamVjdHMoKSwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCAmJiBvYmouaWQpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaGluZ09iaiA9IF8uZmluZChuZXdWYWx1ZSwgZnVuY3Rpb24oYW5PYmopIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChhbk9iaiBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkgJiYgKGFuT2JqLmlkID09PSBvYmouaWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoaW5nT2JqKSB7XG4gICAgICAgICAgICAgIG5ld1ZhbHVlLnB1c2gob2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZihuZXdWYWx1ZSwgbWF0Y2hpbmdPYmopO1xuICAgICAgICAgICAgICBuZXdWYWx1ZVtpbmRleF0gPSBvYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhuZXdWYWx1ZSwgb2JqKSkge1xuICAgICAgICAgICAgbmV3VmFsdWUucHVzaChvYmopO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJBZGRVbmlxdWVcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuQWRkVW5pcXVlKFBhcnNlLl9kZWNvZGUodW5kZWZpbmVkLCBqc29uLm9iamVjdHMpKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBSZW1vdmUgaXMgYW4gYXRvbWljIG9wZXJhdGlvbiB3aGVyZSB0aGUgZ2l2ZW4gb2JqZWN0cyB3aWxsIGJlIHJlbW92ZWQgZnJvbVxuICAgKiB0aGUgYXJyYXkgdGhhdCBpcyBzdG9yZWQgaW4gdGhpcyBmaWVsZC5cbiAgICovXG4gIFBhcnNlLk9wLlJlbW92ZSA9IFBhcnNlLk9wLl9leHRlbmQoLyoqIEBsZW5kcyBQYXJzZS5PcC5SZW1vdmUucHJvdG90eXBlICovIHtcbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24ob2JqZWN0cykge1xuICAgICAgdGhpcy5fb2JqZWN0cyA9IF8udW5pcShvYmplY3RzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgb2JqZWN0cyB0byBiZSByZW1vdmVkIGZyb20gdGhlIGFycmF5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgb2JqZWN0cyB0byBiZSByZW1vdmVkIGZyb20gdGhlIGFycmF5LlxuICAgICAqL1xuICAgIG9iamVjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IF9fb3A6IFwiUmVtb3ZlXCIsIG9iamVjdHM6IFBhcnNlLl9lbmNvZGUodGhpcy5vYmplY3RzKCkpIH07XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuVW5zZXQpIHtcbiAgICAgICAgcmV0dXJuIHByZXZpb3VzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLl9lc3RpbWF0ZShwcmV2aW91cy52YWx1ZSgpKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuUmVtb3ZlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuUmVtb3ZlKF8udW5pb24ocHJldmlvdXMub2JqZWN0cygpLCB0aGlzLm9iamVjdHMoKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJPcCBpcyBpbnZhbGlkIGFmdGVyIHByZXZpb3VzIG9wLlwiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlKSB7XG4gICAgICBpZiAoIW9sZFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IF8uZGlmZmVyZW5jZShvbGRWYWx1ZSwgdGhpcy5vYmplY3RzKCkpO1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgc2F2ZWQgUGFyc2UgT2JqZWN0cyBiZWluZyByZW1vdmVkLCBhbHNvIHJlbW92ZSB0aGVtLlxuICAgICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMub2JqZWN0cygpLCBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0ICYmIG9iai5pZCkge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSBfLnJlamVjdChuZXdWYWx1ZSwgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChvdGhlciBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkgJiYgKG90aGVyLmlkID09PSBvYmouaWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIlJlbW92ZVwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5SZW1vdmUoUGFyc2UuX2RlY29kZSh1bmRlZmluZWQsIGpzb24ub2JqZWN0cykpO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEEgUmVsYXRpb24gb3BlcmF0aW9uIGluZGljYXRlcyB0aGF0IHRoZSBmaWVsZCBpcyBhbiBpbnN0YW5jZSBvZlxuICAgKiBQYXJzZS5SZWxhdGlvbiwgYW5kIG9iamVjdHMgYXJlIGJlaW5nIGFkZGVkIHRvLCBvciByZW1vdmVkIGZyb20sIHRoYXRcbiAgICogcmVsYXRpb24uXG4gICAqL1xuICBQYXJzZS5PcC5SZWxhdGlvbiA9IFBhcnNlLk9wLl9leHRlbmQoXG4gICAgICAvKiogQGxlbmRzIFBhcnNlLk9wLlJlbGF0aW9uLnByb3RvdHlwZSAqLyB7XG5cbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24oYWRkcywgcmVtb3Zlcykge1xuICAgICAgdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lID0gbnVsbDtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgcG9pbnRlclRvSWQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgICAgIGlmICghb2JqZWN0LmlkKSB7XG4gICAgICAgICAgICB0aHJvdyBcIllvdSBjYW4ndCBhZGQgYW4gdW5zYXZlZCBQYXJzZS5PYmplY3QgdG8gYSByZWxhdGlvbi5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFzZWxmLl90YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHNlbGYuX3RhcmdldENsYXNzTmFtZSA9IG9iamVjdC5jbGFzc05hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzZWxmLl90YXJnZXRDbGFzc05hbWUgIT09IG9iamVjdC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHRocm93IFwiVHJpZWQgdG8gY3JlYXRlIGEgUGFyc2UuUmVsYXRpb24gd2l0aCAyIGRpZmZlcmVudCB0eXBlczogXCIgK1xuICAgICAgICAgICAgICAgICAgc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lICsgXCIgYW5kIFwiICsgb2JqZWN0LmNsYXNzTmFtZSArIFwiLlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gb2JqZWN0LmlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnJlbGF0aW9uc1RvQWRkID0gXy51bmlxKF8ubWFwKGFkZHMsIHBvaW50ZXJUb0lkKSk7XG4gICAgICB0aGlzLnJlbGF0aW9uc1RvUmVtb3ZlID0gXy51bmlxKF8ubWFwKHJlbW92ZXMsIHBvaW50ZXJUb0lkKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgdW5mZXRjaGVkIFBhcnNlLk9iamVjdCB0aGF0IGFyZSBiZWluZyBhZGRlZCB0byB0aGVcbiAgICAgKiByZWxhdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBhZGRlZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gXy5tYXAodGhpcy5yZWxhdGlvbnNUb0FkZCwgZnVuY3Rpb24ob2JqZWN0SWQpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKHNlbGYuX3RhcmdldENsYXNzTmFtZSk7XG4gICAgICAgIG9iamVjdC5pZCA9IG9iamVjdElkO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgdW5mZXRjaGVkIFBhcnNlLk9iamVjdCB0aGF0IGFyZSBiZWluZyByZW1vdmVkIGZyb21cbiAgICAgKiB0aGUgcmVsYXRpb24uXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gXy5tYXAodGhpcy5yZWxhdGlvbnNUb1JlbW92ZSwgZnVuY3Rpb24ob2JqZWN0SWQpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKHNlbGYuX3RhcmdldENsYXNzTmFtZSk7XG4gICAgICAgIG9iamVjdC5pZCA9IG9iamVjdElkO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhZGRzID0gbnVsbDtcbiAgICAgIHZhciByZW1vdmVzID0gbnVsbDtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBpZFRvUG9pbnRlciA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiB7IF9fdHlwZTogJ1BvaW50ZXInLFxuICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IHNlbGYuX3RhcmdldENsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgb2JqZWN0SWQ6IGlkIH07XG4gICAgICB9O1xuICAgICAgdmFyIHBvaW50ZXJzID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnJlbGF0aW9uc1RvQWRkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcG9pbnRlcnMgPSBfLm1hcCh0aGlzLnJlbGF0aW9uc1RvQWRkLCBpZFRvUG9pbnRlcik7XG4gICAgICAgIGFkZHMgPSB7IFwiX19vcFwiOiBcIkFkZFJlbGF0aW9uXCIsIFwib2JqZWN0c1wiOiBwb2ludGVycyB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZWxhdGlvbnNUb1JlbW92ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBvaW50ZXJzID0gXy5tYXAodGhpcy5yZWxhdGlvbnNUb1JlbW92ZSwgaWRUb1BvaW50ZXIpO1xuICAgICAgICByZW1vdmVzID0geyBcIl9fb3BcIjogXCJSZW1vdmVSZWxhdGlvblwiLCBcIm9iamVjdHNcIjogcG9pbnRlcnMgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFkZHMgJiYgcmVtb3Zlcykge1xuICAgICAgICByZXR1cm4geyBcIl9fb3BcIjogXCJCYXRjaFwiLCBcIm9wc1wiOiBbYWRkcywgcmVtb3Zlc119O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWRkcyB8fCByZW1vdmVzIHx8IHt9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlVuc2V0KSB7XG4gICAgICAgIHRocm93IFwiWW91IGNhbid0IG1vZGlmeSBhIHJlbGF0aW9uIGFmdGVyIGRlbGV0aW5nIGl0LlwiO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlJlbGF0aW9uKSB7XG4gICAgICAgIGlmIChwcmV2aW91cy5fdGFyZ2V0Q2xhc3NOYW1lICYmXG4gICAgICAgICAgICBwcmV2aW91cy5fdGFyZ2V0Q2xhc3NOYW1lICE9PSB0aGlzLl90YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgICB0aHJvdyBcIlJlbGF0ZWQgb2JqZWN0IG11c3QgYmUgb2YgY2xhc3MgXCIgKyBwcmV2aW91cy5fdGFyZ2V0Q2xhc3NOYW1lICtcbiAgICAgICAgICAgICAgXCIsIGJ1dCBcIiArIHRoaXMuX3RhcmdldENsYXNzTmFtZSArIFwiIHdhcyBwYXNzZWQgaW4uXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld0FkZCA9IF8udW5pb24oXy5kaWZmZXJlbmNlKHByZXZpb3VzLnJlbGF0aW9uc1RvQWRkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbnNUb1JlbW92ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb25zVG9BZGQpO1xuICAgICAgICB2YXIgbmV3UmVtb3ZlID0gXy51bmlvbihfLmRpZmZlcmVuY2UocHJldmlvdXMucmVsYXRpb25zVG9SZW1vdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aW9uc1RvQWRkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbnNUb1JlbW92ZSk7XG5cbiAgICAgICAgdmFyIG5ld1JlbGF0aW9uID0gbmV3IFBhcnNlLk9wLlJlbGF0aW9uKG5ld0FkZCwgbmV3UmVtb3ZlKTtcbiAgICAgICAgbmV3UmVsYXRpb24uX3RhcmdldENsYXNzTmFtZSA9IHRoaXMuX3RhcmdldENsYXNzTmFtZTtcbiAgICAgICAgcmV0dXJuIG5ld1JlbGF0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgXCJPcCBpcyBpbnZhbGlkIGFmdGVyIHByZXZpb3VzIG9wLlwiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlLCBvYmplY3QsIGtleSkge1xuICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICB2YXIgcmVsYXRpb24gPSBuZXcgUGFyc2UuUmVsYXRpb24ob2JqZWN0LCBrZXkpO1xuICAgICAgICByZWxhdGlvbi50YXJnZXRDbGFzc05hbWUgPSB0aGlzLl90YXJnZXRDbGFzc05hbWU7XG4gICAgICB9IGVsc2UgaWYgKG9sZFZhbHVlIGluc3RhbmNlb2YgUGFyc2UuUmVsYXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldENsYXNzTmFtZSkge1xuICAgICAgICAgIGlmIChvbGRWYWx1ZS50YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZS50YXJnZXRDbGFzc05hbWUgIT09IHRoaXMuX3RhcmdldENsYXNzTmFtZSkge1xuICAgICAgICAgICAgICB0aHJvdyBcIlJlbGF0ZWQgb2JqZWN0IG11c3QgYmUgYSBcIiArIG9sZFZhbHVlLnRhcmdldENsYXNzTmFtZSArXG4gICAgICAgICAgICAgICAgICBcIiwgYnV0IGEgXCIgKyB0aGlzLl90YXJnZXRDbGFzc05hbWUgKyBcIiB3YXMgcGFzc2VkIGluLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbGRWYWx1ZS50YXJnZXRDbGFzc05hbWUgPSB0aGlzLl90YXJnZXRDbGFzc05hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvbGRWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJBZGRSZWxhdGlvblwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5SZWxhdGlvbihQYXJzZS5fZGVjb2RlKHVuZGVmaW5lZCwganNvbi5vYmplY3RzKSwgW10pO1xuICB9KTtcbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIlJlbW92ZVJlbGF0aW9uXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlJlbGF0aW9uKFtdLCBQYXJzZS5fZGVjb2RlKHVuZGVmaW5lZCwganNvbi5vYmplY3RzKSk7XG4gIH0pO1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBSZWxhdGlvbiBmb3IgdGhlIGdpdmVuIHBhcmVudCBvYmplY3QgYW5kIGtleS4gVGhpc1xuICAgKiBjb25zdHJ1Y3RvciBzaG91bGQgcmFyZWx5IGJlIHVzZWQgZGlyZWN0bHksIGJ1dCByYXRoZXIgY3JlYXRlZCBieVxuICAgKiBQYXJzZS5PYmplY3QucmVsYXRpb24uXG4gICAqIEBwYXJhbSB7UGFyc2UuT2JqZWN0fSBwYXJlbnQgVGhlIHBhcmVudCBvZiB0aGlzIHJlbGF0aW9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgZm9yIHRoaXMgcmVsYXRpb24gb24gdGhlIHBhcmVudC5cbiAgICogQHNlZSBQYXJzZS5PYmplY3QjcmVsYXRpb25cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPlxuICAgKiBBIGNsYXNzIHRoYXQgaXMgdXNlZCB0byBhY2Nlc3MgYWxsIG9mIHRoZSBjaGlsZHJlbiBvZiBhIG1hbnktdG8tbWFueVxuICAgKiByZWxhdGlvbnNoaXAuICBFYWNoIGluc3RhbmNlIG9mIFBhcnNlLlJlbGF0aW9uIGlzIGFzc29jaWF0ZWQgd2l0aCBhXG4gICAqIHBhcnRpY3VsYXIgcGFyZW50IG9iamVjdCBhbmQga2V5LlxuICAgKiA8L3A+XG4gICAqL1xuICBQYXJzZS5SZWxhdGlvbiA9IGZ1bmN0aW9uKHBhcmVudCwga2V5KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgdGhpcy50YXJnZXRDbGFzc05hbWUgPSBudWxsO1xuICB9O1xuXG4gIFBhcnNlLlJlbGF0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBNYWtlcyBzdXJlIHRoYXQgdGhpcyByZWxhdGlvbiBoYXMgdGhlIHJpZ2h0IHBhcmVudCBhbmQga2V5LlxuICAgICAqL1xuICAgIF9lbnN1cmVQYXJlbnRBbmRLZXk6IGZ1bmN0aW9uKHBhcmVudCwga2V5KSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHRoaXMucGFyZW50IHx8IHBhcmVudDtcbiAgICAgIHRoaXMua2V5ID0gdGhpcy5rZXkgfHwga2V5O1xuICAgICAgaWYgKHRoaXMucGFyZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgICAgdGhyb3cgXCJJbnRlcm5hbCBFcnJvci4gUmVsYXRpb24gcmV0cmlldmVkIGZyb20gdHdvIGRpZmZlcmVudCBPYmplY3RzLlwiO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMua2V5ICE9PSBrZXkpIHtcbiAgICAgICAgdGhyb3cgXCJJbnRlcm5hbCBFcnJvci4gUmVsYXRpb24gcmV0cmlldmVkIGZyb20gdHdvIGRpZmZlcmVudCBrZXlzLlwiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgUGFyc2UuT2JqZWN0IG9yIGFuIGFycmF5IG9mIFBhcnNlLk9iamVjdHMgdG8gdGhlIHJlbGF0aW9uLlxuICAgICAqIEBwYXJhbSB7fSBvYmplY3RzIFRoZSBpdGVtIG9yIGl0ZW1zIHRvIGFkZC5cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIGlmICghXy5pc0FycmF5KG9iamVjdHMpKSB7XG4gICAgICAgIG9iamVjdHMgPSBbb2JqZWN0c107XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGFuZ2UgPSBuZXcgUGFyc2UuT3AuUmVsYXRpb24ob2JqZWN0cywgW10pO1xuICAgICAgdGhpcy5wYXJlbnQuc2V0KHRoaXMua2V5LCBjaGFuZ2UpO1xuICAgICAgdGhpcy50YXJnZXRDbGFzc05hbWUgPSBjaGFuZ2UuX3RhcmdldENsYXNzTmFtZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIFBhcnNlLk9iamVjdCBvciBhbiBhcnJheSBvZiBQYXJzZS5PYmplY3RzIGZyb20gdGhpcyByZWxhdGlvbi5cbiAgICAgKiBAcGFyYW0ge30gb2JqZWN0cyBUaGUgaXRlbSBvciBpdGVtcyB0byByZW1vdmUuXG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihvYmplY3RzKSB7XG4gICAgICBpZiAoIV8uaXNBcnJheShvYmplY3RzKSkge1xuICAgICAgICBvYmplY3RzID0gW29iamVjdHNdO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhbmdlID0gbmV3IFBhcnNlLk9wLlJlbGF0aW9uKFtdLCBvYmplY3RzKTtcbiAgICAgIHRoaXMucGFyZW50LnNldCh0aGlzLmtleSwgY2hhbmdlKTtcbiAgICAgIHRoaXMudGFyZ2V0Q2xhc3NOYW1lID0gY2hhbmdlLl90YXJnZXRDbGFzc05hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9iamVjdCBzdWl0YWJsZSBmb3Igc2F2aW5nIHRvIGRpc2suXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBcIl9fdHlwZVwiOiBcIlJlbGF0aW9uXCIsIFwiY2xhc3NOYW1lXCI6IHRoaXMudGFyZ2V0Q2xhc3NOYW1lIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBQYXJzZS5RdWVyeSB0aGF0IGlzIGxpbWl0ZWQgdG8gb2JqZWN0cyBpbiB0aGlzXG4gICAgICogcmVsYXRpb24uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9XG4gICAgICovXG4gICAgcXVlcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRhcmdldENsYXNzO1xuICAgICAgdmFyIHF1ZXJ5O1xuICAgICAgaWYgKCF0aGlzLnRhcmdldENsYXNzTmFtZSkge1xuICAgICAgICB0YXJnZXRDbGFzcyA9IFBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3ModGhpcy5wYXJlbnQuY2xhc3NOYW1lKTtcbiAgICAgICAgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkodGFyZ2V0Q2xhc3MpO1xuICAgICAgICBxdWVyeS5fZXh0cmFPcHRpb25zLnJlZGlyZWN0Q2xhc3NOYW1lRm9yS2V5ID0gdGhpcy5rZXk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRDbGFzcyA9IFBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3ModGhpcy50YXJnZXRDbGFzc05hbWUpO1xuICAgICAgICBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeSh0YXJnZXRDbGFzcyk7XG4gICAgICB9XG4gICAgICBxdWVyeS5fYWRkQ29uZGl0aW9uKFwiJHJlbGF0ZWRUb1wiLCBcIm9iamVjdFwiLCB0aGlzLnBhcmVudC5fdG9Qb2ludGVyKCkpO1xuICAgICAgcXVlcnkuX2FkZENvbmRpdGlvbihcIiRyZWxhdGVkVG9cIiwgXCJrZXlcIiwgdGhpcy5rZXkpO1xuXG4gICAgICByZXR1cm4gcXVlcnk7XG4gICAgfVxuICB9O1xufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIHdpbmRvdzogZmFsc2UsIHByb2Nlc3M6IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBBIFByb21pc2UgaXMgcmV0dXJuZWQgYnkgYXN5bmMgbWV0aG9kcyBhcyBhIGhvb2sgdG8gcHJvdmlkZSBjYWxsYmFja3MgdG8gYmVcbiAgICogY2FsbGVkIHdoZW4gdGhlIGFzeW5jIHRhc2sgaXMgZnVsZmlsbGVkLlxuICAgKlxuICAgKiA8cD5UeXBpY2FsIHVzYWdlIHdvdWxkIGJlIGxpa2U6PHByZT5cbiAgICogICAgcXVlcnkuZmluZCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgKiAgICAgIHJlc3VsdHNbMF0uc2V0KFwiZm9vXCIsIFwiYmFyXCIpO1xuICAgKiAgICAgIHJldHVybiByZXN1bHRzWzBdLnNhdmVBc3luYygpO1xuICAgKiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgKiAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRlZCBcIiArIHJlc3VsdC5pZCk7XG4gICAqICAgIH0pO1xuICAgKiA8L3ByZT48L3A+XG4gICAqXG4gICAqIEBzZWUgUGFyc2UuUHJvbWlzZS5wcm90b3R5cGUudGhlblxuICAgKiBAY2xhc3NcbiAgICovXG4gIFBhcnNlLlByb21pc2UgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9yZXNvbHZlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3JlamVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MgPSBbXTtcbiAgICB0aGlzLl9yZWplY3RlZENhbGxiYWNrcyA9IFtdO1xuICB9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLlByb21pc2UsIC8qKiBAbGVuZHMgUGFyc2UuUHJvbWlzZSAqLyB7XG5cbiAgICBfaXNQcm9taXNlc0FQbHVzQ29tcGxpYW50OiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZmYgdGhlIGdpdmVuIG9iamVjdCBmdWxmaWxzIHRoZSBQcm9taXNlIGludGVyZmFjZS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzOiBmdW5jdGlvbihwcm9taXNlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZSAmJiBwcm9taXNlLnRoZW4gJiYgXy5pc0Z1bmN0aW9uKHByb21pc2UudGhlbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggYSBnaXZlbiB2YWx1ZS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSB0aGUgbmV3IHByb21pc2UuXG4gICAgICovXG4gICAgYXM6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBwcm9taXNlIHRoYXQgaXMgcmVqZWN0ZWQgd2l0aCBhIGdpdmVuIGVycm9yLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IHRoZSBuZXcgcHJvbWlzZS5cbiAgICAgKi9cbiAgICBlcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICBwcm9taXNlLnJlamVjdC5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBvZiB0aGUgaW5wdXQgcHJvbWlzZXNcbiAgICAgKiBhcmUgcmVzb2x2ZWQuIElmIGFueSBwcm9taXNlIGluIHRoZSBsaXN0IGZhaWxzLCB0aGVuIHRoZSByZXR1cm5lZCBwcm9taXNlXG4gICAgICogd2lsbCBmYWlsIHdpdGggdGhlIGxhc3QgZXJyb3IuIElmIHRoZXkgYWxsIHN1Y2NlZWQsIHRoZW4gdGhlIHJldHVybmVkXG4gICAgICogcHJvbWlzZSB3aWxsIHN1Y2NlZWQsIHdpdGggdGhlIHJlc3VsdHMgYmVpbmcgdGhlIHJlc3VsdHMgb2YgYWxsIHRoZSBpbnB1dFxuICAgICAqIHByb21pc2VzLiBGb3IgZXhhbXBsZTogPHByZT5cbiAgICAgKiAgIHZhciBwMSA9IFBhcnNlLlByb21pc2UuYXMoMSk7XG4gICAgICogICB2YXIgcDIgPSBQYXJzZS5Qcm9taXNlLmFzKDIpO1xuICAgICAqICAgdmFyIHAzID0gUGFyc2UuUHJvbWlzZS5hcygzKTtcbiAgICAgKlxuICAgICAqICAgUGFyc2UuUHJvbWlzZS53aGVuKHAxLCBwMiwgcDMpLnRoZW4oZnVuY3Rpb24ocjEsIHIyLCByMykge1xuICAgICAqICAgICBjb25zb2xlLmxvZyhyMSk7ICAvLyBwcmludHMgMVxuICAgICAqICAgICBjb25zb2xlLmxvZyhyMik7ICAvLyBwcmludHMgMlxuICAgICAqICAgICBjb25zb2xlLmxvZyhyMyk7ICAvLyBwcmludHMgM1xuICAgICAqICAgfSk7PC9wcmU+XG4gICAgICpcbiAgICAgKiBUaGUgaW5wdXQgcHJvbWlzZXMgY2FuIGFsc28gYmUgc3BlY2lmaWVkIGFzIGFuIGFycmF5OiA8cHJlPlxuICAgICAqICAgdmFyIHByb21pc2VzID0gW3AxLCBwMiwgcDNdO1xuICAgICAqICAgUGFyc2UuUHJvbWlzZS53aGVuKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKHIxLCByMiwgcjMpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjEpOyAgLy8gcHJpbnRzIDFcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjIpOyAgLy8gcHJpbnRzIDJcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjMpOyAgLy8gcHJpbnRzIDNcbiAgICAgKiAgIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGEgbGlzdCBvZiBwcm9taXNlcyB0byB3YWl0IGZvci5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSB0aGUgbmV3IHByb21pc2UuXG4gICAgICovXG4gICAgd2hlbjogZnVuY3Rpb24ocHJvbWlzZXMpIHtcbiAgICAgIC8vIEFsbG93IHBhc3NpbmcgaW4gUHJvbWlzZXMgYXMgc2VwYXJhdGUgYXJndW1lbnRzIGluc3RlYWQgb2YgYW4gQXJyYXkuXG4gICAgICB2YXIgb2JqZWN0cztcbiAgICAgIGlmIChwcm9taXNlcyAmJiBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQocHJvbWlzZXMubGVuZ3RoKSkge1xuICAgICAgICBvYmplY3RzID0gYXJndW1lbnRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0cyA9IHByb21pc2VzO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG90YWwgPSBvYmplY3RzLmxlbmd0aDtcbiAgICAgIHZhciBoYWRFcnJvciA9IGZhbHNlO1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgIHJlc3VsdHMubGVuZ3RoID0gb2JqZWN0cy5sZW5ndGg7XG4gICAgICBlcnJvcnMubGVuZ3RoID0gb2JqZWN0cy5sZW5ndGg7XG5cbiAgICAgIGlmICh0b3RhbCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcy5hcHBseSh0aGlzLCByZXN1bHRzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuXG4gICAgICB2YXIgcmVzb2x2ZU9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0b3RhbCA9IHRvdGFsIC0gMTtcbiAgICAgICAgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgICAgICAgaWYgKGhhZEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUuYXBwbHkocHJvbWlzZSwgcmVzdWx0cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCwgaSkge1xuICAgICAgICBpZiAoUGFyc2UuUHJvbWlzZS5pcyhvYmplY3QpKSB7XG4gICAgICAgICAgb2JqZWN0LnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHRzW2ldID0gcmVzdWx0O1xuICAgICAgICAgICAgcmVzb2x2ZU9uZSgpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBlcnJvcnNbaV0gPSBlcnJvcjtcbiAgICAgICAgICAgIGhhZEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlc29sdmVPbmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzW2ldID0gb2JqZWN0O1xuICAgICAgICAgIHJlc29sdmVPbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW5zIHRoZSBnaXZlbiBhc3luY0Z1bmN0aW9uIHJlcGVhdGVkbHksIGFzIGxvbmcgYXMgdGhlIHByZWRpY2F0ZVxuICAgICAqIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUuIFN0b3BzIHJlcGVhdGluZyBpZiBhc3luY0Z1bmN0aW9uIHJldHVybnNcbiAgICAgKiBhIHJlamVjdGVkIHByb21pc2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIHNob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiByZWFkeSB0byBzdG9wLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGFzeW5jRnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIFByb21pc2UuXG4gICAgICovXG4gICAgX2NvbnRpbnVlV2hpbGU6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgYXN5bmNGdW5jdGlvbikge1xuICAgICAgaWYgKHByZWRpY2F0ZSgpKSB7XG4gICAgICAgIHJldHVybiBhc3luY0Z1bmN0aW9uKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5fY29udGludWVXaGlsZShwcmVkaWNhdGUsIGFzeW5jRnVuY3Rpb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKCk7XG4gICAgfVxuICB9KTtcblxuICBfLmV4dGVuZChQYXJzZS5Qcm9taXNlLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBQYXJzZS5Qcm9taXNlLnByb3RvdHlwZSAqLyB7XG5cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGlzIHByb21pc2UgYXMgZnVsZmlsbGVkLCBmaXJpbmcgYW55IGNhbGxiYWNrcyB3YWl0aW5nIG9uIGl0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXN1bHQgdGhlIHJlc3VsdCB0byBwYXNzIHRvIHRoZSBjYWxsYmFja3MuXG4gICAgICovXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICBpZiAodGhpcy5fcmVzb2x2ZWQgfHwgdGhpcy5fcmVqZWN0ZWQpIHtcbiAgICAgICAgdGhyb3cgXCJBIHByb21pc2Ugd2FzIHJlc29sdmVkIGV2ZW4gdGhvdWdoIGl0IGhhZCBhbHJlYWR5IGJlZW4gXCIgK1xuICAgICAgICAgICh0aGlzLl9yZXNvbHZlZCA/IFwicmVzb2x2ZWRcIiA6IFwicmVqZWN0ZWRcIikgKyBcIi5cIjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Jlc29sdmVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IGFyZ3VtZW50cztcbiAgICAgIHZhciByZXN1bHRzID0gYXJndW1lbnRzO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLl9yZXNvbHZlZENhbGxiYWNrcywgZnVuY3Rpb24ocmVzb2x2ZWRDYWxsYmFjaykge1xuICAgICAgICByZXNvbHZlZENhbGxiYWNrLmFwcGx5KHRoaXMsIHJlc3VsdHMpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZXNvbHZlZENhbGxiYWNrcyA9IFtdO1xuICAgICAgdGhpcy5fcmVqZWN0ZWRDYWxsYmFja3MgPSBbXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWFya3MgdGhpcyBwcm9taXNlIGFzIGZ1bGZpbGxlZCwgZmlyaW5nIGFueSBjYWxsYmFja3Mgd2FpdGluZyBvbiBpdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3IgdGhlIGVycm9yIHRvIHBhc3MgdG8gdGhlIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICByZWplY3Q6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBpZiAodGhpcy5fcmVzb2x2ZWQgfHwgdGhpcy5fcmVqZWN0ZWQpIHtcbiAgICAgICAgdGhyb3cgXCJBIHByb21pc2Ugd2FzIHJlamVjdGVkIGV2ZW4gdGhvdWdoIGl0IGhhZCBhbHJlYWR5IGJlZW4gXCIgK1xuICAgICAgICAgICh0aGlzLl9yZXNvbHZlZCA/IFwicmVzb2x2ZWRcIiA6IFwicmVqZWN0ZWRcIikgKyBcIi5cIjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3JlamVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2Vycm9yID0gZXJyb3I7XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMuX3JlamVjdGVkQ2FsbGJhY2tzLCBmdW5jdGlvbihyZWplY3RlZENhbGxiYWNrKSB7XG4gICAgICAgIHJlamVjdGVkQ2FsbGJhY2soZXJyb3IpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZXNvbHZlZENhbGxiYWNrcyA9IFtdO1xuICAgICAgdGhpcy5fcmVqZWN0ZWRDYWxsYmFja3MgPSBbXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkcyBjYWxsYmFja3MgdG8gYmUgY2FsbGVkIHdoZW4gdGhpcyBwcm9taXNlIGlzIGZ1bGZpbGxlZC4gUmV0dXJucyBhIG5ld1xuICAgICAqIFByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZSBjYWxsYmFjayBpcyBjb21wbGV0ZS4gSXQgYWxsb3dzXG4gICAgICogY2hhaW5pbmcuIElmIHRoZSBjYWxsYmFjayBpdHNlbGYgcmV0dXJucyBhIFByb21pc2UsIHRoZW4gdGhlIG9uZSByZXR1cm5lZFxuICAgICAqIGJ5IFwidGhlblwiIHdpbGwgbm90IGJlIGZ1bGZpbGxlZCB1bnRpbCB0aGF0IG9uZSByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcbiAgICAgKiBpcyBmdWxmaWxsZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZWRDYWxsYmFjayBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoaXNcbiAgICAgKiBQcm9taXNlIGlzIHJlc29sdmVkLiBPbmNlIHRoZSBjYWxsYmFjayBpcyBjb21wbGV0ZSwgdGhlbiB0aGUgUHJvbWlzZVxuICAgICAqIHJldHVybmVkIGJ5IFwidGhlblwiIHdpbGwgYWxzbyBiZSBmdWxmaWxsZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWRDYWxsYmFjayBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoaXNcbiAgICAgKiBQcm9taXNlIGlzIHJlamVjdGVkIHdpdGggYW4gZXJyb3IuIE9uY2UgdGhlIGNhbGxiYWNrIGlzIGNvbXBsZXRlLCB0aGVuXG4gICAgICogdGhlIHByb21pc2UgcmV0dXJuZWQgYnkgXCJ0aGVuXCIgd2l0aCBiZSByZXNvbHZlZCBzdWNjZXNzZnVsbHkuIElmXG4gICAgICogcmVqZWN0ZWRDYWxsYmFjayBpcyBudWxsLCBvciBpdCByZXR1cm5zIGEgcmVqZWN0ZWQgUHJvbWlzZSwgdGhlbiB0aGVcbiAgICAgKiBQcm9taXNlIHJldHVybmVkIGJ5IFwidGhlblwiIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGF0IGVycm9yLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgbmV3IFByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCBhZnRlciB0aGlzXG4gICAgICogUHJvbWlzZSBpcyBmdWxmaWxsZWQgYW5kIGVpdGhlciBjYWxsYmFjayBoYXMgY29tcGxldGVkLiBJZiB0aGUgY2FsbGJhY2tcbiAgICAgKiByZXR1cm5lZCBhIFByb21pc2UsIHRoZW4gdGhpcyBQcm9taXNlIHdpbGwgbm90IGJlIGZ1bGZpbGxlZCB1bnRpbCB0aGF0XG4gICAgICogb25lIGlzLlxuICAgICAqL1xuICAgIHRoZW46IGZ1bmN0aW9uKHJlc29sdmVkQ2FsbGJhY2ssIHJlamVjdGVkQ2FsbGJhY2spIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcblxuICAgICAgdmFyIHdyYXBwZWRSZXNvbHZlZENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBhcmd1bWVudHM7XG4gICAgICAgIGlmIChyZXNvbHZlZENhbGxiYWNrKSB7XG4gICAgICAgICAgaWYgKFBhcnNlLlByb21pc2UuX2lzUHJvbWlzZXNBUGx1c0NvbXBsaWFudCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gW3Jlc29sdmVkQ2FsbGJhY2suYXBwbHkodGhpcywgcmVzdWx0KV07XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IFtQYXJzZS5Qcm9taXNlLmVycm9yKGUpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gW3Jlc29sdmVkQ2FsbGJhY2suYXBwbHkodGhpcywgcmVzdWx0KV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAxICYmIFBhcnNlLlByb21pc2UuaXMocmVzdWx0WzBdKSkge1xuICAgICAgICAgIHJlc3VsdFswXS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlLnJlc29sdmUuYXBwbHkocHJvbWlzZSwgcmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHdyYXBwZWRSZWplY3RlZENhbGxiYWNrID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBpZiAocmVqZWN0ZWRDYWxsYmFjaykge1xuICAgICAgICAgIGlmIChQYXJzZS5Qcm9taXNlLl9pc1Byb21pc2VzQVBsdXNDb21wbGlhbnQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IFtyZWplY3RlZENhbGxiYWNrKGVycm9yKV07XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IFtQYXJzZS5Qcm9taXNlLmVycm9yKGUpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gW3JlamVjdGVkQ2FsbGJhY2soZXJyb3IpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEgJiYgUGFyc2UuUHJvbWlzZS5pcyhyZXN1bHRbMF0pKSB7XG4gICAgICAgICAgICByZXN1bHRbMF0udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKFBhcnNlLlByb21pc2UuX2lzUHJvbWlzZXNBUGx1c0NvbXBsaWFudCkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlc29sdmUuYXBwbHkocHJvbWlzZSwgcmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVqZWN0KHJlc3VsdFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHJ1bkxhdGVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgICBmdW5jLmNhbGwoKTtcbiAgICAgIH07XG4gICAgICBpZiAoUGFyc2UuUHJvbWlzZS5faXNQcm9taXNlc0FQbHVzQ29tcGxpYW50KSB7XG4gICAgICAgIGlmICh0eXBlb2Yod2luZG93KSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnNldFRpbWVvdXQpIHtcbiAgICAgICAgICBydW5MYXRlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmMsIDApO1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKHByb2Nlc3MpICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLm5leHRUaWNrKSB7XG4gICAgICAgICAgcnVuTGF0ZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHRoaXMuX3Jlc29sdmVkKSB7XG4gICAgICAgIHJ1bkxhdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdyYXBwZWRSZXNvbHZlZENhbGxiYWNrLmFwcGx5KHNlbGYsIHNlbGYuX3Jlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9yZWplY3RlZCkge1xuICAgICAgICBydW5MYXRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICB3cmFwcGVkUmVqZWN0ZWRDYWxsYmFjayhzZWxmLl9lcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MucHVzaCh3cmFwcGVkUmVzb2x2ZWRDYWxsYmFjayk7XG4gICAgICAgIHRoaXMuX3JlamVjdGVkQ2FsbGJhY2tzLnB1c2god3JhcHBlZFJlamVjdGVkQ2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGhhbmRsZXJzIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBwcm9taXNlIFxuICAgICAqIGlzIGVpdGhlciByZXNvbHZlZCBvciByZWplY3RlZFxuICAgICAqL1xuICAgIGFsd2F5czogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4oY2FsbGJhY2ssIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGhhbmRsZXJzIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBQcm9taXNlIG9iamVjdCBpcyByZXNvbHZlZFxuICAgICAqL1xuICAgIGRvbmU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGhhbmRsZXJzIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBQcm9taXNlIG9iamVjdCBpcyByZWplY3RlZFxuICAgICAqL1xuICAgIGZhaWw6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBnaXZlbiBjYWxsYmFja3MgYWZ0ZXIgdGhpcyBwcm9taXNlIGlzIGZ1bGZpbGxlZC5cbiAgICAgKiBAcGFyYW0gb3B0aW9uc09yQ2FsbGJhY2sge30gQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIGNhbGxiYWNrLCBvciBhXG4gICAgICogY2FsbGJhY2sgZnVuY3Rpb24uIElmIHRoaXMgaXMgYW4gb3B0aW9ucyBvYmplY3QgYW5kIGNvbnRhaW5zIGEgXCJtb2RlbFwiXG4gICAgICogYXR0cmlidXRlcywgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byBlcnJvciBjYWxsYmFja3MgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LlxuICAgICAqIEBwYXJhbSBtb2RlbCB7fSBJZiB0cnV0aHksIHRoaXMgd2lsbCBiZSBwYXNzZWQgYXMgdGhlIGZpcnN0IHJlc3VsdCBvZlxuICAgICAqIGVycm9yIGNhbGxiYWNrcy4gVGhpcyBpcyBmb3IgQmFja2JvbmUtY29tcGF0YWJpbGl0eS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIGFmdGVyIHRoZVxuICAgICAqIGNhbGxiYWNrcyBhcmUgcnVuLCB3aXRoIHRoZSBzYW1lIHJlc3VsdCBhcyB0aGlzLlxuICAgICAqL1xuICAgIF90aGVuUnVuQ2FsbGJhY2tzOiBmdW5jdGlvbihvcHRpb25zT3JDYWxsYmFjaywgbW9kZWwpIHtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zT3JDYWxsYmFjaykpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gb3B0aW9uc09yQ2FsbGJhY2s7XG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBjYWxsYmFjayhyZXN1bHQsIG51bGwpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucyA9IF8uY2xvbmUob3B0aW9uc09yQ2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlbCkge1xuICAgICAgICAgIC8vIFdoZW4gdGhlcmUncyBubyBjYWxsYmFjaywgYSBzeW5jIGV2ZW50IHNob3VsZCBiZSB0cmlnZ2VyZWQuXG4gICAgICAgICAgbW9kZWwudHJpZ2dlcignc3luYycsIG1vZGVsLCByZXN1bHQsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzLmFwcGx5KFBhcnNlLlByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgIGlmICghXy5pc1VuZGVmaW5lZChtb2RlbCkpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IobW9kZWwsIGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0aW9ucy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1vZGVsKSB7XG4gICAgICAgICAgLy8gV2hlbiB0aGVyZSdzIG5vIGVycm9yIGNhbGxiYWNrLCBhbiBlcnJvciBldmVudCBzaG91bGQgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgIG1vZGVsLnRyaWdnZXIoJ2Vycm9yJywgbW9kZWwsIGVycm9yLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBCeSBleHBsaWNpdGx5IHJldHVybmluZyBhIHJlamVjdGVkIFByb21pc2UsIHRoaXMgd2lsbCB3b3JrIHdpdGhcbiAgICAgICAgLy8gZWl0aGVyIGpRdWVyeSBvciBQcm9taXNlcy9BIHNlbWFudGljcy5cbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBjYWxsZWQgcmVnYXJkbGVzcyBvZiB3aGV0aGVyXG4gICAgICogdGhpcyBwcm9taXNlIGZhaWxlZCBvciBzdWNjZWVkZWQuIFRoZSBjYWxsYmFjayB3aWxsIGJlIGdpdmVuIGVpdGhlciB0aGVcbiAgICAgKiBhcnJheSBvZiByZXN1bHRzIGZvciBpdHMgZmlyc3QgYXJndW1lbnQsIG9yIHRoZSBlcnJvciBhcyBpdHMgc2Vjb25kLFxuICAgICAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoaXMgUHJvbWlzZSB3YXMgcmVqZWN0ZWQgb3IgcmVzb2x2ZWQuIFJldHVybnMgYVxuICAgICAqIG5ldyBQcm9taXNlLCBsaWtlIFwidGhlblwiIHdvdWxkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnRpbnVhdGlvbiB0aGUgY2FsbGJhY2suXG4gICAgICovXG4gICAgX2NvbnRpbnVlV2l0aDogZnVuY3Rpb24oY29udGludWF0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29udGludWF0aW9uKGFyZ3VtZW50cywgbnVsbCk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZXR1cm4gY29udGludWF0aW9uKG51bGwsIGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9KTtcblxufSh0aGlzKSk7XG5cbi8qanNoaW50IGJpdHdpc2U6ZmFsc2UgKi8vKmdsb2JhbCBGaWxlUmVhZGVyOiB0cnVlLCBGaWxlOiB0cnVlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIHZhciBiNjREaWdpdCA9IGZ1bmN0aW9uKG51bWJlcikge1xuICAgIGlmIChudW1iZXIgPCAyNikge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBudW1iZXIpO1xuICAgIH1cbiAgICBpZiAobnVtYmVyIDwgNTIpIHtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgKG51bWJlciAtIDI2KSk7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPCA2Mikge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoNDggKyAobnVtYmVyIC0gNTIpKTtcbiAgICB9XG4gICAgaWYgKG51bWJlciA9PT0gNjIpIHtcbiAgICAgIHJldHVybiBcIitcIjtcbiAgICB9XG4gICAgaWYgKG51bWJlciA9PT0gNjMpIHtcbiAgICAgIHJldHVybiBcIi9cIjtcbiAgICB9XG4gICAgdGhyb3cgXCJUcmllZCB0byBlbmNvZGUgbGFyZ2UgZGlnaXQgXCIgKyBudW1iZXIgKyBcIiBpbiBiYXNlNjQuXCI7XG4gIH07XG5cbiAgdmFyIGVuY29kZUJhc2U2NCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGNodW5rcyA9IFtdO1xuICAgIGNodW5rcy5sZW5ndGggPSBNYXRoLmNlaWwoYXJyYXkubGVuZ3RoIC8gMyk7XG4gICAgXy50aW1lcyhjaHVua3MubGVuZ3RoLCBmdW5jdGlvbihpKSB7XG4gICAgICB2YXIgYjEgPSBhcnJheVtpICogM107XG4gICAgICB2YXIgYjIgPSBhcnJheVtpICogMyArIDFdIHx8IDA7XG4gICAgICB2YXIgYjMgPSBhcnJheVtpICogMyArIDJdIHx8IDA7XG5cbiAgICAgIHZhciBoYXMyID0gKGkgKiAzICsgMSkgPCBhcnJheS5sZW5ndGg7XG4gICAgICB2YXIgaGFzMyA9IChpICogMyArIDIpIDwgYXJyYXkubGVuZ3RoO1xuXG4gICAgICBjaHVua3NbaV0gPSBbXG4gICAgICAgIGI2NERpZ2l0KChiMSA+PiAyKSAmIDB4M0YpLFxuICAgICAgICBiNjREaWdpdCgoKGIxIDw8IDQpICYgMHgzMCkgfCAoKGIyID4+IDQpICYgMHgwRikpLFxuICAgICAgICBoYXMyID8gYjY0RGlnaXQoKChiMiA8PCAyKSAmIDB4M0MpIHwgKChiMyA+PiA2KSAmIDB4MDMpKSA6IFwiPVwiLFxuICAgICAgICBoYXMzID8gYjY0RGlnaXQoYjMgJiAweDNGKSA6IFwiPVwiXG4gICAgICBdLmpvaW4oXCJcIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNodW5rcy5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIFRPRE8oa2xpbXQpOiBNb3ZlIHRoaXMgbGlzdCB0byB0aGUgc2VydmVyLlxuICAvLyBBIGxpc3Qgb2YgZmlsZSBleHRlbnNpb25zIHRvIG1pbWUgdHlwZXMgYXMgZm91bmQgaGVyZTpcbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81ODUxMC91c2luZy1uZXQtaG93LWNhbi15b3UtZmluZC10aGUtXG4gIC8vICAgICBtaW1lLXR5cGUtb2YtYS1maWxlLWJhc2VkLW9uLXRoZS1maWxlLXNpZ25hdHVyZVxuICB2YXIgbWltZVR5cGVzID0ge1xuICAgIGFpOiBcImFwcGxpY2F0aW9uL3Bvc3RzY3JpcHRcIixcbiAgICBhaWY6IFwiYXVkaW8veC1haWZmXCIsXG4gICAgYWlmYzogXCJhdWRpby94LWFpZmZcIixcbiAgICBhaWZmOiBcImF1ZGlvL3gtYWlmZlwiLFxuICAgIGFzYzogXCJ0ZXh0L3BsYWluXCIsXG4gICAgYXRvbTogXCJhcHBsaWNhdGlvbi9hdG9tK3htbFwiLFxuICAgIGF1OiBcImF1ZGlvL2Jhc2ljXCIsXG4gICAgYXZpOiBcInZpZGVvL3gtbXN2aWRlb1wiLFxuICAgIGJjcGlvOiBcImFwcGxpY2F0aW9uL3gtYmNwaW9cIixcbiAgICBiaW46IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgYm1wOiBcImltYWdlL2JtcFwiLFxuICAgIGNkZjogXCJhcHBsaWNhdGlvbi94LW5ldGNkZlwiLFxuICAgIGNnbTogXCJpbWFnZS9jZ21cIixcbiAgICBcImNsYXNzXCI6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgY3BpbzogXCJhcHBsaWNhdGlvbi94LWNwaW9cIixcbiAgICBjcHQ6IFwiYXBwbGljYXRpb24vbWFjLWNvbXBhY3Rwcm9cIixcbiAgICBjc2g6IFwiYXBwbGljYXRpb24veC1jc2hcIixcbiAgICBjc3M6IFwidGV4dC9jc3NcIixcbiAgICBkY3I6IFwiYXBwbGljYXRpb24veC1kaXJlY3RvclwiLFxuICAgIGRpZjogXCJ2aWRlby94LWR2XCIsXG4gICAgZGlyOiBcImFwcGxpY2F0aW9uL3gtZGlyZWN0b3JcIixcbiAgICBkanY6IFwiaW1hZ2Uvdm5kLmRqdnVcIixcbiAgICBkanZ1OiBcImltYWdlL3ZuZC5kanZ1XCIsXG4gICAgZGxsOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIGRtZzogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBkbXM6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgZG9jOiBcImFwcGxpY2F0aW9uL21zd29yZFwiLFxuICAgIGRvY3g6IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuXCIgK1xuICAgICAgICAgIFwiZG9jdW1lbnRcIixcbiAgICBkb3R4OiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLlwiICtcbiAgICAgICAgICBcInRlbXBsYXRlXCIsXG4gICAgZG9jbTogXCJhcHBsaWNhdGlvbi92bmQubXMtd29yZC5kb2N1bWVudC5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICBkb3RtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLnRlbXBsYXRlLm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIGR0ZDogXCJhcHBsaWNhdGlvbi94bWwtZHRkXCIsXG4gICAgZHY6IFwidmlkZW8veC1kdlwiLFxuICAgIGR2aTogXCJhcHBsaWNhdGlvbi94LWR2aVwiLFxuICAgIGR4cjogXCJhcHBsaWNhdGlvbi94LWRpcmVjdG9yXCIsXG4gICAgZXBzOiBcImFwcGxpY2F0aW9uL3Bvc3RzY3JpcHRcIixcbiAgICBldHg6IFwidGV4dC94LXNldGV4dFwiLFxuICAgIGV4ZTogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBlejogXCJhcHBsaWNhdGlvbi9hbmRyZXctaW5zZXRcIixcbiAgICBnaWY6IFwiaW1hZ2UvZ2lmXCIsXG4gICAgZ3JhbTogXCJhcHBsaWNhdGlvbi9zcmdzXCIsXG4gICAgZ3J4bWw6IFwiYXBwbGljYXRpb24vc3Jncyt4bWxcIixcbiAgICBndGFyOiBcImFwcGxpY2F0aW9uL3gtZ3RhclwiLFxuICAgIGhkZjogXCJhcHBsaWNhdGlvbi94LWhkZlwiLFxuICAgIGhxeDogXCJhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDBcIixcbiAgICBodG06IFwidGV4dC9odG1sXCIsXG4gICAgaHRtbDogXCJ0ZXh0L2h0bWxcIixcbiAgICBpY2U6IFwieC1jb25mZXJlbmNlL3gtY29vbHRhbGtcIixcbiAgICBpY286IFwiaW1hZ2UveC1pY29uXCIsXG4gICAgaWNzOiBcInRleHQvY2FsZW5kYXJcIixcbiAgICBpZWY6IFwiaW1hZ2UvaWVmXCIsXG4gICAgaWZiOiBcInRleHQvY2FsZW5kYXJcIixcbiAgICBpZ2VzOiBcIm1vZGVsL2lnZXNcIixcbiAgICBpZ3M6IFwibW9kZWwvaWdlc1wiLFxuICAgIGpubHA6IFwiYXBwbGljYXRpb24veC1qYXZhLWpubHAtZmlsZVwiLFxuICAgIGpwMjogXCJpbWFnZS9qcDJcIixcbiAgICBqcGU6IFwiaW1hZ2UvanBlZ1wiLFxuICAgIGpwZWc6IFwiaW1hZ2UvanBlZ1wiLFxuICAgIGpwZzogXCJpbWFnZS9qcGVnXCIsXG4gICAganM6IFwiYXBwbGljYXRpb24veC1qYXZhc2NyaXB0XCIsXG4gICAga2FyOiBcImF1ZGlvL21pZGlcIixcbiAgICBsYXRleDogXCJhcHBsaWNhdGlvbi94LWxhdGV4XCIsXG4gICAgbGhhOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIGx6aDogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBtM3U6IFwiYXVkaW8veC1tcGVndXJsXCIsXG4gICAgbTRhOiBcImF1ZGlvL21wNGEtbGF0bVwiLFxuICAgIG00YjogXCJhdWRpby9tcDRhLWxhdG1cIixcbiAgICBtNHA6IFwiYXVkaW8vbXA0YS1sYXRtXCIsXG4gICAgbTR1OiBcInZpZGVvL3ZuZC5tcGVndXJsXCIsXG4gICAgbTR2OiBcInZpZGVvL3gtbTR2XCIsXG4gICAgbWFjOiBcImltYWdlL3gtbWFjcGFpbnRcIixcbiAgICBtYW46IFwiYXBwbGljYXRpb24veC10cm9mZi1tYW5cIixcbiAgICBtYXRobWw6IFwiYXBwbGljYXRpb24vbWF0aG1sK3htbFwiLFxuICAgIG1lOiBcImFwcGxpY2F0aW9uL3gtdHJvZmYtbWVcIixcbiAgICBtZXNoOiBcIm1vZGVsL21lc2hcIixcbiAgICBtaWQ6IFwiYXVkaW8vbWlkaVwiLFxuICAgIG1pZGk6IFwiYXVkaW8vbWlkaVwiLFxuICAgIG1pZjogXCJhcHBsaWNhdGlvbi92bmQubWlmXCIsXG4gICAgbW92OiBcInZpZGVvL3F1aWNrdGltZVwiLFxuICAgIG1vdmllOiBcInZpZGVvL3gtc2dpLW1vdmllXCIsXG4gICAgbXAyOiBcImF1ZGlvL21wZWdcIixcbiAgICBtcDM6IFwiYXVkaW8vbXBlZ1wiLFxuICAgIG1wNDogXCJ2aWRlby9tcDRcIixcbiAgICBtcGU6IFwidmlkZW8vbXBlZ1wiLFxuICAgIG1wZWc6IFwidmlkZW8vbXBlZ1wiLFxuICAgIG1wZzogXCJ2aWRlby9tcGVnXCIsXG4gICAgbXBnYTogXCJhdWRpby9tcGVnXCIsXG4gICAgbXM6IFwiYXBwbGljYXRpb24veC10cm9mZi1tc1wiLFxuICAgIG1zaDogXCJtb2RlbC9tZXNoXCIsXG4gICAgbXh1OiBcInZpZGVvL3ZuZC5tcGVndXJsXCIsXG4gICAgbmM6IFwiYXBwbGljYXRpb24veC1uZXRjZGZcIixcbiAgICBvZGE6IFwiYXBwbGljYXRpb24vb2RhXCIsXG4gICAgb2dnOiBcImFwcGxpY2F0aW9uL29nZ1wiLFxuICAgIHBibTogXCJpbWFnZS94LXBvcnRhYmxlLWJpdG1hcFwiLFxuICAgIHBjdDogXCJpbWFnZS9waWN0XCIsXG4gICAgcGRiOiBcImNoZW1pY2FsL3gtcGRiXCIsXG4gICAgcGRmOiBcImFwcGxpY2F0aW9uL3BkZlwiLFxuICAgIHBnbTogXCJpbWFnZS94LXBvcnRhYmxlLWdyYXltYXBcIixcbiAgICBwZ246IFwiYXBwbGljYXRpb24veC1jaGVzcy1wZ25cIixcbiAgICBwaWM6IFwiaW1hZ2UvcGljdFwiLFxuICAgIHBpY3Q6IFwiaW1hZ2UvcGljdFwiLFxuICAgIHBuZzogXCJpbWFnZS9wbmdcIiwgXG4gICAgcG5tOiBcImltYWdlL3gtcG9ydGFibGUtYW55bWFwXCIsXG4gICAgcG50OiBcImltYWdlL3gtbWFjcGFpbnRcIixcbiAgICBwbnRnOiBcImltYWdlL3gtbWFjcGFpbnRcIixcbiAgICBwcG06IFwiaW1hZ2UveC1wb3J0YWJsZS1waXhtYXBcIixcbiAgICBwcHQ6IFwiYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnRcIixcbiAgICBwcHR4OiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5cIiArXG4gICAgICAgICAgXCJwcmVzZW50YXRpb25cIixcbiAgICBwb3R4OiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5cIiArXG4gICAgICAgICAgXCJ0ZW1wbGF0ZVwiLFxuICAgIHBwc3g6IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLlwiICtcbiAgICAgICAgICBcInNsaWRlc2hvd1wiLFxuICAgIHBwYW06IFwiYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuYWRkaW4ubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgcHB0bTogXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5wcmVzZW50YXRpb24ubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgcG90bTogXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC50ZW1wbGF0ZS5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICBwcHNtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnNsaWRlc2hvdy5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICBwczogXCJhcHBsaWNhdGlvbi9wb3N0c2NyaXB0XCIsXG4gICAgcXQ6IFwidmlkZW8vcXVpY2t0aW1lXCIsXG4gICAgcXRpOiBcImltYWdlL3gtcXVpY2t0aW1lXCIsXG4gICAgcXRpZjogXCJpbWFnZS94LXF1aWNrdGltZVwiLFxuICAgIHJhOiBcImF1ZGlvL3gtcG4tcmVhbGF1ZGlvXCIsXG4gICAgcmFtOiBcImF1ZGlvL3gtcG4tcmVhbGF1ZGlvXCIsXG4gICAgcmFzOiBcImltYWdlL3gtY211LXJhc3RlclwiLFxuICAgIHJkZjogXCJhcHBsaWNhdGlvbi9yZGYreG1sXCIsXG4gICAgcmdiOiBcImltYWdlL3gtcmdiXCIsXG4gICAgcm06IFwiYXBwbGljYXRpb24vdm5kLnJuLXJlYWxtZWRpYVwiLFxuICAgIHJvZmY6IFwiYXBwbGljYXRpb24veC10cm9mZlwiLFxuICAgIHJ0ZjogXCJ0ZXh0L3J0ZlwiLFxuICAgIHJ0eDogXCJ0ZXh0L3JpY2h0ZXh0XCIsXG4gICAgc2dtOiBcInRleHQvc2dtbFwiLFxuICAgIHNnbWw6IFwidGV4dC9zZ21sXCIsXG4gICAgc2g6IFwiYXBwbGljYXRpb24veC1zaFwiLFxuICAgIHNoYXI6IFwiYXBwbGljYXRpb24veC1zaGFyXCIsXG4gICAgc2lsbzogXCJtb2RlbC9tZXNoXCIsXG4gICAgc2l0OiBcImFwcGxpY2F0aW9uL3gtc3R1ZmZpdFwiLFxuICAgIHNrZDogXCJhcHBsaWNhdGlvbi94LWtvYW5cIixcbiAgICBza206IFwiYXBwbGljYXRpb24veC1rb2FuXCIsXG4gICAgc2twOiBcImFwcGxpY2F0aW9uL3gta29hblwiLFxuICAgIHNrdDogXCJhcHBsaWNhdGlvbi94LWtvYW5cIixcbiAgICBzbWk6IFwiYXBwbGljYXRpb24vc21pbFwiLFxuICAgIHNtaWw6IFwiYXBwbGljYXRpb24vc21pbFwiLFxuICAgIHNuZDogXCJhdWRpby9iYXNpY1wiLFxuICAgIHNvOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIHNwbDogXCJhcHBsaWNhdGlvbi94LWZ1dHVyZXNwbGFzaFwiLFxuICAgIHNyYzogXCJhcHBsaWNhdGlvbi94LXdhaXMtc291cmNlXCIsXG4gICAgc3Y0Y3BpbzogXCJhcHBsaWNhdGlvbi94LXN2NGNwaW9cIixcbiAgICBzdjRjcmM6IFwiYXBwbGljYXRpb24veC1zdjRjcmNcIixcbiAgICBzdmc6IFwiaW1hZ2Uvc3ZnK3htbFwiLFxuICAgIHN3ZjogXCJhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaFwiLFxuICAgIHQ6IFwiYXBwbGljYXRpb24veC10cm9mZlwiLFxuICAgIHRhcjogXCJhcHBsaWNhdGlvbi94LXRhclwiLFxuICAgIHRjbDogXCJhcHBsaWNhdGlvbi94LXRjbFwiLFxuICAgIHRleDogXCJhcHBsaWNhdGlvbi94LXRleFwiLFxuICAgIHRleGk6IFwiYXBwbGljYXRpb24veC10ZXhpbmZvXCIsXG4gICAgdGV4aW5mbzogXCJhcHBsaWNhdGlvbi94LXRleGluZm9cIixcbiAgICB0aWY6IFwiaW1hZ2UvdGlmZlwiLFxuICAgIHRpZmY6IFwiaW1hZ2UvdGlmZlwiLFxuICAgIHRyOiBcImFwcGxpY2F0aW9uL3gtdHJvZmZcIixcbiAgICB0c3Y6IFwidGV4dC90YWItc2VwYXJhdGVkLXZhbHVlc1wiLFxuICAgIHR4dDogXCJ0ZXh0L3BsYWluXCIsXG4gICAgdXN0YXI6IFwiYXBwbGljYXRpb24veC11c3RhclwiLFxuICAgIHZjZDogXCJhcHBsaWNhdGlvbi94LWNkbGlua1wiLFxuICAgIHZybWw6IFwibW9kZWwvdnJtbFwiLFxuICAgIHZ4bWw6IFwiYXBwbGljYXRpb24vdm9pY2V4bWwreG1sXCIsXG4gICAgd2F2OiBcImF1ZGlvL3gtd2F2XCIsXG4gICAgd2JtcDogXCJpbWFnZS92bmQud2FwLndibXBcIixcbiAgICB3Ym14bDogXCJhcHBsaWNhdGlvbi92bmQud2FwLndieG1sXCIsXG4gICAgd21sOiBcInRleHQvdm5kLndhcC53bWxcIixcbiAgICB3bWxjOiBcImFwcGxpY2F0aW9uL3ZuZC53YXAud21sY1wiLFxuICAgIHdtbHM6IFwidGV4dC92bmQud2FwLndtbHNjcmlwdFwiLFxuICAgIHdtbHNjOiBcImFwcGxpY2F0aW9uL3ZuZC53YXAud21sc2NyaXB0Y1wiLFxuICAgIHdybDogXCJtb2RlbC92cm1sXCIsXG4gICAgeGJtOiBcImltYWdlL3gteGJpdG1hcFwiLFxuICAgIHhodDogXCJhcHBsaWNhdGlvbi94aHRtbCt4bWxcIixcbiAgICB4aHRtbDogXCJhcHBsaWNhdGlvbi94aHRtbCt4bWxcIixcbiAgICB4bHM6IFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsXCIsXG4gICAgeG1sOiBcImFwcGxpY2F0aW9uL3htbFwiLFxuICAgIHhwbTogXCJpbWFnZS94LXhwaXhtYXBcIixcbiAgICB4c2w6IFwiYXBwbGljYXRpb24veG1sXCIsXG4gICAgeGxzeDogXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldFwiLFxuICAgIHhsdHg6IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuXCIgK1xuICAgICAgICAgIFwidGVtcGxhdGVcIixcbiAgICB4bHNtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICB4bHRtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC50ZW1wbGF0ZS5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICB4bGFtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5hZGRpbi5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICB4bHNiOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5iaW5hcnkubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgeHNsdDogXCJhcHBsaWNhdGlvbi94c2x0K3htbFwiLFxuICAgIHh1bDogXCJhcHBsaWNhdGlvbi92bmQubW96aWxsYS54dWwreG1sXCIsXG4gICAgeHdkOiBcImltYWdlL3gteHdpbmRvd2R1bXBcIixcbiAgICB4eXo6IFwiY2hlbWljYWwveC14eXpcIixcbiAgICB6aXA6IFwiYXBwbGljYXRpb24vemlwXCJcbiAgfTtcblxuICAvKipcbiAgICogUmVhZHMgYSBGaWxlIHVzaW5nIGEgRmlsZVJlYWRlci5cbiAgICogQHBhcmFtIGZpbGUge0ZpbGV9IHRoZSBGaWxlIHRvIHJlYWQuXG4gICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9IChvcHRpb25hbCkgdGhlIG1pbWV0eXBlIHRvIG92ZXJyaWRlIHdpdGguXG4gICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgUHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdpdGggYVxuICAgKiAgICAgYmFzZTY0LWVuY29kZWQgc3RyaW5nIG9mIHRoZSBkYXRhIGFuZCBpdHMgbWltZSB0eXBlLlxuICAgKi9cbiAgdmFyIHJlYWRBc3luYyA9IGZ1bmN0aW9uKGZpbGUsIHR5cGUpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG5cbiAgICBpZiAodHlwZW9mKEZpbGVSZWFkZXIpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuRklMRV9SRUFEX0VSUk9SLFxuICAgICAgICAgIFwiQXR0ZW1wdGVkIHRvIHVzZSBhIEZpbGVSZWFkZXIgb24gYW4gdW5zdXBwb3J0ZWQgYnJvd3Nlci5cIikpO1xuICAgIH1cblxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyZWFkZXIucmVhZHlTdGF0ZSAhPT0gMikge1xuICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5GSUxFX1JFQURfRVJST1IsXG4gICAgICAgICAgICBcIkVycm9yIHJlYWRpbmcgZmlsZS5cIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhVVJMID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgIHZhciBtYXRjaGVzID0gL15kYXRhOihbXjtdKik7YmFzZTY0LCguKikkLy5leGVjKGRhdGFVUkwpO1xuICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHByb21pc2UucmVqZWN0KG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLkZJTEVfUkVBRF9FUlJPUixcbiAgICAgICAgICAgIFwiVW5hYmxlIHRvIGludGVycHJldCBkYXRhIFVSTDogXCIgKyBkYXRhVVJMKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS5yZXNvbHZlKG1hdGNoZXNbMl0sIHR5cGUgfHwgbWF0Y2hlc1sxXSk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfTtcblxuICAvKipcbiAgICogQSBQYXJzZS5GaWxlIGlzIGEgbG9jYWwgcmVwcmVzZW50YXRpb24gb2YgYSBmaWxlIHRoYXQgaXMgc2F2ZWQgdG8gdGhlIFBhcnNlXG4gICAqIGNsb3VkLlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gVGhlIGZpbGUncyBuYW1lLiBUaGlzIHdpbGwgYmUgcHJlZml4ZWQgYnkgYSB1bmlxdWVcbiAgICogICAgIHZhbHVlIG9uY2UgdGhlIGZpbGUgaGFzIGZpbmlzaGVkIHNhdmluZy4gVGhlIGZpbGUgbmFtZSBtdXN0IGJlZ2luIHdpdGhcbiAgICogICAgIGFuIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXIsIGFuZCBjb25zaXN0IG9mIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLFxuICAgKiAgICAgcGVyaW9kcywgc3BhY2VzLCB1bmRlcnNjb3Jlcywgb3IgZGFzaGVzLlxuICAgKiBAcGFyYW0gZGF0YSB7QXJyYXl9IFRoZSBkYXRhIGZvciB0aGUgZmlsZSwgYXMgZWl0aGVyOlxuICAgKiAgICAgMS4gYW4gQXJyYXkgb2YgYnl0ZSB2YWx1ZSBOdW1iZXJzLCBvclxuICAgKiAgICAgMi4gYW4gT2JqZWN0IGxpa2UgeyBiYXNlNjQ6IFwiLi4uXCIgfSB3aXRoIGEgYmFzZTY0LWVuY29kZWQgU3RyaW5nLlxuICAgKiAgICAgMy4gYSBGaWxlIG9iamVjdCBzZWxlY3RlZCB3aXRoIGEgZmlsZSB1cGxvYWQgY29udHJvbC4gKDMpIG9ubHkgd29ya3NcbiAgICogICAgICAgIGluIEZpcmVmb3ggMy42KywgU2FmYXJpIDYuMC4yKywgQ2hyb21lIDcrLCBhbmQgSUUgMTArLlxuICAgKiAgICAgICAgRm9yIGV4YW1wbGU6PHByZT5cbiAgICogdmFyIGZpbGVVcGxvYWRDb250cm9sID0gJChcIiNwcm9maWxlUGhvdG9GaWxlVXBsb2FkXCIpWzBdO1xuICAgKiBpZiAoZmlsZVVwbG9hZENvbnRyb2wuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgKiAgIHZhciBmaWxlID0gZmlsZVVwbG9hZENvbnRyb2wuZmlsZXNbMF07XG4gICAqICAgdmFyIG5hbWUgPSBcInBob3RvLmpwZ1wiO1xuICAgKiAgIHZhciBwYXJzZUZpbGUgPSBuZXcgUGFyc2UuRmlsZShuYW1lLCBmaWxlKTtcbiAgICogICBwYXJzZUZpbGUuc2F2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAqICAgICAvLyBUaGUgZmlsZSBoYXMgYmVlbiBzYXZlZCB0byBQYXJzZS5cbiAgICogICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgLy8gVGhlIGZpbGUgZWl0aGVyIGNvdWxkIG5vdCBiZSByZWFkLCBvciBjb3VsZCBub3QgYmUgc2F2ZWQgdG8gUGFyc2UuXG4gICAqICAgfSk7XG4gICAqIH08L3ByZT5cbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gT3B0aW9uYWwgQ29udGVudC1UeXBlIGhlYWRlciB0byB1c2UgZm9yIHRoZSBmaWxlLiBJZlxuICAgKiAgICAgdGhpcyBpcyBvbWl0dGVkLCB0aGUgY29udGVudCB0eXBlIHdpbGwgYmUgaW5mZXJyZWQgZnJvbSB0aGUgbmFtZSdzXG4gICAqICAgICBleHRlbnNpb24uXG4gICAqL1xuICBQYXJzZS5GaWxlID0gZnVuY3Rpb24obmFtZSwgZGF0YSwgdHlwZSkge1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuXG4gICAgLy8gR3Vlc3MgdGhlIGNvbnRlbnQgdHlwZSBmcm9tIHRoZSBleHRlbnNpb24gaWYgd2UgbmVlZCB0by5cbiAgICB2YXIgZXh0ZW5zaW9uID0gL1xcLihbXi5dKikkLy5leGVjKG5hbWUpO1xuICAgIGlmIChleHRlbnNpb24pIHtcbiAgICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvblsxXS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICB2YXIgZ3Vlc3NlZFR5cGUgPSB0eXBlIHx8IG1pbWVUeXBlc1tleHRlbnNpb25dIHx8IFwidGV4dC9wbGFpblwiO1xuXG4gICAgaWYgKF8uaXNBcnJheShkYXRhKSkge1xuICAgICAgdGhpcy5fc291cmNlID0gUGFyc2UuUHJvbWlzZS5hcyhlbmNvZGVCYXNlNjQoZGF0YSksIGd1ZXNzZWRUeXBlKTtcbiAgICB9IGVsc2UgaWYgKGRhdGEgJiYgZGF0YS5iYXNlNjQpIHtcbiAgICAgIC8vIGlmIGl0IGNvbnRhaW5zIGRhdGEgdXJpLCBleHRyYWN0IGJhc2VkNjQgYW5kIHRoZSB0eXBlIG91dCBvZiBpdC5cbiAgICAgIC8qanNsaW50IG1heGxlbjogMTAwMCovXG4gICAgICB2YXIgZGF0YVVyaVJlZ2V4cCA9IC9eZGF0YTooW2EtekEtWl0qXFwvW2EtekEtWisuLV0qKTsoY2hhcnNldD1bYS16QS1aMC05XFwtXFwvXFxzXSosKT9iYXNlNjQsKFxcUyspLztcbiAgICAgIC8qanNsaW50IG1heGxlbjogODAqL1xuXG4gICAgICB2YXIgbWF0Y2hlcyA9IGRhdGFVcmlSZWdleHAuZXhlYyhkYXRhLmJhc2U2NCk7XG4gICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gaWYgZGF0YSBVUkkgd2l0aCBjaGFyc2V0LCB0aGVyZSB3aWxsIGhhdmUgNCBtYXRjaGVzLlxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBQYXJzZS5Qcm9taXNlLmFzKFxuICAgICAgICAgIChtYXRjaGVzLmxlbmd0aCA9PT0gNCA/IG1hdGNoZXNbM10gOiBtYXRjaGVzWzJdKSwgbWF0Y2hlc1sxXVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc291cmNlID0gUGFyc2UuUHJvbWlzZS5hcyhkYXRhLmJhc2U2NCwgZ3Vlc3NlZFR5cGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mKEZpbGUpICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBGaWxlKSB7XG4gICAgICB0aGlzLl9zb3VyY2UgPSByZWFkQXN5bmMoZGF0YSwgdHlwZSk7XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGRhdGEpKSB7XG4gICAgICB0aHJvdyBcIkNyZWF0aW5nIGEgUGFyc2UuRmlsZSBmcm9tIGEgU3RyaW5nIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLlwiO1xuICAgIH1cbiAgfTtcblxuICBQYXJzZS5GaWxlLnByb3RvdHlwZSA9IHtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGZpbGUuIEJlZm9yZSBzYXZlIGlzIGNhbGxlZCwgdGhpcyBpcyB0aGUgZmlsZW5hbWVcbiAgICAgKiBnaXZlbiBieSB0aGUgdXNlci4gQWZ0ZXIgc2F2ZSBpcyBjYWxsZWQsIHRoYXQgbmFtZSBnZXRzIHByZWZpeGVkIHdpdGggYVxuICAgICAqIHVuaXF1ZSBpZGVudGlmaWVyLlxuICAgICAqL1xuICAgIG5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHVybCBvZiB0aGUgZmlsZS4gSXQgaXMgb25seSBhdmFpbGFibGUgYWZ0ZXIgeW91IHNhdmUgdGhlIGZpbGUgb3JcbiAgICAgKiBhZnRlciB5b3UgZ2V0IHRoZSBmaWxlIGZyb20gYSBQYXJzZS5PYmplY3QuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHVybDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTYXZlcyB0aGUgZmlsZSB0byB0aGUgUGFyc2UgY2xvdWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgc2F2ZSBmaW5pc2hlcy5cbiAgICAgKi9cbiAgICBzYXZlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoIXNlbGYuX3ByZXZpb3VzU2F2ZSkge1xuICAgICAgICBzZWxmLl9wcmV2aW91c1NhdmUgPSBzZWxmLl9zb3VyY2UudGhlbihmdW5jdGlvbihiYXNlNjQsIHR5cGUpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGJhc2U2NDogYmFzZTY0LFxuICAgICAgICAgICAgX0NvbnRlbnRUeXBlOiB0eXBlXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICAgICAgcm91dGU6IFwiZmlsZXNcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogc2VsZi5fbmFtZSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgc2VsZi5fbmFtZSA9IHJlc3BvbnNlLm5hbWU7XG4gICAgICAgICAgc2VsZi5fdXJsID0gcmVzcG9uc2UudXJsO1xuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLl9wcmV2aW91c1NhdmUuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG59KHRoaXMpKTtcblxuLy8gUGFyc2UuT2JqZWN0IGlzIGFuYWxvZ291cyB0byB0aGUgSmF2YSBQYXJzZU9iamVjdC5cbi8vIEl0IGFsc28gaW1wbGVtZW50cyB0aGUgc2FtZSBpbnRlcmZhY2UgYXMgYSBCYWNrYm9uZSBtb2RlbC5cbi8vIFRPRE86IG11bHRpcGxlIGRpc3BhdGNoIGZvciBjYWxsYmFja3NcbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgbW9kZWwgd2l0aCBkZWZpbmVkIGF0dHJpYnV0ZXMuIEEgY2xpZW50IGlkIChjaWQpIGlzXG4gICAqIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGFuZCBhc3NpZ25lZCBmb3IgeW91LlxuICAgKlxuICAgKiA8cD5Zb3Ugd29uJ3Qgbm9ybWFsbHkgY2FsbCB0aGlzIG1ldGhvZCBkaXJlY3RseS4gIEl0IGlzIHJlY29tbWVuZGVkIHRoYXRcbiAgICogeW91IHVzZSBhIHN1YmNsYXNzIG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4gaW5zdGVhZCwgY3JlYXRlZCBieSBjYWxsaW5nXG4gICAqIDxjb2RlPmV4dGVuZDwvY29kZT4uPC9wPlxuICAgKlxuICAgKiA8cD5Ib3dldmVyLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byB1c2UgYSBzdWJjbGFzcywgb3IgYXJlbid0IHN1cmUgd2hpY2hcbiAgICogc3ViY2xhc3MgaXMgYXBwcm9wcmlhdGUsIHlvdSBjYW4gdXNlIHRoaXMgZm9ybTo8cHJlPlxuICAgKiAgICAgdmFyIG9iamVjdCA9IG5ldyBQYXJzZS5PYmplY3QoXCJDbGFzc05hbWVcIik7XG4gICAqIDwvcHJlPlxuICAgKiBUaGF0IGlzIGJhc2ljYWxseSBlcXVpdmFsZW50IHRvOjxwcmU+XG4gICAqICAgICB2YXIgTXlDbGFzcyA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJDbGFzc05hbWVcIik7XG4gICAqICAgICB2YXIgb2JqZWN0ID0gbmV3IE15Q2xhc3MoKTtcbiAgICogPC9wcmU+PC9wPlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyBUaGUgaW5pdGlhbCBzZXQgb2YgZGF0YSB0byBzdG9yZSBpbiB0aGUgb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIHNldCBvZiBCYWNrYm9uZS1saWtlIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRoZVxuICAgKiAgICAgb2JqZWN0LiAgVGhlIG9ubHkgb3B0aW9uIGN1cnJlbnRseSBzdXBwb3J0ZWQgaXMgXCJjb2xsZWN0aW9uXCIuXG4gICAqIEBzZWUgUGFyc2UuT2JqZWN0LmV4dGVuZFxuICAgKlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+VGhlIGZ1bmRhbWVudGFsIHVuaXQgb2YgUGFyc2UgZGF0YSwgd2hpY2ggaW1wbGVtZW50cyB0aGUgQmFja2JvbmUgTW9kZWxcbiAgICogaW50ZXJmYWNlLjwvcD5cbiAgICovXG4gIFBhcnNlLk9iamVjdCA9IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcbiAgICAvLyBBbGxvdyBuZXcgUGFyc2UuT2JqZWN0KFwiQ2xhc3NOYW1lXCIpIGFzIGEgc2hvcnRjdXQgdG8gX2NyZWF0ZS5cbiAgICBpZiAoXy5pc1N0cmluZyhhdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgfHwge307XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wYXJzZSkge1xuICAgICAgYXR0cmlidXRlcyA9IHRoaXMucGFyc2UoYXR0cmlidXRlcyk7XG4gICAgfVxuICAgIHZhciBkZWZhdWx0cyA9IFBhcnNlLl9nZXRWYWx1ZSh0aGlzLCAnZGVmYXVsdHMnKTtcbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGF0dHJpYnV0ZXMgPSBfLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmNvbGxlY3Rpb24pIHtcbiAgICAgIHRoaXMuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLl9zZXJ2ZXJEYXRhID0ge307ICAvLyBUaGUgbGFzdCBrbm93biBkYXRhIGZvciB0aGlzIG9iamVjdCBmcm9tIGNsb3VkLlxuICAgIHRoaXMuX29wU2V0UXVldWUgPSBbe31dOyAgLy8gTGlzdCBvZiBzZXRzIG9mIGNoYW5nZXMgdG8gdGhlIGRhdGEuXG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307ICAvLyBUaGUgYmVzdCBlc3RpbWF0ZSBvZiB0aGlzJ3MgY3VycmVudCBkYXRhLlxuXG4gICAgdGhpcy5faGFzaGVkSlNPTiA9IHt9OyAgLy8gSGFzaCBvZiB2YWx1ZXMgb2YgY29udGFpbmVycyBhdCBsYXN0IHNhdmUuXG4gICAgdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLmNpZCA9IF8udW5pcXVlSWQoJ2MnKTtcbiAgICB0aGlzLmNoYW5nZWQgPSB7fTtcbiAgICB0aGlzLl9zaWxlbnQgPSB7fTtcbiAgICB0aGlzLl9wZW5kaW5nID0ge307XG4gICAgaWYgKCF0aGlzLnNldChhdHRyaWJ1dGVzLCB7c2lsZW50OiB0cnVlfSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBhbiBpbnZhbGlkIFBhcnNlLk9iamVjdFwiKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VkID0ge307XG4gICAgdGhpcy5fc2lsZW50ID0ge307XG4gICAgdGhpcy5fcGVuZGluZyA9IHt9O1xuICAgIHRoaXMuX2hhc0RhdGEgPSB0cnVlO1xuICAgIHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoaXMgb2JqZWN0LCB1bmlxdWUgd2l0aGluIGl0cyBjbGFzcy5cbiAgICogQG5hbWUgaWRcbiAgICogQHR5cGUgU3RyaW5nXG4gICAqIEBmaWVsZFxuICAgKiBAbWVtYmVyT2YgUGFyc2UuT2JqZWN0LnByb3RvdHlwZVxuICAgKi9cblxuICAvKipcbiAgICogVGhlIGZpcnN0IHRpbWUgdGhpcyBvYmplY3Qgd2FzIHNhdmVkIG9uIHRoZSBzZXJ2ZXIuXG4gICAqIEBuYW1lIGNyZWF0ZWRBdFxuICAgKiBAdHlwZSBEYXRlXG4gICAqIEBmaWVsZFxuICAgKiBAbWVtYmVyT2YgUGFyc2UuT2JqZWN0LnByb3RvdHlwZVxuICAgKi9cblxuICAvKipcbiAgICogVGhlIGxhc3QgdGltZSB0aGlzIG9iamVjdCB3YXMgdXBkYXRlZCBvbiB0aGUgc2VydmVyLlxuICAgKiBAbmFtZSB1cGRhdGVkQXRcbiAgICogQHR5cGUgRGF0ZVxuICAgKiBAZmllbGRcbiAgICogQG1lbWJlck9mIFBhcnNlLk9iamVjdC5wcm90b3R5cGVcbiAgICovXG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBnaXZlbiBsaXN0IG9mIFBhcnNlLk9iamVjdC5cbiAgICogSWYgYW55IGVycm9yIGlzIGVuY291bnRlcmVkLCBzdG9wcyBhbmQgY2FsbHMgdGhlIGVycm9yIGhhbmRsZXIuXG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgUGFyc2UuT2JqZWN0LnNhdmVBbGwoW29iamVjdDEsIG9iamVjdDIsIC4uLl0sIHtcbiAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICogICAgICAgLy8gQWxsIHRoZSBvYmplY3RzIHdlcmUgc2F2ZWQuXG4gICAqICAgICB9LFxuICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIC8vIEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIHNhdmluZyBvbmUgb2YgdGhlIG9iamVjdHMuXG4gICAqICAgICB9LFxuICAgKiAgIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBIGxpc3Qgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgKiA8L3VsPlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0LnNhdmVBbGwgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fZGVlcFNhdmVBc3luYyhsaXN0LCB7XG4gICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5XG4gICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGdpdmVuIGxpc3Qgb2YgbW9kZWxzIG9uIHRoZSBzZXJ2ZXIgaWYgaXQgd2FzIGFscmVhZHkgcGVyc2lzdGVkLlxuICAgKiBPcHRpbWlzdGljYWxseSByZW1vdmVzIGVhY2ggbW9kZWwgZnJvbSBpdHMgY29sbGVjdGlvbiwgaWYgaXQgaGFzIG9uZS5cbiAgICogSWYgYHdhaXQ6IHRydWVgIGlzIHBhc3NlZCwgd2FpdHMgZm9yIHRoZSBzZXJ2ZXIgdG8gcmVzcG9uZCBiZWZvcmUgcmVtb3ZhbC5cbiAgICpcbiAgICogPHA+VW5saWtlIHNhdmVBbGwsIGlmIGFuIGVycm9yIG9jY3VycyB3aGlsZSBkZWxldGluZyBhbiBpbmRpdmlkdWFsIG1vZGVsLFxuICAgKiB0aGlzIG1ldGhvZCB3aWxsIGNvbnRpbnVlIHRyeWluZyB0byBkZWxldGUgdGhlIHJlc3Qgb2YgdGhlIG1vZGVscyBpZlxuICAgKiBwb3NzaWJsZSwgZXhjZXB0IGluIHRoZSBjYXNlIG9mIGEgZmF0YWwgZXJyb3IgbGlrZSBhIGNvbm5lY3Rpb24gZXJyb3IuXG4gICAqXG4gICAqIDxwPkluIHBhcnRpY3VsYXIsIHRoZSBQYXJzZS5FcnJvciBvYmplY3QgcmV0dXJuZWQgaW4gdGhlIGNhc2Ugb2YgZXJyb3IgbWF5XG4gICAqIGJlIG9uZSBvZiB0d28gdHlwZXM6XG4gICAqXG4gICAqIDx1bD5cbiAgICogICA8bGk+QSBQYXJzZS5FcnJvci5BR0dSRUdBVEVfRVJST1IuIFRoaXMgb2JqZWN0J3MgXCJlcnJvcnNcIiBwcm9wZXJ0eSBpcyBhblxuICAgKiAgICAgICBhcnJheSBvZiBvdGhlciBQYXJzZS5FcnJvciBvYmplY3RzLiBFYWNoIGVycm9yIG9iamVjdCBpbiB0aGlzIGFycmF5XG4gICAqICAgICAgIGhhcyBhbiBcIm9iamVjdFwiIHByb3BlcnR5IHRoYXQgcmVmZXJlbmNlcyB0aGUgb2JqZWN0IHRoYXQgY291bGQgbm90IGJlXG4gICAqICAgICAgIGRlbGV0ZWQgKGZvciBpbnN0YW5jZSwgYmVjYXVzZSB0aGF0IG9iamVjdCBjb3VsZCBub3QgYmUgZm91bmQpLjwvbGk+XG4gICAqICAgPGxpPkEgbm9uLWFnZ3JlZ2F0ZSBQYXJzZS5FcnJvci4gVGhpcyBpbmRpY2F0ZXMgYSBzZXJpb3VzIGVycm9yIHRoYXRcbiAgICogICAgICAgY2F1c2VkIHRoZSBkZWxldGUgb3BlcmF0aW9uIHRvIGJlIGFib3J0ZWQgcGFydHdheSB0aHJvdWdoIChmb3JcbiAgICogICAgICAgaW5zdGFuY2UsIGEgY29ubmVjdGlvbiBmYWlsdXJlIGluIHRoZSBtaWRkbGUgb2YgdGhlIGRlbGV0ZSkuPC9saT5cbiAgICogPC91bD5cbiAgICpcbiAgICogPHByZT5cbiAgICogICBQYXJzZS5PYmplY3QuZGVzdHJveUFsbChbb2JqZWN0MSwgb2JqZWN0MiwgLi4uXSwge1xuICAgKiAgICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAqICAgICAgIC8vIEFsbCB0aGUgb2JqZWN0cyB3ZXJlIGRlbGV0ZWQuXG4gICAqICAgICB9LFxuICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIC8vIEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGRlbGV0aW5nIG9uZSBvciBtb3JlIG9mIHRoZSBvYmplY3RzLlxuICAgKiAgICAgICAvLyBJZiB0aGlzIGlzIGFuIGFnZ3JlZ2F0ZSBlcnJvciwgdGhlbiB3ZSBjYW4gaW5zcGVjdCBlYWNoIGVycm9yXG4gICAqICAgICAgIC8vIG9iamVjdCBpbmRpdmlkdWFsbHkgdG8gZGV0ZXJtaW5lIHRoZSByZWFzb24gd2h5IGEgcGFydGljdWxhclxuICAgKiAgICAgICAvLyBvYmplY3Qgd2FzIG5vdCBkZWxldGVkLlxuICAgKiAgICAgICBpZiAoZXJyb3IuY29kZSA9PSBQYXJzZS5FcnJvci5BR0dSRUdBVEVfRVJST1IpIHtcbiAgICogICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yLmVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgKiAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG4ndCBkZWxldGUgXCIgKyBlcnJvci5lcnJvcnNbaV0ub2JqZWN0LmlkICtcbiAgICogICAgICAgICAgICAgXCJkdWUgdG8gXCIgKyBlcnJvci5lcnJvcnNbaV0ubWVzc2FnZSk7XG4gICAqICAgICAgICAgfVxuICAgKiAgICAgICB9IGVsc2Uge1xuICAgKiAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRlIGFib3J0ZWQgYmVjYXVzZSBvZiBcIiArIGVycm9yLm1lc3NhZ2UpO1xuICAgKiAgICAgICB9XG4gICAqICAgICB9LFxuICAgKiAgIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBIGxpc3Qgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgKiA8L3VsPlxuICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgZGVzdHJveUFsbFxuICAgKiAgICAgY29tcGxldGVzLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0LmRlc3Ryb3lBbGwgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgdHJpZ2dlckRlc3Ryb3kgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIG9iamVjdC50cmlnZ2VyKCdkZXN0cm95Jywgb2JqZWN0LCBvYmplY3QuY29sbGVjdGlvbiwgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICB2YXIgZGVzdHJveUJhdGNoID0gZnVuY3Rpb24oYmF0Y2gpIHtcbiAgICAgIHZhciBwcm9taXNlID0gUGFyc2UuUHJvbWlzZS5hcygpO1xuXG4gICAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCkge1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgICAgICByb3V0ZTogXCJiYXRjaFwiLFxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHJlcXVlc3RzOiBfLm1hcChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgICAgIHBhdGg6IFwiLzEvY2xhc3Nlcy9cIiArIG9iamVjdC5jbGFzc05hbWUgKyBcIi9cIiArIG9iamVjdC5pZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2VzLCBzdGF0dXMsIHhocikge1xuICAgICAgICAgIFBhcnNlLl9hcnJheUVhY2goYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCwgaSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlc1tpXS5zdWNjZXNzICYmIG9wdGlvbnMud2FpdCkge1xuICAgICAgICAgICAgICB0cmlnZ2VyRGVzdHJveShvYmplY3QpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZXNbaV0uZXJyb3IpIHtcbiAgICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKHJlc3BvbnNlc1tpXS5lcnJvci5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VzW2ldLmVycm9yLmVycm9yKTtcbiAgICAgICAgICAgICAgZXJyb3Iub2JqZWN0ID0gb2JqZWN0O1xuXG4gICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICB2YXIgcHJvbWlzZSA9IFBhcnNlLlByb21pc2UuYXMoKTtcbiAgICB2YXIgYmF0Y2ggPSBbXTtcbiAgICBQYXJzZS5fYXJyYXlFYWNoKGxpc3QsIGZ1bmN0aW9uKG9iamVjdCwgaSkge1xuICAgICAgaWYgKCFvYmplY3QuaWQgfHwgIW9wdGlvbnMud2FpdCkge1xuICAgICAgICB0cmlnZ2VyRGVzdHJveShvYmplY3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0LmlkKSB7XG4gICAgICAgIGJhdGNoLnB1c2gob2JqZWN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJhdGNoLmxlbmd0aCA9PT0gMjAgfHwgaSsxID09PSBsaXN0Lmxlbmd0aCkge1xuICAgICAgICB2YXIgdGhpc0JhdGNoID0gYmF0Y2g7XG4gICAgICAgIGJhdGNoID0gW107XG5cbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZGVzdHJveUJhdGNoKHRoaXNCYXRjaCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLkFHR1JFR0FURV9FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRXJyb3IgZGVsZXRpbmcgYW4gb2JqZWN0IGluIGRlc3Ryb3lBbGxcIik7XG4gICAgICAgIGVycm9yLmVycm9ycyA9IGVycm9ycztcblxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgdGhlIGdpdmVuIGxpc3Qgb2YgUGFyc2UuT2JqZWN0LlxuICAgKiBJZiBhbnkgZXJyb3IgaXMgZW5jb3VudGVyZWQsIHN0b3BzIGFuZCBjYWxscyB0aGUgZXJyb3IgaGFuZGxlci5cbiAgICpcbiAgICogPHByZT5cbiAgICogICBQYXJzZS5PYmplY3QuZmV0Y2hBbGwoW29iamVjdDEsIG9iamVjdDIsIC4uLl0sIHtcbiAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICogICAgICAgLy8gQWxsIHRoZSBvYmplY3RzIHdlcmUgZmV0Y2hlZC5cbiAgICogICAgIH0sXG4gICAqICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgICAgLy8gQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgZmV0Y2hpbmcgb25lIG9mIHRoZSBvYmplY3RzLlxuICAgKiAgICAgfSxcbiAgICogICB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFjay5cbiAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgKiA8L3VsPlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0LmZldGNoQWxsID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2ZldGNoQWxsKFxuICAgICAgbGlzdCxcbiAgICAgIHRydWVcbiAgICApLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGZXRjaGVzIHRoZSBnaXZlbiBsaXN0IG9mIFBhcnNlLk9iamVjdCBpZiBuZWVkZWQuXG4gICAqIElmIGFueSBlcnJvciBpcyBlbmNvdW50ZXJlZCwgc3RvcHMgYW5kIGNhbGxzIHRoZSBlcnJvciBoYW5kbGVyLlxuICAgKlxuICAgKiA8cHJlPlxuICAgKiAgIFBhcnNlLk9iamVjdC5mZXRjaEFsbElmTmVlZGVkKFtvYmplY3QxLCAuLi5dLCB7XG4gICAqICAgICBzdWNjZXNzOiBmdW5jdGlvbihsaXN0KSB7XG4gICAqICAgICAgIC8vIE9iamVjdHMgd2VyZSBmZXRjaGVkIGFuZCB1cGRhdGVkLlxuICAgKiAgICAgfSxcbiAgICogICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICAvLyBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBmZXRjaGluZyBvbmUgb2YgdGhlIG9iamVjdHMuXG4gICAqICAgICB9LFxuICAgKiAgIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBIGxpc3Qgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAqIDwvdWw+XG4gICAqL1xuICBQYXJzZS5PYmplY3QuZmV0Y2hBbGxJZk5lZWRlZCA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll9mZXRjaEFsbChcbiAgICAgIGxpc3QsXG4gICAgICBmYWxzZVxuICAgICkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgLy8gQXR0YWNoIGFsbCBpbmhlcml0YWJsZSBtZXRob2RzIHRvIHRoZSBQYXJzZS5PYmplY3QgcHJvdG90eXBlLlxuICBfLmV4dGVuZChQYXJzZS5PYmplY3QucHJvdG90eXBlLCBQYXJzZS5FdmVudHMsXG4gICAgICAgICAgIC8qKiBAbGVuZHMgUGFyc2UuT2JqZWN0LnByb3RvdHlwZSAqLyB7XG4gICAgX2V4aXN0ZWQ6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBpcyBhbiBlbXB0eSBmdW5jdGlvbiBieSBkZWZhdWx0LiBPdmVycmlkZSBpdCB3aXRoIHlvdXIgb3duXG4gICAgICogaW5pdGlhbGl6YXRpb24gbG9naWMuXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXt9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb2JqZWN0IHN1aXRhYmxlIGZvciBzYXZpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IHRoaXMuX3RvRnVsbEpTT04oKTtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2goW1wiX190eXBlXCIsIFwiY2xhc3NOYW1lXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihrZXkpIHsgZGVsZXRlIGpzb25ba2V5XTsgfSk7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuXG4gICAgX3RvRnVsbEpTT046IGZ1bmN0aW9uKHNlZW5PYmplY3RzKSB7XG4gICAgICB2YXIganNvbiA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGpzb24sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIGpzb25ba2V5XSA9IFBhcnNlLl9lbmNvZGUodmFsLCBzZWVuT2JqZWN0cyk7XG4gICAgICB9KTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuX29wZXJhdGlvbnMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIGpzb25ba2V5XSA9IHZhbDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoXy5oYXModGhpcywgXCJpZFwiKSkge1xuICAgICAgICBqc29uLm9iamVjdElkID0gdGhpcy5pZDtcbiAgICAgIH1cbiAgICAgIGlmIChfLmhhcyh0aGlzLCBcImNyZWF0ZWRBdFwiKSkge1xuICAgICAgICBpZiAoXy5pc0RhdGUodGhpcy5jcmVhdGVkQXQpKSB7XG4gICAgICAgICAganNvbi5jcmVhdGVkQXQgPSB0aGlzLmNyZWF0ZWRBdC50b0pTT04oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBqc29uLmNyZWF0ZWRBdCA9IHRoaXMuY3JlYXRlZEF0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChfLmhhcyh0aGlzLCBcInVwZGF0ZWRBdFwiKSkge1xuICAgICAgICBpZiAoXy5pc0RhdGUodGhpcy51cGRhdGVkQXQpKSB7XG4gICAgICAgICAganNvbi51cGRhdGVkQXQgPSB0aGlzLnVwZGF0ZWRBdC50b0pTT04oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBqc29uLnVwZGF0ZWRBdCA9IHRoaXMudXBkYXRlZEF0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBqc29uLl9fdHlwZSA9IFwiT2JqZWN0XCI7XG4gICAgICBqc29uLmNsYXNzTmFtZSA9IHRoaXMuY2xhc3NOYW1lO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgX2hhc2hlZEpTT04gdG8gcmVmbGVjdCB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGlzIG9iamVjdC5cbiAgICAgKiBBZGRzIGFueSBjaGFuZ2VkIGhhc2ggdmFsdWVzIHRvIHRoZSBzZXQgb2YgcGVuZGluZyBjaGFuZ2VzLlxuICAgICAqL1xuICAgIF9yZWZyZXNoQ2FjaGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHNlbGYuX3JlZnJlc2hpbmdDYWNoZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWxmLl9yZWZyZXNoaW5nQ2FjaGUgPSB0cnVlO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5hdHRyaWJ1dGVzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgICAgIHZhbHVlLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgIHZhciBvYmplY3RBcnJheSA9IGZhbHNlO1xuICAgICAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBXZSBkb24ndCBjYWNoZSBhcnJheXMgb2YgUGFyc2UuT2JqZWN0c1xuICAgICAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbihhcnJWYWwpIHtcbiAgICAgICAgICAgICAgaWYgKGFyclZhbCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhcnJWYWwuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFvYmplY3RBcnJheSAmJiBzZWxmLl9yZXNldENhY2hlRm9yS2V5KGtleSkpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0KGtleSwgbmV3IFBhcnNlLk9wLlNldCh2YWx1ZSksIHsgc2lsZW50OiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkZWxldGUgc2VsZi5fcmVmcmVzaGluZ0NhY2hlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBvYmplY3QgaGFzIGJlZW4gbW9kaWZpZWQgc2luY2UgaXRzIGxhc3RcbiAgICAgKiBzYXZlL3JlZnJlc2guICBJZiBhbiBhdHRyaWJ1dGUgaXMgc3BlY2lmaWVkLCBpdCByZXR1cm5zIHRydWUgb25seSBpZiB0aGF0XG4gICAgICogcGFydGljdWxhciBhdHRyaWJ1dGUgaGFzIGJlZW4gbW9kaWZpZWQgc2luY2UgdGhlIGxhc3Qgc2F2ZS9yZWZyZXNoLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEFuIGF0dHJpYnV0ZSBuYW1lIChvcHRpb25hbCkuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBkaXJ0eTogZnVuY3Rpb24oYXR0cikge1xuICAgICAgdGhpcy5fcmVmcmVzaENhY2hlKCk7XG5cbiAgICAgIHZhciBjdXJyZW50Q2hhbmdlcyA9IF8ubGFzdCh0aGlzLl9vcFNldFF1ZXVlKTtcblxuICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgcmV0dXJuIChjdXJyZW50Q2hhbmdlc1thdHRyXSA/IHRydWUgOiBmYWxzZSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoXy5rZXlzKGN1cnJlbnRDaGFuZ2VzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGtleXMgdGhhdCBoYXZlIGJlZW4gbW9kaWZpZWQgc2luY2UgbGFzdCBzYXZlL3JlZnJlc2hcbiAgICAgKiBAcmV0dXJuIHtBcnJheSBvZiBzdHJpbmd9XG4gICAgICovXG4gICAgZGlydHlLZXlzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmtleXMoXy5sYXN0KHRoaXMuX29wU2V0UXVldWUpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIFBvaW50ZXIgcmVmZXJlbmNpbmcgdGhpcyBPYmplY3QuXG4gICAgICovXG4gICAgX3RvUG9pbnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3Qgc2VyaWFsaXplIGFuIHVuc2F2ZWQgUGFyc2UuT2JqZWN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgX190eXBlOiBcIlBvaW50ZXJcIixcbiAgICAgICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc05hbWUsXG4gICAgICAgICAgICAgICBvYmplY3RJZDogdGhpcy5pZCB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgVGhlIHN0cmluZyBuYW1lIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgYSByZWxhdGlvbiBvbiB0aGUgZ2l2ZW4gY2xhc3MgZm9yIHRoZSBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIFN0cmluZyBhdHRyIFRoZSBhdHRyaWJ1dGUgdG8gZ2V0IHRoZSByZWxhdGlvbiBmb3IuXG4gICAgICovXG4gICAgcmVsYXRpb246IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KGF0dHIpO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuUmVsYXRpb24pKSB7XG4gICAgICAgICAgdGhyb3cgXCJDYWxsZWQgcmVsYXRpb24oKSBvbiBub24tcmVsYXRpb24gZmllbGQgXCIgKyBhdHRyO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlLl9lbnN1cmVQYXJlbnRBbmRLZXkodGhpcywgYXR0cik7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuUmVsYXRpb24odGhpcywgYXR0cik7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIEhUTUwtZXNjYXBlZCB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgZXNjYXBlOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB2YXIgaHRtbCA9IHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzW2F0dHJdO1xuICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICB9XG4gICAgICB2YXIgdmFsID0gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgICAgdmFyIGVzY2FwZWQ7XG4gICAgICBpZiAoUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKHZhbCkpIHtcbiAgICAgICAgZXNjYXBlZCA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXNjYXBlZCA9IF8uZXNjYXBlKHZhbC50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzW2F0dHJdID0gZXNjYXBlZDtcbiAgICAgIHJldHVybiBlc2NhcGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBhdHRyaWJ1dGUgY29udGFpbnMgYSB2YWx1ZSB0aGF0IGlzIG5vdFxuICAgICAqIG51bGwgb3IgdW5kZWZpbmVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIFRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgYXR0cmlidXRlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gIVBhcnNlLl9pc051bGxPclVuZGVmaW5lZCh0aGlzLmF0dHJpYnV0ZXNbYXR0cl0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQdWxscyBcInNwZWNpYWxcIiBmaWVsZHMgbGlrZSBvYmplY3RJZCwgY3JlYXRlZEF0LCBldGMuIG91dCBvZiBhdHRyc1xuICAgICAqIGFuZCBwdXRzIHRoZW0gb24gXCJ0aGlzXCIgZGlyZWN0bHkuICBSZW1vdmVzIHRoZW0gZnJvbSBhdHRycy5cbiAgICAgKiBAcGFyYW0gYXR0cnMgLSBBIGRpY3Rpb25hcnkgd2l0aCB0aGUgZGF0YSBmb3IgdGhpcyBQYXJzZS5PYmplY3QuXG4gICAgICovXG4gICAgX21lcmdlTWFnaWNGaWVsZHM6IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgICAvLyBDaGVjayBmb3IgY2hhbmdlcyBvZiBtYWdpYyBmaWVsZHMuXG4gICAgICB2YXIgbW9kZWwgPSB0aGlzO1xuICAgICAgdmFyIHNwZWNpYWxGaWVsZHMgPSBbXCJpZFwiLCBcIm9iamVjdElkXCIsIFwiY3JlYXRlZEF0XCIsIFwidXBkYXRlZEF0XCJdO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChzcGVjaWFsRmllbGRzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgIGlmIChhdHRyc1thdHRyXSkge1xuICAgICAgICAgIGlmIChhdHRyID09PSBcIm9iamVjdElkXCIpIHtcbiAgICAgICAgICAgIG1vZGVsLmlkID0gYXR0cnNbYXR0cl07XG4gICAgICAgICAgfSBlbHNlIGlmICgoYXR0ciA9PT0gXCJjcmVhdGVkQXRcIiB8fCBhdHRyID09PSBcInVwZGF0ZWRBdFwiKSAmJlxuICAgICAgICAgICAgICAgICAgICAgIV8uaXNEYXRlKGF0dHJzW2F0dHJdKSkge1xuICAgICAgICAgICAgbW9kZWxbYXR0cl0gPSBQYXJzZS5fcGFyc2VEYXRlKGF0dHJzW2F0dHJdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9kZWxbYXR0cl0gPSBhdHRyc1thdHRyXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIGF0dHJzW2F0dHJdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHRoZSBnaXZlbiBzZXJ2ZXJEYXRhIHRvIFwidGhpc1wiLCByZWZyZXNoZXMgYXR0cmlidXRlcywgYW5kXG4gICAgICogY2xlYXJzIHBlbmRpbmcgY2hhbmdlcztcbiAgICAgKi9cbiAgICBfY29weVNlcnZlckRhdGE6IGZ1bmN0aW9uKHNlcnZlckRhdGEpIHtcbiAgICAgIC8vIENvcHkgc2VydmVyIGRhdGFcbiAgICAgIHZhciB0ZW1wU2VydmVyRGF0YSA9IHt9O1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goc2VydmVyRGF0YSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICB0ZW1wU2VydmVyRGF0YVtrZXldID0gUGFyc2UuX2RlY29kZShrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc2VydmVyRGF0YSA9IHRlbXBTZXJ2ZXJEYXRhO1xuXG4gICAgICAvLyBSZWZyZXNoIHRoZSBhdHRyaWJ1dGVzLlxuICAgICAgdGhpcy5fcmVidWlsZEFsbEVzdGltYXRlZERhdGEoKTtcblxuICAgICAgLy8gVE9ETyAoYmtsaW10KTogUmV2aXNpdCBjbGVhcmluZyBvcGVyYXRpb25zLCBwZXJoYXBzIG1vdmUgdG8gcmV2ZXJ0LlxuICAgICAgLy8gQ2xlYXIgb3V0IGFueSBjaGFuZ2VzIHRoZSB1c2VyIG1pZ2h0IGhhdmUgbWFkZSBwcmV2aW91c2x5LlxuICAgICAgdGhpcy5fcmVmcmVzaENhY2hlKCk7XG4gICAgICB0aGlzLl9vcFNldFF1ZXVlID0gW3t9XTtcblxuICAgICAgLy8gUmVmcmVzaCB0aGUgYXR0cmlidXRlcyBhZ2Fpbi5cbiAgICAgIHRoaXMuX3JlYnVpbGRBbGxFc3RpbWF0ZWREYXRhKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1lcmdlcyBhbm90aGVyIG9iamVjdCdzIGF0dHJpYnV0ZXMgaW50byB0aGlzIG9iamVjdC5cbiAgICAgKi9cbiAgICBfbWVyZ2VGcm9tT2JqZWN0OiBmdW5jdGlvbihvdGhlcikge1xuICAgICAgaWYgKCFvdGhlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgZG9lcyB0aGUgaW52ZXJzZSBvZiBfbWVyZ2VNYWdpY0ZpZWxkcy5cbiAgICAgIHRoaXMuaWQgPSBvdGhlci5pZDtcbiAgICAgIHRoaXMuY3JlYXRlZEF0ID0gb3RoZXIuY3JlYXRlZEF0O1xuICAgICAgdGhpcy51cGRhdGVkQXQgPSBvdGhlci51cGRhdGVkQXQ7XG5cbiAgICAgIHRoaXMuX2NvcHlTZXJ2ZXJEYXRhKG90aGVyLl9zZXJ2ZXJEYXRhKTtcblxuICAgICAgdGhpcy5faGFzRGF0YSA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGpzb24gdG8gYmUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIF9zdGFydFNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fb3BTZXRRdWV1ZS5wdXNoKHt9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBzYXZlIGZhaWxzIGJlY2F1c2Ugb2YgYW4gZXJyb3IuIEFueSBjaGFuZ2VzIHRoYXQgd2VyZSBwYXJ0XG4gICAgICogb2YgdGhlIHNhdmUgbmVlZCB0byBiZSBtZXJnZWQgd2l0aCBjaGFuZ2VzIG1hZGUgYWZ0ZXIgdGhlIHNhdmUuIFRoaXNcbiAgICAgKiBtaWdodCB0aHJvdyBhbiBleGNlcHRpb24gaXMgeW91IGRvIGNvbmZsaWN0aW5nIG9wZXJhdGlvbnMuIEZvciBleGFtcGxlLFxuICAgICAqIGlmIHlvdSBkbzpcbiAgICAgKiAgIG9iamVjdC5zZXQoXCJmb29cIiwgXCJiYXJcIik7XG4gICAgICogICBvYmplY3Quc2V0KFwiaW52YWxpZCBmaWVsZCBuYW1lXCIsIFwiYmF6XCIpO1xuICAgICAqICAgb2JqZWN0LnNhdmUoKTtcbiAgICAgKiAgIG9iamVjdC5pbmNyZW1lbnQoXCJmb29cIik7XG4gICAgICogdGhlbiB0aGlzIHdpbGwgdGhyb3cgd2hlbiB0aGUgc2F2ZSBmYWlscyBhbmQgdGhlIGNsaWVudCB0cmllcyB0byBtZXJnZVxuICAgICAqIFwiYmFyXCIgd2l0aCB0aGUgKzEuXG4gICAgICovXG4gICAgX2NhbmNlbFNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGZhaWxlZENoYW5nZXMgPSBfLmZpcnN0KHRoaXMuX29wU2V0UXVldWUpO1xuICAgICAgdGhpcy5fb3BTZXRRdWV1ZSA9IF8ucmVzdCh0aGlzLl9vcFNldFF1ZXVlKTtcbiAgICAgIHZhciBuZXh0Q2hhbmdlcyA9IF8uZmlyc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChmYWlsZWRDaGFuZ2VzLCBmdW5jdGlvbihvcCwga2V5KSB7XG4gICAgICAgIHZhciBvcDEgPSBmYWlsZWRDaGFuZ2VzW2tleV07XG4gICAgICAgIHZhciBvcDIgPSBuZXh0Q2hhbmdlc1trZXldO1xuICAgICAgICBpZiAob3AxICYmIG9wMikge1xuICAgICAgICAgIG5leHRDaGFuZ2VzW2tleV0gPSBvcDIuX21lcmdlV2l0aFByZXZpb3VzKG9wMSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3AxKSB7XG4gICAgICAgICAgbmV4dENoYW5nZXNba2V5XSA9IG9wMTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9zYXZpbmcgPSB0aGlzLl9zYXZpbmcgLSAxO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIHNhdmUgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS4gVGhpcyBtZXJnZXMgdGhlIGNoYW5nZXMgdGhhdFxuICAgICAqIHdlcmUgc2F2ZWQgaW50byB0aGUga25vd24gc2VydmVyIGRhdGEsIGFuZCBvdmVycmlkZXMgaXQgd2l0aCBhbnkgZGF0YVxuICAgICAqIHNlbnQgZGlyZWN0bHkgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIF9maW5pc2hTYXZlOiBmdW5jdGlvbihzZXJ2ZXJEYXRhKSB7XG4gICAgICAvLyBHcmFiIGEgY29weSBvZiBhbnkgb2JqZWN0IHJlZmVyZW5jZWQgYnkgdGhpcyBvYmplY3QuIFRoZXNlIGluc3RhbmNlc1xuICAgICAgLy8gbWF5IGhhdmUgYWxyZWFkeSBiZWVuIGZldGNoZWQsIGFuZCB3ZSBkb24ndCB3YW50IHRvIGxvc2UgdGhlaXIgZGF0YS5cbiAgICAgIC8vIE5vdGUgdGhhdCBkb2luZyBpdCBsaWtlIHRoaXMgbWVhbnMgd2Ugd2lsbCB1bmlmeSBzZXBhcmF0ZSBjb3BpZXMgb2YgdGhlXG4gICAgICAvLyBzYW1lIG9iamVjdCwgYnV0IHRoYXQncyBhIHJpc2sgd2UgaGF2ZSB0byB0YWtlLlxuICAgICAgdmFyIGZldGNoZWRPYmplY3RzID0ge307XG4gICAgICBQYXJzZS5fdHJhdmVyc2UodGhpcy5hdHRyaWJ1dGVzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCAmJiBvYmplY3QuaWQgJiYgb2JqZWN0Ll9oYXNEYXRhKSB7XG4gICAgICAgICAgZmV0Y2hlZE9iamVjdHNbb2JqZWN0LmlkXSA9IG9iamVjdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBzYXZlZENoYW5nZXMgPSBfLmZpcnN0KHRoaXMuX29wU2V0UXVldWUpO1xuICAgICAgdGhpcy5fb3BTZXRRdWV1ZSA9IF8ucmVzdCh0aGlzLl9vcFNldFF1ZXVlKTtcbiAgICAgIHRoaXMuX2FwcGx5T3BTZXQoc2F2ZWRDaGFuZ2VzLCB0aGlzLl9zZXJ2ZXJEYXRhKTtcbiAgICAgIHRoaXMuX21lcmdlTWFnaWNGaWVsZHMoc2VydmVyRGF0YSk7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChzZXJ2ZXJEYXRhLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHNlbGYuX3NlcnZlckRhdGFba2V5XSA9IFBhcnNlLl9kZWNvZGUoa2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgLy8gTG9vayBmb3IgYW55IG9iamVjdHMgdGhhdCBtaWdodCBoYXZlIGJlY29tZSB1bmZldGNoZWQgYW5kIGZpeCB0aGVtXG4gICAgICAgIC8vIGJ5IHJlcGxhY2luZyB0aGVpciB2YWx1ZXMgd2l0aCB0aGUgcHJldmlvdXNseSBvYnNlcnZlZCB2YWx1ZXMuXG4gICAgICAgIHZhciBmZXRjaGVkID0gUGFyc2UuX3RyYXZlcnNlKHNlbGYuX3NlcnZlckRhdGFba2V5XSwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCAmJiBmZXRjaGVkT2JqZWN0c1tvYmplY3QuaWRdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmV0Y2hlZE9iamVjdHNbb2JqZWN0LmlkXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZmV0Y2hlZCkge1xuICAgICAgICAgIHNlbGYuX3NlcnZlckRhdGFba2V5XSA9IGZldGNoZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVidWlsZEFsbEVzdGltYXRlZERhdGEoKTtcbiAgICAgIHRoaXMuX3NhdmluZyA9IHRoaXMuX3NhdmluZyAtIDE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgZmV0Y2ggb3IgbG9naW4gaXMgY29tcGxldGUgdG8gc2V0IHRoZSBrbm93biBzZXJ2ZXIgZGF0YSB0b1xuICAgICAqIHRoZSBnaXZlbiBvYmplY3QuXG4gICAgICovXG4gICAgX2ZpbmlzaEZldGNoOiBmdW5jdGlvbihzZXJ2ZXJEYXRhLCBoYXNEYXRhKSB7XG4gICAgICAvLyBUT0RPIChia2xpbXQpOiBSZXZpc2l0IGNsZWFyaW5nIG9wZXJhdGlvbnMsIHBlcmhhcHMgbW92ZSB0byByZXZlcnQuXG4gICAgICB0aGlzLl9vcFNldFF1ZXVlID0gW3t9XTtcblxuICAgICAgLy8gQnJpbmcgaW4gYWxsIHRoZSBuZXcgc2VydmVyIGRhdGEuXG4gICAgICB0aGlzLl9tZXJnZU1hZ2ljRmllbGRzKHNlcnZlckRhdGEpO1xuICAgICAgdGhpcy5fY29weVNlcnZlckRhdGEoc2VydmVyRGF0YSk7XG5cbiAgICAgIHRoaXMuX2hhc0RhdGEgPSBoYXNEYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHRoZSBzZXQgb2YgUGFyc2UuT3AgaW4gb3BTZXQgdG8gdGhlIG9iamVjdCB0YXJnZXQuXG4gICAgICovXG4gICAgX2FwcGx5T3BTZXQ6IGZ1bmN0aW9uKG9wU2V0LCB0YXJnZXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKG9wU2V0LCBmdW5jdGlvbihjaGFuZ2UsIGtleSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IGNoYW5nZS5fZXN0aW1hdGUodGFyZ2V0W2tleV0sIHNlbGYsIGtleSk7XG4gICAgICAgIGlmICh0YXJnZXRba2V5XSA9PT0gUGFyc2UuT3AuX1VOU0VUKSB7XG4gICAgICAgICAgZGVsZXRlIHRhcmdldFtrZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVwbGFjZXMgdGhlIGNhY2hlZCB2YWx1ZSBmb3Iga2V5IHdpdGggdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBuZXcgdmFsdWUgaXMgZGlmZmVyZW50IHRoYW4gdGhlIG9sZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBfcmVzZXRDYWNoZUZvcktleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJlxuICAgICAgICAgICEodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpICYmXG4gICAgICAgICAgISh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkZpbGUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OID8gdmFsdWUudG9KU09OKCkgOiB2YWx1ZTtcbiAgICAgICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLl9oYXNoZWRKU09OW2tleV0gIT09IGpzb24pIHtcbiAgICAgICAgICB2YXIgd2FzU2V0ID0gISF0aGlzLl9oYXNoZWRKU09OW2tleV07XG4gICAgICAgICAgdGhpcy5faGFzaGVkSlNPTltrZXldID0ganNvbjtcbiAgICAgICAgICByZXR1cm4gd2FzU2V0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBvcHVsYXRlcyBhdHRyaWJ1dGVzW2tleV0gYnkgc3RhcnRpbmcgd2l0aCB0aGUgbGFzdCBrbm93biBkYXRhIGZyb20gdGhlXG4gICAgICogc2VydmVyLCBhbmQgYXBwbHlpbmcgYWxsIG9mIHRoZSBsb2NhbCBjaGFuZ2VzIHRoYXQgaGF2ZSBiZWVuIG1hZGUgdG8gdGhhdFxuICAgICAqIGtleSBzaW5jZSB0aGVuLlxuICAgICAqL1xuICAgIF9yZWJ1aWxkRXN0aW1hdGVkRGF0YUZvcktleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzW2tleV07XG4gICAgICBpZiAodGhpcy5fc2VydmVyRGF0YVtrZXldKSB7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1trZXldID0gdGhpcy5fc2VydmVyRGF0YVtrZXldO1xuICAgICAgfVxuICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLl9vcFNldFF1ZXVlLCBmdW5jdGlvbihvcFNldCkge1xuICAgICAgICB2YXIgb3AgPSBvcFNldFtrZXldO1xuICAgICAgICBpZiAob3ApIHtcbiAgICAgICAgICBzZWxmLmF0dHJpYnV0ZXNba2V5XSA9IG9wLl9lc3RpbWF0ZShzZWxmLmF0dHJpYnV0ZXNba2V5XSwgc2VsZiwga2V5KTtcbiAgICAgICAgICBpZiAoc2VsZi5hdHRyaWJ1dGVzW2tleV0gPT09IFBhcnNlLk9wLl9VTlNFVCkge1xuICAgICAgICAgICAgZGVsZXRlIHNlbGYuYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLl9yZXNldENhY2hlRm9yS2V5KGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUG9wdWxhdGVzIGF0dHJpYnV0ZXMgYnkgc3RhcnRpbmcgd2l0aCB0aGUgbGFzdCBrbm93biBkYXRhIGZyb20gdGhlXG4gICAgICogc2VydmVyLCBhbmQgYXBwbHlpbmcgYWxsIG9mIHRoZSBsb2NhbCBjaGFuZ2VzIHRoYXQgaGF2ZSBiZWVuIG1hZGUgc2luY2VcbiAgICAgKiB0aGVuLlxuICAgICAqL1xuICAgIF9yZWJ1aWxkQWxsRXN0aW1hdGVkRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHZhciBwcmV2aW91c0F0dHJpYnV0ZXMgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG5cbiAgICAgIHRoaXMuYXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5fc2VydmVyRGF0YSk7XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMuX29wU2V0UXVldWUsIGZ1bmN0aW9uKG9wU2V0KSB7XG4gICAgICAgIHNlbGYuX2FwcGx5T3BTZXQob3BTZXQsIHNlbGYuYXR0cmlidXRlcyk7XG4gICAgICAgIFBhcnNlLl9vYmplY3RFYWNoKG9wU2V0LCBmdW5jdGlvbihvcCwga2V5KSB7XG4gICAgICAgICAgc2VsZi5fcmVzZXRDYWNoZUZvcktleShrZXkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUcmlnZ2VyIGNoYW5nZSBldmVudHMgZm9yIGFueXRoaW5nIHRoYXQgY2hhbmdlZCBiZWNhdXNlIG9mIHRoZSBmZXRjaC5cbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHByZXZpb3VzQXR0cmlidXRlcywgZnVuY3Rpb24ob2xkVmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoc2VsZi5hdHRyaWJ1dGVzW2tleV0gIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6JyArIGtleSwgc2VsZiwgc2VsZi5hdHRyaWJ1dGVzW2tleV0sIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhwcmV2aW91c0F0dHJpYnV0ZXMsIGtleSkpIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTonICsga2V5LCBzZWxmLCBuZXdWYWx1ZSwge30pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhIGhhc2ggb2YgbW9kZWwgYXR0cmlidXRlcyBvbiB0aGUgb2JqZWN0LCBmaXJpbmdcbiAgICAgKiA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiB1bmxlc3MgeW91IGNob29zZSB0byBzaWxlbmNlIGl0LlxuICAgICAqXG4gICAgICogPHA+WW91IGNhbiBjYWxsIGl0IHdpdGggYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyBhbmQgdmFsdWVzLCBvciB3aXRoIG9uZVxuICAgICAqIGtleSBhbmQgdmFsdWUuICBGb3IgZXhhbXBsZTo8cHJlPlxuICAgICAqICAgZ2FtZVR1cm4uc2V0KHtcbiAgICAgKiAgICAgcGxheWVyOiBwbGF5ZXIxLFxuICAgICAqICAgICBkaWNlUm9sbDogMlxuICAgICAqICAgfSwge1xuICAgICAqICAgICBlcnJvcjogZnVuY3Rpb24oZ2FtZVR1cm5BZ2FpbiwgZXJyb3IpIHtcbiAgICAgKiAgICAgICAvLyBUaGUgc2V0IGZhaWxlZCB2YWxpZGF0aW9uLlxuICAgICAqICAgICB9XG4gICAgICogICB9KTtcbiAgICAgKlxuICAgICAqICAgZ2FtZS5zZXQoXCJjdXJyZW50UGxheWVyXCIsIHBsYXllcjIsIHtcbiAgICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGdhbWVUdXJuQWdhaW4sIGVycm9yKSB7XG4gICAgICogICAgICAgLy8gVGhlIHNldCBmYWlsZWQgdmFsaWRhdGlvbi5cbiAgICAgKiAgICAgfVxuICAgICAqICAgfSk7XG4gICAgICpcbiAgICAgKiAgIGdhbWUuc2V0KFwiZmluaXNoZWRcIiwgdHJ1ZSk7PC9wcmU+PC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIHNldC5cbiAgICAgKiBAcGFyYW0ge30gdmFsdWUgVGhlIHZhbHVlIHRvIGdpdmUgaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBzZXQgb2YgQmFja2JvbmUtbGlrZSBvcHRpb25zIGZvciB0aGUgc2V0LlxuICAgICAqICAgICBUaGUgb25seSBzdXBwb3J0ZWQgb3B0aW9ucyBhcmUgPGNvZGU+c2lsZW50PC9jb2RlPixcbiAgICAgKiAgICAgPGNvZGU+ZXJyb3I8L2NvZGU+LCBhbmQgPGNvZGU+cHJvbWlzZTwvY29kZT4uXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgc2V0IHN1Y2NlZWRlZC5cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCN2YWxpZGF0ZVxuICAgICAqIEBzZWUgUGFyc2UuRXJyb3JcbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdHRycywgYXR0cjtcbiAgICAgIGlmIChfLmlzT2JqZWN0KGtleSkgfHwgUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKGtleSkpIHtcbiAgICAgICAgYXR0cnMgPSBrZXk7XG4gICAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGF0dHJzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgICAgYXR0cnNba10gPSBQYXJzZS5fZGVjb2RlKGssIHYpO1xuICAgICAgICB9KTtcbiAgICAgICAgb3B0aW9ucyA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnMgPSB7fTtcbiAgICAgICAgYXR0cnNba2V5XSA9IFBhcnNlLl9kZWNvZGUoa2V5LCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEV4dHJhY3QgYXR0cmlidXRlcyBhbmQgb3B0aW9ucy5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgaWYgKCFhdHRycykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmIChhdHRycyBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgICBhdHRycyA9IGF0dHJzLmF0dHJpYnV0ZXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGF0dHJzLCBmdW5jdGlvbih1bnVzZWRfdmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoc2VsZi5jb25zdHJ1Y3Rvci5yZWFkT25seUF0dHJpYnV0ZXMgJiZcbiAgICAgICAgICBzZWxmLmNvbnN0cnVjdG9yLnJlYWRPbmx5QXR0cmlidXRlc1trZXldKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbW9kaWZ5IHJlYWRvbmx5IGtleTogJyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiB0aGUgdW5zZXQgb3B0aW9uIGlzIHVzZWQsIGV2ZXJ5IGF0dHJpYnV0ZSBzaG91bGQgYmUgYSBVbnNldC5cbiAgICAgIGlmIChvcHRpb25zLnVuc2V0KSB7XG4gICAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGF0dHJzLCBmdW5jdGlvbih1bnVzZWRfdmFsdWUsIGtleSkge1xuICAgICAgICAgIGF0dHJzW2tleV0gPSBuZXcgUGFyc2UuT3AuVW5zZXQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGFsbCB0aGUgYXR0cmlidXRlcyB0byBnZXQgdGhlIGVzdGltYXRlZCB2YWx1ZXMuXG4gICAgICB2YXIgZGF0YVRvVmFsaWRhdGUgPSBfLmNsb25lKGF0dHJzKTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGRhdGFUb1ZhbGlkYXRlLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9wKSB7XG4gICAgICAgICAgZGF0YVRvVmFsaWRhdGVba2V5XSA9IHZhbHVlLl9lc3RpbWF0ZShzZWxmLmF0dHJpYnV0ZXNba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYsIGtleSk7XG4gICAgICAgICAgaWYgKGRhdGFUb1ZhbGlkYXRlW2tleV0gPT09IFBhcnNlLk9wLl9VTlNFVCkge1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFUb1ZhbGlkYXRlW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gUnVuIHZhbGlkYXRpb24uXG4gICAgICBpZiAoIXRoaXMuX3ZhbGlkYXRlKGF0dHJzLCBvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21lcmdlTWFnaWNGaWVsZHMoYXR0cnMpO1xuXG4gICAgICBvcHRpb25zLmNoYW5nZXMgPSB7fTtcbiAgICAgIHZhciBlc2NhcGVkID0gdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXM7XG4gICAgICB2YXIgcHJldiA9IHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyB8fCB7fTtcblxuICAgICAgLy8gVXBkYXRlIGF0dHJpYnV0ZXMuXG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKF8ua2V5cyhhdHRycyksIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgdmFyIHZhbCA9IGF0dHJzW2F0dHJdO1xuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSByZWxhdGlvbiBvYmplY3Qgd2UgbmVlZCB0byBzZXQgdGhlIHBhcmVudCBjb3JyZWN0bHksXG4gICAgICAgIC8vIHNpbmNlIHRoZSBsb2NhdGlvbiB3aGVyZSBpdCB3YXMgcGFyc2VkIGRvZXMgbm90IGhhdmUgYWNjZXNzIHRvXG4gICAgICAgIC8vIHRoaXMgb2JqZWN0LlxuICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgUGFyc2UuUmVsYXRpb24pIHtcbiAgICAgICAgICB2YWwucGFyZW50ID0gc2VsZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHZhbCBpbnN0YW5jZW9mIFBhcnNlLk9wKSkge1xuICAgICAgICAgIHZhbCA9IG5ldyBQYXJzZS5PcC5TZXQodmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlZSBpZiB0aGlzIGNoYW5nZSB3aWxsIGFjdHVhbGx5IGhhdmUgYW55IGVmZmVjdC5cbiAgICAgICAgdmFyIGlzUmVhbENoYW5nZSA9IHRydWU7XG4gICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBQYXJzZS5PcC5TZXQgJiZcbiAgICAgICAgICAgIF8uaXNFcXVhbChzZWxmLmF0dHJpYnV0ZXNbYXR0cl0sIHZhbC52YWx1ZSkpIHtcbiAgICAgICAgICBpc1JlYWxDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1JlYWxDaGFuZ2UpIHtcbiAgICAgICAgICBkZWxldGUgZXNjYXBlZFthdHRyXTtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICAgIHNlbGYuX3NpbGVudFthdHRyXSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbnMuY2hhbmdlc1thdHRyXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1cnJlbnRDaGFuZ2VzID0gXy5sYXN0KHNlbGYuX29wU2V0UXVldWUpO1xuICAgICAgICBjdXJyZW50Q2hhbmdlc1thdHRyXSA9IHZhbC5fbWVyZ2VXaXRoUHJldmlvdXMoY3VycmVudENoYW5nZXNbYXR0cl0pO1xuICAgICAgICBzZWxmLl9yZWJ1aWxkRXN0aW1hdGVkRGF0YUZvcktleShhdHRyKTtcblxuICAgICAgICBpZiAoaXNSZWFsQ2hhbmdlKSB7XG4gICAgICAgICAgc2VsZi5jaGFuZ2VkW2F0dHJdID0gc2VsZi5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgICAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICAgIHNlbGYuX3BlbmRpbmdbYXR0cl0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgc2VsZi5jaGFuZ2VkW2F0dHJdO1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLl9wZW5kaW5nW2F0dHJdO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICB0aGlzLmNoYW5nZShvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gYXR0cmlidXRlIGZyb20gdGhlIG1vZGVsLCBmaXJpbmcgPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gdW5sZXNzXG4gICAgICogeW91IGNob29zZSB0byBzaWxlbmNlIGl0LiBUaGlzIGlzIGEgbm9vcCBpZiB0aGUgYXR0cmlidXRlIGRvZXNuJ3RcbiAgICAgKiBleGlzdC5cbiAgICAgKi9cbiAgICB1bnNldDogZnVuY3Rpb24oYXR0ciwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBvcHRpb25zLnVuc2V0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzLnNldChhdHRyLCBudWxsLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXRvbWljYWxseSBpbmNyZW1lbnRzIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gYXR0cmlidXRlIHRoZSBuZXh0IHRpbWUgdGhlXG4gICAgICogb2JqZWN0IGlzIHNhdmVkLiBJZiBubyBhbW91bnQgaXMgc3BlY2lmaWVkLCAxIGlzIHVzZWQgYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhdHRyIHtTdHJpbmd9IFRoZSBrZXkuXG4gICAgICogQHBhcmFtIGFtb3VudCB7TnVtYmVyfSBUaGUgYW1vdW50IHRvIGluY3JlbWVudCBieS5cbiAgICAgKi9cbiAgICBpbmNyZW1lbnQ6IGZ1bmN0aW9uKGF0dHIsIGFtb3VudCkge1xuICAgICAgaWYgKF8uaXNVbmRlZmluZWQoYW1vdW50KSB8fCBfLmlzTnVsbChhbW91bnQpKSB7XG4gICAgICAgIGFtb3VudCA9IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXR0ciwgbmV3IFBhcnNlLk9wLkluY3JlbWVudChhbW91bnQpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXRvbWljYWxseSBhZGQgYW4gb2JqZWN0IHRvIHRoZSBlbmQgb2YgdGhlIGFycmF5IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuXG4gICAgICoga2V5LlxuICAgICAqIEBwYXJhbSBhdHRyIHtTdHJpbmd9IFRoZSBrZXkuXG4gICAgICogQHBhcmFtIGl0ZW0ge30gVGhlIGl0ZW0gdG8gYWRkLlxuICAgICAqL1xuICAgIGFkZDogZnVuY3Rpb24oYXR0ciwgaXRlbSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHIsIG5ldyBQYXJzZS5PcC5BZGQoW2l0ZW1dKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEF0b21pY2FsbHkgYWRkIGFuIG9iamVjdCB0byB0aGUgYXJyYXkgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4ga2V5LCBvbmx5XG4gICAgICogaWYgaXQgaXMgbm90IGFscmVhZHkgcHJlc2VudCBpbiB0aGUgYXJyYXkuIFRoZSBwb3NpdGlvbiBvZiB0aGUgaW5zZXJ0IGlzXG4gICAgICogbm90IGd1YXJhbnRlZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXR0ciB7U3RyaW5nfSBUaGUga2V5LlxuICAgICAqIEBwYXJhbSBpdGVtIHt9IFRoZSBvYmplY3QgdG8gYWRkLlxuICAgICAqL1xuICAgIGFkZFVuaXF1ZTogZnVuY3Rpb24oYXR0ciwgaXRlbSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHIsIG5ldyBQYXJzZS5PcC5BZGRVbmlxdWUoW2l0ZW1dKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEF0b21pY2FsbHkgcmVtb3ZlIGFsbCBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IGZyb20gdGhlIGFycmF5IGFzc29jaWF0ZWRcbiAgICAgKiB3aXRoIGEgZ2l2ZW4ga2V5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGF0dHIge1N0cmluZ30gVGhlIGtleS5cbiAgICAgKiBAcGFyYW0gaXRlbSB7fSBUaGUgb2JqZWN0IHRvIHJlbW92ZS5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKGF0dHIsIGl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChhdHRyLCBuZXcgUGFyc2UuT3AuUmVtb3ZlKFtpdGVtXSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGluc3RhbmNlIG9mIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT3AgZGVzY3JpYmluZyB3aGF0IGtpbmQgb2ZcbiAgICAgKiBtb2RpZmljYXRpb24gaGFzIGJlZW4gcGVyZm9ybWVkIG9uIHRoaXMgZmllbGQgc2luY2UgdGhlIGxhc3QgdGltZSBpdCB3YXNcbiAgICAgKiBzYXZlZC4gRm9yIGV4YW1wbGUsIGFmdGVyIGNhbGxpbmcgb2JqZWN0LmluY3JlbWVudChcInhcIiksIGNhbGxpbmdcbiAgICAgKiBvYmplY3Qub3AoXCJ4XCIpIHdvdWxkIHJldHVybiBhbiBpbnN0YW5jZSBvZiBQYXJzZS5PcC5JbmNyZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXR0ciB7U3RyaW5nfSBUaGUga2V5LlxuICAgICAqIEByZXR1cm5zIHtQYXJzZS5PcH0gVGhlIG9wZXJhdGlvbiwgb3IgdW5kZWZpbmVkIGlmIG5vbmUuXG4gICAgICovXG4gICAgb3A6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBfLmxhc3QodGhpcy5fb3BTZXRRdWV1ZSlbYXR0cl07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFyIGFsbCBhdHRyaWJ1dGVzIG9uIHRoZSBtb2RlbCwgZmlyaW5nIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IHVubGVzc1xuICAgICAqIHlvdSBjaG9vc2UgdG8gc2lsZW5jZSBpdC5cbiAgICAgKi9cbiAgICBjbGVhcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBvcHRpb25zLnVuc2V0ID0gdHJ1ZTtcbiAgICAgIHZhciBrZXlzVG9DbGVhciA9IF8uZXh0ZW5kKHRoaXMuYXR0cmlidXRlcywgdGhpcy5fb3BlcmF0aW9ucyk7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoa2V5c1RvQ2xlYXIsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTi1lbmNvZGVkIHNldCBvZiBvcGVyYXRpb25zIHRvIGJlIHNlbnQgd2l0aCB0aGUgbmV4dCBzYXZlXG4gICAgICogcmVxdWVzdC5cbiAgICAgKi9cbiAgICBfZ2V0U2F2ZUpTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGpzb24gPSBfLmNsb25lKF8uZmlyc3QodGhpcy5fb3BTZXRRdWV1ZSkpO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goanNvbiwgZnVuY3Rpb24ob3AsIGtleSkge1xuICAgICAgICBqc29uW2tleV0gPSBvcC50b0pTT04oKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG9iamVjdCBjYW4gYmUgc2VyaWFsaXplZCBmb3Igc2F2aW5nLlxuICAgICAqL1xuICAgIF9jYW5CZVNlcmlhbGl6ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fY2FuQmVTZXJpYWxpemVkQXNWYWx1ZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGZXRjaCB0aGUgbW9kZWwgZnJvbSB0aGUgc2VydmVyLiBJZiB0aGUgc2VydmVyJ3MgcmVwcmVzZW50YXRpb24gb2YgdGhlXG4gICAgICogbW9kZWwgZGlmZmVycyBmcm9tIGl0cyBjdXJyZW50IGF0dHJpYnV0ZXMsIHRoZXkgd2lsbCBiZSBvdmVycmlkZW4sXG4gICAgICogdHJpZ2dlcmluZyBhIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgZmV0Y2hcbiAgICAgKiAgICAgY29tcGxldGVzLlxuICAgICAqL1xuICAgIGZldGNoOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc05hbWUsXG4gICAgICAgIG9iamVjdElkOiB0aGlzLmlkLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgIHNlbGYuX2ZpbmlzaEZldGNoKHNlbGYucGFyc2UocmVzcG9uc2UsIHN0YXR1cywgeGhyKSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBhIGhhc2ggb2YgbW9kZWwgYXR0cmlidXRlcywgYW5kIHNhdmUgdGhlIG1vZGVsIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogdXBkYXRlZEF0IHdpbGwgYmUgdXBkYXRlZCB3aGVuIHRoZSByZXF1ZXN0IHJldHVybnMuXG4gICAgICogWW91IGNhbiBlaXRoZXIgY2FsbCBpdCBhczo8cHJlPlxuICAgICAqICAgb2JqZWN0LnNhdmUoKTs8L3ByZT5cbiAgICAgKiBvcjxwcmU+XG4gICAgICogICBvYmplY3Quc2F2ZShudWxsLCBvcHRpb25zKTs8L3ByZT5cbiAgICAgKiBvcjxwcmU+XG4gICAgICogICBvYmplY3Quc2F2ZShhdHRycywgb3B0aW9ucyk7PC9wcmU+XG4gICAgICogb3I8cHJlPlxuICAgICAqICAgb2JqZWN0LnNhdmUoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7PC9wcmU+XG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZSwgPHByZT5cbiAgICAgKiAgIGdhbWVUdXJuLnNhdmUoe1xuICAgICAqICAgICBwbGF5ZXI6IFwiSmFrZSBDdXR0ZXJcIixcbiAgICAgKiAgICAgZGljZVJvbGw6IDJcbiAgICAgKiAgIH0sIHtcbiAgICAgKiAgICAgc3VjY2VzczogZnVuY3Rpb24oZ2FtZVR1cm5BZ2Fpbikge1xuICAgICAqICAgICAgIC8vIFRoZSBzYXZlIHdhcyBzdWNjZXNzZnVsLlxuICAgICAqICAgICB9LFxuICAgICAqICAgICBlcnJvcjogZnVuY3Rpb24oZ2FtZVR1cm5BZ2FpbiwgZXJyb3IpIHtcbiAgICAgKiAgICAgICAvLyBUaGUgc2F2ZSBmYWlsZWQuICBFcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvci5cbiAgICAgKiAgICAgfVxuICAgICAqICAgfSk7PC9wcmU+XG4gICAgICogb3Igd2l0aCBwcm9taXNlczo8cHJlPlxuICAgICAqICAgZ2FtZVR1cm4uc2F2ZSh7XG4gICAgICogICAgIHBsYXllcjogXCJKYWtlIEN1dHRlclwiLFxuICAgICAqICAgICBkaWNlUm9sbDogMlxuICAgICAqICAgfSkudGhlbihmdW5jdGlvbihnYW1lVHVybkFnYWluKSB7XG4gICAgICogICAgIC8vIFRoZSBzYXZlIHdhcyBzdWNjZXNzZnVsLlxuICAgICAqICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgKiAgICAgLy8gVGhlIHNhdmUgZmFpbGVkLiAgRXJyb3IgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IuXG4gICAgICogICB9KTs8L3ByZT5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT53YWl0OiBTZXQgdG8gdHJ1ZSB0byB3YWl0IGZvciB0aGUgc2VydmVyIHRvIGNvbmZpcm0gYSBzdWNjZXNzZnVsXG4gICAgICogICBzYXZlIGJlZm9yZSBtb2RpZnlpbmcgdGhlIGF0dHJpYnV0ZXMgb24gdGhlIG9iamVjdC5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyB0aGUgYHNldGAgZXZlbnQuXG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBzYXZlXG4gICAgICogICAgIGNvbXBsZXRlcy5cbiAgICAgKiBAc2VlIFBhcnNlLkVycm9yXG4gICAgICovXG4gICAgc2F2ZTogZnVuY3Rpb24oYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgdmFyIGksIGF0dHJzLCBjdXJyZW50LCBvcHRpb25zLCBzYXZlZDtcbiAgICAgIGlmIChfLmlzT2JqZWN0KGFyZzEpIHx8IFBhcnNlLl9pc051bGxPclVuZGVmaW5lZChhcmcxKSkge1xuICAgICAgICBhdHRycyA9IGFyZzE7XG4gICAgICAgIG9wdGlvbnMgPSBhcmcyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnMgPSB7fTtcbiAgICAgICAgYXR0cnNbYXJnMV0gPSBhcmcyO1xuICAgICAgICBvcHRpb25zID0gYXJnMztcbiAgICAgIH1cblxuICAgICAgLy8gTWFrZSBzYXZlKHsgc3VjY2VzczogZnVuY3Rpb24oKSB7fSB9KSB3b3JrLlxuICAgICAgaWYgKCFvcHRpb25zICYmIGF0dHJzKSB7XG4gICAgICAgIHZhciBleHRyYV9rZXlzID0gXy5yZWplY3QoYXR0cnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICByZXR1cm4gXy5pbmNsdWRlKFtcInN1Y2Nlc3NcIiwgXCJlcnJvclwiLCBcIndhaXRcIl0sIGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZXh0cmFfa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB2YXIgYWxsX2Z1bmN0aW9ucyA9IHRydWU7XG4gICAgICAgICAgaWYgKF8uaGFzKGF0dHJzLCBcInN1Y2Nlc3NcIikgJiYgIV8uaXNGdW5jdGlvbihhdHRycy5zdWNjZXNzKSkge1xuICAgICAgICAgICAgYWxsX2Z1bmN0aW9ucyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5oYXMoYXR0cnMsIFwiZXJyb3JcIikgJiYgIV8uaXNGdW5jdGlvbihhdHRycy5lcnJvcikpIHtcbiAgICAgICAgICAgIGFsbF9mdW5jdGlvbnMgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFsbF9mdW5jdGlvbnMpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgYXR0cnMgb2JqZWN0IGxvb2tzIGxpa2UgaXQncyByZWFsbHkgYW4gb3B0aW9ucyBvYmplY3QsXG4gICAgICAgICAgICAvLyBhbmQgdGhlcmUncyBubyBvdGhlciBvcHRpb25zIG9iamVjdCwgc28gbGV0J3MganVzdCB1c2UgaXQuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlKG51bGwsIGF0dHJzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAgIGN1cnJlbnQgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXRPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgIGlmIChzZXRPcHRpb25zLndhaXQpIHtcbiAgICAgICAgc2V0T3B0aW9ucy5zaWxlbnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdmFyIHNldEVycm9yO1xuICAgICAgc2V0T3B0aW9ucy5lcnJvciA9IGZ1bmN0aW9uKG1vZGVsLCBlcnJvcikge1xuICAgICAgICBzZXRFcnJvciA9IGVycm9yO1xuICAgICAgfTtcbiAgICAgIGlmIChhdHRycyAmJiAhdGhpcy5zZXQoYXR0cnMsIHNldE9wdGlvbnMpKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKHNldEVycm9yKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1vZGVsID0gdGhpcztcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYW55IHVuc2F2ZWQgY2hpbGQsIHNhdmUgaXQgZmlyc3QuXG4gICAgICBtb2RlbC5fcmVmcmVzaENhY2hlKCk7XG5cbiAgICAgIC8vIFRPRE8oa2xpbXQpOiBSZWZhY3RvciB0aGlzIHNvIHRoYXQgdGhlIHNhdmUgc3RhcnRzIG5vdywgbm90IGxhdGVyLlxuXG4gICAgICB2YXIgdW5zYXZlZENoaWxkcmVuID0gW107XG4gICAgICB2YXIgdW5zYXZlZEZpbGVzID0gW107XG4gICAgICBQYXJzZS5PYmplY3QuX2ZpbmRVbnNhdmVkQ2hpbGRyZW4obW9kZWwuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnNhdmVkQ2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5zYXZlZEZpbGVzKTtcbiAgICAgIGlmICh1bnNhdmVkQ2hpbGRyZW4ubGVuZ3RoICsgdW5zYXZlZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fZGVlcFNhdmVBc3luYyh0aGlzLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIG1vZGVsLnNhdmUobnVsbCwgb3B0aW9ucyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N0YXJ0U2F2ZSgpO1xuICAgICAgdGhpcy5fc2F2aW5nID0gKHRoaXMuX3NhdmluZyB8fCAwKSArIDE7XG5cbiAgICAgIHRoaXMuX2FsbFByZXZpb3VzU2F2ZXMgPSB0aGlzLl9hbGxQcmV2aW91c1NhdmVzIHx8IFBhcnNlLlByb21pc2UuYXMoKTtcbiAgICAgIHRoaXMuX2FsbFByZXZpb3VzU2F2ZXMgPSB0aGlzLl9hbGxQcmV2aW91c1NhdmVzLl9jb250aW51ZVdpdGgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBtb2RlbC5pZCA/ICdQVVQnIDogJ1BPU1QnO1xuXG4gICAgICAgIHZhciBqc29uID0gbW9kZWwuX2dldFNhdmVKU09OKCk7XG5cbiAgICAgICAgdmFyIHJvdXRlID0gXCJjbGFzc2VzXCI7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBtb2RlbC5jbGFzc05hbWU7XG4gICAgICAgIGlmIChtb2RlbC5jbGFzc05hbWUgPT09IFwiX1VzZXJcIiAmJiAhbW9kZWwuaWQpIHtcbiAgICAgICAgICAvLyBTcGVjaWFsLWNhc2UgdXNlciBzaWduLXVwLlxuICAgICAgICAgIHJvdXRlID0gXCJ1c2Vyc1wiO1xuICAgICAgICAgIGNsYXNzTmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuICAgICAgICAgIG9iamVjdElkOiBtb2RlbC5pZCxcbiAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICAgIGRhdGE6IGpzb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuICAgICAgICAgIHZhciBzZXJ2ZXJBdHRycyA9IG1vZGVsLnBhcnNlKHJlc3AsIHN0YXR1cywgeGhyKTtcbiAgICAgICAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgICBzZXJ2ZXJBdHRycyA9IF8uZXh0ZW5kKGF0dHJzIHx8IHt9LCBzZXJ2ZXJBdHRycyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vZGVsLl9maW5pc2hTYXZlKHNlcnZlckF0dHJzKTtcbiAgICAgICAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgICBtb2RlbC5zZXQoY3VycmVudCwgc2V0T3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtb2RlbDtcblxuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIG1vZGVsLl9jYW5jZWxTYXZlKCk7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuXG4gICAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIG1vZGVsKTtcblxuICAgICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuX2FsbFByZXZpb3VzU2F2ZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhpcyBtb2RlbCBvbiB0aGUgc2VydmVyIGlmIGl0IHdhcyBhbHJlYWR5IHBlcnNpc3RlZC5cbiAgICAgKiBPcHRpbWlzdGljYWxseSByZW1vdmVzIHRoZSBtb2RlbCBmcm9tIGl0cyBjb2xsZWN0aW9uLCBpZiBpdCBoYXMgb25lLlxuICAgICAqIElmIGB3YWl0OiB0cnVlYCBpcyBwYXNzZWQsIHdhaXRzIGZvciB0aGUgc2VydmVyIHRvIHJlc3BvbmRcbiAgICAgKiBiZWZvcmUgcmVtb3ZhbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT53YWl0OiBTZXQgdG8gdHJ1ZSB0byB3YWl0IGZvciB0aGUgc2VydmVyIHRvIGNvbmZpcm0gc3VjY2Vzc2Z1bFxuICAgICAqICAgZGVsZXRpb24gb2YgdGhlIG9iamVjdCBiZWZvcmUgdHJpZ2dlcmluZyB0aGUgYGRlc3Ryb3lgIGV2ZW50LlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFja1xuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBkZXN0cm95XG4gICAgICogICAgIGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG5cbiAgICAgIHZhciB0cmlnZ2VyRGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBtb2RlbC50cmlnZ2VyKCdkZXN0cm95JywgbW9kZWwsIG1vZGVsLmNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyRGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW9wdGlvbnMud2FpdCkge1xuICAgICAgICB0cmlnZ2VyRGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwiY2xhc3Nlc1wiLFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMuY2xhc3NOYW1lLFxuICAgICAgICBvYmplY3RJZDogdGhpcy5pZCxcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgdHJpZ2dlckRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSByZXNwb25zZSBpbnRvIHRoZSBoYXNoIG9mIGF0dHJpYnV0ZXMgdG8gYmUgc2V0IG9uIHRoZSBtb2RlbC5cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXy5jbG9uZShyZXNwKTtcbiAgICAgIF8oW1wiY3JlYXRlZEF0XCIsIFwidXBkYXRlZEF0XCJdKS5lYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAob3V0cHV0W2tleV0pIHtcbiAgICAgICAgICBvdXRwdXRba2V5XSA9IFBhcnNlLl9wYXJzZURhdGUob3V0cHV0W2tleV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghb3V0cHV0LnVwZGF0ZWRBdCkge1xuICAgICAgICBvdXRwdXQudXBkYXRlZEF0ID0gb3V0cHV0LmNyZWF0ZWRBdDtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5fZXhpc3RlZCA9IChzdGF0dXMgIT09IDIwMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IG1vZGVsIHdpdGggaWRlbnRpY2FsIGF0dHJpYnV0ZXMgdG8gdGhpcyBvbmUuXG4gICAgICogQHJldHVybiB7UGFyc2UuT2JqZWN0fVxuICAgICAqL1xuICAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBvYmplY3QgaGFzIG5ldmVyIGJlZW4gc2F2ZWQgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc05ldzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXRoaXMuaWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGwgdGhpcyBtZXRob2QgdG8gbWFudWFsbHkgZmlyZSBhIGBcImNoYW5nZVwiYCBldmVudCBmb3IgdGhpcyBtb2RlbCBhbmRcbiAgICAgKiBhIGBcImNoYW5nZTphdHRyaWJ1dGVcImAgZXZlbnQgZm9yIGVhY2ggY2hhbmdlZCBhdHRyaWJ1dGUuXG4gICAgICogQ2FsbGluZyB0aGlzIHdpbGwgY2F1c2UgYWxsIG9iamVjdHMgb2JzZXJ2aW5nIHRoZSBtb2RlbCB0byB1cGRhdGUuXG4gICAgICovXG4gICAgY2hhbmdlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciBjaGFuZ2luZyA9IHRoaXMuX2NoYW5naW5nO1xuICAgICAgdGhpcy5fY2hhbmdpbmcgPSB0cnVlO1xuXG4gICAgICAvLyBTaWxlbnQgY2hhbmdlcyBiZWNvbWUgcGVuZGluZyBjaGFuZ2VzLlxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5fc2lsZW50LCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgIHNlbGYuX3BlbmRpbmdbYXR0cl0gPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNpbGVudCBjaGFuZ2VzIGFyZSB0cmlnZ2VyZWQuXG4gICAgICB2YXIgY2hhbmdlcyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zLmNoYW5nZXMsIHRoaXMuX3NpbGVudCk7XG4gICAgICB0aGlzLl9zaWxlbnQgPSB7fTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGNoYW5nZXMsIGZ1bmN0aW9uKHVudXNlZF92YWx1ZSwgYXR0cikge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTonICsgYXR0ciwgc2VsZiwgc2VsZi5nZXQoYXR0ciksIG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgICBpZiAoY2hhbmdpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgaXMgdG8gZ2V0IGFyb3VuZCBsaW50IG5vdCBsZXR0aW5nIHVzIG1ha2UgYSBmdW5jdGlvbiBpbiBhIGxvb3AuXG4gICAgICB2YXIgZGVsZXRlQ2hhbmdlZCA9IGZ1bmN0aW9uKHZhbHVlLCBhdHRyKSB7XG4gICAgICAgIGlmICghc2VsZi5fcGVuZGluZ1thdHRyXSAmJiAhc2VsZi5fc2lsZW50W2F0dHJdKSB7XG4gICAgICAgICAgZGVsZXRlIHNlbGYuY2hhbmdlZFthdHRyXTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gQ29udGludWUgZmlyaW5nIGBcImNoYW5nZVwiYCBldmVudHMgd2hpbGUgdGhlcmUgYXJlIHBlbmRpbmcgY2hhbmdlcy5cbiAgICAgIHdoaWxlICghXy5pc0VtcHR5KHRoaXMuX3BlbmRpbmcpKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgLy8gUGVuZGluZyBhbmQgc2lsZW50IGNoYW5nZXMgc3RpbGwgcmVtYWluLlxuICAgICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmNoYW5nZWQsIGRlbGV0ZUNoYW5nZWQpO1xuICAgICAgICBzZWxmLl9wcmV2aW91c0F0dHJpYnV0ZXMgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5naW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb2JqZWN0IHdhcyBjcmVhdGVkIGJ5IHRoZSBQYXJzZSBzZXJ2ZXIgd2hlbiB0aGVcbiAgICAgKiBvYmplY3QgbWlnaHQgaGF2ZSBhbHJlYWR5IGJlZW4gdGhlcmUgKGUuZy4gaW4gdGhlIGNhc2Ugb2YgYSBGYWNlYm9va1xuICAgICAqIGxvZ2luKVxuICAgICAqL1xuICAgIGV4aXN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2V4aXN0ZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZSBpZiB0aGUgbW9kZWwgaGFzIGNoYW5nZWQgc2luY2UgdGhlIGxhc3QgPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT5cbiAgICAgKiBldmVudC4gIElmIHlvdSBzcGVjaWZ5IGFuIGF0dHJpYnV0ZSBuYW1lLCBkZXRlcm1pbmUgaWYgdGhhdCBhdHRyaWJ1dGVcbiAgICAgKiBoYXMgY2hhbmdlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBPcHRpb25hbCBhdHRyaWJ1dGUgbmFtZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ2hhbmdlZDogZnVuY3Rpb24oYXR0cikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAhXy5pc0VtcHR5KHRoaXMuY2hhbmdlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VkICYmIF8uaGFzKHRoaXMuY2hhbmdlZCwgYXR0cik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSBjaGFuZ2VkLCBvclxuICAgICAqIGZhbHNlIGlmIHRoZXJlIGFyZSBubyBjaGFuZ2VkIGF0dHJpYnV0ZXMuIFVzZWZ1bCBmb3IgZGV0ZXJtaW5pbmcgd2hhdFxuICAgICAqIHBhcnRzIG9mIGEgdmlldyBuZWVkIHRvIGJlIHVwZGF0ZWQgYW5kL29yIHdoYXQgYXR0cmlidXRlcyBuZWVkIHRvIGJlXG4gICAgICogcGVyc2lzdGVkIHRvIHRoZSBzZXJ2ZXIuIFVuc2V0IGF0dHJpYnV0ZXMgd2lsbCBiZSBzZXQgdG8gdW5kZWZpbmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGFuIGF0dHJpYnV0ZXMgb2JqZWN0IHRvIGRpZmYgYWdhaW5zdCB0aGUgbW9kZWwsXG4gICAgICogZGV0ZXJtaW5pbmcgaWYgdGhlcmUgKndvdWxkIGJlKiBhIGNoYW5nZS5cbiAgICAgKi9cbiAgICBjaGFuZ2VkQXR0cmlidXRlczogZnVuY3Rpb24oZGlmZikge1xuICAgICAgaWYgKCFkaWZmKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc0NoYW5nZWQoKSA/IF8uY2xvbmUodGhpcy5jaGFuZ2VkKSA6IGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGNoYW5nZWQgPSB7fTtcbiAgICAgIHZhciBvbGQgPSB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChkaWZmLCBmdW5jdGlvbihkaWZmVmFsLCBhdHRyKSB7XG4gICAgICAgIGlmICghXy5pc0VxdWFsKG9sZFthdHRyXSwgZGlmZlZhbCkpIHtcbiAgICAgICAgICBjaGFuZ2VkW2F0dHJdID0gZGlmZlZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY2hhbmdlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcHJldmlvdXMgdmFsdWUgb2YgYW4gYXR0cmlidXRlLCByZWNvcmRlZCBhdCB0aGUgdGltZSB0aGUgbGFzdFxuICAgICAqIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IGV2ZW50IHdhcyBmaXJlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBOYW1lIG9mIHRoZSBhdHRyaWJ1dGUgdG8gZ2V0LlxuICAgICAqL1xuICAgIHByZXZpb3VzOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGggfHwgIXRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXNbYXR0cl07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBtb2RlbCBhdCB0aGUgdGltZSBvZiB0aGUgcHJldmlvdXNcbiAgICAgKiA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJldmlvdXNBdHRyaWJ1dGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmNsb25lKHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgbW9kZWwgaXMgY3VycmVudGx5IGluIGEgdmFsaWQgc3RhdGUuIEl0J3Mgb25seSBwb3NzaWJsZSB0b1xuICAgICAqIGdldCBpbnRvIGFuICppbnZhbGlkKiBzdGF0ZSBpZiB5b3UncmUgdXNpbmcgc2lsZW50IGNoYW5nZXMuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1ZhbGlkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhdGhpcy52YWxpZGF0ZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBZb3Ugc2hvdWxkIG5vdCBjYWxsIHRoaXMgZnVuY3Rpb24gZGlyZWN0bHkgdW5sZXNzIHlvdSBzdWJjbGFzc1xuICAgICAqIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4sIGluIHdoaWNoIGNhc2UgeW91IGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZFxuICAgICAqIHRvIHByb3ZpZGUgYWRkaXRpb25hbCB2YWxpZGF0aW9uIG9uIDxjb2RlPnNldDwvY29kZT4gYW5kXG4gICAgICogPGNvZGU+c2F2ZTwvY29kZT4uICBZb3VyIGltcGxlbWVudGF0aW9uIHNob3VsZCByZXR1cm5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRycyBUaGUgY3VycmVudCBkYXRhIHRvIHZhbGlkYXRlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtbGlrZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHt9IEZhbHNlIGlmIHRoZSBkYXRhIGlzIHZhbGlkLiAgQW4gZXJyb3Igb2JqZWN0IG90aGVyd2lzZS5cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNzZXRcbiAgICAgKi9cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChfLmhhcyhhdHRycywgXCJBQ0xcIikgJiYgIShhdHRycy5BQ0wgaW5zdGFuY2VvZiBQYXJzZS5BQ0wpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBQ0wgbXVzdCBiZSBhIFBhcnNlLkFDTC5cIik7XG4gICAgICB9XG4gICAgICB2YXIgY29ycmVjdCA9IHRydWU7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChhdHRycywgZnVuY3Rpb24odW51c2VkX3ZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCEoL15bQS1aYS16XVswLTlBLVphLXpfXSokLykudGVzdChrZXkpKSB7XG4gICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghY29ycmVjdCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLklOVkFMSURfS0VZX05BTUUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW4gdmFsaWRhdGlvbiBhZ2FpbnN0IGEgc2V0IG9mIGluY29taW5nIGF0dHJpYnV0ZXMsIHJldHVybmluZyBgdHJ1ZWBcbiAgICAgKiBpZiBhbGwgaXMgd2VsbC4gSWYgYSBzcGVjaWZpYyBgZXJyb3JgIGNhbGxiYWNrIGhhcyBiZWVuIHBhc3NlZCxcbiAgICAgKiBjYWxsIHRoYXQgaW5zdGVhZCBvZiBmaXJpbmcgdGhlIGdlbmVyYWwgYFwiZXJyb3JcImAgZXZlbnQuXG4gICAgICovXG4gICAgX3ZhbGlkYXRlOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMuc2lsZW50IHx8ICF0aGlzLnZhbGlkYXRlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgYXR0cnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRycyk7XG4gICAgICB2YXIgZXJyb3IgPSB0aGlzLnZhbGlkYXRlKGF0dHJzLCBvcHRpb25zKTtcbiAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVycm9yKSB7XG4gICAgICAgIG9wdGlvbnMuZXJyb3IodGhpcywgZXJyb3IsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdlcnJvcicsIHRoaXMsIGVycm9yLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgQUNMIGZvciB0aGlzIG9iamVjdC5cbiAgICAgKiBAcmV0dXJucyB7UGFyc2UuQUNMfSBBbiBpbnN0YW5jZSBvZiBQYXJzZS5BQ0wuXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3QjZ2V0XG4gICAgICovXG4gICAgZ2V0QUNMOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChcIkFDTFwiKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgQUNMIHRvIGJlIHVzZWQgZm9yIHRoaXMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuQUNMfSBhY2wgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuQUNMLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbmFsIEJhY2tib25lLWxpa2Ugb3B0aW9ucyBvYmplY3QgdG8gYmVcbiAgICAgKiAgICAgcGFzc2VkIGluIHRvIHNldC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBzZXQgcGFzc2VkIHZhbGlkYXRpb24uXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3Qjc2V0XG4gICAgICovXG4gICAgc2V0QUNMOiBmdW5jdGlvbihhY2wsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChcIkFDTFwiLCBhY2wsIG9wdGlvbnMpO1xuICAgIH1cblxuICB9KTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgc3ViY2xhc3MgZm9yIG1ha2luZyBuZXcgaW5zdGFuY2VzIG9mIHRoZSBnaXZlblxuICAgKiBjbGFzc05hbWUgc3RyaW5nLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll9nZXRTdWJjbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgIGlmICghXy5pc1N0cmluZyhjbGFzc05hbWUpKSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3MgcmVxdWlyZXMgYSBzdHJpbmcgYXJndW1lbnQuXCI7XG4gICAgfVxuICAgIHZhciBPYmplY3RDbGFzcyA9IFBhcnNlLk9iamVjdC5fY2xhc3NNYXBbY2xhc3NOYW1lXTtcbiAgICBpZiAoIU9iamVjdENsYXNzKSB7XG4gICAgICBPYmplY3RDbGFzcyA9IFBhcnNlLk9iamVjdC5leHRlbmQoY2xhc3NOYW1lKTtcbiAgICAgIFBhcnNlLk9iamVjdC5fY2xhc3NNYXBbY2xhc3NOYW1lXSA9IE9iamVjdENsYXNzO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0Q2xhc3M7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PYmplY3QgZm9yIHRoZSBnaXZlbiBjbGFzc25hbWUuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX2NyZWF0ZSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgYXR0cmlidXRlcywgb3B0aW9ucykge1xuICAgIHZhciBPYmplY3RDbGFzcyA9IFBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3MoY2xhc3NOYW1lKTtcbiAgICByZXR1cm4gbmV3IE9iamVjdENsYXNzKGF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBvYmplY3QgaWRzIGdpdmVuIGEgbGlzdCBvZiBvYmplY3RzLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll90b09iamVjdElkQXJyYXkgPSBmdW5jdGlvbihsaXN0LCBvbWl0T2JqZWN0c1dpdGhEYXRhKSB7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhsaXN0KTtcbiAgICB9XG5cbiAgICB2YXIgZXJyb3I7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGxpc3RbMF0uY2xhc3NOYW1lO1xuICAgIHZhciBvYmplY3RJZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmplY3QgPSBsaXN0W2ldO1xuICAgICAgaWYgKGNsYXNzTmFtZSAhPT0gb2JqZWN0LmNsYXNzTmFtZSkge1xuICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5JTlZBTElEX0NMQVNTX05BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxsIG9iamVjdHMgc2hvdWxkIGJlIG9mIHRoZSBzYW1lIGNsYXNzXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKCFvYmplY3QuaWQpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuTUlTU0lOR19PQkpFQ1RfSUQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxsIG9iamVjdHMgbXVzdCBoYXZlIGFuIElEXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKG9taXRPYmplY3RzV2l0aERhdGEgJiYgb2JqZWN0Ll9oYXNEYXRhKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgb2JqZWN0SWRzLnB1c2gob2JqZWN0LmlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhvYmplY3RJZHMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGEgbGlzdCBvZiBvYmplY3RzIHdpdGggZmV0Y2hlZCByZXN1bHRzLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll91cGRhdGVXaXRoRmV0Y2hlZFJlc3VsdHMgPSBmdW5jdGlvbihsaXN0LCBmZXRjaGVkLCBmb3JjZUZldGNoKSB7XG4gICAgdmFyIGZldGNoZWRPYmplY3RzQnlJZCA9IHt9O1xuICAgIFBhcnNlLl9hcnJheUVhY2goZmV0Y2hlZCwgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICBmZXRjaGVkT2JqZWN0c0J5SWRbb2JqZWN0LmlkXSA9IG9iamVjdDtcbiAgICB9KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iamVjdCA9IGxpc3RbaV07XG4gICAgICB2YXIgZmV0Y2hlZE9iamVjdCA9IGZldGNoZWRPYmplY3RzQnlJZFtvYmplY3QuaWRdO1xuICAgICAgaWYgKCFmZXRjaGVkT2JqZWN0ICYmIGZvcmNlRmV0Y2gpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxsIG9iamVjdHMgbXVzdCBleGlzdCBvbiB0aGUgc2VydmVyXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIG9iamVjdC5fbWVyZ2VGcm9tT2JqZWN0KGZldGNoZWRPYmplY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKGxpc3QpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGZXRjaGVzIHRoZSBvYmplY3RzIGdpdmVuIGluIGxpc3QuICBUaGUgZm9yY2VGZXRjaCBvcHRpb24gd2lsbCBmZXRjaCBhbGxcbiAgICogb2JqZWN0cyBpZiB0cnVlIGFuZCBpZ25vcmUgb2JqZWN0cyB3aXRoIGRhdGEgaWYgZmFsc2UuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX2ZldGNoQWxsID0gZnVuY3Rpb24obGlzdCwgZm9yY2VGZXRjaCkge1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMobGlzdCk7XG4gICAgfVxuXG4gICAgdmFyIG9taXRPYmplY3RzV2l0aERhdGEgPSAhZm9yY2VGZXRjaDtcbiAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll90b09iamVjdElkQXJyYXkoXG4gICAgICBsaXN0LFxuICAgICAgb21pdE9iamVjdHNXaXRoRGF0YVxuICAgICkudGhlbihmdW5jdGlvbihvYmplY3RJZHMpIHtcbiAgICAgIHZhciBjbGFzc05hbWUgPSBsaXN0WzBdLmNsYXNzTmFtZTtcbiAgICAgIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShjbGFzc05hbWUpO1xuICAgICAgcXVlcnkuY29udGFpbmVkSW4oXCJvYmplY3RJZFwiLCBvYmplY3RJZHMpO1xuICAgICAgcXVlcnkubGltaXQgPSBvYmplY3RJZHMubGVuZ3RoO1xuICAgICAgcmV0dXJuIHF1ZXJ5LmZpbmQoKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuX3VwZGF0ZVdpdGhGZXRjaGVkUmVzdWx0cyhcbiAgICAgICAgbGlzdCxcbiAgICAgICAgcmVzdWx0cyxcbiAgICAgICAgZm9yY2VGZXRjaFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBTZXQgdXAgYSBtYXAgb2YgY2xhc3NOYW1lIHRvIGNsYXNzIHNvIHRoYXQgd2UgY2FuIGNyZWF0ZSBuZXcgaW5zdGFuY2VzIG9mXG4gIC8vIFBhcnNlIE9iamVjdHMgZnJvbSBKU09OIGF1dG9tYXRpY2FsbHkuXG4gIFBhcnNlLk9iamVjdC5fY2xhc3NNYXAgPSB7fTtcblxuICBQYXJzZS5PYmplY3QuX2V4dGVuZCA9IFBhcnNlLl9leHRlbmQ7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0IGZvciB0aGUgZ2l2ZW4gUGFyc2UgY2xhc3MgbmFtZS5cbiAgICpcbiAgICogPHA+RXZlcnkgZXh0ZW5zaW9uIG9mIGEgUGFyc2UgY2xhc3Mgd2lsbCBpbmhlcml0IGZyb20gdGhlIG1vc3QgcmVjZW50XG4gICAqIHByZXZpb3VzIGV4dGVuc2lvbiBvZiB0aGF0IGNsYXNzLiBXaGVuIGEgUGFyc2UuT2JqZWN0IGlzIGF1dG9tYXRpY2FsbHlcbiAgICogY3JlYXRlZCBieSBwYXJzaW5nIEpTT04sIGl0IHdpbGwgdXNlIHRoZSBtb3N0IHJlY2VudCBleHRlbnNpb24gb2YgdGhhdFxuICAgKiBjbGFzcy48L3A+XG4gICAqXG4gICAqIDxwPllvdSBzaG91bGQgY2FsbCBlaXRoZXI6PHByZT5cbiAgICogICAgIHZhciBNeUNsYXNzID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIk15Q2xhc3NcIiwge1xuICAgKiAgICAgICAgIDxpPkluc3RhbmNlIG1ldGhvZHM8L2k+LFxuICAgKiAgICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGF0dHJzLCBvcHRpb25zKSB7XG4gICAqICAgICAgICAgICAgIHRoaXMuc29tZUluc3RhbmNlUHJvcGVydHkgPSBbXSxcbiAgICogICAgICAgICAgICAgPGk+T3RoZXIgaW5zdGFuY2UgcHJvcGVydGllczwvaT5cbiAgICogICAgICAgICB9XG4gICAqICAgICB9LCB7XG4gICAqICAgICAgICAgPGk+Q2xhc3MgcHJvcGVydGllczwvaT5cbiAgICogICAgIH0pOzwvcHJlPlxuICAgKiBvciwgZm9yIEJhY2tib25lIGNvbXBhdGliaWxpdHk6PHByZT5cbiAgICogICAgIHZhciBNeUNsYXNzID0gUGFyc2UuT2JqZWN0LmV4dGVuZCh7XG4gICAqICAgICAgICAgY2xhc3NOYW1lOiBcIk15Q2xhc3NcIixcbiAgICogICAgICAgICA8aT5JbnN0YW5jZSBtZXRob2RzPC9pPixcbiAgICogICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgKiAgICAgICAgICAgICB0aGlzLnNvbWVJbnN0YW5jZVByb3BlcnR5ID0gW10sXG4gICAqICAgICAgICAgICAgIDxpPk90aGVyIGluc3RhbmNlIHByb3BlcnRpZXM8L2k+XG4gICAqICAgICAgICAgfVxuICAgKiAgICAgfSwge1xuICAgKiAgICAgICAgIDxpPkNsYXNzIHByb3BlcnRpZXM8L2k+XG4gICAqICAgICB9KTs8L3ByZT48L3A+XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgVGhlIG5hbWUgb2YgdGhlIFBhcnNlIGNsYXNzIGJhY2tpbmcgdGhpcyBtb2RlbC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3RvUHJvcHMgSW5zdGFuY2UgcHJvcGVydGllcyB0byBhZGQgdG8gaW5zdGFuY2VzIG9mIHRoZVxuICAgKiAgICAgY2xhc3MgcmV0dXJuZWQgZnJvbSB0aGlzIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsYXNzUHJvcHMgQ2xhc3MgcHJvcGVydGllcyB0byBhZGQgdGhlIGNsYXNzIHJldHVybmVkIGZyb21cbiAgICogICAgIHRoaXMgbWV0aG9kLlxuICAgKiBAcmV0dXJuIHtDbGFzc30gQSBuZXcgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0LlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0LmV4dGVuZCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgcHJvdG9Qcm9wcywgY2xhc3NQcm9wcykge1xuICAgIC8vIEhhbmRsZSB0aGUgY2FzZSB3aXRoIG9ubHkgdHdvIGFyZ3MuXG4gICAgaWYgKCFfLmlzU3RyaW5nKGNsYXNzTmFtZSkpIHtcbiAgICAgIGlmIChjbGFzc05hbWUgJiYgXy5oYXMoY2xhc3NOYW1lLCBcImNsYXNzTmFtZVwiKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LmV4dGVuZChjbGFzc05hbWUuY2xhc3NOYW1lLCBjbGFzc05hbWUsIHByb3RvUHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgXCJQYXJzZS5PYmplY3QuZXh0ZW5kJ3MgZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIHRoZSBjbGFzc05hbWUuXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHNvbWVvbmUgdHJpZXMgdG8gc3ViY2xhc3MgXCJVc2VyXCIsIGNvZXJjZSBpdCB0byB0aGUgcmlnaHQgdHlwZS5cbiAgICBpZiAoY2xhc3NOYW1lID09PSBcIlVzZXJcIiAmJiBQYXJzZS5Vc2VyLl9wZXJmb3JtVXNlclJld3JpdGUpIHtcbiAgICAgIGNsYXNzTmFtZSA9IFwiX1VzZXJcIjtcbiAgICB9XG4gICAgcHJvdG9Qcm9wcyA9IHByb3RvUHJvcHMgfHwge307XG4gICAgcHJvdG9Qcm9wcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cbiAgICB2YXIgTmV3Q2xhc3NPYmplY3QgPSBudWxsO1xuICAgIGlmIChfLmhhcyhQYXJzZS5PYmplY3QuX2NsYXNzTWFwLCBjbGFzc05hbWUpKSB7XG4gICAgICB2YXIgT2xkQ2xhc3NPYmplY3QgPSBQYXJzZS5PYmplY3QuX2NsYXNzTWFwW2NsYXNzTmFtZV07XG4gICAgICAvLyBUaGlzIG5ldyBzdWJjbGFzcyBoYXMgYmVlbiB0b2xkIHRvIGV4dGVuZCBib3RoIGZyb20gXCJ0aGlzXCIgYW5kIGZyb21cbiAgICAgIC8vIE9sZENsYXNzT2JqZWN0LiBUaGlzIGlzIG11bHRpcGxlIGluaGVyaXRhbmNlLCB3aGljaCBpc24ndCBzdXBwb3J0ZWQuXG4gICAgICAvLyBGb3Igbm93LCBsZXQncyBqdXN0IHBpY2sgb25lLlxuICAgICAgTmV3Q2xhc3NPYmplY3QgPSBPbGRDbGFzc09iamVjdC5fZXh0ZW5kKHByb3RvUHJvcHMsIGNsYXNzUHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBOZXdDbGFzc09iamVjdCA9IHRoaXMuX2V4dGVuZChwcm90b1Byb3BzLCBjbGFzc1Byb3BzKTtcbiAgICB9XG4gICAgLy8gRXh0ZW5kaW5nIGEgc3ViY2xhc3Mgc2hvdWxkIHJldXNlIHRoZSBjbGFzc25hbWUgYXV0b21hdGljYWxseS5cbiAgICBOZXdDbGFzc09iamVjdC5leHRlbmQgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhhcmcwKSB8fCAoYXJnMCAmJiBfLmhhcyhhcmcwLCBcImNsYXNzTmFtZVwiKSkpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5leHRlbmQuYXBwbHkoTmV3Q2xhc3NPYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICB2YXIgbmV3QXJndW1lbnRzID0gW2NsYXNzTmFtZV0uY29uY2F0KFBhcnNlLl8udG9BcnJheShhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuZXh0ZW5kLmFwcGx5KE5ld0NsYXNzT2JqZWN0LCBuZXdBcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgcmVmZXJlbmNlIHRvIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0IHdpdGggdGhlIGdpdmVuIGlkLiBUaGlzXG4gICAgICogZG9lcyBub3QgZXhpc3Qgb24gUGFyc2UuT2JqZWN0LCBvbmx5IG9uIHN1YmNsYXNzZXMuXG4gICAgICpcbiAgICAgKiA8cD5BIHNob3J0Y3V0IGZvcjogPHByZT5cbiAgICAgKiAgdmFyIEZvbyA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJGb29cIik7XG4gICAgICogIHZhciBwb2ludGVyVG9Gb28gPSBuZXcgRm9vKCk7XG4gICAgICogIHBvaW50ZXJUb0Zvby5pZCA9IFwibXlPYmplY3RJZFwiO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQG5hbWUgY3JlYXRlV2l0aG91dERhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBvYmplY3QgdG8gY3JlYXRlIGEgcmVmZXJlbmNlIHRvLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLk9iamVjdH0gQSBQYXJzZS5PYmplY3QgcmVmZXJlbmNlLlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBQYXJzZS5PYmplY3RcbiAgICAgKi9cbiAgICBOZXdDbGFzc09iamVjdC5jcmVhdGVXaXRob3V0RGF0YSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgb2JqID0gbmV3IE5ld0NsYXNzT2JqZWN0KCk7XG4gICAgICBvYmouaWQgPSBpZDtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuICAgIFBhcnNlLk9iamVjdC5fY2xhc3NNYXBbY2xhc3NOYW1lXSA9IE5ld0NsYXNzT2JqZWN0O1xuICAgIHJldHVybiBOZXdDbGFzc09iamVjdDtcbiAgfTtcblxuICBQYXJzZS5PYmplY3QuX2ZpbmRVbnNhdmVkQ2hpbGRyZW4gPSBmdW5jdGlvbihvYmplY3QsIGNoaWxkcmVuLCBmaWxlcykge1xuICAgIFBhcnNlLl90cmF2ZXJzZShvYmplY3QsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgICBvYmplY3QuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgICBpZiAob2JqZWN0LmRpcnR5KCkpIHtcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgICBpZiAoIW9iamVjdC51cmwoKSkge1xuICAgICAgICAgIGZpbGVzLnB1c2gob2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgUGFyc2UuT2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgLy8gVE9ETyhrbGltdCk6IFdlIHNob3VsZCByZXdyaXRlIF90cmF2ZXJzZSBzbyB0aGF0IGl0IGNhbiBiZSB1c2VkIGhlcmUuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgcmV0dXJuICEhb2JqZWN0LmlkO1xuICAgIH1cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgLy8gRG9uJ3QgcmVjdXJzZSBpbmRlZmluaXRlbHkgaW50byBmaWxlcy5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBjYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlID0gdHJ1ZTtcblxuICAgIGlmIChfLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChvYmplY3QsIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGlmICghUGFyc2UuT2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlKGNoaWxkKSkge1xuICAgICAgICAgIGNhbkJlU2VyaWFsaXplZEFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKG9iamVjdCwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgaWYgKCFQYXJzZS5PYmplY3QuX2NhbkJlU2VyaWFsaXplZEFzVmFsdWUoY2hpbGQpKSB7XG4gICAgICAgICAgY2FuQmVTZXJpYWxpemVkQXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbkJlU2VyaWFsaXplZEFzVmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHJvb3Qgb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uczogVGhlIG9ubHkgdmFsaWQgb3B0aW9uIGlzIHVzZU1hc3RlcktleS5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5fZGVlcFNhdmVBc3luYyA9IGZ1bmN0aW9uKG9iamVjdCwgb3B0aW9ucykge1xuICAgIHZhciB1bnNhdmVkQ2hpbGRyZW4gPSBbXTtcbiAgICB2YXIgdW5zYXZlZEZpbGVzID0gW107XG4gICAgUGFyc2UuT2JqZWN0Ll9maW5kVW5zYXZlZENoaWxkcmVuKG9iamVjdCwgdW5zYXZlZENoaWxkcmVuLCB1bnNhdmVkRmlsZXMpO1xuXG4gICAgdmFyIHByb21pc2UgPSBQYXJzZS5Qcm9taXNlLmFzKCk7XG4gICAgXy5lYWNoKHVuc2F2ZWRGaWxlcywgZnVuY3Rpb24oZmlsZSkge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUuc2F2ZShvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIG9iamVjdHMgPSBfLnVuaXEodW5zYXZlZENoaWxkcmVuKTtcbiAgICB2YXIgcmVtYWluaW5nID0gXy51bmlxKG9iamVjdHMpO1xuXG4gICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLl9jb250aW51ZVdoaWxlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVtYWluaW5nLmxlbmd0aCA+IDA7XG4gICAgICB9LCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBHYXRoZXIgdXAgYWxsIHRoZSBvYmplY3RzIHRoYXQgY2FuIGJlIHNhdmVkIGluIHRoaXMgYmF0Y2guXG4gICAgICAgIHZhciBiYXRjaCA9IFtdO1xuICAgICAgICB2YXIgbmV3UmVtYWluaW5nID0gW107XG4gICAgICAgIFBhcnNlLl9hcnJheUVhY2gocmVtYWluaW5nLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAvLyBMaW1pdCBiYXRjaGVzIHRvIDIwIG9iamVjdHMuXG4gICAgICAgICAgaWYgKGJhdGNoLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBuZXdSZW1haW5pbmcucHVzaChvYmplY3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChvYmplY3QuX2NhbkJlU2VyaWFsaXplZCgpKSB7XG4gICAgICAgICAgICBiYXRjaC5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1JlbWFpbmluZy5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmVtYWluaW5nID0gbmV3UmVtYWluaW5nO1xuXG4gICAgICAgIC8vIElmIHdlIGNhbid0IHNhdmUgYW55IG9iamVjdHMsIHRoZXJlIG11c3QgYmUgYSBjaXJjdWxhciByZWZlcmVuY2UuXG4gICAgICAgIGlmIChiYXRjaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihcbiAgICAgICAgICAgIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRyaWVkIHRvIHNhdmUgYSBiYXRjaCB3aXRoIGEgY3ljbGUuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc2VydmUgYSBzcG90IGluIGV2ZXJ5IG9iamVjdCdzIHNhdmUgcXVldWUuXG4gICAgICAgIHZhciByZWFkeVRvU3RhcnQgPSBQYXJzZS5Qcm9taXNlLndoZW4oXy5tYXAoYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBvYmplY3QuX2FsbFByZXZpb3VzU2F2ZXMgfHwgUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHZhciBiYXRjaEZpbmlzaGVkID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgICAgUGFyc2UuX2FycmF5RWFjaChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgb2JqZWN0Ll9hbGxQcmV2aW91c1NhdmVzID0gYmF0Y2hGaW5pc2hlZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2F2ZSBhIHNpbmdsZSBiYXRjaCwgd2hldGhlciBwcmV2aW91cyBzYXZlcyBzdWNjZWVkZWQgb3IgZmFpbGVkLlxuICAgICAgICByZXR1cm4gcmVhZHlUb1N0YXJ0Ll9jb250aW51ZVdpdGgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgICAgIHJvdXRlOiBcImJhdGNoXCIsXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgcmVxdWVzdHM6IF8ubWFwKGJhdGNoLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAgICAgICB2YXIganNvbiA9IG9iamVjdC5fZ2V0U2F2ZUpTT04oKTtcbiAgICAgICAgICAgICAgICB2YXIgbWV0aG9kID0gXCJQT1NUXCI7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IFwiLzEvY2xhc3Nlcy9cIiArIG9iamVjdC5jbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5pZCkge1xuICAgICAgICAgICAgICAgICAgcGF0aCA9IHBhdGggKyBcIi9cIiArIG9iamVjdC5pZDtcbiAgICAgICAgICAgICAgICAgIG1ldGhvZCA9IFwiUFVUXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9zdGFydFNhdmUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgICBib2R5OiBqc29uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhocikge1xuICAgICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgICAgUGFyc2UuX2FycmF5RWFjaChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZVtpXS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9maW5pc2hTYXZlKFxuICAgICAgICAgICAgICAgICAgb2JqZWN0LnBhcnNlKHJlc3BvbnNlW2ldLnN1Y2Nlc3MsIHN0YXR1cywgeGhyKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvciB8fCByZXNwb25zZVtpXS5lcnJvcjtcbiAgICAgICAgICAgICAgICBvYmplY3QuX2NhbmNlbFNhdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoXG4gICAgICAgICAgICAgICAgbmV3IFBhcnNlLkVycm9yKGVycm9yLmNvZGUsIGVycm9yLmVycm9yKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGJhdGNoRmluaXNoZWQucmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBiYXRjaEZpbmlzaGVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfSk7XG4gIH07XG5cbn0odGhpcykpO1xuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIGEgUm9sZSBvbiB0aGUgUGFyc2Ugc2VydmVyLiBSb2xlcyByZXByZXNlbnQgZ3JvdXBpbmdzIG9mXG4gICAqIFVzZXJzIGZvciB0aGUgcHVycG9zZXMgb2YgZ3JhbnRpbmcgcGVybWlzc2lvbnMgKGUuZy4gc3BlY2lmeWluZyBhbiBBQ0xcbiAgICogZm9yIGFuIE9iamVjdCkuIFJvbGVzIGFyZSBzcGVjaWZpZWQgYnkgdGhlaXIgc2V0cyBvZiBjaGlsZCB1c2VycyBhbmRcbiAgICogY2hpbGQgcm9sZXMsIGFsbCBvZiB3aGljaCBhcmUgZ3JhbnRlZCBhbnkgcGVybWlzc2lvbnMgdGhhdCB0aGUgcGFyZW50XG4gICAqIHJvbGUgaGFzLlxuICAgKlxuICAgKiA8cD5Sb2xlcyBtdXN0IGhhdmUgYSBuYW1lICh3aGljaCBjYW5ub3QgYmUgY2hhbmdlZCBhZnRlciBjcmVhdGlvbiBvZiB0aGVcbiAgICogcm9sZSksIGFuZCBtdXN0IHNwZWNpZnkgYW4gQUNMLjwvcD5cbiAgICogQGNsYXNzXG4gICAqIEEgUGFyc2UuUm9sZSBpcyBhIGxvY2FsIHJlcHJlc2VudGF0aW9uIG9mIGEgcm9sZSBwZXJzaXN0ZWQgdG8gdGhlIFBhcnNlXG4gICAqIGNsb3VkLlxuICAgKi9cbiAgUGFyc2UuUm9sZSA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJfUm9sZVwiLCAvKiogQGxlbmRzIFBhcnNlLlJvbGUucHJvdG90eXBlICovIHtcbiAgICAvLyBJbnN0YW5jZSBNZXRob2RzXG4gICAgXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBQYXJzZVJvbGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgQUNMLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBSb2xlIHRvIGNyZWF0ZS5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkFDTH0gYWNsIFRoZSBBQ0wgZm9yIHRoaXMgcm9sZS4gUm9sZXMgbXVzdCBoYXZlIGFuIEFDTC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24obmFtZSwgYWNsKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhuYW1lKSAmJiAoYWNsIGluc3RhbmNlb2YgUGFyc2UuQUNMKSkge1xuICAgICAgICBQYXJzZS5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbnVsbCwgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0TmFtZShuYW1lKTtcbiAgICAgICAgdGhpcy5zZXRBQ0woYWNsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFBhcnNlLk9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBuYW1lLCBhY2wpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbmFtZSBvZiB0aGUgcm9sZS4gIFlvdSBjYW4gYWx0ZXJuYXRpdmVseSBjYWxsIHJvbGUuZ2V0KFwibmFtZVwiKVxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIHJvbGUuXG4gICAgICovXG4gICAgZ2V0TmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoXCJuYW1lXCIpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbmFtZSBmb3IgYSByb2xlLiBUaGlzIHZhbHVlIG11c3QgYmUgc2V0IGJlZm9yZSB0aGUgcm9sZSBoYXNcbiAgICAgKiBiZWVuIHNhdmVkIHRvIHRoZSBzZXJ2ZXIsIGFuZCBjYW5ub3QgYmUgc2V0IG9uY2UgdGhlIHJvbGUgaGFzIGJlZW5cbiAgICAgKiBzYXZlZC5cbiAgICAgKiBcbiAgICAgKiA8cD5cbiAgICAgKiAgIEEgcm9sZSdzIG5hbWUgY2FuIG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycywgXywgLSwgYW5kXG4gICAgICogICBzcGFjZXMuXG4gICAgICogPC9wPlxuICAgICAqXG4gICAgICogPHA+VGhpcyBpcyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgcm9sZS5zZXQoXCJuYW1lXCIsIG5hbWUpPC9wPlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSByb2xlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFN0YW5kYXJkIG9wdGlvbnMgb2JqZWN0IHdpdGggc3VjY2VzcyBhbmQgZXJyb3JcbiAgICAgKiAgICAgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldE5hbWU6IGZ1bmN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChcIm5hbWVcIiwgbmFtZSwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBQYXJzZS5SZWxhdGlvbiBmb3IgdGhlIFBhcnNlLlVzZXJzIHRoYXQgYXJlIGRpcmVjdFxuICAgICAqIGNoaWxkcmVuIG9mIHRoaXMgcm9sZS4gVGhlc2UgdXNlcnMgYXJlIGdyYW50ZWQgYW55IHByaXZpbGVnZXMgdGhhdCB0aGlzXG4gICAgICogcm9sZSBoYXMgYmVlbiBncmFudGVkIChlLmcuIHJlYWQgb3Igd3JpdGUgYWNjZXNzIHRocm91Z2ggQUNMcykuIFlvdSBjYW5cbiAgICAgKiBhZGQgb3IgcmVtb3ZlIHVzZXJzIGZyb20gdGhlIHJvbGUgdGhyb3VnaCB0aGlzIHJlbGF0aW9uLlxuICAgICAqIFxuICAgICAqIDxwPlRoaXMgaXMgZXF1aXZhbGVudCB0byBjYWxsaW5nIHJvbGUucmVsYXRpb24oXCJ1c2Vyc1wiKTwvcD5cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5SZWxhdGlvbn0gdGhlIHJlbGF0aW9uIGZvciB0aGUgdXNlcnMgYmVsb25naW5nIHRvIHRoaXNcbiAgICAgKiAgICAgcm9sZS5cbiAgICAgKi9cbiAgICBnZXRVc2VyczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvbihcInVzZXJzXCIpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgUGFyc2UuUmVsYXRpb24gZm9yIHRoZSBQYXJzZS5Sb2xlcyB0aGF0IGFyZSBkaXJlY3RcbiAgICAgKiBjaGlsZHJlbiBvZiB0aGlzIHJvbGUuIFRoZXNlIHJvbGVzJyB1c2VycyBhcmUgZ3JhbnRlZCBhbnkgcHJpdmlsZWdlcyB0aGF0XG4gICAgICogdGhpcyByb2xlIGhhcyBiZWVuIGdyYW50ZWQgKGUuZy4gcmVhZCBvciB3cml0ZSBhY2Nlc3MgdGhyb3VnaCBBQ0xzKS4gWW91XG4gICAgICogY2FuIGFkZCBvciByZW1vdmUgY2hpbGQgcm9sZXMgZnJvbSB0aGlzIHJvbGUgdGhyb3VnaCB0aGlzIHJlbGF0aW9uLlxuICAgICAqIFxuICAgICAqIDxwPlRoaXMgaXMgZXF1aXZhbGVudCB0byBjYWxsaW5nIHJvbGUucmVsYXRpb24oXCJyb2xlc1wiKTwvcD5cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5SZWxhdGlvbn0gdGhlIHJlbGF0aW9uIGZvciB0aGUgcm9sZXMgYmVsb25naW5nIHRvIHRoaXNcbiAgICAgKiAgICAgcm9sZS5cbiAgICAgKi9cbiAgICBnZXRSb2xlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvbihcInJvbGVzXCIpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgICAgaWYgKFwibmFtZVwiIGluIGF0dHJzICYmIGF0dHJzLm5hbWUgIT09IHRoaXMuZ2V0TmFtZSgpKSB7XG4gICAgICAgIHZhciBuZXdOYW1lID0gYXR0cnMubmFtZTtcbiAgICAgICAgaWYgKHRoaXMuaWQgJiYgdGhpcy5pZCAhPT0gYXR0cnMub2JqZWN0SWQpIHtcbiAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIG9iamVjdElkIGJlaW5nIHNldCBtYXRjaGVzIHRoaXMuaWQuXG4gICAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGR1cmluZyBhIGZldGNoIC0tIHRoZSBpZCBpcyBzZXQgYmVmb3JlIGNhbGxpbmcgZmV0Y2guXG4gICAgICAgICAgLy8gTGV0IHRoZSBuYW1lIGJlIHNldCBpbiB0aGlzIGNhc2UuXG4gICAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgICAgXCJBIHJvbGUncyBuYW1lIGNhbiBvbmx5IGJlIHNldCBiZWZvcmUgaXQgaGFzIGJlZW4gc2F2ZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pc1N0cmluZyhuZXdOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICAgIFwiQSByb2xlJ3MgbmFtZSBtdXN0IGJlIGEgU3RyaW5nLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISgvXlswLTlhLXpBLVpcXC1fIF0rJC8pLnRlc3QobmV3TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgICBcIkEgcm9sZSdzIG5hbWUgY2FuIG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycywgXyxcIiArXG4gICAgICAgICAgICAgIFwiIC0sIGFuZCBzcGFjZXMuXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoUGFyc2UuT2JqZWN0LnByb3RvdHlwZS52YWxpZGF0ZSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LnByb3RvdHlwZS52YWxpZGF0ZS5jYWxsKHRoaXMsIGF0dHJzLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xufSh0aGlzKSk7XG5cblxuLypnbG9iYWwgXzogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugd2l0aCB0aGUgZ2l2ZW4gbW9kZWxzIGFuZCBvcHRpb25zLiAgVHlwaWNhbGx5LCB5b3VcbiAgICogd2lsbCBub3QgY2FsbCB0aGlzIG1ldGhvZCBkaXJlY3RseSwgYnV0IHdpbGwgaW5zdGVhZCBtYWtlIGEgc3ViY2xhc3MgdXNpbmdcbiAgICogPGNvZGU+UGFyc2UuQ29sbGVjdGlvbi5leHRlbmQ8L2NvZGU+LlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBtb2RlbHMgQW4gYXJyYXkgb2YgaW5zdGFuY2VzIG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+bW9kZWw6IFRoZSBQYXJzZS5PYmplY3Qgc3ViY2xhc3MgdGhhdCB0aGlzIGNvbGxlY3Rpb24gY29udGFpbnMuXG4gICAqICAgPGxpPnF1ZXJ5OiBBbiBpbnN0YW5jZSBvZiBQYXJzZS5RdWVyeSB0byB1c2Ugd2hlbiBmZXRjaGluZyBpdGVtcy5cbiAgICogICA8bGk+Y29tcGFyYXRvcjogQSBzdHJpbmcgcHJvcGVydHkgbmFtZSBvciBmdW5jdGlvbiB0byBzb3J0IGJ5LlxuICAgKiA8L3VsPlxuICAgKlxuICAgKiBAc2VlIFBhcnNlLkNvbGxlY3Rpb24uZXh0ZW5kXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5Qcm92aWRlcyBhIHN0YW5kYXJkIGNvbGxlY3Rpb24gY2xhc3MgZm9yIG91ciBzZXRzIG9mIG1vZGVscywgb3JkZXJlZFxuICAgKiBvciB1bm9yZGVyZWQuICBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZVxuICAgKiA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jQ29sbGVjdGlvblwiPkJhY2tib25lXG4gICAqIGRvY3VtZW50YXRpb248L2E+LjwvcD5cbiAgICovXG4gIFBhcnNlLkNvbGxlY3Rpb24gPSBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAob3B0aW9ucy5jb21wYXJhdG9yKSB7XG4gICAgICB0aGlzLmNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3I7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLm1vZGVsKSB7XG4gICAgICB0aGlzLm1vZGVsID0gb3B0aW9ucy5tb2RlbDtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucXVlcnkpIHtcbiAgICAgIHRoaXMucXVlcnkgPSBvcHRpb25zLnF1ZXJ5O1xuICAgIH1cbiAgICB0aGlzLl9yZXNldCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChtb2RlbHMpIHtcbiAgICAgIHRoaXMucmVzZXQobW9kZWxzLCB7c2lsZW50OiB0cnVlLCBwYXJzZTogb3B0aW9ucy5wYXJzZX0pO1xuICAgIH1cbiAgfTtcblxuICAvLyBEZWZpbmUgdGhlIENvbGxlY3Rpb24ncyBpbmhlcml0YWJsZSBtZXRob2RzLlxuICBfLmV4dGVuZChQYXJzZS5Db2xsZWN0aW9uLnByb3RvdHlwZSwgUGFyc2UuRXZlbnRzLFxuICAgICAgLyoqIEBsZW5kcyBQYXJzZS5Db2xsZWN0aW9uLnByb3RvdHlwZSAqLyB7XG5cbiAgICAvLyBUaGUgZGVmYXVsdCBtb2RlbCBmb3IgYSBjb2xsZWN0aW9uIGlzIGp1c3QgYSBQYXJzZS5PYmplY3QuXG4gICAgLy8gVGhpcyBzaG91bGQgYmUgb3ZlcnJpZGRlbiBpbiBtb3N0IGNhc2VzLlxuICAgIC8vIFRPRE86IHRoaW5rIGhhcmRlci4gdGhpcyBpcyBsaWtlbHkgdG8gYmUgd2VpcmQuXG4gICAgbW9kZWw6IFBhcnNlLk9iamVjdCxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuICAgICAqIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8qKlxuICAgICAqIFRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIGEgQ29sbGVjdGlvbiBpcyBhbiBhcnJheSBvZiB0aGVcbiAgICAgKiBtb2RlbHMnIGF0dHJpYnV0ZXMuXG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihtb2RlbCl7IHJldHVybiBtb2RlbC50b0pTT04oKTsgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIG1vZGVsLCBvciBsaXN0IG9mIG1vZGVscyB0byB0aGUgc2V0LiBQYXNzICoqc2lsZW50KiogdG8gYXZvaWRcbiAgICAgKiBmaXJpbmcgdGhlIGBhZGRgIGV2ZW50IGZvciBldmVyeSBuZXcgbW9kZWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RlbHMgQW4gYXJyYXkgb2YgaW5zdGFuY2VzIG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5hdDogVGhlIGluZGV4IGF0IHdoaWNoIHRvIGFkZCB0aGUgbW9kZWxzLlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgYWRkYCBldmVudCBmb3IgZXZlcnkgbmV3XG4gICAgICogICBtb2RlbC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIGFkZDogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgaSwgaW5kZXgsIGxlbmd0aCwgbW9kZWwsIGNpZCwgaWQsIGNpZHMgPSB7fSwgaWRzID0ge307XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIG1vZGVscyA9IF8uaXNBcnJheShtb2RlbHMpID8gbW9kZWxzLnNsaWNlKCkgOiBbbW9kZWxzXTtcblxuICAgICAgLy8gQmVnaW4gYnkgdHVybmluZyBiYXJlIG9iamVjdHMgaW50byBtb2RlbCByZWZlcmVuY2VzLCBhbmQgcHJldmVudGluZ1xuICAgICAgLy8gaW52YWxpZCBtb2RlbHMgb3IgZHVwbGljYXRlIG1vZGVscyBmcm9tIGJlaW5nIGFkZGVkLlxuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gbW9kZWxzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1vZGVsc1tpXSA9IHRoaXMuX3ByZXBhcmVNb2RlbChtb2RlbHNbaV0sIG9wdGlvbnMpO1xuICAgICAgICBtb2RlbCA9IG1vZGVsc1tpXTtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGFkZCBhbiBpbnZhbGlkIG1vZGVsIHRvIGEgY29sbGVjdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBjaWQgPSBtb2RlbC5jaWQ7XG4gICAgICAgIGlmIChjaWRzW2NpZF0gfHwgdGhpcy5fYnlDaWRbY2lkXSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBjaWQ6IGNhbid0IGFkZCB0aGUgc2FtZSBtb2RlbCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidG8gYSBjb2xsZWN0aW9uIHR3aWNlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlkID0gbW9kZWwuaWQ7XG4gICAgICAgIGlmICghUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKGlkKSAmJiAoaWRzW2lkXSB8fCB0aGlzLl9ieUlkW2lkXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEdXBsaWNhdGUgaWQ6IGNhbid0IGFkZCB0aGUgc2FtZSBtb2RlbCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidG8gYSBjb2xsZWN0aW9uIHR3aWNlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlkc1tpZF0gPSBtb2RlbDtcbiAgICAgICAgY2lkc1tjaWRdID0gbW9kZWw7XG4gICAgICB9XG5cbiAgICAgIC8vIExpc3RlbiB0byBhZGRlZCBtb2RlbHMnIGV2ZW50cywgYW5kIGluZGV4IG1vZGVscyBmb3IgbG9va3VwIGJ5XG4gICAgICAvLyBgaWRgIGFuZCBieSBgY2lkYC5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAobW9kZWwgPSBtb2RlbHNbaV0pLm9uKCdhbGwnLCB0aGlzLl9vbk1vZGVsRXZlbnQsIHRoaXMpO1xuICAgICAgICB0aGlzLl9ieUNpZFttb2RlbC5jaWRdID0gbW9kZWw7XG4gICAgICAgIGlmIChtb2RlbC5pZCkge1xuICAgICAgICAgIHRoaXMuX2J5SWRbbW9kZWwuaWRdID0gbW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSW5zZXJ0IG1vZGVscyBpbnRvIHRoZSBjb2xsZWN0aW9uLCByZS1zb3J0aW5nIGlmIG5lZWRlZCwgYW5kIHRyaWdnZXJpbmdcbiAgICAgIC8vIGBhZGRgIGV2ZW50cyB1bmxlc3Mgc2lsZW5jZWQuXG4gICAgICB0aGlzLmxlbmd0aCArPSBsZW5ndGg7XG4gICAgICBpbmRleCA9IFBhcnNlLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmF0KSA/IFxuICAgICAgICAgIHRoaXMubW9kZWxzLmxlbmd0aCA6IG9wdGlvbnMuYXQ7XG4gICAgICB0aGlzLm1vZGVscy5zcGxpY2UuYXBwbHkodGhpcy5tb2RlbHMsIFtpbmRleCwgMF0uY29uY2F0KG1vZGVscykpO1xuICAgICAgaWYgKHRoaXMuY29tcGFyYXRvcikge1xuICAgICAgICB0aGlzLnNvcnQoe3NpbGVudDogdHJ1ZX0pO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gdGhpcy5tb2RlbHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbW9kZWwgPSB0aGlzLm1vZGVsc1tpXTtcbiAgICAgICAgaWYgKGNpZHNbbW9kZWwuY2lkXSkge1xuICAgICAgICAgIG9wdGlvbnMuaW5kZXggPSBpO1xuICAgICAgICAgIG1vZGVsLnRyaWdnZXIoJ2FkZCcsIG1vZGVsLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIG1vZGVsLCBvciBhIGxpc3Qgb2YgbW9kZWxzIGZyb20gdGhlIHNldC4gUGFzcyBzaWxlbnQgdG8gYXZvaWRcbiAgICAgKiBmaXJpbmcgdGhlIDxjb2RlPnJlbW92ZTwvY29kZT4gZXZlbnQgZm9yIGV2ZXJ5IG1vZGVsIHJlbW92ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RlbHMgVGhlIG1vZGVsIG9yIGxpc3Qgb2YgbW9kZWxzIHRvIHJlbW92ZSBmcm9tIHRoZVxuICAgICAqICAgY29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOiA8dWw+XG4gICAgICogICA8bGk+c2lsZW50OiBTZXQgdG8gdHJ1ZSB0byBhdm9pZCBmaXJpbmcgdGhlIGByZW1vdmVgIGV2ZW50LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBpLCBsLCBpbmRleCwgbW9kZWw7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIG1vZGVscyA9IF8uaXNBcnJheShtb2RlbHMpID8gbW9kZWxzLnNsaWNlKCkgOiBbbW9kZWxzXTtcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBtb2RlbHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIG1vZGVsID0gdGhpcy5nZXRCeUNpZChtb2RlbHNbaV0pIHx8IHRoaXMuZ2V0KG1vZGVsc1tpXSk7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fYnlJZFttb2RlbC5pZF07XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ieUNpZFttb2RlbC5jaWRdO1xuICAgICAgICBpbmRleCA9IHRoaXMuaW5kZXhPZihtb2RlbCk7XG4gICAgICAgIHRoaXMubW9kZWxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMubGVuZ3RoLS07XG4gICAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICBvcHRpb25zLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgbW9kZWwudHJpZ2dlcigncmVtb3ZlJywgbW9kZWwsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlbW92ZVJlZmVyZW5jZShtb2RlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIG1vZGVsIGZyb20gdGhlIHNldCBieSBpZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIFBhcnNlIG9iamVjdElkIGlkZW50aWZ5aW5nIHRoZSBQYXJzZS5PYmplY3QgdG9cbiAgICAgKiBmZXRjaCBmcm9tIHRoaXMgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gaWQgJiYgdGhpcy5fYnlJZFtpZC5pZCB8fCBpZF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBtb2RlbCBmcm9tIHRoZSBzZXQgYnkgY2xpZW50IGlkLlxuICAgICAqIEBwYXJhbSB7fSBjaWQgVGhlIEJhY2tib25lIGNvbGxlY3Rpb24gaWQgaWRlbnRpZnlpbmcgdGhlIFBhcnNlLk9iamVjdCB0b1xuICAgICAqIGZldGNoIGZyb20gdGhpcyBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIGdldEJ5Q2lkOiBmdW5jdGlvbihjaWQpIHtcbiAgICAgIHJldHVybiBjaWQgJiYgdGhpcy5fYnlDaWRbY2lkLmNpZCB8fCBjaWRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBtb2RlbCBhdCB0aGUgZ2l2ZW4gaW5kZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBtb2RlbCB0byByZXR1cm4uXG4gICAgICovXG4gICAgYXQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbHNbaW5kZXhdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGb3JjZXMgdGhlIGNvbGxlY3Rpb24gdG8gcmUtc29ydCBpdHNlbGYuIFlvdSBkb24ndCBuZWVkIHRvIGNhbGwgdGhpc1xuICAgICAqIHVuZGVyIG5vcm1hbCBjaXJjdW1zdGFuY2VzLCBhcyB0aGUgc2V0IHdpbGwgbWFpbnRhaW4gc29ydCBvcmRlciBhcyBlYWNoXG4gICAgICogaXRlbSBpcyBhZGRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOiA8dWw+XG4gICAgICogICA8bGk+c2lsZW50OiBTZXQgdG8gdHJ1ZSB0byBhdm9pZCBmaXJpbmcgdGhlIGByZXNldGAgZXZlbnQuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBzb3J0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIGlmICghdGhpcy5jb21wYXJhdG9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNvcnQgYSBzZXQgd2l0aG91dCBhIGNvbXBhcmF0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBib3VuZENvbXBhcmF0b3IgPSBfLmJpbmQodGhpcy5jb21wYXJhdG9yLCB0aGlzKTtcbiAgICAgIGlmICh0aGlzLmNvbXBhcmF0b3IubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRoaXMubW9kZWxzID0gdGhpcy5zb3J0QnkoYm91bmRDb21wYXJhdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9kZWxzLnNvcnQoYm91bmRDb21wYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdyZXNldCcsIHRoaXMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBsdWNrcyBhbiBhdHRyaWJ1dGUgZnJvbSBlYWNoIG1vZGVsIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIFRoZSBhdHRyaWJ1dGUgdG8gcmV0dXJuIGZyb20gZWFjaCBtb2RlbCBpbiB0aGVcbiAgICAgKiBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIHBsdWNrOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gXy5tYXAodGhpcy5tb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKXsgcmV0dXJuIG1vZGVsLmdldChhdHRyKTsgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZW4geW91IGhhdmUgbW9yZSBpdGVtcyB0aGFuIHlvdSB3YW50IHRvIGFkZCBvciByZW1vdmUgaW5kaXZpZHVhbGx5LFxuICAgICAqIHlvdSBjYW4gcmVzZXQgdGhlIGVudGlyZSBzZXQgd2l0aCBhIG5ldyBsaXN0IG9mIG1vZGVscywgd2l0aG91dCBmaXJpbmdcbiAgICAgKiBhbnkgYGFkZGAgb3IgYHJlbW92ZWAgZXZlbnRzLiBGaXJlcyBgcmVzZXRgIHdoZW4gZmluaXNoZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RlbHMgVGhlIG1vZGVsIG9yIGxpc3Qgb2YgbW9kZWxzIHRvIHJlbW92ZSBmcm9tIHRoZVxuICAgICAqICAgY29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOiA8dWw+XG4gICAgICogICA8bGk+c2lsZW50OiBTZXQgdG8gdHJ1ZSB0byBhdm9pZCBmaXJpbmcgdGhlIGByZXNldGAgZXZlbnQuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBtb2RlbHMgPSBtb2RlbHMgfHwgW107XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5tb2RlbHMsIGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZVJlZmVyZW5jZShtb2RlbCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgICB0aGlzLmFkZChtb2RlbHMsIHtzaWxlbnQ6IHRydWUsIHBhcnNlOiBvcHRpb25zLnBhcnNlfSk7XG4gICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVzZXQnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBkZWZhdWx0IHNldCBvZiBtb2RlbHMgZm9yIHRoaXMgY29sbGVjdGlvbiwgcmVzZXR0aW5nIHRoZVxuICAgICAqIGNvbGxlY3Rpb24gd2hlbiB0aGV5IGFycml2ZS4gSWYgYGFkZDogdHJ1ZWAgaXMgcGFzc2VkLCBhcHBlbmRzIHRoZVxuICAgICAqIG1vZGVscyB0byB0aGUgY29sbGVjdGlvbiBpbnN0ZWFkIG9mIHJlc2V0dGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIGBhZGRgIG9yIGByZXNldGAgZXZlbnRzIGZvclxuICAgICAqICAgbW9kZWxzIGZldGNoZWQgYnkgdGhpcyBmZXRjaC5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCB1c2VzIHRoZSBNYXN0ZXIgS2V5IGZvclxuICAgICAqICAgICAgIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIGZldGNoOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgIGlmIChvcHRpb25zLnBhcnNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0aW9ucy5wYXJzZSA9IHRydWU7XG4gICAgICB9XG4gICAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXM7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLnF1ZXJ5IHx8IG5ldyBQYXJzZS5RdWVyeSh0aGlzLm1vZGVsKTtcbiAgICAgIHJldHVybiBxdWVyeS5maW5kKHtcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleVxuICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmFkZCkge1xuICAgICAgICAgIGNvbGxlY3Rpb24uYWRkKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbGxlY3Rpb24ucmVzZXQocmVzdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBhIG1vZGVsIGluIHRoaXMgY29sbGVjdGlvbi4gQWRkIHRoZSBtb2RlbCB0b1xuICAgICAqIHRoZSBjb2xsZWN0aW9uIGltbWVkaWF0ZWx5LCB1bmxlc3MgYHdhaXQ6IHRydWVgIGlzIHBhc3NlZCwgaW4gd2hpY2ggY2FzZVxuICAgICAqIHdlIHdhaXQgZm9yIHRoZSBzZXJ2ZXIgdG8gYWdyZWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BhcnNlLk9iamVjdH0gbW9kZWwgVGhlIG5ldyBtb2RlbCB0byBjcmVhdGUgYW5kIGFkZCB0byB0aGVcbiAgICAgKiAgIGNvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+d2FpdDogU2V0IHRvIHRydWUgdG8gd2FpdCBmb3IgdGhlIHNlcnZlciB0byBjb25maXJtIGNyZWF0aW9uIG9mIHRoZVxuICAgICAqICAgICAgIG1vZGVsIGJlZm9yZSBhZGRpbmcgaXQgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAgICogICA8bGk+c2lsZW50OiBTZXQgdG8gdHJ1ZSB0byBhdm9pZCBmaXJpbmcgYW4gYGFkZGAgZXZlbnQuXG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgdXNlcyB0aGUgTWFzdGVyIEtleSBmb3JcbiAgICAgKiAgICAgICB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG4gICAgICB2YXIgY29sbCA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcbiAgICAgIG1vZGVsID0gdGhpcy5fcHJlcGFyZU1vZGVsKG1vZGVsLCBvcHRpb25zKTtcbiAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFvcHRpb25zLndhaXQpIHtcbiAgICAgICAgY29sbC5hZGQobW9kZWwsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdmFyIHN1Y2Nlc3MgPSBvcHRpb25zLnN1Y2Nlc3M7XG4gICAgICBvcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihuZXh0TW9kZWwsIHJlc3AsIHhocikge1xuICAgICAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgY29sbC5hZGQobmV4dE1vZGVsLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgIHN1Y2Nlc3MobmV4dE1vZGVsLCByZXNwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXh0TW9kZWwudHJpZ2dlcignc3luYycsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIG1vZGVsLnNhdmUobnVsbCwgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gbW9kZWw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgcmVzcG9uc2UgaW50byBhIGxpc3Qgb2YgbW9kZWxzIHRvIGJlIGFkZGVkIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGlzIGp1c3QgdG8gcGFzcyBpdCB0aHJvdWdoLlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzcCwgeGhyKSB7XG4gICAgICByZXR1cm4gcmVzcDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJveHkgdG8gXydzIGNoYWluLiBDYW4ndCBiZSBwcm94aWVkIHRoZSBzYW1lIHdheSB0aGUgcmVzdCBvZiB0aGVcbiAgICAgKiB1bmRlcnNjb3JlIG1ldGhvZHMgYXJlIHByb3hpZWQgYmVjYXVzZSBpdCByZWxpZXMgb24gdGhlIHVuZGVyc2NvcmVcbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBjaGFpbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXyh0aGlzLm1vZGVscykuY2hhaW4oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgYWxsIGludGVybmFsIHN0YXRlLiBDYWxsZWQgd2hlbiB0aGUgY29sbGVjdGlvbiBpcyByZXNldC5cbiAgICAgKi9cbiAgICBfcmVzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMubW9kZWxzID0gW107XG4gICAgICB0aGlzLl9ieUlkICA9IHt9O1xuICAgICAgdGhpcy5fYnlDaWQgPSB7fTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJlcGFyZSBhIG1vZGVsIG9yIGhhc2ggb2YgYXR0cmlidXRlcyB0byBiZSBhZGRlZCB0byB0aGlzIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgX3ByZXBhcmVNb2RlbDogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghKG1vZGVsIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSkge1xuICAgICAgICB2YXIgYXR0cnMgPSBtb2RlbDtcbiAgICAgICAgb3B0aW9ucy5jb2xsZWN0aW9uID0gdGhpcztcbiAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbChhdHRycywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghbW9kZWwuX3ZhbGlkYXRlKG1vZGVsLmF0dHJpYnV0ZXMsIG9wdGlvbnMpKSB7XG4gICAgICAgICAgbW9kZWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghbW9kZWwuY29sbGVjdGlvbikge1xuICAgICAgICBtb2RlbC5jb2xsZWN0aW9uID0gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRvIHJlbW92ZSBhIG1vZGVsJ3MgdGllcyB0byBhIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgX3JlbW92ZVJlZmVyZW5jZTogZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgIGlmICh0aGlzID09PSBtb2RlbC5jb2xsZWN0aW9uKSB7XG4gICAgICAgIGRlbGV0ZSBtb2RlbC5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgbW9kZWwub2ZmKCdhbGwnLCB0aGlzLl9vbk1vZGVsRXZlbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgY2FsbGVkIGV2ZXJ5IHRpbWUgYSBtb2RlbCBpbiB0aGUgc2V0IGZpcmVzIGFuIGV2ZW50LlxuICAgICAqIFNldHMgbmVlZCB0byB1cGRhdGUgdGhlaXIgaW5kZXhlcyB3aGVuIG1vZGVscyBjaGFuZ2UgaWRzLiBBbGwgb3RoZXJcbiAgICAgKiBldmVudHMgc2ltcGx5IHByb3h5IHRocm91Z2guIFwiYWRkXCIgYW5kIFwicmVtb3ZlXCIgZXZlbnRzIHRoYXQgb3JpZ2luYXRlXG4gICAgICogaW4gb3RoZXIgY29sbGVjdGlvbnMgYXJlIGlnbm9yZWQuXG4gICAgICovXG4gICAgX29uTW9kZWxFdmVudDogZnVuY3Rpb24oZXYsIG1vZGVsLCBjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgICBpZiAoKGV2ID09PSAnYWRkJyB8fCBldiA9PT0gJ3JlbW92ZScpICYmIGNvbGxlY3Rpb24gIT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGV2ID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUobW9kZWwsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGVsICYmIGV2ID09PSAnY2hhbmdlOm9iamVjdElkJykge1xuICAgICAgICBkZWxldGUgdGhpcy5fYnlJZFttb2RlbC5wcmV2aW91cyhcIm9iamVjdElkXCIpXTtcbiAgICAgICAgdGhpcy5fYnlJZFttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgIH1cbiAgICAgIHRoaXMudHJpZ2dlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBVbmRlcnNjb3JlIG1ldGhvZHMgdGhhdCB3ZSB3YW50IHRvIGltcGxlbWVudCBvbiB0aGUgQ29sbGVjdGlvbi5cbiAgdmFyIG1ldGhvZHMgPSBbJ2ZvckVhY2gnLCAnZWFjaCcsICdtYXAnLCAncmVkdWNlJywgJ3JlZHVjZVJpZ2h0JywgJ2ZpbmQnLFxuICAgICdkZXRlY3QnLCAnZmlsdGVyJywgJ3NlbGVjdCcsICdyZWplY3QnLCAnZXZlcnknLCAnYWxsJywgJ3NvbWUnLCAnYW55JyxcbiAgICAnaW5jbHVkZScsICdjb250YWlucycsICdpbnZva2UnLCAnbWF4JywgJ21pbicsICdzb3J0QnknLCAnc29ydGVkSW5kZXgnLFxuICAgICd0b0FycmF5JywgJ3NpemUnLCAnZmlyc3QnLCAnaW5pdGlhbCcsICdyZXN0JywgJ2xhc3QnLCAnd2l0aG91dCcsICdpbmRleE9mJyxcbiAgICAnc2h1ZmZsZScsICdsYXN0SW5kZXhPZicsICdpc0VtcHR5JywgJ2dyb3VwQnknXTtcblxuICAvLyBNaXggaW4gZWFjaCBVbmRlcnNjb3JlIG1ldGhvZCBhcyBhIHByb3h5IHRvIGBDb2xsZWN0aW9uI21vZGVsc2AuXG4gIFBhcnNlLl9hcnJheUVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgUGFyc2UuQ29sbGVjdGlvbi5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9bbWV0aG9kXS5hcHBseShfLCBbdGhpcy5tb2RlbHNdLmNvbmNhdChfLnRvQXJyYXkoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHN1YmNsYXNzIG9mIDxjb2RlPlBhcnNlLkNvbGxlY3Rpb248L2NvZGU+LiAgRm9yIGV4YW1wbGUsPHByZT5cbiAgICogICB2YXIgTXlDb2xsZWN0aW9uID0gUGFyc2UuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgKiAgICAgLy8gSW5zdGFuY2UgcHJvcGVydGllc1xuICAgKlxuICAgKiAgICAgbW9kZWw6IE15Q2xhc3MsXG4gICAqICAgICBxdWVyeTogTXlRdWVyeSxcbiAgICpcbiAgICogICAgIGdldEZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICogICAgICAgcmV0dXJuIHRoaXMuYXQoMCk7XG4gICAqICAgICB9XG4gICAqICAgfSwge1xuICAgKiAgICAgLy8gQ2xhc3MgcHJvcGVydGllc1xuICAgKlxuICAgKiAgICAgbWFrZU9uZTogZnVuY3Rpb24oKSB7XG4gICAqICAgICAgIHJldHVybiBuZXcgTXlDb2xsZWN0aW9uKCk7XG4gICAqICAgICB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqICAgdmFyIGNvbGxlY3Rpb24gPSBuZXcgTXlDb2xsZWN0aW9uKCk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlUHJvcHMgSW5zdGFuY2UgcHJvcGVydGllcyBmb3IgdGhlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc1Byb3BzIENsYXNzIHByb3BlcmllcyBmb3IgdGhlIGNvbGxlY3Rpb24uXG4gICAqIEByZXR1cm4ge0NsYXNzfSBBIG5ldyBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5Db2xsZWN0aW9uPC9jb2RlPi5cbiAgICovXG4gIFBhcnNlLkNvbGxlY3Rpb24uZXh0ZW5kID0gUGFyc2UuX2V4dGVuZDtcblxufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIF86IGZhbHNlLCBkb2N1bWVudDogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0aW5nIGEgUGFyc2UuVmlldyBjcmVhdGVzIGl0cyBpbml0aWFsIGVsZW1lbnQgb3V0c2lkZSBvZiB0aGUgRE9NLFxuICAgKiBpZiBhbiBleGlzdGluZyBlbGVtZW50IGlzIG5vdCBwcm92aWRlZC4uLlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+QSBmb3JrIG9mIEJhY2tib25lLlZpZXcsIHByb3ZpZGVkIGZvciB5b3VyIGNvbnZlbmllbmNlLiAgSWYgeW91IHVzZSB0aGlzXG4gICAqIGNsYXNzLCB5b3UgbXVzdCBhbHNvIGluY2x1ZGUgalF1ZXJ5LCBvciBhbm90aGVyIGxpYnJhcnkgdGhhdCBwcm92aWRlcyBhXG4gICAqIGpRdWVyeS1jb21wYXRpYmxlICQgZnVuY3Rpb24uICBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZVxuICAgKiA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jVmlld1wiPkJhY2tib25lXG4gICAqIGRvY3VtZW50YXRpb248L2E+LjwvcD5cbiAgICogPHA+PHN0cm9uZz48ZW0+QXZhaWxhYmxlIGluIHRoZSBjbGllbnQgU0RLIG9ubHkuPC9lbT48L3N0cm9uZz48L3A+XG4gICAqL1xuICBQYXJzZS5WaWV3ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMuY2lkID0gXy51bmlxdWVJZCgndmlldycpO1xuICAgIHRoaXMuX2NvbmZpZ3VyZShvcHRpb25zIHx8IHt9KTtcbiAgICB0aGlzLl9lbnN1cmVFbGVtZW50KCk7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuICB9O1xuXG4gIC8vIENhY2hlZCByZWdleCB0byBzcGxpdCBrZXlzIGZvciBgZGVsZWdhdGVgLlxuICB2YXIgZXZlbnRTcGxpdHRlciA9IC9eKFxcUyspXFxzKiguKikkLztcblxuICAvLyBMaXN0IG9mIHZpZXcgb3B0aW9ucyB0byBiZSBtZXJnZWQgYXMgcHJvcGVydGllcy5cbiAgLy8gVE9ETzogaW5jbHVkZSBvYmplY3RJZCwgY3JlYXRlZEF0LCB1cGRhdGVkQXQ/XG4gIHZhciB2aWV3T3B0aW9ucyA9IFsnbW9kZWwnLCAnY29sbGVjdGlvbicsICdlbCcsICdpZCcsICdhdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICdjbGFzc05hbWUnLCAndGFnTmFtZSddO1xuXG4gIC8vIFNldCB1cCBhbGwgaW5oZXJpdGFibGUgKipQYXJzZS5WaWV3KiogcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbiAgXy5leHRlbmQoUGFyc2UuVmlldy5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgICAgICAgLyoqIEBsZW5kcyBQYXJzZS5WaWV3LnByb3RvdHlwZSAqLyB7XG5cbiAgICAvLyBUaGUgZGVmYXVsdCBgdGFnTmFtZWAgb2YgYSBWaWV3J3MgZWxlbWVudCBpcyBgXCJkaXZcImAuXG4gICAgdGFnTmFtZTogJ2RpdicsXG5cbiAgICAvKipcbiAgICAgKiBqUXVlcnkgZGVsZWdhdGUgZm9yIGVsZW1lbnQgbG9va3VwLCBzY29wZWQgdG8gRE9NIGVsZW1lbnRzIHdpdGhpbiB0aGVcbiAgICAgKiBjdXJyZW50IHZpZXcuIFRoaXMgc2hvdWxkIGJlIHByZWZlcmVkIHRvIGdsb2JhbCBsb29rdXBzIHdoZXJlIHBvc3NpYmxlLlxuICAgICAqL1xuICAgICQ6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy4kZWwuZmluZChzZWxlY3Rvcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuICAgICAqIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8qKlxuICAgICAqIFRoZSBjb3JlIGZ1bmN0aW9uIHRoYXQgeW91ciB2aWV3IHNob3VsZCBvdmVycmlkZSwgaW4gb3JkZXJcbiAgICAgKiB0byBwb3B1bGF0ZSBpdHMgZWxlbWVudCAoYHRoaXMuZWxgKSwgd2l0aCB0aGUgYXBwcm9wcmlhdGUgSFRNTC4gVGhlXG4gICAgICogY29udmVudGlvbiBpcyBmb3IgKipyZW5kZXIqKiB0byBhbHdheXMgcmV0dXJuIGB0aGlzYC5cbiAgICAgKi9cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGlzIHZpZXcgZnJvbSB0aGUgRE9NLiBOb3RlIHRoYXQgdGhlIHZpZXcgaXNuJ3QgcHJlc2VudCBpbiB0aGVcbiAgICAgKiBET00gYnkgZGVmYXVsdCwgc28gY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgYmUgYSBuby1vcC5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRm9yIHNtYWxsIGFtb3VudHMgb2YgRE9NIEVsZW1lbnRzLCB3aGVyZSBhIGZ1bGwtYmxvd24gdGVtcGxhdGUgaXNuJ3RcbiAgICAgKiBuZWVkZWQsIHVzZSAqKm1ha2UqKiB0byBtYW51ZmFjdHVyZSBlbGVtZW50cywgb25lIGF0IGEgdGltZS5cbiAgICAgKiA8cHJlPlxuICAgICAqICAgICB2YXIgZWwgPSB0aGlzLm1ha2UoJ2xpJywgeydjbGFzcyc6ICdyb3cnfSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZXNjYXBlKCd0aXRsZScpKTs8L3ByZT5cbiAgICAgKi9cbiAgICBtYWtlOiBmdW5jdGlvbih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjb250ZW50KSB7XG4gICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgUGFyc2UuJChlbCkuYXR0cihhdHRyaWJ1dGVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIFBhcnNlLiQoZWwpLmh0bWwoY29udGVudCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHZpZXcncyBlbGVtZW50IChgdGhpcy5lbGAgcHJvcGVydHkpLCBpbmNsdWRpbmcgZXZlbnRcbiAgICAgKiByZS1kZWxlZ2F0aW9uLlxuICAgICAqL1xuICAgIHNldEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGRlbGVnYXRlKSB7XG4gICAgICB0aGlzLiRlbCA9IFBhcnNlLiQoZWxlbWVudCk7XG4gICAgICB0aGlzLmVsID0gdGhpcy4kZWxbMF07XG4gICAgICBpZiAoZGVsZWdhdGUgIT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgY2FsbGJhY2tzLiAgPGNvZGU+dGhpcy5ldmVudHM8L2NvZGU+IGlzIGEgaGFzaCBvZlxuICAgICAqIDxwcmU+XG4gICAgICogKntcImV2ZW50IHNlbGVjdG9yXCI6IFwiY2FsbGJhY2tcIn0qXG4gICAgICpcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICdtb3VzZWRvd24gLnRpdGxlJzogICdlZGl0JyxcbiAgICAgKiAgICAgICAnY2xpY2sgLmJ1dHRvbic6ICAgICAnc2F2ZSdcbiAgICAgKiAgICAgICAnY2xpY2sgLm9wZW4nOiAgICAgICBmdW5jdGlvbihlKSB7IC4uLiB9XG4gICAgICogICAgIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKiBwYWlycy4gQ2FsbGJhY2tzIHdpbGwgYmUgYm91bmQgdG8gdGhlIHZpZXcsIHdpdGggYHRoaXNgIHNldCBwcm9wZXJseS5cbiAgICAgKiBVc2VzIGV2ZW50IGRlbGVnYXRpb24gZm9yIGVmZmljaWVuY3kuXG4gICAgICogT21pdHRpbmcgdGhlIHNlbGVjdG9yIGJpbmRzIHRoZSBldmVudCB0byBgdGhpcy5lbGAuXG4gICAgICogVGhpcyBvbmx5IHdvcmtzIGZvciBkZWxlZ2F0ZS1hYmxlIGV2ZW50czogbm90IGBmb2N1c2AsIGBibHVyYCwgYW5kXG4gICAgICogbm90IGBjaGFuZ2VgLCBgc3VibWl0YCwgYW5kIGByZXNldGAgaW4gSW50ZXJuZXQgRXhwbG9yZXIuXG4gICAgICovXG4gICAgZGVsZWdhdGVFdmVudHM6IGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgZXZlbnRzID0gZXZlbnRzIHx8IFBhcnNlLl9nZXRWYWx1ZSh0aGlzLCAnZXZlbnRzJyk7XG4gICAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGV2ZW50cywgZnVuY3Rpb24obWV0aG9kLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24obWV0aG9kKSkge1xuICAgICAgICAgIG1ldGhvZCA9IHNlbGZbZXZlbnRzW2tleV1dO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBcIicgKyBldmVudHNba2V5XSArICdcIiBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXRjaCA9IGtleS5tYXRjaChldmVudFNwbGl0dGVyKTtcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IG1hdGNoWzFdLCBzZWxlY3RvciA9IG1hdGNoWzJdO1xuICAgICAgICBtZXRob2QgPSBfLmJpbmQobWV0aG9kLCBzZWxmKTtcbiAgICAgICAgZXZlbnROYW1lICs9ICcuZGVsZWdhdGVFdmVudHMnICsgc2VsZi5jaWQ7XG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gJycpIHtcbiAgICAgICAgICBzZWxmLiRlbC5iaW5kKGV2ZW50TmFtZSwgbWV0aG9kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLiRlbC5kZWxlZ2F0ZShzZWxlY3RvciwgZXZlbnROYW1lLCBtZXRob2QpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXJzIGFsbCBjYWxsYmFja3MgcHJldmlvdXNseSBib3VuZCB0byB0aGUgdmlldyB3aXRoIGBkZWxlZ2F0ZUV2ZW50c2AuXG4gICAgICogWW91IHVzdWFsbHkgZG9uJ3QgbmVlZCB0byB1c2UgdGhpcywgYnV0IG1heSB3aXNoIHRvIGlmIHlvdSBoYXZlIG11bHRpcGxlXG4gICAgICogQmFja2JvbmUgdmlld3MgYXR0YWNoZWQgdG8gdGhlIHNhbWUgRE9NIGVsZW1lbnQuXG4gICAgICovXG4gICAgdW5kZWxlZ2F0ZUV2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC51bmJpbmQoJy5kZWxlZ2F0ZUV2ZW50cycgKyB0aGlzLmNpZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24gb2YgYSBWaWV3IHdpdGggYSBzZXQgb2Ygb3B0aW9ucy5cbiAgICAgKiBLZXlzIHdpdGggc3BlY2lhbCBtZWFuaW5nICoobW9kZWwsIGNvbGxlY3Rpb24sIGlkLCBjbGFzc05hbWUpKiwgYXJlXG4gICAgICogYXR0YWNoZWQgZGlyZWN0bHkgdG8gdGhlIHZpZXcuXG4gICAgICovXG4gICAgX2NvbmZpZ3VyZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBfLmVhY2godmlld09wdGlvbnMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgaWYgKG9wdGlvbnNbYXR0cl0pIHtcbiAgICAgICAgICBzZWxmW2F0dHJdID0gb3B0aW9uc1thdHRyXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhhdCB0aGUgVmlldyBoYXMgYSBET00gZWxlbWVudCB0byByZW5kZXIgaW50by5cbiAgICAgKiBJZiBgdGhpcy5lbGAgaXMgYSBzdHJpbmcsIHBhc3MgaXQgdGhyb3VnaCBgJCgpYCwgdGFrZSB0aGUgZmlyc3RcbiAgICAgKiBtYXRjaGluZyBlbGVtZW50LCBhbmQgcmUtYXNzaWduIGl0IHRvIGBlbGAuIE90aGVyd2lzZSwgY3JlYXRlXG4gICAgICogYW4gZWxlbWVudCBmcm9tIHRoZSBgaWRgLCBgY2xhc3NOYW1lYCBhbmQgYHRhZ05hbWVgIHByb3BlcnRpZXMuXG4gICAgICovXG4gICAgX2Vuc3VyZUVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLmVsKSB7XG4gICAgICAgIHZhciBhdHRycyA9IFBhcnNlLl9nZXRWYWx1ZSh0aGlzLCAnYXR0cmlidXRlcycpIHx8IHt9O1xuICAgICAgICBpZiAodGhpcy5pZCkge1xuICAgICAgICAgIGF0dHJzLmlkID0gdGhpcy5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jbGFzc05hbWUpIHtcbiAgICAgICAgICBhdHRyc1snY2xhc3MnXSA9IHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLm1ha2UodGhpcy50YWdOYW1lLCBhdHRycyksIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLmVsLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlUHJvcHMgSW5zdGFuY2UgcHJvcGVydGllcyBmb3IgdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc1Byb3BzIENsYXNzIHByb3BlcmllcyBmb3IgdGhlIHZpZXcuXG4gICAqIEByZXR1cm4ge0NsYXNzfSBBIG5ldyBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5WaWV3PC9jb2RlPi5cbiAgICovXG4gIFBhcnNlLlZpZXcuZXh0ZW5kID0gUGFyc2UuX2V4dGVuZDtcblxufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5BIFBhcnNlLlVzZXIgb2JqZWN0IGlzIGEgbG9jYWwgcmVwcmVzZW50YXRpb24gb2YgYSB1c2VyIHBlcnNpc3RlZCB0byB0aGVcbiAgICogUGFyc2UgY2xvdWQuIFRoaXMgY2xhc3MgaXMgYSBzdWJjbGFzcyBvZiBhIFBhcnNlLk9iamVjdCwgYW5kIHJldGFpbnMgdGhlXG4gICAqIHNhbWUgZnVuY3Rpb25hbGl0eSBvZiBhIFBhcnNlLk9iamVjdCwgYnV0IGFsc28gZXh0ZW5kcyBpdCB3aXRoIHZhcmlvdXNcbiAgICogdXNlciBzcGVjaWZpYyBtZXRob2RzLCBsaWtlIGF1dGhlbnRpY2F0aW9uLCBzaWduaW5nIHVwLCBhbmQgdmFsaWRhdGlvbiBvZlxuICAgKiB1bmlxdWVuZXNzLjwvcD5cbiAgICovXG4gIFBhcnNlLlVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiX1VzZXJcIiwgLyoqIEBsZW5kcyBQYXJzZS5Vc2VyLnByb3RvdHlwZSAqLyB7XG4gICAgLy8gSW5zdGFuY2UgVmFyaWFibGVzXG4gICAgX2lzQ3VycmVudFVzZXI6IGZhbHNlLFxuXG5cbiAgICAvLyBJbnN0YW5jZSBNZXRob2RzXG4gICAgXG4gICAgLyoqXG4gICAgICogTWVyZ2VzIGFub3RoZXIgb2JqZWN0J3MgYXR0cmlidXRlcyBpbnRvIHRoaXMgb2JqZWN0LlxuICAgICAqL1xuICAgIF9tZXJnZUZyb21PYmplY3Q6IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICBpZiAob3RoZXIuZ2V0U2Vzc2lvblRva2VuKCkpIHtcbiAgICAgICAgdGhpcy5fc2Vzc2lvblRva2VuID0gb3RoZXIuZ2V0U2Vzc2lvblRva2VuKCk7ICAgICAgXG4gICAgICB9ICAgIFxuICAgICAgUGFyc2UuVXNlci5fX3N1cGVyX18uX21lcmdlRnJvbU9iamVjdC5jYWxsKHRoaXMsIG90aGVyKTtcbiAgICB9LCAgICBcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0byBoYW5kbGUgc3BlY2lhbCBmaWVsZHMgaW4gYSBfVXNlciByZXNwb25zZS5cbiAgICAgKi9cbiAgICBfbWVyZ2VNYWdpY0ZpZWxkczogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgIGlmIChhdHRycy5zZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgdGhpcy5fc2Vzc2lvblRva2VuID0gYXR0cnMuc2Vzc2lvblRva2VuO1xuICAgICAgICBkZWxldGUgYXR0cnMuc2Vzc2lvblRva2VuO1xuICAgICAgfVxuICAgICAgUGFyc2UuVXNlci5fX3N1cGVyX18uX21lcmdlTWFnaWNGaWVsZHMuY2FsbCh0aGlzLCBhdHRycyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgbnVsbCB2YWx1ZXMgZnJvbSBhdXRoRGF0YSAod2hpY2ggZXhpc3QgdGVtcG9yYXJpbHkgZm9yXG4gICAgICogdW5saW5raW5nKVxuICAgICAqL1xuICAgIF9jbGVhbnVwQXV0aERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpO1xuICAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmdldCgnYXV0aERhdGEnKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIWF1dGhEYXRhW2tleV0pIHtcbiAgICAgICAgICBkZWxldGUgYXV0aERhdGFba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplcyBhdXRoRGF0YSBmb3IgYWxsIHByb3ZpZGVycy5cbiAgICAgKi9cbiAgICBfc3luY2hyb25pemVBbGxBdXRoRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKTtcbiAgICAgIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmdldCgnYXV0aERhdGEnKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBzZWxmLl9zeW5jaHJvbml6ZUF1dGhEYXRhKGtleSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemVzIGF1dGggZGF0YSBmb3IgYSBwcm92aWRlciAoZS5nLiBwdXRzIHRoZSBhY2Nlc3MgdG9rZW4gaW4gdGhlXG4gICAgICogcmlnaHQgcGxhY2UgdG8gYmUgdXNlZCBieSB0aGUgRmFjZWJvb2sgU0RLKS5cbiAgICAgKi9cbiAgICBfc3luY2hyb25pemVBdXRoRGF0YTogZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIGlmICghdGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgYXV0aFR5cGU7XG4gICAgICBpZiAoXy5pc1N0cmluZyhwcm92aWRlcikpIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlcjtcbiAgICAgICAgcHJvdmlkZXIgPSBQYXJzZS5Vc2VyLl9hdXRoUHJvdmlkZXJzW2F1dGhUeXBlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXIuZ2V0QXV0aFR5cGUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpO1xuICAgICAgaWYgKCFhdXRoRGF0YSB8fCAhcHJvdmlkZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHN1Y2Nlc3MgPSBwcm92aWRlci5yZXN0b3JlQXV0aGVudGljYXRpb24oYXV0aERhdGFbYXV0aFR5cGVdKTtcbiAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICB0aGlzLl91bmxpbmtGcm9tKHByb3ZpZGVyKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZVNhdmVSZXN1bHQ6IGZ1bmN0aW9uKG1ha2VDdXJyZW50KSB7XG4gICAgICAvLyBDbGVhbiB1cCBhbmQgc3luY2hyb25pemUgdGhlIGF1dGhEYXRhIG9iamVjdCwgcmVtb3ZpbmcgYW55IHVuc2V0IHZhbHVlc1xuICAgICAgaWYgKG1ha2VDdXJyZW50KSB7XG4gICAgICAgIHRoaXMuX2lzQ3VycmVudFVzZXIgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xlYW51cEF1dGhEYXRhKCk7XG4gICAgICB0aGlzLl9zeW5jaHJvbml6ZUFsbEF1dGhEYXRhKCk7XG4gICAgICAvLyBEb24ndCBrZWVwIHRoZSBwYXNzd29yZCBhcm91bmQuXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmVyRGF0YS5wYXNzd29yZDtcbiAgICAgIHRoaXMuX3JlYnVpbGRFc3RpbWF0ZWREYXRhRm9yS2V5KFwicGFzc3dvcmRcIik7XG4gICAgICB0aGlzLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgIGlmIChtYWtlQ3VycmVudCB8fCB0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgIFBhcnNlLlVzZXIuX3NhdmVDdXJyZW50VXNlcih0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5saWtlIGluIHRoZSBBbmRyb2lkL2lPUyBTREtzLCBsb2dJbldpdGggaXMgdW5uZWNlc3NhcnksIHNpbmNlIHlvdSBjYW5cbiAgICAgKiBjYWxsIGxpbmtXaXRoIG9uIHRoZSB1c2VyIChldmVuIGlmIGl0IGRvZXNuJ3QgZXhpc3QgeWV0IG9uIHRoZSBzZXJ2ZXIpLlxuICAgICAqL1xuICAgIF9saW5rV2l0aDogZnVuY3Rpb24ocHJvdmlkZXIsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdXRoVHlwZTtcbiAgICAgIGlmIChfLmlzU3RyaW5nKHByb3ZpZGVyKSkge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyO1xuICAgICAgICBwcm92aWRlciA9IFBhcnNlLlVzZXIuX2F1dGhQcm92aWRlcnNbcHJvdmlkZXJdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlci5nZXRBdXRoVHlwZSgpO1xuICAgICAgfVxuICAgICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhdXRoRGF0YScpKSB7XG4gICAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpIHx8IHt9O1xuICAgICAgICBhdXRoRGF0YVthdXRoVHlwZV0gPSBvcHRpb25zLmF1dGhEYXRhO1xuICAgICAgICB0aGlzLnNldCgnYXV0aERhdGEnLCBhdXRoRGF0YSk7XG5cbiAgICAgICAgLy8gT3ZlcnJpZGRlbiBzbyB0aGF0IHRoZSB1c2VyIGNhbiBiZSBtYWRlIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgICAgbmV3T3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdCh0cnVlKTtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLnNhdmUoeydhdXRoRGF0YSc6IGF1dGhEYXRhfSwgbmV3T3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgICAgcHJvdmlkZXIuYXV0aGVudGljYXRlKHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihwcm92aWRlciwgcmVzdWx0KSB7XG4gICAgICAgICAgICBzZWxmLl9saW5rV2l0aChwcm92aWRlciwge1xuICAgICAgICAgICAgICBhdXRoRGF0YTogcmVzdWx0LFxuICAgICAgICAgICAgICBzdWNjZXNzOiBvcHRpb25zLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgIGVycm9yOiBvcHRpb25zLmVycm9yXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoc2VsZik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihwcm92aWRlciwgZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3Ioc2VsZiwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmxpbmtzIGEgdXNlciBmcm9tIGEgc2VydmljZS5cbiAgICAgKi9cbiAgICBfdW5saW5rRnJvbTogZnVuY3Rpb24ocHJvdmlkZXIsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdXRoVHlwZTtcbiAgICAgIGlmIChfLmlzU3RyaW5nKHByb3ZpZGVyKSkge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyO1xuICAgICAgICBwcm92aWRlciA9IFBhcnNlLlVzZXIuX2F1dGhQcm92aWRlcnNbcHJvdmlkZXJdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlci5nZXRBdXRoVHlwZSgpO1xuICAgICAgfVxuICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgbmV3T3B0aW9ucy5hdXRoRGF0YSA9IG51bGw7XG4gICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBzZWxmLl9zeW5jaHJvbml6ZUF1dGhEYXRhKHByb3ZpZGVyKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuX2xpbmtXaXRoKHByb3ZpZGVyLCBuZXdPcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYSB1c2VyIGlzIGxpbmtlZCB0byBhIHNlcnZpY2UuXG4gICAgICovXG4gICAgX2lzTGlua2VkOiBmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgdmFyIGF1dGhUeXBlO1xuICAgICAgaWYgKF8uaXNTdHJpbmcocHJvdmlkZXIpKSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyLmdldEF1dGhUeXBlKCk7XG4gICAgICB9XG4gICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKSB8fCB7fTtcbiAgICAgIHJldHVybiAhIWF1dGhEYXRhW2F1dGhUeXBlXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGVhdXRoZW50aWNhdGVzIGFsbCBwcm92aWRlcnMuXG4gICAgICovXG4gICAgX2xvZ091dFdpdGhBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhEYXRhID0gdGhpcy5nZXQoJ2F1dGhEYXRhJyk7XG4gICAgICBpZiAoIWF1dGhEYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuZ2V0KCdhdXRoRGF0YScpLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHNlbGYuX2xvZ091dFdpdGgoa2V5KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZWF1dGhlbnRpY2F0ZXMgYSBzaW5nbGUgcHJvdmlkZXIgKGUuZy4gcmVtb3ZpbmcgYWNjZXNzIHRva2VucyBmcm9tIHRoZVxuICAgICAqIEZhY2Vib29rIFNESykuXG4gICAgICovXG4gICAgX2xvZ091dFdpdGg6IGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBpZiAoIXRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKF8uaXNTdHJpbmcocHJvdmlkZXIpKSB7XG4gICAgICAgIHByb3ZpZGVyID0gUGFyc2UuVXNlci5fYXV0aFByb3ZpZGVyc1twcm92aWRlcl07XG4gICAgICB9XG4gICAgICBpZiAocHJvdmlkZXIgJiYgcHJvdmlkZXIuZGVhdXRoZW50aWNhdGUpIHtcbiAgICAgICAgcHJvdmlkZXIuZGVhdXRoZW50aWNhdGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2lnbnMgdXAgYSBuZXcgdXNlci4gWW91IHNob3VsZCBjYWxsIHRoaXMgaW5zdGVhZCBvZiBzYXZlIGZvclxuICAgICAqIG5ldyBQYXJzZS5Vc2Vycy4gVGhpcyB3aWxsIGNyZWF0ZSBhIG5ldyBQYXJzZS5Vc2VyIG9uIHRoZSBzZXJ2ZXIsIGFuZFxuICAgICAqIGFsc28gcGVyc2lzdCB0aGUgc2Vzc2lvbiBvbiBkaXNrIHNvIHRoYXQgeW91IGNhbiBhY2Nlc3MgdGhlIHVzZXIgdXNpbmdcbiAgICAgKiA8Y29kZT5jdXJyZW50PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIDxwPkEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIG11c3QgYmUgc2V0IGJlZm9yZSBjYWxsaW5nIHNpZ25VcC48L3A+XG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRycyBFeHRyYSBmaWVsZHMgdG8gc2V0IG9uIHRoZSBuZXcgdXNlciwgb3IgbnVsbC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBzaWdudXBcbiAgICAgKiAgICAgZmluaXNoZXMuXG4gICAgICogQHNlZSBQYXJzZS5Vc2VyLnNpZ25VcFxuICAgICAqL1xuICAgIHNpZ25VcDogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBlcnJvcjtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgdXNlcm5hbWUgPSAoYXR0cnMgJiYgYXR0cnMudXNlcm5hbWUpIHx8IHRoaXMuZ2V0KFwidXNlcm5hbWVcIik7XG4gICAgICBpZiAoIXVzZXJuYW1lIHx8ICh1c2VybmFtZSA9PT0gXCJcIikpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgIFwiQ2Fubm90IHNpZ24gdXAgdXNlciB3aXRoIGFuIGVtcHR5IG5hbWUuXCIpO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgb3B0aW9ucy5lcnJvcih0aGlzLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFzc3dvcmQgPSAoYXR0cnMgJiYgYXR0cnMucGFzc3dvcmQpIHx8IHRoaXMuZ2V0KFwicGFzc3dvcmRcIik7XG4gICAgICBpZiAoIXBhc3N3b3JkIHx8IChwYXNzd29yZCA9PT0gXCJcIikpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgIFwiQ2Fubm90IHNpZ24gdXAgdXNlciB3aXRoIGFuIGVtcHR5IHBhc3N3b3JkLlwiKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgIG9wdGlvbnMuZXJyb3IodGhpcywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgLy8gT3ZlcnJpZGRlbiBzbyB0aGF0IHRoZSB1c2VyIGNhbiBiZSBtYWRlIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucyk7XG4gICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdCh0cnVlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuc2F2ZShhdHRycywgbmV3T3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3MgaW4gYSBQYXJzZS5Vc2VyLiBPbiBzdWNjZXNzLCB0aGlzIHNhdmVzIHRoZSBzZXNzaW9uIHRvIGxvY2FsU3RvcmFnZSxcbiAgICAgKiBzbyB5b3UgY2FuIHJldHJpZXZlIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgdXNpbmdcbiAgICAgKiA8Y29kZT5jdXJyZW50PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIDxwPkEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIG11c3QgYmUgc2V0IGJlZm9yZSBjYWxsaW5nIGxvZ0luLjwvcD5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIubG9nSW5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCB0aGUgdXNlciB3aGVuXG4gICAgICogICAgIHRoZSBsb2dpbiBpcyBjb21wbGV0ZS5cbiAgICAgKi9cbiAgICBsb2dJbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcImxvZ2luXCIsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgZGF0YTogdGhpcy50b0pTT04oKVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgIHZhciBzZXJ2ZXJBdHRycyA9IG1vZGVsLnBhcnNlKHJlc3AsIHN0YXR1cywgeGhyKTtcbiAgICAgICAgbW9kZWwuX2ZpbmlzaEZldGNoKHNlcnZlckF0dHJzKTtcbiAgICAgICAgbW9kZWwuX2hhbmRsZVNhdmVSZXN1bHQodHJ1ZSk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNzYXZlXG4gICAgICovXG4gICAgc2F2ZTogZnVuY3Rpb24oYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgdmFyIGksIGF0dHJzLCBjdXJyZW50LCBvcHRpb25zLCBzYXZlZDtcbiAgICAgIGlmIChfLmlzT2JqZWN0KGFyZzEpIHx8IF8uaXNOdWxsKGFyZzEpIHx8IF8uaXNVbmRlZmluZWQoYXJnMSkpIHtcbiAgICAgICAgYXR0cnMgPSBhcmcxO1xuICAgICAgICBvcHRpb25zID0gYXJnMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0ge307XG4gICAgICAgIGF0dHJzW2FyZzFdID0gYXJnMjtcbiAgICAgICAgb3B0aW9ucyA9IGFyZzM7XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpO1xuICAgICAgbmV3T3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgbW9kZWwuX2hhbmRsZVNhdmVSZXN1bHQoZmFsc2UpO1xuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LnByb3RvdHlwZS5zYXZlLmNhbGwodGhpcywgYXR0cnMsIG5ld09wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNmZXRjaFxuICAgICAqL1xuICAgIGZldGNoOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgbmV3T3B0aW9ucyA9IG9wdGlvbnMgPyBfLmNsb25lKG9wdGlvbnMpIDoge307XG4gICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdChmYWxzZSk7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5wcm90b3R5cGUuZmV0Y2guY2FsbCh0aGlzLCBuZXdPcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIDxjb2RlPmN1cnJlbnQ8L2NvZGU+IHdvdWxkIHJldHVybiB0aGlzIHVzZXIuXG4gICAgICogQHNlZSBQYXJzZS5Vc2VyI2N1cnJlbnRcbiAgICAgKi9cbiAgICBpc0N1cnJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzQ3VycmVudFVzZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZ2V0KFwidXNlcm5hbWVcIikuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I2dldFxuICAgICAqL1xuICAgIGdldFVzZXJuYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChcInVzZXJuYW1lXCIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxscyBzZXQoXCJ1c2VybmFtZVwiLCB1c2VybmFtZSwgb3B0aW9ucykgYW5kIHJldHVybnMgdGhlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQHNlZSBQYXJzZS5PYmplY3Quc2V0XG4gICAgICovXG4gICAgc2V0VXNlcm5hbWU6IGZ1bmN0aW9uKHVzZXJuYW1lLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoXCJ1c2VybmFtZVwiLCB1c2VybmFtZSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxzIHNldChcInBhc3N3b3JkXCIsIHBhc3N3b3JkLCBvcHRpb25zKSBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdC5zZXRcbiAgICAgKi9cbiAgICBzZXRQYXNzd29yZDogZnVuY3Rpb24ocGFzc3dvcmQsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChcInBhc3N3b3JkXCIsIHBhc3N3b3JkLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBnZXQoXCJlbWFpbFwiKS5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQHNlZSBQYXJzZS5PYmplY3QjZ2V0XG4gICAgICovXG4gICAgZ2V0RW1haWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwiZW1haWxcIik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxzIHNldChcImVtYWlsXCIsIGVtYWlsLCBvcHRpb25zKSBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdC5zZXRcbiAgICAgKi9cbiAgICBzZXRFbWFpbDogZnVuY3Rpb24oZW1haWwsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChcImVtYWlsXCIsIGVtYWlsLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhpcyB1c2VyIGlzIHRoZSBjdXJyZW50IHVzZXIgYW5kIGhhcyBiZWVuIGF1dGhlbnRpY2F0ZWQuXG4gICAgICogQHJldHVybiAoQm9vbGVhbikgd2hldGhlciB0aGlzIHVzZXIgaXMgdGhlIGN1cnJlbnQgdXNlciBhbmQgaXMgbG9nZ2VkIGluLlxuICAgICAqL1xuICAgIGF1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5fc2Vzc2lvblRva2VuICYmXG4gICAgICAgICAgKFBhcnNlLlVzZXIuY3VycmVudCgpICYmIFBhcnNlLlVzZXIuY3VycmVudCgpLmlkID09PSB0aGlzLmlkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2Vzc2lvbiB0b2tlbiBmb3IgdGhpcyB1c2VyLCBpZiB0aGUgdXNlciBoYXMgYmVlbiBsb2dnZWQgaW4sXG4gICAgICogb3IgaWYgaXQgaXMgdGhlIHJlc3VsdCBvZiBhIHF1ZXJ5IHdpdGggdGhlIG1hc3RlciBrZXkuIE90aGVyd2lzZSwgcmV0dXJuc1xuICAgICAqIHVuZGVmaW5lZC5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBzZXNzaW9uIHRva2VuLCBvciB1bmRlZmluZWRcbiAgICAgKi9cbiAgICBnZXRTZXNzaW9uVG9rZW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Nlc3Npb25Ub2tlbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdCBhIHJldm9jYWJsZSBzZXNzaW9uIHRva2VuIHRvIHJlcGxhY2UgdGhlIG9sZGVyIHN0eWxlIG9mIHRva2VuLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSByZXBsYWNlbWVudFxuICAgICAqICAgdG9rZW4gaGFzIGJlZW4gZmV0Y2hlZC5cbiAgICAgKi9cbiAgICBfdXBncmFkZVRvUmV2b2NhYmxlU2Vzc2lvbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAoIVBhcnNlLlVzZXIuY3VycmVudCgpKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKCkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgICB9XG4gICAgICB2YXIgY3VycmVudFNlc3Npb24gPSBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5nZXRTZXNzaW9uVG9rZW4oKTtcbiAgICAgIGlmIChQYXJzZS5TZXNzaW9uLl9pc1Jldm9jYWJsZShjdXJyZW50U2Vzc2lvbikpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiAndXBncmFkZVRvUmV2b2NhYmxlU2Vzc2lvbicsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBzZXNzaW9uVG9rZW46IGN1cnJlbnRTZXNzaW9uXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICB2YXIgc2Vzc2lvbiA9IG5ldyBQYXJzZS5TZXNzaW9uKCk7XG4gICAgICAgIHNlc3Npb24uX2ZpbmlzaEZldGNoKHJlc3VsdCk7XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFBhcnNlLlVzZXIuY3VycmVudCgpO1xuICAgICAgICBjdXJyZW50VXNlci5fc2Vzc2lvblRva2VuID0gc2Vzc2lvbi5nZXRTZXNzaW9uVG9rZW4oKTtcbiAgICAgICAgUGFyc2UuVXNlci5fc2F2ZUN1cnJlbnRVc2VyKGN1cnJlbnRVc2VyKTtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgfSwgLyoqIEBsZW5kcyBQYXJzZS5Vc2VyICovIHtcbiAgICAvLyBDbGFzcyBWYXJpYWJsZXNcblxuICAgIC8vIFRoZSBjdXJyZW50bHkgbG9nZ2VkLWluIHVzZXIuXG4gICAgX2N1cnJlbnRVc2VyOiBudWxsLFxuXG4gICAgLy8gV2hldGhlciBjdXJyZW50VXNlciBpcyBrbm93biB0byBtYXRjaCB0aGUgc2VyaWFsaXplZCB2ZXJzaW9uIG9uIGRpc2suXG4gICAgLy8gVGhpcyBpcyB1c2VmdWwgZm9yIHNhdmluZyBhIGxvY2Fsc3RvcmFnZSBjaGVjayBpZiB5b3UgdHJ5IHRvIGxvYWRcbiAgICAvLyBfY3VycmVudFVzZXIgZnJlcXVlbnRseSB3aGlsZSB0aGVyZSBpcyBub25lIHN0b3JlZC5cbiAgICBfY3VycmVudFVzZXJNYXRjaGVzRGlzazogZmFsc2UsXG5cbiAgICAvLyBUaGUgbG9jYWxTdG9yYWdlIGtleSBzdWZmaXggdGhhdCB0aGUgY3VycmVudCB1c2VyIGlzIHN0b3JlZCB1bmRlci5cbiAgICBfQ1VSUkVOVF9VU0VSX0tFWTogXCJjdXJyZW50VXNlclwiLFxuXG4gICAgLy8gVGhlIG1hcHBpbmcgb2YgYXV0aCBwcm92aWRlciBuYW1lcyB0byBhY3R1YWwgcHJvdmlkZXJzXG4gICAgX2F1dGhQcm92aWRlcnM6IHt9LFxuXG4gICAgLy8gV2hldGhlciB0byByZXdyaXRlIGNsYXNzTmFtZSBVc2VyIHRvIF9Vc2VyXG4gICAgX3BlcmZvcm1Vc2VyUmV3cml0ZTogdHJ1ZSxcblxuICAgIC8vIFdoZXRoZXIgdG8gc2VuZCBhIFJldm9jYWJsZSBTZXNzaW9uIGhlYWRlclxuICAgIF9pc1Jldm9jYWJsZVNlc3Npb25FbmFibGVkOiBmYWxzZSxcblxuXG4gICAgLy8gQ2xhc3MgTWV0aG9kc1xuXG4gICAgLyoqXG4gICAgICogU2lnbnMgdXAgYSBuZXcgdXNlciB3aXRoIGEgdXNlcm5hbWUgKG9yIGVtYWlsKSBhbmQgcGFzc3dvcmQuXG4gICAgICogVGhpcyB3aWxsIGNyZWF0ZSBhIG5ldyBQYXJzZS5Vc2VyIG9uIHRoZSBzZXJ2ZXIsIGFuZCBhbHNvIHBlcnNpc3QgdGhlXG4gICAgICogc2Vzc2lvbiBpbiBsb2NhbFN0b3JhZ2Ugc28gdGhhdCB5b3UgY2FuIGFjY2VzcyB0aGUgdXNlciB1c2luZ1xuICAgICAqIHtAbGluayAjY3VycmVudH0uXG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZSBUaGUgdXNlcm5hbWUgKG9yIGVtYWlsKSB0byBzaWduIHVwIHdpdGguXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBzaWduIHVwIHdpdGguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzIEV4dHJhIGZpZWxkcyB0byBzZXQgb24gdGhlIG5ldyB1c2VyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdpdGggdGhlIHVzZXIgd2hlblxuICAgICAqICAgICB0aGUgc2lnbnVwIGNvbXBsZXRlcy5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIjc2lnblVwXG4gICAgICovXG4gICAgc2lnblVwOiBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQsIGF0dHJzLCBvcHRpb25zKSB7XG4gICAgICBhdHRycyA9IGF0dHJzIHx8IHt9O1xuICAgICAgYXR0cnMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgIGF0dHJzLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgICB2YXIgdXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICByZXR1cm4gdXNlci5zaWduVXAoYXR0cnMsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGluIGEgdXNlciB3aXRoIGEgdXNlcm5hbWUgKG9yIGVtYWlsKSBhbmQgcGFzc3dvcmQuIE9uIHN1Y2Nlc3MsIHRoaXNcbiAgICAgKiBzYXZlcyB0aGUgc2Vzc2lvbiB0byBkaXNrLCBzbyB5b3UgY2FuIHJldHJpZXZlIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluXG4gICAgICogdXNlciB1c2luZyA8Y29kZT5jdXJyZW50PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZSAob3IgZW1haWwpIHRvIGxvZyBpbiB3aXRoLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gbG9nIGluIHdpdGguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCB0aGUgdXNlciB3aGVuXG4gICAgICogICAgIHRoZSBsb2dpbiBjb21wbGV0ZXMuXG4gICAgICogQHNlZSBQYXJzZS5Vc2VyI2xvZ0luXG4gICAgICovXG4gICAgbG9nSW46IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgb3B0aW9ucykge1xuICAgICAgdmFyIHVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgdXNlci5fZmluaXNoRmV0Y2goeyB1c2VybmFtZTogdXNlcm5hbWUsIHBhc3N3b3JkOiBwYXNzd29yZCB9KTtcbiAgICAgIHJldHVybiB1c2VyLmxvZ0luKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGluIGEgdXNlciB3aXRoIGEgc2Vzc2lvbiB0b2tlbi4gT24gc3VjY2VzcywgdGhpcyBzYXZlcyB0aGUgc2Vzc2lvblxuICAgICAqIHRvIGRpc2ssIHNvIHlvdSBjYW4gcmV0cmlldmUgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciB1c2luZ1xuICAgICAqIDxjb2RlPmN1cnJlbnQ8L2NvZGU+LlxuICAgICAqXG4gICAgICogPHA+Q2FsbHMgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3Igb24gY29tcGxldGlvbi48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2Vzc2lvblRva2VuIFRoZSBzZXNzaW9uVG9rZW4gdG8gbG9nIGluIHdpdGguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCB0aGUgdXNlciB3aGVuXG4gICAgICogICAgIHRoZSBsb2dpbiBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgYmVjb21lOiBmdW5jdGlvbihzZXNzaW9uVG9rZW4sIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgdXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJ1c2Vyc1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwibWVcIixcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBzZXNzaW9uVG9rZW46IHNlc3Npb25Ub2tlblxuICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuICAgICAgICB2YXIgc2VydmVyQXR0cnMgPSB1c2VyLnBhcnNlKHJlc3AsIHN0YXR1cywgeGhyKTtcbiAgICAgICAgdXNlci5fZmluaXNoRmV0Y2goc2VydmVyQXR0cnMpO1xuICAgICAgICB1c2VyLl9oYW5kbGVTYXZlUmVzdWx0KHRydWUpO1xuICAgICAgICByZXR1cm4gdXNlcjtcblxuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdXNlcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3Mgb3V0IHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgc2Vzc2lvbi4gVGhpcyB3aWxsIHJlbW92ZSB0aGVcbiAgICAgKiBzZXNzaW9uIGZyb20gZGlzaywgbG9nIG91dCBvZiBsaW5rZWQgc2VydmljZXMsIGFuZCBmdXR1cmUgY2FsbHMgdG9cbiAgICAgKiA8Y29kZT5jdXJyZW50PC9jb2RlPiB3aWxsIHJldHVybiA8Y29kZT5udWxsPC9jb2RlPi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBzZXNzaW9uIGlzXG4gICAgICogICBkZXN0cm95ZWQgb24gdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBsb2dPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRBc3luYygpLnRoZW4oZnVuY3Rpb24oY3VycmVudFVzZXIpIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSBQYXJzZS5TdG9yYWdlLnJlbW92ZUl0ZW1Bc3luYyhcbiAgICAgICAgICBQYXJzZS5fZ2V0UGFyc2VQYXRoKFBhcnNlLlVzZXIuX0NVUlJFTlRfVVNFUl9LRVkpKTtcblxuICAgICAgICBpZiAoY3VycmVudFVzZXIgIT09IG51bGwpIHtcbiAgICAgICAgICB2YXIgY3VycmVudFNlc3Npb24gPSBjdXJyZW50VXNlci5nZXRTZXNzaW9uVG9rZW4oKTtcbiAgICAgICAgICBpZiAoUGFyc2UuU2Vzc2lvbi5faXNSZXZvY2FibGUoY3VycmVudFNlc3Npb24pKSB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgcm91dGU6ICdsb2dvdXQnLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHNlc3Npb25Ub2tlbjogY3VycmVudFNlc3Npb25cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFVzZXIuX2xvZ091dFdpdGhBbGwoKTtcbiAgICAgICAgICBjdXJyZW50VXNlci5faXNDdXJyZW50VXNlciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyTWF0Y2hlc0Rpc2sgPSB0cnVlO1xuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlciA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdHMgYSBwYXNzd29yZCByZXNldCBlbWFpbCB0byBiZSBzZW50IHRvIHRoZSBzcGVjaWZpZWQgZW1haWwgYWRkcmVzc1xuICAgICAqIGFzc29jaWF0ZWQgd2l0aCB0aGUgdXNlciBhY2NvdW50LiBUaGlzIGVtYWlsIGFsbG93cyB0aGUgdXNlciB0byBzZWN1cmVseVxuICAgICAqIHJlc2V0IHRoZWlyIHBhc3N3b3JkIG9uIHRoZSBQYXJzZSBzaXRlLlxuICAgICAqXG4gICAgICogPHA+Q2FsbHMgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3Igb24gY29tcGxldGlvbi48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgVGhlIGVtYWlsIGFkZHJlc3MgYXNzb2NpYXRlZCB3aXRoIHRoZSB1c2VyIHRoYXRcbiAgICAgKiAgICAgZm9yZ290IHRoZWlyIHBhc3N3b3JkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICovXG4gICAgcmVxdWVzdFBhc3N3b3JkUmVzZXQ6IGZ1bmN0aW9uKGVtYWlsLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJyZXF1ZXN0UGFzc3dvcmRSZXNldFwiLFxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBkYXRhOiB7IGVtYWlsOiBlbWFpbCB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXF1ZXN0Ll90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gUGFyc2VVc2VyIHdpdGggYSB2YWxpZCBzZXNzaW9uLFxuICAgICAqIGVpdGhlciBmcm9tIG1lbW9yeSBvciBsb2NhbFN0b3JhZ2UsIGlmIG5lY2Vzc2FyeS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5PYmplY3R9IFRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIFBhcnNlLlVzZXIuXG4gICAgICovXG4gICAgY3VycmVudDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoUGFyc2UuU3RvcmFnZS5hc3luYykge1xuICAgICAgICAvLyBXZSBjYW4ndCByZXR1cm4gdGhlIGN1cnJlbnQgdXNlciBzeW5jaHJvbm91c2x5XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRBc3luYygpO1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcikge1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgICB9XG5cbiAgICAgIGlmIChQYXJzZS5Vc2VyLl9jdXJyZW50VXNlck1hdGNoZXNEaXNrKSB7XG4gICAgICAgIC8vIFRPRE86IExhemlseSBsb2cgaW4gYW5vbnltb3VzIHVzZXIuXG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcjtcbiAgICAgIH1cblxuICAgICAgLy8gTG9hZCB0aGUgdXNlciBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlck1hdGNoZXNEaXNrID0gdHJ1ZTtcblxuICAgICAgdmFyIHVzZXJEYXRhID0gUGFyc2UuU3RvcmFnZS5nZXRJdGVtKFBhcnNlLl9nZXRQYXJzZVBhdGgoXG4gICAgICAgICAgUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSkpO1xuICAgICAgaWYgKCF1c2VyRGF0YSkge1xuICAgICAgICAvLyBUT0RPOiBMYXppbHkgbG9nIGluIGFub255bW91cyB1c2VyLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoXCJfVXNlclwiKTtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9pc0N1cnJlbnRVc2VyID0gdHJ1ZTtcblxuICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKHVzZXJEYXRhKTtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLmlkID0ganNvbi5faWQ7XG4gICAgICBkZWxldGUganNvbi5faWQ7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fc2Vzc2lvblRva2VuID0ganNvbi5fc2Vzc2lvblRva2VuO1xuICAgICAgZGVsZXRlIGpzb24uX3Nlc3Npb25Ub2tlbjtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9maW5pc2hGZXRjaChqc29uKTtcblxuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3N5bmNocm9uaXplQWxsQXV0aERhdGEoKTtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9vcFNldFF1ZXVlID0gW3t9XTtcbiAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIFBhcnNlVXNlciBmcm9tIGFzeW5jaHJvbm91cyBTdG9yYWdlLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgUHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIGN1cnJlbnRseVxuICAgICAqICAgbG9nZ2VkIGluIFBhcnNlIFVzZXJcbiAgICAgKi9cbiAgICBfY3VycmVudEFzeW5jOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcikge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChQYXJzZS5Vc2VyLl9jdXJyZW50VXNlck1hdGNoZXNEaXNrKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9hZCB0aGUgdXNlciBmcm9tIFN0b3JhZ2VcbiAgICAgIHJldHVybiBQYXJzZS5TdG9yYWdlLmdldEl0ZW1Bc3luYyhQYXJzZS5fZ2V0UGFyc2VQYXRoKFxuICAgICAgICBQYXJzZS5Vc2VyLl9DVVJSRU5UX1VTRVJfS0VZKSkudGhlbihmdW5jdGlvbih1c2VyRGF0YSkge1xuICAgICAgICBpZiAoIXVzZXJEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5faXNDdXJyZW50VXNlciA9IHRydWU7XG5cbiAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKHVzZXJEYXRhKTtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuaWQgPSBqc29uLl9pZDtcbiAgICAgICAgZGVsZXRlIGpzb24uX2lkO1xuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fc2Vzc2lvblRva2VuID0ganNvbi5fc2Vzc2lvblRva2VuO1xuICAgICAgICBkZWxldGUganNvbi5fc2Vzc2lvblRva2VuO1xuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fZmluaXNoRmV0Y2goanNvbik7XG5cbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3N5bmNocm9uaXplQWxsQXV0aERhdGEoKTtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fb3BTZXRRdWV1ZSA9IFt7fV07XG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcjtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBbGxvdyBzb21lb25lIHRvIGRlZmluZSBhIGN1c3RvbSBVc2VyIGNsYXNzIHdpdGhvdXQgY2xhc3NOYW1lXG4gICAgICogYmVpbmcgcmV3cml0dGVuIHRvIF9Vc2VyLiBUaGUgZGVmYXVsdCBiZWhhdmlvciBpcyB0byByZXdyaXRlXG4gICAgICogVXNlciB0byBfVXNlciBmb3IgbGVnYWN5IHJlYXNvbnMuIFRoaXMgYWxsb3dzIGRldmVsb3BlcnMgdG9cbiAgICAgKiBvdmVycmlkZSB0aGF0IGJlaGF2aW9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBpc0FsbG93ZWQgV2hldGhlciBvciBub3QgdG8gYWxsb3cgY3VzdG9tIFVzZXIgY2xhc3NcbiAgICAgKi9cbiAgICBhbGxvd0N1c3RvbVVzZXJDbGFzczogZnVuY3Rpb24oaXNBbGxvd2VkKSB7XG4gICAgICB0aGlzLl9wZXJmb3JtVXNlclJld3JpdGUgPSAhaXNBbGxvd2VkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBbGxvdyBhIGxlZ2FjeSBhcHBsaWNhdGlvbiB0byBzdGFydCB1c2luZyByZXZvY2FibGUgc2Vzc2lvbnMuIElmIHRoZVxuICAgICAqIGN1cnJlbnQgc2Vzc2lvbiB0b2tlbiBpcyBub3QgcmV2b2NhYmxlLCBhIHJlcXVlc3Qgd2lsbCBiZSBtYWRlIGZvciBhIG5ldyxcbiAgICAgKiByZXZvY2FibGUgc2Vzc2lvbi5cbiAgICAgKiBJdCBpcyBub3QgbmVjZXNzYXJ5IHRvIGNhbGwgdGhpcyBtZXRob2QgZnJvbSBjbG91ZCBjb2RlIHVubGVzcyB5b3UgYXJlXG4gICAgICogaGFuZGxpbmcgdXNlciBzaWdudXAgb3IgbG9naW4gZnJvbSB0aGUgc2VydmVyIHNpZGUuIEluIGEgY2xvdWQgY29kZSBjYWxsLFxuICAgICAqIHRoaXMgZnVuY3Rpb24gd2lsbCBub3QgYXR0ZW1wdCB0byB1cGdyYWRlIHRoZSBjdXJyZW50IHRva2VuLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBwcm9jZXNzIGhhc1xuICAgICAqICAgY29tcGxldGVkLiBJZiBhIHJlcGxhY2VtZW50IHNlc3Npb24gdG9rZW4gaXMgcmVxdWVzdGVkLCB0aGUgcHJvbWlzZVxuICAgICAqICAgd2lsbCBiZSByZXNvbHZlZCBhZnRlciBhIG5ldyB0b2tlbiBoYXMgYmVlbiBmZXRjaGVkLlxuICAgICAqL1xuICAgIGVuYWJsZVJldm9jYWJsZVNlc3Npb246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgUGFyc2UuVXNlci5faXNSZXZvY2FibGVTZXNzaW9uRW5hYmxlZCA9IHRydWU7XG4gICAgICBpZiAoIVBhcnNlLl9pc05vZGUgJiYgUGFyc2UuVXNlci5jdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuY3VycmVudCgpLl91cGdyYWRlVG9SZXZvY2FibGVTZXNzaW9uKG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUGVyc2lzdHMgYSB1c2VyIGFzIGN1cnJlbnRVc2VyIHRvIGxvY2FsU3RvcmFnZSwgYW5kIGludG8gdGhlIHNpbmdsZXRvbi5cbiAgICAgKi9cbiAgICBfc2F2ZUN1cnJlbnRVc2VyOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXIgIT09IG51bGwgJiZcbiAgICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlciAhPT0gdXNlcikge1xuICAgICAgICBQYXJzZS5Vc2VyLmxvZ091dCgpO1xuICAgICAgfVxuICAgICAgdXNlci5faXNDdXJyZW50VXNlciA9IHRydWU7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlck1hdGNoZXNEaXNrID0gdHJ1ZTtcblxuICAgICAgdmFyIGpzb24gPSB1c2VyLnRvSlNPTigpO1xuICAgICAganNvbi5faWQgPSB1c2VyLmlkO1xuICAgICAganNvbi5fc2Vzc2lvblRva2VuID0gdXNlci5fc2Vzc2lvblRva2VuO1xuICAgICAgaWYgKFBhcnNlLlN0b3JhZ2UuYXN5bmMpIHtcbiAgICAgICAgUGFyc2UuU3RvcmFnZS5zZXRJdGVtQXN5bmMoXG4gICAgICAgICAgUGFyc2UuX2dldFBhcnNlUGF0aChQYXJzZS5Vc2VyLl9DVVJSRU5UX1VTRVJfS0VZKSxcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShqc29uKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBQYXJzZS5TdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgUGFyc2UuX2dldFBhcnNlUGF0aChQYXJzZS5Vc2VyLl9DVVJSRU5UX1VTRVJfS0VZKSxcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShqc29uKSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9yZWdpc3RlckF1dGhlbnRpY2F0aW9uUHJvdmlkZXI6IGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBQYXJzZS5Vc2VyLl9hdXRoUHJvdmlkZXJzW3Byb3ZpZGVyLmdldEF1dGhUeXBlKCldID0gcHJvdmlkZXI7XG4gICAgICAvLyBTeW5jaHJvbml6ZSB0aGUgY3VycmVudCB1c2VyIHdpdGggdGhlIGF1dGggcHJvdmlkZXIuXG4gICAgICBpZiAoUGFyc2UuVXNlci5jdXJyZW50KCkpIHtcbiAgICAgICAgUGFyc2UuVXNlci5jdXJyZW50KCkuX3N5bmNocm9uaXplQXV0aERhdGEocHJvdmlkZXIuZ2V0QXV0aFR5cGUoKSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9sb2dJbldpdGg6IGZ1bmN0aW9uKHByb3ZpZGVyLCBvcHRpb25zKSB7XG4gICAgICB2YXIgdXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICByZXR1cm4gdXNlci5fbGlua1dpdGgocHJvdmlkZXIsIG9wdGlvbnMpO1xuICAgIH1cblxuICB9KTtcbn0odGhpcykpO1xuXG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+QSBQYXJzZS5TZXNzaW9uIG9iamVjdCBpcyBhIGxvY2FsIHJlcHJlc2VudGF0aW9uIG9mIGEgcmV2b2NhYmxlIHNlc3Npb24uXG4gICAqIFRoaXMgY2xhc3MgaXMgYSBzdWJjbGFzcyBvZiBhIFBhcnNlLk9iamVjdCwgYW5kIHJldGFpbnMgdGhlIHNhbWVcbiAgICogZnVuY3Rpb25hbGl0eSBvZiBhIFBhcnNlLk9iamVjdC48L3A+XG4gICAqL1xuICBQYXJzZS5TZXNzaW9uID0gUGFyc2UuT2JqZWN0LmV4dGVuZCgnX1Nlc3Npb24nLFxuICAvKiogQGxlbmRzIFBhcnNlLlNlc3Npb24ucHJvdG90eXBlICovXG4gIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZXNzaW9uIHRva2VuIHN0cmluZy5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0U2Vzc2lvblRva2VuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXNzaW9uVG9rZW47XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0byBoYW5kbGUgc3BlY2lhbCBmaWVsZHMgaW4gYSBfU2Vzc2lvbiByZXNwb25zZS5cbiAgICAgKi9cbiAgICBfbWVyZ2VNYWdpY0ZpZWxkczogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgIGlmIChhdHRycy5zZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgdGhpcy5fc2Vzc2lvblRva2VuID0gYXR0cnMuc2Vzc2lvblRva2VuO1xuICAgICAgICBkZWxldGUgYXR0cnMuc2Vzc2lvblRva2VuO1xuICAgICAgfVxuICAgICAgUGFyc2UuU2Vzc2lvbi5fX3N1cGVyX18uX21lcmdlTWFnaWNGaWVsZHMuY2FsbCh0aGlzLCBhdHRycyk7XG4gICAgfSxcbiAgfSwgLyoqIEBsZW5kcyBQYXJzZS5TZXNzaW9uICovIHtcblxuICAgIC8vIFRocm93IGFuIGVycm9yIHdoZW4gbW9kaWZ5aW5nIHRoZXNlIHJlYWQtb25seSBmaWVsZHNcbiAgICByZWFkT25seUF0dHJpYnV0ZXM6IHtcbiAgICAgIGNyZWF0ZWRXaXRoOiB0cnVlLFxuICAgICAgZXhwaXJlc0F0OiB0cnVlLFxuICAgICAgaW5zdGFsbGF0aW9uSWQ6IHRydWUsXG4gICAgICByZXN0cmljdGVkOiB0cnVlLFxuICAgICAgc2Vzc2lvblRva2VuOiB0cnVlLFxuICAgICAgdXNlcjogdHJ1ZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIFNlc3Npb24gb2JqZWN0IGZvciB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiBzZXNzaW9uLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIFBhcnNlLlNlc3Npb25cbiAgICAgKiAgIG9iamVjdCBhZnRlciBpdCBoYXMgYmVlbiBmZXRjaGVkLlxuICAgICAqL1xuICAgIGN1cnJlbnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgc2Vzc2lvbiA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKCdfU2Vzc2lvbicpO1xuICAgICAgdmFyIGN1cnJlbnRUb2tlbiA9IFBhcnNlLlVzZXIuY3VycmVudCgpLmdldFNlc3Npb25Ub2tlbigpO1xuICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6ICdzZXNzaW9ucycsXG4gICAgICAgIGNsYXNzTmFtZTogJ21lJyxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgc2Vzc2lvblRva2VuOiBjdXJyZW50VG9rZW5cbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgdmFyIHNlcnZlckF0dHJzID0gc2Vzc2lvbi5wYXJzZShyZXNwLCBzdGF0dXMsIHhocik7XG4gICAgICAgIHNlc3Npb24uX2ZpbmlzaEZldGNoKHNlcnZlckF0dHJzKTtcbiAgICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCBzZXNzaW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc2Vzc2lvbiB0b2tlbiBpcyByZXZvY2FibGUuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBfaXNSZXZvY2FibGU6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICByZXR1cm4gdG9rZW4uaW5kZXhPZigncjonKSA+IC0xO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0b2tlbiBpcyByZXZvY2FibGUuXG4gICAgICogVGhpcyBtZXRob2QgaXMgdXNlZnVsIGZvciBtaWdyYXRpbmcgRXhwcmVzcy5qcyBvciBOb2RlLmpzIHdlYiBhcHBzIHRvXG4gICAgICogdXNlIHJldm9jYWJsZSBzZXNzaW9ucy4gSWYgeW91IGFyZSBtaWdyYXRpbmcgYW4gYXBwIHRoYXQgdXNlcyB0aGUgUGFyc2VcbiAgICAgKiBTREsgaW4gdGhlIGJyb3dzZXIgb25seSwgcGxlYXNlIHVzZSBQYXJzZS5Vc2VyLmVuYWJsZVJldm9jYWJsZVNlc3Npb24oKVxuICAgICAqIGluc3RlYWQsIHNvIHRoYXQgc2Vzc2lvbnMgY2FuIGJlIGF1dG9tYXRpY2FsbHkgdXBncmFkZWQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0N1cnJlbnRTZXNzaW9uUmV2b2NhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChQYXJzZS5Vc2VyLmN1cnJlbnQoKSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gUGFyc2UuU2Vzc2lvbi5faXNSZXZvY2FibGUoXG4gICAgICAgICAgUGFyc2UuVXNlci5jdXJyZW50KCkuZ2V0U2Vzc2lvblRva2VuKClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSkodGhpcyk7XG5cbi8vIFBhcnNlLlF1ZXJ5IGlzIGEgd2F5IHRvIGNyZWF0ZSBhIGxpc3Qgb2YgUGFyc2UuT2JqZWN0cy5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgcGFyc2UgUGFyc2UuUXVlcnkgZm9yIHRoZSBnaXZlbiBQYXJzZS5PYmplY3Qgc3ViY2xhc3MuXG4gICAqIEBwYXJhbSBvYmplY3RDbGFzcyAtXG4gICAqICAgQW4gaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PYmplY3QsIG9yIGEgUGFyc2UgY2xhc3NOYW1lIHN0cmluZy5cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPlBhcnNlLlF1ZXJ5IGRlZmluZXMgYSBxdWVyeSB0aGF0IGlzIHVzZWQgdG8gZmV0Y2ggUGFyc2UuT2JqZWN0cy4gVGhlXG4gICAqIG1vc3QgY29tbW9uIHVzZSBjYXNlIGlzIGZpbmRpbmcgYWxsIG9iamVjdHMgdGhhdCBtYXRjaCBhIHF1ZXJ5IHRocm91Z2ggdGhlXG4gICAqIDxjb2RlPmZpbmQ8L2NvZGU+IG1ldGhvZC4gRm9yIGV4YW1wbGUsIHRoaXMgc2FtcGxlIGNvZGUgZmV0Y2hlcyBhbGwgb2JqZWN0c1xuICAgKiBvZiBjbGFzcyA8Y29kZT5NeUNsYXNzPC9jb2RlPi4gSXQgY2FsbHMgYSBkaWZmZXJlbnQgZnVuY3Rpb24gZGVwZW5kaW5nIG9uXG4gICAqIHdoZXRoZXIgdGhlIGZldGNoIHN1Y2NlZWRlZCBvciBub3QuXG4gICAqIFxuICAgKiA8cHJlPlxuICAgKiB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoTXlDbGFzcyk7XG4gICAqIHF1ZXJ5LmZpbmQoe1xuICAgKiAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICogICAgIC8vIHJlc3VsdHMgaXMgYW4gYXJyYXkgb2YgUGFyc2UuT2JqZWN0LlxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAvLyBlcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvci5cbiAgICogICB9XG4gICAqIH0pOzwvcHJlPjwvcD5cbiAgICogXG4gICAqIDxwPkEgUGFyc2UuUXVlcnkgY2FuIGFsc28gYmUgdXNlZCB0byByZXRyaWV2ZSBhIHNpbmdsZSBvYmplY3Qgd2hvc2UgaWQgaXNcbiAgICoga25vd24sIHRocm91Z2ggdGhlIGdldCBtZXRob2QuIEZvciBleGFtcGxlLCB0aGlzIHNhbXBsZSBjb2RlIGZldGNoZXMgYW5cbiAgICogb2JqZWN0IG9mIGNsYXNzIDxjb2RlPk15Q2xhc3M8L2NvZGU+IGFuZCBpZCA8Y29kZT5teUlkPC9jb2RlPi4gSXQgY2FsbHMgYVxuICAgKiBkaWZmZXJlbnQgZnVuY3Rpb24gZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIGZldGNoIHN1Y2NlZWRlZCBvciBub3QuXG4gICAqIFxuICAgKiA8cHJlPlxuICAgKiB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoTXlDbGFzcyk7XG4gICAqIHF1ZXJ5LmdldChteUlkLCB7XG4gICAqICAgc3VjY2VzczogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAqICAgICAvLyBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuT2JqZWN0LlxuICAgKiAgIH0sXG4gICAqXG4gICAqICAgZXJyb3I6IGZ1bmN0aW9uKG9iamVjdCwgZXJyb3IpIHtcbiAgICogICAgIC8vIGVycm9yIGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLkVycm9yLlxuICAgKiAgIH1cbiAgICogfSk7PC9wcmU+PC9wPlxuICAgKiBcbiAgICogPHA+QSBQYXJzZS5RdWVyeSBjYW4gYWxzbyBiZSB1c2VkIHRvIGNvdW50IHRoZSBudW1iZXIgb2Ygb2JqZWN0cyB0aGF0IG1hdGNoXG4gICAqIHRoZSBxdWVyeSB3aXRob3V0IHJldHJpZXZpbmcgYWxsIG9mIHRob3NlIG9iamVjdHMuIEZvciBleGFtcGxlLCB0aGlzXG4gICAqIHNhbXBsZSBjb2RlIGNvdW50cyB0aGUgbnVtYmVyIG9mIG9iamVjdHMgb2YgdGhlIGNsYXNzIDxjb2RlPk15Q2xhc3M8L2NvZGU+XG4gICAqIDxwcmU+XG4gICAqIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShNeUNsYXNzKTtcbiAgICogcXVlcnkuY291bnQoe1xuICAgKiAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgKiAgICAgLy8gVGhlcmUgYXJlIG51bWJlciBpbnN0YW5jZXMgb2YgTXlDbGFzcy5cbiAgICogICB9LFxuICAgKlxuICAgKiAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgLy8gZXJyb3IgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IuXG4gICAqICAgfVxuICAgKiB9KTs8L3ByZT48L3A+XG4gICAqL1xuICBQYXJzZS5RdWVyeSA9IGZ1bmN0aW9uKG9iamVjdENsYXNzKSB7XG4gICAgaWYgKF8uaXNTdHJpbmcob2JqZWN0Q2xhc3MpKSB7XG4gICAgICBvYmplY3RDbGFzcyA9IFBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3Mob2JqZWN0Q2xhc3MpO1xuICAgIH1cblxuICAgIHRoaXMub2JqZWN0Q2xhc3MgPSBvYmplY3RDbGFzcztcblxuICAgIHRoaXMuY2xhc3NOYW1lID0gb2JqZWN0Q2xhc3MucHJvdG90eXBlLmNsYXNzTmFtZTtcblxuICAgIHRoaXMuX3doZXJlID0ge307XG4gICAgdGhpcy5faW5jbHVkZSA9IFtdO1xuICAgIHRoaXMuX2xpbWl0ID0gLTE7IC8vIG5lZ2F0aXZlIGxpbWl0IG1lYW5zLCBkbyBub3Qgc2VuZCBhIGxpbWl0XG4gICAgdGhpcy5fc2tpcCA9IDA7XG4gICAgdGhpcy5fZXh0cmFPcHRpb25zID0ge307XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBQYXJzZS5RdWVyeSB0aGF0IGlzIHRoZSBPUiBvZiB0aGUgcGFzc2VkIGluIHF1ZXJpZXMuICBGb3JcbiAgICogZXhhbXBsZTpcbiAgICogPHByZT52YXIgY29tcG91bmRRdWVyeSA9IFBhcnNlLlF1ZXJ5Lm9yKHF1ZXJ5MSwgcXVlcnkyLCBxdWVyeTMpOzwvcHJlPlxuICAgKlxuICAgKiB3aWxsIGNyZWF0ZSBhIGNvbXBvdW5kUXVlcnkgdGhhdCBpcyBhbiBvciBvZiB0aGUgcXVlcnkxLCBxdWVyeTIsIGFuZFxuICAgKiBxdWVyeTMuXG4gICAqIEBwYXJhbSB7Li4uUGFyc2UuUXVlcnl9IHZhcl9hcmdzIFRoZSBsaXN0IG9mIHF1ZXJpZXMgdG8gT1IuXG4gICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBUaGUgcXVlcnkgdGhhdCBpcyB0aGUgT1Igb2YgdGhlIHBhc3NlZCBpbiBxdWVyaWVzLlxuICAgKi9cbiAgUGFyc2UuUXVlcnkub3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcXVlcmllcyA9IF8udG9BcnJheShhcmd1bWVudHMpO1xuICAgIHZhciBjbGFzc05hbWUgPSBudWxsO1xuICAgIFBhcnNlLl9hcnJheUVhY2gocXVlcmllcywgZnVuY3Rpb24ocSkge1xuICAgICAgaWYgKF8uaXNOdWxsKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgY2xhc3NOYW1lID0gcS5jbGFzc05hbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjbGFzc05hbWUgIT09IHEuY2xhc3NOYW1lKSB7XG4gICAgICAgIHRocm93IFwiQWxsIHF1ZXJpZXMgbXVzdCBiZSBmb3IgdGhlIHNhbWUgY2xhc3NcIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoY2xhc3NOYW1lKTtcbiAgICBxdWVyeS5fb3JRdWVyeShxdWVyaWVzKTtcbiAgICByZXR1cm4gcXVlcnk7XG4gIH07XG5cbiAgUGFyc2UuUXVlcnkucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBQYXJzZS5PYmplY3Qgd2hvc2UgaWQgaXMgYWxyZWFkeSBrbm93biBieSBmZXRjaGluZyBkYXRhIGZyb21cbiAgICAgKiB0aGUgc2VydmVyLiAgRWl0aGVyIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIGlzIGNhbGxlZCB3aGVuIHRoZVxuICAgICAqIGZpbmQgY29tcGxldGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9iamVjdElkIFRoZSBpZCBvZiB0aGUgb2JqZWN0IHRvIGJlIGZldGNoZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihvYmplY3RJZCwgb3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5lcXVhbFRvKCdvYmplY3RJZCcsIG9iamVjdElkKTtcblxuICAgICAgdmFyIGZpcnN0T3B0aW9ucyA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5oYXMob3B0aW9ucywgJ3VzZU1hc3RlcktleScpKSB7XG4gICAgICAgIGZpcnN0T3B0aW9ucyA9IHsgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZi5maXJzdChmaXJzdE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVycm9yT2JqZWN0ID0gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk9iamVjdCBub3QgZm91bmQuXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvck9iamVjdCk7XG5cbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIG51bGwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHF1ZXJ5LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIHF1ZXJ5LlxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICB3aGVyZTogdGhpcy5fd2hlcmVcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLl9pbmNsdWRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGFyYW1zLmluY2x1ZGUgPSB0aGlzLl9pbmNsdWRlLmpvaW4oXCIsXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX3NlbGVjdCkge1xuICAgICAgICBwYXJhbXMua2V5cyA9IHRoaXMuX3NlbGVjdC5qb2luKFwiLFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9saW1pdCA+PSAwKSB7XG4gICAgICAgIHBhcmFtcy5saW1pdCA9IHRoaXMuX2xpbWl0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX3NraXAgPiAwKSB7XG4gICAgICAgIHBhcmFtcy5za2lwID0gdGhpcy5fc2tpcDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9vcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmFtcy5vcmRlciA9IHRoaXMuX29yZGVyLmpvaW4oXCIsXCIpO1xuICAgICAgfVxuXG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLl9leHRyYU9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcGFyYW1zW2tdID0gdjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYSBsaXN0IG9mIFBhcnNlT2JqZWN0cyB0aGF0IHNhdGlzZnkgdGhpcyBxdWVyeS5cbiAgICAgKiBFaXRoZXIgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3IgaXMgY2FsbGVkIHdoZW4gdGhlIGZpbmRcbiAgICAgKiBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LiBWYWxpZCBvcHRpb25zXG4gICAgICogYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGZpbmQgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAgICAgKiAgIDxsaT5lcnJvcjogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBmaW5kIGZhaWxzLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXN1bHRzIHdoZW5cbiAgICAgKiB0aGUgcXVlcnkgY29tcGxldGVzLlxuICAgICAqL1xuICAgIGZpbmQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwiY2xhc3Nlc1wiLFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMuY2xhc3NOYW1lLFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIGRhdGE6IHRoaXMudG9KU09OKClcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChyZXNwb25zZS5yZXN1bHRzLCBmdW5jdGlvbihqc29uKSB7XG4gICAgICAgICAgdmFyIG9iajtcbiAgICAgICAgICBpZiAocmVzcG9uc2UuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBvYmogPSBuZXcgUGFyc2UuT2JqZWN0KHJlc3BvbnNlLmNsYXNzTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iaiA9IG5ldyBzZWxmLm9iamVjdENsYXNzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9iai5fZmluaXNoRmV0Y2goanNvbiwgdHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSk7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ291bnRzIHRoZSBudW1iZXIgb2Ygb2JqZWN0cyB0aGF0IG1hdGNoIHRoaXMgcXVlcnkuXG4gICAgICogRWl0aGVyIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIGlzIGNhbGxlZCB3aGVuIHRoZSBjb3VudFxuICAgICAqIGNvbXBsZXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuIFZhbGlkIG9wdGlvbnNcbiAgICAgKiBhcmU6PHVsPlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgY291bnQgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAgICAgKiAgIDxsaT5lcnJvcjogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBmaW5kIGZhaWxzLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSBjb3VudCB3aGVuXG4gICAgICogdGhlIHF1ZXJ5IGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBjb3VudDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnRvSlNPTigpO1xuICAgICAgcGFyYW1zLmxpbWl0ID0gMDtcbiAgICAgIHBhcmFtcy5jb3VudCA9IDE7XG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwiY2xhc3Nlc1wiLFxuICAgICAgICBjbGFzc05hbWU6IHNlbGYuY2xhc3NOYW1lLCBcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBkYXRhOiBwYXJhbXNcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5jb3VudDtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYXQgbW9zdCBvbmUgUGFyc2UuT2JqZWN0IHRoYXQgc2F0aXNmaWVzIHRoaXMgcXVlcnkuXG4gICAgICpcbiAgICAgKiBFaXRoZXIgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3IgaXMgY2FsbGVkIHdoZW4gaXQgY29tcGxldGVzLlxuICAgICAqIHN1Y2Nlc3MgaXMgcGFzc2VkIHRoZSBvYmplY3QgaWYgdGhlcmUgaXMgb25lLiBvdGhlcndpc2UsIHVuZGVmaW5lZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuIFZhbGlkIG9wdGlvbnNcbiAgICAgKiBhcmU6PHVsPlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZmluZCBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICAgICAqICAgPGxpPmVycm9yOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGZpbmQgZmFpbHMuXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIG9iamVjdCB3aGVuXG4gICAgICogdGhlIHF1ZXJ5IGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBmaXJzdDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnRvSlNPTigpO1xuICAgICAgcGFyYW1zLmxpbWl0ID0gMTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc05hbWUsIFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIGRhdGE6IHBhcmFtc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3BvbnNlLnJlc3VsdHMsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgICB2YXIgb2JqO1xuICAgICAgICAgIGlmIChyZXNwb25zZS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIG9iaiA9IG5ldyBQYXJzZS5PYmplY3QocmVzcG9uc2UuY2xhc3NOYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqID0gbmV3IHNlbGYub2JqZWN0Q2xhc3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JqLl9maW5pc2hGZXRjaChqc29uLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9KVswXTtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGluc3RhbmNlIG9mIFBhcnNlLkNvbGxlY3Rpb24gYmFja2VkIGJ5IHRoaXMgcXVlcnkuXG4gICAgICogQHBhcmFtIHtBcnJheX0gaXRlbXMgQW4gYXJyYXkgb2YgaW5zdGFuY2VzIG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT5cbiAgICAgKiAgICAgd2l0aCB3aGljaCB0byBzdGFydCB0aGlzIENvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+bW9kZWw6IFRoZSBQYXJzZS5PYmplY3Qgc3ViY2xhc3MgdGhhdCB0aGlzIGNvbGxlY3Rpb24gY29udGFpbnMuXG4gICAgICogICA8bGk+cXVlcnk6IEFuIGluc3RhbmNlIG9mIFBhcnNlLlF1ZXJ5IHRvIHVzZSB3aGVuIGZldGNoaW5nIGl0ZW1zLlxuICAgICAqICAgPGxpPmNvbXBhcmF0b3I6IEEgc3RyaW5nIHByb3BlcnR5IG5hbWUgb3IgZnVuY3Rpb24gdG8gc29ydCBieS5cbiAgICAgKiA8L3VsPlxuICAgICAqIEByZXR1cm4ge1BhcnNlLkNvbGxlY3Rpb259XG4gICAgICovXG4gICAgY29sbGVjdGlvbjogZnVuY3Rpb24oaXRlbXMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgcmV0dXJuIG5ldyBQYXJzZS5Db2xsZWN0aW9uKGl0ZW1zLCBfLmV4dGVuZChvcHRpb25zLCB7XG4gICAgICAgIG1vZGVsOiB0aGlzLm9iamVjdENsYXNzLFxuICAgICAgICBxdWVyeTogdGhpc1xuICAgICAgfSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBudW1iZXIgb2YgcmVzdWx0cyB0byBza2lwIGJlZm9yZSByZXR1cm5pbmcgYW55IHJlc3VsdHMuXG4gICAgICogVGhpcyBpcyB1c2VmdWwgZm9yIHBhZ2luYXRpb24uXG4gICAgICogRGVmYXVsdCBpcyB0byBza2lwIHplcm8gcmVzdWx0cy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiB0aGUgbnVtYmVyIG9mIHJlc3VsdHMgdG8gc2tpcC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHNraXA6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIHRoaXMuX3NraXAgPSBuO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGxpbWl0IG9mIHRoZSBudW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm4uIFRoZSBkZWZhdWx0IGxpbWl0IGlzXG4gICAgICogMTAwLCB3aXRoIGEgbWF4aW11bSBvZiAxMDAwIHJlc3VsdHMgYmVpbmcgcmV0dXJuZWQgYXQgYSB0aW1lLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIHRoZSBudW1iZXIgb2YgcmVzdWx0cyB0byBsaW1pdCB0by5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGxpbWl0OiBmdW5jdGlvbihuKSB7XG4gICAgICB0aGlzLl9saW1pdCA9IG47XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBlcXVhbCB0byB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCB0aGUgUGFyc2UuT2JqZWN0IG11c3QgY29udGFpbi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGVxdWFsVG86IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmIChfLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb2VzTm90RXhpc3Qoa2V5KTtcbiAgICAgIH0gXG5cbiAgICAgIHRoaXMuX3doZXJlW2tleV0gPSBQYXJzZS5fZW5jb2RlKHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgZm9yIGNvbmRpdGlvbiBxdWVyaWVzXG4gICAgICovXG4gICAgX2FkZENvbmRpdGlvbjogZnVuY3Rpb24oa2V5LCBjb25kaXRpb24sIHZhbHVlKSB7XG4gICAgICAvLyBDaGVjayBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBjb25kaXRpb25cbiAgICAgIGlmICghdGhpcy5fd2hlcmVba2V5XSkge1xuICAgICAgICB0aGlzLl93aGVyZVtrZXldID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLl93aGVyZVtrZXldW2NvbmRpdGlvbl0gPSBQYXJzZS5fZW5jb2RlKHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIG5vdCBlcXVhbCB0byB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCBtdXN0IG5vdCBiZSBlcXVhbGxlZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG5vdEVxdWFsVG86IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJG5lXCIsIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGxlc3MgdGhhbiB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCBwcm92aWRlcyBhbiB1cHBlciBib3VuZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGxlc3NUaGFuOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRsdFwiLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBncmVhdGVyIHRoYW4gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgcHJvdmlkZXMgYW4gbG93ZXIgYm91bmQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBncmVhdGVyVGhhbjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkZ3RcIiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0aGF0IHByb3ZpZGVzIGFuIHVwcGVyIGJvdW5kLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbGVzc1RoYW5PckVxdWFsVG86IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGx0ZVwiLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgcHJvdmlkZXMgYW4gbG93ZXIgYm91bmQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBncmVhdGVyVGhhbk9yRXF1YWxUbzogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkZ3RlXCIsIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGNvbnRhaW5lZCBpbiB0aGUgcHJvdmlkZWQgbGlzdCBvZiB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRoYXQgd2lsbCBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGNvbnRhaW5lZEluOiBmdW5jdGlvbihrZXksIHZhbHVlcykge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkaW5cIiwgdmFsdWVzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIG5vdCBiZSBjb250YWluZWQgaW4gdGhlIHByb3ZpZGVkIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0aGF0IHdpbGwgbm90IG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbm90Q29udGFpbmVkSW46IGZ1bmN0aW9uKGtleSwgdmFsdWVzKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRuaW5cIiwgdmFsdWVzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGNvbnRhaW4gZWFjaCBvbmUgb2YgdGhlIHByb3ZpZGVkIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay4gIFRoaXMga2V5J3MgdmFsdWUgbXVzdCBiZSBhbiBhcnJheS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0aGF0IHdpbGwgbWF0Y2guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBjb250YWluc0FsbDogZnVuY3Rpb24oa2V5LCB2YWx1ZXMpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGFsbFwiLCB2YWx1ZXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHNob3VsZCBleGlzdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGV4aXN0czogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRleGlzdHNcIiwgdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHRoYXQgZG8gbm90IGNvbnRhaW4gYSBnaXZlbiBrZXkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgc2hvdWxkIG5vdCBleGlzdFxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZG9lc05vdEV4aXN0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGV4aXN0c1wiLCBmYWxzZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcmVndWxhciBleHByZXNzaW9uIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgc3RyaW5nIHZhbHVlcyB0aGF0IG1hdGNoXG4gICAgICogdGhlIHByb3ZpZGVkIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgKiBUaGlzIG1heSBiZSBzbG93IGZvciBsYXJnZSBkYXRhc2V0cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgc3RyaW5nIHRvIG1hdGNoIGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnZXggVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuIHRvIG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbWF0Y2hlczogZnVuY3Rpb24oa2V5LCByZWdleCwgbW9kaWZpZXJzKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCByZWdleCk7XG4gICAgICBpZiAoIW1vZGlmaWVycykgeyBtb2RpZmllcnMgPSBcIlwiOyB9XG4gICAgICAvLyBKYXZhc2NyaXB0IHJlZ2V4IG9wdGlvbnMgc3VwcG9ydCBtaWcgYXMgaW5saW5lIG9wdGlvbnMgYnV0IHN0b3JlIHRoZW0gXG4gICAgICAvLyBhcyBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QuIFdlIHN1cHBvcnQgbWkgJiBzaG91bGQgbWlncmF0ZSB0aGVtIHRvXG4gICAgICAvLyBtb2RpZmllcnNcbiAgICAgIGlmIChyZWdleC5pZ25vcmVDYXNlKSB7IG1vZGlmaWVycyArPSAnaSc7IH1cbiAgICAgIGlmIChyZWdleC5tdWx0aWxpbmUpIHsgbW9kaWZpZXJzICs9ICdtJzsgfVxuXG4gICAgICBpZiAobW9kaWZpZXJzICYmIG1vZGlmaWVycy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkb3B0aW9uc1wiLCBtb2RpZmllcnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdGhhdCByZXF1aXJlcyB0aGF0IGEga2V5J3MgdmFsdWUgbWF0Y2hlcyBhIFBhcnNlLlF1ZXJ5XG4gICAgICogY29uc3RyYWludC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgY29udGFpbnMgdGhlIG9iamVjdCB0byBtYXRjaCB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuUXVlcnl9IHF1ZXJ5IFRoZSBxdWVyeSB0aGF0IHNob3VsZCBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG1hdGNoZXNRdWVyeTogZnVuY3Rpb24oa2V5LCBxdWVyeSkge1xuICAgICAgdmFyIHF1ZXJ5SlNPTiA9IHF1ZXJ5LnRvSlNPTigpO1xuICAgICAgcXVlcnlKU09OLmNsYXNzTmFtZSA9IHF1ZXJ5LmNsYXNzTmFtZTtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGluUXVlcnlcIiwgcXVlcnlKU09OKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdGhhdCByZXF1aXJlcyB0aGF0IGEga2V5J3MgdmFsdWUgbm90IG1hdGNoZXMgYVxuICAgICAqIFBhcnNlLlF1ZXJ5IGNvbnN0cmFpbnQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIGNvbnRhaW5zIHRoZSBvYmplY3QgdG8gbWF0Y2ggdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLlF1ZXJ5fSBxdWVyeSBUaGUgcXVlcnkgdGhhdCBzaG91bGQgbm90IG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZG9lc05vdE1hdGNoUXVlcnk6IGZ1bmN0aW9uKGtleSwgcXVlcnkpIHtcbiAgICAgIHZhciBxdWVyeUpTT04gPSBxdWVyeS50b0pTT04oKTtcbiAgICAgIHF1ZXJ5SlNPTi5jbGFzc05hbWUgPSBxdWVyeS5jbGFzc05hbWU7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRub3RJblF1ZXJ5XCIsIHF1ZXJ5SlNPTik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRoYXQgcmVxdWlyZXMgdGhhdCBhIGtleSdzIHZhbHVlIG1hdGNoZXMgYSB2YWx1ZSBpblxuICAgICAqIGFuIG9iamVjdCByZXR1cm5lZCBieSBhIGRpZmZlcmVudCBQYXJzZS5RdWVyeS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgdGhhdCBpcyBiZWluZ1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnlLZXkgVGhlIGtleSBpbiB0aGUgb2JqZWN0cyByZXR1cm5lZCBieSB0aGUgcXVlcnkgdG9cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggYWdhaW5zdC5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLlF1ZXJ5fSBxdWVyeSBUaGUgcXVlcnkgdG8gcnVuLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbWF0Y2hlc0tleUluUXVlcnk6IGZ1bmN0aW9uKGtleSwgcXVlcnlLZXksIHF1ZXJ5KSB7XG4gICAgICB2YXIgcXVlcnlKU09OID0gcXVlcnkudG9KU09OKCk7XG4gICAgICBxdWVyeUpTT04uY2xhc3NOYW1lID0gcXVlcnkuY2xhc3NOYW1lO1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkc2VsZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgeyBrZXk6IHF1ZXJ5S2V5LCBxdWVyeTogcXVlcnlKU09OIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdGhhdCByZXF1aXJlcyB0aGF0IGEga2V5J3MgdmFsdWUgbm90IG1hdGNoIGEgdmFsdWUgaW5cbiAgICAgKiBhbiBvYmplY3QgcmV0dXJuZWQgYnkgYSBkaWZmZXJlbnQgUGFyc2UuUXVlcnkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIHRoYXQgaXMgYmVpbmdcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeUtleSBUaGUga2V5IGluIHRoZSBvYmplY3RzIHJldHVybmVkIGJ5IHRoZSBxdWVyeSB0b1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCBhZ2FpbnN0LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuUXVlcnl9IHF1ZXJ5IFRoZSBxdWVyeSB0byBydW4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBkb2VzTm90TWF0Y2hLZXlJblF1ZXJ5OiBmdW5jdGlvbihrZXksIHF1ZXJ5S2V5LCBxdWVyeSkge1xuICAgICAgdmFyIHF1ZXJ5SlNPTiA9IHF1ZXJ5LnRvSlNPTigpO1xuICAgICAgcXVlcnlKU09OLmNsYXNzTmFtZSA9IHF1ZXJ5LmNsYXNzTmFtZTtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGRvbnRTZWxlY3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICB7IGtleTogcXVlcnlLZXksIHF1ZXJ5OiBxdWVyeUpTT04gfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGNvbnN0cmFpbnQgdGhhdCBhdCBsZWFzdCBvbmUgb2YgdGhlIHBhc3NlZCBpbiBxdWVyaWVzIG1hdGNoZXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gcXVlcmllc1xuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgX29yUXVlcnk6IGZ1bmN0aW9uKHF1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeUpTT04gPSBfLm1hcChxdWVyaWVzLCBmdW5jdGlvbihxKSB7XG4gICAgICAgIHJldHVybiBxLnRvSlNPTigpLndoZXJlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3doZXJlLiRvciA9IHF1ZXJ5SlNPTjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhIHN0cmluZyBpbnRvIGEgcmVnZXggdGhhdCBtYXRjaGVzIGl0LlxuICAgICAqIFN1cnJvdW5kaW5nIHdpdGggXFxRIC4uIFxcRSBkb2VzIHRoaXMsIHdlIGp1c3QgbmVlZCB0byBlc2NhcGUgXFxFJ3MgaW5cbiAgICAgKiB0aGUgdGV4dCBzZXBhcmF0ZWx5LlxuICAgICAqL1xuICAgIF9xdW90ZTogZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIFwiXFxcXFFcIiArIHMucmVwbGFjZShcIlxcXFxFXCIsIFwiXFxcXEVcXFxcXFxcXEVcXFxcUVwiKSArIFwiXFxcXEVcIjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBzdHJpbmcgdmFsdWVzIHRoYXQgY29udGFpbiBhIHByb3ZpZGVkXG4gICAgICogc3RyaW5nLiAgVGhpcyBtYXkgYmUgc2xvdyBmb3IgbGFyZ2UgZGF0YXNldHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIHN0cmluZyB0byBtYXRjaCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN1YnN0cmluZyBUaGUgc3Vic3RyaW5nIHRoYXQgdGhlIHZhbHVlIG11c3QgY29udGFpbi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCB0aGlzLl9xdW90ZSh2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgc3RyaW5nIHZhbHVlcyB0aGF0IHN0YXJ0IHdpdGggYSBwcm92aWRlZFxuICAgICAqIHN0cmluZy4gIFRoaXMgcXVlcnkgd2lsbCB1c2UgdGhlIGJhY2tlbmQgaW5kZXgsIHNvIGl0IHdpbGwgYmUgZmFzdCBldmVuXG4gICAgICogZm9yIGxhcmdlIGRhdGFzZXRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBzdHJpbmcgdG8gbWF0Y2ggaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggVGhlIHN1YnN0cmluZyB0aGF0IHRoZSB2YWx1ZSBtdXN0IHN0YXJ0IHdpdGguXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBzdGFydHNXaXRoOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCBcIl5cIiArIHRoaXMuX3F1b3RlKHZhbHVlKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBzdHJpbmcgdmFsdWVzIHRoYXQgZW5kIHdpdGggYSBwcm92aWRlZFxuICAgICAqIHN0cmluZy4gIFRoaXMgd2lsbCBiZSBzbG93IGZvciBsYXJnZSBkYXRhc2V0cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgc3RyaW5nIHRvIG1hdGNoIGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3VmZml4IFRoZSBzdWJzdHJpbmcgdGhhdCB0aGUgdmFsdWUgbXVzdCBlbmQgd2l0aC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGVuZHNXaXRoOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCB0aGlzLl9xdW90ZSh2YWx1ZSkgKyBcIiRcIik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU29ydHMgdGhlIHJlc3VsdHMgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSBnaXZlbiBrZXkuXG4gICAgICogXG4gICAgICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdfC4uLlN0cmluZ30ga2V5IFRoZSBrZXkgdG8gb3JkZXIgYnksIHdoaWNoIGlzIGEgXG4gICAgICogc3RyaW5nIG9mIGNvbW1hIHNlcGFyYXRlZCB2YWx1ZXMsIG9yIGFuIEFycmF5IG9mIGtleXMsIG9yIG11bHRpcGxlIGtleXMuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBhc2NlbmRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgIHJldHVybiB0aGlzLmFkZEFzY2VuZGluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgcmVzdWx0cyBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdGhlIGdpdmVuIGtleSwgXG4gICAgICogYnV0IGNhbiBhbHNvIGFkZCBzZWNvbmRhcnkgc29ydCBkZXNjcmlwdG9ycyB3aXRob3V0IG92ZXJ3cml0aW5nIF9vcmRlci5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyhTdHJpbmd8U3RyaW5nW118Li4uU3RyaW5nfSBrZXkgVGhlIGtleSB0byBvcmRlciBieSwgd2hpY2ggaXMgYVxuICAgICAqIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgdmFsdWVzLCBvciBhbiBBcnJheSBvZiBrZXlzLCBvciBtdWx0aXBsZSBrZXlzLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgYWRkQXNjZW5kaW5nOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpczsgXG4gICAgICBpZiAoIXRoaXMuX29yZGVyKSB7XG4gICAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgICB9XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXkuam9pbigpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX29yZGVyID0gc2VsZi5fb3JkZXIuY29uY2F0KGtleS5yZXBsYWNlKC9cXHMvZywgXCJcIikuc3BsaXQoXCIsXCIpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNvcnRzIHRoZSByZXN1bHRzIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdGhlIGdpdmVuIGtleS5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyhTdHJpbmd8U3RyaW5nW118Li4uU3RyaW5nfSBrZXkgVGhlIGtleSB0byBvcmRlciBieSwgd2hpY2ggaXMgYVxuICAgICAqIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgdmFsdWVzLCBvciBhbiBBcnJheSBvZiBrZXlzLCBvciBtdWx0aXBsZSBrZXlzLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZGVzY2VuZGluZzogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgcmV0dXJuIHRoaXMuYWRkRGVzY2VuZGluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgcmVzdWx0cyBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSBnaXZlbiBrZXksXG4gICAgICogYnV0IGNhbiBhbHNvIGFkZCBzZWNvbmRhcnkgc29ydCBkZXNjcmlwdG9ycyB3aXRob3V0IG92ZXJ3cml0aW5nIF9vcmRlci5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyhTdHJpbmd8U3RyaW5nW118Li4uU3RyaW5nfSBrZXkgVGhlIGtleSB0byBvcmRlciBieSwgd2hpY2ggaXMgYVxuICAgICAqIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgdmFsdWVzLCBvciBhbiBBcnJheSBvZiBrZXlzLCBvciBtdWx0aXBsZSBrZXlzLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgYWRkRGVzY2VuZGluZzogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7IFxuICAgICAgaWYgKCF0aGlzLl9vcmRlcikge1xuICAgICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgfVxuICAgICAgUGFyc2UuX2FycmF5RWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5LmpvaW4oKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9vcmRlciA9IHNlbGYuX29yZGVyLmNvbmNhdChcbiAgICAgICAgICBfLm1hcChrZXkucmVwbGFjZSgvXFxzL2csIFwiXCIpLnNwbGl0KFwiLFwiKSwgXG4gICAgICAgICAgICBmdW5jdGlvbihrKSB7IHJldHVybiBcIi1cIiArIGs7IH0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3hpbWl0eSBiYXNlZCBjb25zdHJhaW50IGZvciBmaW5kaW5nIG9iamVjdHMgd2l0aCBrZXkgcG9pbnRcbiAgICAgKiB2YWx1ZXMgbmVhciB0aGUgcG9pbnQgZ2l2ZW4uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIFBhcnNlLkdlb1BvaW50IGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCBUaGUgcmVmZXJlbmNlIFBhcnNlLkdlb1BvaW50IHRoYXQgaXMgdXNlZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG5lYXI6IGZ1bmN0aW9uKGtleSwgcG9pbnQpIHtcbiAgICAgIGlmICghKHBvaW50IGluc3RhbmNlb2YgUGFyc2UuR2VvUG9pbnQpKSB7XG4gICAgICAgIC8vIFRyeSB0byBjYXN0IGl0IHRvIGEgR2VvUG9pbnQsIHNvIHRoYXQgbmVhcihcImxvY1wiLCBbMjAsMzBdKSB3b3Jrcy5cbiAgICAgICAgcG9pbnQgPSBuZXcgUGFyc2UuR2VvUG9pbnQocG9pbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbmVhclNwaGVyZVwiLCBwb2ludCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJveGltaXR5IGJhc2VkIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB3aXRoIGtleSBwb2ludFxuICAgICAqIHZhbHVlcyBuZWFyIHRoZSBwb2ludCBnaXZlbiBhbmQgd2l0aGluIHRoZSBtYXhpbXVtIGRpc3RhbmNlIGdpdmVuLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBQYXJzZS5HZW9Qb2ludCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgVGhlIHJlZmVyZW5jZSBQYXJzZS5HZW9Qb2ludCB0aGF0IGlzIHVzZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG1heERpc3RhbmNlIE1heGltdW0gZGlzdGFuY2UgKGluIHJhZGlhbnMpIG9mIHJlc3VsdHMgdG9cbiAgICAgKiAgIHJldHVybi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHdpdGhpblJhZGlhbnM6IGZ1bmN0aW9uKGtleSwgcG9pbnQsIGRpc3RhbmNlKSB7XG4gICAgICB0aGlzLm5lYXIoa2V5LCBwb2ludCk7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRtYXhEaXN0YW5jZVwiLCBkaXN0YW5jZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJveGltaXR5IGJhc2VkIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB3aXRoIGtleSBwb2ludFxuICAgICAqIHZhbHVlcyBuZWFyIHRoZSBwb2ludCBnaXZlbiBhbmQgd2l0aGluIHRoZSBtYXhpbXVtIGRpc3RhbmNlIGdpdmVuLlxuICAgICAqIFJhZGl1cyBvZiBlYXJ0aCB1c2VkIGlzIDM5NTguOCBtaWxlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgUGFyc2UuR2VvUG9pbnQgaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IFRoZSByZWZlcmVuY2UgUGFyc2UuR2VvUG9pbnQgdGhhdCBpcyB1c2VkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhEaXN0YW5jZSBNYXhpbXVtIGRpc3RhbmNlIChpbiBtaWxlcykgb2YgcmVzdWx0cyB0b1xuICAgICAqICAgICByZXR1cm4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICB3aXRoaW5NaWxlczogZnVuY3Rpb24oa2V5LCBwb2ludCwgZGlzdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLndpdGhpblJhZGlhbnMoa2V5LCBwb2ludCwgZGlzdGFuY2UgLyAzOTU4LjgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm94aW1pdHkgYmFzZWQgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHdpdGgga2V5IHBvaW50XG4gICAgICogdmFsdWVzIG5lYXIgdGhlIHBvaW50IGdpdmVuIGFuZCB3aXRoaW4gdGhlIG1heGltdW0gZGlzdGFuY2UgZ2l2ZW4uXG4gICAgICogUmFkaXVzIG9mIGVhcnRoIHVzZWQgaXMgNjM3MS4wIGtpbG9tZXRlcnMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIFBhcnNlLkdlb1BvaW50IGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCBUaGUgcmVmZXJlbmNlIFBhcnNlLkdlb1BvaW50IHRoYXQgaXMgdXNlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbWF4RGlzdGFuY2UgTWF4aW11bSBkaXN0YW5jZSAoaW4ga2lsb21ldGVycykgb2YgcmVzdWx0c1xuICAgICAqICAgICB0byByZXR1cm4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICB3aXRoaW5LaWxvbWV0ZXJzOiBmdW5jdGlvbihrZXksIHBvaW50LCBkaXN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMud2l0aGluUmFkaWFucyhrZXksIHBvaW50LCBkaXN0YW5jZSAvIDYzNzEuMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzXG4gICAgICogY29vcmRpbmF0ZXMgYmUgY29udGFpbmVkIHdpdGhpbiBhIGdpdmVuIHJlY3Rhbmd1bGFyIGdlb2dyYXBoaWMgYm91bmRpbmdcbiAgICAgKiBib3guXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGJlIGNvbnN0cmFpbmVkLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHNvdXRod2VzdFxuICAgICAqICAgICBUaGUgbG93ZXItbGVmdCBpbmNsdXNpdmUgY29ybmVyIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gbm9ydGhlYXN0XG4gICAgICogICAgIFRoZSB1cHBlci1yaWdodCBpbmNsdXNpdmUgY29ybmVyIG9mIHRoZSBib3guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICB3aXRoaW5HZW9Cb3g6IGZ1bmN0aW9uKGtleSwgc291dGh3ZXN0LCBub3J0aGVhc3QpIHtcbiAgICAgIGlmICghKHNvdXRod2VzdCBpbnN0YW5jZW9mIFBhcnNlLkdlb1BvaW50KSkge1xuICAgICAgICBzb3V0aHdlc3QgPSBuZXcgUGFyc2UuR2VvUG9pbnQoc291dGh3ZXN0KTtcbiAgICAgIH1cbiAgICAgIGlmICghKG5vcnRoZWFzdCBpbnN0YW5jZW9mIFBhcnNlLkdlb1BvaW50KSkge1xuICAgICAgICBub3J0aGVhc3QgPSBuZXcgUGFyc2UuR2VvUG9pbnQobm9ydGhlYXN0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksICckd2l0aGluJywgeyAnJGJveCc6IFtzb3V0aHdlc3QsIG5vcnRoZWFzdF0gfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW5jbHVkZSBuZXN0ZWQgUGFyc2UuT2JqZWN0cyBmb3IgdGhlIHByb3ZpZGVkIGtleS4gIFlvdSBjYW4gdXNlIGRvdFxuICAgICAqIG5vdGF0aW9uIHRvIHNwZWNpZnkgd2hpY2ggZmllbGRzIGluIHRoZSBpbmNsdWRlZCBvYmplY3QgYXJlIGFsc28gZmV0Y2hlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBuYW1lIG9mIHRoZSBrZXkgdG8gaW5jbHVkZS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGluY2x1ZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBzZWxmLl9pbmNsdWRlID0gc2VsZi5faW5jbHVkZS5jb25jYXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLl9pbmNsdWRlLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVzdHJpY3QgdGhlIGZpZWxkcyBvZiB0aGUgcmV0dXJuZWQgUGFyc2UuT2JqZWN0cyB0byBpbmNsdWRlIG9ubHkgdGhlXG4gICAgICogcHJvdmlkZWQga2V5cy4gIElmIHRoaXMgaXMgY2FsbGVkIG11bHRpcGxlIHRpbWVzLCB0aGVuIGFsbCBvZiB0aGUga2V5c1xuICAgICAqIHNwZWNpZmllZCBpbiBlYWNoIG9mIHRoZSBjYWxscyB3aWxsIGJlIGluY2x1ZGVkLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXMgVGhlIG5hbWVzIG9mIHRoZSBrZXlzIHRvIGluY2x1ZGUuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5fc2VsZWN0ID0gdGhpcy5fc2VsZWN0IHx8IFtdO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBzZWxmLl9zZWxlY3QgPSBzZWxmLl9zZWxlY3QuY29uY2F0KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fc2VsZWN0LnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgb3ZlciBlYWNoIHJlc3VsdCBvZiBhIHF1ZXJ5LCBjYWxsaW5nIGEgY2FsbGJhY2sgZm9yIGVhY2ggb25lLiBJZlxuICAgICAqIHRoZSBjYWxsYmFjayByZXR1cm5zIGEgcHJvbWlzZSwgdGhlIGl0ZXJhdGlvbiB3aWxsIG5vdCBjb250aW51ZSB1bnRpbFxuICAgICAqIHRoYXQgcHJvbWlzZSBoYXMgYmVlbiBmdWxmaWxsZWQuIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIGEgcmVqZWN0ZWRcbiAgICAgKiBwcm9taXNlLCB0aGVuIGl0ZXJhdGlvbiB3aWxsIHN0b3Agd2l0aCB0aGF0IGVycm9yLiBUaGUgaXRlbXMgYXJlXG4gICAgICogcHJvY2Vzc2VkIGluIGFuIHVuc3BlY2lmaWVkIG9yZGVyLiBUaGUgcXVlcnkgbWF5IG5vdCBoYXZlIGFueSBzb3J0IG9yZGVyLFxuICAgICAqIGFuZCBtYXkgbm90IHVzZSBsaW1pdCBvciBza2lwLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBlYWNoIHJlc3VsdFxuICAgICAqICAgICBvZiB0aGUgcXVlcnkuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgQmFja2JvbmUtbGlrZSBvcHRpb25zIG9iamVjdCB3aXRoXG4gICAgICogICAgIHN1Y2Nlc3MgYW5kIGVycm9yIGNhbGxiYWNrcyB0aGF0IHdpbGwgYmUgaW52b2tlZCBvbmNlIHRoZSBpdGVyYXRpb25cbiAgICAgKiAgICAgaGFzIGZpbmlzaGVkLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIG9uY2UgdGhlXG4gICAgICogICAgIGl0ZXJhdGlvbiBoYXMgY29tcGxldGVkLlxuICAgICAqL1xuICAgIGVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaWYgKHRoaXMuX29yZGVyIHx8IHRoaXMuX3NraXAgfHwgKHRoaXMuX2xpbWl0ID49IDApKSB7XG4gICAgICAgIHZhciBlcnJvciA9XG4gICAgICAgICAgXCJDYW5ub3QgaXRlcmF0ZSBvbiBhIHF1ZXJ5IHdpdGggc29ydCwgc2tpcCwgb3IgbGltaXQuXCI7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuXG4gICAgICB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkodGhpcy5vYmplY3RDbGFzcyk7XG4gICAgICAvLyBXZSBjYW4gb3ZlcnJpZGUgdGhlIGJhdGNoIHNpemUgZnJvbSB0aGUgb3B0aW9ucy5cbiAgICAgIC8vIFRoaXMgaXMgdW5kb2N1bWVudGVkLCBidXQgdXNlZnVsIGZvciB0ZXN0aW5nLlxuICAgICAgcXVlcnkuX2xpbWl0ID0gb3B0aW9ucy5iYXRjaFNpemUgfHwgMTAwO1xuICAgICAgcXVlcnkuX3doZXJlID0gXy5jbG9uZSh0aGlzLl93aGVyZSk7XG4gICAgICBxdWVyeS5faW5jbHVkZSA9IF8uY2xvbmUodGhpcy5faW5jbHVkZSk7XG4gICAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICAgIHF1ZXJ5Ll9zZWxlY3QgPSBfLmNsb25lKHRoaXMuX3NlbGVjdCk7XG4gICAgICB9XG5cbiAgICAgIHF1ZXJ5LmFzY2VuZGluZygnb2JqZWN0SWQnKTtcblxuICAgICAgdmFyIGZpbmRPcHRpb25zID0ge307XG4gICAgICBpZiAoXy5oYXMob3B0aW9ucywgXCJ1c2VNYXN0ZXJLZXlcIikpIHtcbiAgICAgICAgZmluZE9wdGlvbnMudXNlTWFzdGVyS2V5ID0gb3B0aW9ucy51c2VNYXN0ZXJLZXk7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaW5pc2hlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuX2NvbnRpbnVlV2hpbGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhZmluaXNoZWQ7XG5cbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcXVlcnkuZmluZChmaW5kT3B0aW9ucykudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgdmFyIGNhbGxiYWNrc0RvbmUgPSBQYXJzZS5Qcm9taXNlLmFzKCk7XG4gICAgICAgICAgUGFyc2UuXy5lYWNoKHJlc3VsdHMsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY2FsbGJhY2tzRG9uZSA9IGNhbGxiYWNrc0RvbmUudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBjYWxsYmFja3NEb25lLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPj0gcXVlcnkuX2xpbWl0KSB7XG4gICAgICAgICAgICAgIHF1ZXJ5LmdyZWF0ZXJUaGFuKFwib2JqZWN0SWRcIiwgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aCAtIDFdLmlkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbn0odGhpcykpO1xuXG4vKmdsb2JhbCBGQjogZmFsc2UgLCBjb25zb2xlOiBmYWxzZSovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIHZhciBQVUJMSUNfS0VZID0gXCIqXCI7XG5cbiAgdmFyIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIHZhciByZXF1ZXN0ZWRQZXJtaXNzaW9ucztcbiAgdmFyIGluaXRPcHRpb25zO1xuICB2YXIgcHJvdmlkZXIgPSB7XG4gICAgYXV0aGVudGljYXRlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKHNlbGYsIHtcbiAgICAgICAgICAgICAgaWQ6IHJlc3BvbnNlLmF1dGhSZXNwb25zZS51c2VySUQsXG4gICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uX2RhdGU6IG5ldyBEYXRlKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5leHBpcmVzSW4gKiAxMDAwICtcbiAgICAgICAgICAgICAgICAgIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpLnRvSlNPTigpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZXJyb3Ioc2VsZiwgcmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBzY29wZTogcmVxdWVzdGVkUGVybWlzc2lvbnNcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzdG9yZUF1dGhlbnRpY2F0aW9uOiBmdW5jdGlvbihhdXRoRGF0YSkge1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIHZhciBhdXRoUmVzcG9uc2UgPSB7XG4gICAgICAgICAgdXNlcklEOiBhdXRoRGF0YS5pZCxcbiAgICAgICAgICBhY2Nlc3NUb2tlbjogYXV0aERhdGEuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgIGV4cGlyZXNJbjogKFBhcnNlLl9wYXJzZURhdGUoYXV0aERhdGEuZXhwaXJhdGlvbl9kYXRlKS5nZXRUaW1lKCkgLVxuICAgICAgICAgICAgICAobmV3IERhdGUoKSkuZ2V0VGltZSgpKSAvIDEwMDBcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKGluaXRPcHRpb25zKTtcbiAgICAgICAgbmV3T3B0aW9ucy5hdXRoUmVzcG9uc2UgPSBhdXRoUmVzcG9uc2U7XG5cbiAgICAgICAgLy8gU3VwcHJlc3MgY2hlY2tzIGZvciBsb2dpbiBzdGF0dXMgZnJvbSB0aGUgYnJvd3Nlci5cbiAgICAgICAgbmV3T3B0aW9ucy5zdGF0dXMgPSBmYWxzZTtcblxuICAgICAgICAvLyBJZiB0aGUgdXNlciBkb2Vzbid0IG1hdGNoIHRoZSBvbmUga25vd24gYnkgdGhlIEZCIFNESywgbG9nIG91dC5cbiAgICAgICAgLy8gTW9zdCBvZiB0aGUgdGltZSwgdGhlIHVzZXJzIHdpbGwgbWF0Y2ggLS0gaXQncyBvbmx5IGluIGNhc2VzIHdoZXJlXG4gICAgICAgIC8vIHRoZSBGQiBTREsga25vd3Mgb2YgYSBkaWZmZXJlbnQgdXNlciB0aGFuIHRoZSBvbmUgYmVpbmcgcmVzdG9yZWRcbiAgICAgICAgLy8gZnJvbSBhIFBhcnNlIFVzZXIgdGhhdCBsb2dnZWQgaW4gd2l0aCB1c2VybmFtZS9wYXNzd29yZC5cbiAgICAgICAgdmFyIGV4aXN0aW5nUmVzcG9uc2UgPSBGQi5nZXRBdXRoUmVzcG9uc2UoKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nUmVzcG9uc2UgJiZcbiAgICAgICAgICAgIGV4aXN0aW5nUmVzcG9uc2UudXNlcklEICE9PSBhdXRoUmVzcG9uc2UudXNlcklEKSB7XG4gICAgICAgICAgRkIubG9nb3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBGQi5pbml0KG5ld09wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBnZXRBdXRoVHlwZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXCJmYWNlYm9va1wiO1xuICAgIH0sXG4gICAgZGVhdXRoZW50aWNhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yZXN0b3JlQXV0aGVudGljYXRpb24obnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIHNldCBvZiB1dGlsaXRpZXMgZm9yIHVzaW5nIFBhcnNlIHdpdGggRmFjZWJvb2suXG4gICAqIEBuYW1lc3BhY2VcbiAgICogUHJvdmlkZXMgYSBzZXQgb2YgdXRpbGl0aWVzIGZvciB1c2luZyBQYXJzZSB3aXRoIEZhY2Vib29rLlxuICAgKi9cbiAgUGFyc2UuRmFjZWJvb2tVdGlscyA9IHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBQYXJzZSBGYWNlYm9vayBpbnRlZ3JhdGlvbi4gIENhbGwgdGhpcyBmdW5jdGlvbiBhZnRlciB5b3VcbiAgICAgKiBoYXZlIGxvYWRlZCB0aGUgRmFjZWJvb2sgSmF2YXNjcmlwdCBTREsgd2l0aCB0aGUgc2FtZSBwYXJhbWV0ZXJzXG4gICAgICogYXMgeW91IHdvdWxkIHBhc3MgdG88Y29kZT5cbiAgICAgKiA8YSBocmVmPVxuICAgICAqIFwiaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9kb2NzL3JlZmVyZW5jZS9qYXZhc2NyaXB0L0ZCLmluaXQvXCI+XG4gICAgICogRkIuaW5pdCgpPC9hPjwvY29kZT4uICBQYXJzZS5GYWNlYm9va1V0aWxzIHdpbGwgaW52b2tlIEZCLmluaXQoKSBmb3IgeW91XG4gICAgICogd2l0aCB0aGVzZSBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBGYWNlYm9vayBvcHRpb25zIGFyZ3VtZW50IGFzIGRlc2NyaWJlZCBoZXJlOlxuICAgICAqICAgPGEgaHJlZj1cbiAgICAgKiAgIFwiaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9kb2NzL3JlZmVyZW5jZS9qYXZhc2NyaXB0L0ZCLmluaXQvXCI+XG4gICAgICogICBGQi5pbml0KCk8L2E+LiBUaGUgc3RhdHVzIGZsYWcgd2lsbCBiZSBjb2VyY2VkIHRvICdmYWxzZScgYmVjYXVzZSBpdFxuICAgICAqICAgaW50ZXJmZXJlcyB3aXRoIFBhcnNlIEZhY2Vib29rIGludGVncmF0aW9uLiBDYWxsIEZCLmdldExvZ2luU3RhdHVzKClcbiAgICAgKiAgIGV4cGxpY2l0bHkgaWYgdGhpcyBiZWhhdmlvciBpcyByZXF1aXJlZCBieSB5b3VyIGFwcGxpY2F0aW9uLlxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIGlmICh0eXBlb2YoRkIpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBcIlRoZSBGYWNlYm9vayBKYXZhU2NyaXB0IFNESyBtdXN0IGJlIGxvYWRlZCBiZWZvcmUgY2FsbGluZyBpbml0LlwiO1xuICAgICAgfSBcbiAgICAgIGluaXRPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgIGlmIChpbml0T3B0aW9ucy5zdGF0dXMgJiYgdHlwZW9mKGNvbnNvbGUpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciB3YXJuID0gY29uc29sZS53YXJuIHx8IGNvbnNvbGUubG9nIHx8IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHdhcm4uY2FsbChjb25zb2xlLCBcIlRoZSAnc3RhdHVzJyBmbGFnIHBhc3NlZCBpbnRvXCIgK1xuICAgICAgICAgIFwiIEZCLmluaXQsIHdoZW4gc2V0IHRvIHRydWUsIGNhbiBpbnRlcmZlcmUgd2l0aCBQYXJzZSBGYWNlYm9va1wiICtcbiAgICAgICAgICBcIiBpbnRlZ3JhdGlvbiwgc28gaXQgaGFzIGJlZW4gc3VwcHJlc3NlZC4gUGxlYXNlIGNhbGxcIiArXG4gICAgICAgICAgXCIgRkIuZ2V0TG9naW5TdGF0dXMoKSBleHBsaWNpdGx5IGlmIHlvdSByZXF1aXJlIHRoaXMgYmVoYXZpb3IuXCIpO1xuICAgICAgfVxuICAgICAgaW5pdE9wdGlvbnMuc3RhdHVzID0gZmFsc2U7XG4gICAgICBGQi5pbml0KGluaXRPcHRpb25zKTtcbiAgICAgIFBhcnNlLlVzZXIuX3JlZ2lzdGVyQXV0aGVudGljYXRpb25Qcm92aWRlcihwcm92aWRlcik7XG4gICAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgdXNlciBoYXMgdGhlaXIgYWNjb3VudCBsaW5rZWQgdG8gRmFjZWJvb2suXG4gICAgICogXG4gICAgICogQHBhcmFtIHtQYXJzZS5Vc2VyfSB1c2VyIFVzZXIgdG8gY2hlY2sgZm9yIGEgZmFjZWJvb2sgbGluay5cbiAgICAgKiAgICAgVGhlIHVzZXIgbXVzdCBiZSBsb2dnZWQgaW4gb24gdGhpcyBkZXZpY2UuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIHVzZXIgaGFzIHRoZWlyIGFjY291bnRcbiAgICAgKiAgICAgbGlua2VkIHRvIEZhY2Vib29rLlxuICAgICAqL1xuICAgIGlzTGlua2VkOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlci5faXNMaW5rZWQoXCJmYWNlYm9va1wiKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTG9ncyBpbiBhIHVzZXIgdXNpbmcgRmFjZWJvb2suIFRoaXMgbWV0aG9kIGRlbGVnYXRlcyB0byB0aGUgRmFjZWJvb2tcbiAgICAgKiBTREsgdG8gYXV0aGVudGljYXRlIHRoZSB1c2VyLCBhbmQgdGhlbiBhdXRvbWF0aWNhbGx5IGxvZ3MgaW4gKG9yXG4gICAgICogY3JlYXRlcywgaW4gdGhlIGNhc2Ugd2hlcmUgaXQgaXMgYSBuZXcgdXNlcikgYSBQYXJzZS5Vc2VyLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nLCBPYmplY3R9IHBlcm1pc3Npb25zIFRoZSBwZXJtaXNzaW9ucyByZXF1aXJlZCBmb3IgRmFjZWJvb2tcbiAgICAgKiAgICBsb2cgaW4uICBUaGlzIGlzIGEgY29tbWEtc2VwYXJhdGVkIHN0cmluZyBvZiBwZXJtaXNzaW9ucy5cbiAgICAgKiAgICBBbHRlcm5hdGl2ZWx5LCBzdXBwbHkgYSBGYWNlYm9vayBhdXRoRGF0YSBvYmplY3QgYXMgZGVzY3JpYmVkIGluIG91clxuICAgICAqICAgIFJFU1QgQVBJIGRvY3MgaWYgeW91IHdhbnQgdG8gaGFuZGxlIGdldHRpbmcgZmFjZWJvb2sgYXV0aCB0b2tlbnNcbiAgICAgKiAgICB5b3Vyc2VsZi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBTdGFuZGFyZCBvcHRpb25zIG9iamVjdCB3aXRoIHN1Y2Nlc3MgYW5kIGVycm9yXG4gICAgICogICAgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGxvZ0luOiBmdW5jdGlvbihwZXJtaXNzaW9ucywgb3B0aW9ucykge1xuICAgICAgaWYgKCFwZXJtaXNzaW9ucyB8fCBfLmlzU3RyaW5nKHBlcm1pc3Npb25zKSkge1xuICAgICAgICBpZiAoIWluaXRpYWxpemVkKSB7XG4gICAgICAgICAgdGhyb3cgXCJZb3UgbXVzdCBpbml0aWFsaXplIEZhY2Vib29rVXRpbHMgYmVmb3JlIGNhbGxpbmcgbG9nSW4uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdGVkUGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucztcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2xvZ0luV2l0aChcImZhY2Vib29rXCIsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgICBuZXdPcHRpb25zLmF1dGhEYXRhID0gcGVybWlzc2lvbnM7XG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9sb2dJbldpdGgoXCJmYWNlYm9va1wiLCBuZXdPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTGlua3MgRmFjZWJvb2sgdG8gYW4gZXhpc3RpbmcgUEZVc2VyLiBUaGlzIG1ldGhvZCBkZWxlZ2F0ZXMgdG8gdGhlXG4gICAgICogRmFjZWJvb2sgU0RLIHRvIGF1dGhlbnRpY2F0ZSB0aGUgdXNlciwgYW5kIHRoZW4gYXV0b21hdGljYWxseSBsaW5rc1xuICAgICAqIHRoZSBhY2NvdW50IHRvIHRoZSBQYXJzZS5Vc2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQYXJzZS5Vc2VyfSB1c2VyIFVzZXIgdG8gbGluayB0byBGYWNlYm9vay4gVGhpcyBtdXN0IGJlIHRoZVxuICAgICAqICAgICBjdXJyZW50IHVzZXIuXG4gICAgICogQHBhcmFtIHtTdHJpbmcsIE9iamVjdH0gcGVybWlzc2lvbnMgVGhlIHBlcm1pc3Npb25zIHJlcXVpcmVkIGZvciBGYWNlYm9va1xuICAgICAqICAgIGxvZyBpbi4gIFRoaXMgaXMgYSBjb21tYS1zZXBhcmF0ZWQgc3RyaW5nIG9mIHBlcm1pc3Npb25zLiBcbiAgICAgKiAgICBBbHRlcm5hdGl2ZWx5LCBzdXBwbHkgYSBGYWNlYm9vayBhdXRoRGF0YSBvYmplY3QgYXMgZGVzY3JpYmVkIGluIG91clxuICAgICAqICAgIFJFU1QgQVBJIGRvY3MgaWYgeW91IHdhbnQgdG8gaGFuZGxlIGdldHRpbmcgZmFjZWJvb2sgYXV0aCB0b2tlbnNcbiAgICAgKiAgICB5b3Vyc2VsZi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBTdGFuZGFyZCBvcHRpb25zIG9iamVjdCB3aXRoIHN1Y2Nlc3MgYW5kIGVycm9yXG4gICAgICogICAgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGxpbms6IGZ1bmN0aW9uKHVzZXIsIHBlcm1pc3Npb25zLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIXBlcm1pc3Npb25zIHx8IF8uaXNTdHJpbmcocGVybWlzc2lvbnMpKSB7XG4gICAgICAgIGlmICghaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICB0aHJvdyBcIllvdSBtdXN0IGluaXRpYWxpemUgRmFjZWJvb2tVdGlscyBiZWZvcmUgY2FsbGluZyBsaW5rLlwiO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RlZFBlcm1pc3Npb25zID0gcGVybWlzc2lvbnM7XG4gICAgICAgIHJldHVybiB1c2VyLl9saW5rV2l0aChcImZhY2Vib29rXCIsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgICBuZXdPcHRpb25zLmF1dGhEYXRhID0gcGVybWlzc2lvbnM7XG4gICAgICAgIHJldHVybiB1c2VyLl9saW5rV2l0aChcImZhY2Vib29rXCIsIG5ld09wdGlvbnMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmxpbmtzIHRoZSBQYXJzZS5Vc2VyIGZyb20gYSBGYWNlYm9vayBhY2NvdW50LiBcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1BhcnNlLlVzZXJ9IHVzZXIgVXNlciB0byB1bmxpbmsgZnJvbSBGYWNlYm9vay4gVGhpcyBtdXN0IGJlIHRoZVxuICAgICAqICAgICBjdXJyZW50IHVzZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU3RhbmRhcmQgb3B0aW9ucyBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvclxuICAgICAqICAgIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICB1bmxpbms6IGZ1bmN0aW9uKHVzZXIsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgdGhyb3cgXCJZb3UgbXVzdCBpbml0aWFsaXplIEZhY2Vib29rVXRpbHMgYmVmb3JlIGNhbGxpbmcgdW5saW5rLlwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVzZXIuX3VubGlua0Zyb20oXCJmYWNlYm9va1wiLCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG4gIFxufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIF86IGZhbHNlLCBkb2N1bWVudDogZmFsc2UsIHdpbmRvdzogZmFsc2UsIG5hdmlnYXRvcjogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEhpc3Rvcnkgc2VydmVzIGFzIGEgZ2xvYmFsIHJvdXRlciAocGVyIGZyYW1lKSB0byBoYW5kbGUgaGFzaGNoYW5nZVxuICAgKiBldmVudHMgb3IgcHVzaFN0YXRlLCBtYXRjaCB0aGUgYXBwcm9wcmlhdGUgcm91dGUsIGFuZCB0cmlnZ2VyXG4gICAqIGNhbGxiYWNrcy4gWW91IHNob3VsZG4ndCBldmVyIGhhdmUgdG8gY3JlYXRlIG9uZSBvZiB0aGVzZSB5b3Vyc2VsZlxuICAgKiDigJQgeW91IHNob3VsZCB1c2UgdGhlIHJlZmVyZW5jZSB0byA8Y29kZT5QYXJzZS5oaXN0b3J5PC9jb2RlPlxuICAgKiB0aGF0IHdpbGwgYmUgY3JlYXRlZCBmb3IgeW91IGF1dG9tYXRpY2FsbHkgaWYgeW91IG1ha2UgdXNlIG9mIFxuICAgKiBSb3V0ZXJzIHdpdGggcm91dGVzLlxuICAgKiBAY2xhc3NcbiAgICogICBcbiAgICogPHA+QSBmb3JrIG9mIEJhY2tib25lLkhpc3RvcnksIHByb3ZpZGVkIGZvciB5b3VyIGNvbnZlbmllbmNlLiAgSWYgeW91IFxuICAgKiB1c2UgdGhpcyBjbGFzcywgeW91IG11c3QgYWxzbyBpbmNsdWRlIGpRdWVyeSwgb3IgYW5vdGhlciBsaWJyYXJ5IFxuICAgKiB0aGF0IHByb3ZpZGVzIGEgalF1ZXJ5LWNvbXBhdGlibGUgJCBmdW5jdGlvbi4gIEZvciBtb3JlIGluZm9ybWF0aW9uLFxuICAgKiBzZWUgdGhlIDxhIGhyZWY9XCJodHRwOi8vZG9jdW1lbnRjbG91ZC5naXRodWIuY29tL2JhY2tib25lLyNIaXN0b3J5XCI+XG4gICAqIEJhY2tib25lIGRvY3VtZW50YXRpb248L2E+LjwvcD5cbiAgICogPHA+PHN0cm9uZz48ZW0+QXZhaWxhYmxlIGluIHRoZSBjbGllbnQgU0RLIG9ubHkuPC9lbT48L3N0cm9uZz48L3A+XG4gICAqL1xuICBQYXJzZS5IaXN0b3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICAgIF8uYmluZEFsbCh0aGlzLCAnY2hlY2tVcmwnKTtcbiAgfTtcblxuICAvLyBDYWNoZWQgcmVnZXggZm9yIGNsZWFuaW5nIGxlYWRpbmcgaGFzaGVzIGFuZCBzbGFzaGVzIC5cbiAgdmFyIHJvdXRlU3RyaXBwZXIgPSAvXlsjXFwvXS87XG5cbiAgLy8gQ2FjaGVkIHJlZ2V4IGZvciBkZXRlY3RpbmcgTVNJRS5cbiAgdmFyIGlzRXhwbG9yZXIgPSAvbXNpZSBbXFx3Ll0rLztcblxuICAvLyBIYXMgdGhlIGhpc3RvcnkgaGFuZGxpbmcgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQ/XG4gIFBhcnNlLkhpc3Rvcnkuc3RhcnRlZCA9IGZhbHNlO1xuXG4gIC8vIFNldCB1cCBhbGwgaW5oZXJpdGFibGUgKipQYXJzZS5IaXN0b3J5KiogcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbiAgXy5leHRlbmQoUGFyc2UuSGlzdG9yeS5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgICAgICAgLyoqIEBsZW5kcyBQYXJzZS5IaXN0b3J5LnByb3RvdHlwZSAqLyB7XG5cbiAgICAvLyBUaGUgZGVmYXVsdCBpbnRlcnZhbCB0byBwb2xsIGZvciBoYXNoIGNoYW5nZXMsIGlmIG5lY2Vzc2FyeSwgaXNcbiAgICAvLyB0d2VudHkgdGltZXMgYSBzZWNvbmQuXG4gICAgaW50ZXJ2YWw6IDUwLFxuXG4gICAgLy8gR2V0cyB0aGUgdHJ1ZSBoYXNoIHZhbHVlLiBDYW5ub3QgdXNlIGxvY2F0aW9uLmhhc2ggZGlyZWN0bHkgZHVlIHRvIGJ1Z1xuICAgIC8vIGluIEZpcmVmb3ggd2hlcmUgbG9jYXRpb24uaGFzaCB3aWxsIGFsd2F5cyBiZSBkZWNvZGVkLlxuICAgIGdldEhhc2g6IGZ1bmN0aW9uKHdpbmRvd092ZXJyaWRlKSB7XG4gICAgICB2YXIgbG9jID0gd2luZG93T3ZlcnJpZGUgPyB3aW5kb3dPdmVycmlkZS5sb2NhdGlvbiA6IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgIHZhciBtYXRjaCA9IGxvYy5ocmVmLm1hdGNoKC8jKC4qKSQvKTtcbiAgICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XG4gICAgfSxcblxuICAgIC8vIEdldCB0aGUgY3Jvc3MtYnJvd3NlciBub3JtYWxpemVkIFVSTCBmcmFnbWVudCwgZWl0aGVyIGZyb20gdGhlIFVSTCxcbiAgICAvLyB0aGUgaGFzaCwgb3IgdGhlIG92ZXJyaWRlLlxuICAgIGdldEZyYWdtZW50OiBmdW5jdGlvbihmcmFnbWVudCwgZm9yY2VQdXNoU3RhdGUpIHtcbiAgICAgIGlmIChQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQoZnJhZ21lbnQpKSB7XG4gICAgICAgIGlmICh0aGlzLl9oYXNQdXNoU3RhdGUgfHwgZm9yY2VQdXNoU3RhdGUpIHtcbiAgICAgICAgICBmcmFnbWVudCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgICB2YXIgc2VhcmNoID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgICAgICAgICBpZiAoc2VhcmNoKSB7XG4gICAgICAgICAgICBmcmFnbWVudCArPSBzZWFyY2g7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZyYWdtZW50ID0gdGhpcy5nZXRIYXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZnJhZ21lbnQuaW5kZXhPZih0aGlzLm9wdGlvbnMucm9vdCkpIHtcbiAgICAgICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zdWJzdHIodGhpcy5vcHRpb25zLnJvb3QubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcmFnbWVudC5yZXBsYWNlKHJvdXRlU3RyaXBwZXIsICcnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGhhc2ggY2hhbmdlIGhhbmRsaW5nLCByZXR1cm5pbmcgYHRydWVgIGlmIHRoZSBjdXJyZW50XG4gICAgICogVVJMIG1hdGNoZXMgYW4gZXhpc3Rpbmcgcm91dGUsIGFuZCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBzdGFydDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgaWYgKFBhcnNlLkhpc3Rvcnkuc3RhcnRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZS5oaXN0b3J5IGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZFwiKTtcbiAgICAgIH1cbiAgICAgIFBhcnNlLkhpc3Rvcnkuc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIC8vIEZpZ3VyZSBvdXQgdGhlIGluaXRpYWwgY29uZmlndXJhdGlvbi4gRG8gd2UgbmVlZCBhbiBpZnJhbWU/XG4gICAgICAvLyBJcyBwdXNoU3RhdGUgZGVzaXJlZCAuLi4gaXMgaXQgYXZhaWxhYmxlP1xuICAgICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoe30sIHtyb290OiAnLyd9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5fd2FudHNIYXNoQ2hhbmdlID0gdGhpcy5vcHRpb25zLmhhc2hDaGFuZ2UgIT09IGZhbHNlO1xuICAgICAgdGhpcy5fd2FudHNQdXNoU3RhdGUgPSAhIXRoaXMub3B0aW9ucy5wdXNoU3RhdGU7XG4gICAgICB0aGlzLl9oYXNQdXNoU3RhdGUgPSAhISh0aGlzLm9wdGlvbnMucHVzaFN0YXRlICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gICAgICB2YXIgZnJhZ21lbnQgPSB0aGlzLmdldEZyYWdtZW50KCk7XG4gICAgICB2YXIgZG9jTW9kZSA9IGRvY3VtZW50LmRvY3VtZW50TW9kZTtcbiAgICAgIHZhciBvbGRJRSA9IChpc0V4cGxvcmVyLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAmJlxuICAgICAgICAgICAgICAgICAgICghZG9jTW9kZSB8fCBkb2NNb2RlIDw9IDcpKTtcblxuICAgICAgaWYgKG9sZElFKSB7XG4gICAgICAgIHRoaXMuaWZyYW1lID0gUGFyc2UuJCgnPGlmcmFtZSBzcmM9XCJqYXZhc2NyaXB0OjBcIiB0YWJpbmRleD1cIi0xXCIgLz4nKVxuICAgICAgICAgICAgICAgICAgICAgIC5oaWRlKCkuYXBwZW5kVG8oJ2JvZHknKVswXS5jb250ZW50V2luZG93O1xuICAgICAgICB0aGlzLm5hdmlnYXRlKGZyYWdtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gRGVwZW5kaW5nIG9uIHdoZXRoZXIgd2UncmUgdXNpbmcgcHVzaFN0YXRlIG9yIGhhc2hlcywgYW5kIHdoZXRoZXJcbiAgICAgIC8vICdvbmhhc2hjaGFuZ2UnIGlzIHN1cHBvcnRlZCwgZGV0ZXJtaW5lIGhvdyB3ZSBjaGVjayB0aGUgVVJMIHN0YXRlLlxuICAgICAgaWYgKHRoaXMuX2hhc1B1c2hTdGF0ZSkge1xuICAgICAgICBQYXJzZS4kKHdpbmRvdykuYmluZCgncG9wc3RhdGUnLCB0aGlzLmNoZWNrVXJsKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlICYmXG4gICAgICAgICAgICAgICAgICgnb25oYXNoY2hhbmdlJyBpbiB3aW5kb3cpICYmXG4gICAgICAgICAgICAgICAgICFvbGRJRSkge1xuICAgICAgICBQYXJzZS4kKHdpbmRvdykuYmluZCgnaGFzaGNoYW5nZScsIHRoaXMuY2hlY2tVcmwpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tVcmxJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLmNoZWNrVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgfVxuXG4gICAgICAvLyBEZXRlcm1pbmUgaWYgd2UgbmVlZCB0byBjaGFuZ2UgdGhlIGJhc2UgdXJsLCBmb3IgYSBwdXNoU3RhdGUgbGlua1xuICAgICAgLy8gb3BlbmVkIGJ5IGEgbm9uLXB1c2hTdGF0ZSBicm93c2VyLlxuICAgICAgdGhpcy5mcmFnbWVudCA9IGZyYWdtZW50O1xuICAgICAgdmFyIGxvYyA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgIHZhciBhdFJvb3QgID0gbG9jLnBhdGhuYW1lID09PSB0aGlzLm9wdGlvbnMucm9vdDtcblxuICAgICAgLy8gSWYgd2UndmUgc3RhcnRlZCBvZmYgd2l0aCBhIHJvdXRlIGZyb20gYSBgcHVzaFN0YXRlYC1lbmFibGVkIGJyb3dzZXIsXG4gICAgICAvLyBidXQgd2UncmUgY3VycmVudGx5IGluIGEgYnJvd3NlciB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBpdC4uLlxuICAgICAgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSAmJiBcbiAgICAgICAgICB0aGlzLl93YW50c1B1c2hTdGF0ZSAmJiBcbiAgICAgICAgICAhdGhpcy5faGFzUHVzaFN0YXRlICYmXG4gICAgICAgICAgIWF0Um9vdCkge1xuICAgICAgICB0aGlzLmZyYWdtZW50ID0gdGhpcy5nZXRGcmFnbWVudChudWxsLCB0cnVlKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UodGhpcy5vcHRpb25zLnJvb3QgKyAnIycgKyB0aGlzLmZyYWdtZW50KTtcbiAgICAgICAgLy8gUmV0dXJuIGltbWVkaWF0ZWx5IGFzIGJyb3dzZXIgd2lsbCBkbyByZWRpcmVjdCB0byBuZXcgdXJsXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAvLyBPciBpZiB3ZSd2ZSBzdGFydGVkIG91dCB3aXRoIGEgaGFzaC1iYXNlZCByb3V0ZSwgYnV0IHdlJ3JlIGN1cnJlbnRseVxuICAgICAgLy8gaW4gYSBicm93c2VyIHdoZXJlIGl0IGNvdWxkIGJlIGBwdXNoU3RhdGVgLWJhc2VkIGluc3RlYWQuLi5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2FudHNQdXNoU3RhdGUgJiZcbiAgICAgICAgICAgICAgICAgdGhpcy5faGFzUHVzaFN0YXRlICYmIFxuICAgICAgICAgICAgICAgICBhdFJvb3QgJiZcbiAgICAgICAgICAgICAgICAgbG9jLmhhc2gpIHtcbiAgICAgICAgdGhpcy5mcmFnbWVudCA9IHRoaXMuZ2V0SGFzaCgpLnJlcGxhY2Uocm91dGVTdHJpcHBlciwgJycpO1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgbG9jLnByb3RvY29sICsgJy8vJyArIGxvYy5ob3N0ICsgdGhpcy5vcHRpb25zLnJvb3QgKyB0aGlzLmZyYWdtZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRVcmwoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRGlzYWJsZSBQYXJzZS5oaXN0b3J5LCBwZXJoYXBzIHRlbXBvcmFyaWx5LiBOb3QgdXNlZnVsIGluIGEgcmVhbCBhcHAsXG4gICAgLy8gYnV0IHBvc3NpYmx5IHVzZWZ1bCBmb3IgdW5pdCB0ZXN0aW5nIFJvdXRlcnMuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICBQYXJzZS4kKHdpbmRvdykudW5iaW5kKCdwb3BzdGF0ZScsIHRoaXMuY2hlY2tVcmwpXG4gICAgICAgICAgICAgICAgICAgICAudW5iaW5kKCdoYXNoY2hhbmdlJywgdGhpcy5jaGVja1VybCk7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLl9jaGVja1VybEludGVydmFsKTtcbiAgICAgIFBhcnNlLkhpc3Rvcnkuc3RhcnRlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBBZGQgYSByb3V0ZSB0byBiZSB0ZXN0ZWQgd2hlbiB0aGUgZnJhZ21lbnQgY2hhbmdlcy4gUm91dGVzIGFkZGVkIGxhdGVyXG4gICAgLy8gbWF5IG92ZXJyaWRlIHByZXZpb3VzIHJvdXRlcy5cbiAgICByb3V0ZTogZnVuY3Rpb24ocm91dGUsIGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzLnVuc2hpZnQoe3JvdXRlOiByb3V0ZSwgY2FsbGJhY2s6IGNhbGxiYWNrfSk7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBVUkwgdG8gc2VlIGlmIGl0IGhhcyBjaGFuZ2VkLCBhbmQgaWYgaXQgaGFzLFxuICAgIC8vIGNhbGxzIGBsb2FkVXJsYCwgbm9ybWFsaXppbmcgYWNyb3NzIHRoZSBoaWRkZW4gaWZyYW1lLlxuICAgIGNoZWNrVXJsOiBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuZ2V0RnJhZ21lbnQoKTtcbiAgICAgIGlmIChjdXJyZW50ID09PSB0aGlzLmZyYWdtZW50ICYmIHRoaXMuaWZyYW1lKSB7XG4gICAgICAgIGN1cnJlbnQgPSB0aGlzLmdldEZyYWdtZW50KHRoaXMuZ2V0SGFzaCh0aGlzLmlmcmFtZSkpO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQgPT09IHRoaXMuZnJhZ21lbnQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaWZyYW1lKSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGUoY3VycmVudCk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubG9hZFVybCgpKSB7XG4gICAgICAgIHRoaXMubG9hZFVybCh0aGlzLmdldEhhc2goKSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEF0dGVtcHQgdG8gbG9hZCB0aGUgY3VycmVudCBVUkwgZnJhZ21lbnQuIElmIGEgcm91dGUgc3VjY2VlZHMgd2l0aCBhXG4gICAgLy8gbWF0Y2gsIHJldHVybnMgYHRydWVgLiBJZiBubyBkZWZpbmVkIHJvdXRlcyBtYXRjaGVzIHRoZSBmcmFnbWVudCxcbiAgICAvLyByZXR1cm5zIGBmYWxzZWAuXG4gICAgbG9hZFVybDogZnVuY3Rpb24oZnJhZ21lbnRPdmVycmlkZSkge1xuICAgICAgdmFyIGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudCA9IHRoaXMuZ2V0RnJhZ21lbnQoZnJhZ21lbnRPdmVycmlkZSk7XG4gICAgICB2YXIgbWF0Y2hlZCA9IF8uYW55KHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGhhbmRsZXIucm91dGUudGVzdChmcmFnbWVudCkpIHtcbiAgICAgICAgICBoYW5kbGVyLmNhbGxiYWNrKGZyYWdtZW50KTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbWF0Y2hlZDtcbiAgICB9LFxuXG4gICAgLy8gU2F2ZSBhIGZyYWdtZW50IGludG8gdGhlIGhhc2ggaGlzdG9yeSwgb3IgcmVwbGFjZSB0aGUgVVJMIHN0YXRlIGlmIHRoZVxuICAgIC8vICdyZXBsYWNlJyBvcHRpb24gaXMgcGFzc2VkLiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvciBwcm9wZXJseSBVUkwtZW5jb2RpbmdcbiAgICAvLyB0aGUgZnJhZ21lbnQgaW4gYWR2YW5jZS5cbiAgICAvL1xuICAgIC8vIFRoZSBvcHRpb25zIG9iamVjdCBjYW4gY29udGFpbiBgdHJpZ2dlcjogdHJ1ZWAgaWYgeW91IHdpc2ggdG8gaGF2ZSB0aGVcbiAgICAvLyByb3V0ZSBjYWxsYmFjayBiZSBmaXJlZCAobm90IHVzdWFsbHkgZGVzaXJhYmxlKSwgb3IgYHJlcGxhY2U6IHRydWVgLCBpZlxuICAgIC8vIHlvdSB3aXNoIHRvIG1vZGlmeSB0aGUgY3VycmVudCBVUkwgd2l0aG91dCBhZGRpbmcgYW4gZW50cnkgdG8gdGhlXG4gICAgLy8gaGlzdG9yeS5cbiAgICBuYXZpZ2F0ZTogZnVuY3Rpb24oZnJhZ21lbnQsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghUGFyc2UuSGlzdG9yeS5zdGFydGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghb3B0aW9ucyB8fCBvcHRpb25zID09PSB0cnVlKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7dHJpZ2dlcjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICB2YXIgZnJhZyA9IChmcmFnbWVudCB8fCAnJykucmVwbGFjZShyb3V0ZVN0cmlwcGVyLCAnJyk7XG4gICAgICBpZiAodGhpcy5mcmFnbWVudCA9PT0gZnJhZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHB1c2hTdGF0ZSBpcyBhdmFpbGFibGUsIHdlIHVzZSBpdCB0byBzZXQgdGhlIGZyYWdtZW50IGFzIGEgcmVhbCBVUkwuXG4gICAgICBpZiAodGhpcy5faGFzUHVzaFN0YXRlKSB7XG4gICAgICAgIGlmIChmcmFnLmluZGV4T2YodGhpcy5vcHRpb25zLnJvb3QpICE9PSAwKSB7XG4gICAgICAgICAgZnJhZyA9IHRoaXMub3B0aW9ucy5yb290ICsgZnJhZztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZyYWdtZW50ID0gZnJhZztcbiAgICAgICAgdmFyIHJlcGxhY2VPclB1c2ggPSBvcHRpb25zLnJlcGxhY2UgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnO1xuICAgICAgICB3aW5kb3cuaGlzdG9yeVtyZXBsYWNlT3JQdXNoXSh7fSwgZG9jdW1lbnQudGl0bGUsIGZyYWcpO1xuXG4gICAgICAvLyBJZiBoYXNoIGNoYW5nZXMgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZGlzYWJsZWQsIHVwZGF0ZSB0aGUgaGFzaFxuICAgICAgLy8gZnJhZ21lbnQgdG8gc3RvcmUgaGlzdG9yeS5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuZnJhZ21lbnQgPSBmcmFnO1xuICAgICAgICB0aGlzLl91cGRhdGVIYXNoKHdpbmRvdy5sb2NhdGlvbiwgZnJhZywgb3B0aW9ucy5yZXBsYWNlKTtcbiAgICAgICAgaWYgKHRoaXMuaWZyYW1lICYmXG4gICAgICAgICAgICAoZnJhZyAhPT0gdGhpcy5nZXRGcmFnbWVudCh0aGlzLmdldEhhc2godGhpcy5pZnJhbWUpKSkpIHtcbiAgICAgICAgICAvLyBPcGVuaW5nIGFuZCBjbG9zaW5nIHRoZSBpZnJhbWUgdHJpY2tzIElFNyBhbmQgZWFybGllclxuICAgICAgICAgIC8vIHRvIHB1c2ggYSBoaXN0b3J5IGVudHJ5IG9uIGhhc2gtdGFnIGNoYW5nZS5cbiAgICAgICAgICAvLyBXaGVuIHJlcGxhY2UgaXMgdHJ1ZSwgd2UgZG9uJ3Qgd2FudCB0aGlzLlxuICAgICAgICAgIGlmICghb3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZS5kb2N1bWVudC5vcGVuKCkuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fdXBkYXRlSGFzaCh0aGlzLmlmcmFtZS5sb2NhdGlvbiwgZnJhZywgb3B0aW9ucy5yZXBsYWNlKTtcbiAgICAgICAgfVxuXG4gICAgICAvLyBJZiB5b3UndmUgdG9sZCB1cyB0aGF0IHlvdSBleHBsaWNpdGx5IGRvbid0IHdhbnQgZmFsbGJhY2sgaGFzaGNoYW5nZS1cbiAgICAgIC8vIGJhc2VkIGhpc3RvcnksIHRoZW4gYG5hdmlnYXRlYCBiZWNvbWVzIGEgcGFnZSByZWZyZXNoLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih0aGlzLm9wdGlvbnMucm9vdCArIGZyYWdtZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnRyaWdnZXIpIHtcbiAgICAgICAgdGhpcy5sb2FkVXJsKGZyYWdtZW50KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVXBkYXRlIHRoZSBoYXNoIGxvY2F0aW9uLCBlaXRoZXIgcmVwbGFjaW5nIHRoZSBjdXJyZW50IGVudHJ5LCBvciBhZGRpbmdcbiAgICAvLyBhIG5ldyBvbmUgdG8gdGhlIGJyb3dzZXIgaGlzdG9yeS5cbiAgICBfdXBkYXRlSGFzaDogZnVuY3Rpb24obG9jYXRpb24sIGZyYWdtZW50LCByZXBsYWNlKSB7XG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICB2YXIgcyA9IGxvY2F0aW9uLnRvU3RyaW5nKCkucmVwbGFjZSgvKGphdmFzY3JpcHQ6fCMpLiokLywgJycpO1xuICAgICAgICBsb2NhdGlvbi5yZXBsYWNlKHMgKyAnIycgKyBmcmFnbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhdGlvbi5oYXNoID0gZnJhZ21lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0odGhpcykpO1xuXG4vKmdsb2JhbCBfOiBmYWxzZSovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBSb3V0ZXJzIG1hcCBmYXV4LVVSTHMgdG8gYWN0aW9ucywgYW5kIGZpcmUgZXZlbnRzIHdoZW4gcm91dGVzIGFyZVxuICAgKiBtYXRjaGVkLiBDcmVhdGluZyBhIG5ldyBvbmUgc2V0cyBpdHMgYHJvdXRlc2AgaGFzaCwgaWYgbm90IHNldCBzdGF0aWNhbGx5LlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+QSBmb3JrIG9mIEJhY2tib25lLlJvdXRlciwgcHJvdmlkZWQgZm9yIHlvdXIgY29udmVuaWVuY2UuXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlXG4gICAqIDxhIGhyZWY9XCJodHRwOi8vZG9jdW1lbnRjbG91ZC5naXRodWIuY29tL2JhY2tib25lLyNSb3V0ZXJcIj5CYWNrYm9uZVxuICAgKiBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqIDxwPjxzdHJvbmc+PGVtPkF2YWlsYWJsZSBpbiB0aGUgY2xpZW50IFNESyBvbmx5LjwvZW0+PC9zdHJvbmc+PC9wPlxuICAgKi9cbiAgUGFyc2UuUm91dGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChvcHRpb25zLnJvdXRlcykge1xuICAgICAgdGhpcy5yb3V0ZXMgPSBvcHRpb25zLnJvdXRlcztcbiAgICB9XG4gICAgdGhpcy5fYmluZFJvdXRlcygpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIENhY2hlZCByZWd1bGFyIGV4cHJlc3Npb25zIGZvciBtYXRjaGluZyBuYW1lZCBwYXJhbSBwYXJ0cyBhbmQgc3BsYXR0ZWRcbiAgLy8gcGFydHMgb2Ygcm91dGUgc3RyaW5ncy5cbiAgdmFyIG5hbWVkUGFyYW0gICAgPSAvOlxcdysvZztcbiAgdmFyIHNwbGF0UGFyYW0gICAgPSAvXFwqXFx3Ky9nO1xuICB2YXIgZXNjYXBlUmVnRXhwICA9IC9bXFwtXFxbXFxde30oKSs/LixcXFxcXFxeXFwkXFx8I1xcc10vZztcblxuICAvLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqUGFyc2UuUm91dGVyKiogcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbiAgXy5leHRlbmQoUGFyc2UuUm91dGVyLnByb3RvdHlwZSwgUGFyc2UuRXZlbnRzLFxuICAgICAgICAgICAvKiogQGxlbmRzIFBhcnNlLlJvdXRlci5wcm90b3R5cGUgKi8ge1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBpcyBhbiBlbXB0eSBmdW5jdGlvbiBieSBkZWZhdWx0LiBPdmVycmlkZSBpdCB3aXRoIHlvdXIgb3duXG4gICAgICogaW5pdGlhbGl6YXRpb24gbG9naWMuXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXt9LFxuXG4gICAgLyoqXG4gICAgICogTWFudWFsbHkgYmluZCBhIHNpbmdsZSBuYW1lZCByb3V0ZSB0byBhIGNhbGxiYWNrLiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqIDxwcmU+dGhpcy5yb3V0ZSgnc2VhcmNoLzpxdWVyeS9wOm51bScsICdzZWFyY2gnLCBmdW5jdGlvbihxdWVyeSwgbnVtKSB7XG4gICAgICogICAgICAgLi4uXG4gICAgICogICAgIH0pOzwvcHJlPlxuICAgICAqL1xuICAgIHJvdXRlOiBmdW5jdGlvbihyb3V0ZSwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICAgIFBhcnNlLmhpc3RvcnkgPSBQYXJzZS5oaXN0b3J5IHx8IG5ldyBQYXJzZS5IaXN0b3J5KCk7XG4gICAgICBpZiAoIV8uaXNSZWdFeHAocm91dGUpKSB7XG4gICAgICAgIHJvdXRlID0gdGhpcy5fcm91dGVUb1JlZ0V4cChyb3V0ZSk7XG4gICAgICB9IFxuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IHRoaXNbbmFtZV07XG4gICAgICB9XG4gICAgICBQYXJzZS5oaXN0b3J5LnJvdXRlKHJvdXRlLCBfLmJpbmQoZnVuY3Rpb24oZnJhZ21lbnQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLl9leHRyYWN0UGFyYW1ldGVycyhyb3V0ZSwgZnJhZ21lbnQpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyaWdnZXIuYXBwbHkodGhpcywgWydyb3V0ZTonICsgbmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgUGFyc2UuaGlzdG9yeS50cmlnZ2VyKCdyb3V0ZScsIHRoaXMsIG5hbWUsIGFyZ3MpO1xuICAgICAgfSwgdGhpcykpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZW5ldmVyIHlvdSByZWFjaCBhIHBvaW50IGluIHlvdXIgYXBwbGljYXRpb24gdGhhdCB5b3UnZFxuICAgICAqIGxpa2UgdG8gc2F2ZSBhcyBhIFVSTCwgY2FsbCBuYXZpZ2F0ZSBpbiBvcmRlciB0byB1cGRhdGUgdGhlXG4gICAgICogVVJMLiBJZiB5b3Ugd2lzaCB0byBhbHNvIGNhbGwgdGhlIHJvdXRlIGZ1bmN0aW9uLCBzZXQgdGhlIFxuICAgICAqIHRyaWdnZXIgb3B0aW9uIHRvIHRydWUuIFRvIHVwZGF0ZSB0aGUgVVJMIHdpdGhvdXQgY3JlYXRpbmdcbiAgICAgKiBhbiBlbnRyeSBpbiB0aGUgYnJvd3NlcidzIGhpc3RvcnksIHNldCB0aGUgcmVwbGFjZSBvcHRpb25cbiAgICAgKiB0byB0cnVlLlxuICAgICAqL1xuICAgIG5hdmlnYXRlOiBmdW5jdGlvbihmcmFnbWVudCwgb3B0aW9ucykge1xuICAgICAgUGFyc2UuaGlzdG9yeS5uYXZpZ2F0ZShmcmFnbWVudCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIEJpbmQgYWxsIGRlZmluZWQgcm91dGVzIHRvIGBQYXJzZS5oaXN0b3J5YC4gV2UgaGF2ZSB0byByZXZlcnNlIHRoZVxuICAgIC8vIG9yZGVyIG9mIHRoZSByb3V0ZXMgaGVyZSB0byBzdXBwb3J0IGJlaGF2aW9yIHdoZXJlIHRoZSBtb3N0IGdlbmVyYWxcbiAgICAvLyByb3V0ZXMgY2FuIGJlIGRlZmluZWQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcm91dGUgbWFwLlxuICAgIF9iaW5kUm91dGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5yb3V0ZXMpIHsgXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciByb3V0ZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIHJvdXRlIGluIHRoaXMucm91dGVzKSB7XG4gICAgICAgIGlmICh0aGlzLnJvdXRlcy5oYXNPd25Qcm9wZXJ0eShyb3V0ZSkpIHtcbiAgICAgICAgICByb3V0ZXMudW5zaGlmdChbcm91dGUsIHRoaXMucm91dGVzW3JvdXRlXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJvdXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5yb3V0ZShyb3V0ZXNbaV1bMF0sIHJvdXRlc1tpXVsxXSwgdGhpc1tyb3V0ZXNbaV1bMV1dKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIHJvdXRlIHN0cmluZyBpbnRvIGEgcmVndWxhciBleHByZXNzaW9uLCBzdWl0YWJsZSBmb3IgbWF0Y2hpbmdcbiAgICAvLyBhZ2FpbnN0IHRoZSBjdXJyZW50IGxvY2F0aW9uIGhhc2guXG4gICAgX3JvdXRlVG9SZWdFeHA6IGZ1bmN0aW9uKHJvdXRlKSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLnJlcGxhY2UoZXNjYXBlUmVnRXhwLCAnXFxcXCQmJylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZShuYW1lZFBhcmFtLCAnKFteXFwvXSspJylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZShzcGxhdFBhcmFtLCAnKC4qPyknKTtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJvdXRlICsgJyQnKTtcbiAgICB9LFxuXG4gICAgLy8gR2l2ZW4gYSByb3V0ZSwgYW5kIGEgVVJMIGZyYWdtZW50IHRoYXQgaXQgbWF0Y2hlcywgcmV0dXJuIHRoZSBhcnJheSBvZlxuICAgIC8vIGV4dHJhY3RlZCBwYXJhbWV0ZXJzLlxuICAgIF9leHRyYWN0UGFyYW1ldGVyczogZnVuY3Rpb24ocm91dGUsIGZyYWdtZW50KSB7XG4gICAgICByZXR1cm4gcm91dGUuZXhlYyhmcmFnbWVudCkuc2xpY2UoMSk7XG4gICAgfVxuICB9KTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVByb3BzIEluc3RhbmNlIHByb3BlcnRpZXMgZm9yIHRoZSByb3V0ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc1Byb3BzIENsYXNzIHByb3BlcmllcyBmb3IgdGhlIHJvdXRlci5cbiAgICogQHJldHVybiB7Q2xhc3N9IEEgbmV3IHN1YmNsYXNzIG9mIDxjb2RlPlBhcnNlLlJvdXRlcjwvY29kZT4uXG4gICAqL1xuICBQYXJzZS5Sb3V0ZXIuZXh0ZW5kID0gUGFyc2UuX2V4dGVuZDtcbn0odGhpcykpO1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQG5hbWVzcGFjZSBDb250YWlucyBmdW5jdGlvbnMgZm9yIGNhbGxpbmcgYW5kIGRlY2xhcmluZ1xuICAgKiA8YSBocmVmPVwiL2RvY3MvY2xvdWRfY29kZV9ndWlkZSNmdW5jdGlvbnNcIj5jbG91ZCBmdW5jdGlvbnM8L2E+LlxuICAgKiA8cD48c3Ryb25nPjxlbT5cbiAgICogICBTb21lIGZ1bmN0aW9ucyBhcmUgb25seSBhdmFpbGFibGUgZnJvbSBDbG91ZCBDb2RlLlxuICAgKiA8L2VtPjwvc3Ryb25nPjwvcD5cbiAgICovXG4gIFBhcnNlLkNsb3VkID0gUGFyc2UuQ2xvdWQgfHwge307XG5cbiAgXy5leHRlbmQoUGFyc2UuQ2xvdWQsIC8qKiBAbGVuZHMgUGFyc2UuQ2xvdWQgKi8ge1xuICAgIC8qKlxuICAgICAqIE1ha2VzIGEgY2FsbCB0byBhIGNsb3VkIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBmdW5jdGlvbiBuYW1lLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBwYXJhbWV0ZXJzIHRvIHNlbmQgdG8gdGhlIGNsb3VkIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3RcbiAgICAgKiBvcHRpb25zLnN1Y2Nlc3MsIGlmIHNldCwgc2hvdWxkIGJlIGEgZnVuY3Rpb24gdG8gaGFuZGxlIGEgc3VjY2Vzc2Z1bFxuICAgICAqIGNhbGwgdG8gYSBjbG91ZCBmdW5jdGlvbi4gIG9wdGlvbnMuZXJyb3Igc2hvdWxkIGJlIGEgZnVuY3Rpb24gdGhhdFxuICAgICAqIGhhbmRsZXMgYW4gZXJyb3IgcnVubmluZyB0aGUgY2xvdWQgZnVuY3Rpb24uICBCb3RoIGZ1bmN0aW9ucyBhcmVcbiAgICAgKiBvcHRpb25hbC4gIEJvdGggZnVuY3Rpb25zIHRha2UgYSBzaW5nbGUgYXJndW1lbnQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCBiZSByZXNvbHZlZCB3aXRoIHRoZSByZXN1bHRcbiAgICAgKiBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcnVuOiBmdW5jdGlvbihuYW1lLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcImZ1bmN0aW9uc1wiLFxuICAgICAgICBjbGFzc05hbWU6IG5hbWUsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBkYXRhOiBQYXJzZS5fZW5jb2RlKGRhdGEsIG51bGwsIHRydWUpXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5fZGVjb2RlKG51bGwsIHJlc3ApLnJlc3VsdDtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG5cbiAgUGFyc2UuSW5zdGFsbGF0aW9uID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIl9JbnN0YWxsYXRpb25cIik7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIGZ1bmN0aW9ucyB0byBkZWFsIHdpdGggUHVzaCBpbiBQYXJzZVxuICAgKiBAbmFtZSBQYXJzZS5QdXNoXG4gICAqIEBuYW1lc3BhY2VcbiAgICovXG4gIFBhcnNlLlB1c2ggPSBQYXJzZS5QdXNoIHx8IHt9O1xuXG4gIC8qKlxuICAgKiBTZW5kcyBhIHB1c2ggbm90aWZpY2F0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtICBUaGUgZGF0YSBvZiB0aGUgcHVzaCBub3RpZmljYXRpb24uICBWYWxpZCBmaWVsZHNcbiAgICogYXJlOlxuICAgKiAgIDxvbD5cbiAgICogICAgIDxsaT5jaGFubmVscyAtIEFuIEFycmF5IG9mIGNoYW5uZWxzIHRvIHB1c2ggdG8uPC9saT5cbiAgICogICAgIDxsaT5wdXNoX3RpbWUgLSBBIERhdGUgb2JqZWN0IGZvciB3aGVuIHRvIHNlbmQgdGhlIHB1c2guPC9saT5cbiAgICogICAgIDxsaT5leHBpcmF0aW9uX3RpbWUgLSAgQSBEYXRlIG9iamVjdCBmb3Igd2hlbiB0byBleHBpcmVcbiAgICogICAgICAgICB0aGUgcHVzaC48L2xpPlxuICAgKiAgICAgPGxpPmV4cGlyYXRpb25faW50ZXJ2YWwgLSBUaGUgc2Vjb25kcyBmcm9tIG5vdyB0byBleHBpcmUgdGhlIHB1c2guPC9saT5cbiAgICogICAgIDxsaT53aGVyZSAtIEEgUGFyc2UuUXVlcnkgb3ZlciBQYXJzZS5JbnN0YWxsYXRpb24gdGhhdCBpcyB1c2VkIHRvIG1hdGNoXG4gICAqICAgICAgICAgYSBzZXQgb2YgaW5zdGFsbGF0aW9ucyB0byBwdXNoIHRvLjwvbGk+XG4gICAqICAgICA8bGk+ZGF0YSAtIFRoZSBkYXRhIHRvIHNlbmQgYXMgcGFydCBvZiB0aGUgcHVzaDwvbGk+XG4gICAqICAgPG9sPlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3QgdGhhdCBoYXMgYW4gb3B0aW9uYWwgc3VjY2VzcyBmdW5jdGlvbixcbiAgICogdGhhdCB0YWtlcyBubyBhcmd1bWVudHMgYW5kIHdpbGwgYmUgY2FsbGVkIG9uIGEgc3VjY2Vzc2Z1bCBwdXNoLCBhbmRcbiAgICogYW4gZXJyb3IgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIFBhcnNlLkVycm9yIGFuZCB3aWxsIGJlIGNhbGxlZCBpZiB0aGUgcHVzaFxuICAgKiBmYWlsZWQuXG4gICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBwdXNoIHJlcXVlc3RcbiAgICogICAgIGNvbXBsZXRlcy5cbiAgICovXG4gIFBhcnNlLlB1c2guc2VuZCA9IGZ1bmN0aW9uKGRhdGEsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGlmIChkYXRhLndoZXJlKSB7XG4gICAgICBkYXRhLndoZXJlID0gZGF0YS53aGVyZS50b0pTT04oKS53aGVyZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5wdXNoX3RpbWUpIHtcbiAgICAgIGRhdGEucHVzaF90aW1lID0gZGF0YS5wdXNoX3RpbWUudG9KU09OKCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuZXhwaXJhdGlvbl90aW1lKSB7XG4gICAgICBkYXRhLmV4cGlyYXRpb25fdGltZSA9IGRhdGEuZXhwaXJhdGlvbl90aW1lLnRvSlNPTigpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmV4cGlyYXRpb25fdGltZSAmJiBkYXRhLmV4cGlyYXRpb25faW50ZXJ2YWwpIHtcbiAgICAgIHRocm93IFwiQm90aCBleHBpcmF0aW9uX3RpbWUgYW5kIGV4cGlyYXRpb25faW50ZXJ2YWwgY2FuJ3QgYmUgc2V0XCI7XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICByb3V0ZTogJ3B1c2gnLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleVxuICAgIH0pO1xuICAgIHJldHVybiByZXF1ZXN0Ll90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xufSh0aGlzKSk7XG4iLCIvKiBSaW90IHYyLjAuMTUsIEBsaWNlbnNlIE1JVCwgKGMpIDIwMTUgTXV1dCBJbmMuICsgY29udHJpYnV0b3JzICovXG5cbjsoZnVuY3Rpb24od2luZG93KSB7XG4gIC8vICd1c2Ugc3RyaWN0JyBkb2VzIG5vdCBhbGxvdyB1cyB0byBvdmVycmlkZSB0aGUgZXZlbnRzIHByb3BlcnRpZXMgaHR0cHM6Ly9naXRodWIuY29tL211dXQvcmlvdGpzL2Jsb2IvZGV2L2xpYi90YWcvdXBkYXRlLmpzI0w3LUwxMFxuICAvLyBpdCBsZWFkcyB0byB0aGUgZm9sbG93aW5nIGVycm9yIG9uIGZpcmVmb3ggXCJzZXR0aW5nIGEgcHJvcGVydHkgdGhhdCBoYXMgb25seSBhIGdldHRlclwiXG4gIC8vJ3VzZSBzdHJpY3QnXG5cbiAgdmFyIHJpb3QgPSB7IHZlcnNpb246ICd2Mi4wLjE1Jywgc2V0dGluZ3M6IHt9IH0sXG4gICAgICBpZVZlcnNpb24gPSBjaGVja0lFKClcblxucmlvdC5vYnNlcnZhYmxlID0gZnVuY3Rpb24oZWwpIHtcblxuICBlbCA9IGVsIHx8IHt9XG5cbiAgdmFyIGNhbGxiYWNrcyA9IHt9LFxuICAgICAgX2lkID0gMFxuXG4gIGVsLm9uID0gZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm4uX2lkID0gdHlwZW9mIGZuLl9pZCA9PSAndW5kZWZpbmVkJyA/IF9pZCsrIDogZm4uX2lkXG5cbiAgICAgIGV2ZW50cy5yZXBsYWNlKC9cXFMrL2csIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuICAgICAgICAoY2FsbGJhY2tzW25hbWVdID0gY2FsbGJhY2tzW25hbWVdIHx8IFtdKS5wdXNoKGZuKVxuICAgICAgICBmbi50eXBlZCA9IHBvcyA+IDBcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgZWwub2ZmID0gZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgIGlmIChldmVudHMgPT0gJyonKSBjYWxsYmFja3MgPSB7fVxuICAgIGVsc2Uge1xuICAgICAgZXZlbnRzLnJlcGxhY2UoL1xcUysvZywgZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNiOyAoY2IgPSBhcnIgJiYgYXJyW2ldKTsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY2IuX2lkID09IGZuLl9pZCkgeyBhcnIuc3BsaWNlKGksIDEpOyBpLS0gfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFja3NbbmFtZV0gPSBbXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIC8vIG9ubHkgc2luZ2xlIGV2ZW50IHN1cHBvcnRlZFxuICBlbC5vbmUgPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgZWwub2ZmKG5hbWUsIG9uKVxuICAgICAgZm4uYXBwbHkoZWwsIGFyZ3VtZW50cylcbiAgICB9XG4gICAgcmV0dXJuIGVsLm9uKG5hbWUsIG9uKVxuICB9XG5cbiAgZWwudHJpZ2dlciA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgZm5zID0gY2FsbGJhY2tzW25hbWVdIHx8IFtdXG5cbiAgICBmb3IgKHZhciBpID0gMCwgZm47IChmbiA9IGZuc1tpXSk7ICsraSkge1xuICAgICAgaWYgKCFmbi5idXN5KSB7XG4gICAgICAgIGZuLmJ1c3kgPSAxXG4gICAgICAgIGZuLmFwcGx5KGVsLCBmbi50eXBlZCA/IFtuYW1lXS5jb25jYXQoYXJncykgOiBhcmdzKVxuICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikgeyBpLS0gfVxuICAgICAgICBmbi5idXN5ID0gMFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjYWxsYmFja3MuYWxsICYmIG5hbWUgIT0gJ2FsbCcpIHtcbiAgICAgIGVsLnRyaWdnZXIuYXBwbHkoZWwsIFsnYWxsJywgbmFtZV0uY29uY2F0KGFyZ3MpKVxuICAgIH1cblxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgcmV0dXJuIGVsXG5cbn1cbjsoZnVuY3Rpb24ocmlvdCwgZXZ0LCB3aW5kb3cpIHtcblxuICAvLyBicm93c2VycyBvbmx5XG4gIGlmICghd2luZG93KSByZXR1cm5cblxuICB2YXIgbG9jID0gd2luZG93LmxvY2F0aW9uLFxuICAgICAgZm5zID0gcmlvdC5vYnNlcnZhYmxlKCksXG4gICAgICB3aW4gPSB3aW5kb3csXG4gICAgICBzdGFydGVkID0gZmFsc2UsXG4gICAgICBjdXJyZW50XG5cbiAgZnVuY3Rpb24gaGFzaCgpIHtcbiAgICByZXR1cm4gbG9jLmhyZWYuc3BsaXQoJyMnKVsxXSB8fCAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VyKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpXG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KHBhdGgpIHtcbiAgICBpZiAocGF0aC50eXBlKSBwYXRoID0gaGFzaCgpXG5cbiAgICBpZiAocGF0aCAhPSBjdXJyZW50KSB7XG4gICAgICBmbnMudHJpZ2dlci5hcHBseShudWxsLCBbJ0gnXS5jb25jYXQocGFyc2VyKHBhdGgpKSlcbiAgICAgIGN1cnJlbnQgPSBwYXRoXG4gICAgfVxuICB9XG5cbiAgdmFyIHIgPSByaW90LnJvdXRlID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgLy8gc3RyaW5nXG4gICAgaWYgKGFyZ1swXSkge1xuICAgICAgbG9jLmhhc2ggPSBhcmdcbiAgICAgIGVtaXQoYXJnKVxuXG4gICAgLy8gZnVuY3Rpb25cbiAgICB9IGVsc2Uge1xuICAgICAgZm5zLm9uKCdIJywgYXJnKVxuICAgIH1cbiAgfVxuXG4gIHIuZXhlYyA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgZm4uYXBwbHkobnVsbCwgcGFyc2VyKGhhc2goKSkpXG4gIH1cblxuICByLnBhcnNlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgcGFyc2VyID0gZm5cbiAgfVxuXG4gIHIuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXN0YXJ0ZWQpIHJldHVyblxuICAgIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyID8gd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBlbWl0LCBmYWxzZSkgOiB3aW4uZGV0YWNoRXZlbnQoJ29uJyArIGV2dCwgZW1pdClcbiAgICBmbnMub2ZmKCcqJylcbiAgICBzdGFydGVkID0gZmFsc2VcbiAgfVxuXG4gIHIuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHN0YXJ0ZWQpIHJldHVyblxuICAgIHdpbi5hZGRFdmVudExpc3RlbmVyID8gd2luLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBlbWl0LCBmYWxzZSkgOiB3aW4uYXR0YWNoRXZlbnQoJ29uJyArIGV2dCwgZW1pdClcbiAgICBzdGFydGVkID0gdHJ1ZVxuICB9XG5cbiAgLy8gYXV0b3N0YXJ0IHRoZSByb3V0ZXJcbiAgci5zdGFydCgpXG5cbn0pKHJpb3QsICdoYXNoY2hhbmdlJywgd2luZG93KVxuLypcblxuLy8vLyBIb3cgaXQgd29ya3M/XG5cblxuVGhyZWUgd2F5czpcblxuMS4gRXhwcmVzc2lvbnM6IHRtcGwoJ3sgdmFsdWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIGV2YWx1YXRlZCBleHByZXNzaW9uIGFzIGEgcmF3IG9iamVjdC5cblxuMi4gVGVtcGxhdGVzOiB0bXBsKCdIaSB7IG5hbWUgfSB7IHN1cm5hbWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHN0cmluZyB3aXRoIGV2YWx1YXRlZCBleHByZXNzaW9ucy5cblxuMy4gRmlsdGVyczogdG1wbCgneyBzaG93OiAhZG9uZSwgaGlnaGxpZ2h0OiBhY3RpdmUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIHRydWVpc2gga2V5cyAobWFpbmx5XG4gICB1c2VkIGZvciBzZXR0aW5nIGh0bWwgY2xhc3NlcyksIGUuZy4gXCJzaG93IGhpZ2hsaWdodFwiLlxuXG5cbi8vIFRlbXBsYXRlIGV4YW1wbGVzXG5cbnRtcGwoJ3sgdGl0bGUgfHwgXCJVbnRpdGxlZFwiIH0nLCBkYXRhKVxudG1wbCgnUmVzdWx0cyBhcmUgeyByZXN1bHRzID8gXCJyZWFkeVwiIDogXCJsb2FkaW5nXCIgfScsIGRhdGEpXG50bXBsKCdUb2RheSBpcyB7IG5ldyBEYXRlKCkgfScsIGRhdGEpXG50bXBsKCd7IG1lc3NhZ2UubGVuZ3RoID4gMTQwICYmIFwiTWVzc2FnZSBpcyB0b28gbG9uZ1wiIH0nLCBkYXRhKVxudG1wbCgnVGhpcyBpdGVtIGdvdCB7IE1hdGgucm91bmQocmF0aW5nKSB9IHN0YXJzJywgZGF0YSlcbnRtcGwoJzxoMT57IHRpdGxlIH08L2gxPnsgYm9keSB9JywgZGF0YSlcblxuXG4vLyBGYWxzeSBleHByZXNzaW9ucyBpbiB0ZW1wbGF0ZXNcblxuSW4gdGVtcGxhdGVzIChhcyBvcHBvc2VkIHRvIHNpbmdsZSBleHByZXNzaW9ucykgYWxsIGZhbHN5IHZhbHVlc1xuZXhjZXB0IHplcm8gKHVuZGVmaW5lZC9udWxsL2ZhbHNlKSB3aWxsIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nOlxuXG50bXBsKCd7IHVuZGVmaW5lZCB9IC0geyBmYWxzZSB9IC0geyBudWxsIH0gLSB7IDAgfScsIHt9KVxuLy8gd2lsbCByZXR1cm46IFwiIC0gLSAtIDBcIlxuXG4qL1xuXG5cbnZhciBicmFja2V0cyA9IChmdW5jdGlvbihvcmlnLCBzLCBiKSB7XG4gIHJldHVybiBmdW5jdGlvbih4KSB7XG5cbiAgICAvLyBtYWtlIHN1cmUgd2UgdXNlIHRoZSBjdXJyZW50IHNldHRpbmdcbiAgICBzID0gcmlvdC5zZXR0aW5ncy5icmFja2V0cyB8fCBvcmlnXG4gICAgaWYgKGIgIT0gcykgYiA9IHMuc3BsaXQoJyAnKVxuXG4gICAgLy8gaWYgcmVnZXhwIGdpdmVuLCByZXdyaXRlIGl0IHdpdGggY3VycmVudCBicmFja2V0cyAob25seSBpZiBkaWZmZXIgZnJvbSBkZWZhdWx0KVxuICAgIHJldHVybiB4ICYmIHgudGVzdFxuICAgICAgPyBzID09IG9yaWdcbiAgICAgICAgPyB4IDogUmVnRXhwKHguc291cmNlXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcey9nLCBiWzBdLnJlcGxhY2UoLyg/PS4pL2csICdcXFxcJykpXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcfS9nLCBiWzFdLnJlcGxhY2UoLyg/PS4pL2csICdcXFxcJykpLFxuICAgICAgICAgICAgICAgICAgICB4Lmdsb2JhbCA/ICdnJyA6ICcnKVxuXG4gICAgICAvLyBlbHNlLCBnZXQgc3BlY2lmaWMgYnJhY2tldFxuICAgICAgOiBiW3hdXG5cbiAgfVxufSkoJ3sgfScpXG5cblxudmFyIHRtcGwgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGNhY2hlID0ge30sXG4gICAgICByZVZhcnMgPSAvKFsnXCJcXC9dKS4qP1teXFxcXF1cXDF8XFwuXFx3KnxcXHcqOnxcXGIoPzooPzpuZXd8dHlwZW9mfGlufGluc3RhbmNlb2YpIHwoPzp0aGlzfHRydWV8ZmFsc2V8bnVsbHx1bmRlZmluZWQpXFxifGZ1bmN0aW9uICpcXCgpfChbYS16XyRdXFx3KikvZ2lcbiAgICAgICAgICAgICAgLy8gWyAxICAgICAgICAgICAgICAgXVsgMiAgXVsgMyBdWyA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1bIDUgICAgICAgXVxuICAgICAgICAgICAgICAvLyBmaW5kIHZhcmlhYmxlIG5hbWVzOlxuICAgICAgICAgICAgICAvLyAxLiBza2lwIHF1b3RlZCBzdHJpbmdzIGFuZCByZWdleHBzOiBcImEgYlwiLCAnYSBiJywgJ2EgXFwnYlxcJycsIC9hIGIvXG4gICAgICAgICAgICAgIC8vIDIuIHNraXAgb2JqZWN0IHByb3BlcnRpZXM6IC5uYW1lXG4gICAgICAgICAgICAgIC8vIDMuIHNraXAgb2JqZWN0IGxpdGVyYWxzOiBuYW1lOlxuICAgICAgICAgICAgICAvLyA0LiBza2lwIGphdmFzY3JpcHQga2V5d29yZHNcbiAgICAgICAgICAgICAgLy8gNS4gbWF0Y2ggdmFyIG5hbWVcblxuICAvLyBidWlsZCBhIHRlbXBsYXRlIChvciBnZXQgaXQgZnJvbSBjYWNoZSksIHJlbmRlciB3aXRoIGRhdGFcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0ciwgZGF0YSkge1xuICAgIHJldHVybiBzdHIgJiYgKGNhY2hlW3N0cl0gPSBjYWNoZVtzdHJdIHx8IHRtcGwoc3RyKSkoZGF0YSlcbiAgfVxuXG5cbiAgLy8gY3JlYXRlIGEgdGVtcGxhdGUgaW5zdGFuY2VcblxuICBmdW5jdGlvbiB0bXBsKHMsIHApIHtcblxuICAgIC8vIGRlZmF1bHQgdGVtcGxhdGUgc3RyaW5nIHRvIHt9XG4gICAgcyA9IChzIHx8IChicmFja2V0cygwKSArIGJyYWNrZXRzKDEpKSlcblxuICAgICAgLy8gdGVtcG9yYXJpbHkgY29udmVydCBcXHsgYW5kIFxcfSB0byBhIG5vbi1jaGFyYWN0ZXJcbiAgICAgIC5yZXBsYWNlKGJyYWNrZXRzKC9cXFxcey9nKSwgJ1xcdUZGRjAnKVxuICAgICAgLnJlcGxhY2UoYnJhY2tldHMoL1xcXFx9L2cpLCAnXFx1RkZGMScpXG5cbiAgICAvLyBzcGxpdCBzdHJpbmcgdG8gZXhwcmVzc2lvbiBhbmQgbm9uLWV4cHJlc2lvbiBwYXJ0c1xuICAgIHAgPSBzcGxpdChzLCBleHRyYWN0KHMsIGJyYWNrZXRzKC97LyksIGJyYWNrZXRzKC99LykpKVxuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignZCcsICdyZXR1cm4gJyArIChcblxuICAgICAgLy8gaXMgaXQgYSBzaW5nbGUgZXhwcmVzc2lvbiBvciBhIHRlbXBsYXRlPyBpLmUuIHt4fSBvciA8Yj57eH08L2I+XG4gICAgICAhcFswXSAmJiAhcFsyXSAmJiAhcFszXVxuXG4gICAgICAgIC8vIGlmIGV4cHJlc3Npb24sIGV2YWx1YXRlIGl0XG4gICAgICAgID8gZXhwcihwWzFdKVxuXG4gICAgICAgIC8vIGlmIHRlbXBsYXRlLCBldmFsdWF0ZSBhbGwgZXhwcmVzc2lvbnMgaW4gaXRcbiAgICAgICAgOiAnWycgKyBwLm1hcChmdW5jdGlvbihzLCBpKSB7XG5cbiAgICAgICAgICAgIC8vIGlzIGl0IGFuIGV4cHJlc3Npb24gb3IgYSBzdHJpbmcgKGV2ZXJ5IHNlY29uZCBwYXJ0IGlzIGFuIGV4cHJlc3Npb24pXG4gICAgICAgICAgcmV0dXJuIGkgJSAyXG5cbiAgICAgICAgICAgICAgLy8gZXZhbHVhdGUgdGhlIGV4cHJlc3Npb25zXG4gICAgICAgICAgICAgID8gZXhwcihzLCB0cnVlKVxuXG4gICAgICAgICAgICAgIC8vIHByb2Nlc3Mgc3RyaW5nIHBhcnRzIG9mIHRoZSB0ZW1wbGF0ZTpcbiAgICAgICAgICAgICAgOiAnXCInICsgc1xuXG4gICAgICAgICAgICAgICAgICAvLyBwcmVzZXJ2ZSBuZXcgbGluZXNcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcblxuICAgICAgICAgICAgICAgICAgLy8gZXNjYXBlIHF1b3Rlc1xuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxuXG4gICAgICAgICAgICAgICAgKyAnXCInXG5cbiAgICAgICAgfSkuam9pbignLCcpICsgJ10uam9pbihcIlwiKSdcbiAgICAgIClcblxuICAgICAgLy8gYnJpbmcgZXNjYXBlZCB7IGFuZCB9IGJhY2tcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYwL2csIGJyYWNrZXRzKDApKVxuICAgICAgLnJlcGxhY2UoL1xcdUZGRjEvZywgYnJhY2tldHMoMSkpXG5cbiAgICArICc7JylcblxuICB9XG5cblxuICAvLyBwYXJzZSB7IC4uLiB9IGV4cHJlc3Npb25cblxuICBmdW5jdGlvbiBleHByKHMsIG4pIHtcbiAgICBzID0gc1xuXG4gICAgICAvLyBjb252ZXJ0IG5ldyBsaW5lcyB0byBzcGFjZXNcbiAgICAgIC5yZXBsYWNlKC9cXG4vZywgJyAnKVxuXG4gICAgICAvLyB0cmltIHdoaXRlc3BhY2UsIGJyYWNrZXRzLCBzdHJpcCBjb21tZW50c1xuICAgICAgLnJlcGxhY2UoYnJhY2tldHMoL15beyBdK3xbIH1dKyR8XFwvXFwqLis/XFwqXFwvL2cpLCAnJylcblxuICAgIC8vIGlzIGl0IGFuIG9iamVjdCBsaXRlcmFsPyBpLmUuIHsga2V5IDogdmFsdWUgfVxuICAgIHJldHVybiAvXlxccypbXFx3LSBcIiddKyAqOi8udGVzdChzKVxuXG4gICAgICAvLyBpZiBvYmplY3QgbGl0ZXJhbCwgcmV0dXJuIHRydWVpc2gga2V5c1xuICAgICAgLy8gZS5nLjogeyBzaG93OiBpc09wZW4oKSwgZG9uZTogaXRlbS5kb25lIH0gLT4gXCJzaG93IGRvbmVcIlxuICAgICAgPyAnWycgK1xuXG4gICAgICAgICAgLy8gZXh0cmFjdCBrZXk6dmFsIHBhaXJzLCBpZ25vcmluZyBhbnkgbmVzdGVkIG9iamVjdHNcbiAgICAgICAgICBleHRyYWN0KHMsXG5cbiAgICAgICAgICAgICAgLy8gbmFtZSBwYXJ0OiBuYW1lOiwgXCJuYW1lXCI6LCAnbmFtZSc6LCBuYW1lIDpcbiAgICAgICAgICAgICAgL1tcIicgXSpbXFx3LSBdK1tcIicgXSo6LyxcblxuICAgICAgICAgICAgICAvLyBleHByZXNzaW9uIHBhcnQ6IGV2ZXJ5dGhpbmcgdXB0byBhIGNvbW1hIGZvbGxvd2VkIGJ5IGEgbmFtZSAoc2VlIGFib3ZlKSBvciBlbmQgb2YgbGluZVxuICAgICAgICAgICAgICAvLCg/PVtcIicgXSpbXFx3LSBdK1tcIicgXSo6KXx9fCQvXG4gICAgICAgICAgICAgICkubWFwKGZ1bmN0aW9uKHBhaXIpIHtcblxuICAgICAgICAgICAgICAgIC8vIGdldCBrZXksIHZhbCBwYXJ0c1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWlyLnJlcGxhY2UoL15bIFwiJ10qKC4rPylbIFwiJ10qOiAqKC4rPyksPyAqJC8sIGZ1bmN0aW9uKF8sIGssIHYpIHtcblxuICAgICAgICAgICAgICAgICAgLy8gd3JhcCBhbGwgY29uZGl0aW9uYWwgcGFydHMgdG8gaWdub3JlIGVycm9yc1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHYucmVwbGFjZSgvW14mfD0hPjxdKy9nLCB3cmFwKSArICc/XCInICsgayArICdcIjpcIlwiLCdcblxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgfSkuam9pbignJylcblxuICAgICAgICArICddLmpvaW4oXCIgXCIpLnRyaW0oKSdcblxuICAgICAgLy8gaWYganMgZXhwcmVzc2lvbiwgZXZhbHVhdGUgYXMgamF2YXNjcmlwdFxuICAgICAgOiB3cmFwKHMsIG4pXG5cbiAgfVxuXG5cbiAgLy8gZXhlY3V0ZSBqcyB3L28gYnJlYWtpbmcgb24gZXJyb3JzIG9yIHVuZGVmaW5lZCB2YXJzXG5cbiAgZnVuY3Rpb24gd3JhcChzLCBub251bGwpIHtcbiAgICBzID0gcy50cmltKClcbiAgICByZXR1cm4gIXMgPyAnJyA6ICcoZnVuY3Rpb24odil7dHJ5e3Y9J1xuXG4gICAgICAgIC8vIHByZWZpeCB2YXJzIChuYW1lID0+IGRhdGEubmFtZSlcbiAgICAgICAgKyAocy5yZXBsYWNlKHJlVmFycywgZnVuY3Rpb24ocywgXywgdikgeyByZXR1cm4gdiA/ICcoZC4nK3YrJz09PXVuZGVmaW5lZD8nKyh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnID8gJ2dsb2JhbC4nIDogJ3dpbmRvdy4nKSt2Kyc6ZC4nK3YrJyknIDogcyB9KVxuXG4gICAgICAgICAgLy8gYnJlYWsgdGhlIGV4cHJlc3Npb24gaWYgaXRzIGVtcHR5IChyZXN1bHRpbmcgaW4gdW5kZWZpbmVkIHZhbHVlKVxuICAgICAgICAgIHx8ICd4JylcblxuICAgICAgKyAnfWZpbmFsbHl7cmV0dXJuICdcblxuICAgICAgICAvLyBkZWZhdWx0IHRvIGVtcHR5IHN0cmluZyBmb3IgZmFsc3kgdmFsdWVzIGV4Y2VwdCB6ZXJvXG4gICAgICAgICsgKG5vbnVsbCA9PT0gdHJ1ZSA/ICchdiYmdiE9PTA/XCJcIjp2JyA6ICd2JylcblxuICAgICAgKyAnfX0pLmNhbGwoZCknXG4gIH1cblxuXG4gIC8vIHNwbGl0IHN0cmluZyBieSBhbiBhcnJheSBvZiBzdWJzdHJpbmdzXG5cbiAgZnVuY3Rpb24gc3BsaXQoc3RyLCBzdWJzdHJpbmdzKSB7XG4gICAgdmFyIHBhcnRzID0gW11cbiAgICBzdWJzdHJpbmdzLm1hcChmdW5jdGlvbihzdWIsIGkpIHtcblxuICAgICAgLy8gcHVzaCBtYXRjaGVkIGV4cHJlc3Npb24gYW5kIHBhcnQgYmVmb3JlIGl0XG4gICAgICBpID0gc3RyLmluZGV4T2Yoc3ViKVxuICAgICAgcGFydHMucHVzaChzdHIuc2xpY2UoMCwgaSksIHN1YilcbiAgICAgIHN0ciA9IHN0ci5zbGljZShpICsgc3ViLmxlbmd0aClcbiAgICB9KVxuXG4gICAgLy8gcHVzaCB0aGUgcmVtYWluaW5nIHBhcnRcbiAgICByZXR1cm4gcGFydHMuY29uY2F0KHN0cilcbiAgfVxuXG5cbiAgLy8gbWF0Y2ggc3RyaW5ncyBiZXR3ZWVuIG9wZW5pbmcgYW5kIGNsb3NpbmcgcmVnZXhwLCBza2lwcGluZyBhbnkgaW5uZXIvbmVzdGVkIG1hdGNoZXNcblxuICBmdW5jdGlvbiBleHRyYWN0KHN0ciwgb3BlbiwgY2xvc2UpIHtcblxuICAgIHZhciBzdGFydCxcbiAgICAgICAgbGV2ZWwgPSAwLFxuICAgICAgICBtYXRjaGVzID0gW10sXG4gICAgICAgIHJlID0gbmV3IFJlZ0V4cCgnKCcrb3Blbi5zb3VyY2UrJyl8KCcrY2xvc2Uuc291cmNlKycpJywgJ2cnKVxuXG4gICAgc3RyLnJlcGxhY2UocmUsIGZ1bmN0aW9uKF8sIG9wZW4sIGNsb3NlLCBwb3MpIHtcblxuICAgICAgLy8gaWYgb3V0ZXIgaW5uZXIgYnJhY2tldCwgbWFyayBwb3NpdGlvblxuICAgICAgaWYoIWxldmVsICYmIG9wZW4pIHN0YXJ0ID0gcG9zXG5cbiAgICAgIC8vIGluKGRlKWNyZWFzZSBicmFja2V0IGxldmVsXG4gICAgICBsZXZlbCArPSBvcGVuID8gMSA6IC0xXG5cbiAgICAgIC8vIGlmIG91dGVyIGNsb3NpbmcgYnJhY2tldCwgZ3JhYiB0aGUgbWF0Y2hcbiAgICAgIGlmKCFsZXZlbCAmJiBjbG9zZSAhPSBudWxsKSBtYXRjaGVzLnB1c2goc3RyLnNsaWNlKHN0YXJ0LCBwb3MrY2xvc2UubGVuZ3RoKSlcblxuICAgIH0pXG5cbiAgICByZXR1cm4gbWF0Y2hlc1xuICB9XG5cbn0pKClcblxuLy8geyBrZXksIGkgaW4gaXRlbXN9IC0+IHsga2V5LCBpLCBpdGVtcyB9XG5mdW5jdGlvbiBsb29wS2V5cyhleHByKSB7XG4gIHZhciByZXQgPSB7IHZhbDogZXhwciB9LFxuICAgICAgZWxzID0gZXhwci5zcGxpdCgvXFxzK2luXFxzKy8pXG5cbiAgaWYgKGVsc1sxXSkge1xuICAgIHJldC52YWwgPSBicmFja2V0cygwKSArIGVsc1sxXVxuICAgIGVscyA9IGVsc1swXS5zbGljZShicmFja2V0cygwKS5sZW5ndGgpLnRyaW0oKS5zcGxpdCgvLFxccyovKVxuICAgIHJldC5rZXkgPSBlbHNbMF1cbiAgICByZXQucG9zID0gZWxzWzFdXG4gIH1cblxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIG1raXRlbShleHByLCBrZXksIHZhbCkge1xuICB2YXIgaXRlbSA9IHt9XG4gIGl0ZW1bZXhwci5rZXldID0ga2V5XG4gIGlmIChleHByLnBvcykgaXRlbVtleHByLnBvc10gPSB2YWxcbiAgcmV0dXJuIGl0ZW1cbn1cblxuXG4vKiBCZXdhcmU6IGhlYXZ5IHN0dWZmICovXG5mdW5jdGlvbiBfZWFjaChkb20sIHBhcmVudCwgZXhwcikge1xuXG4gIHJlbUF0dHIoZG9tLCAnZWFjaCcpXG5cbiAgdmFyIHRlbXBsYXRlID0gZG9tLm91dGVySFRNTCxcbiAgICAgIHByZXYgPSBkb20ucHJldmlvdXNTaWJsaW5nLFxuICAgICAgcm9vdCA9IGRvbS5wYXJlbnROb2RlLFxuICAgICAgcmVuZGVyZWQgPSBbXSxcbiAgICAgIHRhZ3MgPSBbXSxcbiAgICAgIGNoZWNrc3VtXG5cbiAgZXhwciA9IGxvb3BLZXlzKGV4cHIpXG5cbiAgZnVuY3Rpb24gYWRkKHBvcywgaXRlbSwgdGFnKSB7XG4gICAgcmVuZGVyZWQuc3BsaWNlKHBvcywgMCwgaXRlbSlcbiAgICB0YWdzLnNwbGljZShwb3MsIDAsIHRhZylcbiAgfVxuXG4gIC8vIGNsZWFuIHRlbXBsYXRlIGNvZGVcbiAgcGFyZW50Lm9uZSgndXBkYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5yZW1vdmVDaGlsZChkb20pXG5cbiAgfSkub25lKCdwcmVtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgIGlmIChyb290LnN0dWIpIHJvb3QgPSBwYXJlbnQucm9vdFxuXG4gIH0pLm9uKCd1cGRhdGUnLCBmdW5jdGlvbigpIHtcblxuICAgIHZhciBpdGVtcyA9IHRtcGwoZXhwci52YWwsIHBhcmVudClcbiAgICBpZiAoIWl0ZW1zKSByZXR1cm5cblxuICAgIC8vIG9iamVjdCBsb29wLiBhbnkgY2hhbmdlcyBjYXVzZSBmdWxsIHJlZHJhd1xuICAgIGlmICghQXJyYXkuaXNBcnJheShpdGVtcykpIHtcbiAgICAgIHZhciB0ZXN0c3VtID0gSlNPTi5zdHJpbmdpZnkoaXRlbXMpXG4gICAgICBpZiAodGVzdHN1bSA9PSBjaGVja3N1bSkgcmV0dXJuXG4gICAgICBjaGVja3N1bSA9IHRlc3RzdW1cblxuICAgICAgLy8gY2xlYXIgb2xkIGl0ZW1zXG4gICAgICBlYWNoKHRhZ3MsIGZ1bmN0aW9uKHRhZykgeyB0YWcudW5tb3VudCgpIH0pXG4gICAgICByZW5kZXJlZCA9IFtdXG4gICAgICB0YWdzID0gW11cblxuICAgICAgaXRlbXMgPSBPYmplY3Qua2V5cyhpdGVtcykubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gbWtpdGVtKGV4cHIsIGtleSwgaXRlbXNba2V5XSlcbiAgICAgIH0pXG5cbiAgICB9XG5cbiAgICAvLyB1bm1vdW50IHJlZHVuZGFudFxuICAgIGVhY2gocmVuZGVyZWQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIC8vIHNraXAgZXhpc3RpbmcgaXRlbXNcbiAgICAgICAgaWYgKGl0ZW1zLmluZGV4T2YoaXRlbSkgPiAtMSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBmaW5kIGFsbCBub24tb2JqZWN0c1xuICAgICAgICB2YXIgbmV3SXRlbXMgPSBhcnJGaW5kRXF1YWxzKGl0ZW1zLCBpdGVtKSxcbiAgICAgICAgICAgIG9sZEl0ZW1zID0gYXJyRmluZEVxdWFscyhyZW5kZXJlZCwgaXRlbSlcblxuICAgICAgICAvLyBpZiBtb3JlIG9yIGVxdWFsIGFtb3VudCwgbm8gbmVlZCB0byByZW1vdmVcbiAgICAgICAgaWYgKG5ld0l0ZW1zLmxlbmd0aCA+PSBvbGRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHBvcyA9IHJlbmRlcmVkLmluZGV4T2YoaXRlbSksXG4gICAgICAgICAgdGFnID0gdGFnc1twb3NdXG5cbiAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgdGFnLnVubW91bnQoKVxuICAgICAgICByZW5kZXJlZC5zcGxpY2UocG9zLCAxKVxuICAgICAgICB0YWdzLnNwbGljZShwb3MsIDEpXG4gICAgICAgIC8vIHRvIGxldCBcImVhY2hcIiBrbm93IHRoYXQgdGhpcyBpdGVtIGlzIHJlbW92ZWRcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICB9KVxuXG4gICAgLy8gbW91bnQgbmV3IC8gcmVvcmRlclxuICAgIHZhciBwcmV2QmFzZSA9IFtdLmluZGV4T2YuY2FsbChyb290LmNoaWxkTm9kZXMsIHByZXYpICsgMVxuICAgIGVhY2goaXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcblxuICAgICAgLy8gc3RhcnQgaW5kZXggc2VhcmNoIGZyb20gcG9zaXRpb24gYmFzZWQgb24gdGhlIGN1cnJlbnQgaVxuICAgICAgdmFyIHBvcyA9IGl0ZW1zLmluZGV4T2YoaXRlbSwgaSksXG4gICAgICAgICAgb2xkUG9zID0gcmVuZGVyZWQuaW5kZXhPZihpdGVtLCBpKVxuXG4gICAgICAvLyBpZiBub3QgZm91bmQsIHNlYXJjaCBiYWNrd2FyZHMgZnJvbSBjdXJyZW50IGkgcG9zaXRpb25cbiAgICAgIHBvcyA8IDAgJiYgKHBvcyA9IGl0ZW1zLmxhc3RJbmRleE9mKGl0ZW0sIGkpKVxuICAgICAgb2xkUG9zIDwgMCAmJiAob2xkUG9zID0gcmVuZGVyZWQubGFzdEluZGV4T2YoaXRlbSwgaSkpXG5cbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBPYmplY3QpKSB7XG4gICAgICAgIC8vIGZpbmQgYWxsIG5vbi1vYmplY3RzXG4gICAgICAgIHZhciBuZXdJdGVtcyA9IGFyckZpbmRFcXVhbHMoaXRlbXMsIGl0ZW0pLFxuICAgICAgICAgICAgb2xkSXRlbXMgPSBhcnJGaW5kRXF1YWxzKHJlbmRlcmVkLCBpdGVtKVxuXG4gICAgICAgIC8vIGlmIG1vcmUsIHNob3VsZCBtb3VudCBvbmUgbmV3XG4gICAgICAgIGlmIChuZXdJdGVtcy5sZW5ndGggPiBvbGRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBvbGRQb3MgPSAtMVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIG1vdW50IG5ld1xuICAgICAgdmFyIG5vZGVzID0gcm9vdC5jaGlsZE5vZGVzXG4gICAgICBpZiAob2xkUG9zIDwgMCkge1xuICAgICAgICBpZiAoIWNoZWNrc3VtICYmIGV4cHIua2V5KSB2YXIgX2l0ZW0gPSBta2l0ZW0oZXhwciwgaXRlbSwgcG9zKVxuXG4gICAgICAgIHZhciB0YWcgPSBuZXcgVGFnKHsgdG1wbDogdGVtcGxhdGUgfSwge1xuICAgICAgICAgIGJlZm9yZTogbm9kZXNbcHJldkJhc2UgKyBwb3NdLFxuICAgICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICAgIHJvb3Q6IHJvb3QsXG4gICAgICAgICAgaXRlbTogX2l0ZW0gfHwgaXRlbVxuICAgICAgICB9KVxuXG4gICAgICAgIHRhZy5tb3VudCgpXG5cbiAgICAgICAgYWRkKHBvcywgaXRlbSwgdGFnKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBjaGFuZ2UgcG9zIHZhbHVlXG4gICAgICBpZiAoZXhwci5wb3MgJiYgdGFnc1tvbGRQb3NdW2V4cHIucG9zXSAhPSBwb3MpIHtcbiAgICAgICAgdGFnc1tvbGRQb3NdLm9uZSgndXBkYXRlJywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIGl0ZW1bZXhwci5wb3NdID0gcG9zXG4gICAgICAgIH0pXG4gICAgICAgIHRhZ3Nbb2xkUG9zXS51cGRhdGUoKVxuICAgICAgfVxuXG4gICAgICAvLyByZW9yZGVyXG4gICAgICBpZiAocG9zICE9IG9sZFBvcykge1xuICAgICAgICByb290Lmluc2VydEJlZm9yZShub2Rlc1twcmV2QmFzZSArIG9sZFBvc10sIG5vZGVzW3ByZXZCYXNlICsgKHBvcyA+IG9sZFBvcyA/IHBvcyArIDEgOiBwb3MpXSlcbiAgICAgICAgcmV0dXJuIGFkZChwb3MsIHJlbmRlcmVkLnNwbGljZShvbGRQb3MsIDEpWzBdLCB0YWdzLnNwbGljZShvbGRQb3MsIDEpWzBdKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIHJlbmRlcmVkID0gaXRlbXMuc2xpY2UoKVxuXG4gIH0pXG5cbn1cblxuXG5mdW5jdGlvbiBwYXJzZU5hbWVkRWxlbWVudHMocm9vdCwgcGFyZW50LCBjaGlsZFRhZ3MpIHtcblxuICB3YWxrKHJvb3QsIGZ1bmN0aW9uKGRvbSkge1xuICAgIGlmIChkb20ubm9kZVR5cGUgPT0gMSkge1xuICAgICAgaWYoZG9tLnBhcmVudE5vZGUgJiYgZG9tLnBhcmVudE5vZGUuaXNMb29wKSBkb20uaXNMb29wID0gMVxuICAgICAgaWYoZG9tLmdldEF0dHJpYnV0ZSgnZWFjaCcpKSBkb20uaXNMb29wID0gMVxuICAgICAgLy8gY3VzdG9tIGNoaWxkIHRhZ1xuICAgICAgdmFyIGNoaWxkID0gZ2V0VGFnKGRvbSlcblxuICAgICAgaWYgKGNoaWxkICYmICFkb20uaXNMb29wKSB7XG4gICAgICAgIHZhciB0YWcgPSBuZXcgVGFnKGNoaWxkLCB7IHJvb3Q6IGRvbSwgcGFyZW50OiBwYXJlbnQgfSwgZG9tLmlubmVySFRNTCksXG4gICAgICAgICAgdGFnTmFtZSA9IGNoaWxkLm5hbWUsXG4gICAgICAgICAgcHRhZyA9IHBhcmVudCxcbiAgICAgICAgICBjYWNoZWRUYWdcblxuICAgICAgICB3aGlsZSghZ2V0VGFnKHB0YWcucm9vdCkpIHtcbiAgICAgICAgICBpZighcHRhZy5wYXJlbnQpIGJyZWFrXG4gICAgICAgICAgcHRhZyA9IHB0YWcucGFyZW50XG4gICAgICAgIH1cbiAgICAgICAgLy8gZml4IGZvciB0aGUgcGFyZW50IGF0dHJpYnV0ZSBpbiB0aGUgbG9vcGVkIGVsZW1lbnRzXG4gICAgICAgIHRhZy5wYXJlbnQgPSBwdGFnXG5cbiAgICAgICAgY2FjaGVkVGFnID0gcHRhZy50YWdzW3RhZ05hbWVdXG5cbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG11bHRpcGxlIGNoaWxkcmVuIHRhZ3MgaGF2aW5nIHRoZSBzYW1lIG5hbWVcbiAgICAgICAgaWYgKGNhY2hlZFRhZykge1xuICAgICAgICAgIC8vIGlmIHRoZSBwYXJlbnQgdGFncyBwcm9wZXJ0eSBpcyBub3QgeWV0IGFuIGFycmF5XG4gICAgICAgICAgLy8gY3JlYXRlIGl0IGFkZGluZyB0aGUgZmlyc3QgY2FjaGVkIHRhZ1xuICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjYWNoZWRUYWcpKVxuICAgICAgICAgICAgcHRhZy50YWdzW3RhZ05hbWVdID0gW2NhY2hlZFRhZ11cbiAgICAgICAgICAvLyBhZGQgdGhlIG5ldyBuZXN0ZWQgdGFnIHRvIHRoZSBhcnJheVxuICAgICAgICAgIHB0YWcudGFnc1t0YWdOYW1lXS5wdXNoKHRhZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0gPSB0YWdcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVtcHR5IHRoZSBjaGlsZCBub2RlIG9uY2Ugd2UgZ290IGl0cyB0ZW1wbGF0ZVxuICAgICAgICAvLyB0byBhdm9pZCB0aGF0IGl0cyBjaGlsZHJlbiBnZXQgY29tcGlsZWQgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgZG9tLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGNoaWxkVGFncy5wdXNoKHRhZylcbiAgICAgIH1cblxuICAgICAgZWFjaChkb20uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICBpZiAoL14obmFtZXxpZCkkLy50ZXN0KGF0dHIubmFtZSkpIHBhcmVudFthdHRyLnZhbHVlXSA9IGRvbVxuICAgICAgfSlcbiAgICB9XG5cbiAgfSlcblxufVxuXG5mdW5jdGlvbiBwYXJzZUV4cHJlc3Npb25zKHJvb3QsIHRhZywgZXhwcmVzc2lvbnMpIHtcblxuICBmdW5jdGlvbiBhZGRFeHByKGRvbSwgdmFsLCBleHRyYSkge1xuICAgIGlmICh2YWwuaW5kZXhPZihicmFja2V0cygwKSkgPj0gMCkge1xuICAgICAgdmFyIGV4cHIgPSB7IGRvbTogZG9tLCBleHByOiB2YWwgfVxuICAgICAgZXhwcmVzc2lvbnMucHVzaChleHRlbmQoZXhwciwgZXh0cmEpKVxuICAgIH1cbiAgfVxuXG4gIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XG4gICAgdmFyIHR5cGUgPSBkb20ubm9kZVR5cGVcblxuICAgIC8vIHRleHQgbm9kZVxuICAgIGlmICh0eXBlID09IDMgJiYgZG9tLnBhcmVudE5vZGUudGFnTmFtZSAhPSAnU1RZTEUnKSBhZGRFeHByKGRvbSwgZG9tLm5vZGVWYWx1ZSlcbiAgICBpZiAodHlwZSAhPSAxKSByZXR1cm5cblxuICAgIC8qIGVsZW1lbnQgKi9cblxuICAgIC8vIGxvb3BcbiAgICB2YXIgYXR0ciA9IGRvbS5nZXRBdHRyaWJ1dGUoJ2VhY2gnKVxuICAgIGlmIChhdHRyKSB7IF9lYWNoKGRvbSwgdGFnLCBhdHRyKTsgcmV0dXJuIGZhbHNlIH1cblxuICAgIC8vIGF0dHJpYnV0ZSBleHByZXNzaW9uc1xuICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHZhciBuYW1lID0gYXR0ci5uYW1lLFxuICAgICAgICBib29sID0gbmFtZS5zcGxpdCgnX18nKVsxXVxuXG4gICAgICBhZGRFeHByKGRvbSwgYXR0ci52YWx1ZSwgeyBhdHRyOiBib29sIHx8IG5hbWUsIGJvb2w6IGJvb2wgfSlcbiAgICAgIGlmIChib29sKSB7IHJlbUF0dHIoZG9tLCBuYW1lKTsgcmV0dXJuIGZhbHNlIH1cblxuICAgIH0pXG5cbiAgICAvLyBza2lwIGN1c3RvbSB0YWdzXG4gICAgaWYgKGdldFRhZyhkb20pKSByZXR1cm4gZmFsc2VcblxuICB9KVxuXG59XG5mdW5jdGlvbiBUYWcoaW1wbCwgY29uZiwgaW5uZXJIVE1MKSB7XG5cbiAgdmFyIHNlbGYgPSByaW90Lm9ic2VydmFibGUodGhpcyksXG4gICAgICBvcHRzID0gaW5oZXJpdChjb25mLm9wdHMpIHx8IHt9LFxuICAgICAgZG9tID0gbWtkb20oaW1wbC50bXBsKSxcbiAgICAgIHBhcmVudCA9IGNvbmYucGFyZW50LFxuICAgICAgZXhwcmVzc2lvbnMgPSBbXSxcbiAgICAgIGNoaWxkVGFncyA9IFtdLFxuICAgICAgcm9vdCA9IGNvbmYucm9vdCxcbiAgICAgIGl0ZW0gPSBjb25mLml0ZW0sXG4gICAgICBmbiA9IGltcGwuZm4sXG4gICAgICB0YWdOYW1lID0gcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICBhdHRyID0ge30sXG4gICAgICBsb29wRG9tXG5cbiAgaWYgKGZuICYmIHJvb3QuX3RhZykge1xuICAgIHJvb3QuX3RhZy51bm1vdW50KHRydWUpXG4gIH1cbiAgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgdGFnIGp1c3QgY3JlYXRlZFxuICAvLyBzbyB3ZSB3aWxsIGJlIGFibGUgdG8gbW91bnQgdGhpcyB0YWcgbXVsdGlwbGUgdGltZXNcbiAgcm9vdC5fdGFnID0gdGhpc1xuXG4gIC8vIGNyZWF0ZSBhIHVuaXF1ZSBpZCB0byB0aGlzIHRhZ1xuICAvLyBpdCBjb3VsZCBiZSBoYW5keSB0byB1c2UgaXQgYWxzbyB0byBpbXByb3ZlIHRoZSB2aXJ0dWFsIGRvbSByZW5kZXJpbmcgc3BlZWRcbiAgdGhpcy5faWQgPSB+fihuZXcgRGF0ZSgpLmdldFRpbWUoKSAqIE1hdGgucmFuZG9tKCkpXG5cbiAgZXh0ZW5kKHRoaXMsIHsgcGFyZW50OiBwYXJlbnQsIHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMsIHRhZ3M6IHt9IH0sIGl0ZW0pXG5cbiAgLy8gZ3JhYiBhdHRyaWJ1dGVzXG4gIGVhY2gocm9vdC5hdHRyaWJ1dGVzLCBmdW5jdGlvbihlbCkge1xuICAgIGF0dHJbZWwubmFtZV0gPSBlbC52YWx1ZVxuICB9KVxuXG5cbiAgaWYgKGRvbS5pbm5lckhUTUwgJiYgIS9zZWxlY3QvLnRlc3QodGFnTmFtZSkpXG4gICAgLy8gcmVwbGFjZSBhbGwgdGhlIHlpZWxkIHRhZ3Mgd2l0aCB0aGUgdGFnIGlubmVyIGh0bWxcbiAgICBkb20uaW5uZXJIVE1MID0gcmVwbGFjZVlpZWxkKGRvbS5pbm5lckhUTUwsIGlubmVySFRNTClcblxuXG4gIC8vIG9wdGlvbnNcbiAgZnVuY3Rpb24gdXBkYXRlT3B0cygpIHtcbiAgICBlYWNoKE9iamVjdC5rZXlzKGF0dHIpLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBvcHRzW25hbWVdID0gdG1wbChhdHRyW25hbWVdLCBwYXJlbnQgfHwgc2VsZilcbiAgICB9KVxuICB9XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbihkYXRhLCBpbml0KSB7XG4gICAgZXh0ZW5kKHNlbGYsIGRhdGEsIGl0ZW0pXG4gICAgdXBkYXRlT3B0cygpXG4gICAgc2VsZi50cmlnZ2VyKCd1cGRhdGUnLCBpdGVtKVxuICAgIHVwZGF0ZShleHByZXNzaW9ucywgc2VsZiwgaXRlbSlcbiAgICBzZWxmLnRyaWdnZXIoJ3VwZGF0ZWQnKVxuICB9XG5cbiAgdGhpcy5tb3VudCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdXBkYXRlT3B0cygpXG5cbiAgICAvLyBpbml0aWFsaWF0aW9uXG4gICAgZm4gJiYgZm4uY2FsbChzZWxmLCBvcHRzKVxuXG4gICAgdG9nZ2xlKHRydWUpXG5cbiAgICAvLyBwYXJzZSBsYXlvdXQgYWZ0ZXIgaW5pdC4gZm4gbWF5IGNhbGN1bGF0ZSBhcmdzIGZvciBuZXN0ZWQgY3VzdG9tIHRhZ3NcbiAgICBwYXJzZUV4cHJlc3Npb25zKGRvbSwgc2VsZiwgZXhwcmVzc2lvbnMpXG5cbiAgICBpZiAoIXNlbGYucGFyZW50KSBzZWxmLnVwZGF0ZSgpXG5cbiAgICAvLyBpbnRlcm5hbCB1c2Ugb25seSwgZml4ZXMgIzQwM1xuICAgIHNlbGYudHJpZ2dlcigncHJlbW91bnQnKVxuXG4gICAgaWYgKGZuKSB7XG4gICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIHJvb3QuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpXG5cbiAgICB9IGVsc2Uge1xuICAgICAgbG9vcERvbSA9IGRvbS5maXJzdENoaWxkXG4gICAgICByb290Lmluc2VydEJlZm9yZShsb29wRG9tLCBjb25mLmJlZm9yZSB8fCBudWxsKSAvLyBudWxsIG5lZWRlZCBmb3IgSUU4XG4gICAgfVxuXG4gICAgaWYgKHJvb3Quc3R1Yikgc2VsZi5yb290ID0gcm9vdCA9IHBhcmVudC5yb290XG4gICAgc2VsZi50cmlnZ2VyKCdtb3VudCcpXG5cbiAgfVxuXG5cbiAgdGhpcy51bm1vdW50ID0gZnVuY3Rpb24oa2VlcFJvb3RUYWcpIHtcbiAgICB2YXIgZWwgPSBmbiA/IHJvb3QgOiBsb29wRG9tLFxuICAgICAgICBwID0gZWwucGFyZW50Tm9kZVxuXG4gICAgaWYgKHApIHtcblxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAvLyByZW1vdmUgdGhpcyB0YWcgZnJvbSB0aGUgcGFyZW50IHRhZ3Mgb2JqZWN0XG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBuZXN0ZWQgdGFncyB3aXRoIHNhbWUgbmFtZS4uXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGVsZW1lbnQgZm9ybSB0aGUgYXJyYXlcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyZW50LnRhZ3NbdGFnTmFtZV0pKSB7XG4gICAgICAgICAgZWFjaChwYXJlbnQudGFnc1t0YWdOYW1lXSwgZnVuY3Rpb24odGFnLCBpKSB7XG4gICAgICAgICAgICBpZiAodGFnLl9pZCA9PSBzZWxmLl9pZClcbiAgICAgICAgICAgICAgcGFyZW50LnRhZ3NbdGFnTmFtZV0uc3BsaWNlKGksIDEpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIGp1c3QgZGVsZXRlIHRoZSB0YWcgaW5zdGFuY2VcbiAgICAgICAgICBkZWxldGUgcGFyZW50LnRhZ3NbdGFnTmFtZV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChlbC5maXJzdENoaWxkKSBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKVxuICAgICAgfVxuXG4gICAgICBpZiAoIWtlZXBSb290VGFnKVxuICAgICAgICBwLnJlbW92ZUNoaWxkKGVsKVxuXG4gICAgfVxuXG5cbiAgICBzZWxmLnRyaWdnZXIoJ3VubW91bnQnKVxuICAgIHRvZ2dsZSgpXG4gICAgc2VsZi5vZmYoJyonKVxuICAgIC8vIHNvbWVob3cgaWU4IGRvZXMgbm90IGxpa2UgYGRlbGV0ZSByb290Ll90YWdgXG4gICAgcm9vdC5fdGFnID0gbnVsbFxuXG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGUoaXNNb3VudCkge1xuXG4gICAgLy8gbW91bnQvdW5tb3VudCBjaGlsZHJlblxuICAgIGVhY2goY2hpbGRUYWdzLCBmdW5jdGlvbihjaGlsZCkgeyBjaGlsZFtpc01vdW50ID8gJ21vdW50JyA6ICd1bm1vdW50J10oKSB9KVxuXG4gICAgLy8gbGlzdGVuL3VubGlzdGVuIHBhcmVudCAoZXZlbnRzIGZsb3cgb25lIHdheSBmcm9tIHBhcmVudCB0byBjaGlsZHJlbilcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICB2YXIgZXZ0ID0gaXNNb3VudCA/ICdvbicgOiAnb2ZmJ1xuICAgICAgcGFyZW50W2V2dF0oJ3VwZGF0ZScsIHNlbGYudXBkYXRlKVtldnRdKCd1bm1vdW50Jywgc2VsZi51bm1vdW50KVxuICAgIH1cbiAgfVxuXG4gIC8vIG5hbWVkIGVsZW1lbnRzIGF2YWlsYWJsZSBmb3IgZm5cbiAgcGFyc2VOYW1lZEVsZW1lbnRzKGRvbSwgdGhpcywgY2hpbGRUYWdzKVxuXG5cbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRIYW5kbGVyKG5hbWUsIGhhbmRsZXIsIGRvbSwgdGFnLCBpdGVtKSB7XG5cbiAgZG9tW25hbWVdID0gZnVuY3Rpb24oZSkge1xuXG4gICAgLy8gY3Jvc3MgYnJvd3NlciBldmVudCBmaXhcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnRcbiAgICBlLndoaWNoID0gZS53aGljaCB8fCBlLmNoYXJDb2RlIHx8IGUua2V5Q29kZVxuICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50XG4gICAgZS5jdXJyZW50VGFyZ2V0ID0gZG9tXG4gICAgZS5pdGVtID0gaXRlbVxuXG4gICAgLy8gcHJldmVudCBkZWZhdWx0IGJlaGF2aW91ciAoYnkgZGVmYXVsdClcbiAgICBpZiAoaGFuZGxlci5jYWxsKHRhZywgZSkgIT09IHRydWUgJiYgIS9yYWRpb3xjaGVjay8udGVzdChkb20udHlwZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQgJiYgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnJldHVyblZhbHVlID0gZmFsc2VcbiAgICB9XG5cbiAgICB2YXIgZWwgPSBpdGVtID8gdGFnLnBhcmVudCA6IHRhZ1xuICAgIGVsLnVwZGF0ZSgpXG5cbiAgfVxuXG59XG5cbi8vIHVzZWQgYnkgaWYtIGF0dHJpYnV0ZVxuZnVuY3Rpb24gaW5zZXJ0VG8ocm9vdCwgbm9kZSwgYmVmb3JlKSB7XG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbnNlcnRCZWZvcmUoYmVmb3JlLCBub2RlKVxuICAgIHJvb3QucmVtb3ZlQ2hpbGQobm9kZSlcbiAgfVxufVxuXG4vLyBpdGVtID0gY3VycmVudGx5IGxvb3BlZCBpdGVtXG5mdW5jdGlvbiB1cGRhdGUoZXhwcmVzc2lvbnMsIHRhZywgaXRlbSkge1xuXG4gIGVhY2goZXhwcmVzc2lvbnMsIGZ1bmN0aW9uKGV4cHIsIGkpIHtcblxuICAgIHZhciBkb20gPSBleHByLmRvbSxcbiAgICAgICAgYXR0ck5hbWUgPSBleHByLmF0dHIsXG4gICAgICAgIHZhbHVlID0gdG1wbChleHByLmV4cHIsIHRhZyksXG4gICAgICAgIHBhcmVudCA9IGV4cHIuZG9tLnBhcmVudE5vZGVcblxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB2YWx1ZSA9ICcnXG5cbiAgICAvLyBsZWF2ZSBvdXQgcmlvdC0gcHJlZml4ZXMgZnJvbSBzdHJpbmdzIGluc2lkZSB0ZXh0YXJlYVxuICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LnRhZ05hbWUgPT0gJ1RFWFRBUkVBJykgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9yaW90LS9nLCAnJylcblxuICAgIC8vIG5vIGNoYW5nZVxuICAgIGlmIChleHByLnZhbHVlID09PSB2YWx1ZSkgcmV0dXJuXG4gICAgZXhwci52YWx1ZSA9IHZhbHVlXG5cbiAgICAvLyB0ZXh0IG5vZGVcbiAgICBpZiAoIWF0dHJOYW1lKSByZXR1cm4gZG9tLm5vZGVWYWx1ZSA9IHZhbHVlXG5cbiAgICAvLyByZW1vdmUgb3JpZ2luYWwgYXR0cmlidXRlXG4gICAgcmVtQXR0cihkb20sIGF0dHJOYW1lKVxuXG4gICAgLy8gZXZlbnQgaGFuZGxlclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2V0RXZlbnRIYW5kbGVyKGF0dHJOYW1lLCB2YWx1ZSwgZG9tLCB0YWcsIGl0ZW0pXG5cbiAgICAvLyBpZi0gY29uZGl0aW9uYWxcbiAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09ICdpZicpIHtcbiAgICAgIHZhciBzdHViID0gZXhwci5zdHViXG5cbiAgICAgIC8vIGFkZCB0byBET01cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBzdHViICYmIGluc2VydFRvKHN0dWIucGFyZW50Tm9kZSwgc3R1YiwgZG9tKVxuXG4gICAgICAvLyByZW1vdmUgZnJvbSBET01cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0dWIgPSBleHByLnN0dWIgPSBzdHViIHx8IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKVxuICAgICAgICBpbnNlcnRUbyhkb20ucGFyZW50Tm9kZSwgZG9tLCBzdHViKVxuICAgICAgfVxuXG4gICAgLy8gc2hvdyAvIGhpZGVcbiAgICB9IGVsc2UgaWYgKC9eKHNob3d8aGlkZSkkLy50ZXN0KGF0dHJOYW1lKSkge1xuICAgICAgaWYgKGF0dHJOYW1lID09ICdoaWRlJykgdmFsdWUgPSAhdmFsdWVcbiAgICAgIGRvbS5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJ1xuXG4gICAgLy8gZmllbGQgdmFsdWVcbiAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09ICd2YWx1ZScpIHtcbiAgICAgIGRvbS52YWx1ZSA9IHZhbHVlXG5cbiAgICAvLyA8aW1nIHNyYz1cInsgZXhwciB9XCI+XG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZS5zbGljZSgwLCA1KSA9PSAncmlvdC0nKSB7XG4gICAgICBhdHRyTmFtZSA9IGF0dHJOYW1lLnNsaWNlKDUpXG4gICAgICB2YWx1ZSA/IGRvbS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIHZhbHVlKSA6IHJlbUF0dHIoZG9tLCBhdHRyTmFtZSlcblxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZXhwci5ib29sKSB7XG4gICAgICAgIGRvbVthdHRyTmFtZV0gPSB2YWx1ZVxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm5cbiAgICAgICAgdmFsdWUgPSBhdHRyTmFtZVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9ICdvYmplY3QnKSBkb20uc2V0QXR0cmlidXRlKGF0dHJOYW1lLCB2YWx1ZSlcblxuICAgIH1cblxuICB9KVxuXG59XG5mdW5jdGlvbiBlYWNoKGVscywgZm4pIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IChlbHMgfHwgW10pLmxlbmd0aCwgZWw7IGkgPCBsZW47IGkrKykge1xuICAgIGVsID0gZWxzW2ldXG4gICAgLy8gcmV0dXJuIGZhbHNlIC0+IHJlbW92ZSBjdXJyZW50IGl0ZW0gZHVyaW5nIGxvb3BcbiAgICBpZiAoZWwgIT0gbnVsbCAmJiBmbihlbCwgaSkgPT09IGZhbHNlKSBpLS1cbiAgfVxuICByZXR1cm4gZWxzXG59XG5cbmZ1bmN0aW9uIHJlbUF0dHIoZG9tLCBuYW1lKSB7XG4gIGRvbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbn1cblxuLy8gbWF4IDIgZnJvbSBvYmplY3RzIGFsbG93ZWRcbmZ1bmN0aW9uIGV4dGVuZChvYmosIGZyb20sIGZyb20yKSB7XG4gIGZyb20gJiYgZWFjaChPYmplY3Qua2V5cyhmcm9tKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgb2JqW2tleV0gPSBmcm9tW2tleV1cbiAgfSlcbiAgcmV0dXJuIGZyb20yID8gZXh0ZW5kKG9iaiwgZnJvbTIpIDogb2JqXG59XG5cbmZ1bmN0aW9uIGNoZWNrSUUoKSB7XG4gIGlmICh3aW5kb3cpIHtcbiAgICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgdmFyIG1zaWUgPSB1YS5pbmRleE9mKCdNU0lFICcpXG4gICAgaWYgKG1zaWUgPiAwKSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKG1zaWUgKyA1LCB1YS5pbmRleE9mKCcuJywgbXNpZSkpLCAxMClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gMFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBvcHRpb25Jbm5lckhUTUwoZWwsIGh0bWwpIHtcbiAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpLFxuICAgICAgdmFsUmVneCA9IC92YWx1ZT1bXFxcIiddKC4rPylbXFxcIiddLyxcbiAgICAgIHNlbFJlZ3ggPSAvc2VsZWN0ZWQ9W1xcXCInXSguKz8pW1xcXCInXS8sXG4gICAgICB2YWx1ZXNNYXRjaCA9IGh0bWwubWF0Y2godmFsUmVneCksXG4gICAgICBzZWxlY3RlZE1hdGNoID0gaHRtbC5tYXRjaChzZWxSZWd4KVxuXG4gIG9wdC5pbm5lckhUTUwgPSBodG1sXG5cbiAgaWYgKHZhbHVlc01hdGNoKSB7XG4gICAgb3B0LnZhbHVlID0gdmFsdWVzTWF0Y2hbMV1cbiAgfVxuXG4gIGlmIChzZWxlY3RlZE1hdGNoKSB7XG4gICAgb3B0LnNldEF0dHJpYnV0ZSgncmlvdC1zZWxlY3RlZCcsIHNlbGVjdGVkTWF0Y2hbMV0pXG4gIH1cblxuICBlbC5hcHBlbmRDaGlsZChvcHQpXG59XG5cbmZ1bmN0aW9uIG1rZG9tKHRlbXBsYXRlKSB7XG4gIHZhciB0YWdOYW1lID0gdGVtcGxhdGUudHJpbSgpLnNsaWNlKDEsIDMpLnRvTG93ZXJDYXNlKCksXG4gICAgICByb290VGFnID0gL3RkfHRoLy50ZXN0KHRhZ05hbWUpID8gJ3RyJyA6IHRhZ05hbWUgPT0gJ3RyJyA/ICd0Ym9keScgOiAnZGl2JyxcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChyb290VGFnKVxuXG4gIGVsLnN0dWIgPSB0cnVlXG5cbiAgaWYgKHRhZ05hbWUgPT09ICdvcCcgJiYgaWVWZXJzaW9uICYmIGllVmVyc2lvbiA8IDEwKSB7XG4gICAgb3B0aW9uSW5uZXJIVE1MKGVsLCB0ZW1wbGF0ZSlcbiAgfSBlbHNlIHtcbiAgICBlbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICB9XG4gIHJldHVybiBlbFxufVxuXG5mdW5jdGlvbiB3YWxrKGRvbSwgZm4pIHtcbiAgaWYgKGRvbSkge1xuICAgIGlmIChmbihkb20pID09PSBmYWxzZSkgd2Fsayhkb20ubmV4dFNpYmxpbmcsIGZuKVxuICAgIGVsc2Uge1xuICAgICAgZG9tID0gZG9tLmZpcnN0Q2hpbGRcblxuICAgICAgd2hpbGUgKGRvbSkge1xuICAgICAgICB3YWxrKGRvbSwgZm4pXG4gICAgICAgIGRvbSA9IGRvbS5uZXh0U2libGluZ1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZXBsYWNlWWllbGQgKHRtcGwsIGlubmVySFRNTCkge1xuICByZXR1cm4gdG1wbC5yZXBsYWNlKC88KHlpZWxkKVxcLz8+KDxcXC9cXDE+KT8vZ2ltLCBpbm5lckhUTUwgfHwgJycpXG59XG5cbmZ1bmN0aW9uICQkKHNlbGVjdG9yLCBjdHgpIHtcbiAgY3R4ID0gY3R4IHx8IGRvY3VtZW50XG4gIHJldHVybiBjdHgucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcilcbn1cblxuZnVuY3Rpb24gYXJyRGlmZihhcnIxLCBhcnIyKSB7XG4gIHJldHVybiBhcnIxLmZpbHRlcihmdW5jdGlvbihlbCkge1xuICAgIHJldHVybiBhcnIyLmluZGV4T2YoZWwpIDwgMFxuICB9KVxufVxuXG5mdW5jdGlvbiBhcnJGaW5kRXF1YWxzKGFyciwgZWwpIHtcbiAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKF9lbCkge1xuICAgIHJldHVybiBfZWwgPT09IGVsXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGluaGVyaXQocGFyZW50KSB7XG4gIGZ1bmN0aW9uIENoaWxkKCkge31cbiAgQ2hpbGQucHJvdG90eXBlID0gcGFyZW50XG4gIHJldHVybiBuZXcgQ2hpbGQoKVxufVxuXG4vKlxuIFZpcnR1YWwgZG9tIGlzIGFuIGFycmF5IG9mIGN1c3RvbSB0YWdzIG9uIHRoZSBkb2N1bWVudC5cbiBVcGRhdGVzIGFuZCB1bm1vdW50cyBwcm9wYWdhdGUgZG93bndhcmRzIGZyb20gcGFyZW50IHRvIGNoaWxkcmVuLlxuKi9cblxudmFyIHZpcnR1YWxEb20gPSBbXSxcbiAgICB0YWdJbXBsID0ge31cblxuXG5mdW5jdGlvbiBnZXRUYWcoZG9tKSB7XG4gIHJldHVybiB0YWdJbXBsW2RvbS5nZXRBdHRyaWJ1dGUoJ3Jpb3QtdGFnJykgfHwgZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKV1cbn1cblxuZnVuY3Rpb24gaW5qZWN0U3R5bGUoY3NzKSB7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICBub2RlLmlubmVySFRNTCA9IGNzc1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG5vZGUpXG59XG5cbmZ1bmN0aW9uIG1vdW50VG8ocm9vdCwgdGFnTmFtZSwgb3B0cykge1xuICB2YXIgdGFnID0gdGFnSW1wbFt0YWdOYW1lXSxcbiAgICAgIGlubmVySFRNTCA9IHJvb3QuaW5uZXJIVE1MXG5cbiAgLy8gY2xlYXIgdGhlIGlubmVyIGh0bWxcbiAgcm9vdC5pbm5lckhUTUwgPSAnJ1xuXG4gIGlmICh0YWcgJiYgcm9vdCkgdGFnID0gbmV3IFRhZyh0YWcsIHsgcm9vdDogcm9vdCwgb3B0czogb3B0cyB9LCBpbm5lckhUTUwpXG5cbiAgaWYgKHRhZyAmJiB0YWcubW91bnQpIHtcbiAgICB0YWcubW91bnQoKVxuICAgIHZpcnR1YWxEb20ucHVzaCh0YWcpXG4gICAgcmV0dXJuIHRhZy5vbigndW5tb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmlydHVhbERvbS5zcGxpY2UodmlydHVhbERvbS5pbmRleE9mKHRhZyksIDEpXG4gICAgfSlcbiAgfVxuXG59XG5cbnJpb3QudGFnID0gZnVuY3Rpb24obmFtZSwgaHRtbCwgY3NzLCBmbikge1xuICBpZiAodHlwZW9mIGNzcyA9PSAnZnVuY3Rpb24nKSBmbiA9IGNzc1xuICBlbHNlIGlmIChjc3MpIGluamVjdFN0eWxlKGNzcylcbiAgdGFnSW1wbFtuYW1lXSA9IHsgbmFtZTogbmFtZSwgdG1wbDogaHRtbCwgZm46IGZuIH1cbiAgcmV0dXJuIG5hbWVcbn1cblxucmlvdC5tb3VudCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCB0YWdOYW1lLCBvcHRzKSB7XG5cbiAgdmFyIGVsLFxuICAgICAgc2VsY3RBbGxUYWdzID0gZnVuY3Rpb24oc2VsKSB7XG4gICAgICAgIHNlbCA9IE9iamVjdC5rZXlzKHRhZ0ltcGwpLmpvaW4oJywgJylcbiAgICAgICAgc2VsLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICBzZWwgKz0gJywgKltyaW90LXRhZz1cIicrIHQudHJpbSgpICsgJ1wiXSdcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNlbFxuICAgICAgfSxcbiAgICAgIHRhZ3MgPSBbXVxuXG4gIGlmICh0eXBlb2YgdGFnTmFtZSA9PSAnb2JqZWN0JykgeyBvcHRzID0gdGFnTmFtZTsgdGFnTmFtZSA9IDAgfVxuXG4gIC8vIGNyYXdsIHRoZSBET00gdG8gZmluZCB0aGUgdGFnXG4gIGlmKHR5cGVvZiBzZWxlY3RvciA9PSAnc3RyaW5nJykge1xuICAgIGlmIChzZWxlY3RvciA9PSAnKicpIHtcbiAgICAgIC8vIHNlbGVjdCBhbGwgdGhlIHRhZ3MgcmVnaXN0ZXJlZFxuICAgICAgLy8gYW5kIGFsc28gdGhlIHRhZ3MgZm91bmQgd2l0aCB0aGUgcmlvdC10YWcgYXR0cmlidXRlIHNldFxuICAgICAgc2VsZWN0b3IgPSBzZWxjdEFsbFRhZ3Moc2VsZWN0b3IpXG4gICAgfVxuICAgIC8vIG9yIGp1c3QgdGhlIG9uZXMgbmFtZWQgbGlrZSB0aGUgc2VsZWN0b3JcbiAgICBlbCA9ICQkKHNlbGVjdG9yKVxuICB9XG4gIC8vIHByb2JhYmx5IHlvdSBoYXZlIHBhc3NlZCBhbHJlYWR5IGEgdGFnIG9yIGEgTm9kZUxpc3RcbiAgZWxzZVxuICAgIGVsID0gc2VsZWN0b3JcblxuICAvLyBzZWxlY3QgYWxsIHRoZSByZWdpc3RlcmVkIGFuZCBtb3VudCB0aGVtIGluc2lkZSB0aGVpciByb290IGVsZW1lbnRzXG4gIGlmICh0YWdOYW1lID09ICcqJykge1xuICAgIC8vIGdldCBhbGwgY3VzdG9tIHRhZ3NcbiAgICB0YWdOYW1lID0gc2VsY3RBbGxUYWdzKHNlbGVjdG9yKVxuICAgIC8vIGlmIHRoZSByb290IGVsIGl0J3MganVzdCBhIHNpbmdsZSB0YWdcbiAgICBpZiAoZWwudGFnTmFtZSkge1xuICAgICAgZWwgPSAkJCh0YWdOYW1lLCBlbClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5vZGVMaXN0ID0gW11cbiAgICAgIC8vIHNlbGVjdCBhbGwgdGhlIGNoaWxkcmVuIGZvciBhbGwgdGhlIGRpZmZlcmVudCByb290IGVsZW1lbnRzXG4gICAgICBlYWNoKGVsLCBmdW5jdGlvbih0YWcpIHtcbiAgICAgICAgbm9kZUxpc3QgPSAkJCh0YWdOYW1lLCB0YWcpXG4gICAgICB9KVxuICAgICAgZWwgPSBub2RlTGlzdFxuICAgIH1cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSB0YWdOYW1lXG4gICAgdGFnTmFtZSA9IDBcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2gocm9vdCkge1xuICAgIHZhciBuYW1lID0gdGFnTmFtZSB8fCByb290LmdldEF0dHJpYnV0ZSgncmlvdC10YWcnKSB8fCByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgdGFnID0gbW91bnRUbyhyb290LCBuYW1lLCBvcHRzKVxuXG4gICAgaWYgKHRhZykgdGFncy5wdXNoKHRhZylcbiAgfVxuXG4gIC8vIERPTSBub2RlXG4gIGlmIChlbC50YWdOYW1lKVxuICAgIHB1c2goc2VsZWN0b3IpXG4gIC8vIHNlbGVjdG9yIG9yIE5vZGVMaXN0XG4gIGVsc2VcbiAgICBlYWNoKGVsLCBwdXNoKVxuXG4gIHJldHVybiB0YWdzXG5cbn1cblxuLy8gdXBkYXRlIGV2ZXJ5dGhpbmdcbnJpb3QudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBlYWNoKHZpcnR1YWxEb20sIGZ1bmN0aW9uKHRhZykge1xuICAgIHRhZy51cGRhdGUoKVxuICB9KVxufVxuXG4vLyBAZGVwcmVjYXRlZFxucmlvdC5tb3VudFRvID0gcmlvdC5tb3VudFxuXG5cblxuICAvLyBzaGFyZSBtZXRob2RzIGZvciBvdGhlciByaW90IHBhcnRzLCBlLmcuIGNvbXBpbGVyXG4gIHJpb3QudXRpbCA9IHsgYnJhY2tldHM6IGJyYWNrZXRzLCB0bXBsOiB0bXBsIH1cblxuICAvLyBzdXBwb3J0IENvbW1vbkpTLCBBTUQgJiBicm93c2VyXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSByaW90XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiByaW90IH0pXG4gIGVsc2VcbiAgICB3aW5kb3cucmlvdCA9IHJpb3RcblxufSkodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZCk7XG4iLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpLkRpc3BhdGNoZXI7XG5cbnZhciBBY3Rpb25UeXBlcyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy90aW1lYm94ZXJfY29uc3RhbnRzLmpzJykuQWN0aW9uVHlwZXM7XG5cbnZhciBkaXNwYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIGRhdGEpIHtcbiAgcmV0dXJuIERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNhdmVUZW1wbGF0ZTogZnVuY3Rpb24odGFzaykge1xuICAgIGNvbnNvbGUubG9nKHRhc2spO1xuICAgIHJldHVybiBkaXNwYXRjaChBY3Rpb25UeXBlcy5URU1QTEFURV9TQVZFLCB0YXNrKTtcbiAgfSxcbiAgdXBkYXRlVGVtcGxhdGU6IGZ1bmN0aW9uKHRhc2ssIGluZGV4KSB7XG4gICAgY29uc29sZS5sb2codGFzayk7XG4gICAgdmFyIGRhdGEgPSB7dGFzazogdGFzaywgaW5kZXg6IGluZGV4fTtcbiAgICByZXR1cm4gZGlzcGF0Y2goQWN0aW9uVHlwZXMuVEVNUExBVEVfVVBEQVRFLCBkYXRhKTtcbiAgfSxcbiAgcmVtb3ZlVGVtcGxhdGU6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKEFjdGlvblR5cGVzLlRFTVBMQVRFX1JFTU9WRSwgaW5kZXgpO1xuICB9LFxuICBzZXJ2ZXJEYXRhUmVjZWl2ZWQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ3NlcnZlckRhdGFSZWNlaXZlZCcsIGRhdGEpO1xuICAgIHJldHVybiBkaXNwYXRjaChBY3Rpb25UeXBlcy5TRVJWRVJfRkVUQ0hfQ09NUExFVEUsIGRhdGEpO1xuICB9XG59O1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG52YXIgZmx1eF9yaW90ID0gcmVxdWlyZSgnZmx1eC1yaW90JylcblxucmlvdC50YWcoJ3RpbWVib3hlci1hYm91dCcsICc8aDM+eyBvcHRzLnRpdGxlIH08L2gzPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNFwiPiA8aW1nIHNyYz1cImh0dHA6Ly93d3cucGl4ZW50cmFsLmNvbS9waWNzLzFEdlowYktLUnJiR2dlcEZNZWprcFVQMUtjd3N6LmdpZlwiIC8+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29sLW1kLThcIj4gPHVsPiA8bGk+UmF5IEhhdXNtYW5uPC9saT4gPGxpPkpheTwvbGk+IDxsaT5EaW5rczwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG5cblxufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKVxuXG5yaW90LnRhZygndGltZWJveGVyLWNvbnRhY3QnLCAnPGgzPnsgb3B0cy50aXRsZSB9PC9oMz4gPGEgaHJlZj1cImh0dHA6Ly93d3cuYmFiYmVsLmNvbS9cIj5iYWJiZWwuY29tPC9hPicsIGZ1bmN0aW9uKG9wdHMpIHtcblxuXG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xucmVxdWlyZSgnLi90aW1lYm94ZXJfdGVtcGxhdGUvaW5kZXgudGFnJylcblxudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpXG5cbnJpb3QudGFnKCd0aW1lYm94ZXItaW5kZXgnLCAnPGgzPnsgb3B0cy50aXRsZSB9PC9oMz4gPHRpbWVib3hlci10ZW1wbGF0ZS1pbmRleCBzdG9yZT1cInsgb3B0cy5zdG9yZSB9XCI+PC90aW1lYm94ZXItdGVtcGxhdGUtaW5kZXg+JywgZnVuY3Rpb24ob3B0cykge1xuXG5cbn0pO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG52YXIgdGltZWJveGVyID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy90aW1lYm94ZXIuanMnKVxudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpXG5cbnJpb3QudGFnKCd0aW1lYm94ZXItbWVldGluZy1zdGFydCcsICc8aDM+eyB0aGlzLnRlbXBsYXRlLm5hbWUgfTwvaDM+IDxocj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLThcIj4gPGgzIGNsYXNzPVwiYWdlbmRhLW5hbWVcIj57IHRoaXMuY3VycmVudEFnZW5kYS5uYW1lIH08L2gzPiA8ZGl2IGlkPVwidGltaW5nQ2xvY2tcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInByb2dyZXNzXCIgaWQ9XCJwcm9ncmVzc2JhclwiPiA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIGFjdGl2ZVwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCI0NVwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IHN0YXJ0T3JQYXVzZSB9XCIgY2xhc3M9XCJidG4gYnRuLWJsb2NrIGJ0bi1zdWNjZXNzXCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbGF5LWNpcmNsZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gPHNwYW4gaWQ9XCJhZ2VuZGFDb250aW51ZVwiPlN0YXJ0PC9zcGFuPiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBuZXh0QWdlbmRhIH1cIiBjbGFzcz1cImJ0biBidG4tYmxvY2sgYnRuLWluZm9cIiBpZD1cIm5leHRBZ2VuZGFCdG5cIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLW9rLWNpcmNsZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gTmV4dCA8L2E+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTNcIj4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBwcmV2aW91c0FnZW5kYSB9XCIgY2xhc3M9XCJidG4gYnRuLXhzIGJ0bi1kZWZhdWx0XCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1vay1jaXJjbGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFByZXZpb3VzIDwvYT4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyByZWR1Y2VUaW1lIH1cIiBjbGFzcz1cImJ0biBidG4teHMgYnRuLWRlZmF1bHRcIj4tMTwvYT4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBpbmNyZWFzZVRpbWUgfVwiIGNsYXNzPVwiYnRuIGJ0bi14cyBidG4tZGVmYXVsdFwiPisxPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj4gPHVsIGNsYXNzPVwibGlzdC1ncm91cFwiPiA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIiBlYWNoPVwieyBpdGVtLCBpbmRleCBpbiB0aGlzLnRlbXBsYXRlLmFnZW5kYSB9XCI+IDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInsgXFwnYWdlbmRhSXRlbVxcJysgaW5kZXggfVwiIGRpc2FibGVkPiA8Yj57IGl0ZW0ubmFtZSB9PC9iPiA8c3BhbiBjbGFzcz1cImJhZGdlXCI+eyBpdGVtLnRpbWUgfSBtaW51dGVzPC9zcGFuPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJtb2RhbCBmYWRlXCIgaWQ9XCJhbGxEb25lXCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPiA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPk5vdGljZTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPiA8cD5HcmVhdCBKb2IgZmluaXNoaW5nIHRoZSBtZWV0aW5nISE8L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgdGhpcy5jdXJyZW50QWdlbmRhSW5kZXggPSAwO1xuICB0aGlzLmN1cnJlbnRBZ2VuZGFUaW1lID0gMTtcblxuICB0aGlzLnNldEN1cnJlbnRBZ2VuZGEgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRBZ2VuZGEgPSB0aGlzLnRlbXBsYXRlLmFnZW5kYVt0aGlzLmN1cnJlbnRBZ2VuZGFJbmRleF07XG4gICAgICBpZiAodGhpcy5jdXJyZW50QWdlbmRhKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEFnZW5kYVRpbWUgPSBwYXJzZUZsb2F0KHRoaXMuY3VycmVudEFnZW5kYS50aW1lKSAqIDYwO1xuICAgICAgICB0aGlzLnRpbWVyQ2xvY2suc2V0VGltZSh0aGlzLmN1cnJlbnRBZ2VuZGFUaW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5hbGxEb25lKS5tb2RhbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuZ2V0VGVtcGxhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gb3B0cy50ZW1wbGF0ZV9zdG9yZS5nZXRBbGwoKVtvcHRzLnRlbXBsYXRlSWRdO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5uZXh0QWdlbmRhID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZXNldFN0YXR1cygpO1xuICAgICQoJyNhZ2VuZGFJdGVtJyt0aGlzLmN1cnJlbnRBZ2VuZGFJbmRleCkucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgIHRoaXMuY3VycmVudEFnZW5kYUluZGV4Kys7XG4gICAgdGhpcy5zZXRDdXJyZW50QWdlbmRhKCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnByZXZpb3VzQWdlbmRhID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZXNldFN0YXR1cygpO1xuICAgIHRoaXMuY3VycmVudEFnZW5kYUluZGV4LS07XG4gICAgJCgnI2FnZW5kYUl0ZW0nK3RoaXMuY3VycmVudEFnZW5kYUluZGV4KS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgIHRoaXMuc2V0Q3VycmVudEFnZW5kYSgpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5yZWR1Y2VUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlbWFpbmluZ1RpbWUgPSB0aGlzLnRpbWVyQ2xvY2suZ2V0VGltZSgpLnRpbWU7XG4gICAgaWYgKHJlbWFpbmluZ1RpbWUgLSA2MCA+IDApIHtcbiAgICAgIHRoaXMudGltZXJDbG9jay5zZXRUaW1lKHJlbWFpbmluZ1RpbWUgLSA1OSk7XG4gICAgfVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5pbmNyZWFzZVRpbWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVtYWluaW5nVGltZSA9IHRoaXMudGltZXJDbG9jay5nZXRUaW1lKCkudGltZTtcbiAgICB0aGlzLnRpbWVyQ2xvY2suc2V0VGltZShyZW1haW5pbmdUaW1lICsgNjEpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5pbml0Q2xvY2sgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRpbWVyQ2xvY2sgPSAkKHRoaXMudGltaW5nQ2xvY2spLkZsaXBDbG9jayh7XG4gICAgICBhdXRvU3RhcnQ6IGZhbHNlLFxuICAgICAgY291bnRkb3duOiB0cnVlLFxuICAgICAgY2xvY2tGYWNlOiAnTWludXRlQ291bnRlcicsXG4gICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgaW50ZXJ2YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0ID0gdGhpcy50aW1lckNsb2NrLmdldFRpbWUoKTtcbiAgICAgICAgICB2YXIgcGVyY2VudCA9ICh0KjEwMCkvdGhpcy5jdXJyZW50QWdlbmRhVGltZTtcbiAgICAgICAgICB2YXIgZXh0cmFDbGFzcyA9ICcnO1xuXG4gICAgICAgICAgaWYgKHBlcmNlbnQgPD0gMjApIHtcbiAgICAgICAgICAgIGV4dHJhQ2xhc3MgPSAncHJvZ3Jlc3MtYmFyLXdhcm5pbmcnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwZXJjZW50IDw9IDEwKSB7XG4gICAgICAgICAgICBleHRyYUNsYXNzID0gJ3Byb2dyZXNzLWJhci1kYW5nZXInO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQodGhpcy5wcm9ncmVzc2JhcikuZmluZCgnLnByb2dyZXNzLWJhcicpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogcGVyY2VudCArICclJ1xuICAgICAgICAgIH0pLmFkZENsYXNzKGV4dHJhQ2xhc3MpO1xuXG4gICAgICAgICAgaWYodCA8PSAwKSB7XG4gICAgICAgICAgICAkKHRoaXMubmV4dEFnZW5kYUJ0bikuY2xpY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgfVxuICAgIH0pO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldFRlbXBsYXRlRnJvbVN0b3JlKClcbiAgICB0aGlzLnNldEN1cnJlbnRBZ2VuZGEoKVxuICAgIHRoaXMudXBkYXRlKClcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc3RhcnRPclBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoKHRoaXMuY3VycmVudEFnZW5kYVN0YXR1cykge1xuICAgICAgY2FzZSAncGF1c2VkJzpcbiAgICAgICAgdGhpcy50aW1lckNsb2NrLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuY3VycmVudEFnZW5kYVN0YXR1cyA9ICdzdGFydGVkJztcbiAgICAgICAgJCh0aGlzLmFnZW5kYUNvbnRpbnVlKS5odG1sKCdQYXVzZScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0YXJ0ZWQnOlxuICAgICAgICB0aGlzLnRpbWVyQ2xvY2suc3RvcCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRBZ2VuZGFTdGF0dXMgPSAncGF1c2VkJztcbiAgICAgICAgJCh0aGlzLmFnZW5kYUNvbnRpbnVlKS5odG1sKCdTdGFydCcpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnJlc2V0U3RhdHVzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50aW1lckNsb2NrLnN0b3AoKTtcbiAgICB0aGlzLmN1cnJlbnRBZ2VuZGFTdGF0dXMgPSAncGF1c2VkJztcbiAgICAkKHRoaXMuYWdlbmRhQ29udGludWUpLmh0bWwoJ1N0YXJ0Jyk7XG5cbiAgICAkKHRoaXMucHJvZ3Jlc3NiYXIpLmZpbmQoJy5wcm9ncmVzcy1iYXInKS5cbiAgICBjc3Moe1xuICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgIH0pLlxuICAgIHJlbW92ZUNsYXNzKCdwcm9ncmVzcy1iYXItd2FybmluZycpLlxuICAgIHJlbW92ZUNsYXNzKCdwcm9ncmVzcy1iYXItZGFuZ2VyJyk7XG4gIH0uYmluZCh0aGlzKTtcblxuICBmbHV4X3Jpb3Quc3RvcmVNaXhpbih0aGlzLCBvcHRzLnRlbXBsYXRlX3N0b3JlLCB0aGlzLnVwZGF0ZUZyb21TdG9yZSk7XG4gIHRoaXMub24oJ21vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nZXRUZW1wbGF0ZUZyb21TdG9yZSgpO1xuICAgIHRoaXMuaW5pdENsb2NrKCk7XG4gICAgdGhpcy5yZXNldFN0YXR1cygpO1xuICAgIHRoaXMuc2V0Q3VycmVudEFnZW5kYSgpO1xuICB9KTtcblxuICB0aGlzLm9uKCd1bm1vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50aW1lckNsb2NrLnN0b3AoKTtcbiAgfSk7XG5cblxufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKTtcbnZhciBUaW1lQm94ZXIgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL3RpbWVib3hlci5qcycpO1xuXG5yaW90LnRhZygndGltZWJveGVyLXRlbXBsYXRlLWFkZCcsICc8aDM+eyBvcHRzLnRpdGxlIH08L2gzPiA8aHI+IDxmb3JtPiA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiA8bGFiZWwgZm9yPVwidGVtcGxhdGVOYW1lXCI+RXZlbnQgVGVtcGxhdGUgTmFtZTwvbGFiZWw+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJ0ZW1wbGF0ZU5hbWVcIiBwbGFjZWhvbGRlcj1cIkVudGVyIFRlbXBsYXRlIE5hbWVcIiBvbmtleXVwPVwieyBlZGl0VGl0bGUgfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGxhYmVsPkFnZW5kYTwvbGFiZWw+IDx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj4gPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCIgZWFjaD1cInsgaXRlbSBpbiBhZ2VuZGFJdGVtcyB9XCI+IDxiPnsgaXRlbS5uYW1lIH08L2I+IGZvciA8Yj57IGl0ZW0udGltZSB9PC9iPiBtaW51dGVzIDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Zvcm0+IDxmb3JtIGNsYXNzPVwiZm9ybS1pbmxpbmVcIiBvbnN1Ym1pdD1cInsgYWRkQWdlbmRhIH1cIj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGxhYmVsIGNsYXNzPVwic3Itb25seVwiIGZvcj1cImFnZW5kYVRpdGxlXCI+SXRlbSBUaXRsZTwvbGFiZWw+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhZ2VuZGFUaXRsZVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgQWdlbmRhIEl0ZW0gVGl0bGVcIiBvbmtleXVwPVwieyBlZGl0QWdlbmRhVGl0bGUgfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGxhYmVsIGNsYXNzPVwic3Itb25seVwiIGZvcj1cImFnZW5kYVRpbWVcIj5JdGVtIFRpbWU8L2xhYmVsPiA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwiYWdlbmRhVGltZVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgQWdlbmRhIEl0ZW0gVGltZVwiIG9ua2V5dXA9XCJ7IGVkaXRBZ2VuZGFUaW1lIH1cIj4gPC9kaXY+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIF9fZGlzYWJsZWQ9XCJ7ICEoYWdlbmRhVGl0bGVWYWx1ZSAmJiBhZ2VuZGFUaW1lVmFsdWUpIH1cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPkFkZCBBZ2VuZGEgSXRlbTwvYnV0dG9uPiA8L2Zvcm0+IDxocj4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBzYXZlVGVtcGxhdGUgfVwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzLXNpZ25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENyZWF0ZSA8L2E+IDxhIGhyZWY9XCIjXCIgb25jbGljaz1cInsgY2FuY2VsIH1cIiBjbGFzcz1cImJ0biBidG4taW5mb1wiPiA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tYmFuLWNpcmNsZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ2FuY2VsIDwvYT4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgdGhpcy50aXRsZSA9ICcnO1xuXG4gIHRoaXMuYWdlbmRhSXRlbXMgPSBbXTtcblxuICB0aGlzLmFkZEFnZW5kYSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmFnZW5kYVRpdGxlVmFsdWUgJiYgdGhpcy5hZ2VuZGFUaW1lVmFsdWUpIHtcbiAgICAgIHRoaXMuYWdlbmRhSXRlbXMucHVzaCh7XG4gICAgICAgIG5hbWU6IHRoaXMuYWdlbmRhVGl0bGVWYWx1ZSxcbiAgICAgICAgdGltZTogdGhpcy5hZ2VuZGFUaW1lVmFsdWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZ2VuZGFUaXRsZVZhbHVlID0gdGhpcy5hZ2VuZGFUaW1lVmFsdWUgPSB0aGlzLmFnZW5kYVRpbWUudmFsdWUgPSB0aGlzLmFnZW5kYVRpdGxlLnZhbHVlID0gJyc7XG4gICAgfVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5lZGl0VGl0bGUgPSBmdW5jdGlvbihlKSB7XG4gICAgdGhpcy50aXRsZSA9IGUudGFyZ2V0LnZhbHVlO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5lZGl0QWdlbmRhVGl0bGUgPSBmdW5jdGlvbihlKSB7XG4gICAgdGhpcy5hZ2VuZGFUaXRsZVZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmVkaXRBZ2VuZGFUaW1lID0gZnVuY3Rpb24oZSkge1xuICAgIHRoaXMuYWdlbmRhVGltZVZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnNhdmVUZW1wbGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIFRpbWVCb3hlci5zYXZlVGVtcGxhdGUoe1xuICAgICAgbmFtZTogdGhpcy50aXRsZSxcbiAgICAgIGFnZW5kYTogdGhpcy5hZ2VuZGFJdGVtc1xuICAgIH0pO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICByaW90LnJvdXRlKCcjJyk7XG4gIH0uYmluZCh0aGlzKTtcbiAgdGhpcy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICByaW90LnJvdXRlKCcjJyk7XG4gIH0uYmluZCh0aGlzKTtcblxuICBmbHV4X3Jpb3Quc3RvcmVNaXhpbih0aGlzLCBvcHRzLnN0b3JlLCB0aGlzLnVwZGF0ZUZyb21TdG9yZSlcblxuXG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpO1xudmFyIFRpbWVCb3hlciA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvdGltZWJveGVyLmpzJyk7XG5cbnJpb3QudGFnKCd0aW1lci1saXN0JywgJzxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiID4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJ7YWdlbmRhLm5hbWV9XCIgbmFtZT1cIml0ZW1OYW1lXCI+IDxzcGFuPiBGb3IgPC9zcGFuPiA8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cInthZ2VuZGEudGltZX1cIiBuYW1lPVwiaXRlbVRpbWVcIj4gPHNwYW4+IE1pbnV0ZXMgPC9zcGFuPiA8c3BhbiBvbmNsaWNrPVwie21vdmVVcH1cIiBkYXRhLWluZGV4PVwie2luZGV4fVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdseXBoaWNvbiBnbHlwaGljb24tYXJyb3ctdXBcIj4gPC9zcGFuPiA8c3BhbiBvbmNsaWNrPVwie21vdmVEb3dufVwiIGRhdGEtaW5kZXg9XCJ7aW5kZXh9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ2x5cGhpY29uIGdseXBoaWNvbi1hcnJvdy1kb3duXCI+IDwvc3Bhbj4gPHNwYW4gb25jbGljaz1cIntkZWxldGVJdGVtfVwiIGRhdGEtaW5kZXg9XCJ7aW5kZXh9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj4gPC9zcGFuPiA8L2xpPicsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICB0aGlzLm1vdmVVcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQuaW5kZXgpO1xuICAgIHZhciB0bXA7XG4gICAgdmFyIGFnZW5kYXMgPSB0aGlzLnBhcmVudC5hZ2VuZGFJdGVtcy5hZ2VuZGE7XG4gICAgaWYgKCBpbmRleCA+IDApIHtcbiAgICAgIHRtcCA9IGFnZW5kYXNbaW5kZXggLSAxXTtcbiAgICAgIGFnZW5kYXNbaW5kZXggLSAxXSA9IGFnZW5kYXNbaW5kZXhdO1xuICAgICAgYWdlbmRhc1tpbmRleF0gPSB0bXA7XG4gICAgICBUaW1lQm94ZXIudXBkYXRlVGVtcGxhdGUodGhpcy5wYXJlbnQuYWdlbmRhSXRlbXMsIHRoaXMucGFyZW50Lm9wdHMudGVtcGxhdGVJZCk7XG4gICAgfVxuICB9LmJpbmQodGhpcyk7XG4gIHRoaXMubW92ZURvd24gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpbmRleCA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5kYXRhc2V0LmluZGV4LCAxMCk7XG4gICAgdmFyIHRtcDtcbiAgICB2YXIgYWdlbmRhcyA9IHRoaXMucGFyZW50LmFnZW5kYUl0ZW1zLmFnZW5kYTtcblxuICAgIGlmICggaW5kZXggPCBhZ2VuZGFzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRtcCA9IGFnZW5kYXNbaW5kZXhdO1xuICAgICAgYWdlbmRhc1tpbmRleF0gPSBhZ2VuZGFzW2luZGV4ICsgMV07XG4gICAgICBhZ2VuZGFzW2luZGV4ICsgMV0gPSB0bXA7XG4gICAgICBUaW1lQm94ZXIudXBkYXRlVGVtcGxhdGUodGhpcy5wYXJlbnQuYWdlbmRhSXRlbXMsIHRoaXMucGFyZW50Lm9wdHMudGVtcGxhdGVJZCk7XG4gICAgfVxuICB9LmJpbmQodGhpcyk7XG4gIHRoaXMuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQuaW5kZXgsIDEwKTtcbiAgICB2YXIgYWdlbmRhcyA9IHRoaXMucGFyZW50LmFnZW5kYUl0ZW1zLmFnZW5kYTtcbiAgICBhZ2VuZGFzLnNwbGljZShpbmRleCwgMSk7IC8vIHJlbW92ZSB0aGUgYXJyYXkgaXRlbVxuICAgIFRpbWVCb3hlci51cGRhdGVUZW1wbGF0ZSh0aGlzLnBhcmVudC5hZ2VuZGFJdGVtcywgdGhpcy5wYXJlbnQub3B0cy50ZW1wbGF0ZUlkKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG59KTtcblxucmlvdC50YWcoJ3RpbWVib3hlci10ZW1wbGF0ZS1lZGl0JywgJzxwIGlmPVwie29wdHMuaXNfZXJyb3J9XCI+IEZpbGwgdXAgYWxsIHRoZSB2YWx1ZXMgPC9wPiA8aDQ+IHtvcHRzLnRpdGxlfSA8L2g0PiA8Zm9ybSBvbnN1Ym1pdD1cInt1cGRhdGVBZ2VuZGF9XCI+IDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJ0ZW1wbGF0ZU5hbWVcIiB2YWx1ZT1cInthZ2VuZGFJdGVtcy5uYW1lfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGxhYmVsPkFnZW5kYTwvbGFiZWw+IDx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj4gPHRpbWVyLWxpc3QgZWFjaD1cInthZ2VuZGEsIGluZGV4IGluIGFnZW5kYUl0ZW1zLmFnZW5kYX1cIiBkYXRhPVwiYWdlbmRhXCI+PC91bD4gPC9saT4gPC91bD4gPC9kaXY+IDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBvbmNsaWNrPVwie2FkZE5ld1Jvd31cIj5OZXcgSXRlbTwvYnV0dG9uPiA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPlVwZGF0ZTwvYnV0dG9uPiA8L2Zvcm0+JywgZnVuY3Rpb24ob3B0cykge1xuXG4gIHRoaXMuYWRkTmV3Um93ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFnZW5kYSA9IHtcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgdGltZTogJydcbiAgICB9O1xuICAgIHRoaXMuYWdlbmRhSXRlbXMuYWdlbmRhLnB1c2goYWdlbmRhKTtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVBZ2VuZGEgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSB0aGlzLnRlbXBsYXRlTmFtZS52YWx1ZTtcblxuICAgIHZhciBpdGVtTmFtZXMgPSAkKHRoaXMucm9vdCkuZmluZCgnW25hbWU9XCJpdGVtTmFtZVwiXScpO1xuICAgIHZhciBpdGVtVGltZXMgPSAkKHRoaXMucm9vdCkuZmluZCgnW25hbWU9XCJpdGVtVGltZVwiXScpO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwIDsgaW5kZXggPCBpdGVtTmFtZXMubGVuZ3RoIDsgaW5kZXgrKykge1xuICAgICAgaWYgKGl0ZW1OYW1lc1tpbmRleF0udmFsdWUgPT0gJycgfHwgaXRlbVRpbWVzW2luZGV4XS52YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgb3B0cy5pc19lcnJvciA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWdlbmRhSXRlbXMuYWdlbmRhW2luZGV4XSA9IHsgbmFtZSA6IGl0ZW1OYW1lc1tpbmRleF0udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUgOiBpdGVtVGltZXNbaW5kZXhdLnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgIH1cbiAgICB0aGlzLmFnZW5kYUl0ZW1zLm5hbWUgPSB0ZW1wbGF0ZU5hbWU7XG4gICAgVGltZUJveGVyLnVwZGF0ZVRlbXBsYXRlKHRoaXMuYWdlbmRhSXRlbXMsIG9wdHMudGVtcGxhdGVJZCk7XG4gICAgcmlvdC5yb3V0ZSgnIycpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFnZW5kYUl0ZW1zID0gdGhpcy5zdG9yZS5nZXRCeUluZGV4KG9wdHMudGVtcGxhdGVJZCk7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWdlbmRhSXRlbXMgPSB0aGlzLnN0b3JlLmdldEJ5SW5kZXgob3B0cy50ZW1wbGF0ZUlkKSB8fCB7fTtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9KTtcblxuICBmbHV4X3Jpb3Quc3RvcmVNaXhpbih0aGlzLCBvcHRzLnN0b3JlLCB0aGlzLnVwZGF0ZUZyb21TdG9yZSk7XG5cblxufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG52YXIgdGltZWJveGVyID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy90aW1lYm94ZXIuanMnKVxudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpXG5cbnZhciBTZXJ2ZXJBcGlVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL1NlcnZlckFwaVV0aWxzLmpzJyk7XG5TZXJ2ZXJBcGlVdGlscy5nZXRBbGwoKTtcblxucmlvdC50YWcoJ3RpbWVib3hlci10ZW1wbGF0ZS1pbmRleCcsICc8aDM+eyBvcHRzLnRpdGxlIH08L2gzPiA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ob3ZlclwiPiA8dHI+IDx0aD5UZW1wbGF0ZTwvdGg+IDx0aD5BY3Rpb25zPC90aD4gPC90cj4gPHRyIGVhY2g9XCJ7IGl0ZW0gaW4gdGhpcy5pdGVtcyB9XCI+IDx0ZD48aDQ+eyBpdGVtLm5hbWUgfTwvaDQ+PC90ZD4gPHRkPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IHBhcmVudC5zdGFydE1lZXRpbmcgfVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi10aW1lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBTdGFydCBhIE1lZXRpbmcgPC9hPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IHBhcmVudC5lZGl0TWVldGluZyB9XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IEVkaXQgPC9hPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IHBhcmVudC5yZW1vdmVNZWV0aW5nIH1cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPiA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2hcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFJlbW92ZSA8L2E+IDwvdGQ+IDwvdHI+IDwvdGFibGU+IDxhIGhyZWY9XCIjXCIgb25jbGljaz1cInsgYWRkIH1cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPiA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1cy1zaWduXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBBZGQgTmV3IFRlbXBsYXRlIDwvYT4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgdGhpcy5hZGQgPSBmdW5jdGlvbigpIHtcbiAgICByaW90LnJvdXRlKCd0ZW1wbGF0ZXMvYWRkJylcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuZ2V0RGF0YUZyb21TdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLnN0b3JlLmdldEFsbCgpXG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnVwZGF0ZUZyb21TdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2V0RGF0YUZyb21TdG9yZSgpXG4gICAgdGhpcy51cGRhdGUoKVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5zdGFydE1lZXRpbmcgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihldmVudC5pdGVtLml0ZW0pO1xuICAgIHJpb3Qucm91dGUoJ21lZXRpbmcvc3RhcnQvJyArIGluZGV4KTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuZWRpdE1lZXRpbmcgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihldmVudC5pdGVtLml0ZW0pO1xuICAgIHJpb3Qucm91dGUoJ3RlbXBsYXRlcy9lZGl0LycgKyBpbmRleCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnJlbW92ZU1lZXRpbmcgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihldmVudC5pdGVtLml0ZW0pO1xuICAgIHRpbWVib3hlci5yZW1vdmVUZW1wbGF0ZShpbmRleCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICBmbHV4X3Jpb3Quc3RvcmVNaXhpbih0aGlzLCBvcHRzLnN0b3JlLCB0aGlzLnVwZGF0ZUZyb21TdG9yZSlcblxuICB0aGlzLmdldERhdGFGcm9tU3RvcmUoKVxuXG5cbn0pO1xuIiwidmFyIGtleW1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQWN0aW9uVHlwZXM6IGtleW1pcnJvcih7XG4gICAgVEVNUExBVEVfU0FWRTogbnVsbCxcbiAgICBURU1QTEFURV9SRU1PVkU6IG51bGwsXG4gICAgVEVNUExBVEVfVVBEQVRFOiBudWxsLFxuXG4gICAgU0VSVkVSX0ZFVENIX0NPTVBMRVRFOiBudWxsXG4gIH0pXG59O1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90L3Jpb3QnKTtcbnZhciB0aW1lYm94ZXJfdGVtcGxhdGVfc3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlLmpzJyk7XG5cbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaW5kZXgudGFnJyk7XG5yZXF1aXJlKCcuLi9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9hZGQudGFnJyk7XG5yZXF1aXJlKCcuLi9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9lZGl0LnRhZycpO1xucmVxdWlyZSgnLi4vY29tcG9uZW50cy90aW1lYm94ZXJfbWVldGluZy9zdGFydC50YWcnKTtcblxucmVxdWlyZSgnLi4vY29tcG9uZW50cy9jb250YWN0LnRhZycpO1xucmVxdWlyZSgnLi4vY29tcG9uZW50cy9hYm91dC50YWcnKTtcblxudmFyIGFwcF90YWcgPSBudWxsO1xuXG52YXIgdW5tb3VudCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoYXBwX3RhZykge1xuICAgIHJldHVybiBhcHBfdGFnLnVubW91bnQoKTtcbiAgfVxufTtcblxudmFyIG1vdW50ID0gZnVuY3Rpb24odGFnLCBvcHRzKSB7XG4gIHZhciBhcHBfY29udGFpbmVyO1xuICBhcHBfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgYXBwX2NvbnRhaW5lci5pZCA9ICdhcHAtY29udGFpbmVyJztcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpLmFwcGVuZENoaWxkKGFwcF9jb250YWluZXIpO1xuICByZXR1cm4gcmlvdC5tb3VudCgnI2FwcC1jb250YWluZXInLCB0YWcsIG9wdHMpWzBdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluZGV4OiBmdW5jdGlvbigpIHtcbiAgICB1bm1vdW50KCk7XG4gICAgcmV0dXJuIGFwcF90YWcgPSBtb3VudCgndGltZWJveGVyLWluZGV4Jywge1xuICAgICAgdGl0bGU6IFwiVGVtcGxhdGVzXCIsXG4gICAgICBzdG9yZTogdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlXG4gICAgfSk7XG4gIH0sXG5cbiAgdGVtcGxhdGVfYWRkOiBmdW5jdGlvbigpIHtcbiAgICB1bm1vdW50KCk7XG5cbiAgICByZXR1cm4gYXBwX3RhZyA9IG1vdW50KCd0aW1lYm94ZXItdGVtcGxhdGUtYWRkJywge1xuICAgICAgdGl0bGU6IFwiQWRkIFRpbWVib3hlciBFdmVudCBUZW1wbGF0ZVwiLFxuICAgICAgc3RvcmU6IHRpbWVib3hlcl90ZW1wbGF0ZV9zdG9yZVxuICAgIH0pO1xuICB9LFxuXG4gIHRlbXBsYXRlX2VkaXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgdW5tb3VudCgpO1xuICAgIHJldHVybiBhcHBfdGFnID0gbW91bnQoJ3RpbWVib3hlci10ZW1wbGF0ZS1lZGl0Jywge1xuICAgICAgdGl0bGU6IFwiRWRpdCBUaW1lYm94ZXIgRXZlbnQgVGVtcGxhdGVcIixcbiAgICAgIHRlbXBsYXRlSWQ6IGlkLFxuICAgICAgc3RvcmU6IHRpbWVib3hlcl90ZW1wbGF0ZV9zdG9yZVxuICAgIH0pO1xuICB9LFxuXG4gIG1lZXRpbmdfc3RhcnQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgdW5tb3VudCgpO1xuICAgIHJldHVybiBhcHBfdGFnID0gbW91bnQoJ3RpbWVib3hlci1tZWV0aW5nLXN0YXJ0Jywge1xuICAgICAgdGl0bGU6IFwiU3RhcnQgYSBNZWV0aW5nXCIsXG4gICAgICB0ZW1wbGF0ZUlkOiBpZCxcbiAgICAgIHRlbXBsYXRlX3N0b3JlOiB0aW1lYm94ZXJfdGVtcGxhdGVfc3RvcmVcbiAgICB9KTtcbiAgfSxcblxuICBhYm91dDogZnVuY3Rpb24oKSB7XG4gICAgdW5tb3VudCgpO1xuICAgIHJldHVybiBhcHBfdGFnID0gbW91bnQoJ3RpbWVib3hlci1hYm91dCcsIHtcbiAgICAgIHRpdGxlOiBcIkFib3V0IFVzXCJcbiAgICB9KTtcbiAgfSxcblxuICBjb250YWN0OiBmdW5jdGlvbigpIHtcbiAgICB1bm1vdW50KCk7XG4gICAgcmV0dXJuIGFwcF90YWcgPSBtb3VudCgndGltZWJveGVyLWNvbnRhY3QnLCB7XG4gICAgICB0aXRsZTogXCJDb250YWN0IFVzXCJcbiAgICB9KTtcbiAgfVxufTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdC9yaW90Jyk7XG52YXIgQmFzZVJvdXRlciA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpLkJhc2VSb3V0ZXI7XG52YXIgdGltZWJveGVyX3ByZXNlbnRlciA9IHJlcXVpcmUoJy4uL3ByZXNlbnRlcnMvdGltZWJveGVyX3ByZXNlbnRlci5qcycpO1xuXG5CYXNlUm91dGVyLnJvdXRlcyh0aW1lYm94ZXJfcHJlc2VudGVyLmluZGV4LFxuICAndGVtcGxhdGVzL2FkZCcsIHRpbWVib3hlcl9wcmVzZW50ZXIudGVtcGxhdGVfYWRkLFxuICAndGVtcGxhdGVzL2VkaXQvOmlkJywgdGltZWJveGVyX3ByZXNlbnRlci50ZW1wbGF0ZV9lZGl0LFxuICAnbWVldGluZy9zdGFydC86aWQnLCB0aW1lYm94ZXJfcHJlc2VudGVyLm1lZXRpbmdfc3RhcnQsXG4gICdhYm91dCcsIHRpbWVib3hlcl9wcmVzZW50ZXIuYWJvdXQsXG4gICdjb250YWN0JywgdGltZWJveGVyX3ByZXNlbnRlci5jb250YWN0XG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3RhcnQ6IEJhc2VSb3V0ZXIuc3RhcnRcbn07XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4LXJpb3QnKS5EaXNwYXRjaGVyO1xudmFyIEFjdGlvblR5cGVzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL3RpbWVib3hlcl9jb25zdGFudHMuanMnKS5BY3Rpb25UeXBlcztcbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKTtcbnZhciBzZXJ2ZXJVdGlsID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VydmVyQXBpVXRpbHMuanMnKTtcblxudmFyIF90ZW1wbGF0ZXMgPSBbXTtcblxudmFyIGdldFRlbXBsYXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIF90ZW1wbGF0ZXM7XG59O1xudmFyIGFkZFRlbXBsYXRlcyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIF90ZW1wbGF0ZXMucHVzaChkYXRhKTtcbn07XG52YXIgc2F2ZVRlbXBsYXRlcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgX3RlbXBsYXRlcyA9IG9iajtcbn07XG52YXIgcmVtb3ZlVGVtcGxhdGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgX3RlbXBsYXRlcy5zcGxpY2UoaW5kZXgsIDEpO1xufTtcbnZhciB1cGRhdGVUZW1wbGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgX3RlbXBsYXRlc1tvYmouaW5kZXhdID0gb2JqLnRhc2s7XG59O1xuXG5UaW1lYm94ZXJUZW1wbGF0ZVN0b3JlID0gYXNzaWduKG5ldyBmbHV4X3Jpb3QuQmFzZVN0b3JlKCksIHtcbiAgZ2V0QWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdldFRlbXBsYXRlcygpO1xuICB9LFxuICBzYXZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcbiAgZ2V0QnlJbmRleDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgcmV0dXJuIF90ZW1wbGF0ZXNbaW5kZXhdO1xuICB9LFxuICBkaXNwYXRjaFRva2VuOiBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICB2YXIgYWN0aW9uLCBkYXRhLCBpbmRleCwgdGFzaztcbiAgICBhY3Rpb24gPSBwYXlsb2FkLmFjdGlvbjtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICBjYXNlIEFjdGlvblR5cGVzLlNFUlZFUl9GRVRDSF9DT01QTEVURTpcbiAgICAgICAgc2F2ZVRlbXBsYXRlcyhhY3Rpb24uZGF0YSk7XG4gICAgICAgIFRpbWVib3hlclRlbXBsYXRlU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEFjdGlvblR5cGVzLlRFTVBMQVRFX1NBVkU6XG4gICAgICAgIGFkZFRlbXBsYXRlcyhhY3Rpb24uZGF0YSk7XG4gICAgICAgIHNlcnZlclV0aWwuc2F2ZVRlbXBsYXRlKGFjdGlvbi5kYXRhKTtcbiAgICAgICAgVGltZWJveGVyVGVtcGxhdGVTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgQWN0aW9uVHlwZXMuVEVNUExBVEVfVVBEQVRFOlxuICAgICAgICB1cGRhdGVUZW1wbGF0ZShhY3Rpb24uZGF0YSk7XG4gICAgICAgIHNlcnZlclV0aWwudXBkYXRlVGVtcGxhdGUoYWN0aW9uLmRhdGEudGFzayk7XG4gICAgICAgIGNvbnNvbGUubG9nKGFjdGlvbi5kYXRhKTtcbiAgICAgICAgVGltZWJveGVyVGVtcGxhdGVTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgQWN0aW9uVHlwZXMuVEVNUExBVEVfUkVNT1ZFOlxuICAgICAgICBzZXJ2ZXJVdGlsLmRlc3Ryb3lUZW1wbGF0ZShfdGVtcGxhdGVzW2FjdGlvbi5kYXRhXSk7XG4gICAgICAgIHJlbW92ZVRlbXBsYXRlKGFjdGlvbi5kYXRhKTtcbiAgICAgICAgVGltZWJveGVyVGVtcGxhdGVTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH0pXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lYm94ZXJUZW1wbGF0ZVN0b3JlO1xuIiwidmFyIFBhcnNlID0gcmVxdWlyZSgncGFyc2UnKS5QYXJzZTtcbnZhciBUaW1lQm94ZXIgPSByZXF1aXJlKCcuLi9hY3Rpb25zL3RpbWVib3hlci5qcycpO1xudmFyIHN0b3JhZ2UgPSByZXF1aXJlKCcuL2xvY2FsU3RvcmFnZS5qcycpO1xuXG5mdW5jdGlvbiBTZXJ2ZXJBcGlVdGlscygpIHtcbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgUGFyc2UuaW5pdGlhbGl6ZShcIlBFZFZUcEVuSHhoandYSE1qa1N0U2xBTVU3NXhxN1RLeE11dDYwQkRcIixcbiAgICAgIFwidmhieDl3VFFNd00wODIxTmd6TXMweHEyU3hITXpCYllkWk1aV2cxeFwiKTtcbiAgICB0aGlzLmJveGVyQ2xhc3MgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiSGFja2RheTJcIik7XG4gICAgdGhpcy5xdWVyeSA9IG5ldyBQYXJzZS5RdWVyeSh0aGlzLmJveGVyQ2xhc3MpO1xuICAgIHRoaXMuYm94ZXJPYmogPSBuZXcgdGhpcy5ib3hlckNsYXNzKCk7XG4gIH07XG4gIHRoaXMuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYm94ZXJPYmouZmV0Y2goe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRzKTtcbiAgICAgICAgVGltZUJveGVyLnNlcnZlckRhdGFSZWNlaXZlZChyZXN1bHRzLnRvSlNPTigpLnJlc3VsdHMpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBhbGVydChcIkVycm9yOiBcIiArIGVycm9yLmNvZGUgKyBcIiBcIiArIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICB0aGlzLnNhdmVUZW1wbGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5ib3hlck9iai5zYXZlKGRhdGEpO1xuICB9O1xuICB0aGlzLnVwZGF0ZVRlbXBsYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnF1ZXJ5LmdldChkYXRhLm9iamVjdElkLCB7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5zZXQoJ2FnZW5kYScsIGRhdGEuYWdlbmRhKTtcbiAgICAgICAgcmVzdWx0LnNldCgnbmFtZScsIGRhdGEubmFtZSk7XG4gICAgICAgIHJlc3VsdC5zYXZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHRoaXMuZGVzdHJveVRlbXBsYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnF1ZXJ5LmdldChkYXRhLm9iamVjdElkLCB7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5kZXN0cm95KHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveWVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KVxuICB9O1xuICB0aGlzLmluaXQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNlcnZlckFwaVV0aWxzKCk7XG4iLCJmdW5jdGlvbiBTdG9yYWdlICgpIHtcblxuICB0aGlzLmRhdGFTdG9yZSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgaWYgKCFsb2NhbFN0b3JhZ2Uuc3ByaW50VGFzaykge1xuICAgICAgbG9jYWxTdG9yYWdlLnNwcmludFRhc2sgPSAnW10nO1xuICAgIH1cbiAgICB0aGlzLmRhdGFTdG9yZSA9IGdldEZyb21Mb2NhbFN0b3JhZ2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJldHJpZXZlICgpIHtcbiAgICByZXR1cm4gZ2V0RnJvbUxvY2FsU3RvcmFnZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2F2ZSAoZGF0YSkge1xuICAgIHNhdmVUb0xvY2FsU3RvcmFnZShkYXRhKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZSAoaW5kZXgpIHtcbiAgICB0aGlzLmRhdGFTdG9yZVtpbmRleF0gPSB7fTtcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UodGhpcy5kYXRhU3RvcmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2F2ZVRvTG9jYWxTdG9yYWdlIChkYXRhKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNwcmludFRhc2sgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZyb21Mb2NhbFN0b3JhZ2UgKCkge1xuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2Uuc3ByaW50VGFzayk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldCAoKSB7XG4gICAgZGVsZXRlIGxvY2FsU3RvcmFnZS5zcHJpbnRUYXNrO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgdGhpcy5pbml0ID0gaW5pdDtcbiAgdGhpcy5yZXRyaWV2ZSA9IHJldHJpZXZlO1xuICB0aGlzLnNhdmUgPSBzYXZlO1xuICB0aGlzLnJlbW92ZSA9IHJlbW92ZTtcbiAgdGhpcy5yZXNldCA9IHJlc2V0O1xuXG4gIHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZSA9IGdldEZyb21Mb2NhbFN0b3JhZ2U7XG4gIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlID0gc2F2ZVRvTG9jYWxTdG9yYWdlO1xufVxudmFyIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuc3RvcmFnZS5pbml0KCk7XG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JhZ2U7XG4iXX0=
