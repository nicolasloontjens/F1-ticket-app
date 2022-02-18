/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************!*\
  !*** ./resources/js/data.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDriverStandingsEndOfSeason": () => (/* binding */ getDriverStandingsEndOfSeason),
/* harmony export */   "getConstructorStandingsEndOfSeason": () => (/* binding */ getConstructorStandingsEndOfSeason),
/* harmony export */   "getAllRaces": () => (/* binding */ getAllRaces),
/* harmony export */   "getAllRaceCountries": () => (/* binding */ getAllRaceCountries),
/* harmony export */   "getHighestPointsInAYear": () => (/* binding */ getHighestPointsInAYear),
/* harmony export */   "getHighestPointsAfterRound": () => (/* binding */ getHighestPointsAfterRound),
/* harmony export */   "getDriverPointsOverSeason": () => (/* binding */ getDriverPointsOverSeason),
/* harmony export */   "getRaceResults": () => (/* binding */ getRaceResults),
/* harmony export */   "getDriverStandingsAfterRound": () => (/* binding */ getDriverStandingsAfterRound),
/* harmony export */   "getRoundInfo": () => (/* binding */ getRoundInfo),
/* harmony export */   "getSeasonInfo": () => (/* binding */ getSeasonInfo),
/* harmony export */   "getAllDrivers": () => (/* binding */ getAllDrivers),
/* harmony export */   "getDriverInformation": () => (/* binding */ getDriverInformation),
/* harmony export */   "getAllDriverWins": () => (/* binding */ getAllDriverWins),
/* harmony export */   "getTotalDriverWDC": () => (/* binding */ getTotalDriverWDC),
/* harmony export */   "getDriverWDCYears": () => (/* binding */ getDriverWDCYears),
/* harmony export */   "getAllDriverPoles": () => (/* binding */ getAllDriverPoles),
/* harmony export */   "getAllDriverPodiums": () => (/* binding */ getAllDriverPodiums),
/* harmony export */   "getDriverPointsPerSeason": () => (/* binding */ getDriverPointsPerSeason),
/* harmony export */   "getDriverWinsPerSeason": () => (/* binding */ getDriverWinsPerSeason),
/* harmony export */   "getAllConstructors": () => (/* binding */ getAllConstructors),
/* harmony export */   "getBasicConstructorInfo": () => (/* binding */ getBasicConstructorInfo),
/* harmony export */   "getTotalConstructorChampionships": () => (/* binding */ getTotalConstructorChampionships),
/* harmony export */   "getConstructorChampionships": () => (/* binding */ getConstructorChampionships),
/* harmony export */   "getConstructorYearsInF1": () => (/* binding */ getConstructorYearsInF1),
/* harmony export */   "getConstructorWinsPerSeason": () => (/* binding */ getConstructorWinsPerSeason),
/* harmony export */   "getAllDriversForConstructor": () => (/* binding */ getAllDriversForConstructor)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function fetchDriverStandingsEndOfSeason(_x) {
  return _fetchDriverStandingsEndOfSeason.apply(this, arguments);
}

function _fetchDriverStandingsEndOfSeason() {
  _fetchDriverStandingsEndOfSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee(year) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, "/driverStandings.json"));

          case 3:
            api_resp = _context.sent;
            _context.next = 6;
            return api_resp.json();

          case 6:
            resp = _context.sent;
            return _context.abrupt("return", resp.MRData.StandingsTable.StandingsLists[0]);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));
  return _fetchDriverStandingsEndOfSeason.apply(this, arguments);
}

function fetchConstructorStandingsEndOfSeason(_x2) {
  return _fetchConstructorStandingsEndOfSeason.apply(this, arguments);
}

function _fetchConstructorStandingsEndOfSeason() {
  _fetchConstructorStandingsEndOfSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(year) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, "/constructorStandings.json"));

          case 3:
            api_resp = _context2.sent;
            _context2.next = 6;
            return api_resp.json();

          case 6:
            resp = _context2.sent;
            return _context2.abrupt("return", resp.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));
  return _fetchConstructorStandingsEndOfSeason.apply(this, arguments);
}

function fetchAllDriversFromSeason(_x3) {
  return _fetchAllDriversFromSeason.apply(this, arguments);
}

function _fetchAllDriversFromSeason() {
  _fetchAllDriversFromSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3(year) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, "/drivers.json?limit=1000000"));

          case 3:
            api_resp = _context3.sent;
            _context3.next = 6;
            return api_resp.json();

          case 6:
            resp = _context3.sent;
            return _context3.abrupt("return", resp.MRData.DriverTable.Drivers);

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return _fetchAllDriversFromSeason.apply(this, arguments);
}

