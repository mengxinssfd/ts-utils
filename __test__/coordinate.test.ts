import * as cd from "../src/coordinate";

test("isPointInPath", () => {
    expect(cd.isPointInPath([1, 2], [[0, 0], [2, 4]])).toBe(true);
    expect(cd.isPointInPath([2, 2], [[0, 0], [2, 4]])).toBe(false);

    expect(cd.isPointInPath([2, 2], [[0, 0], [4, 4]])).toBe(true);
    expect(cd.isPointInPath([1, 2], [[0, 0], [4, 4]])).toBe(false);

    expect(cd.isPointInPath([3, 3], [[1, 1], [4, 4]])).toBe(true);
});

