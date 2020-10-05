import React from 'react';
import CONFIG from '../../config.json';
import { NerdGraphQuery, Tabs, TabsItem, Button, UserStorageMutation, UserStorageQuery, Toast, Card, CardHeader, CardBody, } from 'nr1';
import {HeaderPane} from "./HeaderPane.js"
import { Workloads } from './Workloads.js'

const workloads_gql = require( './workloads_gql.js');

export default class OrgWorkloadStatusNerdlet extends React.Component {
    constructor(props) {
        super(props);
        this.state = { config: CONFIG, allWorkloads: null, workloadsMap: null, parentWorkloads: []};
        this.deleteConfig = this.deleteConfig.bind(this);
        this.loadConfig = this.loadConfig.bind(this);
        this.loadAllWorkloads = this.loadAllWorkloads.bind(this);
        this.uploadDefaultConfig = this.uploadDefaultConfig.bind(this);
        this.saveConfig = this.saveConfig.bind(this);
        this.addParent = this.addParent.bind(this);
        this.removeParent = this.removeParent.bind(this);
        this.removeFrom = this.removeFrom.bind(this);
    }

    async componentDidMount() {
        //this.deleteConfig();
        this.loadConfig();
        this.loadAllWorkloads();
    }

    async addParent(parent) {
        console.log('adding parent ' + parent);
        let { config, parentWorkloads } = this.state;
        if (parentWorkloads.includes(parent)) {
            Toast.showToast({ title: 'Workload already a parent',
                description: 'The Workload selected is already a parent',
                type: Toast.TYPE.WARNING,
            });
            return;
        }
        parentWorkloads.push(parent);
        config.parentWorkloads = parentWorkloads;
        this.saveConfig();
        this.setState({ parentWorkloads:parentWorkloads, config:config });
    }

    removeFrom(arr, value) {
        return arr.filter(
            function(ele) {
                return ele !== value;
            });
    }

    async removeParent(parent) {
        console.log('adding parent ' + parent);
        let { config, parentWorkloads } = this.state;
        let newParents = this.removeFrom(parentWorkloads,parent);
        config.parentWorkloads = newParents;
        this.saveConfig();
        this.setState({ parentWorkloads:newParents, config:config });
    }

    render() {
        let { config, allWorkloads, parentWorkloads, workloadsMap} = this.state;
        return (
            <>
                {config != null && allWorkloads != null && workloadsMap != null &&
                    <div className="headerContainer"><HeaderPane config={config} allWorkloads={allWorkloads}
                        parentWorkloads={config.parentWorkloads} onAddParent={this.addParent} onRemoveParent={this.removeParent}/></div>
                }
                {config != null && parentWorkloads != null && parentWorkloads.length > 0 && workloadsMap != null &&
                <Tabs defaultValue="main" className="tabsItem">
                    {parentWorkloads.map(parentWorkload => (
                        <TabsItem value={parentWorkload} label={parentWorkload} className="tabsItem">
                            <div className="OuterContainer">
                                <Workloads accountId={config.accountId} parentWorkloadName={parentWorkload}
                                           allWorkloads={allWorkloads} workloadsMap={workloadsMap}/>
                            </div>
                        </TabsItem>))
                    }
                </Tabs>
                }
                {config != null && parentWorkloads != null && parentWorkloads.length <= 0 && allWorkloads != null &&
                    <Tabs>
                        <TabsItem value="main" label="Config" className="tabsItem">
                            <ConfigTab/>
                        </TabsItem>
                    </Tabs>
                }
            </>
        );
    }

    async loadConfig() {
        console.log("loading configuration");
        let response = await UserStorageQuery.query({
            collection: CONFIG.configCollection,
            documentId: CONFIG.configDocument,
        });
        if(response.errors) {
            console.log('Error loading config : ' + response.errors);
        } else if(!response.data) {
            console.log('saving default config');
            Toast.showToast({
                title: 'Workload Status Config',
                description: 'Uploading initial configuration',
                type: Toast.TYPE.NORMAL,
            });
            this.uploadDefaultConfig();
        } else {
            let config = response.data;
            console.log('received configuration ' + JSON.stringify(config));
            this.setState({ "config": config, "parentWorkloads" : config.parentWorkloads  });
        }
    }

