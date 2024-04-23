AriaCore = {
    FEBI: (id) => {
        const e = document.querySelector(`#${id}`);
        if (e) return e;
        else return null;
    },
    GIFE: (e) => {
        if (e) {
            if (e.tagName === 'INPUT') {
                if (e.type === 'file') {
                    if (e.files.length > 0) return e.files[0];
                }
            }
        } else return null;
    },
    Grayer: (i) => {
        let r = new Image();
        r.onload = () => {
            const temp = document.createElement('canvas');
            const temp_context = temp.getContext('2d');
            temp.width = r.width;
            temp.height = r.height;
            temp_context.drawImage(temp, 0, 0, r.width, r.height);
            const img = temp_context.getImageData(0, 0, temp.width, temp.height);
            const data = img.data;

            for (let i = 0; i < data.length; i += 4) {
                const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
                data[i] = grayscale;
                data[i + 1] = grayscale;
                data[i + 2] = grayscale;
            }

            temp_context.putImageData(img, 0, 0);

            return temp.toDataURL('image/png');
        }
        r.src = URL.createObjectURL(i);
    },
    TryRead: async (s, l) => {
        const worker = await Tesseract.createWorker(l);
        const result = await worker.recognize(s);
        const raw = result.data.text;
        await worker.terminate();
        return raw;
    }
}