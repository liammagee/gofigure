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
StickFigure = function(_x, _y, _figureWidth, _figureHeight, _exaggerated) {

    this.Joint = function(_x, _y, _angle) {
        this.x = _x,
            this.y = _y,
            this._angle = _angle;


    };

    this.drawFigure = function(context) {
        context.beginPath();

        // Torso
        context.moveTo(this.hipX, this.hipY);
        context.lineTo(this.shoulderX, this.shoulderY);

        // Neck
        context.moveTo(this.shoulderX, this.shoulderY);
        context.lineTo(this.neckX, this.neckY);

        // Head
        context.moveTo(this.headX + this.headRadius, this.headY);
        context.arc(this.headX, this.headY, this.headRadius, 0, Math.PI * 2, false);

        // Eyes

        // Mouth
//        context.moveTo(this.headX + 2, this.headY + 5);
//        context.lineTo(this.headX + 10, this.headY + 5);

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


    this.updateFrame = function() {
        this.frame = (this.frame == this.maxFrames - 1 ? 0 : this.frame + 1);
    }

    // Stick figure actions

    // Standing
    this.stand = function() {
        if (this.direction == 1) {
            this.flipHorizontalDirection();
        }
        this.generateCoordinates();
    };

    // Running
    this.run = function() {
        switch (this.frame) {
            case 0:
                this.offsetY = 0;

                this.fShoulderAngle = this.piSeg(12);
                this.fElbowAngle = this.piSeg(6);
                this.fHandAngle = this.piSeg(7);
                this.bShoulderAngle = this.piSeg(3);
                this.bElbowAngle = this.piSeg(20);
                this.bHandAngle = this.piSeg(18);

                this.fHipAngle = this.piSeg(9);
                this.fKneeAngle = this.piSeg(9);
                this.fFootAngle = this.piSeg(5);
                this.bHipAngle = this.piSeg(1);
                this.bKneeAngle = this.piSeg(7);
                this.bFootAngle = this.piSeg(3);
                break;
            case 1:
                this.offsetY = this.proportionOfBody(1 / 24);

                this.fShoulderAngle = this.piSeg(11);
                this.fElbowAngle = this.piSeg(6);
                this.fHandAngle = this.piSeg(7);
                this.bShoulderAngle = this.piSeg(4);
                this.bElbowAngle = this.piSeg(21);
                this.bHandAngle = this.piSeg(19);

                this.fHipAngle = this.piSeg(9);
                this.fKneeAngle = this.piSeg(14);
                this.fFootAngle = this.piSeg(9);
                this.bHipAngle = this.piSeg(3);
                this.bKneeAngle = this.piSeg(4);
                this.bFootAngle = this.piSeg(-2);
                break;
            case 2:
                this.offsetY = this.proportionOfBody(2 / 24);

                this.fShoulderAngle = this.piSeg(9);
                this.fElbowAngle = this.piSeg(5);
                this.fHandAngle = this.piSeg(6);
                this.bShoulderAngle = this.piSeg(5);
                this.bElbowAngle = this.piSeg(1);
                this.bHandAngle = this.piSeg(0);

                this.fHipAngle = this.piSeg(6);
                this.fKneeAngle = this.piSeg(13);
                this.fFootAngle = this.piSeg(7);
                this.bHipAngle = this.piSeg(5);
                this.bKneeAngle = this.piSeg(6);
                this.bFootAngle = this.piSeg(0);
                break;
            case 3:
                this.offsetY = this.proportionOfBody(1 / 24);

                this.fShoulderAngle = this.piSeg(7);
                this.fElbowAngle = this.piSeg(5);
                this.fHandAngle = this.piSeg(4);
                this.bShoulderAngle = this.piSeg(6);
                this.bElbowAngle = this.piSeg(4);
                this.bHandAngle = this.piSeg(3);

                this.fHipAngle = this.piSeg(3);
                this.fKneeAngle = this.piSeg(13);
                this.fFootAngle = this.piSeg(7);
                this.bHipAngle = this.piSeg(7);
                this.bKneeAngle = this.piSeg(8);
                this.bFootAngle = this.piSeg(1);
                break;
        }
        if (this.direction == 1) {
            this.flipHorizontalDirection();
        }

        this.generateCoordinates();
    };

    // Runs upside down
    this.runUpsideDown = function() {
        this.run();

        this.flipVerticalDirection();
        this.generateCoordinates();
    };

    // Walking
    this.walk = function() {
        switch (this.frame) {
            case 0:
                this.fShoulderAngle = this.piSeg(9);
                this.fElbowAngle = this.piSeg(8);
                this.fHandAngle = this.piSeg(8);
                this.bShoulderAngle = this.piSeg(4);
                this.bElbowAngle = this.piSeg(3);
                this.bHandAngle = this.piSeg(2);

                this.fHipAngle = this.piSeg(8);
                this.fKneeAngle = this.piSeg(9);
                this.fFootAngle = this.piSeg(4);
                this.bHipAngle = this.piSeg(4);
                this.bKneeAngle = this.piSeg(4);
                this.bFootAngle = this.piSeg(-2);
                break;
            case 1:
                this.fShoulderAngle = this.piSeg(8);
                this.fElbowAngle = this.piSeg(7);
                this.fHandAngle = this.piSeg(7);
                this.bShoulderAngle = this.piSeg(5);
                this.bElbowAngle = this.piSeg(4);
                this.bHandAngle = this.piSeg(4);

                this.fHipAngle = this.piSeg(7);
                this.fKneeAngle = this.piSeg(9);
                this.fFootAngle = this.piSeg(2);
                this.bHipAngle = this.piSeg(5);
                this.bKneeAngle = this.piSeg(6);
                this.bFootAngle = this.piSeg(0);
                break;
            case 2:
                this.fShoulderAngle = this.piSeg(7);
                this.fElbowAngle = this.piSeg(6);
                this.fHandAngle = this.piSeg(5);
                this.bShoulderAngle = this.piSeg(6);
                this.bElbowAngle = this.piSeg(5);
                this.bHandAngle = this.piSeg(5);

                this.fHipAngle = this.piSeg(5);
                this.fKneeAngle = this.piSeg(9);
                this.fFootAngle = this.piSeg(1);
                this.bHipAngle = this.piSeg(6);
                this.bKneeAngle = this.piSeg(7);
                this.bFootAngle = this.piSeg(0);
                break;
            case 3:
                this.fShoulderAngle = this.piSeg(5);
                this.fElbowAngle = this.piSeg(4);
                this.fHandAngle = this.piSeg(4);
                this.bShoulderAngle = this.piSeg(7);
                this.bElbowAngle = this.piSeg(7);
                this.bHandAngle = this.piSeg(7);

                this.fHipAngle = this.piSeg(4);
                this.fKneeAngle = this.piSeg(8);
                this.fFootAngle = this.piSeg(0);
                this.bHipAngle = this.piSeg(7);
                this.bKneeAngle = this.piSeg(8);
                this.bFootAngle = this.piSeg(1);
                break;
        }
        if (this.direction == 1)
            this.flipHorizontalDirection();
        this.generateCoordinates();
    };

    // Walking
    this.walk2 = function() {
        var that = this;
        this.walkFrame = 0;

        // define the walking frames
        var baseframe = {
              h: 90 , t: 90 , n: 90

            , fs: 135 , fe: 120 , fa: 120
            , bs: 30 , be: 45 , ba: 60

            , fh: 120 , fk: 135 , ff: 60
            , bh: 60 , bk: 60 , bf: -30
        };

        /*
        var frame2 = {
              h: 6 , t: 6 , n: 6

            , fs: 8 , fe: 7 , fa: 7
            , bs: 5 , be: 4 , ba: 4

            , fh: 7 , fk: 9 , ff: 2
            , bh: 5 , bk: 6 , bf: 0
        };
        var frame3 = {
              h: 6 , t: 6 , n: 6

            , fs: 7 , fe: 6 , fa: 5
            , bs: 6 , be: 5 , ba: 5

            , fh: 5 , fk: 9 , ff: 1
            , bh: 0 , bk: 7 , bf: 0
        };
        var frame4 = {
              h: 6 , t: 6 , n: 6

            , fs: 5 , fe: 4 , fa: 4
            , bs: 7 , be: 7 , ba: 7

            , fh: 4 , fk: 8 , ff: 0
            , bh: 7 , bk: 8 , bf: 1
        };
        var frame5 = {
              h: 6 , t: 6 , n: 6

            , fs: 5 , fe: 4 , fa: 4
            , bs: 7 , be: 7 , ba: 7

            , fh: 4 , fk: 8 , ff: 0
            , bh: 7 , bk: 8 , bf: 1
        };
        */


        var base    = $V([75, 90, 90,   100, 100, 110, 80, 65, 60,   100, 115, 15, 80, 80, -30]);
        var frame0  = $V([-15, 0, 0,   0, 0, 0, 0, 0, 0,               0, 0, 0, 0, 0, 0            ]);
        var frame1  = $V([-15, 0, 0,   -5, -5, -5, 5, 5, 10,          -5, 0, -10, 5, 10, 10     ]);
        var frame2  = $V([-15, 0, 0,   -5, -5, -5, 5, 5, 10,          -10, 0, -5, 5, 5, 10      ]);
        var frame3  = $V([15, 0, 0,   -10, -10, -5, 5, 10, 10,      -5, -5, -5, 5, 5, 5   ]);
        var frame4  = $V([15, 0, 0,   -10, -10, -5, 5, 10, 10,      -5, -5, -5, 5, 5, 5   ]);
        var frame5  = $V([15, 0, 0,   -10, -10, -5, 5, 10, 10,      -5, -5, -5, 5, 5, 5   ]);
        var frames  = [frame0, frame1, frame2, frame3, frame4, frame5];
        this.maxFrames = frames.length;
        var workingFrame = base;

        for (var i = 0; i <= this.frame ; i++) {
            var currentFrame = frames[i];
            workingFrame = workingFrame.add(currentFrame);
        }
        workingFrame = workingFrame.map(function(e) { return that.degrees(e) });
        this.updateFromVector(workingFrame);

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

    // Exploding
    this.explode = function() {
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
    };

    // Expiring
    this.expire = function() {
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
    };

    this.defaultAction = this.run;


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
        this.y = this.y + this.figureHeight;
        this.wholeBodyLength = (this.figureHeight * 1);
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

    this.degrees = function(val) {
        return Math.PI * (val / 180);
    };

    this.generateCoordinates = function() {
        this.hipX = Math.floor(this.originHipX + this.offsetX);
        this.hipY = Math.floor(this.originHipY + this.offsetY);

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

        this.wholeBodyLength = this.figureHeight * 1;

        // Generate hip co-ordinates
        this.originHipX = this.x + (this.figureWidth / 2) ,
            this.originHipY = this.y + (this.figureHeight * 10 / 24);

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
        this.hipToKneeLength = this.proportionOfBody(8 / 24);
        // 6/24
        this.kneeToFootLength = this.proportionOfBody(6 / 24);
        // 2/24
        this.footLength = this.proportionOfBody(2 / 24);
    };

    this.generateExaggeratedDimensions = function() {
        // Taken from: http://www.idrawdigital.com/2009/01/tutorial-anatomy-and-proportion/
        // http://www.idrawdigital.com/wp-content/uploads/2009/01/prop_male.gif
        // http://www.idrawdigital.com/wp-content/uploads/2009/01/prop_female.gif

        this.wholeBodyLength = this.figureHeight * 1;

        this.originHipX = this.x + (this.figureWidth / 2) ,
            this.originHipY = this.y + (this.figureHeight * 12 / 24);

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
        if (this.exaggerated)
            this.generateExaggeratedDimensions();
        else
            this.generateNormalDimensions();
    };

    this.proportionOfBody = function(proportion) {
        return (this.wholeBodyLength * proportion) + 0.5 | 0;
    };

    this.shiftX = function(percentage) {
        this.offsetX = ((percentage / 100) * this.figureWidth);
    };

    this.shiftY = function(percentage) {
        this.offsetY = ((percentage / 100) * this.figureHeight);
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


    // Variables

    this.defaultAngle = Math.PI / 2;
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
        , this.figureWidth = _figureWidth
        , this.figureHeight = _figureHeight
        , this.exaggerated = _exaggerated
        , this.frame = 0
        , this.maxFrames = 4
        , this.direction = 0;
    this.generateDimensions();

};