    async deleteConfig() {
        let response = await UserStorageMutation.mutate({
            actionType: UserStorageMutation.ACTION_TYPE.DELETE_COLLECTION,
            collection: CONFIG.configCollection,
            documentId: CONFIG.configDocument
        });
        if(response.errors) {
            console.log('Error deleting config : ' + JSON.stringify(response.errors));
            Toast.showToast({
                title: 'Workload Status Config Delete Error',
                description: 'Error uploading initial config',
                type: Toast.TYPE.CRITICAL,
            });
        } else if(response.data) {
            console.log(JSON.stringify(response.data));
            Toast.showToast({
                title: 'Workload Status Config',
                description: 'Config Deleted',
                type: Toast.TYPE.NORMAL,
            });
        }
    }

    async uploadDefaultConfig() {
        let response = await UserStorageMutation.mutate({
            actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: CONFIG.configCollection,
            documentId: CONFIG.configDocument,
            document: JSON.stringify(CONFIG),
        });
        if(response.errors) {
            console.log('Error saving config : ' + JSON.stringify(response.errors));
            Toast.showToast({
                title: 'Workload Status Config Error',
                description: 'Error uploading initial config',
                type: Toast.TYPE.CRITICAL,
            });
        } else if(response.data) {
            console.log(JSON.stringify(response.data));
            Toast.showToast({
                title: 'Workload Status Config',
                description: 'Config Saved',
                type: Toast.TYPE.NORMAL,
            });
            this.setState({ "config": response.data.nerdStorageWriteDocument  });
            console.log('default config set ' + JSON.stringify(response.data.nerdStorageWriteDocument));
        }
    }

    async loadAllWorkloads() {
        let response = await NerdGraphQuery.query({ query: workloads_gql.allWorkloadsQuery(CONFIG.accountId) });
        if(response.errors) {
            console.log('Error in loading all workloads : ' + JSON.stringify(response.errors));
        } else if(response.data) {
            let allWorkloads = response.data.actor.account.workload.collections
            let workloadsMap = new Map();
            allWorkloads.forEach(workload => {
                workloadsMap.set(workload.name, workload);
            });
            this.setState({ "allWorkloads": allWorkloads , "workloadsMap": workloadsMap});
        }
    }

    async saveConfig() {
        let {config} = this.state;
        console.log('config used in saveConfig ' + JSON.stringify(config));
        let response = await UserStorageMutation.mutate({
            accountId: config.accountId,
            actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: config.configCollection,
            documentId: config.configDocument,
            document: JSON.stringify(config),
        });
        if(response.errors) {
            console.log('Error saving config : ' + JSON.stringify(response.errors));
        } else if(response.data) {
            Toast.showToast({
                title: 'Workload Status Config',
                description: 'Config Saved',
                type: Toast.TYPE.NORMAL,
            });
        }
    }
}

class ConfigTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 'selectedParent': ''};
    }

    render() {
        return(
        <div className="initialMessage">
            <Card>
                <CardHeader className="configMessage" title="System Status Nerdpack" subtitle="Overview" />
                <CardBody className="configMessage">
                       System Status Nerdpack allows you to view and navigate Workloads and view their status. It only displays status of Workloads that contain other Workloads only.
                    You can build a hierarchy of Workloads that contain other workloads to reflect your organization structure.
                    Provided such a workload structure is available you can use this Nerdpack to choose the parent workloads you are interested in.
                    Once chosen those parent workloads and their children and their status will be displayed in this Nerdpack.
                </CardBody>
            </Card>
            <Card>
                <CardHeader className="configMessage" title="Select Parents" subtitle="Configure" />
                <CardBody className="configMessage">
                    <div>Please Click on the Configure
                        <Button disabled={true} iconType={Button.ICON_TYPE.INTERFACE__VIEW__LIST_VIEW} sizeType={Button.SIZE_TYPE.SMALL}> Configure </Button> Button in header panel to choose the parent workloads.
                    </div>
                </CardBody>
            </Card>
        </div>);
    }
}