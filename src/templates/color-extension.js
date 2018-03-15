import customUiColorTemplate from './custom-ui-color';
import uiColorTemplate from './ui-color';

/* eslint-disable */
const colorExtensionTemplate = (colors, extensionOptions) => `
import UIKit

extension UIColor {

    convenience init(r red: Int, g green: Int, b blue: Int, a: CGFloat = 1) {
        self.init(red: CGFloat(red) / 255, green: CGFloat(green) / 255, blue: CGFloat(blue) / 255, alpha: a)
    }

    ${colors
      .map(
        color => `static let ${color.name} = ${
          extensionOptions.useCustomColorInitializer
            ? customUiColorTemplate(color)
            : uiColorTemplate(color)
        }
    `
      )
      .join('')}
}
`;

export default colorExtensionTemplate;
