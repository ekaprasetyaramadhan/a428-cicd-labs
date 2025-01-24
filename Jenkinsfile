node {
    // Environment variables
    def IMAGE_NAME = "react-app"
    def AWS_EC2_IP = "54.254.140.201"  // Ganti dengan IP EC2 Anda
    def SSH_CREDENTIALS_ID = "submission-akhir-keypair" // Ganti dengan ID Credential SSH di Jenkins
    
    try {
        stage('Checkout Code') {
             checkout scm
        }

        stage('Build Docker Image') {
            echo "Building Docker image..."
            sh "docker build -t ${IMAGE_NAME}:latest ."
        }

        stage('Push Docker Image to EC2') {
            echo "Pushing Docker image to EC2..."
            sshagent([SSH_CREDENTIALS_ID]) {
                sh """
                    docker save ${IMAGE_NAME}:latest | ssh ubuntu@${AWS_EC2_IP} 'docker load'
                """
            }
        }

        stage('Deploy Application') {
            echo "Deploying application on EC2..."
            sshagent([SSH_CREDENTIALS_ID]) {
                sh """
                    ssh ec2-user@${AWS_EC2_IP} '
                    docker stop ${IMAGE_NAME} || true && \
                    docker rm ${IMAGE_NAME} || true && \
                    docker run -d --name ${IMAGE_NAME} -p 80:80 ${IMAGE_NAME}:latest
                    '
                """
            }
        }
    } catch (Exception e) {
        echo "Pipeline failed: ${e.getMessage()}"
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        echo "Pipeline completed!"
    }
}
