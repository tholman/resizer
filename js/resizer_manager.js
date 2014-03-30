/*
 * ResizerManager is the intended mechanism with which to instantiate
 * Resizers. It provides a helpful constructor that can handle individual
 * elements as well as NodeLists and arrays.
 */

function ResizerManager() {
  if (arguments.length > 0) {
    // pull the last argument
    var opts;
    opts = arguments[arguments.length - 1];

    // if the last arg was a plainObject, it is opts. no need to construct
    if (opts.constructor == Object)
      delete arguments[arguments.length - 1];
    // otherwise it's not opts, so never mind
    else
      opts = undefined;

    this.New(arguments, opts);
  }
}

// recurse over passed arg, instantiating Resizers when possible
ResizerManager.prototype.New = function(arg, opts) {
  var self = this;

  if (arg instanceof(HTMLElement)) {
    new Resizer(arg, opts);
  } else if (arg instanceof(Array) ||
             arg instanceof(NodeList) ||
             arg instanceof(Object)) {
    for (var i=0; i < arg.length; i++) {
      self.New(arg[i], opts);
    }
  }
};