function fetchAllRacesFromSeason(_x4) {
  return _fetchAllRacesFromSeason.apply(this, arguments);
}

function _fetchAllRacesFromSeason() {
  _fetchAllRacesFromSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4(year) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, ".json?limit=10000"));

          case 3:
            api_resp = _context4.sent;
            _context4.next = 6;
            return api_resp.json();

          case 6:
            resp = _context4.sent;
            return _context4.abrupt("return", resp.MRData.RaceTable.Races);

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return _fetchAllRacesFromSeason.apply(this, arguments);
}

function fetchYearResults(_x5) {
  return _fetchYearResults.apply(this, arguments);
}

function _fetchYearResults() {
  _fetchYearResults = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5(year) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, "/results.json?limit=1000000"));

          case 3:
            api_resp = _context5.sent;
            _context5.next = 6;
            return api_resp.json();

          case 6:
            resp = _context5.sent;
            return _context5.abrupt("return", resp.MRData.RaceTable.Races);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 10]]);
  }));
  return _fetchYearResults.apply(this, arguments);
}

function fetchRaceResults(_x6, _x7) {
  return _fetchRaceResults.apply(this, arguments);
}

function _fetchRaceResults() {
  _fetchRaceResults = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6(year, round) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, "/").concat(round, "/results.json?limit=10000"));

          case 3:
            api_resp = _context6.sent;
            _context6.next = 6;
            return api_resp.json();

          case 6:
            resp = _context6.sent;
            return _context6.abrupt("return", resp.MRData.RaceTable.Races[0]);

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 10]]);
  }));
  return _fetchRaceResults.apply(this, arguments);
}

function fetchDriverStandingsAfterRound(_x8, _x9) {
  return _fetchDriverStandingsAfterRound.apply(this, arguments);
}

function _fetchDriverStandingsAfterRound() {
  _fetchDriverStandingsAfterRound = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7(year, round) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, "/").concat(round, "/driverStandings.json?limit=10000"));

          case 3:
            api_resp = _context7.sent;
            _context7.next = 6;
            return api_resp.json();

          case 6:
            resp = _context7.sent;
            return _context7.abrupt("return", resp.MRData.StandingsTable.StandingsLists[0].DriverStandings);

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7["catch"](0);
            console.log(_context7.t0);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 10]]);
  }));
  return _fetchDriverStandingsAfterRound.apply(this, arguments);
}

function fetchAllDrivers() {
  return _fetchAllDrivers.apply(this, arguments);
}

function _fetchAllDrivers() {
  _fetchAllDrivers = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee8() {
    var api_resp, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return fetch("https://ergast.com/api/f1/drivers.json?limit=100000");

          case 3:
            api_resp = _context8.sent;
            _context8.next = 6;
            return api_resp.json();

          case 6:
            response = _context8.sent;
            return _context8.abrupt("return", response.MRData.DriverTable.Drivers);

          case 10:
            _context8.prev = 10;
            _context8.t0 = _context8["catch"](0);
            console.log(_context8.t0);

          case 13:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 10]]);
  }));
  return _fetchAllDrivers.apply(this, arguments);
}

function fetchDriverInformation(_x10) {
  return _fetchDriverInformation.apply(this, arguments);
}

function _fetchDriverInformation() {
  _fetchDriverInformation = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee9(driverId) {
    var api_resp, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return fetch("https://ergast.com/api/f1/drivers/".concat(driverId, ".json"));

          case 3:
            api_resp = _context9.sent;
            _context9.next = 6;
            return api_resp.json();

          case 6:
            response = _context9.sent;
            return _context9.abrupt("return", response.MRData.DriverTable.Drivers[0]);

          case 10:
            _context9.prev = 10;
            _context9.t0 = _context9["catch"](0);
            console.log(_context9.t0);

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 10]]);
  }));
  return _fetchDriverInformation.apply(this, arguments);
}

function fetchDriverFinishingPositions(_x11, _x12) {
  return _fetchDriverFinishingPositions.apply(this, arguments);
}

function _fetchDriverFinishingPositions() {
  _fetchDriverFinishingPositions = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee10(driverId, pos) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return fetch("https://ergast.com/api/f1/drivers/".concat(driverId, "/results/").concat(pos, ".json?limit=250"));

          case 3:
            api_resp = _context10.sent;
            _context10.next = 6;
            return api_resp.json();

          case 6:
            resp = _context10.sent;
            return _context10.abrupt("return", resp.MRData);

          case 10:
            _context10.prev = 10;
            _context10.t0 = _context10["catch"](0);
            console.log(_context10.t0);

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 10]]);
  }));
  return _fetchDriverFinishingPositions.apply(this, arguments);
}

