import { getDirectoryTreeFromNodes } from './getDirectoryTreeFromNodes';

describe.only('getDirectoryTreeFromNodes', () => {
  it('returns the correct value', async () => {
    const structure = await getDirectoryTreeFromNodes([
      {
        path: 'foo/one/one',
        name: '@scope/foo-one-one',
        data: { type: 'REACT' },
      },
      {
        path: 'foo/one/two',
        name: '@scope/foo-one-two',
        data: { type: 'REACT' },
      },
      {
        path: 'foo/two/one',
        name: '@scope/foo-two-one',
        data: { type: 'REACT' },
      },
      {
        path: 'foo/bar',
        name: '@scope/foo-bar',
        data: { type: 'REACT' },
      },
    ]);

    expect(structure).toEqual({
      label: 'root',
      path: '/',
      children: [
        {
          label: 'foo',
          path: 'foo',
          children: [
            {
              label: 'one',
              path: 'foo/one',
              children: [
                {
                  label: 'one',
                  path: 'foo/one/one',
                  children: [
                    {
                      label: '@scope/foo-one-one',
                      data: { type: 'REACT' },
                      children: [],
                    },
                  ],
                },
                {
                  label: 'two',
                  path: 'foo/one/two',
                  children: [
                    {
                      label: '@scope/foo-one-two',
                      data: { type: 'REACT' },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              label: 'two',
              path: 'foo/two',
              children: [
                {
                  label: 'one',
                  path: 'foo/two/one',
                  children: [
                    {
                      label: '@scope/foo-two-one',
                      data: { type: 'REACT' },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              label: 'bar',
              path: 'foo/bar',
              children: [
                {
                  label: '@scope/foo-bar',
                  data: { type: 'REACT' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    });

    // expect(tree.children[0]).toEqual(
    //   expect.objectContaining({
    //     name: 'foo',
    //     path: 'foo',
    //   })
    // );

    // expect(tree.children[0].children[0]).toEqual(
    //   expect.objectContaining({
    //     name: 'one',
    //     path: 'foo/one',
    //   })
    // );
  });
});
