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
    id: "project-0",
    note: "Note: Learning project",
    img: "assets/img/react_quiz_app.png",
    background_color: "yellow",
    readable: false,
    github_link: "https://github.com/lienkt/react-quiz-app",
    live_link: "https://lienkt-react-quiz-app.netlify.app/",
    title: "React Quiz App",
    description: `
  <div>
    <p>
      An interactive quiz application that dynamically generates questions,
      tracks user progress, and displays final scores and rankings. Features include:
    </p>

    <ul>
      <li>
        Configurable quiz settings including category, difficulty, question type,
        and number of questions.
      </li>
      <li>
        Real-time question flow with score calculation and automatic navigation
        between questions.
      </li>
      <li>
        Leaderboard functionality with ranking display and CSV export.
      </li>
      <li>
        User-friendly interfaces built with
        <strong>React, TypeScript, and MUI</strong>,
        ensuring scalability and maintainability.
      </li>
      <li>
        Applied <strong>Redux Toolkit</strong> for global state management.
      </li>
    </ul>
  </div>
`,
    tags: ["Javascript", "HTML5", "CSS", "Tailwind"],
  },
  {
    id: "project-1",
    note: "Note: Learning project",
    img: "assets/img/issues_tracker.png",
    background_color: "orange",
    readable: true,
    github_link: "https://github.com/lienkt/issues_tracker",
    live_link: "https://lienkt.github.io/issues_tracker/",
    title: "Issues Tracker",
    description:
      "A javascript app for creating, managing, and tracking issues with filtering and sorting. This application utilizes both fundamental and advanced JavaScript techniques along with Tailwind CSS to address some of the most common challenges in JavaScript development. It demonstrates my ability to create efficient, maintainable, and responsive solutions while applying best practices in modern web development.",
    tags: ["Javascript", "Tailwind"],
  },
  {
    id: "project-2",
    note: "Note: Personal project",
    img: "assets/img/portfolio.png",
    background_color: "green",
    readable: false,
    github_link: "https://github.com/lienkt/porfolio_fe",
    live_link: "https://lienkim.info/",
    title: "Portfolio Website",
    description:
      "A web application fully developed using HTML5, CSS3, and JavaScript, showcasing my ability to build responsive websites with a modern, user-friendly interface that performs smoothly across all devices.",
    tags: ["Javascript", "HTML5", "CSS"],
  },
  {
    id: "project-3",
    note: "Note: Buit at Sqwad",
    img: "assets/img/sqwad_dashboard.png",
    background_color: "pink",
    readable: false,
    github_link: "",
    live_link: "",
    title: "Sqwad Dashboard",
    description:
      "Sqwad Dashboard helps retail brands collaborate and reduce customer acquisition costs. This application was developed entirely by me using React, TypeScript, and Tailwind CSS. I took full responsibility for the frontend development from scratch and maintained it throughout a year for Sqwad, demonstrating my ability to deliver scalable, maintainable, and high-quality web solutions independently.",
    tags: ["React", "Redux", "Typescript", "Tailwind", "HTML", "CSS"],
  },
  {
    id: "project-4",
    note: "Note: Personal project",
    img: "https://raw.githubusercontent.com/lienkt/QA-Form-Generator-FE/main/project.png",
    background_color: "blue",
    readable: true,
    github_link: "https://github.com/lienkt/QA-Form-Generator-FE",
    live_link: "",
    title: "QA Form Generator",
    description:
      "This is a application to get requirements and questions of a client and send them to sellers before creating an order. After the client input their requirements and questions, a pdf file will be generated and sent automatically to the client and the saler.",
    tags: ["Flutter", "HTML", "CSS"],
  },
  // {
  //   note: "Note: Personal project",
  //   img: "assets/img/nhanliencollection.png",
  //   background_color: "orange",
  //   readable: false,
  //   github_link: "https://github.com/lienkt/nhanliencollection",
  //   live_link: "https://nhanliencollection.art/",
  //   title: "Media Sharing Web Application",
  //   description:
  //     "I developed this application to share high-quality images directly from Google Drive. Viewers can browse images and videos arranged in a custom web layout, and click on a file to view it directly on Google Drive or download it.",
  //   tags: ["Javascript", "HTML5", "CSS", "Tailwind"],
  // },
];

const projectsContainer = document.getElementById("projectsContainer");

projects.forEach((project) => {
  const item = document.createElement("div");
  item.className = "item " + project.background_color;
  item.id = project.id; // Add ID to project item

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
    <div class="description">${project.description}</div>
    <div class="tags">
      ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
    ${buttonsHTML}
  `;

  projectsContainer.appendChild(item);
});

// Add click handlers to image wrappers to scroll to corresponding project
const imageWrappers = document.querySelectorAll(".image-wrapper");
imageWrappers.forEach((wrapper, index) => {
  wrapper.style.cursor = "pointer";
  wrapper.addEventListener("click", () => {
    const projectElement = document.getElementById(`project-${index}`);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});
