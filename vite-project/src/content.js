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
  {
    role: "Data Analytics Intern",
    company: "Mindlink Infotech Pvt Ltd",
    dates: "Dec 2023 — Jan 2024",
    location: "Ahmedabad, India",
    tags: ["Power BI", "DAX", "Data analytics"],
    description:
      "Built interactive dashboards to improve reporting and accelerate decision-making.",
    highlights: [
      "Designed and deployed interactive Power BI dashboards for various projects using DAX queries.",
      "Improved reporting accuracy by 25% and reduced query latency from four seconds to 1.5 seconds, accelerating decision-making by 50%.",
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
    link: "https://github.com/darshrank/NNDL.33",
    linkText: "View CoughSense on GitHub",
    secondaryLink: {
      href: "/research/#coughsense",
      label: "Explore the research",
    },
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
    link: "https://github.com/samarthdshah/WolfTrace-ui",
    linkText: "View WolfTrace on GitHub",
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
    link: "https://github.com/samarthdshah/Wolfvest",
    linkText: "View WolfVest on GitHub",
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
    link: "https://github.com/shaharsh624/WattWatch",
    linkText: "View WattWatch on GitHub",
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
    link: "https://github.com/StockX-Python-Project/StockX",
    linkText: "View StockX on GitHub",
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
    link: "https://github.com/vandeet0704/recipe-ai",
    linkText: "View RecipeAI on GitHub",
  },
  {
    id: "pocket-rivals",
    name: "Pocket Rivals",
    category: "Games & interaction",
    number: "08",
    visual: "duel",
    badge: "Multiplayer icebreaker",
    tags: ["Node.js", "Express", "Socket.IO", "Gemini", "Web Audio API"],
    summary:
      "A two-player phone game that turns everyday objects, sketches and battle cries into a conversation-starting duel.",
    detail:
      "Players join a shared room by QR code, photograph something they carry, draw a weapon and record a battle cry. Gemini forges personalized gear and supplies icebreaker questions, while the server applies the combat rules and synchronizes both screens.",
    roleLabel: "Team project",
    role: "Built as an in-person multiplayer icebreaker. The repository is currently private; contact me for more about the project.",
    points: [
      "Three creative rounds combine photo, drawing and voice input with personalized equipment and commentary.",
      "Gemini interprets moves and scores creativity; deterministic server rules calculate combat outcomes.",
      "Socket.IO keeps the players in sync, with reconnect support and mock AI when the model is unavailable.",
      "Music and effects are synthesized in the browser through the Web Audio API.",
    ],
  },
  {
    id: "mayday-mayor",
    name: "Mayday Mayor",
    category: "Games & interaction",
    number: "09",
    visual: "city",
    badge: "Civic planning game",
    tags: [
      "TypeScript",
      "React",
      "MapLibre GL",
      "Fastify",
      "TimescaleDB",
      "Solana",
    ],
    summary:
      "A multiplayer disaster-planning game that turns decisions on real city maps into useful input for city planners.",
    detail:
      "Players allocate a budget to shelters, evacuation pickups and road protection, then see how their plan holds up through a simulated disaster. A planner view brings the resulting decisions together to reveal consensus, blind spots and local knowledge.",
    roleLabel: "Team project",
    role: "Built in 24 hours with Aum Pandya, Darsh Rank and Sakhi Patel.",
    points: [
      "Uses real city, population, flood-zone, road and transit data to ground the planning simulation.",
      "Shares a TypeScript simulation engine between browser and server, with multiplayer rooms over WebSockets.",
      "Aggregates plays and live environmental readings in TimescaleDB for leaderboards and the planner view.",
      "Records play decisions on Solana devnet, with verifiable civic records and non-transferable civic cards.",
    ],
    link: "https://github.com/darshrank/ready-raleigh",
    linkText: "View Mayday Mayor on GitHub",
  },
  {
    id: "avatar",
    name: "AVATAR",
    category: "AI applications",
    number: "10",
    visual: "avatar",
    badge: "Conversational workflows",
    tags: [
      "TypeScript",
      "LangGraph",
      "Next.js",
      "Snowflake",
      "TimescaleDB",
      "FastAPI",
    ],
    summary:
      "An iMessage assistant that finds who owns a workplace request, learns from redirects and coordinates approvals.",
    detail:
      "AVATAR breaks requests into steps and routes each one to its owner. Replies update the organization map, while a live dashboard shows request paths and bottlenecks. Snowflake provides organizational data with role-based access and masking policies.",
    roleLabel: "Team project",
    role: "A team prototype built around a simulated company, with sandbox and devnet payment integrations.",
    points: [
      "Runs resumable LangGraph request threads with specialized agents for tasks, approvals and other workflow steps.",
      "Uses Snowflake roles and masking policies to control access to staff, budgets, policies and request history.",
      "Streams changes to a Next.js dashboard and records agent events in TimescaleDB.",
      "A FastAPI service replays past requests to propose routing rules; an administrator approves rules before use.",
    ],
    link: "https://github.com/samarthdshah/HackNC26",
    linkText: "View AVATAR on GitHub",
  },
];

