# Sofiane Dehimi — Portfolio

Portfolio personnel Python, Linux et cybersécurité défensive. Site statique en français, publié sur GitHub Pages, sans compilation ni dépendance JavaScript en production.

- [Portfolio](https://sonfire03.github.io/mon-site/)
- [Profil recruteur](https://sonfire03.github.io/mon-site/recruiter.html)
- [Certifications](https://sonfire03.github.io/mon-site/projet/certif/certifications.html)

## Design et contenu

Identité encre et vert lime, typographie éditoriale, monogramme et illustrations CSS. Six projets principaux filtrables, projets de lab, parcours, compétences, badges vérifiables et formulaire de contact. Les visuels SOC/IOC/DFIR/ADB illustrent les workflows ; ils ne représentent pas des mesures réelles. La capture Sofiane Cloud provient du projet.

Les études de cas et leurs liens sont conservés. Le CV d’une page est reconstitué exclusivement à partir des informations du portfolio ; sa source modifiable est `cv.html`.

## Structure

- `index.html` : accueil et sélection de projets.
- `recruiter.html` : lecture synthétique pour le recrutement.
- `cv.html`, `assets/CV_Sofiane_Dehimi.pdf` : source imprimable et CV téléchargeable.
- `css/main.css` : composants des pages détaillées.
- `css/redesign.css` : identité partagée, accueil et adaptations mobiles.
- `js/main.js` : navigation, filtres, contact, certifications et navigation clavier Ctrl/Cmd+K.
- `projet/` : études de cas, certifications et parcours.
- `scripts/` : contrôles des liens et tests navigateur.

## Développement local

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:8765/`. Les projets restent visibles sans JavaScript. Le formulaire utilise l’endpoint Formspree existant ; aucune clé n’est stockée dans le dépôt.

## Vérification

```sh
python3 scripts/check_site.py
node --check js/main.js
```

Les tests navigateur nécessitent Playwright et Chromium (outils de développement facultatifs) :

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node scripts/check_browser.cjs
```

Laisser le serveur local actif. `CHROME_PATH` permet d’utiliser un Chrome installé ; `PLAYWRIGHT_MODULE` permet d’utiliser une installation existante de Playwright. Les tests couvrent quatre largeurs d’écran, les filtres, le menu mobile, les pages secondaires, les certifications, la navigation clavier et le contenu sans JavaScript. Les envois Formspree sont interceptés : aucun message réel n’est envoyé. Les captures sont enregistrées dans `/tmp/portfolio-*.png`.

Pour actualiser le PDF : ouvrir `cv.html`, imprimer au format A4, désactiver les en-têtes/pieds de page et enregistrer vers `assets/CV_Sofiane_Dehimi.pdf`.

## Publication

GitHub Pages publie la branche `main`, à la racine du dépôt. Un push sur `main` déclenche la mise à jour du site. La page 404 utilise le préfixe `/mon-site/` pour fonctionner aussi depuis une URL imbriquée inexistante.
