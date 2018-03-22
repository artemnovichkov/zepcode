import {
  generateColorExtension,
  cgColorString,
  generateFontExtension,
  options,
  linearGradientLayer,
  radialGradientLayer,
} from './helpers';

function styleguideColors(context, colors) {
  return generateColorExtension(colors, options(context));
}

function styleguideTextStyles(context, textStyles) {
  return generateFontExtension(textStyles);
}

function layer(context, layerParams) {
  let string = '';
  if (layerParams.fills.length) {
    const { gradient } = layerParams.fills[0];
    if (gradient !== undefined) {
      switch (gradient.type) {
        case 'linear':
          string += linearGradientLayer(
            gradient,
            context.project,
            options(context)
          );
          break;
        case 'radial':
          string += radialGradientLayer(
            gradient,
            context.project,
            options(context)
          );
          break;
        default:
          break;
      }
    }
  }
  if (string.length > 0) {
    string += '\n\n';
  }
  if (layerParams.opacity !== 1) {
    string += `view.alpha = ${layerParams.opacity.toFixed(2)}\n`;
  }
  if (layerParams.borders.length > 0) {
    const border = layerParams.borders[0];
    string += `view.layer.borderWidth = ${border.thickness.toString()}\n`;
    const { color } = border.fill;
    if (color !== undefined) {
      const borderColorString = cgColorString(
        border.fill.color,
        context.project,
        options(context)
      );
      string += `view.layer.borderColor = ${borderColorString}\n`;
    }
  }
  if (layerParams.borderRadius > 0) {
    string += `view.layer.cornerRadius = ${layerParams.borderRadius}`;
  }
  if (layerParams.shadows.length > 0) {
    const shadow = layerParams.shadows[0];
    const { color } = shadow;
    if (color) {
      const shadowColor = cgColorString(
        shadow.color,
        context.project,
        options(context)
      );
      string += `view.layer.shadowColor = ${shadowColor}\n`;
    }
    string += `view.layer.shadowOffset = `;
    if (shadow.offsetX && shadow.offsetY) {
      string += `CGSize(width: ${shadow.offsetX}, height: ${shadow.offsetY})\n`;
    } else {
      string += `.zero\n`;
    }
    string += `view.layer.shadowRadius = ${layerParams.borderRadius}`;
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
  const { textOption } = options(context);
  return `${text}  ${textOption !== undefined ? textOption : ''}`;
}

function exportStyleguideColors(context, colors) {
  return generateColorExtension(colors);
}

function exportStyleguideTextStyles(context, textStyles) {
  return generateFontExtension(textStyles);
}

export default {
  layer,
  styleguideColors,
  styleguideTextStyles,
  exportStyleguideColors,
  exportStyleguideTextStyles,
  comment,
};
