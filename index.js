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
    if (gradient && gradient.type == "linear") {
        string += linearGradientLayer(gradient, context.project, useColorNames)
    }
    if (layer.borders.length > 0) {
        var border = layer.borders[0]
        string = "view.layer.borderWidth = " + border.thickness.toString() + "\n"
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
        string += "    "
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
        string += "(ofSize: CGFloat) -> UIFont {\n        return UIFont(name: \"" + style.fontFace + "\", "
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
        textOption: context.getOption("text_option"),
        useColorNames: context.getOption("use_color_names"),
        pickerOption: context.getOption("picker_option")
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