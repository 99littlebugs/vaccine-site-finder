#!/usr/bin/env node

const fs = require("fs");
const path = require('path');
const puppeteer = require('puppeteer');

const nyGovSites = [
    {
        name: "NYS DOH Hospital / FQHC Scheduling COVID-19 Sutphin Health Center",
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501251",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500075",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500121",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501190",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500074",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50502320",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501473",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50500881",
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
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50501806",
        address: {
            name: "Yes We Can Community Center",
            street: "141 Garden Street",
            city: "Westbury",
            state: "NY",
            zip: "11590"
        }
    },
    {
        name: "NYS COVID Vaccine POD - Jones Beach State Park - Field 3",
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50502584",
        address: {
            name: "Jones Beach State Park",
            street: "1901 Ocean Parkway",
            city: "Wantagh",
            state: "NY",
            zip: "11793"
        }
    },
    {
        name: "NYS COVID Vaccine POD - Westchester County Center",
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50502420",
        address: {
            name: "Westchester County Center",
            street: "198 Central Avenue",
            city: "White Plains",
            state: "NY",
            zip: "10607"
        }
    },
    {
        name: "NYS COVID Vaccine POD - Aqueduct Racetrack",
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?OpID=50503467",
        address: {
            name: "Aqueduct Racetrack - Racing Hall",
            street: "110-00 Rockaway Blvd",
            city: "Jamaica",
            state: "NY",
            zip: "11420"
        }
    },
    {
        name: "Northwell Health-GoHealth Urgent Care | Forest Hills",
        link: "https://www.clockwisemd.com/hospitals/803/appointments/schedule_visit",
        address: {
            name: "Northwell Health-GoHealth Urgent Care",
            street: "102-29 Queens Blvd",
            city: "Forest Hills",
            state: "NY",
            zip: "11375"
        }
    },
    {
        name: "Northwell Health-GoHealth Urgent Care | Syosset",
        link: "https://www.clockwisemd.com/hospitals/781/appointments/schedule_visit",
        address: {
            name: "Northwell Health-GoHealth Urgent Care",
            street: "103 Jackson Ave",
            city: "Syossett",
            state: "NY",
            zip: "11791"
        }
    },
    {
        name: "Northwell Health-GoHealth Urgent Care | Hewlett",
        link: "https://www.clockwisemd.com/hospitals/3255/appointments/schedule_visit",
        address: {
            name: "Northwell Health-GoHealth Urgent Care",
            street: "1332 Peninsula Blvd",
            city: "Hewlett",
            state: "NY",
            zip: "11557"
        }
    },
    {
        name: "Northwell Health-GoHealth Urgent Care | Riverhead",
        link: "https://www.clockwisemd.com/hospitals/1866/appointments/schedule_visit",
        address: {
            name: "Northwell Health-GoHealth Urgent Care",
            street: "1842 Old Country Road",
            city: "Riverhead",
            state: "NY",
            zip: "11901"
        }
    },
    {
        name: "01/23 FIRST DOSE Covid-19 Vaccine Westchester County Clinic",
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?DateID=10025",
        address: {
            name: "White Plains DO",
            address: "134 Court Street",
            city: "White Plains",
            state: "NY",
            zip: "10601"
        }
    },
    {
        name: "01/22 FIRST DOSE Covid-19 Vaccine Westchester County Clinic",
        link: "https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties?DateID=10021",
        address: {
            name: "White Plains DO",
            address: "134 Court Street",
            city: "White Plains",
            state: "NY",
            zip: "10601"
        }
    }
];


(async () => {
    const browser = await puppeteer.launch();
    const promises = [];
    for (const site of nyGovSites) {
        promises.push((async () => {
            site.events = [];
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75');
            await page.exposeFunction("getApproxAppointmentCount", getApproxAppointmentCount);

            // let one retry and use default timeouts of 30s
            for (let i = 0; i < 2; i++) {
                try {
                    await page.goto(site.link);
                    await waitForPageLoad(page);
                    const isSuccess = await page.$(getSucccessSelectorForSite(site.link));
                    if (isSuccess) {
                        site.events = await page.evaluate(getEventsForSite(site.link));
                        await page.close();
                        break; // if succesful, don't retry
                    }
                } catch (err) {
                    console.error(`try: [${i}] ${site.link} ${err}`);
                }
            }
        })())
    }
    await Promise.all(promises);
    await browser.close();

    const data = JSON.stringify({ sites: nyGovSites }, null, 2);
    const filename = path.join("data", "ny_state.json");
    fs.writeFileSync(path.resolve(filename), data);
})();

async function waitForPageLoad(page) {
    if (page.url().startsWith("https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties")) {
        return await page.waitForSelector("#pagetitle, h1, #notfound");
    }
    else if (page.url().startsWith("https://www.clockwisemd.com/hospitals/")) {
        // https://github.com/puppeteer/puppeteer/issues/4356
        // https://stackoverflow.com/a/61917280
        return await Promise.race([
            page.waitForSelector("#reason-and-provider-container", { visible: true }).catch(),
            page.waitForSelector(".time-selector", { visible: true }).catch(),
        ]);
    }
}

function getSucccessSelectorForSite(siteLink) {
    if (siteLink.startsWith("https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties")) {
        return "#pagetitle";
    }
    else if (siteLink.startsWith("https://www.clockwisemd.com/hospitals/")) {
        return "#available-times-table div";
    }
}

function getEventsForSite(siteLink) {
    if (siteLink.startsWith("https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties")) {
        return getEventsForNYGovSites;
    }
    else if (siteLink.startsWith("https://www.clockwisemd.com/hospitals/")) {
        return getEventsForNorthwell;
    }
}

function getApproxAppointmentCount(appointmentCount) {
    const actualAppointmentCount = parseInt(appointmentCount);
    const buckets = [0, 5, 10, 25, 50, 100, 150, 200, 250]
    for (let i = 1; i < buckets.length; i++) {
        if (actualAppointmentCount < buckets[i]) {
            return buckets[i - 1];
        }
    }
    return buckets[buckets.length - 1];
}

async function getEventsForNYGovSites() {
    const events = [];
    const eventsWeb = $(".event-type");
    for (const event of eventsWeb) {
        const isAvailable = $(event).find("button").text() !== "Event Full";
        var approxAppointmentCount = await window.getApproxAppointmentCount($(event).find("div div:contains('Appointments Available:'):last").first().text().substring(24));
        if (isAvailable && approxAppointmentCount > 0) {
            events.push({
                date: new Date($(event).find("div div:contains('Date:'):last").first().text().substring(6) + " UTC").toISOString(),
                time: $(event).find("div div:contains('Time:'):last").first().text().substring(6),
                appointments: approxAppointmentCount,
                linkId: $(event).parent().attr("id")
            });
        }
    }
    return events;
}

async function getEventsForNorthwell(){
    console.log("in northwell")
    const events = [];
    for(let i = 0; i < 5; i++) {
        const eventsWeb = $(".times-column");
        for (const event of eventsWeb) {
            const isAvailable = $(event).find(".clockwise-time").length > 0;
            var approxAppointmentCount = await window.getApproxAppointmentCount($(event).find(".clockwise-time").length);
            if (isAvailable && approxAppointmentCount > 0) {
                events.push({
                    date: new Date($(event).find(".clockwise-time").first().data("value").substring.substring(0, 10)).toISOString(),
                    time: $(event).find(".clockwise-time").first().text() + " - " +  $(event).find(".clockwise-time").last().text(),
                    appointments: approxAppointmentCount
                });
            }
        }
        $("#later-dates").click(); // week by week
    }
    return events;
}