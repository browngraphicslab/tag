[{
    "version": 1.0,
    "defaultScreenplayId": "S-H04_EA_OverWCwm-main",
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
        "R-pano-H03_EA_OverIceFall": {
            "doNotCopy": true,
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AOwgmcLy8i4/0.json"
        },
        "R-EAs-H03_EA_OverIceFall": {
            "doNotCopy": true,
            "uriReference": "H03_EA_OverIceFall/EAs.js"
        },
        "R-pano-H04_EA_OverWCwm": {
            "doNotOverride": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwg_z708i4/0.json"
        },
        "R-pano-H05_EA_OverSCol": {
            "doNotCopy": true,
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AOwgZpr28i4/0.json"
        },
        "R-EAs-H04_EA_OverWCwm": {
            "doNotOverride": true,
            "uriReference": "H04_EA_OverWCwm/EAs.js"
        },
        "R-EAs-H05_EA_OverSCol": {
            "doNotCopy": true,
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
                }
            }
        },
        "E-pano-H03_EA_OverIceFall": {
            "doNotCopy": true,
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
                            "state": { "viewport": { "region": { "center": { "x": 0.02439796856739547, "y": -0.0001 }, "span": { "x": 0.7151289602370089, "y": 0.4900194436413839 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-H04_EA_OverWCwm": {
            "doNotOverride": true,
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
                },
                "ES-main": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.0693277137675885, "y": 0.0001 }, "span": { "x": 0.9493326078128543, "y": 0.6624122984718989 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.0693277137675885, "y": 0.0001 }, "span": { "x": 0.9493326078128543, "y": 0.6624122984718989 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.0693277137675885, "y": 0.0001 }, "span": { "x": 0.9493326078128543, "y": 0.6624122984718989 } } } }
                        },
                        {
                            "what": "zoomed in toward H05_EA_OverSCol",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 5.8810866688417835, "y": 0.11587800234334991 }, "span": { "x": 0.3401126007079941, "y": 0.2288223982007243 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-H05_EA_OverSCol": {
            "doNotCopy": true,
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
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.978,
                "minFieldOfView": 0.2,
                "showLowerFidelityWhileMoving": false
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
                            "what": "wide-H05_EA_OverSCol",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.05460693597995456, "y": 0.05418012370945906 }, "span": { "x": 1.604889432814648, "y": 0.9770422267702635 } } } }
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
        }
    }
}]
