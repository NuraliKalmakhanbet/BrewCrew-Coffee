// menu-data.js - all products of the shop (used by the home, menu, cart and profile pages)

var menuItems = [
    { id: "espresso", name: "Espresso", category: "Coffee", price: 800,
      description: "Rich and intense double shot.", image: "images/espresso-shot.webp", focus: "center" },
    { id: "cappuccino", name: "Cappuccino", category: "Coffee", price: 1100,
      description: "Espresso topped with thick milk foam.", image: "images/cappuccino.webp", focus: "center" },
    { id: "caramel-latte", name: "Caramel Latte", category: "Coffee", price: 1400,
      description: "Iced latte swirled with caramel syrup.", image: "images/caramel-latte.webp", focus: "center 30%" },
    { id: "caramel-oat-latte", name: "Caramel Oat Milk Latte", category: "Coffee", price: 1600,
      description: "Smooth espresso with steamed oat milk and a hint of caramel syrup.", image: "images/caramel-oat-latte.webp", focus: "center 30%" },
    { id: "green-tea", name: "Green Tea", category: "Tea", price: 900,
      description: "Refreshing steamed loose-leaf green tea.", image: "images/green-tea.webp", focus: "center" },
    { id: "iced-matcha", name: "Iced Matcha", category: "Tea", price: 1400,
      description: "Matcha whisked with milk and served over ice.", image: "images/iced-matcha.webp", focus: "center 40%" },
    { id: "honey-iced-matcha", name: "Honey Iced Matcha", category: "Tea", price: 1500,
      description: "Refreshing iced matcha lightly sweetened with natural honey.", image: "images/honey-iced-matcha.webp", focus: "center 45%" },
    { id: "croissant", name: "Croissant", category: "Pastries", price: 700,
      description: "Flaky and buttery French pastry, baked every morning.", image: "images/croissant.webp", focus: "center" },
    { id: "cheesecake", name: "Cheesecake", category: "Pastries", price: 1300,
      description: "Classic New York style slice with a berry topping.", image: "images/cheesecake.webp", focus: "center" },
    { id: "cinnamon-roll", name: "Cinnamon Roll", category: "Pastries", price: 900,
      description: "Warm, freshly baked roll topped with sweet glaze.", image: "images/cinnamon-roll.webp", focus: "center" },
    { id: "morning-energizer", name: "Morning Energizer", category: "Combos", price: 1500,
      description: "Rich espresso shot served with a flaky butter croissant.", image: "images/espresso-shot.webp", focus: "center" },
    { id: "afternoon-relax", name: "Afternoon Relax", category: "Combos", price: 2200,
      description: "Steamed green tea paired with a New York style cheesecake slice.", image: "images/green-tea.webp", focus: "center" },
    { id: "sweet-delight", name: "Sweet Delight", category: "Combos", price: 1900,
      description: "Iced caramel latte paired with a warm cinnamon roll.", image: "images/caramel-latte.webp", focus: "center 30%" }
];

// finds one product by its id
function findItem(id) {
    for (var i = 0; i < menuItems.length; i++) {
        if (menuItems[i].id === id) {
            return menuItems[i];
        }
    }
    return null;
}
