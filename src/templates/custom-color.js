const customColorTemplate = color =>
  `UIColor(r: ${color.r}, g: ${color.g}, b: ${color.b}${
    color.a !== 1
      ? `, a: ${color.a}`
      : ``
  })`;

export default customColorTemplate;
