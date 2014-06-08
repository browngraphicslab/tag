[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-03_EA_Nam-01_NamBaz",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 37,
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
            "uriReference": "03_EA_Nam/screenplayproperties-01_NamBaz.js"
        },
        "R-pano-03_EA_Nam": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ANEgn+S22C4/0.json"
        },
        "R-EAs-03_EA_Nam": {
            "doNotCopy": true,
            "uriReference": "03_EA_Nam/EAs.js"
        },
        "R-audio-MR-03_EA_Nam-01_NamBaz-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/03_EA_Nam_Fix_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-03_EA_Nam": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-03_EA_Nam",
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
                    "resourceId": "R-pano-03_EA_Nam",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-01_NamBaz": {
                    "duration": 37,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.505798385340417, "y": -0.08562631922553258 }, "span": { "x": 0.6642377673072518, "y": 0.3342037100029554 } } } }
                        },
                        {
                            "what": "stay zoomed in ",
                            "offset": 37,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.505798385340417, "y": -0.08562631922553258 }, "span": { "x": 0.6642377673072518, "y": 0.3342037100029554 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-03_EA_Nam-01_NamBaz-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 35
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-03_EA_Nam-01_NamBaz-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 35
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
        "S-MR-03_EA_Nam-01_NamBaz": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
                        "experienceStreamId": "ES-MR-01_NamBaz",
                        "begin": 0,
                        "duration": 37,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-03_EA_Nam-01_NamBaz-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 35,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 37,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
