# 🚀 HRMS Lite - Backend API

![Django](https://img.shields.io/badge/Django-5.0.3-092E20?style=for-the-badge&logo=django)
![DRF](https://img.shields.io/badge/DRF-3.14.0-ff1709?style=for-the-badge&logo=django)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0-47A248?style=for-the-badge&logo=mongodb)
![Python](https://img.shields.io/badge/Python-3.9-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A modern, scalable Human Resource Management System backend built with Django REST Framework and MongoDB. Designed for simplicity and performance.

## ✨ Features

- **👥 Employee Management** - Full CRUD operations with validation
- **📊 Attendance Tracking** - Record and manage employee attendance
- **⚡ High Performance** - Optimized queries with pagination
- **🛡️ Error Handling** - Custom error responses with proper HTTP codes
- **🔒 Input Validation** - Middleware for parameter validation
- **📈 Statistics API** - Efficient count endpoints (no full data retrieval)
- **🌐 CORS Ready** - Configured for cross-origin requests
- **🚀 Production Ready** - Security headers, logging, and deployment configs


## 📦 Installation

### Prerequisites
- Python 3.10+
- MongoDB 5.0+
- pip (Python package manager)

### 1. Clone and Setup
```bash
# Clone repository
git clone https://github.com/SagarBhausahebSahane/HRMS-System.git
cd HRMS-System/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
