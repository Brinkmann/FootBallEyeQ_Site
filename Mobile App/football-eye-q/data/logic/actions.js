const settingsPage = document.getElementById("settings-page");
const patternsPage = document.getElementById("patterns-page");
const nodeCountSpan = document.getElementById("node-count");
const reprovBanner = document.getElementById("reprov-banner");

settingsPage.style.display = "none";
reprovBanner.style.display = "none";

const tableContainer = document.getElementById("table-container");
const table = document.createElement("table");
let activePattern = null;

const patternsBtn = document.getElementById("patterns-btn");
const settingsBtn = document.getElementById("settings-btn");

patternsBtn.addEventListener("click", onPatternsPressed);
settingsBtn.addEventListener("click", onSettingsPressed);

const defaultNumberOfPatternsToDisplay = 8;
let numberOfPatternsDefault = 0;

// === Fetch default number of patterns ===
performBlockingRequestForPatterns();

function performBlockingRequestForPatterns() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/patterns", false);
  try {
    xhr.send();
    if (xhr.status === 200) {
      const match = xhr.responseText.match(/\b\d{1,2}\b/);
      const foundNumber = match ? parseInt(match[0], 10) : null;
      numberOfPatternsDefault =
        foundNumber && foundNumber >= 1 && foundNumber <= 16
          ? foundNumber
          : defaultNumberOfPatternsToDisplay;
    } else {
      numberOfPatternsDefault = defaultNumberOfPatternsToDisplay;
    }
  } catch {
    numberOfPatternsDefault = defaultNumberOfPatternsToDisplay;
  }
}

// === Tabs inside settings page ===
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      tabContents.forEach((c) => (c.style.display = "none"));
      const targetId = tab.getAttribute("id").replace("-tab", "-content");
      document.getElementById(targetId).style.display = "block";
    });
  });
});

// === Reprovision button logic ===
document
  .getElementById("reprovision-button")
  .addEventListener("click", function () {
    var confirmation = confirm(
      "Are you sure you want to reprovision your device?"
    );
    if (confirmation) {
      alert("Your device will be restarted in WiFi Manager Mode.");
      settingsPage.style.display = "none";
      patternsPage.style.display = "none";
      patternsBtn.style.display = "none";
      settingsBtn.style.display = "none";
      nodeCountSpan.style.display = "none";
      reprovBanner.style.display = "block";
      const data = { reprov: "reprovision" };
      fetch("/reprovision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(console.error);
    } else {
      alert("Reprovisioning cancelled.");
    }
  });

// === Utility: Create pattern rows and sliders ===
function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function handleSliderToggleChange(slider, rowNumber) {
  const isChecked = slider.checked;
  if (isChecked && activePattern !== null && activePattern !== rowNumber) {
    const prevSlider = document.getElementById(`pattern${activePattern}`);
    if (prevSlider) prevSlider.checked = false;
  }
  activePattern = isChecked ? rowNumber : null;
  const data = { pattern: rowNumber, state: isChecked };
  fetch("/patterns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(console.error);
}

function createSliderToggleSwitch(rowNumber) {
  const slider = document.createElement("input");
  slider.type = "checkbox";
  slider.className = "slider-toggle";
  slider.id = `pattern${rowNumber}`;
  slider.addEventListener("click", () =>
    handleSliderToggleChange(slider, rowNumber)
  );
  return slider;
}

function createRow(rowNumber) {
  const row = document.createElement("tr");
  row.setAttribute("data-pattern", rowNumber);
  row.appendChild(createCell("Pattern " + rowNumber));
  const cell = createCell("");
  cell.appendChild(createSliderToggleSwitch(rowNumber));
  row.appendChild(cell);
  return row;
}

// === Create table ===
function createPatternsTable() {
  table.innerHTML = "";
  for (let i = 1; i <= numberOfPatternsDefault; i++) {
    const newRow = createRow(i);
    table.appendChild(newRow);
  }
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

// === Filtering Logic for Session Code ===
function parseSessionCode(code) {
  const clean = code.replace(/\D/g, ""); // remove non-digits
  const pairs = clean.match(/.{1,2}/g) || [];
  const uniqueNumbers = [...new Set(pairs.map((p) => parseInt(p, 10)))].filter(
    (n) => !isNaN(n)
  );
  return uniqueNumbers;
}

function filterPatternsBySessionCode() {
  const code = document.getElementById("session-code").value.trim();
  if (!code) {
    alert("Please enter a session code.");
    return;
  }
  const patternNumbers = parseSessionCode(code);
  if (patternNumbers.length === 0) {
    alert("Invalid session code.");
    return;
  }

  const rows = table.querySelectorAll("tr");
  rows.forEach((row) => {
    const patternNum = parseInt(row.getAttribute("data-pattern"), 10);
    row.style.display = patternNumbers.includes(patternNum) ? "table-row" : "none";
  });

  console.log("Visible patterns:", patternNumbers.join(", "));
}

// === Initialize ===
function initIndexPage() {
  createPatternsTable();
  const loadBtn = document.getElementById("load-session-btn");
  if (loadBtn) loadBtn.addEventListener("click", filterPatternsBySessionCode);
}

initIndexPage();

// === Navigation ===
function onPatternsPressed() {
  settingsPage.style.display = "none";
  patternsPage.style.display = "block";
}
function onSettingsPressed() {
  settingsPage.style.display = "block";
  patternsPage.style.display = "none";
}
