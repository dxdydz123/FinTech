# Dark Mode Implementation Guide

## Overview
Dark mode has been successfully implemented across the entire FinTech application using CSS variables and React Context.

## Features
- ✅ System-wide dark mode toggle
- ✅ Persistent theme preference (localStorage)
- ✅ Smooth transitions between themes
- ✅ CSS variable-based theming
- ✅ Toggle button in Navbar
- ✅ All components support dark mode

## How It Works

### 1. Theme Context (`src/context/ThemeContext.jsx`)
- Manages dark mode state globally
- Persists preference to localStorage
- Applies `.dark-mode` class to `<html>` element

### 2. CSS Variables (`src/index.css`)
Two sets of CSS variables defined:
- **Light Mode** (`:root`)
- **Dark Mode** (`.dark-mode`)

Variables include:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary` (backgrounds)
- `--text-primary`, `--text-secondary`, `--text-tertiary` (text colors)
- `--border-color`, `--border-light` (borders)
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` (shadows)
- `--gradient-primary`, `--gradient-bg` (gradients)

### 3. Dark Mode Toggle (`src/components/DarkModeToggle.jsx`)
- Sun/Moon icon toggle button
- Located in Navbar
- Smooth icon transitions

## Usage

### For Users
Click the sun/moon icon in the Navbar to toggle between light and dark modes. Your preference is automatically saved.

### For Developers

#### Using CSS Variables in New Components
```css
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
```

#### Accessing Theme State in Components
```jsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <div>
      <p>Current theme: {isDarkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleDarkMode}>Toggle Theme</button>
    </div>
  );
};
```

## Updated Components

### Layout Components
- ✅ `Navbar.jsx` / `Navbar.css` - Added dark mode toggle, uses CSS variables
- ✅ `Sidebar.jsx` / `Sidebar.css` - Full dark mode support
- ✅ `DashboardLayout.jsx` / `DashboardLayout.css` - Background transitions

### Page Components
All page CSS files use CSS variables for automatic dark mode support:
- Dashboard
- Expenses
- Categories
- Budgets
- Analytics
- Login
- Register

## Color Palette

### Light Mode
- Primary BG: `#ffffff`
- Secondary BG: `#f9fafb`
- Tertiary BG: `#f3f4f6`
- Primary Text: `#111827`
- Secondary Text: `#6b7280`
- Border: `#e5e7eb`

### Dark Mode
- Primary BG: `#1f2937`
- Secondary BG: `#111827`
- Tertiary BG: `#374151`
- Primary Text: `#f9fafb`
- Secondary Text: `#d1d5db`
- Border: `#374151`

## Best Practices

1. **Always use CSS variables** for colors that should change with theme
2. **Keep gradients consistent** - Primary gradient stays the same in both modes
3. **Test both modes** when creating new components
4. **Use semantic variable names** - `--bg-primary` instead of `--white`
5. **Add transitions** for smooth theme switching

## Troubleshooting

### Theme not persisting
- Check localStorage in browser DevTools
- Ensure ThemeProvider wraps entire app in `App.jsx`

### Colors not changing
- Verify CSS variables are used instead of hardcoded colors
- Check if `.dark-mode` class is applied to `<html>` element

### Toggle button not working
- Ensure DarkModeToggle is imported in Navbar
- Check ThemeContext is properly initialized

## Future Enhancements
- System preference detection (prefers-color-scheme)
- Multiple theme options (not just light/dark)
- Per-component theme customization
- Theme preview before applying
