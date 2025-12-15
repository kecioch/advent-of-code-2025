//
//   Advent of Code - Day 04
//   Part A & B
//   Author: Kevin Cioch
//

import { readFileSync } from "fs";

function printGrid(grid: string[][]) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function readTextFile(path: string) {
  const data = readFileSync(path, "utf-8");

  const grid = data
    .replace(/\r/g, "")
    .trim()
    .split("\n")
    .map((row) => row.split(""));

  return grid;
}

function forkliftCheck_A(inputGrid: string[][]): [number, string[][]] {
  const rtnGrid = inputGrid.map((el) => [...el]);

  const directionOffsets: Array<[number, number]> = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // iterate through every char in every row
  let accessableRollsCnt = 0;
  for (let row = 0; row < inputGrid.length; row++) {
    for (let char = 0; char < inputGrid[row]!.length; char++) {
      if (inputGrid[row]![char] !== PAPER_ROLL_SYMBOL) continue;

      let neighbourCnt = 0;

      // check each direction
      for (const [offsetRow, offsetChar] of directionOffsets) {
        const checkRowPos = row + offsetRow;
        const checkCharPos = char + offsetChar;

        if (
          checkRowPos >= 0 &&
          checkRowPos < inputGrid.length &&
          checkCharPos >= 0 &&
          checkCharPos < inputGrid[checkRowPos]!.length &&
          inputGrid[checkRowPos]![checkCharPos] === PAPER_ROLL_SYMBOL
        )
          neighbourCnt++;
      }

      if (neighbourCnt < 4) {
        rtnGrid[row]![char] = "X";
        accessableRollsCnt++;
      }
    }
  }

  return [accessableRollsCnt, rtnGrid];
}

function forkliftCheck_B(inputGrid: string[][]): [number, string[][]] {
  const rtnGrid = inputGrid.map((el) => [...el]);

  const directionOffsets: Array<[number, number]> = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  function computeNeighbours(row: number, char: number) {
    let neighbourCnt = 0;

    // check each direction
    for (const [offsetRow, offsetChar] of directionOffsets) {
      const checkRowPos = row + offsetRow;
      const checkCharPos = char + offsetChar;

      if (
        checkRowPos >= 0 &&
        checkRowPos < rtnGrid.length &&
        checkCharPos >= 0 &&
        checkCharPos < rtnGrid[checkRowPos]!.length &&
        rtnGrid[checkRowPos]![checkCharPos] === PAPER_ROLL_SYMBOL
      )
        neighbourCnt++;
    }

    return neighbourCnt;
  }

  // create new array for neighbour counter
  const neighbourCounter: number[][] = Array.from(inputGrid, (row) =>
    row.map(() => 0)
  );

  // initialising neighbour counter (only for paper rolls)
  const removableQueue: Array<[number, number]> = [];
  for (let row = 0; row < rtnGrid.length; row++) {
    for (let char = 0; char < rtnGrid[row]!.length; char++) {
      if (rtnGrid[row]![char] !== PAPER_ROLL_SYMBOL) continue;

      const neighbours = computeNeighbours(row, char);
      neighbourCounter[row]![char] = neighbours;
      if (neighbours < 4) removableQueue.push([row, char]);
    }
  }

  // remove rolls in queue and update values of neighbours
  let removedCnt = 0;
  while (removableQueue.length > 0) {
    const [row, char] = removableQueue.shift()!;
    if (rtnGrid[row]![char] !== PAPER_ROLL_SYMBOL) continue;

    // remove roll
    rtnGrid[row]![char] = "X";
    removedCnt++;

    // update neighbours
    for (const [offsetRow, offsetChar] of directionOffsets) {
      const checkRowPos = row + offsetRow;
      const checkCharPos = char + offsetChar;

      if (
        checkRowPos < 0 ||
        checkRowPos >= rtnGrid.length ||
        checkCharPos < 0 ||
        checkCharPos >= rtnGrid[checkRowPos]!.length ||
        rtnGrid[checkRowPos]![checkCharPos] !== PAPER_ROLL_SYMBOL
      )
        continue;

      const updatedNeighbourCnt = computeNeighbours(checkRowPos, checkCharPos);
      neighbourCounter[checkRowPos]![checkCharPos] = updatedNeighbourCnt;
      if (updatedNeighbourCnt < 4) removableQueue.push([checkRowPos, checkCharPos]);
    }
  }

  return [removedCnt, rtnGrid];
}

const PAPER_ROLL_SYMBOL = "@";

const filepath = "./data/input.txt";
// const filepath = "./data/test.txt";
const gridInput = readTextFile(filepath);

const [rollsCnt, rollsGrid] = forkliftCheck_A(gridInput);
const [rollsRemovedCnt, rollsRemovedGrid] = forkliftCheck_B(gridInput);

console.log("AoC Day 04\n");
console.log("[Part A]");
console.log(`There are ${rollsCnt} rolls that can be accessed by a forklift.`);
// printGrid(rollsGrid);

console.log("\n[Part B]");
console.log(`There are ${rollsRemovedCnt} rolls that can be removed.`);
// printGrid(rollsRemovedGrid);
