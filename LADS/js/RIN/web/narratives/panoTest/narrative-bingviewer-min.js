[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "6aa09d19-cf2b-4c8e-8b57-7ea8701794f7",
            "timestamp": "2011-07-29T00:48:12.8847651Z",
            "title": "Minimal Panorama Test Narrative",
            "author": "Tanuja",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 20,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {

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
        "PanoramaResource": {
            "uriReference2": "http://cdn3.ps1.photosynth.net/pano/c01001300-APEfp_CjFS4/0.json",
            "uriReference3": "http://cdn4.ps1.photosynth.net/pano/c01001400-AB0gCmPWPC4/0.json",
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-ACggK56OTS4/1.json"
        }
    },
    "experiences": {
        "PanoExperience-1": {
            "providerId": "PanoramicExperienceStream",
            "data": {
                "mode": "stresstest",
                "minFieldOfView": 0.12,
                "interpolatorType": "vectorBased",
                "smoothTransitions": true,
                "viewShrinkFactor": 0.9
            },
            "resourceReferences": [
                {
                    "resourceId": "PanoramaResource",
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
                                "viewport": { "region": { "center": { "x": 6.251663281983285, "y": 0.0001 }, "span": { "x": 1.451379937174049, "y": 0.8542479117301206 } } }
                            }
                        },
                        {
                            "offset": 10,
                            "holdDuration": 0,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -1 },
                            "state": { "viewport": { "region": { "center": { "x": 0.38783077493925133, "y": 0.17067185326214712 }, "span": { "x": 0.34940205183714473, "y": 0.18060415866354396 } } } }
                        }
                        ,
                        {
                            "offset": 32,
                            "holdDuration": 2,
                            "data": { "fov": 0.4, "pitch": 0, "heading": -0.5 },
                            "state": { "viewport": { "region": { "center": { "x": 0.1415195646575036, "y": 0.1666617867981218 }, "span": { "x": 0.7290482081804143, "y": 0.38662456636419673 } } } }
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
                        "experienceId": "PanoExperience-1",
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