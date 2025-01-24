node {
    environment {
        EC2_PUBLIC_IP = '54.254.140.201'  // Ganti dengan IP publik EC2 Anda
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

        stage('Deploy to EC2') {
            try {
                sh './jenkins/scripts/deliver.sh'
                input message: 'Sudah selesai menggunakan React App? (Klik "Proceed" untuk mengakhiri)'

                withCredentials([sshUserPrivateKey(credentialsId: 'submission-akhir-keypair', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                    echo "Deploying to EC2..."
                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY ubuntu@$EC2_PUBLIC_IP "docker pull ekaramadhan35/react-app && docker stop react-app || true && docker rm react-app || true && docker run -d -p 80:80 --name react-app ekaramadhan35/react-app"
                    '''
                }

                sh './jenkins/scripts/kill.sh'
            } catch (e) {
                error "Gagal pada stage Deploy: ${e.getMessage()}"
            }
        }
    }
}
