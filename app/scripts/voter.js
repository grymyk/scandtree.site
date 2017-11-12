'use strict';

let isChange = false;

function Voter(inputParams) {
    const self = this;

    function unlockControl(sibling) {
        if (sibling) {
            sibling.classList.remove('lock');
        } else {
            console.log('unlock: No elem!');
        }
    }

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
        const elems = inputParams.getElementsByClassName('lock');
        const len = elems.length;

        if (elems) {
            for (let i = len - 1; i >= 0; i -= 1) {
                if ( elems[i].classList.contains('lock') ) {
                    elems[i].classList.remove('lock');
                }
            }
        } else {
            console.log('unlockAll: No ".lock" elems');
        }
    }

    function lockControl() {
        if (target) {
            target.classList.add('lock');
        } else {
            console.log('lock: No elem!');
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

    function changeParam(input, step, sibs) {
        if (input && step && sibs) {
            let min = +input.getAttribute('min');
            let max = +input.getAttribute('max');

            let value = +input.getAttribute('value') + step;

            if (value >= min && value <= max) {
                input.setAttribute('value', value);

                unlockControl(sibs);
            } else {
                lockControl();
            }
        } else {
            console.log('changeParam: No step && sibs!');
        }
    }

    this.signAction = {
        down: (input) => {
            if (input) {
                let nextSib = target.nextElementSibling;
                let step = +input.getAttribute('step') * -1;

                changeParam(input, step, nextSib);
            } else {
                console.log('lock: No elem!');
            }
        },

        up: (input) => {
            if (input) {
                let prevSib = target.previousElementSibling;
                let step = +input.getAttribute('step');

                changeParam(input, step, prevSib);
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
        const liParent = target.parentNode.parentNode;

        return liParent.getElementsByTagName('INPUT')[0];
    }

    function getSign() {
        return target.getAttribute('data-action-change');
    }

    function setDefaultValues() {
        const config = {
            width: 16,
            height: 10,
            longBoard: 1000,
            trunk: 2,
            branch: 7,
            spread: 25
        };

        let inputs = inputParams.getElementsByTagName('INPUT');

        for (let i = 0, len = inputs.length; i < len; i += 1 ) {
            let property = inputs[i].getAttribute('data-parameter');
            let value = config[property];

            inputs[i].setAttribute('value', value);
        }
    }

    function unLockReset() {
        const reset = inputParams.getElementsByClassName('reset')[0];

        if (reset.classList.contains('lock') ) {
            reset.classList.remove('lock')
        }
    }

    function lockReset() {
        const reset = inputParams.getElementsByClassName('reset')[0];

        if (reset.classList.contains('lock') === false) {
            reset.classList.add('lock')
        }
    }

    this.change = () => {
        isChange = true;

        const input = getInput();
        const sign = getSign();

        if (sign) {
            self.signAction[sign](input);
        }

        generateChangeEvent(input);

        unLockReset();
    };

    this.toggle = () => {
        inputParams.classList.toggle('open');
    };

    this.reset = () => {
        if (isChange) {
            setDefaultValues();
            scandtree.reset();
            unlockAll();

            lockReset();
        }
    };

    let target = null;

    inputParams.addEventListener('click', (event) => {
        target = event.target;

        let action = target.getAttribute('data-action');

        if (action) {
            self[action]();
        }
    });
}

const inputParams = document.getElementById('input_params');
new Voter( inputParams );
