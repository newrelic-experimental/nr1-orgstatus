import React from 'react';
import BrandLogo from "./brand_logo.png";
import NRLogo from "./nrlogo.png";
import { Button, HeadingText, Modal, } from 'nr1';
import {WorkloadStatusConfig} from "./WorkloadStatusConfig"

export class HeaderPane extends React.Component {

    constructor(props) {
        super(props);
        this.altLogoMessage = 'Organization System Status';
        this.state = {
            hidden: true,
            mounted: false,
        };
        this._onClick = this._onClick.bind(this);
        this._onClose = this._onClose.bind(this);
        this._onHideEnd = this._onHideEnd.bind(this);
    }

    _onClick() {
        this.setState({
            hidden: false,
            mounted: true,
        });
    }

    _onClose() {
        this.setState({ hidden: true });
    }

    _onHideEnd() {
        this.setState({ mounted: false });
    }


    render() {
        return (
            <div className="LogoHeader">
                <img className="DashboardLogo" alt={this.altLogoMessage} src={BrandLogo} />
                <div className="NRLogo"><a href={this.newrelicBaseUrl}><img className="NRLogoImg" alt="New Relic" src={NRLogo} /></a></div>
                <div className="DashboardTitle">System Status</div>
                <Button type={Button.TYPE.NORMAL} iconType={Button.ICON_TYPE.INTERFACE__VIEW__LIST_VIEW}
                        sizeType={Button.SIZE_TYPE.LARGE} spacingType={[Button.SPACING_TYPE.LARGE]} className="configButton"
                        onClick={ () => this._onClick() }> Configure </Button>
                { this.state.mounted && (
                    <Modal  className="configModal" hidden={this.state.hidden}
                            onClose={this._onClose}
                            onHideEnd={this._onHideEnd}
                    >
                        <HeadingText type={HeadingText.TYPE.HEADING_1}>System Status Configuration</HeadingText>
                        <WorkloadStatusConfig config={this.props.config} parentWorkloads={this.props.parentWorkloads}
                                              allWorkloads={this.props.allWorkloads} onAddParent={this.props.onAddParent}
                                              onRemoveParent={this.props.onRemoveParent}/>
                        <Button onClick={this._onClose}>Close</Button>
                    </Modal>
                )}
            </div>
        );
    }
}