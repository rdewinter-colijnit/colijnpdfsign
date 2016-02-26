var startPage = require("./startPage.js");

tabris.registerWidget("tabris.pdf", {
  _properties: {
    url: "any",
    uploadPath: "any",
    uploadHeaders: "any",
    uploadFormData: "any",
    mode: "any",
    signatureAnchors : "any",
    signatureFieldColor: "any",
    signatureFieldBox: "any"
  },
  _events: {
    PreparePDFChange: true,
    SignatureAdded: true,
    SignatureRemoved: true,
    RequestStatusChanged: true,
    AnnotationChanged: true,
    InputDeviceStateChanged: true
  },

  save : function() {
    this._nativeCall( "save", {} );
  }
});

startPage.create().open();
