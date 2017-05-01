/**
 * Created by Patrick on 30.04.2017.
 */
function GameField(config) {
    if (!config) {
        config = [];
    }
    var numberOfFields = config['numberOfFields'] || 8;
    var margin = config['margin'] || 30;
    var gamefieldWidth = config['gamefieldWidth'] || 765;

    var gamefield_texture = PIXI.Texture.fromImage(pathToObjDir + 'spielfeld.png');
    var gamefield = new PIXI.Sprite(gamefield_texture);
    gamefield.position.x = 1080;
    gamefield.position.y = 30;
    gamefield.lastMovement = "";
    gamefield.gridsToDelete = [];

    /**
     * creates the correct position in Gamefield
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     */
    gamefield.getGridPositionByIndex = function (x, y) {
        var position = {
            x: gamefieldWidth / numberOfFields * x + margin,
            y: gamefieldWidth / numberOfFields * y + margin
        };

        return position;
    };

    // gamegrid Init
    (function initGameGrid() {
        gamefield.grid = [];
        for (var indexX = 0; indexX < numberOfFields; indexX++) {
            gamefield.grid[indexX] = [];
            for (var indexY = 0; indexY < numberOfFields; indexY++) {
                var position = gamefield.getGridPositionByIndex(indexX, indexY);

                var grid = new Grid(
                    indexX,
                    indexY,
                    position
                );
                gamefield.grid[indexX][indexY] = grid;
            }
        }
    })();

    gamefield.addJewels = function (numbersToAdd) {
        if (!numbersToAdd || typeof numbersToAdd != "number") {
            numbersToAdd = 4;
        }
        for (var iterator = 0; iterator < numbersToAdd; iterator++) {
            var jewel = new Jewel();
            addJewelToGrid(jewel);

            gamefield.addChild(jewel);
        }

        /**
         * todo: Performace Verbesserung! Schleife ist doof, weil sie immer komplett neu durchläuft
         * @param jewel
         */
        function addJewelToGrid(jewel) {
            // von hinten an, damit die Reihen von unten nach oben gefüllt werden
            for (var indexY = numberOfFields - 1; indexY >= 0; indexY--) {
                for (var indexX = numberOfFields - 1; indexX >= 0; indexX--) {
                    grid = gamefield.grid[indexX][indexY];
                    if (grid) {
                        if (grid.isBlocked == false) {
                            grid.addChild(jewel);
                            return;
                        }
                    }
                }
            }
        }
    };

    gamefield.getUnusedGrids = function () {
        var notUsedGrids = [];
        for (var indexx = 0; indexx < numberOfFields; indexx++) {
            for (var indexy = 0; indexy < numberOfFields; indexy++) {
                grid = gamefield.grid[indexx][indexy];
                if (grid.isBlocked == false) {
                    notUsedGrids.push(grid);
                }
            }
        }

        return notUsedGrids;
    };

    gamefield.resetGame = function () {
        alert("Onoz! :< Du hast verloren");

        // destroy all
        for (var indexx = 0; indexx < numberOfFields; indexx++) {
            for (var indexy = 0; indexy < numberOfFields; indexy++) {
                grid = gamefield.grid[indexx][indexy];
                grid.destroyChild();
            }
        }
        score = -1;
        gamefield.changeScore();
        gamefield.initGame();
    };

    gamefield.letJewelsFall = function () {
        for (var indexx = numberOfFields - 1; indexx >= 0; indexx--) {
            for (var indexy = numberOfFields - 1; indexy >= 0; indexy--) {
                grid = gamefield.grid[indexx][indexy];
                if (grid != "undefined") {
                    if (grid.isBlocked == false) {
                        for (var indexy2 = indexy; indexy2 >= 0; indexy2--) {
                            var gridToTakeFrom = gamefield.grid[indexx][indexy2];
                            if (gridToTakeFrom != "undefined") {
                                if (
                                    gridToTakeFrom.isBlocked == true
                                    && grid.isBlocked == false
                                ) {
                                    var child = gridToTakeFrom.child;
                                    gridToTakeFrom.removeChild();
                                    grid.addChild(child);
                                    indexy2 = indexy;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    gamefield.initGame = function () {
        gamefield.addJewels(numberOfFields * numberOfFields)

    };
    gamefield.initGame();

    return gamefield;
}