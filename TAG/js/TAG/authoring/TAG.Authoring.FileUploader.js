TAG.Util.makeNamespace('TAG.Authoring.FileUploader');
//This is the one for the Web App that uses Resumable.js
/**
 * Enum of file upload types
 */
TAG.Authoring.FileUploadTypes = {
    Standard: 0,
    DeepZoom: 1,
    AssociatedMedia: 2,
    VideoArtwork: 3
};

TAG.Authoring.FileUploader = function (root, type,  localCallback, finishedCallback, filters, useThumbs, errorCallback, multiple, innerProgBar) {
"use strict";

    var that = {};
    filters = filters || ['*'];
    multiple = multiple || false;
    var uploadingOverlay = $(document.createElement('div')),
    innerProgressBar = $(document.createElement('div')); // HTML upload overlay
    var dataReaderLoads = [];       //To pass into the finishedCallback, parsed as urls (paths to be precise)
    var maxDuration = Infinity;
    var minDuration = -1;
    var size;
    var globalUriStrings = [], globalFiles = [], globalUpload = null;
    var globalFilesArray = [];
    var largeFiles = "";
    var longFiles = [];
    var shortFiles = [];
    var fileUploadError;
    var removeVals;
    var maxFileSize = 50 * 1024 * 1024;
    var maxDeepZoomFileSize = 250 * 1024 * 1024;
    var localURLs = [];



    //Basic HTML initialization
    (function init() {
        var uploadOverlayText = $(document.createElement('label')),
            progressIcon = $(document.createElement('img')),
            progressBar = $(document.createElement('div'));

        // Progress / spinner wheel overlay to display while uploading
        uploadingOverlay.attr("id", "uploadingOverlay");
        uploadingOverlay.css({ 'position': 'absolute', 'left': '0%', 'top': '0%', 'background-color': 'rgba(0, 0, 0, .5)', 'width': '100%', 'height': '100%', 'z-index': 100000100 });

        uploadOverlayText.css({ 'color': 'white', 'width': '10%', 'height': '5%', 'top': '38%', 'left': '40%', 'position': 'relative', 'font-size': '250%' });
        uploadOverlayText.text('Uploading file(s). Please wait.');

        progressIcon.css({
            'position': 'relative', 'top': '50%', 'left': '14%'
        });
        progressIcon.attr('src', 'images/icons/progress-circle.gif');

        progressBar.css({
            'position': 'relative', 'top': '42%', 'left': '45%', 'border-style': 'solid', 'border-color': 'white', 'width': '10%', 'height': '2%'
        });

        innerProgressBar.css({
            'background-color': 'white', 'width': '0%', 'height': '100%'
        });

        progressBar.append(innerProgressBar);
        uploadingOverlay.append(uploadOverlayText);
        uploadingOverlay.append(progressBar);
        uploadingOverlay.hide();
        root.append(uploadingOverlay);
    })();

    (function uploadFile() {
        var resumableUploader = new Resumable({
            target: TAG.Worktop.Database.getSecureURL(),        //Check that this works
            maxFiles: 10000,
            query: function(resumableFile) {                    //Does it need to execute? New resumable objects for each?
                switch(type) {
                    case TAG.Authoring.FileUploadTypes.VideoArtwork:
                        return {
                            Type: 'FileUploadVideoArtwork',
                            ReturnDoq: true,
                            Token: TAG.Auth.getToken(),
                            Extension: resumableFile.file.type.substr(1),
                            AnotherType: resumableUpload
                        }
                    break;
                    case TAG.Authoring.FileUploadTypes.AssociatedMedia:
                        return {
                            Type: 'FileUploadAssociatedMedia',
                            ReturnDoq: true,
                            Token: TAG.Auth.getToken(),
                            Extension: resumableFile.file.type.substr(1)
                        }
                    break;
                    case TAG.Authoring.FileUploadTypes.Standard:
                        return {
                            Type: 'FileUpload',
                            Token: TAG.Auth.getToken(),
                            Extension: resumableFile.file.type.substr(1)
                        }
                    break;
                    case TAG.Authoring.FileUploadTypes.DeepZoom:
                        if(resumableFile.file.type.match(/video/)) {
                            return {
                            Type: 'FileUploadVideoArtwork',
                            ReturnDoq: true,
                            Token: TAG.Auth.getToken(),
                            Extension: resumableFile.file.type.substr(1)
                            }
                        } else {
                            return {
                            Type: 'FileUploadDeepZoom',
                            ReturnDoq: true,
                            Token: TAG.Auth.getToken(),
                            Extension: resumableFile.file.type.substr(1)
                            }
                        }                       
                    break;
                }
                

            }
        });
        var clickedElement = $(document.createElement('div'));
        resumableUploader.assignBrowse(clickedElement);
        clickedElement.click();
        console.log("If you're seeing this, the file picker should be open");
        resumableUploader.on('fileSuccess', function(resumableFile, message) {
            dataReaderLoads.push($.trim(message));
            console.log("Message from the server: " + message);
            var bar = innerProgBar || innerProgressBar;
            var percentComplete = resumableUploader.progress();
            bar.width(percentComplete * 90 + "%");
        });
        resumableUploader.on('complete', function(file) {
            finishedUpload();
        })
        resumableUploader.on('fileAdded', function(resumableFile){
            //Set maximum size for the file
            var maxSize;
            globalFilesArray.push(resumableFile.file);
            switch (type) {
            case TAG.Authoring.FileUploadTypes.VideoArtwork:
            case TAG.Authoring.FileUploadTypes.AssociatedMedia:
            case TAG.Authoring.FileUploadTypes.Standard:
               maxSize = maxFileSize;
               break;
            case TAG.Authoring.FileUploadTypes.DeepZoom:
               maxSize = maxDeepZoomFileSize;
               break;
            }
            size = resumableFile.size;
            if(size < maxSize) {
                checkDuration(resumableFile, 
                function(){         //good
                    var localURL;
                    var uriString;
                    globalFiles.push(resumableFile.file);
                    localURL = window.URL.createObjectURL(resumableFile.file);
                    localURLs.push(localURL);
                    var msg;
                    switch (type) {
                       case TAG.Authoring.FileUploadTypes.VideoArtwork:
                           uriString = TAG.Worktop.Database.getSecureURL() + "/?Type=FileUploadVideoArtwork&ReturnDoq=true&Token=" + TAG.Auth.getToken() + "&Extension=" + resumableFile.file.type.substr(1);
                           break;
                       case TAG.Authoring.FileUploadTypes.AssociatedMedia:
                           uriString = TAG.Worktop.Database.getSecureURL() + "/?Type=FileUploadAssociatedMedia&ReturnDoq=true&Token=" + TAG.Auth.getToken() + "&Extension=" + resumableFile.file.type.substr(1);
                           break;
                       case TAG.Authoring.FileUploadTypes.Standard:
                           uriString = TAG.Worktop.Database.getSecureURL() + "/?Type=FileUpload&&Token=" + TAG.Auth.getToken() + "&Extension=" + resumableFile.file.type.substr(1);
                           break;
                       case TAG.Authoring.FileUploadTypes.DeepZoom:
                           uriString = TAG.Worktop.Database.getSecureURL() + "/?Type=FileUploadDeepzoom&ReturnDoq=true&token=" + TAG.Auth.getToken() + "&Extension=" + resumableFile.file.type.substr(1);
                           break;
                    }
                    globalUriStrings.push(uriString);
                    if (typeof (msg = localCallback([resumableFile.file], [localURL], [uriString])) === 'string') {
                            //TODO when does this ever return a string anyway? Is this necessary at all?
                          fileUploadError = uploadErrorAlert(null, msg, null);
                          $(fileUploadError).css('z-index', TAG.TourAuthoring.Constants.aboveRinZIndex + 1000);
                          $('body').append(fileUploadError);
                          $(fileUploadError).fadeIn(500);
                      } else {
                            
                            //start the upload here
                            resumableUploader.upload();
                            addLocalCallback(globalFiles, localURLs)();
                            
                   }                    

                });
            } else {
                resumableUploader.removeFile(resumableFile);
                largeFiles += ("<br />" + resumableFile.name);
                fileUploadError = uploadErrorAlert(null, "The selected file(s) exceeded the 50MB file limit and could not be uploaded.", null);
                $(fileUploadError).css('z-index', TAG.TourAuthoring.Constants.aboveRinZIndex + 1000);
                $('body').append(fileUploadError);
                $(fileUploadError).fadeIn(500);
            }
            //More error handlers required here?
        });

    })();
    //Check the duration of media files
    function checkDuration(resumableFile, good) {
        if (resumableFile.file.type === '.mp4') {
            // Get video properties. Any better way of doing this?
            var videoElement = $(document.createElement('video'));
            videoElement.attr('preload', 'metadata');   //Instead of waiting for whole video to load, just load metadata
            var videoURL = URL.createObjectURL(resumableFile.file);
            videoElement.attr('src', videoURL);
            videoElement.on('loadedmetadata', function() {
                var dur = this.duration;
                if (dur > maxDuration) {
                    removeVals.push(resumableFile.file);
                    resumableUploader.removeFile(resumableFile);
                    longFiles.push(resumableFile.file);
                } else if (dur < minDuration) {
                    removeVals.push(resumableFile.file);
                    shortFiles.push(resumableFile.file);
                    resumableUploader.removeFile(resumableFile);
                } else {
                    good();
                }
                
            });

            
        } else if (resumableFile.file.type === '.mp3') {
            // Get audio properties. Again, better way of doing this?
            var audioElement = $(document.createElement('audio'));
            audioElement.attr('preload', 'metadata');   //Instead of waiting for whole video to load, just load metadata
            var audioURL = URL.createObjectURL(resumableFile.file);
            audioElement.attr('src', audioURL);
            audioElement.on('loadedmetadata', function() {
                var dur = this.duration;
                if (dur > maxDuration) {
                    removeVals.push(resumableFile.file);                    
                    longFiles.push(resumableFile.file);
                    resumableUploader.removeFile(resumableFile);
                } else if (dur < minDuration) {
                    removeVals.push(resumableFile.file);
                    shortFiles.push(resumableFile.file);
                    resumableUploader.removeFile(resumableFile);
                } else {
                    good();
                }
                
            });

        } else {
            good();
        }
    }

    
    function addLocalCallback(files, localUrls, uriStrings) {
        return function () {
            localCallback(files, localUrls, uriStrings);
        };
    }


    function addOverlay(elmt) {
        if ($("#uploadingOverlay").length === 0) {
            elmt.append(uploadingOverlay);
        }
    }

    /**
     * Totally remove the overlay from the DOM / destroy
     */
    function removeOverlay() {
        uploadingOverlay.remove();
    }

    function finishedUpload() {
        removeOverlay();
        finishedCallback(dataReaderLoads);
        var msg = "", str, mins, secs;
        var longFilesExist = false;
        var i;
        if (largeFiles !== "") {
            msg = "The following file(s) exceeded the 50MB file limit:" + largeFiles;
        }
        if (longFiles.length) {
            longFilesExist = true;
            mins = Math.floor(maxDuration / 60);
            secs = maxDuration % 60;
            if (secs === 0) {
                secs = '00';
            }
            else if (secs <= 9) {
                secs = '0' + secs;
            }
            str = "The following file(s) exceeded the " + mins + ":" + secs + " duration limit:<br />";
            for (i = 0; i < longFiles.length; i++) {
                str = str + longFiles[i].name + "<br />";
            }
            msg = msg + str;
        }
        if (shortFiles.length) {
            if (longFilesExist) {
                msg = msg + "<br />";
            }
            mins = Math.floor(minDuration / 60);
            secs = minDuration % 60;
            if (secs === 0) {
                secs = '00';
            }
            else if (secs <= 9) {
                secs = '0' + secs;
            }
            str = "The following file(s) are shorter than the " + mins + ":" + secs + " lower duration limit:<br />";
            for (i = 0; i < shortFiles.length; i++) {
                str = str + shortFiles[i].name + "<br />";
            }
            msg = msg + str;
        }
        if (msg) {
            var fileUploadError = uploadErrorAlert(null, msg, null, false, true);
            $(fileUploadError).css('z-index', TAG.TourAuthoring.Constants.aboveRinZIndex + 1000);
            $('body').append(fileUploadError);
            $(fileUploadError).fadeIn(500);        
        }
    }



    function setMaxDuration(seconds) {
        maxDuration = seconds;
    }

    that.setMaxDuration = setMaxDuration;

    function setMinDuration(seconds) {
        minDuration = seconds;
    }

    that.setMinDuration = setMinDuration;

    //clickAction is what happens when the confirm button is clicked
    function uploadErrorAlert(clickAction, message, buttonText, noFade, useHTML) {
        var overlay = TAG.Util.UI.blockInteractionOverlay();

        var confirmBox = document.createElement('div');
        var confirmBoxSpecs = TAG.Util.constrainAndPosition($(window).width(), $(window).height(),
           {
               center_h: true,
               center_v: true,
               width: 0.5,
               height: 0.35,
               max_width: 560,
               max_height: 200,
           });

        $(confirmBox).css({
            position: 'absolute',
            left: confirmBoxSpecs.x + 'px',
            top: confirmBoxSpecs.y + 'px',
            width: confirmBoxSpecs.width + 'px',
            height: confirmBoxSpecs.height + 'px',
            border: '3px double white',
            'background-color': 'black',
        });

        var messageLabel = document.createElement('div');
        $(messageLabel).css({
            'color': 'white',
            'width': '90%',
            'height': '57.5%',
            'left': '5%',
            'top': '12.5%',
            'font-size': '1.25em',
            'position': 'relative',
            'text-align': 'center',
            'word-wrap': 'break-word',
            'overflow-y': 'auto',
        });
        if (useHTML) {
            $(messageLabel).html(message);
        } else {
            $(messageLabel).text(message);
        }
        var optionButtonDiv = document.createElement('div');
        $(optionButtonDiv).addClass('optionButtonDiv');
        $(optionButtonDiv).css({
            'height': '30%',
            'width': '98%',
            'position': 'absolute',
            'bottom': '0%',
            'right': '2%',
        });

        var confirmButton = document.createElement('button');
        $(confirmButton).css({
            'padding': '1%',
            'border': '1px solid white',
            'width': 'auto',
            'position': 'relative',
            'float': "right",
            'margin-right': '3%',
            'margin-top': '0%',
        });
        buttonText = (!buttonText || buttonText === "") ? "OK" : buttonText;
        $(confirmButton).text(buttonText);
        confirmButton.onclick = function () {
            if (clickAction)
                clickAction();
            removeAll();
        };

        function removeAll() {
            if (noFade) {
                $(overlay).hide();
                $(overlay).remove();
            } else {
                $(overlay).fadeOut(500, function () { $(overlay).remove(); });
            }
        }

        $(optionButtonDiv).append(confirmButton);

        $(confirmBox).append(messageLabel);
        $(confirmBox).append(optionButtonDiv);

        $(overlay).append(confirmBox);
        return overlay;
    }

    return that;
}