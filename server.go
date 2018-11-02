package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"regexp"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	pb "github.com/devMYC/grpc-test/interfaces"
)

type server struct{}

const defaultPort = ":3000"

func (s *server) PingPong(ctx context.Context, in *pb.PingPongReq) (*pb.PingPongRes, error) {
	fmt.Printf("Received: %+v\n", *in)
	return &pb.PingPongRes{Msg: "PONG"}, nil
}

func main() {
	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = defaultPort
		fmt.Printf("Using default PORT `%s`\n", port)
	} else {
		ok, err := regexp.Match("^\\d+?$", []byte(port))
		if err != nil {
			fmt.Printf("RegExp failure: %s\n", err.Error())
			port = defaultPort
			fmt.Printf("Fallback to default PORT `%s`\n", port)
		} else if !ok {
			fmt.Printf("Malformed PORT, expecting numerical characters.\n")
			return
		} else {
			port = ":" + port
			fmt.Printf("Using PORT `%s`\n", port)
		}
	}

	listener, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterHealthCheckServer(s, &server{})
	reflection.Register(s)
	if err = s.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