function fetchAllDriverWDC(_x13) {
  return _fetchAllDriverWDC.apply(this, arguments);
}

function _fetchAllDriverWDC() {
  _fetchAllDriverWDC = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee11(driverId) {
    var api_resp, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return fetch("https://ergast.com/api/f1/drivers/".concat(driverId, "/driverStandings/1/seasons.json"));

          case 3:
            api_resp = _context11.sent;
            _context11.next = 6;
            return api_resp.json();

          case 6:
            response = _context11.sent;
            return _context11.abrupt("return", response.MRData);

          case 10:
            _context11.prev = 10;
            _context11.t0 = _context11["catch"](0);
            console.log(_context11.t0);

          case 13:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 10]]);
  }));
  return _fetchAllDriverWDC.apply(this, arguments);
}

function fetchAllDriverPolePositions(_x14) {
  return _fetchAllDriverPolePositions.apply(this, arguments);
}

function _fetchAllDriverPolePositions() {
  _fetchAllDriverPolePositions = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee12(driverId) {
    var api_response, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return fetch("https://ergast.com/api/f1/drivers/".concat(driverId, "/qualifying/1.json?limit=1000"));

          case 3:
            api_response = _context12.sent;
            _context12.next = 6;
            return api_response.json();

          case 6:
            response = _context12.sent;
            response = parseInt(response.MRData.total);
            return _context12.abrupt("return", response);

          case 11:
            _context12.prev = 11;
            _context12.t0 = _context12["catch"](0);
            console.log(_context12.t0);

          case 14:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 11]]);
  }));
  return _fetchAllDriverPolePositions.apply(this, arguments);
}

function fetchAllDriverYearsInF1(_x15) {
  return _fetchAllDriverYearsInF.apply(this, arguments);
}

function _fetchAllDriverYearsInF() {
  _fetchAllDriverYearsInF = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee13(driverId) {
    var api_resp, response, years;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return fetch("https://ergast.com/api/f1/drivers/".concat(driverId, "/seasons.json?limit=1000"));

          case 3:
            api_resp = _context13.sent;
            _context13.next = 6;
            return api_resp.json();

          case 6:
            response = _context13.sent;
            years = [];
            response.MRData.SeasonTable.Seasons.forEach(function (season) {
              years.push(season.season);
            });
            return _context13.abrupt("return", years);

          case 12:
            _context13.prev = 12;
            _context13.t0 = _context13["catch"](0);
            console.log(_context13.t0);

          case 15:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 12]]);
  }));
  return _fetchAllDriverYearsInF.apply(this, arguments);
}

function fetchDriverSeasonResults(_x16, _x17) {
  return _fetchDriverSeasonResults.apply(this, arguments);
}

function _fetchDriverSeasonResults() {
  _fetchDriverSeasonResults = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee14(year, driverId) {
    var api_resp, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            _context14.next = 3;
            return fetch("https://ergast.com/api/f1/".concat(year, "/drivers/").concat(driverId, "/results.json?limit=10000"));

          case 3:
            api_resp = _context14.sent;
            _context14.next = 6;
            return api_resp.json();

          case 6:
            resp = _context14.sent;
            return _context14.abrupt("return", resp.MRData.RaceTable.Races);

          case 10:
            _context14.prev = 10;
            _context14.t0 = _context14["catch"](0);
            console.log(_context14.t0);

          case 13:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 10]]);
  }));
  return _fetchDriverSeasonResults.apply(this, arguments);
}

function fetchAllConstructors() {
  return _fetchAllConstructors.apply(this, arguments);
}

function _fetchAllConstructors() {
  _fetchAllConstructors = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee15() {
    var api_resp, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return fetch("https://ergast.com/api/f1/constructors.json?limit=10000");

          case 3:
            api_resp = _context15.sent;
            _context15.next = 6;
            return api_resp.json();

          case 6:
            response = _context15.sent;
            return _context15.abrupt("return", response.MRData.ConstructorTable.Constructors);

          case 10:
            _context15.prev = 10;
            _context15.t0 = _context15["catch"](0);
            console.log(_context15.t0);

          case 13:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 10]]);
  }));
  return _fetchAllConstructors.apply(this, arguments);
}

function fetchBasicConstructorInfo(_x18) {
  return _fetchBasicConstructorInfo.apply(this, arguments);
}

function _fetchBasicConstructorInfo() {
  _fetchBasicConstructorInfo = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee16(constructorId) {
    var api_response, resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return fetch("https://ergast.com/api/f1/constructors/".concat(constructorId, ".json?limit=1000"));

          case 3:
            api_response = _context16.sent;
            _context16.next = 6;
            return api_response.json();

          case 6:
            resp = _context16.sent;
            return _context16.abrupt("return", resp.MRData.ConstructorTable.Constructors[0]);

          case 10:
            _context16.prev = 10;
            _context16.t0 = _context16["catch"](0);
            console.log(_context16.t0);

          case 13:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 10]]);
  }));
  return _fetchBasicConstructorInfo.apply(this, arguments);
}

