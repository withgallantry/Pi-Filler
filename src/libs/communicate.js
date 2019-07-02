const ipc = require('crocket');
const isElevated = require('is-elevated');
const ipcElectron = require('electron').ipcRenderer;

let server;
const socketPath = '/tmp/' + Math.random().toString(36).substr(2, 5) + '.sock';

exports.server = server;

const startServer = () => {
    return new Promise((accept, reject) => {
        server = new ipc();
        server.listen({
            path: socketPath
        }, function (error) {
            if (error) {
                reject(error);
                return
            }

            // now that server has been created, spawn root thread
            ipcElectron.send('rootsd', socketPath);
            accept();
        })
    });
};

exports.setCorrectElevation = () => {
    return new Promise(async (accept, reject) => {

        const elevated = await isElevated();

        if (!elevated) {
            await startServer();
            accept(server);
        }
    });
};
