document.addEventListener('DOMContentLoaded', () => {

    // HELPER: Toggles visibility based on radio/input value
    const toggle = (triggerId, targetId, showIfChecked) => {
        // ... kept for ref if needed
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

    /* --- MULTIPLE SIGNERS LOGIC (Refactored) --- */
    const signersList = document.getElementById('signers-list');

    if (signersList) {

        // Function to initialize a single signer card
        const initSignerCard = (card) => {
            const canvas = card.querySelector('.signature-pad');
            const clearBtn = card.querySelector('.clear-sig-btn');
            const sigContainer = card.querySelector('.signature-container');
            const hiddenInput = card.querySelector('.signature-data');

            // Inputs
            const sName = card.querySelector('.signer-name');
            const sInst = card.querySelector('.signer-inst');
            const sDni = card.querySelector('.signer-dni');

            if (!canvas) return; // Safety

            const ctx = canvas.getContext('2d');
            let painting = false;

            // Correct sizing
            const resizeCanvas = () => {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                // We store the visual width to avoid exploding canvas on multiple resizes
                const rect = canvas.getBoundingClientRect();
                if (rect.width > 0) {
                    canvas.width = rect.width * ratio;
                    canvas.height = 200 * ratio; // Fixed height logic
                    ctx.scale(ratio, ratio);
                }
            };
            // Initial resize
            // We delay slightly to ensure DOM render
            setTimeout(resizeCanvas, 100);

            // Drawing Functions
            function startPosition(e) {
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
                // preventDefault ONLY if target is canvas to allow scrolling elsewhere
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
                ctx.strokeStyle = '#fff';

                ctx.lineTo(clientX - rect.left, clientY - rect.top);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(clientX - rect.left, clientY - rect.top);
            }

            // Events
            canvas.addEventListener('mousedown', startPosition);
            canvas.addEventListener('mouseup', finishedPosition);
            canvas.addEventListener('mousemove', draw);

            canvas.addEventListener('touchstart', startPosition, { passive: false });
            canvas.addEventListener('touchend', finishedPosition);
            canvas.addEventListener('touchmove', draw, { passive: false });

            // Clear
            clearBtn.addEventListener('click', () => {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio); // visual clear
                canvas.width = canvas.width; // Reset validation hack
                resizeCanvas(); // Re-scale
                hiddenInput.value = '';
            });

            // Validation logic
            const checkFields = () => {
                // More robust check logic for mobile (trimmed, length)
                const nameOk = sName.value.trim().length > 2;
                const instOk = sInst.value.trim().length > 2;
                // For DNI, just check it has some value (len > 4) to be friendly
                const dniOk = sDni.value.trim().length >= 6;

                if (nameOk && instOk && dniOk) {
                    sigContainer.classList.remove('disabled');
                } else {
                    sigContainer.classList.add('disabled');
                }
            };

            // Listen to multiple event types for mobile reliability
            [sName, sInst, sDni].forEach(el => {
                el.addEventListener('input', checkFields);
                el.addEventListener('keyup', checkFields); // Extra safety
                el.addEventListener('change', checkFields); // Autofill safety
                el.addEventListener('blur', checkFields);
            });
        };

        // Initialize existing cards (The first one)
        const initialCards = signersList.querySelectorAll('.signer-card');
        initialCards.forEach(initSignerCard);

        // Add Button Logic
        const addBtn = document.getElementById('add-signer-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const count = signersList.querySelectorAll('.signer-card').length + 1;
                // Clone the first card to keep structure
                const original = signersList.querySelector('.signer-card');
                const clone = original.cloneNode(true);

                // Reset Clone Info
                clone.querySelector('.signer-count').innerText = count;
                clone.querySelectorAll('input').forEach(i => i.value = ''); // Clear inputs
                clone.querySelector('.signature-container').classList.add('disabled'); // Re-disable

                // Clear Canvas
                const c = clone.querySelector('canvas');
                const ctx = c.getContext('2d');
                ctx.clearRect(0, 0, c.width, c.height);

                // Append
                signersList.appendChild(clone);

                // Init Logic for new card
                initSignerCard(clone);
            });
        }
    }


    /* --- FICHA B LOGIC --- */
    const fB_q12no = document.getElementById('q12-no');
    if (fB_q12no) {
        // ... (Ficha B logic same as before, condensed for brevity) ...
        const cont = document.getElementById('q13-container');
        document.querySelectorAll('input[name="q12"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q12no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q16no = document.getElementById('q16-no');
    if (fB_q16no) {
        const cont = document.getElementById('q17-container');
        document.querySelectorAll('input[name="q16"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q16no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q20 = document.getElementById('q20-input');
    if (fB_q20) {
        const cont = document.getElementById('q21-container');
        fB_q20.addEventListener('input', () => {
            if (fB_q20.value === '0' || fB_q20.value === '') cont.classList.add('hidden'); else cont.classList.remove('hidden');
        });
    }
    const fB_q22no = document.getElementById('q22-no');
    if (fB_q22no) {
        const cont = document.getElementById('q23-container');
        document.querySelectorAll('input[name="q22"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q22no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q30no = document.getElementById('q30-no');
    if (fB_q30no) {
        const cont = document.getElementById('q31-32-container');
        document.querySelectorAll('input[name="q30"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q30no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q33no = document.getElementById('q33-no');
    if (fB_q33no) {
        const cont = document.getElementById('q34-35-container');
        document.querySelectorAll('input[name="q33"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q33no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q36no = document.getElementById('q36-no');
    if (fB_q36no) {
        const cont = document.getElementById('q37-39-container');
        document.querySelectorAll('input[name="q36"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q36no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q44no = document.getElementById('q44-no');
    if (fB_q44no) {
        const cont = document.getElementById('q45-46-container');
        document.querySelectorAll('input[name="q44"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q44no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q47no = document.getElementById('q47-no');
    if (fB_q47no) {
        const cont = document.getElementById('q48-49-container');
        document.querySelectorAll('input[name="q47"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q47no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fB_q50no = document.getElementById('q50-no');
    if (fB_q50no) {
        const cont = document.getElementById('q51-container');
        document.querySelectorAll('input[name="q50"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q50no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }


    /* --- FICHA C LOGIC --- */
    const fC_q13no = document.getElementById('q13-no');
    if (fC_q13no) {
        const cont = document.getElementById('q14-15-container');
        document.querySelectorAll('input[name="q13"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q13no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fC_q16no = document.getElementById('q16-no');
    if (fC_q16no) {
        const cont = document.getElementById('q17-container');
        document.querySelectorAll('input[name="q16"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q16no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fC_q18no = document.getElementById('q18-no');
    if (fC_q18no) {
        const cont = document.getElementById('q19-container');
        document.querySelectorAll('input[name="q18"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q18no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fC_q20no = document.getElementById('q20-no');
    if (fC_q20no) {
        const cont = document.getElementById('q21-container');
        document.querySelectorAll('input[name="q20"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q20no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fC_q22no = document.getElementById('q22-no');
    if (fC_q22no) {
        const cont = document.getElementById('q23-container');
        document.querySelectorAll('input[name="q22"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q22no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fC_q24no = document.getElementById('q24-no');
    if (fC_q24no) {
        const cont = document.getElementById('q25-container');
        document.querySelectorAll('input[name="q24"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q24no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fC_q26yes = document.getElementById('q26-yes');
    if (fC_q26yes) {
        const cont = document.getElementById('q27-container');
        document.querySelectorAll('input[name="q26"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q26yes.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }
    const fC_q28yes = document.getElementById('q28-yes');
    if (fC_q28yes) {
        const cont = document.getElementById('q29-container');
        document.querySelectorAll('input[name="q28"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q28yes.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }


    /* --- GLOBAL FORM SUBMIT --- */
    ['fichaForm', 'fichaFormB', 'fichaFormC'].forEach(id => {
        const form = document.getElementById(id);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Final Console Log
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Get all signatures if needed
                const signatures = form.querySelectorAll('input[name="signature_data[]"]');
                console.log('Submitting Form', data);
                if (signatures.length) {
                    console.log('Signatures Count:', signatures.length);
                }

                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerText;

                btn.innerText = '¡Guardado!';
                btn.classList.add('animate-in'); // Pulse
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.classList.remove('animate-in');
                    form.reset();
                    // Clean Canvases
                    const canvases = form.querySelectorAll('canvas');
                    canvases.forEach(c => {
                        const ctx = c.getContext('2d');
                        ctx.clearRect(0, 0, c.width, c.height);
                    });
                    // Disable all signers
                    form.querySelectorAll('.signature-container').forEach(sc => sc.classList.add('disabled'));

                    window.scrollTo(0, 0);
                }, 2000);
            });
        }
    });

});
