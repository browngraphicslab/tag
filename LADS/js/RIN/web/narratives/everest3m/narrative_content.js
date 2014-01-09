[{
    "version": 1,
    "defaultScreenplayId": "S-03_EA_Nam-main",
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
            "version": 0
        },
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
        }
    },
    "resources": {
        "R-OVERLAYS": {
            "uriReference": "common/RIN_OVERLAYS.js"
        },
        "ScreenplayProperties": {
            "uriReference": "common/screenplayproperties.js"
        },
        "R-pano-03A_EA_NamBaz": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AHggVcZcjC4/0.json"
        },
        "R-EAs-03A_EA_NamBaz": {
            "uriReference": "03A_EA_NamBaz/EAs.js"
        },
        "R-pano-03_EA_Nam": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ANEgn+S22C4/0.json"
        },
        "R-EAs-03_EA_Nam": {
            "uriReference": "03_EA_Nam/EAs.js"
        },
        "R-pano-04_EA_Thyangb": {
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-ANEg2nO52C4/0.json"
        },
        "R-EAs-04_EA_Thyangb": {
            "uriReference": "04_EA_Thyangb/EAs.js"
        },
        "R-audio-03_EA_Nam-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/trektoeverest/03_EA_Nam/5-Namche.mp3"
        },
        "R-audio-background-music-01": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        },
        "R-pano-03C_KG_AboveKhmjng": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AHUgguNLhi4/0.json"
        },
        "R-EAs-03C_KG_AboveKhmjng": {
            "uriReference": "03C_KG_AboveKhmjng/EAs.js"
        },
        "R-audio-03C_KG_AboveKhmjng-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/trektoeverest/silence.mp3"
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
                "ES-03_EA_Nam-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "NamcheVillage"
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-03C_KG_AboveKhmjng-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "AboveKhmjng"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-03_EA_Nam": {
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.279180382527993,
                                            "y": -0.00010085346600420256
                                        },
                                        "span": {
                                            "x": 1.342409612053634,
                                            "y": 0.9739020059454657
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-main": {
                    "duration": 6,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 3,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.279180382527993,
                                            "y": -0.00010085346600420256
                                        },
                                        "span": {
                                            "x": 1.342409612053634,
                                            "y": 0.9739020059454657
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "pan to Namche",
                            "offset": 6,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.844884307713608,
                                            "y": -0.00010085346600420256
                                        },
                                        "span": {
                                            "x": 1.342409612053634,
                                            "y": 0.9739020059454657
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-NamBaz": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.279180382527993,
                                            "y": -0.00010085346600420256
                                        },
                                        "span": {
                                            "x": 1.342409612053634,
                                            "y": 0.9739020059454657
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.314871488666837,
                                            "y": -0.026801892617666634
                                        },
                                        "span": {
                                            "x": 0.21256415644321702,
                                            "y": 0.14200631581024034
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-NamBaz-1F": {
                    "transitionType": "noZoomOut",
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.5545667779284615,
                                            "y": 0.1101521045724378
                                        },
                                        "span": {
                                            "x": 0.47736629935514885,
                                            "y": 0.321627071226837
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-04_EA_Thyangb": {
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
                                            "x": 6.217275541542118,
                                            "y": 0.11409521173775314
                                        },
                                        "span": {
                                            "x": 0.7053357733912745,
                                            "y": 0.4812323569788982
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-04_EA_Thyangb-2F": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.279180382527993,
                                            "y": -0.00010085346600420256
                                        },
                                        "span": {
                                            "x": 1.342409612053634,
                                            "y": 0.9739020059454657
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.217275541542118,
                                            "y": 0.11409521173775314
                                        },
                                        "span": {
                                            "x": 0.7053357733912745,
                                            "y": 0.4812323569788982
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-03C_KG_AboveKhmjng-2F": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.279180382527993,
                                            "y": -0.00010085346600420256
                                        },
                                        "span": {
                                            "x": 1.342409612053634,
                                            "y": 0.9739020059454657
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.897743069112849,
                                            "y": 0.10146381708946127
                                        },
                                        "span": {
                                            "x": 0.47736629935514885,
                                            "y": 0.321627071226837
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-03C_KG_AboveKhmjng-1F": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.897743069112849,
                                            "y": 0.10146381708946127
                                        },
                                        "span": {
                                            "x": 0.47736629935514885,
                                            "y": 0.321627071226837
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-03B_KG_AboveKunde-2F": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.279180382527993,
                                            "y": -0.00010085346600420256
                                        },
                                        "span": {
                                            "x": 1.342409612053634,
                                            "y": 0.9739020059454657
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.555451755221198,
                                            "y": 0.1635143332120076
                                        },
                                        "span": {
                                            "x": 0.17456443049796783,
                                            "y": 0.13
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-03B_KG_AboveKunde-1F": {
                    "transitionType": "noZoomOut",
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.555451755221198,
                                            "y": 0.1635143332120076
                                        },
                                        "span": {
                                            "x": 0.17456443049796783,
                                            "y": 0.13
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-audio-03_EA_Nam-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 28.991999999999997
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-03_EA_Nam-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 28.991999999999997
                }
            }
        },
        "E-pano-03A_EA_NamBaz": {
            "doNotCopy": true,
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2511504097910135,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 1.259217330035617,
                                            "y": 0.8931163941720343
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-04_EA_Thyangb": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-04_EA_Thyangb",
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2578932723280145,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 1.1517073379127553,
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
        "E-pano-03C_KG_AboveKhmjng": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-03C_KG_AboveKhmjng",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "transitionDurationOverrides": {
                    "durationScaleOverride": 4,
                    "transitionPauseDurationInSec": 0
                },
                "smoothTransitions": true,
                "minFieldOfView": 0.04,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.9,
                "showLowerFidelityWhileMoving": false
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-03C_KG_AboveKhmjng",
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
                                            "x": 1.0538840720409388,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 1.6557202891651647,
                                            "y": 1.242286266194319
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-main": {
                    "duration": 55.05,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 1.0538840720409388,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 1.6557202891651647,
                                            "y": 1.242286266194319
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoom to 03C_KG_AboveKhmjng",
                            "offset": 30,
                            "holdDuration": 0.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.4423968192246294,
                                            "y": 0.1490919733545296
                                        },
                                        "span": {
                                            "x": 0.4001929939028711,
                                            "y": 0.20734595793559038
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoom back out",
                            "offset": 50,
                            "holdDuration": 2.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.1405249644166081,
                                            "y": 0.17613372840203992
                                        },
                                        "span": {
                                            "x": 0.7811952894644624,
                                            "y": 0.41635566375302873
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-03_EA_Nam": {
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
                                            "x": 1.0538840720409388,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 1.6557202891651647,
                                            "y": 1.242286266194319
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-audio-03C_KG_AboveKhmjng-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 28.991999999999997
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-03C_KG_AboveKhmjng-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 28.991999999999997
                }
            }
        }
    },
    "screenplays": {
        "S-03_EA_Nam-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
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
        "S-03_EA_Nam-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
                        "experienceStreamId": "ES-main",
                        "begin": 0,
                        "duration": 6,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 6,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-03_EA_Nam-to-NamBaz": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
                        "experienceStreamId1": "ES-to-NamBaz",
                        "experienceStreamId": "ES-to-NamBaz-1F",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-03A_EA_NamBaz",
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
        "S-03_EA_Nam-to-03C_KG_AboveKhmjng": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
                        "experienceStreamId": "ES-to-03C_KG_AboveKhmjng-1F",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-03C_KG_AboveKhmjng",
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
        "S-03_EA_Nam-to-03B_KG_AboveKunde": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
                        "experienceStreamId": "ES-to-03B_KG_AboveKunde-1F",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-03B_KG_AboveKunde",
                        "experienceIdTest": "E-pano-04_EA_Thyangb",
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
        "S-03_EA_Nam-to-04_EA_Thyangb": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
                        "experienceStreamId": "ES-to-04_EA_Thyangb-2F",
                        "begin": 0,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
                        "experienceStreamId": "ES-entry",
                        "begin": 5.5,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 6,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-03C_KG_AboveKhmjng-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03C_KG_AboveKhmjng",
                        "experienceStreamId": "ES-entry",
                        "begin": 0,
                        "duration": 3,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 3,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.1
                    }
                ]
            }
        },
        "S-03C_KG_AboveKhmjng-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03C_KG_AboveKhmjng",
                        "experienceStreamId": "ES-main",
                        "begin": 0,
                        "duration": 55.05,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 55.05,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-03C_KG_AboveKhmjng-to-03_EA_Nam": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03C_KG_AboveKhmjng",
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