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


/***/ }),

/***/ "./node_modules/uuid/index.js":
/*!************************************!*\
  !*** ./node_modules/uuid/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var v1 = __webpack_require__(/*! ./v1 */ "./node_modules/uuid/v1.js");
var v4 = __webpack_require__(/*! ./v4 */ "./node_modules/uuid/v4.js");

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/***/ ((module) => {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ "./node_modules/uuid/v1.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v1.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


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
  !*** ./resources/js/home.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);


function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

document.addEventListener("DOMContentLoaded", init);
var CURR_SZN_API_URL = "https://ergast.com/api/f1/2022.json";
var OPENROUTESERVICE_API_KEY = "5b3ce3597851110001cf624820bfaf1a6ffd485d81ed451c87ee1c13";
/*
I hardcoded the date because the formula 1 season ended on 12/12/2021 and the ordering tickets aspect of the site wouldn't work anymore
The code for non-hardcoded date would be:
const today = new Date();
const date = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())
*/

var today = new Date(2021, 9, 20);
var date = new Date(today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate());

var uuid = __webpack_require__(/*! uuid */ "./node_modules/uuid/index.js");

function init() {
  if (document.querySelector("main section").getAttribute("class") === "home") {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loadmap, function (error) {
        loadmap(null);
      });
    }

    insertRacesIntoPage();

    if (typeof orders !== 'undefined') {
      checkIfUserHasTicketsForUpcomingRace(); //show notification based on closest race
    }
  }

  if (document.querySelector("main section").getAttribute("class") === "order") {
    displayOrder(document.querySelector("main section").getAttribute("id"));
  }

  if (document.querySelector("main section").getAttribute("class") === "confirmation") {
    setTimeout(function () {
      showUpcomingRaceNotification(localStorage.getItem("currentorderraceid"), "Your order has been processed!");
    }, 2000);
  }

  if (document.querySelector("main section").getAttribute("class") === "profile") {
    document.querySelector("#notification").addEventListener("click", enableNotifications);
    loadProfile();
  }
} //load all the cards containing the race calendar on homepage


function insertRacesIntoPage() {
  return _insertRacesIntoPage.apply(this, arguments);
} //get a racedate in the format from api and check if it has already occured


