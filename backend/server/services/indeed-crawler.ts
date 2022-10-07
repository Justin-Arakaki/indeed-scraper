import puppeteer from "puppeteer";
import retry from "../lib/retry";
import JobListing from "../data/JobListing";

export interface JobPageInfo {
  id: string;
  jobTitle: string;
}

export default async function startIndeedScraper(
  jobTitle: string,
  jobLocation: string,
  numPages: number
): Promise<JobListing[]> {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseUrl = 'https://www.indeed.com/';
  const encodedJobTitle = encodeURIComponent(jobTitle);
  const encodedJobLocation = encodeURIComponent(jobLocation);
  const url = `${baseUrl}jobs?q=${encodedJobTitle}&l=${encodedJobLocation}`;
  const jobListings: JobListing[] = [];

  await page.goto(url, { waitUntil: "domcontentloaded" });
  for (let i = 1; i <= numPages; i++) {
    await getJobs(page, jobListings);
    await retry(3, async () => await clickNext(page));
  }
  await Promise.all([
    page.close(),
    browser.close()
  ]);
  return jobListings;
}

async function getJobs(
  page: puppeteer.Page,
  jobListings: JobListing[]
): Promise<void> {
  const jobs = await getJobButtons(page);
  let jobDesc: string;
  for (const job of jobs) {
    await retry(1, async () => {
      console.log(job.jobTitle);
      jobDesc = await getJobDesc(page, job);
      jobListings.push({ jobTitle: job.jobTitle, jobDescription: jobDesc });
    });
  }
}

async function getJobButtons(page: puppeteer.Page): Promise<JobPageInfo[]> {
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
  job: JobPageInfo
): Promise<string> {
  const jobDescSelector = '#jobDescriptionText';
  await Promise.all([
    page.click('#' + job.id),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 })
  ]);
  try {
    return await page.$eval(jobDescSelector, el => el.innerHTML);
  } catch (e) {
    return '<div>Failed. Please try again.</div>';
  }
}

async function clickNext(page: puppeteer.Page): Promise<void> {
  const nextPageSelector = 'a[data-testid="pagination-page-next"]';
  await Promise.all([
    page.click(nextPageSelector),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 })
  ]);
}
