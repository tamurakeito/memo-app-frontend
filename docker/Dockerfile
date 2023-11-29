# Use an official Apache image as a parent image
FROM httpd:2.4

# Set the working directory to /usr/local/apache2/htdocs/
WORKDIR /usr/local/apache2/htdocs/

# Copy the local build directory to the working directory
COPY build/ .

# Expose port 80 to the outside world
EXPOSE 80
