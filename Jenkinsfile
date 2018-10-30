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
                        def databaseImage = docker.build("ihrwebappdb:1.0", "-f ./ihr-webappdb-docker ./")
                        databaseImage.push('latest')

                        def appImage = docker.build("ihrwebapp:1.0", "-f ./ihr-webapp-docker ./")
                        appImage.push('latest')
                    }
                }
            }
        }
    }
}
