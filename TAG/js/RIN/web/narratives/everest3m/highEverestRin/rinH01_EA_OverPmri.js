[{
    "version": 1.0,
    "defaultScreenplayId": "S-H01_EA_OverPmri-main",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 5,
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
        "R-pano-H01_EA_OverPmri": {
            "doNotOverride": true,
            "uriReferenceE288": "http://cdn3.ps1.photosynth.net/pano/c01001300-ANEg4Dzj3S4/0.json",
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwgCFXu8i4/0.json"
        },
        "R-pano-H02_EA_OverBC": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwg2Bvx8i4/0.json"
        },
        "R-EAs-H01_EA_OverPmri": {
            "doNotOverride": true,
            "uriReference": "H01_EA_OverPmri/EAs.js"
        },
        "R-EAs-H02_EA_OverBC": {
            "doNotCopy": true,
            "uriReference": "H02_EA_OverBC/EAs.js"
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
                            "state": { "viewport": { "region": { "center": { "x": 6.120238434777879, "y": -0.0001 }, "span": { "x": 0.9149052813081828, "y": 0.6356348287692711 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.120238434777879, "y": -0.0001 }, "span": { "x": 0.9149052813081828, "y": 0.6356348287692711 } } } }
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
                            "state": { "viewport": { "region": { "center": { "x": 6.120238434777879, "y": -0.0001 }, "span": { "x": 0.9149052813081828, "y": 0.6356348287692711 } } } }
                        },
                        {
                            "what": "zoomed in toward H02_EA_OverBC",
                            "offset": 5,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.214781204777545, "y": 0.0321295486026697 }, "span": { "x": 0.6523556114642773, "y": 0.444615767569358 } } } }
                        }
                    ]
                }
            }
        },
        "E-pano-H02_EA_OverBC": {
            "doNotCopy": true,
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
                    "resourceId": "R-pano-H02_EA_OverBC",
                    "required": true
                }
            ],
            "experienceStreams": {
                "ES-entry": {
                    "duration": 0.5,
                    "keyframes": [
                        {
                            "what": "wide-H02_EA_OverBC",
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
        }
    }
}]
