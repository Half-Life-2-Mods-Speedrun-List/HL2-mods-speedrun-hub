for (const element of document.querySelectorAll("include"))
  fetchAndReplace(element);

const main = document.querySelector("main");
const includes = new Map();

onHashChange();

addEventListener("hashchange", onHashChange);

async function onHashChange() {
  let { hash } = location;
  if (!hash) {
    hash = main.firstElementChild.hash;
    location.replace(location.href + hash);
  }
  // Highlight selected menu
  document.querySelectorAll('.main-select').forEach(div => {
    const a = div.parentElement;
    if (a && a.getAttribute('href') === hash) {
      div.classList.add('selected');
    } else {
      div.classList.remove('selected');
    }
    div.classList.add('main-select');
  });
  const page = `${hash.substring(1)}.html`;
  const text = await loadOrfetch(page);
  main.innerHTML = text;
}

async function fetchAndReplace(element) {
  const text = await loadOrfetch(element.getAttribute("src"));
  element.outerHTML = text;
}

async function loadOrfetch(page) {
  if (includes.has(page)) return includes.get(page);
  const res = await fetch(page);
  if (res.ok) {
    const text = res.text();
    includes.set(page, text);
    return text;
  } else throw res.statusText;
}
