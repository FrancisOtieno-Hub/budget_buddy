# **Budget Buddy – Personal Finance & Budgeting PWA**

![Budget Buddy Logo](./icon.png)

**Budget Buddy** is a modern, simple, and intuitive Progressive Web App (PWA) designed to help users manage personal finances effortlessly. It’s built using **HTML, CSS, and JavaScript**, with offline capabilities and a responsive interface suitable for **both young adults and the elderly**.

---

## **Features**

### Core Features

* Track **Income, Expenses, and Balance** in real-time.
* Add, edit, and delete transactions easily.
* Assign transactions to **categories** (Food, Rent, Utilities, Entertainment, Others).
* **Category-wise pie chart** visualization of spending.
* Monthly budget reset for a fresh start while preserving historical data.
* Color-coded transactions:

  * Green → Income
  * Red → Expenses

### PWA & Offline

* Works offline with a **service worker**.
* Installable on desktop and mobile devices.
* Lightweight and responsive interface.

### User-Friendly Design

* Large, readable fonts.
* Clear and simple layout for elderly-friendly navigation.
* Smooth **animations** for balance updates and new transactions.
* Swipe/delete-friendly buttons for mobile users.

---

## **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/budget-buddy.git
cd budget-buddy
```

2. **Open `index.html` in your browser**
   Or serve it locally with a lightweight HTTP server for full PWA functionality:

```bash
npx serve .
```

3. **Install as PWA**

   * On Chrome/Edge: Click the install icon in the address bar.
   * On mobile: “Add to Home Screen”.

---

## **Usage**

1. **Add a Transaction**

   * Enter a description, amount (use negative numbers for expenses), and category.
   * Click **Add**.

2. **View Transactions**

   * Transactions appear in the list below.
   * Income and expenses are color-coded.
   * Categories are displayed next to each transaction.

3. **View Charts**

   * The pie chart shows spending per category.
   * Balance, income, and expenses are summarized in the top cards.

4. **Delete Transaction**

   * Tap the “x” button next to any transaction to delete it.

5. **Monthly Reset**

   * At the start of each month, the app automatically clears transactions for a fresh budget.

---

## **Technologies Used**

* **HTML5** – Structure and content.
* **CSS3** – Styling, responsive design, and animations.
* **JavaScript (Vanilla)** – Logic, local storage, charts, and PWA functionality.
* **Service Worker** – Offline caching.
* **Canvas API** – Pie chart for category visualization.

---

## **Project Structure**

```
budget-buddy/
│
├── index.html        # Main HTML file
├── style.css         # Stylesheet
├── app.js            # Main JavaScript logic
├── manifest.json     # PWA manifest
├── service-worker.js # Offline caching
├── icon.png          # App icon for PWA
└── README.md         # Project documentation
```

---

## **Future Enhancements**

* Optional **voice input** for adding transactions.
* **High-contrast mode** toggle for accessibility.
* Advanced **monthly budgeting and alerts**.
* Export data as CSV or PDF.

---

## **License**

This project is licensed under the **GNU General Public License (GPL) v3.0** – see [LICENSE](LICENSE) for details.


