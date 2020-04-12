rm -rf ./client/build
rm -rf ./websocket_server/build
cd ./client
npm run build
cp -r ./build/ ../websocket_server/build
