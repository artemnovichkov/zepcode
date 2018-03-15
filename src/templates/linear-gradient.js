/* eslint-disable */
const linearGradientTemplate = (
  gradient,
  colorStopsString,
  colorStopsPositionString
) =>
  `let gradientLayer = CAGradientLayer()
gradientLayer.frame = view.bounds${
    gradient.angle === 90
      ? `
gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.5)
gradientLayer.endPoint = CGPoint(x: 1.0, y: 0.5)`
      : ``
  }
gradientLayer.colors = [${colorStopsString}]
gradientLayer.locations = [${colorStopsPositionString}]
view.layer.insertSublayer(gradientLayer, at: 0)`;

export default linearGradientTemplate;