function _insertRacesIntoPage() {
  _insertRacesIntoPage = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
    var races;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetchRaces();

          case 2:
            races = _context.sent;
            races.forEach(function (race) {
              //check if race has already occured, if so add a view results, if not add purchase tickets button
              if (dateChecker(race.date)) {
                addRaceHTMLtoPage(race, "View results", "/results/".concat(race.season, "/").concat(race.round));
              } else {
                addRaceHTMLtoPage(race, "Purchase tickets", "/tickets/".concat(race.round));
              }
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _insertRacesIntoPage.apply(this, arguments);
}

function dateChecker(receivedracedate) {
  var racedate = new Date(receivedracedate);
  return date > racedate;
} //adds the html of a race into the homepage


function addRaceHTMLtoPage(race, value, link) {
  document.querySelector(".gp-list").innerHTML += "<div class=\"gp-div\">\n    <div class=\"card\">\n      <h2>".concat(race.raceName, "</h2>\n      <p>Round: ").concat(race.round, "</p>\n      <p>").concat(race.date, "</p>\n      <a href=\"").concat(link, "\">").concat(value, " ></a>\n    </div>\n  </div>");
  document.querySelector(".gp-list .gp-div:last-of-type").style.backgroundImage = "url(\"../images/".concat(Math.floor(Math.random() * (7 - 1) + 1), ".png\")");
} //load map on homepage


function loadmap(_x) {
  return _loadmap.apply(this, arguments);
}

function _loadmap() {
  _loadmap = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(coords) {
    var createMarkerFeature, races, markers, markerVectors, markerLayer, container, content, closer, overlay, map, race, bounds, dblclickinteraction;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            createMarkerFeature = function _createMarkerFeature(coordinate) {
              return new ol.Feature({
                type: 'marker',
                geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinate))
              });
            };

            _context2.next = 3;
            return fetchRaces();

          case 3:
            races = _context2.sent;
            markers = races.map(function (race) {
              return new ol.Feature({
                type: 'marker',
                data: race,
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(race.Circuit.Location["long"]), parseFloat(race.Circuit.Location.lat)]))
              });
            });

            if (coords != null) {
              markers.push(createMarkerFeature([coords.coords.longitude, coords.coords.latitude]));
            } //vector for racemarkers


            markerVectors = new ol.source.Vector({
              features: markers
            }); //markerlayer with the styling of the markers and the source vector layer

            markerLayer = new ol.layer.Vector({
              source: markerVectors,
              style: new ol.style.Style({
                image: new ol.style.Icon({
                  src: "./images/marker.png",
                  anchor: [0.5, 1],
                  scale: [1.2, 1.2]
                })
              })
            }); //pop-up variables

            container = document.getElementById('popup');
            content = document.getElementById('popup-content');
            closer = document.getElementById('popup-closer');
            overlay = new ol.Overlay({
              element: container,
              autoPan: true,
              autoPanAnimation: {
                duration: 250
              }
            });

            closer.onclick = function () {
              overlay.setPosition(undefined);
              closer.blur();
              return false;
            };

            //check if the user has enabled location, if not, still display the map with race markers
            if (coords != null) {
              map = new ol.Map({
                controls: [new ol.control.FullScreen(), new ol.control.Zoom()],
                target: 'gp-map',
                layers: [new ol.layer.Tile({
                  source: new ol.source.OSM()
                }), markerLayer],
                overlays: [overlay],
                view: new ol.View({
                  center: ol.proj.fromLonLat([coords.coords.longitude, coords.coords.latitude]),
                  zoom: 5
                })
              });
            } else {
              race = races[0];
              map = new ol.Map({
                controls: [new ol.control.FullScreen(), new ol.control.Zoom()],
                target: 'gp-map',
                layers: [new ol.layer.Tile({
                  source: new ol.source.OSM()
                }), markerLayer],
                overlays: [overlay],
                view: new ol.View({
                  center: ol.proj.fromLonLat([parseFloat(race.Circuit.Location["long"]), parseFloat(race.Circuit.Location.lat)]),
                  zoom: 3
                })
              });
            }

            if (coords != null) {
              getClosestRaceRoute(coords.coords.longitude, coords.coords.latitude).then(function (response) {
                var location = response.location,
                    route = response.route;
                var routeLayer = drawRoute(route);
                map.addLayer(routeLayer); //check the date to show purschase tickets or results

                if (dateChecker(location.date)) {
                  content.innerHTML = "<b>The closest race to you is: ".concat(location.raceName, "</b><br /><a href=\"/results/").concat(location.season, "/").concat(location.round, "\">View Results ></a>");
                } else {
                  content.innerHTML = "<b>The closest race to you is: ".concat(location.raceName, "</b><br /><a href=\"/tickets/").concat(location.round, "\">Purchase tickets: ></a>");
                } //set the postition of the map view to the closest race of the user


                overlay.setPosition(ol.proj.fromLonLat([parseFloat(location.Circuit.Location["long"]), parseFloat(location.Circuit.Location.lat)]));
              });
            }

            bounds = markerVectors.getExtent(); //eventlistener to detect a click on the map, that then filters clicks with the markerlayer and displays the popup if the click was on a marker

            map.on('singleclick', function (evt) {
              var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
              }, {
                layerFilter: function layerFilter(layer) {
                  return layer === markerLayer;
                }
              });

              if (feature && feature.A.type === "marker") {
                var coordinate = evt.coordinate;
                var _race = feature.A.data;

                if (dateChecker(_race.date)) {
                  content.innerHTML = "<p>".concat(_race.raceName, ":</p><a href=\"/results/").concat(_race.season, "/").concat(_race.round, "\">View Results ></a>");
                } else {
                  content.innerHTML = "<p>".concat(_race.raceName, ":</p><a href=\"/tickets/").concat(_race.round, "\">Purchase tickets: ></a>");
                }

                overlay.setPosition(coordinate);
              }
            }); //remove the doubleclick so it can be used for fullscreen

            dblclickinteraction = null;
            map.getInteractions().getArray().forEach(function (interaction) {
              if (interaction instanceof ol.interaction.DoubleClickZoom) {
                dblclickinteraction = interaction;
              }
            });
            map.removeInteraction(dblclickinteraction);
            document.addEventListener("dblclick", toggleFullScreen);
            document.addEventListener("dbltap", toggleFullScreen);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _loadmap.apply(this, arguments);
}

function toggleFullScreen() {
  var map = document.querySelector("#gp-map");

  if (!document.fullscreenElement) {
    map.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
} //draw the route on a map


function drawRoute(route) {
  var polyline = route.geometry.coordinates.map(function (el) {
    return ol.proj.fromLonLat(el);
  });
  var routeLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [new ol.Feature({
        type: 'route',
        geometry: new ol.geom.LineString(polyline)
      })]
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 6,
        color: [255, 87, 34, 0.8]
      })
    })
  });
  return routeLayer;
} //display the data of the race you want to order a ticket for


