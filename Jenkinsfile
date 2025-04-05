pipeline {
    agent any

    environment {
        S3_BUCKET = 'nottie-angular-app'
        AWS_REGION = 'us-east-1'
        VERSION = "v${env.BUILD_NUMBER}"
        ARTIFACT_NAME = "angular_app-${VERSION}.tar.gz"
        ARTIFACT_PATH = "packaged/${ARTIFACT_NAME}"
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
                sh 'ng build --configuration=production'
            }
        }

        stage('Create Artifact') {
            steps {
                sh '''
                    mkdir -p packaged
                    tar -czf ${ARTIFACT_PATH} -C dist/angular_app .
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-jenkins-credentials', region: "${AWS_REGION}") {
                    s3Upload(
                        file: "${ARTIFACT_PATH}",
                        bucket: "${S3_BUCKET}",
                        path: "artifacts/${ARTIFACT_NAME}"
                    )
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ansible-ssh-key', keyFileVariable: 'SSH_KEY'),
                    string(credentialsId: 'ansible-vault-password', variable: 'VAULT_PASSWORD'),
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        echo "📦 Deploying version: ${VERSION}"
                        echo "🔐 Using Vault + SSH Credentials"

                        chmod 600 $SSH_KEY
                        pwd
                        ls -lrt

                        ansible-playbook deploy.yml -i /home/ec2-user/angular_app/inventory \
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
