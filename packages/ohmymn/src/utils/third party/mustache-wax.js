/**

https://github.com/jvitela/mustache-wax

The MIT License (MIT)

Copyright (c) 2014 jvitela

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function wax(Mustache, Formatters = {}) {
  Mustache.Formatters = Formatters

  /*
   *	This will parse a parameter from a filter:
   *
   *      {{ vaue | filter : param1 : param2 : param3 }}
   */
  function parseParam(param, lookup) {
    let isString, isInteger, isFloat
    isString = /^[\'\"](.*)[\'\"]$/g
    isInteger = /^[+-]?\d+$/g
    isFloat = /^[+-]?\d*\.\d+$/g
    if (isString.test(param)) {
      return param.replace(isString, "$1")
    }
    if (isInteger.test(param)) {
      return parseInt(param, 10)
    }
    if (isFloat.test(param)) {
      return parseFloat(param)
    }
    return lookup(param)
  }

  /*
   *	This function will resolve one filter# in the mustache expression:
   *
   *      {{ value | filter1 | filter2 | ... | filterN }}
   */
  function applyFilter(expr, fltr, lookup) {
    let filterExp,
      paramsExp,
      match,
      filter,
      params = [expr]
    filterExp = /^\s*([^\:]+)/g
    paramsExp = /\:\s*([\'][^\']*[\']|[\"][^\"]*[\"]|[^\:]+)\s*/g
    match = filterExp.exec(fltr)
    filter = match[1].trim()
    while ((match = paramsExp.exec(fltr))) {
      params.push(parseParam(match[1].trim(), lookup))
    }

    if (Mustache.Formatters.hasOwnProperty(filter)) {
      fltr = Mustache.Formatters[filter]
      return fltr.apply(fltr, params)
    }
    return expr
  }

  /*
   * Keep a copy of the original lookup function of Mustache
   */
  const lookup = Mustache.Context.prototype.lookup

  /*
   * Overwrite the Context::lookup method to add filter capabilities
   */
  Mustache.Context.prototype.lookup = function parseExpression(name) {
    const formatters = name.split("|")
    let expression = formatters.shift().trim()
    // call original lookup method
    if (/^".+"$|^'.+'$/.test(expression)) expression = expression.slice(1, -1)
    else expression = lookup.call(this, expression)
    // Apply the formatters
    for (let i = 0, l = formatters.length; i < l; ++i) {
      expression = applyFilter(
        expression,
        formatters[i],
        this.lookup.bind(this)
      )
    }
    return expression
  }

  return Mustache
}

export default wax
