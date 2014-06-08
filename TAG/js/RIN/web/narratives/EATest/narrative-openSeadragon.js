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
            "estimatedDuration": 20,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {
        "microsoftResearch.rin.twodlayoutengine" : {
            "name" : "microsoftResearch.rin.twodlayoutengine",
            "version" : 0.0
        },
        "PlaceholderES": {
            "name": "MicrosoftResearch.Rin.PlaceholderExperienceStream",
            "version": 0.0
        },
        "FadeInOutTransitionService": {
            "name": "MicrosoftResearch.Rin.FadeInOutTransitionService",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
            "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
            "version": 0.0
        },
        "MicrosoftResearch.Rin.ZoomableMediaExperienceStreamV2": {
            "name": "MicrosoftResearch.Rin.OpenSeadragonExperienceStream",
            "version": 0.0
        }
    },
    "resources": {
        "R-13": {
            "uriReference": "http://zoom.it/xCOo"
        },
        "OverlaysResource": {
            "uriReference": "RIN_OVERLAYS.js"
        }
    },
    "experiences": {
        "ZoomableMediaExperienceStreamV2-5": {
            "providerId": "MicrosoftResearch.Rin.ZoomableMediaExperienceStreamV2",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifactsNot": {
                    "datasource": "eaV25",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "policies": ["base2DGroupPolicy"]
                },
		"viewportClamping":"all"

            },
            "resourceReferences": [
                {
                    "resourceId": "R-13",
                    "required": true
                },
                {
                    "resourceId": "R-2",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 20,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.5,
                            "data": {
                                "default": "<ZoomableMediaKeyframe Media_Type=\"SingleDeepZoomImage\" Media_Source=\"R-13\" Viewport_X=\"0.58869498292040512\" Viewport_Y=\"0.0713846391901621\" Viewport_Width=\"0.4096\" Viewport_Height=\"0.23046052009456267\" Media_AspRatio=\"0.32696282747311445\" />",
                                "ea-selstate": null,
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/e60b0d91-b26e-45e7-9539-ec7653c52aaa_keyframe_5ed0b380-2f93-4091-ac55-38d43cdc86de.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.18114822,
                                            "y": 0.01176
                                        },
                                        "span": {
                                            "x": 0.415244,
                                            "y": 0.23046
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 8,
                            "holdDuration": 9.2,
                            "data": {
                                "default": "<ZoomableMediaKeyframe Media_Type=\"SingleDeepZoomImage\" Media_Source=\"R-13\" Viewport_X=\"0.2146001050638251\" Viewport_Y=\"0.074612377566836641\" Viewport_Width=\"0.4096\" Viewport_Height=\"0.23046052009456267\" Media_AspRatio=\"0.32696282747311445\" />",
                                "ea-selstate": null,
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/e60b0d91-b26e-45e7-9539-ec7653c52aaa_keyframe_af5ab413-4259-4841-a838-ea5c596f48fc.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.2130291050638251,
                                            "y": 0.036977566836641
                                        },
                                        "span": {
                                            "x": 0.288264,
                                            "y": 0.16004
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 15,
                            "holdDuration": 2.1,
                            "data": {
                                "default": "<ZoomableMediaKeyframe Media_Type=\"SingleDeepZoomImage\" Media_Source=\"R-13\" Viewport_X=\"0.33674929539339793\" Viewport_Y=\"0.092647030836417163\" Viewport_Width=\"0.068719476736000012\" Viewport_Height=\"0.038664859250988184\" Media_AspRatio=\"0.32696282747311445\" />",
                                "ea-selstate": null,
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/e60b0d91-b26e-45e7-9539-ec7653c52aaa_keyframe_db77fdd1-2935-4272-b8a5-c23d69419aa0.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.328375,
                                            "y": 0.03691030836417163
                                        },
                                        "span": {
                                            "x": 0.2883,
                                            "y": 0.16004
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 20,
                            "holdDuration": 0,
                            "data": {
                                "default": "<ZoomableMediaKeyframe Media_Type=\"SingleDeepZoomImage\" Media_Source=\"R-13\" Viewport_X=\"0.336731393752427\" Viewport_Y=\"0.092647030836417177\" Viewport_Width=\"0.0687552800179418\" Viewport_Height=\"0.03868500388716347\" Media_AspRatio=\"0.32696282747311445\" />",
                                "ea-selstate": null,
                                "keyframeThumbnail": "<Thumbnail>Thumbnails/e60b0d91-b26e-45e7-9539-ec7653c52aaa_keyframe_7474bf48-a96f-46a7-833d-5d281da61794.bmp</Thumbnail>"
                            },
                            "state": {
                                "viewport": {
                                    "region": {
                                        "center": {
                                            "x": 0.265458,
                                            "y": 0.02788666
                                        },
                                        "span": {
                                            "x": 0.40567,
                                            "y": 0.221547
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "OverlayES": {
            "providerId": "microsoftResearch.rin.twodlayoutengine",
            "data": {
                "contentType": "TitleOverlays",
                "artifactLayoutEngineInfo": {
                    "layoutMapper": "MicrosoftResearch.Rin.RinDataMapper.TwoDLayoutDataMapper",
                    "dataSource": {
                        "type": "Artifacts",
                        "resourceId": "OverlaysResource",
                        "dataMapper": "MicrosoftResearch.Rin.RinDataMapper.WxmlDataMapper",
                        "host": "Microsoft.Rin.EmbeddedArtifactHost.DefaultHost"
                    },
                    "environmentalPolicies": {
                        "MicrosoftResearch.Rin.ZoomLayerPolicy": null
                    }
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "OverlaysResource",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 20,
                    "keyframes": [
                        {
                            "offset": 0,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "DeepZoom",
                                        "view": {
                                            "display": {
                                                "show": true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "offset": 19.6,
                            "holdDuration": 0.2,
                            "data": {
                                "ea-selstate": {
                                    "item": {
                                        "itemid": "DeepZoom",
                                        "view": {
                                            "display": {
                                                "show": false
                                            }
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
                        "experienceId": "OverlayES",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 20,
                        "layer": "overlay",
                        "dominantMedia": "visual",
                        "volume": 0.6
                    },
                    {
                        "experienceId": "ZoomableMediaExperienceStreamV2-5",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 20,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                    }
                ]
            }
        }
    }
}]