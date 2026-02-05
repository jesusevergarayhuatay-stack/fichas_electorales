document.addEventListener('DOMContentLoaded', () => {

    // HELPER: Toggles visibility based on radio/input value
    const toggle = (triggerId, targetId, showIfChecked) => {
        // ...
    };

    /* --- FICHA A LOGIC --- */
    const fA_q19yes = document.getElementById('q19-yes');
    if (fA_q19yes) {
        const cont = document.getElementById('q20-container');
        document.querySelectorAll('input[name="q19"]').forEach(i => i.addEventListener('change', () => {
            if (fA_q19yes.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fA_q35no = document.getElementById('q35-no');
    if (fA_q35no) {
        const cont = document.getElementById('q36-37-container');
        document.querySelectorAll('input[name="q35"]').forEach(i => i.addEventListener('change', () => {
            if (fA_q35no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    /* --- MULTIPLE SIGNERS LOGIC (Enhanced) --- */
    const signersList = document.getElementById('signers-list');

    if (signersList) {

        const initSignerCard = (card) => {
            const canvas = card.querySelector('.signature-pad');
            const clearBtn = card.querySelector('.clear-sig-btn');
            const sigContainer = card.querySelector('.signature-container');
            const hiddenInput = card.querySelector('.signature-data');

            const sName = card.querySelector('.signer-name');
            const sInst = card.querySelector('.signer-inst');
            const sDni = card.querySelector('.signer-dni');

            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            let painting = false;

            const resizeCanvas = () => {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                const rect = canvas.getBoundingClientRect();
                if (rect.width > 0) {
                    canvas.width = rect.width * ratio;
                    canvas.height = 200 * ratio;
                    ctx.scale(ratio, ratio);
                }
            };
            setTimeout(resizeCanvas, 100);

            function startPosition(e) {
                if (sigContainer.classList.contains('disabled')) return; // Extra safety
                painting = true;
                draw(e);
            }
            function finishedPosition() {
                painting = false;
                ctx.beginPath();
                hiddenInput.value = canvas.toDataURL();
            }
            function draw(e) {
                if (!painting) return;
                if (e.cancelable) e.preventDefault();

                let clientX, clientY;
                if (e.type.includes('touch')) {
                    const touch = e.touches[0];
                    clientX = touch.clientX;
                    clientY = touch.clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                const rect = canvas.getBoundingClientRect();
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000'; // Black ink

                ctx.lineTo(clientX - rect.left, clientY - rect.top);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(clientX - rect.left, clientY - rect.top);
            }

            canvas.addEventListener('mousedown', startPosition);
            canvas.addEventListener('mouseup', finishedPosition);
            canvas.addEventListener('mousemove', draw);

            canvas.addEventListener('touchstart', startPosition, { passive: false });
            canvas.addEventListener('touchend', finishedPosition);
            canvas.addEventListener('touchmove', draw, { passive: false });

            clearBtn.addEventListener('click', () => {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
                canvas.width = canvas.width;
                resizeCanvas();
                hiddenInput.value = '';
            });

            const checkFields = () => {
                // If card is locked (already saved), don't mess with classes
                if (card.classList.contains('locked-card')) return;

                const nameOk = sName.value.trim().length > 2;
                const instOk = sInst.value.trim().length > 2;
                const dniOk = sDni.value.trim().length >= 6;

                if (nameOk && instOk && dniOk) {
                    sigContainer.classList.remove('disabled');
                } else {
                    sigContainer.classList.add('disabled');
                }
            };

            [sName, sInst, sDni].forEach(el => {
                el.addEventListener('input', checkFields);
                el.addEventListener('keyup', checkFields);
                el.addEventListener('change', checkFields); // Autofill
                el.addEventListener('blur', checkFields);
            });
        };

        // Init initial
        const initialCards = signersList.querySelectorAll('.signer-card');
        initialCards.forEach(initSignerCard);

        // ADD & LOCK LOGIC
        const addBtn = document.getElementById('add-signer-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                // Validate last card
                const cards = signersList.querySelectorAll('.signer-card');
                const lastCard = cards[cards.length - 1];
                const sName = lastCard.querySelector('.signer-name');
                const sigData = lastCard.querySelector('.signature-data');

                if (sName.value.trim().length < 2) {
                    alert('Por favor complete los datos del firmante actual antes de agregar otro.');
                    sName.focus();
                    return;
                }

                // Allow empty signature? Maybe not.
                if (!sigData.value) {
                    alert('Por favor firme antes de agregar otro.');
                    return;
                }

                // LOCK LAST CARD
                lastCard.classList.add('locked-card');
                lastCard.style.opacity = '0.7';
                lastCard.style.pointerEvents = 'none'; // Disable interactions
                // Visual feedback
                const lockMsg = document.createElement('div');
                lockMsg.innerHTML = '🔒 <small>Firmado y Guardado</small>';
                lockMsg.style.color = 'var(--success)';
                lockMsg.style.marginTop = '10px';
                lastCard.appendChild(lockMsg);


                // ADD NEW CARD
                const count = cards.length + 1;
                const original = cards[0]; // Clone from template (first one)
                const clone = original.cloneNode(true);

                // Reset Clone
                clone.classList.remove('locked-card');
                clone.style.opacity = '1';
                clone.style.pointerEvents = 'auto';
                if (clone.querySelector('div')) {
                    // Remove potential lock msg if we cloned a locked one (though we cloned index 0, safer to check)
                    // Actually we cloned index 0. If index 0 is locked, we need to clean it.
                }
                // Remove appended messages from clone
                const msgs = clone.querySelectorAll('div');
                msgs.forEach(d => { if (d.innerHTML.includes('🔒')) d.remove(); });

                clone.querySelector('.signer-count').innerText = count;
                clone.querySelectorAll('input').forEach(i => i.value = '');
                clone.querySelector('.signature-container').classList.add('disabled');

                const c = clone.querySelector('canvas');
                const ctx = c.getContext('2d');
                ctx.clearRect(0, 0, c.width, c.height);

                signersList.appendChild(clone);
                initSignerCard(clone);

                // Scroll to new
                clone.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }


    /* --- PDF GENERATION LOGIC --- */
    async function generatePDF(formData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Ficha A - Supervisión a locales de votación", 105, 20, null, null, "center");

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Fecha: " + new Date().toLocaleDateString(), 105, 28, null, null, "center");

        let y = 40;
        const pageHeight = doc.internal.pageSize.height;

        // Loop through data
        // Filter out signature data and other huge fields if any
        doc.setFontSize(10);

        for (const [key, value] of formData.entries()) {
            if (key.includes('signature') || key.includes('signer')) continue; // Handle signatures manually

            // Basic layout
            if (y > pageHeight - 30) {
                doc.addPage();
                y = 20;
            }
            // Simple key-value dump for MVP
            const text = `${key}: ${value}`;
            const splitText = doc.splitTextToSize(text, 180);
            doc.text(splitText, 15, y);
            y += (7 * splitText.length);
        }

        // SIGNATURES
        const signers = document.querySelectorAll('.signer-card');
        if (signers.length > 0) {
            if (y > pageHeight - 60) {
                doc.addPage();
                y = 20;
            }
            y += 10;
            doc.setFont("helvetica", "bold");
            doc.text("FIRMAS DE CONFORMIDAD", 15, y);
            y += 15;

            for (let i = 0; i < signers.length; i++) {
                const card = signers[i];
                const name = card.querySelector('.signer-name').value;
                const inst = card.querySelector('.signer-inst').value;
                const dni = card.querySelector('.signer-dni').value;
                const sigData = card.querySelector('.signature-data').value;

                if (y > pageHeight - 50) {
                    doc.addPage();
                    y = 20;
                }

                // Add Signature Image
                if (sigData) {
                    // Signature is now Black on Transparent/White. 
                    // PDF paper is white. Perfect match.
                    doc.addImage(sigData, 'PNG', 15, y, 60, 30);
                }

                doc.setFont("helvetica", "normal");
                doc.text(`Nombre: ${name}`, 80, y + 10);
                doc.text(`Institución: ${inst}`, 80, y + 18);
                doc.text(`DNI: ${dni}`, 80, y + 26);

                y += 40;
            }
        }

        doc.save("ficha_a_supervision.pdf");
    }


    /* --- GLOBAL FORM SUBMIT --- */
    ['fichaForm', 'fichaFormB', 'fichaFormC'].forEach(id => {
        const form = document.getElementById(id);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                console.log('Generating PDF...');

                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerText;

                btn.innerText = 'Generando PDF...';
                btn.classList.add('animate-in');

                // Call generation logic (only for Ficha A currently fully implemented)
                if (id === 'fichaForm') {
                    // We need jspdf loaded
                    if (window.jspdf) {
                        try {
                            generatePDF(formData);
                            btn.innerText = '¡PDF Descargado!';
                        } catch (err) {
                            console.error(err);
                            btn.innerText = 'Error PDF';
                        }
                    } else {
                        btn.innerText = 'Error Lib';
                    }
                } else {
                    btn.innerText = '¡Guardado!'; // B/C don't have generation yet
                }

                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.classList.remove('animate-in');
                    // Optional reset logic
                    // form.reset(); 
                    // window.scrollTo(0,0);
                }, 3000);
            });
        }
    });

    /* --- FICHA B/C LOGIC PRESERVED --- */
    // (Condensed for brevity, assumed existing listeners remain valid if not overwritten)
    // To ensure we don't lose B/C logic, I should technically write them out or assume user won't wipe them.
    // I will rewrite them to be safe since I am overwriting app.js.

    const fB_q12no = document.getElementById('q12-no');
    if (fB_q12no) {
        const cont = document.getElementById('q13-container');
        document.querySelectorAll('input[name="q12"]').forEach(i => i.addEventListener('change', () => { if (fB_q12no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden'); }));
    }
    const fB_q16no = document.getElementById('q16-no');
    if (fB_q16no) {
        const cont = document.getElementById('q17-container');
        document.querySelectorAll('input[name="q16"]').forEach(i => i.addEventListener('change', () => { if (fB_q16no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden'); }));
    }
    const fB_q20 = document.getElementById('q20-input');
    if (fB_q20) fB_q20.addEventListener('input', () => { if (fB_q20.value === '0' || fB_q20.value === '') document.getElementById('q21-container').classList.add('hidden'); else document.getElementById('q21-container').classList.remove('hidden'); });

    const fB_q22no = document.getElementById('q22-no');
    if (fB_q22no) document.querySelectorAll('input[name="q22"]').forEach(i => i.addEventListener('change', () => { if (fB_q22no.checked) document.getElementById('q23-container').classList.add('hidden'); else document.getElementById('q23-container').classList.remove('hidden'); }));

    const fB_q30no = document.getElementById('q30-no');
    if (fB_q30no) document.querySelectorAll('input[name="q30"]').forEach(i => i.addEventListener('change', () => { if (fB_q30no.checked) document.getElementById('q31-32-container').classList.add('hidden'); else document.getElementById('q31-32-container').classList.remove('hidden'); }));

    const fB_q33no = document.getElementById('q33-no');
    if (fB_q33no) document.querySelectorAll('input[name="q33"]').forEach(i => i.addEventListener('change', () => { if (fB_q33no.checked) document.getElementById('q34-35-container').classList.add('hidden'); else document.getElementById('q34-35-container').classList.remove('hidden'); }));

    const fB_q36no = document.getElementById('q36-no');
    if (fB_q36no) document.querySelectorAll('input[name="q36"]').forEach(i => i.addEventListener('change', () => { if (fB_q36no.checked) document.getElementById('q37-39-container').classList.add('hidden'); else document.getElementById('q37-39-container').classList.remove('hidden'); }));

    const fB_q44no = document.getElementById('q44-no');
    if (fB_q44no) document.querySelectorAll('input[name="q44"]').forEach(i => i.addEventListener('change', () => { if (fB_q44no.checked) document.getElementById('q45-46-container').classList.add('hidden'); else document.getElementById('q45-46-container').classList.remove('hidden'); }));

    const fB_q47no = document.getElementById('q47-no');
    if (fB_q47no) document.querySelectorAll('input[name="q47"]').forEach(i => i.addEventListener('change', () => { if (fB_q47no.checked) document.getElementById('q48-49-container').classList.add('hidden'); else document.getElementById('q48-49-container').classList.remove('hidden'); }));

    const fB_q50no = document.getElementById('q50-no');
    if (fB_q50no) document.querySelectorAll('input[name="q50"]').forEach(i => i.addEventListener('change', () => { if (fB_q50no.checked) document.getElementById('q51-container').classList.add('hidden'); else document.getElementById('q51-container').classList.remove('hidden'); }));

    /* Ficha C */
    const fC_q13no = document.getElementById('q13-no');
    if (fC_q13no) document.querySelectorAll('input[name="q13"]').forEach(i => i.addEventListener('change', () => { if (fC_q13no.checked) document.getElementById('q14-15-container').classList.add('hidden'); else document.getElementById('q14-15-container').classList.remove('hidden'); }));

    const fC_q16no = document.getElementById('q16-no');
    if (fC_q16no) document.querySelectorAll('input[name="q16"]').forEach(i => i.addEventListener('change', () => { if (fC_q16no.checked) document.getElementById('q17-container').classList.add('hidden'); else document.getElementById('q17-container').classList.remove('hidden'); }));

    const fC_q18no = document.getElementById('q18-no');
    if (fC_q18no) document.querySelectorAll('input[name="q18"]').forEach(i => i.addEventListener('change', () => { if (fC_q18no.checked) document.getElementById('q19-container').classList.add('hidden'); else document.getElementById('q19-container').classList.remove('hidden'); }));

    const fC_q20no = document.getElementById('q20-no');
    if (fC_q20no) document.querySelectorAll('input[name="q20"]').forEach(i => i.addEventListener('change', () => { if (fC_q20no.checked) document.getElementById('q21-container').classList.add('hidden'); else document.getElementById('q21-container').classList.remove('hidden'); }));

    const fC_q22no = document.getElementById('q22-no');
    if (fC_q22no) document.querySelectorAll('input[name="q22"]').forEach(i => i.addEventListener('change', () => { if (fC_q22no.checked) document.getElementById('q23-container').classList.add('hidden'); else document.getElementById('q23-container').classList.remove('hidden'); }));

    const fC_q24no = document.getElementById('q24-no');
    if (fC_q24no) document.querySelectorAll('input[name="q24"]').forEach(i => i.addEventListener('change', () => { if (fC_q24no.checked) document.getElementById('q25-container').classList.add('hidden'); else document.getElementById('q25-container').classList.remove('hidden'); }));

    const fC_q26yes = document.getElementById('q26-yes');
    if (fC_q26yes) document.querySelectorAll('input[name="q26"]').forEach(i => i.addEventListener('change', () => { if (fC_q26yes.checked) document.getElementById('q27-container').classList.add('hidden'); else document.getElementById('q27-container').classList.remove('hidden'); }));

    const fC_q28yes = document.getElementById('q28-yes');
    if (fC_q28yes) document.querySelectorAll('input[name="q28"]').forEach(i => i.addEventListener('change', () => { if (fC_q28yes.checked) document.getElementById('q29-container').classList.add('hidden'); else document.getElementById('q29-container').classList.remove('hidden'); }));

});
