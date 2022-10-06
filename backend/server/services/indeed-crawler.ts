import puppeteer from "puppeteer";
import retry from "../lib/retry";

const jobTitle = 'web+developer'
const jobLocation = 'buena+park+ca'

startIndeedScraper(jobTitle, jobLocation);

interface JobListing {
  jobTitle: string;
  jobDescription: string;
}

interface JobInfo {
  id: string;
  jobTitle: string;
}

async function startIndeedScraper(jobTitle: string, jobLocation: string) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseUrl = 'https://www.indeed.com/';
  const url = baseUrl + 'jobs?q=' + jobTitle + '&l=' + jobLocation;
  const jobListings: JobListing[] = [];

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await getJobs(page, jobListings);
  console.log(jobListings);
  await page.close();
  await browser.close();
}

async function getJobs(
  page: puppeteer.Page,
  jobListings: JobListing[]
): Promise<void> {
  const jobs = await getJobButtons(page);
  let jobDesc: string;
  for (const job of jobs) {
    await retry(5, async () => {
      jobDesc = await getJobDesc(page, job);
      console.log('here');
      jobListings.push({
        jobTitle: job.jobTitle,
        jobDescription: jobDesc
      });
    });
  }
}

async function getJobButtons(page: puppeteer.Page): Promise<JobInfo[]> {
  const jobTitlesSelector = '.jobTitle > a';
  return await page.$$eval(jobTitlesSelector, a => {
    return a.map(x => ({
      id: x.id,
      jobTitle: (x.children[0] as HTMLElement).innerText
    }));
  });
}

async function getJobDesc(
  page: puppeteer.Page,
  job: JobInfo
): Promise<string> {
  const jobDescSelector = '#jobDescriptionText';
  await page.click('#' + job.id);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  try {
    return await page.$eval(jobDescSelector, el => el.innerHTML);
  } catch (e) {
    return '<div>Failed. Please try again.</div>';
  }
}
