#!/bin/bash

# Define a function to show help
show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --mongo-uri <uri>                MongoDB URI"
    echo "  --database <name>                MongoDB database name"
    echo "  --collection <name>              MongoDB collection name"
    echo "  --kafka-bootstrap-servers <list> Kafka bootstrap servers"
    echo "  --sink_topic <name>              Kafka sink topic"
    echo "  --source_topic <name>            Kafka source topic"
    echo "  --help                           Show this help message"
}

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --mongo-uri) MONGO_URI="$2"; shift ;;
        --database) DATABASE="$2"; shift ;;
        --collection) COLLECTION="$2"; shift ;;
        --kafka-bootstrap-servers) KAFKA_BOOTSTRAP_SERVERS="$2"; shift ;;
        --sink_topic) SINK_TOPIC="$2"; shift ;;
        --source_topic) SOURCE_TOPIC="$2"; shift ;;
        --help) show_help; exit 0 ;;
        *) echo "Unknown parameter: $1"; show_help; exit 1 ;;
    esac
    shift
done

# Ensure all required parameters are provided
if [[ -z "$MONGO_URI" || -z "$DATABASE" || -z "$COLLECTION" || -z "$KAFKA_BOOTSTRAP_SERVERS" || -z "$SINK_TOPIC" || -z "$SOURCE_TOPIC" ]]; then
    echo "Error: Missing required parameters."
    show_help
    exit 1
fi

# Clone the mongo-kafka repository
REPO_URL="https://github.com/mongodb/mongo-kafka.git"
CLONE_DIR="mongo-kafka"
if [[ -d "$CLONE_DIR" ]]; then
    echo "Repository already exists. Pulling latest changes..."
    git -C "$CLONE_DIR" pull
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$CLONE_DIR"
fi

# Replace scripts in the docker folder with your own
DOCKER_DIR="$CLONE_DIR/docker"
if [[ ! -d "$DOCKER_DIR" ]]; then
    echo "Error: Docker folder not found in the cloned repository."
    exit 1
fi

echo "Replacing docker scripts..."
cp ./docker-compose.yml "$DOCKER_DIR/docker-compose.yml"
cp ./run.sh "$DOCKER_DIR/run.sh"
chmod +x "$DOCKER_DIR/run.sh"

# Change directory to the repository's docker folder and call the run.sh script
echo "Running the script inside the repository..."
cd "$DOCKER_DIR" || { echo "Failed to change directory to $DOCKER_DIR"; exit 1; }
./run.sh --mongo-uri "$MONGO_URI" \
         --database "$DATABASE" \
         --collection "$COLLECTION" \
         --kafka-bootstrap-servers "$KAFKA_BOOTSTRAP_SERVERS" \
         --sink_topic "$SINK_TOPIC" \
         --source_topic "$SOURCE_TOPIC"
