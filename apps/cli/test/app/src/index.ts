import express from "express";

const app = express();

app.get("/", (_, res) => {
	res.json({ message: "Success!" });
});

app.listen(3000, () => console.log("Running on port 3000."));
