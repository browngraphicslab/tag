﻿LADS.Util.makeNamespace("LADS.Layout.InternetFailurePage");
LADS.Util.makeNamespace("LADS.Layout.InternetFailure");

LADS.Layout.InternetFailure.lastOverlay = {};

/*
    BM - Using this for more than internet failure, should
    be renamed/refactored in the future.
*/

/**
 * Internet failure page, which appears when TAG detects a loss of internet.
 * @class LADS.Layout.InternetFailurePage.js
 * @constructor
 * @param {String} errorType     the type of connectivity error
 * @param {Boolean} detach       used in Win8 app
 */
LADS.Layout.InternetFailurePage = function (errorType, detach) {
    "use strict";

    this.getRoot = function () {
        return root;
    };

    var root,
        mainPanel,
        needPassword = false, // used to determine whether password input box appears
        DATA_LIMIT = "Data Limit",
        SERVER_DOWN = "Server Down",
        NO_INTERNET = "No Internet",
        INTERNET_LOST = "Internet Lost";

    init();

    /**
     * Sets up internet failure page (handlers, etc) using the input errorType
     * @method init
     */

    function init() {
        root = LADS.Util.getHtmlAjax('InternetFailurePage.html');
        root.css("width", $("#tagRoot").width());
        root.css("height", $("#tagRoot").height());
	    mainPanel=root.find("#mainPanel");
	    mainPanel.css("width", $("#tagRoot").width());
        mainPanel.css("height", $("#tagRoot").height());

        var sadface = root.find('#sadFace');
        var noticeBox = root.find('#noticeBox');

        var noticeLabel = root.find('#noticeLabel');//$(document.createElement('label'));
        // noticeLabel.css({ 'color': 'white', 'font-size': '30px', 'left-margin': '4%', 'width': '96%' });

        var noticeText = getNoticeText(errorType);

        noticeLabel.text(noticeText);
        noticeBox.append(noticeLabel).append("<br>");

        var reconnectButton = root.find('#reconnectButton');
        var changeServerButton = root.find('#changeServerButton');

	    changeServerButton.text('Change Server');
        changeServerButton.css({ 'font-size': '150%', 'position': 'relative', 'left': '50%', 'top': '5%' });

        changeServerButton.on('click', LADS.Util.UI.ChangeServerDialog);

        if (errorType === DATA_LIMIT) {
            reconnectButton.text('I Agree');

            var disagreeButton = $(document.createElement('button'));
            disagreeButton.text('I Disagree');
            disagreeButton.css({ 'font-size': '150%', 'position': 'relative', 'left': '45%', 'top': '5%' });
            noticeBox.append(disagreeButton);
            disagreeButton.click(function () {
                window.close();
            });
            reconnectButton.click(function () {
                localStorage.acceptDataUsage = "true";
                if (!detach) {
                    LADS.Layout.StartPage(null, function (root) {
                        LADS.Util.Splitscreen.setOn(false);
                        LADS.Util.UI.slidePageRight(root);
                    }, true);
                } else {
                    root.remove();
                }
            });

        }
        else if (errorType === SERVER_DOWN) {
            reconnectButton.text('Reconnect');
            reconnectButton.css({ 'font-size': '150%', 'position': 'relative', 'left': '30%', 'top': '5%' });
        } else {
            reconnectButton.text('Reconnect');
            reconnectButton.css({ 'font-size': '150%', 'position': 'relative', 'left': '53%', 'top': '5%' });
        }


        if (errorType !== DATA_LIMIT) {
            reconnectButton.click(function () {

                noticeLabel.text("Reconnecting...");
                reconnectButton.hide();
                sadface.hide();

                setTimeout(function () { // this timeout is here because the label didn't have time to reset itself otherwise
                    $.ajax({
                        url: 'http://' + localStorage.ip + ':8080',
                        dataType: "text",
                        async: false,
                        cache: false,
                        success: function () {
                            if (!detach) {
                                LADS.Layout.StartPage(null, function (root) {
                                    LADS.Util.Splitscreen.setOn(false);
                                    LADS.Util.UI.slidePageRight(root);
                                }, true);
                            
                            } else {
                                root.remove();
                            }
                        },
                        error: function (err) {
                            $.ajax({
                                url: "http://google.com",
                                dataType: "text",
                                async: true,
                                cache: false,
                                success: function () {
                                    noticeLabel.text(getNoticeText("Server Down"));
                                    reconnectButton.show();
                                },
                                error: function (err) {
                                    noticeLabel.text(getNoticeText((errorType === "Internet Lost" ? "Internet Lost" : "No Internet")));
                                    reconnectButton.show();
                                }
                            });
                        }
                    });
                }, 100);
            });
        }

        /**
         * Returns a notice message given a certain connectivity error.
         * @method getNoticeText
         * @param {String} error       the error type
         * @return {String}            an error message to be displayed
         */
        function getNoticeText(error) {
            if (error == SERVER_DOWN)
                return "The server is currently unavailable. Please contact the museum administrator for further information.";
            else if (error == NO_INTERNET)
                return 'No internet connection was detected. The TAG application requires internet connectivity. Please ensure that you are connected to the internet and try again.';
            else if (error === INTERNET_LOST)
                return 'Internet connection lost. The TAG application requires internet connectivity. Please ensure that you are connected to the internet and try again.';
            else if (error === DATA_LIMIT)
                return 'We have detected that you are on a limited data connection. TAG downloads large images, audio, and videos that can significantly increase your data usage.  By clicking "I Agree" you agree to allow TAG to download images, audio, and videos.  Clicking "I Disagree" will exit TAG.';
            return "";
        }

        var quitButton = $(document.createElement('button'));
        quitButton.text('Exit');

        quitButton.click(function () {

        });
	
	    noticeBox.append(changeServerButton);
        noticeBox.append(reconnectButton);

        mainPanel.append(sadface);
        mainPanel.append(noticeBox);
 	
        root.append(mainPanel);

        LADS.Layout.InternetFailure.lastOverlay.root = root;
        LADS.Layout.InternetFailure.lastOverlay.type = errorType;
    }
};
