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

        var s1d = stageOne.duration,     // duration of stage one timer
            s1c = stageOne.callback,     // stage one callback
            s2d = stageTwo.duration,     // duration of stage two timer
            s2c = stageTwo.callback,     // stage two callback
            s1TimeoutID = null,          // stage one timeout
            s2TimeoutID = null,          // stage two timeout
            started     = false;         // whether the TwoStageTimer has started

        /**
         * Start the timer (the first stage)
         * @method start
         */
        function start() {
            s1TimeoutID = setTimeout(fireS1, s1d);
            started = true;
        }

        /**
         * Kill the timer by stopping both timeouts and setting _started to false
         * @method kill
         */
        function kill() {
            if (started) {
                clearTimeout(s1TimeoutID);
                clearTimeout(s2TimeoutID);
                started = false;
            }
        }

        /**
         * Returns whether or not the timer is stopped
         * @method isStopped
         * @return {Boolean}       this._started
         */
        function isStopped() {
            return started;
        }

        /**
         * Restarts the stage one timer
         * @method restartS1
         */
        function restartS1() {
            started && clearTimeout(s1TimeoutID);
            s1TimeoutID = setTimeout(fireS1, s1d);
        }

        /**
         * Kills the stage two timer and restarts the stage one timer
         * @method restartS2
         */
        function restartS2() {
            started && clearTimeout(s2TimeoutID);
            s1TimeoutID = setTimeout(fireS1, s1d);
        }

        /**
         * Reinitialize the timer with new timerPairs
         * method reinitialize
         * @param {timerPair} newS1         new stage one timerPair
         * @param {timerPair} newS2         new stage two timerPair
         */
        function reinitialize(newS1, newS2) {
            clearTimeout(s1TimeoutID);
            clearTimeout(s2TimeoutID);
            s1d = newS1.duration;
            s1c = newS1.callback;
            s2d = newS2.duration;
            s2c = newS2.callback;
            s1TimeoutID = null;
            s2TimeoutID = null;

            started = false;
        }

        /**
         * Private method to fire stage one timer
         * @method fireS1
         */
        function fireS1() {
            s1c();
            s2TimeoutID = setTimeout(fireS2, s2d);
        }

        /**
         * Private method to fire stage two timer
         * @method fireS2
         */
        function fireS2() {
            s2c();
            started = false;
        }

        return {
            start:        start,
            kill:         kill,
            isStopped:    isStopped,
            restartS1:    restartS1,
            restartS2:    restartS2,
            reinitialize: reinitialize,
        };
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
        var dur = 5000; // two minutes

        return timerPair(dur, createIdleOverlay);
    }

    /**
     * Create default stage two timerPair
     * @method defaultStageTwo
     * @return {Object}               default stage two pair
     */
    function defaultStageTwo() {
        var dur = 10000; // ten seconds

        return timerPair(dur, returnHome);
    }

    /**
     * Create default idle timer warning overlay -- default
     * stage one callback
     * @method createIdleOverlay
     */
    function createIdleOverlay() {
        overlay = $(LADS.Util.UI.blockInteractionOverlay());



        $('#tagRoot').append(overlay);
        overlay.fadeIn();
        

    }

    /**
     * Remove the default warning overlay
     * @method removeIdleOverlay
     */
    function removeIdleOverlay() {
        overlay && overlay.fadeOut(overlay.remove);
    }

    /**
     * Returns to home page -- default stage two callback
     * @method returnHome
     */
    function returnHome() {
        var catalog = new LADS.Layout.NewCatalog();
        LADS.Util.UI.slidePageRight(catalog.getRoot());
    }

    return {
        TwoStageTimer: TwoStageTimer,
        timerPair:     timerPair
    }
})();
