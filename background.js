chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true }, () => {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
    chrome.action.setTitle({ title: "nospoil_plugin actif" });
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  const { enabled } = await chrome.storage.sync.get("enabled");
  const newState = !enabled;

  chrome.storage.sync.set({ enabled: newState }, () => {
    chrome.action.setBadgeText({ text: newState ? "ON" : "" });
    chrome.action.setBadgeBackgroundColor({ color: newState ? "#4CAF50" : "#B0BEC5" });
    chrome.action.setTitle({ title: newState ? "nospoil_plugin actif" : "nospoil_plugin désactivé" });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => location.reload()
    });
  });
});