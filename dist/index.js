"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var rxjs = require("rxjs");
var lodash = require("lodash");
var slippiJs = require("@slippi/slippi-js");
var child_process = require("child_process");
var os = _interopDefault(require("os"));
var stream = require("stream");
var fs = _interopDefault(require("fs"));
var chokidar = _interopDefault(require("chokidar"));
var path = _interopDefault(require("path"));
var tailstream = _interopDefault(require("tailstream"));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function (d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
  return typeof x === "function";
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var _enable_super_gross_mode_that_will_cause_bad_things = false;
var config = {
  Promise: undefined,
  set useDeprecatedSynchronousErrorHandling(value) {
    if (value) {
      var error = /*@__PURE__*/ new Error();
      /*@__PURE__*/ console.warn(
        "DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" + error.stack,
      );
    }
    _enable_super_gross_mode_that_will_cause_bad_things = value;
  },
  get useDeprecatedSynchronousErrorHandling() {
    return _enable_super_gross_mode_that_will_cause_bad_things;
  },
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
  setTimeout(function () {
    throw err;
  }, 0);
}

/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
var empty = {
  closed: true,
  next: function (value) {},
  error: function (err) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      throw err;
    } else {
      hostReportError(err);
    }
  },
  complete: function () {},
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = /*@__PURE__*/ (function () {
  return (
    Array.isArray ||
    function (x) {
      return x && typeof x.length === "number";
    }
  );
})();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
  return x !== null && typeof x === "object";
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
  function UnsubscriptionErrorImpl(errors) {
    Error.call(this);
    this.message = errors
      ? errors.length +
        " errors occurred during unsubscription:\n" +
        errors
          .map(function (err, i) {
            return i + 1 + ") " + err.toString();
          })
          .join("\n  ")
      : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
    return this;
  }
  UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  return UnsubscriptionErrorImpl;
})();
var UnsubscriptionError = UnsubscriptionErrorImpl;

/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
var Subscription = /*@__PURE__*/ (function () {
  function Subscription(unsubscribe) {
    this.closed = false;
    this._parentOrParents = null;
    this._subscriptions = null;
    if (unsubscribe) {
      this._unsubscribe = unsubscribe;
    }
  }
  Subscription.prototype.unsubscribe = function () {
    var errors;
    if (this.closed) {
      return;
    }
    var _a = this,
      _parentOrParents = _a._parentOrParents,
      _unsubscribe = _a._unsubscribe,
      _subscriptions = _a._subscriptions;
    this.closed = true;
    this._parentOrParents = null;
    this._subscriptions = null;
    if (_parentOrParents instanceof Subscription) {
      _parentOrParents.remove(this);
    } else if (_parentOrParents !== null) {
      for (var index = 0; index < _parentOrParents.length; ++index) {
        var parent_1 = _parentOrParents[index];
        parent_1.remove(this);
      }
    }
    if (isFunction(_unsubscribe)) {
      try {
        _unsubscribe.call(this);
      } catch (e) {
        errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
      }
    }
    if (isArray(_subscriptions)) {
      var index = -1;
      var len = _subscriptions.length;
      while (++index < len) {
        var sub = _subscriptions[index];
        if (isObject(sub)) {
          try {
            sub.unsubscribe();
          } catch (e) {
            errors = errors || [];
            if (e instanceof UnsubscriptionError) {
              errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
            } else {
              errors.push(e);
            }
          }
        }
      }
    }
    if (errors) {
      throw new UnsubscriptionError(errors);
    }
  };
  Subscription.prototype.add = function (teardown) {
    var subscription = teardown;
    if (!teardown) {
      return Subscription.EMPTY;
    }
    switch (typeof teardown) {
      case "function":
        subscription = new Subscription(teardown);
      case "object":
        if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== "function") {
          return subscription;
        } else if (this.closed) {
          subscription.unsubscribe();
          return subscription;
        } else if (!(subscription instanceof Subscription)) {
          var tmp = subscription;
          subscription = new Subscription();
          subscription._subscriptions = [tmp];
        }
        break;
      default: {
        throw new Error("unrecognized teardown " + teardown + " added to Subscription.");
      }
    }
    var _parentOrParents = subscription._parentOrParents;
    if (_parentOrParents === null) {
      subscription._parentOrParents = this;
    } else if (_parentOrParents instanceof Subscription) {
      if (_parentOrParents === this) {
        return subscription;
      }
      subscription._parentOrParents = [_parentOrParents, this];
    } else if (_parentOrParents.indexOf(this) === -1) {
      _parentOrParents.push(this);
    } else {
      return subscription;
    }
    var subscriptions = this._subscriptions;
    if (subscriptions === null) {
      this._subscriptions = [subscription];
    } else {
      subscriptions.push(subscription);
    }
    return subscription;
  };
  Subscription.prototype.remove = function (subscription) {
    var subscriptions = this._subscriptions;
    if (subscriptions) {
      var subscriptionIndex = subscriptions.indexOf(subscription);
      if (subscriptionIndex !== -1) {
        subscriptions.splice(subscriptionIndex, 1);
      }
    }
  };
  Subscription.EMPTY = (function (empty) {
    empty.closed = true;
    return empty;
  })(new Subscription());
  return Subscription;
})();
function flattenUnsubscriptionErrors(errors) {
  return errors.reduce(function (errs, err) {
    return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
  }, []);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = /*@__PURE__*/ (function () {
  return typeof Symbol === "function"
    ? /*@__PURE__*/ Symbol("rxSubscriber")
    : "@@rxSubscriber_" + /*@__PURE__*/ Math.random();
})();

/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
var Subscriber = /*@__PURE__*/ (function (_super) {
  __extends(Subscriber, _super);
  function Subscriber(destinationOrNext, error, complete) {
    var _this = _super.call(this) || this;
    _this.syncErrorValue = null;
    _this.syncErrorThrown = false;
    _this.syncErrorThrowable = false;
    _this.isStopped = false;
    switch (arguments.length) {
      case 0:
        _this.destination = empty;
        break;
      case 1:
        if (!destinationOrNext) {
          _this.destination = empty;
          break;
        }
        if (typeof destinationOrNext === "object") {
          if (destinationOrNext instanceof Subscriber) {
            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
            _this.destination = destinationOrNext;
            destinationOrNext.add(_this);
          } else {
            _this.syncErrorThrowable = true;
            _this.destination = new SafeSubscriber(_this, destinationOrNext);
          }
          break;
        }
      default:
        _this.syncErrorThrowable = true;
        _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
        break;
    }
    return _this;
  }
  Subscriber.prototype[rxSubscriber] = function () {
    return this;
  };
  Subscriber.create = function (next, error, complete) {
    var subscriber = new Subscriber(next, error, complete);
    subscriber.syncErrorThrowable = false;
    return subscriber;
  };
  Subscriber.prototype.next = function (value) {
    if (!this.isStopped) {
      this._next(value);
    }
  };
  Subscriber.prototype.error = function (err) {
    if (!this.isStopped) {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber.prototype.complete = function () {
    if (!this.isStopped) {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber.prototype.unsubscribe = function () {
    if (this.closed) {
      return;
    }
    this.isStopped = true;
    _super.prototype.unsubscribe.call(this);
  };
  Subscriber.prototype._next = function (value) {
    this.destination.next(value);
  };
  Subscriber.prototype._error = function (err) {
    this.destination.error(err);
    this.unsubscribe();
  };
  Subscriber.prototype._complete = function () {
    this.destination.complete();
    this.unsubscribe();
  };
  Subscriber.prototype._unsubscribeAndRecycle = function () {
    var _parentOrParents = this._parentOrParents;
    this._parentOrParents = null;
    this.unsubscribe();
    this.closed = false;
    this.isStopped = false;
    this._parentOrParents = _parentOrParents;
    return this;
  };
  return Subscriber;
})(Subscription);
var SafeSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(SafeSubscriber, _super);
  function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    _this._parentSubscriber = _parentSubscriber;
    var next;
    var context = _this;
    if (isFunction(observerOrNext)) {
      next = observerOrNext;
    } else if (observerOrNext) {
      next = observerOrNext.next;
      error = observerOrNext.error;
      complete = observerOrNext.complete;
      if (observerOrNext !== empty) {
        context = Object.create(observerOrNext);
        if (isFunction(context.unsubscribe)) {
          _this.add(context.unsubscribe.bind(context));
        }
        context.unsubscribe = _this.unsubscribe.bind(_this);
      }
    }
    _this._context = context;
    _this._next = next;
    _this._error = error;
    _this._complete = complete;
    return _this;
  }
  SafeSubscriber.prototype.next = function (value) {
    if (!this.isStopped && this._next) {
      var _parentSubscriber = this._parentSubscriber;
      if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
        this.__tryOrUnsub(this._next, value);
      } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
        this.unsubscribe();
      }
    }
  };
  SafeSubscriber.prototype.error = function (err) {
    if (!this.isStopped) {
      var _parentSubscriber = this._parentSubscriber;
      var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
      if (this._error) {
        if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
          this.__tryOrUnsub(this._error, err);
          this.unsubscribe();
        } else {
          this.__tryOrSetError(_parentSubscriber, this._error, err);
          this.unsubscribe();
        }
      } else if (!_parentSubscriber.syncErrorThrowable) {
        this.unsubscribe();
        if (useDeprecatedSynchronousErrorHandling) {
          throw err;
        }
        hostReportError(err);
      } else {
        if (useDeprecatedSynchronousErrorHandling) {
          _parentSubscriber.syncErrorValue = err;
          _parentSubscriber.syncErrorThrown = true;
        } else {
          hostReportError(err);
        }
        this.unsubscribe();
      }
    }
  };
  SafeSubscriber.prototype.complete = function () {
    var _this = this;
    if (!this.isStopped) {
      var _parentSubscriber = this._parentSubscriber;
      if (this._complete) {
        var wrappedComplete = function () {
          return _this._complete.call(_this._context);
        };
        if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
          this.__tryOrUnsub(wrappedComplete);
          this.unsubscribe();
        } else {
          this.__tryOrSetError(_parentSubscriber, wrappedComplete);
          this.unsubscribe();
        }
      } else {
        this.unsubscribe();
      }
    }
  };
  SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
    try {
      fn.call(this._context, value);
    } catch (err) {
      this.unsubscribe();
      if (config.useDeprecatedSynchronousErrorHandling) {
        throw err;
      } else {
        hostReportError(err);
      }
    }
  };
  SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
    if (!config.useDeprecatedSynchronousErrorHandling) {
      throw new Error("bad call");
    }
    try {
      fn.call(this._context, value);
    } catch (err) {
      if (config.useDeprecatedSynchronousErrorHandling) {
        parent.syncErrorValue = err;
        parent.syncErrorThrown = true;
        return true;
      } else {
        hostReportError(err);
        return true;
      }
    }
    return false;
  };
  SafeSubscriber.prototype._unsubscribe = function () {
    var _parentSubscriber = this._parentSubscriber;
    this._context = null;
    this._parentSubscriber = null;
    _parentSubscriber.unsubscribe();
  };
  return SafeSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
var OuterSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(OuterSubscriber, _super);
  function OuterSubscriber() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.destination.next(innerValue);
  };
  OuterSubscriber.prototype.notifyError = function (error, innerSub) {
    this.destination.error(error);
  };
  OuterSubscriber.prototype.notifyComplete = function (innerSub) {
    this.destination.complete();
  };
  return OuterSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
var InnerSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(InnerSubscriber, _super);
  function InnerSubscriber(parent, outerValue, outerIndex) {
    var _this = _super.call(this) || this;
    _this.parent = parent;
    _this.outerValue = outerValue;
    _this.outerIndex = outerIndex;
    _this.index = 0;
    return _this;
  }
  InnerSubscriber.prototype._next = function (value) {
    this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
  };
  InnerSubscriber.prototype._error = function (error) {
    this.parent.notifyError(error, this);
    this.unsubscribe();
  };
  InnerSubscriber.prototype._complete = function () {
    this.parent.notifyComplete(this);
    this.unsubscribe();
  };
  return InnerSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var subscribeToArray = function (array) {
  return function (subscriber) {
    for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  };
};

