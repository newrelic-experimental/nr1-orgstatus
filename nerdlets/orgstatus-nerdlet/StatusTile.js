import React from 'react';
import { HeadingText , GridItem, NerdGraphQuery, Button, navigation, Card, CardHeader, CardBody, Spinner, Tooltip, } from 'nr1';

export class StatusTile extends React.Component {

    constructor(props) {
        super(props);
        this.state = { status: "FETCHING", parentWorkload: props.parentWorkload};
        this.changeParent=this.changeParent.bind(this);
    }

    changeParent(value) {
        this.props.onChangeParent(value);
    }

    render() {
        if (this.props.isParent) {
            return <GridItem columnStart={5} columnEnd={8} collapseGapBefore={true} collapseGapAfter={true} >
                    <WorkloadTile accountId={this.props.accountId} workload={this.props.workload} onChangeParent={this.changeParent} isParent={this.props.isParent}/>
            </GridItem>
        } else {
            return <GridItem columnSpan={2} >
                <WorkloadTile accountId={this.props.accountId} workload={this.props.workload} onChangeParent={this.changeParent} isParent={this.props.isParent}/>
            </GridItem>
        }
    }
}

class WorkloadTile extends React.Component {
    constructor(props) {
        super(props);
        this.changeParent=this.changeParent.bind(this);

    }

    changeParent(value) {
        this.props.onChangeParent(value);
    }

    render() {
        return <div className="WorkloadStatusBlock">
            <Card>
                <CardHeader className="workloadHeader" title={this.props.workload.name} subtitle="Status"/>
                <CardBody className="StatusBlock-BUTTONS">
                    {this.props.isParent && this.props.workload.parentName &&
                    <Tooltip text={this.props.workload.parentName} placementType={Tooltip.PLACEMENT_TYPE.BOTTOM}>
                        <Button className="Button" iconType={Button.ICON_TYPE.INTERFACE__ARROW__RETURN_LEFT}
                                spacingType={[Button.SPACING_TYPE.SMALL, Button.SPACING_TYPE.SMALL, Button.SPACING_TYPE.OMIT, Button.SPACING_TYPE.SMALL]}
                                type={Button.TYPE.PRIMARY} onClick={() => {this.changeParent(this.props.workload.parentName)}}/>
                    </Tooltip>
                    }
                    {!this.props.isParent &&
                    <Tooltip text="Drill Down" placementType={Tooltip.PLACEMENT_TYPE.BOTTOM}>
                        <Button type={Button.TYPE.PRIMARY} iconType={Button.ICON_TYPE.INTERFACE__ARROW__GO_TO}
                                spacingType={[Button.SPACING_TYPE.SMALL, Button.SPACING_TYPE.SMALL, Button.SPACING_TYPE.OMIT, Button.SPACING_TYPE.SMALL]}
                                onClick={() => {this.changeParent(this.props.workload.name)}}/>
                    </Tooltip>
                    }
                    <Tooltip text="View Workload" placementType={Tooltip.PLACEMENT_TYPE.BOTTOM}>
                    <Button className="Button" iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EXTERNAL_LINK}
                            spacingType={[Button.SPACING_TYPE.SMALL, Button.SPACING_TYPE.SMALL, Button.SPACING_TYPE.OMIT, Button.SPACING_TYPE.SMALL]}
                            type={Button.TYPE.PRIMARY} onClick={() => navigation.openEntity(this.props.workload.guid)}/>
                    </Tooltip>
                </CardBody>
            </Card>
            <WorkloadStatus accountId={this.props.accountId} workload={this.props.workload} />
        </div>
    }
}
class WorkloadStatus extends React.Component {

    constructor(props) {
        super(props);
        this.statusQuery = `query($id: Int!,  $guid: EntityGuid!) {
                                actor {
                                    account(id: $id) {
                                         workload {
                                             collection(guid: $guid) {                                                 
                                                 status {
                                                    value
                                                 }                                                 
                                             }
                                         }
                                    }
                                }
                            }`;
    }

    render() {
        const variables = {id: this.props.accountId, guid: this.props.workload.guid};
        return <div>
            <NerdGraphQuery query={this.statusQuery} variables={variables}>
                {({loading, error, data}) => {
                    if (loading) {
                        console.log('loading status ' + this.props.workload.name  );
                        return <Spinner />;
                    }
                    if (error) {
                        console.log('error loading status ' + this.props.workload.name  );
                        return <Card>
                            <CardBody className={`StatusBlock-UNKNOWN`}>
                                <HeadingText type={HeadingText.TYPE.HEADING_2}>{JSON.stringify(error)}</HeadingText>
                            </CardBody>;
                        </Card>
                    }
                    let status = data.actor.account.workload.collection.status.value;
                    return <Card>
                        <CardBody className={`StatusBlock-${status}`}>
                            <HeadingText type={HeadingText.TYPE.HEADING_2}>{status}</HeadingText>
                        </CardBody>
                    </Card>
                }}
            </NerdGraphQuery>
        </div>
    }
}

