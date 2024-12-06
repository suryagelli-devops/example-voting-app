pipeline {
    agent any
    stages {
        stage("code-checkout") {
            steps {
                git branch: 'main',
                    url: 'https://github.com/suryagelli-devops/example-voting-app.git'
            }
        }
        stage("install packages") {
            steps {
                dir('./result') {
                    sh '''
                        npm install
                        npm run test
                    '''
                }
            }
        }
        stage("code-quality-check") {
            environment {
                scannerhome = tool 'sonarscanner'
            }
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                    ${scannerhome}/bin/sonar-scanner \
                    -D sonar.projectKey=votingapp \
                    -D sonar.sources=./result \
                    '''
                }
            }
        }
    }
}
