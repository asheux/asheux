import { Main, Crawler } from "wasm-asheux";
import "./styles.css";
import portrait from "./images/asheux.jpg";
import spiderImage from "./images/spider.png";
import hljs from "highlight.js/lib/common";
import cv from "./pdfs/cv.pdf";
import lightIcon from "./images/lighttheme.svg";
import darkIcon from "./images/darktheme.svg";
import networkImg from "./images/networksystem.png";
import nksImg from "./images/nksc2c.png";
import beaverImg from "./images/bbeaver.png";
import crawlImg from "./images/crawl.png";
import algorithmImg from "./images/algorithm.png";
import mazeImg from "./images/mazescape.png";
import crittersImg from "./images/clitter_world.png";
import forestImg from "./images/forest.png";
import killshotImg from "./images/killshot.png";
import flaskieImg from "./images/flaskie.png";
import delocaImg from "./images/deloca.png";

const importCache = {};
const wasmMain = new Main();
const crawler = new Crawler();
const STORAGE_KEY = "asheux-custom-articles";
const HERO_NAME = wasmMain.get_name() || "Brian Ashiundu";

const state = {
  articles: [],
  customArticles: loadCustomArticles(),
  filter: "all",
  theme: loadTheme(),
  crawling: false,
  crawlResults: [],
  crawlStats: null,
  crawlErrors: [],
  selectedArticle: null,
};

const projectShowcase = [
  {
    title: "Network Systems Paclet",
    blurb:
      "Visualizing rule-driven network evolution for Wolfram Institute. Built to explore complex, emergent graph behavior.",
    link: "https://resources.wolframcloud.com/PacletRepository/resources/WolframInstitute/NetworkSystem/",
    image: networkImg,
    tags: ["Wolfram Language", "Complex Systems"],
  },
  {
    title: "NKS Click to Copy",
    blurb:
      "Modernized code behind Stephen Wolfram’s A New Kind of Science figures, focused on repeatable student contributions.",
    link: "https://nksclicktocopy.com/",
    image: nksImg,
    tags: ["Wolfram", "Education"],
  },
  {
    title: "Adaptive Evolution for Turing Machines",
    blurb:
      "Exploring long-living Turing machines via evolutionary search and rule mutations to stretch the Busy Beaver frontier.",
    link: "https://community.wolfram.com/groups/-/m/t/3209199",
    image: beaverImg,
    tags: ["Computation", "Evolutionary Search"],
  },
  {
    title: "Project Crawl",
    blurb:
      "Rust + WebAssembly crawler that collects domain links at speed. Built as a portable lab for quick recon.",
    link: "#lab",
    image: crawlImg,
    tags: ["Rust", "WebAssembly"],
  },
  {
    title: "Pyalgorithms",
    blurb:
      "A living notebook of combinatorics, cryptography, and Advent of Code solutions in pure Python.",
    link: "https://github.com/asheux/pyalgorithms",
    image: algorithmImg,
    tags: ["Algorithms", "Python"],
  },
  {
    title: "Maze Escape",
    blurb:
      "Classic maze solver powered by breadth-first and depth-first search—visualizing traversal decisions live.",
    link: "https://github.com/asheux/maze-solver",
    image: mazeImg,
    tags: ["AI Search"],
  },
  {
    title: "Critters World Simulation",
    blurb:
      "A playful survival simulation of furry aliens—fitness and randomness collide in a sandbox ecosystem.",
    link: "https://github.com/asheux/bce",
    image: crittersImg,
    tags: ["Simulation"],
  },
  {
    title: "Interactive Forest Drawer",
    blurb:
      "Turtle-graphics playground to sketch procedural forests and explore lightweight generative art.",
    link: "https://github.com/asheux/forest-drawer",
    image: forestImg,
    tags: ["Generative Art"],
  },
  {
    title: "The Kill Shot",
    blurb:
      "Single-player tactics experiment: find the unpredictable shot to outsmart a crafty target.",
    link: "https://github.com/asheux/chezz",
    image: killshotImg,
    tags: ["Game Mechanics"],
  },
  {
    title: "Flaskie",
    blurb:
      "RESTful auth service with role-based permissions, built on Flask + Flask-RESTPlus for quick experiments.",
    link: "https://github.com/asheux/flaskie",
    image: flaskieImg,
    tags: ["APIs"],
  },
  {
    title: "DeLoca",
    blurb:
      "Heuristic-powered vehicle routing inspired by TSP—optimize delivery runs while keeping deadlines intact.",
    link: "https://github.com/asheux/deloca",
    image: delocaImg,
    tags: ["Optimization"],
  },
];

