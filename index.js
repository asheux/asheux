import { Main, Dictionary } from "wasm-router-handler";

const themeToggle = document.getElementById('theme-toggler');

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
    const bodyElement = document.getElementById('body-id');
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
        }
    } else {
        if (!e) { 
            bodyColor = "#ffffff";
            navbarColor = "#f0f0f0";
            fill = "#292a2d";
            textColor = "#000000";
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
    themeToggle.style.fill = fill;
    bodyElement.style.color = textColor;
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].style.color = textColor;
    }
}

const writeName = () => {
    const nameElement = document.getElementById("navname");
    const name = home.get_name(); 
    let index = 0;
    const intervalId = setInterval(() => {
        if (index < name.length) {
            let letter = name[index];
            const span = createElement("span");
            span.textContent = letter;
            span.style.color = "green";
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
    for (let i = 0; i < out.length; i++) {
        const item = out[i];
        const {name, tag} = item;
        const ul = document.getElementById('links');
        const li = createElement('li');
        const a = createElement('a');
        const span = createElement('span');
        a.textContent = name;
        a.href = `/article#${i+1}`;
        a.value = i+1;
        a.addEventListener("click", handleRouting);
        const tags = tag.split(',');
        for (let n = 0; n < tags.length; n++) {
            const small = createElement('small');
            const t = tags[n];
            small.textContent = t;
            small.style.padding = "3px";
            small.style.margin = "2px";
            small.style.borderRadius = "5%";
            small.style.backgroundColor = "#41d8da";
            small.style.color = "#000000";
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
        ul.appendChild(li);
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
    return fetch(`articles/${id}.html`)
    .then(response => response.text())
    .then(data => data)
    .catch(
        error => console.error('Error:', error)
    );
}

const handleRouting = (event) => {
    const href = event.target.href;
    if (href.includes('article')) {
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
    const routes = ['/', '/about', '/projects', '/article'];
    const functionMapper = {
        "/": writeHomePage,
        "/about": writeAboutPage,
        "/projects": writeProjectsPage,
        "/article": writeArticlePage,
    };

    if (routes.includes(route)) {
        content.innerHTML = "";
        const response = home.handle_route();
        let data = JSON.parse(response);
        if (route === '/article') {
            if (id) {
                fetchHTMLContont(id).then(res => {
                    functionMapper[route](res);
                });
            }
        } else {
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

themeToggle.addEventListener("click", v => {
    setTheme(v); 
});

setInterval(Blinker, 300);
setTheme();
writeName();
writeHomePage(default_data);

const navis = document.querySelectorAll("a");
navis.forEach(anchor => {
    anchor.addEventListener('click', handleRouting);
});

// Handle back and forward button events
window.onpopstate = router;
window.router = router;
