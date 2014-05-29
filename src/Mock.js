(function(host) {

  function Mock(expectations, name) {
    var self = this;

    this.expectations = host.SimpleMocks.Expectations.copy(expectations);
    this.name = name;
    this.beingReplayed = [];

    this.expectations.forEach(function(expectation) {
      self[expectation.methodName] = function() {
        return host.SimpleMocks.Expectations.checkMethodCalled(self, expectation.methodName, [].slice.call(arguments, 0));
      };
    });
    host.SimpleMocks.replay(this);
  }

  host.SimpleMocks.Mock = Mock;
})(this);
