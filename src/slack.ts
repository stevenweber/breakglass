import * as request from 'request-promise-native';
import * as core from '@actions/core';

const hook = core.getInput('slack_hook', {
  required: false,
});

export async function postMessage(text: string) {
  request({
    uri: hook,
    method: 'POST',
    body: {
      text,
    },
    json: true,
  });
}
