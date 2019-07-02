import React, {Component} from "react";
import {IconButton, PrimaryButton, Modal, ProgressIndicator} from 'office-ui-fabric-react';
import {connect} from 'react-redux';
import {addNavPath, popNavPath, cancelUpload} from '../redux/actions';
const {dialog} = require('electron').remote;
import {writeFiles} from '../libs/sdcard';


class Header extends Component {

    constructor(props) {
        super(props);
        this.uploadFiles = this._uploadFiles.bind(this);
        this.cancelFileUpload = this._cancelFileUpload.bind(this);
        this.state = {
            showFileProgress: false,
            curFile: '',
            curProgress: 0,
            maxFiles: 0,
            curPercent: 0,
        }
    }

    _resetFileProgressState() {
        this.setState((state) => {
            return {
                curFile: '',
                curProgress: 0,
                maxFiles: 0,
                showFileProgress: false,
            }
        });
    }

    _uploadFiles() {

        this.props.cancelUpload(false);

        const files = dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
        });

        this.setState((state) => {
            return {showFileProgress: true}
        });

        writeFiles(this.props.drive, this.props.curFilePath, files, ({fileName, count, index, cancel = false}) => {

            if (cancel) {
                this._resetFileProgressState();
                this.props.refreshDirectory();
            }

            if (count === index) {
                this._resetFileProgressState();
                this.props.refreshDirectory();
            } else {

                this.setState((state) => {
                    return {
                        curFile: fileName,
                        curProgress: index + 1,
                        maxFiles: count + 1,
                        curPercent: ((index + 1) / (count + 1))
                    }
                });
            }
        });
    }

    _cancelFileUpload() {
        this.props.cancelUpload(true);
    }

    render() {
        return (
            <div className="header layout horizontal">
                <IconButton iconProps={{iconName: 'Back'}} title="Back" className="icon"
                            ariaLabel="Back" onClick={this.props.onNavigateBack}/>
                <div className="flex layout horizontal center">
                    <PrimaryButton onClick={this.uploadFiles}>Add Roms to this Folder</PrimaryButton>
                </div>
                <Modal
                    titleAriaId="fileProcess"
                    subtitleAriaId="file"
                    isOpen={this.state.showFileProgress}
                    containerClassName="fileProgressDialog"
                    scrollableContentClassName="fileProgressDialog"
                    isBlocking={true}
                >
                    <div className="innerFileProgressDialog layout horizontal center">
                        <ProgressIndicator label={this.state.curFile}
                                           className="progressIndicator"
                                           description={`${this.state.curProgress} / ${this.state.maxFiles}`}
                                           percentComplete={this.state.curPercent}/>
                        <IconButton className="icon" iconProps={{iconName: 'Cancel'}} title="Cancel"
                                    onClick={this.cancelFileUpload}/>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        drive: state.drive,
        curFilePath: state.filePath,
    }
};

const mapDispatchToProps = {addNavPath, popNavPath, cancelUpload};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)