/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
var subscribeToPromise = function (promise) {
  return function (subscriber) {
    promise
      .then(
        function (value) {
          if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
          }
        },
        function (err) {
          return subscriber.error(err);
        },
      )
      .then(null, hostReportError);
    return subscriber;
  };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = /*@__PURE__*/ getSymbolIterator();

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
var subscribeToIterable = function (iterable) {
  return function (subscriber) {
    var iterator$1 = iterable[iterator]();
    do {
      var item = iterator$1.next();
      if (item.done) {
        subscriber.complete();
        break;
      }
      subscriber.next(item.value);
      if (subscriber.closed) {
        break;
      }
    } while (true);
    if (typeof iterator$1.return === "function") {
      subscriber.add(function () {
        if (iterator$1.return) {
          iterator$1.return();
        }
      });
    }
    return subscriber;
  };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = /*@__PURE__*/ (function () {
  return (typeof Symbol === "function" && Symbol.observable) || "@@observable";
})();

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
var subscribeToObservable = function (obj) {
  return function (subscriber) {
    var obs = obj[observable]();
    if (typeof obs.subscribe !== "function") {
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    } else {
      return obs.subscribe(subscriber);
    }
  };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArrayLike = function (x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isPromise(value) {
  return !!value && typeof value.subscribe !== "function" && typeof value.then === "function";
}

/** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
var subscribeTo = function (result) {
  if (!!result && typeof result[observable] === "function") {
    return subscribeToObservable(result);
  } else if (isArrayLike(result)) {
    return subscribeToArray(result);
  } else if (isPromise(result)) {
    return subscribeToPromise(result);
  } else if (!!result && typeof result[iterator] === "function") {
    return subscribeToIterable(result);
  } else {
    var value = isObject(result) ? "an invalid object" : "'" + result + "'";
    var msg =
      "You provided " +
      value +
      " where a stream was expected." +
      " You can provide an Observable, Promise, Array, or Iterable.";
    throw new TypeError(msg);
  }
};

/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
function canReportError(observer) {
  while (observer) {
    var _a = observer,
      closed_1 = _a.closed,
      destination = _a.destination,
      isStopped = _a.isStopped;
    if (closed_1 || isStopped) {
      return false;
    } else if (destination && destination instanceof Subscriber) {
      observer = destination;
    } else {
      observer = null;
    }
  }
  return true;
}

/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
function toSubscriber(nextOrObserver, error, complete) {
  if (nextOrObserver) {
    if (nextOrObserver instanceof Subscriber) {
      return nextOrObserver;
    }
    if (nextOrObserver[rxSubscriber]) {
      return nextOrObserver[rxSubscriber]();
    }
  }
  if (!nextOrObserver && !error && !complete) {
    return new Subscriber(empty);
  }
  return new Subscriber(nextOrObserver, error, complete);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function noop() {}

/** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
function pipeFromArray(fns) {
  if (!fns) {
    return noop;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function (prev, fn) {
      return fn(prev);
    }, input);
  };
}

/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
var Observable = /*@__PURE__*/ (function () {
  function Observable(subscribe) {
    this._isScalar = false;
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable.prototype.lift = function (operator) {
    var observable = new Observable();
    observable.source = this;
    observable.operator = operator;
    return observable;
  };
  Observable.prototype.subscribe = function (observerOrNext, error, complete) {
    var operator = this.operator;
    var sink = toSubscriber(observerOrNext, error, complete);
    if (operator) {
      sink.add(operator.call(sink, this.source));
    } else {
      sink.add(
        this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable)
          ? this._subscribe(sink)
          : this._trySubscribe(sink),
      );
    }
    if (config.useDeprecatedSynchronousErrorHandling) {
      if (sink.syncErrorThrowable) {
        sink.syncErrorThrowable = false;
        if (sink.syncErrorThrown) {
          throw sink.syncErrorValue;
        }
      }
    }
    return sink;
  };
  Observable.prototype._trySubscribe = function (sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      if (config.useDeprecatedSynchronousErrorHandling) {
        sink.syncErrorThrown = true;
        sink.syncErrorValue = err;
      }
      if (canReportError(sink)) {
        sink.error(err);
      } else {
        console.warn(err);
      }
    }
  };
  Observable.prototype.forEach = function (next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function (resolve, reject) {
      var subscription;
      subscription = _this.subscribe(
        function (value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            if (subscription) {
              subscription.unsubscribe();
            }
          }
        },
        reject,
        resolve,
      );
    });
  };
  Observable.prototype._subscribe = function (subscriber) {
    var source = this.source;
    return source && source.subscribe(subscriber);
  };
  Observable.prototype[observable] = function () {
    return this;
  };
  Observable.prototype.pipe = function () {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    if (operations.length === 0) {
      return this;
    }
    return pipeFromArray(operations)(this);
  };
  Observable.prototype.toPromise = function (promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function (resolve, reject) {
      var value;
      _this.subscribe(
        function (x) {
          return (value = x);
        },
        function (err) {
          return reject(err);
        },
        function () {
          return resolve(value);
        },
      );
    });
  };
  Observable.create = function (subscribe) {
    return new Observable(subscribe);
  };
  return Observable;
})();
function getPromiseCtor(promiseCtor) {
  if (!promiseCtor) {
    promiseCtor = Promise;
  }
  if (!promiseCtor) {
    throw new Error("no Promise impl found");
  }
  return promiseCtor;
}

/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber) {
  if (innerSubscriber === void 0) {
    innerSubscriber = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
  }
  if (innerSubscriber.closed) {
    return undefined;
  }
  if (result instanceof Observable) {
    return result.subscribe(innerSubscriber);
  }
  return subscribeTo(result)(innerSubscriber);
}

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function scheduleArray(input, scheduler) {
  return new Observable(function (subscriber) {
    var sub = new Subscription();
    var i = 0;
    sub.add(
      scheduler.schedule(function () {
        if (i === input.length) {
          subscriber.complete();
          return;
        }
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          sub.add(this.schedule());
        }
      }),
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */
function scheduleObservable(input, scheduler) {
  return new Observable(function (subscriber) {
    var sub = new Subscription();
    sub.add(
      scheduler.schedule(function () {
        var observable$1 = input[observable]();
        sub.add(
          observable$1.subscribe({
            next: function (value) {
              sub.add(
                scheduler.schedule(function () {
                  return subscriber.next(value);
                }),
              );
            },
            error: function (err) {
              sub.add(
                scheduler.schedule(function () {
                  return subscriber.error(err);
                }),
              );
            },
            complete: function () {
              sub.add(
                scheduler.schedule(function () {
                  return subscriber.complete();
                }),
              );
            },
          }),
        );
      }),
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function schedulePromise(input, scheduler) {
  return new Observable(function (subscriber) {
    var sub = new Subscription();
    sub.add(
      scheduler.schedule(function () {
        return input.then(
          function (value) {
            sub.add(
              scheduler.schedule(function () {
                subscriber.next(value);
                sub.add(
                  scheduler.schedule(function () {
                    return subscriber.complete();
                  }),
                );
              }),
            );
          },
          function (err) {
            sub.add(
              scheduler.schedule(function () {
                return subscriber.error(err);
              }),
            );
          },
        );
      }),
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */
function scheduleIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function (subscriber) {
    var sub = new Subscription();
    var iterator$1;
    sub.add(function () {
      if (iterator$1 && typeof iterator$1.return === "function") {
        iterator$1.return();
      }
    });
    sub.add(
      scheduler.schedule(function () {
        iterator$1 = input[iterator]();
        sub.add(
          scheduler.schedule(function () {
            if (subscriber.closed) {
              return;
            }
            var value;
            var done;
            try {
              var result = iterator$1.next();
              value = result.value;
              done = result.done;
            } catch (err) {
              subscriber.error(err);
              return;
            }
            if (done) {
              subscriber.complete();
            } else {
              subscriber.next(value);
              this.schedule();
            }
          }),
        );
      }),
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
function isInteropObservable(input) {
  return input && typeof input[observable] === "function";
}

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
function isIterable(input) {
  return input && typeof input[iterator] === "function";
}

/** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    } else if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    } else if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    } else if (isIterable(input) || typeof input === "string") {
      return scheduleIterable(input, scheduler);
    }
  }
  throw new TypeError(((input !== null && typeof input) || input) + " is not observable");
}

/** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */
function from(input, scheduler) {
  if (!scheduler) {
    if (input instanceof Observable) {
      return input;
    }
    return new Observable(subscribeTo(input));
  } else {
    return scheduled(input, scheduler);
  }
}

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function map(project, thisArg) {
  return function mapOperation(source) {
    if (typeof project !== "function") {
      throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");
    }
    return source.lift(new MapOperator(project, thisArg));
  };
}
var MapOperator = /*@__PURE__*/ (function () {
  function MapOperator(project, thisArg) {
    this.project = project;
    this.thisArg = thisArg;
  }
  MapOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
  };
  return MapOperator;
})();
var MapSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(MapSubscriber, _super);
  function MapSubscriber(destination, project, thisArg) {
    var _this = _super.call(this, destination) || this;
    _this.project = project;
    _this.count = 0;
    _this.thisArg = thisArg || _this;
    return _this;
  }
  MapSubscriber.prototype._next = function (value) {
    var result;
    try {
      result = this.project.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(result);
  };
  return MapSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function distinctUntilChanged(compare, keySelector) {
  return function (source) {
    return source.lift(new DistinctUntilChangedOperator(compare, keySelector));
  };
}
var DistinctUntilChangedOperator = /*@__PURE__*/ (function () {
  function DistinctUntilChangedOperator(compare, keySelector) {
    this.compare = compare;
    this.keySelector = keySelector;
  }
  DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
  };
  return DistinctUntilChangedOperator;
})();
var DistinctUntilChangedSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(DistinctUntilChangedSubscriber, _super);
  function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
    var _this = _super.call(this, destination) || this;
    _this.keySelector = keySelector;
    _this.hasKey = false;
    if (typeof compare === "function") {
      _this.compare = compare;
    }
    return _this;
  }
  DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
    return x === y;
  };
  DistinctUntilChangedSubscriber.prototype._next = function (value) {
    var key;
    try {
      var keySelector = this.keySelector;
      key = keySelector ? keySelector(value) : value;
    } catch (err) {
      return this.destination.error(err);
    }
    var result = false;
    if (this.hasKey) {
      try {
        var compare = this.compare;
        result = compare(this.key, key);
      } catch (err) {
        return this.destination.error(err);
      }
    } else {
      this.hasKey = true;
    }
    if (!result) {
      this.key = key;
      this.destination.next(value);
    }
  };
  return DistinctUntilChangedSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function filter(predicate, thisArg) {
  return function filterOperatorFunction(source) {
    return source.lift(new FilterOperator(predicate, thisArg));
  };
}
var FilterOperator = /*@__PURE__*/ (function () {
  function FilterOperator(predicate, thisArg) {
    this.predicate = predicate;
    this.thisArg = thisArg;
  }
  FilterOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
  };
  return FilterOperator;
})();
var FilterSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(FilterSubscriber, _super);
  function FilterSubscriber(destination, predicate, thisArg) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.thisArg = thisArg;
    _this.count = 0;
    return _this;
  }
  FilterSubscriber.prototype._next = function (value) {
    var result;
    try {
      result = this.predicate.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    if (result) {
      this.destination.next(value);
    }
  };
  return FilterSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
  function ObjectUnsubscribedErrorImpl() {
    Error.call(this);
    this.message = "object unsubscribed";
    this.name = "ObjectUnsubscribedError";
    return this;
  }
  ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  return ObjectUnsubscribedErrorImpl;
})();
var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var SubjectSubscription = /*@__PURE__*/ (function (_super) {
  __extends(SubjectSubscription, _super);
  function SubjectSubscription(subject, subscriber) {
    var _this = _super.call(this) || this;
    _this.subject = subject;
    _this.subscriber = subscriber;
    _this.closed = false;
    return _this;
  }
  SubjectSubscription.prototype.unsubscribe = function () {
    if (this.closed) {
      return;
    }
    this.closed = true;
    var subject = this.subject;
    var observers = subject.observers;
    this.subject = null;
    if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
      return;
    }
    var subscriberIndex = observers.indexOf(this.subscriber);
    if (subscriberIndex !== -1) {
      observers.splice(subscriberIndex, 1);
    }
  };
  return SubjectSubscription;
})(Subscription);

/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(SubjectSubscriber, _super);
  function SubjectSubscriber(destination) {
    var _this = _super.call(this, destination) || this;
    _this.destination = destination;
    return _this;
  }
  return SubjectSubscriber;
})(Subscriber);
var Subject = /*@__PURE__*/ (function (_super) {
  __extends(Subject, _super);
  function Subject() {
    var _this = _super.call(this) || this;
    _this.observers = [];
    _this.closed = false;
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject.prototype[rxSubscriber] = function () {
    return new SubjectSubscriber(this);
  };
  Subject.prototype.lift = function (operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject.prototype.next = function (value) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    if (!this.isStopped) {
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();
      for (var i = 0; i < len; i++) {
        copy[i].next(value);
      }
    }
  };
  Subject.prototype.error = function (err) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    this.hasError = true;
    this.thrownError = err;
    this.isStopped = true;
    var observers = this.observers;
    var len = observers.length;
    var copy = observers.slice();
    for (var i = 0; i < len; i++) {
      copy[i].error(err);
    }
    this.observers.length = 0;
  };
  Subject.prototype.complete = function () {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
    this.isStopped = true;
    var observers = this.observers;
    var len = observers.length;
    var copy = observers.slice();
    for (var i = 0; i < len; i++) {
      copy[i].complete();
    }
    this.observers.length = 0;
  };
  Subject.prototype.unsubscribe = function () {
    this.isStopped = true;
    this.closed = true;
    this.observers = null;
  };
  Subject.prototype._trySubscribe = function (subscriber) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return _super.prototype._trySubscribe.call(this, subscriber);
    }
  };
  Subject.prototype._subscribe = function (subscriber) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else if (this.hasError) {
      subscriber.error(this.thrownError);
      return Subscription.EMPTY;
    } else if (this.isStopped) {
      subscriber.complete();
      return Subscription.EMPTY;
    } else {
      this.observers.push(subscriber);
      return new SubjectSubscription(this, subscriber);
    }
  };
  Subject.prototype.asObservable = function () {
    var observable = new Observable();
    observable.source = this;
    return observable;
  };
  Subject.create = function (destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject;
})(Observable);
var AnonymousSubject = /*@__PURE__*/ (function (_super) {
  __extends(AnonymousSubject, _super);
  function AnonymousSubject(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject.prototype.next = function (value) {
    var destination = this.destination;
    if (destination && destination.next) {
      destination.next(value);
    }
  };
  AnonymousSubject.prototype.error = function (err) {
    var destination = this.destination;
    if (destination && destination.error) {
      this.destination.error(err);
    }
  };
  AnonymousSubject.prototype.complete = function () {
    var destination = this.destination;
    if (destination && destination.complete) {
      this.destination.complete();
    }
  };
  AnonymousSubject.prototype._subscribe = function (subscriber) {
    var source = this.source;
    if (source) {
      return this.source.subscribe(subscriber);
    } else {
      return Subscription.EMPTY;
    }
  };
  return AnonymousSubject;
})(Subject);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function scan(accumulator, seed) {
  var hasSeed = false;
  if (arguments.length >= 2) {
    hasSeed = true;
  }
  return function scanOperatorFunction(source) {
    return source.lift(new ScanOperator(accumulator, seed, hasSeed));
  };
}
var ScanOperator = /*@__PURE__*/ (function () {
  function ScanOperator(accumulator, seed, hasSeed) {
    if (hasSeed === void 0) {
      hasSeed = false;
    }
    this.accumulator = accumulator;
    this.seed = seed;
    this.hasSeed = hasSeed;
  }
  ScanOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
  };
  return ScanOperator;
})();
var ScanSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(ScanSubscriber, _super);
  function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
    var _this = _super.call(this, destination) || this;
    _this.accumulator = accumulator;
    _this._seed = _seed;
    _this.hasSeed = hasSeed;
    _this.index = 0;
    return _this;
  }
  Object.defineProperty(ScanSubscriber.prototype, "seed", {
    get: function () {
      return this._seed;
    },
    set: function (value) {
      this.hasSeed = true;
      this._seed = value;
    },
    enumerable: true,
    configurable: true,
  });
  ScanSubscriber.prototype._next = function (value) {
    if (!this.hasSeed) {
      this.seed = value;
      this.destination.next(value);
    } else {
      return this._tryNext(value);
    }
  };
  ScanSubscriber.prototype._tryNext = function (value) {
    var index = this.index++;
    var result;
    try {
      result = this.accumulator(this.seed, value, index);
    } catch (err) {
      this.destination.error(err);
    }
    this.seed = result;
    this.destination.next(result);
  };
  return ScanSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function refCount() {
  return function refCountOperatorFunction(source) {
    return source.lift(new RefCountOperator(source));
  };
}
var RefCountOperator = /*@__PURE__*/ (function () {
  function RefCountOperator(connectable) {
    this.connectable = connectable;
  }
  RefCountOperator.prototype.call = function (subscriber, source) {
    var connectable = this.connectable;
    connectable._refCount++;
    var refCounter = new RefCountSubscriber(subscriber, connectable);
    var subscription = source.subscribe(refCounter);
    if (!refCounter.closed) {
      refCounter.connection = connectable.connect();
    }
    return subscription;
  };
  return RefCountOperator;
})();
var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(RefCountSubscriber, _super);
  function RefCountSubscriber(destination, connectable) {
    var _this = _super.call(this, destination) || this;
    _this.connectable = connectable;
    return _this;
  }
  RefCountSubscriber.prototype._unsubscribe = function () {
    var connectable = this.connectable;
    if (!connectable) {
      this.connection = null;
      return;
    }
    this.connectable = null;
    var refCount = connectable._refCount;
    if (refCount <= 0) {
      this.connection = null;
      return;
    }
    connectable._refCount = refCount - 1;
    if (refCount > 1) {
      this.connection = null;
      return;
    }
    var connection = this.connection;
    var sharedConnection = connectable._connection;
    this.connection = null;
    if (sharedConnection && (!connection || sharedConnection === connection)) {
      sharedConnection.unsubscribe();
    }
  };
  return RefCountSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
var ConnectableObservable = /*@__PURE__*/ (function (_super) {
  __extends(ConnectableObservable, _super);
  function ConnectableObservable(source, subjectFactory) {
    var _this = _super.call(this) || this;
    _this.source = source;
    _this.subjectFactory = subjectFactory;
    _this._refCount = 0;
    _this._isComplete = false;
    return _this;
  }
  ConnectableObservable.prototype._subscribe = function (subscriber) {
    return this.getSubject().subscribe(subscriber);
  };
  ConnectableObservable.prototype.getSubject = function () {
    var subject = this._subject;
    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }
    return this._subject;
  };
  ConnectableObservable.prototype.connect = function () {
    var connection = this._connection;
    if (!connection) {
      this._isComplete = false;
      connection = this._connection = new Subscription();
      connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
      if (connection.closed) {
        this._connection = null;
        connection = Subscription.EMPTY;
      }
    }
    return connection;
  };
  ConnectableObservable.prototype.refCount = function () {
    return refCount()(this);
  };
  return ConnectableObservable;
})(Observable);
var connectableObservableDescriptor = /*@__PURE__*/ (function () {
  var connectableProto = ConnectableObservable.prototype;
  return {
    operator: { value: null },
    _refCount: { value: 0, writable: true },
    _subject: { value: null, writable: true },
    _connection: { value: null, writable: true },
    _subscribe: { value: connectableProto._subscribe },
    _isComplete: { value: connectableProto._isComplete, writable: true },
    getSubject: { value: connectableProto.getSubject },
    connect: { value: connectableProto.connect },
    refCount: { value: connectableProto.refCount },
  };
})();
var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(ConnectableSubscriber, _super);
  function ConnectableSubscriber(destination, connectable) {
    var _this = _super.call(this, destination) || this;
    _this.connectable = connectable;
    return _this;
  }
  ConnectableSubscriber.prototype._error = function (err) {
    this._unsubscribe();
    _super.prototype._error.call(this, err);
  };
  ConnectableSubscriber.prototype._complete = function () {
    this.connectable._isComplete = true;
    this._unsubscribe();
    _super.prototype._complete.call(this);
  };
  ConnectableSubscriber.prototype._unsubscribe = function () {
    var connectable = this.connectable;
    if (connectable) {
      this.connectable = null;
      var connection = connectable._connection;
      connectable._refCount = 0;
      connectable._subject = null;
      connectable._connection = null;
      if (connection) {
        connection.unsubscribe();
      }
    }
  };
  return ConnectableSubscriber;
})(SubjectSubscriber);

/** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */
function multicast(subjectOrSubjectFactory, selector) {
  return function multicastOperatorFunction(source) {
    var subjectFactory;
    if (typeof subjectOrSubjectFactory === "function") {
      subjectFactory = subjectOrSubjectFactory;
    } else {
      subjectFactory = function subjectFactory() {
        return subjectOrSubjectFactory;
      };
    }
    if (typeof selector === "function") {
      return source.lift(new MulticastOperator(subjectFactory, selector));
    }
    var connectable = Object.create(source, connectableObservableDescriptor);
    connectable.source = source;
    connectable.subjectFactory = subjectFactory;
    return connectable;
  };
}
var MulticastOperator = /*@__PURE__*/ (function () {
  function MulticastOperator(subjectFactory, selector) {
    this.subjectFactory = subjectFactory;
    this.selector = selector;
  }
  MulticastOperator.prototype.call = function (subscriber, source) {
    var selector = this.selector;
    var subject = this.subjectFactory();
    var subscription = selector(subject).subscribe(subscriber);
    subscription.add(source.subscribe(subject));
    return subscription;
  };
  return MulticastOperator;
})();

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function pairwise() {
  return function (source) {
    return source.lift(new PairwiseOperator());
  };
}
var PairwiseOperator = /*@__PURE__*/ (function () {
  function PairwiseOperator() {}
  PairwiseOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new PairwiseSubscriber(subscriber));
  };
  return PairwiseOperator;
})();
var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(PairwiseSubscriber, _super);
  function PairwiseSubscriber(destination) {
    var _this = _super.call(this, destination) || this;
    _this.hasPrev = false;
    return _this;
  }
  PairwiseSubscriber.prototype._next = function (value) {
    var pair;
    if (this.hasPrev) {
      pair = [this.prev, value];
    } else {
      this.hasPrev = true;
    }
    this.prev = value;
    if (pair) {
      this.destination.next(pair);
    }
  };
  return PairwiseSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
function repeatWhen(notifier) {
  return function (source) {
    return source.lift(new RepeatWhenOperator(notifier));
  };
}
var RepeatWhenOperator = /*@__PURE__*/ (function () {
  function RepeatWhenOperator(notifier) {
    this.notifier = notifier;
  }
  RepeatWhenOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
  };
  return RepeatWhenOperator;
})();
var RepeatWhenSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(RepeatWhenSubscriber, _super);
  function RepeatWhenSubscriber(destination, notifier, source) {
    var _this = _super.call(this, destination) || this;
    _this.notifier = notifier;
    _this.source = source;
    _this.sourceIsBeingSubscribedTo = true;
    return _this;
  }
  RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.sourceIsBeingSubscribedTo = true;
    this.source.subscribe(this);
  };
  RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
    if (this.sourceIsBeingSubscribedTo === false) {
      return _super.prototype.complete.call(this);
    }
  };
  RepeatWhenSubscriber.prototype.complete = function () {
    this.sourceIsBeingSubscribedTo = false;
    if (!this.isStopped) {
      if (!this.retries) {
        this.subscribeToRetries();
      }
      if (!this.retriesSubscription || this.retriesSubscription.closed) {
        return _super.prototype.complete.call(this);
      }
      this._unsubscribeAndRecycle();
      this.notifications.next();
    }
  };
  RepeatWhenSubscriber.prototype._unsubscribe = function () {
    var _a = this,
      notifications = _a.notifications,
      retriesSubscription = _a.retriesSubscription;
    if (notifications) {
      notifications.unsubscribe();
      this.notifications = null;
    }
    if (retriesSubscription) {
      retriesSubscription.unsubscribe();
      this.retriesSubscription = null;
    }
    this.retries = null;
  };
  RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
    var _unsubscribe = this._unsubscribe;
    this._unsubscribe = null;
    _super.prototype._unsubscribeAndRecycle.call(this);
    this._unsubscribe = _unsubscribe;
    return this;
  };
  RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
    this.notifications = new Subject();
    var retries;
    try {
      var notifier = this.notifier;
      retries = notifier(this.notifications);
    } catch (e) {
      return _super.prototype.complete.call(this);
    }
    this.retries = retries;
    this.retriesSubscription = subscribeToResult(this, retries);
  };
  return RepeatWhenSubscriber;
})(OuterSubscriber);

/** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */
function shareSubjectFactory() {
  return new Subject();
}
function share() {
  return function (source) {
    return refCount()(multicast(shareSubjectFactory)(source));
  };
}

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
function switchMap(project, resultSelector) {
  if (typeof resultSelector === "function") {
    return function (source) {
      return source.pipe(
        switchMap(function (a, i) {
          return from(project(a, i)).pipe(
            map(function (b, ii) {
              return resultSelector(a, b, i, ii);
            }),
          );
        }),
      );
    };
  }
  return function (source) {
    return source.lift(new SwitchMapOperator(project));
  };
}
var SwitchMapOperator = /*@__PURE__*/ (function () {
  function SwitchMapOperator(project) {
    this.project = project;
  }
  SwitchMapOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
  };
  return SwitchMapOperator;
})();
var SwitchMapSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(SwitchMapSubscriber, _super);
  function SwitchMapSubscriber(destination, project) {
    var _this = _super.call(this, destination) || this;
    _this.project = project;
    _this.index = 0;
    return _this;
  }
  SwitchMapSubscriber.prototype._next = function (value) {
    var result;
    var index = this.index++;
    try {
      result = this.project(value, index);
    } catch (error) {
      this.destination.error(error);
      return;
    }
    this._innerSub(result, value, index);
  };
  SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
    var innerSubscription = this.innerSubscription;
    if (innerSubscription) {
      innerSubscription.unsubscribe();
    }
    var innerSubscriber = new InnerSubscriber(this, value, index);
    var destination = this.destination;
    destination.add(innerSubscriber);
    this.innerSubscription = subscribeToResult(this, result, undefined, undefined, innerSubscriber);
    if (this.innerSubscription !== innerSubscriber) {
      destination.add(this.innerSubscription);
    }
  };
  SwitchMapSubscriber.prototype._complete = function () {
    var innerSubscription = this.innerSubscription;
    if (!innerSubscription || innerSubscription.closed) {
      _super.prototype._complete.call(this);
    }
    this.unsubscribe();
  };
  SwitchMapSubscriber.prototype._unsubscribe = function () {
    this.innerSubscription = null;
  };
  SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
    var destination = this.destination;
    destination.remove(innerSub);
    this.innerSubscription = null;
    if (this.isStopped) {
      _super.prototype._complete.call(this);
    }
  };
  SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.destination.next(innerValue);
  };
  return SwitchMapSubscriber;
})(OuterSubscriber);

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
function takeUntil(notifier) {
  return function (source) {
    return source.lift(new TakeUntilOperator(notifier));
  };
}
var TakeUntilOperator = /*@__PURE__*/ (function () {
  function TakeUntilOperator(notifier) {
    this.notifier = notifier;
  }
  TakeUntilOperator.prototype.call = function (subscriber, source) {
    var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
    var notifierSubscription = subscribeToResult(takeUntilSubscriber, this.notifier);
    if (notifierSubscription && !takeUntilSubscriber.seenValue) {
      takeUntilSubscriber.add(notifierSubscription);
      return source.subscribe(takeUntilSubscriber);
    }
    return takeUntilSubscriber;
  };
  return TakeUntilOperator;
})();
var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(TakeUntilSubscriber, _super);
  function TakeUntilSubscriber(destination) {
    var _this = _super.call(this, destination) || this;
    _this.seenValue = false;
    return _this;
  }
  TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.seenValue = true;
    this.complete();
  };
  TakeUntilSubscriber.prototype.notifyComplete = function () {};
  return TakeUntilSubscriber;
})(OuterSubscriber);

/** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */
function tap(nextOrObserver, error, complete) {
  return function tapOperatorFunction(source) {
    return source.lift(new DoOperator(nextOrObserver, error, complete));
  };
}
var DoOperator = /*@__PURE__*/ (function () {
  function DoOperator(nextOrObserver, error, complete) {
    this.nextOrObserver = nextOrObserver;
    this.error = error;
    this.complete = complete;
  }
  DoOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
  };
  return DoOperator;
})();
var TapSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(TapSubscriber, _super);
  function TapSubscriber(destination, observerOrNext, error, complete) {
    var _this = _super.call(this, destination) || this;
    _this._tapNext = noop;
    _this._tapError = noop;
    _this._tapComplete = noop;
    _this._tapError = error || noop;
    _this._tapComplete = complete || noop;
    if (isFunction(observerOrNext)) {
      _this._context = _this;
      _this._tapNext = observerOrNext;
    } else if (observerOrNext) {
      _this._context = observerOrNext;
      _this._tapNext = observerOrNext.next || noop;
      _this._tapError = observerOrNext.error || noop;
      _this._tapComplete = observerOrNext.complete || noop;
    }
    return _this;
  }
  TapSubscriber.prototype._next = function (value) {
    try {
      this._tapNext.call(this._context, value);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(value);
  };
  TapSubscriber.prototype._error = function (err) {
    try {
      this._tapError.call(this._context, err);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.error(err);
  };
  TapSubscriber.prototype._complete = function () {
    try {
      this._tapComplete.call(this._context);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    return this.destination.complete();
  };
  return TapSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
function withLatestFrom() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return function (source) {
    var project;
    if (typeof args[args.length - 1] === "function") {
      project = args.pop();
    }
    var observables = args;
    return source.lift(new WithLatestFromOperator(observables, project));
  };
}
var WithLatestFromOperator = /*@__PURE__*/ (function () {
  function WithLatestFromOperator(observables, project) {
    this.observables = observables;
    this.project = project;
  }
  WithLatestFromOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
  };
  return WithLatestFromOperator;
})();
var WithLatestFromSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(WithLatestFromSubscriber, _super);
  function WithLatestFromSubscriber(destination, observables, project) {
    var _this = _super.call(this, destination) || this;
    _this.observables = observables;
    _this.project = project;
    _this.toRespond = [];
    var len = observables.length;
    _this.values = new Array(len);
    for (var i = 0; i < len; i++) {
      _this.toRespond.push(i);
    }
    for (var i = 0; i < len; i++) {
      var observable = observables[i];
      _this.add(subscribeToResult(_this, observable, observable, i));
    }
    return _this;
  }
  WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.values[outerIndex] = innerValue;
    var toRespond = this.toRespond;
    if (toRespond.length > 0) {
      var found = toRespond.indexOf(outerIndex);
      if (found !== -1) {
        toRespond.splice(found, 1);
      }
    }
  };
  WithLatestFromSubscriber.prototype.notifyComplete = function () {};
  WithLatestFromSubscriber.prototype._next = function (value) {
    if (this.toRespond.length === 0) {
      var args = [value].concat(this.values);
      if (this.project) {
        this._tryProject(args);
      } else {
        this.destination.next(args);
      }
    }
  };
  WithLatestFromSubscriber.prototype._tryProject = function (args) {
    var result;
    try {
      result = this.project.apply(this, args);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(result);
  };
  return WithLatestFromSubscriber;
})(OuterSubscriber);

