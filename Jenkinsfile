// //Slack Details
// slack_channel= ''
// slack_teamDomain= ''   
// slack_token_cred_id= ''                  //slack-Integration-Token-Credential-ID

// //Config Repo Details
// // config_repo_url= ''
// // config_repo_cred_id= ''
// helm_repo = 'git@bitbucket.org:Mindbowser/[REPLACE_PROJECT_NAME]-helm.git'
// project_name = '[REPLACE_PROJECT_NAME]'

// // flag for testing
// test_enabled=false

// //regions
// ecr_reg_region= ''
// dev_aws_region= ''
// stage_aws_region= ''
// prod_aws_region= ''

// pipeline {
//     agent {
//         label ''          //use desired label. For ex: ec2, node etc.
//     }
//     environment{
//         BITBUCKET_CRED = credentials('[REPLACE_PROJECT_NAME]-helm')      //credential stored in jenkins which contains access token of helm repo For ex: periopmd-helm
//     }
//     options {
//       //discard after number of specified builds
//       buildDiscarder(logRotator(numToKeepStr: "5"))
//       disableConcurrentBuilds()
//       parallelsAlwaysFailFast()
//     }
//     stages {
//         stage('Init'){
//             steps {
//                     script {
//                         lastCommitInfo = sh(script: "git log -1", returnStdout: true).trim()
//                         commitContainsSkip = sh(script: "git log -1 | grep 'skip ci'", returnStatus: true)
//                         slackMessage = """
//                         *${env.JOB_NAME}* *${env.BRANCH_NAME}* received a new commit. :rocket: 
//                         \nHere is commmit info: ${lastCommitInfo}\n
//                         *Console Output*: <${BUILD_URL}/console | (Open)>"""
//                         slack_send(slackMessage)
//                         // if commit message contains skip ci
//                         if(commitContainsSkip == 0) {
//                             skippingText = " Skipping Build for *${env.BRANCH_NAME}* branch."
//                             currentBuild.result = 'ABORTED'
//                             slack_send(skippingText,"warning")
//                             error('BUILD SKIPPED')
//                         }
//                     }
//             }
//         }

//         stage('Setting up environment')
//             {
//                 steps
//                 {
//                     script
//                     {
//                         branch_name = "${env.BRANCH_NAME}"
//                         if(branch_name == "staging")
//                         {
//                             env.REPOSITORY_ENV= "stage"

//                         }else if(branch_name == "master")
//                         {
//                             env.REPOSITORY_ENV= "prod"

//                         }else
//                         {
//                             env.REPOSITORY_ENV= "dev"
//                         }
//                     }
//                 }
//             }

        
//         stage('Replace Makefile name Non-Prod ') {
//             when{
//                 expression{
//                          return BRANCH_NAME == 'staging' || BRANCH_NAME == 'development'
//                     }
//             }
//             steps {
//                 sh "sed -i 's/replace_makefile_repo_name/${env.REPOSITORY_ENV}-${project_name}/' Makefile"
//                 sh "sed -i 's/replace_aws_account_number/[REPLACE_AWS_ACC_NO_NON_PROD]/' Makefile"      //aws account number of non-prod account

//             }
//         }

//         stage('Replace Makefile name Prod') {
//             when{
//                 expression{
//                         return BRANCH_NAME == 'master'
//                 }
//             }
//             steps {
//                 sh "sed -i 's/replace_makefile_repo_name/${env.REPOSITORY_ENV}-${project_name}/' Makefile"
//                 sh "sed -i 's/replace_aws_account_number/[REPLACE_AWS_ACC_NO_PROD]/' Makefile"         //aws account number of prod account

//             }
//         }



