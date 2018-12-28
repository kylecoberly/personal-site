const Handlebars = require("handlebars");
const fs = require("fs");
const { talks } = require("./talks");

const { flow, assign, map, orderBy, forEach } = require("lodash/fp");
const showdown = require("showdown");
const dayjs = require("dayjs");
const advancedFormat = require("dayjs/plugin/advancedFormat");

dayjs.extend(advancedFormat)

const layout = `
<!doctype html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/reset.css">
        <link rel="stylesheet" type="text/css" href="/app.css">
        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <div id="talk">
            <header>
                <h1><a href="/">Kyle Coberly</a></h1>
                <p id="tagline">Educator, business dork, software developer</p>
                <ul id="links">
                    <li><a href="/speaking.html">Speaking</a></li>
                    <li><a href="https://medium.com/@kyle.coberly" target="_BLANK">Writing</a></li>
                    <li><a href="/about.html">About</a></li>
                <ul>
            </header>
            <main>
                <div class="content-wrapper">
                    <h2>{{title}}</h2>
                    <address>{{venue}}</address> – <time>{{date}}</time>
                    <div class="abstract">{{{abstract}}}</div>
                    {{#if links}}
                        <h3>Links</h3>
                        <ul class="links">
                            {{#each links}}
                                <li><a href="{{url}}">{{label}}</a></li>
                            {{/each}}
                        </ul>
                    {{/if}}
                    {{#if videoUrl}}
                        <div class="video-container">
                            <iframe src="{{videoUrl}}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    {{/if}}
                    {{#if images}}
                        <ul class="images">
                            {{#each images}}
                                <li><img src="{{url}}" alt="{{altText}}" /></li>
                            {{/each}}
                        </ul>
                    {{/if}}
                </div>
            </main>
            <footer>
                <ul id="social">
                    <li><a href="https://www.linkedin.com/in/kylecoberly" target="_BLANK"><i class="fa fa-linkedin"></i></a></li>
                    <li><a href="https://github.com/kylecoberly" target="_BLANK"><i class="fa fa-github"></i></a></li>
                    <li><a href="https://github.com/kylecoberly/knowledge/wiki" target="_BLANK"><i class="fa fa-book"></a></i></li>
                    <li><a href="https://twitter.com/kylecoberly?lang=en" target="_BLANK"><i class="fa fa-twitter"></a></i></li>
                </ul>
            </footer>
        </div>
    </body>
</html>
`;

const template = Handlebars.compile(layout);

const talkFiles = processTalks(talks).map(talk => {
    return createFile(talk.slug, template(talk));
})

Promise.all(talkFiles)
    .then(() => console.log("Success!"))
    .catch(error => console.error(error));

function createFile(fileName, html) {
    return new Promise((success, reject) => {
        try {
            fs.writeFile(`talks/${fileName}.html`, html, "utf-8", success);
        } catch (error) {
            reject(error.message);
        }
    })
}

function markdownToHtml(markdown) {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdown);
}

function formatDate(date) {
    return dayjs(date).format("MMMM Do, YYYY");
}

function processTalk(talk) {
    return assign(talk)({
        abstract: markdownToHtml(talk.abstract),
        date: formatDate(talk.date),
    });
}

function processTalks(talks) {
    return flow([
        orderBy(["date"], ["desc"]),
        map(processTalk),
    ])(talks);
}
