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
      <a class="project-link github" href="${project.github_link}" target="_blank" rel="noopener noreferrer">View code <span aria-hidden="true">↗</span></a>
      <a class="project-link live" href="${project.live_link}" target="_blank" rel="noopener noreferrer">View live <span aria-hidden="true">↗</span></a>
    </div>`;
  } else if (hasGithub || hasLive) {
    const link = hasGithub ? project.github_link : project.live_link;
    const text = hasGithub ? "View code" : "View live";
    const className = hasGithub ? "github" : "live";
    buttonsHTML = `<div class="project-buttons one">
      <a class="project-link ${className}" href="${link}" target="_blank" rel="noopener noreferrer">${text} <span aria-hidden="true">↗</span></a>
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
