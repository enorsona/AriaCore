AriaCore = {
    OCR: {
        Workers: {},
        Receivers: {},
        Callbacks: {},
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
            if (!AriaCore.OCR.Workers[l]) {
                AriaCore.OCR.Workers[l] = await Tesseract.createWorker(l);
            }
            let result;
            result = await AriaCore.OCR.Workers[l].recognize(s).then(data => data.data.text);
            return result;
        },
        SimpleRead: async (id, receiver_id, language, grayed) => {
            const input = AriaCore.OCR.FEBI(id);
            if (!input) return 'Failed to read. Cannot find uploader';
            const image = AriaCore.OCR.GIFE(input);
            if (!image) return 'Failed to read. Cannot find image';
            const target = grayed ? AriaCore.OCR.Grayer(image) : image;
            let result;
            result = await AriaCore.OCR.TryRead(target, language);
            AriaCore.OCR.Receivers[receiver_id].widget.innerText = result;
        },
        DestroyWorker: async (l) => {
            if (!AriaCore.OCR.Workers[l]) {
                console.log('No work to do.')
            } else {
                await AriaCore.OCR.Workers[l].terminate();
                console.log(`Terminating worker ${l}...`);
            }
        },
        RegisterReceiver: (id, callback) => {
            if (!AriaCore.OCR.Receivers[id]) {
                AriaCore.OCR.Receivers[id] = {
                    widget: document.querySelector(`#${id}`),
                    callback: callback,
                };
            }
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    callback();
                })
            })
            const observer_config = {
                childList: true,
                subtree: true,
                characterData: true,
            };
            observer.observe(AriaCore.OCR.Receivers[id], observer_config);
        },
    }
};
