const { flow, assign, map, orderBy, forEach } = require("lodash/fp");
const showdown = require("showdown");
const dayjs = require("dayjs");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat)

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

module.exports = processTalks;
