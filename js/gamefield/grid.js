/**
 * Created by Patrick on 30.04.2017.
 */


function Grid(x, y, position) {

    this.position = position;
    this.child = null;
    this.isBlocked = false;
    this.x = x;
    this.y = y;
    this.addChild = function (object) {
        object.position.x = this.position.x;
        object.position.y = this.position.y;
        object.grid = this;
        this.child = object;
        this.isBlocked = true;
    }.bind(this);
    this.removeChild = function () {
        this.isBlocked = false;
        this.child = null;
    }.bind(this);

    this.destroyChild = function () {
        this.child.destroy();
        this.removeChild();
    }.bind(this);

    /**
     * sucht alle gleichen Jewels
     * @returns {Array}
     */
    this.findSameNeighbours = function (neighbourGridsOfSameType) {
        if (neighbourGridsOfSameType != "undefined" && typeof neighbourGridsOfSameType != "object") {
            var neighbourGridsOfSameType = [];
        }
        var newNeighboursGridToConcat = [];
        // existiert überhaupt ein Child?
        if (this.child) {
            for (var indexX = -1; indexX <= 1; indexX++) {
                for (var indexY = -1; indexY <= 1; indexY++) {
                    if (
                        // is top, left, right, bottom
                    indexY == -1 && indexX == 0 ||
                    indexY == 0 && indexX == 1 ||
                    indexY == 1 && indexX == 0 ||
                    indexY == 0 && indexX == -1 ||
                    indexX == 0 && indexY == 0
                    ) {

                        if (typeof gamefield.grid[this.x + indexX] != 'undefined') {
                            grid = gamefield.grid[this.x + indexX][this.y + indexY];
                            if (typeof grid != "undefined") {
                                var jewelNeighbour = grid.child;
                                if (jewelNeighbour.type === this.child.type) {
                                    newNeighboursGridToConcat.push(grid);
                                    gamefield.gridsToDelete.push(grid)
                                }
                            }
                        }
                    }
                }
            }
            this.isNeighborsSeached = true;
        }
        neighbourGridsOfSameType = neighbourGridsOfSameType.concat(newNeighboursGridToConcat);
        gamefield.gridsToDelete.concat(neighbourGridsOfSameType);

        for (var index in neighbourGridsOfSameType) {
            var gridNeighbour = neighbourGridsOfSameType[index];
            if (gridNeighbour) {
                if (!gridNeighbour.isNeighborsSeached) {
                    gridNeighbour.findSameNeighbours(neighbourGridsOfSameType);
                }
            }
        }

        return neighbourGridsOfSameType;
    }

}