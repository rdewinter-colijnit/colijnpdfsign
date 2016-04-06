var startPage = require("./startPage.js");
var webservice = require("./webservice");
var pdfPage = require("./pdfPage.js");

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
    return this._nativeCall( "save", {} );
  }
});

tabris.ui.set({background : "#007dc2", textColor : "white"});

tabris.app.on("open", function(target, params) {
  params = params.url || '';
  params = params.replace('tabrispdfsign://', '');
  var action = params.split('?');
  if(action.length === 2) {
    params = action[1];
    if(action[0] === 'open') {
      var item = {};
      params = params.split('&');
      for(var i = 0, l = params.length; i < l; i++) {
        var keyval = params[i].split('=');
        if(keyval.length === 2) {
          if(keyval[0] === 'doc_id') {
            item.doc_id = keyval[1];
          } else {
            webservice.setVal(keyval[0], keyval[1]);
          }
        }
      }
      pdfPage.create().set("input", item).open();
    }
  }
});

startPage.create().open();