const researchInterests = [
  "Computational neuroscience: attention + memory",
  "Complex and biological systems",
  "Artificial intelligence and inference",
  "Consciousness research",
];

const publications = [
  {
    title: "The CLICK Protocol: Solving AoC’s Secret Entrance with a Turing Machine",
    link: "https://community.wolfram.com/groups/-/m/t/3592839",
  },
  {
    title: "Enumerating local rewriting rules for two-link network systems",
    link: "https://community.wolfram.com/groups/-/m/t/3420775",
  },
  {
    title: "[WSS24] Adaptive evolution for Turing machines",
    link: "https://community.wolfram.com/groups/-/m/t/3209199",
  },
  {
    title:
      "Attitudes Toward Facial Analysis AI: A Cross-National Study Comparing Argentina, Kenya, Japan, and the USA",
    link: "https://dl.acm.org/doi/10.1145/3630106.3659038",
  },
];

const summerSchools = [
  {
    title: "Wolfram Summer School 2024",
    link: "https://education.wolfram.com/summer-school",
  },
  {
    title: "IBRO-Simons Computational Neuroscience Imbizo",
    link: "https://imbizo.africa/archive/2024/",
  },
  {
    title: "Computational Neuroscience & Machine Learning (TReND)",
    link: "https://trendinafrica.org/computational-neuroscience-basics/",
  },
];

const liveVideos = [
  {
    title: "Live Science: Plasticity gating - Adaptive predictive coding",
    description: "Plasticity gating walkthrough with adaptive predictive coding.",
    videoId: "rybW6m8eycY",
    link: "https://www.youtube.com/watch?v=rybW6m8eycY",
    tags: ["Adaptive Predictive Coding", "Plasticity"],
    status: "Recorded",
  },
  {
    title: "Live Science: Event-modulated plasticity - Adaptive predictive coding",
    description: "Event-driven plasticity walkthrough with adaptive predictive coding.",
    videoId: "qhwFHNvMXEA",
    link: "https://www.youtube.com/watch?v=qhwFHNvMXEA&t=44s",
    tags: ["Adaptive Predictive Coding", "Plasticity"],
    status: "Recorded",
  },
  {
    title: "Live Science: Debug the stability problem in the predictor dynamics - Reacher",
    description: "Live debugging session on stability for predictor dynamics in Reacher.",
    videoId: "2zisqF4WKXY",
    link: "https://www.youtube.com/watch?v=2zisqF4WKXY&t=414s",
    tags: ["Stability", "Predictor dynamics"],
    status: "Recorded",
  },
  {
    title: "Live Science: Live coding and debugging: Adaptive Predictive Coding",
    description: "Hands-on coding and debugging of adaptive predictive coding pipelines.",
    videoId: "bvP7ML7xTI0",
    link: "https://www.youtube.com/watch?v=bvP7ML7xTI0&t=425s",
    tags: ["Live coding", "Predictive coding"],
    status: "Recorded",
  },
  {
    title: "Live Science: Understanding the hyperparameters: Adaptive Predictive Coding",
    description: "Hyperparameter intuition and tuning for adaptive predictive coding.",
    videoId: "rE7j7f6SX8E",
    link: "https://www.youtube.com/watch?v=rE7j7f6SX8E&t=565s",
    tags: ["Hyperparameters", "Predictive coding"],
    status: "Recorded",
  },
  {
    title: "Live Sci: Teaching AI to Survive Chaotic Worlds: Adaptive Predictive Coding",
    description: "Applying adaptive predictive coding to chaotic environments.",
    videoId: "xhSWNRaKHz8",
    link: "https://www.youtube.com/watch?v=xhSWNRaKHz8&t=175s",
    tags: ["AI", "Chaotic systems"],
    status: "Recorded",
  },
  {
    title: "Memory Augmented Architectures: Biological Lessons for Computation",
    description: "A Wolfram Institute talk on how biological attention and memory inform new computational models.",
    videoId: "LYUX2YN0YYc",
    link: "https://www.youtube.com/watch?v=LYUX2YN0YYc&t=233s",
    tags: ["Computational neuroscience", "Wolfram Institute"],
    status: "Recorded",
  },
];

