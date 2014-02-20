var TAG_embed = function(tagInput) {
	/**
	 * Embed TAG as an iframe in your site, using the demo.html file as the source.
	 * The tagPath argument is ignored here, but it is included for consistency
	 * with the TAG function.
	 * @param tagInput     object with the following properties:
	 *                       path          relative path from your html file to the TAG directory
	 *                                        (e.g., './a/b/TAG')
	 *                       containerId   the id of the div in which you want to embed TAG
	 *                       serverIp      the ip adress of the server to which you want to connect
	 *                       width         the desired width of TAG
	 *                       height        the desired height of TAG
	 *                       hiddenCollections   a list of collection IDs for published collections to be hidden
	 */

	// embed iframe in $('#'+tagContainerId)
	var tagPath = tagInput.path,
		tagContainerId = tagInput.containerId,
		ip = tagInput.serverIp,
		hiddenCollections = tagInput.hiddenCollections || [],
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
	frame.style.width = width + 'px';
	frame.style.height = height + 'px';
	frame.style.position = 'relative';
	frame.style.border = '0px';
	// frame.style.background = '#222222';
	frameInnerContainer.appendChild(frame);

	// tempImage = document.createElement('img');
	// tempImage.src = tagPath+'images/splash.jpg';
	// tempImage.style.width = '100%';
	// tempImage.style.height= '100%';
	// tempImage.style.position = 'absolute';
	// frameInnerContainer.appendChild(tempImage);
    
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
                                serverIp:"'+ip+'" \
                            }); \
						}; \
					</script> \
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

    // frameDoc.addEventListener('ready', function() {
    // 	frameInnerContainer.innerHTML = '';
    // });

    var mouseWheelHandler=function (evt){
    	evt.stopPropagation();
    	evt.preventDefault();
    }
    if (frame.addEventListener) {
		// IE9, Chrome, Safari, Opera
		frame.addEventListener("mousewheel", mouseWheelHandler, false);
		// Firefox
		frameContainer.addEventListener("DOMMouseScroll", mouseWheelHandler);
	}
	else { // IE 6/7/8
		frame.attachEvent("onmousewheel", mouseWheelHandler);
	}
 
};