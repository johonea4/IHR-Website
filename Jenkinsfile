#!/usr/bin/env groovy

pipeline{
    agent any

    stages{
        stage('test'){
            steps {
                sh '''echo "Good to Go!"'''
            }
        }
        stage('deploy'){
            steps{
                script{
                    docker.withRegistry('https://build.hdap.gatech.edu'){
                        //Build and push the database image
                        def databaseImage = docker.build("ihrwebappdb:1.0", "-f ./ihr-webappdb-docker ./ihr-webapp-db")
                        databaseImage.push('latest')

                        def appImage = docker.build("ihrwebapp:1.0", "-f ./ihr-webapp-docker ./ihr-webapp")
                        appImage.push('latest')
                    }
                }
            }
        }
    }
}
