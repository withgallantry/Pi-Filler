var electron = require('electron');
var isElevated = require('is-elevated');
var sudoPrompt = require('sudo-prompt');
var os = require('os');
var platform = os.platform();
var packageJSON = require('../../package.json');
var path = require('path');


//TODO Doesn't need window specific check, just use sudoprompt
exports.require = async (additionalArguments, callback) => {
    const elevated = await isElevated();

        if (elevated) {
            return callback()
        }

        // copy the args and add in the additional arguments
        const args = process.argv.slice();
        for (let i = 0; i < additionalArguments.length; i++) {
            args.push(additionalArguments[i])
        }

        // case split for unix and windows
        if (platform === 'darwin' || platform === 'linux') {

            sudoPrompt.exec(args.join(' '), {
                name: packageJSON.displayName,
                icns: path.join(__dirname, '../assets/logo.png')
            }, () => {
                process.exit(0);
            })


        } else if (platform === 'win32') {

            const elevator = require('elevator');
            elevator.execute(args, {}, callback)

        }
};
