function layer(context, layer) {
    var shadow = {
        "blur": layer.shadows[0].blurRadius.toString()
    }

    var JSONString = JSON.stringify(shadow, null, 2);

    return {
        code: JSONString,
        language: "json"
    }
};