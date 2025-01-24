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

        stage('Setup Node.js and Install Dependencies') {
            echo "Setting up Node.js and installing dependencies..."
            docker.image('node:16-buster-slim').inside('-v /var/run/docker.sock:/var/run/docker.sock --user root') {
                sh '''
                    npm install
                '''
            }
        }

        stage('Build Docker Image') {
            echo "Building Docker image..."
            sh "docker build -t ${IMAGE_NAME}:latest ."
        }

        stage('Test') {
            echo "Running tests..."
            docker.image('node:16-buster-slim').inside('-v /var/run/docker.sock:/var/run/docker.sock --user root') {
                sh '''
                    if [ -f ./jenkins/scripts/test.sh ]; then
                        ./jenkins/scripts/test.sh
                    else
                        echo "No tests found, skipping..."
                    fi
                '''
            }
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
            
            echo "Running deployment scripts..."
            docker.image('node:16-buster-slim').inside('-v /var/run/docker.sock:/var/run/docker.sock --user root') {
                sh './jenkins/scripts/deliver.sh'
            }
            input message: 'Sudah selesai menggunakan React App? (Klik "Proceed" untuk mengakhiri)'
            sh './jenkins/scripts/kill.sh' // Menjalankan script untuk menghentikan proses
        }

    } catch (Exception e) {
        echo "Pipeline failed: ${e.getMessage()}"
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        echo "Pipeline completed!"
    }
}
