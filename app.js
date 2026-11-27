const dashboardPage = document.getElementById("dashboardPage");
const otherPage = document.getElementById("otherPage");
const placeholderTitle = document.getElementById("placeholderTitle");
const placeholderAction = document.getElementById("placeholderAction");
const sidebar = document.getElementById("sidebar");
const moduleView = document.getElementById("moduleView");

const pageNames = {
  customers: "Customers",
  motorcycles: "Motorcycles",
  repairs: "Repair Management",
  tracking: "Repair Tracking",
  inventory: "Inventory",
  billing: "Billing & Payments",
  staff: "Mechanics & Staff",
  reports: "Reports & Analytics",
  settings: "System Settings"
};

const seeds = {
  customers: [
    ["Ricardo Santos", "0917 555 1042", "Honda Click 125", "QAW-1042"],
    ["Maria Dela Cruz", "0918 222 1041", "Yamaha Mio Sporty", "QAW-1041"],
    ["Jose Villanueva", "0919 333 1039", "Suzuki Raider 150", "QAW-1039"]
  ],
  motorcycles: [
    ["Honda Click 125", "MC-CL125", "Ricardo Santos", "In workshop"],
    ["Yamaha Mio Sporty", "MC-MI089", "Maria Dela Cruz", "In workshop"],
    ["Suzuki Raider 150", "MC-RA150", "Jose Villanueva", "Waiting parts"]
  ],
  repairs: [
    ["QAW-1042", "Honda Click 125", "Ricardo Santos", "Diagnosing"],
    ["QAW-1041", "Yamaha Mio Sporty", "Maria Dela Cruz", "In Progress"],
    ["QAW-1039", "Suzuki Raider 150", "Jose Villanueva", "Waiting Parts"]
  ],
  inventory: [
    ["Brake pads", "BRK-001", "12", "In stock"],
    ["Engine oil", "OIL-010", "24", "In stock"],
    ["Drive belt", "BEL-024", "3", "Low stock"]
  ],
  billing: [
    ["INV-0089", "Maria Dela Cruz", "₱1,500", "Paid"],
    ["INV-0090", "Ricardo Santos", "₱1,850", "Pending"],
    ["INV-0091", "Jose Villanueva", "₱2,400", "Pending"]
  ],
  staff: [
    ["Jun Macias", "Senior Mechanic", "Diagnosing", "Available"],
    ["Alex Reyes", "Mechanic", "QAW-1041", "On job"],
    ["Mark Lim", "Mechanic", "QAW-1039", "On job"]
  ]
};

const moduleColumns = {
  customers: ["Customer", "Phone", "Motorcycle", "Latest repair"],
  motorcycles: ["Motorcycle", "Plate / Unit", "Owner", "Status"],
  repairs: ["Tracking ID", "Motorcycle", "Customer", "Status"],
  inventory: ["Item", "SKU", "Quantity", "Status"],
  billing: ["Invoice", "Customer", "Amount", "Status"],
  staff: ["Staff", "Role", "Assignment", "Availability"]
};

const moduleFields = {
  customers: ["Name", "Phone", "Motorcycle", "Tracking ID"],
  motorcycles: ["Motorcycle", "Plate / Unit", "Owner", "Status"],
  repairs: ["Tracking ID", "Motorcycle", "Customer", "Status"],
  inventory: ["Item", "SKU", "Quantity", "Status"],
  billing: ["Invoice", "Customer", "Amount", "Status"],
  staff: ["Staff", "Role", "Assignment", "Availability"]
};

let currentPage = "dashboard";
let records = loadRecords();

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem("qawiRecords")) || seeds;
  } catch {
    return seeds;
  }
}

function saveRecords() {
  localStorage.setItem("qawiRecords", JSON.stringify(records));
}

function showPage(page) {
  currentPage = page;
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.page === page));
  if (page === "dashboard") {
    dashboardPage.hidden = false;
    otherPage.hidden = true;
  } else {
    dashboardPage.hidden = true;
    otherPage.hidden = false;
    placeholderTitle.textContent = pageNames[page] || page;
    placeholderAction.textContent = ["tracking", "reports", "settings"].includes(page) ? "Refresh" : "＋ Add New";
    renderModule(page);
  }
  sidebar.classList.remove("open");
}

