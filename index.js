import { Main, Dictionary } from "wasm-router-handler";
import "./styles.css";
import article1 from "./articles/1.html";
import darktheme from "./images/lighttheme.svg";
import lighttheme from "./images/darktheme.svg";

const importCache = {};
function importAll(r) {
  r.keys().forEach((key) => (importCache[key] = r(key)));
}
importAll(require.context('./articles/', true, /\.html$/));

const loadNavbar = () => {
    const main = document.getElementById("main");
    const div = createElement('div');
    // parent
    div.classList.add("anavbar");
    div.setAttribute("id", "anavbar-id");
    // child
    const div2 = createElement('div');
    div2.classList.add("container");
    div2.setAttribute("id", "nav");
    div.appendChild(div2);
    // great child
    const div3 = createElement('div');
    div3.classList.add("home");
    const a = createElement('a');
    a.setAttribute("id", "navname");
    a.href = "/";
    a.textContent = "Asheux ";
    const span = createElement('span');
    span.setAttribute("id", "blinker");
    span.style.pointerEvents = "none";
    span.textContent = "? ";
    a.appendChild(span)
    writeName(a);
    div3.appendChild(a);
    div2.appendChild(div3);
    // great child 2
    const div4 = createElement('div');
    div4.classList.add('others');
    let aas = [createElement('a'), createElement('a')];
    let rs = ['/About', '/Projects'];
    for (let i = 0; i<aas.length; i++) {
        let r = rs[i];
        let _a = aas[i]
        _a.setAttribute("id", "nav-item");
        _a.href = r.toLowerCase();
        _a.textContent = r.replace("/", "");
        div4.appendChild(_a);
    }
    const _span = createElement('span');
    _span.setAttribute("id", "theme-toggle");
    _span.classList.add("toggle");
    const img = createElement("img");
    let themetoggler = darktheme;
    if (isDark()) {
        themetoggler = lighttheme;
    }
    img.src = themetoggler;
    img.setAttribute("id", "theme-toggler");
    _span.appendChild(img);
    div4.appendChild(_span);
    div2.appendChild(div4);
    div.appendChild(div2);
    main.appendChild(div);
    // parent
    const div5 = createElement('div');
    div5.classList.add("container");
    // child
    const div6 = createElement('div');
    div6.setAttribute("id", "content");
    div5.appendChild(div6);
    main.appendChild(div5);
    const footer = createElement('footer');
    footer.classList.add('anavbar');
    footer.setAttribute('id', 'footer-id');
    const div7 = createElement('div');
    div7.classList.add('footer');
    const p = createElement('p');
    p.setAttribute('id', 'ptext');
    p.textContent = '@ 2023 Brian.Mboya@Asheux.com';
    div7.appendChild(p);
    footer.appendChild(div7);
    main.appendChild(footer);
}

// Initialize rust objects
const home = new Main();
const dictionary = new Dictionary();
const default_respone = dictionary.get_tags()
const default_data = JSON.parse(default_respone);

const setTheme = (e) => {
    let bodyColor = "#292a2d";
    let navbarColor = "#252627";
    let fill = "#ffffff";
    let textColor = "#a9a9b3";
    let articleColor = "a9a9b3";
    let src = darktheme;
    const bodyElement = document.getElementById('body-id');
    const themeToggle = document.getElementById('theme-toggler');
    const navbarElement = document.getElementById('anavbar-id');
    const footerElement = document.getElementById('footer-id');
    const nav = document.getElementById("nav");
    const ptext = document.getElementById("ptext");
    const navItems = nav.getElementsByTagName("a");

    if (isDark()) {
        if (e) {
            bodyColor = "#ffffff";
            navbarColor = "#f0f0f0";
            fill = "#292a2d";
            textColor = "#000000";
            src = lighttheme;
        }
    } else {
        if (!e) { 
            bodyColor = "#ffffff";
            navbarColor = "#f0f0f0";
            fill = "#292a2d";
            textColor = "#000000";
            src = lighttheme;
        }
    }
    if (e) {
        localStorage.setItem("darkTheme", !isDark());
    }
    bodyElement.style.backgroundColor = bodyColor;
    navbarElement.style.backgroundColor = navbarColor; 
    footerElement.style.backgroundColor = navbarColor; 
    footerElement.style.color = textColor; 
    ptext.style.color = textColor; 
    themeToggle.src = src;
    bodyElement.style.color = textColor;
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].style.color = textColor;
    }
}

const writeName = (nameElement) => {
    const name = home.get_name(); 
    let index = 0;
    const intervalId = setInterval(() => {
        if (index < name.length) {
            let letter = name[index];
            const span = createElement("span");
            span.textContent = letter;
            span.style.color = "green";
            span.style.fontSize = true;
            span.style.pointerEvents = "none";
            nameElement.appendChild(span);
            index++
        } else {
            clearInterval(intervalId);
        }
    }, 100);
}

const createElement = (el) => {
    return document.createElement(el);
}

