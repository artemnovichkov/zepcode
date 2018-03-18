import colorExtensionTemplate from './templates/color-extension';
import customColorTemplate from './templates/custom-color';
import colorTemplate from './templates/color';
import linearGradientTemplate from './templates/linear-gradient';
import radialGradientTemplate from './templates/radial-gradient';
import fontExtensionTemplate from './templates/font-extension';

export default class Zepcode {
  constructor(context) {
    this.options = {
      useColorNames: context.getOption('use_color_names'),
      useCustomColorInitializer: context.getOption(
        'use_custom_color_initializer'
      ),
    };
    this.project = context.project;
  }

  cgColorString(color) {
    const styleguideColor = this.project.findColorEqual(color);
    const cgColorPostfix = '.cgColor';

    if (this.options.useColorNames && styleguideColor) {
      return `UIColor.${styleguideColor.name}${cgColorPostfix}`;
    }
    if (this.options.useCustomColorInitializer) {
      return customColorTemplate(color) + cgColorPostfix;
    }
    return colorTemplate(color) + cgColorPostfix;
  }

  colorStopsString(gradient) {
    const { colorStops } = gradient;
    colorStops.map(colorStop => this.cgColorString(colorStop.color)).join(', ');
  }

  linearGradientLayer(gradient) {
    return linearGradientTemplate(gradient, this.colorStopsString(gradient));
  }

  radialGradientLayer(gradient) {
    return radialGradientTemplate(this.colorStopsString(gradient));
  }

  commentString(text) {
    const { textOption } = this.options;
    return `${text}  ${textOption !== undefined ? textOption : ''}`;
  }

  generateColorExtension(colors) {
    return {
      code: colorExtensionTemplate(colors, this.options),
      language: 'swift',
      filename: 'UIColor+AppColors.swift',
    };
  }

  static generateFontExtension(textStyles) {
    const uniqueFonts = Array.from(
      new Set(textStyles.map(style => style.fontFace))
    ).sort();

    return {
      code: fontExtensionTemplate(uniqueFonts),
      language: 'swift',
      filename: 'UIFont+AppFonts.swift',
    };
  }
}