function fetchConstructorChampionships(_x19) {
  return _fetchConstructorChampionships.apply(this, arguments);
}

function _fetchConstructorChampionships() {
  _fetchConstructorChampionships = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee17(constructorId) {
    var api_resp, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return fetch("https://ergast.com/api/f1/constructors/".concat(constructorId, "/constructorstandings/1.json?limit=10000"));

          case 3:
            api_resp = _context17.sent;
            _context17.next = 6;
            return api_resp.json();

          case 6:
            response = _context17.sent;
            return _context17.abrupt("return", response.MRData);

          case 10:
            _context17.prev = 10;
            _context17.t0 = _context17["catch"](0);
            console.log(_context17.t0);

          case 13:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 10]]);
  }));
  return _fetchConstructorChampionships.apply(this, arguments);
}

function fetchConstructorYearsInF1(_x20) {
  return _fetchConstructorYearsInF.apply(this, arguments);
}

function _fetchConstructorYearsInF() {
  _fetchConstructorYearsInF = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee18(constructorId) {
    var api_response, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            _context18.next = 3;
            return fetch("https://ergast.com/api/f1/constructors/".concat(constructorId, "/seasons.json?limit=1000"));

          case 3:
            api_response = _context18.sent;
            _context18.next = 6;
            return api_response.json();

          case 6:
            response = _context18.sent;
            return _context18.abrupt("return", response.MRData.SeasonTable.Seasons);

          case 10:
            _context18.prev = 10;
            _context18.t0 = _context18["catch"](0);
            console.log(_context18.t0);

          case 13:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 10]]);
  }));
  return _fetchConstructorYearsInF.apply(this, arguments);
}

function fetchConstructorWinsAllTime(_x21) {
  return _fetchConstructorWinsAllTime.apply(this, arguments);
}

function _fetchConstructorWinsAllTime() {
  _fetchConstructorWinsAllTime = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee19(constructorId) {
    var api_response, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            _context19.next = 3;
            return fetch("https://ergast.com/api/f1/constructors/".concat(constructorId, "/results/1.json?limit=10000"));

          case 3:
            api_response = _context19.sent;
            _context19.next = 6;
            return api_response.json();

          case 6:
            response = _context19.sent;
            return _context19.abrupt("return", response.MRData.RaceTable.Races);

          case 10:
            _context19.prev = 10;
            _context19.t0 = _context19["catch"](0);
            console.log(_context19.t0);

          case 13:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[0, 10]]);
  }));
  return _fetchConstructorWinsAllTime.apply(this, arguments);
}

function fetchAllDriversForConstructor(_x22) {
  return _fetchAllDriversForConstructor.apply(this, arguments);
}

function _fetchAllDriversForConstructor() {
  _fetchAllDriversForConstructor = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee20(constructorId) {
    var api_res, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.prev = 0;
            _context20.next = 3;
            return fetch("https://ergast.com/api/f1/constructors/".concat(constructorId, "/drivers.json?limit=10000"));

          case 3:
            api_res = _context20.sent;
            _context20.next = 6;
            return api_res.json();

          case 6:
            response = _context20.sent;
            return _context20.abrupt("return", response.MRData.DriverTable.Drivers);

          case 10:
            _context20.prev = 10;
            _context20.t0 = _context20["catch"](0);
            console.log(_context20.t0);

          case 13:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[0, 10]]);
  }));
  return _fetchAllDriversForConstructor.apply(this, arguments);
}

function getDriverStandingsEndOfSeason(_x23) {
  return _getDriverStandingsEndOfSeason.apply(this, arguments);
}

function _getDriverStandingsEndOfSeason() {
  _getDriverStandingsEndOfSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee21(year) {
    var standingslist, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return fetchDriverStandingsEndOfSeason(year);

          case 2:
            standingslist = _context21.sent;
            response = {};
            standingslist.DriverStandings.forEach(function (driver) {
              var name = driver.Driver.givenName + " " + driver.Driver.familyName;
              response[name] = parseFloat(driver.points);
            });
            return _context21.abrupt("return", response);

          case 6:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));
  return _getDriverStandingsEndOfSeason.apply(this, arguments);
}

function getConstructorStandingsEndOfSeason(_x24) {
  return _getConstructorStandingsEndOfSeason.apply(this, arguments);
}

