import * as nock from 'nock';
nock.disableNetConnect()

import { onPullRequest } from '../src/on_pull_request';
import * as github from '@actions/github'

nock('https://api.github.com').log(console.log)

const ghClient = new github.GitHub('foozles');
const input = {
  slackHook: 'https://foo.slack/hook',
  instructions: 'this is how we pr',
  skipApprovalLabel: 'emergency-approval',
  skipCILabel: 'emergency-ci',
}

describe('pull request actions', () => {
  afterEach(() => {
    expect(nock.isDone());
  });

  test('on open', async () => {
    let body;

    nock('https://api.github.com')
      .post('/repos/github/my-repo/issues/12/comments', (req) =>  {
        body = req;
        return true;
      }).reply(200, 'way to go');

    await onPullRequest(
      ghClient,
      {
        payload: { action: 'opened' },
        issue: { owner: 'github', repo: 'my-repo', number: 12 },
        ref: 'f123',
      },
      input,
    );

    expect(body).toEqual({ body: 'this is how we pr' });
  });

  describe('on label', () => {
    let slackMsg;

    beforeEach(() => {
      nock('https://foo.slack/')
        .post('/hook', (req) =>  {
          slackMsg = req;
          return true;
        }).reply(200, 'way to go');
    });

    test('on label emergency-approval', async () => {
      let ghReviewBody;

      const ghApprovalReq = nock('https://api.github.com/')
        .post('/repos/github/my-repo/pulls/12/reviews', (req) =>  {
          ghReviewBody = req;
          return true;
        }).reply(200, 'way to go');

      await onPullRequest(
        ghClient,
        {
          payload: { action: 'labeled', label: { name: 'emergency-approval' } },
          issue: { owner: 'github', repo: 'my-repo', number: 12 },
          ref: 'f123',
        },
        input,
      );

      expect(ghReviewBody).toEqual({
        body: 'Skipping approval check - emergency-approval applied',
        event: 'APPROVE',
      });
    });

    it('on label emergency-ci', async () => {
      let ghCommentBody;
      let checkUpdateBody;

      const ghCommentReq = nock('https://api.github.com')
        .post('/repos/github/my-repo/issues/12/comments', (req) =>  {
          ghCommentBody = req;
          return true;
        }).reply(200, 'way to go');

      const ghChecksReq = nock('https://api.github.com')
        .get('/repos/github/my-repo/commits/f123/statuses')
        .reply(200, [
          {
            url: 'https://api.github.com/repos/reverbdotcom/reverb/statuses/cab52f57fe248be607097096ee9cb1900e039df6',
            context: 'circle-ci rspec',
            state: 'failure',
          },
          {
            url: 'https://api.github.com/repos/reverbdotcom/reverb/statuses/cab52f57fe248be607097096ee9cb1900e039df6',
            context: 'circle-ci js',
            state: 'failure',
          },
        ]);

      const ghChecksUpdate = nock('https://api.github.com')
        .post('/repos/github/my-repo/statuses/cab52f57fe248be607097096ee9cb1900e039df6', (req) => {
          checkUpdateBody = req;
          return true;
        })
        .reply(200, 'okay!')
        .post('/repos/github/my-repo/statuses/cab52f57fe248be607097096ee9cb1900e039df6')
        .reply(200, 'okay!')

      await onPullRequest(
        ghClient,
        {
          payload: { action: 'labeled', label: { name: 'emergency-ci' } },
          issue: { owner: 'github', repo: 'my-repo', number: 12 },
          ref: 'f123',
        },
        input,
      );

      expect(checkUpdateBody).toEqual({ context: 'circle-ci rspec', state: 'success' });
      expect(ghCommentBody).toEqual({ body: 'Bypassing CI checks - emergency-ci applied' });
      expect(slackMsg).toEqual({
        text: 'Bypassing CI checks for: https://github.com/github/my-repo/12'
      });
    });
  });
});