const articleSummaries = {
  "1": "Combinatorial patterns for generating every subset efficiently.",
  "2": "A fast primer on uninformed search strategies and their tradeoffs.",
  "3": "Encoding logical statements into machine-readable structures.",
  "4": "Applying theorem proving to automate logical inference.",
  "14": "Lexicographic permutations and why ordering strategies matter.",
  "5": "A poetic take on consciousness and what it might be.",
  "21": "Reflections on godlessness, worlds, and free will.",
  "18": "Exploring self-identity and the question of existence.",
  "19": "Simulated worlds, belief, and the edges of consciousness.",
  "20": "Another pass at simulation and free will, in essay form.",
  "22": "A poem on doors, pursuit, and uneasy freedom.",
  "6": "Imagination and consciousness through a poetic lens.",
  "7": "Memes, minds, and AI as carriers of ideas.",
  "8": "Love and consciousness intertwined in verse.",
  "9": "Escaping the mind’s prison—imagery and resolve.",
  "10": "Imagination and the landscapes it paints.",
  "11": "Love, consciousness, and the universe within.",
  "12": "Dreams, mind, and AI in a single stream.",
  "13": "Imagination as a mirror for consciousness.",
  "15": "Unexplored light—poetry for inner space.",
  "16": "Consciousness and the unknown, rendered in verse.",
  "17": "Other worlds and theory of mind in poetic form.",
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/asheux" },
  { name: "X", href: "https://x.com/bm_asheuh" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/brian-a-007241135/" },
  { name: "ORCID", href: "https://orcid.org/0009-0008-5238-660X" },
];

function importAll(r) {
  r.keys().forEach((key) => {
    importCache[key] = r(key);
  });
}

importAll(require.context("./articles/", true, /\.html$/));

function loadTheme() {
  return localStorage.getItem("asheux-theme") || "dark";
}

function saveTheme(theme) {
  localStorage.setItem("asheux-theme", theme);
}

function loadCustomArticles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error("Could not load saved articles", err);
  }
  return [];
}

function persistCustomArticles() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customArticles));
}

function hydrateArticles() {
  try {
    wasmMain.set_route("/");
    const data = wasmMain.handle_route(0);
    state.articles = parseArticles(data);
  } catch (err) {
    state.articles = [];
    console.error("Unable to load articles from wasm", err);
  }
}

function parseArticles(data) {
  const labels = {
    programing_ai: "Programming & AI",
    poetry_and_essays: "Poetry & Essays",
  };
  return Object.keys(labels).flatMap((key) => {
    const items = data.get ? data.get(key) : [];
    return items.map((item) => {
      const parts = item.tag.split(",");
      const id = parts.shift();
      return {
        id,
        title: item.name,
        tags: parts,
        category: labels[key],
        summary: articleSummaries[id] || "Read the full article.",
        source: "builtin",
      };
    });
  });
}

