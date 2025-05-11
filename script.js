let tabCount = 0;
let currentTabId = null;

function getProxyURL(url) {
  const encoded = btoa(url);
  return `/uv/service/hvtrs8%2F-${encoded}`; // Standard Ultraviolet pattern
}

function isUsingProxy() {
  return document.getElementById("proxyToggle").checked;
}

function createTab(url, label = null) {
  const id = "tab" + (++tabCount);
  const useProxy = isUsingProxy();
  const fullURL = useProxy ? getProxyURL(url) : url;

  // Create tab button
  const tab = document.createElement("div");
  tab.className = "tab";
  tab.id = id + "-btn";
  tab.innerHTML = (label || url) + `<span class="close" onclick="closeTab('${id}', event)">✖️</span>`;
  tab.onclick = () => switchTab(id);
  document.getElementById("tabs").appendChild(tab);

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = fullURL;
  iframe.id = id + "-frame";
  document.getElementById("iframe-container").appendChild(iframe);

  switchTab(id);
}

function switchTab(id) {
  // Hide all iframes & tabs
  document.querySelectorAll("iframe").forEach(f => f.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

  // Show selected
  const iframe = document.getElementById(id + "-frame");
  const tab = document.getElementById(id + "-btn");
  if (iframe && tab) {
    iframe.classList.add("active");
    tab.classList.add("active");
    currentTabId = id;
  }
}

function refreshTab() {
  if (!currentTabId) return;
  const iframe = document.getElementById(currentTabId + "-frame");
  if (iframe) iframe.src = iframe.src;
}

function closeTab(id, event) {
  event.stopPropagation(); // Prevent triggering tab switch
  const iframe = document.getElementById(id + "-frame");
  const tab = document.getElementById(id + "-btn");

  if (iframe) iframe.remove();
  if (tab) tab.remove();

  if (currentTabId === id) {
    // Switch to last tab if closing current
    const tabs = document.querySelectorAll(".tab");
    if (tabs.length > 0) {
      const lastId = tabs[tabs.length - 1].id.replace("-btn", "");
      switchTab(lastId);
    } else {
      currentTabId = null;
    }
  }
}

function goToURL() {
  let input = document.getElementById("url").value.trim();
  if (!input) return;

  let url = input;
  if (!input.startsWith("http://") && !input.startsWith("https://")) {
    url = "https://" + input;
  }

  createTab(url);
}

function searchQuery() {
  let input = document.getElementById("url").value.trim();
  if (!input) return;

  const engine = document.getElementById("engine").value;
  const query = encodeURIComponent(input);
  let searchURL = "";

  switch (engine) {
    case "duckduckgo":
      searchURL = `https://duckduckgo.com/?q=${query}`;
      break;
    case "bing":
      searchURL = `https://www.bing.com/search?q=${query}`;
      break;
    case "brave":
      searchURL = `https://search.brave.com/search?q=${query}`;
      break;
  }

  createTab(searchURL, input);
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-theme");
  body.classList.toggle("light-theme");
}
