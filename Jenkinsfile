pipeline {
    agent any

    environment {
        S3_BUCKET = 'your-s3-bucket'
        AWS_REGION = 'your-region' // e.g., us-east-1
        VERSION = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/your-repo/angular-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'ng test --watch=false --code-coverage'
            }
        }

        stage('Build Angular App') {
            steps {
                sh 'ng build --configuration=production'
            }
        }

        stage('Create Artifact') {
            steps {
                sh '''
                tar -czf angular_app-$VERSION.tar.gz -C dist/angular_app .
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-jenkins-credentials', region: "${AWS_REGION}") {
                    s3Upload(file: "angular_app-$VERSION.tar.gz", bucket: "${S3_BUCKET}", path: "artifacts/")
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh '''
                ansible-playbook -i inventory deploy.yml --extra-vars "artifact_version=$VERSION"
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}

