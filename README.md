[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# nr1-orgstatus

Nerdpack to visualize Status for Hierarchy of Workloads that reflect your Organization Structure

## Installation

* git clone https://github.com/newrelic-experimental/nr1-orgstatus.git 


## Getting Started

* Update nr1-orgstatus/config.json with the appropriate account number
    
    The account number should be the account which contains the workloads that need to visualized.
    
* Update the nerdlets/orgstatus-nerdlet/brand_logo.png to your brand logo

* Update the launcher icon  launchers/nr1-orgstatus-launcher/icon.png

* Execute the nr1 commands to generate unique uuid , build and test the nerdpack locally
 
    Use the profile parameter in case there are multiple profiles in your nr1 environment.
     
* * nr1 nerdpack:uuid -gf [ --profile=<profile_name ]

Test Locally.
* * nr1 nerdpack:serve [ -profile=<profile_name> ]

* Publish and subscribe accounts to the nerdpack

* * nr1 nerdpack:publish [ --profile=<profile_name> ]

* * nr1 nerdpack:subscribe -c STABLE [ --profile=<profile_name> ] 

## Usage

Create a hierarchy of Workloads to reflect your organization structure. These workloads must contain only other workloads to depict an organization group. 

Once the Nerdpack is deployed. Use the Configure screen to choose parent workloads.

Status of the parent workloads and their children will be displayed by the Nerdpack.

The Workload Status tiles also allow 
* Drilling down to children 
* Navigating back to parent and
* Navigating to the Workloads User Interface

The Nerdpack only displays Workloads that contain purely other workloads. 

Workloads with other entities are better viewed in the Workloads User Interface.
 
## Contributing
We encourage your contributions to improve nr1-orgstatus! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License
[Project Name] is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
