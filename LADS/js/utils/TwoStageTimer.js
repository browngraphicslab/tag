/**
 * TAG idle timer class. Wraps idle timer-related
 * functions in a contained scope.
 * @class LADS.IdleTimer
 * @constructor
 * @return {Object}      a couple public methods
 */

var LADS = LADS || {};
LADS.IdleTimer = (function() {
    var overlay;

     /**
      * This two-stage timer takes in two duration-callback pairs. The stage one 
      * callback is put on a timeout configured to the pre-specified duration
      * which will tick down until the callback executes or until it is restarted. 
      * Upon the stage one callback's execution, the stage two callback's timeout
      * is then started. However, if the second callback's timeout is reset, it will 
      * restart the entire timer back to stage one. Upon the second callback's 
      * execution, the timer will sit idle until the reset method is invoked.
      * @class TwoStageTimer
      * @constructor
      * @param {Object} stageOne         the stage one timer pair (see timerPair helper function below)
      * @param {Object} stageTwo         the stage two timer pair
      */
    function TwoStageTimer(stageOne, stageTwo) {
        stageOne = stageOne || defaultStageOne(); // defaults
        stageTwo = stageTwo || defaultStageTwo();

        this._s1d = stageOne.duration;     // duration of stage one timer
        this._s1p = stageOne.callback;     // stage one callback
        this._s2d = stageTwo.duration;     // duration of stage two timer
        this._s2p = stageTwo.callback;     // stage two callback
        this._s1TimeoutID = null;          // stage one timeout
        this._s2TimeoutID = null;          // stage two timeout

        this._started = false;             // whether the TwoStageTimer has started

        /**
         * Start the timer (the first stage)
         * @method start
         */
        this.start = function() {
            this._s1TimeoutID = setTimeout(fireS1, this._s1d);
            this._started = true;
        };

        /**
         * Kill the timer by stopping both timeouts and setting _started to false
         * @method kill
         */
        this.kill = function() {
            if (this._started) {
                clearTimeout(this._s1TimeoutID);
                clearTimeout(this._s2TimeoutID);
                this._started = false;
            }
        };

        /**
         * Returns whether or not the timer is stopped
         * @method isStopped
         * @return {Boolean}       this._started
         */
        this.isStopped = function () {
            return this._started;
        };

        /**
         * Restarts the stage one timer
         * @method restartS1
         */
        this.restartS1 = function() {
            if (this._started) {
                clearTimeout(this._s1TimeoutID);
                this._s1TimeoutID = setTimeout(fireS1, this._s1d);
            }
        };

        /**
         * Kills the stage two timer and restarts the stage one timer
         * @method restartS2
         */
        this.restartS2 = function() {
            if (this._started) {
                clearTimeout(this._s2TimeoutID);
                this._s1TimeoutID = setTimeout(fireS1, this._s1d);
            }
        };

        /**
         * Reinitialize the timer with new timerPairs
         * method reinitialize
         * @param {timerPair} newS1         new stage one timerPair
         * @param {timerPair} newS2         new stage two timerPair
         */
        this.reinitialize = function() {
            clearTimeout(this._s1TimeoutID);
            clearTimeout(this._s2TimeoutID);
            this._s1d = stageOne.duration;
            this._s1p = stageOne.callback;
            this._s2d = stageTwo.duration;
            this._s2p = stageTwo.callback;
            this._s1TimeoutID = null;
            this._s2TimeoutID = null;

            this._started = false;
        }

        /**
         * Private method to fire stage one timer
         * @method fireS1
         */
        function fireS1() {
            this._s1p();
            this._s2TimeoutID = setTimeout(fireS2, this._s2d);
        }

        /**
         * Private method to fire stage two timer
         * @method fireS2
         */
        function fireS2() {
            this._s2p();
            this._started = false;
        } 
    }

    /**
     * Create a timerPair object
     * @method timerPair
     * @param {Number} duration       length of timer
     * @param {Function} callback     function to be called when timer expires
     */
    function timerPair(duration, callback) {
        return {
            duration: duration,
            callback: callback
        }
    }

    /**
     * Create default stage one timerPair
     * @method defaultStageOne
     * @return {Object}               default stage one pair
     */
    function defaultStageOne() {
        var dur = 120000; // two minutes

        return timerPair(dur, createIdleOverlay);
    }

    /**
     * Create default stage two timerPair
     * @method defaultStageTwo
     * @return {Object}               default stage two pair
     */
    function defaultStageTwo() {
        var dur = 2000; // two seconds

        return timerPair(dur, returnHome);
    }

    /**
     * Create default idle timer warning overlay -- default
     * stage one callback
     * @method createIdleOverlay
     */
    function createIdleOverlay() {

    }

    /**
     * Remove the default warning overlay
     * @method removeIdleOverlay
     */
    function removeIdleOverlay() {
        overlay && overlay.remove();
    }

    /**
     * Returns to home page -- default stage two callback
     * @method returnHome
     */
    function returnHome() {

    }

    return {
        TwoStageTimer: TwoStageTimer,
        timerPair:     timerPair
    }
})();
