# BrewCrew Coffee

A multi-page responsive website for a student-run coffee shop. Visitors can browse the menu, search and filter drinks, rate them, add them to a cart and place an order. Registered users get a profile page.

## Authors

- **Nurali Kalmakhanbet** — Home (`index.html`), About Us (`about.html`), 404 page (`404.html`)
- **Zhumak Zhalgas** — Menu (`menu.html`), Contact (`contact.html`)
- **Batyrkhan Kanapiya** — Log In (`login.html`), Sign Up (`signup.html`), Cart (`cart.html`)

## Tech Stack & Features

- **Core Components:** Responsive navigation menu with cart counter, product cards, contact form, sign up and log in forms, profile page, and a light/dark mode toggle switch.
- **CSS Selectors & Layout:** Implements Bootstrap 5 grid, flexbox, CSS variables for light and dark themes, hover states, transitions, and responsive media queries on top of custom CSS.
- **JavaScript Features:**
  - Authentication simulation with localStorage (sign up, log in, profile page, log out)
  - Client-side form validation (email, phone, password length and complexity, required fields) with error messages on the page
  - Search, category filter and sorting on the menu; the last search is saved in localStorage
  - Star ratings, shopping cart, promo code `STUDENT15` and order history
  - Theme choice saved in localStorage and kept on every page
  - Animated buttons and UI effects (hover, transitions, scroll fade-in)
- **External APIs:**
  - Sample APIs Coffee: Coffee guide on the menu page
  - Open-Meteo: "Drink of the day" weather card on the home page
  - Both show a loading message and handle errors

## Project Structure

```text
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   ├── menu-data.js
│   ├── shop.js
│   ├── home.js
│   ├── weather.js
│   ├── menu.js
│   ├── guide.js
│   ├── cart.js
│   ├── validation.js
│   ├── auth.js
│   └── contact.js
├── images/
│   ├── hero.jpg
│   ├── menu-hero.jpg
│   ├── nurali.jpg
│   ├── zhalgas.jpg
│   ├── batyrkhan.jpg
│   ├── cappuccino.webp
│   ├── caramel-latte.webp
│   ├── caramel-oat-latte.webp
│   ├── cheesecake.webp
│   ├── cinnamon-roll.webp
│   ├── croissant.webp
│   ├── espresso-shot.webp
│   ├── green-tea.webp
│   ├── honey-iced-matcha.webp
│   └── iced-matcha.webp
├── index.html
├── menu.html
├── cart.html
├── login.html
├── signup.html
├── profile.html
├── about.html
├── contact.html
└── 404.html
```
