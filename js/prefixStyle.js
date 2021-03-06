(function () {
  var elementStyle = document.createElement('div').style

  var vendor = (function () {
    var transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform'
    }

    for (var key in transformNames) {
      if (elementStyle[transformNames[key]] !== undefined) {
        return key
      }
    }

    return false
  })()

  window.prefixStyle = function (style) {
    if (vendor === false) {
      return false
    }

    if (vendor === 'standard') {
      return style
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }
})()
