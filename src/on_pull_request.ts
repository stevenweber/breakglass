import * as core from '@actions/core'
import * as request from 'request-promise-native';
import * as github from '@actions/github'

interface ActionInput {
  slackHook: string;
  instructions: string;
  skipApprovalLabel: string;
  skipCILabel: string;
}

/**
 * Main entry point for all pullRequest actions
 *
 * This action is responsible for removing PR checks that
 * otherwise lock the merge button in the case of an emergency.
 *
 * While removing these checks it does so through explicit labels
 * and will notify any specified slack rooms.
 */
export async function onPullRequest(octokit: github.GitHub, context, input: ActionInput) {
  const { payload } = context;
  if (payload.action === 'labeled') {
    await onLabel(octokit, context, input);
    return;
  }

  if (payload.action === 'opened') {
    await onOpen(octokit, context, input);
    return;
  }
}

/**
 * onLabel sets up the PR with a basic checklist
 */
async function onOpen(octokit: github.GitHub, context, input: ActionInput) {
  const body = input.instructions;
  await comment(
    octokit,
    context.issue,
    body
  );
}

/**
 * onLabel event checks to see if the emergency-ci or emergency-approval
 * label has been applied. In the case that either have, the corresponding
 * check will be removed and recorded.
 */
async function onLabel(octokit: github.GitHub, context, input: ActionInput) {
  const { payload, issue, ref } = context;
  const { owner, repo, number } = issue;

  core.debug(`label event received: ${pp(payload)}`);
  if (payload.label.name === input.skipCILabel) {
    core.debug(`skip_ci_label applied`);

    await slack(
      input.slackHook,
      `Bypassing CI checks for: https://github.com/${owner}/${repo}/${number}`
    )

    await comment(
      octokit,
      issue,
      `Bypassing CI checks - ${payload.label.name} applied`
    );

    const resp = await octokit.repos.listStatusesForRef({
      owner: issue.owner,
      repo: issue.repo,
      ref: payload.pull_request.head.sha
    });

    core.debug(`${pp(issue)} - ${ref} - ${pp(resp)}`);

    const reqs = resp.data.map(async (stat) => {
      return octokit.repos.createStatus({
        owner: issue.owner,
        repo: issue.repo,
        sha: payload.pull_request.head.sha,
        context: stat.context,
        state: 'success',
      });
    });

    await Promise.all(reqs);
    core.debug(`bypassing these checks - ${pp(resp)} ${pp(reqs)}`);
  }

  if (payload.label.name === input.skipApprovalLabel) {
    core.debug(`skip_approval applied`);

    await slack(
      input.slackHook,
      `Bypassing peer approval for: https://github.com/${owner}/${repo}/${number}`
    )

    await octokit.pulls.createReview({
      owner: issue.owner,
      repo: issue.repo,
      pull_number: issue.number,
      body: `Skipping approval check - ${payload.label.name} applied`,
      event: 'APPROVE'
    });
  }
}

async function comment(octokit: github.GitHub, issue, body: string) {
  await octokit.issues.createComment({
    owner: issue.owner,
    repo: issue.repo,
    issue_number: issue.number,
    body: body
  });
}

async function slack(hook: string, msg: string) {
  request({
    uri: hook,
    method: 'POST',
    body: {
      text: msg
    },
    json: true
  })
}

function pp(obj: Record<string, any>): string {
  return JSON.stringify(obj, undefined, 2);
}
