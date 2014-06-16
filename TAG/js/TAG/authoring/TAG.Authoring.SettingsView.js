﻿TAG.Util.makeNamespace("TAG.Authoring.SettingsView");

/*  Creates a SettingsView, which is the first UI in authoring mode.  
 *  @class TAG.Authoring.SettingsView
 *  @constructor
    TODO- change parameters to options object
 *  @param startView sets the starting setting.  This can be "Exhibitions", "Artworks", "Tours", 
 *       or "General Settings".  Undefined/null, etc. goes to General Settings.
 *       TODO: Use constants instead of strings
 *   @param {Function} callback  called after the UI is done being created.
 *   @param {Function} backPage is a function to create the page to go back to (null/undefined goes
 *      back to the main page).  This function, when called with no arguments,
 *      should return a dom element that can be provided as an argument to 
 *      slidePageRight.
 *   @param startLabelID selects a middle label automatically if it matches that id.
 *      The label will be scrolled to if it is off screen
 *   @return {Object} public methods and variables
 */
TAG.Authoring.SettingsView = function (startView, callback, backPage, startLabelID) {
    "use strict";

        
    var root = TAG.Util.getHtmlAjax('SettingsView.html'), //Get html from html file

        //get all of the ui elements from the root and save them in variables
        middleLoading = root.find('#setViewLoadingCircle'),
        settingsContainer = root.find('#setViewSettingsContainer'),
        searchContainer = root.find('#setViewSearchContainer'),
        navBar = root.find('#setViewNavBar'),
        searchbar = root.find('#setViewSearchBar'),
        newButton = root.find('#setViewNewButton'),
        secondaryButton = root.find('#setViewSecondaryButton'),
        middlebar = root.find('#setViewMiddleBar'),
        middleLabelContainer = root.find('#setViewMiddleLabelContainer'),
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
        prevSelectedMiddleLabel,
        // These are 'asynchronous' queues to perform tasks. These queues will process events in order, but asynchronously so
        // they can be completed in the 'background'. Calling .add(fn) adds a function to the queue while .clear() clears the queue.  
        //Note that an in progress function will not be canceled by .clear().
        middleQueue = TAG.Util.createQueue(),  //used to add things to the middle label container
        rightQueue = TAG.Util.createQueue(), //used to add things to the right panel
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

    /**
     * Helper function to set up UI elements and switch to first view
     * @method loadHelper
     * @param {Object} main  
     */
    function loadHelper(main){

        //Setting up UI:
        var backButton = root.find('#setViewBackButton');
        backButton.attr('src', 'images/icons/Back.svg');

        backButton.mousedown(function () {
            TAG.Util.UI.cgBackColor("backButton", backButton, false);
        });

        backButton.mouseleave(function () {
            TAG.Util.UI.cgBackColor("backButton", backButton, true);
        });

        backButton.click(function () {
            TAG.Auth.clearToken();
            rightQueue.clear();
            middleQueue.clear();
            backButton.off('click');
            if (backPage) {
                var bpage = backPage();
                TAG.Util.UI.slidePageRight(bpage);
            } else {
                TAG.Layout.StartPage(null, function (page) {
                    TAG.Util.UI.slidePageRight(page);
                });
            }
        });

        var topBarLabel = root.find('#setViewTopBarLabel');
        var topBarLabelSpecs = TAG.Util.constrainAndPosition($(window).width(), $(window).height() * 0.08,
        {
            width: 0.4,
            height: 0.9,
        });
        topBarLabel.css({
            'height': topBarLabelSpecs.height + 'px',
            'width': topBarLabelSpecs.width + 'px',
        });
        var fontsize = TAG.Util.getMaxFontSizeEM('Tour Authoring', 0.5, topBarLabelSpecs.width, topBarLabelSpecs.height * 0.8, 0.1);
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
            search(searchbar.val(), '.middleLabel', 'div');
        });
        searchbar.change(function () {
            search(searchbar.val(), '.middleLabel', 'div');
        });

        // Workaround for clear button (doesn't fire a change event...)
        searchbar.mouseup(function () {
            setTimeout(function () {
                search(searchbar.val(), '.middleLabel', 'div');
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
    
    /**Switches the view based on selected navigation label
     * @method switchView
     * @param {String} view         the view to switch to
     * @param {Object} id           the id of the middle label to start on
     */
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

    /**Returns root
     * @method getRoot
     * @return {Object} root 
     */
    function getRoot() {
        return root;
    }

    // Navigation Bar Functions:

     /**Create a navigation label
     * @method createNavLabel
     * @param {String} text         text for label
     * @param {Function} onclick    onclick function for label
     * @return {Object} container   container containing new label
     */
    function createNavLabel(text, onclick) {
        var container = $(document.createElement('div'));
        container.attr('class', 'navContainer');
        container.attr('id', 'nav-' + text.text);
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
        navtext.text(text.text);

        var navsubtext = $(document.createElement('label'));
        navsubtext.attr('class','navsubtext');
        navsubtext.text(text.subtext);

        container.append(navtext);
        container.append(navsubtext);
        return container;
    }

    // General Settings Functions:

    /**Loads the General Settings view
     * @method loadGeneralView
     */
    function loadGeneralView() {
        prepareNextView(false);

        // Add this to our queue so the UI doesn't lock up
        middleQueue.add(function () {
            var label;
            // Add the Splash Screen label and set it as previously selected because its our default
            middleLoading.before(label = selectLabel(createMiddleLabel('Splash Screen', null, loadSplashScreen), true));
            prevSelectedMiddleLabel = label;
            // Default to loading the splash screen
            loadSplashScreen();
            // Add the Password Settings label
            middleLoading.before(createMiddleLabel('Password Settings', null, loadPasswordScreen).attr('id', 'password'));
            middleLoading.hide();
        });
        cancelLastSetting = null;
    }

    /**Sets up the right side of the UI for the splash screen
     * including the viewer, buttons, and settings container.
     * @method loadSplashScreen
     */
    function loadSplashScreen() {
        prepareViewer(true);
        clearRight();

        // Load the start page, the callback will add it to the viewer when its done
        var startPage = new TAG.Layout.StartPage(null, function (startPage) {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.general.text]) {
                return;
            }
            viewer.append(startPage);
            // Don't allow the viewer to be clicked
            preventClickthrough(viewer);
        }, true);

        // Get DB Values
        var alpha = TAG.Worktop.Database.getMuseumOverlayTransparency();
        var overlayColor = TAG.Worktop.Database.getMuseumOverlayColor();
        var name = TAG.Worktop.Database.getMuseumName();
        var loc = TAG.Worktop.Database.getMuseumLoc();
        var info = TAG.Worktop.Database.getMuseumInfo();
        if (name === undefined) {
            name = "";
        }
        if (loc === undefined) {
            loc = "";
        }
        if (info === undefined) {
            info = "";
        }
        var logoColor = TAG.Worktop.Database.getLogoBackgroundColor();

        // Create inputs
        var alphaInput = createTextInput(Math.floor(alpha * 100), true);
        var bgImgInput = createButton('Change Image', function () {
            uploadFile(TAG.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                bgImgInput.val(url);
                $('#background').css({
                    'background-image': 'url("' + TAG.Worktop.Database.fixPath(url) + '")',
                    'background-size': 'cover',
                });
            });
        });
        var logoInput = createButton('Change Logo', function () {
            uploadFile(TAG.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                logoInput.val(url);
                $('#logo')[0].src = TAG.Worktop.Database.fixPath(url);
            });
        });
        var overlayColorInput = createBGColorInput(overlayColor, '.infoDiv', function () { return alphaInput.val(); });
        var nameInput = createTextInput(TAG.Util.htmlEntityDecode(name), true, 40);
        var locInput = createTextInput(TAG.Util.htmlEntityDecode(loc), true, 45);
        var infoInput = createTextAreaInput(TAG.Util.htmlEntityDecode(info), true);
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
            //save Splash screen and pass in inpts with following keys:
            saveSplashScreen({
                alphaInput: alphaInput,                 //Overlay Transparency
                overlayColorInput: overlayColorInput,   //Overlay Color
                nameInput: nameInput,                   //Museum Name
                locInput: locInput,                     //Museum Location
                infoInput: infoInput,                   //Museum Info
                logoColorInput: logoColorInput,         //Logo background color
                bgImgInput: bgImgInput,                 //Background image
                logoInput: logoInput,                   //Logo image
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

    /**Saves the splash screen settings
     * @method saveSplashScreen
     * @param {Object} inputs       information from setting inputs
     */
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
        //Change the settings in the database
        TAG.Worktop.Database.changeMain(options, function () {
            TAG.Worktop.Database.getMain(loadGeneralView, error(loadGeneralView), null);
            ;
        }, authError, conflict({ Name: 'Main' }, 'Update', loadGeneralView), error(loadGeneralView));
    }

    /**Set up the right side of the UI for the  password changer
     * @method loadPasswordScreen
     */
    function loadPasswordScreen() {
        //Prepare right side without showing the viewer or buttonContainer
        prepareViewer(false, null, false);
        clearRight();

        var loading = createLabel('Loading...');
        var loadingSetting = createSetting('', loading);
        settingsContainer.append(loadingSetting);

        TAG.Worktop.Database.checkSetting('AllowChangePassword', function (val) {
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
                        old: oldInput,         // Old password
                        new1: newInput1,       // New password
                        new2: newInput2,       // New password confirmation
                        msg: msgLabel,         // Message area
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

    /**Display label if password change not supported by server
     *@method passwordChangeNotSupported
     */
    function passwordChangeNotSupported() {
        var label = createLabel('');
        var setting = createSetting('Changing the password has been disabled by the server.  Contact the server administrator for more information', label);
        settingsContainer.append(setting);
    }

    /**Updates the new password
     * @method savePassword
     * @param {Object} inputs    keys for password change
     */
    function savePassword(inputs) {
        inputs.msg.text('Processing...');
        if (inputs.new1.val() !== inputs.new2.val()) {
            inputs.msg.text('New passwords do not match.');
        } else {
            TAG.Auth.changePassword(inputs.old.val(), inputs.new1.val(),
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

    // Collection Functions:

    /**Loads the collections view
     * @method loadExhibitionsView
     * @param {Object} id       id of middle label to start on
     */
    function loadExhibitionsView(id) {
        var cancel = false;
        // Set the new button text to "New"
        prepareNextView(true, "New", createExhibition);
        clearRight();
        prepareViewer(true);

        // Make an async call to get the list of exhibitions
        TAG.Worktop.Database.getExhibitions(function (result) {
            if (cancel) return;
            sortAZ(result);
            $.each(result, function (i, val) {
                if (cancel) return;
                // Add each label as a separate function in the queue so they don't lock up the UI
                middleQueue.add(function () {
                    if (cancel) return;
                    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                        return;
                    }
                    var label;
                    if (!prevSelectedMiddleLabel &&
                        ((id && val.Identifier === id) || (!id && i === 0))) {
                        
                        // Select the first one or the specified id
                        middleLoading.before(selectLabel(label = createMiddleLabel(val.Name, null, function () {
                            loadExhibition(val);
                        }, val.Identifier), true));

                        // Scroll to the selected label if the user hasn't already scrolled somewhere
                        if (middlebar.scrollTop() === 0 && label.offset().top - middlebar.height() > 0) {
                            middlebar.animate({
                                scrollTop: (label.offset().top - middlebar.height())
                            }, 1000);
                        }
                        prevSelectedMiddleLabel = label;
                        loadExhibition(val);
                    } else {
                        middleLoading.before(label = createMiddleLabel(val.Name, null, function () {
                            loadExhibition(val);
                        }, val.Identifier));
                    }
                    // Hide the label if it doesn't match the current search criteria
                    if (!TAG.Util.searchString(val.Name, searchbar.val())) {
                        label.hide();
                    }
                });
            });
            // Hide the loading label when we're done
            middleQueue.add(function () {
                middleLoading.hide();
            });
        });
        cancelLastSetting = function () { cancel = true; };
    }

    /**Set up the right side for a collection
     * @method loadExhibition
     * @param {Object} exhibition   exhibition to load
     */
    function loadExhibition(exhibition) {
        prepareViewer(true);
        clearRight();

        // Set the viewer to exhibition view (see function below)
        exhibitionView(exhibition);

        // Create inputs
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
        privateInput.attr('class', 'settingButton');
        var publicInput = createButton('Publish', function () {
            privateState = false;
            publicInput.css('background-color', 'white');
            privateInput.css('background-color', '');
        }, {
            'min-height': '0px',
            'width': '48%',
        });
        publicInput.attr('class', 'settingButton');
        if (privateState) {
            privateInput.css('background-color', 'white');
        } else {
            publicInput.css('background-color', 'white');
        }
        var pubPrivDiv = $(document.createElement('div'));
        pubPrivDiv.append(privateInput).append(publicInput);

        var nameInput = createTextInput(TAG.Util.htmlEntityDecode(exhibition.Name), 'Collection name', 40);
        var descInput = createTextAreaInput(TAG.Util.htmlEntityDecode(exhibition.Metadata.Description), false);
        var bgInput = createButton('Change Background Image', function () {
            uploadFile(TAG.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                bgInput.val(url);
                $('#bgimage').css({
                    'background-image': 'url("' + TAG.Worktop.Database.fixPath(url) + '")',
                    'background-size': 'cover',
                });
            });
        });
        var previewInput = createButton('Change Image', function () {
            uploadFile(TAG.Authoring.FileUploadTypes.Standard, function (urls) {
                var url = urls[0];
                previewInput.val(url);
                $('#img1')[0].src = TAG.Worktop.Database.fixPath(url);
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
                privateInput: privateState,  //default set unpublished
                nameInput: nameInput,        //Collection name
                descInput: descInput,        //Collection description
                bgInput: bgInput,            //Collection background image
                previewInput: previewInput,  //Collection preview image
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

        var artPickerButton = createButton('Manage Collection', function () {
            TAG.Util.UI.createAssociationPicker(root, "Add and Remove Artworks in this Collection",
                { comp: exhibition, type: 'exhib' },
                'exhib', [{
                    name: 'All Artworks',
                    getObjs: TAG.Worktop.Database.getArtworksAndTours,
                }, {
                    name: 'Artworks in this Collection',
                    getObjs: TAG.Worktop.Database.getArtworksIn,
                    args: [exhibition.Identifier]
                }], {
                    getObjs: TAG.Worktop.Database.getArtworksIn,
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

        /**Helper method to set the viewer to exhibition view
         * @method exhibitionView
         * @param {Object} exhibition    exhibition to load
         */
        function exhibitionView(exhibition) {
            rightQueue.add(function () {
                var options = {
                    backCollection : exhibition
                };
                //var exhibView = new TAG.Layout.CollectionsPage(null, exhibition, viewer);
                var exhibView = new TAG.Layout.CollectionsPage(options);
                var exroot = exhibView.getRoot();
                $(exroot).css('z-index','-1'); // otherwise, you can use the search box and sorting tabs!
                viewer.append(exroot);
                preventClickthrough(viewer);
            });
        }

        buttonContainer.append(artPickerButton).append(deleteButton).append(saveButton);
    }

    /**Create an exhibition
     * @method createExhibition
     */
    function createExhibition() {
        prepareNextView(false);
        clearRight();
        prepareViewer(true);

        TAG.Worktop.Database.createExhibition(null, function (newDoq) {
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

    /** Save a collection
     * @method saveExhibition
     * @param {Object} exhibition   collection to save
     * @inputs {Object} inputs      keys from input fields
     */
    function saveExhibition(exhibition, inputs) {
        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);

        var name = inputs.nameInput.val();
        var desc = inputs.descInput.val();
        var bg = inputs.bgInput.val();
        var preview = inputs.previewInput.val();
        var priv = inputs.privateInput;

        var options = {
            Name: name,
            Private: priv,
            Description: desc,
        }

        if (bg)
            options.Background = bg;
        if (preview)
            options.Img1 = preview;

        TAG.Worktop.Database.changeExhibition(exhibition.Identifier, options, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                return;
            }
            loadExhibitionsView(exhibition.Identifier);
        }, authError, conflict(exhibition, "Update", loadExhibitionsView), error(loadExhibitionsView));
    }

    /**Delete a collection
     * @method deleteExhibition
     * @param {Object} exhibition     collection to delete
     */
    function deleteExhibition(exhibition) {
        var confirmationBox = TAG.Util.UI.PopUpConfirmation(function () {
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            // actually delete the exhibition
            TAG.Worktop.Database.deleteDoq(exhibition.Identifier, function () {
                if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.exhib.text]) {
                    return;
                }
                loadExhibitionsView();
            }, authError, conflict(exhibition, "Delete", loadExhibitionsView), error(loadExhibitionsView));
        }, "Are you sure you want to delete " + exhibition.Name + "?", "Delete", true, function() { $(confirmationBox).hide(); });
        root.append(confirmationBox);
        $(confirmationBox).show();
    }


    // Tour Functions:

    /**Load the tour view
     * @method loadTourView
     * @param {Object} id   id of middle label to start on
     */
    function loadTourView(id) {
        prepareNextView(true, "New", createTour);
        clearRight();
        prepareViewer(true);
        var cancel = false;
        // Make an async call to get tours
        TAG.Worktop.Database.getTours(function (result) {
            if (cancel) return;
            sortAZ(result);

            $.each(result, function (i, val) {
                if (cancel) return false;
                // Add each label as a separate function to the queue so the UI doesn't lock up
                middleQueue.add(function () {
                    if (cancel) return;
                    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
                        return;
                    }
                    var label;
                    if (!prevSelectedMiddleLabel &&
                        ((id && val.Identifier === id) || (!id && i === 0))) {
                        // Select the first one
                        middleLoading.before(selectLabel(label = createMiddleLabel(val.Name, null, function () {
                            loadTour(val);
                        }, val.Identifier, false, function () {
                            editTour(val);
                        }), true));

                        // Scroll to the selected label if the user hasn't already scrolled somewhere
                        if (middlebar.scrollTop() === 0 && label.offset().top - middlebar.height() > 0) {
                            middlebar.animate({
                                scrollTop: (label.offset().top - middlebar.height())
                            }, 1000);
                        }

                        prevSelectedMiddleLabel = label;
                        loadTour(val);
                    } else {
                        middleLoading.before(label = createMiddleLabel(val.Name, null, function () {
                            loadTour(val);
                        }, val.Identifier, false, function () {
                            editTour(val);
                        }));
                    }
                    // Hide if it doesn't match search criteria
                    if (!TAG.Util.searchString(val.Name, searchbar.val())) {
                        label.hide();
                    }
                });
            });
            // Hide the loading label when we're done
            middleQueue.add(function () {
                middleLoading.hide();
            });
        });
        cancelLastSetting = function () { cancel = true; };
    }

    /**Load a tour to the right side
     * @method loadTour
     * @param {Object} tour     tour to load
     */
    function loadTour(tour) {
        prepareViewer(true);
        clearRight();

        // Create an img element just to load the image
        var img = $(document.createElement('img'));
        img.attr('src', TAG.Worktop.Database.fixPath(tour.Metadata.Thumbnail));

        // Create a progress circle
        var progressCircCSS = {
            'position': 'absolute',
            'left': '30%',
            'top': '22%',
            'z-index': '50',
            'height': viewer.height() / 2 + 'px',
            'width': 'auto'
        };
        var circle = TAG.Util.showProgressCircle(viewer, progressCircCSS, '0px', '0px', false);
        var selectedLabel = prevSelectedMiddleLabel;
        img.load(function () {
            // If the selection has changed since we started loading return
            if (prevSelectedMiddleLabel && prevSelectedMiddleLabel.text() !== tour.Name) {
                TAG.Util.removeProgressCircle(circle);
                return;
            }
            TAG.Util.removeProgressCircle(circle);
            // Set the image as a background image, centered and contained
            viewer.css('background', 'black url(' + TAG.Worktop.Database.fixPath(tour.Metadata.Thumbnail) + ') no-repeat center / contain');
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
        privateInput.attr('class','settingButton');
        var publicInput = createButton('Publish', function () {
            privateState = false;
            publicInput.css('background-color', 'white');
            privateInput.css('background-color', '');
        }, {
            'min-height': '0px',
            'width': '48%',
        });
        publicInput.attr('class','settingButton');
        if (privateState) {
            privateInput.css('background-color', 'white');
        } else {
            publicInput.css('background-color', 'white');
        }
        var pubPrivDiv = $(document.createElement('div'));
        pubPrivDiv.append(privateInput).append(publicInput);

        var nameInput = createTextInput(TAG.Util.htmlEntityDecode(tour.Name), true, 120);
        var descInput = createTextAreaInput(TAG.Util.htmlEntityDecode(tour.Metadata.Description).replace(/\n/g,'<br />') || "", false);

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
                    nameInput.val("Untitled Tour");
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

    /** Create a tour
     * @method createTour
     */
    function createTour() {
        prepareNextView(false);
        clearRight();
        prepareViewer(true);

        TAG.Worktop.Database.createTour(null, function (newDoq) {
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

    /**Edit a tour
     * @method editTour
     * @param {Object} tour     tour to edit
     */
    function editTour(tour) {
        // Overlay doesn't spin... not sure how to fix without redoing tour authoring to be more async
        loadingOverlay('Loading Tour...');
        middleQueue.clear();
        rightQueue.clear();
        setTimeout(function () {
            var toureditor = new TAG.Layout.TourAuthoringNew(tour, function () {
                TAG.Util.UI.slidePageLeft(toureditor.getRoot());
            });
        }, 1);
    }

    /**Delete a tour
     * @method deleteTour
     * @param {Object} tour     tour to delete
     */
    function deleteTour(tour) {
        var confirmationBox = TAG.Util.UI.PopUpConfirmation(function () {
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            // actually delete the tour
            TAG.Worktop.Database.deleteDoq(tour.Identifier, function () {
                if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.tour.text]) {
                    return;
                }
                loadTourView();
            }, authError, conflict(tour, "Delete", loadTourView), error(loadTourView));
        }, "Are you sure you want to delete " + tour.Name + "?", "Delete", true, function () { $(confirmationBox).hide(); });
        root.append(confirmationBox);
        $(confirmationBox).show();
    }

    /**Duplicate a tour
     * @method duplicateTour
     * @param {Object} tour     tour to duplicate
     * @param {Object} inputs   keys for name, description, and privateInput of tour
     */
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

        TAG.Worktop.Database.createTour(options, function (tewer) {
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
    }

    /**Save a tour
     * @method saveTour
     * @param {Object} tour     tour to save
     * @param {Object} inputs   keys for name, description, and privateInput of tour
     */
    function saveTour(tour, inputs) {
        var name = inputs.nameInput.val();
        var desc = inputs.descInput.val();

        if (name.indexOf(' ') === 0) {
            var messageBox = TAG.Util.UI.popUpMessage(null, "Tour Name cannot start with a space.", null, true);
            $(root).append(messageBox);
            $(messageBox).show();
            return;
        }

        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);

        TAG.Worktop.Database.changeTour(tour.Identifier, {
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

    // Associated Media functions:

    /**Load Associated Media view
     * @method load AssocMediaView
     * @param {Object} id   id of middle label to start on
     */
    function loadAssocMediaView(id) {
        prepareNextView(true, "Import", createAsset);
        prepareViewer(true);
        clearRight();
        var cancel = false;

        // Make an async call to get artworks
        TAG.Worktop.Database.getAssocMedia(function (result) {
            if (cancel) return;
            sortAZ(result);
            console.log('media in hand');
            if (result[0] && result[0].Metadata) {
                $.each(result, function (i, val) {
                    if (cancel) return;
                    // Add each label in a separate function in the queue so the UI doesn't lock up
                    middleQueue.add(function () {
                        if (cancel) return;
                        if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.media.text]) {
                            return;
                        }
                        var label;
                        var imagesrc;
                        switch (val.Metadata.ContentType.toLowerCase()) {
                            case 'video':
                                imagesrc = (val.Metadata.Thumbnail && !val.Metadata.Thumbnail.match(/.mp4/)) ? TAG.Worktop.Database.fixPath(val.Metadata.Thumbnail) : 'images/video_icon.svg';
                                break;
                            case 'audio':
                                imagesrc = 'images/audio_icon.svg';
                                break;
                            case 'image':
                                imagesrc = val.Metadata.Thumbnail ? TAG.Worktop.Database.fixPath(val.Metadata.Thumbnail) : 'images/image_icon.svg';
                                break;
                            default:
                                imagesrc = null;
                                break;
                        }
                        if (!prevSelectedMiddleLabel &&
                            ((id && val.Identifier === id) || (!id && i === 0))) {
                            // Select the first one
                            middleLoading.before(selectLabel(label = createMiddleLabel(val.Name, imagesrc, function () {
                                loadAssocMedia(val);
                            }, val.Identifier, false), true));

                            // Scroll to the selected label if the user hasn't already scrolled somewhere
                            if (middlebar.scrollTop() === 0 && label.offset().top - middlebar.height() > 0) {
                                middlebar.animate({
                                    scrollTop: (label.offset().top - middlebar.height())
                                }, 1000);
                            }

                            prevSelectedMiddleLabel = label;
                            loadAssocMedia(val);
                        } else {
                            middleLoading.before(label = createMiddleLabel(val.Name, imagesrc, function () {
                                loadAssocMedia(val);
                            }, val.Identifier, false));
                        }
                        // Hide if it doesn't match search criteria
                        if (!TAG.Util.searchString(val.Name, searchbar.val())) {
                            label.hide();
                        }
                    });
                });
                // Hide the loading label when we're done
                middleQueue.add(function () {
                    middleLoading.hide();
                });
            } else {
                middleLoading.hide();
            }
        });
        cancelLastSetting = function () { cancel = true; };
    }
    
    /**Loads associated media to the right side
     * @method loadAssocMedia
     * @param {Object} media    associated media to load
     */
    function loadAssocMedia(media) {
        prepareViewer(true);
        clearRight();

        // Create an img element to load the image
        var type = media.Metadata.ContentType.toLowerCase();
        var holder;
        var source = TAG.Worktop.Database.fixPath(media.Metadata.Source);
        switch (type) {
            case "image":
                holder = $(document.createElement('img'));
                break;
            case "video":
                holder = $(document.createElement('video'));
                holder.attr('id', 'videoInPreview');
                holder.attr('poster', (media.Metadata.Thumbnail && !media.Metadata.Thumbnail.match(/.mp4/)) ? TAG.Worktop.Database.fixPath(media.Metadata.Thumbnail) : '');
                holder.attr('identifier', media.Identifier);
                holder.attr("preload", "none");
                holder.attr("controls", "");
                holder.css({ "width": "100%", "max-width": "100%", "max-height": "100%" });
                holder[0].onerror = TAG.Util.videoErrorHandler(holder, viewer);
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
                holder.crossOrigin = "";
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
        var circle = TAG.Util.showProgressCircle(viewer, progressCircCSS, '0px', '0px', false);
        var selectedLabel = prevSelectedMiddleLabel;

        switch (type) {
            case "image":
                holder.load(function () {
                    // If the selection has changed since we started loading then return
                    if (prevSelectedMiddleLabel && prevSelectedMiddleLabel.text() !== media.Name) {
                        TAG.Util.removeProgressCircle(circle);
                        return;
                    }
                    TAG.Util.removeProgressCircle(circle);
                    // Set the image as a background image
                    viewer.css('background', 'black url(' + source + ') no-repeat center / contain');
                });
                break;
            case "video":
                TAG.Util.removeProgressCircle(circle);
                viewer.css('background', 'black');
                viewer.append(holder);
                break;
            case "audio":
                TAG.Util.removeProgressCircle(circle);
                viewer.css('background', 'black');
                //center the the audio element in the viewer
                viewer.append(holder);
                var left = viewer.width() / 2 - holder.width() / 2 + "px";
                var top = viewer.height() /2 - holder.height() /2 + "px";
                holder.css({ "position": "absolute", "left": left, "top" : top });
                break;
            case "text":
                TAG.Util.removeProgressCircle(circle);
                viewer.css({ 'background': 'black'});
                viewer.append(holder);
                var left = viewer.width() / 2 - holder.width() / 2 + "px";
                var top = viewer.height() / 2 - holder.height() / 2 + "px";
                holder.css({ "position": "absolute", "left": left, "top": top });
                break;
            default:
                TAG.Util.removeProgressCircle(circle);
                viewer.css('background', 'black');
                break;
        }

        // Create labels
        var titleInput = createTextInput(TAG.Util.htmlEntityDecode(media.Name) || "", true, 55);
        var descInput = createTextAreaInput(TAG.Util.htmlEntityDecode(media.Metadata.Description).replace(/\n/g,'<br />') || "", true);

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
                var confirmationBox = TAG.Util.UI.PopUpConfirmation(function () {
                    prepareNextView(false);
                    clearRight();
                    prepareViewer(true);

                    // stupid way to force associated artworks to increment their linq counts and refresh their lists of media
                    TAG.Worktop.Database.changeHotspot(media.Identifier, { Name: media.Name }, function () {
                        // success handler
                        TAG.Worktop.Database.deleteDoq(media.Identifier, function () {
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

    /**Save an associated media
     * @method saveAssocMedia
     * @param {Object} media    associated media to save
     * @param {Object} inputs   keys for media title and description
     */
    function saveAssocMedia(media, inputs) {
        var name = inputs.titleInput.val();
        var desc = inputs.descInput.val();

        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);

        TAG.Worktop.Database.changeHotspot(media, {
            Name: name,
            Description: desc,
        }, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.media.text]) {
                return;
            }
            loadAssocMediaView(media.Identifier);
        }, authError, conflict(media, "Update", loadAssocMediaView), error(loadAssocMediaView));
    }

    /**Brings up an artwork chooser for a particular associated media
     * @method assocToArtworks
     * @param {Object} media    media to associate to artworks
     */
    function assocToArtworks(media) {
        artworkAssociations = [[]];
        numFiles = 1;
        TAG.Util.UI.createAssociationPicker(root, "Choose artworks", { comp: media, type: 'media' }, "artwork", [{
            name: "All Artworks",
            getObjs: TAG.Worktop.Database.getArtworks
        }], {
            getObjs: TAG.Worktop.Database.getArtworksAssocTo,
            args: [media.Identifier]
        }, function () { });
    }

    /**Generate thumbnail for associated media
     * @method generateAssocMediaThumbnail
     * @param {Object} media        media to generate thumbnail for
     */
    function generateAssocMediaThumbnail(media) {
        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);
        TAG.Worktop.Database.changeHotspot(media.Identifier, { Thumbnail: 'generate' }, function () {
            console.log('success?');
            loadAssocMediaView(media.Identifier);
        }, unauth, conflict, error);
    }

    /**
     * @method createAsset
     */
    function createAsset() {
        uploadFile(TAG.Authoring.FileUploadTypes.AssociatedMedia, function (urls, names, contentTypes, files) {
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
                    TAG.Worktop.Database.changeHotspot(newDoq.Identifier, options, incrDone, TAG.Util.multiFnHandler(authError, incrDone), TAG.Util.multiFnHandler(conflict(newDoq, "Update", incrDone)), error(incrDone));
                } catch (error) {
                    done++;
                    console.log("error in uploading: " + error.message);
                    return;
                }
            }
        }, true, ['.jpg', '.png', '.gif', '.tif', '.tiff', '.mp4', '.mp3']);
    }

    /**Create an associated media (import), possibly more than one
     * @method createMedia
     */
    function createMedia() {
        batchAssMedia();
    }

    /**
     * @method batchAssMedia
     */
    function batchAssMedia() {
        var uniqueUrls = []; // Used to make sure we don't override data for the wrong media (not actually airtight but w/e)
        mediaMetadata = [];
        artworkAssociations = [];
        numFiles = 0;
        isUploading = true;
        assetUploader = TAG.Authoring.FileUploader( // multi-file upload now
            root,
            TAG.Authoring.FileUploadTypes.AssociatedMedia,
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

    /**
     * @method saveAssMedia
     * @param i the index of the asset 
     */
    function saveAssMedia(i) {
        var len = artworkAssociations[i].length;
        uploadHotspotHelper(i, 0, len);
    }

    /**
     * Uploads hotspot i to artwork j in its list of artworks to associate to.
     * @method uploadHotspotHelper
     * @param i    the index of the asset we're uploading
     * @param j    each asset has a list of artworks it'll be associated with; j is the index in this list
     * @param len  the length of the list above
     */
    function uploadHotspotHelper(i, j, len) {
        // uploads hotspot hotspot i to artwork j in its list
        var activeMM = mediaMetadata[i];
        uploadHotspot(artworkAssociations[i][j], { // this info isn't changing, so maybe we can do this more easily in uploadHotspot
            title: TAG.Util.encodeXML(activeMM.title || 'Untitled media'),
            desc: TAG.Util.encodeXML(''),
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

    /**
     * @method uploadHotspot
     * @param artwork
     * @param info
     * @param i
     * @param j
     * @param len
     */
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

        TAG.Worktop.Database.createHotspot(artwork.CreatorID, artwork.Identifier, createHotspotHelper);

        /**
         * @method createHotspotHelper
         * @param isNewAsset
         * @param xmlHotspot
         */
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
            hotspotContentDoq = $.parseXML(TAG.Worktop.Database.getDoqXML(hotspotContentId));
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
            TAG.Worktop.Database.pushLinq(xmlHotspot, hotspotId);
            TAG.Worktop.Database.pushXML(hotspotContentDoq, hotspotContentId);
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

    // Art Functions:

    /**Loads art view
     * @method loadArtView
     * @param {Object} id   id of middle label to start on
     */
    function loadArtView(id) {
        prepareNextView(true, "Import", createArtwork);
        prepareViewer(true);
        clearRight();
        var cancel = false;

        // Make an async call to get artworks
        TAG.Worktop.Database.getArtworks(function (result) {
            if (cancel) return;
            sortAZ(result);
            if (result[0] && result[0].Metadata) {
                $.each(result, function (i, val) {
                    if (cancel) return;
                    // Add each label in a separate function in the queue
                    // so the UI doesn't lock up
                    val.Name = TAG.Util.htmlEntityDecode(val.Name);
                    middleQueue.add(function () {
                        if (cancel) return;
                        if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.art.text]) {
                            return;
                        }
                        var label;
                        var imagesrc;
                        switch (val.Metadata.Type) {
                            case 'Artwork':
                                imagesrc = TAG.Worktop.Database.fixPath(val.Metadata.Thumbnail);
                                break;
                            case 'VideoArtwork':
                                imagesrc = val.Metadata.Thumbnail ? TAG.Worktop.Database.fixPath(val.Metadata.Thumbnail) : "images/video_icon.svg";
                                break
                            default:
                                imagesrc = null;
                        }
                        if (!prevSelectedMiddleLabel &&
                            ((id && val.Identifier === id) || (!id && i === 0))) {
                            // Select the first one
                            middleLoading.before(selectLabel(label = createMiddleLabel(val.Name, imagesrc, function () {
                                loadArtwork(val);
                            }, val.Identifier, false, function () {
                                editArtwork(val);
                            }, true, val.Extension), true));

                            // Scroll to the selected label if the user hasn't already scrolled somewhere
                            if (middlebar.scrollTop() === 0 && label.offset().top - middlebar.height() > 0) {
                                middlebar.animate({
                                    scrollTop: (label.offset().top - middlebar.height())
                                }, 1000);
                            }

                            prevSelectedMiddleLabel = label;
                            loadArtwork(val);
                        } else {
                            middleLoading.before(label = createMiddleLabel(val.Name, imagesrc, function () {
                                loadArtwork(val);
                            }, val.Identifier, false, function () {
                                editArtwork(val);
                            }, true, val.Extension));
                        }
                        // Hide if it doesn't match search criteria
                        if (!TAG.Util.searchString(val.Name, searchbar.val())) {
                            label.hide();
                        }
                    });
                });
                // Hide the loading label when we're done
                middleQueue.add(function () {
                    middleLoading.hide();
                });
            } else {
                middleLoading.hide();
            }
        });

        cancelLastSetting = function () { cancel = true; };
    }

    /**Loads an artwork to the right side
     * @method loadArtwork
     * @param {Object} artwork  artwork to load
     */
    function loadArtwork(artwork) {
        prepareViewer(true);
        clearRight();

        // Create an img element to load the image
        var mediaElement;
        if (artwork.Metadata.Type !== 'VideoArtwork') {
            mediaElement = $(document.createElement('img'));
            mediaElement.attr('src', TAG.Worktop.Database.fixPath(artwork.URL));
        } else {
            mediaElement = $(document.createElement('video'));
            mediaElement.attr('id', 'videoInPreview');
            mediaElement.attr('poster', (artwork.Metadata.Thumbnail && !artwork.Metadata.Thumbnail.match(/.mp4/)) ? TAG.Worktop.Database.fixPath(artwork.Metadata.Thumbnail) : '');
            mediaElement.attr('identifier', artwork.Identifier);
            mediaElement.attr("preload", "none");
            mediaElement.attr("controls", "");
            mediaElement.css({ "width": "100%", "max-width": "100%", "max-height": "100%" });
            mediaElement.attr('src', TAG.Worktop.Database.fixPath(artwork.Metadata.Source));
            mediaElement[0].onerror = TAG.Util.videoErrorHandler(mediaElement, viewer);
        }
        mediaElement.crossOrigin = "";
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
            circle = TAG.Util.showProgressCircle(viewer, progressCircCSS, '0px', '0px', false);
        }
        var selectedLabel = prevSelectedMiddleLabel;

        if (artwork.Metadata.Type !== 'VideoArtwork') {
            mediaElement.load(function () {
                // If the selection has changed since we started loading then return
                if (prevSelectedMiddleLabel && prevSelectedMiddleLabel.text() !== artwork.Name) {
                    TAG.Util.removeProgressCircle(circle);
                    return;
                }
                TAG.Util.removeProgressCircle(circle);
                // Set the image as a background image
                viewer.css('background', 'black url(' + TAG.Worktop.Database.fixPath(artwork.URL) + ') no-repeat center / contain');
            });
        } else {
            viewer.append(mediaElement);
        }
        var titleInput = createTextInput(TAG.Util.htmlEntityDecode(artwork.Name), true, 55);
        var artistInput = createTextInput(TAG.Util.htmlEntityDecode(artwork.Metadata.Artist), true, 55);
        var yearInput = createTextInput(TAG.Util.htmlEntityDecode(artwork.Metadata.Year), true, 20);
        var descInput = createTextAreaInput(TAG.Util.htmlEntityDecode(artwork.Metadata.Description).replace(/\n/g, '<br />') || "", "", false);
        var customInputs = {};
        var customSettings = {};

        if (artwork.Metadata.InfoFields) {
            $.each(artwork.Metadata.InfoFields, function (key, val) {
                customInputs[key] = createTextInput(TAG.Util.htmlEntityDecode(val), true);
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
                    artistInput: artistInput,   //Artwork artist
                    nameInput: titleInput,      //Artwork title
                    yearInput: yearInput,       //Artwork year
                    descInput: descInput,       //Artwork description
                    customInputs: customInputs, //Artwork custom info fields
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

    /**Save Thumbnail image 
     * @method saveThumbnail
     * @param {Object} component
     * @param {Boolean} isArtwork
     */
    function saveThumbnail(component, isArtwork) {
        var id = $('#videoInPreview').attr('identifier');
        var pop = Popcorn('#videoInPreview');
        var time = $('#videoInPreview')[0].currentTime;
        var dataurl = pop.capture({ type: 'jpg' }); // modified popcorn.capture a bit to
        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);
        TAG.Worktop.Database.uploadImage(dataurl, function (imageURL) {
            if (isArtwork) {
                TAG.Worktop.Database.changeArtwork(id, { Thumbnail: imageURL }, function () {
                    console.log("success?");
                    loadArtView(component.Identifier);
                }, unauth, conflict, error);
            
            } else { // here, it must be a video assoc media
                TAG.Worktop.Database.changeHotspot(id, { Thumbnail: imageURL }, function () {
                    console.log("success?");
                    loadAssocMediaView(component.Identifier);
                }, unauth, conflict, error);
            }
        }, unauth, error);
    }

    function unauth() {
        dialogOverlay.hide();
        var popup = TAG.Util.UI.popUpMessage(null, "Thumbnail not saved.  You must log in to save changes.");
        $('body').append(popup);
        $(popup).show();
    }

    function conflict(jqXHR, ajaxCall) {
        ajaxCall.force();
    }

    function error() {
        dialogOverlay.hide();
        var popup = TAG.Util.UI.popUpMessage(null, "Thumbnail not saved.  There was an error contacting the server.");
        $('body').append(popup);
        $(popup).show();
    }

    /**Create an artwork (import), possibly more than one
     * @method createArtwork
     */
    function createArtwork() {
        uploadFile(TAG.Authoring.FileUploadTypes.DeepZoom, function (urls, names, contentTypes, files) {
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
                TAG.Worktop.Database.changeArtwork(newDoq.Identifier, ops, incrDone, TAG.Util.multiFnHandler(authError, incrDone), TAG.Util.multiFnHandler(conflict(newDoq, "Update", incrDone)), error(incrDone));
            }

        }, true, ['.jpg', '.png', '.gif', '.tif', '.tiff', '.mp4']);
    }

    /**Edit an artwork
     * @method editArtwork
     * @param {Object} artwork   artwork to edit
     */
    function editArtwork(artwork) {
        // Overlay doesn't spin... not sure how to fix without redoing tour authoring to be more async
        loadingOverlay('Loading Artwork...');
        middleQueue.clear();
        rightQueue.clear();
        setTimeout(function () {
            TAG.Util.UI.slidePageLeft((new TAG.Layout.ArtworkEditor(artwork)).getRoot());
        }, 1);
    }

    /**Delete an artwork
     * @method deleteArtwork
     * @param {Object} artwork      artwork to delete
     */
    function deleteArtwork(artwork) {
        var confirmationBox = TAG.Util.UI.PopUpConfirmation(function () {
            prepareNextView(false);
            clearRight();
            prepareViewer(true);

            // actually delete the artwork
            TAG.Worktop.Database.deleteDoq(artwork.Identifier, function () {
                if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.art.text]) {
                    return;
                }
                loadArtView();
            }, authError, authError);
        }, "Are you sure you want to delete " + artwork.Name + "?", "Delete", true, function () { $(confirmationBox).hide() });
        root.append(confirmationBox);
        $(confirmationBox).show();
    }

    /**Save an artwork
     * @method saveArtwork
     * @param {Object} artwork      artwork to save
     * @param {Object} inputs       keys for artwork info from input fields
     */
    function saveArtwork(artwork, inputs) {
        var name = inputs.nameInput.val();
        var artist = inputs.artistInput.val();
        var year = inputs.yearInput.val();
        var description = inputs.descInput.val();

        var infoFields = {};
        $.each(inputs.customInputs, function (key, val) {
            infoFields[key] = val.val();
        });

        prepareNextView(false, null, null, "Saving...");
        clearRight();
        prepareViewer(true);
        
        TAG.Worktop.Database.changeArtwork(artwork, {
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

    // Feedback Functions:

    /**Loads Feedback view
     * @method loadFeedbackView
     * @param {Object} id   id of middle label to start on
     */
    function loadFeedbackView(id) {
        prepareNextView(true, "");
        prepareViewer(false);
        clearRight();

        var cancel = false;
        // Make an async call to get feedback
        TAG.Worktop.Database.getFeedback(function (result) {
            if (cancel) return;
            sortDate(result);

            $.each(result, function (i, val) {
                if (cancel) return false;
                // Add each label as a separate function to the queue so the UI doesn't lock up
                middleQueue.add(function () {
                    if (cancel) return;
                    if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.feedback.text]) {
                        return;
                    }
                    var label;
                    var text = $.datepicker.formatDate('(m/dd/yy) ', new Date(val.Metadata.Date * 1000)) + val.Metadata.Feedback;
                    if (!prevSelectedMiddleLabel &&
                        ((id && val.Identifier === id) || (!id && i === 0))) {
                        // Select the first one
                        middleLoading.before(selectLabel(label = createMiddleLabel(text, null, function () {
                            loadFeedback(val);
                        }, val.Identifier, true)));

                        // Scroll to the selected label if the user hasn't already scrolled somewhere
                        if (middlebar.scrollTop() === 0 && label.offset().top - middlebar.height() > 0) {
                            middlebar.animate({
                                scrollTop: (label.offset().top - middlebar.height())
                            }, 1000);
                        }

                        prevSelectedMiddleLabel = label;
                        loadFeedback(val);
                    } else {
                        middleLoading.before(label = createMiddleLabel(text, null, function () {
                            loadFeedback(val);
                        }, val.Identifier, true));
                    }
                    // Hide if it doesn't match search criteria
                    if (!TAG.Util.searchString(text, searchbar.val())) {
                        label.hide();
                    }
                });
            });
            // Hide the loading label when we're done
            middleQueue.add(function () {
                middleLoading.hide();
            });
        });
        cancelLastSetting = function () { cancel = true; };
    }

    /** Loads feedback to right side of screen
     * @method loadFeedback
     * @param {Object} feedback     feedback to load
     */
    function loadFeedback(feedback) {
        clearRight();
        prepareViewer(true, feedback.Metadata.Feedback);

        var sourceLabel = createLabel('Loading...');
        var dateLabel = createLabel($.datepicker.formatDate('DD, MM d, yy ', new Date(feedback.Metadata.Date * 1000)));
        var source = createSetting('Submitted From', sourceLabel);
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

    /**Get source of feedback
     * @method getSourceName
     * @param {Object} feedback     feedback to get source of
     * @param {Function} onSuccess  function called if source found
     * @param {Function} onDeleted  function called if source has been deleted
     * @param {Function} onError    function called if there is an error 
     */
    function getSourceName(feedback, onSuccess, onDeleted, onError) {
        TAG.Worktop.Database.getDoq(feedback.Metadata.SourceID,
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

    /**Switch view to source of feedback
     * @method followSource
     * @param {Object} feedback     feedback to follow source of
     */
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

    /**Delete a feedback
     * @method deleteFeedback
     * @param {Object} feedback     feedback to delete
     */
    function deleteFeedback(feedback) {
        prepareNextView(false);
        clearRight();

        // actually delete the feedback
        TAG.Worktop.Database.deleteDoq(feedback.Identifier, function () {
            if (prevSelectedSetting && prevSelectedSetting !== nav[NAV_TEXT.feedback.text]) {
                return;
            }
            loadFeedbackView();
        }, authError, conflict(feedback), error(loadFeedbackView));
    }

    //Middle Bar Functions:

    /**Create a middle label 
     * @method createMiddleLabel
     * @param  {String} text            the text of the label
     * @param imagesrc                  the source for the image. If not specified no image added
     * @param {Function} onclick        the onclick function for the label
     * @param {Object} id               id to set if specified
     * @param {Function} onDoubleClick  function for double click
     * @param {Boolean} inArtMode 
     * @param extension                 to check if is video or static art
     * @return {Object} container       the container of the new label
     */
    function createMiddleLabel(text, imagesrc, onclick, id, noexpand, onDoubleClick, inArtMode, extension) {
        var container = $(document.createElement('div'));
        text = TAG.Util.htmlEntityDecode(text);
        container.attr('class', 'middleLabel');
        if (id) {
            container.attr('id', id);
        }

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
            if (prevSelectedMiddleLabel == container)
                return;
            resetLabels('.middleLabel');
            selectLabel(container, !noexpand);
            if (onclick)
                onclick();
            prevSelectedMiddleLabel = container;
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
            var circle = TAG.Util.showProgressCircle(container, progressCircCSS, '0px', '0px', false);
            image.load(function () {
                TAG.Util.removeProgressCircle(circle);
            });
            width = '75%';
        } else {
            width = '95%';
        }

        var label = $(document.createElement('div'));
        label.attr('class', 'labelText');
        label.css({'width': width});

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

    /**Set up the middle bar for the next view
     * @method prepareNextView
     * @param {Boolean} showSearch      if true show search bar, otherwise hide
     * @param {String} newText          text for the 'New' button
     * @param {Function} newBehavior    onclick function for the 'New' button
     * @param {String} loadingText      Text to display while middle bar loading
     */
    function prepareNextView(showSearch, newText, newBehavior, loadingText) {
        middleQueue.clear();
        middleLabelContainer.empty();
        middleLabelContainer.append(middleLoading);
        middleLoading.show();
        secondaryButton.css("display", "none");
        newButton.text(newText);
        newButton.unbind('click').click(newBehavior);
        if (!newText) newButton.hide();
        else newButton.show();
        prevSelectedMiddleLabel = null;
        if (cancelLastSetting) cancelLastSetting();

        if (loadingText) {
            middleLoading.children('label').text(loadingText);
        } else {
            middleLoading.children('label').text('Loading...');
        }

        if (showSearch) {
            searchContainer.show();
            searchContainer.css('display', 'inline-block');
            searchbar.val("");
        } else {
            searchContainer.hide();
        }
    }

    /**Clears the right side
     * @method clearRight
     */
    function clearRight() {
        settingsContainer.empty();
        buttonContainer.empty();
        rightQueue.clear();
    }

    /**Prepares the viewer on the right side
     * @method prepareViewer
     * @param {Boolean} showViewer    whether the preview window is shown 
     * @param {String} text           text to add to the viewer (in a textbox)
     * @param {Boolean} showButtons   whether the buttonContainer is shown
     */
    function prepareViewer(showViewer,text, showButtons) { 
        viewer.empty();
        viewer.css('background', 'black');
        if (showViewer) {
            viewer.show();
            buttonContainer.show();
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
            settings.css({
                'height': ($(window).height() * CONTENT_HEIGHT / 100) -
                (BUTTON_HEIGHT * 1) + 'px',
            });
        }
        if (showButtons===false){
            buttonContainer.hide();
        }
    }

    //Helper methods for label interaction:

    /**Clicks an element determined by a jquery selector when it is added to the page
     * @method clickWhenReady
     * @param selector
     * @param maxtries
     * @param tries
     */
    function clickWhenReady(selector, maxtries, tries) {
        doWhenReady(selector, function (elem) { elem.click(); }, maxtries, tries);
    }

    /** Calls passed in function when the element determined by the selector
     *  is added to the page
     * @method doWhenReady
     * @param {Object} selector     class or id of object(s) on which fn is performed     
     * @param {Function} fn
     * @param maxtries
     * @param tries
     */
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

    /**Reset mouse interaction for labels
     * @method resetLabels
     * @param {Object} selector     class of labels to reset
     */
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

    /**Select a label by unbinding mouse events and highlighting
     * @method selectLabel
     * @param {Object} label    label to select
     * @param {Boolean} expand  if label expands when selected   
     * @return {Object} label   selected label   
     */
    function selectLabel(label, expand) {
        label.css('background', HIGHLIGHT);
        label.unbind('mousedown').unbind('mouseleave').unbind('mouseup');

        if (expand) {
            label.css('height', '');
            label.children('div').css('white-space', '');

            if (prevSelectedMiddleLabel) {
                prevSelectedMiddleLabel.children('div').css('white-space', 'nowrap');
            }
        }
        return label;
    }

    /**Disable a label, unbinding mouse events
     * @method disableLabel
     * @param {Object} label         label to disable
     * @return {Object} label        disabled label
     */
    function disableLabel(label) {
        label.css({
            'color': 'gray',
        });
        label.unbind('mousedown').unbind('mouseleave').unbind('mouseup').unbind('click').attr('disabled', true);
        return label;
    }

   
    //Settings functions:

    /**Gets the height of the settings section since the viewer has to be positioned absolutely,
     *the entire right bar needs to be position absolutely. Settings has bottom: 0, so the height needs to be correct
     * to not have this be under the buttons container.  If any of the heights of the right components changes it should be
     * updated here.
     * @method getSettingsHeight
     * @return height       appropriate height for settings
     */
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

    /**Creates a setting to be inserted into the settings container
     * @method createSetting
     * @param {String} text     text for the setting
     * @param {Object} input    the input for the setting
     * @param width             if not falsey then assumed to be number represengint percent, must be less than 95
     * @return container        container of new setting
     */
    function createSetting(text, input, width) {
        var container = $(document.createElement('div'));
        container.attr('class', 'settingLine');

        var label = $(document.createElement('div'));
        label.css({
            'width': width ? 45 - (width - 50) + '%' : '45%',
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
        });

        var clear = $(document.createElement('div'));
        clear.css('clear', 'both');

        container.append(label);
        container.append(input);
        container.append(clear);

        return container;
    }

    //Helper functions:

    /** Create a button 
     * @method createButton
     * @param {String} text         button text
     * @param {Function} onclick    onclick function for button
     * @param css                   additional css to apply to button if specified
     * @return {Object} button      new button created
     */
    function createButton(text, onclick, css) {
        var button = $(document.createElement('button')).text(text);
        button.attr('type', 'button');
        button.attr('class','button');
        if (css) {
            button.css(css);
        }
        button.click(onclick);
        return button;
    }

    /**Create a label
     * @method createLabel
     * @param {String} text         label text
     * @return {Object} label       new label created
     */
    function createLabel(text) {
        var label = $(document.createElement('label')).text(text || "");
        return label;
    }

    /**Create a text input
     * @method createTextInput
     * @param {String} text         the default text for the input
     * @param {Boolean} defaultval  if true, reset to default text if empty and loses focus
     * @param maxlength             max length of the input in characters
     * @param hideOnClick
     * @return input                newly created input
     */
    function createTextInput(text, defaultval, maxlength, hideOnClick) {
        var input = $(document.createElement('input')).val(text);
        input.attr({
            'type': 'text',
            'maxlength': maxlength
        });
        return input;
    }

    /**Create a text area input 
     * @method createTextAreaInput
     * @param {String} text     default text for area
     * @param defaultval
     * @param hideOnClick
     * @return {Object} input    newly creted text input
     */
    function createTextAreaInput(text, defaultval, hideOnClick) {
        if (typeof text === 'string')
            text = text.replace(/<br \/>/g, '\n').replace(/<br>/g, '\n').replace(/<br\/>/g, '\n');
        var input = $(document.createElement('textarea')).val(text);
        input.autoSize();
        doWhenReady(input, function (elem) {
            var realHeight = input[0].scrollHeight;
            $(input).css('height', realHeight + 'px');
        });
        return input;
    }

    /**Create a color input which modifies the background color
     * of all elements matching the jquery selector 'selector'.
     * @method creatBGColorInput 
     * @param color 
     * @param selector                      jQuery selector for elements to be changed
     * @param {Function} getTransValue      returns a valid transparency value  
     * @return {Object} container           returns container holding new input
     */
    function createBGColorInput(color, selector, getTransValue) {
        if (color.indexOf('#') !== -1) {
            color = color.substring(1, color.length);
        }
        var container = $(document.createElement('input'));
        container.attr('type', 'text');
        var picker = new jscolor.color(container[0], {});
        var hex = TAG.Util.UI.colorToHex(color);
        container.val(color);
        picker.fromString(color);
        picker.onImmediateChange = function () {
            updateBGColor(selector, container.val(), getTransValue());
        };
        return container;
    }

    /**Set the bg color of elements maching jquery selector 'selector'
     * @method updateBGColor 
     * @param selector          jQuery selector of elements to be changed
     * @param hex               hex value of color
     * @param trans             transparency of color
     */
    function updateBGColor(selector, hex, trans) {
        $(selector).css('background-color', TAG.Util.UI.hexToRGB(hex) + trans / 100.0 + ')');

    }

    /**Prevent a container from being clicked on by added a div on top of it
     * @method preventClickthrough
     * @param {Object} container     container to prevent click through of
     */
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

    /**Sort a list with propery Name alphabetically, case insensitive
     * @method sortAZ
     * @param {Object} list
     * @return 
     */
    function sortAZ(list) {
        if (list.sort) {
            list.sort(function (a, b) {
                var aLower = a.Name.toLowerCase();
                var bLower = b.Name.toLowerCase();
                return (aLower < bLower) ? -1 : 1;
            });
        }
    }

    /**Sort a list with date metadata by date with most recent date first
     * @method sortDate
     * @param {Object} list 
     * @return 
     */
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

    /**Perform a search 
     * @method search
     * @param val           value to search for
     * @param selector      jQuery selector of elements to search
     * @param childType     selector's type
     */
    function search(val, selector, childType) {
        $.each($(selector), function (i, child) {
            if ($(child).attr('id') === 'middleLoading')
                return;
            if (TAG.Util.searchString($(child).children(childType).text(), val)) {
                $(child).show();
            } else {
                $(child).hide();
            }
        });
    }

    /**Search data
     * @param val       value to search for
     * @param selector  jQuery selector for elements to be searched
     */
    function searchData(val, selector) {
        $.each($(selector), function (i, element) {
            var data = $(element).data();
            var show = false;
            $.each(data, function (k, v) {
                if (TAG.Util.searchString(v, val)) {
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

    /**Update text on change
     * @method onChangeUpdateText
     * @param {Object} input    input to update
     * @param selector          jQuery selector of element to update
     * @param maxLength         maximum text length in characters
     * @return {Object}         updated input
     */
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

    /**Update a text input that takes in a number
     * @method onChangeUpdateNum
     * @param {Object} input            input to update
     * @param min                       minimum value of inputted number
     * @param max                       maximum value of inputted number
     * @param {Function} doOnChange     performed if input value is number between min and max   
     */
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


    /**from JavaScript: The Good Parts
     * @method is_array
     * @param value         value to check
     * @return {Boolean}    if value is an array
     */
    function is_array(value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    /** Upload a file then calls the callback with the url and name of the file.
     * @method uploadFIle
     * @param type                  See TAG.Authoring.FileUploader for 'type' values
     * @param {Function} callback   
     * @param multiple              for batch upload
     * @param filter    
     */
    function uploadFile(type, callback, multiple, filter) {
        var names = [], locals = [], contentTypes = [], fileArray, i;
        TAG.Authoring.FileUploader( // remember, this is a multi-file upload
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
                root.append(TAG.Util.UI.popUpMessage(null, "There was an error uploading the file.  Please try again later."));
            },
            !!multiple // batch upload disabled
            );
    }

    /**Create an overlay over the whole settings view with a spinning circle and centered text. This overlay is intended to be used 
     * only when the page is 'done'.  The overlay doesn't support being removed from the page, so only call this when the page will 
     * be changed!
     * @method loadingOverlay
     * @param {String} text     Text defaults to 'Loading...' if not specified. 
     */
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
    
    /** Authentication error function
     * @method authError
     */
    function authError() {
        var popup = TAG.Util.UI.popUpMessage(function () {
            TAG.Auth.clearToken();
            rightQueue.clear();
            middleQueue.clear();
            TAG.Layout.StartPage(null, function (page) {
                TAG.Util.UI.slidePageRight(page);
            });
        }, "Could not authenticate, returning to the splash page.", null, true);
        root.append(popup);
        $(popup).show();
    }

    /**Error function
     * @method error
     * @param {Function} fn     function called if specified
     */
    function error(fn) {
        return function () {
            var popup = TAG.Util.UI.popUpMessage(null, "An unknown error occured.", null, true);
            root.append(popup);
            $(popup).show();
            fn && fn();
        }
    }

    /**Conflict function
    * @method conflict
    * @param doq            doq for which there is a conflict
    * @param {String} text      
    * @param fail
    */
    function conflict(doq, text, fail) {
        return function (jqXHR, ajaxCall) {
            var confirmationBox = TAG.Util.UI.PopUpConfirmation(function () {
                ajaxCall.force();
                // TODO: Text for change/delete
            }, "Your version of " + doq.Name + " is not up to date.  Are you sure you want to change " + doq.Name + "?", text, true, fail);
            root.append(confirmationBox);
            $(confirmationBox).show();
        }
    }

    return that;
};