window.sleep = (ms) => new Promise((res, rej) => { 
  setTimeout(res, ms)
})

// Perhaps props should always be based on the attributes... Stop dealing with this transformation of naming and deal with the fact a prop not existing means it is set to false.

HTMLElement.prototype.getAttributes = function () {
  let attributes = [].slice.call(this.attributes)
  let serial = {}
  attributes.forEach((attr) => serial[attr.name] = attr.value)
  return serial
}

HTMLElement.prototype.setAttributes = function (attributes = {}) {
  for (let attributeName in attributes) this.setAttribute(attributeName, attributes[attributeName])
}

HTMLElement.prototype.getProps = function () {
  let propertyInfo; eval(`propertyInfo = ${this.constructor.name}.properties`)
  // If no property info, then go off what attributes we do have.
  if (!propertyInfo) {
    return this.getAttributes()
  }
  let props = {}
  for (let propName in propertyInfo) {
    if (propertyInfo[propName].type === Boolean) {
      if (!this.hasOwnProperty(propName) || this[propName] === false) props[propName] = false
      if (this[propName] === '' || this[propName] === true) props[propName] = true
    } else {
      props[propName] = this[propName] 
    }
  }
  return props
}

HTMLElement.prototype.setProps = function (props = {}) {
  if (this.hasOwnProperty('setProperties') && typeof this.setProperties === 'function') {
    // Use Polymer's setProperties method.
    this.setProperties(props)
  } else {
    // Ensure both HTMLElement Properties and Attributes reflect props.
    Object.assign(this, props)
    for (let propKey in props) this.setAttribute(propKey, props[propKey])
  }
}

window.serializeElement = (element) => {
  let attributes = [].slice.call(element.attributes)
  let serial = {}
  attributes.forEach((attr) => serial[attr.name] = attr.value)
  return serial
}