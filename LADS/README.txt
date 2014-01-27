Touch Art Gallery (TAG) web app
Version 1.0

To use the TAG webapp, download the TAG project from ________.

In the head section of your html file, include TAG.js.

<!--  HTML  -->
<script src='path_to_TAG/TAG.js'></script>

Wherever you would like TAG to appear in the app, add an empty
div (henceforth referred to as 'the container') to contain TAG.

<!--  HTML  -->
<div id='tagContainer'></div>

The id of the container will be used to place TAG correctly. The
container should have relative or absolute positioning (if neither
is specified, TAG will assign it relative positioning). Specify a
height and width for the container as well:

/**  CSS  **/
#tagContainer {
	height: 540px;
	position: relative;
	width: 960px;
}

TAG will always appear with a 16:9 aspect ratio, regardless of the
size of the container. It will be vertically or horizontally
centered within the container if the container does not have a 16:9
width-height ratio.

The demo.html file contains an example of using the TAG web app.