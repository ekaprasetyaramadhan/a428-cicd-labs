node {
    environment {
        EC2_PUBLIC_IP = '54.254.140.201'  // Ganti dengan IP publik EC2 Anda
        DOCKER_IMAGE = 'ekaramadhan35/react-app'  // Ganti dengan nama image Anda
    }
    docker.image('node:16-buster-slim').inside('--user root -p 3000:3000') {
        stage('Setup Environment') {
            sh '''
            apt-get update
            apt-get install -y openssh-client
            '''
        }

        stage('Checkout Code') {
            checkout scm
        }

        stage('Build') {
            sh 'npm install'
        }

        stage('Test') {
            sh './jenkins/scripts/test.sh'
        }

        stage('Build Docker Image') {
            sh '''
            echo "Building Docker image..."
            docker build -t $DOCKER_IMAGE .
            '''
        }

        stage('Push Docker Image to Docker Hub') {
            withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
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
                sh './jenkins/scripts/deliver.sh'
                input message: 'Sudah selesai menggunakan React App? (Klik "Proceed" untuk mengakhiri)'

                withCredentials([sshUserPrivateKey(credentialsId: 'submission-akhir-keypair', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                    echo "Deploying to EC2..."
                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY ubuntu@$EC2_PUBLIC_IP "docker pull $DOCKER_IMAGE && docker stop react-app || true && docker rm react-app || true && docker run -d -p 80:80 --name react-app $DOCKER_IMAGE"
                    '''
                }

                sh './jenkins/scripts/kill.sh'
            } catch (e) {
                error "Gagal pada stage Deploy: ${e.getMessage()}"
            }
        }
    }
}
