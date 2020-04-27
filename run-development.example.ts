// this is a stub for running one-off commands to try things out in development.
// use the .env file to customize action inputs, see readme for more details.
// usage: make run-test

import {
  getInput,
} from './src/input';

import {
  getPRsMissingCIChecks,
} from './src/github';

(async function() {
  try {
    // replace with whatever you want to take out for a test drive
    console.log({ input: getInput() });
    const prs = await getPRsMissingCIChecks();
    console.log(prs[0]);
  } catch (error) {
    console.error(error);
  }
})();
