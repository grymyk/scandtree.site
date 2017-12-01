'use strict';

const scandtree = (function($, inputParams) {
    const config = {
        board: {
            numberBoard: 1,
            raw: 2
        },

        input: {
            width: 16,
            height: 10,
            branch: 10,
            longBoard: 1000,
            spread: 25,
            trunk: 2
        },

        output: {
            count: null,
            delta: null,
            scaleX: 1,
            allWidth: 0,
            piece: [],
            remainder: 0
        },

        tree: {
            trunk: 1,
            branch: 2,
            last: 0
        },

        owner: 'user',

        limit: 0,
    };

    const wrapper = {
        inputHolder: '#input_params',
        inputs: '#input_params input',
        spreadInput: '#input_params input[data-parameter="spread"]',
        branchInput: '#input_params input[data-parameter="branch"]',
        trunkInput: '#input_params input[data-parameter="trunk"]',

        output: {
            height: '.output .height',
            width: '.output .width',
            all_width: '.output .all_width',
            count: '.output .count',
            number_board: '.output .number_board',
            remainder_holder: '.output .remainder_holder',
            piece_width_holder: '.output .piece_width_holder'
        },

        treeHolder: '#tree_holder',
        treeParent: '#tree_holder ul'
    };

    function treeParam(property) {
        return +config.tree[property];
    }

    function getInputParam(property) {
        return +config.input[property];
    }

    function setInputParam(property, value) {
        config.input[property] = value;
    }

    function getOutputParam(property) {
        return config.output[property];
    }

    function setOutputParam(property, value) {
        config.output[property] = value;
    }

    function getBoardParam(property) {
        return +config.board[property];
    }

    function setBoardParam(property, value) {
        config.board[property] = value;
    }

    function getFrontPlaneStyles(options) {
        let style = ' style = "';

        style += 'width: ' + options.width + 'px; ' +
            'height: ' + options.height + 'px; ';

        style += 'transform: rotateY(0) ';

        style += 'translateZ(' + options.translateZ.zAxis + ');"';

        return style;
    }

    function getBackPlaneStyles(options) {
        let style = ' style = "';

        style += 'width: ' + options.width + 'px; ' +
            'height: ' + options.height + 'px; ';

        style += 'transform: rotateX(180deg) ';

        style += 'translateZ(' + options.translateZ.zAxis + ');"';

        return style;
    }

    function getRightPlaneStyles(options) {
        let style = ' style = "';

        style += 'width: ' + options.deep + 'px; ' +
            'height: ' + options.height + 'px; ';

        if (options.left) {
            style += 'left: ' + options.left + 'px; ';
        }

        style += 'transform: rotateY(90deg) ';

        style += 'translateZ(' + options.translateZ.xzAxis + ');"';

        return style;
    }

    function getLeftPlaneStyles(options) {
        let style = ' style = "';

        style += 'width: ' + options.deep + 'px; ' +
            'height: ' + options.height + 'px; ';

        if (options.left) {
            style += 'left: ' + options.left + 'px; ';
        }

        style += 'transform: rotateY(-90deg) ';

        style += 'translateZ(' + options.translateZ.xzAxis + ');"';

        return style;
    }

    function getTopPlaneStyles(options) {
        let style = ' style = "';

        style += 'width: ' + options.width + 'px; ' +
            'height: ' + options.deep + 'px; ';

        if (options.top) {
            style += 'top: ' + options.top + 'px; ';
        }

        style += 'transform: rotateX(90deg) ';

        style += 'translateZ(' + options.translateZ.yAxis + ');"';

        return style;
    }

    function getBottomPlaneStyles(options) {
        let style = ' style = "';

        style += 'width: ' + options.width + 'px; ' +
            'height: ' + options.deep + 'px; ';

        if (options.top) {
            style += 'top: ' + options.top + 'px; ';
        }

        style += 'transform: rotateX(-90deg) ';

        style += 'translateZ(' + options.translateZ.yAxis + ');"';

        return style;
    }

    function branchTemplate(options) {
        return '<div class="prism_holder">' +
                '<div class="prism">' +
                    '<div class="face front branch side_view"' +
                        getFrontPlaneStyles(options) +
                    '></div>' +
                    '<div class="face back branch side_view"' +
                        getBackPlaneStyles(options) +
                    '></div>' +
                    '<div class="face right branch side_view"' +
                        getRightPlaneStyles(options) +
                    '></div>' +
                    '<div class="face left branch side_view"' +
                        getLeftPlaneStyles(options) +
                    '></div>' +
                    '<div class="face top branch side_view"' +
                        getTopPlaneStyles(options) +
                    '></div>' +
                    '<div class="face bottom branch side_view"' +
                        getBottomPlaneStyles(options) +
                    '></div>' +
                '</div>' +
                '</div>'
    }

    function getTranslateZ(options) {
        return {
            yAxis: parseInt(options.height / 2, 10) + 'px',
            xzAxis: parseInt(options.width / 2, 10) + 'px',
            zAxis: parseInt(options.deep / 2, 10) + 'px',
        }
    }

    function getBoardTemplate(width) {
        width = parseInt(width, 10);
        let height = parseInt( getInputParam('height'), 10);

        const deep = 40;
        let xyz = {
            width,
            height,
            deep
        };

        let left = parseInt( (width - deep) / 2, 10);
        let top = parseInt( (height - deep) / 2, 10);

        let options = {};

        options.width = width;
        options.height = height;
        options.deep = deep;
        options.translateZ = getTranslateZ(xyz);
        options.left = left;
        options.top = top;

        return branchTemplate(options);
    }

    function branchStyleTemplate(options) {
        return 'z-index: ' + options.zIndex + '; ' +
            'width: ' + options.width + 'px;';
            // 'height: ' + options.height + 'px;"';
    }

    function setBoardStyles(zIndex, width) {
        const height = getInputParam('height');

        let options = {};

        options.zIndex = zIndex;
        options.width = parseInt(width, 10);
        options.height = parseInt(height, 10);

        return branchStyleTemplate(options);
    }

    /*function showCount() {
        let count = getOutputParam('count');

        console.log('Count: %d', count);

        $(wrapper.output.count).html(count);
    }*/

    function showCountBrowser() {
        let count = getOutputParam('count');

        $(wrapper.output.count).html(count);
    }

    function showCountConsole() {
        let count = getOutputParam('count');

        console.log('Count: %d', count);
    }

    function showAllWidth() {
        let width = getOutputParam('allWidth');

        console.log('All Width: %s mm', width);

        $(wrapper.output.all_width).html(width);
    }

    function showAllWidthBrowser() {
        let width = getOutputParam('allWidth');

        $(wrapper.output.all_width).html(width);
    }

    function showAllWidthConsole() {
        let width = getOutputParam('allWidth');

        console.log('All Width: %s mm', width);
    }

    function showRemainder() {
        let remainder = getOutputParam('remainder');

        console.log('Remainder: %d mm', remainder);

        $(wrapper.output.remainder).html(remainder);
    }

    function showRemainderBrowser() {
        let remainder = getOutputParam('remainder');

        let title = '<span>remainder: </span>';
        let description = '<span class="remainder">' + remainder + '</span>mm';

        $(wrapper.output.remainder_holder).html(title + description);
    }

    function showRemainderConsole() {
        let remainder = getOutputParam('remainder');

        console.log('Remainder: %d mm', remainder);
    }

    function showNumberBoard() {
        let number = getBoardParam('numberBoard');

        console.log('Number Board: %s mm', number);

        $(wrapper.output.number_board).html(number);
    }

    function showNumberBoardBrowser() {
        let number = getBoardParam('numberBoard');

        $(wrapper.output.number_board).html(number);
    }

    function showNumberBoardConsole() {
        let number = getBoardParam('numberBoard');

        console.log('Number Board: %s mm', number);
    }

    function showPieceWidth() {
        $(wrapper.output.piece_width).empty();

        let piece = getOutputParam('piece');

        let list = '<ul>';

        for (let i = 0, j = 1, k = 1, len = piece.length; i < len; i += 1) {
            if (i % 3 === 0) {
                list += '<li><b>' + k + '. </b>';
                k += 1;
            }

            list += '<span>' + piece[i] + '</span> ';

            if (j % 3 === 0) {
                list += '</li>';
            }

        }

        list += '</ul>';

        $(wrapper.output.piece_width).html(list);
    }

    function showPieceWidthBrowser() {
        $(wrapper.output.piece_width).empty();

        let piece = getOutputParam('piece');

        let trunk = getInputParam('trunk');
        let branch = treeParam('branch');

        let type = branch + trunk;

        let head = '<h3>longs</h3>';

        let list = '<ol>';

        for (let i = 0, j = 1, k = 1, len = piece.length; i < len; i += 1) {
            if (i % type === 0) {
                list += '<li>';
                k += 1;
            }

            list += '<span>' + piece[i] + '</span> ';

            if (j % type === 0) {
                list += '</li>';
            }

        }

        list += '</ol>';


        $(wrapper.output.piece_width_holder).html(head + list);
    }

    function showPieceWidthConsole() {
        let piece = getOutputParam('piece');

        console.log('piece: ', piece);
    }

    function showAdminBrowser() {
        showAllWidthBrowser();
        showCountBrowser();
        showNumberBoardBrowser();
        showRemainderBrowser();
        showPieceWidthBrowser();
    }

    function showAdminConsole() {
        showAllWidthConsole();
        showCountConsole();
        showNumberBoardConsole();
        showRemainderConsole();
        showPieceWidthConsole();
    }

    function pieceDistribution() {
        let longBoard = getInputParam('longBoard');

        let width = getOutputParam('count') * getBoardParam('raw') + getOutputParam('allWidth');

        if (width > longBoard) {
            let quotient = width / longBoard;

            setBoardParam('numberBoard', Math.ceil(quotient));
        } else {
            setBoardParam('numberBoard', 1);
        }

        setOutputParam('remainder', parseInt(getBoardParam('numberBoard') * longBoard - width, 10));
    }

    function getHeightHolder() {
        return $(wrapper.treeHolder).height();
    }

    function getWidthHolder() {
        return $(wrapper.treeHolder).width();
    }

    function getOwner() {
        return config['owner'];
    }

    function setOwner(value) {
        return config['owner'] = value;
    }

    function getHeightByOwner() {
        const owner = getOwner();
        const count = getOutputParam('count');

        if (owner === 'user') {
            return Math.floor(getHeightHolder() / count);
        } else if (owner === 'admin') {
            return getInputParam('height');
        } else {
            console.log('No Owner');
            return 0;
        }
    }

    function setMaxWidthLimit() {
        let horizontPad = 50;

        config.limit = Math.floor( (getWidthHolder() - horizontPad) / 2)
    }

    function getMaxWidthLimit() {
        return config.limit;
    }

    function boardElem(zIndex, width) {
        let li = document.createElement('LI');

        li.style.cssText = setBoardStyles(zIndex, width);
        li.innerHTML = getBoardTemplate(width);

        return li;
    }

    function getSizeBranch() {
        const short = getInputParam('trunk');
        const longBoard = treeParam('branch');

        return short + longBoard;
    }

    function periodBranch(index) {
        const size = getSizeBranch();

        return Math.floor( Math.floor(index / size) );
    }

    function getLongBoard(index) {
        const longBoard = treeParam('branch');
        const size = getSizeBranch();

        return Math.floor(index %  size / longBoard);
    }

    function getWidthBranch(index) {
        const HALF_WIDTH = 2;
        let fulcrum = getInputParam('width');
        let delta = getOutputParam('delta');

        return HALF_WIDTH * index * delta + fulcrum;
    }

    function getMaxTrunk() {
        const size = getSizeBranch();
        const height = getInputParam('height');
        const branch = getInputParam('branch');
        const limit = getMaxWidthLimit();
    }

    function getMaxBranch() {
        const size = getSizeBranch();
        const height = getInputParam('height');
        const limit = getMaxWidthLimit();
        const maxSpread = +$(wrapper.spreadInput)[0].getAttribute('max');
        const alphaRadian = maxSpread * Math.PI / 180;

        return Math.ceil( limit / Math.tan(alphaRadian / 2) / size / height);
    }

    function setMaxBranch() {
        const branch = getMaxBranch();

        $(wrapper.branchInput)[0].setAttribute('max', branch);
    }

    function getMaxSpread(branch) {
        const STEP = 5;
        const MAX_BRANCH = 10;
        const size = getSizeBranch();
        const height = getInputParam('height');
        branch = MAX_BRANCH || getInputParam('branch');
        const limit = getMaxWidthLimit();
        let tgA = branch * height * size / limit;
        let alphaRadian = Math.atan(tgA);
        let alphaDegree = Math.floor(alphaRadian * 180 / Math.PI);
        let maxSpread = 180 - 2 * alphaDegree;

        return Math.floor(maxSpread / STEP ) * STEP;
    }

    function setMaxSpread() {
        const spread = getMaxSpread();

        $(wrapper.spreadInput)[0].setAttribute('max', spread);
    }

    function createBranchElems(i, len) {
        const fulcrum = getInputParam('width');

        let width = 0;

        let zIndex = -i;

        let boards = [];

        for (let j = 0; i < len; i += 1) {
            width = fulcrum;

            if (j === 0)  {
                let n = periodBranch(i);

                width = getWidthBranch(n) + fulcrum;
            }

            boards.push( boardElem(zIndex, width) );

            zIndex -= 1;

            j = getLongBoard(i);
        }

        return boards;
    }

    function getDelta(spread) {
        const MAX_SPREAD = 179;

        const height = getInputParam('height');
        const size = getSizeBranch();

        if (0 < spread && spread < MAX_SPREAD) {
            const radian = (90 - spread / 2) * Math.PI / 180;

            return size * height / Math.tan(radian);
        }

        return 0;
    }

    function setSpread() {
        let spread = getInputParam('spread');

        let delta = getDelta(spread);

        setOutputParam('delta', delta);
    }

    function setCount() {
        const longBoard = treeParam('branch');
        const lastBranch = treeParam('last');

        let branch = getInputParam('branch');

        let short = getInputParam('trunk');

        if (branch > 0 && short >= 1) {
            let count = (longBoard + short) * branch;
            count += lastBranch;

            setOutputParam('count', count);
        }
    }

    function getTopBoard() {
        let zIndex = 0;
        let width = getInputParam('width');

        return boardElem(zIndex, width);
    }

    function showScandTree() {
        let branchesHolder = document.createElement('UL');

        let holder = $(wrapper.treeHolder)[0];
        holder.appendChild(branchesHolder);

        let topBoard = getTopBoard();

        let parent = $(wrapper.treeParent)[0];
        parent.appendChild(topBoard);

        let branch = getInputParam('branch');
        let size = getSizeBranch('size');

        let i = 1;
        let len = branch * size + 1;

        let branches = createBranchElems(i, len);

        if (branches) {
            let elems = makeFragment(branches);

            parent.appendChild(elems);
        } else {
            console.log('No branches!');
        }
    }

    function showWidthScandTree() {
        let delta = getOutputParam('delta');
        let count = getOutputParam('count');

        let fulcrum = getInputParam('width');

        let maxWidth = parseInt(2 * (count - 2) * delta + fulcrum - 2 * delta, 10);

        $(wrapper.output.width).html(maxWidth);
    }

    function showHeightScandTree() {
        let height = getOutputParam('count') * getInputParam('height');

        $(wrapper.output.height).html(height);
    }

    function setMaxCount(width) {
        let delta = getOutputParam('delta');
        let fulcrum = getInputParam('width');

        setOutputParam('count', parseInt((width - fulcrum) / (2 * delta) + 3, 10));
    }

    function makeFragment(boards) {
        let fragment = document.createDocumentFragment();

        boards.forEach( (board) => {
            fragment.appendChild(board);
        });

        return fragment;
    }

    function appendBranch() {
        let parent = $(wrapper.treeParent)[0];

        const count = getOutputParam('count');
        const size = getSizeBranch();

        let i = count + 1;
        let len = count + size + 1;

        let newBranches = createBranchElems(i, len);

        if (newBranches) {
            let fragment = makeFragment(newBranches);

            if (parent) {
                parent.appendChild(fragment);
            } else {
                console.log('No Parent!');
            }
        }
    }

    function deleteBranch(diff) {
        let parent = $(wrapper.treeParent)[0];

        if (parent) {
            let branches = parent.getElementsByTagName('LI');
            let size = getSizeBranch();

            let begin = branches.length - 1;
            let finish = begin - diff * size;

            for (let i = begin; i > finish; i -= 1 ) {
                if (branches[i]) {
                    parent.removeChild(branches[i]);
                }
            }
        }
    }

    function deleteScandTree() {
        let holder = $(wrapper.treeHolder)[0];
        let parent = $(wrapper.treeParent)[0];

        if (holder && parent) {
           holder.removeChild(parent);
        }
    }

    function makeTransform() {
        let k = getOutputParam('scaleX');
        let size = getSizeBranch();
        let holder = document.getElementById('tree_holder');
        let parent = holder.firstChild;

        if (parent) {
            let boards = parent.getElementsByTagName('LI');
            let value = 'scaleX(' + k + ')';

            for (let i = 1, len = boards.length; i < len;) {
                boards[i].style.setProperty('transform', value, '');
                boards[i+1].style.setProperty('transform', value, '');

                i += size;
            }
        }
    }

    function getDeformation(newSpread) {
        const RADIAN = Math.PI / 360;
        let oldSpread = getInputParam('spread');

        let alpha = oldSpread * RADIAN;
        let beta = newSpread * RADIAN;

        let k = Math.tan(beta) / Math.tan(alpha);
        setOutputParam('scaleX', k);
    }
    
    function scaleX(spread) {
        getDeformation(spread);
        makeTransform();
    }

    function updateScandTree(spread) {
        scaleX(spread);
    }

    function handlerInput(options) {
        let strategy = {
            board: (parameter, value) => {
                setInputParam(parameter, value);
            },

            typeTree: (parameter, value) => {
                if (parameter === 'branch') {
                    setCount();

                    let current = getInputParam(parameter);
                    let diff = value - current;

                    if (diff > 0) {
                        appendBranch();
                        makeTransform();
                    } else if (diff < 0) {
                        diff = Math.abs(diff);

                        deleteBranch(diff);
                    }

                    setInputParam(parameter, value);

                } else if (parameter === 'spread') {
                     setCount();
  
                     updateScandTree(value);
                } else if (parameter === 'trunk') {
                    deleteScandTree();

                    setInputParam(parameter, value);

                    setSpread();
                    setCount();

                    showScandTree();
                    makeTransform();
                } else {
                    console.log('Noname Parameter!');
                }
            },

            width: (width, value) => {
              setMaxCount(value);
            }
        };

        strategy[options.mode](options.parameter, options.value);
    }

    function getInputOwner() {
        setOwner( input_params.attr('data-owner') );
    }

    function getInputValues() {
        let inputs = inputParams.find('input');

        for (let i = 0, len = inputs.length; i < len; i += 1 ) {
            let property = inputs[i].getAttribute('data-parameter');
            let value = +inputs[i].getAttribute('value');

            setInputParam(property, value);
        }
    }

    let reset = () => {
        deleteScandTree();

        getInputValues();

        setSpread();
        setCount();

        showScandTree();
    };

    function init() {
        getInputValues();

        setSpread();

        setMaxWidthLimit();

        const MAX_BRANCH = 10;
        setMaxSpread(MAX_BRANCH);

        showScandTree();

        showHeightScandTree();
        showWidthScandTree();

        showAdminBrowser();
        //showAdminConsole();
    }

    init();

    return {
        reset,
        handlerInput
    }

})(jQuery, $('#input_params'));
