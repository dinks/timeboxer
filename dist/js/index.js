(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/index.js":[function(require,module,exports){
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
 * Copyright (c) 2014-2015, Facebook, Inc.
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
 * Version: 1.5.0
 * Built: Fri Jul 10 2015 17:05:46
 * http://parse.com
 *
 * Copyright 2015 Parse, LLC
 *
 * Includes: Underscore.js
 * Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * Released under the MIT license.
 */
(function(root) {
  root.Parse = root.Parse || {};
  root.Parse.VERSION = "js1.5.0";
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
    } else if (!Parse.masterKey) {
      throw new Error('Cannot use the Master Key, it has not been provided.');
    } else {
      dataObject._MasterKey = Parse.masterKey;
    }

    dataObject._ClientVersion = Parse.VERSION;

    return Parse._getInstallationId().then(function(iid) {
      dataObject._InstallationId = iid;

      if (sessionToken) {
        return Parse.Promise.as({ _sessionToken: sessionToken });
      }
      if (!Parse.User._canUseCurrentUser()) {
        return Parse.Promise.as(null);
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
      if (isNaN(value)) {
        throw new Error('Cannot encode invalid Date');
      }
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
    var specifiedType = type || '';

    if (_.isArray(data)) {
      this._source = Parse.Promise.as(encodeBase64(data), specifiedType);
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
        this._source = Parse.Promise.as(data.base64, specifiedType);
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
   *   <li>sessionToken: A valid session token, used for making a request on
   *       behalf of a specific user.
   * </ul>
   */
  Parse.Object.saveAll = function(list, options) {
    options = options || {};
    return Parse.Object._deepSaveAsync(list, {
      useMasterKey: options.useMasterKey,
      sessionToken: options.sessionToken
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
   *   <li>sessionToken: A valid session token, used for making a request on
   *       behalf of a specific user.
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
            sessionToken: options.sessionToken,
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
        useMasterKey: options.useMasterKey,
        sessionToken: options.sessionToken
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
          useMasterKey: options.useMasterKey,
          sessionToken: options.sessionToken
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
          sessionToken: options.sessionToken,
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
        useMasterKey: options.useMasterKey,
        sessionToken: options.sessionToken
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
            sessionToken: options.sessionToken,
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
        useMasterKey: options.useMasterKey,
        sessionToken: options.sessionToken
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
        model._handleSaveResult(Parse.User._canUseCurrentUser());
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
      if (!Parse.User._canUseCurrentUser()) {
        throw new Error(
          'It is not possible to log in on a server environment.'
        );
      }
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

    // Whether to enable a memory-unsafe current user in node.js
    _enableUnsafeCurrentUser: false,


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
      if (!Parse.User._canUseCurrentUser()) {
        throw new Error(
          'It is not secure to become a user on a node.js server environment.'
        );
      }
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
      if (!Parse.User._canUseCurrentUser()) {
        throw new Error(
          'There is no current user user on a node.js server environment.'
        );
      }
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
      if (!Parse.User._canUseCurrentUser()) {
        throw new Error(
          'There is no current user user on a node.js server environment.'
        );
      }
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
      if (Parse.User._canUseCurrentUser() && Parse.User.current()) {
        return Parse.User.current()._upgradeToRevocableSession(options);
      }
      return Parse.Promise.as()._thenRunCallbacks(options);
    },

    /**
     *
     */
    enableUnsafeCurrentUser: function() {
      Parse.User._enableUnsafeCurrentUser = true;
    },

    _canUseCurrentUser: function() {
      return !Parse._isNode || Parse.User._enableUnsafeCurrentUser;
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     */
    get: function(objectId, options) {
      var self = this;
      self.equalTo('objectId', objectId);

      var firstOptions = {};
      if (options && _.has(options, 'useMasterKey')) {
        firstOptions = { useMasterKey: options.useMasterKey };
      }
      if (options && _.has(options, 'sessionToken')) {
        firstOptions.sessionToken = options.sessionToken;
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
        sessionToken: options.sessionToken,
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
        sessionToken: options.sessionToken,
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
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
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
        sessionToken: options.sessionToken,
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
      if (_.has(options, 'sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
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
        sessionToken: options.sessionToken,
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9wYXJzZS9idWlsZC9wYXJzZS1sYXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBQYXJzZSBKYXZhU2NyaXB0IFNES1xuICogVmVyc2lvbjogMS41LjBcbiAqIEJ1aWx0OiBGcmkgSnVsIDEwIDIwMTUgMTc6MDU6NDZcbiAqIGh0dHA6Ly9wYXJzZS5jb21cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNSBQYXJzZSwgTExDXG4gKlxuICogSW5jbHVkZXM6IFVuZGVyc2NvcmUuanNcbiAqIENvcHlyaWdodCAyMDA5LTIwMTIgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIEluYy5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHJvb3QuUGFyc2UuVkVSU0lPTiA9IFwianMxLjUuMFwiO1xufSh0aGlzKSk7XG4vLyAgICAgVW5kZXJzY29yZS5qcyAxLjQuNFxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgSW5jLlxuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjQuNCc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfLmhhcyhvYmosIGtleSkpIHtcbiAgICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIWl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycywgZmlyc3QpIHtcbiAgICBpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIGZpcnN0ID8gbnVsbCA6IFtdO1xuICAgIHJldHVybiBfW2ZpcnN0ID8gJ2ZpbmQnIDogJ2ZpbHRlciddKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gdmFsdWVba2V5XSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy53aGVyZShvYmosIGF0dHJzLCB0cnVlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCBvciAoZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIC8vIENhbid0IG9wdGltaXplIGFycmF5cyBvZiBpbnRlZ2VycyBsb25nZXIgdGhhbiA2NSw1MzUgZWxlbWVudHMuXG4gIC8vIFNlZTogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTgwNzk3XG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiAtSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IC1JbmZpbml0eSwgdmFsdWU6IC1JbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkID49IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzRW1wdHkob2JqKSkgcmV0dXJuIEluZmluaXR5O1xuICAgIHZhciByZXN1bHQgPSB7Y29tcHV0ZWQgOiBJbmZpbml0eSwgdmFsdWU6IEluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPCByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGFuIGFycmF5LlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmFuZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzaHVmZmxlZCA9IFtdO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKGluZGV4KyspO1xuICAgICAgc2h1ZmZsZWRbaW5kZXggLSAxXSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbG9va3VwIGl0ZXJhdG9ycy5cbiAgdmFyIGxvb2t1cEl0ZXJhdG9yID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlIDogZnVuY3Rpb24ob2JqKXsgcmV0dXJuIG9ialt2YWx1ZV07IH07XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdG9yLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlIDogdmFsdWUsXG4gICAgICAgIGluZGV4IDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhIDogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggPCByaWdodC5pbmRleCA/IC0xIDogMTtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0LCBiZWhhdmlvcikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSB8fCBfLmlkZW50aXR5KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICB2YXIga2V5ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBncm91cChvYmosIHZhbHVlLCBjb250ZXh0LCBmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICAgIChfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSA6IChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICAgIGlmICghXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSA9IDA7XG4gICAgICByZXN1bHRba2V5XSsrO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciA9IGl0ZXJhdG9yID09IG51bGwgPyBfLmlkZW50aXR5IDogbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbbWlkXSkgPCB2YWx1ZSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjb252ZXJ0IGFueXRoaW5nIGl0ZXJhYmxlIGludG8gYSByZWFsLCBsaXZlIGFycmF5LlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHJldHVybiAobiAhPSBudWxsKSAmJiAhZ3VhcmQgPyBzbGljZS5jYWxsKGFycmF5LCAwLCBuKSA6IGFycmF5WzBdO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuICE9IG51bGwpICYmICFndWFyZCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb21wbGV0ZWx5IGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIGFuIGFycmF5LlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yob3RoZXIsIGl0ZW0pID49IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmdzLCAnbGVuZ3RoJykpO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJncywgXCJcIiArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbiA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbikge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQgJiYgbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYWxsIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdFxuICAvLyBhbGwgY2FsbGJhY2tzIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIGZ1bmNzID0gXy5mdW5jdGlvbnMob2JqKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHRpbWVvdXQsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBuZXcgRGF0ZTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIHJlc3VsdDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgcmFuID0gZmFsc2UsIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhbikgcmV0dXJuIG1lbW87XG4gICAgICByYW4gPSB0cnVlO1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZnVuY107XG4gICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICBpZiAodGltZXMgPD0gMCkgcmV0dXJuIGZ1bmMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gT2JqZWN0KG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzW2tleXMubGVuZ3RoXSA9IGtleTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHZhbHVlcy5wdXNoKG9ialtrZXldKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHBhaXJzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcGFpcnMucHVzaChba2V5LCBvYmpba2V5XV0pO1xuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJlc3VsdFtvYmpba2V5XV0gPSBrZXk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBudWxsKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIEhhcm1vbnkgYGVnYWxgIHByb3Bvc2FsOiBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PSArYjtcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09IGI7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIChiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgICAgICBpZiAoXy5oYXMoYSwga2V5KSkge1xuICAgICAgICAgIC8vIENvdW50IHRoZSBleHBlY3RlZCBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyLlxuICAgICAgICAgIGlmICghKHJlc3VsdCA9IF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gYikge1xuICAgICAgICAgIGlmIChfLmhhcyhiLCBrZXkpICYmICEoc2l6ZS0tKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gIXNpemU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiLCBbXSwgW10pO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAuXG4gIGVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICEhKG9iaiAmJiBfLmhhcyhvYmosICdjYWxsZWUnKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS5cbiAgaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0b3JzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KG4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAnLyc6ICcmI3gyRjsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIHByb3BlcnR5IGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQ7XG4gIC8vIG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbn0pLmNhbGwodGhpcyk7XG5cbi8qZ2xvYmFsIF86IGZhbHNlLCAkOiBmYWxzZSwgbG9jYWxTdG9yYWdlOiBmYWxzZSwgcHJvY2VzczogdHJ1ZSxcbiAgWE1MSHR0cFJlcXVlc3Q6IGZhbHNlLCBYRG9tYWluUmVxdWVzdDogZmFsc2UsIGV4cG9ydHM6IGZhbHNlLFxuICByZXF1aXJlOiBmYWxzZSwgc2V0VGltZW91dDogdHJ1ZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIC8qKlxuICAgKiBDb250YWlucyBhbGwgUGFyc2UgQVBJIGNsYXNzZXMgYW5kIGZ1bmN0aW9ucy5cbiAgICogQG5hbWUgUGFyc2VcbiAgICogQG5hbWVzcGFjZVxuICAgKlxuICAgKiBDb250YWlucyBhbGwgUGFyc2UgQVBJIGNsYXNzZXMgYW5kIGZ1bmN0aW9ucy5cbiAgICovXG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG5cbiAgdmFyIHJlcSA9IHR5cGVvZihyZXF1aXJlKSA9PT0gJ2Z1bmN0aW9uJyA/IHJlcXVpcmUgOiBudWxsO1xuICAvLyBMb2FkIHJlZmVyZW5jZXMgdG8gb3RoZXIgZGVwZW5kZW5jaWVzXG4gIGlmICh0eXBlb2YoWE1MSHR0cFJlcXVlc3QpICE9PSAndW5kZWZpbmVkJykge1xuICAgIFBhcnNlLlhNTEh0dHBSZXF1ZXN0ID0gWE1MSHR0cFJlcXVlc3Q7XG4gIH0gZWxzZSBpZiAodHlwZW9mKHJlcXVpcmUpID09PSAnZnVuY3Rpb24nICYmXG4gICAgICB0eXBlb2YocmVxdWlyZS5lbnN1cmUpID09PSAndW5kZWZpbmVkJykge1xuICAgIFBhcnNlLlhNTEh0dHBSZXF1ZXN0ID0gcmVxKCd4bWxodHRwcmVxdWVzdCcpLlhNTEh0dHBSZXF1ZXN0O1xuICB9XG4gIC8vIEltcG9ydCBQYXJzZSdzIGxvY2FsIGNvcHkgb2YgdW5kZXJzY29yZS5cbiAgaWYgKHR5cGVvZihleHBvcnRzKSAhPT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0cy5fKSB7XG4gICAgLy8gV2UncmUgcnVubmluZyBpbiBhIENvbW1vbkpTIGVudmlyb25tZW50XG4gICAgUGFyc2UuXyA9IGV4cG9ydHMuXy5ub0NvbmZsaWN0KCk7XG4gICAgZXhwb3J0cy5QYXJzZSA9IFBhcnNlO1xuICB9IGVsc2Uge1xuICAgIFBhcnNlLl8gPSBfLm5vQ29uZmxpY3QoKTtcbiAgfVxuXG4gIC8vIElmIGpRdWVyeSBvciBaZXB0byBoYXMgYmVlbiBpbmNsdWRlZCwgZ3JhYiBhIHJlZmVyZW5jZSB0byBpdC5cbiAgaWYgKHR5cGVvZigkKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFBhcnNlLiQgPSAkO1xuICB9XG5cbiAgLy8gSGVscGVyc1xuICAvLyAtLS0tLS0tXG5cbiAgLy8gU2hhcmVkIGVtcHR5IGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGFpZCBpbiBwcm90b3R5cGUtY2hhaW4gY3JlYXRpb24uXG4gIHZhciBFbXB0eUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oKSB7fTtcblxuICAvLyBUT0RPOiBmaXggdGhpcyBzbyB0aGF0IFBhcnNlT2JqZWN0cyBhcmVuJ3QgYWxsIGNhbGxlZCBcImNoaWxkXCIgaW4gZGVidWdnZXIuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb3JyZWN0bHkgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sIGZvciBzdWJjbGFzc2VzLlxuICAvLyBTaW1pbGFyIHRvIGBnb29nLmluaGVyaXRzYCwgYnV0IHVzZXMgYSBoYXNoIG9mIHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFuZFxuICAvLyBjbGFzcyBwcm9wZXJ0aWVzIHRvIGJlIGV4dGVuZGVkLlxuICB2YXIgaW5oZXJpdHMgPSBmdW5jdGlvbihwYXJlbnQsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgdmFyIGNoaWxkO1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuICAgIC8vICh0aGUgXCJjb25zdHJ1Y3RvclwiIHByb3BlcnR5IGluIHlvdXIgYGV4dGVuZGAgZGVmaW5pdGlvbiksIG9yIGRlZmF1bHRlZFxuICAgIC8vIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQncyBjb25zdHJ1Y3Rvci5cbiAgICBpZiAocHJvdG9Qcm9wcyAmJiBwcm90b1Byb3BzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XG4gICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qKiBAaWdub3JlICovXG4gICAgICBjaGlsZCA9IGZ1bmN0aW9uKCl7IHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIH1cblxuICAgIC8vIEluaGVyaXQgY2xhc3MgKHN0YXRpYykgcHJvcGVydGllcyBmcm9tIHBhcmVudC5cbiAgICBQYXJzZS5fLmV4dGVuZChjaGlsZCwgcGFyZW50KTtcblxuICAgIC8vIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgLy8gYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICBFbXB0eUNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG4gICAgY2hpbGQucHJvdG90eXBlID0gbmV3IEVtcHR5Q29uc3RydWN0b3IoKTtcblxuICAgIC8vIEFkZCBwcm90b3R5cGUgcHJvcGVydGllcyAoaW5zdGFuY2UgcHJvcGVydGllcykgdG8gdGhlIHN1YmNsYXNzLFxuICAgIC8vIGlmIHN1cHBsaWVkLlxuICAgIGlmIChwcm90b1Byb3BzKSB7XG4gICAgICBQYXJzZS5fLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIH1cblxuICAgIC8vIEFkZCBzdGF0aWMgcHJvcGVydGllcyB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24sIGlmIHN1cHBsaWVkLlxuICAgIGlmIChzdGF0aWNQcm9wcykge1xuICAgICAgUGFyc2UuXy5leHRlbmQoY2hpbGQsIHN0YXRpY1Byb3BzKTtcbiAgICB9XG5cbiAgICAvLyBDb3JyZWN0bHkgc2V0IGNoaWxkJ3MgYHByb3RvdHlwZS5jb25zdHJ1Y3RvcmAuXG4gICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG5cbiAgICAvLyBTZXQgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSBpbiBjYXNlIHRoZSBwYXJlbnQncyBwcm90b3R5cGUgaXNcbiAgICAvLyBuZWVkZWQgbGF0ZXIuXG4gICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICAgIHJldHVybiBjaGlsZDtcbiAgfTtcblxuICAvLyBTZXQgdGhlIHNlcnZlciBmb3IgUGFyc2UgdG8gdGFsayB0by5cbiAgUGFyc2Uuc2VydmVyVVJMID0gXCJodHRwczovL2FwaS5wYXJzZS5jb21cIjtcblxuICAvLyBDaGVjayB3aGV0aGVyIHdlIGFyZSBydW5uaW5nIGluIE5vZGUuanMuXG4gIGlmICh0eXBlb2YocHJvY2VzcykgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgIHByb2Nlc3MudmVyc2lvbnMgJiZcbiAgICAgIHByb2Nlc3MudmVyc2lvbnMubm9kZSkge1xuICAgIFBhcnNlLl9pc05vZGUgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgdGhpcyBtZXRob2QgZmlyc3QgdG8gc2V0IHVwIHlvdXIgYXV0aGVudGljYXRpb24gdG9rZW5zIGZvciBQYXJzZS5cbiAgICogWW91IGNhbiBnZXQgeW91ciBrZXlzIGZyb20gdGhlIERhdGEgQnJvd3NlciBvbiBwYXJzZS5jb20uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcHBsaWNhdGlvbklkIFlvdXIgUGFyc2UgQXBwbGljYXRpb24gSUQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBqYXZhU2NyaXB0S2V5IFlvdXIgUGFyc2UgSmF2YVNjcmlwdCBLZXkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtYXN0ZXJLZXkgKG9wdGlvbmFsKSBZb3VyIFBhcnNlIE1hc3RlciBLZXkuIChOb2RlLmpzIG9ubHkhKVxuICAgKi9cbiAgUGFyc2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKGFwcGxpY2F0aW9uSWQsIGphdmFTY3JpcHRLZXksIG1hc3RlcktleSkge1xuICAgIGlmIChtYXN0ZXJLZXkpIHtcbiAgICAgIHRocm93IFwiUGFyc2UuaW5pdGlhbGl6ZSgpIHdhcyBwYXNzZWQgYSBNYXN0ZXIgS2V5LCB3aGljaCBpcyBvbmx5IFwiICtcbiAgICAgICAgXCJhbGxvd2VkIGZyb20gd2l0aGluIE5vZGUuanMuXCI7XG4gICAgfVxuICAgIFBhcnNlLl9pbml0aWFsaXplKGFwcGxpY2F0aW9uSWQsIGphdmFTY3JpcHRLZXkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoaXMgbWV0aG9kIGZpcnN0IHRvIHNldCB1cCBtYXN0ZXIgYXV0aGVudGljYXRpb24gdG9rZW5zIGZvciBQYXJzZS5cbiAgICogVGhpcyBtZXRob2QgaXMgZm9yIFBhcnNlJ3Mgb3duIHByaXZhdGUgdXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYXBwbGljYXRpb25JZCBZb3VyIFBhcnNlIEFwcGxpY2F0aW9uIElELlxuICAgKiBAcGFyYW0ge1N0cmluZ30gamF2YVNjcmlwdEtleSBZb3VyIFBhcnNlIEphdmFTY3JpcHQgS2V5LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWFzdGVyS2V5IFlvdXIgUGFyc2UgTWFzdGVyIEtleS5cbiAgICovXG4gIFBhcnNlLl9pbml0aWFsaXplID0gZnVuY3Rpb24oYXBwbGljYXRpb25JZCwgamF2YVNjcmlwdEtleSwgbWFzdGVyS2V5KSB7XG4gICAgUGFyc2UuYXBwbGljYXRpb25JZCA9IGFwcGxpY2F0aW9uSWQ7XG4gICAgUGFyc2UuamF2YVNjcmlwdEtleSA9IGphdmFTY3JpcHRLZXk7XG4gICAgUGFyc2UubWFzdGVyS2V5ID0gbWFzdGVyS2V5O1xuICAgIFBhcnNlLl91c2VNYXN0ZXJLZXkgPSBmYWxzZTtcbiAgfTtcblxuICAvLyBJZiB3ZSdyZSBydW5uaW5nIGluIG5vZGUuanMsIGFsbG93IHVzaW5nIHRoZSBtYXN0ZXIga2V5LlxuICBpZiAoUGFyc2UuX2lzTm9kZSkge1xuICAgIFBhcnNlLmluaXRpYWxpemUgPSBQYXJzZS5faW5pdGlhbGl6ZTtcblxuICAgIFBhcnNlLkNsb3VkID0gUGFyc2UuQ2xvdWQgfHwge307XG4gICAgLyoqXG4gICAgICogU3dpdGNoZXMgdGhlIFBhcnNlIFNESyB0byB1c2luZyB0aGUgTWFzdGVyIGtleS4gIFRoZSBNYXN0ZXIga2V5IGdyYW50c1xuICAgICAqIHByaXZlbGVnZWQgYWNjZXNzIHRvIHRoZSBkYXRhIGluIFBhcnNlIGFuZCBjYW4gYmUgdXNlZCB0byBieXBhc3MgQUNMcyBhbmRcbiAgICAgKiBvdGhlciByZXN0cmljdGlvbnMgdGhhdCBhcmUgYXBwbGllZCB0byB0aGUgY2xpZW50IFNES3MuXG4gICAgICogPHA+PHN0cm9uZz48ZW0+QXZhaWxhYmxlIGluIENsb3VkIENvZGUgYW5kIE5vZGUuanMgb25seS48L2VtPjwvc3Ryb25nPlxuICAgICAqIDwvcD5cbiAgICAgKi9cbiAgICBQYXJzZS5DbG91ZC51c2VNYXN0ZXJLZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIFBhcnNlLl91c2VNYXN0ZXJLZXkgPSB0cnVlO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBwcmVmaXggZm9yIFN0b3JhZ2Uga2V5cyB1c2VkIGJ5IHRoaXMgaW5zdGFuY2Ugb2YgUGFyc2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSByZWxhdGl2ZSBzdWZmaXggdG8gYXBwZW5kIHRvIGl0LlxuICAgKiAgICAgbnVsbCBvciB1bmRlZmluZWQgaXMgdHJlYXRlZCBhcyB0aGUgZW1wdHkgc3RyaW5nLlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBmdWxsIGtleSBuYW1lLlxuICAgKi9cbiAgUGFyc2UuX2dldFBhcnNlUGF0aCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBpZiAoIVBhcnNlLmFwcGxpY2F0aW9uSWQpIHtcbiAgICAgIHRocm93IFwiWW91IG5lZWQgdG8gY2FsbCBQYXJzZS5pbml0aWFsaXplIGJlZm9yZSB1c2luZyBQYXJzZS5cIjtcbiAgICB9XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gXCJcIjtcbiAgICB9XG4gICAgaWYgKCFQYXJzZS5fLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICB0aHJvdyBcIlRyaWVkIHRvIGdldCBhIFN0b3JhZ2UgcGF0aCB0aGF0IHdhc24ndCBhIFN0cmluZy5cIjtcbiAgICB9XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMSk7XG4gICAgfVxuICAgIHJldHVybiBcIlBhcnNlL1wiICsgUGFyc2UuYXBwbGljYXRpb25JZCArIFwiL1wiICsgcGF0aDtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIFByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSB1bmlxdWUgc3RyaW5nIGZvciB0aGlzIGFwcCBvblxuICAgKiB0aGlzIG1hY2hpbmUuXG4gICAqIEdldHMgcmVzZXQgd2hlbiBTdG9yYWdlIGlzIGNsZWFyZWQuXG4gICAqL1xuICBQYXJzZS5faW5zdGFsbGF0aW9uSWQgPSBudWxsO1xuICBQYXJzZS5fZ2V0SW5zdGFsbGF0aW9uSWQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBTZWUgaWYgaXQncyBjYWNoZWQgaW4gUkFNLlxuICAgIGlmIChQYXJzZS5faW5zdGFsbGF0aW9uSWQpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFBhcnNlLl9pbnN0YWxsYXRpb25JZCk7XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIGdldCBpdCBmcm9tIFN0b3JhZ2UuXG4gICAgdmFyIHBhdGggPSBQYXJzZS5fZ2V0UGFyc2VQYXRoKFwiaW5zdGFsbGF0aW9uSWRcIik7XG4gICAgcmV0dXJuIChQYXJzZS5TdG9yYWdlLmdldEl0ZW1Bc3luYyhwYXRoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgUGFyc2UuX2luc3RhbGxhdGlvbklkID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKCFQYXJzZS5faW5zdGFsbGF0aW9uSWQgfHwgUGFyc2UuX2luc3RhbGxhdGlvbklkID09PSBcIlwiKSB7XG4gICAgICAgICAgLy8gSXQgd2Fzbid0IGluIFN0b3JhZ2UsIHNvIGNyZWF0ZSBhIG5ldyBvbmUuXG4gICAgICAgICAgdmFyIGhleE9jdGV0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICBNYXRoLmZsb29yKCgxK01hdGgucmFuZG9tKCkpKjB4MTAwMDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBQYXJzZS5faW5zdGFsbGF0aW9uSWQgPSAoXG4gICAgICAgICAgICBoZXhPY3RldCgpICsgaGV4T2N0ZXQoKSArIFwiLVwiICtcbiAgICAgICAgICAgIGhleE9jdGV0KCkgKyBcIi1cIiArXG4gICAgICAgICAgICBoZXhPY3RldCgpICsgXCItXCIgK1xuICAgICAgICAgICAgaGV4T2N0ZXQoKSArIFwiLVwiICtcbiAgICAgICAgICAgIGhleE9jdGV0KCkgKyBoZXhPY3RldCgpICsgaGV4T2N0ZXQoKSk7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlN0b3JhZ2Uuc2V0SXRlbUFzeW5jKHBhdGgsIFBhcnNlLl9pbnN0YWxsYXRpb25JZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhQYXJzZS5faW5zdGFsbGF0aW9uSWQpO1xuICAgICAgfSlcbiAgICApO1xuICB9O1xuXG4gIFBhcnNlLl9wYXJzZURhdGUgPSBmdW5jdGlvbihpc284NjAxKSB7XG4gICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoXG4gICAgICBcIl4oWzAtOV17MSw0fSktKFswLTldezEsMn0pLShbMC05XXsxLDJ9KVwiICsgXCJUXCIgK1xuICAgICAgXCIoWzAtOV17MSwyfSk6KFswLTldezEsMn0pOihbMC05XXsxLDJ9KVwiICtcbiAgICAgIFwiKC4oWzAtOV0rKSk/XCIgKyBcIlokXCIpO1xuICAgIHZhciBtYXRjaCA9IHJlZ2V4cC5leGVjKGlzbzg2MDEpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciB5ZWFyID0gbWF0Y2hbMV0gfHwgMDtcbiAgICB2YXIgbW9udGggPSAobWF0Y2hbMl0gfHwgMSkgLSAxO1xuICAgIHZhciBkYXkgPSBtYXRjaFszXSB8fCAwO1xuICAgIHZhciBob3VyID0gbWF0Y2hbNF0gfHwgMDtcbiAgICB2YXIgbWludXRlID0gbWF0Y2hbNV0gfHwgMDtcbiAgICB2YXIgc2Vjb25kID0gbWF0Y2hbNl0gfHwgMDtcbiAgICB2YXIgbWlsbGkgPSBtYXRjaFs4XSB8fCAwO1xuXG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaSkpO1xuICB9O1xuXG4gIFBhcnNlLl9hamF4SUU4ID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgdmFyIHhkciA9IG5ldyBYRG9tYWluUmVxdWVzdCgpO1xuICAgIHhkci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXNwb25zZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4ZHIucmVzcG9uc2VUZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHhkci5vbmVycm9yID0geGRyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTGV0J3MgZmFrZSBhIHJlYWwgZXJyb3IgbWVzc2FnZS5cbiAgICAgIHZhciBmYWtlUmVzcG9uc2UgPSB7XG4gICAgICAgIHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNvZGU6IFBhcnNlLkVycm9yLlhfRE9NQUlOX1JFUVVFU1QsXG4gICAgICAgICAgZXJyb3I6IFwiSUUncyBYRG9tYWluUmVxdWVzdCBkb2VzIG5vdCBzdXBwbHkgZXJyb3IgaW5mby5cIlxuICAgICAgICB9KVxuICAgICAgfTtcbiAgICAgIHByb21pc2UucmVqZWN0KGZha2VSZXNwb25zZSk7XG4gICAgfTtcbiAgICB4ZHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge307XG4gICAgeGRyLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgIHhkci5zZW5kKGRhdGEpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIFBhcnNlLl91c2VYRG9tYWluUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YoWERvbWFpblJlcXVlc3QpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAvLyBXZSdyZSBpbiBJRSA4Ky5cbiAgICAgIGlmICgnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgWE1MSHR0cFJlcXVlc3QoKSkge1xuICAgICAgICAvLyBXZSdyZSBpbiBJRSAxMCsuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gVE9ETyhrbGltdCk6IEdldCByaWQgb2Ygc3VjY2Vzcy9lcnJvciB1c2FnZSBpbiB3ZWJzaXRlLlxuICBQYXJzZS5fYWpheCA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICAgIGVycm9yOiBlcnJvclxuICAgIH07XG5cbiAgICBpZiAoUGFyc2UuX3VzZVhEb21haW5SZXF1ZXN0KCkpIHtcbiAgICAgIHJldHVybiBQYXJzZS5fYWpheElFOChtZXRob2QsIHVybCwgZGF0YSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgIHZhciBhdHRlbXB0cyA9IDA7XG5cbiAgICB2YXIgZGlzcGF0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBoYW5kbGVkID0gZmFsc2U7XG4gICAgICB2YXIgeGhyID0gbmV3IFBhcnNlLlhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzcG9uc2UsIHhoci5zdGF0dXMsIHhocik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh4aHIuc3RhdHVzID49IDUwMCkgeyAvLyBSZXRyeSBvbiA1WFhcbiAgICAgICAgICAgIGlmICgrK2F0dGVtcHRzIDwgNSkge1xuICAgICAgICAgICAgICAvLyBFeHBvbmVudGlhbGx5LWdyb3dpbmcgZGVsYXlcbiAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gTWF0aC5yb3VuZChcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMTI1ICogTWF0aC5wb3coMiwgYXR0ZW1wdHMpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZGlzcGF0Y2gsIGRlbGF5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEFmdGVyIDUgcmV0cmllcywgZmFpbFxuICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdCh4aHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdCh4aHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluJyk7ICAvLyBhdm9pZCBwcmUtZmxpZ2h0LlxuICAgICAgaWYgKFBhcnNlLl9pc05vZGUpIHtcbiAgICAgICAgLy8gQWRkIGEgc3BlY2lhbCB1c2VyIGFnZW50IGp1c3QgZm9yIHJlcXVlc3QgZnJvbSBub2RlLmpzLlxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlVzZXItQWdlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJQYXJzZS9cIiArIFBhcnNlLlZFUlNJT04gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiAoTm9kZUpTIFwiICsgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgfTtcblxuICAgIGRpc3BhdGNoKCk7XG4gICAgcmV0dXJuIHByb21pc2UuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7IFxuICB9O1xuXG4gIC8vIEEgc2VsZi1wcm9wYWdhdGluZyBleHRlbmQgZnVuY3Rpb24uXG4gIFBhcnNlLl9leHRlbmQgPSBmdW5jdGlvbihwcm90b1Byb3BzLCBjbGFzc1Byb3BzKSB7XG4gICAgdmFyIGNoaWxkID0gaW5oZXJpdHModGhpcywgcHJvdG9Qcm9wcywgY2xhc3NQcm9wcyk7XG4gICAgY2hpbGQuZXh0ZW5kID0gdGhpcy5leHRlbmQ7XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBPcHRpb25zOlxuICAgKiAgIHJvdXRlOiBpcyBjbGFzc2VzLCB1c2VycywgbG9naW4sIGV0Yy5cbiAgICogICBvYmplY3RJZDogbnVsbCBpZiB0aGVyZSBpcyBubyBhc3NvY2lhdGVkIG9iamVjdElkLlxuICAgKiAgIG1ldGhvZDogdGhlIGh0dHAgbWV0aG9kIGZvciB0aGUgUkVTVCBBUEkuXG4gICAqICAgZGF0YU9iamVjdDogdGhlIHBheWxvYWQgYXMgYW4gb2JqZWN0LCBvciBudWxsIGlmIHRoZXJlIGlzIG5vbmUuXG4gICAqICAgdXNlTWFzdGVyS2V5OiBvdmVycmlkZXMgd2hldGhlciB0byB1c2UgdGhlIG1hc3RlciBrZXkgaWYgc2V0LlxuICAgKiBAaWdub3JlXG4gICAqL1xuICBQYXJzZS5fcmVxdWVzdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgcm91dGUgPSBvcHRpb25zLnJvdXRlO1xuICAgIHZhciBjbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcbiAgICB2YXIgb2JqZWN0SWQgPSBvcHRpb25zLm9iamVjdElkO1xuICAgIHZhciBtZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcbiAgICB2YXIgdXNlTWFzdGVyS2V5ID0gb3B0aW9ucy51c2VNYXN0ZXJLZXk7XG4gICAgdmFyIHNlc3Npb25Ub2tlbiA9IG9wdGlvbnMuc2Vzc2lvblRva2VuO1xuICAgIHZhciBkYXRhT2JqZWN0ID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgaWYgKCFQYXJzZS5hcHBsaWNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBcIllvdSBtdXN0IHNwZWNpZnkgeW91ciBhcHBsaWNhdGlvbklkIHVzaW5nIFBhcnNlLmluaXRpYWxpemUuXCI7XG4gICAgfVxuXG4gICAgaWYgKCFQYXJzZS5qYXZhU2NyaXB0S2V5ICYmICFQYXJzZS5tYXN0ZXJLZXkpIHtcbiAgICAgIHRocm93IFwiWW91IG11c3Qgc3BlY2lmeSBhIGtleSB1c2luZyBQYXJzZS5pbml0aWFsaXplLlwiO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFdlIGNhbiByZW1vdmUgdGhpcyBjaGVjayBsYXRlciwgYnV0IGl0J3MgdXNlZnVsIGZvciBkZXZlbG9wbWVudC5cbiAgICBpZiAocm91dGUgIT09IFwiYmF0Y2hcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJjbGFzc2VzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiZXZlbnRzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiZmlsZXNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJmdW5jdGlvbnNcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJsb2dpblwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImxvZ291dFwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInB1c2hcIiAmJlxuICAgICAgICByb3V0ZSAhPT0gXCJyZXF1ZXN0UGFzc3dvcmRSZXNldFwiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInJlc3RfdmVyaWZ5X2FuYWx5dGljc1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInVzZXJzXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwiam9ic1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcImNvbmZpZ1wiICYmXG4gICAgICAgIHJvdXRlICE9PSBcInNlc3Npb25zXCIgJiZcbiAgICAgICAgcm91dGUgIT09IFwidXBncmFkZVRvUmV2b2NhYmxlU2Vzc2lvblwiKSB7XG4gICAgICB0aHJvdyBcIkJhZCByb3V0ZTogJ1wiICsgcm91dGUgKyBcIicuXCI7XG4gICAgfVxuXG4gICAgdmFyIHVybCA9IFBhcnNlLnNlcnZlclVSTDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09IFwiL1wiKSB7XG4gICAgICB1cmwgKz0gXCIvXCI7XG4gICAgfVxuICAgIHVybCArPSBcIjEvXCIgKyByb3V0ZTtcbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICB1cmwgKz0gXCIvXCIgKyBjbGFzc05hbWU7XG4gICAgfVxuICAgIGlmIChvYmplY3RJZCkge1xuICAgICAgdXJsICs9IFwiL1wiICsgb2JqZWN0SWQ7XG4gICAgfVxuXG4gICAgZGF0YU9iamVjdCA9IFBhcnNlLl8uY2xvbmUoZGF0YU9iamVjdCB8fCB7fSk7XG4gICAgaWYgKG1ldGhvZCAhPT0gXCJQT1NUXCIpIHtcbiAgICAgIGRhdGFPYmplY3QuX21ldGhvZCA9IG1ldGhvZDtcbiAgICAgIG1ldGhvZCA9IFwiUE9TVFwiO1xuICAgIH1cblxuICAgIGlmIChQYXJzZS5fLmlzVW5kZWZpbmVkKHVzZU1hc3RlcktleSkpIHtcbiAgICAgIHVzZU1hc3RlcktleSA9IFBhcnNlLl91c2VNYXN0ZXJLZXk7XG4gICAgfVxuXG4gICAgZGF0YU9iamVjdC5fQXBwbGljYXRpb25JZCA9IFBhcnNlLmFwcGxpY2F0aW9uSWQ7XG4gICAgaWYgKCF1c2VNYXN0ZXJLZXkpIHtcbiAgICAgIGRhdGFPYmplY3QuX0phdmFTY3JpcHRLZXkgPSBQYXJzZS5qYXZhU2NyaXB0S2V5O1xuICAgIH0gZWxzZSBpZiAoIVBhcnNlLm1hc3RlcktleSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIHRoZSBNYXN0ZXIgS2V5LCBpdCBoYXMgbm90IGJlZW4gcHJvdmlkZWQuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFPYmplY3QuX01hc3RlcktleSA9IFBhcnNlLm1hc3RlcktleTtcbiAgICB9XG5cbiAgICBkYXRhT2JqZWN0Ll9DbGllbnRWZXJzaW9uID0gUGFyc2UuVkVSU0lPTjtcblxuICAgIHJldHVybiBQYXJzZS5fZ2V0SW5zdGFsbGF0aW9uSWQoKS50aGVuKGZ1bmN0aW9uKGlpZCkge1xuICAgICAgZGF0YU9iamVjdC5fSW5zdGFsbGF0aW9uSWQgPSBpaWQ7XG5cbiAgICAgIGlmIChzZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoeyBfc2Vzc2lvblRva2VuOiBzZXNzaW9uVG9rZW4gfSk7XG4gICAgICB9XG4gICAgICBpZiAoIVBhcnNlLlVzZXIuX2NhblVzZUN1cnJlbnRVc2VyKCkpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMobnVsbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9jdXJyZW50QXN5bmMoKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGN1cnJlbnRVc2VyKSB7XG4gICAgICBpZiAoY3VycmVudFVzZXIgJiYgY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbikge1xuICAgICAgICBkYXRhT2JqZWN0Ll9TZXNzaW9uVG9rZW4gPSBjdXJyZW50VXNlci5fc2Vzc2lvblRva2VuO1xuICAgICAgfVxuXG4gICAgICBpZiAoUGFyc2UuVXNlci5faXNSZXZvY2FibGVTZXNzaW9uRW5hYmxlZCkge1xuICAgICAgICBkYXRhT2JqZWN0Ll9SZXZvY2FibGVTZXNzaW9uID0gJzEnO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGFPYmplY3QpO1xuXG4gICAgICByZXR1cm4gUGFyc2UuX2FqYXgobWV0aG9kLCB1cmwsIGRhdGEpO1xuICAgIH0pLnRoZW4obnVsbCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIC8vIFRyYW5zZm9ybSB0aGUgZXJyb3IgaW50byBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvciBieSB0cnlpbmcgdG8gcGFyc2VcbiAgICAgIC8vIHRoZSBlcnJvciBzdHJpbmcgYXMgSlNPTi5cbiAgICAgIHZhciBlcnJvcjtcbiAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZXJyb3JKU09OID0gSlNPTi5wYXJzZShyZXNwb25zZS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKGVycm9ySlNPTi5jb2RlLCBlcnJvckpTT04uZXJyb3IpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gSWYgd2UgZmFpbCB0byBwYXJzZSB0aGUgZXJyb3IgdGV4dCwgdGhhdCdzIG9rYXkuXG4gICAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICAgIFBhcnNlLkVycm9yLklOVkFMSURfSlNPTixcbiAgICAgICAgICAgICAgXCJSZWNlaXZlZCBhbiBlcnJvciB3aXRoIGludmFsaWQgSlNPTiBmcm9tIFBhcnNlOiBcIiArXG4gICAgICAgICAgICAgICAgICByZXNwb25zZS5yZXNwb25zZVRleHQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLkNPTk5FQ1RJT05fRkFJTEVELFxuICAgICAgICAgICAgXCJYTUxIdHRwUmVxdWVzdCBmYWlsZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcbiAgICAgIH1cbiAgICAgIC8vIEJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGEgcmVqZWN0ZWQgUHJvbWlzZSwgdGhpcyB3aWxsIHdvcmsgd2l0aFxuICAgICAgLy8gZWl0aGVyIGpRdWVyeSBvciBQcm9taXNlcy9BIHNlbWFudGljcy5cbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGEgdmFsdWUgZnJvbSBhIEJhY2tib25lIG9iamVjdCBhcyBhIHByb3BlcnR5XG4gIC8vIG9yIGFzIGEgZnVuY3Rpb24uXG4gIFBhcnNlLl9nZXRWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcCkge1xuICAgIGlmICghKG9iamVjdCAmJiBvYmplY3RbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIFBhcnNlLl8uaXNGdW5jdGlvbihvYmplY3RbcHJvcF0pID8gb2JqZWN0W3Byb3BdKCkgOiBvYmplY3RbcHJvcF07XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgdmFsdWUgaW4gYSBQYXJzZSBPYmplY3QgaW50byB0aGUgYXBwcm9wcmlhdGUgcmVwcmVzZW50YXRpb24uXG4gICAqIFRoaXMgaXMgdGhlIEpTIGVxdWl2YWxlbnQgb2YgSmF2YSdzIFBhcnNlLm1heWJlUmVmZXJlbmNlQW5kRW5jb2RlKE9iamVjdClcbiAgICogaWYgc2Vlbk9iamVjdHMgaXMgZmFsc2V5LiBPdGhlcndpc2UgYW55IFBhcnNlLk9iamVjdHMgbm90IGluXG4gICAqIHNlZW5PYmplY3RzIHdpbGwgYmUgZnVsbHkgZW1iZWRkZWQgcmF0aGVyIHRoYW4gZW5jb2RlZFxuICAgKiBhcyBhIHBvaW50ZXIuICBUaGlzIGFycmF5IHdpbGwgYmUgdXNlZCB0byBwcmV2ZW50IGdvaW5nIGludG8gYW4gaW5maW5pdGVcbiAgICogbG9vcCBiZWNhdXNlIHdlIGhhdmUgY2lyY3VsYXIgcmVmZXJlbmNlcy4gIElmIHNlZW5PYmplY3RzXG4gICAqIGlzIHNldCwgdGhlbiBub25lIG9mIHRoZSBQYXJzZSBPYmplY3RzIHRoYXQgYXJlIHNlcmlhbGl6ZWQgY2FuIGJlIGRpcnR5LlxuICAgKi9cbiAgUGFyc2UuX2VuY29kZSA9IGZ1bmN0aW9uKHZhbHVlLCBzZWVuT2JqZWN0cywgZGlzYWxsb3dPYmplY3RzKSB7XG4gICAgdmFyIF8gPSBQYXJzZS5fO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgaWYgKGRpc2FsbG93T2JqZWN0cykge1xuICAgICAgICB0aHJvdyBcIlBhcnNlLk9iamVjdHMgbm90IGFsbG93ZWQgaGVyZVwiO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWVuT2JqZWN0cyB8fCBfLmluY2x1ZGUoc2Vlbk9iamVjdHMsIHZhbHVlKSB8fCAhdmFsdWUuX2hhc0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLl90b1BvaW50ZXIoKTtcbiAgICAgIH1cbiAgICAgIGlmICghdmFsdWUuZGlydHkoKSkge1xuICAgICAgICBzZWVuT2JqZWN0cyA9IHNlZW5PYmplY3RzLmNvbmNhdCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiBQYXJzZS5fZW5jb2RlKHZhbHVlLl90b0Z1bGxKU09OKHNlZW5PYmplY3RzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vlbk9iamVjdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FsbG93T2JqZWN0cyk7XG4gICAgICB9XG4gICAgICB0aHJvdyBcIlRyaWVkIHRvIHNhdmUgYW4gb2JqZWN0IHdpdGggYSBwb2ludGVyIHRvIGEgbmV3LCB1bnNhdmVkIG9iamVjdC5cIjtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuQUNMKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9KU09OKCk7XG4gICAgfVxuICAgIGlmIChfLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIGlmIChpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZW5jb2RlIGludmFsaWQgRGF0ZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgXCJfX3R5cGVcIjogXCJEYXRlXCIsIFwiaXNvXCI6IHZhbHVlLnRvSlNPTigpIH07XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkdlb1BvaW50KSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9KU09OKCk7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gXy5tYXAodmFsdWUsIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLl9lbmNvZGUoeCwgc2Vlbk9iamVjdHMsIGRpc2FsbG93T2JqZWN0cyk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUuc291cmNlO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbikge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSlNPTigpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5PcCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvSlNPTigpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5GaWxlKSB7XG4gICAgICBpZiAoIXZhbHVlLnVybCgpKSB7XG4gICAgICAgIHRocm93IFwiVHJpZWQgdG8gc2F2ZSBhbiBvYmplY3QgY29udGFpbmluZyBhbiB1bnNhdmVkIGZpbGUuXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfX3R5cGU6IFwiRmlsZVwiLFxuICAgICAgICBuYW1lOiB2YWx1ZS5uYW1lKCksXG4gICAgICAgIHVybDogdmFsdWUudXJsKClcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgdmFyIG91dHB1dCA9IHt9O1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godmFsdWUsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgb3V0cHV0W2tdID0gUGFyc2UuX2VuY29kZSh2LCBzZWVuT2JqZWN0cywgZGlzYWxsb3dPYmplY3RzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGUgaW52ZXJzZSBmdW5jdGlvbiBvZiBQYXJzZS5fZW5jb2RlLlxuICAgKiBUT0RPOiBtYWtlIGRlY29kZSBub3QgbXV0YXRlIHZhbHVlLlxuICAgKi9cbiAgUGFyc2UuX2RlY29kZSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgXyA9IFBhcnNlLl87XG4gICAgaWYgKCFfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgUGFyc2UuX2FycmF5RWFjaCh2YWx1ZSwgZnVuY3Rpb24odiwgaykge1xuICAgICAgICB2YWx1ZVtrXSA9IFBhcnNlLl9kZWNvZGUoaywgdik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLkZpbGUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT3ApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fb3ApIHtcbiAgICAgIHJldHVybiBQYXJzZS5PcC5fZGVjb2RlKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJQb2ludGVyXCIgJiYgdmFsdWUuY2xhc3NOYW1lKSB7XG4gICAgICB2YXIgcG9pbnRlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKHZhbHVlLmNsYXNzTmFtZSk7XG4gICAgICBwb2ludGVyLl9maW5pc2hGZXRjaCh7IG9iamVjdElkOiB2YWx1ZS5vYmplY3RJZCB9LCBmYWxzZSk7XG4gICAgICByZXR1cm4gcG9pbnRlcjtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJPYmplY3RcIiAmJiB2YWx1ZS5jbGFzc05hbWUpIHtcbiAgICAgIC8vIEl0J3MgYW4gT2JqZWN0IGluY2x1ZGVkIGluIGEgcXVlcnkgcmVzdWx0LlxuICAgICAgdmFyIGNsYXNzTmFtZSA9IHZhbHVlLmNsYXNzTmFtZTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS5fX3R5cGU7XG4gICAgICBkZWxldGUgdmFsdWUuY2xhc3NOYW1lO1xuICAgICAgdmFyIG9iamVjdCA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKGNsYXNzTmFtZSk7XG4gICAgICBvYmplY3QuX2ZpbmlzaEZldGNoKHZhbHVlLCB0cnVlKTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5fX3R5cGUgPT09IFwiRGF0ZVwiKSB7XG4gICAgICByZXR1cm4gUGFyc2UuX3BhcnNlRGF0ZSh2YWx1ZS5pc28pO1xuICAgIH1cbiAgICBpZiAodmFsdWUuX190eXBlID09PSBcIkdlb1BvaW50XCIpIHtcbiAgICAgIHJldHVybiBuZXcgUGFyc2UuR2VvUG9pbnQoe1xuICAgICAgICBsYXRpdHVkZTogdmFsdWUubGF0aXR1ZGUsXG4gICAgICAgIGxvbmdpdHVkZTogdmFsdWUubG9uZ2l0dWRlXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gXCJBQ0xcIikge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuQUNMKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUGFyc2UuQUNMKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJSZWxhdGlvblwiKSB7XG4gICAgICB2YXIgcmVsYXRpb24gPSBuZXcgUGFyc2UuUmVsYXRpb24obnVsbCwga2V5KTtcbiAgICAgIHJlbGF0aW9uLnRhcmdldENsYXNzTmFtZSA9IHZhbHVlLmNsYXNzTmFtZTtcbiAgICAgIHJldHVybiByZWxhdGlvbjtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9fdHlwZSA9PT0gXCJGaWxlXCIpIHtcbiAgICAgIHZhciBmaWxlID0gbmV3IFBhcnNlLkZpbGUodmFsdWUubmFtZSk7XG4gICAgICBmaWxlLl91cmwgPSB2YWx1ZS51cmw7XG4gICAgICByZXR1cm4gZmlsZTtcbiAgICB9XG4gICAgUGFyc2UuX29iamVjdEVhY2godmFsdWUsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgIHZhbHVlW2tdID0gUGFyc2UuX2RlY29kZShrLCB2KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgUGFyc2UuX2FycmF5RWFjaCA9IFBhcnNlLl8uZWFjaDtcblxuICAvKipcbiAgICogRG9lcyBhIGRlZXAgdHJhdmVyc2FsIG9mIGV2ZXJ5IGl0ZW0gaW4gb2JqZWN0LCBjYWxsaW5nIGZ1bmMgb24gZXZlcnkgb25lLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gdHJhdmVyc2UgZGVlcGx5LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBldmVyeSBpdGVtLiBJdCB3aWxsXG4gICAqICAgICBiZSBwYXNzZWQgdGhlIGl0ZW0gYXMgYW4gYXJndW1lbnQuIElmIGl0IHJldHVybnMgYSB0cnV0aHkgdmFsdWUsIHRoYXRcbiAgICogICAgIHZhbHVlIHdpbGwgcmVwbGFjZSB0aGUgaXRlbSBpbiBpdHMgcGFyZW50IGNvbnRhaW5lci5cbiAgICogQHJldHVybnMge30gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGZ1bmMgb24gdGhlIHRvcC1sZXZlbCBvYmplY3QgaXRzZWxmLlxuICAgKi9cbiAgUGFyc2UuX3RyYXZlcnNlID0gZnVuY3Rpb24ob2JqZWN0LCBmdW5jLCBzZWVuKSB7XG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgc2VlbiA9IHNlZW4gfHwgW107XG4gICAgICBpZiAoUGFyc2UuXy5pbmRleE9mKHNlZW4sIG9iamVjdCkgPj0gMCkge1xuICAgICAgICAvLyBXZSd2ZSBhbHJlYWR5IHZpc2l0ZWQgdGhpcyBvYmplY3QgaW4gdGhpcyBjYWxsLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWVuLnB1c2gob2JqZWN0KTtcbiAgICAgIFBhcnNlLl90cmF2ZXJzZShvYmplY3QuYXR0cmlidXRlcywgZnVuYywgc2Vlbik7XG4gICAgICByZXR1cm4gZnVuYyhvYmplY3QpO1xuICAgIH1cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuUmVsYXRpb24gfHwgb2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgLy8gTm90aGluZyBuZWVkcyB0byBiZSBkb25lLCBidXQgd2UgZG9uJ3Qgd2FudCB0byByZWN1cnNlIGludG8gdGhlXG4gICAgICAvLyBvYmplY3QncyBwYXJlbnQgaW5maW5pdGVseSwgc28gd2UgY2F0Y2ggdGhpcyBjYXNlLlxuICAgICAgcmV0dXJuIGZ1bmMob2JqZWN0KTtcbiAgICB9XG4gICAgaWYgKFBhcnNlLl8uaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBQYXJzZS5fLmVhY2gob2JqZWN0LCBmdW5jdGlvbihjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgdmFyIG5ld0NoaWxkID0gUGFyc2UuX3RyYXZlcnNlKGNoaWxkLCBmdW5jLCBzZWVuKTtcbiAgICAgICAgaWYgKG5ld0NoaWxkKSB7XG4gICAgICAgICAgb2JqZWN0W2luZGV4XSA9IG5ld0NoaWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gICAgfVxuICAgIGlmIChQYXJzZS5fLmlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIFBhcnNlLl9lYWNoKG9iamVjdCwgZnVuY3Rpb24oY2hpbGQsIGtleSkge1xuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBQYXJzZS5fdHJhdmVyc2UoY2hpbGQsIGZ1bmMsIHNlZW4pO1xuICAgICAgICBpZiAobmV3Q2hpbGQpIHtcbiAgICAgICAgICBvYmplY3Rba2V5XSA9IG5ld0NoaWxkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jKG9iamVjdCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgbGlrZSBfLmVhY2gsIGV4Y2VwdDpcbiAgICogKiBpdCBkb2Vzbid0IHdvcmsgZm9yIHNvLWNhbGxlZCBhcnJheS1saWtlIG9iamVjdHMsXG4gICAqICogaXQgZG9lcyB3b3JrIGZvciBkaWN0aW9uYXJpZXMgd2l0aCBhIFwibGVuZ3RoXCIgYXR0cmlidXRlLlxuICAgKi9cbiAgUGFyc2UuX29iamVjdEVhY2ggPSBQYXJzZS5fZWFjaCA9IGZ1bmN0aW9uKG9iaiwgY2FsbGJhY2spIHtcbiAgICB2YXIgXyA9IFBhcnNlLl87XG4gICAgaWYgKF8uaXNPYmplY3Qob2JqKSkge1xuICAgICAgXy5lYWNoKF8ua2V5cyhvYmopLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqW2tleV0sIGtleSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKG9iaiwgY2FsbGJhY2spO1xuICAgIH1cbiAgfTtcblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgbnVsbCBvciB1bmRlZmluZWQuXG4gIFBhcnNlLl9pc051bGxPclVuZGVmaW5lZCA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gUGFyc2UuXy5pc051bGwoeCkgfHwgUGFyc2UuXy5pc1VuZGVmaW5lZCh4KTtcbiAgfTtcbn0odGhpcykpO1xuXG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIGxvY2FsU3RvcmFnZTogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICBcbiAgdmFyIFN0b3JhZ2UgPSB7XG4gICAgYXN5bmM6IGZhbHNlLFxuICB9O1xuXG4gIHZhciBoYXNMb2NhbFN0b3JhZ2UgPSAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcpO1xuICBpZiAoaGFzTG9jYWxTdG9yYWdlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdXBwb3J0ZWQnLCB0cnVlKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdzdXBwb3J0ZWQnKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGhhc0xvY2FsU3RvcmFnZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaGFzTG9jYWxTdG9yYWdlKSB7XG4gICAgU3RvcmFnZS5nZXRJdGVtID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHBhdGgpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnNldEl0ZW0gPSBmdW5jdGlvbihwYXRoLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHBhdGgsIHZhbHVlKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHBhdGgpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgfTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBBc3luY1N0b3JhZ2U7XG4gICAgdHJ5IHtcbiAgICAgIEFzeW5jU3RvcmFnZSA9IGV2YWwoXCJyZXF1aXJlKCdBc3luY1N0b3JhZ2UnKVwiKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICAgIFN0b3JhZ2UuYXN5bmMgPSB0cnVlO1xuXG4gICAgICBTdG9yYWdlLmdldEl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdmFyIHAgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgICBBc3luY1N0b3JhZ2UuZ2V0SXRlbShwYXRoLCBmdW5jdGlvbihlcnIsIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcC5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH07XG5cbiAgICAgIFN0b3JhZ2Uuc2V0SXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHAgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgICBBc3luY1N0b3JhZ2Uuc2V0SXRlbShwYXRoLCB2YWx1ZSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcC5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH07XG5cbiAgICAgIFN0b3JhZ2UucmVtb3ZlSXRlbUFzeW5jID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB2YXIgcCA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG4gICAgICAgIEFzeW5jU3RvcmFnZS5yZW1vdmVJdGVtKHBhdGgsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHAucmVqZWN0KGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfTtcblxuICAgICAgU3RvcmFnZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBBc3luY1N0b3JhZ2UuY2xlYXIoKTtcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkgeyB9XG4gIH1cbiAgaWYgKCFTdG9yYWdlLmFzeW5jICYmICFTdG9yYWdlLmdldEl0ZW0pIHtcbiAgICB2YXIgbWVtTWFwID0gU3RvcmFnZS5pbk1lbW9yeU1hcCA9IHt9O1xuICAgIFN0b3JhZ2UuZ2V0SXRlbSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIGlmIChtZW1NYXAuaGFzT3duUHJvcGVydHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG1lbU1hcFtwYXRoXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnNldEl0ZW0gPSBmdW5jdGlvbihwYXRoLCB2YWx1ZSkge1xuICAgICAgbWVtTWFwW3BhdGhdID0gU3RyaW5nKHZhbHVlKTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgZGVsZXRlIG1lbU1hcFtwYXRoXTtcbiAgICB9O1xuXG4gICAgU3RvcmFnZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG1lbU1hcCkge1xuICAgICAgICBpZiAobWVtTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBkZWxldGUgbWVtTWFwW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gV2UgY2FuIHVzZSBzeW5jaHJvbm91cyBtZXRob2RzIGZyb20gYXN5bmMgc2NlbmFyaW9zLCBidXQgbm90IHZpY2UtdmVyc2FcbiAgaWYgKCFTdG9yYWdlLmFzeW5jKSB7XG4gICAgU3RvcmFnZS5nZXRJdGVtQXN5bmMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhcbiAgICAgICAgU3RvcmFnZS5nZXRJdGVtKHBhdGgpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnNldEl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgsIHZhbHVlKSB7XG4gICAgICBTdG9yYWdlLnNldEl0ZW0ocGF0aCwgdmFsdWUpO1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXModmFsdWUpO1xuICAgIH07XG5cbiAgICBTdG9yYWdlLnJlbW92ZUl0ZW1Bc3luYyA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKFxuICAgICAgICBTdG9yYWdlLnJlbW92ZUl0ZW0ocGF0aClcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIFBhcnNlLlN0b3JhZ2UgPSBTdG9yYWdlO1xuXG59KSh0aGlzKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQG5hbWVzcGFjZSBQcm92aWRlcyBhbiBpbnRlcmZhY2UgdG8gUGFyc2UncyBsb2dnaW5nIGFuZCBhbmFseXRpY3MgYmFja2VuZC5cbiAgICovXG4gIFBhcnNlLkFuYWx5dGljcyA9IFBhcnNlLkFuYWx5dGljcyB8fCB7fTtcblxuICBfLmV4dGVuZChQYXJzZS5BbmFseXRpY3MsIC8qKiBAbGVuZHMgUGFyc2UuQW5hbHl0aWNzICovIHtcbiAgICAvKipcbiAgICAgKiBUcmFja3MgdGhlIG9jY3VycmVuY2Ugb2YgYSBjdXN0b20gZXZlbnQgd2l0aCBhZGRpdGlvbmFsIGRpbWVuc2lvbnMuXG4gICAgICogUGFyc2Ugd2lsbCBzdG9yZSBhIGRhdGEgcG9pbnQgYXQgdGhlIHRpbWUgb2YgaW52b2NhdGlvbiB3aXRoIHRoZSBnaXZlblxuICAgICAqIGV2ZW50IG5hbWUuXG4gICAgICpcbiAgICAgKiBEaW1lbnNpb25zIHdpbGwgYWxsb3cgc2VnbWVudGF0aW9uIG9mIHRoZSBvY2N1cnJlbmNlcyBvZiB0aGlzIGN1c3RvbVxuICAgICAqIGV2ZW50LiBLZXlzIGFuZCB2YWx1ZXMgc2hvdWxkIGJlIHtAY29kZSBTdHJpbmd9cywgYW5kIHdpbGwgdGhyb3dcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiBUbyB0cmFjayBhIHVzZXIgc2lnbnVwIGFsb25nIHdpdGggYWRkaXRpb25hbCBtZXRhZGF0YSwgY29uc2lkZXIgdGhlXG4gICAgICogZm9sbG93aW5nOlxuICAgICAqIDxwcmU+XG4gICAgICogdmFyIGRpbWVuc2lvbnMgPSB7XG4gICAgICogIGdlbmRlcjogJ20nLFxuICAgICAqICBzb3VyY2U6ICd3ZWInLFxuICAgICAqICBkYXlUeXBlOiAnd2Vla2VuZCdcbiAgICAgKiB9O1xuICAgICAqIFBhcnNlLkFuYWx5dGljcy50cmFjaygnc2lnbnVwJywgZGltZW5zaW9ucyk7XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBUaGVyZSBpcyBhIGRlZmF1bHQgbGltaXQgb2YgOCBkaW1lbnNpb25zIHBlciBldmVudCB0cmFja2VkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGN1c3RvbSBldmVudCB0byByZXBvcnQgdG8gUGFyc2UgYXNcbiAgICAgKiBoYXZpbmcgaGFwcGVuZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRpbWVuc2lvbnMgVGhlIGRpY3Rpb25hcnkgb2YgaW5mb3JtYXRpb24gYnkgd2hpY2ggdG9cbiAgICAgKiBzZWdtZW50IHRoaXMgZXZlbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgcm91bmQtdHJpcFxuICAgICAqIHRvIHRoZSBzZXJ2ZXIgY29tcGxldGVzLlxuICAgICAqL1xuICAgIHRyYWNrOiBmdW5jdGlvbihuYW1lLCBkaW1lbnNpb25zLCBvcHRpb25zKSB7XG4gICAgICBuYW1lID0gbmFtZSB8fCAnJztcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL15cXHMqLywgJycpO1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG4gICAgICBpZiAobmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgJ0EgbmFtZSBmb3IgdGhlIGN1c3RvbSBldmVudCBtdXN0IGJlIHByb3ZpZGVkJztcbiAgICAgIH1cblxuICAgICAgXy5lYWNoKGRpbWVuc2lvbnMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICghXy5pc1N0cmluZyhrZXkpIHx8ICFfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICB0aHJvdyAndHJhY2soKSBkaW1lbnNpb25zIGV4cGVjdHMga2V5cyBhbmQgdmFsdWVzIG9mIHR5cGUgXCJzdHJpbmdcIi4nO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogJ2V2ZW50cycsXG4gICAgICAgIGNsYXNzTmFtZTogbmFtZSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IHsgZGltZW5zaW9uczogZGltZW5zaW9ucyB9XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9XG4gIH0pO1xufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBjbGFzcyBQYXJzZS5Db25maWcgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBjb25maWd1cmF0aW9uIGRhdGEgdGhhdFxuICAgKiBjYW4gYmUgc2V0IGZyb20gdGhlIFBhcnNlIGRhc2hib2FyZC5cbiAgICovXG4gIFBhcnNlLkNvbmZpZyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMuX2VzY2FwZWRBdHRyaWJ1dGVzID0ge307XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgbW9zdCByZWNlbnRseS1mZXRjaGVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0LCBlaXRoZXIgZnJvbVxuICAgKiBtZW1vcnkgb3IgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHJldHVybiB7UGFyc2UuQ29uZmlnfSBUaGUgbW9zdCByZWNlbnRseS1mZXRjaGVkIFBhcnNlLkNvbmZpZyBpZiBpdFxuICAgKiAgICAgZXhpc3RzLCBlbHNlIGFuIGVtcHR5IFBhcnNlLkNvbmZpZy5cbiAgICovXG4gIFBhcnNlLkNvbmZpZy5jdXJyZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZykge1xuICAgICAgcmV0dXJuIFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZztcbiAgICB9XG5cbiAgICB2YXIgY29uZmlnID0gbmV3IFBhcnNlLkNvbmZpZygpO1xuXG4gICAgaWYgKFBhcnNlLlN0b3JhZ2UuYXN5bmMpIHtcbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZ0RhdGEgPSBQYXJzZS5TdG9yYWdlLmdldEl0ZW0oUGFyc2UuX2dldFBhcnNlUGF0aChcbiAgICAgICAgICBQYXJzZS5Db25maWcuX0NVUlJFTlRfQ09ORklHX0tFWSkpO1xuXG4gICAgaWYgKGNvbmZpZ0RhdGEpIHsgIFxuICAgICAgY29uZmlnLl9maW5pc2hGZXRjaChKU09OLnBhcnNlKGNvbmZpZ0RhdGEpKTtcbiAgICAgIFBhcnNlLkNvbmZpZy5fY3VycmVudENvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyBhIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+c3VjY2VzczogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBnZXQgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAgICogICA8bGk+ZXJyb3I6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZ2V0IGZhaWxzLlxuICAgKiA8L3VsPlxuICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIGEgbmV3bHktY3JlYXRlZFxuICAgKiAgICAgY29uZmlndXJhdGlvbiBvYmplY3Qgd2hlbiB0aGUgZ2V0IGNvbXBsZXRlcy5cbiAgICovXG4gIFBhcnNlLkNvbmZpZy5nZXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgIHJvdXRlOiBcImNvbmZpZ1wiLFxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYgKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UucGFyYW1zKSB7XG4gICAgICAgIHZhciBlcnJvck9iamVjdCA9IG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICBQYXJzZS5FcnJvci5JTlZBTElEX0pTT04sXG4gICAgICAgICAgXCJDb25maWcgSlNPTiByZXNwb25zZSBpbnZhbGlkLlwiKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3JPYmplY3QpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29uZmlnID0gbmV3IFBhcnNlLkNvbmZpZygpO1xuICAgICAgY29uZmlnLl9maW5pc2hGZXRjaChyZXNwb25zZSk7XG4gICAgICBQYXJzZS5Db25maWcuX2N1cnJlbnRDb25maWcgPSBjb25maWc7XG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIFBhcnNlLkNvbmZpZy5wcm90b3R5cGUgPSB7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBIVE1MLWVzY2FwZWQgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqL1xuICAgIGVzY2FwZTogZnVuY3Rpb24oYXR0cikge1xuICAgICAgdmFyIGh0bWwgPSB0aGlzLl9lc2NhcGVkQXR0cmlidXRlc1thdHRyXTtcbiAgICAgIGlmIChodG1sKSB7XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgICAgfVxuICAgICAgdmFyIHZhbCA9IHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgICAgIHZhciBlc2NhcGVkO1xuICAgICAgaWYgKFBhcnNlLl9pc051bGxPclVuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgIGVzY2FwZWQgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVzY2FwZWQgPSBfLmVzY2FwZSh2YWwudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9lc2NhcGVkQXR0cmlidXRlc1thdHRyXSA9IGVzY2FwZWQ7XG4gICAgICByZXR1cm4gZXNjYXBlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIFRoZSBuYW1lIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgfSxcblxuICAgIF9maW5pc2hGZXRjaDogZnVuY3Rpb24oc2VydmVyRGF0YSkge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gUGFyc2UuX2RlY29kZShudWxsLCBfLmNsb25lKHNlcnZlckRhdGEucGFyYW1zKSk7XG4gICAgICBpZiAoIVBhcnNlLlN0b3JhZ2UuYXN5bmMpIHtcbiAgICAgICAgLy8gV2Ugb25seSBwcm92aWRlIGxvY2FsIGNhY2hpbmcgb2YgY29uZmlnIHdpdGggc3luY2hyb25vdXMgU3RvcmFnZVxuICAgICAgICBQYXJzZS5TdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICBQYXJzZS5fZ2V0UGFyc2VQYXRoKFBhcnNlLkNvbmZpZy5fQ1VSUkVOVF9DT05GSUdfS0VZKSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHNlcnZlckRhdGEpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUGFyc2UuQ29uZmlnLl9jdXJyZW50Q29uZmlnID0gbnVsbDtcblxuICBQYXJzZS5Db25maWcuX0NVUlJFTlRfQ09ORklHX0tFWSA9IFwiY3VycmVudENvbmZpZ1wiO1xuXG59KHRoaXMpKTtcblxuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IFBhcnNlLkVycm9yIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBjb2RlIGFuZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY29kZSBBbiBlcnJvciBjb2RlIGNvbnN0YW50IGZyb20gPGNvZGU+UGFyc2UuRXJyb3I8L2NvZGU+LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBBIGRldGFpbGVkIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvci5cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkNsYXNzIHVzZWQgZm9yIGFsbCBvYmplY3RzIHBhc3NlZCB0byBlcnJvciBjYWxsYmFja3MuPC9wPlxuICAgKi9cbiAgUGFyc2UuRXJyb3IgPSBmdW5jdGlvbihjb2RlLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLkVycm9yLCAvKiogQGxlbmRzIFBhcnNlLkVycm9yICovIHtcbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgc29tZSBlcnJvciBvdGhlciB0aGFuIHRob3NlIGVudW1lcmF0ZWQgaGVyZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBPVEhFUl9DQVVTRTogLTEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBzb21ldGhpbmcgaGFzIGdvbmUgd3Jvbmcgd2l0aCB0aGUgc2VydmVyLlxuICAgICAqIElmIHlvdSBnZXQgdGhpcyBlcnJvciBjb2RlLCBpdCBpcyBQYXJzZSdzIGZhdWx0LiBDb250YWN0IHVzIGF0IFxuICAgICAqIGh0dHBzOi8vcGFyc2UuY29tL2hlbHBcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlRFUk5BTF9TRVJWRVJfRVJST1I6IDEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIFBhcnNlIHNlcnZlcnMgZmFpbGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIENPTk5FQ1RJT05fRkFJTEVEOiAxMDAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhlIHNwZWNpZmllZCBvYmplY3QgZG9lc24ndCBleGlzdC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBPQkpFQ1RfTk9UX0ZPVU5EOiAxMDEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgeW91IHRyaWVkIHRvIHF1ZXJ5IHdpdGggYSBkYXRhdHlwZSB0aGF0IGRvZXNuJ3RcbiAgICAgKiBzdXBwb3J0IGl0LCBsaWtlIGV4YWN0IG1hdGNoaW5nIGFuIGFycmF5IG9yIG9iamVjdC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX1FVRVJZOiAxMDIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSBtaXNzaW5nIG9yIGludmFsaWQgY2xhc3NuYW1lLiBDbGFzc25hbWVzIGFyZVxuICAgICAqIGNhc2Utc2Vuc2l0aXZlLiBUaGV5IG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgYW5kIGEtekEtWjAtOV8gYXJlIHRoZVxuICAgICAqIG9ubHkgdmFsaWQgY2hhcmFjdGVycy5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0NMQVNTX05BTUU6IDEwMyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiB1bnNwZWNpZmllZCBvYmplY3QgaWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTUlTU0lOR19PQkpFQ1RfSUQ6IDEwNCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIGtleSBuYW1lLiBLZXlzIGFyZSBjYXNlLXNlbnNpdGl2ZS4gVGhleVxuICAgICAqIG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgYW5kIGEtekEtWjAtOV8gYXJlIHRoZSBvbmx5IHZhbGlkIGNoYXJhY3RlcnMuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9LRVlfTkFNRTogMTA1LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgbWFsZm9ybWVkIHBvaW50ZXIuIFlvdSBzaG91bGQgbm90IHNlZSB0aGlzIHVubGVzc1xuICAgICAqIHlvdSBoYXZlIGJlZW4gbXVja2luZyBhYm91dCBjaGFuZ2luZyBpbnRlcm5hbCBQYXJzZSBjb2RlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfUE9JTlRFUjogMTA2LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYmFkbHkgZm9ybWVkIEpTT04gd2FzIHJlY2VpdmVkIHVwc3RyZWFtLiBUaGlzXG4gICAgICogZWl0aGVyIGluZGljYXRlcyB5b3UgaGF2ZSBkb25lIHNvbWV0aGluZyB1bnVzdWFsIHdpdGggbW9kaWZ5aW5nIGhvd1xuICAgICAqIHRoaW5ncyBlbmNvZGUgdG8gSlNPTiwgb3IgdGhlIG5ldHdvcmsgaXMgZmFpbGluZyBiYWRseS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0pTT046IDEwNyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBmZWF0dXJlIHlvdSB0cmllZCB0byBhY2Nlc3MgaXMgb25seVxuICAgICAqIGF2YWlsYWJsZSBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIENPTU1BTkRfVU5BVkFJTEFCTEU6IDEwOCxcblxuICAgIC8qKlxuICAgICAqIFlvdSBtdXN0IGNhbGwgUGFyc2UuaW5pdGlhbGl6ZSBiZWZvcmUgdXNpbmcgdGhlIFBhcnNlIGxpYnJhcnkuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTk9UX0lOSVRJQUxJWkVEOiAxMDksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIGZpZWxkIHdhcyBzZXQgdG8gYW4gaW5jb25zaXN0ZW50IHR5cGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5DT1JSRUNUX1RZUEU6IDExMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIGNoYW5uZWwgbmFtZS4gQSBjaGFubmVsIG5hbWUgaXMgZWl0aGVyXG4gICAgICogYW4gZW1wdHkgc3RyaW5nICh0aGUgYnJvYWRjYXN0IGNoYW5uZWwpIG9yIGNvbnRhaW5zIG9ubHkgYS16QS1aMC05X1xuICAgICAqIGNoYXJhY3RlcnMgYW5kIHN0YXJ0cyB3aXRoIGEgbGV0dGVyLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfQ0hBTk5FTF9OQU1FOiAxMTIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBwdXNoIGlzIG1pc2NvbmZpZ3VyZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgUFVTSF9NSVNDT05GSUdVUkVEOiAxMTUsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgb2JqZWN0IGlzIHRvbyBsYXJnZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBPQkpFQ1RfVE9PX0xBUkdFOiAxMTYsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgb3BlcmF0aW9uIGlzbid0IGFsbG93ZWQgZm9yIGNsaWVudHMuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgT1BFUkFUSU9OX0ZPUkJJRERFTjogMTE5LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoZSByZXN1bHQgd2FzIG5vdCBmb3VuZCBpbiB0aGUgY2FjaGUuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgQ0FDSEVfTUlTUzogMTIwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYW4gaW52YWxpZCBrZXkgd2FzIHVzZWQgaW4gYSBuZXN0ZWRcbiAgICAgKiBKU09OT2JqZWN0LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfTkVTVEVEX0tFWTogMTIxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYW4gaW52YWxpZCBmaWxlbmFtZSB3YXMgdXNlZCBmb3IgUGFyc2VGaWxlLlxuICAgICAqIEEgdmFsaWQgZmlsZSBuYW1lIGNvbnRhaW5zIG9ubHkgYS16QS1aMC05Xy4gY2hhcmFjdGVycyBhbmQgaXMgYmV0d2VlbiAxXG4gICAgICogYW5kIDEyOCBjaGFyYWN0ZXJzLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfRklMRV9OQU1FOiAxMjIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gaW52YWxpZCBBQ0wgd2FzIHByb3ZpZGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfQUNMOiAxMjMsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgcmVxdWVzdCB0aW1lZCBvdXQgb24gdGhlIHNlcnZlci4gVHlwaWNhbGx5XG4gICAgICogdGhpcyBpbmRpY2F0ZXMgdGhhdCB0aGUgcmVxdWVzdCBpcyB0b28gZXhwZW5zaXZlIHRvIHJ1bi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBUSU1FT1VUOiAxMjQsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgZW1haWwgYWRkcmVzcyB3YXMgaW52YWxpZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0VNQUlMX0FERFJFU1M6IDEyNSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIG1pc3NpbmcgY29udGVudCB0eXBlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE1JU1NJTkdfQ09OVEVOVF9UWVBFOiAxMjYsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYSBtaXNzaW5nIGNvbnRlbnQgbGVuZ3RoLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIE1JU1NJTkdfQ09OVEVOVF9MRU5HVEg6IDEyNyxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhbiBpbnZhbGlkIGNvbnRlbnQgbGVuZ3RoLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfQ09OVEVOVF9MRU5HVEg6IDEyOCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyBhIGZpbGUgdGhhdCB3YXMgdG9vIGxhcmdlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEZJTEVfVE9PX0xBUkdFOiAxMjksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gZXJyb3Igc2F2aW5nIGEgZmlsZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBGSUxFX1NBVkVfRVJST1I6IDEzMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdW5pcXVlIGZpZWxkIHdhcyBnaXZlbiBhIHZhbHVlIHRoYXQgaXNcbiAgICAgKiBhbHJlYWR5IHRha2VuLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIERVUExJQ0FURV9WQUxVRTogMTM3LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSByb2xlJ3MgbmFtZSBpcyBpbnZhbGlkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIElOVkFMSURfUk9MRV9OQU1FOiAxMzksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhbiBhcHBsaWNhdGlvbiBxdW90YSB3YXMgZXhjZWVkZWQuICBVcGdyYWRlIHRvXG4gICAgICogcmVzb2x2ZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBFWENFRURFRF9RVU9UQTogMTQwLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSBDbG91ZCBDb2RlIHNjcmlwdCBmYWlsZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgU0NSSVBUX0ZBSUxFRDogMTQxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgYSBDbG91ZCBDb2RlIHZhbGlkYXRpb24gZmFpbGVkLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFZBTElEQVRJT05fRVJST1I6IDE0MixcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGludmFsaWQgaW1hZ2UgZGF0YSB3YXMgcHJvdmlkZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9JTUFHRV9EQVRBOiAxNTAsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gdW5zYXZlZCBmaWxlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFVOU0FWRURfRklMRV9FUlJPUjogMTUxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQgcHVzaCB0aW1lLlxuICAgICAqL1xuICAgIElOVkFMSURfUFVTSF9USU1FX0VSUk9SOiAxNTIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgYW4gZXJyb3IgZGVsZXRpbmcgYSBmaWxlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEZJTEVfREVMRVRFX0VSUk9SOiAxNTMsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgYXBwbGljYXRpb24gaGFzIGV4Y2VlZGVkIGl0cyByZXF1ZXN0XG4gICAgICogbGltaXQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgUkVRVUVTVF9MSU1JVF9FWENFRURFRDogMTU1LFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGFuIGludmFsaWQgZXZlbnQgbmFtZS5cbiAgICAgKi9cbiAgICBJTlZBTElEX0VWRU5UX05BTUU6IDE2MCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSB1c2VybmFtZSBpcyBtaXNzaW5nIG9yIGVtcHR5LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFVTRVJOQU1FX01JU1NJTkc6IDIwMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSBwYXNzd29yZCBpcyBtaXNzaW5nIG9yIGVtcHR5LlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFBBU1NXT1JEX01JU1NJTkc6IDIwMSxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IHRoZSB1c2VybmFtZSBoYXMgYWxyZWFkeSBiZWVuIHRha2VuLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIFVTRVJOQU1FX1RBS0VOOiAyMDIsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgZW1haWwgaGFzIGFscmVhZHkgYmVlbiB0YWtlbi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBFTUFJTF9UQUtFTjogMjAzLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGVtYWlsIGlzIG1pc3NpbmcsIGJ1dCBtdXN0IGJlIHNwZWNpZmllZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBFTUFJTF9NSVNTSU5HOiAyMDQsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgd2l0aCB0aGUgc3BlY2lmaWVkIGVtYWlsIHdhcyBub3QgZm91bmQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgRU1BSUxfTk9UX0ZPVU5EOiAyMDUsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgb2JqZWN0IHdpdGhvdXQgYSB2YWxpZCBzZXNzaW9uIGNvdWxkXG4gICAgICogbm90IGJlIGFsdGVyZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgU0VTU0lPTl9NSVNTSU5HOiAyMDYsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgY2FuIG9ubHkgYmUgY3JlYXRlZCB0aHJvdWdoIHNpZ251cC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBNVVNUX0NSRUFURV9VU0VSX1RIUk9VR0hfU0lHTlVQOiAyMDcsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhbiBhbiBhY2NvdW50IGJlaW5nIGxpbmtlZCBpcyBhbHJlYWR5IGxpbmtlZFxuICAgICAqIHRvIGFub3RoZXIgdXNlci5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBBQ0NPVU5UX0FMUkVBRFlfTElOS0VEOiAyMDgsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCB0aGUgY3VycmVudCBzZXNzaW9uIHRva2VuIGlzIGludmFsaWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgSU5WQUxJRF9TRVNTSU9OX1RPS0VOOiAyMDksXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHVzZXIgY2Fubm90IGJlIGxpbmtlZCB0byBhbiBhY2NvdW50IGJlY2F1c2VcbiAgICAgKiB0aGF0IGFjY291bnQncyBpZCBjb3VsZCBub3QgYmUgZm91bmQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgTElOS0VEX0lEX01JU1NJTkc6IDI1MCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGF0IGEgdXNlciB3aXRoIGEgbGlua2VkIChlLmcuIEZhY2Vib29rKSBhY2NvdW50XG4gICAgICogaGFzIGFuIGludmFsaWQgc2Vzc2lvbi5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBJTlZBTElEX0xJTktFRF9TRVNTSU9OOiAyNTEsXG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb2RlIGluZGljYXRpbmcgdGhhdCBhIHNlcnZpY2UgYmVpbmcgbGlua2VkIChlLmcuIEZhY2Vib29rIG9yXG4gICAgICogVHdpdHRlcikgaXMgdW5zdXBwb3J0ZWQuXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgVU5TVVBQT1JURURfU0VSVklDRTogMjUyLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoYXQgdGhlcmUgd2VyZSBtdWx0aXBsZSBlcnJvcnMuIEFnZ3JlZ2F0ZSBlcnJvcnNcbiAgICAgKiBoYXZlIGFuIFwiZXJyb3JzXCIgcHJvcGVydHksIHdoaWNoIGlzIGFuIGFycmF5IG9mIGVycm9yIG9iamVjdHMgd2l0aCBtb3JlXG4gICAgICogZGV0YWlsIGFib3V0IGVhY2ggZXJyb3IgdGhhdCBvY2N1cnJlZC5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBBR0dSRUdBVEVfRVJST1I6IDYwMCxcblxuICAgIC8qKlxuICAgICAqIEVycm9yIGNvZGUgaW5kaWNhdGluZyB0aGUgY2xpZW50IHdhcyB1bmFibGUgdG8gcmVhZCBhbiBpbnB1dCBmaWxlLlxuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIEZJTEVfUkVBRF9FUlJPUjogNjAxLFxuXG4gICAgLyoqXG4gICAgICogRXJyb3IgY29kZSBpbmRpY2F0aW5nIGEgcmVhbCBlcnJvciBjb2RlIGlzIHVuYXZhaWxhYmxlIGJlY2F1c2VcbiAgICAgKiB3ZSBoYWQgdG8gdXNlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCB0byBhbGxvdyBDT1JTIHJlcXVlc3RzIGluXG4gICAgICogSW50ZXJuZXQgRXhwbG9yZXIsIHdoaWNoIHN0cmlwcyB0aGUgYm9keSBmcm9tIEhUVFAgcmVzcG9uc2VzIHRoYXQgaGF2ZVxuICAgICAqIGEgbm9uLTJYWCBzdGF0dXMgY29kZS5cbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBYX0RPTUFJTl9SRVFVRVNUOiA2MDJcbiAgfSk7XG5cbn0odGhpcykpO1xuXG4vKmdsb2JhbCBfOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdCA9IHRoaXM7XG4gIHZhciBQYXJzZSA9IChyb290LlBhcnNlIHx8IChyb290LlBhcnNlID0ge30pKTtcbiAgdmFyIGV2ZW50U3BsaXR0ZXIgPSAvXFxzKy87XG4gIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPlBhcnNlLkV2ZW50cyBpcyBhIGZvcmsgb2YgQmFja2JvbmUncyBFdmVudHMgbW9kdWxlLCBwcm92aWRlZCBmb3IgeW91clxuICAgKiBjb252ZW5pZW5jZS48L3A+XG4gICAqXG4gICAqIDxwPkEgbW9kdWxlIHRoYXQgY2FuIGJlIG1peGVkIGluIHRvIGFueSBvYmplY3QgaW4gb3JkZXIgdG8gcHJvdmlkZVxuICAgKiBpdCB3aXRoIGN1c3RvbSBldmVudHMuIFlvdSBtYXkgYmluZCBjYWxsYmFjayBmdW5jdGlvbnMgdG8gYW4gZXZlbnRcbiAgICogd2l0aCBgb25gLCBvciByZW1vdmUgdGhlc2UgZnVuY3Rpb25zIHdpdGggYG9mZmAuXG4gICAqIFRyaWdnZXJpbmcgYW4gZXZlbnQgZmlyZXMgYWxsIGNhbGxiYWNrcyBpbiB0aGUgb3JkZXIgdGhhdCBgb25gIHdhc1xuICAgKiBjYWxsZWQuXG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgICB2YXIgb2JqZWN0ID0ge307XG4gICAqICAgICBfLmV4dGVuZChvYmplY3QsIFBhcnNlLkV2ZW50cyk7XG4gICAqICAgICBvYmplY3Qub24oJ2V4cGFuZCcsIGZ1bmN0aW9uKCl7IGFsZXJ0KCdleHBhbmRlZCcpOyB9KTtcbiAgICogICAgIG9iamVjdC50cmlnZ2VyKCdleHBhbmQnKTs8L3ByZT48L3A+XG4gICAqXG4gICAqIDxwPkZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlXG4gICAqIDxhIGhyZWY9XCJodHRwOi8vZG9jdW1lbnRjbG91ZC5naXRodWIuY29tL2JhY2tib25lLyNFdmVudHNcIj5CYWNrYm9uZVxuICAgKiBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqL1xuICBQYXJzZS5FdmVudHMgPSB7XG4gICAgLyoqXG4gICAgICogQmluZCBvbmUgb3IgbW9yZSBzcGFjZSBzZXBhcmF0ZWQgZXZlbnRzLCBgZXZlbnRzYCwgdG8gYSBgY2FsbGJhY2tgXG4gICAgICogZnVuY3Rpb24uIFBhc3NpbmcgYFwiYWxsXCJgIHdpbGwgYmluZCB0aGUgY2FsbGJhY2sgdG8gYWxsIGV2ZW50cyBmaXJlZC5cbiAgICAgKi9cbiAgICBvbjogZnVuY3Rpb24oZXZlbnRzLCBjYWxsYmFjaywgY29udGV4dCkge1xuXG4gICAgICB2YXIgY2FsbHMsIGV2ZW50LCBub2RlLCB0YWlsLCBsaXN0O1xuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcbiAgICAgIGNhbGxzID0gdGhpcy5fY2FsbGJhY2tzIHx8ICh0aGlzLl9jYWxsYmFja3MgPSB7fSk7XG5cbiAgICAgIC8vIENyZWF0ZSBhbiBpbW11dGFibGUgY2FsbGJhY2sgbGlzdCwgYWxsb3dpbmcgdHJhdmVyc2FsIGR1cmluZ1xuICAgICAgLy8gbW9kaWZpY2F0aW9uLiAgVGhlIHRhaWwgaXMgYW4gZW1wdHkgb2JqZWN0IHRoYXQgd2lsbCBhbHdheXMgYmUgdXNlZFxuICAgICAgLy8gYXMgdGhlIG5leHQgbm9kZS5cbiAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB3aGlsZSAoZXZlbnQpIHtcbiAgICAgICAgbGlzdCA9IGNhbGxzW2V2ZW50XTtcbiAgICAgICAgbm9kZSA9IGxpc3QgPyBsaXN0LnRhaWwgOiB7fTtcbiAgICAgICAgbm9kZS5uZXh0ID0gdGFpbCA9IHt9O1xuICAgICAgICBub2RlLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICBub2RlLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIGNhbGxzW2V2ZW50XSA9IHt0YWlsOiB0YWlsLCBuZXh0OiBsaXN0ID8gbGlzdC5uZXh0IDogbm9kZX07XG4gICAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgb25lIG9yIG1hbnkgY2FsbGJhY2tzLiBJZiBgY29udGV4dGAgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgY2FsbGJhY2tzXG4gICAgICogd2l0aCB0aGF0IGZ1bmN0aW9uLiBJZiBgY2FsbGJhY2tgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrcyBmb3IgdGhlXG4gICAgICogZXZlbnQuIElmIGBldmVudHNgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGJvdW5kIGNhbGxiYWNrcyBmb3IgYWxsIGV2ZW50cy5cbiAgICAgKi9cbiAgICBvZmY6IGZ1bmN0aW9uKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgIHZhciBldmVudCwgY2FsbHMsIG5vZGUsIHRhaWwsIGNiLCBjdHg7XG5cbiAgICAgIC8vIE5vIGV2ZW50cywgb3IgcmVtb3ZpbmcgKmFsbCogZXZlbnRzLlxuICAgICAgaWYgKCEoY2FsbHMgPSB0aGlzLl9jYWxsYmFja3MpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghKGV2ZW50cyB8fCBjYWxsYmFjayB8fCBjb250ZXh0KSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBsaXN0ZWQgZXZlbnRzIGFuZCBjb250ZXh0cywgc3BsaWNpbmcgdGhlbSBvdXQgb2YgdGhlXG4gICAgICAvLyBsaW5rZWQgbGlzdCBvZiBjYWxsYmFja3MgaWYgYXBwcm9wcmlhdGUuXG4gICAgICBldmVudHMgPSBldmVudHMgPyBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcikgOiBPYmplY3Qua2V5cyhjYWxscyk7XG4gICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgd2hpbGUgKGV2ZW50KSB7XG4gICAgICAgIG5vZGUgPSBjYWxsc1tldmVudF07XG4gICAgICAgIGRlbGV0ZSBjYWxsc1tldmVudF07XG4gICAgICAgIGlmICghbm9kZSB8fCAhKGNhbGxiYWNrIHx8IGNvbnRleHQpKSB7XG4gICAgICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgbGlzdCwgb21pdHRpbmcgdGhlIGluZGljYXRlZCBjYWxsYmFja3MuXG4gICAgICAgIHRhaWwgPSBub2RlLnRhaWw7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIHdoaWxlIChub2RlICE9PSB0YWlsKSB7XG4gICAgICAgICAgY2IgPSBub2RlLmNhbGxiYWNrO1xuICAgICAgICAgIGN0eCA9IG5vZGUuY29udGV4dDtcbiAgICAgICAgICBpZiAoKGNhbGxiYWNrICYmIGNiICE9PSBjYWxsYmFjaykgfHwgKGNvbnRleHQgJiYgY3R4ICE9PSBjb250ZXh0KSkge1xuICAgICAgICAgICAgdGhpcy5vbihldmVudCwgY2IsIGN0eCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQ2FsbGJhY2tzIGFyZVxuICAgICAqIHBhc3NlZCB0aGUgc2FtZSBhcmd1bWVudHMgYXMgYHRyaWdnZXJgIGlzLCBhcGFydCBmcm9tIHRoZSBldmVudCBuYW1lXG4gICAgICogKHVubGVzcyB5b3UncmUgbGlzdGVuaW5nIG9uIGBcImFsbFwiYCwgd2hpY2ggd2lsbCBjYXVzZSB5b3VyIGNhbGxiYWNrIHRvXG4gICAgICogcmVjZWl2ZSB0aGUgdHJ1ZSBuYW1lIG9mIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgYXJndW1lbnQpLlxuICAgICAqL1xuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgdmFyIGV2ZW50LCBub2RlLCBjYWxscywgdGFpbCwgYXJncywgYWxsLCByZXN0O1xuICAgICAgaWYgKCEoY2FsbHMgPSB0aGlzLl9jYWxsYmFja3MpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgYWxsID0gY2FsbHMuYWxsO1xuICAgICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuICAgICAgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgLy8gRm9yIGVhY2ggZXZlbnQsIHdhbGsgdGhyb3VnaCB0aGUgbGlua2VkIGxpc3Qgb2YgY2FsbGJhY2tzIHR3aWNlLFxuICAgICAgLy8gZmlyc3QgdG8gdHJpZ2dlciB0aGUgZXZlbnQsIHRoZW4gdG8gdHJpZ2dlciBhbnkgYFwiYWxsXCJgIGNhbGxiYWNrcy5cbiAgICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gICAgICB3aGlsZSAoZXZlbnQpIHtcbiAgICAgICAgbm9kZSA9IGNhbGxzW2V2ZW50XTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB0YWlsID0gbm9kZS50YWlsO1xuICAgICAgICAgIHdoaWxlICgobm9kZSA9IG5vZGUubmV4dCkgIT09IHRhaWwpIHtcbiAgICAgICAgICAgIG5vZGUuY2FsbGJhY2suYXBwbHkobm9kZS5jb250ZXh0IHx8IHRoaXMsIHJlc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBub2RlID0gYWxsO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIHRhaWwgPSBub2RlLnRhaWw7XG4gICAgICAgICAgYXJncyA9IFtldmVudF0uY29uY2F0KHJlc3QpO1xuICAgICAgICAgIHdoaWxlICgobm9kZSA9IG5vZGUubmV4dCkgIT09IHRhaWwpIHtcbiAgICAgICAgICAgIG5vZGUuY2FsbGJhY2suYXBwbHkobm9kZS5jb250ZXh0IHx8IHRoaXMsIGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07ICBcblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBQYXJzZS5FdmVudHMuYmluZCA9IFBhcnNlLkV2ZW50cy5vbjtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBQYXJzZS5FdmVudHMudW5iaW5kID0gUGFyc2UuRXZlbnRzLm9mZjtcbn0uY2FsbCh0aGlzKSk7XG5cblxuLypnbG9iYWwgbmF2aWdhdG9yOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBHZW9Qb2ludCB3aXRoIGFueSBvZiB0aGUgZm9sbG93aW5nIGZvcm1zOjxicj5cbiAgICogICA8cHJlPlxuICAgKiAgIG5ldyBHZW9Qb2ludChvdGhlckdlb1BvaW50KVxuICAgKiAgIG5ldyBHZW9Qb2ludCgzMCwgMzApXG4gICAqICAgbmV3IEdlb1BvaW50KFszMCwgMzBdKVxuICAgKiAgIG5ldyBHZW9Qb2ludCh7bGF0aXR1ZGU6IDMwLCBsb25naXR1ZGU6IDMwfSlcbiAgICogICBuZXcgR2VvUG9pbnQoKSAgLy8gZGVmYXVsdHMgdG8gKDAsIDApXG4gICAqICAgPC9wcmU+XG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5SZXByZXNlbnRzIGEgbGF0aXR1ZGUgLyBsb25naXR1ZGUgcG9pbnQgdGhhdCBtYXkgYmUgYXNzb2NpYXRlZFxuICAgKiB3aXRoIGEga2V5IGluIGEgUGFyc2VPYmplY3Qgb3IgdXNlZCBhcyBhIHJlZmVyZW5jZSBwb2ludCBmb3IgZ2VvIHF1ZXJpZXMuXG4gICAqIFRoaXMgYWxsb3dzIHByb3hpbWl0eS1iYXNlZCBxdWVyaWVzIG9uIHRoZSBrZXkuPC9wPlxuICAgKlxuICAgKiA8cD5Pbmx5IG9uZSBrZXkgaW4gYSBjbGFzcyBtYXkgY29udGFpbiBhIEdlb1BvaW50LjwvcD5cbiAgICpcbiAgICogPHA+RXhhbXBsZTo8cHJlPlxuICAgKiAgIHZhciBwb2ludCA9IG5ldyBQYXJzZS5HZW9Qb2ludCgzMC4wLCAtMjAuMCk7XG4gICAqICAgdmFyIG9iamVjdCA9IG5ldyBQYXJzZS5PYmplY3QoXCJQbGFjZU9iamVjdFwiKTtcbiAgICogICBvYmplY3Quc2V0KFwibG9jYXRpb25cIiwgcG9pbnQpO1xuICAgKiAgIG9iamVjdC5zYXZlKCk7PC9wcmU+PC9wPlxuICAgKi9cbiAgUGFyc2UuR2VvUG9pbnQgPSBmdW5jdGlvbihhcmcxLCBhcmcyKSB7XG4gICAgaWYgKF8uaXNBcnJheShhcmcxKSkge1xuICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKGFyZzFbMF0sIGFyZzFbMV0pO1xuICAgICAgdGhpcy5sYXRpdHVkZSA9IGFyZzFbMF07XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IGFyZzFbMV07XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGFyZzEpKSB7XG4gICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUoYXJnMS5sYXRpdHVkZSwgYXJnMS5sb25naXR1ZGUpO1xuICAgICAgdGhpcy5sYXRpdHVkZSA9IGFyZzEubGF0aXR1ZGU7XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IGFyZzEubG9uZ2l0dWRlO1xuICAgIH0gZWxzZSBpZiAoXy5pc051bWJlcihhcmcxKSAmJiBfLmlzTnVtYmVyKGFyZzIpKSB7XG4gICAgICBQYXJzZS5HZW9Qb2ludC5fdmFsaWRhdGUoYXJnMSwgYXJnMik7XG4gICAgICB0aGlzLmxhdGl0dWRlID0gYXJnMTtcbiAgICAgIHRoaXMubG9uZ2l0dWRlID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXRpdHVkZSA9IDA7XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IDA7XG4gICAgfVxuXG4gICAgLy8gQWRkIHByb3BlcnRpZXMgc28gdGhhdCBhbnlvbmUgdXNpbmcgV2Via2l0IG9yIE1vemlsbGEgd2lsbCBnZXQgYW4gZXJyb3JcbiAgICAvLyBpZiB0aGV5IHRyeSB0byBzZXQgdmFsdWVzIHRoYXQgYXJlIG91dCBvZiBib3VuZHMuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLl9fZGVmaW5lR2V0dGVyX18gJiYgdGhpcy5fX2RlZmluZVNldHRlcl9fKSB7XG4gICAgICAvLyBVc2UgX2xhdGl0dWRlIGFuZCBfbG9uZ2l0dWRlIHRvIGFjdHVhbGx5IHN0b3JlIHRoZSB2YWx1ZXMsIGFuZCBhZGRcbiAgICAgIC8vIGdldHRlcnMgYW5kIHNldHRlcnMgZm9yIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUuXG4gICAgICB0aGlzLl9sYXRpdHVkZSA9IHRoaXMubGF0aXR1ZGU7XG4gICAgICB0aGlzLl9sb25naXR1ZGUgPSB0aGlzLmxvbmdpdHVkZTtcbiAgICAgIHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcImxhdGl0dWRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fbGF0aXR1ZGU7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcImxvbmdpdHVkZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2xvbmdpdHVkZTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fX2RlZmluZVNldHRlcl9fKFwibGF0aXR1ZGVcIiwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZSh2YWwsIHNlbGYubG9uZ2l0dWRlKTtcbiAgICAgICAgc2VsZi5fbGF0aXR1ZGUgPSB2YWw7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX19kZWZpbmVTZXR0ZXJfXyhcImxvbmdpdHVkZVwiLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKHNlbGYubGF0aXR1ZGUsIHZhbCk7XG4gICAgICAgIHNlbGYuX2xvbmdpdHVkZSA9IHZhbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQGxlbmRzIFBhcnNlLkdlb1BvaW50LnByb3RvdHlwZVxuICAgKiBAcHJvcGVydHkge2Zsb2F0fSBsYXRpdHVkZSBOb3J0aC1zb3V0aCBwb3J0aW9uIG9mIHRoZSBjb29yZGluYXRlLCBpbiByYW5nZVxuICAgKiAgIFstOTAsIDkwXS4gIFRocm93cyBhbiBleGNlcHRpb24gaWYgc2V0IG91dCBvZiByYW5nZSBpbiBhIG1vZGVybiBicm93c2VyLlxuICAgKiBAcHJvcGVydHkge2Zsb2F0fSBsb25naXR1ZGUgRWFzdC13ZXN0IHBvcnRpb24gb2YgdGhlIGNvb3JkaW5hdGUsIGluIHJhbmdlXG4gICAqICAgWy0xODAsIDE4MF0uICBUaHJvd3MgaWYgc2V0IG91dCBvZiByYW5nZSBpbiBhIG1vZGVybiBicm93c2VyLlxuICAgKi9cblxuICAvKipcbiAgICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgZ2l2ZW4gbGF0LWxvbmcgaXMgb3V0IG9mIGJvdW5kcy5cbiAgICovXG4gIFBhcnNlLkdlb1BvaW50Ll92YWxpZGF0ZSA9IGZ1bmN0aW9uKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgICBpZiAobGF0aXR1ZGUgPCAtOTAuMCkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5HZW9Qb2ludCBsYXRpdHVkZSBcIiArIGxhdGl0dWRlICsgXCIgPCAtOTAuMC5cIjtcbiAgICB9XG4gICAgaWYgKGxhdGl0dWRlID4gOTAuMCkge1xuICAgICAgdGhyb3cgXCJQYXJzZS5HZW9Qb2ludCBsYXRpdHVkZSBcIiArIGxhdGl0dWRlICsgXCIgPiA5MC4wLlwiO1xuICAgIH1cbiAgICBpZiAobG9uZ2l0dWRlIDwgLTE4MC4wKSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLkdlb1BvaW50IGxvbmdpdHVkZSBcIiArIGxvbmdpdHVkZSArIFwiIDwgLTE4MC4wLlwiO1xuICAgIH1cbiAgICBpZiAobG9uZ2l0dWRlID4gMTgwLjApIHtcbiAgICAgIHRocm93IFwiUGFyc2UuR2VvUG9pbnQgbG9uZ2l0dWRlIFwiICsgbG9uZ2l0dWRlICsgXCIgPiAxODAuMC5cIjtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBHZW9Qb2ludCB3aXRoIHRoZSB1c2VyJ3MgY3VycmVudCBsb2NhdGlvbiwgaWYgYXZhaWxhYmxlLlxuICAgKiBDYWxscyBvcHRpb25zLnN1Y2Nlc3Mgd2l0aCBhIG5ldyBHZW9Qb2ludCBpbnN0YW5jZSBvciBjYWxscyBvcHRpb25zLmVycm9yLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvciBjYWxsYmFja3MuXG4gICAqL1xuICBQYXJzZS5HZW9Qb2ludC5jdXJyZW50ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICBwcm9taXNlLnJlc29sdmUobmV3IFBhcnNlLkdlb1BvaW50KHtcbiAgICAgICAgbGF0aXR1ZGU6IGxvY2F0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgbG9uZ2l0dWRlOiBsb2NhdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICB9KSk7XG5cbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgUGFyc2UuR2VvUG9pbnQucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBHZW9Qb2ludCwgc3VpdGFibGUgZm9yIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgUGFyc2UuR2VvUG9pbnQuX3ZhbGlkYXRlKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiX190eXBlXCI6IFwiR2VvUG9pbnRcIixcbiAgICAgICAgbGF0aXR1ZGU6IHRoaXMubGF0aXR1ZGUsXG4gICAgICAgIGxvbmdpdHVkZTogdGhpcy5sb25naXR1ZGVcbiAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhpcyBHZW9Qb2ludCB0byBhbm90aGVyIGluIHJhZGlhbnMuXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgdGhlIG90aGVyIFBhcnNlLkdlb1BvaW50LlxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICByYWRpYW5zVG86IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICB2YXIgZDJyID0gTWF0aC5QSSAvIDE4MC4wO1xuICAgICAgdmFyIGxhdDFyYWQgPSB0aGlzLmxhdGl0dWRlICogZDJyO1xuICAgICAgdmFyIGxvbmcxcmFkID0gdGhpcy5sb25naXR1ZGUgKiBkMnI7XG4gICAgICB2YXIgbGF0MnJhZCA9IHBvaW50LmxhdGl0dWRlICogZDJyO1xuICAgICAgdmFyIGxvbmcycmFkID0gcG9pbnQubG9uZ2l0dWRlICogZDJyO1xuICAgICAgdmFyIGRlbHRhTGF0ID0gbGF0MXJhZCAtIGxhdDJyYWQ7XG4gICAgICB2YXIgZGVsdGFMb25nID0gbG9uZzFyYWQgLSBsb25nMnJhZDtcbiAgICAgIHZhciBzaW5EZWx0YUxhdERpdjIgPSBNYXRoLnNpbihkZWx0YUxhdCAvIDIpO1xuICAgICAgdmFyIHNpbkRlbHRhTG9uZ0RpdjIgPSBNYXRoLnNpbihkZWx0YUxvbmcgLyAyKTtcbiAgICAgIC8vIFNxdWFyZSBvZiBoYWxmIHRoZSBzdHJhaWdodCBsaW5lIGNob3JkIGRpc3RhbmNlIGJldHdlZW4gYm90aCBwb2ludHMuXG4gICAgICB2YXIgYSA9ICgoc2luRGVsdGFMYXREaXYyICogc2luRGVsdGFMYXREaXYyKSArXG4gICAgICAgICAgICAgICAoTWF0aC5jb3MobGF0MXJhZCkgKiBNYXRoLmNvcyhsYXQycmFkKSAqXG4gICAgICAgICAgICAgICAgc2luRGVsdGFMb25nRGl2MiAqIHNpbkRlbHRhTG9uZ0RpdjIpKTtcbiAgICAgIGEgPSBNYXRoLm1pbigxLjAsIGEpO1xuICAgICAgcmV0dXJuIDIgKiBNYXRoLmFzaW4oTWF0aC5zcXJ0KGEpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSB0aGlzIEdlb1BvaW50IHRvIGFub3RoZXIgaW4ga2lsb21ldGVycy5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCB0aGUgb3RoZXIgUGFyc2UuR2VvUG9pbnQuXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGtpbG9tZXRlcnNUbzogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJhZGlhbnNUbyhwb2ludCkgKiA2MzcxLjA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gdGhpcyBHZW9Qb2ludCB0byBhbm90aGVyIGluIG1pbGVzLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IHRoZSBvdGhlciBQYXJzZS5HZW9Qb2ludC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgbWlsZXNUbzogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJhZGlhbnNUbyhwb2ludCkgKiAzOTU4Ljg7XG4gICAgfVxuICB9O1xufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIG5hdmlnYXRvcjogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgdmFyIFBVQkxJQ19LRVkgPSBcIipcIjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBBQ0wuXG4gICAqIElmIG5vIGFyZ3VtZW50IGlzIGdpdmVuLCB0aGUgQUNMIGhhcyBubyBwZXJtaXNzaW9ucyBmb3IgYW55b25lLlxuICAgKiBJZiB0aGUgYXJndW1lbnQgaXMgYSBQYXJzZS5Vc2VyLCB0aGUgQUNMIHdpbGwgaGF2ZSByZWFkIGFuZCB3cml0ZVxuICAgKiAgIHBlcm1pc3Npb24gZm9yIG9ubHkgdGhhdCB1c2VyLlxuICAgKiBJZiB0aGUgYXJndW1lbnQgaXMgYW55IG90aGVyIEpTT04gb2JqZWN0LCB0aGF0IG9iamVjdCB3aWxsIGJlIGludGVycHJldHRlZFxuICAgKiAgIGFzIGEgc2VyaWFsaXplZCBBQ0wgY3JlYXRlZCB3aXRoIHRvSlNPTigpLlxuICAgKiBAc2VlIFBhcnNlLk9iamVjdCNzZXRBQ0xcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkFuIEFDTCwgb3IgQWNjZXNzIENvbnRyb2wgTGlzdCBjYW4gYmUgYWRkZWQgdG8gYW55XG4gICAqIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4gdG8gcmVzdHJpY3QgYWNjZXNzIHRvIG9ubHkgYSBzdWJzZXQgb2YgdXNlcnNcbiAgICogb2YgeW91ciBhcHBsaWNhdGlvbi48L3A+XG4gICAqL1xuICBQYXJzZS5BQ0wgPSBmdW5jdGlvbihhcmcxKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYucGVybWlzc2lvbnNCeUlkID0ge307XG4gICAgaWYgKF8uaXNPYmplY3QoYXJnMSkpIHtcbiAgICAgIGlmIChhcmcxIGluc3RhbmNlb2YgUGFyc2UuVXNlcikge1xuICAgICAgICBzZWxmLnNldFJlYWRBY2Nlc3MoYXJnMSwgdHJ1ZSk7XG4gICAgICAgIHNlbGYuc2V0V3JpdGVBY2Nlc3MoYXJnMSwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGFyZzEpKSB7XG4gICAgICAgICAgdGhyb3cgXCJQYXJzZS5BQ0woKSBjYWxsZWQgd2l0aCBhIGZ1bmN0aW9uLiAgRGlkIHlvdSBmb3JnZXQgKCk/XCI7XG4gICAgICAgIH1cbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYXJnMSwgZnVuY3Rpb24oYWNjZXNzTGlzdCwgdXNlcklkKSB7XG4gICAgICAgICAgaWYgKCFfLmlzU3RyaW5nKHVzZXJJZCkpIHtcbiAgICAgICAgICAgIHRocm93IFwiVHJpZWQgdG8gY3JlYXRlIGFuIEFDTCB3aXRoIGFuIGludmFsaWQgdXNlcklkLlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdID0ge307XG4gICAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYWNjZXNzTGlzdCwgZnVuY3Rpb24oYWxsb3dlZCwgcGVybWlzc2lvbikge1xuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb24gIT09IFwicmVhZFwiICYmIHBlcm1pc3Npb24gIT09IFwid3JpdGVcIikge1xuICAgICAgICAgICAgICB0aHJvdyBcIlRyaWVkIHRvIGNyZWF0ZSBhbiBBQ0wgd2l0aCBhbiBpbnZhbGlkIHBlcm1pc3Npb24gdHlwZS5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghXy5pc0Jvb2xlYW4oYWxsb3dlZCkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJUcmllZCB0byBjcmVhdGUgYW4gQUNMIHdpdGggYW4gaW52YWxpZCBwZXJtaXNzaW9uIHZhbHVlLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXVtwZXJtaXNzaW9uXSA9IGFsbG93ZWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIEpTT04tZW5jb2RlZCB2ZXJzaW9uIG9mIHRoZSBBQ0wuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8uY2xvbmUodGhpcy5wZXJtaXNzaW9uc0J5SWQpO1xuICB9O1xuXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuX3NldEFjY2VzcyA9IGZ1bmN0aW9uKGFjY2Vzc1R5cGUsIHVzZXJJZCwgYWxsb3dlZCkge1xuICAgIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Vc2VyKSB7XG4gICAgICB1c2VySWQgPSB1c2VySWQuaWQ7XG4gICAgfSBlbHNlIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICB1c2VySWQgPSBcInJvbGU6XCIgKyB1c2VySWQuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICBpZiAoIV8uaXNTdHJpbmcodXNlcklkKSkge1xuICAgICAgdGhyb3cgXCJ1c2VySWQgbXVzdCBiZSBhIHN0cmluZy5cIjtcbiAgICB9XG4gICAgaWYgKCFfLmlzQm9vbGVhbihhbGxvd2VkKSkge1xuICAgICAgdGhyb3cgXCJhbGxvd2VkIG11c3QgYmUgZWl0aGVyIHRydWUgb3IgZmFsc2UuXCI7XG4gICAgfVxuICAgIHZhciBwZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNCeUlkW3VzZXJJZF07XG4gICAgaWYgKCFwZXJtaXNzaW9ucykge1xuICAgICAgaWYgKCFhbGxvd2VkKSB7XG4gICAgICAgIC8vIFRoZSB1c2VyIGFscmVhZHkgZG9lc24ndCBoYXZlIHRoaXMgcGVybWlzc2lvbiwgc28gbm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5wZXJtaXNzaW9uc0J5SWRbdXNlcklkXSA9IHBlcm1pc3Npb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhbGxvd2VkKSB7XG4gICAgICB0aGlzLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdW2FjY2Vzc1R5cGVdID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHBlcm1pc3Npb25zW2FjY2Vzc1R5cGVdO1xuICAgICAgaWYgKF8uaXNFbXB0eShwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgZGVsZXRlIHBlcm1pc3Npb25zW3VzZXJJZF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuX2dldEFjY2VzcyA9IGZ1bmN0aW9uKGFjY2Vzc1R5cGUsIHVzZXJJZCkge1xuICAgIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Vc2VyKSB7XG4gICAgICB1c2VySWQgPSB1c2VySWQuaWQ7XG4gICAgfSBlbHNlIGlmICh1c2VySWQgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICB1c2VySWQgPSBcInJvbGU6XCIgKyB1c2VySWQuZ2V0TmFtZSgpO1xuICAgIH1cbiAgICB2YXIgcGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zQnlJZFt1c2VySWRdO1xuICAgIGlmICghcGVybWlzc2lvbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zW2FjY2Vzc1R5cGVdID8gdHJ1ZSA6IGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB0aGUgZ2l2ZW4gdXNlciBpcyBhbGxvd2VkIHRvIHJlYWQgdGhpcyBvYmplY3QuXG4gICAqIEBwYXJhbSB1c2VySWQgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuVXNlciBvciBpdHMgb2JqZWN0SWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZCBXaGV0aGVyIHRoYXQgdXNlciBzaG91bGQgaGF2ZSByZWFkIGFjY2Vzcy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0UmVhZEFjY2VzcyA9IGZ1bmN0aW9uKHVzZXJJZCwgYWxsb3dlZCkge1xuICAgIHRoaXMuX3NldEFjY2VzcyhcInJlYWRcIiwgdXNlcklkLCBhbGxvd2VkKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdGhlIGdpdmVuIHVzZXIgaWQgaXMgKmV4cGxpY2l0bHkqIGFsbG93ZWQgdG8gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogRXZlbiBpZiB0aGlzIHJldHVybnMgZmFsc2UsIHRoZSB1c2VyIG1heSBzdGlsbCBiZSBhYmxlIHRvIGFjY2VzcyBpdCBpZlxuICAgKiBnZXRQdWJsaWNSZWFkQWNjZXNzIHJldHVybnMgdHJ1ZSBvciBhIHJvbGUgdGhhdCB0aGUgdXNlciBiZWxvbmdzIHRvIGhhc1xuICAgKiB3cml0ZSBhY2Nlc3MuXG4gICAqIEBwYXJhbSB1c2VySWQgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuVXNlciBvciBpdHMgb2JqZWN0SWQsIG9yIGEgUGFyc2UuUm9sZS5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0UmVhZEFjY2VzcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRBY2Nlc3MoXCJyZWFkXCIsIHVzZXJJZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHRoZSBnaXZlbiB1c2VyIGlkIGlzIGFsbG93ZWQgdG8gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEBwYXJhbSB1c2VySWQgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuVXNlciBvciBpdHMgb2JqZWN0SWQsIG9yIGEgUGFyc2UuUm9sZS4uXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsb3dlZCBXaGV0aGVyIHRoYXQgdXNlciBzaG91bGQgaGF2ZSB3cml0ZSBhY2Nlc3MuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFdyaXRlQWNjZXNzID0gZnVuY3Rpb24odXNlcklkLCBhbGxvd2VkKSB7XG4gICAgdGhpcy5fc2V0QWNjZXNzKFwid3JpdGVcIiwgdXNlcklkLCBhbGxvd2VkKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdGhlIGdpdmVuIHVzZXIgaWQgaXMgKmV4cGxpY2l0bHkqIGFsbG93ZWQgdG8gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEV2ZW4gaWYgdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgdXNlciBtYXkgc3RpbGwgYmUgYWJsZSB0byB3cml0ZSBpdCBpZlxuICAgKiBnZXRQdWJsaWNXcml0ZUFjY2VzcyByZXR1cm5zIHRydWUgb3IgYSByb2xlIHRoYXQgdGhlIHVzZXIgYmVsb25ncyB0byBoYXNcbiAgICogd3JpdGUgYWNjZXNzLlxuICAgKiBAcGFyYW0gdXNlcklkIEFuIGluc3RhbmNlIG9mIFBhcnNlLlVzZXIgb3IgaXRzIG9iamVjdElkLCBvciBhIFBhcnNlLlJvbGUuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFdyaXRlQWNjZXNzID0gZnVuY3Rpb24odXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEFjY2VzcyhcIndyaXRlXCIsIHVzZXJJZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHRoZSBwdWJsaWMgaXMgYWxsb3dlZCB0byByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWRcbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0UHVibGljUmVhZEFjY2VzcyA9IGZ1bmN0aW9uKGFsbG93ZWQpIHtcbiAgICB0aGlzLnNldFJlYWRBY2Nlc3MoUFVCTElDX0tFWSwgYWxsb3dlZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHRoZSBwdWJsaWMgaXMgYWxsb3dlZCB0byByZWFkIHRoaXMgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRQdWJsaWNSZWFkQWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVhZEFjY2VzcyhQVUJMSUNfS0VZKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHdoZXRoZXIgdGhlIHB1YmxpYyBpcyBhbGxvd2VkIHRvIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWRcbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0UHVibGljV3JpdGVBY2Nlc3MgPSBmdW5jdGlvbihhbGxvd2VkKSB7XG4gICAgdGhpcy5zZXRXcml0ZUFjY2VzcyhQVUJMSUNfS0VZLCBhbGxvd2VkKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHdoZXRoZXIgdGhlIHB1YmxpYyBpcyBhbGxvd2VkIHRvIHdyaXRlIHRoaXMgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgUGFyc2UuQUNMLnByb3RvdHlwZS5nZXRQdWJsaWNXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFdyaXRlQWNjZXNzKFBVQkxJQ19LRVkpO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIEdldCB3aGV0aGVyIHVzZXJzIGJlbG9uZ2luZyB0byB0aGUgZ2l2ZW4gcm9sZSBhcmUgYWxsb3dlZFxuICAgKiB0byByZWFkIHRoaXMgb2JqZWN0LiBFdmVuIGlmIHRoaXMgcmV0dXJucyBmYWxzZSwgdGhlIHJvbGUgbWF5XG4gICAqIHN0aWxsIGJlIGFibGUgdG8gd3JpdGUgaXQgaWYgYSBwYXJlbnQgcm9sZSBoYXMgcmVhZCBhY2Nlc3MuXG4gICAqIFxuICAgKiBAcGFyYW0gcm9sZSBUaGUgbmFtZSBvZiB0aGUgcm9sZSwgb3IgYSBQYXJzZS5Sb2xlIG9iamVjdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgcm9sZSBoYXMgcmVhZCBhY2Nlc3MuIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHRocm93cyB7U3RyaW5nfSBJZiByb2xlIGlzIG5laXRoZXIgYSBQYXJzZS5Sb2xlIG5vciBhIFN0cmluZy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuZ2V0Um9sZVJlYWRBY2Nlc3MgPSBmdW5jdGlvbihyb2xlKSB7XG4gICAgaWYgKHJvbGUgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gdGhlIFN0cmluZyBuYW1lXG4gICAgICByb2xlID0gcm9sZS5nZXROYW1lKCk7XG4gICAgfVxuICAgIGlmIChfLmlzU3RyaW5nKHJvbGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSZWFkQWNjZXNzKFwicm9sZTpcIiArIHJvbGUpO1xuICAgIH1cbiAgICB0aHJvdyBcInJvbGUgbXVzdCBiZSBhIFBhcnNlLlJvbGUgb3IgYSBTdHJpbmdcIjtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBHZXQgd2hldGhlciB1c2VycyBiZWxvbmdpbmcgdG8gdGhlIGdpdmVuIHJvbGUgYXJlIGFsbG93ZWRcbiAgICogdG8gd3JpdGUgdGhpcyBvYmplY3QuIEV2ZW4gaWYgdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgcm9sZSBtYXlcbiAgICogc3RpbGwgYmUgYWJsZSB0byB3cml0ZSBpdCBpZiBhIHBhcmVudCByb2xlIGhhcyB3cml0ZSBhY2Nlc3MuXG4gICAqIFxuICAgKiBAcGFyYW0gcm9sZSBUaGUgbmFtZSBvZiB0aGUgcm9sZSwgb3IgYSBQYXJzZS5Sb2xlIG9iamVjdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgcm9sZSBoYXMgd3JpdGUgYWNjZXNzLiBmYWxzZSBvdGhlcndpc2UuXG4gICAqIEB0aHJvd3Mge1N0cmluZ30gSWYgcm9sZSBpcyBuZWl0aGVyIGEgUGFyc2UuUm9sZSBub3IgYSBTdHJpbmcuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLmdldFJvbGVXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKHJvbGUpIHtcbiAgICBpZiAocm9sZSBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIC8vIE5vcm1hbGl6ZSB0byB0aGUgU3RyaW5nIG5hbWVcbiAgICAgIHJvbGUgPSByb2xlLmdldE5hbWUoKTtcbiAgICB9XG4gICAgaWYgKF8uaXNTdHJpbmcocm9sZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFdyaXRlQWNjZXNzKFwicm9sZTpcIiArIHJvbGUpO1xuICAgIH1cbiAgICB0aHJvdyBcInJvbGUgbXVzdCBiZSBhIFBhcnNlLlJvbGUgb3IgYSBTdHJpbmdcIjtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBTZXQgd2hldGhlciB1c2VycyBiZWxvbmdpbmcgdG8gdGhlIGdpdmVuIHJvbGUgYXJlIGFsbG93ZWRcbiAgICogdG8gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogXG4gICAqIEBwYXJhbSByb2xlIFRoZSBuYW1lIG9mIHRoZSByb2xlLCBvciBhIFBhcnNlLlJvbGUgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWQgV2hldGhlciB0aGUgZ2l2ZW4gcm9sZSBjYW4gcmVhZCB0aGlzIG9iamVjdC5cbiAgICogQHRocm93cyB7U3RyaW5nfSBJZiByb2xlIGlzIG5laXRoZXIgYSBQYXJzZS5Sb2xlIG5vciBhIFN0cmluZy5cbiAgICovXG4gIFBhcnNlLkFDTC5wcm90b3R5cGUuc2V0Um9sZVJlYWRBY2Nlc3MgPSBmdW5jdGlvbihyb2xlLCBhbGxvd2VkKSB7XG4gICAgaWYgKHJvbGUgaW5zdGFuY2VvZiBQYXJzZS5Sb2xlKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gdGhlIFN0cmluZyBuYW1lXG4gICAgICByb2xlID0gcm9sZS5nZXROYW1lKCk7XG4gICAgfVxuICAgIGlmIChfLmlzU3RyaW5nKHJvbGUpKSB7XG4gICAgICB0aGlzLnNldFJlYWRBY2Nlc3MoXCJyb2xlOlwiICsgcm9sZSwgYWxsb3dlZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IFwicm9sZSBtdXN0IGJlIGEgUGFyc2UuUm9sZSBvciBhIFN0cmluZ1wiO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIFNldCB3aGV0aGVyIHVzZXJzIGJlbG9uZ2luZyB0byB0aGUgZ2l2ZW4gcm9sZSBhcmUgYWxsb3dlZFxuICAgKiB0byB3cml0ZSB0aGlzIG9iamVjdC5cbiAgICogXG4gICAqIEBwYXJhbSByb2xlIFRoZSBuYW1lIG9mIHRoZSByb2xlLCBvciBhIFBhcnNlLlJvbGUgb2JqZWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbG93ZWQgV2hldGhlciB0aGUgZ2l2ZW4gcm9sZSBjYW4gd3JpdGUgdGhpcyBvYmplY3QuXG4gICAqIEB0aHJvd3Mge1N0cmluZ30gSWYgcm9sZSBpcyBuZWl0aGVyIGEgUGFyc2UuUm9sZSBub3IgYSBTdHJpbmcuXG4gICAqL1xuICBQYXJzZS5BQ0wucHJvdG90eXBlLnNldFJvbGVXcml0ZUFjY2VzcyA9IGZ1bmN0aW9uKHJvbGUsIGFsbG93ZWQpIHtcbiAgICBpZiAocm9sZSBpbnN0YW5jZW9mIFBhcnNlLlJvbGUpIHtcbiAgICAgIC8vIE5vcm1hbGl6ZSB0byB0aGUgU3RyaW5nIG5hbWVcbiAgICAgIHJvbGUgPSByb2xlLmdldE5hbWUoKTtcbiAgICB9XG4gICAgaWYgKF8uaXNTdHJpbmcocm9sZSkpIHtcbiAgICAgIHRoaXMuc2V0V3JpdGVBY2Nlc3MoXCJyb2xlOlwiICsgcm9sZSwgYWxsb3dlZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IFwicm9sZSBtdXN0IGJlIGEgUGFyc2UuUm9sZSBvciBhIFN0cmluZ1wiO1xuICB9O1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEEgUGFyc2UuT3AgaXMgYW4gYXRvbWljIG9wZXJhdGlvbiB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgZmllbGQgaW4gYVxuICAgKiBQYXJzZS5PYmplY3QuIEZvciBleGFtcGxlLCBjYWxsaW5nIDxjb2RlPm9iamVjdC5zZXQoXCJmb29cIiwgXCJiYXJcIik8L2NvZGU+XG4gICAqIGlzIGFuIGV4YW1wbGUgb2YgYSBQYXJzZS5PcC5TZXQuIENhbGxpbmcgPGNvZGU+b2JqZWN0LnVuc2V0KFwiZm9vXCIpPC9jb2RlPlxuICAgKiBpcyBhIFBhcnNlLk9wLlVuc2V0LiBUaGVzZSBvcGVyYXRpb25zIGFyZSBzdG9yZWQgaW4gYSBQYXJzZS5PYmplY3QgYW5kXG4gICAqIHNlbnQgdG8gdGhlIHNlcnZlciBhcyBwYXJ0IG9mIDxjb2RlPm9iamVjdC5zYXZlKCk8L2NvZGU+IG9wZXJhdGlvbnMuXG4gICAqIEluc3RhbmNlcyBvZiBQYXJzZS5PcCBzaG91bGQgYmUgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBZb3Ugc2hvdWxkIG5vdCBjcmVhdGUgc3ViY2xhc3NlcyBvZiBQYXJzZS5PcCBvciBpbnN0YW50aWF0ZSBQYXJzZS5PcFxuICAgKiBkaXJlY3RseS5cbiAgICovXG4gIFBhcnNlLk9wID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5faW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIFBhcnNlLk9wLnByb3RvdHlwZSA9IHtcbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7fVxuICB9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLk9wLCB7XG4gICAgLyoqXG4gICAgICogVG8gY3JlYXRlIGEgbmV3IE9wLCBjYWxsIFBhcnNlLk9wLl9leHRlbmQoKTtcbiAgICAgKi9cbiAgICBfZXh0ZW5kOiBQYXJzZS5fZXh0ZW5kLFxuXG4gICAgLy8gQSBtYXAgb2YgX19vcCBzdHJpbmcgdG8gZGVjb2RlciBmdW5jdGlvbi5cbiAgICBfb3BEZWNvZGVyTWFwOiB7fSxcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIHRvIGNvbnZlcnQgYSBqc29uIG9iamVjdCB3aXRoIGFuIF9fb3AgZmllbGQgaW50byBhblxuICAgICAqIGluc3RhbmNlIG9mIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT3AuXG4gICAgICovXG4gICAgX3JlZ2lzdGVyRGVjb2RlcjogZnVuY3Rpb24ob3BOYW1lLCBkZWNvZGVyKSB7XG4gICAgICBQYXJzZS5PcC5fb3BEZWNvZGVyTWFwW29wTmFtZV0gPSBkZWNvZGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhIGpzb24gb2JqZWN0IGludG8gYW4gaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PcC5cbiAgICAgKi9cbiAgICBfZGVjb2RlOiBmdW5jdGlvbihqc29uKSB7XG4gICAgICB2YXIgZGVjb2RlciA9IFBhcnNlLk9wLl9vcERlY29kZXJNYXBbanNvbi5fX29wXTtcbiAgICAgIGlmIChkZWNvZGVyKSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVyKGpzb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8qXG4gICAqIEFkZCBhIGhhbmRsZXIgZm9yIEJhdGNoIG9wcy5cbiAgICovXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJCYXRjaFwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgdmFyIG9wID0gbnVsbDtcbiAgICBQYXJzZS5fYXJyYXlFYWNoKGpzb24ub3BzLCBmdW5jdGlvbihuZXh0T3ApIHtcbiAgICAgIG5leHRPcCA9IFBhcnNlLk9wLl9kZWNvZGUobmV4dE9wKTtcbiAgICAgIG9wID0gbmV4dE9wLl9tZXJnZVdpdGhQcmV2aW91cyhvcCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9wO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEEgU2V0IG9wZXJhdGlvbiBpbmRpY2F0ZXMgdGhhdCBlaXRoZXIgdGhlIGZpZWxkIHdhcyBjaGFuZ2VkIHVzaW5nXG4gICAqIFBhcnNlLk9iamVjdC5zZXQsIG9yIGl0IGlzIGEgbXV0YWJsZSBjb250YWluZXIgdGhhdCB3YXMgZGV0ZWN0ZWQgYXMgYmVpbmdcbiAgICogY2hhbmdlZC5cbiAgICovXG4gIFBhcnNlLk9wLlNldCA9IFBhcnNlLk9wLl9leHRlbmQoLyoqIEBsZW5kcyBQYXJzZS5PcC5TZXQucHJvdG90eXBlICovIHtcbiAgICBfaW5pdGlhbGl6ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG5ldyB2YWx1ZSBvZiB0aGlzIGZpZWxkIGFmdGVyIHRoZSBzZXQuXG4gICAgICovXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFyc2UuX2VuY29kZSh0aGlzLnZhbHVlKCkpO1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBIHNlbnRpbmVsIHZhbHVlIHRoYXQgaXMgcmV0dXJuZWQgYnkgUGFyc2UuT3AuVW5zZXQuX2VzdGltYXRlIHRvXG4gICAqIGluZGljYXRlIHRoZSBmaWVsZCBzaG91bGQgYmUgZGVsZXRlZC4gQmFzaWNhbGx5LCBpZiB5b3UgZmluZCBfVU5TRVQgYXMgYVxuICAgKiB2YWx1ZSBpbiB5b3VyIG9iamVjdCwgeW91IHNob3VsZCByZW1vdmUgdGhhdCBrZXkuXG4gICAqL1xuICBQYXJzZS5PcC5fVU5TRVQgPSB7fTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEFuIFVuc2V0IG9wZXJhdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGlzIGZpZWxkIGhhcyBiZWVuIGRlbGV0ZWQgZnJvbSB0aGVcbiAgICogb2JqZWN0LlxuICAgKi9cbiAgUGFyc2UuT3AuVW5zZXQgPSBQYXJzZS5PcC5fZXh0ZW5kKC8qKiBAbGVuZHMgUGFyc2UuT3AuVW5zZXQucHJvdG90eXBlICovIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIkRlbGV0ZVwiIH07XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfZXN0aW1hdGU6IGZ1bmN0aW9uKG9sZFZhbHVlKSB7XG4gICAgICByZXR1cm4gUGFyc2UuT3AuX1VOU0VUO1xuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkRlbGV0ZVwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5VbnNldCgpO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEFuIEluY3JlbWVudCBpcyBhbiBhdG9taWMgb3BlcmF0aW9uIHdoZXJlIHRoZSBudW1lcmljIHZhbHVlIGZvciB0aGUgZmllbGRcbiAgICogd2lsbCBiZSBpbmNyZWFzZWQgYnkgYSBnaXZlbiBhbW91bnQuXG4gICAqL1xuICBQYXJzZS5PcC5JbmNyZW1lbnQgPSBQYXJzZS5PcC5fZXh0ZW5kKFxuICAgICAgLyoqIEBsZW5kcyBQYXJzZS5PcC5JbmNyZW1lbnQucHJvdG90eXBlICovIHtcblxuICAgIF9pbml0aWFsaXplOiBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHRoaXMuX2Ftb3VudCA9IGFtb3VudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYW1vdW50IHRvIGluY3JlbWVudCBieS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBhbW91bnQgdG8gaW5jcmVtZW50IGJ5LlxuICAgICAqL1xuICAgIGFtb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYW1vdW50O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIkluY3JlbWVudFwiLCBhbW91bnQ6IHRoaXMuX2Ftb3VudCB9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlVuc2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMuYW1vdW50KCkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldChwcmV2aW91cy52YWx1ZSgpICsgdGhpcy5hbW91bnQoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuSW5jcmVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuSW5jcmVtZW50KHRoaXMuYW1vdW50KCkgKyBwcmV2aW91cy5hbW91bnQoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW1vdW50KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2xkVmFsdWUgKyB0aGlzLmFtb3VudCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgUGFyc2UuT3AuX3JlZ2lzdGVyRGVjb2RlcihcIkluY3JlbWVudFwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5JbmNyZW1lbnQoanNvbi5hbW91bnQpO1xuICB9KTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqIEFkZCBpcyBhbiBhdG9taWMgb3BlcmF0aW9uIHdoZXJlIHRoZSBnaXZlbiBvYmplY3RzIHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlXG4gICAqIGFycmF5IHRoYXQgaXMgc3RvcmVkIGluIHRoaXMgZmllbGQuXG4gICAqL1xuICBQYXJzZS5PcC5BZGQgPSBQYXJzZS5PcC5fZXh0ZW5kKC8qKiBAbGVuZHMgUGFyc2UuT3AuQWRkLnByb3RvdHlwZSAqLyB7XG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIHRoaXMuX29iamVjdHMgPSBvYmplY3RzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBvYmplY3RzIHRvIGJlIGFkZGVkIHRvIHRoZSBhcnJheS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9iamVjdHMgdG8gYmUgYWRkZWQgdG8gdGhlIGFycmF5LlxuICAgICAqL1xuICAgIG9iamVjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OIHZlcnNpb24gb2YgdGhlIG9wZXJhdGlvbiBzdWl0YWJsZSBmb3Igc2VuZGluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7IF9fb3A6IFwiQWRkXCIsIG9iamVjdHM6IFBhcnNlLl9lbmNvZGUodGhpcy5vYmplY3RzKCkpIH07XG4gICAgfSxcblxuICAgIF9tZXJnZVdpdGhQcmV2aW91czogZnVuY3Rpb24ocHJldmlvdXMpIHtcbiAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuVW5zZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5vYmplY3RzKCkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLl9lc3RpbWF0ZShwcmV2aW91cy52YWx1ZSgpKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuQWRkKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuQWRkKHByZXZpb3VzLm9iamVjdHMoKS5jb25jYXQodGhpcy5vYmplY3RzKCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gXy5jbG9uZSh0aGlzLm9iamVjdHMoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2xkVmFsdWUuY29uY2F0KHRoaXMub2JqZWN0cygpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJBZGRcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuQWRkKFBhcnNlLl9kZWNvZGUodW5kZWZpbmVkLCBqc29uLm9iamVjdHMpKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBZGRVbmlxdWUgaXMgYW4gYXRvbWljIG9wZXJhdGlvbiB3aGVyZSB0aGUgZ2l2ZW4gaXRlbXMgd2lsbCBiZSBhcHBlbmRlZCB0b1xuICAgKiB0aGUgYXJyYXkgdGhhdCBpcyBzdG9yZWQgaW4gdGhpcyBmaWVsZCBvbmx5IGlmIHRoZXkgd2VyZSBub3QgYWxyZWFkeVxuICAgKiBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAgICovXG4gIFBhcnNlLk9wLkFkZFVuaXF1ZSA9IFBhcnNlLk9wLl9leHRlbmQoXG4gICAgICAvKiogQGxlbmRzIFBhcnNlLk9wLkFkZFVuaXF1ZS5wcm90b3R5cGUgKi8ge1xuXG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIHRoaXMuX29iamVjdHMgPSBfLnVuaXEob2JqZWN0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG9iamVjdHMgdG8gYmUgYWRkZWQgdG8gdGhlIGFycmF5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgb2JqZWN0cyB0byBiZSBhZGRlZCB0byB0aGUgYXJyYXkuXG4gICAgICovXG4gICAgb2JqZWN0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0cztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEpTT04gdmVyc2lvbiBvZiB0aGUgb3BlcmF0aW9uIHN1aXRhYmxlIGZvciBzZW5kaW5nIHRvIFBhcnNlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgX19vcDogXCJBZGRVbmlxdWVcIiwgb2JqZWN0czogUGFyc2UuX2VuY29kZSh0aGlzLm9iamVjdHMoKSkgfTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5VbnNldCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlNldCh0aGlzLm9iamVjdHMoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZpb3VzIGluc3RhbmNlb2YgUGFyc2UuT3AuU2V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuT3AuU2V0KHRoaXMuX2VzdGltYXRlKHByZXZpb3VzLnZhbHVlKCkpKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5BZGRVbmlxdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5BZGRVbmlxdWUodGhpcy5fZXN0aW1hdGUocHJldmlvdXMub2JqZWN0cygpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9lc3RpbWF0ZTogZnVuY3Rpb24ob2xkVmFsdWUpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIF8uY2xvbmUodGhpcy5vYmplY3RzKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgY2FuJ3QganVzdCB0YWtlIHRoZSBfLnVuaXEoXy51bmlvbiguLi4pKSBvZiBvbGRWYWx1ZSBhbmRcbiAgICAgICAgLy8gdGhpcy5vYmplY3RzLCBiZWNhdXNlIHRoZSB1bmlxdWVuZXNzIG1heSBub3QgYXBwbHkgdG8gb2xkVmFsdWVcbiAgICAgICAgLy8gKGVzcGVjaWFsbHkgaWYgdGhlIG9sZFZhbHVlIHdhcyBzZXQgdmlhIC5zZXQoKSlcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gXy5jbG9uZShvbGRWYWx1ZSk7XG4gICAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5vYmplY3RzKCksIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QgJiYgb2JqLmlkKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2hpbmdPYmogPSBfLmZpbmQobmV3VmFsdWUsIGZ1bmN0aW9uKGFuT2JqKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoYW5PYmogaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpICYmIChhbk9iai5pZCA9PT0gb2JqLmlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaGluZ09iaikge1xuICAgICAgICAgICAgICBuZXdWYWx1ZS5wdXNoKG9iaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YobmV3VmFsdWUsIG1hdGNoaW5nT2JqKTtcbiAgICAgICAgICAgICAgbmV3VmFsdWVbaW5kZXhdID0gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMobmV3VmFsdWUsIG9iaikpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlLnB1c2gob2JqKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiQWRkVW5pcXVlXCIsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlLk9wLkFkZFVuaXF1ZShQYXJzZS5fZGVjb2RlKHVuZGVmaW5lZCwganNvbi5vYmplY3RzKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAY2xhc3NcbiAgICogUmVtb3ZlIGlzIGFuIGF0b21pYyBvcGVyYXRpb24gd2hlcmUgdGhlIGdpdmVuIG9iamVjdHMgd2lsbCBiZSByZW1vdmVkIGZyb21cbiAgICogdGhlIGFycmF5IHRoYXQgaXMgc3RvcmVkIGluIHRoaXMgZmllbGQuXG4gICAqL1xuICBQYXJzZS5PcC5SZW1vdmUgPSBQYXJzZS5PcC5fZXh0ZW5kKC8qKiBAbGVuZHMgUGFyc2UuT3AuUmVtb3ZlLnByb3RvdHlwZSAqLyB7XG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKG9iamVjdHMpIHtcbiAgICAgIHRoaXMuX29iamVjdHMgPSBfLnVuaXEob2JqZWN0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG9iamVjdHMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBhcnJheS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9iamVjdHMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBhcnJheS5cbiAgICAgKi9cbiAgICBvYmplY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYmplY3RzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4geyBfX29wOiBcIlJlbW92ZVwiLCBvYmplY3RzOiBQYXJzZS5fZW5jb2RlKHRoaXMub2JqZWN0cygpKSB9O1xuICAgIH0sXG5cbiAgICBfbWVyZ2VXaXRoUHJldmlvdXM6IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlVuc2V0KSB7XG4gICAgICAgIHJldHVybiBwcmV2aW91cztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5TZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5TZXQodGhpcy5fZXN0aW1hdGUocHJldmlvdXMudmFsdWUoKSkpO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aW91cyBpbnN0YW5jZW9mIFBhcnNlLk9wLlJlbW92ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLk9wLlJlbW92ZShfLnVuaW9uKHByZXZpb3VzLm9iamVjdHMoKSwgdGhpcy5vYmplY3RzKCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSkge1xuICAgICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSBfLmRpZmZlcmVuY2Uob2xkVmFsdWUsIHRoaXMub2JqZWN0cygpKTtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIHNhdmVkIFBhcnNlIE9iamVjdHMgYmVpbmcgcmVtb3ZlZCwgYWxzbyByZW1vdmUgdGhlbS5cbiAgICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLm9iamVjdHMoKSwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCAmJiBvYmouaWQpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gXy5yZWplY3QobmV3VmFsdWUsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAob3RoZXIgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpICYmIChvdGhlci5pZCA9PT0gb2JqLmlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJSZW1vdmVcIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuUmVtb3ZlKFBhcnNlLl9kZWNvZGUodW5kZWZpbmVkLCBqc29uLm9iamVjdHMpKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKiBBIFJlbGF0aW9uIG9wZXJhdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgZmllbGQgaXMgYW4gaW5zdGFuY2Ugb2ZcbiAgICogUGFyc2UuUmVsYXRpb24sIGFuZCBvYmplY3RzIGFyZSBiZWluZyBhZGRlZCB0bywgb3IgcmVtb3ZlZCBmcm9tLCB0aGF0XG4gICAqIHJlbGF0aW9uLlxuICAgKi9cbiAgUGFyc2UuT3AuUmVsYXRpb24gPSBQYXJzZS5PcC5fZXh0ZW5kKFxuICAgICAgLyoqIEBsZW5kcyBQYXJzZS5PcC5SZWxhdGlvbi5wcm90b3R5cGUgKi8ge1xuXG4gICAgX2luaXRpYWxpemU6IGZ1bmN0aW9uKGFkZHMsIHJlbW92ZXMpIHtcbiAgICAgIHRoaXMuX3RhcmdldENsYXNzTmFtZSA9IG51bGw7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdmFyIHBvaW50ZXJUb0lkID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBQYXJzZS5PYmplY3QpIHtcbiAgICAgICAgICBpZiAoIW9iamVjdC5pZCkge1xuICAgICAgICAgICAgdGhyb3cgXCJZb3UgY2FuJ3QgYWRkIGFuIHVuc2F2ZWQgUGFyc2UuT2JqZWN0IHRvIGEgcmVsYXRpb24uXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBzZWxmLl90YXJnZXRDbGFzc05hbWUgPSBvYmplY3QuY2xhc3NOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2VsZi5fdGFyZ2V0Q2xhc3NOYW1lICE9PSBvYmplY3QuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlRyaWVkIHRvIGNyZWF0ZSBhIFBhcnNlLlJlbGF0aW9uIHdpdGggMiBkaWZmZXJlbnQgdHlwZXM6IFwiICtcbiAgICAgICAgICAgICAgICAgIHNlbGYuX3RhcmdldENsYXNzTmFtZSArIFwiIGFuZCBcIiArIG9iamVjdC5jbGFzc05hbWUgKyBcIi5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG9iamVjdC5pZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfTtcblxuICAgICAgdGhpcy5yZWxhdGlvbnNUb0FkZCA9IF8udW5pcShfLm1hcChhZGRzLCBwb2ludGVyVG9JZCkpO1xuICAgICAgdGhpcy5yZWxhdGlvbnNUb1JlbW92ZSA9IF8udW5pcShfLm1hcChyZW1vdmVzLCBwb2ludGVyVG9JZCkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHVuZmV0Y2hlZCBQYXJzZS5PYmplY3QgdGhhdCBhcmUgYmVpbmcgYWRkZWQgdG8gdGhlXG4gICAgICogcmVsYXRpb24uXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgYWRkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaXMucmVsYXRpb25zVG9BZGQsIGZ1bmN0aW9uKG9iamVjdElkKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShzZWxmLl90YXJnZXRDbGFzc05hbWUpO1xuICAgICAgICBvYmplY3QuaWQgPSBvYmplY3RJZDtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHVuZmV0Y2hlZCBQYXJzZS5PYmplY3QgdGhhdCBhcmUgYmVpbmcgcmVtb3ZlZCBmcm9tXG4gICAgICogdGhlIHJlbGF0aW9uLlxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaXMucmVsYXRpb25zVG9SZW1vdmUsIGZ1bmN0aW9uKG9iamVjdElkKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShzZWxmLl90YXJnZXRDbGFzc05hbWUpO1xuICAgICAgICBvYmplY3QuaWQgPSBvYmplY3RJZDtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvcGVyYXRpb24gc3VpdGFibGUgZm9yIHNlbmRpbmcgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWRkcyA9IG51bGw7XG4gICAgICB2YXIgcmVtb3ZlcyA9IG51bGw7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgaWRUb1BvaW50ZXIgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4geyBfX3R5cGU6ICdQb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBzZWxmLl90YXJnZXRDbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZCB9O1xuICAgICAgfTtcbiAgICAgIHZhciBwb2ludGVycyA9IG51bGw7XG4gICAgICBpZiAodGhpcy5yZWxhdGlvbnNUb0FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBvaW50ZXJzID0gXy5tYXAodGhpcy5yZWxhdGlvbnNUb0FkZCwgaWRUb1BvaW50ZXIpO1xuICAgICAgICBhZGRzID0geyBcIl9fb3BcIjogXCJBZGRSZWxhdGlvblwiLCBcIm9iamVjdHNcIjogcG9pbnRlcnMgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVsYXRpb25zVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICBwb2ludGVycyA9IF8ubWFwKHRoaXMucmVsYXRpb25zVG9SZW1vdmUsIGlkVG9Qb2ludGVyKTtcbiAgICAgICAgcmVtb3ZlcyA9IHsgXCJfX29wXCI6IFwiUmVtb3ZlUmVsYXRpb25cIiwgXCJvYmplY3RzXCI6IHBvaW50ZXJzIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGRzICYmIHJlbW92ZXMpIHtcbiAgICAgICAgcmV0dXJuIHsgXCJfX29wXCI6IFwiQmF0Y2hcIiwgXCJvcHNcIjogW2FkZHMsIHJlbW92ZXNdfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFkZHMgfHwgcmVtb3ZlcyB8fCB7fTtcbiAgICB9LFxuXG4gICAgX21lcmdlV2l0aFByZXZpb3VzOiBmdW5jdGlvbihwcmV2aW91cykge1xuICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5VbnNldCkge1xuICAgICAgICB0aHJvdyBcIllvdSBjYW4ndCBtb2RpZnkgYSByZWxhdGlvbiBhZnRlciBkZWxldGluZyBpdC5cIjtcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXMgaW5zdGFuY2VvZiBQYXJzZS5PcC5SZWxhdGlvbikge1xuICAgICAgICBpZiAocHJldmlvdXMuX3RhcmdldENsYXNzTmFtZSAmJlxuICAgICAgICAgICAgcHJldmlvdXMuX3RhcmdldENsYXNzTmFtZSAhPT0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgdGhyb3cgXCJSZWxhdGVkIG9iamVjdCBtdXN0IGJlIG9mIGNsYXNzIFwiICsgcHJldmlvdXMuX3RhcmdldENsYXNzTmFtZSArXG4gICAgICAgICAgICAgIFwiLCBidXQgXCIgKyB0aGlzLl90YXJnZXRDbGFzc05hbWUgKyBcIiB3YXMgcGFzc2VkIGluLlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXdBZGQgPSBfLnVuaW9uKF8uZGlmZmVyZW5jZShwcmV2aW91cy5yZWxhdGlvbnNUb0FkZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb25zVG9SZW1vdmUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aW9uc1RvQWRkKTtcbiAgICAgICAgdmFyIG5ld1JlbW92ZSA9IF8udW5pb24oXy5kaWZmZXJlbmNlKHByZXZpb3VzLnJlbGF0aW9uc1RvUmVtb3ZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbnNUb0FkZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb25zVG9SZW1vdmUpO1xuXG4gICAgICAgIHZhciBuZXdSZWxhdGlvbiA9IG5ldyBQYXJzZS5PcC5SZWxhdGlvbihuZXdBZGQsIG5ld1JlbW92ZSk7XG4gICAgICAgIG5ld1JlbGF0aW9uLl90YXJnZXRDbGFzc05hbWUgPSB0aGlzLl90YXJnZXRDbGFzc05hbWU7XG4gICAgICAgIHJldHVybiBuZXdSZWxhdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFwiT3AgaXMgaW52YWxpZCBhZnRlciBwcmV2aW91cyBvcC5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VzdGltYXRlOiBmdW5jdGlvbihvbGRWYWx1ZSwgb2JqZWN0LCBrZXkpIHtcbiAgICAgIGlmICghb2xkVmFsdWUpIHtcbiAgICAgICAgdmFyIHJlbGF0aW9uID0gbmV3IFBhcnNlLlJlbGF0aW9uKG9iamVjdCwga2V5KTtcbiAgICAgICAgcmVsYXRpb24udGFyZ2V0Q2xhc3NOYW1lID0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgfSBlbHNlIGlmIChvbGRWYWx1ZSBpbnN0YW5jZW9mIFBhcnNlLlJlbGF0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgICBpZiAob2xkVmFsdWUudGFyZ2V0Q2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBpZiAob2xkVmFsdWUudGFyZ2V0Q2xhc3NOYW1lICE9PSB0aGlzLl90YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJSZWxhdGVkIG9iamVjdCBtdXN0IGJlIGEgXCIgKyBvbGRWYWx1ZS50YXJnZXRDbGFzc05hbWUgK1xuICAgICAgICAgICAgICAgICAgXCIsIGJ1dCBhIFwiICsgdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lICsgXCIgd2FzIHBhc3NlZCBpbi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2xkVmFsdWUudGFyZ2V0Q2xhc3NOYW1lID0gdGhpcy5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2xkVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBcIk9wIGlzIGludmFsaWQgYWZ0ZXIgcHJldmlvdXMgb3AuXCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBQYXJzZS5PcC5fcmVnaXN0ZXJEZWNvZGVyKFwiQWRkUmVsYXRpb25cIiwgZnVuY3Rpb24oanNvbikge1xuICAgIHJldHVybiBuZXcgUGFyc2UuT3AuUmVsYXRpb24oUGFyc2UuX2RlY29kZSh1bmRlZmluZWQsIGpzb24ub2JqZWN0cyksIFtdKTtcbiAgfSk7XG4gIFBhcnNlLk9wLl9yZWdpc3RlckRlY29kZXIoXCJSZW1vdmVSZWxhdGlvblwiLCBmdW5jdGlvbihqc29uKSB7XG4gICAgcmV0dXJuIG5ldyBQYXJzZS5PcC5SZWxhdGlvbihbXSwgUGFyc2UuX2RlY29kZSh1bmRlZmluZWQsIGpzb24ub2JqZWN0cykpO1xuICB9KTtcblxufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgUmVsYXRpb24gZm9yIHRoZSBnaXZlbiBwYXJlbnQgb2JqZWN0IGFuZCBrZXkuIFRoaXNcbiAgICogY29uc3RydWN0b3Igc2hvdWxkIHJhcmVseSBiZSB1c2VkIGRpcmVjdGx5LCBidXQgcmF0aGVyIGNyZWF0ZWQgYnlcbiAgICogUGFyc2UuT2JqZWN0LnJlbGF0aW9uLlxuICAgKiBAcGFyYW0ge1BhcnNlLk9iamVjdH0gcGFyZW50IFRoZSBwYXJlbnQgb2YgdGhpcyByZWxhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IGZvciB0aGlzIHJlbGF0aW9uIG9uIHRoZSBwYXJlbnQuXG4gICAqIEBzZWUgUGFyc2UuT2JqZWN0I3JlbGF0aW9uXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5cbiAgICogQSBjbGFzcyB0aGF0IGlzIHVzZWQgdG8gYWNjZXNzIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgYSBtYW55LXRvLW1hbnlcbiAgICogcmVsYXRpb25zaGlwLiAgRWFjaCBpbnN0YW5jZSBvZiBQYXJzZS5SZWxhdGlvbiBpcyBhc3NvY2lhdGVkIHdpdGggYVxuICAgKiBwYXJ0aWN1bGFyIHBhcmVudCBvYmplY3QgYW5kIGtleS5cbiAgICogPC9wPlxuICAgKi9cbiAgUGFyc2UuUmVsYXRpb24gPSBmdW5jdGlvbihwYXJlbnQsIGtleSkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMudGFyZ2V0Q2xhc3NOYW1lID0gbnVsbDtcbiAgfTtcblxuICBQYXJzZS5SZWxhdGlvbi5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogTWFrZXMgc3VyZSB0aGF0IHRoaXMgcmVsYXRpb24gaGFzIHRoZSByaWdodCBwYXJlbnQgYW5kIGtleS5cbiAgICAgKi9cbiAgICBfZW5zdXJlUGFyZW50QW5kS2V5OiBmdW5jdGlvbihwYXJlbnQsIGtleSkge1xuICAgICAgdGhpcy5wYXJlbnQgPSB0aGlzLnBhcmVudCB8fCBwYXJlbnQ7XG4gICAgICB0aGlzLmtleSA9IHRoaXMua2V5IHx8IGtleTtcbiAgICAgIGlmICh0aGlzLnBhcmVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHRocm93IFwiSW50ZXJuYWwgRXJyb3IuIFJlbGF0aW9uIHJldHJpZXZlZCBmcm9tIHR3byBkaWZmZXJlbnQgT2JqZWN0cy5cIjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmtleSAhPT0ga2V5KSB7XG4gICAgICAgIHRocm93IFwiSW50ZXJuYWwgRXJyb3IuIFJlbGF0aW9uIHJldHJpZXZlZCBmcm9tIHR3byBkaWZmZXJlbnQga2V5cy5cIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIFBhcnNlLk9iamVjdCBvciBhbiBhcnJheSBvZiBQYXJzZS5PYmplY3RzIHRvIHRoZSByZWxhdGlvbi5cbiAgICAgKiBAcGFyYW0ge30gb2JqZWN0cyBUaGUgaXRlbSBvciBpdGVtcyB0byBhZGQuXG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihvYmplY3RzKSB7XG4gICAgICBpZiAoIV8uaXNBcnJheShvYmplY3RzKSkge1xuICAgICAgICBvYmplY3RzID0gW29iamVjdHNdO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hhbmdlID0gbmV3IFBhcnNlLk9wLlJlbGF0aW9uKG9iamVjdHMsIFtdKTtcbiAgICAgIHRoaXMucGFyZW50LnNldCh0aGlzLmtleSwgY2hhbmdlKTtcbiAgICAgIHRoaXMudGFyZ2V0Q2xhc3NOYW1lID0gY2hhbmdlLl90YXJnZXRDbGFzc05hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBQYXJzZS5PYmplY3Qgb3IgYW4gYXJyYXkgb2YgUGFyc2UuT2JqZWN0cyBmcm9tIHRoaXMgcmVsYXRpb24uXG4gICAgICogQHBhcmFtIHt9IG9iamVjdHMgVGhlIGl0ZW0gb3IgaXRlbXMgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24ob2JqZWN0cykge1xuICAgICAgaWYgKCFfLmlzQXJyYXkob2JqZWN0cykpIHtcbiAgICAgICAgb2JqZWN0cyA9IFtvYmplY3RzXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoYW5nZSA9IG5ldyBQYXJzZS5PcC5SZWxhdGlvbihbXSwgb2JqZWN0cyk7XG4gICAgICB0aGlzLnBhcmVudC5zZXQodGhpcy5rZXksIGNoYW5nZSk7XG4gICAgICB0aGlzLnRhcmdldENsYXNzTmFtZSA9IGNoYW5nZS5fdGFyZ2V0Q2xhc3NOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvYmplY3Qgc3VpdGFibGUgZm9yIHNhdmluZyB0byBkaXNrLlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHsgXCJfX3R5cGVcIjogXCJSZWxhdGlvblwiLCBcImNsYXNzTmFtZVwiOiB0aGlzLnRhcmdldENsYXNzTmFtZSB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgUGFyc2UuUXVlcnkgdGhhdCBpcyBsaW1pdGVkIHRvIG9iamVjdHMgaW4gdGhpc1xuICAgICAqIHJlbGF0aW9uLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fVxuICAgICAqL1xuICAgIHF1ZXJ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0YXJnZXRDbGFzcztcbiAgICAgIHZhciBxdWVyeTtcbiAgICAgIGlmICghdGhpcy50YXJnZXRDbGFzc05hbWUpIHtcbiAgICAgICAgdGFyZ2V0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzKHRoaXMucGFyZW50LmNsYXNzTmFtZSk7XG4gICAgICAgIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KHRhcmdldENsYXNzKTtcbiAgICAgICAgcXVlcnkuX2V4dHJhT3B0aW9ucy5yZWRpcmVjdENsYXNzTmFtZUZvcktleSA9IHRoaXMua2V5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzKHRoaXMudGFyZ2V0Q2xhc3NOYW1lKTtcbiAgICAgICAgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkodGFyZ2V0Q2xhc3MpO1xuICAgICAgfVxuICAgICAgcXVlcnkuX2FkZENvbmRpdGlvbihcIiRyZWxhdGVkVG9cIiwgXCJvYmplY3RcIiwgdGhpcy5wYXJlbnQuX3RvUG9pbnRlcigpKTtcbiAgICAgIHF1ZXJ5Ll9hZGRDb25kaXRpb24oXCIkcmVsYXRlZFRvXCIsIFwia2V5XCIsIHRoaXMua2V5KTtcblxuICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH1cbiAgfTtcbn0odGhpcykpO1xuXG4vKmdsb2JhbCB3aW5kb3c6IGZhbHNlLCBwcm9jZXNzOiBmYWxzZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogQSBQcm9taXNlIGlzIHJldHVybmVkIGJ5IGFzeW5jIG1ldGhvZHMgYXMgYSBob29rIHRvIHByb3ZpZGUgY2FsbGJhY2tzIHRvIGJlXG4gICAqIGNhbGxlZCB3aGVuIHRoZSBhc3luYyB0YXNrIGlzIGZ1bGZpbGxlZC5cbiAgICpcbiAgICogPHA+VHlwaWNhbCB1c2FnZSB3b3VsZCBiZSBsaWtlOjxwcmU+XG4gICAqICAgIHF1ZXJ5LmZpbmQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICogICAgICByZXN1bHRzWzBdLnNldChcImZvb1wiLCBcImJhclwiKTtcbiAgICogICAgICByZXR1cm4gcmVzdWx0c1swXS5zYXZlQXN5bmMoKTtcbiAgICogICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICogICAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZWQgXCIgKyByZXN1bHQuaWQpO1xuICAgKiAgICB9KTtcbiAgICogPC9wcmU+PC9wPlxuICAgKlxuICAgKiBAc2VlIFBhcnNlLlByb21pc2UucHJvdG90eXBlLnRoZW5cbiAgICogQGNsYXNzXG4gICAqL1xuICBQYXJzZS5Qcm9taXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fcmVzb2x2ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9yZWplY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3Jlc29sdmVkQ2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5fcmVqZWN0ZWRDYWxsYmFja3MgPSBbXTtcbiAgfTtcblxuICBfLmV4dGVuZChQYXJzZS5Qcm9taXNlLCAvKiogQGxlbmRzIFBhcnNlLlByb21pc2UgKi8ge1xuXG4gICAgX2lzUHJvbWlzZXNBUGx1c0NvbXBsaWFudDogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWZmIHRoZSBnaXZlbiBvYmplY3QgZnVsZmlscyB0aGUgUHJvbWlzZSBpbnRlcmZhY2UuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpczogZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgcmV0dXJuIHByb21pc2UgJiYgcHJvbWlzZS50aGVuICYmIF8uaXNGdW5jdGlvbihwcm9taXNlLnRoZW4pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIGEgZ2l2ZW4gdmFsdWUuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gdGhlIG5ldyBwcm9taXNlLlxuICAgICAqL1xuICAgIGFzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgcHJvbWlzZSB0aGF0IGlzIHJlamVjdGVkIHdpdGggYSBnaXZlbiBlcnJvci5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSB0aGUgbmV3IHByb21pc2UuXG4gICAgICovXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuICAgICAgcHJvbWlzZS5yZWplY3QuYXBwbHkocHJvbWlzZSwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgb2YgdGhlIGlucHV0IHByb21pc2VzXG4gICAgICogYXJlIHJlc29sdmVkLiBJZiBhbnkgcHJvbWlzZSBpbiB0aGUgbGlzdCBmYWlscywgdGhlbiB0aGUgcmV0dXJuZWQgcHJvbWlzZVxuICAgICAqIHdpbGwgZmFpbCB3aXRoIHRoZSBsYXN0IGVycm9yLiBJZiB0aGV5IGFsbCBzdWNjZWVkLCB0aGVuIHRoZSByZXR1cm5lZFxuICAgICAqIHByb21pc2Ugd2lsbCBzdWNjZWVkLCB3aXRoIHRoZSByZXN1bHRzIGJlaW5nIHRoZSByZXN1bHRzIG9mIGFsbCB0aGUgaW5wdXRcbiAgICAgKiBwcm9taXNlcy4gRm9yIGV4YW1wbGU6IDxwcmU+XG4gICAgICogICB2YXIgcDEgPSBQYXJzZS5Qcm9taXNlLmFzKDEpO1xuICAgICAqICAgdmFyIHAyID0gUGFyc2UuUHJvbWlzZS5hcygyKTtcbiAgICAgKiAgIHZhciBwMyA9IFBhcnNlLlByb21pc2UuYXMoMyk7XG4gICAgICpcbiAgICAgKiAgIFBhcnNlLlByb21pc2Uud2hlbihwMSwgcDIsIHAzKS50aGVuKGZ1bmN0aW9uKHIxLCByMiwgcjMpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjEpOyAgLy8gcHJpbnRzIDFcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjIpOyAgLy8gcHJpbnRzIDJcbiAgICAgKiAgICAgY29uc29sZS5sb2cocjMpOyAgLy8gcHJpbnRzIDNcbiAgICAgKiAgIH0pOzwvcHJlPlxuICAgICAqXG4gICAgICogVGhlIGlucHV0IHByb21pc2VzIGNhbiBhbHNvIGJlIHNwZWNpZmllZCBhcyBhbiBhcnJheTogPHByZT5cbiAgICAgKiAgIHZhciBwcm9taXNlcyA9IFtwMSwgcDIsIHAzXTtcbiAgICAgKiAgIFBhcnNlLlByb21pc2Uud2hlbihwcm9taXNlcykudGhlbihmdW5jdGlvbihyMSwgcjIsIHIzKSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKHIxKTsgIC8vIHByaW50cyAxXG4gICAgICogICAgIGNvbnNvbGUubG9nKHIyKTsgIC8vIHByaW50cyAyXG4gICAgICogICAgIGNvbnNvbGUubG9nKHIzKTsgIC8vIHByaW50cyAzXG4gICAgICogICB9KTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhIGxpc3Qgb2YgcHJvbWlzZXMgdG8gd2FpdCBmb3IuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gdGhlIG5ldyBwcm9taXNlLlxuICAgICAqL1xuICAgIHdoZW46IGZ1bmN0aW9uKHByb21pc2VzKSB7XG4gICAgICAvLyBBbGxvdyBwYXNzaW5nIGluIFByb21pc2VzIGFzIHNlcGFyYXRlIGFyZ3VtZW50cyBpbnN0ZWFkIG9mIGFuIEFycmF5LlxuICAgICAgdmFyIG9iamVjdHM7XG4gICAgICBpZiAocHJvbWlzZXMgJiYgUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKHByb21pc2VzLmxlbmd0aCkpIHtcbiAgICAgICAgb2JqZWN0cyA9IGFyZ3VtZW50cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdHMgPSBwcm9taXNlcztcbiAgICAgIH1cblxuICAgICAgdmFyIHRvdGFsID0gb2JqZWN0cy5sZW5ndGg7XG4gICAgICB2YXIgaGFkRXJyb3IgPSBmYWxzZTtcbiAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICByZXN1bHRzLmxlbmd0aCA9IG9iamVjdHMubGVuZ3RoO1xuICAgICAgZXJyb3JzLmxlbmd0aCA9IG9iamVjdHMubGVuZ3RoO1xuXG4gICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMuYXBwbHkodGhpcywgcmVzdWx0cyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcblxuICAgICAgdmFyIHJlc29sdmVPbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdG90YWwgPSB0b3RhbCAtIDE7XG4gICAgICAgIGlmICh0b3RhbCA9PT0gMCkge1xuICAgICAgICAgIGlmIChoYWRFcnJvcikge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIHJlc3VsdHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgUGFyc2UuX2FycmF5RWFjaChvYmplY3RzLCBmdW5jdGlvbihvYmplY3QsIGkpIHtcbiAgICAgICAgaWYgKFBhcnNlLlByb21pc2UuaXMob2JqZWN0KSkge1xuICAgICAgICAgIG9iamVjdC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IHJlc3VsdDtcbiAgICAgICAgICAgIHJlc29sdmVPbmUoKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgZXJyb3JzW2ldID0gZXJyb3I7XG4gICAgICAgICAgICBoYWRFcnJvciA9IHRydWU7XG4gICAgICAgICAgICByZXNvbHZlT25lKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0c1tpXSA9IG9iamVjdDtcbiAgICAgICAgICByZXNvbHZlT25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVucyB0aGUgZ2l2ZW4gYXN5bmNGdW5jdGlvbiByZXBlYXRlZGx5LCBhcyBsb25nIGFzIHRoZSBwcmVkaWNhdGVcbiAgICAgKiBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLiBTdG9wcyByZXBlYXRpbmcgaWYgYXN5bmNGdW5jdGlvbiByZXR1cm5zXG4gICAgICogYSByZWplY3RlZCBwcm9taXNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gcmVhZHkgdG8gc3RvcC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3luY0Z1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBQcm9taXNlLlxuICAgICAqL1xuICAgIF9jb250aW51ZVdoaWxlOiBmdW5jdGlvbihwcmVkaWNhdGUsIGFzeW5jRnVuY3Rpb24pIHtcbiAgICAgIGlmIChwcmVkaWNhdGUoKSkge1xuICAgICAgICByZXR1cm4gYXN5bmNGdW5jdGlvbigpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuX2NvbnRpbnVlV2hpbGUocHJlZGljYXRlLCBhc3luY0Z1bmN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgIH1cbiAgfSk7XG5cbiAgXy5leHRlbmQoUGFyc2UuUHJvbWlzZS5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUGFyc2UuUHJvbWlzZS5wcm90b3R5cGUgKi8ge1xuXG4gICAgLyoqXG4gICAgICogTWFya3MgdGhpcyBwcm9taXNlIGFzIGZ1bGZpbGxlZCwgZmlyaW5nIGFueSBjYWxsYmFja3Mgd2FpdGluZyBvbiBpdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzdWx0IHRoZSByZXN1bHQgdG8gcGFzcyB0byB0aGUgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgaWYgKHRoaXMuX3Jlc29sdmVkIHx8IHRoaXMuX3JlamVjdGVkKSB7XG4gICAgICAgIHRocm93IFwiQSBwcm9taXNlIHdhcyByZXNvbHZlZCBldmVuIHRob3VnaCBpdCBoYWQgYWxyZWFkeSBiZWVuIFwiICtcbiAgICAgICAgICAodGhpcy5fcmVzb2x2ZWQgPyBcInJlc29sdmVkXCIgOiBcInJlamVjdGVkXCIpICsgXCIuXCI7XG4gICAgICB9XG4gICAgICB0aGlzLl9yZXNvbHZlZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZXN1bHQgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgcmVzdWx0cyA9IGFyZ3VtZW50cztcbiAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MsIGZ1bmN0aW9uKHJlc29sdmVkQ2FsbGJhY2spIHtcbiAgICAgICAgcmVzb2x2ZWRDYWxsYmFjay5hcHBseSh0aGlzLCByZXN1bHRzKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MgPSBbXTtcbiAgICAgIHRoaXMuX3JlamVjdGVkQ2FsbGJhY2tzID0gW107XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoaXMgcHJvbWlzZSBhcyBmdWxmaWxsZWQsIGZpcmluZyBhbnkgY2FsbGJhY2tzIHdhaXRpbmcgb24gaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yIHRoZSBlcnJvciB0byBwYXNzIHRvIHRoZSBjYWxsYmFja3MuXG4gICAgICovXG4gICAgcmVqZWN0OiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKHRoaXMuX3Jlc29sdmVkIHx8IHRoaXMuX3JlamVjdGVkKSB7XG4gICAgICAgIHRocm93IFwiQSBwcm9taXNlIHdhcyByZWplY3RlZCBldmVuIHRob3VnaCBpdCBoYWQgYWxyZWFkeSBiZWVuIFwiICtcbiAgICAgICAgICAodGhpcy5fcmVzb2x2ZWQgPyBcInJlc29sdmVkXCIgOiBcInJlamVjdGVkXCIpICsgXCIuXCI7XG4gICAgICB9XG4gICAgICB0aGlzLl9yZWplY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaCh0aGlzLl9yZWplY3RlZENhbGxiYWNrcywgZnVuY3Rpb24ocmVqZWN0ZWRDYWxsYmFjaykge1xuICAgICAgICByZWplY3RlZENhbGxiYWNrKGVycm9yKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVzb2x2ZWRDYWxsYmFja3MgPSBbXTtcbiAgICAgIHRoaXMuX3JlamVjdGVkQ2FsbGJhY2tzID0gW107XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZHMgY2FsbGJhY2tzIHRvIGJlIGNhbGxlZCB3aGVuIHRoaXMgcHJvbWlzZSBpcyBmdWxmaWxsZWQuIFJldHVybnMgYSBuZXdcbiAgICAgKiBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGUgY2FsbGJhY2sgaXMgY29tcGxldGUuIEl0IGFsbG93c1xuICAgICAqIGNoYWluaW5nLiBJZiB0aGUgY2FsbGJhY2sgaXRzZWxmIHJldHVybnMgYSBQcm9taXNlLCB0aGVuIHRoZSBvbmUgcmV0dXJuZWRcbiAgICAgKiBieSBcInRoZW5cIiB3aWxsIG5vdCBiZSBmdWxmaWxsZWQgdW50aWwgdGhhdCBvbmUgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG4gICAgICogaXMgZnVsZmlsbGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVkQ2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGlzXG4gICAgICogUHJvbWlzZSBpcyByZXNvbHZlZC4gT25jZSB0aGUgY2FsbGJhY2sgaXMgY29tcGxldGUsIHRoZW4gdGhlIFByb21pc2VcbiAgICAgKiByZXR1cm5lZCBieSBcInRoZW5cIiB3aWxsIGFsc28gYmUgZnVsZmlsbGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkQ2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGlzXG4gICAgICogUHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIGFuIGVycm9yLiBPbmNlIHRoZSBjYWxsYmFjayBpcyBjb21wbGV0ZSwgdGhlblxuICAgICAqIHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IFwidGhlblwiIHdpdGggYmUgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5LiBJZlxuICAgICAqIHJlamVjdGVkQ2FsbGJhY2sgaXMgbnVsbCwgb3IgaXQgcmV0dXJucyBhIHJlamVjdGVkIFByb21pc2UsIHRoZW4gdGhlXG4gICAgICogUHJvbWlzZSByZXR1cm5lZCBieSBcInRoZW5cIiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhhdCBlcnJvci5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIG5ldyBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgYWZ0ZXIgdGhpc1xuICAgICAqIFByb21pc2UgaXMgZnVsZmlsbGVkIGFuZCBlaXRoZXIgY2FsbGJhY2sgaGFzIGNvbXBsZXRlZC4gSWYgdGhlIGNhbGxiYWNrXG4gICAgICogcmV0dXJuZWQgYSBQcm9taXNlLCB0aGVuIHRoaXMgUHJvbWlzZSB3aWxsIG5vdCBiZSBmdWxmaWxsZWQgdW50aWwgdGhhdFxuICAgICAqIG9uZSBpcy5cbiAgICAgKi9cbiAgICB0aGVuOiBmdW5jdGlvbihyZXNvbHZlZENhbGxiYWNrLCByZWplY3RlZENhbGxiYWNrKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG5cbiAgICAgIHZhciB3cmFwcGVkUmVzb2x2ZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gYXJndW1lbnRzO1xuICAgICAgICBpZiAocmVzb2x2ZWRDYWxsYmFjaykge1xuICAgICAgICAgIGlmIChQYXJzZS5Qcm9taXNlLl9pc1Byb21pc2VzQVBsdXNDb21wbGlhbnQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IFtyZXNvbHZlZENhbGxiYWNrLmFwcGx5KHRoaXMsIHJlc3VsdCldO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBbUGFyc2UuUHJvbWlzZS5lcnJvcihlKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtyZXNvbHZlZENhbGxiYWNrLmFwcGx5KHRoaXMsIHJlc3VsdCldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSAmJiBQYXJzZS5Qcm9taXNlLmlzKHJlc3VsdFswXSkpIHtcbiAgICAgICAgICByZXN1bHRbMF0udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciB3cmFwcGVkUmVqZWN0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWYgKHJlamVjdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICBpZiAoUGFyc2UuUHJvbWlzZS5faXNQcm9taXNlc0FQbHVzQ29tcGxpYW50KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBbcmVqZWN0ZWRDYWxsYmFjayhlcnJvcildO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBbUGFyc2UuUHJvbWlzZS5lcnJvcihlKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtyZWplY3RlZENhbGxiYWNrKGVycm9yKV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAxICYmIFBhcnNlLlByb21pc2UuaXMocmVzdWx0WzBdKSkge1xuICAgICAgICAgICAgcmVzdWx0WzBdLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZS5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChQYXJzZS5Qcm9taXNlLl9pc1Byb21pc2VzQVBsdXNDb21wbGlhbnQpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlLmFwcGx5KHByb21pc2UsIHJlc3VsdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlamVjdChyZXN1bHRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBydW5MYXRlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgZnVuYy5jYWxsKCk7XG4gICAgICB9O1xuICAgICAgaWYgKFBhcnNlLlByb21pc2UuX2lzUHJvbWlzZXNBUGx1c0NvbXBsaWFudCkge1xuICAgICAgICBpZiAodHlwZW9mKHdpbmRvdykgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5zZXRUaW1lb3V0KSB7XG4gICAgICAgICAgcnVuTGF0ZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jLCAwKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihwcm9jZXNzKSAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5uZXh0VGljaykge1xuICAgICAgICAgIHJ1bkxhdGVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmICh0aGlzLl9yZXNvbHZlZCkge1xuICAgICAgICBydW5MYXRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICB3cmFwcGVkUmVzb2x2ZWRDYWxsYmFjay5hcHBseShzZWxmLCBzZWxmLl9yZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcmVqZWN0ZWQpIHtcbiAgICAgICAgcnVuTGF0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd3JhcHBlZFJlamVjdGVkQ2FsbGJhY2soc2VsZi5fZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Jlc29sdmVkQ2FsbGJhY2tzLnB1c2god3JhcHBlZFJlc29sdmVkQ2FsbGJhY2spO1xuICAgICAgICB0aGlzLl9yZWplY3RlZENhbGxiYWNrcy5wdXNoKHdyYXBwZWRSZWplY3RlZENhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBoYW5kbGVycyB0byBiZSBjYWxsZWQgd2hlbiB0aGUgcHJvbWlzZSBcbiAgICAgKiBpcyBlaXRoZXIgcmVzb2x2ZWQgb3IgcmVqZWN0ZWRcbiAgICAgKi9cbiAgICBhbHdheXM6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKGNhbGxiYWNrLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBoYW5kbGVycyB0byBiZSBjYWxsZWQgd2hlbiB0aGUgUHJvbWlzZSBvYmplY3QgaXMgcmVzb2x2ZWRcbiAgICAgKi9cbiAgICBkb25lOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbihjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBoYW5kbGVycyB0byBiZSBjYWxsZWQgd2hlbiB0aGUgUHJvbWlzZSBvYmplY3QgaXMgcmVqZWN0ZWRcbiAgICAgKi9cbiAgICBmYWlsOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biB0aGUgZ2l2ZW4gY2FsbGJhY2tzIGFmdGVyIHRoaXMgcHJvbWlzZSBpcyBmdWxmaWxsZWQuXG4gICAgICogQHBhcmFtIG9wdGlvbnNPckNhbGxiYWNrIHt9IEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBjYWxsYmFjaywgb3IgYVxuICAgICAqIGNhbGxiYWNrIGZ1bmN0aW9uLiBJZiB0aGlzIGlzIGFuIG9wdGlvbnMgb2JqZWN0IGFuZCBjb250YWlucyBhIFwibW9kZWxcIlxuICAgICAqIGF0dHJpYnV0ZXMsIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gZXJyb3IgY2FsbGJhY2tzIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAgICAgKiBAcGFyYW0gbW9kZWwge30gSWYgdHJ1dGh5LCB0aGlzIHdpbGwgYmUgcGFzc2VkIGFzIHRoZSBmaXJzdCByZXN1bHQgb2ZcbiAgICAgKiBlcnJvciBjYWxsYmFja3MuIFRoaXMgaXMgZm9yIEJhY2tib25lLWNvbXBhdGFiaWxpdHkuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgd2lsbCBiZSByZXNvbHZlZCBhZnRlciB0aGVcbiAgICAgKiBjYWxsYmFja3MgYXJlIHJ1biwgd2l0aCB0aGUgc2FtZSByZXN1bHQgYXMgdGhpcy5cbiAgICAgKi9cbiAgICBfdGhlblJ1bkNhbGxiYWNrczogZnVuY3Rpb24ob3B0aW9uc09yQ2FsbGJhY2ssIG1vZGVsKSB7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9uc09yQ2FsbGJhY2spKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IG9wdGlvbnNPckNhbGxiYWNrO1xuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0LCBudWxsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnNPckNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZWwpIHtcbiAgICAgICAgICAvLyBXaGVuIHRoZXJlJ3Mgbm8gY2FsbGJhY2ssIGEgc3luYyBldmVudCBzaG91bGQgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgIG1vZGVsLnRyaWdnZXIoJ3N5bmMnLCBtb2RlbCwgcmVzdWx0LCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcy5hcHBseShQYXJzZS5Qcm9taXNlLCBhcmd1bWVudHMpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICBpZiAoIV8uaXNVbmRlZmluZWQobW9kZWwpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmVycm9yKG1vZGVsLCBlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlbCkge1xuICAgICAgICAgIC8vIFdoZW4gdGhlcmUncyBubyBlcnJvciBjYWxsYmFjaywgYW4gZXJyb3IgZXZlbnQgc2hvdWxkIGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdlcnJvcicsIG1vZGVsLCBlcnJvciwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQnkgZXhwbGljaXRseSByZXR1cm5pbmcgYSByZWplY3RlZCBQcm9taXNlLCB0aGlzIHdpbGwgd29yayB3aXRoXG4gICAgICAgIC8vIGVpdGhlciBqUXVlcnkgb3IgUHJvbWlzZXMvQSBzZW1hbnRpY3MuXG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgY2FsbGVkIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlclxuICAgICAqIHRoaXMgcHJvbWlzZSBmYWlsZWQgb3Igc3VjY2VlZGVkLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBnaXZlbiBlaXRoZXIgdGhlXG4gICAgICogYXJyYXkgb2YgcmVzdWx0cyBmb3IgaXRzIGZpcnN0IGFyZ3VtZW50LCBvciB0aGUgZXJyb3IgYXMgaXRzIHNlY29uZCxcbiAgICAgKiBkZXBlbmRpbmcgb24gd2hldGhlciB0aGlzIFByb21pc2Ugd2FzIHJlamVjdGVkIG9yIHJlc29sdmVkLiBSZXR1cm5zIGFcbiAgICAgKiBuZXcgUHJvbWlzZSwgbGlrZSBcInRoZW5cIiB3b3VsZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb250aW51YXRpb24gdGhlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIF9jb250aW51ZVdpdGg6IGZ1bmN0aW9uKGNvbnRpbnVhdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRpbnVhdGlvbihhcmd1bWVudHMsIG51bGwpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRpbnVhdGlvbihudWxsLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSk7XG5cbn0odGhpcykpO1xuXG4vKmpzaGludCBiaXR3aXNlOmZhbHNlICovLypnbG9iYWwgRmlsZVJlYWRlcjogdHJ1ZSwgRmlsZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICB2YXIgYjY0RGlnaXQgPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyIDwgMjYpIHtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgbnVtYmVyKTtcbiAgICB9XG4gICAgaWYgKG51bWJlciA8IDUyKSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIChudW1iZXIgLSAyNikpO1xuICAgIH1cbiAgICBpZiAobnVtYmVyIDwgNjIpIHtcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDQ4ICsgKG51bWJlciAtIDUyKSk7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPT09IDYyKSB7XG4gICAgICByZXR1cm4gXCIrXCI7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPT09IDYzKSB7XG4gICAgICByZXR1cm4gXCIvXCI7XG4gICAgfVxuICAgIHRocm93IFwiVHJpZWQgdG8gZW5jb2RlIGxhcmdlIGRpZ2l0IFwiICsgbnVtYmVyICsgXCIgaW4gYmFzZTY0LlwiO1xuICB9O1xuXG4gIHZhciBlbmNvZGVCYXNlNjQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBjaHVua3MgPSBbXTtcbiAgICBjaHVua3MubGVuZ3RoID0gTWF0aC5jZWlsKGFycmF5Lmxlbmd0aCAvIDMpO1xuICAgIF8udGltZXMoY2h1bmtzLmxlbmd0aCwgZnVuY3Rpb24oaSkge1xuICAgICAgdmFyIGIxID0gYXJyYXlbaSAqIDNdO1xuICAgICAgdmFyIGIyID0gYXJyYXlbaSAqIDMgKyAxXSB8fCAwO1xuICAgICAgdmFyIGIzID0gYXJyYXlbaSAqIDMgKyAyXSB8fCAwO1xuXG4gICAgICB2YXIgaGFzMiA9IChpICogMyArIDEpIDwgYXJyYXkubGVuZ3RoO1xuICAgICAgdmFyIGhhczMgPSAoaSAqIDMgKyAyKSA8IGFycmF5Lmxlbmd0aDtcblxuICAgICAgY2h1bmtzW2ldID0gW1xuICAgICAgICBiNjREaWdpdCgoYjEgPj4gMikgJiAweDNGKSxcbiAgICAgICAgYjY0RGlnaXQoKChiMSA8PCA0KSAmIDB4MzApIHwgKChiMiA+PiA0KSAmIDB4MEYpKSxcbiAgICAgICAgaGFzMiA/IGI2NERpZ2l0KCgoYjIgPDwgMikgJiAweDNDKSB8ICgoYjMgPj4gNikgJiAweDAzKSkgOiBcIj1cIixcbiAgICAgICAgaGFzMyA/IGI2NERpZ2l0KGIzICYgMHgzRikgOiBcIj1cIlxuICAgICAgXS5qb2luKFwiXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBjaHVua3Muam9pbihcIlwiKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVhZHMgYSBGaWxlIHVzaW5nIGEgRmlsZVJlYWRlci5cbiAgICogQHBhcmFtIGZpbGUge0ZpbGV9IHRoZSBGaWxlIHRvIHJlYWQuXG4gICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9IChvcHRpb25hbCkgdGhlIG1pbWV0eXBlIHRvIG92ZXJyaWRlIHdpdGguXG4gICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgUHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdpdGggYVxuICAgKiAgICAgYmFzZTY0LWVuY29kZWQgc3RyaW5nIG9mIHRoZSBkYXRhIGFuZCBpdHMgbWltZSB0eXBlLlxuICAgKi9cbiAgdmFyIHJlYWRBc3luYyA9IGZ1bmN0aW9uKGZpbGUsIHR5cGUpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQYXJzZS5Qcm9taXNlKCk7XG5cbiAgICBpZiAodHlwZW9mKEZpbGVSZWFkZXIpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgUGFyc2UuRXJyb3IuRklMRV9SRUFEX0VSUk9SLFxuICAgICAgICAgIFwiQXR0ZW1wdGVkIHRvIHVzZSBhIEZpbGVSZWFkZXIgb24gYW4gdW5zdXBwb3J0ZWQgYnJvd3Nlci5cIikpO1xuICAgIH1cblxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyZWFkZXIucmVhZHlTdGF0ZSAhPT0gMikge1xuICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5GSUxFX1JFQURfRVJST1IsXG4gICAgICAgICAgICBcIkVycm9yIHJlYWRpbmcgZmlsZS5cIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhVVJMID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgIHZhciBtYXRjaGVzID0gL15kYXRhOihbXjtdKik7YmFzZTY0LCguKikkLy5leGVjKGRhdGFVUkwpO1xuICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHByb21pc2UucmVqZWN0KG5ldyBQYXJzZS5FcnJvcihcbiAgICAgICAgICAgIFBhcnNlLkVycm9yLkZJTEVfUkVBRF9FUlJPUixcbiAgICAgICAgICAgIFwiVW5hYmxlIHRvIGludGVycHJldCBkYXRhIFVSTDogXCIgKyBkYXRhVVJMKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS5yZXNvbHZlKG1hdGNoZXNbMl0sIHR5cGUgfHwgbWF0Y2hlc1sxXSk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfTtcblxuICAvKipcbiAgICogQSBQYXJzZS5GaWxlIGlzIGEgbG9jYWwgcmVwcmVzZW50YXRpb24gb2YgYSBmaWxlIHRoYXQgaXMgc2F2ZWQgdG8gdGhlIFBhcnNlXG4gICAqIGNsb3VkLlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gVGhlIGZpbGUncyBuYW1lLiBUaGlzIHdpbGwgYmUgcHJlZml4ZWQgYnkgYSB1bmlxdWVcbiAgICogICAgIHZhbHVlIG9uY2UgdGhlIGZpbGUgaGFzIGZpbmlzaGVkIHNhdmluZy4gVGhlIGZpbGUgbmFtZSBtdXN0IGJlZ2luIHdpdGhcbiAgICogICAgIGFuIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXIsIGFuZCBjb25zaXN0IG9mIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLFxuICAgKiAgICAgcGVyaW9kcywgc3BhY2VzLCB1bmRlcnNjb3Jlcywgb3IgZGFzaGVzLlxuICAgKiBAcGFyYW0gZGF0YSB7QXJyYXl9IFRoZSBkYXRhIGZvciB0aGUgZmlsZSwgYXMgZWl0aGVyOlxuICAgKiAgICAgMS4gYW4gQXJyYXkgb2YgYnl0ZSB2YWx1ZSBOdW1iZXJzLCBvclxuICAgKiAgICAgMi4gYW4gT2JqZWN0IGxpa2UgeyBiYXNlNjQ6IFwiLi4uXCIgfSB3aXRoIGEgYmFzZTY0LWVuY29kZWQgU3RyaW5nLlxuICAgKiAgICAgMy4gYSBGaWxlIG9iamVjdCBzZWxlY3RlZCB3aXRoIGEgZmlsZSB1cGxvYWQgY29udHJvbC4gKDMpIG9ubHkgd29ya3NcbiAgICogICAgICAgIGluIEZpcmVmb3ggMy42KywgU2FmYXJpIDYuMC4yKywgQ2hyb21lIDcrLCBhbmQgSUUgMTArLlxuICAgKiAgICAgICAgRm9yIGV4YW1wbGU6PHByZT5cbiAgICogdmFyIGZpbGVVcGxvYWRDb250cm9sID0gJChcIiNwcm9maWxlUGhvdG9GaWxlVXBsb2FkXCIpWzBdO1xuICAgKiBpZiAoZmlsZVVwbG9hZENvbnRyb2wuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgKiAgIHZhciBmaWxlID0gZmlsZVVwbG9hZENvbnRyb2wuZmlsZXNbMF07XG4gICAqICAgdmFyIG5hbWUgPSBcInBob3RvLmpwZ1wiO1xuICAgKiAgIHZhciBwYXJzZUZpbGUgPSBuZXcgUGFyc2UuRmlsZShuYW1lLCBmaWxlKTtcbiAgICogICBwYXJzZUZpbGUuc2F2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAqICAgICAvLyBUaGUgZmlsZSBoYXMgYmVlbiBzYXZlZCB0byBQYXJzZS5cbiAgICogICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgLy8gVGhlIGZpbGUgZWl0aGVyIGNvdWxkIG5vdCBiZSByZWFkLCBvciBjb3VsZCBub3QgYmUgc2F2ZWQgdG8gUGFyc2UuXG4gICAqICAgfSk7XG4gICAqIH08L3ByZT5cbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gT3B0aW9uYWwgQ29udGVudC1UeXBlIGhlYWRlciB0byB1c2UgZm9yIHRoZSBmaWxlLiBJZlxuICAgKiAgICAgdGhpcyBpcyBvbWl0dGVkLCB0aGUgY29udGVudCB0eXBlIHdpbGwgYmUgaW5mZXJyZWQgZnJvbSB0aGUgbmFtZSdzXG4gICAqICAgICBleHRlbnNpb24uXG4gICAqL1xuICBQYXJzZS5GaWxlID0gZnVuY3Rpb24obmFtZSwgZGF0YSwgdHlwZSkge1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuXG4gICAgLy8gR3Vlc3MgdGhlIGNvbnRlbnQgdHlwZSBmcm9tIHRoZSBleHRlbnNpb24gaWYgd2UgbmVlZCB0by5cbiAgICB2YXIgZXh0ZW5zaW9uID0gL1xcLihbXi5dKikkLy5leGVjKG5hbWUpO1xuICAgIGlmIChleHRlbnNpb24pIHtcbiAgICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvblsxXS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICB2YXIgc3BlY2lmaWVkVHlwZSA9IHR5cGUgfHwgJyc7XG5cbiAgICBpZiAoXy5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB0aGlzLl9zb3VyY2UgPSBQYXJzZS5Qcm9taXNlLmFzKGVuY29kZUJhc2U2NChkYXRhKSwgc3BlY2lmaWVkVHlwZSk7XG4gICAgfSBlbHNlIGlmIChkYXRhICYmIGRhdGEuYmFzZTY0KSB7XG4gICAgICAvLyBpZiBpdCBjb250YWlucyBkYXRhIHVyaSwgZXh0cmFjdCBiYXNlZDY0IGFuZCB0aGUgdHlwZSBvdXQgb2YgaXQuXG4gICAgICAvKmpzbGludCBtYXhsZW46IDEwMDAqL1xuICAgICAgdmFyIGRhdGFVcmlSZWdleHAgPSAvXmRhdGE6KFthLXpBLVpdKlxcL1thLXpBLVorLi1dKik7KGNoYXJzZXQ9W2EtekEtWjAtOVxcLVxcL1xcc10qLCk/YmFzZTY0LChcXFMrKS87XG4gICAgICAvKmpzbGludCBtYXhsZW46IDgwKi9cblxuICAgICAgdmFyIG1hdGNoZXMgPSBkYXRhVXJpUmVnZXhwLmV4ZWMoZGF0YS5iYXNlNjQpO1xuICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIGlmIGRhdGEgVVJJIHdpdGggY2hhcnNldCwgdGhlcmUgd2lsbCBoYXZlIDQgbWF0Y2hlcy5cbiAgICAgICAgdGhpcy5fc291cmNlID0gUGFyc2UuUHJvbWlzZS5hcyhcbiAgICAgICAgICAobWF0Y2hlcy5sZW5ndGggPT09IDQgPyBtYXRjaGVzWzNdIDogbWF0Y2hlc1syXSksIG1hdGNoZXNbMV1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IFBhcnNlLlByb21pc2UuYXMoZGF0YS5iYXNlNjQsIHNwZWNpZmllZFR5cGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mKEZpbGUpICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBGaWxlKSB7XG4gICAgICB0aGlzLl9zb3VyY2UgPSByZWFkQXN5bmMoZGF0YSwgdHlwZSk7XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGRhdGEpKSB7XG4gICAgICB0aHJvdyBcIkNyZWF0aW5nIGEgUGFyc2UuRmlsZSBmcm9tIGEgU3RyaW5nIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLlwiO1xuICAgIH1cbiAgfTtcblxuICBQYXJzZS5GaWxlLnByb3RvdHlwZSA9IHtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGZpbGUuIEJlZm9yZSBzYXZlIGlzIGNhbGxlZCwgdGhpcyBpcyB0aGUgZmlsZW5hbWVcbiAgICAgKiBnaXZlbiBieSB0aGUgdXNlci4gQWZ0ZXIgc2F2ZSBpcyBjYWxsZWQsIHRoYXQgbmFtZSBnZXRzIHByZWZpeGVkIHdpdGggYVxuICAgICAqIHVuaXF1ZSBpZGVudGlmaWVyLlxuICAgICAqL1xuICAgIG5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHVybCBvZiB0aGUgZmlsZS4gSXQgaXMgb25seSBhdmFpbGFibGUgYWZ0ZXIgeW91IHNhdmUgdGhlIGZpbGUgb3JcbiAgICAgKiBhZnRlciB5b3UgZ2V0IHRoZSBmaWxlIGZyb20gYSBQYXJzZS5PYmplY3QuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHVybDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTYXZlcyB0aGUgZmlsZSB0byB0aGUgUGFyc2UgY2xvdWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgc2F2ZSBmaW5pc2hlcy5cbiAgICAgKi9cbiAgICBzYXZlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoIXNlbGYuX3ByZXZpb3VzU2F2ZSkge1xuICAgICAgICBzZWxmLl9wcmV2aW91c1NhdmUgPSBzZWxmLl9zb3VyY2UudGhlbihmdW5jdGlvbihiYXNlNjQsIHR5cGUpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGJhc2U2NDogYmFzZTY0LFxuICAgICAgICAgICAgX0NvbnRlbnRUeXBlOiB0eXBlXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICAgICAgcm91dGU6IFwiZmlsZXNcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogc2VsZi5fbmFtZSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgc2VsZi5fbmFtZSA9IHJlc3BvbnNlLm5hbWU7XG4gICAgICAgICAgc2VsZi5fdXJsID0gcmVzcG9uc2UudXJsO1xuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLl9wcmV2aW91c1NhdmUuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG59KHRoaXMpKTtcblxuLy8gUGFyc2UuT2JqZWN0IGlzIGFuYWxvZ291cyB0byB0aGUgSmF2YSBQYXJzZU9iamVjdC5cbi8vIEl0IGFsc28gaW1wbGVtZW50cyB0aGUgc2FtZSBpbnRlcmZhY2UgYXMgYSBCYWNrYm9uZSBtb2RlbC5cbi8vIFRPRE86IG11bHRpcGxlIGRpc3BhdGNoIGZvciBjYWxsYmFja3NcbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgbW9kZWwgd2l0aCBkZWZpbmVkIGF0dHJpYnV0ZXMuIEEgY2xpZW50IGlkIChjaWQpIGlzXG4gICAqIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGFuZCBhc3NpZ25lZCBmb3IgeW91LlxuICAgKlxuICAgKiA8cD5Zb3Ugd29uJ3Qgbm9ybWFsbHkgY2FsbCB0aGlzIG1ldGhvZCBkaXJlY3RseS4gIEl0IGlzIHJlY29tbWVuZGVkIHRoYXRcbiAgICogeW91IHVzZSBhIHN1YmNsYXNzIG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4gaW5zdGVhZCwgY3JlYXRlZCBieSBjYWxsaW5nXG4gICAqIDxjb2RlPmV4dGVuZDwvY29kZT4uPC9wPlxuICAgKlxuICAgKiA8cD5Ib3dldmVyLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byB1c2UgYSBzdWJjbGFzcywgb3IgYXJlbid0IHN1cmUgd2hpY2hcbiAgICogc3ViY2xhc3MgaXMgYXBwcm9wcmlhdGUsIHlvdSBjYW4gdXNlIHRoaXMgZm9ybTo8cHJlPlxuICAgKiAgICAgdmFyIG9iamVjdCA9IG5ldyBQYXJzZS5PYmplY3QoXCJDbGFzc05hbWVcIik7XG4gICAqIDwvcHJlPlxuICAgKiBUaGF0IGlzIGJhc2ljYWxseSBlcXVpdmFsZW50IHRvOjxwcmU+XG4gICAqICAgICB2YXIgTXlDbGFzcyA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJDbGFzc05hbWVcIik7XG4gICAqICAgICB2YXIgb2JqZWN0ID0gbmV3IE15Q2xhc3MoKTtcbiAgICogPC9wcmU+PC9wPlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyBUaGUgaW5pdGlhbCBzZXQgb2YgZGF0YSB0byBzdG9yZSBpbiB0aGUgb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIHNldCBvZiBCYWNrYm9uZS1saWtlIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRoZVxuICAgKiAgICAgb2JqZWN0LiAgVGhlIG9ubHkgb3B0aW9uIGN1cnJlbnRseSBzdXBwb3J0ZWQgaXMgXCJjb2xsZWN0aW9uXCIuXG4gICAqIEBzZWUgUGFyc2UuT2JqZWN0LmV4dGVuZFxuICAgKlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+VGhlIGZ1bmRhbWVudGFsIHVuaXQgb2YgUGFyc2UgZGF0YSwgd2hpY2ggaW1wbGVtZW50cyB0aGUgQmFja2JvbmUgTW9kZWxcbiAgICogaW50ZXJmYWNlLjwvcD5cbiAgICovXG4gIFBhcnNlLk9iamVjdCA9IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcbiAgICAvLyBBbGxvdyBuZXcgUGFyc2UuT2JqZWN0KFwiQ2xhc3NOYW1lXCIpIGFzIGEgc2hvcnRjdXQgdG8gX2NyZWF0ZS5cbiAgICBpZiAoXy5pc1N0cmluZyhhdHRyaWJ1dGVzKSkge1xuICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgfHwge307XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wYXJzZSkge1xuICAgICAgYXR0cmlidXRlcyA9IHRoaXMucGFyc2UoYXR0cmlidXRlcyk7XG4gICAgfVxuICAgIHZhciBkZWZhdWx0cyA9IFBhcnNlLl9nZXRWYWx1ZSh0aGlzLCAnZGVmYXVsdHMnKTtcbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGF0dHJpYnV0ZXMgPSBfLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmNvbGxlY3Rpb24pIHtcbiAgICAgIHRoaXMuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLl9zZXJ2ZXJEYXRhID0ge307ICAvLyBUaGUgbGFzdCBrbm93biBkYXRhIGZvciB0aGlzIG9iamVjdCBmcm9tIGNsb3VkLlxuICAgIHRoaXMuX29wU2V0UXVldWUgPSBbe31dOyAgLy8gTGlzdCBvZiBzZXRzIG9mIGNoYW5nZXMgdG8gdGhlIGRhdGEuXG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307ICAvLyBUaGUgYmVzdCBlc3RpbWF0ZSBvZiB0aGlzJ3MgY3VycmVudCBkYXRhLlxuXG4gICAgdGhpcy5faGFzaGVkSlNPTiA9IHt9OyAgLy8gSGFzaCBvZiB2YWx1ZXMgb2YgY29udGFpbmVycyBhdCBsYXN0IHNhdmUuXG4gICAgdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLmNpZCA9IF8udW5pcXVlSWQoJ2MnKTtcbiAgICB0aGlzLmNoYW5nZWQgPSB7fTtcbiAgICB0aGlzLl9zaWxlbnQgPSB7fTtcbiAgICB0aGlzLl9wZW5kaW5nID0ge307XG4gICAgaWYgKCF0aGlzLnNldChhdHRyaWJ1dGVzLCB7c2lsZW50OiB0cnVlfSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBhbiBpbnZhbGlkIFBhcnNlLk9iamVjdFwiKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VkID0ge307XG4gICAgdGhpcy5fc2lsZW50ID0ge307XG4gICAgdGhpcy5fcGVuZGluZyA9IHt9O1xuICAgIHRoaXMuX2hhc0RhdGEgPSB0cnVlO1xuICAgIHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoaXMgb2JqZWN0LCB1bmlxdWUgd2l0aGluIGl0cyBjbGFzcy5cbiAgICogQG5hbWUgaWRcbiAgICogQHR5cGUgU3RyaW5nXG4gICAqIEBmaWVsZFxuICAgKiBAbWVtYmVyT2YgUGFyc2UuT2JqZWN0LnByb3RvdHlwZVxuICAgKi9cblxuICAvKipcbiAgICogVGhlIGZpcnN0IHRpbWUgdGhpcyBvYmplY3Qgd2FzIHNhdmVkIG9uIHRoZSBzZXJ2ZXIuXG4gICAqIEBuYW1lIGNyZWF0ZWRBdFxuICAgKiBAdHlwZSBEYXRlXG4gICAqIEBmaWVsZFxuICAgKiBAbWVtYmVyT2YgUGFyc2UuT2JqZWN0LnByb3RvdHlwZVxuICAgKi9cblxuICAvKipcbiAgICogVGhlIGxhc3QgdGltZSB0aGlzIG9iamVjdCB3YXMgdXBkYXRlZCBvbiB0aGUgc2VydmVyLlxuICAgKiBAbmFtZSB1cGRhdGVkQXRcbiAgICogQHR5cGUgRGF0ZVxuICAgKiBAZmllbGRcbiAgICogQG1lbWJlck9mIFBhcnNlLk9iamVjdC5wcm90b3R5cGVcbiAgICovXG5cbiAgLyoqXG4gICAqIFNhdmVzIHRoZSBnaXZlbiBsaXN0IG9mIFBhcnNlLk9iamVjdC5cbiAgICogSWYgYW55IGVycm9yIGlzIGVuY291bnRlcmVkLCBzdG9wcyBhbmQgY2FsbHMgdGhlIGVycm9yIGhhbmRsZXIuXG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgUGFyc2UuT2JqZWN0LnNhdmVBbGwoW29iamVjdDEsIG9iamVjdDIsIC4uLl0sIHtcbiAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICogICAgICAgLy8gQWxsIHRoZSBvYmplY3RzIHdlcmUgc2F2ZWQuXG4gICAqICAgICB9LFxuICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIC8vIEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIHNhdmluZyBvbmUgb2YgdGhlIG9iamVjdHMuXG4gICAqICAgICB9LFxuICAgKiAgIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBIGxpc3Qgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+dXNlTWFzdGVyS2V5OiBJbiBDbG91ZCBDb2RlIGFuZCBOb2RlIG9ubHksIGNhdXNlcyB0aGUgTWFzdGVyIEtleSB0b1xuICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgKiAgIDxsaT5zZXNzaW9uVG9rZW46IEEgdmFsaWQgc2Vzc2lvbiB0b2tlbiwgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdCBvblxuICAgKiAgICAgICBiZWhhbGYgb2YgYSBzcGVjaWZpYyB1c2VyLlxuICAgKiA8L3VsPlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0LnNhdmVBbGwgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fZGVlcFNhdmVBc3luYyhsaXN0LCB7XG4gICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgc2Vzc2lvblRva2VuOiBvcHRpb25zLnNlc3Npb25Ub2tlblxuICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBnaXZlbiBsaXN0IG9mIG1vZGVscyBvbiB0aGUgc2VydmVyIGlmIGl0IHdhcyBhbHJlYWR5IHBlcnNpc3RlZC5cbiAgICogT3B0aW1pc3RpY2FsbHkgcmVtb3ZlcyBlYWNoIG1vZGVsIGZyb20gaXRzIGNvbGxlY3Rpb24sIGlmIGl0IGhhcyBvbmUuXG4gICAqIElmIGB3YWl0OiB0cnVlYCBpcyBwYXNzZWQsIHdhaXRzIGZvciB0aGUgc2VydmVyIHRvIHJlc3BvbmQgYmVmb3JlIHJlbW92YWwuXG4gICAqXG4gICAqIDxwPlVubGlrZSBzYXZlQWxsLCBpZiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgZGVsZXRpbmcgYW4gaW5kaXZpZHVhbCBtb2RlbCxcbiAgICogdGhpcyBtZXRob2Qgd2lsbCBjb250aW51ZSB0cnlpbmcgdG8gZGVsZXRlIHRoZSByZXN0IG9mIHRoZSBtb2RlbHMgaWZcbiAgICogcG9zc2libGUsIGV4Y2VwdCBpbiB0aGUgY2FzZSBvZiBhIGZhdGFsIGVycm9yIGxpa2UgYSBjb25uZWN0aW9uIGVycm9yLlxuICAgKlxuICAgKiA8cD5JbiBwYXJ0aWN1bGFyLCB0aGUgUGFyc2UuRXJyb3Igb2JqZWN0IHJldHVybmVkIGluIHRoZSBjYXNlIG9mIGVycm9yIG1heVxuICAgKiBiZSBvbmUgb2YgdHdvIHR5cGVzOlxuICAgKlxuICAgKiA8dWw+XG4gICAqICAgPGxpPkEgUGFyc2UuRXJyb3IuQUdHUkVHQVRFX0VSUk9SLiBUaGlzIG9iamVjdCdzIFwiZXJyb3JzXCIgcHJvcGVydHkgaXMgYW5cbiAgICogICAgICAgYXJyYXkgb2Ygb3RoZXIgUGFyc2UuRXJyb3Igb2JqZWN0cy4gRWFjaCBlcnJvciBvYmplY3QgaW4gdGhpcyBhcnJheVxuICAgKiAgICAgICBoYXMgYW4gXCJvYmplY3RcIiBwcm9wZXJ0eSB0aGF0IHJlZmVyZW5jZXMgdGhlIG9iamVjdCB0aGF0IGNvdWxkIG5vdCBiZVxuICAgKiAgICAgICBkZWxldGVkIChmb3IgaW5zdGFuY2UsIGJlY2F1c2UgdGhhdCBvYmplY3QgY291bGQgbm90IGJlIGZvdW5kKS48L2xpPlxuICAgKiAgIDxsaT5BIG5vbi1hZ2dyZWdhdGUgUGFyc2UuRXJyb3IuIFRoaXMgaW5kaWNhdGVzIGEgc2VyaW91cyBlcnJvciB0aGF0XG4gICAqICAgICAgIGNhdXNlZCB0aGUgZGVsZXRlIG9wZXJhdGlvbiB0byBiZSBhYm9ydGVkIHBhcnR3YXkgdGhyb3VnaCAoZm9yXG4gICAqICAgICAgIGluc3RhbmNlLCBhIGNvbm5lY3Rpb24gZmFpbHVyZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBkZWxldGUpLjwvbGk+XG4gICAqIDwvdWw+XG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgUGFyc2UuT2JqZWN0LmRlc3Ryb3lBbGwoW29iamVjdDEsIG9iamVjdDIsIC4uLl0sIHtcbiAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICAvLyBBbGwgdGhlIG9iamVjdHMgd2VyZSBkZWxldGVkLlxuICAgKiAgICAgfSxcbiAgICogICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICAvLyBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBkZWxldGluZyBvbmUgb3IgbW9yZSBvZiB0aGUgb2JqZWN0cy5cbiAgICogICAgICAgLy8gSWYgdGhpcyBpcyBhbiBhZ2dyZWdhdGUgZXJyb3IsIHRoZW4gd2UgY2FuIGluc3BlY3QgZWFjaCBlcnJvclxuICAgKiAgICAgICAvLyBvYmplY3QgaW5kaXZpZHVhbGx5IHRvIGRldGVybWluZSB0aGUgcmVhc29uIHdoeSBhIHBhcnRpY3VsYXJcbiAgICogICAgICAgLy8gb2JqZWN0IHdhcyBub3QgZGVsZXRlZC5cbiAgICogICAgICAgaWYgKGVycm9yLmNvZGUgPT0gUGFyc2UuRXJyb3IuQUdHUkVHQVRFX0VSUk9SKSB7XG4gICAqICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvci5lcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICogICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRuJ3QgZGVsZXRlIFwiICsgZXJyb3IuZXJyb3JzW2ldLm9iamVjdC5pZCArXG4gICAqICAgICAgICAgICAgIFwiZHVlIHRvIFwiICsgZXJyb3IuZXJyb3JzW2ldLm1lc3NhZ2UpO1xuICAgKiAgICAgICAgIH1cbiAgICogICAgICAgfSBlbHNlIHtcbiAgICogICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZSBhYm9ydGVkIGJlY2F1c2Ugb2YgXCIgKyBlcnJvci5tZXNzYWdlKTtcbiAgICogICAgICAgfVxuICAgKiAgICAgfSxcbiAgICogICB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICogICA8bGk+c2Vzc2lvblRva2VuOiBBIHZhbGlkIHNlc3Npb24gdG9rZW4sIHVzZWQgZm9yIG1ha2luZyBhIHJlcXVlc3Qgb25cbiAgICogICAgICAgYmVoYWxmIG9mIGEgc3BlY2lmaWMgdXNlci5cbiAgICogPC91bD5cbiAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIGRlc3Ryb3lBbGxcbiAgICogICAgIGNvbXBsZXRlcy5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5kZXN0cm95QWxsID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHRyaWdnZXJEZXN0cm95ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICBvYmplY3QudHJpZ2dlcignZGVzdHJveScsIG9iamVjdCwgb2JqZWN0LmNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICB2YXIgZXJyb3JzID0gW107XG4gICAgdmFyIGRlc3Ryb3lCYXRjaCA9IGZ1bmN0aW9uKGJhdGNoKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IFBhcnNlLlByb21pc2UuYXMoKTtcblxuICAgICAgaWYgKGJhdGNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICAgICAgcm91dGU6IFwiYmF0Y2hcIixcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICAgICAgc2Vzc2lvblRva2VuOiBvcHRpb25zLnNlc3Npb25Ub2tlbixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgcmVxdWVzdHM6IF8ubWFwKGJhdGNoLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgICAgICAgICAgICAgcGF0aDogXCIvMS9jbGFzc2VzL1wiICsgb2JqZWN0LmNsYXNzTmFtZSArIFwiL1wiICsgb2JqZWN0LmlkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZXMsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgICAgUGFyc2UuX2FycmF5RWFjaChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VzW2ldLnN1Y2Nlc3MgJiYgb3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJEZXN0cm95KG9iamVjdCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlc1tpXS5lcnJvcikge1xuICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IocmVzcG9uc2VzW2ldLmVycm9yLmNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZXNbaV0uZXJyb3IuZXJyb3IpO1xuICAgICAgICAgICAgICBlcnJvci5vYmplY3QgPSBvYmplY3Q7XG5cbiAgICAgICAgICAgICAgZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHZhciBwcm9taXNlID0gUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgIHZhciBiYXRjaCA9IFtdO1xuICAgIFBhcnNlLl9hcnJheUVhY2gobGlzdCwgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICBpZiAoIW9iamVjdC5pZCB8fCAhb3B0aW9ucy53YWl0KSB7XG4gICAgICAgIHRyaWdnZXJEZXN0cm95KG9iamVjdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmplY3QuaWQpIHtcbiAgICAgICAgYmF0Y2gucHVzaChvYmplY3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYmF0Y2gubGVuZ3RoID09PSAyMCB8fCBpKzEgPT09IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgIHZhciB0aGlzQmF0Y2ggPSBiYXRjaDtcbiAgICAgICAgYmF0Y2ggPSBbXTtcblxuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBkZXN0cm95QmF0Y2godGhpc0JhdGNoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuQUdHUkVHQVRFX0VSUk9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJFcnJvciBkZWxldGluZyBhbiBvYmplY3QgaW4gZGVzdHJveUFsbFwiKTtcbiAgICAgICAgZXJyb3IuZXJyb3JzID0gZXJyb3JzO1xuXG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgZ2l2ZW4gbGlzdCBvZiBQYXJzZS5PYmplY3QuXG4gICAqIElmIGFueSBlcnJvciBpcyBlbmNvdW50ZXJlZCwgc3RvcHMgYW5kIGNhbGxzIHRoZSBlcnJvciBoYW5kbGVyLlxuICAgKlxuICAgKiA8cHJlPlxuICAgKiAgIFBhcnNlLk9iamVjdC5mZXRjaEFsbChbb2JqZWN0MSwgb2JqZWN0MiwgLi4uXSwge1xuICAgKiAgICAgc3VjY2VzczogZnVuY3Rpb24obGlzdCkge1xuICAgKiAgICAgICAvLyBBbGwgdGhlIG9iamVjdHMgd2VyZSBmZXRjaGVkLlxuICAgKiAgICAgfSxcbiAgICogICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICAvLyBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBmZXRjaGluZyBvbmUgb2YgdGhlIG9iamVjdHMuXG4gICAqICAgICB9LFxuICAgKiAgIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBIGxpc3Qgb2YgPGNvZGU+UGFyc2UuT2JqZWN0PC9jb2RlPi5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgKiAgIDxsaT5lcnJvcjogQW4gQmFja2JvbmUtc3R5bGUgZXJyb3IgY2FsbGJhY2suXG4gICAqIDwvdWw+XG4gICAqL1xuICBQYXJzZS5PYmplY3QuZmV0Y2hBbGwgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFBhcnNlLk9iamVjdC5fZmV0Y2hBbGwoXG4gICAgICBsaXN0LFxuICAgICAgdHJ1ZVxuICAgICkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgdGhlIGdpdmVuIGxpc3Qgb2YgUGFyc2UuT2JqZWN0IGlmIG5lZWRlZC5cbiAgICogSWYgYW55IGVycm9yIGlzIGVuY291bnRlcmVkLCBzdG9wcyBhbmQgY2FsbHMgdGhlIGVycm9yIGhhbmRsZXIuXG4gICAqXG4gICAqIDxwcmU+XG4gICAqICAgUGFyc2UuT2JqZWN0LmZldGNoQWxsSWZOZWVkZWQoW29iamVjdDEsIC4uLl0sIHtcbiAgICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICogICAgICAgLy8gT2JqZWN0cyB3ZXJlIGZldGNoZWQgYW5kIHVwZGF0ZWQuXG4gICAqICAgICB9LFxuICAgKiAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIC8vIEFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGZldGNoaW5nIG9uZSBvZiB0aGUgb2JqZWN0cy5cbiAgICogICAgIH0sXG4gICAqICAgfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEEgbGlzdCBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICogPC91bD5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5mZXRjaEFsbElmTmVlZGVkID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2ZldGNoQWxsKFxuICAgICAgbGlzdCxcbiAgICAgIGZhbHNlXG4gICAgKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcblxuICAvLyBBdHRhY2ggYWxsIGluaGVyaXRhYmxlIG1ldGhvZHMgdG8gdGhlIFBhcnNlLk9iamVjdCBwcm90b3R5cGUuXG4gIF8uZXh0ZW5kKFBhcnNlLk9iamVjdC5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgICAgICAgLyoqIEBsZW5kcyBQYXJzZS5PYmplY3QucHJvdG90eXBlICovIHtcbiAgICBfZXhpc3RlZDogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAgKiBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiB2ZXJzaW9uIG9mIHRoZSBvYmplY3Qgc3VpdGFibGUgZm9yIHNhdmluZyB0byBQYXJzZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqc29uID0gdGhpcy5fdG9GdWxsSlNPTigpO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChbXCJfX3R5cGVcIiwgXCJjbGFzc05hbWVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGtleSkgeyBkZWxldGUganNvbltrZXldOyB9KTtcbiAgICAgIHJldHVybiBqc29uO1xuICAgIH0sXG5cbiAgICBfdG9GdWxsSlNPTjogZnVuY3Rpb24oc2Vlbk9iamVjdHMpIHtcbiAgICAgIHZhciBqc29uID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goanNvbiwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAganNvbltrZXldID0gUGFyc2UuX2VuY29kZSh2YWwsIHNlZW5PYmplY3RzKTtcbiAgICAgIH0pO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5fb3BlcmF0aW9ucywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAganNvbltrZXldID0gdmFsO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChfLmhhcyh0aGlzLCBcImlkXCIpKSB7XG4gICAgICAgIGpzb24ub2JqZWN0SWQgPSB0aGlzLmlkO1xuICAgICAgfVxuICAgICAgaWYgKF8uaGFzKHRoaXMsIFwiY3JlYXRlZEF0XCIpKSB7XG4gICAgICAgIGlmIChfLmlzRGF0ZSh0aGlzLmNyZWF0ZWRBdCkpIHtcbiAgICAgICAgICBqc29uLmNyZWF0ZWRBdCA9IHRoaXMuY3JlYXRlZEF0LnRvSlNPTigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGpzb24uY3JlYXRlZEF0ID0gdGhpcy5jcmVhdGVkQXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKF8uaGFzKHRoaXMsIFwidXBkYXRlZEF0XCIpKSB7XG4gICAgICAgIGlmIChfLmlzRGF0ZSh0aGlzLnVwZGF0ZWRBdCkpIHtcbiAgICAgICAgICBqc29uLnVwZGF0ZWRBdCA9IHRoaXMudXBkYXRlZEF0LnRvSlNPTigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGpzb24udXBkYXRlZEF0ID0gdGhpcy51cGRhdGVkQXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGpzb24uX190eXBlID0gXCJPYmplY3RcIjtcbiAgICAgIGpzb24uY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWU7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBfaGFzaGVkSlNPTiB0byByZWZsZWN0IHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgb2JqZWN0LlxuICAgICAqIEFkZHMgYW55IGNoYW5nZWQgaGFzaCB2YWx1ZXMgdG8gdGhlIHNldCBvZiBwZW5kaW5nIGNoYW5nZXMuXG4gICAgICovXG4gICAgX3JlZnJlc2hDYWNoZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoc2VsZi5fcmVmcmVzaGluZ0NhY2hlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3JlZnJlc2hpbmdDYWNoZSA9IHRydWU7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgICAgdmFsdWUuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgdmFyIG9iamVjdEFycmF5ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIFdlIGRvbid0IGNhY2hlIGFycmF5cyBvZiBQYXJzZS5PYmplY3RzXG4gICAgICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKGFyclZhbCkge1xuICAgICAgICAgICAgICBpZiAoYXJyVmFsIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFyclZhbC5fcmVmcmVzaENhY2hlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW9iamVjdEFycmF5ICYmIHNlbGYuX3Jlc2V0Q2FjaGVGb3JLZXkoa2V5KSkge1xuICAgICAgICAgICAgc2VsZi5zZXQoa2V5LCBuZXcgUGFyc2UuT3AuU2V0KHZhbHVlKSwgeyBzaWxlbnQ6IHRydWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSBzZWxmLl9yZWZyZXNoaW5nQ2FjaGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIG9iamVjdCBoYXMgYmVlbiBtb2RpZmllZCBzaW5jZSBpdHMgbGFzdFxuICAgICAqIHNhdmUvcmVmcmVzaC4gIElmIGFuIGF0dHJpYnV0ZSBpcyBzcGVjaWZpZWQsIGl0IHJldHVybnMgdHJ1ZSBvbmx5IGlmIHRoYXRcbiAgICAgKiBwYXJ0aWN1bGFyIGF0dHJpYnV0ZSBoYXMgYmVlbiBtb2RpZmllZCBzaW5jZSB0aGUgbGFzdCBzYXZlL3JlZnJlc2guXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQW4gYXR0cmlidXRlIG5hbWUgKG9wdGlvbmFsKS5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGRpcnR5OiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB0aGlzLl9yZWZyZXNoQ2FjaGUoKTtcblxuICAgICAgdmFyIGN1cnJlbnRDaGFuZ2VzID0gXy5sYXN0KHRoaXMuX29wU2V0UXVldWUpO1xuXG4gICAgICBpZiAoYXR0cikge1xuICAgICAgICByZXR1cm4gKGN1cnJlbnRDaGFuZ2VzW2F0dHJdID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChfLmtleXMoY3VycmVudENoYW5nZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2Yga2V5cyB0aGF0IGhhdmUgYmVlbiBtb2RpZmllZCBzaW5jZSBsYXN0IHNhdmUvcmVmcmVzaFxuICAgICAqIEByZXR1cm4ge0FycmF5IG9mIHN0cmluZ31cbiAgICAgKi9cbiAgICBkaXJ0eUtleXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF8ua2V5cyhfLmxhc3QodGhpcy5fb3BTZXRRdWV1ZSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgUG9pbnRlciByZWZlcmVuY2luZyB0aGlzIE9iamVjdC5cbiAgICAgKi9cbiAgICBfdG9Qb2ludGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBzZXJpYWxpemUgYW4gdW5zYXZlZCBQYXJzZS5PYmplY3RcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBfX3R5cGU6IFwiUG9pbnRlclwiLFxuICAgICAgICAgICAgICAgY2xhc3NOYW1lOiB0aGlzLmNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgIG9iamVjdElkOiB0aGlzLmlkIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBUaGUgc3RyaW5nIG5hbWUgb2YgYW4gYXR0cmlidXRlLlxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHJlbGF0aW9uIG9uIHRoZSBnaXZlbiBjbGFzcyBmb3IgdGhlIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0gU3RyaW5nIGF0dHIgVGhlIGF0dHJpYnV0ZSB0byBnZXQgdGhlIHJlbGF0aW9uIGZvci5cbiAgICAgKi9cbiAgICByZWxhdGlvbjogZnVuY3Rpb24oYXR0cikge1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoYXR0cik7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbikpIHtcbiAgICAgICAgICB0aHJvdyBcIkNhbGxlZCByZWxhdGlvbigpIG9uIG5vbi1yZWxhdGlvbiBmaWVsZCBcIiArIGF0dHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUuX2Vuc3VyZVBhcmVudEFuZEtleSh0aGlzLCBhdHRyKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5SZWxhdGlvbih0aGlzLCBhdHRyKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgSFRNTC1lc2NhcGVkIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBlc2NhcGU6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHZhciBodG1sID0gdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICBpZiAoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICAgIH1cbiAgICAgIHZhciB2YWwgPSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICB2YXIgZXNjYXBlZDtcbiAgICAgIGlmIChQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQodmFsKSkge1xuICAgICAgICBlc2NhcGVkID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlc2NhcGVkID0gXy5lc2NhcGUodmFsLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fZXNjYXBlZEF0dHJpYnV0ZXNbYXR0cl0gPSBlc2NhcGVkO1xuICAgICAgcmV0dXJuIGVzY2FwZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIGF0dHJpYnV0ZSBjb250YWlucyBhIHZhbHVlIHRoYXQgaXMgbm90XG4gICAgICogbnVsbCBvciB1bmRlZmluZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgVGhlIHN0cmluZyBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXM6IGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiAhUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKHRoaXMuYXR0cmlidXRlc1thdHRyXSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFB1bGxzIFwic3BlY2lhbFwiIGZpZWxkcyBsaWtlIG9iamVjdElkLCBjcmVhdGVkQXQsIGV0Yy4gb3V0IG9mIGF0dHJzXG4gICAgICogYW5kIHB1dHMgdGhlbSBvbiBcInRoaXNcIiBkaXJlY3RseS4gIFJlbW92ZXMgdGhlbSBmcm9tIGF0dHJzLlxuICAgICAqIEBwYXJhbSBhdHRycyAtIEEgZGljdGlvbmFyeSB3aXRoIHRoZSBkYXRhIGZvciB0aGlzIFBhcnNlLk9iamVjdC5cbiAgICAgKi9cbiAgICBfbWVyZ2VNYWdpY0ZpZWxkczogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgIC8vIENoZWNrIGZvciBjaGFuZ2VzIG9mIG1hZ2ljIGZpZWxkcy5cbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgICB2YXIgc3BlY2lhbEZpZWxkcyA9IFtcImlkXCIsIFwib2JqZWN0SWRcIiwgXCJjcmVhdGVkQXRcIiwgXCJ1cGRhdGVkQXRcIl07XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHNwZWNpYWxGaWVsZHMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgaWYgKGF0dHJzW2F0dHJdKSB7XG4gICAgICAgICAgaWYgKGF0dHIgPT09IFwib2JqZWN0SWRcIikge1xuICAgICAgICAgICAgbW9kZWwuaWQgPSBhdHRyc1thdHRyXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKChhdHRyID09PSBcImNyZWF0ZWRBdFwiIHx8IGF0dHIgPT09IFwidXBkYXRlZEF0XCIpICYmXG4gICAgICAgICAgICAgICAgICAgICAhXy5pc0RhdGUoYXR0cnNbYXR0cl0pKSB7XG4gICAgICAgICAgICBtb2RlbFthdHRyXSA9IFBhcnNlLl9wYXJzZURhdGUoYXR0cnNbYXR0cl0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb2RlbFthdHRyXSA9IGF0dHJzW2F0dHJdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgYXR0cnNbYXR0cl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgdGhlIGdpdmVuIHNlcnZlckRhdGEgdG8gXCJ0aGlzXCIsIHJlZnJlc2hlcyBhdHRyaWJ1dGVzLCBhbmRcbiAgICAgKiBjbGVhcnMgcGVuZGluZyBjaGFuZ2VzO1xuICAgICAqL1xuICAgIF9jb3B5U2VydmVyRGF0YTogZnVuY3Rpb24oc2VydmVyRGF0YSkge1xuICAgICAgLy8gQ29weSBzZXJ2ZXIgZGF0YVxuICAgICAgdmFyIHRlbXBTZXJ2ZXJEYXRhID0ge307XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChzZXJ2ZXJEYXRhLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHRlbXBTZXJ2ZXJEYXRhW2tleV0gPSBQYXJzZS5fZGVjb2RlKGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zZXJ2ZXJEYXRhID0gdGVtcFNlcnZlckRhdGE7XG5cbiAgICAgIC8vIFJlZnJlc2ggdGhlIGF0dHJpYnV0ZXMuXG4gICAgICB0aGlzLl9yZWJ1aWxkQWxsRXN0aW1hdGVkRGF0YSgpO1xuXG4gICAgICAvLyBUT0RPIChia2xpbXQpOiBSZXZpc2l0IGNsZWFyaW5nIG9wZXJhdGlvbnMsIHBlcmhhcHMgbW92ZSB0byByZXZlcnQuXG4gICAgICAvLyBDbGVhciBvdXQgYW55IGNoYW5nZXMgdGhlIHVzZXIgbWlnaHQgaGF2ZSBtYWRlIHByZXZpb3VzbHkuXG4gICAgICB0aGlzLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgIHRoaXMuX29wU2V0UXVldWUgPSBbe31dO1xuXG4gICAgICAvLyBSZWZyZXNoIHRoZSBhdHRyaWJ1dGVzIGFnYWluLlxuICAgICAgdGhpcy5fcmVidWlsZEFsbEVzdGltYXRlZERhdGEoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWVyZ2VzIGFub3RoZXIgb2JqZWN0J3MgYXR0cmlidXRlcyBpbnRvIHRoaXMgb2JqZWN0LlxuICAgICAqL1xuICAgIF9tZXJnZUZyb21PYmplY3Q6IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICBpZiAoIW90aGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBkb2VzIHRoZSBpbnZlcnNlIG9mIF9tZXJnZU1hZ2ljRmllbGRzLlxuICAgICAgdGhpcy5pZCA9IG90aGVyLmlkO1xuICAgICAgdGhpcy5jcmVhdGVkQXQgPSBvdGhlci5jcmVhdGVkQXQ7XG4gICAgICB0aGlzLnVwZGF0ZWRBdCA9IG90aGVyLnVwZGF0ZWRBdDtcblxuICAgICAgdGhpcy5fY29weVNlcnZlckRhdGEob3RoZXIuX3NlcnZlckRhdGEpO1xuXG4gICAgICB0aGlzLl9oYXNEYXRhID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUganNvbiB0byBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgX3N0YXJ0U2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9vcFNldFF1ZXVlLnB1c2goe30pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIHNhdmUgZmFpbHMgYmVjYXVzZSBvZiBhbiBlcnJvci4gQW55IGNoYW5nZXMgdGhhdCB3ZXJlIHBhcnRcbiAgICAgKiBvZiB0aGUgc2F2ZSBuZWVkIHRvIGJlIG1lcmdlZCB3aXRoIGNoYW5nZXMgbWFkZSBhZnRlciB0aGUgc2F2ZS4gVGhpc1xuICAgICAqIG1pZ2h0IHRocm93IGFuIGV4Y2VwdGlvbiBpcyB5b3UgZG8gY29uZmxpY3Rpbmcgb3BlcmF0aW9ucy4gRm9yIGV4YW1wbGUsXG4gICAgICogaWYgeW91IGRvOlxuICAgICAqICAgb2JqZWN0LnNldChcImZvb1wiLCBcImJhclwiKTtcbiAgICAgKiAgIG9iamVjdC5zZXQoXCJpbnZhbGlkIGZpZWxkIG5hbWVcIiwgXCJiYXpcIik7XG4gICAgICogICBvYmplY3Quc2F2ZSgpO1xuICAgICAqICAgb2JqZWN0LmluY3JlbWVudChcImZvb1wiKTtcbiAgICAgKiB0aGVuIHRoaXMgd2lsbCB0aHJvdyB3aGVuIHRoZSBzYXZlIGZhaWxzIGFuZCB0aGUgY2xpZW50IHRyaWVzIHRvIG1lcmdlXG4gICAgICogXCJiYXJcIiB3aXRoIHRoZSArMS5cbiAgICAgKi9cbiAgICBfY2FuY2VsU2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgZmFpbGVkQ2hhbmdlcyA9IF8uZmlyc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG4gICAgICB0aGlzLl9vcFNldFF1ZXVlID0gXy5yZXN0KHRoaXMuX29wU2V0UXVldWUpO1xuICAgICAgdmFyIG5leHRDaGFuZ2VzID0gXy5maXJzdCh0aGlzLl9vcFNldFF1ZXVlKTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGZhaWxlZENoYW5nZXMsIGZ1bmN0aW9uKG9wLCBrZXkpIHtcbiAgICAgICAgdmFyIG9wMSA9IGZhaWxlZENoYW5nZXNba2V5XTtcbiAgICAgICAgdmFyIG9wMiA9IG5leHRDaGFuZ2VzW2tleV07XG4gICAgICAgIGlmIChvcDEgJiYgb3AyKSB7XG4gICAgICAgICAgbmV4dENoYW5nZXNba2V5XSA9IG9wMi5fbWVyZ2VXaXRoUHJldmlvdXMob3AxKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcDEpIHtcbiAgICAgICAgICBuZXh0Q2hhbmdlc1trZXldID0gb3AxO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NhdmluZyA9IHRoaXMuX3NhdmluZyAtIDE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgc2F2ZSBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LiBUaGlzIG1lcmdlcyB0aGUgY2hhbmdlcyB0aGF0XG4gICAgICogd2VyZSBzYXZlZCBpbnRvIHRoZSBrbm93biBzZXJ2ZXIgZGF0YSwgYW5kIG92ZXJyaWRlcyBpdCB3aXRoIGFueSBkYXRhXG4gICAgICogc2VudCBkaXJlY3RseSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgX2ZpbmlzaFNhdmU6IGZ1bmN0aW9uKHNlcnZlckRhdGEpIHtcbiAgICAgIC8vIEdyYWIgYSBjb3B5IG9mIGFueSBvYmplY3QgcmVmZXJlbmNlZCBieSB0aGlzIG9iamVjdC4gVGhlc2UgaW5zdGFuY2VzXG4gICAgICAvLyBtYXkgaGF2ZSBhbHJlYWR5IGJlZW4gZmV0Y2hlZCwgYW5kIHdlIGRvbid0IHdhbnQgdG8gbG9zZSB0aGVpciBkYXRhLlxuICAgICAgLy8gTm90ZSB0aGF0IGRvaW5nIGl0IGxpa2UgdGhpcyBtZWFucyB3ZSB3aWxsIHVuaWZ5IHNlcGFyYXRlIGNvcGllcyBvZiB0aGVcbiAgICAgIC8vIHNhbWUgb2JqZWN0LCBidXQgdGhhdCdzIGEgcmlzayB3ZSBoYXZlIHRvIHRha2UuXG4gICAgICB2YXIgZmV0Y2hlZE9iamVjdHMgPSB7fTtcbiAgICAgIFBhcnNlLl90cmF2ZXJzZSh0aGlzLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0ICYmIG9iamVjdC5pZCAmJiBvYmplY3QuX2hhc0RhdGEpIHtcbiAgICAgICAgICBmZXRjaGVkT2JqZWN0c1tvYmplY3QuaWRdID0gb2JqZWN0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIHNhdmVkQ2hhbmdlcyA9IF8uZmlyc3QodGhpcy5fb3BTZXRRdWV1ZSk7XG4gICAgICB0aGlzLl9vcFNldFF1ZXVlID0gXy5yZXN0KHRoaXMuX29wU2V0UXVldWUpO1xuICAgICAgdGhpcy5fYXBwbHlPcFNldChzYXZlZENoYW5nZXMsIHRoaXMuX3NlcnZlckRhdGEpO1xuICAgICAgdGhpcy5fbWVyZ2VNYWdpY0ZpZWxkcyhzZXJ2ZXJEYXRhKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHNlcnZlckRhdGEsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc2VsZi5fc2VydmVyRGF0YVtrZXldID0gUGFyc2UuX2RlY29kZShrZXksIHZhbHVlKTtcblxuICAgICAgICAvLyBMb29rIGZvciBhbnkgb2JqZWN0cyB0aGF0IG1pZ2h0IGhhdmUgYmVjb21lIHVuZmV0Y2hlZCBhbmQgZml4IHRoZW1cbiAgICAgICAgLy8gYnkgcmVwbGFjaW5nIHRoZWlyIHZhbHVlcyB3aXRoIHRoZSBwcmV2aW91c2x5IG9ic2VydmVkIHZhbHVlcy5cbiAgICAgICAgdmFyIGZldGNoZWQgPSBQYXJzZS5fdHJhdmVyc2Uoc2VsZi5fc2VydmVyRGF0YVtrZXldLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0ICYmIGZldGNoZWRPYmplY3RzW29iamVjdC5pZF0pIHtcbiAgICAgICAgICAgIHJldHVybiBmZXRjaGVkT2JqZWN0c1tvYmplY3QuaWRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChmZXRjaGVkKSB7XG4gICAgICAgICAgc2VsZi5fc2VydmVyRGF0YVtrZXldID0gZmV0Y2hlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZWJ1aWxkQWxsRXN0aW1hdGVkRGF0YSgpO1xuICAgICAgdGhpcy5fc2F2aW5nID0gdGhpcy5fc2F2aW5nIC0gMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBmZXRjaCBvciBsb2dpbiBpcyBjb21wbGV0ZSB0byBzZXQgdGhlIGtub3duIHNlcnZlciBkYXRhIHRvXG4gICAgICogdGhlIGdpdmVuIG9iamVjdC5cbiAgICAgKi9cbiAgICBfZmluaXNoRmV0Y2g6IGZ1bmN0aW9uKHNlcnZlckRhdGEsIGhhc0RhdGEpIHtcbiAgICAgIC8vIFRPRE8gKGJrbGltdCk6IFJldmlzaXQgY2xlYXJpbmcgb3BlcmF0aW9ucywgcGVyaGFwcyBtb3ZlIHRvIHJldmVydC5cbiAgICAgIHRoaXMuX29wU2V0UXVldWUgPSBbe31dO1xuXG4gICAgICAvLyBCcmluZyBpbiBhbGwgdGhlIG5ldyBzZXJ2ZXIgZGF0YS5cbiAgICAgIHRoaXMuX21lcmdlTWFnaWNGaWVsZHMoc2VydmVyRGF0YSk7XG4gICAgICB0aGlzLl9jb3B5U2VydmVyRGF0YShzZXJ2ZXJEYXRhKTtcblxuICAgICAgdGhpcy5faGFzRGF0YSA9IGhhc0RhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgdGhlIHNldCBvZiBQYXJzZS5PcCBpbiBvcFNldCB0byB0aGUgb2JqZWN0IHRhcmdldC5cbiAgICAgKi9cbiAgICBfYXBwbHlPcFNldDogZnVuY3Rpb24ob3BTZXQsIHRhcmdldCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2gob3BTZXQsIGZ1bmN0aW9uKGNoYW5nZSwga2V5KSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gY2hhbmdlLl9lc3RpbWF0ZSh0YXJnZXRba2V5XSwgc2VsZiwga2V5KTtcbiAgICAgICAgaWYgKHRhcmdldFtrZXldID09PSBQYXJzZS5PcC5fVU5TRVQpIHtcbiAgICAgICAgICBkZWxldGUgdGFyZ2V0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlcyB0aGUgY2FjaGVkIHZhbHVlIGZvciBrZXkgd2l0aCB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG5ldyB2YWx1ZSBpcyBkaWZmZXJlbnQgdGhhbiB0aGUgb2xkIHZhbHVlLlxuICAgICAqL1xuICAgIF9yZXNldENhY2hlRm9yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuYXR0cmlidXRlc1trZXldO1xuICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpICYmXG4gICAgICAgICAgISh2YWx1ZSBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkgJiZcbiAgICAgICAgICAhKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuRmlsZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04gPyB2YWx1ZS50b0pTT04oKSA6IHZhbHVlO1xuICAgICAgICB2YXIganNvbiA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuX2hhc2hlZEpTT05ba2V5XSAhPT0ganNvbikge1xuICAgICAgICAgIHZhciB3YXNTZXQgPSAhIXRoaXMuX2hhc2hlZEpTT05ba2V5XTtcbiAgICAgICAgICB0aGlzLl9oYXNoZWRKU09OW2tleV0gPSBqc29uO1xuICAgICAgICAgIHJldHVybiB3YXNTZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUG9wdWxhdGVzIGF0dHJpYnV0ZXNba2V5XSBieSBzdGFydGluZyB3aXRoIHRoZSBsYXN0IGtub3duIGRhdGEgZnJvbSB0aGVcbiAgICAgKiBzZXJ2ZXIsIGFuZCBhcHBseWluZyBhbGwgb2YgdGhlIGxvY2FsIGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gbWFkZSB0byB0aGF0XG4gICAgICoga2V5IHNpbmNlIHRoZW4uXG4gICAgICovXG4gICAgX3JlYnVpbGRFc3RpbWF0ZWREYXRhRm9yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcbiAgICAgIGlmICh0aGlzLl9zZXJ2ZXJEYXRhW2tleV0pIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW2tleV0gPSB0aGlzLl9zZXJ2ZXJEYXRhW2tleV07XG4gICAgICB9XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMuX29wU2V0UXVldWUsIGZ1bmN0aW9uKG9wU2V0KSB7XG4gICAgICAgIHZhciBvcCA9IG9wU2V0W2tleV07XG4gICAgICAgIGlmIChvcCkge1xuICAgICAgICAgIHNlbGYuYXR0cmlidXRlc1trZXldID0gb3AuX2VzdGltYXRlKHNlbGYuYXR0cmlidXRlc1trZXldLCBzZWxmLCBrZXkpO1xuICAgICAgICAgIGlmIChzZWxmLmF0dHJpYnV0ZXNba2V5XSA9PT0gUGFyc2UuT3AuX1VOU0VUKSB7XG4gICAgICAgICAgICBkZWxldGUgc2VsZi5hdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX3Jlc2V0Q2FjaGVGb3JLZXkoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQb3B1bGF0ZXMgYXR0cmlidXRlcyBieSBzdGFydGluZyB3aXRoIHRoZSBsYXN0IGtub3duIGRhdGEgZnJvbSB0aGVcbiAgICAgKiBzZXJ2ZXIsIGFuZCBhcHBseWluZyBhbGwgb2YgdGhlIGxvY2FsIGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gbWFkZSBzaW5jZVxuICAgICAqIHRoZW4uXG4gICAgICovXG4gICAgX3JlYnVpbGRBbGxFc3RpbWF0ZWREYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdmFyIHByZXZpb3VzQXR0cmlidXRlcyA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gXy5jbG9uZSh0aGlzLl9zZXJ2ZXJEYXRhKTtcbiAgICAgIFBhcnNlLl9hcnJheUVhY2godGhpcy5fb3BTZXRRdWV1ZSwgZnVuY3Rpb24ob3BTZXQpIHtcbiAgICAgICAgc2VsZi5fYXBwbHlPcFNldChvcFNldCwgc2VsZi5hdHRyaWJ1dGVzKTtcbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2gob3BTZXQsIGZ1bmN0aW9uKG9wLCBrZXkpIHtcbiAgICAgICAgICBzZWxmLl9yZXNldENhY2hlRm9yS2V5KGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRyaWdnZXIgY2hhbmdlIGV2ZW50cyBmb3IgYW55dGhpbmcgdGhhdCBjaGFuZ2VkIGJlY2F1c2Ugb2YgdGhlIGZldGNoLlxuICAgICAgUGFyc2UuX29iamVjdEVhY2gocHJldmlvdXNBdHRyaWJ1dGVzLCBmdW5jdGlvbihvbGRWYWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChzZWxmLmF0dHJpYnV0ZXNba2V5XSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTonICsga2V5LCBzZWxmLCBzZWxmLmF0dHJpYnV0ZXNba2V5XSwge30pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24obmV3VmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIV8uaGFzKHByZXZpb3VzQXR0cmlidXRlcywga2V5KSkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcignY2hhbmdlOicgKyBrZXksIHNlbGYsIG5ld1ZhbHVlLCB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgaGFzaCBvZiBtb2RlbCBhdHRyaWJ1dGVzIG9uIHRoZSBvYmplY3QsIGZpcmluZ1xuICAgICAqIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IHVubGVzcyB5b3UgY2hvb3NlIHRvIHNpbGVuY2UgaXQuXG4gICAgICpcbiAgICAgKiA8cD5Zb3UgY2FuIGNhbGwgaXQgd2l0aCBhbiBvYmplY3QgY29udGFpbmluZyBrZXlzIGFuZCB2YWx1ZXMsIG9yIHdpdGggb25lXG4gICAgICoga2V5IGFuZCB2YWx1ZS4gIEZvciBleGFtcGxlOjxwcmU+XG4gICAgICogICBnYW1lVHVybi5zZXQoe1xuICAgICAqICAgICBwbGF5ZXI6IHBsYXllcjEsXG4gICAgICogICAgIGRpY2VSb2xsOiAyXG4gICAgICogICB9LCB7XG4gICAgICogICAgIGVycm9yOiBmdW5jdGlvbihnYW1lVHVybkFnYWluLCBlcnJvcikge1xuICAgICAqICAgICAgIC8vIFRoZSBzZXQgZmFpbGVkIHZhbGlkYXRpb24uXG4gICAgICogICAgIH1cbiAgICAgKiAgIH0pO1xuICAgICAqXG4gICAgICogICBnYW1lLnNldChcImN1cnJlbnRQbGF5ZXJcIiwgcGxheWVyMiwge1xuICAgICAqICAgICBlcnJvcjogZnVuY3Rpb24oZ2FtZVR1cm5BZ2FpbiwgZXJyb3IpIHtcbiAgICAgKiAgICAgICAvLyBUaGUgc2V0IGZhaWxlZCB2YWxpZGF0aW9uLlxuICAgICAqICAgICB9XG4gICAgICogICB9KTtcbiAgICAgKlxuICAgICAqICAgZ2FtZS5zZXQoXCJmaW5pc2hlZFwiLCB0cnVlKTs8L3ByZT48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB7fSB2YWx1ZSBUaGUgdmFsdWUgdG8gZ2l2ZSBpdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIHNldCBvZiBCYWNrYm9uZS1saWtlIG9wdGlvbnMgZm9yIHRoZSBzZXQuXG4gICAgICogICAgIFRoZSBvbmx5IHN1cHBvcnRlZCBvcHRpb25zIGFyZSA8Y29kZT5zaWxlbnQ8L2NvZGU+LFxuICAgICAqICAgICA8Y29kZT5lcnJvcjwvY29kZT4sIGFuZCA8Y29kZT5wcm9taXNlPC9jb2RlPi5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBzZXQgc3VjY2VlZGVkLlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I3ZhbGlkYXRlXG4gICAgICogQHNlZSBQYXJzZS5FcnJvclxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHJzLCBhdHRyO1xuICAgICAgaWYgKF8uaXNPYmplY3Qoa2V5KSB8fCBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQoa2V5KSkge1xuICAgICAgICBhdHRycyA9IGtleTtcbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYXR0cnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgICBhdHRyc1trXSA9IFBhcnNlLl9kZWNvZGUoaywgdik7XG4gICAgICAgIH0pO1xuICAgICAgICBvcHRpb25zID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRycyA9IHt9O1xuICAgICAgICBhdHRyc1trZXldID0gUGFyc2UuX2RlY29kZShrZXksIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gRXh0cmFjdCBhdHRyaWJ1dGVzIGFuZCBvcHRpb25zLlxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAoIWF0dHJzKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKGF0dHJzIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSB7XG4gICAgICAgIGF0dHJzID0gYXR0cnMuYXR0cmlidXRlcztcbiAgICAgIH1cblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goYXR0cnMsIGZ1bmN0aW9uKHVudXNlZF92YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChzZWxmLmNvbnN0cnVjdG9yLnJlYWRPbmx5QXR0cmlidXRlcyAmJlxuICAgICAgICAgIHNlbGYuY29uc3RydWN0b3IucmVhZE9ubHlBdHRyaWJ1dGVzW2tleV0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBtb2RpZnkgcmVhZG9ubHkga2V5OiAnICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIElmIHRoZSB1bnNldCBvcHRpb24gaXMgdXNlZCwgZXZlcnkgYXR0cmlidXRlIHNob3VsZCBiZSBhIFVuc2V0LlxuICAgICAgaWYgKG9wdGlvbnMudW5zZXQpIHtcbiAgICAgICAgUGFyc2UuX29iamVjdEVhY2goYXR0cnMsIGZ1bmN0aW9uKHVudXNlZF92YWx1ZSwga2V5KSB7XG4gICAgICAgICAgYXR0cnNba2V5XSA9IG5ldyBQYXJzZS5PcC5VbnNldCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgYWxsIHRoZSBhdHRyaWJ1dGVzIHRvIGdldCB0aGUgZXN0aW1hdGVkIHZhbHVlcy5cbiAgICAgIHZhciBkYXRhVG9WYWxpZGF0ZSA9IF8uY2xvbmUoYXR0cnMpO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2goZGF0YVRvVmFsaWRhdGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGFyc2UuT3ApIHtcbiAgICAgICAgICBkYXRhVG9WYWxpZGF0ZVtrZXldID0gdmFsdWUuX2VzdGltYXRlKHNlbGYuYXR0cmlidXRlc1trZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZiwga2V5KTtcbiAgICAgICAgICBpZiAoZGF0YVRvVmFsaWRhdGVba2V5XSA9PT0gUGFyc2UuT3AuX1VOU0VUKSB7XG4gICAgICAgICAgICBkZWxldGUgZGF0YVRvVmFsaWRhdGVba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBSdW4gdmFsaWRhdGlvbi5cbiAgICAgIGlmICghdGhpcy5fdmFsaWRhdGUoYXR0cnMsIG9wdGlvbnMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbWVyZ2VNYWdpY0ZpZWxkcyhhdHRycyk7XG5cbiAgICAgIG9wdGlvbnMuY2hhbmdlcyA9IHt9O1xuICAgICAgdmFyIGVzY2FwZWQgPSB0aGlzLl9lc2NhcGVkQXR0cmlidXRlcztcbiAgICAgIHZhciBwcmV2ID0gdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzIHx8IHt9O1xuXG4gICAgICAvLyBVcGRhdGUgYXR0cmlidXRlcy5cbiAgICAgIFBhcnNlLl9hcnJheUVhY2goXy5rZXlzKGF0dHJzKSwgZnVuY3Rpb24oYXR0cikge1xuICAgICAgICB2YXIgdmFsID0gYXR0cnNbYXR0cl07XG5cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlbGF0aW9uIG9iamVjdCB3ZSBuZWVkIHRvIHNldCB0aGUgcGFyZW50IGNvcnJlY3RseSxcbiAgICAgICAgLy8gc2luY2UgdGhlIGxvY2F0aW9uIHdoZXJlIGl0IHdhcyBwYXJzZWQgZG9lcyBub3QgaGF2ZSBhY2Nlc3MgdG9cbiAgICAgICAgLy8gdGhpcyBvYmplY3QuXG4gICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBQYXJzZS5SZWxhdGlvbikge1xuICAgICAgICAgIHZhbC5wYXJlbnQgPSBzZWxmO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodmFsIGluc3RhbmNlb2YgUGFyc2UuT3ApKSB7XG4gICAgICAgICAgdmFsID0gbmV3IFBhcnNlLk9wLlNldCh2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VlIGlmIHRoaXMgY2hhbmdlIHdpbGwgYWN0dWFsbHkgaGF2ZSBhbnkgZWZmZWN0LlxuICAgICAgICB2YXIgaXNSZWFsQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIFBhcnNlLk9wLlNldCAmJlxuICAgICAgICAgICAgXy5pc0VxdWFsKHNlbGYuYXR0cmlidXRlc1thdHRyXSwgdmFsLnZhbHVlKSkge1xuICAgICAgICAgIGlzUmVhbENoYW5nZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUmVhbENoYW5nZSkge1xuICAgICAgICAgIGRlbGV0ZSBlc2NhcGVkW2F0dHJdO1xuICAgICAgICAgIGlmIChvcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgc2VsZi5fc2lsZW50W2F0dHJdID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0aW9ucy5jaGFuZ2VzW2F0dHJdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3VycmVudENoYW5nZXMgPSBfLmxhc3Qoc2VsZi5fb3BTZXRRdWV1ZSk7XG4gICAgICAgIGN1cnJlbnRDaGFuZ2VzW2F0dHJdID0gdmFsLl9tZXJnZVdpdGhQcmV2aW91cyhjdXJyZW50Q2hhbmdlc1thdHRyXSk7XG4gICAgICAgIHNlbGYuX3JlYnVpbGRFc3RpbWF0ZWREYXRhRm9yS2V5KGF0dHIpO1xuXG4gICAgICAgIGlmIChpc1JlYWxDaGFuZ2UpIHtcbiAgICAgICAgICBzZWxmLmNoYW5nZWRbYXR0cl0gPSBzZWxmLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgc2VsZi5fcGVuZGluZ1thdHRyXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLmNoYW5nZWRbYXR0cl07XG4gICAgICAgICAgZGVsZXRlIHNlbGYuX3BlbmRpbmdbYXR0cl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBhdHRyaWJ1dGUgZnJvbSB0aGUgbW9kZWwsIGZpcmluZyA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiB1bmxlc3NcbiAgICAgKiB5b3UgY2hvb3NlIHRvIHNpbGVuY2UgaXQuIFRoaXMgaXMgYSBub29wIGlmIHRoZSBhdHRyaWJ1dGUgZG9lc24ndFxuICAgICAqIGV4aXN0LlxuICAgICAqL1xuICAgIHVuc2V0OiBmdW5jdGlvbihhdHRyLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIG9wdGlvbnMudW5zZXQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHIsIG51bGwsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdG9taWNhbGx5IGluY3JlbWVudHMgdGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBhdHRyaWJ1dGUgdGhlIG5leHQgdGltZSB0aGVcbiAgICAgKiBvYmplY3QgaXMgc2F2ZWQuIElmIG5vIGFtb3VudCBpcyBzcGVjaWZpZWQsIDEgaXMgdXNlZCBieSBkZWZhdWx0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGF0dHIge1N0cmluZ30gVGhlIGtleS5cbiAgICAgKiBAcGFyYW0gYW1vdW50IHtOdW1iZXJ9IFRoZSBhbW91bnQgdG8gaW5jcmVtZW50IGJ5LlxuICAgICAqL1xuICAgIGluY3JlbWVudDogZnVuY3Rpb24oYXR0ciwgYW1vdW50KSB7XG4gICAgICBpZiAoXy5pc1VuZGVmaW5lZChhbW91bnQpIHx8IF8uaXNOdWxsKGFtb3VudCkpIHtcbiAgICAgICAgYW1vdW50ID0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNldChhdHRyLCBuZXcgUGFyc2UuT3AuSW5jcmVtZW50KGFtb3VudCkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdG9taWNhbGx5IGFkZCBhbiBvYmplY3QgdG8gdGhlIGVuZCBvZiB0aGUgYXJyYXkgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW5cbiAgICAgKiBrZXkuXG4gICAgICogQHBhcmFtIGF0dHIge1N0cmluZ30gVGhlIGtleS5cbiAgICAgKiBAcGFyYW0gaXRlbSB7fSBUaGUgaXRlbSB0byBhZGQuXG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihhdHRyLCBpdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXR0ciwgbmV3IFBhcnNlLk9wLkFkZChbaXRlbV0pKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXRvbWljYWxseSBhZGQgYW4gb2JqZWN0IHRvIHRoZSBhcnJheSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBrZXksIG9ubHlcbiAgICAgKiBpZiBpdCBpcyBub3QgYWxyZWFkeSBwcmVzZW50IGluIHRoZSBhcnJheS4gVGhlIHBvc2l0aW9uIG9mIHRoZSBpbnNlcnQgaXNcbiAgICAgKiBub3QgZ3VhcmFudGVlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhdHRyIHtTdHJpbmd9IFRoZSBrZXkuXG4gICAgICogQHBhcmFtIGl0ZW0ge30gVGhlIG9iamVjdCB0byBhZGQuXG4gICAgICovXG4gICAgYWRkVW5pcXVlOiBmdW5jdGlvbihhdHRyLCBpdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXR0ciwgbmV3IFBhcnNlLk9wLkFkZFVuaXF1ZShbaXRlbV0pKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXRvbWljYWxseSByZW1vdmUgYWxsIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgZnJvbSB0aGUgYXJyYXkgYXNzb2NpYXRlZFxuICAgICAqIHdpdGggYSBnaXZlbiBrZXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXR0ciB7U3RyaW5nfSBUaGUga2V5LlxuICAgICAqIEBwYXJhbSBpdGVtIHt9IFRoZSBvYmplY3QgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oYXR0ciwgaXRlbSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KGF0dHIsIG5ldyBQYXJzZS5PcC5SZW1vdmUoW2l0ZW1dKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PcCBkZXNjcmliaW5nIHdoYXQga2luZCBvZlxuICAgICAqIG1vZGlmaWNhdGlvbiBoYXMgYmVlbiBwZXJmb3JtZWQgb24gdGhpcyBmaWVsZCBzaW5jZSB0aGUgbGFzdCB0aW1lIGl0IHdhc1xuICAgICAqIHNhdmVkLiBGb3IgZXhhbXBsZSwgYWZ0ZXIgY2FsbGluZyBvYmplY3QuaW5jcmVtZW50KFwieFwiKSwgY2FsbGluZ1xuICAgICAqIG9iamVjdC5vcChcInhcIikgd291bGQgcmV0dXJuIGFuIGluc3RhbmNlIG9mIFBhcnNlLk9wLkluY3JlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhdHRyIHtTdHJpbmd9IFRoZSBrZXkuXG4gICAgICogQHJldHVybnMge1BhcnNlLk9wfSBUaGUgb3BlcmF0aW9uLCBvciB1bmRlZmluZWQgaWYgbm9uZS5cbiAgICAgKi9cbiAgICBvcDogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIF8ubGFzdCh0aGlzLl9vcFNldFF1ZXVlKVthdHRyXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgYWxsIGF0dHJpYnV0ZXMgb24gdGhlIG1vZGVsLCBmaXJpbmcgPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gdW5sZXNzXG4gICAgICogeW91IGNob29zZSB0byBzaWxlbmNlIGl0LlxuICAgICAqL1xuICAgIGNsZWFyOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIG9wdGlvbnMudW5zZXQgPSB0cnVlO1xuICAgICAgdmFyIGtleXNUb0NsZWFyID0gXy5leHRlbmQodGhpcy5hdHRyaWJ1dGVzLCB0aGlzLl9vcGVyYXRpb25zKTtcbiAgICAgIHJldHVybiB0aGlzLnNldChrZXlzVG9DbGVhciwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBKU09OLWVuY29kZWQgc2V0IG9mIG9wZXJhdGlvbnMgdG8gYmUgc2VudCB3aXRoIHRoZSBuZXh0IHNhdmVcbiAgICAgKiByZXF1ZXN0LlxuICAgICAqL1xuICAgIF9nZXRTYXZlSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIganNvbiA9IF8uY2xvbmUoXy5maXJzdCh0aGlzLl9vcFNldFF1ZXVlKSk7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChqc29uLCBmdW5jdGlvbihvcCwga2V5KSB7XG4gICAgICAgIGpzb25ba2V5XSA9IG9wLnRvSlNPTigpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb2JqZWN0IGNhbiBiZSBzZXJpYWxpemVkIGZvciBzYXZpbmcuXG4gICAgICovXG4gICAgX2NhbkJlU2VyaWFsaXplZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZldGNoIHRoZSBtb2RlbCBmcm9tIHRoZSBzZXJ2ZXIuIElmIHRoZSBzZXJ2ZXIncyByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgICAgKiBtb2RlbCBkaWZmZXJzIGZyb20gaXRzIGN1cnJlbnQgYXR0cmlidXRlcywgdGhleSB3aWxsIGJlIG92ZXJyaWRlbixcbiAgICAgKiB0cmlnZ2VyaW5nIGEgPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT4gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIGNhbGxiYWNrIG9iamVjdC5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiAgIDxsaT5zZXNzaW9uVG9rZW46IEEgdmFsaWQgc2Vzc2lvbiB0b2tlbiwgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdCBvblxuICAgICAqICAgICAgIGJlaGFsZiBvZiBhIHNwZWNpZmljIHVzZXIuXG4gICAgICogPC91bD5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgZmV0Y2hcbiAgICAgKiAgICAgY29tcGxldGVzLlxuICAgICAqL1xuICAgIGZldGNoOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc05hbWUsXG4gICAgICAgIG9iamVjdElkOiB0aGlzLmlkLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBzZXNzaW9uVG9rZW46IG9wdGlvbnMuc2Vzc2lvblRva2VuXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgIHNlbGYuX2ZpbmlzaEZldGNoKHNlbGYucGFyc2UocmVzcG9uc2UsIHN0YXR1cywgeGhyKSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBhIGhhc2ggb2YgbW9kZWwgYXR0cmlidXRlcywgYW5kIHNhdmUgdGhlIG1vZGVsIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogdXBkYXRlZEF0IHdpbGwgYmUgdXBkYXRlZCB3aGVuIHRoZSByZXF1ZXN0IHJldHVybnMuXG4gICAgICogWW91IGNhbiBlaXRoZXIgY2FsbCBpdCBhczo8cHJlPlxuICAgICAqICAgb2JqZWN0LnNhdmUoKTs8L3ByZT5cbiAgICAgKiBvcjxwcmU+XG4gICAgICogICBvYmplY3Quc2F2ZShudWxsLCBvcHRpb25zKTs8L3ByZT5cbiAgICAgKiBvcjxwcmU+XG4gICAgICogICBvYmplY3Quc2F2ZShhdHRycywgb3B0aW9ucyk7PC9wcmU+XG4gICAgICogb3I8cHJlPlxuICAgICAqICAgb2JqZWN0LnNhdmUoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7PC9wcmU+XG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZSwgPHByZT5cbiAgICAgKiAgIGdhbWVUdXJuLnNhdmUoe1xuICAgICAqICAgICBwbGF5ZXI6IFwiSmFrZSBDdXR0ZXJcIixcbiAgICAgKiAgICAgZGljZVJvbGw6IDJcbiAgICAgKiAgIH0sIHtcbiAgICAgKiAgICAgc3VjY2VzczogZnVuY3Rpb24oZ2FtZVR1cm5BZ2Fpbikge1xuICAgICAqICAgICAgIC8vIFRoZSBzYXZlIHdhcyBzdWNjZXNzZnVsLlxuICAgICAqICAgICB9LFxuICAgICAqICAgICBlcnJvcjogZnVuY3Rpb24oZ2FtZVR1cm5BZ2FpbiwgZXJyb3IpIHtcbiAgICAgKiAgICAgICAvLyBUaGUgc2F2ZSBmYWlsZWQuICBFcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvci5cbiAgICAgKiAgICAgfVxuICAgICAqICAgfSk7PC9wcmU+XG4gICAgICogb3Igd2l0aCBwcm9taXNlczo8cHJlPlxuICAgICAqICAgZ2FtZVR1cm4uc2F2ZSh7XG4gICAgICogICAgIHBsYXllcjogXCJKYWtlIEN1dHRlclwiLFxuICAgICAqICAgICBkaWNlUm9sbDogMlxuICAgICAqICAgfSkudGhlbihmdW5jdGlvbihnYW1lVHVybkFnYWluKSB7XG4gICAgICogICAgIC8vIFRoZSBzYXZlIHdhcyBzdWNjZXNzZnVsLlxuICAgICAqICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgKiAgICAgLy8gVGhlIHNhdmUgZmFpbGVkLiAgRXJyb3IgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IuXG4gICAgICogICB9KTs8L3ByZT5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgY2FsbGJhY2sgb2JqZWN0LlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT53YWl0OiBTZXQgdG8gdHJ1ZSB0byB3YWl0IGZvciB0aGUgc2VydmVyIHRvIGNvbmZpcm0gYSBzdWNjZXNzZnVsXG4gICAgICogICBzYXZlIGJlZm9yZSBtb2RpZnlpbmcgdGhlIGF0dHJpYnV0ZXMgb24gdGhlIG9iamVjdC5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyB0aGUgYHNldGAgZXZlbnQuXG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiAgIDxsaT5zZXNzaW9uVG9rZW46IEEgdmFsaWQgc2Vzc2lvbiB0b2tlbiwgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdCBvblxuICAgICAqICAgICAgIGJlaGFsZiBvZiBhIHNwZWNpZmljIHVzZXIuXG4gICAgICogPC91bD5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgc2F2ZVxuICAgICAqICAgICBjb21wbGV0ZXMuXG4gICAgICogQHNlZSBQYXJzZS5FcnJvclxuICAgICAqL1xuICAgIHNhdmU6IGZ1bmN0aW9uKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgIHZhciBpLCBhdHRycywgY3VycmVudCwgb3B0aW9ucywgc2F2ZWQ7XG4gICAgICBpZiAoXy5pc09iamVjdChhcmcxKSB8fCBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQoYXJnMSkpIHtcbiAgICAgICAgYXR0cnMgPSBhcmcxO1xuICAgICAgICBvcHRpb25zID0gYXJnMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0ge307XG4gICAgICAgIGF0dHJzW2FyZzFdID0gYXJnMjtcbiAgICAgICAgb3B0aW9ucyA9IGFyZzM7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2Ugc2F2ZSh7IHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge30gfSkgd29yay5cbiAgICAgIGlmICghb3B0aW9ucyAmJiBhdHRycykge1xuICAgICAgICB2YXIgZXh0cmFfa2V5cyA9IF8ucmVqZWN0KGF0dHJzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShbXCJzdWNjZXNzXCIsIFwiZXJyb3JcIiwgXCJ3YWl0XCJdLCBrZXkpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGV4dHJhX2tleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdmFyIGFsbF9mdW5jdGlvbnMgPSB0cnVlO1xuICAgICAgICAgIGlmIChfLmhhcyhhdHRycywgXCJzdWNjZXNzXCIpICYmICFfLmlzRnVuY3Rpb24oYXR0cnMuc3VjY2VzcykpIHtcbiAgICAgICAgICAgIGFsbF9mdW5jdGlvbnMgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaGFzKGF0dHJzLCBcImVycm9yXCIpICYmICFfLmlzRnVuY3Rpb24oYXR0cnMuZXJyb3IpKSB7XG4gICAgICAgICAgICBhbGxfZnVuY3Rpb25zID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhbGxfZnVuY3Rpb25zKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGF0dHJzIG9iamVjdCBsb29rcyBsaWtlIGl0J3MgcmVhbGx5IGFuIG9wdGlvbnMgb2JqZWN0LFxuICAgICAgICAgICAgLy8gYW5kIHRoZXJlJ3Mgbm8gb3RoZXIgb3B0aW9ucyBvYmplY3QsIHNvIGxldCdzIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZShudWxsLCBhdHRycyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgaWYgKG9wdGlvbnMud2FpdCkge1xuICAgICAgICBjdXJyZW50ID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICBpZiAoc2V0T3B0aW9ucy53YWl0KSB7XG4gICAgICAgIHNldE9wdGlvbnMuc2lsZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBzZXRFcnJvcjtcbiAgICAgIHNldE9wdGlvbnMuZXJyb3IgPSBmdW5jdGlvbihtb2RlbCwgZXJyb3IpIHtcbiAgICAgICAgc2V0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH07XG4gICAgICBpZiAoYXR0cnMgJiYgIXRoaXMuc2V0KGF0dHJzLCBzZXRPcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihzZXRFcnJvcikuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGFueSB1bnNhdmVkIGNoaWxkLCBzYXZlIGl0IGZpcnN0LlxuICAgICAgbW9kZWwuX3JlZnJlc2hDYWNoZSgpO1xuXG4gICAgICAvLyBUT0RPKGtsaW10KTogUmVmYWN0b3IgdGhpcyBzbyB0aGF0IHRoZSBzYXZlIHN0YXJ0cyBub3csIG5vdCBsYXRlci5cblxuICAgICAgdmFyIHVuc2F2ZWRDaGlsZHJlbiA9IFtdO1xuICAgICAgdmFyIHVuc2F2ZWRGaWxlcyA9IFtdO1xuICAgICAgUGFyc2UuT2JqZWN0Ll9maW5kVW5zYXZlZENoaWxkcmVuKG1vZGVsLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5zYXZlZENoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuc2F2ZWRGaWxlcyk7XG4gICAgICBpZiAodW5zYXZlZENoaWxkcmVuLmxlbmd0aCArIHVuc2F2ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuX2RlZXBTYXZlQXN5bmModGhpcy5hdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgICBzZXNzaW9uVG9rZW46IG9wdGlvbnMuc2Vzc2lvblRva2VuXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIG1vZGVsLnNhdmUobnVsbCwgb3B0aW9ucyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N0YXJ0U2F2ZSgpO1xuICAgICAgdGhpcy5fc2F2aW5nID0gKHRoaXMuX3NhdmluZyB8fCAwKSArIDE7XG5cbiAgICAgIHRoaXMuX2FsbFByZXZpb3VzU2F2ZXMgPSB0aGlzLl9hbGxQcmV2aW91c1NhdmVzIHx8IFBhcnNlLlByb21pc2UuYXMoKTtcbiAgICAgIHRoaXMuX2FsbFByZXZpb3VzU2F2ZXMgPSB0aGlzLl9hbGxQcmV2aW91c1NhdmVzLl9jb250aW51ZVdpdGgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBtb2RlbC5pZCA/ICdQVVQnIDogJ1BPU1QnO1xuXG4gICAgICAgIHZhciBqc29uID0gbW9kZWwuX2dldFNhdmVKU09OKCk7XG5cbiAgICAgICAgdmFyIHJvdXRlID0gXCJjbGFzc2VzXCI7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBtb2RlbC5jbGFzc05hbWU7XG4gICAgICAgIGlmIChtb2RlbC5jbGFzc05hbWUgPT09IFwiX1VzZXJcIiAmJiAhbW9kZWwuaWQpIHtcbiAgICAgICAgICAvLyBTcGVjaWFsLWNhc2UgdXNlciBzaWduLXVwLlxuICAgICAgICAgIHJvdXRlID0gXCJ1c2Vyc1wiO1xuICAgICAgICAgIGNsYXNzTmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuICAgICAgICAgIG9iamVjdElkOiBtb2RlbC5pZCxcbiAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICAgIHNlc3Npb25Ub2tlbjogb3B0aW9ucy5zZXNzaW9uVG9rZW4sXG4gICAgICAgICAgZGF0YToganNvblxuICAgICAgICB9KTtcblxuICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgICAgdmFyIHNlcnZlckF0dHJzID0gbW9kZWwucGFyc2UocmVzcCwgc3RhdHVzLCB4aHIpO1xuICAgICAgICAgIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICAgICAgICAgIHNlcnZlckF0dHJzID0gXy5leHRlbmQoYXR0cnMgfHwge30sIHNlcnZlckF0dHJzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW9kZWwuX2ZpbmlzaFNhdmUoc2VydmVyQXR0cnMpO1xuICAgICAgICAgIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICAgICAgICAgIG1vZGVsLnNldChjdXJyZW50LCBzZXRPcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1vZGVsO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgbW9kZWwuX2NhbmNlbFNhdmUoKTtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG5cbiAgICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgbW9kZWwpO1xuXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5fYWxsUHJldmlvdXNTYXZlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGlzIG1vZGVsIG9uIHRoZSBzZXJ2ZXIgaWYgaXQgd2FzIGFscmVhZHkgcGVyc2lzdGVkLlxuICAgICAqIE9wdGltaXN0aWNhbGx5IHJlbW92ZXMgdGhlIG1vZGVsIGZyb20gaXRzIGNvbGxlY3Rpb24sIGlmIGl0IGhhcyBvbmUuXG4gICAgICogSWYgYHdhaXQ6IHRydWVgIGlzIHBhc3NlZCwgd2FpdHMgZm9yIHRoZSBzZXJ2ZXIgdG8gcmVzcG9uZFxuICAgICAqIGJlZm9yZSByZW1vdmFsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBjYWxsYmFjayBvYmplY3QuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPndhaXQ6IFNldCB0byB0cnVlIHRvIHdhaXQgZm9yIHRoZSBzZXJ2ZXIgdG8gY29uZmlybSBzdWNjZXNzZnVsXG4gICAgICogICBkZWxldGlvbiBvZiB0aGUgb2JqZWN0IGJlZm9yZSB0cmlnZ2VyaW5nIHRoZSBgZGVzdHJveWAgZXZlbnQuXG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqICAgPGxpPnNlc3Npb25Ub2tlbjogQSB2YWxpZCBzZXNzaW9uIHRva2VuLCB1c2VkIGZvciBtYWtpbmcgYSByZXF1ZXN0IG9uXG4gICAgICogICAgICAgYmVoYWxmIG9mIGEgc3BlY2lmaWMgdXNlci5cbiAgICAgKiA8L3VsPlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBkZXN0cm95XG4gICAgICogICAgIGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG5cbiAgICAgIHZhciB0cmlnZ2VyRGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBtb2RlbC50cmlnZ2VyKCdkZXN0cm95JywgbW9kZWwsIG1vZGVsLmNvbGxlY3Rpb24sIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyRGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW9wdGlvbnMud2FpdCkge1xuICAgICAgICB0cmlnZ2VyRGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwiY2xhc3Nlc1wiLFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMuY2xhc3NOYW1lLFxuICAgICAgICBvYmplY3RJZDogdGhpcy5pZCxcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgc2Vzc2lvblRva2VuOiBvcHRpb25zLnNlc3Npb25Ub2tlblxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVxdWVzdC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgdHJpZ2dlckRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSByZXNwb25zZSBpbnRvIHRoZSBoYXNoIG9mIGF0dHJpYnV0ZXMgdG8gYmUgc2V0IG9uIHRoZSBtb2RlbC5cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXy5jbG9uZShyZXNwKTtcbiAgICAgIF8oW1wiY3JlYXRlZEF0XCIsIFwidXBkYXRlZEF0XCJdKS5lYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAob3V0cHV0W2tleV0pIHtcbiAgICAgICAgICBvdXRwdXRba2V5XSA9IFBhcnNlLl9wYXJzZURhdGUob3V0cHV0W2tleV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghb3V0cHV0LnVwZGF0ZWRBdCkge1xuICAgICAgICBvdXRwdXQudXBkYXRlZEF0ID0gb3V0cHV0LmNyZWF0ZWRBdDtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5fZXhpc3RlZCA9IChzdGF0dXMgIT09IDIwMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IG1vZGVsIHdpdGggaWRlbnRpY2FsIGF0dHJpYnV0ZXMgdG8gdGhpcyBvbmUuXG4gICAgICogQHJldHVybiB7UGFyc2UuT2JqZWN0fVxuICAgICAqL1xuICAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBvYmplY3QgaGFzIG5ldmVyIGJlZW4gc2F2ZWQgdG8gUGFyc2UuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc05ldzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXRoaXMuaWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGwgdGhpcyBtZXRob2QgdG8gbWFudWFsbHkgZmlyZSBhIGBcImNoYW5nZVwiYCBldmVudCBmb3IgdGhpcyBtb2RlbCBhbmRcbiAgICAgKiBhIGBcImNoYW5nZTphdHRyaWJ1dGVcImAgZXZlbnQgZm9yIGVhY2ggY2hhbmdlZCBhdHRyaWJ1dGUuXG4gICAgICogQ2FsbGluZyB0aGlzIHdpbGwgY2F1c2UgYWxsIG9iamVjdHMgb2JzZXJ2aW5nIHRoZSBtb2RlbCB0byB1cGRhdGUuXG4gICAgICovXG4gICAgY2hhbmdlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHZhciBjaGFuZ2luZyA9IHRoaXMuX2NoYW5naW5nO1xuICAgICAgdGhpcy5fY2hhbmdpbmcgPSB0cnVlO1xuXG4gICAgICAvLyBTaWxlbnQgY2hhbmdlcyBiZWNvbWUgcGVuZGluZyBjaGFuZ2VzLlxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX29iamVjdEVhY2godGhpcy5fc2lsZW50LCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgIHNlbGYuX3BlbmRpbmdbYXR0cl0gPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNpbGVudCBjaGFuZ2VzIGFyZSB0cmlnZ2VyZWQuXG4gICAgICB2YXIgY2hhbmdlcyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zLmNoYW5nZXMsIHRoaXMuX3NpbGVudCk7XG4gICAgICB0aGlzLl9zaWxlbnQgPSB7fTtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGNoYW5nZXMsIGZ1bmN0aW9uKHVudXNlZF92YWx1ZSwgYXR0cikge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ2NoYW5nZTonICsgYXR0ciwgc2VsZiwgc2VsZi5nZXQoYXR0ciksIG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgICBpZiAoY2hhbmdpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgaXMgdG8gZ2V0IGFyb3VuZCBsaW50IG5vdCBsZXR0aW5nIHVzIG1ha2UgYSBmdW5jdGlvbiBpbiBhIGxvb3AuXG4gICAgICB2YXIgZGVsZXRlQ2hhbmdlZCA9IGZ1bmN0aW9uKHZhbHVlLCBhdHRyKSB7XG4gICAgICAgIGlmICghc2VsZi5fcGVuZGluZ1thdHRyXSAmJiAhc2VsZi5fc2lsZW50W2F0dHJdKSB7XG4gICAgICAgICAgZGVsZXRlIHNlbGYuY2hhbmdlZFthdHRyXTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gQ29udGludWUgZmlyaW5nIGBcImNoYW5nZVwiYCBldmVudHMgd2hpbGUgdGhlcmUgYXJlIHBlbmRpbmcgY2hhbmdlcy5cbiAgICAgIHdoaWxlICghXy5pc0VtcHR5KHRoaXMuX3BlbmRpbmcpKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgLy8gUGVuZGluZyBhbmQgc2lsZW50IGNoYW5nZXMgc3RpbGwgcmVtYWluLlxuICAgICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmNoYW5nZWQsIGRlbGV0ZUNoYW5nZWQpO1xuICAgICAgICBzZWxmLl9wcmV2aW91c0F0dHJpYnV0ZXMgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5naW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgb2JqZWN0IHdhcyBjcmVhdGVkIGJ5IHRoZSBQYXJzZSBzZXJ2ZXIgd2hlbiB0aGVcbiAgICAgKiBvYmplY3QgbWlnaHQgaGF2ZSBhbHJlYWR5IGJlZW4gdGhlcmUgKGUuZy4gaW4gdGhlIGNhc2Ugb2YgYSBGYWNlYm9va1xuICAgICAqIGxvZ2luKVxuICAgICAqL1xuICAgIGV4aXN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2V4aXN0ZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZSBpZiB0aGUgbW9kZWwgaGFzIGNoYW5nZWQgc2luY2UgdGhlIGxhc3QgPGNvZGU+XCJjaGFuZ2VcIjwvY29kZT5cbiAgICAgKiBldmVudC4gIElmIHlvdSBzcGVjaWZ5IGFuIGF0dHJpYnV0ZSBuYW1lLCBkZXRlcm1pbmUgaWYgdGhhdCBhdHRyaWJ1dGVcbiAgICAgKiBoYXMgY2hhbmdlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBPcHRpb25hbCBhdHRyaWJ1dGUgbmFtZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ2hhbmdlZDogZnVuY3Rpb24oYXR0cikge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAhXy5pc0VtcHR5KHRoaXMuY2hhbmdlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VkICYmIF8uaGFzKHRoaXMuY2hhbmdlZCwgYXR0cik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSBjaGFuZ2VkLCBvclxuICAgICAqIGZhbHNlIGlmIHRoZXJlIGFyZSBubyBjaGFuZ2VkIGF0dHJpYnV0ZXMuIFVzZWZ1bCBmb3IgZGV0ZXJtaW5pbmcgd2hhdFxuICAgICAqIHBhcnRzIG9mIGEgdmlldyBuZWVkIHRvIGJlIHVwZGF0ZWQgYW5kL29yIHdoYXQgYXR0cmlidXRlcyBuZWVkIHRvIGJlXG4gICAgICogcGVyc2lzdGVkIHRvIHRoZSBzZXJ2ZXIuIFVuc2V0IGF0dHJpYnV0ZXMgd2lsbCBiZSBzZXQgdG8gdW5kZWZpbmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGFuIGF0dHJpYnV0ZXMgb2JqZWN0IHRvIGRpZmYgYWdhaW5zdCB0aGUgbW9kZWwsXG4gICAgICogZGV0ZXJtaW5pbmcgaWYgdGhlcmUgKndvdWxkIGJlKiBhIGNoYW5nZS5cbiAgICAgKi9cbiAgICBjaGFuZ2VkQXR0cmlidXRlczogZnVuY3Rpb24oZGlmZikge1xuICAgICAgaWYgKCFkaWZmKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc0NoYW5nZWQoKSA/IF8uY2xvbmUodGhpcy5jaGFuZ2VkKSA6IGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGNoYW5nZWQgPSB7fTtcbiAgICAgIHZhciBvbGQgPSB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChkaWZmLCBmdW5jdGlvbihkaWZmVmFsLCBhdHRyKSB7XG4gICAgICAgIGlmICghXy5pc0VxdWFsKG9sZFthdHRyXSwgZGlmZlZhbCkpIHtcbiAgICAgICAgICBjaGFuZ2VkW2F0dHJdID0gZGlmZlZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY2hhbmdlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcHJldmlvdXMgdmFsdWUgb2YgYW4gYXR0cmlidXRlLCByZWNvcmRlZCBhdCB0aGUgdGltZSB0aGUgbGFzdFxuICAgICAqIDxjb2RlPlwiY2hhbmdlXCI8L2NvZGU+IGV2ZW50IHdhcyBmaXJlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBOYW1lIG9mIHRoZSBhdHRyaWJ1dGUgdG8gZ2V0LlxuICAgICAqL1xuICAgIHByZXZpb3VzOiBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGggfHwgIXRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXNbYXR0cl07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBtb2RlbCBhdCB0aGUgdGltZSBvZiB0aGUgcHJldmlvdXNcbiAgICAgKiA8Y29kZT5cImNoYW5nZVwiPC9jb2RlPiBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJldmlvdXNBdHRyaWJ1dGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfLmNsb25lKHRoaXMuX3ByZXZpb3VzQXR0cmlidXRlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgbW9kZWwgaXMgY3VycmVudGx5IGluIGEgdmFsaWQgc3RhdGUuIEl0J3Mgb25seSBwb3NzaWJsZSB0b1xuICAgICAqIGdldCBpbnRvIGFuICppbnZhbGlkKiBzdGF0ZSBpZiB5b3UncmUgdXNpbmcgc2lsZW50IGNoYW5nZXMuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1ZhbGlkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhdGhpcy52YWxpZGF0ZSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBZb3Ugc2hvdWxkIG5vdCBjYWxsIHRoaXMgZnVuY3Rpb24gZGlyZWN0bHkgdW5sZXNzIHlvdSBzdWJjbGFzc1xuICAgICAqIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT4sIGluIHdoaWNoIGNhc2UgeW91IGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZFxuICAgICAqIHRvIHByb3ZpZGUgYWRkaXRpb25hbCB2YWxpZGF0aW9uIG9uIDxjb2RlPnNldDwvY29kZT4gYW5kXG4gICAgICogPGNvZGU+c2F2ZTwvY29kZT4uICBZb3VyIGltcGxlbWVudGF0aW9uIHNob3VsZCByZXR1cm5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRycyBUaGUgY3VycmVudCBkYXRhIHRvIHZhbGlkYXRlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtbGlrZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHt9IEZhbHNlIGlmIHRoZSBkYXRhIGlzIHZhbGlkLiAgQW4gZXJyb3Igb2JqZWN0IG90aGVyd2lzZS5cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNzZXRcbiAgICAgKi9cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChfLmhhcyhhdHRycywgXCJBQ0xcIikgJiYgIShhdHRycy5BQ0wgaW5zdGFuY2VvZiBQYXJzZS5BQ0wpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJBQ0wgbXVzdCBiZSBhIFBhcnNlLkFDTC5cIik7XG4gICAgICB9XG4gICAgICB2YXIgY29ycmVjdCA9IHRydWU7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaChhdHRycywgZnVuY3Rpb24odW51c2VkX3ZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCEoL15bQS1aYS16XVswLTlBLVphLXpfXSokLykudGVzdChrZXkpKSB7XG4gICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghY29ycmVjdCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLklOVkFMSURfS0VZX05BTUUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW4gdmFsaWRhdGlvbiBhZ2FpbnN0IGEgc2V0IG9mIGluY29taW5nIGF0dHJpYnV0ZXMsIHJldHVybmluZyBgdHJ1ZWBcbiAgICAgKiBpZiBhbGwgaXMgd2VsbC4gSWYgYSBzcGVjaWZpYyBgZXJyb3JgIGNhbGxiYWNrIGhhcyBiZWVuIHBhc3NlZCxcbiAgICAgKiBjYWxsIHRoYXQgaW5zdGVhZCBvZiBmaXJpbmcgdGhlIGdlbmVyYWwgYFwiZXJyb3JcImAgZXZlbnQuXG4gICAgICovXG4gICAgX3ZhbGlkYXRlOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMuc2lsZW50IHx8ICF0aGlzLnZhbGlkYXRlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgYXR0cnMgPSBfLmV4dGVuZCh7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRycyk7XG4gICAgICB2YXIgZXJyb3IgPSB0aGlzLnZhbGlkYXRlKGF0dHJzLCBvcHRpb25zKTtcbiAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVycm9yKSB7XG4gICAgICAgIG9wdGlvbnMuZXJyb3IodGhpcywgZXJyb3IsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdlcnJvcicsIHRoaXMsIGVycm9yLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgQUNMIGZvciB0aGlzIG9iamVjdC5cbiAgICAgKiBAcmV0dXJucyB7UGFyc2UuQUNMfSBBbiBpbnN0YW5jZSBvZiBQYXJzZS5BQ0wuXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3QjZ2V0XG4gICAgICovXG4gICAgZ2V0QUNMOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChcIkFDTFwiKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgQUNMIHRvIGJlIHVzZWQgZm9yIHRoaXMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuQUNMfSBhY2wgQW4gaW5zdGFuY2Ugb2YgUGFyc2UuQUNMLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbmFsIEJhY2tib25lLWxpa2Ugb3B0aW9ucyBvYmplY3QgdG8gYmVcbiAgICAgKiAgICAgcGFzc2VkIGluIHRvIHNldC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBzZXQgcGFzc2VkIHZhbGlkYXRpb24uXG4gICAgICogQHNlZSBQYXJzZS5PYmplY3Qjc2V0XG4gICAgICovXG4gICAgc2V0QUNMOiBmdW5jdGlvbihhY2wsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChcIkFDTFwiLCBhY2wsIG9wdGlvbnMpO1xuICAgIH1cblxuICB9KTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgc3ViY2xhc3MgZm9yIG1ha2luZyBuZXcgaW5zdGFuY2VzIG9mIHRoZSBnaXZlblxuICAgKiBjbGFzc05hbWUgc3RyaW5nLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll9nZXRTdWJjbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgIGlmICghXy5pc1N0cmluZyhjbGFzc05hbWUpKSB7XG4gICAgICB0aHJvdyBcIlBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3MgcmVxdWlyZXMgYSBzdHJpbmcgYXJndW1lbnQuXCI7XG4gICAgfVxuICAgIHZhciBPYmplY3RDbGFzcyA9IFBhcnNlLk9iamVjdC5fY2xhc3NNYXBbY2xhc3NOYW1lXTtcbiAgICBpZiAoIU9iamVjdENsYXNzKSB7XG4gICAgICBPYmplY3RDbGFzcyA9IFBhcnNlLk9iamVjdC5leHRlbmQoY2xhc3NOYW1lKTtcbiAgICAgIFBhcnNlLk9iamVjdC5fY2xhc3NNYXBbY2xhc3NOYW1lXSA9IE9iamVjdENsYXNzO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0Q2xhc3M7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYSBzdWJjbGFzcyBvZiBQYXJzZS5PYmplY3QgZm9yIHRoZSBnaXZlbiBjbGFzc25hbWUuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX2NyZWF0ZSA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgYXR0cmlidXRlcywgb3B0aW9ucykge1xuICAgIHZhciBPYmplY3RDbGFzcyA9IFBhcnNlLk9iamVjdC5fZ2V0U3ViY2xhc3MoY2xhc3NOYW1lKTtcbiAgICByZXR1cm4gbmV3IE9iamVjdENsYXNzKGF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBvYmplY3QgaWRzIGdpdmVuIGEgbGlzdCBvZiBvYmplY3RzLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll90b09iamVjdElkQXJyYXkgPSBmdW5jdGlvbihsaXN0LCBvbWl0T2JqZWN0c1dpdGhEYXRhKSB7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhsaXN0KTtcbiAgICB9XG5cbiAgICB2YXIgZXJyb3I7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGxpc3RbMF0uY2xhc3NOYW1lO1xuICAgIHZhciBvYmplY3RJZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmplY3QgPSBsaXN0W2ldO1xuICAgICAgaWYgKGNsYXNzTmFtZSAhPT0gb2JqZWN0LmNsYXNzTmFtZSkge1xuICAgICAgICBlcnJvciA9IG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5JTlZBTElEX0NMQVNTX05BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxsIG9iamVjdHMgc2hvdWxkIGJlIG9mIHRoZSBzYW1lIGNsYXNzXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKCFvYmplY3QuaWQpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuTUlTU0lOR19PQkpFQ1RfSUQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxsIG9iamVjdHMgbXVzdCBoYXZlIGFuIElEXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKG9taXRPYmplY3RzV2l0aERhdGEgJiYgb2JqZWN0Ll9oYXNEYXRhKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgb2JqZWN0SWRzLnB1c2gob2JqZWN0LmlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhvYmplY3RJZHMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGEgbGlzdCBvZiBvYmplY3RzIHdpdGggZmV0Y2hlZCByZXN1bHRzLlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0Ll91cGRhdGVXaXRoRmV0Y2hlZFJlc3VsdHMgPSBmdW5jdGlvbihsaXN0LCBmZXRjaGVkLCBmb3JjZUZldGNoKSB7XG4gICAgdmFyIGZldGNoZWRPYmplY3RzQnlJZCA9IHt9O1xuICAgIFBhcnNlLl9hcnJheUVhY2goZmV0Y2hlZCwgZnVuY3Rpb24ob2JqZWN0LCBpKSB7XG4gICAgICBmZXRjaGVkT2JqZWN0c0J5SWRbb2JqZWN0LmlkXSA9IG9iamVjdDtcbiAgICB9KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iamVjdCA9IGxpc3RbaV07XG4gICAgICB2YXIgZmV0Y2hlZE9iamVjdCA9IGZldGNoZWRPYmplY3RzQnlJZFtvYmplY3QuaWRdO1xuICAgICAgaWYgKCFmZXRjaGVkT2JqZWN0ICYmIGZvcmNlRmV0Y2gpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWxsIG9iamVjdHMgbXVzdCBleGlzdCBvbiB0aGUgc2VydmVyXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIG9iamVjdC5fbWVyZ2VGcm9tT2JqZWN0KGZldGNoZWRPYmplY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKGxpc3QpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGZXRjaGVzIHRoZSBvYmplY3RzIGdpdmVuIGluIGxpc3QuICBUaGUgZm9yY2VGZXRjaCBvcHRpb24gd2lsbCBmZXRjaCBhbGxcbiAgICogb2JqZWN0cyBpZiB0cnVlIGFuZCBpZ25vcmUgb2JqZWN0cyB3aXRoIGRhdGEgaWYgZmFsc2UuXG4gICAqL1xuICBQYXJzZS5PYmplY3QuX2ZldGNoQWxsID0gZnVuY3Rpb24obGlzdCwgZm9yY2VGZXRjaCkge1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMobGlzdCk7XG4gICAgfVxuXG4gICAgdmFyIG9taXRPYmplY3RzV2l0aERhdGEgPSAhZm9yY2VGZXRjaDtcbiAgICByZXR1cm4gUGFyc2UuT2JqZWN0Ll90b09iamVjdElkQXJyYXkoXG4gICAgICBsaXN0LFxuICAgICAgb21pdE9iamVjdHNXaXRoRGF0YVxuICAgICkudGhlbihmdW5jdGlvbihvYmplY3RJZHMpIHtcbiAgICAgIHZhciBjbGFzc05hbWUgPSBsaXN0WzBdLmNsYXNzTmFtZTtcbiAgICAgIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShjbGFzc05hbWUpO1xuICAgICAgcXVlcnkuY29udGFpbmVkSW4oXCJvYmplY3RJZFwiLCBvYmplY3RJZHMpO1xuICAgICAgcXVlcnkubGltaXQgPSBvYmplY3RJZHMubGVuZ3RoO1xuICAgICAgcmV0dXJuIHF1ZXJ5LmZpbmQoKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuX3VwZGF0ZVdpdGhGZXRjaGVkUmVzdWx0cyhcbiAgICAgICAgbGlzdCxcbiAgICAgICAgcmVzdWx0cyxcbiAgICAgICAgZm9yY2VGZXRjaFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBTZXQgdXAgYSBtYXAgb2YgY2xhc3NOYW1lIHRvIGNsYXNzIHNvIHRoYXQgd2UgY2FuIGNyZWF0ZSBuZXcgaW5zdGFuY2VzIG9mXG4gIC8vIFBhcnNlIE9iamVjdHMgZnJvbSBKU09OIGF1dG9tYXRpY2FsbHkuXG4gIFBhcnNlLk9iamVjdC5fY2xhc3NNYXAgPSB7fTtcblxuICBQYXJzZS5PYmplY3QuX2V4dGVuZCA9IFBhcnNlLl9leHRlbmQ7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0IGZvciB0aGUgZ2l2ZW4gUGFyc2UgY2xhc3MgbmFtZS5cbiAgICpcbiAgICogPHA+RXZlcnkgZXh0ZW5zaW9uIG9mIGEgUGFyc2UgY2xhc3Mgd2lsbCBpbmhlcml0IGZyb20gdGhlIG1vc3QgcmVjZW50XG4gICAqIHByZXZpb3VzIGV4dGVuc2lvbiBvZiB0aGF0IGNsYXNzLiBXaGVuIGEgUGFyc2UuT2JqZWN0IGlzIGF1dG9tYXRpY2FsbHlcbiAgICogY3JlYXRlZCBieSBwYXJzaW5nIEpTT04sIGl0IHdpbGwgdXNlIHRoZSBtb3N0IHJlY2VudCBleHRlbnNpb24gb2YgdGhhdFxuICAgKiBjbGFzcy48L3A+XG4gICAqXG4gICAqIDxwPllvdSBzaG91bGQgY2FsbCBlaXRoZXI6PHByZT5cbiAgICogICAgIHZhciBNeUNsYXNzID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIk15Q2xhc3NcIiwge1xuICAgKiAgICAgICAgIDxpPkluc3RhbmNlIG1ldGhvZHM8L2k+LFxuICAgKiAgICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGF0dHJzLCBvcHRpb25zKSB7XG4gICAqICAgICAgICAgICAgIHRoaXMuc29tZUluc3RhbmNlUHJvcGVydHkgPSBbXSxcbiAgICogICAgICAgICAgICAgPGk+T3RoZXIgaW5zdGFuY2UgcHJvcGVydGllczwvaT5cbiAgICogICAgICAgICB9XG4gICAqICAgICB9LCB7XG4gICAqICAgICAgICAgPGk+Q2xhc3MgcHJvcGVydGllczwvaT5cbiAgICogICAgIH0pOzwvcHJlPlxuICAgKiBvciwgZm9yIEJhY2tib25lIGNvbXBhdGliaWxpdHk6PHByZT5cbiAgICogICAgIHZhciBNeUNsYXNzID0gUGFyc2UuT2JqZWN0LmV4dGVuZCh7XG4gICAqICAgICAgICAgY2xhc3NOYW1lOiBcIk15Q2xhc3NcIixcbiAgICogICAgICAgICA8aT5JbnN0YW5jZSBtZXRob2RzPC9pPixcbiAgICogICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbihhdHRycywgb3B0aW9ucykge1xuICAgKiAgICAgICAgICAgICB0aGlzLnNvbWVJbnN0YW5jZVByb3BlcnR5ID0gW10sXG4gICAqICAgICAgICAgICAgIDxpPk90aGVyIGluc3RhbmNlIHByb3BlcnRpZXM8L2k+XG4gICAqICAgICAgICAgfVxuICAgKiAgICAgfSwge1xuICAgKiAgICAgICAgIDxpPkNsYXNzIHByb3BlcnRpZXM8L2k+XG4gICAqICAgICB9KTs8L3ByZT48L3A+XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgVGhlIG5hbWUgb2YgdGhlIFBhcnNlIGNsYXNzIGJhY2tpbmcgdGhpcyBtb2RlbC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3RvUHJvcHMgSW5zdGFuY2UgcHJvcGVydGllcyB0byBhZGQgdG8gaW5zdGFuY2VzIG9mIHRoZVxuICAgKiAgICAgY2xhc3MgcmV0dXJuZWQgZnJvbSB0aGlzIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsYXNzUHJvcHMgQ2xhc3MgcHJvcGVydGllcyB0byBhZGQgdGhlIGNsYXNzIHJldHVybmVkIGZyb21cbiAgICogICAgIHRoaXMgbWV0aG9kLlxuICAgKiBAcmV0dXJuIHtDbGFzc30gQSBuZXcgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0LlxuICAgKi9cbiAgUGFyc2UuT2JqZWN0LmV4dGVuZCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgcHJvdG9Qcm9wcywgY2xhc3NQcm9wcykge1xuICAgIC8vIEhhbmRsZSB0aGUgY2FzZSB3aXRoIG9ubHkgdHdvIGFyZ3MuXG4gICAgaWYgKCFfLmlzU3RyaW5nKGNsYXNzTmFtZSkpIHtcbiAgICAgIGlmIChjbGFzc05hbWUgJiYgXy5oYXMoY2xhc3NOYW1lLCBcImNsYXNzTmFtZVwiKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LmV4dGVuZChjbGFzc05hbWUuY2xhc3NOYW1lLCBjbGFzc05hbWUsIHByb3RvUHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgXCJQYXJzZS5PYmplY3QuZXh0ZW5kJ3MgZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIHRoZSBjbGFzc05hbWUuXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHNvbWVvbmUgdHJpZXMgdG8gc3ViY2xhc3MgXCJVc2VyXCIsIGNvZXJjZSBpdCB0byB0aGUgcmlnaHQgdHlwZS5cbiAgICBpZiAoY2xhc3NOYW1lID09PSBcIlVzZXJcIiAmJiBQYXJzZS5Vc2VyLl9wZXJmb3JtVXNlclJld3JpdGUpIHtcbiAgICAgIGNsYXNzTmFtZSA9IFwiX1VzZXJcIjtcbiAgICB9XG4gICAgcHJvdG9Qcm9wcyA9IHByb3RvUHJvcHMgfHwge307XG4gICAgcHJvdG9Qcm9wcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cbiAgICB2YXIgTmV3Q2xhc3NPYmplY3QgPSBudWxsO1xuICAgIGlmIChfLmhhcyhQYXJzZS5PYmplY3QuX2NsYXNzTWFwLCBjbGFzc05hbWUpKSB7XG4gICAgICB2YXIgT2xkQ2xhc3NPYmplY3QgPSBQYXJzZS5PYmplY3QuX2NsYXNzTWFwW2NsYXNzTmFtZV07XG4gICAgICAvLyBUaGlzIG5ldyBzdWJjbGFzcyBoYXMgYmVlbiB0b2xkIHRvIGV4dGVuZCBib3RoIGZyb20gXCJ0aGlzXCIgYW5kIGZyb21cbiAgICAgIC8vIE9sZENsYXNzT2JqZWN0LiBUaGlzIGlzIG11bHRpcGxlIGluaGVyaXRhbmNlLCB3aGljaCBpc24ndCBzdXBwb3J0ZWQuXG4gICAgICAvLyBGb3Igbm93LCBsZXQncyBqdXN0IHBpY2sgb25lLlxuICAgICAgTmV3Q2xhc3NPYmplY3QgPSBPbGRDbGFzc09iamVjdC5fZXh0ZW5kKHByb3RvUHJvcHMsIGNsYXNzUHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBOZXdDbGFzc09iamVjdCA9IHRoaXMuX2V4dGVuZChwcm90b1Byb3BzLCBjbGFzc1Byb3BzKTtcbiAgICB9XG4gICAgLy8gRXh0ZW5kaW5nIGEgc3ViY2xhc3Mgc2hvdWxkIHJldXNlIHRoZSBjbGFzc25hbWUgYXV0b21hdGljYWxseS5cbiAgICBOZXdDbGFzc09iamVjdC5leHRlbmQgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhhcmcwKSB8fCAoYXJnMCAmJiBfLmhhcyhhcmcwLCBcImNsYXNzTmFtZVwiKSkpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5leHRlbmQuYXBwbHkoTmV3Q2xhc3NPYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICB2YXIgbmV3QXJndW1lbnRzID0gW2NsYXNzTmFtZV0uY29uY2F0KFBhcnNlLl8udG9BcnJheShhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QuZXh0ZW5kLmFwcGx5KE5ld0NsYXNzT2JqZWN0LCBuZXdBcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgcmVmZXJlbmNlIHRvIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0IHdpdGggdGhlIGdpdmVuIGlkLiBUaGlzXG4gICAgICogZG9lcyBub3QgZXhpc3Qgb24gUGFyc2UuT2JqZWN0LCBvbmx5IG9uIHN1YmNsYXNzZXMuXG4gICAgICpcbiAgICAgKiA8cD5BIHNob3J0Y3V0IGZvcjogPHByZT5cbiAgICAgKiAgdmFyIEZvbyA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJGb29cIik7XG4gICAgICogIHZhciBwb2ludGVyVG9Gb28gPSBuZXcgRm9vKCk7XG4gICAgICogIHBvaW50ZXJUb0Zvby5pZCA9IFwibXlPYmplY3RJZFwiO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQG5hbWUgY3JlYXRlV2l0aG91dERhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBvYmplY3QgdG8gY3JlYXRlIGEgcmVmZXJlbmNlIHRvLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLk9iamVjdH0gQSBQYXJzZS5PYmplY3QgcmVmZXJlbmNlLlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBQYXJzZS5PYmplY3RcbiAgICAgKi9cbiAgICBOZXdDbGFzc09iamVjdC5jcmVhdGVXaXRob3V0RGF0YSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgb2JqID0gbmV3IE5ld0NsYXNzT2JqZWN0KCk7XG4gICAgICBvYmouaWQgPSBpZDtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuICAgIFBhcnNlLk9iamVjdC5fY2xhc3NNYXBbY2xhc3NOYW1lXSA9IE5ld0NsYXNzT2JqZWN0O1xuICAgIHJldHVybiBOZXdDbGFzc09iamVjdDtcbiAgfTtcblxuICBQYXJzZS5PYmplY3QuX2ZpbmRVbnNhdmVkQ2hpbGRyZW4gPSBmdW5jdGlvbihvYmplY3QsIGNoaWxkcmVuLCBmaWxlcykge1xuICAgIFBhcnNlLl90cmF2ZXJzZShvYmplY3QsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgICBvYmplY3QuX3JlZnJlc2hDYWNoZSgpO1xuICAgICAgICBpZiAob2JqZWN0LmRpcnR5KCkpIHtcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgICBpZiAoIW9iamVjdC51cmwoKSkge1xuICAgICAgICAgIGZpbGVzLnB1c2gob2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgUGFyc2UuT2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgLy8gVE9ETyhrbGltdCk6IFdlIHNob3VsZCByZXdyaXRlIF90cmF2ZXJzZSBzbyB0aGF0IGl0IGNhbiBiZSB1c2VkIGhlcmUuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFBhcnNlLk9iamVjdCkge1xuICAgICAgcmV0dXJuICEhb2JqZWN0LmlkO1xuICAgIH1cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgUGFyc2UuRmlsZSkge1xuICAgICAgLy8gRG9uJ3QgcmVjdXJzZSBpbmRlZmluaXRlbHkgaW50byBmaWxlcy5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBjYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlID0gdHJ1ZTtcblxuICAgIGlmIChfLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChvYmplY3QsIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGlmICghUGFyc2UuT2JqZWN0Ll9jYW5CZVNlcmlhbGl6ZWRBc1ZhbHVlKGNoaWxkKSkge1xuICAgICAgICAgIGNhbkJlU2VyaWFsaXplZEFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKG9iamVjdCwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgaWYgKCFQYXJzZS5PYmplY3QuX2NhbkJlU2VyaWFsaXplZEFzVmFsdWUoY2hpbGQpKSB7XG4gICAgICAgICAgY2FuQmVTZXJpYWxpemVkQXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbkJlU2VyaWFsaXplZEFzVmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHJvb3Qgb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uczogVGhlIG9ubHkgdmFsaWQgb3B0aW9uIGlzIHVzZU1hc3RlcktleS5cbiAgICovXG4gIFBhcnNlLk9iamVjdC5fZGVlcFNhdmVBc3luYyA9IGZ1bmN0aW9uKG9iamVjdCwgb3B0aW9ucykge1xuICAgIHZhciB1bnNhdmVkQ2hpbGRyZW4gPSBbXTtcbiAgICB2YXIgdW5zYXZlZEZpbGVzID0gW107XG4gICAgUGFyc2UuT2JqZWN0Ll9maW5kVW5zYXZlZENoaWxkcmVuKG9iamVjdCwgdW5zYXZlZENoaWxkcmVuLCB1bnNhdmVkRmlsZXMpO1xuXG4gICAgdmFyIHByb21pc2UgPSBQYXJzZS5Qcm9taXNlLmFzKCk7XG4gICAgXy5lYWNoKHVuc2F2ZWRGaWxlcywgZnVuY3Rpb24oZmlsZSkge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUuc2F2ZShvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIG9iamVjdHMgPSBfLnVuaXEodW5zYXZlZENoaWxkcmVuKTtcbiAgICB2YXIgcmVtYWluaW5nID0gXy51bmlxKG9iamVjdHMpO1xuXG4gICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLl9jb250aW51ZVdoaWxlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcmVtYWluaW5nLmxlbmd0aCA+IDA7XG4gICAgICB9LCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBHYXRoZXIgdXAgYWxsIHRoZSBvYmplY3RzIHRoYXQgY2FuIGJlIHNhdmVkIGluIHRoaXMgYmF0Y2guXG4gICAgICAgIHZhciBiYXRjaCA9IFtdO1xuICAgICAgICB2YXIgbmV3UmVtYWluaW5nID0gW107XG4gICAgICAgIFBhcnNlLl9hcnJheUVhY2gocmVtYWluaW5nLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAvLyBMaW1pdCBiYXRjaGVzIHRvIDIwIG9iamVjdHMuXG4gICAgICAgICAgaWYgKGJhdGNoLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBuZXdSZW1haW5pbmcucHVzaChvYmplY3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChvYmplY3QuX2NhbkJlU2VyaWFsaXplZCgpKSB7XG4gICAgICAgICAgICBiYXRjaC5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1JlbWFpbmluZy5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmVtYWluaW5nID0gbmV3UmVtYWluaW5nO1xuXG4gICAgICAgIC8vIElmIHdlIGNhbid0IHNhdmUgYW55IG9iamVjdHMsIHRoZXJlIG11c3QgYmUgYSBjaXJjdWxhciByZWZlcmVuY2UuXG4gICAgICAgIGlmIChiYXRjaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihcbiAgICAgICAgICAgIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRyaWVkIHRvIHNhdmUgYSBiYXRjaCB3aXRoIGEgY3ljbGUuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc2VydmUgYSBzcG90IGluIGV2ZXJ5IG9iamVjdCdzIHNhdmUgcXVldWUuXG4gICAgICAgIHZhciByZWFkeVRvU3RhcnQgPSBQYXJzZS5Qcm9taXNlLndoZW4oXy5tYXAoYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBvYmplY3QuX2FsbFByZXZpb3VzU2F2ZXMgfHwgUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHZhciBiYXRjaEZpbmlzaGVkID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgICAgUGFyc2UuX2FycmF5RWFjaChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgb2JqZWN0Ll9hbGxQcmV2aW91c1NhdmVzID0gYmF0Y2hGaW5pc2hlZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2F2ZSBhIHNpbmdsZSBiYXRjaCwgd2hldGhlciBwcmV2aW91cyBzYXZlcyBzdWNjZWVkZWQgb3IgZmFpbGVkLlxuICAgICAgICByZXR1cm4gcmVhZHlUb1N0YXJ0Ll9jb250aW51ZVdpdGgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgICAgIHJvdXRlOiBcImJhdGNoXCIsXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgICAgIHNlc3Npb25Ub2tlbjogb3B0aW9ucy5zZXNzaW9uVG9rZW4sXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHJlcXVlc3RzOiBfLm1hcChiYXRjaCwgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGpzb24gPSBvYmplY3QuX2dldFNhdmVKU09OKCk7XG4gICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IFwiUE9TVFwiO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBcIi8xL2NsYXNzZXMvXCIgKyBvYmplY3QuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuaWQpIHtcbiAgICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoICsgXCIvXCIgKyBvYmplY3QuaWQ7XG4gICAgICAgICAgICAgICAgICBtZXRob2QgPSBcIlBVVFwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iamVjdC5fc3RhcnRTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgICAgYm9keToganNvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICAgIFBhcnNlLl9hcnJheUVhY2goYmF0Y2gsIGZ1bmN0aW9uKG9iamVjdCwgaSkge1xuICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbaV0uc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIG9iamVjdC5fZmluaXNoU2F2ZShcbiAgICAgICAgICAgICAgICAgIG9iamVjdC5wYXJzZShyZXNwb25zZVtpXS5zdWNjZXNzLCBzdGF0dXMsIHhocikpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZXJyb3IgfHwgcmVzcG9uc2VbaV0uZXJyb3I7XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9jYW5jZWxTYXZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKFxuICAgICAgICAgICAgICAgIG5ldyBQYXJzZS5FcnJvcihlcnJvci5jb2RlLCBlcnJvci5lcnJvcikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgICBiYXRjaEZpbmlzaGVkLnJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgYmF0Y2hGaW5pc2hlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0pO1xuICB9O1xuXG59KHRoaXMpKTtcblxuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIFJvbGUgb24gdGhlIFBhcnNlIHNlcnZlci4gUm9sZXMgcmVwcmVzZW50IGdyb3VwaW5ncyBvZlxuICAgKiBVc2VycyBmb3IgdGhlIHB1cnBvc2VzIG9mIGdyYW50aW5nIHBlcm1pc3Npb25zIChlLmcuIHNwZWNpZnlpbmcgYW4gQUNMXG4gICAqIGZvciBhbiBPYmplY3QpLiBSb2xlcyBhcmUgc3BlY2lmaWVkIGJ5IHRoZWlyIHNldHMgb2YgY2hpbGQgdXNlcnMgYW5kXG4gICAqIGNoaWxkIHJvbGVzLCBhbGwgb2Ygd2hpY2ggYXJlIGdyYW50ZWQgYW55IHBlcm1pc3Npb25zIHRoYXQgdGhlIHBhcmVudFxuICAgKiByb2xlIGhhcy5cbiAgICpcbiAgICogPHA+Um9sZXMgbXVzdCBoYXZlIGEgbmFtZSAod2hpY2ggY2Fubm90IGJlIGNoYW5nZWQgYWZ0ZXIgY3JlYXRpb24gb2YgdGhlXG4gICAqIHJvbGUpLCBhbmQgbXVzdCBzcGVjaWZ5IGFuIEFDTC48L3A+XG4gICAqIEBjbGFzc1xuICAgKiBBIFBhcnNlLlJvbGUgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBhIHJvbGUgcGVyc2lzdGVkIHRvIHRoZSBQYXJzZVxuICAgKiBjbG91ZC5cbiAgICovXG4gIFBhcnNlLlJvbGUgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiX1JvbGVcIiwgLyoqIEBsZW5kcyBQYXJzZS5Sb2xlLnByb3RvdHlwZSAqLyB7XG4gICAgLy8gSW5zdGFuY2UgTWV0aG9kc1xuICAgIFxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBuZXcgUGFyc2VSb2xlIHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIEFDTC5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgUm9sZSB0byBjcmVhdGUuXG4gICAgICogQHBhcmFtIHtQYXJzZS5BQ0x9IGFjbCBUaGUgQUNMIGZvciB0aGlzIHJvbGUuIFJvbGVzIG11c3QgaGF2ZSBhbiBBQ0wuXG4gICAgICovXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKG5hbWUsIGFjbCkge1xuICAgICAgaWYgKF8uaXNTdHJpbmcobmFtZSkgJiYgKGFjbCBpbnN0YW5jZW9mIFBhcnNlLkFDTCkpIHtcbiAgICAgICAgUGFyc2UuT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG51bGwsIG51bGwpO1xuICAgICAgICB0aGlzLnNldE5hbWUobmFtZSk7XG4gICAgICAgIHRoaXMuc2V0QUNMKGFjbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBQYXJzZS5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbmFtZSwgYWNsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIHJvbGUuICBZb3UgY2FuIGFsdGVybmF0aXZlbHkgY2FsbCByb2xlLmdldChcIm5hbWVcIilcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSByb2xlLlxuICAgICAqL1xuICAgIGdldE5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwibmFtZVwiKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG5hbWUgZm9yIGEgcm9sZS4gVGhpcyB2YWx1ZSBtdXN0IGJlIHNldCBiZWZvcmUgdGhlIHJvbGUgaGFzXG4gICAgICogYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyLCBhbmQgY2Fubm90IGJlIHNldCBvbmNlIHRoZSByb2xlIGhhcyBiZWVuXG4gICAgICogc2F2ZWQuXG4gICAgICogXG4gICAgICogPHA+XG4gICAgICogICBBIHJvbGUncyBuYW1lIGNhbiBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIGNoYXJhY3RlcnMsIF8sIC0sIGFuZFxuICAgICAqICAgc3BhY2VzLlxuICAgICAqIDwvcD5cbiAgICAgKlxuICAgICAqIDxwPlRoaXMgaXMgZXF1aXZhbGVudCB0byBjYWxsaW5nIHJvbGUuc2V0KFwibmFtZVwiLCBuYW1lKTwvcD5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcm9sZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBTdGFuZGFyZCBvcHRpb25zIG9iamVjdCB3aXRoIHN1Y2Nlc3MgYW5kIGVycm9yXG4gICAgICogICAgIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBzZXROYW1lOiBmdW5jdGlvbihuYW1lLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoXCJuYW1lXCIsIG5hbWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgUGFyc2UuUmVsYXRpb24gZm9yIHRoZSBQYXJzZS5Vc2VycyB0aGF0IGFyZSBkaXJlY3RcbiAgICAgKiBjaGlsZHJlbiBvZiB0aGlzIHJvbGUuIFRoZXNlIHVzZXJzIGFyZSBncmFudGVkIGFueSBwcml2aWxlZ2VzIHRoYXQgdGhpc1xuICAgICAqIHJvbGUgaGFzIGJlZW4gZ3JhbnRlZCAoZS5nLiByZWFkIG9yIHdyaXRlIGFjY2VzcyB0aHJvdWdoIEFDTHMpLiBZb3UgY2FuXG4gICAgICogYWRkIG9yIHJlbW92ZSB1c2VycyBmcm9tIHRoZSByb2xlIHRocm91Z2ggdGhpcyByZWxhdGlvbi5cbiAgICAgKiBcbiAgICAgKiA8cD5UaGlzIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyByb2xlLnJlbGF0aW9uKFwidXNlcnNcIik8L3A+XG4gICAgICogXG4gICAgICogQHJldHVybiB7UGFyc2UuUmVsYXRpb259IHRoZSByZWxhdGlvbiBmb3IgdGhlIHVzZXJzIGJlbG9uZ2luZyB0byB0aGlzXG4gICAgICogICAgIHJvbGUuXG4gICAgICovXG4gICAgZ2V0VXNlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb24oXCJ1c2Vyc1wiKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIFBhcnNlLlJlbGF0aW9uIGZvciB0aGUgUGFyc2UuUm9sZXMgdGhhdCBhcmUgZGlyZWN0XG4gICAgICogY2hpbGRyZW4gb2YgdGhpcyByb2xlLiBUaGVzZSByb2xlcycgdXNlcnMgYXJlIGdyYW50ZWQgYW55IHByaXZpbGVnZXMgdGhhdFxuICAgICAqIHRoaXMgcm9sZSBoYXMgYmVlbiBncmFudGVkIChlLmcuIHJlYWQgb3Igd3JpdGUgYWNjZXNzIHRocm91Z2ggQUNMcykuIFlvdVxuICAgICAqIGNhbiBhZGQgb3IgcmVtb3ZlIGNoaWxkIHJvbGVzIGZyb20gdGhpcyByb2xlIHRocm91Z2ggdGhpcyByZWxhdGlvbi5cbiAgICAgKiBcbiAgICAgKiA8cD5UaGlzIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyByb2xlLnJlbGF0aW9uKFwicm9sZXNcIik8L3A+XG4gICAgICogXG4gICAgICogQHJldHVybiB7UGFyc2UuUmVsYXRpb259IHRoZSByZWxhdGlvbiBmb3IgdGhlIHJvbGVzIGJlbG9uZ2luZyB0byB0aGlzXG4gICAgICogICAgIHJvbGUuXG4gICAgICovXG4gICAgZ2V0Um9sZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb24oXCJyb2xlc1wiKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChcIm5hbWVcIiBpbiBhdHRycyAmJiBhdHRycy5uYW1lICE9PSB0aGlzLmdldE5hbWUoKSkge1xuICAgICAgICB2YXIgbmV3TmFtZSA9IGF0dHJzLm5hbWU7XG4gICAgICAgIGlmICh0aGlzLmlkICYmIHRoaXMuaWQgIT09IGF0dHJzLm9iamVjdElkKSB7XG4gICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBvYmplY3RJZCBiZWluZyBzZXQgbWF0Y2hlcyB0aGlzLmlkLlxuICAgICAgICAgIC8vIFRoaXMgaGFwcGVucyBkdXJpbmcgYSBmZXRjaCAtLSB0aGUgaWQgaXMgc2V0IGJlZm9yZSBjYWxsaW5nIGZldGNoLlxuICAgICAgICAgIC8vIExldCB0aGUgbmFtZSBiZSBzZXQgaW4gdGhpcyBjYXNlLlxuICAgICAgICAgIHJldHVybiBuZXcgUGFyc2UuRXJyb3IoUGFyc2UuRXJyb3IuT1RIRVJfQ0FVU0UsXG4gICAgICAgICAgICAgIFwiQSByb2xlJ3MgbmFtZSBjYW4gb25seSBiZSBzZXQgYmVmb3JlIGl0IGhhcyBiZWVuIHNhdmVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaXNTdHJpbmcobmV3TmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9USEVSX0NBVVNFLFxuICAgICAgICAgICAgICBcIkEgcm9sZSdzIG5hbWUgbXVzdCBiZSBhIFN0cmluZy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoL15bMC05YS16QS1aXFwtXyBdKyQvKS50ZXN0KG5ld05hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQYXJzZS5FcnJvcihQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgICAgXCJBIHJvbGUncyBuYW1lIGNhbiBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljIGNoYXJhY3RlcnMsIF8sXCIgK1xuICAgICAgICAgICAgICBcIiAtLCBhbmQgc3BhY2VzLlwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFBhcnNlLk9iamVjdC5wcm90b3R5cGUudmFsaWRhdGUpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLk9iamVjdC5wcm90b3R5cGUudmFsaWRhdGUuY2FsbCh0aGlzLCBhdHRycywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbn0odGhpcykpO1xuXG5cbi8qZ2xvYmFsIF86IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIHdpdGggdGhlIGdpdmVuIG1vZGVscyBhbmQgb3B0aW9ucy4gIFR5cGljYWxseSwgeW91XG4gICAqIHdpbGwgbm90IGNhbGwgdGhpcyBtZXRob2QgZGlyZWN0bHksIGJ1dCB3aWxsIGluc3RlYWQgbWFrZSBhIHN1YmNsYXNzIHVzaW5nXG4gICAqIDxjb2RlPlBhcnNlLkNvbGxlY3Rpb24uZXh0ZW5kPC9jb2RlPi5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIEFuIGFycmF5IG9mIGluc3RhbmNlcyBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAqICAgPGxpPm1vZGVsOiBUaGUgUGFyc2UuT2JqZWN0IHN1YmNsYXNzIHRoYXQgdGhpcyBjb2xsZWN0aW9uIGNvbnRhaW5zLlxuICAgKiAgIDxsaT5xdWVyeTogQW4gaW5zdGFuY2Ugb2YgUGFyc2UuUXVlcnkgdG8gdXNlIHdoZW4gZmV0Y2hpbmcgaXRlbXMuXG4gICAqICAgPGxpPmNvbXBhcmF0b3I6IEEgc3RyaW5nIHByb3BlcnR5IG5hbWUgb3IgZnVuY3Rpb24gdG8gc29ydCBieS5cbiAgICogPC91bD5cbiAgICpcbiAgICogQHNlZSBQYXJzZS5Db2xsZWN0aW9uLmV4dGVuZFxuICAgKlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+UHJvdmlkZXMgYSBzdGFuZGFyZCBjb2xsZWN0aW9uIGNsYXNzIGZvciBvdXIgc2V0cyBvZiBtb2RlbHMsIG9yZGVyZWRcbiAgICogb3IgdW5vcmRlcmVkLiAgRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGVcbiAgICogPGEgaHJlZj1cImh0dHA6Ly9kb2N1bWVudGNsb3VkLmdpdGh1Yi5jb20vYmFja2JvbmUvI0NvbGxlY3Rpb25cIj5CYWNrYm9uZVxuICAgKiBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqL1xuICBQYXJzZS5Db2xsZWN0aW9uID0gZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKG9wdGlvbnMuY29tcGFyYXRvcikge1xuICAgICAgdGhpcy5jb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5tb2RlbCkge1xuICAgICAgdGhpcy5tb2RlbCA9IG9wdGlvbnMubW9kZWw7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gb3B0aW9ucy5xdWVyeTtcbiAgICB9XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAobW9kZWxzKSB7XG4gICAgICB0aGlzLnJlc2V0KG1vZGVscywge3NpbGVudDogdHJ1ZSwgcGFyc2U6IG9wdGlvbnMucGFyc2V9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gRGVmaW5lIHRoZSBDb2xsZWN0aW9uJ3MgaW5oZXJpdGFibGUgbWV0aG9kcy5cbiAgXy5leHRlbmQoUGFyc2UuQ29sbGVjdGlvbi5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgIC8qKiBAbGVuZHMgUGFyc2UuQ29sbGVjdGlvbi5wcm90b3R5cGUgKi8ge1xuXG4gICAgLy8gVGhlIGRlZmF1bHQgbW9kZWwgZm9yIGEgY29sbGVjdGlvbiBpcyBqdXN0IGEgUGFyc2UuT2JqZWN0LlxuICAgIC8vIFRoaXMgc2hvdWxkIGJlIG92ZXJyaWRkZW4gaW4gbW9zdCBjYXNlcy5cbiAgICAvLyBUT0RPOiB0aGluayBoYXJkZXIuIHRoaXMgaXMgbGlrZWx5IHRvIGJlIHdlaXJkLlxuICAgIG1vZGVsOiBQYXJzZS5PYmplY3QsXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGlzIGFuIGVtcHR5IGZ1bmN0aW9uIGJ5IGRlZmF1bHQuIE92ZXJyaWRlIGl0IHdpdGggeW91ciBvd25cbiAgICAgKiBpbml0aWFsaXphdGlvbiBsb2dpYy5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpe30sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiBhIENvbGxlY3Rpb24gaXMgYW4gYXJyYXkgb2YgdGhlXG4gICAgICogbW9kZWxzJyBhdHRyaWJ1dGVzLlxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24obW9kZWwpeyByZXR1cm4gbW9kZWwudG9KU09OKCk7IH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBtb2RlbCwgb3IgbGlzdCBvZiBtb2RlbHMgdG8gdGhlIHNldC4gUGFzcyAqKnNpbGVudCoqIHRvIGF2b2lkXG4gICAgICogZmlyaW5nIHRoZSBgYWRkYCBldmVudCBmb3IgZXZlcnkgbmV3IG1vZGVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIEFuIGFycmF5IG9mIGluc3RhbmNlcyBvZiA8Y29kZT5QYXJzZS5PYmplY3Q8L2NvZGU+LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+YXQ6IFRoZSBpbmRleCBhdCB3aGljaCB0byBhZGQgdGhlIG1vZGVscy5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyB0aGUgYGFkZGAgZXZlbnQgZm9yIGV2ZXJ5IG5ld1xuICAgICAqICAgbW9kZWwuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIGksIGluZGV4LCBsZW5ndGgsIG1vZGVsLCBjaWQsIGlkLCBjaWRzID0ge30sIGlkcyA9IHt9O1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBtb2RlbHMgPSBfLmlzQXJyYXkobW9kZWxzKSA/IG1vZGVscy5zbGljZSgpIDogW21vZGVsc107XG5cbiAgICAgIC8vIEJlZ2luIGJ5IHR1cm5pbmcgYmFyZSBvYmplY3RzIGludG8gbW9kZWwgcmVmZXJlbmNlcywgYW5kIHByZXZlbnRpbmdcbiAgICAgIC8vIGludmFsaWQgbW9kZWxzIG9yIGR1cGxpY2F0ZSBtb2RlbHMgZnJvbSBiZWluZyBhZGRlZC5cbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG1vZGVscy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBtb2RlbHNbaV0gPSB0aGlzLl9wcmVwYXJlTW9kZWwobW9kZWxzW2ldLCBvcHRpb25zKTtcbiAgICAgICAgbW9kZWwgPSBtb2RlbHNbaV07XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBhZGQgYW4gaW52YWxpZCBtb2RlbCB0byBhIGNvbGxlY3Rpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgY2lkID0gbW9kZWwuY2lkO1xuICAgICAgICBpZiAoY2lkc1tjaWRdIHx8IHRoaXMuX2J5Q2lkW2NpZF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEdXBsaWNhdGUgY2lkOiBjYW4ndCBhZGQgdGhlIHNhbWUgbW9kZWwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvIGEgY29sbGVjdGlvbiB0d2ljZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZCA9IG1vZGVsLmlkO1xuICAgICAgICBpZiAoIVBhcnNlLl9pc051bGxPclVuZGVmaW5lZChpZCkgJiYgKGlkc1tpZF0gfHwgdGhpcy5fYnlJZFtpZF0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGlkOiBjYW4ndCBhZGQgdGhlIHNhbWUgbW9kZWwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvIGEgY29sbGVjdGlvbiB0d2ljZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZHNbaWRdID0gbW9kZWw7XG4gICAgICAgIGNpZHNbY2lkXSA9IG1vZGVsO1xuICAgICAgfVxuXG4gICAgICAvLyBMaXN0ZW4gdG8gYWRkZWQgbW9kZWxzJyBldmVudHMsIGFuZCBpbmRleCBtb2RlbHMgZm9yIGxvb2t1cCBieVxuICAgICAgLy8gYGlkYCBhbmQgYnkgYGNpZGAuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgKG1vZGVsID0gbW9kZWxzW2ldKS5vbignYWxsJywgdGhpcy5fb25Nb2RlbEV2ZW50LCB0aGlzKTtcbiAgICAgICAgdGhpcy5fYnlDaWRbbW9kZWwuY2lkXSA9IG1vZGVsO1xuICAgICAgICBpZiAobW9kZWwuaWQpIHtcbiAgICAgICAgICB0aGlzLl9ieUlkW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEluc2VydCBtb2RlbHMgaW50byB0aGUgY29sbGVjdGlvbiwgcmUtc29ydGluZyBpZiBuZWVkZWQsIGFuZCB0cmlnZ2VyaW5nXG4gICAgICAvLyBgYWRkYCBldmVudHMgdW5sZXNzIHNpbGVuY2VkLlxuICAgICAgdGhpcy5sZW5ndGggKz0gbGVuZ3RoO1xuICAgICAgaW5kZXggPSBQYXJzZS5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5hdCkgPyBcbiAgICAgICAgICB0aGlzLm1vZGVscy5sZW5ndGggOiBvcHRpb25zLmF0O1xuICAgICAgdGhpcy5tb2RlbHMuc3BsaWNlLmFwcGx5KHRoaXMubW9kZWxzLCBbaW5kZXgsIDBdLmNvbmNhdChtb2RlbHMpKTtcbiAgICAgIGlmICh0aGlzLmNvbXBhcmF0b3IpIHtcbiAgICAgICAgdGhpcy5zb3J0KHtzaWxlbnQ6IHRydWV9KTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnNpbGVudCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHRoaXMubW9kZWxzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1vZGVsID0gdGhpcy5tb2RlbHNbaV07XG4gICAgICAgIGlmIChjaWRzW21vZGVsLmNpZF0pIHtcbiAgICAgICAgICBvcHRpb25zLmluZGV4ID0gaTtcbiAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdhZGQnLCBtb2RlbCwgdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBtb2RlbCwgb3IgYSBsaXN0IG9mIG1vZGVscyBmcm9tIHRoZSBzZXQuIFBhc3Mgc2lsZW50IHRvIGF2b2lkXG4gICAgICogZmlyaW5nIHRoZSA8Y29kZT5yZW1vdmU8L2NvZGU+IGV2ZW50IGZvciBldmVyeSBtb2RlbCByZW1vdmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIFRoZSBtb2RlbCBvciBsaXN0IG9mIG1vZGVscyB0byByZW1vdmUgZnJvbSB0aGVcbiAgICAgKiAgIGNvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTogPHVsPlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgcmVtb3ZlYCBldmVudC5cbiAgICAgKiA8L3VsPlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgaSwgbCwgaW5kZXgsIG1vZGVsO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBtb2RlbHMgPSBfLmlzQXJyYXkobW9kZWxzKSA/IG1vZGVscy5zbGljZSgpIDogW21vZGVsc107XG4gICAgICBmb3IgKGkgPSAwLCBsID0gbW9kZWxzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBtb2RlbCA9IHRoaXMuZ2V0QnlDaWQobW9kZWxzW2ldKSB8fCB0aGlzLmdldChtb2RlbHNbaV0pO1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuX2J5SWRbbW9kZWwuaWRdO1xuICAgICAgICBkZWxldGUgdGhpcy5fYnlDaWRbbW9kZWwuY2lkXTtcbiAgICAgICAgaW5kZXggPSB0aGlzLmluZGV4T2YobW9kZWwpO1xuICAgICAgICB0aGlzLm1vZGVscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmxlbmd0aC0tO1xuICAgICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgb3B0aW9ucy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgIG1vZGVsLnRyaWdnZXIoJ3JlbW92ZScsIG1vZGVsLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZW1vdmVSZWZlcmVuY2UobW9kZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBtb2RlbCBmcm9tIHRoZSBzZXQgYnkgaWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBQYXJzZSBvYmplY3RJZCBpZGVudGlmeWluZyB0aGUgUGFyc2UuT2JqZWN0IHRvXG4gICAgICogZmV0Y2ggZnJvbSB0aGlzIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIGlkICYmIHRoaXMuX2J5SWRbaWQuaWQgfHwgaWRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbW9kZWwgZnJvbSB0aGUgc2V0IGJ5IGNsaWVudCBpZC5cbiAgICAgKiBAcGFyYW0ge30gY2lkIFRoZSBCYWNrYm9uZSBjb2xsZWN0aW9uIGlkIGlkZW50aWZ5aW5nIHRoZSBQYXJzZS5PYmplY3QgdG9cbiAgICAgKiBmZXRjaCBmcm9tIHRoaXMgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBnZXRCeUNpZDogZnVuY3Rpb24oY2lkKSB7XG4gICAgICByZXR1cm4gY2lkICYmIHRoaXMuX2J5Q2lkW2NpZC5jaWQgfHwgY2lkXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbW9kZWwgYXQgdGhlIGdpdmVuIGluZGV4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbW9kZWwgdG8gcmV0dXJuLlxuICAgICAqL1xuICAgIGF0OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWxzW2luZGV4XTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRm9yY2VzIHRoZSBjb2xsZWN0aW9uIHRvIHJlLXNvcnQgaXRzZWxmLiBZb3UgZG9uJ3QgbmVlZCB0byBjYWxsIHRoaXNcbiAgICAgKiB1bmRlciBub3JtYWwgY2lyY3Vtc3RhbmNlcywgYXMgdGhlIHNldCB3aWxsIG1haW50YWluIHNvcnQgb3JkZXIgYXMgZWFjaFxuICAgICAqIGl0ZW0gaXMgYWRkZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTogPHVsPlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgcmVzZXRgIGV2ZW50LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgc29ydDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAoIXRoaXMuY29tcGFyYXRvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzb3J0IGEgc2V0IHdpdGhvdXQgYSBjb21wYXJhdG9yJyk7XG4gICAgICB9XG4gICAgICB2YXIgYm91bmRDb21wYXJhdG9yID0gXy5iaW5kKHRoaXMuY29tcGFyYXRvciwgdGhpcyk7XG4gICAgICBpZiAodGhpcy5jb21wYXJhdG9yLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLm1vZGVscyA9IHRoaXMuc29ydEJ5KGJvdW5kQ29tcGFyYXRvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vZGVscy5zb3J0KGJvdW5kQ29tcGFyYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVzZXQnLCB0aGlzLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQbHVja3MgYW4gYXR0cmlidXRlIGZyb20gZWFjaCBtb2RlbCBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBUaGUgYXR0cmlidXRlIHRvIHJldHVybiBmcm9tIGVhY2ggbW9kZWwgaW4gdGhlXG4gICAgICogY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBwbHVjazogZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaXMubW9kZWxzLCBmdW5jdGlvbihtb2RlbCl7IHJldHVybiBtb2RlbC5nZXQoYXR0cik7IH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHlvdSBoYXZlIG1vcmUgaXRlbXMgdGhhbiB5b3Ugd2FudCB0byBhZGQgb3IgcmVtb3ZlIGluZGl2aWR1YWxseSxcbiAgICAgKiB5b3UgY2FuIHJlc2V0IHRoZSBlbnRpcmUgc2V0IHdpdGggYSBuZXcgbGlzdCBvZiBtb2RlbHMsIHdpdGhvdXQgZmlyaW5nXG4gICAgICogYW55IGBhZGRgIG9yIGByZW1vdmVgIGV2ZW50cy4gRmlyZXMgYHJlc2V0YCB3aGVuIGZpbmlzaGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzIFRoZSBtb2RlbCBvciBsaXN0IG9mIG1vZGVscyB0byByZW1vdmUgZnJvbSB0aGVcbiAgICAgKiAgIGNvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTogPHVsPlxuICAgICAqICAgPGxpPnNpbGVudDogU2V0IHRvIHRydWUgdG8gYXZvaWQgZmlyaW5nIHRoZSBgcmVzZXRgIGV2ZW50LlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgbW9kZWxzID0gbW9kZWxzIHx8IFtdO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKHRoaXMubW9kZWxzLCBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBzZWxmLl9yZW1vdmVSZWZlcmVuY2UobW9kZWwpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgdGhpcy5hZGQobW9kZWxzLCB7c2lsZW50OiB0cnVlLCBwYXJzZTogb3B0aW9ucy5wYXJzZX0pO1xuICAgICAgaWYgKCFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3Jlc2V0JywgdGhpcywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgZGVmYXVsdCBzZXQgb2YgbW9kZWxzIGZvciB0aGlzIGNvbGxlY3Rpb24sIHJlc2V0dGluZyB0aGVcbiAgICAgKiBjb2xsZWN0aW9uIHdoZW4gdGhleSBhcnJpdmUuIElmIGBhZGQ6IHRydWVgIGlzIHBhc3NlZCwgYXBwZW5kcyB0aGVcbiAgICAgKiBtb2RlbHMgdG8gdGhlIGNvbGxlY3Rpb24gaW5zdGVhZCBvZiByZXNldHRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyBgYWRkYCBvciBgcmVzZXRgIGV2ZW50cyBmb3JcbiAgICAgKiAgIG1vZGVscyBmZXRjaGVkIGJ5IHRoaXMgZmV0Y2guXG4gICAgICogICA8bGk+c3VjY2VzczogQSBCYWNrYm9uZS1zdHlsZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgdXNlcyB0aGUgTWFzdGVyIEtleSBmb3JcbiAgICAgKiAgICAgICB0aGlzIHJlcXVlc3QuXG4gICAgICogICA8bGk+c2Vzc2lvblRva2VuOiBBIHZhbGlkIHNlc3Npb24gdG9rZW4sIHVzZWQgZm9yIG1ha2luZyBhIHJlcXVlc3Qgb25cbiAgICAgKiAgICAgICBiZWhhbGYgb2YgYSBzcGVjaWZpYyB1c2VyLlxuICAgICAqIDwvdWw+XG4gICAgICovXG4gICAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpIHx8IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyc2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRpb25zLnBhcnNlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcztcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnkgfHwgbmV3IFBhcnNlLlF1ZXJ5KHRoaXMubW9kZWwpO1xuICAgICAgcmV0dXJuIHF1ZXJ5LmZpbmQoe1xuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBzZXNzaW9uVG9rZW46IG9wdGlvbnMuc2Vzc2lvblRva2VuXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYWRkKSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5hZGQocmVzdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5yZXNldChyZXN1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGEgbW9kZWwgaW4gdGhpcyBjb2xsZWN0aW9uLiBBZGQgdGhlIG1vZGVsIHRvXG4gICAgICogdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHksIHVubGVzcyBgd2FpdDogdHJ1ZWAgaXMgcGFzc2VkLCBpbiB3aGljaCBjYXNlXG4gICAgICogd2Ugd2FpdCBmb3IgdGhlIHNlcnZlciB0byBhZ3JlZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGFyc2UuT2JqZWN0fSBtb2RlbCBUaGUgbmV3IG1vZGVsIHRvIGNyZWF0ZSBhbmQgYWRkIHRvIHRoZVxuICAgICAqICAgY29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvcHRpb25hbCBvYmplY3Qgd2l0aCBCYWNrYm9uZS1zdHlsZSBvcHRpb25zLlxuICAgICAqIFZhbGlkIG9wdGlvbnMgYXJlOjx1bD5cbiAgICAgKiAgIDxsaT53YWl0OiBTZXQgdG8gdHJ1ZSB0byB3YWl0IGZvciB0aGUgc2VydmVyIHRvIGNvbmZpcm0gY3JlYXRpb24gb2YgdGhlXG4gICAgICogICAgICAgbW9kZWwgYmVmb3JlIGFkZGluZyBpdCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiAgIDxsaT5zaWxlbnQ6IFNldCB0byB0cnVlIHRvIGF2b2lkIGZpcmluZyBhbiBgYWRkYCBldmVudC5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBBIEJhY2tib25lLXN0eWxlIHN1Y2Nlc3MgY2FsbGJhY2suXG4gICAgICogICA8bGk+ZXJyb3I6IEFuIEJhY2tib25lLXN0eWxlIGVycm9yIGNhbGxiYWNrLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCB1c2VzIHRoZSBNYXN0ZXIgS2V5IGZvclxuICAgICAqICAgICAgIHRoaXMgcmVxdWVzdC5cbiAgICAgKiAgIDxsaT5zZXNzaW9uVG9rZW46IEEgdmFsaWQgc2Vzc2lvbiB0b2tlbiwgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdCBvblxuICAgICAqICAgICAgIGJlaGFsZiBvZiBhIHNwZWNpZmljIHVzZXIuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG4gICAgICB2YXIgY29sbCA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcbiAgICAgIG1vZGVsID0gdGhpcy5fcHJlcGFyZU1vZGVsKG1vZGVsLCBvcHRpb25zKTtcbiAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFvcHRpb25zLndhaXQpIHtcbiAgICAgICAgY29sbC5hZGQobW9kZWwsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdmFyIHN1Y2Nlc3MgPSBvcHRpb25zLnN1Y2Nlc3M7XG4gICAgICBvcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihuZXh0TW9kZWwsIHJlc3AsIHhocikge1xuICAgICAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAgICAgY29sbC5hZGQobmV4dE1vZGVsLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgIHN1Y2Nlc3MobmV4dE1vZGVsLCByZXNwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXh0TW9kZWwudHJpZ2dlcignc3luYycsIG1vZGVsLCByZXNwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIG1vZGVsLnNhdmUobnVsbCwgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gbW9kZWw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgcmVzcG9uc2UgaW50byBhIGxpc3Qgb2YgbW9kZWxzIHRvIGJlIGFkZGVkIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGlzIGp1c3QgdG8gcGFzcyBpdCB0aHJvdWdoLlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzcCwgeGhyKSB7XG4gICAgICByZXR1cm4gcmVzcDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJveHkgdG8gXydzIGNoYWluLiBDYW4ndCBiZSBwcm94aWVkIHRoZSBzYW1lIHdheSB0aGUgcmVzdCBvZiB0aGVcbiAgICAgKiB1bmRlcnNjb3JlIG1ldGhvZHMgYXJlIHByb3hpZWQgYmVjYXVzZSBpdCByZWxpZXMgb24gdGhlIHVuZGVyc2NvcmVcbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBjaGFpbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXyh0aGlzLm1vZGVscykuY2hhaW4oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgYWxsIGludGVybmFsIHN0YXRlLiBDYWxsZWQgd2hlbiB0aGUgY29sbGVjdGlvbiBpcyByZXNldC5cbiAgICAgKi9cbiAgICBfcmVzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMubW9kZWxzID0gW107XG4gICAgICB0aGlzLl9ieUlkICA9IHt9O1xuICAgICAgdGhpcy5fYnlDaWQgPSB7fTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJlcGFyZSBhIG1vZGVsIG9yIGhhc2ggb2YgYXR0cmlidXRlcyB0byBiZSBhZGRlZCB0byB0aGlzIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgX3ByZXBhcmVNb2RlbDogZnVuY3Rpb24obW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghKG1vZGVsIGluc3RhbmNlb2YgUGFyc2UuT2JqZWN0KSkge1xuICAgICAgICB2YXIgYXR0cnMgPSBtb2RlbDtcbiAgICAgICAgb3B0aW9ucy5jb2xsZWN0aW9uID0gdGhpcztcbiAgICAgICAgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbChhdHRycywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghbW9kZWwuX3ZhbGlkYXRlKG1vZGVsLmF0dHJpYnV0ZXMsIG9wdGlvbnMpKSB7XG4gICAgICAgICAgbW9kZWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghbW9kZWwuY29sbGVjdGlvbikge1xuICAgICAgICBtb2RlbC5jb2xsZWN0aW9uID0gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHRvIHJlbW92ZSBhIG1vZGVsJ3MgdGllcyB0byBhIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgX3JlbW92ZVJlZmVyZW5jZTogZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgIGlmICh0aGlzID09PSBtb2RlbC5jb2xsZWN0aW9uKSB7XG4gICAgICAgIGRlbGV0ZSBtb2RlbC5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgbW9kZWwub2ZmKCdhbGwnLCB0aGlzLl9vbk1vZGVsRXZlbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgY2FsbGVkIGV2ZXJ5IHRpbWUgYSBtb2RlbCBpbiB0aGUgc2V0IGZpcmVzIGFuIGV2ZW50LlxuICAgICAqIFNldHMgbmVlZCB0byB1cGRhdGUgdGhlaXIgaW5kZXhlcyB3aGVuIG1vZGVscyBjaGFuZ2UgaWRzLiBBbGwgb3RoZXJcbiAgICAgKiBldmVudHMgc2ltcGx5IHByb3h5IHRocm91Z2guIFwiYWRkXCIgYW5kIFwicmVtb3ZlXCIgZXZlbnRzIHRoYXQgb3JpZ2luYXRlXG4gICAgICogaW4gb3RoZXIgY29sbGVjdGlvbnMgYXJlIGlnbm9yZWQuXG4gICAgICovXG4gICAgX29uTW9kZWxFdmVudDogZnVuY3Rpb24oZXYsIG1vZGVsLCBjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgICBpZiAoKGV2ID09PSAnYWRkJyB8fCBldiA9PT0gJ3JlbW92ZScpICYmIGNvbGxlY3Rpb24gIT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGV2ID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUobW9kZWwsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGVsICYmIGV2ID09PSAnY2hhbmdlOm9iamVjdElkJykge1xuICAgICAgICBkZWxldGUgdGhpcy5fYnlJZFttb2RlbC5wcmV2aW91cyhcIm9iamVjdElkXCIpXTtcbiAgICAgICAgdGhpcy5fYnlJZFttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgIH1cbiAgICAgIHRoaXMudHJpZ2dlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBVbmRlcnNjb3JlIG1ldGhvZHMgdGhhdCB3ZSB3YW50IHRvIGltcGxlbWVudCBvbiB0aGUgQ29sbGVjdGlvbi5cbiAgdmFyIG1ldGhvZHMgPSBbJ2ZvckVhY2gnLCAnZWFjaCcsICdtYXAnLCAncmVkdWNlJywgJ3JlZHVjZVJpZ2h0JywgJ2ZpbmQnLFxuICAgICdkZXRlY3QnLCAnZmlsdGVyJywgJ3NlbGVjdCcsICdyZWplY3QnLCAnZXZlcnknLCAnYWxsJywgJ3NvbWUnLCAnYW55JyxcbiAgICAnaW5jbHVkZScsICdjb250YWlucycsICdpbnZva2UnLCAnbWF4JywgJ21pbicsICdzb3J0QnknLCAnc29ydGVkSW5kZXgnLFxuICAgICd0b0FycmF5JywgJ3NpemUnLCAnZmlyc3QnLCAnaW5pdGlhbCcsICdyZXN0JywgJ2xhc3QnLCAnd2l0aG91dCcsICdpbmRleE9mJyxcbiAgICAnc2h1ZmZsZScsICdsYXN0SW5kZXhPZicsICdpc0VtcHR5JywgJ2dyb3VwQnknXTtcblxuICAvLyBNaXggaW4gZWFjaCBVbmRlcnNjb3JlIG1ldGhvZCBhcyBhIHByb3h5IHRvIGBDb2xsZWN0aW9uI21vZGVsc2AuXG4gIFBhcnNlLl9hcnJheUVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgUGFyc2UuQ29sbGVjdGlvbi5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9bbWV0aG9kXS5hcHBseShfLCBbdGhpcy5tb2RlbHNdLmNvbmNhdChfLnRvQXJyYXkoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHN1YmNsYXNzIG9mIDxjb2RlPlBhcnNlLkNvbGxlY3Rpb248L2NvZGU+LiAgRm9yIGV4YW1wbGUsPHByZT5cbiAgICogICB2YXIgTXlDb2xsZWN0aW9uID0gUGFyc2UuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgKiAgICAgLy8gSW5zdGFuY2UgcHJvcGVydGllc1xuICAgKlxuICAgKiAgICAgbW9kZWw6IE15Q2xhc3MsXG4gICAqICAgICBxdWVyeTogTXlRdWVyeSxcbiAgICpcbiAgICogICAgIGdldEZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICogICAgICAgcmV0dXJuIHRoaXMuYXQoMCk7XG4gICAqICAgICB9XG4gICAqICAgfSwge1xuICAgKiAgICAgLy8gQ2xhc3MgcHJvcGVydGllc1xuICAgKlxuICAgKiAgICAgbWFrZU9uZTogZnVuY3Rpb24oKSB7XG4gICAqICAgICAgIHJldHVybiBuZXcgTXlDb2xsZWN0aW9uKCk7XG4gICAqICAgICB9XG4gICAqICAgfSk7XG4gICAqXG4gICAqICAgdmFyIGNvbGxlY3Rpb24gPSBuZXcgTXlDb2xsZWN0aW9uKCk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlUHJvcHMgSW5zdGFuY2UgcHJvcGVydGllcyBmb3IgdGhlIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc1Byb3BzIENsYXNzIHByb3BlcmllcyBmb3IgdGhlIGNvbGxlY3Rpb24uXG4gICAqIEByZXR1cm4ge0NsYXNzfSBBIG5ldyBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5Db2xsZWN0aW9uPC9jb2RlPi5cbiAgICovXG4gIFBhcnNlLkNvbGxlY3Rpb24uZXh0ZW5kID0gUGFyc2UuX2V4dGVuZDtcblxufSh0aGlzKSk7XG5cbi8qZ2xvYmFsIF86IGZhbHNlLCBkb2N1bWVudDogZmFsc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIENyZWF0aW5nIGEgUGFyc2UuVmlldyBjcmVhdGVzIGl0cyBpbml0aWFsIGVsZW1lbnQgb3V0c2lkZSBvZiB0aGUgRE9NLFxuICAgKiBpZiBhbiBleGlzdGluZyBlbGVtZW50IGlzIG5vdCBwcm92aWRlZC4uLlxuICAgKiBAY2xhc3NcbiAgICpcbiAgICogPHA+QSBmb3JrIG9mIEJhY2tib25lLlZpZXcsIHByb3ZpZGVkIGZvciB5b3VyIGNvbnZlbmllbmNlLiAgSWYgeW91IHVzZSB0aGlzXG4gICAqIGNsYXNzLCB5b3UgbXVzdCBhbHNvIGluY2x1ZGUgalF1ZXJ5LCBvciBhbm90aGVyIGxpYnJhcnkgdGhhdCBwcm92aWRlcyBhXG4gICAqIGpRdWVyeS1jb21wYXRpYmxlICQgZnVuY3Rpb24uICBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZVxuICAgKiA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jVmlld1wiPkJhY2tib25lXG4gICAqIGRvY3VtZW50YXRpb248L2E+LjwvcD5cbiAgICogPHA+PHN0cm9uZz48ZW0+QXZhaWxhYmxlIGluIHRoZSBjbGllbnQgU0RLIG9ubHkuPC9lbT48L3N0cm9uZz48L3A+XG4gICAqL1xuICBQYXJzZS5WaWV3ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMuY2lkID0gXy51bmlxdWVJZCgndmlldycpO1xuICAgIHRoaXMuX2NvbmZpZ3VyZShvcHRpb25zIHx8IHt9KTtcbiAgICB0aGlzLl9lbnN1cmVFbGVtZW50KCk7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuICB9O1xuXG4gIC8vIENhY2hlZCByZWdleCB0byBzcGxpdCBrZXlzIGZvciBgZGVsZWdhdGVgLlxuICB2YXIgZXZlbnRTcGxpdHRlciA9IC9eKFxcUyspXFxzKiguKikkLztcblxuICAvLyBMaXN0IG9mIHZpZXcgb3B0aW9ucyB0byBiZSBtZXJnZWQgYXMgcHJvcGVydGllcy5cbiAgLy8gVE9ETzogaW5jbHVkZSBvYmplY3RJZCwgY3JlYXRlZEF0LCB1cGRhdGVkQXQ/XG4gIHZhciB2aWV3T3B0aW9ucyA9IFsnbW9kZWwnLCAnY29sbGVjdGlvbicsICdlbCcsICdpZCcsICdhdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICdjbGFzc05hbWUnLCAndGFnTmFtZSddO1xuXG4gIC8vIFNldCB1cCBhbGwgaW5oZXJpdGFibGUgKipQYXJzZS5WaWV3KiogcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbiAgXy5leHRlbmQoUGFyc2UuVmlldy5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgICAgICAgLyoqIEBsZW5kcyBQYXJzZS5WaWV3LnByb3RvdHlwZSAqLyB7XG5cbiAgICAvLyBUaGUgZGVmYXVsdCBgdGFnTmFtZWAgb2YgYSBWaWV3J3MgZWxlbWVudCBpcyBgXCJkaXZcImAuXG4gICAgdGFnTmFtZTogJ2RpdicsXG5cbiAgICAvKipcbiAgICAgKiBqUXVlcnkgZGVsZWdhdGUgZm9yIGVsZW1lbnQgbG9va3VwLCBzY29wZWQgdG8gRE9NIGVsZW1lbnRzIHdpdGhpbiB0aGVcbiAgICAgKiBjdXJyZW50IHZpZXcuIFRoaXMgc2hvdWxkIGJlIHByZWZlcmVkIHRvIGdsb2JhbCBsb29rdXBzIHdoZXJlIHBvc3NpYmxlLlxuICAgICAqL1xuICAgICQ6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy4kZWwuZmluZChzZWxlY3Rvcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuICAgICAqIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8qKlxuICAgICAqIFRoZSBjb3JlIGZ1bmN0aW9uIHRoYXQgeW91ciB2aWV3IHNob3VsZCBvdmVycmlkZSwgaW4gb3JkZXJcbiAgICAgKiB0byBwb3B1bGF0ZSBpdHMgZWxlbWVudCAoYHRoaXMuZWxgKSwgd2l0aCB0aGUgYXBwcm9wcmlhdGUgSFRNTC4gVGhlXG4gICAgICogY29udmVudGlvbiBpcyBmb3IgKipyZW5kZXIqKiB0byBhbHdheXMgcmV0dXJuIGB0aGlzYC5cbiAgICAgKi9cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGlzIHZpZXcgZnJvbSB0aGUgRE9NLiBOb3RlIHRoYXQgdGhlIHZpZXcgaXNuJ3QgcHJlc2VudCBpbiB0aGVcbiAgICAgKiBET00gYnkgZGVmYXVsdCwgc28gY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgYmUgYSBuby1vcC5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRm9yIHNtYWxsIGFtb3VudHMgb2YgRE9NIEVsZW1lbnRzLCB3aGVyZSBhIGZ1bGwtYmxvd24gdGVtcGxhdGUgaXNuJ3RcbiAgICAgKiBuZWVkZWQsIHVzZSAqKm1ha2UqKiB0byBtYW51ZmFjdHVyZSBlbGVtZW50cywgb25lIGF0IGEgdGltZS5cbiAgICAgKiA8cHJlPlxuICAgICAqICAgICB2YXIgZWwgPSB0aGlzLm1ha2UoJ2xpJywgeydjbGFzcyc6ICdyb3cnfSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZXNjYXBlKCd0aXRsZScpKTs8L3ByZT5cbiAgICAgKi9cbiAgICBtYWtlOiBmdW5jdGlvbih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjb250ZW50KSB7XG4gICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgUGFyc2UuJChlbCkuYXR0cihhdHRyaWJ1dGVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIFBhcnNlLiQoZWwpLmh0bWwoY29udGVudCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHZpZXcncyBlbGVtZW50IChgdGhpcy5lbGAgcHJvcGVydHkpLCBpbmNsdWRpbmcgZXZlbnRcbiAgICAgKiByZS1kZWxlZ2F0aW9uLlxuICAgICAqL1xuICAgIHNldEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGRlbGVnYXRlKSB7XG4gICAgICB0aGlzLiRlbCA9IFBhcnNlLiQoZWxlbWVudCk7XG4gICAgICB0aGlzLmVsID0gdGhpcy4kZWxbMF07XG4gICAgICBpZiAoZGVsZWdhdGUgIT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgY2FsbGJhY2tzLiAgPGNvZGU+dGhpcy5ldmVudHM8L2NvZGU+IGlzIGEgaGFzaCBvZlxuICAgICAqIDxwcmU+XG4gICAgICogKntcImV2ZW50IHNlbGVjdG9yXCI6IFwiY2FsbGJhY2tcIn0qXG4gICAgICpcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICdtb3VzZWRvd24gLnRpdGxlJzogICdlZGl0JyxcbiAgICAgKiAgICAgICAnY2xpY2sgLmJ1dHRvbic6ICAgICAnc2F2ZSdcbiAgICAgKiAgICAgICAnY2xpY2sgLm9wZW4nOiAgICAgICBmdW5jdGlvbihlKSB7IC4uLiB9XG4gICAgICogICAgIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKiBwYWlycy4gQ2FsbGJhY2tzIHdpbGwgYmUgYm91bmQgdG8gdGhlIHZpZXcsIHdpdGggYHRoaXNgIHNldCBwcm9wZXJseS5cbiAgICAgKiBVc2VzIGV2ZW50IGRlbGVnYXRpb24gZm9yIGVmZmljaWVuY3kuXG4gICAgICogT21pdHRpbmcgdGhlIHNlbGVjdG9yIGJpbmRzIHRoZSBldmVudCB0byBgdGhpcy5lbGAuXG4gICAgICogVGhpcyBvbmx5IHdvcmtzIGZvciBkZWxlZ2F0ZS1hYmxlIGV2ZW50czogbm90IGBmb2N1c2AsIGBibHVyYCwgYW5kXG4gICAgICogbm90IGBjaGFuZ2VgLCBgc3VibWl0YCwgYW5kIGByZXNldGAgaW4gSW50ZXJuZXQgRXhwbG9yZXIuXG4gICAgICovXG4gICAgZGVsZWdhdGVFdmVudHM6IGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgZXZlbnRzID0gZXZlbnRzIHx8IFBhcnNlLl9nZXRWYWx1ZSh0aGlzLCAnZXZlbnRzJyk7XG4gICAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKGV2ZW50cywgZnVuY3Rpb24obWV0aG9kLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24obWV0aG9kKSkge1xuICAgICAgICAgIG1ldGhvZCA9IHNlbGZbZXZlbnRzW2tleV1dO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBcIicgKyBldmVudHNba2V5XSArICdcIiBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXRjaCA9IGtleS5tYXRjaChldmVudFNwbGl0dGVyKTtcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IG1hdGNoWzFdLCBzZWxlY3RvciA9IG1hdGNoWzJdO1xuICAgICAgICBtZXRob2QgPSBfLmJpbmQobWV0aG9kLCBzZWxmKTtcbiAgICAgICAgZXZlbnROYW1lICs9ICcuZGVsZWdhdGVFdmVudHMnICsgc2VsZi5jaWQ7XG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gJycpIHtcbiAgICAgICAgICBzZWxmLiRlbC5iaW5kKGV2ZW50TmFtZSwgbWV0aG9kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLiRlbC5kZWxlZ2F0ZShzZWxlY3RvciwgZXZlbnROYW1lLCBtZXRob2QpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXJzIGFsbCBjYWxsYmFja3MgcHJldmlvdXNseSBib3VuZCB0byB0aGUgdmlldyB3aXRoIGBkZWxlZ2F0ZUV2ZW50c2AuXG4gICAgICogWW91IHVzdWFsbHkgZG9uJ3QgbmVlZCB0byB1c2UgdGhpcywgYnV0IG1heSB3aXNoIHRvIGlmIHlvdSBoYXZlIG11bHRpcGxlXG4gICAgICogQmFja2JvbmUgdmlld3MgYXR0YWNoZWQgdG8gdGhlIHNhbWUgRE9NIGVsZW1lbnQuXG4gICAgICovXG4gICAgdW5kZWxlZ2F0ZUV2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLiRlbC51bmJpbmQoJy5kZWxlZ2F0ZUV2ZW50cycgKyB0aGlzLmNpZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24gb2YgYSBWaWV3IHdpdGggYSBzZXQgb2Ygb3B0aW9ucy5cbiAgICAgKiBLZXlzIHdpdGggc3BlY2lhbCBtZWFuaW5nICoobW9kZWwsIGNvbGxlY3Rpb24sIGlkLCBjbGFzc05hbWUpKiwgYXJlXG4gICAgICogYXR0YWNoZWQgZGlyZWN0bHkgdG8gdGhlIHZpZXcuXG4gICAgICovXG4gICAgX2NvbmZpZ3VyZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBfLmVhY2godmlld09wdGlvbnMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgaWYgKG9wdGlvbnNbYXR0cl0pIHtcbiAgICAgICAgICBzZWxmW2F0dHJdID0gb3B0aW9uc1thdHRyXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhhdCB0aGUgVmlldyBoYXMgYSBET00gZWxlbWVudCB0byByZW5kZXIgaW50by5cbiAgICAgKiBJZiBgdGhpcy5lbGAgaXMgYSBzdHJpbmcsIHBhc3MgaXQgdGhyb3VnaCBgJCgpYCwgdGFrZSB0aGUgZmlyc3RcbiAgICAgKiBtYXRjaGluZyBlbGVtZW50LCBhbmQgcmUtYXNzaWduIGl0IHRvIGBlbGAuIE90aGVyd2lzZSwgY3JlYXRlXG4gICAgICogYW4gZWxlbWVudCBmcm9tIHRoZSBgaWRgLCBgY2xhc3NOYW1lYCBhbmQgYHRhZ05hbWVgIHByb3BlcnRpZXMuXG4gICAgICovXG4gICAgX2Vuc3VyZUVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLmVsKSB7XG4gICAgICAgIHZhciBhdHRycyA9IFBhcnNlLl9nZXRWYWx1ZSh0aGlzLCAnYXR0cmlidXRlcycpIHx8IHt9O1xuICAgICAgICBpZiAodGhpcy5pZCkge1xuICAgICAgICAgIGF0dHJzLmlkID0gdGhpcy5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jbGFzc05hbWUpIHtcbiAgICAgICAgICBhdHRyc1snY2xhc3MnXSA9IHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLm1ha2UodGhpcy50YWdOYW1lLCBhdHRycyksIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLmVsLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlUHJvcHMgSW5zdGFuY2UgcHJvcGVydGllcyBmb3IgdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc1Byb3BzIENsYXNzIHByb3BlcmllcyBmb3IgdGhlIHZpZXcuXG4gICAqIEByZXR1cm4ge0NsYXNzfSBBIG5ldyBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5WaWV3PC9jb2RlPi5cbiAgICovXG4gIFBhcnNlLlZpZXcuZXh0ZW5kID0gUGFyc2UuX2V4dGVuZDtcblxufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5BIFBhcnNlLlVzZXIgb2JqZWN0IGlzIGEgbG9jYWwgcmVwcmVzZW50YXRpb24gb2YgYSB1c2VyIHBlcnNpc3RlZCB0byB0aGVcbiAgICogUGFyc2UgY2xvdWQuIFRoaXMgY2xhc3MgaXMgYSBzdWJjbGFzcyBvZiBhIFBhcnNlLk9iamVjdCwgYW5kIHJldGFpbnMgdGhlXG4gICAqIHNhbWUgZnVuY3Rpb25hbGl0eSBvZiBhIFBhcnNlLk9iamVjdCwgYnV0IGFsc28gZXh0ZW5kcyBpdCB3aXRoIHZhcmlvdXNcbiAgICogdXNlciBzcGVjaWZpYyBtZXRob2RzLCBsaWtlIGF1dGhlbnRpY2F0aW9uLCBzaWduaW5nIHVwLCBhbmQgdmFsaWRhdGlvbiBvZlxuICAgKiB1bmlxdWVuZXNzLjwvcD5cbiAgICovXG4gIFBhcnNlLlVzZXIgPSBQYXJzZS5PYmplY3QuZXh0ZW5kKFwiX1VzZXJcIiwgLyoqIEBsZW5kcyBQYXJzZS5Vc2VyLnByb3RvdHlwZSAqLyB7XG4gICAgLy8gSW5zdGFuY2UgVmFyaWFibGVzXG4gICAgX2lzQ3VycmVudFVzZXI6IGZhbHNlLFxuXG5cbiAgICAvLyBJbnN0YW5jZSBNZXRob2RzXG4gICAgXG4gICAgLyoqXG4gICAgICogTWVyZ2VzIGFub3RoZXIgb2JqZWN0J3MgYXR0cmlidXRlcyBpbnRvIHRoaXMgb2JqZWN0LlxuICAgICAqL1xuICAgIF9tZXJnZUZyb21PYmplY3Q6IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICBpZiAob3RoZXIuZ2V0U2Vzc2lvblRva2VuKCkpIHtcbiAgICAgICAgdGhpcy5fc2Vzc2lvblRva2VuID0gb3RoZXIuZ2V0U2Vzc2lvblRva2VuKCk7ICAgICAgXG4gICAgICB9ICAgIFxuICAgICAgUGFyc2UuVXNlci5fX3N1cGVyX18uX21lcmdlRnJvbU9iamVjdC5jYWxsKHRoaXMsIG90aGVyKTtcbiAgICB9LCAgICBcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0byBoYW5kbGUgc3BlY2lhbCBmaWVsZHMgaW4gYSBfVXNlciByZXNwb25zZS5cbiAgICAgKi9cbiAgICBfbWVyZ2VNYWdpY0ZpZWxkczogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgIGlmIChhdHRycy5zZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgdGhpcy5fc2Vzc2lvblRva2VuID0gYXR0cnMuc2Vzc2lvblRva2VuO1xuICAgICAgICBkZWxldGUgYXR0cnMuc2Vzc2lvblRva2VuO1xuICAgICAgfVxuICAgICAgUGFyc2UuVXNlci5fX3N1cGVyX18uX21lcmdlTWFnaWNGaWVsZHMuY2FsbCh0aGlzLCBhdHRycyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgbnVsbCB2YWx1ZXMgZnJvbSBhdXRoRGF0YSAod2hpY2ggZXhpc3QgdGVtcG9yYXJpbHkgZm9yXG4gICAgICogdW5saW5raW5nKVxuICAgICAqL1xuICAgIF9jbGVhbnVwQXV0aERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpO1xuICAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmdldCgnYXV0aERhdGEnKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIWF1dGhEYXRhW2tleV0pIHtcbiAgICAgICAgICBkZWxldGUgYXV0aERhdGFba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplcyBhdXRoRGF0YSBmb3IgYWxsIHByb3ZpZGVycy5cbiAgICAgKi9cbiAgICBfc3luY2hyb25pemVBbGxBdXRoRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKTtcbiAgICAgIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLmdldCgnYXV0aERhdGEnKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBzZWxmLl9zeW5jaHJvbml6ZUF1dGhEYXRhKGtleSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemVzIGF1dGggZGF0YSBmb3IgYSBwcm92aWRlciAoZS5nLiBwdXRzIHRoZSBhY2Nlc3MgdG9rZW4gaW4gdGhlXG4gICAgICogcmlnaHQgcGxhY2UgdG8gYmUgdXNlZCBieSB0aGUgRmFjZWJvb2sgU0RLKS5cbiAgICAgKi9cbiAgICBfc3luY2hyb25pemVBdXRoRGF0YTogZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIGlmICghdGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgYXV0aFR5cGU7XG4gICAgICBpZiAoXy5pc1N0cmluZyhwcm92aWRlcikpIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlcjtcbiAgICAgICAgcHJvdmlkZXIgPSBQYXJzZS5Vc2VyLl9hdXRoUHJvdmlkZXJzW2F1dGhUeXBlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXIuZ2V0QXV0aFR5cGUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpO1xuICAgICAgaWYgKCFhdXRoRGF0YSB8fCAhcHJvdmlkZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHN1Y2Nlc3MgPSBwcm92aWRlci5yZXN0b3JlQXV0aGVudGljYXRpb24oYXV0aERhdGFbYXV0aFR5cGVdKTtcbiAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICB0aGlzLl91bmxpbmtGcm9tKHByb3ZpZGVyKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZVNhdmVSZXN1bHQ6IGZ1bmN0aW9uKG1ha2VDdXJyZW50KSB7XG4gICAgICAvLyBDbGVhbiB1cCBhbmQgc3luY2hyb25pemUgdGhlIGF1dGhEYXRhIG9iamVjdCwgcmVtb3ZpbmcgYW55IHVuc2V0IHZhbHVlc1xuICAgICAgaWYgKG1ha2VDdXJyZW50KSB7XG4gICAgICAgIHRoaXMuX2lzQ3VycmVudFVzZXIgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xlYW51cEF1dGhEYXRhKCk7XG4gICAgICB0aGlzLl9zeW5jaHJvbml6ZUFsbEF1dGhEYXRhKCk7XG4gICAgICAvLyBEb24ndCBrZWVwIHRoZSBwYXNzd29yZCBhcm91bmQuXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmVyRGF0YS5wYXNzd29yZDtcbiAgICAgIHRoaXMuX3JlYnVpbGRFc3RpbWF0ZWREYXRhRm9yS2V5KFwicGFzc3dvcmRcIik7XG4gICAgICB0aGlzLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgIGlmIChtYWtlQ3VycmVudCB8fCB0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgIFBhcnNlLlVzZXIuX3NhdmVDdXJyZW50VXNlcih0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5saWtlIGluIHRoZSBBbmRyb2lkL2lPUyBTREtzLCBsb2dJbldpdGggaXMgdW5uZWNlc3NhcnksIHNpbmNlIHlvdSBjYW5cbiAgICAgKiBjYWxsIGxpbmtXaXRoIG9uIHRoZSB1c2VyIChldmVuIGlmIGl0IGRvZXNuJ3QgZXhpc3QgeWV0IG9uIHRoZSBzZXJ2ZXIpLlxuICAgICAqL1xuICAgIF9saW5rV2l0aDogZnVuY3Rpb24ocHJvdmlkZXIsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdXRoVHlwZTtcbiAgICAgIGlmIChfLmlzU3RyaW5nKHByb3ZpZGVyKSkge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyO1xuICAgICAgICBwcm92aWRlciA9IFBhcnNlLlVzZXIuX2F1dGhQcm92aWRlcnNbcHJvdmlkZXJdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlci5nZXRBdXRoVHlwZSgpO1xuICAgICAgfVxuICAgICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhdXRoRGF0YScpKSB7XG4gICAgICAgIHZhciBhdXRoRGF0YSA9IHRoaXMuZ2V0KCdhdXRoRGF0YScpIHx8IHt9O1xuICAgICAgICBhdXRoRGF0YVthdXRoVHlwZV0gPSBvcHRpb25zLmF1dGhEYXRhO1xuICAgICAgICB0aGlzLnNldCgnYXV0aERhdGEnLCBhdXRoRGF0YSk7XG5cbiAgICAgICAgLy8gT3ZlcnJpZGRlbiBzbyB0aGF0IHRoZSB1c2VyIGNhbiBiZSBtYWRlIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgICAgbmV3T3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdCh0cnVlKTtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLnNhdmUoeydhdXRoRGF0YSc6IGF1dGhEYXRhfSwgbmV3T3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IFBhcnNlLlByb21pc2UoKTtcbiAgICAgICAgcHJvdmlkZXIuYXV0aGVudGljYXRlKHtcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihwcm92aWRlciwgcmVzdWx0KSB7XG4gICAgICAgICAgICBzZWxmLl9saW5rV2l0aChwcm92aWRlciwge1xuICAgICAgICAgICAgICBhdXRoRGF0YTogcmVzdWx0LFxuICAgICAgICAgICAgICBzdWNjZXNzOiBvcHRpb25zLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgIGVycm9yOiBvcHRpb25zLmVycm9yXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoc2VsZik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihwcm92aWRlciwgZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3Ioc2VsZiwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmxpbmtzIGEgdXNlciBmcm9tIGEgc2VydmljZS5cbiAgICAgKi9cbiAgICBfdW5saW5rRnJvbTogZnVuY3Rpb24ocHJvdmlkZXIsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdXRoVHlwZTtcbiAgICAgIGlmIChfLmlzU3RyaW5nKHByb3ZpZGVyKSkge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyO1xuICAgICAgICBwcm92aWRlciA9IFBhcnNlLlVzZXIuX2F1dGhQcm92aWRlcnNbcHJvdmlkZXJdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFR5cGUgPSBwcm92aWRlci5nZXRBdXRoVHlwZSgpO1xuICAgICAgfVxuICAgICAgdmFyIG5ld09wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgbmV3T3B0aW9ucy5hdXRoRGF0YSA9IG51bGw7XG4gICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBzZWxmLl9zeW5jaHJvbml6ZUF1dGhEYXRhKHByb3ZpZGVyKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuX2xpbmtXaXRoKHByb3ZpZGVyLCBuZXdPcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYSB1c2VyIGlzIGxpbmtlZCB0byBhIHNlcnZpY2UuXG4gICAgICovXG4gICAgX2lzTGlua2VkOiBmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgdmFyIGF1dGhUeXBlO1xuICAgICAgaWYgKF8uaXNTdHJpbmcocHJvdmlkZXIpKSB7XG4gICAgICAgIGF1dGhUeXBlID0gcHJvdmlkZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdXRoVHlwZSA9IHByb3ZpZGVyLmdldEF1dGhUeXBlKCk7XG4gICAgICB9XG4gICAgICB2YXIgYXV0aERhdGEgPSB0aGlzLmdldCgnYXV0aERhdGEnKSB8fCB7fTtcbiAgICAgIHJldHVybiAhIWF1dGhEYXRhW2F1dGhUeXBlXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGVhdXRoZW50aWNhdGVzIGFsbCBwcm92aWRlcnMuXG4gICAgICovXG4gICAgX2xvZ091dFdpdGhBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhEYXRhID0gdGhpcy5nZXQoJ2F1dGhEYXRhJyk7XG4gICAgICBpZiAoIWF1dGhEYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFBhcnNlLl9vYmplY3RFYWNoKHRoaXMuZ2V0KCdhdXRoRGF0YScpLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHNlbGYuX2xvZ091dFdpdGgoa2V5KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEZWF1dGhlbnRpY2F0ZXMgYSBzaW5nbGUgcHJvdmlkZXIgKGUuZy4gcmVtb3ZpbmcgYWNjZXNzIHRva2VucyBmcm9tIHRoZVxuICAgICAqIEZhY2Vib29rIFNESykuXG4gICAgICovXG4gICAgX2xvZ091dFdpdGg6IGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBpZiAoIXRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKF8uaXNTdHJpbmcocHJvdmlkZXIpKSB7XG4gICAgICAgIHByb3ZpZGVyID0gUGFyc2UuVXNlci5fYXV0aFByb3ZpZGVyc1twcm92aWRlcl07XG4gICAgICB9XG4gICAgICBpZiAocHJvdmlkZXIgJiYgcHJvdmlkZXIuZGVhdXRoZW50aWNhdGUpIHtcbiAgICAgICAgcHJvdmlkZXIuZGVhdXRoZW50aWNhdGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2lnbnMgdXAgYSBuZXcgdXNlci4gWW91IHNob3VsZCBjYWxsIHRoaXMgaW5zdGVhZCBvZiBzYXZlIGZvclxuICAgICAqIG5ldyBQYXJzZS5Vc2Vycy4gVGhpcyB3aWxsIGNyZWF0ZSBhIG5ldyBQYXJzZS5Vc2VyIG9uIHRoZSBzZXJ2ZXIsIGFuZFxuICAgICAqIGFsc28gcGVyc2lzdCB0aGUgc2Vzc2lvbiBvbiBkaXNrIHNvIHRoYXQgeW91IGNhbiBhY2Nlc3MgdGhlIHVzZXIgdXNpbmdcbiAgICAgKiA8Y29kZT5jdXJyZW50PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIDxwPkEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIG11c3QgYmUgc2V0IGJlZm9yZSBjYWxsaW5nIHNpZ25VcC48L3A+XG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRycyBFeHRyYSBmaWVsZHMgdG8gc2V0IG9uIHRoZSBuZXcgdXNlciwgb3IgbnVsbC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSBzaWdudXBcbiAgICAgKiAgICAgZmluaXNoZXMuXG4gICAgICogQHNlZSBQYXJzZS5Vc2VyLnNpZ25VcFxuICAgICAqL1xuICAgIHNpZ25VcDogZnVuY3Rpb24oYXR0cnMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBlcnJvcjtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgdXNlcm5hbWUgPSAoYXR0cnMgJiYgYXR0cnMudXNlcm5hbWUpIHx8IHRoaXMuZ2V0KFwidXNlcm5hbWVcIik7XG4gICAgICBpZiAoIXVzZXJuYW1lIHx8ICh1c2VybmFtZSA9PT0gXCJcIikpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgIFwiQ2Fubm90IHNpZ24gdXAgdXNlciB3aXRoIGFuIGVtcHR5IG5hbWUuXCIpO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgb3B0aW9ucy5lcnJvcih0aGlzLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFzc3dvcmQgPSAoYXR0cnMgJiYgYXR0cnMucGFzc3dvcmQpIHx8IHRoaXMuZ2V0KFwicGFzc3dvcmRcIik7XG4gICAgICBpZiAoIXBhc3N3b3JkIHx8IChwYXNzd29yZCA9PT0gXCJcIikpIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgUGFyc2UuRXJyb3IoXG4gICAgICAgICAgICBQYXJzZS5FcnJvci5PVEhFUl9DQVVTRSxcbiAgICAgICAgICAgIFwiQ2Fubm90IHNpZ24gdXAgdXNlciB3aXRoIGFuIGVtcHR5IHBhc3N3b3JkLlwiKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgIG9wdGlvbnMuZXJyb3IodGhpcywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgLy8gT3ZlcnJpZGRlbiBzbyB0aGF0IHRoZSB1c2VyIGNhbiBiZSBtYWRlIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucyk7XG4gICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdChQYXJzZS5Vc2VyLl9jYW5Vc2VDdXJyZW50VXNlcigpKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuc2F2ZShhdHRycywgbmV3T3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3MgaW4gYSBQYXJzZS5Vc2VyLiBPbiBzdWNjZXNzLCB0aGlzIHNhdmVzIHRoZSBzZXNzaW9uIHRvIGxvY2FsU3RvcmFnZSxcbiAgICAgKiBzbyB5b3UgY2FuIHJldHJpZXZlIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgdXNpbmdcbiAgICAgKiA8Y29kZT5jdXJyZW50PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIDxwPkEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIG11c3QgYmUgc2V0IGJlZm9yZSBjYWxsaW5nIGxvZ0luLjwvcD5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIubG9nSW5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCB0aGUgdXNlciB3aGVuXG4gICAgICogICAgIHRoZSBsb2dpbiBpcyBjb21wbGV0ZS5cbiAgICAgKi9cbiAgICBsb2dJbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgaWYgKCFQYXJzZS5Vc2VyLl9jYW5Vc2VDdXJyZW50VXNlcigpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnSXQgaXMgbm90IHBvc3NpYmxlIHRvIGxvZyBpbiBvbiBhIHNlcnZlciBlbnZpcm9ubWVudC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB2YXIgbW9kZWwgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgcmVxdWVzdCA9IFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6IFwibG9naW5cIixcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBkYXRhOiB0aGlzLnRvSlNPTigpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcCwgc3RhdHVzLCB4aHIpIHtcbiAgICAgICAgdmFyIHNlcnZlckF0dHJzID0gbW9kZWwucGFyc2UocmVzcCwgc3RhdHVzLCB4aHIpO1xuICAgICAgICBtb2RlbC5fZmluaXNoRmV0Y2goc2VydmVyQXR0cnMpO1xuICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdCh0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I3NhdmVcbiAgICAgKi9cbiAgICBzYXZlOiBmdW5jdGlvbihhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICB2YXIgaSwgYXR0cnMsIGN1cnJlbnQsIG9wdGlvbnMsIHNhdmVkO1xuICAgICAgaWYgKF8uaXNPYmplY3QoYXJnMSkgfHwgXy5pc051bGwoYXJnMSkgfHwgXy5pc1VuZGVmaW5lZChhcmcxKSkge1xuICAgICAgICBhdHRycyA9IGFyZzE7XG4gICAgICAgIG9wdGlvbnMgPSBhcmcyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnMgPSB7fTtcbiAgICAgICAgYXR0cnNbYXJnMV0gPSBhcmcyO1xuICAgICAgICBvcHRpb25zID0gYXJnMztcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgbmV3T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucyk7XG4gICAgICBuZXdPcHRpb25zLnN1Y2Nlc3MgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBtb2RlbC5faGFuZGxlU2F2ZVJlc3VsdChmYWxzZSk7XG4gICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBQYXJzZS5PYmplY3QucHJvdG90eXBlLnNhdmUuY2FsbCh0aGlzLCBhdHRycywgbmV3T3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0I2ZldGNoXG4gICAgICovXG4gICAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciBuZXdPcHRpb25zID0gb3B0aW9ucyA/IF8uY2xvbmUob3B0aW9ucykgOiB7fTtcbiAgICAgIG5ld09wdGlvbnMuc3VjY2VzcyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLl9oYW5kbGVTYXZlUmVzdWx0KGZhbHNlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gUGFyc2UuT2JqZWN0LnByb3RvdHlwZS5mZXRjaC5jYWxsKHRoaXMsIG5ld09wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgPGNvZGU+Y3VycmVudDwvY29kZT4gd291bGQgcmV0dXJuIHRoaXMgdXNlci5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIjY3VycmVudFxuICAgICAqL1xuICAgIGlzQ3VycmVudDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNDdXJyZW50VXNlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBnZXQoXCJ1c2VybmFtZVwiKS5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQHNlZSBQYXJzZS5PYmplY3QjZ2V0XG4gICAgICovXG4gICAgZ2V0VXNlcm5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwidXNlcm5hbWVcIik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxzIHNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lLCBvcHRpb25zKSBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdC5zZXRcbiAgICAgKi9cbiAgICBzZXRVc2VybmFtZTogZnVuY3Rpb24odXNlcm5hbWUsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldChcInVzZXJuYW1lXCIsIHVzZXJuYW1lLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbHMgc2V0KFwicGFzc3dvcmRcIiwgcGFzc3dvcmQsIG9wdGlvbnMpIGFuZCByZXR1cm5zIHRoZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0LnNldFxuICAgICAqL1xuICAgIHNldFBhc3N3b3JkOiBmdW5jdGlvbihwYXNzd29yZCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KFwicGFzc3dvcmRcIiwgcGFzc3dvcmQsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGdldChcImVtYWlsXCIpLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAc2VlIFBhcnNlLk9iamVjdCNnZXRcbiAgICAgKi9cbiAgICBnZXRFbWFpbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoXCJlbWFpbFwiKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbHMgc2V0KFwiZW1haWxcIiwgZW1haWwsIG9wdGlvbnMpIGFuZCByZXR1cm5zIHRoZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBzZWUgUGFyc2UuT2JqZWN0LnNldFxuICAgICAqL1xuICAgIHNldEVtYWlsOiBmdW5jdGlvbihlbWFpbCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KFwiZW1haWxcIiwgZW1haWwsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGlzIHVzZXIgaXMgdGhlIGN1cnJlbnQgdXNlciBhbmQgaGFzIGJlZW4gYXV0aGVudGljYXRlZC5cbiAgICAgKiBAcmV0dXJuIChCb29sZWFuKSB3aGV0aGVyIHRoaXMgdXNlciBpcyB0aGUgY3VycmVudCB1c2VyIGFuZCBpcyBsb2dnZWQgaW4uXG4gICAgICovXG4gICAgYXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gISF0aGlzLl9zZXNzaW9uVG9rZW4gJiZcbiAgICAgICAgICAoUGFyc2UuVXNlci5jdXJyZW50KCkgJiYgUGFyc2UuVXNlci5jdXJyZW50KCkuaWQgPT09IHRoaXMuaWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZXNzaW9uIHRva2VuIGZvciB0aGlzIHVzZXIsIGlmIHRoZSB1c2VyIGhhcyBiZWVuIGxvZ2dlZCBpbixcbiAgICAgKiBvciBpZiBpdCBpcyB0aGUgcmVzdWx0IG9mIGEgcXVlcnkgd2l0aCB0aGUgbWFzdGVyIGtleS4gT3RoZXJ3aXNlLCByZXR1cm5zXG4gICAgICogdW5kZWZpbmVkLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gdGhlIHNlc3Npb24gdG9rZW4sIG9yIHVuZGVmaW5lZFxuICAgICAqL1xuICAgIGdldFNlc3Npb25Ub2tlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2Vzc2lvblRva2VuO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IGEgcmV2b2NhYmxlIHNlc3Npb24gdG9rZW4gdG8gcmVwbGFjZSB0aGUgb2xkZXIgc3R5bGUgb2YgdG9rZW4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIHJlcGxhY2VtZW50XG4gICAgICogICB0b2tlbiBoYXMgYmVlbiBmZXRjaGVkLlxuICAgICAqL1xuICAgIF91cGdyYWRlVG9SZXZvY2FibGVTZXNzaW9uOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIGlmICghUGFyc2UuVXNlci5jdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHZhciBjdXJyZW50U2Vzc2lvbiA9IFBhcnNlLlVzZXIuY3VycmVudCgpLmdldFNlc3Npb25Ub2tlbigpO1xuICAgICAgaWYgKFBhcnNlLlNlc3Npb24uX2lzUmV2b2NhYmxlKGN1cnJlbnRTZXNzaW9uKSkge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcygpLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgcm91dGU6ICd1cGdyYWRlVG9SZXZvY2FibGVTZXNzaW9uJyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogY3VycmVudFNlc3Npb25cbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHZhciBzZXNzaW9uID0gbmV3IFBhcnNlLlNlc3Npb24oKTtcbiAgICAgICAgc2Vzc2lvbi5fZmluaXNoRmV0Y2gocmVzdWx0KTtcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gUGFyc2UuVXNlci5jdXJyZW50KCk7XG4gICAgICAgIGN1cnJlbnRVc2VyLl9zZXNzaW9uVG9rZW4gPSBzZXNzaW9uLmdldFNlc3Npb25Ub2tlbigpO1xuICAgICAgICBQYXJzZS5Vc2VyLl9zYXZlQ3VycmVudFVzZXIoY3VycmVudFVzZXIpO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICB9LCAvKiogQGxlbmRzIFBhcnNlLlVzZXIgKi8ge1xuICAgIC8vIENsYXNzIFZhcmlhYmxlc1xuXG4gICAgLy8gVGhlIGN1cnJlbnRseSBsb2dnZWQtaW4gdXNlci5cbiAgICBfY3VycmVudFVzZXI6IG51bGwsXG5cbiAgICAvLyBXaGV0aGVyIGN1cnJlbnRVc2VyIGlzIGtub3duIHRvIG1hdGNoIHRoZSBzZXJpYWxpemVkIHZlcnNpb24gb24gZGlzay5cbiAgICAvLyBUaGlzIGlzIHVzZWZ1bCBmb3Igc2F2aW5nIGEgbG9jYWxzdG9yYWdlIGNoZWNrIGlmIHlvdSB0cnkgdG8gbG9hZFxuICAgIC8vIF9jdXJyZW50VXNlciBmcmVxdWVudGx5IHdoaWxlIHRoZXJlIGlzIG5vbmUgc3RvcmVkLlxuICAgIF9jdXJyZW50VXNlck1hdGNoZXNEaXNrOiBmYWxzZSxcblxuICAgIC8vIFRoZSBsb2NhbFN0b3JhZ2Uga2V5IHN1ZmZpeCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgaXMgc3RvcmVkIHVuZGVyLlxuICAgIF9DVVJSRU5UX1VTRVJfS0VZOiBcImN1cnJlbnRVc2VyXCIsXG5cbiAgICAvLyBUaGUgbWFwcGluZyBvZiBhdXRoIHByb3ZpZGVyIG5hbWVzIHRvIGFjdHVhbCBwcm92aWRlcnNcbiAgICBfYXV0aFByb3ZpZGVyczoge30sXG5cbiAgICAvLyBXaGV0aGVyIHRvIHJld3JpdGUgY2xhc3NOYW1lIFVzZXIgdG8gX1VzZXJcbiAgICBfcGVyZm9ybVVzZXJSZXdyaXRlOiB0cnVlLFxuXG4gICAgLy8gV2hldGhlciB0byBzZW5kIGEgUmV2b2NhYmxlIFNlc3Npb24gaGVhZGVyXG4gICAgX2lzUmV2b2NhYmxlU2Vzc2lvbkVuYWJsZWQ6IGZhbHNlLFxuXG4gICAgLy8gV2hldGhlciB0byBlbmFibGUgYSBtZW1vcnktdW5zYWZlIGN1cnJlbnQgdXNlciBpbiBub2RlLmpzXG4gICAgX2VuYWJsZVVuc2FmZUN1cnJlbnRVc2VyOiBmYWxzZSxcblxuXG4gICAgLy8gQ2xhc3MgTWV0aG9kc1xuXG4gICAgLyoqXG4gICAgICogU2lnbnMgdXAgYSBuZXcgdXNlciB3aXRoIGEgdXNlcm5hbWUgKG9yIGVtYWlsKSBhbmQgcGFzc3dvcmQuXG4gICAgICogVGhpcyB3aWxsIGNyZWF0ZSBhIG5ldyBQYXJzZS5Vc2VyIG9uIHRoZSBzZXJ2ZXIsIGFuZCBhbHNvIHBlcnNpc3QgdGhlXG4gICAgICogc2Vzc2lvbiBpbiBsb2NhbFN0b3JhZ2Ugc28gdGhhdCB5b3UgY2FuIGFjY2VzcyB0aGUgdXNlciB1c2luZ1xuICAgICAqIHtAbGluayAjY3VycmVudH0uXG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZSBUaGUgdXNlcm5hbWUgKG9yIGVtYWlsKSB0byBzaWduIHVwIHdpdGguXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBzaWduIHVwIHdpdGguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzIEV4dHJhIGZpZWxkcyB0byBzZXQgb24gdGhlIG5ldyB1c2VyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdpdGggdGhlIHVzZXIgd2hlblxuICAgICAqICAgICB0aGUgc2lnbnVwIGNvbXBsZXRlcy5cbiAgICAgKiBAc2VlIFBhcnNlLlVzZXIjc2lnblVwXG4gICAgICovXG4gICAgc2lnblVwOiBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQsIGF0dHJzLCBvcHRpb25zKSB7XG4gICAgICBhdHRycyA9IGF0dHJzIHx8IHt9O1xuICAgICAgYXR0cnMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgIGF0dHJzLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgICB2YXIgdXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICByZXR1cm4gdXNlci5zaWduVXAoYXR0cnMsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGluIGEgdXNlciB3aXRoIGEgdXNlcm5hbWUgKG9yIGVtYWlsKSBhbmQgcGFzc3dvcmQuIE9uIHN1Y2Nlc3MsIHRoaXNcbiAgICAgKiBzYXZlcyB0aGUgc2Vzc2lvbiB0byBkaXNrLCBzbyB5b3UgY2FuIHJldHJpZXZlIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluXG4gICAgICogdXNlciB1c2luZyA8Y29kZT5jdXJyZW50PC9jb2RlPi5cbiAgICAgKlxuICAgICAqIDxwPkNhbGxzIG9wdGlvbnMuc3VjY2VzcyBvciBvcHRpb25zLmVycm9yIG9uIGNvbXBsZXRpb24uPC9wPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZSAob3IgZW1haWwpIHRvIGxvZyBpbiB3aXRoLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gbG9nIGluIHdpdGguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCB0aGUgdXNlciB3aGVuXG4gICAgICogICAgIHRoZSBsb2dpbiBjb21wbGV0ZXMuXG4gICAgICogQHNlZSBQYXJzZS5Vc2VyI2xvZ0luXG4gICAgICovXG4gICAgbG9nSW46IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgb3B0aW9ucykge1xuICAgICAgdmFyIHVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgdXNlci5fZmluaXNoRmV0Y2goeyB1c2VybmFtZTogdXNlcm5hbWUsIHBhc3N3b3JkOiBwYXNzd29yZCB9KTtcbiAgICAgIHJldHVybiB1c2VyLmxvZ0luKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGluIGEgdXNlciB3aXRoIGEgc2Vzc2lvbiB0b2tlbi4gT24gc3VjY2VzcywgdGhpcyBzYXZlcyB0aGUgc2Vzc2lvblxuICAgICAqIHRvIGRpc2ssIHNvIHlvdSBjYW4gcmV0cmlldmUgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciB1c2luZ1xuICAgICAqIDxjb2RlPmN1cnJlbnQ8L2NvZGU+LlxuICAgICAqXG4gICAgICogPHA+Q2FsbHMgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3Igb24gY29tcGxldGlvbi48L3A+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2Vzc2lvblRva2VuIFRoZSBzZXNzaW9uVG9rZW4gdG8gbG9nIGluIHdpdGguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCB0aGUgdXNlciB3aGVuXG4gICAgICogICAgIHRoZSBsb2dpbiBjb21wbGV0ZXMuXG4gICAgICovXG4gICAgYmVjb21lOiBmdW5jdGlvbihzZXNzaW9uVG9rZW4sIG9wdGlvbnMpIHtcbiAgICAgIGlmICghUGFyc2UuVXNlci5fY2FuVXNlQ3VycmVudFVzZXIoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0l0IGlzIG5vdCBzZWN1cmUgdG8gYmVjb21lIGEgdXNlciBvbiBhIG5vZGUuanMgc2VydmVyIGVudmlyb25tZW50LidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgdXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICByZXR1cm4gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJ1c2Vyc1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwibWVcIixcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBzZXNzaW9uVG9rZW46IHNlc3Npb25Ub2tlblxuICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwLCBzdGF0dXMsIHhocikge1xuICAgICAgICB2YXIgc2VydmVyQXR0cnMgPSB1c2VyLnBhcnNlKHJlc3AsIHN0YXR1cywgeGhyKTtcbiAgICAgICAgdXNlci5fZmluaXNoRmV0Y2goc2VydmVyQXR0cnMpO1xuICAgICAgICB1c2VyLl9oYW5kbGVTYXZlUmVzdWx0KHRydWUpO1xuICAgICAgICByZXR1cm4gdXNlcjtcblxuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgdXNlcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3Mgb3V0IHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgc2Vzc2lvbi4gVGhpcyB3aWxsIHJlbW92ZSB0aGVcbiAgICAgKiBzZXNzaW9uIGZyb20gZGlzaywgbG9nIG91dCBvZiBsaW5rZWQgc2VydmljZXMsIGFuZCBmdXR1cmUgY2FsbHMgdG9cbiAgICAgKiA8Y29kZT5jdXJyZW50PC9jb2RlPiB3aWxsIHJldHVybiA8Y29kZT5udWxsPC9jb2RlPi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBzZXNzaW9uIGlzXG4gICAgICogICBkZXN0cm95ZWQgb24gdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBsb2dPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFQYXJzZS5Vc2VyLl9jYW5Vc2VDdXJyZW50VXNlcigpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnVGhlcmUgaXMgbm8gY3VycmVudCB1c2VyIHVzZXIgb24gYSBub2RlLmpzIHNlcnZlciBlbnZpcm9ubWVudC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudEFzeW5jKCkudGhlbihmdW5jdGlvbihjdXJyZW50VXNlcikge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IFBhcnNlLlN0b3JhZ2UucmVtb3ZlSXRlbUFzeW5jKFxuICAgICAgICAgIFBhcnNlLl9nZXRQYXJzZVBhdGgoUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSkpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VXNlciAhPT0gbnVsbCkge1xuICAgICAgICAgIHZhciBjdXJyZW50U2Vzc2lvbiA9IGN1cnJlbnRVc2VyLmdldFNlc3Npb25Ub2tlbigpO1xuICAgICAgICAgIGlmIChQYXJzZS5TZXNzaW9uLl9pc1Jldm9jYWJsZShjdXJyZW50U2Vzc2lvbikpIHtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBhcnNlLl9yZXF1ZXN0KHtcbiAgICAgICAgICAgICAgICByb3V0ZTogJ2xvZ291dCcsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgc2Vzc2lvblRva2VuOiBjdXJyZW50U2Vzc2lvblxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50VXNlci5fbG9nT3V0V2l0aEFsbCgpO1xuICAgICAgICAgIGN1cnJlbnRVc2VyLl9pc0N1cnJlbnRVc2VyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzayA9IHRydWU7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0cyBhIHBhc3N3b3JkIHJlc2V0IGVtYWlsIHRvIGJlIHNlbnQgdG8gdGhlIHNwZWNpZmllZCBlbWFpbCBhZGRyZXNzXG4gICAgICogYXNzb2NpYXRlZCB3aXRoIHRoZSB1c2VyIGFjY291bnQuIFRoaXMgZW1haWwgYWxsb3dzIHRoZSB1c2VyIHRvIHNlY3VyZWx5XG4gICAgICogcmVzZXQgdGhlaXIgcGFzc3dvcmQgb24gdGhlIFBhcnNlIHNpdGUuXG4gICAgICpcbiAgICAgKiA8cD5DYWxscyBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBvbiBjb21wbGV0aW9uLjwvcD5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCBUaGUgZW1haWwgYWRkcmVzcyBhc3NvY2lhdGVkIHdpdGggdGhlIHVzZXIgdGhhdFxuICAgICAqICAgICBmb3Jnb3QgdGhlaXIgcGFzc3dvcmQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKi9cbiAgICByZXF1ZXN0UGFzc3dvcmRSZXNldDogZnVuY3Rpb24oZW1haWwsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcInJlcXVlc3RQYXNzd29yZFJlc2V0XCIsXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIGRhdGE6IHsgZW1haWw6IGVtYWlsIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcXVlc3QuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiBQYXJzZVVzZXIgd2l0aCBhIHZhbGlkIHNlc3Npb24sXG4gICAgICogZWl0aGVyIGZyb20gbWVtb3J5IG9yIGxvY2FsU3RvcmFnZSwgaWYgbmVjZXNzYXJ5LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLk9iamVjdH0gVGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gUGFyc2UuVXNlci5cbiAgICAgKi9cbiAgICBjdXJyZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghUGFyc2UuVXNlci5fY2FuVXNlQ3VycmVudFVzZXIoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1RoZXJlIGlzIG5vIGN1cnJlbnQgdXNlciB1c2VyIG9uIGEgbm9kZS5qcyBzZXJ2ZXIgZW52aXJvbm1lbnQuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKFBhcnNlLlN0b3JhZ2UuYXN5bmMpIHtcbiAgICAgICAgLy8gV2UgY2FuJ3QgcmV0dXJuIHRoZSBjdXJyZW50IHVzZXIgc3luY2hyb25vdXNseVxuICAgICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50QXN5bmMoKTtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyO1xuICAgICAgfVxuXG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzaykge1xuICAgICAgICAvLyBUT0RPOiBMYXppbHkgbG9nIGluIGFub255bW91cyB1c2VyLlxuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgICB9XG5cbiAgICAgIC8vIExvYWQgdGhlIHVzZXIgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzayA9IHRydWU7XG5cbiAgICAgIHZhciB1c2VyRGF0YSA9IFBhcnNlLlN0b3JhZ2UuZ2V0SXRlbShQYXJzZS5fZ2V0UGFyc2VQYXRoKFxuICAgICAgICAgIFBhcnNlLlVzZXIuX0NVUlJFTlRfVVNFUl9LRVkpKTtcbiAgICAgIGlmICghdXNlckRhdGEpIHtcbiAgICAgICAgLy8gVE9ETzogTGF6aWx5IGxvZyBpbiBhbm9ueW1vdXMgdXNlci5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlciA9IFBhcnNlLk9iamVjdC5fY3JlYXRlKFwiX1VzZXJcIik7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5faXNDdXJyZW50VXNlciA9IHRydWU7XG5cbiAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh1c2VyRGF0YSk7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5pZCA9IGpzb24uX2lkO1xuICAgICAgZGVsZXRlIGpzb24uX2lkO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbiA9IGpzb24uX3Nlc3Npb25Ub2tlbjtcbiAgICAgIGRlbGV0ZSBqc29uLl9zZXNzaW9uVG9rZW47XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fZmluaXNoRmV0Y2goanNvbik7XG5cbiAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9zeW5jaHJvbml6ZUFsbEF1dGhEYXRhKCk7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fcmVmcmVzaENhY2hlKCk7XG4gICAgICBQYXJzZS5Vc2VyLl9jdXJyZW50VXNlci5fb3BTZXRRdWV1ZSA9IFt7fV07XG4gICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiBQYXJzZVVzZXIgZnJvbSBhc3luY2hyb25vdXMgU3RvcmFnZS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIFByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSBjdXJyZW50bHlcbiAgICAgKiAgIGxvZ2dlZCBpbiBQYXJzZSBVc2VyXG4gICAgICovXG4gICAgX2N1cnJlbnRBc3luYzogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoUGFyc2UuVXNlci5fY3VycmVudFVzZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzaykge1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhQYXJzZS5Vc2VyLl9jdXJyZW50VXNlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIExvYWQgdGhlIHVzZXIgZnJvbSBTdG9yYWdlXG4gICAgICByZXR1cm4gUGFyc2UuU3RvcmFnZS5nZXRJdGVtQXN5bmMoUGFyc2UuX2dldFBhcnNlUGF0aChcbiAgICAgICAgUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSkpLnRoZW4oZnVuY3Rpb24odXNlckRhdGEpIHtcbiAgICAgICAgaWYgKCF1c2VyRGF0YSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyID0gUGFyc2UuT2JqZWN0Ll9jcmVhdGUoXCJfVXNlclwiKTtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX2lzQ3VycmVudFVzZXIgPSB0cnVlO1xuXG4gICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh1c2VyRGF0YSk7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLmlkID0ganNvbi5faWQ7XG4gICAgICAgIGRlbGV0ZSBqc29uLl9pZDtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX3Nlc3Npb25Ub2tlbiA9IGpzb24uX3Nlc3Npb25Ub2tlbjtcbiAgICAgICAgZGVsZXRlIGpzb24uX3Nlc3Npb25Ub2tlbjtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX2ZpbmlzaEZldGNoKGpzb24pO1xuXG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9zeW5jaHJvbml6ZUFsbEF1dGhEYXRhKCk7XG4gICAgICAgIFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyLl9yZWZyZXNoQ2FjaGUoKTtcbiAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIuX29wU2V0UXVldWUgPSBbe31dO1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fY3VycmVudFVzZXI7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWxsb3cgc29tZW9uZSB0byBkZWZpbmUgYSBjdXN0b20gVXNlciBjbGFzcyB3aXRob3V0IGNsYXNzTmFtZVxuICAgICAqIGJlaW5nIHJld3JpdHRlbiB0byBfVXNlci4gVGhlIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmV3cml0ZVxuICAgICAqIFVzZXIgdG8gX1VzZXIgZm9yIGxlZ2FjeSByZWFzb25zLiBUaGlzIGFsbG93cyBkZXZlbG9wZXJzIHRvXG4gICAgICogb3ZlcnJpZGUgdGhhdCBiZWhhdmlvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNBbGxvd2VkIFdoZXRoZXIgb3Igbm90IHRvIGFsbG93IGN1c3RvbSBVc2VyIGNsYXNzXG4gICAgICovXG4gICAgYWxsb3dDdXN0b21Vc2VyQ2xhc3M6IGZ1bmN0aW9uKGlzQWxsb3dlZCkge1xuICAgICAgdGhpcy5fcGVyZm9ybVVzZXJSZXdyaXRlID0gIWlzQWxsb3dlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWxsb3cgYSBsZWdhY3kgYXBwbGljYXRpb24gdG8gc3RhcnQgdXNpbmcgcmV2b2NhYmxlIHNlc3Npb25zLiBJZiB0aGVcbiAgICAgKiBjdXJyZW50IHNlc3Npb24gdG9rZW4gaXMgbm90IHJldm9jYWJsZSwgYSByZXF1ZXN0IHdpbGwgYmUgbWFkZSBmb3IgYSBuZXcsXG4gICAgICogcmV2b2NhYmxlIHNlc3Npb24uXG4gICAgICogSXQgaXMgbm90IG5lY2Vzc2FyeSB0byBjYWxsIHRoaXMgbWV0aG9kIGZyb20gY2xvdWQgY29kZSB1bmxlc3MgeW91IGFyZVxuICAgICAqIGhhbmRsaW5nIHVzZXIgc2lnbnVwIG9yIGxvZ2luIGZyb20gdGhlIHNlcnZlciBzaWRlLiBJbiBhIGNsb3VkIGNvZGUgY2FsbCxcbiAgICAgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgbm90IGF0dGVtcHQgdG8gdXBncmFkZSB0aGUgY3VycmVudCB0b2tlbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgcHJvY2VzcyBoYXNcbiAgICAgKiAgIGNvbXBsZXRlZC4gSWYgYSByZXBsYWNlbWVudCBzZXNzaW9uIHRva2VuIGlzIHJlcXVlc3RlZCwgdGhlIHByb21pc2VcbiAgICAgKiAgIHdpbGwgYmUgcmVzb2x2ZWQgYWZ0ZXIgYSBuZXcgdG9rZW4gaGFzIGJlZW4gZmV0Y2hlZC5cbiAgICAgKi9cbiAgICBlbmFibGVSZXZvY2FibGVTZXNzaW9uOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIFBhcnNlLlVzZXIuX2lzUmV2b2NhYmxlU2Vzc2lvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgaWYgKFBhcnNlLlVzZXIuX2NhblVzZUN1cnJlbnRVc2VyKCkgJiYgUGFyc2UuVXNlci5jdXJyZW50KCkpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuY3VycmVudCgpLl91cGdyYWRlVG9SZXZvY2FibGVTZXNzaW9uKG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMoKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBlbmFibGVVbnNhZmVDdXJyZW50VXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICBQYXJzZS5Vc2VyLl9lbmFibGVVbnNhZmVDdXJyZW50VXNlciA9IHRydWU7XG4gICAgfSxcblxuICAgIF9jYW5Vc2VDdXJyZW50VXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIVBhcnNlLl9pc05vZGUgfHwgUGFyc2UuVXNlci5fZW5hYmxlVW5zYWZlQ3VycmVudFVzZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBlcnNpc3RzIGEgdXNlciBhcyBjdXJyZW50VXNlciB0byBsb2NhbFN0b3JhZ2UsIGFuZCBpbnRvIHRoZSBzaW5nbGV0b24uXG4gICAgICovXG4gICAgX3NhdmVDdXJyZW50VXNlcjogZnVuY3Rpb24odXNlcikge1xuICAgICAgaWYgKFBhcnNlLlVzZXIuX2N1cnJlbnRVc2VyICE9PSBudWxsICYmXG4gICAgICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIgIT09IHVzZXIpIHtcbiAgICAgICAgUGFyc2UuVXNlci5sb2dPdXQoKTtcbiAgICAgIH1cbiAgICAgIHVzZXIuX2lzQ3VycmVudFVzZXIgPSB0cnVlO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgUGFyc2UuVXNlci5fY3VycmVudFVzZXJNYXRjaGVzRGlzayA9IHRydWU7XG5cbiAgICAgIHZhciBqc29uID0gdXNlci50b0pTT04oKTtcbiAgICAgIGpzb24uX2lkID0gdXNlci5pZDtcbiAgICAgIGpzb24uX3Nlc3Npb25Ub2tlbiA9IHVzZXIuX3Nlc3Npb25Ub2tlbjtcbiAgICAgIGlmIChQYXJzZS5TdG9yYWdlLmFzeW5jKSB7XG4gICAgICAgIFBhcnNlLlN0b3JhZ2Uuc2V0SXRlbUFzeW5jKFxuICAgICAgICAgIFBhcnNlLl9nZXRQYXJzZVBhdGgoUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSksXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoanNvbikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUGFyc2UuU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgIFBhcnNlLl9nZXRQYXJzZVBhdGgoUGFyc2UuVXNlci5fQ1VSUkVOVF9VU0VSX0tFWSksXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoanNvbikpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJBdXRoZW50aWNhdGlvblByb3ZpZGVyOiBmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgUGFyc2UuVXNlci5fYXV0aFByb3ZpZGVyc1twcm92aWRlci5nZXRBdXRoVHlwZSgpXSA9IHByb3ZpZGVyO1xuICAgICAgLy8gU3luY2hyb25pemUgdGhlIGN1cnJlbnQgdXNlciB3aXRoIHRoZSBhdXRoIHByb3ZpZGVyLlxuICAgICAgaWYgKFBhcnNlLlVzZXIuY3VycmVudCgpKSB7XG4gICAgICAgIFBhcnNlLlVzZXIuY3VycmVudCgpLl9zeW5jaHJvbml6ZUF1dGhEYXRhKHByb3ZpZGVyLmdldEF1dGhUeXBlKCkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfbG9nSW5XaXRoOiBmdW5jdGlvbihwcm92aWRlciwgb3B0aW9ucykge1xuICAgICAgdmFyIHVzZXIgPSBQYXJzZS5PYmplY3QuX2NyZWF0ZShcIl9Vc2VyXCIpO1xuICAgICAgcmV0dXJuIHVzZXIuX2xpbmtXaXRoKHByb3ZpZGVyLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgfSk7XG59KHRoaXMpKTtcblxuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcblxuICAvKipcbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkEgUGFyc2UuU2Vzc2lvbiBvYmplY3QgaXMgYSBsb2NhbCByZXByZXNlbnRhdGlvbiBvZiBhIHJldm9jYWJsZSBzZXNzaW9uLlxuICAgKiBUaGlzIGNsYXNzIGlzIGEgc3ViY2xhc3Mgb2YgYSBQYXJzZS5PYmplY3QsIGFuZCByZXRhaW5zIHRoZSBzYW1lXG4gICAqIGZ1bmN0aW9uYWxpdHkgb2YgYSBQYXJzZS5PYmplY3QuPC9wPlxuICAgKi9cbiAgUGFyc2UuU2Vzc2lvbiA9IFBhcnNlLk9iamVjdC5leHRlbmQoJ19TZXNzaW9uJyxcbiAgLyoqIEBsZW5kcyBQYXJzZS5TZXNzaW9uLnByb3RvdHlwZSAqL1xuICB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2Vzc2lvbiB0b2tlbiBzdHJpbmcuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldFNlc3Npb25Ub2tlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2Vzc2lvblRva2VuO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gaGFuZGxlIHNwZWNpYWwgZmllbGRzIGluIGEgX1Nlc3Npb24gcmVzcG9uc2UuXG4gICAgICovXG4gICAgX21lcmdlTWFnaWNGaWVsZHM6IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgICBpZiAoYXR0cnMuc2Vzc2lvblRva2VuKSB7XG4gICAgICAgIHRoaXMuX3Nlc3Npb25Ub2tlbiA9IGF0dHJzLnNlc3Npb25Ub2tlbjtcbiAgICAgICAgZGVsZXRlIGF0dHJzLnNlc3Npb25Ub2tlbjtcbiAgICAgIH1cbiAgICAgIFBhcnNlLlNlc3Npb24uX19zdXBlcl9fLl9tZXJnZU1hZ2ljRmllbGRzLmNhbGwodGhpcywgYXR0cnMpO1xuICAgIH0sXG4gIH0sIC8qKiBAbGVuZHMgUGFyc2UuU2Vzc2lvbiAqLyB7XG5cbiAgICAvLyBUaHJvdyBhbiBlcnJvciB3aGVuIG1vZGlmeWluZyB0aGVzZSByZWFkLW9ubHkgZmllbGRzXG4gICAgcmVhZE9ubHlBdHRyaWJ1dGVzOiB7XG4gICAgICBjcmVhdGVkV2l0aDogdHJ1ZSxcbiAgICAgIGV4cGlyZXNBdDogdHJ1ZSxcbiAgICAgIGluc3RhbGxhdGlvbklkOiB0cnVlLFxuICAgICAgcmVzdHJpY3RlZDogdHJ1ZSxcbiAgICAgIHNlc3Npb25Ub2tlbjogdHJ1ZSxcbiAgICAgIHVzZXI6IHRydWVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBTZXNzaW9uIG9iamVjdCBmb3IgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gc2Vzc2lvbi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aXRoIHRoZSBQYXJzZS5TZXNzaW9uXG4gICAgICogICBvYmplY3QgYWZ0ZXIgaXQgaGFzIGJlZW4gZmV0Y2hlZC5cbiAgICAgKi9cbiAgICBjdXJyZW50OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHNlc3Npb24gPSBQYXJzZS5PYmplY3QuX2NyZWF0ZSgnX1Nlc3Npb24nKTtcbiAgICAgIHZhciBjdXJyZW50VG9rZW4gPSBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5nZXRTZXNzaW9uVG9rZW4oKTtcbiAgICAgIHJldHVybiBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiAnc2Vzc2lvbnMnLFxuICAgICAgICBjbGFzc05hbWU6ICdtZScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogY3VycmVudFRva2VuXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3AsIHN0YXR1cywgeGhyKSB7XG4gICAgICAgIHZhciBzZXJ2ZXJBdHRycyA9IHNlc3Npb24ucGFyc2UocmVzcCwgc3RhdHVzLCB4aHIpO1xuICAgICAgICBzZXNzaW9uLl9maW5pc2hGZXRjaChzZXJ2ZXJBdHRycyk7XG4gICAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucywgc2Vzc2lvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhIHNlc3Npb24gdG9rZW4gaXMgcmV2b2NhYmxlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgX2lzUmV2b2NhYmxlOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgcmV0dXJuIHRva2VuLmluZGV4T2YoJ3I6JykgPiAtMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlc3Npb24gdG9rZW4gaXMgcmV2b2NhYmxlLlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCBmb3IgbWlncmF0aW5nIEV4cHJlc3MuanMgb3IgTm9kZS5qcyB3ZWIgYXBwcyB0b1xuICAgICAqIHVzZSByZXZvY2FibGUgc2Vzc2lvbnMuIElmIHlvdSBhcmUgbWlncmF0aW5nIGFuIGFwcCB0aGF0IHVzZXMgdGhlIFBhcnNlXG4gICAgICogU0RLIGluIHRoZSBicm93c2VyIG9ubHksIHBsZWFzZSB1c2UgUGFyc2UuVXNlci5lbmFibGVSZXZvY2FibGVTZXNzaW9uKClcbiAgICAgKiBpbnN0ZWFkLCBzbyB0aGF0IHNlc3Npb25zIGNhbiBiZSBhdXRvbWF0aWNhbGx5IHVwZ3JhZGVkLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNDdXJyZW50U2Vzc2lvblJldm9jYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoUGFyc2UuVXNlci5jdXJyZW50KCkgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlNlc3Npb24uX2lzUmV2b2NhYmxlKFxuICAgICAgICAgIFBhcnNlLlVzZXIuY3VycmVudCgpLmdldFNlc3Npb25Ub2tlbigpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pKHRoaXMpO1xuXG4vLyBQYXJzZS5RdWVyeSBpcyBhIHdheSB0byBjcmVhdGUgYSBsaXN0IG9mIFBhcnNlLk9iamVjdHMuXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBhcnNlIFBhcnNlLlF1ZXJ5IGZvciB0aGUgZ2l2ZW4gUGFyc2UuT2JqZWN0IHN1YmNsYXNzLlxuICAgKiBAcGFyYW0gb2JqZWN0Q2xhc3MgLVxuICAgKiAgIEFuIGluc3RhbmNlIG9mIGEgc3ViY2xhc3Mgb2YgUGFyc2UuT2JqZWN0LCBvciBhIFBhcnNlIGNsYXNzTmFtZSBzdHJpbmcuXG4gICAqIEBjbGFzc1xuICAgKlxuICAgKiA8cD5QYXJzZS5RdWVyeSBkZWZpbmVzIGEgcXVlcnkgdGhhdCBpcyB1c2VkIHRvIGZldGNoIFBhcnNlLk9iamVjdHMuIFRoZVxuICAgKiBtb3N0IGNvbW1vbiB1c2UgY2FzZSBpcyBmaW5kaW5nIGFsbCBvYmplY3RzIHRoYXQgbWF0Y2ggYSBxdWVyeSB0aHJvdWdoIHRoZVxuICAgKiA8Y29kZT5maW5kPC9jb2RlPiBtZXRob2QuIEZvciBleGFtcGxlLCB0aGlzIHNhbXBsZSBjb2RlIGZldGNoZXMgYWxsIG9iamVjdHNcbiAgICogb2YgY2xhc3MgPGNvZGU+TXlDbGFzczwvY29kZT4uIEl0IGNhbGxzIGEgZGlmZmVyZW50IGZ1bmN0aW9uIGRlcGVuZGluZyBvblxuICAgKiB3aGV0aGVyIHRoZSBmZXRjaCBzdWNjZWVkZWQgb3Igbm90LlxuICAgKiBcbiAgICogPHByZT5cbiAgICogdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KE15Q2xhc3MpO1xuICAgKiBxdWVyeS5maW5kKHtcbiAgICogICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAqICAgICAvLyByZXN1bHRzIGlzIGFuIGFycmF5IG9mIFBhcnNlLk9iamVjdC5cbiAgICogICB9LFxuICAgKlxuICAgKiAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgLy8gZXJyb3IgaXMgYW4gaW5zdGFuY2Ugb2YgUGFyc2UuRXJyb3IuXG4gICAqICAgfVxuICAgKiB9KTs8L3ByZT48L3A+XG4gICAqIFxuICAgKiA8cD5BIFBhcnNlLlF1ZXJ5IGNhbiBhbHNvIGJlIHVzZWQgdG8gcmV0cmlldmUgYSBzaW5nbGUgb2JqZWN0IHdob3NlIGlkIGlzXG4gICAqIGtub3duLCB0aHJvdWdoIHRoZSBnZXQgbWV0aG9kLiBGb3IgZXhhbXBsZSwgdGhpcyBzYW1wbGUgY29kZSBmZXRjaGVzIGFuXG4gICAqIG9iamVjdCBvZiBjbGFzcyA8Y29kZT5NeUNsYXNzPC9jb2RlPiBhbmQgaWQgPGNvZGU+bXlJZDwvY29kZT4uIEl0IGNhbGxzIGFcbiAgICogZGlmZmVyZW50IGZ1bmN0aW9uIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBmZXRjaCBzdWNjZWVkZWQgb3Igbm90LlxuICAgKiBcbiAgICogPHByZT5cbiAgICogdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KE15Q2xhc3MpO1xuICAgKiBxdWVyeS5nZXQobXlJZCwge1xuICAgKiAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgKiAgICAgLy8gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLk9iamVjdC5cbiAgICogICB9LFxuICAgKlxuICAgKiAgIGVycm9yOiBmdW5jdGlvbihvYmplY3QsIGVycm9yKSB7XG4gICAqICAgICAvLyBlcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBQYXJzZS5FcnJvci5cbiAgICogICB9XG4gICAqIH0pOzwvcHJlPjwvcD5cbiAgICogXG4gICAqIDxwPkEgUGFyc2UuUXVlcnkgY2FuIGFsc28gYmUgdXNlZCB0byBjb3VudCB0aGUgbnVtYmVyIG9mIG9iamVjdHMgdGhhdCBtYXRjaFxuICAgKiB0aGUgcXVlcnkgd2l0aG91dCByZXRyaWV2aW5nIGFsbCBvZiB0aG9zZSBvYmplY3RzLiBGb3IgZXhhbXBsZSwgdGhpc1xuICAgKiBzYW1wbGUgY29kZSBjb3VudHMgdGhlIG51bWJlciBvZiBvYmplY3RzIG9mIHRoZSBjbGFzcyA8Y29kZT5NeUNsYXNzPC9jb2RlPlxuICAgKiA8cHJlPlxuICAgKiB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoTXlDbGFzcyk7XG4gICAqIHF1ZXJ5LmNvdW50KHtcbiAgICogICBzdWNjZXNzOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICogICAgIC8vIFRoZXJlIGFyZSBudW1iZXIgaW5zdGFuY2VzIG9mIE15Q2xhc3MuXG4gICAqICAgfSxcbiAgICpcbiAgICogICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgIC8vIGVycm9yIGlzIGFuIGluc3RhbmNlIG9mIFBhcnNlLkVycm9yLlxuICAgKiAgIH1cbiAgICogfSk7PC9wcmU+PC9wPlxuICAgKi9cbiAgUGFyc2UuUXVlcnkgPSBmdW5jdGlvbihvYmplY3RDbGFzcykge1xuICAgIGlmIChfLmlzU3RyaW5nKG9iamVjdENsYXNzKSkge1xuICAgICAgb2JqZWN0Q2xhc3MgPSBQYXJzZS5PYmplY3QuX2dldFN1YmNsYXNzKG9iamVjdENsYXNzKTtcbiAgICB9XG5cbiAgICB0aGlzLm9iamVjdENsYXNzID0gb2JqZWN0Q2xhc3M7XG5cbiAgICB0aGlzLmNsYXNzTmFtZSA9IG9iamVjdENsYXNzLnByb3RvdHlwZS5jbGFzc05hbWU7XG5cbiAgICB0aGlzLl93aGVyZSA9IHt9O1xuICAgIHRoaXMuX2luY2x1ZGUgPSBbXTtcbiAgICB0aGlzLl9saW1pdCA9IC0xOyAvLyBuZWdhdGl2ZSBsaW1pdCBtZWFucywgZG8gbm90IHNlbmQgYSBsaW1pdFxuICAgIHRoaXMuX3NraXAgPSAwO1xuICAgIHRoaXMuX2V4dHJhT3B0aW9ucyA9IHt9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgUGFyc2UuUXVlcnkgdGhhdCBpcyB0aGUgT1Igb2YgdGhlIHBhc3NlZCBpbiBxdWVyaWVzLiAgRm9yXG4gICAqIGV4YW1wbGU6XG4gICAqIDxwcmU+dmFyIGNvbXBvdW5kUXVlcnkgPSBQYXJzZS5RdWVyeS5vcihxdWVyeTEsIHF1ZXJ5MiwgcXVlcnkzKTs8L3ByZT5cbiAgICpcbiAgICogd2lsbCBjcmVhdGUgYSBjb21wb3VuZFF1ZXJ5IHRoYXQgaXMgYW4gb3Igb2YgdGhlIHF1ZXJ5MSwgcXVlcnkyLCBhbmRcbiAgICogcXVlcnkzLlxuICAgKiBAcGFyYW0gey4uLlBhcnNlLlF1ZXJ5fSB2YXJfYXJncyBUaGUgbGlzdCBvZiBxdWVyaWVzIHRvIE9SLlxuICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gVGhlIHF1ZXJ5IHRoYXQgaXMgdGhlIE9SIG9mIHRoZSBwYXNzZWQgaW4gcXVlcmllcy5cbiAgICovXG4gIFBhcnNlLlF1ZXJ5Lm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHF1ZXJpZXMgPSBfLnRvQXJyYXkoYXJndW1lbnRzKTtcbiAgICB2YXIgY2xhc3NOYW1lID0gbnVsbDtcbiAgICBQYXJzZS5fYXJyYXlFYWNoKHF1ZXJpZXMsIGZ1bmN0aW9uKHEpIHtcbiAgICAgIGlmIChfLmlzTnVsbChjbGFzc05hbWUpKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IHEuY2xhc3NOYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2xhc3NOYW1lICE9PSBxLmNsYXNzTmFtZSkge1xuICAgICAgICB0aHJvdyBcIkFsbCBxdWVyaWVzIG11c3QgYmUgZm9yIHRoZSBzYW1lIGNsYXNzXCI7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KGNsYXNzTmFtZSk7XG4gICAgcXVlcnkuX29yUXVlcnkocXVlcmllcyk7XG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9O1xuXG4gIFBhcnNlLlF1ZXJ5LnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgUGFyc2UuT2JqZWN0IHdob3NlIGlkIGlzIGFscmVhZHkga25vd24gYnkgZmV0Y2hpbmcgZGF0YSBmcm9tXG4gICAgICogdGhlIHNlcnZlci4gIEVpdGhlciBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBpcyBjYWxsZWQgd2hlbiB0aGVcbiAgICAgKiBmaW5kIGNvbXBsZXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvYmplY3RJZCBUaGUgaWQgb2YgdGhlIG9iamVjdCB0byBiZSBmZXRjaGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEEgQmFja2JvbmUtc3R5bGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogVmFsaWQgb3B0aW9ucyBhcmU6PHVsPlxuICAgICAqICAgPGxpPnN1Y2Nlc3M6IEEgQmFja2JvbmUtc3R5bGUgc3VjY2VzcyBjYWxsYmFja1xuICAgICAqICAgPGxpPmVycm9yOiBBbiBCYWNrYm9uZS1zdHlsZSBlcnJvciBjYWxsYmFjay5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiAgIDxsaT5zZXNzaW9uVG9rZW46IEEgdmFsaWQgc2Vzc2lvbiB0b2tlbiwgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdCBvblxuICAgICAqICAgICAgIGJlaGFsZiBvZiBhIHNwZWNpZmljIHVzZXIuXG4gICAgICogPC91bD5cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKG9iamVjdElkLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLmVxdWFsVG8oJ29iamVjdElkJywgb2JqZWN0SWQpO1xuXG4gICAgICB2YXIgZmlyc3RPcHRpb25zID0ge307XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmhhcyhvcHRpb25zLCAndXNlTWFzdGVyS2V5JykpIHtcbiAgICAgICAgZmlyc3RPcHRpb25zID0geyB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5IH07XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmhhcyhvcHRpb25zLCAnc2Vzc2lvblRva2VuJykpIHtcbiAgICAgICAgZmlyc3RPcHRpb25zLnNlc3Npb25Ub2tlbiA9IG9wdGlvbnMuc2Vzc2lvblRva2VuO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZi5maXJzdChmaXJzdE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVycm9yT2JqZWN0ID0gbmV3IFBhcnNlLkVycm9yKFBhcnNlLkVycm9yLk9CSkVDVF9OT1RfRk9VTkQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk9iamVjdCBub3QgZm91bmQuXCIpO1xuICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5lcnJvcihlcnJvck9iamVjdCk7XG5cbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMsIG51bGwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHF1ZXJ5LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIHF1ZXJ5LlxuICAgICAqL1xuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICB3aGVyZTogdGhpcy5fd2hlcmVcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLl9pbmNsdWRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGFyYW1zLmluY2x1ZGUgPSB0aGlzLl9pbmNsdWRlLmpvaW4oXCIsXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX3NlbGVjdCkge1xuICAgICAgICBwYXJhbXMua2V5cyA9IHRoaXMuX3NlbGVjdC5qb2luKFwiLFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9saW1pdCA+PSAwKSB7XG4gICAgICAgIHBhcmFtcy5saW1pdCA9IHRoaXMuX2xpbWl0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX3NraXAgPiAwKSB7XG4gICAgICAgIHBhcmFtcy5za2lwID0gdGhpcy5fc2tpcDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9vcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmFtcy5vcmRlciA9IHRoaXMuX29yZGVyLmpvaW4oXCIsXCIpO1xuICAgICAgfVxuXG4gICAgICBQYXJzZS5fb2JqZWN0RWFjaCh0aGlzLl9leHRyYU9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcGFyYW1zW2tdID0gdjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYSBsaXN0IG9mIFBhcnNlT2JqZWN0cyB0aGF0IHNhdGlzZnkgdGhpcyBxdWVyeS5cbiAgICAgKiBFaXRoZXIgb3B0aW9ucy5zdWNjZXNzIG9yIG9wdGlvbnMuZXJyb3IgaXMgY2FsbGVkIHdoZW4gdGhlIGZpbmRcbiAgICAgKiBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LiBWYWxpZCBvcHRpb25zXG4gICAgICogYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGZpbmQgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAgICAgKiAgIDxsaT5lcnJvcjogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBmaW5kIGZhaWxzLlxuICAgICAqICAgPGxpPnVzZU1hc3RlcktleTogSW4gQ2xvdWQgQ29kZSBhbmQgTm9kZSBvbmx5LCBjYXVzZXMgdGhlIE1hc3RlciBLZXkgdG9cbiAgICAgKiAgICAgYmUgdXNlZCBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAqICAgPGxpPnNlc3Npb25Ub2tlbjogQSB2YWxpZCBzZXNzaW9uIHRva2VuLCB1c2VkIGZvciBtYWtpbmcgYSByZXF1ZXN0IG9uXG4gICAgICogICAgICAgYmVoYWxmIG9mIGEgc3BlY2lmaWMgdXNlci5cbiAgICAgKiA8L3VsPlxuICAgICAqXG4gICAgICogQHJldHVybiB7UGFyc2UuUHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0cyB3aGVuXG4gICAgICogdGhlIHF1ZXJ5IGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBmaW5kOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHJlcXVlc3QgPSBQYXJzZS5fcmVxdWVzdCh7XG4gICAgICAgIHJvdXRlOiBcImNsYXNzZXNcIixcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLmNsYXNzTmFtZSxcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1c2VNYXN0ZXJLZXk6IG9wdGlvbnMudXNlTWFzdGVyS2V5LFxuICAgICAgICBzZXNzaW9uVG9rZW46IG9wdGlvbnMuc2Vzc2lvblRva2VuLFxuICAgICAgICBkYXRhOiB0aGlzLnRvSlNPTigpXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gXy5tYXAocmVzcG9uc2UucmVzdWx0cywgZnVuY3Rpb24oanNvbikge1xuICAgICAgICAgIHZhciBvYmo7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgb2JqID0gbmV3IFBhcnNlLk9iamVjdChyZXNwb25zZS5jbGFzc05hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmogPSBuZXcgc2VsZi5vYmplY3RDbGFzcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYmouX2ZpbmlzaEZldGNoKGpzb24sIHRydWUpO1xuICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0pO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvdW50cyB0aGUgbnVtYmVyIG9mIG9iamVjdHMgdGhhdCBtYXRjaCB0aGlzIHF1ZXJ5LlxuICAgICAqIEVpdGhlciBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBpcyBjYWxsZWQgd2hlbiB0aGUgY291bnRcbiAgICAgKiBjb21wbGV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0LiBWYWxpZCBvcHRpb25zXG4gICAgICogYXJlOjx1bD5cbiAgICAgKiAgIDxsaT5zdWNjZXNzOiBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGNvdW50IGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAgICogICA8bGk+ZXJyb3I6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZmluZCBmYWlscy5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiAgIDxsaT5zZXNzaW9uVG9rZW46IEEgdmFsaWQgc2Vzc2lvbiB0b2tlbiwgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdCBvblxuICAgICAqICAgICAgIGJlaGFsZiBvZiBhIHNwZWNpZmljIHVzZXIuXG4gICAgICogPC91bD5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIGNvdW50IHdoZW5cbiAgICAgKiB0aGUgcXVlcnkgY29tcGxldGVzLlxuICAgICAqL1xuICAgIGNvdW50OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHBhcmFtcyA9IHRoaXMudG9KU09OKCk7XG4gICAgICBwYXJhbXMubGltaXQgPSAwO1xuICAgICAgcGFyYW1zLmNvdW50ID0gMTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogc2VsZi5jbGFzc05hbWUsIFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogb3B0aW9ucy5zZXNzaW9uVG9rZW4sXG4gICAgICAgIGRhdGE6IHBhcmFtc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNvdW50O1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhdCBtb3N0IG9uZSBQYXJzZS5PYmplY3QgdGhhdCBzYXRpc2ZpZXMgdGhpcyBxdWVyeS5cbiAgICAgKlxuICAgICAqIEVpdGhlciBvcHRpb25zLnN1Y2Nlc3Mgb3Igb3B0aW9ucy5lcnJvciBpcyBjYWxsZWQgd2hlbiBpdCBjb21wbGV0ZXMuXG4gICAgICogc3VjY2VzcyBpcyBwYXNzZWQgdGhlIG9iamVjdCBpZiB0aGVyZSBpcyBvbmUuIG90aGVyd2lzZSwgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQSBCYWNrYm9uZS1zdHlsZSBvcHRpb25zIG9iamVjdC4gVmFsaWQgb3B0aW9uc1xuICAgICAqIGFyZTo8dWw+XG4gICAgICogICA8bGk+c3VjY2VzczogRnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBmaW5kIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAgICogICA8bGk+ZXJyb3I6IEZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZmluZCBmYWlscy5cbiAgICAgKiAgIDxsaT51c2VNYXN0ZXJLZXk6IEluIENsb3VkIENvZGUgYW5kIE5vZGUgb25seSwgY2F1c2VzIHRoZSBNYXN0ZXIgS2V5IHRvXG4gICAgICogICAgIGJlIHVzZWQgZm9yIHRoaXMgcmVxdWVzdC5cbiAgICAgKiAgIDxsaT5zZXNzaW9uVG9rZW46IEEgdmFsaWQgc2Vzc2lvbiB0b2tlbiwgdXNlZCBmb3IgbWFraW5nIGEgcmVxdWVzdCBvblxuICAgICAqICAgICAgIGJlaGFsZiBvZiBhIHNwZWNpZmljIHVzZXIuXG4gICAgICogPC91bD5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIG9iamVjdCB3aGVuXG4gICAgICogdGhlIHF1ZXJ5IGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBmaXJzdDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnRvSlNPTigpO1xuICAgICAgcGFyYW1zLmxpbWl0ID0gMTtcbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJjbGFzc2VzXCIsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5jbGFzc05hbWUsIFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXksXG4gICAgICAgIHNlc3Npb25Ub2tlbjogb3B0aW9ucy5zZXNzaW9uVG9rZW4sXG4gICAgICAgIGRhdGE6IHBhcmFtc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3BvbnNlLnJlc3VsdHMsIGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgICB2YXIgb2JqO1xuICAgICAgICAgIGlmIChyZXNwb25zZS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIG9iaiA9IG5ldyBQYXJzZS5PYmplY3QocmVzcG9uc2UuY2xhc3NOYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqID0gbmV3IHNlbGYub2JqZWN0Q2xhc3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JqLl9maW5pc2hGZXRjaChqc29uLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9KVswXTtcbiAgICAgIH0pLl90aGVuUnVuQ2FsbGJhY2tzKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGluc3RhbmNlIG9mIFBhcnNlLkNvbGxlY3Rpb24gYmFja2VkIGJ5IHRoaXMgcXVlcnkuXG4gICAgICogQHBhcmFtIHtBcnJheX0gaXRlbXMgQW4gYXJyYXkgb2YgaW5zdGFuY2VzIG9mIDxjb2RlPlBhcnNlLk9iamVjdDwvY29kZT5cbiAgICAgKiAgICAgd2l0aCB3aGljaCB0byBzdGFydCB0aGlzIENvbGxlY3Rpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgb2JqZWN0IHdpdGggQmFja2JvbmUtc3R5bGUgb3B0aW9ucy5cbiAgICAgKiBWYWxpZCBvcHRpb25zIGFyZTo8dWw+XG4gICAgICogICA8bGk+bW9kZWw6IFRoZSBQYXJzZS5PYmplY3Qgc3ViY2xhc3MgdGhhdCB0aGlzIGNvbGxlY3Rpb24gY29udGFpbnMuXG4gICAgICogICA8bGk+cXVlcnk6IEFuIGluc3RhbmNlIG9mIFBhcnNlLlF1ZXJ5IHRvIHVzZSB3aGVuIGZldGNoaW5nIGl0ZW1zLlxuICAgICAqICAgPGxpPmNvbXBhcmF0b3I6IEEgc3RyaW5nIHByb3BlcnR5IG5hbWUgb3IgZnVuY3Rpb24gdG8gc29ydCBieS5cbiAgICAgKiA8L3VsPlxuICAgICAqIEByZXR1cm4ge1BhcnNlLkNvbGxlY3Rpb259XG4gICAgICovXG4gICAgY29sbGVjdGlvbjogZnVuY3Rpb24oaXRlbXMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgcmV0dXJuIG5ldyBQYXJzZS5Db2xsZWN0aW9uKGl0ZW1zLCBfLmV4dGVuZChvcHRpb25zLCB7XG4gICAgICAgIG1vZGVsOiB0aGlzLm9iamVjdENsYXNzLFxuICAgICAgICBxdWVyeTogdGhpc1xuICAgICAgfSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBudW1iZXIgb2YgcmVzdWx0cyB0byBza2lwIGJlZm9yZSByZXR1cm5pbmcgYW55IHJlc3VsdHMuXG4gICAgICogVGhpcyBpcyB1c2VmdWwgZm9yIHBhZ2luYXRpb24uXG4gICAgICogRGVmYXVsdCBpcyB0byBza2lwIHplcm8gcmVzdWx0cy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiB0aGUgbnVtYmVyIG9mIHJlc3VsdHMgdG8gc2tpcC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHNraXA6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIHRoaXMuX3NraXAgPSBuO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGxpbWl0IG9mIHRoZSBudW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm4uIFRoZSBkZWZhdWx0IGxpbWl0IGlzXG4gICAgICogMTAwLCB3aXRoIGEgbWF4aW11bSBvZiAxMDAwIHJlc3VsdHMgYmVpbmcgcmV0dXJuZWQgYXQgYSB0aW1lLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIHRoZSBudW1iZXIgb2YgcmVzdWx0cyB0byBsaW1pdCB0by5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGxpbWl0OiBmdW5jdGlvbihuKSB7XG4gICAgICB0aGlzLl9saW1pdCA9IG47XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBlcXVhbCB0byB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCB0aGUgUGFyc2UuT2JqZWN0IG11c3QgY29udGFpbi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGVxdWFsVG86IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmIChfLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb2VzTm90RXhpc3Qoa2V5KTtcbiAgICAgIH0gXG5cbiAgICAgIHRoaXMuX3doZXJlW2tleV0gPSBQYXJzZS5fZW5jb2RlKHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgZm9yIGNvbmRpdGlvbiBxdWVyaWVzXG4gICAgICovXG4gICAgX2FkZENvbmRpdGlvbjogZnVuY3Rpb24oa2V5LCBjb25kaXRpb24sIHZhbHVlKSB7XG4gICAgICAvLyBDaGVjayBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBjb25kaXRpb25cbiAgICAgIGlmICghdGhpcy5fd2hlcmVba2V5XSkge1xuICAgICAgICB0aGlzLl93aGVyZVtrZXldID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLl93aGVyZVtrZXldW2NvbmRpdGlvbl0gPSBQYXJzZS5fZW5jb2RlKHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIG5vdCBlcXVhbCB0byB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCBtdXN0IG5vdCBiZSBlcXVhbGxlZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG5vdEVxdWFsVG86IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJG5lXCIsIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGxlc3MgdGhhbiB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdGhhdCBwcm92aWRlcyBhbiB1cHBlciBib3VuZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGxlc3NUaGFuOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRsdFwiLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBncmVhdGVyIHRoYW4gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgcHJvdmlkZXMgYW4gbG93ZXIgYm91bmQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBncmVhdGVyVGhhbjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkZ3RcIiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzIHZhbHVlIHRvXG4gICAgICogYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0aGF0IHByb3ZpZGVzIGFuIHVwcGVyIGJvdW5kLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbGVzc1RoYW5PckVxdWFsVG86IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGx0ZVwiLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCB0byB0aGUgcXVlcnkgdGhhdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIga2V5J3MgdmFsdWUgdG9cbiAgICAgKiBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgcHJvdmlkZXMgYW4gbG93ZXIgYm91bmQuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBncmVhdGVyVGhhbk9yRXF1YWxUbzogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkZ3RlXCIsIHZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGJlIGNvbnRhaW5lZCBpbiB0aGUgcHJvdmlkZWQgbGlzdCBvZiB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRoYXQgd2lsbCBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGNvbnRhaW5lZEluOiBmdW5jdGlvbihrZXksIHZhbHVlcykge1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkaW5cIiwgdmFsdWVzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIG5vdCBiZSBjb250YWluZWQgaW4gdGhlIHByb3ZpZGVkIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0aGF0IHdpbGwgbm90IG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbm90Q29udGFpbmVkSW46IGZ1bmN0aW9uKGtleSwgdmFsdWVzKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRuaW5cIiwgdmFsdWVzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBxdWVyeSB0aGF0IHJlcXVpcmVzIGEgcGFydGljdWxhciBrZXkncyB2YWx1ZSB0b1xuICAgICAqIGNvbnRhaW4gZWFjaCBvbmUgb2YgdGhlIHByb3ZpZGVkIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay4gIFRoaXMga2V5J3MgdmFsdWUgbXVzdCBiZSBhbiBhcnJheS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0aGF0IHdpbGwgbWF0Y2guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBjb250YWluc0FsbDogZnVuY3Rpb24oa2V5LCB2YWx1ZXMpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGFsbFwiLCB2YWx1ZXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHRoYXQgY29udGFpbiB0aGUgZ2l2ZW4ga2V5LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHNob3VsZCBleGlzdC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGV4aXN0czogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRleGlzdHNcIiwgdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHRoYXQgZG8gbm90IGNvbnRhaW4gYSBnaXZlbiBrZXkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgc2hvdWxkIG5vdCBleGlzdFxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZG9lc05vdEV4aXN0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGV4aXN0c1wiLCBmYWxzZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcmVndWxhciBleHByZXNzaW9uIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgc3RyaW5nIHZhbHVlcyB0aGF0IG1hdGNoXG4gICAgICogdGhlIHByb3ZpZGVkIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgKiBUaGlzIG1heSBiZSBzbG93IGZvciBsYXJnZSBkYXRhc2V0cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgc3RyaW5nIHRvIG1hdGNoIGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnZXggVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuIHRvIG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbWF0Y2hlczogZnVuY3Rpb24oa2V5LCByZWdleCwgbW9kaWZpZXJzKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCByZWdleCk7XG4gICAgICBpZiAoIW1vZGlmaWVycykgeyBtb2RpZmllcnMgPSBcIlwiOyB9XG4gICAgICAvLyBKYXZhc2NyaXB0IHJlZ2V4IG9wdGlvbnMgc3VwcG9ydCBtaWcgYXMgaW5saW5lIG9wdGlvbnMgYnV0IHN0b3JlIHRoZW0gXG4gICAgICAvLyBhcyBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QuIFdlIHN1cHBvcnQgbWkgJiBzaG91bGQgbWlncmF0ZSB0aGVtIHRvXG4gICAgICAvLyBtb2RpZmllcnNcbiAgICAgIGlmIChyZWdleC5pZ25vcmVDYXNlKSB7IG1vZGlmaWVycyArPSAnaSc7IH1cbiAgICAgIGlmIChyZWdleC5tdWx0aWxpbmUpIHsgbW9kaWZpZXJzICs9ICdtJzsgfVxuXG4gICAgICBpZiAobW9kaWZpZXJzICYmIG1vZGlmaWVycy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkb3B0aW9uc1wiLCBtb2RpZmllcnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdGhhdCByZXF1aXJlcyB0aGF0IGEga2V5J3MgdmFsdWUgbWF0Y2hlcyBhIFBhcnNlLlF1ZXJ5XG4gICAgICogY29uc3RyYWludC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgY29udGFpbnMgdGhlIG9iamVjdCB0byBtYXRjaCB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuUXVlcnl9IHF1ZXJ5IFRoZSBxdWVyeSB0aGF0IHNob3VsZCBtYXRjaC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG1hdGNoZXNRdWVyeTogZnVuY3Rpb24oa2V5LCBxdWVyeSkge1xuICAgICAgdmFyIHF1ZXJ5SlNPTiA9IHF1ZXJ5LnRvSlNPTigpO1xuICAgICAgcXVlcnlKU09OLmNsYXNzTmFtZSA9IHF1ZXJ5LmNsYXNzTmFtZTtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGluUXVlcnlcIiwgcXVlcnlKU09OKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdGhhdCByZXF1aXJlcyB0aGF0IGEga2V5J3MgdmFsdWUgbm90IG1hdGNoZXMgYVxuICAgICAqIFBhcnNlLlF1ZXJ5IGNvbnN0cmFpbnQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIGNvbnRhaW5zIHRoZSBvYmplY3QgdG8gbWF0Y2ggdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLlF1ZXJ5fSBxdWVyeSBUaGUgcXVlcnkgdGhhdCBzaG91bGQgbm90IG1hdGNoLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZG9lc05vdE1hdGNoUXVlcnk6IGZ1bmN0aW9uKGtleSwgcXVlcnkpIHtcbiAgICAgIHZhciBxdWVyeUpTT04gPSBxdWVyeS50b0pTT04oKTtcbiAgICAgIHF1ZXJ5SlNPTi5jbGFzc05hbWUgPSBxdWVyeS5jbGFzc05hbWU7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRub3RJblF1ZXJ5XCIsIHF1ZXJ5SlNPTik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRoYXQgcmVxdWlyZXMgdGhhdCBhIGtleSdzIHZhbHVlIG1hdGNoZXMgYSB2YWx1ZSBpblxuICAgICAqIGFuIG9iamVjdCByZXR1cm5lZCBieSBhIGRpZmZlcmVudCBQYXJzZS5RdWVyeS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgdGhhdCBpcyBiZWluZ1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnlLZXkgVGhlIGtleSBpbiB0aGUgb2JqZWN0cyByZXR1cm5lZCBieSB0aGUgcXVlcnkgdG9cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggYWdhaW5zdC5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLlF1ZXJ5fSBxdWVyeSBUaGUgcXVlcnkgdG8gcnVuLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgbWF0Y2hlc0tleUluUXVlcnk6IGZ1bmN0aW9uKGtleSwgcXVlcnlLZXksIHF1ZXJ5KSB7XG4gICAgICB2YXIgcXVlcnlKU09OID0gcXVlcnkudG9KU09OKCk7XG4gICAgICBxdWVyeUpTT04uY2xhc3NOYW1lID0gcXVlcnkuY2xhc3NOYW1lO1xuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkc2VsZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgeyBrZXk6IHF1ZXJ5S2V5LCBxdWVyeTogcXVlcnlKU09OIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdGhhdCByZXF1aXJlcyB0aGF0IGEga2V5J3MgdmFsdWUgbm90IG1hdGNoIGEgdmFsdWUgaW5cbiAgICAgKiBhbiBvYmplY3QgcmV0dXJuZWQgYnkgYSBkaWZmZXJlbnQgUGFyc2UuUXVlcnkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIHRoYXQgaXMgYmVpbmdcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeUtleSBUaGUga2V5IGluIHRoZSBvYmplY3RzIHJldHVybmVkIGJ5IHRoZSBxdWVyeSB0b1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCBhZ2FpbnN0LlxuICAgICAqIEBwYXJhbSB7UGFyc2UuUXVlcnl9IHF1ZXJ5IFRoZSBxdWVyeSB0byBydW4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBkb2VzTm90TWF0Y2hLZXlJblF1ZXJ5OiBmdW5jdGlvbihrZXksIHF1ZXJ5S2V5LCBxdWVyeSkge1xuICAgICAgdmFyIHF1ZXJ5SlNPTiA9IHF1ZXJ5LnRvSlNPTigpO1xuICAgICAgcXVlcnlKU09OLmNsYXNzTmFtZSA9IHF1ZXJ5LmNsYXNzTmFtZTtcbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksIFwiJGRvbnRTZWxlY3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICB7IGtleTogcXVlcnlLZXksIHF1ZXJ5OiBxdWVyeUpTT04gfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGNvbnN0cmFpbnQgdGhhdCBhdCBsZWFzdCBvbmUgb2YgdGhlIHBhc3NlZCBpbiBxdWVyaWVzIG1hdGNoZXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gcXVlcmllc1xuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgX29yUXVlcnk6IGZ1bmN0aW9uKHF1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeUpTT04gPSBfLm1hcChxdWVyaWVzLCBmdW5jdGlvbihxKSB7XG4gICAgICAgIHJldHVybiBxLnRvSlNPTigpLndoZXJlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3doZXJlLiRvciA9IHF1ZXJ5SlNPTjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhIHN0cmluZyBpbnRvIGEgcmVnZXggdGhhdCBtYXRjaGVzIGl0LlxuICAgICAqIFN1cnJvdW5kaW5nIHdpdGggXFxRIC4uIFxcRSBkb2VzIHRoaXMsIHdlIGp1c3QgbmVlZCB0byBlc2NhcGUgXFxFJ3MgaW5cbiAgICAgKiB0aGUgdGV4dCBzZXBhcmF0ZWx5LlxuICAgICAqL1xuICAgIF9xdW90ZTogZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIFwiXFxcXFFcIiArIHMucmVwbGFjZShcIlxcXFxFXCIsIFwiXFxcXEVcXFxcXFxcXEVcXFxcUVwiKSArIFwiXFxcXEVcIjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBzdHJpbmcgdmFsdWVzIHRoYXQgY29udGFpbiBhIHByb3ZpZGVkXG4gICAgICogc3RyaW5nLiAgVGhpcyBtYXkgYmUgc2xvdyBmb3IgbGFyZ2UgZGF0YXNldHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIHN0cmluZyB0byBtYXRjaCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN1YnN0cmluZyBUaGUgc3Vic3RyaW5nIHRoYXQgdGhlIHZhbHVlIG11c3QgY29udGFpbi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCB0aGlzLl9xdW90ZSh2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgc3RyaW5nIHZhbHVlcyB0aGF0IHN0YXJ0IHdpdGggYSBwcm92aWRlZFxuICAgICAqIHN0cmluZy4gIFRoaXMgcXVlcnkgd2lsbCB1c2UgdGhlIGJhY2tlbmQgaW5kZXgsIHNvIGl0IHdpbGwgYmUgZmFzdCBldmVuXG4gICAgICogZm9yIGxhcmdlIGRhdGFzZXRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBzdHJpbmcgdG8gbWF0Y2ggaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggVGhlIHN1YnN0cmluZyB0aGF0IHRoZSB2YWx1ZSBtdXN0IHN0YXJ0IHdpdGguXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBzdGFydHNXaXRoOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCBcIl5cIiArIHRoaXMuX3F1b3RlKHZhbHVlKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29uc3RyYWludCBmb3IgZmluZGluZyBzdHJpbmcgdmFsdWVzIHRoYXQgZW5kIHdpdGggYSBwcm92aWRlZFxuICAgICAqIHN0cmluZy4gIFRoaXMgd2lsbCBiZSBzbG93IGZvciBsYXJnZSBkYXRhc2V0cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgc3RyaW5nIHRvIG1hdGNoIGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3VmZml4IFRoZSBzdWJzdHJpbmcgdGhhdCB0aGUgdmFsdWUgbXVzdCBlbmQgd2l0aC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGVuZHNXaXRoOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRyZWdleFwiLCB0aGlzLl9xdW90ZSh2YWx1ZSkgKyBcIiRcIik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU29ydHMgdGhlIHJlc3VsdHMgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSBnaXZlbiBrZXkuXG4gICAgICogXG4gICAgICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdfC4uLlN0cmluZ30ga2V5IFRoZSBrZXkgdG8gb3JkZXIgYnksIHdoaWNoIGlzIGEgXG4gICAgICogc3RyaW5nIG9mIGNvbW1hIHNlcGFyYXRlZCB2YWx1ZXMsIG9yIGFuIEFycmF5IG9mIGtleXMsIG9yIG11bHRpcGxlIGtleXMuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBhc2NlbmRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgIHJldHVybiB0aGlzLmFkZEFzY2VuZGluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgcmVzdWx0cyBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdGhlIGdpdmVuIGtleSwgXG4gICAgICogYnV0IGNhbiBhbHNvIGFkZCBzZWNvbmRhcnkgc29ydCBkZXNjcmlwdG9ycyB3aXRob3V0IG92ZXJ3cml0aW5nIF9vcmRlci5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyhTdHJpbmd8U3RyaW5nW118Li4uU3RyaW5nfSBrZXkgVGhlIGtleSB0byBvcmRlciBieSwgd2hpY2ggaXMgYVxuICAgICAqIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgdmFsdWVzLCBvciBhbiBBcnJheSBvZiBrZXlzLCBvciBtdWx0aXBsZSBrZXlzLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgYWRkQXNjZW5kaW5nOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpczsgXG4gICAgICBpZiAoIXRoaXMuX29yZGVyKSB7XG4gICAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgICB9XG4gICAgICBQYXJzZS5fYXJyYXlFYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXkuam9pbigpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX29yZGVyID0gc2VsZi5fb3JkZXIuY29uY2F0KGtleS5yZXBsYWNlKC9cXHMvZywgXCJcIikuc3BsaXQoXCIsXCIpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNvcnRzIHRoZSByZXN1bHRzIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdGhlIGdpdmVuIGtleS5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyhTdHJpbmd8U3RyaW5nW118Li4uU3RyaW5nfSBrZXkgVGhlIGtleSB0byBvcmRlciBieSwgd2hpY2ggaXMgYVxuICAgICAqIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgdmFsdWVzLCBvciBhbiBBcnJheSBvZiBrZXlzLCBvciBtdWx0aXBsZSBrZXlzLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgZGVzY2VuZGluZzogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgcmV0dXJuIHRoaXMuYWRkRGVzY2VuZGluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgcmVzdWx0cyBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSBnaXZlbiBrZXksXG4gICAgICogYnV0IGNhbiBhbHNvIGFkZCBzZWNvbmRhcnkgc29ydCBkZXNjcmlwdG9ycyB3aXRob3V0IG92ZXJ3cml0aW5nIF9vcmRlci5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyhTdHJpbmd8U3RyaW5nW118Li4uU3RyaW5nfSBrZXkgVGhlIGtleSB0byBvcmRlciBieSwgd2hpY2ggaXMgYVxuICAgICAqIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgdmFsdWVzLCBvciBhbiBBcnJheSBvZiBrZXlzLCBvciBtdWx0aXBsZSBrZXlzLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlF1ZXJ5fSBSZXR1cm5zIHRoZSBxdWVyeSwgc28geW91IGNhbiBjaGFpbiB0aGlzIGNhbGwuXG4gICAgICovXG4gICAgYWRkRGVzY2VuZGluZzogZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7IFxuICAgICAgaWYgKCF0aGlzLl9vcmRlcikge1xuICAgICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgfVxuICAgICAgUGFyc2UuX2FycmF5RWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5LmpvaW4oKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9vcmRlciA9IHNlbGYuX29yZGVyLmNvbmNhdChcbiAgICAgICAgICBfLm1hcChrZXkucmVwbGFjZSgvXFxzL2csIFwiXCIpLnNwbGl0KFwiLFwiKSwgXG4gICAgICAgICAgICBmdW5jdGlvbihrKSB7IHJldHVybiBcIi1cIiArIGs7IH0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3hpbWl0eSBiYXNlZCBjb25zdHJhaW50IGZvciBmaW5kaW5nIG9iamVjdHMgd2l0aCBrZXkgcG9pbnRcbiAgICAgKiB2YWx1ZXMgbmVhciB0aGUgcG9pbnQgZ2l2ZW4uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIFBhcnNlLkdlb1BvaW50IGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCBUaGUgcmVmZXJlbmNlIFBhcnNlLkdlb1BvaW50IHRoYXQgaXMgdXNlZC5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIG5lYXI6IGZ1bmN0aW9uKGtleSwgcG9pbnQpIHtcbiAgICAgIGlmICghKHBvaW50IGluc3RhbmNlb2YgUGFyc2UuR2VvUG9pbnQpKSB7XG4gICAgICAgIC8vIFRyeSB0byBjYXN0IGl0IHRvIGEgR2VvUG9pbnQsIHNvIHRoYXQgbmVhcihcImxvY1wiLCBbMjAsMzBdKSB3b3Jrcy5cbiAgICAgICAgcG9pbnQgPSBuZXcgUGFyc2UuR2VvUG9pbnQocG9pbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYWRkQ29uZGl0aW9uKGtleSwgXCIkbmVhclNwaGVyZVwiLCBwb2ludCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJveGltaXR5IGJhc2VkIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB3aXRoIGtleSBwb2ludFxuICAgICAqIHZhbHVlcyBuZWFyIHRoZSBwb2ludCBnaXZlbiBhbmQgd2l0aGluIHRoZSBtYXhpbXVtIGRpc3RhbmNlIGdpdmVuLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGtleSB0aGF0IHRoZSBQYXJzZS5HZW9Qb2ludCBpcyBzdG9yZWQgaW4uXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gcG9pbnQgVGhlIHJlZmVyZW5jZSBQYXJzZS5HZW9Qb2ludCB0aGF0IGlzIHVzZWQuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG1heERpc3RhbmNlIE1heGltdW0gZGlzdGFuY2UgKGluIHJhZGlhbnMpIG9mIHJlc3VsdHMgdG9cbiAgICAgKiAgIHJldHVybi5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIHdpdGhpblJhZGlhbnM6IGZ1bmN0aW9uKGtleSwgcG9pbnQsIGRpc3RhbmNlKSB7XG4gICAgICB0aGlzLm5lYXIoa2V5LCBwb2ludCk7XG4gICAgICB0aGlzLl9hZGRDb25kaXRpb24oa2V5LCBcIiRtYXhEaXN0YW5jZVwiLCBkaXN0YW5jZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJveGltaXR5IGJhc2VkIGNvbnN0cmFpbnQgZm9yIGZpbmRpbmcgb2JqZWN0cyB3aXRoIGtleSBwb2ludFxuICAgICAqIHZhbHVlcyBuZWFyIHRoZSBwb2ludCBnaXZlbiBhbmQgd2l0aGluIHRoZSBtYXhpbXVtIGRpc3RhbmNlIGdpdmVuLlxuICAgICAqIFJhZGl1cyBvZiBlYXJ0aCB1c2VkIGlzIDM5NTguOCBtaWxlcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBrZXkgdGhhdCB0aGUgUGFyc2UuR2VvUG9pbnQgaXMgc3RvcmVkIGluLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHBvaW50IFRoZSByZWZlcmVuY2UgUGFyc2UuR2VvUG9pbnQgdGhhdCBpcyB1c2VkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhEaXN0YW5jZSBNYXhpbXVtIGRpc3RhbmNlIChpbiBtaWxlcykgb2YgcmVzdWx0cyB0b1xuICAgICAqICAgICByZXR1cm4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICB3aXRoaW5NaWxlczogZnVuY3Rpb24oa2V5LCBwb2ludCwgZGlzdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLndpdGhpblJhZGlhbnMoa2V5LCBwb2ludCwgZGlzdGFuY2UgLyAzOTU4LjgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm94aW1pdHkgYmFzZWQgY29uc3RyYWludCBmb3IgZmluZGluZyBvYmplY3RzIHdpdGgga2V5IHBvaW50XG4gICAgICogdmFsdWVzIG5lYXIgdGhlIHBvaW50IGdpdmVuIGFuZCB3aXRoaW4gdGhlIG1heGltdW0gZGlzdGFuY2UgZ2l2ZW4uXG4gICAgICogUmFkaXVzIG9mIGVhcnRoIHVzZWQgaXMgNjM3MS4wIGtpbG9tZXRlcnMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRoYXQgdGhlIFBhcnNlLkdlb1BvaW50IGlzIHN0b3JlZCBpbi5cbiAgICAgKiBAcGFyYW0ge1BhcnNlLkdlb1BvaW50fSBwb2ludCBUaGUgcmVmZXJlbmNlIFBhcnNlLkdlb1BvaW50IHRoYXQgaXMgdXNlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbWF4RGlzdGFuY2UgTWF4aW11bSBkaXN0YW5jZSAoaW4ga2lsb21ldGVycykgb2YgcmVzdWx0c1xuICAgICAqICAgICB0byByZXR1cm4uXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICB3aXRoaW5LaWxvbWV0ZXJzOiBmdW5jdGlvbihrZXksIHBvaW50LCBkaXN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMud2l0aGluUmFkaWFucyhrZXksIHBvaW50LCBkaXN0YW5jZSAvIDYzNzEuMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbnN0cmFpbnQgdG8gdGhlIHF1ZXJ5IHRoYXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIGtleSdzXG4gICAgICogY29vcmRpbmF0ZXMgYmUgY29udGFpbmVkIHdpdGhpbiBhIGdpdmVuIHJlY3Rhbmd1bGFyIGdlb2dyYXBoaWMgYm91bmRpbmdcbiAgICAgKiBib3guXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IHRvIGJlIGNvbnN0cmFpbmVkLlxuICAgICAqIEBwYXJhbSB7UGFyc2UuR2VvUG9pbnR9IHNvdXRod2VzdFxuICAgICAqICAgICBUaGUgbG93ZXItbGVmdCBpbmNsdXNpdmUgY29ybmVyIG9mIHRoZSBib3guXG4gICAgICogQHBhcmFtIHtQYXJzZS5HZW9Qb2ludH0gbm9ydGhlYXN0XG4gICAgICogICAgIFRoZSB1cHBlci1yaWdodCBpbmNsdXNpdmUgY29ybmVyIG9mIHRoZSBib3guXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICB3aXRoaW5HZW9Cb3g6IGZ1bmN0aW9uKGtleSwgc291dGh3ZXN0LCBub3J0aGVhc3QpIHtcbiAgICAgIGlmICghKHNvdXRod2VzdCBpbnN0YW5jZW9mIFBhcnNlLkdlb1BvaW50KSkge1xuICAgICAgICBzb3V0aHdlc3QgPSBuZXcgUGFyc2UuR2VvUG9pbnQoc291dGh3ZXN0KTtcbiAgICAgIH1cbiAgICAgIGlmICghKG5vcnRoZWFzdCBpbnN0YW5jZW9mIFBhcnNlLkdlb1BvaW50KSkge1xuICAgICAgICBub3J0aGVhc3QgPSBuZXcgUGFyc2UuR2VvUG9pbnQobm9ydGhlYXN0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FkZENvbmRpdGlvbihrZXksICckd2l0aGluJywgeyAnJGJveCc6IFtzb3V0aHdlc3QsIG5vcnRoZWFzdF0gfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW5jbHVkZSBuZXN0ZWQgUGFyc2UuT2JqZWN0cyBmb3IgdGhlIHByb3ZpZGVkIGtleS4gIFlvdSBjYW4gdXNlIGRvdFxuICAgICAqIG5vdGF0aW9uIHRvIHNwZWNpZnkgd2hpY2ggZmllbGRzIGluIHRoZSBpbmNsdWRlZCBvYmplY3QgYXJlIGFsc28gZmV0Y2hlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBuYW1lIG9mIHRoZSBrZXkgdG8gaW5jbHVkZS5cbiAgICAgKiBAcmV0dXJuIHtQYXJzZS5RdWVyeX0gUmV0dXJucyB0aGUgcXVlcnksIHNvIHlvdSBjYW4gY2hhaW4gdGhpcyBjYWxsLlxuICAgICAqL1xuICAgIGluY2x1ZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBzZWxmLl9pbmNsdWRlID0gc2VsZi5faW5jbHVkZS5jb25jYXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLl9pbmNsdWRlLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVzdHJpY3QgdGhlIGZpZWxkcyBvZiB0aGUgcmV0dXJuZWQgUGFyc2UuT2JqZWN0cyB0byBpbmNsdWRlIG9ubHkgdGhlXG4gICAgICogcHJvdmlkZWQga2V5cy4gIElmIHRoaXMgaXMgY2FsbGVkIG11bHRpcGxlIHRpbWVzLCB0aGVuIGFsbCBvZiB0aGUga2V5c1xuICAgICAqIHNwZWNpZmllZCBpbiBlYWNoIG9mIHRoZSBjYWxscyB3aWxsIGJlIGluY2x1ZGVkLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXMgVGhlIG5hbWVzIG9mIHRoZSBrZXlzIHRvIGluY2x1ZGUuXG4gICAgICogQHJldHVybiB7UGFyc2UuUXVlcnl9IFJldHVybnMgdGhlIHF1ZXJ5LCBzbyB5b3UgY2FuIGNoYWluIHRoaXMgY2FsbC5cbiAgICAgKi9cbiAgICBzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5fc2VsZWN0ID0gdGhpcy5fc2VsZWN0IHx8IFtdO1xuICAgICAgUGFyc2UuX2FycmF5RWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBzZWxmLl9zZWxlY3QgPSBzZWxmLl9zZWxlY3QuY29uY2F0KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fc2VsZWN0LnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgb3ZlciBlYWNoIHJlc3VsdCBvZiBhIHF1ZXJ5LCBjYWxsaW5nIGEgY2FsbGJhY2sgZm9yIGVhY2ggb25lLiBJZlxuICAgICAqIHRoZSBjYWxsYmFjayByZXR1cm5zIGEgcHJvbWlzZSwgdGhlIGl0ZXJhdGlvbiB3aWxsIG5vdCBjb250aW51ZSB1bnRpbFxuICAgICAqIHRoYXQgcHJvbWlzZSBoYXMgYmVlbiBmdWxmaWxsZWQuIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIGEgcmVqZWN0ZWRcbiAgICAgKiBwcm9taXNlLCB0aGVuIGl0ZXJhdGlvbiB3aWxsIHN0b3Agd2l0aCB0aGF0IGVycm9yLiBUaGUgaXRlbXMgYXJlXG4gICAgICogcHJvY2Vzc2VkIGluIGFuIHVuc3BlY2lmaWVkIG9yZGVyLiBUaGUgcXVlcnkgbWF5IG5vdCBoYXZlIGFueSBzb3J0IG9yZGVyLFxuICAgICAqIGFuZCBtYXkgbm90IHVzZSBsaW1pdCBvciBza2lwLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBlYWNoIHJlc3VsdFxuICAgICAqICAgICBvZiB0aGUgcXVlcnkuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb3B0aW9uYWwgQmFja2JvbmUtbGlrZSBvcHRpb25zIG9iamVjdCB3aXRoXG4gICAgICogICAgIHN1Y2Nlc3MgYW5kIGVycm9yIGNhbGxiYWNrcyB0aGF0IHdpbGwgYmUgaW52b2tlZCBvbmNlIHRoZSBpdGVyYXRpb25cbiAgICAgKiAgICAgaGFzIGZpbmlzaGVkLlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIG9uY2UgdGhlXG4gICAgICogICAgIGl0ZXJhdGlvbiBoYXMgY29tcGxldGVkLlxuICAgICAqL1xuICAgIGVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaWYgKHRoaXMuX29yZGVyIHx8IHRoaXMuX3NraXAgfHwgKHRoaXMuX2xpbWl0ID49IDApKSB7XG4gICAgICAgIHZhciBlcnJvciA9XG4gICAgICAgICAgXCJDYW5ub3QgaXRlcmF0ZSBvbiBhIHF1ZXJ5IHdpdGggc29ydCwgc2tpcCwgb3IgbGltaXQuXCI7XG4gICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmVycm9yKGVycm9yKS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUGFyc2UuUHJvbWlzZSgpO1xuXG4gICAgICB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkodGhpcy5vYmplY3RDbGFzcyk7XG4gICAgICAvLyBXZSBjYW4gb3ZlcnJpZGUgdGhlIGJhdGNoIHNpemUgZnJvbSB0aGUgb3B0aW9ucy5cbiAgICAgIC8vIFRoaXMgaXMgdW5kb2N1bWVudGVkLCBidXQgdXNlZnVsIGZvciB0ZXN0aW5nLlxuICAgICAgcXVlcnkuX2xpbWl0ID0gb3B0aW9ucy5iYXRjaFNpemUgfHwgMTAwO1xuICAgICAgcXVlcnkuX3doZXJlID0gXy5jbG9uZSh0aGlzLl93aGVyZSk7XG4gICAgICBxdWVyeS5faW5jbHVkZSA9IF8uY2xvbmUodGhpcy5faW5jbHVkZSk7XG4gICAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICAgIHF1ZXJ5Ll9zZWxlY3QgPSBfLmNsb25lKHRoaXMuX3NlbGVjdCk7XG4gICAgICB9XG5cbiAgICAgIHF1ZXJ5LmFzY2VuZGluZygnb2JqZWN0SWQnKTtcblxuICAgICAgdmFyIGZpbmRPcHRpb25zID0ge307XG4gICAgICBpZiAoXy5oYXMob3B0aW9ucywgXCJ1c2VNYXN0ZXJLZXlcIikpIHtcbiAgICAgICAgZmluZE9wdGlvbnMudXNlTWFzdGVyS2V5ID0gb3B0aW9ucy51c2VNYXN0ZXJLZXk7XG4gICAgICB9XG4gICAgICBpZiAoXy5oYXMob3B0aW9ucywgJ3Nlc3Npb25Ub2tlbicpKSB7XG4gICAgICAgIGZpbmRPcHRpb25zLnNlc3Npb25Ub2tlbiA9IG9wdGlvbnMuc2Vzc2lvblRva2VuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmluaXNoZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLl9jb250aW51ZVdoaWxlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIWZpbmlzaGVkO1xuXG4gICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5LmZpbmQoZmluZE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgIHZhciBjYWxsYmFja3NEb25lID0gUGFyc2UuUHJvbWlzZS5hcygpO1xuICAgICAgICAgIFBhcnNlLl8uZWFjaChyZXN1bHRzLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrc0RvbmUgPSBjYWxsYmFja3NEb25lLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2tzRG9uZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID49IHF1ZXJ5Ll9saW1pdCkge1xuICAgICAgICAgICAgICBxdWVyeS5ncmVhdGVyVGhhbihcIm9iamVjdElkXCIsIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGggLSAxXS5pZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkuX3RoZW5SdW5DYWxsYmFja3Mob3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG59KHRoaXMpKTtcblxuLypnbG9iYWwgRkI6IGZhbHNlICwgY29uc29sZTogZmFsc2UqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICB2YXIgUFVCTElDX0tFWSA9IFwiKlwiO1xuXG4gIHZhciBpbml0aWFsaXplZCA9IGZhbHNlO1xuICB2YXIgcmVxdWVzdGVkUGVybWlzc2lvbnM7XG4gIHZhciBpbml0T3B0aW9ucztcbiAgdmFyIHByb3ZpZGVyID0ge1xuICAgIGF1dGhlbnRpY2F0ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgRkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhzZWxmLCB7XG4gICAgICAgICAgICAgIGlkOiByZXNwb25zZS5hdXRoUmVzcG9uc2UudXNlcklELFxuICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbl9kYXRlOiBuZXcgRGF0ZShyZXNwb25zZS5hdXRoUmVzcG9uc2UuZXhwaXJlc0luICogMTAwMCArXG4gICAgICAgICAgICAgICAgICAobmV3IERhdGUoKSkuZ2V0VGltZSgpKS50b0pTT04oKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICBvcHRpb25zLmVycm9yKHNlbGYsIHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgc2NvcGU6IHJlcXVlc3RlZFBlcm1pc3Npb25zXG4gICAgICB9KTtcbiAgICB9LFxuICAgIHJlc3RvcmVBdXRoZW50aWNhdGlvbjogZnVuY3Rpb24oYXV0aERhdGEpIHtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICB2YXIgYXV0aFJlc3BvbnNlID0ge1xuICAgICAgICAgIHVzZXJJRDogYXV0aERhdGEuaWQsXG4gICAgICAgICAgYWNjZXNzVG9rZW46IGF1dGhEYXRhLmFjY2Vzc190b2tlbixcbiAgICAgICAgICBleHBpcmVzSW46IChQYXJzZS5fcGFyc2VEYXRlKGF1dGhEYXRhLmV4cGlyYXRpb25fZGF0ZSkuZ2V0VGltZSgpIC1cbiAgICAgICAgICAgICAgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkgLyAxMDAwXG4gICAgICAgIH07XG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShpbml0T3B0aW9ucyk7XG4gICAgICAgIG5ld09wdGlvbnMuYXV0aFJlc3BvbnNlID0gYXV0aFJlc3BvbnNlO1xuXG4gICAgICAgIC8vIFN1cHByZXNzIGNoZWNrcyBmb3IgbG9naW4gc3RhdHVzIGZyb20gdGhlIGJyb3dzZXIuXG4gICAgICAgIG5ld09wdGlvbnMuc3RhdHVzID0gZmFsc2U7XG5cbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgZG9lc24ndCBtYXRjaCB0aGUgb25lIGtub3duIGJ5IHRoZSBGQiBTREssIGxvZyBvdXQuXG4gICAgICAgIC8vIE1vc3Qgb2YgdGhlIHRpbWUsIHRoZSB1c2VycyB3aWxsIG1hdGNoIC0tIGl0J3Mgb25seSBpbiBjYXNlcyB3aGVyZVxuICAgICAgICAvLyB0aGUgRkIgU0RLIGtub3dzIG9mIGEgZGlmZmVyZW50IHVzZXIgdGhhbiB0aGUgb25lIGJlaW5nIHJlc3RvcmVkXG4gICAgICAgIC8vIGZyb20gYSBQYXJzZSBVc2VyIHRoYXQgbG9nZ2VkIGluIHdpdGggdXNlcm5hbWUvcGFzc3dvcmQuXG4gICAgICAgIHZhciBleGlzdGluZ1Jlc3BvbnNlID0gRkIuZ2V0QXV0aFJlc3BvbnNlKCk7XG4gICAgICAgIGlmIChleGlzdGluZ1Jlc3BvbnNlICYmXG4gICAgICAgICAgICBleGlzdGluZ1Jlc3BvbnNlLnVzZXJJRCAhPT0gYXV0aFJlc3BvbnNlLnVzZXJJRCkge1xuICAgICAgICAgIEZCLmxvZ291dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgRkIuaW5pdChuZXdPcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZ2V0QXV0aFR5cGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFwiZmFjZWJvb2tcIjtcbiAgICB9LFxuICAgIGRlYXV0aGVudGljYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucmVzdG9yZUF1dGhlbnRpY2F0aW9uKG51bGwpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBzZXQgb2YgdXRpbGl0aWVzIGZvciB1c2luZyBQYXJzZSB3aXRoIEZhY2Vib29rLlxuICAgKiBAbmFtZXNwYWNlXG4gICAqIFByb3ZpZGVzIGEgc2V0IG9mIHV0aWxpdGllcyBmb3IgdXNpbmcgUGFyc2Ugd2l0aCBGYWNlYm9vay5cbiAgICovXG4gIFBhcnNlLkZhY2Vib29rVXRpbHMgPSB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgUGFyc2UgRmFjZWJvb2sgaW50ZWdyYXRpb24uICBDYWxsIHRoaXMgZnVuY3Rpb24gYWZ0ZXIgeW91XG4gICAgICogaGF2ZSBsb2FkZWQgdGhlIEZhY2Vib29rIEphdmFzY3JpcHQgU0RLIHdpdGggdGhlIHNhbWUgcGFyYW1ldGVyc1xuICAgICAqIGFzIHlvdSB3b3VsZCBwYXNzIHRvPGNvZGU+XG4gICAgICogPGEgaHJlZj1cbiAgICAgKiBcImh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9yZWZlcmVuY2UvamF2YXNjcmlwdC9GQi5pbml0L1wiPlxuICAgICAqIEZCLmluaXQoKTwvYT48L2NvZGU+LiAgUGFyc2UuRmFjZWJvb2tVdGlscyB3aWxsIGludm9rZSBGQi5pbml0KCkgZm9yIHlvdVxuICAgICAqIHdpdGggdGhlc2UgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgRmFjZWJvb2sgb3B0aW9ucyBhcmd1bWVudCBhcyBkZXNjcmliZWQgaGVyZTpcbiAgICAgKiAgIDxhIGhyZWY9XG4gICAgICogICBcImh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9yZWZlcmVuY2UvamF2YXNjcmlwdC9GQi5pbml0L1wiPlxuICAgICAqICAgRkIuaW5pdCgpPC9hPi4gVGhlIHN0YXR1cyBmbGFnIHdpbGwgYmUgY29lcmNlZCB0byAnZmFsc2UnIGJlY2F1c2UgaXRcbiAgICAgKiAgIGludGVyZmVyZXMgd2l0aCBQYXJzZSBGYWNlYm9vayBpbnRlZ3JhdGlvbi4gQ2FsbCBGQi5nZXRMb2dpblN0YXR1cygpXG4gICAgICogICBleHBsaWNpdGx5IGlmIHRoaXMgYmVoYXZpb3IgaXMgcmVxdWlyZWQgYnkgeW91ciBhcHBsaWNhdGlvbi5cbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBpZiAodHlwZW9mKEZCKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgXCJUaGUgRmFjZWJvb2sgSmF2YVNjcmlwdCBTREsgbXVzdCBiZSBsb2FkZWQgYmVmb3JlIGNhbGxpbmcgaW5pdC5cIjtcbiAgICAgIH0gXG4gICAgICBpbml0T3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge307XG4gICAgICBpZiAoaW5pdE9wdGlvbnMuc3RhdHVzICYmIHR5cGVvZihjb25zb2xlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB2YXIgd2FybiA9IGNvbnNvbGUud2FybiB8fCBjb25zb2xlLmxvZyB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgICB3YXJuLmNhbGwoY29uc29sZSwgXCJUaGUgJ3N0YXR1cycgZmxhZyBwYXNzZWQgaW50b1wiICtcbiAgICAgICAgICBcIiBGQi5pbml0LCB3aGVuIHNldCB0byB0cnVlLCBjYW4gaW50ZXJmZXJlIHdpdGggUGFyc2UgRmFjZWJvb2tcIiArXG4gICAgICAgICAgXCIgaW50ZWdyYXRpb24sIHNvIGl0IGhhcyBiZWVuIHN1cHByZXNzZWQuIFBsZWFzZSBjYWxsXCIgK1xuICAgICAgICAgIFwiIEZCLmdldExvZ2luU3RhdHVzKCkgZXhwbGljaXRseSBpZiB5b3UgcmVxdWlyZSB0aGlzIGJlaGF2aW9yLlwiKTtcbiAgICAgIH1cbiAgICAgIGluaXRPcHRpb25zLnN0YXR1cyA9IGZhbHNlO1xuICAgICAgRkIuaW5pdChpbml0T3B0aW9ucyk7XG4gICAgICBQYXJzZS5Vc2VyLl9yZWdpc3RlckF1dGhlbnRpY2F0aW9uUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIHVzZXIgaGFzIHRoZWlyIGFjY291bnQgbGlua2VkIHRvIEZhY2Vib29rLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7UGFyc2UuVXNlcn0gdXNlciBVc2VyIHRvIGNoZWNrIGZvciBhIGZhY2Vib29rIGxpbmsuXG4gICAgICogICAgIFRoZSB1c2VyIG11c3QgYmUgbG9nZ2VkIGluIG9uIHRoaXMgZGV2aWNlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSB1c2VyIGhhcyB0aGVpciBhY2NvdW50XG4gICAgICogICAgIGxpbmtlZCB0byBGYWNlYm9vay5cbiAgICAgKi9cbiAgICBpc0xpbmtlZDogZnVuY3Rpb24odXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIuX2lzTGlua2VkKFwiZmFjZWJvb2tcIik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ3MgaW4gYSB1c2VyIHVzaW5nIEZhY2Vib29rLiBUaGlzIG1ldGhvZCBkZWxlZ2F0ZXMgdG8gdGhlIEZhY2Vib29rXG4gICAgICogU0RLIHRvIGF1dGhlbnRpY2F0ZSB0aGUgdXNlciwgYW5kIHRoZW4gYXV0b21hdGljYWxseSBsb2dzIGluIChvclxuICAgICAqIGNyZWF0ZXMsIGluIHRoZSBjYXNlIHdoZXJlIGl0IGlzIGEgbmV3IHVzZXIpIGEgUGFyc2UuVXNlci5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZywgT2JqZWN0fSBwZXJtaXNzaW9ucyBUaGUgcGVybWlzc2lvbnMgcmVxdWlyZWQgZm9yIEZhY2Vib29rXG4gICAgICogICAgbG9nIGluLiAgVGhpcyBpcyBhIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgb2YgcGVybWlzc2lvbnMuXG4gICAgICogICAgQWx0ZXJuYXRpdmVseSwgc3VwcGx5IGEgRmFjZWJvb2sgYXV0aERhdGEgb2JqZWN0IGFzIGRlc2NyaWJlZCBpbiBvdXJcbiAgICAgKiAgICBSRVNUIEFQSSBkb2NzIGlmIHlvdSB3YW50IHRvIGhhbmRsZSBnZXR0aW5nIGZhY2Vib29rIGF1dGggdG9rZW5zXG4gICAgICogICAgeW91cnNlbGYuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU3RhbmRhcmQgb3B0aW9ucyBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvclxuICAgICAqICAgIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBsb2dJbjogZnVuY3Rpb24ocGVybWlzc2lvbnMsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghcGVybWlzc2lvbnMgfHwgXy5pc1N0cmluZyhwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgICAgICAgIHRocm93IFwiWW91IG11c3QgaW5pdGlhbGl6ZSBGYWNlYm9va1V0aWxzIGJlZm9yZSBjYWxsaW5nIGxvZ0luLlwiO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RlZFBlcm1pc3Npb25zID0gcGVybWlzc2lvbnM7XG4gICAgICAgIHJldHVybiBQYXJzZS5Vc2VyLl9sb2dJbldpdGgoXCJmYWNlYm9va1wiLCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgICAgbmV3T3B0aW9ucy5hdXRoRGF0YSA9IHBlcm1pc3Npb25zO1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5fbG9nSW5XaXRoKFwiZmFjZWJvb2tcIiwgbmV3T3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpbmtzIEZhY2Vib29rIHRvIGFuIGV4aXN0aW5nIFBGVXNlci4gVGhpcyBtZXRob2QgZGVsZWdhdGVzIHRvIHRoZVxuICAgICAqIEZhY2Vib29rIFNESyB0byBhdXRoZW50aWNhdGUgdGhlIHVzZXIsIGFuZCB0aGVuIGF1dG9tYXRpY2FsbHkgbGlua3NcbiAgICAgKiB0aGUgYWNjb3VudCB0byB0aGUgUGFyc2UuVXNlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGFyc2UuVXNlcn0gdXNlciBVc2VyIHRvIGxpbmsgdG8gRmFjZWJvb2suIFRoaXMgbXVzdCBiZSB0aGVcbiAgICAgKiAgICAgY3VycmVudCB1c2VyLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nLCBPYmplY3R9IHBlcm1pc3Npb25zIFRoZSBwZXJtaXNzaW9ucyByZXF1aXJlZCBmb3IgRmFjZWJvb2tcbiAgICAgKiAgICBsb2cgaW4uICBUaGlzIGlzIGEgY29tbWEtc2VwYXJhdGVkIHN0cmluZyBvZiBwZXJtaXNzaW9ucy4gXG4gICAgICogICAgQWx0ZXJuYXRpdmVseSwgc3VwcGx5IGEgRmFjZWJvb2sgYXV0aERhdGEgb2JqZWN0IGFzIGRlc2NyaWJlZCBpbiBvdXJcbiAgICAgKiAgICBSRVNUIEFQSSBkb2NzIGlmIHlvdSB3YW50IHRvIGhhbmRsZSBnZXR0aW5nIGZhY2Vib29rIGF1dGggdG9rZW5zXG4gICAgICogICAgeW91cnNlbGYuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgU3RhbmRhcmQgb3B0aW9ucyBvYmplY3Qgd2l0aCBzdWNjZXNzIGFuZCBlcnJvclxuICAgICAqICAgIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBsaW5rOiBmdW5jdGlvbih1c2VyLCBwZXJtaXNzaW9ucywgb3B0aW9ucykge1xuICAgICAgaWYgKCFwZXJtaXNzaW9ucyB8fCBfLmlzU3RyaW5nKHBlcm1pc3Npb25zKSkge1xuICAgICAgICBpZiAoIWluaXRpYWxpemVkKSB7XG4gICAgICAgICAgdGhyb3cgXCJZb3UgbXVzdCBpbml0aWFsaXplIEZhY2Vib29rVXRpbHMgYmVmb3JlIGNhbGxpbmcgbGluay5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0ZWRQZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zO1xuICAgICAgICByZXR1cm4gdXNlci5fbGlua1dpdGgoXCJmYWNlYm9va1wiLCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gXy5jbG9uZShvcHRpb25zKSB8fCB7fTtcbiAgICAgICAgbmV3T3B0aW9ucy5hdXRoRGF0YSA9IHBlcm1pc3Npb25zO1xuICAgICAgICByZXR1cm4gdXNlci5fbGlua1dpdGgoXCJmYWNlYm9va1wiLCBuZXdPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5saW5rcyB0aGUgUGFyc2UuVXNlciBmcm9tIGEgRmFjZWJvb2sgYWNjb3VudC4gXG4gICAgICogXG4gICAgICogQHBhcmFtIHtQYXJzZS5Vc2VyfSB1c2VyIFVzZXIgdG8gdW5saW5rIGZyb20gRmFjZWJvb2suIFRoaXMgbXVzdCBiZSB0aGVcbiAgICAgKiAgICAgY3VycmVudCB1c2VyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFN0YW5kYXJkIG9wdGlvbnMgb2JqZWN0IHdpdGggc3VjY2VzcyBhbmQgZXJyb3JcbiAgICAgKiAgICBjYWxsYmFja3MuXG4gICAgICovXG4gICAgdW5saW5rOiBmdW5jdGlvbih1c2VyLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIWluaXRpYWxpemVkKSB7XG4gICAgICAgIHRocm93IFwiWW91IG11c3QgaW5pdGlhbGl6ZSBGYWNlYm9va1V0aWxzIGJlZm9yZSBjYWxsaW5nIHVubGluay5cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1c2VyLl91bmxpbmtGcm9tKFwiZmFjZWJvb2tcIiwgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xuICBcbn0odGhpcykpO1xuXG4vKmdsb2JhbCBfOiBmYWxzZSwgZG9jdW1lbnQ6IGZhbHNlLCB3aW5kb3c6IGZhbHNlLCBuYXZpZ2F0b3I6IGZhbHNlICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICByb290LlBhcnNlID0gcm9vdC5QYXJzZSB8fCB7fTtcbiAgdmFyIFBhcnNlID0gcm9vdC5QYXJzZTtcbiAgdmFyIF8gPSBQYXJzZS5fO1xuXG4gIC8qKlxuICAgKiBIaXN0b3J5IHNlcnZlcyBhcyBhIGdsb2JhbCByb3V0ZXIgKHBlciBmcmFtZSkgdG8gaGFuZGxlIGhhc2hjaGFuZ2VcbiAgICogZXZlbnRzIG9yIHB1c2hTdGF0ZSwgbWF0Y2ggdGhlIGFwcHJvcHJpYXRlIHJvdXRlLCBhbmQgdHJpZ2dlclxuICAgKiBjYWxsYmFja3MuIFlvdSBzaG91bGRuJ3QgZXZlciBoYXZlIHRvIGNyZWF0ZSBvbmUgb2YgdGhlc2UgeW91cnNlbGZcbiAgICog4oCUIHlvdSBzaG91bGQgdXNlIHRoZSByZWZlcmVuY2UgdG8gPGNvZGU+UGFyc2UuaGlzdG9yeTwvY29kZT5cbiAgICogdGhhdCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHlvdSBhdXRvbWF0aWNhbGx5IGlmIHlvdSBtYWtlIHVzZSBvZiBcbiAgICogUm91dGVycyB3aXRoIHJvdXRlcy5cbiAgICogQGNsYXNzXG4gICAqICAgXG4gICAqIDxwPkEgZm9yayBvZiBCYWNrYm9uZS5IaXN0b3J5LCBwcm92aWRlZCBmb3IgeW91ciBjb252ZW5pZW5jZS4gIElmIHlvdSBcbiAgICogdXNlIHRoaXMgY2xhc3MsIHlvdSBtdXN0IGFsc28gaW5jbHVkZSBqUXVlcnksIG9yIGFub3RoZXIgbGlicmFyeSBcbiAgICogdGhhdCBwcm92aWRlcyBhIGpRdWVyeS1jb21wYXRpYmxlICQgZnVuY3Rpb24uICBGb3IgbW9yZSBpbmZvcm1hdGlvbixcbiAgICogc2VlIHRoZSA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jSGlzdG9yeVwiPlxuICAgKiBCYWNrYm9uZSBkb2N1bWVudGF0aW9uPC9hPi48L3A+XG4gICAqIDxwPjxzdHJvbmc+PGVtPkF2YWlsYWJsZSBpbiB0aGUgY2xpZW50IFNESyBvbmx5LjwvZW0+PC9zdHJvbmc+PC9wPlxuICAgKi9cbiAgUGFyc2UuSGlzdG9yeSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgICBfLmJpbmRBbGwodGhpcywgJ2NoZWNrVXJsJyk7XG4gIH07XG5cbiAgLy8gQ2FjaGVkIHJlZ2V4IGZvciBjbGVhbmluZyBsZWFkaW5nIGhhc2hlcyBhbmQgc2xhc2hlcyAuXG4gIHZhciByb3V0ZVN0cmlwcGVyID0gL15bI1xcL10vO1xuXG4gIC8vIENhY2hlZCByZWdleCBmb3IgZGV0ZWN0aW5nIE1TSUUuXG4gIHZhciBpc0V4cGxvcmVyID0gL21zaWUgW1xcdy5dKy87XG5cbiAgLy8gSGFzIHRoZSBoaXN0b3J5IGhhbmRsaW5nIGFscmVhZHkgYmVlbiBzdGFydGVkP1xuICBQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAvLyBTZXQgdXAgYWxsIGluaGVyaXRhYmxlICoqUGFyc2UuSGlzdG9yeSoqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKFBhcnNlLkhpc3RvcnkucHJvdG90eXBlLCBQYXJzZS5FdmVudHMsXG4gICAgICAgICAgIC8qKiBAbGVuZHMgUGFyc2UuSGlzdG9yeS5wcm90b3R5cGUgKi8ge1xuXG4gICAgLy8gVGhlIGRlZmF1bHQgaW50ZXJ2YWwgdG8gcG9sbCBmb3IgaGFzaCBjaGFuZ2VzLCBpZiBuZWNlc3NhcnksIGlzXG4gICAgLy8gdHdlbnR5IHRpbWVzIGEgc2Vjb25kLlxuICAgIGludGVydmFsOiA1MCxcblxuICAgIC8vIEdldHMgdGhlIHRydWUgaGFzaCB2YWx1ZS4gQ2Fubm90IHVzZSBsb2NhdGlvbi5oYXNoIGRpcmVjdGx5IGR1ZSB0byBidWdcbiAgICAvLyBpbiBGaXJlZm94IHdoZXJlIGxvY2F0aW9uLmhhc2ggd2lsbCBhbHdheXMgYmUgZGVjb2RlZC5cbiAgICBnZXRIYXNoOiBmdW5jdGlvbih3aW5kb3dPdmVycmlkZSkge1xuICAgICAgdmFyIGxvYyA9IHdpbmRvd092ZXJyaWRlID8gd2luZG93T3ZlcnJpZGUubG9jYXRpb24gOiB3aW5kb3cubG9jYXRpb247XG4gICAgICB2YXIgbWF0Y2ggPSBsb2MuaHJlZi5tYXRjaCgvIyguKikkLyk7XG4gICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgdGhlIGNyb3NzLWJyb3dzZXIgbm9ybWFsaXplZCBVUkwgZnJhZ21lbnQsIGVpdGhlciBmcm9tIHRoZSBVUkwsXG4gICAgLy8gdGhlIGhhc2gsIG9yIHRoZSBvdmVycmlkZS5cbiAgICBnZXRGcmFnbWVudDogZnVuY3Rpb24oZnJhZ21lbnQsIGZvcmNlUHVzaFN0YXRlKSB7XG4gICAgICBpZiAoUGFyc2UuX2lzTnVsbE9yVW5kZWZpbmVkKGZyYWdtZW50KSkge1xuICAgICAgICBpZiAodGhpcy5faGFzUHVzaFN0YXRlIHx8IGZvcmNlUHVzaFN0YXRlKSB7XG4gICAgICAgICAgZnJhZ21lbnQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgICAgdmFyIHNlYXJjaCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gICAgICAgICAgaWYgKHNlYXJjaCkge1xuICAgICAgICAgICAgZnJhZ21lbnQgKz0gc2VhcmNoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcmFnbWVudCA9IHRoaXMuZ2V0SGFzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWZyYWdtZW50LmluZGV4T2YodGhpcy5vcHRpb25zLnJvb3QpKSB7XG4gICAgICAgIGZyYWdtZW50ID0gZnJhZ21lbnQuc3Vic3RyKHRoaXMub3B0aW9ucy5yb290Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnJhZ21lbnQucmVwbGFjZShyb3V0ZVN0cmlwcGVyLCAnJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHRoZSBoYXNoIGNoYW5nZSBoYW5kbGluZywgcmV0dXJuaW5nIGB0cnVlYCBpZiB0aGUgY3VycmVudFxuICAgICAqIFVSTCBtYXRjaGVzIGFuIGV4aXN0aW5nIHJvdXRlLCBhbmQgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIGlmIChQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFyc2UuaGlzdG9yeSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcIik7XG4gICAgICB9XG4gICAgICBQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICAvLyBGaWd1cmUgb3V0IHRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb24uIERvIHdlIG5lZWQgYW4gaWZyYW1lP1xuICAgICAgLy8gSXMgcHVzaFN0YXRlIGRlc2lyZWQgLi4uIGlzIGl0IGF2YWlsYWJsZT9cbiAgICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCB7cm9vdDogJy8nfSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX3dhbnRzSGFzaENoYW5nZSA9IHRoaXMub3B0aW9ucy5oYXNoQ2hhbmdlICE9PSBmYWxzZTtcbiAgICAgIHRoaXMuX3dhbnRzUHVzaFN0YXRlID0gISF0aGlzLm9wdGlvbnMucHVzaFN0YXRlO1xuICAgICAgdGhpcy5faGFzUHVzaFN0YXRlID0gISEodGhpcy5vcHRpb25zLnB1c2hTdGF0ZSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuICAgICAgdmFyIGZyYWdtZW50ID0gdGhpcy5nZXRGcmFnbWVudCgpO1xuICAgICAgdmFyIGRvY01vZGUgPSBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG4gICAgICB2YXIgb2xkSUUgPSAoaXNFeHBsb3Jlci5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSkgJiZcbiAgICAgICAgICAgICAgICAgICAoIWRvY01vZGUgfHwgZG9jTW9kZSA8PSA3KSk7XG5cbiAgICAgIGlmIChvbGRJRSkge1xuICAgICAgICB0aGlzLmlmcmFtZSA9IFBhcnNlLiQoJzxpZnJhbWUgc3JjPVwiamF2YXNjcmlwdDowXCIgdGFiaW5kZXg9XCItMVwiIC8+JylcbiAgICAgICAgICAgICAgICAgICAgICAuaGlkZSgpLmFwcGVuZFRvKCdib2R5JylbMF0uY29udGVudFdpbmRvdztcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZShmcmFnbWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIERlcGVuZGluZyBvbiB3aGV0aGVyIHdlJ3JlIHVzaW5nIHB1c2hTdGF0ZSBvciBoYXNoZXMsIGFuZCB3aGV0aGVyXG4gICAgICAvLyAnb25oYXNoY2hhbmdlJyBpcyBzdXBwb3J0ZWQsIGRldGVybWluZSBob3cgd2UgY2hlY2sgdGhlIFVSTCBzdGF0ZS5cbiAgICAgIGlmICh0aGlzLl9oYXNQdXNoU3RhdGUpIHtcbiAgICAgICAgUGFyc2UuJCh3aW5kb3cpLmJpbmQoJ3BvcHN0YXRlJywgdGhpcy5jaGVja1VybCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSAmJlxuICAgICAgICAgICAgICAgICAoJ29uaGFzaGNoYW5nZScgaW4gd2luZG93KSAmJlxuICAgICAgICAgICAgICAgICAhb2xkSUUpIHtcbiAgICAgICAgUGFyc2UuJCh3aW5kb3cpLmJpbmQoJ2hhc2hjaGFuZ2UnLCB0aGlzLmNoZWNrVXJsKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fd2FudHNIYXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5jaGVja1VybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVydmFsKTtcbiAgICAgIH1cblxuICAgICAgLy8gRGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gY2hhbmdlIHRoZSBiYXNlIHVybCwgZm9yIGEgcHVzaFN0YXRlIGxpbmtcbiAgICAgIC8vIG9wZW5lZCBieSBhIG5vbi1wdXNoU3RhdGUgYnJvd3Nlci5cbiAgICAgIHRoaXMuZnJhZ21lbnQgPSBmcmFnbWVudDtcbiAgICAgIHZhciBsb2MgPSB3aW5kb3cubG9jYXRpb247XG4gICAgICB2YXIgYXRSb290ICA9IGxvYy5wYXRobmFtZSA9PT0gdGhpcy5vcHRpb25zLnJvb3Q7XG5cbiAgICAgIC8vIElmIHdlJ3ZlIHN0YXJ0ZWQgb2ZmIHdpdGggYSByb3V0ZSBmcm9tIGEgYHB1c2hTdGF0ZWAtZW5hYmxlZCBicm93c2VyLFxuICAgICAgLy8gYnV0IHdlJ3JlIGN1cnJlbnRseSBpbiBhIGJyb3dzZXIgdGhhdCBkb2Vzbid0IHN1cHBvcnQgaXQuLi5cbiAgICAgIGlmICh0aGlzLl93YW50c0hhc2hDaGFuZ2UgJiYgXG4gICAgICAgICAgdGhpcy5fd2FudHNQdXNoU3RhdGUgJiYgXG4gICAgICAgICAgIXRoaXMuX2hhc1B1c2hTdGF0ZSAmJlxuICAgICAgICAgICFhdFJvb3QpIHtcbiAgICAgICAgdGhpcy5mcmFnbWVudCA9IHRoaXMuZ2V0RnJhZ21lbnQobnVsbCwgdHJ1ZSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHRoaXMub3B0aW9ucy5yb290ICsgJyMnICsgdGhpcy5mcmFnbWVudCk7XG4gICAgICAgIC8vIFJldHVybiBpbW1lZGlhdGVseSBhcyBicm93c2VyIHdpbGwgZG8gcmVkaXJlY3QgdG8gbmV3IHVybFxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgLy8gT3IgaWYgd2UndmUgc3RhcnRlZCBvdXQgd2l0aCBhIGhhc2gtYmFzZWQgcm91dGUsIGJ1dCB3ZSdyZSBjdXJyZW50bHlcbiAgICAgIC8vIGluIGEgYnJvd3NlciB3aGVyZSBpdCBjb3VsZCBiZSBgcHVzaFN0YXRlYC1iYXNlZCBpbnN0ZWFkLi4uXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dhbnRzUHVzaFN0YXRlICYmXG4gICAgICAgICAgICAgICAgIHRoaXMuX2hhc1B1c2hTdGF0ZSAmJiBcbiAgICAgICAgICAgICAgICAgYXRSb290ICYmXG4gICAgICAgICAgICAgICAgIGxvYy5oYXNoKSB7XG4gICAgICAgIHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEhhc2goKS5yZXBsYWNlKHJvdXRlU3RyaXBwZXIsICcnKTtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICAgIGxvYy5wcm90b2NvbCArICcvLycgKyBsb2MuaG9zdCArIHRoaXMub3B0aW9ucy5yb290ICsgdGhpcy5mcmFnbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2FkVXJsKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIERpc2FibGUgUGFyc2UuaGlzdG9yeSwgcGVyaGFwcyB0ZW1wb3JhcmlseS4gTm90IHVzZWZ1bCBpbiBhIHJlYWwgYXBwLFxuICAgIC8vIGJ1dCBwb3NzaWJseSB1c2VmdWwgZm9yIHVuaXQgdGVzdGluZyBSb3V0ZXJzLlxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgUGFyc2UuJCh3aW5kb3cpLnVuYmluZCgncG9wc3RhdGUnLCB0aGlzLmNoZWNrVXJsKVxuICAgICAgICAgICAgICAgICAgICAgLnVuYmluZCgnaGFzaGNoYW5nZScsIHRoaXMuY2hlY2tVcmwpO1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5fY2hlY2tVcmxJbnRlcnZhbCk7XG4gICAgICBQYXJzZS5IaXN0b3J5LnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gQWRkIGEgcm91dGUgdG8gYmUgdGVzdGVkIHdoZW4gdGhlIGZyYWdtZW50IGNoYW5nZXMuIFJvdXRlcyBhZGRlZCBsYXRlclxuICAgIC8vIG1heSBvdmVycmlkZSBwcmV2aW91cyByb3V0ZXMuXG4gICAgcm91dGU6IGZ1bmN0aW9uKHJvdXRlLCBjYWxsYmFjaykge1xuICAgICAgdGhpcy5oYW5kbGVycy51bnNoaWZ0KHtyb3V0ZTogcm91dGUsIGNhbGxiYWNrOiBjYWxsYmFja30pO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgVVJMIHRvIHNlZSBpZiBpdCBoYXMgY2hhbmdlZCwgYW5kIGlmIGl0IGhhcyxcbiAgICAvLyBjYWxscyBgbG9hZFVybGAsIG5vcm1hbGl6aW5nIGFjcm9zcyB0aGUgaGlkZGVuIGlmcmFtZS5cbiAgICBjaGVja1VybDogZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmdldEZyYWdtZW50KCk7XG4gICAgICBpZiAoY3VycmVudCA9PT0gdGhpcy5mcmFnbWVudCAmJiB0aGlzLmlmcmFtZSkge1xuICAgICAgICBjdXJyZW50ID0gdGhpcy5nZXRGcmFnbWVudCh0aGlzLmdldEhhc2godGhpcy5pZnJhbWUpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50ID09PSB0aGlzLmZyYWdtZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlmcmFtZSkge1xuICAgICAgICB0aGlzLm5hdmlnYXRlKGN1cnJlbnQpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmxvYWRVcmwoKSkge1xuICAgICAgICB0aGlzLmxvYWRVcmwodGhpcy5nZXRIYXNoKCkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBBdHRlbXB0IHRvIGxvYWQgdGhlIGN1cnJlbnQgVVJMIGZyYWdtZW50LiBJZiBhIHJvdXRlIHN1Y2NlZWRzIHdpdGggYVxuICAgIC8vIG1hdGNoLCByZXR1cm5zIGB0cnVlYC4gSWYgbm8gZGVmaW5lZCByb3V0ZXMgbWF0Y2hlcyB0aGUgZnJhZ21lbnQsXG4gICAgLy8gcmV0dXJucyBgZmFsc2VgLlxuICAgIGxvYWRVcmw6IGZ1bmN0aW9uKGZyYWdtZW50T3ZlcnJpZGUpIHtcbiAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnQgPSB0aGlzLmdldEZyYWdtZW50KGZyYWdtZW50T3ZlcnJpZGUpO1xuICAgICAgdmFyIG1hdGNoZWQgPSBfLmFueSh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgIGlmIChoYW5kbGVyLnJvdXRlLnRlc3QoZnJhZ21lbnQpKSB7XG4gICAgICAgICAgaGFuZGxlci5jYWxsYmFjayhmcmFnbWVudCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1hdGNoZWQ7XG4gICAgfSxcblxuICAgIC8vIFNhdmUgYSBmcmFnbWVudCBpbnRvIHRoZSBoYXNoIGhpc3RvcnksIG9yIHJlcGxhY2UgdGhlIFVSTCBzdGF0ZSBpZiB0aGVcbiAgICAvLyAncmVwbGFjZScgb3B0aW9uIGlzIHBhc3NlZC4gWW91IGFyZSByZXNwb25zaWJsZSBmb3IgcHJvcGVybHkgVVJMLWVuY29kaW5nXG4gICAgLy8gdGhlIGZyYWdtZW50IGluIGFkdmFuY2UuXG4gICAgLy9cbiAgICAvLyBUaGUgb3B0aW9ucyBvYmplY3QgY2FuIGNvbnRhaW4gYHRyaWdnZXI6IHRydWVgIGlmIHlvdSB3aXNoIHRvIGhhdmUgdGhlXG4gICAgLy8gcm91dGUgY2FsbGJhY2sgYmUgZmlyZWQgKG5vdCB1c3VhbGx5IGRlc2lyYWJsZSksIG9yIGByZXBsYWNlOiB0cnVlYCwgaWZcbiAgICAvLyB5b3Ugd2lzaCB0byBtb2RpZnkgdGhlIGN1cnJlbnQgVVJMIHdpdGhvdXQgYWRkaW5nIGFuIGVudHJ5IHRvIHRoZVxuICAgIC8vIGhpc3RvcnkuXG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBvcHRpb25zKSB7XG4gICAgICBpZiAoIVBhcnNlLkhpc3Rvcnkuc3RhcnRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICBvcHRpb25zID0ge3RyaWdnZXI6IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgdmFyIGZyYWcgPSAoZnJhZ21lbnQgfHwgJycpLnJlcGxhY2Uocm91dGVTdHJpcHBlciwgJycpO1xuICAgICAgaWYgKHRoaXMuZnJhZ21lbnQgPT09IGZyYWcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBwdXNoU3RhdGUgaXMgYXZhaWxhYmxlLCB3ZSB1c2UgaXQgdG8gc2V0IHRoZSBmcmFnbWVudCBhcyBhIHJlYWwgVVJMLlxuICAgICAgaWYgKHRoaXMuX2hhc1B1c2hTdGF0ZSkge1xuICAgICAgICBpZiAoZnJhZy5pbmRleE9mKHRoaXMub3B0aW9ucy5yb290KSAhPT0gMCkge1xuICAgICAgICAgIGZyYWcgPSB0aGlzLm9wdGlvbnMucm9vdCArIGZyYWc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mcmFnbWVudCA9IGZyYWc7XG4gICAgICAgIHZhciByZXBsYWNlT3JQdXNoID0gb3B0aW9ucy5yZXBsYWNlID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJztcbiAgICAgICAgd2luZG93Lmhpc3RvcnlbcmVwbGFjZU9yUHVzaF0oe30sIGRvY3VtZW50LnRpdGxlLCBmcmFnKTtcblxuICAgICAgLy8gSWYgaGFzaCBjaGFuZ2VzIGhhdmVuJ3QgYmVlbiBleHBsaWNpdGx5IGRpc2FibGVkLCB1cGRhdGUgdGhlIGhhc2hcbiAgICAgIC8vIGZyYWdtZW50IHRvIHN0b3JlIGhpc3RvcnkuXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dhbnRzSGFzaENoYW5nZSkge1xuICAgICAgICB0aGlzLmZyYWdtZW50ID0gZnJhZztcbiAgICAgICAgdGhpcy5fdXBkYXRlSGFzaCh3aW5kb3cubG9jYXRpb24sIGZyYWcsIG9wdGlvbnMucmVwbGFjZSk7XG4gICAgICAgIGlmICh0aGlzLmlmcmFtZSAmJlxuICAgICAgICAgICAgKGZyYWcgIT09IHRoaXMuZ2V0RnJhZ21lbnQodGhpcy5nZXRIYXNoKHRoaXMuaWZyYW1lKSkpKSB7XG4gICAgICAgICAgLy8gT3BlbmluZyBhbmQgY2xvc2luZyB0aGUgaWZyYW1lIHRyaWNrcyBJRTcgYW5kIGVhcmxpZXJcbiAgICAgICAgICAvLyB0byBwdXNoIGEgaGlzdG9yeSBlbnRyeSBvbiBoYXNoLXRhZyBjaGFuZ2UuXG4gICAgICAgICAgLy8gV2hlbiByZXBsYWNlIGlzIHRydWUsIHdlIGRvbid0IHdhbnQgdGhpcy5cbiAgICAgICAgICBpZiAoIW9wdGlvbnMucmVwbGFjZSkge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWUuZG9jdW1lbnQub3BlbigpLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3VwZGF0ZUhhc2godGhpcy5pZnJhbWUubG9jYXRpb24sIGZyYWcsIG9wdGlvbnMucmVwbGFjZSk7XG4gICAgICAgIH1cblxuICAgICAgLy8gSWYgeW91J3ZlIHRvbGQgdXMgdGhhdCB5b3UgZXhwbGljaXRseSBkb24ndCB3YW50IGZhbGxiYWNrIGhhc2hjaGFuZ2UtXG4gICAgICAvLyBiYXNlZCBoaXN0b3J5LCB0aGVuIGBuYXZpZ2F0ZWAgYmVjb21lcyBhIHBhZ2UgcmVmcmVzaC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odGhpcy5vcHRpb25zLnJvb3QgKyBmcmFnbWVudCk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy50cmlnZ2VyKSB7XG4gICAgICAgIHRoaXMubG9hZFVybChmcmFnbWVudCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSB0aGUgaGFzaCBsb2NhdGlvbiwgZWl0aGVyIHJlcGxhY2luZyB0aGUgY3VycmVudCBlbnRyeSwgb3IgYWRkaW5nXG4gICAgLy8gYSBuZXcgb25lIHRvIHRoZSBicm93c2VyIGhpc3RvcnkuXG4gICAgX3VwZGF0ZUhhc2g6IGZ1bmN0aW9uKGxvY2F0aW9uLCBmcmFnbWVudCwgcmVwbGFjZSkge1xuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgdmFyIHMgPSBsb2NhdGlvbi50b1N0cmluZygpLnJlcGxhY2UoLyhqYXZhc2NyaXB0OnwjKS4qJC8sICcnKTtcbiAgICAgICAgbG9jYXRpb24ucmVwbGFjZShzICsgJyMnICsgZnJhZ21lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYXRpb24uaGFzaCA9IGZyYWdtZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59KHRoaXMpKTtcblxuLypnbG9iYWwgXzogZmFsc2UqL1xuKGZ1bmN0aW9uKHJvb3QpIHtcbiAgcm9vdC5QYXJzZSA9IHJvb3QuUGFyc2UgfHwge307XG4gIHZhciBQYXJzZSA9IHJvb3QuUGFyc2U7XG4gIHZhciBfID0gUGFyc2UuXztcblxuICAvKipcbiAgICogUm91dGVycyBtYXAgZmF1eC1VUkxzIHRvIGFjdGlvbnMsIGFuZCBmaXJlIGV2ZW50cyB3aGVuIHJvdXRlcyBhcmVcbiAgICogbWF0Y2hlZC4gQ3JlYXRpbmcgYSBuZXcgb25lIHNldHMgaXRzIGByb3V0ZXNgIGhhc2gsIGlmIG5vdCBzZXQgc3RhdGljYWxseS5cbiAgICogQGNsYXNzXG4gICAqXG4gICAqIDxwPkEgZm9yayBvZiBCYWNrYm9uZS5Sb3V0ZXIsIHByb3ZpZGVkIGZvciB5b3VyIGNvbnZlbmllbmNlLlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZVxuICAgKiA8YSBocmVmPVwiaHR0cDovL2RvY3VtZW50Y2xvdWQuZ2l0aHViLmNvbS9iYWNrYm9uZS8jUm91dGVyXCI+QmFja2JvbmVcbiAgICogZG9jdW1lbnRhdGlvbjwvYT4uPC9wPlxuICAgKiA8cD48c3Ryb25nPjxlbT5BdmFpbGFibGUgaW4gdGhlIGNsaWVudCBTREsgb25seS48L2VtPjwvc3Ryb25nPjwvcD5cbiAgICovXG4gIFBhcnNlLlJvdXRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAob3B0aW9ucy5yb3V0ZXMpIHtcbiAgICAgIHRoaXMucm91dGVzID0gb3B0aW9ucy5yb3V0ZXM7XG4gICAgfVxuICAgIHRoaXMuX2JpbmRSb3V0ZXMoKTtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDYWNoZWQgcmVndWxhciBleHByZXNzaW9ucyBmb3IgbWF0Y2hpbmcgbmFtZWQgcGFyYW0gcGFydHMgYW5kIHNwbGF0dGVkXG4gIC8vIHBhcnRzIG9mIHJvdXRlIHN0cmluZ3MuXG4gIHZhciBuYW1lZFBhcmFtICAgID0gLzpcXHcrL2c7XG4gIHZhciBzcGxhdFBhcmFtICAgID0gL1xcKlxcdysvZztcbiAgdmFyIGVzY2FwZVJlZ0V4cCAgPSAvW1xcLVxcW1xcXXt9KCkrPy4sXFxcXFxcXlxcJFxcfCNcXHNdL2c7XG5cbiAgLy8gU2V0IHVwIGFsbCBpbmhlcml0YWJsZSAqKlBhcnNlLlJvdXRlcioqIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMuXG4gIF8uZXh0ZW5kKFBhcnNlLlJvdXRlci5wcm90b3R5cGUsIFBhcnNlLkV2ZW50cyxcbiAgICAgICAgICAgLyoqIEBsZW5kcyBQYXJzZS5Sb3V0ZXIucHJvdG90eXBlICovIHtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgaXMgYW4gZW1wdHkgZnVuY3Rpb24gYnkgZGVmYXVsdC4gT3ZlcnJpZGUgaXQgd2l0aCB5b3VyIG93blxuICAgICAqIGluaXRpYWxpemF0aW9uIGxvZ2ljLlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7fSxcblxuICAgIC8qKlxuICAgICAqIE1hbnVhbGx5IGJpbmQgYSBzaW5nbGUgbmFtZWQgcm91dGUgdG8gYSBjYWxsYmFjay4gRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiA8cHJlPnRoaXMucm91dGUoJ3NlYXJjaC86cXVlcnkvcDpudW0nLCAnc2VhcmNoJywgZnVuY3Rpb24ocXVlcnksIG51bSkge1xuICAgICAqICAgICAgIC4uLlxuICAgICAqICAgICB9KTs8L3ByZT5cbiAgICAgKi9cbiAgICByb3V0ZTogZnVuY3Rpb24ocm91dGUsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBQYXJzZS5oaXN0b3J5ID0gUGFyc2UuaGlzdG9yeSB8fCBuZXcgUGFyc2UuSGlzdG9yeSgpO1xuICAgICAgaWYgKCFfLmlzUmVnRXhwKHJvdXRlKSkge1xuICAgICAgICByb3V0ZSA9IHRoaXMuX3JvdXRlVG9SZWdFeHAocm91dGUpO1xuICAgICAgfSBcbiAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSB0aGlzW25hbWVdO1xuICAgICAgfVxuICAgICAgUGFyc2UuaGlzdG9yeS5yb3V0ZShyb3V0ZSwgXy5iaW5kKGZ1bmN0aW9uKGZyYWdtZW50KSB7XG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5fZXh0cmFjdFBhcmFtZXRlcnMocm91dGUsIGZyYWdtZW50KTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIFsncm91dGU6JyArIG5hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIFBhcnNlLmhpc3RvcnkudHJpZ2dlcigncm91dGUnLCB0aGlzLCBuYW1lLCBhcmdzKTtcbiAgICAgIH0sIHRoaXMpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGVuZXZlciB5b3UgcmVhY2ggYSBwb2ludCBpbiB5b3VyIGFwcGxpY2F0aW9uIHRoYXQgeW91J2RcbiAgICAgKiBsaWtlIHRvIHNhdmUgYXMgYSBVUkwsIGNhbGwgbmF2aWdhdGUgaW4gb3JkZXIgdG8gdXBkYXRlIHRoZVxuICAgICAqIFVSTC4gSWYgeW91IHdpc2ggdG8gYWxzbyBjYWxsIHRoZSByb3V0ZSBmdW5jdGlvbiwgc2V0IHRoZSBcbiAgICAgKiB0cmlnZ2VyIG9wdGlvbiB0byB0cnVlLiBUbyB1cGRhdGUgdGhlIFVSTCB3aXRob3V0IGNyZWF0aW5nXG4gICAgICogYW4gZW50cnkgaW4gdGhlIGJyb3dzZXIncyBoaXN0b3J5LCBzZXQgdGhlIHJlcGxhY2Ugb3B0aW9uXG4gICAgICogdG8gdHJ1ZS5cbiAgICAgKi9cbiAgICBuYXZpZ2F0ZTogZnVuY3Rpb24oZnJhZ21lbnQsIG9wdGlvbnMpIHtcbiAgICAgIFBhcnNlLmhpc3RvcnkubmF2aWdhdGUoZnJhZ21lbnQsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBCaW5kIGFsbCBkZWZpbmVkIHJvdXRlcyB0byBgUGFyc2UuaGlzdG9yeWAuIFdlIGhhdmUgdG8gcmV2ZXJzZSB0aGVcbiAgICAvLyBvcmRlciBvZiB0aGUgcm91dGVzIGhlcmUgdG8gc3VwcG9ydCBiZWhhdmlvciB3aGVyZSB0aGUgbW9zdCBnZW5lcmFsXG4gICAgLy8gcm91dGVzIGNhbiBiZSBkZWZpbmVkIGF0IHRoZSBib3R0b20gb2YgdGhlIHJvdXRlIG1hcC5cbiAgICBfYmluZFJvdXRlczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMucm91dGVzKSB7IFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgcm91dGVzID0gW107XG4gICAgICBmb3IgKHZhciByb3V0ZSBpbiB0aGlzLnJvdXRlcykge1xuICAgICAgICBpZiAodGhpcy5yb3V0ZXMuaGFzT3duUHJvcGVydHkocm91dGUpKSB7XG4gICAgICAgICAgcm91dGVzLnVuc2hpZnQoW3JvdXRlLCB0aGlzLnJvdXRlc1tyb3V0ZV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByb3V0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMucm91dGUocm91dGVzW2ldWzBdLCByb3V0ZXNbaV1bMV0sIHRoaXNbcm91dGVzW2ldWzFdXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSByb3V0ZSBzdHJpbmcgaW50byBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgc3VpdGFibGUgZm9yIG1hdGNoaW5nXG4gICAgLy8gYWdhaW5zdCB0aGUgY3VycmVudCBsb2NhdGlvbiBoYXNoLlxuICAgIF9yb3V0ZVRvUmVnRXhwOiBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgcm91dGUgPSByb3V0ZS5yZXBsYWNlKGVzY2FwZVJlZ0V4cCwgJ1xcXFwkJicpXG4gICAgICAgICAgICAgICAgICAgLnJlcGxhY2UobmFtZWRQYXJhbSwgJyhbXlxcL10rKScpXG4gICAgICAgICAgICAgICAgICAgLnJlcGxhY2Uoc3BsYXRQYXJhbSwgJyguKj8pJyk7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyByb3V0ZSArICckJyk7XG4gICAgfSxcblxuICAgIC8vIEdpdmVuIGEgcm91dGUsIGFuZCBhIFVSTCBmcmFnbWVudCB0aGF0IGl0IG1hdGNoZXMsIHJldHVybiB0aGUgYXJyYXkgb2ZcbiAgICAvLyBleHRyYWN0ZWQgcGFyYW1ldGVycy5cbiAgICBfZXh0cmFjdFBhcmFtZXRlcnM6IGZ1bmN0aW9uKHJvdXRlLCBmcmFnbWVudCkge1xuICAgICAgcmV0dXJuIHJvdXRlLmV4ZWMoZnJhZ21lbnQpLnNsaWNlKDEpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VQcm9wcyBJbnN0YW5jZSBwcm9wZXJ0aWVzIGZvciB0aGUgcm91dGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY2xhc3NQcm9wcyBDbGFzcyBwcm9wZXJpZXMgZm9yIHRoZSByb3V0ZXIuXG4gICAqIEByZXR1cm4ge0NsYXNzfSBBIG5ldyBzdWJjbGFzcyBvZiA8Y29kZT5QYXJzZS5Sb3V0ZXI8L2NvZGU+LlxuICAgKi9cbiAgUGFyc2UuUm91dGVyLmV4dGVuZCA9IFBhcnNlLl9leHRlbmQ7XG59KHRoaXMpKTtcbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuICB2YXIgXyA9IFBhcnNlLl87XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2UgQ29udGFpbnMgZnVuY3Rpb25zIGZvciBjYWxsaW5nIGFuZCBkZWNsYXJpbmdcbiAgICogPGEgaHJlZj1cIi9kb2NzL2Nsb3VkX2NvZGVfZ3VpZGUjZnVuY3Rpb25zXCI+Y2xvdWQgZnVuY3Rpb25zPC9hPi5cbiAgICogPHA+PHN0cm9uZz48ZW0+XG4gICAqICAgU29tZSBmdW5jdGlvbnMgYXJlIG9ubHkgYXZhaWxhYmxlIGZyb20gQ2xvdWQgQ29kZS5cbiAgICogPC9lbT48L3N0cm9uZz48L3A+XG4gICAqL1xuICBQYXJzZS5DbG91ZCA9IFBhcnNlLkNsb3VkIHx8IHt9O1xuXG4gIF8uZXh0ZW5kKFBhcnNlLkNsb3VkLCAvKiogQGxlbmRzIFBhcnNlLkNsb3VkICovIHtcbiAgICAvKipcbiAgICAgKiBNYWtlcyBhIGNhbGwgdG8gYSBjbG91ZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgZnVuY3Rpb24gbmFtZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgcGFyYW1ldGVycyB0byBzZW5kIHRvIHRoZSBjbG91ZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBIEJhY2tib25lLXN0eWxlIG9wdGlvbnMgb2JqZWN0XG4gICAgICogb3B0aW9ucy5zdWNjZXNzLCBpZiBzZXQsIHNob3VsZCBiZSBhIGZ1bmN0aW9uIHRvIGhhbmRsZSBhIHN1Y2Nlc3NmdWxcbiAgICAgKiBjYWxsIHRvIGEgY2xvdWQgZnVuY3Rpb24uICBvcHRpb25zLmVycm9yIHNob3VsZCBiZSBhIGZ1bmN0aW9uIHRoYXRcbiAgICAgKiBoYW5kbGVzIGFuIGVycm9yIHJ1bm5pbmcgdGhlIGNsb3VkIGZ1bmN0aW9uLiAgQm90aCBmdW5jdGlvbnMgYXJlXG4gICAgICogb3B0aW9uYWwuICBCb3RoIGZ1bmN0aW9ucyB0YWtlIGEgc2luZ2xlIGFyZ3VtZW50LlxuICAgICAqIEByZXR1cm4ge1BhcnNlLlByb21pc2V9IEEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0XG4gICAgICogb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHJ1bjogZnVuY3Rpb24obmFtZSwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgICByb3V0ZTogXCJmdW5jdGlvbnNcIixcbiAgICAgICAgY2xhc3NOYW1lOiBuYW1lLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXNlTWFzdGVyS2V5OiBvcHRpb25zLnVzZU1hc3RlcktleSxcbiAgICAgICAgc2Vzc2lvblRva2VuOiBvcHRpb25zLnNlc3Npb25Ub2tlbixcbiAgICAgICAgZGF0YTogUGFyc2UuX2VuY29kZShkYXRhLCBudWxsLCB0cnVlKVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICByZXR1cm4gUGFyc2UuX2RlY29kZShudWxsLCByZXNwKS5yZXN1bHQ7XG4gICAgICB9KS5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgICB9XG4gIH0pO1xufSh0aGlzKSk7XG5cbihmdW5jdGlvbihyb290KSB7XG4gIHJvb3QuUGFyc2UgPSByb290LlBhcnNlIHx8IHt9O1xuICB2YXIgUGFyc2UgPSByb290LlBhcnNlO1xuXG4gIFBhcnNlLkluc3RhbGxhdGlvbiA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJfSW5zdGFsbGF0aW9uXCIpO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBmdW5jdGlvbnMgdG8gZGVhbCB3aXRoIFB1c2ggaW4gUGFyc2VcbiAgICogQG5hbWUgUGFyc2UuUHVzaFxuICAgKiBAbmFtZXNwYWNlXG4gICAqL1xuICBQYXJzZS5QdXNoID0gUGFyc2UuUHVzaCB8fCB7fTtcblxuICAvKipcbiAgICogU2VuZHMgYSBwdXNoIG5vdGlmaWNhdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSAgVGhlIGRhdGEgb2YgdGhlIHB1c2ggbm90aWZpY2F0aW9uLiAgVmFsaWQgZmllbGRzXG4gICAqIGFyZTpcbiAgICogICA8b2w+XG4gICAqICAgICA8bGk+Y2hhbm5lbHMgLSBBbiBBcnJheSBvZiBjaGFubmVscyB0byBwdXNoIHRvLjwvbGk+XG4gICAqICAgICA8bGk+cHVzaF90aW1lIC0gQSBEYXRlIG9iamVjdCBmb3Igd2hlbiB0byBzZW5kIHRoZSBwdXNoLjwvbGk+XG4gICAqICAgICA8bGk+ZXhwaXJhdGlvbl90aW1lIC0gIEEgRGF0ZSBvYmplY3QgZm9yIHdoZW4gdG8gZXhwaXJlXG4gICAqICAgICAgICAgdGhlIHB1c2guPC9saT5cbiAgICogICAgIDxsaT5leHBpcmF0aW9uX2ludGVydmFsIC0gVGhlIHNlY29uZHMgZnJvbSBub3cgdG8gZXhwaXJlIHRoZSBwdXNoLjwvbGk+XG4gICAqICAgICA8bGk+d2hlcmUgLSBBIFBhcnNlLlF1ZXJ5IG92ZXIgUGFyc2UuSW5zdGFsbGF0aW9uIHRoYXQgaXMgdXNlZCB0byBtYXRjaFxuICAgKiAgICAgICAgIGEgc2V0IG9mIGluc3RhbGxhdGlvbnMgdG8gcHVzaCB0by48L2xpPlxuICAgKiAgICAgPGxpPmRhdGEgLSBUaGUgZGF0YSB0byBzZW5kIGFzIHBhcnQgb2YgdGhlIHB1c2g8L2xpPlxuICAgKiAgIDxvbD5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHRoYXQgaGFzIGFuIG9wdGlvbmFsIHN1Y2Nlc3MgZnVuY3Rpb24sXG4gICAqIHRoYXQgdGFrZXMgbm8gYXJndW1lbnRzIGFuZCB3aWxsIGJlIGNhbGxlZCBvbiBhIHN1Y2Nlc3NmdWwgcHVzaCwgYW5kXG4gICAqIGFuIGVycm9yIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBQYXJzZS5FcnJvciBhbmQgd2lsbCBiZSBjYWxsZWQgaWYgdGhlIHB1c2hcbiAgICogZmFpbGVkLlxuICAgKiBAcmV0dXJuIHtQYXJzZS5Qcm9taXNlfSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgcHVzaCByZXF1ZXN0XG4gICAqICAgICBjb21wbGV0ZXMuXG4gICAqL1xuICBQYXJzZS5QdXNoLnNlbmQgPSBmdW5jdGlvbihkYXRhLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBpZiAoZGF0YS53aGVyZSkge1xuICAgICAgZGF0YS53aGVyZSA9IGRhdGEud2hlcmUudG9KU09OKCkud2hlcmU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEucHVzaF90aW1lKSB7XG4gICAgICBkYXRhLnB1c2hfdGltZSA9IGRhdGEucHVzaF90aW1lLnRvSlNPTigpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmV4cGlyYXRpb25fdGltZSkge1xuICAgICAgZGF0YS5leHBpcmF0aW9uX3RpbWUgPSBkYXRhLmV4cGlyYXRpb25fdGltZS50b0pTT04oKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5leHBpcmF0aW9uX3RpbWUgJiYgZGF0YS5leHBpcmF0aW9uX2ludGVydmFsKSB7XG4gICAgICB0aHJvdyBcIkJvdGggZXhwaXJhdGlvbl90aW1lIGFuZCBleHBpcmF0aW9uX2ludGVydmFsIGNhbid0IGJlIHNldFwiO1xuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gUGFyc2UuX3JlcXVlc3Qoe1xuICAgICAgcm91dGU6ICdwdXNoJyxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIHVzZU1hc3RlcktleTogb3B0aW9ucy51c2VNYXN0ZXJLZXlcbiAgICB9KTtcbiAgICByZXR1cm4gcmVxdWVzdC5fdGhlblJ1bkNhbGxiYWNrcyhvcHRpb25zKTtcbiAgfTtcbn0odGhpcykpO1xuIl19
},{"_process":"/Users/surian/Sites/Private/timeboxer/node_modules/browserify/node_modules/process/browser.js"}],"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js":[function(require,module,exports){
/* Riot v2.2.2, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function(window, undefined) {
  'use strict'
  var riot = { version: 'v2.2.2', settings: {} }

  // This globals 'const' helps code size reduction

  // for typeof == '' comparisons
  var T_STRING = 'string',
      T_OBJECT = 'object',
      T_UNDEF  = 'undefined'

  // for IE8 and rest of the world
  /* istanbul ignore next */
  var isArray = Array.isArray || (function () {
    var _ts = Object.prototype.toString
    return function (v) { return _ts.call(v) === '[object Array]' }
  })()

  // Version# for IE 8-11, 0 for others
  var ieVersion = (function (win) {
    return (window && window.document || {}).documentMode | 0
  })()

riot.observable = function(el) {

  el = el || {}

  var callbacks = {},
      _id = 0

  el.on = function(events, fn) {
    if (isFunction(fn)) {
      if (typeof fn.id === T_UNDEF) fn._id = _id++

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
            if (cb._id == fn._id) arr.splice(i--, 1)
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
riot.mixin = (function() {
  var mixins = {}

  return function(name, mixin) {
    if (!mixin) return mixins[name]
    mixins[name] = mixin
  }

})()

;(function(riot, evt, win) {

  // browsers only
  if (!win) return

  var loc = win.location,
      fns = riot.observable(),
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


var brackets = (function(orig) {

  var cachedBrackets,
      r,
      b,
      re = /[{}]/g

  return function(x) {

    // make sure we use the current setting
    var s = riot.settings.brackets || orig

    // recreate cached vars if needed
    if (cachedBrackets !== s) {
      cachedBrackets = s
      b = s.split(' ')
      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
    }

    // if regexp given, rewrite it with current brackets (only if differ from default)
    return x instanceof RegExp ? (
        s === orig ? x :
        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
      ) :
      // else, get specific bracket
      b[x]
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
      + '}catch(e){'
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
      if (!level && open) start = pos

      // in(de)crease bracket level
      level += open ? 1 : -1

      // if outer closing bracket, grab the match
      if (!level && close != null) matches.push(str.slice(start, pos+close.length))

    })

    return matches
  }

})()

// { key, i in items} -> { key, i, items }
function loopKeys(expr) {
  var b0 = brackets(0),
      els = expr.slice(b0.length).match(/^\s*(\S+?)\s*(?:,\s*(\S+))?\s+in\s+(.+)$/)
  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
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

  var tagName = getTagName(dom),
      template = dom.outerHTML,
      hasImpl = !!tagImpl[tagName],
      impl = tagImpl[tagName] || {
        tmpl: template
      },
      root = dom.parentNode,
      placeholder = document.createComment('riot placeholder'),
      tags = [],
      child = getTag(dom),
      checksum

  root.insertBefore(placeholder, dom)

  expr = loopKeys(expr)

  // clean template code
  parent
    .one('premount', function () {
      if (root.stub) root = parent.root
      // remove the original DOM node
      dom.parentNode.removeChild(dom)
    })
    .on('update', function () {
      var items = tmpl(expr.val, parent)

      // object loop. any changes cause full redraw
      if (!isArray(items)) {

        checksum = items ? JSON.stringify(items) : ''

        items = !items ? [] :
          Object.keys(items).map(function (key) {
            return mkitem(expr, key, items[key])
          })
      }

      var frag = document.createDocumentFragment(),
          i = tags.length,
          j = items.length

      // unmount leftover items
      while (i > j) {
        tags[--i].unmount()
        tags.splice(i, 1)
      }

      for (i = 0; i < j; ++i) {
        var _item = !checksum && !!expr.key ? mkitem(expr, items[i], i) : items[i]

        if (!tags[i]) {
          // mount new
          (tags[i] = new Tag(impl, {
              parent: parent,
              isLoop: true,
              hasImpl: hasImpl,
              root: hasImpl ? dom.cloneNode() : root,
              item: _item
            }, dom.innerHTML)
          ).mount()

          frag.appendChild(tags[i].root)
        } else
          tags[i].update(_item)

        tags[i]._item = _item

      }

      root.insertBefore(frag, placeholder)

      if (child) parent.tags[tagName] = tags

    }).one('updated', function() {
      var keys = Object.keys(parent)// only set new values
      walk(root, function(node) {
        // only set element node and not isLoop
        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
          node._visited = false // reset _visited for loop node
          node._looped = true // avoid set multiple each
          setNamed(node, parent, keys)
        }
      })
    })

}


function parseNamedElements(root, parent, childTags) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0

      // custom child tag
      var child = getTag(dom)

      if (child && !dom.isLoop) {
        var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
            tagName = getTagName(dom),
            ptag = parent,
            cachedTag

        while (!getTag(ptag.root)) {
          if (!ptag.parent) break
          ptag = ptag.parent
        }

        // fix for the parent attribute in the looped elements
        tag.parent = ptag

        cachedTag = ptag.tags[tagName]

        // if there are multiple children tags having the same name
        if (cachedTag) {
          // if the parent tags property is not yet an array
          // create it adding the first cached tag
          if (!isArray(cachedTag))
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

      if (!dom.isLoop)
        setNamed(dom, parent, [])
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
      isLoop = conf.isLoop,
      hasImpl = conf.hasImpl,
      item = cleanUpData(conf.item),
      expressions = [],
      childTags = [],
      root = conf.root,
      fn = impl.fn,
      tagName = root.tagName.toLowerCase(),
      attr = {},
      propsInSyncWithParent = [],
      loopDom,
      TAG_ATTRIBUTES = /([\w\-]+)\s?=\s?['"]([^'"]+)["']/gim


  if (fn && root._tag) {
    root._tag.unmount(true)
  }

  // not yet mounted
  this.isMounted = false
  root.isLoop = isLoop

  if (impl.attrs) {
    var attrs = impl.attrs.match(TAG_ATTRIBUTES)

    each(attrs, function(a) {
      var kv = a.split(/\s?=\s?/)
      root.setAttribute(kv[0], kv[1].replace(/['"]/g, ''))
    })

  }

  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  this._id = fastAbs(~~(new Date().getTime() * Math.random()))

  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

  // grab attributes
  each(root.attributes, function(el) {
    var val = el.value
    // remember attributes with expressions only
    if (brackets(/\{.*\}/).test(val)) attr[el.name] = val
  })

  if (dom.innerHTML && !/select|select|optgroup|tbody|tr/.test(tagName))
    // replace all the yield tags with the tag inner html
    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

  // options
  function updateOpts() {
    var ctx = hasImpl && isLoop ? self : parent || self
    // update opts from current DOM attributes
    each(root.attributes, function(el) {
      opts[el.name] = tmpl(el.value, ctx)
    })
    // recover those with expressions
    each(Object.keys(attr), function(name) {
      opts[name] = tmpl(attr[name], ctx)
    })
  }

  function normalizeData(data) {
    for (var key in item) {
      if (typeof self[key] !== T_UNDEF)
        self[key] = data[key]
    }
  }

  function inheritFromParent () {
    if (!self.parent || !isLoop) return
    each(Object.keys(self.parent), function(k) {
      // some properties must be always in sync with the parent tag
      var mustSync = ~propsInSyncWithParent.indexOf(k)
      if (typeof self[k] === T_UNDEF || mustSync) {
        // track the property to keep in sync
        // so we can keep it updated
        if (!mustSync) propsInSyncWithParent.push(k)
        self[k] = self.parent[k]
      }
    })
  }

  this.update = function(data) {
    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data)
    // inherit properties from the parent
    inheritFromParent()
    // normalize the tag properties in case an item object was initially passed
    if (typeof item === T_OBJECT || isArray(item)) {
      normalizeData(data)
      item = data
    }
    extend(self, data)
    updateOpts()
    self.trigger('update', data)
    update(expressions, self)
    self.trigger('updated')
  }

  this.mixin = function() {
    each(arguments, function(mix) {
      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
      each(Object.keys(mix), function(key) {
        // bind methods to self
        if (key != 'init')
          self[key] = isFunction(mix[key]) ? mix[key].bind(self) : mix[key]
      })
      // init method will be called automatically
      if (mix.init) mix.init.bind(self)()
    })
  }

  this.mount = function() {

    updateOpts()

    // initialiation
    fn && fn.call(self, opts)

    toggle(true)


    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions)
    if (!self.parent || hasImpl) parseExpressions(self.root, self, expressions) // top level before update, empty root

    if (!self.parent || isLoop) self.update(item)

    // internal use only, fixes #403
    self.trigger('premount')

    if (isLoop && !hasImpl) {
      // update the root attribute for the looped elements
      self.root = root = loopDom = dom.firstChild

    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild)
      if (root.stub) self.root = root = parent.root
    }
    // if it's not a child tag we can trigger its mount event
    if (!self.parent || self.parent.isMounted) {
      self.isMounted = true
      self.trigger('mount')
    }
    // otherwise we need to wait that the parent event gets triggered
    else self.parent.one('mount', function() {
      // avoid to trigger the `mount` event for the tags
      // not visible included in an if statement
      if (!isInStub(self.root)) {
        self.parent.isMounted = self.isMounted = true
        self.trigger('mount')
      }
    })
  }


  this.unmount = function(keepRootTag) {
    var el = loopDom || root,
        p = el.parentNode

    if (p) {

      if (parent)
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (isArray(parent.tags[tagName]))
          each(parent.tags[tagName], function(tag, i) {
            if (tag._id == self._id)
              parent.tags[tagName].splice(i, 1)
          })
        else
          // otherwise just delete the tag instance
          parent.tags[tagName] = undefined
      else
        while (el.firstChild) el.removeChild(el.firstChild)

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

      // the loop tags will be always in sync with the parent automatically
      if (isLoop)
        parent[evt]('unmount', self.unmount)
      else
        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
    }
  }

  // named elements available for fn
  parseNamedElements(dom, this, childTags)


}

function setEventHandler(name, handler, dom, tag) {

  dom[name] = function(e) {

    var item = tag._item,
        ptag = tag.parent

    if (!item)
      while (ptag) {
        item = ptag._item
        ptag = item ? false : ptag.parent
      }

    // cross browser event fix
    e = e || window.event

    // ignore error on some browsers
    try {
      e.currentTarget = dom
      if (!e.target) e.target = e.srcElement
      if (!e.which) e.which = e.charCode || e.keyCode
    } catch (ignored) { '' }

    e.item = item

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      e.preventDefault && e.preventDefault()
      e.returnValue = false
    }

    if (!e.preventUpdate) {
      var el = item ? tag.parent : tag
      el.update()
    }

  }

}

// used by if- attribute
function insertTo(root, node, before) {
  if (root) {
    root.insertBefore(before, node)
    root.removeChild(node)
  }
}

function update(expressions, tag) {

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
    if (!attrName) return dom.nodeValue = value.toString()

    // remove original attribute
    remAttr(dom, attrName)

    // event handler
    if (isFunction(value)) {
      setEventHandler(attrName, value, dom, tag)

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub

      // add to DOM
      if (value) {
        if (stub) {
          insertTo(stub.parentNode, stub, dom)
          dom.inStub = false
          // avoid to trigger the mount event if the tags is not visible yet
          // maybe we can optimize this avoiding to mount the tag at all
          if (!isInStub(dom)) {
            walk(dom, function(el) {
              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
            })
          }
        }
      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('')
        insertTo(dom.parentNode, dom, stub)
        dom.inStub = true
      }
    // show / hide
    } else if (/^(show|hide)$/.test(attrName)) {
      if (attrName == 'hide') value = !value
      dom.style.display = value ? '' : 'none'

    // field value
    } else if (attrName == 'value') {
      dom.value = value

    // <img src="{ expr }">
    } else if (attrName.slice(0, 5) == 'riot-' && attrName != 'riot-tag') {
      attrName = attrName.slice(5)
      value ? dom.setAttribute(attrName, value) : remAttr(dom, attrName)

    } else {
      if (expr.bool) {
        dom[attrName] = value
        if (!value) return
        value = attrName
      }

      if (typeof value !== T_OBJECT) dom.setAttribute(attrName, value)

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

function isFunction(v) {
  return typeof v === 'function' || false   // avoid IE problems
}

function remAttr(dom, name) {
  dom.removeAttribute(name)
}

function fastAbs(nr) {
  return (nr ^ (nr >> 31)) - (nr >> 31)
}

function getTag(dom) {
  var tagName = dom.tagName.toLowerCase()
  return tagImpl[dom.getAttribute(RIOT_TAG) || tagName]
}

function getTagName(dom) {
  var child = getTag(dom),
    namedTag = dom.getAttribute('name'),
    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child ? child.name : dom.tagName.toLowerCase()

  return tagName
}

function extend(src) {
  var obj, args = arguments
  for (var i = 1; i < args.length; ++i) {
    if ((obj = args[i])) {
      for (var key in obj) {      // eslint-disable-line guard-for-in
        src[key] = obj[key]
      }
    }
  }
  return src
}

// with this function we avoid that the current Tag methods get overridden
function cleanUpData(data) {
  if (!(data instanceof Tag)) return data

  var o = {},
      blackList = ['update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isloop', 'tags', 'parent', 'opts']
  for (var key in data) {
    if (!~blackList.indexOf(key))
      o[key] = data[key]
  }
  return o
}

function mkdom(template) {
  var checkie = ieVersion && ieVersion < 10,
      matches = /^\s*<([\w-]+)/.exec(template),
      tagName = matches ? matches[1].toLowerCase() : '',
      rootTag = (tagName === 'th' || tagName === 'td') ? 'tr' :
                (tagName === 'tr' ? 'tbody' : 'div'),
      el = mkEl(rootTag)

  el.stub = true

  if (checkie) {
    if (tagName === 'optgroup')
      optgroupInnerHTML(el, template)
    else if (tagName === 'option')
      optionInnerHTML(el, template)
    else if (rootTag !== 'div')
      tbodyInnerHTML(el, template, tagName)
    else
      checkie = 0
  }
  if (!checkie) el.innerHTML = template

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

function isInStub(dom) {
  while (dom) {
    if (dom.inStub) return true
    dom = dom.parentNode
  }
  return false
}

function mkEl(name) {
  return document.createElement(name)
}

function replaceYield (tmpl, innerHTML) {
  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gim, innerHTML || '')
}

function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

function inherit(parent) {
  function Child() {}
  Child.prototype = parent
  return new Child()
}

function setNamed(dom, parent, keys) {
  each(dom.attributes, function(attr) {
    if (dom._visited) return
    if (attr.name === 'id' || attr.name === 'name') {
      dom._visited = true
      var p, v = attr.value
      if (~keys.indexOf(v)) return

      p = parent[v]
      if (!p)
        parent[v] = dom
      else
        isArray(p) ? p.push(dom) : (parent[v] = [p, dom])
    }
  })
}
/**
 *
 * Hacks needed for the old internet explorer versions [lower than IE10]
 *
 */
/* istanbul ignore next */
function tbodyInnerHTML(el, html, tagName) {
  var div = mkEl('div'),
      loops = /td|th/.test(tagName) ? 3 : 2,
      child

  div.innerHTML = '<table>' + html + '</table>'
  child = div.firstChild

  while (loops--) child = child.firstChild

  el.appendChild(child)

}
/* istanbul ignore next */
function optionInnerHTML(el, html) {
  var opt = mkEl('option'),
      valRegx = /value=[\"'](.+?)[\"']/,
      selRegx = /selected=[\"'](.+?)[\"']/,
      eachRegx = /each=[\"'](.+?)[\"']/,
      ifRegx = /if=[\"'](.+?)[\"']/,
      innerRegx = />([^<]*)</,
      valuesMatch = html.match(valRegx),
      selectedMatch = html.match(selRegx),
      innerValue = html.match(innerRegx),
      eachMatch = html.match(eachRegx),
      ifMatch = html.match(ifRegx)

  if (innerValue) opt.innerHTML = innerValue[1]
  else opt.innerHTML = html

  if (valuesMatch) opt.value = valuesMatch[1]
  if (selectedMatch) opt.setAttribute('riot-selected', selectedMatch[1])
  if (eachMatch) opt.setAttribute('each', eachMatch[1])
  if (ifMatch) opt.setAttribute('if', ifMatch[1])

  el.appendChild(opt)
}
/* istanbul ignore next */
function optgroupInnerHTML(el, html) {
  var opt = mkEl('optgroup'),
      labelRegx = /label=[\"'](.+?)[\"']/,
      elementRegx = /^<([^>]*)>/,
      tagRegx = /^<([^ \>]*)/,
      labelMatch = html.match(labelRegx),
      elementMatch = html.match(elementRegx),
      tagMatch = html.match(tagRegx),
      innerContent = html

  if (elementMatch) {
    var options = html.slice(elementMatch[1].length+2, -tagMatch[1].length-3).trim()
    innerContent = options
  }

  if (labelMatch) opt.setAttribute('riot-label', labelMatch[1])

  if (innerContent) {
    var innerOpt = mkEl('div')

    optionInnerHTML(innerOpt, innerContent)

    opt.appendChild(innerOpt.firstChild)
  }

  el.appendChild(opt)
}

/*
 Virtual dom is an array of custom tags on the document.
 Updates and unmounts propagate downwards from parent to children.
*/

var virtualDom = [],
    tagImpl = {},
    styleNode

var RIOT_TAG = 'riot-tag'

function injectStyle(css) {

  styleNode = styleNode || mkEl('style')

  if (!document.head) return

  if (styleNode.styleSheet)
    styleNode.styleSheet.cssText += css
  else
    styleNode.innerHTML += css

  if (!styleNode._rendered)
    if (styleNode.styleSheet) {
      document.body.appendChild(styleNode)
    } else {
      var rs = $('style[type=riot]')
      if (rs) {
        rs.parentNode.insertBefore(styleNode, rs)
        rs.parentNode.removeChild(rs)
      } else document.head.appendChild(styleNode)

    }

  styleNode._rendered = true

}

function mountTo(root, tagName, opts) {
  var tag = tagImpl[tagName],
      // cache the inner HTML to fix #855
      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

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

riot.tag = function(name, html, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs
    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css
      css = ''
    } else attrs = ''
  }
  if (css) {
    if (isFunction(css)) fn = css
    else injectStyle(css)
  }
  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

riot.mount = function(selector, tagName, opts) {

  var els,
      allTags,
      tags = []

  // helper functions

  function addRiotTags(arr) {
    var list = ''
    each(arr, function (e) {
      list += ', *[riot-tag="'+ e.trim() + '"]'
    })
    return list
  }

  function selectAllTags() {
    var keys = Object.keys(tagImpl)
    return keys + addRiotTags(keys)
  }

  function pushTags(root) {
    if (root.tagName) {
      if (tagName && !root.getAttribute(RIOT_TAG))
        root.setAttribute(RIOT_TAG, tagName)

      var tag = mountTo(root,
        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

      if (tag) tags.push(tag)
    }
    else if (root.length) {
      each(root, pushTags)   // assume nodeList
    }
  }

  // ----- mount code -----

  if (typeof tagName === T_OBJECT) {
    opts = tagName
    tagName = 0
  }

  // crawl the DOM to find the tag
  if (typeof selector === T_STRING) {
    if (selector === '*')
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = allTags = selectAllTags()
    else
      // or just the ones named like the selector
      selector += addRiotTags(selector.split(','))

    els = $$(selector)
  }
  else
    // probably you have passed already a tag or a NodeList
    els = selector

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectAllTags()
    // if the root els it's just a single tag
    if (els.tagName)
      els = $$(tagName, els)
    else {
      // select all the children for all the different root elements
      var nodeList = []
      each(els, function (_el) {
        nodeList.push($$(tagName, _el))
      })
      els = nodeList
    }
    // get rid of the tagName
    tagName = 0
  }

  if (els.tagName)
    pushTags(els)
  else
    each(els, pushTags)

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
  /* istanbul ignore next */
  if (typeof exports === T_OBJECT)
    module.exports = riot
  else if (typeof define === 'function' && define.amd)
    define(function() { return window.riot = riot })
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
    return dispatch(ActionTypes.TEMPLATE_SAVE, task);
  },
  updateTemplate: function(task, index) {
    var data = {task: task, index: index};
    return dispatch(ActionTypes.TEMPLATE_UPDATE, data);
  },
  removeTemplate: function(index) {
    return dispatch(ActionTypes.TEMPLATE_REMOVE, index);
  },
  serverDataReceived: function (data) {
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

},{"./timeboxer_template/index.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/index.tag","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_meeting/progress.tag":[function(require,module,exports){
var riot = require('riot');
riot.tag('progress-bar', '<div class="progress"> <div class="progress-bar progress-bar-striped {this.progressState}" role="progressbar" style="width: {this.percentage}%;"> </div> </div>', function(opts) {

  this.showDanger = function() {
    this.progressState = 'progress-bar-danger';
  }.bind(this);

  this.showWarning = function() {
    this.progressState = 'progress-bar-warning';
  }.bind(this);

  this.showNormal = function() {
    this.progressState = 'progress-bar-success';
  }.bind(this);

  this.on('mount', function() {
    this.showNormal();
    this.update();
  });

  this.on('update', function() {
    this.percentage = opts['current-time']*100/opts['total-time'];

    if (opts['current-time'] < 20) {
      this.showDanger();
    } else if (opts['current-time'] < 50) {
      this.showWarning();
    } else {
      this.showNormal();
    }
  });


});

},{"riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_meeting/start.tag":[function(require,module,exports){
var riot = require('riot');
var timeboxer = require('../../actions/timeboxer.js');
var flux_riot = require('flux-riot');
var Timer = require('../../utils/timer');
require('./progress.tag');
require('./timer.tag');

riot.tag('timeboxer-meeting-start', '<hr> <progress-bar current-time="{this.currentTime.total}" total-time="{this.currentAgendaTime}"> </progress-bar> <div class="row"> <div class="col-md-9"> <h4 class="agenda-name">{ this.currentAgenda.name }</h4> <count-down-timer minutes="{this.currentTime.minutes}" seconds="{this.currentTime.seconds}"> </count-down-timer> <div class="row"> <div class="col-md-6"> <a href="#" onclick="{ startOrPause }" class="btn btn-block start-pause-button"> <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> <span id="agendaContinue">Start</span> </a> </div> <div class="col-md-6"> <a href="#" onclick="{ nextAgenda }" class="btn btn-block next-button" id="nextAgendaBtn"> <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span> Next </a> </div> </div> <div class="row"> <div class="col-md-3"> <a href="#" onclick="{ previousAgenda }" class="btn btn-xs btn-default"> <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span> Previous </a> <a href="#" onclick="{ reduceTime }" class="btn btn-xs btn-default">-1</a> <a href="#" onclick="{ increaseTime }" class="btn btn-xs btn-default">+1</a> </div> </div> </div> <div class="col-md-3"> <h4 class="counter-template-name"> { this.template.name } </h4> <ul class="list-group"> <li class="list-group-item" each="{ item, index in this.template.agenda }" if="{ !item.finished }" > <b>{ item.name }</b> <span class="badge">{ item.time }</span> </li> </ul> </div> </div> <div class="modal fade" id="allDone"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Notice</h4> </div> <div class="modal-body"> <p>Great Job finishing the meeting!!</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div> </div> </div> </div>', function(opts) {

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
    return opts.template_store.getAll()[opts.templateId];
  }.bind(this);

  this.nextAgenda = function() {
    this.resetStatus();
    this.template.agenda[this.currentAgendaIndex]['finished'] = true;
    this.currentAgendaIndex++;
    this.setCurrentAgenda();
    this.update();
  }.bind(this);

  this.previousAgenda = function() {
    this.resetStatus();
    this.currentAgendaIndex--;
    this.template.agenda[this.currentAgendaIndex]['finished'] = false;
    this.setCurrentAgenda();
  }.bind(this);

  this.reduceTime = function() {
    var remainingTime = this.timerClock.getTime();
    if (remainingTime - 60 > 0) {
      this.timerClock.setTime(remainingTime - 59);
    }
  }.bind(this);

  this.increaseTime = function() {
    var remainingTime = this.timerClock.getTime();
    this.currentAgendaTime = remainingTime + 60;
    this.timerClock.setTime(this.currentAgendaTime);
  }.bind(this);

  this.updateCurrentTime = function(time) {
    this.currentTime = {
      minutes: Math.floor(time/60),
      seconds: time % 60,
      total: time
    };
  }.bind(this);

  this.initClock = function() {
    this.timerClock = new Timer({
      pulseCb: function (time) {
        this.updateCurrentTime(time);
        this.update();
      }.bind(this),
      endCb: function () {

      }.bind(this),
      time: this.currentAgendaTime
    });
  }.bind(this);

  this.updateFromStore = function() {
    this.getTemplateFromStore();
    this.setCurrentAgenda();
    this.update();
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
  }.bind(this);

  flux_riot.storeMixin(this, opts.template_store, this.updateFromStore);
  this.on('mount', function() {
    this.template = this.getTemplateFromStore();
    this.initClock();
    this.resetStatus();
    this.setCurrentAgenda();
    this.updateCurrentTime(this.currentAgendaTime);
    this.update();
  });

  this.on('unmount', function() {
    this.timerClock.stop();
  });


});

},{"../../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","../../utils/timer":"/Users/surian/Sites/Private/timeboxer/src/js/utils/timer.js","./progress.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_meeting/progress.tag","./timer.tag":"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_meeting/timer.tag","flux-riot":"/Users/surian/Sites/Private/timeboxer/node_modules/flux-riot/flux-riot.js","riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_meeting/timer.tag":[function(require,module,exports){
var riot = require('riot');
riot.tag('count-down-timer', '<div class="timerContainer {this.containerClass}"> <span>{this.minutes}</span>:<span>{this.seconds}</span> </div>', function(opts) {

  this.prettify = function(data) {
    return (data < 10) ? '0'+ data : data;
  }.bind(this);

  this.showDanger = function() {
    this.containerClass = 'danger';
  }.bind(this);
  this.showNormal = function() {
   this.containerClass = '';
  }.bind(this);
  this.showWarning = function() {
   this.containerClass = 'warning';
  }.bind(this);

  this.on('update', function() {
    this.minutes = opts.minutes;
    this.seconds = this.prettify(opts.seconds);
    if (opts.minutes === 0) {
      if (opts.seconds < 20) {
        this.showDanger();
      } else if (opts.seconds < 50) {
        this.showWarning();
      }
    } else {
      this.showNormal();
    }
  });

});
},{"riot":"/Users/surian/Sites/Private/timeboxer/node_modules/riot/riot.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/components/timeboxer_template/add.tag":[function(require,module,exports){
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

riot.tag('timer-list', '<li class="list-group-item" > <input type="text" value="{agenda.name}" name="itemName"> <span> For </span> <input type="text" value="{agenda.time}" name="itemTime"> <span> Minutes </span> <span onclick="{moveUp}" data-index="{index}" class="btn btn-default glyphicon glyphicon-arrow-up"> </span> <span onclick="{moveDown}" data-index="{index}" class="btn btn-default glyphicon glyphicon-arrow-down"> </span> <span onclick="{deleteItem}" data-index="{index}" class="btn btn-default glyphicon glyphicon-remove"> </span> <span onclick="{insertAbove}" data-index="{index}" class="btn btn-default glyphicon glyphicon-open-file"> </span> </li>', function(opts) {

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
  this.insertAbove = function(event) {
    var index = parseInt(event.target.dataset.index, 10);
    this.addNewRow(index);
  }.bind(this);

});

riot.tag('timeboxer-template-edit', '<p if="{opts.is_error}"> Fill up all the values </p> <h4> {opts.title} </h4> <form onsubmit="{updateAgenda}"> <div class="form-group"> <input type="text" class="form-control" id="templateName" value="{agendaItems.name}"> </div> <div class="form-group"> <label>Agenda</label> <ul class="list-group"> <timer-list each="{agenda, index in agendaItems.agenda}" data="agenda"></ul> </li> </ul> </div> <button class="btn btn-default" onclick="{insertEnd}">New Item</button> <button type="submit" class="btn btn-default">Update</button> </form>', function(opts) {
  this.insertEnd = function() {
    this.addNewRow(this.agendaItems.agenda.length);
  }.bind(this);

  this.addNewRow = function(rowNum) {
    var agenda = {
      name: '',
      time: ''
    };
    this.agendaItems.agenda.splice(rowNum, 0, agenda);
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
},{"../actions/timeboxer.js":"/Users/surian/Sites/Private/timeboxer/src/js/actions/timeboxer.js","./localStorage.js":"/Users/surian/Sites/Private/timeboxer/src/js/utils/localStorage.js","parse":"/Users/surian/Sites/Private/timeboxer/node_modules/parse/build/parse-latest.js"}],"/Users/surian/Sites/Private/timeboxer/src/js/utils/timer.js":[function(require,module,exports){
function Timer(opts) {
  var time = opts.time;
  var endCb = opts.endCb || function () {};
  var pulseCb = opts.pulseCb || function () {};
  var timeOutId = null;

  function updateTime() {

    if (time > 0) {
      time = time - 1;
      pulseCb(time);
      timeOutId = setTimeout(function () {
        updateTime();
      }, 1000);
    } else {
      endCb();
    }
  }

  this.setTime = function (newTime) {
    time = parseInt(newTime, 10);
    pulseCb(time);
  };

  this.getTime = function () {
    return time;
  };

  this.stop = function () {
    clearTimeout(timeOutId);
  };

  this.start = function () {
    updateTime();
  };

  this.reset = function () {
    time = opts.time;
    clearTimeout(timeOutId);
  };
}

module.exports = Timer;

},{}]},{},["./src/js/index.js"])