function _getConstructorStandingsEndOfSeason() {
  _getConstructorStandingsEndOfSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee22(year) {
    var standingslist, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return fetchConstructorStandingsEndOfSeason(year);

          case 2:
            standingslist = _context22.sent;
            response = {};
            standingslist.forEach(function (constructor) {
              var name = constructor.Constructor.name;
              response[name] = parseFloat(constructor.points);
            });
            return _context22.abrupt("return", response);

          case 6:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));
  return _getConstructorStandingsEndOfSeason.apply(this, arguments);
}

function getAllRaces(_x25) {
  return _getAllRaces.apply(this, arguments);
}

function _getAllRaces() {
  _getAllRaces = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee23(year) {
    var races;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return fetchAllRacesFromSeason(year);

          case 2:
            races = _context23.sent;
            return _context23.abrupt("return", races.map(function (race) {
              return race.raceName;
            }));

          case 4:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));
  return _getAllRaces.apply(this, arguments);
}

function getAllRaceCountries(_x26) {
  return _getAllRaceCountries.apply(this, arguments);
}

function _getAllRaceCountries() {
  _getAllRaceCountries = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee24(year) {
    var races;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return fetchAllRacesFromSeason(year);

          case 2:
            races = _context24.sent;
            return _context24.abrupt("return", races.map(function (race) {
              return race.Circuit.Location.country;
            }));

          case 4:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));
  return _getAllRaceCountries.apply(this, arguments);
}

function getHighestPointsInAYear(_x27) {
  return _getHighestPointsInAYear.apply(this, arguments);
}

function _getHighestPointsInAYear() {
  _getHighestPointsInAYear = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee25(year) {
    var standings;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.next = 2;
            return fetchDriverStandingsEndOfSeason(year);

          case 2:
            standings = _context25.sent;
            return _context25.abrupt("return", standings.DriverStandings[0].points);

          case 4:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));
  return _getHighestPointsInAYear.apply(this, arguments);
}

function getHighestPointsAfterRound(_x28, _x29) {
  return _getHighestPointsAfterRound.apply(this, arguments);
}

function _getHighestPointsAfterRound() {
  _getHighestPointsAfterRound = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee26(year, round) {
    var standings;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _context26.next = 2;
            return fetchDriverStandingsAfterRound(year, round);

          case 2:
            standings = _context26.sent;
            return _context26.abrupt("return", parseFloat(standings[0].points));

          case 4:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));
  return _getHighestPointsAfterRound.apply(this, arguments);
}

function getDriverPointsOverSeason(_x30) {
  return _getDriverPointsOverSeason.apply(this, arguments);
}

function _getDriverPointsOverSeason() {
  _getDriverPointsOverSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee27(year) {
    var drivers, yearresults, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.next = 2;
            return fetchAllDriversFromSeason(year);

          case 2:
            drivers = _context27.sent;
            _context27.next = 5;
            return fetchYearResults(year);

          case 5:
            yearresults = _context27.sent;
            response = [];
            drivers.forEach(function (driver) {
              var currentdriver = {};
              currentdriver["id"] = driver.givenName + " " + driver.familyName;
              currentdriver["values"] = {};
              currentdriver["totalpoints"] = 0;
              response.push(currentdriver);
            });
            yearresults.forEach(function (race) {
              var racename = race.raceName;
              race.Results.forEach(function (result) {
                var driverid = result.Driver.givenName + " " + result.Driver.familyName;
                var points = parseFloat(result.points); //result of the current race

                var driver = response.find(function (driver) {
                  return driver.id === driverid;
                });
                points += driver["totalpoints"];
                driver["totalpoints"] = points;
                driver["values"][racename] = points;
              });
            });
            return _context27.abrupt("return", response);

          case 10:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27);
  }));
  return _getDriverPointsOverSeason.apply(this, arguments);
}

function getRaceResults(_x31, _x32) {
  return _getRaceResults.apply(this, arguments);
}

function _getRaceResults() {
  _getRaceResults = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee28(year, round) {
    var results, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _context28.next = 2;
            return fetchRaceResults(year, round);

          case 2:
            results = _context28.sent;
            response = {};
            results.Results.forEach(function (driver) {
              var drivername = driver.Driver.givenName + " " + driver.Driver.familyName;
              response[drivername] = parseFloat(driver.points);
            });
            return _context28.abrupt("return", response);

          case 6:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28);
  }));
  return _getRaceResults.apply(this, arguments);
}

function getDriverStandingsAfterRound(_x33, _x34) {
  return _getDriverStandingsAfterRound.apply(this, arguments);
}

