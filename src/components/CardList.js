import React, {Component} from "react";
const drivelist = require('drivelist');
import {IconButton} from 'office-ui-fabric-react';
import Card from './Card';

class CardList extends Component {
    constructor(props) {
        super(props);
        this.state = {drives: []};
        this.findCards = this._findCards.bind(this);
    }

    async _findCards() {
        const drives = await drivelist.list();
        const removebelDrivers = drives.filter((drive) => {
            return drive.isCard;
        });
        this.setState({drives: removebelDrivers});
    }

    componentWillMount() {
        this._findCards();
    }

    render() {
        return (
            <div className="layout flex vertical full-height">
                <div className="logo">
                    <img className="mainLogo" src="../src/assets/logo-big.png"/>
                </div>
                <div className="layout flex center">
                    {this.state.drives.map((drive, index) => {
                        return <Card key={index} location={drive.device} drive={drive}/>;
                    })}

                    {!this.state.drives[0] && <div>
                        <div className="noMedia layout vertical center">
                            <div className="refreshText">No removeable drives found</div>
                            <IconButton className="refreshIcon" title="Refresh" onClick={this.findCards}
                                        iconProps={{iconName: 'Refresh', className: 'refreshIcon'}}></IconButton>
                            <div onClick={this.findCards} className="refreshTextAction">Refresh</div>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}
;


export default CardList
