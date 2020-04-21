// see action.yml for more details
import * as core from '@actions/core';

export interface Input {
  CIToken: string;
  CIWorkflow: string;
  githubToken: string;
  instructions: string;
  requiredChecks: string[];
  skipApprovalLabel: string;
  skipCILabel: string;
  slackHook: string;
  verifiedCILabel: string;
}

export function getInput(): Input {
  return {
    CIToken: core.getInput('ci_token', {
      required: true,
    }),
    CIWorkflow: core.getInput('ci_workflow', {
      required: true,
    }),
    githubToken: core.getInput('github_token', {
      required: true,
    }),
    instructions: core.getInput('instructions'),
    requiredChecks: core.getInput('required_checks', {
      required: true,
    }).split(','),
    skipApprovalLabel: core.getInput('skip_approval_label'),
    skipCILabel: core.getInput('skip_ci_label'),
    slackHook: core.getInput('slack_hook', {
      required: true,
    }),
    verifiedCILabel: core.getInput('verify_ci_label'),
  };
}
