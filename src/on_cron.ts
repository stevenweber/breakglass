import * as core from '@actions/core';
import * as request from 'request-promise-native';
import * as github from '@actions/github';
import { Input } from './input';

export async function onCron(octokit: github.GitHub, context, input: Input) {
  const { payload } = context;
  await reportPullRequests(octokit, context, input);
  return;
}

async function reportPullRequests(octokit: github.GitHub, context, input: Input) {
  await octokit.


}
