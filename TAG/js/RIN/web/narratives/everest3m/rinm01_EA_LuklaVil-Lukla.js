[{
    "version": 1.0,
    "defaultScreenplayId": "S-MicroRIN-01_EA_LuklaVil-Lukla",
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
            "uriReference": "01_EA_LuklaVil/screenplayproperties-Lukla.js"
        },
        "R-pano-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AHMgfDD3ii4/0.json"
        },
        "R-EAs-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "01_EA_LuklaVil/EAs.js"
        },
        "R-audio-MicroRIN-01_EA_LuklaVil-Lukla-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/trektoeverest/01_EA_LuklaVil/01_EA_LuklaVil-A.mp3"
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
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-01_EA_LuklaVil",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MicroRin-Lukla": {
                    "duration": 21,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.43515307911359124, "y": 0.13517315789702694 }, "span": { "x": 0.4289947711585057, "y": 0.21228245045338112 } } } }
                        },
                        {
                            "what": "stay at zoom in",
                            "offset": 6,
                            "holdDuration": 1,
                            "state": { "viewport": { "region": { "center": { "x": 0.43515307911359124, "y": 0.13517315789702694 }, "span": { "x": 0.4289947711585057, "y": 0.21228245045338112 } } } }
                        },
                        {
                            "what": "zoom back out wide",
                            "offset": 21,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.43515307911359124, "y": 0.13517315789702694 }, "span": { "x": 0.4289947711585057, "y": 0.21228245045338112 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MicroRIN-01_EA_LuklaVil-Lukla-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 19
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MicroRIN-01_EA_LuklaVil-Lukla-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 19
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
        "S-MicroRIN-01_EA_LuklaVil-Lukla": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-MicroRin-Lukla",
                        "begin": 0,
                        "duration": 21,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MicroRIN-01_EA_LuklaVil-Lukla-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 19,
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
        }
    }
}]
