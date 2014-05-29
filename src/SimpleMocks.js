(function(host) {

  function verifyMock(mock) {
    if (mock.beingReplayed.filter(function(expectation) {
        return !expectation.canBeOmitted();
      }).length > 0) {
      host.SimpleMocks.Util.raiseMockError(mock, host.SimpleMocks.Util.unmetExpectationsMessage(mock));
    }
  }

  function replayMock(mock) {
    mock.beingReplayed = mock.expectations.slice(0);
    mock.expectations.forEach(function(expectation) {
      expectation.reset();
    });
  }

  function SimpleMocks() {
  }

  SimpleMocks.expectations = function() {
    return new host.SimpleMocks.Expectations();
  };

  SimpleMocks.replay = function() {
    var args = [].slice.call(arguments, 0);
    var mocks = (args[0] instanceof Array) ? args[0] : args;

    mocks.forEach(function(mock) {
      replayMock(mock);
    });
  };

  SimpleMocks.verify = function() {
    var args = [].slice.call(arguments, 0);
    var mocks = (args[0] instanceof Array) ? args[0] : args;

    mocks.forEach(function(mock) {
      verifyMock(mock);
    });
  };

  host.SimpleMocks = SimpleMocks;
})(this);