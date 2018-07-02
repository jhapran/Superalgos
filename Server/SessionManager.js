﻿exports.newSessionManager = function newSessionManager() {

    let thisObject = {
        getSession: getSession,
        initialize: initialize
    }

    let activeSessions = new Map();

    return thisObject;

    function initialize(pServerConfig, callBackFunction) {

        readSessions();

        function readSessions() {

            try {

                const STORAGE = require('../Server/Storage');
                let storage = STORAGE.newStorage();

                storage.initialize(undefined, pServerConfig);
                storage.readData("AdvancedAlgos", "AAPlatform", "Open.Sessions.json", false, onData);

                function onData(err, pText) {

                    if (err.result !== global.DEFAULT_OK_RESPONSE.result) {

                        console.log("[ERROR] SessionManager -> initialize -> readSessions -> onData -> Could not read a file. ");
                        console.log("[ERROR] SessionManager -> initialize -> readSessions -> onData -> err.message = " + err.message);

                        callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                        return;
                    }

                    let sessions = JSON.parse(pText);

                    for (let i = 0; i < sessions.length; i++) {

                        let session = sessions[i];

                        activeSessions.set(session.sessionToken, session);

                    }

                    callBackFunction(global.DEFAULT_OK_RESPONSE);

                }
            }
            catch (err) {
                console.log("[ERROR] readSessions -> err = " + err.message);
                console.log("[HINT] You need to have a file at this path -> " + filePath);

                callBackFunction(global.DEFAULT_FAIL_RESPONSE);
            }
        }
    }

    function getSession(pSessionToken) {

        return activeSessions.get(pSessionToken);

    }
}