properties([
    pipelineTriggers([
        pollSCM('H/2 * * * *') // Memeriksa repository setiap 2 menit
    ])
])

node {
    docker.image('node:16-buster-slim').inside('-p 3000:3000') {
        stage('Build') {
            sh 'npm install'
        }
    }
}
