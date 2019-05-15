const Palindrom = require('palindrom');
const { useEffect, useState } = require('react');

const defaultOptions = {
    useWebSocket: true,
    debug: false,
    localVersionPath: '/_ver#c$',
    remoteVersionPath: '/_ver#s',
    ot: true,
    purity: false,
    pingIntervalS: 60,
    path: '/',
    devToolsOpen: false,
    fatalErrorReloadAfterS: 5,
};

const subscribers = new Set();
let isConnectionSetup = false;
let palindromInstance;

function setupPalindromConnection(options) {
    if(isConnectionSetup) {
        return Promise.resolve();
    }
    return new Promise(function(resolve, reject) {
        if (!options.remoteUrl) {
            throw new TypeError('Palindrom: options.remoteUrl is required');
        }
        const mergedOptions = { ...defaultOptions, ...options };

        mergedOptions.onRemoteChange = () => {
            subscribers.forEach(callback => callback());
        };

        mergedOptions.onLocalChange = () => {
            subscribers.forEach(callback => callback());
        };

        mergedOptions.onStateReset = function(obj) {
            subscribers.forEach(callback => callback());
            resolve(obj);
        };
        
        isConnectionSetup = true;
        palindromInstance = new Palindrom(mergedOptions);
    });
}
/**
 * Use this hook to have your component re-rendered whenever a Palindrom update occurs
 * @return a reactive Palindrom object
 */
function usePalindromState() {
    if (!isConnectionSetup) {
        throw new Error(
            'Palindrom connection is not setup. Please call setupPalindromConnection and wait for it to resolve first'
        );
    }
    const [palindromObj, setPalindromObj] = useState(palindromInstance.obj || {});
    function onUpdate() {
        setPalindromObj({ ...palindromInstance.obj });
    }
    useEffect(() => {
        subscribers.add(onUpdate);
        return () => {
            subscribers.delete(onUpdate);
        };
    }, []);
    return palindromObj;
}

module.exports = { setupPalindromConnection, usePalindromState };
