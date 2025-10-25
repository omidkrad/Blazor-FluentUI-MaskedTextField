# FluentMaskedTextField Component

A comprehensive Blazor component for masked text input built on FluentUI TextField with IMask.js integration and FluentValidation support.

## 📋 Overview

The `FluentMaskedTextField` component provides:

✅ **IMask.js Integration** - Client-side input masking via CDN  
✅ **FluentUI Compatible** - Based on FluentUI Blazor TextField  
✅ **FluentValidation Support** - Integrates seamlessly with form validation  
✅ **EditForm Integration** - Works with Blazor's EditForm and EditContext  
✅ **Event Callbacks** - OnInput, OnChange, OnFocus, OnBlur events  
✅ **Flexible Mask Patterns** - Support for all IMask.js mask options

## 🚀 Quick Start

### Basic Usage

```razor
<FluentMaskedTextField 
    Label="Phone Number"
    Placeholder="Enter phone number"
    Mask="+1 (000) 000-0000"
    @bind-Value="phoneNumber" />

@code {
    private string? phoneNumber;
}
```

### Common Mask Patterns

| Pattern | Mask | Example |
|---------|------|---------|
| Phone | `+1 (000) 000-0000` | +1 (555) 123-4567 |
| SSN | `000-00-0000` | 123-45-6789 |
| Credit Card | `0000 0000 0000 0000` | 4532 1234 5678 9010 |
| Date (MM/DD/YYYY) | `00/00/0000` | 12/25/2024 |
| Date (DD/MM/YYYY) | `00/00/0000` | 25/12/2024 |
| ZIP Code | `00000` | 12345 |
| ZIP+4 | `00000-0000` | 12345-6789 |
| Time (HH:MM) | `00:00` | 14:30 |
| Time (HH:MM:SS) | `00:00:00` | 14:30:45 |
| IP Address | `000.000.000.000` | 192.168.1.1 |
| Currency | `$0,000.00` | $1,234.56 |

**Note:** Use `0` for required digit and `9` for optional digit in masks.

## 📦 Installation

The component requires:

