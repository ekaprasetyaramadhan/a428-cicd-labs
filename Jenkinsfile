node {
    environment {
        EC2_PUBLIC_IP = '54.254.140.201'  // Ganti dengan IP publik EC2 Anda
    }
    docker.image('node:16-buster-slim').inside('-p 3000:3000') {
        stage('Checkout Code') {
            checkout scm // Mengkloning repository
        }

        stage('Build') {
            sh 'npm install' // Menginstal dependensi
        }

        stage('Test') {
            sh './jenkins/scripts/test.sh' // Menjalankan script test.sh
        }

        stage('Deploy to EC2') {
            try {
                sh './jenkins/scripts/deliver.sh' // Menjalankan script untuk deployment
                input message: 'Sudah selesai menggunakan React App? (Klik "Proceed" untuk mengakhiri)'

                // Deployment ke EC2 menggunakan withCredentials
                withCredentials([sshUserPrivateKey(credentialsId: 'submission-akhir-keypair', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                    echo "Deploying to EC2..."
                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY ubuntu@$EC2_PUBLIC_IP "docker pull ekaramadhan35/react-app && docker stop react-app || true && docker rm react-app || true && docker run -d -p 80:80 --name react-app ekaramadhan35/react-app"
                    '''
                }
                
                sh './jenkins/scripts/kill.sh' // Menjalankan script untuk menghentikan proses
            } catch (e) {
                error "Gagal pada stage Deploy: ${e.getMessage()}"
            }
        }
    }
}
