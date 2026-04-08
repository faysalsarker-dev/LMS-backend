import mongoose from 'mongoose';
import app from './app';
import config from './app/config/config';
import { Server } from "http";


let server: Server;

const main = async () =>  {
  try {
    await mongoose.connect(config.database_url);
    
    console.log('✅ MongoDB connected');




    server =  app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed', error);
    process.exit(1);
  }
};

main();
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Gracefully shutting down...");
    if (server) {
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
})

process.on("SIGINT", () => {
    console.log("SIGINT signal received. Gracefully shutting down...");
    if (server) {
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})
