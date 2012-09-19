editable
========

Inline editing inspired by jEditable

To provide the actual editing functionality you'll want one of the editor components.

## Editor Components

Completed:

None yet...watch this space

In Development

 - Text
 - Number
 - Checkbox
 - Date
 - Currency

## API

This module provides an api for the other modules to use.  It is intended to provide neat wrappers for the shared functionality between all these other renderers.

### editable.forEach(elements, fn)

Equivalent to `Array.prototype.forEach` but works on sudo-arrays like NodeList and also treats non-arrays as single element arrays.  This lets you easilly make functions that can be called with one or many elements equivalently.

### editable.click(elements, fn)

Handle click for one or many elements, and call the function with the element and the MouseEvent.

### editable.blur(elements, fn)

Handle the blur event, same as click above.

### editable.attribute(element, name, [value])

If a value is provided, this sets the data attribute on the element.  If no value is provided then this searches the tree upwards for the provided data attribute.  This is useful for setting a record-id at the top level, but each individual field-name on the individual nodes.

Attributes should be provided without the `data-` prefix.