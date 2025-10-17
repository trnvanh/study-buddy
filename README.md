# Pomodoggo 📚🐾

A comprehensive productivity application that combines Pomodoro technique with virtual pet companions to make studying engaging and rewarding. Built with React Native (Expo) frontend and Spring Boot backend.

## 🌟 Features

### 📱 Core Functionality
- **Pomodoro Timer**: Customizable study sessions with break intervals
- **Virtual Pet Companions**: Unlock and choose from different buddy pets as motivation
- **Task Scheduling**: Plan and organize your study sessions with time blocks
- **Progress Tracking**: Visualize your productivity with charts and statistics
- **Goal Setting**: Set and track weekly study goals
- **Profile Management**: Customize settings, avatar, and preferences

### 🎨 User Experience
- **Dark/Light Mode**: Adaptive theming support
- **Cross-Platform**: Works on iOS, Android, and Web
- **Responsive Design**: Optimized for different screen sizes
- **Haptic Feedback**: Enhanced mobile experience with vibrations
- **Sound Notifications**: Audio alerts for session completion

### 📊 Analytics & Insights
- **Daily Progress**: Track completed sessions and study hours
- **Weekly Trends**: Visualize productivity patterns with line charts
- **Achievement System**: Unlock new pets based on study hours
- **Session Logging**: Detailed history of all Pomodoro sessions

## 🏗️ Architecture

### Frontend (React Native + Expo)
```
frontend/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── buddy.tsx      # Pet selection screen
│   │   ├── pomodoro.tsx   # Timer functionality
│   │   ├── progress.tsx   # Analytics dashboard
│   │   ├── profile.tsx    # User settings
│   │   └── schedule.tsx   # Task planning
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── assets/               # Images, fonts, sounds
```

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/project/study/
│   ├── controller/        # REST API endpoints
│   ├── service/          # Business logic layer
│   ├── repository/       # Data access layer
│   ├── entities/         # JPA entity models
│   ├── dto/              # Data transfer objects
│   └── config/           # Configuration classes
├── src/main/resources/
│   ├── application.yml   # Application configuration
│   └── static/           # Static file serving
└── Dockerfile            # Container configuration
```

## 🛠️ Technology Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo SDK** - Development tools and native APIs
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation
- **React Native Chart Kit** - Data visualization
- **AsyncStorage** - Local data persistence
- **React Context** - State management

### Backend
- **Spring Boot 3.3.2** - Java web framework
- **Java 17** - Programming language
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Primary database
- **Maven** - Dependency management
- **Docker** - Containerization

### Infrastructure
- **AWS RDS** - Managed PostgreSQL database
- **Docker** - Application containerization
- **GitHub Actions** - CI/CD pipeline
- **AWS ECR** - Container registry

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Java 17**
- **Maven 3.8+**
- **PostgreSQL** (or access to AWS RDS)
- **Expo CLI** (optional, for additional tools)

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint**:
   ```typescript
   // config/constants.ts
   export const API_BASE_URL = 'http://localhost:8080/api';
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on specific platforms**:
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web Browser
   npm run web
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure database connection**:
   ```yaml
   # src/main/resources/application.yml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/studybuddy
       username: your_username
       password: your_password
   ```

3. **Install dependencies and run**:
   ```bash
   # Using Maven
   mvn spring-boot:run
   
   # Or build and run JAR
   mvn clean package
   java -jar target/study-0.0.1-SNAPSHOT.jar
   ```

4. **Access the API**:
   - Base URL: `http://localhost:8080`
   - Health check: `http://localhost:8080/actuator/health`

### Database Setup

1. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE studybuddy;
   ```

2. **Tables are auto-created** via JPA/Hibernate DDL on first run

3. **Optional: Load sample data** (pets, default profiles)

## 🐳 Docker Deployment

### Backend Container
```bash
# Build image
docker build -t study-buddy-backend ./backend

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://your-db:5432/studybuddy \
  -e SPRING_DATASOURCE_USERNAME=username \
  -e SPRING_DATASOURCE_PASSWORD=password \
  study-buddy-backend
