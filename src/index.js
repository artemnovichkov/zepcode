import zepcode from './zepcode';

function container(context) {
  return 'styleguide' in context ? context.styleguide : context.project;
}

// Deprecated API
function styleguideColors(context, oldColors) {
  return zepcode(context).generateColorExtension(oldColors, false);
}

function styleguideTextStyles(context, oldTextStyles) {
  return zepcode(context).generateFontExtension(oldTextStyles);
}

function exportStyleguideColors(context, oldColors) {
  return zepcode(context).generateColorExtension(oldColors, true);
}

function exportStyleguideTextStyles(context, oldTextStyles) {
  return zepcode(context).generateFontExtension(oldTextStyles);
}

function comment(context, text) {
  return zepcode(context).commentString(text);
}

// New API
function colors(context) {
  const containerColors = container(context).colors;
  return zepcode(context).generateColorExtension(containerColors, false);
}

function textStyles(context) {
  const containerTextStyles = container(context).textStyles;
  return zepcode(context).generateFontExtension(containerTextStyles);
}

function exportColors(context) {
  const containerColors = container(context).colors;
  return zepcode(context).generateColorExtension(containerColors, true);
}

function exportTextStyles(context) {
  const containerTextStyles = container(context).textStyles;
  return zepcode(context).generateFontExtension(containerTextStyles);
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

export default {
  layer,
  colors,
  textStyles,
  exportColors,
  exportTextStyles,
  styleguideColors,
  styleguideTextStyles,
  exportStyleguideColors,
  exportStyleguideTextStyles,
  comment,
};
