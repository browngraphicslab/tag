LADS.Util.makeNamespace("LADS.Catalog.Timeline");

LADS.Catalog.Timeline = function (exhibition, elt, catalog, artworks) {
    "use strict";

    this.setDisplayTag = function (tag) {
        sortArtworks(tag);
    };

    this.sortTimeline = function (sortBy) {
        sortArtworks(sortBy);
    };

    this.addPickedHandler = function addPickedHandler(handler) {
        pickedHandlers.push(handler);
    };

    this.removePickedHandler = function removePickedHandler(handler) {
        var idx = pickedHandlers.indexOf(handler);
        if (idx != -1) pickedHandlers.splice(idx, 1);
    };

    this.setExhibition = function (f2) {
        exhibition = f2;
    };

    this.showDoq = function (doq) {
        $(root).stop();
        var children = $(root).children().children();
        var guid = doq.Identifier;
        var elt = null;
        for (var i = 0; i < children.length; i++) {
            var guid2 = children[i].__data__.Identifier;
            var title = children[i].__data__.Metadata.title;
            if (guid2 === guid) {
                elt = children[i];
                break;
            }
        }
        if (elt) {
            var left = elt.getAttribute("x");
            $(root).animate({ 'scrollLeft': left + 'px' }, 750);
        }
    };

    //This function is called from the search and filter class to filter the timeline
    //as the user types in.
    this.draw = function (artwrks) {
        if (artwrks) {
            artworks = artwrks;
            draw();

        }
        draw();
    };


    function pickedDocument(doq, element) {
        for (var i = 0; i < pickedHandlers.length; i++) {
            pickedHandlers[i]({ doq: doq, element: element });
        }
    }

    var pickedHandlers = [];
    var currentSort = "Title";
    //LADS.Worktop.Database.getArtworks(exhibition);
    //exhibition.sort(currentSort);
    var root = elt;
    if (!elt)
        root = document.createElement('div');
    $(root).css({ 'overflow-x': 'auto', 'overflow-y': 'hidden' });
    if (!$(root).parent())
        $('body').append(root);
    var timeline = d3.select(root)
    .append('svg:svg')
    .attr('width', '100%')
    .attr('height', '100%');
    root.onresize = function () { draw(); };
    root.onload = function () { draw(); };

    function draw() {
        var w = $(root).height() * 3 / 4;
        var images = timeline.selectAll('svg')
        .data(artworks, function (d) {
            return d.Identifier;
        });

        images.selectAll('text.title').text(function (d) {
            var text = (currentSort === "Title") ? d.Name : d.Metadata[currentSort];
            if (text.length > 27)
                return text.substr(0, 27) + "...";
            return text;
        });
        images.selectAll('text').attr('x', w / 2);
        images.selectAll('image').attr('width', w);
        images.selectAll('rect').attr('width', w);

        var entering = images.enter().append('svg:svg');
        entering
            .attr('x', function (d, i) {
                return Math.round((i - 1) / 2) * (w + 5) + 15;
            })
            .attr('y', function (d, i) { return (i % 2) * 50 + "%"; });
        entering
            .append('svg:image')
            .attr('id', function (d) { return 'a' + d.Identifier; })
            .attr('width', w)
            .attr('height', "48%")
            .attr('xlink:href', function (d) {
                return LADS.Worktop.Database.fixPath(d.Metadata.Thumbnail);
            })
            .attr('preserveAspectRatio', 'xMidYMid slice')
            .on('click', function (d, i) {
                pickedDocument(d, this);
            });
        entering
            .append('svg:rect')
            .attr('width', w)
            .attr('height', '5%')
            .attr('style', 'fill:rgba(0,0,0,0.5)');
        entering
            .append('svg:text')
            .attr('class', 'title')
            .attr('text-anchor', 'middle')
            .attr('x', w / 2)
            .attr('dy', '4%')
            .attr('style', 'fill:#FFF')
            .text(function (d) {
                //return (currentSort === "Title") ? d.Name : d.Metadata[currentSort];
            });
        //entering.append('svg:text')
        //    .attr('text-anchor', 'middle')
        //    .attr('class', 'loading')
        //    .attr('x', w / 2)
        //    .attr('y', '25%')
        //    .attr('style', 'fill:#FFF')
        //    .text('Loading...');
        images.transition()
            .duration(1000)
            .attr('x', function (d, i) { return Math.round((i - 1) / 2) * (w + 5) + 15; })
            .attr('y', function (d, i) { return (i % 2) * 50 + "%"; });

        images.exit().remove();
    }


    function sortArtworks(sortBy) {
        if (sortBy == "Origin")
            return;
        currentSort = sortBy;
        var compare = function (a, b) { return a == b ? 0 : a > b ? 1 : -1; };
        artworks.sort(function (a, b) {
            if (typeof sortBy === "string") {
                if (sortBy === "Title") {
                    return compare(a.Name, b.Name);
                } else {
                    return compare(a.Metadata[sortBy], b.Metadata[sortBy]);
                }
            }
            for (var field in sortBy) {
                sortField = sortBy[field];
                if (sortField === "Title") {
                    if (!a.Name) return -1;
                    if (!b.Name) return 1;
                    var comp = compare(a.Name, b.Name);
                    if (comp !== 0) return comp;
                } else {
                    if (!a.Metadata[sortField]) return -1;
                    if (!b.Metadata[sortField]) return 1;
                    var comp = compare(a.Metadata[sortField], b.Metadata[sortField]);
                    if (comp !== 0) return comp;
                }
            }
            return 0;
        });
        //exhibition.sort(currentSort);
        //draw();
    }


    this.getArtWid = function () {
        return $(root).height() * 3 / 4;
    };


    this.showFirstDocument = function (value) {
        for (var i = 0; i < artworks.length; i++) {
            if (value <= artworks[i].Metadata[currentSort]) {
                this.showDoq(artworks[i]);
                return;
            }
        }
        this.showDoq(artworks[artworks.length - 1]);
        return;
    };

};