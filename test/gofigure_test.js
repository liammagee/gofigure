
var frame = 0
    , maxFrames = 3;
var canvasName = '#gofigure-canvas';
var defaultY = 25;
var running = false;
var framerate = 200;
var linewidth = 2;
var action = 'run';
var direction = 0;
var border = true;
var bounce = true;
var exaggerated = false;
var canvasWidth = 1000;
var x = 0, y = defaultY, width = 100, height = 100, xshift;
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
        if (direction == 0)
            sf.offsetX = (sf.offsetX > canvasWidth - 150 ? 0 : sf.offsetX + xshift)
        else
            sf.offsetX = (sf.offsetX < 0 ? canvasWidth - 150 : sf.offsetX - xshift)

        sf.defaultAction();
        sf.drawFigure(ctx);
        sf.updateFrame();

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = '#000';
        ctx.stroke();

        if (border)
            ctx.strokeRect(x, y, width, height);

        currentFrame = sf.frame;
        $('#display').html(currentFrame);
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


    $('#step').click(function() {
        if (sf == undefined)
            constructFigure();
        drawFigure();
    });

    $('#play').click(function() {
            if (running) {
                clearInterval(timerId);
                $('#play').val('play');
                running = false;
            }
            else {
                constructFigure();
                $('#play').val('pause');
                timerId = setInterval(drawFigure, parseInt(framerate));
                running = true;
            }
        }
    );

    $('input').change(function() {
        constructFigure();
        if (running) {
            clearInterval(timerId);
            timerId = setInterval(drawFigure, parseInt(framerate));
        }
        else {
            drawFigure();
        }
    });


    $('#update').click(function() {
        jsonifyFigure();
        drawFigure();
    });


})
