[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "3ef8a0fb-e9a8-47fd-bf3d-a1e740f0eca0",
            "timestamp": "2013-04-18T10:02:45.8354258Z",
            "title": "Everest",
            "author": "v-gamuda",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 59.891999999999996,
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
        },
        "MicrosoftResearch.Rin.AudioExperienceStream": {
            "name": "MicrosoftResearch.Rin.AudioExperienceStream",
            "version": 0.0
        }
    },
    "resources": {
        "R-1": {
            "uriReference": "TrekToTrekToEverest_Media/RIN_OVERLAYS.js"
        },
        "R-2": {
            "uriReference": "TrekToTrekToEverest_Media/RIN_HIGHLIGHTS.js"
        },
        "ScreenplayProperties": {
            "uriReference": "TrekToEverest_Media/screenplayproperties.js"
        },
        "R-3": {
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-ABogTLz1PC4/2.json"
        },
        "f6a1b74f-ad11-4772-85ff-c25b4aac2a86": {
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-ABogTLz1PC4/2.json"
        },
        "834f061b-da63-4e81-be1a-7aa20be938de": {
            "uriReference": "TrekToEverest_Media/Lukla_EA-1_EAMedia/Lukla_EA-1.js"
        },
        "R-5": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ABogtoz6PC4/1.json"
        },
        "4e554c11-d254-4569-921e-f8b49482a5c4": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ABogtoz6PC4/1.json"
        },
        "c37fcbb4-7a6e-4e74-94d3-a1618f8f1966": {
            "uriReference": "TrekToEverest_Media/Jorsalle_EA-3_EAMedia/Jorsalle_EA-3.js"
        },
        "R-7": {
            "uriReference": "http://az17600.vo.msecnd.net/rincontent/Published/Everest/MIT_Everest_Offline_Media/longerFlyoverMusic.mp3"
        },
        "R-8": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-ABogcPX+PC4/2.json"
        },
        "0bc7e545-f45d-49e0-b84b-24b99a47c40a": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-ABogcPX+PC4/2.json"
        },
        "895629d7-03bc-4ad6-af7f-010934e6c8d6": {
            "uriReference": "TrekToEverest_Media/Namche_EA-7_EAMedia/Namche_EA-7.js"
        },
        "eaV210_pano": {
            "uriReference": "TrekToEverest_Media/Pumori_EA-8_EAMedia/eaV210_pano.js"
        },
        "R-18": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-ANUfAx51_i0/0.json"
        }
    },
    "experiences": {
        "PhotosynthES-1": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "834f061b-da63-4e81-be1a-7aa20be938de",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true
            },
            "resourceReferences": [
                {
                    "resourceId": "f6a1b74f-ad11-4772-85ff-c25b4aac2a86",
                    "required": true
                },
                {
                    "resourceId": "834f061b-da63-4e81-be1a-7aa20be938de",
                    "required": true
                },
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
                "defaultStream": {
                    "duration": 15.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 1.0271888298289087,
                                            "y": 0.3433413169880395
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.11574926636490171
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 10.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.9443353956361874,
                                            "y": 0.4007667504594488
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.11574926636490171
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.17164291623841582,
                                            "y": 0.4442856888389105
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.2504464523599179
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "defaultStream-2": {
                    "duration": 10,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.17164291623841582,
                                            "y": 0.4442856888389105
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.2504464523599179
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 8.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.1669045832099211,
                                            "y": 0.4694932352816045
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.11574926636490171
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "AudioExperienceStream-1": {
            "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
            "data": {
                "markers": {
                    "beginAt": 0,
                    "endAt": 59.891625,
                    "pauseVolume": 0.1,
                    "isBackgroundAudioMode": true
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-7",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 59.891999999999996
                }
            }
        },
        "PhotosynthES-3": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "c37fcbb4-7a6e-4e74-94d3-a1618f8f1966",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true
            },
            "resourceReferences": [
                {
                    "resourceId": "4e554c11-d254-4569-921e-f8b49482a5c4",
                    "required": true
                },
                {
                    "resourceId": "c37fcbb4-7a6e-4e74-94d3-a1618f8f1966",
                    "required": true
                },
                {
                    "resourceId": "R-6",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 20.5,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.3676334184421674,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 2.0405132977256266
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 10.5,
                            "holdDuration": 0,
                            "state":{"viewport":{"region":{"center":{"x":0.35848260638229295,"y":-0.5874015837596076},"span":{"x":0,"y":0.3292271759758738}}}},"authoringMetadata":{"provider":"MicrosoftResearch.Rin.PanoramicExperienceStream"}
                        },
                        {
                            "offset": 20.5,
                            "state":{"viewport":{"region":{"center":{"x":0.1113451509026065,"y":-0.02407163406735896},"span":{"x":0,"y":0.8805405102289453}}}},"authoringMetadata":{"provider":"MicrosoftResearch.Rin.PanoramicExperienceStream"}
                        }
                    ]
                },

            "defaultStream-2": {
                "duration": 10,
                "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state":{"viewport":{"region":{"center":{"x":0.2591776336609687,"y":-0.2513933567910313},"span":{"x":0,"y":1.4136652385559953}}}},"authoringMetadata":{"provider":"MicrosoftResearch.Rin.PanoramicExperienceStream"}
                        },
                        {
                            "offset": 9,
                            "holdDuration": 0.5,
                            "state":{"viewport":{"region":{"center":{"x":0.1674584339710777,"y":0.23803111210047623},"span":{"x":0,"y":0.08575326745936315}}}},"authoringMetadata":{"provider":"MicrosoftResearch.Rin.PanoramicExperienceStream"}
                        }
                ]
            }
            }
        },
        "PhotosynthES-7": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "895629d7-03bc-4ad6-af7f-010934e6c8d6",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                },
                "smoothTransitions": true
            },
            "resourceReferences": [
                {
                    "resourceId": "0bc7e545-f45d-49e0-b84b-24b99a47c40a",
                    "required": true
                },
                {
                    "resourceId": "895629d7-03bc-4ad6-af7f-010934e6c8d6",
                    "required": true
                },
                {
                    "resourceId": "R-9",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 10,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.3676334184421674,
                                            "y": 0.0001
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 2.0405132977256266
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 10.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.5590569504703465,
                                            "y": -0.5558736378629117
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.9285660219998033
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.15412910233416394,
                                            "y": 0.061799239457627886
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.8348342014147313
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 20.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.173148872363165,
                                            "y": 0.4841195221319091
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.4668788957584135
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "defaultStream-2": {
                    "duration": 10,
                    "keyframes": [
                        {
                            "offset": 0.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.15412910233416394,
                                            "y": 0.061799239457627886
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.8348342014147313
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 8,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.173148872363165,
                                            "y": 0.4841195221319091
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.4668788957584135
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "PhotosynthES-8": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "eaV210_pano",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "policies": ["base2DGroupPolicy"]
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "R-18",
                    "required": true
                },
                {
                    "resourceId": "R-2",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 37.699999999999996,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "state":{
                                "viewport":{
                                    "region":{
                                        "center":{
                                            "x":6.102135233961662,
                                            "y":-0.0001
                                        },
                                        "span":{
                                            "x":0,
                                            "y":0.6685728045859558
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 5.5,
                            "holdDuration": 0,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.7,
                                            "y": 0.35
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.67
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 10.899999999999999,
                            "holdDuration": 1.3,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.78343988940073883,
                                            "y": -0.15
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.04
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 29.249999999999996,
                            "holdDuration": 0.89999999999999991,
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.05,
                                            "y": -0.05
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.56
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
        "Lukla": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "PhotosynthES-1",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 15.5,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                   {
                       "experienceId": "AudioExperienceStream-1",
                       "experienceStreamId": "defaultStream",
                       "begin": 0,
                       "duration": 15.5,
                       "layer": "foreground",
                       "dominantMedia": "audio",
                       "volume": 1
                   }
                ]
            }
        },
        "Jorsalle": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "PhotosynthES-1",
                        "experienceStreamId": "defaultStream-2",
                        "begin": 0,
                        "duration": 10,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "PhotosynthES-3",
                        "experienceStreamId": "defaultStream",
                        "begin": 10,
                        "duration": 20.5,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "AudioExperienceStream-1",
                        "experienceStreamId": "defaultStream2",
                        "begin": 0,
                        "duration": 30.5,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 1
                    }
                ]
            }
        },
        "Namche": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "PhotosynthES-3",
                        "experienceStreamId": "defaultStream-2",
                        "begin": 0,
                        "duration": 10,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "PhotosynthES-7",
                        "experienceStreamId": "defaultStream",
                        "begin": 10,
                        "duration": 20,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "AudioExperienceStream-1",
                        "experienceStreamId": "defaultStream3",
                        "begin": 0,
                        "duration": 30,
                        "layer": "foreground",
                        "dominantMedia": "audio",
                        "volume": 1
                    }
                ]
            }
        },
        "Pumori": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "PhotosynthES-7",
                        "experienceStreamId": "defaultStream-2",
                        "begin": 0,
                        "duration": 10,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "PhotosynthES-8",
                        "experienceStreamId": "defaultStream",
                        "begin": 10,
                        "duration": 40,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    }

                ]
            }
        }
    }
}]