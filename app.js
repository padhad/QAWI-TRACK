const dashboardPage = document.getElementById("dashboardPage");
const otherPage = document.getElementById("otherPage");
const placeholderTitle = document.getElementById("placeholderTitle");
const placeholderAction = document.getElementById("placeholderAction");
const sidebar = document.getElementById("sidebar");
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

function showPage(page) {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.page === page));
  if (page === "dashboard") {
    dashboardPage.hidden = false;
    otherPage.hidden = true;
  } else {
    dashboardPage.hidden = true;
    otherPage.hidden = false;
    placeholderTitle.textContent = pageNames[page] || page;
    placeholderAction.textContent = ["tracking", "reports", "settings"].includes(page) ? "Open Module" : `＋ Add New`;
  }
  sidebar.classList.remove("open");
}

document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
  item.addEventListener("click", () => showPage(item.dataset.page));
});
document.querySelectorAll("[data-page-link]").forEach((item) => item.addEventListener("click", () => showPage(item.dataset.pageLink)));

document.getElementById("menuButton").addEventListener("click", () => sidebar.classList.toggle("open"));

const repairModal = document.getElementById("newRepairModal");
document.getElementById("newRepairButton").addEventListener("click", () => { repairModal.hidden = false; repairModal.querySelector("input").focus(); });
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => { repairModal.hidden = true; }));
repairModal.addEventListener("click", (event) => { if (event.target === repairModal) repairModal.hidden = true; });

document.getElementById("repairForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const customer = new FormData(form).get("customer");
  repairModal.hidden = true;
  form.reset();
  showToast(`Repair registered for ${customer}`);
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
  document.querySelector(".track-result-head strong").textContent = trackingId;
  showToast(`Repair ${trackingId} found`);
});

document.getElementById("activityRefresh").addEventListener("click", () => showToast("Activity list updated"));

const globalSearch = document.getElementById("globalSearch");
globalSearch.addEventListener("input", () => {
  const query = globalSearch.value.trim().toLowerCase();
  if (!dashboardPage.hidden) {
    document.querySelectorAll(".repair-row").forEach((row) => {
      row.style.display = row.dataset.search.includes(query) ? "grid" : "none";
    });
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    globalSearch.focus();
  }
  if (event.key === "Escape") {
    repairModal.hidden = true;
    portalModal.hidden = true;
  }
});
