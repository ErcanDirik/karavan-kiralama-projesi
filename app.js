const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/generate-pdf', (req, res) => {
    const { name, tc, address, phone, signature } = req.body;

    // Şablon dosyasını okuma
    const templatePath = path.join(__dirname, 'public/templates/contractTemplate.txt');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Yer tutucuları doldurma
    template = template.replace('{{name}}', name);
    template = template.replace('{{tc}}', tc);
    template = template.replace('{{address}}', address);
    template = template.replace('{{phone}}', phone);

    const doc = new PDFDocument();
    let filename = 'sozlesme.pdf';
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Türkçe karakterleri destekleyen fontu kullanma
    const fontPath = path.join(__dirname, 'public/fonts/Roboto-Regular.ttf');
    doc.font(fontPath);

    // Şablondaki metni satır satır işleme
    const lines = template.split('\n');
    let yPosition = 50; // Başlangıç y koordinatı

    lines.forEach((line, index) => {
        if (line.includes('{{signature}}')) {
            // İmzanın yerleştirileceği satırı bulma
            doc.text(line.replace('{{signature}}', ''), 50, yPosition);

            // İmzanın boyutunu ve konumunu ayarlama
            const img = signature.replace(/^data:image\/\w+;base64,/, "");
            const buf = Buffer.from(img, 'base64');
            const x = 50; // İmzayı yerleştirmek istediğiniz x koordinatı
            const y = yPosition + 20; // İmzayı yerleştirmek istediğiniz y koordinatı

            doc.image(buf, x, y, { width: 200 }); // İmzanın PDF'te yerleşimi
        } else {
            doc.text(line, 50, yPosition);
        }
        yPosition += 20; // Her satırın altına biraz boşluk bırakma
    });

    doc.end();
    doc.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
