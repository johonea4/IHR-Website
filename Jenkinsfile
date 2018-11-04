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
                        databaseImage.push('latest')

                        def appImage = docker.build("ihrwebapp:${env.BUILD_ID}", "-f ./ihr-webapp-docker .")
                        appImage.push('latest')
                    }
                }
            }
        }
        stage('Notify') {
            steps {
                script {
                    rancher confirm: true, credentialId: 'rancher-server', endpoint: 'https://rancher.hdap.gatech.edu/v2-beta', environmentId: '1a7', environments: '', image: 'build.hdap.gatech.edu/ihrwebappdb:latest', ports: '', service: 'IHR/ihr-webapp-db1', timeout: 360
                    rancher confirm: true, credentialId: 'rancher-server', endpoint: 'https://rancher.hdap.gatech.edu/v2-beta', environmentId: '1a7', environments: '', image: 'build.hdap.gatech.edu/ihrwebapp:latest', ports: '', service: 'IHR/ihr-webapp1', timeout: 360
                }
            }
        }
    }
}
