import colorString from './color';

const colorExtensionTemplate = (colors, needHeader, extensionOptions) =>`import UIKit

extension UIColor {
${
    extensionOptions.initializerStyle == 'custom'
    ? `\n    convenience init(r: Int, g: Int, b: Int, a: CGFloat = 1) { // swiftlint:disable:this identifier_name
        self.init(red: CGFloat(r) / 255,
                  green: CGFloat(g) / 255,
                  blue: CGFloat(b) / 255,
                  alpha: a)
    }\n`
	  : ``}
    ${colors.map(color => `static let ${color.name} = ${colorString(extensionOptions.initializerStyle, color)}`).join('\n    ')}
}
`;

export default colorExtensionTemplate;
