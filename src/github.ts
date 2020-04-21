import * as github from '@actions/github';
import { getInput } from './input';

const {
  githubToken,
  skipCILabel,
  verifiedCILabel,
} = getInput();

export const client = new github.GitHub(githubToken);
const { context } = github;
const { repository } = context.payload;
const { name, owner } = repository;
const { login } = owner;

const CLOSED = 'closed';

export const OWNER = login;
export const REPO = name;
export const REPO_SLUG = `${login}/${name}`;

export async function verifyCIChecksOnPR(number: number) {
  return labelIssue(number, verifiedCILabel);
}

export async function getPRsMissingCIChecks() {
  const { data } = await client.search.issuesAndPullRequests({
    q: [
      `repo:${REPO_SLUG}`,
      `label:${skipCILabel}`,
      `-label:${verifiedCILabel}`,
      `state:${CLOSED}`, // merged
    ].join('+'),
  });

  return data.items.filter(i => i.pull_request);
}

export async function labelIssue(number: number, label: string) {
  return client.issues.addLabels({
    owner: OWNER,
    repo: REPO,
    issue_number: number,
    labels: [
      label,
    ],
  });
}


export async function addCommentToIssue(number: number, body: string) {
  return client.issues.createComment({
    owner: OWNER,
    repo: REPO,
    issue_number: number,
    body: formatComment(body),
  });
}

function formatComment(body: string): string {
  const now = new Date().toString();
  return `${body}\n\n---\n${now}`;
}
