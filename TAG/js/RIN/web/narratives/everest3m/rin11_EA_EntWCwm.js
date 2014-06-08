[{
    "version": 1.0,
    "defaultScreenplayId": "S-11_EA_EntWCwm-entry",
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
            "uriReference": "11_EA_EntWCwm/screenplayproperties.js"
        },
        "R-pano-11_EA_EntWCwm": {
            "doNotOverride": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AHggsBJbjC4/0.json"
        },
        "R-pano-01_EA_LuklaVil": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AM8gmvex2C4/0.json"
        },
        "R-EAs-11_EA_EntWCwm": {
            "uriReference": "11_EA_EntWCwm/EAs.js"
        },
        "R-EAs-01_EA_LuklaVil": {
            "uriReference": "01_EA_LuklaVil/EAs.js"
        },
        "R-pano-11A_EAH_ABC": {
            "doNotCopy":true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AHQg_21XhS4/0.json"
        },
        "R-EAs-11A_EAH_ABC": {
            "doNotCopy": true,
            "uriReference": "11A_EAH_ABC/EAs.js"
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
                "ES-11_EA_EntWCwm-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "EntWCwm"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "E-pano-11_EA_EntWCwm": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-11_EA_EntWCwm",
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
                    "resourceId": "R-pano-11_EA_EntWCwm",
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
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": 0.0001 }, "span": { "x": 1.2483337221767714, "y": 0.8926486459324999 } } } }
                        }
                    ]
                },
                "ES-to-11A_EAH_ABC": {
                    "duration": 3,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 3,
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": 0.0001 }, "span": { "x": 1.2483337221767714, "y": 0.8926486459324999 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 0.15207312351816476, "y": 0.17797692132585285 }, "span": { "x": 0.774771175488081, "y": 0.41266927790540286 } } } }
                        },
                        {
                            "what": "zoom to Entrance to Western Cwm",
                            "offset": 30,
                            "holdDuration": 0.5,
                            "state": { "viewport": { "region": { "center": { "x": 0.4423968192246294, "y": 0.1490919733545296 }, "span": { "x": 0.4001929939028711, "y": 0.20734595793559038 } } } }
                        },
                        {
                            "what": "zoom back out",
                            "offset": 50,
                            "holdDuration": 2.5,
                            "state": { "viewport": { "region": { "center": { "x": 0.1405249644166081, "y": 0.17613372840203992 }, "span": { "x": 0.7811952894644624, "y": 0.41635566375302873 } } } }
                        }
                    ]
                },
                "ES-to-01_EA_LuklaVil": {
                    "duration": 3,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": { "viewport": { "region": { "center": { "x": 0.026079201351380907, "y": 0.1222660758097258 }, "span": { "x": 1.2980820613183381, "y": 0.7688231205571085 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-11A_EAH_ABC": {
            "doNotCopy":true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-11A_EAH_ABC",
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
                    "resourceId": "R-pano-11A_EAH_ABC",
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
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": 0.0001 }, "span": { "x": 1.2483337221767714, "y": 0.8926486459324999 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-01_EA_LuklaVil": {
            "doNotCopy": true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-01_EA_LuklaVil",
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
                    "resourceId": "R-pano-01_EA_LuklaVil",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-entry": {
                    "what": "lukla-entry",
                    "duration": 3,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.2578932723280145, "y": 0.0001 }, "span": { "x": 1.2483337221767714, "y": 0.8926486459324999 } } } }
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
        "S-11_EA_EntWCwm-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-11_EA_EntWCwm",
                        "experienceStreamId": "ES-entry",
                        "begin": 0,
                        "duration": 3,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 3,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        },	    
        "S-11_EA_EntWCwm-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-11_EA_EntWCwm",
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
        "S-11_EA_EntWCwm-to-11A_EAH_ABC": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-11_EA_EntWCwm",
                        "experienceStreamId": "ES-to-11A_EAH_ABC",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-11A_EAH_ABC",
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
        "S-11_EA_EntWCwm-to-01_EA_LuklaVil": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-11_EA_EntWCwm",
                        "experienceStreamId": "ES-to-01_EA_LuklaVil",
                        "begin": 0,
                        "duration": 3,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
                        "experienceStreamId": "ES-entry",
                        "begin": 3,
                        "duration": 2.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-audio-background-music-01",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 5.0,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        }
    }
}]
