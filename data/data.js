import mongoose from "mongoose";

export const DatabaseConnection = () => {
    mongoose.connect(process.env.DB_URI, { DbName: "CURDAPI" })
        .then(() => console.log(`Database successfully conneted`))
        .catch((err) => console.log(`error while connection ${err}`));
}