function isSpoiler(titre) {
  const cleaned = titre
    .normalize("NFKC")
    .replace(/\u00A0|\u2009|\u202F/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const scoreRegex = /\b\d{1,3}\s*[-–—:：﹕à]\s*\d{1,3}\b/;

  const keywords = [
    "victoire", "défaite", "champion", "gagne", "résultat", "score", "bat", "élimine", "écrase",
    "domination", "domine", "finale", "passe en", "forfait", "éjecte", "élimination",
    "aux tirs au but", "aux penalty", "qualifie", "qualification", "l’emporte"
  ];
  const keywordsRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "i");

  const falsePositives = [
    "résumé complet", "mvp", "match de folie", "but refusé",
    "top 10", "match france - allemagne"
  ];
  const falsePositiveRegex = new RegExp(falsePositives.join("|"), "i");

  const isScore = scoreRegex.test(cleaned);
  const hasKeyword = keywordsRegex.test(cleaned);
  const isFalsePositive = falsePositiveRegex.test(cleaned);

  return (isScore || hasKeyword) && !isFalsePositive;
}

function maskSpoilerTitles() {
  const elements = document.querySelectorAll('h3, h4, span');

  elements.forEach(el => {
    const original = el.textContent;
    if (!original || el.dataset.spoilerChecked) return;

    if (isSpoiler(original)) {
      el.dataset.originalText = original;
      el.textContent = "⚠️ Spoiler masqué – cliquez pour afficher";
      el.style.cursor = "pointer";
      el.dataset.spoilerChecked = "true";

      el.addEventListener("click", function reveal() {
        el.textContent = el.dataset.originalText;
        restoreThumbnail(el);
        el.removeEventListener("click", reveal);
      });


      // 🔎 Chercher et masquer la vignette associée
      const container = el.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer");
      if (container) {
        const img = container.querySelector("img");
        if (img) {
          img.dataset.originalSrc = img.src;
          img.src = "https://via.placeholder.com/320x180.png?text=🚫+Spoiler";
          img.style.objectFit = "contain";
          img.style.backgroundColor = "#000";
        }
      }
    } else {
      el.dataset.spoilerChecked = "true";
    }
  });
}

function restoreThumbnail(el) {
  const container = el.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer");
  if (container) {
    const img = container.querySelector("img");
    if (img && img.dataset.originalSrc) {
      img.src = img.dataset.originalSrc;
      img.style.objectFit = "";
      img.style.backgroundColor = "";
    }
  }
}

function hideShorts() {
  const sections = document.querySelectorAll('ytd-rich-section-renderer');
  sections.forEach(section => {
    if (section.innerText.toLowerCase().includes("shorts")) {
      section.style.display = 'none';
    }
  });
}

// ▶️ Exécution initiale
maskSpoilerTitles();
hideShorts();

// 🔁 Observer les ajouts dynamiques de YouTube
const observer = new MutationObserver(() => {
  maskSpoilerTitles();
  hideShorts();
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});
