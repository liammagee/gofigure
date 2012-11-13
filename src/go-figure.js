/*
 * Draws a stick figure in various poses and animations.
 * https://github.com/doclm/figurestick
 *
 * Copyright (c) 2012 Liam Magee
 * Licensed under the MIT, GPL licenses.
 */



/**
 * Stick Figure class definition
 *
 * @constructor
 */
Frame = function(_x, _y, _angles) {
    this.x = _x;
    this.y = _y;
    this.angles = _angles;
};

FrameSet = function(_frames, _cumulative) {
    this.frames = _frames;
    this.cumulative = _cumulative;
};

StickFigure = function(_x, _y, _width, _height, _exaggerated) {


    this.BaseFrame = function() {
        var base    = $V([90, 90, 90,   90, 90, 90, 90, 90, 90,   	90, 90, 90, 90, 90, 90]);
        return new Frame(0, 0, base);
    }


    this.drawFigure = function(context) {
        if (this.windAroundCanvas) {
            if (this.hipX > context.canvas.width) {
                this.x = 0;
                this.generateCoordinates();
            }
            else if (this.hipX < 0) {
                this.x = context.canvas.width - this.originHipX;
                this.generateCoordinates();
            }
        }

        context.beginPath();

        // Torso
        context.moveTo(this.hipX, this.hipY);
        context.lineTo(this.shoulderX, this.shoulderY);

        // Neck
        context.moveTo(this.shoulderX, this.shoulderY);
        context.lineTo(this.neckX, this.neckY);

        // Head
        switch (this.style) {
            case 'robot':
                this.bHandAngle = this.bElbowAngle;
                this.fHandAngle = this.fElbowAngle;
                this.bElbowAngle = this.bShoulderAngle;
                this.fElbowAngle = this.fShoulderAngle;
                this.bKneeAngle = this.bHipAngle;
                this.fKneeAngle = this.fHipAngle;
                this.generateCoordinates();

                context.moveTo(this.headX, this.headY + this.headRadius);
                context.lineTo(this.headX - this.headRadius, this.headY + this.headRadius);
                context.moveTo(this.headX - this.headRadius, this.headY + this.headRadius);
                context.lineTo(this.headX - this.headRadius, this.headY - this.headRadius);
                context.moveTo(this.headX - this.headRadius, this.headY - this.headRadius);
                context.lineTo(this.headX + this.headRadius, this.headY - this.headRadius);
                context.moveTo(this.headX + this.headRadius, this.headY - this.headRadius);
                context.lineTo(this.headX + this.headRadius, this.headY + this.headRadius);
                context.moveTo(this.headX + this.headRadius, this.headY + this.headRadius);
                context.lineTo(this.headX, this.headY + this.headRadius);
                break;
            case 'zombie':
                this.headAngle -= Math.PI / 2;
                this.generateCoordinates();

                context.moveTo(this.headX + this.headRadius, this.headY);
                context.arc(this.headX, this.headY, this.headRadius, 0, Math.PI * 2, false);
                break;
            case 'human':
            default:
                context.moveTo(this.headX + this.headRadius, this.headY);
                context.arc(this.headX, this.headY, this.headRadius, 0, Math.PI * 2, false);
        }

        // Face
        //this.drawFace(context);


        // Front arm
        context.moveTo(this.shoulderX, this.shoulderY);
        context.lineTo(this.fElbowX, this.fElbowY);
        context.moveTo(this.fElbowX, this.fElbowY);
        context.lineTo(this.fHandX, this.fHandY);
        context.moveTo(this.fHandX, this.fHandY);
        context.lineTo(this.fFingerX, this.fFingerY);

        // Back arm
        context.moveTo(this.shoulderX, this.shoulderY);
        context.lineTo(this.bElbowX, this.bElbowY);
        context.moveTo(this.bElbowX, this.bElbowY);
        context.lineTo(this.bHandX, this.bHandY);
        context.moveTo(this.bHandX, this.bHandY);
        context.lineTo(this.bFingerX, this.bFingerY);


        // Front leg
        context.moveTo(this.hipX, this.hipY);
        context.lineTo(this.fKneeX, this.fKneeY);
        context.moveTo(this.fKneeX, this.fKneeY);
        context.lineTo(this.fFootX, this.fFootY);
        context.moveTo(this.fFootX, this.fFootY);
        context.lineTo(this.fToeX, this.fToeY);

        // Back leg
        context.moveTo(this.hipX, this.hipY);
        context.lineTo(this.bKneeX, this.bKneeY);
        context.moveTo(this.bKneeX, this.bKneeY);
        context.lineTo(this.bFootX, this.bFootY);
        context.moveTo(this.bFootX, this.bFootY);
        context.lineTo(this.bToeX, this.bToeY);

        context.closePath();


    };

    this.drawFace = function(context) {
        // Eyes
        var eyePos = - 0.15,
            eyeRadius = 0.5,
            eyeSize = this.headRadius * 0.1,
            eyeX = Math.floor(this.headX + Math.cos(Math.PI * eyePos) * this.headRadius * eyeRadius),
            eyeY = Math.floor(this.headY + Math.sin(Math.PI * eyePos) * this.headRadius * eyeRadius);

        // Mouth
        var mouthPos = - 1.85,
            mouthLen = 0.65,
            mouthEndX = this.headX + Math.cos(Math.PI * mouthPos) * this.headRadius,
            mouthEndY = this.headY + Math.sin(Math.PI * mouthPos) * this.headRadius,
            mouthStartX = mouthEndX - (this.headRadius * mouthLen),
            mouthStartY = mouthEndY;

        if (direction == 1) {
            eyeX = this.headX - eyeX;
            mouthEndX = this.headX - mouthEndX;
            mouthStartX = this.headX - mouthStartX;
        }
        context.save();
        context.beginPath();
        context.moveTo(eyeX, eyeY);
        context.arc(eyeX, eyeY, eyeSize, 0, Math.PI * 2, false);
        context.moveTo(mouthEndX, mouthEndY);
        context.lineTo(mouthStartX, mouthStartY);
        context.closePath();
        context.restore();
    };

    this.drawSpeechBubble = function(context, message) {
        message = message || 'hello';
        var metrics = context.measureText(message)
            , textWidth = metrics.width;

        // Mouth
        var mouthPos = - 1.85,
            mouthLen = 0.65,
            mouthEndX = this.headX + Math.cos(Math.PI * mouthPos) * this.headRadius,
            mouthEndY = this.headY + Math.sin(Math.PI * mouthPos) * this.headRadius,
            mouthStartX = mouthEndX - (this.headRadius * mouthLen),
            mouthStartY = mouthEndY;
        var bubbleCenterX = (this.headX / 2) + (this.headRadius * 3) + (textWidth / 2)
            , bubbleCenterY = this.headY - (this.headRadius * 2)
            , bubbleRadius = 10 * (Math.pow(textWidth / 10, 0.75));

        if (direction == 1) {
            mouthEndX = this.headX - mouthEndX;
        }
        // save state
        context.save();

        // scale context horizontally
        context.scale(2, 1);


        var btnAngle = Math.PI * 1.75
            , btnX = bubbleCenterX - Math.cos(btnAngle) * bubbleRadius
            , btnY = bubbleCenterY - Math.sin(btnAngle) * bubbleRadius;
        context.beginPath();
        context.arc(bubbleCenterX, bubbleCenterY, bubbleRadius, Math.PI, Math.PI + btnAngle, false);
        context.moveTo(bubbleCenterX - bubbleRadius, bubbleCenterY);
        context.lineTo(mouthEndX / 2, mouthEndY);
        context.moveTo(btnX, btnY);
        context.lineTo(mouthEndX / 2, mouthEndY);
        context.closePath();

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(message, bubbleCenterX, bubbleCenterY);

        // save state
        context.restore();
    };

    this.drawSegment = function(context, segment) {
        context.beginPath();
        switch(segment) {
            case this.segments.head:
                context.moveTo(this.headX + this.headRadius, this.headY);
                context.arc(this.headX, this.headY, this.headRadius, 0, Math.PI * 2, false);
                break;
            case this.segments.neck:
                context.moveTo(this.shoulderX, this.shoulderY);
                context.lineTo(this.neckX, this.neckY);
                break;
            case this.segments.trunk:
                context.moveTo(this.hipX, this.hipY);
                context.lineTo(this.shoulderX, this.shoulderY);
                break;
            case this.segments.frontUpperArm:
                context.moveTo(this.shoulderX, this.shoulderY);
                context.lineTo(this.fElbowX, this.fElbowY);
                break;
            case this.segments.frontLowerArm:
                context.moveTo(this.fElbowX, this.fElbowY);
                context.lineTo(this.fHandX, this.fHandY);
                break;
            case this.segments.frontHand:
                context.moveTo(this.fHandX, this.fHandY);
                context.lineTo(this.fFingerX, this.fFingerY);
                break;
            case this.segments.backUpperArm:
                context.moveTo(this.shoulderX, this.shoulderY);
                context.lineTo(this.bElbowX, this.bElbowY);
                break;
            case this.segments.backLowerArm:
                context.moveTo(this.bElbowX, this.bElbowY);
                context.lineTo(this.bHandX, this.bHandY);
                break;
            case this.segments.backHand:
                context.moveTo(this.bHandX, this.bHandY);
                context.lineTo(this.bFingerX, this.bFingerY);
                break;
            case this.segments.frontUpperLeg:
                context.moveTo(this.hipX, this.hipY);
                context.lineTo(this.fKneeX, this.fKneeY);
                break;
            case this.segments.frontLowerLeg:
                context.moveTo(this.fKneeX, this.fKneeY);
                context.lineTo(this.fFootX, this.fFootY);
                break;
            case this.segments.frontFoot:
                context.moveTo(this.fFootX, this.fFootY);
                context.lineTo(this.fToeX, this.fToeY);
                break;
            case this.segments.backUpperLeg:
                context.moveTo(this.hipX, this.hipY);
                context.lineTo(this.bKneeX, this.bKneeY);
                break;
            case this.segments.backLowerLeg:
                context.moveTo(this.bKneeX, this.bKneeY);
                context.lineTo(this.bFootX, this.bFootY);
                break;
            case this.segments.backFoot:
                context.moveTo(this.bFootX, this.bFootY);
                context.lineTo(this.bToeX, this.bToeY);
                break;
        }

        context.closePath();

    };

    this.recalibrateSegment = function(segment, x, y) {
        if (segment == this.segments.head) {
            this.headAngle = - this.segmentAngle(x, y, this.headX, this.headY);
        }
        else if (segment == this.segments.neck) {
            this.neckAngle = - this.segmentAngle(x, y, this.neckX, this.neckY);
        }
        else if (segment == this.segments.trunk) {
            this.torsoAngle = - this.segmentAngle(x, y, this.hipX, this.hipY);
        }
        else if (segment == this.segments.frontUpperArm) {
            var diff = this.adjustAngles(x, y, this.shoulderX, this.shoulderY, this.fShoulderAngle);
            this.fShoulderAngle += diff;
            this.fElbowAngle += diff;
            this.fHandAngle += diff;
        }
        else if (segment == this.segments.frontLowerArm) {
            var diff = this.adjustAngles(x, y, this.fElbowX, this.fElbowY, this.fElbowAngle);
            this.fElbowAngle += diff;
            this.fHandAngle += diff;
        }
        else if (segment == this.segments.frontHand) {
            this.fHandAngle = this.segmentAngle(x, y, this.fHandX, this.fHandY);
        }
        else if (segment == this.segments.backUpperArm) {
            var diff = this.adjustAngles(x, y, this.shoulderX, this.shoulderY, this.bShoulderAngle);
            this.bShoulderAngle += diff;
            this.bElbowAngle += diff;
            this.bHandAngle += diff;
        }
        else if (segment == this.segments.backLowerArm) {
            var diff = this.adjustAngles(x, y, this.bElbowX, this.bElbowY, this.bElbowAngle);
            this.bElbowAngle += diff;
            this.bHandAngle += diff;
        }
        else if (segment == this.segments.backHand) {
            this.bHandAngle = this.segmentAngle(x, y, this.bHandX, this.bHandY);
        }
        else if (segment == this.segments.frontUpperLeg) {
            var diff = this.adjustAngles(x, y, this.hipX, this.hipY, this.fHipAngle);
            this.fHipAngle += diff;
            this.fKneeAngle += diff;
            this.fFootAngle += diff;
        }
        else if (segment == this.segments.frontLowerLeg) {
            var diff = this.adjustAngles(x, y, this.fKneeX, this.fKneeY, this.fKneeAngle);
            this.fKneeAngle += diff;
            this.fFootAngle += diff;
        }
        else if (segment == this.segments.frontFoot) {
            this.fFootAngle = this.segmentAngle(x, y, this.fFootX, this.fFootY);
        }
        else if (segment == this.segments.backUpperLeg) {
            var diff = this.adjustAngles(x, y, this.hipX, this.hipY, this.bHipAngle);
            this.bHipAngle += diff;
            this.bKneeAngle += diff;
            this.bFootAngle += diff;
        }
        else if (segment == this.segments.backLowerLeg) {
            var diff = this.adjustAngles(x, y, this.bKneeX, this.bKneeY, this.bKneeAngle);
            this.bKneeAngle += diff;
            this.bFootAngle += diff;
        }
        else if (segment == this.segments.backFoot) {
            this.bFootAngle = this.segmentAngle(x, y, this.bFootX, this.bFootY);
        }
    };



    /**
     * Adjusts a series of angles, based on the segment angle of the joint, and using the difference between
     * that and the first parameter angle to determine other angle deltas
     */
    this.adjustAngles = function(x, y, jointX, jointY, mainAngle) {
        var newAngle = this.segmentAngle(x, y, jointX, jointY);
        return newAngle - mainAngle;
    };

    this.segmentAngle = function(x, y, jointX, jointY) {
        var dx = x - jointX, dy = y - jointY;
        var theta = Math.atan(dy / dx);
        if (dx < 0)
            theta += Math.PI;
        return theta;
    };

    this.updateFrame = function(forward) {
        forward = forward || true;
        if (forward) {
            this.frame = (this.frame == this.maxFrames - 1 ? 0 : this.frame + 1);
        }
        else {
            this.frame = (this.frame == 0 ? this.maxFrames - 1 : this.frame - 1);
        }
    };



    // Stick figure actions

    // Standing
    this.stand = function() {
        if (this.direction == 1) {
            this.flipHorizontalDirection();
        }
        this.generateCoordinates();
    };


    // Do Action
    this.doAction = function(actionFunction) {
        var that = this,
            actionFunction = actionFunction || that.defaultAction,
            base = this.BaseFrame(),
            frameSet = actionFunction ? actionFunction() : this.frameSet,
            cumulative = frameSet.cumulative,
            frames = frameSet.frames;
        this.maxFrames = frames.length;
        var workingAngles = base.angles;

        currentFrame = frames[this.frame];
        if (cumulative) {
            for (var i = 0; i <= this.frame ; i++) {
                var angles = frames[i].angles;
                workingAngles = workingAngles.add(angles);
            }
        }
        else {
            workingAngles = workingAngles.add(currentFrame.angles);
        }
        workingAngles = workingAngles.map(function(e) { return that.radians(e) });
        this.updateFromVector(workingAngles);

        if (! stationary) {
            if (cumulative) {
                this.shiftX(currentFrame.x);
                this.shiftY(currentFrame.y);
            }
            else {
                this.x = currentFrame.x;
                this.y = currentFrame.y;
            }
        }

        if (this.direction == 1)
            this.flipHorizontalDirection();

        this.generateCoordinates();
    };


    this.updateFromVector = function(v) {
        this.headAngle = v.e(1);
        this.neckAngle = v.e(2);
        this.torsoAngle = v.e(3);

        this.fShoulderAngle = v.e(4);
        this.fElbowAngle = v.e(5);
        this.fHandAngle = v.e(6);
        this.bShoulderAngle = v.e(7);
        this.bElbowAngle = v.e(8);
        this.bHandAngle = v.e(9);

        this.fHipAngle = v.e(10);
        this.fKneeAngle = v.e(11);
        this.fFootAngle = v.e(12);
        this.bHipAngle = v.e(13);
        this.bKneeAngle = v.e(14);
        this.bFootAngle = v.e(15);
    }

    this.defaultAction = StickFigure.Running;


    // Utility functions
    this.flipHorizontalDirection = function() {
        this.headAngle = Math.PI - this.headAngle;

        this.torsoAngle = Math.PI - this.torsoAngle;
        this.neckAngle = Math.PI - this.neckAngle;

        this.fShoulderAngle = (Math.PI - this.fShoulderAngle);
        this.fElbowAngle = (Math.PI - this.fElbowAngle);
        this.fHandAngle = (Math.PI - this.fHandAngle);
        this.bShoulderAngle = (Math.PI - this.bShoulderAngle);
        this.bElbowAngle = (Math.PI - this.bElbowAngle);
        this.bHandAngle = (Math.PI - this.bHandAngle);

        this.fHipAngle = (Math.PI - this.fHipAngle);
        this.fKneeAngle = (Math.PI - this.fKneeAngle);
        this.fFootAngle = (Math.PI - this.fFootAngle);
        this.bHipAngle = (Math.PI - this.bHipAngle);
        this.bKneeAngle = (Math.PI - this.bKneeAngle);
        this.bFootAngle = (Math.PI - this.bFootAngle);
    };

    this.flipVerticalDirection = function() {
        this.y = this.y + this.height;
        this.wholeBodyLength = (this.height * 1);
        this.headRadius = (this.wholeBodyLength / 8) + 0.5 | 0;
        this.torsoLength = -this.torsoLength;
//        this.shoulderPoint = -this.shoulderPoint;
        this.shoulderToElbowLength = -this.shoulderToElbowLength;
        this.elbowToHandLength = -this.elbowToHandLength;
        this.hipToKneeLength = -this.hipToKneeLength;
        this.kneeToFootLength = -this.kneeToFootLength;
//        this.startOfHeadY = this.y + this.headRadius;
//        this.startOfBodyY = this.y - this.headRadius;
//        this.startOfShoulderY = this.startOfBodyY + this.shoulderPoint;
//        this.startOfHipY = this.startOfBodyY + this.torsoLength;

    };

    this.piSeg = function(val) {
        return Math.PI * (val / 12);
    };

    this.radians = function(val) {
        return Math.PI * (val / 180);
    };

    this.degrees = function(val) {
        return Math.round(180 * (val / Math.PI));
    };

    this.deviationInDegrees = function(val) {
        return this.degrees(val) - 90;
    };

    this.generateCoordinates = function() {
        this.hipX = Math.floor(this.originHipX + this.x);
        this.hipY = Math.floor(this.originHipY + this.y);
        //this.hipX = Math.floor(this.originHipX + this.x);
//        this.hipY = Math.floor(this.originHipY + this.y);

        this.shoulderX = Math.floor(this.hipX + Math.cos( - this.torsoAngle) * this.torsoLength);
        this.shoulderY = Math.floor(this.hipY + Math.sin( - this.torsoAngle) * this.torsoLength);

        this.neckX = Math.floor(this.shoulderX + Math.cos( - this.neckAngle) * this.neckLength);
        this.neckY = Math.floor(this.shoulderY + Math.sin( - this.neckAngle) * this.neckLength);

        this.headX = Math.floor(this.neckX + Math.cos( - this.headAngle) * this.headRadius);
        this.headY = Math.floor(this.neckY + Math.sin( - this.headAngle) * this.headRadius);

//        this.shoulderX = Math.floor(this.x + Math.cos(this.headAngle) * this.headRadius);
//        this.shoulderY = Math.floor(this.startOfHeadY + Math.sin(this.headAngle) * this.headRadius);
//        this.hipX = Math.floor(this.x + Math.cos(this.headAngle) * this.headRadius);
//        this.hipY = Math.floor(this.startOfHeadY + Math.sin(this.headAngle) * this.headRadius);

        this.fElbowX = Math.floor(this.shoulderX + Math.cos(this.fShoulderAngle) * this.shoulderToElbowLength);
        this.fElbowY = Math.floor(this.shoulderY + Math.sin(this.fShoulderAngle) * this.shoulderToElbowLength);
        this.fHandX = Math.floor(this.fElbowX + Math.cos(this.fElbowAngle) * this.elbowToHandLength);
        this.fHandY = Math.floor(this.fElbowY + Math.sin(this.fElbowAngle) * this.elbowToHandLength);
        this.fFingerX = Math.floor(this.fHandX + Math.cos(this.fHandAngle) * this.handLength);
        this.fFingerY = Math.floor(this.fHandY + Math.sin(this.fHandAngle) * this.handLength);

        this.bElbowX = Math.floor(this.shoulderX + Math.cos(this.bShoulderAngle) * this.shoulderToElbowLength);
        this.bElbowY = Math.floor(this.shoulderY + Math.sin(this.bShoulderAngle) * this.shoulderToElbowLength);
        this.bHandX = Math.floor(this.bElbowX + Math.cos(this.bElbowAngle) * this.elbowToHandLength);
        this.bHandY = Math.floor(this.bElbowY + Math.sin(this.bElbowAngle) * this.elbowToHandLength);
        this.bFingerX = Math.floor(this.bHandX + Math.cos(this.bHandAngle) * this.handLength);
        this.bFingerY = Math.floor(this.bHandY + Math.sin(this.bHandAngle) * this.handLength);


        this.fKneeX = Math.floor(this.hipX + Math.cos(this.fHipAngle) * this.hipToKneeLength);
        this.fKneeY = Math.floor(this.hipY + Math.sin(this.fHipAngle) * this.hipToKneeLength);
        this.fFootX = Math.floor(this.fKneeX + Math.cos(this.fKneeAngle) * this.kneeToFootLength);
        this.fFootY = Math.floor(this.fKneeY + Math.sin(this.fKneeAngle) * this.kneeToFootLength);
        this.fToeX = Math.floor(this.fFootX + Math.cos(this.fFootAngle) * this.footLength);
        this.fToeY = Math.floor(this.fFootY + Math.sin(this.fFootAngle) * this.footLength);

        this.bKneeX = Math.floor(this.hipX + Math.cos(this.bHipAngle) * this.hipToKneeLength);
        this.bKneeY = Math.floor(this.hipY + Math.sin(this.bHipAngle) * this.hipToKneeLength);
        this.bFootX = Math.floor(this.bKneeX + Math.cos(this.bKneeAngle) * this.kneeToFootLength);
        this.bFootY = Math.floor(this.bKneeY + Math.sin(this.bKneeAngle) * this.kneeToFootLength);
        this.bToeX = Math.floor(this.bFootX + Math.cos(this.bFootAngle) * this.footLength);
        this.bToeY = Math.floor(this.bFootY + Math.sin(this.bFootAngle) * this.footLength);
    };

    this.generateNormalDimensions = function() {

        // Taken from: http://www.idrawdigital.com/2009/01/tutorial-anatomy-and-proportion/
        // http://www.idrawdigital.com/wp-content/uploads/2009/01/prop_male.gif
        // http://www.idrawdigital.com/wp-content/uploads/2009/01/prop_female.gif

        this.wholeBodyLength = this.height * 1;

        // Generate hip co-ordinates
        this.originHipX = this.x + (this.width / 2) ,
            this.originHipY = this.y + (this.height * 10 / 24);

        // 1/8 = 3 / 24
        this.headRadius = this.proportionOfBody(3 / (24 * 2));

        // 1/24
        this.neckLength = this.proportionOfBody(1 / 24);

        // 1/4 = 6/24
        this.torsoLength = this.proportionOfBody(6 / 24);

        // 5/24
        this.shoulderToElbowLength = this.proportionOfBody(5 / 24);
        // 3/24
        this.elbowToHandLength = this.proportionOfBody(3 / 24);
        // 2/24
        this.handLength = this.proportionOfBody(2 / 24);

        // 8/24
        this.hipToKneeLength = this.proportionOfBody(7 / 24);
        // 8/24
        this.kneeToFootLength = this.proportionOfBody(7 / 24);
        // 2/24
        this.footLength = this.proportionOfBody(2 / 24);
    };

    this.generateExaggeratedDimensions = function() {
        // Taken from: http://www.idrawdigital.com/2009/01/tutorial-anatomy-and-proportion/
        // http://www.idrawdigital.com/wp-content/uploads/2009/01/prop_male.gif
        // http://www.idrawdigital.com/wp-content/uploads/2009/01/prop_female.gif

        this.wholeBodyLength = this.height * 1;

        this.originHipX = this.x + (this.width / 2) ,
            this.originHipY = this.y + (this.height * 12 / 24);

        // 1/4 = 6 / 24
        this.headRadius = this.proportionOfBody(6 / (24 * 2));

        // 1/24
        this.neckLength = this.proportionOfBody(1 / 24);

        // 1/4 = 6/24
        this.torsoLength = this.proportionOfBody(6 / 24);

        // 5/24
        this.shoulderToElbowLength = this.proportionOfBody(5 / 24);
        // 3/24
        this.elbowToHandLength = this.proportionOfBody(3 / 24);
        // 2/24
        this.handLength = this.proportionOfBody(2 / 24);

        // 6/24 - foreshortened
        this.hipToKneeLength = this.proportionOfBody(6 / 24);
        // 6/24
        this.kneeToFootLength = this.proportionOfBody(6 / 24);
        // 2/24
        this.footLength = this.proportionOfBody(2 / 24);
    };

    this.generateDimensions = function() {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        if (this.exaggerated)
            this.generateExaggeratedDimensions();
        else
            this.generateNormalDimensions();
    };

    this.proportionOfBody = function(proportion) {
        return (this.wholeBodyLength * proportion) + 0.5 | 0;
    };

    this.shiftX = function(percentage) {
        var offset = ((percentage / 100) * this.width);
        this.x += (this.direction == 0 ? offset : (- offset));
    };

    this.shiftY = function(percentage) {
        this.y = ((percentage / 100) * this.height);
    };

    this.hipDrivingFootHorizontalDistance = function() {
        if (!this.hipX)
            return 0;
        return (this.lowestFoot() - this.hipX);
    }

    this.lowestFoot = function() {
        if (! this.hipX)
            return 0;
        return this.fFootY > this.bFootY ? this.fFootX : this.bFootX;
    }


    /**
     * Detects whether co-ordinates hit part of the figure
     */
    this.detectCollision = function(x, y, margin) {
        var nx = x - this.originHipX, ny = y - this.originHipY, np = [x, y];
        margin = margin || 1;
        var b = this.getCoords();
        if (this.checkPointBounds(b.head, b.neck, np, margin)) {
            return this.segments.head;
        }
        else if (this.checkPointBounds(b.neck, b.shoulder, np, margin)) {
            return this.segments.neck;
        }
        else if (this.checkPointBounds(b.shoulder, b.hip, np, margin)) {
            return this.segments.trunk;
        }
        else if (this.checkPointBounds(b.shoulder, b.fElbow, np, margin)) {
            return this.segments.frontUpperArm;
        }
        else if (this.checkPointBounds(b.shoulder, b.bElbow, np, margin)) {
            return this.segments.backUpperArm;
        }
        else if (this.checkPointBounds(b.fElbow, b.fHand, np, margin)) {
            return this.segments.frontLowerArm;
        }
        else if (this.checkPointBounds(b.bElbow, b.bHand, np, margin)) {
            return this.segments.backLowerArm;
        }
        else if (this.checkPointBounds(b.fHand, b.fFinger, np, margin)) {
            return this.segments.frontHand;
        }
        else if (this.checkPointBounds(b.bHand, b.bFinger, np, margin)) {
            return this.segments.backHand;
        }
        else if (this.checkPointBounds(b.hip, b.fKnee, np, margin)) {
            return this.segments.frontUpperLeg;
        }
        else if (this.checkPointBounds(b.hip, b.bKnee, np, margin)) {
            return this.segments.backUpperLeg;
        }
        else if (this.checkPointBounds(b.fKnee, b.fFoot, np, margin)) {
            return this.segments.frontLowerLeg;
        }
        else if (this.checkPointBounds(b.bKnee, b.bFoot, np, margin)) {
            return this.segments.backLowerLeg;
        }
        else if (this.checkPointBounds(b.fFoot, b.fToe, np, margin)) {
            return this.segments.frontFoot;
        }
        else if (this.checkPointBounds(b.bFoot, b.bToe, np, margin)) {
            return this.segments.backFoot;
        }
        return undefined;
    };

    this.checkPointBounds = function(p1, p2, test, margin) {
        var inX = this.checkCoordBounds(p1[0], p2[0], test[0], margin),
            inY = this.checkCoordBounds(p1[1], p2[1], test[1], margin);
        return (inX && inY);
    }

    this.checkCoordBounds = function(a, b, z, margin) {
        if (a < b) {
            return (z >= a - margin && z <= b + margin);
        }
        else {
            return (z >= b - margin && z <= a + margin);
        }
    }

    this.getCoords = function() {
        return {
            head: [this.headX, this.headY],
            neck: [this.neckX, this.neckY],
            shoulder: [this.shoulderX, this.shoulderY],
            originHip: [this.originHipX, this.originHipY],
            hip: [this.hipX, this.hipY],
            fElbow: [this.fElbowX, this.fElbowY],
            bElbow: [this.bElbowX, this.bElbowY],
            fHand: [this.fHandX, this.fHandY],
            bHand: [this.bHandX, this.bHandY],
            fFinger: [this.fFingerX, this.fFingerY],
            bFinger: [this.bFingerX, this.bFingerY],
            fKnee: [this.fKneeX, this.fKneeY],
            bKnee: [this.bKneeX, this.bKneeY],
            fFoot: [this.fFootX, this.fFootY],
            bFoot: [this.bFootX, this.bFootY],
            fToe: [this.fToeX, this.fToeY],
            bToe: [this.bToeX, this.bToeY]
        };
    }

    this.stringifyAngles = function() {
        var str = this.deviationInDegrees(this.headAngle)
                + ','
                + this.deviationInDegrees(this.neckAngle)
                + ','
                + this.deviationInDegrees(this.torsoAngle)
                + ','
                + this.deviationInDegrees(this.fShoulderAngle)
                + ','
                + this.deviationInDegrees(this.fElbowAngle)
                + ','
                + this.deviationInDegrees(this.fHandAngle)
                + ','
                + this.deviationInDegrees(this.bShoulderAngle)
                + ','
                + this.deviationInDegrees(this.bElbowAngle)
                + ','
                + this.deviationInDegrees(this.bHandAngle)
                + ','
                + this.deviationInDegrees(this.fHipAngle)
                + ','
                + this.deviationInDegrees(this.fKneeAngle)
                + ','
                + this.deviationInDegrees(this.fFootAngle)
                + ','
                + this.deviationInDegrees(this.bHipAngle)
                + ','
                + this.deviationInDegrees(this.bKneeAngle)
                + ','
                + this.deviationInDegrees(this.bFootAngle)
            ;
        return str;
    };




    // Variables

    this.defaultAngle = Math.PI / 2;

    this.segments = {
        head: "head",
        neck: "neck",
        shoulder: "shoulder",
        trunk: "trunk",
        frontUpperArm: "front upper arm",
        frontLowerArm: "front lower arm",
        frontHand: "front hand",
        backUpperArm: "back upper arm",
        backLowerArm: "back lower arm",
        backHand: "back hand",
        frontUpperLeg: "front upper leg",
        frontLowerLeg: "front lower leg",
        frontFoot: "front foot",
        backUpperLeg: "back upper leg",
        backLowerLeg: "back lower leg",
        backFoot: "back foot"
    };

    this.headAngle = this.defaultAngle,
        this.neckAngle = this.defaultAngle,
        this.torsoAngle = this.defaultAngle,

        // Arms
        this.fShoulderAngle = this.defaultAngle,
        this.fElbowAngle = this.defaultAngle,
        this.fHandAngle = 0,
        this.bShoulderAngle = this.defaultAngle,
        this.bElbowAngle = this.defaultAngle,
        this.bHandAngle = 0,

        // Legs
        this.fHipAngle = this.defaultAngle,
        this.fKneeAngle = this.defaultAngle,
        this.fFootAngle = 0,
        this.bHipAngle = this.defaultAngle,
        this.bKneeAngle = this.defaultAngle,
        this.bFootAngle = 0;

    this.headX, this.headY,
        this.neckX, this.neckY,
        this.shoulderX, this.shoulderY,
        this.originHipX, this.originHipY,
        this.hipX, this.hipY,
        this.fElbowX, this.fElbowY,
        this.bElbowX, this.bElbowY,
        this.fHandX, this.fHandY,
        this.bHandX, this.bHandY,
        this.fFingerX, this.fFingerY,
        this.bFingerX, this.bFingerY,
        this.fKneeX, this.fKneeY,
        this.bKneeX, this.bKneeY,
        this.fFootX, this.fFootY,
        this.bFootX, this.bFootY,
        this.fToeX, this.fToeY,
        this.bToeX, this.bToeY;



    this.x = _x
        , this.y = _y
        , this.offsetX = 0
        , this.offsetY = 0
        , this.width = _width
        , this.height = _height
        , this.exaggerated = _exaggerated
        , this.frame = 0
        , this.maxFrames = 4
        , this.frameSet = undefined
        , this.direction = 0
        , this.stationary = false
        , this.windAroundCanvas = false;


    this.generateDimensions();
};