const ALL_PLAYER_INDICES = [0, 1, 2, 3];
function playerFilter(indices, variables) {
  return (source) => source.pipe(filter((payload) => playerFilterMatches(payload.playerIndex, indices, variables)));
}
const playerFilterMatches = (playerIndex, indices, variables) => {
  // Default to all the indices
  let filterIndices = [...ALL_PLAYER_INDICES];
  if (typeof indices === "number") {
    filterIndices = [indices];
  } else if (typeof indices === "string") {
    if (variables && variables.playerIndex !== undefined) {
      switch (indices) {
        case "player":
          filterIndices = [variables.playerIndex];
          break;
        case "opponents":
          filterIndices = ALL_PLAYER_INDICES.filter((n) => n !== variables.playerIndex);
          break;
      }
    }
  } else {
    // indices is an array of numbers
    filterIndices = indices;
  }
  return filterIndices.includes(playerIndex);
};

const characterMap = new Map()
  .set(slippiJs.Character.CAPTAIN_FALCON, {
    id: slippiJs.Character.CAPTAIN_FALCON,
    name: "Captain Falcon",
    shortName: "Falcon",
    colors: ["Default", "Black", "Red", "White", "Green", "Blue"],
  })
  .set(slippiJs.Character.DONKEY_KONG, {
    id: slippiJs.Character.DONKEY_KONG,
    name: "Donkey Kong",
    shortName: "DK",
    colors: ["Default", "Black", "Red", "Blue", "Green"],
  })
  .set(slippiJs.Character.FOX, {
    id: slippiJs.Character.FOX,
    name: "Fox",
    colors: ["Default", "Red", "Blue", "Green"],
  })
  .set(slippiJs.Character.GAME_AND_WATCH, {
    id: slippiJs.Character.GAME_AND_WATCH,
    name: "Mr. Game & Watch",
    shortName: "GnW",
    colors: ["Default", "Red", "Blue", "Green"],
  })
  .set(slippiJs.Character.KIRBY, {
    id: slippiJs.Character.KIRBY,
    name: "Kirby",
    colors: ["Default", "Yellow", "Blue", "Red", "Green", "White"],
  })
  .set(slippiJs.Character.BOWSER, {
    id: slippiJs.Character.BOWSER,
    name: "Bowser",
    colors: ["Default", "Red", "Blue", "Black"],
  })
  .set(slippiJs.Character.LINK, {
    id: slippiJs.Character.LINK,
    name: "Link",
    colors: ["Default", "Red", "Blue", "Black", "White"],
  })
  .set(slippiJs.Character.LUIGI, {
    id: slippiJs.Character.LUIGI,
    name: "Luigi",
    colors: ["Default", "White", "Blue", "Red"],
  })
  .set(slippiJs.Character.MARIO, {
    id: slippiJs.Character.MARIO,
    name: "Mario",
    colors: ["Default", "Yellow", "Black", "Blue", "Green"],
  })
  .set(slippiJs.Character.MARTH, {
    id: slippiJs.Character.MARTH,
    name: "Marth",
    colors: ["Default", "Red", "Green", "Black", "White"],
  })
  .set(slippiJs.Character.MEWTWO, {
    id: slippiJs.Character.MEWTWO,
    name: "Mewtwo",
    colors: ["Default", "Red", "Blue", "Green"],
  })
  .set(slippiJs.Character.NESS, {
    id: slippiJs.Character.NESS,
    name: "Ness",
    colors: ["Default", "Yellow", "Blue", "Green"],
  })
  .set(slippiJs.Character.PEACH, {
    id: slippiJs.Character.PEACH,
    name: "Peach",
    colors: ["Default", "Daisy", "White", "Blue", "Green"],
  })
  .set(slippiJs.Character.PIKACHU, {
    id: slippiJs.Character.PIKACHU,
    name: "Pikachu",
    colors: ["Default", "Red", "Party Hat", "Cowboy Hat"],
  })
  .set(slippiJs.Character.ICE_CLIMBERS, {
    id: slippiJs.Character.ICE_CLIMBERS,
    name: "Ice Climbers",
    shortName: "ICs",
    colors: ["Default", "Green", "Orange", "Red"],
  })
  .set(slippiJs.Character.JIGGLYPUFF, {
    id: slippiJs.Character.JIGGLYPUFF,
    name: "Jigglypuff",
    shortName: "Puff",
    colors: ["Default", "Red", "Blue", "Headband", "Crown"],
  })
  .set(slippiJs.Character.SAMUS, {
    id: slippiJs.Character.SAMUS,
    name: "Samus",
    colors: ["Default", "Pink", "Black", "Green", "Purple"],
  })
  .set(slippiJs.Character.YOSHI, {
    id: slippiJs.Character.YOSHI,
    name: "Yoshi",
    colors: ["Default", "Red", "Blue", "Yellow", "Pink", "Cyan"],
  })
  .set(slippiJs.Character.ZELDA, {
    id: slippiJs.Character.ZELDA,
    name: "Zelda",
    colors: ["Default", "Red", "Blue", "Green", "White"],
  })
  .set(slippiJs.Character.SHEIK, {
    id: slippiJs.Character.SHEIK,
    name: "Sheik",
    colors: ["Default", "Red", "Blue", "Green", "White"],
  })
  .set(slippiJs.Character.FALCO, {
    id: slippiJs.Character.FALCO,
    name: "Falco",
    colors: ["Default", "Red", "Blue", "Green"],
  })
  .set(slippiJs.Character.YOUNG_LINK, {
    id: slippiJs.Character.YOUNG_LINK,
    name: "Young Link",
    shortName: "YL",
    colors: ["Default", "Red", "Blue", "White", "Black"],
  })
  .set(slippiJs.Character.DR_MARIO, {
    id: slippiJs.Character.DR_MARIO,
    name: "Dr. Mario",
    shortName: "Doc",
    colors: ["Default", "Red", "Blue", "Green", "Black"],
  })
  .set(slippiJs.Character.ROY, {
    id: slippiJs.Character.ROY,
    name: "Roy",
    colors: ["Default", "Red", "Blue", "Green", "Yellow"],
  })
  .set(slippiJs.Character.PICHU, {
    id: slippiJs.Character.PICHU,
    name: "Pichu",
    colors: ["Default", "Red", "Blue", "Green"],
  })
  .set(slippiJs.Character.GANONDORF, {
    id: slippiJs.Character.GANONDORF,
    name: "Ganondorf",
    shortName: "Ganon",
    colors: ["Default", "Red", "Blue", "Green", "Purple"],
  });
function getAllCharacters() {
  return Array.from(characterMap.values());
}
function getCharacterInfo(externalCharacterId) {
  const char = characterMap.get(externalCharacterId);
  if (!char) {
    throw new Error(`Invalid character id: ${externalCharacterId}`);
  }
  return char;
}
function getCharacterShortName(externalCharacterId) {
  const character = getCharacterInfo(externalCharacterId);
  // Return the full name if no short name exists
  return character.shortName || getCharacterName(externalCharacterId);
}
function getCharacterName(externalCharacterId) {
  const character = getCharacterInfo(externalCharacterId);
  return character.name;
}
// Return a human-readable color from a characterCode.
function getCharacterColorName(externalCharacterId, characterColor) {
  const character = getCharacterInfo(externalCharacterId);
  const colors = character.colors;
  return colors[characterColor];
}

const UnknownMove = {
  id: -1,
  name: "Unknown Move",
  shortName: "unknown",
};
(function (MoveID) {
  MoveID[(MoveID["MISC"] = 1)] = "MISC";
  MoveID[(MoveID["JAB_1"] = 2)] = "JAB_1";
  MoveID[(MoveID["JAB_2"] = 3)] = "JAB_2";
  MoveID[(MoveID["JAB_3"] = 4)] = "JAB_3";
  MoveID[(MoveID["RAPID_JABS"] = 5)] = "RAPID_JABS";
  MoveID[(MoveID["DASH_ATTACK"] = 6)] = "DASH_ATTACK";
  MoveID[(MoveID["F_TILT"] = 7)] = "F_TILT";
  MoveID[(MoveID["U_TILT"] = 8)] = "U_TILT";
  MoveID[(MoveID["D_TILT"] = 9)] = "D_TILT";
  MoveID[(MoveID["F_SMASH"] = 10)] = "F_SMASH";
  MoveID[(MoveID["U_SMASH"] = 11)] = "U_SMASH";
  MoveID[(MoveID["D_SMASH"] = 12)] = "D_SMASH";
  MoveID[(MoveID["NEUTRAL_AIR"] = 13)] = "NEUTRAL_AIR";
  MoveID[(MoveID["F_AIR"] = 14)] = "F_AIR";
  MoveID[(MoveID["B_AIR"] = 15)] = "B_AIR";
  MoveID[(MoveID["U_AIR"] = 16)] = "U_AIR";
  MoveID[(MoveID["D_AIR"] = 17)] = "D_AIR";
  MoveID[(MoveID["NEUTRAL_SPECIAL"] = 18)] = "NEUTRAL_SPECIAL";
  MoveID[(MoveID["F_SPECIAL"] = 19)] = "F_SPECIAL";
  MoveID[(MoveID["U_SPECIAL"] = 20)] = "U_SPECIAL";
  MoveID[(MoveID["D_SPECIAL"] = 21)] = "D_SPECIAL";
  MoveID[(MoveID["GETUP"] = 50)] = "GETUP";
  MoveID[(MoveID["GETUP_SLOW"] = 51)] = "GETUP_SLOW";
  MoveID[(MoveID["GRAB_PUMMEL"] = 52)] = "GRAB_PUMMEL";
  MoveID[(MoveID["F_THROW"] = 53)] = "F_THROW";
  MoveID[(MoveID["B_THROW"] = 54)] = "B_THROW";
  MoveID[(MoveID["U_THROW"] = 55)] = "U_THROW";
  MoveID[(MoveID["D_THROW"] = 56)] = "D_THROW";
  MoveID[(MoveID["EDGE_SLOW"] = 61)] = "EDGE_SLOW";
  MoveID[(MoveID["EDGE"] = 62)] = "EDGE";
})(exports.MoveID || (exports.MoveID = {}));
const allMoves = new Map()
  .set(exports.MoveID.MISC, {
    // This includes all thrown items, zair, luigi's taunt, samus bombs, etc
    id: exports.MoveID.MISC,
    name: "Miscellaneous",
    shortName: "misc",
  })
  .set(exports.MoveID.JAB_1, {
    id: exports.MoveID.JAB_1,
    name: "Jab",
    shortName: "jab",
  })
  .set(exports.MoveID.JAB_2, {
    id: exports.MoveID.JAB_2,
    name: "Jab",
    shortName: "jab",
  })
  .set(exports.MoveID.JAB_3, {
    id: exports.MoveID.JAB_3,
    name: "Jab",
    shortName: "jab",
  })
  .set(exports.MoveID.RAPID_JABS, {
    id: exports.MoveID.RAPID_JABS,
    name: "Rapid Jabs",
    shortName: "rapid-jabs",
  })
  .set(exports.MoveID.DASH_ATTACK, {
    id: exports.MoveID.DASH_ATTACK,
    name: "Dash Attack",
    shortName: "dash",
  })
  .set(exports.MoveID.F_TILT, {
    id: exports.MoveID.F_TILT,
    name: "Forward Tilt",
    shortName: "ftilt",
  })
  .set(exports.MoveID.U_TILT, {
    id: exports.MoveID.U_TILT,
    name: "Up Tilt",
    shortName: "utilt",
  })
  .set(exports.MoveID.D_TILT, {
    id: exports.MoveID.D_TILT,
    name: "Down Tilt",
    shortName: "dtilt",
  })
  .set(exports.MoveID.F_SMASH, {
    id: exports.MoveID.F_SMASH,
    name: "Forward Smash",
    shortName: "fsmash",
  })
  .set(exports.MoveID.U_SMASH, {
    id: exports.MoveID.U_SMASH,
    name: "Up Smash",
    shortName: "usmash",
  })
  .set(exports.MoveID.D_SMASH, {
    id: exports.MoveID.D_SMASH,
    name: "Down Smash",
    shortName: "dsmash",
  })
  .set(exports.MoveID.NEUTRAL_AIR, {
    id: exports.MoveID.NEUTRAL_AIR,
    name: "Neutral Air",
    shortName: "nair",
  })
  .set(exports.MoveID.F_AIR, {
    id: exports.MoveID.F_AIR,
    name: "Forward Air",
    shortName: "fair",
  })
  .set(exports.MoveID.B_AIR, {
    id: exports.MoveID.B_AIR,
    name: "Back Air",
    shortName: "bair",
  })
  .set(exports.MoveID.U_AIR, {
    id: exports.MoveID.U_AIR,
    name: "Up Air",
    shortName: "uair",
  })
  .set(exports.MoveID.D_AIR, {
    id: exports.MoveID.D_AIR,
    name: "Down Air",
    shortName: "dair",
  })
  .set(exports.MoveID.NEUTRAL_SPECIAL, {
    id: exports.MoveID.NEUTRAL_SPECIAL,
    name: "Neutral B",
    shortName: "neutral-b",
  })
  .set(exports.MoveID.F_SPECIAL, {
    id: exports.MoveID.F_SPECIAL,
    name: "Side B",
    shortName: "side-b",
  })
  .set(exports.MoveID.U_SPECIAL, {
    id: exports.MoveID.U_SPECIAL,
    name: "Up B",
    shortName: "up-b",
  })
  .set(exports.MoveID.D_SPECIAL, {
    id: exports.MoveID.D_SPECIAL,
    name: "Down B",
    shortName: "down-b",
  })
  .set(exports.MoveID.GETUP, {
    id: exports.MoveID.GETUP,
    name: "Getup Attack",
    shortName: "getup",
  })
  .set(exports.MoveID.GETUP_SLOW, {
    id: exports.MoveID.GETUP_SLOW,
    name: "Getup Attack (Slow)",
    shortName: "getup-slow",
  })
  .set(exports.MoveID.GRAB_PUMMEL, {
    id: exports.MoveID.GRAB_PUMMEL,
    name: "Grab Pummel",
    shortName: "pummel",
  })
  .set(exports.MoveID.F_THROW, {
    id: 53,
    name: "Forward Throw",
    shortName: "fthrow",
  })
  .set(exports.MoveID.B_THROW, {
    id: exports.MoveID.B_THROW,
    name: "Back Throw",
    shortName: "bthrow",
  })
  .set(exports.MoveID.U_THROW, {
    id: exports.MoveID.U_THROW,
    name: "Up Throw",
    shortName: "uthrow",
  })
  .set(exports.MoveID.D_THROW, {
    id: exports.MoveID.D_THROW,
    name: "Down Throw",
    shortName: "dthrow",
  })
  .set(exports.MoveID.EDGE_SLOW, {
    id: exports.MoveID.EDGE_SLOW,
    name: "Edge Attack (Slow)",
    shortName: "edge-slow",
  })
  .set(exports.MoveID.EDGE, {
    id: exports.MoveID.EDGE,
    name: "Edge Attack",
    shortName: "edge",
  });
