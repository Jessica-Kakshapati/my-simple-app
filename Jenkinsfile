pipeline {
    agent any

    tools {
        nodejs 'NodeJS-16' // Jenkins NodeJS installation name
    }

    environment {
        SONAR_TOKEN = credentials('19bac3c7245671221af2316f4c21c9826aa') // Jenkins credential ID
        DOCKER_IMAGE = "my-simple-app:latest"
        CONTAINER_NAME = "my-simple-app-test"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out repository...'
                git branch: 'main', url: 'https://github.com/Jessica-Kakshapati/my-simple-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                // Caching node_modules to speed up builds (optional)
                script {
                    if (!fileExists('node_modules')) {
                        bat 'npm install'
                    } else {
                        echo 'Using cached node_modules'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests with Jest...'
                bat 'npm test'
            }
        }

        stage('SonarQube Scan') {
            steps {
                echo 'Running SonarQube scan...'
                bat """
                    sonar-scanner ^
                    -Dsonar.projectKey=my-simple-app ^
                    -Dsonar.sources=. ^
                    -Dsonar.host.url=http://sonarqube:9000 ^
                    -Dsonar.login=${SONAR_TOKEN}
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat "docker build -t %DOCKER_IMAGE% ."
            }
        }

        stage('Run Docker Container (Optional)') {
            steps {
                echo 'Running Docker container for testing...'
                bat """
                    docker run -d --name %CONTAINER_NAME% -p 3000:3000 %DOCKER_IMAGE%
                    timeout /t 10
                    docker logs %CONTAINER_NAME%
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace and Docker containers...'
            bat """
                docker ps -a
                docker stop %CONTAINER_NAME% || echo 'Container not running'
                docker rm %CONTAINER_NAME% || echo 'Container not found'
            """
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
