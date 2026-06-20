# CloudPipe 🚀

A production-grade Node.js REST API with full DevOps pipeline — containerized with Docker, deployed on Railway (free), infrastructure documented with Terraform (AWS), and automated CI/CD via GitHub Actions.

## Architecture

```
GitHub Push → GitHub Actions CI/CD → DockerHub → Railway (free hosting)
                    ↓
              Run Tests → Build Image → Push to DockerHub → Deploy → Health Check
                                                               ↓
                                                    UptimeRobot Monitoring (free)
```

## Tech Stack
- **App:** Node.js, Express.js
- **Containerization:** Docker, Docker Compose, Nginx
- **Cloud Hosting:** Railway (free tier)
- **IaC:** Terraform (AWS EC2, VPC, CloudWatch — documented)
- **CI/CD:** GitHub Actions
- **Monitoring:** UptimeRobot (free)
- **Registry:** DockerHub

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/info` | System info (hostname, memory, CPU) |
| GET | `/items` | Get all items (filter by ?status= or ?priority=) |
| GET | `/items/:id` | Get item by ID |
| POST | `/items` | Create new item |
| PUT | `/items/:id` | Update item |
| DELETE | `/items/:id` | Delete item |
| GET | `/metrics` | App metrics |

## Local Development

```bash
# With Node.js
cd app
npm install
npm start
# API at http://localhost:3000

# With Docker
docker build -t cloudpipe .
docker run -p 3000:3000 cloudpipe

# With Docker Compose (app + Nginx)
docker-compose up
# API at http://localhost:80
```



## AWS Infrastructure (Terraform)

The `terraform/` folder contains full AWS infrastructure code for production scaling:
- VPC with public subnet
- EC2 instance (t2.micro — free tier eligible)
- Security groups
- CloudWatch CPU monitoring alarm

```bash
cd terraform
terraform init
terraform plan
terraform apply
```



## Project Structure
```
cloudpipe/
├── app/
│   ├── index.js              # Express REST API
│   ├── index.test.js         # Jest unit tests (9 tests)
│   └── package.json
├── terraform/
│   ├── main.tf               # AWS infrastructure
│   ├── variables.tf
│   └── outputs.tf
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD pipeline
├── scripts/
│   └── setup_monitoring.sh   # Monitoring guide
├── Dockerfile                # Multi-stage build
├── docker-compose.yml        # Local dev + Nginx
├── nginx.conf                # Reverse proxy
├── railway.json              # Railway config
└── README.md
```

## Author
Vasvi Shukla — [GitHub](https://github.com/VasviShukla) · [LinkedIn](https://www.linkedin.com/in/vasvishukla/)
