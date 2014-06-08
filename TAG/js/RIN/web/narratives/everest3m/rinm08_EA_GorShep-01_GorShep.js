[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-08_EA_GorShep-01_GorShep",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 30,
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
            "uriReference": "08_EA_GorShep/screenplayproperties-01_GorShep.js"
        },
        "R-pano-08_EA_GorShep": {
            "doNotCopy": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AOEgqKw65y4/0.json"
        },
        "R-EAs-08_EA_GorShep": {
            "doNotCopy": true,
            "uriReference": "08_EA_GorShep/EAs.js"
        },
        "R-audio-MR-08_EA_GorShep-01_GorShep-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/08_EA_GorShep_Fix_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-08_EA_GorShep": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-08_EA_GorShep",
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
                    "resourceId": "R-pano-08_EA_GorShep",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-01_GorShep": {
                    "duration": 30,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in to gorak shep",
                            "offset": 0,
                            "holdDuration": 8,
                            "state": { "viewport": { "region": { "center": { "x": 6.151194245809306, "y": -0.04935774623159343 }, "span": { "x": 0.3510527642215763, "y": 0.23738035107331398 } } } }
                        },
                                                {
                                                    "what": "zoom in to gorak shep",
                                                    "offset": 8,
                                                    "holdDuration": 0.1,
                                                    "state": { "viewport": { "region": { "center": { "x": 6.151194245809306, "y": -0.04935774623159343 }, "span": { "x": 0.3510527642215763, "y": 0.23738035107331398 } } } }
                                                },
                        {
                            "what": "stay zoomed in ",
                            "offset": 15,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.106947939665598, "y": 0.043700774077746224 }, "span": { "x": 0.490905201848443, "y": 0.3337432090175896 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-08_EA_GorShep-01_GorShep-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 28
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-08_EA_GorShep-01_GorShep-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 28
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
        "S-MR-08_EA_GorShep-01_GorShep": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
                        "experienceStreamId": "ES-MR-01_GorShep",
                        "begin": 0,
                        "duration": 30,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-08_EA_GorShep-01_GorShep-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 28,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 30,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
