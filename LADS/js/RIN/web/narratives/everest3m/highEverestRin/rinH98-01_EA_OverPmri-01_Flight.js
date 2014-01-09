[{
    "version": 1.0,
    "defaultScreenplayId": "S-MR-H01_EA_OverPmri-01_Flight",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "doNotCopy": true,
            "guid": "e31e8748-e7cd-46ab-993d-6f5769e24dac",
            "timestamp": "2013-04-19T08:15:18.575369Z",
            "title": "everest3",
            "author": "narend",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 32,
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
        "R-DefaultAdaptiveTransitionProfile": {
            "data": { "durationScaleOverride": 3, "trasitionPauseDuration": 0, "capAdaptiveOffset": true, "maxAdaptiveDuration": 6 },
            "doNotCopy": true
        },
        "ScreenplayProperties": {
            "doNotCopy": true,
            "uriReference": "H01_EA_OverPmri/screenplayproperties-01_Flight.js"
        },
        "R-pano-H01_EA_OverPmri": {
            "doNotCopy": true,
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-AOwgCFXu8i4/0.json"
        },
        "R-EAs-H01_EA_OverPmri": {
            "doNotCopy": true,
            "uriReference": "H01_EA_OverPmri/EAs.js"
        },
        "R-audio-MR-H01_EA_OverPmri-01_Flight-narration": {
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/Flight_to_Everest_Fix_MIX.mp3"
        },
        "R-audio-background-music-01": {
            "doNotCopy": true,
            "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
        }
    },
    "experiences": {
        "E-pano-H01_EA_OverPmri": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "doNotCopy" : true,
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
                "ES-MR-01_Flight": {
                    "duration": 32,
                    "transitionType": "adaptiveFirstDuration",
                    "keyframes": [
                        {
                            "what": "zoom in",
                            "offset": 0,
                            "holdDuration": 10,
                            "state": {"viewport":{"region":{"center":{"x":6.131461847306403,"y":0.06749649872989763},"span":{"x":0.6005268299212834,"y":0.3813809003593006}}}}
                        },
                        {
                            "what": "stay zoomed in ",
                            "offset": 32,
                            "holdDuration": 0,
                            "state": { "viewport": { "region": { "center": { "x": 6.142504470163953, "y": 0.13428567691218252 }, "span": { "x": 0.19635349966123014, "y": 0.12265758882457316 } } } }
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
