[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-09_EA_ABC-01_PumoRi",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 18,
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
        "R-audio-MR-09_EA_ABC-01_PumoRi-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/09A_EG_EBCPumoRi_Part1_MIX.mp3"
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
                "ES-MR-01_PumoRi": {
                    "duration": 18,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                                                {
                                                    "what": "establishing",
                                                    "offset": 0,
                                                    "holdDuration": 10,
                                                    "state": {
                                                        "viewport": {
                                                            "region": {
                                                                "center": {
                                                                    "x": 6.00954341349878,
                                                                    "y": 0.0001
                                                                },
                                                                "span": {
                                                                    "x": 1.1948616605663524,
                                                                    "y": 0.8152307272359369
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                        {
                            "what": "establishing",
                            "offset": 10,
                            "holdDuration": 0.1,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.00954341349878,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1948616605663524,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "ablation zone, gorak shep",
                            "offset": 17,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.5275859972977057, "y": 0.0001 }, "span": { "x": 1.1421796335429042, "y": 0.8152307272359369 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-09_EA_ABC-01_PumoRi-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 16
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-09_EA_ABC-01_PumoRi-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 16
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
        "S-MR-09_EA_ABC-01_PumoRi": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
                        "experienceStreamId": "ES-MR-01_PumoRi",
                        "begin": 0,
                        "duration": 18,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-09_EA_ABC-01_PumoRi-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 16,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 18,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
