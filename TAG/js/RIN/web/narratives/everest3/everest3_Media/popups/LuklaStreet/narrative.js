[{
    "version": 1.0,
    "defaultScreenplayId": "SCP1",
    "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
    "data": {
        "narrativeData": {
            "guid": "bb78bc92-a8d0-4f3a-87fd-771f3f933eb8",
            "timestamp": "2013-04-05T23:26:23.186Z",
            "title": "Video Popup1",
            "author": "Naren",
            "aspectRatio": "WideScreen",
            "estimatedDuration": 97,
            "description": "Description",
            "branding": null
        }
    },
    "providers": {
        "VideoExperienceStream": {
            "name": "MicrosoftResearch.Rin.VideoExperienceStream",
            "version": 0.0
        },
        "FadeInOutTransitionService": {
            "name": "MicrosoftResearch.Rin.FadeInOutTransitionService",
            "version": 0.0
        }
    },
    "resources": {
         "video1": { "uriReference": "http://az17600.vo.msecnd.net/rincontent/EverestGCE/v1/PopupVideos/GW1465_01_Lukla_TEST.mp4"}
    },
    "experiences": {
        "VideoExperienceStream1": {
            "providerId": "VideoExperienceStream",
            "data": {
                "transition": {
                    "providerId": "FadeInOutTransitionService",
                    "inDuration": 0,
                    "outDuration": 0.5
                }
            },
            "resourceReferences": [
                { "resourceId": "video1", "required": true }
            ],
            "experienceStreams": {
                "defaultStream": {
                    "duration": 97,
                    "keyframes": [
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
                        "experienceId": "VideoExperienceStream1",
                        "experienceStreamId": "defaultStream",
                        "begin": 0,
                        "duration": 97,
                        "layer": "foreground",
                        "dominantMedia": "visual",
                        "volume": 1
                    }
                ]
            }
        }
    }
}]