export const cppconPoster = {
  title:
    "Accelerating Quantitative Feature Engineering — A C++20/pybind11 Extension for a Python-Based Trading Research Platform",
  pdf: "/documents/cppcon-2026-poster.pdf",
  downloadName: "Adit-Shah-CppCon-2026-Poster.pdf",
  image: "/art/cppcon-2026-poster.webp",
  imageWidth: 2000,
  imageHeight: 1500,
};

export const awards = [
  {
    id: "cppcon-2026",
    title: "Poster Presentation",
    event: "CppCon 2026",
    institution: "AEQUITAS · Quantitative research",
    project: "AEQUITAS",
    year: "2026",
    stamp: ["CPPCON", "POSTER"],
    image: cppconPoster.image,
    imageAlt:
      "AEQUITAS CppCon 2026 poster showing the C++20/pybind11 pipeline, kernel benchmarks and concurrency results",
    imageWidth: cppconPoster.imageWidth,
    imageHeight: cppconPoster.imageHeight,
    imageHref: cppconPoster.pdf,
    headline: "Python research. C++ performance.",
    category: "C++ SYSTEMS · CPPCON 2026",
    description:
      "Presented AEQUITAS at CppCon 2026: accelerating quantitative feature engineering with a C++20/pybind11 extension. The poster covers seven kernels computing 19 features, zero-copy NumPy buffers, explicit GIL release and numerical checks against pandas.",
    note: cppconPoster.title,
    href: "/aequitas/#cppcon",
    linkText: "Explore AEQUITAS",
    poster: cppconPoster,
  },
  {
    id: "pocket-rivals",
    title: "HackDay Winner",
    event: "Hack_NCState 9/26 HackDay",
    institution: "North Carolina State University",
    project: "Pocket Rivals",
    year: "2026",
    stamp: ["HACKDAY", "WINNER"],
    headline: "Two strangers. One legendary duel.",
    category: "MULTIPLAYER + AI · HACK_NCSTATE HACKDAY",
    description:
      "Won the Hack_NCState September 26 HackDay with Pocket Rivals, a two-player phone game that turns photos, sketches and battle cries into Gemini-generated gear. Conversation prompts break the ice, while server-controlled combat keeps both players’ results in sync.",
    note: "Node.js · Express · Socket.IO · Gemini · Repository currently private",
    artCaption: "Photo · Sketch · Battle cry",
    href: `mailto:${profile.email}?subject=Pocket%20Rivals`,
    linkText: "Ask about Pocket Rivals",
  },
  {
    id: "mayday-mayor",
    title: "3rd Place & Best Use of Solana",
    event: "WolfHacks 2026",
    institution: "Mayday Mayor · Disaster planning",
    project: "Mayday Mayor",
    year: "2026",
    stamp: ["3RD", "PLACE"],
    image: "/art/mayday-mayor.webp",
    imageAlt:
      "Mayday Mayor prototype showing a 3D Raleigh map with shelter, bus pickup and road protection planning controls",
    imageWidth: 1440,
    imageHeight: 900,
    headline: "Play the mayor. Plan for the storm.",
    category: "CIVIC TECHNOLOGY · WOLFHACKS 2026",
    description:
      "Our team won 3rd Place and Best Use of Solana with Mayday Mayor, a multiplayer disaster-planning game built on real city data. Players plan shelters, evacuation pickups and road protection; their decisions inform a planner view and are recorded on Solana devnet.",
    note: "With Aum Pandya, Darsh Rank and Sakhi Patel · Built in 24 hours",
    href: "https://github.com/darshrank/ready-raleigh",
    linkText: "View Mayday Mayor on GitHub",
  },
  {
    id: "avatar",
    title: "Best Use of Snowflake API",
    event: "HackNC 2026",
    institution: "AVATAR · Conversational workflows",
    project: "AVATAR",
    year: "2026",
    stamp: ["SNOWFLAKE", "API"],
    image: "/art/avatar-logo.webp",
    imageAlt: "AVATAR project logo: a blue flame-shaped character",
    imageWidth: 512,
    imageHeight: 512,
    headline: "Text a request. Find its owner.",
    category: "AI APPLICATIONS · HACKNC 2026",
    description:
      "AVATAR won Best Use of Snowflake API at HackNC 2026. It routes workplace requests through iMessage, learns from redirects and coordinates approvals. Snowflake supplies organizational data with role-based access and masking policies in a simulated company.",
    note: "Team hackathon prototype · Simulated company data",
    href: "https://github.com/samarthdshah/HackNC26",
    linkText: "View AVATAR on GitHub",
  },
  {
    id: "coughsense",
    stamp: ["BEST", "POSTER"],
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
    stamp: ["2ND", "PLACE"],
    projectId: "wolftrace",
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
    stamp: ["SNOWFLAKE", "API"],
    projectId: "wolfvest",
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
      "Adit Shah’s CppCon 2026 poster, Pocket Rivals HackDay win, Mayday Mayor WolfHacks prizes, AVATAR Snowflake award and earlier research and hackathon recognition.",
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
      "Read Adit Shah’s CppCon 2026 poster on accelerating AEQUITAS quantitative feature engineering with C++20 and pybind11, and download the full PDF.",
    path: "/cppcon/",
  },
  404: {
    title: "Page not found — Adit Shah",
    description: "Find your way back to Adit Shah’s portfolio.",
    path: "/404.html",
  },
};
