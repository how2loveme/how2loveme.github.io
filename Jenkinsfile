pipeline {
  agent any
  stages {
    stage('git scm') {
      steps {
        echo 'start :: git scm'
        git(changelog: true, url: 'https://github.com/how2loveme/how2loveme.github.io.git', branch: 'main', poll: true, credentialsId: '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')
      }
    }

  }
}