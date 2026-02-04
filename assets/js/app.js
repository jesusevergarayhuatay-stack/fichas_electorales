document.addEventListener('DOMContentLoaded', () => {

    // HELPER: Toggles visibility based on radio/input value
    // If triggerElement is checked/matches value, hide target. Else show. or vice versa.
    // We'll make specific logic functions for each case to be safe.

    const toggle = (triggerId, targetId, showIfChecked) => {
        const trigger = document.getElementById(triggerId);
        const target = document.getElementById(targetId);
        if (!trigger || !target) return;

        const check = () => {
            if (trigger.checked === showIfChecked) {
                target.classList.remove('hidden');
            } else {
                target.classList.add('hidden');
            }
        };
        // Find all radios with same name to attach listener
        const name = trigger.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => r.addEventListener('change', check));
        check(); // Init
    };

    /* --- FICHA A LOGIC --- */
    toggle('q19-yes', 'q20-container', false); // Si hay luz (Yes), Oculta contigencia (Yes=false show) -> Wait. No.
    // Q19 Yes -> Hide Q20. 
    // Logic: if Yes checked, add hidden. 
    // My helper is "showIfChecked". So false.

    toggle('q35-no', 'q36-37-container', false); // If No, hide 36-37. So showIfChecked=false (Hide if checked).
    // Wait helper logic: if(checked === showIfChecked) remove hidden.
    // Q35 No checked. showIfChecked=false -> false===false -> remove hidden (Show). WRONG.

    // Let's rewrite manual listeners for clarity, simpler than abstraction for complex cases.

    // FICHA A
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


    /* --- FICHA B LOGIC --- */
    // Q12: Retraso Si -> Show Q13. No -> Hide Q13 (Pase a 14).
    const fB_q12no = document.getElementById('q12-no');
    if (fB_q12no) {
        const cont = document.getElementById('q13-container');
        document.querySelectorAll('input[name="q12"]').forEach(i => i.addEventListener('change', () => {
            // If No checked, HIDE (Pase a 14 acts as skipping 13)
            if (fB_q12no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q16: Detenidos Si -> Show Q17. No -> Hide Q17.
    const fB_q16no = document.getElementById('q16-no');
    if (fB_q16no) {
        const cont = document.getElementById('q17-container');
        document.querySelectorAll('input[name="q16"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q16no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q20: Input number. If 0 -> Hide Q21. Else Show.
    const fB_q20 = document.getElementById('q20-input');
    if (fB_q20) {
        const cont = document.getElementById('q21-container');
        fB_q20.addEventListener('input', () => {
            if (fB_q20.value === '0' || fB_q20.value === '') cont.classList.add('hidden'); else cont.classList.remove('hidden');
        });
    }

    // Q22: Desigual Si -> Show Q23. No -> Hide.
    const fB_q22no = document.getElementById('q22-no');
    if (fB_q22no) {
        const cont = document.getElementById('q23-container');
        document.querySelectorAll('input[name="q22"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q22no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q30: Protestas Si -> Show Q31-32. No -> Hide.
    const fB_q30no = document.getElementById('q30-no');
    if (fB_q30no) {
        const cont = document.getElementById('q31-32-container');
        document.querySelectorAll('input[name="q30"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q30no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q33: Impedido Si -> Show Q34-35. No -> Hide.
    const fB_q33no = document.getElementById('q33-no');
    if (fB_q33no) {
        const cont = document.getElementById('q34-35-container');
        document.querySelectorAll('input[name="q33"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q33no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q36: Violencia Mujer Si -> Show Q37-39. No -> Hide.
    const fB_q36no = document.getElementById('q36-no');
    if (fB_q36no) {
        const cont = document.getElementById('q37-39-container');
        document.querySelectorAll('input[name="q36"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q36no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q44: Impidio Acompanante Si -> Show Q45-46. No -> Hide.
    const fB_q44no = document.getElementById('q44-no');
    if (fB_q44no) {
        const cont = document.getElementById('q45-46-container');
        document.querySelectorAll('input[name="q44"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q44no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q47: Perro guia Si -> Show Q48-49. No -> Hide.
    const fB_q47no = document.getElementById('q47-no');
    if (fB_q47no) {
        const cont = document.getElementById('q48-49-container');
        document.querySelectorAll('input[name="q47"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q47no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q50: Omitio atencion Si -> Show Q51. No -> Hide.
    const fB_q50no = document.getElementById('q50-no');
    if (fB_q50no) {
        const cont = document.getElementById('q51-container');
        document.querySelectorAll('input[name="q50"]').forEach(i => i.addEventListener('change', () => {
            if (fB_q50no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }


    /* --- FICHA C LOGIC --- */
    // Q13 Personeros Si -> Show Q14-15. No -> Hide.
    const fC_q13no = document.getElementById('q13-no');
    if (fC_q13no) {
        const cont = document.getElementById('q14-15-container');
        document.querySelectorAll('input[name="q13"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q13no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q16 Parcial Si -> Show Q17. No -> Hide.
    const fC_q16no = document.getElementById('q16-no');
    if (fC_q16no) {
        const cont = document.getElementById('q17-container');
        document.querySelectorAll('input[name="q16"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q16no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q18 Dudas Si -> Show Q19. No -> Hide.
    const fC_q18no = document.getElementById('q18-no');
    if (fC_q18no) {
        const cont = document.getElementById('q19-container');
        document.querySelectorAll('input[name="q18"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q18no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q20 Discrepancia Si -> Show Q21. No -> Hide.
    const fC_q20no = document.getElementById('q20-no');
    if (fC_q20no) {
        const cont = document.getElementById('q21-container');
        document.querySelectorAll('input[name="q20"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q20no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q22 Impugno Si -> Show Q23. No -> Hide.
    const fC_q22no = document.getElementById('q22-no');
    if (fC_q22no) {
        const cont = document.getElementById('q23-container');
        document.querySelectorAll('input[name="q22"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q22no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q24 Intervencion Si -> Show Q25. No -> Hide.
    const fC_q24no = document.getElementById('q24-no');
    if (fC_q24no) {
        const cont = document.getElementById('q25-container');
        document.querySelectorAll('input[name="q24"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q24no.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q26 Oportuno No -> Show Q27. Si -> Hide. (Inverse logic)
    const fC_q26yes = document.getElementById('q26-yes');
    if (fC_q26yes) {
        const cont = document.getElementById('q27-container');
        document.querySelectorAll('input[name="q26"]').forEach(i => i.addEventListener('change', () => {
            if (fC_q26yes.checked) cont.classList.add('hidden'); else cont.classList.remove('hidden');
        }));
    }

    // Q28 Cumplio Si -> Hide 29. No -> Show 29. (Inverse logic)
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

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                console.log('Form Data:', data);

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
                    // trigger all listeners to reset view?
                    // Ideally yes, but basic reset is ok for demo.
                    window.scrollTo(0, 0);
                }, 2000);
            });
        }
    });

});
