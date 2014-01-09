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
        "b143d8ea-0ea2-457d-b798-afaad5524511": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-AB8gE2QdPS4/4.json"
        },
        "9be9d2f5-c5df-4add-94e1-d44955c50243": {
            "uriReference": "08_EVE_GorShep_AerlPos33_012013_8bitS%20E314_EA12_EAMedia/08_EVE_GorShep_AerlPos33_012013_8bitS%20E314_EA12.js"
        }
    },
    "experiences": {
        "PhotosynthES-13": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "9be9d2f5-c5df-4add-94e1-d44955c50243",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "b143d8ea-0ea2-457d-b798-afaad5524511",
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
                        "experienceId": "PhotosynthES-13",
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