function getMoveInfo(moveId) {
  const m = allMoves.get(moveId);
  if (!m) {
    return UnknownMove;
  }
  return m;
}
function getMoveShortName(moveId) {
  const move = getMoveInfo(moveId);
  return move.shortName;
}
function getMoveName(moveId) {
  const move = getMoveInfo(moveId);
  return move.name;
}

const shortNames = new Map()
  .set(slippiJs.Stage.FOUNTAIN_OF_DREAMS, "FoD")
  .set(slippiJs.Stage.POKEMON_STADIUM, "PS")
  .set(slippiJs.Stage.YOSHIS_STORY, "YS")
  .set(slippiJs.Stage.DREAMLAND, "DL")
  .set(slippiJs.Stage.BATTLEFIELD, "BF")
  .set(slippiJs.Stage.FINAL_DESTINATION, "FD");
function getStageInfo(stageId) {
  const s = slippiJs.stages.getStageInfo(stageId);
  if (!s) {
    throw new Error(`Invalid stage with id ${stageId}`);
  }
  const shortName = shortNames.get(stageId);
  return {
    ...s,
    shortName,
  };
}
function getStageName(stageId) {
  const stage = getStageInfo(stageId);
  return stage.name;
}
function getStageShortName(stageId) {
  const stage = getStageInfo(stageId);
  return stage.shortName || getStageName(stageId);
}

function extractPlayerNamesByPort(settings, metadata) {
  return [0, 1, 2, 3].map((index) => {
    var _a, _b;
    const nametags = [];
    const player = settings.players.find((player) => player.playerIndex === index);
    const playerTag = player ? player.nametag : null;
    const netplayName =
      (_a = lodash.get(metadata, ["players", index, "names", "netplay"], null)) !== null && _a !== void 0
        ? _a
        : player === null || player === void 0
        ? void 0
        : player.displayName;
    const netplayCode =
      (_b = lodash.get(metadata, ["players", index, "names", "code"], null)) !== null && _b !== void 0
        ? _b
        : player === null || player === void 0
        ? void 0
        : player.connectCode;
    if (netplayName) {
      nametags.push(netplayName);
    }
    if (netplayCode) {
      nametags.push(netplayCode);
    }
    if (playerTag) {
      nametags.push(playerTag);
    }
    return nametags;
  });
}
function extractPlayerNames(settings, metadata) {
  return extractPlayerNamesByPort(settings, metadata).flat();
}
function namesMatch(lookingForNametags, inGameTags, fuzzyMatch) {
  if (lookingForNametags.length === 0 || inGameTags.length === 0) {
    return false;
  }
  const match = inGameTags.find((name) => {
    // If we're not doing fuzzy matching just return the exact match
    if (!fuzzyMatch) {
      return lookingForNametags.includes(name);
    }
    // Replace the netplay names with underscores and coerce to lowercase
    // Smashladder internally represents spaces as underscores when writing SLP files
    const fuzzyNetplayName = name.toLowerCase();
    const matchedFuzzyTag = lookingForNametags.find((tag) => {
      const lowerSearch = tag.toLowerCase();
      const fuzzySearch = tag.split(" ").join("_").toLowerCase();
      return lowerSearch === fuzzyNetplayName || fuzzySearch === fuzzyNetplayName;
    });
    return matchedFuzzyTag !== undefined;
  });
  return match !== undefined;
}

/**
 * MatchesPortNumber ensures the player performing the combo is a specific port.
 */
const MatchesPortNumber = (combo, _settings, options) => {
  const move = combo.moves.find((move) => options.portFilter.includes(move.playerIndex + 1));
  return Boolean(move);
};
const MatchesPlayerName = (combo, settings, options, metadata) => {
  if (options.nameTags.length === 0) {
    return true;
  }
  const allMatchableNames = extractPlayerNamesByPort(settings, metadata);
  const uniquePlayerIds = new Set(combo.moves.map((move) => move.playerIndex));
  const match = Array.from(uniquePlayerIds).find((playerIndex) => {
    const matchableNames = allMatchableNames[playerIndex];
    if (matchableNames.length === 0) {
      // We're looking for a nametag but we have nothing to match against
      return false;
    }
    return namesMatch(options.nameTags, matchableNames, options.fuzzyNameTagMatching);
  });
  return match !== undefined;
};
const MatchesCharacter = (combo, settings, options) => {
  return comboMatchesCharacter(combo, settings, options.characterFilter);
};
const comboMatchesCharacter = (combo, settings, characterFilter) => {
  if (characterFilter.length === 0) {
    return true;
  }
  const matches = combo.moves.find((move) => {
    const player = settings.players.find((player) => player.playerIndex === move.playerIndex);
    if (!player || player.characterId === null) {
      return false;
    }
    return characterFilter.includes(player.characterId);
  });
  return Boolean(matches);
};
const ExcludesChainGrabs = (combo, settings, options) => {
  if (!options.excludeChainGrabs) {
    return true;
  }
  if (!comboMatchesCharacter(combo, settings, options.chainGrabbers)) {
    return true;
  }
  const numUpThrowPummels = combo.moves.filter(
    ({ moveId }) => moveId === exports.MoveID.U_THROW || moveId === exports.MoveID.GRAB_PUMMEL,
  ).length;
  const numMoves = combo.moves.length;
  const isChainGrab = numUpThrowPummels / numMoves >= options.chainGrabThreshold;
  // Continue with processing if the combo is not a chain grab
  return !isChainGrab;
};
const ExcludesWobbles = (combo, settings, options) => {
  if (!options.excludeWobbles) {
    return true;
  }
  if (!comboMatchesCharacter(combo, settings, [slippiJs.Character.ICE_CLIMBERS])) {
    // Continue processing if the character is not Ice Climbers
    return true;
  }
  const wobbles = [];
  let pummels = 0;
  combo.moves.forEach(({ moveId }) => {
    if (moveId === exports.MoveID.GRAB_PUMMEL) {
      pummels++;
    } else {
      wobbles.push(pummels);
      pummels = 0;
    }
  });
  wobbles.push(pummels);
  const wobbled = wobbles.some((pummelCount) => pummelCount > options.wobbleThreshold);
  // Only continue processing if the combo is not a wobble
  return !wobbled;
};
const SatisfiesMinComboLength = (combo, _settings, options) => {
  const numMoves = combo.moves.length;
  return numMoves >= options.minComboLength;
};
const SatisfiesMinComboPercent = (combo, settings, options) => {
  if (settings.players.length !== 2) {
    return true;
  }
  const move = combo.moves.find((move) => move.playerIndex !== combo.playerIndex);
  if (!move) {
    return false;
  }
  const player = settings.players.find((p) => p.playerIndex === move.playerIndex);
  if (!player || player.characterId === null) {
    return false;
  }
  const minComboPercent = options.perCharacterMinComboPercent[player.characterId] || options.minComboPercent;
  const totalComboPercent =
    combo.endPercent === null || combo.endPercent === undefined
      ? combo.startPercent
      : combo.endPercent - combo.startPercent;
  // Continue only if the total combo percent was greater than the threshold
  return totalComboPercent > minComboPercent;
};
const ExcludesLargeSingleHit = (combo, _settings, options) => {
  const totalDmg = lodash.sumBy(combo.moves, ({ damage }) => damage);
  const largeSingleHit = combo.moves.some(({ damage }) => damage / totalDmg >= options.largeHitThreshold);
  return !largeSingleHit;
};
const ExcludesCPUs = (_combo, settings, options) => {
  if (!options.excludeCPUs) {
    return true;
  }
  const cpu = settings.players.some((player) => player.type != 0);
  return !cpu;
};
const IsOneVsOne = (_combo, settings) => {
  return settings.players.length === 2;
};
const ComboDidKill = (combo, _settings, options) => {
  return !options.comboMustKill || combo.didKill;
};
const ALL_CRITERIA = [
  MatchesPortNumber,
  MatchesPlayerName,
  MatchesCharacter,
  ExcludesChainGrabs,
  ExcludesWobbles,
  SatisfiesMinComboLength,
  SatisfiesMinComboPercent,
  ExcludesLargeSingleHit,
  ExcludesCPUs,
  IsOneVsOne,
  ComboDidKill,
];

const defaultComboFilterSettings = {
  chainGrabbers: [
    slippiJs.Character.MARTH,
    slippiJs.Character.PEACH,
    slippiJs.Character.PIKACHU,
    slippiJs.Character.DR_MARIO,
  ],
  characterFilter: [],
  portFilter: [1, 2, 3, 4],
  nameTags: [],
  minComboLength: 1,
  minComboPercent: 60,
  comboMustKill: true,
  excludeCPUs: true,
  excludeChainGrabs: true,
  excludeWobbles: true,
  largeHitThreshold: 0.8,
  wobbleThreshold: 8,
  chainGrabThreshold: 0.8,
  perCharacterMinComboPercent: {
    [slippiJs.Character.JIGGLYPUFF]: 85,
  },
  fuzzyNameTagMatching: true,
};
class ComboFilter {
  constructor(options) {
    this.settings = Object.assign({}, defaultComboFilterSettings, options);
    this.originalSettings = Object.assign({}, this.settings);
    this.criteria = [...ALL_CRITERIA];
  }
  updateSettings(options) {
    this.settings = Object.assign({}, this.settings, options);
    return this.getSettings();
  }
  getSettings() {
    // Return a copy of the settings for immutability
    return Object.assign({}, this.settings);
  }
  resetSettings() {
    return this.updateSettings(this.originalSettings);
  }
  isCombo(combo, settings, metadata) {
    return checkCombo(this.settings, combo, settings, metadata, this.criteria);
  }
}
const checkCombo = (comboSettings, combo, gameSettings, metadata, criteria) => {
  const criteriaToCheck = criteria && criteria.length > 0 ? criteria : [...ALL_CRITERIA];
  // Check if we satisfy all the criteria
  for (const c of criteriaToCheck) {
    if (!c(combo, gameSettings, comboSettings, metadata)) {
      return false;
    }
  }
  // If we made it through all the criteria then it was a valid combo
  return true;
};

// Export the parameter types for events and SlippiGame for convenience
(function (GameEndMethod) {
  GameEndMethod[(GameEndMethod["UNRESOLVED"] = 0)] = "UNRESOLVED";
  GameEndMethod[(GameEndMethod["TIME"] = 1)] = "TIME";
  GameEndMethod[(GameEndMethod["GAME"] = 2)] = "GAME";
  GameEndMethod[(GameEndMethod["RESOLVED"] = 3)] = "RESOLVED";
  GameEndMethod[(GameEndMethod["NO_CONTEST"] = 7)] = "NO_CONTEST";
})(exports.GameEndMethod || (exports.GameEndMethod = {}));
(function (Input) {
  Input["D_LEFT"] = "D_LEFT";
  Input["D_RIGHT"] = "D_RIGHT";
  Input["D_DOWN"] = "D_DOWN";
  Input["D_UP"] = "D_UP";
  Input["Z"] = "Z";
  Input["R"] = "R";
  Input["L"] = "L";
  Input["A"] = "A";
  Input["B"] = "B";
  Input["X"] = "X";
  Input["Y"] = "Y";
  Input["START"] = "START";
})(exports.Input || (exports.Input = {}));

// Based on https://github.com/wilsonzlin/edgesearch/blob/d03816dd4b18d3d2eb6d08cb1ae14f96f046141d/demo/wiki/client/src/util/util.ts
// Ensures value is not null or undefined.
// != does no type validation so we don't need to explcitly check for undefined.
function exists(value) {
  return value != null;
}

var InputBit;
(function (InputBit) {
  InputBit[(InputBit["D_LEFT"] = 1)] = "D_LEFT";
  InputBit[(InputBit["D_RIGHT"] = 2)] = "D_RIGHT";
  InputBit[(InputBit["D_DOWN"] = 4)] = "D_DOWN";
  InputBit[(InputBit["D_UP"] = 8)] = "D_UP";
  InputBit[(InputBit["Z"] = 16)] = "Z";
  InputBit[(InputBit["R"] = 32)] = "R";
  InputBit[(InputBit["L"] = 64)] = "L";
  InputBit[(InputBit["A"] = 256)] = "A";
  InputBit[(InputBit["B"] = 512)] = "B";
  InputBit[(InputBit["X"] = 1024)] = "X";
  InputBit[(InputBit["Y"] = 2048)] = "Y";
  InputBit[(InputBit["START"] = 4096)] = "START";
})(InputBit || (InputBit = {}));
const inputBitMap = new Map()
  .set(exports.Input.D_LEFT, InputBit.D_LEFT)
  .set(exports.Input.D_RIGHT, InputBit.D_RIGHT)
  .set(exports.Input.D_DOWN, InputBit.D_DOWN)
  .set(exports.Input.D_UP, InputBit.D_UP)
  .set(exports.Input.Z, InputBit.Z)
  .set(exports.Input.R, InputBit.R)
  .set(exports.Input.L, InputBit.L)
  .set(exports.Input.A, InputBit.A)
  .set(exports.Input.B, InputBit.B)
  .set(exports.Input.X, InputBit.X)
  .set(exports.Input.Y, InputBit.Y)
  .set(exports.Input.START, InputBit.START);
const generateInputBitmaskFromBit = (...buttons) => {
  return buttons.reduce((a, b) => a | b);
};
const generateInputBitmask = (...buttons) => {
  const mappedButtons = buttons.map((b) => mapInputToBits(b));
  return generateInputBitmaskFromBit(...mappedButtons);
};
const mapInputToBits = (button) => {
  const b = inputBitMap.get(button);
  if (!exists(b)) {
    throw new Error(`Unknown input: ${button}`);
  }
  return b;
};
const isButtonPressed = (bitmask, button) => {
  return (bitmask & button) === button;
};
const bitmaskToButtons = (bitmask) => {
  const inputs = new Array();
  inputBitMap.forEach((mask, name) => {
    if (isButtonPressed(bitmask, mask)) {
      inputs.push(name);
    }
  });
  return inputs;
};

/**
 * We can tap into the Dolphin state by reading the log printed to stdout.
 *
 * Dolphin will emit the following messages in following order:
 *
 * [FILE_PATH]             - path of the slp file about to be played
 * [LRAS]                  - emitted only if the game was force quit before game end
 * [PLAYBACK_START_FRAME]  - the frame playback will commence (defaults to -123 if omitted)
 * [GAME_END_FRAME]        - the last frame of the game
 * [PLAYBACK_END_FRAME]    - this frame playback will end at (defaults to MAX_INT if omitted)
 * [CURRENT_FRAME]         - the current frame being played back
 * [NO_GAME]               - no more files in the queue
 */
