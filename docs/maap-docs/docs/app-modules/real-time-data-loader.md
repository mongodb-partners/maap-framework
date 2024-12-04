
# Table of Contents
- [Pre-requisites](#pre-requisites)
- [Kafka Setup](#kafka-setup)
  - [Linux Step by Step](#for-linux)
  - [Windows Step by Step](#for-windows)
- [Data Loader Usage](#data-loader)
- [Test Example](#test)

# Real Time Data Loader

In this document you'll find a guide to configure a kafka environment with the respective
mongo db connectors and all you need to run a real time data loader in your local environment.

## Pre-requisites

- Docker installed.
- Atlas Cluster running with the proper databases and collections.
- A user with readWrite and changeStream roles.

## Kafka Setup

To setup the kafka environment in your local if you don't have one already, you can clone the
kafka mongo connector repository https://github.com/mongodb/mongo-kafka/tree/master.
In this repository you'll find a docker compose https://github.com/mongodb/mongo-kafka/blob/master/docker/docker-compose.yml
and a script https://github.com/mongodb/mongo-kafka/blob/master/docker/run.sh that you can run in linux.
If you're using windows you can run the script using a git bash shell and then manually some of the scripts with slights modifications that we'll see later in this
guide.

NOTE: At the docker-compose in the first line of the document we have a version number: version: '3.6'.
For some versions of docker this syntax might be deprecated so you can just remove this line and run it if an error shows
up when trying to run the compose command.

NOTE: This script and docker-compose create a mongodb environment to run a built-in example and creates some connectors that you can ignore.

### Step by step guide

#### For Linux

1. Run the ***run.sh*** script (for windows you can execute it using a git bash which will eventually crash).

- Here is an explanation/crack down of the script in case you want to modify it.

Checks if the mongo port is available, if yes, continue.

```shell
#!/bin/bash
set -e
(
 if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null ; then
     echo "Please terminate the local mongod on 27017"
     exit 1
 fi
)
```
    
Builds the kafka connector (this is why you need to run this compose inside this repository.)

```shell   
echo "Building the MongoDB Kafka Connector"
(
cd ..
./gradlew clean createConfluentArchive
echo -e "Unzipping the confluent archive plugin....\n"
unzip -d ./build/confluent ./build/confluent/*.zip
find ./build/confluent -maxdepth 1 -type d ! -wholename "./build/confluent" -exec mv {} ./build/confluent/kafka-connect-mongodb \;
)
```

Starts docker-compose inside this folder.

```shell   
         echo "Starting docker ."
         docker-compose up -d --build
```

Clean up function: cleans the connectors and database inside docker.

```shell
 function clean_up {
     echo -e "\n\nSHUTTING DOWN\n\n"
     curl --output /dev/null -X DELETE http://localhost:8083/connectors/datagen-pageviews || true
     curl --output /dev/null -X DELETE http://localhost:8083/connectors/mongo-sink || true
     curl --output /dev/null -X DELETE http://localhost:8083/connectors/mongo-source || true
     docker-compose exec mongo1 /usr/bin/mongo --eval "db.dropDatabase()"
     docker-compose down
     if [ -z "$1" ]
     then
         echo -e "Bye!\n"
     else
         echo -e $1
     fi
 }
```
 Waits for the dockers to connect:

```shell        
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
``` 

Execute clean up function

```shell 
trap clean_up EXIT
```

Configures mongodb for the demo of the repository.

```shell
echo -e "\nConfiguring the MongoDB ReplicaSet.\n"
docker-compose exec mongo1 /usr/bin/mongo --eval '''if (rs.status()["ok"] == 0) {
 rsconf = {
     _id : "rs0",
     members: [
         { _id : 0, host : "mongo1:27017", priority: 1.0 },
         { _id : 1, host : "mongo2:27017", priority: 0.5 },
         { _id : 2, host : "mongo3:27017", priority: 0.5 }
     ]
 };
 rs.initiate(rsconf);
}

rs.conf();'''
```
        
The rest of the script runs the commands to insert the kafka connectors for the demo.

```shell
echo -e "\nKafka Topics:"
curl -X GET "http://localhost:8082/topics" -w "\n"

echo -e "\nKafka Connectors:"
curl -X GET "http://localhost:8083/connectors/" -w "\n"

echo -e "\nAdding datagen pageviews:"
curl -X POST -H "Content-Type: application/json" --data '
{ "name": "datagen-pageviews",
    "config": {
    "connector.class": "io.confluent.kafka.connect.datagen.DatagenConnector",
    "kafka.topic": "pageviews",
    "quickstart": "pageviews",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    "producer.interceptor.classes": "io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor",
    "max.interval": 200,
    "iterations": 10000000,
    "tasks.max": "1"
}}' http://localhost:8083/connectors -w "\n"

sleep 5

echo -e "\nAdding MongoDB Kafka Sink Connector for the 'pageviews' topic into the 'test.pageviews' collection:"
curl -X POST -H "Content-Type: application/json" --data '
{"name": "mongo-sink",
    "config": {
    "connector.class":"com.mongodb.kafka.connect.MongoSinkConnector",
    "tasks.max":"1",
    "topics":"pageviews",
    "connection.uri":"mongodb://mongo1:27017,mongo2:27017,mongo3:27017",
    "database":"test",
    "collection":"pageviews",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false"
}}' http://localhost:8083/connectors -w "\n"

sleep 2
echo -e "\nAdding MongoDB Kafka Source Connector for the 'test.pageviews' collection:"
curl -X POST -H "Content-Type: application/json" --data '
{"name": "mongo-source",
    "config": {
    "tasks.max":"1",
    "connector.class":"com.mongodb.kafka.connect.MongoSourceConnector",
    "connection.uri":"mongodb://mongo1:27017,mongo2:27017,mongo3:27017",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "topic.prefix":"mongo",
    "database":"test",
    "collection":"pageviews"
}}' http://localhost:8083/connectors -w "\n"

sleep 2
echo -e "\nKafka Connectors: \n"
curl -X GET "http://localhost:8083/connectors/" -w "\n"

echo "Looking at data in 'db.pageviews':"
docker-compose exec mongo1 /usr/bin/mongo --eval 'db.pageviews.find()'


echo -e '''

==============================================================================================================
Examine the topics in the Kafka UI: http://localhost:9021 or http://localhost:8000/
- The `pageviews` topic should have the generated page views.
  - The `mongo.test.pageviews` topic should contain the change events.
  - The `test.pageviews` collection in MongoDB should contain the sinked page views.

Examine the collections:
- In your shell run: docker-compose exec mongo1 /usr/bin/mongo
  ==============================================================================================================

Use <ctrl>-c to quit'''

read -r -d '' _ </dev/tty
```

2. Configure your own connectors (you may replace the commands at the script to avoid having the connectors of the repo's demo)

Note: The topics for those connector must be different. Example: userAvailable for sink connector
and intermediateTopic for source connector. The topic used at the source connector is the one that the
RTDL is going to use to listen to messages.

Sink Connector. Configure <your_atlas_uri>, <your_database>, <your_collection>, <your_topic> and
the kafka.bootstrap.servers if you're using a different kafka deployment.

```shell
curl -X POST -H "Content-Type: application/json" --data '
{
   "name": "mongodb-sink-connector",
   "config": {
   "connector.class": "com.mongodb.kafka.connect.MongoSinkConnector",
   "connection.uri": "<your_atlas_uri>",
   "database": "<your_database>",
   "collection": "<your_collection>",
   "topics": "<your_topic>",
   "key.converter": "org.apache.kafka.connect.storage.StringConverter",
   "value.converter.schemas.enable": false,
   "value.converter": "org.apache.kafka.connect.json.JsonConverter",
   "mongo.errors.tolerance": "data",
   "errors.tolerance": "all",
   "errors.deadletterqueue.topic.name": "mongoerror",
   "errors.deadletterqueue.topic.replication.factor": 1,
   "kafka.bootstrap.servers": "localhost:9092"
}}' http://localhost:8083/connectors -w "\n"
```

Source Connector. Configure <your_atlas_uri>, <your_database>, the topic.namespace.map following the pattern and
displayed in the example and the kafka.bootstrap.servers if you're using a different kafka deployment.

```shell
curl -X POST -H "Content-Type: application/json" --data '
{
    "name": "mongodb-maap-data-connector",
    "config": {
    "connector.class": "com.mongodb.kafka.connect.MongoSourceConnector",
    "connection.uri": "<your_atlas_uri>",
    "database": "<your_database>",
    "topic.namespace.map": "{\"<your_database>.<your_collection1>\": \"<your_topic1>\", \"<your_database>.<your_collection2>\": \"<your_topic2>\", \"<your_database>.<your_collectionN>\": \"<your_topicN>\"}",
    "copy.existing": true,
    "poll.max.batch.size": 100,
    "poll.await.time.ms": 5000,
    "kafka.bootstrap.servers": "localhost:9092",
    "tasks.max": "1",
    "heartbeat.interval.ms": 3000,
    "errors.tolerance": "all",
    "errors.log.enable": true,
    "errors.log.include.messages": true,
    "auto.offset.reset": "latest",
    "enable.auto.commit": true,
    "acks": "all",
    "pipeline": "[{\"$match\": {\"operationType\": {\"$in\": [\"insert\", \"update\", \"replace\"]}}}]"
}}' http://localhost:8083/connectors -w "\n"
```

#### For Windows

1. Run the ***run.sh*** using a git bash console. This command will crash once it reaches an --eval flag in the script.
The --eval flag tries to run commands inside docker without activating the console.

```shell
echo -e "\nConfiguring the MongoDB ReplicaSet.\n"
docker-compose exec mongo1 /usr/bin/mongo --eval '''if (rs.status()["ok"] == 0) {
 rsconf = {
     _id : "rs0",
     members: [
         { _id : 0, host : "mongo1:27017", priority: 1.0 },
         { _id : 1, host : "mongo2:27017", priority: 0.5 },
         { _id : 2, host : "mongo3:27017", priority: 0.5 }
     ]
 };
 rs.initiate(rsconf);
}

rs.conf();'''
```

OPTIONAL: You can run this command manually (NOTE: it's not required since we're not running this for the demo but not doing it might
fill the console with noise because of errors)

Run this command to enter the console inside the mongo1 docker container.

```shell
docker-compose exec mongo1 bash
```

Inside the container shell run:

```shell
/usr/bin/mongo '''if (rs.status()["ok"] == 0) {
 rsconf = {
     _id : "rs0",
     members: [
         { _id : 0, host : "mongo1:27017", priority: 1.0 },
         { _id : 1, host : "mongo2:27017", priority: 0.5 },
         { _id : 2, host : "mongo3:27017", priority: 0.5 }
     ]
 };
 rs.initiate(rsconf);
}

rs.conf();'''
```

2. Configure your own connectors

Create 1 json file for each connector anywhere in your computer:

Configure <your_atlas_uri>, <your_database>, <your_collection>, <your_topic> and the kafka.bootstrap.servers if you're using a different kafka deployment.

Note: The topics for those connector must be different. Example: userAvailable for sink connector
and intermediateTopic for source connector. The topic used at the source connector is the one that the
RTDL is going to use to listen to messages.

Sink Connector
```json
{
	"name": "mongodb-sink-connector",
	"config": {
		"connector.class": "com.mongodb.kafka.connect.MongoSinkConnector",
		"connection.uri": "<your_atlas_uri>",
		"database": "<your_database>",
		"collection": "<your_collection>",
		"topics": "<your_topics>",
		"key.converter": "org.apache.kafka.connect.storage.StringConverter",
		"value.converter.schemas.enable": false,
		"value.converter": "org.apache.kafka.connect.json.JsonConverter",
		"mongo.errors.tolerance": "data",
		"errors.tolerance": "all",
		"errors.deadletterqueue.topic.name": "mongoerror",
		"errors.deadletterqueue.topic.replication.factor": 1,
		"kafka.bootstrap.servers": "localhost:9092"
	}
}
```

Source Connector
```json
{
	"name": "mongodb-maap-data-connector",
	"config": {
		"connector.class": "com.mongodb.kafka.connect.MongoSourceConnector",
		"connection.uri": "<your_atlas_uri>",
		"database": "<your_database>",
		"topic.namespace.map": "{\"<your_database>.<your_collection1>\": \"<your_topic1>\", \"<your_database>.<your_collection2>\": \"<your_topic2>\", \"<your_database>.<your_collectionN>\": \"<your_topicN>\"}",
		"copy.existing": true,
		"poll.max.batch.size": 100,
		"poll.await.time.ms": 5000,
		"kafka.bootstrap.servers": "localhost:9092",
		"tasks.max": "1",
		"heartbeat.interval.ms": 3000,
		"errors.tolerance": "all",
		"errors.log.enable": true,
		"errors.log.include.messages": true,
		"auto.offset.reset": "latest",
		"enable.auto.commit": true,
		"acks": "all",
		"pipeline": "[{\"$match\": {\"operationType\": {\"$in\": [\"insert\", \"update\", \"replace\"]}}}]"
	}
}
```

Run the following command in powershell:

```shell
Invoke-WebRequest -Uri "http://localhost:8083/connectors" -Method Post -Headers @{ "Content-Type" = "application/json" } -InFile "path\to\your\config_files.json"
```

Note: the -Uri is pointing to your connectors endpoint, change it inf necessary.

## Data Loader
This data loader is used to receive messages in real time from a Kafka topic. The ingest runs indefinitely until the process
is stopped manually. Everytime a message is received, it looks for the content that is meant to be
processed makes an entry into the configured database.

**Usage:**
```js
ingest:
    - source: 'realtime'
      topic: 'source-connector-topic'
      brokers: ['localhost:9092']
      thumblingWindow: 6000
      chunk_size: 300
      chunk_overlap: 20
```

**Architecture:**
![kafkaArchitectureRTDL.png](img%2FkafkaArchitectureRTDL.png)

**Expected format for Sink topic messages**

The only required field is the content field, the rest of fields are going to be set as metadata for the metadata field in the main db.

```json
{"content": "Plain text goes here. It could be loooong…", "metadata1":"value1", "metadata2":"value2", "metadataN":"valueN"}
```

Example:

```json
{"database_collection": "StreamData", "content": "Plain text goes here. It could be loooong…", "title": "Test Text", "created": "2021-11-17T03:19:56.186Z"}
```

## Test

Download kafka in your computer local computer: https://kafka.apache.org/downloads

Unzip the folder content and go to the bin folder in a console.
For Linux run the .sh command, for Windows go one level deeper to the folder called windows and run the equivalent .bat

Run
```shell
./kafka-console-producer.sh --broker-list localhost:9092 --topic <your_sink_connector_topic>
```
Send a message with the appropriate json format (described before).

**Expected behaviour** (as described in the architecture)

- The sink connector uploads the file inserted into the atlas database. (This works for any insertion with the proper format into this topic, not only from console)
- The source connector detects that a file has been inserted into the collection. (This works with direct insertions too).
- MAAP receives the message in the source topic and extracts the content.
- MAAP creates the embeddings and writes to the final database.