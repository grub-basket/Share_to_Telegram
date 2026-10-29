var HINTS = {
  link: "The page's address, as before.",
  title: "The address with the page title on the next line.",
  markdown: "Shows as a clickable title in apps that read markdown links; Telegram Desktop may send it as typed.",
  hyperlink: "Copies a clickable title link. Paste it into any Telegram chat; it stays a hyperlink."
};

var box = document.getElementById("formats");
// Not named "status": a top-level var of that name is window.status, which
// only holds strings.
var statusEl = document.getElementById("status");

Object.keys(FORMATS).forEach(function (id) {
  var label = document.createElement("label");
  var input = document.createElement("input");
  input.type = "radio";
  input.name = "format";
  input.value = id;
  input.addEventListener("change", function () {
    chrome.storage.sync.set({ format: id }).then(function () {
      statusEl.textContent = "Saved.";
    });
  });
  label.appendChild(input);
  label.appendChild(document.createTextNode(" " + FORMATS[id]));
  var hint = document.createElement("div");
  hint.className = "hint";
  hint.textContent = HINTS[id];
  label.appendChild(hint);
  box.appendChild(label);
});

chrome.storage.sync.get({ format: DEFAULT_FORMAT }).then(function (s) {
  var current = FORMATS[s.format] ? s.format : DEFAULT_FORMAT;
  box.querySelector('input[value="' + current + '"]').checked = true;
});
