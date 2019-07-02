import React, {Component} from "react";
import {getFileList, setCorrectElevation} from '../libs/sdcard';
import {connect} from 'react-redux';
import {setLoading, setFilePath, addNavPath, popNavPath} from '../redux/actions';
import ItemTile from '../components/itemTile';
import Header from '../components/Header';

class DirectoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {files: []}
        this.onItemClick = this._onItemClick.bind(this);
        this.navigateBack = this._navigateBack.bind(this);
        this.refreshDirectory = this._refreshDirectory.bind(this);
    }

    async componentWillMount() {
        this.getFiles(this.props.filePath);
    }

    async getFiles(filePath) {
        const drive = this.props.drive;
        if (drive) {
            this.props.setLoading(true);
            const files = await getFileList(drive, filePath);
            if (files && files.length > -1) {
                this.setState({files});
                this.props.setLoading(false);
            }
        }
    }

    _changeDir(navPath) {
        this.props.setFilePath(navPath);
        this.getFiles(navPath);
    }

    _onItemClick(e, name, type) {
        if (type === 'dir') {
            const navPath = this.props.filePath + '/' + name;
            this._changeDir(navPath);
            this.props.addNavPath(navPath);
        }
    }

    _navigateBack() {
        const navPaths = this.props.navPaths;

        if (navPaths.length === 1) return;

        if (navPaths.length === 2) {
            this._changeDir(navPaths[0]);
        } else {
            this._changeDir(navPaths[navPaths.length - 2]);
        }

        this.props.popNavPath();
    }

    _refreshDirectory() {
        const navPaths = this.props.navPaths;
        this._changeDir(navPaths[navPaths.length - 1]);
    }

    render() {
        return (
            <div className="layout">
                <Header onNavigateBack={this.navigateBack} refreshDirectory={this.refreshDirectory}/>
                <div className="directoryList layout flex horizontal wrap">
                    {this.state.files.map((file, index) => {
                        return <ItemTile tileName={file.name} type={file.type} key={index} onClick={this.onItemClick}/>
                    })}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state /*, ownProps*/) => {
    return {
        loading: state.loading,
        filePath: state.filePath,
        navPaths: state.navigationPaths,
    }
};

const mapDispatchToProps = {
    setLoading,
    setFilePath,
    addNavPath,
    popNavPath,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DirectoryList)