function _getDriverStandingsAfterRound() {
  _getDriverStandingsAfterRound = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee29(year, round) {
    var standings, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return fetchDriverStandingsAfterRound(year, round);

          case 2:
            standings = _context29.sent;
            response = {};
            standings.forEach(function (driver) {
              var drivername = driver.Driver.givenName + " " + driver.Driver.familyName;
              response[drivername] = parseFloat(driver.points);
            });
            return _context29.abrupt("return", response);

          case 6:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29);
  }));
  return _getDriverStandingsAfterRound.apply(this, arguments);
}

function getRoundInfo(_x35, _x36) {
  return _getRoundInfo.apply(this, arguments);
}

function _getRoundInfo() {
  _getRoundInfo = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee30(year, round) {
    var roundinfo;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _context30.next = 2;
            return fetchRaceResults(year, round);

          case 2:
            roundinfo = _context30.sent;
            return _context30.abrupt("return", roundinfo);

          case 4:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30);
  }));
  return _getRoundInfo.apply(this, arguments);
}

function getSeasonInfo(_x37) {
  return _getSeasonInfo.apply(this, arguments);
}

function _getSeasonInfo() {
  _getSeasonInfo = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee31(year) {
    var seasoninfo;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            _context31.next = 2;
            return fetchDriverStandingsEndOfSeason(year);

          case 2:
            seasoninfo = _context31.sent;
            return _context31.abrupt("return", seasoninfo);

          case 4:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));
  return _getSeasonInfo.apply(this, arguments);
}

function getAllDrivers() {
  return _getAllDrivers.apply(this, arguments);
}

function _getAllDrivers() {
  _getAllDrivers = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee32() {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _context32.next = 2;
            return fetchAllDrivers();

          case 2:
            return _context32.abrupt("return", _context32.sent);

          case 3:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32);
  }));
  return _getAllDrivers.apply(this, arguments);
}

function getDriverInformation(_x38) {
  return _getDriverInformation.apply(this, arguments);
}

function _getDriverInformation() {
  _getDriverInformation = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee33(driverId) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return fetchDriverInformation(driverId);

          case 2:
            return _context33.abrupt("return", _context33.sent);

          case 3:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));
  return _getDriverInformation.apply(this, arguments);
}

function getAllDriverWins(_x39) {
  return _getAllDriverWins.apply(this, arguments);
}

function _getAllDriverWins() {
  _getAllDriverWins = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee34(driverId) {
    var wins;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.next = 2;
            return fetchDriverFinishingPositions(driverId, 1);

          case 2:
            wins = _context34.sent;
            return _context34.abrupt("return", parseInt(wins.total));

          case 4:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34);
  }));
  return _getAllDriverWins.apply(this, arguments);
}

function getTotalDriverWDC(_x40) {
  return _getTotalDriverWDC.apply(this, arguments);
}

function _getTotalDriverWDC() {
  _getTotalDriverWDC = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee35(driverId) {
    var response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _context35.next = 2;
            return fetchAllDriverWDC(driverId);

          case 2:
            response = _context35.sent;
            return _context35.abrupt("return", parseInt(response.total));

          case 4:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));
  return _getTotalDriverWDC.apply(this, arguments);
}

function getDriverWDCYears(_x41) {
  return _getDriverWDCYears.apply(this, arguments);
}

function _getDriverWDCYears() {
  _getDriverWDCYears = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee36(driverId) {
    var data, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _context36.next = 2;
            return fetchAllDriverWDC(driverId);

          case 2:
            data = _context36.sent;
            response = [];

            if (data.SeasonTable.Seasons.length > 0) {
              data.SeasonTable.Seasons.forEach(function (season) {
                response.push(season.season);
              });
            }

            return _context36.abrupt("return", response);

          case 6:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36);
  }));
  return _getDriverWDCYears.apply(this, arguments);
}

function getAllDriverPoles(_x42) {
  return _getAllDriverPoles.apply(this, arguments);
}

function _getAllDriverPoles() {
  _getAllDriverPoles = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee37(driverId) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            _context37.next = 2;
            return fetchAllDriverPolePositions(driverId);

          case 2:
            return _context37.abrupt("return", _context37.sent);

          case 3:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37);
  }));
  return _getAllDriverPoles.apply(this, arguments);
}

function getAllDriverPodiums(_x43) {
  return _getAllDriverPodiums.apply(this, arguments);
}

function _getAllDriverPodiums() {
  _getAllDriverPodiums = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee38(driverId) {
    var wins, second, third;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return getAllDriverWins();

          case 2:
            wins = _context38.sent;
            _context38.next = 5;
            return fetchDriverFinishingPositions(driverId, 2);

          case 5:
            second = _context38.sent;
            _context38.next = 8;
            return fetchDriverFinishingPositions(driverId, 3);

          case 8:
            third = _context38.sent;
            second = parseInt(second.total);
            third = parseInt(third.total);
            return _context38.abrupt("return", wins + second + third);

          case 12:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38);
  }));
  return _getAllDriverPodiums.apply(this, arguments);
}

