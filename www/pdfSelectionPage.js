/* globals fetch: false, Promise: true*/
var pdfPage = require("./pdfPage.js");
var parseString = require('xml2js').parseString;
var webservice = require("./webservice");

Promise = require("promise");
require("whatwg-fetch");

exports.create = function () {
    var handleChange = function () {
        fetch(webservice.getPdfsUrl())
            .then(function (response) {
               return response.text()
            })
            .then(function (response) {
                parseString(response, function (err, result) {
                    var items = parseDocuments(result);
                    collectionView.set("items", items);
                });
            })
            .catch(function (e) {
                messageTextView.set({visible: true, text: "Error: " + e});
            });
    };

    var parseDocuments = function (documents) {
        var items = [];
        if (documents && documents.root && documents.root['documents']) {
            documents = documents.root['documents'][0];
            if(documents) {
                var keys = Object.keys(documents);
                for (var i = 0, l = documents[keys[0]].length; i < l; i++) {
                    var item = {};
                    for(var ii = 0, ll = keys.length; ii < ll; ii++) {
                        item[keys[ii]] = documents[keys[ii]][i];
                    }
                    items.push(item);
                }
            }
            messageTextView.set({
                text: "No documents available.",
                visible: items.length <= 0
            });
        } else if(documents && documents.root && documents.root['error_message']) {
            messageTextView.set({
                text: documents.root['error_message'],
                visible: true
            });
        } else {
            messageTextView.set({
                text: "Something went wrong",
                visible: true
            });
        }
        return items;
    };

    var tapState = 0;
    var refreshing = false;

    var refresh = function() {
        if(!refreshing) {
            tapState += 2;
            refreshing = true;
            refreshButton.animate({
                    transform : {
                        rotation : -Math.PI * tapState
                    }
                }, {
                    delay : 0,
                    duration : 500,
                    repeat : 1
                }
            );
            setTimeout(function () {
                refreshing = false;
            }, 1500);
            handleChange();
        }
    };

    var page = tabris.create("Page", {title: "Select a .pdf from the list"}).on('appear', handleChange);

    var collectionView = tabris.create("CollectionView", {
        layoutData: {left: 0, top: 0, right: 0, bottom: 0},
        itemHeight: 80,
        initializeCell: function (cell) {
            tabris.create("ImageView", {
                image: {src: "images/Adobe_PDF_file_icon_32x32.png"},
                scaleMode: "fit",
                layoutData: {left: 24, top: 24, width: 32, height: 32}
            }).appendTo(cell);
            var title = tabris.create("TextView", {
                font: "bold 15px",
                layoutData: {left: 80, top: 20, width: 800, height: 40}
            }).appendTo(cell);
            cell.on("change:item", function (widget, item) {
                title.set("text", item['description'] + ' - ' + item['file_name'] + ' (' + item['doc_id'] + ')');
            });
        }
    });

    collectionView.on("select", function (widget, item) {
        pdfPage.create()
            .set("input", item)
            .open();
    }).appendTo(page);

    var messageTextView = tabris.create("TextView", {
        text: "Loading...",
        font: "38px",
        layoutData: {centerX: 0, centerY: 0}
    }).appendTo(page);

    var refreshButton = tabris.create("ImageView", {
        layoutData: {centerX: 0, bottom: 50},
        width : 75,
        height : 75,
        image: "images/refresh.png"
    }).on("tap", function() {
        refresh();
    }).appendTo(page);

    var interval = setInterval(function(){
        refresh();
    }, 30000);

    page.on('disappear', function() {
        clearInterval(interval);
    });

    return page;
};