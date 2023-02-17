# Job Market Analyzer

A scraper for Indeed.com for job seekers to determine what technologies are in demand.

This project uses: Node.js, TSnode, Typescript, and Puppeteer

# Getting Started

Requirements: [Node.js](https://nodejs.org/) and [TSnode](https://typestrong.org/ts-node/)

1. Clone repository with `git clone git@github.com:Justin-Arakaki/job-market-analyzer.git`
2. Install dependencies with `npm install`
3. To scrape `npm run test <Job Title> <Location> <Number of Pages>`

Example: `npm run test 'web developer' 'los angeles' 5`

This will search through 5 pages on indeed and search for keywords found in test.ts

Note: Delays were added to avoid bot detection.

# Background

This is a small project that I wanted to do just for fun to practice TypeScript. This is currently fairly barebones but it does get the job done. I hope to add a frontend or possibly run it in AWS EC2 for people to run.
