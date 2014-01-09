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
        "7cff12ca-be50-413d-b28a-04e5afb81884": {
            "uriReference": "http://cdn4.ps1.photosynth.net/pano/c01001400-AB0gCmPWPC4/0.json"
        },
        "5c04b358-ad68-4e93-93f2-1d8f3624d109": {
            "uriReference": "03A_EVE_NamBaz_AerlPos31_012013_8bitSharp%20E%20313_EA-7_EAMedia/03A_EVE_NamBaz_AerlPos31_012013_8bitSharp%20E%20313_EA-7.js"
        }
    },
    "experiences": {
        "PhotosynthES-8": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "5c04b358-ad68-4e93-93f2-1d8f3624d109",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "7cff12ca-be50-413d-b28a-04e5afb81884",
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
                        "experienceId": "PhotosynthES-8",
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