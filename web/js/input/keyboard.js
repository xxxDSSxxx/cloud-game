/**
 * Keyboard controls.
 *
 * @version 1
 */
const keyboard = (() => {
    // default keyboard bindings
    const defaultMap = Object.freeze({
        ArrowLeft: KEY.LEFT,
        ArrowUp: KEY.UP,
        ArrowRight: KEY.RIGHT,
        ArrowDown: KEY.DOWN,
        KeyZ: KEY.A,
        KeyX: KEY.B,
        KeyC: KEY.X,
        KeyV: KEY.Y,
        KeyA: KEY.L,
        KeyS: KEY.R,
        Enter: KEY.START,
        ShiftLeft: KEY.SELECT,
        // non-game
        KeyQ: KEY.QUIT,
        KeyW: KEY.JOIN,
        KeyK: KEY.SAVE,
        KeyL: KEY.LOAD,
        Digit1: KEY.PAD1,
        Digit2: KEY.PAD2,
        Digit3: KEY.PAD3,
        Digit4: KEY.PAD4,
        KeyF: KEY.FULL,
        KeyH: KEY.HELP,
        Backslash: KEY.STATS,
        Digit9: KEY.SETTINGS
    });

    let keyMap = {};
    let isKeysFilteredMode = true;

    const remap = (map = {}) => {
        settings.set(opts.INPUT_KEYBOARD_MAP, map);
        log.info('Keyboard keys have been remapped')
    }

    const onKey = (code, callback) => !keyMap[code] || callback(keyMap[code]);

    event.sub(KEYBOARD_TOGGLE_FILTER_MODE, data => {
        isKeysFilteredMode = data.mode !== undefined ? data.mode : !isKeysFilteredMode;
        log.debug(`New keyboard filter mode: ${isKeysFilteredMode}`);
    });

    return {
        init: () => {
            keyMap = settings.loadOr(opts.INPUT_KEYBOARD_MAP, defaultMap);
            const body = document.body;
            // !to use prevent default as everyone
            body.addEventListener('keyup', e => {
                if (isKeysFilteredMode) {
                    onKey(e.code, key => event.pub(KEY_RELEASED, {key: key}));
                } else {
                    event.pub(KEYBOARD_KEY_PRESSED, {key: e.code});
                }
            });
            body.addEventListener('keydown', e => onKey(e.code, key => event.pub(KEY_PRESSED, {key: key})));
            log.info('[input] keyboard has been initialized');
        },
        settings: {
            remap
        }
    }
})
(event, document, KEY, log, opts, settings);
