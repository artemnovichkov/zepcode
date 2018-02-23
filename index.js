function styleguideColors(context, colors) {
    return generateColorExtension(colors)
};

function styleguideTextStyles(context, textStyles) {
    return generateFontExtension(textStyles)
};

function layer(context, layer) {
    var string = ""
    if (layer.borders.length > 0) {
        var border = layer.borders[0]
        string = "view.layer.borderWidth = " + border.thickness.toString() + "\n"
        var color = border.fill.color
        string += "view.layer.borderColor = " + uiColor(color.r, color.g, color.b, color.a) + ".cgColor\n"
        string += "view.layer.cornerRadius = " + layer.borderRadius
    }
    if (layer.shadows.length > 0) {
        var shadow = layer.shadows[0]
        string += "\n\n"
        var color = shadow.color
        string += "view.layer.shadowColor = " + uiColor(color.r, color.g, color.b, color.a) + ".cgColor\n"
        string += "view.layer.shadowOffset = CGSize(width: " + shadow.offsetX + ", height: " + shadow.offsetY + ")\n"
        string += "view.layer.shadowRadius = " + layer.borderRadius
    }
    return {
        code: string,
        mode: "swift"
    }
};

function comment(context, text) {
    var textOption = context.getOption("text_option")
    return text + " " + textOption
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
    return str.replace(/\W+(.)/g, function(match, chr) {
          return chr.toUpperCase();
      });
  }