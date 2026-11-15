const branchLocations = [
  {
    "lat": 26.34746487392914,
    "lng": 43.9517417550087,
    "title": "المركز الرئيسي",
    "area": "صناعية السليم",
    "en": "Main branch",
    "areaEn": "Al-Saleem Industrial Area",
    "phone": "+966563881321"
  },
  {
    "lat": 26.347527366957443,
    "lng": 43.98015238344669,
    "title": "الفرع الثاني",
    "area": "صناعية الرواف",
    "en": "Branch 2",
    "areaEn": "Al-Rawaf Industrial Area",
    "phone": "+966530051360"
  },
  {
    "lat": 26.349718717279295,
    "lng": 43.94669217121843,
    "title": "الفرع الثالث",
    "area": "صناعية السليم",
    "en": "Branch 3",
    "areaEn": "Al-Saleem Industrial Area",
    "phone": "+966539454377"
  }
];

const mapNode = document.querySelector("#branch-map");
const mapReset = document.querySelector("#map-reset");
const mapButtons = [...document.querySelectorAll("[data-map-branch]")];
const prefersStill = matchMedia("(prefers-reduced-motion: reduce)");
const english = document.documentElement.lang === "en";

if (window.L && mapNode) {
  const map = L.map(mapNode, { scrollWheelZoom: false, zoomControl: false });
  L.control.zoom({
    zoomInTitle: english ? "Zoom in" : "تكبير",
    zoomOutTitle: english ? "Zoom out" : "تصغير"
  }).addTo(map);
  map.attributionControl.setPrefix(false);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  function selectBranch(index) {
    mapButtons.forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === index));
      button.closest(".branch").classList.toggle("is-selected", i === index);
    });
  }

  const markers = branchLocations.map((branch, index) => {
    const name = english ? branch.en : branch.title;
    const marker = L.marker([branch.lat, branch.lng], {
      title: name,
      alt: name,
      icon: L.divIcon({ className: "branch-marker", html: String(index + 1), iconSize: [38, 38] })
    }).addTo(map);
    const popup = document.createElement("div");
    popup.className = "branch-popup";
    popup.dir = english ? "ltr" : "rtl";
    const heading = document.createElement("strong");
    heading.textContent = name;
    const area = document.createElement("span");
    area.textContent = english ? branch.areaEn : branch.area;
    popup.append(heading, area);
    marker.bindPopup(popup).on("popupopen", () => selectBranch(index));
    return marker;
  });

  const bounds = L.featureGroup(markers).getBounds();
  function fitBranches(animate) {
    map.stop().closePopup().fitBounds(bounds, { padding: [42, 42], maxZoom: 15, animate });
    selectBranch(-1);
  }
  fitBranches(false);

  mapButtons.forEach((button, index) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const marker = markers[index];
      map.stop().setView(marker.getLatLng(), 16, { animate: !prefersStill.matches });
      marker.openPopup();
      mapNode.scrollIntoView({ block: "nearest", behavior: prefersStill.matches ? "instant" : "smooth" });
    });
  });
  mapReset.hidden = false;
  mapReset.addEventListener("click", () => fitBranches(!prefersStill.matches));
  mapNode.classList.add("map-ready");
  tiles.once("tileload", () => mapNode.classList.add("tiles-ready"));
}
