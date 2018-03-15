/* eslint-disable */
const fontExtensionTemplate = fonfacesString => `
import UIKit

extension UIFont {
${fonfacesString}
}`;

export default fontExtensionTemplate;
