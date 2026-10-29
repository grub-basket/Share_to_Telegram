// Puts a rich-text link on the clipboard. Pasting rich text into Telegram
// Desktop keeps it as a clickable link with the page title as its label; apps
// that only take plain text get the markdown version instead.
chrome.runtime.onMessage.addListener(function (msg, _sender, reply) {
  if (!msg || msg.target !== "offscreen") return;
  var done = false;
  function onCopy(e) {
    e.clipboardData.setData("text/html", msg.html);
    e.clipboardData.setData("text/plain", msg.text);
    e.preventDefault();
    done = true;
  }
  document.addEventListener("copy", onCopy);
  try {
    document.execCommand("copy");
  } finally {
    document.removeEventListener("copy", onCopy);
  }
  reply(done);
});