StickFigure.Running = function() {
    //  head, neck, torso, fua, fla, fh, bua, bla, bh,  fup, fll, ff, bup, bll, bf
    var frame0  = $V([0, 0, 0,   -45, -150, -180, 90, 0, 15,          -75, 15, -75, 45, 45, -0            ]);
    var frame1  = $V([-15, 0, 0,  15, 15, 15, -15, -15, -15,          15, 0, -15,    -15, 45, 0     ]);
    var frame2  = $V([-15, 0, 0,  15, 15, 30, -15, -15, -30,          15, -15, -15, -15, 15, 0     ]);
    var frame3  = $V([15, 0, 0,   15, 15, 30, -15, -15, -30,          15, 15, 15, -15, 15, -15   ]);
    var frame4  = $V([15, 0, 0,   30, 30, 30, -30, -30, -30,          30, 15, 15, -30, -15, -15   ]);
    var frame5  = $V([15, 0, 0,   30, 30, 30, -30, -30, -30,          30, 15, 15, -30, -15, -15   ]);
    var frames  = [frame0, frame1, frame2, frame3, frame4, frame5].map(function(frame) { return new Frame(10, 0, frame)});
    return new FrameSet(frames, true);
}

StickFigure.RunAndBounce = function() {
    var frameSet = StickFigure.Running();
    frameSet.frames.map(function(frame, index) {
        var bounce = Math.abs((frameSet.frames.length / 2) - index) * 5;
        frame.y = bounce;
        return frame;
    });
    return new FrameSet(frameSet.frames, true);
}

