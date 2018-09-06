var getVal = function(i) {
    return localStorage.getItem(i.toUpperCase()) || "";
};

var setVal = function(i,val) {
    localStorage.setItem(i.toUpperCase(), val);
    return val;
};

var gcs = function(r,n,s){var t=function(r,n){n=n?s:0;r=(r+s).split(s);for(var t=0,a=r.length;a>t;t++)n+=r[t].charCodeAt(0);return n};return t(t(r)%t(n)*t(n),1)};
var ep = function(r){for(var n="",t="",a=0,e=r.length;e>a;a++){var o=r[a].charCodeAt(0)+a+1+"";n+=("000"+o).substring(o.length)}for(a=0,e=n.length;e>a;a++)t+=String.fromCharCode(parseInt(n[a])+parseInt((a+1)%5)+48);return t};

var getUrlBase = function() {
    var ws = getVal('WEBSERVICE');
    if(ws && ws[ws.length - 1] === '/') {
        ws = ws.substr(0, ws.length - 1);
    }
    return ws + '/web_services.';
};

var setUploadVars = function(pdf, doc_id) {
    var user = getVal('USERNAME');
    var pass = ep(getVal('PASSWORD'));

    pdf.uploadFormData = {
        I_USERNAME: user,
        I_PASSWORD : pass,
        I_DOC_ID : doc_id,
        I_CHECKSUM : gcs(user + pass + doc_id, getVal('KEY'), "")
    };
    console.log("pdf in setuploadvars: ");
    console.log(pdf);
};

//new function which will now create the uploadvars first so that it can be added to the pdf widget later
var createUploadVars = function(doc_id) {
    console.log("the doc id in the createuploadvars: ", doc_id);

    var user = getVal('USERNAME');
    var pass = ep(getVal('PASSWORD'));

    let uploadFormData = {
        i_username: user,
        i_password : pass,
        i_doc_id : doc_id,
        i_checksum : gcs(user + pass + doc_id, getVal('KEY'), "")
    };

    return uploadFormData;
}

var getUploadPath = function(){
    return getUrlBase() + "upload_signed_doc?schema=" + getVal('SCHEMA');
}

var getPdfsUrl = function() {
    var user = getVal('USERNAME');
    var pass = ep(getVal('PASSWORD'));
    var schema = getVal('SCHEMA');
    var url = getUrlBase();
    url += "Get_Docs_To_Sign";
    url += "?i_username=" + user;
    url += "&i_password=" + encodeURI(pass);
    url += "&i_schema=" + schema;
    url += "&I_ENCODING=UTF-8";

    return url + "&i_checksum=" + gcs(user + pass + schema + "UTF-8", getVal('KEY'), "");
};

function getPdfUrl(doc_id) {
    return getUrlBase() + "GET_DOC" + "?i_doc_id=" + doc_id + "&i_checksum=" + gcs(doc_id, getVal("KEY"), "");
}

exports.getVal = getVal;
exports.setVal = setVal;
exports.credentials = {
    USERNAME: "Username",
    PASSWORD: "Password",
    WEBSERVICE: "Webservice URL",
    KEY: "Key",
    SCHEMA: "Schema"
};

exports.getPdfUrl = getPdfUrl;
exports.getPdfsUrl = getPdfsUrl;
exports.setUploadVars = setUploadVars;
exports.createUploadVars = createUploadVars;
exports.getUploadPath = getUploadPath;
