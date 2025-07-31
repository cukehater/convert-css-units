# Covert CSS Units

Easily convert CSS px values to responsive units with keyboard shortcuts and smart conversion

## ✨ Key Features

- One-click conversion of px values to responsive units (rem, em, vw, vh, vmin, vmax, cqw, cqh)
- Keyboard shortcut for quick conversion
- Configurable base values for accurate conversions
- Smart conversion with customizable parameters
- Support for multiple responsive unit types

## 💎 Supported Unit Conversions

- **Relative Units**: `px` → `rem`, `em`
- **Viewport Units**: `px` → `vw`, `vh`, `vmin`, `vmax`
- **Container Units**: `px` → `cqw`, `cqh`

## ⌨️ Default Keyboard Shortcuts

| Operating System | Shortcut  |
| ---------------- | --------- |
| Windows, Linux   | `Alt + Z` |
| Mac              | `Alt + Z` |

## ⚙️ Configuration

Customize the extension in your VSCode `settings.json`

```json
{
  "convertCSSUnits.unit": "rem",
  "convertCSSUnits.baseFontSize": 16,
  "convertCSSUnits.baseWidth": 1920,
  "convertCSSUnits.baseHeight": 1080
}
```

### Settings Reference

| Option                         | Description                               | Default |
| ------------------------------ | ----------------------------------------- | ------- |
| `convertCSSUnits.unit`         | Target unit for conversion                | `rem`   |
| `convertCSSUnits.baseFontSize` | Base font size for em/rem conversion (px) | `16`    |
| `convertCSSUnits.baseWidth`    | Base width for vw/cqw conversion (px)     | `1920`  |
| `convertCSSUnits.baseHeight`   | Base height for vh/cqh conversion (px)    | `1080`  |

## 🌈 Usage

1. **Select px value** in your CSS file
2. **Press `Alt + Z`** to convert to the configured unit
3. **Use commands** to change conversion settings:
   - `Covert CSS Units: Set Unit`
   - `Covert CSS Units: Set Base Font Size (px)`
   - `Covert CSS Units: Set Base Width (px)`
   - `Covert CSS Units: Set Base Height (px)`

## 🔧 Commands

| Command                                 | Description                        |
| --------------------------------------- | ---------------------------------- |
| `Covert CSS Units: Convert Selected px` | Convert selected px to target unit |
| `Covert CSS Units: Set Unit`            | Change target conversion unit      |
| `Covert CSS Units: Set Base Font Size`  | Configure base font size           |
| `Covert CSS Units: Set Base Width`      | Configure base width               |
| `Covert CSS Units: Set Base Height`     | Configure base height              |

## 📝 Examples

### Before Conversion

```css
.container {
  width: 320px;
  height: 240px;
  font-size: 16px;
  margin: 20px;
}
```

### After Conversion (to rem with base 16px)

```css
.container {
  width: 20rem;
  height: 15rem;
  font-size: 1rem;
  margin: 1.25rem;
}
```

### After Conversion (to vw with base 1920px)

```css
.container {
  width: 16.67vw;
  height: 12.5vw;
  font-size: 0.83vw;
  margin: 1.04vw;
}
```
