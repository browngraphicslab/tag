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
        "6ed52a73-87d6-4092-ba80-35b82a599158": {
            "uriReference": "http://cdn3.ps1.photosynth.net/pano/c01001300-APEfp_CjFS4/0.json"
        },
        "2641260b-92e1-4037-99d4-004bf29f5e42": {
            "uriReference": "EBC_KhuGl%20w%20BC_Pmri_050112_8bit_FLAT_EA14_EAMedia/EBC_KhuGl%20w%20BC_Pmri_050112_8bit_FLAT_EA14.js"
        }
    },
    "experiences": {
        "PhotosynthES-15": {
            "providerId": "MicrosoftResearch.Rin.PanoramicExperienceStream",
            "data": {
                "transition": {
                    "providerId": "MicrosoftResearch.Rin.SLPlayer.FadeInOutTransitionService",
                    "inDuration": 2,
                    "outDuration": 2
                },
                "EmbeddedArtifacts": {
                    "datasource": "2641260b-92e1-4037-99d4-004bf29f5e42",
                    "artifactHost": "rin.embeddedArtifacts.ArtifactHost",
                    "artifactType": "Artifacts",
                    "policies": [
                        "base2DGroupPolicy"
                    ]
                }
            },
            "resourceReferences": [
                {
                    "resourceId": "6ed52a73-87d6-4092-ba80-35b82a599158",
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
                        "experienceId": "PhotosynthES-15",
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