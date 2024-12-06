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
            dir('./result') {
                steps {
                    sh '''
                        npm install
                    '''
                }
                stage("run test") {
                    steps {
                        sh '''
                            npm run test
                        '''
                    }
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