function getDriverPointsPerSeason(_x44) {
  return _getDriverPointsPerSeason.apply(this, arguments);
} //helper function for getDriverPointsPerSeason that counts total points

function _getDriverPointsPerSeason() {
  _getDriverPointsPerSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee39(driverId) {
    var years, response, _iterator, _step, year, points;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _context39.next = 2;
            return fetchAllDriverYearsInF1(driverId);

          case 2:
            years = _context39.sent;
            response = {};
            _iterator = _createForOfIteratorHelper(years);
            _context39.prev = 5;

            _iterator.s();

          case 7:
            if ((_step = _iterator.n()).done) {
              _context39.next = 15;
              break;
            }

            year = _step.value;
            _context39.next = 11;
            return getPointsPerSeason(driverId, year);

          case 11:
            points = _context39.sent;
            response[year] = points;

          case 13:
            _context39.next = 7;
            break;

          case 15:
            _context39.next = 20;
            break;

          case 17:
            _context39.prev = 17;
            _context39.t0 = _context39["catch"](5);

            _iterator.e(_context39.t0);

          case 20:
            _context39.prev = 20;

            _iterator.f();

            return _context39.finish(20);

          case 23:
            return _context39.abrupt("return", response);

          case 24:
          case "end":
            return _context39.stop();
        }
      }
    }, _callee39, null, [[5, 17, 20, 23]]);
  }));
  return _getDriverPointsPerSeason.apply(this, arguments);
}

function getPointsPerSeason(_x45, _x46) {
  return _getPointsPerSeason.apply(this, arguments);
}

function _getPointsPerSeason() {
  _getPointsPerSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee40(driverId, year) {
    var response, total;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee40$(_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
          case 0:
            _context40.next = 2;
            return fetchDriverSeasonResults(year, driverId);

          case 2:
            response = _context40.sent;
            total = 0;
            response.forEach(function (race) {
              var points = race.Results[0].points;
              total += parseFloat(points);
            });
            return _context40.abrupt("return", total);

          case 6:
          case "end":
            return _context40.stop();
        }
      }
    }, _callee40);
  }));
  return _getPointsPerSeason.apply(this, arguments);
}

function getWinsPerSeason(_x47, _x48) {
  return _getWinsPerSeason.apply(this, arguments);
}

function _getWinsPerSeason() {
  _getWinsPerSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee41(driverId, year) {
    var response, totalwins;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            _context41.next = 2;
            return fetchDriverSeasonResults(year, driverId);

          case 2:
            response = _context41.sent;
            totalwins = 0;
            response.forEach(function (race) {
              if (race.Results[0].position === "1") {
                totalwins++;
              }
            });
            return _context41.abrupt("return", totalwins);

          case 6:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41);
  }));
  return _getWinsPerSeason.apply(this, arguments);
}

function getDriverWinsPerSeason(_x49) {
  return _getDriverWinsPerSeason.apply(this, arguments);
}

function _getDriverWinsPerSeason() {
  _getDriverWinsPerSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee42(driverId) {
    var years, response, _iterator2, _step2, year, winsperyear;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee42$(_context42) {
      while (1) {
        switch (_context42.prev = _context42.next) {
          case 0:
            _context42.next = 2;
            return fetchAllDriverYearsInF1(driverId);

          case 2:
            years = _context42.sent;
            response = {};
            _iterator2 = _createForOfIteratorHelper(years);
            _context42.prev = 5;

            _iterator2.s();

          case 7:
            if ((_step2 = _iterator2.n()).done) {
              _context42.next = 15;
              break;
            }

            year = _step2.value;
            _context42.next = 11;
            return getWinsPerSeason(driverId, year);

          case 11:
            winsperyear = _context42.sent;
            response[year] = winsperyear;

          case 13:
            _context42.next = 7;
            break;

          case 15:
            _context42.next = 20;
            break;

          case 17:
            _context42.prev = 17;
            _context42.t0 = _context42["catch"](5);

            _iterator2.e(_context42.t0);

          case 20:
            _context42.prev = 20;

            _iterator2.f();

            return _context42.finish(20);

          case 23:
            return _context42.abrupt("return", response);

          case 24:
          case "end":
            return _context42.stop();
        }
      }
    }, _callee42, null, [[5, 17, 20, 23]]);
  }));
  return _getDriverWinsPerSeason.apply(this, arguments);
}

