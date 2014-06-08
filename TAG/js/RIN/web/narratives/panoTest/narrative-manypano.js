[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "6aa09d19-cf2b-4c8e-8b57-7ea8701794f7",
            "timestamp": "2011-07-29T00:48:12.8847651Z",
            "title": "Panorama Test Narrative",
            "author": "Tanuja",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 80,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {
        "FadeInOutTransitionService": {
            "name": "MicrosoftResearch.Rin.FadeInOutTransitionService",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
            "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
            "version": 0.0
        },
        "PanoramicExperienceStream": {
            "name": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "version": 0.0
        }
    },
    "resources": {
        "p1": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-ANUfAx51_i0/0.json"
        },
        "p2": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-APEfp_CjFS4/0.json"
        },
        "p3": {
            "uriReference": "http://cdn2.ps1.photosynth.net/pano/c01001200-ACQbs4sllCk/0.json"
        },
        "p4": {
            "uriReference": "http://cdn1.ps1.photosynth.net/pano/c01001100-AA4e9PqOXyw/0.json"
        },
        "v1": {
            "uriReference" : "http://rin-red-1/rin/ClientBin/DemoNarratives/6aa09d19-cf2b-4c8e-8b57-7ea8701794f7/DigNarrative_072811v4_Media/1_Grain%201080P_v3.mp4"
        },
		"v2" : {
		    "uriReference" : "http://rin-red-1/rin/ClientBin/DemoNarratives/6aa09d19-cf2b-4c8e-8b57-7ea8701794f7/DigNarrative_072811v4_Media/2_Grain%201080P_v3.mp4"
		},
		"v3" : {
		    "uriReference" : "http://rin-red-1/rin/ClientBin/DemoNarratives/6aa09d19-cf2b-4c8e-8b57-7ea8701794f7/DigNarrative_072811v4_Media/3_Grain%201080P_v3.mp4"
		},
		"v4" : {
		    "uriReference" : "http://rin-red-1/rin/ClientBin/DemoNarratives/6aa09d19-cf2b-4c8e-8b57-7ea8701794f7/DigNarrative_072811v4_Media/4_Grain%201080P_v3.mp4"
		}
    },
    "experiences": {
        "PanoExperience-1": {
            "providerId": "PanoramicExperienceStream",
            "data": {
                "mode": "stresstest",
                "markers": {
                    "beginAt": 0,
                    "endAt": 10
                },
                "transition": {
                    "providerId": "FadeInOutTransitionService",
                    "inDuration": 0.5,
                    "outDuration": 0.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "p1",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 20,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": { "fov": 0.7, "pitch": 0, "heading": -1 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.021,
                                            "y": -0.0165
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.68
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 8,
                            "holdDuration": 0,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -1 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.94,
                                            "y": 0.038
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.434
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15,
                            "holdDuration": 2,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -0.5 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2091,
                                            "y": 0.038
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.4342
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 20,
                            "holdDuration": 0,
                            "data": { "fov": 0.4, "pitch": 0.08, "heading": -0.5 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2091,
                                            "y": -0.04
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.625167
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "PanoExperience-2": {
            "providerId": "PanoramicExperienceStream",
            "data": {
                "mode": "stresstest",
                "markers": {
                    "beginAt": 0,
                    "endAt": 10
                },
                "transition": {
                    "providerId": "FadeInOutTransitionService",
                    "inDuration": 0.5,
                    "outDuration": 0.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "p2",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 20,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": { "fov": 0.7, "pitch": 0, "heading": -1 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.503527899664,
                                            "y": 0.416884625376
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.83356925075
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15,
                            "holdDuration": 0,
                            "data": { "fov": 0.7, "pitch": 0, "heading": -0.5 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.662821293598,
                                            "y": -0.16310809907200
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.17373244
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "PanoExperience-3": {
            "providerId": "PanoramicExperienceStream",
            "data": {
                "mode": "stresstest",
                "markers": {
                    "beginAt": 0,
                    "endAt": 10
                },
                "transition": {
                    "providerId": "FadeInOutTransitionService",
                    "inDuration": 0.5,
                    "outDuration": 0.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "p3",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 20,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": { "fov": 0.7, "pitch": 0, "heading": -1 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.021,
                                            "y": -0.0165
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.68
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 8,
                            "holdDuration": 0,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -1 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.94,
                                            "y": 0.038
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.434
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15,
                            "holdDuration": 2,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -0.5 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2091,
                                            "y": 0.038
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.4342
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 20,
                            "holdDuration": 0,
                            "data": { "fov": 0.4, "pitch": 0.08, "heading": -0.5 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2091,
                                            "y": -0.04
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.625167
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "PanoExperience-4": {
            "providerId": "PanoramicExperienceStream",
            "data": {
                "mode": "stresstest",
                "markers": {
                    "beginAt": 0,
                    "endAt": 10
                },
                "transition": {
                    "providerId": "FadeInOutTransitionService",
                    "inDuration": 0.5,
                    "outDuration": 0.5
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "p4",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 20,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0,
                            "data": { "fov": 0.7, "pitch": 0, "heading": -1 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.021,
                                            "y": -0.0165
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.68
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 8,
                            "holdDuration": 0,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -1 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 5.94,
                                            "y": 0.038
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.434
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15,
                            "holdDuration": 2,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -0.5 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2091,
                                            "y": 0.038
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.4342
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 20,
                            "holdDuration": 0,
                            "data": { "fov": 0.4, "pitch": 0.08, "heading": -0.5 },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 6.2091,
                                            "y": -0.04
                                        },
                                        "span": {
                                            "x": 0,
                                            "y": 0.625167
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "VideoExperienceStream-1": {
            "providerId": "MicrosoftResearch.Rin.VideoExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "markers": {
                    "beginAt": 0,
                    "endAt": 32.615949199999996
                }
            },
            "resourceReferences": [
				{
				    "resourceId": "v1",
				    "required": true
				}
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 32.616
                }
            }
        },
        "VideoExperienceStream-2": {
            "providerId": "MicrosoftResearch.Rin.VideoExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "markers": {
                    "beginAt": 0,
                    "endAt": 32.615949199999996
                }
            },
            "resourceReferences": [
				{
				    "resourceId": "v2",
				    "required": true
				}
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 32.616
                }
            }
        },
        "VideoExperienceStream-3": {
            "providerId": "MicrosoftResearch.Rin.VideoExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "markers": {
                    "beginAt": 0,
                    "endAt": 32.615949199999996
                }
            },
            "resourceReferences": [
				{
				    "resourceId": "v3",
				    "required": true
				}
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 32.616
                }
            }
        },
        "VideoExperienceStream-4": {
            "providerId": "MicrosoftResearch.Rin.VideoExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "markers": {
                    "beginAt": 0,
                    "endAt": 32.615949199999996
                }
            },
            "resourceReferences": [
				{
				    "resourceId": "v4",
				    "required": true
				}
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 32.616
                }
            }
        }
    },
    "screenplays": {
        "SCP1": {
            "data": {
                "experienceStreamReferences": [
                    {
                        "experienceId": "PanoExperience-1",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 10,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                    },
                {
                        "experienceId": "PanoExperience-2",
                        "experienceStreamId": "defaultStream",
                        "begin": 10,
                        "duration": 10,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                },
                {
                    "experienceId": "PanoExperience-3",
                    "experienceStreamId": "defaultStream",
                    "begin": 20,
                    "duration": 10,
                    "layer": "foreground",
                    "dominantMedia": "visual",
                    "volume": 1
                },
                {
                    "experienceId": "PanoExperience-4",
                    "experienceStreamId": "defaultStream",
                    "begin": 30,
                    "duration": 10,
                    "layer": "foreground",
                    "dominantMedia": "visual",
                    "volume": 1
                },
                {
                    "experienceId": "VideoExperienceStream-1",
                    "experienceStreamId": "defaultStream",
                    "begin": 40,
                    "duration": 10,
                    "layer": "foreground",
                    "dominantMedia": "visual",
                    "volume": 1
                },
                {
                    "experienceId": "VideoExperienceStream-2",
                    "experienceStreamId": "defaultStream",
                    "begin": 50,
                    "duration": 10,
                    "layer": "foreground",
                    "dominantMedia": "visual",
                    "volume": 1
                },
                {
                    "experienceId": "VideoExperienceStream-3",
                    "experienceStreamId": "defaultStream",
                    "begin": 60,
                    "duration": 10,
                    "layer": "foreground",
                    "dominantMedia": "visual",
                    "volume": 1
                },
                {
                    "experienceId": "VideoExperienceStream-4",
                    "experienceStreamId": "defaultStream",
                    "begin": 70,
                    "duration": 10,
                    "layer": "foreground",
                    "dominantMedia": "visual",
                    "volume": 1
                }
                ]
            }
        }
    }
}]