function renderModule(page) {
  if (page === "tracking") {
    moduleView.innerHTML = `
      <div class="module-toolbar"><input id="moduleTrackingInput" placeholder="Enter tracking ID (e.g. QAW-1042)" value="QAW-1042"><button class="primary-button" id="moduleTrackButton">Track Repair</button></div>
      <div id="moduleTrackingResult"></div>`;
    document.getElementById("moduleTrackButton").addEventListener("click", lookupTracking);
    lookupTracking();
    return;
  }

  if (page === "reports") {
    moduleView.innerHTML = `
      <div class="module-stats">
        <div class="module-stat"><span>ACTIVE REPAIRS</span><strong>18</strong></div>
        <div class="module-stat"><span>CUSTOMERS</span><strong>${248 + (records.customers?.length - seeds.customers.length)}</strong></div>
        <div class="module-stat"><span>PENDING PAYMENTS</span><strong>₱24,580</strong></div>
      </div>
      <div class="module-toolbar"><span>Current shop summary</span><button class="table-action" id="printReportButton">Print report</button></div>`;
    document.getElementById("printReportButton").addEventListener("click", () => window.print());
    return;
  }

  if (page === "settings") {
    moduleView.innerHTML = `
      <div class="settings-list">
        <div class="setting-row"><div><strong>Notifications</strong><small>Show workshop alerts and status updates</small></div><button class="toggle-button on" aria-label="Toggle notifications"><i></i></button></div>
        <div class="setting-row"><div><strong>Customer portal</strong><small>Allow customers to track active repairs</small></div><button class="toggle-button on" aria-label="Toggle customer portal"><i></i></button></div>
        <div class="setting-row"><div><strong>Print-ready reports</strong><small>Use a compact layout when printing</small></div><button class="toggle-button" aria-label="Toggle print layout"><i></i></button></div>
      </div>`;
    moduleView.querySelectorAll(".toggle-button").forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("on");
        showToast(button.classList.contains("on") ? "Setting enabled" : "Setting disabled");
      });
    });
    return;
  }

  const rows = records[page] || [];
  const columns = moduleColumns[page];
  moduleView.innerHTML = `
    <div class="module-toolbar"><input class="module-search" placeholder="Search ${pageNames[page].toLowerCase()}"><span>${rows.length} record${rows.length === 1 ? "" : "s"}</span></div>
    <table class="data-table"><thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}<th></th></tr></thead>
    <tbody>${rows.map((row, index) => `<tr>${row.map((value) => `<td>${value}</td>`).join("")}<td><button class="table-action" data-delete-record="${index}">Remove</button></td></tr>`).join("")}</tbody></table>`;

  const search = moduleView.querySelector(".module-search");
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    moduleView.querySelectorAll("tbody tr").forEach((row) => {
      row.hidden = !row.textContent.toLowerCase().includes(query);
    });
  });
  moduleView.querySelectorAll("[data-delete-record]").forEach((button) => {
    button.addEventListener("click", () => {
      records[page].splice(Number(button.dataset.deleteRecord), 1);
      saveRecords();
      renderModule(page);
      showToast("Record removed");
    });
  });
}

function lookupTracking() {
  const input = document.getElementById("moduleTrackingInput");
  const id = input.value.trim().toUpperCase();
  const found = (records.repairs || []).find((row) => row[0].toUpperCase() === id);
  document.getElementById("moduleTrackingResult").innerHTML = found
    ? `<div class="track-result"><div class="track-result-head"><div><span>TRACKING ID</span><strong>${found[0]}</strong></div><span class="status progress">${found[3]}</span></div><div class="track-bike"><div><strong>${found[1]}</strong><small>${found[2]}</small></div></div></div>`
    : `<div class="empty-state" style="min-height:260px"><h1>Repair not found</h1><p>Check the tracking ID and try again.</p></div>`;
}

document.querySelectorAll(".nav-item[data-page]").forEach((item) => item.addEventListener("click", () => showPage(item.dataset.page)));
document.querySelectorAll("[data-page-link]").forEach((item) => item.addEventListener("click", () => showPage(item.dataset.pageLink)));
document.getElementById("menuButton").addEventListener("click", () => sidebar.classList.toggle("open"));

const repairModal = document.getElementById("newRepairModal");
document.getElementById("newRepairButton").addEventListener("click", () => {
  repairModal.hidden = false;
  repairModal.querySelector("input").focus();
});
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => { repairModal.hidden = true; }));
repairModal.addEventListener("click", (event) => { if (event.target === repairModal) repairModal.hidden = true; });

