import colorExtensionTemplate from './templates/color-extension';
import customColorTemplate from './templates/custom-color';
import colorTemplate from './templates/color';
import linearGradientTemplate from './templates/linear-gradient';
import radialGradientTemplate from './templates/radial-gradient';

export function cgColorString(color, project, extensionOptions) {
  const styleguideColor = project.findColorEqual(color);
  const cgColorPostfix = '.cgColor';
  if (extensionOptions.useColorNames && styleguideColor) {
    return `UIColor.${styleguideColor.name}${cgColorPostfix}`;
  }
  if (extensionOptions.initializerStyle === 'custom') {
    return customColorTemplate(color) + cgColorPostfix;
  }
  return colorTemplate(color) + cgColorPostfix;
}

const colorStopsString = (colorStops, project, extensionOptions) =>
  colorStops
    .map(colorStop => cgColorString(colorStop.color, project, extensionOptions))
    .join(', ');

export function generateColorExtension(colors, extensionOptions) {
  return {
    code: colorExtensionTemplate(colors, extensionOptions),
    language: 'swift',
    filename: 'UIColor+AppColors.swift',
  };
}

export function linearGradientLayer(gradient, project, extensionOptions) {
  const { colorStops } = gradient;

  return linearGradientTemplate(
    gradient,
    colorStopsString(colorStops, project, extensionOptions)
  );
}

export function radialGradientLayer(gradient, project, extensionOptions) {
  const { colorStops } = gradient;
  return radialGradientTemplate(
    colorStopsString(colorStops, project, extensionOptions)
  );
}

export default {
  generateColorExtension,
  cgColorString,
  linearGradientLayer,
  radialGradientLayer,
};
