window.onload = function() {
    const canvas = document.getElementById('signaturePad');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    function stopDrawing() {
        drawing = false;
    }

    document.getElementById('clearSignature').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('rentalForm').addEventListener('submit', function(e) {
        e.preventDefault();
    
        const name = document.getElementById('name').value;
        const tc = document.getElementById('tc').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const canvas = document.getElementById('signaturePad');
        const signature = canvas.toDataURL();
    
        const formData = {
            name: name,
            tc: tc,
            address: address,
            phone: phone,
            signature: signature
        };
    
        fetch('/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sozlesme.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error('PDF oluşturulurken hata oluştu:', error));
    });
    
};
