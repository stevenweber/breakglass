import * as core from '@actions/core'
import * as github from '@actions/github'
import { onPullRequest } from './on_pull_request';


/**
 * Entry point for GitHub Actions for any pull_request event
 *
 * This runner will apply the inputs, and run the onPullRequestEvent
 * handler.
 *
 * We've split these up for easier unit testing.
 */
async function run(): Promise<void> {
  const input = {
    slackHook: core.getInput('slack_hook'),
    instructions: core.getInput('instructions'),
    skipApprovalLabel: core.getInput('skip_approval_label'),
    skipCILabel: core.getInput('skip_ci_label')
  }

  const octokit = new github.GitHub(core.getInput('github_token'));

  try {
    onPullRequest(
      octokit,
      github.context,
      input,
    )
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
