[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-06_EA_PherDingb-01_PherDingb",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 34,
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
            "uriReference": "06_EA_PherDingb/screenplayproperties-01_PherDingb.js"
        },
        "R-pano-06_EA_PherDingb": {
            "doNotCopy": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AOEgF2435y4/0.json"
        },
        "R-EAs-06_EA_PherDingb": {
            "doNotCopy": true,
            "uriReference": "06_EA_PherDingb/EAs.js"
        },
        "R-audio-MR-06_EA_PherDingb-01_PherDingb-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/06_EA_PherDingb_Fix_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-06_EA_PherDingb": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-06_EA_PherDingb",
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
                    "resourceId": "R-pano-06_EA_PherDingb",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-01_PherDingb": {
                    "duration": 34,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom to P & D common view",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.15014045235244325, "y": 0.04524630155428317 }, "span": { "x": 0.8842719651835669, "y": 0.6160386790899782 } } } }
                        },
                                                {
                                                    "what": "zoom to P & D common view",
                                                    "offset": 6,
                                                    "holdDuration": 8,
                                                    "state": { "viewport": { "region": { "center": { "x": 0.15014045235244325, "y": 0.04524630155428317 }, "span": { "x": 0.8842719651835669, "y": 0.6160386790899782 } } } }
                                                },
                        {
                            "what": "zoom to P ",
                            "offset": 19,
                            "holdDuration": 3.5,
                            "state": { "viewport": { "region": { "center": { "x": 6.162031954197768, "y": -0.06180980436403595 }, "span": { "x": 0.69704642982476, "y": 0.47901441776760145 } } } }
                        },
                                                {
                                                    "what": "zoom to D",
                                                    "offset": 25,
                                                    "holdDuration": 0,
                                                    "state": { "viewport": { "region": { "center": { "x": 0.4155026480547478, "y": 0.07269134634055807 }, "span": { "x": 0.69704642982476, "y": 0.47901441776760145 } } } }
                                                }
                    ]
                }


            }
        },
        "E-audio-MR-06_EA_PherDingb-01_PherDingb-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 32
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-06_EA_PherDingb-01_PherDingb-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 32
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
        "S-MR-06_EA_PherDingb-01_PherDingb": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06_EA_PherDingb",
                        "experienceStreamId": "ES-MR-01_PherDingb",
                        "begin": 0,
                        "duration": 34,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-06_EA_PherDingb-01_PherDingb-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 32,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 34,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
