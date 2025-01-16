node {
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
        
        stage('Deploy') {
            try {
                sh './jenkins/scripts/deliver.sh' // Menjalankan script untuk deployment
                input message: 'Sudah selesai menggunakan React App? (Klik "Proceed" untuk mengakhiri)' 
                sh './jenkins/scripts/kill.sh' // Menjalankan script untuk menghentikan proses
            } catch (e) {
                error "Gagal pada stage Deploy: ${e.getMessage()}"
            }
        }
    }
}
