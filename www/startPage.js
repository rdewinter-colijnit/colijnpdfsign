var webservice = require("./webservice");

exports.create = function () {
    var pdfSelectionPage = require("./pdfSelectionPage");
    var inputs = {};
    var page = tabris.create("Page", {title: "Home", topLevel: true});
    var counter = Object.keys(webservice.credentials).length + 2;
    var height = 60, c = 0;

    var getTop = function(c) {
        return (screen.width / 2) - ((counter * height) / 2) + c * height;
    };

    tabris.device.on("change:orientation", function() {
        var c = 0;
        for (var i in inputs) {
            if (inputs.hasOwnProperty(i)) {
                inputs[i].top = getTop(c++);
                inputs[i].width = screen.width * 0.8;
            }
        }
        button.top = getTop(c);
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
                    width: screen.width * 0.8
                }
            }).appendTo(page);
        }
    }

    var button = tabris.create("Button", {
        background: "#cd1c2a",
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