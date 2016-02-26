exports.create = function() {
  var pdfSelectionPage = require("./pdfSelectionPage");
  var url = localStorage.getItem("SERVER_URL");
  if(!url) {
    url = "https://tabrisjs.com/pdf-example/";
  }

  var page = tabris.create("Page", {title: "Home", topLevel: true});

  tabris.create("ImageView", {
    image: {"src": "images/Signing.png"},
    scaleMode: "fill",
    layoutData: {left: 0, top: 0, right: 0, bottom: [40, 0]}
  }).appendTo(page);

  tabris.create("TextView", {
    textColor: "white",
    markupEnabled: true,
    text: "<b>Define service url</b><br/>and start signing PDFs.",
    font: "38px",
    layoutData: {left: 20, bottom: [40, 20]}
  }).appendTo(page);

  var textInput = tabris.create("TextInput", {
    id: "textInput",
    message: "Path to the signed PDF",
    text: url,
    alignment: "center",
    layoutData: {centerX: 0, bottom: 200, height: 50, width: 300}
  }).appendTo(page);

  tabris.create("Button", {
    background: "#FF6961",
    textColor: "white",
    text: "Select document",
    layoutData: {
      centerX: 0,
      bottom: 100,
      height: 70,
      width: 300
    }
  }).on("select", function() {
    var currentUrl = textInput.get("text");
    localStorage.setItem("SERVER_URL", currentUrl);
    pdfSelectionPage.create().set("input", currentUrl).open();
  }).appendTo(page);

  page.open();
  return page;
};
