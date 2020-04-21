// when a pr has bypassed ci checks, this goes back to mark that master become green at some point after,
// i.e. that a broken app isn't sitting in production

import {
  addCommentToIssue,
  getPRsMissingCIChecks,
  verifyCIChecksOnPR,
} from './github';

import {
  fetchMostRecentGreenWorkflow,
  generateLinkToGreenWorkflow,
} from './circle_ci';

export async function retroactivelyMarkPRsWithGreenBuilds() {
  const pullRequests = await getPRsMissingCIChecks();
  if (!pullRequests.length) return;

  const workflow = await fetchMostRecentGreenWorkflow();
  const wentGreenAt = workflow.created_at;
  const link = generateLinkToGreenWorkflow(workflow);
  const message = `Code from this PR has passed CI checks.\n\n${link}`;

  await pullRequests.forEach(async (pullRequest) => {
    const { closed_at, number } = pullRequest;
    if (new Date(closed_at) > new Date(wentGreenAt)) return;

    await addCommentToIssue(number, message);
    await verifyCIChecksOnPR(pullRequest.number);
  });
}
