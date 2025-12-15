#
#   Advent of Code - Day 01
#   Part A - Method 1
#   Author: Kevin Cioch
#

class Safe:
    def __init__(self, initDialPos, maxDialPos):
        self.dialPos = initDialPos
        self.maxDialPos = maxDialPos
        self.passwordCnt = 0

    def turnDialLeft(self, steps):
         return self.__turnDial(self.dialPos - steps)

    def turnDialRight(self, steps):
        return self.__turnDial(self.dialPos + steps)
    
    def __turnDial(self, newDialPos):
        self.dialPos = newDialPos % (self.maxDialPos + 1)
        if self.dialPos == 0:
            self.passwordCnt += 1
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