import { Main, Crawler } from "wasm-asheux";
import "./styles.css";
import darktheme from "./images/lighttheme.svg";
import lighttheme from "./images/darktheme.svg";
import cv from "./pdfs/cv.pdf";
import artemis from './images/artemis.png';
import conscious from './images/conscious.png';
import consciousness from './pdfs/consciousness.txt';
import spider from "./images/spider.png";


// Initialize rust objects
const _home = new Main();
const crawler = new Crawler();
const import_cache = {};

function import_all(r) {
  r.keys().forEach((key) => (import_cache[key] = r(key)));
}
import_all(require.context('./articles/', true, /\.html$/));
import_all(require.context('./portfolio/', true, /\.html$/));

function _get_name() {
    var a = set_attribute("h", "navname", "a");
    a.href = "/";
    a.textContent = "Asheux ";
    var span = set_attribute("j", "blinker", "span");
    span.style.pointerEvents = "none";
    span.textContent = "? ";
    a.appendChild(span)
    var name = _home.get_name();
    writer(a, name, 100, "green");
    return a;
}

function getnavitems() {
    var div = set_attribute("others", "g", "div");
    var aas = [create_element('a'), create_element('a')];
    var rs = ['/about', '/crawler'];
    var names = ['About', 'Project Crawl'];
    for (var i = 0; i<aas.length; i++) {
        var r = rs[i];
        var name = names[i];
        var aa = aas[i]
        aa.setAttribute("id", "nav-item");
        aa.href = r.toLowerCase();
        aa.textContent = name;
        div.appendChild(aa);
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

function generic_btn(text, func, route) {
    var div = set_attribute("gbtn", "cv", "div");
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
    p.innerHTML = 'Copyright @ 2023 <a href="/">asheux.com</a> - All Rights Reserved';
    div.appendChild(p);
    footer.appendChild(div);
    return footer;
}

function set_attribute(class_name, id, el) {
    var element = create_element(el);
    element.classList.add(class_name);
    element.setAttribute("id", id);
    return element;
}

function load_navbar() {
    var main = document.getElementById("main");
    var div = set_attribute("anavbar", "anavbar-id", "div");
    // parent
    // child
    var a_div = set_attribute("container", "nav", "div");
    div.appendChild(a_div);
    // great child
    var b_div = set_attribute("home", "_home", "div");
    var a = _get_name();
    b_div.appendChild(a);
    a_div.appendChild(b_div);
    // great child 2
    var c_div = getnavitems();
    var span = get_theme_toggler();
    c_div.appendChild(span);
    a_div.appendChild(c_div);
    div.appendChild(a_div);
    main.appendChild(div);
    // parent
    var d_div = set_attribute("container", "x", "div");
    // child
    var e_div = set_attribute("l", "content", "div");
    d_div.appendChild(e_div);
    main.appendChild(d_div);
    var footer = get_footer();
    main.appendChild(footer);
}

function set_theme(e) {
    var body_color = "#17202a";
    var navbar_color = "#1c2833";
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

function writer(name_element, name, t, color) {
    var index = 0;
    var intervalId = setInterval(() => {
        if (index < name.length) {
            var letter = name[index];
            var span = create_element("span");
            span.textContent = letter;
            span.style.color = color;
            span.style.pointerEvents = "none";
            name_element.appendChild(span);
            index++
        } else {
            clearInterval(intervalId);
        }
    }, t);
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
            small.style.padding = "1px 5px 1px 5px";
            small.style.margin = "2px";
            small.style.borderRadius = "5%";
            small.style.border = "1px solid #a2d9ce";
            small.style.color = "green";
            small.style.fontSize = "14px";
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
    crawler.set_roots('reset');
    window.scrollTo(0, 0);
    var content = document.getElementById("content");
    var favs = favourite();
    content.appendChild(favs);
    var fav_code = document.getElementById('favcode');
    fetch_text_content().then(text => {
        if (text) {
            writer(favcode, text, 10, "#fff");
        }
    });
    var ul = set_attribute('v', 'links', 'ul'); 
    var s = create_element('div'); 
    s.appendChild(ul);
    s.classList.add("linksdata");
    content.appendChild(s);
    write_links(out_data); 
}

function prevent_routing(target) {
    if (target) {
        var allatags = target.getElementsByTagName('a');
        // set all external links to open in new tab
        for (let i = 0; i < allatags.length; i++) {
            let a = allatags[i];
            if (a) {
                a.target = '_blank';
                a.value = 'external';
            }
        }
    }
}

function write_about_page(out) {
    crawler.set_roots('reset');
    window.scrollTo(0, 0);
    var content = document.getElementById('content');
    content.innerHTML = out;
    var about = document.getElementById('about');   
    var view_cv = generic_btn('View CV', handle_document_view, "/view_cv");
    content.appendChild(view_cv);
    prevent_routing(about);
}

function write_project_crawl() {
    window.scrollTo(0, 0);
    var content = document.getElementById('content');
    var div = set_attribute('search', '_search', 'div');
    var h1 = create_element('h1');
    h1.textContent = "Crawl The World Wide Web";
    h1.style.textAlign = 'center';
    h1.style.color = "green";
    div.appendChild(h1);
    var input = create_element("input");
    input.type = "text";
    input.placeholder = "Add url(s) to crawl e.g xkcd.com,x.com,asheux.com ...";
    input.classList.add('searchbar');
    input.oninput = handle_change;
    var f = set_attribute("sea", "_s", "div");
    f.appendChild(input);
    var d = create_element('div');
    var btn = set_attribute("crawl", "_crawl", "button");
    var toaster = set_attribute("notshow", "snackbar", "div")
    btn.addEventListener("click", handle_crawl);
    btn.textContent = "Initiate Crawl";
    d.appendChild(btn);
    f.appendChild(d);
    div.appendChild(f);
    div.appendChild(toaster);
    var box = set_attribute("spider_box", "spdb", "div");
    var img = set_attribute("spider", "_spider", "img");
    img.src = spider;
    box.appendChild(img);
    div.appendChild(box);
    content.appendChild(div);
}

function write_article_page(out) {
    window.scrollTo(0, 0);
    var content = document.getElementById('content');
    var codes = document.getElementsByTagName('code');
    var code_color = "#ffffff";
    content.innerHTML = out;
    load_image();
    for (var code of codes) {
        code.style.color = code_color;
    }
    var article = document.getElementById('article');
    prevent_routing(article);
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
    var routes = ['/', '/about', '/crawler', "/view_cv"];
    var __func_mapper = {
        "/": write_home_page,
        "/about": write_about_page,
        "/crawler": write_project_crawl,
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
            let func = __func_mapper[route];
            var response = _home.handle_route(id);
            if (route === '/about') {
                func(import_cache['./about.html'].default);
            } else if (route === "/") {
                func(response);
            } else {
                func();
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
    var dark = localStorage.getItem("darkTheme");
    return (dark === 'true');
};

async function load_image() {
    var box = document.getElementById('image-box');
    var data = await fetch(artemis);
    var img = create_element('img');
    img.classList.add('image-box');
    img.src = artemis;
    if (box) {
        box.appendChild(img);
    }
}

function fetch_text_content() {
    return fetch(consciousness)
        .then(response => response.text())
        .then(text => text)
        .catch(
            error => console.error('Error:', error)
        );
}

function favourite() {
    var div = set_attribute('favourite', 'fav', 'div');
    var table = set_attribute('tabled', 'tabled', 'table');
    var box = set_attribute('box', '_box', 'div');
    var pre = create_element('pre');
    var code = set_attribute('ncode', 'favcode', 'code');
    pre.appendChild(code);
    box.appendChild(pre);
    var tr = create_element('tr');
    var _td = set_attribute('fixed_td', '_ftd', 'td');
    var tds = [_td, create_element('td')];
    var img_box = set_attribute('cons', 'cons', 'div');
    var img = set_attribute('img_cons', 'img_cons', 'img');
    img.src = conscious;
    img_box.appendChild(img);
    var conts = [img_box, box];
    for (let i = 0; i < tds.length; i++) {
        let td = tds[i];
        td.style.border = "none";
        let td_val = conts[i];
        td.appendChild(td_val);
        tr.appendChild(td);
    }
    table.appendChild(tr);
    div.appendChild(table);
    return div;
}

function handle_change(e) {
    var btn = document.getElementById("_crawl");
    btn.innerHTML = "Initiate Crawl";
    var { value } = e.target;
    crawler.reset();
    crawler.set_roots(value.replace(/\s/g, ''));
    crawler.init_roots();
}

async function handle_crawl(e) {
    e.preventDefault();
    var div = document.getElementById('_search');
    var box = document.getElementById('crawled');
    var spiderbox = document.getElementById("spdb"); 
    if (box) {
        box.innerHTML = "";
    } else {
        box = set_attribute("crawled", "crawled", "div"); 
    }
    var ul = set_attribute('vv', '_links', 'ul'); 
    var s = create_element('div'); 
    var loader = set_attribute("loader", "_loader", "span");
    var btn = document.getElementById("_crawl");
    btn.innerHTML = "";
    btn.appendChild(loader);
    s.appendChild(ul);
    s.classList.add("crawled_links");
    let res = await crawler.crawl(20);
    btn.innerHTML = "Initiate Crawl";
    if (res) {
        var result = res.get('result');
        var stats = crawl_stats(res);
        var errors = res.get('errors'); 
        if (result.length) {
            if (spiderbox) {
                spiderbox.style.display = "none";
            }
            btn.innerHTML = "Crawl queued links";
            div.appendChild(stats);
            result.forEach(link => {
                var li = create_element('li');
                var a = create_element('a');
                a.href = link;
                a.textContent = link;
                li.appendChild(a);
                ul.appendChild(li);
            });
            box.appendChild(ul);
            div.appendChild(box);
        } 
        if (!result.length && !errors.length) {
            errors = [
                "The domain you entered is invalid/or returned no response."
            ];
            let roots = res.get('roots');
            if (!roots.length || (roots.length === 1 && roots[0] === "")) {
                errors = ['Input is required']
            }
        }
        if (errors.length) {
            var box = document.getElementById('crawled');
            if (spiderbox) {
                spiderbox.style.display = "block";
            }
            if (box) {
                box.remove();
            }
            var toaster = document.getElementById("snackbar");
            let errmessage = errors[0];
            toaster.textContent = errmessage;
            toaster.className = "show";
            setTimeout(function() {
                toaster.className = toaster.className.replace("show", "");
            }, 3000);
        }
    }
    prevent_routing(div);
}

function crawl_stats(res) {
    var seen = res.get('seen');
    var queue = res.get('queue');
    var roots = res.get('roots');
    var total = res.get('result');
    var stats = document.getElementById("_stats");
    if (stats) {
        stats.remove();
    }
    var div = set_attribute("stats", "_stats", "div");
    var table = set_attribute("tabled", "_tabled", "table");
    div.style.border = '1px solid black';
    var tr = create_element("tr");
    var stats = [
        {'Hits': total.length},
        {'Seen': seen.length},
        {'Roots': roots.length},
        {'Queued': queue.length}
    ];
    var keys = ['Hits', 'Seen', 'Roots', 'Queued']
    for (let i = 0; i < stats.length; i++) {
        let key = keys[i]
        let vals = stats[i];
        let td = create_element("td");
        td.style.border = "none";
        td.style.color = "#f39c12";
        td.textContent = `${key}: ${vals[key]}`;
        tr.appendChild(td);
    }
    table.appendChild(tr);
    div.appendChild(table);
    return div;
}

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
