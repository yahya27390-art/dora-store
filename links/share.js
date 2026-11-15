const shareButton = document.querySelector(".share");
const status = document.querySelector(".status");
let dismiss;

shareButton.hidden = false;
shareButton.addEventListener("click", async () => {
  const url = new URL(location.pathname, location.origin).href;
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url });
      return;
    }
  } catch (error) {
    if (error.name === "AbortError") return;
  }

  try {
    await navigator.clipboard.writeText(url);
    status.textContent = document.documentElement.lang === "en" ? "Page link copied" : "تم نسخ رابط الصفحة";
  } catch {
    status.textContent = url;
  }

  status.hidden = false;
  clearTimeout(dismiss);
  dismiss = setTimeout(() => { status.hidden = true; }, 5000);
});
