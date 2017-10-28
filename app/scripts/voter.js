'use strict';

function Voter(input, tree) {
    const self = this;

    function widthHolder(value) {
        if (!arguments.length) {
            return tree.width();
        }
    }

    function getMaxWidth() {
        const HORIZONT_PADDING = 40;
        return widthHolder() - HORIZONT_PADDING;
    }

    function unlock(input, sibling) {
        if ( input.classList.contains('lock') ) {
            input.classList.remove('lock');
            input.removeAttribute('readonly');

            sibling.classList.remove('lock');
        }
    }

    function lock(input) {
        input.classList.add('lock');
        input.setAttribute('readonly', 'true');

        target.classList.add('lock');
    }

    this.signAction = {
        down: (input) => {
            let sibling = target.nextElementSibling;
            let step = +input.attr('step');
            let min = +input.attr('min');

            let value = +input.val() - step;

            if (value >= min) {
                input.val(value);

                unlock(input[0], sibling);
            }

            if (value === min) {
                lock(input[0]);
            }

            step = null;
            min = null;
            value = null;
        },

        up: (input) => {
            let sibling = target.previousElementSibling;
            let step = +input.attr('step');
            let max = +input.attr('max');
            //let max = +input.attr('max') || getMaxWidth();

            let value = +input.val() + step;

            if (value <= max) {
                input.val(value);

                unlock(input[0], sibling);
            }

            if (value === max) {
                lock(input[0]);
            }

            step = null;
            max = null;
            value = null;
        }
    };

    function generateChangeEvent(input) {
        let inputChange = new Event('change');
        // console.log(inputChange);

        input.dispatchEvent(inputChange);
    }

    function getInput() {
        return $(target).parents('.mode').find('input');
    }

    function getSign() {
        return target.getAttribute('data-action-change');
    }

    this.change = () => {
        const input = getInput();

        const sign = getSign();

        if (sign) {
            self.signAction[sign](input);
        }

        generateChangeEvent(input[0])
    };

    this.toggle = () => {
        input[0].classList.toggle('open');
    };

    let target = null;

    input.on('click', (event) => {
        target = event.target;

        let action = target.getAttribute('data-action');

        if (action) {
            self[action]();
        }
    });
}

new Voter( $('#input_params'), $('#tree_holder') );