var PlaybackCommand;
(function (PlaybackCommand) {
  PlaybackCommand["FILE_PATH"] = "[FILE_PATH]";
  PlaybackCommand["LRAS"] = "[LRAS]";
  PlaybackCommand["PLAYBACK_START_FRAME"] = "[PLAYBACK_START_FRAME]";
  PlaybackCommand["GAME_END_FRAME"] = "[GAME_END_FRAME]";
  PlaybackCommand["PLAYBACK_END_FRAME"] = "[PLAYBACK_END_FRAME]";
  PlaybackCommand["CURRENT_FRAME"] = "[CURRENT_FRAME]";
  PlaybackCommand["NO_GAME"] = "[NO_GAME]";
})(PlaybackCommand || (PlaybackCommand = {}));
(function (DolphinPlaybackStatus) {
  DolphinPlaybackStatus["FILE_LOADED"] = "FILE_LOADED";
  DolphinPlaybackStatus["PLAYBACK_START"] = "PLAYBACK_START";
  DolphinPlaybackStatus["PLAYBACK_END"] = "PLAYBACK_END";
  DolphinPlaybackStatus["QUEUE_EMPTY"] = "QUEUE_EMPTY";
})(exports.DolphinPlaybackStatus || (exports.DolphinPlaybackStatus = {}));
const defaultBufferOptions = {
  startBuffer: 1,
  endBuffer: 1,
};
const PRE_FIRST_FRAME = slippiJs.Frames.FIRST - 1;
const initialGamePlaybackState = {
  gameEnded: false,
  forceQuit: false,
  currentFrame: PRE_FIRST_FRAME,
  lastGameFrame: PRE_FIRST_FRAME,
  startPlaybackFrame: PRE_FIRST_FRAME,
  endPlaybackFrame: PRE_FIRST_FRAME,
};
class DolphinOutput extends stream.Writable {
  constructor(bufferOptions, opts) {
    super(opts);
    this.streamEndedSource = new rxjs.Subject();
    this.playbackStatusSource = new rxjs.Subject();
    this.playbackStatus$ = this.playbackStatusSource.asObservable().pipe(takeUntil(this.streamEndedSource));
    this.buffers = Object.assign({}, defaultBufferOptions, bufferOptions);
    this.state = Object.assign({}, initialGamePlaybackState);
    // Complete all the observables
    this.on("finish", () => {
      this.streamEndedSource.next();
    });
  }
  setBuffer(bufferOptions) {
    this.buffers = Object.assign(this.buffers, bufferOptions);
  }
  _write(newData, encoding, callback) {
    if (encoding !== "buffer") {
      throw new Error(`Unsupported stream encoding. Expected 'buffer' got '${encoding}'.`);
    }
    // Process data here
    const dataString = newData.toString();
    const lines = dataString.split(os.EOL).filter((line) => Boolean(line));
    lines.forEach((line) => {
      const [command, value] = line.split(" ");
      this._processCommand(command, value);
    });
    callback();
  }
  _processCommand(command, val) {
    const value = parseInt(val);
    switch (command) {
      case PlaybackCommand.FILE_PATH:
        // We just started playing back a new file so we should reset the state
        this._resetState();
        this.playbackStatusSource.next({
          status: exports.DolphinPlaybackStatus.FILE_LOADED,
          data: {
            path: val,
          },
        });
        break;
      case PlaybackCommand.LRAS:
        this.state.forceQuit = true;
        break;
      case PlaybackCommand.CURRENT_FRAME:
        this._handleCurrentFrame(value);
        break;
      case PlaybackCommand.PLAYBACK_START_FRAME:
        this._handlePlaybackStartFrame(value);
        break;
      case PlaybackCommand.PLAYBACK_END_FRAME:
        this._handlePlaybackEndFrame(value);
        break;
      case PlaybackCommand.GAME_END_FRAME:
        this.state.lastGameFrame = value;
        break;
      case PlaybackCommand.NO_GAME:
        this._handleNoGame();
        break;
      default:
        console.error(`Unknown command ${command} with value ${val}`);
        break;
    }
  }
  _handleCurrentFrame(commandValue) {
    this.state.currentFrame = commandValue;
    if (this.state.currentFrame === this.state.startPlaybackFrame) {
      this.playbackStatusSource.next({
        status: exports.DolphinPlaybackStatus.PLAYBACK_START,
      });
    } else if (this.state.currentFrame === this.state.endPlaybackFrame) {
      this.playbackStatusSource.next({
        status: exports.DolphinPlaybackStatus.PLAYBACK_END,
        data: {
          gameEnded: this.state.gameEnded,
          forceQuit: this.state.forceQuit,
        },
      });
      this._resetState();
    }
  }
  _handlePlaybackStartFrame(commandValue) {
    // Ensure the start frame is at least bigger than the intital playback start frame
    this.state.startPlaybackFrame = Math.max(commandValue, commandValue + this.buffers.startBuffer);
  }
  _handlePlaybackEndFrame(commandValue) {
    this.state.endPlaybackFrame = commandValue;
    // Play the game until the end
    this.state.gameEnded = this.state.endPlaybackFrame >= this.state.lastGameFrame;
    // Ensure the adjusted frame is between the start and end frames
    const adjustedEndFrame = Math.max(
      this.state.startPlaybackFrame,
      this.state.endPlaybackFrame - this.buffers.endBuffer,
    );
    this.state.endPlaybackFrame = Math.min(adjustedEndFrame, this.state.lastGameFrame);
  }
  _handleNoGame() {
    this.playbackStatusSource.next({
      status: exports.DolphinPlaybackStatus.QUEUE_EMPTY,
    });
  }
  _resetState() {
    this.state = Object.assign({}, initialGamePlaybackState);
  }
}

// Configurable options
const defaultDolphinLauncherOptions = {
  dolphinPath: "",
  meleeIsoPath: "",
  batch: false,
  disableSeekBar: false,
  readEvents: true,
  startBuffer: 1,
  endBuffer: 1, // Match the start frame because why not
};
class DolphinLauncher {
  constructor(options) {
    this.dolphin = null;
    // Indicates whether dolphin is currently running or not
    this.dolphinRunningSource = new rxjs.BehaviorSubject(false);
    this.dolphinRunning$ = this.dolphinRunningSource.asObservable();
    this.options = Object.assign({}, defaultDolphinLauncherOptions, options);
    this.output = new DolphinOutput(this.options);
  }
  updateSettings(options) {
    this.options = Object.assign(this.options, options);
    this.output.setBuffer(this.options);
  }
  loadJSON(comboFilePath) {
    // Kill process if already running
    if (this.dolphin) {
      this.dolphin.kill();
      this.dolphin = null;
    }
    this.dolphin = this._startDolphin(comboFilePath);
    this.dolphin.on("exit", (exitCode) => {
      if (exitCode !== 0) {
        console.warn(`Dolphin terminated with exit code: ${exitCode}`);
      }
      this.dolphinRunningSource.next(false);
    });
    // Pipe to the dolphin output but don't end
    this.dolphin.stdout.pipe(this.output, { end: false });
    this.dolphinRunningSource.next(true);
  }
  _startDolphin(comboFilePath) {
    if (!this.options.dolphinPath) {
      throw new Error("Dolphin path is not set!");
    }
    const params = ["-i", comboFilePath];
    if (this.options.meleeIsoPath) {
      params.push("-e", this.options.meleeIsoPath);
    }
    if (this.options.readEvents) {
      params.push("--cout");
    }
    if (this.options.batch) {
      params.push("--batch");
    }
    if (this.options.disableSeekBar) {
      params.push("--hide-seekbar");
    }
    return child_process.spawn(this.options.dolphinPath, params);
  }
}

const defaultSettings = {
  shuffle: false,
  mode: "queue",
  replay: "",
  isRealTimeMode: false,
  outputOverlayFiles: true,
  startBuffer: 240,
  endBuffer: 180,
};
const generateDolphinQueue = (items, options) => {
  const opts = Object.assign({}, defaultSettings, options);
  const entries = opts.shuffle ? lodash.shuffle(items) : items;
  const queue = entries.map((entry) => mapDolphinEntry(entry, opts.startBuffer, opts.endBuffer));
  const dolphinQueue = {
    mode: opts.mode,
    replay: opts.replay,
    isRealTimeMode: opts.isRealTimeMode,
    outputOverlayFiles: opts.outputOverlayFiles,
    queue,
  };
  return dolphinQueue;
};
const generateDolphinQueuePayload = (items, options, prettify = true) => {
  const dolphinQueue = generateDolphinQueue(items, options);
  const spaces = prettify ? 2 : undefined;
  return JSON.stringify(dolphinQueue, undefined, spaces);
};
const mapDolphinEntry = (entry, startBuffer, endBuffer) => {
  const { combo, ...dolphinEntry } = entry;
  if (combo) {
    dolphinEntry.startFrame = Math.max(slippiJs.Frames.FIRST, combo.startFrame - startBuffer);
    // If endFrame is undefined it will just play to the end
    if (exists(combo.endFrame)) {
      dolphinEntry.endFrame = combo.endFrame + endBuffer;
    }
  }
  return dolphinEntry;
};

const forAllPlayerIndices = (func) => {
  return rxjs.merge(func(0), func(1), func(2), func(3));
};
const pipeFileContents = async (filename, destination, options) => {
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(filename);
    readStream.on("open", () => {
      readStream.pipe(destination, options);
    });
    readStream.on("close", () => {
      resolve();
    });
  });
};

/**
 * Given the last frame of the game, determine the winner first based on stock count
 * then based on remaining percent.
 * If percents are tied, return the player with the lower port number by default.
 *
 * @returns the player index of the winner
 */
const findWinner = (lastFrame) => {
  const postFrameEntries = Object.keys(lastFrame.players)
    .map((i) => {
      var _a;
      return (_a = lastFrame.players[i]) === null || _a === void 0 ? void 0 : _a.post;
    })
    .filter(exists);
  const winnerPostFrame = postFrameEntries.reduce((a, b) => {
    if (!exists(a.stocksRemaining) || !exists(b.stocksRemaining) || !exists(a.percent) || !exists(b.percent)) {
      return a;
    }
    // Determine winner based on stock count
    if (a.stocksRemaining > b.stocksRemaining) {
      return a;
    }
    if (a.stocksRemaining < b.stocksRemaining) {
      return b;
    }
    // Stocks are the same so determine winner based off remaining percent
    if (a.percent < b.percent) {
      return a;
    }
    if (a.percent > b.percent) {
      return b;
    }
    // Just return a by default
    return a;
  });
  return winnerPostFrame.playerIndex;
};

(function (ComboEvent) {
  ComboEvent["START"] = "combo-start";
  ComboEvent["EXTEND"] = "combo-extend";
  ComboEvent["END"] = "combo-occurred";
  ComboEvent["CONVERSION"] = "conversion-occurred";
})(exports.ComboEvent || (exports.ComboEvent = {}));
(function (GameEvent) {
  GameEvent["GAME_START"] = "game-start";
  GameEvent["GAME_END"] = "game-end";
})(exports.GameEvent || (exports.GameEvent = {}));
(function (InputEvent) {
  InputEvent["BUTTON_COMBO"] = "button-combo";
})(exports.InputEvent || (exports.InputEvent = {}));
(function (StockEvent) {
  StockEvent["PLAYER_SPAWN"] = "player-spawn";
  StockEvent["PLAYER_DIED"] = "player-died";
})(exports.StockEvent || (exports.StockEvent = {}));

const readComboConfig = (combo, config) => {
  const startObservables = config.events
    .filter((event) => event.type === exports.ComboEvent.START)
    .map((event) => {
      return handlePlayerIndexFilter(combo.start$, event, config.variables).pipe(
        map((payload) => ({
          id: event.id,
          type: event.type,
          payload,
        })),
      );
    });
  const extendObservables = config.events
    .filter((event) => event.type === exports.ComboEvent.EXTEND)
    .map((event) => {
      return handlePlayerIndexFilter(combo.extend$, event, config.variables).pipe(
        map((payload) => ({
          id: event.id,
          type: event.type,
          payload,
        })),
      );
    });
  const endObservables = config.events
    .filter((event) => event.type === exports.ComboEvent.END)
    .map((event) => {
      const base$ = handlePlayerIndexFilter(combo.end$, event, config.variables);
      return handleComboFilter(base$, event, config.variables).pipe(
        map((payload) => ({
          id: event.id,
          type: event.type,
          payload,
        })),
      );
    });
  const conversionObservables = config.events
    .filter((event) => event.type === exports.ComboEvent.CONVERSION)
    .map((event) => {
      const base$ = handlePlayerIndexFilter(combo.conversion$, event, config.variables);
      return handleComboFilter(base$, event, config.variables).pipe(
        map((payload) => ({
          id: event.id,
          type: event.type,
          payload,
        })),
      );
    });
  const observables = [...startObservables, ...extendObservables, ...endObservables, ...conversionObservables];
  return rxjs.merge(...observables);
};
const handlePlayerIndexFilter = (base$, event, variables) => {
  const eventFilter = event.filter;
  if (eventFilter && eventFilter.playerIndex) {
    const value = eventFilter.playerIndex;
    base$ = base$.pipe(filter((payload) => playerFilterMatches(payload.combo.playerIndex, value, variables)));
  }
  return base$;
};
/*
You can set the combo filter from:
- passing it directly as `comboCriteria` parameter in the filter
- setting it as a $ prefixed variable in the variables object and referencing
  that object as a string.
*/
const handleComboFilter = (base$, event, variables) => {
  const eventFilter = event.filter;
  let comboSettings = Object.assign({}, defaultComboFilterSettings);
  if (eventFilter && eventFilter.comboCriteria) {
    const options = eventFilter.comboCriteria;
    if (typeof options === "string") {
      if (options.charAt(0) === "$" && exists(variables) && variables[options]) {
        comboSettings = Object.assign(comboSettings, variables[options]);
      } else if (options === "none") {
        // Require explicit specification for no criteria matching
        return base$;
      }
    } else {
      comboSettings = Object.assign(comboSettings, options);
    }
  }
  return base$.pipe(filter((payload) => checkCombo(comboSettings, payload.combo, payload.settings)));
};

