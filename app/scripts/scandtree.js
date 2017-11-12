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
            branch: 11,
            longBoard: 1000,
            spread: 26,
            trunk: 1
        },

        output: {
            count: null,
            delta: null,
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

        min: {
            branch: 5,
            height: 10,
            longBoard: 100,
            spread: 1,
            trunk: 1,
            width: 10
        },

        max: {
            branch: 11,
            height: 10,
            longBoard: 10000,
            spread: 90,
            trunk: 3,
            width: 40
        },
    };

    const wrapper = {
        inputHolder: '#input_params',
        inputs: '#input_params input',

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

    function getMin(property) {
        return +config.min[property];
    }

    function getMax(property) {
        return +config.max[property];
    }

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
            'width: ' + options.width + 'px;' +
            'height: ' + options.height + 'px;"';
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

    function getMaxWidth() {
        const FRACTION = 10;
        let padding = Math.floor(getWidthHolder() / FRACTION);

        return getWidthHolder() - padding;
    }

    function boardElem(zIndex, width) {
        let li = document.createElement('LI');

        li.style.cssText = setBoardStyles(zIndex, width);
        li.innerHTML = getBoardTemplate(width);

        return li;
    }

    function boardString(zIndex, width) {
        return '<li style="' + setBoardStyles(zIndex, width) + ' >' +
            getBoardTemplate(width) + '</li>';
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
        return 2 * index * getOutputParam('delta');
    }

    function createBranchElems(i, len) {
        const fulcrum = getInputParam('width');

        let width = fulcrum;

        let zIndex = -i;

        let boards = [];

        for (let j = 0; i < len; i += 1) {
            width = fulcrum;

            if (j === 0)  {
                let n = periodBranch(i);

                width += getWidthBranch(n) + fulcrum;
            }

            if (width >= getMaxWidth() ) {
                return boards;
            }

            boards.push( boardElem(zIndex, width) );

            zIndex -= 1;

            j = getLongBoard(i);
        }

        return boards;
    }

    function setSpread() {
        const RADIAN = Math.PI / 180;
        const MAX_SPREAD = 179;

        const spread = getInputParam('spread');
        const height = getInputParam('height');
        const size = getSizeBranch();

        if (spread > 0 && spread < MAX_SPREAD) {
            const radian = (90 - spread / 2) * RADIAN;

            let delta = size * height / Math.tan(radian);

            setOutputParam('delta', delta);
        }
    }

    function setCount() {
        const longBoard = treeParam('branch');
        const lastBranch = treeParam('last');

        let numberBranch = getInputParam('branch');

        let short = getInputParam('trunk');

        if (numberBranch > 0 && short >= 1) {
            let count = (longBoard + short) * numberBranch;
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

        let number = getInputParam('branch');
        let size = getSizeBranch('size');

        let i = 1;
        let len = number * size + 1;

        let branches = createBranchElems(i, len);

        if (branches) {
            let elems = makeFragment(branches);

            parent.appendChild(elems);
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

    function appendBranch(diff) {
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

        //parent.insertBefore(fragment, firstChild);
    }

    function deleteBranch(diff) {
        let parent = $(wrapper.treeParent)[0];
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

    function deleteScandTree() {
        let holder = $(wrapper.treeHolder)[0];
        let parent = $(wrapper.treeParent)[0];

        holder.removeChild(parent);
    }

    function updateScandTree() {
        showScandTree();
    }

    function handlerInput(options) {
        let strategy = {
            board: (parameter, value) => {
                setInputParam(parameter, value);
            },

            typeTree: (parameter, value) => {
                if (parameter === 'branch') {
                    let current = getInputParam(parameter);
                    let difference = value - current;

                    if (difference > 0) {
                        appendBranch(difference);
                    } else if (difference < 0) {
                        difference = Math.abs(difference);

                        deleteBranch(difference);
                    }

                    setInputParam(parameter, value);

                    setSpread();
                    setCount();

                } else {
                    deleteScandTree();

                    setInputParam(parameter, value);

                    setSpread();
                    setCount();

                    updateScandTree();
                }
            },

            width: (width, value) => {
              setMaxCount(value);
            }
        };

        setOwner(options.owner);

        strategy[options.mode](options.parameter, options.value);
    }

    function getInputParameters(input) {
        input = $(input);

        let param = input.data('parameter');

        let min = getMin(param);
        let max = getMax(param);

        let options = {
            value: 0,
            parameter: '',
            mode: '',
        };

        let value = +input.val();

        if (value >= min && value <= max) {
            options.value = value;
            options.parameter = param;
            options.mode = input.parents('li[data-mode]').data('mode');
            options.owner = input.parents('div[data-owner]').data('owner');

            handlerInput(options);
        }

        options = null;
        value = null;
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

    let changeHandler = function changeHandler(event) {
        getInputParameters(event.target);

        showHeightScandTree();
        showWidthScandTree();

        showAdminBrowser();
        //showAdminConsole();
    };

    let reset = () => {
        deleteScandTree();

        getInputValues();

        setSpread();
        setCount();

        showScandTree();
    };

    function init() {
        getInputValues();

        $(wrapper.inputs).on('change', changeHandler);

        setSpread();
        setCount();

        showScandTree();

        showHeightScandTree();
        showWidthScandTree();

        showAdminBrowser();
        //showAdminConsole();
    }

    init();

    return {
        reset
    }

})(jQuery, $('#input_params'));
