[{
    "version": 1,
    "defaultScreenplayId": "S-09_EA_ABC-main",
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
        "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
            "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
            "version": 0
        },
        "MicrosoftResearch.Rin.PanoramicExperienceStream": {
            "name": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "version": 0
        },
        "MicrosoftResearch.Rin.FadeInOutTransitionService": {
            "name": "MicrosoftResearch.Rin.FadeInOutTransitionService",
            "version": 0
        },
        "MicrosoftResearch.Rin.AudioExperienceStream": {
            "name": "MicrosoftResearch.Rin.AudioExperienceStream",
            "version": 0
        },
        "microsoftResearch.rin.twodlayoutengine": {
            "name": "microsoftResearch.rin.twodlayoutengine",
            "version": 0
        }
    },
    "resources": {
        "ScreenplayProperties": {
            "uriReference": "screenplayproperties.js"
        },
        "R-pano-08_EA_GorShep": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AN4gdd9A5y4/0.json"
        },
        "R-EAs-08_EA_GorShep": {
            "doNotCopy": true,
            "uriReference": "08_EA_GorShep/EAs.js"
        },
        "R-pano-09_EA_ABC": {
            "uriReferenceCorrect": "http://cdn3.ps1.photosynth.net/pano/c01001300-AHggRQxUjC4/0.json",
            "uriReferencePumoriPano": "http://cdn3.ps1.photosynth.net/pano/c01001300-APEfp_CjFS4/0.json",
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-APEfp_CjFS4/0.json"
        },
        "R-pano-10A_EA_AboveIceFall02": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AHgg6rtWjC4/0.json"
        },
        "R-EAs-09_EA_ABC": {
            "uriReference": "EBC-EAs.js"
        },
        "R-EAs-10A_EA_AboveIceFall02": {
            "uriReference": "10A_EA_AboveIceFall02/EAs.js"
        },
        "R-pano-09A_EG_EBCPumoRi": {
            "doNotCopy": true,
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-APEfp_CjFS4/0.json"
        },
        "R-EAs-09A_EG_EBCPumoRi": {
            "doNotCopy": true,
            "uriReference": "09A_EG_EBCPumoRi/EAs.js"
        },
        "R-audio-background-music-01": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        },
        "R-DefaultAdaptiveTransitionProfile": {
            "data": {
                "durationScaleOverride": 3,
                "trasitionPauseDuration": 0,
                "capAdaptiveOffset": true,
                "maxAdaptiveDuration": 6
            }
        },
        "R-audio-MR-09_EA_ABC-01_PumoRi-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/09A_EG_EBCPumoRi_Part1_MIX.mp3"
        },
        "R-audio-MR-09_EA_ABC-02_EBC-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/09A_EG_EBCPumoRi_Part2_MIX.mp3"
        },
        "R-audio-MR-09_EA_ABC-03_Everest-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/09A_EG_EBCPumoRi_Part3_MIXv2.mp3"
        }
    },
    "experiences": {
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
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2404564917220275,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.3490242131140088,
                                            "y": 0.9773039214383076
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
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
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
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.00954341349878,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1948616605663524,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-09A_EG_EBCPumoRi": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.00954341349878,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1948616605663524,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-08_EA_GorShep": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.00954341349878,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1948616605663524,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-10A_EA_AboveIceFall02": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.861136205213829,
                                            "y": -0.08188450018451693
                                        },
                                        "span": {
                                            "x": 0.4178018395185591,
                                            "y": 0.2831803188286974
                                        }
                                    }
                                }
                            }
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.00954341349878,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1948616605663524,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-MR-01_PumoRi": {
                    "duration": 18,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "establishing",
                            "offset": 0,
                            "holdDuration": 10,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.00954341349878,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1948616605663524,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "establishing",
                            "offset": 10,
                            "holdDuration": 0.1,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.00954341349878,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1948616605663524,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "ablation zone, gorak shep",
                            "offset": 17,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.5275859972977057,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.1421796335429042,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-MR-02_EBC": {
                    "duration": 25,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "Base camp  - establishing",
                            "offset": 0,
                            "holdDuration": 15,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.953901218194937,
                                            "y": -0.09848444441362636
                                        },
                                        "span": {
                                            "x": 0.8231004501184066,
                                            "y": 0.5706615090651558
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "Base camp  - establishing",
                            "offset": 15,
                            "holdDuration": 0.1,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.953901218194937,
                                            "y": -0.09848444441362636
                                        },
                                        "span": {
                                            "x": 0.8231004501184066,
                                            "y": 0.5706615090651558
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "Up to w. cwm.",
                            "offset": 24,
                            "holdDuration": 4,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.958465117780102,
                                            "y": 0.030040532739847525
                                        },
                                        "span": {
                                            "x": 0.41386993829786783,
                                            "y": 0.27798288967743
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-MR-03_Everest": {
                    "duration": 35,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "establishing",
                            "offset": 0,
                            "holdDuration": 10,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.792751056721707,
                                            "y": 0.16292573532136242
                                        },
                                        "span": {
                                            "x": 0.7167672091752864,
                                            "y": 0.4891792565932121
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "establishing",
                            "offset": 10,
                            "holdDuration": 0.1,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.792751056721707,
                                            "y": 0.16292573532136242
                                        },
                                        "span": {
                                            "x": 0.7167672091752864,
                                            "y": 0.4891792565932121
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoom to peak",
                            "offset": 14,
                            "holdDuration": 3.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.814816803201763,
                                            "y": 0.275016342462137
                                        },
                                        "span": {
                                            "x": 0.16177669599660993,
                                            "y": 0.10839169842290201
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoom out",
                            "offset": 32,
                            "holdDuration": 3,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.095612798526914,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.149946363602385,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-09A_EG_EBCPumoRi": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-09A_EG_EBCPumoRi",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true,
                "minFieldOfView": 0.018,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-09A_EG_EBCPumoRi",
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2578932723280145,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.2483337221767714,
                                            "y": 0.8926486459324999
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-10A_EA_AboveIceFall02": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-10A_EA_AboveIceFall02",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
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
                    "resourceId": "R-pano-10A_EA_AboveIceFall02",
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
                                            "x": 6.130727691614284,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 1.1544097149972922,
                                            "y": 0.8152307272359369
                                        }
                                    }
                                }
                            }
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
        },
        "E-audio-MR-09_EA_ABC-01_PumoRi-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 16
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-09_EA_ABC-01_PumoRi-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 16
                }
            }
        },
        "E-audio-MR-09_EA_ABC-02_EBC-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 23.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-09_EA_ABC-02_EBC-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 23.5
                }
            }
        },
        "E-audio-MR-09_EA_ABC-03_Everest-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 33
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-09_EA_ABC-03_Everest-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 33
                }
            }
        }
    },
    "screenplays": {
        "S-09_EA_ABC-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
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
        "S-09_EA_ABC-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
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
        "S-09_EA_ABC-to-09A_EG_EBCPumoRi": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
                        "experienceStreamId": "ES-to-09A_EG_EBCPumoRi",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-09A_EG_EBCPumoRi",
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
        "S-09_EA_ABC-to-10A_EA_AboveIceFall02": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
                        "experienceStreamId": "ES-to-10A_EA_AboveIceFall02",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-10A_EA_AboveIceFall02",
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
        "S-09_EA_ABC-to-08_EA_GorShep": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
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
                        "duration": 1,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-MR-09_EA_ABC-01_PumoRi": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
                        "experienceStreamId": "ES-MR-01_PumoRi",
                        "begin": 0,
                        "duration": 18,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-09_EA_ABC-01_PumoRi-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 16,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 18,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        },
        "S-MR-09_EA_ABC-02_EBC": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
                        "experienceStreamId": "ES-MR-02_EBC",
                        "begin": 0,
                        "duration": 25,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-09_EA_ABC-02_EBC-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 23.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 25,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        },
        "S-MR-09_EA_ABC-03_Everest": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-09_EA_ABC",
                        "experienceStreamId": "ES-MR-03_Everest",
                        "begin": 0,
                        "duration": 35,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-09_EA_ABC-03_Everest-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 33,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 35,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]