(function(host) {

  function Mock(expectations, name) {
    var self = this;

    this.expectations = copy(expectations);
    this.name = name;
    this.beingReplayed = [];

    this.expectations.forEach(function(expectation) {
      self[expectation.methodName] = function() {
        return host.SimpleMocks.Expectations.checkMethodCalled(self, expectation.methodName, [].slice.call(arguments, 0));
      };
    });
    host.SimpleMocks.replay(this);
  }

  function copy(expectations) {
    return expectations.map(function(expectation) {
      var expectationCopy = new host.SimpleMocks.Expectation();

      expectationCopy.expectMethod(expectation.methodName)
        .expectTimes(expectation.times, expectation.timesQuantifier);

      if (expectation.args) {
        expectationCopy.expectArguments(expectation.args);
      }
      expectationCopy.andReturn(expectation.returnValue);
      //TODO: andThrows
      return expectationCopy;
    });
  }

  host.SimpleMocks.Mock = Mock;
})(this);