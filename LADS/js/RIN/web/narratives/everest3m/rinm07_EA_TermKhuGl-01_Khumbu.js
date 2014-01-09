[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-07_EA_TermKhuGl-01_Khumbu",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 39,
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
            "uriReference": "07_EA_TermKhuGl/screenplayproperties-01_Khumbu.js"
        },
        "R-pano-07_EA_TermKhuGl": {
            "doNotCopy": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AOEgF2435y4/0.json"
        },
        "R-EAs-07_EA_TermKhuGl": {
            "doNotCopy": true,
            "uriReference": "07_EA_TermKhuGl/EAs.js"
        },
        "R-audio-MR-07_EA_TermKhuGl-01_Khumbu-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/07_EA_TermKhuGl_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-07_EA_TermKhuGl": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-07_EA_TermKhuGl",
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
                    "resourceId": "R-pano-07_EA_TermKhuGl",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-01_Khumbu": {
                    "duration": 39,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 19,
                            "state": { "viewport": { "region": { "center": { "x": 6.261641317783318, "y": 0.00010085346600420256 }, "span": { "x": 1.3455934606135968, "y": 0.9743901884998827 } } } }
                        },
                                                {
                                                    "what": "zoom in",
                                                    "offset": 19,
                                                    "holdDuration": 0.1,
                                                    "state": { "viewport": { "region": { "center": { "x": 6.261641317783318, "y": 0.00010085346600420256 }, "span": { "x": 1.3455934606135968, "y": 0.9743901884998827 } } } }
                                                },
                        {
                            "what": "stay zoomed in ",
                            "offset": 33,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.195793242282733, "y": 0.17840258566336756 }, "span": { "x": 0.34708508749284966, "y": 0.23454868855199676 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-07_EA_TermKhuGl-01_Khumbu-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 37.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-07_EA_TermKhuGl-01_Khumbu-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 37.5
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
        "S-MR-07_EA_TermKhuGl-01_Khumbu": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-07_EA_TermKhuGl",
                        "experienceStreamId": "ES-MR-01_Khumbu",
                        "begin": 0,
                        "duration": 39,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-07_EA_TermKhuGl-01_Khumbu-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 37.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 39,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
