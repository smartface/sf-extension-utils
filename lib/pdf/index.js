/**
 * @module pdf
 * @type {Object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @copyright Smartface 2020
 */

const Screen = require('sf-core/device/screen');

const htmlTemplate = `
 <!DOCTYPE html>
 <html>
 
 <head>
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=$maximumScale, user-scalable=$userScalable">
     <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@1.5.188/build/pdf.js"></script>
 </head>
 
 <body>
     <script>
         PDFJS.getDocument({ data: atob("$BASE64PDF") })
             .then(pdfDocument => {
                 let pagePromises = [];
                 for (let i = 1; i <= pdfDocument.numPages; ++i) {
                     pagePromises.push(pdfDocument.getPage(i));
                 }
                 return Promise.all(pagePromises);
             })
             .then(pages => {
                 return Promise.all(
                     pages.map((page, index) => {
                         let canvas = document.createElement('canvas');
                         canvas.setAttribute("width", page.getViewport(1).width * 2);
                         canvas.setAttribute("style", "visibility: hidden;");
                         let scaleRequired = canvas.width / page.getViewport(1).width;
                         let viewport = page.getViewport(scaleRequired);
                         canvas.height = viewport.height;
                         let renderContext = {
                             canvasContext: canvas.getContext('2d'),
                             viewport
                         };
                         // Render the page contents in the canvas
                         return page.render(renderContext).then(() => canvas.toDataURL());
                     }));
             })
             .then(images => {
                 images.forEach(image => {
                     let img = document.createElement("IMG");
                     img.setAttribute("src", image);
                     img.setAttribute("width", "${Screen.width - 10}");
                     document.body.appendChild(img);
                 });
             });
     </script>
 </body>
 
 </html>
 `;

/**
  * @function
  * Renders base64 string as pdf file in a WebView.
  * If you want to catch the completion event, listen to onShow event.
  * @example
  * const pdf = require("sf-extension-utils/lib/pdf");
  * pdf.render({
  *     webView: webView,
  *     base64pdf: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
  *         'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
  *         'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
  *         'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
  *         'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
  *         'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
  *         'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
  *         'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
  *         'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
  *         'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
  *         'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
  *         'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
  *         'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
  *     zoomEnabled: true
  * });
  */
function render({ webView, base64pdf, zoomEnabled = false }) {
    const base64pdfParam = base64pdf.replace(/\n/g, '');
    const html = htmlTemplate.replace('$maximumScale', zoomEnabled ? '6.0' : '1.0')
        .replace('$userScalable', zoomEnabled ? '1.0' : 'no')
        .replace('$BASE64PDF', base64pdfParam);
    webView.zoomEnabled = zoomEnabled;
    webView.loadHTML(html);
}

exports.render = render;
