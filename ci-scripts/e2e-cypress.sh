#!/usr/bin/env bash
set -e
set -o pipefail

SUITE="regression"
INTEGRATION=""

while getopts s:i: o 
do 
 case "${o}" 
 in 
 s) SUITE=${OPTARG};; 
 i) INTEGRATION=":${OPTARG}";; 
 esac 
done 

yarn
(cd projects/storefrontapp-e2e-cypress && yarn)

echo '-----'
echo 'Building Spartacus libraries'
yarn build:core:lib${INTEGRATION} && yarn build${INTEGRATION} 2>&1 | tee build.log


results=$(grep "Warning: Can't resolve all parameters for" build.log || true)
if [[ -z "$results" ]]; then
    echo "Success: Spartacus production build was successful."
    rm build.log
else
    echo "ERROR: Spartacus production build failed. Check the import statements. 'Warning: Can't resolve all parameters for ...' found in the build log."
    rm build.log
    exit 1
fi

echo '-----'
echo "Running Cypress end to end tests $SUITE"
if [[ $SUITE == 'regression' ]]; then
    yarn e2e:cy${INTEGRATION}:start-run-ci
else
    yarn e2e:cy${INTEGRATION}:start-run-smoke-ci
fi
