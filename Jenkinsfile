pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('19bac3c7245671221af2316f4c21c9826aa7592a')
        DOCKER_IMAGE = "my-simple-app:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/<YOUR_USERNAME>/my-simple-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests with Jest...'
                sh 'npm test'
            }
        }

        stage('SonarQube Scan') {
            steps {
                echo 'Running SonarQube scan...'
                sh """
                    sonar-scanner \
                    -Dsonar.projectKey=my-simple-app \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://sonarqube:9000 \
                    -Dsonar.login=${SONAR_TOKEN}
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Optional: Run Docker Container') {
            steps {
                echo 'Running Docker container for testing...'
                sh 'docker run -d -p 3000:3000 $DOCKER_IMAGE'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            bat 'docker ps -a'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
