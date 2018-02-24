function styleguideColors(context, colors) {
    return generateColorExtension(colors)
};

function styleguideTextStyles(context, textStyles) {
    return generateFontExtension(textStyles)
};

function layer(context, layer) {
    var string = ""
    var useColorNames = options(context).useColorNames
    var gradient = layer.fills[0].gradient
    if (gradient) {
        switch (gradient.type) {
            case "linear":
                string += linearGradientLayer(gradient, context.project, useColorNames)
            case "radial":
                string += radialGradientLayer(gradient, context.project, useColorNames)
        }
    }
    if (layer.borders.length > 0) {
        var border = layer.borders[0]
        if (string.length > 0) {
            string += "\n\n"
        }
        string += "view.layer.borderWidth = " + border.thickness.toString() + "\n"
        string += "view.layer.borderColor = "
        var color = border.fill.color
        if (color) {
            string += cgColor(border.fill.color, context.project, useColorNames) + "\n"
        }
        string += "view.layer.cornerRadius = " + layer.borderRadius
    }
    if (layer.shadows.length > 0) {
        var shadow = layer.shadows[0]
        if (string.length > 0) {
            string += "\n\n"
        }
        string += "view.layer.shadowColor = "
        var color = shadow.color
        if (color) {
            string += cgColor(shadow.color, context.project, useColorNames) + "\n"
        }
        string += "view.layer.shadowOffset = CGSize(width: " + shadow.offsetX + ", height: " + shadow.offsetY + ")\n"
        string += "view.layer.shadowRadius = " + layer.borderRadius
    }
    return {
        code: string,
        mode: "swift"
    }
};

function comment(context, text) {
    return text + " " + options(context).textOption
};

function exportStyleguideColors(context, colors) {
    return generateColorExtension(colors)
};

function exportStyleguideTextStyles(context, textStyles) {
    return generateFontExtension(textStyles)
};

// Help functions

function generateColorExtension(colors) {
    var string = "import UIKit\n\n"
    string += "extension UIColor {\n\n"
    for (var i in colors) {
        var color = colors[i]
        string += " ".repeat(4)
        string += "static let "
        string += color.name
        string += " = " + uiColor(color.r, color.g, color.b, color.a) + "\n"
    }
    string += "}"

    return {
        code: string,
        mode: "swift",
        filename: "UIColor+AppColors.swift"
    }
}

function uiColor(r, g, b, a) {
    var string = "UIColor("
    string += "red: " + r + "/255, "
    string += "green: " + g + "/255, "
    string += "blue: " + b + "/255, "
    string += "alpha: " + a + ")"
    return string
}

function cgColor(color, project, useColorNames) {
    var styleguideColor = project.findColorEqual(color)
    var cgColorPostfix = ".cgColor"
    if (useColorNames && styleguideColor) {
        return "UIColor." + styleguideColor.name + cgColorPostfix
    }
    return uiColor(color.r, color.g, color.b, color.a) + cgColorPostfix
}

function generateFontExtension(textStyles) {
    var string = "import UIKit\n\n"
    string += "extension UIFont {\n\n"
    for (var i in textStyles) {
        var style = textStyles[i]
        string += "    "
        string += "static func "
        string += camelize(style.fontFace)
        string += "(ofSize: CGFloat) -> UIFont {\n" + " ".repeat(8) + "return UIFont(name: \"" + style.fontFace + "\", "
        string += "size: size)!\n"
        string += "    }"
    }
    string += "\n}"

    return {
        code: string,
        mode: "swift",
        filename: "UIFont+AppFonts.swift"
    }
}

function camelize(str) {
    return str.replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
    });
}

function options(context) {
    return {
        useColorNames: context.getOption("use_color_names")
    }
}

function linearGradientLayer(gradient, project, useColorNames) {
    var string = "let gradientLayer = CAGradientLayer()\n"
    string += "gradientLayer.frame = view.bounds\n"
    if (gradient.angle == 90) {
        string += "gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.5)\n"
        string += "gradientLayer.endPoint = CGPoint(x: 1.0, y: 0.5)\n"
    }

    //Colors
    string += "gradientLayer.colors = ["
    for (var i in gradient.colorStops) {
        var colorStop = gradient.colorStops[i]
        string += cgColor(colorStop.color, project, useColorNames)
        if (i != gradient.colorStops.length - 1) {
            string += ", "
        }
    }
    string += "]\n"

    //Locations
    string += "gradientLayer.locations = ["
    for (var i in gradient.colorStops) {
        var colorStop = gradient.colorStops[i]
        string += colorStop.position
        if (i != gradient.colorStops.length - 1) {
            string += ", "
        }
    }
    string += "]\n"

    string += "view.layer.insertSublayer(gradientLayer, at: 0)"
    return string
}

function radialGradientLayer(gradient, project, useColorNames) {
    var string = "final class RadialGradientView: UIView {\n\n"

    string += " ".repeat(4) + "private var radius: CGFloat {\n" + " ".repeat(8) + "return min(bounds.width / 2, bounds.height / 2)\n"
    string += " ".repeat(4) + "}\n\n"
    //Colors
    string += " ".repeat(4) + "private let colors = ["
    for (var i in gradient.colorStops) {
        var colorStop = gradient.colorStops[i]
        string += cgColor(colorStop.color, project, useColorNames)
        if (i != gradient.colorStops.length - 1) {
            string += ", "
        }
    }
    string += "]\n\n"

    //Inits
    string += " ".repeat(4) + "override init(frame: CGRect) {\n"
    string += " ".repeat(8) + "super.init(frame: frame)\n"
    string += " ".repeat(8) + "clipsToBounds = true\n"
    string += " ".repeat(4) + "}\n\n"

    string += " ".repeat(4) + "required init?(coder aDecoder: NSCoder) {\n"
    string += " ".repeat(8) + "fatalError(\"init(coder:) has not been implemented\")\n"
    string += " ".repeat(4) + "}\n\n"

    //layoutSubviews
    string += " ".repeat(4) + "override func layoutSubviews() {\n"
    string += " ".repeat(8) + "super.layoutSubviews()\n"
    string += " ".repeat(8) + "layer.cornerRadius = radius\n"
    string += " ".repeat(4) + "}\n\n"

    //Draw rect
    string += " ".repeat(4) + "override func draw(_ rect: CGRect) {\n"
    string += " ".repeat(8) + "let context = UIGraphicsGetCurrentContext()\n\n"
    string += " ".repeat(8) + "let colorSpace = CGColorSpaceCreateDeviceRGB()\n"
    string += " ".repeat(8) + "let colorsCount = colors.count\n"
    string += " ".repeat(8) + "var locations = (0...colorsCount - 1).map { i in\n"
    string += " ".repeat(12) + "return CGFloat(i) / CGFloat(colorsCount)\n"
    string += " ".repeat(8) + "}\n\n"
    string += " ".repeat(8) + "guard let gradient = CGGradient(colorsSpace: colorSpace, colors: colors as CFArray, locations: locations) else {\n"
    string += " ".repeat(12) + "return\n"
    string += " ".repeat(8) + "}\n\n"
    string += " ".repeat(8) + "context?.drawRadialGradient(gradient,\n"
    string += " ".repeat(35) + "startCenter: center,\n"
    string += " ".repeat(35) + "startRadius: 0,\n"
    string += " ".repeat(35) + "endCenter: center,\n"
    string += " ".repeat(35) + "endRadius: radius,\n"
    string += " ".repeat(35) + "options: CGGradientDrawingOptions(rawValue: 0))\n"
    string += " ".repeat(8) + "}\n"
    string += "}\n"
    return string
}