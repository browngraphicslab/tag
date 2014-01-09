[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "3c97e6f0-504f-4a7a-a7ca-5bb7fcdd49d7",
            "timestamp": "2013-05-02T08:53:07.504836Z",
            "title": "360Panorama",
            "author": "v-gamuda",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 45.5,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {
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
        }
    },
    "resources": {
        "R-1": {
            "uriReference": "360Panorama_Media/RIN_OVERLAYS.js"
        },
        "R-2": {
            "uriReference": "360Panorama_Media/RIN_HIGHLIGHTS.js"
        },
        "ScreenplayProperties": {
            "uriReference": "360Panorama_Media/screenplayproperties.js"
        },
        "R-3": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-ABogcPX+PC4/2.json"
        },
        "R-4": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-APEfp_CjFS4/0.json"
        }
    },
    "experiences": {
        "PhotosynthES-2": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-4",
                    "required": true
                },
                {
                    "resourceId": "R-2",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 45.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_d7d9a767-4dd3-4dbd-a676-ed20a161e72b.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.20895923358434,
                                            "y": 0.0486675935921634
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.537686187267978
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 5.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_90a87f5e-3848-41d2-a7a3-061e86c17b54.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.0198616260717213,
                                            "y": 0.0398065811198699
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.537686187267978
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 10.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_50ede8d9-2a3c-42a7-9d0f-84c8de4f09f1.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 1.07422607359525,
                                            "y": -0.0275184985154886
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.537686187267978
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_4b12e788-725e-496a-91cd-26224042657e.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 1.41630977555978,
                                            "y": 0.00166608761410775
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.0527696196546077
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 20.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_c685ccdc-69e5-4c47-be0e-27db4f41bdb6.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 1.25235752758375,
                                            "y": -0.00393616839186569
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.0622464580578308
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 25.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_d75637f6-3c8a-473c-88ab-5d583c6eef3f.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 1.04716116400278,
                                            "y": 0.000269550724078153
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.0622464580578308
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 30.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_69268a32-56e4-4a24-907b-5249bb6d9cef.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.878781824933655,
                                            "y": -0.0203575722680625
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.0622464580578308
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 35.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_524174ca-b92f-4956-a269-67338e7e7160.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.657292306263486,
                                            "y": -0.00073104438135133
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.0622464580578308
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 40.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_c532b939-f653-410a-b24c-af691bad87c8.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.508458411102719,
                                            "y": 0.0114849948586255
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.0622464580578308
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 45.5,
                            "holdDuration": 0,
                            "data": {
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/0b27a7a9-b95c-4a48-ade6-9a5f4a79205b_keyframe_39820e08-17e3-40f0-b178-b0f30a721453.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.34376492260306,
                                            "y": 0.0188780453371516
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.0665044021226935
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
                        "experienceId": "PhotosynthES-2",
                        "experienceStreamId": "defaultSequence",
                        "begin": 0,
                        "duration": 45.5,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    }
                ]
            }
        }
    }
}]