function getAllConstructors() {
  return _getAllConstructors.apply(this, arguments);
}

function _getAllConstructors() {
  _getAllConstructors = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee43() {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            _context43.next = 2;
            return fetchAllConstructors();

          case 2:
            return _context43.abrupt("return", _context43.sent);

          case 3:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43);
  }));
  return _getAllConstructors.apply(this, arguments);
}

function getBasicConstructorInfo(_x50) {
  return _getBasicConstructorInfo.apply(this, arguments);
}

function _getBasicConstructorInfo() {
  _getBasicConstructorInfo = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee44(constructorId) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            _context44.next = 2;
            return fetchBasicConstructorInfo(constructorId);

          case 2:
            return _context44.abrupt("return", _context44.sent);

          case 3:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));
  return _getBasicConstructorInfo.apply(this, arguments);
}

function getTotalConstructorChampionships(_x51) {
  return _getTotalConstructorChampionships.apply(this, arguments);
}

function _getTotalConstructorChampionships() {
  _getTotalConstructorChampionships = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee45(constructorId) {
    var response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee45$(_context45) {
      while (1) {
        switch (_context45.prev = _context45.next) {
          case 0:
            _context45.next = 2;
            return fetchConstructorChampionships(constructorId);

          case 2:
            response = _context45.sent;
            return _context45.abrupt("return", response.total);

          case 4:
          case "end":
            return _context45.stop();
        }
      }
    }, _callee45);
  }));
  return _getTotalConstructorChampionships.apply(this, arguments);
}

function getConstructorChampionships(_x52) {
  return _getConstructorChampionships.apply(this, arguments);
}

function _getConstructorChampionships() {
  _getConstructorChampionships = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee46(constructorId) {
    var api, response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee46$(_context46) {
      while (1) {
        switch (_context46.prev = _context46.next) {
          case 0:
            _context46.next = 2;
            return fetchConstructorChampionships(constructorId);

          case 2:
            api = _context46.sent;
            response = [];
            api.StandingsTable.StandingsLists.forEach(function (year) {
              response.push(year.season);
            });
            return _context46.abrupt("return", response);

          case 6:
          case "end":
            return _context46.stop();
        }
      }
    }, _callee46);
  }));
  return _getConstructorChampionships.apply(this, arguments);
}

function getConstructorYearsInF1(_x53) {
  return _getConstructorYearsInF.apply(this, arguments);
}

function _getConstructorYearsInF() {
  _getConstructorYearsInF = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee47(constructorId) {
    var api_response;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee47$(_context47) {
      while (1) {
        switch (_context47.prev = _context47.next) {
          case 0:
            _context47.next = 2;
            return fetchConstructorYearsInF1(constructorId);

          case 2:
            api_response = _context47.sent;
            return _context47.abrupt("return", api_response.map(function (year) {
              return year.season;
            }));

          case 4:
          case "end":
            return _context47.stop();
        }
      }
    }, _callee47);
  }));
  return _getConstructorYearsInF.apply(this, arguments);
}

function getConstructorWinsPerSeason(_x54) {
  return _getConstructorWinsPerSeason.apply(this, arguments);
}

function _getConstructorWinsPerSeason() {
  _getConstructorWinsPerSeason = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee48(constructorId) {
    var response, years, results;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee48$(_context48) {
      while (1) {
        switch (_context48.prev = _context48.next) {
          case 0:
            response = {};
            _context48.next = 3;
            return fetchConstructorYearsInF1(constructorId);

          case 3:
            years = _context48.sent;
            years.forEach(function (year) {
              response[year.season] = 0;
            });
            _context48.next = 7;
            return fetchConstructorWinsAllTime(constructorId);

          case 7:
            results = _context48.sent;
            results.forEach(function (race) {
              response[race.season] += 1;
            });
            return _context48.abrupt("return", response);

          case 10:
          case "end":
            return _context48.stop();
        }
      }
    }, _callee48);
  }));
  return _getConstructorWinsPerSeason.apply(this, arguments);
}

function getAllDriversForConstructor(_x55) {
  return _getAllDriversForConstructor.apply(this, arguments);
}

function _getAllDriversForConstructor() {
  _getAllDriversForConstructor = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee49(constructorId) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee49$(_context49) {
      while (1) {
        switch (_context49.prev = _context49.next) {
          case 0:
            _context49.next = 2;
            return fetchAllDriversForConstructor(constructorId);

          case 2:
            return _context49.abrupt("return", _context49.sent);

          case 3:
          case "end":
            return _context49.stop();
        }
      }
    }, _callee49);
  }));
  return _getAllDriversForConstructor.apply(this, arguments);
}
})();

/******/ })()
;