const writeLinks = (out) => {
    const ul = document.getElementById('links');
    const h = createElement("h4");
    h.textContent = "Programming & Artificial Intelligence";
    ul.appendChild(h);
    let isOldSet = false;
    for (let i = 0; i < out.length; i++) {
        const item = out[i];
        const {name, tag} = item;
        const tags = tag.split(',');
        const id = Number(tags[0]);
        const li = createElement('li');
        const a = createElement('a');
        let h4 = null;
        if (id === 0) {
            h4 = createElement('h4');
            h4.textContent = "Poetry & Essays";
        }
        const span = createElement('span');
        a.textContent = name;
        a.href = `/articles/${id}`;
        a.value = id;
        a.addEventListener("click", handleRouting);
        for (let n = 1; n < tags.length; n++) {
            const small = createElement('small');
            const t = tags[n];
            small.textContent = t;
            small.style.padding = "3px";
            small.style.margin = "2px";
            small.style.borderRadius = "5%";
            small.style.backgroundColor = "#0f8c8e";
            small.style.color = "#ffffff";
            span.appendChild(small);
        }
        const classes = ['link', 'timer']
        const elements = [a, span];
        for (let j = 0; j < 2; j++) {
            const el = elements[j];
            const _class = classes[j];
            const div = createElement('div');
            div.classList.add(_class);
            div.append(el);
            li.appendChild(div);
        }
        if (h4 && !isOldSet) {
            isOldSet = true;
            ul.appendChild(h4);
            h4 = null;
        }
        if (id !== 0) {
            ul.appendChild(li);
        }
    }
}


const writeHomePage = (out_data) => {
    const content = document.getElementById("content");
    const input = createElement("input");
    const ul = createElement('ul');
    ul.setAttribute("id", "links");
    input.type = "text";
    input.placeholder = "Search...";
    input.classList.add('searchbar')
    const divv = createElement('div')
    const f = divv.appendChild(input);
    const s = divv.appendChild(ul);
    const divs = [f, s];
    const classes = ['search', 'linksdata']
    for (let i = 0; i < divs.length; i++) {
        const div = divs[i];
        const _class = classes[i];
        div.classList.add(_class);
        content.appendChild(div)
    }
    writeLinks(out_data);
}

const writeAboutPage = (out) => {
    const content = document.getElementById('content');
    const h1 = createElement('h1');
    h1.textContent = out[0].name;
    content.appendChild(h1);
}

const writeProjectsPage = (out) => {
    const content = document.getElementById('content');
    const h1 = createElement('h1');
    h1.textContent = out[0].name;
    content.appendChild(h1);
}

const writeArticlePage = (out) => {
    const content = document.getElementById('content');
    const codes = document.getElementsByTagName('code');
    let codeColor = "#663399";
    content.innerHTML = out;
    for (let code of codes) {
        code.style.color = codeColor;
    }
}

const fetchHTMLContont = (id) => {
    return fetch(`/articles/${id}.html`)
    .then(response => response.text())
    .then(data => data)
    .catch(
        error => console.error('Error:', error)
    );
}

const handleRouting = (event) => {
    const href = event.target.href;
    if (href.includes('articles')) {
        localStorage.setItem("articleId", event.target.value);
    }
    event.preventDefault();
    window.history.pushState(null, null, href);
    router();
}

const router = () => {
    const id = localStorage.getItem("articleId");
    const route = window.location.pathname;
    home.set_route(route);
    const content = document.getElementById('content');
    const articleRoute = `/articles/${id}`;
    const routes = ['/', '/about', '/projects', articleRoute];
    const functionMapper = {
        "/": writeHomePage,
        "/about": writeAboutPage,
        "/projects": writeProjectsPage,
        articleRoute: writeArticlePage,
    };

    if (routes.includes(route)) {
        content.innerHTML = "";
        if (route === `/articles/${id}`) {
            if (id) {
                const res = importCache[`./${id}.html`];
                functionMapper.articleRoute(res.default);
            }
        } else {
            const response = home.handle_route(id);
            let data = JSON.parse(response);
            functionMapper[route](data);
        } 
    }
}

const Blinker = () => {
    const blinker = document.getElementById("blinker");
    const navbarElement = document.getElementById('anavbar-id');
    if (blinker) {
        blinker.style.color = (
            blinker.style.color === 'red' 
                ? 'white' 
                : 'red'
        );
    }
}

const isDark = () => {
    const _dark = localStorage.getItem("darkTheme");
    return (_dark === 'true');
};

function run() {
    loadNavbar();
    const themeToggle = document.getElementById('theme-toggler');
    themeToggle.addEventListener("click", v => {
        setTheme(v); 
    });
    setInterval(Blinker, 300);
    setTheme();
    writeHomePage(default_data);

    var navis = document.querySelectorAll("a");
    navis.forEach(anchor => {
        anchor.addEventListener('click', handleRouting);
    });

    // Handle back and forward button events
    router();
    window.onpopstate = router;
}
run();
