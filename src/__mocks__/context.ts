export const mock = jest.fn();
mock.mockReturnValue({
  payload: {
    repository: {
      name: 'the-repo',
      owner: {
        login: 'the-org',
      },
    },
  },
});

export const getContext = mock;
