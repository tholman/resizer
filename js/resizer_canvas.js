/*
 * ResizerCanvas is the missing link between a Resizer and what you see
 *
 * ResizerCanvases are instantiated by a Resizer object and exist as a layer
 * of indirection between the Resizer and the canvas.
 */


/* **********************************
 * Resizer instantiation and defaults
 * **********************************/

function ResizerCanvas(element) {
  this.el = element;
}
ResizerCanvas.prototype.style;
ResizerCanvas.prototype.context;


/* **************
 * Data shortcuts
 * **************/

ResizerCanvas.prototype._fontSize = function() {
  return parseInt(this.el.style.fontSize || this.$style('font-size'));
};

ResizerCanvas.prototype._fontFamily = function() {
  return this.el.style.fontFamily || this.$style('font-family');
};

ResizerCanvas.prototype._text = function() {
  //experimental support for non-textfields
  return this.el.value || this.el.innerHTML;
};

ResizerCanvas.prototype._textLength = function() {
  return parseInt(this._text().length);
};

ResizerCanvas.prototype._scrollWidth = function() {
  return parseInt(this.$style('width'));
};


/* ********************
 * DOM method shortcuts
 * ********************/

ResizerCanvas.prototype.$style = function(key, override) {
  if (!this.style || override)
    this.style = document.defaultView.getComputedStyle(this.el);

  return key ? this.style.getPropertyValue(key) : this.style;
};

ResizerCanvas.prototype.$context = function() {
  if (!this.context) {
    var canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');
  }

  return this.context;
};

/* ******************************
 * ResizerCanvas "public methods"
 * ******************************/

ResizerCanvas.prototype.Resize = function(step, cmpSize) {
  while (this.resizable(step > 0, cmpSize)) {
    var size = this._fontSize() + step;
    this.el.style.fontSize = size + 'px';
  }
};


/* *******************************
 * ResizerCanvas "private" methods
 * *******************************/

// is the canvas in a resizable state?
ResizerCanvas.prototype.resizable = function(sign, cmpSize) {
  // sign comes in as true/false; convert to integer
  var s = sign ? 1 : -1;
  var cmpWidth = this.checkTextWidth(s);

  // multiply values by sign (s) to reverse comparisons
  // when sign > 0, reads "currentFontSize < maxFontSize"
  // when sign < 0, reads "currentFontSize > minFontSize"
  //                     (-currentFontSize < -minFontSize)
  var vFontSize = (s*this._fontSize() < s*cmpSize);

  // when sign > 0, reads "currentTextWidth < maxScrollWidth"
  // when sign < 0, reads "currentTextWidth > minScrollWidth"
  //                     (-currentTextWidth < -minScrollWidth)
  var vWidth = (s*cmpWidth < s*this._scrollWidth());

  return vFontSize && vWidth; //valid font size && valid width?
};

// measure the width of the text box's contents
ResizerCanvas.prototype.checkTextWidth = function(sign) {
  var text = this._text();
  var fontSize = this._fontSize();
  if (sign > 0) fontSize += 1; // check w/larger font if growing

  this.$context().font = fontSize + "px " + this._fontFamily();

  if (this.$context().fillText)
    return this.$context().measureText(text).width;
  else if (this.$context().mozDrawText)
    return this.$context().mozMeasureText(text);
};

/* ***********************
 * ResizerCanvas callbacks
 * ***********************/

// load callback on element's oninput
ResizerCanvas.prototype.onKeyDown = function(callback) {
  if (!callback) return;

  var self = this;
  this.el.onkeydown = function() {callback(self._textLength());};
};
