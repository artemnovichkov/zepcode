const linearGradientTemplate = (gradient, colorStopsString) =>
  `import UIKit

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

    var colorSpace = CGColorSpaceCreateDeviceRGB()
    var colors: [CGColor]?
    var locations: [CGFloat]?

    var options: CGGradientDrawingOptions = CGGradientDrawingOptions(rawValue: 0)

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

    private func transform(_ point: CGPoint) -> CGPoint {
        return CGPoint(x: bounds.width * point.x, y: bounds.height * point.y)
    }
}

final class GradientView: UIView {

    lazy var gradientLayer = layer as! LinearGradientLayer

    override class var layerClass: AnyClass {
        return LinearGradientLayer.self
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        configure()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        configure()
    }

    func configure() {
        gradientLayer.colors = [${colorStopsString}]
    }
}`;

export default linearGradientTemplate;
