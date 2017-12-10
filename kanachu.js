const fetch = require("node-fetch");
const DOMParser = require("xmldom").DOMParser;
const apiUrl = "http://www.kanachu.co.jp/dia/transfer/route_js";

exports.getNextBus = function (start, goal, date) {
    const url = apiUrl + "/s:" + start + "/g:" + goal + "/stt:0/glt:0/j:0/st:" + date.toISOString() + "/lm:10";
    return new Promise(function(resolve, reject) {
        fetch(url).then(function (response) {
            return response.text();
        }).then(function (text) {
            return "<!DOCTYPE html><html><body>" + text.split(/\r\n|\r|\n/)[2] + "</body></html>";
        }).then(function (text) {
            return new DOMParser().parseFromString(text, "text/html");
        }).then(function (document) {
            const rows = document.getElementsByTagName("tr");
            for(var i = 0; i < rows.length; i++) {
                if(rows[i].getAttribute("class") !== "first") {
                    continue;
                }
                const dataSet = rows[i].getElementsByTagName("td");
                for(var j = 0; j < dataSet.length; j++) {
                    if(dataSet[j].getAttribute("class") !== "time") {
                        continue;
                    }
                    resolve(dataSet[j].firstChild.data.split(" ")[0]);
                }
            }
            resolve(null);
        }).catch(function (exception) {
            reject(exception);
        });
    });
};