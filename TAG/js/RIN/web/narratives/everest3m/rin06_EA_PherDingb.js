[{
    "version": 1.0,
    "defaultScreenplayId": "S-06_EA_PherDingb-entry",
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
            "uriReference": "06_EA_PherDingb/screenplayproperties.js"
        },
        "R-pano-05_EA_Pang": {
            "doNotCopy": true,
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AOEgv0o05y4/0.json"
        },
        "R-EAs-05_EA_Pang": {
            "doNotCopy": true,
            "uriReference": "05_EA_Pang/EAs.js"
        },
        "R-pano-06B_KG_AboveDingbNA": {
            "doNotCopy":true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AJYgSbskpy4/0.json"
        },
        "R-EAs-06B_KG_AboveDingbNA": {
            "doNotCopy": true,
            "uriReference": "06B_KG_AboveDingbNA/EAs.js"
        },
        "R-pano-06_EA_PherDingb": {
            "doNotOverride": true,
            "uriReferenceBeta": "http://cdn1.ps1.photosynth.net/pano/c01001100-AOEgF2435y4/0.json",
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AAUhZAgFDS8/0.json"
        },
        "R-pano-07_EA_TermKhuGl": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AHggIzVOjC4/0.json"
        },
        "R-EAs-06_EA_PherDingb": {
            "uriReference": "06_EA_PherDingb/EAs.js"
        },
        "R-EAs-07_EA_TermKhuGl": {
            "uriReference": "07_EA_TermKhuGl/EAs.js"
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
                "ES-06_EA_PherDingb-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "PherDingb"
                                    }
                                }
                            }
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
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "reference-wide",
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.255410766356481, "y": -0.0001 }, "span": { "x": 1.3458206960112544, "y": 0.9745830718168374 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-06_EA_PherDingb": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotOverride": true,
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
                "maxPixelScaleFactor": 0.5,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": false
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
                },
                "ES-to-05_EA_Pang": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": { "viewport": { "region": { "center": { "x": 6.229013444972436, "y": 0.0001 }, "span": { "x": 1.3493495905128423, "y": 0.9775804444236765 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.229013444972436, "y": 0.0001 }, "span": { "x": 1.3493495905128423, "y": 0.9775804444236765 } } } }
                        }
                    ]
                },
                "ES-to-07_EA_TermKhuGl": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.137162528852186, "y": 0.09416726703323326 }, "span": { "x": 0.6983054379241234, "y": 0.480154843057601 } } } }
                        }
                    ]
                },
                "ES-to-06B_KG_AboveDingbNA-2F": {
                    "duration": 0.5,
                    "transitionType": "noZoomOut",
                    "keyframes": [
                        {
                            "what": "zoomed in toward viewpoint above Dingbe Naga pk",
                            "offset": 0.5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.21293394243076358, "y": 0.24194969962175788 }, "span": { "x": 0.29491410840145243, "y": 0.21151348400789352 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-06B_KG_AboveDingbNA": {
            "doNotCopy":true,
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "R-EAs-06B_KG_AboveDingbNA",
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
                    "resourceId": "R-pano-06B_KG_AboveDingbNA",
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
                            "state": { "viewport": { "region": { "center": { "x": 5.887170971166759, "y": -0.0001 }, "span": { "x": 1.304695715236487, "y": 0.9314727970114128 } } } }
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
        "S-06_EA_PherDingb-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06_EA_PherDingb",
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
        "S-06_EA_PherDingb-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06_EA_PherDingb",
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
        "S-06_EA_PherDingb-to-06B_KG_AboveDingbNA": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06_EA_PherDingb",
                        "experienceStreamId": "ES-to-06B_KG_AboveDingbNA-2F",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-06B_KG_AboveDingbNA",
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
        "S-06_EA_PherDingb-to-07_EA_TermKhuGl": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06_EA_PherDingb",
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
        },
        "S-06_EA_PherDingb-to-05_EA_Pang": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06_EA_PherDingb",
                        "experienceStreamId": "ES-to-05_EA_Pang",
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
                        "duration": 1,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        }
    }
}]
