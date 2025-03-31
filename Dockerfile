# # Use an official Node.js runtime as a base image
# FROM node:18.20.3

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # # Set environment variables
# # ENV ENV=development \
# #     PORT=3000 \
# #     SECRET_KEY="MLpW0XgJMz" \
# #     DB_USERNAME="postgres" \
# #     DB_PASSWORD="postgres" \
# #     DB_NAME="demo_boilerplate" \
# #     DB_HOST="localhost" \
# #     DB_DIALECT="postgres"

# # Create the directories
# # RUN mkdir -p config dist migrations node_modules

# # Copy configuration files
# COPY config/ config/
# COPY dist/ dist/
# COPY migrations/ migrations/
# COPY node_modules/ node_modules/

# # Expose the port that your application will run on
# EXPOSE 3000

# # Define the command to run your application
# CMD ["node", "dist/index.js"]

##############################################################


# Stage 1: Build
FROM node:18.20.3 AS build

# Set the working directory in the build stage
WORKDIR /usr/src/app

# Copy the source code to the container
COPY . .

# Install dependencies (including dev dependencies)
RUN npm install

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18.20.3-slim

# Set the working directory in the production stage
WORKDIR /usr/src/app

# Copy only necessary files for production
# COPY package*.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/migrations ./migrations

# Expose the port that your application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "dist/index.js"]
