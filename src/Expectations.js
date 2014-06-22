(function(host) {

  var TIMES = {
    EXACTLY: "exactly",
    AT_LEAST: "at least",
    NO_MORE_THAN: "no more than"
  };

  /*
   * Expectations
   */
  function Expectation() {
    this.methodName = null;
    this.args = null;
    this.argumentMatchers = null;
    this.returnValue = (void 0);
    this.times = 1;
    this.timesQuantifier = TIMES.EXACTLY;
    this.calledTimes = 0;
  }

  Expectation.prototype.expectMethod = function(methodName) {
    this.methodName = methodName;
    return this;
  };

  Expectation.prototype.expectArguments = function(args) {
    this.args = args;
    this.argumentMatchers = this.args.map(function(arg) {
      return (arg instanceof host.SimpleMocks.Matchers.Matcher) ? arg : new host.SimpleMocks.Matchers.ValueMatcher(arg);
    });
    return this;
  };

  Expectation.prototype.expectTimes = function(times, timesQuantifier) {
    this.times = times;
    this.timesQuantifier = timesQuantifier;
    return this;
  };

  Expectation.prototype.reset = function() {
    this.calledTimes = 0;
  };

  Expectation.prototype.toString = function() {
    var message = "method '" + this.methodName  + "'";

    if (this.argumentMatchers) {
      message = message + " with arguments '" + this.argumentMatchers + "'";
    }
    if (this.times > 1) {
      message = message + ", " + this.timesQuantifier + " "
        + this.times + " times, called " + this.calledTimes + " time(s)";
    }
    return message;
  };

  Expectation.prototype.canSkipCheck = function() {
    var reachedAtLeastLimit = (this.timesQuantifier == TIMES.AT_LEAST) && (this.calledTimes == this.times);
    var didNotReachNoMoreThanLimit = (this.timesQuantifier == TIMES.NO_MORE_THAN) && (this.calledTimes < this.times);

    return reachedAtLeastLimit || didNotReachNoMoreThanLimit;
  };

  Expectation.prototype.canBeOmitted = function() {
    return (this.calledTimes <= this.times) && (this.timesQuantifier == TIMES.NO_MORE_THAN);
  }

  Expectation.prototype.isExpectedMore = function() {
    return (this.calledTimes < this.times)
      || ((this.calledTimes == this.times) && (this.timesQuantifier == TIMES.AT_LEAST));
  };

  Expectation.prototype.raiseWrongMethodNameProvided = function(mock, methodName) {
    host.SimpleMocks.Util.raiseMockError(mock, "Expected method '" + this.methodName
      + "' but method '" + methodName + "' was called. " + host.SimpleMocks.Util.unmetExpectationsMessage(mock));
  };

  Expectation.prototype.raiseWrongArgumentsProvided = function(mock, methodName, args) {
    host.SimpleMocks.Util.raiseMockError(mock, "Wrong arguments provided to '" + methodName + "', "
      + "expected '" + this.argumentMatchers + "' but was '" + arrayToString(args) + "'. " 
      + host.SimpleMocks.Util.unmetExpectationsMessage(mock));
  };

  Expectation.prototype.match = function(mock, methodName, args) {
    var self = this;
    var canSkipCheck = this.canSkipCheck();
    var matched = true;

    if (methodName != this.methodName) {
      if (!canSkipCheck) {
        this.raiseWrongMethodNameProvided(mock, methodName);
      } else {
        matched = false;
      }
    }

    if (this.argumentMatchers) {
      if (this.argumentMatchers.length != args.length) {
        if (!canSkipCheck) {
          this.raiseWrongArgumentsProvided(mock, methodName, args);
        } else {
          matched = false;
        }
      }
      this.argumentMatchers.forEach(function(argumentMatcher, idx) {
        if (!argumentMatcher.matches(args[idx])) {
          if (!canSkipCheck) {
            self.raiseWrongArgumentsProvided(mock, methodName, args);
          } else {
            matched = false;
          }
        }
      });
    }
    if (matched) {
      this.calledTimes++;
    }
    return matched;
  };

  function Expectations() {
    this.expectations = [];
    this.currentExpectation = null;
  }

  Expectations.prototype.flush = function() {
    if (this.currentExpectation) {
      this.expectations.push(this.currentExpectation);
      this.currentExpectation = null;
    }
  }

  Expectations.prototype.expect = function(methodName) {
    this.flush();
    this.currentExpectation = new Expectation();
    this.currentExpectation.expectMethod(methodName);
    return this;
  };

  Expectations.prototype.times = function(times) {
    this.currentExpectation.expectTimes(times, TIMES.EXACTLY);
    return this;
  };

  Expectations.prototype.timesAtLeast = function(times) {
    this.currentExpectation.expectTimes(times, TIMES.AT_LEAST);
    return this;
  };

  Expectations.prototype.timesNoMoreThan = function(times) {
    this.currentExpectation.expectTimes(times, TIMES.NO_MORE_THAN);
    return this;
  };

  Expectations.prototype.with = function() {
    if (!this.currentExpectation) {
      throw new Error("No matching 'expect' found for last 'with'");
    }
    this.currentExpectation.expectArguments([].slice.call(arguments, 0));
    return this;
  };

  Expectations.prototype.noArguments = function() {
    return this.with();
  };

  Expectations.prototype.mock = function(name) {
    this.flush();
    return new host.SimpleMocks.Mock(this.expectations, name);
  };

  Expectations.checkMethodCalled = function(mock, methodName, methodArgs) {
    var expectations = mock.beingReplayed;

    if (expectations.length == 0) {
      throw new Error("Unexpected method invokation '" + methodName + "'. "
        + host.SimpleMocks.Util.unmetExpectationsMessage(mock));
    }

    var currentExpectation = expectations[0];

    var matched = currentExpectation.match(mock, methodName, methodArgs);

    while (!matched) {
      expectations.shift();
      currentExpectation = expectations[0];
      matched = currentExpectation.match(mock, methodName, methodArgs);
    }

    if (!currentExpectation.isExpectedMore()) {
      expectations.shift();
    }

    return currentExpectation.returnValue;
  };

  function arrayToString(arr) {
    return arr.map(function(element) {
      return "" + ((element instanceof Array) ? "[" + element + "]" : element);
    });
  }

  host.SimpleMocks.Expectation = Expectation;
  host.SimpleMocks.Expectations = Expectations;
})(this);