StickFigure.Walking = function() {
    //var base    = $V([75, 90, 90,   100, 100, 110, 80, 65, 60,   100, 115, 15, 80, 80, -30]);
    var frame0  = $V([-15, 0, 0,   10, 10, 20, -10, -25, -30,    10, 25, -75, -10, -10, -120]);
    var frame1  = $V([-15, 0, 0,   -5, -5, -5, 5, 5, 10,          -5, 0, -10, 5, 10, 10     ]);
    var frame2  = $V([-15, 0, 0,   -5, -5, -5, 5, 5, 10,          -10, 0, -5, 5, 5, 10      ]);
    var frame3  = $V([15, 0, 0,   -10, -10, -5, 5, 10, 10,      -5, -5, -5, 5, 5, 5   ]);
    var frame4  = $V([15, 0, 0,   -10, -10, -5, 5, 10, 10,      -5, -5, -5, 5, 5, 5   ]);
    var frame5  = $V([15, 0, 0,   -10, -10, -5, 5, 10, 10,      -5, -5, -5, 5, 5, 5   ]);
    var frames  = [frame0, frame1, frame2, frame3, frame4, frame5].map(function(frame) { return new Frame(5, 0, frame)});
    return new FrameSet(frames, true);
}

StickFigure.Stand = function() {
    var frame0  = $V([0, 0, 0,   0, 0, -90, 0, 0, 90,    0, 0, -90, 0, 0, 90]);
    var frames  = [frame0, frame0].map(function(frame) { return new Frame(0, 0, frame)});
    return new FrameSet(frames, false);
};


