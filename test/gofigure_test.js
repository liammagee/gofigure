// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var frame = 0
    , maxFrames = 3;
var canvasName = '#gofigure-canvas';
var defaultY = 25;
var running = false;
var framerate = 10;
var linewidth = 3;
var xshift = 20;
var action = 'run';
var direction = 0;
var border = true;
var bounce = true;
var exaggerated = false;
var canvasWidth = 1000;
var x = 0, y = defaultY, width = 100, height = 100;
var sf = null;
var currentFrame = 0;
var timerId = 0;


$(document).ready(function() {

    var drawFigure = function() {
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Do offsets
//        if (direction == 0)
//            sf.offsetX = (sf.offsetX > canvasWidth - 150 ? 0 : sf.offsetX + xshift)
//        else
//            sf.offsetX = (sf.offsetX < 0 ? canvasWidth - 150 : sf.offsetX - xshift)

        var prevLowestFoot  = sf.hipDrivingFootHorizontalDistance();

        sf.defaultAction();
        $('#display').html(currentFrame);
        sf.drawFigure(ctx);
        sf.updateFrame();

        var newLowestFoot = sf.hipDrivingFootHorizontalDistance();
//        console.log(newLowestFoot, prevLowestFoot, (newLowestFoot - prevLowestFoot), sf.hipX)
        //sf.offsetX = (sf.offsetX > canvasWidth - 150 ? 0 : sf.offsetX + (newLowestFoot - prevLowestFoot))
        var offsetX = 0;
//        if (sf.frame != 0)
//            offsetX = Math.abs(newLowestFoot - prevLowestFoot)
        if (direction == 0)
            sf.offsetX += 3
        else
            sf.offsetX -= 3
//        if (direction == 0)
//            sf.offsetX = (sf.offsetX > canvasWidth - 150 ? 0 : sf.offsetX + offsetX)
//        else
//            sf.offsetX = (sf.offsetX < 0 ? canvasWidth - 150 : sf.offsetX - offsetX)

        ctx.lineWidth = linewidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = '#000';
        ctx.stroke();

        if (border)
            ctx.strokeRect(x, y, width, height);

        currentFrame = sf.frame;
    };

    var constructFigure = function() {
        var y = defaultY;
        canvasWidth = $('#gofigure-canvas').width();
        action = $('input:radio[name=action]:checked').val();
        direction = $('input:checkbox[name=direction]:checked').val() == 'on' ? 1 : 0;
        exaggerated = $('input:checkbox[name=exaggerated]:checked').val() == 'on';
        border = $('input:checkbox[name=border]:checked').val();
        bounce = $('input:checkbox[name=bounce]:checked').val();
        //framerate = $('input:text[name=framerate]').val();
        framerate = parseInt($('#framerate').val());
        //linewidth = $('input:text[name=linewidth]').val();
        linewidth = parseInt($('#linewidth').val());
        //xshift = parseInt($('input:text[name=xshift]').val());
        xshift = parseInt($('#xshift').val());
        if (bounce && action == 'run') {
            switch (frame) {
                case 0:
                    y = y - 5;
                    break;
                case 1:
                    y = y - 10;
                    break;
                case 2:
                    y = y - 5;
                    break;
                case 3:
                    break;
            }
        }

        sf = new StickFigure(x, y, width, height, exaggerated);
        sf.defaultAction = eval('sf. ' + action);
        sf.frame = currentFrame;
        sf.direction = direction;

        $('#figure-points').val(js_beautify(JSON.stringify(sf)));
    };

    var jsonifyFigure = function() {
        var jsonObj = JSON.parse($('#figure-points').val());
        for (var key in jsonObj) {
            //copy all the fields
            sf[key] = jsonObj[key];
        }
    };


    $('#back').click(function() {
        if (sf == undefined)
            constructFigure();
        drawFigure();
    });

    $('#step').click(function() {
        if (sf == undefined)
            constructFigure();
        drawFigure();
    });

    function animloop() {
        if (running) {
//            window.requestAnimationFrame(animloop);
            setTimeout(function() {
                window.requestAnimationFrame(animloop);
                // Drawing code goes here
            }, 1000 / parseInt(framerate));
            drawFigure();
        }
    };

    var startRunning = function() {
        running = true;
//        timerId = setInterval(drawFigure, 1);
//                timerId = setInterval(drawFigure, parseInt(framerate));
        animloop();
    };

    $('#play').click(function() {
            if (running) {
                clearInterval(timerId);
                $('#play').val('play');
                running = false;
            }
            else {
                constructFigure();
                $('#play').val('pause');
                startRunning();
            }
        }
    );

    $('input').change(function() {
        constructFigure();
        if (running) {
            clearInterval(timerId);
            startRunning();
        }
        else {
            drawFigure();
        }
    });


    $('#update').click(function() {
        jsonifyFigure();
        drawFigure();
    });

    $('#gofigure-canvas').keydown(function(e) {
        console.log(e.which)

    });

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37:
                sf.direction = direction = 1;
                drawFigure();
                break;
            case 39:
                sf.direction = direction = 0;
                drawFigure();
                break;
        }
    });

    constructFigure();
    drawFigure();

})
