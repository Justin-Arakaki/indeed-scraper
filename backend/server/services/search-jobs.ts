import JobListing from "../data/JobListing";
import JobResult from "../data/JobResult";

export default function searchJobListing(
  jobListings: JobListing[],
  keyWords: string[]
): JobResult[] {
  const regex = new RegExp(keyWords.join('|'), 'gi');
  const jobResults: JobResult[] = [];

  for (let i = 0; i < jobListings.length; i++) {
    const found = jobListings[i].jobDescription.match(regex);
    jobResults.push({
      jobTitle: jobListings[i].jobTitle,
      jobHit: found
    });
  }
  return jobResults;
}
