[{
	"version" : 1.0,
	"defaultScreenplayId": "SCP1",
	"screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
	"data" : {
		"narrativeData" : {
			"guid" : "6aa09d19-cf2b-4c8e-8b57-7ea8701794f7",
			"timestamp" : "2011-07-29T00:48:12.8847651Z",
			"title" : "NamcheBazarSlideShow",
			"author" : "ajohn",
			"aspectRatio" : "WideScreen",
			"estimatedDuration" : 15,
			"description" : "Description",
			"branding" : null
		}
	},
	"providers" : {
		
		"MicrosoftResearch.Rin.FadeInOutTransitionService" : {
		    "name" : "MicrosoftResearch.Rin.FadeInOutTransitionService",
		    "version" : 0.0
		},
		"MicrosoftResearch.Rin.ZoomableMediaExperienceStream" : {
		    "name": "MicrosoftResearch.Rin.ImageExperienceStream",
			"version" : 0.0
		},
		"MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
		    "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
		    "version": 0.0
		}
	},
	"resources" : {
		"R-1" : {
			"uriReference" : "n1.jpg"
		},
		"R-2": {
		    "uriReference": "n2.jpg"
		},
		"R-3": {
		    "uriReference": "n3.jpg"
		}
	},
	"experiences" : {
		
	    "ZoomableMediaExperienceStream-1" : {
	        "providerId" : "MicrosoftResearch.Rin.ZoomableMediaExperienceStream",
	        "data" : {
	            "transition" : {
	                "providerId" : "MicrosoftResearch.Rin.FadeInOutTransitionService",
	                "inDuration" : 2,
	                "outDuration" : 2
	            },
	            "viewportConstrainRatio": 0.2,
                "viewportClamping":"all"
	        },
	        "resourceReferences" : [
				{
				    "resourceId" : "R-1",
				    "required" : true
				}
	        ],
	        "experienceStreams" : {
	            "defaultStream" : {
	                "duration" : 5,
	                "data" : {
	                    "contentType" : "SingleDeepZoomImage"
	                },
	                "keyframes" : []
	            }
	        }
	    },
	    "ZoomableMediaExperienceStream-2": {
	        "providerId": "MicrosoftResearch.Rin.ZoomableMediaExperienceStream",
	        "data": {
	            "transition": {
	                "providerId": "MicrosoftResearch.Rin.FadeInOutTransitionService",
	                "inDuration": 2,
	                "outDuration": 2
	            },
	            "viewportConstrainRatio": 0.2,
	            "viewportClamping": "all"
	        },
	        "resourceReferences": [
				{
				    "resourceId": "R-2",
				    "required": true
				}
	        ],
	        "experienceStreams": {
	            "defaultStream": {
	                "duration": 5,
	                "data": {
	                    "contentType": "SingleDeepZoomImage"
	                },
	                "keyframes": []
	            }
	        }
	    },
	    "ZoomableMediaExperienceStream-3": {
	        "providerId": "MicrosoftResearch.Rin.ZoomableMediaExperienceStream",
	        "data": {
	            "transition": {
	                "providerId": "MicrosoftResearch.Rin.FadeInOutTransitionService",
	                "inDuration": 2,
	                "outDuration": 2
	            },
	            "viewportConstrainRatio": 0.2,
	            "viewportClamping": "all"
	        },
	        "resourceReferences": [
				{
				    "resourceId": "R-3",
				    "required": true
				}
	        ],
	        "experienceStreams": {
	            "defaultStream": {
	                "duration": 5,
	                "data": {
	                    "contentType": "SingleDeepZoomImage"
	                },
	                "keyframes": []
	            }
	        }
	    }
	},
	"screenplays" : {
		"SCP1" : {
			"data" : {
				"experienceStreamReferences" : [
					{
						"experienceId" : "ZoomableMediaExperienceStream-1",
						"experienceStreamId" : "defaultStream",
						"begin" : 0,
						"duration" : 5,
						"layer" : "foreground",
						"dominantMedia" : "visual",
						"volume" : 1
					},
                    {
                        "experienceId": "ZoomableMediaExperienceStream-2",
                        "experienceStreamId": "defaultStream",
                        "begin": 5,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                    },
                    {
                        "experienceId": "ZoomableMediaExperienceStream-3",
                        "experienceStreamId": "defaultStream",
                        "begin": 10,
                        "duration": 5,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                    }
				]
			}
		}
	}
}]