const readGameConfig = (game, config) => {
  return rxjs.merge(readGameStartEvents(config, game.start$), readGameEndEvents(config, game.end$));
};
const readGameStartEvents = (config, gameStart$) => {
  // Handle game start events
  const observables = config.events
    .filter((event) => event.type === exports.GameEvent.GAME_START)
    .map((event) => {
      let base$ = gameStart$;
      const eventFilter = event.filter;
      if (eventFilter) {
        // Handle num players filter
        if (eventFilter.numPlayers !== undefined) {
          base$ = base$.pipe(filter((settings) => settings.players.length === eventFilter.numPlayers));
        }
        if (eventFilter.isTeams !== undefined) {
          base$ = base$.pipe(filter((settings) => settings.isTeams === eventFilter.isTeams));
        }
      }
      return base$.pipe(
        map((context) => ({
          id: event.id,
          type: event.type,
          payload: context,
        })),
      );
    });
  return rxjs.merge(...observables);
};
const readGameEndEvents = (config, gameEnd$) => {
  // Handle game end events
  const observables = config.events
    .filter((event) => event.type === exports.GameEvent.GAME_END)
    .map((event) => {
      let base$ = gameEnd$;
      const eventFilter = event.filter;
      if (eventFilter) {
        // Handle end method filter
        if (eventFilter.endMethod !== undefined) {
          base$ = base$.pipe(filter((end) => end.gameEndMethod === eventFilter.endMethod));
        }
        const winner = eventFilter.winnerPlayerIndex;
        if (exists(winner)) {
          base$ = base$.pipe(
            filter((payload) => playerFilterMatches(payload.winnerPlayerIndex, winner, config.variables)),
          );
        }
      }
      return base$.pipe(
        map((context) => ({
          id: event.id,
          type: event.type,
          payload: context,
        })),
      );
    });
  return rxjs.merge(...observables);
};

/**
 * Filter the frames to only those that belong to the player {index}.
 */
function playerFrameFilter(index) {
  return (source) =>
    source.pipe(
      filter((frame) => {
        const playerIndices = Object.keys(frame.players);
        return playerIndices.includes(index.toString());
      }),
    );
}
/**
 * Return the previous frame of the game and the current frame
 */
function withPreviousFrame() {
  return (source) =>
    source.pipe(
      pairwise(), // We want both the latest frame and the previous frame
      filter(([{ frame: prevFrameNum }, { frame: latestFrameNum }]) => {
        return exists(prevFrameNum) && exists(latestFrameNum) && latestFrameNum > prevFrameNum;
      }),
    );
}
/**
 * Return the previous frame of the game and the current frame
 */
function filterOnlyFirstFrame() {
  return (source) => source.pipe(filter((frame) => frame.frame === slippiJs.Frames.FIRST));
}

/**
 * Throttle inputs for a number of frames
 */
function throttleInputButtons(frames) {
  return (source) =>
    source.pipe(
      distinctUntilChanged((prev, curr) => {
        // Should we discard this value?
        // Discard if the current frame is still within the lockout duration
        return curr.frame < prev.frame + frames;
      }),
    );
}
function mapFramesToButtonInputs(index, buttons, duration = 1) {
  const controlBitMask = generateInputBitmask(...buttons);
  return (source) =>
    source.pipe(
      // Filter for the specific player
      playerFrameFilter(index),
      // Map the frames to whether the button combination was pressed or not
      // while tracking the frame number
      map((f) => {
        var _a;
        const buttonCombo = (_a = f.players[index]) === null || _a === void 0 ? void 0 : _a.pre.physicalButtons;
        if (!exists(buttonCombo)) {
          return null;
        }
        const buttonComboPressed = (buttonCombo & controlBitMask) === controlBitMask;
        return {
          frame: f.frame,
          buttonPressed: buttonComboPressed,
          buttonCombo: bitmaskToButtons(buttonCombo),
        };
      }),
      filter(exists),
      // Count the number of consecutively pressed frames
      scan(
        (acc, data) => {
          const count = data.buttonPressed ? acc.count + 1 : 0;
          return {
            count,
            frame: data.frame,
            buttonCombo: data.buttonCombo,
          };
        },
        {
          count: 0,
          frame: slippiJs.Frames.FIRST,
          buttonCombo: [],
        },
      ),
      // Filter to be the exact frame when we pressed the combination for sufficient frames
      filter((n) => n.count === duration),
      // Return the player index which triggered the button press
      map((data) => ({
        playerIndex: index,
        combo: data.buttonCombo,
        frame: data.frame,
        duration,
      })),
    );
}

/**
 * Return the previous frame of the game and the current frame
 */
function pausable(stop, restart) {
  return (source) =>
    source.pipe(
      takeUntil(stop),
      repeatWhen(() => restart),
    );
}

/**
 * Filter only the frames where the player has just spawned
 */
function filterJustSpawned(playerIndex) {
  return (source$) => {
    const initialSpawn$ = source$.pipe(playerFrameFilter(playerIndex), filterOnlyFirstFrame());
    const normalSpawns$ = source$.pipe(
      playerFrameFilter(playerIndex),
      withPreviousFrame(), // Get previous frame too
      filter(([prevFrame, latestFrame]) => {
        var _a, _b, _c, _d;
        const prevActionState =
          (_b = (_a = prevFrame.players[playerIndex]) === null || _a === void 0 ? void 0 : _a.post.actionStateId) !==
            null && _b !== void 0
            ? _b
            : null;
        const currActionState =
          (_d = (_c = latestFrame.players[playerIndex]) === null || _c === void 0 ? void 0 : _c.post.actionStateId) !==
            null && _d !== void 0
            ? _d
            : null;
        if (prevActionState === null || currActionState === null) {
          return false;
        }
        // We only care about the frames where we just spawned
        return slippiJs.isDead(prevActionState) && !slippiJs.isDead(currActionState);
      }),
      map(([_, latestFrame]) => latestFrame),
    );
    return rxjs.merge(initialSpawn$, normalSpawns$);
  };
}
/**
 * Filter only the frames where the player has just spawned
 */
// export function filterJustDied(playerIndex: number): MonoTypeOperatorFunction<FrameEntryType> {
//   return (source$): Observable<FrameEntryType> => {
//     return source$.pipe(
//       playerFilter(playerIndex),
//       withPreviousFrame(),                  // Get previous frame too
//       filter(([prevFrame, latestFrame]) => {
//         const prevPostFrame = prevFrame.players[playerIndex].post;
//         const currPostFrame = latestFrame.players[playerIndex].post;
//         // We only care about the frames where we just spawned
//         return didLoseStock(currPostFrame, prevPostFrame);
//       }),
//       map(([_, latestFrame]) => latestFrame),
//     );
//   }
// }
function mapFrameToSpawnStockType(settings$, playerIndex) {
  return (source) =>
    source.pipe(
      withLatestFrom(settings$),
      map(([frame, settings]) => {
        const player = settings.players.find((player) => player.playerIndex === playerIndex);
        if (!player || !exists(frame.frame) || !exists(frame.stocksRemaining)) {
          return null;
        }
        const stock = {
          playerIndex: player.playerIndex,
          startFrame: frame.frame,
          endFrame: null,
          startPercent: 0,
          endPercent: null,
          currentPercent: 0,
          count: frame.stocksRemaining,
          deathAnimation: null,
        };
        return stock;
      }),
      filter(exists),
    );
}
function mapFramesToDeathStockType(playerSpawned$) {
  return (source) =>
    source.pipe(
      withLatestFrom(playerSpawned$),
      map(([[prevPlayerFrame, playerFrame], spawnStock]) => {
        var _a, _b;
        return {
          ...spawnStock,
          endFrame: playerFrame.frame,
          endPercent: (_a = prevPlayerFrame.percent) !== null && _a !== void 0 ? _a : 0,
          currentPercent: (_b = prevPlayerFrame.percent) !== null && _b !== void 0 ? _b : 0,
          deathAnimation: playerFrame.actionStateId,
        };
      }),
    );
}

const readInputsConfig = (inputs, config) => {
  return readButtonComboEvents(config, (buttons, duration) => inputs.buttonCombo(buttons, duration));
};
const readButtonComboEvents = (eventConfig, playerInput) => {
  // Handle game start events
  const observables = eventConfig.events
    .filter(filterValidButtonCombo) // We must have a valid filter
    .map((event) => {
      let duration = 1;
      if (exists(event.filter.duration) && event.filter.duration > 1) {
        duration = Math.floor(event.filter.duration);
      }
      let base$ = playerInput(event.filter.combo, duration);
      if (event.filter) {
        // Handle num players filter
        if (event.filter.playerIndex !== undefined) {
          base$ = base$.pipe(playerFilter(event.filter.playerIndex, eventConfig.variables));
        }
      }
      return base$.pipe(
        map((context) => ({
          id: event.id,
          type: event.type,
          payload: context,
        })),
      );
    });
  return rxjs.merge(...observables);
};
function filterValidButtonCombo(event) {
  return (
    event.type === exports.InputEvent.BUTTON_COMBO &&
    exists(event.filter) &&
    event.filter.combo &&
    event.filter.combo.length > 0
  ); // We must have a valid filter
}

const readStocksConfig = (stocks, config) => {
  return rxjs.merge(
    readPlayerSpawnEvents(config, stocks.playerSpawn$),
    readPlayerDiedEvents(config, stocks.playerDied$),
  );
};
const readPlayerSpawnEvents = (eventConfig, playerSpawn$) => {
  // Handle game start events
  const observables = eventConfig.events
    .filter((event) => event.type === exports.StockEvent.PLAYER_SPAWN)
    .map((event) => {
      let base$ = playerSpawn$;
      const eventFilter = event.filter;
      if (eventFilter && exists(eventFilter.playerIndex)) {
        // Handle num players filter
        for (const filterOption of Object.keys(eventFilter)) {
          switch (filterOption) {
            case "playerIndex":
              base$ = base$.pipe(playerFilter(eventFilter.playerIndex, eventConfig.variables));
              break;
          }
        }
      }
      return base$.pipe(
        map((context) => ({
          id: event.id,
          type: event.type,
          payload: context,
        })),
      );
    });
  return rxjs.merge(...observables);
};
const readPlayerDiedEvents = (eventConfig, playerDied$) => {
  // Handle game end events
  const observables = eventConfig.events
    .filter((event) => event.type === exports.StockEvent.PLAYER_DIED)
    .map((event) => {
      const eventFilter = event.filter;
      let base$ = playerDied$;
      if (eventFilter) {
        // Handle num players filter
        if (eventFilter.playerIndex !== undefined) {
          base$ = base$.pipe(playerFilter(eventFilter.playerIndex, eventConfig.variables));
        }
      }
      return base$.pipe(
        map((context) => ({
          id: event.id,
          type: event.type,
          payload: context,
        })),
      );
    });
  return rxjs.merge(...observables);
};

class EventManager {
  constructor(realtime) {
    this.config$ = new rxjs.ReplaySubject();
    this.realtime = realtime;
    this.events$ = this.setupSubscriptions();
  }
  updateConfig(config) {
    this.config$.next(config);
  }
  setupSubscriptions() {
    return this.config$.pipe(
      switchMap((config) => {
        return rxjs.merge(
          readGameConfig(this.realtime.game, config),
          readInputsConfig(this.realtime.input, config),
          readStocksConfig(this.realtime.stock, config),
          readComboConfig(this.realtime.combo, config),
        );
      }),
    );
  }
}

class ConversionEvents {
  constructor(stream) {
    this.conversionComputer = new slippiJs.ConversionComputer();
    this.end$ = rxjs.fromEvent(this.conversionComputer, "CONVERSION").pipe(share());
    this.stream$ = stream;
    // Reset the state on game start
    this.stream$.pipe(switchMap((s) => s.gameStart$)).subscribe((settings) => {
      this.conversionComputer.setup(settings);
    });
    // Handle the frame processing
    this.stream$
      .pipe(
        switchMap((s) => s.allFrames$),
        // We only want the frames for two player games
        filter(({ latestFrame }) => {
          const players = Object.keys(latestFrame.players);
          return players.length === 2;
        }),
      )
      .subscribe(({ latestFrame, allFrames }) => {
        this.conversionComputer.processFrame(latestFrame, allFrames);
      });
  }
}

class ComboEvents {
  constructor(stream) {
    this.comboComputer = new slippiJs.ComboComputer();
    this.start$ = rxjs.fromEvent(this.comboComputer, "COMBO_START").pipe(share());
    this.extend$ = rxjs.fromEvent(this.comboComputer, "COMBO_EXTEND").pipe(share());
    this.end$ = rxjs.fromEvent(this.comboComputer, "COMBO_END").pipe(share());
    this.stream$ = stream;
    const conversionEvents = new ConversionEvents(stream);
    this.conversion$ = conversionEvents.end$;
    // Reset the state on game start
    this.stream$.pipe(switchMap((s) => s.gameStart$)).subscribe((settings) => {
      this.comboComputer.setup(settings);
    });
    // Handle the frame processing
    this.stream$
      .pipe(
        switchMap((s) => s.allFrames$),
        // We only want the frames for two player games
        filter(({ latestFrame }) => {
          const players = Object.keys(latestFrame.players);
          return players.length === 2;
        }),
      )
      .subscribe(({ allFrames, latestFrame }) => {
        this.comboComputer.processFrame(latestFrame, allFrames);
      });
  }
}

class GameEvents {
  constructor(stream) {
    this.stream$ = stream;
    this.start$ = this.stream$.pipe(switchMap((s) => s.gameStart$));
    this.end$ = this.stream$.pipe(
      switchMap((s) =>
        s.gameEnd$.pipe(
          withLatestFrom(s.playerFrame$),
          map(([gameEnd, playerFrame]) => ({
            ...gameEnd,
            winnerPlayerIndex: findWinner(playerFrame),
            lastFrame: playerFrame,
          })),
        ),
      ),
    );
    this.rawFrames$ = forAllPlayerIndices((index) => {
      return this.stream$.pipe(
        switchMap((stream) => stream.playerFrame$),
        playerFrameFilter(index),
      );
    });
  }
}

class InputEvents {
  constructor(stream) {
    this.stream$ = stream;
  }
  buttonCombo(buttons, duration) {
    return forAllPlayerIndices((i) => this.playerIndexButtonCombo(i, buttons, duration));
  }
  /**
   * Returns an observable which emits when `buttons` is held for `duration` number of frames.
   *
   * @param {number} index The player index
   * @param {number} buttons The button combination
   * @param {number} duration The number of frames the buttons were held for
   * @returns {Observable<number>}
   * @memberof InputEvents
   */
  playerIndexButtonCombo(index, buttons, duration = 1) {
    return this.stream$.pipe(
      // Get the player frames
      switchMap((stream) => stream.playerFrame$),
      // Map the frames to button inputs
      mapFramesToButtonInputs(index, buttons, duration),
    );
  }
}

