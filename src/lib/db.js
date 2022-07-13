import mongoose from "mongoose";

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

mongoose.connection.on("disconnected", () => {
  console.log("disconnected from mongodb");
});

export function connectDatabase() {
  return mongoose.connect(process.env.DATABASE_URI);
}
