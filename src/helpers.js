function camelize(str) {
  return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
}

function uiColor(color) {
  return `UIColor(red: ${color.r}/255, green: ${color.g}/255, blue: ${
    color.b
  }/255, alpha: ${color.a})`;
}

export function generateColorExtension(colors) {
  let colorsString = '';
  colors.forEach(color => {
    colorsString += `${' '.repeat(4)}static let ${color.name} = ${uiColor(
      color
    )}\n`;
  });

  let string = 'import UIKit\n\n';
  string += 'extension UIColor {\n\n';
  string += colorsString;
  string += '}';

  return {
    code: string,
    mode: 'swift',
    filename: 'UIColor+AppColors.swift',
  };
}

export function cgColor(color, project, useColorNames) {
  const styleguideColor = project.findColorEqual(color);
  const cgColorPostfix = '.cgColor';
  if (useColorNames && styleguideColor) {
    return `UIColor.${styleguideColor.name}${cgColorPostfix}`;
  }
  return uiColor(color) + cgColorPostfix;
}

export function generateFontExtension(textStyles) {
  const uniqueFonts = Array.from(
    new Set(textStyles.map(style => style.fontFace))
  ).sort();

  const fonfacesFunctions = uniqueFonts.map(styleName => {
    let result = '';
    result += `${' '.repeat(4)}static func ${camelize(
      styleName
    )}(ofSize: CGFloat) -> UIFont {\n`;
    result += `${' '.repeat(8)}`;
    result += `return UIFont(name: "${styleName}", size: size)!\n`;
    result += `${' '.repeat(4)}}`;
    return result;
  });

  let string = 'import UIKit\n\n';
  string += 'extension UIFont {\n';
  string += fonfacesFunctions.join('\n');
  string += '\n}';

  return {
    code: string,
    mode: 'swift',
    filename: 'UIFont+AppFonts.swift',
  };
}

export function options(context) {
  return {
    useColorNames: context.getOption('use_color_names'),
    linearGradientClassName: context.getOption('linear_gradient_class_name'),
  };
}

export function linearGradientLayer(
  gradient,
  project,
  useColorNames,
  gradientClassName
) {
  let colorStopsString = '';
  let colorStopsPositionString = '';
  const { colorStops } = gradient;
  colorStops.forEach((colorStop, index) => {
    const divideString = `${index !== colorStops.length - 1 ? ', ' : ''}`;
    colorStopsString += `${cgColor(
      colorStop.color,
      project,
      useColorNames
    )}${divideString}`;
    colorStopsPositionString += `${colorStop.position}${divideString}`;
  });

  let string = `let gradientLayer = ${gradientClassName}()\n`;
  string += 'gradientLayer.frame = view.bounds\n';
  if (gradient.angle === 90) {
    string += 'gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.5)\n';
    string += 'gradientLayer.endPoint = CGPoint(x: 1.0, y: 0.5)\n';
  }

  // Colors
  string += `gradientLayer.colors = [${colorStopsString}]\n`;

  // Locations
  string += `gradientLayer.locations = [${colorStopsPositionString}]\n`;

  string += 'view.layer.insertSublayer(gradientLayer, at: 0)';
  return string;
}

export function radialGradientLayer(gradient, project, useColorNames) {
  const { colorStops } = gradient;
  let colorStopsString = '';
  colorStops.forEach((colorStop, index) => {
    colorStopsString += cgColor(colorStop.color, project, useColorNames);
    colorStopsString += `${index !== colorStops.length - 1 ? ', ' : ''}`;
  });

  let string = 'final class RadialGradientView: UIView {\n\n';
  string += `${' '.repeat(4)}private var radius: CGFloat {\n`;
  string += `${' '.repeat(8)}return min(bounds.width / 2, bounds.height / 2)\n`;
  string += `${' '.repeat(4)}}\n\n`;
  // Colors
  string += `${' '.repeat(4)}private let colors = [${colorStopsString}]\n\n`;

  // Inits
  string += `${' '.repeat(4)}override init(frame: CGRect) {\n`;
  string += `${' '.repeat(8)}super.init(frame: frame)\n`;
  string += `${' '.repeat(8)}clipsToBounds = true\n`;
  string += `${' '.repeat(4)}}\n\n`;

  string += `${' '.repeat(4)}required init?(coder aDecoder: NSCoder) {\n`;
  string += `${' '.repeat(
    8
  )}fatalError("init(coder:) has not been implemented")\n`;
  string += `${' '.repeat(4)}}\n\n`;

  // layoutSubviews
  string += `${' '.repeat(4)}override func layoutSubviews() {\n`;
  string += `${' '.repeat(8)}super.layoutSubviews()\n`;
  string += `${' '.repeat(8)}layer.cornerRadius = radius\n`;
  string += `${' '.repeat(4)}}\n\n`;

  //  Draw rect
  string += `${' '.repeat(4)}override func draw(_ rect: CGRect) {\n`;
  string += `${' '.repeat(8)}let context = UIGraphicsGetCurrentContext()\n\n`;
  string += `${' '.repeat(8)}let colorSpace = CGColorSpaceCreateDeviceRGB()\n`;
  string += `${' '.repeat(8)}let colorsCount = colors.count\n`;
  string += `${' '.repeat(
    8
  )}var locations = (0...colorsCount - 1).map { i in\n`;
  string += `${' '.repeat(12)}return CGFloat(i) / CGFloat(colorsCount)\n`;
  string += `${' '.repeat(8)}}\n\n`;
  string += `${' '.repeat(
    8
  )}guard let gradient = CGGradient(colorsSpace: colorSpace, colors: colors as CFArray, locations: locations) else {\n`;
  string += `${' '.repeat(12)}return\n`;
  string += `${' '.repeat(8)}}\n\n`;
  string += `${' '.repeat(8)}context?.drawRadialGradient(gradient,\n`;
  string += `${' '.repeat(35)}startCenter: center,\n`;
  string += `${' '.repeat(35)}startRadius: 0,\n`;
  string += `${' '.repeat(35)}endCenter: center,\n`;
  string += `${' '.repeat(35)}endRadius: radius,\n`;
  string += `${' '.repeat(
    35
  )}options: CGGradientDrawingOptions(rawValue: 0))\n`;
  string += `${' '.repeat(8)}}\n`;
  string += '}\n';
  return string;
}

export default {
  generateColorExtension,
  cgColor,
  generateFontExtension,
  options,
  linearGradientLayer,
  radialGradientLayer,
};
