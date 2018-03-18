import {
  generateColorExtension,
  cgColorString,
  generateFontExtension,
  linearGradientLayer,
  radialGradientLayer,
} from './helpers';
import getOptions from './options';

function styleguideColors(context, colors) {
  return generateColorExtension(colors, getOptions(context));
}

function styleguideTextStyles(context, textStyles) {
  return generateFontExtension(textStyles);
}

function layer(context, layerParams) {
  let string = '';
  const newlineBeforeContent = () => (string.length ? '\n\n' : '');

  if (layerParams.fills.length) {
    const { gradient } = layerParams.fills[0];
    let gradientString = '';

    if (gradient !== undefined) {
      switch (gradient.type) {
        case 'linear':
          gradientString = linearGradientLayer(
            gradient,
            context.project,
            getOptions(context)
          );
          break;
        case 'radial':
          gradientString = radialGradientLayer(
            gradient,
            context.project,
            getOptions(context)
          );
          break;
        default:
          break;
      }
    }
    string += gradientString;
  }

  if (layerParams.opacity !== 1) {
    string += `${newlineBeforeContent()}view.alpha = ${layerParams.opacity.toFixed(
      2
    )}\n`;
  }

  if (layerParams.borders.length) {
    const border = layerParams.borders[0];
    const { color } = border.fill;
    string += `view.layer.borderWidth = ${border.thickness.toString()}\n`;

    if (color !== undefined) {
      const borderColorString = cgColorString(
        border.fill.color,
        context.project,
        getOptions(context)
      );
      string += `view.layer.borderColor = ${borderColorString}\n`;
    }
  }

  if (layerParams.borderRadius > 0) {
    string += `${newlineBeforeContent()}view.layer.cornerRadius = ${
      layerParams.borderRadius
    }`;
  }

  if (layerParams.shadows.length) {
    const shadow = layerParams.shadows[0];
    const { color } = shadow;
    string += newlineBeforeContent();

    if (color !== undefined) {
      const shadowColor = cgColorString(
        shadow.color,
        context.project,
        getOptions(context)
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
  const { textOption } = getOptions(context);
  return `${text}  ${textOption !== undefined ? textOption : ''}`;
}

function exportStyleguideColors(context, colors) {
  return generateColorExtension(colors, getOptions(context));
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