//         stage('Install') {
//             steps {
//                 slack_send("Downloading Dependencies :hourglass_flowing_sand: :arrow_down_small: ")
//                 sh 'sudo chmod 777 /var/run/docker.sock'
//                 sh "sudo apt-get install make -y"
//                 slack_send("Downloading Completed Successfully :hourglass: ")
//             }
//         }
//         stage('test') {
//             when{
//                 expression {
//                     return env.test_enabled == true
//                 }
//             }
//             steps {
//                 slack_send("Unit Testing Started :test_tube: ")
//                 sh 'make test || exit 0'
//                 junit 'reports/*.xml'
//                 slack_send("Unit Testing Finished Successfully! :beer: ")
//             }
//         }
//         stage('build') {
//             environment{
//                 BUILD_TAG="${env.BRANCH_NAME}_${env.GIT_COMMIT}"
//             }
//             steps {
//                 slack_send("Generating Build :cook: :fondue: ")
//                 sh 'npm install && npm run build && make build'
//                 slack_send("Build Generated Successfully :yum: ")
//             }
//         }

//         stage('NON-PROD-Publish') {
//             when{
//                 expression{
//                     return BRANCH_NAME == 'staging' || BRANCH_NAME == 'development'
//                 }
//             }
//             steps {
//                 slack_send("Publishing Docker Image :whale2: :camera_with_flash: ")
//                 withAWS(credentials: 'AWS-NON-PROD-KEY', region: "${ecr_reg_region}") {     //credentials of non-prod aws account stored in jenkins 
//                         sh 'docker images ls -a'
//                         sh 'make login'
//                         sh 'make publish'
//                 }
//                 slack_send("Docker Image Published Successfully :loudspeaker: :film_frames: ")
//             }
//         }

//         stage('Prod-Publish') {
            
//             when{
//                 expression{
//                         return BRANCH_NAME == 'master'
//                 }
//             }
//             steps {
//                 slack_send("Publishing Docker Image :whale2: :camera_with_flash: ")
//                 withAWS(credentials: 'AWS-PROD-KEY', region: "${ecr_reg_region}") {         //credentials of prod aws account stored in jenkins
//                         sh 'make login'
//                         sh 'make publish'
//                 }
//                 slack_send("Docker Image Published Successfully :loudspeaker: :film_frames: ")
//             }
//         }

//         stage('deploy-dev'){
//             when{
//                 branch 'development'
//             }
//             steps{
//                 slack_send("Development Delivery Pipeline Started  :earth_asia: :rocket: ")
//                 withAWS(credentials: 'AWS-NON-PROD-KEY', region: "${dev_aws_region}") {     //credentials of non-prod aws account stored in jenkins
//                         script {
//                             sh""" 
//                             rm -rf   ~/.ssh/config | echo "skipping... config does not exist"
//                             echo "HOST *" > ~/.ssh/config
//                             echo "StrictHostKeyChecking no" >> ~/.ssh/config
//                             rm -rf development | echo "skipping... development does not exist"
//                             git clone https://x-token-auth:${env.BITBUCKET_CRED}@bitbucket.org/Mindbowser/[REPLACE_PROJECT_NAME]-helm.git -b development development   //helm repo name ex: periopmd-helm.git
//                             """
//                             sh '''
//                             cd development/Development/dev-[REPLACE_PROJECT_NAME]
//                             tag=`cat ../../../tag.tmp | sed 's/ //g'`
//                             sed -i "8s|.*|  name: ${tag}|" values.yaml
                          
//                             # Check if there are changes to commit
//                             changes=$(git diff values.yaml)

//                             if [ -n "$changes" ]; then
//                                 # If there are changes, proceed with committing and pushing
//                                 git add values.yaml
//                                 git status --porcelain
//                                 git commit -m "Update Image tag"
//                                 git push
//                             else
//                                 # If there are no changes, print a message and skip pushing
//                                 echo "No changes to commit. Skipping push."
//                             fi
//                             '''
//                         }
//                 }
//                 slack_send("Development Delivery Pipeline Finished Successfully  :dancer: :man_dancing:")
//             }
//         }//deploy-dev

