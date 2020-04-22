// wrapper to make testing simpler

import * as github from '@actions/github';

export function getContext() {
  return github.context;
}
