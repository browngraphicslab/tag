[{
    "version": 1.0,
    "defaultScreenplayId": "S-02_EA_Jorsalle-entry",
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
            "uriReference": "02_EA_Jorsalle/screenplayproperties.js"
        },
        "R-pano-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AM8gmvex2C4/0.json"
        },
        "R-EAs-01_EA_LuklaVil": {
            "doNotCopy": true,
            "uriReference": "01_EA_LuklaVil/EAs.js"
        },
        "R-pano-02_EA_Jorsalle": {
            "doNotOverride": true,
            "uriReferenceBeta": "http://cdn1.ps1.photosynth.net/pano/c01001100-ANEgV3G02C4/0.json",
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AAAhtlX4DC8/0.json"
        },
        "R-EAs-02_EA_Jorsalle": {
            "uriReference": "02_EA_Jorsalle/EAs.js"
        },
        "R-pano-03_EA_Nam": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ANEgn+S22C4/0.json"
        },
        "R-EAs-03_EA_Nam": {
            "uriReference": "03_EA_Nam/EAs.js"
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
                "ES-02_EA_Jorsalle-title": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "JorsalleVillage"
                                    }
                                }
                            }
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
                "transitionDurationOverrides": {
                    "durationScaleOverride": 4,
                    "transitionPauseDurationInSec": 0
                },
                "enforceViewLimits": true,
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
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.20789534827005, "y": 0.0001 }, "span": { "x": 1.3413017796256416, "y": 0.9729614864088095 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-02_EA_Jorsalle": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotOverride": true,
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
                "smoothTransitions": true,
                "maxPixelScaleFactor": 0.5,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.978,
                "showLowerFidelityWhileMoving": false
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
                            "state": { "viewport": { "region": { "center": { "x": 6.283175816125801, "y": 0.0001 }, "span": { "x": 1.3405415338953183, "y": 0.9723162661096154 } } } }
                        }
                    ]
                },
                "ES-main": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.283175816125801, "y": 0.0001 }, "span": { "x": 1.3405415338953183, "y": 0.9723162661096154 } } } }
                        }
                     ]
                },
                "ES-to-Namche-1F": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                           "offset": 0,
                           "holdDuration": 0,
                           "state": { "viewport": { "region": { "center": { "x": 0.1722310568142775, "y": 0.15603505201633555 }, "span": { "x": 0.7034557933488873, "y": 0.4798903140515455 } } } }
                       }
                    ]
                },
                "ES-to-Namche": {
                    "duration": 5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.283175816125801, "y": 0.0001 }, "span": { "x": 1.3405415338953183, "y": 0.9723162661096154 } } } }
                        },
                        {
                            "offset": 5,
                            "holdDuration": 0,
                            "state": {"viewport":{"region":{"center":{"x":0.1722310568142775,"y":0.15603505201633555},"span":{"x":0.7034557933488873,"y":0.4798903140515455}}}}
                        }
                    ]
                },
                "ES-to-01_EA_LuklaVil": {
                    "duration": 0.5,
                    "transitionType": "noAnimation",
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.283175816125801, "y": 0.0001 }, "span": { "x": 1.3405415338953183, "y": 0.9723162661096154 } } } }
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
                            "offset": 0,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 0.014731088213939112, "y": -0.0001 }, "span": { "x": 1.2569629690006256, "y": 0.893524801217001 } } } }
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
        "S-02_EA_Jorsalle-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-02_EA_Jorsalle",
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
        "S-02_EA_Jorsalle-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-02_EA_Jorsalle",
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
        "S-02_EA_Jorsalle-to-Nam": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-02_EA_Jorsalle",
                        "experienceStreamId": "ES-to-Namche-1F",
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
        },
        "S-02_EA_Jorsalle-to-01_EA_LuklaVil": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-02_EA_Jorsalle",
                        "experienceStreamId": "ES-to-01_EA_LuklaVil",
                        "begin": 0,
                        "duration": 0.5,
                        "layer": "foreground",
                        "dominantMedia": "visual"
                    },
                    {
                        "experienceId": "E-pano-01_EA_LuklaVil",
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
