# Step 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# We use a dummy package.json because we aren't running npm install locally
RUN echo '{ "name": "mandigo-frontend", "version": "1.0.0", "dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0" } }' > package.json
RUN npm install
COPY . .
RUN npm run build || (npm install -g vite && vite build)

# Step 2: Serve the app using Nginx (Very lightweight!)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
