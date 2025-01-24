node {
    environment {
        EC2_PUBLIC_IP = '54.254.140.201'  // IP publik EC2 Anda
        DOCKER_IMAGE = 'ekaramadhan35/react-app'  // Nama image Docker
        SSH_CREDENTIALS_ID = 'submission-akhir-keypair'  // ID kredensial SSH
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'  // ID kredensial Docker Hub
    }

    // Menggunakan Docker Node.js dengan akses Docker Host
    docker.image('node:16-buster-slim').inside('-v /var/run/docker.sock:/var/run/docker.sock --user root') {
        stage('Setup Environment') {
            sh '''
            apt-get update
            apt-get install -y openssh-client
            '''
        }

        stage('Checkout Code') {
            checkout scm
        }

        stage('Install Dependencies') {
            sh 'npm install'
        }

        stage('Build React App') {
            sh 'npm run build'
        }

        stage('Test') {
            // Jalankan script test
            sh '''
            if [ -f ./jenkins/scripts/test.sh ]; then
                ./jenkins/scripts/test.sh
            else
                echo "No tests found, skipping..."
            fi
            '''
        }

        stage('Build Docker Image') {
            sh '''
            echo "Building Docker image..."
            docker build -t $DOCKER_IMAGE .
            '''
        }

        stage('Push Docker Image to Docker Hub') {
            withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh '''
                echo "Logging in to Docker Hub..."
                echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

                echo "Pushing Docker image to Docker Hub..."
                docker push $DOCKER_IMAGE
                '''
            }
        }

        stage('Deploy to EC2') {
            try {
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                    echo "Deploying to EC2..."
                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY ubuntu@$EC2_PUBLIC_IP "
                        docker pull $DOCKER_IMAGE &&
                        docker stop react-app || true &&
                        docker rm react-app || true &&
                        docker run -d -p 80:80 --name react-app $DOCKER_IMAGE
                    "
                    '''
                }
            } catch (e) {
                error "Gagal pada stage Deploy: ${e.getMessage()}"
            }
        }

        stage('Post-Deployment Confirmation') {
            input message: 'Deployment selesai. Apakah Anda ingin melanjutkan atau menghentikan pipeline?'
        }
    }
}
