import getIndeedJobListings from "./backend/server/services/indeed-crawler";
import getHits from "./backend/server/lib/get-hits";

const title = process.argv[2];
const location = process.argv[3];
const pages = parseInt(process.argv[4]);
const keywords = [
  'node',
  'angular',
  'react',
  'vue',
  'express',
  'rails',
  'jquery',
  'ec2',
  'aws',
  'rds',
  's3',
  'vpc',
  'graphql',
  'nosql',
  'mongodb',
  'wordpress',
  'mysql',
  'typescript',
  'sql',
  'postgres',
  'bash',
  'wsl',
  'git',
  'shell'
]
const jobs = await getIndeedJobListings(title, location, pages, keywords);
const hits = getHits(jobs);

await console.log(hits, 'out of', jobs.length);
