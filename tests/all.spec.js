const fs = require("fs")
jest.mock("fs", () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(),
    writeFile: jest.fn().mockResolvedValue(),
    readFile: jest.fn().mockResolvedValue(),
  }
}))
const _ = expect.anything()

const {
  compileTemplate,
  makeTalkFolder,
  createTalkFile,
  writePage,
  writeTalkFile,
  writeFile,
  readFile,
  readTemplate,
  logSuccess,
  logError,
  writeTalk,
  writeTemplate,
} = require("../scripts/compile-templates")

beforeEach(() => {
  jest.clearAllMocks()
})

describe("#compileTemplate", () => {
  it("calls handlebars.compile with the given template", () => {
    const someTemplate = "<h1>{{text}}</h1>"
    const compiledString = compileTemplate(someTemplate)({ text: "Hi" })

    expect(compiledString).toBe("<h1>Hi</h1>")
  })
})

describe("#makeTalkFolder", () => {
  it("makes a talk folder", () => {
    makeTalkFolder("new-folder")

    expect(fs.promises.mkdir)
      .toHaveBeenCalledWith("dist/talks/new-folder", { recursive: true })
  })
})

describe("#createTalkFile", () => {
  it("writes a talk file", async () => {
    const template = jest.fn().mockReturnValue("Hi")
    await createTalkFile(template)({ slug: "talk", })
    expect(fs.promises.writeFile)
      .toHaveBeenCalledWith("dist/talks/talk/index.html", _, _)
  })
})

describe("#writePage", () => {
  it("writes a page", () => {
    writePage("file", "<h1>Hi</h1>")
    expect(fs.promises.writeFile)
      .toHaveBeenCalledWith("dist/file.html", "<h1>Hi</h1>", _)
  })
})

describe("#writeTalkFile", () => {
  it("writes a talk file", async () => {
    await writeTalkFile("talk-name", "<h1>hi</h1>")()
    expect(fs.promises.writeFile)
      .toHaveBeenCalledWith("dist/talks/talk-name/index.html", "<h1>hi</h1>", _)
  })
})

describe("#writeFile", () => {
  it("writes a file", async () => {
    await writeFile("talk-name", "<h1>hi</h1>")
    expect(fs.promises.writeFile)
      .toHaveBeenCalledWith("talk-name", "<h1>hi</h1>", _)
  })
})

describe("#readFile", () => {
  it("reads a file", async () => {
    await readFile("talk-name")
    expect(fs.promises.readFile)
      .toHaveBeenCalledWith("talk-name", _)
  })
})

describe("#readTemplate", () => {
  it("reads a template", async () => {
    await readTemplate("talk-name")
    expect(fs.promises.readFile)
      .toHaveBeenCalledWith("templates/talk-name.hbs", _)
  })
})

describe("#logSuccess", () => {
  it("logs a success message", () => {
    global.console.log = jest.fn()
    logSuccess()
    expect(console.log)
      .toHaveBeenCalledWith("Success!")
  })
})

describe("#logError", () => {
  it("logs an error message", () => {
    global.console.error = jest.fn()
    logError({ message: "Oops" })
    expect(console.error)
      .toHaveBeenCalledWith("Oops")
  })
})

describe("#writeTalk", () => {
  it("creates a talk folder and file", async () => {
    await writeTalk("talk-name", "<h1>Hi</h1>")
    expect(fs.promises.mkdir)
      .toHaveBeenCalledWith("dist/talks/talk-name", _)
    expect(fs.promises.writeFile)
      .toHaveBeenCalledWith("dist/talks/talk-name/index.html", "<h1>Hi</h1>", _)
  })
})
