import zepcode from './zepcode';

function styleguideColors(context, colors) {
  return zepcode(context).generateColorExtension(colors, false);
}

function styleguideTextStyles(context, textStyles) {
  return zepcode(context).generateFontExtension(textStyles);
}

function layer(context, layerParams) {
  const zepcodeInstance = zepcode(context);
  let string = '';

  if (layerParams.fills.length) {
    const { gradient } = layerParams.fills[0];
    let gradientString = '';

    if (gradient !== undefined) {
      switch (gradient.type) {
        case 'linear':
          gradientString = zepcodeInstance.linearGradientLayer(gradient);
          break;
        case 'radial':
          gradientString = zepcodeInstance.radialGradientLayer(gradient);
          break;
        default:
          break;
      }
    }
    string += gradientString;
  }

  if (string.length) {
    string += `\n\n`;
  }

  if (layerParams.opacity !== 1) {
    const opacity = Math.round(layerParams.opacity * 100) / 100;
    string += `view.alpha = ${opacity}`;
  }

  if (layerParams.borders.length) {
    const border = layerParams.borders[0];
    const { color } = border.fill;
    string += `\nview.layer.borderWidth = ${border.thickness.toString()}`;

    if (color !== undefined) {
      const borderColorString = zepcodeInstance.cgColorString(
        border.fill.color
      );
      string += `\nview.layer.borderColor = ${borderColorString}`;
    }
  }

  if (layerParams.borderRadius > 0) {
    string += `\nview.layer.cornerRadius = ${layerParams.borderRadius}`;
  }

  if (layerParams.shadows.length) {
    const shadow = layerParams.shadows[0];
    string += `\n${zepcodeInstance.shadow(shadow)}`;
  }

  let result = {};
  if (string.length) {
    result = {
      code: string,
      mode: 'swift',
    };
  }
  return result;
}

function comment(context, text) {
  return zepcode(context).commentString(text);
}

function exportStyleguideColors(context, colors) {
  return zepcode(context).generateColorExtension(colors, true);
}

function exportStyleguideTextStyles(context, textStyles) {
  return zepcode(context).generateFontExtension(textStyles);
}

export default {
  layer,
  styleguideColors,
  styleguideTextStyles,
  exportStyleguideColors,
  exportStyleguideTextStyles,
  comment,
};
