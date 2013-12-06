/* 
 * dz - Two-Stage Timer
 *
 * This two-stage timer takes in two duration-payload pairs. The stage one 
 * payload is put on a timeout configured to the pre-specified duration
 * which will tick down until the payload executes or until it is restarted. 
 * Upon the stage one payload's execution, the stage two payload's timeout
 * is then started. However, if the second payload's timeout is reset, it will 
 * restart the entire timer back to stage one. Upon the second payload's 
 * execution, the timer will sit idle until the reset method is invoked.
 * 
 * The payload-duration pairs should be passed in as objects in the below
 * format:
 * var durationPayloadPair = {
 *      duration: <seconds>,
 *      payload: <payload function>
 * }
 * 
 */

// constructor
function TwoStageTimer(stageOne, stageTwo) {
    this._s1d = stageOne.duration;
    this._s1p = stageOne.payload;
    this._s2d = stageTwo.duration;
    this._s2p = stageTwo.payload;
    this._s1TimeoutID = null;
    this._s2TimeoutID = null;

    this._started = false;
}

////////////////////
// Public methods //
////////////////////

// start the timer
TwoStageTimer.prototype.start = function () {
    this._s1TimeoutID = setTimeout(this._fireS1, this._s1d);
    this._started = true;
};

// killswitch
TwoStageTimer.prototype.kill = function () {
    if (this._started) {
        clearTimeout(this._s1TimeoutID);
        clearTimeout(this._s2TimeoutID);
        this._started = false;
    }
};

// indicates whether timer is stopped or started
TwoStageTimer.prototype.isStopped = function () {
    return this._started;
};

// restarts the stage one timer
TwoStageTimer.prototype.restartS1 = function () {
    if (this._started) {
        clearTimeout(this._s1TimeoutID);
        this._s1TimeoutID = setTimeout(this._fireS1, this._s1d);
    }
};

// kills the stage two timer and restarts the s1 timer
TwoStageTimer.prototype.restartS2 = function () {
    if (this._started) {
        clearTimeout(this._s2TimeoutID);
        this._s1TimeoutID = setTimeout(this._fireS1, this._s1d);
    }
};

// reinitialize the timer with new payload-duration pairs
TwoStageTimer.prototype.reinitialize = function (stageOne, stageTwo) {
    clearTimeout(this._s1TimeoutID);
    clearTimeout(this._s2TimeoutID);
    this._s1d = stageOne.duration;
    this._s1p = stageOne.payload;
    this._s2d = stageTwo.duration;
    this._s2p = stageTwo.payload;
    this._s1TimeoutID = null;
    this._s2TimeoutID = null;

    this._started = false;
}

/////////////////////
// Private methods //
/////////////////////

// fire the stage one timeout
TwoStageTimer.prototype._fireS1 = function () {  
    this._s1p();
    this._s2TimeoutID = setTimeout(this._fireS2, this._s2d);
};

// fire the stage two timeout
TwoStageTimer.prototype._fireS2 = function () {
    this._s2p();
    this._started = false;
};
