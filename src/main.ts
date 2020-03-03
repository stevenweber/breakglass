import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'

async function run(): Promise<void> {
  try {
    const event = github.context.payload as Webhooks.WebhookPayloadLabel
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(event, undefined, 2);
    core.debug(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
