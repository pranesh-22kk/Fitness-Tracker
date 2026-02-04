#!/bin/bash

# Enhanced Fitness Tracker - Installation Script
# Run this from the project root: ./install.sh

echo "🚀 Enhanced Fitness Tracker - Setup Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check if MongoDB is installed
echo -e "${YELLOW}Checking MongoDB installation...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB found${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB not found. Please install MongoDB${NC}"
fi

echo ""
echo -e "${CYAN}📦 Installing Dependencies...${NC}"
echo ""

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd Fitness-Tracker-main/backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Backend installation failed${NC}"
    exit 1
fi

# Install frontend dependencies
echo ""
echo -e "${YELLOW}Installing frontend dependencies (this may take a few minutes)...${NC}"
cd ..
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Frontend installation failed${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
echo ""
echo -e "${CYAN}⚙️ Setting up environment...${NC}"
cd backend
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
MONGO_URL=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=8000
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please update the JWT_SECRET in backend/.env for production${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}✨ Installation Complete!${NC}"
echo ""
echo -e "${CYAN}📋 Next Steps:${NC}"
echo -e "${NC}1. Make sure MongoDB is running:${NC}"
echo -e "   brew services start mongodb-community  # Mac"
echo -e "   sudo systemctl start mongod            # Linux"
echo ""
echo -e "${NC}2. Start the backend (in one terminal):${NC}"
echo -e "   cd Fitness-Tracker-main/backend"
echo -e "   npm start"
echo ""
echo -e "${NC}3. Start the frontend (in another terminal):${NC}"
echo -e "   cd Fitness-Tracker-main"
echo -e "   npm start"
echo ""
echo -e "${NC}4. Open your browser to:${NC}"
echo -e "   ${CYAN}http://localhost:3000${NC}"
echo ""
echo -e "${CYAN}📚 Documentation:${NC}"
echo -e "   - Quick Start: QUICK_START.md"
echo -e "   - Full Docs: ENHANCED_README.md"
echo -e "   - Changes: CHANGES.md"
echo ""
echo -e "${GREEN}Happy Tracking! 💪🚀${NC}"
