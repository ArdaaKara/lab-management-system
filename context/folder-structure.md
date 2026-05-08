clms/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
│
├── nginx/
│   ├── nginx.conf
│   └── certs/
│
├── scripts/
│   ├── hardware-sync.bat
│   └── hardware-sync.sh
│
├── context/
│   └── folder-structure.md
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── clms/
│       │   │           ├── ClmsApplication.java
│       │   │           │
│       │   │           ├── auth/
│       │   │           │   ├── controller/
│       │   │           │   │   └── AuthController.java
│       │   │           │   ├── dto/
│       │   │           │   │   ├── LoginRequest.java
│       │   │           │   │   ├── LoginResponse.java
│       │   │           │   │   └── RefreshRequest.java
│       │   │           │   ├── entity/
│       │   │           │   │   └── RefreshToken.java
│       │   │           │   ├── mapper/
│       │   │           │   │   └── AuthMapper.java
│       │   │           │   ├── repository/
│       │   │           │   │   └── RefreshTokenRepository.java
│       │   │           │   └── service/
│       │   │           │       ├── AuthService.java
│       │   │           │       └── JwtService.java
│       │   │           │
│       │   │           ├── user/
│       │   │           │   ├── controller/
│       │   │           │   │   └── UserController.java
│       │   │           │   ├── dto/
│       │   │           │   │   ├── CreateUserRequest.java
│       │   │           │   │   ├── UpdateUserRequest.java
│       │   │           │   │   └── UserResponse.java
│       │   │           │   ├── entity/
│       │   │           │   │   ├── Role.java
│       │   │           │   │   └── User.java
│       │   │           │   ├── mapper/
│       │   │           │   │   └── UserMapper.java
│       │   │           │   ├── repository/
│       │   │           │   │   ├── RoleRepository.java
│       │   │           │   │   └── UserRepository.java
│       │   │           │   └── service/
│       │   │           │       └── UserService.java
│       │   │           │
│       │   │           ├── lab/
│       │   │           │   ├── controller/
│       │   │           │   │   └── LabController.java
│       │   │           │   ├── dto/
│       │   │           │   │   ├── AssignUserRequest.java
│       │   │           │   │   ├── CreateLabRequest.java
│       │   │           │   │   ├── LabResponse.java
│       │   │           │   │   └── UpdateLabRequest.java
│       │   │           │   ├── entity/
│       │   │           │   │   ├── Lab.java
│       │   │           │   │   └── LabAssignment.java
│       │   │           │   ├── mapper/
│       │   │           │   │   └── LabMapper.java
│       │   │           │   ├── repository/
│       │   │           │   │   ├── LabAssignmentRepository.java
│       │   │           │   │   └── LabRepository.java
│       │   │           │   └── service/
│       │   │           │       └── LabService.java
│       │   │           │
│       │   │           ├── computer/
│       │   │           │   ├── controller/
│       │   │           │   │   ├── ComputerController.java
│       │   │           │   │   └── HardwareSyncController.java
│       │   │           │   ├── dto/
│       │   │           │   │   ├── ComputerGridResponse.java
│       │   │           │   │   ├── ComputerResponse.java
│       │   │           │   │   ├── CreateComputerRequest.java
│       │   │           │   │   ├── HardwareSyncRequest.java
│       │   │           │   │   ├── HardwareSpecs.java
│       │   │           │   │   └── UpdateComputerRequest.java
│       │   │           │   ├── entity/
│       │   │           │   │   └── Computer.java
│       │   │           │   ├── mapper/
│       │   │           │   │   └── ComputerMapper.java
│       │   │           │   ├── repository/
│       │   │           │   │   └── ComputerRepository.java
│       │   │           │   └── service/
│       │   │           │       ├── ComputerService.java
│       │   │           │       ├── HardwareSyncService.java
│       │   │           │       └── QrCodeService.java
│       │   │           │
│       │   │           ├── issue/
│       │   │           │   ├── controller/
│       │   │           │   │   └── IssueController.java
│       │   │           │   ├── dto/
│       │   │           │   │   ├── CreateIssueRequest.java
│       │   │           │   │   ├── IssueHistoryResponse.java
│       │   │           │   │   ├── IssueResponse.java
│       │   │           │   │   ├── RejectIssueRequest.java
│       │   │           │   │   └── UpdateIssueRequest.java
│       │   │           │   ├── entity/
│       │   │           │   │   ├── Issue.java
│       │   │           │   │   └── IssueHistory.java
│       │   │           │   ├── mapper/
│       │   │           │   │   └── IssueMapper.java
│       │   │           │   ├── repository/
│       │   │           │   │   ├── IssueHistoryRepository.java
│       │   │           │   │   └── IssueRepository.java
│       │   │           │   └── service/
│       │   │           │       └── IssueService.java
│       │   │           │
│       │   │           ├── analytics/
│       │   │           │   ├── controller/
│       │   │           │   │   └── AnalyticsController.java
│       │   │           │   ├── dto/
│       │   │           │   │   ├── LabSummaryResponse.java
│       │   │           │   │   └── TopFaultyComputer.java
│       │   │           │   └── service/
│       │   │           │       └── AnalyticsService.java
│       │   │           │
│       │   │           └── common/
│       │   │               ├── advice/
│       │   │               │   └── GlobalExceptionHandler.java
│       │   │               ├── config/
│       │   │               │   ├── Bucket4jConfig.java
│       │   │               │   ├── JacksonConfig.java
│       │   │               │   ├── OpenApiConfig.java
│       │   │               │   └── SecurityConfig.java
│       │   │               ├── dto/
│       │   │               │   └── ApiResponse.java
│       │   │               ├── exception/
│       │   │               │   ├── AppException.java
│       │   │               │   ├── ConflictException.java
│       │   │               │   ├── RateLimitException.java
│       │   │               │   ├── ResourceNotFoundException.java
│       │   │               │   └── UnauthorizedException.java
│       │   │               ├── security/
│       │   │               │   ├── ClmsUserDetails.java
│       │   │               │   ├── ClmsUserDetailsService.java
│       │   │               │   ├── JwtAuthenticationFilter.java
│       │   │               │   └── LabApiKeyAuthFilter.java
│       │   │               └── util/
│       │   │                   ├── IpUtil.java
│       │   │                   └── ValidationUtil.java
│       │   │
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       ├── application-prod.yml
│       │       └── db/
│       │           └── migration/
│       │               ├── V1__init_schema.sql
│       │               └── V2__seed_roles_and_admin.sql
│       │
│       └── test/
│           └── java/
│               └── com/
│                   └── clms/
│                       ├── auth/
│                       │   └── service/
│                       │       └── AuthServiceTest.java
│                       ├── computer/
│                       │   └── service/
│                       │       ├── ComputerServiceTest.java
│                       │       └── HardwareSyncServiceTest.java
│                       ├── issue/
│                       │   └── service/
│                       │       └── IssueServiceTest.java
│                       ├── lab/
│                       │   └── service/
│                       │       └── LabServiceTest.java
│                       └── integration/
│                           ├── AuthIntegrationTest.java
│                           ├── HardwareSyncIntegrationTest.java
│                           └── IssueFlowIntegrationTest.java
│
└── frontend/
    ├── Dockerfile
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── .eslintrc.cjs
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── vite-env.d.ts
        │
        ├── routes/
        │   ├── index.tsx
        │   ├── ProtectedRoute.tsx
        │   ├── auth/
        │   │   └── LoginPage.tsx
        │   ├── dashboard/
        │   │   └── DashboardPage.tsx
        │   ├── labs/
        │   │   ├── LabListPage.tsx
        │   │   └── LabDetailPage.tsx
        │   ├── grid/
        │   │   └── GridPage.tsx
        │   ├── issues/
        │   │   └── IssuesPage.tsx
        │   └── report/
        │       └── PublicReportPage.tsx
        │
        ├── components/
        │   ├── ui/
        │   │   └── (shadcn generated components)
        │   ├── layout/
        │   │   ├── AppShell.tsx
        │   │   ├── Sidebar.tsx
        │   │   └── TopBar.tsx
        │   ├── grid/
        │   │   ├── LabGrid.tsx
        │   │   ├── ComputerCell.tsx
        │   │   ├── ComputerCellMemo.tsx
        │   │   ├── EmptyCell.tsx
        │   │   └── GridLegend.tsx
        │   ├── issues/
        │   │   ├── IssueTable.tsx
        │   │   ├── IssueStatusBadge.tsx
        │   │   ├── IssueFilterBar.tsx
        │   │   └── IssueDetailDrawer.tsx
        │   ├── dashboard/
        │   │   ├── SummaryCards.tsx
        │   │   ├── FaultyComputersChart.tsx
        │   │   └── ResolutionTimeChart.tsx
        │   ├── computer/
        │   │   ├── ComputerDetailSheet.tsx
        │   │   └── HardwareSpecsCard.tsx
        │   └── common/
        │       ├── ErrorBoundary.tsx
        │       ├── LoadingSpinner.tsx
        │       ├── ConfirmDialog.tsx
        │       └── PageTitle.tsx
        │
        ├── stores/
        │   ├── useAuthStore.ts
        │   ├── useLabStore.ts
        │   ├── useComputerStore.ts
        │   └── useIssueStore.ts
        │
        ├── hooks/
        │   ├── useInterval.ts
        │   ├── usePolling.ts
        │   └── useRoleGuard.ts
        │
        ├── services/
        │   ├── axiosInstance.ts
        │   ├── authService.ts
        │   ├── labService.ts
        │   ├── computerService.ts
        │   ├── issueService.ts
        │   └── analyticsService.ts
        │
        ├── types/
        │   ├── auth.types.ts
        │   ├── lab.types.ts
        │   ├── computer.types.ts
        │   ├── issue.types.ts
        │   └── api.types.ts
        │
        └── lib/
            ├── constants.ts
            └── utils.ts