// Exploding
StickFigure.Explode = function() {
    var frame0  = $V([0, 0, 0,   0, 0, -90, 0, 0, 90,    0, 0, -90, 0, 0, 90]);
    var frames  = [frame0, frame0].map(function(frame) { return new Frame(0, 0, frame)});
    return new FrameSet(frames, false);
    /*
     switch (this.frame) {
     case 0:
     this.fShoulderAngle = this.defaultAngle;
     this.fElbowAngle = this.defaultAngle;
     this.fHandAngle = this.piSeg(12);
     this.bShoulderAngle = this.defaultAngle;
     this.bElbowAngle = this.defaultAngle;
     this.bHandAngle = this.piSeg(0);

     this.fHipAngle = this.defaultAngle;
     this.fKneeAngle = this.defaultAngle;
     this.fFootAngle = this.piSeg(12);
     this.bHipAngle = this.defaultAngle;
     this.bKneeAngle = this.defaultAngle;
     this.bFootAngle = this.piSeg(0);

     break;
     case 1:
     this.fShoulderAngle = this.piSeg(9);
     this.fElbowAngle = this.piSeg(9);
     this.fHandAngle = this.piSeg(13);
     this.bShoulderAngle = this.piSeg(3);
     this.bElbowAngle = this.piSeg(3);
     this.bHandAngle = this.piSeg(23);

     this.fHipAngle = this.piSeg(7);
     this.fKneeAngle = this.piSeg(7);
     this.fFootAngle = this.piSeg(12);
     this.bHipAngle = this.piSeg(5);
     this.bKneeAngle = this.piSeg(5);
     this.bFootAngle = this.piSeg(0);
     break;
     case 2:
     this.fShoulderAngle = this.piSeg(12);
     this.fElbowAngle = this.piSeg(12);
     this.fHandAngle = this.piSeg(13);
     this.bShoulderAngle = this.piSeg(0);
     this.bElbowAngle = this.piSeg(0);
     this.bHandAngle = this.piSeg(23);

     this.fHipAngle = this.piSeg(8);
     this.fKneeAngle = this.piSeg(8);
     this.fFootAngle = this.piSeg(11);
     this.bHipAngle = this.piSeg(4);
     this.bKneeAngle = this.piSeg(4);
     this.bFootAngle = this.piSeg(1);
     break;
     case 3:
     this.fShoulderAngle = this.piSeg(14);
     this.fElbowAngle = this.piSeg(14);
     this.fHandAngle = this.piSeg(14);
     this.bShoulderAngle = this.piSeg(22);
     this.bElbowAngle = this.piSeg(22);
     this.bHandAngle = this.piSeg(22);

     this.fHipAngle = this.piSeg(10);
     this.fKneeAngle = this.piSeg(10);
     this.fFootAngle = this.piSeg(10);
     this.bHipAngle = this.piSeg(2);
     this.bKneeAngle = this.piSeg(2);
     this.bFootAngle = this.piSeg(2);

     break;
     }
     if (this.direction == 1)
     this.flipHorizontalDirection();
     this.generateCoordinates();
     */
};

