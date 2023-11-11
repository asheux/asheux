import { Main } from "wasm-router-handler";
import "./styles.css";
import darktheme from "./images/lighttheme.svg";
import lighttheme from "./images/darktheme.svg";
import cv from "./pdfs/cv.pdf";


// Initialize rust objects
const _home = new Main();
const import_cache = {};


function __import_all(r) {
  r.keys().forEach((key) => (import_cache[key] = r(key)));
}
__import_all(require.context('./articles/', true, /\.html$/));
__import_all(require.context('./portfolio/', true, /\.html$/));

function _get_name() {
    var a = set_attribute("h", "navname", "a");
    a.href = "/";
    a.textContent = "Asheux ";
    var span = set_attribute("j", "blinker", "span");
    span.style.pointerEvents = "none";
    span.textContent = "? ";
    a.appendChild(span)
    write_name(a);
    return a;
}

function getnavitems() {
    var div = set_attribute("others", "g", "div");
    var aas = [create_element('a'), create_element('a')];
    var rs = ['/About', '/Projects'];
    for (var i = 0; i<aas.length; i++) {
        var r = rs[i];
        var _a = aas[i]
        _a.setAttribute("id", "nav-item");
        _a.href = r.toLowerCase();
        _a.textContent = r.replace("/", "");
        div.appendChild(_a);
    }
    return div;
}

function get_theme_toggler() {
    var span = set_attribute("toggle", "theme-toggle", "span");
    var img = set_attribute("f", "theme-toggler", "img");
    var themetoggler = darktheme;
    if (is_dark()) {
        themetoggler = lighttheme;
    }
    img.src = themetoggler;
    span.appendChild(img);
    return span;
}

function cv_document(text, func, route) {
    var div = set_attribute("resume", "cv", "div");
    var abutton = set_attribute("button", "btn", "a");
    if (route) {
        abutton.href = route;
    }
    abutton.textContent = text;
    abutton.addEventListener("click", func);
    div.appendChild(abutton);
    return div;
}

function handle_document_view(e) {
    handle_routing(e);
}

function get_footer() {
    var footer = set_attribute("anavbar", "footer-id", "footer");
    var div = set_attribute("footer", "_c", "div");
    var p = set_attribute("c", "ptext", "p");
    p.textContent = 'Copyright @ 2023 asheux.com - All Rights Reserved';
    div.appendChild(p);
    footer.appendChild(div);
    return footer;
}

function set_attribute(className, id, el) {
    var element = create_element(el);
    element.classList.add(className);
    element.setAttribute("id", id);
    return element;
}

function load_navbar() {
    var main = document.getElementById("main");
    var div = set_attribute("anavbar", "anavbar-id", "div");
    // parent
    // child
    var _div = set_attribute("container", "nav", "div");
    div.appendChild(_div);
    // great child
    var __div = set_attribute("home", "_home", "div");
    var a = _get_name();
    __div.appendChild(a);
    _div.appendChild(__div);
    // great child 2
    var __div__ = getnavitems();
    var span = get_theme_toggler();
    __div__.appendChild(span);
    _div.appendChild(__div__);
    div.appendChild(_div);
    main.appendChild(div);
    // parent
    var __div_ = set_attribute("container", "x", "div");
    // child
    var ___div__ = set_attribute("l", "content", "div");
    __div_.appendChild(___div__);
    main.appendChild(__div_);
    var footer = get_footer();
    main.appendChild(footer);
}

