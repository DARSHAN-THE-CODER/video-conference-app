export async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return Document.execCommand("copy", true, text);
    }
  }
  