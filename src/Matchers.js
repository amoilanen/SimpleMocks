(function(host) {

  function Matcher() {
  }

  function ValueMatcher(value) {
    this.value = value;
  }

  ValueMatcher.prototype = new Matcher();

  ValueMatcher.prototype.matches = function(value) {
    return JSON.stringify(this.value) === JSON.stringify(value);
  };

  ValueMatcher.prototype.toString = function() {
    return this.value ? (
          (this.value instanceof Array) ?
              "[" + this.value.toString() + "]" 
              : this.value.toString()
        )
        : this.value;
  };

  function TypeMatcher(type) {
    this.type = type;
  }

  TypeMatcher.prototype = new Matcher();

  TypeMatcher.prototype.matches = function(value) {
    return this.type === typeof(value);
  };

  TypeMatcher.prototype.toString = function() {
    return "'" + this.type + "'";
  };

  function InstanceOfMatcher(type) {
    this.type = type;
  }

  InstanceOfMatcher.prototype = new Matcher();

  InstanceOfMatcher.prototype.matches = function(value) {
    return value instanceof this.type;
  };

  InstanceOfMatcher.prototype.toString = function() {
    var typeCode = this.type.toString();
    var match = typeCode.match(/^function\s+([^\(]*)?/);

    return "'" + (match ? match[1].toLowerCase() : this.type) + "'";
  };

  function NotMatcher(wrappedMatcher) {
    this.wrappedMatcher = wrappedMatcher;
  }

  NotMatcher.prototype = new Matcher();

  NotMatcher.prototype.matches = function(value) {
    return !this.wrappedMatcher.matches(value);
  };

  NotMatcher.prototype.toString = function() {
    return "'not " + this.wrappedMatcher.toString() + "'";
  };

  host.SimpleMocks.Matchers = {
    Number: new TypeMatcher("number"),
    String: new TypeMatcher("string"),
    Object: new TypeMatcher("object"),
    Boolean: new TypeMatcher("boolean"),
    Function: new TypeMatcher("function"),
    Array: new InstanceOfMatcher(Array),
    Null: new ValueMatcher(null),
    NonNull: new NotMatcher(new ValueMatcher(null)),
    Undefined: new ValueMatcher(undefined),
    NonUndefined: new NotMatcher(new ValueMatcher(undefined)),
    Matcher: Matcher,
    ValueMatcher: ValueMatcher
  };
})(this);