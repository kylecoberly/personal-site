const fs = require("fs").promises
const handlebars = require("handlebars")
const layouts = require("handlebars-layouts")
const { talks } = require("../data/talks")
const processTalks = require("./process-talks")

async function initialize() {
    handlebars.registerHelper(layouts(handlebars))

    const layout = await readFile("templates/main.hbs")
    handlebars.registerPartial("main", layout)

    Promise.all([
      writeTemplate("404"),
      writeTemplate("about", { page: "about", isAbout: true }),
      writeTemplate("index", { page: "home" }),
      writeTemplate("speaking", { page: "speaking", talks: processTalks(talks), isSpeaking: true }),
      createTalks(talks),
    ]).catch(logError)
}

function createTalks(talks) {
  return readFile("templates/talk.hbs")
    .then(applyTalksToTemplates(talks))
    .then(Promise.all)
    .then(logSuccess)
    .catch(logError)
}

function applyTalksToTemplates(talks){
  return template => processTalks(talks).map(createTalkFile(compileTemplate(template)))
}

function writeTemplate(name, data) {
  return readTemplate(name)
    .then(compileTemplate)
    .then(template => template(data))
    .then(html => writePage(name, html))
    .catch(logError)
}

function writeTalk(fileName, html) {
  return makeTalkFolder(fileName)
    .then(writeTalkFile(fileName, html))
    .catch(logError)
}

function logError(error){
  return console.error(error.message)
}

function logSuccess(){
  return console.log("Success!")
}

function readFile(fileName){
  return fs.readFile(fileName, "utf-8")
}

function readTemplate(templateName){
  return readFile(`templates/${templateName}.hbs`)
}

function writeFile(fileName, content){
  return fs.writeFile(fileName, content, "utf-8")
}

function writeTalkFile(folderName, html){
  return () => writeFile(`dist/talks/${folderName}/index.html`, html)
}

function writePage(fileName, html){
  return writeFile(`dist/${fileName}.html`, html)
}

function makeTalkFolder(folderName){
  return fs.mkdir(`dist/talks/${folderName}`, { recursive: true })
}

function compileTemplate(template){
  return handlebars.compile(template)
}

function createTalkFile(compiledTemplate){
  return talk => writeTalk(
    talk.slug,
    compiledTemplate({ page: "talk", talk }),
  )
}

module.exports = {
  initialize,
  compileTemplate,
  makeTalkFolder,
  createTalkFile,
  writePage,
  writeTalkFile,
  writeFile,
  readFile,
  readTemplate,
  logError,
  logSuccess,
  writeTalk,
  writeTemplate,
}
