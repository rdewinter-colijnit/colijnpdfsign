const {ui, Page, Action, device} = require('tabris');
const PdfWidget = require('tabris-windows-pdf-widget').PdfWidget;
const URI = require('urijs');
const navigation = require('./navigation');

var webservice = require("./webservice");

module.exports = class PdfPage extends Page {

    constructor({serverUrl, selectedPdfUrl, selectedPDF}) {
        super();
        this._pdfUrl = selectedPdfUrl;
        this._pdfID = selectedPDF.doc_id;
        this._selectedPDF = selectedPDF;
        this._uploadPath = new URI(serverUrl).segment('signed').toString();
        this._createUI();
        this._applyLayout();
        this.once('appear', () => this._createSaveAction());
        this.once('disappear', () => ui.find('#saveAction').first().dispose());
    }

    _createUI() {
        var currentPDFWidget = this._createPdfView({id: 'pdfView'});
        currentPDFWidget.on('signatureAdded', () => ui.find('#saveAction').first().enabled = true);
        currentPDFWidget.on('signatureRemoved', () => ui.find('#saveAction').first().enabled = true);


        this.append(
            currentPDFWidget
        );    

    }

    //TODO add handlers for android and iphone
    _createPdfView({id}) {

        if (device.platform === 'windows') {

            //it now creates the uploadvars in a slightly different sequence because in windows it works differently
            
            return new PdfWidget({
                id,
                url: this._pdfUrl,
                left: 440, top: 440, right: 0, bottom: 0,
                mode: 'SIGN',
                uploadFormData: webservice.createUploadVars(this._pdfID),
                uploadPath: webservice.getUploadPath(),
                fileName: this._selectedPDF.file_name, 
                signatureFieldColor: '#c8b4c8',
                signatureFieldBox: [55, 55, 160, 60],
                signatureAnchors: {
                    signature_seller: "Handtekening Verkoper",
                    signature_buyer: "Handtekening Koper"
                }
            });
        } else {
            return new diwosign.PdfView({
                id,
                url: this._pdfUrl,
                left: 0, top: 0, right: 0, bottom: 0,
                mode: 'SIGN',
                uploadPath: webservice.getUploadPath(),              
                uploadFormData: webservice.createUploadVars(this._pdfID),
                signatureFieldColor: '#a9c8b1',
                signatureFieldBox: [0, 0, 160, 40],
                signatureAnchors: {
                    signature_seller: "Handtekening Verkoper",
                    signature_buyer: "Handtekening Koper"
                }
            });
        }
    }

    _createSaveAction() {
        new Action({id: 'saveAction', title: 'Save', enabled: false, placementPriority: 'high'})
            .on('select', ({target}) => {
                const firstPdfView = this.find('#pdfView').first();
                firstPdfView.save();
                target.enabled = false;
            })
            .appendTo(navigation);
    }

    _applyLayout() {
        this.apply({
            '#pdfView': {left: 0, top: 0, right: 0, bottom: 0}
        });
    }

};
