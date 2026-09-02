// Edit this file to update the portfolio's important text content.
// HTML is supported in fields such as `intro`, `about`, and project descriptions.
const PORTFOLIO_CONTENT = {
  site: {
    pageTitle: "Lien KIM - Software Developer",
    name: "Lien KIM",
    role: "Hello, I am Liên.<br><span>GenAI Developer | Software Developer.</span>",
  },
  navigation: {
    cv: "CV",
    linkedin: "LinkedIn",
    projects: "Projects",
    github: "Github",
    contact: "Contact",
  },
  hero: {
    intro:
      "I'm a Software Engineer with 5+ years of Front-End experience, passionate about building great user experiences and exploring what’s possible with Generative AI. I combine my experience in React, TypeScript, and modern web development with LLMs, RAG, and AI agents to build practical, intelligent, and user-focused products.",
    primaryButton: "Book a call with me",
    secondaryButton: "Read my projects",
  },
  experience: {
    title: "Techniques and companies I have worked with in development",
    technologies: [
      "React",
      "Node.js",
      "Flutter",
      "Vue",
      "WordPress",
      "Java",
      "CakePHP",
    ],
    companies: [
      "Sqwad - Paris",
      "Hello Pomelo - Paris",
      "FPT - HCM",
      "Axon Active - HCM",
      "IVC - HCM",
    ],
  },
  projectsHeading: "My projects",
  projects: [
    {
      id: "project-0",
      note: "Note: Learning project",
      img: "assets/img/react_quiz_app.png",
      background_color: "yellow",
      github_link: "https://github.com/lienkt/react-quiz-app",
      live_link: "https://lienkt-react-quiz-app.netlify.app/",
      title: "React Quiz App",
      description: `<p>An interactive quiz application that dynamically generates questions, tracks user progress, and displays final scores and rankings. Features include:</p><ul><li>Configurable quiz settings including category, difficulty, question type, and number of questions.</li><li>Real-time question flow with score calculation and automatic navigation between questions.</li><li>Leaderboard functionality with ranking display and CSV export.</li><li>User-friendly interfaces built with <strong>React, TypeScript, and MUI</strong>, ensuring scalability and maintainability.</li><li>Applied <strong>Redux Toolkit</strong> for global state management.</li></ul>`,
      tags: ["Javascript", "HTML5", "CSS", "Tailwind"],
    },
    {
      id: "project-1",
      note: "Note: Learning project",
      img: "assets/img/issues_tracker.png",
      background_color: "orange",
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
      github_link: "https://github.com/lienkt/porfolio_fe",
      live_link: "https://lienkim.info/",
      title: "Portfolio Website",
      description:
        "A web application fully developed using HTML5, CSS3, and JavaScript, showcasing my ability to build responsive websites with a modern, user-friendly interface that performs smoothly across all devices.",
      tags: ["Javascript", "HTML5", "CSS"],
    },
    {
      id: "project-3",
      note: "Note: Built at Sqwad",
      img: "assets/img/sqwad_dashboard.png",
      background_color: "pink",
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
      github_link: "https://github.com/lienkt/QA-Form-Generator-FE",
      live_link: "",
      title: "QA Form Generator",
      description:
        "This is an application that collects a client's requirements and questions and sends them to sellers before an order is created. After the client enters their requirements and questions, a PDF file is generated and automatically sent to the client and seller.",
      tags: ["Flutter", "HTML", "CSS"],
    },
  ],
  about: {
    title: "About",
    body: `My journey in software development began in 2016 as a Software Engineer at IVC, where I worked with <strong>Odoo, Python, and SQL</strong> to build custom ERP features and data-driven reports. This early experience gave me exposure to both frontend and backend development and established a strong foundation in software engineering.<br><br>I later joined <strong>Axon Active</strong>, where I worked on internal products across marketing, HR, and operations using technologies including <strong>React, Java Spring, and PostgreSQL</strong>. Beyond implementing features, I collaborated closely with different teams to understand their needs and build tools that improved internal workflows.<br><br>At <strong>FPT Software</strong>, I contributed to a real-time communication application built with <strong>React, Node.js, and a microservices architecture</strong>. Working in a large international environment strengthened my experience with scalable applications, testing, and collaborative software development.<br><br>In 2020, I moved to <strong>Paris, France</strong>, to pursue a <strong>Master of Science in Computer Science at EPITA</strong>. During my time in France, my work became increasingly focused on Front-End and product development. At <strong>Hello Pomelo</strong>, I worked across the application stack to build a solution for collecting client requirements, generating automated PDF reports, and integrating backend workflows. Later, at <strong>Sqwad</strong>, I focused primarily on Front-End development for Shopify-based applications while also contributing to backend APIs with Django.<br><br>These experiences shaped the way I approach software today: I care not only about how a system works, but also about <strong>how people interact with it, how maintainable it is, and whether it solves a real problem</strong>.<br><br>In <strong>May 2026</strong>, I began a new chapter in Brussels by joining <strong>BeCode's AI & Data Science training program</strong>, where I've been expanding my software engineering background into <strong>Python, data science, machine learning, and AI</strong>. This naturally led me toward <strong>Generative AI</strong>, where I'm particularly interested in <strong>Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), AI agents, and AI-powered applications</strong>.<br><br>Today, my focus is on bringing these two sides of my experience together: a strong foundation in <strong>Software Engineering and Front-End development</strong>, combined with modern <strong>Generative AI technologies</strong>.<br><br>I'm especially interested in building AI products that go beyond experiments — applications that are <strong>practical, scalable, intuitive, and genuinely useful to people</strong>.`,
  },
  footer: {
    callToAction: "Let’s collaborate and create something great!",
    emailLabel: "Email me",
    copyright: "© 2025 Lien KIM. All Rights Reserved.",
  },
};
