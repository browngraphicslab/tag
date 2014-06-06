LADS.Util.makeNamespace("LADS.Authoring.SettingsView");

/*  Creates a SettingsView.  
        startView argument sets the starting setting.  
        This arguent can be "Exhibitions", "Artworks", "Tours",
        or "General Settings".  Undefined/null, etc. goes to General Settings.
        TODO: Use constants instead of strings

        callback is called after the UI is done being created.
        The callback function is passed the setttings view object

        backPage is a function to create the page to go back to (null/undefined goes
        back to the main page).  This function, when called with no arguments,
        should return a dom element that can be provided as an argument to 
        slidePageRight.
        
        startLabelID selects a left label automatically if it matches that id.
        The label will be scrolled to if it is off screen.

    Terminology:
        left label, left container, etc... (anything with left) really refers to the
        middle panel.  It is left ignoring the nav panel.  Anything with right refers
        to the right panel which includes the viewer.

    Notes:
        Use helper functions to avoid massive functions and avoid string comparisons
        for navigating the UI.  
        
        Buttons/anything with click handlers should be created
        in a function that takes a function as an argument to define the click behavior.
        Button creator functions shouldn't try to figure out a button's functionality
        from its name!

        Try to define constants at the top of the function in capitals when possible
        for ease of editing.

        If adding a new nav section create a function to load it that is similar to loadGeneralView(),
        loadTourView(), etc... and name it load____View.  If this section has labels that should be selectable
        on load then it should take some identifier that can be used to select a label.  If you add a label
        and it matches that identifier use the selectLabel() function to visually select (ie. give it a white
        background) and then call load____() to load the right side.

        For any operations that can take long a queue should be used.  These operations
        include adding objects to the DOM as this can take a while sometimes.  
        The queue objects leftQueue and rightQueue represent two separete queues that can
        act independently.  These queues will process events in order, but asynchronously so
        they can be completed in the 'background' (unfortunately JS is still single threaded).
        leftQueue is generally used to add things to the left label container, while rightQueue
        is used to add things to the right panel, but they can be used elsewhere (such as the
        artwork picker in the exhibition view).  Calling .add(fn) adds a function to the queue
        while .clear() clears the queue.  Note that an in progress function will not be canceled
        by .clear().  Additionally, use asynchronous DB calls (supply the callback function) 
        whenever possible.  Combining queues and asynchronous DB calls will result in a much
        smoother experience for the user without UI lockups.  Also note that spinning circles
        should be used when possible to show loading status.
*/
LADS.Authoring.SettingsView = function (startView, callback, backPage, startLabelID) {
    "use strict";

        
    var root = LADS.Util.getHtmlAjax('SettingsView.html'), //Get html from html file

        //get all of the ui elements from the root and save them in variables
        leftLoading = root.find('#setViewLoadingCircle'),
        settingsContainer = root.find('#setViewSettingsContainer'),
        searchContainer = root.find('#setViewSearchContainer'),
        navBar = root.find('#setViewNavBar'),
        searchbar = root.find('#setViewSearchBar'),
        newButton = root.find('#setViewNewButton'),
        secondaryButton = root.find('#setViewSecondaryButton'),
        leftbar = root.find('#setViewLeftBar'),
        leftLabelContainer = root.find('#setViewLeftLabelContainer'),
        rightbar = root.find('#setViewRightBar'),
        viewer = root.find('#setViewViewer'),
        buttonContainer = root.find('#setViewButtonContainer'),
        settings = root.find('#setViewSettingsBar'),
        label = root.find('#setViewLoadingLabel'),
        circle = root.find('#setViewLoadingCircle'),

        // Constants
        VIEWER_ASPECTRATIO = $(window).width() / $(window).height(),
        //Should probably get rid of any hard-coded values here:
        RIGHT_WIDTH = '54', 
        CONTENT_HEIGHT = '92',
        HIGHLIGHT = 'white',
        BUTTON_HEIGHT = '40',
        DEFAULT_SEARCH_TEXT = 'Search...',
        PICKER_SEARCH_TEXT = 'Search by Name, Artist, or Year...',

        // Text for Navagation labels
        NAV_TEXT = {
        general: {
            text: 'General Settings',
            subtext: 'Customize TAG experience'
        },
        exhib: {
            text: 'Collections',
            subtext: 'Create and edit collections'
        },
        art: {
            text: 'Artworks',
            subtext: 'Import and manage artworks'
        },
        media: {
            text: 'Associated Media',
            subtext: 'Manage associated media'
        },
        tour: {
            text: 'Tours',
            subtext: 'Build interactive tours'
        },
        feedback: {
            text: 'Feedback',
            subtext: 'View comments and reports'
        },
    },

    that = {
        getRoot: getRoot,
    },
    
        prevSelectedSetting,
        prevSelectedLeftLabel,
        // These are 'asynchronous' queues to perform tasks
        leftQueue = LADS.Util.createQueue(),
        rightQueue = LADS.Util.createQueue(),
        cancelLastSetting,
        artPickerOpen = false,
        nav = [],
        artworks = [],
        assetUploader,
        mediaMetadata = [],
        numFiles = 0,
        isUploading = false,
        isCreatingMedia = false,
        artworkAssociations = [], // entry i contains the artwork info for the ith associated media
        artworkList = [], // save artworks retrieved from the database
        mediaCheckedIDs = [], // artworks checked in associated media uploading
        mediaUncheckedIDs = [], // artworks unchecked in associated media uploading
        editArt; // enter artwork editor button

    loadHelper();
    if (callback) {
        callback(that);
    }

    function loadHelper(main){

        //Setting up UI:
        var backButton = root.find('#setViewBackButton');
        backButton.attr('src', 'images/icons/Back.svg');

        backButton.mousedown(function () {
            LADS.Util.UI.cgBackColor("backButton", backButton, false);
        });

        backButton.mouseleave(function () {
            LADS.Util.UI.cgBackColor("backButton", backButton, true);
        });

        backButton.click(function () {
            LADS.Auth.clearToken();
            rightQueue.clear();
            leftQueue.clear();
            backButton.off('click');
            if (backPage) {
                var bpage = backPage();
                LADS.Util.UI.slidePageRight(bpage);
            } else {
                LADS.Layout.StartPage(null, function (page) {
                    LADS.Util.UI.slidePageRight(page);
                });
            }
        });

        var topBarLabel = root.find('#setViewTopBarLabel');
        var topBarLabelSpecs = LADS.Util.constrainAndPosition($(window).width(), $(window).height() * 0.08,
        {
            width: 0.4,
            height: 0.9,
        });
        topBarLabel.css({
            'height': topBarLabelSpecs.height + 'px',
            'width': topBarLabelSpecs.width + 'px',
        });
        var fontsize = LADS.Util.getMaxFontSizeEM('Tour Authoring', 0.5, topBarLabelSpecs.width, topBarLabelSpecs.height * 0.8, 0.1);
        topBarLabel.css({ 'font-size': fontsize });
        topBarLabel.text('Authoring Mode');

        //Add text to navigation bar:

        navBar.append(nav[NAV_TEXT.general.text] = createNavLabel(NAV_TEXT.general, loadGeneralView));
        navBar.append(nav[NAV_TEXT.exhib.text] = createNavLabel(NAV_TEXT.exhib, loadExhibitionsView));
        navBar.append(nav[NAV_TEXT.art.text] = createNavLabel(NAV_TEXT.art, loadArtView));
        navBar.append(nav[NAV_TEXT.media.text] = createNavLabel(NAV_TEXT.media, loadAssocMediaView)); // COMMENT!!!!!!!!
        navBar.append(nav[NAV_TEXT.tour.text] = createNavLabel(NAV_TEXT.tour, loadTourView));
        navBar.append(nav[NAV_TEXT.feedback.text] = createNavLabel(NAV_TEXT.feedback, loadFeedbackView));
        searchbar.keyup(function () {
            search(searchbar.val(), '.leftLabel', 'div');
        });
        searchbar.change(function () {
            search(searchbar.val(), '.leftLabel', 'div');
        });

        // Workaround for clear button (doesn't fire a change event...)
        searchbar.mouseup(function () {
            setTimeout(function () {
                search(searchbar.val(), '.leftLabel', 'div');
            }, 1);
        });

        searchbar.attr('placeholder', 'Search...');
        newButton.text('New');
        secondaryButton.text('Video');
        label.text('Loading...');
        circle.attr('src', 'images/icons/progress-circle.gif');

        viewer.css({
            'height': $(window).width() * RIGHT_WIDTH / 100 * 1 / VIEWER_ASPECTRATIO + 'px',
        });

        buttonContainer.css({
            'top': $(window).width() * RIGHT_WIDTH / 100 * 1 / VIEWER_ASPECTRATIO + 'px',
        });
        settings.css({
            'height': getSettingsHeight() + 'px',
        });
        switchView(startView, startLabelID);
    }
    
    // Programatically switch view
    function switchView(view, id) {
        resetLabels('.navContainer');
        switch (view) {
            case "Exhibitions":
                selectLabel(nav[NAV_TEXT.exhib.text]);
                prevSelectedSetting = nav[NAV_TEXT.exhib.text];
                loadExhibitionsView(id);
                break;
            case "Artworks":
                selectLabel(nav[NAV_TEXT.art.text]);
                prevSelectedSetting = nav[NAV_TEXT.art.text];
                loadArtView(id);
                break;
            case "Associated Media": 
                selectLabel(nav[NAV_TEXT.media.text]);
                prevSelectedSetting = nav[NAV_TEXT.media.text];
                loadAssocMediaView(id);
                break;
            case "Tours":
                selectLabel(nav[NAV_TEXT.tour.text]);
                prevSelectedSetting = nav[NAV_TEXT.tour.text];
                loadTourView(id);
                break;
            case "Feedback":
                selectLabel(nav[NAV_TEXT.feedback.text]);
                prevSelectedSetting = nav[NAV_TEXT.feedback.text];
                loadFeedbackView(id);
                break;
            case "General Settings":
            default:
                selectLabel(nav[NAV_TEXT.general.text]);
                prevSelectedSetting = nav[NAV_TEXT.general.text];
                loadGeneralView();
                break;
        }
    }

   

    // Functions that can be called from external sources

    function getRoot() {
        return root;
    }

    // Functions to change layout

    // General Settings Functions

    // Loads the General Settings view
    function loadGeneralView() {
        prepareNextView(false);

        // Add this to our queue so the UI doesn't lock up
        leftQueue.add(function () {
            var label;
            // Add the Splash Screen label and set it as previously selected because its our default
            leftLoading.before(label = selectLabel(createLeftLabel('Splash Screen', null, loadSplashScreen), true));
            prevSelectedLeftLabel = label;
            // Default to loading the splash screen
            loadSplashScreen();
            // Add the Password Settings label
            // As of now this is disabled
            leftLoading.before(createLeftLabel('Password Settings', null, loadPasswordScreen).attr('id', 'password'));
            leftLoading.hide();
        });
        cancelLastSetting = null;
    }

    // Sets up the right side of the UI for the splash screen
    // including the viewer, buttons, and settings container.
    function loadSplashScreen() {
        prepareViewer(true);
        clearRight();

        // Load the start page, the callback will add it to the viewer when its done
        var startPage = new LADS.Layout.StartPage(null, function (startPage) {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.general.text]) {
                return;
            }
            viewer.append(startPage);
            // Don't allow the viewer to be clicked
            preventClickthrough(viewer);
        }, true);

        // Get DB Values
        var alpha = LADS.Worktop.Database.getMuseumOverlayTransparency();
        var overlayColor = LADS.Worktop.Database.getMuseumOverlayColor();
        var name = LADS.Worktop.Database.getMuseumName();
        var loc = LADS.Worktop.Database.getMuseumLoc();
        var info = LADS.Worktop.Database.getMuseumInfo();
        if (name === undefined) {
            name = "";
        }
        if (loc === undefined) {
            loc = "";
        }
        if (info === undefined) {
            info = "";
        }
        var logoColor = LADS.Worktop.Database.getLogoBackgroundColor();

        // Create inputs
        var alphaInput = createTextInput(Math.floor(alpha * 100), true);
        // Touch keyboard breaks everything...
        //verticalSlider(alphaInput, 0, 100);
        var bgImgInput = createButton('Change Image', function () {
            uploadFile(LADS.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                bgImgInput.val(url);
                $('#background').css({
                    'background-image': 'url("' + LADS.Worktop.Database.fixPath(url) + '")',
                    'background-size': 'cover',
                });
            });
        });
        var logoInput = createButton('Change Logo', function () {
            uploadFile(LADS.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                logoInput.val(url);
                $('#logo')[0].src = LADS.Worktop.Database.fixPath(url);
            });
        });
        var overlayColorInput = createBGColorInput(overlayColor, '.infoDiv', function () { return alphaInput.val(); });
        var nameInput = createTextInput(LADS.Util.htmlEntityDecode(name), true, 40);
        var locInput = createTextInput(LADS.Util.htmlEntityDecode(loc), true, 45);
        var infoInput = createTextAreaInput(LADS.Util.htmlEntityDecode(info), true);
        var logoColorInput = createBGColorInput(logoColor, '.logoContainer', function () { return 100; });

        // Handle changes
        onChangeUpdateNum(alphaInput, 0, 100, function (num) {
            updateBGColor('.infoDiv', overlayColorInput.val(), num);
        });
        onChangeUpdateText(nameInput, '#museumName', 40);
        nameInput.keyup(function () {
            startPage.fixText();
        });
        nameInput.keydown(function () {
            startPage.fixText();
        });
        nameInput.change(function () {
            startPage.fixText();
        });
        onChangeUpdateText(locInput, '#subheading', 33);
        onChangeUpdateText(infoInput, '#museumInfo', 300);

        var bgImage = createSetting('Background Image', bgImgInput);
        var overlayAlpha = createSetting('Overlay Transparency (0-100)', alphaInput);
        var overlayColorSetting = createSetting('Overlay Color', overlayColorInput);
        var museumName = createSetting('Museum Name', nameInput);
        var museumLoc = createSetting('Museum Location', locInput);
        var museumInfo = createSetting('Museum Info', infoInput);
        var museumLogo = createSetting('Museum Logo', logoInput);
        var logoColorSetting = createSetting('Museum Logo Background Color', logoColorInput);

        settingsContainer.append(bgImage);
        settingsContainer.append(overlayColorSetting);
        settingsContainer.append(overlayAlpha);
        settingsContainer.append(museumName);
        settingsContainer.append(museumLoc);
        settingsContainer.append(museumInfo);
        settingsContainer.append(museumLogo);
        settingsContainer.append(logoColorSetting);

        // Save button
        var saveButton = createButton('Save Changes', function () {
            if (locInput === undefined) {
                locInput = "";
            }
            if (infoInput === undefined) {
                infoInput = "";
            }
            saveSplashScreen({
                alphaInput: alphaInput,
                overlayColorInput: overlayColorInput,
                nameInput: nameInput,
                locInput: locInput,
                infoInput: infoInput,
                logoColorInput: logoColorInput,
                bgImgInput: bgImgInput,
                logoInput: logoInput,
            });
        }, {
            'margin-right': '3%',
            'margin-top': '1%',
            'margin-bottom': '1%',
            'margin-left': '.5%',
            'float': 'right'
        });

        buttonContainer.append(saveButton);
    }

    // Saves the splash screen settings.  inputs should be the 
    // inputs where the settings are held with the following keys:
    //      alphaInput:         Overlay Transparency
    //      overlayColorInput:  Overlay Color
    //      nameInput:          Museum Name
    //      locInput:           Museum Location
    //      infoInput:          Museum Info
    //      logoColorInput:     Logo background color
    //      bgImgInput:         Background image
    //      logoInput:          Logo image
    function saveSplashScreen(inputs) {
        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);

        var alpha = inputs.alphaInput.val()/100;
        var overlayColor = inputs.overlayColorInput.val();
        var name = inputs.nameInput.val();
        var loc = inputs.locInput.val();
        var info = inputs.infoInput.val().replace('/\n\r?/g', '<br />');
        var logoColor = inputs.logoColorInput.val();
        var bgImg = inputs.bgImgInput.val();
        var logo = inputs.logoInput.val();
      
        var options = {
            Name: name,
            OverlayColor: overlayColor,
            OverlayTrans: alpha,
            Location: loc,
            Info: info,
            IconColor: logoColor,
        };
        if (bgImg) options.Background = bgImg;
        if (logo) options.Icon = logo;

        LADS.Worktop.Database.changeMain(options, function () {
            LADS.Worktop.Database.getMain(loadGeneralView, error(loadGeneralView), null);
            ;
        }, authError, conflict({ Name: 'Main' }, 'Update', loadGeneralView), error(loadGeneralView));
    }

    // Set up the right side of the UI for the  password changer
    function loadPasswordScreen() {
        prepareViewer(false);
        clearRight();

        var loading = createLabel('Loading...');
        var loadingSetting = createSetting('', loading);
        settingsContainer.append(loadingSetting);

        LADS.Worktop.Database.checkSetting('AllowChangePassword', function (val) {
            loadingSetting.remove();
            if (val.toLowerCase() === 'true') {
                var oldInput = createTextInput('', false);
                var newInput1 = createTextInput('', false);
                var newInput2 = createTextInput('', false);
                var msgLabel = createLabel('');

                oldInput.attr('type', 'password');
                newInput1.attr('type', 'password');
                newInput2.attr('type', 'password');

                var old = createSetting('Current Password', oldInput);
                var new1 = createSetting('New Password', newInput1);
                var new2 = createSetting('Confirm New Password', newInput2);
                var msg = createSetting('', msgLabel);

                settingsContainer.append(old);
                settingsContainer.append(new1);
                settingsContainer.append(new2);
                settingsContainer.append(msg);

                //Hide or else unused div covers 'Old Password' line
                buttonContainer.css('display', 'none');

                var saveButton = createButton('Update Password', function () {
                    savePassword({
                        old: oldInput,
                        new1: newInput1,
                        new2: newInput2,
                        msg: msgLabel,
                    });
                });
                // Make the save button respond to enter
                saveButton.removeAttr('type');

                var save = createSetting('', saveButton);
                settingsContainer.append(save);
            } else {
                passwordChangeNotSupported();
            }
        });
    }

    function passwordChangeNotSupported() {
        var label = createLabel('');
        var setting = createSetting('Changing the password has been disabled by the server.  Contact the server administrator for more information', label);
        settingsContainer.append(setting);
    }

    // Updates the new password.  Inputs has the following keys:
    //  old: Old password
    //  new1: New password
    //  new2: New password confirmation
    //  msg:  Message area
    function savePassword(inputs) {
        inputs.msg.text('Processing...');
        if (inputs.new1.val() !== inputs.new2.val()) {
            inputs.msg.text('New passwords do not match.');
        } else {
            LADS.Auth.changePassword(inputs.old.val(), inputs.new1.val(),
                function () {
                    inputs.msg.text('Password Saved.');
                    inputs.old.val('');
                    inputs.new1.val('');
                    inputs.new2.val('');
                },
                function (msg) {
                    if (msg) {
                        inputs.msg.html(msg);
                    } else {
                        inputs.msg.text('Incorrect Password.');
                    }
                },
                function () {
                    inputs.msg.text('There was an error contacting the server.');
                });
        }
    }

    // Exhibition Functions

    // Loads the exhibitions view
    function loadExhibitionsView(id) {
        var cancel = false;
        // Set the new button text to "New"
        prepareNextView(true, "New", createExhibition);
        clearRight();
        prepareViewer(true);

        // Make an async call to get the list of exhibitions
        LADS.Worktop.Database.getExhibitions(function (result) {
            if (cancel) return;
            sortAZ(result);
            $.each(result, function (i, val) {
                if (cancel) return;
                // Add each label as a separate function in the queue
                // So they don't lock up the UI
                leftQueue.add(function () {
                    if (cancel) return;
                    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                        return;
                    }
                    var label;
                    if (!prevSelectedLeftLabel &&
                        ((id && val.Identifier === id) || (!id && i === 0))) {
                        // Select the first one or the specifeid id
                        leftLoading.before(selectLabel(label = createLeftLabel(val.Name, null, function () {
                            loadExhibition(val);
                        }, val.Identifier), true));

                        // Scroll to the selected label if the user hasn't already scrolled somewhere
                        if (leftbar.scrollTop() === 0 && label.offset().top - leftbar.height() > 0) {
                            leftbar.animate({
                                scrollTop: (label.offset().top - leftbar.height())
                            }, 1000);
                        }

                        prevSelectedLeftLabel = label;
                        loadExhibition(val);
                    } else {
                        leftLoading.before(label = createLeftLabel(val.Name, null, function () {
                            loadExhibition(val);
                        }, val.Identifier));
                    }
                    // Hide the label if it doesn't match the current search criteria
                    if (!LADS.Util.searchString(val.Name, searchbar.val())) {
                        label.hide();
                    }
                });
            });
            // Hide the loading label when we're done
            leftQueue.add(function () {
                leftLoading.hide();
            });
        });
        cancelLastSetting = function () { cancel = true; };
    }

    // Set up the right side for an exhibition
    function loadExhibition(exhibition) {
        prepareViewer(true);
        clearRight();

        // Set the viewer to exhibition view (see function below)
        exhibitionView(exhibition);

        // inputs
        var privateState;
        if (exhibition.Metadata.Private) {
            privateState = (/^true$/i).test(exhibition.Metadata.Private);
        } else {
            privateState = false;
        }
        var privateInput = createButton('Unpublish', function () {
            privateState = true;
            privateInput.css('background-color', 'white');
            publicInput.css('background-color', '');
        }, {
            'min-height': '0px',
            'margin-right': '4%',
            'width': '48%',
        });
        var publicInput = createButton('Publish', function () {
            privateState = false;
            publicInput.css('background-color', 'white');
            privateInput.css('background-color', '');
        }, {
            'min-height': '0px',
            'width': '48%',
        });
        if (privateState) {
            privateInput.css('background-color', 'white');
        } else {
            publicInput.css('background-color', 'white');
        }
        var pubPrivDiv = $(document.createElement('div'));
        pubPrivDiv.append(privateInput).append(publicInput);

        var nameInput = createTextInput(LADS.Util.htmlEntityDecode(exhibition.Name), 'Collection name', 40);
        var descInput = createTextAreaInput(LADS.Util.htmlEntityDecode(exhibition.Metadata.Description), false);
        var bgInput = createButton('Change Background Image', function () {
            uploadFile(LADS.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                bgInput.val(url);
                $('#bgimage').css({
                    'background-image': 'url("' + LADS.Worktop.Database.fixPath(url) + '")',
                    'background-size': 'cover',
                });
            });
        });
        var previewInput = createButton('Change Image', function () {
            uploadFile(LADS.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                previewInput.val(url);
                $('#img1')[0].src = LADS.Worktop.Database.fixPath(url);
            });
        });

        nameInput.focus(function () {
            if (nameInput.val() === 'Collection')
                nameInput.select();
        });

        descInput.focus(function () {
            if (descInput.val() === 'Description')
                descInput.select();
        });

        // Handle Changes
        onChangeUpdateText(nameInput, '#exhibition-title', 40);
        onChangeUpdateText(descInput, '#description-text', 1790);

        var privateSetting = createSetting('Change Publish Setting', pubPrivDiv);
        var name = createSetting('Collection Name', nameInput);
        var desc = createSetting('Collection Description', descInput);
        var bg = createSetting('Collection Background Image', bgInput);
        var preview = createSetting('Collection Preview Image', previewInput);

        settingsContainer.append(privateSetting);
        settingsContainer.append(name);
        settingsContainer.append(desc);
        settingsContainer.append(bg);
        settingsContainer.append(preview);

        // Buttons
        var saveButton = createButton('Save Changes', function () {
            if (nameInput.val() === undefined || nameInput.val() === "") {
                nameInput.val("Untitled Collection");
            }
            saveExhibition(exhibition, {
                privateInput: privateState,
                nameInput: nameInput,
                descInput: descInput,
                bgInput: bgInput,
                previewInput: previewInput,
            });
        }, {
            'margin-right': '3%',
            'margin-top': '1%',
            'margin-bottom': '1%',
            'margin-left': '.5%',
            'float': 'right',
        });

        var deleteButton = createButton('Delete Collection', function () {
            deleteExhibition(exhibition);
        }, {
            'margin-left': '2%',
            'margin-top': '1%',
            'margin-right': '0',
            'margin-bottom': '3%',
        });


        var catalogNext = true;
        // Creates the button to toggle between views
        /**
        var switchViewButton = createButton('Preview Catalog', function () {
            viewer.empty();
            if (catalogNext) {
                // If there is no art the program crashes when entering catalog mode
                // Show a message and return if thats the case (would prefer not having
                // to request all the artwork)
                LADS.Worktop.Database.getArtworksIn(exhibition.Identifier, function (artworks) {
                    if (!artworks || !artworks[0]) {
                        var messageBox = LADS.Util.UI.popUpMessage(null, "Cannot view in catalog mode because there is no artwork in this exhibit.", null, true);
                        root.append(messageBox);
                        $(messageBox).show();
                        exhibitionView();
                    } else {
                        switchViewButton.text('Preview Collection');
                        catalogView();
                        catalogNext = !catalogNext;
                    }
                });

                return;
            } else {
                switchViewButton.text('Preview Catalog');
                exhibitionView();
            }
            catalogNext = !catalogNext;
        }, {
            'margin-left': '2%',
            'margin-top': '1%',
            'margin-right': '0%',
            'margin-bottom': '3%',
        });
        */
        var artPickerButton = createButton('Manage Collection', function () {
            LADS.Util.UI.createAssociationPicker(root, "Add and Remove Artworks in this Collection",
                { comp: exhibition, type: 'exhib' },
                'exhib', [{
                    name: 'All Artworks',
                    getObjs: LADS.Worktop.Database.getArtworksAndTours,
                }, {
                    name: 'Artworks in this Collection',
                    getObjs: LADS.Worktop.Database.getArtworksIn,
                    args: [exhibition.Identifier]
                }], {
                    getObjs: LADS.Worktop.Database.getArtworksIn,
                    args: [exhibition.Identifier]
                }, function () {
                    prepareNextView(true, "New", createExhibition);
                    clearRight();
                    prepareViewer(true);
                    loadExhibitionsView(exhibition.Identifier);
                });

        }, {
            'margin-left': '2%',
            'margin-top': '1%',
            'margin-right': '0%',
            'margin-bottom': '3%',
        });

        // Sets the viewer to catalog view
        function catalogView() {
            rightQueue.add(function () {
                var catalog;
                if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                    return;
                }
                LADS.Layout.Catalog(exhibition, null, function (catalog) {
                    viewer.append(catalog.getRoot());
                    catalog.loadInteraction();
                    preventClickthrough(viewer);
                    
                });
            });
        }
        // Sets the viewer to exhibition view
        function exhibitionView(exhibition) {
            rightQueue.add(function () {
                var exhibView = new LADS.Layout.NewCatalog(null, exhibition, viewer);
                var exroot = exhibView.getRoot();
                $(exroot).css('z-index','-1'); // otherwise, you can use the search box and sorting tabs!
                viewer.append(exroot);
                preventClickthrough(viewer);
                //var exhibView = new LADS.Layout.Exhibitions(null, function (exhib) {
                //    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                //        return;
                //    }
                //    viewer.append(exhib.getRoot());
                //    var exhibButton = $('#exhib-' + exhibition.Identifier);
                //    if (exhibButton.length)
                //        clickWhenReady(exhibButton);
                //    else {
                //        exhibView.loadExhibit(exhibition, true);
                //    }
                //    preventClickthrough(viewer);
                //});
            });
        }

        buttonContainer.append(artPickerButton).append(deleteButton).append(saveButton);
    }

    // Create an exhibition
    function createExhibition() {
        prepareNextView(false);
        clearRight();
        prepareViewer(true);

        LADS.Worktop.Database.createExhibition(null, function (newDoq) {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                return;
            }
            if (!newDoq) { // Shouldn't happen!
                // TODO: Error Message
                loadExhibitionsView();
                return;
            }
            loadExhibitionsView(newDoq.Identifier);
        }, authError, error(loadExhibitionsView), true);
    }

    // Save an exhibition where inputs holds
    // the inputs that contain the values with the following keys:
    //      nameInput:      Exhibition Name
    //      sub1Input:      Exhibition subheading 1
    //      sub2Input:      Exhibition subheading 2
    //      descInput:      Exhibition description
    //      bgInput:        Exhibition background image
    //      previewInput:   Exhibition preview image
    //      privateInput
    function saveExhibition(exhibition, inputs) {
        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);

        var name = inputs.nameInput.val();
        //var sub1 = inputs.sub1Input.val();
        //var sub2 = inputs.sub2Input.val();
        var desc = inputs.descInput.val();
        var bg = inputs.bgInput.val();
        var preview = inputs.previewInput.val();
        var priv = inputs.privateInput;

        var options = {
            Name: name,
            //Sub1: sub1,
            //Sub2: sub2,
            Private: priv,
            Description: desc,
        }

        if (bg)
            options.Background = bg;
        if (preview)
            options.Img1 = preview;

        LADS.Worktop.Database.changeExhibition(exhibition.Identifier, options, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                return;
            }
            loadExhibitionsView(exhibition.Identifier);
        }, authError, conflict(exhibition, "Update", loadExhibitionsView), error(loadExhibitionsView));
    }

    // Delete an exhibition
    function deleteExhibition(exhibition) {
        var confirmationBox = LADS.Util.UI.PopUpConfirmation(function () {
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            // actually delete the exhibition
            LADS.Worktop.Database.deleteDoq(exhibition.Identifier, function () {
                if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                    return;
                }
                loadExhibitionsView();
            }, authError, conflict(exhibition, "Delete", loadExhibitionsView), error(loadExhibitionsView));
        }, "Are you sure you want to delete " + exhibition.Name + "?", "Delete", true, function() { $(confirmationBox).hide(); });
        root.append(confirmationBox);
        $(confirmationBox).show();
    }


    // Tour Functions

    // Load the tour view
    function loadTourView(id) {
        prepareNextView(true, "New", createTour);
        clearRight();
        prepareViewer(true);
        var cancel = false;
        // Make an async call to get tours
        LADS.Worktop.Database.getTours(function (result) {
            if (cancel) return;
            sortAZ(result);

            $.each(result, function (i, val) {
                if (cancel) return false;
                // Add each label as a separate function to the queue
                // so the UI doesn't lock up
                leftQueue.add(function () {
                    if (cancel) return;
                    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
                        return;
                    }
                    var label;
                    if (!prevSelectedLeftLabel &&
                        ((id && val.Identifier === id) || (!id && i === 0))) {
                        // Select the first one
                        leftLoading.before(selectLabel(label = createLeftLabel(val.Name, null, function () {
                            loadTour(val);
                        }, val.Identifier, false, function () {
                            editTour(val);
                        }), true));

                        // Scroll to the selected label if the user hasn't already scrolled somewhere
                        if (leftbar.scrollTop() === 0 && label.offset().top - leftbar.height() > 0) {
                            leftbar.animate({
                                scrollTop: (label.offset().top - leftbar.height())
                            }, 1000);
                        }

                        prevSelectedLeftLabel = label;
                        loadTour(val);
                    } else {
                        leftLoading.before(label = createLeftLabel(val.Name, null, function () {
                            loadTour(val);
                        }, val.Identifier, false, function () {
                            editTour(val);
                        }));
                    }
                    // Hide if it doesn't match search criteria
                    if (!LADS.Util.searchString(val.Name, searchbar.val())) {
                        label.hide();
                    }
                });
            });
            // Hide the loading label when we're done
            leftQueue.add(function () {
                leftLoading.hide();
            });
        });
        cancelLastSetting = function () { cancel = true; };
    }

    // Load a tour to the right side
    function loadTour(tour) {
        prepareViewer(true);
        clearRight();

        // Create an img element just to load the image
        var img = $(document.createElement('img'));
        img.attr('src', LADS.Worktop.Database.fixPath(tour.Metadata.Thumbnail));

        // Create a progress circle
        var progressCircCSS = {
            'position': 'absolute',
            'left': '30%',
            'top': '22%',
            'z-index': '50',
            'height': viewer.height() / 2 + 'px',
            'width': 'auto'
        };
        var circle = LADS.Util.showProgressCircle(viewer, progressCircCSS, '0px', '0px', false);
        var selectedLabel = prevSelectedLeftLabel;
        img.load(function () {
            // If the selection has changed since we started loading return
            if (prevSelectedLeftLabel && prevSelectedLeftLabel.text() !== tour.Name) {
                LADS.Util.removeProgressCircle(circle);
                return;
            }
            LADS.Util.removeProgressCircle(circle);
            // Set the image as a background image, centered and contained
            viewer.css('background', 'black url(' + LADS.Worktop.Database.fixPath(tour.Metadata.Thumbnail) + ') no-repeat center / contain');
        });

        // Create inputs
        // inputs
        var privateState;
        if (tour.Metadata.Private) {
            privateState = (/^true$/i).test(tour.Metadata.Private);
        } else {
            privateState = false;
        }
        var privateInput = createButton('Unpublish', function () {
            privateState = true;
            privateInput.css('background-color', 'white');
            publicInput.css('background-color', '');
        }, {
            'min-height': '0px',
            'margin-right': '4%',
            'width': '48%',
        });
        var publicInput = createButton('Publish', function () {
            privateState = false;
            publicInput.css('background-color', 'white');
            privateInput.css('background-color', '');
        }, {
            'min-height': '0px',
            'width': '48%',
        });
        if (privateState) {
            privateInput.css('background-color', 'white');
        } else {
            publicInput.css('background-color', 'white');
        }
        var pubPrivDiv = $(document.createElement('div'));
        pubPrivDiv.append(privateInput).append(publicInput);

        var nameInput = createTextInput(LADS.Util.htmlEntityDecode(tour.Name), true, 120);
        var descInput = createTextAreaInput(LADS.Util.htmlEntityDecode(tour.Metadata.Description).replace(/\n/g,'<br />') || "", false);

        nameInput.focus(function () {
            if (nameInput.val() === 'Untitled Tour')
                nameInput.select();
        });
        descInput.focus(function () {
            if (descInput.val() === 'Tour Description')
                descInput.select();
        });

        // on change behavior
        onChangeUpdateText(descInput, null, 1500); // What should max length be?

        var privateSetting = createSetting('Change Publish Setting', pubPrivDiv);
        var name = createSetting('Tour Name', nameInput);
        var desc = createSetting('Tour Description', descInput);

        settingsContainer.append(privateSetting);
        settingsContainer.append(name);
        settingsContainer.append(desc);


        // Create buttons
        var editButton = createButton('Edit Tour',
            function () { editTour(tour); },
            {
                'margin-left': '2%',
                'margin-top': '1%',
                'margin-right': '0%',
                'margin-bottom': '3%',
            });
        var deleteButton = createButton('Delete Tour',
            function () { deleteTour(tour); },
            {
                'margin-left': '2%',
                'margin-top': '1%',
                'margin-right': '0%',
                'margin-bottom': '3%',
            });
        var duplicateButton = createButton('Duplicate Tour',
            function () {
                duplicateTour(tour, {
                    privateInput: privateState,
                    nameInput: nameInput,
                    descInput: descInput,
                });
            },
            {
                'margin-left': '2%',
                'margin-top': '1%',
                'margin-right': '0%',
                'margin-bottom': '3%',
            });
        var saveButton = createButton('Save Changes',
            function () {
                if (nameInput.val() === undefined || nameInput.val() === "") {
                    nameInput.val() = "Untitled Tour";
                }
                saveTour(tour, {
                    privateInput: privateState,
                    nameInput: nameInput,
                    descInput: descInput,
                });
            }, {
                'margin-right': '3%',
                'margin-top': '1%',
                'margin-bottom': '1%',
                'margin-left': '.5%',
                'float': 'right'
            });

        buttonContainer.append(editButton).append(duplicateButton).append(deleteButton).append(saveButton);
    }

    // Creates a tour
    function createTour() {
        prepareNextView(false);
        clearRight();
        prepareViewer(true);

        LADS.Worktop.Database.createTour(null, function (newDoq) {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
                return;
            }
            if (!newDoq) {
                // TODO: ERROR
                loadTourView();
                return;
            }
            loadTourView(newDoq.Identifier);
        }, authError, error(loadTourView), true);
    }

    // Edit a tour
    function editTour(tour) {
        // Overlay doesn't spin... not sure how to fix without redoing tour authoring to be more async
        loadingOverlay('Loading Tour...');
        leftQueue.clear();
        rightQueue.clear();
        setTimeout(function () {
            var toureditor = new LADS.Layout.TourAuthoringNew(tour, function () {
                LADS.Util.UI.slidePageLeft(toureditor.getRoot());
            });
        }, 1);
    }

    // Delete a tour
    function deleteTour(tour) {
        var confirmationBox = LADS.Util.UI.PopUpConfirmation(function () {
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            // actually delete the exhibition
            LADS.Worktop.Database.deleteDoq(tour.Identifier, function () {
                if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
                    return;
                }
                loadTourView();
            }, authError, conflict(tour, "Delete", loadTourView), error(loadTourView));
        }, "Are you sure you want to delete " + tour.Name + "?", "Delete", true, function () { $(confirmationBox).hide(); });
        root.append(confirmationBox);
        $(confirmationBox).show();
    }

    // Duplicate a tour
    function duplicateTour(tour, inputs) {
        prepareNextView(false);
        clearRight();
        prepareViewer(true);
        var options = {
            Name: "Copy: " + tour.Name,
            Description: tour.Metadata.Description,
            Content: tour.Metadata.Content,
            Thumbnail: tour.Metadata.Thumbnail,
            Private: "true", // always want to create duplicates as unpublished
        };

        LADS.Worktop.Database.createTour(options, function (tewer) {
            console.log("success");
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
                return;
            }
            loadTourView(tewer.Identifier);
        }, function () {
            console.log("error");
        }, function () {
            console.log("cacheError");
        });

        //// first, create a new tour (code lifted from createTour)
        //LADS.Worktop.Database.createTour(function (newDoq) {
        //    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
        //        return;
        //    }
        //    if (!newDoq) {
        //        // TODO: ERROR
        //        loadTourView();
        //        return;
        //    }

        //    // grab the data to be copied from the tour we're duplicating
        //    // not just copying everything because we want the new tour to have a unique identifier, etc...
        //    var name = "Copy: " + tour.Name;
        //    var desc = tour.Metadata.Description;
        //    var content = tour.Metadata.Content;
        //    var relatedArtworks = tour.Metadata.RelatedArtworks;
        //    var thumbnailMeta = tour.Metadata.Thumbnail;
        //    var privateMeta = "true"; // always want to create duplicates as unpublished
        //    var keywords = tour._Keywords;
        //    var thumbnail = tour.Thumbnail;
        //    var type = tour.Type;

        //    // set the XML of the new tour to account for the data above (code lifted from editTour)
        //    LADS.Worktop.Database.getDoqXML(newDoq.Identifier, function (xml) {
        //        var parser = new DOMParser();
        //        var currentXML = $(parser.parseFromString(xml, 'text/xml'));

        //        name = LADS.Util.encodeXML(name);
        //        var desc = inputs.descInput.val().replace(/\n\r?/g, '<br />');

        //        // set the name, etc...
        //        // not sure what keywords, thumbnai, and type do, but set them here for good measure
        //        currentXML.find('Name').text(name);
        //        currentXML.find('_Keywords').text(keywords);
        //        currentXML.find('Thumbnail').text(thumbnail);
        //        currentXML.find('Type').text(type);

        //        // set metadata, most importantly the content of the tour
        //        //getFieldValueFromMetadata(currentXML[0], "Description").data = LADS.Util.encodeXML(desc);
        //        //getFieldValueFromMetadata(currentXML[0], "Content").data = LADS.Util.encodeXML(content);
        //        //getFieldValueFromMetadata(currentXML[0], "RelatedArtworks").data = LADS.Util.encodeXML(relatedArtworks);
        //        //getFieldValueFromMetadata(currentXML[0], "Thumbnail").data = LADS.Util.encodeXML(thumbnailMeta);
        //        //getFieldValueFromMetadata(currentXML[0], "Private").data = LADS.Util.encodeXML(privateMeta);

        //        // Fix escape characters
        //        currentXML.find("d3p1\\:Key:contains('Content') + d3p1\\:Value").text(LADS.Util.encodeXML(currentXML.find("d3p1\\:Key:contains('Content') + d3p1\\:Value").text()));

        //        var privateField = getFieldValueFromMetadata(currentXML[0], "Private");
        //        if (!privateField) {
        //            privateField = addFieldToMetadata(currentXML[0], "Private", LADS.Util.encodeXML(privateMeta));
        //        } else {
        //            privateField.data = LADS.Util.encodeXML(privateMeta);
        //        }

        //        var descriptionField = getFieldValueFromMetadata(currentXML[0], "Description");
        //        if (!descriptionField) {
        //            descriptionField = addFieldToMetadata(currentXML[0], "Description", desc);
        //        } else {
        //            descriptionField.data = LADS.Util.encodeXML(desc);
        //        }

        //        var contentField = getFieldValueFromMetadata(currentXML[0], "Content");
        //        if (!contentField) {
        //            contentField = addFieldToMetadata(currentXML[0], "Content", content);
        //        } else {
        //            contentField.data = LADS.Util.encodeXML(content);
        //        }

        //        var relatedField = getFieldValueFromMetadata(currentXML[0], "RelatedArtworks");
        //        if (!relatedField) {
        //            relatedField = addFieldToMetadata(currentXML[0], "RelatedArtworks", relatedArtworks);
        //        } else {
        //            relatedField.data = LADS.Util.encodeXML(relatedArtworks);
        //        }

        //        var thumbnailField = getFieldValueFromMetadata(currentXML[0], "Thumbnail");
        //        if (!thumbnailField) {
        //            thumbnailField = addFieldToMetadata(currentXML[0], "Thumbnail", thumbnailMeta);
        //        } else {
        //            thumbnailField.data = LADS.Util.encodeXML(thumbnailMeta);
        //        }

        //        LADS.Worktop.Database.pushXML(currentXML[0], newDoq.Identifier, "Tour", function () {
        //            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
        //                return;
        //            }
        //            loadTourView(newDoq.Identifier);
        //        }, authError, authError);
        //    });
        //}, authError, authError);

    }

    // Save a tour where inputs contains the inputs with the values
    // expected keys are:
    //      nameInput: Name of the tour
    //      descInput: Description of the tour
    //      privateInput
    function saveTour(tour, inputs) {
        var name = inputs.nameInput.val();
        var desc = inputs.descInput.val();

        if (name.indexOf(' ') === 0) {
            var messageBox = LADS.Util.UI.popUpMessage(null, "Tour Name cannot start with a space.", null, true);
            $(root).append(messageBox);
            $(messageBox).show();
            return;
        }

        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);

        LADS.Worktop.Database.changeTour(tour.Identifier, {
            Name: name,
            Description: desc,
            Private: inputs.privateInput,
        }, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
                return;
            }
            loadTourView(tour.Identifier);
        }, authError, conflict(tour, "Update", loadTourView), error(loadTourView));
    }

    // Associated Media functions

    // Save an associated media with input data. The inputs parameter has:
    //      titleInput:     media title
    //      descInput:    media description
    function saveAssocMedia(media, inputs) {
        var name = inputs.titleInput.val();
        var desc = inputs.descInput.val();
        //desc = desc === "Description" ? "" : desc; // TODO do this using placeholders instead of this hacky thing

        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);

        LADS.Worktop.Database.changeHotspot(media, {
            Name: name,
            Description: desc,
        }, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.media.text]) {
                return;
            }
            loadAssocMediaView(media.Identifier);
        }, authError, conflict(media, "Update", loadAssocMediaView), error(loadAssocMediaView));
    }

    // Brings up an artwork chooser -- check the boxes of the art
    function assocToArtworks(media) {
        artworkAssociations = [[]];
        numFiles = 1;
        // chooseAssociatedArtworks(media);
        LADS.Util.UI.createAssociationPicker(root, "Choose artworks", { comp: media, type: 'media' }, "artwork", [{
            name: "All Artworks",
            getObjs: LADS.Worktop.Database.getArtworks
        }], {
            getObjs: LADS.Worktop.Database.getArtworksAssocTo,
            args: [media.Identifier]
        }, function () { });
    }

    function loadAssocMediaView(id) {
        prepareNextView(true, "Import", createAsset);
        prepareViewer(true);
        clearRight();
        var cancel = false;

        // Make an async call to get artworks
        LADS.Worktop.Database.getAssocMedia(function (result) {
            if (cancel) return;
            sortAZ(result);
            console.log('media in hand');
            if (result[0] && result[0].Metadata) {
                $.each(result, function (i, val) {
                    if (cancel) return;
                    // Add each label in a separate function in the queue
                    // so the UI doesn't lock up
                    leftQueue.add(function () {
                        if (cancel) return;
                        if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.media.text]) {
                            return;
                        }
                        var label;
                        var imagesrc;
                        switch (val.Metadata.ContentType.toLowerCase()) {
                            case 'video':
                                imagesrc = (val.Metadata.Thumbnail && !val.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(val.Metadata.Thumbnail) : 'images/video_icon.svg';
                                break;
                            case 'audio':
                                imagesrc = 'images/audio_icon.svg';
                                break;
                            case 'image':
                                imagesrc = val.Metadata.Thumbnail ? LADS.Worktop.Database.fixPath(val.Metadata.Thumbnail) : 'images/image_icon.svg';
                                break;
                            default:
                                imagesrc = null;
                                break;
                        }
                        if (!prevSelectedLeftLabel &&
                            ((id && val.Identifier === id) || (!id && i === 0))) {
                            // Select the first one
                            leftLoading.before(selectLabel(label = createLeftLabel(val.Name, imagesrc, function () {
                                loadAssocMedia(val);
                            }, val.Identifier, false), true));

                            // Scroll to the selected label if the user hasn't already scrolled somewhere
                            if (leftbar.scrollTop() === 0 && label.offset().top - leftbar.height() > 0) {
                                leftbar.animate({
                                    scrollTop: (label.offset().top - leftbar.height())
                                }, 1000);
                            }

                            prevSelectedLeftLabel = label;
                            loadAssocMedia(val);
                        } else {
                            leftLoading.before(label = createLeftLabel(val.Name, imagesrc, function () {
                                loadAssocMedia(val);
                            }, val.Identifier, false));
                        }
                        // Hide if it doesn't match search criteria
                        if (!LADS.Util.searchString(val.Name, searchbar.val())) {
                            label.hide();
                        }
                    });
                });
                // Hide the loading label when we're done
                leftQueue.add(function () {
                    leftLoading.hide();
                });
            } else {
                leftLoading.hide();
            }
        });
        cancelLastSetting = function () { cancel = true; };
    }

    // Loads an artwork to the right side
    function loadAssocMedia(media) {
        prepareViewer(true);
        clearRight();

        // Create an img element to load the image
        var type = media.Metadata.ContentType.toLowerCase();
        var holder;
        var source = LADS.Worktop.Database.fixPath(media.Metadata.Source);
        switch (type) {
            case "image":
                holder = $(document.createElement('img'));
                break;
            case "video":
                holder = $(document.createElement('video'));
                holder.attr('id', 'videoInPreview');
                holder.attr('poster', (media.Metadata.Thumbnail && !media.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(media.Metadata.Thumbnail) : '');
                holder.attr('identifier', media.Identifier);
                holder.attr("preload", "none");
                holder.attr("controls", "");
                holder.css({ "width": "100%", "max-width": "100%", "max-height": "100%" });
                holder[0].onerror = LADS.Util.videoErrorHandler(holder, viewer);
                break;
            case "audio":
                holder = $(document.createElement('audio'));
                holder.attr("preload", "none");
                holder.attr("controls", "");
                holder.css({ 'width': '80%' });
                break;
            case "text":
            default:
                holder = $(document.createElement('div'));
                holder.css({
                    "font-size": "24px",
                    "top": "20%",
                    "width": "80%",
                    //"margin-left": "10%",
                    "text-align": "center",
                    "color": "white"
                });
                holder.html(media.Name + "<br /><br />" + media.Metadata.Description);
                break;
        }
        (source && type !== 'text') && holder.attr('src', source);

        // Create a progress circle
        var progressCircCSS = {
            'position': 'absolute',
            'left': '40%',
            'top': '40%',
            'z-index': '50',
            'height': 'auto',
            'width': '20%'
        };
        var circle = LADS.Util.showProgressCircle(viewer, progressCircCSS, '0px', '0px', false);
        var selectedLabel = prevSelectedLeftLabel;

        switch (type) {
            case "image":
                holder.load(function () {
                    // If the selection has changed since we started loading then return
                    if (prevSelectedLeftLabel && prevSelectedLeftLabel.text() !== media.Name) {
                        LADS.Util.removeProgressCircle(circle);
                        return;
                    }
                    LADS.Util.removeProgressCircle(circle);
                    // Set the image as a background image
                    viewer.css('background', 'black url(' + source + ') no-repeat center / contain');
                });
                break;
            case "video":
                LADS.Util.removeProgressCircle(circle);
                viewer.css('background', 'black');
                viewer.append(holder);
                break;
            case "audio":
                LADS.Util.removeProgressCircle(circle);
                viewer.css('background', 'black');
                //center the the audio element in the viewer
                viewer.append(holder);
                var left = viewer.width() / 2 - holder.width() / 2 + "px";
                var top = viewer.height() /2 - holder.height() /2 + "px";
                holder.css({ "position": "absolute", "left": left, "top" : top });
                break;
            case "text":
                LADS.Util.removeProgressCircle(circle);
                viewer.css({ 'background': 'black'});
                viewer.append(holder);
                var left = viewer.width() / 2 - holder.width() / 2 + "px";
                var top = viewer.height() / 2 - holder.height() / 2 + "px";
                holder.css({ "position": "absolute", "left": left, "top": top });
                break;
            default:
                LADS.Util.removeProgressCircle(circle);
                viewer.css('background', 'black');
                break;
        }

        // Create labels
        var titleInput = createTextInput(LADS.Util.htmlEntityDecode(media.Name) || "", true, 55);
        var descInput = createTextAreaInput(LADS.Util.htmlEntityDecode(media.Metadata.Description).replace(/\n/g,'<br />') || "", true);

        titleInput.focus(function () {
            if (titleInput.val() === 'Title')
                titleInput.select();
        });
        descInput.focus(function () {
            if (descInput.val() === 'Description')
                descInput.select();
        });

        var title = createSetting('Title', titleInput);
        var desc = createSetting('Description', descInput);

        settingsContainer.append(title);
        settingsContainer.append(desc);

        // Create buttons
        var assocButton = createButton('Associate to Artworks',
            function () { assocToArtworks(media); },
            {
                'float': 'left',
                'margin-left': '2%',
                'margin-top': '1%',
                'margin-right': '0%',
                'margin-bottom': '3%',
            });
        var deleteButton = createButton('Delete',
            function () {
                var confirmationBox = LADS.Util.UI.PopUpConfirmation(function () {
                    prepareNextView(false);
                    clearRight();
                    prepareViewer(true);

                    // stupid way to force associated artworks to increment their linq counts and refresh their lists of media
                    LADS.Worktop.Database.changeHotspot(media.Identifier, { Name: media.Name }, function () {
                        // success handler
                        LADS.Worktop.Database.deleteDoq(media.Identifier, function () {
                            console.log("deleted");
                            loadAssocMediaView();
                        }, function () {
                            console.log("noauth error");
                        }, function () {
                            console.log("conflict error");
                        }, function () {
                            console.log("general error");
                        });
                    }, function () {
                        // unauth handler
                    }, function () {
                        // conflict handler
                    }, function () {
                        // error handler
                    });
                }, "Are you sure you want to delete " + media.Name + "?", "Delete", true, function () { $(confirmationBox).hide(); });
                root.append(confirmationBox);
                $(confirmationBox).show();
                 },
            {
                'margin-left': '2%',
                'margin-top': '1%',
                'margin-right': '0%',
                'margin-bottom': '3%',
                'float': 'left',
            });

        var generateAssocMediaThumbnailButton = createButton('Generate Thumbnail',
            function () {
                generateAssocMediaThumbnail(media);
            }, {
                'margin-right': '0%',
                'margin-top': '1%',
                'margin-bottom': '1%',
                'margin-left': '2%',
                'float': 'left'
            });

        var saveButton = createButton('Save Changes',
            function () {
                if (titleInput.val() === undefined || titleInput.val() === "") {
                    titleInput.val("Untitled Asset");
                }
                saveAssocMedia(media, {
                    titleInput: titleInput,
                    descInput: descInput
                });
            }, {
                'margin-right': '3%',
                'margin-top': '1%',
                'margin-bottom': '1%',
                'margin-left': '.5%',
                'float': 'right'
            });

        var thumbnailButton = createButton('Capture Thumbnail',
            function () {
                saveThumbnail(media, false);
            }, {
                'margin-right': '0%',
                'margin-top': '1%',
                'margin-bottom': '3%',
                'margin-left': '2%',
                'float': 'left'
            });

        buttonContainer.append(assocButton);
        if (media.Metadata.ContentType.toLowerCase() === 'video') {
            buttonContainer.append(thumbnailButton);
        } else if (media.Metadata.ContentType.toLowerCase() === 'image' && !media.Metadata.Thumbnail && media.Metadata.Source[0] === '/' && !source.match(/.mp3/)) {
            // hacky way to see if asset was imported recently enough to support thumbnailing (these are /Images/_____.__
            // rather than http:// _______/Images/_______.__
            buttonContainer.append(generateAssocMediaThumbnailButton);
        }
        buttonContainer.append(deleteButton).append(saveButton);
    }

    function generateAssocMediaThumbnail(media) {
        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);
        LADS.Worktop.Database.changeHotspot(media.Identifier, { Thumbnail: 'generate' }, function () {
            //$("#" + media.Identifier).find('img')[0].src = LADS.Worktop.Database.fixPath(media.Metadata.Source);
            console.log('success?');
            loadAssocMediaView(media.Identifier);
        }, unauth, conflict, error);
    }

    function loadAssociatedMedia_OLD() {
        secondaryButton.css("display","none");
        prepareNextView(true, "Batch Upload Media", createMedia);
        leftQueue.add(function () {
            leftLoading.hide();
        });
    }

    //
    function createAsset() {
        uploadFile(LADS.Authoring.FileUploadTypes.AssociatedMedia, function (urls, names, contentTypes, files) {
            var check, i, url, name, done = 0, total = urls.length, durations = [];
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            if(files.length > 0) {
                durationHelper(0);
            }

            function durationHelper(j) {
                if (contentTypes[j] === 'Video') {
                    files[j].properties.getVideoPropertiesAsync().done(function (VideoProperties) {
                        durations.push(VideoProperties.duration / 1000); // duration in seconds
                        updateDoq(j);
                    }, function (err) {
                        console.log(err);
                    });
                } else if (contentTypes[j] === 'Audio') {
                    files[j].properties.getMusicPropertiesAsync().done(function (MusicProperties) {
                        durations.push(MusicProperties.duration / 1000); // duration in seconds
                        updateDoq(j);
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    durations.push(null);
                    updateDoq(j);
                }
            }

            function incrDone() {
                done++;
                if (done >= total) {
                    loadAssocMediaView();
                } else {
                    durationHelper(done);
                }
            }

            function updateDoq(j) {
                var newDoq;
                try {
                    newDoq = new Worktop.Doq(urls[j]);
                    var options = {Name: names[j]};
                    if (durations[j]) {
                        options.Duration = durations[j];
                    }
                    LADS.Worktop.Database.changeHotspot(newDoq.Identifier, options, incrDone, LADS.Util.multiFnHandler(authError, incrDone), LADS.Util.multiFnHandler(conflict(newDoq, "Update", incrDone)), error(incrDone));
                } catch (error) {
                    done++;
                    console.log("error in uploading: " + error.message);
                    return;
                }
                


                //var newDoq;
                //try {
                //    var options = {
                //        Name: names[j],
                //        ContentType: contentTypes[j],
                //        Source: urls[j]
                //    };
                //    if (durations[j]) {
                //        options.Duration = durations[j];
                //    }
                //    LADS.Worktop.Database.createHotspot(options, incrDone, function () { console.log("error1") }, function () { console.log("error2") }, newDoq);
                //} catch (error) {
                //    done++;
                //    console.log("error in uploading: " + error.message);
                //    return;
                //}
                //LADS.Worktop.Database.changeArtwork(newDoq.Identifier, { Name: names[j] }, incrDone, function () { console.log("error1") }, function () { console.log("error2") }, function () { console.log("error3") });
            }

            //for (i = 0; i < urls.length; i++) {
            //    updateDoq(i);
            //}
        }, true, ['.jpg', '.png', '.gif', '.tif', '.tiff', '.mp4', '.mp3']);
    }

    // Create an associated media (import) --- possibly more than one
    function createMedia() {
        batchAssMedia();
    }

    function batchAssMedia() {
        var uniqueUrls = []; // Used to make sure we don't override data for the wrong media (not actually airtight but w/e)
        mediaMetadata = [];
        artworkAssociations = [];
        numFiles = 0;
        isUploading = true;
        assetUploader = LADS.Authoring.FileUploader( // multi-file upload now
            root,
            LADS.Authoring.FileUploadTypes.AssociatedMedia,
            function (files, localURLs) { // localCallback
                var file, localURL, i;
                var img, video, audio;
                var contentType;
                numFiles = files.length;
                for (i = 0; i < files.length; i++) {
                    artworkAssociations.push([]);
                    file = files[i];
                    localURL = localURLs[i];
                    if (file.contentType.match(/image/)) {
                        contentType = 'Image';
                    } else if (file.contentType.match(/video/)) {
                        contentType = 'Video';
                    } else if (file.contentType.match(/audio/)) {
                        contentType = 'Audio';
                    }
                    uniqueUrls.push(localURL);
                    mediaMetadata.push({
                        'title': file.displayName,
                        'contentType': contentType,
                        'localUrl': localURL,
                        'assetType': 'Asset',
                        'assetLinqID': undefined,
                        'assetDoqID': undefined
                    });
                }
            },
            function (dataReaderLoads) { // finished callback: set proper contentUrls, if not first, save it
                var i, dataReaderLoad;
                for (i = 0; i < dataReaderLoads.length; i++) {
                    dataReaderLoad = dataReaderLoads[i];
                    mediaMetadata[i].contentUrl = dataReaderLoad;
                }

                // chooseAssociatedArtworks(); // need to send in media objects here TODO
            },
            ['.jpg', '.png', '.gif', '.tif', '.tiff', '.mp4', '.mp3'], // filters
            false, // useThumbnail
            null, // errorCallback
            true // multiple file upload enabled?
        );
    }

    // Creates the art picker for a given media
    function chooseAssociatedArtworks(media) {
        var i;

        // Overlay over the whole page
        var overlay = $(document.createElement('div'));
        overlay.css({
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'top': '0',
            'left': '0',
            'background-color': 'rgba(0,0,0,0.5)',
            'z-index': '1000',
            'display': 'block'
        });

        // Container for the picker
        var container = $(document.createElement('div'));
        container.css({
            'height': '70%',
            'width': '50%',
            'position': 'absolute',
            'top': '15%',
            'left': '25%',
            'background-color': 'black',
            'border': '3px double white',
            'padding': '2%',
        });

        // Title for the picker
        var label = $(document.createElement('div'));
        label.css({
            'font-size': '180%',
            'color': 'white',
            'margin-bottom': '2%',
            'height': '10%',
        });
        label.text('Choose artworks to associate to.');

        var searchInput = $(document.createElement('input'));
        searchInput.attr('type', 'text');
        searchInput.css({
        });
        searchInput.keyup(function () {
            searchData(searchInput.val(), '.artPickerButton');
        });
        searchInput.change(function () {
            searchData(searchInput.val(), '.artPickerButton');
        });
        // Workaround for clear button (doesn't fire a change event...)
        searchInput.mouseup(function () {
            setTimeout(function () {
                searchData(searchInput.val(), '.artPickerButton');
            }, 1);
        });
        searchInput.attr('placeholder', PICKER_SEARCH_TEXT);

        // Art section of the picker
        var art = $(document.createElement('div'));
        art.css({
            'height': '72%',
            'overflow': 'auto',
            'margin-bottom': '2%',
        });

        // Container for the art inside the art section
        var artContainer = $(document.createElement('div'));
        artContainer.css({
            'padding': '1%',
        });

        // Container for buttons/loading/saving indicator
        var buttonContainer = $(document.createElement('div'));
        buttonContainer.css({
            'height': '8%',
        });

        // Loading/saving indicator
        var loadingContainer = $(document.createElement('div'));
        loadingContainer.css({
            'width': '20%',
            'display': 'inline-block',
        });

        // Loading/saving text
        var loading = $(document.createElement('label'));
        loading.css({
            'color': 'white',
            'font-size': '140%',
        });
        loading.text('Loading...');

        var circle = $(document.createElement('img'));
        circle.attr('src', 'images/icons/progress-circle.gif');
        circle.css({
            'height': $(document).height() * 0.03 + 'px',
            'width': 'auto',
            'float': 'right',
        });

        var save = $(document.createElement('button'));
        save.attr('type', 'button');
        save.text('Save');
        save.css({
            'float': 'right',
            'margin': '2%',
            'padding': '1%',
        });

        var cancel = $(document.createElement('button'));
        cancel.attr('type', 'button');
        cancel.text('Cancel');
        cancel.css({
            'float': 'right',
            'margin': '2%',
            'padding': '1%',
        });

        // Hide and remove the overlay when cancel is clicked
        cancel.click(function () {
            overlay.hide();
            root[0].removeChild(overlay[0]);
            artPickerOpen = false;
        });

        art.append(artContainer);

        loadingContainer.append(loading);
        loadingContainer.append(circle);

        buttonContainer.append(loadingContainer);
        buttonContainer.append(cancel);
        buttonContainer.append(save);

        container.append(label);
        container.append(searchInput);
        container.append(art);
        container.append(buttonContainer);

        overlay.append(container);

        root.append(overlay);

        var origMediaCheckedIDs;
        mediaCheckedIDs = [];
        mediaUncheckedIDs = [];
        artworkList = [];
        callAll();
        //LADS.Worktop.Database.getAssocMediaTo(media.Identifier, function (artworks) {
        //    console.log("artworks.length = " + artworks.length);
        //    $.each(artworks, function (i, artwork) { console.log(artwork.Name) });
        //    callAll();
        //}, function () {
        //    console.log("error");
        //}, function() {
        //    console.log("cache error");
        //});
        

        // Get all artworks
        function callAll() {
            LADS.Worktop.Database.getArtworks(setUpButtons, null, null);
        }

        // set up buttons and checkboxes in picker, populate mediaCheckedIDs
        function setUpButtons(allArtworks) {
            sortAZ(allArtworks);
            artworkList = allArtworks;
            // Add each artwork to the artwork container.
            $.each(allArtworks, function (i, artwork) {
                leftQueue.add(function () {
                    var label, index;
                    // check if media is associated to this artwork

                    artContainer.append(label = createArtButton(artwork,
                        // Oncheck/uncheck function
                        // If it is checked adds the artwork to the checkedIDs and
                        // removes it from the uncheckedIDs.  If unchecked it removes it
                        // from the checkedIDs and adds it to the uncheckedIDs
                        function (checked) {
                            if (checked) {
                                if (mediaCheckedIDs.indexOf(i) === -1) {
                                    mediaCheckedIDs.push(i);
                                }
                                index = mediaUncheckedIDs.indexOf(i);
                                if (index !== -1) {
                                    mediaUncheckedIDs.splice(index, 1);
                                }
                            } else {
                                index = mediaCheckedIDs.indexOf(i);
                                if (index !== -1) {
                                    mediaCheckedIDs.splice(index, 1);
                                }
                                if (mediaUncheckedIDs.indexOf(i) === -1) {
                                    mediaUncheckedIDs.push(i);
                                }
                            }
                            // Set the initial checked/unchecked value
                        }, $.inArray(i, mediaCheckedIDs) !== -1));
                    // Hide if it doesn't match search criteria
                    searchData(searchInput.val(), label);
                });
            });
            // Hide loading when we're done
            leftQueue.add(function () {
                loadingContainer.hide();
            });

        }

        // Hide save/cancel buttons, clear the left queue, and change Loading to Saving...
        save.click(function () {
            var j;
            loading.text('Saving...');
            loadingContainer.show();
            save.hide();
            cancel.hide();
            leftQueue.clear();
            var len = media ? 1 : numFiles;
            // Save the art
            for (i = 0; i < len; i++) {
                for (j = 0; j < mediaCheckedIDs.length; j++) {
                    artworkAssociations[i].push(artworkList[mediaCheckedIDs[j]]);
                }
            }

            createAssociations(media, artworkAssociations[0], 0, overlay); // for now, don't worry about multiple media

            //saveAssMedia(0);
            //overlay.hide();
            //root[0].removeChild(overlay[0]);
        });
    }

    // adds media as an associated media of each artwork in artworks
    function createAssociations(media, artworks, index, overlay) {
        LADS.Worktop.Database.changeArtwork(artworks[index].Identifier, {
            AddIDs: media.Identifier
        }, function () {
            if (index < artworks.length - 1) {
                createAssociations(media, artworks, index + 1, overlay)
            } else {
                overlay.hide();
                root[0].removeChild(overlay[0]);
            }
        }, authError, conflict(media, "Update", loadAssocMediaView), error(loadAssocMediaView));
    }

    function saveAssMedia(i) {
        var len = artworkAssociations[i].length;
        uploadHotspotHelper(i, 0, len);
    }

    /**
     * Uploads hotspot i to artwork j in its list of artworks to associate to.
     * @param i    the index of the asset we're uploading
     * @param j    each asset has a list of artworks it'll be associated with; j is the index in this list
     * @param len  the length of the list above
     */
    function uploadHotspotHelper(i, j, len) {
        // uploads hotspot hotspot i to artwork j in its list
        var activeMM = mediaMetadata[i];
        uploadHotspot(artworkAssociations[i][j], { // this info isn't changing, so maybe we can do this more easily in uploadHotspot
            title: LADS.Util.encodeXML(activeMM.title || 'Untitled media'),
            desc: LADS.Util.encodeXML(''),
            pos: null, // bogus entry for now -- should set it to {x: 0, y: 0} in uploadHotspot
            contentType: activeMM.contentType,
            contentUrl: activeMM.contentUrl,
            assetType: activeMM.assetType,
            metadata: {
                assetLinqID: activeMM.assetLinqID,
                assetDoqID: activeMM.assetDoqID
            }
        },
        i, j, len);
    }

    function uploadHotspot(artwork, info, i, j, len) {
        var title = info.title,
            desc = info.desc,
            pixel = info.pos,
            contentType = info.contentType,
            contentUrl = info.contentUrl,
            assetType = info.assetType,
            worktopInfo = info.metadata || {},
            dzPos = pixel ? zoomimage.viewer.viewport.pointFromPixel(pixel) : { x: 0, y: 0 },
            rightbarLoadingSave;

        var options = {
            Name: title,
            ContentType: contentType,
            Duration: duration,
            Source: contentUrl,
            LinqTo: artwork.Identifier,
            X: dzPos.x,
            Y: dzPos.y,
            LinqType: assetType,
            Description: desc
        };

        LADS.Worktop.Database.createHotspot(artwork.CreatorID, artwork.Identifier, createHotspotHelper);

        function createHotspotHelper(isNewAsset, xmlHotspot) { // currently for creating both hotspots and assoc media
            var $xmlHotspot,
                hotspotId,
                hotspotContentId,
                hotspotContentDoq,
                $hotspotContentDoq,
                titleField,
                metadata,
                descField,
                contentTypeField,
                sourceField,
                position;
            $xmlHotspot = $(xmlHotspot);
            hotspotId = $xmlHotspot.find("Identifier").text();
            hotspotContentId = $xmlHotspot.find("BubbleContentID:last").text();
            hotspotContentDoq = $.parseXML(LADS.Worktop.Database.getDoqXML(hotspotContentId));
            $hotspotContentDoq = $(hotspotContentDoq);
            // update doq info and send back to server
            titleField = $hotspotContentDoq.find('Name').text(title);
            metadata = $hotspotContentDoq.find('Metadata');
            descField = metadata.find("d3p1\\:Key:contains('Description') + d3p1\\:Value").text(desc);
            contentTypeField = metadata.find("d3p1\\:Key:contains('ContentType') + d3p1\\:Value").text(contentType);
            sourceField = metadata.find("d3p1\\:Key:contains('Source') + d3p1\\:Value").text(contentUrl);
            position = $xmlHotspot.find('Offset > d2p1\\:_x').text(dzPos.x); // why is position getting reset?
            position = $xmlHotspot.find('Offset > d2p1\\:_y').text(dzPos.y);
            //add linq type : Hotspot vs. Asset
            $xmlHotspot.find("d3p1\\:Key:contains('Type') + d3p1\\:Value").text(assetType);
            LADS.Worktop.Database.pushLinq(xmlHotspot, hotspotId);
            LADS.Worktop.Database.pushXML(hotspotContentDoq, hotspotContentId);
            if (j < len - 1) {
                uploadHotspotHelper(i, j + 1, len);
            }
            else if (j === len - 1 && i < numFiles - 1) {
                saveAssMedia(i + 1);
            }
            else {
                isUploading = false;
                isCreatingMedia = false;
                //$topProgressDiv.css("visibility", "hidden");
            }
        }
    }

    // Art Functions

    // Loads art labels
    function loadArtView(id) {
        prepareNextView(true, "Import", createArtwork);
        //secondaryButton.css("display", "block");
        //secondaryButton.off('click');
        //secondaryButton.on('click', function () {
        //    uploadFile(LADS.Authoring.FileUploadTypes.VideoArtwork, function (urls, names) {
        //        var check, i, url, name, done = 0, total = urls.length;
        //        prepareNextView(false);
        //        clearRight();
        //        prepareViewer(true);

        //        function incrDone() {
        //            done++;
        //            if (done >= total) {
        //                loadArtView();
        //            }
        //        }

        //        function updateDoq(j) {
        //            var newDoq;
        //            try {
        //                newDoq = new Worktop.Doq(urls[j]);
        //            } catch (error) {
        //                done++;
        //                console.log("error in uploading: " + error.message);
        //                return;
        //            }
        //            LADS.Worktop.Database.changeArtwork(newDoq.Identifier, { Name: names[j] }, incrDone, LADS.Util.multiFnHandler(authError, incrDone), LADS.Util.multiFnHandler(conflict(newDoq, "Update", incrDone)), error(incrDone));
        //        }

        //        for (i = 0; i < urls.length; i++) {
        //            updateDoq(i);
        //        }
        //    }, true,['.mp4']);
        //});
        prepareViewer(true);
        clearRight();
        var cancel = false;

        // Make an async call to get artworks
        LADS.Worktop.Database.getArtworks(function (result) {
            if (cancel) return;
            sortAZ(result);
            if (result[0] && result[0].Metadata) {
                $.each(result, function (i, val) {
                    if (cancel) return;
                    // Add each label in a separate function in the queue
                    // so the UI doesn't lock up
                    val.Name = LADS.Util.htmlEntityDecode(val.Name);
                    leftQueue.add(function () {
                        if (cancel) return;
                        if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.art.text]) {
                            return;
                        }
                        var label;
                        var imagesrc;
                        switch (val.Metadata.Type) {
                            case 'Artwork':
                                imagesrc = LADS.Worktop.Database.fixPath(val.Metadata.Thumbnail);
                                break;
                            case 'VideoArtwork':
                                imagesrc = val.Metadata.Thumbnail ? LADS.Worktop.Database.fixPath(val.Metadata.Thumbnail) : "images/video_icon.svg";
                                break
                            default:
                                imagesrc = null;
                        }
                        if (!prevSelectedLeftLabel &&
                            ((id && val.Identifier === id) || (!id && i === 0))) {
                            // Select the first one
                            leftLoading.before(selectLabel(label = createLeftLabel(val.Name, imagesrc, function () {
                                loadArtwork(val);
                            }, val.Identifier, false, function () {
                                editArtwork(val);
                            }, true, val.Extension), true));

                            // Scroll to the selected label if the user hasn't already scrolled somewhere
                            if (leftbar.scrollTop() === 0 && label.offset().top - leftbar.height() > 0) {
                                leftbar.animate({
                                    scrollTop: (label.offset().top - leftbar.height())
                                }, 1000);
                            }

                            prevSelectedLeftLabel = label;
                            loadArtwork(val);
                        } else {
                            leftLoading.before(label = createLeftLabel(val.Name, imagesrc, function () {
                                loadArtwork(val);
                            }, val.Identifier, false, function () {
                                editArtwork(val);
                            }, true, val.Extension));
                        }
                        // Hide if it doesn't match search criteria
                        if (!LADS.Util.searchString(val.Name, searchbar.val())) {
                            label.hide();
                        }
                    });
                });
                // Hide the loading label when we're done
                leftQueue.add(function () {
                    leftLoading.hide();
                });
            } else {
                leftLoading.hide();
            }
        });

        cancelLastSetting = function () { cancel = true; };
    }

    // Loads an artwork to the right side
    function loadArtwork(artwork) {
        prepareViewer(true);
        clearRight();

        // Create an img element to load the image
        var mediaElement;
        if (artwork.Metadata.Type !== 'VideoArtwork') {
            mediaElement = $(document.createElement('img'));
            mediaElement.attr('src', LADS.Worktop.Database.fixPath(artwork.URL));
        } else {
            mediaElement = $(document.createElement('video'));
            mediaElement.attr('id', 'videoInPreview');
            mediaElement.attr('poster', (artwork.Metadata.Thumbnail && !artwork.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(artwork.Metadata.Thumbnail) : '');
            mediaElement.attr('identifier', artwork.Identifier);
            mediaElement.attr("preload", "none");
            mediaElement.attr("controls", "");
            mediaElement.css({ "width": "100%", "max-width": "100%", "max-height": "100%" });
            mediaElement.attr('src', LADS.Worktop.Database.fixPath(artwork.Metadata.Source));
            mediaElement[0].onerror = LADS.Util.videoErrorHandler(mediaElement, viewer);
        }

        // Create a progress circle
        var progressCircCSS = {
            'position': 'absolute',
            'left': '40%',
            'top': '40%',
            'z-index': '50',
            'height': 'auto',
            'width': '20%'
        };
        var circle;
        if (artwork.Metadata.Type !== 'VideoArtwork') {
            circle = LADS.Util.showProgressCircle(viewer, progressCircCSS, '0px', '0px', false);
        }
        var selectedLabel = prevSelectedLeftLabel;

        if (artwork.Metadata.Type !== 'VideoArtwork') {
            mediaElement.load(function () {
                // If the selection has changed since we started loading then return
                if (prevSelectedLeftLabel && prevSelectedLeftLabel.text() !== artwork.Name) {
                    LADS.Util.removeProgressCircle(circle);
                    return;
                }
                LADS.Util.removeProgressCircle(circle);
                // Set the image as a background image
                viewer.css('background', 'black url(' + LADS.Worktop.Database.fixPath(artwork.URL) + ') no-repeat center / contain');
            });
        } else {
            viewer.append(mediaElement);
        }

        // Create labels
        // BM - Whoever wrote this... sigh
        //function checkForLongName(d) {
        //    if (d.length > 55)
        //        return d.substr(0, 55) + "...";
        //    return d;
        //}
        var titleInput = createTextInput(LADS.Util.htmlEntityDecode(artwork.Name), true, 55);
        var artistInput = createTextInput(LADS.Util.htmlEntityDecode(artwork.Metadata.Artist), true, 55);
        var yearInput = createTextInput(LADS.Util.htmlEntityDecode(artwork.Metadata.Year), true, 20);
        var descInput = createTextAreaInput(LADS.Util.htmlEntityDecode(artwork.Metadata.Description).replace(/\n/g, '<br />') || "", "", false);
        var customInputs = {};
        var customSettings = {};

        if (artwork.Metadata.InfoFields) {
            $.each(artwork.Metadata.InfoFields, function (key, val) {
                customInputs[key] = createTextInput(LADS.Util.htmlEntityDecode(val), true);
                customSettings[key] = createSetting(key, customInputs[key]);
            });
        }

        titleInput.focus(function () {
            if (titleInput.val() === 'Title')
                titleInput.select();
        });
        artistInput.focus(function () {
            if (artistInput.val() === 'Artist')
                artistInput.select();
        });
        yearInput.focus(function () {
            if (yearInput.val() === 'Year')
                yearInput.select();
        });
        descInput.focus(function () {
            if (descInput.val() === 'Description')
                descInput.select();
        });

        var title = createSetting('Title', titleInput);
        var artist = createSetting('Artist', artistInput);
        var year = createSetting('Year', yearInput);
        var desc = createSetting('Description', descInput);

        settingsContainer.append(title);
        settingsContainer.append(artist);
        settingsContainer.append(year);
        settingsContainer.append(desc);

        $.each(customSettings, function (key, val) {
            settingsContainer.append(val);
        });

        // Create buttons
        editArt = createButton('Enter Artwork Editor',
            function () { editArtwork(artwork); },
            {
                'margin-left': '2%',
                'margin-top': '1%',
                'margin-right': '0%',
                'margin-bottom': '3%',
            });
        editArt.attr("id", "artworkEditorButton");
        var deleteArt = createButton('Delete Artwork',
            function () { deleteArtwork(artwork); },
            {
                'margin-left': '2%',
                'margin-top': '1%',
                'margin-right': '0%',
                'margin-bottom': '3%',
            });
        var saveButton = createButton('Save Changes',
            function () {
                if (titleInput.val() === undefined || titleInput.val() === "") {
                    titleInput.val("Untitled Artwork");
                }
                saveArtwork(artwork, {
                    artistInput: artistInput,
                    nameInput: titleInput,
                    yearInput: yearInput,
                    descInput: descInput,
                    customInputs: customInputs,
                });
            }, {
                'margin-right': '3%',
                'margin-top': '1%',
                'margin-bottom': '1%',
                'margin-left': '.5%',
                'float': 'right'
            });

        var thumbnailButton = createButton('Capture Thumbnail',
            function () {
                saveThumbnail(artwork, true);
            }, {
                'margin-right': '0%',
                'margin-top': '1%',
                'margin-bottom': '1%',
                'margin-left': '2%',
                'float': 'left'
            });
        if (artwork.Metadata.Type !== 'VideoArtwork') {
            buttonContainer.append(editArt).append(deleteArt).append(saveButton);
        } else {
            buttonContainer.append(thumbnailButton).append(deleteArt).append(saveButton);
        }
    }

    function saveThumbnail(component, isArtwork) {
        var id = $('#videoInPreview').attr('identifier');
        var pop = Popcorn('#videoInPreview');
        var time = $('#videoInPreview')[0].currentTime;
        var dataurl = pop.capture({ type: 'jpg' }); // modified popcorn.capture a bit to
        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);
        LADS.Worktop.Database.uploadImage(dataurl, function (imageURL) {
            if (isArtwork) {
                LADS.Worktop.Database.changeArtwork(id, { Thumbnail: imageURL }, function () {
                    console.log("success?");
                    loadArtView(component.Identifier);
                }, unauth, conflict, error);
            
            } else { // here, it must be a video assoc media
                LADS.Worktop.Database.changeHotspot(id, { Thumbnail: imageURL }, function () {
                    console.log("success?");
                    loadAssocMediaView(component.Identifier);
                }, unauth, conflict, error);
            }
        }, unauth, error);
    }

    function unauth() {
        dialogOverlay.hide();
        var popup = LADS.Util.UI.popUpMessage(null, "Thumbnail not saved.  You must log in to save changes.");
        $('body').append(popup);
        $(popup).show();
    }

    function conflict(jqXHR, ajaxCall) {
        ajaxCall.force();
    }

    function error() {
        dialogOverlay.hide();
        var popup = LADS.Util.UI.popUpMessage(null, "Thumbnail not saved.  There was an error contacting the server.");
        $('body').append(popup);
        $(popup).show();
    }

    // Create an artwork (import) --- possibly more than one artwork
    function createArtwork() {
        uploadFile(LADS.Authoring.FileUploadTypes.DeepZoom, function (urls, names, contentTypes, files) {
            var check, i, url, name, done=0, total=urls.length, durations=[];
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            function incrDone() {
                done++;
                if (done >= total) {
                    loadArtView();
                } else {
                    durationHelper(done);
                }
            }

            //////////
            if (files.length > 0) {
                durationHelper(0);
            }

            function durationHelper(j) {
                if (contentTypes[j] === 'Video') {
                    files[j].properties.getVideoPropertiesAsync().done(function (VideoProperties) {
                        durations.push(VideoProperties.duration / 1000); // duration in seconds
                        updateDoq(j);
                    }, function (err) {
                        console.log(err);
                    });
                } else {
                    durations.push(null);
                    updateDoq(j);
                }
            }
            ///////////

            function updateDoq(j) {
                var newDoq;
                try {
                    newDoq = new Worktop.Doq(urls[j]);
                } catch (error) {
                    done++;
                    console.log("error in uploading: " + error.message);
                    return;
                }
                var ops = { Name: names[j] };
                if (durations[j]) {
                    ops.Duration = durations[j];
                }
                LADS.Worktop.Database.changeArtwork(newDoq.Identifier, ops, incrDone, LADS.Util.multiFnHandler(authError, incrDone), LADS.Util.multiFnHandler(conflict(newDoq, "Update", incrDone)), error(incrDone));
            }

            //for (i = 0; i < urls.length; i++) {
            //    updateDoq(i);
            //}
        }, true, ['.jpg', '.png', '.gif', '.tif', '.tiff', '.mp4']);
    }

    // Edits an artwork
    function editArtwork(artwork) {
        // Overlay doesn't spin... not sure how to fix without redoing tour authoring to be more async
        loadingOverlay('Loading Artwork...');
        leftQueue.clear();
        rightQueue.clear();
        setTimeout(function () {
            LADS.Util.UI.slidePageLeft((new LADS.Layout.ArtworkEditor(artwork)).getRoot());
        }, 1);
    }

    // Deletes an artwork
    function deleteArtwork(artwork) {
        var confirmationBox = LADS.Util.UI.PopUpConfirmation(function () {
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            // actually delete the artwork
            LADS.Worktop.Database.deleteDoq(artwork.Identifier, function () {
                if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.art.text]) {
                    return;
                }
                loadArtView();
            }, authError, authError);
        }, "Are you sure you want to delete " + artwork.Name + "?", "Delete", true, function () { $(confirmationBox).hide() });
        root.append(confirmationBox);
        $(confirmationBox).show();
    }

    // Save an artwork with input data. The inputs parameter has:
    //      titleInput:     artwork title
    //      artistInput:    artwork artist
    //      yearInput:      artwork year
    //      customInputs:   artwork custom info fields
    function saveArtwork(artwork, inputs) {
        var name = inputs.nameInput.val();
        var artist = inputs.artistInput.val();
        var year = inputs.yearInput.val();
        var description = inputs.descInput.val();
        //description = (description === 'Description') ? "" : description;

        var infoFields = {};
        $.each(inputs.customInputs, function (key, val) {
            infoFields[key] = val.val();
        });

        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);
        
        LADS.Worktop.Database.changeArtwork(artwork, {
            Name: name,
            Artist: artist,
            Year: year,
            Description: description,
            InfoFields: JSON.stringify(infoFields),
        }, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.art.text]) {
                return;
            }
            loadArtView(artwork.Identifier);
        }, authError, conflict(artwork, "Update", loadArtView), error(loadArtView)); 
    }

    // Feedback Functions
    function loadFeedbackView(id) {
        prepareNextView(true, "");
        prepareViewer(false);
        clearRight();

        var cancel = false;
        // Make an async call to get feedback
        LADS.Worktop.Database.getFeedback(function (result) {
            if (cancel) return;
            sortDate(result);

            $.each(result, function (i, val) {
                if (cancel) return false;
                // Add each label as a separate function to the queue
                // so the UI doesn't lock up
                leftQueue.add(function () {
                    if (cancel) return;
                    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.feedback.text]) {
                        return;
                    }
                    var label;
                    var text = $.datepicker.formatDate('(m/dd/yy) ', new Date(val.Metadata.Date * 1000)) + val.Metadata.Feedback;
                    if (!prevSelectedLeftLabel &&
                        ((id && val.Identifier === id) || (!id && i === 0))) {
                        // Select the first one
                        leftLoading.before(selectLabel(label = createLeftLabel(text, null, function () {
                            loadFeedback(val);
                        }, val.Identifier, true)));

                        // Scroll to the selected label if the user hasn't already scrolled somewhere
                        if (leftbar.scrollTop() === 0 && label.offset().top - leftbar.height() > 0) {
                            leftbar.animate({
                                scrollTop: (label.offset().top - leftbar.height())
                            }, 1000);
                        }

                        prevSelectedLeftLabel = label;
                        loadFeedback(val);
                    } else {
                        leftLoading.before(label = createLeftLabel(text, null, function () {
                            loadFeedback(val);
                        }, val.Identifier, true));
                    }
                    // Hide if it doesn't match search criteria
                    if (!LADS.Util.searchString(text, searchbar.val())) {
                        label.hide();
                    }
                });
            });
            // Hide the loading label when we're done
            leftQueue.add(function () {
                leftLoading.hide();
            });
        });
        cancelLastSetting = function () { cancel = true; };
    }

    function loadFeedback(feedback) {
        clearRight();
        prepareViewer(true, feedback.Metadata.Feedback);

        var sourceLabel = createLabel('Loading...');
        var dateLabel = createLabel($.datepicker.formatDate('DD, MM d, yy ', new Date(feedback.Metadata.Date * 1000)));
        //if (feedback.Metadata.SourceID) {
        //    var sourceButton = createButton('Go To Source', function () {
        //        followSource(feedback);
        //    });
        //}

        var source = createSetting('Submitted From', sourceLabel);
        //if (feedback.Metadata.SourceID) {
        //    var sourceButtonSetting = createSetting('', sourceButton);
        //}
        var dateSetting = createSetting('Date', dateLabel);

        settingsContainer.append(source);
        var sourceType = feedback.Metadata.SourceType === "Exhibition" ? "Collection" : feedback.Metadata.SourceType;
        if (feedback.Metadata.SourceID) {
            getSourceName(feedback, function (sourceName) {
                sourceLabel.text(sourceName + ' (' + sourceType + ')');
                var sourceButton = createButton(sourceName + ' (' + sourceType + ')', function () {
                    followSource(feedback);
                });
                var sourceSetting = createSetting('Submitted From', sourceButton);
                source.remove();
                dateSetting.prepend(sourceSetting);
            }, function (sourceName) {
                sourceLabel.text(sourceName + ' (' + sourceType + ', Deleted)');
            }, function () {
                sourceLabel.text('Deleted');
            });
        } else {
            sourceLabel.text(sourceType + " Page (No " + sourceType + " Selected)");
        }
        settingsContainer.append(dateSetting);

        var deleteButton = createButton('Delete Feedback', function () {
            deleteFeedback(feedback);
        },
        {
            'margin-left': '2%',
            'margin-top': '1%',
            'margin-right': '0%',
            'margin-bottom': '3%',
        });

        buttonContainer.append(deleteButton);
    }

    function getSourceName(feedback, onSuccess, onDeleted, onError) {
        LADS.Worktop.Database.getDoq(feedback.Metadata.SourceID,
            function (doq) {
                if (doq.Metadata.Deleted) {
                    onDeleted(doq.Name);
                } else {
                    onSuccess(doq.Name);
                }
            }, function () {
                onError();
            });
    }

    function followSource(feedback) {
        switch (feedback.Metadata.SourceType) {
            case "Exhibition":
            case "Exhibitions":
                switchView("Exhibitions", feedback.Metadata.SourceID);
                break;
            case "Tour":
            case "Tours":
                switchView("Tours", feedback.Metadata.SourceID);
                break;
            case "Art":
            case "Artwork":
            case "Artworks":
                switchView("Artworks", feedback.Metadata.SourceID);
                break;
        }
    }

    function deleteFeedback(feedback) {
        prepareNextView(false);
        clearRight();

        // actually delete the exhibition
        LADS.Worktop.Database.deleteDoq(feedback.Identifier, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.feedback.text]) {
                return;
            }
            loadFeedbackView();
        }, authError, conflict(feedback), error(loadFeedbackView));
    }

    // Sets up the left side for the next view
    //  showSearch: if true show the search bar, otherwise hide it
    //  newText: Text for the new button
    //  newBehavior: onclick function for the new button
    function prepareNextView(showSearch, newText, newBehavior, loadingText) {
        leftQueue.clear();
        leftLabelContainer.empty();
        leftLabelContainer.append(leftLoading);
        leftLoading.show();
        secondaryButton.css("display", "none");
        newButton.text(newText);
        newButton.unbind('click').click(newBehavior);
        if (!newText) newButton.hide();
        else newButton.show();
        prevSelectedLeftLabel = null;
        if (cancelLastSetting) cancelLastSetting();

        if (loadingText) {
            leftLoading.children('label').text(loadingText);
        } else {
            leftLoading.children('label').text('Loading...');
        }

        if (showSearch) {
            searchContainer.show();
            searchContainer.css('display', 'inline-block');
            searchbar.val("");
        } else {
            searchContainer.hide();
        }
    }

    // Clears the right side
    function clearRight() {
        settingsContainer.empty();
        buttonContainer.empty();
        rightQueue.clear();
    }

    // Clears the viewer
    function prepareViewer(showViewer, text) {
        viewer.empty();
        viewer.css('background', 'black');
        if (showViewer) {
            viewer.show();
            buttonContainer.css({
                'top': $(window).width() * RIGHT_WIDTH / 100 * 1 / VIEWER_ASPECTRATIO + 'px',
                'margin-top': '0.35%',
            });
            settings.css({
                'height': getSettingsHeight() + 'px',
            });
            if (text) {
                var textbox = $(document.createElement('textarea'));
                if (typeof text == 'string')
                    text = text.replace(/<br \/>/g, '\n').replace(/<br>/g, '\n').replace(/<br\/>/g, '\n');
                textbox.val(text);
                textbox.css({
                    //'color': TEXT_COLOR,
                    //'border-color': INPUT_BORDER,
                    'padding': '.5%',
                    'width': '100%',
                    'height': '100%',
                    'box-sizing': 'border-box',
                    'margin': '0px',
                });
                textbox.attr('readonly', 'true');
                viewer.append(textbox);
                viewer.css('background', 'transparent');
            } else {
                viewer.css('background', 'black');
            }
        } else {
            viewer.hide();
            buttonContainer.css({
                'top': leftbar.width() * 0.05 + 'px',
                'margin-top': '0',
            });
            settings.css({
                'height': ($(window).height() * CONTENT_HEIGHT / 100) -
                    (BUTTON_HEIGHT * 1) + 'px',
            });
        }
    }

    // Clicks an element determined by a jquery selector when it is
    // added to the page
    function clickWhenReady(selector, maxtries, tries) {
        doWhenReady(selector, function (elem) { elem.click(); }, maxtries, tries);
    }

    // Calls fn with selector when the element determined by the selector
    // is added to the page
    function doWhenReady(selector, fn, maxtries, tries) {
        maxtries = maxtries || 100;
        tries = tries || 0;
        if (tries > maxtries) return;
        if ($.contains(document.documentElement, $(selector)[0])) {
            fn($(selector));
        } else {
            rightQueue.add(function () {
                doWhenReady(selector, fn, maxtries, tries + 1);
            });
        }
    }

    // Resets mouse interaction for labels
    function resetLabels(selector) {
        $(selector).css('background', 'transparent');
        $.each($(selector), function (i, current) {
            if ($(current).attr('disabled') === 'disabled')
                return;
            $(current).mousedown(function () {
                $(current).css({
                    'background': HIGHLIGHT
                });
            });
            $(current).mouseup(function () {
                $(current).css({
                    'background': 'transparent'
                });
            });
            $(current).mouseleave(function () {
                $(current).css({
                    'background': 'transparent'
                });
            });
        });
    }

    // Selects a label unbinding mouse events
    function selectLabel(label, expand) {
        label.css('background', HIGHLIGHT);
        label.unbind('mousedown').unbind('mouseleave').unbind('mouseup');

        if (expand) {
            label.css('height', '');
            label.children('div').css('white-space', '');

            if (prevSelectedLeftLabel) {
                //prevSelectedLeftLabel.css('height', LEFT_LABEL_HEIGHT + 'px');
                prevSelectedLeftLabel.children('div').css('white-space', 'nowrap');
            }
        }
        return label;
    }

    // Disables a label, unbinding mouse events
    function disableLabel(label) {
        label.css({
            'color': 'gray',
        });
        label.unbind('mousedown').unbind('mouseleave').unbind('mouseup').unbind('click').attr('disabled', true);
        return label;
    }


    function createNavLabel(text, onclick) {
        var container = $(document.createElement('div'));
        container.attr('class', 'navContainer');
        container.attr('id', 'nav-' + text.text);
        container.css({
            //'background': 'transparent',
            //'color': TEXT_COLOR,
            //'margin-top': '2%',
            //'padding-top': '4%',
            //'padding-bottom': '4%',
        });
        container.mousedown(function () {
            container.css({
                'background': HIGHLIGHT
            });
        });
        container.mouseup(function () {
            container.css({
                'background': 'transparent'
            });
        });
        container.mouseleave(function () {
            container.css({
                'background': 'transparent'
            });
        });
        container.click(function () {
            // If a label is clicked return if its already selected.
            if (prevSelectedSetting === container)
                return;
            // Reset all labels and then select this one
            resetLabels('.navContainer');
            selectLabel(container);
            // Do the onclick function
            if (onclick)
                onclick();
            prevSelectedSetting = container;
        });

        var navtext = $(document.createElement('label'));
        navtext.attr('class','navtext');
        navtext.css({
            //'font-size': NAVBAR_FONTSIZE,
            //'display': 'block',
            //'margin-left': '6.95%',
            //'margin-top': '0.372%',
        });
        navtext.text(text.text);

        var navsubtext = $(document.createElement('label'));
        navsubtext.attr('class','navsubtext');
        navsubtext.css({
            //'font-size': NAVBAR_SUBFONTSIZE,
            //'display': 'block',
            //'margin-left': '7.65%',
            //'margin-top': '0.372%',
        });
        navsubtext.text(text.subtext);

        container.append(navtext);
        container.append(navsubtext);
        return container;
    }

   
    // Creates a left label with
    //      text:       the text of the label
    //      imagesrc:   src for the image.  If not specified then no image is added
    //      onclick:    function to do on click
    //      id:         id to set if specified
    function createLeftLabel(text, imagesrc, onclick, id, noexpand, onDoubleClick, inArtMode, extension) {
        var container = $(document.createElement('div'));
        text = LADS.Util.htmlEntityDecode(text);
        container.attr('class', 'leftLabel');
        if (id) {
            container.attr('id', id);
        }
       // container.css({
            //'height': LEFT_LABEL_HEIGHT + 'px',
            //'min-height': LEFT_LABEL_HEIGHT + 'px',
            //'padding-left': '2%',
            //'padding-top': '2%',
            //'padding-bottom': '2%',
            //'margin-right': '3.2%',
            //'margin-bottom': '3%',
            //'overflow': 'hidden',
            //'position': 'relative',
        //});

        if (inArtMode) {
            if(extension.match(/mp4/)) {
                container.data('isVideoArtwork', true);
            } else {
                container.data('isStaticArtwork', true);
            }
        }

        container.mousedown(function () {
            container.css({
                'background': HIGHLIGHT
            });
        });
        container.mouseup(function () {
            container.css({
                'background': 'transparent'
            });
        });
        container.mouseleave(function () {
            container.css({
                'background': 'transparent'
            });
        });
        container.click(function () {
            if (prevSelectedLeftLabel == container)
                return;
            if (prevSelectedLeftLabel.attr('id') === 'password'){
                buttonContainer.css('display','block');
            }
            resetLabels('.leftLabel');
            selectLabel(container, !noexpand);
            if (onclick)
                onclick();
            prevSelectedLeftLabel = container;
        });
        if (onDoubleClick) {
            container.dblclick(onDoubleClick);
        }
        var width;
        if (imagesrc) {
            var image = $(document.createElement('img'));
            image.attr('src', imagesrc);
            image.css({
                'height': 'auto',
                'width': '20%',
                'margin-right': '5%',
            });
            container.append(image);
            

            var progressCircCSS = {
                'position': 'absolute',
                'left': '5%',
                'z-index': '50',
                'height': 'auto',
                'width': '10%',
                'top': '20%',
            };
            var circle = LADS.Util.showProgressCircle(container, progressCircCSS, '0px', '0px', false);
            image.load(function () {
                LADS.Util.removeProgressCircle(circle);
            });
            width = '75%';
        } else {
            width = '95%';
        }

        var label = $(document.createElement('div'));
        label.attr('class', 'labelText');
        label.css({
            //'font-size': LEFT_FONTSIZE,
            //'display': 'inline-block',
            //'white-space': 'nowrap',
            'width': width,
            //'overflow': 'hidden',
            //'text-overflow': 'ellipsis',
            //'vertical-align': 'top',
            //'word-wrap': 'break-word',
        });

        if (!imagesrc) {
            label.css({
                'padding-top': '0.4%',
                'padding-left': '1.3%',
            });
        }
        label.text(text);

        container.append(label);

        return container;
    }

    // Gets the height of the settings section
    // Since the viewer has to be positioned absolutely,
    // the entire right bar needs to be position absolutely.
    // Settings has bottom: 0, so the height needs to be correct
    // to not have this be under the buttons container.  If any
    // of the heights of the right components changes it should be
    // updated here.
    function getSettingsHeight() {
        var height =
        // Start with the entire height of the right side
        ($(window).height() * CONTENT_HEIGHT / 100) -
        // Subtract:
        (
            // Height of the viewer
            $(window).width() * RIGHT_WIDTH / 100 * 1 / VIEWER_ASPECTRATIO +
            // Height of the button container
            BUTTON_HEIGHT * 1 +
            // Height of the padding of the button container
            $(window).width() * RIGHT_WIDTH / 100 * 0.0285
        );
        return height;
    }

    // Creates a setting to be inserted into the settings container
    //  text:       text for the setting
    //  input:      the input for the setting
    //  width: if not-falsey then assumed to be a number (ex. 75) representing the pecent, must be less than 95
    function createSetting(text, input, width) {
        var container = $(document.createElement('div'));
        container.attr('class', 'settingLine');
        container.css({
            //'width': '100%',
            //'margin-bottom': '4%',
        });

        var label = $(document.createElement('div'));
        label.css({
            //'font-size': SETTING_FONTSIZE,
            'width': width ? 45 - (width - 50) + '%' : '45%',
            //'overflow': 'hidden',
            //'text-overflow': 'ellipsis',
            //'font-style': 'italic',
            //'display': 'inline-block',
        });
        label.text(text);
        label.attr('class', 'labelText');

        if (width) {
            width = width + '%';
        } else {
            width = '50%';
        }
        input.attr('class', 'settingInput');
        input.css({
            'width': width,
            //'font-size': INPUT_FONTSIZE,
            //'float': 'right',
            //'margin-right': '3%',
            //'box-sizing': 'border-box',
        });

        var clear = $(document.createElement('div'));
        clear.css('clear', 'both');

        container.append(label);
        container.append(input);
        container.append(clear);

        return container;
    }

    // Creates the settings container where settings are inserted
    function createSettingsContainer() {
        var container = $(document.createElement('div'));
        container.css({
            'margin-left': '2%',
            'margin-top': '3%',
            'margin-bottom': '3%',
            'margin-right': '0%',
        });
        return container;
    }

    // Creates a button with text set to 'text', on click
    // function set to onclick, and additional css applied if specified
    function createButton(text, onclick, css) {
        var button = $(document.createElement('button')).text(text);
        button.attr('type', 'button');
        if (css) {
            button.css(css);
        }
        button.click(onclick);
        return button;
    }

    function createLabel(text) {
        var label = $(document.createElement('label')).text(text || "");
        return label;
    }

    // Creates a text input
    //  text:       the default text for the input
    //  defaultval: if true then the input will reset to the default text if its empty and loses focus
    //  maxlength:  max length of the input in characters
    function createTextInput(text, defaultval, maxlength, hideOnClick) {
        var input = $(document.createElement('input')).val(text);
        //if (defaultval) {
        //    defaultVal(text, input, !!hideOnClick);
        //}
        input.css({
            //'color': TEXT_COLOR,
            //'border-color': INPUT_BORDER,
            //'padding': '.5%',
        });
        input.attr({
            'type': 'text',
            'maxlength': maxlength
        });
        return input;
    }

    // Create a text area input with text/defaultval the same as createTextInput()
    function createTextAreaInput(text, defaultval, hideOnClick) {
        if (typeof text === 'string')
            text = text.replace(/<br \/>/g, '\n').replace(/<br>/g, '\n').replace(/<br\/>/g, '\n');
        var input = $(document.createElement('textarea')).val(text);
        //if (defaultval) {
        //    defaultVal(text, input, !!hideOnClick);
        //}
        input.css({
            //'color': TEXT_COLOR,
            //'border-color': INPUT_BORDER,
            'padding': '.5%'
        });
        //input.attr('placeholder', text);
        input.autoSize();
        doWhenReady(input, function (elem) {
            var realHeight = input[0].scrollHeight;
            $(input).css('height', realHeight + 'px');
        });
        return input;
    }

    // Creates a color input which modifies the background color
    // of all elements matching the jquery selector 'selector'.
    // getTransValue should return a valid transparency value
    function createBGColorInput(color, selector, getTransValue) {
        if (color.indexOf('#') !== -1) {
            color = color.substring(1, color.length);
        }
        var container = $(document.createElement('input'));
        container.attr('type', 'text');
        var picker = new jscolor.color(container[0], {});
        var hex = LADS.Util.UI.colorToHex(color);
        container.val(color);
        picker.fromString(color);
        picker.onImmediateChange = function () {
            updateBGColor(selector, container.val(), getTransValue());
        };
        return container;
    }

    // Sets the bg color of elements maching jquery selector 'selector'
    // given a hex value and a transparency value
    function updateBGColor(selector, hex, trans) {
        $(selector).css('background-color', LADS.Util.UI.hexToRGB(hex) + trans / 100.0 + ')');

    }

    // Prevents a container from being clicked on by added a div on top of it
    function preventClickthrough(container) {
        var cover = document.createElement('div');
        $(cover).css({
            'height': '100%',
            'width': '100%',
            'float': 'left',
            'position': 'absolute',
            'background-color': 'white',
            'opacity': '0',
            'top': '0px',
            'right': '0px',
            'z-index': '499',
        });
        $(cover).bind('click', function () { return false; });
        $(container).append(cover);
    }

    // Sorts a list with propery Name alphabetically
    // case insensitive
    function sortAZ(list) {
        if (list.sort) {
            list.sort(function (a, b) {
                var aLower = a.Name.toLowerCase();
                var bLower = b.Name.toLowerCase();
                return (aLower < bLower) ? -1 : 1;
            });
        }
    }

    // Sorts a list with date metadata by date with most recent date first
    function sortDate(list) {
        if (list.sort) {
            list.sort(function (a, b) {
                var aint = parseInt(a.Metadata.Date, 10);
                var bint = parseInt(b.Metadata.Date, 10);
                if (aint < bint) {
                    return 1;
                } else if (aint > bint) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    }

    // Sets the default value of an input to val
    // If the input loses focus when its empty it will revert
    // to val.  Additionally, if hideOnClick is true then
    // if the value is val and the input gains focus it will be
    // set to the empty string
    function defaultVal(val, input, hideOnClick) {
        input.val(val);
        if (hideOnClick) {
            input.focus(function () {
                if (input.val() === val)
                    input.val('').change();
            });
        }
        input.blur(function () {
            if (input.val() === '') {
                input.val(val).change();
                search('', '.leftLabel', 'div');
            }
        });
    }

    // Performs a search 
    function search(val, selector, childType) {
        $.each($(selector), function (i, child) {
            if ($(child).attr('id') === 'leftLoading')
                return;
            if (LADS.Util.searchString($(child).children(childType).text(), val)) {
                $(child).show();
            } else {
                $(child).hide();
            }
        });
    }

    function searchData(val, selector) {
        $.each($(selector), function (i, element) {
            var data = $(element).data();
            var show = false;
            $.each(data, function (k, v) {
                if (LADS.Util.searchString(v, val)) {
                    show = true;
                }
            });
            if (show) {
                $(element).show();
            } else {
                $(element).hide();
            }
        });
    }

    // When a text input is changed keeps its length no greater than
    // maxlength
    function onChangeUpdateText(input, selector, maxlength) {
        input.keyup(function () {
            if (input.val().length > maxlength) {
                input.val(input.val().substring(0, maxlength));
            }
            $(selector).html(input.val().replace(/\n\r?/g, '<br />'));
        });
        input.keydown(function () {
            if (input.val().length > maxlength) {
                input.val(input.val().substring(0, maxlength));
            }
            $(selector).html(input.val().replace(/\n\r?/g, '<br />'));
        });
        input.change(function () {
            if (input.val().length > maxlength) {
                input.val(input.val().substring(0, maxlength));
            }
            $(selector).html(input.val().replace(/\n\r?/g, '<br />'));
        });
        return input;
    }

    // When a text input is changed makes sure its a number and is within
    // min and max.  Performs doOnChange when it changes
    function onChangeUpdateNum(input, min, max, doOnChange) {
        input.keyup(function () {
            var replace = input.val().replace(/[^0-9]/g, '');
            replace = Math.constrain(parseInt(replace, 10), min, max);
            if (isNaN(replace)) replace = 0;
            if (input.val() !== replace + '') {
                input.val(replace);
            }
            if (doOnChange)
                doOnChange(replace);
        });
        input.keydown(function () {
            var replace = input.val().replace(/[^0-9]/g, '');
            replace = Math.constrain(parseInt(replace, 10), min, max);
            if (isNaN(replace)) replace = 0;
            if (input.val() !== replace + '') {
                input.val(replace);
            }
            if (doOnChange)
                doOnChange(replace);
        });
        input.change(function () {
            var replace = input.val().replace(/[^0-9]/g, '');
            replace = Math.constrain(parseInt(replace, 10), min, max);
            if (isNaN(replace)) replace = 0;
            if (input.val() !== replace + '') {
                input.val(replace);
            }
            if (doOnChange)
                doOnChange(replace);
        });
    }

    /* 
     * This method parses the Metadata fields and then checks whether the required metadata
     * field matches up with the one currently being looked at. Once it has found a match, it
     * returns the appropriate node corresponding to the field.
     *
     * From the old settings view, works there so should work here
     * Made it so that it creates blank text node if there is none
     */
    function getFieldValueFromMetadata(xml, field) {
        var metadata = getMetaData(xml);
        for (var i = 0; i < metadata.length; i++) {
            if (metadata[i].childNodes[0].textContent === field) {
                var out = metadata[i].childNodes[1].childNodes[0];
                if (out) return out;

                metadata[i].childNodes[1].appendChild(xml.createTextNode(''));
                return metadata[i].childNodes[1].childNodes[0];
            }
        }
        return null;
    }

    function addFieldToMetadata(xml, field, value) {
        // almost the same as getMetaData sans a final .childNodes, need a single element to append to!
        var metadata = xml.getElementsByTagName("Metadata")[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0];

        var fieldcontainer = xml.createElement('d3p1:KeyValueOfstringanyType');
        metadata.appendChild(fieldcontainer);

        var fieldkey = xml.createElement('d3p1:Key');
        fieldcontainer.appendChild(fieldkey);
        fieldkey.appendChild(xml.createTextNode(field));

        var fieldvalue = xml.createElement('d3p1:Value');
        fieldvalue.setAttribute('i:type', 'd8p1:string');
        fieldvalue.setAttribute('xmlns:d8p1', 'http://www.w3.org/2001/XMLSchema');
        fieldcontainer.appendChild(fieldvalue);
        fieldvalue.appendChild(xml.createTextNode(value));
    }

    // From the old settings view, works there so should work here
    function getMetaData(doq) {
        return doq.getElementsByTagName("Metadata")[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes;
    }


    // from JavaScript: The Good Parts
    function is_array(value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    // Uploads a file then calls the callback with the url and name of the file.
    // See LADS.Authoring.FileUploader for 'type' values
    function uploadFile(type, callback, multiple, filter) {
        var names = [], locals = [], contentTypes = [], fileArray, i;
        LADS.Authoring.FileUploader( // remember, this is a multi-file upload
            root,
            type,
            // local callback - get filename
            function (files, localURLs) {
                fileArray = files;
                for (i = 0; i < files.length; i++) {
                    names.push(files[i].displayName);
                    if (files[i].contentType.match(/image/)) {
                        contentTypes.push('Image');
                    } else if (files[i].contentType.match(/video/)) {
                        contentTypes.push('Video');
                    } else if (files[i].contentType.match(/audio/)) {
                        contentTypes.push('Audio');
                    }
                }
            },
            // remote callback - save correct name
            function (urls) {
                if (!is_array(urls)) { // check to see whether a single file was returned
                    urls = [urls];
                    names = [names];
                }
                for (i = 0; i < urls.length; i++) {
                    console.log("urls[" + i + "] = " + urls[i] + ", names[" + i + "] = " + names[i]);
                }
                callback(urls, names, contentTypes, fileArray);
            },
            filter || ['.jpg', '.png', '.gif', '.tif', '.tiff'],
            false,
            function () {
                root.append(LADS.Util.UI.popUpMessage(null, "There was an error uploading the file.  Please try again later."));
            },
            !!multiple // batch upload disabled
            );
    }

    // Creates the art picker for a given exhibition
    function createArtPicker(exhibition) {
        if (artPickerOpen)
            return;
        artPickerOpen = true;
        // Overlay over the whole page
        var overlay = $(document.createElement('div'));
        overlay.css({
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'top': '0',
            'left': '0',
            'background-color': 'rgba(0,0,0,0.5)',
            'z-index': '1000',
            'display': 'block'
        });

        // Container for the picker
        var container = $(document.createElement('div'));
        container.css({
            'height': '70%',
            'width': '50%',
            'position': 'absolute',
            'top': '15%',
            'left': '25%',
            'background-color': 'black',
            'border': '3px double white',
            'padding': '2%',
        });

        // Title for the picker
        var label = $(document.createElement('div'));
        label.css({
            'font-size': '180%',
            'color': 'white',
            'margin-bottom': '2%',
            'height': '10%',
        });
        label.text('Choose the artworks to link to this exhibition.');

        var searchInput = $(document.createElement('input'));
        searchInput.attr('type', 'text');
        searchInput.css({
        });
        searchInput.keyup(function () {
            searchData(searchInput.val(), '.artPickerButton');
        });
        searchInput.change(function () {
            searchData(searchInput.val(), '.artPickerButton');
        });
        // Workaround for clear button (doesn't fire a change event...)
        searchInput.mouseup(function () {
            setTimeout(function () {
                searchData(searchInput.val(), '.artPickerButton');
            }, 1);
        });
        searchInput.attr('placeholder', PICKER_SEARCH_TEXT);

        // Art section of the picker
        var art = $(document.createElement('div'));
        art.css({
            'height': '72%',
            'overflow': 'auto',
            'margin-bottom': '2%',
        });

        // Container for the art inside the art section
        var artContainer = $(document.createElement('div'));
        artContainer.css({
            'padding': '1%',
        });

        // Container for buttons/loading/saving indicator
        var buttonContainer = $(document.createElement('div'));
        buttonContainer.css({
            'height': '8%',
        });

        // Loading/saving indicator
        var loadingContainer = $(document.createElement('div'));
        loadingContainer.css({
            'width': '20%',
            'display': 'inline-block',
        });

        // Loading/saving text
        var loading = $(document.createElement('label'));
        loading.css({
            'color': 'white',
            'font-size': '140%',
        });
        loading.text('Loading...');

        var circle = $(document.createElement('img'));
        circle.attr('src', 'images/icons/progress-circle.gif');
        circle.css({
            'height': $(document).height() * 0.03 + 'px',
            'width': 'auto',
            'float': 'right',
        });

        var save = $(document.createElement('button'));
        save.attr('type', 'button');
        save.text('Save');
        save.css({
            'float': 'right',
            'margin': '2%',
            'padding': '1%',
        });

        var cancel = $(document.createElement('button'));
        cancel.attr('type', 'button');
        cancel.text('Cancel');
        cancel.css({
            'float': 'right',
            'margin': '2%',
            'padding': '1%',
        });

        // Hide and remove the overlay when cancel is clicked
        cancel.click(function () {
            overlay.hide();
            root[0].removeChild(overlay[0]);
            artPickerOpen = false;
        });

        art.append(artContainer);

        loadingContainer.append(loading);
        loadingContainer.append(circle);

        buttonContainer.append(loadingContainer);
        buttonContainer.append(cancel);
        buttonContainer.append(save);

        container.append(label);
        container.append(searchInput);
        container.append(art);
        container.append(buttonContainer);

        overlay.append(container);

        root.append(overlay);

        var checkedIDs = [];
        var uncheckedIDs = [];

        function artworksInHelper(artworks) {
            // Keep track of which artworks are in an exhibition
            if (artworks) {
                $.each(artworks, function (i, artwork) {
                    if (artwork.Identifier)
                        checkedIDs.push(artwork.Identifier);
                });
            }

            // Get all the artworks for the exhibition
            LADS.Worktop.Database.getArtworks(allArtworksHelper, null, allArtworksHelper);

        }

        function allArtworksHelper(allArtworks) {
            sortAZ(allArtworks);
            // Add each artwork to the artwork container.
            $.each(allArtworks, function (i, artwork) {
                leftQueue.add(function () {
                    var label;
                    artContainer.append(label = createArtButton(artwork,
                        // Oncheck/uncheck function
                        // If it is checked adds the artwork to the checkedIDs and
                        // removes it from the uncheckedIDs.  If unchecked it removes it
                        // from the checkedIDs and adds it to the uncheckedIDs
                        function (checked) {
                            var index;
                            if (checked) {
                                if (checkedIDs.indexOf(artwork.Identifier) === -1) {
                                    checkedIDs.push(artwork.Identifier);
                                }
                                index = uncheckedIDs.indexOf(artwork.Identifier);
                                if (index !== -1) {
                                    uncheckedIDs.splice(index, 1);
                                }
                            } else {
                                index = checkedIDs.indexOf(artwork.Identifier);
                                if (index !== -1) {
                                    checkedIDs.splice(index, 1);
                                }
                                if (uncheckedIDs.indexOf(artwork.Identifier) === -1) {
                                    uncheckedIDs.push(artwork.Identifier);
                                }
                            }
                            // Set the initial checked/unchecked value
                        }, $.inArray(artwork.Identifier, checkedIDs) !== -1));
                    // Hide if it doesn't match search criteria
                    searchData(searchInput.val(), label);
                });
            });
            // Hide loading when we're done
            leftQueue.add(function () {
                loadingContainer.hide();
            });
        }

        // Hide save/cancel buttons, clear the left queue, and change Loading to Saving...
        save.click(function () {
            loading.text('Saving...');
            loadingContainer.show();
            save.hide();
            cancel.hide();
            leftQueue.clear();

            // Save the art
            saveArtAssosciation(exhibition, checkedIDs, uncheckedIDs, function () {
                overlay.hide();
                root[0].removeChild(overlay[0]);
                artPickerOpen = false;
                loadExhibitionsView(exhibition.Identifier);
            }, function () {
                loading.text('Authentication Failed');
                save.show();
                cancel.show();
            }, function () {
                loading.text('Server Error');
                save.show();
                cancel.show();
            });
        });

        // TODO: Error handler?
        LADS.Worktop.Database.getArtworksIn(exhibition.Identifier, artworksInHelper, null, artworksInHelper);
    }

    // Saves art assosciated to an exhibit
    //  exhibition: The exhibition to add art to
    //  checkedIDs: The IDs of the artwork to add
    //  uncheckedIDs: The IDs of the artwork to remove
    //  callback: Called when done
    //
    // Note: Artworks keep track of the exhibitions they are in, so we
    // need to go through every artwork and add the exhibition to it.
    function saveArtAssosciation(exhibition, checkedIDs, uncheckedIDs, success, unauth, error) {
        // Keep track of how many saves have finished
        //var savesdone = 0;
        if (checkedIDs.length + uncheckedIDs.length === 0) {
            success();
            return;
        }
        var addIDs = "";
        var removeIDs = "";
        $.each(checkedIDs, function (i, val) {
            addIDs = addIDs + "," + val;
        });
        if (addIDs) addIDs = addIDs.substr(1);

        $.each(uncheckedIDs, function (i, val) {
            removeIDs = removeIDs + "," + val;
        });
        if (removeIDs) removeIDs = removeIDs.substr(1);

        LADS.Worktop.Database.changeExhibition(exhibition.Identifier, { AddIDs: addIDs, RemoveIDs: removeIDs }, success, unauth, error);
        
    }

    function fixArtMetadata(artworkXML) {
        // Need to fix the xml
        setArtworkName(artworkXML, LADS.Util.encodeXML(getArtworkName(artworkXML)));
        setArtworkArtist(artworkXML, LADS.Util.encodeXML(getArtworkArtist(artworkXML)));
        setArtworkYear(artworkXML, LADS.Util.encodeXML(getArtworkYear(artworkXML)));
        setArtworkLocations(artworkXML, LADS.Util.encodeXML(getArtworkLocations(artworkXML)));


        var metadata = artworkXML.getElementsByTagName("Metadata")[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes;

        for (var i = metadata.length - 1; i >= 0; i--) {
            if (metadata[i].childNodes[0].textContent.indexOf('InfoField_') !== -1) {
                metadata[i].childNodes[1].textContent = LADS.Util.encodeXML(metadata[i].childNodes[1].textContent);
            }
        }
    }

    function setArtworkName(artworkXML, name) {
        if (name && name.length > 0)
            artworkXML.getElementsByTagName("Name")[0].childNodes[0].data = name;
    }

    function setArtworkArtist(artworkXML, artist) {
        if (artist && artist.length > 0)
            getFieldValueFromMetadata(artworkXML, "Artist").data = artist;
    }

    function setArtworkYear(artworkXML, year) {
        if (year && year.length > 0)
            getFieldValueFromMetadata(artworkXML, "Year").data = year;
    }

    function setArtworkLocations(artworkXML, data) {
        getFieldValueFromMetadata(artworkXML, "Location").data = data;
    }

    function getArtworkName(artworkXML) {
        return artworkXML.getElementsByTagName("Name")[0].childNodes[0].data;
    }

    function getArtworkArtist(artworkXML) {
        return getFieldValueFromMetadata(artworkXML, "Artist").data;
    }

    function getArtworkYear(artworkXML) {
        return getFieldValueFromMetadata(artworkXML, "Year").data;
    }

    function getArtworkLocations(artworkXML) {
        return getFieldValueFromMetadata(artworkXML, "Location").data;
    }

    // Creates a check button for the artwork picker
    function createArtButton(artwork, onclick, checked) {
        var container = $(document.createElement('div'));
        container.attr('class', 'artPickerButton');
        container.css({
            'height': '70px',
            'margin-bottom': '3%',
            'margin-right': '2.5%',
            'overflow': 'hidden',
            'position': 'relative',
        });

        container.data({
            name: artwork.Name,
            artist: artwork.Metadata.Artist,
            year: artwork.Metadata.Year,
        });

        container.mousedown(function () {
            container.css({
                'background': HIGHLIGHT,
            });
        });
        container.mouseup(function () {
            container.css({
                'background': 'transparent',
            });
        });
        container.mouseleave(function () {
            container.css({
                'background': 'transparent',
            });
        });

        var checkbox = $(document.createElement('input'));
        checkbox.attr('type', 'checkbox');
        checkbox.prop('checked', checked);
        checkbox.css({
            'margin-right': '.5%',
            'float': 'right',
        });
        checkbox.click(function (evt) {
            evt.stopPropagation();
        });

        checkbox.change(function () {
            onclick(checkbox.prop('checked'));
        });

        container.click(function () {
            checkbox.prop("checked", !checkbox.prop("checked"));
            checkbox.trigger('change');
        });

        var image = $(document.createElement('img'));
        image.attr('src', LADS.Worktop.Database.fixPath(artwork.Metadata.Thumbnail));
        image.css({
            'height': 'auto',
            'width': '20%',
            'margin-right': '5%',
            'float': 'left',
        });
        container.append(image);

        var progressCircCSS = {
            'position': 'absolute',
            'left': '5%',
            'z-index': '50',
            'height': 'auto',
            'top': '18%',
            'width': '10%',
        };
        var circle = LADS.Util.showProgressCircle(container, progressCircCSS, '0px', '0px', false);
        image.load(function () {
            LADS.Util.removeProgressCircle(circle);
        });

        var label = $(document.createElement('div'));
        label.css({
            'font-size': '160%',
            //'display': 'inline-block',
            'white-space': 'nowrap',
            'width': '65%',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'vertical-align': 'top',
            'color': 'white',
        });
        label.text(artwork.Name);

        var sublabel = $(document.createElement('div'));
        sublabel.css({
            'font-size': '120%',
            'font-style': 'italic',
            'white-space': 'nowrap',
            'width': '65%',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'vertical-align': 'top',
            'color': 'white',
        });
        sublabel.text(artwork.Metadata.Artist + " (" + artwork.Metadata.Year + ")");

        container.append(checkbox);

        container.append(label);
        container.append(sublabel);


        return container;
    }

/**

//as far as I can tell this method is never called and isn't related to the slider itself...
    function verticalSlider(input, min, max) {
        //var sliderdiv = $(document.createElement('div'));
        var sliderdiv = root.find('#setViewSlider');
        console.log("slider's here");
        sliderdiv.css({
            'height': '200px',
            'position': 'absolute',
            'display': 'none',
        });
        sliderdiv.slider({
            orientation: 'horizontal',
            min: min,
            max: max,
            value: input.val(),
            slide: function (event, ui) {
                input.val(ui.value);
                input.trigger('change');
                input.focus();
            }
        });

        settings.scroll(function () {
            sliderdiv.css({
                'left': input.offset().left - 17 + 'px',
                'top': input.offset().top - 100 + 'px',
            });
        });

        sliderdiv.mousedown(function () {
            input.focus();
        });
        sliderdiv.children().focus(function () {
            input.focus();
        });

        //root.append(sliderdiv);
        input.focus(function () {
            sliderdiv.css({
                'left': input.offset().left - 15 + 'px',
                'top': input.offset().top - 75 + 'px',
            });
            sliderdiv.show();
        });
        input.blur(function () {
            sliderdiv.hide();
        });

        input.keydown(function () {
            sliderdiv.slider('value', input.val());
        });
        input.keyup(function () {
            sliderdiv.slider('value', input.val());
        });
        input.change(function () {
            sliderdiv.slider('value', input.val());
        });
    }
*/
    // Creates an overlay over the whole settings view with
    // a spinning circle and centered text.  Text defaults
    // to 'Loading...' if not specified.  This overlay is intended
    // to be used only when the page is 'done'.  The overlay doesn't
    // support being removed from the page, so only call this when
    // the page will be changed!
    function loadingOverlay(text) {
        text = text || "Loading...";
        var overlay = $(document.createElement('div'));
        overlay.css({
            'position': 'absolute',
            'left': '0px',
            'top': '0px',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0,0,0,0.5)',
            'z-index': '1000',
        });
        root.append(overlay);

        var circle = $(document.createElement('img'));
        circle.attr('src', 'images/icons/progress-circle.gif');
        circle.css({
            'height': 'auto',
            'width': '10%',
            'position': 'absolute',
            'left': '45%',
            'top': ($(window).height() - $(window).width() * 0.1) / 2 + 'px',
        });
        overlay.append(circle);

        var widthFinder = $(document.createElement('div'));
        widthFinder.css({
            'position': 'absolute',
            'visibility': 'hidden',
            'height': 'auto',
            'width': 'auto',
            'font-size': '200%',
        });
        widthFinder.text(text);
        root.append(widthFinder);

        var label = $(document.createElement('label'));
        label.css({
            'position': 'absolute',
            'left': ($(window).width() - widthFinder.width()) / 2 + 'px',
            'top': ($(window).height() - $(window).width() * 0.1) / 2 + $(window).width() * 0.1 + 'px',
            'font-size': '200%',
            'color': 'white',
        });
        widthFinder.remove();
        label.text(text);
        overlay.append(label);
    }
    
    function authError() {
        var popup = LADS.Util.UI.popUpMessage(function () {
            LADS.Auth.clearToken();
            rightQueue.clear();
            leftQueue.clear();
            LADS.Layout.StartPage(null, function (page) {
                LADS.Util.UI.slidePageRight(page);
            });
        }, "Could not authenticate, returning to the splash page.", null, true);
        root.append(popup);
        $(popup).show();
    }

    function error(fn) {
        return function () {
            var popup = LADS.Util.UI.popUpMessage(null, "An unknown error occured.", null, true);
            root.append(popup);
            $(popup).show();
            fn && fn();
        }
    }

    function conflict(doq, text, fail) {
        return function (jqXHR, ajaxCall) {
            var confirmationBox = LADS.Util.UI.PopUpConfirmation(function () {
                ajaxCall.force();
                // TODO: Text for change/delete
            }, "Your version of " + doq.Name + " is not up to date.  Are you sure you want to change " + doq.Name + "?", text, true, fail);
            root.append(confirmationBox);
            $(confirmationBox).show();
        }
    }

    return that;
};