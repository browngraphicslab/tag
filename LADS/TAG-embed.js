/**
 * The end user should include this file in their website. Calling TAG_embed
 * with the appropriate inputs will create the TAG embedding in an iframe, using
 * the demo.html file as the iframe source.
 * @class TAG_embed
 * @constructor
 * @param {Object} tagInput              the following property inputs are the properties of tagInput
 * @param {property} path                relative path from your html file to the TAG directory (e.g., './a/b/TAG')
 * @param {property} containerId         the id of the div in which you want to embed TAG
 * @param {property} serverIp            the ip adress of the server to which you want to connect
 * @param {property} width               the desired width of TAG
 * @param {property} height              the desired height of TAG
 * @param {property} allowServerChange   should a button be shown on the splash screen that allows server change?
 * @param {property} hiddenCollections   a list of collection IDs for published collections to be hidden
 * 
 */

var TAG_embed = function(tagInput) {
    // embed iframe in $('#'+tagContainerId)
    var tagPath = tagInput.path,
        tagContainerId = tagInput.containerId,
        ip = tagInput.serverIp,
        hiddenCollections = tagInput.hiddenCollections || [],
        allowServerChange = tagInput.allowServerChange,
        width = tagInput.width,
        height = tagInput.height,
        container,
        frame,
        frameDoc,
        htmlStr,
        tempImage,
        frameContainer,
        frameInnerContainer;
    
    if (typeof tagPath !== 'string') {
        console.log('specify a string path to the directory containing TAG');
        return;
    } else if (!tagContainerId || typeof tagContainerId !== 'string') {
        console.log('tagContainerId must be a valid string');
        return;
    }

    container = document.getElementById(tagContainerId);
    if(!tagContainerId || !container) {
        console.log('no tagContainerId argument specified or no element with matching id');
        return;
    }

    localStorage.invisibleCollectionsTAG = JSON.stringify(tagInput.hiddenCollections);

    // fix input paths without trailing '/'
    if(tagPath && tagPath[tagPath.length - 1] !== '/') {
        tagPath += '/';
    }

    ip = ip || 'browntagserver.com';
    width = parseFloat(width || container.style.width || '740');
    height = parseFloat(height || container.style.height || '460');

    frameContainer = document.createElement('div');
    frameContainer.style.width = width + 'px';
    frameContainer.style.height = height + 'px';
    frameContainer.style.position = 'relative';
    frameContainer.id = 'frameContainer';
    container.appendChild(frameContainer);

    frameInnerContainer = document.createElement('div');
    frameInnerContainer.id = 'frameInnerContainer';
    frameContainer.appendChild(frameInnerContainer);

    frame = document.createElement('iframe');
    frame.setAttribute('allowfullscreen', 'true');
	frame.style.width = width + 'px';
	frame.style.height = height + 'px';
	frame.style.position = 'relative';
	frame.style.border = '0px';
	frameInnerContainer.appendChild(frame);
    
    // write out html of iframe document
    // ideally, we could just put demo.html as the src of the iframe, but
    // we need TAG to load with the correct width/height, so the developer would
    // need to edit demo.html anytime the width changes

    htmlStr =  '<!DOCTYPE html> \
                <html> \
                <head> \
                    <meta charset="utf-8" /> \
                    <title>Touch Art Gallery</title> \
                    <script src="'+tagPath+'TAG.js"></script> \
                    <script> \
                        window.onload = function() { \
                            TAG({ \
                                path:"'+tagPath+'", \
                                containerId:"tagContainer", \
                                serverIp:"'+ip+'", \
                                allowServerChange:'+allowServerChange+' \
                            }); \
                        }; \
                    </script> \
                    <style> \
                        * { \
                            margin: 0px; \
                            padding: 0px; \
                        } \
                    </style> \
                </head> \
                <body> \
                    <div id="tagContainer" style="background:#222222;margin-left:16px;  width:'+(width-32)+'px; height:'+(height-18)+'px;"> \
                    </div> \
                </body> \
                </html>';

    frameDoc = frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(htmlStr);
    frameDoc.close();
    

    var frameDiv = document.getElementById('frameInnerContainer');

    $frameDiv = $(frameDiv);

    var scrollTop = 0,
        bodyLeft = 0;

    $frameDiv.on('mouseenter', function(evt) {
        var origLeft, newLeft, tbodyLeft;

        scrollTop = $(document).scrollTop();
        console.log('scrollTop = '+scrollTop);

        bodyLeft = parseFloat($('body').css('margin-left'));

        origLeft = $(container).offset().left;

        $('body').css({
            'position': 'fixed',
            'margin-top': (-scrollTop)+'px'
        });

        newLeft = $(container).offset().left;
        tbodyLeft = parseFloat($('body').css('margin-left'));

        $('body').css({
            'margin-left': (bodyLeft + origLeft - newLeft)+'px'
        });        

        
    });

    $frameDiv.on('mouseleave', function() {
        $('body').css({
            'position': 'static',
            'margin-top': '0px',
            'margin-left': bodyLeft+'px'
        });

        $(document).scrollTop(scrollTop);
    });
};