/**
 * Created by Patrick on 30.04.2017.
 */
var typesOfJewels = {
    "dummy_one": "lifeup.jpg",
    "dummy_two": "mushroom.png",
    "dummy_three": "shyguy.png",
    "dummy_four": "coin.png",
};

function getRandomType() {
    var randomInteger = Math.floor(Math.random() * Object.keys(typesOfJewels).length);
    var randomJewelType = false;

    var key = 0;
    var indexSaved;
    for (var index in typesOfJewels) {
        if (key === randomInteger) {
            randomJewelType = typesOfJewels[index];
            indexSaved = index;
        }
        key++;
    }

    var type = {
        'img': randomJewelType,
        'index': indexSaved
    };
    return type;
}

/**
 * The Jewels Object
 * @returns {*}
 * @constructor
 */
function Jewel() {
    var type = getRandomType();
    var texture = PIXI.Texture.fromImage(pathToObjDir + type.img);
    var jewel = new PIXI.Sprite(texture);
    jewel.isJustAdded = true;
    jewel.isFullyShown = false;
    jewel.alpha = 0;
    jewel.grid = null;
    jewel.type = type.index;

    // fadeIn-Funcion
    jewel.lowerAlpha = function (deltaTime) {
        if (jewel.isJustAdded == true && jewel.isFullyShown == false) {
            if (jewel.alpha < 1) {
                jewel.alpha += .05 * deltaTime;
                if (jewel.alpha > 1) {
                    jewel.alpha = 1;
                }
            } else {
                jewel.isJustAdded = false;
                jewel.isFullyShown = true;
            }
        }
    };

    jewel.fallJewel = function () {
        var grid = jewel.grid;
        var jewelIsFalling = false;

        var newGridParent = null;
        for (var iterator = 1; iterator < gamefield.numberOfFields - jewel.y; iterator++) {
            if (false == gamefield.grid[grid.x][grid.y - iterator].isBlocked) {
                newGridParent = gamefield.grid[grid.x][grid.y - iterator];
            }
        }

        if (jewelIsFalling) {
            grid.removeChild();
            newGridParent.addChild(jewel);
            grid.isBlocked = false;
        }

    };

    /**
     * hier werden alle Interaktionen defininert
     */
    function setInteractives() {

        jewel.interactive = true;
        jewel.buttonMode = true;
        jewel.on('mouseup', removeJewels)
            .on('mouseupoutside', removeJewels)
            .on('touchend', removeJewels)
            .on('touchendoutside', removeJewels);

        function removeJewels() {
            var grid = jewel.grid;
            console.debug(grid);
            grid.findSameNeighbours();
            var neighboursGrids = gamefield.gridsToDelete;

            // remove double Elements
            neighboursGrids = neighboursGrids.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            });

            // resette suche
            var numberOfNewJewels = 0;
            for (var index in neighboursGrids) {
                var gridNeighbour = neighboursGrids[index];

                // erlaube die Suche wieder
                if (gridNeighbour) {
                    gridNeighbour.isNeighborsSeached = false;
                }
                if (neighboursGrids.length > 2) {
                    numberOfNewJewels++;
                    gridNeighbour.destroyChild();
                }
            }

            if (numberOfNewJewels > 2) {
                gamefield.letJewelsFall();
                gamefield.addJewels(numberOfNewJewels);
            }
            gamefield.gridsToDelete = [];
        }
    }

    setInteractives();
    return jewel;
}