- **Blazored.FluentValidation** (added to FluentMaskedTextField)
- **FluentValidation** package
- **IMask.js** (via CDN - https://unpkg.com/imask?module)
- **FluentUI Blazor** (existing dependency)

## 🔧 Parameters

### Basic Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Id` | `string` | null | Unique identifier for form binding |
| `Value` | `string` | null | Input field value |
| `Label` | `string` | null | Field label |
| `Placeholder` | `string` | null | Placeholder text |
| `Mask` | `string` | null | IMask pattern or JSON options |
| `Disabled` | `bool` | false | Disable the field |
| `ReadOnly` | `bool` | false | Make field read-only |
| `Required` | `bool` | false | Mark as required |
| `Autocomplete` | `bool` | true | Enable browser autocomplete |
| `Style` | `string` | null | Custom CSS styles |
| `Class` | `string` | null | Custom CSS classes |

### Event Callbacks

| Callback | Signature | Description |
|----------|-----------|-------------|
| `ValueChanged` | `EventCallback<string?>` | Fires when value changes |
| `OnInput` | `EventCallback<string?>` | Fires on input (before validation) |
| `OnChange` | `EventCallback<string?>` | Fires on change (after input complete) |
| `OnFocus` | `EventCallback` | Fires when field gains focus |
| `OnBlur` | `EventCallback` | Fires when field loses focus |

## 📝 Usage Examples

### Example 1: Basic Masking (No Validation)

```razor
<FluentMaskedTextField 
    Label="Phone Number"
    Mask="+1 (000) 000-0000"
    @bind-Value="phoneNumber" />

<FluentMaskedTextField 
    Label="Social Security Number"
    Mask="000-00-0000"
    @bind-Value="ssn" />

@code {
private string? phoneNumber;
    private string? ssn;
}
```

### Example 2: With FluentValidation

```razor
<EditForm Model="@model" OnValidSubmit="HandleSubmit">
    <FluentValidationValidator />

    <FluentMaskedTextField 
        Id="PhoneNumber"
        Label="Phone Number *"
        Mask="+1 (000) 000-0000"
        @bind-Value="model.PhoneNumber"
        Required="true" />
    <FluentValidationMessage For="@(() => model.PhoneNumber)" />

    <FluentMaskedTextField 
        Id="SSN"
        Label="SSN *"
        Mask="000-00-0000"
        @bind-Value="model.SSN"
        Required="true" />
    <FluentValidationMessage For="@(() => model.SSN)" />

    <button type="submit">Submit</button>
</EditForm>

@code {
    private ContactForm model = new();

    public class ContactForm
    {
        public string? PhoneNumber { get; set; }
        public string? SSN { get; set; }
    }

    public class ContactFormValidator : AbstractValidator<ContactForm>
    {
        public ContactFormValidator()
        {
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .Matches(@"^\+1 \(\d{3}\) \d{3}-\d{4}$");

            RuleFor(x => x.SSN)
                .NotEmpty()
                .Matches(@"^\d{3}-\d{2}-\d{4}$");
        }
    }

    private void HandleSubmit()
    {
        // Form is valid
    }
}
```

### Example 3: Advanced IMask Options (JSON)

```razor
<!-- Currency with custom options -->
<FluentMaskedTextField 
    Label="Amount"
    Mask="{\"mask\": \"$num\", \"blocks\": {\"num\": {\"mask\": \"Number\", \"thousandsSeparator\": \",\"}}}"
    @bind-Value="currencyValue" />

<!-- Lazy masking (only shows mask as you type) -->
<FluentMaskedTextField 
    Label="Card Number"
    Mask="{\"mask\": \"0000 0000 0000 0000\", \"lazy\": true}"
    @bind-Value="cardNumber" />

<!-- Flexible phone pattern -->
<FluentMaskedTextField 
    Label="Phone (Flexible)"
    Mask="{\"mask\": \"(000) 000-0000\", \"lazy\": false}"
    @bind-Value="flexiblePhone" />

@code {
    private string? currencyValue;
    private string? cardNumber;
    private string? flexiblePhone;
}
```

### Example 4: Event Handling

```razor
<FluentMaskedTextField 
    Label="Monitor Events"
    Mask="+1 (000) 000-0000"
    @bind-Value="phoneValue"
    OnFocus="HandleFocus"
    OnBlur="HandleBlur"
    OnInput="HandleInput"
    OnChange="HandleChange" />

<div>
    @if (!string.IsNullOrEmpty(lastEvent))
    {
        <p>Last event: @lastEvent</p>
    }
</div>

@code {
    private string? phoneValue;
    private string lastEvent = "";

    private async Task HandleFocus()
    {
        lastEvent = $"Focus: {DateTime.Now:HH:mm:ss}";
        await Task.Delay(50);
        StateHasChanged();
    }

    private async Task HandleBlur()
    {
        lastEvent = $"Blur: {DateTime.Now:HH:mm:ss}";
        await Task.Delay(50);
        StateHasChanged();
    }

    private async Task HandleInput(string? value)
    {
        lastEvent = $"Input: {value}";
        await Task.Delay(50);
        StateHasChanged();
    }

    private async Task HandleChange(string? value)
    {
        lastEvent = $"Change: {value}";
        await Task.Delay(50);
        StateHasChanged();
    }
}
```

## 🎨 Advanced IMask.js Options

The `Mask` parameter supports both simple strings and complex JSON options for IMask.js.

### Simple Patterns
```razor
<!-- Simple mask string -->
<FluentMaskedTextField Mask="000-00-0000" @bind-Value="value" />
```

### Complex Options (JSON)
```razor
<!-- Currency example -->
<FluentMaskedTextField 
    Mask="{\"mask\": \"$num\", \"blocks\": {\"num\": {\"mask\": \"Number\", \"thousandsSeparator\": \",\"}}}"
    @bind-Value="value" />

<!-- With lazy loading -->
<FluentMaskedTextField 
    Mask="{\"mask\": \"0000 0000 0000 0000\", \"lazy\": true}"
    @bind-Value="value" />

<!-- With placeholderChar -->
<FluentMaskedTextField 
    Mask="{\"mask\": \"(000) 000-0000\", \"placeholderChar\": \"_\"}"
    @bind-Value="value" />

<!-- Regex pattern -->
<FluentMaskedTextField 
    Mask="{\"mask\": /^[a-zA-Z0-9]*$/}"
    @bind-Value="value" />
```

**Tip:** In C# code, use raw string syntax for cleaner JSON strings:

```csharp
// Example in code-behind
private string maskOptions = """
{
  "mask": "(000) 000-0000",
  "placeholderChar": "_"
}
""";
```

For complete IMask.js options documentation, visit: [IMask.js Docs](https://imask.js.org/)

## ✅ Form Integration

### With EditForm

The component works seamlessly with Blazor's `EditForm`:

```razor
<EditForm Model="@formModel" OnValidSubmit="Submit">
    <DataAnnotationsValidator />
    
    <FluentMaskedTextField 
        Id="PhoneNumber"
        Label="Phone"
        Mask="+1 (000) 000-0000"
        @bind-Value="formModel.PhoneNumber" />
    <ValidationMessage For="@(() => formModel.PhoneNumber)" />
 
    <button type="submit">Submit</button>
</EditForm>

@code {
    private MyModel formModel = new();
    
    private void Submit()
    {
        // Handle form submission
    }
}
```

### With FluentValidation

```razor
<EditForm Model="@model" OnValidSubmit="Submit">
    <FluentValidationValidator />
    
    <FluentMaskedTextField 
        Id="PhoneNumber"
        Label="Phone"
        Mask="+1 (000) 000-0000"
       @bind-Value="model.PhoneNumber"
        Required="true" />
    <FluentValidationMessage For="@(() => model.PhoneNumber)" />
    
    <button type="submit">Submit</button>
</EditForm>

@code {
    private Model model = new();
    
    public class Model
    {
        public string? PhoneNumber { get; set; }
    }
    
    public class ModelValidator : AbstractValidator<Model>
    {
        public ModelValidator()
        {
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .Matches(@"^\+1 \(\d{3}\) \d{3}-\d{4}$");
        }
    }
    
    private void Submit()
    {
        // Handle form submission
    }
}
```

## 📂 File Structure

```
FluentMaskedTextField/
├── Components/
│   └── FluentMaskedTextField.razor          # Main component
├── Pages/Samples/
│   ├── MaskedTextFieldDemo.razor            # Demo page
│   └── MaskedTextFieldDemo.razor.cs         # Demo code-behind
└── wwwroot/js/
    └── masking.js      # IMask.js integration module
```

## 🔗 Dependencies

- **Microsoft.FluentUI.AspNetCore.Components** - FluentUI Blazor components
- **Blazored.FluentValidation** - FluentValidation integration for Blazor
- **FluentValidation** - Validation rules engine
- **IMask.js** (CDN) - Client-side input masking library

## 🐛 Troubleshooting

### Mask not applying?
- Ensure the mask is properly formatted (use `0` for digits, not `9`)
- Check browser console for JavaScript errors
- Verify IMask.js CDN is loading

### Validation not working?
- Ensure `EditForm` wraps the component
- Use `FluentValidationValidator` in the form
- Ensure the model property name matches the `Id` parameter

### Value not updating?
- Use `@bind-Value` for two-way binding
- Check that `ValueChanged` callback is properly wired

## 📄 License

MIT License. For more details, see [LICENSE](../../license.md) file.

---

**Version:** 1.0.0
