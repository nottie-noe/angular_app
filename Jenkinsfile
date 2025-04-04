pipeline {
    agent any

    environment {
        S3_BUCKET = 'nottie-angular-app'
        AWS_REGION = 'us-east-1' // e.g., us-east-1
        VERSION = "v${env.BUILD_NUMBER}"
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
                script {
                    def ARTIFACT_NAME = "angular_app-${VERSION}.tar.gz"  // Use VERSION here for consistency
                    sh "tar -czf ${ARTIFACT_NAME} -C dist/angular_app ."
                }
            }
        }

        stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-jenkins-credentials', region: "${AWS_REGION}") {
                    s3Upload(
                        file: "angular_app-${VERSION}.tar.gz",  // Use the same name as created earlier
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
                    )
                ]) {
                    sh '''
                        # Secure SSH key permissions
                        chmod 600 $SSH_KEY

                        # Run Ansible with vault password and SSH key
                        ansible-playbook -i inventory deploy.yml \
                            --extra-vars "artifact_version=$VERSION" \
                            --vault-password-file <(echo "$VAULT_PASSWORD") \
                            --private-key $SSH_KEY
                    '''
                }
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

