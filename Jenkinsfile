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
        K8S_NS = 'default'
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
}
