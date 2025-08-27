# EnvoInsight AI - Mermaid Diagrams

This document contains comprehensive Mermaid diagrams for the EnvoInsight AI environmental monitoring platform.

## 1. Use Case Diagram

```mermaid
graph TB
    subgraph "EnvoInsight AI System"
        subgraph "Actors"
            Admin[Admin User]
            Manager[Manager User]
            Staff[Staff User]
            Employee[Employee User]
            Sensor[Environmental Sensors]
            AI[AI Analytics Engine]
        end

        subgraph "Core Use Cases"
            UC1[User Authentication]
            UC2[Environmental Monitoring]
            UC3[Alert Management]
            UC4[Data Analytics]
            UC5[User Management]
            UC6[Company Management]
            UC7[Domain Configuration]
            UC8[Plan Management]
            UC9[Historical Data Access]
            UC10[AI Predictions]
            UC11[Threshold Configuration]
            UC12[Real-time Dashboard]
        end

        subgraph "Extended Use Cases"
            UC13[Data Export]
            UC14[Report Generation]
            UC15[System Configuration]
            UC16[Backup & Recovery]
        end
    end

    %% Admin relationships
    Admin --> UC1
    Admin --> UC5
    Admin --> UC6
    Admin --> UC8
    Admin --> UC15
    Admin --> UC16

    %% Manager relationships
    Manager --> UC1
    Manager --> UC2
    Manager --> UC3
    Manager --> UC4
    Manager --> UC5
    Manager --> UC7
    Manager --> UC9
    Manager --> UC11
    Manager --> UC12
    Manager --> UC13
    Manager --> UC14

    %% Staff relationships
    Staff --> UC1
    Staff --> UC2
    Staff --> UC3
    Staff --> UC4
    Staff --> UC9
    Staff --> UC11
    Staff --> UC12
    Staff --> UC13

    %% Employee relationships
    Employee --> UC1
    Employee --> UC2
    Employee --> UC3
    Employee --> UC9
    Employee --> UC12

    %% System relationships
    Sensor --> UC2
    AI --> UC4
    AI --> UC10

    %% Include relationships
    UC2 ..> UC3 : <<include>>
    UC4 ..> UC10 : <<include>>
    UC6 ..> UC7 : <<include>>
    UC6 ..> UC8 : <<include>>

    %% Extend relationships
    UC2 ..> UC11 : <<extend>>
    UC3 ..> UC14 : <<extend>>
    UC4 ..> UC13 : <<extend>>
```

## 2. Class Diagram

```mermaid
classDiagram
    class User {
        +String _id
        +String email
        +String password
        +String role
        +String firstName
        +String lastName
        +String companyId
        +Date createdAt
        +authenticate()
        +updateProfile()
        +changePassword()
    }

    class Company {
        +String _id
        +String companyName
        +ObjectId manager
        +Array employees
        +Array domains
        +ObjectId plan
        +Date createdAt
        +addEmployee()
        +removeEmployee()
        +addDomain()
        +removeDomain()
        +updatePlan()
    }

    class Domain {
        +String _id
        +String name
        +String description
        +String place
        +Object config
        +configureThresholds()
        +updateSettings()
    }

    class Plan {
        +String _id
        +String name
        +Number price
        +String currency
        +String period
        +String description
        +Array features
        +Object limits
        +Boolean isPopular
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
        +activate()
        +deactivate()
    }

    class Alert {
        +String _id
        +ObjectId sensorDataId
        +ObjectId userId
        +String message
        +Date sentAt
        +sendNotification()
        +markAsRead()
    }

    class History {
        +String _id
        +ObjectId userId
        +String deviceId
        +Date timestamp
        +Number temperature
        +Number humidity
        +String domain
        +Object aiPrediction
        +String source
        +saveRecord()
        +getAnalytics()
    }

    class Config {
        +String _id
        +String name
        +Object settings
        +Date updatedAt
        +updateSettings()
        +getConfiguration()
    }

    class SensorData {
        +String _id
        +String deviceId
        +String domainId
        +Number temperature
        +Number humidity
        +Date timestamp
        +String source
        +processData()
        +validateReadings()
    }

    %% Relationships
    User ||--o{ Company : manages
    User ||--o{ Company : works_for
    Company ||--o{ Domain : contains
    Company ||--|| Plan : subscribes_to
    User ||--o{ Alert : receives
    User ||--o{ History : generates
    Domain ||--o{ SensorData : monitors
    SensorData ||--o{ Alert : triggers
    Config ||--o{ Domain : configures
    History ||--o{ SensorData : records
```

