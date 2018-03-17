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

    lazy var gradientLayer: LinearGradientLayer = {
        let gradientLayer = LinearGradientLayer()
        gradientLayer.colors = [UIColor.magenta.cgColor,
                                UIColor.purple.cgColor,
                                UIColor.cyan.cgColor]
        return gradientLayer
    }()

    override init(frame: CGRect) {
        super.init(frame: frame)
        layer.insertSublayer(gradientLayer, at: 0)
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        layer.insertSublayer(gradientLayer, at: 0)
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        gradientLayer.frame = bounds
    }
}

// MARK: - Example

final class ViewController: UIViewController {

    private lazy var gradientView = GradientView(frame: .zero)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.addSubview(gradientView)
        gradientView.gradientLayer.direction = .custom(start: CGPoint(x: 0.0, y: 0),
                                                       end: CGPoint(x: 1.0, y: 1.0))
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        gradientView.frame = view.bounds
    }
}

PlaygroundPage.current.liveView = ViewController()

