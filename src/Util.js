(function(host) {

  function Util() {
  }

  Util.raiseMockError = function(mock, message) {
    if (mock.name) {
      message = mock.name + ": " + message;
    }

    throw new Error(message);
  };

  Util.unmetExpectationsMessage = function(mock) {
    var message = "No unmet expectations.";

    if (mock.beingReplayed.length > 0) {
      message = mock.beingReplayed.reduce(function(message, expectation) {
        return message + "\n" + expectation.toString();
      }, "Unmet expectations: ");
    }
    return message;
  };

  host.SimpleMocks.Util = Util;
})(this);