function renderShell() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="page">
      <header class="nav-shell">
        <div class="mui-container nav-bar">
          <div class="brand">
            <span class="dot"></span>
            <span>Asheux</span>
            <span class="muted">${HERO_NAME}</span>
          </div>
          <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
            Menu
          </button>
          <div class="nav-links">
            <a class="nav-link" href="#about">About</a>
            <a class="nav-link" href="#articles">Articles</a>
            <a class="nav-link" href="#videos">Videos</a>
            <a class="nav-link" href="#projects">Projects</a>
            <a class="nav-link" href="#lab">Lab</a>
            <button class="icon-button" id="theme-toggle" aria-label="Toggle theme">
              <img id="theme-icon" src="${state.theme === "dark" ? lightIcon : darkIcon}" alt="Toggle theme" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" class="section hero">
          <div class="mui-container hero-grid">
            <div class="surface hero-card">
              <div class="hero-head">
                <div class="hero-intro">
                  <p class="pill">Rust • WebAssembly • Applied research</p>
                  <h1>${HERO_NAME}</h1>
                  <p class="lead">
                    Studied BSc in computer science at Dedan Kimathi University of Technology in Kenya. He has experience in software engineering and mentorship. His research areas include computational neuroscience, and the bridge between complex systems and biological systems.
                  </p>
                  <div class="chip-row">
                    <span class="chip">Affiliate Researcher — Wolfram Institute</span>
                    <span class="chip">Senior Software Engineer — Soapbox</span>
                    <span class="chip">Computational Neuroscience & Consciousness</span>
                  </div>
                </div>
                <div class="hero-inline-portrait">
                  <div class="hero-portrait-frame">
                    <img src="${portrait}" alt="${HERO_NAME}" />
                  </div>
                </div>
              </div>
              <div class="cta-row">
                <a class="btn primary" href="#articles">Read articles</a>
                <a class="btn" href="${cv}" target="_blank" rel="noreferrer">Download CV</a>
                <a class="btn ghost" href="mailto:brian.mboya@protonmail.com">Email me</a>
              </div>
              <div class="social-row">
                ${socialLinks
                  .map(
                    (s) =>
                      `<a class="social-link" href="${s.href}" target="_blank" rel="noreferrer">${s.name}</a>`,
                  )
                  .join("")}
              </div>
              <div class="stat-row">
                <div class="stat">
                  <strong>Rust • WebAssembly</strong>
                  Blazingly fast experiments, zero-compromise bundles.
                </div>
                <div class="stat">
                  <strong>Research & Writing</strong>
                  Notes on AI, attention, and systems that evolve.
                </div>
                <div class="stat">
                  <strong>Builder</strong>
                  From network paclets to resilient crawlers.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" class="section">
          <div class="mui-container">
            <div class="section-header">
              <div>
                <p class="pill">Profile</p>
                <h2>About & Focus</h2>
                <p>
                  Shipping production software at Soapbox, researching complex systems with the Wolfram Institute,
                  and teaching Python + ML with TReND. I study attention, memory, and the computational stories brains tell.
                </p>
              </div>
            </div>
            <div class="grid-two">
              <div class="surface">
                <h4>Current Work</h4>
                <p class="muted">
                  Affiliate Researcher at the Wolfram Institute · Senior Software Engineer at Soapbox Inc.
                </p>
                <h4>Contributions</h4>
                <ul class="list">
                  ${publications
                    .map(
                      (p) => `<li><a href="${p.link}" target="_blank" rel="noreferrer">${p.title}</a></li>`,
                    )
                    .join("")}
                </ul>
                <h4>Summer Schools</h4>
                <ul class="list">
                  ${summerSchools
                    .map((item) => `<li><a href="${item.link}" target="_blank" rel="noreferrer">${item.title}</a></li>`)
                    .join("")}
                </ul>
              </div>
              <div class="surface">
                <h4>Research Interests</h4>
                <ul class="list">
                  ${researchInterests.map((item) => `<li>${item}</li>`).join("")}
                </ul>
                <h4>Questions I chase</h4>
                <ul class="list">
                  <li>How does attention sculpt working memory?</li>
                  <li>Where do dreams and consciousness intersect with computation?</li>
                  <li>What are minimal rules for complex, emergent behavior?</li>
                </ul>
                <p class="muted">
                  Let’s collaborate: <a href="mailto:brian.mboya@protonmail.com">brian.mboya@protonmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="articles" class="section">
          <div class="mui-container">
            <div class="section-header">
              <div>
                <p class="pill">Writing</p>
                <h2>Articles & Essays</h2>
                <p>Long-form thinking on programming, AI, poetry, and consciousness. Powered by Rust + wasm for instant loads.</p>
              </div>
              <div class="filters" id="article-filters">
                ${renderFilterChip("all", "All")}
                ${renderFilterChip("Programming & AI", "Programming & AI")}
                ${renderFilterChip("Poetry & Essays", "Poetry & Essays")}
                ${renderFilterChip("custom", "Drafts (local)")}
              </div>
            </div>
            <div id="article-grid" class="article-grid"></div>
            <div class="composer surface">
              <h4>Post a new article</h4>
              <p class="muted">
                Save drafts locally before you publish them. They will appear alongside the wasm-powered posts above.
              </p>
              <form id="article-form">
                <div class="field">
                  <label for="title">Title</label>
                  <input id="title" name="title" type="text" required placeholder="My next note on cognition..." />
                </div>
                <div class="field">
                  <label for="summary">Short summary</label>
                  <input id="summary" name="summary" type="text" placeholder="One or two lines to tease the idea" />
                </div>
                <div class="field">
                  <label for="tags">Tags</label>
                  <input id="tags" name="tags" type="text" placeholder="rust, ai, consciousness" />
                  <small class="helper">Comma separated. Example: rust, wasm, research</small>
                </div>
                <div class="field">
                  <label for="body">Body</label>
                  <textarea id="body" name="body" placeholder="Write in plain text. We'll keep it fast and clean."></textarea>
                </div>
                <div class="cta-row">
                  <button class="btn primary" type="submit">Save locally</button>
                  <button class="btn ghost" type="button" id="clear-drafts">Clear local drafts</button>
                </div>
                <small class="helper">Drafts stay in your browser storage. Export them anytime.</small>
              </form>
            </div>
          </div>
        </section>

        <section id="videos" class="section">
          <div class="mui-container">
            <p class="pill">Livestreams</p>
            <h2>AI & Computational Neuroscience Live</h2>
            <p>Recent and upcoming streams, demos, and research sessions.</p>
            <div id="video-grid" class="video-grid"></div>
          </div>
        </section>

        <section id="projects" class="section">
          <div class="mui-container">
            <p class="pill">Selected work</p>
            <h2>Projects & Experiments</h2>
            <p>Hands-on builds across research, education, and fast Rust/WebAssembly utilities.</p>
            <div id="project-grid" class="project-grid"></div>
          </div>
        </section>

        <section id="lab" class="section">
          <div class="mui-container">
            <p class="pill">Labs</p>
            <h2>Web Assembly Playground</h2>
            <p>Kick off a wasm-powered crawl in a couple of seconds. Built for quick reconnaissance.</p>
            <div class="lab-grid">
              <div class="surface">
                <form id="crawler-form">
                  <div class="field">
                    <label for="crawler-input">Domains to crawl</label>
                    <input id="crawler-input" type="text" placeholder="asheux.com, example.org, xkcd.com" />
                    <small class="helper">Comma separated. We queue, filter, and fetch concurrently in Rust + wasm.</small>
                  </div>
                  <div class="cta-row">
                    <button class="btn primary" type="submit" id="crawl-btn">Queue crawl</button>
                    <span class="pill" id="crawler-status">Idle</span>
                  </div>
                </form>
                <ul class="result-list" id="crawl-results"></ul>
              </div>
              <div class="surface">
                <div class="project-thumb">
                  <img src="${spiderImage}" alt="Crawler illustration" />
                </div>
                <p class="muted">Crawling happens inside WebAssembly with small, efficient requests.</p>
                <div id="crawl-stats" class="stat-row"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="mui-container">
          Built with Rust, WebAssembly, and a little MUI polish. <a href="mailto:brian.mboya@protonmail.com">Say hello.</a>
        </div>
      </footer>
    </div>

    <div id="article-modal" class="article-modal" role="dialog" aria-modal="true">
      <div class="article-dialog">
        <div class="article-dialog__header">
          <div>
            <p class="pill">Article</p>
            <strong id="article-title">${HERO_NAME}</strong>
          </div>
          <button class="close-btn" id="close-article">Close</button>
        </div>
        <div class="article-dialog__body" id="article-body"></div>
      </div>
    </div>
  `;
}

function renderFilterChip(key, label) {
  const active = state.filter === key ? "active" : "";
  return `<button class="filter-chip ${active}" data-filter="${key}">${label}</button>`;
}

function renderArticles() {
  const grid = document.getElementById("article-grid");
  if (!grid) return;

  const allArticles = [
    ...state.customArticles.map((a) => ({ ...a, source: "custom", category: "Draft" })),
    ...state.articles,
  ];

  const filtered = allArticles.filter((item) => {
    if (state.filter === "all") return true;
    if (state.filter === "custom") return item.source === "custom";
    return item.category === state.filter;
  });

  const sorted = filtered.sort((a, b) => {
    const aDate = new Date(a.createdAt || 0).getTime();
    const bDate = new Date(b.createdAt || 0).getTime();
    if (aDate !== bDate) return bDate - aDate;
    const aScore = Number(a.id);
    const bScore = Number(b.id);
    return (isNaN(bScore) ? 0 : bScore) - (isNaN(aScore) ? 0 : aScore);
  });

  grid.innerHTML = "";

  if (!sorted.length) {
    grid.innerHTML = `<p class="muted">No articles here yet. Add one from the composer below.</p>`;
    return;
  }

  sorted.forEach((article) => {
    const card = document.createElement("article");
    card.className = "article-card";
    const tags = article.tags && article.tags.length
      ? `<div class="tag-row">${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`
      : "";
    card.innerHTML = `
      <div class="article-meta">${article.category || "Article"}</div>
      <h3>${article.title}</h3>
      <p class="article-meta">${article.summary || "No summary yet — open to read the full note."}</p>
      ${tags}
      <div class="cta-row">
        <button class="btn" data-article="${article.id}" data-source="${article.source || "builtin"}">Open</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll("button[data-article]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-article");
      const source = button.getAttribute("data-source");
      openArticle(id, source);
    });
  });
}

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;
  grid.innerHTML = "";

  projectShowcase.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    const tags = project.tags.map((tag) => `<span class="chip">${tag}</span>`).join("");
    card.innerHTML = `
      <div class="project-thumb">
        <img src="${project.image}" alt="${project.title}" />
      </div>
      <h3>${project.title}</h3>
      <p>${project.blurb}</p>
      <div class="project-meta">${tags}</div>
      <div class="cta-row">
        <a class="btn primary" href="${project.link}" target="${project.link.startsWith('#') ? "_self" : "_blank"}" rel="noreferrer">Explore</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderVideos() {
  const grid = document.getElementById("video-grid");
  if (!grid) return;
  grid.innerHTML = "";

  liveVideos.forEach((video) => {
    const card = document.createElement("article");
    card.className = "video-card";
    const tags = video.tags && video.tags.length
      ? `<div class="tag-row">${video.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`
      : "";
    const embed = video.videoId
      ? `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${video.videoId}" title="${video.title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
      : `<div class="video-embed placeholder"><p class="muted">Add a YouTube ID to embed directly.</p></div>`;
    card.innerHTML = `
      ${embed}
      <div class="video-body">
        <div class="video-meta">
          <span class="pill">${video.status || "Live"}</span>
        </div>
        <h3>${video.title}</h3>
        <p class="muted">${video.description || ""}</p>
        ${tags}
        <div class="cta-row">
          <a class="btn primary" href="${video.link}" target="_blank" rel="noreferrer">Watch on YouTube</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupComposer() {
  const form = document.getElementById("article-form");
  const clearBtn = document.getElementById("clear-drafts");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const title = (formData.get("title") || "").toString().trim();
    if (!title) return;
    const summary = (formData.get("summary") || "").toString().trim();
    const tags = (formData.get("tags") || "")
      .toString()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const body = (formData.get("body") || "").toString().trim();
    const slug = slugify(title);
    const article = {
      id: slug,
      title,
      summary,
      tags,
      body,
      createdAt: new Date().toISOString(),
      source: "custom",
    };
    state.customArticles.unshift(article);
    persistCustomArticles();
    renderArticles();
    form.reset();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.customArticles = [];
      persistCustomArticles();
      renderArticles();
    });
  }
}

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `note-${Date.now()}`
  );
}

function openArticle(id, source = "builtin", fromPop = false) {
  const modal = document.getElementById("article-modal");
  const body = document.getElementById("article-body");
  const title = document.getElementById("article-title");
  if (!modal || !body || !title) return;

  let article =
    source === "custom"
      ? state.customArticles.find((item) => item.id === id)
      : state.articles.find((item) => item.id === id);

  if (!article) {
    body.innerHTML = "<p>Article not found.</p>";
    modal.classList.add("open");
    return;
  }

  const content =
    source === "custom" ? renderCustomArticle(article) : loadHtmlArticle(article.id);

  title.textContent = article.title;
  body.innerHTML = content;
  normalizeLinks(body);
  formatReferences(body);
  highlightArticleCode(body);

  modal.classList.add("open");
  state.selectedArticle = article;
  document.body.style.overflow = "hidden";

  if (!fromPop) {
    const path =
      source === "custom" ? `/articles/custom-${article.id}` : `/articles/${article.id}`;
    window.history.pushState({ modal: true }, "", path);
  }
}

function closeArticle(fromPop = false) {
  const modal = document.getElementById("article-modal");
  if (!modal) return;
  modal.classList.remove("open");
  state.selectedArticle = null;
  document.body.style.overflow = "auto";
  if (!fromPop && window.location.pathname.startsWith("/articles/")) {
    window.history.pushState({}, "", "/");
  }
}

function renderCustomArticle(article) {
  const escapedSummary = escapeHtml(article.summary || "");
  const escapedBody = escapeHtml(article.body || "");
  const body = escapedBody
    ? escapedBody.split("\n").map((line) => `<p>${line}</p>`).join("")
    : "<p>This draft is still empty.</p>";

  const tags =
    article.tags && article.tags.length
      ? `<div class="tag-row">${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`
      : "";

  return `
    <p class="article-meta">Draft • saved locally</p>
    <h2>${escapeHtml(article.title)}</h2>
    <p>${escapedSummary}</p>
    ${tags}
    ${body}
  `;
}

function loadHtmlArticle(id) {
  const key = `./${id}.html`;
  const res = importCache[key];
  if (res && res.default) return res.default;
  return "<p>Article not found.</p>";
}

function normalizeLinks(target) {
  const anchors = target.querySelectorAll("a");
  anchors.forEach((anchor) => {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  });
}

function formatReferences(target) {
  const headings = Array.from(target.querySelectorAll("h2, h3, h4")).filter(
    (h) => h.textContent.trim().toLowerCase() === "references",
  );
  headings.forEach((heading) => {
    let list = heading.nextElementSibling;
    while (list && !["UL", "OL"].includes(list.tagName)) {
      list = list.nextElementSibling;
    }
    if (!list) return;

    const items = Array.from(list.querySelectorAll("li"));
    if (!items.length) return;

    const ordered = document.createElement("ol");
    ordered.className = "reference-list";

    items.forEach((li) => {
      const entry = document.createElement("li");
      entry.className = "reference-list__item";
      entry.innerHTML = li.innerHTML.trim();
      ordered.appendChild(entry);
    });

    heading.classList.add("reference-heading");
    list.replaceWith(ordered);
  });
}

function highlightArticleCode(target) {
  const blocks = target.querySelectorAll("pre code");
  blocks.forEach((block) => {
    block.textContent = dedentCode(block.textContent);
    hljs.highlightElement(block);
  });
}

function dedentCode(text) {
  const lines = text.replace(/\t/g, "  ").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => {
      const match = line.match(/^(\s*)/);
      return match ? match[1].length : 0;
    });
  const minIndent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(minIndent)).join("\n");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupFilters() {
  const filterBar = document.getElementById("article-filters");
  if (!filterBar) return;
  filterBar.addEventListener("click", (event) => {
    const target = event.target.closest("[data-filter]");
    if (!target) return;
    state.filter = target.getAttribute("data-filter");
    filterBar.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
    target.classList.add("active");
    renderArticles();
  });
}

function setupNavHandlers() {
  const toggler = document.getElementById("theme-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");
  const closeBtn = document.getElementById("close-article");
  const modal = document.getElementById("article-modal");
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
        if (navLinksContainer && navLinksContainer.classList.contains("open")) {
          navLinksContainer.classList.remove("open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  if (toggler) {
    toggler.addEventListener("click", toggleTheme);
  }

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeArticle());
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeArticle();
      }
    });
  }
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveTheme(state.theme);
  applyTheme();
}

function applyTheme() {
  document.body.setAttribute("data-theme", state.theme);
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.src = state.theme === "dark" ? lightIcon : darkIcon;
  }
}

function setupCrawler() {
  const form = document.getElementById("crawler-form");
  const status = document.getElementById("crawler-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("crawler-input");
    if (!input) return;
    const roots = input.value.trim();
    if (!roots) {
      status.textContent = "Add a domain first.";
      status.className = "pill warn";
      return;
    }
    await runCrawler(roots);
  });
}

async function runCrawler(roots) {
  const status = document.getElementById("crawler-status");
  const resultsList = document.getElementById("crawl-results");
  const statsContainer = document.getElementById("crawl-stats");
  if (!status || !resultsList) return;

  status.textContent = "Crawling…";
  status.className = "pill warn";
  state.crawling = true;
  state.crawlResults = [];
  state.crawlErrors = [];
  resultsList.innerHTML = "";
  statsContainer.innerHTML = "";

  try {
    crawler.set_roots(roots.replace(/\s/g, ""));
    crawler.init_roots();
    const res = await crawler.crawl(25);
    const errors = Array.from(res.get("errors") || []);

    if (errors.length) {
      state.crawlErrors = errors;
      status.textContent = errors[0];
      status.className = "pill warn";
      renderCrawlerResults();
      state.crawling = false;
      return;
    }

    const links = Array.from(res.get("result") || []);
    const seen = Array.from(res.get("seen") || []);
    const queue = Array.from(res.get("queue") || []);
    const rootDomains = Array.from(res.get("root_domains") || []);

    state.crawlResults = links;
    state.crawlStats = { hits: links.length, seen: seen.length, queued: queue.length, roots: rootDomains.length };
    status.textContent = `Done · ${links.length} links`;
    status.className = "pill success";
    renderCrawlerResults();
    renderCrawlerStats();
  } catch (err) {
    console.error("Crawler error", err);
    status.textContent = "Network error. Try again.";
    status.className = "pill warn";
  } finally {
    state.crawling = false;
  }
}

function renderCrawlerResults() {
  const resultsList = document.getElementById("crawl-results");
  if (!resultsList) return;
  resultsList.innerHTML = "";

  if (state.crawlErrors.length) {
    state.crawlErrors.forEach((err) => {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = err;
      resultsList.appendChild(li);
    });
    return;
  }

  if (!state.crawlResults.length) {
    resultsList.innerHTML = `<li class="empty">No links yet. Add a domain and crawl.</li>`;
    return;
  }

  state.crawlResults.slice(0, 40).forEach((link) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link;
    a.textContent = link;
    a.target = "_blank";
    a.rel = "noreferrer";
    li.appendChild(a);
    resultsList.appendChild(li);
  });
}

function renderCrawlerStats() {
  const container = document.getElementById("crawl-stats");
  if (!container || !state.crawlStats) return;
  container.innerHTML = `
    <div class="stat"><strong>Hits</strong>${state.crawlStats.hits}</div>
    <div class="stat"><strong>Seen</strong>${state.crawlStats.seen}</div>
    <div class="stat"><strong>Queued</strong>${state.crawlStats.queued}</div>
    <div class="stat"><strong>Roots</strong>${state.crawlStats.roots}</div>
  `;
}

function handleInitialRoute() {
  const path = window.location.pathname;
  const match = path.match(/^\/articles\/(.+)/);
  if (match) {
    const raw = match[1];
    if (raw.startsWith("custom-")) {
      const id = raw.replace("custom-", "");
      openArticle(id, "custom", true);
    } else {
      openArticle(raw, "builtin", true);
    }
  } else if (path !== "/") {
    window.history.replaceState({}, "", "/");
  }
}

window.onpopstate = () => {
  const path = window.location.pathname;
  if (path.startsWith("/articles/")) {
    handleInitialRoute();
  } else {
    closeArticle(true);
  }
};

function init() {
  hydrateArticles();
  renderShell();
  applyTheme();
  renderArticles();
  renderVideos();
  renderProjects();
  setupComposer();
  setupFilters();
  setupNavHandlers();
  setupCrawler();
  handleInitialRoute();
}

init();
