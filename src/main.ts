import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'
import request from 'request-promise-native';

function pp(obj: any): string {
  return JSON.stringify(obj, undefined, 2);
}

async function slack(hook: string, msg: string) {
  request({
    uri: hook,
    method: 'POST',
    body: {
      text: msg,
    },
    json: true
  })
}

async function run(): Promise<void> {
  try {
    const event = github.context.payload as Webhooks.WebhookPayloadLabel
    const payload = pp(event);
    if (event.action !== 'labeled') {
      core.debug(`ignoring unexpected event: ${payload}`);
      return
    }

    const token = core.getInput('github_token');
    const octokit = new github.GitHub(token);
    const issue = github.context.issue;
    const slackHook = core.getInput('slack_hook');

    core.debug(`label event received: ${payload}`);
    if (event.label.name === core.getInput('skip_ci_label')) {
      core.debug(`skip_ci_label applied`);

      await slack(slackHook, `bypassing controls - ${pp(issue)}`)

      await octokit.issues.createComment({
        owner: issue.owner,
        repo: issue.repo,
        issue_number: issue.number,
        body: `Bypassing CI checks - ${event.label.name} applied`,
      });

      const checks = await octokit.checks.listForRef({
        owner: issue.owner,
        repo: issue.repo,
        ref: github.context.ref,
      });

      core.debug(`bypassing these checks - ${pp(checks)}`);
    }

    if (event.label.name === core.getInput('skip_approval')) {
      core.debug(`skip_approval applied`);

      octokit.pulls.createReview({
        owner: issue.owner,
        repo: issue.repo,
        pull_number: issue.number,
        body: `Skipping approval for label ${event.label.name}`,
        event: 'APPROVE',
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
