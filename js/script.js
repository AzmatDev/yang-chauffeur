
/* ── Navigation ── */
function openMenu() {
    document.getElementById('mobileMenu').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow = '';
}

/* ── Date min = aujourd'hui ── */
document.getElementById('date').min = new Date().toISOString().split('T')[0];

/* ── Clic sur une carte service → pré-remplir formulaire ── */
let lastSelectedCard = null;

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const serviceValue = card.dataset.service;
        const messageValue = card.dataset.message;

        /* Retirer la sélection précédente */
        if (lastSelectedCard) lastSelectedCard.classList.remove('selected');
        card.classList.add('selected');
        lastSelectedCard = card;

        /* Pré-remplir le select */
        const select = document.getElementById('service');
        if (select && serviceValue) {
            select.value = serviceValue;
            flashField(select);
        }

        /* Pré-remplir le message uniquement si vide */
        const textarea = document.getElementById('message');
        if (textarea && messageValue && textarea.value.trim() === '') {
            textarea.value = messageValue;
            flashField(textarea);
        }

        /* Scroll vers le formulaire */
        document.getElementById('reservation').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* Animation flash sur un champ pré-rempli */
function flashField(el) {
    el.classList.remove('field-flash');
    void el.offsetWidth; /* reflow pour relancer l'animation */
    el.classList.add('field-flash');
    setTimeout(() => el.classList.remove('field-flash'), 1400);
}

/* ── Soumission formulaire → WhatsApp + Email ── */
function submitForm() {
    const prenom  = document.getElementById('prenom').value.trim();
    const nom     = document.getElementById('nom').value.trim();
    const tel     = document.getElementById('tel').value.trim();
    const service = document.getElementById('service').value;
    const date    = document.getElementById('date').value;
    const heure   = document.getElementById('heure').value;
    const depart  = document.getElementById('depart').value.trim();

    if (!prenom || !nom || !tel || !service || !date || !heure || !depart) {
        alert('Veuillez remplir tous les champs obligatoires (*).');
        return;
    }

    const email   = document.getElementById('email').value.trim();
    const arrivee = document.getElementById('arrivee').value.trim();
    const message = document.getElementById('message').value.trim();
    const dateFmt = new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    /* Texte commun */
    const texte =
        `Nouvelle réservation Yang Chauffeur\n\n` +
        `Client : ${prenom} ${nom}\n` +
        `Tél : ${tel}${email ? '\nEmail : ' + email : ''}\n` +
        `Service : ${service}\n` +
        `Date : ${dateFmt} à ${heure}\n` +
        `Départ : ${depart}${arrivee ? '\nArrivée : ' + arrivee : ''}` +
        `${message ? '\nInfos : ' + message : ''}`;

    /* ✅ 1. WhatsApp → TON numéro (33753608361) */
    const waText = encodeURIComponent(texte);
    setTimeout(() => {
        window.open(`https://wa.me/33753608361?text=${waText}`, '_blank');
    }, 300);

    /* ✅ 2. Email → ouvre le client mail avec les infos pré-remplies */
    const mailSubject = encodeURIComponent(`Réservation Yang Chauffeur — ${prenom} ${nom}`);
    const mailBody    = encodeURIComponent(texte);
    setTimeout(() => {
        window.location.href = `mailto:azmat.chwt@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    }, 900);

    /* ✅ 3. Afficher le message de succès */
    document.getElementById('formContent').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    document.getElementById('successName').textContent = prenom;

    /* ✅ 4. Bouton "Nouvelle réservation" dans le message de succès */
    document.getElementById('successName').closest('.form-success')
        .querySelector('.btn-new-resa')?.remove();
    const btnNew = document.createElement('button');
    btnNew.className = 'btn-submit btn-new-resa';
    btnNew.style.marginTop = '1.5rem';
    btnNew.textContent = '+ Nouvelle réservation';
    btnNew.onclick = resetForm;
    document.getElementById('formSuccess').appendChild(btnNew);
}

/* ── Reset complet du formulaire ── */
function resetForm() {
    /* Vider tous les champs */
    ['prenom','nom','tel','email','service','date','heure','depart','arrivee','message']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.value = el.tagName === 'SELECT' ? '' : ''; }
        });
    document.getElementById('date').min = new Date().toISOString().split('T')[0];

    /* Retirer sélection des cartes */
    if (lastSelectedCard) {
        lastSelectedCard.classList.remove('selected');
        lastSelectedCard = null;
    }

    /* Réafficher le formulaire */
    document.getElementById('formContent').style.display = 'block';
    document.getElementById('formSuccess').style.display  = 'none';

    /* Scroll vers le formulaire */
    document.getElementById('reservation').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
