# Share to Telegram

A Chrome extension that shares the page you're on to Telegram. Click the toolbar button and Telegram opens its share dialog, where you pick a chat and can edit the message before sending.

## Message formats

Choose the default in the extension's options (right-click the toolbar button, then **Options**). Right-click the button or the page to use a different format once.

- **Link only:** the page's address. This is the default and the original behaviour.
- **Title and link:** the address with the page title on the next line.
- **Markdown link:** `[Page title](address)`. Apps that read markdown show it as a clickable title. Telegram Desktop may send it exactly as typed.
- **Copy as hyperlink:** copies the page title as a clickable link instead of opening Telegram. Paste it into any Telegram chat and it stays a hyperlink. A ✓ on the button confirms the copy.

Telegram's share link only accepts an address and some text, with no field for a link label. That's why the hyperlink option copies the link for you to paste rather than opening Telegram.

## Install

1. Download or clone this repository.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and choose the folder.

You need the Telegram app installed so `tg://` links open in it.

## License

MIT © grub-basket
