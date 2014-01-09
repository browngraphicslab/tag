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
        "cd523712-5953-472c-966c-ff209475e5fc": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-ABogcPX+PC4/2.json"
        },
        "e0b9dde7-8903-40fd-91bc-c62bb8927e1d": {
            "uriReference": "03_EVE_Nam_AerlPos28_012013_8bitSharp_JMEDIT%20E314_EA-5_EAMedia/03_EVE_Nam_AerlPos28_012013_8bitSharp_JMEDIT%20E314_EA-5.js"
        }
    },
    "experiences": {
        "PhotosynthES-6": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "e0b9dde7-8903-40fd-91bc-c62bb8927e1d",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "cd523712-5953-472c-966c-ff209475e5fc",
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
                        "experienceId": "PhotosynthES-6",
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