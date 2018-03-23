import colorExtensionTemplate from './templates/color-extension';
import customColorTemplate from './templates/custom-color';
import colorTemplate from './templates/color';
import linearGradientTemplate from './templates/linear-gradient';
import radialGradientTemplate from './templates/radial-gradient';
import fontExtensionTemplate from './templates/font-extension';
import headerTemplate from './templates/header';
import shadowTemplate from './templates/shadow';
import customShadowTemplate from './templates/custom-shadow';

const zepcode = (() => {
  let instance;

  function init(privateContext) {
    let me;
    if (privateContext !== undefined) {
      me = {
        options: {
          useColorNames: privateContext.getOption('use_color_names'),
          useCustomColorInitializer: privateContext.getOption(
            'use_custom_color_initializer'
          ),
          useLayerShadowExtension: privateContext.getOption(
            'use_layer_shadow_extension'
          ),
        },
        project: privateContext.project,
      };
    }

    me.colorString = (color, postfix) => {
      const styleguideColor = me.project.findColorEqual(color);

      if (me.options.useColorNames && styleguideColor) {
        return `UIColor.${styleguideColor.name}${postfix}`;
      }
      if (me.options.useCustomColorInitializer) {
        return customColorTemplate(color) + postfix;
      }
      return colorTemplate(color) + postfix;
    };

    me.cgColorString = color => me.colorString(color, `.cgColor`);

    me.colorStopsString = gradient => {
      const { colorStops } = gradient;
      return colorStops
        .map(colorStop => me.cgColorString(colorStop.color))
        .join(', ');
    };

    me.linearGradientLayer = gradient =>
      linearGradientTemplate(gradient, me.colorStopsString(gradient));

    me.radialGradientLayer = gradient =>
      radialGradientTemplate(me.colorStopsString(gradient));

    me.commentString = text => {
      const { textOption } = me.options;
      return `${text}  ${textOption !== undefined ? textOption : ''}`;
    };

    me.generateColorExtension = (colors, needHeader) => {
      const fileName = 'UIColor+AppColors.swift';
      let string = '';
      if (needHeader) {
        string += headerTemplate(fileName, me.project.name);
        string += '\n\n';
      }
      string += colorExtensionTemplate(colors, needHeader, me.options);
      return {
        code: string,
        language: 'swift',
        filename: fileName,
      };
    };

    me.generateFontExtension = textStyles => {
      const uniqueFonts = Array.from(
        new Set(textStyles.map(style => style.fontFace))
      ).sort();

      return {
        code: fontExtensionTemplate(uniqueFonts),
        language: 'swift',
        filename: 'UIFont+AppFonts.swift',
      };
    };

    me.shadow = shadow => {
      if (me.options.useLayerShadowExtension) {
        const colorString = me.colorString(shadow.color, ``);
        return customShadowTemplate(shadow, colorString);
      }
      const colorString = me.cgColorString(shadow.color);
      return shadowTemplate(shadow, colorString);
    };

    return me;
  }

  return context => {
    if (!instance) {
      instance = init(context);
    }

    return instance;
  };
})();

export default zepcode;
