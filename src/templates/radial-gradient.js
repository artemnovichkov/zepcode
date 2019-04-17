/* eslint-disable */
const radialGradientTemplate = colorStopsString => `
import UIKit
    
final class RadialGradientView: UIView {

    private var radius: CGFloat {
        return min(bounds.width / 2, bounds.height / 2)
    }
    
    private let colors: [UIColor] = [${colorStopsString}]

    var options: CGGradientDrawingOptions = CGGradientDrawingOptions(rawValue: 0)

    // MARK: - Lifecycle
    
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
        let locations = (0..<colorsCount).map { i in
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
                                    options: options)
    }
}`;

export default radialGradientTemplate;
