const shadowTemplate = (shadow, colorString) => `view.layer.shadowColor = ${colorString}
view.layer.shadowOpacity = 1
view.layer.shadowOffset = ${
    shadow.offsetX || shadow.offsetY
    ? `CGSize(width: ${shadow.offsetX}, height: ${shadow.offsetY})` 
    : `.zero`}
view.layer.shadowRadius = ${shadow.blurRadius} / 2
${
    shadow.spread > 0
    ? `let rect = view.bounds.insetBy(dx: ${-shadow.spread}, dy: ${-shadow.spread})
view.layer.shadowPath = UIBezierPath(rect: rect).cgPath`
    : `view.layer.shadowPath = nil`}`;

export default shadowTemplate;