```

### Full Stack with Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/studybuddy
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: studybuddy
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📡 API Documentation

### Core Endpoints

#### Profile Management
- `GET /api/profile/{deviceId}` - Get user profile
- `PUT /api/profile/{deviceId}` - Update profile
- `POST /api/profile/{deviceId}/avatar` - Upload avatar

#### Pet System
- `GET /api/pets` - List all pets
- `GET /api/pets/{id}` - Get specific pet
- `POST /api/pets` - Create new pet
- `PUT /api/pets/{id}` - Update pet

#### Task Management
- `GET /api/tasks` - List user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/{id}/toggle` - Toggle task completion

#### Analytics
- `GET /api/stats/progress` - Get progress statistics
- `POST /api/pomodoro_logs/create` - Log completed session

### Response Formats
```json
// Profile Response
{
  "deviceId": "string",
  "pomodoroMinutes": 25,
  "shortBreakMinutes": 5,
  "longBreakMinutes": 15,
  "goalPerWeek": 10,
  "theme": "pink",
  "darkMode": false,
  "shortTermGoal": "Complete React course",
  "longTermGoal": "Become full-stack developer",
  "avatarUrl": "/uploads/avatar.jpg"
}

// Stats Response
{
  "dailyCount": 3,
  "weeklyCount": 12,
  "lastWeekCount": 8,
  "totalHours": 45,
  "weeklyTrend": [2, 1, 3, 2, 4, 0, 0]
}
```

## 🎯 Usage Guide

### Setting Up Your First Session

1. **Create Profile**: Set your study preferences and goals
2. **Choose a Buddy**: Select your motivational pet companion
3. **Plan Tasks**: Schedule your study sessions in the calendar
4. **Start Timer**: Begin a Pomodoro session with your chosen task
5. **Track Progress**: Monitor your achievements and unlock new pets

### Customization Options

- **Timer Intervals**: Adjust Pomodoro, short break, and long break durations
- **Weekly Goals**: Set target number of sessions per week
- **Themes**: Switch between light and dark modes
- **Notifications**: Configure sound and haptic feedback

### Pet Unlock System

Pets are unlocked based on total study hours:
- **Starter pets**: Available immediately
- **Bronze tier**: 10+ hours
- **Silver tier**: 25+ hours  
- **Gold tier**: 50+ hours
- **Platinum tier**: 100+ hours

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Standards

- **Frontend**: ESLint + Prettier configuration
- **Backend**: Spring Boot conventions + Java formatting
- **Commits**: Conventional commit messages
- **Testing**: Unit tests for business logic

### Project Structure Guidelines

- Keep components small and focused
- Use TypeScript for type safety
- Follow REST API conventions
- Implement proper error handling
- Add comprehensive logging

## 📋 Project Status

### Current Version: 1.0.0

### ✅ Completed Features
- ✅ Pomodoro timer with customizable intervals
- ✅ Pet companion system with unlock mechanism
- ✅ Task scheduling and management
- ✅ Progress tracking with charts
- ✅ Profile customization
- ✅ Dark/light theme support
- ✅ Cross-platform mobile app
- ✅ REST API backend
- ✅ Docker containerization

### 🚧 Planned Enhancements
- [ ] Push notifications for session reminders
- [ ] Social features (friend challenges)
- [ ] Advanced analytics (weekly/monthly reports)
- [ ] Integration with calendar apps
- [ ] Streak tracking and badges
- [ ] Data export functionality
- [ ] Offline mode support

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start:**
```bash
# Clear Expo cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Backend connection errors:**
- Verify PostgreSQL is running
- Check database credentials in `application.yml`
- Ensure port 8080 is available

**Mobile app crashes:**
- Check Metro bundler logs
- Verify Expo SDK compatibility
- Clear app data on device

### Performance Optimization

- **Frontend**: Use React.memo for expensive components
- **Backend**: Implement database connection pooling
- **Images**: Optimize asset sizes and use appropriate formats
- **API**: Implement caching for frequently accessed data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Van Tran**
- GitHub: [@trnvanh](https://github.com/trnvanh)

## 🙏 Acknowledgments

- **Pomodoro Technique** by Francesco Cirillo
- **React Native** and **Expo** teams
- **Spring Boot** community
- All contributors and testers

---

## 📞 Support

For support, email tranh800@gmail.com or create an issue in the GitHub repository.

**Happy Studying! 📚✨**