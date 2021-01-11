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
},
{
    name: "Northwell CoVID-19 Vaccination Program: Nassau County - Lake Success",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500075",
    address: {
        name: "Lake Success/New Hyde Park",
        street: "1111 Marcus Avenue",
        city: "New Hyde Park",
        state: "NY",
        zip: "11042"
    }
}];

const events = [];

for(const site of nyGovSites){
    console.log(site);
    axios.get(site.link).then(res => {
        const $ = cheerio.load(res.data);
        const eventsWeb = $(".event-type");
        for (const event of eventsWeb){
            console.log(site.name);
            events.push( {
                name: site.name,
                link: site.link,
                address: site.address,
                date: $(event).find("div div:contains(Date):last").first().text(),
                time: $(event).find("div div:contains(Time):last").first().text(),
                available: $(event).find("button").text() !== "Event Full"
            })
        }

        const data = JSON.stringify(events, null, 2);
        const filename = path.join("data", "ny_state.json");
        fs.writeFileSync(path.resolve(filename), data);
    });
}