//         stage("deploy-staging"){
//             when{
//                 branch 'staging'
//             }
//             steps{
//                 slack_send("Staging Delivery Pipeline Started  :earth_asia: :rocket: ")
//                 withAWS(credentials: 'AWS-NON-PROD-KEY', region: "${dev_aws_region}") {       //credentials of non-prod aws account stored in jenkins
//                         script {
//                             sh""" 
//                             rm -rf   ~/.ssh/config | echo "skipping... config does not exist"
//                             echo "HOST *" > ~/.ssh/config
//                             echo "StrictHostKeyChecking no" >> ~/.ssh/config
//                             rm -rf stage | echo "skipping... stage does not exist"
//                             git clone https://x-token-auth:${env.BITBUCKET_CRED}@bitbucket.org/Mindbowser/[REPLACE_PROJECT_NAME]-helm.git -b stage stage      //helm repo name ex: periopmd-helm.git
//                             """
//                             sh '''
//                             cd stage/stage/stage-[REPLACE_PROJECT_NAME]
//                             tag=`cat ../../../tag.tmp | sed 's/ //g'`
//                             sed -i "8s|.*|  name: ${tag}|" values.yaml
                           
//                             # Check if there are changes to commit
//                             changes=$(git diff values.yaml)

//                             if [ -n "$changes" ]; then
//                                 # If there are changes, proceed with committing and pushing
//                                 git add values.yaml
//                                 git status --porcelain
//                                 git commit -m "Update Image tag"
//                                 git push
//                             else
//                                 # If there are no changes, print a message and skip pushing
//                                 echo "No changes to commit. Skipping push."
//                             fi
//                             '''
//                         }
//                 }
//                 slack_send("Staging Delivery Pipeline Finished Successfully  :dancer: :man_dancing:")
//             }
//         }//deploy-staging


//         stage("deploy-Prod"){
//             when{
//                 branch 'master'
//             }
//             steps{
//                 slack_send("Prod Delivery Pipeline Started  :earth_asia: :rocket: ")
//                 withAWS(credentials: 'AWS-PROD-KEY', region: "${dev_aws_region}") {        //credentials of prod aws account stored in jenkins
//                     script {
//                         sh""" 
//                         rm -rf   ~/.ssh/config | echo "skipping... config does not exist"
//                         echo "HOST *" > ~/.ssh/config
//                         echo "StrictHostKeyChecking no" >> ~/.ssh/config
//                         rm -rf prod | echo "skipping... prod does not exist"
//                         git clone https://x-token-auth:${env.BITBUCKET_CRED}@bitbucket.org/Mindbowser/[REPLACE_PROJECT_NAME]-helm.git -b master master    //helm repo name ex: periopmd-helm.git
//                         """
//                         sh '''
//                         cd prod/prod/prod-[REPLACE_PROJECT_NAME]
//                         tag=`cat ../../../tag.tmp | sed 's/ //g'`
//                         sed -i "8s|.*|  name: ${tag}|" values.yaml

//                         # Check if there are changes to commit
//                         changes=$(git diff values.yaml)

//                         if [ -n "$changes" ]; then
//                             # If there are changes, proceed with committing and pushing
//                             git add values.yaml
//                             git status --porcelain
//                             git commit -m "Update Image tag"
//                             git push
//                         else
//                             # If there are no changes, print a message and skip pushing
//                             echo "No changes to commit. Skipping push."
//                         fi
//                         '''
//                     }
//                 }
//                 slack_send("Prod Delivery Pipeline Finished Successfully  :dancer: :man_dancing:")
//             }
//         }//deploy-production
//     }//stages end

//     post {
//         always {
//             sh 'make clean'
//             deleteDir()
//         }
//         success{
//              slack_send("*SUCCESS:* Job ${env.JOB_NAME}[${env.BUILD_NUMBER}] *Console Output*: (<${BUILD_URL}/console | (Open)>)","good")
//         }
//         failure{
//             slack_send("*FAILURE:* Job ${env.JOB_NAME}[${env.BUILD_NUMBER}] \nHere is commmit info: ${lastCommitInfo}\n*Console Output*: (<${BUILD_URL}/console | (Open)>)","danger")
//         }

