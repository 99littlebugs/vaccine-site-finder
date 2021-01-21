# NY State COVID-19 Vaccination :syringe: Site Tracker ![Scrape latest data](https://github.com/99littlebugs/vaccine-site-finder/workflows/Scrape%20latest%20data/badge.svg) [![Netlify Status](https://api.netlify.com/api/v1/badges/65f4d075-c9e9-4bff-be91-725909c045eb/deploy-status)](https://app.netlify.com/sites/vaccinesitefinder/deploys)

NY State vaccination appointments seem to be spread across multiple websites, making it challenging to see where appointments are available. 

This repository aims to solve that problem by aggregating the views of the many different sites to a single dashboard.

Currently focused towards Nassau, Queens, Manhattan. Open to PRs to allow further expansion.

## How to:
Setup: 
```
npm install
```

Run scraper: 
```
npm run scraper
```

Build website: 
```
npm run build
```


## `//TODO:` :white_check_mark:
Pull requests are welcome!
1. Add all the NY state individual sites
   * Will require searching or county filtering
1. Maybe parse the addresses/location information dynamically
   * now the added benefit is that site doesn't need to be up for us to show the info
1. Add more private sign up websites (along with parsers to go with them)
1. Add a field on the website showing when data was last refreshed and when it is expected to be refreshed again?

## Inspiration and attribution :pray:
* https://github.com/sw-yx/gh-action-data-scraping
* https://simonwillison.net/2020/Oct/9/git-scraping/
* https://medium.com/javascript-in-plain-english/cheerio-script-for-turning-html-pages-into-json-files-8e9363106904
* http://getskeleton.com/
* https://www.iconfinder.com/icons/5991794/coronavirus_cure_injection_needle_vaccination_vaccine_icon
