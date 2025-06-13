pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO      = 'mhncity/dis-local-web'
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials'
        BUILD_NUMBER         = "${env.BUILD_NUMBER}"
        IMAGE_TAG            = "build-${BUILD_NUMBER}"
        K8S_NS               = 'default'
    }

    stages {
        stage('Source') {
            steps {
                echo 'Checking out source code...'
                git url: 'https://github.com/GloryWord/noon-ai-dis-web.git',
                    branch: 'main',
                    credentialsId: 'github-credentials'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                script {
                    docker.build("${DOCKER_HUB_REPO}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing image to Docker Hub..."
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        docker.image("${DOCKER_HUB_REPO}:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_HUB_REPO}:${IMAGE_TAG}").push('latest')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                  kubectl argo rollouts set image web-rollout \
                         web-rollout=${DOCKER_HUB_REPO}:${IMAGE_TAG} \
                         -n ${K8S_NS}
                  kubectl argo rollouts get rollout web-rollout -n ${K8S_NS}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                  kubectl get pods -n ${K8S_NS} -l app=web-rollout
                  kubectl argo rollouts status web-rollout -n ${K8S_NS}
                """
            }
        }
    }   // ← 여기서 stages 블록을 확실히 닫아준다

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f'
        }
        success {
            echo "🎉 Deployment successful! Image: ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}