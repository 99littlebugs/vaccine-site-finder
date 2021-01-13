const handlebars = require('handlebars');
const fs = require("fs");
const path = require('path');

handlebars.registerHelper('date', function (date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-us', options);
});

const template = handlebars.compile(fs.readFileSync(path.join("site", "index.hbs")).toString('utf8'));
const data = JSON.parse(fs.readFileSync(path.join("data", "ny_state.json")));

const events = [];
const sites = [];

for (const site of data.sites) {
    for (const event of site.events) {
        event.site = site;
        delete event.site.events;
        events.push(event);
    }

    delete site.events;
    sites.push(site);
}

fs.writeFileSync(path.join("site", "index.html"), template({ sites: sites.sort(sortByProperty("name")), events: events.sort(sortByProperty("date")) }));

function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;

        return 0;
    }
}