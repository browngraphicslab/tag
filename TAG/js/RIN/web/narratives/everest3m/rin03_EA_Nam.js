[{
    "version": 1.0,
    "defaultScreenplayId": "S-03_EA_Nam-entry",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 3,
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
            "uriReference": "03_EA_Nam/screenplayproperties.js"
        },
        "R-pano-02_EA_Jorsalle": {
            "doNotCopy": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-ANEgV3G02C4/0.json"
        },
        "R-EAs-02_EA_Jorsalle": {
            "doNotCopy": true,
            "uriReference": "02_EA_Jorsalle/EAs.js"
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
                }
            }
        },
        "E-pano-02_EA_Jorsalle": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-02_EA_Jorsalle",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts", "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.978,
                "minFieldOfView": 0.12,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-02_EA_Jorsalle",
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
                            "state": { "viewport": { "region": { "center": { "x": 0.033301481177821036, "y": 0.0001 }, "span": { "x": 1.266613392848165, "y": 0.8920447620113098 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-03_EA_Nam": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotOverride": true,
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
                "maxPixelScaleFactor": 0.5,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": false
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
                },
                "ES-main": {
                    "duration": 6,
                    "keyframes": [
                        {
                            "what": "start",
                            "offset": 0,
                            "holdDuration": 3,
                            "state": { "viewport": { "region": { "center": { "x": 6.279180382527993, "y": -0.00010085346600420256 }, "span": { "x": 1.342409612053634, "y": 0.9739020059454657 } } } }
                        },
                        {
                            "what": "pan to Namche",
                            "offset": 6,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.844884307713608, "y": -0.00010085346600420256 }, "span": { "x": 1.342409612053634, "y": 0.9739020059454657 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.279180382527993, "y": -0.00010085346600420256 }, "span": { "x": 1.342409612053634, "y": 0.9739020059454657 } } } }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.453896947448674, "y": 0.059775326389647575 }, "span": { "x": 0.510616049465152, "y": 0.43312867430187734 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 5.453896947448674, "y": 0.059775326389647575 }, "span": { "x": 0.510616049465152, "y": 0.43312867430187734 } } } }
                        }
                    ]
                },
                "ES-to-04_EA_Thyangb": {
                    "duration": 0.5,
                    "keyframes": [  
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.214474029059789, "y": 0.1370498385222374 }, "span": { "x": 0.5408492042800268, "y": 0.3685679442239307 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.279180382527993, "y": -0.00010085346600420256 }, "span": { "x": 1.342409612053634, "y": 0.9739020059454657 } } } }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.208989721294117, "y": 0.12985077859847233 }, "span": { "x": 0.5215766046943656, "y": 0.3519722323528969 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.279180382527993, "y": -0.00010085346600420256 }, "span": { "x": 1.342409612053634, "y": 0.9739020059454657 } } } }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.921324754381491, "y": 0.13588984819010083 }, "span": { "x": 0.5224473031540384, "y": 0.3686734375543637 } } } }
                        }
                    ]
                },
                "ES-to-03C_KG_AboveKhmjng-1F": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.921324754381491, "y": 0.13588984819010083 }, "span": { "x": 0.5224473031540384, "y": 0.3686734375543637 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.279180382527993, "y": -0.00010085346600420256 }, "span": { "x": 1.342409612053634, "y": 0.9739020059454657 } } } }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.6489103505450595, "y": 0.1279551759713534 }, "span": { "x": 0.30184574294518335, "y": 0.20284500273773487 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 5.6489103505450595, "y": 0.1279551759713534 }, "span": { "x": 0.30184574294518335, "y": 0.20284500273773487 } } } }
                        }
                    ]
                },
                "ES-to-02_EA_Jorsalle": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
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
                            "state": { "viewport": { "region": { "center": { "x": 6.2511504097910135, "y": 0.0001 }, "span": { "x": 1.259217330035617, "y": 0.8931163941720343 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": -0.0001 }, "span": { "x": 1.1517073379127553, "y": 0.8926486459324999 } } } }
                        }
                    ]
                }
            }
        },
        "E-audio-background-music-01": {
            "doNotCopy":true,
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
                        "experienceStreamId": "ES-to-04_EA_Thyangb",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-04_EA_Thyangb",
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
        "S-03_EA_Nam-to-02_EA_Jorsalle": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-03_EA_Nam",
                        "experienceStreamId": "ES-to-02_EA_Jorsalle",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-02_EA_Jorsalle",
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
