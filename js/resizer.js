/*
 * Resizers are JS containers for HTML elements w/dynamically resizable text
 *
 * While initialized with an HTML element, Resizers communicate with the DOM
 * only through the element's dataset. Otherwise, all DOM manipulation is
 * abstracted to the ResizerCanvas prototype.
 *
 * Resizers can be instantiated with options directly; this can also be
 * performed as a bulk operation on a collection through ResizerManager(coll)
 *
 */

// eliminate redundant values from an array
if (!Array.prototype.uniq) {
  Array.prototype.uniq = function() {
    this.sort();
    for (var i=this.length -1; i>=0; i--) {
      if (this[i] == this[i-1])
        delete this[i];
    }

    return this;
  };
}

/* **********************************
 * Resizer instantiation and defaults
 * **********************************/

function Resizer(el, opts) {
  this.canvas = new ResizerCanvas(el);
  this.dataset = el.dataset;

  this.Initialize(opts);
}

Resizer.prototype.minFontSize = 11;
Resizer.prototype._initDataKeys = ['maxFontSize', 'cachedLength'];

Resizer.prototype._maxScrollWidth = function(val) {
  return this.data('maxScrollWidth', this.canvas._scrollWidth(), val);
};


/* **************
 * Data shortcuts
 * **************/

Resizer.prototype._maxFontSize = function(val) {
  return this.data('maxFontSize', this.canvas._fontSize(), val);
};

Resizer.prototype._minFontSize = function(val) {
  return this.data('minFontSize', this.minFontSize, val);
};

Resizer.prototype._cachedLength = function(val) {
  return this.data('cachedLength', this.canvas._textLength(), val);
};

/* ************************
 * Resizer "public methods"
 * ************************/

// initialize Resizer
Resizer.prototype.Initialize = function(opts) {
  var self = this;
  var keys = this.initDataKeys(opts || {});

  // for all initDataKeys + defined opts
  for (var i=0; i < keys.length; i++) {
    var key = keys[i];

    // set value if defined; otherwise get and store default value
    if (typeof(self["_" + key]) === "function")
      self["_" + key]((opts && opts[key]) || undefined);
  }

  this.AddListeners();
};

// add listeners
Resizer.prototype.AddListeners = function() {
  var self = this;

  // run resize when canvas' onKeyDown fires
  this.canvas.onKeyDown(function(len) {
    self.Resize(len);
  });
};

// Resizer magikkk
Resizer.prototype.Resize = function(len) {
  // grow or shrink, depending on what operation was performed
  if (len < this._cachedLength())
    this.Grow();
  else
    this.Shrink();

  // update _cachedLength
  this._cachedLength(len);
};

Resizer.prototype.Grow = function() {
  this.addToFontSize(1);
};

Resizer.prototype.Shrink = function() {
  this.addToFontSize(-1);
};

/* *************************
 * Resizer "private" methods
 * *************************/

// merge _initDataKeys with passed options
Resizer.prototype.initDataKeys = function(opts) {
  var keys = this._initDataKeys.concat(Object.keys(opts || {}));
  return keys.uniq();
};

// tell data to override if a val is passed
// the data()/_data() chain keeps us in our namespaced data-attributes
Resizer.prototype.data = function(key, def, val) {
  return this._data(key, val || def, val !== undefined);
};

// determine whether we're using max or min font size; pass to canvas
Resizer.prototype.addToFontSize = function(add) {
  var step = parseInt(add);
  if (step === 0) return;

  var cmpSize = (step > 0) ? this._maxFontSize() : this._minFontSize();
  this.canvas.Resize(step, cmpSize);
};

Resizer.prototype._data = function(key, val, overwrite) {
  var rs = this._config('resizer') || {};
  var v = rs[key];

  // if we have a value AND (no value existed OR overwrite is set)
  if (val && (!v || overwrite)) {
    // overwrite value with passed value
    v = rs[key] = val;
    this._config('resizer', rs);
  }

  return v;
};

// parse config data element with json
Resizer.prototype._config = function(key, val) {
  var v = val;
  if (v !== undefined && typeof(v) !== "string")
    v = JSON.stringify(v);

  var cfg = this.config(key || undefined, v || undefined);
  return (typeof(cfg) === "string") ? JSON.parse(cfg) : cfg;
};

//TODO look into memoizing the config returns
// raw manipulation of data element
Resizer.prototype.config = function(key, val) {
  if (!this.dataset)
    this.dataset = this.canvas.el.dataset;

  if (val !== undefined)
    this.dataset[key] = val;

  return (key === undefined) ? this.dataset : this.dataset[key];
};
