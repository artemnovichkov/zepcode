const literalColorTemplate = color =>
  `#colorLiteral(red: ${color.r/255}, green: ${color.g/255}, blue: ${color.b/255}, alpha: ${color.a})`;

export default literalColorTemplate;
