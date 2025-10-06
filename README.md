# YOLO E-commerce Application

A containerized full-stack e-commerce platform built with React (frontend), Node.js/Express (backend), and MongoDB (database). This application allows users to browse products and administrators to add new products through a dashboard interface.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Docker Services](#docker-services)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Overview

This project demonstrates containerization of a microservices-based e-commerce application using Docker and Docker Compose. The application consists of three main services:

- **Frontend**: React-based user interface
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB for data persistence

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│   MongoDB   │
│   (React)   │      │  (Node.js)  │      │  (Database) │
│   Port 3000 │      │  Port 5000  │      │  Port 27017 │
└─────────────┘      └─────────────┘      └─────────────┘
       │                     │                     │
       └─────────────────────┴─────────────────────┘
                    Custom Bridge Network
                      (yolo-network)
```

## Prerequisites

Before running this application, ensure you have the following installed:

- **Docker Engine** (version 20.10 or higher)
  - [Install Docker](https://docs.docker.com/engine/install/)
- **Docker Compose** (version 2.0 or higher)
  - Usually included with Docker Desktop
  - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git** for cloning the repository

### Verify Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Verify Docker is running
docker ps
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/evewangui/yolo.git
cd yolo-ecommerce
```

### 2. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (internal only)

### 4. Test the Application

1. Open your browser and navigate to http://localhost:3000
2. Browse existing products
3. Navigate to the "Add Product" page
4. Fill in product details and submit
5. Verify the product appears in the product list

### 5. Stop the Application

```bash
# Stop and remove containers (keeps data)
docker-compose down

# Stop and remove containers AND volumes (deletes data)
docker-compose down -v
```

## Project Structure

```
yolo-ecommerce/
├── client/                 # Frontend React application
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/               # Backend Node.js API
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── docker-compose.yml     # Orchestration configuration
├── explanation.md         # Technical documentation
├── README.md             # This file
└── .dockerignore         # Docker ignore patterns
```

## Docker Services

### Frontend Service (client)

- **Base Image**: `node:18-alpine`
- **Port**: 3000
- **Dependencies**: React, React Router, Axios
- **Environment Variables**:
  - `REACT_APP_API_URL`: Backend API endpoint

### Backend Service (backend)

- **Base Image**: `node:18-alpine`
- **Port**: 5000
- **Dependencies**: Express, Mongoose, CORS
- **Environment Variables**:
  - `MONGODB_URI`: MongoDB connection string
  - `PORT`: Server port (default: 5000)

### Database Service (mongodb)

- **Base Image**: `mongo:6-alpine`
- **Port**: 27017 (internal)
- **Volume**: `mongo-data` for data persistence
- **Authentication**: Optional (configure in docker-compose.yml)

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Backend Configuration
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/yolo

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
```

### Docker Compose Configuration

Key configurations in `docker-compose.yml`:

- **Networks**: Custom bridge network (`yolo-network`)
- **Volumes**: Named volume for MongoDB persistence
- **Restart Policy**: `unless-stopped` for automatic recovery
- **Health Checks**: Ensure services are ready before accepting traffic

## Usage

### Managing Containers

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f

# Restart a specific service
docker-compose restart backend

# Rebuild a specific service
docker-compose up -d --build backend
```

### Database Operations

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Restore database
docker-compose exec mongodb mongorestore /backup
```

### Docker Image Management

```bash
# List images
docker images

# Remove unused images
docker image prune

# View image details
docker inspect yourusername/yolo-backend:1.0.0
```

## Development

### Local Development (without Docker)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd client
npm install
npm start
```

### Building Images Separately

```bash
# Build backend image
docker build -t yourusername/yolo-backend:1.0.0 ./backend

# Build frontend image
docker build -t yourusername/yolo-frontend:1.0.0 ./client

# Push to DockerHub
docker push yourusername/yolo-backend:1.0.0
docker push yourusername/yolo-frontend:1.0.0
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
```

#### 2. Containers Not Starting

```bash
# Check container logs
docker-compose logs

# Check container status
docker-compose ps

# Restart services
docker-compose restart
```

#### 3. Database Connection Issues

```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection from backend
docker-compose exec backend ping mongodb
```

#### 4. Data Not Persisting

```bash
# Verify volume exists
docker volume ls

# Inspect volume
docker volume inspect yolo-ecommerce_mongo-data

# Ensure you're not using -v flag when stopping
docker-compose down  # ✓ Correct (keeps data)
docker-compose down -v  # ✗ Deletes volumes
```

#### 5. Images Too Large

```bash
# Check image sizes
docker images

# Use alpine base images
# Add .dockerignore file
# Use multi-stage builds
```

### Clean Slate Reset

```bash
# Stop all containers
docker-compose down -v

# Remove all related images
docker rmi $(docker images 'yolo*' -q)

# Remove all unused resources
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## Performance Optimization

- **Image Size**: All images use Alpine Linux base (< 400MB total)
- **Layer Caching**: Dependencies installed before copying source code
- **Multi-stage Builds**: Production builds exclude development dependencies
- **Health Checks**: Ensure services are healthy before routing traffic

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Moringa School for the project specification
- Docker community for excellent documentation
- Contributors and maintainers

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review the troubleshooting section above

---
