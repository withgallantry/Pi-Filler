import React, {Component} from "react";
import CardList from './components/CardList';
import {Modal, PrimaryButton} from 'office-ui-fabric-react';
import {connect} from 'react-redux';
import {
    FoldingCube,
} from 'better-react-spinkit';
import DirectoryList from './components/DirectoryList';
import {initializeIcons} from '@uifabric/icons';
import {dismissError, resetState} from './redux/actions';
initializeIcons();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            drive: '',
        }
        this.clearError = this._clearError.bind(this);
    }

    _clearError() {
        this.props.dismissError();
        this.props.resetState();
    }

    render() {
        return (
            <div>
                {!this.props.drive && <CardList/>}
                {this.props.loading &&
                <div className="loading">
                    <FoldingCube color="#FFFFFF" size={120}/>
                </div>}
                {this.props.drive &&
                <DirectoryList drive={this.props.drive}/>
                }
                <Modal
                    titleAriaId="error"
                    subtitleAriaId="error"
                    isOpen={this.props.showError}
                    containerClassName="errorDialog"
                    scrollableContentClassName="errorContentDialog"
                    isBlocking={true}
                >
                    <div className="insideError layout vertical">
                        <div className="errorMessage layout vertical">{this.props.error.msg}</div>
                        <PrimaryButton onClick={this.clearError} className="errorDismissButton">
                            Ok
                        </PrimaryButton>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    // console.log(state);
    return {
        loading: state.loading,
        drive: state.drive,
        error: state.error,
        showError: state.showError,
    }
};

const mapDispatchToProps = {dismissError, resetState};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)