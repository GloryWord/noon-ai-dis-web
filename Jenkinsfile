pipeline {
  agent any
  stages {
    stage('Source') {
      steps {
        git(url: 'https://github.com/MHNCity/noon-ai-dis-web.git', branch: 'main', credentialsId: 'Git-credentials')
      }
    }

    stage('Build') {
      steps {
        tool 'gradle'
      }
    }

    stage('Deploy') {
      steps {
        sh 'echo "Deploy Success!!"'
      }
    }

  }
}
