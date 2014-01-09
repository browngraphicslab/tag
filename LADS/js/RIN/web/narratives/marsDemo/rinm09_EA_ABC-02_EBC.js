[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-09_EA_ABC-02_EBC",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 25,
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
            "uriReference": "screenplayproperties.js"
        },
        "R-pano-09_EA_ABC": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AN4gdd9A5y4/0.json"
        },
        "R-EAs-09_EA_ABC": {
            "doNotCopy": true,
            "uriReference": "EBC-EAs.js"
        },
        "R-audio-MR-09_EA_ABC-02_EBC-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/09A_EG_EBCPumoRi_Part2_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-09_EA_ABC": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-09_EA_ABC",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts", "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true,
                "minFieldOfView": 0.018,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-09_EA_ABC",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-02_EBC": {
                    "duration": 25,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "Base camp  - establishing",
                            "offset": 0,
                            "holdDuration": 15,
                            "state": { "viewport": { "region": { "center": { "x": 5.953901218194937, "y": -0.09848444441362636 }, "span": { "x": 0.8231004501184066, "y": 0.5706615090651558 } } } }
                        },
                                                {
                                                    "what": "Base camp  - establishing",
                                                    "offset": 15,
                                                    "holdDuration": 0.1,
                                                    "state": { "viewport": { "region": { "center": { "x": 5.953901218194937, "y": -0.09848444441362636 }, "span": { "x": 0.8231004501184066, "y": 0.5706615090651558 } } } }
                                                },
                        {
                            "what": "Up to w. cwm.",
                            "offset": 24,
                            "holdDuration": 4,
                            "state": { "viewport": { "region": { "center": { "x": 5.958465117780102, "y": 0.030040532739847525 }, "span": { "x": 0.41386993829786783, "y": 0.27798288967743 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-09_EA_ABC-02_EBC-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 23.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-09_EA_ABC-02_EBC-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 23.5
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
        "S-MR-09_EA_ABC-02_EBC": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
                        "experienceStreamId": "ES-MR-02_EBC",
                        "begin": 0,
                        "duration": 25,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-09_EA_ABC-02_EBC-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 23.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 25,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
