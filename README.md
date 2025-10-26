# Blazor FluentUI MaskedTextField

A Blazor component wrapping Fluent UI [Text Field](https://fluentui-blazor.azurewebsites.net/TextField) and using [IMask.js](https://imask.js.org) for input masking.

Created with help of Microsoft Copilot in Visual Studio and Anthropic Claude Haiku 4.5 AI model.

## ⚡ Note on FluentUI Blazor v5

**FluentUI Blazor v5** has introduced a `MaskedPattern` parameter to the `FluentTextField` component. See [TextInput Masked Input Docs](https://fluentui-blazor-v5.azurewebsites.net/TextInput#masked-input) for details.

This `FluentMaskedTextField` component provides an alternative with IMask.js integration.

## 📚 Documentation

- [FluentMaskedTextField Component Documentation](src/Components/FluentMaskedTextField.md) - Complete component guide with usage examples, parameters, and advanced options.

## 🧪 Demo Page

Run the project for a demo that includes:

- **Basic Masking** - Common patterns without validation
- **FluentValidation Integration** - Form with full validation
- **Advanced Options** - Complex IMask.js configurations
- **Event Handlers** - Real-time event logging
- **Multiple Examples** - Phone, SSN, credit card, dates, times, IP addresses
