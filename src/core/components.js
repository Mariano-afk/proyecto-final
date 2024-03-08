/**
 * @param {string} template
 * @param {{}} options
 * @return HTMLElement
 */
 function createComponent(template, options) {
    const DOMNode = stringToDOM(template);
    return DOMNode;
}

/**
 * @param {string} template
 * @return HTMLElement
 */
function stringToDOM(template) {
    const div = document.createElement('div');
    div.innerHTML = template;
    return div.firstChild;
}

export {
    createComponent,
}
