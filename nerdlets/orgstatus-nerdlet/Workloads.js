import React from 'react';
import {StatusTile} from "./StatusTile";
import {Button, Card, CardBody, CardHeader, GridItem, HeadingText, navigation, Spinner,Grid,NerdGraphQuery, } from "nr1";
const workloads_gql = require( './workloads_gql.js');

export class Workloads extends React.Component {

    constructor(props) {
        super(props);
        this.state = { parentWorkloadName: this.props.parentWorkloadName, childWorkloads: null};
        this.onChangeParent=this.onChangeParent.bind(this);
        this.loadChildren=this.loadChildren.bind(this);
    }

    async componentDidMount() {
        this.loadChildren();
    }

    async onChangeParent(workloadName) {
        this.setState({ parentWorkloadName: workloadName });
        this.loadChildren(workloadName);
    }

    async loadChildren(wlName) {
        let{ parentWorkloadName } = this.state;
        if (wlName)
            parentWorkloadName = wlName;
        console.log('loadChildren of ' + parentWorkloadName);
        let{ workloadsMap } = this.props;
        if ( parentWorkloadName && parentWorkloadName != 'None' && workloadsMap) {
            let parentWorkload = workloadsMap.get(parentWorkloadName);
            if (parentWorkload.entitySearchQuery != "") {
                let response = await NerdGraphQuery.query({ query: workloads_gql.childEntitiesQuery(parentWorkload.entitySearchQuery) });
                if(response.errors) {
                    console.log('Error in querying child entities : ' + JSON.stringify(response.errors));
                } else if(response.data) {
                    let childEntities = response.data.actor.entitySearch.results.entities;
                    let nonWorkloadChildren = 0;
                    let childWorkloads = [];
                    for (let i = 0; i < childEntities.length; i++) {
                        if(workloadsMap.has(childEntities[i].name)) {
                            let childWL = workloadsMap.get(childEntities[i].name);
                            childWL.parentName = parentWorkloadName;
                            childWorkloads.push(childWL);
                        } else {
                            nonWorkloadChildren++;
                            break;
                        }
                    }
                    if(nonWorkloadChildren >0){
                        childWorkloads = [];
                    }
                    this.setState({ "childWorkloads": childWorkloads});
                }
            } else {
                let noChildren = [];
                this.setState({"childWorkloads": noChildren});
            }
        }
    }

    render() {
        let {parentWorkloadName, childWorkloads } = this.state;
        console.log('render Workloads parent is ' + JSON.stringify(parentWorkloadName));
        if (parentWorkloadName && parentWorkloadName != 'None' && this.props.workloadsMap) {
            let{ workloadsMap } = this.props;
            let parentWorkload = workloadsMap.get(parentWorkloadName);
            return <div>
                    <ParentStatus workload={parentWorkload} accountId={this.props.accountId} onChangeParent={this.onChangeParent}/>
                    <ChildrenStatus parentWorkload={parentWorkload} childWorkloads={childWorkloads} accountId={this.props.accountId} onChangeParent={this.onChangeParent}/>
                </div>
        } else if(this.props.allWorkloads != null) {
            let allWorkloadStatus = this.props.allWorkloads.map(workload => (
                <StatusTile key={workload.name} workload={workload} accountId={this.props.accountId} />));
            return <Grid spacingType={[Grid.SPACING_TYPE.LARGE, Grid.SPACING_TYPE.LARGE]} fullHeight>
                {allWorkloadStatus}
            </Grid>
        } else {
            return (<Spinner spacingType={[Spinner.SPACING_TYPE.LARGE]} />);
        }
    }
}

class ParentStatus extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <Grid className="parentGrid" spacingType={[Grid.SPACING_TYPE.MEDIUM, Grid.SPACING_TYPE.MEDIUM]} fullHeight>
            <StatusTile  workload={this.props.workload} accountId={this.props.accountId}
                        isParent={true} onChangeParent={this.props.onChangeParent}/>
        </Grid>
    }
}

class ChildrenStatus extends React.Component {
    constructor(props) {
        super(props);
        if(this.props.childWorkloads)
            console.log('ChildrenStatus got children ' + this.props.childWorkloads.length);
        this.onChangeParent=this.onChangeParent.bind(this);
    }

    onChangeParent(workloadName) {
        this.props.onChangeParent(workloadName);
    }

    render() {
        let childWorkloadStatus = null;
        if (this.props.childWorkloads!= null) {
            if(this.props.childWorkloads.length != null && this.props.childWorkloads.length != 0) {
                childWorkloadStatus = this.props.childWorkloads.map(workload => (
                    <StatusTile key={workload.name} workload={workload} accountId={this.props.accountId}
                                onChangeParent={this.onChangeParent}/> ));
            } else {
                childWorkloadStatus = <NoChildrenCard workload={this.props.parentWorkload}/>
            }
        }
        return <Grid spacingType={[Grid.SPACING_TYPE.MEDIUM, Grid.SPACING_TYPE.MEDIUM]} fullHeight>
                {childWorkloadStatus}
            </Grid>
    }
}

class NoChildrenCard extends React.Component {
    render() {
        return <GridItem columnStart={5} columnEnd={8} collapseGapBefore={true} collapseGapAfter={true} className="wl-status-grid-item">
            <div className="WorkloadStatusBlock">
                <Card>
                    <CardHeader className="WorkloadBlock" title="Workload Does not Have Children" subtitle="Info" />
                    <CardBody className={`StatusBlock-UNKNOWN`}>
                        <HeadingText type={HeadingText.TYPE.HEADING_5}>Please Navigate to the Workloads UI to drill down further</HeadingText>
                        <Button iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EXTERNAL_LINK} onClick={() => navigation.openEntity(this.props.workload.guid)} />
                    </CardBody>
                </Card>
            </div>
        </GridItem>
    }
}