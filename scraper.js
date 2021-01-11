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
},
{
    name: "NYS DOH Hospital/FQHC Appointment Scheduling COVID-19 at Nassau University Medical Center",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500121",
    address: {
        name: "Nassau University Medical Center",
        street: "2201 Hempstead Turnpike",
        city: "East Meadow",
        state: "NY",
        zip: "11554"
    }
},
{
    name: "Northwell CoVID-19 Vaccination Program: Nassau County - Elmont",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501190",
    address: {
        name: "NYRA/Belmont",
        street: "2150 Hempstead Turnpike",
        city: "Elmont",
        state: "NY",
        zip: "11053"
    }
},
{
    name: "FIRST DOSE - NYS DOH Hospital/FQHC Appointment Scheduling COVID-19 at Mount Sinai South Nassau",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500074",
    address: {
        name: "Mount Sinai South Nassau",
        street: "One Healthy Way",
        city: "Oceanside",
        state: "NY",
        zip: "11598"
    }
}];

const events = [];
let promises = [];

for (const site of nyGovSites) {
    promises.push(axios.get(site.link).then(res => {
        const $ = cheerio.load(res.data);
        const eventsWeb = $(".event-type");
        for (const event of eventsWeb) {
            events.push({
                name: site.name,
                link: site.link,
                address: site.address,
                date: $(event).find("div div:contains('Date:'):last").first().text(),
                time: $(event).find("div div:contains('Time:'):last").first().text(),
                available: $(event).find("button").text() !== "Event Full"
            })
        }
    }));
}

Promise.all(promises).then(() => {
    const data = JSON.stringify(events.sort(sortByProperties("date", "time", "name")), null, 2);
    const filename = path.join("data", "ny_state.json");
    fs.writeFileSync(path.resolve(filename), data);
});

function sortByProperties(property1, property2, property3) {
    return function (a, b) {
        var sort = sortByProperty(property1)(a, b);
        if (sort !== 0) {
            return sort;
        }
        sort = sortByProperty(property2)(a, b);
        if (sort !== 0) {
            return sort;
        }
        return sortByProperty(property3);
    }
}

function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;

        return 0;
    }
}