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

        stage('Setup SSH and Known Hosts') {
            echo "Setting up SSH and known hosts..."
            sh """
                mkdir -p ~/.ssh
                chmod 700 ~/.ssh
                ssh-keyscan -H ${AWS_EC2_IP} >> ~/.ssh/known_hosts
                chmod 644 ~/.ssh/known_hosts
            """
        }

        stage('Push Docker Image to EC2') {
            echo "Pushing Docker image to EC2..."
            withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                sh """
                    docker save ${IMAGE_NAME}:latest | ssh -i ${SSH_KEY} ubuntu@${AWS_EC2_IP} 'docker load'
                """
            }
        }

        stage('Test') {
            echo "Running tests..."
            sh '''
            if [ -f ./jenkins/scripts/test.sh ]; then
                ./jenkins/scripts/test.sh
            else
                echo "No tests found, skipping..."
            fi
            '''
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

        stage('Post-Deployment Confirmation') {
            input message: 'Deployment selesai. Apakah Anda ingin melanjutkan atau menghentikan pipeline?'
        }

    } catch (Exception e) {
        echo "Pipeline failed: ${e.getMessage()}"
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        echo "Pipeline completed!"
    }
}
