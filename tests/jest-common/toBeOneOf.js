expect.extend({
  toBeOneOf(received, items) {
    const pass = items.includes(received);

    return {
      pass,
      message: () => `expected ${received} to be one of [${items.join(', ')}]`,
    };
  },
});
