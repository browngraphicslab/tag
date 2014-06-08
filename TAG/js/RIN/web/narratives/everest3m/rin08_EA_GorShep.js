[{
    "version": 1.0,
    "defaultScreenplayId": "S-08_EA_GorShep-entry",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 0.5,
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
            "uriReference": "08_EA_GorShep/screenplayproperties.js"
        },
        "R-pano-07_EA_TermKhuGl": {
            "doNotCopy": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AOEgqKw65y4/0.json"
        },
        "R-EAs-07_EA_TermKhuGl": {
            "doNotCopy": true,
            "uriReference": "07_EA_TermKhuGl/EAs.js"
        },
        "R-pano-08_EA_GorShep": {
            "doNotOverride": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AN4gdd9A5y4/0.json"
        },
        "R-pano-09_EA_ABC": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AHggRQxUjC4/0.json"
        },
        "R-EAs-08_EA_GorShep": {
            "uriReference": "08_EA_GorShep/EAs.js"
        },
        "R-pano-08A_KG_AboveKalPat": {
            "doNotCopy": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AG0gW0EGgy4/0.json"
        },
        "R-EAs-08A_KG_AboveKalPat": {
            "doNotCopy":true,
            "uriReference": "08A_KG_AboveKalPat/EAs.js"
        },
        "R-pano-08B_EG_GrkShpAngLamu": {
            "doNotCopy": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AG8gINw8gy4/0.json"
        },
        "R-EAs-08B_EG_GrkShpAngLamu": {
            "doNotCopy": true,
            "uriReference": "08B_EG_GrkShpAngLamu/EAs.js"
        },
        "R-EAs-09_EA_ABC": {
            "uriReference": "09_EA_ABC/EAs.js"
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
                "ES-08_EA_GorShep-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "GorShep"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-07_EA_TermKhuGl": {
            "doNotCopy": true,
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
                "ES-entry": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.261641317783318, "y": 0.00010085346600420256 }, "span": { "x": 1.3455934606135968, "y": 0.9743901884998827 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-08_EA_GorShep": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotOverride": true,
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-08_EA_GorShep",
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
                    "resourceId": "R-pano-08_EA_GorShep",
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
                            "state": { "viewport": { "region": { "center": { "x": 6.2404564917220275, "y": 0.0001 }, "span": { "x": 1.3490242131140088, "y": 0.9773039214383076 } } } }
                        }
                    ]
                },
                "ES-to-07_EA_TermKhuGl": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2404564917220275, "y": 0.0001 }, "span": { "x": 1.3490242131140088, "y": 0.9773039214383076 } } } }
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
                            "state": {"viewport":{"region":{"center":{"x":6.2404564917220275,"y":0.0001},"span":{"x":1.3490242131140088,"y":0.9773039214383076}}}}
                        }
                    ]
                },
                "ES-to-09_EA_ABC": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.0,
                            "state": { "viewport": { "region": { "center": { "x": 0.2590823614304989, "y": 0.12170676960952278 }, "span": { "x": 0.4444831627011404, "y": 0.3015822306025803 } } } }
                        }
                    ]
                },
                "ES-to-08A_KG_AboveKalPat": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2404564917220275, "y": 0.0001 }, "span": { "x": 1.3490242131140088, "y": 0.9773039214383076 } } } }
                        }
                    ]
                },
                "ES-to-08B_EG_GrkShpAngLamu": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2404564917220275, "y": 0.0001 }, "span": { "x": 1.3490242131140088, "y": 0.9773039214383076 } } } }
                        }
                    ]
                },
                "ES-to-08B_EG_GrkShpAngLamu-2KF": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {"viewport":{"region":{"center":{"x":6.2404564917220275,"y":0.0001},"span":{"x":1.3490242131140088,"y":0.9773039214383076}}}}
                        },
                        {
                            "what": "zoomed in toward AngLamu",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.151490090194393, "y": -0.01845282871059666 }, "span": { "x": 0.41856727711242636, "y": 0.30128051503742925 } } } }
                        }
                    ]
                },
                "ES-to-08A_KG_AboveKalPat-2KF": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {"viewport":{"region":{"center":{"x":6.2404564917220275,"y":0.0001},"span":{"x":1.3490242131140088,"y":0.9773039214383076}}}}
                        },
                        {
                            "what": "zoomed in toward KalaPat",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.10106091450704, "y": 0.25858383617518565 }, "span": { "x": 0.49878268651540675, "y": 0.3599810963802406 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-08A_KG_AboveKalPat": {
            "doNotCopy":true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-08A_KG_AboveKalPat",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
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
                    "resourceId": "R-pano-08A_KG_AboveKalPat",
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.047817709256872,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 1.371946119555546,
                                            "y": 0.9991112868432013
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-08B_EG_GrkShpAngLamu": {
            "doNotCopy":true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-08B_EG_GrkShpAngLamu",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
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
                    "resourceId": "R-pano-08B_EG_GrkShpAngLamu",
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.101083251320044,
                                            "y": 0.00009943020835468932
                                        },
                                        "span": {
                                            "x": 1.4064314713841441,
                                            "y": 1.028876737652674
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-09_EA_ABC": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-09_EA_ABC",
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
                    "resourceId": "R-pano-09_EA_ABC",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-entry": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
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
        "S-08_EA_GorShep-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
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
        "S-08_EA_GorShep-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
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
        "S-08_EA_GorShep-to-08A_KG_AboveKalPat": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
                        "experienceStreamId": "ES-to-08A_KG_AboveKalPat",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-08A_KG_AboveKalPat",
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
        "S-08_EA_GorShep-to-08B_EG_GrkShpAngLamu": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
                        "experienceStreamId": "ES-to-08B_EG_GrkShpAngLamu",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-08B_EG_GrkShpAngLamu",
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
        "S-08_EA_GorShep-to-09_EA_ABC": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
                        "experienceStreamId": "ES-to-09_EA_ABC",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-09_EA_ABC",
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
        "S-08_EA_GorShep-to-07_EA_TermKhuGl": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
                        "experienceStreamId": "ES-to-07_EA_TermKhuGl",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-07_EA_TermKhuGl",
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
