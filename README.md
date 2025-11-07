# Sentiment Analysis Dashboard

A simple web application that **analyzes text to detect sentiment** (positive, neutral, or negative) and extracts key phrases, using **Microsoft Azure Cognitive Services**. All results are stored in **Azure Cosmos DB** and can be viewed later.

This project is designed for **anyone curious about understanding text feedback**, whether from customers, social media, or reviews. You don’t need prior coding knowledge to get the idea!

---

## 🌟 Features

- Analyze the **sentiment** of text messages or feedback.
- Extract **key phrases** (important words) from the text.
- Store all results in **Azure Cosmos DB** for future analysis.
- Display recent analyses via a simple API.
- Easy to extend with a frontend for live dashboards.

---

## 💻 How It Works

1. User submits a text snippet to the app.
2. Azure **Text Analytics** processes the text:
   - Determines if it’s **positive, neutral, or negative**.
   - Finds the most important **keywords/phrases**.
3. Results are stored in **Cosmos DB**, a cloud database.
4. Users can fetch recent analyses to see trends.

This setup allows businesses or developers to quickly **track customer feedback, product reviews, or social media comments** in a structured way.

---

## 🛠️ Technologies Used

- **Azure Cognitive Services Text Analytics** – for sentiment and key phrases.
- **Azure Cosmos DB (NoSQL)** – to store results.
- **Node.js & Express.js** – backend API.
- **Optional React.js frontend** – for dashboard view.

---

## 🚀 How to Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/pthakur17-trial/SentimentDashboard.git
