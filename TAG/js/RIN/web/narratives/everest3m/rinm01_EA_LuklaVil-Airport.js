[{
    "version": 1.0,
    "defaultScreenplayId": "S-MicroRIN-01_EA_LuklaVil-Airport",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 21,
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
            "data": { "durationScaleOverride": 3, "trasitionPauseDuration": 0, "capAdaptiveOffset": true },
            "doNotCopy": true
        },
        "ScreenplayProperties": {
            "doNotCopy": true,
            "uriReference": "01_EA_LuklaVil/screenplayproperties-IntroJorsale.js"
        },
        "R-pano-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AHMgfDD3ii4/0.json"
        },
        "R-EAs-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "01_EA_LuklaVil/EAs.js"
        },
        "R-audio-MicroRIN-01_EA_LuklaVil-Airport-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/trektoeverest/01_EA_LuklaVil/01_EA_LuklaVil-B.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-01_EA_LuklaVil": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-01_EA_LuklaVil",
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
                "showLowerFidelityWhileMoving": false
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-01_EA_LuklaVil",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MicroRin-Airport": {
                    "duration": 21,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.4508536367593839, "y": 0.1358168340243853 }, "span": { "x": 0.3483599779010264, "y": 0.1716908989108399 } } } }
                        },
                        {
                            "what": "second keyframe with placeholder offset",
                            "offset": 6,
                            "holdDuration": 2,
                            "state": { "viewport": { "region": { "center": { "x": 0.4508536367593839, "y": 0.1358168340243853 }, "span": { "x": 0.3483599779010264, "y": 0.1716908989108399 } } } }
                        },
                        {
                            "what": "stay at zoom in",
                            "offset": 21,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.4508536367593839, "y": 0.1358168340243853 }, "span": { "x": 0.3483599779010264, "y": 0.1716908989108399 } } } }
                        }
                    ]
                },
                "ES-MicroRin-Airport-animateToPose": {
                    "duration": 22,
                    "transitionDurationOverrides": {
                        "durationScaleOverride": 3,
                        "transitionPauseDurationInSec": 0,
                        "simplePathOnly": true
                    },
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.4508536367593839,
                                            "y": 0.1358168340243853
                                        },
                                        "span": {
                                            "x": 0.3483599779010264,
                                            "y": 0.1716908989108399
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "stay at zoom in",
                            "offset": 22,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.4508536367593839,
                                            "y": 0.1358168340243853
                                        },
                                        "span": {
                                            "x": 0.3483599779010264,
                                            "y": 0.1716908989108399
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-MicroRin-Airport-ZoomOut": {
                    "duration": 22,
                    "transitionDurationOverrides": {
                        "durationScaleOverride": 3,
                        "transitionPauseDurationInSec": 0,
                        "simplePathOnly": true
                    },
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.4508536367593839, "y": 0.1358168340243853 }, "span": { "x": 0.3483599779010264, "y": 0.1716908989108399 } } } }
                        },
                        {
                            "what": "stay at zoom in",
                            "offset": 21,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.4508536367593839, "y": 0.1358168340243853 }, "span": { "x": 0.3483599779010264, "y": 0.1716908989108399 } } } }
                        },
                        {
                            "what": "zoom back out wide",
                            "offset": 22,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": -0.0001 }, "span": { "x": 1.5236204478648547, "y": 0.8730103757219849 } } } }
                        }
                    ]
                },
                "ES-MicroRin-Airport-fast": {
                    "duration": 22,
                    "transitionType": "fastZoom",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.4508536367593839,
                                            "y": 0.1358168340243853
                                        },
                                        "span": {
                                            "x": 0.3483599779010264,
                                            "y": 0.1716908989108399
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "stay at zoom in",
                            "offset": 21,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.4508536367593839,
                                            "y": 0.1358168340243853
                                        },
                                        "span": {
                                            "x": 0.3483599779010264,
                                            "y": 0.1716908989108399
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoom back out wide",
                            "offset": 22,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2578932723280145,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 1.5236204478648547,
                                            "y": 0.8730103757219849
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-audio-MicroRIN-01_EA_LuklaVil-Airport-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 20
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MicroRIN-01_EA_LuklaVil-Airport-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 20
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
        "S-MicroRIN-01_EA_LuklaVil-Airport": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-MicroRin-Airport",
                        "begin": 0,
                        "duration": 21,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MicroRIN-01_EA_LuklaVil-Airport-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 20,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 21,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        },
        "S-MicroRIN-01_EA_LuklaVil-Airport-Complete": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-MicroRin-Airport-ZoomOut",
                        "begin": 0,
                        "duration": 22,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MicroRIN-01_EA_LuklaVil-Airport-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 20,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 22,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        },
        "S-MicroRIN-01_EA_LuklaVil-Airport-fast": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-MicroRin-Airport-animateToPose",
                        "begin": 0,
                        "duration": 22,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MicroRIN-01_EA_LuklaVil-Airport-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 20,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 22,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
