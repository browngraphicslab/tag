[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-01_EA_LuklaVil-01_Lukla",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 38,
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
            "uriReference": "01_EA_LuklaVil/screenplayproperties-01_Lukla.js"
        },
        "R-pano-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AM8gmvex2C4/0.json"
        },
        "R-EAs-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "01_EA_LuklaVil/EAs.js"
        },
        "R-audio-MR-01_EA_LuklaVil-01_Lukla-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/01_EA_LuklaVil_MIX.mp3"
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
                "ES-MR-01_Lukla": {
                    "duration": 38,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "lukla establishing",
                            "offset": 0,
                            "holdDuration": 25,
                            "state": { "viewport": { "region": { "center": { "x": 0.4128497095453415, "y": 0.08958161738440515 }, "span": { "x": 0.3974712196840153, "y": 0.26905999726477153 } } } }
                        },
                        {
                            "what": "lukla establishing",
                            "offset": 25,
                            "holdDuration": 0.1,
                            "state": { "viewport": { "region": { "center": { "x": 0.4128497095453415, "y": 0.08958161738440515 }, "span": { "x": 0.3974712196840153, "y": 0.26905999726477153 } } } }
                        },
                        {
                            "what": "airport",
                            "offset": 28,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.4424385129267942, "y": 0.0941131062284538 }, "span": { "x": 0.22269115956057028, "y": 0.15 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-01_EA_LuklaVil-01_Lukla-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 36
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-01_EA_LuklaVil-01_Lukla-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 36
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
        "S-MR-01_EA_LuklaVil-01_Lukla": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-MR-01_Lukla",
                        "begin": 0,
                        "duration": 38,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-01_EA_LuklaVil-01_Lukla-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 36,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 38,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]
