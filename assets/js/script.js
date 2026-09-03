function getContent(path) {
  return path.split(".").reduce((value, key) => value?.[key], PORTFOLIO_CONTENT);
}

document.querySelectorAll("[data-content]").forEach((element) => {
  const value = getContent(element.dataset.content);
  if (value !== undefined) element.innerHTML = value;
});

const skillGroupsContainer = document.getElementById("skillGroupsContainer");
skillGroupsContainer.innerHTML = PORTFOLIO_CONTENT.experience.skillGroups
  .map(
    (group) => `
      <article class="skill-group">
        <div class="skill-group-title">
          <span class="skill-icon" aria-hidden="true">${group.icon}</span>
          <h3>${group.title}</h3>
        </div>
        <div class="skill-tags">
          ${group.items.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </article>`,
  )
  .join("");

const companiesContainer = document.getElementById("companiesContainer");
companiesContainer.innerHTML = PORTFOLIO_CONTENT.experience.companies
  .map(
    (company) => `
      <a href="${company.link}" target="_blank" rel="noopener noreferrer">
        <article class="company ${company.className}">
          ${
            company.logo
              ? `<img src="${company.logo}" alt="" />`
              : `<span class="company-logo-text" aria-hidden="true">${company.logoText}</span>`
          }
          <div>
            <h3>${company.name}</h3>
            <p>${company.detail}</p>
          </div>
        </article>
      </a>`,
  )
  .join("");

const container = document.getElementById("imageContainer");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const buttons = [nextBtn, backBtn];

function scrollByOneImage(dir) {
  const img = container.querySelector("img");
  if (!img) return;
  const step = img.offsetWidth + 10;
  container.scrollLeft += dir === "next" ? step : -step;
  updateLayout();
}

function updateLayout() {
  const needsScroll = container.scrollWidth > container.clientWidth;
  container.style.justifyContent = needsScroll ? "flex-start" : "center";
  buttons.forEach((btn) => (btn.style.display = needsScroll ? "flex" : "none"));
}

nextBtn.addEventListener("click", () => scrollByOneImage("next"));
backBtn.addEventListener("click", () => scrollByOneImage("back"));
window.addEventListener("load", updateLayout);
window.addEventListener("resize", updateLayout);

const projectsContainer = document.getElementById("projectsContainer");

PORTFOLIO_CONTENT.projects.forEach((project) => {
  const item = document.createElement("div");
  item.className = `item ${project.background_color}`;
  item.id = project.id;

  const hasGithub = project.github_link?.trim();
  const hasLive = project.live_link?.trim();
  let buttonsHTML = "";

  if (hasGithub && hasLive) {
    buttonsHTML = `<div class="project-buttons two">
      <button onclick="window.open('${project.github_link}', '_blank')">GitHub</button>
      <button onclick="window.open('${project.live_link}', '_blank')">Live</button>
    </div>`;
  } else if (hasGithub || hasLive) {
    const link = hasGithub ? project.github_link : project.live_link;
    const text = hasGithub ? "GitHub" : "Live";
    buttonsHTML = `<div class="project-buttons one">
      <button onclick="window.open('${link}', '_blank')">${text}</button>
    </div>`;
  }

  item.innerHTML = `
    <p class="note">${project.note}</p>
    <img src="${project.img}" alt="${project.title}" class="image" />
    <h2 class="title">${project.title}</h2>
    <div class="description">${project.description}</div>
    <div class="tags">
      ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
    ${buttonsHTML}`;

  projectsContainer.appendChild(item);
});

document.querySelectorAll(".image-wrapper").forEach((wrapper, index) => {
  wrapper.style.cursor = "pointer";
  wrapper.addEventListener("click", () => {
    const projectElement = document.getElementById(`project-${index}`);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});
