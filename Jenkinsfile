properties([
    pipelineTriggers([
        pollSCM('H/2 * * * *') // Memeriksa perubahan di repository setiap 2 menit
    ])
])

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
    }
}
