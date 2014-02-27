LADS.Util.makeNamespace("LADS.TESTS");

LADS.TESTS = (function () {

	var emptyTest = {
		tests: [],
		intervals: []
	};

	/**** TEST SCRIPTS ****/

	function testEnterCollections() {
		runTests(combineTestObjs([
			navigate_to_start,
			start_to_collections,
			collections_to_start,
			{tests: 2, intervals: 2}
		]));
	}

	function testSelectCollections() {
		runTests(combineTestObjs([
			navigate_to_collections,
			pick_random_collection,
			{tests: 1, intervals: 10}
		]));
	}

	function testSelectArtworks() {
		runTests(combineTestObjs([
			navigate_to_collections,
			pick_random_collection,
			pick_random_collection,
			pick_random_artwork,
			{tests: 1, intervals: 10}
		]));
	}


	/**** TEST SCRIPT ACTIONS ****/

	/* navigate from the start screen to the collections view */
	function start_to_collections() {
		return {
			tests: [
				function() {
					highlightTarget($('#overlay'));
					$('#overlay').trigger('click');
				}
			],
			intervals: [
				2000
			]
		};
	}

	/* navigate from the collections view to the start screen */
	function collections_to_start() {
		return {
			tests: [
				function() {
					highlightTarget($('#catalogBackButton'));
					$('#catalogBackButton').trigger('click');
				}
			],
			intervals: [
				2000
			]
		};
	}

	/* pick a random collection from the collections list */
	function pick_random_collection() {
		return {
			tests: [
				function() {
					var collectionClickables = $('.collectionClickable'),
						collection = randElt(collectionClickables);
					if(collection) {
						highlightTarget($(collection));
						$(collection).trigger('click');
					}
				}
			],
			intervals: [
				2000
			]
		};
	}

	/* pick a random artwork tile (make sure it's not already selected) */
	function pick_random_artwork() {
		return {
			tests: [
				function() {
					var artTiles = $('.tile'),
						tile = randElt(artTiles),
						alreadySelected;
					if(!tile) {
						console.log("RETURNING: no artwork tiles yet");
						return;
					}
					alreadySelected = $('.already_selected_in_test');
					while(artTiles.length > 1 && $(tile).hasClass('already_selected_in_test')) {
						tile = randElt(artTiles);
					}
					alreadySelected.removeClass('already_selected_in_test');
					$(tile).addClass('already_selected_in_test');
					highlightTarget($(tile));
					$(tile).trigger('click');
				}
			],
			intervals: [
				1000
			]
		}
	}

	/* navigate to start page */
	function navigate_to_start() {
		return {
			tests: [
				function() {
					LADS.Layout.StartPage(null, function (root) {
			            LADS.Util.UI.slidePageRight(root);
			        }, true);
				}
			],
			intervals: [
				1000
			]
		}
	}

	/* navigate to collections view */
	function navigate_to_collections() {
		return {
			tests: [
				function() {
					var newCatalog = new LADS.Layout.NewCatalog();
    			    $('#overlay').on('click', function(){});
        			LADS.Util.UI.slidePageLeft(newCatalog.getRoot());
        		}
        	],
        	intervals: [
        		1000
        	]
        }
	}


	/**** TESTING SUPPORT FUNCTIONS ****/

	/**
	 * Tests
	 * @param testObj.tests       an array of tests to run
	 * @param testObj.intervals   array of time intervals (ms) between these tests
	 *                            an interval of 0
	 * @return                    "failed" if tests failed (i.e., an error was thrown)
	 */

	function runTests(testObj) {
		var tests = testObj.tests,
			intervals = testObj.intervals;
		// TODO check that tests and intervals are arrays, that they have equal lengths, etc...
		try {
			runTest(0, tests, intervals);
		} catch(e) {
			console.log('error in runTests: '+e.message);
			return "failed";
		}
	}

	/**
	 * Called by runTests, calls a single test, then calls runTest with incremented index
	 */
	function runTest(index, tests, intervals, testNum) {
		testNum = testNum || 1;
		var type;
		if(index < tests.length) {
			type = typeof tests[index];
			setTimeout(function() {
				if(type === "function") {
					console.log("RUNNING TEST #"+testNum);
					tests[index]();
					runTest(index+1, tests, intervals, testNum+1);
				} else if(type === "number" && intervals[index] > 0) { // repeat previous tests[index] commands intervals[index] times
					intervals[index]--;
					runTest(Math.max(0, index - tests[index]), tests, intervals, testNum+1);
				}
			}, type === "function" ? intervals[index] : 0);
		}
	}

	/**
	 * Helper function to concatenate different testing objects
	 * @param testObjs       array of test objects (or functions that will generate test objects) to combine
	 * @return               combined test objects
	 */
	function combineTestObjs(testObjs) {
		// TODO validate input
		if(testObjs.length === 0) {
			return {
				tests: [],
				intervals: []
			};
		}
		var combinedTests = [],
			combinedIntervals = [],
			i,
			currObj;
		for(i=0;i<testObjs.length;i++) {
			currObj = typeof testObjs[i] === 'function' ? testObjs[i]() : testObjs[i];
			combinedTests = combinedTests.concat(currObj.tests);
			combinedIntervals = combinedIntervals.concat(currObj.intervals);
		}
		return {
			tests: combinedTests,
			intervals: combinedIntervals
		};
	}

	/**
	 * Highlight the target of a testing event
	 */
	function highlightTarget(target) {
		var $target = $(target),
			tagname = $target.prop('tagName').toLowerCase(),
			highlightOverlay = $(document.createElement('div')),
			overlayWidth = 30,
			isAbs = ($target.css('position') === 'absolute' || $target.css('position') === 'relative'),
			oldBackgroundColor;

		if(tagname === 'img' || tagname === 'video') {
			oldBackgroundColor = $target.css('background-color');
			$target.css('background-color', 'rgba(255,100,0,0.8)');
			setTimeout(function() {
				$target.css('background-color', oldBackgroundColor);
			}, 1000);
		} else {
			highlightOverlay.css({
				'border-radius': '100px',
				'background-color': 'rgba(255,100,0,0.9)',
				'position': 'absolute',
				'margin-top': isAbs ? '' : '-' + ($target.height()/2 + overlayWidth/2) + 'px',
				'margin-left': isAbs ? '' : ($target.width()/2 - overlayWidth/2) + 'px',
				'top': isAbs ? ($target.height()/2 - overlayWidth) + 'px' : '',
				'left': isAbs ? ($target.width()/2 - overlayWidth) + 'px' : '',
				'opacity': 0,
				'width': overlayWidth+'px',
				'height': overlayWidth+'px'
			});
			$target.append(highlightOverlay);
			highlightOverlay.animate({
				opacity: 1
			}, 20, function() {
				console.log("SHOULD BE A HIGHLIGHT");
				highlightOverlay.animate({
					opacity: 0
				}, 1200, function() {
					highlightOverlay.remove();
				});
			});
		}
		// $(target).css('background-color', 'yellow');
	}

	/**
	 * returns an index in [0, arr.length)
	 * @param arr     array for which we want a random index
	 * @return        random index into array, -1 if arr is empty
	 */
	function randIndex(arr) {
		if(arr.length === 0) {
			return -1;
		} else {
			return Math.floor(Math.random() * arr.length);
		}
	}

	/**
	 * returns random element from input array
	 * @param arr     input array
	 * @return        random element
	 */
	function randElt(arr) {
		var ind;
		console.log("arr.length = "+arr.length);
		if(arr.length === 0) {
			return null;
		} else {
			ind = randIndex(arr);
			console.log('index = '+ind);
			return arr[ind];
		}
	}


	return {
		testEnterCollections: testEnterCollections,
		testSelectCollections: testSelectCollections,
		testSelectArtworks: testSelectArtworks,
		runTests: runTests
	};
})();