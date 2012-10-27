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
var ground = true;
var bounce = true;
var exaggerated = false;
var stationary = false;
var forward = true;
var face = true;
var canvasWidth = 1000;
var x = 0, y = defaultY, width = 100, height = 100;
var sf = null;
var currentFrame = 0;
var timerId = 0;
var activeSegment = null;
var activeFigure = false;
var currentX = 0, currentY = 0;


$(document).ready(function() {

    var drawFigure = function() {
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        var prevLowestFoot  = sf.hipDrivingFootHorizontalDistance();

        sf.defaultAction();
        $('#display').html(currentFrame);
        sf.drawFigure(ctx);
        sf.updateFrame(forward);

        var newLowestFoot = sf.hipDrivingFootHorizontalDistance();


		ctx.lineWidth = linewidth;
		ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = '#000';
        ctx.stroke();

		if (face) {
	        sf.drawFace(ctx);
			ctx.lineWidth = 1;
	        ctx.stroke();
			ctx.lineWidth = linewidth;
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
		}

        currentFrame = sf.frame;
    };

    var constructFigure = function() {
        var y = defaultY;
        canvasWidth = $('#gofigure-canvas').width();
        action = $('input:radio[name=action]:checked').val();
        direction = $('input:checkbox[name=direction]:checked').val() == 'on' ? 1 : 0;
        exaggerated = $('input:checkbox[name=exaggerated]:checked').val() == 'on';
        border = $('input:checkbox[name=border]:checked').val();
        ground = $('input:checkbox[name=ground]:checked').val();
        bounce = $('input:checkbox[name=bounce]:checked').val();
		stationary = $('input:checkbox[name=stationary]:checked').val() == 'on';
        face = $('input:checkbox[name=face]:checked').val() == 'on';
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
		forward = false;
        if (sf == undefined)
            constructFigure();
        drawFigure();
    });

    $('#step').click(function() {
		forward = true;
        if (sf == undefined)
            constructFigure();
        drawFigure();
    });

    function animloop() {
        if (running) {
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
		forward = true;
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

    $('input[type="radio"]').change(function() {
        action = $('input:radio[name=action]:checked').val();
        sf.defaultAction = eval('sf. ' + action);
    });

    $('input[type="checkbox"]').change(function() {
        constructFigure();
        if (running) {
            clearInterval(timerId);
            running = false;
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

    $('#gofigure-canvas').mousedown(function(ev) {
        var ox = ev.offsetX, oy = ev.offsetY;
		
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
		if (activeFigure) {
			activeFigure = false;
		}
		else {
	        ctx.clearRect(0, 0, w, h);
			sf.drawFigure(ctx);
	        ctx.strokeStyle = '#000';
	        ctx.stroke();
			activeSegment = sf.detectCollision(ox, oy, 3)
			sf.drawSegment(ctx, activeSegment);
	        ctx.strokeStyle = '#f00';
	        ctx.stroke();
		}
    });

    $('#gofigure-canvas').mousemove(function(ev) {
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
		else if (activeSegment != null) {
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

    $('#gofigure-canvas').mouseup(function(ev) {
        var ox = ev.offsetX, oy = ev.offsetY;
		if (activeSegment != null) {
			activeSegment = null;
		}
		if (activeFigure) {
			//activeFigure = false;
		}
    });

    $('#gofigure-canvas').dblclick(function(ev) {
        var ox = ev.offsetX, oy = ev.offsetY;
		if (activeSegment != null) {
			activeSegment = null;
		}
		if (sf.detectCollision(ox, oy, 3)) {
			currentX = ox, currentY = oy;
			activeFigure = true;
	        var canvas = $(canvasName)[0];
	        var ctx = canvas.getContext('2d');
	        var w = canvas.width;
	        var h = canvas.height;
	        ctx.clearRect(0, 0, w, h);
			sf.drawFigure(ctx);
	        ctx.strokeStyle = '#f00';
	        ctx.stroke();
		}
    });


    $('#snapshot').click(function() {
		var str = sf.x + ',' + sf.y + ',' + sf.stringifyAngles();
        $('#figure-live-points').val(str)
    });

    $('#frame').click(function() {
		var str = sf.x + ',' + sf.y + ',' + sf.stringifyAngles();
		var existingAngles = $('#figure-live-points').val();
		existingAngles += '\n' + str;
        $('#figure-live-points').val(existingAngles)
    });

    $('#playback').click(function() {
		var framesOfPoints = [];
        var lines = $('#figure-live-points').val().split('\n');
		lines.forEach(function(line) {
			var data = line.split(',')
			var x = parseInt(data.splice(0, 1)[0])
			var y = parseInt(data.splice(0, 1)[0])
			var angles = data.map(function(d) { return parseInt(d)});
			framesOfPoints.push(new Frame(x, y, $V(angles)))
		})
		sf.frameSet = new FrameSet(framesOfPoints, false);
		sf.frame = 0;
		sf.defaultAction = sf.genericAction;
		startRunning();
    });


    $('#gofigure-canvas').keydown(function(e) {
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