//     }
// }

// def slack_send(slackMessage,messageColor="good"){
//     slackSend channel: slack_channel, color: messageColor, message: slackMessage, teamDomain: slack_teamDomain, tokenCredentialId: slack_token_cred_id , username: 'Jenkins'
// }

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////



//Slack Details
slack_channel= 'test_cicd'
slack_teamDomain= 'mindbowser'   
slack_token_cred_id= 'slack-Integration-Token-Credential-ID'                  //slack-Integration-Token-Credential-ID


helm_repo = 'git@bitbucket.org:Mindbowser/[REPLACE_PROJECT_NAME]-helm.git'
project_name = '[REPLACE_PROJECT_NAME]'

// flag for testing
test_enabled=false

//regions
ecr_reg_region= ''
dev_aws_region= ''
stage_aws_region= ''
prod_aws_region= ''

pipeline {
    agent {
        label 'node'          //use desired label. For ex: ec2, node etc.
    }
    environment{
        BITBUCKET_CRED = credentials('[REPLACE_PROJECT_NAME]-helm')      //credential stored in jenkins which contains access token of helm repo For ex: periopmd-helm
        // store as secret text
    }
    options {
      //discard after number of specified builds
      buildDiscarder(logRotator(numToKeepStr: "5"))
      disableConcurrentBuilds()
      parallelsAlwaysFailFast()
    }
    stages {
        stage('Init'){
            steps {
                    script {
                        lastCommitInfo = sh(script: "git log -1", returnStdout: true).trim()
                        commitContainsSkip = sh(script: "git log -1 | grep 'skip ci'", returnStatus: true)
                        slackMessage = """
                        *${env.JOB_NAME}* *${env.BRANCH_NAME}* received a new commit. :rocket: 
                        \nHere is commmit info: ${lastCommitInfo}\n
                        *Console Output*: <${BUILD_URL}/console | (Open)>"""
                        slack_send(slackMessage)
                        // if commit message contains skip ci
                        if(commitContainsSkip == 0) {
                            skippingText = " Skipping Build for *${env.BRANCH_NAME}* branch."
                            currentBuild.result = 'ABORTED'
                            slack_send(skippingText,"warning")
                            error('BUILD SKIPPED')
                        }
                    }
            }
        }

        stage('Setting up environment')
            {
                steps
                {
                    script
                    {
                        branch_name = "${env.BRANCH_NAME}"
                        if(branch_name == "staging")
                        {
                            env.REPOSITORY_ENV= "stage"

                        }else if(branch_name == "master")
                        {
                            env.REPOSITORY_ENV= "prod"

                        }else
                        {
                            env.REPOSITORY_ENV= "dev"
                        }
                    }
                }
            }

        
        stage('Replace Makefile name Non-Prod ') {
            when{
                expression{
                         return BRANCH_NAME == 'staging' || BRANCH_NAME == 'development'
                    }
            }
            steps {
                sh "sed -i 's/replace_makefile_repo_name/${env.REPOSITORY_ENV}-${project_name}/' Makefile"
                sh "sed -i 's/replace_aws_account_number/[REPLACE_AWS_ACC_NO_NON_PROD]/' Makefile"      //aws account number of non-prod account

            }
        }

        stage('Replace Makefile name Prod') {
            when{
                expression{
                        return BRANCH_NAME == 'master'
                }
            }
            steps {
                sh "sed -i 's/replace_makefile_repo_name/${env.REPOSITORY_ENV}-${project_name}/' Makefile"
                sh "sed -i 's/replace_aws_account_number/[REPLACE_AWS_ACC_NO_PROD]/' Makefile"         //aws account number of prod account

            }
        }



        stage('Install') {
            steps {
                slack_send("Downloading Dependencies :hourglass_flowing_sand: :arrow_down_small: ")
                sh 'sudo chmod 777 /var/run/docker.sock'
                sh "sudo apt-get install make -y"
                slack_send("Downloading Completed Successfully :hourglass: ")
            }
        }
        stage('test') {
            when{
                expression {
                    return env.test_enabled == true
                }
            }
            steps {
                slack_send("Unit Testing Started :test_tube: ")
                sh 'make test || exit 0'
                junit 'reports/*.xml'
                slack_send("Unit Testing Finished Successfully! :beer: ")
            }
        }
        stage('build') {
            environment{
                BUILD_TAG="${env.BRANCH_NAME}_${env.GIT_COMMIT}"
            }
            steps {
                slack_send("Generating Build :cook: :fondue: ")
                sh 'make build'
                slack_send("Build Generated Successfully :yum: ")
            }
        }

        stage('NON-PROD-Publish') {
            when{
                expression{
                    return BRANCH_NAME == 'staging' || BRANCH_NAME == 'development'
                }
            }
            steps {
                slack_send("Publishing Docker Image :whale2: :camera_with_flash: ")
                withAWS(credentials: 'AWS-NON-PROD-KEY', region: "${ecr_reg_region}") {     //credentials of non-prod aws account stored in jenkins 
                        sh 'docker images ls -a'
                        sh 'make login'
                        sh 'make publish'
                }
                slack_send("Docker Image Published Successfully :loudspeaker: :film_frames: ")
            }
        }

        stage('Prod-Publish') {
            
            when{
                expression{
                        return BRANCH_NAME == 'master'
                }
            }
            steps {
                slack_send("Publishing Docker Image :whale2: :camera_with_flash: ")
                withAWS(credentials: 'AWS-PROD-KEY', region: "${ecr_reg_region}") {         //credentials of prod aws account stored in jenkins
                        sh 'make login'
                        sh 'make publish'
                }
                slack_send("Docker Image Published Successfully :loudspeaker: :film_frames: ")
            }
        }

        stage('deploy-dev'){
            when{
                branch 'development'
            }
            steps{
                slack_send("Development Delivery Pipeline Started  :earth_asia: :rocket: ")
                withAWS(credentials: 'AWS-NON-PROD-KEY', region: "${dev_aws_region}") {     //credentials of non-prod aws account stored in jenkins
                        script {
                            sh""" 
                            rm -rf   ~/.ssh/config | echo "skipping... config does not exist"
                            echo "HOST *" > ~/.ssh/config
                            echo "StrictHostKeyChecking no" >> ~/.ssh/config
                            rm -rf development | echo "skipping... development does not exist"
                            git clone https://x-token-auth:${env.BITBUCKET_CRED}@bitbucket.org/Mindbowser/[REPLACE_PROJECT_NAME]-helm.git -b development development   
                            """
                            sh '''
                            cd development/Development/nodets-development
                            tag=`cat ../../../tag.tmp | sed 's/ //g'`
                            sed -i "8s|.*|  name: ${tag}|" values.yaml
                          
                            # Check if there are changes to commit
                            changes=$(git diff values.yaml)

                            if [ -n "$changes" ]; then
                                # If there are changes, proceed with committing and pushing
                                git add values.yaml
                                git status --porcelain
                                git commit -m "Update Image tag"
                                git push
                            else
                                # If there are no changes, print a message and skip pushing
                                echo "No changes to commit. Skipping push."
                            fi
                            '''
                        }
                }
                slack_send("Development Delivery Pipeline Finished Successfully  :dancer: :man_dancing:")
            }
        }//deploy-dev

        stage("deploy-staging"){
            when{
                branch 'staging'
            }
            steps{
                slack_send("Staging Delivery Pipeline Started  :earth_asia: :rocket: ")
                withAWS(credentials: 'AWS-NON-PROD-KEY', region: "${dev_aws_region}") {       //credentials of non-prod aws account stored in jenkins
                        script {
                            sh""" 
                            rm -rf   ~/.ssh/config | echo "skipping... config does not exist"
                            echo "HOST *" > ~/.ssh/config
                            echo "StrictHostKeyChecking no" >> ~/.ssh/config
                            rm -rf stage | echo "skipping... stage does not exist"
                            git clone https://x-token-auth:${env.BITBUCKET_CRED}@bitbucket.org/Mindbowser/[REPLACE_PROJECT_NAME]-helm.git -b stage stage      //helm repo name ex: periopmd-helm.git
                            """
                            sh '''
                            cd stage/stage/[REPLACE_PROJECT_NAME]-staging
                            tag=`cat ../../../tag.tmp | sed 's/ //g'`
                            sed -i "8s|.*|  name: ${tag}|" values.yaml
                           
                            # Check if there are changes to commit
                            changes=$(git diff values.yaml)

                            if [ -n "$changes" ]; then
                                # If there are changes, proceed with committing and pushing
                                git add values.yaml
                                git status --porcelain
                                git commit -m "Update Image tag"
                                git push
                            else
                                # If there are no changes, print a message and skip pushing
                                echo "No changes to commit. Skipping push."
                            fi
                            '''
                        }
                }
                slack_send("Staging Delivery Pipeline Finished Successfully  :dancer: :man_dancing:")
            }
        }//deploy-staging


        stage("deploy-Prod"){
            when{
                branch 'master'
            }
            steps{
                slack_send("Prod Delivery Pipeline Started  :earth_asia: :rocket: ")
                withAWS(credentials: 'AWS-PROD-KEY', region: "${dev_aws_region}") {        //credentials of prod aws account stored in jenkins
                    script {
                        sh""" 
                        rm -rf   ~/.ssh/config | echo "skipping... config does not exist"
                        echo "HOST *" > ~/.ssh/config
                        echo "StrictHostKeyChecking no" >> ~/.ssh/config
                        rm -rf prod | echo "skipping... prod does not exist"
                        git clone https://x-token-auth:${env.BITBUCKET_CRED}@bitbucket.org/Mindbowser/[REPLACE_PROJECT_NAME]-helm.git -b master master    //helm repo name ex: periopmd-helm.git
                        """
                        sh '''
                        cd prod/prod/REPLACE_PROJECT_NAME]-production
                        tag=`cat ../../../tag.tmp | sed 's/ //g'`
                        sed -i "8s|.*|  name: ${tag}|" values.yaml

                        # Check if there are changes to commit
                        changes=$(git diff values.yaml)

                        if [ -n "$changes" ]; then
                            # If there are changes, proceed with committing and pushing
                            git add values.yaml
                            git status --porcelain
                            git commit -m "Update Image tag"
                            git push
                        else
                            # If there are no changes, print a message and skip pushing
                            echo "No changes to commit. Skipping push."
                        fi
                        '''
                    }
                }
                slack_send("Prod Delivery Pipeline Finished Successfully  :dancer: :man_dancing:")
            }
        }//deploy-production
        
    }//stages end

    post {
        always {
            sh 'make clean'
            deleteDir()
        }
        success{
             slack_send("*SUCCESS:* Job ${env.JOB_NAME}[${env.BUILD_NUMBER}] *Console Output*: (<${BUILD_URL}/console | (Open)>)","good")
        }
        failure{
            slack_send("*FAILURE:* Job ${env.JOB_NAME}[${env.BUILD_NUMBER}] \nHere is commmit info: ${lastCommitInfo}\n*Console Output*: (<${BUILD_URL}/console | (Open)>)","danger")
        }

    }
}

def slack_send(slackMessage,messageColor="good"){
    slackSend channel: slack_channel, color: messageColor, message: slackMessage, teamDomain: slack_teamDomain, tokenCredentialId: slack_token_cred_id , username: 'Jenkins'
}




