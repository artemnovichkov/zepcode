import customColorTemplate from './custom-color';
import colorTemplate from './color';

const colorExtensionTemplate = (colors, extensionOptions) =>`import UIKit

extension UIColor {
    ${
	  extensionOptions.useCustomColorInitializer
	  ? `\n    convenience init(r red: Int, g green: Int, b blue: Int, a: CGFloat = 1) {
        self.init(red: CGFloat(red) / 255, green: CGFloat(green) / 255, blue: CGFloat(blue) / 255, alpha: a)
    }\n`
	  : ``}
	  ${colors.map(color => `static let ${color.name} = ${
      extensionOptions.useCustomColorInitializer
        ? customColorTemplate(color)
        : colorTemplate(color)
    }`).join('\n    ')}
}`;

export default colorExtensionTemplate;
