## Kyle Coberly's Personal Site

Dependencies:

* `node >= 10` - Because `fs.promises`
* `sassc`
* `firebase-tools`

To add speaking events, add to `data/talks.js`.

```js
[{
    slug: "this-will-be-in-url",
    title: "Title",
    date: "2018-07-01", // Any moment-parseable date format
    venue: "DenverScript",
    abstract: `
* Markdown
* Is
* Valid
    `,
    videoUrl: "https://www.youtube.com/embed/jcU7mUEmG5Q",
    links: [{
        label: "What goes on the link",
        url: "https://whereitgoes.com",
    }],
    images: [{
        altText: "Alt Text",
        url: "https://images.com/puppy.jpg",
    }, {
        altText: "Alt Text",
        url: "/assets/local-image.png",
    }],
}]
```

Scripts:

* `npm run build` - Compile site
* `npm run deploy` - Deploy to Firebase
