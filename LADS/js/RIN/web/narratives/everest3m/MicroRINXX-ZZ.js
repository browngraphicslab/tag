[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-XX-ZZ",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 123456789,
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
            "uriReference": "XX/screenplayproperties-ZZ.js"
        },
        "R-pano-XX": {
            "doNotCopy": true,
            "uriReference": "XX.json"
        },
        "R-EAs-XX": {
            "doNotCopy": true,
            "uriReference": "XX/EAs.js"
        },
        "R-audio-MR-XX-ZZ-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/trektoeverest/silence.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-XX": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-XX",
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
                    "resourceId": "R-pano-XX",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-MR-ZZ": {
                    "duration": 123456789,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.43515307911359124, "y": 0.13517315789702694 }, "span": { "x": 0.4289947711585057, "y": 0.21228245045338112 } } } }
                        },
                        {
                            "what": "stay zoomed in ",
                            "offset": 12345678,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.43515307911359124, "y": 0.13517315789702694 }, "span": { "x": 0.4289947711585057, "y": 0.21228245045338112 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-XX-ZZ-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 12345
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-XX-ZZ-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 12345
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
        "S-MR-XX-ZZ": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-XX",
                        "experienceStreamId": "ES-MR-ZZ",
                        "begin": 0,
                        "duration": 123456789,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "E-audio-MR-XX-ZZ-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 123,
                        "duration": 12345,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 1
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 123456789,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.5
                    }
                ]
            }
        }
    }
}]
