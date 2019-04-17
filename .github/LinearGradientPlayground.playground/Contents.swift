import PlaygroundSupport
import UIKit

final class LinearGradientLayer: CALayer {

    enum Direction {
        case vertical
        case horizontal
        case custom(start: CGPoint, end: CGPoint)

        var points: (start: CGPoint, end: CGPoint) {
            switch self {
            case .vertical:
                return (CGPoint(x: 0.5, y: 0.0), CGPoint(x: 0.5, y: 1.0))
            case .horizontal:
                return (CGPoint(x: 0.0, y: 0.5), CGPoint(x: 1.0, y: 0.5))
            case let .custom(start, end):
                return (start, end)
            }
        }
    }

    var direction: Direction = .vertical

    var colorSpace: CGColorSpace = CGColorSpaceCreateDeviceRGB()
    var colors: [CGColor]?
    var locations: [CGFloat]?

    var options: CGGradientDrawingOptions = CGGradientDrawingOptions(rawValue: 0)

    // MARK: - Lifecycle

    required override init() {
        super.init()
        masksToBounds = true
        needsDisplayOnBoundsChange = true
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }

    required override init(layer: Any) {
        super.init(layer: layer)
    }

    override func draw(in ctx: CGContext) {
        ctx.saveGState()

        guard let colors = colors, let gradient = CGGradient(colorsSpace: colorSpace,
                                                             colors: colors as CFArray, locations: locations) else { return }


        let points = direction.points
        ctx.drawLinearGradient(
            gradient,
            start: transform(points.start),
            end: transform(points.end),
            options: options
        )
    }

    // MARK: - Private

    private func transform(_ point: CGPoint) -> CGPoint {
        return CGPoint(x: bounds.width * point.x, y: bounds.height * point.y)
    }
}

final class GradientView: UIView {

    lazy var gradientLayer = layer as? LinearGradientLayer

    override class var layerClass: AnyClass {
        return LinearGradientLayer.self
    }

    func updateGradient(with direction: LinearGradientLayer.Direction, colors: UIColor...) {
        gradientLayer?.direction = direction
        gradientLayer?.colors = colors.map { color in
            color.cgColor
        }
    }
}

// MARK: - Example

let gradientView = GradientView(frame: CGRect(x: 0, y: 0, width: 200, height: 200))
let direction: LinearGradientLayer.Direction = .custom(start: CGPoint(x: 0, y: 0), end: CGPoint(x: 1, y: 1))
gradientView.updateGradient(with: direction, colors: .magenta, .purple, .cyan)

PlaygroundPage.current.liveView = gradientView
