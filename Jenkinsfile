// Node 18.20.6 is required for this pipeline
pipeline {
    agent any
    
    tools {
        nodejs 'Node-18.20.6'
    }
    
    environment {
        GITHUB_REPO = 'https://github.com/akosseres09/fake-insta.git'
        BRANCH = 'master'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: env.BRANCH, url: env.GITHUB_REPO
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
                
                dir('backend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm run test'
                }
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'frontend/dist/**/*, backend/dist/**/*', fingerprint: true
            }
        }
    }
}