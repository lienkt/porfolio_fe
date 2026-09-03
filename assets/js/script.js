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
        <article class="company">
          ${
            company.logo
              ? `<img src="${company.logo}" alt="" />`
              : `<span class="company-logo-text" aria-hidden="true">${company.logoText}</span>`
          }
          <div>
            <h3>${company.name}</h3>
            <p>${company.detail}</p>
            <p class="company-period">${company.period}</p>
          </div>
        </article>
      </a>`,
  )
  .join("");

const experienceModal = document.getElementById("experienceModal");
const experienceTimeline = document.getElementById("experienceTimeline");
const openExperienceModal = document.getElementById("openExperienceModal");
const closeExperienceModal = document.getElementById("closeExperienceModal");

experienceTimeline.innerHTML = PORTFOLIO_CONTENT.experience.companies
  .map(
    (company) => `
      <article class="timeline-item">
        <div class="timeline-marker" aria-hidden="true"></div>
        <div class="timeline-card">
          <div class="timeline-heading">
            <div>
              <p class="timeline-period">${company.period}</p>
              <h3>${company.name}</h3>
            </div>
            <span class="timeline-location">${company.location}</span>
          </div>
          <p class="timeline-role">
            ${company.role}${company.employmentType ? ` · ${company.employmentType}` : ""}
          </p>
          <ul class="timeline-responsibilities">
            ${company.responsibilities.map((responsibility) => `<li>${responsibility}</li>`).join("")}
          </ul>
          <div class="timeline-technologies">
            ${company.technologies.map((technology) => `<span>${technology}</span>`).join("")}
          </div>
        </div>
      </article>`,
  )
  .join("");

openExperienceModal.addEventListener("click", () => {
  experienceModal.showModal();
  document.body.classList.add("modal-open");
});

function closeExperienceDetails() {
  experienceModal.close();
  document.body.classList.remove("modal-open");
}

closeExperienceModal.addEventListener("click", closeExperienceDetails);
experienceModal.addEventListener("click", (event) => {
  if (event.target === experienceModal) closeExperienceDetails();
});
experienceModal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});

const educationContainer = document.getElementById("educationContainer");
educationContainer.innerHTML = PORTFOLIO_CONTENT.experience.education
  .map(
    (education) => `
      <article class="education-item">
        <div class="education-topline">
          <h3>${education.school}</h3>
          <span>${education.location}</span>
        </div>
        <div class="education-details">
          <p>${education.degree}, Major: ${education.major}</p>
          <time>${education.period}</time>
        </div>
      </article>`,
  )
  .join("");

const container = document.getElementById("imageContainer");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const buttons = [nextBtn, backBtn];

container.innerHTML = PORTFOLIO_CONTENT.projects
  .map(
    (project) => `
      <button class="image-wrapper" type="button" data-project-id="${project.id}" aria-label="View ${project.title}">
        <img src="${project.img}" alt="${project.title} project preview" loading="lazy" />
      </button>`,
  )
  .join("");

function scrollByOneImage(dir) {
  const preview = container.querySelector(".image-wrapper");
  if (!preview) return;
  const step = preview.offsetWidth + 10;
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
  const item = document.createElement("article");
  item.className = `item ${project.background_color}`;
  item.id = project.id;

  const hasGithub = project.github_link?.trim();
  const hasLive = project.live_link?.trim();
  const projectLinks = [
    hasGithub && { href: project.github_link, label: "View code", className: "github" },
    hasLive && { href: project.live_link, label: "View live", className: "live" },
  ].filter(Boolean);
  const buttonsHTML = projectLinks.length
    ? `<div class="project-buttons ${projectLinks.length === 1 ? "one" : "two"}">
        ${projectLinks
          .map(
            (link) =>
              `<a class="project-link ${link.className}" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label} <span aria-hidden="true">↗</span></a>`,
          )
          .join("")}
      </div>`
    : "";

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

container.addEventListener("click", (event) => {
  const preview = event.target.closest("[data-project-id]");
  if (!preview) return;
  document
    .getElementById(preview.dataset.projectId)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
});
