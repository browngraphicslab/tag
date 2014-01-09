[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "1d0a61f1-c36b-4644-a1e2-fba9326ca80b",
            "timestamp": "2013-03-26T06:58:07.3043901Z",
            "title": "Test2",
            "author": "Gautham Mudambi",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 25.919999999999998,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {
        "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
            "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.ZoomableMediaExperienceStreamV2": {
            "name": "MicrosoftResearch.Rin.ZoomableMediaExperienceStreamV2",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.FadeInOutTransitionService": {
            "name": "MicrosoftResearch.Rin.FadeInOutTransitionService",
            "version": 0.0
        }
    },
    "resources": {
        "KV": {
            "uriReference": "http://www.zoom.it/fZ1I"
        },
        "eaData": {
            "uriReference": "deepDiveEA.js"
        }
    },
    "experiences": {
        "DeepZoomExperience": {
            "providerId": "MicrosoftResearch.Rin.ZoomableMediaExperienceStreamV2",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "eaData",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "policies": ["base2DGroupPolicy"]
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "KV",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 41.75,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.58869498292040512,
                                            "y": 0.0713846391901621
                                        },
                                        "span": {
                                            "x": 0.4096,
                                            "y": 0.23046052009456267
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 12.1,
                            "holdDuration": 9.2,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.2146001050638251,
                                            "y": 0.074612377566836641
                                        },
                                        "span": {
                                            "x": 0.4096,
                                            "y": 0.23046052009456267
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 28.949999999999996,
                            "holdDuration": 2.1,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.33674929539339793,
                                            "y": 0.092647030836417163
                                        },
                                        "span": {
                                            "x": 0.068719476736000012,
                                            "y": 0.038664859250988184
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 32.65,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.336731393752427,
                                            "y": 0.092647030836417177
                                        },
                                        "span": {
                                            "x": 0.0687552800179418,
                                            "y": 0.03868500388716347
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 40.25,
                            "holdDuration": 1.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.2146001050638251,
                                            "y": 0.074612377566836641
                                        },
                                        "span": {
                                            "x": 0.4096,
                                            "y": 0.23046052009456267
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    "screenplays": {
        "SCP1": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "DeepZoomExperience",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 41.75,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                    }
                ]
            }
        }
    }
}]