function set_theme(e) {
    var body_color = "#292a2d";
    var navbar_color = "#252627";
    var fill = "#ffffff";
    var text_color = "#a9a9b3";
    var src = darktheme;
    var body_element = document.getElementById('body-id');
    var theme_toggle = document.getElementById('theme-toggler');
    var navbar_element = document.getElementById('anavbar-id');
    var footer_element = document.getElementById('footer-id');
    var nav = document.getElementById("nav");
    var ptext = document.getElementById("ptext");
    var nav_items = nav.getElementsByTagName("a");

    if (is_dark()) {
        if (e) {
            body_color = "#ffffff";
            navbar_color = "#f0f0f0";
            fill = "#292a2d";
            text_color = "#000000";
            src = lighttheme;
        }
    } else {
        if (!e) { 
            body_color = "#ffffff";
            navbar_color = "#f0f0f0";
            fill = "#292a2d";
            text_color = "#000000";
            src = lighttheme;
        }
    }
    if (e) {
        localStorage.setItem("darkTheme", !is_dark());
    }
    body_element.style.backgroundColor = body_color;
    navbar_element.style.backgroundColor = navbar_color; 
    footer_element.style.backgroundColor = navbar_color; 
    footer_element.style.color = text_color; 
    ptext.style.color = text_color; 
    theme_toggle.src = src;
    body_element.style.color = text_color;
    for (var i = 0; i < nav_items.length; i++) {
        nav_items[i].style.color = text_color;
    }
}

function write_name(name_element) {
    var name = _home.get_name(); 
    var index = 0;
    var intervalId = setInterval(() => {
        if (index < name.length) {
            var letter = name[index];
            var span = create_element("span");
            span.textContent = letter;
            span.style.color = "green";
            span.style.fontSize = true;
            span.style.pointerEvents = "none";
            name_element.appendChild(span);
            index++
        } else {
            clearInterval(intervalId);
        }
    }, 100);
}

function create_element(el) {
    return document.createElement(el);
}

function write_links(out) {
    var ul = document.getElementById('links');
    ul.classList.add('ul-links');
    var h = create_element("h4");
    h.textContent = "Programming & Artificial Intelligence";
    ul.appendChild(h);
    var is_old_set = false;
    for (var i = 0; i < out.length; i++) {
        var item = out[i];
        var {name, tag} = item;
        var tags = tag.split(',');
        var id = Number(tags[0]);
        var li = create_element('li');
        var a = create_element('a');
        var h4 = null;
        if (id === 0) {
            h4 = create_element('h4');
            h4.textContent = "Poetry & Essays";
        }
        var span = set_attribute('tags', 'tags', 'span');
        a.textContent = name;
        a.href = `/articles/${id}`;
        a.value = id;
        a.addEventListener("click", handle_routing);
        for (var n = 1; n < tags.length; n++) {
            var small = create_element('small');
            var t = tags[n];
            small.textContent = t;
            small.style.padding = "3px";
            small.style.margin = "2px";
            small.style.borderRadius = "5%";
            small.style.backgroundColor = "#0f8c8e";
            small.style.color = "#ffffff";
            span.appendChild(small);
        }
        var classes = ['link', 'timer']
        var elements = [a, span];
        for (var j = 0; j < 2; j++) {
            var el = elements[j];
            var _class = classes[j];
            var div = create_element('div');
            div.classList.add(_class);
            div.append(el);
            li.appendChild(div);
        }
        if (h4 && !is_old_set) {
            is_old_set = true;
            ul.appendChild(h4);
            h4 = null;
        }
        li.classList.add("li-links");
        if (id !== 0) {
            li.appendChild(create_element('br'));
            ul.appendChild(li);
        }
    }
}

function write_cv(out) {
    var content = document.getElementById('content');
    var center = set_attribute("cvresume", "cvresume", "center")
    var iframe = set_attribute("frame", "frame", "iframe")
    iframe.style.marginTop = "3em";
    iframe.style.marginBottom = "3em";
    iframe.width = "100%";
    iframe.height = "700px";
    iframe.src = out;
    center.appendChild(iframe);
    content.appendChild(center);
}

function write_home_page(out_data) {
    var content = document.getElementById("content");
    var view_cv = cv_document('View CV', handle_document_view, "/view_cv");
    content.appendChild(view_cv);
    var input = create_element("input");
    var ul = set_attribute('v', 'links', 'ul');
    input.type = "text";
    input.placeholder = "Search...";
    input.classList.add('searchbar')
    var div = create_element('div')
    var f = div.appendChild(input);
    var s = div.appendChild(ul);
    var divs = [f, s];
    var classes = ['search', 'linksdata']
    for (var i = 0; i < divs.length; i++) {
        var _div = divs[i];
        var _class = classes[i];
        _div.classList.add(_class);
        content.appendChild(_div)
    }
    write_links(out_data);
}

