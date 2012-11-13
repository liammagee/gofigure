// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var frame = 0
    , maxFrames = 3;
var canvasName = '#gofigure-canvas';
var defaultY = 40;
var running = false;
var framerate = 10;
var linewidth = 3;
var xshift = 20;
var action = 'run';
var style = 'human';
var direction = 0;
var border = true;
var ground = true;
var bounce = true;
var exaggerated = false;
var stationary = false;
var forward = true;
var face = true;
var other = true;
var canvasWidth = 1000;
var x = 0, y = defaultY, width = 100, height = 100;
var sf = null, sf2 = null;
var currentFrame = 0;
var timerId = 0;
var activeSegment = null;
var activeFigure = false;
var currentX = 0, currentY = 0;


$(document).ready(function () {

    var doFigureFrame = function () {
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        var prevLowestFoot = sf.hipDrivingFootHorizontalDistance();

        $('#display').html(currentFrame);

        sf.doAction();
        sf.drawFigure(ctx);
        sf.updateFrame(forward);

        var newLowestFoot = sf.hipDrivingFootHorizontalDistance();
        ctx.lineWidth = linewidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = '#000';
        ctx.stroke();

        if (other) {
            sf2.doAction();
            sf2.drawFigure(ctx);
            sf2.updateFrame(forward);
            ctx.stroke();
        }

        if (face) {
            sf.drawFace(ctx);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.lineWidth = linewidth;

            if (other) {
                sf2.drawFace(ctx);
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.lineWidth = linewidth;
            }
        }

        if (border) {
            ctx.strokeRect(sf.offsetX, y, width, height);
        }
        if (ground) {
            ctx.moveTo(0, y + height);
            ctx.lineTo(w, y + height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000';
            ctx.stroke();
            ctx.lineWidth = linewidth;
        }

        currentFrame = sf.frame;
    };

    var drawDefaultFigure = function (color) {
        color = color || "#000";
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        sf.drawFigure(ctx);
        ctx.strokeStyle = color;
        ctx.stroke();

        if (other) {
            sf2.drawFigure(ctx);
            ctx.strokeStyle = color;
            ctx.stroke();
        }

        if (face) {
            sf.drawFace(ctx);
            ctx.lineWidth = 1;
            ctx.stroke();

            if (other) {
                sf.drawFace(ctx);
                ctx.stroke();
            }
            ctx.lineWidth = linewidth;
        }
    }

    var constructFigure = function () {
        var y = defaultY;
        canvasWidth = $('#gofigure-canvas').width();
        action = $('input:radio[name=action]:checked').val();
        style = $('input:radio[name=style]:checked').val();
        direction = $('input:checkbox[name=direction]:checked').val() == 'on' ? 1 : 0;
        exaggerated = $('input:checkbox[name=exaggerated]:checked').val() == 'on';
        border = $('input:checkbox[name=border]:checked').val();
        ground = $('input:checkbox[name=ground]:checked').val();
        stationary = $('input:checkbox[name=stationary]:checked').val() == 'on';
        face = $('input:checkbox[name=face]:checked').val() == 'on';
        other = $('input:checkbox[name=other]:checked').val() == 'on';
        //framerate = $('input:text[name=framerate]').val();
        framerate = parseInt($('#framerate').val());
        //linewidth = $('input:text[name=linewidth]').val();
        linewidth = parseInt($('#linewidth').val());
        //xshift = parseInt($('input:text[name=xshift]').val());
        xshift = parseInt($('#xshift').val());

        sf = new StickFigure(width  * .2, height * .4, width, height, exaggerated);
        sf.windAroundCanvas = true;
        sf.defaultAction = StickFigure.Running;
        sf.style = style;
        sf.frame = currentFrame;
        sf.direction = direction;
        sf.stationary = stationary;


        if (other) {
            var altX =  canvasWidth / 2 - width;
            sf2 = new StickFigure(altX, height * .4, width, height, exaggerated);
            sf2.windAroundCanvas = true;
            sf2.defaultAction = StickFigure.Running;
            sf2.frame = currentFrame;
            sf2.direction = ! direction;
            sf2.stationary = stationary;
        }


        $('#figure-points').val(js_beautify(JSON.stringify(sf)));
    };

    var jsonifyFigure = function () {
        var jsonObj = JSON.parse($('#figure-points').val());
        for (var key in jsonObj) {
            //copy all the fields
            sf[key] = jsonObj[key];
        }
    };

    var makeFigureActive = function () {
        activeFigure = true;
        drawDefaultFigure('#f00');
    };


    $('#back').click(function () {
        forward = false;
        if (sf == undefined)
            constructFigure();
        doFigureFrame();
    });

    $('#step').click(function () {
        forward = true;
        if (sf == undefined)
            constructFigure();
        doFigureFrame();
    });

    function animationLoop() {
        if (running) {
            setTimeout(function () {
                window.requestAnimationFrame(animationLoop);
            }, 1000 / parseInt(framerate));
            doFigureFrame();
        }
    };

    var startRunning = function () {
        running = true;
//        timerId = setInterval(doFigureFrame, 1);
                timerId = setInterval(doFigureFrame, parseInt(1000 / framerate));

        //   requestAnimationFrame should be faster - having trouble with restarts
        // animationLoop();
    };

    $('#play').click(function () {
        forward = true;
        if (running) {
            clearInterval(timerId);
            $('#play').val('play');
            running = false;
        }
        else {
            //constructFigure();
            $('#play').val('pause');
            startRunning();
        }
    });

    var setAction = function(figure, action) {
        switch(action) {
            case "run":
                figure.defaultAction = StickFigure.Running;
                break;
            case "bounce":
                figure.defaultAction = StickFigure.RunAndBounce;
                break;
            case "walk":
                figure.defaultAction = StickFigure.Walking;
                break;
            case "expire":
                figure.defaultAction = StickFigure.Expire;
                break;
            case "explode":
                figure.defaultAction = StickFigure.Explode;
                break;
            case "stand":
                figure.defaultAction = StickFigure.Stand;
                break;
            case "speak":
                figure.defaultAction = StickFigure.Speak;
                break;
        }
    }

    $('input[type="radio"]').change(function () {
        action = $('input:radio[name=action]:checked').val();
        style = $('input:radio[name=style]:checked').val();
        var actionFunc = StickFigure.Running;
        sf.frame = 0;
        sf.style = style;
        setAction(sf, action);
        if (other) {
            sf2.frame = sf.frame;
            sf2.style = sf.style;
            sf2.defaultAction = sf.defaultAction;
        }
    });



    $('input[type="checkbox"]').change(function () {
        constructFigure();
        if (running) {
            clearInterval(timerId);
            running = false;
            startRunning();
        }
        else {
            doFigureFrame();
        }
    });


    $('#plus').click(function () {
        if (sf.width < 200) {
            sf.width *= 1.1;
            sf.height *= 1.1;
            sf.generateDimensions();
            sf.generateCoordinates();
            drawDefaultFigure();
        }
    });

    $('#minus').click(function () {
        if (sf.width > 10) {
            sf.width /= 1.1;
            sf.height /= 1.1;
            sf.generateDimensions();
            sf.generateCoordinates();
            drawDefaultFigure();
        }
    });

    $('#highlight').click(function () {
        currentX = sf.x + (sf.width / 2), currentY = sf.y + (sf.height / 2);
        makeFigureActive();
    });

    $('#update').click(function () {
        jsonifyFigure();
        doFigureFrame();
    });

    $('#gofigure-canvas').mousedown(function (ev) {
        var ox = ev.offsetX, oy = ev.offsetY;

        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;

        var segment = sf.detectCollision(ox, oy, 1);
        if (activeFigure) {
            activeFigure = false;
            drawDefaultFigure();
        }
        else if (segment != null) {
            drawDefaultFigure();
            if (activeSegment != segment) {
                activeSegment = segment;
                sf.drawSegment(ctx, activeSegment);
                ctx.strokeStyle = '#f00';
                ctx.stroke();
            }
            else {
                activeSegment = null;
            }
        }
        else if (activeSegment != null) {
            ctx.clearRect(0, 0, w, h);
            sf.recalibrateSegment(activeSegment, ox, oy);
            sf.generateCoordinates();
            drawDefaultFigure();
            sf.drawSegment(ctx, activeSegment);
            ctx.strokeStyle = '#f00';
            ctx.stroke();
            activeFigure = false;
        }
    });

    $('#gofigure-canvas').mousemove(function (ev) {
        var ox = ev.offsetX, oy = ev.offsetY;
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        if (activeFigure) {
            var dx = ox - currentX, dy = oy - currentY;
            currentX = ox, currentY = oy;
            sf.x += dx;
            sf.y += dy;
            //sf.shiftY(dy);
            ctx.clearRect(0, 0, w, h);
            sf.generateCoordinates();
            sf.drawFigure(ctx);
            ctx.strokeStyle = '#f00';
            ctx.stroke();
        }
        else if (activeSegment != null && ev.which > 0) {
            ctx.clearRect(0, 0, w, h);
            sf.recalibrateSegment(activeSegment, ox, oy);
            sf.generateCoordinates();
            sf.drawFigure(ctx);
            ctx.strokeStyle = '#000';
            ctx.stroke();
            sf.drawSegment(ctx, activeSegment);
            ctx.strokeStyle = '#f00';
            ctx.stroke();
            $('#figure-points').val(js_beautify(JSON.stringify(sf)));
        }
    });

    $('#gofigure-canvas').mouseup(function (ev) {
        var ox = ev.offsetX, oy = ev.offsetY;
        if (activeSegment != null) {
            //activeSegment = null;
        }
        if (activeFigure) {
            activeFigure = false;
            activeSegment = null;
        }
    });

    $('#gofigure-canvas').dblclick(function (ev) {
        var ox = ev.offsetX, oy = ev.offsetY;
        if (activeSegment != null) {
            activeSegment = null;
        }
        if (sf.detectCollision(ox, oy, 3)) {
            currentX = ox, currentY = oy;
            makeFigureActive();
        }
    });


    $('#snapshot').click(function () {
        var str = sf.x + ',' + sf.y + ',' + sf.stringifyAngles();
        $('#figure-live-points').val(str)
    });

    $('#frame').click(function () {
        var str = sf.x + ',' + sf.y + ',' + sf.stringifyAngles();
        var existingAngles = $('#figure-live-points').val();
        existingAngles += '\n' + str;
        $('#figure-live-points').val(existingAngles)
    });

    $('#playback').click(function () {
        var framesOfPoints = [];
        var lines = $('#figure-live-points').val().split('\n');
        lines.forEach(function (line) {
            var data = line.split(',')
            var x = parseInt(data.splice(0, 1)[0])
            var y = parseInt(data.splice(0, 1)[0])
            var angles = data.map(function (d) {
                return parseInt(d)
            });
            framesOfPoints.push(new Frame(x, y, $V(angles)))
        })
        sf.frameSet = new FrameSet(framesOfPoints, false);
        sf.frame = 0;
        sf.defaultAction = undefined;// StickFigure.Running;
        startRunning();
    });

    $('#action').click(function () {
        sf.BaseFrame();
        var existingAngles = sf.x + ',' + sf.y + ','+ sf.stringifyAngles();
        var frameSet = sf.defaultAction(),
            cumulative = frameSet.cumulative;
        var currentFrame = [];
        for (var i = 0; i < frameSet.frames.length; i++) {
            sf.doAction();
            sf.updateFrame();
            var str = sf.stringifyAngles();
            existingAngles += '\n' + sf.x + ',' + sf.y + ','+ str;
        }
        $('#figure-live-points').val(existingAngles)
    });

    $('#speak').click(function () {
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        drawDefaultFigure();
        var speakValue = $('#speakValue').val();
        if (speakValue == '')
            speakValue = action;

        ctx.strokeStyle = '#000';

        sf.drawSpeechBubble(ctx, speakValue);
        ctx.stroke();
        if (other) {
            setAction(sf2, speakValue);
        }
        ctx.stroke();
    });


    $('#gofigure-canvas').keydown(function (e) {
        switch (e.which) {
            case 37:
                sf.direction = direction = 1;
                doFigureFrame();
                break;
            case 39:
                sf.direction = direction = 0;
                doFigureFrame();
                break;
        }
    });

    constructFigure();
    doFigureFrame();

})
