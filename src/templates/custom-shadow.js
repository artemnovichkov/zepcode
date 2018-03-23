const customShadowTemplate = (shadow, colorString) => `view.layer.makeShadow(color: ${colorString}${
    shadow.offsetX ? `,
                      x: ${shadow.offsetX}` : ``
}${
    shadow.offsetY ? `,
                      y: ${shadow.offsetY}` : ``
}${
    shadow.blurRadius ? `,
                      blur: ${shadow.blurRadius}` : ``
}${
    shadow.spread ? `,
                      spread: ${shadow.spread}` : ``
})`;

export default customShadowTemplate;