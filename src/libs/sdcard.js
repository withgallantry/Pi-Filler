const umount = require('umount');
const imagefs = require('resin-image-fs');
const Promise = require('bluebird');
const fs = require('fs');
const pathing = require("path");
const denymount = require("denymount");
import store from '../redux/store';
import {setError} from '../redux/actions';
const isElevated = require('is-elevated');
import ipc from 'crocket';

export const isMounted = (path) => {
    return new Promise((accept, reject) => {
        umount.isMounted(path, (error, isMounted) => {
            if (error) reject(error);
            accept(isMounted);
        });
    });
};

export const unMount = (path) => {
    return new Promise((accept, reject) => {
        umount.umount(path, (error, stdout) => {
            if (error) reject(error);
            accept(stdout);
        });
    });
};

export const bytesToGB = (byteNum) => {
    return Math.ceil(byteNum / 1000000000);
};

// http://man7.org/linux/man-pages/man7/inode.7.html
const readModeBits = (num) => {
    const fileTypeBitField = 0o170000;

    const flags = parseInt(num.toString(), 8);
    const fileTypeMask = num & fileTypeBitField;

    return fileTypeMask;
};

const getType = (num) => {

    const mask = readModeBits(num);

    const types = {
        0o100000: 'file',
        0o40000: 'dir',
        0o120000: 'symlink',
    };

    return types[mask] ? types[mask] : 'unknown';
};

export const getFileList = async (path, filePath) => {

    isElevated(function (error, elevated) {
        if (error) {
            cb.error(error)
            return
        }
    }

    try {
        await unMount(path);
    } catch (e) {
        store.dispatch(setError({type: 'critical', msg: 'Error reading removeable media.'}));
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

const _writeFile = async (drive, path, files, cb, index, count) => {

    const file = files[index];
    const fileContents = await fs.readFileSync(file);
    const fileName = pathing.basename(file);
    const fullPath = path + '/' + fileName;
    const {cancelUpload} = store.getState();

    if (cancelUpload) {
        cb({fileName, count, index, cancel: cancelUpload});
        return;
    }

    cb({fileName, count, index});

    imagefs.writeFile({
        image: drive,
        partition: 2,
        path: fullPath,
    }, fileContents).then(() => {
        writeFiles(drive, path, files, cb, index, count);
    });
};

export const writeFiles = async (drive, path, files, cb, index = -1, count = -1) => {

    denymount('/dev/disk2', async function (callback) {

        if (count == -1) {
            await unMount(drive);

            const curIndex = 0;
            const maxCount = files.length - 1;

            _writeFile(drive, path, files, cb, curIndex, maxCount);

        } else if (index < count) {

            const curIndex = index + 1;
            const maxCount = files.length - 1;

            _writeFile(drive, path, files, cb, curIndex, maxCount);
        }
    }, {
        autoMountOnSuccess: false
    }, function (error, message) {
        if (error) {
            throw error;
        }

        console.log(message);
    });


};