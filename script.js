function loadSite() {
  let url = document.getElementById("url").value;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  document.getElementById("browserFrame").src = url;
}
