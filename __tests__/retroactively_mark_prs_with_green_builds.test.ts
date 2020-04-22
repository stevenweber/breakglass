jest.mock('../src/input');
jest.mock('../src/github');

import { mocked } from 'ts-jest/utils';

import {
  retroactivelyMarkPRsWithGreenBuilds,
} from '../src/retroactively_mark_prs_with_green_builds';

import {
  addCommentToIssue,
  getPRsMissingCIChecks,
  tagCIChecksOnPR,
  getStatusOfMaster,
} from '../src/github';

describe('::retroactivelyMarkPRsMissingCIChecks', () => {
  describe('with merged prs that have ci check overrides', () => {
    let pullRequest;

    beforeEach(() => {
      pullRequest = {
        number: 12,
        closed_at: new Date().toISOString(),
      };
      mocked(getPRsMissingCIChecks).mockResolvedValue([pullRequest]);
    });

    describe('with master that has passed all checks', () => {
      beforeEach(() => {
        mocked(getStatusOfMaster).mockResolvedValue({
          state: 'success',
          sha: 'the-sha',
        } as any);
      });

      it('adds comment to pr', async () => {
        await retroactivelyMarkPRsWithGreenBuilds();
        expect(addCommentToIssue).toHaveBeenCalledWith(pullRequest.number, expect.stringMatching(/passed all checks/i));
      });

      it('tags pr', async () => {
        await retroactivelyMarkPRsWithGreenBuilds();
        expect(tagCIChecksOnPR).toHaveBeenCalledWith(pullRequest.number);
      });
    });

    describe('without master that has passed all checks', () => {
      beforeEach(() => {
        mocked(getStatusOfMaster).mockResolvedValue({
          state: 'pending',
          sha: 'the-sha',
        } as any);
      });

      it('does nothing', async () => {
        await retroactivelyMarkPRsWithGreenBuilds();
        expect(tagCIChecksOnPR).not.toHaveBeenCalled();
        expect(addCommentToIssue).not.toHaveBeenCalled();
      });
    });
  });
});
