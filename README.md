# Employee Management System (HR Management)

A comprehensive web-based Human Resources Management System designed to streamline employee management, automate HR workflows, and enhance employee engagement through activity tracking and reward programs.

## 📋 Overview

This system provides an integrated platform for managing the complete employee lifecycle - from onboarding to daily operations. Built with modern technologies, it offers:

- **Complete Employee Profile Management** - Centralized employee data with personal, employment, and financial information
- **Automated Request Workflows** - Leave requests, timesheet corrections, and WFH requests with approval mechanisms
- **Activity & Event Management** - Company-wide activities (running, walking, team building) with participation tracking
- **Point-Based Reward System** - Gamified employee recognition with monthly allocations, activity rewards, and cash redemption

## 🏗️ System Architecture

### Architectural Pattern

**Three-Tier Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│                    (React SPA)                           │
│  • Component-based UI                                    │
│  • Redux state management                                │
│  • Responsive design (SCSS)                              │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (JSON)
┌────────────────────┴────────────────────────────────────┐
│                   Business Layer                         │
│              (Spring Boot Backend)                       │
│  • Service Layer (Business Logic)                        │
│  • Repository Layer (Data Access)                        │
│  • Security Layer (JWT Authentication)                   │
│  • Scheduled Jobs (Automated Tasks)                      │
└────────────────────┬────────────────────────────────────┘
                     │ JPA/Hibernate ORM
┌────────────────────┴────────────────────────────────────┐
│                    Data Layer                            │
│            (MySQL/PostgreSQL Database)                   │
│  • Relational data model                                 │
│  • Transaction management                                │
│  • Data integrity constraints                            │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns & Principles

**Backend (Spring Boot):**
- **MVC Pattern** - Separation of Controller, Service, Repository layers
- **Dependency Injection** - Spring IoC container for loose coupling
- **Repository Pattern** - Data access abstraction via Spring Data JPA
- **DTO Pattern** - Request/Response objects for API boundaries
- **Builder Pattern** - Lombok builders for object construction
- **Strategy Pattern** - Request providers for different request types (`LeaveRequestProvider`, `TimeSheetRequestProvider`, `WFHRequestProvider`)
- **Event-Driven** - Spring Events for notification system
- **Mapper Pattern** - MapStruct for entity-DTO conversions

**Frontend (React):**
- **Component-Based Architecture** - Reusable UI components
- **Container/Presenter Pattern** - Smart vs presentational components
- **Centralized State Management** - Redux for application state
- **Service Layer** - Axios-based API communication layer

### Security Architecture

- **JWT Authentication** - Stateless token-based authentication
- **Role-Based Access Control (RBAC)** - CEO, HRM, Manager, Team Lead, Employee roles
- **Spring Security** - Method-level security annotations
- **Password Encryption** - BCrypt hashing
- **Secure File Storage** - AWS S3 with signed URLs

## 🛠️ Technology Stack

### Backend Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Spring Boot 3.x | Enterprise Java framework |
| **Language** | Java 22 | Programming language |
| **Security** | Spring Security + JWT | Authentication & Authorization |
| **ORM** | Hibernate/JPA | Object-relational mapping |
| **Database** | MySQL/PostgreSQL | Relational database |
| **Validation** | Jakarta Validation | Input validation |
| **Mapping** | MapStruct | Object mapping |
| **Caching** | Spring Cache | Performance optimization |
| **Scheduling** | Spring Scheduler | Automated tasks |
| **Build Tool** | Maven | Dependency management |

### Frontend Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18 | UI library |
| **Language** | JavaScript ES6+ | Programming language |
| **State Management** | Redux | Application state |
| **Styling** | SCSS | CSS preprocessor |
| **HTTP Client** | Axios | API communication |
| **UI Components** | React Bootstrap, Material-UI | Component libraries |
| **Excel Processing** | XLSX | Import/Export functionality |

## 🔌 System Integrations

### Cloud Services

**AWS S3 Integration**
- **Purpose**: Centralized file storage for employee attachments
- **Use Cases**:
  - Request attachments (leave letters, medical certificates)
  - Activity documents and images
  - Employee profile pictures
  - Import/export Excel files
- **Features**: Secure file upload, automatic file management, CDN delivery

### Email Service (Planned/Configured)
- **Purpose**: Automated notifications
- **Triggers**:
  - Request submissions and approvals
  - Activity registrations
  - Point allocations
  - System announcements

### Database Integration

**JPA/Hibernate ORM**
- **Features**:
  - Lazy loading for performance
  - Cascade operations
  - Transaction management
  - Query optimization
  - Custom JPQL queries

### Third-Party Libraries

