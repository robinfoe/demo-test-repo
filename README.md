App1
https://github.com/wohshon/dashboard

route termination : passthrough

<url>/dashboard-admin.html
<url>/dashboard-client.html


App2 
//as admin, create project and svc account to get a openface docker deployed
oc adm new-project openface-demo --admin=<your user id>
oc project openface-demo
oc create serviceaccount useroot
oc adm policy add-scc-to-user anyuid -z useroot

//switch to normal user id

//deploy openface docker image
git clone -b dev https://github.com/wohshon/openface
cd openface
oc project openface-demo
oc new-app ./ --strategy=docker
//fix the dc to allow run as root
oc patch dc/openface --patch '{"spec":{"template":{"spec":{"serviceAccountName": "useroot"}}}}'
// add a termination passthrough for both routes below
// take note of the hostname for svc 'ws', update for your environment
oc expose svc openface
oc expose dc openface --name=ws
oc expose svc ws --hostname=openface-ws.cloudapps-ocp37-wohshon.ddns.net --port=443 --name=ws-route

//deploy user service
oc new-app --name=users https://github.com/wohshon/demo-test-repo#demo    --context-dir=svc1 -e PORT=8080
//termination passthrough, take note of route hostname
oc expose svc users

//deploy address service
oc new-app --name=addresses https://github.com/wohshon/demo-test-repo#demo    --context-dir=svc2 -e PORT=8080
//termination passthrough, take note of route hostname
oc expose svc addresses

//deploy the front end app
update index.html in front-end project in github 
var USER_SERVICE="https://users-openface-demo.cloudapps-ocp37-wohshon.ddns.net/users"
var ADDRESS_SERVICE="https://addresses-openface-demo.cloudapps-ocp37-wohshon.ddns.net/address"
var WEBSOCKET_ENDPOINT= "wss://openface-ws.cloudapps-ocp37-wohshon.ddns.net:443";

oc new-app --name=front-end https://github.com/wohshon/demo-test-repo#demo    --context-dir=front-end -e PORT=8080
oc expose svc front-end


