// Handle Decision Desk HQ responsive iframes
function receiveMessage(event) {
  if (["https://e.ddhq.io", "https://embeds.ddhq.io"].includes(event.origin) && event.data.id && event.data.height)
    document.getElementById(event.data.id).style.height = event.data.height + "px";
}
window.addEventListener("message", receiveMessage, false);
