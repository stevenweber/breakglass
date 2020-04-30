import * as core from '@actions/core';
// Entry point for any GitHub Actions
export async function run(): Promise<void> {
  try {
    core.debug(JSON.stringify(process.env));
  } catch (error) {
    core.setFailed(error.message);
    core.debug(error.stack);
  }
}
