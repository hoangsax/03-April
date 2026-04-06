/*
  x x x x x
  - - - - -
y 0 0 0 0 0
y 1 1 1 1 0
y 1 1 1 1 1
  - - - - -
  Input: [ [0,1,1], [0,1,1], [0,1,1], [0,1,1], [0,0,1]]
*/
class Garden {
    constructor(matrix) {
        this.matrix = matrix;
    }
    moveRight(point) {
        let [x, y] = point;
        if (y + 1 < this.matrix[0].length && this.matrix[x][y + 1] === 0) {
            return true;
        }
        return false;
    }

    moveDown(point) {
        let [x, y] = point;
        if (x + 1 < this.matrix.length && this.matrix[x + 1][y] === 0) {
            return true;
        }
        return false;
    }

    moveUp(point) {
        let [x, y] = point;
        if (x - 1 >= 0 && this.matrix[x - 1][y] === 0) {
            return true;
        }
        return false;
    }

    moveLeft(point) {
        let [x, y] = point;
        if (y - 1 >= 0 && this.matrix[x][y - 1] === 0) {
            return true;
        }
        return false;
    }

    pathingWithPoint(point) {

    }

    safePathingBombedGarden(matrix){
        let startingPoint = [];
        let output = [];
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i][0] === 0) {
                startingPoint.push([i, 0]);
            }
        }
        while (startingPoint.length > 0) {

        }

    }

}

console.log(safePathingBombedGarden([[0,1,1], [0,1,1], [0,1,1], [0,1,1], [0,0,1]]));