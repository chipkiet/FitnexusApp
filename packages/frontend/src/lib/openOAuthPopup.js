// /src/lib/openOAuthPopup.js
export function openOAuthPopup(
  url,
  { backendOrigin = "http://localhost:3001", frontendOrigin = "http://localhost:5173" } = {}
) {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      url,
      "oauth-google",
      "width=520,height=640,menubar=no,toolbar=no"
    );
    if (!popup) return reject(new Error("Popup blocked"));

    let closedCheck = null;
    let resolved = false;

    function cleanup() {
      window.removeEventListener("message", onMessage);
      try { popup.close(); } catch (_) {}
      if (closedCheck) clearInterval(closedCheck);
    }

function onMessage(event) {
  if (event.origin !== backendOrigin && event.origin !== frontendOrigin) return;
  const data = event.data || {};
  if (data.source === "oauth" && data.provider === "google") {
    resolved = true;
    cleanup();
    return resolve(data); // <-- có token, user
  }
}

    window.addEventListener("message", onMessage);

    closedCheck = setInterval(() => {
      if (popup.closed && !resolved) {
        cleanup();
        reject(new Error("Popup closed"));
      }
    }, 400);
  });
}
