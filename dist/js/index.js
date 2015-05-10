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

riot.tag('timer-list', '<li class="list-group-item" > <input type="text" value="{agenda.name}" name="itemName"> <span> For </span> <input type="text" value="{agenda.time}" name="itemTime"> <span> Minutes </span> <span onclick="{moveUp}" data-index="{index}" class="glyphicon glyphicon-arrow-up"></span> <span onclick="{moveDown}" data-index="{index}" class="glyphicon glyphicon-arrow-down"></span> </li>', function(opts) {

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

});

riot.tag('timeboxer-template-edit', '<p if="{opts.is_error}"> Fill up all the values </p> {opts.title} <form onsubmit="{updateAgenda}"> <div class="form-group"> <input type="text" class="form-control" id="templateName" value="{agendaItems.name}"> </div> <div class="form-group"> <label>Agenda</label> <ul class="list-group"> <timer-list each="{agenda, index in agendaItems.agenda}" data="agenda"></ul> </li> </ul> </div> <button class="btn btn-default" onclick="{addNewRow}">New Item</button> <button type="submit" class="btn btn-default">Update</button> </form>', function(opts) {

  this.addNewRow = function() {
    var agenda = {
      name: '',
      time: ''
    };
    this.agendaItems.agenda.push(agenda);
    this.update();
  }.bind(this);

  this.updateAgenda = function() {

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
        result.save();
        console.log(result);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3VyaWFuL1NpdGVzL1ByaXZhdGUvdGltZWJveGVyL3NyYy9qcy9pbmRleC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgtcmlvdC9mbHV4LXJpb3QuanMiLCJub2RlX21vZHVsZXMvZmx1eC1yaW90L25vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgtcmlvdC9ub2RlX21vZHVsZXMvZmx1eC9saWIvRGlzcGF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4LXJpb3Qvbm9kZV9tb2R1bGVzL2ZsdXgvbGliL2ludmFyaWFudC5qcyIsIm5vZGVfbW9kdWxlcy9rZXltaXJyb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS9idWlsZC9wYXJzZS1sYXRlc3QuanMiLCJub2RlX21vZHVsZXMvcmlvdC9yaW90LmpzIiwic3JjL2pzL2FjdGlvbnMvdGltZWJveGVyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWJvdXQudGFnIiwic3JjL2pzL2NvbXBvbmVudHMvY29udGFjdC50YWciLCJzcmMvanMvY29tcG9uZW50cy9pbmRleC50YWciLCJzcmMvanMvY29tcG9uZW50cy90aW1lYm94ZXJfbWVldGluZy9zdGFydC50YWciLCJzcmMvanMvY29tcG9uZW50cy90aW1lYm94ZXJfdGVtcGxhdGUvYWRkLnRhZyIsInNyYy9qcy9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9lZGl0LnRhZyIsInNyYy9qcy9jb21wb25lbnRzL3RpbWVib3hlcl90ZW1wbGF0ZS9pbmRleC50YWciLCJzcmMvanMvY29uc3RhbnRzL3RpbWVib3hlcl9jb25zdGFudHMuanMiLCJzcmMvanMvcHJlc2VudGVycy90aW1lYm94ZXJfcHJlc2VudGVyLmpzIiwic3JjL2pzL3JvdXRlcnMvdGltZWJveGVyX3JvdXRlcy5qcyIsInNyYy9qcy9zdG9yZXMvdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlLmpzIiwic3JjL2pzL3V0aWxzL1NlcnZlckFwaVV0aWxzLmpzIiwic3JjL2pzL3V0aWxzL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsZ0JBQUE7O0FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFTLCtCQUFULENBQW5CLENBQUE7O0FBQUEsZ0JBQ2dCLENBQUMsS0FBakIsQ0FBQSxDQURBLENBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidGltZWJveGVyX3JvdXRlcyA9IHJlcXVpcmUgJy4vcm91dGVycy90aW1lYm94ZXJfcm91dGVzLmpzJ1xudGltZWJveGVyX3JvdXRlcy5zdGFydCgpXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiOyhmdW5jdGlvbigpIHtcblxudmFyIHJpb3QgPSByZXF1aXJlKCdyaW90L3Jpb3QnKVxudmFyIGZsdXhfcmlvdCA9IHsgdmVyc2lvbjogJzAuMi4wJyB9XG5cbid1c2Ugc3RyaWN0J1xuXG5mbHV4X3Jpb3QuQmFzZVN0b3JlID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBDSEFOR0VfRVZFTlQgPSAnU1RPUkVfQ0hBTkdFX0VWRU5UJ1xuXG4gIGZ1bmN0aW9uIEJhc2VTdG9yZSgpIHtcbiAgICByaW90Lm9ic2VydmFibGUodGhpcylcbiAgfVxuXG4gIEJhc2VTdG9yZS5wcm90b3R5cGUgPSB7XG4gICAgYWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9uKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spXG4gICAgfSxcblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgdGhpcy5vZmYoQ0hBTkdFX0VWRU5ULCBjYWxsYmFjaylcbiAgICB9LFxuXG4gICAgZW1pdENoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoQ0hBTkdFX0VWRU5UKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBCYXNlU3RvcmVcblxufSkoKVxuXG5mbHV4X3Jpb3Quc3RvcmVNaXhpbiA9IGZ1bmN0aW9uKHRhZywgc3RvcmUsIGNhbGxiYWNrKSB7XG5cbiAgdGFnLnN0b3JlID0gc3RvcmVcblxuICB0YWcub24oJ21vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKVxuICB9KVxuXG4gIHRhZy5vbigndW5tb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaylcbiAgfSlcblxufVxuXG5mbHV4X3Jpb3QuQmFzZVJvdXRlciA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgcmVnZXhGdW5jcyA9IFtdXG5cbiAgZnVuY3Rpb24gcmVnZXhUcmFuc2ZlcihwYXRoKSB7XG4gICAgdmFyIHBhcnRzID0gcGF0aC5zcGxpdCgnLycpXG4gICAgdmFyIHJlZ2V4UGFydHMgPSBbXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYXJ0ID0gcGFydHNbaV1cbiAgICAgIGlmICghKHBhcnQgJiYgcGFydC5sZW5ndGggPiAwKSkgY29udGludWVcblxuICAgICAgaWYgKHBhcnRbMF0gPT09ICc6Jykge1xuICAgICAgICByZWdleFBhcnRzLnB1c2goJygoPzooPyFcXFxcLykuKSs/KScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdleFBhcnRzLnB1c2gocGFydClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFJlZ0V4cChcIl5cIiArIChyZWdleFBhcnRzLmpvaW4oJ1xcXFwvJykpICsgXCJcXFxcLz8kXCIsIFwiaVwiKVxuICB9XG5cbiAgZnVuY3Rpb24gcm91dGUocGF0aCkge1xuICAgIGlmIChyZWdleEZ1bmNzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICBpZiAocGF0aCA9PT0gJycpIHJldHVybiByZWdleEZ1bmNzWzBdWzFdLmFwcGx5KG51bGwsIFtdKVxuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCByZWdleEZ1bmNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmVnZXhGdW5jID0gcmVnZXhGdW5jc1tpXVxuICAgICAgdmFyIG0gPSBwYXRoLm1hdGNoKHJlZ2V4RnVuY1swXSlcbiAgICAgIGlmIChtICE9IG51bGwpIHJldHVybiByZWdleEZ1bmNbMV0uYXBwbHkobnVsbCwgbS5zbGljZSgxKSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByb3V0ZXMoKSB7XG4gICAgaWYgKCEoYXJndW1lbnRzLmxlbmd0aCA+IDApKSByZXR1cm5cblxuICAgIHJlZ2V4RnVuY3MucHVzaChbICcnLCBhcmd1bWVudHNbMF0gXSlcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgcmVnZXggPSByZWdleFRyYW5zZmVyKGFyZ3VtZW50c1tpXSlcbiAgICAgIHJlZ2V4RnVuY3MucHVzaChbIHJlZ2V4LCBhcmd1bWVudHNbaSArIDFdIF0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnQocikge1xuICAgIHJldHVybiByaW90LnJvdXRlLmV4ZWMociB8fCByb3V0ZSlcbiAgfVxuXG4gIHJpb3Qucm91dGUucGFyc2VyKGZ1bmN0aW9uKHBhdGgpIHsgcmV0dXJuIFtwYXRoXSB9KVxuICByaW90LnJvdXRlKHJvdXRlKVxuXG4gIHJldHVybiB7XG4gICAgcm91dGVzOiByb3V0ZXMsXG4gICAgc3RhcnQ6IHN0YXJ0XG4gIH1cblxufSkoKVxuXG5mbHV4X3Jpb3QuQ29uc3RhbnRzID0ge1xuICBBY3Rpb25Tb3VyY2VzOiB7XG4gICAgU0VSVkVSX0FDVElPTjogJ1NFUlZFUl9BQ1RJT04nLFxuICAgIFZJRVdfQUNUSU9OOiAnVklFV19BQ1RJT04nXG4gIH1cbn1cblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlclxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG5mbHV4X3Jpb3QuRGlzcGF0Y2hlciA9IGFzc2lnbihuZXcgRGlzcGF0Y2hlcigpLCB7XG4gIGhhbmRsZVNlcnZlckFjdGlvbjogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlQWN0aW9uKGFjdGlvbiwgZmx1eF9yaW90LkNvbnN0YW50cy5BY3Rpb25Tb3VyY2VzLlNFUlZFUl9BQ1RJT04pXG4gIH0sXG5cbiAgaGFuZGxlVmlld0FjdGlvbjogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlQWN0aW9uKGFjdGlvbiwgZmx1eF9yaW90LkNvbnN0YW50cy5BY3Rpb25Tb3VyY2VzLlZJRVdfQUNUSU9OKVxuICB9LFxuXG4gIGhhbmRsZUFjdGlvbjogZnVuY3Rpb24oYWN0aW9uLCBzb3VyY2UpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaCh7XG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgfSlcbiAgfVxufSlcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsdXhfcmlvdFxuXG59KSgpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5EaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWIvRGlzcGF0Y2hlcicpXG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIERpc3BhdGNoZXJcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG52YXIgX2xhc3RJRCA9IDE7XG52YXIgX3ByZWZpeCA9ICdJRF8nO1xuXG4vKipcbiAqIERpc3BhdGNoZXIgaXMgdXNlZCB0byBicm9hZGNhc3QgcGF5bG9hZHMgdG8gcmVnaXN0ZXJlZCBjYWxsYmFja3MuIFRoaXMgaXNcbiAqIGRpZmZlcmVudCBmcm9tIGdlbmVyaWMgcHViLXN1YiBzeXN0ZW1zIGluIHR3byB3YXlzOlxuICpcbiAqICAgMSkgQ2FsbGJhY2tzIGFyZSBub3Qgc3Vic2NyaWJlZCB0byBwYXJ0aWN1bGFyIGV2ZW50cy4gRXZlcnkgcGF5bG9hZCBpc1xuICogICAgICBkaXNwYXRjaGVkIHRvIGV2ZXJ5IHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gKiAgIDIpIENhbGxiYWNrcyBjYW4gYmUgZGVmZXJyZWQgaW4gd2hvbGUgb3IgcGFydCB1bnRpbCBvdGhlciBjYWxsYmFja3MgaGF2ZVxuICogICAgICBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGlzIGh5cG90aGV0aWNhbCBmbGlnaHQgZGVzdGluYXRpb24gZm9ybSwgd2hpY2hcbiAqIHNlbGVjdHMgYSBkZWZhdWx0IGNpdHkgd2hlbiBhIGNvdW50cnkgaXMgc2VsZWN0ZWQ6XG4gKlxuICogICB2YXIgZmxpZ2h0RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjb3VudHJ5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDb3VudHJ5U3RvcmUgPSB7Y291bnRyeTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjaXR5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDaXR5U3RvcmUgPSB7Y2l0eTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgYmFzZSBmbGlnaHQgcHJpY2Ugb2YgdGhlIHNlbGVjdGVkIGNpdHlcbiAqICAgdmFyIEZsaWdodFByaWNlU3RvcmUgPSB7cHJpY2U6IG51bGx9XG4gKlxuICogV2hlbiBhIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0ZWQgY2l0eSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY2l0eS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ2l0eTogJ3BhcmlzJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYENpdHlTdG9yZWA6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY2l0eS11cGRhdGUnKSB7XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IHBheWxvYWQuc2VsZWN0ZWRDaXR5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgY291bnRyeSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY291bnRyeS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ291bnRyeTogJ2F1c3RyYWxpYSdcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGJvdGggc3RvcmVzOlxuICpcbiAqICAgIENvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgQ291bnRyeVN0b3JlLmNvdW50cnkgPSBwYXlsb2FkLnNlbGVjdGVkQ291bnRyeTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIGNhbGxiYWNrIHRvIHVwZGF0ZSBgQ291bnRyeVN0b3JlYCBpcyByZWdpc3RlcmVkLCB3ZSBzYXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGUgcmV0dXJuZWQgdG9rZW4uIFVzaW5nIHRoaXMgdG9rZW4gd2l0aCBgd2FpdEZvcigpYCwgd2UgY2FuIGd1YXJhbnRlZVxuICogdGhhdCBgQ291bnRyeVN0b3JlYCBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2sgdGhhdCB1cGRhdGVzIGBDaXR5U3RvcmVgXG4gKiBuZWVkcyB0byBxdWVyeSBpdHMgZGF0YS5cbiAqXG4gKiAgIENpdHlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBtYXkgbm90IGJlIHVwZGF0ZWQuXG4gKiAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIGlzIG5vdyBndWFyYW50ZWVkIHRvIGJlIHVwZGF0ZWQuXG4gKlxuICogICAgICAgLy8gU2VsZWN0IHRoZSBkZWZhdWx0IGNpdHkgZm9yIHRoZSBuZXcgY291bnRyeVxuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBnZXREZWZhdWx0Q2l0eUZvckNvdW50cnkoQ291bnRyeVN0b3JlLmNvdW50cnkpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIHVzYWdlIG9mIGB3YWl0Rm9yKClgIGNhbiBiZSBjaGFpbmVkLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIEZsaWdodFByaWNlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9XG4gKiAgICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhbiBlbnVtZXJhdGlvbiB3aXRoIGtleXMgZXF1YWwgdG8gdGhlaXIgdmFsdWUuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB2YXIgQ09MT1JTID0ga2V5TWlycm9yKHtibHVlOiBudWxsLCByZWQ6IG51bGx9KTtcbiAqICAgdmFyIG15Q29sb3IgPSBDT0xPUlMuYmx1ZTtcbiAqICAgdmFyIGlzQ29sb3JWYWxpZCA9ICEhQ09MT1JTW215Q29sb3JdO1xuICpcbiAqIFRoZSBsYXN0IGxpbmUgY291bGQgbm90IGJlIHBlcmZvcm1lZCBpZiB0aGUgdmFsdWVzIG9mIHRoZSBnZW5lcmF0ZWQgZW51bSB3ZXJlXG4gKiBub3QgZXF1YWwgdG8gdGhlaXIga2V5cy5cbiAqXG4gKiAgIElucHV0OiAge2tleTE6IHZhbDEsIGtleTI6IHZhbDJ9XG4gKiAgIE91dHB1dDoge2tleTE6IGtleTEsIGtleTI6IGtleTJ9XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG52YXIga2V5TWlycm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgdmFyIGtleTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gIH1cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gVG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIvKiFcbiAqIFBhcnNlIEphdmFTY3JpcHQgU0RLXG4gKiBWZXJzaW9uOiAxLjQuMlxuICogQnVpbHQ6IFRodSBBcHIgMDkgMjAxNSAxNzoyMDozMVxuICogaHR0cDovL3BhcnNlLmNvbVxuICpcbiAqIENvcHlyaWdodCAyMDE1IFBhcnNlLCBJbmMuXG4gKiBUaGUgUGFyc2UgSmF2YVNjcmlwdCBTREsgaXMgZnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICpcbiAqIEluY2x1ZGVzOiBVbmRlcnNjb3JlLmpzXG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEyIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBJbmMuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICByb290LlBhcnNlLlZFUlNJT04gPSBcImpzMS40LjJcIjtcbn0odGhpcykpO1xuLy8gICAgIFVuZGVyc2NvcmUuanMgMS40LjRcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIEluYy5cbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGdsb2JhbGAgb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gRXN0YWJsaXNoIHRoZSBvYmplY3QgdGhhdCBnZXRzIHJldHVybmVkIHRvIGJyZWFrIG91dCBvZiBhIGxvb3AgaXRlcmF0aW9uLlxuICB2YXIgYnJlYWtlciA9IHt9O1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIGNvbmNhdCAgICAgICAgICAgPSBBcnJheVByb3RvLmNvbmNhdCxcbiAgICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUZvckVhY2ggICAgICA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbiAgICBuYXRpdmVNYXAgICAgICAgICAgPSBBcnJheVByb3RvLm1hcCxcbiAgICBuYXRpdmVSZWR1Y2UgICAgICAgPSBBcnJheVByb3RvLnJlZHVjZSxcbiAgICBuYXRpdmVSZWR1Y2VSaWdodCAgPSBBcnJheVByb3RvLnJlZHVjZVJpZ2h0LFxuICAgIG5hdGl2ZUZpbHRlciAgICAgICA9IEFycmF5UHJvdG8uZmlsdGVyLFxuICAgIG5hdGl2ZUV2ZXJ5ICAgICAgICA9IEFycmF5UHJvdG8uZXZlcnksXG4gICAgbmF0aXZlU29tZSAgICAgICAgID0gQXJyYXlQcm90by5zb21lLFxuICAgIG5hdGl2ZUluZGV4T2YgICAgICA9IEFycmF5UHJvdG8uaW5kZXhPZixcbiAgICBuYXRpdmVMYXN0SW5kZXhPZiAgPSBBcnJheVByb3RvLmxhc3RJbmRleE9mLFxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQ7XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0IHZpYSBhIHN0cmluZyBpZGVudGlmaWVyLFxuICAvLyBmb3IgQ2xvc3VyZSBDb21waWxlciBcImFkdmFuY2VkXCIgbW9kZS5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS40LjQnO1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgb2JqZWN0cyB3aXRoIHRoZSBidWlsdC1pbiBgZm9yRWFjaGAsIGFycmF5cywgYW5kIHJhdyBvYmplY3RzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZm9yRWFjaGAgaWYgYXZhaWxhYmxlLlxuICB2YXIgZWFjaCA9IF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoXy5oYXMob2JqLCBrZXkpKSB7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleV0sIGtleSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0b3IgdG8gZWFjaCBlbGVtZW50LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbWFwYCBpZiBhdmFpbGFibGUuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHZhciByZWR1Y2VFcnJvciA9ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2UgJiYgb2JqLnJlZHVjZSA9PT0gbmF0aXZlUmVkdWNlKSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlKGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IHZhbHVlO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZVJpZ2h0YCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlUmlnaHQgJiYgb2JqLnJlZHVjZVJpZ2h0ID09PSBuYXRpdmVSZWR1Y2VSaWdodCkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvcik7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09ICtsZW5ndGgpIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaW5kZXggPSBrZXlzID8ga2V5c1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW2luZGV4XTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCBvYmpbaW5kZXhdLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgYW55KG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmaWx0ZXJgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuICFpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBldmVyeWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgfHwgKGl0ZXJhdG9yID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVFdmVyeSAmJiBvYmouZXZlcnkgPT09IG5hdGl2ZUV2ZXJ5KSByZXR1cm4gb2JqLmV2ZXJ5KGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIShyZXN1bHQgPSByZXN1bHQgJiYgaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgc29tZWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICB2YXIgYW55ID0gXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgfHwgKGl0ZXJhdG9yID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlU29tZSAmJiBvYmouc29tZSA9PT0gbmF0aXZlU29tZSkgcmV0dXJuIG9iai5zb21lKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocmVzdWx0IHx8IChyZXN1bHQgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiB2YWx1ZSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgdGFyZ2V0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgb2JqLmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBvYmouaW5kZXhPZih0YXJnZXQpICE9IC0xO1xuICAgIHJldHVybiBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSB0YXJnZXQ7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiAoaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXSkuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuIHZhbHVlW2tleV07IH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMsIGZpcnN0KSB7XG4gICAgaWYgKF8uaXNFbXB0eShhdHRycykpIHJldHVybiBmaXJzdCA/IG51bGwgOiBbXTtcbiAgICByZXR1cm4gX1tmaXJzdCA/ICdmaW5kJyA6ICdmaWx0ZXInXShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzW2tleV0gIT09IHZhbHVlW2tleV0pIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8ud2hlcmUob2JqLCBhdHRycywgdHJ1ZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICAvLyBDYW4ndCBvcHRpbWl6ZSBhcnJheXMgb2YgaW50ZWdlcnMgbG9uZ2VyIHRoYW4gNjUsNTM1IGVsZW1lbnRzLlxuICAvLyBTZWU6IGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD04MDc5N1xuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNFbXB0eShvYmopKSByZXR1cm4gLUluZmluaXR5O1xuICAgIHZhciByZXN1bHQgPSB7Y29tcHV0ZWQgOiAtSW5maW5pdHksIHZhbHVlOiAtSW5maW5pdHl9O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBjb21wdXRlZCA+PSByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiBJbmZpbml0eTtcbiAgICB2YXIgcmVzdWx0ID0ge2NvbXB1dGVkIDogSW5maW5pdHksIHZhbHVlOiBJbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkIDwgcmVzdWx0LmNvbXB1dGVkICYmIChyZXN1bHQgPSB7dmFsdWUgOiB2YWx1ZSwgY29tcHV0ZWQgOiBjb21wdXRlZH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhbiBhcnJheS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJhbmQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBbXTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbShpbmRleCsrKTtcbiAgICAgIHNodWZmbGVkW2luZGV4IC0gMV0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZSA6IGZ1bmN0aW9uKG9iail7IHJldHVybiBvYmpbdmFsdWVdOyB9O1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IodmFsdWUpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZSA6IHZhbHVlLFxuICAgICAgICBpbmRleCA6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYSA6IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IDwgcmlnaHQuaW5kZXggPyAtMSA6IDE7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCwgYmVoYXZpb3IpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IodmFsdWUgfHwgXy5pZGVudGl0eSk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgYmVoYXZpb3IocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgICAoXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0gOiAocmVzdWx0W2tleV0gPSBbXSkpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGdyb3VwKG9iaiwgdmFsdWUsIGNvbnRleHQsIGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgICBpZiAoIV8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0gPSAwO1xuICAgICAgcmVzdWx0W2tleV0rKztcbiAgICB9KTtcbiAgfTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBpdGVyYXRvciA9PSBudWxsID8gXy5pZGVudGl0eSA6IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4+IDE7XG4gICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W21pZF0pIDwgdmFsdWUgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBTYWZlbHkgY29udmVydCBhbnl0aGluZyBpdGVyYWJsZSBpbnRvIGEgcmVhbCwgbGl2ZSBhcnJheS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICByZXR1cm4gKG4gIT0gbnVsbCkgJiYgIWd1YXJkID8gc2xpY2UuY2FsbChhcnJheSwgMCwgbikgOiBhcnJheVswXTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoXG4gIC8vIGBfLm1hcGAuXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBhcnJheS5sZW5ndGggLSAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbikpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmICgobiAhPSBudWxsKSAmJiAhZ3VhcmQpIHtcbiAgICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBNYXRoLm1heChhcnJheS5sZW5ndGggLSBuLCAwKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKipcbiAgLy8gY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBvdXRwdXQpIHtcbiAgICBlYWNoKGlucHV0LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgc2hhbGxvdyA/IHB1c2guYXBwbHkob3V0cHV0LCB2YWx1ZSkgOiBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBvdXRwdXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29tcGxldGVseSBmbGF0dGVuZWQgdmVyc2lvbiBvZiBhbiBhcnJheS5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdG9yO1xuICAgICAgaXRlcmF0b3IgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHZhciBpbml0aWFsID0gaXRlcmF0b3IgPyBfLm1hcChhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIDogYXJyYXk7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGVhY2goaW5pdGlhbCwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBpZiAoaXNTb3J0ZWQgPyAoIWluZGV4IHx8IHNlZW5bc2Vlbi5sZW5ndGggLSAxXSAhPT0gdmFsdWUpIDogIV8uY29udGFpbnMoc2VlbiwgdmFsdWUpKSB7XG4gICAgICAgIHNlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgIHJlc3VsdHMucHVzaChhcnJheVtpbmRleF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihfLnVuaXEoYXJyYXkpLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gXy5ldmVyeShyZXN0LCBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKG90aGVyLCBpdGVtKSA+PSAwO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJncywgJ2xlbmd0aCcpKTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdHNbaV0gPSBfLnBsdWNrKGFyZ3MsIFwiXCIgKyBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIGlmIChsaXN0ID09IG51bGwpIHJldHVybiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcGx5IHVzIHdpdGggaW5kZXhPZiAoSSdtIGxvb2tpbmcgYXQgeW91LCAqKk1TSUUqKiksXG4gIC8vIHdlIG5lZWQgdGhpcyBmdW5jdGlvbi4gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhblxuICAvLyBpdGVtIGluIGFuIGFycmF5LCBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgaW5kZXhPZmAgaWYgYXZhaWxhYmxlLlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlzU29ydGVkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbCArIGlzU29ydGVkKSA6IGlzU29ydGVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtLCBpc1NvcnRlZCk7XG4gICAgZm9yICg7IGkgPCBsOyBpKyspIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBsYXN0SW5kZXhPZmAgaWYgYXZhaWxhYmxlLlxuICBfLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGZyb20pIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBoYXNJbmRleCA9IGZyb20gIT0gbnVsbDtcbiAgICBpZiAobmF0aXZlTGFzdEluZGV4T2YgJiYgYXJyYXkubGFzdEluZGV4T2YgPT09IG5hdGl2ZUxhc3RJbmRleE9mKSB7XG4gICAgICByZXR1cm4gaGFzSW5kZXggPyBhcnJheS5sYXN0SW5kZXhPZihpdGVtLCBmcm9tKSA6IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0pO1xuICAgIH1cbiAgICB2YXIgaSA9IChoYXNJbmRleCA/IGZyb20gOiBhcnJheS5sZW5ndGgpO1xuICAgIHdoaWxlIChpLS0pIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPD0gMSkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBhcmd1bWVudHNbMl0gfHwgMTtcblxuICAgIHZhciBsZW4gPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgdmFyIHJhbmdlID0gbmV3IEFycmF5KGxlbik7XG5cbiAgICB3aGlsZShpZHggPCBsZW4pIHtcbiAgICAgIHJhbmdlW2lkeCsrXSA9IHN0YXJ0O1xuICAgICAgc3RhcnQgKz0gc3RlcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAoZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kICYmIG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBCaW5kIGFsbCBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXRcbiAgLy8gYWxsIGNhbGxiYWNrcyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBmdW5jcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBpZiAoZnVuY3MubGVuZ3RoID09PSAwKSBmdW5jcyA9IF8uZnVuY3Rpb25zKG9iaik7XG4gICAgZWFjaChmdW5jcywgZnVuY3Rpb24oZikgeyBvYmpbZl0gPSBfLmJpbmQob2JqW2ZdLCBvYmopOyB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vID0ge307XG4gICAgaGFzaGVyIHx8IChoYXNoZXIgPSBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5ID0gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gXy5oYXMobWVtbywga2V5KSA/IG1lbW9ba2V5XSA6IChtZW1vW2tleV0gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7IH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBfLmRlbGF5LmFwcGx5KF8sIFtmdW5jLCAxXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCB0aW1lb3V0LCByZXN1bHQ7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gbmV3IERhdGU7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gbmV3IERhdGU7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCByZXN1bHQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH07XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIHJhbiA9IGZhbHNlLCBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHJldHVybiBtZW1vO1xuICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gW2Z1bmNdO1xuICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHdyYXBwZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZnVuY3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBmb3IgKHZhciBpID0gZnVuY3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXJncyA9IFtmdW5jc1tpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBhZnRlciBiZWluZyBjYWxsZWQgTiB0aW1lcy5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgaWYgKHRpbWVzIDw9IDApIHJldHVybiBmdW5jKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBuYXRpdmVLZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogIT09IE9iamVjdChvYmopKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9iamVjdCcpO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5c1trZXlzLmxlbmd0aF0gPSBrZXk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSB2YWx1ZXMucHVzaChvYmpba2V5XSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBwYWlycyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHBhaXJzLnB1c2goW2tleSwgb2JqW2tleV1dKTtcbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXN1bHRbb2JqW2tleV1dID0ga2V5O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGVhY2goa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoa2V5IGluIG9iaikgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFfLmNvbnRhaW5zKGtleXMsIGtleSkpIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT0gbnVsbCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBIYXJtb255IGBlZ2FsYCBwcm9wb3NhbDogaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxuICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXG4gICAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PSBiO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG4gICAgdmFyIHNpemUgPSAwLCByZXN1bHQgPSB0cnVlO1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChjbGFzc05hbWUgPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBzaXplID0gYS5sZW5ndGg7XG4gICAgICByZXN1bHQgPSBzaXplID09IGIubGVuZ3RoO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gZXEoYVtzaXplXSwgYltzaXplXSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgKGFDdG9yIGluc3RhbmNlb2YgYUN0b3IpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiAoYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKF8uaGFzKGEsIGtleSkpIHtcbiAgICAgICAgICAvLyBDb3VudCB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlci5cbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICBpZiAoXy5oYXMoYiwga2V5KSAmJiAhKHNpemUtLSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9ICFzaXplO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBlYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhIShvYmogJiYgXy5oYXMob2JqLCAnY2FsbGVlJykpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuXG4gIGlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZW50aXR5TWFwID0ge1xuICAgIGVzY2FwZToge1xuICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICAgJy8nOiAnJiN4MkY7J1xuICAgIH1cbiAgfTtcbiAgZW50aXR5TWFwLnVuZXNjYXBlID0gXy5pbnZlcnQoZW50aXR5TWFwLmVzY2FwZSk7XG5cbiAgLy8gUmVnZXhlcyBjb250YWluaW5nIHRoZSBrZXlzIGFuZCB2YWx1ZXMgbGlzdGVkIGltbWVkaWF0ZWx5IGFib3ZlLlxuICB2YXIgZW50aXR5UmVnZXhlcyA9IHtcbiAgICBlc2NhcGU6ICAgbmV3IFJlZ0V4cCgnWycgKyBfLmtleXMoZW50aXR5TWFwLmVzY2FwZSkuam9pbignJykgKyAnXScsICdnJyksXG4gICAgdW5lc2NhcGU6IG5ldyBSZWdFeHAoJygnICsgXy5rZXlzKGVudGl0eU1hcC51bmVzY2FwZSkuam9pbignfCcpICsgJyknLCAnZycpXG4gIH07XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBfLmVhY2goWydlc2NhcGUnLCAndW5lc2NhcGUnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgX1ttZXRob2RdID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyaW5nID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiAoJycgKyBzdHJpbmcpLnJlcGxhY2UoZW50aXR5UmVnZXhlc1ttZXRob2RdLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gZW50aXR5TWFwW21ldGhvZF1bbWF0Y2hdO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBwcm9wZXJ0eSBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0O1xuICAvLyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKXtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHQnOiAgICAgJ3QnLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHR8XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIGRhdGEsIHNldHRpbmdzKSB7XG4gICAgdmFyIHJlbmRlcjtcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KVxuICAgICAgICAucmVwbGFjZShlc2NhcGVyLCBmdW5jdGlvbihtYXRjaCkgeyByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07IH0pO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgXCJyZXR1cm4gX19wO1xcblwiO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSkgcmV0dXJuIHJlbmRlcihkYXRhLCBfKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIChzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJykgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbiwgd2hpY2ggd2lsbCBkZWxlZ2F0ZSB0byB0aGUgd3JhcHBlci5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfKG9iaikuY2hhaW4oKTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT0gJ3NoaWZ0JyB8fCBuYW1lID09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgXy5leHRlbmQoXy5wcm90b3R5cGUsIHtcblxuICAgIC8vIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgICBjaGFpbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9jaGFpbiA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gICAgfVxuXG4gIH0pO1xuXG59KS5jYWxsKHRoaXMpO1xuXG4vKmdsb2JhbCBfOiBmYWxzZSwgJDogZmFsc2UsIGxvY2FsU3RvcmFnZTogZmFsc2UsIHByb2Nlc3M6IHRydWUsXG4gIFhNTEh0dHBSZXF1ZXN0OiBmYWxzZSwgWERvbWFpblJlcXVlc3Q6IGZhbHNlLCBleHBvcnRzOiBmYWxzZSxcbiAgcmVxdWlyZTogZmFsc2UsIHNldFRpbWVvdXQ6IHRydWUgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICAvKipcbiAgICogQ29udGFpbnMgYWxsIFBhcnNlIEFQSSBjbGFzc2VzIGFuZCBmdW5jdGlvbnMuXG4gICAqIEBuYW1lIFBhcnNlXG4gICAqIEBuYW1lc3BhY2VcbiAgICpcbiAgICogQ29udGFpbnMgYWxsIFBhcnNlIEFQSSBjbGFzc2VzIGFuZCBmdW5jdGlvbnMuXG4gICAqL1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuXG4gIHZhciByZXEgPSB0eXBlb2YocmVxdWlyZSkgPT09ICdmdW5jdGlvbicgPyByZXF1aXJlIDogbnVsbDtcbiAgLy8gTG9hZCByZWZlcmVuY2VzIHRvIG90aGVyIGRlcGVuZGVuY2llc1xuICBpZiAodHlwZW9mKFhNTEh0dHBSZXF1ZXN0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBQYXJzZS5YTUxIdHRwUmVxdWVzdCA9IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2UgaWYgKHR5cGVvZihyZXF1aXJlKSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgdHlwZW9mKHJlcXVpcmUuZW5zdXJlKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBQYXJzZS5YTUxIdHRwUmVxdWVzdCA9IHJlcSgneG1saHR0cHJlcXVlc3QnKS5YTUxIdHRwUmVxdWVzdDtcbiAgfVxuICAvLyBJbXBvcnQgUGFyc2UncyBsb2NhbCBjb3B5IG9mIHVuZGVyc2NvcmUuXG4gIGlmICh0eXBlb2YoZXhwb3J0cykgIT09ICd1bmRlZmluZWQnICYmIGV4cG9ydHMuXykge1xuICAgIC8vIFdlJ3JlIHJ1bm5pbmcgaW4gYSBDb21tb25KUyBlbnZpcm9ubWVudFxuICAgIFBhcnNlLl8gPSBleHBvcnRzLl8ubm9Db25mbGljdCgpO1xuICAgIGV4cG9ydHMuUGFyc2UgPSBQYXJzZTtcbiAgfSBlbHNlIHtcbiAgICBQYXJzZS5fID0gXy5ub0NvbmZsaWN0KCk7XG4gIH1cblxuICAvLyBJZiBqUXVlcnkgb3IgWmVwdG8gaGFzIGJlZW4gaW5jbHVkZWQsIGdyYWIgYSByZWZlcmVuY2UgdG8gaXQuXG4gIGlmICh0eXBlb2YoJCkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBQYXJzZS4kID0gJDtcbiAgfVxuXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLVxuXG4gIC8vIFNoYXJlZCBlbXB0eSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBhaWQgaW4gcHJvdG90eXBlLWNoYWluIGNyZWF0aW9uLlxuICB2YXIgRW1wdHlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge307XG5cbiAgLy8gVE9ETzogZml4IHRoaXMgc28gdGhhdCBQYXJzZU9iamVjdHMgYXJlbid0IGFsbCBjYWxsZWQgXCJjaGlsZFwiIGluIGRlYnVnZ2VyLlxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29ycmVjdGx5IHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLCBmb3Igc3ViY2xhc3Nlcy5cbiAgLy8gU2ltaWxhciB0byBgZ29vZy5pbmhlcml0c2AsIGJ1dCB1c2VzIGEgaGFzaCBvZiBwcm90b3R5cGUgcHJvcGVydGllcyBhbmRcbiAgLy8gY2xhc3MgcHJvcGVydGllcyB0byBiZSBleHRlbmRlZC5cbiAgdmFyIGluaGVyaXRzID0gZnVuY3Rpb24ocGFyZW50LCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIHZhciBjaGlsZDtcblxuICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgdGhlIG5ldyBzdWJjbGFzcyBpcyBlaXRoZXIgZGVmaW5lZCBieSB5b3VcbiAgICAvLyAodGhlIFwiY29uc3RydWN0b3JcIiBwcm9wZXJ0eSBpbiB5b3VyIGBleHRlbmRgIGRlZmluaXRpb24pLCBvciBkZWZhdWx0ZWRcbiAgICAvLyBieSB1cyB0byBzaW1wbHkgY2FsbCB0aGUgcGFyZW50J3MgY29uc3RydWN0b3IuXG4gICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKiogQGlnbm9yZSAqL1xuICAgICAgY2hpbGQgPSBmdW5jdGlvbigpeyBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICB9XG5cbiAgICAvLyBJbmhlcml0IGNsYXNzIChzdGF0aWMpIHByb3BlcnRpZXMgZnJvbSBwYXJlbnQuXG4gICAgUGFyc2UuXy5leHRlbmQoY2hpbGQsIHBhcmVudCk7XG5cbiAgICAvLyBTZXQgdGhlIHByb3RvdHlwZSBjaGFpbiB0byBpbmhlcml0IGZyb20gYHBhcmVudGAsIHdpdGhvdXQgY2FsbGluZ1xuICAgIC8vIGBwYXJlbnRgJ3MgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAgRW1wdHlDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBFbXB0eUNvbnN0cnVjdG9yKCk7XG5cbiAgICAvLyBBZGQgcHJvdG90eXBlIHByb3BlcnRpZXMgKGluc3RhbmNlIHByb3BlcnRpZXMpIHRvIHRoZSBzdWJjbGFzcyxcbiAgICAvLyBpZiBzdXBwbGllZC5cbiAgICBpZiAocHJvdG9Qcm9wcykge1xuICAgICAgUGFyc2UuXy5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgc3RhdGljIHByb3BlcnRpZXMgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLCBpZiBzdXBwbGllZC5cbiAgICBpZiAoc3RhdGljUHJvcHMpIHtcbiAgICAgIFBhcnNlLl8uZXh0ZW5kKGNoaWxkLCBzdGF0aWNQcm9wcyk7XG4gICAgfVxuXG4gICAgLy8gQ29ycmVjdGx5IHNldCBjaGlsZCdzIGBwcm90b3R5cGUuY29uc3RydWN0b3JgLlxuICAgIGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuXG4gICAgLy8gU2V0IGEgY29udmVuaWVuY2UgcHJvcGVydHkgaW4gY2FzZSB0aGUgcGFyZW50J3MgcHJvdG90eXBlIGlzXG4gICAgLy8gbmVlZGVkIGxhdGVyLlxuICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH07XG5cbiAgLy8gU2V0IHRoZSBzZXJ2ZXIgZm9yIFBhcnNlIHRvIHRhbGsgdG8uXG4gIFBhcnNlLnNlcnZlclVSTCA9IFwiaHR0cHM6Ly9hcGkucGFyc2UuY29tXCI7XG5cbiAgLy8gQ2hlY2sgd2hldGhlciB3ZSBhcmUgcnVubmluZyBpbiBOb2RlLmpzLlxuICBpZiAodHlwZW9mKHByb2Nlc3MpICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICBwcm9jZXNzLnZlcnNpb25zICYmXG4gICAgICBwcm9jZXNzLnZlcnNpb25zLm5vZGUpIHtcbiAgICBQYXJzZS5faXNOb2RlID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIHRoaXMgbWV0aG9kIGZpcnN0IHRvIHNldCB1cCB5b3VyIGF1dGhlbnRpY2F0aW9uIHRva2VucyBmb3IgUGFyc2UuXG4gICAqIFlvdSBjYW4gZ2V0IHlvdXIga2V5cyBmcm9tIHRoZSBEYXRhIEJyb3dzZXIgb24gcGFyc2UuY29tLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBwbGljYXRpb25JZCBZb3VyIFBhcnNlIEFwcGxpY2F0aW9uIElELlxuICAgKiBAcGFyYW0ge1N0cmluZ30gamF2YVNjcmlwdEtleSBZb3VyIFBhcnNlIEphdmFTY3JpcHQgS2V5LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWFzdGVyS2V5IChvcHRpb25hbCkgWW91ciBQYXJzZSBNYXN0ZXIgS2V5LiAoTm9kZS5qcyBvbmx5ISlcbiAgICovXG4gIFBhcnNlLmluaXRpYWxpemUgPSBmdW5jdGlvbihhcHBsaWNhdGlvbklkLCBqYXZhU2NyaXB0S2V5LCBtYXN0ZXJLZXkpIHtcbiAgICBpZiAobWFzdGVyS2V5KSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLmluaXRpYWxpemUoKSB3YXMgcGFzc2VkIGEgTWFzdGVyIEtleSwgd2hpY2ggaXMgb25seSBcIiArXG4gICAgICAgIFwiYWxsb3dlZCBmcm9tIHdpdGhpbiBOb2RlLmpzLlwiO1xuICAgIH1cbiAgICBQYXJzZS5faW5pdGlhbGl6ZShhcHBsaWNhdGlvbklkLCBqYXZhU2NyaXB0S2V5KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGlzIG1ldGhvZCBmaXJzdCB0byBzZXQgdXAgbWFzdGVyIGF1dGhlbnRpY2F0aW9uIHRva2VucyBmb3IgUGFyc2UuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGZvciBQYXJzZSdzIG93biBwcml2YXRlIHVzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGFwcGxpY2F0aW9uSWQgWW91ciBQYXJzZSBBcHBsaWNhdGlvbiBJRC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGphdmFTY3JpcHRLZXkgWW91ciBQYXJzZSBKYXZhU2NyaXB0IEtleS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1hc3RlcktleSBZb3VyIFBhcnNlIE1hc3RlciBLZXkuXG4gICAqL1xuICBQYXJzZS5faW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKGFwcGxpY2F0aW9uSWQsIGphdmFTY3JpcHRLZXksIG1hc3RlcktleSkge1xuICAgIFBhcnNlLmFwcGxpY2F0aW9uSWQgPSBhcHBsaWNhdGlvbklkO1xuICAgIFBhcnNlLmphdmFTY3JpcHRLZXkgPSBqYXZhU2NyaXB0S2V5O1xuICAgIFBhcnNlLm1hc3RlcktleSA9IG1hc3RlcktleTtcbiAgICBQYXJzZS5fdXNlTWFzdGVyS2V5ID0gZmFsc2U7XG4gIH07XG5cbiAgLy8gSWYgd2UncmUgcnVubmluZyBpbiBub2RlLmpzLCBhbGxvdyB1c2luZyB0aGUgbWFzdGVyIGtleS5cbiAgaWYgKFBhcnNlLl9pc05vZGUpIHtcbiAgICBQYXJzZS5pbml0aWFsaXplID0gUGFyc2UuX2luaXRpYWxpemU7XG5cbiAgICBQYXJzZS5DbG91ZCA9IFBhcnNlLkNsb3VkIHx8IHt9O1xuICAgIC8qKlxuICAgICAqIFN3aXRjaGVzIHRoZSBQYXJzZSBTREsgdG8gdXNpbmcgdGhlIE1hc3RlciBrZXkuICBUaGUgTWFzdGVyIGtleSBncmFudHNcbiAgICAgKiBwcml2ZWxlZ2VkIGFjY2VzcyB0byB0aGUgZGF0YSBpbiBQYXJzZSBhbmQgY2FuIGJlIHVzZWQgdG8gYnlwYXNzIEFDTHMgYW5kXG4gICAgICogb3RoZXIgcmVzdHJpY3Rpb25zIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIGNsaWVudCBTREtzLlxuICAgICAqIDxwPjxzdHJvbmc+PGVtPkF2YWlsYWJsZSBpbiBDbG91ZCBDb2RlIGFuZCBOb2RlLmpzIG9ubHkuPC9lbT48L3N0cm9uZz5cbiAgICAgKiA8L3A+XG4gICAgICovXG4gICAgUGFyc2UuQ2xvdWQudXNlTWFzdGVyS2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICBQYXJzZS5fdXNlTWFzdGVyS2V5ID0gdHJ1ZTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgcHJlZml4IGZvciBTdG9yYWdlIGtleXMgdXNlZCBieSB0aGlzIGluc3RhbmNlIG9mIFBhcnNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBUaGUgcmVsYXRpdmUgc3VmZml4IHRvIGFwcGVuZCB0byBpdC5cbiAgICogICAgIG51bGwgb3IgdW5kZWZpbmVkIGlzIHRyZWF0ZWQgYXMgdGhlIGVtcHR5IHN0cmluZy5cbiAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgZnVsbCBrZXkgbmFtZS5cbiAgICovXG4gIFBhcnNlLl9nZXRQYXJzZVBhdGggPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgaWYgKCFQYXJzZS5hcHBsaWNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBcIllvdSBuZWVkIHRvIGNhbGwgUGFyc2UuaW5pdGlhbGl6ZSBiZWZvcmUgdXNpbmcgUGFyc2UuXCI7XG4gICAgfVxuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IFwiXCI7XG4gICAgfVxuICAgIGlmICghUGFyc2UuXy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgdGhyb3cgXCJUcmllZCB0byBnZXQgYSBTdG9yYWdlIHBhdGggdGhhdCB3YXNuJ3QgYSBTdHJpbmcuXCI7XG4gICAgfVxuICAgIGlmIChwYXRoWzBdID09PSBcIi9cIikge1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgICByZXR1cm4gXCJQYXJzZS9cIiArIFBhcnNlLmFwcGxpY2F0aW9uSWQgKyBcIi9cIiArIHBhdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgdW5pcXVlIHN0cmluZyBmb3IgdGhpcyBhcHAgb25cbiAgICogdGhpcyBtYWNoaW5lLlxuICAgKiBHZXRzIHJlc2V0IHdoZW4gU3RvcmFnZSBpcyBjbGVhcmVkLlxuICAgKi9cbiAgUGFyc2UuX2luc3RhbGxhdGlvbklkID0gbnVsbDtcbiAgUGFyc2UuX2dldEluc3RhbGxhdGlvbklkID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gU2VlIGlmIGl0J3MgY2FjaGVkIGluIFJBTS5cbiAgICBpZiAoUGFyc2UuX2luc3RhbGxhdGlvbklkKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhQYXJzZS5faW5zdGFsbGF0aW9uSWQpO1xuICAgIH1cblxuICAgIC8vIFRyeSB0byBnZXQgaXQgZnJvbSBTdG9yYWdlLlxuICAgIHZhciBwYXRoID0gUGFyc2UuX2dldFBhcnNlUGF0aChcImluc3RhbGxhdGlvbklkXCIpO1xuICAgIHJldHVybiAoUGFyc2UuU3RvcmFnZS5nZXRJdGVtQXN5bmMocGF0aClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIFBhcnNlLl9pbnN0YWxsYXRpb25JZCA9IHZhbHVlO1xuXG4gICAgICAgIGlmICghUGFyc2UuX2luc3RhbGxhdGlvbklkIHx8IFBhcnNlLl9pbnN0YWxsYXRpb25JZCA9PT0gXCJcIikge1xuICAgICAgICAgIC8vIEl0IHdhc24ndCBpbiBTdG9yYWdlLCBzbyBjcmVhdGUgYSBuZXcgb25lLlxuICAgICAgICAgIHZhciBoZXhPY3RldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgTWF0aC5mbG9vcigoMStNYXRoLnJhbmRvbSgpKSoweDEwMDAwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH07XG4gICAgICAgICAgUGFyc2UuX2luc3RhbGxhdGlvbklkID0gKFxuICAgICAgICAgICAgaGV4T2N0ZXQoKSArIGhleE9jdGV0KCkgKyBcIi1cIiArXG4gICAgICAgICAgICBoZXhPY3RldCgpICsgXCItXCIgK1xuICAgICAgICAgICAgaGV4T2N0ZXQoKSArIFwiLVwiICtcbiAgICAgICAgICAgIGhleE9jdGV0KCkgKyBcIi1cIiArXG4gICAgICAgICAgICBoZXhPY3RldCgpICsgaGV4T2N0ZXQoKSArIGhleE9jdGV0KCkpO1xuICAgICAgICAgIHJldHVybiBQYXJzZS5TdG9yYWdlLnNldEl0ZW1Bc3luYyhwYXRoLCBQYXJzZS5faW5zdGFsbGF0aW9uSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoUGFyc2UuX2luc3RhbGxhdGlvbklkKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcblxuICBQYXJzZS5fcGFyc2VEYXRlID0gZnVuY3Rpb24oaXNvODYwMSkge1xuICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKFxuICAgICAgXCJeKFswLTldezEsNH0pLShbMC05XXsxLDJ9KS0oWzAtOV17MSwyfSlcIiArIFwiVFwiICtcbiAgICAgIFwiKFswLTldezEsMn0pOihbMC05XXsxLDJ9KTooWzAtOV17MSwyfSlcIiArXG4gICAgICBcIiguKFswLTldKykpP1wiICsgXCJaJFwiKTtcbiAgICB2YXIgbWF0Y2ggPSByZWdleHAuZXhlYyhpc284NjAxKTtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgeWVhciA9IG1hdGNoWzFdIHx8IDA7XG4gICAgdmFyIG1vbnRoID0gKG1hdGNoWzJdIHx8IDEpIC0gMTtcbiAgICB2YXIgZGF5ID0gbWF0Y2hbM10gfHwgMDtcbiAgICB2YXIgaG91ciA9IG1hdGNoWzRdIHx8IDA7XG4gICAgdmFyIG1pbnV0ZSA9IG1hdGNoWzVdIHx8IDA7XG4gICAgdmFyIHNlY29uZCA9IG1hdGNoWzZdIHx8IDA7XG4gICAgdmFyIG1pbGxpID0gbWF0Y2hbOF0gfHwgMDtcblxuICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGkpKTtcbiAgfTtcblxuICBQYXJzZS5fYWpheElFOCA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgIHZhciB4ZHIgPSBuZXcgWERvbWFpblJlcXVlc3QoKTtcbiAgICB4ZHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICB0cnkge1xuICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UoeGRyLnJlc3BvbnNlVGV4dCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIHByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB4ZHIub25lcnJvciA9IHhkci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIExldCdzIGZha2UgYSByZWFsIGVycm9yIG1lc3NhZ2UuXG4gICAgICB2YXIgZmFrZVJlc3BvbnNlID0ge1xuICAgICAgICByZXNwb25zZVRleHQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjb2RlOiBQYXJzZS5FcnJvci5YX0RPTUFJTl9SRVFVRVNULFxuICAgICAgICAgIGVycm9yOiBcIklFJ3MgWERvbWFpblJlcXVlc3QgZG9lcyBub3Qgc3VwcGx5IGVycm9yIGluZm8uXCJcbiAgICAgICAgfSlcbiAgICAgIH07XG4gICAgICBwcm9taXNlLnJlamVjdChmYWtlUmVzcG9uc2UpO1xuICAgIH07XG4gICAgeGRyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHt9O1xuICAgIHhkci5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICB4ZHIuc2VuZChkYXRhKTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfTtcblxuICBQYXJzZS5fdXNlWERvbWFpblJlcXVlc3QgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mKFhEb21haW5SZXF1ZXN0KSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gV2UncmUgaW4gSUUgOCsuXG4gICAgICBpZiAoJ3dpdGhDcmVkZW50aWFscycgaW4gbmV3IFhNTEh0dHBSZXF1ZXN0KCkpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gSUUgMTArLlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIFRPRE8oa2xpbXQpOiBHZXQgcmlkIG9mIHN1Y2Nlc3MvZXJyb3IgdXNhZ2UgaW4gd2Vic2l0ZS5cbiAgUGFyc2UuX2FqYXggPSBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gICAgICBlcnJvcjogZXJyb3JcbiAgICB9O1xuXG4gICAgaWYgKFBhcnNlLl91c2VYRG9tYWluUmVxdWVzdCgpKSB7XG4gICAgICByZXR1cm4gUGFyc2UuX2FqYXhJRTgobWV0aG9kLCB1cmwsIGRhdGEpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICB2YXIgYXR0ZW1wdHMgPSAwO1xuXG4gICAgdmFyIGRpc3BhdGNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgdmFyIHhociA9IG5ldyBQYXJzZS5YTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIGlmIChoYW5kbGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlLCB4aHIuc3RhdHVzLCB4aHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnN0YXR1cyA+PSA1MDApIHsgLy8gUmV0cnkgb24gNVhYXG4gICAgICAgICAgICBpZiAoKythdHRlbXB0cyA8IDUpIHtcbiAgICAgICAgICAgICAgLy8gRXhwb25lbnRpYWxseS1ncm93aW5nIGRlbGF5XG4gICAgICAgICAgICAgIHZhciBkZWxheSA9IE1hdGgucm91bmQoXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDEyNSAqIE1hdGgucG93KDIsIGF0dGVtcHRzKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGRpc3BhdGNoLCBkZWxheSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBBZnRlciA1IHJldHJpZXMsIGZhaWxcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoeGhyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoeGhyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9wbGFpbicpOyAgLy8gYXZvaWQgcHJlLWZsaWdodC5cbiAgICAgIGlmIChQYXJzZS5faXNOb2RlKSB7XG4gICAgICAgIC8vIEFkZCBhIHNwZWNpYWwgdXNlciBhZ2VudCBqdXN0IGZvciByZXF1ZXN0IGZyb20gbm9kZS5qcy5cbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJVc2VyLUFnZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiUGFyc2UvXCIgKyBQYXJzZS5WRVJTSU9OICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgKE5vZGVKUyBcIiArIHByb2Nlc3MudmVyc2lvbnMubm9kZSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgIH07XG5cbiAgICBkaXNwYXRjaCgpO1xuICAgIHJldHVybiBwcm9taXNlLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpOyBcbiAgfTtcblxuICAvLyBBIHNlbGYtcHJvcGFnYXRpbmcgZXh0ZW5kIGZ1bmN0aW9uLlxuICBQYXJzZS5fZXh0ZW5kID0gZnVuY3Rpb24ocHJvdG9Qcm9wcywgY2xhc3NQcm9wcykge1xuICAgIHZhciBjaGlsZCA9IGluaGVyaXRzKHRoaXMsIHByb3RvUHJvcHMsIGNsYXNzUHJvcHMpO1xuICAgIGNoaWxkLmV4dGVuZCA9IHRoaXMuZXh0ZW5kO1xuICAgIHJldHVybiBjaGlsZDtcbiAgfTtcblxuICAvKipcbiAgICogT3B0aW9uczpcbiAgICogICByb3V0ZTogaXMgY2xhc3NlcywgdXNlcnMsIGxvZ2luLCBldGMuXG4gICAqICAgb2JqZWN0SWQ6IG51bGwgaWYgdGhlcmUgaXMgbm8gYXNzb2NpYXRlZCBvYmplY3RJZC5cbiAgICogICBtZXRob2Q6IHRoZSBodHRwIG1ldGhvZCBmb3IgdGhlIFJFU1QgQVBJLlxuICAgKiAgIGRhdGFPYmplY3Q6IHRoZSBwYXlsb2FkIGFzIGFuIG9iamVjdCwgb3IgbnVsbCBpZiB0aGVyZSBpcyBub25lLlxuICAgKiAgIHVzZU1hc3RlcktleTogb3ZlcnJpZGVzIHdoZXRoZXIgdG8gdXNlIHRoZSBtYXN0ZXIga2V5IGlmIHNldC5cbiAgICogQGlnbm9yZVxuICAgKi9cbiAgUGFyc2UuX3JlcXVlc3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIHJvdXRlID0gb3B0aW9ucy5yb3V0ZTtcbiAgICB2YXIgY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XG4gICAgdmFyIG9iamVjdElkID0gb3B0aW9ucy5vYmplY3RJZDtcbiAgICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gICAgdmFyIHVzZU1hc3RlcktleSA9IG9wdGlvbnMudXNlTWFzdGVyS2V5O1xuICAgIHZhciBzZXNzaW9uVG9rZW4gPSBvcHRpb25zLnNlc3Npb25Ub2tlbjtcbiAgICB2YXIgZGF0YU9iamVjdCA9IG9wdGlvbnMuZGF0YTtcblxuICAgIGlmICghUGFyc2UuYXBwbGljYXRpb25JZCkge1xuICAgICAgdGhyb3cgXCJZb3UgbXVzdCBzcGVjaWZ5IHlvdXIgYXBwbGljYXRpb25JZCB1c2luZyBQYXJzZS5pbml0aWFsaXplLlwiO1xuICAgIH1cblxuICAgIGlmICghUGFyc2UuamF2YVNjcmlwdEtleSAmJiAhUGFyc2UubWFzdGVyS2V5KSB7XG4gICAgICB0aHJvdyBcIllvdSBtdXN0IHNwZWNpZnkgYSBrZXkgdXNpbmcgUGFyc2UuaW5pdGlhbGl6ZS5cIjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBXZSBjYW4gcmVtb3ZlIHRoaXMgY2hlY2sgbGF0ZXIsIGJ1dCBpdCdzIHVzZWZ1bCBmb3IgZGV2ZWxvcG1lbnQuXG4gICAgaWYgKHJvdXRlICE9PSBcImJhdGNoXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiY2xhc3Nlc1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImV2ZW50c1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImZpbGVzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiZnVuY3Rpb25zXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwibG9naW5cIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJsb2dvdXRcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJwdXNoXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwicmVxdWVzdFBhc3N3b3JkUmVzZXRcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJyZXN0X3ZlcmlmeV9hbmFseXRpY3NcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJ1c2Vyc1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImpvYnNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJjb25maWdcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJzZXNzaW9uc1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInVwZ3JhZGVUb1Jldm9jYWJsZVNlc3Npb25cIikge1xuICAgICAgdGhyb3cgXCJCYWQgcm91dGU6ICdcIiArIHJvdXRlICsgXCInLlwiO1xuICAgIH1cblxuICAgIHZhciB1cmwgPSBQYXJzZS5zZXJ2ZXJVUkw7XG4gICAgaWYgKHVybC5jaGFyQXQodXJsLmxlbmd0aCAtIDEpICE9PSBcIi9cIikge1xuICAgICAgdXJsICs9IFwiL1wiO1xuICAgIH1cbiAgICB1cmwgKz0gXCIxL1wiICsgcm91dGU7XG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgdXJsICs9IFwiL1wiICsgY2xhc3NOYW1lO1xuICAgIH1cbiAgICBpZiAob2JqZWN0SWQpIHtcbiAgICAgIHVybCArPSBcIi9cIiArIG9iamVjdElkO1xuICAgIH1cblxuICAgIGRhdGFPYmplY3QgPSBQYXJzZS5fLmNsb25lKGRhdGFPYmplY3QgfHwge30pO1xuICAgIGlmIChtZXRob2QgIT09IFwiUE9TVFwiKSB7XG4gICAgICBkYXRhT2JqZWN0Ll9tZXRob2QgPSBtZXRob2Q7XG4gICAgICBtZXRob2QgPSBcIlBPU1RcIjtcbiAgICB9XG5cbiAgICBpZiAoUGFyc2UuXy5pc1VuZGVmaW5lZCh1c2VNYXN0ZXJLZXkpKSB7XG4gICAgICB1c2VNYXN0ZXJLZXkgPSBQYXJzZS5fdXNlTWFzdGVyS2V5O1xuICAgIH1cblxuICAgIGRhdGFPYmplY3QuX0FwcGxpY2F0aW9uSWQgPSBQYXJzZS5hcHBsaWNhdGlvbklkO1xuICAgIGlmICghdXNlTWFzdGVyS2V5KSB7XG4gICAgICBkYXRhT2JqZWN0Ll9KYXZhU2NyaXB0S2V5ID0gUGFyc2UuamF2YVNjcmlwdEtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YU9iamVjdC5fTWFzdGVyS2V5ID0gUGFyc2UubWFzdGVyS2V5O1xuICAgIH1cblxuICAgIGRhdGFPYmplY3QuX0NsaWVudFZlcnNpb24gPSBQYXJzZS5WRVJTSU9OO1xuXG4gICAgcmV0dXJuIFBhcnNlLl9nZXRJbnN0YWxsYXRpb25JZCgpLnRoZW4oZnVuY3Rpb24oaWlkKSB7XG4gICAgICBkYXRhT2JqZWN0Ll9JbnN0YWxsYXRpb25JZCA9IGlpZDtcblxuICAgICAgaWYgKHNlc3Npb25Ub2tlbikge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyh7IF9zZXNzaW9uVG9rZW46IHNlc3Npb25Ub2tlbiB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRBc3luYygpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oY3VycmVudFVzZXIpIHtcbiAgICAgIGlmIChjdXJyZW50VXNlciAmJiBjdXJyZW50VXNlci5fc2Vzc2lvblRva2VuKSB7XG4gICAgICAgIGRhdGFPYmplY3QuX1Nlc3Npb25Ub2tlbiA9IGN1cnJlbnRVc2VyLl9zZXNzaW9uVG9rZW47XG4gICAgICB9XG5cbiAgICAgIGlmIChQYXJzZS5Vc2VyLl9pc1Jldm9jYWJsZVNlc3Npb25FbmFibGVkKSB7XG4gICAgICAgIGRhdGFPYmplY3QuX1Jldm9jYWJsZVNlc3Npb24gPSAnMSc7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YU9iamVjdCk7XG5cbiAgICAgIHJldHVybiBQYXJzZS5fYWpheChtZXRob2QsIHVybCwgZGF0YSk7XG4gICAgfSkudGhlbihudWxsLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgLy8gVHJhbnNmb3JtIHRoZSBlcnJvciBpbnRvIGFuIGluc3RhbmNlIG9mIFBhcnNlLkVycm9yIGJ5IHRyeWluZyB0byBwYXJzZVxuICAgICAgLy8gdGhlIGVycm9yIHN0cmluZyBhcyBKU09OLlxuICAgICAgdmFyIGVycm9yO1xuICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBlcnJvckpTT04gPSBKU09OLnBhcnNlKHJlc3BvbnNlLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoZXJyb3JKU09OLmNvZGUsIGVycm9ySlNPTi5lcnJvcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBJZiB3ZSBmYWlsIHRvIHBhcnNlIHRoZSBlcnJvciB0ZXh0LCB0aGF0J3Mgb2theS5cbiAgICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgICAgUGFyc2UuRXJyb3IuSU5WQUxJRF9KU09OLFxuICAgICAgICAgICAgICBcIlJlY2VpdmVkIGFuIGVycm9yIHdpdGggaW52YWxpZCBKU09OIGZyb20gUGFyc2U6IFwiICtcbiAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuQ09OTkVDVElPTl9GQUlMRUQsXG4gICAgICAgICAgICBcIlhNTEh0dHBSZXF1ZXN0IGZhaWxlZDogXCIgKyBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xuICAgICAgfVxuICAgICAgLy8gQnkgZXhwbGljaXRseSByZXR1cm5pbmcgYSByZWplY3RlZCBQcm9taXNlLCB0aGlzIHdpbGwgd29yayB3aXRoXG4gICAgICAvLyBlaXRoZXIgalF1ZXJ5IG9yIFByb21pc2VzL0Egc2VtYW50aWNzLlxuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgYSB2YWx1ZSBmcm9tIGEgQmFja2JvbmUgb2JqZWN0IGFzIGEgcHJvcGVydHlcbiAgLy8gb3IgYXMgYSBmdW5jdGlvbi5cbiAgUGFyc2UuX2dldFZhbHVlID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wKSB7XG4gICAgaWYgKCEob2JqZWN0ICYmIG9iamVjdFtwcm9wXSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gUGFyc2UuXy5pc0Z1bmN0aW9uKG9iamVjdFtwcm9wXSkgPyBvYmplY3RbcHJvcF0oKSA6IG9iamVjdFtwcm9wXTtcbiAgfTtcblxuICAvKipcbiAgICogQ29udmVydHMgYSB2YWx1ZSBpbiBhIFBhcnNlIE9iamVjdCBpbnRvIHRoZSBhcHByb3ByaWF0ZSByZXByZXNlbnRhdGlvbi5cbiAgICogVGhpcyBpcyB0aGUgSlMgZXF1aXZhbGVudCBvZiBKYXZhJ3MgUGFyc2UubWF5YmVSZWZlcmVuY2VBbmRFbmNvZGUoT2JqZWN0KVxuICAgKiBpZiBzZWVuT2JqZWN0cyBpcyBmYWxzZXkuIE90aGVyd2lzZSBhbnkgUGFyc2UuT2JqZWN0cyBub3QgaW5cbiAgICogc2Vlbk9iamVjdHMgd2lsbCBiZSBmdWxseSBlbWJlZGRlZCByYXRoZXIgdGhhbiBlbmNvZGVkXG4gICAqIGFzIGEgcG9pbnRlci4gIFRoaXMgYXJyYXkgd2lsbCBiZSB1c2VkIHRvIHByZXZlbnQgZ29pbmcgaW50byBhbiBpbmZpbml0ZVxuICAgKiBsb29wIGJlY2F1c2Ugd2UgaGF2ZSBjaXJjdWxhciByZWZlcmVuY2VzLiAgSWYgc2Vlbk9iamVjdHNcbiAgICogaXMgc2V0LCB0aGVuIG5vbmUgb2YgdGhlIFBhcnNlIE9iamVjdHMgdGhhdCBhcmUgc2VyaWFsaXplZCBjYW4gYmUgZGlydHkuXG4gICAqL1xuICBQYXJzZS5fZW5jb2RlID0gZnVuY3Rpb24odmFsdWUsIHNlZW5PYmplY3RzLCBkaXNhbGxvd09iamVjdHMpIHtcbiAgICB2YXIgXyA9IFBhcnNlLl87XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICBpZiAoZGlzYWxsb3dPYmplY3RzKSB7XG4gICAgICAgIHRocm93IFwiUGFyc2UuT2JqZWN0cyBub3QgYWxsb3dlZCBoZXJlXCI7XG4gICAgICB9XG4gICAgICBpZiAoIXNlZW5PYmplY3RzIHx8IF8uaW5jbHVkZShzZWVuT2JqZWN0cywgdmFsdWUpIHx8ICF2YWx1ZS5faGFzRGF0YSkge1xuICAgICAgICByZXR1cm4gdmFsdWUuX3RvUG9pbnRlcigpO1xuICAgICAgfVxuICAgICAgaWYgKCF2YWx1ZS5kaXJ0eSgpKSB7XG4gICAgICAgIHNlZW5PYmplY3RzID0gc2Vlbk9iamVjdHMuY29uY2F0KHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLl9lbmNvZGUodmFsdWUuX3RvRnVsbEpTT04oc2Vlbk9iamVjdHMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWVuT2JqZWN0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWxsb3dPYmplY3RzKTtcbiAgICAgIH1cbiAgICAgIHRocm93IFwiVHJpZWQgdG8gc2F2ZSBhbiBvYmplY3Qgd2l0aCBhIHBvaW50ZXIgdG8gYSBuZXcsIHVuc2F2ZWQgb2JqZWN0LlwiO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5BQ0wpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b0pTT04oKTtcbiAgICB9XG4gICAgaWYgKF8uaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHsgXCJfX3R5cGVcIjogXCJEYXRlXCIsIFwiaXNvXCI6IHZhbHVlLnRvSlNPTigpIH07XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkdlb1BvaW50KSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9KU09OKCk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gXy5tYXAodmFsdWUsIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLl9lbmNvZGUoeCwgc2Vlbk9iamVjdHMsIGRpc2FsbG93T2JqZWN0cyk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUuc291cmNlO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbikge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSlNPTigpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PcCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSlNPTigpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5GaWxlKSB7XG4gICAgICBpZiAoIXZhbHVlLnVybCgpKSB7XG4gICAgICAgIHRocm93IFwiVHJpZWQgdG8gc2F2ZSBhbiBvYmplY3QgY29udGFpbmluZyBhbiB1bnNhdmVkIGZpbGUuXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfX3R5cGU6IFwiRmlsZVwiLFxuICAgICAgICBuYW1lOiB2YWx1ZS5uYW1lKCksXG4gICAgICAgIHVybDogdmFsdWUudXJsKClcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgdmFyIG91dHB1dCA9IHt9O1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godmFsdWUsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgb3V0cHV0W2tdID0gUGFyc2UuX2VuY29kZSh2LCBzZWVuT2JqZWN0cywgZGlzYWxsb3dPYmplY3RzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGUgaW52ZXJzZSBmdW5jdGlvbiBvZiBQYXJzZS5fZW5jb2RlLlxuICAgKiBUT0RPOiBtYWtlIGRlY29kZSBub3QgbXV0YXRlIHZhbHVlLlxuICAgKi9cbiAgUGFyc2UuX2RlY29kZSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgXyA9IFBhcnNlLl87XG4gICAgaWYgKCFfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgUGFyc2UuX2FycmF5RWFjaCh2YWx1ZSwgZnVuY3Rpb24odiwgaykge1xuICAgICAgICB2YWx1ZVtrXSA9IFBhcnNlLl9kZWNvZGUoaywgdik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkZpbGUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT3ApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fb3ApIHtcbiAgICAgIHJldHVybiBQYXJzZS5PcC5fZGVjb2RlKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJQb2ludGVyXCIgJiYgdmFsdWUuY2xhc3NOYW1lKSB7XG4gICAgICB2YXIgcG9pbnRlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKHZhbHVlLmNsYXNzTmFtZSk7XG4gICAgICBwb2ludGVyLl9maW5pc2hGZXRjaCh7IG9iamVjdElkOiB2YWx1ZS5vYmplY3RJZCB9LCBmYWxzZSk7XG4gICAgICByZXR1cm4gcG9pbnRlcjtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJPYmplY3RcIiAmJiB2YWx1ZS5jbGFzc05hbWUpIHtcbiAgICAgIC8vIEl0J3MgYW4gT2JqZWN0IGluY2x1ZGVkIGluIGEgcXVlcnkgcmVzdWx0LlxuICAgICAgdmFyIGNsYXNzTmFtZSA9IHZhbHVlLmNsYXNzTmFtZTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS5fX3R5cGU7XG4gICAgICBkZWxldGUgdmFsdWUuY2xhc3NOYW1lO1xuICAgICAgdmFyIG9iamVjdCA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKGNsYXNzTmFtZSk7XG4gICAgICBvYmplY3QuX2ZpbmlzaEZldGNoKHZhbHVlLCB0cnVlKTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09IFwiRGF0ZVwiKSB7XG4gICAgICByZXR1cm4gUGFyc2UuX3BhcnNlRGF0ZSh2YWx1ZS5pc28pO1xuICAgIH1cbiAgICBpZiAodmFsdWUuX190eXBlID09PSBcIkdlb1BvaW50XCIpIHtcbiAgICAgIHJldHVybiBuZXcgUGFyc2UuR2VvUG9pbnQoe1xuICAgICAgICBsYXRpdHVkZTogdmFsdWUubGF0aXR1ZGUsXG4gICAgICAgIGxvbmdpdHVkZTogdmFsdWUubG9uZ2l0dWRlXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gXCJBQ0xcIikge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuQUNMKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUGFyc2UuQUNMKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJSZWxhdGlvblwiKSB7XG4gICAgICB2YXIgcmVsYXRpb24gPSBuZXcgUGFyc2UuUmVsYXRpb24obnVsbCwga2V5KTtcbiAgICAgIHJlbGF0aW9uLnRhcmdldENsYXNzTmFtZSA9IHZhbHVlLmNsYXNzTmFtZTtcbiAgICAgIHJldHVybiByZWxhdGlvbjtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJGaWxlXCIpIHtcbiAgICAgIHZhciBmaWxlID0gbmV3IFBhcnNlLkZpbGUodmFsdWUubmFtZSk7XG4gICAgICBmaWxlLl91cmwgPSB2YWx1ZS51cmw7XG4gICAgICByZXR1cm4gZmlsZTtcbiAgICB9XG4gICAgUGFyc2UuX29iamVjdEVhY2godmFsdWUsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgIHZhbHVlW2tdID0gUGFyc2UuX2RlY29kZShrLCB2KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgUGFyc2UuX2FycmF5RWFjaCA9IFBhcnNlLl8uZWFjaDtcblxuICAvKipcbiAgICogRG9lcyBhIGRlZXAgdHJhdmVyc2FsIG9mIGV2ZXJ5IGl0ZW0gaW4gb2JqZWN0LCBjYWxsaW5nIGZ1bmMgb24gZXZlcnkgb25lLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gdHJhdmVyc2UgZGVlcGx5LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBldmVyeSBpdGVtLiBJdCB3aWxsXG4gICAqICAgICBiZSBwYXNzZWQgdGhlIGl0ZW0gYXMgYW4gYXJndW1lbnQuIElmIGl0IHJldHVybnMgYSB0cnV0aHkgdmFsdWUsIHRoYXRcbiAgICogICAgIHZhbHVlIHdpbGwgcmVwbGFjZSB0aGUgaXRlbSBpbiBpdHMgcGFyZW50IGNvbnRhaW5lci5cbiAgICogQHJldHVybnMge30gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGZ1bmMgb24gdGhlIHRvcC1sZXZlbCBvYmplY3QgaXRzZWxmLlxuICAgKi9cbiAgUGFyc2UuX3RyYXZlcnNlID0gZnVuY3Rpb24ob2JqZWN0LCBmdW5jLCBzZWVuKSB7XG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgc2VlbiA9IHNlZW4gfHwgW107XG4gICAgICBpZiAoUGFyc2UuXy5pbmRleE9mKHNlZW4sIG9iamVjdCkgPj0gMCkge1xuICAgICAgICAvLyBXZSd2ZSBhbHJlYWR5IHZpc2l0ZWQgdGhpcyBvYmplY3QgaW4gdGhpcyBjYWxsLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWVuLnB1c2gob2JqZWN0KTtcbiAgICAgIFBhcnNlLl90cmF2ZXJzZShvYmplY3QuYXR0cmlidXRlcywgZnVuYywgc2Vlbik7XG4gICAgICByZXR1cm4gZnVuYyhvYmplY3QpO1xuICAgIH1cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuUmVsYXRpb24gfHwgb2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgLy8gTm90aGluZyBuZWVkcyB0byBiZSBkb25lLCBidXQgd2UgZG9uJ3Qgd2FudCB0byByZWN1cnNlIGludG8gdGhlXG4gICAgICAvLyBvYmplY3QncyBwYXJlbnQgaW5maW5pdGVseSwgc28gd2UgY2F0Y2ggdGhpcyBjYXNlLlxuICAgICAgcmV0dXJuIGZ1bmMob2JqZWN0KTtcbiAgICB9XG4gICAgaWYgKFBhcnNlLl8uaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBQYXJzZS5fLmVhY2gob2JqZWN0LCBmdW5jdGlvbihjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgdmFyIG5ld0NoaWxkID0gUGFyc2UuX3RyYXZlcnNlKGNoaWxkLCBmdW5jLCBzZWVuKTtcbiAgICAgICAgaWYgKG5ld0NoaWxkKSB7XG4gICAgICAgICAgb2JqZWN0W2luZGV4XSA9IG5ld0NoaWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gICAgfVxuICAgIGlmIChQYXJzZS5fLmlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIFBhcnNlLl9lYWNoKG9iamVjdCwgZnVuY3Rpb24oY2hpbGQsIGtleSkge1xuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBQYXJzZS5fdHJhdmVyc2UoY2hpbGQsIGZ1bmMsIHNlZW4pO1xuICAgICAgICBpZiAobmV3Q2hpbGQpIHtcbiAgICAgICAgICBvYmplY3Rba2V5XSA9IG5ld0NoaWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgbGlrZSBfLmVhY2gsIGV4Y2VwdDpcbiAgICogKiBpdCBkb2Vzbid0IHdvcmsgZm9yIHNvLWNhbGxlZCBhcnJheS1saWtlIG9iamVjdHMsXG4gICAqICogaXQgZG9lcyB3b3JrIGZvciBkaWN0aW9uYXJpZXMgd2l0aCBhIFwibGVuZ3RoXCIgYXR0cmlidXRlLlxuICAgKi9cbiAgUGFyc2UuX29iamVjdEVhY2ggPSBQYXJzZS5fZWFjaCA9IGZ1bmN0aW9uKG9iaiwgY2FsbGJhY2spIHtcbiAgICB2YXIgXyA9IFBhcnNlLl87XG4gICAgaWYgKF8uaXNPYmplY3Qob2JqKSkge1xuICAgICAgXy5lYWNoKF8ua2V5cyhvYmopLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqW2tleV0sIGtleSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKG9iaiwgY2FsbGJhY2spO1xuICAgIH1cbiAgfTtcblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgbnVsbCBvciB1bmRlZmluZWQuXG4gIFBhcnNlLl9pc051bGxPclVuZGVmaW5lZCA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gUGFyc2UuXy5pc051bGwoeCkgfHwgUGFyc2UuXy5pc1VuZGVmaW5lZCh4KTtcbiAgfTtcbn0odGhpcykpO1xuXG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIGxvY2FsU3RvcmFnZTogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICBcbiAgdmFyIFN0b3JhZ2UgPSB7XG4gICAgYXN5bmM6IGZhbHNlLFxuICB9O1xuXG4gIHZhciBoYXNMb2NhbFN0b3JhZ2UgPSAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcpO1xuICBpZiAoaGFzTG9jYWxTdG9yYWdlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdXBwb3J0ZWQnLCB0cnVlKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdzdXBwb3J0ZWQnKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGhhc0xvY2FsU3RvcmFnZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaGFzTG9jYWxTdG9yYWdlKSB7XG4gICAgU3RvcmFnZS5nZXRJdGVtID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHBhdGgpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnNldEl0ZW0gPSBmdW5jdGlvbihwYXRoLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHBhdGgsIHZhbHVlKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHBhdGgpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgfTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBBc3luY1N0b3JhZ2U7XG4gICAgdHJ5IHtcbiAgICAgIEFzeW5jU3RvcmFnZSA9IGV2YWwoXCJyZXF1aXJlKCdBc3luY1N0b3JhZ2UnKVwiKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICAgIFN0b3JhZ2UuYXN5bmMgPSB0cnVlO1xuXG4gICAgICBTdG9yYWdlLmdldEl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdmFyIHAgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgICBBc3luY1N0b3JhZ2UuZ2V0SXRlbShwYXRoLCBmdW5jdGlvbihlcnIsIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcC5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH07XG5cbiAgICAgIFN0b3JhZ2Uuc2V0SXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHAgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgICBBc3luY1N0b3JhZ2Uuc2V0SXRlbShwYXRoLCB2YWx1ZSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcC5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH07XG5cbiAgICAgIFN0b3JhZ2UucmVtb3ZlSXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB2YXIgcCA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICAgIEFzeW5jU3RvcmFnZS5yZW1vdmVJdGVtKHBhdGgsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHAucmVqZWN0KGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfTtcblxuICAgICAgU3RvcmFnZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBBc3luY1N0b3JhZ2UuY2xlYXIoKTtcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkgeyB9XG4gIH1cbiAgaWYgKCFTdG9yYWdlLmFzeW5jICYmICFTdG9yYWdlLmdldEl0ZW0pIHtcbiAgICB2YXIgbWVtTWFwID0gU3RvcmFnZS5pbk1lbW9yeU1hcCA9IHt9O1xuICAgIFN0b3JhZ2UuZ2V0SXRlbSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIGlmIChtZW1NYXAuaGFzT3duUHJvcGVydHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG1lbU1hcFtwYXRoXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnNldEl0ZW0gPSBmdW5jdGlvbihwYXRoLCB2YWx1ZSkge1xuICAgICAgbWVtTWFwW3BhdGhdID0gU3RyaW5nKHZhbHVlKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgZGVsZXRlIG1lbU1hcFtwYXRoXTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG1lbU1hcCkge1xuICAgICAgICBpZiAobWVtTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBkZWxldGUgbWVtTWFwW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gV2UgY2FuIHVzZSBzeW5jaHJvbm91cyBtZXRob2RzIGZyb20gYXN5bmMgc2NlbmFyaW9zLCBidXQgbm90IHZpY2UtdmVyc2FcbiAgaWYgKCFTdG9yYWdlLmFzeW5jKSB7XG4gICAgU3RvcmFnZS5nZXRJdGVtQXN5bmMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhcbiAgICAgICAgU3RvcmFnZS5nZXRJdGVtKHBhdGgpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnNldEl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgsIHZhbHVlKSB7XG4gICAgICBTdG9yYWdlLnNldEl0ZW0ocGF0aCwgdmFsdWUpO1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXModmFsdWUpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnJlbW92ZUl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFxuICAgICAgICBTdG9yYWdlLnJlbW92ZUl0ZW0ocGF0aClcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIFBhcnNlLlN0b3JhZ2UgPSBTdG9yYWdlO1xuXG59KSh0aGlzKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQG5hbWVzcGFjZSBQcm92aWRlcyBhbiBpbnRlcmZhY2UgdG8gUGFyc2UncyBsb2dnaW5nIGFuZCBhbmFseXRpY3MgYmFja2VuZC5cbiAgICovXG4gIFBhcnNlLkFuYWx5dGljcyA9IFBhcnNlLkFuYWx5dGljcyB8fCB7fTtcblxuICBfLmV4dGVuZChQYXJzZS5BbmFseXRpY3MsIC8qKiBAbGVuZHMgUGFyc2UuQW5hbHl0aWNzICovIHtcbiAgICAvKipcbiAgICAgKiBUcmFja3MgdGhlIG9jY3VycmVuY2Ugb2YgYSBjdXN0b20gZXZlbnQgd2l0aCBhZGRpdGlvbmFsIGRpbWVuc2lvbnMuXG4gICAgICogUGFyc2Ugd2lsbCBzdG9yZSBhIGRhdGEgcG9pbnQgYXQgdGhlIHRpbWUgb2YgaW52b2NhdGlvbiB3aXRoIHRoZSBnaXZlblxuICAgICAqIGV2ZW50IG5hbWUuXG4gICAgICpcbiAgICAgKiBEaW1lbnNpb25zIHdpbGwgYWxsb3cgc2VnbWVudGF0aW9uIG9mIHRoZSBvY2N1cnJlbmNlcyBvZiB0aGlzIGN1c3RvbVxuICAgICAqIGV2ZW50LiBLZXlzIGFuZCB2YWx1ZXMgc2hvdWxkIGJlIHtAY29kZSBTdHJpbmd9cywgYW5kIHdpbGwgdGhyb3dcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiBUbyB0cmFjayBhIHVzZXIgc2lnbnVwIGFsb25nIHdpdGggYWRkaXRpb25hbCBtZXRhZGF0YSwgY29uc2lkZXIgdGhlXG4gICAgICogZm9sbG93aW5nOlxuICAgICAqIDxwcmU+XG4gICAgICogdmFyIGRpbWVuc2lvbnMgPSB7XG4gICAgICogIGdlbmRlcjogJ20nLFxuICAgICAqICBzb3VyY2U6ICd3ZWInLFxuICAgICAqICBkYXlUeXBlOiAnd2Vla2VuZCdcbiAgICAgKiB9O1xuICAgICAqIFBhcnNlLkFuYWx5dGljcy50cmFjaygnc2lnbnVwJywgZGltZW5zaW9ucyk7XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBUaGVyZSBpcyBhIGRlZmF1bHQgbGltaXQgb2YgOCBkaW1lbnNpb25zIHBlciBldmVudCB0cmFja2VkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGN1c3RvbSBldmVudCB0byByZXBvcnQgdG8gUGFyc2UgYXNcbiAgICAgKiBoYXZpbmcgaGFwcGVuZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRpbWVuc2lvbnMgVGhlIGRpY3Rpb25hcnkgb2YgaW5mb3JtYXRpb24gYnkgd2hpY2ggdG9cbiAgICAgKiBzZWdtZW50IHRoaXMgZXZlbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgcm91bmQtdHJpcFxuICAgICAqIHRvIHRoZSBzZXJ2ZXIgY29tcGxldGVzLlxuICAgICAqL1xuICAgIHRyYWNrOiBmdW5jdGlvbihuYW1lLCBkaW1lbnNpb25zLCBvcHRpb25zKSB7XG4gICAgICBuYW1lID0gbmFtZSB8fCAnJztcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL15cXHMqLywgJycpO1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG4gICAgICBpZiAobmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgJ0EgbmFtZSBmb3IgdGhlIGN1c3RvbSBldmVudCBtdXN0IGJlIHByb3ZpZGVkJztcbiAgICAgIH1cblxuICAgICAgXy5lYWNoKGRpbWVuc2lvbnMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICghXy5pc1N0cmluZyhrZXkpIHx8ICFfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICB0aHJvdyAndHJhY2soKSBkaW1lbnNpb25zIGV4cGVjdHMga2V5cyBhbmQgdmFsdWVzIG9mIHR5cGUgXCJzdHJpbmdcIi4nO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogJ2V2ZW50cycsXG4gICAgICAgIGNsYXNzTmFtZTogbmFtZSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IHsgZGltZW5zaW9uczogZGltZW5zaW9ucyB9XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9XG4gIH0pO1xufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBjbGFzcyBQYXJzZS5Db25maWcgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBjb25maWd1cmF0aW9uIGRhdGEgdGhhdFxuICAgKiBjYW4gYmUgc2V0IGZyb20gdGhlIFBhcnNlIGRhc2hib2FyZC5cbiAgICovXG4gIFBhcnNlLkNvbmZpZyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzID0ge307XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgbW9zdCByZWNlbnRseS1mZXRjaGVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0LCBlaXRoZXIgZnJvbVxuICAgKiBtZW1vcnkgb3IgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHJldHVybiB7UGFyc2UuQ29uZmlnfSBUaGUgbW9zdCByZWNlbnRseS1mZXRjaGVkIFBhcnNlLkNvbmZpZyBpZiBpdFxuICAgKiAgICAgZXhpc3RzLCBlbHNlIGFuIGVtcHR5IFBhcnNlLkNvbmZpZy5cbiAgICovXG4gIFBhcnNlLkNvbmZpZy5jdXJyZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZykge1xuICAgICAgcmV0dXJuIFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZztcbiAgICB9XG5cbiAgICB2YXIgY29uZmlnID0gbmV3IFBhcnNlLkNvbmZpZygpO1xuXG4gICAgaWYgKFBhcnNlLlN0b3JhZ2UuYXN5bmMpIHtcbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZ0RhdGEgPSBQYXJzZS5TdG9yYWdlLmdldEl0ZW0oUGFyc2UuX2dldFBhcnNlUGF0aChcbiAgICAgICAgICBQYXJzZS5Db25maWcuX0NVUlJFTlRfQ09ORklHX0tFWSkpO1xuXG4gICAgaWYgKGNvbmZpZ0RhdGEpIHsgIFxuICAgICAgY29uZmlnLl9maW5pc2hGZXRjaChKU09OLnBhcnNlKGNvbmZpZ0RhdGEpKTtcbiAgICAgIFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyBhIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+c3VjY2VzczogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBnZXQgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAgICogICA8bGk+ZXJyb3I6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZ2V0IGZhaWxzLlxuICAgKiA8L3VsPlxuICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIGEgbmV3bHktY3JlYXRlZFxuICAgKiAgICAgY29uZmlndXJhdGlvbiBvYmplY3Qgd2hlbiB0aGUgZ2V0IGNvbXBsZXRlcy5cbiAgICovXG4gIFBhcnNlLkNvbmZpZy5nZXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgIHJvdXRlOiBcImNvbmZpZ1wiLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYgKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UucGFyYW1zKSB7XG4gICAgICAgIHZhciBlcnJvck9iamVjdCA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgXCJDb25maWcgSlNPTiByZXNwb25zZSBpbnZhbGlkLlwiKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3JPYmplY3QpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29uZmlnID0gbmV3IFBhcnNlLkNvbmZpZygpO1xuICAgICAgY29uZmlnLl9maW5pc2hGZXRjaChyZXNwb25zZSk7XG4gICAgICBQYXJzZS5Db25maWcuX2N1cnJlbnRDb25maWcgPSBjb25maWc7XG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIFBhcnNlLkNvbmZpZy5wcm90b3R5cGUgPSB7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBIVE1MLWVzY2FwZWQgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqL1xuICAgIGVzY2FwZTogZnVuY3Rpb24oYXR0cikge1xuICAgICAgdmFyIGh0bWwgPSB0aGlzLl9lc2NhcGVkQXR0cmlidXRlc1thdHRyXTtcbiAgICAgIGlmIChodG1sKSB7XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgICAgfVxuICAgICAgdmFyIHZhbCA9IHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgICAgIHZhciBlc2NhcGVkO1xuICAgICAgaWYgKFBhcnNlLl9pc051bGxPclVuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgIGVzY2FwZWQgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVzY2FwZWQgPSBfLmVzY2FwZSh2YWwudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9lc2NhcGVkQXR0cmlidXRlc1thdHRyXSA9IGVzY2FwZWQ7XG4gICAgICByZXR1cm4gZXNjYXBlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIFRoZSBuYW1lIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgfSxcblxuICAgIF9maW5pc2hGZXRjaDogZnVuY3Rpb24oc2VydmVyRGF0YSkge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gUGFyc2UuX2RlY29kZShudWxsLCBfLmNsb25lKHNlcnZlckRhdGEucGFyYW1zKSk7XG4gICAgICBpZiAoIVBhcnNlLlN0b3JhZ2UuYXN5bmMpIHtcbiAgICAgICAgLy8gV2Ugb25seSBwcm92aWRlIGxvY2FsIGNhY2hpbmcgb2YgY29uZmlnIHdpdGggc3luY2hyb25vdXMgU3RvcmFnZVxuICAgICAgICBQYXJzZS5TdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICBQYXJzZS5fZ2V0UGFyc2VQYXRoKFBhcnNlLkNvbmZpZy5fQ1VSUkVOVF9DT05GSUdfS0VZKSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHNlcnZlckRhdGEpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUGFyc2UuQ29uZmlnLl9jdXJyZW50Q29uZmlnID0gbnVsbDtcblxuICBQYXJzZS5Db25maWcuX0NVUlJFTlRfQ09ORklHX0tFWSA9IFwiY3VycmVudENvbmZpZ1wiO1xuXG59KHRoaXMpKTtcblxuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IFBhcnNlLkVycm9yIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBjb2RlIGFuZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY29kZSBBbiBlcnJvciBjb2RlIGNvbnN0YW50IGZyb20gPGNvZGU+UGFyc2UuRXJyb3I8L2NvZGU+LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBBIGRldGFpbGVkIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvci5cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkNsYXNzIHVzZWQgZm9yIGFsbCBvYmplY3RzIHBhc3NlZCB0byBlcnJvciBjYWxsYmFja3MuPC9wPlxuICAgKi9cbiAgUGFyc2UuRXJyb3IgPSBmdW5jdGlvbihjb2RlLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLkVycm9yLCAvKiogQGxlbmRzIFBhcnNlLkVycm9yICovIHtcbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgc29tZSBlcnJvciBvdGhlciB0aGFuIHRob3NlIGVudW1lcmF0ZWQgaGVyZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBPVEhFUl9DQVVTRTogLTEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBzb21ldGhpbmcgaGFzIGdvbmUgd3Jvbmcgd2l0aCB0aGUgc2VydmVyLlxuICAgICAqIElmIHlvdSBnZXQgdGhpcyBlcnJvciBjb2RlLCBpdCBpcyBQYXJzZSdzIGZhdWx0LiBDb250YWN0IHVzIGF0IFxuICAgICAqIGh0dHBzOi8vcGFyc2UuY29tL2hlbHBcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlRFUk5BTF9TRVJWRVJfRVJST1I6IDEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIFBhcnNlIHNlcnZlcnMgZmFpbGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIENPTk5FQ1RJT05fRkFJTEVEOiAxMDAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhlIHNwZWNpZmllZCBvYmplY3QgZG9lc24ndCBleGlzdC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBPQkpFQ1RfTk9UX0ZPVU5EOiAxMDEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgeW91IHRyaWVkIHRvIHF1ZXJ5IHdpdGggYSBkYXRhdHlwZSB0aGF0IGRvZXNuJ3RcbiAgICAgKiBzdXBwb3J0IGl0LCBsaWtlIGV4YWN0IG1hdGNoaW5nIGFuIGFycmF5IG9yIG9iamVjdC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX1FVRVJZOiAxMDIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSBtaXNzaW5nIG9yIGludmFsaWQgY2xhc3NuYW1lLiBDbGFzc25hbWVzIGFyZVxuICAgICAqIGNhc2Utc2Vuc2l0aXZlLiBUaGV5IG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgYW5kIGEtekEtWjAtOV8gYXJlIHRoZVxuICAgICAqIG9ubHkgdmFsaWQgY2hhcmFjdGVycy5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0NMQVNTX05BTUU6IDEwMyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiB1bnNwZWNpZmllZCBvYmplY3QgaWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTUlTU0lOR19PQkpFQ1RfSUQ6IDEwNCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIGtleSBuYW1lLiBLZXlzIGFyZSBjYXNlLXNlbnNpdGl2ZS4gVGhleVxuICAgICAqIG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgYW5kIGEtekEtWjAtOV8gYXJlIHRoZSBvbmx5IHZhbGlkIGNoYXJhY3RlcnMuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9LRVlfTkFNRTogMTA1LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgbWFsZm9ybWVkIHBvaW50ZXIuIFlvdSBzaG91bGQgbm90IHNlZSB0aGlzIHVubGVzc1xuICAgICAqIHlvdSBoYXZlIGJlZW4gbXVja2luZyBhYm91dCBjaGFuZ2luZyBpbnRlcm5hbCBQYXJzZSBjb2RlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfUE9JTlRFUjogMTA2LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYmFkbHkgZm9ybWVkIEpTT04gd2FzIHJlY2VpdmVkIHVwc3RyZWFtLiBUaGlzXG4gICAgICogZWl0aGVyIGluZGljYXRlcyB5b3UgaGF2ZSBkb25lIHNvbWV0aGluZyB1bnVzdWFsIHdpdGggbW9kaWZ5aW5nIGhvd1xuICAgICAqIHRoaW5ncyBlbmNvZGUgdG8gSlNPTiwgb3IgdGhlIG5ldHdvcmsgaXMgZmFpbGluZyBiYWRseS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0pTT046IDEwNyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBmZWF0dXJlIHlvdSB0cmllZCB0byBhY2Nlc3MgaXMgb25seVxuICAgICAqIGF2YWlsYWJsZSBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIENPTU1BTkRfVU5BVkFJTEFCTEU6IDEwOCxcblxuICAgIC8qKlxuICAgICAqIFlvdSBtdXN0IGNhbGwgUGFyc2UuaW5pdGlhbGl6ZSBiZWZvcmUgdXNpbmcgdGhlIFBhcnNlIGxpYnJhcnkuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTk9UX0lOSVRJQUxJWkVEOiAxMDksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIGZpZWxkIHdhcyBzZXQgdG8gYW4gaW5jb25zaXN0ZW50IHR5cGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5DT1JSRUNUX1RZUEU6IDExMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIGNoYW5uZWwgbmFtZS4gQSBjaGFubmVsIG5hbWUgaXMgZWl0aGVyXG4gICAgICogYW4gZW1wdHkgc3RyaW5nICh0aGUgYnJvYWRjYXN0IGNoYW5uZWwpIG9yIGNvbnRhaW5zIG9ubHkgYS16QS1aMC05X1xuICAgICAqIGNoYXJhY3RlcnMgYW5kIHN0YXJ0cyB3aXRoIGEgbGV0dGVyLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfQ0hBTk5FTF9OQU1FOiAxMTIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBwdXNoIGlzIG1pc2NvbmZpZ3VyZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgUFVTSF9NSVNDT05GSUdVUkVEOiAxMTUsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgb2JqZWN0IGlzIHRvbyBsYXJnZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBPQkpFQ1RfVE9PX0xBUkdFOiAxMTYsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgb3BlcmF0aW9uIGlzbid0IGFsbG93ZWQgZm9yIGNsaWVudHMuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgT1BFUkFUSU9OX0ZPUkJJRERFTjogMTE5LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoZSByZXN1bHQgd2FzIG5vdCBmb3VuZCBpbiB0aGUgY2FjaGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgQ0FDSEVfTUlTUzogMTIwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYW4gaW52YWxpZCBrZXkgd2FzIHVzZWQgaW4gYSBuZXN0ZWRcbiAgICAgKiBKU09OT2JqZWN0LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfTkVTVEVEX0tFWTogMTIxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYW4gaW52YWxpZCBmaWxlbmFtZSB3YXMgdXNlZCBmb3IgUGFyc2VGaWxlLlxuICAgICAqIEEgdmFsaWQgZmlsZSBuYW1lIGNvbnRhaW5zIG9ubHkgYS16QS1aMC05Xy4gY2hhcmFjdGVycyBhbmQgaXMgYmV0d2VlbiAxXG4gICAgICogYW5kIDEyOCBjaGFyYWN0ZXJzLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfRklMRV9OQU1FOiAxMjIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gaW52YWxpZCBBQ0wgd2FzIHByb3ZpZGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfQUNMOiAxMjMsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgcmVxdWVzdCB0aW1lZCBvdXQgb24gdGhlIHNlcnZlci4gVHlwaWNhbGx5XG4gICAgICogdGhpcyBpbmRpY2F0ZXMgdGhhdCB0aGUgcmVxdWVzdCBpcyB0b28gZXhwZW5zaXZlIHRvIHJ1bi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBUSU1FT1VUOiAxMjQsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgZW1haWwgYWRkcmVzcyB3YXMgaW52YWxpZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0VNQUlMX0FERFJFU1M6IDEyNSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIG1pc3NpbmcgY29udGVudCB0eXBlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE1JU1NJTkdfQ09OVEVOVF9UWVBFOiAxMjYsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSBtaXNzaW5nIGNvbnRlbnQgbGVuZ3RoLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE1JU1NJTkdfQ09OVEVOVF9MRU5HVEg6IDEyNyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIGNvbnRlbnQgbGVuZ3RoLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfQ09OVEVOVF9MRU5HVEg6IDEyOCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIGZpbGUgdGhhdCB3YXMgdG9vIGxhcmdlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEZJTEVfVE9PX0xBUkdFOiAxMjksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gZXJyb3Igc2F2aW5nIGEgZmlsZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBGSUxFX1NBVkVfRVJST1I6IDEzMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdW5pcXVlIGZpZWxkIHdhcyBnaXZlbiBhIHZhbHVlIHRoYXQgaXNcbiAgICAgKiBhbHJlYWR5IHRha2VuLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIERVUExJQ0FURV9WQUxVRTogMTM3LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSByb2xlJ3MgbmFtZSBpcyBpbnZhbGlkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfUk9MRV9OQU1FOiAxMzksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhbiBhcHBsaWNhdGlvbiBxdW90YSB3YXMgZXhjZWVkZWQuICBVcGdyYWRlIHRvXG4gICAgICogcmVzb2x2ZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBFWENFRURFRF9RVU9UQTogMTQwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSBDbG91ZCBDb2RlIHNjcmlwdCBmYWlsZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgU0NSSVBUX0ZBSUxFRDogMTQxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSBDbG91ZCBDb2RlIHZhbGlkYXRpb24gZmFpbGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFZBTElEQVRJT05fRVJST1I6IDE0MixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGludmFsaWQgaW1hZ2UgZGF0YSB3YXMgcHJvdmlkZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9JTUFHRV9EQVRBOiAxNTAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gdW5zYXZlZCBmaWxlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFVOU0FWRURfRklMRV9FUlJPUjogMTUxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQgcHVzaCB0aW1lLlxuICAgICAqL1xuICAgIElOVkFMSURfUFVTSF9USU1FX0VSUk9SOiAxNTIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gZXJyb3IgZGVsZXRpbmcgYSBmaWxlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEZJTEVfREVMRVRFX0VSUk9SOiAxNTMsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgYXBwbGljYXRpb24gaGFzIGV4Y2VlZGVkIGl0cyByZXF1ZXN0XG4gICAgICogbGltaXQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgUkVRVUVTVF9MSU1JVF9FWENFRURFRDogMTU1LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQgZXZlbnQgbmFtZS5cbiAgICAgKi9cbiAgICBJTlZBTElEX0VWRU5UX05BTUU6IDE2MCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSB1c2VybmFtZSBpcyBtaXNzaW5nIG9yIGVtcHR5LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFVTRVJOQU1FX01JU1NJTkc6IDIwMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBwYXNzd29yZCBpcyBtaXNzaW5nIG9yIGVtcHR5LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFBBU1NXT1JEX01JU1NJTkc6IDIwMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSB1c2VybmFtZSBoYXMgYWxyZWFkeSBiZWVuIHRha2VuLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFVTRVJOQU1FX1RBS0VOOiAyMDIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgZW1haWwgaGFzIGFscmVhZHkgYmVlbiB0YWtlbi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBFTUFJTF9UQUtFTjogMjAzLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGVtYWlsIGlzIG1pc3NpbmcsIGJ1dCBtdXN0IGJlIHNwZWNpZmllZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBFTUFJTF9NSVNTSU5HOiAyMDQsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgd2l0aCB0aGUgc3BlY2lmaWVkIGVtYWlsIHdhcyBub3QgZm91bmQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRU1BSUxfTk9UX0ZPVU5EOiAyMDUsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgb2JqZWN0IHdpdGhvdXQgYSB2YWxpZCBzZXNzaW9uIGNvdWxkXG4gICAgICogbm90IGJlIGFsdGVyZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgU0VTU0lPTl9NSVNTSU5HOiAyMDYsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgY2FuIG9ubHkgYmUgY3JlYXRlZCB0aHJvdWdoIHNpZ251cC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBNVVNUX0NSRUFURV9VU0VSX1RIUk9VR0hfU0lHTlVQOiAyMDcsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhbiBhbiBhY2NvdW50IGJlaW5nIGxpbmtlZCBpcyBhbHJlYWR5IGxpbmtlZFxuICAgICAqIHRvIGFub3RoZXIgdXNlci5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBBQ0NPVU5UX0FMUkVBRFlfTElOS0VEOiAyMDgsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgY3VycmVudCBzZXNzaW9uIHRva2VuIGlzIGludmFsaWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9TRVNTSU9OX1RPS0VOOiAyMDksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgY2Fubm90IGJlIGxpbmtlZCB0byBhbiBhY2NvdW50IGJlY2F1c2VcbiAgICAgKiB0aGF0IGFjY291bnQncyBpZCBjb3VsZCBub3QgYmUgZm91bmQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTElOS0VEX0lEX01JU1NJTkc6IDI1MCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdXNlciB3aXRoIGEgbGlua2VkIChlLmcuIEZhY2Vib29rKSBhY2NvdW50XG4gICAgICogaGFzIGFuIGludmFsaWQgc2Vzc2lvbi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0xJTktFRF9TRVNTSU9OOiAyNTEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHNlcnZpY2UgYmVpbmcgbGlua2VkIChlLmcuIEZhY2Vib29rIG9yXG4gICAgICogVHdpdHRlcikgaXMgdW5zdXBwb3J0ZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgVU5TVVBQT1JURURfU0VSVklDRTogMjUyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlcmUgd2VyZSBtdWx0aXBsZSBlcnJvcnMuIEFnZ3JlZ2F0ZSBlcnJvcnNcbiAgICAgKiBoYXZlIGFuIFwiZXJyb3JzXCIgcHJvcGVydHksIHdoaWNoIGlzIGFuIGFycmF5IG9mIGVycm9yIG9iamVjdHMgd2l0aCBtb3JlXG4gICAgICogZGV0YWlsIGFib3V0IGVhY2ggZXJyb3IgdGhhdCBvY2N1cnJlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBBR0dSRUdBVEVfRVJST1I6IDYwMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGUgY2xpZW50IHdhcyB1bmFibGUgdG8gcmVhZCBhbiBpbnB1dCBmaWxlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEZJTEVfUkVBRF9FUlJPUjogNjAxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgcmVhbCBlcnJvciBjb2RlIGlzIHVuYXZhaWxhYmxlIGJlY2F1c2VcbiAgICAgKiB3ZSBoYWQgdG8gdXNlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCB0byBhbGxvdyBDT1JTIHJlcXVlc3RzIGluXG4gICAgICogSW50ZXJuZXQgRXhwbG9yZXIsIHdoaWNoIHN0cmlwcyB0aGUgYm9keSBmcm9tIEhUVFAgcmVzcG9uc2VzIHRoYXQgaGF2ZVxuICAgICAqIGEgbm9uLTJYWCBzdGF0dXMgY29kZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBYX0RPTUFJTl9SRVFVRVNUOiA2MDJcbiAgfSk7XG5cbn0odGhpcykpO1xuXG4vKmdsb2JhbCBfOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdCA9IHRoaXM7XG4gIHZhciBQYXJzZSA9IChyb290LlBhcnNlIHx8IChyb290LlBhcnNlID0ge30pKTtcbiAgdmFyIGV2ZW50U3BsaXR0ZXIgPSAvXFxzKy87XG4gIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPlBhcnNlLkV2ZW50cyBpcyBhIGZvcmsgb2YgQmFja2JvbmUncyBFdmVudHMgbW9kdWxlLCBwcm92aWRlZCBmb3IgeW91clxuICAgKiBjb252ZW5pZW5jZS48L3A+XG4gICAqXG4gICAqIDxwPkEgbW9kdWxlIHRoYXQgY2FuIGJlIG1peGVkIGluIHRvIGFueSBvYmplY3QgaW4gb3JkZXIgdG8gcHJvdmlkZVxuICAgKiBpdCB3aXRoIGN1c3RvbSBldmVudHMuIFlvdSBtYXkgYmluZCBjYWxsYmFjayBmdW5jdGlvbnMgdG8gYW4gZXZlbnRcbiAgICogd2l0aCBgb25gLCBvciByZW1vdmUgdGhlc2UgZnVuY3Rpb25zIHdpdGggYG9mZmAuXG4gICAqIFRyaWdnZXJpbmcgYW4gZXZlbnQgZmlyZXMgYWxsIGNhbGxiYWNrcyBpbiB0aGUgb3JkZXIgdGhhdCBgb25gIHdhc1xuICAgKiBjYWxsZWQuXG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgICB2YXIgb2JqZWN0ID0ge307XG4gICAqICAgICBfLmV4dGVuZChvYmplY3QsIFBhcnNlLkV2ZW50cyk7XG4gICAqICAgICBvYmplY3Qub24oJ2V4cGFuZCcsIGZ1bmN0aW9uKCl7IGFsZXJ0KCdleHBhbmRlZCcpOyB9KTtcbiAgICogICAgIG9iamVjdC50cmlnZ2VyKCdleHBhbmQnKTs8L3ByZT48L3A+XG4gICAqXG4gICAqIDxwPkZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlXG4gICAqIDxhIGhyZWY9XCJodHRwOi8vZG9jdW1lbnRjbG91ZC5naXRodWIuY29tL2JhY2tib25lLyNFdmVudHNcIj5CYWNrYm9uZVxuICAgKiBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqL1xuICBQYXJzZS5FdmVudHMgPSB7XG4gICAgLyoqXG4gICAgICogQmluZCBvbmUgb3IgbW9yZSBzcGFjZSBzZXBhcmF0ZWQgZXZlbnRzLCBgZXZlbnRzYCwgdG8gYSBgY2FsbGJhY2tgXG4gICAgICogZnVuY3Rpb24uIFBhc3NpbmcgYFwiYWxsXCJgIHdpbGwgYmluZCB0aGUgY2FsbGJhY2sgdG8gYWxsIGV2ZW50cyBmaXJlZC5cbiAgICAgKi9cbiAgICBvbjogZnVuY3Rpb24oZXZlbnRzLCBjYWxsYmFjaywgY29udGV4dCkge1xuXG4gICAgICB2YXIgY2FsbHMsIGV2ZW50LCBub2RlLCB0YWlsLCBsaXN0O1xuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcbiAgICAgIGNhbGxzID0gdGhpcy5fY2FsbGJhY2tzIHx8ICh0aGlzLl9jYWxsYmFja3MgPSB7fSk7XG5cbiAgICAgIC8vIENyZWF0ZSBhbiBpbW11dGFibGUgY2FsbGJhY2sgbGlzdCwgYWxsb3dpbmcgdHJhdmVyc2FsIGR1cmluZ1xuICAgICAgLy8gbW9kaWZpY2F0aW9uLiAgVGhlIHRhaWwgaXMgYW4gZW1wdHkgb2JqZWN0IHRoYXQgd2lsbCBhbHdheXMgYmUgdXNlZFxuICAgICAgLy8gYXMgdGhlIG5leHQgbm9kZS5cbiAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB3aGlsZSAoZXZlbnQpIHtcbiAgICAgICAgbGlzdCA9IGNhbGxzW2V2ZW50XTtcbiAgICAgICAgbm9kZSA9IGxpc3QgPyBsaXN0LnRhaWwgOiB7fTtcbiAgICAgICAgbm9kZS5uZXh0ID0gdGFpbCA9IHt9O1xuICAgICAgICBub2RlLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICBub2RlLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIGNhbGxzW2V2ZW50XSA9IHt0YWlsOiB0YWlsLCBuZXh0OiBsaXN0ID8gbGlzdC5uZXh0IDogbm9kZX07XG4gICAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgb25lIG9yIG1hbnkgY2FsbGJhY2tzLiBJZiBgY29udGV4dGAgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgY2FsbGJhY2tzXG4gICAgICogd2l0aCB0aGF0IGZ1bmN0aW9uLiBJZiBgY2FsbGJhY2tgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrcyBmb3IgdGhlXG4gICAgICogZXZlbnQuIElmIGBldmVudHNgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGJvdW5kIGNhbGxiYWNrcyBmb3IgYWxsIGV2ZW50cy5cbiAgICAgKi9cbiAgICBvZmY6IGZ1bmN0aW9uKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgIHZhciBldmVudCwgY2FsbHMsIG5vZGUsIHRhaWwsIGNiLCBjdHg7XG5cbiAgICAgIC8vIE5vIGV2ZW50cywgb3IgcmVtb3ZpbmcgKmFsbCogZXZlbnRzLlxuICAgICAgaWYgKCEoY2FsbHMgPSB0aGlzLl9jYWxsYmFja3MpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghKGV2ZW50cyB8fCBjYWxsYmFjayB8fCBjb250ZXh0KSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBsaXN0ZWQgZXZlbnRzIGFuZCBjb250ZXh0cywgc3BsaWNpbmcgdGhlbSBvdXQgb2YgdGhlXG4gICAgICAvLyBsaW5rZWQgbGlzdCBvZiBjYWxsYmFja3MgaWYgYXBwcm9wcmlhdGUuXG4gICAgICBldmVudHMgPSBldmVudHMgPyBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcikgOiBPYmplY3Qua2V5cyhjYWxscyk7XG4gICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgd2hpbGUgKGV2ZW50KSB7XG4gICAgICAgIG5vZGUgPSBjYWxsc1tldmVudF07XG4gICAgICAgIGRlbGV0ZSBjYWxsc1tldmVudF07XG4gICAgICAgIGlmICghbm9kZSB8fCAhKGNhbGxiYWNrIHx8IGNvbnRleHQpKSB7XG4gICAgICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgbGlzdCwgb21pdHRpbmcgdGhlIGluZGljYXRlZCBjYWxsYmFja3MuXG4gICAgICAgIHRhaWwgPSBub2RlLnRhaWw7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIHdoaWxlIChub2RlICE9PSB0YWlsKSB7XG4gICAgICAgICAgY2IgPSBub2RlLmNhbGxiYWNrO1xuICAgICAgICAgIGN0eCA9IG5vZGUuY29udGV4dDtcbiAgICAgICAgICBpZiAoKGNhbGxiYWNrICYmIGNiICE9PSBjYWxsYmFjaykgfHwgKGNvbnRleHQgJiYgY3R4ICE9PSBjb250ZXh0KSkge1xuICAgICAgICAgICAgdGhpcy5vbihldmVudCwgY2IsIGN0eCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQ2FsbGJhY2tzIGFyZVxuICAgICAqIHBhc3NlZCB0aGUgc2FtZSBhcmd1bWVudHMgYXMgYHRyaWdnZXJgIGlzLCBhcGFydCBmcm9tIHRoZSBldmVudCBuYW1lXG4gICAgICogKHVubGVzcyB5b3UncmUgbGlzdGVuaW5nIG9uIGBcImFsbFwiYCwgd2hpY2ggd2lsbCBjYXVzZSB5b3VyIGNhbGxiYWNrIHRvXG4gICAgICogcmVjZWl2ZSB0aGUgdHJ1ZSBuYW1lIG9mIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgYXJndW1lbnQpLlxuICAgICAqL1xuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgdmFyIGV2ZW50LCBub2RlLCBjYWxscywgdGFpbCwgYXJncywgYWxsLCByZXN0O1xuICAgICAgaWYgKCEoY2FsbHMgPSB0aGlzLl9jYWxsYmFja3MpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgYWxsID0gY2FsbHMuYWxsO1xuICAgICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuICAgICAgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgLy8gRm9yIGVhY2ggZXZlbnQsIHdhbGsgdGhyb3VnaCB0aGUgbGlua2VkIGxpc3Qgb2YgY2FsbGJhY2tzIHR3aWNlLFxuICAgICAgLy8gZmlyc3QgdG8gdHJpZ2dlciB0aGUgZXZlbnQsIHRoZW4gdG8gdHJpZ2dlciBhbnkgYFwiYWxsXCJgIGNhbGxiYWNrcy5cbiAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB3aGlsZSAoZXZlbnQpIHtcbiAgICAgICAgbm9kZSA9IGNhbGxzW2V2ZW50XTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0YWlsID0gbm9kZS50YWlsO1xuICAgICAgICAgIHdoaWxlICgobm9kZSA9IG5vZGUubmV4dCkgIT09IHRhaWwpIHtcbiAgICAgICAgICAgIG5vZGUuY2FsbGJhY2suYXBwbHkobm9kZS5jb250ZXh0IHx8IHRoaXMsIHJlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBub2RlID0gYWxsO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIHRhaWwgPSBub2RlLnRhaWw7XG4gICAgICAgICAgYXJncyA9IFtldmVudF0uY29uY2F0KHJlc3QpO1xuICAgICAgICAgIHdoaWxlICgobm9kZSA9IG5vZGUubmV4dCkgIT09IHRhaWwpIHtcbiAgICAgICAgICAgIG5vZGUuY2FsbGJhY2suYXBwbHkobm9kZS5jb250ZXh0IHx8IHRoaXMsIGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07ICBcblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBQYXJzZS5FdmVudHMuYmluZCA9IFBhcnNlLkV2ZW50cy5vbjtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBQYXJzZS5FdmVudHMudW5iaW5kID0gUGFyc2UuRXZlbnRzLm9mZjtcbn0uY2FsbCh0aGlzKSk7XG5cblxuLypnbG9iYWwgbmF2aWdhdG9yOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBHZW9Qb2ludCB3aXRoIGFueSBvZiB0aGUgZm9sbG93aW5nIGZvcm1zOjxicj5cbiAgICogICA8cHJlPlxuICAgKiAgIG5ldyBHZW9Qb2ludChvdGhlckdlb1BvaW50KVxuICAgKiAgIG5ldyBHZW9Qb2ludCgzMCwgMzApXG4gICAqICAgbmV3IEdlb1BvaW50KFszMCwgMzBdKVxuICAgKiAgIG5ldyBHZW9Qb2ludCh7bGF0aXR1ZGU6IDMwLCBsb25naXR1ZGU6IDMwfSlcbiAgICogICBuZXcgR2VvUG9pbnQoKSAgLy8gZGVmYXVsdHMgdG8gKDAsIDApXG4gICAqICAgPC9wcmU+XG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5SZXByZXNlbnRzIGEgbGF0aXR1ZGUgLyBsb25naXR1ZGUgcG9pbnQgdGhhdCBtYXkgYmUgYXNzb2NpYXRlZFxuICAgKiB3aXRoIGEga2V5IGluIGEgUGFyc2VPYmplY3Qgb3IgdXNlZCBhcyBhIHJlZmVyZW5jZSBwb2ludCBmb3IgZ2VvIHF1ZXJpZXMuXG4gICAqIFRoaXMgYWxsb3dzIHByb3hpbWl0eS1iYXNlZCBxdWVyaWVzIG9uIHRoZSBrZXkuPC9wPlxuICAgKlxuICAgKiA8cD5Pbmx5IG9uZSBrZXkgaW4gYSBjbGFzcyBtYXkgY29udGFpbiBhIEdlb1BvaW50LjwvcD5cbiAgICpcbiAgICogPHA+RXhhbXBsZTo8cHJlPlxuICAgKiAgIHZhciBwb2ludCA9IG5ldyBQYXJzZS5HZW9Qb2ludCgzMC4wLCAtMjAuMCk7XG4gICAqICAgdmFyIG9iamVjdCA9IG5ldyBQYXJzZS5PYmplY3QoXCJQbGFjZU9iamVjdFwiKTtcbiAgICogICBvYmplY3Quc2V0KFwibG9jYXRpb25cIiwgcG9pbnQpO1xuICAgKiAgIG9iamVjdC5zYXZlKCk7PC9wcmU+PC9wPlxuICAgKi9cbiAgUGFyc2UuR2VvUG9pbnQgPSBmdW5jdGlvbihhcmcxLCBhcmcyKSB7XG4gICAgaWYgKF8uaXNBcnJheShhcmcxKSkge1xuICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKGFyZzFbMF0sIGFyZzFbMV0pO1xuICAgICAgdGhpcy5sYXRpdHVkZSA9IGFyZzFbMF07XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IGFyZzFbMV07XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGFyZzEpKSB7XG4gICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUoYXJnMS5sYXRpdHVkZSwgYXJnMS5sb25naXR1ZGUpO1xuICAgICAgdGhpcy5sYXRpdHVkZSA9IGFyZzEubGF0aXR1ZGU7XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IGFyZzEubG9uZ2l0dWRlO1xuICAgIH0gZWxzZSBpZiAoXy5pc051bWJlcihhcmcxKSAmJiBfLmlzTnVtYmVyKGFyZzIpKSB7XG4gICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUoYXJnMSwgYXJnMik7XG4gICAgICB0aGlzLmxhdGl0dWRlID0gYXJnMTtcbiAgICAgIHRoaXMubG9uZ2l0dWRlID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXRpdHVkZSA9IDA7XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IDA7XG4gICAgfVxuXG4gICAgLy8gQWRkIHByb3BlcnRpZXMgc28gdGhhdCBhbnlvbmUgdXNpbmcgV2Via2l0IG9yIE1vemlsbGEgd2lsbCBnZXQgYW4gZXJyb3JcbiAgICAvLyBpZiB0aGV5IHRyeSB0byBzZXQgdmFsdWVzIHRoYXQgYXJlIG91dCBvZiBib3VuZHMuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLl9fZGVmaW5lR2V0dGVyX18gJiYgdGhpcy5fX2RlZmluZVNldHRlcl9fKSB7XG4gICAgICAvLyBVc2UgX2xhdGl0dWRlIGFuZCBfbG9uZ2l0dWRlIHRvIGFjdHVhbGx5IHN0b3JlIHRoZSB2YWx1ZXMsIGFuZCBhZGRcbiAgICAgIC8vIGdldHRlcnMgYW5kIHNldHRlcnMgZm9yIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUuXG4gICAgICB0aGlzLl9sYXRpdHVkZSA9IHRoaXMubGF0aXR1ZGU7XG4gICAgICB0aGlzLl9sb25naXR1ZGUgPSB0aGlzLmxvbmdpdHVkZTtcbiAgICAgIHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcImxhdGl0dWRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fbGF0aXR1ZGU7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcImxvbmdpdHVkZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2xvbmdpdHVkZTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fX2RlZmluZVNldHRlcl9fKFwibGF0aXR1ZGVcIiwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZSh2YWwsIHNlbGYubG9uZ2l0dWRlKTtcbiAgICAgICAgc2VsZi5fbGF0aXR1ZGUgPSB2YWw7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX19kZWZpbmVTZXR0ZXJfXyhcImxvbmdpdHVkZVwiLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKHNlbGYubGF0aXR1ZGUsIHZhbCk7XG4gICAgICAgIHNlbGYuX2xvbmdpdHVkZSA9IHZhbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQGxlbmRzIFBhcnNlLkdlb1BvaW50LnByb3RvdHlwZVxuICAgKiBAcHJvcGVydHkge2Zsb2F0fSBsYXRpdHVkZSBOb3J0aC1zb3V0aCBwb3J0aW9uIG9mIHRoZSBjb29yZGluYXRlLCBpbiByYW5nZVxuICAgKiAgIFstOTAsIDkwXS4gIFRocm93cyBhbiBleGNlcHRpb24gaWYgc2V0IG91dCBvZiByYW5nZSBpbiBhIG1vZGVybiBicm93c2VyLlxuICAgKiBAcHJvcGVydHkge2Zsb2F0fSBsb25naXR1ZGUgRWFzdC13ZXN0IHBvcnRpb24gb2YgdGhlIGNvb3JkaW5hdGUsIGluIHJhbmdlXG4gICAqICAgWy0xODAsIDE4MF0uICBUaHJvd3MgaWYgc2V0IG91dCBvZiByYW5nZSBpbiBhIG1vZGVybiBicm93c2VyLlxuICAgKi9cblxuICAvKipcbiAgICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgZ2l2ZW4gbGF0LWxvbmcgaXMgb3V0IG9mIGJvdW5kcy5cbiAgICovXG4gIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZSA9IGZ1bmN0aW9uKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgICBpZiAobGF0aXR1ZGUgPCAtOTAuMCkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5HZW9Qb2ludCBsYXRpdHVkZSBcIiArIGxhdGl0dWRlICsgXCIgPCAtOTAuMC5cIjtcbiAgICB9XG4gICAgaWYgKGxhdGl0dWRlID4gOTAuMCkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5HZW9Qb2ludCBsYXRpdHVkZSBcIiArIGxhdGl0dWRlICsgXCIgPiA5MC4wLlwiO1xuICAgIH1cbiAgICBpZiAobG9uZ2l0dWRlIDwgLTE4MC4wKSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLkdlb1BvaW50IGxvbmdpdHVkZSBcIiArIGxvbmdpdHVkZSArIFwiIDwgLTE4MC4wLlwiO1xuICAgIH1cbiAgICBpZiAobG9uZ2l0dWRlID4gMTgwLjApIHtcbiAgICAgIHRocm93IFwiUGFyc2UuR2VvUG9pbnQgbG9uZ2l0dWRlIFwiICsgbG9uZ2l0dWRlICsgXCIgPiAxODAuMC5cIjtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBHZW9Qb2ludCB3aXRoIHRoZSB1c2VyJ3MgY3VycmVudCBsb2NhdGlvbiwgaWYgYXZhaWxhYmxlLlxuICAgKiBDYWxscyBvcHRpb25zLnN1Y2Nlc3Mgd2l0aCBhIG5ldyBHZW9Qb2ludCBpbnN0YW5jZSBvciBjYWxscyBvcHRpb25zLmVycm9yLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvciBjYWxsYmFja3MuXG4gICAqL1xuICBQYXJzZS5HZW9Qb2ludC5jdXJyZW50ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICBwcm9taXNlLnJlc29sdmUobmV3IFBhcnNlLkdlb1BvaW50KHtcbiAgICAgICAgbGF0aXR1ZGU6IGxvY2F0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgbG9uZ2l0dWRlOiBsb2NhdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICB9KSk7XG5cbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgUGFyc2UuR2VvUG9pbnQucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBHZW9Qb2ludCwgc3VpdGFibGUgZm9yIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiX190eXBlXCI6IFwiR2VvUG9pbnRcIixcbiAgICAgICAgbGF0aXR1ZGU6IHRoaXMubGF0aXR1ZGUsXG4gICAgICAgIGxvbmdpdHVkZTogdGhpcy5sb25naXR1ZGVcbiAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhpcyBHZW9Qb2ludCB0byBhbm90aGVyIGluIHJhZGlhbnMuXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgdGhlIG90aGVyIFBhcnNlLkdlb1BvaW50LlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICByYWRpYW5zVG86IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICB2YXIgZDJyID0gTWF0aC5QSSAvIDE4MC4wO1xuICAgICAgdmFyIGxhdDFyYWQgPSB0aGlzLmxhdGl0dWRlICogZDJyO1xuICAgICAgdmFyIGxvbmcxcmFkID0gdGhpcy5sb25naXR1ZGUgKiBkMnI7XG4gICAgICB2YXIgbGF0MnJhZCA9IHBvaW50LmxhdGl0dWRlICogZDJyO1xuICAgICAgdmFyIGxvbmcycmFkID0gcG9pbnQubG9uZ2l0dWRlICogZDJyO1xuICAgICAgdmFyIGRlbHRhTGF0ID0gbGF0MXJhZCAtIGxhdDJyYWQ7XG4gICAgICB2YXIgZGVsdGFMb25nID0gbG9uZzFyYWQgLSBsb25nMnJhZDtcbiAgICAgIHZhciBzaW5EZWx0YUxhdERpdjIgPSBNYXRoLnNpbihkZWx0YUxhdCAvIDIpO1xuICAgICAgdmFyIHNpbkRlbHRhTG9uZ0RpdjIgPSBNYXRoLnNpbihkZWx0YUxvbmcgLyAyKTtcbiAgICAgIC8vIFNxdWFyZSBvZiBoYWxmIHRoZSBzdHJhaWdodCBsaW5lIGNob3JkIGRpc3RhbmNlIGJldHdlZW4gYm90aCBwb2ludHMuXG4gICAgICB2YXIgYSA9ICgoc2luRGVsdGFMYXREaXYyICogc2luRGVsdGFMYXREaXYyKSArXG4gICAgICAgICAgICAgICAoTWF0aC5jb3MobGF0MXJhZCkgKiBNYXRoLmNvcyhsYXQycmFkKSAqXG4gICAgICAgICAgICAgICAgc2luRGVsdGFMb25nRGl2MiAqIHNpbkRlbHRhTG9uZ0RpdjIpKTtcbiAgICAgIGEgPSBNYXRoLm1pbigxLjAsIGEpO1xuICAgICAgcmV0dXJuIDIgKiBNYXRoLmFzaW4oTWF0aC5zcXJ0KGEpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSB0aGlzIEdlb1BvaW50IHRvIGFub3RoZXIgaW4ga2lsb21ldGVycy5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCB0aGUgb3RoZXIgUGFyc2UuR2VvUG9pbnQuXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGtpbG9tZXRlcnNUbzogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJhZGlhbnNUbyhwb2ludCkgKiA2MzcxLjA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhpcyBHZW9Qb2ludCB0byBhbm90aGVyIGluIG1pbGVzLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IHRoZSBvdGhlciBQYXJzZS5HZW9Qb2ludC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgbWlsZXNUbzogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJhZGlhbnNUbyhwb2ludCkgKiAzOTU4Ljg7XG4gICAgfVxuICB9O1xufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIG5hdmlnYXRvcjogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgdmFyIFBVQkxJQ19LRVkgPSBcIipcIjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBBQ0wuXG4gICAqIElmIG5vIGFyZ3VtZW50IGlzIGdpdmVuLCB0aGUgQUNMIGhhcyBubyBwZXJtaXNzaW9ucyBmb3IgYW55b25lLlxuICAgKiBJZiB0aGUgYXJndW1lbnQgaXMgYSBQYXJzZS5Vc2VyLCB0aGUgQUNMIHdpbGwgaGF2ZSByZWFkIGFuZCB3cml0ZVxuICAgKiAgIHBlcm1pc3Npb24gZm9yIG9ubHkgdGhhdCB1c2VyLlxuICAgKiBJZiB0aGUgYXJndW1lbnQgaXMgYW55IG90aGVyIEpTT04gb2JqZWN0LCB0aGF0IG9iamVjdCB3aWxsIGJlIGludGVycHJldHRlZFxuICAgKiAgIGFzIGEgc2VyaWFsaXplZCBBQ0wgY3JlYXRlZCB3aXRoIHRvSlNPTigpLlxuICAgKiBAc2VlIFBhcnNlLk9iamVjdCNzZXRBQ0xcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkFuIEFDTCwgb3IgQWNjZXNzIENvbnRyb2wgTGlzdCBjYW4gYmUgYWRkZWQgdG8gYW55XG4gICAqIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4gdG8gcmVzdHJpY3QgYWNjZXNzIHRvIG9ubHkgYSBzdWJzZXQgb2YgdXNlcnNcbiAgICogb2YgeW91ciBhcHBsaWNhdGlvbi48L3A+XG4gICAqL1xuICBQYXJzZS5BQ0wgPSBmdW5jdGlvbihhcmcxKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYucGVybWlzc2lvbnNCeUlkID0ge307XG4gICAgaWYgKF8uaXNPYmplY3QoYXJnMSkpIHtcbiAgICAgIGlmIChhcmcxIGluc3RhbmNlb2YgUGFyc2UuVXNlcikge1xuICAgICAgICBzZWxmLnNldFJlYWRBY2Nlc3MoYXJnMSwgdHJ1ZSk7XG4gICAgICAgIHNlbGYuc2V0V3JpdGVBY2Nlc3MoYXJnMSwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGFyZzEpKSB7XG4gICAgICAgICAgdGhyb3cgXCJQYXJzZS5BQ0woKSBjYWxsZWQgd2l0aCBhIGZ1bmN0aW9uLiAgRGlkIHlvdSBmb3JnZXQgKCk/XCI7XG4gICAgICAgIH1cbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYXJnMSwgZnVuY3Rpb24oYWNjZXNzTGlzdCwgdXNlcklkKSB7XG4gICAgICAgICAgaWYgKCFfLmlzU3RyaW5nKHVzZXJJZCkpIHtcbiAgICAgICAgICAgIHRocm93IFwiVHJpZWQgdG8gY3JlYXRlIGFuIEFDTCB3aXRoIGFuIGludmFsaWQgdXNlcklkLlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdID0ge307XG4gICAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYWNjZXNzTGlzdCwgZnVuY3Rpb24oYWxsb3dlZCwgcGVybWlzc2lvbikge1xuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb24gIT09IFwicmVhZFwiICYmIHBlcm1pc3Npb24gIT09IFwid3JpdGVcIikge1xuICAgICAgICAgICAgICB0aHJvdyBcIlRyaWVkIHRvIGNyZWF0ZSBhbiBBQ0wgd2l0aCBhbiBpbnZhbGlkIHBlcm1pc3Npb24gdHlwZS5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghXy5pc0Jvb2xlYW4oYWxsb3dlZCkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJUcmllZCB0byBjcmVhdGUgYW4gQUNMIHdpdGggYW4gaW52YWxpZCBwZXJtaXNzaW9uIHZhbHVlLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXVtwZXJtaXNzaW9uXSA9IGFsbG93ZWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIEpTT04tZW5jb2RlZCB2ZXJzaW9uIG9mIHRoZSBBQ0wuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8uY2xvbmUodGhpcy5wZXJtaXNzaW9uc0J5SWQpO1xuICB9O1xuXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuX3NldEFjY2VzcyA9IGZ1bmN0aW9uKGFjY2Vzc1R5cGUsIHVzZXJJZCwgYWxsb3dlZCkge1xuICAgIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Vc2VyKSB7XG4gICAgICB1c2VySWQgPSB1c2VySWQuaWQ7XG4gICAgfSBlbHNlIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICB1c2VySWQgPSBcInJvbGU6XCIgKyB1c2VySWQuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICBpZiAoIV8uaXNTdHJpbmcodXNlcklkKSkge1xuICAgICAgdGhyb3cgXCJ1c2VySWQgbXVzdCBiZSBhIHN0cmluZy5cIjtcbiAgICB9XG4gICAgaWYgKCFfLmlzQm9vbGVhbihhbGxvd2VkKSkge1xuICAgICAgdGhyb3cgXCJhbGxvd2VkIG11c3QgYmUgZWl0aGVyIHRydWUgb3IgZmFsc2UuXCI7XG4gICAgfVxuICAgIHZhciBwZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNCeUlkW3VzZXJJZF07XG4gICAgaWYgKCFwZXJtaXNzaW9ucykge1xuICAgICAgaWYgKCFhbGxvd2VkKSB7XG4gICAgICAgIC8vIFRoZSB1c2VyIGFscmVhZHkgZG9lc24ndCBoYXZlIHRoaXMgcGVybWlzc2lvbiwgc28gbm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXSA9IHBlcm1pc3Npb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhbGxvd2VkKSB7XG4gICAgICB0aGlzLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdW2FjY2Vzc1R5cGVdID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHBlcm1pc3Npb25zW2FjY2Vzc1R5cGVdO1xuICAgICAgaWYgKF8uaXNFbXB0eShwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgZGVsZXRlIHBlcm1pc3Npb25zW3VzZXJJZF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuX2dldEFjY2VzcyA9IGZ1bmN0aW9uKGFjY2Vzc1R5cGUsIHVzZXJJZCkge1xuICAgIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Vc2VyKSB7XG4gICAgICB1c2VySWQgPSB1c2VySWQuaWQ7XG4gICAgfSBlbHNlIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICB1c2VySWQgPSBcInJvbGU6XCIgKyB1c2VySWQuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICB2YXIgcGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdO1xuICAgIGlmICghcGVybWlzc2lvbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zW2FjY2Vzc1R5cGVdID8gdHJ1ZSA6IGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB0aGUgZ2l2ZW4gdXNlciBpcyBhbGxvd2VkIHRvIHJlYWQgdGhpcyBvYmplY3QuXG4gICAqIEBwYXJhbSB1c2VySWQgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuVXNlciBvciBpdHMgb2JqZWN0SWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZCBXaGV0aGVyIHRoYXQgdXNlciBzaG91bGQgaGF2ZSByZWFkIGFjY2Vzcy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0UmVhZEFjY2VzcyA9IGZ1bmN0aW9uKHVzZXJJZCwgYWxsb3dlZCkge1xuICAgIHRoaXMuX3NldEFjY2VzcyhcInJlYWRcIiwgdXNlcklkLCBhbGxvd2VkKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdGhlIGdpdmVuIHVzZXIgaWQgaXMgKmV4cGxpY2l0bHkqIGFsbG93ZWQgdG8gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogRXZlbiBpZiB0aGlzIHJldHVybnMgZmFsc2UsIHRoZSB1c2VyIG1heSBzdGlsbCBiZSBhYmxlIHRvIGFjY2VzcyBpdCBpZlxuICAgKiBnZXRQdWJsaWNSZWFkQWNjZXNzIHJldHVybnMgdHJ1ZSBvciBhIHJvbGUgdGhhdCB0aGUgdXNlciBiZWxvbmdzIHRvIGhhc1xuICAgKiB3cml0ZSBhY2Nlc3MuXG4gICAqIEBwYXJhbSB1c2VySWQgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuVXNlciBvciBpdHMgb2JqZWN0SWQsIG9yIGEgUGFyc2UuUm9sZS5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0UmVhZEFjY2VzcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRBY2Nlc3MoXCJyZWFkXCIsIHVzZXJJZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHRoZSBnaXZlbiB1c2VyIGlkIGlzIGFsbG93ZWQgdG8gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEBwYXJhbSB1c2VySWQgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuVXNlciBvciBpdHMgb2JqZWN0SWQsIG9yIGEgUGFyc2UuUm9sZS4uXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZCBXaGV0aGVyIHRoYXQgdXNlciBzaG91bGQgaGF2ZSB3cml0ZSBhY2Nlc3MuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFdyaXRlQWNjZXNzID0gZnVuY3Rpb24odXNlcklkLCBhbGxvd2VkKSB7XG4gICAgdGhpcy5fc2V0QWNjZXNzKFwid3JpdGVcIiwgdXNlcklkLCBhbGxvd2VkKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdGhlIGdpdmVuIHVzZXIgaWQgaXMgKmV4cGxpY2l0bHkqIGFsbG93ZWQgdG8gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEV2ZW4gaWYgdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgdXNlciBtYXkgc3RpbGwgYmUgYWJsZSB0byB3cml0ZSBpdCBpZlxuICAgKiBnZXRQdWJsaWNXcml0ZUFjY2VzcyByZXR1cm5zIHRydWUgb3IgYSByb2xlIHRoYXQgdGhlIHVzZXIgYmVsb25ncyB0byBoYXNcbiAgICogd3JpdGUgYWNjZXNzLlxuICAgKiBAcGFyYW0gdXNlcklkIEFuIGluc3RhbmNlIG9mIFBhcnNlLlVzZXIgb3IgaXRzIG9iamVjdElkLCBvciBhIFBhcnNlLlJvbGUuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFdyaXRlQWNjZXNzID0gZnVuY3Rpb24odXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEFjY2VzcyhcIndyaXRlXCIsIHVzZXJJZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHRoZSBwdWJsaWMgaXMgYWxsb3dlZCB0byByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWRcbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0UHVibGljUmVhZEFjY2VzcyA9IGZ1bmN0aW9uKGFsbG93ZWQpIHtcbiAgICB0aGlzLnNldFJlYWRBY2Nlc3MoUFVCTElDX0tFWSwgYWxsb3dlZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHRoZSBwdWJsaWMgaXMgYWxsb3dlZCB0byByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRQdWJsaWNSZWFkQWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVhZEFjY2VzcyhQVUJMSUNfS0VZKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHdoZXRoZXIgdGhlIHB1YmxpYyBpcyBhbGxvd2VkIHRvIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWRcbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0UHVibGljV3JpdGVBY2Nlc3MgPSBmdW5jdGlvbihhbGxvd2VkKSB7XG4gICAgdGhpcy5zZXRXcml0ZUFjY2VzcyhQVUJMSUNfS0VZLCBhbGxvd2VkKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdGhlIHB1YmxpYyBpcyBhbGxvd2VkIHRvIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRQdWJsaWNXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFdyaXRlQWNjZXNzKFBVQkxJQ19LRVkpO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHVzZXJzIGJlbG9uZ2luZyB0byB0aGUgZ2l2ZW4gcm9sZSBhcmUgYWxsb3dlZFxuICAgKiB0byByZWFkIHRoaXMgb2JqZWN0LiBFdmVuIGlmIHRoaXMgcmV0dXJucyBmYWxzZSwgdGhlIHJvbGUgbWF5XG4gICAqIHN0aWxsIGJlIGFibGUgdG8gd3JpdGUgaXQgaWYgYSBwYXJlbnQgcm9sZSBoYXMgcmVhZCBhY2Nlc3MuXG4gICAqIFxuICAgKiBAcGFyYW0gcm9sZSBUaGUgbmFtZSBvZiB0aGUgcm9sZSwgb3IgYSBQYXJzZS5Sb2xlIG9iamVjdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgcm9sZSBoYXMgcmVhZCBhY2Nlc3MuIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHRocm93cyB7U3RyaW5nfSBJZiByb2xlIGlzIG5laXRoZXIgYSBQYXJzZS5Sb2xlIG5vciBhIFN0cmluZy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0Um9sZVJlYWRBY2Nlc3MgPSBmdW5jdGlvbihyb2xlKSB7XG4gICAgaWYgKHJvbGUgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gdGhlIFN0cmluZyBuYW1lXG4gICAgICByb2xlID0gcm9sZS5nZXROYW1lKCk7XG4gICAgfVxuICAgIGlmIChfLmlzU3RyaW5nKHJvbGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSZWFkQWNjZXNzKFwicm9sZTpcIiArIHJvbGUpO1xuICAgIH1cbiAgICB0aHJvdyBcInJvbGUgbXVzdCBiZSBhIFBhcnNlLlJvbGUgb3IgYSBTdHJpbmdcIjtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBHZXQgd2hldGhlciB1c2VycyBiZWxvbmdpbmcgdG8gdGhlIGdpdmVuIHJvbGUgYXJlIGFsbG93ZWRcbiAgICogdG8gd3JpdGUgdGhpcyBvYmplY3QuIEV2ZW4gaWYgdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgcm9sZSBtYXlcbiAgICogc3RpbGwgYmUgYWJsZSB0byB3cml0ZSBpdCBpZiBhIHBhcmVudCByb2xlIGhhcyB3cml0ZSBhY2Nlc3MuXG4gICAqIFxuICAgKiBAcGFyYW0gcm9sZSBUaGUgbmFtZSBvZiB0aGUgcm9sZSwgb3IgYSBQYXJzZS5Sb2xlIG9iamVjdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgcm9sZSBoYXMgd3JpdGUgYWNjZXNzLiBmYWxzZSBvdGhlcndpc2UuXG4gICAqIEB0aHJvd3Mge1N0cmluZ30gSWYgcm9sZSBpcyBuZWl0aGVyIGEgUGFyc2UuUm9sZSBub3IgYSBTdHJpbmcuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFJvbGVXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKHJvbGUpIHtcbiAgICBpZiAocm9sZSBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIC8vIE5vcm1hbGl6ZSB0byB0aGUgU3RyaW5nIG5hbWVcbiAgICAgIHJvbGUgPSByb2xlLmdldE5hbWUoKTtcbiAgICB9XG4gICAgaWYgKF8uaXNTdHJpbmcocm9sZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFdyaXRlQWNjZXNzKFwicm9sZTpcIiArIHJvbGUpO1xuICAgIH1cbiAgICB0aHJvdyBcInJvbGUgbXVzdCBiZSBhIFBhcnNlLlJvbGUgb3IgYSBTdHJpbmdcIjtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB1c2VycyBiZWxvbmdpbmcgdG8gdGhlIGdpdmVuIHJvbGUgYXJlIGFsbG93ZWRcbiAgICogdG8gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogXG4gICAqIEBwYXJhbSByb2xlIFRoZSBuYW1lIG9mIHRoZSByb2xlLCBvciBhIFBhcnNlLlJvbGUgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWQgV2hldGhlciB0aGUgZ2l2ZW4gcm9sZSBjYW4gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogQHRocm93cyB7U3RyaW5nfSBJZiByb2xlIGlzIG5laXRoZXIgYSBQYXJzZS5Sb2xlIG5vciBhIFN0cmluZy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0Um9sZVJlYWRBY2Nlc3MgPSBmdW5jdGlvbihyb2xlLCBhbGxvd2VkKSB7XG4gICAgaWYgKHJvbGUgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gdGhlIFN0cmluZyBuYW1lXG4gICAgICByb2xlID0gcm9sZS5nZXROYW1lKCk7XG4gICAgfVxuICAgIGlmIChfLmlzU3RyaW5nKHJvbGUpKSB7XG4gICAgICB0aGlzLnNldFJlYWRBY2Nlc3MoXCJyb2xlOlwiICsgcm9sZSwgYWxsb3dlZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IFwicm9sZSBtdXN0IGJlIGEgUGFyc2UuUm9sZSBvciBhIFN0cmluZ1wiO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHVzZXJzIGJlbG9uZ2luZyB0byB0aGUgZ2l2ZW4gcm9sZSBhcmUgYWxsb3dlZFxuICAgKiB0byB3cml0ZSB0aGlzIG9iamVjdC5cbiAgICogXG4gICAqIEBwYXJhbSByb2xlIFRoZSBuYW1lIG9mIHRoZSByb2xlLCBvciBhIFBhcnNlLlJvbGUgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWQgV2hldGhlciB0aGUgZ2l2ZW4gcm9sZSBjYW4gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEB0aHJvd3Mge1N0cmluZ30gSWYgcm9sZSBpcyBuZWl0aGVyIGEgUGFyc2UuUm9sZSBub3IgYSBTdHJpbmcuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFJvbGVXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKHJvbGUsIGFsbG93ZWQpIHtcbiAgICBpZiAocm9sZSBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIC8vIE5vcm1hbGl6ZSB0byB0aGUgU3RyaW5nIG5hbWVcbiAgICAgIHJvbGUgPSByb2xlLmdldE5hbWUoKTtcbiAgICB9XG4gICAgaWYgKF8uaXNTdHJpbmcocm9sZSkpIHtcbiAgICAgIHRoaXMuc2V0V3JpdGVBY2Nlc3MoXCJyb2xlOlwiICsgcm9sZSwgYWxsb3dlZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IFwicm9sZSBtdXN0IGJlIGEgUGFyc2UuUm9sZSBvciBhIFN0cmluZ1wiO1xuICB9O1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEEgUGFyc2UuT3AgaXMgYW4gYXRvbWljIG9wZXJhdGlvbiB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgZmllbGQgaW4gYVxuICAgKiBQYXJzZS5PYmplY3QuIEZvciBleGFtcGxlLCBjYWxsaW5nIDxjb2RlPm9iamVjdC5zZXQoXCJmb29cIiwgXCJiYXJcIik8L2NvZGU+XG4gICAqIGlzIGFuIGV4YW1wbGUgb2YgYSBQYXJzZS5PcC5TZXQuIENhbGxpbmcgPGNvZGU+b2JqZWN0LnVuc2V0KFwiZm9vXCIpPC9jb2RlPlxuICAgKiBpcyBhIFBhcnNlLk9wLlVuc2V0LiBUaGVzZSBvcGVyYXRpb25zIGFyZSBzdG9yZWQgaW4gYSBQYXJzZS5PYmplY3QgYW5kXG4gICAqIHNlbnQgdG8gdGhlIHNlcnZlciBhcyBwYXJ0IG9mIDxjb2RlPm9iamVjdC5zYXZlKCk8L2NvZGU+IG9wZXJhdGlvbnMuXG4gICAqIEluc3RhbmNlcyBvZiBQYXJzZS5PcCBzaG91bGQgYmUgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBZb3Ugc2hvdWxkIG5vdCBjcmVhdGUgc3ViY2xhc3NlcyBvZiBQYXJzZS5PcCBvciBpbnN0YW50aWF0ZSBQYXJzZS5PcFxuICAgKiBkaXJlY3RseS5cbiAgICovXG4gIFBhcnNlLk9wID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5faW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIFBhcnNlLk9wLnByb3RvdHlwZSA9IHtcbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7fVxuICB9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLk9wLCB7XG4gICAgLyoqXG4gICAgICogVG8gY3JlYXRlIGEgbmV3IE9wLCBjYWxsIFBhcnNlLk9wLl9leHRlbmQoKTtcbiAgICAgKi9cbiAgICBfZXh0ZW5kOiBQYXJzZS5fZXh0ZW5kLFxuXG4gICAgLy8gQSBtYXAgb2YgX19vcCBzdHJpbmcgdG8gZGVjb2RlciBmdW5jdGlvbi5cbiAgICBfb3BEZWNvZGVyTWFwOiB7fSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIHRvIGNvbnZlcnQgYSBqc29uIG9iamVjdCB3aXRoIGFuIF9fb3AgZmllbGQgaW50byBhblxuICAgICAqIGluc3RhbmNlIG9mIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT3AuXG4gICAgICovXG4gICAgX3JlZ2lzdGVyRGVjb2RlcjogZnVuY3Rpb24ob3BOYW1lLCBkZWNvZGVyKSB7XG4gICAgICBQYXJzZS5PcC5fb3BEZWNvZGVyTWFwW29wTmFtZV0gPSBkZWNvZGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhIGpzb24gb2JqZWN0IGludG8gYW4gaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PcC5cbiAgICAgKi9cbiAgICBfZGVjb2RlOiBmdW5jdGlvbihqc29uKSB7XG4gICAgICB2YXIgZGVjb2RlciA9IFBhcnNlLk9wLl9vcERlY29kZXJNYXBbanNvbi5fX29wXTtcbiAgICAgIGlmIChkZWNvZGVyKSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVyKGpzb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8qXG4gICAqIEFkZCBhIGhhbmRsZXIgZm9yIEJhdGNoIG9wcy5cbiAgICovXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJCYXRjaFwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgdmFyIG9wID0gbnVsbDtcbiAgICBQYXJzZS5fYXJyYXlFYWNoKGpzb24ub3BzLCBmdW5jdGlvbihuZXh0T3ApIHtcbiAgICAgIG5leHRPcCA9IFBhcnNlLk9wLl9kZWNvZGUobmV4dE9wKTtcbiAgICAgIG9wID0gbmV4dE9wLl9tZXJnZVdpdGhQcmV2aW91cyhvcCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9wO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEEgU2V0IG9wZXJhdGlvbiBpbmRpY2F0ZXMgdGhhdCBlaXRoZXIgdGhlIGZpZWxkIHdhcyBjaGFuZ2VkIHVzaW5nXG4gICAqIFBhcnNlLk9iamVjdC5zZXQsIG9yIGl0IGlzIGEgbXV0YWJsZSBjb250YWluZXIgdGhhdCB3YXMgZGV0ZWN0ZWQgYXMgYmVpbmdcbiAgICogY2hhbmdlZC5cbiAgICovXG4gIFBhcnNlLk9wLlNldCA9IFBhcnNlLk9wLl9leHRlbmQoLyoqIEBsZW5kcyBQYXJzZS5PcC5TZXQucHJvdG90eXBlICovIHtcbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG5ldyB2YWx1ZSBvZiB0aGlzIGZpZWxkIGFmdGVyIHRoZSBzZXQuXG4gICAgICovXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFyc2UuX2VuY29kZSh0aGlzLnZhbHVlKCkpO1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBIHNlbnRpbmVsIHZhbHVlIHRoYXQgaXMgcmV0dXJuZWQgYnkgUGFyc2UuT3AuVW5zZXQuX2VzdGltYXRlIHRvXG4gICAqIGluZGljYXRlIHRoZSBmaWVsZCBzaG91bGQgYmUgZGVsZXRlZC4gQmFzaWNhbGx5LCBpZiB5b3UgZmluZCBfVU5TRVQgYXMgYVxuICAgKiB2YWx1ZSBpbiB5b3VyIG9iamVjdCwgeW91IHNob3VsZCByZW1vdmUgdGhhdCBrZXkuXG4gICAqL1xuICBQYXJzZS5PcC5fVU5TRVQgPSB7fTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEFuIFVuc2V0IG9wZXJhdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGlzIGZpZWxkIGhhcyBiZWVuIGRlbGV0ZWQgZnJvbSB0aGVcbiAgICogb2JqZWN0LlxuICAgKi9cbiAgUGFyc2UuT3AuVW5zZXQgPSBQYXJzZS5PcC5fZXh0ZW5kKC8qKiBAbGVuZHMgUGFyc2UuT3AuVW5zZXQucHJvdG90eXBlICovIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIkRlbGV0ZVwiIH07XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlKSB7XG4gICAgICByZXR1cm4gUGFyc2UuT3AuX1VOU0VUO1xuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkRlbGV0ZVwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5VbnNldCgpO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEFuIEluY3JlbWVudCBpcyBhbiBhdG9taWMgb3BlcmF0aW9uIHdoZXJlIHRoZSBudW1lcmljIHZhbHVlIGZvciB0aGUgZmllbGRcbiAgICogd2lsbCBiZSBpbmNyZWFzZWQgYnkgYSBnaXZlbiBhbW91bnQuXG4gICAqL1xuICBQYXJzZS5PcC5JbmNyZW1lbnQgPSBQYXJzZS5PcC5fZXh0ZW5kKFxuICAgICAgLyoqIEBsZW5kcyBQYXJzZS5PcC5JbmNyZW1lbnQucHJvdG90eXBlICovIHtcblxuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHRoaXMuX2Ftb3VudCA9IGFtb3VudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYW1vdW50IHRvIGluY3JlbWVudCBieS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBhbW91bnQgdG8gaW5jcmVtZW50IGJ5LlxuICAgICAqL1xuICAgIGFtb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYW1vdW50O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIkluY3JlbWVudFwiLCBhbW91bnQ6IHRoaXMuX2Ftb3VudCB9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlVuc2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMuYW1vdW50KCkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldChwcmV2aW91cy52YWx1ZSgpICsgdGhpcy5hbW91bnQoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuSW5jcmVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuSW5jcmVtZW50KHRoaXMuYW1vdW50KCkgKyBwcmV2aW91cy5hbW91bnQoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW1vdW50KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2xkVmFsdWUgKyB0aGlzLmFtb3VudCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkluY3JlbWVudFwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5JbmNyZW1lbnQoanNvbi5hbW91bnQpO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEFkZCBpcyBhbiBhdG9taWMgb3BlcmF0aW9uIHdoZXJlIHRoZSBnaXZlbiBvYmplY3RzIHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlXG4gICAqIGFycmF5IHRoYXQgaXMgc3RvcmVkIGluIHRoaXMgZmllbGQuXG4gICAqL1xuICBQYXJzZS5PcC5BZGQgPSBQYXJzZS5PcC5fZXh0ZW5kKC8qKiBAbGVuZHMgUGFyc2UuT3AuQWRkLnByb3RvdHlwZSAqLyB7XG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIHRoaXMuX29iamVjdHMgPSBvYmplY3RzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBvYmplY3RzIHRvIGJlIGFkZGVkIHRvIHRoZSBhcnJheS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9iamVjdHMgdG8gYmUgYWRkZWQgdG8gdGhlIGFycmF5LlxuICAgICAqL1xuICAgIG9iamVjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IF9fb3A6IFwiQWRkXCIsIG9iamVjdHM6IFBhcnNlLl9lbmNvZGUodGhpcy5vYmplY3RzKCkpIH07XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuVW5zZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5vYmplY3RzKCkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLl9lc3RpbWF0ZShwcmV2aW91cy52YWx1ZSgpKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuQWRkKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuQWRkKHByZXZpb3VzLm9iamVjdHMoKS5jb25jYXQodGhpcy5vYmplY3RzKCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gXy5jbG9uZSh0aGlzLm9iamVjdHMoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2xkVmFsdWUuY29uY2F0KHRoaXMub2JqZWN0cygpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJBZGRcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuQWRkKFBhcnNlLl9kZWNvZGUodW5kZWZpbmVkLCBqc29uLm9iamVjdHMpKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBZGRVbmlxdWUgaXMgYW4gYXRvbWljIG9wZXJhdGlvbiB3aGVyZSB0aGUgZ2l2ZW4gaXRlbXMgd2lsbCBiZSBhcHBlbmRlZCB0b1xuICAgKiB0aGUgYXJyYXkgdGhhdCBpcyBzdG9yZWQgaW4gdGhpcyBmaWVsZCBvbmx5IGlmIHRoZXkgd2VyZSBub3QgYWxyZWFkeVxuICAgKiBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAgICovXG4gIFBhcnNlLk9wLkFkZFVuaXF1ZSA9IFBhcnNlLk9wLl9leHRlbmQoXG4gICAgICAvKiogQGxlbmRzIFBhcnNlLk9wLkFkZFVuaXF1ZS5wcm90b3R5cGUgKi8ge1xuXG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIHRoaXMuX29iamVjdHMgPSBfLnVuaXEob2JqZWN0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG9iamVjdHMgdG8gYmUgYWRkZWQgdG8gdGhlIGFycmF5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgb2JqZWN0cyB0byBiZSBhZGRlZCB0byB0aGUgYXJyYXkuXG4gICAgICovXG4gICAgb2JqZWN0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0cztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgX19vcDogXCJBZGRVbmlxdWVcIiwgb2JqZWN0czogUGFyc2UuX2VuY29kZSh0aGlzLm9iamVjdHMoKSkgfTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5VbnNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLm9iamVjdHMoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuU2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMuX2VzdGltYXRlKHByZXZpb3VzLnZhbHVlKCkpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5BZGRVbmlxdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5BZGRVbmlxdWUodGhpcy5fZXN0aW1hdGUocHJldmlvdXMub2JqZWN0cygpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIF8uY2xvbmUodGhpcy5vYmplY3RzKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgY2FuJ3QganVzdCB0YWtlIHRoZSBfLnVuaXEoXy51bmlvbiguLi4pKSBvZiBvbGRWYWx1ZSBhbmRcbiAgICAgICAgLy8gdGhpcy5vYmplY3RzLCBiZWNhdXNlIHRoZSB1bmlxdWVuZXNzIG1heSBub3QgYXBwbHkgdG8gb2xkVmFsdWVcbiAgICAgICAgLy8gKGVzcGVjaWFsbHkgaWYgdGhlIG9sZFZhbHVlIHdhcyBzZXQgdmlhIC5zZXQoKSlcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gXy5jbG9uZShvbGRWYWx1ZSk7XG4gICAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5vYmplY3RzKCksIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QgJiYgb2JqLmlkKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2hpbmdPYmogPSBfLmZpbmQobmV3VmFsdWUsIGZ1bmN0aW9uKGFuT2JqKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoYW5PYmogaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpICYmIChhbk9iai5pZCA9PT0gb2JqLmlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaGluZ09iaikge1xuICAgICAgICAgICAgICBuZXdWYWx1ZS5wdXNoKG9iaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YobmV3VmFsdWUsIG1hdGNoaW5nT2JqKTtcbiAgICAgICAgICAgICAgbmV3VmFsdWVbaW5kZXhdID0gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMobmV3VmFsdWUsIG9iaikpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlLnB1c2gob2JqKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiQWRkVW5pcXVlXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLkFkZFVuaXF1ZShQYXJzZS5fZGVjb2RlKHVuZGVmaW5lZCwganNvbi5vYmplY3RzKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogUmVtb3ZlIGlzIGFuIGF0b21pYyBvcGVyYXRpb24gd2hlcmUgdGhlIGdpdmVuIG9iamVjdHMgd2lsbCBiZSByZW1vdmVkIGZyb21cbiAgICogdGhlIGFycmF5IHRoYXQgaXMgc3RvcmVkIGluIHRoaXMgZmllbGQuXG4gICAqL1xuICBQYXJzZS5PcC5SZW1vdmUgPSBQYXJzZS5PcC5fZXh0ZW5kKC8qKiBAbGVuZHMgUGFyc2UuT3AuUmVtb3ZlLnByb3RvdHlwZSAqLyB7XG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIHRoaXMuX29iamVjdHMgPSBfLnVuaXEob2JqZWN0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG9iamVjdHMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBhcnJheS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9iamVjdHMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBhcnJheS5cbiAgICAgKi9cbiAgICBvYmplY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYmplY3RzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIlJlbW92ZVwiLCBvYmplY3RzOiBQYXJzZS5fZW5jb2RlKHRoaXMub2JqZWN0cygpKSB9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlVuc2V0KSB7XG4gICAgICAgIHJldHVybiBwcmV2aW91cztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5TZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5fZXN0aW1hdGUocHJldmlvdXMudmFsdWUoKSkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlJlbW92ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlJlbW92ZShfLnVuaW9uKHByZXZpb3VzLm9iamVjdHMoKSwgdGhpcy5vYmplY3RzKCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSBfLmRpZmZlcmVuY2Uob2xkVmFsdWUsIHRoaXMub2JqZWN0cygpKTtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIHNhdmVkIFBhcnNlIE9iamVjdHMgYmVpbmcgcmVtb3ZlZCwgYWxzbyByZW1vdmUgdGhlbS5cbiAgICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLm9iamVjdHMoKSwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCAmJiBvYmouaWQpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gXy5yZWplY3QobmV3VmFsdWUsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAob3RoZXIgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpICYmIChvdGhlci5pZCA9PT0gb2JqLmlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJSZW1vdmVcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuUmVtb3ZlKFBhcnNlLl9kZWNvZGUodW5kZWZpbmVkLCBqc29uLm9iamVjdHMpKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBIFJlbGF0aW9uIG9wZXJhdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgZmllbGQgaXMgYW4gaW5zdGFuY2Ugb2ZcbiAgICogUGFyc2UuUmVsYXRpb24sIGFuZCBvYmplY3RzIGFyZSBiZWluZyBhZGRlZCB0bywgb3IgcmVtb3ZlZCBmcm9tLCB0aGF0XG4gICAqIHJlbGF0aW9uLlxuICAgKi9cbiAgUGFyc2UuT3AuUmVsYXRpb24gPSBQYXJzZS5PcC5fZXh0ZW5kKFxuICAgICAgLyoqIEBsZW5kcyBQYXJzZS5PcC5SZWxhdGlvbi5wcm90b3R5cGUgKi8ge1xuXG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKGFkZHMsIHJlbW92ZXMpIHtcbiAgICAgIHRoaXMuX3RhcmdldENsYXNzTmFtZSA9IG51bGw7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdmFyIHBvaW50ZXJUb0lkID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgICAgICBpZiAoIW9iamVjdC5pZCkge1xuICAgICAgICAgICAgdGhyb3cgXCJZb3UgY2FuJ3QgYWRkIGFuIHVuc2F2ZWQgUGFyc2UuT2JqZWN0IHRvIGEgcmVsYXRpb24uXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBzZWxmLl90YXJnZXRDbGFzc05hbWUgPSBvYmplY3QuY2xhc3NOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lICE9PSBvYmplY3QuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlRyaWVkIHRvIGNyZWF0ZSBhIFBhcnNlLlJlbGF0aW9uIHdpdGggMiBkaWZmZXJlbnQgdHlwZXM6IFwiICtcbiAgICAgICAgICAgICAgICAgIHNlbGYuX3RhcmdldENsYXNzTmFtZSArIFwiIGFuZCBcIiArIG9iamVjdC5jbGFzc05hbWUgKyBcIi5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG9iamVjdC5pZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfTtcblxuICAgICAgdGhpcy5yZWxhdGlvbnNUb0FkZCA9IF8udW5pcShfLm1hcChhZGRzLCBwb2ludGVyVG9JZCkpO1xuICAgICAgdGhpcy5yZWxhdGlvbnNUb1JlbW92ZSA9IF8udW5pcShfLm1hcChyZW1vdmVzLCBwb2ludGVyVG9JZCkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHVuZmV0Y2hlZCBQYXJzZS5PYmplY3QgdGhhdCBhcmUgYmVpbmcgYWRkZWQgdG8gdGhlXG4gICAgICogcmVsYXRpb24uXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgYWRkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaXMucmVsYXRpb25zVG9BZGQsIGZ1bmN0aW9uKG9iamVjdElkKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShzZWxmLl90YXJnZXRDbGFzc05hbWUpO1xuICAgICAgICBvYmplY3QuaWQgPSBvYmplY3RJZDtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHVuZmV0Y2hlZCBQYXJzZS5PYmplY3QgdGhhdCBhcmUgYmVpbmcgcmVtb3ZlZCBmcm9tXG4gICAgICogdGhlIHJlbGF0aW9uLlxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaXMucmVsYXRpb25zVG9SZW1vdmUsIGZ1bmN0aW9uKG9iamVjdElkKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShzZWxmLl90YXJnZXRDbGFzc05hbWUpO1xuICAgICAgICBvYmplY3QuaWQgPSBvYmplY3RJZDtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWRkcyA9IG51bGw7XG4gICAgICB2YXIgcmVtb3ZlcyA9IG51bGw7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgaWRUb1BvaW50ZXIgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4geyBfX3R5cGU6ICdQb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBzZWxmLl90YXJnZXRDbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZCB9O1xuICAgICAgfTtcbiAgICAgIHZhciBwb2ludGVycyA9IG51bGw7XG4gICAgICBpZiAodGhpcy5yZWxhdGlvbnNUb0FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBvaW50ZXJzID0gXy5tYXAodGhpcy5yZWxhdGlvbnNUb0FkZCwgaWRUb1BvaW50ZXIpO1xuICAgICAgICBhZGRzID0geyBcIl9fb3BcIjogXCJBZGRSZWxhdGlvblwiLCBcIm9iamVjdHNcIjogcG9pbnRlcnMgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVsYXRpb25zVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICBwb2ludGVycyA9IF8ubWFwKHRoaXMucmVsYXRpb25zVG9SZW1vdmUsIGlkVG9Qb2ludGVyKTtcbiAgICAgICAgcmVtb3ZlcyA9IHsgXCJfX29wXCI6IFwiUmVtb3ZlUmVsYXRpb25cIiwgXCJvYmplY3RzXCI6IHBvaW50ZXJzIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGRzICYmIHJlbW92ZXMpIHtcbiAgICAgICAgcmV0dXJuIHsgXCJfX29wXCI6IFwiQmF0Y2hcIiwgXCJvcHNcIjogW2FkZHMsIHJlbW92ZXNdfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFkZHMgfHwgcmVtb3ZlcyB8fCB7fTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5VbnNldCkge1xuICAgICAgICB0aHJvdyBcIllvdSBjYW4ndCBtb2RpZnkgYSByZWxhdGlvbiBhZnRlciBkZWxldGluZyBpdC5cIjtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5SZWxhdGlvbikge1xuICAgICAgICBpZiAocHJldmlvdXMuX3RhcmdldENsYXNzTmFtZSAmJlxuICAgICAgICAgICAgcHJldmlvdXMuX3RhcmdldENsYXNzTmFtZSAhPT0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgdGhyb3cgXCJSZWxhdGVkIG9iamVjdCBtdXN0IGJlIG9mIGNsYXNzIFwiICsgcHJldmlvdXMuX3RhcmdldENsYXNzTmFtZSArXG4gICAgICAgICAgICAgIFwiLCBidXQgXCIgKyB0aGlzLl90YXJnZXRDbGFzc05hbWUgKyBcIiB3YXMgcGFzc2VkIGluLlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXdBZGQgPSBfLnVuaW9uKF8uZGlmZmVyZW5jZShwcmV2aW91cy5yZWxhdGlvbnNUb0FkZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb25zVG9SZW1vdmUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aW9uc1RvQWRkKTtcbiAgICAgICAgdmFyIG5ld1JlbW92ZSA9IF8udW5pb24oXy5kaWZmZXJlbmNlKHByZXZpb3VzLnJlbGF0aW9uc1RvUmVtb3ZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbnNUb0FkZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb25zVG9SZW1vdmUpO1xuXG4gICAgICAgIHZhciBuZXdSZWxhdGlvbiA9IG5ldyBQYXJzZS5PcC5SZWxhdGlvbihuZXdBZGQsIG5ld1JlbW92ZSk7XG4gICAgICAgIG5ld1JlbGF0aW9uLl90YXJnZXRDbGFzc05hbWUgPSB0aGlzLl90YXJnZXRDbGFzc05hbWU7XG4gICAgICAgIHJldHVybiBuZXdSZWxhdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSwgb2JqZWN0LCBrZXkpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgdmFyIHJlbGF0aW9uID0gbmV3IFBhcnNlLlJlbGF0aW9uKG9iamVjdCwga2V5KTtcbiAgICAgICAgcmVsYXRpb24udGFyZ2V0Q2xhc3NOYW1lID0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgfSBlbHNlIGlmIChvbGRWYWx1ZSBpbnN0YW5jZW9mIFBhcnNlLlJlbGF0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgICBpZiAob2xkVmFsdWUudGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBpZiAob2xkVmFsdWUudGFyZ2V0Q2xhc3NOYW1lICE9PSB0aGlzLl90YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJSZWxhdGVkIG9iamVjdCBtdXN0IGJlIGEgXCIgKyBvbGRWYWx1ZS50YXJnZXRDbGFzc05hbWUgK1xuICAgICAgICAgICAgICAgICAgXCIsIGJ1dCBhIFwiICsgdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lICsgXCIgd2FzIHBhc3NlZCBpbi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2xkVmFsdWUudGFyZ2V0Q2xhc3NOYW1lID0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2xkVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiQWRkUmVsYXRpb25cIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuUmVsYXRpb24oUGFyc2UuX2RlY29kZSh1bmRlZmluZWQsIGpzb24ub2JqZWN0cyksIFtdKTtcbiAgfSk7XG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJSZW1vdmVSZWxhdGlvblwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5SZWxhdGlvbihbXSwgUGFyc2UuX2RlY29kZSh1bmRlZmluZWQsIGpzb24ub2JqZWN0cykpO1xuICB9KTtcblxufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgUmVsYXRpb24gZm9yIHRoZSBnaXZlbiBwYXJlbnQgb2JqZWN0IGFuZCBrZXkuIFRoaXNcbiAgICogY29uc3RydWN0b3Igc2hvdWxkIHJhcmVseSBiZSB1c2VkIGRpcmVjdGx5LCBidXQgcmF0aGVyIGNyZWF0ZWQgYnlcbiAgICogUGFyc2UuT2JqZWN0LnJlbGF0aW9uLlxuICAgKiBAcGFyYW0ge1BhcnNlLk9iamVjdH0gcGFyZW50IFRoZSBwYXJlbnQgb2YgdGhpcyByZWxhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IGZvciB0aGlzIHJlbGF0aW9uIG9uIHRoZSBwYXJlbnQuXG4gICAqIEBzZWUgUGFyc2UuT2JqZWN0I3JlbGF0aW9uXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5cbiAgICogQSBjbGFzcyB0aGF0IGlzIHVzZWQgdG8gYWNjZXNzIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgYSBtYW55LXRvLW1hbnlcbiAgICogcmVsYXRpb25zaGlwLiAgRWFjaCBpbnN0YW5jZSBvZiBQYXJzZS5SZWxhdGlvbiBpcyBhc3NvY2lhdGVkIHdpdGggYVxuICAgKiBwYXJ0aWN1bGFyIHBhcmVudCBvYmplY3QgYW5kIGtleS5cbiAgICogPC9wPlxuICAgKi9cbiAgUGFyc2UuUmVsYXRpb24gPSBmdW5jdGlvbihwYXJlbnQsIGtleSkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMudGFyZ2V0Q2xhc3NOYW1lID0gbnVsbDtcbiAgfTtcblxuICBQYXJzZS5SZWxhdGlvbi5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogTWFrZXMgc3VyZSB0aGF0IHRoaXMgcmVsYXRpb24gaGFzIHRoZSByaWdodCBwYXJlbnQgYW5kIGtleS5cbiAgICAgKi9cbiAgICBfZW5zdXJlUGFyZW50QW5kS2V5OiBmdW5jdGlvbihwYXJlbnQsIGtleSkge1xuICAgICAgdGhpcy5wYXJlbnQgPSB0aGlzLnBhcmVudCB8fCBwYXJlbnQ7XG4gICAgICB0aGlzLmtleSA9IHRoaXMua2V5IHx8IGtleTtcbiAgICAgIGlmICh0aGlzLnBhcmVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHRocm93IFwiSW50ZXJuYWwgRXJyb3IuIFJlbGF0aW9uIHJldHJpZXZlZCBmcm9tIHR3byBkaWZmZXJlbnQgT2JqZWN0cy5cIjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmtleSAhPT0ga2V5KSB7XG4gICAgICAgIHRocm93IFwiSW50ZXJuYWwgRXJyb3IuIFJlbGF0aW9uIHJldHJpZXZlZCBmcm9tIHR3byBkaWZmZXJlbnQga2V5cy5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIFBhcnNlLk9iamVjdCBvciBhbiBhcnJheSBvZiBQYXJzZS5PYmplY3RzIHRvIHRoZSByZWxhdGlvbi5cbiAgICAgKiBAcGFyYW0ge30gb2JqZWN0cyBUaGUgaXRlbSBvciBpdGVtcyB0byBhZGQuXG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihvYmplY3RzKSB7XG4gICAgICBpZiAoIV8uaXNBcnJheShvYmplY3RzKSkge1xuICAgICAgICBvYmplY3RzID0gW29iamVjdHNdO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhbmdlID0gbmV3IFBhcnNlLk9wLlJlbGF0aW9uKG9iamVjdHMsIFtdKTtcbiAgICAgIHRoaXMucGFyZW50LnNldCh0aGlzLmtleSwgY2hhbmdlKTtcbiAgICAgIHRoaXMudGFyZ2V0Q2xhc3NOYW1lID0gY2hhbmdlLl90YXJnZXRDbGFzc05hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBQYXJzZS5PYmplY3Qgb3IgYW4gYXJyYXkgb2YgUGFyc2UuT2JqZWN0cyBmcm9tIHRoaXMgcmVsYXRpb24uXG4gICAgICogQHBhcmFtIHt9IG9iamVjdHMgVGhlIGl0ZW0gb3IgaXRlbXMgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24ob2JqZWN0cykge1xuICAgICAgaWYgKCFfLmlzQXJyYXkob2JqZWN0cykpIHtcbiAgICAgICAgb2JqZWN0cyA9IFtvYmplY3RzXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYW5nZSA9IG5ldyBQYXJzZS5PcC5SZWxhdGlvbihbXSwgb2JqZWN0cyk7XG4gICAgICB0aGlzLnBhcmVudC5zZXQodGhpcy5rZXksIGNoYW5nZSk7XG4gICAgICB0aGlzLnRhcmdldENsYXNzTmFtZSA9IGNoYW5nZS5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvYmplY3Qgc3VpdGFibGUgZm9yIHNhdmluZyB0byBkaXNrLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgXCJfX3R5cGVcIjogXCJSZWxhdGlvblwiLCBcImNsYXNzTmFtZVwiOiB0aGlzLnRhcmdldENsYXNzTmFtZSB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgUGFyc2UuUXVlcnkgdGhhdCBpcyBsaW1pdGVkIHRvIG9iamVjdHMgaW4gdGhpc1xuICAgICAqIHJlbGF0aW9uLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fVxuICAgICAqL1xuICAgIHF1ZXJ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0YXJnZXRDbGFzcztcbiAgICAgIHZhciBxdWVyeTtcbiAgICAgIGlmICghdGhpcy50YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgdGFyZ2V0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzKHRoaXMucGFyZW50LmNsYXNzTmFtZSk7XG4gICAgICAgIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KHRhcmdldENsYXNzKTtcbiAgICAgICAgcXVlcnkuX2V4dHJhT3B0aW9ucy5yZWRpcmVjdENsYXNzTmFtZUZvcktleSA9IHRoaXMua2V5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzKHRoaXMudGFyZ2V0Q2xhc3NOYW1lKTtcbiAgICAgICAgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkodGFyZ2V0Q2xhc3MpO1xuICAgICAgfVxuICAgICAgcXVlcnkuX2FkZENvbmRpdGlvbihcIiRyZWxhdGVkVG9cIiwgXCJvYmplY3RcIiwgdGhpcy5wYXJlbnQuX3RvUG9pbnRlcigpKTtcbiAgICAgIHF1ZXJ5Ll9hZGRDb25kaXRpb24oXCIkcmVsYXRlZFRvXCIsIFwia2V5XCIsIHRoaXMua2V5KTtcblxuICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH1cbiAgfTtcbn0odGhpcykpO1xuXG4vKmdsb2JhbCB3aW5kb3c6IGZhbHNlLCBwcm9jZXNzOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQSBQcm9taXNlIGlzIHJldHVybmVkIGJ5IGFzeW5jIG1ldGhvZHMgYXMgYSBob29rIHRvIHByb3ZpZGUgY2FsbGJhY2tzIHRvIGJlXG4gICAqIGNhbGxlZCB3aGVuIHRoZSBhc3luYyB0YXNrIGlzIGZ1bGZpbGxlZC5cbiAgICpcbiAgICogPHA+VHlwaWNhbCB1c2FnZSB3b3VsZCBiZSBsaWtlOjxwcmU+XG4gICAqICAgIHF1ZXJ5LmZpbmQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICogICAgICByZXN1bHRzWzBdLnNldChcImZvb1wiLCBcImJhclwiKTtcbiAgICogICAgICByZXR1cm4gcmVzdWx0c1swXS5zYXZlQXN5bmMoKTtcbiAgICogICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICogICAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZWQgXCIgKyByZXN1bHQuaWQpO1xuICAgKiAgICB9KTtcbiAgICogPC9wcmU+PC9wPlxuICAgKlxuICAgKiBAc2VlIFBhcnNlLlByb21pc2UucHJvdG90eXBlLnRoZW5cbiAgICogQGNsYXNzXG4gICAqL1xuICBQYXJzZS5Qcm9taXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fcmVzb2x2ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9yZWplY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3Jlc29sdmVkQ2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fcmVqZWN0ZWRDYWxsYmFja3MgPSBbXTtcbiAgfTtcblxuICBfLmV4dGVuZChQYXJzZS5Qcm9taXNlLCAvKiogQGxlbmRzIFBhcnNlLlByb21pc2UgKi8ge1xuXG4gICAgX2lzUHJvbWlzZXNBUGx1c0NvbXBsaWFudDogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWZmIHRoZSBnaXZlbiBvYmplY3QgZnVsZmlscyB0aGUgUHJvbWlzZSBpbnRlcmZhY2UuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpczogZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgcmV0dXJuIHByb21pc2UgJiYgcHJvbWlzZS50aGVuICYmIF8uaXNGdW5jdGlvbihwcm9taXNlLnRoZW4pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIGEgZ2l2ZW4gdmFsdWUuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gdGhlIG5ldyBwcm9taXNlLlxuICAgICAqL1xuICAgIGFzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgcHJvbWlzZSB0aGF0IGlzIHJlamVjdGVkIHdpdGggYSBnaXZlbiBlcnJvci5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSB0aGUgbmV3IHByb21pc2UuXG4gICAgICovXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgcHJvbWlzZS5yZWplY3QuYXBwbHkocHJvbWlzZSwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgb2YgdGhlIGlucHV0IHByb21pc2VzXG4gICAgICogYXJlIHJlc29sdmVkLiBJZiBhbnkgcHJvbWlzZSBpbiB0aGUgbGlzdCBmYWlscywgdGhlbiB0aGUgcmV0dXJuZWQgcHJvbWlzZVxuICAgICAqIHdpbGwgZmFpbCB3aXRoIHRoZSBsYXN0IGVycm9yLiBJZiB0aGV5IGFsbCBzdWNjZWVkLCB0aGVuIHRoZSByZXR1cm5lZFxuICAgICAqIHByb21pc2Ugd2lsbCBzdWNjZWVkLCB3aXRoIHRoZSByZXN1bHRzIGJlaW5nIHRoZSByZXN1bHRzIG9mIGFsbCB0aGUgaW5wdXRcbiAgICAgKiBwcm9taXNlcy4gRm9yIGV4YW1wbGU6IDxwcmU+XG4gICAgICogICB2YXIgcDEgPSBQYXJzZS5Qcm9taXNlLmFzKDEpO1xuICAgICAqICAgdmFyIHAyID0gUGFyc2UuUHJvbWlzZS5hcygyKTtcbiAgICAgKiAgIHZhciBwMyA9IFBhcnNlLlByb21pc2UuYXMoMyk7XG4gICAgICpcbiAgICAgKiAgIFBhcnNlLlByb21pc2Uud2hlbihwMSwgcDIsIHAzKS50aGVuKGZ1bmN0aW9uKHIxLCByMiwgcjMpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjEpOyAgLy8gcHJpbnRzIDFcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjIpOyAgLy8gcHJpbnRzIDJcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjMpOyAgLy8gcHJpbnRzIDNcbiAgICAgKiAgIH0pOzwvcHJlPlxuICAgICAqXG4gICAgICogVGhlIGlucHV0IHByb21pc2VzIGNhbiBhbHNvIGJlIHNwZWNpZmllZCBhcyBhbiBhcnJheTogPHByZT5cbiAgICAgKiAgIHZhciBwcm9taXNlcyA9IFtwMSwgcDIsIHAzXTtcbiAgICAgKiAgIFBhcnNlLlByb21pc2Uud2hlbihwcm9taXNlcykudGhlbihmdW5jdGlvbihyMSwgcjIsIHIzKSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKHIxKTsgIC8vIHByaW50cyAxXG4gICAgICogICAgIGNvbnNvbGUubG9nKHIyKTsgIC8vIHByaW50cyAyXG4gICAgICogICAgIGNvbnNvbGUubG9nKHIzKTsgIC8vIHByaW50cyAzXG4gICAgICogICB9KTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhIGxpc3Qgb2YgcHJvbWlzZXMgdG8gd2FpdCBmb3IuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gdGhlIG5ldyBwcm9taXNlLlxuICAgICAqL1xuICAgIHdoZW46IGZ1bmN0aW9uKHByb21pc2VzKSB7XG4gICAgICAvLyBBbGxvdyBwYXNzaW5nIGluIFByb21pc2VzIGFzIHNlcGFyYXRlIGFyZ3VtZW50cyBpbnN0ZWFkIG9mIGFuIEFycmF5LlxuICAgICAgdmFyIG9iamVjdHM7XG4gICAgICBpZiAocHJvbWlzZXMgJiYgUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKHByb21pc2VzLmxlbmd0aCkpIHtcbiAgICAgICAgb2JqZWN0cyA9IGFyZ3VtZW50cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdHMgPSBwcm9taXNlcztcbiAgICAgIH1cblxuICAgICAgdmFyIHRvdGFsID0gb2JqZWN0cy5sZW5ndGg7XG4gICAgICB2YXIgaGFkRXJyb3IgPSBmYWxzZTtcbiAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICByZXN1bHRzLmxlbmd0aCA9IG9iamVjdHMubGVuZ3RoO1xuICAgICAgZXJyb3JzLmxlbmd0aCA9IG9iamVjdHMubGVuZ3RoO1xuXG4gICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMuYXBwbHkodGhpcywgcmVzdWx0cyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcblxuICAgICAgdmFyIHJlc29sdmVPbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdG90YWwgPSB0b3RhbCAtIDE7XG4gICAgICAgIGlmICh0b3RhbCA9PT0gMCkge1xuICAgICAgICAgIGlmIChoYWRFcnJvcikge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIHJlc3VsdHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgUGFyc2UuX2FycmF5RWFjaChvYmplY3RzLCBmdW5jdGlvbihvYmplY3QsIGkpIHtcbiAgICAgICAgaWYgKFBhcnNlLlByb21pc2UuaXMob2JqZWN0KSkge1xuICAgICAgICAgIG9iamVjdC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IHJlc3VsdDtcbiAgICAgICAgICAgIHJlc29sdmVPbmUoKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgZXJyb3JzW2ldID0gZXJyb3I7XG4gICAgICAgICAgICBoYWRFcnJvciA9IHRydWU7XG4gICAgICAgICAgICByZXNvbHZlT25lKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0c1tpXSA9IG9iamVjdDtcbiAgICAgICAgICByZXNvbHZlT25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVucyB0aGUgZ2l2ZW4gYXN5bmNGdW5jdGlvbiByZXBlYXRlZGx5LCBhcyBsb25nIGFzIHRoZSBwcmVkaWNhdGVcbiAgICAgKiBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLiBTdG9wcyByZXBlYXRpbmcgaWYgYXN5bmNGdW5jdGlvbiByZXR1cm5zXG4gICAgICogYSByZWplY3RlZCBwcm9taXNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gcmVhZHkgdG8gc3RvcC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3luY0Z1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBQcm9taXNlLlxuICAgICAqL1xuICAgIF9jb250aW51ZVdoaWxlOiBmdW5jdGlvbihwcmVkaWNhdGUsIGFzeW5jRnVuY3Rpb24pIHtcbiAgICAgIGlmIChwcmVkaWNhdGUoKSkge1xuICAgICAgICByZXR1cm4gYXN5bmNGdW5jdGlvbigpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuX2NvbnRpbnVlV2hpbGUocHJlZGljYXRlLCBhc3luY0Z1bmN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgIH1cbiAgfSk7XG5cbiAgXy5leHRlbmQoUGFyc2UuUHJvbWlzZS5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUGFyc2UuUHJvbWlzZS5wcm90b3R5cGUgKi8ge1xuXG4gICAgLyoqXG4gICAgICogTWFya3MgdGhpcyBwcm9taXNlIGFzIGZ1bGZpbGxlZCwgZmlyaW5nIGFueSBjYWxsYmFja3Mgd2FpdGluZyBvbiBpdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzdWx0IHRoZSByZXN1bHQgdG8gcGFzcyB0byB0aGUgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgaWYgKHRoaXMuX3Jlc29sdmVkIHx8IHRoaXMuX3JlamVjdGVkKSB7XG4gICAgICAgIHRocm93IFwiQSBwcm9taXNlIHdhcyByZXNvbHZlZCBldmVuIHRob3VnaCBpdCBoYWQgYWxyZWFkeSBiZWVuIFwiICtcbiAgICAgICAgICAodGhpcy5fcmVzb2x2ZWQgPyBcInJlc29sdmVkXCIgOiBcInJlamVjdGVkXCIpICsgXCIuXCI7XG4gICAgICB9XG4gICAgICB0aGlzLl9yZXNvbHZlZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZXN1bHQgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgcmVzdWx0cyA9IGFyZ3VtZW50cztcbiAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MsIGZ1bmN0aW9uKHJlc29sdmVkQ2FsbGJhY2spIHtcbiAgICAgICAgcmVzb2x2ZWRDYWxsYmFjay5hcHBseSh0aGlzLCByZXN1bHRzKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MgPSBbXTtcbiAgICAgIHRoaXMuX3JlamVjdGVkQ2FsbGJhY2tzID0gW107XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoaXMgcHJvbWlzZSBhcyBmdWxmaWxsZWQsIGZpcmluZyBhbnkgY2FsbGJhY2tzIHdhaXRpbmcgb24gaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yIHRoZSBlcnJvciB0byBwYXNzIHRvIHRoZSBjYWxsYmFja3MuXG4gICAgICovXG4gICAgcmVqZWN0OiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKHRoaXMuX3Jlc29sdmVkIHx8IHRoaXMuX3JlamVjdGVkKSB7XG4gICAgICAgIHRocm93IFwiQSBwcm9taXNlIHdhcyByZWplY3RlZCBldmVuIHRob3VnaCBpdCBoYWQgYWxyZWFkeSBiZWVuIFwiICtcbiAgICAgICAgICAodGhpcy5fcmVzb2x2ZWQgPyBcInJlc29sdmVkXCIgOiBcInJlamVjdGVkXCIpICsgXCIuXCI7XG4gICAgICB9XG4gICAgICB0aGlzLl9yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLl9yZWplY3RlZENhbGxiYWNrcywgZnVuY3Rpb24ocmVqZWN0ZWRDYWxsYmFjaykge1xuICAgICAgICByZWplY3RlZENhbGxiYWNrKGVycm9yKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MgPSBbXTtcbiAgICAgIHRoaXMuX3JlamVjdGVkQ2FsbGJhY2tzID0gW107XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZHMgY2FsbGJhY2tzIHRvIGJlIGNhbGxlZCB3aGVuIHRoaXMgcHJvbWlzZSBpcyBmdWxmaWxsZWQuIFJldHVybnMgYSBuZXdcbiAgICAgKiBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGUgY2FsbGJhY2sgaXMgY29tcGxldGUuIEl0IGFsbG93c1xuICAgICAqIGNoYWluaW5nLiBJZiB0aGUgY2FsbGJhY2sgaXRzZWxmIHJldHVybnMgYSBQcm9taXNlLCB0aGVuIHRoZSBvbmUgcmV0dXJuZWRcbiAgICAgKiBieSBcInRoZW5cIiB3aWxsIG5vdCBiZSBmdWxmaWxsZWQgdW50aWwgdGhhdCBvbmUgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG4gICAgICogaXMgZnVsZmlsbGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVkQ2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGlzXG4gICAgICogUHJvbWlzZSBpcyByZXNvbHZlZC4gT25jZSB0aGUgY2FsbGJhY2sgaXMgY29tcGxldGUsIHRoZW4gdGhlIFByb21pc2VcbiAgICAgKiByZXR1cm5lZCBieSBcInRoZW5cIiB3aWxsIGFsc28gYmUgZnVsZmlsbGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkQ2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGlzXG4gICAgICogUHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIGFuIGVycm9yLiBPbmNlIHRoZSBjYWxsYmFjayBpcyBjb21wbGV0ZSwgdGhlblxuICAgICAqIHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IFwidGhlblwiIHdpdGggYmUgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5LiBJZlxuICAgICAqIHJlamVjdGVkQ2FsbGJhY2sgaXMgbnVsbCwgb3IgaXQgcmV0dXJucyBhIHJlamVjdGVkIFByb21pc2UsIHRoZW4gdGhlXG4gICAgICogUHJvbWlzZSByZXR1cm5lZCBieSBcInRoZW5cIiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhhdCBlcnJvci5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIG5ldyBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgYWZ0ZXIgdGhpc1xuICAgICAqIFByb21pc2UgaXMgZnVsZmlsbGVkIGFuZCBlaXRoZXIgY2FsbGJhY2sgaGFzIGNvbXBsZXRlZC4gSWYgdGhlIGNhbGxiYWNrXG4gICAgICogcmV0dXJuZWQgYSBQcm9taXNlLCB0aGVuIHRoaXMgUHJvbWlzZSB3aWxsIG5vdCBiZSBmdWxmaWxsZWQgdW50aWwgdGhhdFxuICAgICAqIG9uZSBpcy5cbiAgICAgKi9cbiAgICB0aGVuOiBmdW5jdGlvbihyZXNvbHZlZENhbGxiYWNrLCByZWplY3RlZENhbGxiYWNrKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG5cbiAgICAgIHZhciB3cmFwcGVkUmVzb2x2ZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gYXJndW1lbnRzO1xuICAgICAgICBpZiAocmVzb2x2ZWRDYWxsYmFjaykge1xuICAgICAgICAgIGlmIChQYXJzZS5Qcm9taXNlLl9pc1Byb21pc2VzQVBsdXNDb21wbGlhbnQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IFtyZXNvbHZlZENhbGxiYWNrLmFwcGx5KHRoaXMsIHJlc3VsdCldO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBbUGFyc2UuUHJvbWlzZS5lcnJvcihlKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtyZXNvbHZlZENhbGxiYWNrLmFwcGx5KHRoaXMsIHJlc3VsdCldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSAmJiBQYXJzZS5Qcm9taXNlLmlzKHJlc3VsdFswXSkpIHtcbiAgICAgICAgICByZXN1bHRbMF0udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciB3cmFwcGVkUmVqZWN0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWYgKHJlamVjdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICBpZiAoUGFyc2UuUHJvbWlzZS5faXNQcm9taXNlc0FQbHVzQ29tcGxpYW50KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBbcmVqZWN0ZWRDYWxsYmFjayhlcnJvcildO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBbUGFyc2UuUHJvbWlzZS5lcnJvcihlKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtyZWplY3RlZENhbGxiYWNrKGVycm9yKV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAxICYmIFBhcnNlLlByb21pc2UuaXMocmVzdWx0WzBdKSkge1xuICAgICAgICAgICAgcmVzdWx0WzBdLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChQYXJzZS5Qcm9taXNlLl9pc1Byb21pc2VzQVBsdXNDb21wbGlhbnQpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIHJlc3VsdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdChyZXN1bHRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBydW5MYXRlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgZnVuYy5jYWxsKCk7XG4gICAgICB9O1xuICAgICAgaWYgKFBhcnNlLlByb21pc2UuX2lzUHJvbWlzZXNBUGx1c0NvbXBsaWFudCkge1xuICAgICAgICBpZiAodHlwZW9mKHdpbmRvdykgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5zZXRUaW1lb3V0KSB7XG4gICAgICAgICAgcnVuTGF0ZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jLCAwKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihwcm9jZXNzKSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5uZXh0VGljaykge1xuICAgICAgICAgIHJ1bkxhdGVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmICh0aGlzLl9yZXNvbHZlZCkge1xuICAgICAgICBydW5MYXRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICB3cmFwcGVkUmVzb2x2ZWRDYWxsYmFjay5hcHBseShzZWxmLCBzZWxmLl9yZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcmVqZWN0ZWQpIHtcbiAgICAgICAgcnVuTGF0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd3JhcHBlZFJlamVjdGVkQ2FsbGJhY2soc2VsZi5fZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Jlc29sdmVkQ2FsbGJhY2tzLnB1c2god3JhcHBlZFJlc29sdmVkQ2FsbGJhY2spO1xuICAgICAgICB0aGlzLl9yZWplY3RlZENhbGxiYWNrcy5wdXNoKHdyYXBwZWRSZWplY3RlZENhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBoYW5kbGVycyB0byBiZSBjYWxsZWQgd2hlbiB0aGUgcHJvbWlzZSBcbiAgICAgKiBpcyBlaXRoZXIgcmVzb2x2ZWQgb3IgcmVqZWN0ZWRcbiAgICAgKi9cbiAgICBhbHdheXM6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKGNhbGxiYWNrLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBoYW5kbGVycyB0byBiZSBjYWxsZWQgd2hlbiB0aGUgUHJvbWlzZSBvYmplY3QgaXMgcmVzb2x2ZWRcbiAgICAgKi9cbiAgICBkb25lOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbihjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBoYW5kbGVycyB0byBiZSBjYWxsZWQgd2hlbiB0aGUgUHJvbWlzZSBvYmplY3QgaXMgcmVqZWN0ZWRcbiAgICAgKi9cbiAgICBmYWlsOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biB0aGUgZ2l2ZW4gY2FsbGJhY2tzIGFmdGVyIHRoaXMgcHJvbWlzZSBpcyBmdWxmaWxsZWQuXG4gICAgICogQHBhcmFtIG9wdGlvbnNPckNhbGxiYWNrIHt9IEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBjYWxsYmFjaywgb3IgYVxuICAgICAqIGNhbGxiYWNrIGZ1bmN0aW9uLiBJZiB0aGlzIGlzIGFuIG9wdGlvbnMgb2JqZWN0IGFuZCBjb250YWlucyBhIFwibW9kZWxcIlxuICAgICAqIGF0dHJpYnV0ZXMsIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gZXJyb3IgY2FsbGJhY2tzIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAgICAgKiBAcGFyYW0gbW9kZWwge30gSWYgdHJ1dGh5LCB0aGlzIHdpbGwgYmUgcGFzc2VkIGFzIHRoZSBmaXJzdCByZXN1bHQgb2ZcbiAgICAgKiBlcnJvciBjYWxsYmFja3MuIFRoaXMgaXMgZm9yIEJhY2tib25lLWNvbXBhdGFiaWxpdHkuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCBiZSByZXNvbHZlZCBhZnRlciB0aGVcbiAgICAgKiBjYWxsYmFja3MgYXJlIHJ1biwgd2l0aCB0aGUgc2FtZSByZXN1bHQgYXMgdGhpcy5cbiAgICAgKi9cbiAgICBfdGhlblJ1bkNhbGxiYWNrczogZnVuY3Rpb24ob3B0aW9uc09yQ2FsbGJhY2ssIG1vZGVsKSB7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9uc09yQ2FsbGJhY2spKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IG9wdGlvbnNPckNhbGxiYWNrO1xuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0LCBudWxsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnNPckNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZWwpIHtcbiAgICAgICAgICAvLyBXaGVuIHRoZXJlJ3Mgbm8gY2FsbGJhY2ssIGEgc3luYyBldmVudCBzaG91bGQgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgIG1vZGVsLnRyaWdnZXIoJ3N5bmMnLCBtb2RlbCwgcmVzdWx0LCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcy5hcHBseShQYXJzZS5Qcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICBpZiAoIV8uaXNVbmRlZmluZWQobW9kZWwpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmVycm9yKG1vZGVsLCBlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlbCkge1xuICAgICAgICAgIC8vIFdoZW4gdGhlcmUncyBubyBlcnJvciBjYWxsYmFjaywgYW4gZXJyb3IgZXZlbnQgc2hvdWxkIGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdlcnJvcicsIG1vZGVsLCBlcnJvciwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQnkgZXhwbGljaXRseSByZXR1cm5pbmcgYSByZWplY3RlZCBQcm9taXNlLCB0aGlzIHdpbGwgd29yayB3aXRoXG4gICAgICAgIC8vIGVpdGhlciBqUXVlcnkgb3IgUHJvbWlzZXMvQSBzZW1hbnRpY3MuXG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgY2FsbGVkIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlclxuICAgICAqIHRoaXMgcHJvbWlzZSBmYWlsZWQgb3Igc3VjY2VlZGVkLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBnaXZlbiBlaXRoZXIgdGhlXG4gICAgICogYXJyYXkgb2YgcmVzdWx0cyBmb3IgaXRzIGZpcnN0IGFyZ3VtZW50LCBvciB0aGUgZXJyb3IgYXMgaXRzIHNlY29uZCxcbiAgICAgKiBkZXBlbmRpbmcgb24gd2hldGhlciB0aGlzIFByb21pc2Ugd2FzIHJlamVjdGVkIG9yIHJlc29sdmVkLiBSZXR1cm5zIGFcbiAgICAgKiBuZXcgUHJvbWlzZSwgbGlrZSBcInRoZW5cIiB3b3VsZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb250aW51YXRpb24gdGhlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIF9jb250aW51ZVdpdGg6IGZ1bmN0aW9uKGNvbnRpbnVhdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRpbnVhdGlvbihhcmd1bWVudHMsIG51bGwpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRpbnVhdGlvbihudWxsLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSk7XG5cbn0odGhpcykpO1xuXG4vKmpzaGludCBiaXR3aXNlOmZhbHNlICovLypnbG9iYWwgRmlsZVJlYWRlcjogdHJ1ZSwgRmlsZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICB2YXIgYjY0RGlnaXQgPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyIDwgMjYpIHtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgbnVtYmVyKTtcbiAgICB9XG4gICAgaWYgKG51bWJlciA8IDUyKSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIChudW1iZXIgLSAyNikpO1xuICAgIH1cbiAgICBpZiAobnVtYmVyIDwgNjIpIHtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDQ4ICsgKG51bWJlciAtIDUyKSk7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPT09IDYyKSB7XG4gICAgICByZXR1cm4gXCIrXCI7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPT09IDYzKSB7XG4gICAgICByZXR1cm4gXCIvXCI7XG4gICAgfVxuICAgIHRocm93IFwiVHJpZWQgdG8gZW5jb2RlIGxhcmdlIGRpZ2l0IFwiICsgbnVtYmVyICsgXCIgaW4gYmFzZTY0LlwiO1xuICB9O1xuXG4gIHZhciBlbmNvZGVCYXNlNjQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBjaHVua3MgPSBbXTtcbiAgICBjaHVua3MubGVuZ3RoID0gTWF0aC5jZWlsKGFycmF5Lmxlbmd0aCAvIDMpO1xuICAgIF8udGltZXMoY2h1bmtzLmxlbmd0aCwgZnVuY3Rpb24oaSkge1xuICAgICAgdmFyIGIxID0gYXJyYXlbaSAqIDNdO1xuICAgICAgdmFyIGIyID0gYXJyYXlbaSAqIDMgKyAxXSB8fCAwO1xuICAgICAgdmFyIGIzID0gYXJyYXlbaSAqIDMgKyAyXSB8fCAwO1xuXG4gICAgICB2YXIgaGFzMiA9IChpICogMyArIDEpIDwgYXJyYXkubGVuZ3RoO1xuICAgICAgdmFyIGhhczMgPSAoaSAqIDMgKyAyKSA8IGFycmF5Lmxlbmd0aDtcblxuICAgICAgY2h1bmtzW2ldID0gW1xuICAgICAgICBiNjREaWdpdCgoYjEgPj4gMikgJiAweDNGKSxcbiAgICAgICAgYjY0RGlnaXQoKChiMSA8PCA0KSAmIDB4MzApIHwgKChiMiA+PiA0KSAmIDB4MEYpKSxcbiAgICAgICAgaGFzMiA/IGI2NERpZ2l0KCgoYjIgPDwgMikgJiAweDNDKSB8ICgoYjMgPj4gNikgJiAweDAzKSkgOiBcIj1cIixcbiAgICAgICAgaGFzMyA/IGI2NERpZ2l0KGIzICYgMHgzRikgOiBcIj1cIlxuICAgICAgXS5qb2luKFwiXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBjaHVua3Muam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBUT0RPKGtsaW10KTogTW92ZSB0aGlzIGxpc3QgdG8gdGhlIHNlcnZlci5cbiAgLy8gQSBsaXN0IG9mIGZpbGUgZXh0ZW5zaW9ucyB0byBtaW1lIHR5cGVzIGFzIGZvdW5kIGhlcmU6XG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTg1MTAvdXNpbmctbmV0LWhvdy1jYW4teW91LWZpbmQtdGhlLVxuICAvLyAgICAgbWltZS10eXBlLW9mLWEtZmlsZS1iYXNlZC1vbi10aGUtZmlsZS1zaWduYXR1cmVcbiAgdmFyIG1pbWVUeXBlcyA9IHtcbiAgICBhaTogXCJhcHBsaWNhdGlvbi9wb3N0c2NyaXB0XCIsXG4gICAgYWlmOiBcImF1ZGlvL3gtYWlmZlwiLFxuICAgIGFpZmM6IFwiYXVkaW8veC1haWZmXCIsXG4gICAgYWlmZjogXCJhdWRpby94LWFpZmZcIixcbiAgICBhc2M6IFwidGV4dC9wbGFpblwiLFxuICAgIGF0b206IFwiYXBwbGljYXRpb24vYXRvbSt4bWxcIixcbiAgICBhdTogXCJhdWRpby9iYXNpY1wiLFxuICAgIGF2aTogXCJ2aWRlby94LW1zdmlkZW9cIixcbiAgICBiY3BpbzogXCJhcHBsaWNhdGlvbi94LWJjcGlvXCIsXG4gICAgYmluOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIGJtcDogXCJpbWFnZS9ibXBcIixcbiAgICBjZGY6IFwiYXBwbGljYXRpb24veC1uZXRjZGZcIixcbiAgICBjZ206IFwiaW1hZ2UvY2dtXCIsXG4gICAgXCJjbGFzc1wiOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIGNwaW86IFwiYXBwbGljYXRpb24veC1jcGlvXCIsXG4gICAgY3B0OiBcImFwcGxpY2F0aW9uL21hYy1jb21wYWN0cHJvXCIsXG4gICAgY3NoOiBcImFwcGxpY2F0aW9uL3gtY3NoXCIsXG4gICAgY3NzOiBcInRleHQvY3NzXCIsXG4gICAgZGNyOiBcImFwcGxpY2F0aW9uL3gtZGlyZWN0b3JcIixcbiAgICBkaWY6IFwidmlkZW8veC1kdlwiLFxuICAgIGRpcjogXCJhcHBsaWNhdGlvbi94LWRpcmVjdG9yXCIsXG4gICAgZGp2OiBcImltYWdlL3ZuZC5kanZ1XCIsXG4gICAgZGp2dTogXCJpbWFnZS92bmQuZGp2dVwiLFxuICAgIGRsbDogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBkbWc6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgZG1zOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIGRvYzogXCJhcHBsaWNhdGlvbi9tc3dvcmRcIixcbiAgICBkb2N4OiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLlwiICtcbiAgICAgICAgICBcImRvY3VtZW50XCIsXG4gICAgZG90eDogXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5cIiArXG4gICAgICAgICAgXCJ0ZW1wbGF0ZVwiLFxuICAgIGRvY206IFwiYXBwbGljYXRpb24vdm5kLm1zLXdvcmQuZG9jdW1lbnQubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgZG90bTogXCJhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb0VuYWJsZWQuMTJcIixcbiAgICBkdGQ6IFwiYXBwbGljYXRpb24veG1sLWR0ZFwiLFxuICAgIGR2OiBcInZpZGVvL3gtZHZcIixcbiAgICBkdmk6IFwiYXBwbGljYXRpb24veC1kdmlcIixcbiAgICBkeHI6IFwiYXBwbGljYXRpb24veC1kaXJlY3RvclwiLFxuICAgIGVwczogXCJhcHBsaWNhdGlvbi9wb3N0c2NyaXB0XCIsXG4gICAgZXR4OiBcInRleHQveC1zZXRleHRcIixcbiAgICBleGU6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgZXo6IFwiYXBwbGljYXRpb24vYW5kcmV3LWluc2V0XCIsXG4gICAgZ2lmOiBcImltYWdlL2dpZlwiLFxuICAgIGdyYW06IFwiYXBwbGljYXRpb24vc3Jnc1wiLFxuICAgIGdyeG1sOiBcImFwcGxpY2F0aW9uL3NyZ3MreG1sXCIsXG4gICAgZ3RhcjogXCJhcHBsaWNhdGlvbi94LWd0YXJcIixcbiAgICBoZGY6IFwiYXBwbGljYXRpb24veC1oZGZcIixcbiAgICBocXg6IFwiYXBwbGljYXRpb24vbWFjLWJpbmhleDQwXCIsXG4gICAgaHRtOiBcInRleHQvaHRtbFwiLFxuICAgIGh0bWw6IFwidGV4dC9odG1sXCIsXG4gICAgaWNlOiBcIngtY29uZmVyZW5jZS94LWNvb2x0YWxrXCIsXG4gICAgaWNvOiBcImltYWdlL3gtaWNvblwiLFxuICAgIGljczogXCJ0ZXh0L2NhbGVuZGFyXCIsXG4gICAgaWVmOiBcImltYWdlL2llZlwiLFxuICAgIGlmYjogXCJ0ZXh0L2NhbGVuZGFyXCIsXG4gICAgaWdlczogXCJtb2RlbC9pZ2VzXCIsXG4gICAgaWdzOiBcIm1vZGVsL2lnZXNcIixcbiAgICBqbmxwOiBcImFwcGxpY2F0aW9uL3gtamF2YS1qbmxwLWZpbGVcIixcbiAgICBqcDI6IFwiaW1hZ2UvanAyXCIsXG4gICAganBlOiBcImltYWdlL2pwZWdcIixcbiAgICBqcGVnOiBcImltYWdlL2pwZWdcIixcbiAgICBqcGc6IFwiaW1hZ2UvanBlZ1wiLFxuICAgIGpzOiBcImFwcGxpY2F0aW9uL3gtamF2YXNjcmlwdFwiLFxuICAgIGthcjogXCJhdWRpby9taWRpXCIsXG4gICAgbGF0ZXg6IFwiYXBwbGljYXRpb24veC1sYXRleFwiLFxuICAgIGxoYTogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBsemg6IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIsXG4gICAgbTN1OiBcImF1ZGlvL3gtbXBlZ3VybFwiLFxuICAgIG00YTogXCJhdWRpby9tcDRhLWxhdG1cIixcbiAgICBtNGI6IFwiYXVkaW8vbXA0YS1sYXRtXCIsXG4gICAgbTRwOiBcImF1ZGlvL21wNGEtbGF0bVwiLFxuICAgIG00dTogXCJ2aWRlby92bmQubXBlZ3VybFwiLFxuICAgIG00djogXCJ2aWRlby94LW00dlwiLFxuICAgIG1hYzogXCJpbWFnZS94LW1hY3BhaW50XCIsXG4gICAgbWFuOiBcImFwcGxpY2F0aW9uL3gtdHJvZmYtbWFuXCIsXG4gICAgbWF0aG1sOiBcImFwcGxpY2F0aW9uL21hdGhtbCt4bWxcIixcbiAgICBtZTogXCJhcHBsaWNhdGlvbi94LXRyb2ZmLW1lXCIsXG4gICAgbWVzaDogXCJtb2RlbC9tZXNoXCIsXG4gICAgbWlkOiBcImF1ZGlvL21pZGlcIixcbiAgICBtaWRpOiBcImF1ZGlvL21pZGlcIixcbiAgICBtaWY6IFwiYXBwbGljYXRpb24vdm5kLm1pZlwiLFxuICAgIG1vdjogXCJ2aWRlby9xdWlja3RpbWVcIixcbiAgICBtb3ZpZTogXCJ2aWRlby94LXNnaS1tb3ZpZVwiLFxuICAgIG1wMjogXCJhdWRpby9tcGVnXCIsXG4gICAgbXAzOiBcImF1ZGlvL21wZWdcIixcbiAgICBtcDQ6IFwidmlkZW8vbXA0XCIsXG4gICAgbXBlOiBcInZpZGVvL21wZWdcIixcbiAgICBtcGVnOiBcInZpZGVvL21wZWdcIixcbiAgICBtcGc6IFwidmlkZW8vbXBlZ1wiLFxuICAgIG1wZ2E6IFwiYXVkaW8vbXBlZ1wiLFxuICAgIG1zOiBcImFwcGxpY2F0aW9uL3gtdHJvZmYtbXNcIixcbiAgICBtc2g6IFwibW9kZWwvbWVzaFwiLFxuICAgIG14dTogXCJ2aWRlby92bmQubXBlZ3VybFwiLFxuICAgIG5jOiBcImFwcGxpY2F0aW9uL3gtbmV0Y2RmXCIsXG4gICAgb2RhOiBcImFwcGxpY2F0aW9uL29kYVwiLFxuICAgIG9nZzogXCJhcHBsaWNhdGlvbi9vZ2dcIixcbiAgICBwYm06IFwiaW1hZ2UveC1wb3J0YWJsZS1iaXRtYXBcIixcbiAgICBwY3Q6IFwiaW1hZ2UvcGljdFwiLFxuICAgIHBkYjogXCJjaGVtaWNhbC94LXBkYlwiLFxuICAgIHBkZjogXCJhcHBsaWNhdGlvbi9wZGZcIixcbiAgICBwZ206IFwiaW1hZ2UveC1wb3J0YWJsZS1ncmF5bWFwXCIsXG4gICAgcGduOiBcImFwcGxpY2F0aW9uL3gtY2hlc3MtcGduXCIsXG4gICAgcGljOiBcImltYWdlL3BpY3RcIixcbiAgICBwaWN0OiBcImltYWdlL3BpY3RcIixcbiAgICBwbmc6IFwiaW1hZ2UvcG5nXCIsIFxuICAgIHBubTogXCJpbWFnZS94LXBvcnRhYmxlLWFueW1hcFwiLFxuICAgIHBudDogXCJpbWFnZS94LW1hY3BhaW50XCIsXG4gICAgcG50ZzogXCJpbWFnZS94LW1hY3BhaW50XCIsXG4gICAgcHBtOiBcImltYWdlL3gtcG9ydGFibGUtcGl4bWFwXCIsXG4gICAgcHB0OiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50XCIsXG4gICAgcHB0eDogXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuXCIgK1xuICAgICAgICAgIFwicHJlc2VudGF0aW9uXCIsXG4gICAgcG90eDogXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuXCIgK1xuICAgICAgICAgIFwidGVtcGxhdGVcIixcbiAgICBwcHN4OiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5cIiArXG4gICAgICAgICAgXCJzbGlkZXNob3dcIixcbiAgICBwcGFtOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LmFkZGluLm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHBwdG06IFwiYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQucHJlc2VudGF0aW9uLm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHBvdG06IFwiYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQudGVtcGxhdGUubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgcHBzbTogXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5zbGlkZXNob3cubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgcHM6IFwiYXBwbGljYXRpb24vcG9zdHNjcmlwdFwiLFxuICAgIHF0OiBcInZpZGVvL3F1aWNrdGltZVwiLFxuICAgIHF0aTogXCJpbWFnZS94LXF1aWNrdGltZVwiLFxuICAgIHF0aWY6IFwiaW1hZ2UveC1xdWlja3RpbWVcIixcbiAgICByYTogXCJhdWRpby94LXBuLXJlYWxhdWRpb1wiLFxuICAgIHJhbTogXCJhdWRpby94LXBuLXJlYWxhdWRpb1wiLFxuICAgIHJhczogXCJpbWFnZS94LWNtdS1yYXN0ZXJcIixcbiAgICByZGY6IFwiYXBwbGljYXRpb24vcmRmK3htbFwiLFxuICAgIHJnYjogXCJpbWFnZS94LXJnYlwiLFxuICAgIHJtOiBcImFwcGxpY2F0aW9uL3ZuZC5ybi1yZWFsbWVkaWFcIixcbiAgICByb2ZmOiBcImFwcGxpY2F0aW9uL3gtdHJvZmZcIixcbiAgICBydGY6IFwidGV4dC9ydGZcIixcbiAgICBydHg6IFwidGV4dC9yaWNodGV4dFwiLFxuICAgIHNnbTogXCJ0ZXh0L3NnbWxcIixcbiAgICBzZ21sOiBcInRleHQvc2dtbFwiLFxuICAgIHNoOiBcImFwcGxpY2F0aW9uL3gtc2hcIixcbiAgICBzaGFyOiBcImFwcGxpY2F0aW9uL3gtc2hhclwiLFxuICAgIHNpbG86IFwibW9kZWwvbWVzaFwiLFxuICAgIHNpdDogXCJhcHBsaWNhdGlvbi94LXN0dWZmaXRcIixcbiAgICBza2Q6IFwiYXBwbGljYXRpb24veC1rb2FuXCIsXG4gICAgc2ttOiBcImFwcGxpY2F0aW9uL3gta29hblwiLFxuICAgIHNrcDogXCJhcHBsaWNhdGlvbi94LWtvYW5cIixcbiAgICBza3Q6IFwiYXBwbGljYXRpb24veC1rb2FuXCIsXG4gICAgc21pOiBcImFwcGxpY2F0aW9uL3NtaWxcIixcbiAgICBzbWlsOiBcImFwcGxpY2F0aW9uL3NtaWxcIixcbiAgICBzbmQ6IFwiYXVkaW8vYmFzaWNcIixcbiAgICBzbzogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIixcbiAgICBzcGw6IFwiYXBwbGljYXRpb24veC1mdXR1cmVzcGxhc2hcIixcbiAgICBzcmM6IFwiYXBwbGljYXRpb24veC13YWlzLXNvdXJjZVwiLFxuICAgIHN2NGNwaW86IFwiYXBwbGljYXRpb24veC1zdjRjcGlvXCIsXG4gICAgc3Y0Y3JjOiBcImFwcGxpY2F0aW9uL3gtc3Y0Y3JjXCIsXG4gICAgc3ZnOiBcImltYWdlL3N2Zyt4bWxcIixcbiAgICBzd2Y6IFwiYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2hcIixcbiAgICB0OiBcImFwcGxpY2F0aW9uL3gtdHJvZmZcIixcbiAgICB0YXI6IFwiYXBwbGljYXRpb24veC10YXJcIixcbiAgICB0Y2w6IFwiYXBwbGljYXRpb24veC10Y2xcIixcbiAgICB0ZXg6IFwiYXBwbGljYXRpb24veC10ZXhcIixcbiAgICB0ZXhpOiBcImFwcGxpY2F0aW9uL3gtdGV4aW5mb1wiLFxuICAgIHRleGluZm86IFwiYXBwbGljYXRpb24veC10ZXhpbmZvXCIsXG4gICAgdGlmOiBcImltYWdlL3RpZmZcIixcbiAgICB0aWZmOiBcImltYWdlL3RpZmZcIixcbiAgICB0cjogXCJhcHBsaWNhdGlvbi94LXRyb2ZmXCIsXG4gICAgdHN2OiBcInRleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXNcIixcbiAgICB0eHQ6IFwidGV4dC9wbGFpblwiLFxuICAgIHVzdGFyOiBcImFwcGxpY2F0aW9uL3gtdXN0YXJcIixcbiAgICB2Y2Q6IFwiYXBwbGljYXRpb24veC1jZGxpbmtcIixcbiAgICB2cm1sOiBcIm1vZGVsL3ZybWxcIixcbiAgICB2eG1sOiBcImFwcGxpY2F0aW9uL3ZvaWNleG1sK3htbFwiLFxuICAgIHdhdjogXCJhdWRpby94LXdhdlwiLFxuICAgIHdibXA6IFwiaW1hZ2Uvdm5kLndhcC53Ym1wXCIsXG4gICAgd2JteGw6IFwiYXBwbGljYXRpb24vdm5kLndhcC53YnhtbFwiLFxuICAgIHdtbDogXCJ0ZXh0L3ZuZC53YXAud21sXCIsXG4gICAgd21sYzogXCJhcHBsaWNhdGlvbi92bmQud2FwLndtbGNcIixcbiAgICB3bWxzOiBcInRleHQvdm5kLndhcC53bWxzY3JpcHRcIixcbiAgICB3bWxzYzogXCJhcHBsaWNhdGlvbi92bmQud2FwLndtbHNjcmlwdGNcIixcbiAgICB3cmw6IFwibW9kZWwvdnJtbFwiLFxuICAgIHhibTogXCJpbWFnZS94LXhiaXRtYXBcIixcbiAgICB4aHQ6IFwiYXBwbGljYXRpb24veGh0bWwreG1sXCIsXG4gICAgeGh0bWw6IFwiYXBwbGljYXRpb24veGh0bWwreG1sXCIsXG4gICAgeGxzOiBcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbFwiLFxuICAgIHhtbDogXCJhcHBsaWNhdGlvbi94bWxcIixcbiAgICB4cG06IFwiaW1hZ2UveC14cGl4bWFwXCIsXG4gICAgeHNsOiBcImFwcGxpY2F0aW9uL3htbFwiLFxuICAgIHhsc3g6IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXRcIixcbiAgICB4bHR4OiBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLlwiICtcbiAgICAgICAgICBcInRlbXBsYXRlXCIsXG4gICAgeGxzbTogXCJhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgeGx0bTogXCJhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwudGVtcGxhdGUubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgeGxhbTogXCJhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuYWRkaW4ubWFjcm9FbmFibGVkLjEyXCIsXG4gICAgeGxzYjogXCJhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQuYmluYXJ5Lm1hY3JvRW5hYmxlZC4xMlwiLFxuICAgIHhzbHQ6IFwiYXBwbGljYXRpb24veHNsdCt4bWxcIixcbiAgICB4dWw6IFwiYXBwbGljYXRpb24vdm5kLm1vemlsbGEueHVsK3htbFwiLFxuICAgIHh3ZDogXCJpbWFnZS94LXh3aW5kb3dkdW1wXCIsXG4gICAgeHl6OiBcImNoZW1pY2FsL3gteHl6XCIsXG4gICAgemlwOiBcImFwcGxpY2F0aW9uL3ppcFwiXG4gIH07XG5cbiAgLyoqXG4gICAqIFJlYWRzIGEgRmlsZSB1c2luZyBhIEZpbGVSZWFkZXIuXG4gICAqIEBwYXJhbSBmaWxlIHtGaWxlfSB0aGUgRmlsZSB0byByZWFkLlxuICAgKiBAcGFyYW0gdHlwZSB7U3RyaW5nfSAob3B0aW9uYWwpIHRoZSBtaW1ldHlwZSB0byBvdmVycmlkZSB3aXRoLlxuICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIFByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aXRoIGFcbiAgICogICAgIGJhc2U2NC1lbmNvZGVkIHN0cmluZyBvZiB0aGUgZGF0YSBhbmQgaXRzIG1pbWUgdHlwZS5cbiAgICovXG4gIHZhciByZWFkQXN5bmMgPSBmdW5jdGlvbihmaWxlLCB0eXBlKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuXG4gICAgaWYgKHR5cGVvZihGaWxlUmVhZGVyKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IobmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgIFBhcnNlLkVycm9yLkZJTEVfUkVBRF9FUlJPUixcbiAgICAgICAgICBcIkF0dGVtcHRlZCB0byB1c2UgYSBGaWxlUmVhZGVyIG9uIGFuIHVuc3VwcG9ydGVkIGJyb3dzZXIuXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmVhZGVyLnJlYWR5U3RhdGUgIT09IDIpIHtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QobmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuRklMRV9SRUFEX0VSUk9SLFxuICAgICAgICAgICAgXCJFcnJvciByZWFkaW5nIGZpbGUuXCIpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YVVSTCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgICB2YXIgbWF0Y2hlcyA9IC9eZGF0YTooW147XSopO2Jhc2U2NCwoLiopJC8uZXhlYyhkYXRhVVJMKTtcbiAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5GSUxFX1JFQURfRVJST1IsXG4gICAgICAgICAgICBcIlVuYWJsZSB0byBpbnRlcnByZXQgZGF0YSBVUkw6IFwiICsgZGF0YVVSTCkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UucmVzb2x2ZShtYXRjaGVzWzJdLCB0eXBlIHx8IG1hdGNoZXNbMV0pO1xuICAgIH07XG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIEEgUGFyc2UuRmlsZSBpcyBhIGxvY2FsIHJlcHJlc2VudGF0aW9uIG9mIGEgZmlsZSB0aGF0IGlzIHNhdmVkIHRvIHRoZSBQYXJzZVxuICAgKiBjbG91ZC5cbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSBuYW1lIHtTdHJpbmd9IFRoZSBmaWxlJ3MgbmFtZS4gVGhpcyB3aWxsIGJlIHByZWZpeGVkIGJ5IGEgdW5pcXVlXG4gICAqICAgICB2YWx1ZSBvbmNlIHRoZSBmaWxlIGhhcyBmaW5pc2hlZCBzYXZpbmcuIFRoZSBmaWxlIG5hbWUgbXVzdCBiZWdpbiB3aXRoXG4gICAqICAgICBhbiBhbHBoYW51bWVyaWMgY2hhcmFjdGVyLCBhbmQgY29uc2lzdCBvZiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyxcbiAgICogICAgIHBlcmlvZHMsIHNwYWNlcywgdW5kZXJzY29yZXMsIG9yIGRhc2hlcy5cbiAgICogQHBhcmFtIGRhdGEge0FycmF5fSBUaGUgZGF0YSBmb3IgdGhlIGZpbGUsIGFzIGVpdGhlcjpcbiAgICogICAgIDEuIGFuIEFycmF5IG9mIGJ5dGUgdmFsdWUgTnVtYmVycywgb3JcbiAgICogICAgIDIuIGFuIE9iamVjdCBsaWtlIHsgYmFzZTY0OiBcIi4uLlwiIH0gd2l0aCBhIGJhc2U2NC1lbmNvZGVkIFN0cmluZy5cbiAgICogICAgIDMuIGEgRmlsZSBvYmplY3Qgc2VsZWN0ZWQgd2l0aCBhIGZpbGUgdXBsb2FkIGNvbnRyb2wuICgzKSBvbmx5IHdvcmtzXG4gICAqICAgICAgICBpbiBGaXJlZm94IDMuNissIFNhZmFyaSA2LjAuMissIENocm9tZSA3KywgYW5kIElFIDEwKy5cbiAgICogICAgICAgIEZvciBleGFtcGxlOjxwcmU+XG4gICAqIHZhciBmaWxlVXBsb2FkQ29udHJvbCA9ICQoXCIjcHJvZmlsZVBob3RvRmlsZVVwbG9hZFwiKVswXTtcbiAgICogaWYgKGZpbGVVcGxvYWRDb250cm9sLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICogICB2YXIgZmlsZSA9IGZpbGVVcGxvYWRDb250cm9sLmZpbGVzWzBdO1xuICAgKiAgIHZhciBuYW1lID0gXCJwaG90by5qcGdcIjtcbiAgICogICB2YXIgcGFyc2VGaWxlID0gbmV3IFBhcnNlLkZpbGUobmFtZSwgZmlsZSk7XG4gICAqICAgcGFyc2VGaWxlLnNhdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgKiAgICAgLy8gVGhlIGZpbGUgaGFzIGJlZW4gc2F2ZWQgdG8gUGFyc2UuXG4gICAqICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgIC8vIFRoZSBmaWxlIGVpdGhlciBjb3VsZCBub3QgYmUgcmVhZCwgb3IgY291bGQgbm90IGJlIHNhdmVkIHRvIFBhcnNlLlxuICAgKiAgIH0pO1xuICAgKiB9PC9wcmU+XG4gICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9IE9wdGlvbmFsIENvbnRlbnQtVHlwZSBoZWFkZXIgdG8gdXNlIGZvciB0aGUgZmlsZS4gSWZcbiAgICogICAgIHRoaXMgaXMgb21pdHRlZCwgdGhlIGNvbnRlbnQgdHlwZSB3aWxsIGJlIGluZmVycmVkIGZyb20gdGhlIG5hbWUnc1xuICAgKiAgICAgZXh0ZW5zaW9uLlxuICAgKi9cbiAgUGFyc2UuRmlsZSA9IGZ1bmN0aW9uKG5hbWUsIGRhdGEsIHR5cGUpIHtcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcblxuICAgIC8vIEd1ZXNzIHRoZSBjb250ZW50IHR5cGUgZnJvbSB0aGUgZXh0ZW5zaW9uIGlmIHdlIG5lZWQgdG8uXG4gICAgdmFyIGV4dGVuc2lvbiA9IC9cXC4oW14uXSopJC8uZXhlYyhuYW1lKTtcbiAgICBpZiAoZXh0ZW5zaW9uKSB7XG4gICAgICBleHRlbnNpb24gPSBleHRlbnNpb25bMV0udG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgdmFyIGd1ZXNzZWRUeXBlID0gdHlwZSB8fCBtaW1lVHlwZXNbZXh0ZW5zaW9uXSB8fCBcInRleHQvcGxhaW5cIjtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHRoaXMuX3NvdXJjZSA9IFBhcnNlLlByb21pc2UuYXMoZW5jb2RlQmFzZTY0KGRhdGEpLCBndWVzc2VkVHlwZSk7XG4gICAgfSBlbHNlIGlmIChkYXRhICYmIGRhdGEuYmFzZTY0KSB7XG4gICAgICAvLyBpZiBpdCBjb250YWlucyBkYXRhIHVyaSwgZXh0cmFjdCBiYXNlZDY0IGFuZCB0aGUgdHlwZSBvdXQgb2YgaXQuXG4gICAgICAvKmpzbGludCBtYXhsZW46IDEwMDAqL1xuICAgICAgdmFyIGRhdGFVcmlSZWdleHAgPSAvXmRhdGE6KFthLXpBLVpdKlxcL1thLXpBLVorLi1dKik7KGNoYXJzZXQ9W2EtekEtWjAtOVxcLVxcL1xcc10qLCk/YmFzZTY0LChcXFMrKS87XG4gICAgICAvKmpzbGludCBtYXhsZW46IDgwKi9cblxuICAgICAgdmFyIG1hdGNoZXMgPSBkYXRhVXJpUmVnZXhwLmV4ZWMoZGF0YS5iYXNlNjQpO1xuICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIGlmIGRhdGEgVVJJIHdpdGggY2hhcnNldCwgdGhlcmUgd2lsbCBoYXZlIDQgbWF0Y2hlcy5cbiAgICAgICAgdGhpcy5fc291cmNlID0gUGFyc2UuUHJvbWlzZS5hcyhcbiAgICAgICAgICAobWF0Y2hlcy5sZW5ndGggPT09IDQgPyBtYXRjaGVzWzNdIDogbWF0Y2hlc1syXSksIG1hdGNoZXNbMV1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IFBhcnNlLlByb21pc2UuYXMoZGF0YS5iYXNlNjQsIGd1ZXNzZWRUeXBlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZihGaWxlKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgdGhpcy5fc291cmNlID0gcmVhZEFzeW5jKGRhdGEsIHR5cGUpO1xuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgdGhyb3cgXCJDcmVhdGluZyBhIFBhcnNlLkZpbGUgZnJvbSBhIFN0cmluZyBpcyBub3QgeWV0IHN1cHBvcnRlZC5cIjtcbiAgICB9XG4gIH07XG5cbiAgUGFyc2UuRmlsZS5wcm90b3R5cGUgPSB7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBmaWxlLiBCZWZvcmUgc2F2ZSBpcyBjYWxsZWQsIHRoaXMgaXMgdGhlIGZpbGVuYW1lXG4gICAgICogZ2l2ZW4gYnkgdGhlIHVzZXIuIEFmdGVyIHNhdmUgaXMgY2FsbGVkLCB0aGF0IG5hbWUgZ2V0cyBwcmVmaXhlZCB3aXRoIGFcbiAgICAgKiB1bmlxdWUgaWRlbnRpZmllci5cbiAgICAgKi9cbiAgICBuYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB1cmwgb2YgdGhlIGZpbGUuIEl0IGlzIG9ubHkgYXZhaWxhYmxlIGFmdGVyIHlvdSBzYXZlIHRoZSBmaWxlIG9yXG4gICAgICogYWZ0ZXIgeW91IGdldCB0aGUgZmlsZSBmcm9tIGEgUGFyc2UuT2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICB1cmw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2F2ZXMgdGhlIGZpbGUgdG8gdGhlIFBhcnNlIGNsb3VkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gUHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIHNhdmUgZmluaXNoZXMuXG4gICAgICovXG4gICAgc2F2ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucz0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKCFzZWxmLl9wcmV2aW91c1NhdmUpIHtcbiAgICAgICAgc2VsZi5fcHJldmlvdXNTYXZlID0gc2VsZi5fc291cmNlLnRoZW4oZnVuY3Rpb24oYmFzZTY0LCB0eXBlKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBiYXNlNjQ6IGJhc2U2NCxcbiAgICAgICAgICAgIF9Db250ZW50VHlwZTogdHlwZVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgICAgIHJvdXRlOiBcImZpbGVzXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IHNlbGYuX25hbWUsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIHNlbGYuX25hbWUgPSByZXNwb25zZS5uYW1lO1xuICAgICAgICAgIHNlbGYuX3VybCA9IHJlc3BvbnNlLnVybDtcbiAgICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZi5fcHJldmlvdXNTYXZlLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcblxufSh0aGlzKSk7XG5cbi8vIFBhcnNlLk9iamVjdCBpcyBhbmFsb2dvdXMgdG8gdGhlIEphdmEgUGFyc2VPYmplY3QuXG4vLyBJdCBhbHNvIGltcGxlbWVudHMgdGhlIHNhbWUgaW50ZXJmYWNlIGFzIGEgQmFja2JvbmUgbW9kZWwuXG4vLyBUT0RPOiBtdWx0aXBsZSBkaXNwYXRjaCBmb3IgY2FsbGJhY2tzXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG1vZGVsIHdpdGggZGVmaW5lZCBhdHRyaWJ1dGVzLiBBIGNsaWVudCBpZCAoY2lkKSBpc1xuICAgKiBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBhbmQgYXNzaWduZWQgZm9yIHlvdS5cbiAgICpcbiAgICogPHA+WW91IHdvbid0IG5vcm1hbGx5IGNhbGwgdGhpcyBtZXRob2QgZGlyZWN0bHkuICBJdCBpcyByZWNvbW1lbmRlZCB0aGF0XG4gICAqIHlvdSB1c2UgYSBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+IGluc3RlYWQsIGNyZWF0ZWQgYnkgY2FsbGluZ1xuICAgKiA8Y29kZT5leHRlbmQ8L2NvZGU+LjwvcD5cbiAgICpcbiAgICogPHA+SG93ZXZlciwgaWYgeW91IGRvbid0IHdhbnQgdG8gdXNlIGEgc3ViY2xhc3MsIG9yIGFyZW4ndCBzdXJlIHdoaWNoXG4gICAqIHN1YmNsYXNzIGlzIGFwcHJvcHJpYXRlLCB5b3UgY2FuIHVzZSB0aGlzIGZvcm06PHByZT5cbiAgICogICAgIHZhciBvYmplY3QgPSBuZXcgUGFyc2UuT2JqZWN0KFwiQ2xhc3NOYW1lXCIpO1xuICAgKiA8L3ByZT5cbiAgICogVGhhdCBpcyBiYXNpY2FsbHkgZXF1aXZhbGVudCB0bzo8cHJlPlxuICAgKiAgICAgdmFyIE15Q2xhc3MgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiQ2xhc3NOYW1lXCIpO1xuICAgKiAgICAgdmFyIG9iamVjdCA9IG5ldyBNeUNsYXNzKCk7XG4gICAqIDwvcHJlPjwvcD5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgVGhlIGluaXRpYWwgc2V0IG9mIGRhdGEgdG8gc3RvcmUgaW4gdGhlIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBzZXQgb2YgQmFja2JvbmUtbGlrZSBvcHRpb25zIGZvciBjcmVhdGluZyB0aGVcbiAgICogICAgIG9iamVjdC4gIFRoZSBvbmx5IG9wdGlvbiBjdXJyZW50bHkgc3VwcG9ydGVkIGlzIFwiY29sbGVjdGlvblwiLlxuICAgKiBAc2VlIFBhcnNlLk9iamVjdC5leHRlbmRcbiAgICpcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPlRoZSBmdW5kYW1lbnRhbCB1bml0IG9mIFBhcnNlIGRhdGEsIHdoaWNoIGltcGxlbWVudHMgdGhlIEJhY2tib25lIE1vZGVsXG4gICAqIGludGVyZmFjZS48L3A+XG4gICAqL1xuICBQYXJzZS5PYmplY3QgPSBmdW5jdGlvbihhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG4gICAgLy8gQWxsb3cgbmV3IFBhcnNlLk9iamVjdChcIkNsYXNzTmFtZVwiKSBhcyBhIHNob3J0Y3V0IHRvIF9jcmVhdGUuXG4gICAgaWYgKF8uaXNTdHJpbmcoYXR0cmlidXRlcykpIHtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2NyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIHx8IHt9O1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucGFyc2UpIHtcbiAgICAgIGF0dHJpYnV0ZXMgPSB0aGlzLnBhcnNlKGF0dHJpYnV0ZXMpO1xuICAgIH1cbiAgICB2YXIgZGVmYXVsdHMgPSBQYXJzZS5fZ2V0VmFsdWUodGhpcywgJ2RlZmF1bHRzJyk7XG4gICAgaWYgKGRlZmF1bHRzKSB7XG4gICAgICBhdHRyaWJ1dGVzID0gXy5leHRlbmQoe30sIGRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5jb2xsZWN0aW9uKSB7XG4gICAgICB0aGlzLmNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgdGhpcy5fc2VydmVyRGF0YSA9IHt9OyAgLy8gVGhlIGxhc3Qga25vd24gZGF0YSBmb3IgdGhpcyBvYmplY3QgZnJvbSBjbG91ZC5cbiAgICB0aGlzLl9vcFNldFF1ZXVlID0gW3t9XTsgIC8vIExpc3Qgb2Ygc2V0cyBvZiBjaGFuZ2VzIHRvIHRoZSBkYXRhLlxuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9OyAgLy8gVGhlIGJlc3QgZXN0aW1hdGUgb2YgdGhpcydzIGN1cnJlbnQgZGF0YS5cblxuICAgIHRoaXMuX2hhc2hlZEpTT04gPSB7fTsgIC8vIEhhc2ggb2YgdmFsdWVzIG9mIGNvbnRhaW5lcnMgYXQgbGFzdCBzYXZlLlxuICAgIHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzID0ge307XG4gICAgdGhpcy5jaWQgPSBfLnVuaXF1ZUlkKCdjJyk7XG4gICAgdGhpcy5jaGFuZ2VkID0ge307XG4gICAgdGhpcy5fc2lsZW50ID0ge307XG4gICAgdGhpcy5fcGVuZGluZyA9IHt9O1xuICAgIGlmICghdGhpcy5zZXQoYXR0cmlidXRlcywge3NpbGVudDogdHJ1ZX0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjcmVhdGUgYW4gaW52YWxpZCBQYXJzZS5PYmplY3RcIik7XG4gICAgfVxuICAgIHRoaXMuY2hhbmdlZCA9IHt9O1xuICAgIHRoaXMuX3NpbGVudCA9IHt9O1xuICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLl9oYXNEYXRhID0gdHJ1ZTtcbiAgICB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGlzIG9iamVjdCwgdW5pcXVlIHdpdGhpbiBpdHMgY2xhc3MuXG4gICAqIEBuYW1lIGlkXG4gICAqIEB0eXBlIFN0cmluZ1xuICAgKiBAZmllbGRcbiAgICogQG1lbWJlck9mIFBhcnNlLk9iamVjdC5wcm90b3R5cGVcbiAgICovXG5cbiAgLyoqXG4gICAqIFRoZSBmaXJzdCB0aW1lIHRoaXMgb2JqZWN0IHdhcyBzYXZlZCBvbiB0aGUgc2VydmVyLlxuICAgKiBAbmFtZSBjcmVhdGVkQXRcbiAgICogQHR5cGUgRGF0ZVxuICAgKiBAZmllbGRcbiAgICogQG1lbWJlck9mIFBhcnNlLk9iamVjdC5wcm90b3R5cGVcbiAgICovXG5cbiAgLyoqXG4gICAqIFRoZSBsYXN0IHRpbWUgdGhpcyBvYmplY3Qgd2FzIHVwZGF0ZWQgb24gdGhlIHNlcnZlci5cbiAgICogQG5hbWUgdXBkYXRlZEF0XG4gICAqIEB0eXBlIERhdGVcbiAgICogQGZpZWxkXG4gICAqIEBtZW1iZXJPZiBQYXJzZS5PYmplY3QucHJvdG90eXBlXG4gICAqL1xuXG4gIC8qKlxuICAgKiBTYXZlcyB0aGUgZ2l2ZW4gbGlzdCBvZiBQYXJzZS5PYmplY3QuXG4gICAqIElmIGFueSBlcnJvciBpcyBlbmNvdW50ZXJlZCwgc3RvcHMgYW5kIGNhbGxzIHRoZSBlcnJvciBoYW5kbGVyLlxuICAgKlxuICAgKiA8cHJlPlxuICAgKiAgIFBhcnNlLk9iamVjdC5zYXZlQWxsKFtvYmplY3QxLCBvYmplY3QyLCAuLi5dLCB7XG4gICAqICAgICBzdWNjZXNzOiBmdW5jdGlvbihsaXN0KSB7XG4gICAqICAgICAgIC8vIEFsbCB0aGUgb2JqZWN0cyB3ZXJlIHNhdmVkLlxuICAgKiAgICAgfSxcbiAgICogICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICAvLyBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBzYXZpbmcgb25lIG9mIHRoZSBvYmplY3RzLlxuICAgKiAgICAgfSxcbiAgICogICB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICogPC91bD5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5zYXZlQWxsID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2RlZXBTYXZlQXN5bmMobGlzdCwge1xuICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleVxuICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBnaXZlbiBsaXN0IG9mIG1vZGVscyBvbiB0aGUgc2VydmVyIGlmIGl0IHdhcyBhbHJlYWR5IHBlcnNpc3RlZC5cbiAgICogT3B0aW1pc3RpY2FsbHkgcmVtb3ZlcyBlYWNoIG1vZGVsIGZyb20gaXRzIGNvbGxlY3Rpb24sIGlmIGl0IGhhcyBvbmUuXG4gICAqIElmIGB3YWl0OiB0cnVlYCBpcyBwYXNzZWQsIHdhaXRzIGZvciB0aGUgc2VydmVyIHRvIHJlc3BvbmQgYmVmb3JlIHJlbW92YWwuXG4gICAqXG4gICAqIDxwPlVubGlrZSBzYXZlQWxsLCBpZiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgZGVsZXRpbmcgYW4gaW5kaXZpZHVhbCBtb2RlbCxcbiAgICogdGhpcyBtZXRob2Qgd2lsbCBjb250aW51ZSB0cnlpbmcgdG8gZGVsZXRlIHRoZSByZXN0IG9mIHRoZSBtb2RlbHMgaWZcbiAgICogcG9zc2libGUsIGV4Y2VwdCBpbiB0aGUgY2FzZSBvZiBhIGZhdGFsIGVycm9yIGxpa2UgYSBjb25uZWN0aW9uIGVycm9yLlxuICAgKlxuICAgKiA8cD5JbiBwYXJ0aWN1bGFyLCB0aGUgUGFyc2UuRXJyb3Igb2JqZWN0IHJldHVybmVkIGluIHRoZSBjYXNlIG9mIGVycm9yIG1heVxuICAgKiBiZSBvbmUgb2YgdHdvIHR5cGVzOlxuICAgKlxuICAgKiA8dWw+XG4gICAqICAgPGxpPkEgUGFyc2UuRXJyb3IuQUdHUkVHQVRFX0VSUk9SLiBUaGlzIG9iamVjdCdzIFwiZXJyb3JzXCIgcHJvcGVydHkgaXMgYW5cbiAgICogICAgICAgYXJyYXkgb2Ygb3RoZXIgUGFyc2UuRXJyb3Igb2JqZWN0cy4gRWFjaCBlcnJvciBvYmplY3QgaW4gdGhpcyBhcnJheVxuICAgKiAgICAgICBoYXMgYW4gXCJvYmplY3RcIiBwcm9wZXJ0eSB0aGF0IHJlZmVyZW5jZXMgdGhlIG9iamVjdCB0aGF0IGNvdWxkIG5vdCBiZVxuICAgKiAgICAgICBkZWxldGVkIChmb3IgaW5zdGFuY2UsIGJlY2F1c2UgdGhhdCBvYmplY3QgY291bGQgbm90IGJlIGZvdW5kKS48L2xpPlxuICAgKiAgIDxsaT5BIG5vbi1hZ2dyZWdhdGUgUGFyc2UuRXJyb3IuIFRoaXMgaW5kaWNhdGVzIGEgc2VyaW91cyBlcnJvciB0aGF0XG4gICAqICAgICAgIGNhdXNlZCB0aGUgZGVsZXRlIG9wZXJhdGlvbiB0byBiZSBhYm9ydGVkIHBhcnR3YXkgdGhyb3VnaCAoZm9yXG4gICAqICAgICAgIGluc3RhbmNlLCBhIGNvbm5lY3Rpb24gZmFpbHVyZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBkZWxldGUpLjwvbGk+XG4gICAqIDwvdWw+XG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgUGFyc2UuT2JqZWN0LmRlc3Ryb3lBbGwoW29iamVjdDEsIG9iamVjdDIsIC4uLl0sIHtcbiAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICAvLyBBbGwgdGhlIG9iamVjdHMgd2VyZSBkZWxldGVkLlxuICAgKiAgICAgfSxcbiAgICogICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICAvLyBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBkZWxldGluZyBvbmUgb3IgbW9yZSBvZiB0aGUgb2JqZWN0cy5cbiAgICogICAgICAgLy8gSWYgdGhpcyBpcyBhbiBhZ2dyZWdhdGUgZXJyb3IsIHRoZW4gd2UgY2FuIGluc3BlY3QgZWFjaCBlcnJvclxuICAgKiAgICAgICAvLyBvYmplY3QgaW5kaXZpZHVhbGx5IHRvIGRldGVybWluZSB0aGUgcmVhc29uIHdoeSBhIHBhcnRpY3VsYXJcbiAgICogICAgICAgLy8gb2JqZWN0IHdhcyBub3QgZGVsZXRlZC5cbiAgICogICAgICAgaWYgKGVycm9yLmNvZGUgPT0gUGFyc2UuRXJyb3IuQUdHUkVHQVRFX0VSUk9SKSB7XG4gICAqICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvci5lcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICogICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRuJ3QgZGVsZXRlIFwiICsgZXJyb3IuZXJyb3JzW2ldLm9iamVjdC5pZCArXG4gICAqICAgICAgICAgICAgIFwiZHVlIHRvIFwiICsgZXJyb3IuZXJyb3JzW2ldLm1lc3NhZ2UpO1xuICAgKiAgICAgICAgIH1cbiAgICogICAgICAgfSBlbHNlIHtcbiAgICogICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZSBhYm9ydGVkIGJlY2F1c2Ugb2YgXCIgKyBlcnJvci5tZXNzYWdlKTtcbiAgICogICAgICAgfVxuICAgKiAgICAgfSxcbiAgICogICB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICogPC91bD5cbiAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIGRlc3Ryb3lBbGxcbiAgICogICAgIGNvbXBsZXRlcy5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5kZXN0cm95QWxsID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHRyaWdnZXJEZXN0cm95ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICBvYmplY3QudHJpZ2dlcignZGVzdHJveScsIG9iamVjdCwgb2JqZWN0LmNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICB2YXIgZXJyb3JzID0gW107XG4gICAgdmFyIGRlc3Ryb3lCYXRjaCA9IGZ1bmN0aW9uKGJhdGNoKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IFBhcnNlLlByb21pc2UuYXMoKTtcblxuICAgICAgaWYgKGJhdGNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICAgICAgcm91dGU6IFwiYmF0Y2hcIixcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICByZXF1ZXN0czogXy5tYXAoYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgICAgICBwYXRoOiBcIi8xL2NsYXNzZXMvXCIgKyBvYmplY3QuY2xhc3NOYW1lICsgXCIvXCIgKyBvYmplY3QuaWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlcywgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgICBQYXJzZS5fYXJyYXlFYWNoKGJhdGNoLCBmdW5jdGlvbihvYmplY3QsIGkpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZXNbaV0uc3VjY2VzcyAmJiBvcHRpb25zLndhaXQpIHtcbiAgICAgICAgICAgICAgdHJpZ2dlckRlc3Ryb3kob2JqZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VzW2ldLmVycm9yKSB7XG4gICAgICAgICAgICAgIHZhciBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihyZXNwb25zZXNbaV0uZXJyb3IuY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlc1tpXS5lcnJvci5lcnJvcik7XG4gICAgICAgICAgICAgIGVycm9yLm9iamVjdCA9IG9iamVjdDtcblxuICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgdmFyIHByb21pc2UgPSBQYXJzZS5Qcm9taXNlLmFzKCk7XG4gICAgdmFyIGJhdGNoID0gW107XG4gICAgUGFyc2UuX2FycmF5RWFjaChsaXN0LCBmdW5jdGlvbihvYmplY3QsIGkpIHtcbiAgICAgIGlmICghb2JqZWN0LmlkIHx8ICFvcHRpb25zLndhaXQpIHtcbiAgICAgICAgdHJpZ2dlckRlc3Ryb3kob2JqZWN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iamVjdC5pZCkge1xuICAgICAgICBiYXRjaC5wdXNoKG9iamVjdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChiYXRjaC5sZW5ndGggPT09IDIwIHx8IGkrMSA9PT0gbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHRoaXNCYXRjaCA9IGJhdGNoO1xuICAgICAgICBiYXRjaCA9IFtdO1xuXG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc3Ryb3lCYXRjaCh0aGlzQmF0Y2gpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5BR0dSRUdBVEVfRVJST1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkVycm9yIGRlbGV0aW5nIGFuIG9iamVjdCBpbiBkZXN0cm95QWxsXCIpO1xuICAgICAgICBlcnJvci5lcnJvcnMgPSBlcnJvcnM7XG5cbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGZXRjaGVzIHRoZSBnaXZlbiBsaXN0IG9mIFBhcnNlLk9iamVjdC5cbiAgICogSWYgYW55IGVycm9yIGlzIGVuY291bnRlcmVkLCBzdG9wcyBhbmQgY2FsbHMgdGhlIGVycm9yIGhhbmRsZXIuXG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgUGFyc2UuT2JqZWN0LmZldGNoQWxsKFtvYmplY3QxLCBvYmplY3QyLCAuLi5dLCB7XG4gICAqICAgICBzdWNjZXNzOiBmdW5jdGlvbihsaXN0KSB7XG4gICAqICAgICAgIC8vIEFsbCB0aGUgb2JqZWN0cyB3ZXJlIGZldGNoZWQuXG4gICAqICAgICB9LFxuICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIC8vIEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGZldGNoaW5nIG9uZSBvZiB0aGUgb2JqZWN0cy5cbiAgICogICAgIH0sXG4gICAqICAgfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEEgbGlzdCBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICogPC91bD5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5mZXRjaEFsbCA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll9mZXRjaEFsbChcbiAgICAgIGxpc3QsXG4gICAgICB0cnVlXG4gICAgKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgZ2l2ZW4gbGlzdCBvZiBQYXJzZS5PYmplY3QgaWYgbmVlZGVkLlxuICAgKiBJZiBhbnkgZXJyb3IgaXMgZW5jb3VudGVyZWQsIHN0b3BzIGFuZCBjYWxscyB0aGUgZXJyb3IgaGFuZGxlci5cbiAgICpcbiAgICogPHByZT5cbiAgICogICBQYXJzZS5PYmplY3QuZmV0Y2hBbGxJZk5lZWRlZChbb2JqZWN0MSwgLi4uXSwge1xuICAgKiAgICAgc3VjY2VzczogZnVuY3Rpb24obGlzdCkge1xuICAgKiAgICAgICAvLyBPYmplY3RzIHdlcmUgZmV0Y2hlZCBhbmQgdXBkYXRlZC5cbiAgICogICAgIH0sXG4gICAqICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgICAgLy8gQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgZmV0Y2hpbmcgb25lIG9mIHRoZSBvYmplY3RzLlxuICAgKiAgICAgfSxcbiAgICogICB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFjay5cbiAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgKiA8L3VsPlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0LmZldGNoQWxsSWZOZWVkZWQgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fZmV0Y2hBbGwoXG4gICAgICBsaXN0LFxuICAgICAgZmFsc2VcbiAgICApLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIC8vIEF0dGFjaCBhbGwgaW5oZXJpdGFibGUgbWV0aG9kcyB0byB0aGUgUGFyc2UuT2JqZWN0IHByb3RvdHlwZS5cbiAgXy5leHRlbmQoUGFyc2UuT2JqZWN0LnByb3RvdHlwZSwgUGFyc2UuRXZlbnRzLFxuICAgICAgICAgICAvKiogQGxlbmRzIFBhcnNlLk9iamVjdC5wcm90b3R5cGUgKi8ge1xuICAgIF9leGlzdGVkOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuICAgICAqIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9iamVjdCBzdWl0YWJsZSBmb3Igc2F2aW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGpzb24gPSB0aGlzLl90b0Z1bGxKU09OKCk7XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKFtcIl9fdHlwZVwiLCBcImNsYXNzTmFtZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oa2V5KSB7IGRlbGV0ZSBqc29uW2tleV07IH0pO1xuICAgICAgcmV0dXJuIGpzb247XG4gICAgfSxcblxuICAgIF90b0Z1bGxKU09OOiBmdW5jdGlvbihzZWVuT2JqZWN0cykge1xuICAgICAgdmFyIGpzb24gPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChqc29uLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBqc29uW2tleV0gPSBQYXJzZS5fZW5jb2RlKHZhbCwgc2Vlbk9iamVjdHMpO1xuICAgICAgfSk7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLl9vcGVyYXRpb25zLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBqc29uW2tleV0gPSB2YWw7XG4gICAgICB9KTtcblxuICAgICAgaWYgKF8uaGFzKHRoaXMsIFwiaWRcIikpIHtcbiAgICAgICAganNvbi5vYmplY3RJZCA9IHRoaXMuaWQ7XG4gICAgICB9XG4gICAgICBpZiAoXy5oYXModGhpcywgXCJjcmVhdGVkQXRcIikpIHtcbiAgICAgICAgaWYgKF8uaXNEYXRlKHRoaXMuY3JlYXRlZEF0KSkge1xuICAgICAgICAgIGpzb24uY3JlYXRlZEF0ID0gdGhpcy5jcmVhdGVkQXQudG9KU09OKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAganNvbi5jcmVhdGVkQXQgPSB0aGlzLmNyZWF0ZWRBdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoXy5oYXModGhpcywgXCJ1cGRhdGVkQXRcIikpIHtcbiAgICAgICAgaWYgKF8uaXNEYXRlKHRoaXMudXBkYXRlZEF0KSkge1xuICAgICAgICAgIGpzb24udXBkYXRlZEF0ID0gdGhpcy51cGRhdGVkQXQudG9KU09OKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAganNvbi51cGRhdGVkQXQgPSB0aGlzLnVwZGF0ZWRBdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAganNvbi5fX3R5cGUgPSBcIk9iamVjdFwiO1xuICAgICAganNvbi5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIF9oYXNoZWRKU09OIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhpcyBvYmplY3QuXG4gICAgICogQWRkcyBhbnkgY2hhbmdlZCBoYXNoIHZhbHVlcyB0byB0aGUgc2V0IG9mIHBlbmRpbmcgY2hhbmdlcy5cbiAgICAgKi9cbiAgICBfcmVmcmVzaENhY2hlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmIChzZWxmLl9yZWZyZXNoaW5nQ2FjaGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VsZi5fcmVmcmVzaGluZ0NhY2hlID0gdHJ1ZTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgICAgICB2YWx1ZS5fcmVmcmVzaENhY2hlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICB2YXIgb2JqZWN0QXJyYXkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gV2UgZG9uJ3QgY2FjaGUgYXJyYXlzIG9mIFBhcnNlLk9iamVjdHNcbiAgICAgICAgICAgIF8uZWFjaCh2YWx1ZSwgZnVuY3Rpb24oYXJyVmFsKSB7XG4gICAgICAgICAgICAgIGlmIChhcnJWYWwgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgICAgICAgICAgICBvYmplY3RBcnJheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYXJyVmFsLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghb2JqZWN0QXJyYXkgJiYgc2VsZi5fcmVzZXRDYWNoZUZvcktleShrZXkpKSB7XG4gICAgICAgICAgICBzZWxmLnNldChrZXksIG5ldyBQYXJzZS5PcC5TZXQodmFsdWUpLCB7IHNpbGVudDogdHJ1ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGVsZXRlIHNlbGYuX3JlZnJlc2hpbmdDYWNoZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb2JqZWN0IGhhcyBiZWVuIG1vZGlmaWVkIHNpbmNlIGl0cyBsYXN0XG4gICAgICogc2F2ZS9yZWZyZXNoLiAgSWYgYW4gYXR0cmlidXRlIGlzIHNwZWNpZmllZCwgaXQgcmV0dXJucyB0cnVlIG9ubHkgaWYgdGhhdFxuICAgICAqIHBhcnRpY3VsYXIgYXR0cmlidXRlIGhhcyBiZWVuIG1vZGlmaWVkIHNpbmNlIHRoZSBsYXN0IHNhdmUvcmVmcmVzaC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBbiBhdHRyaWJ1dGUgbmFtZSAob3B0aW9uYWwpLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZGlydHk6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHRoaXMuX3JlZnJlc2hDYWNoZSgpO1xuXG4gICAgICB2YXIgY3VycmVudENoYW5nZXMgPSBfLmxhc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG5cbiAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgIHJldHVybiAoY3VycmVudENoYW5nZXNbYXR0cl0gPyB0cnVlIDogZmFsc2UpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKF8ua2V5cyhjdXJyZW50Q2hhbmdlcykubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBrZXlzIHRoYXQgaGF2ZSBiZWVuIG1vZGlmaWVkIHNpbmNlIGxhc3Qgc2F2ZS9yZWZyZXNoXG4gICAgICogQHJldHVybiB7QXJyYXkgb2Ygc3RyaW5nfVxuICAgICAqL1xuICAgIGRpcnR5S2V5czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5rZXlzKF8ubGFzdCh0aGlzLl9vcFNldFF1ZXVlKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBQb2ludGVyIHJlZmVyZW5jaW5nIHRoaXMgT2JqZWN0LlxuICAgICAqL1xuICAgIF90b1BvaW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHNlcmlhbGl6ZSBhbiB1bnNhdmVkIFBhcnNlLk9iamVjdFwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IF9fdHlwZTogXCJQb2ludGVyXCIsXG4gICAgICAgICAgICAgICBjbGFzc05hbWU6IHRoaXMuY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgb2JqZWN0SWQ6IHRoaXMuaWQgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIFRoZSBzdHJpbmcgbmFtZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgcmVsYXRpb24gb24gdGhlIGdpdmVuIGNsYXNzIGZvciB0aGUgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSBTdHJpbmcgYXR0ciBUaGUgYXR0cmlidXRlIHRvIGdldCB0aGUgcmVsYXRpb24gZm9yLlxuICAgICAqL1xuICAgIHJlbGF0aW9uOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldChhdHRyKTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLlJlbGF0aW9uKSkge1xuICAgICAgICAgIHRocm93IFwiQ2FsbGVkIHJlbGF0aW9uKCkgb24gbm9uLXJlbGF0aW9uIGZpZWxkIFwiICsgYXR0cjtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZS5fZW5zdXJlUGFyZW50QW5kS2V5KHRoaXMsIGF0dHIpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLlJlbGF0aW9uKHRoaXMsIGF0dHIpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBIVE1MLWVzY2FwZWQgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqL1xuICAgIGVzY2FwZTogZnVuY3Rpb24oYXR0cikge1xuICAgICAgdmFyIGh0bWwgPSB0aGlzLl9lc2NhcGVkQXR0cmlidXRlc1thdHRyXTtcbiAgICAgIGlmIChodG1sKSB7XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgICAgfVxuICAgICAgdmFyIHZhbCA9IHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgICAgIHZhciBlc2NhcGVkO1xuICAgICAgaWYgKFBhcnNlLl9pc051bGxPclVuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgIGVzY2FwZWQgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVzY2FwZWQgPSBfLmVzY2FwZSh2YWwudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9lc2NhcGVkQXR0cmlidXRlc1thdHRyXSA9IGVzY2FwZWQ7XG4gICAgICByZXR1cm4gZXNjYXBlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgYXR0cmlidXRlIGNvbnRhaW5zIGEgdmFsdWUgdGhhdCBpcyBub3RcbiAgICAgKiBudWxsIG9yIHVuZGVmaW5lZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBUaGUgc3RyaW5nIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGhhczogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuICFQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQodGhpcy5hdHRyaWJ1dGVzW2F0dHJdKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHVsbHMgXCJzcGVjaWFsXCIgZmllbGRzIGxpa2Ugb2JqZWN0SWQsIGNyZWF0ZWRBdCwgZXRjLiBvdXQgb2YgYXR0cnNcbiAgICAgKiBhbmQgcHV0cyB0aGVtIG9uIFwidGhpc1wiIGRpcmVjdGx5LiAgUmVtb3ZlcyB0aGVtIGZyb20gYXR0cnMuXG4gICAgICogQHBhcmFtIGF0dHJzIC0gQSBkaWN0aW9uYXJ5IHdpdGggdGhlIGRhdGEgZm9yIHRoaXMgUGFyc2UuT2JqZWN0LlxuICAgICAqL1xuICAgIF9tZXJnZU1hZ2ljRmllbGRzOiBmdW5jdGlvbihhdHRycykge1xuICAgICAgLy8gQ2hlY2sgZm9yIGNoYW5nZXMgb2YgbWFnaWMgZmllbGRzLlxuICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgIHZhciBzcGVjaWFsRmllbGRzID0gW1wiaWRcIiwgXCJvYmplY3RJZFwiLCBcImNyZWF0ZWRBdFwiLCBcInVwZGF0ZWRBdFwiXTtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2goc3BlY2lhbEZpZWxkcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICBpZiAoYXR0cnNbYXR0cl0pIHtcbiAgICAgICAgICBpZiAoYXR0ciA9PT0gXCJvYmplY3RJZFwiKSB7XG4gICAgICAgICAgICBtb2RlbC5pZCA9IGF0dHJzW2F0dHJdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoKGF0dHIgPT09IFwiY3JlYXRlZEF0XCIgfHwgYXR0ciA9PT0gXCJ1cGRhdGVkQXRcIikgJiZcbiAgICAgICAgICAgICAgICAgICAgICFfLmlzRGF0ZShhdHRyc1thdHRyXSkpIHtcbiAgICAgICAgICAgIG1vZGVsW2F0dHJdID0gUGFyc2UuX3BhcnNlRGF0ZShhdHRyc1thdHRyXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vZGVsW2F0dHJdID0gYXR0cnNbYXR0cl07XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSBhdHRyc1thdHRyXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvcGllcyB0aGUgZ2l2ZW4gc2VydmVyRGF0YSB0byBcInRoaXNcIiwgcmVmcmVzaGVzIGF0dHJpYnV0ZXMsIGFuZFxuICAgICAqIGNsZWFycyBwZW5kaW5nIGNoYW5nZXM7XG4gICAgICovXG4gICAgX2NvcHlTZXJ2ZXJEYXRhOiBmdW5jdGlvbihzZXJ2ZXJEYXRhKSB7XG4gICAgICAvLyBDb3B5IHNlcnZlciBkYXRhXG4gICAgICB2YXIgdGVtcFNlcnZlckRhdGEgPSB7fTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHNlcnZlckRhdGEsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdGVtcFNlcnZlckRhdGFba2V5XSA9IFBhcnNlLl9kZWNvZGUoa2V5LCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NlcnZlckRhdGEgPSB0ZW1wU2VydmVyRGF0YTtcblxuICAgICAgLy8gUmVmcmVzaCB0aGUgYXR0cmlidXRlcy5cbiAgICAgIHRoaXMuX3JlYnVpbGRBbGxFc3RpbWF0ZWREYXRhKCk7XG5cbiAgICAgIC8vIFRPRE8gKGJrbGltdCk6IFJldmlzaXQgY2xlYXJpbmcgb3BlcmF0aW9ucywgcGVyaGFwcyBtb3ZlIHRvIHJldmVydC5cbiAgICAgIC8vIENsZWFyIG91dCBhbnkgY2hhbmdlcyB0aGUgdXNlciBtaWdodCBoYXZlIG1hZGUgcHJldmlvdXNseS5cbiAgICAgIHRoaXMuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgdGhpcy5fb3BTZXRRdWV1ZSA9IFt7fV07XG5cbiAgICAgIC8vIFJlZnJlc2ggdGhlIGF0dHJpYnV0ZXMgYWdhaW4uXG4gICAgICB0aGlzLl9yZWJ1aWxkQWxsRXN0aW1hdGVkRGF0YSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNZXJnZXMgYW5vdGhlciBvYmplY3QncyBhdHRyaWJ1dGVzIGludG8gdGhpcyBvYmplY3QuXG4gICAgICovXG4gICAgX21lcmdlRnJvbU9iamVjdDogZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIGlmICghb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGRvZXMgdGhlIGludmVyc2Ugb2YgX21lcmdlTWFnaWNGaWVsZHMuXG4gICAgICB0aGlzLmlkID0gb3RoZXIuaWQ7XG4gICAgICB0aGlzLmNyZWF0ZWRBdCA9IG90aGVyLmNyZWF0ZWRBdDtcbiAgICAgIHRoaXMudXBkYXRlZEF0ID0gb3RoZXIudXBkYXRlZEF0O1xuXG4gICAgICB0aGlzLl9jb3B5U2VydmVyRGF0YShvdGhlci5fc2VydmVyRGF0YSk7XG5cbiAgICAgIHRoaXMuX2hhc0RhdGEgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBqc29uIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBfc3RhcnRTYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX29wU2V0UXVldWUucHVzaCh7fSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgc2F2ZSBmYWlscyBiZWNhdXNlIG9mIGFuIGVycm9yLiBBbnkgY2hhbmdlcyB0aGF0IHdlcmUgcGFydFxuICAgICAqIG9mIHRoZSBzYXZlIG5lZWQgdG8gYmUgbWVyZ2VkIHdpdGggY2hhbmdlcyBtYWRlIGFmdGVyIHRoZSBzYXZlLiBUaGlzXG4gICAgICogbWlnaHQgdGhyb3cgYW4gZXhjZXB0aW9uIGlzIHlvdSBkbyBjb25mbGljdGluZyBvcGVyYXRpb25zLiBGb3IgZXhhbXBsZSxcbiAgICAgKiBpZiB5b3UgZG86XG4gICAgICogICBvYmplY3Quc2V0KFwiZm9vXCIsIFwiYmFyXCIpO1xuICAgICAqICAgb2JqZWN0LnNldChcImludmFsaWQgZmllbGQgbmFtZVwiLCBcImJhelwiKTtcbiAgICAgKiAgIG9iamVjdC5zYXZlKCk7XG4gICAgICogICBvYmplY3QuaW5jcmVtZW50KFwiZm9vXCIpO1xuICAgICAqIHRoZW4gdGhpcyB3aWxsIHRocm93IHdoZW4gdGhlIHNhdmUgZmFpbHMgYW5kIHRoZSBjbGllbnQgdHJpZXMgdG8gbWVyZ2VcbiAgICAgKiBcImJhclwiIHdpdGggdGhlICsxLlxuICAgICAqL1xuICAgIF9jYW5jZWxTYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBmYWlsZWRDaGFuZ2VzID0gXy5maXJzdCh0aGlzLl9vcFNldFF1ZXVlKTtcbiAgICAgIHRoaXMuX29wU2V0UXVldWUgPSBfLnJlc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG4gICAgICB2YXIgbmV4dENoYW5nZXMgPSBfLmZpcnN0KHRoaXMuX29wU2V0UXVldWUpO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goZmFpbGVkQ2hhbmdlcywgZnVuY3Rpb24ob3AsIGtleSkge1xuICAgICAgICB2YXIgb3AxID0gZmFpbGVkQ2hhbmdlc1trZXldO1xuICAgICAgICB2YXIgb3AyID0gbmV4dENoYW5nZXNba2V5XTtcbiAgICAgICAgaWYgKG9wMSAmJiBvcDIpIHtcbiAgICAgICAgICBuZXh0Q2hhbmdlc1trZXldID0gb3AyLl9tZXJnZVdpdGhQcmV2aW91cyhvcDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wMSkge1xuICAgICAgICAgIG5leHRDaGFuZ2VzW2tleV0gPSBvcDE7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc2F2aW5nID0gdGhpcy5fc2F2aW5nIC0gMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBzYXZlIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuIFRoaXMgbWVyZ2VzIHRoZSBjaGFuZ2VzIHRoYXRcbiAgICAgKiB3ZXJlIHNhdmVkIGludG8gdGhlIGtub3duIHNlcnZlciBkYXRhLCBhbmQgb3ZlcnJpZGVzIGl0IHdpdGggYW55IGRhdGFcbiAgICAgKiBzZW50IGRpcmVjdGx5IGZyb20gdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBfZmluaXNoU2F2ZTogZnVuY3Rpb24oc2VydmVyRGF0YSkge1xuICAgICAgLy8gR3JhYiBhIGNvcHkgb2YgYW55IG9iamVjdCByZWZlcmVuY2VkIGJ5IHRoaXMgb2JqZWN0LiBUaGVzZSBpbnN0YW5jZXNcbiAgICAgIC8vIG1heSBoYXZlIGFscmVhZHkgYmVlbiBmZXRjaGVkLCBhbmQgd2UgZG9uJ3Qgd2FudCB0byBsb3NlIHRoZWlyIGRhdGEuXG4gICAgICAvLyBOb3RlIHRoYXQgZG9pbmcgaXQgbGlrZSB0aGlzIG1lYW5zIHdlIHdpbGwgdW5pZnkgc2VwYXJhdGUgY29waWVzIG9mIHRoZVxuICAgICAgLy8gc2FtZSBvYmplY3QsIGJ1dCB0aGF0J3MgYSByaXNrIHdlIGhhdmUgdG8gdGFrZS5cbiAgICAgIHZhciBmZXRjaGVkT2JqZWN0cyA9IHt9O1xuICAgICAgUGFyc2UuX3RyYXZlcnNlKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QgJiYgb2JqZWN0LmlkICYmIG9iamVjdC5faGFzRGF0YSkge1xuICAgICAgICAgIGZldGNoZWRPYmplY3RzW29iamVjdC5pZF0gPSBvYmplY3Q7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgc2F2ZWRDaGFuZ2VzID0gXy5maXJzdCh0aGlzLl9vcFNldFF1ZXVlKTtcbiAgICAgIHRoaXMuX29wU2V0UXVldWUgPSBfLnJlc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG4gICAgICB0aGlzLl9hcHBseU9wU2V0KHNhdmVkQ2hhbmdlcywgdGhpcy5fc2VydmVyRGF0YSk7XG4gICAgICB0aGlzLl9tZXJnZU1hZ2ljRmllbGRzKHNlcnZlckRhdGEpO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goc2VydmVyRGF0YSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBzZWxmLl9zZXJ2ZXJEYXRhW2tleV0gPSBQYXJzZS5fZGVjb2RlKGtleSwgdmFsdWUpO1xuXG4gICAgICAgIC8vIExvb2sgZm9yIGFueSBvYmplY3RzIHRoYXQgbWlnaHQgaGF2ZSBiZWNvbWUgdW5mZXRjaGVkIGFuZCBmaXggdGhlbVxuICAgICAgICAvLyBieSByZXBsYWNpbmcgdGhlaXIgdmFsdWVzIHdpdGggdGhlIHByZXZpb3VzbHkgb2JzZXJ2ZWQgdmFsdWVzLlxuICAgICAgICB2YXIgZmV0Y2hlZCA9IFBhcnNlLl90cmF2ZXJzZShzZWxmLl9zZXJ2ZXJEYXRhW2tleV0sIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QgJiYgZmV0Y2hlZE9iamVjdHNbb2JqZWN0LmlkXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZldGNoZWRPYmplY3RzW29iamVjdC5pZF07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGZldGNoZWQpIHtcbiAgICAgICAgICBzZWxmLl9zZXJ2ZXJEYXRhW2tleV0gPSBmZXRjaGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlYnVpbGRBbGxFc3RpbWF0ZWREYXRhKCk7XG4gICAgICB0aGlzLl9zYXZpbmcgPSB0aGlzLl9zYXZpbmcgLSAxO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIGZldGNoIG9yIGxvZ2luIGlzIGNvbXBsZXRlIHRvIHNldCB0aGUga25vd24gc2VydmVyIGRhdGEgdG9cbiAgICAgKiB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgICAqL1xuICAgIF9maW5pc2hGZXRjaDogZnVuY3Rpb24oc2VydmVyRGF0YSwgaGFzRGF0YSkge1xuICAgICAgLy8gVE9ETyAoYmtsaW10KTogUmV2aXNpdCBjbGVhcmluZyBvcGVyYXRpb25zLCBwZXJoYXBzIG1vdmUgdG8gcmV2ZXJ0LlxuICAgICAgdGhpcy5fb3BTZXRRdWV1ZSA9IFt7fV07XG5cbiAgICAgIC8vIEJyaW5nIGluIGFsbCB0aGUgbmV3IHNlcnZlciBkYXRhLlxuICAgICAgdGhpcy5fbWVyZ2VNYWdpY0ZpZWxkcyhzZXJ2ZXJEYXRhKTtcbiAgICAgIHRoaXMuX2NvcHlTZXJ2ZXJEYXRhKHNlcnZlckRhdGEpO1xuXG4gICAgICB0aGlzLl9oYXNEYXRhID0gaGFzRGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXBwbGllcyB0aGUgc2V0IG9mIFBhcnNlLk9wIGluIG9wU2V0IHRvIHRoZSBvYmplY3QgdGFyZ2V0LlxuICAgICAqL1xuICAgIF9hcHBseU9wU2V0OiBmdW5jdGlvbihvcFNldCwgdGFyZ2V0KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChvcFNldCwgZnVuY3Rpb24oY2hhbmdlLCBrZXkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBjaGFuZ2UuX2VzdGltYXRlKHRhcmdldFtrZXldLCBzZWxmLCBrZXkpO1xuICAgICAgICBpZiAodGFyZ2V0W2tleV0gPT09IFBhcnNlLk9wLl9VTlNFVCkge1xuICAgICAgICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIHRoZSBjYWNoZWQgdmFsdWUgZm9yIGtleSB3aXRoIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgbmV3IHZhbHVlIGlzIGRpZmZlcmVudCB0aGFuIHRoZSBvbGQgdmFsdWUuXG4gICAgICovXG4gICAgX3Jlc2V0Q2FjaGVGb3JLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5hdHRyaWJ1dGVzW2tleV07XG4gICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiZcbiAgICAgICAgICAhKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSAmJlxuICAgICAgICAgICEodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5GaWxlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTiA/IHZhbHVlLnRvSlNPTigpIDogdmFsdWU7XG4gICAgICAgIHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5faGFzaGVkSlNPTltrZXldICE9PSBqc29uKSB7XG4gICAgICAgICAgdmFyIHdhc1NldCA9ICEhdGhpcy5faGFzaGVkSlNPTltrZXldO1xuICAgICAgICAgIHRoaXMuX2hhc2hlZEpTT05ba2V5XSA9IGpzb247XG4gICAgICAgICAgcmV0dXJuIHdhc1NldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQb3B1bGF0ZXMgYXR0cmlidXRlc1trZXldIGJ5IHN0YXJ0aW5nIHdpdGggdGhlIGxhc3Qga25vd24gZGF0YSBmcm9tIHRoZVxuICAgICAqIHNlcnZlciwgYW5kIGFwcGx5aW5nIGFsbCBvZiB0aGUgbG9jYWwgY2hhbmdlcyB0aGF0IGhhdmUgYmVlbiBtYWRlIHRvIHRoYXRcbiAgICAgKiBrZXkgc2luY2UgdGhlbi5cbiAgICAgKi9cbiAgICBfcmVidWlsZEVzdGltYXRlZERhdGFGb3JLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1trZXldO1xuICAgICAgaWYgKHRoaXMuX3NlcnZlckRhdGFba2V5XSkge1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNba2V5XSA9IHRoaXMuX3NlcnZlckRhdGFba2V5XTtcbiAgICAgIH1cbiAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5fb3BTZXRRdWV1ZSwgZnVuY3Rpb24ob3BTZXQpIHtcbiAgICAgICAgdmFyIG9wID0gb3BTZXRba2V5XTtcbiAgICAgICAgaWYgKG9wKSB7XG4gICAgICAgICAgc2VsZi5hdHRyaWJ1dGVzW2tleV0gPSBvcC5fZXN0aW1hdGUoc2VsZi5hdHRyaWJ1dGVzW2tleV0sIHNlbGYsIGtleSk7XG4gICAgICAgICAgaWYgKHNlbGYuYXR0cmlidXRlc1trZXldID09PSBQYXJzZS5PcC5fVU5TRVQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBzZWxmLmF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5fcmVzZXRDYWNoZUZvcktleShrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBvcHVsYXRlcyBhdHRyaWJ1dGVzIGJ5IHN0YXJ0aW5nIHdpdGggdGhlIGxhc3Qga25vd24gZGF0YSBmcm9tIHRoZVxuICAgICAqIHNlcnZlciwgYW5kIGFwcGx5aW5nIGFsbCBvZiB0aGUgbG9jYWwgY2hhbmdlcyB0aGF0IGhhdmUgYmVlbiBtYWRlIHNpbmNlXG4gICAgICogdGhlbi5cbiAgICAgKi9cbiAgICBfcmVidWlsZEFsbEVzdGltYXRlZERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgcHJldmlvdXNBdHRyaWJ1dGVzID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuXG4gICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBfLmNsb25lKHRoaXMuX3NlcnZlckRhdGEpO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLl9vcFNldFF1ZXVlLCBmdW5jdGlvbihvcFNldCkge1xuICAgICAgICBzZWxmLl9hcHBseU9wU2V0KG9wU2V0LCBzZWxmLmF0dHJpYnV0ZXMpO1xuICAgICAgICBQYXJzZS5fb2JqZWN0RWFjaChvcFNldCwgZnVuY3Rpb24ob3AsIGtleSkge1xuICAgICAgICAgIHNlbGYuX3Jlc2V0Q2FjaGVGb3JLZXkoa2V5KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UgZXZlbnRzIGZvciBhbnl0aGluZyB0aGF0IGNoYW5nZWQgYmVjYXVzZSBvZiB0aGUgZmV0Y2guXG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChwcmV2aW91c0F0dHJpYnV0ZXMsIGZ1bmN0aW9uKG9sZFZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHNlbGYuYXR0cmlidXRlc1trZXldICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOicgKyBrZXksIHNlbGYsIHNlbGYuYXR0cmlidXRlc1trZXldLCB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5hdHRyaWJ1dGVzLCBmdW5jdGlvbihuZXdWYWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICghXy5oYXMocHJldmlvdXNBdHRyaWJ1dGVzLCBrZXkpKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6JyArIGtleSwgc2VsZiwgbmV3VmFsdWUsIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBoYXNoIG9mIG1vZGVsIGF0dHJpYnV0ZXMgb24gdGhlIG9iamVjdCwgZmlyaW5nXG4gICAgICogPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gdW5sZXNzIHlvdSBjaG9vc2UgdG8gc2lsZW5jZSBpdC5cbiAgICAgKlxuICAgICAqIDxwPllvdSBjYW4gY2FsbCBpdCB3aXRoIGFuIG9iamVjdCBjb250YWluaW5nIGtleXMgYW5kIHZhbHVlcywgb3Igd2l0aCBvbmVcbiAgICAgKiBrZXkgYW5kIHZhbHVlLiAgRm9yIGV4YW1wbGU6PHByZT5cbiAgICAgKiAgIGdhbWVUdXJuLnNldCh7XG4gICAgICogICAgIHBsYXllcjogcGxheWVyMSxcbiAgICAgKiAgICAgZGljZVJvbGw6IDJcbiAgICAgKiAgIH0sIHtcbiAgICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGdhbWVUdXJuQWdhaW4sIGVycm9yKSB7XG4gICAgICogICAgICAgLy8gVGhlIHNldCBmYWlsZWQgdmFsaWRhdGlvbi5cbiAgICAgKiAgICAgfVxuICAgICAqICAgfSk7XG4gICAgICpcbiAgICAgKiAgIGdhbWUuc2V0KFwiY3VycmVudFBsYXllclwiLCBwbGF5ZXIyLCB7XG4gICAgICogICAgIGVycm9yOiBmdW5jdGlvbihnYW1lVHVybkFnYWluLCBlcnJvcikge1xuICAgICAqICAgICAgIC8vIFRoZSBzZXQgZmFpbGVkIHZhbGlkYXRpb24uXG4gICAgICogICAgIH1cbiAgICAgKiAgIH0pO1xuICAgICAqXG4gICAgICogICBnYW1lLnNldChcImZpbmlzaGVkXCIsIHRydWUpOzwvcHJlPjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBzZXQuXG4gICAgICogQHBhcmFtIHt9IHZhbHVlIFRoZSB2YWx1ZSB0byBnaXZlIGl0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgc2V0IG9mIEJhY2tib25lLWxpa2Ugb3B0aW9ucyBmb3IgdGhlIHNldC5cbiAgICAgKiAgICAgVGhlIG9ubHkgc3VwcG9ydGVkIG9wdGlvbnMgYXJlIDxjb2RlPnNpbGVudDwvY29kZT4sXG4gICAgICogICAgIDxjb2RlPmVycm9yPC9jb2RlPiwgYW5kIDxjb2RlPnByb21pc2U8L2NvZGU+LlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHNldCBzdWNjZWVkZWQuXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3QjdmFsaWRhdGVcbiAgICAgKiBAc2VlIFBhcnNlLkVycm9yXG4gICAgICovXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICB2YXIgYXR0cnMsIGF0dHI7XG4gICAgICBpZiAoXy5pc09iamVjdChrZXkpIHx8IFBhcnNlLl9pc051bGxPclVuZGVmaW5lZChrZXkpKSB7XG4gICAgICAgIGF0dHJzID0ga2V5O1xuICAgICAgICBQYXJzZS5fb2JqZWN0RWFjaChhdHRycywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICAgIGF0dHJzW2tdID0gUGFyc2UuX2RlY29kZShrLCB2KTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9wdGlvbnMgPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0ge307XG4gICAgICAgIGF0dHJzW2tleV0gPSBQYXJzZS5fZGVjb2RlKGtleSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBFeHRyYWN0IGF0dHJpYnV0ZXMgYW5kIG9wdGlvbnMuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIGlmICghYXR0cnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAoYXR0cnMgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgICAgYXR0cnMgPSBhdHRycy5hdHRyaWJ1dGVzO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChhdHRycywgZnVuY3Rpb24odW51c2VkX3ZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHNlbGYuY29uc3RydWN0b3IucmVhZE9ubHlBdHRyaWJ1dGVzICYmXG4gICAgICAgICAgc2VsZi5jb25zdHJ1Y3Rvci5yZWFkT25seUF0dHJpYnV0ZXNba2V5XSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IG1vZGlmeSByZWFkb25seSBrZXk6ICcgKyBrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gSWYgdGhlIHVuc2V0IG9wdGlvbiBpcyB1c2VkLCBldmVyeSBhdHRyaWJ1dGUgc2hvdWxkIGJlIGEgVW5zZXQuXG4gICAgICBpZiAob3B0aW9ucy51bnNldCkge1xuICAgICAgICBQYXJzZS5fb2JqZWN0RWFjaChhdHRycywgZnVuY3Rpb24odW51c2VkX3ZhbHVlLCBrZXkpIHtcbiAgICAgICAgICBhdHRyc1trZXldID0gbmV3IFBhcnNlLk9wLlVuc2V0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBhbGwgdGhlIGF0dHJpYnV0ZXMgdG8gZ2V0IHRoZSBlc3RpbWF0ZWQgdmFsdWVzLlxuICAgICAgdmFyIGRhdGFUb1ZhbGlkYXRlID0gXy5jbG9uZShhdHRycyk7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChkYXRhVG9WYWxpZGF0ZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PcCkge1xuICAgICAgICAgIGRhdGFUb1ZhbGlkYXRlW2tleV0gPSB2YWx1ZS5fZXN0aW1hdGUoc2VsZi5hdHRyaWJ1dGVzW2tleV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLCBrZXkpO1xuICAgICAgICAgIGlmIChkYXRhVG9WYWxpZGF0ZVtrZXldID09PSBQYXJzZS5PcC5fVU5TRVQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhVG9WYWxpZGF0ZVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIFJ1biB2YWxpZGF0aW9uLlxuICAgICAgaWYgKCF0aGlzLl92YWxpZGF0ZShhdHRycywgb3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tZXJnZU1hZ2ljRmllbGRzKGF0dHJzKTtcblxuICAgICAgb3B0aW9ucy5jaGFuZ2VzID0ge307XG4gICAgICB2YXIgZXNjYXBlZCA9IHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzO1xuICAgICAgdmFyIHByZXYgPSB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMgfHwge307XG5cbiAgICAgIC8vIFVwZGF0ZSBhdHRyaWJ1dGVzLlxuICAgICAgUGFyc2UuX2FycmF5RWFjaChfLmtleXMoYXR0cnMpLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhdHRyc1thdHRyXTtcblxuICAgICAgICAvLyBJZiB0aGlzIGlzIGEgcmVsYXRpb24gb2JqZWN0IHdlIG5lZWQgdG8gc2V0IHRoZSBwYXJlbnQgY29ycmVjdGx5LFxuICAgICAgICAvLyBzaW5jZSB0aGUgbG9jYXRpb24gd2hlcmUgaXQgd2FzIHBhcnNlZCBkb2VzIG5vdCBoYXZlIGFjY2VzcyB0b1xuICAgICAgICAvLyB0aGlzIG9iamVjdC5cbiAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIFBhcnNlLlJlbGF0aW9uKSB7XG4gICAgICAgICAgdmFsLnBhcmVudCA9IHNlbGY7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISh2YWwgaW5zdGFuY2VvZiBQYXJzZS5PcCkpIHtcbiAgICAgICAgICB2YWwgPSBuZXcgUGFyc2UuT3AuU2V0KHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZWUgaWYgdGhpcyBjaGFuZ2Ugd2lsbCBhY3R1YWxseSBoYXZlIGFueSBlZmZlY3QuXG4gICAgICAgIHZhciBpc1JlYWxDaGFuZ2UgPSB0cnVlO1xuICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgUGFyc2UuT3AuU2V0ICYmXG4gICAgICAgICAgICBfLmlzRXF1YWwoc2VsZi5hdHRyaWJ1dGVzW2F0dHJdLCB2YWwudmFsdWUpKSB7XG4gICAgICAgICAgaXNSZWFsQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNSZWFsQ2hhbmdlKSB7XG4gICAgICAgICAgZGVsZXRlIGVzY2FwZWRbYXR0cl07XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICBzZWxmLl9zaWxlbnRbYXR0cl0gPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHRpb25zLmNoYW5nZXNbYXR0cl0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjdXJyZW50Q2hhbmdlcyA9IF8ubGFzdChzZWxmLl9vcFNldFF1ZXVlKTtcbiAgICAgICAgY3VycmVudENoYW5nZXNbYXR0cl0gPSB2YWwuX21lcmdlV2l0aFByZXZpb3VzKGN1cnJlbnRDaGFuZ2VzW2F0dHJdKTtcbiAgICAgICAgc2VsZi5fcmVidWlsZEVzdGltYXRlZERhdGFGb3JLZXkoYXR0cik7XG5cbiAgICAgICAgaWYgKGlzUmVhbENoYW5nZSkge1xuICAgICAgICAgIHNlbGYuY2hhbmdlZFthdHRyXSA9IHNlbGYuYXR0cmlidXRlc1thdHRyXTtcbiAgICAgICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICBzZWxmLl9wZW5kaW5nW2F0dHJdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHNlbGYuY2hhbmdlZFthdHRyXTtcbiAgICAgICAgICBkZWxldGUgc2VsZi5fcGVuZGluZ1thdHRyXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2Uob3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGF0dHJpYnV0ZSBmcm9tIHRoZSBtb2RlbCwgZmlyaW5nIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IHVubGVzc1xuICAgICAqIHlvdSBjaG9vc2UgdG8gc2lsZW5jZSBpdC4gVGhpcyBpcyBhIG5vb3AgaWYgdGhlIGF0dHJpYnV0ZSBkb2Vzbid0XG4gICAgICogZXhpc3QuXG4gICAgICovXG4gICAgdW5zZXQ6IGZ1bmN0aW9uKGF0dHIsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgb3B0aW9ucy51bnNldCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXR0ciwgbnVsbCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEF0b21pY2FsbHkgaW5jcmVtZW50cyB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIGF0dHJpYnV0ZSB0aGUgbmV4dCB0aW1lIHRoZVxuICAgICAqIG9iamVjdCBpcyBzYXZlZC4gSWYgbm8gYW1vdW50IGlzIHNwZWNpZmllZCwgMSBpcyB1c2VkIGJ5IGRlZmF1bHQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXR0ciB7U3RyaW5nfSBUaGUga2V5LlxuICAgICAqIEBwYXJhbSBhbW91bnQge051bWJlcn0gVGhlIGFtb3VudCB0byBpbmNyZW1lbnQgYnkuXG4gICAgICovXG4gICAgaW5jcmVtZW50OiBmdW5jdGlvbihhdHRyLCBhbW91bnQpIHtcbiAgICAgIGlmIChfLmlzVW5kZWZpbmVkKGFtb3VudCkgfHwgXy5pc051bGwoYW1vdW50KSkge1xuICAgICAgICBhbW91bnQgPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHIsIG5ldyBQYXJzZS5PcC5JbmNyZW1lbnQoYW1vdW50KSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEF0b21pY2FsbHkgYWRkIGFuIG9iamVjdCB0byB0aGUgZW5kIG9mIHRoZSBhcnJheSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlblxuICAgICAqIGtleS5cbiAgICAgKiBAcGFyYW0gYXR0ciB7U3RyaW5nfSBUaGUga2V5LlxuICAgICAqIEBwYXJhbSBpdGVtIHt9IFRoZSBpdGVtIHRvIGFkZC5cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKGF0dHIsIGl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChhdHRyLCBuZXcgUGFyc2UuT3AuQWRkKFtpdGVtXSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdG9taWNhbGx5IGFkZCBhbiBvYmplY3QgdG8gdGhlIGFycmF5IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGtleSwgb25seVxuICAgICAqIGlmIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQgaW4gdGhlIGFycmF5LiBUaGUgcG9zaXRpb24gb2YgdGhlIGluc2VydCBpc1xuICAgICAqIG5vdCBndWFyYW50ZWVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGF0dHIge1N0cmluZ30gVGhlIGtleS5cbiAgICAgKiBAcGFyYW0gaXRlbSB7fSBUaGUgb2JqZWN0IHRvIGFkZC5cbiAgICAgKi9cbiAgICBhZGRVbmlxdWU6IGZ1bmN0aW9uKGF0dHIsIGl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChhdHRyLCBuZXcgUGFyc2UuT3AuQWRkVW5pcXVlKFtpdGVtXSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdG9taWNhbGx5IHJlbW92ZSBhbGwgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCBmcm9tIHRoZSBhcnJheSBhc3NvY2lhdGVkXG4gICAgICogd2l0aCBhIGdpdmVuIGtleS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhdHRyIHtTdHJpbmd9IFRoZSBrZXkuXG4gICAgICogQHBhcmFtIGl0ZW0ge30gVGhlIG9iamVjdCB0byByZW1vdmUuXG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihhdHRyLCBpdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXR0ciwgbmV3IFBhcnNlLk9wLlJlbW92ZShbaXRlbV0pKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBpbnN0YW5jZSBvZiBhIHN1YmNsYXNzIG9mIFBhcnNlLk9wIGRlc2NyaWJpbmcgd2hhdCBraW5kIG9mXG4gICAgICogbW9kaWZpY2F0aW9uIGhhcyBiZWVuIHBlcmZvcm1lZCBvbiB0aGlzIGZpZWxkIHNpbmNlIHRoZSBsYXN0IHRpbWUgaXQgd2FzXG4gICAgICogc2F2ZWQuIEZvciBleGFtcGxlLCBhZnRlciBjYWxsaW5nIG9iamVjdC5pbmNyZW1lbnQoXCJ4XCIpLCBjYWxsaW5nXG4gICAgICogb2JqZWN0Lm9wKFwieFwiKSB3b3VsZCByZXR1cm4gYW4gaW5zdGFuY2Ugb2YgUGFyc2UuT3AuSW5jcmVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIGF0dHIge1N0cmluZ30gVGhlIGtleS5cbiAgICAgKiBAcmV0dXJucyB7UGFyc2UuT3B9IFRoZSBvcGVyYXRpb24sIG9yIHVuZGVmaW5lZCBpZiBub25lLlxuICAgICAqL1xuICAgIG9wOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gXy5sYXN0KHRoaXMuX29wU2V0UXVldWUpW2F0dHJdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgYXR0cmlidXRlcyBvbiB0aGUgbW9kZWwsIGZpcmluZyA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiB1bmxlc3NcbiAgICAgKiB5b3UgY2hvb3NlIHRvIHNpbGVuY2UgaXQuXG4gICAgICovXG4gICAgY2xlYXI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgb3B0aW9ucy51bnNldCA9IHRydWU7XG4gICAgICB2YXIga2V5c1RvQ2xlYXIgPSBfLmV4dGVuZCh0aGlzLmF0dHJpYnV0ZXMsIHRoaXMuX29wZXJhdGlvbnMpO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGtleXNUb0NsZWFyLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04tZW5jb2RlZCBzZXQgb2Ygb3BlcmF0aW9ucyB0byBiZSBzZW50IHdpdGggdGhlIG5leHQgc2F2ZVxuICAgICAqIHJlcXVlc3QuXG4gICAgICovXG4gICAgX2dldFNhdmVKU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0gXy5jbG9uZShfLmZpcnN0KHRoaXMuX29wU2V0UXVldWUpKTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGpzb24sIGZ1bmN0aW9uKG9wLCBrZXkpIHtcbiAgICAgICAganNvbltrZXldID0gb3AudG9KU09OKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBvYmplY3QgY2FuIGJlIHNlcmlhbGl6ZWQgZm9yIHNhdmluZy5cbiAgICAgKi9cbiAgICBfY2FuQmVTZXJpYWxpemVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2NhbkJlU2VyaWFsaXplZEFzVmFsdWUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggdGhlIG1vZGVsIGZyb20gdGhlIHNlcnZlci4gSWYgdGhlIHNlcnZlcidzIHJlcHJlc2VudGF0aW9uIG9mIHRoZVxuICAgICAqIG1vZGVsIGRpZmZlcnMgZnJvbSBpdHMgY3VycmVudCBhdHRyaWJ1dGVzLCB0aGV5IHdpbGwgYmUgb3ZlcnJpZGVuLFxuICAgICAqIHRyaWdnZXJpbmcgYSA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIGZldGNoXG4gICAgICogICAgIGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBmZXRjaDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcm91dGU6IFwiY2xhc3Nlc1wiLFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMuY2xhc3NOYW1lLFxuICAgICAgICBvYmplY3RJZDogdGhpcy5pZCxcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhocikge1xuICAgICAgICBzZWxmLl9maW5pc2hGZXRjaChzZWxmLnBhcnNlKHJlc3BvbnNlLCBzdGF0dXMsIHhociksIHRydWUpO1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBoYXNoIG9mIG1vZGVsIGF0dHJpYnV0ZXMsIGFuZCBzYXZlIHRoZSBtb2RlbCB0byB0aGUgc2VydmVyLlxuICAgICAqIHVwZGF0ZWRBdCB3aWxsIGJlIHVwZGF0ZWQgd2hlbiB0aGUgcmVxdWVzdCByZXR1cm5zLlxuICAgICAqIFlvdSBjYW4gZWl0aGVyIGNhbGwgaXQgYXM6PHByZT5cbiAgICAgKiAgIG9iamVjdC5zYXZlKCk7PC9wcmU+XG4gICAgICogb3I8cHJlPlxuICAgICAqICAgb2JqZWN0LnNhdmUobnVsbCwgb3B0aW9ucyk7PC9wcmU+XG4gICAgICogb3I8cHJlPlxuICAgICAqICAgb2JqZWN0LnNhdmUoYXR0cnMsIG9wdGlvbnMpOzwvcHJlPlxuICAgICAqIG9yPHByZT5cbiAgICAgKiAgIG9iamVjdC5zYXZlKGtleSwgdmFsdWUsIG9wdGlvbnMpOzwvcHJlPlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUsIDxwcmU+XG4gICAgICogICBnYW1lVHVybi5zYXZlKHtcbiAgICAgKiAgICAgcGxheWVyOiBcIkpha2UgQ3V0dGVyXCIsXG4gICAgICogICAgIGRpY2VSb2xsOiAyXG4gICAgICogICB9LCB7XG4gICAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGdhbWVUdXJuQWdhaW4pIHtcbiAgICAgKiAgICAgICAvLyBUaGUgc2F2ZSB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgKiAgICAgfSxcbiAgICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGdhbWVUdXJuQWdhaW4sIGVycm9yKSB7XG4gICAgICogICAgICAgLy8gVGhlIHNhdmUgZmFpbGVkLiAgRXJyb3IgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IuXG4gICAgICogICAgIH1cbiAgICAgKiAgIH0pOzwvcHJlPlxuICAgICAqIG9yIHdpdGggcHJvbWlzZXM6PHByZT5cbiAgICAgKiAgIGdhbWVUdXJuLnNhdmUoe1xuICAgICAqICAgICBwbGF5ZXI6IFwiSmFrZSBDdXR0ZXJcIixcbiAgICAgKiAgICAgZGljZVJvbGw6IDJcbiAgICAgKiAgIH0pLnRoZW4oZnVuY3Rpb24oZ2FtZVR1cm5BZ2Fpbikge1xuICAgICAqICAgICAvLyBUaGUgc2F2ZSB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgKiAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICogICAgIC8vIFRoZSBzYXZlIGZhaWxlZC4gIEVycm9yIGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLkVycm9yLlxuICAgICAqICAgfSk7PC9wcmU+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+d2FpdDogU2V0IHRvIHRydWUgdG8gd2FpdCBmb3IgdGhlIHNlcnZlciB0byBjb25maXJtIGEgc3VjY2Vzc2Z1bFxuICAgICAqICAgc2F2ZSBiZWZvcmUgbW9kaWZ5aW5nIHRoZSBhdHRyaWJ1dGVzIG9uIHRoZSBvYmplY3QuXG4gICAgICogICA8bGk+c2lsZW50OiBTZXQgdG8gdHJ1ZSB0byBhdm9pZCBmaXJpbmcgdGhlIGBzZXRgIGV2ZW50LlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgc2F2ZVxuICAgICAqICAgICBjb21wbGV0ZXMuXG4gICAgICogQHNlZSBQYXJzZS5FcnJvclxuICAgICAqL1xuICAgIHNhdmU6IGZ1bmN0aW9uKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgIHZhciBpLCBhdHRycywgY3VycmVudCwgb3B0aW9ucywgc2F2ZWQ7XG4gICAgICBpZiAoXy5pc09iamVjdChhcmcxKSB8fCBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQoYXJnMSkpIHtcbiAgICAgICAgYXR0cnMgPSBhcmcxO1xuICAgICAgICBvcHRpb25zID0gYXJnMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0ge307XG4gICAgICAgIGF0dHJzW2FyZzFdID0gYXJnMjtcbiAgICAgICAgb3B0aW9ucyA9IGFyZzM7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2Ugc2F2ZSh7IHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge30gfSkgd29yay5cbiAgICAgIGlmICghb3B0aW9ucyAmJiBhdHRycykge1xuICAgICAgICB2YXIgZXh0cmFfa2V5cyA9IF8ucmVqZWN0KGF0dHJzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShbXCJzdWNjZXNzXCIsIFwiZXJyb3JcIiwgXCJ3YWl0XCJdLCBrZXkpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGV4dHJhX2tleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdmFyIGFsbF9mdW5jdGlvbnMgPSB0cnVlO1xuICAgICAgICAgIGlmIChfLmhhcyhhdHRycywgXCJzdWNjZXNzXCIpICYmICFfLmlzRnVuY3Rpb24oYXR0cnMuc3VjY2VzcykpIHtcbiAgICAgICAgICAgIGFsbF9mdW5jdGlvbnMgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaGFzKGF0dHJzLCBcImVycm9yXCIpICYmICFfLmlzRnVuY3Rpb24oYXR0cnMuZXJyb3IpKSB7XG4gICAgICAgICAgICBhbGxfZnVuY3Rpb25zID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhbGxfZnVuY3Rpb25zKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGF0dHJzIG9iamVjdCBsb29rcyBsaWtlIGl0J3MgcmVhbGx5IGFuIG9wdGlvbnMgb2JqZWN0LFxuICAgICAgICAgICAgLy8gYW5kIHRoZXJlJ3Mgbm8gb3RoZXIgb3B0aW9ucyBvYmplY3QsIHNvIGxldCdzIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZShudWxsLCBhdHRycyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgaWYgKG9wdGlvbnMud2FpdCkge1xuICAgICAgICBjdXJyZW50ID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICBpZiAoc2V0T3B0aW9ucy53YWl0KSB7XG4gICAgICAgIHNldE9wdGlvbnMuc2lsZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBzZXRFcnJvcjtcbiAgICAgIHNldE9wdGlvbnMuZXJyb3IgPSBmdW5jdGlvbihtb2RlbCwgZXJyb3IpIHtcbiAgICAgICAgc2V0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH07XG4gICAgICBpZiAoYXR0cnMgJiYgIXRoaXMuc2V0KGF0dHJzLCBzZXRPcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihzZXRFcnJvcikuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGFueSB1bnNhdmVkIGNoaWxkLCBzYXZlIGl0IGZpcnN0LlxuICAgICAgbW9kZWwuX3JlZnJlc2hDYWNoZSgpO1xuXG4gICAgICAvLyBUT0RPKGtsaW10KTogUmVmYWN0b3IgdGhpcyBzbyB0aGF0IHRoZSBzYXZlIHN0YXJ0cyBub3csIG5vdCBsYXRlci5cblxuICAgICAgdmFyIHVuc2F2ZWRDaGlsZHJlbiA9IFtdO1xuICAgICAgdmFyIHVuc2F2ZWRGaWxlcyA9IFtdO1xuICAgICAgUGFyc2UuT2JqZWN0Ll9maW5kVW5zYXZlZENoaWxkcmVuKG1vZGVsLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5zYXZlZENoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuc2F2ZWRGaWxlcyk7XG4gICAgICBpZiAodW5zYXZlZENoaWxkcmVuLmxlbmd0aCArIHVuc2F2ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2RlZXBTYXZlQXN5bmModGhpcy5hdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBtb2RlbC5zYXZlKG51bGwsIG9wdGlvbnMpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCBtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdGFydFNhdmUoKTtcbiAgICAgIHRoaXMuX3NhdmluZyA9ICh0aGlzLl9zYXZpbmcgfHwgMCkgKyAxO1xuXG4gICAgICB0aGlzLl9hbGxQcmV2aW91c1NhdmVzID0gdGhpcy5fYWxsUHJldmlvdXNTYXZlcyB8fCBQYXJzZS5Qcm9taXNlLmFzKCk7XG4gICAgICB0aGlzLl9hbGxQcmV2aW91c1NhdmVzID0gdGhpcy5fYWxsUHJldmlvdXNTYXZlcy5fY29udGludWVXaXRoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWV0aG9kID0gbW9kZWwuaWQgPyAnUFVUJyA6ICdQT1NUJztcblxuICAgICAgICB2YXIganNvbiA9IG1vZGVsLl9nZXRTYXZlSlNPTigpO1xuXG4gICAgICAgIHZhciByb3V0ZSA9IFwiY2xhc3Nlc1wiO1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gbW9kZWwuY2xhc3NOYW1lO1xuICAgICAgICBpZiAobW9kZWwuY2xhc3NOYW1lID09PSBcIl9Vc2VyXCIgJiYgIW1vZGVsLmlkKSB7XG4gICAgICAgICAgLy8gU3BlY2lhbC1jYXNlIHVzZXIgc2lnbi11cC5cbiAgICAgICAgICByb3V0ZSA9IFwidXNlcnNcIjtcbiAgICAgICAgICBjbGFzc05hbWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZSxcbiAgICAgICAgICBvYmplY3RJZDogbW9kZWwuaWQsXG4gICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgICBkYXRhOiBqc29uXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgICB2YXIgc2VydmVyQXR0cnMgPSBtb2RlbC5wYXJzZShyZXNwLCBzdGF0dXMsIHhocik7XG4gICAgICAgICAgaWYgKG9wdGlvbnMud2FpdCkge1xuICAgICAgICAgICAgc2VydmVyQXR0cnMgPSBfLmV4dGVuZChhdHRycyB8fCB7fSwgc2VydmVyQXR0cnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb2RlbC5fZmluaXNoU2F2ZShzZXJ2ZXJBdHRycyk7XG4gICAgICAgICAgaWYgKG9wdGlvbnMud2FpdCkge1xuICAgICAgICAgICAgbW9kZWwuc2V0KGN1cnJlbnQsIHNldE9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbW9kZWw7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICBtb2RlbC5fY2FuY2VsU2F2ZSgpO1xuICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcblxuICAgICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCBtb2RlbCk7XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLl9hbGxQcmV2aW91c1NhdmVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoaXMgbW9kZWwgb24gdGhlIHNlcnZlciBpZiBpdCB3YXMgYWxyZWFkeSBwZXJzaXN0ZWQuXG4gICAgICogT3B0aW1pc3RpY2FsbHkgcmVtb3ZlcyB0aGUgbW9kZWwgZnJvbSBpdHMgY29sbGVjdGlvbiwgaWYgaXQgaGFzIG9uZS5cbiAgICAgKiBJZiBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCB3YWl0cyBmb3IgdGhlIHNlcnZlciB0byByZXNwb25kXG4gICAgICogYmVmb3JlIHJlbW92YWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+d2FpdDogU2V0IHRvIHRydWUgdG8gd2FpdCBmb3IgdGhlIHNlcnZlciB0byBjb25maXJtIHN1Y2Nlc3NmdWxcbiAgICAgKiAgIGRlbGV0aW9uIG9mIHRoZSBvYmplY3QgYmVmb3JlIHRyaWdnZXJpbmcgdGhlIGBkZXN0cm95YCBldmVudC5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgICAqICAgICBiZSB1c2VkIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgZGVzdHJveVxuICAgICAqICAgICBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgbW9kZWwgPSB0aGlzO1xuXG4gICAgICB2YXIgdHJpZ2dlckRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbW9kZWwudHJpZ2dlcignZGVzdHJveScsIG1vZGVsLCBtb2RlbC5jb2xsZWN0aW9uLCBvcHRpb25zKTtcbiAgICAgIH07XG5cbiAgICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlckRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvcHRpb25zLndhaXQpIHtcbiAgICAgICAgdHJpZ2dlckRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcImNsYXNzZXNcIixcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLmNsYXNzTmFtZSxcbiAgICAgICAgb2JqZWN0SWQ6IHRoaXMuaWQsXG4gICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMud2FpdCkge1xuICAgICAgICAgIHRyaWdnZXJEZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgcmVzcG9uc2UgaW50byB0aGUgaGFzaCBvZiBhdHRyaWJ1dGVzIHRvIGJlIHNldCBvbiB0aGUgbW9kZWwuXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuICAgICAgdmFyIG91dHB1dCA9IF8uY2xvbmUocmVzcCk7XG4gICAgICBfKFtcImNyZWF0ZWRBdFwiLCBcInVwZGF0ZWRBdFwiXSkuZWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKG91dHB1dFtrZXldKSB7XG4gICAgICAgICAgb3V0cHV0W2tleV0gPSBQYXJzZS5fcGFyc2VEYXRlKG91dHB1dFtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoIW91dHB1dC51cGRhdGVkQXQpIHtcbiAgICAgICAgb3V0cHV0LnVwZGF0ZWRBdCA9IG91dHB1dC5jcmVhdGVkQXQ7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuX2V4aXN0ZWQgPSAoc3RhdHVzICE9PSAyMDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBtb2RlbCB3aXRoIGlkZW50aWNhbCBhdHRyaWJ1dGVzIHRvIHRoaXMgb25lLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLk9iamVjdH1cbiAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb2JqZWN0IGhhcyBuZXZlciBiZWVuIHNhdmVkIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNOZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICF0aGlzLmlkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsIHRoaXMgbWV0aG9kIHRvIG1hbnVhbGx5IGZpcmUgYSBgXCJjaGFuZ2VcImAgZXZlbnQgZm9yIHRoaXMgbW9kZWwgYW5kXG4gICAgICogYSBgXCJjaGFuZ2U6YXR0cmlidXRlXCJgIGV2ZW50IGZvciBlYWNoIGNoYW5nZWQgYXR0cmlidXRlLlxuICAgICAqIENhbGxpbmcgdGhpcyB3aWxsIGNhdXNlIGFsbCBvYmplY3RzIG9ic2VydmluZyB0aGUgbW9kZWwgdG8gdXBkYXRlLlxuICAgICAqL1xuICAgIGNoYW5nZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgY2hhbmdpbmcgPSB0aGlzLl9jaGFuZ2luZztcbiAgICAgIHRoaXMuX2NoYW5naW5nID0gdHJ1ZTtcblxuICAgICAgLy8gU2lsZW50IGNoYW5nZXMgYmVjb21lIHBlbmRpbmcgY2hhbmdlcy5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuX3NpbGVudCwgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICBzZWxmLl9wZW5kaW5nW2F0dHJdID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaWxlbnQgY2hhbmdlcyBhcmUgdHJpZ2dlcmVkLlxuICAgICAgdmFyIGNoYW5nZXMgPSBfLmV4dGVuZCh7fSwgb3B0aW9ucy5jaGFuZ2VzLCB0aGlzLl9zaWxlbnQpO1xuICAgICAgdGhpcy5fc2lsZW50ID0ge307XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChjaGFuZ2VzLCBmdW5jdGlvbih1bnVzZWRfdmFsdWUsIGF0dHIpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2U6JyArIGF0dHIsIHNlbGYsIHNlbGYuZ2V0KGF0dHIpLCBvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGNoYW5naW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGlzIHRvIGdldCBhcm91bmQgbGludCBub3QgbGV0dGluZyB1cyBtYWtlIGEgZnVuY3Rpb24gaW4gYSBsb29wLlxuICAgICAgdmFyIGRlbGV0ZUNoYW5nZWQgPSBmdW5jdGlvbih2YWx1ZSwgYXR0cikge1xuICAgICAgICBpZiAoIXNlbGYuX3BlbmRpbmdbYXR0cl0gJiYgIXNlbGYuX3NpbGVudFthdHRyXSkge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLmNoYW5nZWRbYXR0cl07XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIENvbnRpbnVlIGZpcmluZyBgXCJjaGFuZ2VcImAgZXZlbnRzIHdoaWxlIHRoZXJlIGFyZSBwZW5kaW5nIGNoYW5nZXMuXG4gICAgICB3aGlsZSAoIV8uaXNFbXB0eSh0aGlzLl9wZW5kaW5nKSkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nID0ge307XG4gICAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJywgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIC8vIFBlbmRpbmcgYW5kIHNpbGVudCBjaGFuZ2VzIHN0aWxsIHJlbWFpbi5cbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5jaGFuZ2VkLCBkZWxldGVDaGFuZ2VkKTtcbiAgICAgICAgc2VsZi5fcHJldmlvdXNBdHRyaWJ1dGVzID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG9iamVjdCB3YXMgY3JlYXRlZCBieSB0aGUgUGFyc2Ugc2VydmVyIHdoZW4gdGhlXG4gICAgICogb2JqZWN0IG1pZ2h0IGhhdmUgYWxyZWFkeSBiZWVuIHRoZXJlIChlLmcuIGluIHRoZSBjYXNlIG9mIGEgRmFjZWJvb2tcbiAgICAgKiBsb2dpbilcbiAgICAgKi9cbiAgICBleGlzdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9leGlzdGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmUgaWYgdGhlIG1vZGVsIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+XG4gICAgICogZXZlbnQuICBJZiB5b3Ugc3BlY2lmeSBhbiBhdHRyaWJ1dGUgbmFtZSwgZGV0ZXJtaW5lIGlmIHRoYXQgYXR0cmlidXRlXG4gICAgICogaGFzIGNoYW5nZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgT3B0aW9uYWwgYXR0cmlidXRlIG5hbWVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGhhc0NoYW5nZWQ6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gIV8uaXNFbXB0eSh0aGlzLmNoYW5nZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlZCAmJiBfLmhhcyh0aGlzLmNoYW5nZWQsIGF0dHIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgYXR0cmlidXRlcyB0aGF0IGhhdmUgY2hhbmdlZCwgb3JcbiAgICAgKiBmYWxzZSBpZiB0aGVyZSBhcmUgbm8gY2hhbmdlZCBhdHRyaWJ1dGVzLiBVc2VmdWwgZm9yIGRldGVybWluaW5nIHdoYXRcbiAgICAgKiBwYXJ0cyBvZiBhIHZpZXcgbmVlZCB0byBiZSB1cGRhdGVkIGFuZC9vciB3aGF0IGF0dHJpYnV0ZXMgbmVlZCB0byBiZVxuICAgICAqIHBlcnNpc3RlZCB0byB0aGUgc2VydmVyLiBVbnNldCBhdHRyaWJ1dGVzIHdpbGwgYmUgc2V0IHRvIHVuZGVmaW5lZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhbiBhdHRyaWJ1dGVzIG9iamVjdCB0byBkaWZmIGFnYWluc3QgdGhlIG1vZGVsLFxuICAgICAqIGRldGVybWluaW5nIGlmIHRoZXJlICp3b3VsZCBiZSogYSBjaGFuZ2UuXG4gICAgICovXG4gICAgY2hhbmdlZEF0dHJpYnV0ZXM6IGZ1bmN0aW9uKGRpZmYpIHtcbiAgICAgIGlmICghZGlmZikge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNDaGFuZ2VkKCkgPyBfLmNsb25lKHRoaXMuY2hhbmdlZCkgOiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBjaGFuZ2VkID0ge307XG4gICAgICB2YXIgb2xkID0gdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goZGlmZiwgZnVuY3Rpb24oZGlmZlZhbCwgYXR0cikge1xuICAgICAgICBpZiAoIV8uaXNFcXVhbChvbGRbYXR0cl0sIGRpZmZWYWwpKSB7XG4gICAgICAgICAgY2hhbmdlZFthdHRyXSA9IGRpZmZWYWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNoYW5nZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHByZXZpb3VzIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZSwgcmVjb3JkZWQgYXQgdGhlIHRpbWUgdGhlIGxhc3RcbiAgICAgKiA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiBldmVudCB3YXMgZmlyZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlIHRvIGdldC5cbiAgICAgKi9cbiAgICBwcmV2aW91czogZnVuY3Rpb24oYXR0cikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoIHx8ICF0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCBvZiB0aGUgYXR0cmlidXRlcyBvZiB0aGUgbW9kZWwgYXQgdGhlIHRpbWUgb2YgdGhlIHByZXZpb3VzXG4gICAgICogPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gZXZlbnQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByZXZpb3VzQXR0cmlidXRlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy5jbG9uZSh0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIG1vZGVsIGlzIGN1cnJlbnRseSBpbiBhIHZhbGlkIHN0YXRlLiBJdCdzIG9ubHkgcG9zc2libGUgdG9cbiAgICAgKiBnZXQgaW50byBhbiAqaW52YWxpZCogc3RhdGUgaWYgeW91J3JlIHVzaW5nIHNpbGVudCBjaGFuZ2VzLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNWYWxpZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXRoaXMudmFsaWRhdGUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogWW91IHNob3VsZCBub3QgY2FsbCB0aGlzIGZ1bmN0aW9uIGRpcmVjdGx5IHVubGVzcyB5b3Ugc3ViY2xhc3NcbiAgICAgKiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LCBpbiB3aGljaCBjYXNlIHlvdSBjYW4gb3ZlcnJpZGUgdGhpcyBtZXRob2RcbiAgICAgKiB0byBwcm92aWRlIGFkZGl0aW9uYWwgdmFsaWRhdGlvbiBvbiA8Y29kZT5zZXQ8L2NvZGU+IGFuZFxuICAgICAqIDxjb2RlPnNhdmU8L2NvZGU+LiAgWW91ciBpbXBsZW1lbnRhdGlvbiBzaG91bGQgcmV0dXJuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cnMgVGhlIGN1cnJlbnQgZGF0YSB0byB2YWxpZGF0ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLWxpa2Ugb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7fSBGYWxzZSBpZiB0aGUgZGF0YSBpcyB2YWxpZC4gIEFuIGVycm9yIG9iamVjdCBvdGhlcndpc2UuXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3Qjc2V0XG4gICAgICovXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgICBpZiAoXy5oYXMoYXR0cnMsIFwiQUNMXCIpICYmICEoYXR0cnMuQUNMIGluc3RhbmNlb2YgUGFyc2UuQUNMKSkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQUNMIG11c3QgYmUgYSBQYXJzZS5BQ0wuXCIpO1xuICAgICAgfVxuICAgICAgdmFyIGNvcnJlY3QgPSB0cnVlO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goYXR0cnMsIGZ1bmN0aW9uKHVudXNlZF92YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICghKC9eW0EtWmEtel1bMC05QS1aYS16X10qJC8pLnRlc3Qoa2V5KSkge1xuICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoIWNvcnJlY3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5JTlZBTElEX0tFWV9OQU1FKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVuIHZhbGlkYXRpb24gYWdhaW5zdCBhIHNldCBvZiBpbmNvbWluZyBhdHRyaWJ1dGVzLCByZXR1cm5pbmcgYHRydWVgXG4gICAgICogaWYgYWxsIGlzIHdlbGwuIElmIGEgc3BlY2lmaWMgYGVycm9yYCBjYWxsYmFjayBoYXMgYmVlbiBwYXNzZWQsXG4gICAgICogY2FsbCB0aGF0IGluc3RlYWQgb2YgZmlyaW5nIHRoZSBnZW5lcmFsIGBcImVycm9yXCJgIGV2ZW50LlxuICAgICAqL1xuICAgIF92YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnNpbGVudCB8fCAhdGhpcy52YWxpZGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGF0dHJzID0gXy5leHRlbmQoe30sIHRoaXMuYXR0cmlidXRlcywgYXR0cnMpO1xuICAgICAgdmFyIGVycm9yID0gdGhpcy52YWxpZGF0ZShhdHRycywgb3B0aW9ucyk7XG4gICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lcnJvcikge1xuICAgICAgICBvcHRpb25zLmVycm9yKHRoaXMsIGVycm9yLCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcignZXJyb3InLCB0aGlzLCBlcnJvciwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIEFDTCBmb3IgdGhpcyBvYmplY3QuXG4gICAgICogQHJldHVybnMge1BhcnNlLkFDTH0gQW4gaW5zdGFuY2Ugb2YgUGFyc2UuQUNMLlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I2dldFxuICAgICAqL1xuICAgIGdldEFDTDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoXCJBQ0xcIik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIEFDTCB0byBiZSB1c2VkIGZvciB0aGlzIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkFDTH0gYWNsIEFuIGluc3RhbmNlIG9mIFBhcnNlLkFDTC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25hbCBCYWNrYm9uZS1saWtlIG9wdGlvbnMgb2JqZWN0IHRvIGJlXG4gICAgICogICAgIHBhc3NlZCBpbiB0byBzZXQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgc2V0IHBhc3NlZCB2YWxpZGF0aW9uLlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I3NldFxuICAgICAqL1xuICAgIHNldEFDTDogZnVuY3Rpb24oYWNsLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoXCJBQ0xcIiwgYWNsLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFwcHJvcHJpYXRlIHN1YmNsYXNzIGZvciBtYWtpbmcgbmV3IGluc3RhbmNlcyBvZiB0aGUgZ2l2ZW5cbiAgICogY2xhc3NOYW1lIHN0cmluZy5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICBpZiAoIV8uaXNTdHJpbmcoY2xhc3NOYW1lKSkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzIHJlcXVpcmVzIGEgc3RyaW5nIGFyZ3VtZW50LlwiO1xuICAgIH1cbiAgICB2YXIgT2JqZWN0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2NsYXNzTWFwW2NsYXNzTmFtZV07XG4gICAgaWYgKCFPYmplY3RDbGFzcykge1xuICAgICAgT2JqZWN0Q2xhc3MgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKGNsYXNzTmFtZSk7XG4gICAgICBQYXJzZS5PYmplY3QuX2NsYXNzTWFwW2NsYXNzTmFtZV0gPSBPYmplY3RDbGFzcztcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdENsYXNzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0IGZvciB0aGUgZ2l2ZW4gY2xhc3NuYW1lLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll9jcmVhdGUgPSBmdW5jdGlvbihjbGFzc05hbWUsIGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgT2JqZWN0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzKGNsYXNzTmFtZSk7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RDbGFzcyhhdHRyaWJ1dGVzLCBvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2Ygb2JqZWN0IGlkcyBnaXZlbiBhIGxpc3Qgb2Ygb2JqZWN0cy5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5fdG9PYmplY3RJZEFycmF5ID0gZnVuY3Rpb24obGlzdCwgb21pdE9iamVjdHNXaXRoRGF0YSkge1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMobGlzdCk7XG4gICAgfVxuXG4gICAgdmFyIGVycm9yO1xuICAgIHZhciBjbGFzc05hbWUgPSBsaXN0WzBdLmNsYXNzTmFtZTtcbiAgICB2YXIgb2JqZWN0SWRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gbGlzdFtpXTtcbiAgICAgIGlmIChjbGFzc05hbWUgIT09IG9iamVjdC5jbGFzc05hbWUpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuSU5WQUxJRF9DTEFTU19OQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFsbCBvYmplY3RzIHNob3VsZCBiZSBvZiB0aGUgc2FtZSBjbGFzc1wiKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfSBlbHNlIGlmICghb2JqZWN0LmlkKSB7XG4gICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk1JU1NJTkdfT0JKRUNUX0lELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFsbCBvYmplY3RzIG11c3QgaGF2ZSBhbiBJRFwiKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfSBlbHNlIGlmIChvbWl0T2JqZWN0c1dpdGhEYXRhICYmIG9iamVjdC5faGFzRGF0YSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdElkcy5wdXNoKG9iamVjdC5pZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMob2JqZWN0SWRzKTtcbiAgfTtcblxuICAvKipcbiAgICogVXBkYXRlcyBhIGxpc3Qgb2Ygb2JqZWN0cyB3aXRoIGZldGNoZWQgcmVzdWx0cy5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5fdXBkYXRlV2l0aEZldGNoZWRSZXN1bHRzID0gZnVuY3Rpb24obGlzdCwgZmV0Y2hlZCwgZm9yY2VGZXRjaCkge1xuICAgIHZhciBmZXRjaGVkT2JqZWN0c0J5SWQgPSB7fTtcbiAgICBQYXJzZS5fYXJyYXlFYWNoKGZldGNoZWQsIGZ1bmN0aW9uKG9iamVjdCwgaSkge1xuICAgICAgZmV0Y2hlZE9iamVjdHNCeUlkW29iamVjdC5pZF0gPSBvYmplY3Q7XG4gICAgfSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmplY3QgPSBsaXN0W2ldO1xuICAgICAgdmFyIGZldGNoZWRPYmplY3QgPSBmZXRjaGVkT2JqZWN0c0J5SWRbb2JqZWN0LmlkXTtcbiAgICAgIGlmICghZmV0Y2hlZE9iamVjdCAmJiBmb3JjZUZldGNoKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFsbCBvYmplY3RzIG11c3QgZXhpc3Qgb24gdGhlIHNlcnZlclwiKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBvYmplY3QuX21lcmdlRnJvbU9iamVjdChmZXRjaGVkT2JqZWN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhsaXN0KTtcbiAgfTtcblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgb2JqZWN0cyBnaXZlbiBpbiBsaXN0LiAgVGhlIGZvcmNlRmV0Y2ggb3B0aW9uIHdpbGwgZmV0Y2ggYWxsXG4gICAqIG9iamVjdHMgaWYgdHJ1ZSBhbmQgaWdub3JlIG9iamVjdHMgd2l0aCBkYXRhIGlmIGZhbHNlLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll9mZXRjaEFsbCA9IGZ1bmN0aW9uKGxpc3QsIGZvcmNlRmV0Y2gpIHtcbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKGxpc3QpO1xuICAgIH1cblxuICAgIHZhciBvbWl0T2JqZWN0c1dpdGhEYXRhID0gIWZvcmNlRmV0Y2g7XG4gICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fdG9PYmplY3RJZEFycmF5KFxuICAgICAgbGlzdCxcbiAgICAgIG9taXRPYmplY3RzV2l0aERhdGFcbiAgICApLnRoZW4oZnVuY3Rpb24ob2JqZWN0SWRzKSB7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gbGlzdFswXS5jbGFzc05hbWU7XG4gICAgICB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoY2xhc3NOYW1lKTtcbiAgICAgIHF1ZXJ5LmNvbnRhaW5lZEluKFwib2JqZWN0SWRcIiwgb2JqZWN0SWRzKTtcbiAgICAgIHF1ZXJ5LmxpbWl0ID0gb2JqZWN0SWRzLmxlbmd0aDtcbiAgICAgIHJldHVybiBxdWVyeS5maW5kKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll91cGRhdGVXaXRoRmV0Y2hlZFJlc3VsdHMoXG4gICAgICAgIGxpc3QsXG4gICAgICAgIHJlc3VsdHMsXG4gICAgICAgIGZvcmNlRmV0Y2hcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gU2V0IHVwIGEgbWFwIG9mIGNsYXNzTmFtZSB0byBjbGFzcyBzbyB0aGF0IHdlIGNhbiBjcmVhdGUgbmV3IGluc3RhbmNlcyBvZlxuICAvLyBQYXJzZSBPYmplY3RzIGZyb20gSlNPTiBhdXRvbWF0aWNhbGx5LlxuICBQYXJzZS5PYmplY3QuX2NsYXNzTWFwID0ge307XG5cbiAgUGFyc2UuT2JqZWN0Ll9leHRlbmQgPSBQYXJzZS5fZXh0ZW5kO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHN1YmNsYXNzIG9mIFBhcnNlLk9iamVjdCBmb3IgdGhlIGdpdmVuIFBhcnNlIGNsYXNzIG5hbWUuXG4gICAqXG4gICAqIDxwPkV2ZXJ5IGV4dGVuc2lvbiBvZiBhIFBhcnNlIGNsYXNzIHdpbGwgaW5oZXJpdCBmcm9tIHRoZSBtb3N0IHJlY2VudFxuICAgKiBwcmV2aW91cyBleHRlbnNpb24gb2YgdGhhdCBjbGFzcy4gV2hlbiBhIFBhcnNlLk9iamVjdCBpcyBhdXRvbWF0aWNhbGx5XG4gICAqIGNyZWF0ZWQgYnkgcGFyc2luZyBKU09OLCBpdCB3aWxsIHVzZSB0aGUgbW9zdCByZWNlbnQgZXh0ZW5zaW9uIG9mIHRoYXRcbiAgICogY2xhc3MuPC9wPlxuICAgKlxuICAgKiA8cD5Zb3Ugc2hvdWxkIGNhbGwgZWl0aGVyOjxwcmU+XG4gICAqICAgICB2YXIgTXlDbGFzcyA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJNeUNsYXNzXCIsIHtcbiAgICogICAgICAgICA8aT5JbnN0YW5jZSBtZXRob2RzPC9pPixcbiAgICogICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgKiAgICAgICAgICAgICB0aGlzLnNvbWVJbnN0YW5jZVByb3BlcnR5ID0gW10sXG4gICAqICAgICAgICAgICAgIDxpPk90aGVyIGluc3RhbmNlIHByb3BlcnRpZXM8L2k+XG4gICAqICAgICAgICAgfVxuICAgKiAgICAgfSwge1xuICAgKiAgICAgICAgIDxpPkNsYXNzIHByb3BlcnRpZXM8L2k+XG4gICAqICAgICB9KTs8L3ByZT5cbiAgICogb3IsIGZvciBCYWNrYm9uZSBjb21wYXRpYmlsaXR5OjxwcmU+XG4gICAqICAgICB2YXIgTXlDbGFzcyA9IFBhcnNlLk9iamVjdC5leHRlbmQoe1xuICAgKiAgICAgICAgIGNsYXNzTmFtZTogXCJNeUNsYXNzXCIsXG4gICAqICAgICAgICAgPGk+SW5zdGFuY2UgbWV0aG9kczwvaT4sXG4gICAqICAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICogICAgICAgICAgICAgdGhpcy5zb21lSW5zdGFuY2VQcm9wZXJ0eSA9IFtdLFxuICAgKiAgICAgICAgICAgICA8aT5PdGhlciBpbnN0YW5jZSBwcm9wZXJ0aWVzPC9pPlxuICAgKiAgICAgICAgIH1cbiAgICogICAgIH0sIHtcbiAgICogICAgICAgICA8aT5DbGFzcyBwcm9wZXJ0aWVzPC9pPlxuICAgKiAgICAgfSk7PC9wcmU+PC9wPlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIFRoZSBuYW1lIG9mIHRoZSBQYXJzZSBjbGFzcyBiYWNraW5nIHRoaXMgbW9kZWwuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b1Byb3BzIEluc3RhbmNlIHByb3BlcnRpZXMgdG8gYWRkIHRvIGluc3RhbmNlcyBvZiB0aGVcbiAgICogICAgIGNsYXNzIHJldHVybmVkIGZyb20gdGhpcyBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc1Byb3BzIENsYXNzIHByb3BlcnRpZXMgdG8gYWRkIHRoZSBjbGFzcyByZXR1cm5lZCBmcm9tXG4gICAqICAgICB0aGlzIG1ldGhvZC5cbiAgICogQHJldHVybiB7Q2xhc3N9IEEgbmV3IHN1YmNsYXNzIG9mIFBhcnNlLk9iamVjdC5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5leHRlbmQgPSBmdW5jdGlvbihjbGFzc05hbWUsIHByb3RvUHJvcHMsIGNsYXNzUHJvcHMpIHtcbiAgICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2l0aCBvbmx5IHR3byBhcmdzLlxuICAgIGlmICghXy5pc1N0cmluZyhjbGFzc05hbWUpKSB7XG4gICAgICBpZiAoY2xhc3NOYW1lICYmIF8uaGFzKGNsYXNzTmFtZSwgXCJjbGFzc05hbWVcIikpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5leHRlbmQoY2xhc3NOYW1lLmNsYXNzTmFtZSwgY2xhc3NOYW1lLCBwcm90b1Byb3BzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiUGFyc2UuT2JqZWN0LmV4dGVuZCdzIGZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSB0aGUgY2xhc3NOYW1lLlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBzb21lb25lIHRyaWVzIHRvIHN1YmNsYXNzIFwiVXNlclwiLCBjb2VyY2UgaXQgdG8gdGhlIHJpZ2h0IHR5cGUuXG4gICAgaWYgKGNsYXNzTmFtZSA9PT0gXCJVc2VyXCIgJiYgUGFyc2UuVXNlci5fcGVyZm9ybVVzZXJSZXdyaXRlKSB7XG4gICAgICBjbGFzc05hbWUgPSBcIl9Vc2VyXCI7XG4gICAgfVxuICAgIHByb3RvUHJvcHMgPSBwcm90b1Byb3BzIHx8IHt9O1xuICAgIHByb3RvUHJvcHMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXG4gICAgdmFyIE5ld0NsYXNzT2JqZWN0ID0gbnVsbDtcbiAgICBpZiAoXy5oYXMoUGFyc2UuT2JqZWN0Ll9jbGFzc01hcCwgY2xhc3NOYW1lKSkge1xuICAgICAgdmFyIE9sZENsYXNzT2JqZWN0ID0gUGFyc2UuT2JqZWN0Ll9jbGFzc01hcFtjbGFzc05hbWVdO1xuICAgICAgLy8gVGhpcyBuZXcgc3ViY2xhc3MgaGFzIGJlZW4gdG9sZCB0byBleHRlbmQgYm90aCBmcm9tIFwidGhpc1wiIGFuZCBmcm9tXG4gICAgICAvLyBPbGRDbGFzc09iamVjdC4gVGhpcyBpcyBtdWx0aXBsZSBpbmhlcml0YW5jZSwgd2hpY2ggaXNuJ3Qgc3VwcG9ydGVkLlxuICAgICAgLy8gRm9yIG5vdywgbGV0J3MganVzdCBwaWNrIG9uZS5cbiAgICAgIE5ld0NsYXNzT2JqZWN0ID0gT2xkQ2xhc3NPYmplY3QuX2V4dGVuZChwcm90b1Byb3BzLCBjbGFzc1Byb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTmV3Q2xhc3NPYmplY3QgPSB0aGlzLl9leHRlbmQocHJvdG9Qcm9wcywgY2xhc3NQcm9wcyk7XG4gICAgfVxuICAgIC8vIEV4dGVuZGluZyBhIHN1YmNsYXNzIHNob3VsZCByZXVzZSB0aGUgY2xhc3NuYW1lIGF1dG9tYXRpY2FsbHkuXG4gICAgTmV3Q2xhc3NPYmplY3QuZXh0ZW5kID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgaWYgKF8uaXNTdHJpbmcoYXJnMCkgfHwgKGFyZzAgJiYgXy5oYXMoYXJnMCwgXCJjbGFzc05hbWVcIikpKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuZXh0ZW5kLmFwcGx5KE5ld0NsYXNzT2JqZWN0LCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgdmFyIG5ld0FyZ3VtZW50cyA9IFtjbGFzc05hbWVdLmNvbmNhdChQYXJzZS5fLnRvQXJyYXkoYXJndW1lbnRzKSk7XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LmV4dGVuZC5hcHBseShOZXdDbGFzc09iamVjdCwgbmV3QXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHJlZmVyZW5jZSB0byBhIHN1YmNsYXNzIG9mIFBhcnNlLk9iamVjdCB3aXRoIHRoZSBnaXZlbiBpZC4gVGhpc1xuICAgICAqIGRvZXMgbm90IGV4aXN0IG9uIFBhcnNlLk9iamVjdCwgb25seSBvbiBzdWJjbGFzc2VzLlxuICAgICAqXG4gICAgICogPHA+QSBzaG9ydGN1dCBmb3I6IDxwcmU+XG4gICAgICogIHZhciBGb28gPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiRm9vXCIpO1xuICAgICAqICB2YXIgcG9pbnRlclRvRm9vID0gbmV3IEZvbygpO1xuICAgICAqICBwb2ludGVyVG9Gb28uaWQgPSBcIm15T2JqZWN0SWRcIjtcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBuYW1lIGNyZWF0ZVdpdGhvdXREYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgb2JqZWN0IHRvIGNyZWF0ZSBhIHJlZmVyZW5jZSB0by5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5PYmplY3R9IEEgUGFyc2UuT2JqZWN0IHJlZmVyZW5jZS5cbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAbWVtYmVyT2YgUGFyc2UuT2JqZWN0XG4gICAgICovXG4gICAgTmV3Q2xhc3NPYmplY3QuY3JlYXRlV2l0aG91dERhdGEgPSBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIG9iaiA9IG5ldyBOZXdDbGFzc09iamVjdCgpO1xuICAgICAgb2JqLmlkID0gaWQ7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICBQYXJzZS5PYmplY3QuX2NsYXNzTWFwW2NsYXNzTmFtZV0gPSBOZXdDbGFzc09iamVjdDtcbiAgICByZXR1cm4gTmV3Q2xhc3NPYmplY3Q7XG4gIH07XG5cbiAgUGFyc2UuT2JqZWN0Ll9maW5kVW5zYXZlZENoaWxkcmVuID0gZnVuY3Rpb24ob2JqZWN0LCBjaGlsZHJlbiwgZmlsZXMpIHtcbiAgICBQYXJzZS5fdHJhdmVyc2Uob2JqZWN0LCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgICAgb2JqZWN0Ll9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgICAgaWYgKG9iamVjdC5kaXJ0eSgpKSB7XG4gICAgICAgICAgY2hpbGRyZW4ucHVzaChvYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLkZpbGUpIHtcbiAgICAgICAgaWYgKCFvYmplY3QudXJsKCkpIHtcbiAgICAgICAgICBmaWxlcy5wdXNoKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFBhcnNlLk9iamVjdC5fY2FuQmVTZXJpYWxpemVkQXNWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIC8vIFRPRE8oa2xpbXQpOiBXZSBzaG91bGQgcmV3cml0ZSBfdHJhdmVyc2Ugc28gdGhhdCBpdCBjYW4gYmUgdXNlZCBoZXJlLlxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgIHJldHVybiAhIW9iamVjdC5pZDtcbiAgICB9XG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLkZpbGUpIHtcbiAgICAgIC8vIERvbid0IHJlY3Vyc2UgaW5kZWZpbml0ZWx5IGludG8gZmlsZXMuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgY2FuQmVTZXJpYWxpemVkQXNWYWx1ZSA9IHRydWU7XG5cbiAgICBpZiAoXy5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2gob2JqZWN0LCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBpZiAoIVBhcnNlLk9iamVjdC5fY2FuQmVTZXJpYWxpemVkQXNWYWx1ZShjaGlsZCkpIHtcbiAgICAgICAgICBjYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChvYmplY3QsIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGlmICghUGFyc2UuT2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlKGNoaWxkKSkge1xuICAgICAgICAgIGNhbkJlU2VyaWFsaXplZEFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSByb290IG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnM6IFRoZSBvbmx5IHZhbGlkIG9wdGlvbiBpcyB1c2VNYXN0ZXJLZXkuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX2RlZXBTYXZlQXN5bmMgPSBmdW5jdGlvbihvYmplY3QsIG9wdGlvbnMpIHtcbiAgICB2YXIgdW5zYXZlZENoaWxkcmVuID0gW107XG4gICAgdmFyIHVuc2F2ZWRGaWxlcyA9IFtdO1xuICAgIFBhcnNlLk9iamVjdC5fZmluZFVuc2F2ZWRDaGlsZHJlbihvYmplY3QsIHVuc2F2ZWRDaGlsZHJlbiwgdW5zYXZlZEZpbGVzKTtcblxuICAgIHZhciBwcm9taXNlID0gUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgIF8uZWFjaCh1bnNhdmVkRmlsZXMsIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmaWxlLnNhdmUob3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBvYmplY3RzID0gXy51bmlxKHVuc2F2ZWRDaGlsZHJlbik7XG4gICAgdmFyIHJlbWFpbmluZyA9IF8udW5pcShvYmplY3RzKTtcblxuICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5fY29udGludWVXaGlsZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJlbWFpbmluZy5sZW5ndGggPiAwO1xuICAgICAgfSwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gR2F0aGVyIHVwIGFsbCB0aGUgb2JqZWN0cyB0aGF0IGNhbiBiZSBzYXZlZCBpbiB0aGlzIGJhdGNoLlxuICAgICAgICB2YXIgYmF0Y2ggPSBbXTtcbiAgICAgICAgdmFyIG5ld1JlbWFpbmluZyA9IFtdO1xuICAgICAgICBQYXJzZS5fYXJyYXlFYWNoKHJlbWFpbmluZywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgLy8gTGltaXQgYmF0Y2hlcyB0byAyMCBvYmplY3RzLlxuICAgICAgICAgIGlmIChiYXRjaC5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgbmV3UmVtYWluaW5nLnB1c2gob2JqZWN0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAob2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWQoKSkge1xuICAgICAgICAgICAgYmF0Y2gucHVzaChvYmplY3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdSZW1haW5pbmcucHVzaChvYmplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJlbWFpbmluZyA9IG5ld1JlbWFpbmluZztcblxuICAgICAgICAvLyBJZiB3ZSBjYW4ndCBzYXZlIGFueSBvYmplY3RzLCB0aGVyZSBtdXN0IGJlIGEgY2lyY3VsYXIgcmVmZXJlbmNlLlxuICAgICAgICBpZiAoYmF0Y2gubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoXG4gICAgICAgICAgICBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUcmllZCB0byBzYXZlIGEgYmF0Y2ggd2l0aCBhIGN5Y2xlLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNlcnZlIGEgc3BvdCBpbiBldmVyeSBvYmplY3QncyBzYXZlIHF1ZXVlLlxuICAgICAgICB2YXIgcmVhZHlUb1N0YXJ0ID0gUGFyc2UuUHJvbWlzZS53aGVuKF8ubWFwKGJhdGNoLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0Ll9hbGxQcmV2aW91c1NhdmVzIHx8IFBhcnNlLlByb21pc2UuYXMoKTtcbiAgICAgICAgfSkpO1xuICAgICAgICB2YXIgYmF0Y2hGaW5pc2hlZCA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICAgIFBhcnNlLl9hcnJheUVhY2goYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIG9iamVjdC5fYWxsUHJldmlvdXNTYXZlcyA9IGJhdGNoRmluaXNoZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNhdmUgYSBzaW5nbGUgYmF0Y2gsIHdoZXRoZXIgcHJldmlvdXMgc2F2ZXMgc3VjY2VlZGVkIG9yIGZhaWxlZC5cbiAgICAgICAgcmV0dXJuIHJlYWR5VG9TdGFydC5fY29udGludWVXaXRoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgICAgICByb3V0ZTogXCJiYXRjaFwiLFxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHJlcXVlc3RzOiBfLm1hcChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGpzb24gPSBvYmplY3QuX2dldFNhdmVKU09OKCk7XG4gICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IFwiUE9TVFwiO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBcIi8xL2NsYXNzZXMvXCIgKyBvYmplY3QuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuaWQpIHtcbiAgICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoICsgXCIvXCIgKyBvYmplY3QuaWQ7XG4gICAgICAgICAgICAgICAgICBtZXRob2QgPSBcIlBVVFwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iamVjdC5fc3RhcnRTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgICAgYm9keToganNvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICAgIFBhcnNlLl9hcnJheUVhY2goYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCwgaSkge1xuICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbaV0uc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIG9iamVjdC5fZmluaXNoU2F2ZShcbiAgICAgICAgICAgICAgICAgIG9iamVjdC5wYXJzZShyZXNwb25zZVtpXS5zdWNjZXNzLCBzdGF0dXMsIHhocikpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZXJyb3IgfHwgcmVzcG9uc2VbaV0uZXJyb3I7XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9jYW5jZWxTYXZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKFxuICAgICAgICAgICAgICAgIG5ldyBQYXJzZS5FcnJvcihlcnJvci5jb2RlLCBlcnJvci5lcnJvcikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgICBiYXRjaEZpbmlzaGVkLnJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgYmF0Y2hGaW5pc2hlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0pO1xuICB9O1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIFJvbGUgb24gdGhlIFBhcnNlIHNlcnZlci4gUm9sZXMgcmVwcmVzZW50IGdyb3VwaW5ncyBvZlxuICAgKiBVc2VycyBmb3IgdGhlIHB1cnBvc2VzIG9mIGdyYW50aW5nIHBlcm1pc3Npb25zIChlLmcuIHNwZWNpZnlpbmcgYW4gQUNMXG4gICAqIGZvciBhbiBPYmplY3QpLiBSb2xlcyBhcmUgc3BlY2lmaWVkIGJ5IHRoZWlyIHNldHMgb2YgY2hpbGQgdXNlcnMgYW5kXG4gICAqIGNoaWxkIHJvbGVzLCBhbGwgb2Ygd2hpY2ggYXJlIGdyYW50ZWQgYW55IHBlcm1pc3Npb25zIHRoYXQgdGhlIHBhcmVudFxuICAgKiByb2xlIGhhcy5cbiAgICpcbiAgICogPHA+Um9sZXMgbXVzdCBoYXZlIGEgbmFtZSAod2hpY2ggY2Fubm90IGJlIGNoYW5nZWQgYWZ0ZXIgY3JlYXRpb24gb2YgdGhlXG4gICAqIHJvbGUpLCBhbmQgbXVzdCBzcGVjaWZ5IGFuIEFDTC48L3A+XG4gICAqIEBjbGFzc1xuICAgKiBBIFBhcnNlLlJvbGUgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBhIHJvbGUgcGVyc2lzdGVkIHRvIHRoZSBQYXJzZVxuICAgKiBjbG91ZC5cbiAgICovXG4gIFBhcnNlLlJvbGUgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiX1JvbGVcIiwgLyoqIEBsZW5kcyBQYXJzZS5Sb2xlLnByb3RvdHlwZSAqLyB7XG4gICAgLy8gSW5zdGFuY2UgTWV0aG9kc1xuICAgIFxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBuZXcgUGFyc2VSb2xlIHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIEFDTC5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgUm9sZSB0byBjcmVhdGUuXG4gICAgICogQHBhcmFtIHtQYXJzZS5BQ0x9IGFjbCBUaGUgQUNMIGZvciB0aGlzIHJvbGUuIFJvbGVzIG11c3QgaGF2ZSBhbiBBQ0wuXG4gICAgICovXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKG5hbWUsIGFjbCkge1xuICAgICAgaWYgKF8uaXNTdHJpbmcobmFtZSkgJiYgKGFjbCBpbnN0YW5jZW9mIFBhcnNlLkFDTCkpIHtcbiAgICAgICAgUGFyc2UuT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG51bGwsIG51bGwpO1xuICAgICAgICB0aGlzLnNldE5hbWUobmFtZSk7XG4gICAgICAgIHRoaXMuc2V0QUNMKGFjbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBQYXJzZS5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbmFtZSwgYWNsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIHJvbGUuICBZb3UgY2FuIGFsdGVybmF0aXZlbHkgY2FsbCByb2xlLmdldChcIm5hbWVcIilcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSByb2xlLlxuICAgICAqL1xuICAgIGdldE5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwibmFtZVwiKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG5hbWUgZm9yIGEgcm9sZS4gVGhpcyB2YWx1ZSBtdXN0IGJlIHNldCBiZWZvcmUgdGhlIHJvbGUgaGFzXG4gICAgICogYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyLCBhbmQgY2Fubm90IGJlIHNldCBvbmNlIHRoZSByb2xlIGhhcyBiZWVuXG4gICAgICogc2F2ZWQuXG4gICAgICogXG4gICAgICogPHA+XG4gICAgICogICBBIHJvbGUncyBuYW1lIGNhbiBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIGNoYXJhY3RlcnMsIF8sIC0sIGFuZFxuICAgICAqICAgc3BhY2VzLlxuICAgICAqIDwvcD5cbiAgICAgKlxuICAgICAqIDxwPlRoaXMgaXMgZXF1aXZhbGVudCB0byBjYWxsaW5nIHJvbGUuc2V0KFwibmFtZVwiLCBuYW1lKTwvcD5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcm9sZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBTdGFuZGFyZCBvcHRpb25zIG9iamVjdCB3aXRoIHN1Y2Nlc3MgYW5kIGVycm9yXG4gICAgICogICAgIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBzZXROYW1lOiBmdW5jdGlvbihuYW1lLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoXCJuYW1lXCIsIG5hbWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgUGFyc2UuUmVsYXRpb24gZm9yIHRoZSBQYXJzZS5Vc2VycyB0aGF0IGFyZSBkaXJlY3RcbiAgICAgKiBjaGlsZHJlbiBvZiB0aGlzIHJvbGUuIFRoZXNlIHVzZXJzIGFyZSBncmFudGVkIGFueSBwcml2aWxlZ2VzIHRoYXQgdGhpc1xuICAgICAqIHJvbGUgaGFzIGJlZW4gZ3JhbnRlZCAoZS5nLiByZWFkIG9yIHdyaXRlIGFjY2VzcyB0aHJvdWdoIEFDTHMpLiBZb3UgY2FuXG4gICAgICogYWRkIG9yIHJlbW92ZSB1c2VycyBmcm9tIHRoZSByb2xlIHRocm91Z2ggdGhpcyByZWxhdGlvbi5cbiAgICAgKiBcbiAgICAgKiA8cD5UaGlzIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyByb2xlLnJlbGF0aW9uKFwidXNlcnNcIik8L3A+XG4gICAgICogXG4gICAgICogQHJldHVybiB7UGFyc2UuUmVsYXRpb259IHRoZSByZWxhdGlvbiBmb3IgdGhlIHVzZXJzIGJlbG9uZ2luZyB0byB0aGlzXG4gICAgICogICAgIHJvbGUuXG4gICAgICovXG4gICAgZ2V0VXNlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb24oXCJ1c2Vyc1wiKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIFBhcnNlLlJlbGF0aW9uIGZvciB0aGUgUGFyc2UuUm9sZXMgdGhhdCBhcmUgZGlyZWN0XG4gICAgICogY2hpbGRyZW4gb2YgdGhpcyByb2xlLiBUaGVzZSByb2xlcycgdXNlcnMgYXJlIGdyYW50ZWQgYW55IHByaXZpbGVnZXMgdGhhdFxuICAgICAqIHRoaXMgcm9sZSBoYXMgYmVlbiBncmFudGVkIChlLmcuIHJlYWQgb3Igd3JpdGUgYWNjZXNzIHRocm91Z2ggQUNMcykuIFlvdVxuICAgICAqIGNhbiBhZGQgb3IgcmVtb3ZlIGNoaWxkIHJvbGVzIGZyb20gdGhpcyByb2xlIHRocm91Z2ggdGhpcyByZWxhdGlvbi5cbiAgICAgKiBcbiAgICAgKiA8cD5UaGlzIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyByb2xlLnJlbGF0aW9uKFwicm9sZXNcIik8L3A+XG4gICAgICogXG4gICAgICogQHJldHVybiB7UGFyc2UuUmVsYXRpb259IHRoZSByZWxhdGlvbiBmb3IgdGhlIHJvbGVzIGJlbG9uZ2luZyB0byB0aGlzXG4gICAgICogICAgIHJvbGUuXG4gICAgICovXG4gICAgZ2V0Um9sZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb24oXCJyb2xlc1wiKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChcIm5hbWVcIiBpbiBhdHRycyAmJiBhdHRycy5uYW1lICE9PSB0aGlzLmdldE5hbWUoKSkge1xuICAgICAgICB2YXIgbmV3TmFtZSA9IGF0dHJzLm5hbWU7XG4gICAgICAgIGlmICh0aGlzLmlkICYmIHRoaXMuaWQgIT09IGF0dHJzLm9iamVjdElkKSB7XG4gICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBvYmplY3RJZCBiZWluZyBzZXQgbWF0Y2hlcyB0aGlzLmlkLlxuICAgICAgICAgIC8vIFRoaXMgaGFwcGVucyBkdXJpbmcgYSBmZXRjaCAtLSB0aGUgaWQgaXMgc2V0IGJlZm9yZSBjYWxsaW5nIGZldGNoLlxuICAgICAgICAgIC8vIExldCB0aGUgbmFtZSBiZSBzZXQgaW4gdGhpcyBjYXNlLlxuICAgICAgICAgIHJldHVybiBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICAgIFwiQSByb2xlJ3MgbmFtZSBjYW4gb25seSBiZSBzZXQgYmVmb3JlIGl0IGhhcyBiZWVuIHNhdmVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaXNTdHJpbmcobmV3TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgICBcIkEgcm9sZSdzIG5hbWUgbXVzdCBiZSBhIFN0cmluZy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoL15bMC05YS16QS1aXFwtXyBdKyQvKS50ZXN0KG5ld05hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgICAgXCJBIHJvbGUncyBuYW1lIGNhbiBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIGNoYXJhY3RlcnMsIF8sXCIgK1xuICAgICAgICAgICAgICBcIiAtLCBhbmQgc3BhY2VzLlwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFBhcnNlLk9iamVjdC5wcm90b3R5cGUudmFsaWRhdGUpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5wcm90b3R5cGUudmFsaWRhdGUuY2FsbCh0aGlzLCBhdHRycywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbn0odGhpcykpO1xuXG5cbi8qZ2xvYmFsIF86IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIHdpdGggdGhlIGdpdmVuIG1vZGVscyBhbmQgb3B0aW9ucy4gIFR5cGljYWxseSwgeW91XG4gICAqIHdpbGwgbm90IGNhbGwgdGhpcyBtZXRob2QgZGlyZWN0bHksIGJ1dCB3aWxsIGluc3RlYWQgbWFrZSBhIHN1YmNsYXNzIHVzaW5nXG4gICAqIDxjb2RlPlBhcnNlLkNvbGxlY3Rpb24uZXh0ZW5kPC9jb2RlPi5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIEFuIGFycmF5IG9mIGluc3RhbmNlcyBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPm1vZGVsOiBUaGUgUGFyc2UuT2JqZWN0IHN1YmNsYXNzIHRoYXQgdGhpcyBjb2xsZWN0aW9uIGNvbnRhaW5zLlxuICAgKiAgIDxsaT5xdWVyeTogQW4gaW5zdGFuY2Ugb2YgUGFyc2UuUXVlcnkgdG8gdXNlIHdoZW4gZmV0Y2hpbmcgaXRlbXMuXG4gICAqICAgPGxpPmNvbXBhcmF0b3I6IEEgc3RyaW5nIHByb3BlcnR5IG5hbWUgb3IgZnVuY3Rpb24gdG8gc29ydCBieS5cbiAgICogPC91bD5cbiAgICpcbiAgICogQHNlZSBQYXJzZS5Db2xsZWN0aW9uLmV4dGVuZFxuICAgKlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+UHJvdmlkZXMgYSBzdGFuZGFyZCBjb2xsZWN0aW9uIGNsYXNzIGZvciBvdXIgc2V0cyBvZiBtb2RlbHMsIG9yZGVyZWRcbiAgICogb3IgdW5vcmRlcmVkLiAgRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGVcbiAgICogPGEgaHJlZj1cImh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vYmFja2JvbmUvI0NvbGxlY3Rpb25cIj5CYWNrYm9uZVxuICAgKiBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqL1xuICBQYXJzZS5Db2xsZWN0aW9uID0gZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKG9wdGlvbnMuY29tcGFyYXRvcikge1xuICAgICAgdGhpcy5jb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5tb2RlbCkge1xuICAgICAgdGhpcy5tb2RlbCA9IG9wdGlvbnMubW9kZWw7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gb3B0aW9ucy5xdWVyeTtcbiAgICB9XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAobW9kZWxzKSB7XG4gICAgICB0aGlzLnJlc2V0KG1vZGVscywge3NpbGVudDogdHJ1ZSwgcGFyc2U6IG9wdGlvbnMucGFyc2V9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gRGVmaW5lIHRoZSBDb2xsZWN0aW9uJ3MgaW5oZXJpdGFibGUgbWV0aG9kcy5cbiAgXy5leHRlbmQoUGFyc2UuQ29sbGVjdGlvbi5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgIC8qKiBAbGVuZHMgUGFyc2UuQ29sbGVjdGlvbi5wcm90b3R5cGUgKi8ge1xuXG4gICAgLy8gVGhlIGRlZmF1bHQgbW9kZWwgZm9yIGEgY29sbGVjdGlvbiBpcyBqdXN0IGEgUGFyc2UuT2JqZWN0LlxuICAgIC8vIFRoaXMgc2hvdWxkIGJlIG92ZXJyaWRkZW4gaW4gbW9zdCBjYXNlcy5cbiAgICAvLyBUT0RPOiB0aGluayBoYXJkZXIuIHRoaXMgaXMgbGlrZWx5IHRvIGJlIHdlaXJkLlxuICAgIG1vZGVsOiBQYXJzZS5PYmplY3QsXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAgKiBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiBhIENvbGxlY3Rpb24gaXMgYW4gYXJyYXkgb2YgdGhlXG4gICAgICogbW9kZWxzJyBhdHRyaWJ1dGVzLlxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24obW9kZWwpeyByZXR1cm4gbW9kZWwudG9KU09OKCk7IH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBtb2RlbCwgb3IgbGlzdCBvZiBtb2RlbHMgdG8gdGhlIHNldC4gUGFzcyAqKnNpbGVudCoqIHRvIGF2b2lkXG4gICAgICogZmlyaW5nIHRoZSBgYWRkYCBldmVudCBmb3IgZXZlcnkgbmV3IG1vZGVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIEFuIGFycmF5IG9mIGluc3RhbmNlcyBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+YXQ6IFRoZSBpbmRleCBhdCB3aGljaCB0byBhZGQgdGhlIG1vZGVscy5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyB0aGUgYGFkZGAgZXZlbnQgZm9yIGV2ZXJ5IG5ld1xuICAgICAqICAgbW9kZWwuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIGksIGluZGV4LCBsZW5ndGgsIG1vZGVsLCBjaWQsIGlkLCBjaWRzID0ge30sIGlkcyA9IHt9O1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBtb2RlbHMgPSBfLmlzQXJyYXkobW9kZWxzKSA/IG1vZGVscy5zbGljZSgpIDogW21vZGVsc107XG5cbiAgICAgIC8vIEJlZ2luIGJ5IHR1cm5pbmcgYmFyZSBvYmplY3RzIGludG8gbW9kZWwgcmVmZXJlbmNlcywgYW5kIHByZXZlbnRpbmdcbiAgICAgIC8vIGludmFsaWQgbW9kZWxzIG9yIGR1cGxpY2F0ZSBtb2RlbHMgZnJvbSBiZWluZyBhZGRlZC5cbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG1vZGVscy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBtb2RlbHNbaV0gPSB0aGlzLl9wcmVwYXJlTW9kZWwobW9kZWxzW2ldLCBvcHRpb25zKTtcbiAgICAgICAgbW9kZWwgPSBtb2RlbHNbaV07XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBhZGQgYW4gaW52YWxpZCBtb2RlbCB0byBhIGNvbGxlY3Rpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgY2lkID0gbW9kZWwuY2lkO1xuICAgICAgICBpZiAoY2lkc1tjaWRdIHx8IHRoaXMuX2J5Q2lkW2NpZF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEdXBsaWNhdGUgY2lkOiBjYW4ndCBhZGQgdGhlIHNhbWUgbW9kZWwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvIGEgY29sbGVjdGlvbiB0d2ljZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZCA9IG1vZGVsLmlkO1xuICAgICAgICBpZiAoIVBhcnNlLl9pc051bGxPclVuZGVmaW5lZChpZCkgJiYgKGlkc1tpZF0gfHwgdGhpcy5fYnlJZFtpZF0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGlkOiBjYW4ndCBhZGQgdGhlIHNhbWUgbW9kZWwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvIGEgY29sbGVjdGlvbiB0d2ljZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZHNbaWRdID0gbW9kZWw7XG4gICAgICAgIGNpZHNbY2lkXSA9IG1vZGVsO1xuICAgICAgfVxuXG4gICAgICAvLyBMaXN0ZW4gdG8gYWRkZWQgbW9kZWxzJyBldmVudHMsIGFuZCBpbmRleCBtb2RlbHMgZm9yIGxvb2t1cCBieVxuICAgICAgLy8gYGlkYCBhbmQgYnkgYGNpZGAuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgKG1vZGVsID0gbW9kZWxzW2ldKS5vbignYWxsJywgdGhpcy5fb25Nb2RlbEV2ZW50LCB0aGlzKTtcbiAgICAgICAgdGhpcy5fYnlDaWRbbW9kZWwuY2lkXSA9IG1vZGVsO1xuICAgICAgICBpZiAobW9kZWwuaWQpIHtcbiAgICAgICAgICB0aGlzLl9ieUlkW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEluc2VydCBtb2RlbHMgaW50byB0aGUgY29sbGVjdGlvbiwgcmUtc29ydGluZyBpZiBuZWVkZWQsIGFuZCB0cmlnZ2VyaW5nXG4gICAgICAvLyBgYWRkYCBldmVudHMgdW5sZXNzIHNpbGVuY2VkLlxuICAgICAgdGhpcy5sZW5ndGggKz0gbGVuZ3RoO1xuICAgICAgaW5kZXggPSBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5hdCkgPyBcbiAgICAgICAgICB0aGlzLm1vZGVscy5sZW5ndGggOiBvcHRpb25zLmF0O1xuICAgICAgdGhpcy5tb2RlbHMuc3BsaWNlLmFwcGx5KHRoaXMubW9kZWxzLCBbaW5kZXgsIDBdLmNvbmNhdChtb2RlbHMpKTtcbiAgICAgIGlmICh0aGlzLmNvbXBhcmF0b3IpIHtcbiAgICAgICAgdGhpcy5zb3J0KHtzaWxlbnQ6IHRydWV9KTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnNpbGVudCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHRoaXMubW9kZWxzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1vZGVsID0gdGhpcy5tb2RlbHNbaV07XG4gICAgICAgIGlmIChjaWRzW21vZGVsLmNpZF0pIHtcbiAgICAgICAgICBvcHRpb25zLmluZGV4ID0gaTtcbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdhZGQnLCBtb2RlbCwgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBtb2RlbCwgb3IgYSBsaXN0IG9mIG1vZGVscyBmcm9tIHRoZSBzZXQuIFBhc3Mgc2lsZW50IHRvIGF2b2lkXG4gICAgICogZmlyaW5nIHRoZSA8Y29kZT5yZW1vdmU8L2NvZGU+IGV2ZW50IGZvciBldmVyeSBtb2RlbCByZW1vdmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIFRoZSBtb2RlbCBvciBsaXN0IG9mIG1vZGVscyB0byByZW1vdmUgZnJvbSB0aGVcbiAgICAgKiAgIGNvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTogPHVsPlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgcmVtb3ZlYCBldmVudC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgaSwgbCwgaW5kZXgsIG1vZGVsO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBtb2RlbHMgPSBfLmlzQXJyYXkobW9kZWxzKSA/IG1vZGVscy5zbGljZSgpIDogW21vZGVsc107XG4gICAgICBmb3IgKGkgPSAwLCBsID0gbW9kZWxzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBtb2RlbCA9IHRoaXMuZ2V0QnlDaWQobW9kZWxzW2ldKSB8fCB0aGlzLmdldChtb2RlbHNbaV0pO1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuX2J5SWRbbW9kZWwuaWRdO1xuICAgICAgICBkZWxldGUgdGhpcy5fYnlDaWRbbW9kZWwuY2lkXTtcbiAgICAgICAgaW5kZXggPSB0aGlzLmluZGV4T2YobW9kZWwpO1xuICAgICAgICB0aGlzLm1vZGVscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmxlbmd0aC0tO1xuICAgICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgb3B0aW9ucy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgIG1vZGVsLnRyaWdnZXIoJ3JlbW92ZScsIG1vZGVsLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZW1vdmVSZWZlcmVuY2UobW9kZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBtb2RlbCBmcm9tIHRoZSBzZXQgYnkgaWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBQYXJzZSBvYmplY3RJZCBpZGVudGlmeWluZyB0aGUgUGFyc2UuT2JqZWN0IHRvXG4gICAgICogZmV0Y2ggZnJvbSB0aGlzIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIGlkICYmIHRoaXMuX2J5SWRbaWQuaWQgfHwgaWRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbW9kZWwgZnJvbSB0aGUgc2V0IGJ5IGNsaWVudCBpZC5cbiAgICAgKiBAcGFyYW0ge30gY2lkIFRoZSBCYWNrYm9uZSBjb2xsZWN0aW9uIGlkIGlkZW50aWZ5aW5nIHRoZSBQYXJzZS5PYmplY3QgdG9cbiAgICAgKiBmZXRjaCBmcm9tIHRoaXMgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBnZXRCeUNpZDogZnVuY3Rpb24oY2lkKSB7XG4gICAgICByZXR1cm4gY2lkICYmIHRoaXMuX2J5Q2lkW2NpZC5jaWQgfHwgY2lkXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbW9kZWwgYXQgdGhlIGdpdmVuIGluZGV4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbW9kZWwgdG8gcmV0dXJuLlxuICAgICAqL1xuICAgIGF0OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWxzW2luZGV4XTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRm9yY2VzIHRoZSBjb2xsZWN0aW9uIHRvIHJlLXNvcnQgaXRzZWxmLiBZb3UgZG9uJ3QgbmVlZCB0byBjYWxsIHRoaXNcbiAgICAgKiB1bmRlciBub3JtYWwgY2lyY3Vtc3RhbmNlcywgYXMgdGhlIHNldCB3aWxsIG1haW50YWluIHNvcnQgb3JkZXIgYXMgZWFjaFxuICAgICAqIGl0ZW0gaXMgYWRkZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTogPHVsPlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgcmVzZXRgIGV2ZW50LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgc29ydDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAoIXRoaXMuY29tcGFyYXRvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzb3J0IGEgc2V0IHdpdGhvdXQgYSBjb21wYXJhdG9yJyk7XG4gICAgICB9XG4gICAgICB2YXIgYm91bmRDb21wYXJhdG9yID0gXy5iaW5kKHRoaXMuY29tcGFyYXRvciwgdGhpcyk7XG4gICAgICBpZiAodGhpcy5jb21wYXJhdG9yLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLm1vZGVscyA9IHRoaXMuc29ydEJ5KGJvdW5kQ29tcGFyYXRvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vZGVscy5zb3J0KGJvdW5kQ29tcGFyYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVzZXQnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQbHVja3MgYW4gYXR0cmlidXRlIGZyb20gZWFjaCBtb2RlbCBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBUaGUgYXR0cmlidXRlIHRvIHJldHVybiBmcm9tIGVhY2ggbW9kZWwgaW4gdGhlXG4gICAgICogY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBwbHVjazogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaXMubW9kZWxzLCBmdW5jdGlvbihtb2RlbCl7IHJldHVybiBtb2RlbC5nZXQoYXR0cik7IH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHlvdSBoYXZlIG1vcmUgaXRlbXMgdGhhbiB5b3Ugd2FudCB0byBhZGQgb3IgcmVtb3ZlIGluZGl2aWR1YWxseSxcbiAgICAgKiB5b3UgY2FuIHJlc2V0IHRoZSBlbnRpcmUgc2V0IHdpdGggYSBuZXcgbGlzdCBvZiBtb2RlbHMsIHdpdGhvdXQgZmlyaW5nXG4gICAgICogYW55IGBhZGRgIG9yIGByZW1vdmVgIGV2ZW50cy4gRmlyZXMgYHJlc2V0YCB3aGVuIGZpbmlzaGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIFRoZSBtb2RlbCBvciBsaXN0IG9mIG1vZGVscyB0byByZW1vdmUgZnJvbSB0aGVcbiAgICAgKiAgIGNvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTogPHVsPlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgcmVzZXRgIGV2ZW50LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgbW9kZWxzID0gbW9kZWxzIHx8IFtdO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMubW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBzZWxmLl9yZW1vdmVSZWZlcmVuY2UobW9kZWwpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgdGhpcy5hZGQobW9kZWxzLCB7c2lsZW50OiB0cnVlLCBwYXJzZTogb3B0aW9ucy5wYXJzZX0pO1xuICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3Jlc2V0JywgdGhpcywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgZGVmYXVsdCBzZXQgb2YgbW9kZWxzIGZvciB0aGlzIGNvbGxlY3Rpb24sIHJlc2V0dGluZyB0aGVcbiAgICAgKiBjb2xsZWN0aW9uIHdoZW4gdGhleSBhcnJpdmUuIElmIGBhZGQ6IHRydWVgIGlzIHBhc3NlZCwgYXBwZW5kcyB0aGVcbiAgICAgKiBtb2RlbHMgdG8gdGhlIGNvbGxlY3Rpb24gaW5zdGVhZCBvZiByZXNldHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyBgYWRkYCBvciBgcmVzZXRgIGV2ZW50cyBmb3JcbiAgICAgKiAgIG1vZGVscyBmZXRjaGVkIGJ5IHRoaXMgZmV0Y2guXG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgdXNlcyB0aGUgTWFzdGVyIEtleSBmb3JcbiAgICAgKiAgICAgICB0aGlzIHJlcXVlc3QuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBmZXRjaDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJzZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdGlvbnMucGFyc2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzO1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyeSB8fCBuZXcgUGFyc2UuUXVlcnkodGhpcy5tb2RlbCk7XG4gICAgICByZXR1cm4gcXVlcnkuZmluZCh7XG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICBpZiAob3B0aW9ucy5hZGQpIHtcbiAgICAgICAgICBjb2xsZWN0aW9uLmFkZChyZXN1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2xsZWN0aW9uLnJlc2V0KHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYSBtb2RlbCBpbiB0aGlzIGNvbGxlY3Rpb24uIEFkZCB0aGUgbW9kZWwgdG9cbiAgICAgKiB0aGUgY29sbGVjdGlvbiBpbW1lZGlhdGVseSwgdW5sZXNzIGB3YWl0OiB0cnVlYCBpcyBwYXNzZWQsIGluIHdoaWNoIGNhc2VcbiAgICAgKiB3ZSB3YWl0IGZvciB0aGUgc2VydmVyIHRvIGFncmVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQYXJzZS5PYmplY3R9IG1vZGVsIFRoZSBuZXcgbW9kZWwgdG8gY3JlYXRlIGFuZCBhZGQgdG8gdGhlXG4gICAgICogICBjb2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPndhaXQ6IFNldCB0byB0cnVlIHRvIHdhaXQgZm9yIHRoZSBzZXJ2ZXIgdG8gY29uZmlybSBjcmVhdGlvbiBvZiB0aGVcbiAgICAgKiAgICAgICBtb2RlbCBiZWZvcmUgYWRkaW5nIGl0IHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIGFuIGBhZGRgIGV2ZW50LlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIHVzZXMgdGhlIE1hc3RlciBLZXkgZm9yXG4gICAgICogICAgICAgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbihtb2RlbCwgb3B0aW9ucykge1xuICAgICAgdmFyIGNvbGwgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBfLmNsb25lKG9wdGlvbnMpIDoge307XG4gICAgICBtb2RlbCA9IHRoaXMuX3ByZXBhcmVNb2RlbChtb2RlbCwgb3B0aW9ucyk7XG4gICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghb3B0aW9ucy53YWl0KSB7XG4gICAgICAgIGNvbGwuYWRkKG1vZGVsLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHZhciBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuICAgICAgb3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obmV4dE1vZGVsLCByZXNwLCB4aHIpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMud2FpdCkge1xuICAgICAgICAgIGNvbGwuYWRkKG5leHRNb2RlbCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICBzdWNjZXNzKG5leHRNb2RlbCwgcmVzcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dE1vZGVsLnRyaWdnZXIoJ3N5bmMnLCBtb2RlbCwgcmVzcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBtb2RlbC5zYXZlKG51bGwsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhIHJlc3BvbnNlIGludG8gYSBsaXN0IG9mIG1vZGVscyB0byBiZSBhZGRlZCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBpcyBqdXN0IHRvIHBhc3MgaXQgdGhyb3VnaC5cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHJlc3AsIHhocikge1xuICAgICAgcmV0dXJuIHJlc3A7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByb3h5IHRvIF8ncyBjaGFpbi4gQ2FuJ3QgYmUgcHJveGllZCB0aGUgc2FtZSB3YXkgdGhlIHJlc3Qgb2YgdGhlXG4gICAgICogdW5kZXJzY29yZSBtZXRob2RzIGFyZSBwcm94aWVkIGJlY2F1c2UgaXQgcmVsaWVzIG9uIHRoZSB1bmRlcnNjb3JlXG4gICAgICogY29uc3RydWN0b3IuXG4gICAgICovXG4gICAgY2hhaW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8odGhpcy5tb2RlbHMpLmNoYWluKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlc2V0IGFsbCBpbnRlcm5hbCBzdGF0ZS4gQ2FsbGVkIHdoZW4gdGhlIGNvbGxlY3Rpb24gaXMgcmVzZXQuXG4gICAgICovXG4gICAgX3Jlc2V0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICB0aGlzLm1vZGVscyA9IFtdO1xuICAgICAgdGhpcy5fYnlJZCAgPSB7fTtcbiAgICAgIHRoaXMuX2J5Q2lkID0ge307XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByZXBhcmUgYSBtb2RlbCBvciBoYXNoIG9mIGF0dHJpYnV0ZXMgdG8gYmUgYWRkZWQgdG8gdGhpcyBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIF9wcmVwYXJlTW9kZWw6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIShtb2RlbCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gbW9kZWw7XG4gICAgICAgIG9wdGlvbnMuY29sbGVjdGlvbiA9IHRoaXM7XG4gICAgICAgIG1vZGVsID0gbmV3IHRoaXMubW9kZWwoYXR0cnMsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoIW1vZGVsLl92YWxpZGF0ZShtb2RlbC5hdHRyaWJ1dGVzLCBvcHRpb25zKSkge1xuICAgICAgICAgIG1vZGVsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIW1vZGVsLmNvbGxlY3Rpb24pIHtcbiAgICAgICAgbW9kZWwuY29sbGVjdGlvbiA9IHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbW9kZWw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0byByZW1vdmUgYSBtb2RlbCdzIHRpZXMgdG8gYSBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIF9yZW1vdmVSZWZlcmVuY2U6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICBpZiAodGhpcyA9PT0gbW9kZWwuY29sbGVjdGlvbikge1xuICAgICAgICBkZWxldGUgbW9kZWwuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICAgIG1vZGVsLm9mZignYWxsJywgdGhpcy5fb25Nb2RlbEV2ZW50LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIGNhbGxlZCBldmVyeSB0aW1lIGEgbW9kZWwgaW4gdGhlIHNldCBmaXJlcyBhbiBldmVudC5cbiAgICAgKiBTZXRzIG5lZWQgdG8gdXBkYXRlIHRoZWlyIGluZGV4ZXMgd2hlbiBtb2RlbHMgY2hhbmdlIGlkcy4gQWxsIG90aGVyXG4gICAgICogZXZlbnRzIHNpbXBseSBwcm94eSB0aHJvdWdoLiBcImFkZFwiIGFuZCBcInJlbW92ZVwiIGV2ZW50cyB0aGF0IG9yaWdpbmF0ZVxuICAgICAqIGluIG90aGVyIGNvbGxlY3Rpb25zIGFyZSBpZ25vcmVkLlxuICAgICAqL1xuICAgIF9vbk1vZGVsRXZlbnQ6IGZ1bmN0aW9uKGV2LCBtb2RlbCwgY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgICAgaWYgKChldiA9PT0gJ2FkZCcgfHwgZXYgPT09ICdyZW1vdmUnKSAmJiBjb2xsZWN0aW9uICE9PSB0aGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChldiA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKG1vZGVsLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbCAmJiBldiA9PT0gJ2NoYW5nZTpvYmplY3RJZCcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2J5SWRbbW9kZWwucHJldmlvdXMoXCJvYmplY3RJZFwiKV07XG4gICAgICAgIHRoaXMuX2J5SWRbbW9kZWwuaWRdID0gbW9kZWw7XG4gICAgICB9XG4gICAgICB0aGlzLnRyaWdnZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgLy8gVW5kZXJzY29yZSBtZXRob2RzIHRoYXQgd2Ugd2FudCB0byBpbXBsZW1lbnQgb24gdGhlIENvbGxlY3Rpb24uXG4gIHZhciBtZXRob2RzID0gWydmb3JFYWNoJywgJ2VhY2gnLCAnbWFwJywgJ3JlZHVjZScsICdyZWR1Y2VSaWdodCcsICdmaW5kJyxcbiAgICAnZGV0ZWN0JywgJ2ZpbHRlcicsICdzZWxlY3QnLCAncmVqZWN0JywgJ2V2ZXJ5JywgJ2FsbCcsICdzb21lJywgJ2FueScsXG4gICAgJ2luY2x1ZGUnLCAnY29udGFpbnMnLCAnaW52b2tlJywgJ21heCcsICdtaW4nLCAnc29ydEJ5JywgJ3NvcnRlZEluZGV4JyxcbiAgICAndG9BcnJheScsICdzaXplJywgJ2ZpcnN0JywgJ2luaXRpYWwnLCAncmVzdCcsICdsYXN0JywgJ3dpdGhvdXQnLCAnaW5kZXhPZicsXG4gICAgJ3NodWZmbGUnLCAnbGFzdEluZGV4T2YnLCAnaXNFbXB0eScsICdncm91cEJ5J107XG5cbiAgLy8gTWl4IGluIGVhY2ggVW5kZXJzY29yZSBtZXRob2QgYXMgYSBwcm94eSB0byBgQ29sbGVjdGlvbiNtb2RlbHNgLlxuICBQYXJzZS5fYXJyYXlFYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIFBhcnNlLkNvbGxlY3Rpb24ucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfW21ldGhvZF0uYXBwbHkoXywgW3RoaXMubW9kZWxzXS5jb25jYXQoXy50b0FycmF5KGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9KTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5Db2xsZWN0aW9uPC9jb2RlPi4gIEZvciBleGFtcGxlLDxwcmU+XG4gICAqICAgdmFyIE15Q29sbGVjdGlvbiA9IFBhcnNlLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICogICAgIC8vIEluc3RhbmNlIHByb3BlcnRpZXNcbiAgICpcbiAgICogICAgIG1vZGVsOiBNeUNsYXNzLFxuICAgKiAgICAgcXVlcnk6IE15UXVlcnksXG4gICAqXG4gICAqICAgICBnZXRGaXJzdDogZnVuY3Rpb24oKSB7XG4gICAqICAgICAgIHJldHVybiB0aGlzLmF0KDApO1xuICAgKiAgICAgfVxuICAgKiAgIH0sIHtcbiAgICogICAgIC8vIENsYXNzIHByb3BlcnRpZXNcbiAgICpcbiAgICogICAgIG1ha2VPbmU6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICByZXR1cm4gbmV3IE15Q29sbGVjdGlvbigpO1xuICAgKiAgICAgfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiAgIHZhciBjb2xsZWN0aW9uID0gbmV3IE15Q29sbGVjdGlvbigpO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVByb3BzIEluc3RhbmNlIHByb3BlcnRpZXMgZm9yIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2xhc3NQcm9wcyBDbGFzcyBwcm9wZXJpZXMgZm9yIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBAcmV0dXJuIHtDbGFzc30gQSBuZXcgc3ViY2xhc3Mgb2YgPGNvZGU+UGFyc2UuQ29sbGVjdGlvbjwvY29kZT4uXG4gICAqL1xuICBQYXJzZS5Db2xsZWN0aW9uLmV4dGVuZCA9IFBhcnNlLl9leHRlbmQ7XG5cbn0odGhpcykpO1xuXG4vKmdsb2JhbCBfOiBmYWxzZSwgZG9jdW1lbnQ6IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGluZyBhIFBhcnNlLlZpZXcgY3JlYXRlcyBpdHMgaW5pdGlhbCBlbGVtZW50IG91dHNpZGUgb2YgdGhlIERPTSxcbiAgICogaWYgYW4gZXhpc3RpbmcgZWxlbWVudCBpcyBub3QgcHJvdmlkZWQuLi5cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkEgZm9yayBvZiBCYWNrYm9uZS5WaWV3LCBwcm92aWRlZCBmb3IgeW91ciBjb252ZW5pZW5jZS4gIElmIHlvdSB1c2UgdGhpc1xuICAgKiBjbGFzcywgeW91IG11c3QgYWxzbyBpbmNsdWRlIGpRdWVyeSwgb3IgYW5vdGhlciBsaWJyYXJ5IHRoYXQgcHJvdmlkZXMgYVxuICAgKiBqUXVlcnktY29tcGF0aWJsZSAkIGZ1bmN0aW9uLiAgRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGVcbiAgICogPGEgaHJlZj1cImh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vYmFja2JvbmUvI1ZpZXdcIj5CYWNrYm9uZVxuICAgKiBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqIDxwPjxzdHJvbmc+PGVtPkF2YWlsYWJsZSBpbiB0aGUgY2xpZW50IFNESyBvbmx5LjwvZW0+PC9zdHJvbmc+PC9wPlxuICAgKi9cbiAgUGFyc2UuVmlldyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLmNpZCA9IF8udW5pcXVlSWQoJ3ZpZXcnKTtcbiAgICB0aGlzLl9jb25maWd1cmUob3B0aW9ucyB8fCB7fSk7XG4gICAgdGhpcy5fZW5zdXJlRWxlbWVudCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgfTtcblxuICAvLyBDYWNoZWQgcmVnZXggdG8gc3BsaXQga2V5cyBmb3IgYGRlbGVnYXRlYC5cbiAgdmFyIGV2ZW50U3BsaXR0ZXIgPSAvXihcXFMrKVxccyooLiopJC87XG5cbiAgLy8gTGlzdCBvZiB2aWV3IG9wdGlvbnMgdG8gYmUgbWVyZ2VkIGFzIHByb3BlcnRpZXMuXG4gIC8vIFRPRE86IGluY2x1ZGUgb2JqZWN0SWQsIGNyZWF0ZWRBdCwgdXBkYXRlZEF0P1xuICB2YXIgdmlld09wdGlvbnMgPSBbJ21vZGVsJywgJ2NvbGxlY3Rpb24nLCAnZWwnLCAnaWQnLCAnYXR0cmlidXRlcycsXG4gICAgICAgICAgICAgICAgICAgICAnY2xhc3NOYW1lJywgJ3RhZ05hbWUnXTtcblxuICAvLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqUGFyc2UuVmlldyoqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKFBhcnNlLlZpZXcucHJvdG90eXBlLCBQYXJzZS5FdmVudHMsXG4gICAgICAgICAgIC8qKiBAbGVuZHMgUGFyc2UuVmlldy5wcm90b3R5cGUgKi8ge1xuXG4gICAgLy8gVGhlIGRlZmF1bHQgYHRhZ05hbWVgIG9mIGEgVmlldydzIGVsZW1lbnQgaXMgYFwiZGl2XCJgLlxuICAgIHRhZ05hbWU6ICdkaXYnLFxuXG4gICAgLyoqXG4gICAgICogalF1ZXJ5IGRlbGVnYXRlIGZvciBlbGVtZW50IGxvb2t1cCwgc2NvcGVkIHRvIERPTSBlbGVtZW50cyB3aXRoaW4gdGhlXG4gICAgICogY3VycmVudCB2aWV3LiBUaGlzIHNob3VsZCBiZSBwcmVmZXJlZCB0byBnbG9iYWwgbG9va3VwcyB3aGVyZSBwb3NzaWJsZS5cbiAgICAgKi9cbiAgICAkOiBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIHRoaXMuJGVsLmZpbmQoc2VsZWN0b3IpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAgKiBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29yZSBmdW5jdGlvbiB0aGF0IHlvdXIgdmlldyBzaG91bGQgb3ZlcnJpZGUsIGluIG9yZGVyXG4gICAgICogdG8gcG9wdWxhdGUgaXRzIGVsZW1lbnQgKGB0aGlzLmVsYCksIHdpdGggdGhlIGFwcHJvcHJpYXRlIEhUTUwuIFRoZVxuICAgICAqIGNvbnZlbnRpb24gaXMgZm9yICoqcmVuZGVyKiogdG8gYWx3YXlzIHJldHVybiBgdGhpc2AuXG4gICAgICovXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhpcyB2aWV3IGZyb20gdGhlIERPTS4gTm90ZSB0aGF0IHRoZSB2aWV3IGlzbid0IHByZXNlbnQgaW4gdGhlXG4gICAgICogRE9NIGJ5IGRlZmF1bHQsIHNvIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IGJlIGEgbm8tb3AuXG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZvciBzbWFsbCBhbW91bnRzIG9mIERPTSBFbGVtZW50cywgd2hlcmUgYSBmdWxsLWJsb3duIHRlbXBsYXRlIGlzbid0XG4gICAgICogbmVlZGVkLCB1c2UgKiptYWtlKiogdG8gbWFudWZhY3R1cmUgZWxlbWVudHMsIG9uZSBhdCBhIHRpbWUuXG4gICAgICogPHByZT5cbiAgICAgKiAgICAgdmFyIGVsID0gdGhpcy5tYWtlKCdsaScsIHsnY2xhc3MnOiAncm93J30sXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmVzY2FwZSgndGl0bGUnKSk7PC9wcmU+XG4gICAgICovXG4gICAgbWFrZTogZnVuY3Rpb24odGFnTmFtZSwgYXR0cmlidXRlcywgY29udGVudCkge1xuICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgIFBhcnNlLiQoZWwpLmF0dHIoYXR0cmlidXRlcyk7XG4gICAgICB9XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICBQYXJzZS4kKGVsKS5odG1sKGNvbnRlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSB2aWV3J3MgZWxlbWVudCAoYHRoaXMuZWxgIHByb3BlcnR5KSwgaW5jbHVkaW5nIGV2ZW50XG4gICAgICogcmUtZGVsZWdhdGlvbi5cbiAgICAgKi9cbiAgICBzZXRFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50LCBkZWxlZ2F0ZSkge1xuICAgICAgdGhpcy4kZWwgPSBQYXJzZS4kKGVsZW1lbnQpO1xuICAgICAgdGhpcy5lbCA9IHRoaXMuJGVsWzBdO1xuICAgICAgaWYgKGRlbGVnYXRlICE9PSBmYWxzZSkge1xuICAgICAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGNhbGxiYWNrcy4gIDxjb2RlPnRoaXMuZXZlbnRzPC9jb2RlPiBpcyBhIGhhc2ggb2ZcbiAgICAgKiA8cHJlPlxuICAgICAqICp7XCJldmVudCBzZWxlY3RvclwiOiBcImNhbGxiYWNrXCJ9KlxuICAgICAqXG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICAnbW91c2Vkb3duIC50aXRsZSc6ICAnZWRpdCcsXG4gICAgICogICAgICAgJ2NsaWNrIC5idXR0b24nOiAgICAgJ3NhdmUnXG4gICAgICogICAgICAgJ2NsaWNrIC5vcGVuJzogICAgICAgZnVuY3Rpb24oZSkgeyAuLi4gfVxuICAgICAqICAgICB9XG4gICAgICogPC9wcmU+XG4gICAgICogcGFpcnMuIENhbGxiYWNrcyB3aWxsIGJlIGJvdW5kIHRvIHRoZSB2aWV3LCB3aXRoIGB0aGlzYCBzZXQgcHJvcGVybHkuXG4gICAgICogVXNlcyBldmVudCBkZWxlZ2F0aW9uIGZvciBlZmZpY2llbmN5LlxuICAgICAqIE9taXR0aW5nIHRoZSBzZWxlY3RvciBiaW5kcyB0aGUgZXZlbnQgdG8gYHRoaXMuZWxgLlxuICAgICAqIFRoaXMgb25seSB3b3JrcyBmb3IgZGVsZWdhdGUtYWJsZSBldmVudHM6IG5vdCBgZm9jdXNgLCBgYmx1cmAsIGFuZFxuICAgICAqIG5vdCBgY2hhbmdlYCwgYHN1Ym1pdGAsIGFuZCBgcmVzZXRgIGluIEludGVybmV0IEV4cGxvcmVyLlxuICAgICAqL1xuICAgIGRlbGVnYXRlRXZlbnRzOiBmdW5jdGlvbihldmVudHMpIHtcbiAgICAgIGV2ZW50cyA9IGV2ZW50cyB8fCBQYXJzZS5fZ2V0VmFsdWUodGhpcywgJ2V2ZW50cycpO1xuICAgICAgaWYgKCFldmVudHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChldmVudHMsIGZ1bmN0aW9uKG1ldGhvZCwga2V5KSB7XG4gICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKG1ldGhvZCkpIHtcbiAgICAgICAgICBtZXRob2QgPSBzZWxmW2V2ZW50c1trZXldXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgXCInICsgZXZlbnRzW2tleV0gKyAnXCIgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF0Y2ggPSBrZXkubWF0Y2goZXZlbnRTcGxpdHRlcik7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSBtYXRjaFsxXSwgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgICAgICAgbWV0aG9kID0gXy5iaW5kKG1ldGhvZCwgc2VsZik7XG4gICAgICAgIGV2ZW50TmFtZSArPSAnLmRlbGVnYXRlRXZlbnRzJyArIHNlbGYuY2lkO1xuICAgICAgICBpZiAoc2VsZWN0b3IgPT09ICcnKSB7XG4gICAgICAgICAgc2VsZi4kZWwuYmluZChldmVudE5hbWUsIG1ldGhvZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi4kZWwuZGVsZWdhdGUoc2VsZWN0b3IsIGV2ZW50TmFtZSwgbWV0aG9kKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFycyBhbGwgY2FsbGJhY2tzIHByZXZpb3VzbHkgYm91bmQgdG8gdGhlIHZpZXcgd2l0aCBgZGVsZWdhdGVFdmVudHNgLlxuICAgICAqIFlvdSB1c3VhbGx5IGRvbid0IG5lZWQgdG8gdXNlIHRoaXMsIGJ1dCBtYXkgd2lzaCB0byBpZiB5b3UgaGF2ZSBtdWx0aXBsZVxuICAgICAqIEJhY2tib25lIHZpZXdzIGF0dGFjaGVkIHRvIHRoZSBzYW1lIERPTSBlbGVtZW50LlxuICAgICAqL1xuICAgIHVuZGVsZWdhdGVFdmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwudW5iaW5kKCcuZGVsZWdhdGVFdmVudHMnICsgdGhpcy5jaWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyB0aGUgaW5pdGlhbCBjb25maWd1cmF0aW9uIG9mIGEgVmlldyB3aXRoIGEgc2V0IG9mIG9wdGlvbnMuXG4gICAgICogS2V5cyB3aXRoIHNwZWNpYWwgbWVhbmluZyAqKG1vZGVsLCBjb2xsZWN0aW9uLCBpZCwgY2xhc3NOYW1lKSosIGFyZVxuICAgICAqIGF0dGFjaGVkIGRpcmVjdGx5IHRvIHRoZSB2aWV3LlxuICAgICAqL1xuICAgIF9jb25maWd1cmU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgXy5lYWNoKHZpZXdPcHRpb25zLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgIGlmIChvcHRpb25zW2F0dHJdKSB7XG4gICAgICAgICAgc2VsZlthdHRyXSA9IG9wdGlvbnNbYXR0cl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRW5zdXJlIHRoYXQgdGhlIFZpZXcgaGFzIGEgRE9NIGVsZW1lbnQgdG8gcmVuZGVyIGludG8uXG4gICAgICogSWYgYHRoaXMuZWxgIGlzIGEgc3RyaW5nLCBwYXNzIGl0IHRocm91Z2ggYCQoKWAsIHRha2UgdGhlIGZpcnN0XG4gICAgICogbWF0Y2hpbmcgZWxlbWVudCwgYW5kIHJlLWFzc2lnbiBpdCB0byBgZWxgLiBPdGhlcndpc2UsIGNyZWF0ZVxuICAgICAqIGFuIGVsZW1lbnQgZnJvbSB0aGUgYGlkYCwgYGNsYXNzTmFtZWAgYW5kIGB0YWdOYW1lYCBwcm9wZXJ0aWVzLlxuICAgICAqL1xuICAgIF9lbnN1cmVFbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5lbCkge1xuICAgICAgICB2YXIgYXR0cnMgPSBQYXJzZS5fZ2V0VmFsdWUodGhpcywgJ2F0dHJpYnV0ZXMnKSB8fCB7fTtcbiAgICAgICAgaWYgKHRoaXMuaWQpIHtcbiAgICAgICAgICBhdHRycy5pZCA9IHRoaXMuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgYXR0cnNbJ2NsYXNzJ10gPSB0aGlzLmNsYXNzTmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy5tYWtlKHRoaXMudGFnTmFtZSwgYXR0cnMpLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy5lbCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICB9KTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVByb3BzIEluc3RhbmNlIHByb3BlcnRpZXMgZm9yIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2xhc3NQcm9wcyBDbGFzcyBwcm9wZXJpZXMgZm9yIHRoZSB2aWV3LlxuICAgKiBAcmV0dXJuIHtDbGFzc30gQSBuZXcgc3ViY2xhc3Mgb2YgPGNvZGU+UGFyc2UuVmlldzwvY29kZT4uXG4gICAqL1xuICBQYXJzZS5WaWV3LmV4dGVuZCA9IFBhcnNlLl9leHRlbmQ7XG5cbn0odGhpcykpO1xuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+QSBQYXJzZS5Vc2VyIG9iamVjdCBpcyBhIGxvY2FsIHJlcHJlc2VudGF0aW9uIG9mIGEgdXNlciBwZXJzaXN0ZWQgdG8gdGhlXG4gICAqIFBhcnNlIGNsb3VkLiBUaGlzIGNsYXNzIGlzIGEgc3ViY2xhc3Mgb2YgYSBQYXJzZS5PYmplY3QsIGFuZCByZXRhaW5zIHRoZVxuICAgKiBzYW1lIGZ1bmN0aW9uYWxpdHkgb2YgYSBQYXJzZS5PYmplY3QsIGJ1dCBhbHNvIGV4dGVuZHMgaXQgd2l0aCB2YXJpb3VzXG4gICAqIHVzZXIgc3BlY2lmaWMgbWV0aG9kcywgbGlrZSBhdXRoZW50aWNhdGlvbiwgc2lnbmluZyB1cCwgYW5kIHZhbGlkYXRpb24gb2ZcbiAgICogdW5pcXVlbmVzcy48L3A+XG4gICAqL1xuICBQYXJzZS5Vc2VyID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIl9Vc2VyXCIsIC8qKiBAbGVuZHMgUGFyc2UuVXNlci5wcm90b3R5cGUgKi8ge1xuICAgIC8vIEluc3RhbmNlIFZhcmlhYmxlc1xuICAgIF9pc0N1cnJlbnRVc2VyOiBmYWxzZSxcblxuXG4gICAgLy8gSW5zdGFuY2UgTWV0aG9kc1xuICAgIFxuICAgIC8qKlxuICAgICAqIE1lcmdlcyBhbm90aGVyIG9iamVjdCdzIGF0dHJpYnV0ZXMgaW50byB0aGlzIG9iamVjdC5cbiAgICAgKi9cbiAgICBfbWVyZ2VGcm9tT2JqZWN0OiBmdW5jdGlvbihvdGhlcikge1xuICAgICAgaWYgKG90aGVyLmdldFNlc3Npb25Ub2tlbigpKSB7XG4gICAgICAgIHRoaXMuX3Nlc3Npb25Ub2tlbiA9IG90aGVyLmdldFNlc3Npb25Ub2tlbigpOyAgICAgIFxuICAgICAgfSAgICBcbiAgICAgIFBhcnNlLlVzZXIuX19zdXBlcl9fLl9tZXJnZUZyb21PYmplY3QuY2FsbCh0aGlzLCBvdGhlcik7XG4gICAgfSwgICAgXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gaGFuZGxlIHNwZWNpYWwgZmllbGRzIGluIGEgX1VzZXIgcmVzcG9uc2UuXG4gICAgICovXG4gICAgX21lcmdlTWFnaWNGaWVsZHM6IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgICBpZiAoYXR0cnMuc2Vzc2lvblRva2VuKSB7XG4gICAgICAgIHRoaXMuX3Nlc3Npb25Ub2tlbiA9IGF0dHJzLnNlc3Npb25Ub2tlbjtcbiAgICAgICAgZGVsZXRlIGF0dHJzLnNlc3Npb25Ub2tlbjtcbiAgICAgIH1cbiAgICAgIFBhcnNlLlVzZXIuX19zdXBlcl9fLl9tZXJnZU1hZ2ljRmllbGRzLmNhbGwodGhpcywgYXR0cnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIG51bGwgdmFsdWVzIGZyb20gYXV0aERhdGEgKHdoaWNoIGV4aXN0IHRlbXBvcmFyaWx5IGZvclxuICAgICAqIHVubGlua2luZylcbiAgICAgKi9cbiAgICBfY2xlYW51cEF1dGhEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKTtcbiAgICAgIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5nZXQoJ2F1dGhEYXRhJyksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFhdXRoRGF0YVtrZXldKSB7XG4gICAgICAgICAgZGVsZXRlIGF1dGhEYXRhW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZXMgYXV0aERhdGEgZm9yIGFsbCBwcm92aWRlcnMuXG4gICAgICovXG4gICAgX3N5bmNocm9uaXplQWxsQXV0aERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhEYXRhID0gdGhpcy5nZXQoJ2F1dGhEYXRhJyk7XG4gICAgICBpZiAoIWF1dGhEYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5nZXQoJ2F1dGhEYXRhJyksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc2VsZi5fc3luY2hyb25pemVBdXRoRGF0YShrZXkpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplcyBhdXRoIGRhdGEgZm9yIGEgcHJvdmlkZXIgKGUuZy4gcHV0cyB0aGUgYWNjZXNzIHRva2VuIGluIHRoZVxuICAgICAqIHJpZ2h0IHBsYWNlIHRvIGJlIHVzZWQgYnkgdGhlIEZhY2Vib29rIFNESykuXG4gICAgICovXG4gICAgX3N5bmNocm9uaXplQXV0aERhdGE6IGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBpZiAoIXRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGF1dGhUeXBlO1xuICAgICAgaWYgKF8uaXNTdHJpbmcocHJvdmlkZXIpKSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXI7XG4gICAgICAgIHByb3ZpZGVyID0gUGFyc2UuVXNlci5fYXV0aFByb3ZpZGVyc1thdXRoVHlwZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyLmdldEF1dGhUeXBlKCk7XG4gICAgICB9XG4gICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKTtcbiAgICAgIGlmICghYXV0aERhdGEgfHwgIXByb3ZpZGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzdWNjZXNzID0gcHJvdmlkZXIucmVzdG9yZUF1dGhlbnRpY2F0aW9uKGF1dGhEYXRhW2F1dGhUeXBlXSk7XG4gICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5fdW5saW5rRnJvbShwcm92aWRlcik7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVTYXZlUmVzdWx0OiBmdW5jdGlvbihtYWtlQ3VycmVudCkge1xuICAgICAgLy8gQ2xlYW4gdXAgYW5kIHN5bmNocm9uaXplIHRoZSBhdXRoRGF0YSBvYmplY3QsIHJlbW92aW5nIGFueSB1bnNldCB2YWx1ZXNcbiAgICAgIGlmIChtYWtlQ3VycmVudCkge1xuICAgICAgICB0aGlzLl9pc0N1cnJlbnRVc2VyID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NsZWFudXBBdXRoRGF0YSgpO1xuICAgICAgdGhpcy5fc3luY2hyb25pemVBbGxBdXRoRGF0YSgpO1xuICAgICAgLy8gRG9uJ3Qga2VlcCB0aGUgcGFzc3dvcmQgYXJvdW5kLlxuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZlckRhdGEucGFzc3dvcmQ7XG4gICAgICB0aGlzLl9yZWJ1aWxkRXN0aW1hdGVkRGF0YUZvcktleShcInBhc3N3b3JkXCIpO1xuICAgICAgdGhpcy5fcmVmcmVzaENhY2hlKCk7XG4gICAgICBpZiAobWFrZUN1cnJlbnQgfHwgdGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICBQYXJzZS5Vc2VyLl9zYXZlQ3VycmVudFVzZXIodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVubGlrZSBpbiB0aGUgQW5kcm9pZC9pT1MgU0RLcywgbG9nSW5XaXRoIGlzIHVubmVjZXNzYXJ5LCBzaW5jZSB5b3UgY2FuXG4gICAgICogY2FsbCBsaW5rV2l0aCBvbiB0aGUgdXNlciAoZXZlbiBpZiBpdCBkb2Vzbid0IGV4aXN0IHlldCBvbiB0aGUgc2VydmVyKS5cbiAgICAgKi9cbiAgICBfbGlua1dpdGg6IGZ1bmN0aW9uKHByb3ZpZGVyLCBvcHRpb25zKSB7XG4gICAgICB2YXIgYXV0aFR5cGU7XG4gICAgICBpZiAoXy5pc1N0cmluZyhwcm92aWRlcikpIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlcjtcbiAgICAgICAgcHJvdmlkZXIgPSBQYXJzZS5Vc2VyLl9hdXRoUHJvdmlkZXJzW3Byb3ZpZGVyXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXIuZ2V0QXV0aFR5cGUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYXV0aERhdGEnKSkge1xuICAgICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKSB8fCB7fTtcbiAgICAgICAgYXV0aERhdGFbYXV0aFR5cGVdID0gb3B0aW9ucy5hdXRoRGF0YTtcbiAgICAgICAgdGhpcy5zZXQoJ2F1dGhEYXRhJywgYXV0aERhdGEpO1xuXG4gICAgICAgIC8vIE92ZXJyaWRkZW4gc28gdGhhdCB0aGUgdXNlciBjYW4gYmUgbWFkZSB0aGUgY3VycmVudCB1c2VyLlxuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICAgIG5ld09wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgICAgbW9kZWwuX2hhbmRsZVNhdmVSZXN1bHQodHJ1ZSk7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5zYXZlKHsnYXV0aERhdGEnOiBhdXRoRGF0YX0sIG5ld09wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICAgIHByb3ZpZGVyLmF1dGhlbnRpY2F0ZSh7XG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocHJvdmlkZXIsIHJlc3VsdCkge1xuICAgICAgICAgICAgc2VsZi5fbGlua1dpdGgocHJvdmlkZXIsIHtcbiAgICAgICAgICAgICAgYXV0aERhdGE6IHJlc3VsdCxcbiAgICAgICAgICAgICAgc3VjY2Vzczogb3B0aW9ucy5zdWNjZXNzLFxuICAgICAgICAgICAgICBlcnJvcjogb3B0aW9ucy5lcnJvclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHNlbGYpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24ocHJvdmlkZXIsIGVycm9yKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgICBvcHRpb25zLmVycm9yKHNlbGYsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5saW5rcyBhIHVzZXIgZnJvbSBhIHNlcnZpY2UuXG4gICAgICovXG4gICAgX3VubGlua0Zyb206IGZ1bmN0aW9uKHByb3ZpZGVyLCBvcHRpb25zKSB7XG4gICAgICB2YXIgYXV0aFR5cGU7XG4gICAgICBpZiAoXy5pc1N0cmluZyhwcm92aWRlcikpIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlcjtcbiAgICAgICAgcHJvdmlkZXIgPSBQYXJzZS5Vc2VyLl9hdXRoUHJvdmlkZXJzW3Byb3ZpZGVyXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXIuZ2V0QXV0aFR5cGUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIG5ld09wdGlvbnMuYXV0aERhdGEgPSBudWxsO1xuICAgICAgbmV3T3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgc2VsZi5fc3luY2hyb25pemVBdXRoRGF0YShwcm92aWRlcik7XG4gICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLl9saW5rV2l0aChwcm92aWRlciwgbmV3T3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGEgdXNlciBpcyBsaW5rZWQgdG8gYSBzZXJ2aWNlLlxuICAgICAqL1xuICAgIF9pc0xpbmtlZDogZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIHZhciBhdXRoVHlwZTtcbiAgICAgIGlmIChfLmlzU3RyaW5nKHByb3ZpZGVyKSkge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlci5nZXRBdXRoVHlwZSgpO1xuICAgICAgfVxuICAgICAgdmFyIGF1dGhEYXRhID0gdGhpcy5nZXQoJ2F1dGhEYXRhJykgfHwge307XG4gICAgICByZXR1cm4gISFhdXRoRGF0YVthdXRoVHlwZV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERlYXV0aGVudGljYXRlcyBhbGwgcHJvdmlkZXJzLlxuICAgICAqL1xuICAgIF9sb2dPdXRXaXRoQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpO1xuICAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmdldCgnYXV0aERhdGEnKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBzZWxmLl9sb2dPdXRXaXRoKGtleSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGVhdXRoZW50aWNhdGVzIGEgc2luZ2xlIHByb3ZpZGVyIChlLmcuIHJlbW92aW5nIGFjY2VzcyB0b2tlbnMgZnJvbSB0aGVcbiAgICAgKiBGYWNlYm9vayBTREspLlxuICAgICAqL1xuICAgIF9sb2dPdXRXaXRoOiBmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgaWYgKCF0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChfLmlzU3RyaW5nKHByb3ZpZGVyKSkge1xuICAgICAgICBwcm92aWRlciA9IFBhcnNlLlVzZXIuX2F1dGhQcm92aWRlcnNbcHJvdmlkZXJdO1xuICAgICAgfVxuICAgICAgaWYgKHByb3ZpZGVyICYmIHByb3ZpZGVyLmRlYXV0aGVudGljYXRlKSB7XG4gICAgICAgIHByb3ZpZGVyLmRlYXV0aGVudGljYXRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNpZ25zIHVwIGEgbmV3IHVzZXIuIFlvdSBzaG91bGQgY2FsbCB0aGlzIGluc3RlYWQgb2Ygc2F2ZSBmb3JcbiAgICAgKiBuZXcgUGFyc2UuVXNlcnMuIFRoaXMgd2lsbCBjcmVhdGUgYSBuZXcgUGFyc2UuVXNlciBvbiB0aGUgc2VydmVyLCBhbmRcbiAgICAgKiBhbHNvIHBlcnNpc3QgdGhlIHNlc3Npb24gb24gZGlzayBzbyB0aGF0IHlvdSBjYW4gYWNjZXNzIHRoZSB1c2VyIHVzaW5nXG4gICAgICogPGNvZGU+Y3VycmVudDwvY29kZT4uXG4gICAgICpcbiAgICAgKiA8cD5BIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBtdXN0IGJlIHNldCBiZWZvcmUgY2FsbGluZyBzaWduVXAuPC9wPlxuICAgICAqXG4gICAgICogPHA+Q2FsbHMgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3Igb24gY29tcGxldGlvbi48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cnMgRXh0cmEgZmllbGRzIHRvIHNldCBvbiB0aGUgbmV3IHVzZXIsIG9yIG51bGwuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgc2lnbnVwXG4gICAgICogICAgIGZpbmlzaGVzLlxuICAgICAqIEBzZWUgUGFyc2UuVXNlci5zaWduVXBcbiAgICAgKi9cbiAgICBzaWduVXA6IGZ1bmN0aW9uKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgZXJyb3I7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHVzZXJuYW1lID0gKGF0dHJzICYmIGF0dHJzLnVzZXJuYW1lKSB8fCB0aGlzLmdldChcInVzZXJuYW1lXCIpO1xuICAgICAgaWYgKCF1c2VybmFtZSB8fCAodXNlcm5hbWUgPT09IFwiXCIpKSB7XG4gICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICBcIkNhbm5vdCBzaWduIHVwIHVzZXIgd2l0aCBhbiBlbXB0eSBuYW1lLlwiKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgIG9wdGlvbnMuZXJyb3IodGhpcywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhc3N3b3JkID0gKGF0dHJzICYmIGF0dHJzLnBhc3N3b3JkKSB8fCB0aGlzLmdldChcInBhc3N3b3JkXCIpO1xuICAgICAgaWYgKCFwYXNzd29yZCB8fCAocGFzc3dvcmQgPT09IFwiXCIpKSB7XG4gICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFxuICAgICAgICAgICAgUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICBcIkNhbm5vdCBzaWduIHVwIHVzZXIgd2l0aCBhbiBlbXB0eSBwYXNzd29yZC5cIik7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICBvcHRpb25zLmVycm9yKHRoaXMsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIC8vIE92ZXJyaWRkZW4gc28gdGhhdCB0aGUgdXNlciBjYW4gYmUgbWFkZSB0aGUgY3VycmVudCB1c2VyLlxuICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpO1xuICAgICAgbmV3T3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgbW9kZWwuX2hhbmRsZVNhdmVSZXN1bHQodHJ1ZSk7XG4gICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnNhdmUoYXR0cnMsIG5ld09wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGluIGEgUGFyc2UuVXNlci4gT24gc3VjY2VzcywgdGhpcyBzYXZlcyB0aGUgc2Vzc2lvbiB0byBsb2NhbFN0b3JhZ2UsXG4gICAgICogc28geW91IGNhbiByZXRyaWV2ZSB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyIHVzaW5nXG4gICAgICogPGNvZGU+Y3VycmVudDwvY29kZT4uXG4gICAgICpcbiAgICAgKiA8cD5BIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBtdXN0IGJlIHNldCBiZWZvcmUgY2FsbGluZyBsb2dJbi48L3A+XG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHNlZSBQYXJzZS5Vc2VyLmxvZ0luXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdpdGggdGhlIHVzZXIgd2hlblxuICAgICAqICAgICB0aGUgbG9naW4gaXMgY29tcGxldGUuXG4gICAgICovXG4gICAgbG9nSW46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJsb2dpblwiLFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIGRhdGE6IHRoaXMudG9KU09OKClcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuICAgICAgICB2YXIgc2VydmVyQXR0cnMgPSBtb2RlbC5wYXJzZShyZXNwLCBzdGF0dXMsIHhocik7XG4gICAgICAgIG1vZGVsLl9maW5pc2hGZXRjaChzZXJ2ZXJBdHRycyk7XG4gICAgICAgIG1vZGVsLl9oYW5kbGVTYXZlUmVzdWx0KHRydWUpO1xuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3Qjc2F2ZVxuICAgICAqL1xuICAgIHNhdmU6IGZ1bmN0aW9uKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgIHZhciBpLCBhdHRycywgY3VycmVudCwgb3B0aW9ucywgc2F2ZWQ7XG4gICAgICBpZiAoXy5pc09iamVjdChhcmcxKSB8fCBfLmlzTnVsbChhcmcxKSB8fCBfLmlzVW5kZWZpbmVkKGFyZzEpKSB7XG4gICAgICAgIGF0dHJzID0gYXJnMTtcbiAgICAgICAgb3B0aW9ucyA9IGFyZzI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRycyA9IHt9O1xuICAgICAgICBhdHRyc1thcmcxXSA9IGFyZzI7XG4gICAgICAgIG9wdGlvbnMgPSBhcmczO1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKTtcbiAgICAgIG5ld09wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLl9oYW5kbGVTYXZlUmVzdWx0KGZhbHNlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5wcm90b3R5cGUuc2F2ZS5jYWxsKHRoaXMsIGF0dHJzLCBuZXdPcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3QjZmV0Y2hcbiAgICAgKi9cbiAgICBmZXRjaDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIG5ld09wdGlvbnMgPSBvcHRpb25zID8gXy5jbG9uZShvcHRpb25zKSA6IHt9O1xuICAgICAgbmV3T3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgbW9kZWwuX2hhbmRsZVNhdmVSZXN1bHQoZmFsc2UpO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QucHJvdG90eXBlLmZldGNoLmNhbGwodGhpcywgbmV3T3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiA8Y29kZT5jdXJyZW50PC9jb2RlPiB3b3VsZCByZXR1cm4gdGhpcyB1c2VyLlxuICAgICAqIEBzZWUgUGFyc2UuVXNlciNjdXJyZW50XG4gICAgICovXG4gICAgaXNDdXJyZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pc0N1cnJlbnRVc2VyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGdldChcInVzZXJuYW1lXCIpLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNnZXRcbiAgICAgKi9cbiAgICBnZXRVc2VybmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoXCJ1c2VybmFtZVwiKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbHMgc2V0KFwidXNlcm5hbWVcIiwgdXNlcm5hbWUsIG9wdGlvbnMpIGFuZCByZXR1cm5zIHRoZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0LnNldFxuICAgICAqL1xuICAgIHNldFVzZXJuYW1lOiBmdW5jdGlvbih1c2VybmFtZSwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KFwidXNlcm5hbWVcIiwgdXNlcm5hbWUsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxscyBzZXQoXCJwYXNzd29yZFwiLCBwYXNzd29yZCwgb3B0aW9ucykgYW5kIHJldHVybnMgdGhlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQHNlZSBQYXJzZS5PYmplY3Quc2V0XG4gICAgICovXG4gICAgc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKHBhc3N3b3JkLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoXCJwYXNzd29yZFwiLCBwYXNzd29yZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZ2V0KFwiZW1haWxcIikuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I2dldFxuICAgICAqL1xuICAgIGdldEVtYWlsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChcImVtYWlsXCIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxscyBzZXQoXCJlbWFpbFwiLCBlbWFpbCwgb3B0aW9ucykgYW5kIHJldHVybnMgdGhlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWxcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQHNlZSBQYXJzZS5PYmplY3Quc2V0XG4gICAgICovXG4gICAgc2V0RW1haWw6IGZ1bmN0aW9uKGVtYWlsLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoXCJlbWFpbFwiLCBlbWFpbCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoaXMgdXNlciBpcyB0aGUgY3VycmVudCB1c2VyIGFuZCBoYXMgYmVlbiBhdXRoZW50aWNhdGVkLlxuICAgICAqIEByZXR1cm4gKEJvb2xlYW4pIHdoZXRoZXIgdGhpcyB1c2VyIGlzIHRoZSBjdXJyZW50IHVzZXIgYW5kIGlzIGxvZ2dlZCBpbi5cbiAgICAgKi9cbiAgICBhdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuX3Nlc3Npb25Ub2tlbiAmJlxuICAgICAgICAgIChQYXJzZS5Vc2VyLmN1cnJlbnQoKSAmJiBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5pZCA9PT0gdGhpcy5pZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNlc3Npb24gdG9rZW4gZm9yIHRoaXMgdXNlciwgaWYgdGhlIHVzZXIgaGFzIGJlZW4gbG9nZ2VkIGluLFxuICAgICAqIG9yIGlmIGl0IGlzIHRoZSByZXN1bHQgb2YgYSBxdWVyeSB3aXRoIHRoZSBtYXN0ZXIga2V5LiBPdGhlcndpc2UsIHJldHVybnNcbiAgICAgKiB1bmRlZmluZWQuXG4gICAgICogQHJldHVybiB7U3RyaW5nfSB0aGUgc2Vzc2lvbiB0b2tlbiwgb3IgdW5kZWZpbmVkXG4gICAgICovXG4gICAgZ2V0U2Vzc2lvblRva2VuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXNzaW9uVG9rZW47XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3QgYSByZXZvY2FibGUgc2Vzc2lvbiB0b2tlbiB0byByZXBsYWNlIHRoZSBvbGRlciBzdHlsZSBvZiB0b2tlbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgcmVwbGFjZW1lbnRcbiAgICAgKiAgIHRva2VuIGhhcyBiZWVuIGZldGNoZWQuXG4gICAgICovXG4gICAgX3VwZ3JhZGVUb1Jldm9jYWJsZVNlc3Npb246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgaWYgKCFQYXJzZS5Vc2VyLmN1cnJlbnQoKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcygpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdmFyIGN1cnJlbnRTZXNzaW9uID0gUGFyc2UuVXNlci5jdXJyZW50KCkuZ2V0U2Vzc2lvblRva2VuKCk7XG4gICAgICBpZiAoUGFyc2UuU2Vzc2lvbi5faXNSZXZvY2FibGUoY3VycmVudFNlc3Npb24pKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKCkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogJ3VwZ3JhZGVUb1Jldm9jYWJsZVNlc3Npb24nLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgc2Vzc2lvblRva2VuOiBjdXJyZW50U2Vzc2lvblxuICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgdmFyIHNlc3Npb24gPSBuZXcgUGFyc2UuU2Vzc2lvbigpO1xuICAgICAgICBzZXNzaW9uLl9maW5pc2hGZXRjaChyZXN1bHQpO1xuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBQYXJzZS5Vc2VyLmN1cnJlbnQoKTtcbiAgICAgICAgY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbiA9IHNlc3Npb24uZ2V0U2Vzc2lvblRva2VuKCk7XG4gICAgICAgIFBhcnNlLlVzZXIuX3NhdmVDdXJyZW50VXNlcihjdXJyZW50VXNlcik7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9LFxuXG4gIH0sIC8qKiBAbGVuZHMgUGFyc2UuVXNlciAqLyB7XG4gICAgLy8gQ2xhc3MgVmFyaWFibGVzXG5cbiAgICAvLyBUaGUgY3VycmVudGx5IGxvZ2dlZC1pbiB1c2VyLlxuICAgIF9jdXJyZW50VXNlcjogbnVsbCxcblxuICAgIC8vIFdoZXRoZXIgY3VycmVudFVzZXIgaXMga25vd24gdG8gbWF0Y2ggdGhlIHNlcmlhbGl6ZWQgdmVyc2lvbiBvbiBkaXNrLlxuICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBzYXZpbmcgYSBsb2NhbHN0b3JhZ2UgY2hlY2sgaWYgeW91IHRyeSB0byBsb2FkXG4gICAgLy8gX2N1cnJlbnRVc2VyIGZyZXF1ZW50bHkgd2hpbGUgdGhlcmUgaXMgbm9uZSBzdG9yZWQuXG4gICAgX2N1cnJlbnRVc2VyTWF0Y2hlc0Rpc2s6IGZhbHNlLFxuXG4gICAgLy8gVGhlIGxvY2FsU3RvcmFnZSBrZXkgc3VmZml4IHRoYXQgdGhlIGN1cnJlbnQgdXNlciBpcyBzdG9yZWQgdW5kZXIuXG4gICAgX0NVUlJFTlRfVVNFUl9LRVk6IFwiY3VycmVudFVzZXJcIixcblxuICAgIC8vIFRoZSBtYXBwaW5nIG9mIGF1dGggcHJvdmlkZXIgbmFtZXMgdG8gYWN0dWFsIHByb3ZpZGVyc1xuICAgIF9hdXRoUHJvdmlkZXJzOiB7fSxcblxuICAgIC8vIFdoZXRoZXIgdG8gcmV3cml0ZSBjbGFzc05hbWUgVXNlciB0byBfVXNlclxuICAgIF9wZXJmb3JtVXNlclJld3JpdGU6IHRydWUsXG5cbiAgICAvLyBXaGV0aGVyIHRvIHNlbmQgYSBSZXZvY2FibGUgU2Vzc2lvbiBoZWFkZXJcbiAgICBfaXNSZXZvY2FibGVTZXNzaW9uRW5hYmxlZDogZmFsc2UsXG5cblxuICAgIC8vIENsYXNzIE1ldGhvZHNcblxuICAgIC8qKlxuICAgICAqIFNpZ25zIHVwIGEgbmV3IHVzZXIgd2l0aCBhIHVzZXJuYW1lIChvciBlbWFpbCkgYW5kIHBhc3N3b3JkLlxuICAgICAqIFRoaXMgd2lsbCBjcmVhdGUgYSBuZXcgUGFyc2UuVXNlciBvbiB0aGUgc2VydmVyLCBhbmQgYWxzbyBwZXJzaXN0IHRoZVxuICAgICAqIHNlc3Npb24gaW4gbG9jYWxTdG9yYWdlIHNvIHRoYXQgeW91IGNhbiBhY2Nlc3MgdGhlIHVzZXIgdXNpbmdcbiAgICAgKiB7QGxpbmsgI2N1cnJlbnR9LlxuICAgICAqXG4gICAgICogPHA+Q2FsbHMgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3Igb24gY29tcGxldGlvbi48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIChvciBlbWFpbCkgdG8gc2lnbiB1cCB3aXRoLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gc2lnbiB1cCB3aXRoLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRycyBFeHRyYSBmaWVsZHMgdG8gc2V0IG9uIHRoZSBuZXcgdXNlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aXRoIHRoZSB1c2VyIHdoZW5cbiAgICAgKiAgICAgdGhlIHNpZ251cCBjb21wbGV0ZXMuXG4gICAgICogQHNlZSBQYXJzZS5Vc2VyI3NpZ25VcFxuICAgICAqL1xuICAgIHNpZ25VcDogZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkLCBhdHRycywgb3B0aW9ucykge1xuICAgICAgYXR0cnMgPSBhdHRycyB8fCB7fTtcbiAgICAgIGF0dHJzLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgICBhdHRycy5wYXNzd29yZCA9IHBhc3N3b3JkO1xuICAgICAgdmFyIHVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgcmV0dXJuIHVzZXIuc2lnblVwKGF0dHJzLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTG9ncyBpbiBhIHVzZXIgd2l0aCBhIHVzZXJuYW1lIChvciBlbWFpbCkgYW5kIHBhc3N3b3JkLiBPbiBzdWNjZXNzLCB0aGlzXG4gICAgICogc2F2ZXMgdGhlIHNlc3Npb24gdG8gZGlzaywgc28geW91IGNhbiByZXRyaWV2ZSB0aGUgY3VycmVudGx5IGxvZ2dlZCBpblxuICAgICAqIHVzZXIgdXNpbmcgPGNvZGU+Y3VycmVudDwvY29kZT4uXG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZSBUaGUgdXNlcm5hbWUgKG9yIGVtYWlsKSB0byBsb2cgaW4gd2l0aC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGxvZyBpbiB3aXRoLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdpdGggdGhlIHVzZXIgd2hlblxuICAgICAqICAgICB0aGUgbG9naW4gY29tcGxldGVzLlxuICAgICAqIEBzZWUgUGFyc2UuVXNlciNsb2dJblxuICAgICAqL1xuICAgIGxvZ0luOiBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciB1c2VyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoXCJfVXNlclwiKTtcbiAgICAgIHVzZXIuX2ZpbmlzaEZldGNoKHsgdXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQgfSk7XG4gICAgICByZXR1cm4gdXNlci5sb2dJbihvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTG9ncyBpbiBhIHVzZXIgd2l0aCBhIHNlc3Npb24gdG9rZW4uIE9uIHN1Y2Nlc3MsIHRoaXMgc2F2ZXMgdGhlIHNlc3Npb25cbiAgICAgKiB0byBkaXNrLCBzbyB5b3UgY2FuIHJldHJpZXZlIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgdXNpbmdcbiAgICAgKiA8Y29kZT5jdXJyZW50PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNlc3Npb25Ub2tlbiBUaGUgc2Vzc2lvblRva2VuIHRvIGxvZyBpbiB3aXRoLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdpdGggdGhlIHVzZXIgd2hlblxuICAgICAqICAgICB0aGUgbG9naW4gY29tcGxldGVzLlxuICAgICAqL1xuICAgIGJlY29tZTogZnVuY3Rpb24oc2Vzc2lvblRva2VuLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwidXNlcnNcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcIm1lXCIsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgc2Vzc2lvblRva2VuOiBzZXNzaW9uVG9rZW5cbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgdmFyIHNlcnZlckF0dHJzID0gdXNlci5wYXJzZShyZXNwLCBzdGF0dXMsIHhocik7XG4gICAgICAgIHVzZXIuX2ZpbmlzaEZldGNoKHNlcnZlckF0dHJzKTtcbiAgICAgICAgdXNlci5faGFuZGxlU2F2ZVJlc3VsdCh0cnVlKTtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG5cbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHVzZXIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMb2dzIG91dCB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyIHNlc3Npb24uIFRoaXMgd2lsbCByZW1vdmUgdGhlXG4gICAgICogc2Vzc2lvbiBmcm9tIGRpc2ssIGxvZyBvdXQgb2YgbGlua2VkIHNlcnZpY2VzLCBhbmQgZnV0dXJlIGNhbGxzIHRvXG4gICAgICogPGNvZGU+Y3VycmVudDwvY29kZT4gd2lsbCByZXR1cm4gPGNvZGU+bnVsbDwvY29kZT4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgc2Vzc2lvbiBpc1xuICAgICAqICAgZGVzdHJveWVkIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgbG9nT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50QXN5bmMoKS50aGVuKGZ1bmN0aW9uKGN1cnJlbnRVc2VyKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gUGFyc2UuU3RvcmFnZS5yZW1vdmVJdGVtQXN5bmMoXG4gICAgICAgICAgUGFyc2UuX2dldFBhcnNlUGF0aChQYXJzZS5Vc2VyLl9DVVJSRU5UX1VTRVJfS0VZKSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRVc2VyICE9PSBudWxsKSB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRTZXNzaW9uID0gY3VycmVudFVzZXIuZ2V0U2Vzc2lvblRva2VuKCk7XG4gICAgICAgICAgaWYgKFBhcnNlLlNlc3Npb24uX2lzUmV2b2NhYmxlKGN1cnJlbnRTZXNzaW9uKSkge1xuICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICAgICAgICAgIHJvdXRlOiAnbG9nb3V0JyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBzZXNzaW9uVG9rZW46IGN1cnJlbnRTZXNzaW9uXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRVc2VyLl9sb2dPdXRXaXRoQWxsKCk7XG4gICAgICAgICAgY3VycmVudFVzZXIuX2lzQ3VycmVudFVzZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlck1hdGNoZXNEaXNrID0gdHJ1ZTtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3RzIGEgcGFzc3dvcmQgcmVzZXQgZW1haWwgdG8gYmUgc2VudCB0byB0aGUgc3BlY2lmaWVkIGVtYWlsIGFkZHJlc3NcbiAgICAgKiBhc3NvY2lhdGVkIHdpdGggdGhlIHVzZXIgYWNjb3VudC4gVGhpcyBlbWFpbCBhbGxvd3MgdGhlIHVzZXIgdG8gc2VjdXJlbHlcbiAgICAgKiByZXNldCB0aGVpciBwYXNzd29yZCBvbiB0aGUgUGFyc2Ugc2l0ZS5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsIFRoZSBlbWFpbCBhZGRyZXNzIGFzc29jaWF0ZWQgd2l0aCB0aGUgdXNlciB0aGF0XG4gICAgICogICAgIGZvcmdvdCB0aGVpciBwYXNzd29yZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqL1xuICAgIHJlcXVlc3RQYXNzd29yZFJlc2V0OiBmdW5jdGlvbihlbWFpbCwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwicmVxdWVzdFBhc3N3b3JkUmVzZXRcIixcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgZGF0YTogeyBlbWFpbDogZW1haWwgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVxdWVzdC5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIFBhcnNlVXNlciB3aXRoIGEgdmFsaWQgc2Vzc2lvbixcbiAgICAgKiBlaXRoZXIgZnJvbSBtZW1vcnkgb3IgbG9jYWxTdG9yYWdlLCBpZiBuZWNlc3NhcnkuXG4gICAgICogQHJldHVybiB7UGFyc2UuT2JqZWN0fSBUaGUgY3VycmVudGx5IGxvZ2dlZCBpbiBQYXJzZS5Vc2VyLlxuICAgICAqL1xuICAgIGN1cnJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFBhcnNlLlN0b3JhZ2UuYXN5bmMpIHtcbiAgICAgICAgLy8gV2UgY2FuJ3QgcmV0dXJuIHRoZSBjdXJyZW50IHVzZXIgc3luY2hyb25vdXNseVxuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50QXN5bmMoKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyO1xuICAgICAgfVxuXG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzaykge1xuICAgICAgICAvLyBUT0RPOiBMYXppbHkgbG9nIGluIGFub255bW91cyB1c2VyLlxuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgICB9XG5cbiAgICAgIC8vIExvYWQgdGhlIHVzZXIgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzayA9IHRydWU7XG5cbiAgICAgIHZhciB1c2VyRGF0YSA9IFBhcnNlLlN0b3JhZ2UuZ2V0SXRlbShQYXJzZS5fZ2V0UGFyc2VQYXRoKFxuICAgICAgICAgIFBhcnNlLlVzZXIuX0NVUlJFTlRfVVNFUl9LRVkpKTtcbiAgICAgIGlmICghdXNlckRhdGEpIHtcbiAgICAgICAgLy8gVE9ETzogTGF6aWx5IGxvZyBpbiBhbm9ueW1vdXMgdXNlci5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5faXNDdXJyZW50VXNlciA9IHRydWU7XG5cbiAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh1c2VyRGF0YSk7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5pZCA9IGpzb24uX2lkO1xuICAgICAgZGVsZXRlIGpzb24uX2lkO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbiA9IGpzb24uX3Nlc3Npb25Ub2tlbjtcbiAgICAgIGRlbGV0ZSBqc29uLl9zZXNzaW9uVG9rZW47XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fZmluaXNoRmV0Y2goanNvbik7XG5cbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9zeW5jaHJvbml6ZUFsbEF1dGhEYXRhKCk7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fcmVmcmVzaENhY2hlKCk7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fb3BTZXRRdWV1ZSA9IFt7fV07XG4gICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiBQYXJzZVVzZXIgZnJvbSBhc3luY2hyb25vdXMgU3RvcmFnZS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIFByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSBjdXJyZW50bHlcbiAgICAgKiAgIGxvZ2dlZCBpbiBQYXJzZSBVc2VyXG4gICAgICovXG4gICAgX2N1cnJlbnRBc3luYzogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoUGFyc2UuVXNlci5fY3VycmVudFVzZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzaykge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIExvYWQgdGhlIHVzZXIgZnJvbSBTdG9yYWdlXG4gICAgICByZXR1cm4gUGFyc2UuU3RvcmFnZS5nZXRJdGVtQXN5bmMoUGFyc2UuX2dldFBhcnNlUGF0aChcbiAgICAgICAgUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSkpLnRoZW4oZnVuY3Rpb24odXNlckRhdGEpIHtcbiAgICAgICAgaWYgKCF1c2VyRGF0YSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoXCJfVXNlclwiKTtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX2lzQ3VycmVudFVzZXIgPSB0cnVlO1xuXG4gICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh1c2VyRGF0YSk7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLmlkID0ganNvbi5faWQ7XG4gICAgICAgIGRlbGV0ZSBqc29uLl9pZDtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbiA9IGpzb24uX3Nlc3Npb25Ub2tlbjtcbiAgICAgICAgZGVsZXRlIGpzb24uX3Nlc3Npb25Ub2tlbjtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX2ZpbmlzaEZldGNoKGpzb24pO1xuXG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9zeW5jaHJvbml6ZUFsbEF1dGhEYXRhKCk7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX29wU2V0UXVldWUgPSBbe31dO1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWxsb3cgc29tZW9uZSB0byBkZWZpbmUgYSBjdXN0b20gVXNlciBjbGFzcyB3aXRob3V0IGNsYXNzTmFtZVxuICAgICAqIGJlaW5nIHJld3JpdHRlbiB0byBfVXNlci4gVGhlIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmV3cml0ZVxuICAgICAqIFVzZXIgdG8gX1VzZXIgZm9yIGxlZ2FjeSByZWFzb25zLiBUaGlzIGFsbG93cyBkZXZlbG9wZXJzIHRvXG4gICAgICogb3ZlcnJpZGUgdGhhdCBiZWhhdmlvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNBbGxvd2VkIFdoZXRoZXIgb3Igbm90IHRvIGFsbG93IGN1c3RvbSBVc2VyIGNsYXNzXG4gICAgICovXG4gICAgYWxsb3dDdXN0b21Vc2VyQ2xhc3M6IGZ1bmN0aW9uKGlzQWxsb3dlZCkge1xuICAgICAgdGhpcy5fcGVyZm9ybVVzZXJSZXdyaXRlID0gIWlzQWxsb3dlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWxsb3cgYSBsZWdhY3kgYXBwbGljYXRpb24gdG8gc3RhcnQgdXNpbmcgcmV2b2NhYmxlIHNlc3Npb25zLiBJZiB0aGVcbiAgICAgKiBjdXJyZW50IHNlc3Npb24gdG9rZW4gaXMgbm90IHJldm9jYWJsZSwgYSByZXF1ZXN0IHdpbGwgYmUgbWFkZSBmb3IgYSBuZXcsXG4gICAgICogcmV2b2NhYmxlIHNlc3Npb24uXG4gICAgICogSXQgaXMgbm90IG5lY2Vzc2FyeSB0byBjYWxsIHRoaXMgbWV0aG9kIGZyb20gY2xvdWQgY29kZSB1bmxlc3MgeW91IGFyZVxuICAgICAqIGhhbmRsaW5nIHVzZXIgc2lnbnVwIG9yIGxvZ2luIGZyb20gdGhlIHNlcnZlciBzaWRlLiBJbiBhIGNsb3VkIGNvZGUgY2FsbCxcbiAgICAgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgbm90IGF0dGVtcHQgdG8gdXBncmFkZSB0aGUgY3VycmVudCB0b2tlbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgcHJvY2VzcyBoYXNcbiAgICAgKiAgIGNvbXBsZXRlZC4gSWYgYSByZXBsYWNlbWVudCBzZXNzaW9uIHRva2VuIGlzIHJlcXVlc3RlZCwgdGhlIHByb21pc2VcbiAgICAgKiAgIHdpbGwgYmUgcmVzb2x2ZWQgYWZ0ZXIgYSBuZXcgdG9rZW4gaGFzIGJlZW4gZmV0Y2hlZC5cbiAgICAgKi9cbiAgICBlbmFibGVSZXZvY2FibGVTZXNzaW9uOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIFBhcnNlLlVzZXIuX2lzUmV2b2NhYmxlU2Vzc2lvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgaWYgKCFQYXJzZS5faXNOb2RlICYmIFBhcnNlLlVzZXIuY3VycmVudCgpKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5fdXBncmFkZVRvUmV2b2NhYmxlU2Vzc2lvbihvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKCkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBlcnNpc3RzIGEgdXNlciBhcyBjdXJyZW50VXNlciB0byBsb2NhbFN0b3JhZ2UsIGFuZCBpbnRvIHRoZSBzaW5nbGV0b24uXG4gICAgICovXG4gICAgX3NhdmVDdXJyZW50VXNlcjogZnVuY3Rpb24odXNlcikge1xuICAgICAgaWYgKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyICE9PSBudWxsICYmXG4gICAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIgIT09IHVzZXIpIHtcbiAgICAgICAgUGFyc2UuVXNlci5sb2dPdXQoKTtcbiAgICAgIH1cbiAgICAgIHVzZXIuX2lzQ3VycmVudFVzZXIgPSB0cnVlO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzayA9IHRydWU7XG5cbiAgICAgIHZhciBqc29uID0gdXNlci50b0pTT04oKTtcbiAgICAgIGpzb24uX2lkID0gdXNlci5pZDtcbiAgICAgIGpzb24uX3Nlc3Npb25Ub2tlbiA9IHVzZXIuX3Nlc3Npb25Ub2tlbjtcbiAgICAgIGlmIChQYXJzZS5TdG9yYWdlLmFzeW5jKSB7XG4gICAgICAgIFBhcnNlLlN0b3JhZ2Uuc2V0SXRlbUFzeW5jKFxuICAgICAgICAgIFBhcnNlLl9nZXRQYXJzZVBhdGgoUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSksXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoanNvbikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUGFyc2UuU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgIFBhcnNlLl9nZXRQYXJzZVBhdGgoUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSksXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoanNvbikpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJBdXRoZW50aWNhdGlvblByb3ZpZGVyOiBmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgUGFyc2UuVXNlci5fYXV0aFByb3ZpZGVyc1twcm92aWRlci5nZXRBdXRoVHlwZSgpXSA9IHByb3ZpZGVyO1xuICAgICAgLy8gU3luY2hyb25pemUgdGhlIGN1cnJlbnQgdXNlciB3aXRoIHRoZSBhdXRoIHByb3ZpZGVyLlxuICAgICAgaWYgKFBhcnNlLlVzZXIuY3VycmVudCgpKSB7XG4gICAgICAgIFBhcnNlLlVzZXIuY3VycmVudCgpLl9zeW5jaHJvbml6ZUF1dGhEYXRhKHByb3ZpZGVyLmdldEF1dGhUeXBlKCkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfbG9nSW5XaXRoOiBmdW5jdGlvbihwcm92aWRlciwgb3B0aW9ucykge1xuICAgICAgdmFyIHVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgcmV0dXJuIHVzZXIuX2xpbmtXaXRoKHByb3ZpZGVyLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgfSk7XG59KHRoaXMpKTtcblxuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkEgUGFyc2UuU2Vzc2lvbiBvYmplY3QgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBhIHJldm9jYWJsZSBzZXNzaW9uLlxuICAgKiBUaGlzIGNsYXNzIGlzIGEgc3ViY2xhc3Mgb2YgYSBQYXJzZS5PYmplY3QsIGFuZCByZXRhaW5zIHRoZSBzYW1lXG4gICAqIGZ1bmN0aW9uYWxpdHkgb2YgYSBQYXJzZS5PYmplY3QuPC9wPlxuICAgKi9cbiAgUGFyc2UuU2Vzc2lvbiA9IFBhcnNlLk9iamVjdC5leHRlbmQoJ19TZXNzaW9uJyxcbiAgLyoqIEBsZW5kcyBQYXJzZS5TZXNzaW9uLnByb3RvdHlwZSAqL1xuICB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2Vzc2lvbiB0b2tlbiBzdHJpbmcuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldFNlc3Npb25Ub2tlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2Vzc2lvblRva2VuO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gaGFuZGxlIHNwZWNpYWwgZmllbGRzIGluIGEgX1Nlc3Npb24gcmVzcG9uc2UuXG4gICAgICovXG4gICAgX21lcmdlTWFnaWNGaWVsZHM6IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgICBpZiAoYXR0cnMuc2Vzc2lvblRva2VuKSB7XG4gICAgICAgIHRoaXMuX3Nlc3Npb25Ub2tlbiA9IGF0dHJzLnNlc3Npb25Ub2tlbjtcbiAgICAgICAgZGVsZXRlIGF0dHJzLnNlc3Npb25Ub2tlbjtcbiAgICAgIH1cbiAgICAgIFBhcnNlLlNlc3Npb24uX19zdXBlcl9fLl9tZXJnZU1hZ2ljRmllbGRzLmNhbGwodGhpcywgYXR0cnMpO1xuICAgIH0sXG4gIH0sIC8qKiBAbGVuZHMgUGFyc2UuU2Vzc2lvbiAqLyB7XG5cbiAgICAvLyBUaHJvdyBhbiBlcnJvciB3aGVuIG1vZGlmeWluZyB0aGVzZSByZWFkLW9ubHkgZmllbGRzXG4gICAgcmVhZE9ubHlBdHRyaWJ1dGVzOiB7XG4gICAgICBjcmVhdGVkV2l0aDogdHJ1ZSxcbiAgICAgIGV4cGlyZXNBdDogdHJ1ZSxcbiAgICAgIGluc3RhbGxhdGlvbklkOiB0cnVlLFxuICAgICAgcmVzdHJpY3RlZDogdHJ1ZSxcbiAgICAgIHNlc3Npb25Ub2tlbjogdHJ1ZSxcbiAgICAgIHVzZXI6IHRydWVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBTZXNzaW9uIG9iamVjdCBmb3IgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gc2Vzc2lvbi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSBQYXJzZS5TZXNzaW9uXG4gICAgICogICBvYmplY3QgYWZ0ZXIgaXQgaGFzIGJlZW4gZmV0Y2hlZC5cbiAgICAgKi9cbiAgICBjdXJyZW50OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHNlc3Npb24gPSBQYXJzZS5PYmplY3QuX2NyZWF0ZSgnX1Nlc3Npb24nKTtcbiAgICAgIHZhciBjdXJyZW50VG9rZW4gPSBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5nZXRTZXNzaW9uVG9rZW4oKTtcbiAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiAnc2Vzc2lvbnMnLFxuICAgICAgICBjbGFzc05hbWU6ICdtZScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogY3VycmVudFRva2VuXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgIHZhciBzZXJ2ZXJBdHRycyA9IHNlc3Npb24ucGFyc2UocmVzcCwgc3RhdHVzLCB4aHIpO1xuICAgICAgICBzZXNzaW9uLl9maW5pc2hGZXRjaChzZXJ2ZXJBdHRycyk7XG4gICAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgc2Vzc2lvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhIHNlc3Npb24gdG9rZW4gaXMgcmV2b2NhYmxlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgX2lzUmV2b2NhYmxlOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgcmV0dXJuIHRva2VuLmluZGV4T2YoJ3I6JykgPiAtMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlc3Npb24gdG9rZW4gaXMgcmV2b2NhYmxlLlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCBmb3IgbWlncmF0aW5nIEV4cHJlc3MuanMgb3IgTm9kZS5qcyB3ZWIgYXBwcyB0b1xuICAgICAqIHVzZSByZXZvY2FibGUgc2Vzc2lvbnMuIElmIHlvdSBhcmUgbWlncmF0aW5nIGFuIGFwcCB0aGF0IHVzZXMgdGhlIFBhcnNlXG4gICAgICogU0RLIGluIHRoZSBicm93c2VyIG9ubHksIHBsZWFzZSB1c2UgUGFyc2UuVXNlci5lbmFibGVSZXZvY2FibGVTZXNzaW9uKClcbiAgICAgKiBpbnN0ZWFkLCBzbyB0aGF0IHNlc3Npb25zIGNhbiBiZSBhdXRvbWF0aWNhbGx5IHVwZ3JhZGVkLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNDdXJyZW50U2Vzc2lvblJldm9jYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoUGFyc2UuVXNlci5jdXJyZW50KCkgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlNlc3Npb24uX2lzUmV2b2NhYmxlKFxuICAgICAgICAgIFBhcnNlLlVzZXIuY3VycmVudCgpLmdldFNlc3Npb25Ub2tlbigpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pKHRoaXMpO1xuXG4vLyBQYXJzZS5RdWVyeSBpcyBhIHdheSB0byBjcmVhdGUgYSBsaXN0IG9mIFBhcnNlLk9iamVjdHMuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBhcnNlIFBhcnNlLlF1ZXJ5IGZvciB0aGUgZ2l2ZW4gUGFyc2UuT2JqZWN0IHN1YmNsYXNzLlxuICAgKiBAcGFyYW0gb2JqZWN0Q2xhc3MgLVxuICAgKiAgIEFuIGluc3RhbmNlIG9mIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0LCBvciBhIFBhcnNlIGNsYXNzTmFtZSBzdHJpbmcuXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5QYXJzZS5RdWVyeSBkZWZpbmVzIGEgcXVlcnkgdGhhdCBpcyB1c2VkIHRvIGZldGNoIFBhcnNlLk9iamVjdHMuIFRoZVxuICAgKiBtb3N0IGNvbW1vbiB1c2UgY2FzZSBpcyBmaW5kaW5nIGFsbCBvYmplY3RzIHRoYXQgbWF0Y2ggYSBxdWVyeSB0aHJvdWdoIHRoZVxuICAgKiA8Y29kZT5maW5kPC9jb2RlPiBtZXRob2QuIEZvciBleGFtcGxlLCB0aGlzIHNhbXBsZSBjb2RlIGZldGNoZXMgYWxsIG9iamVjdHNcbiAgICogb2YgY2xhc3MgPGNvZGU+TXlDbGFzczwvY29kZT4uIEl0IGNhbGxzIGEgZGlmZmVyZW50IGZ1bmN0aW9uIGRlcGVuZGluZyBvblxuICAgKiB3aGV0aGVyIHRoZSBmZXRjaCBzdWNjZWVkZWQgb3Igbm90LlxuICAgKiBcbiAgICogPHByZT5cbiAgICogdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KE15Q2xhc3MpO1xuICAgKiBxdWVyeS5maW5kKHtcbiAgICogICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAqICAgICAvLyByZXN1bHRzIGlzIGFuIGFycmF5IG9mIFBhcnNlLk9iamVjdC5cbiAgICogICB9LFxuICAgKlxuICAgKiAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgLy8gZXJyb3IgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IuXG4gICAqICAgfVxuICAgKiB9KTs8L3ByZT48L3A+XG4gICAqIFxuICAgKiA8cD5BIFBhcnNlLlF1ZXJ5IGNhbiBhbHNvIGJlIHVzZWQgdG8gcmV0cmlldmUgYSBzaW5nbGUgb2JqZWN0IHdob3NlIGlkIGlzXG4gICAqIGtub3duLCB0aHJvdWdoIHRoZSBnZXQgbWV0aG9kLiBGb3IgZXhhbXBsZSwgdGhpcyBzYW1wbGUgY29kZSBmZXRjaGVzIGFuXG4gICAqIG9iamVjdCBvZiBjbGFzcyA8Y29kZT5NeUNsYXNzPC9jb2RlPiBhbmQgaWQgPGNvZGU+bXlJZDwvY29kZT4uIEl0IGNhbGxzIGFcbiAgICogZGlmZmVyZW50IGZ1bmN0aW9uIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBmZXRjaCBzdWNjZWVkZWQgb3Igbm90LlxuICAgKiBcbiAgICogPHByZT5cbiAgICogdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KE15Q2xhc3MpO1xuICAgKiBxdWVyeS5nZXQobXlJZCwge1xuICAgKiAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgKiAgICAgLy8gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLk9iamVjdC5cbiAgICogICB9LFxuICAgKlxuICAgKiAgIGVycm9yOiBmdW5jdGlvbihvYmplY3QsIGVycm9yKSB7XG4gICAqICAgICAvLyBlcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvci5cbiAgICogICB9XG4gICAqIH0pOzwvcHJlPjwvcD5cbiAgICogXG4gICAqIDxwPkEgUGFyc2UuUXVlcnkgY2FuIGFsc28gYmUgdXNlZCB0byBjb3VudCB0aGUgbnVtYmVyIG9mIG9iamVjdHMgdGhhdCBtYXRjaFxuICAgKiB0aGUgcXVlcnkgd2l0aG91dCByZXRyaWV2aW5nIGFsbCBvZiB0aG9zZSBvYmplY3RzLiBGb3IgZXhhbXBsZSwgdGhpc1xuICAgKiBzYW1wbGUgY29kZSBjb3VudHMgdGhlIG51bWJlciBvZiBvYmplY3RzIG9mIHRoZSBjbGFzcyA8Y29kZT5NeUNsYXNzPC9jb2RlPlxuICAgKiA8cHJlPlxuICAgKiB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoTXlDbGFzcyk7XG4gICAqIHF1ZXJ5LmNvdW50KHtcbiAgICogICBzdWNjZXNzOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICogICAgIC8vIFRoZXJlIGFyZSBudW1iZXIgaW5zdGFuY2VzIG9mIE15Q2xhc3MuXG4gICAqICAgfSxcbiAgICpcbiAgICogICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgIC8vIGVycm9yIGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLkVycm9yLlxuICAgKiAgIH1cbiAgICogfSk7PC9wcmU+PC9wPlxuICAgKi9cbiAgUGFyc2UuUXVlcnkgPSBmdW5jdGlvbihvYmplY3RDbGFzcykge1xuICAgIGlmIChfLmlzU3RyaW5nKG9iamVjdENsYXNzKSkge1xuICAgICAgb2JqZWN0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzKG9iamVjdENsYXNzKTtcbiAgICB9XG5cbiAgICB0aGlzLm9iamVjdENsYXNzID0gb2JqZWN0Q2xhc3M7XG5cbiAgICB0aGlzLmNsYXNzTmFtZSA9IG9iamVjdENsYXNzLnByb3RvdHlwZS5jbGFzc05hbWU7XG5cbiAgICB0aGlzLl93aGVyZSA9IHt9O1xuICAgIHRoaXMuX2luY2x1ZGUgPSBbXTtcbiAgICB0aGlzLl9saW1pdCA9IC0xOyAvLyBuZWdhdGl2ZSBsaW1pdCBtZWFucywgZG8gbm90IHNlbmQgYSBsaW1pdFxuICAgIHRoaXMuX3NraXAgPSAwO1xuICAgIHRoaXMuX2V4dHJhT3B0aW9ucyA9IHt9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgUGFyc2UuUXVlcnkgdGhhdCBpcyB0aGUgT1Igb2YgdGhlIHBhc3NlZCBpbiBxdWVyaWVzLiAgRm9yXG4gICAqIGV4YW1wbGU6XG4gICAqIDxwcmU+dmFyIGNvbXBvdW5kUXVlcnkgPSBQYXJzZS5RdWVyeS5vcihxdWVyeTEsIHF1ZXJ5MiwgcXVlcnkzKTs8L3ByZT5cbiAgICpcbiAgICogd2lsbCBjcmVhdGUgYSBjb21wb3VuZFF1ZXJ5IHRoYXQgaXMgYW4gb3Igb2YgdGhlIHF1ZXJ5MSwgcXVlcnkyLCBhbmRcbiAgICogcXVlcnkzLlxuICAgKiBAcGFyYW0gey4uLlBhcnNlLlF1ZXJ5fSB2YXJfYXJncyBUaGUgbGlzdCBvZiBxdWVyaWVzIHRvIE9SLlxuICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gVGhlIHF1ZXJ5IHRoYXQgaXMgdGhlIE9SIG9mIHRoZSBwYXNzZWQgaW4gcXVlcmllcy5cbiAgICovXG4gIFBhcnNlLlF1ZXJ5Lm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHF1ZXJpZXMgPSBfLnRvQXJyYXkoYXJndW1lbnRzKTtcbiAgICB2YXIgY2xhc3NOYW1lID0gbnVsbDtcbiAgICBQYXJzZS5fYXJyYXlFYWNoKHF1ZXJpZXMsIGZ1bmN0aW9uKHEpIHtcbiAgICAgIGlmIChfLmlzTnVsbChjbGFzc05hbWUpKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IHEuY2xhc3NOYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2xhc3NOYW1lICE9PSBxLmNsYXNzTmFtZSkge1xuICAgICAgICB0aHJvdyBcIkFsbCBxdWVyaWVzIG11c3QgYmUgZm9yIHRoZSBzYW1lIGNsYXNzXCI7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KGNsYXNzTmFtZSk7XG4gICAgcXVlcnkuX29yUXVlcnkocXVlcmllcyk7XG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9O1xuXG4gIFBhcnNlLlF1ZXJ5LnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgUGFyc2UuT2JqZWN0IHdob3NlIGlkIGlzIGFscmVhZHkga25vd24gYnkgZmV0Y2hpbmcgZGF0YSBmcm9tXG4gICAgICogdGhlIHNlcnZlci4gIEVpdGhlciBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBpcyBjYWxsZWQgd2hlbiB0aGVcbiAgICAgKiBmaW5kIGNvbXBsZXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvYmplY3RJZCBUaGUgaWQgb2YgdGhlIG9iamVjdCB0byBiZSBmZXRjaGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFja1xuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24ob2JqZWN0SWQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuZXF1YWxUbygnb2JqZWN0SWQnLCBvYmplY3RJZCk7XG5cbiAgICAgIHZhciBmaXJzdE9wdGlvbnMgPSB7fTtcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaGFzKG9wdGlvbnMsICd1c2VNYXN0ZXJLZXknKSkge1xuICAgICAgICBmaXJzdE9wdGlvbnMgPSB7IHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXkgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlbGYuZmlyc3QoZmlyc3RPcHRpb25zKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlcnJvck9iamVjdCA9IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PQkpFQ1RfTk9UX0ZPVU5ELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJPYmplY3Qgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3JPYmplY3QpO1xuXG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCBudWxsKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhpcyBxdWVyeS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBxdWVyeS5cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgd2hlcmU6IHRoaXMuX3doZXJlXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5faW5jbHVkZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBhcmFtcy5pbmNsdWRlID0gdGhpcy5faW5jbHVkZS5qb2luKFwiLFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgICAgcGFyYW1zLmtleXMgPSB0aGlzLl9zZWxlY3Quam9pbihcIixcIik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fbGltaXQgPj0gMCkge1xuICAgICAgICBwYXJhbXMubGltaXQgPSB0aGlzLl9saW1pdDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9za2lwID4gMCkge1xuICAgICAgICBwYXJhbXMuc2tpcCA9IHRoaXMuX3NraXA7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fb3JkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJhbXMub3JkZXIgPSB0aGlzLl9vcmRlci5qb2luKFwiLFwiKTtcbiAgICAgIH1cblxuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5fZXh0cmFPcHRpb25zLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHBhcmFtc1trXSA9IHY7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGEgbGlzdCBvZiBQYXJzZU9iamVjdHMgdGhhdCBzYXRpc2Z5IHRoaXMgcXVlcnkuXG4gICAgICogRWl0aGVyIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIGlzIGNhbGxlZCB3aGVuIHRoZSBmaW5kXG4gICAgICogY29tcGxldGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC4gVmFsaWQgb3B0aW9uc1xuICAgICAqIGFyZTo8dWw+XG4gICAgICogICA8bGk+c3VjY2VzczogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBmaW5kIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAgICogICA8bGk+ZXJyb3I6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZmluZCBmYWlscy5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0cyB3aGVuXG4gICAgICogdGhlIHF1ZXJ5IGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBmaW5kOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcImNsYXNzZXNcIixcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLmNsYXNzTmFtZSxcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBkYXRhOiB0aGlzLnRvSlNPTigpXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gXy5tYXAocmVzcG9uc2UucmVzdWx0cywgZnVuY3Rpb24oanNvbikge1xuICAgICAgICAgIHZhciBvYmo7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgb2JqID0gbmV3IFBhcnNlLk9iamVjdChyZXNwb25zZS5jbGFzc05hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmogPSBuZXcgc2VsZi5vYmplY3RDbGFzcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYmouX2ZpbmlzaEZldGNoKGpzb24sIHRydWUpO1xuICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0pO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvdW50cyB0aGUgbnVtYmVyIG9mIG9iamVjdHMgdGhhdCBtYXRjaCB0aGlzIHF1ZXJ5LlxuICAgICAqIEVpdGhlciBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBpcyBjYWxsZWQgd2hlbiB0aGUgY291bnRcbiAgICAgKiBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LiBWYWxpZCBvcHRpb25zXG4gICAgICogYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGNvdW50IGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAgICogICA8bGk+ZXJyb3I6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZmluZCBmYWlscy5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiA8L3VsPlxuICAgICAqXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgY291bnQgd2hlblxuICAgICAqIHRoZSBxdWVyeSBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgY291bnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcGFyYW1zID0gdGhpcy50b0pTT04oKTtcbiAgICAgIHBhcmFtcy5saW1pdCA9IDA7XG4gICAgICBwYXJhbXMuY291bnQgPSAxO1xuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcImNsYXNzZXNcIixcbiAgICAgICAgY2xhc3NOYW1lOiBzZWxmLmNsYXNzTmFtZSwgXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgZGF0YTogcGFyYW1zXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuY291bnQ7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGF0IG1vc3Qgb25lIFBhcnNlLk9iamVjdCB0aGF0IHNhdGlzZmllcyB0aGlzIHF1ZXJ5LlxuICAgICAqXG4gICAgICogRWl0aGVyIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIGlzIGNhbGxlZCB3aGVuIGl0IGNvbXBsZXRlcy5cbiAgICAgKiBzdWNjZXNzIGlzIHBhc3NlZCB0aGUgb2JqZWN0IGlmIHRoZXJlIGlzIG9uZS4gb3RoZXJ3aXNlLCB1bmRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LiBWYWxpZCBvcHRpb25zXG4gICAgICogYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGZpbmQgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAgICAgKiAgIDxsaT5lcnJvcjogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBmaW5kIGZhaWxzLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqIDwvdWw+XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSBvYmplY3Qgd2hlblxuICAgICAqIHRoZSBxdWVyeSBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgZmlyc3Q6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcGFyYW1zID0gdGhpcy50b0pTT04oKTtcbiAgICAgIHBhcmFtcy5saW1pdCA9IDE7XG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwiY2xhc3Nlc1wiLFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMuY2xhc3NOYW1lLCBcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBkYXRhOiBwYXJhbXNcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChyZXNwb25zZS5yZXN1bHRzLCBmdW5jdGlvbihqc29uKSB7XG4gICAgICAgICAgdmFyIG9iajtcbiAgICAgICAgICBpZiAocmVzcG9uc2UuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBvYmogPSBuZXcgUGFyc2UuT2JqZWN0KHJlc3BvbnNlLmNsYXNzTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iaiA9IG5ldyBzZWxmLm9iamVjdENsYXNzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9iai5fZmluaXNoRmV0Y2goanNvbiwgdHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSlbMF07XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBpbnN0YW5jZSBvZiBQYXJzZS5Db2xsZWN0aW9uIGJhY2tlZCBieSB0aGlzIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zIEFuIGFycmF5IG9mIGluc3RhbmNlcyBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+XG4gICAgICogICAgIHdpdGggd2hpY2ggdG8gc3RhcnQgdGhpcyBDb2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIG9iamVjdCB3aXRoIEJhY2tib25lLXN0eWxlIG9wdGlvbnMuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPm1vZGVsOiBUaGUgUGFyc2UuT2JqZWN0IHN1YmNsYXNzIHRoYXQgdGhpcyBjb2xsZWN0aW9uIGNvbnRhaW5zLlxuICAgICAqICAgPGxpPnF1ZXJ5OiBBbiBpbnN0YW5jZSBvZiBQYXJzZS5RdWVyeSB0byB1c2Ugd2hlbiBmZXRjaGluZyBpdGVtcy5cbiAgICAgKiAgIDxsaT5jb21wYXJhdG9yOiBBIHN0cmluZyBwcm9wZXJ0eSBuYW1lIG9yIGZ1bmN0aW9uIHRvIHNvcnQgYnkuXG4gICAgICogPC91bD5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Db2xsZWN0aW9ufVxuICAgICAqL1xuICAgIGNvbGxlY3Rpb246IGZ1bmN0aW9uKGl0ZW1zLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHJldHVybiBuZXcgUGFyc2UuQ29sbGVjdGlvbihpdGVtcywgXy5leHRlbmQob3B0aW9ucywge1xuICAgICAgICBtb2RlbDogdGhpcy5vYmplY3RDbGFzcyxcbiAgICAgICAgcXVlcnk6IHRoaXNcbiAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbnVtYmVyIG9mIHJlc3VsdHMgdG8gc2tpcCBiZWZvcmUgcmV0dXJuaW5nIGFueSByZXN1bHRzLlxuICAgICAqIFRoaXMgaXMgdXNlZnVsIGZvciBwYWdpbmF0aW9uLlxuICAgICAqIERlZmF1bHQgaXMgdG8gc2tpcCB6ZXJvIHJlc3VsdHMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG4gdGhlIG51bWJlciBvZiByZXN1bHRzIHRvIHNraXAuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBza2lwOiBmdW5jdGlvbihuKSB7XG4gICAgICB0aGlzLl9za2lwID0gbjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBsaW1pdCBvZiB0aGUgbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBUaGUgZGVmYXVsdCBsaW1pdCBpc1xuICAgICAqIDEwMCwgd2l0aCBhIG1heGltdW0gb2YgMTAwMCByZXN1bHRzIGJlaW5nIHJldHVybmVkIGF0IGEgdGltZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiB0aGUgbnVtYmVyIG9mIHJlc3VsdHMgdG8gbGltaXQgdG8uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBsaW1pdDogZnVuY3Rpb24obikge1xuICAgICAgdGhpcy5fbGltaXQgPSBuO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgdGhlIFBhcnNlLk9iamVjdCBtdXN0IGNvbnRhaW4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBlcXVhbFRvOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9lc05vdEV4aXN0KGtleSk7XG4gICAgICB9IFxuXG4gICAgICB0aGlzLl93aGVyZVtrZXldID0gUGFyc2UuX2VuY29kZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIGZvciBjb25kaXRpb24gcXVlcmllc1xuICAgICAqL1xuICAgIF9hZGRDb25kaXRpb246IGZ1bmN0aW9uKGtleSwgY29uZGl0aW9uLCB2YWx1ZSkge1xuICAgICAgLy8gQ2hlY2sgaWYgd2UgYWxyZWFkeSBoYXZlIGEgY29uZGl0aW9uXG4gICAgICBpZiAoIXRoaXMuX3doZXJlW2tleV0pIHtcbiAgICAgICAgdGhpcy5fd2hlcmVba2V5XSA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5fd2hlcmVba2V5XVtjb25kaXRpb25dID0gUGFyc2UuX2VuY29kZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBub3QgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgbXVzdCBub3QgYmUgZXF1YWxsZWQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBub3RFcXVhbFRvOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRuZVwiLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBsZXNzIHRoYW4gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgcHJvdmlkZXMgYW4gdXBwZXIgYm91bmQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBsZXNzVGhhbjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbHRcIiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgZ3JlYXRlciB0aGFuIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0aGF0IHByb3ZpZGVzIGFuIGxvd2VyIGJvdW5kLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZ3JlYXRlclRoYW46IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGd0XCIsIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCBwcm92aWRlcyBhbiB1cHBlciBib3VuZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGxlc3NUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRsdGVcIiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0aGF0IHByb3ZpZGVzIGFuIGxvd2VyIGJvdW5kLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZ3JlYXRlclRoYW5PckVxdWFsVG86IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGd0ZVwiLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBjb250YWluZWQgaW4gdGhlIHByb3ZpZGVkIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0aGF0IHdpbGwgbWF0Y2guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBjb250YWluZWRJbjogZnVuY3Rpb24oa2V5LCB2YWx1ZXMpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGluXCIsIHZhbHVlcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBub3QgYmUgY29udGFpbmVkIGluIHRoZSBwcm92aWRlZCBsaXN0IG9mIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdGhhdCB3aWxsIG5vdCBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG5vdENvbnRhaW5lZEluOiBmdW5jdGlvbihrZXksIHZhbHVlcykge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbmluXCIsIHZhbHVlcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBjb250YWluIGVhY2ggb25lIG9mIHRoZSBwcm92aWRlZCBsaXN0IG9mIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suICBUaGlzIGtleSdzIHZhbHVlIG11c3QgYmUgYW4gYXJyYXkuXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdGhhdCB3aWxsIG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgY29udGFpbnNBbGw6IGZ1bmN0aW9uKGtleSwgdmFsdWVzKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRhbGxcIiwgdmFsdWVzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB0aGF0IGNvbnRhaW4gdGhlIGdpdmVuIGtleS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCBzaG91bGQgZXhpc3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBleGlzdHM6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkZXhpc3RzXCIsIHRydWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB0aGF0IGRvIG5vdCBjb250YWluIGEgZ2l2ZW4ga2V5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHNob3VsZCBub3QgZXhpc3RcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGRvZXNOb3RFeGlzdDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRleGlzdHNcIiwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBjb25zdHJhaW50IGZvciBmaW5kaW5nIHN0cmluZyB2YWx1ZXMgdGhhdCBtYXRjaFxuICAgICAqIHRoZSBwcm92aWRlZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICogVGhpcyBtYXkgYmUgc2xvdyBmb3IgbGFyZ2UgZGF0YXNldHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIHN0cmluZyB0byBtYXRjaCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtSZWdFeHB9IHJlZ2V4IFRoZSByZWd1bGFyIGV4cHJlc3Npb24gcGF0dGVybiB0byBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG1hdGNoZXM6IGZ1bmN0aW9uKGtleSwgcmVnZXgsIG1vZGlmaWVycykge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkcmVnZXhcIiwgcmVnZXgpO1xuICAgICAgaWYgKCFtb2RpZmllcnMpIHsgbW9kaWZpZXJzID0gXCJcIjsgfVxuICAgICAgLy8gSmF2YXNjcmlwdCByZWdleCBvcHRpb25zIHN1cHBvcnQgbWlnIGFzIGlubGluZSBvcHRpb25zIGJ1dCBzdG9yZSB0aGVtIFxuICAgICAgLy8gYXMgcHJvcGVydGllcyBvZiB0aGUgb2JqZWN0LiBXZSBzdXBwb3J0IG1pICYgc2hvdWxkIG1pZ3JhdGUgdGhlbSB0b1xuICAgICAgLy8gbW9kaWZpZXJzXG4gICAgICBpZiAocmVnZXguaWdub3JlQ2FzZSkgeyBtb2RpZmllcnMgKz0gJ2knOyB9XG4gICAgICBpZiAocmVnZXgubXVsdGlsaW5lKSB7IG1vZGlmaWVycyArPSAnbSc7IH1cblxuICAgICAgaWYgKG1vZGlmaWVycyAmJiBtb2RpZmllcnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJG9wdGlvbnNcIiwgbW9kaWZpZXJzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRoYXQgcmVxdWlyZXMgdGhhdCBhIGtleSdzIHZhbHVlIG1hdGNoZXMgYSBQYXJzZS5RdWVyeVxuICAgICAqIGNvbnN0cmFpbnQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIGNvbnRhaW5zIHRoZSBvYmplY3QgdG8gbWF0Y2ggdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLlF1ZXJ5fSBxdWVyeSBUaGUgcXVlcnkgdGhhdCBzaG91bGQgbWF0Y2guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBtYXRjaGVzUXVlcnk6IGZ1bmN0aW9uKGtleSwgcXVlcnkpIHtcbiAgICAgIHZhciBxdWVyeUpTT04gPSBxdWVyeS50b0pTT04oKTtcbiAgICAgIHF1ZXJ5SlNPTi5jbGFzc05hbWUgPSBxdWVyeS5jbGFzc05hbWU7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRpblF1ZXJ5XCIsIHF1ZXJ5SlNPTik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRoYXQgcmVxdWlyZXMgdGhhdCBhIGtleSdzIHZhbHVlIG5vdCBtYXRjaGVzIGFcbiAgICAgKiBQYXJzZS5RdWVyeSBjb25zdHJhaW50LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBjb250YWlucyB0aGUgb2JqZWN0IHRvIG1hdGNoIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgcXVlcnkuXG4gICAgICogQHBhcmFtIHtQYXJzZS5RdWVyeX0gcXVlcnkgVGhlIHF1ZXJ5IHRoYXQgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGRvZXNOb3RNYXRjaFF1ZXJ5OiBmdW5jdGlvbihrZXksIHF1ZXJ5KSB7XG4gICAgICB2YXIgcXVlcnlKU09OID0gcXVlcnkudG9KU09OKCk7XG4gICAgICBxdWVyeUpTT04uY2xhc3NOYW1lID0gcXVlcnkuY2xhc3NOYW1lO1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbm90SW5RdWVyeVwiLCBxdWVyeUpTT04pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0aGF0IHJlcXVpcmVzIHRoYXQgYSBrZXkncyB2YWx1ZSBtYXRjaGVzIGEgdmFsdWUgaW5cbiAgICAgKiBhbiBvYmplY3QgcmV0dXJuZWQgYnkgYSBkaWZmZXJlbnQgUGFyc2UuUXVlcnkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIHRoYXQgaXMgYmVpbmdcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5S2V5IFRoZSBrZXkgaW4gdGhlIG9iamVjdHMgcmV0dXJuZWQgYnkgdGhlIHF1ZXJ5IHRvXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoIGFnYWluc3QuXG4gICAgICogQHBhcmFtIHtQYXJzZS5RdWVyeX0gcXVlcnkgVGhlIHF1ZXJ5IHRvIHJ1bi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG1hdGNoZXNLZXlJblF1ZXJ5OiBmdW5jdGlvbihrZXksIHF1ZXJ5S2V5LCBxdWVyeSkge1xuICAgICAgdmFyIHF1ZXJ5SlNPTiA9IHF1ZXJ5LnRvSlNPTigpO1xuICAgICAgcXVlcnlKU09OLmNsYXNzTmFtZSA9IHF1ZXJ5LmNsYXNzTmFtZTtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJHNlbGVjdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHsga2V5OiBxdWVyeUtleSwgcXVlcnk6IHF1ZXJ5SlNPTiB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRoYXQgcmVxdWlyZXMgdGhhdCBhIGtleSdzIHZhbHVlIG5vdCBtYXRjaCBhIHZhbHVlIGluXG4gICAgICogYW4gb2JqZWN0IHJldHVybmVkIGJ5IGEgZGlmZmVyZW50IFBhcnNlLlF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IGNvbnRhaW5zIHRoZSB2YWx1ZSB0aGF0IGlzIGJlaW5nXG4gICAgICogICAgICAgICAgICAgICAgICAgICBleGNsdWRlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnlLZXkgVGhlIGtleSBpbiB0aGUgb2JqZWN0cyByZXR1cm5lZCBieSB0aGUgcXVlcnkgdG9cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggYWdhaW5zdC5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLlF1ZXJ5fSBxdWVyeSBUaGUgcXVlcnkgdG8gcnVuLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZG9lc05vdE1hdGNoS2V5SW5RdWVyeTogZnVuY3Rpb24oa2V5LCBxdWVyeUtleSwgcXVlcnkpIHtcbiAgICAgIHZhciBxdWVyeUpTT04gPSBxdWVyeS50b0pTT04oKTtcbiAgICAgIHF1ZXJ5SlNPTi5jbGFzc05hbWUgPSBxdWVyeS5jbGFzc05hbWU7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRkb250U2VsZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgeyBrZXk6IHF1ZXJ5S2V5LCBxdWVyeTogcXVlcnlKU09OIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBjb25zdHJhaW50IHRoYXQgYXQgbGVhc3Qgb25lIG9mIHRoZSBwYXNzZWQgaW4gcXVlcmllcyBtYXRjaGVzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHF1ZXJpZXNcbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIF9vclF1ZXJ5OiBmdW5jdGlvbihxdWVyaWVzKSB7XG4gICAgICB2YXIgcXVlcnlKU09OID0gXy5tYXAocXVlcmllcywgZnVuY3Rpb24ocSkge1xuICAgICAgICByZXR1cm4gcS50b0pTT04oKS53aGVyZTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93aGVyZS4kb3IgPSBxdWVyeUpTT047XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSBzdHJpbmcgaW50byBhIHJlZ2V4IHRoYXQgbWF0Y2hlcyBpdC5cbiAgICAgKiBTdXJyb3VuZGluZyB3aXRoIFxcUSAuLiBcXEUgZG9lcyB0aGlzLCB3ZSBqdXN0IG5lZWQgdG8gZXNjYXBlIFxcRSdzIGluXG4gICAgICogdGhlIHRleHQgc2VwYXJhdGVseS5cbiAgICAgKi9cbiAgICBfcXVvdGU6IGZ1bmN0aW9uKHMpIHtcbiAgICAgIHJldHVybiBcIlxcXFxRXCIgKyBzLnJlcGxhY2UoXCJcXFxcRVwiLCBcIlxcXFxFXFxcXFxcXFxFXFxcXFFcIikgKyBcIlxcXFxFXCI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgc3RyaW5nIHZhbHVlcyB0aGF0IGNvbnRhaW4gYSBwcm92aWRlZFxuICAgICAqIHN0cmluZy4gIFRoaXMgbWF5IGJlIHNsb3cgZm9yIGxhcmdlIGRhdGFzZXRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBzdHJpbmcgdG8gbWF0Y2ggaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWJzdHJpbmcgVGhlIHN1YnN0cmluZyB0aGF0IHRoZSB2YWx1ZSBtdXN0IGNvbnRhaW4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBjb250YWluczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkcmVnZXhcIiwgdGhpcy5fcXVvdGUodmFsdWUpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IGZvciBmaW5kaW5nIHN0cmluZyB2YWx1ZXMgdGhhdCBzdGFydCB3aXRoIGEgcHJvdmlkZWRcbiAgICAgKiBzdHJpbmcuICBUaGlzIHF1ZXJ5IHdpbGwgdXNlIHRoZSBiYWNrZW5kIGluZGV4LCBzbyBpdCB3aWxsIGJlIGZhc3QgZXZlblxuICAgICAqIGZvciBsYXJnZSBkYXRhc2V0cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgc3RyaW5nIHRvIG1hdGNoIGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4IFRoZSBzdWJzdHJpbmcgdGhhdCB0aGUgdmFsdWUgbXVzdCBzdGFydCB3aXRoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgc3RhcnRzV2l0aDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkcmVnZXhcIiwgXCJeXCIgKyB0aGlzLl9xdW90ZSh2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgc3RyaW5nIHZhbHVlcyB0aGF0IGVuZCB3aXRoIGEgcHJvdmlkZWRcbiAgICAgKiBzdHJpbmcuICBUaGlzIHdpbGwgYmUgc2xvdyBmb3IgbGFyZ2UgZGF0YXNldHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIHN0cmluZyB0byBtYXRjaCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeCBUaGUgc3Vic3RyaW5nIHRoYXQgdGhlIHZhbHVlIG11c3QgZW5kIHdpdGguXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBlbmRzV2l0aDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkcmVnZXhcIiwgdGhpcy5fcXVvdGUodmFsdWUpICsgXCIkXCIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNvcnRzIHRoZSByZXN1bHRzIGluIGFzY2VuZGluZyBvcmRlciBieSB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7KFN0cmluZ3xTdHJpbmdbXXwuLi5TdHJpbmd9IGtleSBUaGUga2V5IHRvIG9yZGVyIGJ5LCB3aGljaCBpcyBhIFxuICAgICAqIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgdmFsdWVzLCBvciBhbiBBcnJheSBvZiBrZXlzLCBvciBtdWx0aXBsZSBrZXlzLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgYXNjZW5kaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgICByZXR1cm4gdGhpcy5hZGRBc2NlbmRpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU29ydHMgdGhlIHJlc3VsdHMgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSBnaXZlbiBrZXksIFxuICAgICAqIGJ1dCBjYW4gYWxzbyBhZGQgc2Vjb25kYXJ5IHNvcnQgZGVzY3JpcHRvcnMgd2l0aG91dCBvdmVyd3JpdGluZyBfb3JkZXIuXG4gICAgICogXG4gICAgICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdfC4uLlN0cmluZ30ga2V5IFRoZSBrZXkgdG8gb3JkZXIgYnksIHdoaWNoIGlzIGFcbiAgICAgKiBzdHJpbmcgb2YgY29tbWEgc2VwYXJhdGVkIHZhbHVlcywgb3IgYW4gQXJyYXkgb2Yga2V5cywgb3IgbXVsdGlwbGUga2V5cy5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGFkZEFzY2VuZGluZzogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7IFxuICAgICAgaWYgKCF0aGlzLl9vcmRlcikge1xuICAgICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgfVxuICAgICAgUGFyc2UuX2FycmF5RWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5LmpvaW4oKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9vcmRlciA9IHNlbGYuX29yZGVyLmNvbmNhdChrZXkucmVwbGFjZSgvXFxzL2csIFwiXCIpLnNwbGl0KFwiLFwiKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgcmVzdWx0cyBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSBnaXZlbiBrZXkuXG4gICAgICogXG4gICAgICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdfC4uLlN0cmluZ30ga2V5IFRoZSBrZXkgdG8gb3JkZXIgYnksIHdoaWNoIGlzIGFcbiAgICAgKiBzdHJpbmcgb2YgY29tbWEgc2VwYXJhdGVkIHZhbHVlcywgb3IgYW4gQXJyYXkgb2Yga2V5cywgb3IgbXVsdGlwbGUga2V5cy5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGRlc2NlbmRpbmc6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgIHJldHVybiB0aGlzLmFkZERlc2NlbmRpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU29ydHMgdGhlIHJlc3VsdHMgaW4gZGVzY2VuZGluZyBvcmRlciBieSB0aGUgZ2l2ZW4ga2V5LFxuICAgICAqIGJ1dCBjYW4gYWxzbyBhZGQgc2Vjb25kYXJ5IHNvcnQgZGVzY3JpcHRvcnMgd2l0aG91dCBvdmVyd3JpdGluZyBfb3JkZXIuXG4gICAgICogXG4gICAgICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdfC4uLlN0cmluZ30ga2V5IFRoZSBrZXkgdG8gb3JkZXIgYnksIHdoaWNoIGlzIGFcbiAgICAgKiBzdHJpbmcgb2YgY29tbWEgc2VwYXJhdGVkIHZhbHVlcywgb3IgYW4gQXJyYXkgb2Yga2V5cywgb3IgbXVsdGlwbGUga2V5cy5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGFkZERlc2NlbmRpbmc6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzOyBcbiAgICAgIGlmICghdGhpcy5fb3JkZXIpIHtcbiAgICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgIH1cbiAgICAgIFBhcnNlLl9hcnJheUVhY2goYXJndW1lbnRzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleS5qb2luKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fb3JkZXIgPSBzZWxmLl9vcmRlci5jb25jYXQoXG4gICAgICAgICAgXy5tYXAoa2V5LnJlcGxhY2UoL1xccy9nLCBcIlwiKS5zcGxpdChcIixcIiksIFxuICAgICAgICAgICAgZnVuY3Rpb24oaykgeyByZXR1cm4gXCItXCIgKyBrOyB9KSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm94aW1pdHkgYmFzZWQgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHdpdGgga2V5IHBvaW50XG4gICAgICogdmFsdWVzIG5lYXIgdGhlIHBvaW50IGdpdmVuLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBQYXJzZS5HZW9Qb2ludCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgVGhlIHJlZmVyZW5jZSBQYXJzZS5HZW9Qb2ludCB0aGF0IGlzIHVzZWQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBuZWFyOiBmdW5jdGlvbihrZXksIHBvaW50KSB7XG4gICAgICBpZiAoIShwb2ludCBpbnN0YW5jZW9mIFBhcnNlLkdlb1BvaW50KSkge1xuICAgICAgICAvLyBUcnkgdG8gY2FzdCBpdCB0byBhIEdlb1BvaW50LCBzbyB0aGF0IG5lYXIoXCJsb2NcIiwgWzIwLDMwXSkgd29ya3MuXG4gICAgICAgIHBvaW50ID0gbmV3IFBhcnNlLkdlb1BvaW50KHBvaW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJG5lYXJTcGhlcmVcIiwgcG9pbnQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3hpbWl0eSBiYXNlZCBjb25zdHJhaW50IGZvciBmaW5kaW5nIG9iamVjdHMgd2l0aCBrZXkgcG9pbnRcbiAgICAgKiB2YWx1ZXMgbmVhciB0aGUgcG9pbnQgZ2l2ZW4gYW5kIHdpdGhpbiB0aGUgbWF4aW11bSBkaXN0YW5jZSBnaXZlbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgUGFyc2UuR2VvUG9pbnQgaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IFRoZSByZWZlcmVuY2UgUGFyc2UuR2VvUG9pbnQgdGhhdCBpcyB1c2VkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhEaXN0YW5jZSBNYXhpbXVtIGRpc3RhbmNlIChpbiByYWRpYW5zKSBvZiByZXN1bHRzIHRvXG4gICAgICogICByZXR1cm4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICB3aXRoaW5SYWRpYW5zOiBmdW5jdGlvbihrZXksIHBvaW50LCBkaXN0YW5jZSkge1xuICAgICAgdGhpcy5uZWFyKGtleSwgcG9pbnQpO1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbWF4RGlzdGFuY2VcIiwgZGlzdGFuY2UpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3hpbWl0eSBiYXNlZCBjb25zdHJhaW50IGZvciBmaW5kaW5nIG9iamVjdHMgd2l0aCBrZXkgcG9pbnRcbiAgICAgKiB2YWx1ZXMgbmVhciB0aGUgcG9pbnQgZ2l2ZW4gYW5kIHdpdGhpbiB0aGUgbWF4aW11bSBkaXN0YW5jZSBnaXZlbi5cbiAgICAgKiBSYWRpdXMgb2YgZWFydGggdXNlZCBpcyAzOTU4LjggbWlsZXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIFBhcnNlLkdlb1BvaW50IGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCBUaGUgcmVmZXJlbmNlIFBhcnNlLkdlb1BvaW50IHRoYXQgaXMgdXNlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbWF4RGlzdGFuY2UgTWF4aW11bSBkaXN0YW5jZSAoaW4gbWlsZXMpIG9mIHJlc3VsdHMgdG9cbiAgICAgKiAgICAgcmV0dXJuLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgd2l0aGluTWlsZXM6IGZ1bmN0aW9uKGtleSwgcG9pbnQsIGRpc3RhbmNlKSB7XG4gICAgICByZXR1cm4gdGhpcy53aXRoaW5SYWRpYW5zKGtleSwgcG9pbnQsIGRpc3RhbmNlIC8gMzk1OC44KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJveGltaXR5IGJhc2VkIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB3aXRoIGtleSBwb2ludFxuICAgICAqIHZhbHVlcyBuZWFyIHRoZSBwb2ludCBnaXZlbiBhbmQgd2l0aGluIHRoZSBtYXhpbXVtIGRpc3RhbmNlIGdpdmVuLlxuICAgICAqIFJhZGl1cyBvZiBlYXJ0aCB1c2VkIGlzIDYzNzEuMCBraWxvbWV0ZXJzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBQYXJzZS5HZW9Qb2ludCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgVGhlIHJlZmVyZW5jZSBQYXJzZS5HZW9Qb2ludCB0aGF0IGlzIHVzZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG1heERpc3RhbmNlIE1heGltdW0gZGlzdGFuY2UgKGluIGtpbG9tZXRlcnMpIG9mIHJlc3VsdHNcbiAgICAgKiAgICAgdG8gcmV0dXJuLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgd2l0aGluS2lsb21ldGVyczogZnVuY3Rpb24oa2V5LCBwb2ludCwgZGlzdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLndpdGhpblJhZGlhbnMoa2V5LCBwb2ludCwgZGlzdGFuY2UgLyA2MzcxLjApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXknc1xuICAgICAqIGNvb3JkaW5hdGVzIGJlIGNvbnRhaW5lZCB3aXRoaW4gYSBnaXZlbiByZWN0YW5ndWxhciBnZW9ncmFwaGljIGJvdW5kaW5nXG4gICAgICogYm94LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBiZSBjb25zdHJhaW5lZC5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBzb3V0aHdlc3RcbiAgICAgKiAgICAgVGhlIGxvd2VyLWxlZnQgaW5jbHVzaXZlIGNvcm5lciBvZiB0aGUgYm94LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IG5vcnRoZWFzdFxuICAgICAqICAgICBUaGUgdXBwZXItcmlnaHQgaW5jbHVzaXZlIGNvcm5lciBvZiB0aGUgYm94LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgd2l0aGluR2VvQm94OiBmdW5jdGlvbihrZXksIHNvdXRod2VzdCwgbm9ydGhlYXN0KSB7XG4gICAgICBpZiAoIShzb3V0aHdlc3QgaW5zdGFuY2VvZiBQYXJzZS5HZW9Qb2ludCkpIHtcbiAgICAgICAgc291dGh3ZXN0ID0gbmV3IFBhcnNlLkdlb1BvaW50KHNvdXRod2VzdCk7XG4gICAgICB9XG4gICAgICBpZiAoIShub3J0aGVhc3QgaW5zdGFuY2VvZiBQYXJzZS5HZW9Qb2ludCkpIHtcbiAgICAgICAgbm9ydGhlYXN0ID0gbmV3IFBhcnNlLkdlb1BvaW50KG5vcnRoZWFzdCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCAnJHdpdGhpbicsIHsgJyRib3gnOiBbc291dGh3ZXN0LCBub3J0aGVhc3RdIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluY2x1ZGUgbmVzdGVkIFBhcnNlLk9iamVjdHMgZm9yIHRoZSBwcm92aWRlZCBrZXkuICBZb3UgY2FuIHVzZSBkb3RcbiAgICAgKiBub3RhdGlvbiB0byBzcGVjaWZ5IHdoaWNoIGZpZWxkcyBpbiB0aGUgaW5jbHVkZWQgb2JqZWN0IGFyZSBhbHNvIGZldGNoZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgbmFtZSBvZiB0aGUga2V5IHRvIGluY2x1ZGUuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBpbmNsdWRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9hcnJheUVhY2goYXJndW1lbnRzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgc2VsZi5faW5jbHVkZSA9IHNlbGYuX2luY2x1ZGUuY29uY2F0KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5faW5jbHVkZS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlc3RyaWN0IHRoZSBmaWVsZHMgb2YgdGhlIHJldHVybmVkIFBhcnNlLk9iamVjdHMgdG8gaW5jbHVkZSBvbmx5IHRoZVxuICAgICAqIHByb3ZpZGVkIGtleXMuICBJZiB0aGlzIGlzIGNhbGxlZCBtdWx0aXBsZSB0aW1lcywgdGhlbiBhbGwgb2YgdGhlIGtleXNcbiAgICAgKiBzcGVjaWZpZWQgaW4gZWFjaCBvZiB0aGUgY2FsbHMgd2lsbCBiZSBpbmNsdWRlZC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIFRoZSBuYW1lcyBvZiB0aGUga2V5cyB0byBpbmNsdWRlLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgc2VsZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuX3NlbGVjdCA9IHRoaXMuX3NlbGVjdCB8fCBbXTtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2goYXJndW1lbnRzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgc2VsZi5fc2VsZWN0ID0gc2VsZi5fc2VsZWN0LmNvbmNhdChrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuX3NlbGVjdC5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIG92ZXIgZWFjaCByZXN1bHQgb2YgYSBxdWVyeSwgY2FsbGluZyBhIGNhbGxiYWNrIGZvciBlYWNoIG9uZS4gSWZcbiAgICAgKiB0aGUgY2FsbGJhY2sgcmV0dXJucyBhIHByb21pc2UsIHRoZSBpdGVyYXRpb24gd2lsbCBub3QgY29udGludWUgdW50aWxcbiAgICAgKiB0aGF0IHByb21pc2UgaGFzIGJlZW4gZnVsZmlsbGVkLiBJZiB0aGUgY2FsbGJhY2sgcmV0dXJucyBhIHJlamVjdGVkXG4gICAgICogcHJvbWlzZSwgdGhlbiBpdGVyYXRpb24gd2lsbCBzdG9wIHdpdGggdGhhdCBlcnJvci4gVGhlIGl0ZW1zIGFyZVxuICAgICAqIHByb2Nlc3NlZCBpbiBhbiB1bnNwZWNpZmllZCBvcmRlci4gVGhlIHF1ZXJ5IG1heSBub3QgaGF2ZSBhbnkgc29ydCBvcmRlcixcbiAgICAgKiBhbmQgbWF5IG5vdCB1c2UgbGltaXQgb3Igc2tpcC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggZWFjaCByZXN1bHRcbiAgICAgKiAgICAgb2YgdGhlIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9wdGlvbmFsIEJhY2tib25lLWxpa2Ugb3B0aW9ucyBvYmplY3Qgd2l0aFxuICAgICAqICAgICBzdWNjZXNzIGFuZCBlcnJvciBjYWxsYmFja3MgdGhhdCB3aWxsIGJlIGludm9rZWQgb25jZSB0aGUgaXRlcmF0aW9uXG4gICAgICogICAgIGhhcyBmaW5pc2hlZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCBvbmNlIHRoZVxuICAgICAqICAgICBpdGVyYXRpb24gaGFzIGNvbXBsZXRlZC5cbiAgICAgKi9cbiAgICBlYWNoOiBmdW5jdGlvbihjYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlmICh0aGlzLl9vcmRlciB8fCB0aGlzLl9za2lwIHx8ICh0aGlzLl9saW1pdCA+PSAwKSkge1xuICAgICAgICB2YXIgZXJyb3IgPVxuICAgICAgICAgIFwiQ2Fubm90IGl0ZXJhdGUgb24gYSBxdWVyeSB3aXRoIHNvcnQsIHNraXAsIG9yIGxpbWl0LlwiO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcikuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcblxuICAgICAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KHRoaXMub2JqZWN0Q2xhc3MpO1xuICAgICAgLy8gV2UgY2FuIG92ZXJyaWRlIHRoZSBiYXRjaCBzaXplIGZyb20gdGhlIG9wdGlvbnMuXG4gICAgICAvLyBUaGlzIGlzIHVuZG9jdW1lbnRlZCwgYnV0IHVzZWZ1bCBmb3IgdGVzdGluZy5cbiAgICAgIHF1ZXJ5Ll9saW1pdCA9IG9wdGlvbnMuYmF0Y2hTaXplIHx8IDEwMDtcbiAgICAgIHF1ZXJ5Ll93aGVyZSA9IF8uY2xvbmUodGhpcy5fd2hlcmUpO1xuICAgICAgcXVlcnkuX2luY2x1ZGUgPSBfLmNsb25lKHRoaXMuX2luY2x1ZGUpO1xuICAgICAgaWYgKHRoaXMuX3NlbGVjdCkge1xuICAgICAgICBxdWVyeS5fc2VsZWN0ID0gXy5jbG9uZSh0aGlzLl9zZWxlY3QpO1xuICAgICAgfVxuXG4gICAgICBxdWVyeS5hc2NlbmRpbmcoJ29iamVjdElkJyk7XG5cbiAgICAgIHZhciBmaW5kT3B0aW9ucyA9IHt9O1xuICAgICAgaWYgKF8uaGFzKG9wdGlvbnMsIFwidXNlTWFzdGVyS2V5XCIpKSB7XG4gICAgICAgIGZpbmRPcHRpb25zLnVzZU1hc3RlcktleSA9IG9wdGlvbnMudXNlTWFzdGVyS2V5O1xuICAgICAgfVxuXG4gICAgICB2YXIgZmluaXNoZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLl9jb250aW51ZVdoaWxlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIWZpbmlzaGVkO1xuXG4gICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5LmZpbmQoZmluZE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgIHZhciBjYWxsYmFja3NEb25lID0gUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgICAgICAgIFBhcnNlLl8uZWFjaChyZXN1bHRzLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrc0RvbmUgPSBjYWxsYmFja3NEb25lLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2tzRG9uZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID49IHF1ZXJ5Ll9saW1pdCkge1xuICAgICAgICAgICAgICBxdWVyeS5ncmVhdGVyVGhhbihcIm9iamVjdElkXCIsIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGggLSAxXS5pZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG59KHRoaXMpKTtcblxuLypnbG9iYWwgRkI6IGZhbHNlICwgY29uc29sZTogZmFsc2UqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICB2YXIgUFVCTElDX0tFWSA9IFwiKlwiO1xuXG4gIHZhciBpbml0aWFsaXplZCA9IGZhbHNlO1xuICB2YXIgcmVxdWVzdGVkUGVybWlzc2lvbnM7XG4gIHZhciBpbml0T3B0aW9ucztcbiAgdmFyIHByb3ZpZGVyID0ge1xuICAgIGF1dGhlbnRpY2F0ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgRkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhzZWxmLCB7XG4gICAgICAgICAgICAgIGlkOiByZXNwb25zZS5hdXRoUmVzcG9uc2UudXNlcklELFxuICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbl9kYXRlOiBuZXcgRGF0ZShyZXNwb25zZS5hdXRoUmVzcG9uc2UuZXhwaXJlc0luICogMTAwMCArXG4gICAgICAgICAgICAgICAgICAobmV3IERhdGUoKSkuZ2V0VGltZSgpKS50b0pTT04oKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICBvcHRpb25zLmVycm9yKHNlbGYsIHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgc2NvcGU6IHJlcXVlc3RlZFBlcm1pc3Npb25zXG4gICAgICB9KTtcbiAgICB9LFxuICAgIHJlc3RvcmVBdXRoZW50aWNhdGlvbjogZnVuY3Rpb24oYXV0aERhdGEpIHtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICB2YXIgYXV0aFJlc3BvbnNlID0ge1xuICAgICAgICAgIHVzZXJJRDogYXV0aERhdGEuaWQsXG4gICAgICAgICAgYWNjZXNzVG9rZW46IGF1dGhEYXRhLmFjY2Vzc190b2tlbixcbiAgICAgICAgICBleHBpcmVzSW46IChQYXJzZS5fcGFyc2VEYXRlKGF1dGhEYXRhLmV4cGlyYXRpb25fZGF0ZSkuZ2V0VGltZSgpIC1cbiAgICAgICAgICAgICAgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkgLyAxMDAwXG4gICAgICAgIH07XG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShpbml0T3B0aW9ucyk7XG4gICAgICAgIG5ld09wdGlvbnMuYXV0aFJlc3BvbnNlID0gYXV0aFJlc3BvbnNlO1xuXG4gICAgICAgIC8vIFN1cHByZXNzIGNoZWNrcyBmb3IgbG9naW4gc3RhdHVzIGZyb20gdGhlIGJyb3dzZXIuXG4gICAgICAgIG5ld09wdGlvbnMuc3RhdHVzID0gZmFsc2U7XG5cbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgZG9lc24ndCBtYXRjaCB0aGUgb25lIGtub3duIGJ5IHRoZSBGQiBTREssIGxvZyBvdXQuXG4gICAgICAgIC8vIE1vc3Qgb2YgdGhlIHRpbWUsIHRoZSB1c2VycyB3aWxsIG1hdGNoIC0tIGl0J3Mgb25seSBpbiBjYXNlcyB3aGVyZVxuICAgICAgICAvLyB0aGUgRkIgU0RLIGtub3dzIG9mIGEgZGlmZmVyZW50IHVzZXIgdGhhbiB0aGUgb25lIGJlaW5nIHJlc3RvcmVkXG4gICAgICAgIC8vIGZyb20gYSBQYXJzZSBVc2VyIHRoYXQgbG9nZ2VkIGluIHdpdGggdXNlcm5hbWUvcGFzc3dvcmQuXG4gICAgICAgIHZhciBleGlzdGluZ1Jlc3BvbnNlID0gRkIuZ2V0QXV0aFJlc3BvbnNlKCk7XG4gICAgICAgIGlmIChleGlzdGluZ1Jlc3BvbnNlICYmXG4gICAgICAgICAgICBleGlzdGluZ1Jlc3BvbnNlLnVzZXJJRCAhPT0gYXV0aFJlc3BvbnNlLnVzZXJJRCkge1xuICAgICAgICAgIEZCLmxvZ291dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgRkIuaW5pdChuZXdPcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZ2V0QXV0aFR5cGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFwiZmFjZWJvb2tcIjtcbiAgICB9LFxuICAgIGRlYXV0aGVudGljYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucmVzdG9yZUF1dGhlbnRpY2F0aW9uKG51bGwpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBzZXQgb2YgdXRpbGl0aWVzIGZvciB1c2luZyBQYXJzZSB3aXRoIEZhY2Vib29rLlxuICAgKiBAbmFtZXNwYWNlXG4gICAqIFByb3ZpZGVzIGEgc2V0IG9mIHV0aWxpdGllcyBmb3IgdXNpbmcgUGFyc2Ugd2l0aCBGYWNlYm9vay5cbiAgICovXG4gIFBhcnNlLkZhY2Vib29rVXRpbHMgPSB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgUGFyc2UgRmFjZWJvb2sgaW50ZWdyYXRpb24uICBDYWxsIHRoaXMgZnVuY3Rpb24gYWZ0ZXIgeW91XG4gICAgICogaGF2ZSBsb2FkZWQgdGhlIEZhY2Vib29rIEphdmFzY3JpcHQgU0RLIHdpdGggdGhlIHNhbWUgcGFyYW1ldGVyc1xuICAgICAqIGFzIHlvdSB3b3VsZCBwYXNzIHRvPGNvZGU+XG4gICAgICogPGEgaHJlZj1cbiAgICAgKiBcImh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9yZWZlcmVuY2UvamF2YXNjcmlwdC9GQi5pbml0L1wiPlxuICAgICAqIEZCLmluaXQoKTwvYT48L2NvZGU+LiAgUGFyc2UuRmFjZWJvb2tVdGlscyB3aWxsIGludm9rZSBGQi5pbml0KCkgZm9yIHlvdVxuICAgICAqIHdpdGggdGhlc2UgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgRmFjZWJvb2sgb3B0aW9ucyBhcmd1bWVudCBhcyBkZXNjcmliZWQgaGVyZTpcbiAgICAgKiAgIDxhIGhyZWY9XG4gICAgICogICBcImh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9yZWZlcmVuY2UvamF2YXNjcmlwdC9GQi5pbml0L1wiPlxuICAgICAqICAgRkIuaW5pdCgpPC9hPi4gVGhlIHN0YXR1cyBmbGFnIHdpbGwgYmUgY29lcmNlZCB0byAnZmFsc2UnIGJlY2F1c2UgaXRcbiAgICAgKiAgIGludGVyZmVyZXMgd2l0aCBQYXJzZSBGYWNlYm9vayBpbnRlZ3JhdGlvbi4gQ2FsbCBGQi5nZXRMb2dpblN0YXR1cygpXG4gICAgICogICBleHBsaWNpdGx5IGlmIHRoaXMgYmVoYXZpb3IgaXMgcmVxdWlyZWQgYnkgeW91ciBhcHBsaWNhdGlvbi5cbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBpZiAodHlwZW9mKEZCKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgXCJUaGUgRmFjZWJvb2sgSmF2YVNjcmlwdCBTREsgbXVzdCBiZSBsb2FkZWQgYmVmb3JlIGNhbGxpbmcgaW5pdC5cIjtcbiAgICAgIH0gXG4gICAgICBpbml0T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICBpZiAoaW5pdE9wdGlvbnMuc3RhdHVzICYmIHR5cGVvZihjb25zb2xlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB2YXIgd2FybiA9IGNvbnNvbGUud2FybiB8fCBjb25zb2xlLmxvZyB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgICB3YXJuLmNhbGwoY29uc29sZSwgXCJUaGUgJ3N0YXR1cycgZmxhZyBwYXNzZWQgaW50b1wiICtcbiAgICAgICAgICBcIiBGQi5pbml0LCB3aGVuIHNldCB0byB0cnVlLCBjYW4gaW50ZXJmZXJlIHdpdGggUGFyc2UgRmFjZWJvb2tcIiArXG4gICAgICAgICAgXCIgaW50ZWdyYXRpb24sIHNvIGl0IGhhcyBiZWVuIHN1cHByZXNzZWQuIFBsZWFzZSBjYWxsXCIgK1xuICAgICAgICAgIFwiIEZCLmdldExvZ2luU3RhdHVzKCkgZXhwbGljaXRseSBpZiB5b3UgcmVxdWlyZSB0aGlzIGJlaGF2aW9yLlwiKTtcbiAgICAgIH1cbiAgICAgIGluaXRPcHRpb25zLnN0YXR1cyA9IGZhbHNlO1xuICAgICAgRkIuaW5pdChpbml0T3B0aW9ucyk7XG4gICAgICBQYXJzZS5Vc2VyLl9yZWdpc3RlckF1dGhlbnRpY2F0aW9uUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIHVzZXIgaGFzIHRoZWlyIGFjY291bnQgbGlua2VkIHRvIEZhY2Vib29rLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7UGFyc2UuVXNlcn0gdXNlciBVc2VyIHRvIGNoZWNrIGZvciBhIGZhY2Vib29rIGxpbmsuXG4gICAgICogICAgIFRoZSB1c2VyIG11c3QgYmUgbG9nZ2VkIGluIG9uIHRoaXMgZGV2aWNlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSB1c2VyIGhhcyB0aGVpciBhY2NvdW50XG4gICAgICogICAgIGxpbmtlZCB0byBGYWNlYm9vay5cbiAgICAgKi9cbiAgICBpc0xpbmtlZDogZnVuY3Rpb24odXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIuX2lzTGlua2VkKFwiZmFjZWJvb2tcIik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3MgaW4gYSB1c2VyIHVzaW5nIEZhY2Vib29rLiBUaGlzIG1ldGhvZCBkZWxlZ2F0ZXMgdG8gdGhlIEZhY2Vib29rXG4gICAgICogU0RLIHRvIGF1dGhlbnRpY2F0ZSB0aGUgdXNlciwgYW5kIHRoZW4gYXV0b21hdGljYWxseSBsb2dzIGluIChvclxuICAgICAqIGNyZWF0ZXMsIGluIHRoZSBjYXNlIHdoZXJlIGl0IGlzIGEgbmV3IHVzZXIpIGEgUGFyc2UuVXNlci5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZywgT2JqZWN0fSBwZXJtaXNzaW9ucyBUaGUgcGVybWlzc2lvbnMgcmVxdWlyZWQgZm9yIEZhY2Vib29rXG4gICAgICogICAgbG9nIGluLiAgVGhpcyBpcyBhIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgb2YgcGVybWlzc2lvbnMuXG4gICAgICogICAgQWx0ZXJuYXRpdmVseSwgc3VwcGx5IGEgRmFjZWJvb2sgYXV0aERhdGEgb2JqZWN0IGFzIGRlc2NyaWJlZCBpbiBvdXJcbiAgICAgKiAgICBSRVNUIEFQSSBkb2NzIGlmIHlvdSB3YW50IHRvIGhhbmRsZSBnZXR0aW5nIGZhY2Vib29rIGF1dGggdG9rZW5zXG4gICAgICogICAgeW91cnNlbGYuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU3RhbmRhcmQgb3B0aW9ucyBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvclxuICAgICAqICAgIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBsb2dJbjogZnVuY3Rpb24ocGVybWlzc2lvbnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghcGVybWlzc2lvbnMgfHwgXy5pc1N0cmluZyhwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgICAgICAgIHRocm93IFwiWW91IG11c3QgaW5pdGlhbGl6ZSBGYWNlYm9va1V0aWxzIGJlZm9yZSBjYWxsaW5nIGxvZ0luLlwiO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RlZFBlcm1pc3Npb25zID0gcGVybWlzc2lvbnM7XG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9sb2dJbldpdGgoXCJmYWNlYm9va1wiLCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgICAgbmV3T3B0aW9ucy5hdXRoRGF0YSA9IHBlcm1pc3Npb25zO1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fbG9nSW5XaXRoKFwiZmFjZWJvb2tcIiwgbmV3T3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpbmtzIEZhY2Vib29rIHRvIGFuIGV4aXN0aW5nIFBGVXNlci4gVGhpcyBtZXRob2QgZGVsZWdhdGVzIHRvIHRoZVxuICAgICAqIEZhY2Vib29rIFNESyB0byBhdXRoZW50aWNhdGUgdGhlIHVzZXIsIGFuZCB0aGVuIGF1dG9tYXRpY2FsbHkgbGlua3NcbiAgICAgKiB0aGUgYWNjb3VudCB0byB0aGUgUGFyc2UuVXNlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGFyc2UuVXNlcn0gdXNlciBVc2VyIHRvIGxpbmsgdG8gRmFjZWJvb2suIFRoaXMgbXVzdCBiZSB0aGVcbiAgICAgKiAgICAgY3VycmVudCB1c2VyLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nLCBPYmplY3R9IHBlcm1pc3Npb25zIFRoZSBwZXJtaXNzaW9ucyByZXF1aXJlZCBmb3IgRmFjZWJvb2tcbiAgICAgKiAgICBsb2cgaW4uICBUaGlzIGlzIGEgY29tbWEtc2VwYXJhdGVkIHN0cmluZyBvZiBwZXJtaXNzaW9ucy4gXG4gICAgICogICAgQWx0ZXJuYXRpdmVseSwgc3VwcGx5IGEgRmFjZWJvb2sgYXV0aERhdGEgb2JqZWN0IGFzIGRlc2NyaWJlZCBpbiBvdXJcbiAgICAgKiAgICBSRVNUIEFQSSBkb2NzIGlmIHlvdSB3YW50IHRvIGhhbmRsZSBnZXR0aW5nIGZhY2Vib29rIGF1dGggdG9rZW5zXG4gICAgICogICAgeW91cnNlbGYuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU3RhbmRhcmQgb3B0aW9ucyBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvclxuICAgICAqICAgIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBsaW5rOiBmdW5jdGlvbih1c2VyLCBwZXJtaXNzaW9ucywgb3B0aW9ucykge1xuICAgICAgaWYgKCFwZXJtaXNzaW9ucyB8fCBfLmlzU3RyaW5nKHBlcm1pc3Npb25zKSkge1xuICAgICAgICBpZiAoIWluaXRpYWxpemVkKSB7XG4gICAgICAgICAgdGhyb3cgXCJZb3UgbXVzdCBpbml0aWFsaXplIEZhY2Vib29rVXRpbHMgYmVmb3JlIGNhbGxpbmcgbGluay5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0ZWRQZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zO1xuICAgICAgICByZXR1cm4gdXNlci5fbGlua1dpdGgoXCJmYWNlYm9va1wiLCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgICAgbmV3T3B0aW9ucy5hdXRoRGF0YSA9IHBlcm1pc3Npb25zO1xuICAgICAgICByZXR1cm4gdXNlci5fbGlua1dpdGgoXCJmYWNlYm9va1wiLCBuZXdPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5saW5rcyB0aGUgUGFyc2UuVXNlciBmcm9tIGEgRmFjZWJvb2sgYWNjb3VudC4gXG4gICAgICogXG4gICAgICogQHBhcmFtIHtQYXJzZS5Vc2VyfSB1c2VyIFVzZXIgdG8gdW5saW5rIGZyb20gRmFjZWJvb2suIFRoaXMgbXVzdCBiZSB0aGVcbiAgICAgKiAgICAgY3VycmVudCB1c2VyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFN0YW5kYXJkIG9wdGlvbnMgb2JqZWN0IHdpdGggc3VjY2VzcyBhbmQgZXJyb3JcbiAgICAgKiAgICBjYWxsYmFja3MuXG4gICAgICovXG4gICAgdW5saW5rOiBmdW5jdGlvbih1c2VyLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIWluaXRpYWxpemVkKSB7XG4gICAgICAgIHRocm93IFwiWW91IG11c3QgaW5pdGlhbGl6ZSBGYWNlYm9va1V0aWxzIGJlZm9yZSBjYWxsaW5nIHVubGluay5cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1c2VyLl91bmxpbmtGcm9tKFwiZmFjZWJvb2tcIiwgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xuICBcbn0odGhpcykpO1xuXG4vKmdsb2JhbCBfOiBmYWxzZSwgZG9jdW1lbnQ6IGZhbHNlLCB3aW5kb3c6IGZhbHNlLCBuYXZpZ2F0b3I6IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBIaXN0b3J5IHNlcnZlcyBhcyBhIGdsb2JhbCByb3V0ZXIgKHBlciBmcmFtZSkgdG8gaGFuZGxlIGhhc2hjaGFuZ2VcbiAgICogZXZlbnRzIG9yIHB1c2hTdGF0ZSwgbWF0Y2ggdGhlIGFwcHJvcHJpYXRlIHJvdXRlLCBhbmQgdHJpZ2dlclxuICAgKiBjYWxsYmFja3MuIFlvdSBzaG91bGRuJ3QgZXZlciBoYXZlIHRvIGNyZWF0ZSBvbmUgb2YgdGhlc2UgeW91cnNlbGZcbiAgICog4oCUIHlvdSBzaG91bGQgdXNlIHRoZSByZWZlcmVuY2UgdG8gPGNvZGU+UGFyc2UuaGlzdG9yeTwvY29kZT5cbiAgICogdGhhdCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHlvdSBhdXRvbWF0aWNhbGx5IGlmIHlvdSBtYWtlIHVzZSBvZiBcbiAgICogUm91dGVycyB3aXRoIHJvdXRlcy5cbiAgICogQGNsYXNzXG4gICAqICAgXG4gICAqIDxwPkEgZm9yayBvZiBCYWNrYm9uZS5IaXN0b3J5LCBwcm92aWRlZCBmb3IgeW91ciBjb252ZW5pZW5jZS4gIElmIHlvdSBcbiAgICogdXNlIHRoaXMgY2xhc3MsIHlvdSBtdXN0IGFsc28gaW5jbHVkZSBqUXVlcnksIG9yIGFub3RoZXIgbGlicmFyeSBcbiAgICogdGhhdCBwcm92aWRlcyBhIGpRdWVyeS1jb21wYXRpYmxlICQgZnVuY3Rpb24uICBGb3IgbW9yZSBpbmZvcm1hdGlvbixcbiAgICogc2VlIHRoZSA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jSGlzdG9yeVwiPlxuICAgKiBCYWNrYm9uZSBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqIDxwPjxzdHJvbmc+PGVtPkF2YWlsYWJsZSBpbiB0aGUgY2xpZW50IFNESyBvbmx5LjwvZW0+PC9zdHJvbmc+PC9wPlxuICAgKi9cbiAgUGFyc2UuSGlzdG9yeSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgICBfLmJpbmRBbGwodGhpcywgJ2NoZWNrVXJsJyk7XG4gIH07XG5cbiAgLy8gQ2FjaGVkIHJlZ2V4IGZvciBjbGVhbmluZyBsZWFkaW5nIGhhc2hlcyBhbmQgc2xhc2hlcyAuXG4gIHZhciByb3V0ZVN0cmlwcGVyID0gL15bI1xcL10vO1xuXG4gIC8vIENhY2hlZCByZWdleCBmb3IgZGV0ZWN0aW5nIE1TSUUuXG4gIHZhciBpc0V4cGxvcmVyID0gL21zaWUgW1xcdy5dKy87XG5cbiAgLy8gSGFzIHRoZSBoaXN0b3J5IGhhbmRsaW5nIGFscmVhZHkgYmVlbiBzdGFydGVkP1xuICBQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAvLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqUGFyc2UuSGlzdG9yeSoqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKFBhcnNlLkhpc3RvcnkucHJvdG90eXBlLCBQYXJzZS5FdmVudHMsXG4gICAgICAgICAgIC8qKiBAbGVuZHMgUGFyc2UuSGlzdG9yeS5wcm90b3R5cGUgKi8ge1xuXG4gICAgLy8gVGhlIGRlZmF1bHQgaW50ZXJ2YWwgdG8gcG9sbCBmb3IgaGFzaCBjaGFuZ2VzLCBpZiBuZWNlc3NhcnksIGlzXG4gICAgLy8gdHdlbnR5IHRpbWVzIGEgc2Vjb25kLlxuICAgIGludGVydmFsOiA1MCxcblxuICAgIC8vIEdldHMgdGhlIHRydWUgaGFzaCB2YWx1ZS4gQ2Fubm90IHVzZSBsb2NhdGlvbi5oYXNoIGRpcmVjdGx5IGR1ZSB0byBidWdcbiAgICAvLyBpbiBGaXJlZm94IHdoZXJlIGxvY2F0aW9uLmhhc2ggd2lsbCBhbHdheXMgYmUgZGVjb2RlZC5cbiAgICBnZXRIYXNoOiBmdW5jdGlvbih3aW5kb3dPdmVycmlkZSkge1xuICAgICAgdmFyIGxvYyA9IHdpbmRvd092ZXJyaWRlID8gd2luZG93T3ZlcnJpZGUubG9jYXRpb24gOiB3aW5kb3cubG9jYXRpb247XG4gICAgICB2YXIgbWF0Y2ggPSBsb2MuaHJlZi5tYXRjaCgvIyguKikkLyk7XG4gICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgdGhlIGNyb3NzLWJyb3dzZXIgbm9ybWFsaXplZCBVUkwgZnJhZ21lbnQsIGVpdGhlciBmcm9tIHRoZSBVUkwsXG4gICAgLy8gdGhlIGhhc2gsIG9yIHRoZSBvdmVycmlkZS5cbiAgICBnZXRGcmFnbWVudDogZnVuY3Rpb24oZnJhZ21lbnQsIGZvcmNlUHVzaFN0YXRlKSB7XG4gICAgICBpZiAoUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKGZyYWdtZW50KSkge1xuICAgICAgICBpZiAodGhpcy5faGFzUHVzaFN0YXRlIHx8IGZvcmNlUHVzaFN0YXRlKSB7XG4gICAgICAgICAgZnJhZ21lbnQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgICAgdmFyIHNlYXJjaCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gICAgICAgICAgaWYgKHNlYXJjaCkge1xuICAgICAgICAgICAgZnJhZ21lbnQgKz0gc2VhcmNoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcmFnbWVudCA9IHRoaXMuZ2V0SGFzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWZyYWdtZW50LmluZGV4T2YodGhpcy5vcHRpb25zLnJvb3QpKSB7XG4gICAgICAgIGZyYWdtZW50ID0gZnJhZ21lbnQuc3Vic3RyKHRoaXMub3B0aW9ucy5yb290Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnJhZ21lbnQucmVwbGFjZShyb3V0ZVN0cmlwcGVyLCAnJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHRoZSBoYXNoIGNoYW5nZSBoYW5kbGluZywgcmV0dXJuaW5nIGB0cnVlYCBpZiB0aGUgY3VycmVudFxuICAgICAqIFVSTCBtYXRjaGVzIGFuIGV4aXN0aW5nIHJvdXRlLCBhbmQgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIGlmIChQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFyc2UuaGlzdG9yeSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcIik7XG4gICAgICB9XG4gICAgICBQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICAvLyBGaWd1cmUgb3V0IHRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24uIERvIHdlIG5lZWQgYW4gaWZyYW1lP1xuICAgICAgLy8gSXMgcHVzaFN0YXRlIGRlc2lyZWQgLi4uIGlzIGl0IGF2YWlsYWJsZT9cbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB7cm9vdDogJy8nfSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX3dhbnRzSGFzaENoYW5nZSA9IHRoaXMub3B0aW9ucy5oYXNoQ2hhbmdlICE9PSBmYWxzZTtcbiAgICAgIHRoaXMuX3dhbnRzUHVzaFN0YXRlID0gISF0aGlzLm9wdGlvbnMucHVzaFN0YXRlO1xuICAgICAgdGhpcy5faGFzUHVzaFN0YXRlID0gISEodGhpcy5vcHRpb25zLnB1c2hTdGF0ZSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuICAgICAgdmFyIGZyYWdtZW50ID0gdGhpcy5nZXRGcmFnbWVudCgpO1xuICAgICAgdmFyIGRvY01vZGUgPSBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG4gICAgICB2YXIgb2xkSUUgPSAoaXNFeHBsb3Jlci5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSkgJiZcbiAgICAgICAgICAgICAgICAgICAoIWRvY01vZGUgfHwgZG9jTW9kZSA8PSA3KSk7XG5cbiAgICAgIGlmIChvbGRJRSkge1xuICAgICAgICB0aGlzLmlmcmFtZSA9IFBhcnNlLiQoJzxpZnJhbWUgc3JjPVwiamF2YXNjcmlwdDowXCIgdGFiaW5kZXg9XCItMVwiIC8+JylcbiAgICAgICAgICAgICAgICAgICAgICAuaGlkZSgpLmFwcGVuZFRvKCdib2R5JylbMF0uY29udGVudFdpbmRvdztcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZShmcmFnbWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIERlcGVuZGluZyBvbiB3aGV0aGVyIHdlJ3JlIHVzaW5nIHB1c2hTdGF0ZSBvciBoYXNoZXMsIGFuZCB3aGV0aGVyXG4gICAgICAvLyAnb25oYXNoY2hhbmdlJyBpcyBzdXBwb3J0ZWQsIGRldGVybWluZSBob3cgd2UgY2hlY2sgdGhlIFVSTCBzdGF0ZS5cbiAgICAgIGlmICh0aGlzLl9oYXNQdXNoU3RhdGUpIHtcbiAgICAgICAgUGFyc2UuJCh3aW5kb3cpLmJpbmQoJ3BvcHN0YXRlJywgdGhpcy5jaGVja1VybCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSAmJlxuICAgICAgICAgICAgICAgICAoJ29uaGFzaGNoYW5nZScgaW4gd2luZG93KSAmJlxuICAgICAgICAgICAgICAgICAhb2xkSUUpIHtcbiAgICAgICAgUGFyc2UuJCh3aW5kb3cpLmJpbmQoJ2hhc2hjaGFuZ2UnLCB0aGlzLmNoZWNrVXJsKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5jaGVja1VybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVydmFsKTtcbiAgICAgIH1cblxuICAgICAgLy8gRGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gY2hhbmdlIHRoZSBiYXNlIHVybCwgZm9yIGEgcHVzaFN0YXRlIGxpbmtcbiAgICAgIC8vIG9wZW5lZCBieSBhIG5vbi1wdXNoU3RhdGUgYnJvd3Nlci5cbiAgICAgIHRoaXMuZnJhZ21lbnQgPSBmcmFnbWVudDtcbiAgICAgIHZhciBsb2MgPSB3aW5kb3cubG9jYXRpb247XG4gICAgICB2YXIgYXRSb290ICA9IGxvYy5wYXRobmFtZSA9PT0gdGhpcy5vcHRpb25zLnJvb3Q7XG5cbiAgICAgIC8vIElmIHdlJ3ZlIHN0YXJ0ZWQgb2ZmIHdpdGggYSByb3V0ZSBmcm9tIGEgYHB1c2hTdGF0ZWAtZW5hYmxlZCBicm93c2VyLFxuICAgICAgLy8gYnV0IHdlJ3JlIGN1cnJlbnRseSBpbiBhIGJyb3dzZXIgdGhhdCBkb2Vzbid0IHN1cHBvcnQgaXQuLi5cbiAgICAgIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UgJiYgXG4gICAgICAgICAgdGhpcy5fd2FudHNQdXNoU3RhdGUgJiYgXG4gICAgICAgICAgIXRoaXMuX2hhc1B1c2hTdGF0ZSAmJlxuICAgICAgICAgICFhdFJvb3QpIHtcbiAgICAgICAgdGhpcy5mcmFnbWVudCA9IHRoaXMuZ2V0RnJhZ21lbnQobnVsbCwgdHJ1ZSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHRoaXMub3B0aW9ucy5yb290ICsgJyMnICsgdGhpcy5mcmFnbWVudCk7XG4gICAgICAgIC8vIFJldHVybiBpbW1lZGlhdGVseSBhcyBicm93c2VyIHdpbGwgZG8gcmVkaXJlY3QgdG8gbmV3IHVybFxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgLy8gT3IgaWYgd2UndmUgc3RhcnRlZCBvdXQgd2l0aCBhIGhhc2gtYmFzZWQgcm91dGUsIGJ1dCB3ZSdyZSBjdXJyZW50bHlcbiAgICAgIC8vIGluIGEgYnJvd3NlciB3aGVyZSBpdCBjb3VsZCBiZSBgcHVzaFN0YXRlYC1iYXNlZCBpbnN0ZWFkLi4uXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dhbnRzUHVzaFN0YXRlICYmXG4gICAgICAgICAgICAgICAgIHRoaXMuX2hhc1B1c2hTdGF0ZSAmJiBcbiAgICAgICAgICAgICAgICAgYXRSb290ICYmXG4gICAgICAgICAgICAgICAgIGxvYy5oYXNoKSB7XG4gICAgICAgIHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEhhc2goKS5yZXBsYWNlKHJvdXRlU3RyaXBwZXIsICcnKTtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICAgIGxvYy5wcm90b2NvbCArICcvLycgKyBsb2MuaG9zdCArIHRoaXMub3B0aW9ucy5yb290ICsgdGhpcy5mcmFnbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2FkVXJsKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERpc2FibGUgUGFyc2UuaGlzdG9yeSwgcGVyaGFwcyB0ZW1wb3JhcmlseS4gTm90IHVzZWZ1bCBpbiBhIHJlYWwgYXBwLFxuICAgIC8vIGJ1dCBwb3NzaWJseSB1c2VmdWwgZm9yIHVuaXQgdGVzdGluZyBSb3V0ZXJzLlxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgUGFyc2UuJCh3aW5kb3cpLnVuYmluZCgncG9wc3RhdGUnLCB0aGlzLmNoZWNrVXJsKVxuICAgICAgICAgICAgICAgICAgICAgLnVuYmluZCgnaGFzaGNoYW5nZScsIHRoaXMuY2hlY2tVcmwpO1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5fY2hlY2tVcmxJbnRlcnZhbCk7XG4gICAgICBQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gQWRkIGEgcm91dGUgdG8gYmUgdGVzdGVkIHdoZW4gdGhlIGZyYWdtZW50IGNoYW5nZXMuIFJvdXRlcyBhZGRlZCBsYXRlclxuICAgIC8vIG1heSBvdmVycmlkZSBwcmV2aW91cyByb3V0ZXMuXG4gICAgcm91dGU6IGZ1bmN0aW9uKHJvdXRlLCBjYWxsYmFjaykge1xuICAgICAgdGhpcy5oYW5kbGVycy51bnNoaWZ0KHtyb3V0ZTogcm91dGUsIGNhbGxiYWNrOiBjYWxsYmFja30pO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgVVJMIHRvIHNlZSBpZiBpdCBoYXMgY2hhbmdlZCwgYW5kIGlmIGl0IGhhcyxcbiAgICAvLyBjYWxscyBgbG9hZFVybGAsIG5vcm1hbGl6aW5nIGFjcm9zcyB0aGUgaGlkZGVuIGlmcmFtZS5cbiAgICBjaGVja1VybDogZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmdldEZyYWdtZW50KCk7XG4gICAgICBpZiAoY3VycmVudCA9PT0gdGhpcy5mcmFnbWVudCAmJiB0aGlzLmlmcmFtZSkge1xuICAgICAgICBjdXJyZW50ID0gdGhpcy5nZXRGcmFnbWVudCh0aGlzLmdldEhhc2godGhpcy5pZnJhbWUpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50ID09PSB0aGlzLmZyYWdtZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlmcmFtZSkge1xuICAgICAgICB0aGlzLm5hdmlnYXRlKGN1cnJlbnQpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmxvYWRVcmwoKSkge1xuICAgICAgICB0aGlzLmxvYWRVcmwodGhpcy5nZXRIYXNoKCkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBBdHRlbXB0IHRvIGxvYWQgdGhlIGN1cnJlbnQgVVJMIGZyYWdtZW50LiBJZiBhIHJvdXRlIHN1Y2NlZWRzIHdpdGggYVxuICAgIC8vIG1hdGNoLCByZXR1cm5zIGB0cnVlYC4gSWYgbm8gZGVmaW5lZCByb3V0ZXMgbWF0Y2hlcyB0aGUgZnJhZ21lbnQsXG4gICAgLy8gcmV0dXJucyBgZmFsc2VgLlxuICAgIGxvYWRVcmw6IGZ1bmN0aW9uKGZyYWdtZW50T3ZlcnJpZGUpIHtcbiAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEZyYWdtZW50KGZyYWdtZW50T3ZlcnJpZGUpO1xuICAgICAgdmFyIG1hdGNoZWQgPSBfLmFueSh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgIGlmIChoYW5kbGVyLnJvdXRlLnRlc3QoZnJhZ21lbnQpKSB7XG4gICAgICAgICAgaGFuZGxlci5jYWxsYmFjayhmcmFnbWVudCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1hdGNoZWQ7XG4gICAgfSxcblxuICAgIC8vIFNhdmUgYSBmcmFnbWVudCBpbnRvIHRoZSBoYXNoIGhpc3RvcnksIG9yIHJlcGxhY2UgdGhlIFVSTCBzdGF0ZSBpZiB0aGVcbiAgICAvLyAncmVwbGFjZScgb3B0aW9uIGlzIHBhc3NlZC4gWW91IGFyZSByZXNwb25zaWJsZSBmb3IgcHJvcGVybHkgVVJMLWVuY29kaW5nXG4gICAgLy8gdGhlIGZyYWdtZW50IGluIGFkdmFuY2UuXG4gICAgLy9cbiAgICAvLyBUaGUgb3B0aW9ucyBvYmplY3QgY2FuIGNvbnRhaW4gYHRyaWdnZXI6IHRydWVgIGlmIHlvdSB3aXNoIHRvIGhhdmUgdGhlXG4gICAgLy8gcm91dGUgY2FsbGJhY2sgYmUgZmlyZWQgKG5vdCB1c3VhbGx5IGRlc2lyYWJsZSksIG9yIGByZXBsYWNlOiB0cnVlYCwgaWZcbiAgICAvLyB5b3Ugd2lzaCB0byBtb2RpZnkgdGhlIGN1cnJlbnQgVVJMIHdpdGhvdXQgYWRkaW5nIGFuIGVudHJ5IHRvIHRoZVxuICAgIC8vIGhpc3RvcnkuXG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBvcHRpb25zKSB7XG4gICAgICBpZiAoIVBhcnNlLkhpc3Rvcnkuc3RhcnRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICBvcHRpb25zID0ge3RyaWdnZXI6IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgdmFyIGZyYWcgPSAoZnJhZ21lbnQgfHwgJycpLnJlcGxhY2Uocm91dGVTdHJpcHBlciwgJycpO1xuICAgICAgaWYgKHRoaXMuZnJhZ21lbnQgPT09IGZyYWcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBwdXNoU3RhdGUgaXMgYXZhaWxhYmxlLCB3ZSB1c2UgaXQgdG8gc2V0IHRoZSBmcmFnbWVudCBhcyBhIHJlYWwgVVJMLlxuICAgICAgaWYgKHRoaXMuX2hhc1B1c2hTdGF0ZSkge1xuICAgICAgICBpZiAoZnJhZy5pbmRleE9mKHRoaXMub3B0aW9ucy5yb290KSAhPT0gMCkge1xuICAgICAgICAgIGZyYWcgPSB0aGlzLm9wdGlvbnMucm9vdCArIGZyYWc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mcmFnbWVudCA9IGZyYWc7XG4gICAgICAgIHZhciByZXBsYWNlT3JQdXNoID0gb3B0aW9ucy5yZXBsYWNlID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJztcbiAgICAgICAgd2luZG93Lmhpc3RvcnlbcmVwbGFjZU9yUHVzaF0oe30sIGRvY3VtZW50LnRpdGxlLCBmcmFnKTtcblxuICAgICAgLy8gSWYgaGFzaCBjaGFuZ2VzIGhhdmVuJ3QgYmVlbiBleHBsaWNpdGx5IGRpc2FibGVkLCB1cGRhdGUgdGhlIGhhc2hcbiAgICAgIC8vIGZyYWdtZW50IHRvIHN0b3JlIGhpc3RvcnkuXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSkge1xuICAgICAgICB0aGlzLmZyYWdtZW50ID0gZnJhZztcbiAgICAgICAgdGhpcy5fdXBkYXRlSGFzaCh3aW5kb3cubG9jYXRpb24sIGZyYWcsIG9wdGlvbnMucmVwbGFjZSk7XG4gICAgICAgIGlmICh0aGlzLmlmcmFtZSAmJlxuICAgICAgICAgICAgKGZyYWcgIT09IHRoaXMuZ2V0RnJhZ21lbnQodGhpcy5nZXRIYXNoKHRoaXMuaWZyYW1lKSkpKSB7XG4gICAgICAgICAgLy8gT3BlbmluZyBhbmQgY2xvc2luZyB0aGUgaWZyYW1lIHRyaWNrcyBJRTcgYW5kIGVhcmxpZXJcbiAgICAgICAgICAvLyB0byBwdXNoIGEgaGlzdG9yeSBlbnRyeSBvbiBoYXNoLXRhZyBjaGFuZ2UuXG4gICAgICAgICAgLy8gV2hlbiByZXBsYWNlIGlzIHRydWUsIHdlIGRvbid0IHdhbnQgdGhpcy5cbiAgICAgICAgICBpZiAoIW9wdGlvbnMucmVwbGFjZSkge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWUuZG9jdW1lbnQub3BlbigpLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3VwZGF0ZUhhc2godGhpcy5pZnJhbWUubG9jYXRpb24sIGZyYWcsIG9wdGlvbnMucmVwbGFjZSk7XG4gICAgICAgIH1cblxuICAgICAgLy8gSWYgeW91J3ZlIHRvbGQgdXMgdGhhdCB5b3UgZXhwbGljaXRseSBkb24ndCB3YW50IGZhbGxiYWNrIGhhc2hjaGFuZ2UtXG4gICAgICAvLyBiYXNlZCBoaXN0b3J5LCB0aGVuIGBuYXZpZ2F0ZWAgYmVjb21lcyBhIHBhZ2UgcmVmcmVzaC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odGhpcy5vcHRpb25zLnJvb3QgKyBmcmFnbWVudCk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy50cmlnZ2VyKSB7XG4gICAgICAgIHRoaXMubG9hZFVybChmcmFnbWVudCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSB0aGUgaGFzaCBsb2NhdGlvbiwgZWl0aGVyIHJlcGxhY2luZyB0aGUgY3VycmVudCBlbnRyeSwgb3IgYWRkaW5nXG4gICAgLy8gYSBuZXcgb25lIHRvIHRoZSBicm93c2VyIGhpc3RvcnkuXG4gICAgX3VwZGF0ZUhhc2g6IGZ1bmN0aW9uKGxvY2F0aW9uLCBmcmFnbWVudCwgcmVwbGFjZSkge1xuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgdmFyIHMgPSBsb2NhdGlvbi50b1N0cmluZygpLnJlcGxhY2UoLyhqYXZhc2NyaXB0OnwjKS4qJC8sICcnKTtcbiAgICAgICAgbG9jYXRpb24ucmVwbGFjZShzICsgJyMnICsgZnJhZ21lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYXRpb24uaGFzaCA9IGZyYWdtZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59KHRoaXMpKTtcblxuLypnbG9iYWwgXzogZmFsc2UqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogUm91dGVycyBtYXAgZmF1eC1VUkxzIHRvIGFjdGlvbnMsIGFuZCBmaXJlIGV2ZW50cyB3aGVuIHJvdXRlcyBhcmVcbiAgICogbWF0Y2hlZC4gQ3JlYXRpbmcgYSBuZXcgb25lIHNldHMgaXRzIGByb3V0ZXNgIGhhc2gsIGlmIG5vdCBzZXQgc3RhdGljYWxseS5cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkEgZm9yayBvZiBCYWNrYm9uZS5Sb3V0ZXIsIHByb3ZpZGVkIGZvciB5b3VyIGNvbnZlbmllbmNlLlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZVxuICAgKiA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jUm91dGVyXCI+QmFja2JvbmVcbiAgICogZG9jdW1lbnRhdGlvbjwvYT4uPC9wPlxuICAgKiA8cD48c3Ryb25nPjxlbT5BdmFpbGFibGUgaW4gdGhlIGNsaWVudCBTREsgb25seS48L2VtPjwvc3Ryb25nPjwvcD5cbiAgICovXG4gIFBhcnNlLlJvdXRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAob3B0aW9ucy5yb3V0ZXMpIHtcbiAgICAgIHRoaXMucm91dGVzID0gb3B0aW9ucy5yb3V0ZXM7XG4gICAgfVxuICAgIHRoaXMuX2JpbmRSb3V0ZXMoKTtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDYWNoZWQgcmVndWxhciBleHByZXNzaW9ucyBmb3IgbWF0Y2hpbmcgbmFtZWQgcGFyYW0gcGFydHMgYW5kIHNwbGF0dGVkXG4gIC8vIHBhcnRzIG9mIHJvdXRlIHN0cmluZ3MuXG4gIHZhciBuYW1lZFBhcmFtICAgID0gLzpcXHcrL2c7XG4gIHZhciBzcGxhdFBhcmFtICAgID0gL1xcKlxcdysvZztcbiAgdmFyIGVzY2FwZVJlZ0V4cCAgPSAvW1xcLVxcW1xcXXt9KCkrPy4sXFxcXFxcXlxcJFxcfCNcXHNdL2c7XG5cbiAgLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKlBhcnNlLlJvdXRlcioqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKFBhcnNlLlJvdXRlci5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgICAgICAgLyoqIEBsZW5kcyBQYXJzZS5Sb3V0ZXIucHJvdG90eXBlICovIHtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuICAgICAqIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8qKlxuICAgICAqIE1hbnVhbGx5IGJpbmQgYSBzaW5nbGUgbmFtZWQgcm91dGUgdG8gYSBjYWxsYmFjay4gRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiA8cHJlPnRoaXMucm91dGUoJ3NlYXJjaC86cXVlcnkvcDpudW0nLCAnc2VhcmNoJywgZnVuY3Rpb24ocXVlcnksIG51bSkge1xuICAgICAqICAgICAgIC4uLlxuICAgICAqICAgICB9KTs8L3ByZT5cbiAgICAgKi9cbiAgICByb3V0ZTogZnVuY3Rpb24ocm91dGUsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBQYXJzZS5oaXN0b3J5ID0gUGFyc2UuaGlzdG9yeSB8fCBuZXcgUGFyc2UuSGlzdG9yeSgpO1xuICAgICAgaWYgKCFfLmlzUmVnRXhwKHJvdXRlKSkge1xuICAgICAgICByb3V0ZSA9IHRoaXMuX3JvdXRlVG9SZWdFeHAocm91dGUpO1xuICAgICAgfSBcbiAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSB0aGlzW25hbWVdO1xuICAgICAgfVxuICAgICAgUGFyc2UuaGlzdG9yeS5yb3V0ZShyb3V0ZSwgXy5iaW5kKGZ1bmN0aW9uKGZyYWdtZW50KSB7XG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5fZXh0cmFjdFBhcmFtZXRlcnMocm91dGUsIGZyYWdtZW50KTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIFsncm91dGU6JyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIFBhcnNlLmhpc3RvcnkudHJpZ2dlcigncm91dGUnLCB0aGlzLCBuYW1lLCBhcmdzKTtcbiAgICAgIH0sIHRoaXMpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGVuZXZlciB5b3UgcmVhY2ggYSBwb2ludCBpbiB5b3VyIGFwcGxpY2F0aW9uIHRoYXQgeW91J2RcbiAgICAgKiBsaWtlIHRvIHNhdmUgYXMgYSBVUkwsIGNhbGwgbmF2aWdhdGUgaW4gb3JkZXIgdG8gdXBkYXRlIHRoZVxuICAgICAqIFVSTC4gSWYgeW91IHdpc2ggdG8gYWxzbyBjYWxsIHRoZSByb3V0ZSBmdW5jdGlvbiwgc2V0IHRoZSBcbiAgICAgKiB0cmlnZ2VyIG9wdGlvbiB0byB0cnVlLiBUbyB1cGRhdGUgdGhlIFVSTCB3aXRob3V0IGNyZWF0aW5nXG4gICAgICogYW4gZW50cnkgaW4gdGhlIGJyb3dzZXIncyBoaXN0b3J5LCBzZXQgdGhlIHJlcGxhY2Ugb3B0aW9uXG4gICAgICogdG8gdHJ1ZS5cbiAgICAgKi9cbiAgICBuYXZpZ2F0ZTogZnVuY3Rpb24oZnJhZ21lbnQsIG9wdGlvbnMpIHtcbiAgICAgIFBhcnNlLmhpc3RvcnkubmF2aWdhdGUoZnJhZ21lbnQsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBCaW5kIGFsbCBkZWZpbmVkIHJvdXRlcyB0byBgUGFyc2UuaGlzdG9yeWAuIFdlIGhhdmUgdG8gcmV2ZXJzZSB0aGVcbiAgICAvLyBvcmRlciBvZiB0aGUgcm91dGVzIGhlcmUgdG8gc3VwcG9ydCBiZWhhdmlvciB3aGVyZSB0aGUgbW9zdCBnZW5lcmFsXG4gICAgLy8gcm91dGVzIGNhbiBiZSBkZWZpbmVkIGF0IHRoZSBib3R0b20gb2YgdGhlIHJvdXRlIG1hcC5cbiAgICBfYmluZFJvdXRlczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMucm91dGVzKSB7IFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgcm91dGVzID0gW107XG4gICAgICBmb3IgKHZhciByb3V0ZSBpbiB0aGlzLnJvdXRlcykge1xuICAgICAgICBpZiAodGhpcy5yb3V0ZXMuaGFzT3duUHJvcGVydHkocm91dGUpKSB7XG4gICAgICAgICAgcm91dGVzLnVuc2hpZnQoW3JvdXRlLCB0aGlzLnJvdXRlc1tyb3V0ZV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByb3V0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMucm91dGUocm91dGVzW2ldWzBdLCByb3V0ZXNbaV1bMV0sIHRoaXNbcm91dGVzW2ldWzFdXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSByb3V0ZSBzdHJpbmcgaW50byBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgc3VpdGFibGUgZm9yIG1hdGNoaW5nXG4gICAgLy8gYWdhaW5zdCB0aGUgY3VycmVudCBsb2NhdGlvbiBoYXNoLlxuICAgIF9yb3V0ZVRvUmVnRXhwOiBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgcm91dGUgPSByb3V0ZS5yZXBsYWNlKGVzY2FwZVJlZ0V4cCwgJ1xcXFwkJicpXG4gICAgICAgICAgICAgICAgICAgLnJlcGxhY2UobmFtZWRQYXJhbSwgJyhbXlxcL10rKScpXG4gICAgICAgICAgICAgICAgICAgLnJlcGxhY2Uoc3BsYXRQYXJhbSwgJyguKj8pJyk7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyByb3V0ZSArICckJyk7XG4gICAgfSxcblxuICAgIC8vIEdpdmVuIGEgcm91dGUsIGFuZCBhIFVSTCBmcmFnbWVudCB0aGF0IGl0IG1hdGNoZXMsIHJldHVybiB0aGUgYXJyYXkgb2ZcbiAgICAvLyBleHRyYWN0ZWQgcGFyYW1ldGVycy5cbiAgICBfZXh0cmFjdFBhcmFtZXRlcnM6IGZ1bmN0aW9uKHJvdXRlLCBmcmFnbWVudCkge1xuICAgICAgcmV0dXJuIHJvdXRlLmV4ZWMoZnJhZ21lbnQpLnNsaWNlKDEpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VQcm9wcyBJbnN0YW5jZSBwcm9wZXJ0aWVzIGZvciB0aGUgcm91dGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2xhc3NQcm9wcyBDbGFzcyBwcm9wZXJpZXMgZm9yIHRoZSByb3V0ZXIuXG4gICAqIEByZXR1cm4ge0NsYXNzfSBBIG5ldyBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5Sb3V0ZXI8L2NvZGU+LlxuICAgKi9cbiAgUGFyc2UuUm91dGVyLmV4dGVuZCA9IFBhcnNlLl9leHRlbmQ7XG59KHRoaXMpKTtcbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2UgQ29udGFpbnMgZnVuY3Rpb25zIGZvciBjYWxsaW5nIGFuZCBkZWNsYXJpbmdcbiAgICogPGEgaHJlZj1cIi9kb2NzL2Nsb3VkX2NvZGVfZ3VpZGUjZnVuY3Rpb25zXCI+Y2xvdWQgZnVuY3Rpb25zPC9hPi5cbiAgICogPHA+PHN0cm9uZz48ZW0+XG4gICAqICAgU29tZSBmdW5jdGlvbnMgYXJlIG9ubHkgYXZhaWxhYmxlIGZyb20gQ2xvdWQgQ29kZS5cbiAgICogPC9lbT48L3N0cm9uZz48L3A+XG4gICAqL1xuICBQYXJzZS5DbG91ZCA9IFBhcnNlLkNsb3VkIHx8IHt9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLkNsb3VkLCAvKiogQGxlbmRzIFBhcnNlLkNsb3VkICovIHtcbiAgICAvKipcbiAgICAgKiBNYWtlcyBhIGNhbGwgdG8gYSBjbG91ZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgZnVuY3Rpb24gbmFtZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgcGFyYW1ldGVycyB0byBzZW5kIHRvIHRoZSBjbG91ZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0XG4gICAgICogb3B0aW9ucy5zdWNjZXNzLCBpZiBzZXQsIHNob3VsZCBiZSBhIGZ1bmN0aW9uIHRvIGhhbmRsZSBhIHN1Y2Nlc3NmdWxcbiAgICAgKiBjYWxsIHRvIGEgY2xvdWQgZnVuY3Rpb24uICBvcHRpb25zLmVycm9yIHNob3VsZCBiZSBhIGZ1bmN0aW9uIHRoYXRcbiAgICAgKiBoYW5kbGVzIGFuIGVycm9yIHJ1bm5pbmcgdGhlIGNsb3VkIGZ1bmN0aW9uLiAgQm90aCBmdW5jdGlvbnMgYXJlXG4gICAgICogb3B0aW9uYWwuICBCb3RoIGZ1bmN0aW9ucyB0YWtlIGEgc2luZ2xlIGFyZ3VtZW50LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0XG4gICAgICogb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHJ1bjogZnVuY3Rpb24obmFtZSwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJmdW5jdGlvbnNcIixcbiAgICAgICAgY2xhc3NOYW1lOiBuYW1lLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgZGF0YTogUGFyc2UuX2VuY29kZShkYXRhLCBudWxsLCB0cnVlKVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICByZXR1cm4gUGFyc2UuX2RlY29kZShudWxsLCByZXNwKS5yZXN1bHQ7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9XG4gIH0pO1xufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuXG4gIFBhcnNlLkluc3RhbGxhdGlvbiA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJfSW5zdGFsbGF0aW9uXCIpO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBmdW5jdGlvbnMgdG8gZGVhbCB3aXRoIFB1c2ggaW4gUGFyc2VcbiAgICogQG5hbWUgUGFyc2UuUHVzaFxuICAgKiBAbmFtZXNwYWNlXG4gICAqL1xuICBQYXJzZS5QdXNoID0gUGFyc2UuUHVzaCB8fCB7fTtcblxuICAvKipcbiAgICogU2VuZHMgYSBwdXNoIG5vdGlmaWNhdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSAgVGhlIGRhdGEgb2YgdGhlIHB1c2ggbm90aWZpY2F0aW9uLiAgVmFsaWQgZmllbGRzXG4gICAqIGFyZTpcbiAgICogICA8b2w+XG4gICAqICAgICA8bGk+Y2hhbm5lbHMgLSBBbiBBcnJheSBvZiBjaGFubmVscyB0byBwdXNoIHRvLjwvbGk+XG4gICAqICAgICA8bGk+cHVzaF90aW1lIC0gQSBEYXRlIG9iamVjdCBmb3Igd2hlbiB0byBzZW5kIHRoZSBwdXNoLjwvbGk+XG4gICAqICAgICA8bGk+ZXhwaXJhdGlvbl90aW1lIC0gIEEgRGF0ZSBvYmplY3QgZm9yIHdoZW4gdG8gZXhwaXJlXG4gICAqICAgICAgICAgdGhlIHB1c2guPC9saT5cbiAgICogICAgIDxsaT5leHBpcmF0aW9uX2ludGVydmFsIC0gVGhlIHNlY29uZHMgZnJvbSBub3cgdG8gZXhwaXJlIHRoZSBwdXNoLjwvbGk+XG4gICAqICAgICA8bGk+d2hlcmUgLSBBIFBhcnNlLlF1ZXJ5IG92ZXIgUGFyc2UuSW5zdGFsbGF0aW9uIHRoYXQgaXMgdXNlZCB0byBtYXRjaFxuICAgKiAgICAgICAgIGEgc2V0IG9mIGluc3RhbGxhdGlvbnMgdG8gcHVzaCB0by48L2xpPlxuICAgKiAgICAgPGxpPmRhdGEgLSBUaGUgZGF0YSB0byBzZW5kIGFzIHBhcnQgb2YgdGhlIHB1c2g8L2xpPlxuICAgKiAgIDxvbD5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHRoYXQgaGFzIGFuIG9wdGlvbmFsIHN1Y2Nlc3MgZnVuY3Rpb24sXG4gICAqIHRoYXQgdGFrZXMgbm8gYXJndW1lbnRzIGFuZCB3aWxsIGJlIGNhbGxlZCBvbiBhIHN1Y2Nlc3NmdWwgcHVzaCwgYW5kXG4gICAqIGFuIGVycm9yIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBQYXJzZS5FcnJvciBhbmQgd2lsbCBiZSBjYWxsZWQgaWYgdGhlIHB1c2hcbiAgICogZmFpbGVkLlxuICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgcHVzaCByZXF1ZXN0XG4gICAqICAgICBjb21wbGV0ZXMuXG4gICAqL1xuICBQYXJzZS5QdXNoLnNlbmQgPSBmdW5jdGlvbihkYXRhLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBpZiAoZGF0YS53aGVyZSkge1xuICAgICAgZGF0YS53aGVyZSA9IGRhdGEud2hlcmUudG9KU09OKCkud2hlcmU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEucHVzaF90aW1lKSB7XG4gICAgICBkYXRhLnB1c2hfdGltZSA9IGRhdGEucHVzaF90aW1lLnRvSlNPTigpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmV4cGlyYXRpb25fdGltZSkge1xuICAgICAgZGF0YS5leHBpcmF0aW9uX3RpbWUgPSBkYXRhLmV4cGlyYXRpb25fdGltZS50b0pTT04oKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5leHBpcmF0aW9uX3RpbWUgJiYgZGF0YS5leHBpcmF0aW9uX2ludGVydmFsKSB7XG4gICAgICB0aHJvdyBcIkJvdGggZXhwaXJhdGlvbl90aW1lIGFuZCBleHBpcmF0aW9uX2ludGVydmFsIGNhbid0IGJlIHNldFwiO1xuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgcm91dGU6ICdwdXNoJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICB9KTtcbiAgICByZXR1cm4gcmVxdWVzdC5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcbn0odGhpcykpO1xuIiwiLyogUmlvdCB2Mi4wLjE1LCBAbGljZW5zZSBNSVQsIChjKSAyMDE1IE11dXQgSW5jLiArIGNvbnRyaWJ1dG9ycyAqL1xuXG47KGZ1bmN0aW9uKHdpbmRvdykge1xuICAvLyAndXNlIHN0cmljdCcgZG9lcyBub3QgYWxsb3cgdXMgdG8gb3ZlcnJpZGUgdGhlIGV2ZW50cyBwcm9wZXJ0aWVzIGh0dHBzOi8vZ2l0aHViLmNvbS9tdXV0L3Jpb3Rqcy9ibG9iL2Rldi9saWIvdGFnL3VwZGF0ZS5qcyNMNy1MMTBcbiAgLy8gaXQgbGVhZHMgdG8gdGhlIGZvbGxvd2luZyBlcnJvciBvbiBmaXJlZm94IFwic2V0dGluZyBhIHByb3BlcnR5IHRoYXQgaGFzIG9ubHkgYSBnZXR0ZXJcIlxuICAvLyd1c2Ugc3RyaWN0J1xuXG4gIHZhciByaW90ID0geyB2ZXJzaW9uOiAndjIuMC4xNScsIHNldHRpbmdzOiB7fSB9LFxuICAgICAgaWVWZXJzaW9uID0gY2hlY2tJRSgpXG5cbnJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICAgIF9pZCA9IDBcblxuICBlbC5vbiA9IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZuLl9pZCA9IHR5cGVvZiBmbi5faWQgPT0gJ3VuZGVmaW5lZCcgPyBfaWQrKyA6IGZuLl9pZFxuXG4gICAgICBldmVudHMucmVwbGFjZSgvXFxTKy9nLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcbiAgICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIGVsLm9mZiA9IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAoZXZlbnRzID09ICcqJykgY2FsbGJhY2tzID0ge31cbiAgICBlbHNlIHtcbiAgICAgIGV2ZW50cy5yZXBsYWNlKC9cXFMrL2csIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgKGNiID0gYXJyICYmIGFycltpXSk7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNiLl9pZCA9PSBmbi5faWQpIHsgYXJyLnNwbGljZShpLCAxKTsgaS0tIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2tzW25hbWVdID0gW11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvLyBvbmx5IHNpbmdsZSBldmVudCBzdXBwb3J0ZWRcbiAgZWwub25lID0gZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgIGVsLm9mZihuYW1lLCBvbilcbiAgICAgIGZuLmFwcGx5KGVsLCBhcmd1bWVudHMpXG4gICAgfVxuICAgIHJldHVybiBlbC5vbihuYW1lLCBvbilcbiAgfVxuXG4gIGVsLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgIGZucyA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGZuOyAoZm4gPSBmbnNbaV0pOyArK2kpIHtcbiAgICAgIGlmICghZm4uYnVzeSkge1xuICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2tzLmFsbCAmJiBuYW1lICE9ICdhbGwnKSB7XG4gICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJ2FsbCcsIG5hbWVdLmNvbmNhdChhcmdzKSlcbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIHJldHVybiBlbFxuXG59XG47KGZ1bmN0aW9uKHJpb3QsIGV2dCwgd2luZG93KSB7XG5cbiAgLy8gYnJvd3NlcnMgb25seVxuICBpZiAoIXdpbmRvdykgcmV0dXJuXG5cbiAgdmFyIGxvYyA9IHdpbmRvdy5sb2NhdGlvbixcbiAgICAgIGZucyA9IHJpb3Qub2JzZXJ2YWJsZSgpLFxuICAgICAgd2luID0gd2luZG93LFxuICAgICAgc3RhcnRlZCA9IGZhbHNlLFxuICAgICAgY3VycmVudFxuXG4gIGZ1bmN0aW9uIGhhc2goKSB7XG4gICAgcmV0dXJuIGxvYy5ocmVmLnNwbGl0KCcjJylbMV0gfHwgJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlcihwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChwYXRoKSB7XG4gICAgaWYgKHBhdGgudHlwZSkgcGF0aCA9IGhhc2goKVxuXG4gICAgaWYgKHBhdGggIT0gY3VycmVudCkge1xuICAgICAgZm5zLnRyaWdnZXIuYXBwbHkobnVsbCwgWydIJ10uY29uY2F0KHBhcnNlcihwYXRoKSkpXG4gICAgICBjdXJyZW50ID0gcGF0aFxuICAgIH1cbiAgfVxuXG4gIHZhciByID0gcmlvdC5yb3V0ZSA9IGZ1bmN0aW9uKGFyZykge1xuICAgIC8vIHN0cmluZ1xuICAgIGlmIChhcmdbMF0pIHtcbiAgICAgIGxvYy5oYXNoID0gYXJnXG4gICAgICBlbWl0KGFyZylcblxuICAgIC8vIGZ1bmN0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIGZucy5vbignSCcsIGFyZylcbiAgICB9XG4gIH1cblxuICByLmV4ZWMgPSBmdW5jdGlvbihmbikge1xuICAgIGZuLmFwcGx5KG51bGwsIHBhcnNlcihoYXNoKCkpKVxuICB9XG5cbiAgci5wYXJzZXIgPSBmdW5jdGlvbihmbikge1xuICAgIHBhcnNlciA9IGZuXG4gIH1cblxuICByLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzdGFydGVkKSByZXR1cm5cbiAgICB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lciA/IHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZW1pdCwgZmFsc2UpIDogd2luLmRldGFjaEV2ZW50KCdvbicgKyBldnQsIGVtaXQpXG4gICAgZm5zLm9mZignKicpXG4gICAgc3RhcnRlZCA9IGZhbHNlXG4gIH1cblxuICByLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzdGFydGVkKSByZXR1cm5cbiAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lciA/IHdpbi5hZGRFdmVudExpc3RlbmVyKGV2dCwgZW1pdCwgZmFsc2UpIDogd2luLmF0dGFjaEV2ZW50KCdvbicgKyBldnQsIGVtaXQpXG4gICAgc3RhcnRlZCA9IHRydWVcbiAgfVxuXG4gIC8vIGF1dG9zdGFydCB0aGUgcm91dGVyXG4gIHIuc3RhcnQoKVxuXG59KShyaW90LCAnaGFzaGNoYW5nZScsIHdpbmRvdylcbi8qXG5cbi8vLy8gSG93IGl0IHdvcmtzP1xuXG5cblRocmVlIHdheXM6XG5cbjEuIEV4cHJlc3Npb25zOiB0bXBsKCd7IHZhbHVlIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgdGhlIHJlc3VsdCBvZiBldmFsdWF0ZWQgZXhwcmVzc2lvbiBhcyBhIHJhdyBvYmplY3QuXG5cbjIuIFRlbXBsYXRlczogdG1wbCgnSGkgeyBuYW1lIH0geyBzdXJuYW1lIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgYSBzdHJpbmcgd2l0aCBldmFsdWF0ZWQgZXhwcmVzc2lvbnMuXG5cbjMuIEZpbHRlcnM6IHRtcGwoJ3sgc2hvdzogIWRvbmUsIGhpZ2hsaWdodDogYWN0aXZlIH0nLCBkYXRhKS5cbiAgIFJldHVybnMgYSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiB0cnVlaXNoIGtleXMgKG1haW5seVxuICAgdXNlZCBmb3Igc2V0dGluZyBodG1sIGNsYXNzZXMpLCBlLmcuIFwic2hvdyBoaWdobGlnaHRcIi5cblxuXG4vLyBUZW1wbGF0ZSBleGFtcGxlc1xuXG50bXBsKCd7IHRpdGxlIHx8IFwiVW50aXRsZWRcIiB9JywgZGF0YSlcbnRtcGwoJ1Jlc3VsdHMgYXJlIHsgcmVzdWx0cyA/IFwicmVhZHlcIiA6IFwibG9hZGluZ1wiIH0nLCBkYXRhKVxudG1wbCgnVG9kYXkgaXMgeyBuZXcgRGF0ZSgpIH0nLCBkYXRhKVxudG1wbCgneyBtZXNzYWdlLmxlbmd0aCA+IDE0MCAmJiBcIk1lc3NhZ2UgaXMgdG9vIGxvbmdcIiB9JywgZGF0YSlcbnRtcGwoJ1RoaXMgaXRlbSBnb3QgeyBNYXRoLnJvdW5kKHJhdGluZykgfSBzdGFycycsIGRhdGEpXG50bXBsKCc8aDE+eyB0aXRsZSB9PC9oMT57IGJvZHkgfScsIGRhdGEpXG5cblxuLy8gRmFsc3kgZXhwcmVzc2lvbnMgaW4gdGVtcGxhdGVzXG5cbkluIHRlbXBsYXRlcyAoYXMgb3Bwb3NlZCB0byBzaW5nbGUgZXhwcmVzc2lvbnMpIGFsbCBmYWxzeSB2YWx1ZXNcbmV4Y2VwdCB6ZXJvICh1bmRlZmluZWQvbnVsbC9mYWxzZSkgd2lsbCBkZWZhdWx0IHRvIGVtcHR5IHN0cmluZzpcblxudG1wbCgneyB1bmRlZmluZWQgfSAtIHsgZmFsc2UgfSAtIHsgbnVsbCB9IC0geyAwIH0nLCB7fSlcbi8vIHdpbGwgcmV0dXJuOiBcIiAtIC0gLSAwXCJcblxuKi9cblxuXG52YXIgYnJhY2tldHMgPSAoZnVuY3Rpb24ob3JpZywgcywgYikge1xuICByZXR1cm4gZnVuY3Rpb24oeCkge1xuXG4gICAgLy8gbWFrZSBzdXJlIHdlIHVzZSB0aGUgY3VycmVudCBzZXR0aW5nXG4gICAgcyA9IHJpb3Quc2V0dGluZ3MuYnJhY2tldHMgfHwgb3JpZ1xuICAgIGlmIChiICE9IHMpIGIgPSBzLnNwbGl0KCcgJylcblxuICAgIC8vIGlmIHJlZ2V4cCBnaXZlbiwgcmV3cml0ZSBpdCB3aXRoIGN1cnJlbnQgYnJhY2tldHMgKG9ubHkgaWYgZGlmZmVyIGZyb20gZGVmYXVsdClcbiAgICByZXR1cm4geCAmJiB4LnRlc3RcbiAgICAgID8gcyA9PSBvcmlnXG4gICAgICAgID8geCA6IFJlZ0V4cCh4LnNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHsvZywgYlswXS5yZXBsYWNlKC8oPz0uKS9nLCAnXFxcXCcpKVxuICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXH0vZywgYlsxXS5yZXBsYWNlKC8oPz0uKS9nLCAnXFxcXCcpKSxcbiAgICAgICAgICAgICAgICAgICAgeC5nbG9iYWwgPyAnZycgOiAnJylcblxuICAgICAgLy8gZWxzZSwgZ2V0IHNwZWNpZmljIGJyYWNrZXRcbiAgICAgIDogYlt4XVxuXG4gIH1cbn0pKCd7IH0nKVxuXG5cbnZhciB0bXBsID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBjYWNoZSA9IHt9LFxuICAgICAgcmVWYXJzID0gLyhbJ1wiXFwvXSkuKj9bXlxcXFxdXFwxfFxcLlxcdyp8XFx3Kjp8XFxiKD86KD86bmV3fHR5cGVvZnxpbnxpbnN0YW5jZW9mKSB8KD86dGhpc3x0cnVlfGZhbHNlfG51bGx8dW5kZWZpbmVkKVxcYnxmdW5jdGlvbiAqXFwoKXwoW2Etel8kXVxcdyopL2dpXG4gICAgICAgICAgICAgIC8vIFsgMSAgICAgICAgICAgICAgIF1bIDIgIF1bIDMgXVsgNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdWyA1ICAgICAgIF1cbiAgICAgICAgICAgICAgLy8gZmluZCB2YXJpYWJsZSBuYW1lczpcbiAgICAgICAgICAgICAgLy8gMS4gc2tpcCBxdW90ZWQgc3RyaW5ncyBhbmQgcmVnZXhwczogXCJhIGJcIiwgJ2EgYicsICdhIFxcJ2JcXCcnLCAvYSBiL1xuICAgICAgICAgICAgICAvLyAyLiBza2lwIG9iamVjdCBwcm9wZXJ0aWVzOiAubmFtZVxuICAgICAgICAgICAgICAvLyAzLiBza2lwIG9iamVjdCBsaXRlcmFsczogbmFtZTpcbiAgICAgICAgICAgICAgLy8gNC4gc2tpcCBqYXZhc2NyaXB0IGtleXdvcmRzXG4gICAgICAgICAgICAgIC8vIDUuIG1hdGNoIHZhciBuYW1lXG5cbiAgLy8gYnVpbGQgYSB0ZW1wbGF0ZSAob3IgZ2V0IGl0IGZyb20gY2FjaGUpLCByZW5kZXIgd2l0aCBkYXRhXG4gIHJldHVybiBmdW5jdGlvbihzdHIsIGRhdGEpIHtcbiAgICByZXR1cm4gc3RyICYmIChjYWNoZVtzdHJdID0gY2FjaGVbc3RyXSB8fCB0bXBsKHN0cikpKGRhdGEpXG4gIH1cblxuXG4gIC8vIGNyZWF0ZSBhIHRlbXBsYXRlIGluc3RhbmNlXG5cbiAgZnVuY3Rpb24gdG1wbChzLCBwKSB7XG5cbiAgICAvLyBkZWZhdWx0IHRlbXBsYXRlIHN0cmluZyB0byB7fVxuICAgIHMgPSAocyB8fCAoYnJhY2tldHMoMCkgKyBicmFja2V0cygxKSkpXG5cbiAgICAgIC8vIHRlbXBvcmFyaWx5IGNvbnZlcnQgXFx7IGFuZCBcXH0gdG8gYSBub24tY2hhcmFjdGVyXG4gICAgICAucmVwbGFjZShicmFja2V0cygvXFxcXHsvZyksICdcXHVGRkYwJylcbiAgICAgIC5yZXBsYWNlKGJyYWNrZXRzKC9cXFxcfS9nKSwgJ1xcdUZGRjEnKVxuXG4gICAgLy8gc3BsaXQgc3RyaW5nIHRvIGV4cHJlc3Npb24gYW5kIG5vbi1leHByZXNpb24gcGFydHNcbiAgICBwID0gc3BsaXQocywgZXh0cmFjdChzLCBicmFja2V0cygvey8pLCBicmFja2V0cygvfS8pKSlcblxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ2QnLCAncmV0dXJuICcgKyAoXG5cbiAgICAgIC8vIGlzIGl0IGEgc2luZ2xlIGV4cHJlc3Npb24gb3IgYSB0ZW1wbGF0ZT8gaS5lLiB7eH0gb3IgPGI+e3h9PC9iPlxuICAgICAgIXBbMF0gJiYgIXBbMl0gJiYgIXBbM11cblxuICAgICAgICAvLyBpZiBleHByZXNzaW9uLCBldmFsdWF0ZSBpdFxuICAgICAgICA/IGV4cHIocFsxXSlcblxuICAgICAgICAvLyBpZiB0ZW1wbGF0ZSwgZXZhbHVhdGUgYWxsIGV4cHJlc3Npb25zIGluIGl0XG4gICAgICAgIDogJ1snICsgcC5tYXAoZnVuY3Rpb24ocywgaSkge1xuXG4gICAgICAgICAgICAvLyBpcyBpdCBhbiBleHByZXNzaW9uIG9yIGEgc3RyaW5nIChldmVyeSBzZWNvbmQgcGFydCBpcyBhbiBleHByZXNzaW9uKVxuICAgICAgICAgIHJldHVybiBpICUgMlxuXG4gICAgICAgICAgICAgIC8vIGV2YWx1YXRlIHRoZSBleHByZXNzaW9uc1xuICAgICAgICAgICAgICA/IGV4cHIocywgdHJ1ZSlcblxuICAgICAgICAgICAgICAvLyBwcm9jZXNzIHN0cmluZyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGU6XG4gICAgICAgICAgICAgIDogJ1wiJyArIHNcblxuICAgICAgICAgICAgICAgICAgLy8gcHJlc2VydmUgbmV3IGxpbmVzXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG5cbiAgICAgICAgICAgICAgICAgIC8vIGVzY2FwZSBxdW90ZXNcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJylcblxuICAgICAgICAgICAgICAgICsgJ1wiJ1xuXG4gICAgICAgIH0pLmpvaW4oJywnKSArICddLmpvaW4oXCJcIiknXG4gICAgICApXG5cbiAgICAgIC8vIGJyaW5nIGVzY2FwZWQgeyBhbmQgfSBiYWNrXG4gICAgICAucmVwbGFjZSgvXFx1RkZGMC9nLCBicmFja2V0cygwKSlcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYxL2csIGJyYWNrZXRzKDEpKVxuXG4gICAgKyAnOycpXG5cbiAgfVxuXG5cbiAgLy8gcGFyc2UgeyAuLi4gfSBleHByZXNzaW9uXG5cbiAgZnVuY3Rpb24gZXhwcihzLCBuKSB7XG4gICAgcyA9IHNcblxuICAgICAgLy8gY29udmVydCBuZXcgbGluZXMgdG8gc3BhY2VzXG4gICAgICAucmVwbGFjZSgvXFxuL2csICcgJylcblxuICAgICAgLy8gdHJpbSB3aGl0ZXNwYWNlLCBicmFja2V0cywgc3RyaXAgY29tbWVudHNcbiAgICAgIC5yZXBsYWNlKGJyYWNrZXRzKC9eW3sgXSt8WyB9XSskfFxcL1xcKi4rP1xcKlxcLy9nKSwgJycpXG5cbiAgICAvLyBpcyBpdCBhbiBvYmplY3QgbGl0ZXJhbD8gaS5lLiB7IGtleSA6IHZhbHVlIH1cbiAgICByZXR1cm4gL15cXHMqW1xcdy0gXCInXSsgKjovLnRlc3QocylcblxuICAgICAgLy8gaWYgb2JqZWN0IGxpdGVyYWwsIHJldHVybiB0cnVlaXNoIGtleXNcbiAgICAgIC8vIGUuZy46IHsgc2hvdzogaXNPcGVuKCksIGRvbmU6IGl0ZW0uZG9uZSB9IC0+IFwic2hvdyBkb25lXCJcbiAgICAgID8gJ1snICtcblxuICAgICAgICAgIC8vIGV4dHJhY3Qga2V5OnZhbCBwYWlycywgaWdub3JpbmcgYW55IG5lc3RlZCBvYmplY3RzXG4gICAgICAgICAgZXh0cmFjdChzLFxuXG4gICAgICAgICAgICAgIC8vIG5hbWUgcGFydDogbmFtZTosIFwibmFtZVwiOiwgJ25hbWUnOiwgbmFtZSA6XG4gICAgICAgICAgICAgIC9bXCInIF0qW1xcdy0gXStbXCInIF0qOi8sXG5cbiAgICAgICAgICAgICAgLy8gZXhwcmVzc2lvbiBwYXJ0OiBldmVyeXRoaW5nIHVwdG8gYSBjb21tYSBmb2xsb3dlZCBieSBhIG5hbWUgKHNlZSBhYm92ZSkgb3IgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgLywoPz1bXCInIF0qW1xcdy0gXStbXCInIF0qOil8fXwkL1xuICAgICAgICAgICAgICApLm1hcChmdW5jdGlvbihwYWlyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQga2V5LCB2YWwgcGFydHNcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFpci5yZXBsYWNlKC9eWyBcIiddKiguKz8pWyBcIiddKjogKiguKz8pLD8gKiQvLCBmdW5jdGlvbihfLCBrLCB2KSB7XG5cbiAgICAgICAgICAgICAgICAgIC8vIHdyYXAgYWxsIGNvbmRpdGlvbmFsIHBhcnRzIHRvIGlnbm9yZSBlcnJvcnNcbiAgICAgICAgICAgICAgICAgIHJldHVybiB2LnJlcGxhY2UoL1teJnw9IT48XSsvZywgd3JhcCkgKyAnP1wiJyArIGsgKyAnXCI6XCJcIiwnXG5cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIH0pLmpvaW4oJycpXG5cbiAgICAgICAgKyAnXS5qb2luKFwiIFwiKS50cmltKCknXG5cbiAgICAgIC8vIGlmIGpzIGV4cHJlc3Npb24sIGV2YWx1YXRlIGFzIGphdmFzY3JpcHRcbiAgICAgIDogd3JhcChzLCBuKVxuXG4gIH1cblxuXG4gIC8vIGV4ZWN1dGUganMgdy9vIGJyZWFraW5nIG9uIGVycm9ycyBvciB1bmRlZmluZWQgdmFyc1xuXG4gIGZ1bmN0aW9uIHdyYXAocywgbm9udWxsKSB7XG4gICAgcyA9IHMudHJpbSgpXG4gICAgcmV0dXJuICFzID8gJycgOiAnKGZ1bmN0aW9uKHYpe3RyeXt2PSdcblxuICAgICAgICAvLyBwcmVmaXggdmFycyAobmFtZSA9PiBkYXRhLm5hbWUpXG4gICAgICAgICsgKHMucmVwbGFjZShyZVZhcnMsIGZ1bmN0aW9uKHMsIF8sIHYpIHsgcmV0dXJuIHYgPyAnKGQuJyt2Kyc9PT11bmRlZmluZWQ/JysodHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyA/ICdnbG9iYWwuJyA6ICd3aW5kb3cuJykrdisnOmQuJyt2KycpJyA6IHMgfSlcblxuICAgICAgICAgIC8vIGJyZWFrIHRoZSBleHByZXNzaW9uIGlmIGl0cyBlbXB0eSAocmVzdWx0aW5nIGluIHVuZGVmaW5lZCB2YWx1ZSlcbiAgICAgICAgICB8fCAneCcpXG5cbiAgICAgICsgJ31maW5hbGx5e3JldHVybiAnXG5cbiAgICAgICAgLy8gZGVmYXVsdCB0byBlbXB0eSBzdHJpbmcgZm9yIGZhbHN5IHZhbHVlcyBleGNlcHQgemVyb1xuICAgICAgICArIChub251bGwgPT09IHRydWUgPyAnIXYmJnYhPT0wP1wiXCI6dicgOiAndicpXG5cbiAgICAgICsgJ319KS5jYWxsKGQpJ1xuICB9XG5cblxuICAvLyBzcGxpdCBzdHJpbmcgYnkgYW4gYXJyYXkgb2Ygc3Vic3RyaW5nc1xuXG4gIGZ1bmN0aW9uIHNwbGl0KHN0ciwgc3Vic3RyaW5ncykge1xuICAgIHZhciBwYXJ0cyA9IFtdXG4gICAgc3Vic3RyaW5ncy5tYXAoZnVuY3Rpb24oc3ViLCBpKSB7XG5cbiAgICAgIC8vIHB1c2ggbWF0Y2hlZCBleHByZXNzaW9uIGFuZCBwYXJ0IGJlZm9yZSBpdFxuICAgICAgaSA9IHN0ci5pbmRleE9mKHN1YilcbiAgICAgIHBhcnRzLnB1c2goc3RyLnNsaWNlKDAsIGkpLCBzdWIpXG4gICAgICBzdHIgPSBzdHIuc2xpY2UoaSArIHN1Yi5sZW5ndGgpXG4gICAgfSlcblxuICAgIC8vIHB1c2ggdGhlIHJlbWFpbmluZyBwYXJ0XG4gICAgcmV0dXJuIHBhcnRzLmNvbmNhdChzdHIpXG4gIH1cblxuXG4gIC8vIG1hdGNoIHN0cmluZ3MgYmV0d2VlbiBvcGVuaW5nIGFuZCBjbG9zaW5nIHJlZ2V4cCwgc2tpcHBpbmcgYW55IGlubmVyL25lc3RlZCBtYXRjaGVzXG5cbiAgZnVuY3Rpb24gZXh0cmFjdChzdHIsIG9wZW4sIGNsb3NlKSB7XG5cbiAgICB2YXIgc3RhcnQsXG4gICAgICAgIGxldmVsID0gMCxcbiAgICAgICAgbWF0Y2hlcyA9IFtdLFxuICAgICAgICByZSA9IG5ldyBSZWdFeHAoJygnK29wZW4uc291cmNlKycpfCgnK2Nsb3NlLnNvdXJjZSsnKScsICdnJylcblxuICAgIHN0ci5yZXBsYWNlKHJlLCBmdW5jdGlvbihfLCBvcGVuLCBjbG9zZSwgcG9zKSB7XG5cbiAgICAgIC8vIGlmIG91dGVyIGlubmVyIGJyYWNrZXQsIG1hcmsgcG9zaXRpb25cbiAgICAgIGlmKCFsZXZlbCAmJiBvcGVuKSBzdGFydCA9IHBvc1xuXG4gICAgICAvLyBpbihkZSljcmVhc2UgYnJhY2tldCBsZXZlbFxuICAgICAgbGV2ZWwgKz0gb3BlbiA/IDEgOiAtMVxuXG4gICAgICAvLyBpZiBvdXRlciBjbG9zaW5nIGJyYWNrZXQsIGdyYWIgdGhlIG1hdGNoXG4gICAgICBpZighbGV2ZWwgJiYgY2xvc2UgIT0gbnVsbCkgbWF0Y2hlcy5wdXNoKHN0ci5zbGljZShzdGFydCwgcG9zK2Nsb3NlLmxlbmd0aCkpXG5cbiAgICB9KVxuXG4gICAgcmV0dXJuIG1hdGNoZXNcbiAgfVxuXG59KSgpXG5cbi8vIHsga2V5LCBpIGluIGl0ZW1zfSAtPiB7IGtleSwgaSwgaXRlbXMgfVxuZnVuY3Rpb24gbG9vcEtleXMoZXhwcikge1xuICB2YXIgcmV0ID0geyB2YWw6IGV4cHIgfSxcbiAgICAgIGVscyA9IGV4cHIuc3BsaXQoL1xccytpblxccysvKVxuXG4gIGlmIChlbHNbMV0pIHtcbiAgICByZXQudmFsID0gYnJhY2tldHMoMCkgKyBlbHNbMV1cbiAgICBlbHMgPSBlbHNbMF0uc2xpY2UoYnJhY2tldHMoMCkubGVuZ3RoKS50cmltKCkuc3BsaXQoLyxcXHMqLylcbiAgICByZXQua2V5ID0gZWxzWzBdXG4gICAgcmV0LnBvcyA9IGVsc1sxXVxuICB9XG5cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBta2l0ZW0oZXhwciwga2V5LCB2YWwpIHtcbiAgdmFyIGl0ZW0gPSB7fVxuICBpdGVtW2V4cHIua2V5XSA9IGtleVxuICBpZiAoZXhwci5wb3MpIGl0ZW1bZXhwci5wb3NdID0gdmFsXG4gIHJldHVybiBpdGVtXG59XG5cblxuLyogQmV3YXJlOiBoZWF2eSBzdHVmZiAqL1xuZnVuY3Rpb24gX2VhY2goZG9tLCBwYXJlbnQsIGV4cHIpIHtcblxuICByZW1BdHRyKGRvbSwgJ2VhY2gnKVxuXG4gIHZhciB0ZW1wbGF0ZSA9IGRvbS5vdXRlckhUTUwsXG4gICAgICBwcmV2ID0gZG9tLnByZXZpb3VzU2libGluZyxcbiAgICAgIHJvb3QgPSBkb20ucGFyZW50Tm9kZSxcbiAgICAgIHJlbmRlcmVkID0gW10sXG4gICAgICB0YWdzID0gW10sXG4gICAgICBjaGVja3N1bVxuXG4gIGV4cHIgPSBsb29wS2V5cyhleHByKVxuXG4gIGZ1bmN0aW9uIGFkZChwb3MsIGl0ZW0sIHRhZykge1xuICAgIHJlbmRlcmVkLnNwbGljZShwb3MsIDAsIGl0ZW0pXG4gICAgdGFncy5zcGxpY2UocG9zLCAwLCB0YWcpXG4gIH1cblxuICAvLyBjbGVhbiB0ZW1wbGF0ZSBjb2RlXG4gIHBhcmVudC5vbmUoJ3VwZGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgIHJvb3QucmVtb3ZlQ2hpbGQoZG9tKVxuXG4gIH0pLm9uZSgncHJlbW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAocm9vdC5zdHViKSByb290ID0gcGFyZW50LnJvb3RcblxuICB9KS5vbigndXBkYXRlJywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgaXRlbXMgPSB0bXBsKGV4cHIudmFsLCBwYXJlbnQpXG4gICAgaWYgKCFpdGVtcykgcmV0dXJuXG5cbiAgICAvLyBvYmplY3QgbG9vcC4gYW55IGNoYW5nZXMgY2F1c2UgZnVsbCByZWRyYXdcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICB2YXIgdGVzdHN1bSA9IEpTT04uc3RyaW5naWZ5KGl0ZW1zKVxuICAgICAgaWYgKHRlc3RzdW0gPT0gY2hlY2tzdW0pIHJldHVyblxuICAgICAgY2hlY2tzdW0gPSB0ZXN0c3VtXG5cbiAgICAgIC8vIGNsZWFyIG9sZCBpdGVtc1xuICAgICAgZWFjaCh0YWdzLCBmdW5jdGlvbih0YWcpIHsgdGFnLnVubW91bnQoKSB9KVxuICAgICAgcmVuZGVyZWQgPSBbXVxuICAgICAgdGFncyA9IFtdXG5cbiAgICAgIGl0ZW1zID0gT2JqZWN0LmtleXMoaXRlbXMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIG1raXRlbShleHByLCBrZXksIGl0ZW1zW2tleV0pXG4gICAgICB9KVxuXG4gICAgfVxuXG4gICAgLy8gdW5tb3VudCByZWR1bmRhbnRcbiAgICBlYWNoKHJlbmRlcmVkLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAvLyBza2lwIGV4aXN0aW5nIGl0ZW1zXG4gICAgICAgIGlmIChpdGVtcy5pbmRleE9mKGl0ZW0pID4gLTEpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZmluZCBhbGwgbm9uLW9iamVjdHNcbiAgICAgICAgdmFyIG5ld0l0ZW1zID0gYXJyRmluZEVxdWFscyhpdGVtcywgaXRlbSksXG4gICAgICAgICAgICBvbGRJdGVtcyA9IGFyckZpbmRFcXVhbHMocmVuZGVyZWQsIGl0ZW0pXG5cbiAgICAgICAgLy8gaWYgbW9yZSBvciBlcXVhbCBhbW91bnQsIG5vIG5lZWQgdG8gcmVtb3ZlXG4gICAgICAgIGlmIChuZXdJdGVtcy5sZW5ndGggPj0gb2xkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBwb3MgPSByZW5kZXJlZC5pbmRleE9mKGl0ZW0pLFxuICAgICAgICAgIHRhZyA9IHRhZ3NbcG9zXVxuXG4gICAgICBpZiAodGFnKSB7XG4gICAgICAgIHRhZy51bm1vdW50KClcbiAgICAgICAgcmVuZGVyZWQuc3BsaWNlKHBvcywgMSlcbiAgICAgICAgdGFncy5zcGxpY2UocG9zLCAxKVxuICAgICAgICAvLyB0byBsZXQgXCJlYWNoXCIga25vdyB0aGF0IHRoaXMgaXRlbSBpcyByZW1vdmVkXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIC8vIG1vdW50IG5ldyAvIHJlb3JkZXJcbiAgICB2YXIgcHJldkJhc2UgPSBbXS5pbmRleE9mLmNhbGwocm9vdC5jaGlsZE5vZGVzLCBwcmV2KSArIDFcbiAgICBlYWNoKGl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG5cbiAgICAgIC8vIHN0YXJ0IGluZGV4IHNlYXJjaCBmcm9tIHBvc2l0aW9uIGJhc2VkIG9uIHRoZSBjdXJyZW50IGlcbiAgICAgIHZhciBwb3MgPSBpdGVtcy5pbmRleE9mKGl0ZW0sIGkpLFxuICAgICAgICAgIG9sZFBvcyA9IHJlbmRlcmVkLmluZGV4T2YoaXRlbSwgaSlcblxuICAgICAgLy8gaWYgbm90IGZvdW5kLCBzZWFyY2ggYmFja3dhcmRzIGZyb20gY3VycmVudCBpIHBvc2l0aW9uXG4gICAgICBwb3MgPCAwICYmIChwb3MgPSBpdGVtcy5sYXN0SW5kZXhPZihpdGVtLCBpKSlcbiAgICAgIG9sZFBvcyA8IDAgJiYgKG9sZFBvcyA9IHJlbmRlcmVkLmxhc3RJbmRleE9mKGl0ZW0sIGkpKVxuXG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICAvLyBmaW5kIGFsbCBub24tb2JqZWN0c1xuICAgICAgICB2YXIgbmV3SXRlbXMgPSBhcnJGaW5kRXF1YWxzKGl0ZW1zLCBpdGVtKSxcbiAgICAgICAgICAgIG9sZEl0ZW1zID0gYXJyRmluZEVxdWFscyhyZW5kZXJlZCwgaXRlbSlcblxuICAgICAgICAvLyBpZiBtb3JlLCBzaG91bGQgbW91bnQgb25lIG5ld1xuICAgICAgICBpZiAobmV3SXRlbXMubGVuZ3RoID4gb2xkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgb2xkUG9zID0gLTFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBtb3VudCBuZXdcbiAgICAgIHZhciBub2RlcyA9IHJvb3QuY2hpbGROb2Rlc1xuICAgICAgaWYgKG9sZFBvcyA8IDApIHtcbiAgICAgICAgaWYgKCFjaGVja3N1bSAmJiBleHByLmtleSkgdmFyIF9pdGVtID0gbWtpdGVtKGV4cHIsIGl0ZW0sIHBvcylcblxuICAgICAgICB2YXIgdGFnID0gbmV3IFRhZyh7IHRtcGw6IHRlbXBsYXRlIH0sIHtcbiAgICAgICAgICBiZWZvcmU6IG5vZGVzW3ByZXZCYXNlICsgcG9zXSxcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICByb290OiByb290LFxuICAgICAgICAgIGl0ZW06IF9pdGVtIHx8IGl0ZW1cbiAgICAgICAgfSlcblxuICAgICAgICB0YWcubW91bnQoKVxuXG4gICAgICAgIGFkZChwb3MsIGl0ZW0sIHRhZylcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gY2hhbmdlIHBvcyB2YWx1ZVxuICAgICAgaWYgKGV4cHIucG9zICYmIHRhZ3Nbb2xkUG9zXVtleHByLnBvc10gIT0gcG9zKSB7XG4gICAgICAgIHRhZ3Nbb2xkUG9zXS5vbmUoJ3VwZGF0ZScsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtW2V4cHIucG9zXSA9IHBvc1xuICAgICAgICB9KVxuICAgICAgICB0YWdzW29sZFBvc10udXBkYXRlKClcbiAgICAgIH1cblxuICAgICAgLy8gcmVvcmRlclxuICAgICAgaWYgKHBvcyAhPSBvbGRQb3MpIHtcbiAgICAgICAgcm9vdC5pbnNlcnRCZWZvcmUobm9kZXNbcHJldkJhc2UgKyBvbGRQb3NdLCBub2Rlc1twcmV2QmFzZSArIChwb3MgPiBvbGRQb3MgPyBwb3MgKyAxIDogcG9zKV0pXG4gICAgICAgIHJldHVybiBhZGQocG9zLCByZW5kZXJlZC5zcGxpY2Uob2xkUG9zLCAxKVswXSwgdGFncy5zcGxpY2Uob2xkUG9zLCAxKVswXSlcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICByZW5kZXJlZCA9IGl0ZW1zLnNsaWNlKClcblxuICB9KVxuXG59XG5cblxuZnVuY3Rpb24gcGFyc2VOYW1lZEVsZW1lbnRzKHJvb3QsIHBhcmVudCwgY2hpbGRUYWdzKSB7XG5cbiAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcbiAgICBpZiAoZG9tLm5vZGVUeXBlID09IDEpIHtcbiAgICAgIGlmKGRvbS5wYXJlbnROb2RlICYmIGRvbS5wYXJlbnROb2RlLmlzTG9vcCkgZG9tLmlzTG9vcCA9IDFcbiAgICAgIGlmKGRvbS5nZXRBdHRyaWJ1dGUoJ2VhY2gnKSkgZG9tLmlzTG9vcCA9IDFcbiAgICAgIC8vIGN1c3RvbSBjaGlsZCB0YWdcbiAgICAgIHZhciBjaGlsZCA9IGdldFRhZyhkb20pXG5cbiAgICAgIGlmIChjaGlsZCAmJiAhZG9tLmlzTG9vcCkge1xuICAgICAgICB2YXIgdGFnID0gbmV3IFRhZyhjaGlsZCwgeyByb290OiBkb20sIHBhcmVudDogcGFyZW50IH0sIGRvbS5pbm5lckhUTUwpLFxuICAgICAgICAgIHRhZ05hbWUgPSBjaGlsZC5uYW1lLFxuICAgICAgICAgIHB0YWcgPSBwYXJlbnQsXG4gICAgICAgICAgY2FjaGVkVGFnXG5cbiAgICAgICAgd2hpbGUoIWdldFRhZyhwdGFnLnJvb3QpKSB7XG4gICAgICAgICAgaWYoIXB0YWcucGFyZW50KSBicmVha1xuICAgICAgICAgIHB0YWcgPSBwdGFnLnBhcmVudFxuICAgICAgICB9XG4gICAgICAgIC8vIGZpeCBmb3IgdGhlIHBhcmVudCBhdHRyaWJ1dGUgaW4gdGhlIGxvb3BlZCBlbGVtZW50c1xuICAgICAgICB0YWcucGFyZW50ID0gcHRhZ1xuXG4gICAgICAgIGNhY2hlZFRhZyA9IHB0YWcudGFnc1t0YWdOYW1lXVxuXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjaGlsZHJlbiB0YWdzIGhhdmluZyB0aGUgc2FtZSBuYW1lXG4gICAgICAgIGlmIChjYWNoZWRUYWcpIHtcbiAgICAgICAgICAvLyBpZiB0aGUgcGFyZW50IHRhZ3MgcHJvcGVydHkgaXMgbm90IHlldCBhbiBhcnJheVxuICAgICAgICAgIC8vIGNyZWF0ZSBpdCBhZGRpbmcgdGhlIGZpcnN0IGNhY2hlZCB0YWdcbiAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2FjaGVkVGFnKSlcbiAgICAgICAgICAgIHB0YWcudGFnc1t0YWdOYW1lXSA9IFtjYWNoZWRUYWddXG4gICAgICAgICAgLy8gYWRkIHRoZSBuZXcgbmVzdGVkIHRhZyB0byB0aGUgYXJyYXlcbiAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0ucHVzaCh0YWcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHRhZy50YWdzW3RhZ05hbWVdID0gdGFnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbXB0eSB0aGUgY2hpbGQgbm9kZSBvbmNlIHdlIGdvdCBpdHMgdGVtcGxhdGVcbiAgICAgICAgLy8gdG8gYXZvaWQgdGhhdCBpdHMgY2hpbGRyZW4gZ2V0IGNvbXBpbGVkIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIGRvbS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBjaGlsZFRhZ3MucHVzaCh0YWcpXG4gICAgICB9XG5cbiAgICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgaWYgKC9eKG5hbWV8aWQpJC8udGVzdChhdHRyLm5hbWUpKSBwYXJlbnRbYXR0ci52YWx1ZV0gPSBkb21cbiAgICAgIH0pXG4gICAgfVxuXG4gIH0pXG5cbn1cblxuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9ucyhyb290LCB0YWcsIGV4cHJlc3Npb25zKSB7XG5cbiAgZnVuY3Rpb24gYWRkRXhwcihkb20sIHZhbCwgZXh0cmEpIHtcbiAgICBpZiAodmFsLmluZGV4T2YoYnJhY2tldHMoMCkpID49IDApIHtcbiAgICAgIHZhciBleHByID0geyBkb206IGRvbSwgZXhwcjogdmFsIH1cbiAgICAgIGV4cHJlc3Npb25zLnB1c2goZXh0ZW5kKGV4cHIsIGV4dHJhKSlcbiAgICB9XG4gIH1cblxuICB3YWxrKHJvb3QsIGZ1bmN0aW9uKGRvbSkge1xuICAgIHZhciB0eXBlID0gZG9tLm5vZGVUeXBlXG5cbiAgICAvLyB0ZXh0IG5vZGVcbiAgICBpZiAodHlwZSA9PSAzICYmIGRvbS5wYXJlbnROb2RlLnRhZ05hbWUgIT0gJ1NUWUxFJykgYWRkRXhwcihkb20sIGRvbS5ub2RlVmFsdWUpXG4gICAgaWYgKHR5cGUgIT0gMSkgcmV0dXJuXG5cbiAgICAvKiBlbGVtZW50ICovXG5cbiAgICAvLyBsb29wXG4gICAgdmFyIGF0dHIgPSBkb20uZ2V0QXR0cmlidXRlKCdlYWNoJylcbiAgICBpZiAoYXR0cikgeyBfZWFjaChkb20sIHRhZywgYXR0cik7IHJldHVybiBmYWxzZSB9XG5cbiAgICAvLyBhdHRyaWJ1dGUgZXhwcmVzc2lvbnNcbiAgICBlYWNoKGRvbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB2YXIgbmFtZSA9IGF0dHIubmFtZSxcbiAgICAgICAgYm9vbCA9IG5hbWUuc3BsaXQoJ19fJylbMV1cblxuICAgICAgYWRkRXhwcihkb20sIGF0dHIudmFsdWUsIHsgYXR0cjogYm9vbCB8fCBuYW1lLCBib29sOiBib29sIH0pXG4gICAgICBpZiAoYm9vbCkgeyByZW1BdHRyKGRvbSwgbmFtZSk7IHJldHVybiBmYWxzZSB9XG5cbiAgICB9KVxuXG4gICAgLy8gc2tpcCBjdXN0b20gdGFnc1xuICAgIGlmIChnZXRUYWcoZG9tKSkgcmV0dXJuIGZhbHNlXG5cbiAgfSlcblxufVxuZnVuY3Rpb24gVGFnKGltcGwsIGNvbmYsIGlubmVySFRNTCkge1xuXG4gIHZhciBzZWxmID0gcmlvdC5vYnNlcnZhYmxlKHRoaXMpLFxuICAgICAgb3B0cyA9IGluaGVyaXQoY29uZi5vcHRzKSB8fCB7fSxcbiAgICAgIGRvbSA9IG1rZG9tKGltcGwudG1wbCksXG4gICAgICBwYXJlbnQgPSBjb25mLnBhcmVudCxcbiAgICAgIGV4cHJlc3Npb25zID0gW10sXG4gICAgICBjaGlsZFRhZ3MgPSBbXSxcbiAgICAgIHJvb3QgPSBjb25mLnJvb3QsXG4gICAgICBpdGVtID0gY29uZi5pdGVtLFxuICAgICAgZm4gPSBpbXBsLmZuLFxuICAgICAgdGFnTmFtZSA9IHJvb3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgYXR0ciA9IHt9LFxuICAgICAgbG9vcERvbVxuXG4gIGlmIChmbiAmJiByb290Ll90YWcpIHtcbiAgICByb290Ll90YWcudW5tb3VudCh0cnVlKVxuICB9XG4gIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHRhZyBqdXN0IGNyZWF0ZWRcbiAgLy8gc28gd2Ugd2lsbCBiZSBhYmxlIHRvIG1vdW50IHRoaXMgdGFnIG11bHRpcGxlIHRpbWVzXG4gIHJvb3QuX3RhZyA9IHRoaXNcblxuICAvLyBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gdGhpcyB0YWdcbiAgLy8gaXQgY291bGQgYmUgaGFuZHkgdG8gdXNlIGl0IGFsc28gdG8gaW1wcm92ZSB0aGUgdmlydHVhbCBkb20gcmVuZGVyaW5nIHNwZWVkXG4gIHRoaXMuX2lkID0gfn4obmV3IERhdGUoKS5nZXRUaW1lKCkgKiBNYXRoLnJhbmRvbSgpKVxuXG4gIGV4dGVuZCh0aGlzLCB7IHBhcmVudDogcGFyZW50LCByb290OiByb290LCBvcHRzOiBvcHRzLCB0YWdzOiB7fSB9LCBpdGVtKVxuXG4gIC8vIGdyYWIgYXR0cmlidXRlc1xuICBlYWNoKHJvb3QuYXR0cmlidXRlcywgZnVuY3Rpb24oZWwpIHtcbiAgICBhdHRyW2VsLm5hbWVdID0gZWwudmFsdWVcbiAgfSlcblxuXG4gIGlmIChkb20uaW5uZXJIVE1MICYmICEvc2VsZWN0Ly50ZXN0KHRhZ05hbWUpKVxuICAgIC8vIHJlcGxhY2UgYWxsIHRoZSB5aWVsZCB0YWdzIHdpdGggdGhlIHRhZyBpbm5lciBodG1sXG4gICAgZG9tLmlubmVySFRNTCA9IHJlcGxhY2VZaWVsZChkb20uaW5uZXJIVE1MLCBpbm5lckhUTUwpXG5cblxuICAvLyBvcHRpb25zXG4gIGZ1bmN0aW9uIHVwZGF0ZU9wdHMoKSB7XG4gICAgZWFjaChPYmplY3Qua2V5cyhhdHRyKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgb3B0c1tuYW1lXSA9IHRtcGwoYXR0cltuYW1lXSwgcGFyZW50IHx8IHNlbGYpXG4gICAgfSlcbiAgfVxuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZGF0YSwgaW5pdCkge1xuICAgIGV4dGVuZChzZWxmLCBkYXRhLCBpdGVtKVxuICAgIHVwZGF0ZU9wdHMoKVxuICAgIHNlbGYudHJpZ2dlcigndXBkYXRlJywgaXRlbSlcbiAgICB1cGRhdGUoZXhwcmVzc2lvbnMsIHNlbGYsIGl0ZW0pXG4gICAgc2VsZi50cmlnZ2VyKCd1cGRhdGVkJylcbiAgfVxuXG4gIHRoaXMubW91bnQgPSBmdW5jdGlvbigpIHtcblxuICAgIHVwZGF0ZU9wdHMoKVxuXG4gICAgLy8gaW5pdGlhbGlhdGlvblxuICAgIGZuICYmIGZuLmNhbGwoc2VsZiwgb3B0cylcblxuICAgIHRvZ2dsZSh0cnVlKVxuXG4gICAgLy8gcGFyc2UgbGF5b3V0IGFmdGVyIGluaXQuIGZuIG1heSBjYWxjdWxhdGUgYXJncyBmb3IgbmVzdGVkIGN1c3RvbSB0YWdzXG4gICAgcGFyc2VFeHByZXNzaW9ucyhkb20sIHNlbGYsIGV4cHJlc3Npb25zKVxuXG4gICAgaWYgKCFzZWxmLnBhcmVudCkgc2VsZi51cGRhdGUoKVxuXG4gICAgLy8gaW50ZXJuYWwgdXNlIG9ubHksIGZpeGVzICM0MDNcbiAgICBzZWxmLnRyaWdnZXIoJ3ByZW1vdW50JylcblxuICAgIGlmIChmbikge1xuICAgICAgd2hpbGUgKGRvbS5maXJzdENoaWxkKSByb290LmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvb3BEb20gPSBkb20uZmlyc3RDaGlsZFxuICAgICAgcm9vdC5pbnNlcnRCZWZvcmUobG9vcERvbSwgY29uZi5iZWZvcmUgfHwgbnVsbCkgLy8gbnVsbCBuZWVkZWQgZm9yIElFOFxuICAgIH1cblxuICAgIGlmIChyb290LnN0dWIpIHNlbGYucm9vdCA9IHJvb3QgPSBwYXJlbnQucm9vdFxuICAgIHNlbGYudHJpZ2dlcignbW91bnQnKVxuXG4gIH1cblxuXG4gIHRoaXMudW5tb3VudCA9IGZ1bmN0aW9uKGtlZXBSb290VGFnKSB7XG4gICAgdmFyIGVsID0gZm4gPyByb290IDogbG9vcERvbSxcbiAgICAgICAgcCA9IGVsLnBhcmVudE5vZGVcblxuICAgIGlmIChwKSB7XG5cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgdGFnIGZyb20gdGhlIHBhcmVudCB0YWdzIG9iamVjdFxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgbmVzdGVkIHRhZ3Mgd2l0aCBzYW1lIG5hbWUuLlxuICAgICAgICAvLyByZW1vdmUgdGhpcyBlbGVtZW50IGZvcm0gdGhlIGFycmF5XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudC50YWdzW3RhZ05hbWVdKSkge1xuICAgICAgICAgIGVhY2gocGFyZW50LnRhZ3NbdGFnTmFtZV0sIGZ1bmN0aW9uKHRhZywgaSkge1xuICAgICAgICAgICAgaWYgKHRhZy5faWQgPT0gc2VsZi5faWQpXG4gICAgICAgICAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdLnNwbGljZShpLCAxKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IGRlbGV0ZSB0aGUgdGFnIGluc3RhbmNlXG4gICAgICAgICAgZGVsZXRlIHBhcmVudC50YWdzW3RhZ05hbWVdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZClcbiAgICAgIH1cblxuICAgICAgaWYgKCFrZWVwUm9vdFRhZylcbiAgICAgICAgcC5yZW1vdmVDaGlsZChlbClcblxuICAgIH1cblxuXG4gICAgc2VsZi50cmlnZ2VyKCd1bm1vdW50JylcbiAgICB0b2dnbGUoKVxuICAgIHNlbGYub2ZmKCcqJylcbiAgICAvLyBzb21laG93IGllOCBkb2VzIG5vdCBsaWtlIGBkZWxldGUgcm9vdC5fdGFnYFxuICAgIHJvb3QuX3RhZyA9IG51bGxcblxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlKGlzTW91bnQpIHtcblxuICAgIC8vIG1vdW50L3VubW91bnQgY2hpbGRyZW5cbiAgICBlYWNoKGNoaWxkVGFncywgZnVuY3Rpb24oY2hpbGQpIHsgY2hpbGRbaXNNb3VudCA/ICdtb3VudCcgOiAndW5tb3VudCddKCkgfSlcblxuICAgIC8vIGxpc3Rlbi91bmxpc3RlbiBwYXJlbnQgKGV2ZW50cyBmbG93IG9uZSB3YXkgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4pXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdmFyIGV2dCA9IGlzTW91bnQgPyAnb24nIDogJ29mZidcbiAgICAgIHBhcmVudFtldnRdKCd1cGRhdGUnLCBzZWxmLnVwZGF0ZSlbZXZ0XSgndW5tb3VudCcsIHNlbGYudW5tb3VudClcbiAgICB9XG4gIH1cblxuICAvLyBuYW1lZCBlbGVtZW50cyBhdmFpbGFibGUgZm9yIGZuXG4gIHBhcnNlTmFtZWRFbGVtZW50cyhkb20sIHRoaXMsIGNoaWxkVGFncylcblxuXG59XG5cbmZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcihuYW1lLCBoYW5kbGVyLCBkb20sIHRhZywgaXRlbSkge1xuXG4gIGRvbVtuYW1lXSA9IGZ1bmN0aW9uKGUpIHtcblxuICAgIC8vIGNyb3NzIGJyb3dzZXIgZXZlbnQgZml4XG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XG4gICAgZS53aGljaCA9IGUud2hpY2ggfHwgZS5jaGFyQ29kZSB8fCBlLmtleUNvZGVcbiAgICBlLnRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudFxuICAgIGUuY3VycmVudFRhcmdldCA9IGRvbVxuICAgIGUuaXRlbSA9IGl0ZW1cblxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvdXIgKGJ5IGRlZmF1bHQpXG4gICAgaWYgKGhhbmRsZXIuY2FsbCh0YWcsIGUpICE9PSB0cnVlICYmICEvcmFkaW98Y2hlY2svLnRlc3QoZG9tLnR5cGUpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0ICYmIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgdmFyIGVsID0gaXRlbSA/IHRhZy5wYXJlbnQgOiB0YWdcbiAgICBlbC51cGRhdGUoKVxuXG4gIH1cblxufVxuXG4vLyB1c2VkIGJ5IGlmLSBhdHRyaWJ1dGVcbmZ1bmN0aW9uIGluc2VydFRvKHJvb3QsIG5vZGUsIGJlZm9yZSkge1xuICBpZiAocm9vdCkge1xuICAgIHJvb3QuaW5zZXJ0QmVmb3JlKGJlZm9yZSwgbm9kZSlcbiAgICByb290LnJlbW92ZUNoaWxkKG5vZGUpXG4gIH1cbn1cblxuLy8gaXRlbSA9IGN1cnJlbnRseSBsb29wZWQgaXRlbVxuZnVuY3Rpb24gdXBkYXRlKGV4cHJlc3Npb25zLCB0YWcsIGl0ZW0pIHtcblxuICBlYWNoKGV4cHJlc3Npb25zLCBmdW5jdGlvbihleHByLCBpKSB7XG5cbiAgICB2YXIgZG9tID0gZXhwci5kb20sXG4gICAgICAgIGF0dHJOYW1lID0gZXhwci5hdHRyLFxuICAgICAgICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCB0YWcpLFxuICAgICAgICBwYXJlbnQgPSBleHByLmRvbS5wYXJlbnROb2RlXG5cbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSAnJ1xuXG4gICAgLy8gbGVhdmUgb3V0IHJpb3QtIHByZWZpeGVzIGZyb20gc3RyaW5ncyBpbnNpZGUgdGV4dGFyZWFcbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC50YWdOYW1lID09ICdURVhUQVJFQScpIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvcmlvdC0vZywgJycpXG5cbiAgICAvLyBubyBjaGFuZ2VcbiAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHJldHVyblxuICAgIGV4cHIudmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gdGV4dCBub2RlXG4gICAgaWYgKCFhdHRyTmFtZSkgcmV0dXJuIGRvbS5ub2RlVmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gcmVtb3ZlIG9yaWdpbmFsIGF0dHJpYnV0ZVxuICAgIHJlbUF0dHIoZG9tLCBhdHRyTmFtZSlcblxuICAgIC8vIGV2ZW50IGhhbmRsZXJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNldEV2ZW50SGFuZGxlcihhdHRyTmFtZSwgdmFsdWUsIGRvbSwgdGFnLCBpdGVtKVxuXG4gICAgLy8gaWYtIGNvbmRpdGlvbmFsXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PSAnaWYnKSB7XG4gICAgICB2YXIgc3R1YiA9IGV4cHIuc3R1YlxuXG4gICAgICAvLyBhZGQgdG8gRE9NXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgc3R1YiAmJiBpbnNlcnRUbyhzdHViLnBhcmVudE5vZGUsIHN0dWIsIGRvbSlcblxuICAgICAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHViID0gZXhwci5zdHViID0gc3R1YiB8fCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJylcbiAgICAgICAgaW5zZXJ0VG8oZG9tLnBhcmVudE5vZGUsIGRvbSwgc3R1YilcbiAgICAgIH1cblxuICAgIC8vIHNob3cgLyBoaWRlXG4gICAgfSBlbHNlIGlmICgvXihzaG93fGhpZGUpJC8udGVzdChhdHRyTmFtZSkpIHtcbiAgICAgIGlmIChhdHRyTmFtZSA9PSAnaGlkZScpIHZhbHVlID0gIXZhbHVlXG4gICAgICBkb20uc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSdcblxuICAgIC8vIGZpZWxkIHZhbHVlXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PSAndmFsdWUnKSB7XG4gICAgICBkb20udmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gPGltZyBzcmM9XCJ7IGV4cHIgfVwiPlxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUuc2xpY2UoMCwgNSkgPT0gJ3Jpb3QtJykge1xuICAgICAgYXR0ck5hbWUgPSBhdHRyTmFtZS5zbGljZSg1KVxuICAgICAgdmFsdWUgPyBkb20uc2V0QXR0cmlidXRlKGF0dHJOYW1lLCB2YWx1ZSkgOiByZW1BdHRyKGRvbSwgYXR0ck5hbWUpXG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGV4cHIuYm9vbCkge1xuICAgICAgICBkb21bYXR0ck5hbWVdID0gdmFsdWVcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuXG4gICAgICAgIHZhbHVlID0gYXR0ck5hbWVcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnb2JqZWN0JykgZG9tLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgdmFsdWUpXG5cbiAgICB9XG5cbiAgfSlcblxufVxuZnVuY3Rpb24gZWFjaChlbHMsIGZuKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSAoZWxzIHx8IFtdKS5sZW5ndGgsIGVsOyBpIDwgbGVuOyBpKyspIHtcbiAgICBlbCA9IGVsc1tpXVxuICAgIC8vIHJldHVybiBmYWxzZSAtPiByZW1vdmUgY3VycmVudCBpdGVtIGR1cmluZyBsb29wXG4gICAgaWYgKGVsICE9IG51bGwgJiYgZm4oZWwsIGkpID09PSBmYWxzZSkgaS0tXG4gIH1cbiAgcmV0dXJuIGVsc1xufVxuXG5mdW5jdGlvbiByZW1BdHRyKGRvbSwgbmFtZSkge1xuICBkb20ucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG59XG5cbi8vIG1heCAyIGZyb20gb2JqZWN0cyBhbGxvd2VkXG5mdW5jdGlvbiBleHRlbmQob2JqLCBmcm9tLCBmcm9tMikge1xuICBmcm9tICYmIGVhY2goT2JqZWN0LmtleXMoZnJvbSksIGZ1bmN0aW9uKGtleSkge1xuICAgIG9ialtrZXldID0gZnJvbVtrZXldXG4gIH0pXG4gIHJldHVybiBmcm9tMiA/IGV4dGVuZChvYmosIGZyb20yKSA6IG9ialxufVxuXG5mdW5jdGlvbiBjaGVja0lFKCkge1xuICBpZiAod2luZG93KSB7XG4gICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIHZhciBtc2llID0gdWEuaW5kZXhPZignTVNJRSAnKVxuICAgIGlmIChtc2llID4gMCkge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb3B0aW9uSW5uZXJIVE1MKGVsLCBodG1sKSB7XG4gIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKSxcbiAgICAgIHZhbFJlZ3ggPSAvdmFsdWU9W1xcXCInXSguKz8pW1xcXCInXS8sXG4gICAgICBzZWxSZWd4ID0gL3NlbGVjdGVkPVtcXFwiJ10oLis/KVtcXFwiJ10vLFxuICAgICAgdmFsdWVzTWF0Y2ggPSBodG1sLm1hdGNoKHZhbFJlZ3gpLFxuICAgICAgc2VsZWN0ZWRNYXRjaCA9IGh0bWwubWF0Y2goc2VsUmVneClcblxuICBvcHQuaW5uZXJIVE1MID0gaHRtbFxuXG4gIGlmICh2YWx1ZXNNYXRjaCkge1xuICAgIG9wdC52YWx1ZSA9IHZhbHVlc01hdGNoWzFdXG4gIH1cblxuICBpZiAoc2VsZWN0ZWRNYXRjaCkge1xuICAgIG9wdC5zZXRBdHRyaWJ1dGUoJ3Jpb3Qtc2VsZWN0ZWQnLCBzZWxlY3RlZE1hdGNoWzFdKVxuICB9XG5cbiAgZWwuYXBwZW5kQ2hpbGQob3B0KVxufVxuXG5mdW5jdGlvbiBta2RvbSh0ZW1wbGF0ZSkge1xuICB2YXIgdGFnTmFtZSA9IHRlbXBsYXRlLnRyaW0oKS5zbGljZSgxLCAzKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgcm9vdFRhZyA9IC90ZHx0aC8udGVzdCh0YWdOYW1lKSA/ICd0cicgOiB0YWdOYW1lID09ICd0cicgPyAndGJvZHknIDogJ2RpdicsXG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocm9vdFRhZylcblxuICBlbC5zdHViID0gdHJ1ZVxuXG4gIGlmICh0YWdOYW1lID09PSAnb3AnICYmIGllVmVyc2lvbiAmJiBpZVZlcnNpb24gPCAxMCkge1xuICAgIG9wdGlvbklubmVySFRNTChlbCwgdGVtcGxhdGUpXG4gIH0gZWxzZSB7XG4gICAgZWwuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuZnVuY3Rpb24gd2Fsayhkb20sIGZuKSB7XG4gIGlmIChkb20pIHtcbiAgICBpZiAoZm4oZG9tKSA9PT0gZmFsc2UpIHdhbGsoZG9tLm5leHRTaWJsaW5nLCBmbilcbiAgICBlbHNlIHtcbiAgICAgIGRvbSA9IGRvbS5maXJzdENoaWxkXG5cbiAgICAgIHdoaWxlIChkb20pIHtcbiAgICAgICAgd2Fsayhkb20sIGZuKVxuICAgICAgICBkb20gPSBkb20ubmV4dFNpYmxpbmdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVwbGFjZVlpZWxkICh0bXBsLCBpbm5lckhUTUwpIHtcbiAgcmV0dXJuIHRtcGwucmVwbGFjZSgvPCh5aWVsZClcXC8/Pig8XFwvXFwxPik/L2dpbSwgaW5uZXJIVE1MIHx8ICcnKVxufVxuXG5mdW5jdGlvbiAkJChzZWxlY3RvciwgY3R4KSB7XG4gIGN0eCA9IGN0eCB8fCBkb2N1bWVudFxuICByZXR1cm4gY3R4LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG59XG5cbmZ1bmN0aW9uIGFyckRpZmYoYXJyMSwgYXJyMikge1xuICByZXR1cm4gYXJyMS5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gYXJyMi5pbmRleE9mKGVsKSA8IDBcbiAgfSlcbn1cblxuZnVuY3Rpb24gYXJyRmluZEVxdWFscyhhcnIsIGVsKSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChfZWwpIHtcbiAgICByZXR1cm4gX2VsID09PSBlbFxuICB9KVxufVxuXG5mdW5jdGlvbiBpbmhlcml0KHBhcmVudCkge1xuICBmdW5jdGlvbiBDaGlsZCgpIHt9XG4gIENoaWxkLnByb3RvdHlwZSA9IHBhcmVudFxuICByZXR1cm4gbmV3IENoaWxkKClcbn1cblxuLypcbiBWaXJ0dWFsIGRvbSBpcyBhbiBhcnJheSBvZiBjdXN0b20gdGFncyBvbiB0aGUgZG9jdW1lbnQuXG4gVXBkYXRlcyBhbmQgdW5tb3VudHMgcHJvcGFnYXRlIGRvd253YXJkcyBmcm9tIHBhcmVudCB0byBjaGlsZHJlbi5cbiovXG5cbnZhciB2aXJ0dWFsRG9tID0gW10sXG4gICAgdGFnSW1wbCA9IHt9XG5cblxuZnVuY3Rpb24gZ2V0VGFnKGRvbSkge1xuICByZXR1cm4gdGFnSW1wbFtkb20uZ2V0QXR0cmlidXRlKCdyaW90LXRhZycpIHx8IGRvbS50YWdOYW1lLnRvTG93ZXJDYXNlKCldXG59XG5cbmZ1bmN0aW9uIGluamVjdFN0eWxlKGNzcykge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgbm9kZS5pbm5lckhUTUwgPSBjc3NcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChub2RlKVxufVxuXG5mdW5jdGlvbiBtb3VudFRvKHJvb3QsIHRhZ05hbWUsIG9wdHMpIHtcbiAgdmFyIHRhZyA9IHRhZ0ltcGxbdGFnTmFtZV0sXG4gICAgICBpbm5lckhUTUwgPSByb290LmlubmVySFRNTFxuXG4gIC8vIGNsZWFyIHRoZSBpbm5lciBodG1sXG4gIHJvb3QuaW5uZXJIVE1MID0gJydcblxuICBpZiAodGFnICYmIHJvb3QpIHRhZyA9IG5ldyBUYWcodGFnLCB7IHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMgfSwgaW5uZXJIVE1MKVxuXG4gIGlmICh0YWcgJiYgdGFnLm1vdW50KSB7XG4gICAgdGFnLm1vdW50KClcbiAgICB2aXJ0dWFsRG9tLnB1c2godGFnKVxuICAgIHJldHVybiB0YWcub24oJ3VubW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpcnR1YWxEb20uc3BsaWNlKHZpcnR1YWxEb20uaW5kZXhPZih0YWcpLCAxKVxuICAgIH0pXG4gIH1cblxufVxuXG5yaW90LnRhZyA9IGZ1bmN0aW9uKG5hbWUsIGh0bWwsIGNzcywgZm4pIHtcbiAgaWYgKHR5cGVvZiBjc3MgPT0gJ2Z1bmN0aW9uJykgZm4gPSBjc3NcbiAgZWxzZSBpZiAoY3NzKSBpbmplY3RTdHlsZShjc3MpXG4gIHRhZ0ltcGxbbmFtZV0gPSB7IG5hbWU6IG5hbWUsIHRtcGw6IGh0bWwsIGZuOiBmbiB9XG4gIHJldHVybiBuYW1lXG59XG5cbnJpb3QubW91bnQgPSBmdW5jdGlvbihzZWxlY3RvciwgdGFnTmFtZSwgb3B0cykge1xuXG4gIHZhciBlbCxcbiAgICAgIHNlbGN0QWxsVGFncyA9IGZ1bmN0aW9uKHNlbCkge1xuICAgICAgICBzZWwgPSBPYmplY3Qua2V5cyh0YWdJbXBsKS5qb2luKCcsICcpXG4gICAgICAgIHNlbC5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih0KSB7XG4gICAgICAgICAgc2VsICs9ICcsICpbcmlvdC10YWc9XCInKyB0LnRyaW0oKSArICdcIl0nXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzZWxcbiAgICAgIH0sXG4gICAgICB0YWdzID0gW11cblxuICBpZiAodHlwZW9mIHRhZ05hbWUgPT0gJ29iamVjdCcpIHsgb3B0cyA9IHRhZ05hbWU7IHRhZ05hbWUgPSAwIH1cblxuICAvLyBjcmF3bCB0aGUgRE9NIHRvIGZpbmQgdGhlIHRhZ1xuICBpZih0eXBlb2Ygc2VsZWN0b3IgPT0gJ3N0cmluZycpIHtcbiAgICBpZiAoc2VsZWN0b3IgPT0gJyonKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSB0YWdzIHJlZ2lzdGVyZWRcbiAgICAgIC8vIGFuZCBhbHNvIHRoZSB0YWdzIGZvdW5kIHdpdGggdGhlIHJpb3QtdGFnIGF0dHJpYnV0ZSBzZXRcbiAgICAgIHNlbGVjdG9yID0gc2VsY3RBbGxUYWdzKHNlbGVjdG9yKVxuICAgIH1cbiAgICAvLyBvciBqdXN0IHRoZSBvbmVzIG5hbWVkIGxpa2UgdGhlIHNlbGVjdG9yXG4gICAgZWwgPSAkJChzZWxlY3RvcilcbiAgfVxuICAvLyBwcm9iYWJseSB5b3UgaGF2ZSBwYXNzZWQgYWxyZWFkeSBhIHRhZyBvciBhIE5vZGVMaXN0XG4gIGVsc2VcbiAgICBlbCA9IHNlbGVjdG9yXG5cbiAgLy8gc2VsZWN0IGFsbCB0aGUgcmVnaXN0ZXJlZCBhbmQgbW91bnQgdGhlbSBpbnNpZGUgdGhlaXIgcm9vdCBlbGVtZW50c1xuICBpZiAodGFnTmFtZSA9PSAnKicpIHtcbiAgICAvLyBnZXQgYWxsIGN1c3RvbSB0YWdzXG4gICAgdGFnTmFtZSA9IHNlbGN0QWxsVGFncyhzZWxlY3RvcilcbiAgICAvLyBpZiB0aGUgcm9vdCBlbCBpdCdzIGp1c3QgYSBzaW5nbGUgdGFnXG4gICAgaWYgKGVsLnRhZ05hbWUpIHtcbiAgICAgIGVsID0gJCQodGFnTmFtZSwgZWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBub2RlTGlzdCA9IFtdXG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSBjaGlsZHJlbiBmb3IgYWxsIHRoZSBkaWZmZXJlbnQgcm9vdCBlbGVtZW50c1xuICAgICAgZWFjaChlbCwgZnVuY3Rpb24odGFnKSB7XG4gICAgICAgIG5vZGVMaXN0ID0gJCQodGFnTmFtZSwgdGFnKVxuICAgICAgfSlcbiAgICAgIGVsID0gbm9kZUxpc3RcbiAgICB9XG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgdGFnTmFtZVxuICAgIHRhZ05hbWUgPSAwXG4gIH1cblxuICBmdW5jdGlvbiBwdXNoKHJvb3QpIHtcbiAgICB2YXIgbmFtZSA9IHRhZ05hbWUgfHwgcm9vdC5nZXRBdHRyaWJ1dGUoJ3Jpb3QtdGFnJykgfHwgcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHRhZyA9IG1vdW50VG8ocm9vdCwgbmFtZSwgb3B0cylcblxuICAgIGlmICh0YWcpIHRhZ3MucHVzaCh0YWcpXG4gIH1cblxuICAvLyBET00gbm9kZVxuICBpZiAoZWwudGFnTmFtZSlcbiAgICBwdXNoKHNlbGVjdG9yKVxuICAvLyBzZWxlY3RvciBvciBOb2RlTGlzdFxuICBlbHNlXG4gICAgZWFjaChlbCwgcHVzaClcblxuICByZXR1cm4gdGFnc1xuXG59XG5cbi8vIHVwZGF0ZSBldmVyeXRoaW5nXG5yaW90LnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZWFjaCh2aXJ0dWFsRG9tLCBmdW5jdGlvbih0YWcpIHtcbiAgICB0YWcudXBkYXRlKClcbiAgfSlcbn1cblxuLy8gQGRlcHJlY2F0ZWRcbnJpb3QubW91bnRUbyA9IHJpb3QubW91bnRcblxuXG5cbiAgLy8gc2hhcmUgbWV0aG9kcyBmb3Igb3RoZXIgcmlvdCBwYXJ0cywgZS5nLiBjb21waWxlclxuICByaW90LnV0aWwgPSB7IGJyYWNrZXRzOiBicmFja2V0cywgdG1wbDogdG1wbCB9XG5cbiAgLy8gc3VwcG9ydCBDb21tb25KUywgQU1EICYgYnJvd3NlclxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgIG1vZHVsZS5leHBvcnRzID0gcmlvdFxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gcmlvdCB9KVxuICBlbHNlXG4gICAgd2luZG93LnJpb3QgPSByaW90XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQpO1xuIiwidmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4LXJpb3QnKS5EaXNwYXRjaGVyO1xuXG52YXIgQWN0aW9uVHlwZXMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvdGltZWJveGVyX2NvbnN0YW50cy5qcycpLkFjdGlvblR5cGVzO1xuXG52YXIgZGlzcGF0Y2ggPSBmdW5jdGlvbih0eXBlLCBkYXRhKSB7XG4gIHJldHVybiBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzYXZlVGVtcGxhdGU6IGZ1bmN0aW9uKHRhc2spIHtcbiAgICBjb25zb2xlLmxvZyh0YXNrKTtcbiAgICByZXR1cm4gZGlzcGF0Y2goQWN0aW9uVHlwZXMuVEVNUExBVEVfU0FWRSwgdGFzayk7XG4gIH0sXG4gIHVwZGF0ZVRlbXBsYXRlOiBmdW5jdGlvbih0YXNrLCBpbmRleCkge1xuICAgIGNvbnNvbGUubG9nKHRhc2spO1xuICAgIHZhciBkYXRhID0ge3Rhc2s6IHRhc2ssIGluZGV4OiBpbmRleH07XG4gICAgcmV0dXJuIGRpc3BhdGNoKEFjdGlvblR5cGVzLlRFTVBMQVRFX1VQREFURSwgZGF0YSk7XG4gIH0sXG4gIHJlbW92ZVRlbXBsYXRlOiBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiBkaXNwYXRjaChBY3Rpb25UeXBlcy5URU1QTEFURV9SRU1PVkUsIGluZGV4KTtcbiAgfSxcbiAgc2VydmVyRGF0YVJlY2VpdmVkOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdzZXJ2ZXJEYXRhUmVjZWl2ZWQnLCBkYXRhKTtcbiAgICByZXR1cm4gZGlzcGF0Y2goQWN0aW9uVHlwZXMuU0VSVkVSX0ZFVENIX0NPTVBMRVRFLCBkYXRhKTtcbiAgfVxufTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpXG5cbnJpb3QudGFnKCd0aW1lYm94ZXItYWJvdXQnLCAnPGgzPnsgb3B0cy50aXRsZSB9PC9oMz4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj4gPGltZyBzcmM9XCJodHRwOi8vd3d3LnBpeGVudHJhbC5jb20vcGljcy8xRHZaMGJLS1JyYkdnZXBGTWVqa3BVUDFLY3dzei5naWZcIiAvPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbC1tZC04XCI+IDx1bD4gPGxpPlJheSBIYXVzbWFubjwvbGk+IDxsaT5KYXk8L2xpPiA8bGk+RGlua3M8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xuXG5cbn0pO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG52YXIgZmx1eF9yaW90ID0gcmVxdWlyZSgnZmx1eC1yaW90JylcblxucmlvdC50YWcoJ3RpbWVib3hlci1jb250YWN0JywgJzxoMz57IG9wdHMudGl0bGUgfTwvaDM+IDxhIGhyZWY9XCJodHRwOi8vd3d3LmJhYmJlbC5jb20vXCI+YmFiYmVsLmNvbTwvYT4nLCBmdW5jdGlvbihvcHRzKSB7XG5cblxufSk7XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJlcXVpcmUoJy4vdGltZWJveGVyX3RlbXBsYXRlL2luZGV4LnRhZycpXG5cbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKVxuXG5yaW90LnRhZygndGltZWJveGVyLWluZGV4JywgJzxoMz57IG9wdHMudGl0bGUgfTwvaDM+IDx0aW1lYm94ZXItdGVtcGxhdGUtaW5kZXggc3RvcmU9XCJ7IG9wdHMuc3RvcmUgfVwiPjwvdGltZWJveGVyLXRlbXBsYXRlLWluZGV4PicsIGZ1bmN0aW9uKG9wdHMpIHtcblxuXG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xudmFyIHRpbWVib3hlciA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvdGltZWJveGVyLmpzJylcbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKVxuXG5yaW90LnRhZygndGltZWJveGVyLW1lZXRpbmctc3RhcnQnLCAnPGgzPnsgdGhpcy50ZW1wbGF0ZS5uYW1lIH08L2gzPiA8aHI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC04XCI+IDxoMyBjbGFzcz1cImFnZW5kYS1uYW1lXCI+eyB0aGlzLmN1cnJlbnRBZ2VuZGEubmFtZSB9PC9oMz4gPGRpdiBpZD1cInRpbWluZ0Nsb2NrXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiIGlkPVwicHJvZ3Jlc3NiYXJcIj4gPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBhY3RpdmVcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiNDVcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBzdHlsZT1cIndpZHRoOiAxMDAlXCI+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBzdGFydE9yUGF1c2UgfVwiIGNsYXNzPVwiYnRuIGJ0bi1ibG9jayBidG4tc3VjY2Vzc1wiPiA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGxheS1jaXJjbGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IDxzcGFuIGlkPVwiYWdlbmRhQ29udGludWVcIj5TdGFydDwvc3Bhbj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxhIGhyZWY9XCIjXCIgb25jbGljaz1cInsgbmV4dEFnZW5kYSB9XCIgY2xhc3M9XCJidG4gYnRuLWJsb2NrIGJ0bi1pbmZvXCIgaWQ9XCJuZXh0QWdlbmRhQnRuXCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1vay1jaXJjbGVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IE5leHQgPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj4gPHVsIGNsYXNzPVwibGlzdC1ncm91cFwiPiA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIiBlYWNoPVwieyBpdGVtLCBpbmRleCBpbiB0aGlzLnRlbXBsYXRlLmFnZW5kYSB9XCI+IDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInsgXFwnYWdlbmRhSXRlbVxcJysgaW5kZXggfVwiIGRpc2FibGVkPiA8Yj57IGl0ZW0ubmFtZSB9PC9iPiA8c3BhbiBjbGFzcz1cImJhZGdlXCI+eyBpdGVtLnRpbWUgfSBtaW51dGVzPC9zcGFuPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJtb2RhbCBmYWRlXCIgaWQ9XCJhbGxEb25lXCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPiA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPk5vdGljZTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPiA8cD5HcmVhdCBKb2IgZmluaXNoaW5nIHRoZSBtZWV0aW5nISE8L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgdGhpcy5jdXJyZW50QWdlbmRhSW5kZXggPSAwO1xuICB0aGlzLmN1cnJlbnRBZ2VuZGFUaW1lID0gMTtcblxuICB0aGlzLnNldEN1cnJlbnRBZ2VuZGEgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRBZ2VuZGEgPSB0aGlzLnRlbXBsYXRlLmFnZW5kYVt0aGlzLmN1cnJlbnRBZ2VuZGFJbmRleF07XG4gICAgICBpZiAodGhpcy5jdXJyZW50QWdlbmRhKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEFnZW5kYVRpbWUgPSBwYXJzZUZsb2F0KHRoaXMuY3VycmVudEFnZW5kYS50aW1lKSAqIDYwO1xuICAgICAgICB0aGlzLnRpbWVyQ2xvY2suc2V0VGltZSh0aGlzLmN1cnJlbnRBZ2VuZGFUaW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5hbGxEb25lKS5tb2RhbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuZ2V0VGVtcGxhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gb3B0cy50ZW1wbGF0ZV9zdG9yZS5nZXRBbGwoKVtvcHRzLnRlbXBsYXRlSWRdO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5uZXh0QWdlbmRhID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZXNldFN0YXR1cygpO1xuICAgICQoJyNhZ2VuZGFJdGVtJyt0aGlzLmN1cnJlbnRBZ2VuZGFJbmRleCkucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgIHRoaXMuY3VycmVudEFnZW5kYUluZGV4Kys7XG4gICAgdGhpcy5zZXRDdXJyZW50QWdlbmRhKCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmluaXRDbG9jayA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudGltZXJDbG9jayA9ICQodGhpcy50aW1pbmdDbG9jaykuRmxpcENsb2NrKHtcbiAgICAgIGF1dG9TdGFydDogZmFsc2UsXG4gICAgICBjb3VudGRvd246IHRydWUsXG4gICAgICBjbG9ja0ZhY2U6ICdNaW51dGVDb3VudGVyJyxcbiAgICAgIGNhbGxiYWNrczoge1xuICAgICAgICBpbnRlcnZhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHQgPSB0aGlzLnRpbWVyQ2xvY2suZ2V0VGltZSgpO1xuICAgICAgICAgIHZhciBwZXJjZW50ID0gKHQqMTAwKS90aGlzLmN1cnJlbnRBZ2VuZGFUaW1lO1xuICAgICAgICAgIHZhciBleHRyYUNsYXNzID0gJyc7XG5cbiAgICAgICAgICBpZiAocGVyY2VudCA8PSAyMCkge1xuICAgICAgICAgICAgZXh0cmFDbGFzcyA9ICdwcm9ncmVzcy1iYXItd2FybmluZyc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBlcmNlbnQgPD0gMTApIHtcbiAgICAgICAgICAgIGV4dHJhQ2xhc3MgPSAncHJvZ3Jlc3MtYmFyLWRhbmdlcic7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJCh0aGlzLnByb2dyZXNzYmFyKS5maW5kKCcucHJvZ3Jlc3MtYmFyJykuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiBwZXJjZW50ICsgJyUnXG4gICAgICAgICAgfSkuYWRkQ2xhc3MoZXh0cmFDbGFzcyk7XG5cbiAgICAgICAgICBpZih0IDw9IDApIHtcbiAgICAgICAgICAgICQodGhpcy5uZXh0QWdlbmRhQnRuKS5jbGljaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICB9XG4gICAgfSk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnVwZGF0ZUZyb21TdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2V0VGVtcGxhdGVGcm9tU3RvcmUoKVxuICAgIHRoaXMuc2V0Q3VycmVudEFnZW5kYSgpXG4gICAgdGhpcy51cGRhdGUoKVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5zdGFydE9yUGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2godGhpcy5jdXJyZW50QWdlbmRhU3RhdHVzKSB7XG4gICAgICBjYXNlICdwYXVzZWQnOlxuICAgICAgICB0aGlzLnRpbWVyQ2xvY2suc3RhcnQoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50QWdlbmRhU3RhdHVzID0gJ3N0YXJ0ZWQnO1xuICAgICAgICAkKHRoaXMuYWdlbmRhQ29udGludWUpLmh0bWwoJ1BhdXNlJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RhcnRlZCc6XG4gICAgICAgIHRoaXMudGltZXJDbG9jay5zdG9wKCk7XG4gICAgICAgIHRoaXMuY3VycmVudEFnZW5kYVN0YXR1cyA9ICdwYXVzZWQnO1xuICAgICAgICAkKHRoaXMuYWdlbmRhQ29udGludWUpLmh0bWwoJ1N0YXJ0Jyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMucmVzZXRTdGF0dXMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRpbWVyQ2xvY2suc3RvcCgpO1xuICAgIHRoaXMuY3VycmVudEFnZW5kYVN0YXR1cyA9ICdwYXVzZWQnO1xuICAgICQodGhpcy5hZ2VuZGFDb250aW51ZSkuaHRtbCgnU3RhcnQnKTtcblxuICAgICQodGhpcy5wcm9ncmVzc2JhcikuZmluZCgnLnByb2dyZXNzLWJhcicpLlxuICAgIGNzcyh7XG4gICAgICB3aWR0aDogJzEwMCUnXG4gICAgfSkuXG4gICAgcmVtb3ZlQ2xhc3MoJ3Byb2dyZXNzLWJhci13YXJuaW5nJykuXG4gICAgcmVtb3ZlQ2xhc3MoJ3Byb2dyZXNzLWJhci1kYW5nZXInKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIGZsdXhfcmlvdC5zdG9yZU1peGluKHRoaXMsIG9wdHMudGVtcGxhdGVfc3RvcmUsIHRoaXMudXBkYXRlRnJvbVN0b3JlKTtcbiAgdGhpcy5vbignbW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldFRlbXBsYXRlRnJvbVN0b3JlKCk7XG4gICAgdGhpcy5pbml0Q2xvY2soKTtcbiAgICB0aGlzLnJlc2V0U3RhdHVzKCk7XG4gICAgdGhpcy5zZXRDdXJyZW50QWdlbmRhKCk7XG4gIH0pO1xuXG4gIHRoaXMub24oJ3VubW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRpbWVyQ2xvY2suc3RvcCgpO1xuICB9KTtcblxuXG59KTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xudmFyIGZsdXhfcmlvdCA9IHJlcXVpcmUoJ2ZsdXgtcmlvdCcpO1xudmFyIFRpbWVCb3hlciA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvdGltZWJveGVyLmpzJyk7XG5cbnJpb3QudGFnKCd0aW1lYm94ZXItdGVtcGxhdGUtYWRkJywgJzxoMz57IG9wdHMudGl0bGUgfTwvaDM+IDxocj4gPGZvcm0+IDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+IDxsYWJlbCBmb3I9XCJ0ZW1wbGF0ZU5hbWVcIj5FdmVudCBUZW1wbGF0ZSBOYW1lPC9sYWJlbD4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZD1cInRlbXBsYXRlTmFtZVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgVGVtcGxhdGUgTmFtZVwiIG9ua2V5dXA9XCJ7IGVkaXRUaXRsZSB9XCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiA8bGFiZWw+QWdlbmRhPC9sYWJlbD4gPHVsIGNsYXNzPVwibGlzdC1ncm91cFwiPiA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIiBlYWNoPVwieyBpdGVtIGluIGFnZW5kYUl0ZW1zIH1cIj4gPGI+eyBpdGVtLm5hbWUgfTwvYj4gZm9yIDxiPnsgaXRlbS50aW1lIH08L2I+IG1pbnV0ZXMgPC9saT4gPC91bD4gPC9kaXY+IDwvZm9ybT4gPGZvcm0gY2xhc3M9XCJmb3JtLWlubGluZVwiIG9uc3VibWl0PVwieyBhZGRBZ2VuZGEgfVwiPiA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiYWdlbmRhVGl0bGVcIj5JdGVtIFRpdGxlPC9sYWJlbD4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImFnZW5kYVRpdGxlXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBBZ2VuZGEgSXRlbSBUaXRsZVwiIG9ua2V5dXA9XCJ7IGVkaXRBZ2VuZGFUaXRsZSB9XCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiYWdlbmRhVGltZVwiPkl0ZW0gVGltZTwvbGFiZWw+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhZ2VuZGFUaW1lXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBBZ2VuZGEgSXRlbSBUaW1lXCIgb25rZXl1cD1cInsgZWRpdEFnZW5kYVRpbWUgfVwiPiA8L2Rpdj4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgX19kaXNhYmxlZD1cInsgIShhZ2VuZGFUaXRsZVZhbHVlICYmIGFnZW5kYVRpbWVWYWx1ZSkgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+QWRkIEFnZW5kYSBJdGVtPC9idXR0b24+IDwvZm9ybT4gPGhyPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IHNhdmVUZW1wbGF0ZSB9XCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXMtc2lnblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQ3JlYXRlIDwvYT4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBjYW5jZWwgfVwiIGNsYXNzPVwiYnRuIGJ0bi1pbmZvXCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1iYW4tY2lyY2xlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDYW5jZWwgPC9hPicsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICB0aGlzLnRpdGxlID0gJyc7XG5cbiAgdGhpcy5hZ2VuZGFJdGVtcyA9IFtdO1xuXG4gIHRoaXMuYWRkQWdlbmRhID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuYWdlbmRhVGl0bGVWYWx1ZSAmJiB0aGlzLmFnZW5kYVRpbWVWYWx1ZSkge1xuICAgICAgdGhpcy5hZ2VuZGFJdGVtcy5wdXNoKHtcbiAgICAgICAgbmFtZTogdGhpcy5hZ2VuZGFUaXRsZVZhbHVlLFxuICAgICAgICB0aW1lOiB0aGlzLmFnZW5kYVRpbWVWYWx1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmFnZW5kYVRpdGxlVmFsdWUgPSB0aGlzLmFnZW5kYVRpbWVWYWx1ZSA9IHRoaXMuYWdlbmRhVGltZS52YWx1ZSA9IHRoaXMuYWdlbmRhVGl0bGUudmFsdWUgPSAnJztcbiAgICB9XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmVkaXRUaXRsZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB0aGlzLnRpdGxlID0gZS50YXJnZXQudmFsdWU7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmVkaXRBZ2VuZGFUaXRsZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB0aGlzLmFnZW5kYVRpdGxlVmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuZWRpdEFnZW5kYVRpbWUgPSBmdW5jdGlvbihlKSB7XG4gICAgdGhpcy5hZ2VuZGFUaW1lVmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc2F2ZVRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgVGltZUJveGVyLnNhdmVUZW1wbGF0ZSh7XG4gICAgICBuYW1lOiB0aGlzLnRpdGxlLFxuICAgICAgYWdlbmRhOiB0aGlzLmFnZW5kYUl0ZW1zXG4gICAgfSk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnVwZGF0ZUZyb21TdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJpb3Qucm91dGUoJyMnKTtcbiAgfS5iaW5kKHRoaXMpO1xuICB0aGlzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJpb3Qucm91dGUoJyMnKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIGZsdXhfcmlvdC5zdG9yZU1peGluKHRoaXMsIG9wdHMuc3RvcmUsIHRoaXMudXBkYXRlRnJvbVN0b3JlKVxuXG5cbn0pO1xuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG52YXIgZmx1eF9yaW90ID0gcmVxdWlyZSgnZmx1eC1yaW90Jyk7XG52YXIgVGltZUJveGVyID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy90aW1lYm94ZXIuanMnKTtcblxucmlvdC50YWcoJ3RpbWVyLWxpc3QnLCAnPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCIgPiA8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cInthZ2VuZGEubmFtZX1cIiBuYW1lPVwiaXRlbU5hbWVcIj4gPHNwYW4+IEZvciA8L3NwYW4+IDxpbnB1dCB0eXBlPVwidGV4dFwiIHZhbHVlPVwie2FnZW5kYS50aW1lfVwiIG5hbWU9XCJpdGVtVGltZVwiPiA8c3Bhbj4gTWludXRlcyA8L3NwYW4+IDxzcGFuIG9uY2xpY2s9XCJ7bW92ZVVwfVwiIGRhdGEtaW5kZXg9XCJ7aW5kZXh9XCIgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWFycm93LXVwXCI+PC9zcGFuPiA8c3BhbiBvbmNsaWNrPVwie21vdmVEb3dufVwiIGRhdGEtaW5kZXg9XCJ7aW5kZXh9XCIgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWFycm93LWRvd25cIj48L3NwYW4+IDwvbGk+JywgZnVuY3Rpb24ob3B0cykge1xuXG4gIHRoaXMubW92ZVVwID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaW5kZXggPSBwYXJzZUludChldmVudC50YXJnZXQuZGF0YXNldC5pbmRleCk7XG4gICAgdmFyIHRtcDtcbiAgICB2YXIgYWdlbmRhcyA9IHRoaXMucGFyZW50LmFnZW5kYUl0ZW1zLmFnZW5kYTtcbiAgICBpZiAoIGluZGV4ID4gMCkge1xuICAgICAgdG1wID0gYWdlbmRhc1tpbmRleCAtIDFdO1xuICAgICAgYWdlbmRhc1tpbmRleCAtIDFdID0gYWdlbmRhc1tpbmRleF07XG4gICAgICBhZ2VuZGFzW2luZGV4XSA9IHRtcDtcbiAgICAgIFRpbWVCb3hlci51cGRhdGVUZW1wbGF0ZSh0aGlzLnBhcmVudC5hZ2VuZGFJdGVtcywgdGhpcy5wYXJlbnQub3B0cy50ZW1wbGF0ZUlkKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKTtcbiAgdGhpcy5tb3ZlRG93biA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQuaW5kZXgsIDEwKTtcbiAgICB2YXIgdG1wO1xuICAgIHZhciBhZ2VuZGFzID0gdGhpcy5wYXJlbnQuYWdlbmRhSXRlbXMuYWdlbmRhO1xuXG4gICAgaWYgKCBpbmRleCA8IGFnZW5kYXMubGVuZ3RoIC0gMSkge1xuICAgICAgdG1wID0gYWdlbmRhc1tpbmRleF07XG4gICAgICBhZ2VuZGFzW2luZGV4XSA9IGFnZW5kYXNbaW5kZXggKyAxXTtcbiAgICAgIGFnZW5kYXNbaW5kZXggKyAxXSA9IHRtcDtcbiAgICAgIFRpbWVCb3hlci51cGRhdGVUZW1wbGF0ZSh0aGlzLnBhcmVudC5hZ2VuZGFJdGVtcywgdGhpcy5wYXJlbnQub3B0cy50ZW1wbGF0ZUlkKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKTtcblxufSk7XG5cbnJpb3QudGFnKCd0aW1lYm94ZXItdGVtcGxhdGUtZWRpdCcsICc8cCBpZj1cIntvcHRzLmlzX2Vycm9yfVwiPiBGaWxsIHVwIGFsbCB0aGUgdmFsdWVzIDwvcD4ge29wdHMudGl0bGV9IDxmb3JtIG9uc3VibWl0PVwie3VwZGF0ZUFnZW5kYX1cIj4gPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZD1cInRlbXBsYXRlTmFtZVwiIHZhbHVlPVwie2FnZW5kYUl0ZW1zLm5hbWV9XCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiA8bGFiZWw+QWdlbmRhPC9sYWJlbD4gPHVsIGNsYXNzPVwibGlzdC1ncm91cFwiPiA8dGltZXItbGlzdCBlYWNoPVwie2FnZW5kYSwgaW5kZXggaW4gYWdlbmRhSXRlbXMuYWdlbmRhfVwiIGRhdGE9XCJhZ2VuZGFcIj48L3VsPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG9uY2xpY2s9XCJ7YWRkTmV3Um93fVwiPk5ldyBJdGVtPC9idXR0b24+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+VXBkYXRlPC9idXR0b24+IDwvZm9ybT4nLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgdGhpcy5hZGROZXdSb3cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWdlbmRhID0ge1xuICAgICAgbmFtZTogJycsXG4gICAgICB0aW1lOiAnJ1xuICAgIH07XG4gICAgdGhpcy5hZ2VuZGFJdGVtcy5hZ2VuZGEucHVzaChhZ2VuZGEpO1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLnVwZGF0ZUFnZW5kYSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGl0ZW1OYW1lcyA9ICQodGhpcy5yb290KS5maW5kKCdbbmFtZT1cIml0ZW1OYW1lXCJdJyk7XG4gICAgdmFyIGl0ZW1UaW1lcyA9ICQodGhpcy5yb290KS5maW5kKCdbbmFtZT1cIml0ZW1UaW1lXCJdJyk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDAgOyBpbmRleCA8IGl0ZW1OYW1lcy5sZW5ndGggOyBpbmRleCsrKSB7XG4gICAgICBpZiAoaXRlbU5hbWVzW2luZGV4XS52YWx1ZSA9PSAnJyB8fCBpdGVtVGltZXNbaW5kZXhdLnZhbHVlID09PSAnJykge1xuICAgICAgICBvcHRzLmlzX2Vycm9yID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy5hZ2VuZGFJdGVtcy5hZ2VuZGFbaW5kZXhdID0geyBuYW1lIDogaXRlbU5hbWVzW2luZGV4XS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZSA6IGl0ZW1UaW1lc1tpbmRleF0udmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgfVxuICAgIFRpbWVCb3hlci51cGRhdGVUZW1wbGF0ZSh0aGlzLmFnZW5kYUl0ZW1zLCBvcHRzLnRlbXBsYXRlSWQpO1xuICAgIHJpb3Qucm91dGUoJyMnKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMudXBkYXRlRnJvbVN0b3JlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hZ2VuZGFJdGVtcyA9IHRoaXMuc3RvcmUuZ2V0QnlJbmRleChvcHRzLnRlbXBsYXRlSWQpO1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFnZW5kYUl0ZW1zID0gdGhpcy5zdG9yZS5nZXRCeUluZGV4KG9wdHMudGVtcGxhdGVJZCkgfHwge307XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfSk7XG5cbiAgZmx1eF9yaW90LnN0b3JlTWl4aW4odGhpcywgb3B0cy5zdG9yZSwgdGhpcy51cGRhdGVGcm9tU3RvcmUpO1xuXG5cbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xudmFyIHRpbWVib3hlciA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvdGltZWJveGVyLmpzJylcbnZhciBmbHV4X3Jpb3QgPSByZXF1aXJlKCdmbHV4LXJpb3QnKVxuXG52YXIgU2VydmVyQXBpVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9TZXJ2ZXJBcGlVdGlscy5qcycpO1xuU2VydmVyQXBpVXRpbHMuZ2V0QWxsKCk7XG5cbnJpb3QudGFnKCd0aW1lYm94ZXItdGVtcGxhdGUtaW5kZXgnLCAnPGgzPnsgb3B0cy50aXRsZSB9PC9oMz4gPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtaG92ZXJcIj4gPHRyPiA8dGg+VGVtcGxhdGU8L3RoPiA8dGg+QWN0aW9uczwvdGg+IDwvdHI+IDx0ciBlYWNoPVwieyBpdGVtIGluIHRoaXMuaXRlbXMgfVwiPiA8dGQ+PGg0PnsgaXRlbS5uYW1lIH08L2g0PjwvdGQ+IDx0ZD4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBwYXJlbnQuc3RhcnRNZWV0aW5nIH1cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPiA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tdGltZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gU3RhcnQgYSBNZWV0aW5nIDwvYT4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBwYXJlbnQuZWRpdE1lZXRpbmcgfVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+IDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBFZGl0IDwvYT4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwieyBwYXJlbnQucmVtb3ZlTWVldGluZyB9XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBSZW1vdmUgPC9hPiA8L3RkPiA8L3RyPiA8L3RhYmxlPiA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7IGFkZCB9XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj4gPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXMtc2lnblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gQWRkIE5ldyBUZW1wbGF0ZSA8L2E+JywgZnVuY3Rpb24ob3B0cykge1xuXG4gIHRoaXMuYWRkID0gZnVuY3Rpb24oKSB7XG4gICAgcmlvdC5yb3V0ZSgndGVtcGxhdGVzL2FkZCcpXG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmdldERhdGFGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLml0ZW1zID0gdGhpcy5zdG9yZS5nZXRBbGwoKVxuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy51cGRhdGVGcm9tU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldERhdGFGcm9tU3RvcmUoKVxuICAgIHRoaXMudXBkYXRlKClcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc3RhcnRNZWV0aW5nID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoZXZlbnQuaXRlbS5pdGVtKTtcbiAgICByaW90LnJvdXRlKCdtZWV0aW5nL3N0YXJ0LycgKyBpbmRleCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmVkaXRNZWV0aW5nID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoZXZlbnQuaXRlbS5pdGVtKTtcbiAgICByaW90LnJvdXRlKCd0ZW1wbGF0ZXMvZWRpdC8nICsgaW5kZXgpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5yZW1vdmVNZWV0aW5nID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoZXZlbnQuaXRlbS5pdGVtKTtcbiAgICB0aW1lYm94ZXIucmVtb3ZlVGVtcGxhdGUoaW5kZXgpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgZmx1eF9yaW90LnN0b3JlTWl4aW4odGhpcywgb3B0cy5zdG9yZSwgdGhpcy51cGRhdGVGcm9tU3RvcmUpXG5cbiAgdGhpcy5nZXREYXRhRnJvbVN0b3JlKClcblxuXG59KTtcbiIsInZhciBrZXltaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEFjdGlvblR5cGVzOiBrZXltaXJyb3Ioe1xuICAgIFRFTVBMQVRFX1NBVkU6IG51bGwsXG4gICAgVEVNUExBVEVfUkVNT1ZFOiBudWxsLFxuICAgIFRFTVBMQVRFX1VQREFURTogbnVsbCxcblxuICAgIFNFUlZFUl9GRVRDSF9DT01QTEVURTogbnVsbFxuICB9KVxufTtcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdC9yaW90Jyk7XG52YXIgdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL3RpbWVib3hlcl90ZW1wbGF0ZV9zdG9yZS5qcycpO1xuXG5yZXF1aXJlKCcuLi9jb21wb25lbnRzL2luZGV4LnRhZycpO1xucmVxdWlyZSgnLi4vY29tcG9uZW50cy90aW1lYm94ZXJfdGVtcGxhdGUvYWRkLnRhZycpO1xucmVxdWlyZSgnLi4vY29tcG9uZW50cy90aW1lYm94ZXJfdGVtcGxhdGUvZWRpdC50YWcnKTtcbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvdGltZWJveGVyX21lZXRpbmcvc3RhcnQudGFnJyk7XG5cbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvY29udGFjdC50YWcnKTtcbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvYWJvdXQudGFnJyk7XG5cbnZhciBhcHBfdGFnID0gbnVsbDtcblxudmFyIHVubW91bnQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKGFwcF90YWcpIHtcbiAgICByZXR1cm4gYXBwX3RhZy51bm1vdW50KCk7XG4gIH1cbn07XG5cbnZhciBtb3VudCA9IGZ1bmN0aW9uKHRhZywgb3B0cykge1xuICB2YXIgYXBwX2NvbnRhaW5lcjtcbiAgYXBwX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGFwcF9jb250YWluZXIuaWQgPSAnYXBwLWNvbnRhaW5lcic7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKS5hcHBlbmRDaGlsZChhcHBfY29udGFpbmVyKTtcbiAgcmV0dXJuIHJpb3QubW91bnQoJyNhcHAtY29udGFpbmVyJywgdGFnLCBvcHRzKVswXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbmRleDogZnVuY3Rpb24oKSB7XG4gICAgdW5tb3VudCgpO1xuICAgIHJldHVybiBhcHBfdGFnID0gbW91bnQoJ3RpbWVib3hlci1pbmRleCcsIHtcbiAgICAgIHRpdGxlOiBcIlRlbXBsYXRlc1wiLFxuICAgICAgc3RvcmU6IHRpbWVib3hlcl90ZW1wbGF0ZV9zdG9yZVxuICAgIH0pO1xuICB9LFxuXG4gIHRlbXBsYXRlX2FkZDogZnVuY3Rpb24oKSB7XG4gICAgdW5tb3VudCgpO1xuXG4gICAgcmV0dXJuIGFwcF90YWcgPSBtb3VudCgndGltZWJveGVyLXRlbXBsYXRlLWFkZCcsIHtcbiAgICAgIHRpdGxlOiBcIkFkZCBUaW1lYm94ZXIgRXZlbnQgVGVtcGxhdGVcIixcbiAgICAgIHN0b3JlOiB0aW1lYm94ZXJfdGVtcGxhdGVfc3RvcmVcbiAgICB9KTtcbiAgfSxcblxuICB0ZW1wbGF0ZV9lZGl0OiBmdW5jdGlvbihpZCkge1xuICAgIHVubW91bnQoKTtcbiAgICByZXR1cm4gYXBwX3RhZyA9IG1vdW50KCd0aW1lYm94ZXItdGVtcGxhdGUtZWRpdCcsIHtcbiAgICAgIHRpdGxlOiBcIkVkaXQgVGltZWJveGVyIEV2ZW50IFRlbXBsYXRlXCIsXG4gICAgICB0ZW1wbGF0ZUlkOiBpZCxcbiAgICAgIHN0b3JlOiB0aW1lYm94ZXJfdGVtcGxhdGVfc3RvcmVcbiAgICB9KTtcbiAgfSxcblxuICBtZWV0aW5nX3N0YXJ0OiBmdW5jdGlvbihpZCkge1xuICAgIHVubW91bnQoKTtcbiAgICByZXR1cm4gYXBwX3RhZyA9IG1vdW50KCd0aW1lYm94ZXItbWVldGluZy1zdGFydCcsIHtcbiAgICAgIHRpdGxlOiBcIlN0YXJ0IGEgTWVldGluZ1wiLFxuICAgICAgdGVtcGxhdGVJZDogaWQsXG4gICAgICB0ZW1wbGF0ZV9zdG9yZTogdGltZWJveGVyX3RlbXBsYXRlX3N0b3JlXG4gICAgfSk7XG4gIH0sXG5cbiAgYWJvdXQ6IGZ1bmN0aW9uKCkge1xuICAgIHVubW91bnQoKTtcbiAgICByZXR1cm4gYXBwX3RhZyA9IG1vdW50KCd0aW1lYm94ZXItYWJvdXQnLCB7XG4gICAgICB0aXRsZTogXCJBYm91dCBVc1wiXG4gICAgfSk7XG4gIH0sXG5cbiAgY29udGFjdDogZnVuY3Rpb24oKSB7XG4gICAgdW5tb3VudCgpO1xuICAgIHJldHVybiBhcHBfdGFnID0gbW91bnQoJ3RpbWVib3hlci1jb250YWN0Jywge1xuICAgICAgdGl0bGU6IFwiQ29udGFjdCBVc1wiXG4gICAgfSk7XG4gIH1cbn07XG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QvcmlvdCcpO1xudmFyIEJhc2VSb3V0ZXIgPSByZXF1aXJlKCdmbHV4LXJpb3QnKS5CYXNlUm91dGVyO1xudmFyIHRpbWVib3hlcl9wcmVzZW50ZXIgPSByZXF1aXJlKCcuLi9wcmVzZW50ZXJzL3RpbWVib3hlcl9wcmVzZW50ZXIuanMnKTtcblxuQmFzZVJvdXRlci5yb3V0ZXModGltZWJveGVyX3ByZXNlbnRlci5pbmRleCxcbiAgJ3RlbXBsYXRlcy9hZGQnLCB0aW1lYm94ZXJfcHJlc2VudGVyLnRlbXBsYXRlX2FkZCxcbiAgJ3RlbXBsYXRlcy9lZGl0LzppZCcsIHRpbWVib3hlcl9wcmVzZW50ZXIudGVtcGxhdGVfZWRpdCxcbiAgJ21lZXRpbmcvc3RhcnQvOmlkJywgdGltZWJveGVyX3ByZXNlbnRlci5tZWV0aW5nX3N0YXJ0LFxuICAnYWJvdXQnLCB0aW1lYm94ZXJfcHJlc2VudGVyLmFib3V0LFxuICAnY29udGFjdCcsIHRpbWVib3hlcl9wcmVzZW50ZXIuY29udGFjdFxuKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN0YXJ0OiBCYXNlUm91dGVyLnN0YXJ0XG59O1xuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eC1yaW90JykuRGlzcGF0Y2hlcjtcbnZhciBBY3Rpb25UeXBlcyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy90aW1lYm94ZXJfY29uc3RhbnRzLmpzJykuQWN0aW9uVHlwZXM7XG52YXIgZmx1eF9yaW90ID0gcmVxdWlyZSgnZmx1eC1yaW90Jyk7XG52YXIgc2VydmVyVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlcnZlckFwaVV0aWxzLmpzJyk7XG5cbnZhciBfdGVtcGxhdGVzID0gW107XG5cbnZhciBnZXRUZW1wbGF0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfdGVtcGxhdGVzO1xufTtcbnZhciBhZGRUZW1wbGF0ZXMgPSBmdW5jdGlvbiAoZGF0YSkge1xuICBfdGVtcGxhdGVzLnB1c2goZGF0YSk7XG59O1xudmFyIHNhdmVUZW1wbGF0ZXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIF90ZW1wbGF0ZXMgPSBvYmo7XG59O1xudmFyIHJlbW92ZVRlbXBsYXRlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gIF90ZW1wbGF0ZXMuc3BsaWNlKGluZGV4LCAxKTtcbn07XG52YXIgdXBkYXRlVGVtcGxhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gIF90ZW1wbGF0ZXNbb2JqLmluZGV4XSA9IG9iai50YXNrO1xufTtcblxuVGltZWJveGVyVGVtcGxhdGVTdG9yZSA9IGFzc2lnbihuZXcgZmx1eF9yaW90LkJhc2VTdG9yZSgpLCB7XG4gIGdldEFsbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnZXRUZW1wbGF0ZXMoKTtcbiAgfSxcbiAgc2F2ZUFsbDogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG4gIGdldEJ5SW5kZXg6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgIHJldHVybiBfdGVtcGxhdGVzW2luZGV4XTtcbiAgfSxcbiAgZGlzcGF0Y2hUb2tlbjogRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgdmFyIGFjdGlvbiwgZGF0YSwgaW5kZXgsIHRhc2s7XG4gICAgYWN0aW9uID0gcGF5bG9hZC5hY3Rpb247XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgY2FzZSBBY3Rpb25UeXBlcy5TRVJWRVJfRkVUQ0hfQ09NUExFVEU6XG4gICAgICAgIHNhdmVUZW1wbGF0ZXMoYWN0aW9uLmRhdGEpO1xuICAgICAgICBUaW1lYm94ZXJUZW1wbGF0ZVN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBBY3Rpb25UeXBlcy5URU1QTEFURV9TQVZFOlxuICAgICAgICBhZGRUZW1wbGF0ZXMoYWN0aW9uLmRhdGEpO1xuICAgICAgICBzZXJ2ZXJVdGlsLnNhdmVUZW1wbGF0ZShhY3Rpb24uZGF0YSk7XG4gICAgICAgIFRpbWVib3hlclRlbXBsYXRlU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEFjdGlvblR5cGVzLlRFTVBMQVRFX1VQREFURTpcbiAgICAgICAgdXBkYXRlVGVtcGxhdGUoYWN0aW9uLmRhdGEpO1xuICAgICAgICBzZXJ2ZXJVdGlsLnVwZGF0ZVRlbXBsYXRlKGFjdGlvbi5kYXRhLnRhc2spO1xuICAgICAgICBjb25zb2xlLmxvZyhhY3Rpb24uZGF0YSk7XG4gICAgICAgIFRpbWVib3hlclRlbXBsYXRlU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEFjdGlvblR5cGVzLlRFTVBMQVRFX1JFTU9WRTpcbiAgICAgICAgc2VydmVyVXRpbC5kZXN0cm95VGVtcGxhdGUoX3RlbXBsYXRlc1thY3Rpb24uZGF0YV0pO1xuICAgICAgICByZW1vdmVUZW1wbGF0ZShhY3Rpb24uZGF0YSk7XG4gICAgICAgIFRpbWVib3hlclRlbXBsYXRlU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9KVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZWJveGVyVGVtcGxhdGVTdG9yZTtcbiIsInZhciBQYXJzZSA9IHJlcXVpcmUoJ3BhcnNlJykuUGFyc2U7XG52YXIgVGltZUJveGVyID0gcmVxdWlyZSgnLi4vYWN0aW9ucy90aW1lYm94ZXIuanMnKTtcbnZhciBzdG9yYWdlID0gcmVxdWlyZSgnLi9sb2NhbFN0b3JhZ2UuanMnKTtcblxuZnVuY3Rpb24gU2VydmVyQXBpVXRpbHMoKSB7XG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIFBhcnNlLmluaXRpYWxpemUoXCJQRWRWVHBFbkh4aGp3WEhNamtTdFNsQU1VNzV4cTdUS3hNdXQ2MEJEXCIsXG4gICAgICBcInZoYng5d1RRTXdNMDgyMU5nek1zMHhxMlN4SE16QmJZZFpNWldnMXhcIik7XG4gICAgdGhpcy5ib3hlckNsYXNzID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkhhY2tkYXkyXCIpO1xuICAgIHRoaXMucXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkodGhpcy5ib3hlckNsYXNzKTtcbiAgICB0aGlzLmJveGVyT2JqID0gbmV3IHRoaXMuYm94ZXJDbGFzcygpO1xuICB9O1xuICB0aGlzLmdldEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmJveGVyT2JqLmZldGNoKHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0cyk7XG4gICAgICAgIFRpbWVCb3hlci5zZXJ2ZXJEYXRhUmVjZWl2ZWQocmVzdWx0cy50b0pTT04oKS5yZXN1bHRzKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoXCJFcnJvcjogXCIgKyBlcnJvci5jb2RlICsgXCIgXCIgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgdGhpcy5zYXZlVGVtcGxhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuYm94ZXJPYmouc2F2ZShkYXRhKTtcbiAgfTtcbiAgdGhpcy51cGRhdGVUZW1wbGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5xdWVyeS5nZXQoZGF0YS5vYmplY3RJZCwge1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQuc2V0KCdhZ2VuZGEnLCBkYXRhLmFnZW5kYSk7XG4gICAgICAgIHJlc3VsdC5zYXZlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHRoaXMuZGVzdHJveVRlbXBsYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnF1ZXJ5LmdldChkYXRhLm9iamVjdElkLCB7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5kZXN0cm95KHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveWVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KVxuICB9O1xuICB0aGlzLmluaXQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNlcnZlckFwaVV0aWxzKCk7XG4iLCJmdW5jdGlvbiBTdG9yYWdlICgpIHtcblxuICB0aGlzLmRhdGFTdG9yZSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgaWYgKCFsb2NhbFN0b3JhZ2Uuc3ByaW50VGFzaykge1xuICAgICAgbG9jYWxTdG9yYWdlLnNwcmludFRhc2sgPSAnW10nO1xuICAgIH1cbiAgICB0aGlzLmRhdGFTdG9yZSA9IGdldEZyb21Mb2NhbFN0b3JhZ2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJldHJpZXZlICgpIHtcbiAgICByZXR1cm4gZ2V0RnJvbUxvY2FsU3RvcmFnZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2F2ZSAoZGF0YSkge1xuICAgIHNhdmVUb0xvY2FsU3RvcmFnZShkYXRhKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZSAoaW5kZXgpIHtcbiAgICB0aGlzLmRhdGFTdG9yZVtpbmRleF0gPSB7fTtcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UodGhpcy5kYXRhU3RvcmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2F2ZVRvTG9jYWxTdG9yYWdlIChkYXRhKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNwcmludFRhc2sgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZyb21Mb2NhbFN0b3JhZ2UgKCkge1xuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2Uuc3ByaW50VGFzayk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldCAoKSB7XG4gICAgZGVsZXRlIGxvY2FsU3RvcmFnZS5zcHJpbnRUYXNrO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgdGhpcy5pbml0ID0gaW5pdDtcbiAgdGhpcy5yZXRyaWV2ZSA9IHJldHJpZXZlO1xuICB0aGlzLnNhdmUgPSBzYXZlO1xuICB0aGlzLnJlbW92ZSA9IHJlbW92ZTtcbiAgdGhpcy5yZXNldCA9IHJlc2V0O1xuXG4gIHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZSA9IGdldEZyb21Mb2NhbFN0b3JhZ2U7XG4gIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlID0gc2F2ZVRvTG9jYWxTdG9yYWdlO1xufVxudmFyIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuc3RvcmFnZS5pbml0KCk7XG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JhZ2U7XG4iXX0=
