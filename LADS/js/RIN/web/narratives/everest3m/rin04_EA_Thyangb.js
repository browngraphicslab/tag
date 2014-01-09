[{
    "version": 1.0,
    "defaultScreenplayId": "S-04_EA_Thyangb-entry",
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
            "uriReference": "04_EA_Thyangb/screenplayproperties.js"
        },
        "R-pano-03_EA_Nam": {
            "doNotCopy" : true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ANEgn+S22C4/0.json"
        },
        "R-EAs-03_EA_Nam": {
            "doNotCopy": true,
            "uriReference": "03_EA_Nam/EAs.js"
        },
        "R-pano-04_EA_Thyangb": {
            "doNotOverride" : true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-ANEg2nO52C4/0.json"
        },
        "R-pano-04A_EA_ThyangbMon": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOEg7Akx5y4/0.json"
        },
        "R-EAs-04A_EA_ThyangbMon": {
            "doNotCopy": true,
            "uriReference": "04A_EA_ThyangbMon/EAs.js"
        },
        "R-pano-04B_EG_AboveThyangb": {
            "doNotCopy": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AGognxY2gy4/0.json"
        },
        "R-EAs-04B_EG_AboveThyangb": {
            "doNotCopy": true,
            "uriReference": "04B_EG_AboveThyangb/EAs.js"
        },
        "R-pano-04C_CG_NgozGlGokRi": {
            "doNotCopy":true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AG8gqfr0gS4/0.json"
        },
        "R-EAs-04C_CG_NgozGlGokRi": {
            "doNotCopy": true,
            "uriReference": "04C_CG_NgozGlGokRi/EAs.js"
        },
        "R-pano-05_EA_Pang": {
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AHgg57dIjC4/0.json"
        },
        "R-EAs-04_EA_Thyangb": {
            "uriReference": "04_EA_Thyangb/EAs.js"
        },
        "R-EAs-05_EA_Pang": {
            "uriReference": "05_EA_Pang/EAs.js"
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
                "ES-04_EA_Thyangb-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "Thyangboche"
                                    }
                                }
                            }
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
                "minFieldOfView": 0.12,
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
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.279180382527993, "y": -0.00010085346600420256 }, "span": { "x": 1.342409612053634, "y": 0.9739020059454657 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-04_EA_Thyangb": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotOverride": true,
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
                "maxPixelScaleFactor": 0.5,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": false
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-04_EA_Thyangb",
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
                            "state": { "viewport": { "region": { "center": { "x": 6.245466510717666, "y": 0.0001 }, "span": { "x": 1.3405415338953183, "y": 0.9723162661096154 } } } }
                        }
                    ]
                },
                "ES-main": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": { "viewport": { "region": { "center": { "x": 6.245466510717666, "y": 0.0001 }, "span": { "x": 1.3405415338953183, "y": 0.9723162661096154 } } } }
                        }
                    ]
                },
                "ES-to-03_EA_Nam": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": { "viewport": { "region": { "center": { "x": 6.245466510717666, "y": 0.0001 }, "span": { "x": 1.3405415338953183, "y": 0.9723162661096154 } } } }
                        }
                    ]
                },
                "ES-to-Pang": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": { "viewport": { "region": { "center": { "x": 0.2725437143893258, "y": 0.08975373788303575 }, "span": { "x": 0.8399639844056759, "y": 0.5833900004592363 } } } }

                        }
                    ]
                },
                "ES-to-04A_EA_ThyangbMon": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "what": "zoomed in toward Thyangbe",
                            "offset": 0.5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.5003084057666216, "y": 0.2206643552652294 }, "span": { "x": 0.5943004934001912, "y": 0.4308910667166022 } } } }
                        }
                    ]
                },
                "ES-to-04B_EG_AboveThyangb": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "what": "zoomed in toward Thyangbe",
                            "offset": 0.5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.5003084057666216, "y": 0.2206643552652294 }, "span": { "x": 0.5943004934001912, "y": 0.4308910667166022 } } } }
                        }
                    ]
                },
                "ES-to-04C_CG_NgozGlGokRi": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "what": "zoomed in toward Ngozumpa",
                            "offset": 0.5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.876501554378248, "y": 0.22066400726130267 }, "span": { "x": 0.5901869938939552, "y": 0.4278234922665555 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-04A_EA_ThyangbMon": {
            "doNotCopy":true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-04A_EA_ThyangbMon",
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
                    "resourceId": "R-pano-04A_EA_ThyangbMon",
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
                            "state": { "viewport": { "region": { "center": { "x": 6.280495498131166, "y": 0.0001 }, "span": { "x": 1.1484448032763807, "y": 0.8124347726060952 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-04B_EG_AboveThyangb": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-04B_EG_AboveThyangb",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts", "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true,
                "minFieldOfView": 0.12,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.9,
                "showLowerFidelityWhileMoving": false
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-04B_EG_AboveThyangb",
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
                            "state": { "viewport": { "region": { "center": { "x": 0.15127461766616612, "y": 0.0001 }, "span": { "x": 1.8521898450883933, "y": 1.402105367667739 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-04C_CG_NgozGlGokRi": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-04C_CG_NgozGlGokRi",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts", "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true,
                "minFieldOfView": 0.035,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-04C_CG_NgozGlGokRi",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-entry": {
                    "duration": 3,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 3,
                            "state": { "viewport": { "region": { "center": { "x": 0.0008349215930356646, "y": 0.0001 }, "span": { "x": 1.2775986670063352, "y": 0.9435982974567183 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-05_EA_Pang": {
            "doNotCopy": true,
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
                "ES-entry": {
                    "duration": 2.4,
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
        "S-04_EA_Thyangb-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
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
        "S-04_EA_Thyangb-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
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
        "S-04_EA_Thyangb-to-04A_EA_ThyangbMon": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
                        "experienceStreamId": "ES-to-04A_EA_ThyangbMon",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-04A_EA_ThyangbMon",
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
        },
        "S-04_EA_Thyangb-to-04B_EG_AboveThyangb": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
                        "experienceStreamId": "ES-to-04B_EG_AboveThyangb",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-04B_EG_AboveThyangb",
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
        },
        "S-04_EA_Thyangb-to-04C_CG_NgozGlGokRi": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
                        "experienceStreamId": "ES-to-04C_CG_NgozGlGokRi",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-04C_CG_NgozGlGokRi",
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
        },
        "S-04_EA_Thyangb-to-05_EA_Pang": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
                        "experienceStreamId": "ES-to-Pang",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-05_EA_Pang",
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
                        "duration": 1.0,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-04_EA_Thyangb-to-03_EA_Nam": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
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
                        "duration": 1.0,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        }
    }
}]
