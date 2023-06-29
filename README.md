# F1-api
This is my project which crawling data from F1 result and create API Get. Use ExpressJs(Node v20), MongoDB.
There are all GET Api need to show on website.

# Flow
- Crawling
I use fetch to website and cheerio library to get data by html tag.
I craw drivers and races data each year. With each race, I get all result remaining. So It fetch website so much time, I need a long time.
- API
I design result-race is main model. It will references to raceModel, driverModel.
Somebody want to find information of driver in specify year, they must start from result-race Model.

# Install / Notes
- Use ExpressJs(Node v20), MongoDB (v4 up).
- Create .env, src/config/config.json, src/config/dev.config.json as examples

# Commandline

Crawling
* Need run at root of project
-Craw (with year is from year -default is 2023, end year is default (2023)) -> If you don't give year value. Program only craw 2023 data. Reccommend only get 2023 for fast
npx ts-node npx ts-node crawling/scipts.ts <<year>>
-Insert DB:
npx ts-node crawling/insertDriver.ts
-Delete data DB:
npx ts-node crawling/removeDb.ts

API
- Install: npm install
- Start:dev: npm run dev

# Evaluation
- Nice:
This project is crawling successfully!
API get successfully!
- Bad:
Crawling is so slow if i increase from year. Because I save crawling data with json file. Once writing into file, I need a variable to hold all data from json file and append new crawling data.
I think i need use csv to avoid holding big data.
I also use "any" type.

# API Document
https://documenter.getpostman.com/view/13827204/2s93zB419p
( replace {{F1-host}} with domain. Example: http://localhost:6000 )
How to use API:
1. All Driver:
- Api Get all drivers. 
-- Query: (year: required)
to get all drivers in this year with total pts!
2. Detail result by DriverId
- Api Get result of this driver at one race on this year.
- Query: (year: required, driverId: required)
3. List Race by Year
- Api get result of specify race. Get by year and country when race is celebrated
- Query: (year: required, country: required)
4. List Qualifying / FastestLaps / PitStopSummary / StartingGrid
- Api get other result of this races. So You need give year, country to find race.
- Query: (year: required, country: required)
5. List Practice result
- Have 3 Practices so you need give practiceTime = 1 || 2 || 3
- Query: (year: required, country: required, practiceTime: required)
6. List Team by Year
- Api get Teams - which participates in year. And You can give team name to find team's result in this year.
- Query: (year: required, name: optional)
