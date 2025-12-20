//
//   Advent of Code - Day 07
//   Part A & B
//   Author: Kevin Cioch
//

import { readFileSync } from "fs";

const BEAM_EMITTER_SYMBOL = "S";
const BEAM_SPLITTER_SYMBOL = "^";
const BEAM_SYMBOL = "|";
const EMPTY_FIELD_SYMBOL = ".";

interface BeamPosition {
  row: number;
  col: number;
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

function printGrid(grid: string[][]) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function addMap(map: Map<number, number>, key: number, value: number) {
  map.set(key, (map.get(key) ?? 0) + value);
}

function partA(grid: string[][], printDetails: boolean = false) {
  const gridInput = grid.map((el) => [...el]);
  const beamPosQueue: BeamPosition[] = [];
  let splitActionCnt = 0;

  // find starting points for beams
  gridInput[0]?.forEach(
    (el, i) =>
      el === BEAM_EMITTER_SYMBOL && beamPosQueue.push({ row: 0, col: i })
  );

  // iterate over current beams and update positions
  while (beamPosQueue.length > 0) {
    const currBeam = beamPosQueue.shift();
    if (currBeam === undefined) break;

    const newRowPos = currBeam.row + 1;
    const newRow = gridInput[newRowPos];
    if (!newRow) break;

    // check splitter
    if (newRow[currBeam.col] === BEAM_SPLITTER_SYMBOL) {
      splitActionCnt++;
      const newLeftPos = currBeam.col - 1;
      const newRightPos = currBeam.col + 1;

      // calculate new left pos
      if (newLeftPos >= 0 && newRow[newLeftPos] === EMPTY_FIELD_SYMBOL) {
        newRow[newLeftPos] = BEAM_SYMBOL;
        beamPosQueue.push({ row: newRowPos, col: newLeftPos });
      }

      // calculate new right pos
      if (
        newRightPos < newRow.length &&
        newRow[newRightPos] === EMPTY_FIELD_SYMBOL
      ) {
        newRow[newRightPos] = BEAM_SYMBOL;
        beamPosQueue.push({ row: newRowPos, col: newRightPos });
      }
    }
    // check empty field
    else if (newRow[currBeam.col] === EMPTY_FIELD_SYMBOL) {
      newRow[currBeam.col] = BEAM_SYMBOL;
      beamPosQueue.push({ row: newRowPos, col: currBeam.col });
    }
  }

  console.log("[Part A]");
  console.log(`The beam will be split ${splitActionCnt} times.`);
  printDetails && printGrid(gridInput);
}

function partB(grid: string[][]) {
  const gridInput = grid.map((el) => [...el]);

  let currBeamRowMap: Map<number, number> = new Map();
  let nextBeamRowMap: Map<number, number> = new Map();

  // find starting points for beams
  gridInput[0]?.forEach(
    (el, i) => el === BEAM_EMITTER_SYMBOL && currBeamRowMap.set(i, 1)
  );

  // iterate over beams in current row and calculate beams in next row
  let currRow = 0;
  while (currRow < gridInput.length - 1) {
    nextBeamRowMap.clear();
    currBeamRowMap.forEach((beamCnt, beamPos) => {
      const newRow = grid[currRow + 1];
      if(!newRow) return;

      // beam is being split
      if (newRow[beamPos] === BEAM_SPLITTER_SYMBOL) {
        const newLeftPos = beamPos - 1;
        const newRightPos = beamPos + 1;

        // calculate new left pos
        if (newLeftPos >= 0) addMap(nextBeamRowMap, newLeftPos, beamCnt);

        // calculate new right pos
        if (newRightPos < newRow.length)
          addMap(nextBeamRowMap, newRightPos, beamCnt);
      }
      // beam is not being split
      else addMap(nextBeamRowMap, beamPos, beamCnt);
    });

    currBeamRowMap = new Map(nextBeamRowMap);
    currRow++;
  }

  // sum up all the timeline counters of each ending
  const timelines = [...currBeamRowMap.values()].reduce(
    (prev, el) => prev + el,
    0
  );

  console.log("[Part B]");
  console.log(`There are ${timelines} timelines total.`);
}

function app() {
  const filepath = "./data/input.txt";
  // const filepath = "./data/test.txt";
  const gridInput = readTextFile(filepath);

  console.log("AoC Day 07\n");
  partA(gridInput);
  partB(gridInput);
}

app();
