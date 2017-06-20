#!/bin/bash
echo "Running updates for 2.0.4"
echo ""
echo ""
echo ""
echo "Push design doc to all group databases"
cd /tangerine-server/editor/app
curl http://$T_ADMIN:$T_PASS@$T_COUCH_HOST:$T_COUCH_PORT/_all_dbs | jq '.' | grep 'group-' | sed -e 's/\"//g' | sed -e 's/,//' | xargs -I {} couchapp push http://$T_ADMIN:$T_PASS@$T_COUCH_HOST:$T_COUCH_PORT/{}
echo " " 