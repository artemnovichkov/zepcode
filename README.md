# Zepcode
Generates Swift snippets from colors, fonts and layers.

<p align="center">
<img src=".github/screenshot.png" />
</p>

## Features

- 🖍 Color pallette for iOS

  <details><summary>Example</summary>

  ```swift
  import UIKit

  extension UIColor {

      static let electricBlue = UIColor(red: 0/255, green: 86/255, blue: 255/255, alpha: 1)
  }
  ```
  </details>

- ✏️ Fonts for iOS

  <details><summary>Example</summary>

  ```swift
  import UIKit

  extension UIFont {

      static func BloggerSansBold(ofSize: CGFloat) -> UIFont {
          return UIFont(name: "BloggerSans-Bold", size: size)!
      }
  }
  ```

  </details>

- 🚧 Snippets for borders and corner radius

  <details><summary>Example</summary>

  ```swift
  view.layer.borderWidth = 4
  view.layer.borderColor = UIColor.white.cgColor
  view.layer.cornerRadius = 40
  ```

  </details>

- 🌚 Snippets for shadows

  <details><summary>Example</summary>

  ```swift
  view.layer.shadowColor = UIColor.black8.cgColor
  view.layer.shadowOffset = CGSize(width: 0, height: 4)
  view.layer.shadowRadius = 8
  ```

  </details>

- 🎨 Gradients (Work in progress)

  <details><summary>Linear gradient example</summary>

  ```swift
  let gradientLayer = CAGradientLayer()
  gradientLayer.frame = view.bounds
  gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.5)
  gradientLayer.endPoint = CGPoint(x: 1.0, y: 0.5)
  gradientLayer.colors = [UIColor.lightishRed.cgColor, UIColor.barbiePink.cgColor]
  gradientLayer.locations = [0, 1]
  view.layer.insertSublayer(gradientLayer, at: 0)
  ```

  </details>
   <details><summary>Radial gradient example</summary>

  ```swift
  final class RadialGradientView: UIView {
  
      private var radius: CGFloat {
          return min(bounds.width / 2, bounds.height / 2)
      }

      private let colors = [UIColor.red.cgColor, UIColor.neonGreen.cgColor]

      override init(frame: CGRect) {
          super.init(frame: frame)
          clipsToBounds = true
      }

      required init?(coder aDecoder: NSCoder) {
          fatalError("init(coder:) has not been implemented")
      }

      override func layoutSubviews() {
          super.layoutSubviews()
          layer.cornerRadius = radius
      }

      override func draw(_ rect: CGRect) {
          let context = UIGraphicsGetCurrentContext()

          let colorSpace = CGColorSpaceCreateDeviceRGB()
          let colorsCount = colors.count
          var locations = (0...colorsCount - 1).map { i in
              return CGFloat(i) / CGFloat(colorsCount)
          }

          guard let gradient = CGGradient(colorsSpace: colorSpace, colors: colors as CFArray, locations: locations) else {
              return
          }

          context?.drawRadialGradient(gradient,
                                     startCenter: center,
                                     startRadius: 0,
                                     endCenter: center,
                                     endRadius: radius,
                                     options: CGGradientDrawingOptions(rawValue: 0))
          }
  }
  ```

  </details>

## How to Install

The instruction from official [tutorial](https://github.com/zeplin/zeplin-extension-documentation/blob/master/tutorial.md#adding-a-local-extension).

## Author

Artem Novichkov, novichkoff93@gmail.com

[![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/artemnovichkov?utm_source=github&utm_medium=button&utm_term=artemnovichkov&utm_campaign=github)

## License

Zepcode is available under the MIT license. See the LICENSE file for more info.
