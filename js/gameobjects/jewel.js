/**
 * Created by Patrick on 30.04.2017.
 */
var typesOfJewels = {
    "dummy_one"     : "lifeup.jpg",
    "dummy_two"     : "mushroom.png",
    "dummy_three"   : "shyguy.png",
    "dummy_four"    : "coin.png",
};

function getRandomType() {
    var randomInteger = Math.floor( Math.random() * Object.keys(typesOfJewels).length );
    var randomJewelType = false;

    var key = 0;
    for(var index in typesOfJewels){
        if(key === randomInteger){
            randomJewelType = typesOfJewels[index];
        }
        key++;
    }

    return randomJewelType;
}

/**
 * The Jewels Object
 * @returns {*}
 * @constructor
 */
function Jewel() {
    var texture = PIXI.Texture.fromImage(pathToObjDir + getRandomType());
    var jewel = new PIXI.Sprite(texture);
    jewel.isJustAdded = true;
    jewel.isFullyShown = false;
    jewel.alpha = 0;
    jewel.parent = null;

    // fadeIn-Funcion
    jewel.lowerAlpha = function (deltaTime) {
        if(jewel.isJustAdded == true && jewel.isFullyShown == false){
            if (jewel.alpha < 1) {
                jewel.alpha += .05 * deltaTime;
                if(jewel.alpha > 1){
                    jewel.alpha = 1;
                }
            }else{
                jewel.isJustAdded = false;
                jewel.isFullyShown = true;
            }
        }
    };

    /**
     * hier werden alle Interaktionen defininert
     */
    function setInteractives(){

        jewel.interactive = true;
        jewel.buttonMode = true;
        jewel.on('mouseup', makeAlert)
            .on('mouseupoutside', makeAlert)
            .on('touchend', makeAlert)
            .on('touchendoutside', makeAlert);

        function makeAlert() {
            var grid = jewel.parent;

            console.debug(grid);
            var neighbours = grid.findSameNeighbours();
            console.debug(neighbours);
        }
    }



    setInteractives();
    return jewel;
}