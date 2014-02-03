var TAG_embed = function(tagPath, tagContainerId, ip, width, height) {
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
	var container,
		frame,
		frameContainer,
		frameInnerContainer;
	
	if(typeof tagPath !== 'string') {
		console.log('specify a string path to the directory containing TAG');
		return;
	} else if(!tagContainerId || typeof tagContainerId !== 'string') {
		console.log('tagContainerId must be a valid string');
		return;
	}

	container = $('#'+tagContainerId);
	if(!tagContainerId || container.length === 0 || container.width() === 0 || container.height() === 0) {
		console.log('no tagContainerId argument specified, no element with matching id, \
			          or no width/height set on container');
		return;
	}

	if(tagPath && tagPath[tagPath.length - 1] !== '/') {
		tagPath += '/';
	}

	ip = ip || 'browntagserver.com';
	width = width || container.width();
	height = height || container.height();

	frameContainer = $(document.createElement('div')).attr('id', 'frameContainer');
    container.append(frameContainer);

    frameInnerContainer = $(document.createElement('div')).attr('id', 'frameInnerContainer');
    frameContainer.append(frameInnerContainer);

    frame = $(document.createElement('iframe'));
	frame.attr('src', tagPath + 'demo.html');
	frame.css({
		width: '740px',
		height: '460px',
		position: 'relative'
	});
    tagRootInnerContainer.append(frame);

    // alternatively, do something tricky with loading in and change core.js to load in the right size
    frame.contents()
};