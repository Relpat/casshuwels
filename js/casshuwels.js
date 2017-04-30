
function Jumper(){

    var size = [1920, 1080];
    var ratio = size[0] / size[1];
    var renderer = PIXI.autoDetectRenderer(1920, 1080,{
        antialias: true,
        transparent: true,
        autoResize : true
        // "backgroundColor": 0xffffff
    });
    renderer.autoResize = true;
    var pixiTracker = new PIXI.ticker.Ticker();
    var deltaTime = pixiTracker.deltaTime;
    var currentWidth,
        currentHeight;



    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    this.resize = function () {

        var widthNew = $(window).width();
        var heightNew = $(window).height();

        function pleaseRotate() {
            if (heightNew > widthNew || window.orientation == 0) {
                $("#pleaseRotate").fadeIn(500);
            } else {
                $("#pleaseRotate").fadeOut(500);
            }

        }

        function canvasSize() {

            var canvas = $('canvas');
            var canvasWidth = widthNew - $(canvas).width();
            canvasWidth = canvasWidth / 2;
            canvas.css({
                "margin-left": canvasWidth
            });

            if (window.innerWidth / window.innerHeight >= ratio) {
                currentWidth = window.innerHeight * ratio;
                currentHeight = window.innerHeight;
            } else {
                currentWidth = window.innerWidth;
                currentHeight = window.innerWidth / ratio;
            }
            renderer.view.style.width = currentWidth + 'px';
            renderer.view.style.height = currentHeight + 'px';
        }

        canvasSize();
    };

    $(window).resize(this.resize); // Resize function;
    this.resize();
    document.body.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    var stageObjects = [];


    for (var index in stageObjects) {
        var container = stageObjects[index];
        stage.addChild(container);
    }

    animate();
    function animate() {
        requestAnimationFrame(animate);

        calculating();

        // render the container
        renderer.render(stage);
    }


    // do the calculation
    function calculating() {

        for (var indexStage in stageObjects) {
            var container = stageObjects[indexStage];

            var clickedObjects = 0;
            for (var indexObject in container.children) {
                var object = container.children[indexObject];

                if(object){
                    if(typeof object.calculate === "function"
                        || typeof object.calculate === "object" ){
                        object.calculate();
                    }
                }
            }
        }

    }

    this.destroy = function () {
        renderer.destroy();
    }
};

var jumper = new Jumper();