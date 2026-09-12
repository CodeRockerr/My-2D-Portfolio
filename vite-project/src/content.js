// Keep claims, dates and URLs here. Do not substitute invented links or results.
export const profile = {
  name: "Adit Shah",
  siteUrl: "https://adit-2d-portfolio.vercel.app",
  email: "ashah45@ncsu.edu",
  personalEmail: "shahadit62@gmail.com",
  location: "Raleigh, North Carolina",
  github: "https://github.com/CodeRockerr",
  linkedin: "https://www.linkedin.com/in/shah-adit0404/",
  scholar: "https://scholar.google.com/citations?user=Opd4raEAAAAJ&hl=en",
  resume: "/documents/adit-shah-resume.pdf",
  aequitas: "https://aequitas-platform.vercel.app/",
};

export const experience = [
  {
    role: "Full-Stack Developer Intern",
    company: "Precision Sustainable Agriculture · NC State",
    dates: "Jun 2026 — Present",
    location: "Raleigh, NC",
    tags: ["React", "REST APIs", "Research data"],
    description:
      "Building tools that make agricultural research data useful to the people working with it.",
    highlights: [
      "Delivered an analytics platform exposing 15,000+ research records to 40+ users through seven REST endpoints.",
      "Introduced shared UI components and centralized theming; strengthened input validation.",
    ],
  },
  {
    role: "Founding AI Engineer Intern",
    company: "SilverKey Inc.",
    dates: "Jun — Aug 2026",
    location: "Remote",
    tags: ["PostgreSQL", "Data pipelines", "AI applications"],
    description:
      "Helped take a startup’s first data infrastructure and AI features into production.",
    highlights: [
      "Shipped a SkySlope API and PostgreSQL ingestion pipeline processing 2,500+ monthly records, with encrypted credential storage.",
      "Built transaction-risk models and a tenant-scoped natural-language-to-SQL service for 15+ beta agencies.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Mindlink Infotech",
    dates: "Dec 2024 — May 2025",
    location: "Ahmedabad, India",
    tags: ["JavaScript", "SAP HANA", "Business Central"],
    description:
      "Improved the speed and usability of everyday business workflows.",
    highlights: [
      "Reduced POS dashboard latency from 10 seconds to under two seconds.",
      "Delivered Business Central import and export modules to improve data handling.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "True Digital Solutions India",
    dates: "May — Jul 2024",
    location: "Hyderabad, India",
    tags: ["React", "Node.js", "IoT"],
    description:
      "Connected real-time device telemetry to a responsive web experience.",
    highlights: [
      "Built a React and Node.js application for processing and visualizing IoT telemetry.",
      "Scaled the client-server architecture to 130+ concurrent users with sub-second application latency.",
    ],
  },
];

export const projects = [
  {
    id: "coughsense",
    name: "CoughSense",
    category: "Embedded AI",
    number: "01",
    visual: "wave",
    badge: "Best Poster Award",
    tags: ["TinyML", "Arduino", "Edge Impulse", "CNN"],
    summary:
      "Cough detection that runs on a microcontroller. Audio stays on the device.",
    detail:
      "A team research prototype using Mel Filterbank Energy audio features and a convolutional neural network on the Arduino Nano 33 BLE Sense. Presented at NC State’s AI Student Symposium 2026.",
    role: "Team project with Darsh Rank and Pratham Patel.",
    points: [
      "Trained on cough and non-cough audio from the Coswara dataset.",
      "Explored augmentation, quantization and on-device deployment under microcontroller constraints.",
      "Received the Best Poster Award at the NC State AI symposium.",
    ],
    link: "/research/#coughsense",
    linkText: "Explore the research",
  },
  {
    id: "wolftrace",
    name: "WolfTrace",
    category: "AI applications",
    number: "02",
    visual: "graph",
    badge: "AI investigation",
    tags: ["Neo4j", "FastAPI", "Next.js", "RAG"],
    summary:
      "Making complex evidence easier to connect, investigate and understand.",
    detail:
      "A multi-agent investigation platform combining a Neo4j evidence graph, confidence scoring and video analysis.",
    role: "Led platform development and integrated video-forensics capabilities.",
    points: [
      "Modeled relationships between evidence in a graph database.",
      "Integrated TwelveLabs video analysis into the review workflow.",
    ],
  },
  {
    id: "wolfvest",
    name: "WolfVest",
    category: "AI applications",
    number: "03",
    visual: "flow",
    badge: "Financial onboarding",
    tags: ["LangGraph", "Snowflake", "FastAPI", "OCR"],
    summary:
      "A conversational financial onboarding workflow, from documents to validated information.",
    detail:
      "An AI onboarding application combining multi-step conversations, document parsing and structured data validation.",
    role: "Designed the conversational onboarding flow and automated document parsing.",
    points: [
      "Managed conversation state across multiple onboarding steps.",
      "Used OCR to extract information from financial forms.",
      "Validated extracted fields to reduce manual data entry.",
    ],
  },
  {
    id: "game-engine",
    name: "Building a C++ game engine",
    category: "C++ & systems",
    number: "04",
    visual: "engine",
    badge: "In progress · Fall 2026",
    tags: ["C++", "Game Engine Foundations", "Coursework"],
    summary:
      "Learning how engines work by developing an engine and games in C++.",
    detail:
      "Current coursework in Game Engine Foundations at NC State. The course involves developing a game engine and games in C++. This entry will grow with implementation notes, source code and playable builds as the semester progresses.",
    role: "Ongoing course project. Implementation details and demos will be added as they are completed.",
    points: [
      "Developing an engine and games in C++ as part of the course.",
      "Interested in the connection between systems design and interactive software.",
    ],
  },
  {
    id: "wattwatch",
    name: "WattWatch",
    category: "IoT & mobile",
    number: "05",
    visual: "energy",
    badge: "Undergraduate project",
    tags: ["ESP32", "Flutter", "Django", "MongoDB", "Machine Learning"],
    summary:
      "Live energy and water tracking, with practical tools for building sustainable habits.",
    detail:
      "A full-stack IoT mobile application connecting ESP32 sensor telemetry to a Flutter interface and a Django/MongoDB backend for energy and water tracking.",
    role: "Developed the mobile application and backend, connected sensor telemetry, and trained the billing model.",
    points: [
      "Trained an ML model that achieved 94% billing accuracy on live sensor telemetry.",
      "Added interactive flashcards, quizzes and facts to encourage sustainable habits.",
    ],
  },
  {
    id: "stockx",
    name: "StockX",
    category: "Data & quantitative",
    number: "06",
    visual: "market",
    badge: "Undergraduate project",
    tags: [
      "Python",
      "ARIMA / SARIMAX",
      "NLP",
      "yFinance",
      "Selenium",
      "BeautifulSoup",
      "Power BI",
      "Tkinter",
    ],
    summary:
      "Stock analysis combining live financial data, time-series forecasting and news sentiment.",
    detail:
      "A real-time stock-analysis application with RESTful APIs for scraping and processing financial data, time-series models for forecasting, and NLP for news sentiment.",
    role: "Built the data ingestion APIs and integrated forecasting and sentiment analysis into the stock-analysis workflow.",
    points: [
      "Processed 500+ financial data points per minute through web-scraping and RESTful APIs.",
      "Applied ARIMA and SARIMAX models alongside sentiment analysis of live news articles.",
      "Achieved 85%+ stock-price forecasting accuracy in this project.",
    ],
  },
  {
    id: "recipeai",
    name: "RecipeAI",
    category: "AI applications",
    number: "07",
    visual: "recipe",
    badge: "Undergraduate project",
    tags: ["Python", "Computer Vision", "Next.js", "Spoonacular API", "CNN"],
    summary:
      "From a food photo to ingredient insights, nutritional information and recipe ideas.",
    detail:
      "A full-stack AI application that analyzes user-uploaded food images to predict food items, ingredients and nutritional information, then generates recipes through the Spoonacular API.",
    role: "Developed the image-analysis workflow and integrated recipe generation into the application.",
    points: [
      "Used computer vision and CNN-based image analysis for food recognition.",
      "Connected the Spoonacular API for comprehensive, real-time recipe generation.",
    ],
  },
];

export const awards = [
  {
    id: "coughsense",
    title: "Best Poster Award",
    event: "AI Student Symposium 2026",
    institution: "North Carolina State University",
    project: "CoughSense",
    year: "2026",
    image: "/art/coughsense-poster.webp",
    imageAlt:
      "CoughSense research poster presented at NC State’s AI Student Symposium 2026",
    imageWidth: 1900,
    imageHeight: 1426,
    headline: "Small device. Meaningful possibilities.",
    category: "ON-DEVICE AI · AWARD-WINNING RESEARCH",
    description:
      "CoughSense explores privacy-preserving cough detection on an Arduino microcontroller. Our team presented it at NC State’s AI Student Symposium 2026 and received the Best Poster Award.",
    note: "With Darsh Rank and Pratham Patel · CSC 542",
    href: "/research/#coughsense",
    linkText: "Research & publications",
    imageHref: "/documents/coughsense-poster.pdf",
  },
  {
    id: "wolftrace",
    title: "2nd Place",
    event: "HackNCState 2026",
    institution: "North Carolina State University",
    project: "WolfTrace",
    year: "2026",
    image: "/art/hackncstate-2026.png",
    imageAlt: "Official HackNCState 2026 detective-wolf logo",
    imageWidth: 500,
    imageHeight: 500,
    headline: "Connect the evidence. Find the story.",
    category: "AI INVESTIGATION · HACKNCSTATE 2026",
    description:
      "Our team earned 2nd Place at HackNCState 2026 with WolfTrace, an AI investigation platform that connects evidence through a Neo4j knowledge graph, confidence scoring and video analysis.",
    note: "Built at North Carolina State University",
    href: "/#projects",
    linkText: "Explore WolfTrace",
    eventUrl: "https://hackncstate2026.devpost.com/",
  },
  {
    id: "wolfvest",
    title: "Best Use of Snowflake API",
    event: "HackNC 2025",
    institution: "University of North Carolina at Chapel Hill",
    project: "WolfVest",
    year: "2025",
    image: "/art/hacknc-2025.png",
    imageAlt: "Official HackNC 2025 ram and game-console mascot",
    imageWidth: 1188,
    imageHeight: 1126,
    headline: "A conversation. A clearer financial start.",
    category: "FINANCIAL ONBOARDING · HACKNC 2025",
    description:
      "WolfVest won Best Use of Snowflake API at HackNC 2025. Our team combined conversational AI, document parsing and structured validation to make financial onboarding easier to navigate.",
    note: "Built at UNC Chapel Hill",
    href: "/#projects",
    linkText: "Explore WolfVest",
    eventUrl: "https://hacknc-2025.devpost.com/",
  },
];

export const publications = [
  {
    title:
      "Advanced Driver Assistance System (ADAS) and Machine Learning (ML): The dynamic duo revolutionizing the automotive industry",
    venue: "Virtual Reality & Intelligent Hardware",
    year: "2025",
  },
  {
    title:
      "Innovation in Agro-trade: Driving Forces Behind India’s Export and Import Growth",
    venue: "Intelligent Strategies for ICT · Springer",
    year: "2025",
  },
];

export const pages = {
  overview: {
    title: "Portfolio overview — Adit Shah",
    description:
      "A readable overview of Adit Shah’s software projects, experience, research and contact information.",
    path: "/overview/",
  },
  home: {
    title: "Adit’s World — Adit Shah | Software Engineer",
    description:
      "Explore Adit Shah’s playable 2D portfolio: software engineering, quantitative research, AI and C++ projects. MS Computer Science at NC State, graduating May 2027.",
    path: "/",
  },
  aequitas: {
    title: "AEQUITAS — Adit Shah",
    description:
      "A real-time quantitative research platform bringing market data, financial models and AI-assisted research into one workspace.",
    path: "/aequitas/",
  },
  research: {
    title: "Research & Recognition — Adit Shah",
    description:
      "CoughSense research, the NC State Best Poster Award, CppCon presentations and publications by Adit Shah.",
    path: "/research/",
  },
  achievements: {
    title: "Achievements — Adit Shah",
    description:
      "2nd Place at HackNCState 2026 for WolfTrace, Best Use of Snowflake API at HackNC 2025 for WolfVest, and the CoughSense Best Poster Award.",
    path: "/achievements/",
  },
  contact: {
    title: "Contact Adit Shah — Software Engineering, AI & Quant",
    description:
      "Connect with Adit Shah by email or LinkedIn about new-grad opportunities, projects and collaboration. NC State MS Computer Science, May 2027.",
    path: "/contact/",
  },
  feedback: {
    title: "Feedback & Suggestions — Adit Shah",
    description:
      "Share a private suggestion, report an issue or start a collaboration with Adit Shah.",
    path: "/feedback/",
  },
  privacy: {
    title: "Privacy — Adit Shah",
    description: "How optional portfolio analytics and private feedback work.",
    path: "/privacy/",
  },
  cppcon: {
    title: "CppCon 2026 — Adit Shah",
    description:
      "Connect with Adit Shah at CppCon 2026 and explore his software projects, research and C++ coursework.",
    path: "/cppcon/",
  },
  404: {
    title: "Page not found — Adit Shah",
    description: "Find your way back to Adit Shah’s portfolio.",
    path: "/404.html",
  },
};
