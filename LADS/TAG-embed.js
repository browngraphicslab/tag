var TAG_embed = function(tagInput) {
	/**
	 * Embed TAG as an iframe in your site, using the demo.html file as the source.
	 * The tagPath argument is ignored here, but it is included for consistency
	 * with the TAG function.
	 * @param tagPath          ignored
	 * @param tagContainerId   the id of the div in which we'll stick an iframe
	 * @param ip               the ip adress of the server to which we'll connect
	 * @param width
	 */

	// embed iframe in $('#'+tagContainerId)
	var tagPath = tagInput.path,
		tagContainerId = tagInput.containerId,
		ip = tagInput.serverIp,
		hiddenCollections = tagInput.hiddenCollections,
		width = tagInput.width,
		height = tagInput.height,
		container,
		frame,
		frameDoc,
		htmlStr,
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
                                containerId:"'+tagContainerId+'", \
                                serverIp:"'+ip+'", \
                            }); \
						}; \
					</script> \
				</head> \
				<body> \
					<div id="tagContainer" style="margin-left:16px; margin-top:'+(16*9/16)+'px; width:'+(width-32)+'px; height:'+(height-18)+'px;"></div> \
				</body> \
			    </html>';

    frameDoc = frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(htmlStr);
    frameDoc.close();
};