**Backend:**
- **Apache POI (XSSF)** - Excel file processing for bulk imports
- **Lombok** - Boilerplate code reduction
- **MapStruct** - Compile-time object mapping
- **Spring Cache** - Caching abstraction

**Frontend:**
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **XLSX** - Excel file generation/parsing
- **Moment.js/Day.js** - Date manipulation

## 🎯 Core Features

### 1. Profile Management
Complete employee lifecycle management with 40+ data fields covering personal information, employment details, education, financial data, and emergency contacts.

### 2. Request Workflow System
Automated approval workflows for:
- **Leave Requests** - Annual, sick, personal, maternity leave
- **Timesheet Corrections** - Check-in/out time adjustments
- **WFH Requests** - Work from home approvals

Workflow: `Employee Submit → Manager Review → System Update`

### 3. Activity Management
Company event organization with:
- Multiple activity types (running, walking, fitness, team building)
- Registration management with capacity limits
- Automatic status transitions (Open → Closed → Ongoing → Completed)
- Result tracking and ranking

### 4. Point & Reward System
Comprehensive gamification system:
- **Monthly Grants** - Automated position-based point allocation
- **Manager Rewards** - Discretionary team rewards
- **Activity Points** - Performance-based bonuses
- **Cash Redemption** - Point-to-money conversion (1 point = 2,000 VND)
- **Complete Audit Trail** - Full transaction history

## 🤖 Automated Processes

The system includes scheduled jobs for automation:

| Task | Schedule | Purpose |
|------|----------|---------|
| Monthly Point Distribution | 14th, 11:13 AM | Grant points to all employees |
| Manager Allocation | 14th, 12:44 AM | Allocate reward budget to managers |
| Activity Status Update | Daily, 12:00 AM | Update activity lifecycle statuses |
| Salary Generation | 15th, 8:48 AM | Generate monthly payroll |

## 🔒 Security Features

- **JWT Token Authentication** - Secure API access
- **Role-Based Authorization** - Granular permission control
- **Password Encryption** - BCrypt hashing
- **SQL Injection Protection** - JPA parameterized queries
- **XSS Protection** - Input sanitization
- **CORS Configuration** - Cross-origin security
- **Secure File Upload** - S3 with access controls

## 📦 Data Management

### Import/Export Capabilities

**Excel Import:**
- Employee bulk import (40+ fields)
- Activity result import with rankings
- Template-based data validation

**Excel Export:**
- Complete employee roster export
- Customizable field selection
- Vietnamese language mapping

## 🚀 Getting Started

### Prerequisites
- Java 22+
- Node.js 16+
- MySQL 8.0+ / PostgreSQL 13+
- Maven 3.8+
- AWS Account (for S3)

### Quick Start

**Backend:**
```bash
cd BE
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd FE/CSC12005
npm install
npm start
```

**Default Access:**
- Admin: `admin@company.com`
- CEO: `ceo@company.com`
- Password: Check `application.properties` → `app.password-default`

## 📊 Database Schema Overview

**Core Entities:**
- Employees & Positions & Departments
- Requests (Leave, Timesheet, WFH)
- Activities & Activity Details
- Point Histories & Point Exchanges
- Timesheets & Attendance Summaries
- Salaries

**Relationships:**
- Employee ↔ Department (Many-to-One)
- Employee ↔ Position (Many-to-One)
- Employee ↔ Manager (Self-referencing)
- Request ↔ Employee (Many-to-One)
- Activity ↔ ActivityDetail ↔ Employee (Many-to-Many)

## 🎓 Use Cases

This system is suitable for:
- **Small to Medium Enterprises** - Complete HR management solution
- **Educational Institutions** - Course project demonstrating enterprise patterns
- **Startups** - Rapid HR infrastructure deployment
- **Learning & Development** - Study modern full-stack architecture

## 📈 Performance Optimizations

- **Lazy Loading** - Hibernate lazy fetch for related entities
- **Caching** - Spring Cache for frequently accessed data
- **Pagination** - Efficient data retrieval with Page/Pageable
- **Query Optimization** - Custom JPQL with fetch joins
- **DTO Projections** - Reduce data transfer overhead

## 🔄 Future Enhancements

- Real-time notifications (WebSocket)
- Mobile application (React Native)
- Advanced analytics dashboard
- Document management system
- Performance review module
- Recruitment & onboarding workflow

## 📝 License

This project is part of CSC12005 course assignment.

## 👥 Contributors

- **Repository**: [vuden2605/CSC12005](https://github.com/vuden2605/CSC12005)
- **Languages**: JavaScript (50.6%), Java (33.3%), SCSS (16.1%)

---

**Built with Spring Boot, React, and modern enterprise patterns**