//
// Basic unit tests AND common code for RIN Nonlinear Storyboard and Trajectory testing
//
// Copyright (C) 2013 Microsoft Research
//
/// <reference path="../../../src/storyboard/nonLinearStoryboard.d.ts"/>
/// <reference path="../../../src/storyboard/trajectory.d.ts"/>
/// <reference path="../embeddedArtifacts/qunit.d.ts"/>
var rin;
(function (rin) {
    (function (nonlinearStoryboardTests) {
        function generateSimpleExperience() {
            return {
                data: {
                    defaultKeyframe: {
                        offset: 0,
                        state: {
                            value: 0
                        }
                    }
                },
                experienceStreams: {
                    "E1": {
                        duration: // Experience E1
                        20,
                        keyframes: [
                            {
                                offset: 0,
                                state: {
                                    value: 0
                                }
                            }, 
                            {
                                offset: 10,
                                state: {
                                    value: 10
                                }
                            }
                        ]
                    },
                    "E2": {
                        duration: // Experience E1
                        20,
                        keyframes: [
                            {
                                offset: 0,
                                state: {
                                    value: 0
                                }
                            }, 
                            {
                                offset: 10,
                                state: {
                                    value: 10
                                }
                            }
                        ]
                    }
                }
            };
        }
        nonlinearStoryboardTests.generateSimpleExperience = generateSimpleExperience;
        function test0() {
            //
            // Get get some test data...
            //
            var e = nonlinearStoryboardTests.generateSimpleExperience();
            var trajectoryBuilder = rin.Ext.Trajectory.newTrajectoryBuilder(e);
            //
            // Override required functions of trajectoryBuilder...
            //
            trajectoryBuilder.keyframeInterpolatorPost = function (iState) {
                return {
                    interpolate: function (time, kf) {
                        //
                        // Fill out kf with interpolated value
                        //
                        return kf;
                    }
                };
            };
            trajectoryBuilder.renderKeyframe = function (kf) {
                //
                // Call to Experience Provider to actually render the keyframe -
                //
                            };
            //
            // Hook the animation start/stop notification handlers - note that start and stop should be idempotent - they could get called multiple times (eg. two starts in a row).
            //
            trajectoryBuilder.storyboardHelper.startAnimation = function () {
                /*...*/
                            };
            trajectoryBuilder.storyboardHelper.stopAnimation = function () {
                /*...*/
                            };
            ok(!!(trajectoryBuilder && trajectoryBuilder.storyboardHelper), "trajectoryBuilder && trajectoryBuilder.storyboardHelper");
            var sb = rin.Ext.NonLinearStoryboard.buildStoryboard(trajectoryBuilder.storyboardHelper);
            ok(!!sb, "sb!=null");
            //
            // Typical steps called when Orchestractor calls in with play/pause(EsID, offset) - get a traj, then call sb.play/pause(traj, offset)
            //
            var traj = trajectoryBuilder.buildTrajectoryFromExperienceStreamId("E1");
            ok(!!traj, "traj!=null");
            sb.play(traj, 0);
            //
            // Actually, sb.renderAt is not called in production - instead call sb.render() in the context of the render loop - this loop should be activated/started when startAnimation is called,
            // and deactivated when stopAnimation is called...
            //
            sb.renderAt(10);
            sb.pause(traj, 10/*, completionCallback() */ );
            sb.renderAt(10);
            //
            // Call this to instantly stop animation - typically when there is user-interaction, but also on unload.
            // Do not call stop (or pause) when going from play(esID,...) to play(someOtherEsID, ...).
            //
            sb.stop();
        }
        nonlinearStoryboardTests.test0 = test0;
        var currentStateValue = 0;
        var getCurrentState = function () {
            return {
                "offset": 0,
                "state": {
                    "value": currentStateValue
                }
            };
        };
        var genBuildSmoothTransitionTrajectory = function (tb) {
            //
            // We return this function which has access to TrajectoryBuilder tb above.
            //
            return function (traj1, t1, traj2, t2, pause) {
                var preKf = null;
                var prePreKf = null;
                var postKf = null;
                var postPostKf = null;
                var DELTA = 1.0;
                var TRANSITION_TIME = 5.0;
                var keyframes = [];
                if(!traj1) {
                    preKf = getCurrentState();
                } else {
                    if(traj1.sampleAt) {
                        prePreKf = traj1.sampleAt(t1 - DELTA);
                        preKf = traj1.sampleAt(t1);
                    }
                }
                if(prePreKf) {
                    prePreKf.offset = t2 - DELTA;
                    if(prePreKf.offset < 0) {
                        prePreKf = null;
                    } else {
                        keyframes.push(prePreKf);
                    }
                }
                if(preKf) {
                    preKf.offset = t2;
                    keyframes.push(preKf);
                }
                if(traj2.sampleAt) {
                    if(pause) {
                        postKf = traj2.sampleAt(t2);
                    } else {
                        postKf = traj2.sampleAt(t2 + TRANSITION_TIME);
                        postPostKf = traj2.sampleAt(t2 + TRANSITION_TIME + DELTA);
                    }
                    if(postKf) {
                        postKf.offset = t2 + TRANSITION_TIME;
                        keyframes.push(postKf);
                    }
                    if(postPostKf) {
                        postPostKf.offset = t2 + TRANSITION_TIME + DELTA;
                        keyframes.push(postPostKf);
                    }
                }
                var resultTrajectory;
                if(preKf && postKf) {
                    //
                    // Construct an on-the-fly ES and build a transition trajectory out of that ES
                    //
                    var es = {
                        duration: TRANSITION_TIME,
                        keyframes: keyframes
                    };
                    var transitionTraj = tb.buildTrajectoryFromExperienceStream(es);
                    resultTrajectory = {
                        renderAt: function (time) {
                            if(time < t2 + TRANSITION_TIME) {
                                transitionTraj.renderAt(time);
                            } else {
                                if(pause) {
                                    time = t2;
                                }
                                traj2.renderAt(time);
                            }
                        },
                        sampleAt: (traj2.sampleAt) ? function (time, kf) {
                            if(time < t2 + TRANSITION_TIME) {
                                return transitionTraj.sampleAt(time);
                            } else {
                                if(pause) {
                                    time = t2;
                                }
                                return traj2.sampleAt(time);
                            }
                        } : null,
                        duration: pause ? TRANSITION_TIME : traj2.duration
                    };
                } else {
                    resultTrajectory = traj2;
                    if(pause) {
                        //
                        // We do an instant pause (no slow pause for now).
                        // So, create a new trajectory of duration 0, and map render for any time to rendering the underlying
                        // trajectory (activeTrajectory) at the (unchanging) pause time (t2)
                        //
                        resultTrajectory = {
                            renderAt: function (time) {
                                traj2.renderAt(t2);
                            },
                            sampleAt: (traj2.sampleAt) ? function (time, kf) {
                                return traj2.sampleAt(t2, kf);
                            } : null,
                            duration: 0
                        };
                    }
                }
                return resultTrajectory;
            }
        };
        function test1() {
            //
            // Get get some test data...
            //
            var e = nonlinearStoryboardTests.generateSimpleExperience();
            var trajectoryBuilder = rin.Ext.Trajectory.newTrajectoryBuilder(e);
            //
            // Override required functions of trajectoryBuilder...
            //
            trajectoryBuilder.keyframeInterpolatorPost = function (iState) {
                return {
                    interpolate: function (time, kf) {
                        //
                        // Fill out kf with interpolated value
                        //
                        var preKf = iState.preKf;
                        var postKf = iState.postKf;
                        if(preKf && postKf) {
                            var delta = postKf.offset - preKf.offset;
                            if(delta < 0.00001) {
                                delta = 0.00001;
                            }
                            var progress = (time - preKf.offset) / delta;
                            if(progress < 0) {
                                progress = 0;
                            }
                            if(progress > 1) {
                                progress = 1;
                            }
                            kf.state.value = preKf.state.value * (1 - progress) + postKf.state.value * progress;
                        } else {
                            var preOrPostKf = preKf || postKf;
                            if(preOrPostKf) {
                                kf.state.value = preOrPostKf.state.value;
                            }
                        }
                        kf.offset = time;
                        return kf;
                    }
                };
            };
            trajectoryBuilder.renderKeyframe = function (kf) {
                //
                // Call to Experience Provider to actually render the keyframe -
                //
                var time = kf.offset;
                var value = kf.state.value;
            };
            //
            // Hook the animation start/stop notification handlers - note that start and stop should be idempotent - they could get called multiple times (eg. two starts in a row).
            //
            trajectoryBuilder.storyboardHelper.startAnimation = function () {
                /*...*/
                            };
            trajectoryBuilder.storyboardHelper.stopAnimation = function () {
                /*...*/
                            };
            trajectoryBuilder.storyboardHelper.buildTransitionTrajectory = genBuildSmoothTransitionTrajectory(trajectoryBuilder);
            var gct = function () {
                return trajectoryBuilder.storyboardHelper.getCurrentTime();
            };
            ok(!!(trajectoryBuilder && trajectoryBuilder.storyboardHelper), "trajectoryBuilder && trajectoryBuilder.storyboardHelper");
            var sb = rin.Ext.NonLinearStoryboard.buildStoryboard(trajectoryBuilder.storyboardHelper);
            ok(!!sb, "sb!=null");
            //
            // Typical steps called when Orchestractor calls in with play/pause(EsID, offset) - get a traj, then call sb.play/pause(traj, offset)
            //
            var traj = trajectoryBuilder.buildTrajectoryFromExperienceStreamId("E1");
            ok(!!traj, "traj!=null");
            currentStateValue = -10.0;
            var ct = gct();
            sb.play(traj, 0);
            //
            // Actually, sb.renderAt is not called in production - instead call sb.render() in the context of the render loop - this loop should be activated/started when startAnimation is called,
            // and deactivated when stopAnimation is called...
            //
            sb.renderAt(ct + 0);
            sb.renderAt(ct + 1);
            sb.renderAt(ct + 5);
            sb.renderAt(ct + 10);
            ct = gct();
            sb.pause(traj, 1/*, completionCallback() */ );
            sb.renderAt(ct + 0);
            sb.renderAt(ct + 1);
            sb.renderAt(ct + 5);
            sb.renderAt(ct + 10);
            currentStateValue = 100;
            ct = gct();
            sb.play(traj, 0);
            sb.renderAt(ct + 0);
            sb.renderAt(ct + 1);
            sb.renderAt(ct + 5);
            sb.renderAt(ct + 10);
            //
            // Call this to instantly stop animation - typically when there is user-interaction, but also on unload.
            // Do not call stop (or pause) when going from play(esID,...) to play(someOtherEsID, ...).
            //
            sb.stop();
        }
        nonlinearStoryboardTests.test1 = test1;
    })(rin.nonlinearStoryboardTests || (rin.nonlinearStoryboardTests = {}));
    var nonlinearStoryboardTests = rin.nonlinearStoryboardTests;
})(rin || (rin = {}));
//
// Register tests with QUnit
//
(function () {
    this.module("Nonlinear Storyboard Tests");
    test("Simple Test", function () {
        rin.nonlinearStoryboardTests.test0();
    });
    test("Smooth Transition Test", function () {
        rin.nonlinearStoryboardTests.test1();
    });
})();
//@ sourceMappingURL=StoryboardBase.Tests.js.map