document.getElementById("repairForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const customer = data.get("customer");
  const brand = data.get("brand");
  const model = data.get("model");
  const trackingId = `QAW-${Math.floor(1043 + Math.random() * 900)}`;
  records.repairs.unshift([trackingId, `${brand} ${model}`, customer, "Diagnosing"]);
  records.customers.unshift([customer, data.get("phone"), `${brand} ${model}`, trackingId]);
  saveRecords();
  repairModal.hidden = true;
  form.reset();
  showToast(`Repair ${trackingId} registered for ${customer}`);
});

const portalModal = document.getElementById("portalModal");
document.getElementById("customerPortalButton").addEventListener("click", () => {
  portalModal.hidden = false;
  document.getElementById("trackingInput").focus();
});
document.querySelector("[data-close-portal]").addEventListener("click", () => { portalModal.hidden = true; });
portalModal.addEventListener("click", (event) => { if (event.target === portalModal) portalModal.hidden = true; });

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.getElementById("trackButton").addEventListener("click", () => {
  const input = document.getElementById("trackingInput");
  const trackingId = input.value.trim().toUpperCase();
  if (!trackingId) {
    showToast("Please enter a tracking ID");
    input.focus();
    return;
  }
  const found = (records.repairs || []).find((row) => row[0].toUpperCase() === trackingId);
  if (!found) {
    showToast("Repair not found");
    return;
  }
  document.querySelector(".track-result-head strong").textContent = found[0];
  document.querySelector(".track-bike strong").textContent = found[1];
  document.querySelector(".track-bike small").textContent = found[2];
  document.querySelector(".track-result-head .status").textContent = found[3];
  showToast(`Repair ${trackingId} found`);
});

document.getElementById("activityRefresh").addEventListener("click", () => showToast("Activity list updated"));
document.querySelector(".notification").addEventListener("click", () => showToast("No new notifications"));
document.querySelectorAll(".row-menu").forEach((button) => button.addEventListener("click", () => showToast("Repair actions: view, edit, or update status")));

const globalSearch = document.getElementById("globalSearch");
globalSearch.addEventListener("input", () => {
  const query = globalSearch.value.trim().toLower();
  if (!dashboardPage.hidden) {
    document.querySelectorAll(".repair-row").forEach((row) => {
      row.style.display = (row.dataset.search || "").includes(query) ? "grid" : "none";
    });
  }
});

const moduleModal = document.getElementById("moduleModal");
const moduleForm = document.getElementById("moduleForm");
const moduleFormFields = document.getElementById("moduleFormFields");

function openModuleModal() {
  if (!moduleFields[currentPage]) return;
  document.getElementById("moduleModalTitle").textContent = `Add ${pageNames[currentPage].replace(/s$/, "")}`;
  document.getElementById("moduleModalEyebrow").textContent = pageNames[currentPage].toUpperCase();
  moduleFormFields.innerHTML = moduleFields[currentPage].map((label) => `
    <label>${label}<input name="${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}" required placeholder="Enter ${label.toLowerCase()}"></label>
  `).join("");
  moduleModal.hidden = false;
  moduleFormFields.querySelector("input").focus();
}

placeholderAction.addEventListener("click", () => {
  if (moduleFields[currentPage]) openModuleModal();
  else if (currentPage === "tracking") lookupTracking();
  else if (["reports", "settings"].includes(currentPage)) showToast(`${pageNames[currentPage]} refreshed`);
});

document.querySelectorAll("[data-close-module-modal]").forEach((button) => button.addEventListener("click", () => { moduleModal.hidden = true; }));
moduleModal.addEventListener("click", (event) => { if (event.target === moduleModal) moduleModal.hidden = true; });

moduleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(moduleForm);
  const values = moduleFields[currentPage].map((label) => data.get(label.toLowerCase().replace(/[^a-z0-9]+/g, "_")));
  records[currentPage].push(values);
  saveRecords();
  moduleModal.hidden = true;
  moduleForm.reset();
  renderModule(currentPage);
  showToast(`${pageNames[currentPage].replace(/s$/, "")} record saved`);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    globalSearch.focus();
  }
  if (event.key === "Escape") {
    repairModal.hidden = true;
    portalModal.hidden = true;
    moduleModal.hidden = true;
  }
});
