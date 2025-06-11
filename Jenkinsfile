// pipeline {
//   agent any
//   stages {
//     stage('Source') {
//       steps {
//         git(url: 'https://github.com/MHNCity/noon-ai-dis-web.git', branch: 'main', credentialsId: 'Git-credentials')
//       }
//     }

//     stage('Build') {
//       steps {
//         tool 'gradle'
//       }
//     }

//     stage('Deploy') {
//       steps {
//         sh 'echo "Deploy Success!!"'
//       }
//     }

//   }
// }
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'mhncity/dis-local-web'
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials'
        KUBECONFIG_CREDENTIALS = 'kubeconfig-credentials'
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Source') {
            steps {
                echo 'Checking out source code...'
                git(
                    url: 'https://github.com/GloryWord/noon-ai-dis-web.git', 
                    branch: 'main',
                    credentialsId: 'github-credentials'
                )
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
                echo "Deploying to Kind cluster..."
                sh """
                    kubectl set image rollout/web-rollout web-rollout=${DOCKER_HUB_REPO}:${IMAGE_TAG} -n argo-rollouts
                    kubectl argo rollouts get rollout web-rollout -n argo-rollouts
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Verifying deployment..."
                sh """
                    kubectl get pods -n argo-rollouts -l app=web-rollout
                    kubectl argo rollouts status web-rollout -n argo-rollouts
                """
            }
        }
    }
    
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