// Expiring
StickFigure.Expire = function() {
    var frame0  = $V([0, 0, 0,   0, 0, -90, 0, 0, 90,    0, 0, -90, 0, 0, 90]);
    var frames  = [frame0, frame0].map(function(frame) { return new Frame(0, 0, frame)});
    return new FrameSet(frames, false);
    /*
     switch (this.frame) {
     case 0:
     this.shiftY(0);

     this.neckAngle = this.defaultAngle;
     this.torsoAngle = this.defaultAngle;
     this.fShoulderAngle = this.defaultAngle;
     this.fElbowAngle = this.defaultAngle;
     this.fHandAngle = this.piSeg(12);
     this.bShoulderAngle = this.defaultAngle;
     this.bElbowAngle = this.defaultAngle;
     this.bHandAngle = this.piSeg(0);

     this.fHipAngle = this.defaultAngle;
     this.fKneeAngle = this.defaultAngle;
     this.fFootAngle = this.piSeg(12);
     this.bHipAngle = this.defaultAngle;
     this.bKneeAngle = this.defaultAngle;
     this.bFootAngle = this.piSeg(0);

     break;
     case 1:
     this.shiftY(15);
     this.torsoAngle = this.piSeg(3);
     this.neckAngle = this.piSeg(3);
     this.headAngle = this.piSeg(5);
     this.fShoulderAngle = this.piSeg(6);
     this.fElbowAngle = this.piSeg(6);
     this.fHandAngle = this.piSeg(3);
     this.bShoulderAngle = this.piSeg(3);
     this.bElbowAngle = this.piSeg(3);
     this.bHandAngle = this.piSeg(23);
     //
     this.fHipAngle = this.piSeg(9);
     this.fKneeAngle = this.piSeg(10);
     this.fFootAngle = this.piSeg(5);
     this.bHipAngle = this.piSeg(11);
     this.bKneeAngle = this.piSeg(12);
     this.bFootAngle = this.piSeg(4);
     break;
     case 2:
     this.shiftY(30);
     this.torsoAngle = this.piSeg(1);
     this.neckAngle = this.piSeg(1);
     this.headAngle = this.piSeg(0);
     //                this.fShoulderAngle = this.piSeg(12);
     //                this.fElbowAngle = this.piSeg(12);
     //                this.fHandAngle = this.piSeg(13);
     //                this.bShoulderAngle = this.piSeg(0);
     //                this.bElbowAngle = this.piSeg(0);
     //                this.bHandAngle = this.piSeg(23);

     this.fHipAngle = this.piSeg(11);
     this.fKneeAngle = this.piSeg(12);
     this.fFootAngle = this.piSeg(6);
     this.bHipAngle = this.piSeg(13);
     this.bKneeAngle = this.piSeg(14);
     this.bFootAngle = this.piSeg(5);
     break;
     case 3:
     this.shiftY(49);
     this.torsoAngle = this.piSeg(0);
     this.neckAngle = this.piSeg(0);
     this.headAngle = this.piSeg(6);
     this.fShoulderAngle = this.piSeg(14);
     this.fElbowAngle = this.piSeg(14);
     this.fHandAngle = this.piSeg(20);
     this.bShoulderAngle = this.piSeg(0);
     this.bElbowAngle = this.piSeg(21);
     this.bHandAngle = this.piSeg(18);

     this.fHipAngle = this.piSeg(12);
     this.fKneeAngle = this.piSeg(13);
     this.fFootAngle = this.piSeg(19);
     this.bHipAngle = this.piSeg(13);
     this.bKneeAngle = this.piSeg(15);
     this.bFootAngle = this.piSeg(8);

     break;
     }
     if (this.direction == 1)
     this.flipHorizontalDirection();
     this.generateCoordinates();
     */
};
