var webservice = require("./webservice");

exports.create = function () {
    var pdfSelectionPage = require("./pdfSelectionPage");
    var inputs = {};
    var page = tabris.create("Page", {title: "Home", topLevel: true});

    var count = Object.keys(webservice.credentials).length + 1;
    var height = 60;
    var centerY = -(count / 2 * height), c = 0;

    var getTop = function(c, landscape) {
        return centerY + (c * 60) + ((landscape ? screen.width : screen.height) / 2 - height / 2);
    };

    tabris.device.on("change:orientation", function(device, orientation) {
        var c = 0;
        var landscape = orientation.indexOf('landscape') === 0;
        for (var i in inputs) {
            if (inputs.hasOwnProperty(i)) {
                inputs[i].top = getTop(c++, landscape);
                inputs[i].top = 0;
            }
        }
        button.top = getTop(c, landscape);
    });

    for (var i in webservice.credentials) {
        if (webservice.credentials.hasOwnProperty(i)) {
            inputs[i] = tabris.create("TextInput", {
                id: "textInput",
                text: webservice.getVal(i),
                alignment: "center",
                message: webservice.credentials[i],
                type: i === "PASSWORD" ? 'password' : 'default',
                layoutData: {
                    centerX: 0,
                    top: getTop(c++),
                    height: 50,
                    width: 300
                }
            }).appendTo(page);
        }
    }

    var button = tabris.create("Button", {
        background: "#FF6961",
        textColor: "white",
        text: "Select document",
        layoutData: {
            centerX: 0,
            top: getTop(c),
            height: 50,
            width: 300
        }
    }).on("select", function () {
        for (var i in webservice.credentials)
            if (webservice.credentials.hasOwnProperty(i))
                webservice.setVal(i, inputs[i].get("text"));

        pdfSelectionPage.create().set("input").open();
    }).appendTo(page);

    page.open();
    return page;
};