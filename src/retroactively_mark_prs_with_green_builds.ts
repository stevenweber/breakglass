// when a pr has bypassed ci checks, this goes back to mark that master become green at some point after,
// i.e. that a broken app isn't sitting in production

import {
  addCommentToIssue,
  getPRsMissingCIChecks,
  getStatusOfMaster,
  tagCIChecksOnPR,
} from './github';

const SUCCESS = 'success';

export async function retroactivelyMarkPRsWithGreenBuilds() {
  const pullRequests = await getPRsMissingCIChecks();
  if (!pullRequests.length) return;

  const { state, sha } = await getStatusOfMaster();
  if (state !== SUCCESS) return;

  const message = `Code from this PR has passed all checks.\n\n${sha}`;

  await pullRequests.forEach(async (pullRequest) => {
    const { number } = pullRequest;
    await addCommentToIssue(number, message);
    await tagCIChecksOnPR(pullRequest.number);
  });
}
