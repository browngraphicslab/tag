[{
    "version": 1.0,
    "defaultScreenplayId": "S-07_EA_TermKhuGl-entry",
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
            "uriReference": "07_EA_TermKhuGl/screenplayproperties.js"
        },
        "R-pano-06_EA_PherDingb": {
            "doNotCopy": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AOEgF2435y4/0.json"
        },
        "R-EAs-06_EA_PherDingb": {
            "doNotCopy": true,
            "uriReference": "06_EA_PherDingb/EAs.js"
        },
        "R-pano-07A_EG_KhuGl_Lbche": {
            "doNotCopy":true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AG8g_QxBgy4/0.json"
        },
        "R-EAs-07A_EG_KhuGl_Lbche": {
            "doNotCopy": true,
            "uriReference": "07A_EG_KhuGl_Lbche/EAs.js"
        },
        "R-pano-07_EA_TermKhuGl": {
            "doNotOverride": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AOEgqKw65y4/0.json"
        },
        "R-pano-08_EA_GorShep": {
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AHggVzJRjC4/0.json"
        },
        "R-EAs-07_EA_TermKhuGl": {
            "uriReference": "07_EA_TermKhuGl/EAs.js"
        },
        "R-EAs-08_EA_GorShep": {
            "uriReference": "08_EA_GorShep/EAs.js"
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
                "ES-07_EA_TermKhuGl-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "TermKhuGl"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-06_EA_PherDingb": {
            "doNotCopy":true,
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
                "ES-entry": {
                    "duration": 3,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 3,
                            "state": { "viewport": { "region": { "center": { "x": 6.229013444972436, "y": 0.0001 }, "span": { "x": 1.3493495905128423, "y": 0.9775804444236765 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-07_EA_TermKhuGl": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotOverride": true,
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
                "maxPixelScaleFactor": 0.5,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": false
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
                },
                "ES-to-07A_EG_KhuGl_Lbche": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.261641317783318, "y": 0.00010085346600420256 }, "span": { "x": 1.3455934606135968, "y": 0.9743901884998827 } } } }
                        }
                    ]
                },
                "ES-to-06_EA_PherDingb": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.261641317783318, "y": 0.00010085346600420256 }, "span": { "x": 1.3455934606135968, "y": 0.9743901884998827 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.261641317783318, "y": 0.00010085346600420256 }, "span": { "x": 1.3455934606135968, "y": 0.9743901884998827 } } } }
                        }
                    ]
                },
                "ES-to-08_EA_GorShep": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.156457633363201, "y": 0.14237978922378783 }, "span": { "x": 0.49463406944639454, "y": 0.33633495997305734 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-07A_EG_KhuGl_Lbche": {
            "doNotCopy":true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-07A_EG_KhuGl_Lbche",
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
                    "resourceId": "R-pano-07A_EG_KhuGl_Lbche",
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
                            "state": { "viewport": { "region": { "center": { "x": 5.666644342327932, "y": -0.00009921460183660571 }, "span": { "x": 0.9824832791292843, "y": 0.6768922655314372 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-08_EA_GorShep": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
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
                "minFieldOfView": 0.13,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": true
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
        "S-07_EA_TermKhuGl-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-07_EA_TermKhuGl",
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
        "S-07_EA_TermKhuGl-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-07_EA_TermKhuGl",
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
        "S-07_EA_TermKhuGl-to-07A_EG_KhuGl_Lbche": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-07_EA_TermKhuGl",
                        "experienceStreamId": "ES-to-07A_EG_KhuGl_Lbche",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-07A_EG_KhuGl_Lbche",
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
        "S-07_EA_TermKhuGl-to-08_EA_GorShep": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-07_EA_TermKhuGl",
                        "experienceStreamId": "ES-to-08_EA_GorShep",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-08_EA_GorShep",
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
        "S-07_EA_TermKhuGl-to-06_EA_PherDingb": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-07_EA_TermKhuGl",
                        "experienceStreamId": "ES-to-06_EA_PherDingb",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-06_EA_PherDingb",
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
