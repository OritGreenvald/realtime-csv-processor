# realtime-csv-processor
A full-stack system for uploading and processing CSV files with real-time progress updates, job queue management, and downloadable error reports.

Built with:

- React + TypeScript (Frontend)
- Node.js + Express + TypeScript (Backend)
- MongoDB (Database)
- Socket.IO (Real-time updates)
- Mongoose (ODM)

---

## 🚀 Features

### Core Functionality
- Upload CSV files
- Process rows asynchronously
- Store valid customers in database
- Track job status and progress
- View job history
- View detailed job results

### Bonus Features

✅ Bonus 1 — Real-Time Progress  
Live updates using Socket.IO (no manual refresh)

✅ Bonus 2 — Job Queue System  
Sequential job processing using Redis + Bull

✅ Bonus 3 — Downloadable Error Report  
Download CSV with failed rows and error details

the CSV file is in server/src/uploads

setUP

git clone https://github.com/OritGreenvald/realtime-csv-processor.git
mongodb://127.0.0.1:27017/csv_jobs


▶️ Running the Application
Start Backend
cd server
npx ts-node server.ts
http://localhost:3000

Start Frontend
cd client
npm start
