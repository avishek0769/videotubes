FROM ubuntu:latest

# Update package lists and install dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    tar \
    gzip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws/

WORKDIR /app

COPY transcode.sh /app/transcode.sh
RUN chmod +x /app/transcode.sh

# Entry point to execute the script
ENTRYPOINT ["/bin/bash", "/app/transcode.sh"]
