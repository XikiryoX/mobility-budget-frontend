FROM nginx:alpine

# Copy the built application
COPY dist/mobility-app /usr/share/nginx/html

# Add nginx configuration for SPA routing
RUN echo 'server { listen 80; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