function displayOrder(_x2) {
  return _displayOrder.apply(this, arguments);
} //fetch all races, loop over every ticket in profile and filter the races to display specific race data per ticket


function _displayOrder() {
  _displayOrder = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3(raceid) {
    var race;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fetchSpecificRace(raceid);

          case 2:
            race = _context3.sent;
            localStorage.setItem("currentorderraceid", raceid);
            document.querySelector("#racedata").innerHTML += "<h2>".concat(race.raceName, "</h2>\n      <h3>").concat(race.Circuit.circuitName, "</h3>\n      <p>").concat(race.date, "</p>\n      <p>").concat(race.Circuit.Location.country, ", ").concat(race.Circuit.Location.locality, "</p>\n      <p>").concat(race.time, "</p>\n      <img src=\"../images/order").concat(Math.floor(Math.random() * (5 - 1) + 1), ".png\" alt=\"image of cars racing against eachother\"></img>");

            if (dateChecker(race.date)) {
              document.querySelector("#racedata").innerHTML += "<p class='warning'>This race has already occured.</p>";
            } else {
              document.getElementById("submit").removeAttribute("disabled");
            }

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _displayOrder.apply(this, arguments);
}

function loadProfile() {
  return _loadProfile.apply(this, arguments);
}

function _loadProfile() {
  _loadProfile = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4() {
    var races;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fetchRaces();

          case 2:
            races = _context4.sent;
            document.querySelectorAll(".tickets section div").forEach(function (e) {
              var roundnr = e.getAttribute("raceid");
              var race = races.filter(function (race) {
                return race.round === roundnr;
              })[0]; //check if the ticket is an old one or not, if so remove it.

              if (dateChecker(race.date)) {
                e.innerHTML = '';
                e.parentNode.removeChild(e);
              } else {
                e.innerHTML = "<h1>".concat(race.raceName, ": </h1> <h2>").concat(race.date, "</h2>") + e.innerHTML + "<p>code: ".concat(uuid.v4(), "</p>");
              }
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _loadProfile.apply(this, arguments);
}

function enableNotifications(e) {
  e.preventDefault();
  Notification.requestPermission();
}

function checkIfUserHasTicketsForUpcomingRace() {
  return _checkIfUserHasTicketsForUpcomingRace.apply(this, arguments);
}

function _checkIfUserHasTicketsForUpcomingRace() {
  _checkIfUserHasTicketsForUpcomingRace = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5() {
    var orderswithgpid, racedates, _iterator, _step, gpid, i, racedatemin7;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            orderswithgpid = orders.map(function (order) {
              return order.grand_prix_id;
            });
            racedates = [];
            _iterator = _createForOfIteratorHelper(orderswithgpid);
            _context5.prev = 3;

            _iterator.s();

          case 5:
            if ((_step = _iterator.n()).done) {
              _context5.next = 14;
              break;
            }

            gpid = _step.value;
            _context5.t0 = racedates;
            _context5.next = 10;
            return fetchSpecificRace(gpid);

          case 10:
            _context5.t1 = _context5.sent;

            _context5.t0.push.call(_context5.t0, _context5.t1);

          case 12:
            _context5.next = 5;
            break;

          case 14:
            _context5.next = 19;
            break;

          case 16:
            _context5.prev = 16;
            _context5.t2 = _context5["catch"](3);

            _iterator.e(_context5.t2);

          case 19:
            _context5.prev = 19;

            _iterator.f();

            return _context5.finish(19);

          case 22:
            racedates = racedates.map(function (race) {
              return race.date;
            });

            for (i = 0; i < racedates.length; i++) {
              racedatemin7 = new Date(racedates[i]);
              racedatemin7.setDate(racedatemin7.getDate() - 7);

              if (racedatemin7 < date && date < new Date(racedates[i])) {
                showUpcomingRaceNotification(orderswithgpid[i], "You have a ticket for an upcoming race:");
              }
            }

          case 24:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 16, 19, 22]]);
  }));
  return _checkIfUserHasTicketsForUpcomingRace.apply(this, arguments);
}

function showUpcomingRaceNotification(_x3, _x4) {
  return _showUpcomingRaceNotification.apply(this, arguments);
} //fetch races from api


