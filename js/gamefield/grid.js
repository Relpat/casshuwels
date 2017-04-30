/**
 * Created by Patrick on 30.04.2017.
 */


function Grid(x, y, position) {

    console.debug(position);
    this.position = position;
    this.child = null;
    this.isBlocked = false;
    this.x = x;
    this.y = y;
    this.addChild = function (object) {
        object.position.x = this.position.x;
        object.position.y = this.position.y;
        object.grid = this;
        object.parent = this;
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
    this.findSameNeighbours = function (neighboursOfSameType) {
        if(!neighboursOfSameType && typeof neighboursOfSameType != "object"){
            var neighboursOfSameType = [];
        }
        // existiert überhaupt ein Child?
        if (this.child) {
            for (var indexX = -1; indexX < 1; indexX++) {
                for (var indexY = -1; indexY < 1; indexY++) {
                    if (indexX != 0 && indexY != 0
                        && this.x - 1 >= 0
                        && this.x + 1 <= config.numberOfFields
                        && this.y - 1 >= 0
                        && this.y + 1 <= config.numberOfFields
                    ) {
                        jewelNeighbour = gamefield.grid[this.x + indexX][this.y + indexY].child;
                        var isNotInArray = true;
                        if (jewelNeighbour && neighboursOfSameType.length > 0) {
                            for (var keyIndex in neighboursOfSameType) {
                                objectInArray = neighboursOfSameType[keyIndex];
                                if (jewelNeighbour === objectInArray) {
                                    isNotInArray = false;
                                }
                            }
                        }

                        if (jewelNeighbour.type === this.child.type && isNotInArray) {
                            neighboursOfSameType.push(jewelNeighbour);
                        }
                    }
                }
            }
        }
        return neighboursOfSameType;
    }

}