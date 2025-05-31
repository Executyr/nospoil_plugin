document.getElementById("apply").addEventListener("click", () => {
  const prompt = document.getElementById("prompt").value;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: handlePrompt,
      args: [prompt]
    });
  });
});

function handlePrompt(prompt) {
  // Exemple : comportement simulé
  if (prompt.toLowerCase().includes("cache") && prompt.toLowerCase().includes("shorts")) {
    const sections = document.querySelectorAll('ytd-rich-section-renderer');
    sections.forEach((section) => {
      if (section.innerText.toLowerCase().includes("shorts")) {
        section.style.display = 'none';
      }
    });
  }

  if (prompt.toLowerCase().includes("remplace") && prompt.toLowerCase().includes("mrbeast")) {
    const elements = document.querySelectorAll('h3, h4, span');
    elements.forEach((el) => {
      if (el.textContent.includes("MrBeast")) {
        el.textContent = el.textContent.replace("MrBeast", "UltraSport Highlights");
      }
    });
  }

  // On peut ajouter d'autres règles ici...
}
