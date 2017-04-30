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

    /**
     * creates the correct position in Gamefield
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     */
    gamefield.getGridPositionByIndex = function(x, y) {
        var position = {
            x: gamefieldWidth / numberOfFields * x + margin,
            y: gamefieldWidth / numberOfFields * y + margin
        };

        return position;
    };

    // gamegrid Init
    gamefield.grid = [];
    for (var indexX = 0; indexX < numberOfFields; indexX++) {
        gamefield.grid[indexX] = [];
        for (var indexY = 0; indexY < numberOfFields; indexY++) {
            gamefield.grid[indexX][indexY] = new Grid(
                indexX,
                indexY,
                gamefield.getGridPositionByIndex(indexX,indexY));
        }
    }

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
                        if (!grid.isBlocked) {
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
                gridField = gamefield.grid[indexx][indexy];
                if (gridField.isBlocked == false) {
                    notUsedGrids.push(gridField);
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
                gridField = gamefield.grid[indexx][indexy];
                gridField.destroyChild();
            }
        }
        score = -1;
        gamefield.changeScore();
        gamefield.initGame();
    };


    gamefield.initGame = function () {
        gamefield.addJewels(numberOfFields * numberOfFields)

    };
    gamefield.initGame();

    return gamefield;
}