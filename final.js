const events = [
  {
    id: "EVT-103",
    name: "Neighborhood Cleanup",
    category: "Volunteer",
    date: "Mar 18, 2026",
    time: "9:00 AM",
    venue: "Riverfront Park",
    capacity: 80,
    status: "Open",
  },
  {
    id: "EVT-104",
    name: "Local Makers Workshop",
    category: "Workshop",
    date: "Apr 05, 2026",
    time: "2:00 PM",
    venue: "Community Hub Lab",
    capacity: 40,
    status: "Open",
  },
  {
    id: "EVT-105",
    name: "Community Potluck",
    category: "Social",
    date: "Apr 22, 2026",
    time: "6:30 PM",
    venue: "Main Street Hall",
    capacity: 120,
    status: "Filling",
  },
];

const eventsGrid = document.getElementById("events-grid");
const eventSelect = document.getElementById("event-select");
const eventDate = document.getElementById("event-date");
const eventLocation = document.getElementById("event-location");
const loginTabs = document.querySelectorAll(".login-tab");
const loginButton = document.getElementById("login-button");
const dashboardGrid = document.getElementById("dashboard-grid");
const dashboardSubtitle = document.getElementById("dashboard-subtitle");
const revealSections = document.querySelectorAll(".reveal");
const blobs = document.querySelectorAll(".blob");
let activeRole = "visitor";

function renderEvents() {
  if (!eventsGrid) return;
  eventsGrid.innerHTML = "";
  events.forEach((event) => {
    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <div>
        <h3>${event.name}</h3>
        <div class="event-meta">${event.category} - ${event.status}</div>
      </div>
      <div class="event-meta">${event.date} - ${event.time}</div>
      <div class="event-meta">${event.venue}</div>
      <div class="event-meta">Capacity: ${event.capacity}</div>
    `;
    eventsGrid.appendChild(card);
  });
}

function populateForm() {
  if (!eventSelect) return;
  eventSelect.innerHTML = "";
  events.forEach((event, index) => {
    const option = document.createElement("option");
    option.value = event.id;
    option.textContent = event.name;
    option.dataset.date = event.date;
    option.dataset.venue = event.venue;
    if (index === 0) {
      option.selected = true;
      if (eventDate) eventDate.value = event.date;
      if (eventLocation) eventLocation.value = event.venue;
    }
    eventSelect.appendChild(option);
  });
}

function attachListeners() {
  if (!eventSelect) return;
  eventSelect.addEventListener("change", (event) => {
    const selected = event.target.selectedOptions[0];
    if (eventDate) eventDate.value = selected.dataset.date || "";
    if (eventLocation) eventLocation.value = selected.dataset.venue || "";
  });
}

function renderDashboard(role) {
  if (!dashboardGrid) return;

  const visitorStats = [
    { value: "8", label: "Events this month" },
    { value: "3", label: "New workshops" },
    { value: "120+", label: "Seats available" },
    { value: "95%", label: "Positive feedback" },
  ];

  const adminStats = [
    { value: "12", label: "Events managed" },
    { value: "486", label: "Total registrations" },
    { value: "18", label: "Waitlist requests" },
    { value: "4", label: "Events needing updates" },
  ];

  const data = role === "admin" ? adminStats : visitorStats;
  if (dashboardSubtitle) {
    dashboardSubtitle.textContent =
      role === "admin"
        ? "Overview of registrations, capacity, and event health."
        : "Your snapshot of what's happening this week.";
  }

  dashboardGrid.innerHTML = "";
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-value">${item.value}</div>
      <div class="stat-label">${item.label}</div>
    `;
    dashboardGrid.appendChild(card);
  });
}

function handleLoginTabs() {
  if (!loginTabs.length) return;

  loginTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loginTabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      activeRole = tab.dataset.role || "visitor";
      renderDashboard(activeRole);
    });
  });

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      renderDashboard(activeRole);
    });
  }
}

function handleReveal() {
  if (!revealSections.length) return;

  if (!("IntersectionObserver" in window)) {
    revealSections.forEach((section) => section.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealSections.forEach((section) => observer.observe(section));
}

function handleParallax() {
  if (!blobs.length) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  function onMove(event) {
    const { innerWidth, innerHeight } = window;
    mouseX = (event.clientX / innerWidth - 0.5) * 2;
    mouseY = (event.clientY / innerHeight - 0.5) * 2;
  }

  function animate() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    blobs.forEach((blob, index) => {
      const depth = (index + 1) * 8;
      const offsetX = currentX * depth;
      const offsetY = currentY * depth;
      blob.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("mousemove", onMove);
  animate();
}

renderEvents();
populateForm();
attachListeners();
handleLoginTabs();
renderDashboard(activeRole);
handleReveal();
handleParallax();
