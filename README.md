<p align="right">Built with <a href="https://github.com/baybara-pavel/zero">Zero</a></p>
<p align="center">
<img src=".github/zepcode-logo.png" width="400" />
</p>

<p align="center">
  <a href="https://extensions.zeplin.io">
    <img src="https://img.shields.io/badge/zeplin-extension-ffbe12.svg" alt="Zeplin Extension" />
  </a>
</p>
Generates Swift snippets from colors, fonts and layers.

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
  <details><summary>Example with custom initializer</summary>

  ```swift
  import UIKit

  extension UIColor {

        convenience init(r red: Int, g green: Int, b blue: Int, a: CGFloat = 1) {
            self.init(red: CGFloat(red) / 255, green: CGFloat(green) / 255, blue: CGFloat(blue) / 255, alpha: a)
        }

        static let electricBlue = UIColor(r: 0, g: 86, b: 255)
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
  
## Options

#### Use color names
Use color names from Color Palette or default `UIColor(red:green:blue:alpha:)` initializers.

#### Use custom color initializer
Use `UIColor(r:g:b:a:)` initializer.

## How to Install

Download and unzip [the latest release](https://github.com/artemnovichkov/zepcode/releases/).
Follow the instruction from official [tutorial](https://github.com/zeplin/zeplin-extension-documentation/blob/master/tutorial.md#adding-a-local-extension).

## How to make a changes

First, you need last stable Node.js `^8.9.4`. Follow this [guide](https://github.com/creationix/nvm/blob/master/README.md#installation) if you don't have any.

Next, install project dependencies:

```bash
npm i
```

To start developing run:

```bash
npm start
```

And finally, to make a production ready build run:

```bash
npm run build
```

## Authors

Artem Novichkov, novichkoff93@gmail.com [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/artemnovichkov?utm_source=github&utm_medium=button&utm_term=artemnovichkov&utm_campaign=github)

Baybara Pavel, baybara.pavel@gmail.com

## License

Zepcode is available under the MIT license. See the LICENSE file for more info.
