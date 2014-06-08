    [{
    "version": 1.0,
    "defaultScreenplayId": "S-06B_KG_AboveDingbNA-main",
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
            "uriReference": "06B_KG_AboveDingbNA/screenplayproperties.js"
        },
        "R-pano-06B_KG_AboveDingbNA": {
            "doNotOverride": true,
            "uriReferenceNoSky": "http://cdn2.ps1.photosynth.net/pano/c01001200-AJYgSbskpy4/0.json",
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-APkg7tARAy8/0.json"
        },
        "R-pano-06_EA_PherDingb": {
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AHggcyJLjC4/0.json"
        },
        "R-EAs-06B_KG_AboveDingbNA": {
            "uriReference": "06B_KG_AboveDingbNA/EAs.js"
        },
        "R-EAs-06_EA_PherDingb": {
            "uriReference": "06_EA_PherDingb/EAs.js"
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
                "ES-06B_KG_AboveDingbNA-title": {
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
        "E-pano-06B_KG_AboveDingbNA": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotOverride": true,
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
                "minFieldOfView": 0.07,
                "interpolatorType": "vectorBased",
                "viewShrinkFactor": 0.98,
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
                            "state": { "viewport": { "region": { "center": { "x": 6.1706189097681845, "y": 0.0001 }, "span": { "x": 1.4558353914387125, "y": 1.0142703789679827 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.1706189097681845, "y": 0.0001 }, "span": { "x": 1.4558353914387125, "y": 1.0142703789679827 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.1706189097681845, "y": 0.0001 }, "span": { "x": 1.4558353914387125, "y": 1.0142703789679827 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-06_EA_PherDingb": {
            "doNotCopy": true,
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
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.978,
                "minFieldOfView": 0.2,
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
        "S-06B_KG_AboveDingbNA-entry": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06B_KG_AboveDingbNA",
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
        "S-06B_KG_AboveDingbNA-main": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06B_KG_AboveDingbNA",
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
        "S-06B_KG_AboveDingbNA-to-06_EA_PherDingb": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "E-pano-06B_KG_AboveDingbNA",
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
                        "duration":1,
                        "layer": "foreground",
                        "dominantMedia": "audio"
                    }
                ]
            }
        }
    }
}]
