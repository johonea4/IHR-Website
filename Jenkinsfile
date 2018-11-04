#!/usr/bin/env groovy

pipeline 
{
    agent any

    stages 
    {
        stage('Test')
        {
            steps 
            {
                sh '''echo "Good to Go!"'''
            }
        }
        stage('Deploy') 
        {
            steps 
            {
                script 
                {
                    docker.withRegistry('https://build.hdap.gatech.edu') 
                    {
                        //Build and push the database image
                        def databaseImage = docker.build("ihrwebappdb:${env.BUILD_ID}", "-f ./ihr-webappdb-docker .")
                        databaseImage.push()

                        def appImage = docker.build("ihrwebapp:${env.BUILD_ID}", "-f ./ihr-webapp-docker .")
                        appImage.push()
                    }
                }
            }
        }
        stage('Notify') {
            steps {
                script {
                    rancher confirm: true, credentialId: 'rancher-server', endpoint: 'https://rancher.hdap.gatech.edu/v2-beta', environmentId: '1a7', environments: '', image: 'build.hdap.gatech.edu/ihrwebapp:${env.BUILD_ID}', ports: '', service: 'IHR/ihr-webapp', timeout: 360
                    rancher confirm: true, credentialId: 'rancher-server', endpoint: 'https://rancher.hdap.gatech.edu/v2-beta', environmentId: '1a7', environments: '', image: 'build.hdap.gatech.edu/ihrwebappdb:${env.BUILD_ID}', ports: '', service: 'IHR/ihr-webapp-db', timeout: 360
                }
            }
        }
    }
}
