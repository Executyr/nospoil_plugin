const SPOILER_IMAGE_URL = "https://executyr.github.io/nospoil_plugin/assets/nospoil_thumbnail.png";

// Détection de spoilers dans un titre
function isSpoiler(titre) {
  const cleaned = titre
    .normalize("NFKC")
    .replace(/\u00A0|\u2009|\u202F/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const scoreRegex = /\b\d{1,3}\s*[-–—:：﹕à]\s*\d{1,3}\b/;
  const keywords = [
    "victoire", "défaite", "champion", "gagne", "résultat","musèle", "score", "bat", "élimine", "écrase",
    "domination", "domine", "finale", "passe en", "forfait", "éjecte", "élimination",
    "aux tirs au but", "aux penalty", "qualifie", "qualification", "l’emporte"
  ];
  const falsePositives = [
    "résumé complet", "mvp", "match de folie", "but refusé",
    "top 10", "match france - allemagne"
  ];

  const hasScore = scoreRegex.test(cleaned);
  const hasKeyword = new RegExp(`\\b(${keywords.join("|")})\\b`, "i").test(cleaned);
  const isFalsePositive = new RegExp(falsePositives.join("|"), "i").test(cleaned);

  return (hasScore || hasKeyword) && !isFalsePositive;
}

function maskSpoilerTitles() {
  document.querySelectorAll("h3, h4, span").forEach(el => {
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

      const container = el.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer");
      if (container) {
        const img = container.querySelector("img");
        if (img) {
          img.dataset.originalSrc = img.src;
          img.src = SPOILER_IMAGE_URL;
          img.style.objectFit = "cover";
          img.style.backgroundColor = "#111";
        }
      }
    } else {
      el.dataset.spoilerChecked = "true";
    }
  });
}

function restoreThumbnail(el) {
  const container = el.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer");
  const img = container?.querySelector("img");
  if (img && img.dataset.originalSrc) {
    img.src = img.dataset.originalSrc;
    img.style.objectFit = "";
    img.style.backgroundColor = "";
  }
}

function hideShorts() {
  document.querySelectorAll("ytd-rich-section-renderer").forEach(section => {
    if (section.innerText.toLowerCase().includes("shorts")) {
      section.style.display = "none";
    }
  });
}

// Exécution principale si activé
chrome.storage.sync.get("enabled", ({ enabled }) => {
  if (!enabled) return;

  maskSpoilerTitles();
  hideShorts();

  const observer = new MutationObserver(() => {
    maskSpoilerTitles();
    hideShorts();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});