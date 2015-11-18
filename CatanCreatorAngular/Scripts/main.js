$(function () {

    /* 
    
    The following code is related to the SVG implementation of the generator
    
    var edgeLength = 3;
    var colorBank = ["rgba(238, 110, 91,",
                     "rgba(146, 203, 92,",
                     "rgba(254, 198, 45,",
                     "rgba(143, 144, 155,",
                     "rgba(39, 102, 59,",
                     "rgba(232, 190, 127,"];

    // Standard 4 Person Game 
    var resourceBank = [
      ['brick', "rgba(238, 110, 91, 0.8"],
      ['wood', "rgba(39, 102, 59, 0.8"],
      ['wheat', "rgba(254, 198, 45, 0.8"],
      ['sheep', "rgba(146, 203, 92, 0.8"],
      ['ore', "rgba(143, 144, 155, 0.8"],
      ['desert', "rgba(232, 190, 127, 0.8"]
    ];

    var tileBaseStack = [
      { type: "brick", numberToken: 2 },
      { type: "brick", numberToken: 3 },
      { type: "brick", numberToken: 3 },
      { type: "wood", numberToken: 4 },
      { type: "wood", numberToken: 4 },
      { type: "wood", numberToken: 5 },
      { type: "wood", numberToken: 5 },
      { type: "wheat", numberToken: 6 },
      { type: "wheat", numberToken: 6 },
      { type: "wheat", numberToken: 8 },
      { type: "wheat", numberToken: 8 },
      { type: "sheep", numberToken: 9 },
      { type: "sheep", numberToken: 9 },
      { type: "sheep", numberToken: 10 },
      { type: "sheep", numberToken: 10 },
      { type: "ore", numberToken: 11 },
      { type: "ore", numberToken: 11 },
      { type: "ore", numberToken: 12 },
      { type: "desert", numberToken: 7 }
    ];

    var numberTokenBaseStack = [
      2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12
    ];


    var tileStack = tileBaseStack;
    var numberTokenStack = numberTokenBaseStack;

    function resetStacks() {
        tileStack = shuffle(tileBaseStack.slice(0));
        numberTokenStack = shuffle(numberTokenBaseStack.slice(0));
        
        for (var i = 0; i < tileStack.length; i++) {
            if (tileStack[i].type === 'desert') {
                break;
            }
            tileStack[i].numberToken = numberTokenStack[i];
        }
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    var h = Math.sqrt(3) / 2,
        radius = 30,
        margin = 7.5;

    function makeHex(cX, cY) {
        return [
            { x: cX, y: cY + radius },
            { x: cX + radius * h, y: cY + radius / 2 },
            { x: cX + radius * h, y: cY - radius / 2 },
            { x: cX, y: cY - radius },
            { x: cX - radius * h, y: cY - radius / 2 },
            { x: cX - radius * h, y: cY + radius / 2 }
        ];
    }

    // Debug labels

    var reseourceType = $('#current-resource');
    var reseourceQuantity = $('#current-quantity');

    function getResourceQuantity(type) {
        switch (type) {
            case "brick":
                return resourceBank[0][1];
            case "wood":
                return resourceBank[1][1];
            case "wheat":
                return resourceBank[2][1];
            case "sheep":
                return resourceBank[3][1];
            case "ore":
                return resourceBank[4][1];
            case "desert":
                return resourceBank[5][1];
            default:
                return "Invalid resource type";
        }
    }

    function getResourceColor(type) {
        switch (type) {
            case "brick":
                return resourceBank[0][1];
            case "wood":
                return resourceBank[1][1];
            case "wheat":
                return resourceBank[2][1];
            case "sheep":
                return resourceBank[3][1];
            case "ore":
                return resourceBank[4][1];
            case "desert":
                return resourceBank[5][1];
            default:
                return "Invalid resource type";
        }
    }

    function getResourceType(rgba) {
        switch (rgba) {
            case "rgba(238, 110, 91, 0.75)":
                return resourceBank[0][0];
            case "rgba(39, 102, 59, 0.75)":
                return resourceBank[1][0];
            case "rgba(254, 198, 45, 0.75)":
                return resourceBank[2][0];
            case "rgba(146, 203, 92, 0.75)":
                return resourceBank[3][0];
            case "rgba(143, 144, 155, 0.75)":
                return resourceBank[4][0];
            case "rgba(232, 190, 127, 0.75)":
                return resourceBank[5][0];
            default:
                return "Invalid rgba code";
        }
    }

    function getRandColor() {
        return colorBank[Math.floor((Math.random() * colorBank.length))];
    }

    function getRandResource() {
        var resource;
        var rand = Math.floor((Math.random() * resourceBank.length));
        if (resourceBank[rand][1] > 0) {
            resource = resourceBank[rand][2];
            resourceBank[rand][1] -= 1;
        } else {
            getRandResource();
        }
        return resource;
    }

    function calcGridWidthInPixels() {
        var gridWidthInHexes = (edgeLength + edgeLength - 1);
        var hexWidth = 51.9615;
        var marginVal = 7.5;

        return gridWidthInHexes * hexWidth + (marginVal * 6);
    }

    var svgContainer =
        d3.select("#board-container")
          .append("svg")
          .attr("width", calcGridWidthInPixels())
          .attr("height", 300)
          .attr('style', 'margin: 0 auto');

    drawHexagon =
      d3.svg.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .interpolate("linear-closed")
    ;//.tension("0");

    var numHexagons = 3 * (edgeLength * edgeLength + edgeLength) + 1
    var cX = svgContainer.attr('width') / 2;
    var cY = svgContainer.attr('height') / 2;
    //var dOpacity = 1.00 / numHexagons;
    //var opacity = 0.15 - dOpacity;
    var startingOpac = 0.75;
    var hoverOpac = 1;
    
    function addText(p, text) {
        var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var b = p.getBBox();
        t.setAttribute("transform", "translate(" + (b.x + b.width / 2) + " " + (b.y + b.height / 2) + ")");
        t.textContent = $(p).attr('data-number-token');
        t.setAttribute("fill", "red");
        t.setAttribute("font-size", "14");
        p.parentNode.insertBefore(t, p.nextSibling);
    }

    function makeHexagon(dX, dY) {
        //opacity += dOpacity;
        //console.log(tileStack.length);
        var currentTile = tileStack.pop();

        return svgContainer.append("path")
                              .attr("d", drawHexagon(makeHex(cX + dX, cY + dY)))
                              //.attr("stroke", "#73c4bb")
                              //.attr("stroke-dasharray","20,5")
                              //.attr("stroke-width", 3)
                              .attr("fill", "" + getResourceColor(currentTile.type) + " " + startingOpac + ")")
                              .attr('data-number-token', currentTile.numberToken)
                              .attr('class', 'tile transition-all-normal');
    }

    var distanceBetweenHexes = h * radius * 2 + margin;

    function generateHexGrid() {
        $('path').remove();
        $('text').remove();

        resetStacks();

        makeHexagon(0, 0);

        for (var i = 1; i < edgeLength; i++) {
            for (var branch = 0; branch < 6; branch++) {
                var theta = Math.PI / 3 * branch;

                var dX = i * distanceBetweenHexes * Math.cos(theta);
                var dY = -i * distanceBetweenHexes * Math.sin(theta);

                makeHexagon(dX, dY);

                theta += 2 * Math.PI / 3;

                for (var k = 1; k < i; k++) {
                    makeHexagon(dX + k * distanceBetweenHexes * Math.cos(theta), dY - k * distanceBetweenHexes * Math.sin(theta))
                }
            }
        }

        /*
        var paths = $('path');
        console.log(paths.length);
        for (var p in paths) {
            addText(paths[p]);
        }
        

        $('.tile').hover(function () {
            // Gets the current tile's color
            var tileColor = $(this).attr("fill");

            $('#current-resource').text(getResourceType(tileColor));
            $('#current-number-token').text($(this).attr('data-number-token'));
            // Set the hover color to original color with opac = 1
            var hovColor = hoverColor(tileColor);
            $(this).attr("fill", hovColor).attr("style", "cursor: pointer");

        }, function () {
            // Set the color back to the original tile color
            // Gets the current tile's color
            var tileColor = $(this).attr("fill");
            var normalColor = regularColor(tileColor);
            $(this).attr("fill", normalColor);

        });

    }

    generateHexGrid();

    function reverseString(s) {
        var reverseStr = s.split("").reverse().join("");
        return reverseStr;
    }

    function toggleTileHoverColor(color) {
        var tColor = "rgba(238, 110, 91, 0.75)";
        var reverseColor = reverseString(tColor);

        var newColor = reverseString(reverseColor.substring(reverseColor.indexOf(' '), reverseColor.length)) + hoverOpac + ")";

        //$('#current-color').text(newColor);
        return newColor;
    }

    function hoverColor(rgbaString) {
        var newColor = rgbaString.replace("0.75", "1");
        return newColor;
    }

    function regularColor(rgbaString) {
        var str = rgbaString;
        newColor = str.replace(/1([^1]*)$/, '0.75)');
        //var newColor = rgbaString.replace("1","0.75");
        return newColor;
    }
    */
    

    ////////////////////////////////
    // CSS Grid Related Functions //
    ////////////////////////////////

    var hexTiles = $('.hex');

    for (i = 0; i < hexTiles.length; i++) {
        var currentTile = hexTiles[i];
        currentTile.setAttribute('id', 'hex-' + i + '');

    }

    var gameObjectData;
    var gameDataArray;

    function getResourceColor(type) {
        switch (type) {
            case 'brick':
                return "rgba(238, 110, 91, 0.8)";
            case 'wood':
                return "rgba(39, 102, 59, 0.8)";
            case 'wheat':
                return "rgba(254, 198, 45, 0.8)";
            case 'sheep':
                return "rgba(146, 203, 92, 0.8)";
            case 'ore':
                return "rgba(143, 144, 155, 0.8)";
            case 'desert': 
                return "rgba(232, 190, 127, 0.8)";
            default:
                return "Invalid type";
        }
    }

    function getResourceType(rgba) {

        switch (rgba) {

            case "rgba(238, 110, 91, 0.8)":
                return 'brick';
            case "rgba(39, 102, 59, 0.8)":
                return 'wood';
            case "rgba(254, 198, 45, 0.8)":
                return 'wheat';
            case "rgba(146, 203, 92, 0.8)":
                return 'sheep';
            case "rgba(143, 144, 155, 0.8)":
                return 'ore';
            case "rgba(232, 190, 127, 0.8)":
                return 'desert';
            default:
                return "Invalid rgba code";
        }
    }

    var tileBaseStack = [
      { type: "brick", numberToken: 2 },
      { type: "brick", numberToken: 3 },
      { type: "brick", numberToken: 3 },
      { type: "wood", numberToken: 4 },
      { type: "wood", numberToken: 4 },
      { type: "wood", numberToken: 5 },
      { type: "wood", numberToken: 5 },
      { type: "wheat", numberToken: 6 },
      { type: "wheat", numberToken: 6 },
      { type: "wheat", numberToken: 8 },
      { type: "wheat", numberToken: 8 },
      { type: "sheep", numberToken: 9 },
      { type: "sheep", numberToken: 9 },
      { type: "sheep", numberToken: 10 },
      { type: "sheep", numberToken: 10 },
      { type: "ore", numberToken: 11 },
      { type: "ore", numberToken: 11 },
      { type: "ore", numberToken: 12 },
      { type: "desert", numberToken: 7 }
    ];

    var portBaseStack = [
        { type: "Br"},
        { type: "Wd"},
        { type: "Wh"},
        { type: "Sh"},
        { type: "Or"},
        { type: "3:1"},
        { type: "3:1"},
        { type: "3:1"},
        { type: "3:1"}
    ];

    var numberTokenBaseStack = [
      2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12
    ];

    var rowNum = 0;
    var row0Position = 0;
    var row1Position = 0;
    var row2Position = 0;
    var row3Position = 0;
    var row4Position = 0;
    var tileStack = tileBaseStack;
    var portStack = portBaseStack;
    var numberTokenStack = numberTokenBaseStack;

    function resetStacks() {
        tileStack = shuffle(tileBaseStack.slice(0));
        portStack = shuffle(portBaseStack.slice(0));
        numberTokenStack = shuffle(numberTokenBaseStack.slice(0));

        for (var i = 0; i < tileStack.length; i++) {
            if (tileStack[i].type === 'desert') {
                break;
            }
            tileStack[i].numberToken = numberTokenStack[i];
        }

    }

    function resetGameData() {

        gameDataArray = [

        [0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0],

        ]

        rowNum = 0;
        row0Position = 0;
        row1Position = 0;
        row2Position = 0;
        row3Position = 0;
        row4Position = 0;
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function convertToDotVal(val) {
        switch (val) {

            case 2: 
            case 12:
                return 1;
            case 3:
            case 11:
                return 2;
            case 4:
            case 10:
                return 3;
            case 5:
            case 9:
                return 4;
            case 6:
            case 8:
                return 5;
            case 7:
                return 0;
            default:
                return 0;
        }

    }

    var intersectionDataArray = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]

    var maxDPIVal = 0;
    var maxPortVal = 0;
    var dpiDebug = $('#current-max-val');
    var portDebug = $('#current-port-val');

    $('#dpi-range-slider').on('change', function () {
        maxDPIVal = this.value;
        dpiDebug.text(maxDPIVal);
    });

    $('#port-range-slider').on('change', function () {
        maxPortVal = this.value;
        portDebug.text(maxPortVal);
    });

    function findMaxValueIntersection() {
        var currentMax = 0;

        for (i = 1; i < gameDataArray.length; i++) {

            // var jAdj = gameDataArray[i].length > gameDataArray[i - 1].length ? -1 : 0;
            var rightIntersectionVal = 0;
            var bottomRightIntersectionVal = 0;
            var bottomLeftIntersectionVal = 0;

            for (j = 0; j < gameDataArray[i].length; j++) {
                if (gameDataArray[i].length > j) {
                    if ((Math.round(gameDataArray.length)/2) > i) {
                        bottomLeftIntersectionVal = gameDataArray[i][j] + gameDataArray[i + 1][j];
                        bottomRightIntersectionVal = gameDataArray[i][j] + gameDataArray[i + 1][j];
                    } 
                    rightIntersectionVal = gameDataArray[i][j] + gameDataArray[i][j + 1];
                    rightIntersectionVal > currentMax ? currentMax = rightIntersectionVal : currentMax = currentMax; 
                } 
            }
        }

        console.log(currentMax);
    }

    function modifyHexComponents(hexTile, gameTile) {

        var digits = /\d+/;
        var top, middle, bottom;
        
        var rowPosition;
        
        var currentTileId = '' + hexTile.attr('id');
        var tileIntId = parseInt(currentTileId.match(/\d+/)[0]);
        var portColor = 'rgba(100, 100, 100, 1)';

        top = $('#' + currentTileId + ' > .top');
        middle = $('#' + currentTileId + ' > .middle');
        bottom = $('#' + currentTileId + ' > .bottom');

        if (!gameTile) {

            var newPortType = portStack.pop();

            top.css('border-bottom', '15px solid ' + portColor + '');
            middle.css({'background': portColor, 'color': "#fff"}).html('' + newPortType.type + '');
            bottom.css('border-top', '15px solid ' + portColor + '');

        } else {

            var newTileType = tileStack.pop();
            var activeColor = getResourceColor(newTileType.type);
            var activeType = getResourceType(activeColor);
            var activeNumberToken = newTileType.numberToken;

            if (tileIntId >= 30 && tileIntId < 40) {
                gameDataArray[rowNum][row0Position] = activeNumberToken;
                row0Position++;
            }
            if (tileIntId >= 40 && tileIntId < 50) {
                rowNum = 1;
                gameDataArray[rowNum][row1Position] = activeNumberToken;
                row1Position++;
            }
            if (tileIntId >= 50 && tileIntId < 60) {
                rowNum = 2;
                gameDataArray[rowNum][row2Position] = activeNumberToken;
                row2Position++;
            }
            if (tileIntId >= 60 && tileIntId < 70) {
                rowNum = 3;
                gameDataArray[rowNum][row3Position] = activeNumberToken;
                row3Position++;
            }
            if (tileIntId >= 70 && tileIntId < 80) {
                rowNum = 4;
                gameDataArray[rowNum][row4Position] = activeNumberToken;
                row4Position++;
            }
            
            top.css('border-bottom', '15px solid ' + activeColor + '');
            middle.css('background', activeColor).html('' + newTileType.numberToken + '');
            bottom.css('border-top', '15px solid ' + activeColor + '');
            
            var tileObject = {gameTileId:tileIntId, rowId: rowNum, rowPosition: rowPosition, type: activeType, numberTokenValue: activeNumberToken, dotValue: convertToDotVal(activeNumberToken)};
            gameObjectData.push(tileObject);
        }
        
    }

    var fourPersonActiveTileArray = [
        $('#hex-32'),
        $('#hex-33'),
        $('#hex-34'),
        $('#hex-41'),
        $('#hex-42'),
        $('#hex-43'),
        $('#hex-44'),
        $('#hex-50'),
        $('#hex-51'),
        $('#hex-52'),
        $('#hex-53'),
        $('#hex-54'),
        $('#hex-60'),
        $('#hex-61'),
        $('#hex-62'),
        $('#hex-63'),
        $('#hex-70'),
        $('#hex-71'),
        $('#hex-72'),
    ];

    var fourPersonActivePortArray = [
        $('#hex-22'),
        $('#hex-24'),
        $('#hex-35'),
        $('#hex-55'),
        $('#hex-73'),
        $('#hex-81'),
        $('#hex-79'),
        $('#hex-59'),
        $('#hex-40')
    ];

    function generateGameBoard() {

        resetStacks();
        resetGameData();
        gameObjectData = [];

        gameDataArray = [
            [0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0],
        ]
        
        console.clear();
        for (i = 0; i < fourPersonActiveTileArray.length; i++) {
            modifyHexComponents(fourPersonActiveTileArray[i], true);
        }
        for (i = 0; i < fourPersonActivePortArray.length; i++) {
            modifyHexComponents(fourPersonActivePortArray[i], false);
        }
        findMaxValueIntersection();
        console.table(gameObjectData);
        console.table(gameDataArray);

    }
    generateGameBoard();
    $('#generate-board-btn').click(generateGameBoard);
    
});