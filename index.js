var emitter = require('emitter');

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

/**
 * Handle click for each element in the element list
 * 
 * @param  {NodeList|Array|Element}        elements
 * @param  {Function(Element, MouseEvent)} fn
 */
function click(elements, fn) {
  forEach(elements, function (element) {
    element.addEventListener('click', function (eventArgs) {
      return fn(element, eventArgs);
    }, false);
  });
}
module.exports.click = click;

/**
 * Handle the event fired when a(n) element(s) loos(es) focus
 * 
 * @param  {NodeList|Array|Element}        elements
 * @param  {Function(Element, BlurEvent)}  fn
 */
function blur(elements, fn) {
  forEach(elements, function (element) {
    element.addEventListener('blur', function (eventArgs) {
      return fn(element, eventArgs);
    }, false);
  });
}
module.exports.blur = blur;

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

function transformDimensions(element, dimensions) {
  var height = dimensions.height;
  var width = dimensions.width;
  var style = getStyle(element);

  height -= (style('paddingTop') + style('paddingBottom'));
  height -= (style('marginTop') + style('marginBottom'));
  height -= (style('borderTopWidth') + style('borderBottomWidth'));
  width -= (style('paddingLeft') + style('paddingRight'));
  width -= (style('marginLeft') + style('marginRight'));
  width -= (style('borderLeftWidth') + style('borderRightWidth'));

  return {height: height, width: width};
}
module.exports.transformDimensions = transformDimensions;

function getStyle(element) {
  var style = window.getComputedStyle(element);
  return function (name) {
    return parseFloat(style[name].replace(/px$/g, ''));
  }
}