## 3. Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant S as Sensors
    participant AI as AI Engine

    %% User Authentication
    U->>F: Login with credentials
    F->>B: POST /api/auth/login
    B->>DB: Validate user credentials
    DB-->>B: User data
    B-->>F: JWT token + user info
    F-->>U: Redirect to dashboard

    %% Environmental Monitoring
    S->>B: Send sensor data
    B->>AI: Process environmental data
    AI-->>B: AI predictions
    B->>DB: Save sensor data + predictions
    B->>B: Check thresholds
    alt Threshold exceeded
        B->>DB: Create alert
        B-->>F: Real-time alert update
        F-->>U: Show notification
    end

    %% Dashboard Data Loading
    U->>F: Access dashboard
    F->>B: GET /api/domain/all
    B->>DB: Fetch user's domains
    DB-->>B: Domain data
    F->>B: GET /api/config
    B->>DB: Fetch configuration
    DB-->>B: Config data
    F->>B: GET historical data
    B->>DB: Fetch sensor history
    DB-->>B: Historical data
    B-->>F: Combined dashboard data
    F-->>U: Render dashboard

    %% Alert Management
    U->>F: View alerts
    F->>B: GET /api/alerts
    B->>DB: Fetch user alerts
    DB-->>B: Alert data
    B-->>F: Alert list
    F-->>U: Display alerts

    %% User Management (Admin)
    U->>F: Manage users
    F->>B: GET /api/users/all
    B->>DB: Fetch all users
    DB-->>B: User list
    B-->>F: User data
    F-->>U: User management interface

    U->>F: Create new user
    F->>B: POST /api/users/create
    B->>DB: Save new user
    DB-->>B: Confirmation
    B-->>F: Success response
    F-->>U: User created notification
```

## 4. Activity Diagram

```mermaid
flowchart TD
    Start([User accesses system]) --> Auth{Authenticated?}
    Auth -->|No| Login[Login/Register]
    Auth -->|Yes| RoleCheck{Check User Role}

    Login --> Validate{Valid credentials?}
    Validate -->|No| Login
    Validate -->|Yes| RoleCheck

    RoleCheck --> Admin[Admin Dashboard]
    RoleCheck --> Manager[Manager Dashboard]
    RoleCheck --> Staff[Staff Dashboard]
    RoleCheck --> Employee[Employee Dashboard]

    %% Admin Activities
    Admin --> AdminMenu{Admin Actions}
    AdminMenu --> UserMgmt[User Management]
    AdminMenu --> CompanyMgmt[Company Management]
    AdminMenu --> PlanMgmt[Plan Management]
    AdminMenu --> SystemConfig[System Configuration]

    UserMgmt --> CreateUser[Create User]
    UserMgmt --> EditUser[Edit User]
    UserMgmt --> DeleteUser[Delete User]
    CreateUser --> AdminMenu
    EditUser --> AdminMenu
    DeleteUser --> AdminMenu

    %% Manager Activities
    Manager --> ManagerMenu{Manager Actions}
    ManagerMenu --> DomainConfig[Domain Configuration]
    ManagerMenu --> EmployeeMgmt[Employee Management]
    ManagerMenu --> Monitoring[Environmental Monitoring]
    ManagerMenu --> AlertMgmt[Alert Management]

    DomainConfig --> SetThresholds[Set Thresholds]
    DomainConfig --> ConfigureSensors[Configure Sensors]
    SetThresholds --> ManagerMenu
    ConfigureSensors --> ManagerMenu

    %% Staff Activities
    Staff --> StaffMenu{Staff Actions}
    StaffMenu --> ViewData[View Environmental Data]
    StaffMenu --> ManageAlerts[Manage Alerts]
    StaffMenu --> GenerateReports[Generate Reports]

    %% Employee Activities
    Employee --> EmployeeMenu{Employee Actions}
    EmployeeMenu --> ViewDashboard[View Dashboard]
    EmployeeMenu --> CheckAlerts[Check Alerts]
    EmployeeMenu --> ViewHistory[View History]

    %% Common Monitoring Flow
    Monitoring --> SensorData[Receive Sensor Data]
    SensorData --> AIProcess[AI Processing]
    AIProcess --> ThresholdCheck{Check Thresholds}
    ThresholdCheck -->|Exceeded| CreateAlert[Create Alert]
    ThresholdCheck -->|Normal| UpdateDashboard[Update Dashboard]
    CreateAlert --> NotifyUsers[Notify Users]
    NotifyUsers --> UpdateDashboard
    UpdateDashboard --> End([End])

    %% Data Flow
    ViewData --> FetchHistory[Fetch Historical Data]
    FetchHistory --> DisplayCharts[Display Charts]
    DisplayCharts --> End

    AlertMgmt --> ViewAlerts[View Alerts]
    ViewAlerts --> ProcessAlert[Process Alert]
    ProcessAlert --> UpdateStatus[Update Alert Status]
    UpdateStatus --> End
