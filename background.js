importScripts("format.js");

function getFormat() {
  return chrome.storage.sync.get({ format: DEFAULT_FORMAT }).then(function (s) {
    return FORMATS[s.format] ? s.format : DEFAULT_FORMAT;
  });
}

// Opening tg:// from inside the page is what the extension has always done.
// Pages scripts can't run on (chrome://, the Web Store) fall back to pointing
// the tab at the link, which hands it to Telegram the same way.
function openInTelegram(tab, link) {
  return chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      func: function (href) { window.location.href = href; },
      args: [link]
    })
    .catch(function () {
      return chrome.tabs.update(tab.id, { url: link });
    });
}

function flashBadge(text) {
  chrome.action.setBadgeText({ text: text });
  setTimeout(function () { chrome.action.setBadgeText({ text: "" }); }, 2000);
}

// Only one offscreen page may exist, so two quick clicks share one creation.
var creatingOffscreen = null;

async function ensureOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  if (!creatingOffscreen) {
    creatingOffscreen = chrome.offscreen
      .createDocument({
        url: "offscreen.html",
        reasons: ["CLIPBOARD"],
        justification: "Copy the page as a hyperlink to paste into Telegram"
      })
      .finally(function () { creatingOffscreen = null; });
  }
  await creatingOffscreen;
}

// Service workers have no clipboard, so the copy happens in an offscreen page.
// Any failure shows "!" on the button so nobody pastes a stale clipboard.
async function copyHyperlink(tab) {
  var ok = false;
  try {
    await ensureOffscreen();
    ok = await chrome.runtime.sendMessage({
      target: "offscreen",
      html: hyperlinkHtml(tab.title, tab.url),
      text: markdownLink(tab.title, tab.url)
    });
  } catch (e) {
    console.error("Share to Telegram: copy failed", e);
  }
  flashBadge(ok ? "✓" : "!");
}

function share(tab, format) {
  if (!tab || !tab.url) return;
  if (format === "hyperlink") return copyHyperlink(tab);
  return openInTelegram(tab, telegramUrl(format, tab.title, tab.url));
}

chrome.action.onClicked.addListener(function (tab) {
  getFormat().then(function (format) { share(tab, format); });
});

// Right-click the toolbar button (or a page) to use another format once.
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.removeAll(function () {
    Object.keys(FORMATS).forEach(function (id) {
      chrome.contextMenus.create({
        id: "share-" + id,
        title: "Share to Telegram: " + FORMATS[id],
        contexts: ["action", "page"]
      });
    });
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  var format = String(info.menuItemId).replace(/^share-/, "");
  if (FORMATS[format]) share(tab, format);
});
