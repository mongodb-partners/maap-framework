#!/bin/bash

# Default values for parameters
MONGO_URI=""
DATABASE="maap-pi-cluster"
COLLECTION="StreamData"
KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
SINK_TOPIC="StreamData"
SOURCE_TOPIC="maapData"

function show_help {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --mongo-uri                 MongoDB connection URI (required)"
    echo "  --database                  MongoDB database name (default: maap-pi-cluster)"
    echo "  --collection                MongoDB collection name (default: StreamData)"
    echo "  --kafka-bootstrap-servers   Kafka bootstrap servers (default: localhost:9092)"
    echo "  --sink_topic                Kafka topic for sink connector (default: StreamData)"
    echo "  --source_topic              Kafka topic for source connector (default: maapData)"
    echo "  --help                      Show this help message and exit"
    echo ""
    echo "sink_topic and source_topic must be different."
    echo ""
    echo "Example:"
    echo "  $0 --mongo-uri 'mongodb+srv://user:password@cluster.mongodb.net/' \\"
    echo "     --database 'MyDatabase' \\"
    echo "     --collection 'MyCollection'"
    echo "     --kafka-bootstrap-servers 'localhost:9092' \\"
    echo "     --sink_topic 'MyTopic' \\"
    echo "     --source_topic 'MySecondTopic' \\"
    exit 0
}


# Parsing command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --mongo-uri) MONGO_URI="$2"; shift ;;
        --database) DATABASE="$2"; shift ;;
        --collection) COLLECTION="$2"; shift ;;
        --kafka-bootstrap-servers) KAFKA_BOOTSTRAP_SERVERS="$2"; shift ;;
        --sink_topic) SINK_TOPIC="$2"; shift ;;
        --source_topic) SOURCE_TOPIC="$2"; shift;;
        --help) show_help ;;
        *) echo "Unknown parameter: $1"; show_help ;;
    esac
    shift
done

echo "MongoDB URI: $MONGO_URI"
echo "Kafka Bootstrap Servers: $KAFKA_BOOTSTRAP_SERVERS"
echo "Sink Topic: $SINK_TOPIC"
echo "Source Topic: $SOURCE_TOPIC"
echo "Database: $DATABASE"
echo "Collection: $COLLECTION"

echo "Building the MongoDB Kafka Connector"
(
cd ..
./gradlew clean createConfluentArchive
echo -e "Unzipping the confluent archive plugin....\n"
unzip -d ./build/confluent ./build/confluent/*.zip
find ./build/confluent -maxdepth 1 -type d ! -wholename "./build/confluent" -exec mv {} ./build/confluent/kafka-connect-mongodb \;
)

echo "Starting docker ."
docker-compose up -d --build

function clean_up {
    echo -e "\n\nSHUTTING DOWN\n\n"
    curl --output /dev/null -X DELETE http://localhost:8083/connectors/mongodb-sink-connector || true
    curl --output /dev/null -X DELETE http://localhost:8083/connectors/mongodb-source-connector || true
    docker-compose down
    echo -e "Bye!\n"
}

sleep 5
echo -ne "\n\nWaiting for the systems to be ready.."
function test_systems_available {
  COUNTER=0
  until $(curl --output /dev/null --silent --head --fail http://localhost:$1); do
      printf '.'
      sleep 2
      let COUNTER+=1
      if [[ $COUNTER -gt 30 ]]; then
        MSG="\nWARNING: Could not reach configured kafka system on http://localhost:$1 \nNote: This script requires curl.\n"

          if [[ "$OSTYPE" == "darwin"* ]]; then
            MSG+="\nIf using OSX please try reconfiguring Docker and increasing RAM and CPU.\
                In Docker Desktop this can be done via the \"Resources\" tab in \"Preferences\". Then try again.\n\n"
          fi

        echo -e $MSG
        clean_up "$MSG"
        exit 1
      fi
  done
}

test_systems_available 8082
test_systems_available 8083

trap clean_up EXIT

echo -e "\nKafka Topics:"
curl -X GET "http://localhost:8082/topics" -w "\n"

echo -e "\nKafka Connectors:"
curl -X GET "http://localhost:8083/connectors/" -w "\n"

sleep 5

echo -e "\nAdding MongoDB Kafka Sink Connector for the $SINK_TOPIC topic into the $COLLECTION collection:"
curl -X POST -H "Content-Type: application/json" --data "
  {
  	\"name\": \"mongodb-sink-connector\",
  	  \"config\": {
  		\"connector.class\": \"com.mongodb.kafka.connect.MongoSinkConnector\",
  		\"connection.uri\": \"$MONGO_URI\",
  		\"database\": \"$DATABASE\",
  		\"collection\": \"$COLLECTION\",
  		\"topics\": \"$SINK_TOPIC\",
  		\"key.converter\": \"org.apache.kafka.connect.storage.StringConverter\",
      \"value.converter.schemas.enable\": false,
      \"value.converter\": \"org.apache.kafka.connect.json.JsonConverter\",
      \"mongo.errors.tolerance\": \"data\",
      \"errors.tolerance\": \"all\",
      \"errors.deadletterqueue.topic.name\": \"mongoerror\",
      \"errors.deadletterqueue.topic.replication.factor\": 1,
      \"kafka.bootstrap.servers\": \"$KAFKA_BOOTSTRAP_SERVERS\"
  	}
  }" http://localhost:8083/connectors -w "\n"

sleep 2
echo -e "\nAdding MongoDB Kafka Source Connector for the $COLLECTION collection to write in the $SOURCE_TOPIC topic:"
curl -X POST -H "Content-Type: application/json" --data '
  {
    "name": "mongodb-source-connector",
    "config": {
      "connector.class": "com.mongodb.kafka.connect.MongoSourceConnector",
      "connection.uri": "'$MONGO_URI'",
      "database": "'$DATABASE'",
      "collection": "'$COLLECTION'",
      "topic.namespace.map": "{\"'$DATABASE.$COLLECTION'\": \"'$SOURCE_TOPIC'\"}",
      "poll.max.batch.size": 100,
      "poll.await.time.ms": 5000,
      "kafka.bootstrap.servers": "'$KAFKA_BOOTSTRAP_SERVERS'",
      "tasks.max": "1",
      "heartbeat.interval.ms": 3000,
      "errors.tolerance": "all",
      "errors.log.enable": true,
      "errors.log.include.messages": true,
      "auto.offset.reset": "latest",
      "pipeline": "[{\"$match\": {\"operationType\": {\"$in\": [\"insert\", \"update\", \"replace\"]}}}]"
    }
  }' http://localhost:8083/connectors -w "\n"

sleep 2
echo -e "\nKafka Connectors: \n"
curl -X GET "http://localhost:8083/connectors/" -w "\n"


echo -e '''\n==============================================================================================================
Examine the topics in the Kafka UI: http://localhost:9021 or http://localhost:8000/
==============================================================================================================
Use <ctrl>-c to quit
'''


read -r -d '' _ </dev/tty
