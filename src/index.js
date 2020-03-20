import zepcode from './zepcode';

function contextColors(context) {
  let allColors = [];
  if (context.styleguide === undefined) {
    allColors = allColors.concat(context.project.colors);
    if (context.project.linkedStyleguide !== undefined) {
      allColors = allColors.concat(context.project.linkedStyleguide.colors);
    }
  } else {
    allColors = allColors.concat(context.styleguide.colors);
  }
  return allColors;
}

// New API
function colors(context) {
  const projectColors = contextColors(context);
  return zepcode(context).generateColorExtension(projectColors, false);
}

function exportColors(context) {
  const projectColors = contextColors(context);
  return zepcode(context).generateColorExtension(projectColors, true);
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

// Deprecated API
function styleguideColors(context, oldColors) {
  return zepcode(context).generateColorExtension(oldColors, false);
}

function exportStyleguideColors(context, oldColors) {
  return zepcode(context).generateColorExtension(oldColors, true);
}

function comment(context, text) {
  return zepcode(context).commentString(text);
}

export default {
  layer,
  colors,
  exportColors,
  styleguideColors,
  exportStyleguideColors,
  comment,
};
