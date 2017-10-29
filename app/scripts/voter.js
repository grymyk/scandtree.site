'use strict';

function Voter(input, tree) {
    const self = this;

    function unlock(input, sibling) {
        if (input && sibling) {
            if ( input.classList.contains('lock') ) {
                input.classList.remove('lock');
                input.removeAttribute('readonly');

                sibling.classList.remove('lock');
            }
        } else {
            console.log('unlock: No elems!');
        }
    }

    function unlockAll() {
        let elems = input.find('.lock');

        if (elems) {
            for (let i = 0, len = elems.length; i < len; i += 1) {
                if ( elems[i].classList.contains('lock') ) {
                    elems[i].classList.remove('lock');
                }
            }
        } else {
            console.log('unlockAll: No ".lock" elems');
        }
    }

    function lock(input) {
        if (input) {
            input.classList.add('lock');
            input.setAttribute('readonly', 'true');

            target.classList.add('lock');
        } else {
            console.log('lock: No elem!');
        }
    }

    this.signAction = {
        down: (input) => {
            if (input) {
                let sibling = target.nextElementSibling;
                let step = +input.attr('step');
                let min = +input.attr('min');

                let value = +input.val() - step;

                if (value >= min) {
                    input.val(value);

                    unlock(input[0], sibling);
                } else {
                    lock(input[0]);
                }

                step = null;
                min = null;
                value = null;
            } else {
                console.log('lock: No elem!');
            }
        },

        up: (input) => {
            if (input) {
                let sibling = target.previousElementSibling;
                let step = +input.attr('step');
                let max = +input.attr('max');

                let value = +input.val() + step;

                if (value <= max) {
                    input.val(value);

                    unlock(input[0], sibling);
                } else {
                    lock(input[0]);
                }

                step = null;
                max = null;
                value = null;
            } else {
                console.log('lock: No elem!');
            }
        }
    };

    function generateChangeEvent(input) {
        if (input) {
            let inputChange = new Event('change');

            input.dispatchEvent(inputChange);
        } else {
            console.log('lock: No elem!');
        }
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

    this.reset = () => {
        scandtree.reset();

        unlockAll();
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
