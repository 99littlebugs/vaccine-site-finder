#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require("fs");
const path = require('path');


const nyGovSites = [{
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
    },
},
{
    name: "NYS COVID Vaccine POD - JAVax - Manhattan, N.Y.",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50502320",
    address: {
        name: "JAVax Manhattan, N.Y.",
        street: "429 11th Avenue",
        city: "New York",
        state: "NY",
        zip: "10018"
    }
},
{
    name: "Northwell CoVID-19 Vaccination Program: Manhattan - Lenox Hill Hospital",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501473",
    address: {
        name: "LHH Einhorn Auditorium",
        street: "131 East 76th Street",
        city: "New York",
        state: "NY",
        zip: "10021"
    }
},
{
    name: "NC Dept. of Health at Nassau Community College CCB",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500881",
    address: {
        name: "Nassau Community College",
        street: "1 Education Drive",
        city: "Garden City",
        state: "NY",
        zip: "11530"
    }
},
{
    name: "NCDOH at Yes We Can Community Center",
    link: "https://apps.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501806",
    address: {
        name: "Yes We Can Community Center",
        street: "141 Garden Street",
        city: "Westbury",
        state: "NY",
        zip: "11590"
    }
}];

let promises = [];

for (const site of nyGovSites) {
    promises.push(axios.get(site.link).then(res => {
        site.events = [];
        const $ = cheerio.load(res.data);
        const eventsWeb = $(".event-type");
        for (const event of eventsWeb) {
            const isAvailable = $(event).find("button").text() !== "Event Full";
            if (isAvailable) {
                site.events.push({
                    date: new Date($(event).find("div div:contains('Date:'):last").first().text().substring(6) + " UTC"),
                    time: $(event).find("div div:contains('Time:'):last").first().text().substring(6),
                    appointments: $(event).find("div div:contains('Appointments Available:'):last").first().text().substring(24),
                    linkId: $(event).parent().attr("id")
                });
            }
        }
    }).catch(err => {
        console.error(err.message + ": " + err.config.url);
    }));
}

Promise.all(promises).then(() => {
    const data = JSON.stringify({ sites: nyGovSites }, null, 2);
    const filename = path.join("data", "ny_state.json");
    fs.writeFileSync(path.resolve(filename), data);
});