```

## 5. State Diagram

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    Unauthenticated --> Authenticating : Login attempt
    Authenticating --> Authenticated : Valid credentials
    Authenticating --> Unauthenticated : Invalid credentials

    Authenticated --> AdminState : Role = Admin
    Authenticated --> ManagerState : Role = Manager
    Authenticated --> StaffState : Role = Staff
    Authenticated --> EmployeeState : Role = Employee

    %% Admin States
    AdminState --> UserManagement : Manage Users
    AdminState --> CompanyManagement : Manage Companies
    AdminState --> PlanManagement : Manage Plans
    AdminState --> SystemSettings : System Configuration

    UserManagement --> AdminState : Back to Admin
    CompanyManagement --> AdminState : Back to Admin
    PlanManagement --> AdminState : Back to Admin
    SystemSettings --> AdminState : Back to Admin

    %% Manager States
    ManagerState --> DomainConfiguration : Configure Domains
    ManagerState --> EmployeeManagement : Manage Employees
    ManagerState --> Monitoring : Environmental Monitoring
    ManagerState --> AlertManagement : Manage Alerts

    DomainConfiguration --> ManagerState : Back to Manager
    EmployeeManagement --> ManagerState : Back to Manager
    Monitoring --> ManagerState : Back to Manager
    AlertManagement --> ManagerState : Back to Manager

    %% Staff States
    StaffState --> DataViewing : View Data
    StaffState --> AlertHandling : Handle Alerts
    StaffState --> ReportGeneration : Generate Reports

    DataViewing --> StaffState : Back to Staff
    AlertHandling --> StaffState : Back to Staff
    ReportGeneration --> StaffState : Back to Staff

    %% Employee States
    EmployeeState --> DashboardView : View Dashboard
    EmployeeState --> AlertChecking : Check Alerts
    EmployeeState --> HistoryViewing : View History

    DashboardView --> EmployeeState : Back to Employee
    AlertChecking --> EmployeeState : Back to Employee
    HistoryViewing --> EmployeeState : Back to Employee

    %% System States
    Monitoring --> NormalOperation : Normal conditions
    Monitoring --> AlertTriggered : Threshold exceeded
    AlertTriggered --> AlertSent : Send notification
    AlertSent --> NormalOperation : Conditions normalized
    AlertSent --> AlertTriggered : Conditions still critical

    %% Logout
    AdminState --> Unauthenticated : Logout
    ManagerState --> Unauthenticated : Logout
    StaffState --> Unauthenticated : Logout
    EmployeeState --> Unauthenticated : Logout
```

## 6. System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser]
        Mobile[Mobile App]
    end

    subgraph "Frontend Layer"
        React[React App]
        Router[React Router]
        State[Zustand Store]
        UI[UI Components]
        Charts[Recharts]
    end

    subgraph "API Gateway"
        Express[Express.js Server]
        Auth[Authentication]
        RateLimit[Rate Limiting]
        CORS[CORS Middleware]
        Validation[Input Validation]
    end

    subgraph "Business Logic Layer"
        Controllers[Controllers]
        Services[Business Services]
        AI[AI Analytics Engine]
        AlertEngine[Alert Engine]
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB)]
        InfluxDB[(InfluxDB)]
        Cache[Redis Cache]
    end

    subgraph "External Services"
        Sensors[Environmental Sensors]
        Email[Email Service]
        SMS[SMS Service]
        AIProvider[AI Provider API]
    end

    subgraph "Infrastructure"
        LoadBalancer[Load Balancer]
        CDN[CDN]
        Monitoring[System Monitoring]
        Logging[Logging Service]
    end

    %% Client to Frontend
    Web --> React
    Mobile --> React

    %% Frontend Internal
    React --> Router
    React --> State
    React --> UI
    React --> Charts

    %% Frontend to API
    React --> Express

    %% API Gateway Internal
    Express --> Auth
    Express --> RateLimit
    Express --> CORS
    Express --> Validation

    %% API to Business Logic
    Express --> Controllers
    Controllers --> Services
    Services --> AI
    Services --> AlertEngine

    %% Business Logic to Data
    Services --> MongoDB
    Services --> InfluxDB
    Services --> Cache

    %% External Integrations
    Sensors --> Express
    Services --> Email
    Services --> SMS
    AI --> AIProvider

    %% Infrastructure
    LoadBalancer --> Express
    CDN --> React
    Monitoring --> Express
    Logging --> Express

    %% Data Flow
    MongoDB -.->|User Data| Controllers
    InfluxDB -.->|Sensor Data| Services
    Cache -.->|Session Data| Auth

    %% Real-time Updates
    Sensors -.->|Real-time| Express
    Express -.->|WebSocket| React
```

## Diagram Descriptions

### 1. Use Case Diagram

Shows the different actors (Admin, Manager, Staff, Employee) and their interactions with the system's core functionalities including environmental monitoring, alert management, user management, and data analytics.

### 2. Class Diagram

Represents the data model showing entities like User, Company, Domain, Plan, Alert, History, Config, and SensorData with their attributes, methods, and relationships.

### 3. Sequence Diagram

Illustrates the interaction flow between system components for key operations like user authentication, environmental monitoring, dashboard data loading, and alert management.

### 4. Activity Diagram

Shows the workflow and decision points for different user roles and system processes, including the environmental monitoring flow and alert generation process.

### 5. State Diagram

Represents the different states the system can be in based on user roles and environmental conditions, showing transitions between states.

### 6. System Architecture Diagram

Provides a comprehensive view of the system's layered architecture, including client layer, frontend, API gateway, business logic, data layer, external services, and infrastructure components.

These diagrams provide a complete visual representation of the EnvoInsight AI system's structure, behavior, and interactions.
