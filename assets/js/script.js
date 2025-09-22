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
    github_link: "",
    live_link: "",
    title: "Sqwad Dashboard",
    description:
      "Sqwad Dashboard helps retail brands collaborate and reduce customer acquisition costs.",
    tags: ["React", "Redux", "Typescript", "Tailwind", "HTML", "CSS"],
  },
  {
    note: "Note: Personal project",
    img: "https://raw.githubusercontent.com/lienkt/QA-Form-Generator-FE/main/project.png",
    background_color: "blue",
    readable: true,
    github_link: "https://github.com/lienkt/QA-Form-Generator-FE",
    live_link: "",
    title: "QA Form Generator",
    description: "QA Form GeneratorQA Form GeneratorQA Form Generator",
    tags: ["Flutter", "HTML", "CSS"],
  },
  {
    note: "Note: Learning project",
    img: "assets/img/issues_tracker.png",
    background_color: "yellow",
    readable: true,
    github_link: "https://github.com/lienkt/issues_tracker",
    live_link: "https://lienkt.github.io/issues_tracker/",
    title: "Issues Tracker",
    description:
      "A javascript app for creating, managing, and tracking issues with filtering and sorting.",
    tags: ["Javascript", "Tailwind"],
  },
  {
    note: "Note: Personal project",
    img: "assets/img/portfolio.png",
    background_color: "green",
    readable: false,
    github_link: "https://github.com/lienkt/porfolio_fe",
    live_link: "https://lienkim.info/",
    title: "Portfolio Website",
    description: "Personal Portfolio Website",
    tags: ["Javascript", "HTML5", "CSS"],
  },
  {
    note: "Note: Personal project",
    img: "assets/img/nhanliencollection.png",
    background_color: "orange",
    readable: false,
    github_link: "https://github.com/lienkt/nhanliencollection",
    live_link: "https://nhanliencollection.art/",
    title: "Nhan Lien Collection",
    description: "Image & video gallery",
    tags: ["Javascript", "HTML5", "CSS"],
  },
];

const projectsContainer = document.getElementById("projectsContainer");

projects.forEach((project) => {
  const item = document.createElement("div");
  item.className = "item " + project.background_color;

  const hasGithub = project.github_link?.trim();
  const hasLive = project.live_link?.trim();

  let buttonsHTML = "";
  if (hasGithub && hasLive) {
    buttonsHTML = `
      <div class="project-buttons two">
        <button onclick="window.open('${project.github_link}', '_blank')">GitHub</button>
        <button onclick="window.open('${project.live_link}', '_blank')">Live</button>
      </div>
    `;
  } else if (hasGithub || hasLive) {
    const link = hasGithub ? project.github_link : project.live_link;
    const text = hasGithub ? "GitHub" : "Live";
    buttonsHTML = `
      <div class="project-buttons one">
        <button onclick="window.open('${link}', '_blank')">${text}</button>
      </div>
    `;
  }

  item.innerHTML = `
    <p class="note">${project.note}</p>
    <img src="${project.img}" alt="${project.title}" class="image" />
    <h2 class="title">${project.title}</h2>
    <p class="description">${project.description}</p>
    <div class="tags">
      ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
    ${buttonsHTML}
  `;

  projectsContainer.appendChild(item);
});
