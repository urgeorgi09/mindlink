# MindLink+ - Optimized Mental Health Platform

## 🎯 Core Features (5 Essential Functions)

### 1. 📊 Mood Tracker (`/mood`)
- Track daily mood, energy, and anxiety levels
- Visual history and trends
- Local data storage

### 2. 📖 Digital Journal (`/journal`)
- Write categorized journal entries
- Search functionality
- Word count tracking
- Multiple categories (Personal, Gratitude, Goals, Reflection)

### 3. 🩺 Therapist System (`/therapist`)
- Role-based access (therapist/admin only)
- Patient management
- Session notes
- Patient progress tracking

### 4. 📈 Analytics (`/analytics`)
- Mood trend analysis
- Journal statistics
- Activity overview
- Progress visualization

### 5. 🔒 Privacy & Security (`/privacy`)
- Data export (GDPR compliance)
- Data deletion
- Privacy information
- Local storage management

## 🚀 Technical Stack

- **Frontend**: React 18, React Router
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT tokens
- **Data Storage**: Local storage + MongoDB
- **Security**: Encrypted data, GDPR compliant

## 📁 Project Structure

```
frontend/src/
├── components/
│   └── Navigation.jsx          # Main navigation
├── pages/
│   ├── Home.jsx               # Landing page
│   ├── Login.jsx              # Authentication
│   ├── Register.jsx           # User registration
│   ├── MoodTracker.jsx        # Mood tracking
│   ├── Journal.jsx            # Digital journal
│   ├── TherapistSystem.jsx    # Therapist dashboard
│   ├── Analytics.jsx          # Data analytics
│   └── Privacy.jsx            # Privacy controls
├── context/
│   └── AnonymousContext.jsx   # User context
└── App.jsx                    # Main app component
```

## 🔧 Setup Instructions

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   node src/server-optimized.js
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database:**
   - MongoDB connection configured in `.env`
   - Automatic user role management

## 👥 User Roles

- **User**: Access to mood tracking, journal, analytics, privacy
- **Therapist**: Additional access to patient management system
- **Admin**: Full system access

## 🏆 Competition Ready

- ✅ Clean, maintainable code
- ✅ No AI dependencies (as requested)
- ✅ 5 core features that work perfectly
- ✅ Professional UI/UX
- ✅ Proper database integration
- ✅ Security and privacy focused
- ✅ GDPR compliant
- ✅ Role-based access control

## 🎨 Design Principles

- **Simplicity**: Clean, intuitive interface
- **Performance**: Optimized for speed
- **Accessibility**: User-friendly design
- **Security**: Privacy-first approach
- **Scalability**: Well-structured codebase

---

**Ready for competition! 🏆**