# Project variables
# Mention project name here for ex: PROJECT_NAME ?= periopmd
PROJECT_NAME ?= [REPLACE_PROJECT_NAME]   
ORG_NAME ?= mindbowser
REPO_NAME ?= replace_makefile_repo_name

#update the source directory ex: SRC_DIR ?= periopmd
SRC_DIR ?= [REPLACE_PROJECT_NAME] 

# Use these settings to specify a custom Docker registry
# use proper aws region. For ex: DOCKER_REGISTRY ?= replace_aws_account_number.dkr.ecr.us-east-1.amazonaws.com
DOCKER_REGISTRY ?= replace_aws_account_number.dkr.ecr.[REPLACE_REGION].amazonaws.com
#docker.io

# Filenames
# DEV_COMPOSE_FILE := docker/dev/docker-compose.yml
DEV_COMPOSE_FILE := Dockerfile


# Build tag expression - can be used to evaulate a shell expression at runtime
BUILD_TAG_EXPRESSION ?= date -u +%Y%m%d%H%M%S

# Execute shell expression
BUILD_EXPRESSION := $(shell $(BUILD_TAG_EXPRESSION))

# Build tag - defaults to BUILD_EXPRESSION if not defined
BUILD_TAG ?= $(BUILD_EXPRESSION)


build:
	${INFO} "Creating release image" 
	${CREATE_IMAGE_NAME}
	@ docker build  --no-cache --build-arg SRC_DIR="$(SRC_DIR)" -t $(READ_IMAGE_NAME) -f Dockerfile .	

login:
	${INFO} "Logging in to $(DOCKER_REGISTRY)"
	@ aws ecr get-login-password | docker login --username AWS --password-stdin $(DOCKER_REGISTRY) 


publish:
	${INFO} "Publishing release image $(READ_IMAGE_NAME) ..."
	@ docker push $(READ_IMAGE_NAME)
	${INFO} "Publish complete"

deploy:
	${INFO} "Deploying $(READ_IMAGE_NAME) ..."
	@cd ansible && ansible-playbook site.yml -e 'service_image_name=$(shell cat tag.tmp)' -e 'registry_url=$(DOCKER_REGISTRY)' -e@vars/$$env.yml


clean:
	${INFO} "Removing dangling images..."
	@ docker images -q -f dangling=true  | xargs -I ARGS docker rmi -f ARGS
	${INFO} "Removing release docker images..."
	@ docker rmi $(READ_IMAGE_NAME)  || echo "NO docker image"
	${INFO} "Clean complete"

# Cosmetics
YELLOW := "\e[1;33m"
NC := "\e[0m"

# Shell Functions
INFO := @bash -c '\
  printf $(YELLOW); \
  echo "=> $$1"; \
  printf $(NC)' SOME_VALUE

CREATE_IMAGE_NAME := @bash -c '\
	echo "$(DOCKER_REGISTRY)/$(REPO_NAME):$(BUILD_TAG)" > tag.tmp\
  ' SOME_VALUE
READ_IMAGE_NAME := $$(cat tag.tmp | sed 's/ //g')

# Check and Inspect Logic
INSPECT := $$(docker-compose -p $$1 -f $$2 ps -q $$3 | xargs -I ARGS docker inspect -f "{{ .State.ExitCode }}" ARGS)

CHECK := @bash -c '\
  if [[ $(INSPECT) -ne 0 ]]; \
  then exit $(INSPECT); fi' VALUE
