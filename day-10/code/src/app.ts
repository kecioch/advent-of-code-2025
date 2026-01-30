//
//   Advent of Code - Day 10
//   Part A & B
//   Author: Kevin Cioch
//
//   INFO: PART B DOESNT CALCULATE THE OPTIMAL SOLUTION!
//         FOR THE GIVEN INPUT DATA THE SOLUTION SHOULD BE 21021 AND NOT 21288!
//

import { readFileSync } from "fs";

type Machine = {
  target: number[];
  buttons: number[][];
};

// Part A: Minimum button presses

// convert start condition ".##." -> [0,1,1,0]
function parseDiagram(diagram: string): number[] {
  return diagram
    .replace(/\[|\]/g, "")
    .split("")
    .map((c) => (c === "#" ? 1 : 0));
}

// parse one input line into a Machine
function parseLineA(line: string): Machine {
  // extract [....]
  const diagramMatch = line.match(/\[[.#]+\]/);
  if (!diagramMatch) {
    throw new Error("No diagram found: " + line);
  }

  const target = parseDiagram(diagramMatch[0]);

  // extract all (...) button definitions
  const buttonMatches = [...line.matchAll(/\(([\d,]+)\)/g)];
  const buttons = buttonMatches.map((m) => m[1]!.split(",").map(Number));

  return { target, buttons };
}

// brute-force minimal button presses for one machine
function minPressesA(machine: Machine): number {
  const nLights = machine.target.length;
  const nButtons = machine.buttons.length;

  let best = Infinity;

  for (let mask = 0; mask < 1 << nButtons; mask++) {
    const state = Array(nLights).fill(0);
    let presses = 0;

    // toogle lights
    for (let b = 0; b < nButtons; b++) {
      if (mask & (1 << b)) {
        presses++;
        for (const light of machine.buttons[b]!) {
          state[light] ^= 1;
        }
      }
    }

    // check target state
    let ok = true;
    for (let i = 0; i < nLights; i++) {
      if (state[i] !== machine.target[i]) {
        ok = false;
        break;
      }
    }

    // update best solution
    if (ok) best = Math.min(best, presses);
  }

  return best;
}

// solve all machines
function solveA(machines: Machine[]): number {
  let total = 0;

  machines.forEach((m, i) => {
    const presses = minPressesA(m);
    if (!isFinite(presses)) {
      throw new Error(`Machine ${i} has no solution`);
    }
    total += presses;
  });

  return total;
}

function partA(filepath: string) {
  const input = readFileSync(filepath, "utf-8").trim();
  const lines = input.split("\n").filter((line) => line.trim().length > 0);

  const machines = lines.map(parseLineA);
  const result = solveA(machines);

  console.log("[Part A]");
  console.log(`Total fewest button presses required: ${result}\n`);
}

// Part B: Minimum button presses to reach joltage targets

function parseLineB(line: string): Machine {
  // Extract joltage requirements {...}
  const targetMatch = line.match(/\{([\d,]+)\}/);
  if (!targetMatch) {
    throw new Error("No target joltage found: " + line);
  }
  const target = targetMatch[1]!.split(",").map(Number);

  // Extract all (...) button definitions
  const buttonMatches = [...line.matchAll(/\(([\d,]+)\)/g)];
  const buttons = buttonMatches.map((m) => m[1]!.split(",").map(Number));

  return { target, buttons };
}

function minPressesB(machine: Machine): number {
  const nCounters = machine.target.length;
  const nButtons = machine.buttons.length;

  // coefficient matrix
  // each row represents a counter, each column represents a button
  const matrix: number[][] = Array(nCounters)
    .fill(0)
    .map(() => Array(nButtons).fill(0));

  for (let b = 0; b < nButtons; b++) {
    for (const counter of machine.buttons[b]!) {
      matrix[counter]![b] = 1;
    }
  }

  return solveB(machine);
}

function solveB(machine: Machine): number {
  const currentLevels = [...machine.target];
  let totalPresses = 0;

  // find the best button to press
  while (currentLevels.some((val) => val > 0)) {
    let bestButton = -1;
    let bestScore = -1;

    for (let b = 0; b < machine.buttons.length; b++) {
      const button = machine.buttons[b]!;
      // calculate score -> how many needed counters does this button increment?
      let score = 0;
      for (const counter of button) if (currentLevels[counter]! > 0) score++;

      if (score > bestScore) {
        bestScore = score;
        bestButton = b;
      }
    }

    if (bestButton === -1) {
      throw new Error("No valid button found");
    }

    // press the best button once
    for (const counter of machine.buttons[bestButton]!) {
      currentLevels[counter]!--;
    }
    totalPresses++;
  }

  return totalPresses;
}

function partB(filepath: string) {
  const input = readFileSync(filepath, "utf-8").trim();
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  const machines = lines.map(parseLineB);

  let total = 0;
  machines.forEach((m, i) => {
    const presses = minPressesB(m);
    if (!isFinite(presses)) {
      throw new Error(`Machine ${i} has no solution`);
    }
    total += presses;
  });

  console.log("[Part B]");
  console.log(`Total fewest button presses required: ${total}\n`);
}

function app() {
  const filepath = "./data/input.txt";

  console.log("AoC Day 10\n");
  partA(filepath);
  partB(filepath);
}

app();
