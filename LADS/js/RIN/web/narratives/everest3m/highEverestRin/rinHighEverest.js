[{
    "version": 1,
    "defaultScreenplayId": "S-H01_EA_OverPmri-main",
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
        "R-pano-H01_EA_OverPmri": {
            "uriReferenceE288": "http://cdn3.ps1.photosynth.net/pano/c01001300-ANEg4Dzj3S4/0.json",
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwgCFXu8i4/0.json"
        },
        "R-pano-H02_EA_OverBC": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwg2Bvx8i4/0.json"
        },
        "R-EAs-H01_EA_OverPmri": {
            "uriReference": "H01_EA_OverPmri/EAs.js"
        },
        "R-EAs-H02_EA_OverBC": {
            "uriReference": "H02_EA_OverBC/EAs.js"
        },
        "R-audio-background-music-01": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        },
        "R-pano-H03_EA_OverIceFall": {
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AOwgmcLy8i4/0.json"
        },
        "R-EAs-H03_EA_OverIceFall": {
            "uriReference": "H03_EA_OverIceFall/EAs.js"
        },
        "R-pano-H04_EA_OverWCwm": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwg_z708i4/0.json"
        },
        "R-EAs-H04_EA_OverWCwm": {
            "uriReference": "H04_EA_OverWCwm/EAs.js"
        },
        "R-pano-H05_EA_OverSCol": {
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AOwgZpr28i4/0.json"
        },
        "R-EAs-H05_EA_OverSCol": {
            "uriReference": "H05_EA_OverSCol/EAs.js"
        },
        "R-DefaultAdaptiveTransitionProfile": {
            "data": {
                "durationScaleOverride": 3,
                "trasitionPauseDuration": 0,
                "capAdaptiveOffset": true,
                "maxAdaptiveDuration": 6
            },
            "doNotCopy": true
        },
        "R-audio-MR-H01_EA_OverPmri-01_Flight-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/Flight_to_Everest_Fix_MIX.mp3"
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
                "ES-H01_EA_OverPmri-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "intro"
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-H02_EA_OverBC-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "H02_EA_OverBC"
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-H03_EA_OverIceFall-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "H03_EA_OverIceFall"
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-H04_EA_OverWCwm-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "H04_EA_OverWCwm"
                                    }
                                }
                            }
                        }
                    ]
                },
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
        "E-pano-H01_EA_OverPmri": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-H01_EA_OverPmri",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
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
                    "resourceId": "R-pano-H01_EA_OverPmri",
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.120238434777879,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 0.9149052813081828,
                                            "y": 0.6356348287692711
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-main": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.120238434777879,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 0.9149052813081828,
                                            "y": 0.6356348287692711
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-H02_EA_OverBC": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.120238434777879,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 0.9149052813081828,
                                            "y": 0.6356348287692711
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoomed in toward H02_EA_OverBC",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.214781204777545,
                                            "y": 0.0321295486026697
                                        },
                                        "span": {
                                            "x": 0.6523556114642773,
                                            "y": 0.444615767569358
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-MR-01_Flight": {
                    "duration": 32,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 10,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.131461847306403,
                                            "y": 0.06749649872989763
                                        },
                                        "span": {
                                            "x": 0.6005268299212834,
                                            "y": 0.3813809003593006
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "stay zoomed in ",
                            "offset": 32,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.142504470163953,
                                            "y": 0.13428567691218252
                                        },
                                        "span": {
                                            "x": 0.19635349966123014,
                                            "y": 0.12265758882457316
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-H02_EA_OverBC": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-H02_EA_OverBC",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.985,
                "minFieldOfView": 0.08,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-H02_EA_OverBC",
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2326755825227185,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9148318450074944,
                                            "y": 0.6355798159912482
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
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2326755825227185,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9148318450074944,
                                            "y": 0.6355798159912482
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-H01_EA_OverPmri": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2326755825227185,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9148318450074944,
                                            "y": 0.6355798159912482
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-H03_EA_OverIceFall": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2326755825227185,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9148318450074944,
                                            "y": 0.6355798159912482
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoomed in toward H03_EA_OverIceFall",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.24899981029936,
                                            "y": 0.09661564837939712
                                        },
                                        "span": {
                                            "x": 0.43251772720575226,
                                            "y": 0.29154137037185823
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
                    "pauseVolume": 1,
                    "isBackgroundAudioMode": true,
                    "baseVolume": 0.3
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
        "E-pano-H03_EA_OverIceFall": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-H03_EA_OverIceFall",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.985,
                "minFieldOfView": 0.08,
                "showLowerFidelityWhileMoving": true
            },
            "resourceReferences": [
                {
                    "resourceId": "R-pano-H03_EA_OverIceFall",
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.02439796856739547,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 0.7151289602370089,
                                            "y": 0.4900194436413839
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
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.02439796856739547,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 0.7151289602370089,
                                            "y": 0.4900194436413839
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-H02_EA_OverBC": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.02439796856739547,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 0.7151289602370089,
                                            "y": 0.4900194436413839
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-H04_EA_OverWCwm": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.02439796856739547,
                                            "y": -0.0001
                                        },
                                        "span": {
                                            "x": 0.7151289602370089,
                                            "y": 0.4900194436413839
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoomed in toward H04_EA_OverWCwm",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.241857323708914,
                                            "y": 0.08151116955593956
                                        },
                                        "span": {
                                            "x": 0.3581960539674076,
                                            "y": 0.24078887784722033
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-H04_EA_OverWCwm": {
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
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.985,
                "minFieldOfView": 0.08,
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.0693277137675885,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9493326078128543,
                                            "y": 0.6624122984718989
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
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.0693277137675885,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9493326078128543,
                                            "y": 0.6624122984718989
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-H03_EA_OverIceFall": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.0693277137675885,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9493326078128543,
                                            "y": 0.6624122984718989
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "ES-to-H05_EA_OverSCol": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "what": "wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.0693277137675885,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9493326078128543,
                                            "y": 0.6624122984718989
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "what": "zoomed in toward H05_EA_OverSCol",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.8810866688417835,
                                            "y": 0.11587800234334991
                                        },
                                        "span": {
                                            "x": 0.3401126007079941,
                                            "y": 0.2288223982007243
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-H05_EA_OverSCol": {
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
                    "artifactType": "Artifacts",
                    "hideDuringPlay": true,
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.985,
                "minFieldOfView": 0.08,
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.245238861308675,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9139869817969217,
                                            "y": 0.6357929905060868
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
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.245238861308675,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9139869817969217,
                                            "y": 0.6357929905060868
                                        }
                                    }
                                }
                            }
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
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.245238861308675,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0.9139869817969217,
                                            "y": 0.6357929905060868
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-audio-MR-H01_EA_OverPmri-01_Flight-narration": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 30
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-audio-MR-H01_EA_OverPmri-01_Flight-narration",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 30
                }
            }
        }
    },
    "screenplays": {
        "S-H01_EA_OverPmri-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H01_EA_OverPmri",
                        "experienceStreamId": "ES-main",
                        "begin": 0,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-H01_EA_OverPmri-to-H02_EA_OverBC": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H01_EA_OverPmri",
                        "experienceStreamId": "ES-to-H02_EA_OverBC",
                        "begin": 0,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H02_EA_OverBC",
                        "experienceStreamId": "ES-entry",
                        "begin": 5,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 5.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-H02_EA_OverBC-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H02_EA_OverBC",
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
        "S-H02_EA_OverBC-to-H01_EA_OverPmri": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H02_EA_OverBC",
                        "experienceStreamId": "ES-to-H01_EA_OverPmri",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H01_EA_OverPmri",
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
        "S-H02_EA_OverBC-to-H03_EA_OverIceFall": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H02_EA_OverBC",
                        "experienceStreamId": "ES-to-H03_EA_OverIceFall",
                        "begin": 0,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H03_EA_OverIceFall",
                        "experienceStreamId": "ES-entry",
                        "begin": 5,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 5.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-H03_EA_OverIceFall-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H03_EA_OverIceFall",
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
        "S-H03_EA_OverIceFall-to-H02_EA_OverBC": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H03_EA_OverIceFall",
                        "experienceStreamId": "ES-to-H02_EA_OverBC",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H02_EA_OverBC",
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
        "S-H03_EA_OverIceFall-to-H04_EA_OverWCwm": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H03_EA_OverIceFall",
                        "experienceStreamId": "ES-to-H04_EA_OverWCwm",
                        "begin": 0,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H04_EA_OverWCwm",
                        "experienceStreamId": "ES-entry",
                        "begin": 5,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 5.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
        "S-H04_EA_OverWCwm-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H04_EA_OverWCwm",
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
        "S-H04_EA_OverWCwm-to-H03_EA_OverIceFall": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H04_EA_OverWCwm",
                        "experienceStreamId": "ES-to-H03_EA_OverIceFall",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H03_EA_OverIceFall",
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
        "S-H04_EA_OverWCwm-to-H05_EA_OverSCol": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H04_EA_OverWCwm",
                        "experienceStreamId": "ES-to-H05_EA_OverSCol",
                        "begin": 0,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-H05_EA_OverSCol",
                        "experienceStreamId": "ES-entry",
                        "begin": 5,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 5.5,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },
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
        },
        "S-MR-H01_EA_OverPmri-01_Flight": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-H01_EA_OverPmri",
                        "experienceStreamId": "ES-MR-01_Flight",
                        "begin": 0,
                        "duration": 32,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-MR-H01_EA_OverPmri-01_Flight-narration",
                        "experienceStreamId": "defaultSequence",
                        "begin": 1,
                        "duration": 30,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 32,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 0.3
                    }
                ]
            }
        }
    }
}]