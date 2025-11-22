pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id') // ID des credentials Docker Hub dans Jenkins
        GITHUB_REPO = "https://github.com/yahyaguizani/manifest.git"
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
                    sh """
                        docker build -t ${DOCKER_NAMESPACE}/heart-backend ./images/heart-predictor/backend
                        docker build -t ${DOCKER_NAMESPACE}/heart-frontend ./images/heart-predictor/frontend
                    """
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIALS', 
                                 usernameVariable: 'DOCKERHUB_USERNAME', 
                                 passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
    				 sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_USERNAME --password-stdin"
    				 sh "docker push yahyaguizani/k8s/heart-backend"
    				 sh "docker push yahyaguizani/k8s/heart-frontend"
}

                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Met à jour les images dans les fichiers YAML avant apply
                    sh """
                        sed -i "s|image: heart-backend|image: ${DOCKER_NAMESPACE}/heart-backend|g" ./fichierManifest/heart-backend.yaml
                        sed -i "s|image: heart-frontend|image: ${DOCKER_NAMESPACE}/heart-frontend|g" ./fichierManifest/heart-frontend.yaml
                    """
                    // Applique les manifests
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

