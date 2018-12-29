const fs = require("fs").promises;
const handlebars = require("handlebars");
const layouts = require("handlebars-layouts");
const { talks } = require("../data/talks");
const processTalks = require("./process-talks");

initialize();

async function initialize() {
    handlebars.registerHelper(layouts(handlebars));

    const layout = await fs.readFile("templates/main.hbs", "utf-8");
    handlebars.registerPartial("main", layout);

    await writeTemplate("404");
    await writeTemplate("about", { page: "about" });
    await writeTemplate("index", { page: "home" });
    await writeTemplate("speaking", { page: "speaking", talks: processTalks(talks) });
    await createTalks();
}

function createTalks() {
    return fs.readFile("templates/talk.hbs", "utf-8")
    .then(template => {
        const compiledTemplate = handlebars.compile(template);
        return processTalks(talks).map(talk => {
            return createFile(talk.slug, compiledTemplate({ page: "talk", talk }));
        });
    }).then(talkFiles => {
        return Promise.all(talkFiles)
    }).then(() => console.log("Success!"))
    .catch(error => console.error(error));
}

function writeTemplate(name, data) {
    return fs.readFile(`templates/${name}.hbs`, "utf-8").then(template => {
        return handlebars.compile(template);
    }).then(template => {
        return template(data);
    }).then(html => {
        return fs.writeFile(`dist/${name}.html`, html, "utf-8");
    }).catch(error => console.error(error));
}

function createFile(fileName, html) {
    return fs.mkdir(`dist/talks/${fileName}`, { recursive: true })
    .then(() => {
        return fs.writeFile(`dist/talks/${fileName}/index.html`, html, "utf-8");
    }).catch(error => console.error(error.message));
}
