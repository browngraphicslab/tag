[{
    "version": 1.0,
    "defaultScreenplayId": "S-03A_EA_NamBaz-main",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 55.05,
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
            "uriReference": "03A_EA_NamBaz/screenplayproperties.js"
        },
        "R-pano-03A_EA_NamBaz": {
            "doNotOverride": true,
            "uriReferenceBeta": "http://cdn3.ps1.photosynth.net/pano/c01001300-ANEgvci72C4/0.json",
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AAUhybgADS8/0.json"
        },
        "R-pano-03_EA_Nam": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ANEgn+S22C4/0.json"
        },
        "R-EAs-03A_EA_NamBaz": {
            "uriReference": "03A_EA_NamBaz/EAs.js"
        },
        "R-EAs-03_EA_Nam": {
            "uriReference": "03_EA_Nam/EAs.js"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
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
                "ES-03A_EA_NamBaz-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "NamcheBazaar"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-03A_EA_NamBaz": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-03A_EA_NamBaz",
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
                    "resourceId": "R-pano-03A_EA_NamBaz",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-entry": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.16973349879405713, "y": 0.0001 }, "span": { "x": 1.3419170708910257, "y": 0.9734838076033955 } } } }
                        }
                    ]
                },
                "ES-main": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.16973349879405713, "y": 0.0001 }, "span": { "x": 1.3419170708910257, "y": 0.9734838076033955 } } } }
                        }
                    ]
                },
                "ES-to-03_EA_Nam": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.16973349879405713, "y": 0.0001 }, "span": { "x": 1.3419170708910257, "y": 0.9734838076033955 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-03_EA_Nam": {
            "doNotCopy": true,
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
                "ES-entry": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": { "viewport": { "region": { "center": { "x": 0.05460693597995456, "y": 0.05418012370945906 }, "span": { "x": 1.604889432814648, "y": 0.9770422267702635 } } } }
                        }
                    ]
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
        "S-03A_EA_NamBaz-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03A_EA_NamBaz",
                        "experienceStreamId": "ES-entry",
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
        "S-03A_EA_NamBaz-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03A_EA_NamBaz",
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
        "S-03A_EA_NamBaz-to-03_EA_Nam": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03A_EA_NamBaz",
                        "experienceStreamId": "ES-to-03_EA_Nam",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-03_EA_Nam",
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
