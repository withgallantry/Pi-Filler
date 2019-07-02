import React, {Component} from "react";
import SvgFolder from './svgs/folder';
import {AutoFontSize} from 'auto-fontsize';
import  {Icon}  from 'office-ui-fabric-react';

class ItemTile extends Component {

    getImageFromType(type) {
        const types = {
            dir: <SvgFolder className="dirIcon"/>,
            file: <Icon iconName="Document" className="fileIcon"/>
        };

        return types[type] ? types[type] : <SvgFolder className="dirIcon"/>;
    };

    render() {
        return (
            <div className="itemTile layout vertical center" onClick={(e) => {
                this.props.onClick(e, this.props.tileName, this.props.type);
            }}>
                {this.getImageFromType(this.props.type)}
                <div className="tileName">
                    <AutoFontSize
                        text={this.props.tileName}
                        minTextSize={10}
                        textSize={16}
                        textSizeStep={2}
                        targetLines={1}
                    />
                </div>
            </div>
        );
    }
}


export default ItemTile
