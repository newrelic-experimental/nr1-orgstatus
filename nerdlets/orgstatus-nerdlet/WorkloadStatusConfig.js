import React from 'react';
import { Button, Select, SelectItem, Card, CardBody, CardHeader,Grid,GridItem} from "nr1";


export class WorkloadStatusConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = { config: this.props.config, parentWorkloads: this.props.config.parentWorkloads, selectedParent: '' };
        this.state = { 'selectedParent': null};
        this.onParentSelected = this.onParentSelected.bind(this);
        this.addParent = this.addParent.bind(this);
        this.removeParent = this.removeParent.bind(this);
    }

    async componentDidMount() {
        this.setState({'selectedParent': null});
    }

    onParentSelected(event, value) {
        this.setState({ 'selectedParent': value });
    }

    addParent() {
        this.props.onAddParent(this.state.selectedParent);
    }

    removeParent(parent) {
        this.props.onRemoveParent(parent);
    }

    render() {
        const workloadItems = this.props.allWorkloads.map(workload =>
            <SelectItem key={workload.name} value={workload.name}>{workload.name}</SelectItem>);
        let { selectedParent } = this.state;
        return (
            <>
                <Card>
                    <CardHeader title="Select Parents" subtitle="Configure" />
                    <CardBody>
                        <Grid className="workloadConfigGrid">
                            <GridItem columnSpan={2} className="addParentMessage" collapseGapAfter={true}>
                            <div> Adding a Parent Workload adds a tab to the System Status Nerdpack. The tab displays status of the parent and it's children.
                                You can further drill down into the children workloads if they have more workloads.</div>
                            </GridItem>
                        </Grid>
                        <Grid className="workloadConfigGrid">
                            <GridItem columnSpan={1} className="workloadName" collapseGapAfter={true}>
                                <Select  spacingType={[Select.SPACING_TYPE.MEDIUM]} onChange={this.onParentSelected} value={selectedParent}>
                                    <SelectItem key="nullItem" value="--Select Parent--" disabled={true} >--Select Parent--</SelectItem>
                                    {workloadItems}
                                </Select>
                            </GridItem>
                            <GridItem columnSpan={1} className="workloadAction" collapseGapBefore={true}>
                                <Button iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS} sizeType={Button.SIZE_TYPE.MEDIUM} onClick = { () => { this.addParent()}} >Add</Button>
                            </GridItem>
                        </Grid>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader title="Parent Workloads" />
                    <CardBody>
                        {this.props.parentWorkloads != null && this.props.parentWorkloads.length > 0 &&
                            <div>
                                {this.props.parentWorkloads.map(parentWorkload =>
                                        <Grid className="workloadConfigGrid">
                                            <GridItem columnSpan={1} className="workloadName" collapseGapAfter={true}><div className="parentName">{parentWorkload}</div></GridItem>
                                            <GridItem columnSpan={1} className="workloadAction" collapseGapBefore={true}>
                                                <Button iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__REMOVE__V_ALTERNATE}
                                                        sizeType={Button.SIZE_TYPE.SMALL} onClick = { () => { this.removeParent(parentWorkload)}}/>
                                            </GridItem>
                                        </Grid>)
                                }
                            </div>
                        }
                    </CardBody>
                </Card>
        </>);
    }
}