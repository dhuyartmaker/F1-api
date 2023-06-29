# F1-api
This is my project which crawling data from F1 result and create API Get. Use ExpressJs(Node v20), MongoDB.
There are all GET Api need to show on website.
If project is error when running, pls contact me. Thank you!
Zalo: 0398911205
Facebook: https://www.facebook.com/duchuy24sbtc

- [Description](#description)
- [Install](#install/notes)
- [Usage](#usage)
- [Evaluation](#evaluation)
- [API-Document](#apidocument)

## Description

- Crawling
I use fetch to website and cheerio library to get data by html tag.
I craw drivers and races data each year. With each race, I get all result remaining. So It fetch website so much time, I need a long time.

- API
I design result-race is main model. It will references to raceModel, driverModel.
Somebody want to find information of driver in specify year, they must start from result-race Model.

## Install/Notes
- Use ExpressJs(Node v20), MongoDB (v4 up).
- Create .env, src/config/config.json, src/config/dev.config.json as examples

## Usage
Crawling
- Need run at root of project
- I ran crawling and push to github data in 2022 and 2023 year. So You can only run Insert Db fast.
- Craw: (with year is from year -default is 2023, end year is default (2023)) -> If you don't give year value. Program only craw 2023 data. Reccommend only get 2023 for fast
```npx ts-node crawling/scipts.ts <<year>>```
- Insert DB:
```npx ts-node crawling/insertDriver.ts```
- Delete data DB (need to remove all data if you want to run insertDb again)
```npx ts-node crawling/removeDb.ts```

API
- Install: 
```npm install```
- Start:dev: 
```npm run dev```

## Evaluation

1. Nice:
- This project is crawling successfully!
- API get successfully!

2. Bad:
- Crawling is so slow if i increase from year. Because I save crawling data with json file. Once writing into file, I need a variable to hold all data from json file and append new crawling data.
- I think i need use csv to avoid holding big data.
- I also use "any" type.
- Maybe I miss error handling.

## APIDocument
- https://documenter.getpostman.com/view/13827204/2s93zB419p
- *replace {{F1-host}} with domain. Example: http://localhost:6000
How to use API:

All Driver:
- Api Get all drivers. 
- Query: (year: required) get all drivers in this year with total pts!

Detail result by DriverId
- Api Get result of this driver at one race on this year.
- Query: (year: required, driverId: required)

List Race by Year
- Api get result of specify race. Get by year and country when race is celebrated
- Query: (year: required, country: required)

List Qualifying / FastestLaps / PitStopSummary / StartingGrid
- Api get other result of this races. So You need give year, country to find race.
- Query: (year: required, country: required)

List Practice result
- Have 3 Practices so you need give practiceTime = 1 || 2 || 3
- Query: (year: required, country: required, practiceTime: required)

List Team by Year
- Api get Teams - which participates in year. And You can give team name to find team's result in this year.
- Query: (year: required, name: optional)
