[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-04_EA_Thyangb-01_Monastery",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 42,
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
            "uriReference": "04_EA_Thyangb/screenplayproperties-01_Monastery.js"
        },
        "R-pano-04_EA_Thyangb": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ANEgn+S22C4/0.json"
        },
        "R-EAs-04_EA_Thyangb": {
            "doNotCopy": true,
            "uriReference": "04_EA_Thyangb/EAs.js"
        },
        "R-audio-MR-04_EA_Thyangb-01_Monastery-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/04_EA_Thyangb_Fix_2_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-04_EA_Thyangb": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-04_EA_Thyangb",
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
                    "resourceId": "R-pano-04_EA_Thyangb",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-01_Monastery": {
                    "duration": 42,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "establishing",
                            "offset": 0,
                            "holdDuration": 5,
                            "state": { "viewport": { "region": { "center": { "x": 6.280495498131166, "y": 0.0001 }, "span": { "x": 1.1484448032763807, "y": 0.8124347726060952 } } } }
                        },
                                                {
                                                    "what": "establishing",
                                                    "offset": 5,
                                                    "holdDuration": 0.1,
                                                    "state": { "viewport": { "region": { "center": { "x": 6.280495498131166, "y": 0.0001 }, "span": { "x": 1.1484448032763807, "y": 0.8124347726060952 } } } }
                                                },
                        {
                            "what": "start pan of mountains",
                            "offset": 11,
                            "holdDuration": 3,
                            "state": { "viewport": { "region": { "center": { "x": 6.128303509365466, "y": 0.13490009684352655 }, "span": { "x": 0.9694057103442168, "y": 0.6806213862767307 } } } }
                        },
                        {
                            "what": "pan right",
                            "offset": 20,
                            "holdDuration": 3,
                            "state": { "viewport": { "region": { "center": { "x": 0.36043878074524643, "y": 0.13490011432493273 }, "span": { "x": 0.9694057103442168, "y": 0.6806213862767307 } } } }
                        },
                        {
                            "what": "zoom into Thyangboche",
                            "offset": 27,
                            "state": { "viewport": { "region": { "center": { "x": 0.42352166399621915, "y": 0.16365410081477383 }, "span": { "x": 0.5147194210447973, "y": 0.35031790702937326 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-04_EA_Thyangb-01_Monastery-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 34.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-04_EA_Thyangb-01_Monastery-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 34.5
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
        "S-MR-04_EA_Thyangb-01_Monastery": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
                        "experienceStreamId": "ES-MR-01_Monastery",
                        "begin": 0,
                        "duration": 37,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-04_EA_Thyangb-01_Monastery-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 34.5,
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
