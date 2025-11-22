pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id') // ID Docker Hub dans Jenkins
        GITHUB_REPO = "git@github.com:yahyaguizani/manifest.git"
        DOCKER_NAMESPACE = "yahyaguizani/k8s"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "${GITHUB_REPO}"
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🔧 Building backend image..."
                    sh "docker build -t ${DOCKER_NAMESPACE}/heart-backend ./images/heart-predictor/backend"
                    sh "docker build -t ${DOCKER_NAMESPACE}/heart-frontend ./images/heart-predictor/frontend"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "sed -i 's|image: heart-backend|image: ${DOCKER_NAMESPACE}/heart-backend|g' ./fichierManifest/heart-backend.yaml"
                    sh "sed -i 's|image: heart-frontend|image: ${DOCKER_NAMESPACE}/heart-frontend|g' ./fichierManifest/heart-frontend.yaml"
                    sh "kubectl apply -f ./fichierManifest/"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline terminé avec succès."
        }
        failure {
            echo "❌ Pipeline échoué."
        }
    }
}

