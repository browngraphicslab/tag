[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "3a6512ca-2784-407c-92fb-3c68ade7a5cd",
            "timestamp": "2010-12-10T06:01:35.3057065Z",
            "title": null,
            "author": "System",
            "aspectRatio": "None",
            "estimatedDuration": 10,
            "description": "",
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
        "f3be7168-3f0d-473c-ab99-6c9cd81f158a": {
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-ABogTLz1PC4/2.json"
        },
        "c0979497-0fc4-418d-9ee1-2f6a5f0eda5b": {
            "uriReference": "01_EVE_LuklaVil_AerlPos26_012013_8bitSharp%20E310_EA-1_EAMedia/01_EVE_LuklaVil_AerlPos26_012013_8bitSharp%20E310_EA-1.js"
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
                },
                "EmbeddedArtifacts": {
                    "datasource": "c0979497-0fc4-418d-9ee1-2f6a5f0eda5b",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "f3be7168-3f0d-473c-ab99-6c9cd81f158a",
                    "required": true
                }
            ],
            "experienceStreams": {
                "defaultSequence": {
                    "duration": 10
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