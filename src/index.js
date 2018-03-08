import {
  generateColorExtension,
  cgColor,
  generateFontExtension,
  options,
  linearGradientLayer,
  radialGradientLayer,
} from './helpers';

export function styleguideColors(context, colors) {
  return generateColorExtension(colors, options(context));
}

export function styleguideTextStyles(context, textStyles) {
  return generateFontExtension(textStyles);
}

export function layer(context, layerParams) {
  let string = '';
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
  if (layerParams.opacity !== 1) {
    if (string.length > 0) {
      string += '\n\n';
    }
    string += `view.alpha = ${layerParams.opacity.toFixed(2)}\n`;
  }
  if (layerParams.borders.length > 0) {
    const border = layerParams.borders[0];
    string += `view.layer.borderWidth = ${border.thickness.toString()}\n`;
    const { color } = border.fill;
    if (color !== undefined) {
      const borderColorString = cgColor(
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
    if (string.length > 0) {
      string += '\n\n';
    }
    const { color } = shadow;
    if (color) {
      const shadowColor = cgColor(
        shadow.color,
        context.project,
        options(context)
      );
      string += `view.layer.shadowColor = ${shadowColor}\n`;
    }
    string += `view.layer.shadowOffset = CGSize(width: ${
      shadow.offsetX
    }, height: ${shadow.offsetY})\n`;
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

export function comment(context, text) {
  const { textOption } = options(context);
  return `${text}  ${textOption !== undefined ? textOption : ''}`;
}

export function exportStyleguideColors(context, colors) {
  return generateColorExtension(colors);
}

export function exportStyleguideTextStyles(context, textStyles) {
  return generateFontExtension(textStyles);
}
