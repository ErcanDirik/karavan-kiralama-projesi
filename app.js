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

    const doc = new PDFDocument();
    let filename = 'sozlesme.pdf';
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Türkçe karakterler için fontu yükleme
    const fontPath = path.join(__dirname, 'public/fonts/Roboto-Regular.ttf');
    doc.font(fontPath);

    doc.text(`Ad Soyad: ${name}`, 50, 50);
    doc.text(`TC Kimlik No: ${tc}`, 50, 70);
    doc.text(`Adres: ${address}`, 50, 90);
    doc.text(`Telefon: ${phone}`, 50, 110);

    // İmzayı PDF'e ekleme
    const img = signature.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(img, 'base64');
    doc.image(buf, 50, 150, { width: 200 });

    doc.end();
    doc.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
