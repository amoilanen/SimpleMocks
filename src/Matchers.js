(function(host) {

  function Matcher() {
  }

  function ValueMatcher(value) {
    this.value = value;
  }
  ValueMatcher.prototype = new Matcher();

  ValueMatcher.prototype.matches = function(value) {
    return JSON.stringify(this.value) == JSON.stringify(value);
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
    return this.type == typeof(value);
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

  function NotNullMatcher() {
  }
  NotNullMatcher.prototype = new Matcher();

  NotNullMatcher.prototype.matches = function(value) {
    return (value !== null) && (value !== undefined);
  };

  NotNullMatcher.prototype.toString = function() {
    return "'not null'";
  };

  host.SimpleMocks.Matchers = {
    Number: new TypeMatcher("number"),
    String: new TypeMatcher("string"),
    Object: new TypeMatcher("object"),
    Boolean: new TypeMatcher("boolean"),
    Function: new TypeMatcher("function"),
    Array: new InstanceOfMatcher(Array),
    NotNull: new NotNullMatcher(),
    Matcher: Matcher,
    ValueMatcher: ValueMatcher
  };
})(this);