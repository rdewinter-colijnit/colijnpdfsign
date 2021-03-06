exports.create = function() {
    var signatureAnchors = {
        signature_seller  : "Handtekening Verkoper",
        signature_buyer   : "Handtekening Koper"
    };

    var webservice = require("./webservice");

    var page = tabris.create("Page", {title: "Sign PDF"})
        .on("appear", function() {
            var doc_id = page.get('input')['doc_id'];
            pdf.set("url", webservice.getPdfUrl(doc_id));
            webservice.setUploadVars(pdf, doc_id);
        })
        .on("disappear", function() {
            saveAction.dispose();
        });

    var pdf = tabris.create("tabris.pdf", {
        layoutData: {left: 0, top: 0, right: 0, bottom: 0},
        mode: "SIGN",
        signatureAnchors: signatureAnchors,
        signatureFieldColor: [175, 175, 175],
        signatureFieldBox: [0, 25, 100, 50]
    });

    var saveAction = tabris.create("Action", {
        title: "Save",
        enabled: false,
        placementPriority: "high"
    }).on("select", function () {
        saveAction.set("enabled", false);
        pdf.save();
    });

    var signatures = 0;

    pdf.on("SignatureAdded", function() {
        signatures++;
        saveAction.set("enabled", Object.keys(signatureAnchors).length <= signatures);
    });

    pdf.on("SignatureRemoved", function() {
        saveAction.set("enabled", false);
    });

    pdf.appendTo(page);

    return page;
};
