// tests/isTransitionAllowed.test.js
const { isTransitionAllowed } = require("../routes/todos")

describe('isTransitionAllowed', () => {
  it('should allow transition from TODO to ONGOING', () => {
    expect(isTransitionAllowed('TODO', 'ONGOING')).toBe(true);
  });

  it('should not allow transition from TODO to DONE', () => {
    expect(isTransitionAllowed('TODO', 'DONE')).toBe(false);
  });

  it('should allow transition from ONGOING to DONE', () => {
    expect(isTransitionAllowed('ONGOING', 'DONE')).toBe(true);
  });

  it('should allow transition from ONGOING to TODO', () => {
    expect(isTransitionAllowed('ONGOING', 'TODO')).toBe(true);
  });

  it('should allow transition from DONE to ONGOING', () => {
    expect(isTransitionAllowed('DONE', 'ONGOING')).toBe(true);
  });

  // Optionally, test for an invalid currentState
  it('should throw or return false for an unknown current state', () => {
    // Depending on your implementation, this might throw an error or return false.
    // For our current implementation, it would throw an error since undefined.includes is called.
    expect(() => isTransitionAllowed('UNKNOWN', 'ONGOING')).toThrow();
  });
});