function write_about_page(out) {
    var content = document.getElementById('content');
    content.innerHTML = out;
    var about = document.getElementById('about');
    var allatags = about.getElementsByTagName('a');
    // set all external links to open in new tab
    for (let i = 0; i < allatags.length; i++) {
        let a = allatags[i];
        if (a) {
            a.target = '_blank';
            a.value = 'external';
        }
    }
}

function write_projects_page(out) {
    var content = document.getElementById('content');
    var h1 = create_element('h1');
    h1.textContent = out[0].name;
    content.appendChild(h1);
}

function write_article_page(out) {
    var content = document.getElementById('content');
    var codes = document.getElementsByTagName('code');
    var code_color = "#663399";
    content.innerHTML = out;
    for (var code of codes) {
        code.style.color = code_color;
    }
}

function fetch_pdf_content() {
    return fetch(cv)
    .then(response => response.arrayBuffer())
    .then(array_buffer => new Uint8Array(array_buffer))
    .catch(
        error => console.error('Error:', error)
    );
}

function handle_routing(event) {
    var href = event.target.href;
    var { value } = event.target;
    if (href.includes('articles')) {
        localStorage.setItem("articleId", event.target.value);
    }
    // only handle routing for internal url/links
    if (value !== 'external') {
        event.preventDefault();
        window.history.pushState(null, null, href);
        router();
    }
}

function router() {
    var route = window.location.pathname;
    _home.set_route(route);
    if (route && route !== '/' && route[route.length - 1] === '/') {
        route = route.slice(0, length - 1); // remove trailing slash
    }
    var content = document.getElementById('content');
    var routes = ['/', '/about', '/projects', "/view_cv"];
    var __func_mapper = {
        "/": write_home_page,
        "/about": write_about_page,
        "/projects": write_projects_page,
        article_route: write_article_page,
        "/view_cv": write_cv,
    };

    if (routes.includes(route)) {
        content.innerHTML = "";
        if (route === "/view_cv") {
            fetch_pdf_content().then(res => {
                // pre-fetch pdf data to create Blob link
                const blob_pdf = new Blob([res], { type: 'application/pdf' });
                const pdf_url = URL.createObjectURL(blob_pdf);
                __func_mapper[route](pdf_url);
            })
        } else {
            // Get display data from WebAssembly rust functions
            var response = _home.handle_route(id, new Uint8Array());
            var data = JSON.parse(response);
            let func = __func_mapper[route];
            if (route === '/about') {
                func(import_cache['./about.html'].default);
            } else {
                func(data);
            };
        } 
    } else {
        if (route.includes('articles')) {
            var paths = route.split('/');
            var id = paths[paths.length - 1];
            var reg = /^\d+$/;
            if (id === '') {
                id = paths[paths.length - 2];
            }
            if (reg.test(id)) {
                var res = import_cache[`./${id}.html`];
                if (res) {
                    __func_mapper.article_route(res.default);
                } else {
                    __func_mapper.article_route('Page not found!');
                }
            } else {
                __func_mapper.article_route('Page not found!');
            }
        } else {
            var content = document.getElementById('content');
            var h1 = create_element('h1');
            h1.textContent = 'Page not found';
            content.appendChild(h1);
        }
    }
}

function blinker() {
    var blinker = document.getElementById("blinker");
    if (blinker) {
        blinker.style.color = (
            blinker.style.color === 'red' 
                ? 'white' 
                : 'red'
        );
    }
}

function is_dark() {
    var _dark = localStorage.getItem("darkTheme");
    return (_dark === 'true');
};

function run() {
    load_navbar();
    const theme_toggle = document.getElementById('theme-toggler');
    theme_toggle.addEventListener("click", v => {
        set_theme(v); 
    });
    setInterval(blinker, 300);
    set_theme();
    // Handle back and forward button events
    router();

    var navis = document.querySelectorAll("a");
    navis.forEach(anchor => {
        anchor.addEventListener('click', handle_routing);
    });

    window.onpopstate = router;
}
run();