function _showUpcomingRaceNotification() {
  _showUpcomingRaceNotification = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6(gpid, title) {
    var raceinformation, notification;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return fetchSpecificRace(gpid);

          case 2:
            raceinformation = _context6.sent;
            notification = new Notification(title, {
              body: "".concat(raceinformation.raceName, " - Click to view")
            });
            notification.addEventListener("click", function () {
              location.replace("profile");
            });

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _showUpcomingRaceNotification.apply(this, arguments);
}

function fetchRaces() {
  return _fetchRaces.apply(this, arguments);
} //fetch specific race from api


function _fetchRaces() {
  _fetchRaces = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7() {
    var api_resp, response, fallback_api_resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return fetch(CURR_SZN_API_URL);

          case 3:
            api_resp = _context7.sent;
            _context7.next = 6;
            return api_resp.json();

          case 6:
            response = _context7.sent;

            if (!(response.MRData.total === "0")) {
              _context7.next = 14;
              break;
            }

            _context7.next = 10;
            return fetch("https://ergast.com/api/f1/2021.json");

          case 10:
            fallback_api_resp = _context7.sent;
            _context7.next = 13;
            return fallback_api_resp.json();

          case 13:
            response = _context7.sent;

          case 14:
            return _context7.abrupt("return", response.MRData.RaceTable.Races);

          case 17:
            _context7.prev = 17;
            _context7.t0 = _context7["catch"](0);
            console.log(_context7.t0);

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 17]]);
  }));
  return _fetchRaces.apply(this, arguments);
}

function fetchSpecificRace(_x5) {
  return _fetchSpecificRace.apply(this, arguments);
} //fetch the closest race to you 


function _fetchSpecificRace() {
  _fetchSpecificRace = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee8(roundnr) {
    var api_resp, response, fallback_api_resp;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return fetch("https://ergast.com/api/f1/current/".concat(roundnr, ".json"));

          case 3:
            api_resp = _context8.sent;
            _context8.next = 6;
            return api_resp.json();

          case 6:
            response = _context8.sent;

            if (!(response.MRData.total === "0")) {
              _context8.next = 14;
              break;
            }

            _context8.next = 10;
            return fetch("https://ergast.com/api/f1/2021/".concat(roundnr, ".json"));

          case 10:
            fallback_api_resp = _context8.sent;
            _context8.next = 13;
            return fallback_api_resp.json();

          case 13:
            response = _context8.sent;

          case 14:
            return _context8.abrupt("return", response.MRData.RaceTable.Races[0]);

          case 17:
            _context8.prev = 17;
            _context8.t0 = _context8["catch"](0);
            console.log(_context8.t0);

          case 20:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 17]]);
  }));
  return _fetchSpecificRace.apply(this, arguments);
}

function getClosestRaceRoute(_x6, _x7) {
  return _getClosestRaceRoute.apply(this, arguments);
}

function _getClosestRaceRoute() {
  _getClosestRaceRoute = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee9(startlong, startlat) {
    var distance, sort_helper, races, closest, response, result;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            sort_helper = function _sort_helper(element) {
              var value = distance(parseFloat(element.Circuit.Location["long"]), parseFloat(element.Circuit.Location.lat), startlong, startlat);
              return value;
            };

            distance = function _distance(long1, lat1, long2, lat2) {
              var r = 6371e3;
              var sigma1 = lat1 * Math.PI / 180;
              var sigma2 = lat2 * Math.PI / 180;
              var sigmadif = (lat2 - lat1) * Math.PI / 180;
              var lambdadif = (long2 - long1) * Math.PI / 180;
              var a = Math.sin(sigmadif / 2) * Math.sin(sigmadif / 2) + Math.cos(sigma1) * Math.cos(sigma2) * Math.sin(lambdadif / 2) * Math.sin(lambdadif / 2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return r * c;
            };

            _context9.next = 4;
            return fetchRaces();

          case 4:
            races = _context9.sent;
            closest = Array.from(races).sort(function (a, b) {
              return sort_helper(a) - sort_helper(b);
            })[0];
            _context9.next = 8;
            return fetch("https://api.openrouteservice.org/v2/directions/driving-car?api_key=".concat(OPENROUTESERVICE_API_KEY, "&start=").concat(startlong, ",").concat(startlat, "&end=").concat(closest.Circuit.Location["long"], ",").concat(closest.Circuit.Location.lat));

          case 8:
            response = _context9.sent;
            _context9.next = 11;
            return response.json();

          case 11:
            result = _context9.sent;
            return _context9.abrupt("return", {
              location: closest,
              route: result.features[0]
            });

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _getClosestRaceRoute.apply(this, arguments);
}
})();

/******/ })()
;