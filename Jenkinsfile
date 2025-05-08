pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Verificar estrutura') {
            steps {
                echo 'Listando diretórios do projeto...'
                sh 'ls -R'
            }
        }

        stage('Criar docker-compose.yml') {
            steps {
                dir('beck-end') {
                    writeFile file: 'docker-compose.yml', text: '''
version: '3.8'

services:
  musculum-backend: 
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
'''
                }
            }
        }

        stage('Criar Dockerfile') {
            steps {
                dir('beck-end') {
                    writeFile file: 'Dockerfile', text: '''
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
'''
                }
            }
        }

        stage('Build e Subida do Container') {
            steps {
                dir('beck-end') {
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Verificar containers ativos') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Pipeline concluída com sucesso!'
        }
        failure {
            echo 'Pipeline falhou. Verifique os logs.'
        }
    }
}
