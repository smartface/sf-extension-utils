const Screen = require('sf-core/device/screen');
var htmlTemplate = `
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale = 1.0, maximum-scale = 1.0, user-scalable=no">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@1.5.188/build/pdf.js"></script>
</head>

<body>
    <canvas id="pdf-canvas" width="${Screen.width}" style="visible:false;"></canvas>
    <script>
        var $canvas = $('#pdf-canvas').get(0);
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
                    pages.map(page => {
                        let scaleRequired = $canvas.width / page.getViewport(1).width;
                        let viewport = page.getViewport(scaleRequired);
                        $canvas.height = viewport.height;
                        let renderContext = {
                            canvasContext: $canvas.getContext('2d'),
                            viewport: viewport
                        };

                        // Render the page contents in the canvas
                        return page.render(renderContext).then(() => $canvas.toDataURL());
                    }));
            })
            .then(images => {
                images.forEach(image => {
                    let img = document.createElement("IMG");
                    img.setAttribute("src", image);
                    img.setAttribute("width", "${Screen.width - 10}");
                    document.body.appendChild(img);
                });
            })
            .finally(() => {
                document.body.removeChild(document.getElementById("pdf-canvas"));
            });
    </script>
</body>

</html>
`;

function render({ webView, base64pdf }) {
    var html = htmlTemplate.replace("$BASE64PDF", base64pdf);
    webView.loadHTML(html);
}

exports.render = render;
