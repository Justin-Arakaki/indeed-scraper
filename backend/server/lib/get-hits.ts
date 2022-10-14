import _ from "lodash";
import JobListing from "../models/JobListing";

export default function getHits(jobs: JobListing[]) {
  const jobHits: string[] = [];
  for (const job of jobs) {
    jobHits.push(...job.jobHits);
  }
  return _.countBy(jobHits, (x) => x.toLowerCase());
}
