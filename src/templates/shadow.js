import customColorTemplate from './custom-color';
import colorTemplate from './color';

const shadowTemplate = (shadow, colorString, extensionOptions) => `view.layer.shadowColor = ${colorString}
view.layer.shadowOpacity = 1
view.layer.shadowOffset = ${
    shadow.offsetX || shadow.offsetY
    ? `CGSize(width: ${shadow.offsetX}, height: ${shadow.offsetY})` 
    : `.zero`}
view.layer.shadowRadius = ${shadow.blurRadius} / 2
${
    shadow.spread > 0
    ? `let rect = bounds.insetBy(dx: ${-shadow.spread}, dy: ${-shadow.spread})
view.layer.shadowPath = UIBezierPath(rect: rect).cgPath`
    : `view.layer.shadowPath = nil`}`;

export default shadowTemplate;