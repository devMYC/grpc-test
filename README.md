# Usage


### Make sure these tools are available

  * [Docker](https://docs.docker.com/install/)
  * [Docker Compose](https://docs.docker.com/compose/install/)
  * [Go](https://golang.org)
  * [Node.js](https://nodejs.org/en/)
  * [protobuf](https://developers.google.com/protocol-buffers/)


### Install protoc plugins

```bash
$ go get -u github.com/gogo/protobuf/protoc-gen-gogofaster
```

```bash
$ git clone https://github.com/grpc/grpc-web.git
$ cd grpc-web
$ sudo make install-plugin
```


### Clone this repo and install dependencies

```bash
$ git clone https://github.com/devMYC/grpc-test.git
$ cd grpc-test
$ deps ensure  # or install go imports manually
$ yarn  # or `npm install`
```


### Compile .proto file

```bash
$ protoc \
-I interfaces/ \
-I $GOPATH/src \
-I $GOPATH/src/github.com/gogo/protobuf/protobuf \
--gogofaster_out=plugins=grpc:interfaces \
--js_out=import_style=commonjs:interfaces \
--grpc-web_out=import_style=commonjs,mode=grpcweb:interfaces \
interfaces/healthcheck.proto

$ cd interfaces && go install && cd ..
```


### Run the server

```bash
$ go run server.go  # listening on port 3000 by default
```

Or you can specify the port by

```bash
$ PORT=5000 go run server.go
```

<hr />

At this point, you can test it with the node.js client from a new terminal window to see if it's working. Make sure the connection url in the `client-node.js` file is the ip:port your server is listening on.

Hope it works so we can move on...


### Run the envoy proxy

Replace the `$gRPC_SERVICE_IP` in `envoy.yaml` with your server ip, also set the `port_value` on the next line to your server port if needed. Then run the following command:

```bash
$ docker-compose up -d
```


### Send gRPC request from browser

```bash
$ export ENVOY_CONTAINER_IP=x.x.x.x  # default to localhost
$ yarn wds  # start the webpack-dev-server
```

Head over to `http://localhost:8080/` and *PING* the server.
