#
#   Advent of Code - Day 01
#   Part B - Method 0x434C49434B
#   Author: Kevin Cioch
#

class Safe:
    def __init__(self, initDialPos, maxDialPos):
        self.dialPos = initDialPos
        self.maxDialPos = maxDialPos
        self.passwordCnt = 0

    def turnDialLeft(self, steps):      
        max = self.maxDialPos + 1
        if self.dialPos == 0:
            zeroCnt = steps // max
        else:
            zeroCnt = ( (steps - self.dialPos) // max + 1 ) if steps >= self.dialPos else 0
        
        self.passwordCnt += zeroCnt
        self.dialPos = (self.dialPos - steps) % max

        return self.dialPos

    def turnDialRight(self, steps):
        max = self.maxDialPos + 1
        newDialPos = self.dialPos + steps

        self.passwordCnt += newDialPos // max
        self.dialPos = newDialPos % max
        
        return self.dialPos

def processInputFile(filename, safe):
    with open(filename, "r") as file:
        for line in file:
            line = line.strip() # remove whitespaces/newlines

            direction = line[0] # first character is direction
            steps = int(line[1:]) # rest is number of steps

            if direction == 'L':
                safe.turnDialLeft(steps)
            elif direction == 'R':
                safe.turnDialRight(steps)

        return safe.passwordCnt

safe = Safe(50, 99)
passwordCnt = processInputFile("../data/input.txt", safe)

print("The password is: " + str(passwordCnt))