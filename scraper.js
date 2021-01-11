#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require("fs");
const path = require('path');


var nyGovSites = [{
    name: "NYS DOH Hospital / FQHC Scheduling COVID-19 Sutphin Health Center",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501251",
    address: {
        name: "Sutphin Health Center",
        street: "105-04 Sutphin Boulevard",
        city: "Queens",
        state: "NY",
        zip: "11435"
    }
}];


axios.get(nyGovSites[0].link).then(res => {
    const $ = cheerio.load(res.data);
    const eventsWeb = $(".event-type");
    const events = [];
    eventsWeb.each((i, element) => {
        events[i] = {
            name: nyGovSites[0].name,
            link: nyGovSites[0].link,
            address: nyGovSites[0].address,
            date: $(element).find("div div:contains(Date):last").first().text(),
            time: $(element).find("div div:contains(Time):last").first().text(),
            available: $(element).find("button").text() !== "Event Full"
        }
    });
    
    const data = JSON.stringify(events, null, 2);
    const filename = path.join("data", "ny_state.json");
    fs.writeFileSync(path.resolve(filename), data);
});