[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-02_EA_Jorsalle-01_Bridge",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 56,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {
        "microsoftResearch.rin.twodlayoutengine": {
            "name": "microsoftResearch.rin.twodlayoutengine",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
            "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.PanoramicExperienceStream": {
            "name": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.FadeInOutTransitionService": {
            "name": "MicrosoftResearch.Rin.FadeInOutTransitionService",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.AudioExperienceStream": {
            "name": "MicrosoftResearch.Rin.AudioExperienceStream",
            "version": 0.0
        }
    },
    "resources": {
        "R-DefaultAdaptiveTransitionProfile": {
            "data": { "durationScaleOverride": 3, "trasitionPauseDuration": 0, "capAdaptiveOffset": true, "maxAdaptiveDuration": 6 },
            "doNotCopy": true
        },
        "ScreenplayProperties": {
            "doNotCopy": true,
            "uriReference": "02_EA_Jorsalle/screenplayproperties-01_Bridge.js"
        },
        "R-pano-02_EA_Jorsalle": {
            "doNotCopy": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-ANEgV3G02C4/0.json"
        },
        "R-EAs-02_EA_Jorsalle": {
            "doNotCopy": true,
            "uriReference": "02_EA_Jorsalle/EAs.js"
        },
        "R-audio-MR-02_EA_Jorsalle-01_Bridge-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/02_EA_Jorsalle__REV_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-02_EA_Jorsalle": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-02_EA_Jorsalle",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts", "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true,
                "minFieldOfView": 0.13,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-02_EA_Jorsalle",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-01_Bridge": {
                    "duration": 56,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 16,
                            "state": { "viewport": { "region": { "center": { "x": 0.1965636621815794, "y": -0.24784064785795198 }, "span": { "x": 0.84236122079459, "y": 0.5848812468680161 } } } }
                        },
                                                {
                                                    "what": "zoom in",
                                                    "offset": 16,
                                                    "holdDuration": 0.1,
                                                    "state": { "viewport": { "region": { "center": { "x": 0.1965636621815794, "y": -0.24784064785795198 }, "span": { "x": 0.84236122079459, "y": 0.5848812468680161 } } } }
                                                },
                        {
                            "what": "zoom out",
                            "offset": 25,
                            "holdDuration": 22,
                            "state": { "viewport": { "region": { "center": { "x": 6.282934015029323, "y": 0.018411201169731453 }, "span": { "x": 0.969827835883931, "y": 0.6806213862767307 } } } }
                        },
                                                {
                                                    "what": "zoom in to bridge",
                                                    "offset": 55,
                                                    "holdDuration": 0,
                                                    "state": { "viewport": { "region": { "center": { "x": 0.025059008776226923, "y": -0.2070802820852023 }, "span": { "x": 0.49082361721889023, "y": 0.33351890572238413 } } } }
                                                }
                    ]
                }
            }
        },
        "E-audio-MR-02_EA_Jorsalle-01_Bridge-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 54
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-02_EA_Jorsalle-01_Bridge-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 54
                }
            }
        },
        "E-audio-background-music-01": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 59.891625,
                    "pauseVolume": 0.5,
                    "isBackgroundAudioMode": true
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-background-music-01",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 59.891999999999996
                }
            }
        }
    },
    "screenplays": {
        "S-MR-02_EA_Jorsalle-01_Bridge": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-02_EA_Jorsalle",
                        "experienceStreamId": "ES-MR-01_Bridge",
                        "begin": 0,
                        "duration": 56,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-02_EA_Jorsalle-01_Bridge-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 54,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 56,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
