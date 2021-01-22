#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const locations = JSON.parse(fs.readFileSync(path.join('data', 'locations.json')).toString('utf8'));

(async () => {
    const browser = await puppeteer.launch();
    const promises = [];
    for (const site of locations.sites) {
        promises.push((async () => {
            site.events = [];
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75');
            await page.exposeFunction('getApproxAppointmentCount', getApproxAppointmentCount);

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

    const data = JSON.stringify({ sites: locations.sites }, null, 2);
    const filename = path.join('data', 'ny_state.json');
    fs.writeFileSync(path.resolve(filename), data);
})();

async function waitForPageLoad(page) {
    if (page.url().startsWith('https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties')) {
        return await page.waitForSelector('#pagetitle, h1, #notfound');
    }
    else if (page.url().startsWith('https://www.clockwisemd.com/hospitals/')) {
        // https://github.com/puppeteer/puppeteer/issues/4356
        // https://stackoverflow.com/a/61917280
        return await Promise.race([
            page.waitForSelector('#reason-and-provider-container', { visible: true }).catch(),
            page.waitForSelector('.time-selector', { visible: true }).catch(),
        ]);
    }
}

function getSucccessSelectorForSite(siteLink) {
    if (siteLink.startsWith('https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties')) {
        return '#pagetitle';
    }
    else if (siteLink.startsWith('https://www.clockwisemd.com/hospitals/')) {
        return '#available-times-table div';
    }
}

function getEventsForSite(siteLink) {
    if (siteLink.startsWith('https://apps3.health.ny.gov/doh2/applinks/cdmspr/2/counties')) {
        return getEventsForNYGovSites;
    }
    else if (siteLink.startsWith('https://www.clockwisemd.com/hospitals/')) {
        return getEventsForNorthwell;
    }
}

function getApproxAppointmentCount(appointmentCount) {
    const actualAppointmentCount = parseInt(appointmentCount);
    const buckets = [0, 5, 10, 25, 50, 100, 150, 200, 250, 300]
    for (let i = 1; i < buckets.length; i++) {
        if (actualAppointmentCount < buckets[i]) {
            return buckets[i - 1];
        }
    }
    return buckets[buckets.length - 1];
}

async function getEventsForNYGovSites() {
    const events = [];
    const eventsWeb = $('.event-type');
    for (const event of eventsWeb) {
        const isAvailable = $(event).find('button').text() !== 'Event Full';
        var approxAppointmentCount = await window.getApproxAppointmentCount($(event).find('div div:contains("Appointments Available:"):last').first().text().substring(24));
        if (isAvailable && approxAppointmentCount > 0) {
            events.push({
                date: new Date($(event).find('div div:contains("Date:"):last').first().text().substring(6) + ' UTC').toISOString(),
                time: $(event).find('div div:contains("Time:"):last').first().text().substring(6),
                appointments: approxAppointmentCount,
                linkId: $(event).parent().attr('id')
            });
        }
    }
    return events;
}

async function getEventsForNorthwell(){
    const events = [];
    for(let i = 0; i < 5; i++) {
        const eventsWeb = $('.times-column');
        for (const event of eventsWeb) {
            const isAvailable = $(event).find('.clockwise-time').length > 0;
            var approxAppointmentCount = await window.getApproxAppointmentCount($(event).find('.clockwise-time').length);
            if (isAvailable && approxAppointmentCount > 0) {
                events.push({
                    date: new Date($(event).find('.clockwise-time').first().data('value').substring.substring(0, 10)).toISOString(),
                    time: $(event).find('.clockwise-time').first().text() + ' - ' +  $(event).find('.clockwise-time').last().text(),
                    appointments: approxAppointmentCount
                });
            }
        }
        $('#later-dates').click(); // week by week
    }
    return events;
}