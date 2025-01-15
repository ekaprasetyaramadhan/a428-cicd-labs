properties([
    pipelineTriggers([
        pollSCM('H/2 * * * *')
    ])
])

node {
    docker.image('node:16-buster-slim').inside('-p 3000:3000') {
        stage('Checkout Code') {
            checkout scm // Mengkloning repository
        }
        stage('Build') {
            sh 'npm install'
        }
    }
}
