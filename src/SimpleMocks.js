(function(host) {

  function verifyMock(mock) {
    var remainingExpectations = mock.beingReplayed.filter(function(expectation) {
      return !expectation.canBeOmitted();
    });
    if (remainingExpectations.length > 0) {
      host.SimpleMocks.Util.raiseMockError(mock, host.SimpleMocks.Util.unmetExpectationsMessage(mock));
    }
  }

  function replayMock(mock) {
    mock.expectations.forEach(function(expectation) {
      expectation.reset();
    });
    mock.beingReplayed = mock.expectations.slice(0);
  }

  function performMockAction(action, args) {
    var mocks = (args[0] instanceof Array) ? args[0] : args;

    mocks.forEach(function(mock) {
      action(mock);
    });
  }

  function SimpleMocks() {
  }

  SimpleMocks.expectations = function() {
    return new host.SimpleMocks.Expectations();
  };

  SimpleMocks.replay = function() {
    performMockAction(replayMock, [].slice.call(arguments, 0));
  };

  SimpleMocks.verify = function() {
    performMockAction(verifyMock, [].slice.call(arguments, 0));
  };

  host.SimpleMocks = SimpleMocks;
})(this);