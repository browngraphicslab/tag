[{
    "defaultScreenplayId": "S-H01_EA_OverPmri-main",
     "resources": {
         "ScreenplayProperties": {
             "doNotOverride": true,
             "uriReference": "common/screenplayproperties.js"
         },
         "R-audio-background-music-01": {
             "doNotOverride": true,
             "uriReference": "http://cdn-media.glacierworks.org/sounds/tours/In_A_Better_World_Music_Bed_short_Fix.mp3"
         }
     },
     "experiences": {

         "E-audio-background-music-01": {
             "doNotOverride": true,
             "providerId": "MicrosoftResearch.Rin.AudioExperienceStream",
             "data": {
                 "markers": {
                     "beginAt": 0,
                     "endAt": 59.891625,
                     "pauseVolume": 1,
                     "baseVolume": 0.3,
                     "isBackgroundAudioMode": true
                 }
             },
             "resourceReferences": [
                 {
                     "resourceId": "R-audio-background-music-01",
                     "required": true
                 }
             ],
             "experienceStreams": {
                 "defaultStream": {
                     "duration": 59.891999999999996
                 }
             }
         }
     }
}]
