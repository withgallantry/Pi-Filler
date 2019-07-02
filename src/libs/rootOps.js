const umount = require('umount');
const {server} = require('./communicate');
const imagefs = require('resin-image-fs');
const Promise = require('bluebird');

exports.getFileList = async (path, filePath) => {
    try {
        await unMount(path);
    } catch (e) {
        server.emit('/error', 'Error reading removeable media.');
    }

    const options = {
        image: path,
        partition: 2,
        path: filePath,
    };

    let dirList;

    try {
        dirList = await imagefs.listDirectory(options);
    } catch (e) {
        store.dispatch(setError({type: 'critical', msg: 'Error reading removeable media.'}));
    }

    return new Promise((accept, reject) => {
        return Promise.using(imagefs.interact(path, 2), async function (fs_) {
            accept(await Promise.all(
                dirList.map(
                    async (item) => {
                        return new Promise((accept, reject) => {
                            fs_.stat(filePath + '/' + item, (err, stat) => {
                                accept({
                                    name: item,
                                    type: getType(stat.mode),
                                    mode: stat.mode
                                });
                            });
                        });

                    })));
        }).catch((err) => {
            reject(err)
        });

    });
};