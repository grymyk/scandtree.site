'use strict';

let isChange = false;

function Voter(inputParams) {
    const self = this;

    function showControl(elem) {
        if (elem) {
            elem.classList.remove('lock');
        } else {
            console.log('Show Control: No elem!');
        }
    }

    function lockControl(elem) {
        if (elem) {
            const value = elem.getAttribute('value');
            elem.setAttribute('max', value);
        }
    }

    function unlockControl(elem, value) {
        if (elem && value) {
            elem.setAttribute('max', value);
        } else {
            console.log('Unlock Control: No elems!');
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

    function hideControl(elem) {
        if (elem) {
            elem.classList.add('lock');
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

    function getInput(name) {
        const selector = 'input[data-parameter="' + name + '"]';

        return inputParams.querySelector(selector);
    }

    function getPlusBtn(input) {
        return input.nextElementSibling.querySelector('.up');
    }

    function checkMaxSpread() {
        const spread = getInput('spread');
        const branch = getInput('branch');
        const trunk = getInput('trunk');

        const branchPlusBtn = getPlusBtn(branch);
        const trunkPlusBtn = getPlusBtn(trunk);

        const valueSpread = spread.getAttribute('value');
        const maxSpread = spread.getAttribute('max');

        if (valueSpread === maxSpread) {
            hideControl(branchPlusBtn);
            hideControl(trunkPlusBtn);

            lockControl(branch);
            lockControl(trunk);
        } else {
            const MAX_BRANCH = '10';
            const MAX_TRUNK = '3';

            showControl(branchPlusBtn);
            showControl(trunkPlusBtn);

            unlockControl(branch, MAX_BRANCH);
            unlockControl(trunk, MAX_TRUNK);
        }
    }

    function changeParam(input, step, sibs) {
        if (input && step && sibs) {
            let min = +input.getAttribute('min');
            let max = +input.getAttribute('max');

            let value = +input.getAttribute('value') + step;

            if (value >= min && value <= max) {
                input.setAttribute('value', value);

                showControl(sibs);
            } else {
                hideControl(input);
            }

            if (value === min || value === max) {
                hideControl(input);
            } else {
                showControl(sibs);
            }

            checkMaxSpread();

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

        const liParent = target.parentNode.parentNode;
        const input = liParent.querySelector('input');
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

    function getInputParameters(input) {
        let param = input.getAttribute('data-parameter');

        let min = input.getAttribute('min');
        let max = input.getAttribute('max');

        let liParent = input.parentNode;

        let options = {};

        let value = +input.getAttribute('value');

        if (value >= min && value <= max) {
            options.value = value;
            options.parameter = param;

            options.mode = liParent.getAttribute('data-mode');
            options.owner = inputParams.getAttribute('data-owner');

            scandtree.handlerInput(options);
        }
    }

    function handleChange(event) {
        getInputParameters(event.target)
    }

    function handleClick(event) {
        target = event.target;

        let action = target.getAttribute('data-action');

        if (action) {
           self[action]();
        }
    }

    inputParams.addEventListener('click', handleClick);

    let inputs = inputParams.getElementsByTagName('INPUT');

    for (let i = 0, len = inputs.length; i < len; i += 1) {
        inputs[i].addEventListener('change', handleChange);
    }
}

const inputParams = document.getElementById('input_params');
new Voter( inputParams );
