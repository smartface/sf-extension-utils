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
						canvas.setAttribute("width", "${Screen.width}");
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

function render({ webView, base64pdf }) {
    base64pdf = base64pdf.replace(/\n/g, "");
    var html = htmlTemplate.replace("$BASE64PDF", base64pdf);
    webView.loadHTML(html);
}

exports.render = render;
