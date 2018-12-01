/*
 *  Takes a variable number of objects which contain a (string) name, a (string)
 *  id, and a (function) eventHandler.
 *  Generates an array of buttons based on the parameters given.
 *  Returns array of button elements.
 */
function createButtons(...buttonObjects) {
  return buttonObjects.map(object => {
    const button = document.createElement("button");
    if (object.extraClass) {
      button.classList.add(object.extraClass);
    }

    button.classList.add("button");
    button.innerText = object.name.split("-").join(" ");
    button.id = object.name;
    button.setAttribute("data-id", object.id)
    button.addEventListener("click", object.eventHandler);

    return button;
  });
}

// Add labels to an array of unlabelled input elements
function addLabels(elements) {
  return elements.map(el => {
    const label = document.createElement("label");
    let labelText = el.getAttribute("name");

    labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
    label.innerText = labelText;
    label.appendChild(el);

    return label;
  });
}

// Append an array of children to a parent
function appendChildren(parent, children) {
  children.forEach(el => parent.appendChild(el));
}

function clearChildren(parent) {
  while (parent.children[0]) {
    parent.children[0].remove();
  }
}

function setAttributes(element, attributes) {
  for (attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
}

module.exports = {
  createButtons,
  addLabels,
  appendChildren,
  clearChildren,
  setAttributes
}