class StockEvents {
  constructor(stream) {
    this.stream$ = stream;
    this.playerSpawn$ = forAllPlayerIndices((i) => this.playerIndexSpawn(i));
    this.playerDied$ = forAllPlayerIndices((i) => this.playerIndexDied(i));
    this.percentChange$ = forAllPlayerIndices((i) => this.playerIndexPercentChange(i));
    this.countChange$ = forAllPlayerIndices((i) => this.playerIndexStockCountChange(i));
  }
  /**
   * Emits an event each time player spawns.
   */
  playerIndexSpawn(index) {
    return this.stream$.pipe(
      switchMap((stream) =>
        stream.playerFrame$.pipe(
          filterJustSpawned(index), // Only take the spawn frames
          map((f) => {
            var _a;
            return (_a = f.players[index]) === null || _a === void 0 ? void 0 : _a.post;
          }), // Only take the post frame data
          filter(exists),
          mapFrameToSpawnStockType(stream.gameStart$, index),
        ),
      ),
    );
  }
  /**
   * Emits an event each time player dies.
   */
  playerIndexDied(index) {
    return this.stream$.pipe(
      switchMap((stream) => stream.playerFrame$),
      playerFrameFilter(index), // We only care about certain player frames
      map((f) => {
        var _a;
        return (_a = f.players[index]) === null || _a === void 0 ? void 0 : _a.post;
      }), // Only take the post frame data
      filter(exists),
      withPreviousFrame(), // Get previous frame too
      filter(([prevFrame, latestFrame]) => slippiJs.didLoseStock(latestFrame, prevFrame)),
      mapFramesToDeathStockType(this.playerIndexSpawn(index)),
    );
  }
  playerIndexPercentChange(index) {
    return this.stream$.pipe(
      switchMap((stream) => stream.playerFrame$),
      playerFrameFilter(index),
      map((f) => {
        var _a;
        return (_a = f.players[index]) === null || _a === void 0 ? void 0 : _a.post.percent;
      }),
      filter(exists),
      distinctUntilChanged(),
      map((percent) => ({
        playerIndex: index,
        percent,
      })),
    );
  }
  playerIndexStockCountChange(index) {
    return this.stream$.pipe(
      switchMap((stream) => stream.playerFrame$),
      playerFrameFilter(index),
      map((f) => {
        var _a;
        return (_a = f.players[index]) === null || _a === void 0 ? void 0 : _a.post.stocksRemaining;
      }),
      filter(exists),
      distinctUntilChanged(),
      map((stocksRemaining) => ({
        playerIndex: index,
        stocksRemaining,
      })),
    );
  }
}

/**
 * SlpRealTime is solely responsible for detecting notable in-game events
 * and emitting an appropriate event.
 *
 * @export
 * @class SlpRealTime
 * @extends {EventEmitter}
 */
class SlpRealTime {
  constructor() {
    this.stream$ = new rxjs.ReplaySubject();
    this.game = new GameEvents(this.stream$);
    this.stock = new StockEvents(this.stream$);
    this.input = new InputEvents(this.stream$);
    this.combo = new ComboEvents(this.stream$);
  }
  /**
   * Starts listening to the provided stream for Slippi events
   *
   * @param {SlpStream} stream
   * @memberof SlpRealTime
   */
  setStream(stream) {
    this.stream$.next(stream);
  }
}

/**
 * SlpStream is a writable stream of Slippi data. It passes the data being written in
 * and emits an event based on what kind of Slippi messages were processed.
 *
 * @class SlpStream
 * @extends {Writable}
 */
class RxSlpStream extends slippiJs.SlpFileWriter {
  /**
   *Creates an instance of SlpStream.
   * @param {Partial<SlpStreamSettings>} [slpOptions]
   * @param {WritableOptions} [opts]
   * @memberof SlpStream
   */
  constructor(options, opts) {
    super(
      {
        ...options,
        outputFiles: options && options.outputFiles === true, // Don't write out files unless manually specified
      },
      opts,
    );
    this.parser = new slippiJs.SlpParser({ strict: true }); // Strict mode will enable data validation
    this.messageSizeSource = new rxjs.Subject();
    this.allFrames = {};
    // Observables
    this.messageSize$ = this.messageSizeSource.asObservable();
    this.gameStart$ = rxjs.fromEvent(this.parser, slippiJs.SlpParserEvent.SETTINGS).pipe(share());
    this.playerFrame$ = rxjs.fromEvent(this.parser, slippiJs.SlpParserEvent.FINALIZED_FRAME).pipe(share());
    this.gameEnd$ = rxjs.fromEvent(this.parser, slippiJs.SlpParserEvent.END).pipe(share());
    this.allFrames$ = this.playerFrame$.pipe(
      // Run this side effect first so we can update allFrames
      tap((latestFrame) => {
        const frameNum = latestFrame.frame;
        this.allFrames[frameNum] = latestFrame;
      }),
      map((latestFrame) => {
        return {
          allFrames: this.allFrames,
          latestFrame,
        };
      }),
    );
    this.on(slippiJs.SlpStreamEvent.COMMAND, (data) => {
      const { command, payload } = data;
      switch (command) {
        case slippiJs.Command.MESSAGE_SIZES:
          this.parser.reset();
          this.messageSizeSource.next(payload);
          break;
      }
      try {
        this.parser.handleCommand(command, payload);
      } catch (err) {
        console.error(`Error processing command ${command}: ${err}`);
      }
    });
  }
  restart() {
    this.parser.reset();
    super.restart();
    this.allFrames = {};
  }
}

/**
 * SlpFolderStream is responsible for monitoring a folder, and detecting
 * when a new SLP file is created and is written to. This creates
 * essentially a fake live-stream by reading the SLP file as it's
 * still being written to.
 *
 * Typically when you detect changes to a file that is still being written
 * to, you want to include a timeout where if the file isn't changed within
 * that timeout, you consider it "done" and stop checking it. However, since
 * players can pause Slippi games for an indefinite amount of time, we don't
 * want to timeout since the file might still continue to be written to. So to achieve
 * this, we use the package `tailstream` where we have to manually call `done()`
 * when we no longer anticipate the file to change.
 *
 * @extends {RxSlpStream}
 */
class SlpFolderStream extends RxSlpStream {
  constructor(options, opts) {
    super({ ...options, mode: slippiJs.SlpStreamMode.MANUAL }, opts);
    this.stopRequested$ = new rxjs.Subject();
    this.newFile$ = new rxjs.BehaviorSubject(null);
    this.readStream = null;
    this.fileWatcher = null;
    this._setupSubjects();
  }
  _setupSubjects() {
    // Handle what happens when we detect a new file
    this.newFile$.subscribe((filePath) => {
      // Filepath can be null if it's not subscription hasn't started
      if (!filePath) {
        return;
      }
      this.endReadStream();
      // Restart the parser before we begin
      super.restart();
      this.readStream = tailstream.createReadStream(filePath);
      this.readStream.pipe(this, { end: false });
    });
  }
  endReadStream() {
    if (this.readStream) {
      this.readStream.unpipe(this);
      this.readStream.done();
      this.readStream = null;
    }
  }
  stopFileWatcher() {
    if (this.fileWatcher) {
      this.fileWatcher.close();
      this.fileWatcher = null;
    }
  }
  /**
   * Starts watching a particular folder for slp files. It treats all new
   * `.slp` files as though it's a live Slippi stream.
   *
   * @param {string} slpFolder
   * @memberof SlpFolderStream
   */
  async start(slpFolder, options) {
    // Clean up any existing streams
    this.stopFileWatcher();
    this.endReadStream();
    // Initialize watcher.
    const subFolderGlob = (options === null || options === void 0 ? void 0 : options.includeSubfolders) ? "**" : "";
    const slpGlob = path.join(slpFolder, subFolderGlob, "*.slp");
    const watcher = chokidar.watch(slpGlob, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true,
      ignorePermissionErrors: true,
    });
    // Wait until the watcher is actually ready
    await new Promise((resolve) => watcher.once("ready", resolve));
    // Set up the new file listener
    watcher.on("add", (filename) => {
      this.newFile$.next(filename);
    });
    this.fileWatcher = watcher;
  }
  stop() {
    this.stopFileWatcher();
    this.endReadStream();
    this.stopRequested$.next();
  }
  /**
   * Returns the latest created file that was found by folder monitoring.
   */
  latestFile() {
    return this.newFile$.value;
  }
}

const SLIPPI_CONNECTION_TIMEOUT_MS = 5000;
/**
 * SlpLiveStream connects to a Wii or Slippi relay and parses all the data
 * and emits SlpStream events.
 *
 * @export
 * @class SlpLiveStream
 * @extends {SlpFileWriter}
 */
class SlpLiveStream extends RxSlpStream {
  constructor(connectionType, options, opts) {
    super(options, opts);
    if (connectionType === "dolphin") {
      this.connection = new slippiJs.DolphinConnection();
    } else {
      this.connection = new slippiJs.ConsoleConnection();
    }
    this.connection.on(slippiJs.ConnectionEvent.HANDSHAKE, (data) => {
      this.updateSettings({ consoleNickname: data.consoleNickname });
    });
    this.connection.on(slippiJs.ConnectionEvent.DATA, (data) => {
      this.write(data);
    });
  }
  /**
   * Connect to a Wii or Slippi relay on the specified address and port.
   *
   * @param {string} address The address of the Wii or Slippi relay
   * @param {number} port The port of the Wii or Slippi relay
   * @returns {Promise<void>}
   * @memberof SlpLiveStream
   */
  async start(address, port) {
    const assertConnected = new Promise((resolve, reject) => {
      // Attach the statusChange handler before we initiate the connection
      const onStatusChange = (status) => {
        // We only care about the connected and disconnected statuses
        if (status !== slippiJs.ConnectionStatus.CONNECTED && status !== slippiJs.ConnectionStatus.DISCONNECTED) {
          return;
        }
        this.connection.removeListener(slippiJs.ConnectionEvent.STATUS_CHANGE, onStatusChange);
        // Complete the promise
        switch (status) {
          case slippiJs.ConnectionStatus.CONNECTED:
            resolve();
            break;
          case slippiJs.ConnectionStatus.DISCONNECTED:
            reject(new Error(`Failed to connect to: ${address}:${port}`));
            break;
        }
      };
      this.connection.on(slippiJs.ConnectionEvent.STATUS_CHANGE, onStatusChange);
      try {
        // Actually try to connect
        this.connection.connect(address, port);
      } catch (err) {
        reject(err);
      }
    });
    return promiseTimeout(SLIPPI_CONNECTION_TIMEOUT_MS, assertConnected);
  }
}
/**
 * Returns either the promise resolved or a rejection after a specified timeout.
 */
const promiseTimeout = (ms, promise) => {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out after ${ms}ms.`));
    }, ms);
  });
  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};

Object.defineProperty(exports, "Character", {
  enumerable: true,
  get: function () {
    return slippiJs.Character;
  },
});
Object.defineProperty(exports, "ConnectionEvent", {
  enumerable: true,
  get: function () {
    return slippiJs.ConnectionEvent;
  },
});
Object.defineProperty(exports, "ConnectionStatus", {
  enumerable: true,
  get: function () {
    return slippiJs.ConnectionStatus;
  },
});
Object.defineProperty(exports, "ConsoleConnection", {
  enumerable: true,
  get: function () {
    return slippiJs.ConsoleConnection;
  },
});
Object.defineProperty(exports, "Frames", {
  enumerable: true,
  get: function () {
    return slippiJs.Frames;
  },
});
Object.defineProperty(exports, "SlpStreamEvent", {
  enumerable: true,
  get: function () {
    return slippiJs.SlpStreamEvent;
  },
});
Object.defineProperty(exports, "SlpStreamMode", {
  enumerable: true,
  get: function () {
    return slippiJs.SlpStreamMode;
  },
});
Object.defineProperty(exports, "Stage", {
  enumerable: true,
  get: function () {
    return slippiJs.Stage;
  },
});
exports.ALL_CRITERIA = ALL_CRITERIA;
exports.ComboDidKill = ComboDidKill;
exports.ComboFilter = ComboFilter;
exports.DolphinLauncher = DolphinLauncher;
exports.DolphinOutput = DolphinOutput;
exports.EventManager = EventManager;
exports.ExcludesCPUs = ExcludesCPUs;
exports.ExcludesChainGrabs = ExcludesChainGrabs;
exports.ExcludesLargeSingleHit = ExcludesLargeSingleHit;
exports.ExcludesWobbles = ExcludesWobbles;
exports.IsOneVsOne = IsOneVsOne;
exports.MatchesCharacter = MatchesCharacter;
exports.MatchesPlayerName = MatchesPlayerName;
exports.MatchesPortNumber = MatchesPortNumber;
exports.RxSlpStream = RxSlpStream;
exports.SatisfiesMinComboLength = SatisfiesMinComboLength;
exports.SatisfiesMinComboPercent = SatisfiesMinComboPercent;
exports.SlpFolderStream = SlpFolderStream;
exports.SlpLiveStream = SlpLiveStream;
exports.SlpRealTime = SlpRealTime;
exports.UnknownMove = UnknownMove;
exports.bitmaskToButtons = bitmaskToButtons;
exports.checkCombo = checkCombo;
exports.defaultComboFilterSettings = defaultComboFilterSettings;
exports.extractPlayerNames = extractPlayerNames;
exports.extractPlayerNamesByPort = extractPlayerNamesByPort;
exports.filterJustSpawned = filterJustSpawned;
exports.filterOnlyFirstFrame = filterOnlyFirstFrame;
exports.findWinner = findWinner;
exports.forAllPlayerIndices = forAllPlayerIndices;
exports.generateDolphinQueue = generateDolphinQueue;
exports.generateDolphinQueuePayload = generateDolphinQueuePayload;
exports.generateInputBitmask = generateInputBitmask;
exports.getAllCharacters = getAllCharacters;
exports.getCharacterColorName = getCharacterColorName;
exports.getCharacterInfo = getCharacterInfo;
exports.getCharacterName = getCharacterName;
exports.getCharacterShortName = getCharacterShortName;
exports.getMoveInfo = getMoveInfo;
exports.getMoveName = getMoveName;
exports.getMoveShortName = getMoveShortName;
exports.getStageInfo = getStageInfo;
exports.getStageName = getStageName;
exports.getStageShortName = getStageShortName;
exports.mapFrameToSpawnStockType = mapFrameToSpawnStockType;
exports.mapFramesToButtonInputs = mapFramesToButtonInputs;
exports.mapFramesToDeathStockType = mapFramesToDeathStockType;
exports.namesMatch = namesMatch;
exports.pausable = pausable;
exports.pipeFileContents = pipeFileContents;
exports.playerFilter = playerFilter;
exports.playerFilterMatches = playerFilterMatches;
exports.playerFrameFilter = playerFrameFilter;
exports.throttleInputButtons = throttleInputButtons;
exports.withPreviousFrame = withPreviousFrame;
