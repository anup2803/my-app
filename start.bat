@echo off
echo 🚀 Starting POS System...

echo 📦 Installing dependencies...
cd backend
call npm install
cd ..

cd frontend
call npm install
cd ..

echo 🗄️ Setting up database...
cd backend
call npx prisma generate
call npx prisma migrate dev --name init
call npm run seed
cd ..

echo 🚀 Starting servers...

REM Start backend in background
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 5 /nobreak > nul

REM Start frontend
start "Frontend Server" cmd /k "cd frontend && npm start"

echo ✅ POS System is starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:5000
echo 📊 Prisma Studio: http://localhost:5555

pause 