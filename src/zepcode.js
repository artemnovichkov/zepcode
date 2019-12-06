import colorString from './templates/color';
import colorExtensionTemplate from './templates/color-extension';
import linearGradientTemplate from './templates/linear-gradient';
import radialGradientTemplate from './templates/radial-gradient';
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
          initializerStyle: privateContext.getOption('color_initializer_style'),
          useLayerShadowExtension: privateContext.getOption(
            'use_layer_shadow_extension'
          ),
        },
        project: privateContext.project,
      };
    }

    me.formattedColorString = (color, postfix = '') => {
      const styleguideColor = me.project.findColorEqual(color);

      if (me.options.useColorNames && styleguideColor) {
        return `UIColor.${styleguideColor.name}${postfix}`;
      }
      return colorString(me.options.initializerStyle, color);
    };

    me.cgColorString = color => me.formattedColorString(color, `.cgColor`);

    me.colorStopsString = gradient => {
      const { colorStops } = gradient;
      return colorStops
        .map(colorStop => me.formattedColorString(colorStop.color))
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

    me.shadow = shadow => {
      if (me.options.useLayerShadowExtension) {
        const formattedColorString = me.formattedColorString(shadow.color, ``);
        return customShadowTemplate(shadow, formattedColorString);
      }
      const cgColorString = me.cgColorString(shadow.color);
      return shadowTemplate(shadow, cgColorString);
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
