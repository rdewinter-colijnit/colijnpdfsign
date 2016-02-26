exports.create = function() {
  var page = tabris.create("Page", {title: "Sign PDF"})
    .on("change:input", function(widget, pdfUrl, uploadUrl) {
      pdf.set("url", pdfUrl);
      pdf.set("uploadPath", uploadUrl);
      pdf.set("uploadFormData", {"test": "hi"});
    })
    .on("disappear", function() {
      saveAction.dispose();
    });

  var pdf = tabris.create("tabris.pdf", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    mode: "SIGN",
    signatureFieldColor: [200,180,200],
    signatureFieldBox: [0, 0, 160, 40],
    signatureAnchors: {
      "signature_buyer": "Client Signature",
      "Signature": "Client Signature"
    }
  });

  var saveAction = tabris.create("Action", {
    title: "Save",
    enabled: false,
    placementPriority: "high"
  }).on("select", function () {
    saveAction.set("enabled", false);
    pdf.save();
  });

  pdf.on("SignatureAdded", function() {
    saveAction.set("enabled", true);
  });

  pdf.on("SignatureRemoved", function() {
    saveAction.set("enabled", true);
  });

  pdf.appendTo(page);

  return page;
};
