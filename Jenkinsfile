node {
    // Environment variables
    def IMAGE_NAME = "react-app"
    def AWS_EC2_IP = "54.254.140.201"
    def SSH_CREDENTIALS_ID = "submission-akhir-keypair"

    try {
        stage('Checkout Code') {
            echo "Checking out code from SCM..."
            checkout scm
        }

        stage('Build Docker Image') {
            echo "Building Docker image..."
            sh "docker build -t ${IMAGE_NAME}:latest ."
        }

        stage('Push Docker Image to EC2') {
            echo "Pushing Docker image to EC2..."
            withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                sh """
                    ssh-keyscan -H ${AWS_EC2_IP} >> ~/.ssh/known_hosts
                    docker save ${IMAGE_NAME}:latest | ssh -i ${SSH_KEY} ubuntu@${AWS_EC2_IP} 'docker load'
                """
            }
        }

        stage('Deploy Application') {
            echo "Deploying application on EC2..."
            withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                sh """
                    ssh -i ${SSH_KEY} ubuntu@${AWS_EC2_IP} '
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
