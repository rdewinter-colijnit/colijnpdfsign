/* globals fetch: false, Promise: true*/
var pdfPage = require("./pdfPage.js");
Promise = require("promise");
require("whatwg-fetch");
var URI = require("urijs");

exports.create = function() {
  var page = tabris.create("Page", {title: "Select a .pdf from the list"})
    .on("change:input", function(page, serverUrl) {
      var unsignedListingUrl = new URI(serverUrl).segment("unsigned").toString();
      var uploadUrl = new URI(serverUrl).segment("signed").toString();
      this.set("unsignedListingUrl", unsignedListingUrl);
      this.set("uploadUrl", uploadUrl);

      fetch(unsignedListingUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          collectionView.set("items", response);
          messageTextView.set({
            text: response.length > 0 ? "" : "No .pdfs available.",
            visible: response.length <= 0,
          });
        })
        .catch(function(e) {
          messageTextView.set({visible: true, text: "Error: " + e});
        });
    });

  var collectionView = tabris.create("CollectionView", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    itemHeight: 80,
    initializeCell: function(cell) {
      var icon = tabris.create("ImageView", {
        image: {src: "images/Adobe_PDF_file_icon_32x32.png"},
        scaleMode: "fit",
        layoutData: {left:32, top: 8, width: 64, height: 64}
      }).appendTo(cell);
      var title = tabris.create("TextView", {
        font: "bold 22px",
        layoutData: {left: 140, top: 20, right: 20, height: 40}
      }).appendTo(cell);
      cell.on("change:item", function(widget, item) {
        title.set("text", item);
      });
    }
  });

  collectionView.on("select", function(widget, item) {
    var pdfUrl = new URI(page.get("unsignedListingUrl")).segment(item).toString();
    pdfPage.create()
           .set("input", pdfUrl, page.get("uploadUrl"))
           .open();
    }).appendTo(page);

  var messageTextView = tabris.create("TextView", {
    text: "Loading...",
    font: "38px",
    layoutData: {centerX: 0, centerY: 0}
  }).appendTo(page);

  return page;
};