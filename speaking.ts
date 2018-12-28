import { flow, assign, map, orderBy, forEach } from "lodash/fp";
import * as showdown from "showdown";
import * as dayjs from "dayjs";
import * as advancedFormat from "dayjs/plugin/advancedFormat"
import { talks } from "./talks";

dayjs.extend(advancedFormat)

const $talks: any = document.querySelector("#talks");
const $talkItems: any = flow([
    processTalks,
    map(createTalkItem),
])(talks);
forEach(talk => $talks.appendChild(talk))($talkItems);

interface Talk {
    slug: string;
    title: string;
    date: string;
    venue: string;
    abstract: string;
    videoUrl: string;
    links: Link[];
    images: Image[];
}

interface Link {
    label: string;
    url: string;
}

interface Image {
    altText: string;
    url: string;
}

function markdownToHtml(markdown) {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdown);
}

function formatDate(date: string): string {
    return dayjs(date).format("MMMM Do, YYYY");
}

function processTalk(talk: Talk): Talk {
    return assign(talk)({
        abstract: markdownToHtml(talk.abstract),
        date: formatDate(talk.date),
    });
}

function processTalks(talks: Talk[]): Talk[] {
    return flow([
        orderBy(["date"], ["desc"]),
        map(processTalk),
    ])(talks);
}

function createTalkItem(talk: Talk): any {
    const $li = document.createElement("li");
    $li.innerHTML = `
<h3><a href="talks/${talk.slug}.html">${talk.title}</a></h3>
<address>${talk.venue}</address> – <time>${talk.date}</time>
`
    return $li;
}
