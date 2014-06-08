[{
    "version": 1.0,
    "defaultScreenplayId": "S-MicroRIN-01_EA_LuklaVil-IntroJorsalle",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 14,
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
        "R-audio-MicroRIN-01_EA_LuklaVil-IntroJorsalle-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/trektoeverest/01_EA_LuklaVil/01_EA_LuklaVil-C.mp3"
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
                "ES-MicroRin-IntroJorsalle": {
                    "duration": 14,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 6,
                            "state": { "viewport": { "region": { "center": { "x": 0.1965636621815794, "y": -0.24784064785795198 }, "span": { "x": 0.84236122079459, "y": 0.5848812468680161 } } } }
                        },
                                                {
                                                    "what": "zoom in",
                                                    "offset": 6,
                                                    "holdDuration": 0.1,
                                                    "state": { "viewport": { "region": { "center": { "x": 0.1965636621815794, "y": -0.24784064785795198 }, "span": { "x": 0.84236122079459, "y": 0.5848812468680161 } } } }
                                                },
                        {
                            "what": "zoom out",
                            "offset": 14,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.039234788952558955, "y": 0.02136190527499114 }, "span": { "x": 0.969827835883931, "y": 0.6806213862767307 } } } }
                        },
                                                {
                                                    "what": "zoom in to bridge",
                                                    "offset": 46,
                                                    "holdDuration": 0,
                                                    "state": { "viewport": { "region": { "center": { "x": 0.025059008776226923, "y": -0.2070802820852023 }, "span": { "x": 0.49082361721889023, "y": 0.33351890572238413 } } } }
                                                }
                    ]
                },
                "ES-MicroRin-IntroJorsalle-ZoomOut": {
                    "duration": 16,
                    "transitionType": "fastZoom",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": 0.13071262258115326 }, "span": { "x": 0.8359325257230227, "y": 0.4277750841037726 } } } }
                        },
                        {
                            "what": "stay at zoom in",
                            "offset": 15,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": 0.13071262258115326 }, "span": { "x": 0.8359325257230227, "y": 0.4277750841037726 } } } }
                        },
                        {
                            "what": "zoom back out wide",
                            "offset": 16,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": -0.0001 }, "span": { "x": 1.5236204478648547, "y": 0.8730103757219849 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MicroRIN-01_EA_LuklaVil-IntroJorsalle-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 13
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MicroRIN-01_EA_LuklaVil-IntroJorsalle-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 13
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
        "S-MicroRIN-01_EA_LuklaVil-IntroJorsalle": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-MicroRin-IntroJorsalle",
                        "begin": 0,
                        "duration": 14,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MicroRIN-01_EA_LuklaVil-IntroJorsalle-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 13,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 14,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        },
        "S-MicroRIN-01_EA_LuklaVil-IntroJorsalle-Complete": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-MicroRin-IntroJorsalle-ZoomOut",
                        "begin": 0,
                        "duration": 16,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MicroRIN-01_EA_LuklaVil-IntroJorsalle-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 13,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 16,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
