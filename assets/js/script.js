const container = document.getElementById("imageContainer");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const buttons = [nextBtn, backBtn];

function scrollByOneImage(dir) {
  const img = container.querySelector("img");
  if (!img) return;

  const step = img.offsetWidth + 10; // 10 = gap
  container.scrollLeft += dir === "next" ? step : -step;

  updateLayout();
}

function updateLayout() {
  const needsScroll = container.scrollWidth > container.clientWidth;
  if (needsScroll) {
    container.style.justifyContent = "flex-start";
    buttons.forEach((btn) => (btn.style.display = "flex"));
  } else {
    container.style.justifyContent = "center";
    buttons.forEach((btn) => (btn.style.display = "none"));
  }
}

nextBtn.addEventListener("click", () => scrollByOneImage("next"));
backBtn.addEventListener("click", () => scrollByOneImage("back"));
window.addEventListener("load", updateLayout);
window.addEventListener("resize", updateLayout);

const projects = [
  {
    note: "Note: Buit at Sqwad",
    img: "assets/img/sqwad_dashboard.png",
    background_color: "pink",
    readable: false,
    link: "",
    title: "Sqwad Dashboard",
    description: "Sqwad DashboardSqwad Dashboard",
    tags: ["React", "Redux", "Typescript", "Tailwind", "HTML", "CSS"],
  },
  {
    note: "Note: Personal project",
    img: "https://raw.githubusercontent.com/lienkt/QA-Form-Generator-FE/main/project.png",
    background_color: "blue",
    readable: true,
    link: "",
    title: "QA Form Generator",
    description: "QA Form GeneratorQA Form GeneratorQA Form Generator",
    tags: ["Flutter", "HTML", "CSS"],
  },
  {
    note: "Note: Learning project",
    img: "assets/img/issues_tracker.png",
    background_color: "yellow",
    readable: true,
    link: "",
    title: "Issues Tracker",
    description: "issues_trackerissues_tracker",
    tags: ["Javascript", "Tailwind"],
  },
  {
    note: "Note: Buit at fff",
    img: "assets/img/sqwad_dashboard.png",
    background_color: "green",
    readable: false,
    link: "",
    title: "Sqwad Dashboard",
    description: "Sqwad DashboardSqwad Dashboard",
    tags: ["React", "Redux", "HTML", "CSS"],
  },
  {
    note: "Note: Buit at fff",
    img: "assets/img/sqwad_dashboard.png",
    background_color: "orange",
    readable: false,
    link: "",
    title: "Sqwad Dashboard",
    description: "Sqwad DashboardSqwad Dashboard",
    tags: [
      "React",
      "Redux",
      "Typescript",
      "Tailwind",
      "HTML",
      "CSS",
      "React",
      "Redux",
      "HTML",
      "CSS",
    ],
  },
];

const projectsContainer = document.getElementById("projectsContainer");

projects.forEach((project) => {
  const item = document.createElement("div");
  item.className = "item " + project.background_color;

  item.innerHTML = `
    <p class="note">${project.note}</p>
    <img src="${project.img}" alt="${project.title}" class="image" />
    <h2 class="title">${project.title}</h2>
    <p class="description">${project.description}</p>
    <div class="tags">
      ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
  `;

  projectsContainer.appendChild(item);
});
