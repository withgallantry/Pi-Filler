import React, {Component} from "react";
import SdCard from './svgs/sdCard';
import {isMounted, unMount, bytesToGB} from '../libs/sdcard';
import {connect} from 'react-redux';
import {setLoading, setDrive} from '../redux/actions';

class Card extends Component {

    async handleFile(path) {

        const partitionNumber = 2;

        this.props.setLoading(true);

        const mounted = await isMounted(path);

        if (mounted) {
            const unmount = await unMount(path);
        }

        this.props.setDrive(path);

    }

    constructor(props) {
        super(props);

        this.clickHandler = () => {
            const path = this.props.location;

            this.handleFile(path);
        }
    }

    render() {
        return (
            <div className="sdCardContainer" onClick={this.clickHandler}>
                <SdCard className="sdCard"/>
                <div className="cardSize">
                    {bytesToGB(this.props.drive.size)}GB
                </div>
                <div>{this.props.location}</div>
            </div>

        )
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        loading: state.loading
    }
};

const mapDispatchToProps = {setLoading, setDrive};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Card)