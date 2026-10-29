// Builds what gets shared, for each message format. Shared by the background
// worker and the options page preview.

var FORMATS = {
  link: "Link only",
  title: "Title and link",
  markdown: "Markdown link: [Title](link)",
  hyperlink: "Copy as hyperlink (paste into Telegram)"
};

var DEFAULT_FORMAT = "link";

function cleanTitle(title, url) {
  var t = (title || "").replace(/\s+/g, " ").trim();
  return t || url;
}

// Square brackets in the title and parentheses in the URL would end the
// markdown link early, so they are escaped / percent-encoded.
function markdownLink(title, url) {
  var t = cleanTitle(title, url).replace(/([\[\]\\])/g, "\\$1");
  var u = url.replace(/\(/g, "%28").replace(/\)/g, "%29");
  return "[" + t + "](" + u + ")";
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function hyperlinkHtml(title, url) {
  return '<a href="' + escapeHtml(url) + '">' + escapeHtml(cleanTitle(title, url)) + "</a>";
}

// The tg://msg_url link Telegram opens its share dialog with. Telegram only
// takes a url and an optional text; there is no field for a link's label.
function telegramUrl(format, title, url) {
  if (format === "title") {
    return "tg://msg_url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(cleanTitle(title, url));
  }
  if (format === "markdown") {
    return "tg://msg_url?url=" + encodeURIComponent(markdownLink(title, url));
  }
  return "tg://msg_url?url=" + encodeURIComponent(url);
}
