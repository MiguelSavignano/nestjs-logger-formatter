import { myFunction } from './index';

describe('myFunction', () => {
  it(`myFunction`, async () => {
    const result = myFunction();
    expect(result).toEqual(true);
  });
});
