const titres = [
  "🔥 Résultat final incroyable : 4 – 4 entre PSG et OM !",
  "Portugal élimine l’Espagne aux tirs au but",
  "Top 10 arrêts décisifs en Ligue 1",
  "La France bat le Brésil à la 123ème minute",
  "Match tendu entre l’Allemagne et l’Italie, aucun but",
  "Résumé : 0 à 0 mais beaucoup d’occasions",
  "But refusé pour hors-jeu…",
  "Victoire par forfait de l’Argentine",
  "Le match de folie : Belgique vs Croatie",
  "Résumé complet du match PSG vs Real Madrid",
  "BUT DE FOLIE DE MBAPPÉ À LA DERNIÈRE SECONDE !",
  "Écrasante domination anglaise : 3 : 0 face à l’Écosse",
  "L’Espagne passe en finale !",
  "Résumé NBA : Celtics 113–110 Bucks",
  "Mbappé MVP du match France - Allemagne"
];

function isSpoiler(titre) {
  const cleaned = titre
    .normalize("NFKC")
    .replace(/\u00A0|\u2009|\u202F/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const scoreRegex = /\b\d{1,3}\s*[-–—:：﹕à]\s*\d{1,3}\b/;

const keywords = [
  "victoire", "défaite", "résultat", "score", "bat", "élimine", "écrase",
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

titres.forEach(titre => {
  if (isSpoiler(titre)) {
    console.log("🛑 SPOILER DÉTECTÉ :", titre);
  } else {
    console.log("✅ OK :", titre);
  }
});
