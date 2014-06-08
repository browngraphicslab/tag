[{
    "version": 1.0,
    "defaultScreenplayId": "S-H05_EA_OverSCol-entry",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 10,
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
        "R-OVERLAYS": {
            "uriReference": "common/RIN_OVERLAYS.js"
        },
        "ScreenplayProperties": {
            "uriReference": "common/screenplayproperties.js"
        },
        "R-pano-H04_EA_OverWCwm": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwg_z708i4/0.json"
        },
        "R-EAs-H04_EA_OverWCwm": {
            "doNotCopy": true,
            "uriReference": "H04_EA_OverWCwm/EAs.js"
        },
        "R-pano-H05_EA_OverSCol": {
            "doNotOverride": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AOwgZpr28i4/0.json"
        },
        "R-EAs-H05_EA_OverSCol": {
            "doNotOverride": true,
            "uriReference": "H05_EA_OverSCol/EAs.js"
        },
        "R-audio-background-music-01": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "ES-OVERLAYS": {
            "providerId": "microsoftResearch.rin.twodlayoutengine",
            "data": {
                "contentType": "TitleOverlays"
            },
            "resourceReferences": [
                {
                    "resourceId": "R-OVERLAYS",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-H05_EA_OverSCol-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "H05_EA_OverSCol"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-H04_EA_OverWCwm": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-H04_EA_OverWCwm",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts", "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true,
                "interpolatorType": "vectorBased",
                "minFieldOfView": 0.08,
                "viewShrinkFactor": 0.985,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-H04_EA_OverWCwm",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-entry": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.0693277137675885, "y": 0.0001 }, "span": { "x": 0.9493326078128543, "y": 0.6624122984718989 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-H05_EA_OverSCol": {
            "doNotOverride": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-H05_EA_OverSCol",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts", "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true,
                "interpolatorType": "vectorBased",
                "minFieldOfView": 0.08,
                "viewShrinkFactor": 0.985,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-H05_EA_OverSCol",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-entry": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.245238861308675, "y": 0.0001 }, "span": { "x": 0.9139869817969217, "y": 0.6357929905060868 } } } }
                        }
                    ]
                },
                "ES-main": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.245238861308675, "y": 0.0001 }, "span": { "x": 0.9139869817969217, "y": 0.6357929905060868 } } } }
                        }
                    ]
                },
                "ES-to-H04_EA_OverWCwm": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.245238861308675, "y": 0.0001 }, "span": { "x": 0.9139869817969217, "y": 0.6357929905060868 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-background-music-01": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 10,
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
        "S-H05_EA_OverSCol-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H05_EA_OverSCol",
                        "experienceStreamId": "ES-main",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-H05_EA_OverSCol-to-H04_EA_OverWCwm": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H05_EA_OverSCol",
                        "experienceStreamId": "ES-to-H04_EA_OverWCwm",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H04_EA_OverWCwm",
                        "experienceStreamId": "ES-entry",
                        "begin": 0.5,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 1,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        }
    }
}]
