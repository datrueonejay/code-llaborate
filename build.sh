rm -rf ./client2/build
rm -rf ./websocket_server/build
cd ./client2 
npm run build
cp -r ./build/ ../websocket_server/build
