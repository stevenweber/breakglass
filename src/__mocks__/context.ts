export const mock = jest.fn();
mock.mockReturnValue({
  payload: {
  },

  get repo() {
    return {
      owner: 'the-org',
      repo: 'the-repo',
    };
  },
});

export const getContext = mock;
