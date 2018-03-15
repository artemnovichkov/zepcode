import colorExtensionTemplate from './templates/color-extension';
import customColorTemplate from './templates/custom-color';
import colorTemplate from './templates/color';
import linearGradientTemplate from './templates/linear-gradient';
import radialGradientTemplate from './templates/radial-gradient';

function camelize(str) {
  return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
}

function uiColor(color) {
  return colorTemplate(color);
}

function customUIColor(color) {
  return customColorTemplate(color);
}

export function generateColorExtension(colors, extensionOptions) {
  return {
    code: colorExtensionTemplate(colors, extensionOptions),
    mode: 'swift',
    filename: 'UIColor+AppColors.swift',
  };
}

export function cgColor(color, project, extensionOptions) {
  const styleguideColor = project.findColorEqual(color);
  const cgColorPostfix = '.cgColor';
  if (extensionOptions.useColorNames && styleguideColor) {
    return `UIColor.${styleguideColor.name}${cgColorPostfix}`;
  }
  if (extensionOptions.useCustomColorInitializer) {
    return customUIColor(color) + cgColorPostfix;
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
    useCustomColorInitializer: context.getOption(
      'use_custom_color_initializer'
    ),
  };
}

export function linearGradientLayer(gradient, project, extensionOptions) {
  const { colorStops } = gradient;
  const colorStopsString = colorStops
    .map(colorStop => cgColor(colorStop.color, project, extensionOptions))
    .join(', ');
  const colorStopsPositionString = colorStops
    .map((colorStop, index) => `${index}`)
    .join(', ');

  return linearGradientTemplate(
    gradient,
    colorStopsString,
    colorStopsPositionString
  );
}

export function radialGradientLayer(gradient, project, extensionOptions) {
  const { colorStops } = gradient;
  const colorStopsString = colorStops
    .map(colorStop => cgColor(colorStop.color, project, extensionOptions))
    .join(', ');

  return radialGradientTemplate(colorStopsString);
}

export default {
  generateColorExtension,
  cgColor,
  generateFontExtension,
  options,
  linearGradientLayer,
  radialGradientLayer,
};
