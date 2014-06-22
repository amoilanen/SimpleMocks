describe("SimpleMocks", function() {

  var expectations;
  var mock;

  beforeEach(function () {
    expectations = SimpleMocks.expectations();
  });

  it("SimpleMocks is defined", function() {
    expect(SimpleMocks).not.toBeNull();
  });

  it("should be able to expect method with arguments", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .mock();
    mock.add(1, 2, 3);
  });

  it("should throw exception when expected method is called more than once", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .mock();

    mock.add(1, 2, 3);

    try {
      mock.add(1, 2, 3);
      throw new Error("Exception should be thrown when calling method more than once");
    } catch (e) {
      expect(e.message).toBe("Unexpected method invokation 'add'. No unmet expectations.");
    }
  });

  it("should throw exception when expected method is called with wrong arguments", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .mock();

    try {
      mock.add(4, 5);
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '1,2,3' but was '4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2,3'");
    }
  });

  it("should throw exception when expected method is called with wrong arguments, should output unmet expectations", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .expect("mult").with(4, 5)
      .expect("add").with(6, 7)
      .mock();

    try {
      mock.add(4, 5);
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '1,2,3' but was '4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2,3'"
        + "\nmethod 'mult' with arguments '4,5'"
        + "\nmethod 'add' with arguments '6,7'");
    }
  });

  it("should throw exception when one method is expected but another is called", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .expect("mult").with(1, 2, 3)
      .mock();

    try {
      mock.mult(1, 2, 3);
      throw new Error("Exception should be thrown when calling unexpected method");
    } catch (e) {
      expect(e.message).toBe("Expected method 'add' but method 'mult' was called. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2,3'"
        + "\nmethod 'mult' with arguments '1,2,3'");
    }
  });

  it("should throw exception when one method is expected but another is called, should output unmet expectations", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .expect("sub").with(4, 5)
      .expect("mult").with(6, 7)
      .expect("add").with(8, 9)
      .mock();

    mock.add(1, 2, 3);

    try {
      mock.add(1, 2, 3);
      throw new Error("Exception should be thrown when calling unexpected method");
    } catch (e) {
      expect(e.message).toBe("Expected method 'sub' but method 'add' was called. Unmet expectations: "
        + "\nmethod 'sub' with arguments '4,5'"
        + "\nmethod 'mult' with arguments '6,7'"
        + "\nmethod 'add' with arguments '8,9'");
    }
  });

  it("should throw exception when completely unexpected method is called, should output unmet expectations", function() {
    mock = expectations.expect("sub").with(4, 5)
      .expect("mult").with(6, 7)
      .expect("add").with(8, 9)
      .mock();

    try {
      mock.add(1, 2, 3);
      throw new Error("Exception should be thrown when calling an unexpected method");
    } catch (e) {
      expect(e.message).toBe("Expected method 'sub' but method 'add' was called. Unmet expectations: "
        + "\nmethod 'sub' with arguments '4,5'"
        + "\nmethod 'mult' with arguments '6,7'"
        + "\nmethod 'add' with arguments '8,9'");
    }
  });

  it("should throw exception if no expectations were set and some method was called", function() {
    mock = expectations.mock();

    try {
      mock.add(1, 2);
      throw new Error("Exception should be thrown when no expectations were set and some method is called");
    } catch (e) {
      expect(e.message).toBe("mock.add is not a function");
    }
  });

  it("should expect last specified arguments", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .with(4, 5, 6)
      .mock();

    mock.add(4, 5, 6);
  });

  it("should throw exception when 'with' is called without matching 'expect'", function() {
    try {
      expectations.with(1, 2, 3);
    } catch (e) {
      expect(e.message).toBe("No matching 'expect' found for last 'with'");
    }
  });

  it("should allow 'expect' without a matching 'with'", function() {
    mock = expectations.expect("add").mock();

    mock.add(1, 2, 3, 4, 5);
  });

  it("should allow to use 'with' with no arguments", function() {
    mock = expectations.expect("add").with().mock();

    try {
      mock.add(1, 2, 3, 4, 5);
      throw new Error("Exception should be thrown when expecting no arguments and arguments were provided");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '' but was '1,2,3,4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments ''");
    }
  });

  it("should allow to use 'noArguments' alias for 'with' with no arguments", function() {
    mock = expectations.expect("add").noArguments().mock();

    try {
      mock.add(1, 2, 3, 4, 5);
      throw new Error("Exception should be thrown when expecting no arguments and arguments were provided");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '' but was '1,2,3,4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments ''");
    }
  });

  it("should allow to expect several methods", function() {
    mock = expectations.expect("add").with(1, 2)
      .expect("add").with(3, 4)
      .expect("mult").with(5, 6)
      .expect("sub").with(7, 8)
      .mock();

    mock.add(1, 2);
    mock.add(3, 4);
    mock.mult(5, 6);
    mock.sub(7, 8);
  });

  it("should throw exception when 'verify' is called and there are still unmet expectations", function() {
    mock = expectations.expect("add").with(1, 2)
      .expect("add").with(3, 4)
      .expect("mult").with(5, 6)
      .expect("sub").with(7, 8)
      .mock();

    mock.add(1, 2);

    try {
      SimpleMocks.verify(mock);
      throw new Error("Exception should be thrown when there are unverified expectations");
    } catch (e) {
      expect(e.message).toBe("Unmet expectations: "
        + "\nmethod 'add' with arguments '3,4'"
        + "\nmethod 'mult' with arguments '5,6'"
        + "\nmethod 'sub' with arguments '7,8'");
    }
  });

  it("should not throw exception when there are still unmet expectations and no 'verify' has been called", function() {
    mock = expectations.expect("add").with(1, 2)
      .expect("add").with(3, 4)
      .expect("mult").with(5, 6)
      .expect("sub").with(7, 8)
      .mock();

    mock.add(1, 2);
  });

  it("should provide the API to verify a few mocks at the same time", function() {
    expectations = expectations.expect("add");
    var mocks = [expectations.mock("mock1"), expectations.mock("mock2"), expectations.mock("mock3")];

    mocks[0].add();
    mocks[1].add();

    try {
      SimpleMocks.verify.apply(SimpleMocks, mocks);
      throw new Error("mock3: Exception should be thrown when there are unverified expectations for mock3");
    } catch (e) {
      expect(e.message).toBe("mock3: Unmet expectations: "
        + "\nmethod 'add'");
    }
  });

  it("should not throw exception when there are still unmet expectations and no 'verify' has been called", function() {
    mock = expectations.expect("add").with(1, 2)
      .expect("add").with(3, 4)
      .expect("mult").with(5, 6)
      .expect("sub").with(7, 8)
      .mock();

    mock.add(1, 2);
  });

  it("should reset the mock state after 'replay' is called", function() {
    mock = expectations.expect("add").with(1, 2)
      .expect("mult").with(3, 4)
      .expect("sub").with(5, 6)
      .mock();

    mock.add(1, 2);
    mock.mult(3, 4);
    mock.sub(5, 6);
    SimpleMocks.verify(mock);

    SimpleMocks.replay(mock);

    mock.add(1, 2);
    mock.mult(3, 4);
    mock.sub(5, 6);
    SimpleMocks.verify(mock);
  });

  it("should provide the API to replay a few mocks at the same time", function() {
    expectations = expectations.expect("add");
    var mocks = [expectations.mock("mock1"), expectations.mock("mock2"), expectations.mock("mock3")];

    mocks.forEach(function(mock) {
      mock.add();
    });

    SimpleMocks.replay.apply(SimpleMocks, mocks);

    mocks.forEach(function(mock) {
      mock.add();
    });
  });

  it("should be able to mock methods such as 'expect', 'mock', 'verify', 'replay', 'with'", function() {
    var keywords = ['expect', 'mock', 'verify', 'replay', 'with'];

    mock = keywords.reduce(function(acc, keyword) {
      return acc.expect(keyword);
    }, expectations).mock();

    keywords.forEach(function(keyword) {
      mock[keyword]();
    });
  });

  it("should support calling 'replay' in middle of execution", function() {
    mock = expectations.expect("add").with(1, 2)
      .expect("mult").with(3, 4)
      .expect("sub").with(5, 6)
      .mock();

    mock.add(1, 2);
    mock.mult(3, 4);
    SimpleMocks.replay(mock);

    mock.add(1, 2);
    mock.mult(3, 4);
    mock.sub(5, 6);

    SimpleMocks.verify(mock);
  });

  it("should support calling 'replay' multiple times", function() {
    mock = expectations.expect("add").with(1, 2)
      .mock();

    mock.add(1, 2);
    SimpleMocks.verify(mock);
    SimpleMocks.replay(mock);

    mock.add(1, 2);
    SimpleMocks.verify(mock);
    SimpleMocks.replay(mock);

    mock.add(1, 2);
    SimpleMocks.verify(mock);
    SimpleMocks.replay(mock);

    mock.add(1, 2);
    SimpleMocks.verify(mock);
  });

  it("should allow to call 'mock' several times for same unfinished expectation", function() {
    expectations = expectations.expect("add");

    var mocks = [expectations.mock("mock1"), expectations.mock("mock2"), expectations.mock("mock3")];

    mocks.forEach(function(mock) {
      mock.add();
    });

    SimpleMocks.verify(mocks);
  });

  it("should accept array as an argument for 'verify' and 'replay' methods", function() {
    expectations = expectations.expect("add");

    var mocks = [expectations.mock("mock1"), expectations.mock("mock2"), expectations.mock("mock3")];

    mocks.forEach(function(mock) {
      mock.add();
    });

    SimpleMocks.replay(mocks);

    mocks.forEach(function(mock) {
      mock.add();
    });

    SimpleMocks.verify(mocks);
  });

  it("should output the name of the mock in the error messages in case it is set", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .mock("mockName");

    try {
      mock.add(4, 5);
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("mockName: Wrong arguments provided to 'add', expected '1,2,3' but was '4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2,3'");
    }
  });

  it("should allow to expect a Number as argument", function() {
    var mock1 = expectations.expect("add").with(1, 2, SimpleMocks.Matchers.Number)
      .mock("mock1");

    try {
      mock1.add(1, 2, "abc");
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("mock1: Wrong arguments provided to 'add', expected '1,2,'number'' but was '1,2,abc'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2,'number''");
    }

    var mock2 = expectations.mock("mock2");

    mock2.add(1, 2, 0.01);
  });

  it("should allow to expect a String as argument", function() {
    var mock1 = expectations.expect("concat").with(SimpleMocks.Matchers.String, "def")
      .mock("mock1");

    try {
      mock1.concat(5, "def");
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("mock1: Wrong arguments provided to 'concat', expected ''string',def' but was '5,def'. Unmet expectations: "
        + "\nmethod 'concat' with arguments ''string',def'");
    }

    var mock2 = expectations.mock("mock2");

    mock2.concat("abc", "def");
  });

  it("should allow to expect an Object as argument", function() {
    var mock1 = expectations.expect("compute").with(
      SimpleMocks.Matchers.Object,
      SimpleMocks.Matchers.Object,
      SimpleMocks.Matchers.Object
    ).mock("mock1");

    try {
      mock1.compute({}, {}, 2);
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("mock1: Wrong arguments provided to 'compute', expected ''object','object','object'' but was '[object Object],[object Object],2'. Unmet expectations: "
        + "\nmethod 'compute' with arguments ''object','object','object''");
    }

    var mock2 = expectations.mock("mock2");
    var obj = {
      field1: "value1",
      field2: "value2"
    };

    mock2.compute(obj, obj, obj);
  });

  it("should allow to expect a Boolean as argument", function() {
    var mock = expectations.expect("and")
      .with(SimpleMocks.Matchers.Boolean, SimpleMocks.Matchers.Boolean)
      .mock();

    try {
      mock.and(true, "false");
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'and', expected ''boolean','boolean'' but was 'true,false'. Unmet expectations: "
        + "\nmethod 'and' with arguments ''boolean','boolean''");
    }

    mock.and(true, true);
  });

  it("should allow to expect a Function as argument", function() {
    var mock = expectations.expect("memoize")
      .with(SimpleMocks.Matchers.Function)
      .mock();

    try {
      mock.memoize("abc");
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'memoize', expected ''function'' but was 'abc'. Unmet expectations: "
        + "\nmethod 'memoize' with arguments ''function''");
    }

    mock.memoize(function() {});
  });

  it("should allow to expect an Array as argument", function() {
    var mock = expectations.expect("sum")
      .with(SimpleMocks.Matchers.Array)
      .mock();

    try {
      mock.sum(5);
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'sum', expected ''array'' but was '5'. Unmet expectations: "
        + "\nmethod 'sum' with arguments ''array''");
    }

    mock.sum([1, 2, 3]);
  });

  it("should allow to expect null as argument", function() {
    var mock = expectations.expect("method")
      .with(null)
      .mock();

    try {
      mock.method(5);
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'method', expected 'null' but was '5'. Unmet expectations: "
        + "\nmethod 'method' with arguments 'null'");
    }

    mock.method(null);
  });

  it("should allow to specify a custom matcher", function() {
    function StartsWith(prefix) {
      this.prefix = prefix;
    }
    StartsWith.prototype = new SimpleMocks.Matchers.Matcher();

    StartsWith.prototype.matches = function(value) {
      return value.indexOf(this.prefix) == 0;
    };

    StartsWith.prototype.toString = function(value) {
      return "'starts with " + this.prefix + "'";
    };

    var mock = expectations.expect("method")
      .with(new StartsWith("abc"))
      .mock();

    try {
      mock.method("defabc");
      throw new Error("Exception should be thrown when calling method with other arguments");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'method', expected ''starts with abc'' but was 'defabc'. Unmet expectations: "
        + "\nmethod 'method' with arguments ''starts with abc''");
    }

    mock.method("abcdef");
  });

  it("should throw exception when more arguments provided then expected", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .mock();

    try {
      mock.add(1, 2, 3, 4, 5);
      throw new Error("Exception should be thrown when calling method more than once");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '1,2,3' but was '1,2,3,4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2,3'");
    }
  });

  it("should throw exception when fewer arguments provided then expected", function() {
    mock = expectations.expect("add").with(1, 2, 3)
      .mock();

    try {
      mock.add(1);
      throw new Error("Exception should be thrown when calling method more than once");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '1,2,3' but was '1'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2,3'");
    }
  });

  it("should output formatted arrays both as expected and actual arguments", function() {
    mock = expectations.expect("add").with([1, 2, 3])
      .mock();

    try {
      mock.add([1, 2, 3, 4, 5]);
      throw new Error("Exception should be thrown when calling method more than once");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '[1,2,3]' but was '[1,2,3,4,5]'. Unmet expectations: "
        + "\nmethod 'add' with arguments '[1,2,3]'");
    }
  });

  it("should allow to call 'expect' after 'mock' has been created", function() {
    var mock1 = expectations.expect("add").with(1, 2)
      .mock();

    mock1.add(1, 2);

    var mock2 = expectations.expect("subtract").with(6, 2)
      .mock();

    mock2.add(1, 2);
    mock2.subtract(6, 2);
  });

  it("should allow to mock the same method multiple times", function() {
    mock = expectations.expect("add").with(1, 2)
      .expect("add").with(3, 4)
      .expect("add").with(5, 6)
      .mock();

    mock.add(1, 2);
    mock.add(3, 4);
    mock.add(5, 6);

    try {
      mock.add(1, 2);
      throw new Error("Exception should be thrown when calling unexpected method");
    } catch (e) {
      expect(e.message).toBe("Unexpected method invokation 'add'. No unmet expectations.");
    }
  });

  it("should allow to specify a number of times a method should be called", function() {
    mock = expectations.expect("add").with(1, 2)
      .times(3)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);

    try {
      mock.add(1, 2);
      throw new Error("Exception should be thrown when calling unexpected method");
    } catch (e) {
      expect(e.message).toBe("Unexpected method invokation 'add'. No unmet expectations.");
    }
  });

  it("should mention number of times in expectations message", function() {
    mock = expectations.expect("add").with(1, 2)
      .times(3)
      .mock();

    mock.add(1, 2);

    try {
      SimpleMocks.verify(mock);
      throw new Error("Exception should be thrown when called fewer than expected times");
    } catch (e) {
      expect(e.message).toBe("Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2', exactly 3 times, called 1 time(s)");
    }
  });

  it("should allow to specify times for one method and not specify for another", function() {
    mock = expectations.expect("add").with(1, 2)
      .times(3)
      .expect("subtract").with(3, 4)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);
    mock.subtract(3, 4);

    SimpleMocks.verify(mock);
  });

  it("should throw exception when 'times' is called without matching 'expect'", function() {
    try {
      expectations.times(2);
    } catch (e) {
      expect(e.message).toBe("No matching 'expect' found for last 'times'");
    }
  });

  it("should throw exception when 'timesAtLeast' is called without matching 'expect'", function() {
    try {
      expectations.timesAtLeast(2);
    } catch (e) {
      expect(e.message).toBe("No matching 'expect' found for last 'timesAtLeast'");
    }
  });

  it("should throw exception when 'timesNoMoreThan' is called without matching 'expect'", function() {
    try {
      expectations.timesNoMoreThan(2);
    } catch (e) {
      expect(e.message).toBe("No matching 'expect' found for last 'timesNoMoreThan'");
    }
  });

  it("should allow to specify timesAtLeast and call more times than specified", function() {
    mock = expectations.expect("add").with(1, 2).timesAtLeast(3)
      .expect("add").with(3, 4)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(3, 4);

    SimpleMocks.verify(mock);
  });

  it("should allow to specify timesAtLeast and call more times than specified, then unexpected method", function() {
    mock = expectations.expect("add").with(1, 2).timesAtLeast(3)
      .expect("add").with(3, 4)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);

    try {
      mock.add(4, 5);
      throw new Error("Exception should be thrown");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '3,4' but was '4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments '3,4'");
    }
  });

  it("should allow to specify timesAtLeast and call times as specified", function() {
    mock = expectations.expect("add").with(1, 2).timesAtLeast(3)
      .expect("add").with(3, 4)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(3, 4);

    SimpleMocks.verify(mock);
  });

  it("should allow to specify timesAtLeast and call times as specified, then unexpected method", function() {
    mock = expectations.expect("add").with(1, 2).timesAtLeast(3)
      .expect("add").with(3, 4)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);
    mock.add(1, 2);
    try {
      mock.add(4, 5);
      throw new Error("Exception should be thrown");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '3,4' but was '4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments '3,4'");
    }
  });

  it("should allow to specify timesAtLeast and throw exception if called fewer times", function() {
    mock = expectations.expect("add").with(1, 2).timesAtLeast(3)
      .expect("add").with(3, 4)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);

    try {
      mock.add(3, 4);
      throw new Error("Exception should be thrown");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '1,2' but was '3,4'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2', at least 3 times, called 2 time(s)"
        + "\nmethod 'add' with arguments '3,4'");
    }
  });

  it("should allow to specify timesAtLeast and throw exception if called fewer times, then unexpected method", function() {
    mock = expectations.expect("add").with(1, 2).timesAtLeast(3)
      .expect("add").with(3, 4)
      .mock();

    mock.add(1, 2);
    mock.add(1, 2);

    try {
      mock.add(4, 5);
      throw new Error("Exception should be thrown");
    } catch (e) {
      expect(e.message).toBe("Wrong arguments provided to 'add', expected '1,2' but was '4,5'. Unmet expectations: "
        + "\nmethod 'add' with arguments '1,2', at least 3 times, called 2 time(s)"
        + "\nmethod 'add' with arguments '3,4'");
    }
  });

  describe("timesNoMoreThan", function() {

    it("should throw exception when limit is exceeded", function() {
      mock = expectations.expect("add").with(1, 2).timesNoMoreThan(3)
        .expect("add").with(3, 4)
        .mock();

      mock.add(1, 2);
      mock.add(1, 2);
      mock.add(1, 2);

      try {
        mock.add(1, 2);
        throw new Error("Exception should be thrown");
      } catch (e) {
        expect(e.message).toBe("Wrong arguments provided to 'add', expected '3,4' but was '1,2'. Unmet expectations: "
          + "\nmethod 'add' with arguments '3,4'");
      }
    });

    it("should throw exception when called exactly expected times and then unexpected method", function() {
      mock = expectations.expect("add").with(1, 2).timesNoMoreThan(3)
        .expect("add").with(3, 4)
        .mock();

      mock.add(1, 2);
      mock.add(1, 2);
      mock.add(1, 2);

      try {
        mock.add(4, 5);
        throw new Error("Exception should be thrown");
      } catch (e) {
        expect(e.message).toBe("Wrong arguments provided to 'add', expected '3,4' but was '4,5'. Unmet expectations: "
          + "\nmethod 'add' with arguments '3,4'");
      }
    });

    it("should throw exception when called exactly expected times and then another expected method", function() {
      mock = expectations.expect("add").with(1, 2).timesNoMoreThan(3)
        .expect("add").with(3, 4)
        .mock();

      mock.add(1, 2);
      mock.add(1, 2);
      mock.add(1, 2);
      mock.add(3, 4);
    });

    it("should throw exception when called fewer than expected times and then unexpected method", function() {
      mock = expectations.expect("add").with(1, 2).timesNoMoreThan(3)
        .expect("add").with(3, 4)
        .mock();

      mock.add(1, 2);
      mock.add(1, 2);

      try {
        mock.add(4, 5);
        throw new Error("Exception should be thrown");
      } catch (e) {
        expect(e.message).toBe("Wrong arguments provided to 'add', expected '3,4' but was '4,5'. Unmet expectations: "
          + "\nmethod 'add' with arguments '3,4'");
      }
    });

    it("should throw exception when called fewer than expected times and then another expected method", function() {
      mock = expectations.expect("add").with(1, 2).timesNoMoreThan(3)
        .expect("add").with(3, 4)
        .mock();

      mock.add(1, 2);
      mock.add(1, 2);
      mock.add(3, 4);
    });


    it("should allow to call fewer times", function() {
      mock = expectations.expect("add").with(1, 2).timesNoMoreThan(3)
        .mock();

      mock.add(1, 2);
      mock.add(1, 2);

      SimpleMocks.verify(mock);
    });

    it("should allow to specify several in a row", function() {
      mock = expectations.expect("add").with(1, 2).timesNoMoreThan(3)
        .expect("subtract").with(3, 4).timesNoMoreThan(3)
        .expect("mult").with(5, 6).timesNoMoreThan(3)
        .mock();

      mock.mult(5, 6);

      SimpleMocks.verify(mock);
    });
  });

  describe("Matchers", function() {

    describe("Null", function() {

      it("should throw exception if non-null provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.Null)
          .mock();

        try {
          mock.print("abc");
          throw new Error("Exception should be thrown when calling method with other arguments");
        } catch (e) {
          expect(e.message).toBe("Wrong arguments provided to 'print', expected 'null' but was 'abc'. Unmet expectations: "
            + "\nmethod 'print' with arguments 'null'");
        }
      });

      it("should throw exception if 'undefined' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.Null)
          .mock();

        try {
          mock.print((void 0));
          throw new Error("Exception should be thrown when calling method with other arguments");
        } catch (e) {
          expect(e.message).toBe("Wrong arguments provided to 'print', expected 'null' but was 'undefined'. Unmet expectations: "
            + "\nmethod 'print' with arguments 'null'");
        }
      });

      it("should work if 'null' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.Null)
          .mock();

        mock.print(null);
      });

    });

    describe("NonNull", function() {

      it("should work if non-null provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.NonNull)
          .mock();

        mock.print("abc");
      });

      it("should work if 'undefined' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.NonNull)
          .mock();

        mock.print((void 0));
      });

      it("should throw exception if 'null' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.NonNull)
          .mock();

        try {
          mock.print(null);
          throw new Error("Exception should be thrown when calling method with other arguments");
        } catch (e) {
          expect(e.message).toBe("Wrong arguments provided to 'print', expected ''not null'' but was 'null'. Unmet expectations: "
            + "\nmethod 'print' with arguments ''not null''");
        }
      });
    });

    describe("Undefined", function() {

      it("should throw exception if non-undefined provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.Undefined)
          .mock();

        try {
          mock.print("abc");
          throw new Error("Exception should be thrown when calling method with other arguments");
        } catch (e) {
          expect(e.message).toBe("Wrong arguments provided to 'print', expected 'undefined' but was 'abc'. Unmet expectations: "
            + "\nmethod 'print' with arguments 'undefined'");
        }
      });

      it("should throw exception if 'null' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.Undefined)
          .mock();

        try {
          mock.print(null);
          throw new Error("Exception should be thrown when calling method with other arguments");
        } catch (e) {
          expect(e.message).toBe("Wrong arguments provided to 'print', expected 'undefined' but was 'null'. Unmet expectations: "
            + "\nmethod 'print' with arguments 'undefined'");
        }
      });

      it("should work if 'undefined' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.Undefined)
          .mock();

        mock.print((void 0));
      });

    });

    describe("NonUndefined", function() {

      it("should work if non-undefined provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.NonUndefined)
          .mock();

        mock.print("abc");
      });

      it("should work if 'null' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.NonUndefined)
          .mock();

        mock.print(null);
      });

      it("should throw exception if 'undefined' provided", function() {
        var mock = expectations.expect("print").with(SimpleMocks.Matchers.NonUndefined)
          .mock();

        try {
          mock.print((void 0));
          throw new Error("Exception should be thrown when calling method with other arguments");
        } catch (e) {
          expect(e.message).toBe("Wrong arguments provided to 'print', expected ''not undefined'' but was 'undefined'. Unmet expectations: "
            + "\nmethod 'print' with arguments ''not undefined''");
        }
      });

    });
  });

  //TODO: Add support for stubbing methods
  //Stubbing some method when it is not important whether it will be called or not and with what arguments

  //TODO: Mocking and expecting that a method returns value 'andReturn'

  //TODO: andThrow
  //Expecting an exception to be thrown andThrow

  //TODO: andCall
  //Calling a specified function when method is called

  //TODO: specify a changing behavior for a method
  //expect(mock.voteForRemoval("Document"))
  //    .andReturn((byte) 42).times(3)
  //    .andThrow(new RuntimeException(), 4)
  //    .andReturn((byte) -42);

  //TODO: Mock throws an error, but then could still call 'replay' and behave normally
});