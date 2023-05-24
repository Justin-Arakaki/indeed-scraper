import puppeteer from 'puppeteer';
import retry from '../lib/retry';
import JobListing from '../models/JobListing';
import searchKeywords from '../lib/search';
import wait from '../lib/wait';

export interface PageInfo {
	id: string;
	jobTitle: string;
}

export default async function getIndeedJobListings(
	jobTitle: string,
	jobLocation: string,
	numPages: number,
	keywords: string[]
): Promise<JobListing[]> {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	const url = createSearchUrl(jobTitle, jobLocation);
	const jobListings: JobListing[] = [];

	console.log('start');
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	// for (let i = 1; i <= numPages; i++) {
	// 	await getJobs(page, jobListings, keywords);
	// 	await retry(1, async () => {
	// 		console.log('--Next Page--');
	// 		await clickNext(page);
	// 	});
	// }
	// await Promise.all([page.close(), browser.close()]);
	return jobListings;
}

function createSearchUrl(jobTitle: string, jobLocation: string): string {
	const baseUrl = 'https://www.indeed.com/';
	const encodedJobTitle = encodeURIComponent(jobTitle);
	const encodedJobLocation = encodeURIComponent(jobLocation);
	return `${baseUrl}jobs?q=${encodedJobTitle}&l=${encodedJobLocation}`;
}

async function getJobs(
	page: puppeteer.Page,
	jobListings: JobListing[],
	keywords: string[]
): Promise<void> {
	const jobs = await getJobButtons(page);
	let jobDesc: string;
	for (const job of jobs) {
		await retry(2, async () => {
			console.log(job.jobTitle);
			jobDesc = await getJobDesc(page, job);
			const jobHits = searchKeywords(jobDesc, keywords);
			jobListings.push({
				jobTitle: job.jobTitle,
				jobDescription: jobDesc,
				jobHits,
			});
		});
	}
}

async function getJobButtons(page: puppeteer.Page): Promise<PageInfo[]> {
	const jobTitlesSelector = '.jobTitle > a';
	return await page.$$eval(jobTitlesSelector, a => {
		return a.map(x => ({
			id: x.id,
			jobTitle: (x.children[0] as HTMLElement).innerText,
		}));
	});
}

async function getJobDesc(
	page: puppeteer.Page,
	job: PageInfo
): Promise<string> {
	const jobDescSelector = '#jobDescriptionText';
	await Promise.all([
		wait(2100),
		page.click('#' + job.id),
		page.waitForNavigation({ timeout: 2000 }),
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
		wait(2000),
		page.click(nextPageSelector),
		page.waitForNavigation({ timeout: 10000 }),
	]);
}
