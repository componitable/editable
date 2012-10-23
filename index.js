var emitter = require('emitter');
var matchesSelector = require('matches-selector');

emitter(module.exports);

/**
 * Iterate over the elements and call the function as if forEach was used on an array.
 *
 * Will treat any non-arraylike object as an array containing a single item.
 * 
 * @param  {NodeList|Array|Element}                   elements
 * @param  {Function(Element, Index, NodeList|Array)} fn
 */
function forEach(elements, fn) {
  if (typeof elements === 'string') elements = document.querySelectorAll(elements);
  if (typeof elements.length === 'undefined') elements = [elements];  
  Array.prototype.forEach.call(elements, fn);
}
module.exports.forEach = forEach;

function eventAttacher(name) {
  return function (elements, opts, fn) {
    if (arguments.length === 2) {
      fn = opts;
      opts = {};
    }
    opts = opts || {};
    if (opts.live != false && typeof elements === 'string') {
      function liveHandler (eventArgs) {
        if (matchesSelector(eventArgs.target, elements)) {
          fn(eventArgs.target, eventArgs);
        }
      }
      document.addEventListener(name, liveHandler, false);
      return;
    } else if (opts.live === true) {
      throw new Error('Live option only works when elements is a string.');
    }

    var handler = makeHandler(fn);
    forEach(elements, function (element) {
      element.addEventListener(name, handler, false);
    });
  };
}
function makeHandler(fn) {
  return function (eventArgs) {
    return fn(this, eventArgs);
  };
}

module.exports.click = eventAttacher('click');
module.exports.blur = eventAttacher('blur');

/**
 * Get a data attribute, and search up through the DOM tree to parent nodes if the attribute
 * isn't present on the current node.
 * 
 * @param  {Element} element
 * @param  {String}  name    will have 'data-' prepended before passing to getAttribute
 * @param  {Any}     [value] If present the method will act as setAttribute
 */
function attribute(element, name, value) {
  if (!/^data\-/.test(name)) {
    name = 'data-' + name;
  }
  if (arguments.length === 3) {
    element.setAttribute(name, value);
  } else {
    var res = null;
    while ((res === null || res === '') && element && typeof element.getAttribute !== 'undefined') {
      res = element.getAttribute(name);
      element = element.parentNode;
    }
    return res === '' ? null : res;
  }
}
module.exports.attribute = attribute;

/**
 * Get the inner dimensions of an element
 */
function dimensions(element) {
  var style = getStyle(element);

  var width = style('width');
  var height = style('height');

  return {width: width, height: height};
}
module.exports.dimensions = dimensions;

function transformDimensions(element, dimensions, ignore) {
  ignore = ignore || {};
  var height = dimensions.height;
  var width = dimensions.width;
  var style = getStyle(element);

  if (!ignore.padding && !ignore.paddingVertical) height -= (style('paddingTop') + style('paddingBottom'));
  if (!ignore.margin && !ignore.marginVertical) height -= (style('marginTop') + style('marginBottom'));
  if (!ignore.border && !ignore.borderVertical) height -= (style('borderTopWidth') + style('borderBottomWidth'));
  if (!ignore.padding && !ignore.paddingHorizontal) width -= (style('paddingLeft') + style('paddingRight'));
  if (!ignore.margin && !ignore.marginHorizontal) width -= (style('marginLeft') + style('marginRight'));
  if (!ignore.border && !ignore.borderHorizontal) width -= (style('borderLeftWidth') + style('borderRightWidth'));

  return {height: height, width: width};
}
module.exports.transformDimensions = transformDimensions;

function getStyle(element) {
  var style = window.getComputedStyle(element);
  return function (name) {
    return parseFloat(style[name].replace(/px$/g, ''));
  }
}