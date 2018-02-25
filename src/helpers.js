function camelize(str) {
  return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
}

function uiColor(r, g, b, a) {
  let string = 'UIColor(';
  string += `red: ${r}/255, `;
  string += `green: ${g}/255, `;
  string += `blue: ${b}/255, `;
  string += `alpha: ${a})`;
  return string;
}

export function generateColorExtension(colors) {
  let string = 'import UIKit\n\n';
  string += 'extension UIColor {\n\n';
  Object.keys(colors).forEach(i => {
    const color = colors[i];
    string += '    ';
    string += 'static let ';
    string += color.name;
    string += ` = uiColor(color.r, color.g, color.b, color.a)\n`;
  });
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
  return uiColor(color.r, color.g, color.b, color.a) + cgColorPostfix;
}

export function generateFontExtension(textStyles) {
  let string = 'import UIKit\n\n';
  string += 'extension UIFont {\n\n';
  Object.keys(textStyles).forEach(i => {
    const style = textStyles[i];
    string += '    ';
    string += 'static func ';
    string += camelize(style.fontFace);
    string += `(ofSize: CGFloat) -> UIFont {\n
      return UIFont(name: "${style.fontFace}", `;
    string += 'size: size)!\n';
    string += '    }';
  });
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
  };
}

export function linearGradientLayer(gradient, project, useColorNames) {
  let string = 'let gradientLayer = CAGradientLayer()\n';
  string += 'gradientLayer.frame = view.bounds\n';
  if (gradient.angle === 90) {
    string += 'gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.5)\n';
    string += 'gradientLayer.endPoint = CGPoint(x: 1.0, y: 0.5)\n';
  }

  // Colors
  string += 'gradientLayer.colors = [';
  const colorStops = Object.keys(gradient.colorStops);
  colorStops.forEach((i, index) => {
    const colorStop = gradient.colorStops[i];
    string += cgColor(colorStop.color, project, useColorNames);
    if (index !== colorStops.length - 1) {
      string += ', ';
    }
  });
  string += ']\n';

  // Locations
  string += 'gradientLayer.locations = [';
  colorStops.forEach((i, index) => {
    const colorStop = gradient.colorStops[i];
    string += colorStop.position;
    if (index !== colorStops.length - 1) {
      string += ', ';
    }
  });
  string += ']\n';

  string += 'view.layer.insertSublayer(gradientLayer, at: 0)';
  return string;
}

export function radialGradientLayer(gradient, project, useColorNames) {
  let string = 'final class RadialGradientView: UIView {\n\n';
  string += `${' '.repeat(4)}private var radius: CGFloat {\n`;
  string += `${' '.repeat(8)}return min(bounds.width / 2, bounds.height / 2)\n`;
  string += `${' '.repeat(4)}}\n\n`;
  // Colors
  string += `${' '.repeat(4)}private let colors = [`;
  const colorStops = Object.keys(gradient.colorStops);
  colorStops.forEach((i, index) => {
    const colorStop = gradient.colorStops[i];
    string += cgColor(colorStop.color, project, useColorNames);
    if (index !== colorStops.length - 1) {
      string += ', ';
    }
  });
  string += ']\n\n';

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
