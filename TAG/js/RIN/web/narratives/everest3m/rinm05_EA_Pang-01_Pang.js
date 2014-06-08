[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-05_EA_Pang-01_Pang",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 26,
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
            "uriReference": "05_EA_Pang/screenplayproperties-01_Pang.js"
        },
        "R-pano-05_EA_Pang": {
            "doNotCopy": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-ANEg2nO52C4/0.json"
        },
        "R-EAs-05_EA_Pang": {
            "doNotCopy": true,
            "uriReference": "05_EA_Pang/EAs.js"
        },
        "R-audio-MR-05_EA_Pang-01_Pang-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/05_EA_Pang_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-05_EA_Pang": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-05_EA_Pang",
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
                    "resourceId": "R-pano-05_EA_Pang",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-01_Pang": {
                    "duration": 26,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.1246257814989295, "y": 0.0001 }, "span": { "x": 0.4722944463770044, "y": 0.2342953819137856 } } } }
                        },
                        {
                            "what": "stay zoomed in ",
                            "offset": 26,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.1246257814989295, "y": 0.0001 }, "span": { "x": 0.4722944463770044, "y": 0.2342953819137856 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-05_EA_Pang-01_Pang-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 24.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-05_EA_Pang-01_Pang-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 24.5
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
        "S-MR-05_EA_Pang-01_Pang": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-05_EA_Pang",
                        "experienceStreamId": "ES-MR-01_Pang",
                        "begin": 0,
                        "duration": 26,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-05_EA_Pang-01_Pang-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 24.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 26,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
