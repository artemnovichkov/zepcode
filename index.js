function styleguideColors(context, colors) {
    return generateColorExtension(colors)
};

function styleguideTextStyles(context, textStyles) {
    return generateFontExtension(textStyles)
};

function layer(context, layer) {
    var shadow = {
        "blur": layer.shadows[0].blurRadius.toString()
    }

    var JSONString = JSON.stringify(shadow, null, 2);

    return {
        code: JSONString,
        mode: "json"
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
        string += " = UIColor("
        string += "red: " + color.r + "/255, "
        string += "green: " + color.g + "/255, "
        string += "blue: " + color.b + "/255, "
        string += "alpha: " + color.a + ")\n"
    }
    string += "}"
    
    return {
        code: string,
        mode: "swift",
        filename: "UIColor+AppColors.swift"
    }
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