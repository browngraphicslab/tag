// temp script to store AVL tree implementation

function sortTimeline(artworks, tag) {
    if (tag === 'Title') {
        var identical = 0;
        var comparator = function (a, b) {
            if (a.nameKey < b.nameKey) {
                return -1;
            } else if (a.nameKey > b.nameKey) {
                return 1;
            } else {
                identical++;
                a.nameKey = a.nameKey + identical;

                if (a.nameKey < b.nameKey) {
                    return -1;
                } else {
                    return 0;
                }
            }
        };

        var valuation = function (value, compareToNode) {
            if (!compareToNode) {
                return null;
            } else if (value < compareToNode.nameKey) {
                return -1;
            } else if (value > compareToNode.nameKey) {
                return 1;
            } else {
                identical++;
                a.nameKey = a.nameKey + identical;

                if (a.nameKey < b.nameKey) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }

        var avlTree = new AVLTree(comparator, valuation);
        avlTree.clear();
        for (var i = 0; i < artworks.length; i++) {
            var artNode = {
                artwork: artworks[i],
                nameKey: artworks[i].Name,
            }
            avlTree.add(artNode);
        }
        return avlTree;
    }
    else if (tag === 'Artist') {
        var identical = 0;
        var comparator = function (a, b) {
            if (a.artistKey < b.artistKey) {
                return -1;
            } else if (a.artistKey > b.artistKey) {
                return 1;
            } else {
                if (a.artwork.Identifier === b.artwork.Identifier) {
                    return 0;
                }
                // TODO: create a "duplicate" property which tracks each duplicate as a numbered copy
                // use the duplicate # to track duplicates and distinguish between them in the tree
                identical++;
                a.dupeNum = identical;

                if (a.dupeNum < b.dupeNum) {
                    return -1;
                } else {
                    return 1;
                }
            }
        };

        var valuation = function (value, compareToNode) {
            if (!compareToNode) {
                return null;
            } else if (value < compareToNode.artistKey) {
                return -1;
            } else if (value > compareToNode.artistKey) {
                return 1;
            } else {
                return 0;
            }
        }

        var avlTree = new AVLTree(comparator, valuation);
        for (var i = 0; i < artworks.length; i++) {
            var artNode = {
                artwork: artworks[i],
                artistKey: artworks[i].Metadata.Artist,
            }
            avlTree.add(artNode);
        }
        return avlTree;
    }
    else if (tag === 'Year') {
        var identical = 0;
        var comparator = function (a, b) {
            if (a.yearKey < b.yearKey) {
                return -1;
            } else if (a.yearKey > b.yearKey) {
                return 1;
            } else {
                identical++;
                a.yearKey = a.yearKey + identical;

                if (a.yearKey < b.yearKey) {
                    return -1;
                } else {
                    return 0;
                }
            }
        };

        var valuation = function (value, compareToNode) {
            if (!compareToNode) {
                return null;
            } else if (value < compareToNode.yearKey) {
                return -1;
            } else if (value > compareToNode.yearKey) {
                return 1;
            } else {
                identical++;
                a.yearKey = a.yearKey + identical;

                if (a.yearKey < b.yearKey) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }

        var avlTree = new AVLTree(comparator, valuation);
        for (var i = 0; i < artworks.length; i++) {
            var artNode = {
                artwork: artworks[i],
                yearKey: artworks[i].Metadata.Year,
            }
            avlTree.add(artNode);
        }
        return avlTree;
    }
    else return null; // error case: should check 'tag'

    //console.log(avlTree.min().Name);
}
