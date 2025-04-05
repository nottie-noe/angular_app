pipeline {
    agent any

    environment {
        S3_BUCKET = 'nottie-angular-app'
        AWS_REGION = 'us-east-1'
        VERSION = "v${env.BUILD_NUMBER}"
        ARTIFACT_NAME = "angular_app-${env.BUILD_NUMBER}.tar.gz"
    }

    triggers {
        // Optional: Enable if using GitHub Webhook or polling
        githubPush()
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/nottie-noe/angular_app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Angular App') {
            steps {
                sh 'npm run build -- --configuration=production'
            }
        }

        stage('Create Artifact') {
            steps {
                sh '''
                    mkdir -p packaged
                    tar -czf packaged/${ARTIFACT_NAME} -C dist/angular_app .
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-jenkins-credentials', region: "${AWS_REGION}") {
                    s3Upload(
                        file: "packaged/${ARTIFACT_NAME}",
                        bucket: "${S3_BUCKET}",
                        path: "artifacts/"
                    )
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ansible-ssh-key',
                        keyFileVariable: 'SSH_KEY'
                    ),
                    string(
                        credentialsId: 'ansible-vault-password',
                        variable: 'VAULT_PASSWORD'
                    ),
                    string(
                        credentialsId: 'aws-access-key-id',
                        variable: 'AWS_ACCESS_KEY_ID'
                    ),
                    string(
                        credentialsId: 'aws-secret-access-key',
                        variable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        chmod 600 $SSH_KEY

                        ansible-playbook -i inventory deploy.yml \
                          --extra-vars "artifact_version=${VERSION} aws_access_key=${AWS_ACCESS_KEY_ID} aws_secret_key=${AWS_SECRET_ACCESS_KEY}" \
                          --vault-password-file <(echo "$VAULT_PASSWORD") \
                          --private-key $SSH_KEY
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
