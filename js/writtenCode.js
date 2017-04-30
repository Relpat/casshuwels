function createGameField() {
    var fieldSize = 6;
    var foodWidth = 200;
    var margin = 30;
    var gamefieldWidth = 765;
    var foodsize = (gamefieldWidth - margin * 2) / fieldSize;

    var gamefield_texture = PIXI.Texture.fromImage('img/objects/spielfeld.png');
    var gamefield = new PIXI.Sprite(gamefield_texture);
    gamefield.position.x = 1080;
    gamefield.position.y = 30;
    gamefield.lastMovement = "";

    function Grid(x, y) {
        this.position = getPositionByIndex(x, y);
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

        this.findSameFoodTypeInNeighbours = function (currentFoodArray) {
            var neighboursOfSameType = [];
            // existiert überhaupt ein Child?
            if (this.child) {
                for (var indexX = -1; indexX < 1; indexX++) {
                    for (var indexY = -1; indexY < 1; indexY++) {
                        if (indexX != 0 && indexY != 0
                            && this.x - 1 >= 0
                            && this.x + 1 <= fieldSize
                            && this.y - 1 >= 0
                            && this.y + 1 <= fieldSize
                        ) {
                            food = gamefield.grid[this.x + indexX][this.y + indexY].child;
                            var isNotInArray = true;
                            if (food && currentFoodArray.length > 0) {
                                for (var keyIndex in currentFoodArray) {
                                    foodInArray = currentFoodArray[keyIndex];
                                    if (food === foodInArray) {
                                        isNotInArray = false;
                                    }
                                }
                            }

                            if (food.type === this.child.type && isNotInArray) {
                                neighboursOfSameType.push(food);
                            }
                        }
                    }
                }
            }
            return neighboursOfSameType;
        }.bind(this);
    }

    function Food(type, grid) {
        switch (type) {
            case "avocado":
                var foodtexture = PIXI.Texture.fromImage('img/food/' + type + '.png');
                break;
            case "shushi":
                var foodtexture = PIXI.Texture.fromImage('img/food/' + type + '.png');
                break;
            case "praline":
                var foodtexture = PIXI.Texture.fromImage('img/food/' + type + '.png');
                break;
            case "lachs":
                var foodtexture = PIXI.Texture.fromImage('img/food/' + type + '.png');
                break;
        }
        var food = new PIXI.Sprite(foodtexture);

        food.height = foodsize;
        food.width = foodsize;
        food.type = type;
        food.grid = grid;
        foodTypesContainer[type].push(food);

        return food;
    }

    // gamegrid Init
    gamefield.grid = [];
    for (var indexX = 0; indexX < fieldSize; indexX++) {
        gamefield.grid[indexX] = [];
        for (var indexY = 0; indexY < fieldSize; indexY++) {
            gamefield.grid[indexX][indexY] = new Grid(indexX, indexY);

        }
    }

    /**
     * creates the correct position in Gamefield
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     */
    function getPositionByIndex(x, y) {
        var position = {
            x: gamefieldWidth / fieldSize * x + margin,
            y: gamefieldWidth / fieldSize * y + margin
        }

        return position;
    }

    gamefield.initGame = function () {
        var counter = 0;
        for (var indexX = 2; indexX < 4; indexX++) {
            for (var indexY = 2; indexY < 4; indexY++) {
                grid = gamefield.grid[indexX][indexY];
                var food = new Food(types[counter], grid);
                grid.addChild(food);
                gamefield.addChild(food);

                counter++;
            }
        }
    };
    gamefield.initGame();

    gamefield.changeScore = function () {
        score++;
        textContainer.children[0].text = "Gemampftes Mampf: " + score
    }

    gamefield.moveLeft = function (direction) {
        if (gamefield.lastMovement != "left") {
            for (var indexx = 0; indexx < fieldSize; indexx++) {
                for (var indexy = 0; indexy < fieldSize; indexy++) {
                    grid = gamefield.grid[indexx][indexy];
                    food = grid.child;
                    if (food) {
                        sortThemX(food, grid, indexy);
                    }
                }
            }
            function sortThemX(oject, gridParam, y) {
                for (var indexx = 0; indexx < fieldSize; indexx++) {
                    grid = gamefield.grid[indexx][y];
                    if (grid.isBlocked == false) {

                        grid.isBlocked = true;
                        gridParam.removeChild();
                        grid.addChild(oject);
                        return;
                    }
                }
            }

            gamefield.createRandomFood();
            gamefield.lastMovement = "left";
        }

    };

    gamefield.moveRight = function (direction) {
        if (gamefield.lastMovement != "right") {
            for (var indexx = fieldSize - 1; indexx >= 0; indexx--) {
                for (var indexy = fieldSize - 1; indexy >= 0; indexy--) {
                    grid = gamefield.grid[indexx][indexy];
                    food = grid.child;
                    if (food) {
                        sortThemX(food, grid, indexy);
                    }
                }
            }
            function sortThemX(oject, gridParam, y) {
                for (var indexx = fieldSize - 1; indexx >= 0; indexx--) {
                    grid = gamefield.grid[indexx][y];
                    if (grid.isBlocked == false) {

                        grid.isBlocked = true;
                        gridParam.removeChild();
                        grid.addChild(oject);

                        return;
                    }
                }
            }

            gamefield.lastMovement = "right";
            gamefield.createRandomFood();
        }
    };

    gamefield.moveBottom = function (direction) {
        if (gamefield.lastMovement != "bottom") {
            for (var indexx = fieldSize - 1; indexx >= 0; indexx--) {
                for (var indexy = fieldSize - 1; indexy >= 0; indexy--) {
                    grid = gamefield.grid[indexy][indexx];
                    food = grid.child;
                    if (food) {
                        sortThemY(food, grid, indexy);
                    }
                }
            }
            function sortThemY(oject, gridParam, x) {
                for (var indexy = fieldSize - 1; indexy >= 0; indexy--) {
                    grid = gamefield.grid[x][indexy];
                    if (grid.isBlocked == false) {

                        grid.isBlocked = true;
                        gridParam.removeChild();
                        grid.addChild(oject);
                        return;
                    }
                }
            }

            gamefield.lastMovement = "bottom";
            gamefield.createRandomFood();
        }
    };

    gamefield.moveTop = function (direction) {

        if (gamefield.lastMovement != "top") {
            for (var indexx = 0; indexx < fieldSize; indexx++) {
                for (var indexy = 0; indexy < fieldSize; indexy++) {
                    grid = gamefield.grid[indexy][indexx];
                    food = grid.child;
                    if (food) {
                        sortThemX(food, grid, indexy);
                    }
                }
            }
            function sortThemX(oject, gridParam, x) {
                for (var indexx = 0; indexx < fieldSize; indexx++) {
                    grid = gamefield.grid[x][indexx];
                    if (grid.isBlocked == false) {

                        grid.isBlocked = true;
                        gridParam.removeChild();
                        grid.addChild(oject);
                        return;
                    }
                }
            }

            gamefield.lastMovement = "top";
            gamefield.createRandomFood();
        }
    };

    gamefield.getUnusedGrids = function () {
        var notUsedGrids = [];
        for (var indexx = 0; indexx < fieldSize; indexx++) {
            for (var indexy = 0; indexy < fieldSize; indexy++) {
                gridField = gamefield.grid[indexx][indexy];
                if (gridField.isBlocked == false) {
                    notUsedGrids.push(gridField);
                }
            }
        }

        return notUsedGrids;
    };

    gamefield.findNeighbourfoodAndDeleteAndScore = function () {
        console.debug(foodTypesContainer);

        for (var indexTypes in foodTypesContainer) {
            var foodTypesArray = foodTypesContainer[indexTypes];
            var neighboursArray = [];

            var lastXindex = -10;
            var lastYindex = -10;
            lastGrid = null;
            lastFood = null;
            for (var index in foodTypesArray) {
                food = foodTypesArray[index];
                food.arrayIndex = index;

                /*
                 Suche alle X Achsen nach Reihen
                 */
                for (var indexX = 0; indexX < gamefield; indexX++) {
                    for (var indexY = 0; indexY < gamefield; indexY++) {

                    }
                }
                //if (
                //    food.grid.x == lastXindex && food.grid.y - 1 == lastYindex
                //    || food.grid.x  == lastXindex && food.grid.y + 1 == lastYindex
                //    || food.grid.x - 1 == lastXindex && food.grid.y == lastYindex
                //    || food.grid.x + 1 == lastXindex && food.grid.y == lastYindex
                //) {
                //    neighboursArray.push(lastFood);
                //    neighboursArray.push(food);
                //}
                lastXindex = food.grid.x;
                lastYindex = food.grid.y;
                lastFood = food;

                lastGrid = food.grid;
            }

            console.debug("neighboursArray", neighboursArray);
            for (var index in neighboursArray) {
                food = neighboursArray[index];

                if (food) {
                    foodTypesContainer[indexTypes].splice(food.arrayIndex, 1);
                    food.grid.destroyChild();
                    game.createHuman();
                    gamefield.changeScore();
                }
            }
        }
    };
    gamefield.getNeighbourChain = function () {

        for (var index in foodTypesContainer) {

        }

        function isInArray(object, objectArray) {

            for (var index in objectArray) {
                data = objectArray[index];
                if (data === object) {

                    return true;
                }
            }
        }
    };

    gamefield.createRandomFood = function () {
        var notUsedGrids = gamefield.getUnusedGrids();

        var randomNumberOutOfGridsize = Math.round(Math.random() * (notUsedGrids.length - 1));
        var randomGrid = notUsedGrids[randomNumberOutOfGridsize];

        gamefield.changeScore();
        if (randomGrid) {
            var randomType = types[Math.round(Math.random() * (types.length - 1))];
            food = new Food(randomType, randomGrid);

            gamefield.addChild(food);
            randomGrid.addChild(food);
            game.createHuman();
            gamefield.findNeighbourfoodAndDeleteAndScore();
        } else {
            gamefield.resetGame();
        }

    };

    gamefield.resetGame = function () {
        alert("Onoz! :< Du hast verloren");

        // destroy all
        for (var indexx = 0; indexx < fieldSize; indexx++) {
            for (var indexy = 0; indexy < fieldSize; indexy++) {
                gridField = gamefield.grid[indexx][indexy];
                gridField.destroyChild();
            }
        }
        score = -1;
        gamefield.changeScore();
        gamefield.initGame();
    };

    return gamefield;
}