import Zepcode from './zepcode';

function styleguideColors(context, colors) {
  return new Zepcode(context).generateColorExtension(colors);
}

function styleguideTextStyles(context, textStyles) {
  return Zepcode.generateFontExtension(textStyles);
}

function layer(context, layerParams) {
  const zepcode = new Zepcode(context);
  let string = '';
  const newlineBeforeContent = () => (string.length ? '\n\n' : '');

  if (layerParams.fills.length) {
    const { gradient } = layerParams.fills[0];
    let gradientString = '';

    if (gradient !== undefined) {
      switch (gradient.type) {
        case 'linear':
          gradientString = zepcode.linearGradientLayer(gradient);
          break;
        case 'radial':
          gradientString = zepcode.radialGradientLayer(gradient);
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
      const borderColorString = zepcode.cgColorString(border.fill.color);
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
      const shadowColor = zepcode.cgColorString(shadow.color);
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
  return Zepcode.commentString(text);
}

function exportStyleguideColors(context, colors) {
  return new Zepcode(context).generateColorExtension(colors);
}

function exportStyleguideTextStyles(context, textStyles) {
  return Zepcode.generateFontExtension(textStyles);
}

export default {
  layer,
  styleguideColors,
  styleguideTextStyles,
  exportStyleguideColors,
  exportStyleguideTextStyles,
  comment,
};
